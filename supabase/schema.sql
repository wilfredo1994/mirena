-- Mirena: esquema de base de datos.
-- Pegar completo en Supabase > SQL Editor > Run.

create extension if not exists "pgcrypto";

create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  slug text not null unique,
  emoji text
);

create table if not exists campaigns (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  slug text not null unique,
  descripcion text,
  inicio date,
  fin date,
  activa boolean not null default true
);

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  descripcion text,
  precio numeric(10,2) not null default 0,
  stock integer not null default 0 check (stock >= 0),
  imagen_url text,
  galeria text[] not null default '{}',
  medidas text,
  materiales text,
  category_id uuid references categories(id) on delete set null,
  campaign_id uuid references campaigns(id) on delete set null,
  activo boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists materials (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  tipo text not null default 'pintura' check (tipo in ('pintura','material')),
  color_hex text,
  cantidad numeric(10,2) not null default 0,
  unidad text not null default 'unid.',
  minimo numeric(10,2) not null default 1
);

create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  descripcion text,
  fecha timestamptz not null,
  lugar text,
  cupos integer not null default 10,
  inscritos integer not null default 0,
  precio numeric(10,2) not null default 0,
  activo boolean not null default true
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  cliente_nombre text not null,
  cliente_telefono text,
  nota text,
  total numeric(10,2) not null default 0,
  estado text not null default 'pendiente' check (estado in ('pendiente','confirmado','cancelado')),
  created_at timestamptz not null default now()
);

create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid references products(id) on delete set null,
  nombre text not null,
  precio numeric(10,2) not null,
  cantidad integer not null check (cantidad > 0)
);

-- Seguridad (RLS) -------------------------------------------------------
alter table categories  enable row level security;
alter table campaigns   enable row level security;
alter table products    enable row level security;
alter table materials   enable row level security;
alter table events      enable row level security;
alter table orders      enable row level security;
alter table order_items enable row level security;

-- Cualquiera puede ver catálogo, campañas y eventos
create policy "lectura publica categories" on categories for select using (true);
create policy "lectura publica campaigns"  on campaigns  for select using (true);
create policy "lectura publica products"   on products   for select using (true);
create policy "lectura publica events"     on events     for select using (true);

-- Solo usuarios autenticados (el dueño) administran todo
create policy "admin categories"  on categories  for all to authenticated using (true) with check (true);
create policy "admin campaigns"   on campaigns   for all to authenticated using (true) with check (true);
create policy "admin products"    on products    for all to authenticated using (true) with check (true);
create policy "admin materials"   on materials   for all to authenticated using (true) with check (true);
create policy "admin events"      on events      for all to authenticated using (true) with check (true);
create policy "admin orders"      on orders      for all to authenticated using (true) with check (true);
create policy "admin order_items" on order_items for all to authenticated using (true) with check (true);

-- Los clientes no insertan directamente: crean pedidos solo con create_order(), que reserva el stock

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

-- Imágenes de productos (bucket público)
insert into storage.buckets (id, name, public) values ('productos', 'productos', true)
on conflict (id) do nothing;

create policy "imagenes publicas" on storage.objects for select using (bucket_id = 'productos');
create policy "admin sube imagenes" on storage.objects for all to authenticated
  using (bucket_id = 'productos') with check (bucket_id = 'productos');

-- Datos iniciales de ejemplo
insert into categories (nombre, slug, emoji) values
  ('Macetas', 'macetas', '🪴'),
  ('Suculentas', 'suculentas', '🌵'),
  ('Alcancías', 'alcancias', '🐷'),
  ('Adornos', 'adornos', '✨'),
  ('Productos 3D', 'productos-3d', '🧊')
on conflict (slug) do nothing;
