create table managers (
  id text primary key,
  username text not null unique,
  password_hash text not null,
  display_name text not null,
  property_name text not null,
  created_at timestamptz not null default now()
);

create table sessions (
  id text primary key,
  manager_id text not null references managers (id) on delete cascade,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create table stories (
  id text primary key,
  manager_id text not null references managers (id) on delete cascade,
  name text not null,
  role text not null default '',
  property_name text not null default '',
  location_label text not null default '',
  place_id text not null default '',
  since_label text not null default '',
  pronoun text not null default 'she',
  quote text not null default '',
  narrative text not null default '',
  photos jsonb not null default '[]'::jsonb,
  events jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index stories_manager_idx on stories (manager_id);
