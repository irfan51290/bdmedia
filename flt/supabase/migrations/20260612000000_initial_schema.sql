-- =============================================================
-- FreelanceOS (FLT) - Initial Schema
-- Supabase Project: xacfqaklnazfpgmaugm (ap-southeast-2)
-- =============================================================

-- Enable UUID generation
create extension if not exists "pgcrypto";

-- =============================================================
-- PROFILES
-- One-to-one with auth.users; created via trigger on signup
-- =============================================================
create table if not exists public.profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  email        text not null,
  full_name    text,
  avatar_url   text,
  bio          text,
  location     text,
  website      text,
  telegram_chat_id text,
  hourly_rate  numeric(10,2),
  currency     text not null default 'SGD',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- =============================================================
-- CLIENTS
-- =============================================================
create table if not exists public.clients (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  name        text not null,
  company     text,
  email       text,
  phone       text,
  country     text,
  notes       text,
  status      text not null default 'prospect'
                check (status in ('active', 'inactive', 'prospect')),
  total_billed numeric(12,2) not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index on public.clients (user_id);

-- =============================================================
-- LEADS  (sales pipeline)
-- =============================================================
create table if not exists public.leads (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references public.profiles(id) on delete cascade,
  client_id    uuid references public.clients(id) on delete set null,
  title        text not null,
  source       text,
  stage        text not null default 'new'
                 check (stage in ('new','contacted','proposal','negotiation','won','lost')),
  value        numeric(12,2),
  probability  int check (probability between 0 and 100),
  notes        text,
  follow_up_at timestamptz,
  closed_at    timestamptz,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index on public.leads (user_id);
create index on public.leads (stage);

-- =============================================================
-- PROJECTS
-- =============================================================
create table if not exists public.projects (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references public.profiles(id) on delete cascade,
  client_id    uuid references public.clients(id) on delete set null,
  lead_id      uuid references public.leads(id) on delete set null,
  title        text not null,
  description  text,
  status       text not null default 'planning'
                 check (status in ('planning','active','paused','completed','cancelled')),
  type         text not null default 'fixed'
                 check (type in ('fixed','hourly','retainer')),
  budget       numeric(12,2),
  rate         numeric(10,2),
  start_date   date,
  due_date     date,
  completed_at timestamptz,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index on public.projects (user_id);
create index on public.projects (status);

-- =============================================================
-- TASKS
-- =============================================================
create table if not exists public.tasks (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references public.profiles(id) on delete cascade,
  project_id   uuid references public.projects(id) on delete cascade,
  title        text not null,
  description  text,
  status       text not null default 'todo'
                 check (status in ('todo','in_progress','review','done')),
  priority     text not null default 'medium'
                 check (priority in ('low','medium','high','urgent')),
  due_date     date,
  completed_at timestamptz,
  position     int not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index on public.tasks (user_id);
create index on public.tasks (project_id);
create index on public.tasks (status);

-- =============================================================
-- INVOICES
-- =============================================================
create table if not exists public.invoices (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references public.profiles(id) on delete cascade,
  client_id      uuid not null references public.clients(id) on delete restrict,
  project_id     uuid references public.projects(id) on delete set null,
  invoice_number text not null,
  status         text not null default 'draft'
                   check (status in ('draft','sent','viewed','paid','overdue','cancelled')),
  issue_date     date not null default current_date,
  due_date       date not null,
  paid_date      date,
  subtotal       numeric(12,2) not null default 0,
  tax_rate       numeric(5,2) not null default 0,
  tax_amount     numeric(12,2) not null default 0,
  discount       numeric(12,2) not null default 0,
  total          numeric(12,2) not null default 0,
  currency       text not null default 'SGD',
  notes          text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  unique (user_id, invoice_number)
);

create index on public.invoices (user_id);
create index on public.invoices (client_id);
create index on public.invoices (status);

-- =============================================================
-- LINE ITEMS
-- =============================================================
create table if not exists public.line_items (
  id          uuid primary key default gen_random_uuid(),
  invoice_id  uuid not null references public.invoices(id) on delete cascade,
  description text not null,
  quantity    numeric(10,2) not null default 1,
  unit_price  numeric(12,2) not null,
  amount      numeric(12,2) not null generated always as (quantity * unit_price) stored,
  position    int not null default 0,
  created_at  timestamptz not null default now()
);

create index on public.line_items (invoice_id);

-- =============================================================
-- EXPENSES
-- =============================================================
create table if not exists public.expenses (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  project_id  uuid references public.projects(id) on delete set null,
  category    text not null,
  description text not null,
  amount      numeric(12,2) not null,
  currency    text not null default 'SGD',
  receipt_url text,
  is_billable boolean not null default false,
  date        date not null default current_date,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index on public.expenses (user_id);
create index on public.expenses (date);

-- =============================================================
-- LEDGER ENTRIES  (running P&L)
-- =============================================================
create table if not exists public.ledger_entries (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  invoice_id  uuid references public.invoices(id) on delete set null,
  expense_id  uuid references public.expenses(id) on delete set null,
  type        text not null
                check (type in ('income','expense','refund','adjustment')),
  amount      numeric(12,2) not null,
  currency    text not null default 'SGD',
  description text not null,
  date        date not null default current_date,
  created_at  timestamptz not null default now()
);

create index on public.ledger_entries (user_id);
create index on public.ledger_entries (date);

-- =============================================================
-- CONTENT POSTS  (social/marketing scheduler)
-- =============================================================
create table if not exists public.content_posts (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references public.profiles(id) on delete cascade,
  title        text not null,
  body         text,
  platform     text not null,
  status       text not null default 'idea'
                 check (status in ('idea','draft','scheduled','published','archived')),
  scheduled_at timestamptz,
  published_at timestamptz,
  tags         text[] not null default '{}',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index on public.content_posts (user_id);
create index on public.content_posts (status);

-- =============================================================
-- PORTFOLIO ITEMS
-- =============================================================
create table if not exists public.portfolio_items (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.profiles(id) on delete cascade,
  project_id    uuid references public.projects(id) on delete set null,
  title         text not null,
  description   text,
  url           text,
  image_url     text,
  tags          text[] not null default '{}',
  is_featured   boolean not null default false,
  display_order int not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index on public.portfolio_items (user_id);
create index on public.portfolio_items (is_featured);

-- =============================================================
-- REFERRALS
-- =============================================================
create table if not exists public.referrals (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null references public.profiles(id) on delete cascade,
  referrer_client_id  uuid references public.clients(id) on delete set null,
  referred_client_id  uuid references public.clients(id) on delete set null,
  project_id          uuid references public.projects(id) on delete set null,
  notes               text,
  reward_amount       numeric(10,2),
  reward_paid         boolean not null default false,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create index on public.referrals (user_id);

-- =============================================================
-- TIME LOGS
-- =============================================================
create table if not exists public.time_logs (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references public.profiles(id) on delete cascade,
  project_id       uuid references public.projects(id) on delete set null,
  task_id          uuid references public.tasks(id) on delete set null,
  description      text,
  started_at       timestamptz not null,
  ended_at         timestamptz,
  duration_minutes int generated always as (
    case when ended_at is not null
    then extract(epoch from (ended_at - started_at))::int / 60
    else null end
  ) stored,
  is_billable      boolean not null default true,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index on public.time_logs (user_id);
create index on public.time_logs (project_id);

-- =============================================================
-- updated_at TRIGGER (applied to all mutable tables)
-- =============================================================
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
declare
  t text;
begin
  foreach t in array array[
    'profiles','clients','leads','projects','tasks',
    'invoices','expenses','content_posts',
    'portfolio_items','referrals','time_logs'
  ]
  loop
    execute format(
      'create trigger set_updated_at before update on public.%I
       for each row execute procedure public.set_updated_at()', t
    );
  end loop;
end;
$$;

-- =============================================================
-- ROW LEVEL SECURITY
-- =============================================================
do $$
declare
  t text;
begin
  foreach t in array array[
    'profiles','clients','leads','projects','tasks',
    'invoices','line_items','expenses','ledger_entries',
    'content_posts','portfolio_items','referrals','time_logs'
  ]
  loop
    execute format('alter table public.%I enable row level security', t);
  end loop;
end;
$$;

-- profiles: users can only see/edit their own row
create policy "profiles: own row" on public.profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

-- Generic "owner only" policies for all other tables (user_id = auth.uid())
do $$
declare
  t text;
begin
  foreach t in array array[
    'clients','leads','projects','tasks',
    'invoices','expenses','ledger_entries',
    'content_posts','portfolio_items','referrals','time_logs'
  ]
  loop
    execute format(
      'create policy "%s: owner only" on public.%I
       for all using (auth.uid() = user_id) with check (auth.uid() = user_id)',
      t, t
    );
  end loop;
end;
$$;

-- line_items: access via parent invoice ownership
create policy "line_items: owner only" on public.line_items
  for all using (
    exists (
      select 1 from public.invoices
      where invoices.id = line_items.invoice_id
        and invoices.user_id = auth.uid()
    )
  );
