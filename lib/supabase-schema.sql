-- ──────────────────────────────────────────────────────────────────────────────
-- Serva — Supabase Database Schema
-- ──────────────────────────────────────────────────────────────────────────────
-- Run this in the Supabase SQL editor to initialize your project database.

-- ── Extensions ────────────────────────────────────────────────────────────────

create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ── Enums ─────────────────────────────────────────────────────────────────────

create type user_role as enum ('admin', 'restaurant_owner', 'staff', 'client');
create type plan_tier as enum ('starter', 'pro', 'enterprise');
create type table_status as enum ('available', 'occupied', 'reserved', 'closed');
create type order_status as enum ('pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled');
create type payment_status as enum ('unpaid', 'paid', 'refunded');
create type payment_method as enum ('cash', 'card', 'online');

-- ── User Profiles ─────────────────────────────────────────────────────────────
-- Extends Supabase auth.users with application-level profile data.

create table if not exists profiles (
  id           uuid primary key references auth.users (id) on delete cascade,
  email        text not null,
  full_name    text,
  role         user_role not null default 'restaurant_owner',
  avatar_url   text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- Auto-create a profile when a user signs up
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    coalesce(
      (new.raw_user_meta_data->>'role')::user_role,
      'restaurant_owner'
    )
  );
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ── Restaurants ───────────────────────────────────────────────────────────────

create table if not exists restaurants (
  id           uuid primary key default gen_random_uuid(),
  owner_id     uuid not null references auth.users (id) on delete cascade,
  name         text not null,
  slug         text not null unique,
  description  text,
  logo_url     text,
  address      text,
  city         text,
  country      text not null default 'CA',
  phone        text,
  email        text,
  currency     text not null default 'CAD',
  plan         plan_tier not null default 'starter',
  is_active    boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- Slug must be lowercase alphanumeric + hyphens
alter table restaurants
  add constraint restaurants_slug_format
  check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$');

-- ── Tables ────────────────────────────────────────────────────────────────────

create table if not exists tables (
  id              uuid primary key default gen_random_uuid(),
  restaurant_id   uuid not null references restaurants (id) on delete cascade,
  name            text not null,
  capacity        int not null default 2 check (capacity > 0),
  status          table_status not null default 'available',
  qr_code_url     text,
  position_x      numeric,
  position_y      numeric,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  unique (restaurant_id, name)
);

-- ── Categories ────────────────────────────────────────────────────────────────

create table if not exists categories (
  id              uuid primary key default gen_random_uuid(),
  restaurant_id   uuid not null references restaurants (id) on delete cascade,
  name            text not null,
  description     text,
  image_url       text,
  sort_order      int not null default 0,
  is_active       boolean not null default true,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- ── Menu Items ────────────────────────────────────────────────────────────────

create table if not exists menu_items (
  id              uuid primary key default gen_random_uuid(),
  restaurant_id   uuid not null references restaurants (id) on delete cascade,
  category_id     uuid not null references categories (id) on delete cascade,
  name            text not null,
  description     text,
  price           numeric(10, 2) not null check (price >= 0),
  image_url       text,
  is_available    boolean not null default true,
  is_featured     boolean not null default false,
  allergens       text[] not null default '{}',
  -- JSONB for flexible option groups (e.g. size, extras)
  option_groups   jsonb not null default '[]',
  sort_order      int not null default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- ── Orders ────────────────────────────────────────────────────────────────────

create table if not exists orders (
  id               uuid primary key default gen_random_uuid(),
  restaurant_id    uuid not null references restaurants (id) on delete cascade,
  table_id         uuid references tables (id) on delete set null,
  table_name       text,
  status           order_status not null default 'pending',
  payment_status   payment_status not null default 'unpaid',
  payment_method   payment_method,
  subtotal         numeric(10, 2) not null default 0 check (subtotal >= 0),
  tax              numeric(10, 2) not null default 0 check (tax >= 0),
  total            numeric(10, 2) not null default 0 check (total >= 0),
  currency         text not null default 'CAD',
  customer_name    text,
  customer_notes   text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- ── Order Items ───────────────────────────────────────────────────────────────

create table if not exists order_items (
  id               uuid primary key default gen_random_uuid(),
  order_id         uuid not null references orders (id) on delete cascade,
  menu_item_id     uuid not null references menu_items (id) on delete restrict,
  menu_item_name   text not null,
  quantity         int not null check (quantity > 0),
  unit_price       numeric(10, 2) not null check (unit_price >= 0),
  total_price      numeric(10, 2) not null check (total_price >= 0),
  -- Snapshot of chosen options at time of order
  options          jsonb not null default '[]',
  notes            text,
  created_at       timestamptz not null default now()
);

-- ── Indexes ───────────────────────────────────────────────────────────────────

create index if not exists idx_restaurants_owner on restaurants (owner_id);
create index if not exists idx_restaurants_slug on restaurants (slug);
create index if not exists idx_tables_restaurant on tables (restaurant_id);
create index if not exists idx_categories_restaurant on categories (restaurant_id, sort_order);
create index if not exists idx_menu_items_restaurant on menu_items (restaurant_id);
create index if not exists idx_menu_items_category on menu_items (category_id, sort_order);
create index if not exists idx_orders_restaurant on orders (restaurant_id, created_at desc);
create index if not exists idx_orders_status on orders (restaurant_id, status);
create index if not exists idx_order_items_order on order_items (order_id);

-- ── Auto-update updated_at ───────────────────────────────────────────────────

create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_restaurants_updated_at
  before update on restaurants
  for each row execute function set_updated_at();

create trigger trg_tables_updated_at
  before update on tables
  for each row execute function set_updated_at();

create trigger trg_categories_updated_at
  before update on categories
  for each row execute function set_updated_at();

create trigger trg_menu_items_updated_at
  before update on menu_items
  for each row execute function set_updated_at();

create trigger trg_orders_updated_at
  before update on orders
  for each row execute function set_updated_at();

-- ── Row-Level Security ────────────────────────────────────────────────────────

alter table profiles enable row level security;
alter table restaurants enable row level security;
alter table tables enable row level security;
alter table categories enable row level security;
alter table menu_items enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;

-- profiles: users can only read/update their own profile
create policy "profiles: self read"
  on profiles for select using (auth.uid() = id);

create policy "profiles: self update"
  on profiles for update using (auth.uid() = id);

-- restaurants: owner manages their own restaurant(s)
create policy "restaurants: owner read"
  on restaurants for select using (auth.uid() = owner_id);

create policy "restaurants: owner insert"
  on restaurants for insert with check (auth.uid() = owner_id);

create policy "restaurants: owner update"
  on restaurants for update using (auth.uid() = owner_id);

create policy "restaurants: owner delete"
  on restaurants for delete using (auth.uid() = owner_id);

-- restaurants: public read (for client menu page)
create policy "restaurants: public read by slug"
  on restaurants for select using (is_active = true);

-- tables: restaurant owner manages; public can read
create policy "tables: owner manage"
  on tables for all using (
    auth.uid() = (select owner_id from restaurants where id = tables.restaurant_id)
  );

create policy "tables: public read"
  on tables for select using (true);

-- categories: restaurant owner manages; public can read active
create policy "categories: owner manage"
  on categories for all using (
    auth.uid() = (select owner_id from restaurants where id = categories.restaurant_id)
  );

create policy "categories: public read"
  on categories for select using (is_active = true);

-- menu_items: restaurant owner manages; public can read available
create policy "menu_items: owner manage"
  on menu_items for all using (
    auth.uid() = (select owner_id from restaurants where id = menu_items.restaurant_id)
  );

create policy "menu_items: public read"
  on menu_items for select using (is_available = true);

-- orders: restaurant owner reads all; anyone can insert (guests placing orders)
create policy "orders: owner read"
  on orders for select using (
    auth.uid() = (select owner_id from restaurants where id = orders.restaurant_id)
  );

create policy "orders: owner update"
  on orders for update using (
    auth.uid() = (select owner_id from restaurants where id = orders.restaurant_id)
  );

create policy "orders: public insert"
  on orders for insert with check (true);

-- order_items: follow orders access
create policy "order_items: owner read"
  on order_items for select using (
    auth.uid() = (
      select r.owner_id from restaurants r
      join orders o on o.restaurant_id = r.id
      where o.id = order_items.order_id
    )
  );

create policy "order_items: public insert"
  on order_items for insert with check (true);
