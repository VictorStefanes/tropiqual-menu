// Script SQL para criar a tabela 'menu_items' no Supabase
// Execute no SQL Editor do Supabase

create table if not exists menu_items (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  ingredients text[],
  price text not null,
  spicy boolean default false,
  vegetarian boolean default false,
  image text,
  category text not null,
  badges text[],
  created_at timestamp with time zone default timezone('utc'::text, now())
);

// Índice para busca rápida por categoria
create index if not exists idx_menu_category on menu_items(category);
