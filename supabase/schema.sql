-- Casa Ideal · esquema PostgreSQL (Supabase). Ejecutar completo en SQL Editor.
create table if not exists admins (user_id uuid primary key references auth.users(id) on delete cascade, email text, created_at timestamptz default now());
create or replace function is_admin() returns boolean language sql security definer set search_path=public stable as
$$ select exists(select 1 from admins where user_id = auth.uid()) $$;

create sequence if not exists property_code_seq start 1;
create table if not exists properties (
  id uuid primary key default gen_random_uuid(),
  code text unique not null default ('CI-' || lpad(nextval('property_code_seq')::text, 4, '0')),
  slug text unique not null,
  title text not null,
  price numeric not null default 0,
  currency text not null default 'CLP' check (currency in ('CLP','UF','USD')),
  operation text not null check (operation in ('venta','arriendo')),
  type text not null check (type in ('casa','departamento','parcela','oficina','local','terreno')),
  status text not null default 'disponible' check (status in ('disponible','reservada','vendida','arrendada')),
  featured boolean not null default false,
  published boolean not null default true,
  region text, comuna text, address text,
  built_m2 numeric, total_m2 numeric,
  bedrooms int default 0, bathrooms int default 0, parking int default 0, storage int default 0,
  description text, highlights text[] default '{}',
  images jsonb not null default '[]',            -- [{"url":"..."}], el primero es la imagen principal
  video_url text, tour_url text,
  meta_title text, meta_description text, og_image text,
  created_at timestamptz default now(), updated_at timestamptz default now()
);
create index if not exists properties_filter_idx on properties (operation, type, status, comuna);
create or replace function touch_updated() returns trigger language plpgsql as $$ begin new.updated_at = now(); return new; end $$;
drop trigger if exists trg_touch on properties;
create trigger trg_touch before update on properties for each row execute function touch_updated();

create table if not exists property_events (id bigserial primary key, property_id uuid references properties(id) on delete cascade, type text not null check (type in ('view','whatsapp','contact')), created_at timestamptz default now());
create index if not exists events_idx on property_events (type, created_at desc);
create table if not exists leads (id bigserial primary key, property_id uuid references properties(id) on delete set null, name text not null, phone text, email text, message text, intent text, created_at timestamptz default now());
create table if not exists site_settings (id int primary key default 1 check (id = 1), company text default 'Casa Ideal', whatsapp text default '56900000000', phone text, email text, address text, default_message text default 'Hola, me interesa esta propiedad y me gustaría recibir más información.');
insert into site_settings (id) values (1) on conflict do nothing;

alter table admins enable row level security; alter table properties enable row level security;
alter table property_events enable row level security; alter table leads enable row level security; alter table site_settings enable row level security;
create policy "admins read" on admins for select using (is_admin());
create policy "props public read" on properties for select using (published or is_admin());
create policy "props admin write" on properties for all using (is_admin()) with check (is_admin());
create policy "events anon insert" on property_events for insert with check (true);
create policy "events admin read" on property_events for select using (is_admin());
create policy "leads anon insert" on leads for insert with check (true);
create policy "leads admin read" on leads for select using (is_admin());
create policy "settings public read" on site_settings for select using (true);
create policy "settings admin write" on site_settings for update using (is_admin());

create or replace view property_stats with (security_invoker = true) as
  select p.id, p.code, p.title, p.slug,
    count(*) filter (where e.type='view') as views,
    count(*) filter (where e.type='whatsapp') as whatsapp,
    count(*) filter (where e.type='contact') as contacts
  from properties p left join property_events e on e.property_id = p.id group by p.id;

insert into storage.buckets (id, name, public) values ('properties','properties',true) on conflict do nothing;
create policy "img public read" on storage.objects for select using (bucket_id='properties');
create policy "img admin write" on storage.objects for insert with check (bucket_id='properties' and is_admin());
create policy "img admin update" on storage.objects for update using (bucket_id='properties' and is_admin());
create policy "img admin delete" on storage.objects for delete using (bucket_id='properties' and is_admin());

-- PRIMER ADMINISTRADOR: crea el usuario en Authentication > Users y luego ejecuta:
-- insert into admins (user_id, email) select id, email from auth.users where email = 'tu@correo.cl';
