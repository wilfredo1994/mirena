-- Mirena: datos extra para la página de cada producto.
-- Pegar en Supabase > SQL Editor > Run. Se puede ejecutar más de una vez sin problema.

alter table products add column if not exists medidas text;
alter table products add column if not exists materiales text;
alter table products add column if not exists galeria text[] not null default '{}';
