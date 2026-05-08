-- ═══════════════════════════════════════════════════════════════
-- PRINT3D — Setup completo do banco de dados no Supabase
-- Cole tudo isso no SQL Editor do Supabase e clique em Run
-- ═══════════════════════════════════════════════════════════════

-- ── Tabela de projetos ───────────────────────────────────────────
create table if not exists projects (
  id          bigint primary key generated always as identity,
  titulo      text not null,
  categoria   text not null default 'Industrial',
  material    text not null default 'PLA',
  finalidade  text not null,
  imagem      text,
  created_at  timestamptz default now()
);

-- ── Tabela de filamentos (cores) ─────────────────────────────────
create table if not exists filaments (
  id          bigint primary key generated always as identity,
  nome        text not null,
  hex         text not null,
  em_estoque  boolean default true
);

-- ── Ativa Row Level Security (RLS) ───────────────────────────────
-- RLS garante que só quem tem permissão acessa os dados
alter table projects  enable row level security;
alter table filaments enable row level security;

-- ── Regras públicas: qualquer um pode LER ────────────────────────
create policy "publico_le_projetos"
  on projects for select
  using (true);

create policy "publico_le_filamentos"
  on filaments for select
  using (true);

-- ── Regras admin: só autenticado pode ESCREVER ───────────────────
create policy "admin_escreve_projetos"
  on projects for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "admin_escreve_filamentos"
  on filaments for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- ── Seed: cores padrão de filamento ──────────────────────────────
insert into filaments (nome, hex, em_estoque) values
  ('Branco',       '#F5F5F5', true),
  ('Preto',        '#1C1C1C', true),
  ('Cinza',        '#6B7280', true),
  ('Vermelho',     '#DC2626', true),
  ('Laranja',      '#F97316', true),
  ('Amarelo',      '#EAB308', false),
  ('Verde',        '#16A34A', true),
  ('Azul',         '#2563EB', true),
  ('Roxo',         '#7C3AED', false),
  ('Rosa',         '#EC4899', true),
  ('Marrom',       '#92400E', false),
  ('Transparente', '#E0F2FE', true);
