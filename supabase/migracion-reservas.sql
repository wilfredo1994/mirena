-- Mirena: reserva de stock al crear el pedido.
-- Pegar en Supabase > SQL Editor > Run. EJECUTAR UNA SOLA VEZ en un proyecto que ya tenía el schema anterior.

-- 1) Los pedidos pendientes que ya existen pasan a reservar su stock (para que cancelar luego sea coherente)
update products p
set stock = greatest(0, p.stock - s.q)
from (
  select oi.product_id, sum(oi.cantidad) as q
  from order_items oi join orders o on o.id = oi.order_id
  where o.estado = 'pendiente' and oi.product_id is not null
  group by oi.product_id
) s
where p.id = s.product_id;

-- 2) Los clientes ya no insertan directamente: solo pueden usar create_order()
drop policy if exists "cliente crea pedido" on orders;
drop policy if exists "cliente crea detalle" on order_items;

-- 3) Crear pedido: valida y descuenta el stock de forma atómica (bloquea las filas)
create or replace function create_order(p_nombre text, p_telefono text, p_nota text, p_items jsonb)
returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_order uuid := gen_random_uuid();
  v_total numeric := 0;
  v_lineas jsonb := '[]'::jsonb;
  it jsonb;
  prod products%rowtype;
  qty int;
begin
  if coalesce(trim(p_nombre), '') = '' then raise exception 'NOMBRE'; end if;
  if p_items is null or jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) = 0 then
    raise exception 'VACIO';
  end if;

  insert into orders (id, cliente_nombre, cliente_telefono, nota, total, estado)
  values (v_order, left(trim(p_nombre), 80), nullif(left(trim(coalesce(p_telefono, '')), 30), ''),
          nullif(left(trim(coalesce(p_nota, '')), 300), ''), 0, 'pendiente');

  -- Orden fijo por id para evitar bloqueos cruzados entre pedidos simultáneos
  for it in select e from jsonb_array_elements(p_items) e order by e->>'id' loop
    qty := (it->>'cantidad')::int;
    if qty is null or qty < 1 then raise exception 'CANTIDAD'; end if;

    select * into prod from products where id = (it->>'id')::uuid and activo for update;
    if not found then raise exception 'NO_DISPONIBLE'; end if;
    if prod.stock < qty then raise exception 'SIN_STOCK|%|%', prod.nombre, prod.stock; end if;

    update products set stock = stock - qty where id = prod.id;
    insert into order_items (order_id, product_id, nombre, precio, cantidad)
    values (v_order, prod.id, prod.nombre, prod.precio, qty);

    v_total := v_total + prod.precio * qty;
    v_lineas := v_lineas || jsonb_build_object('nombre', prod.nombre, 'precio', prod.precio, 'cantidad', qty);
  end loop;

  update orders set total = v_total where id = v_order;
  return jsonb_build_object('total', v_total, 'lineas', v_lineas);
end $$;

revoke all on function create_order(text, text, text, jsonb) from public;
grant execute on function create_order(text, text, text, jsonb) to anon, authenticated;

-- 4) Confirmar: el stock ya estaba reservado, solo se marca la venta como concretada
create or replace function confirm_order(p_order uuid) returns void
language plpgsql security invoker as $$
begin
  update orders set estado = 'confirmado' where id = p_order and estado = 'pendiente';
  if not found then raise exception 'El pedido ya fue procesado'; end if;
end $$;

-- 5) Cancelar: devuelve el stock reservado
create or replace function cancel_order(p_order uuid) returns void
language plpgsql security invoker as $$
declare
  v_estado text;
begin
  select estado into v_estado from orders where id = p_order for update;
  if v_estado is distinct from 'pendiente' then raise exception 'El pedido ya fue procesado'; end if;

  update products p set stock = p.stock + oi.c
  from (select product_id, sum(cantidad) as c from order_items
        where order_id = p_order and product_id is not null group by product_id) oi
  where oi.product_id = p.id;

  update orders set estado = 'cancelado' where id = p_order;
end $$;
