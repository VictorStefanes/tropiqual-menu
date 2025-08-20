-- Script SQL para criar a tabela 'chef_recommendations' no Supabase
-- Execute no SQL Editor do Supabase

create table if not exists chef_recommendations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price text not null,
  category text not null,
  image text,
  badges text[],
  special_ingredients text[],
  available boolean default true,
  featured boolean default true,
  use_custom_name boolean default false,
  custom_name text,
  use_custom_description boolean default false,
  custom_description text,
  use_custom_price boolean default false,
  custom_price text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Índice para busca rápida por categoria
create index if not exists idx_chef_category on chef_recommendations(category);
