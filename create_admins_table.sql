create table if not exists admins (
  id uuid default gen_random_uuid() primary key,
  store_id uuid not null,
  name text not null,
  email text not null,
  phone text not null,
  role text not null check (role in ('owner', 'admin', 'staff')),
  status text not null default 'active' check (status in ('active', 'inactive')),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create index if not exists idx_admins_store_id on admins(store_id);
create index if not exists idx_admins_email on admins(email);

alter table admins enable row level security;

create policy "Allow all access" on admins
  for all
  using (true)
  with check (true);

insert into admins (store_id, name, email, phone, role, status)
values ('f0839015-e921-41f2-9a9e-0984029054ce', 'Didik Prasetiadi', 'didik@example.com', '6282220205694', 'owner', 'active')
on conflict do nothing;
