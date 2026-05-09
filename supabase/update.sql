-- ═══════════════════════════════════════════════════════════════
-- update.sql — Novas tabelas: configurações do site e materiais
-- Cole no SQL Editor do Supabase → Run
-- ═══════════════════════════════════════════════════════════════

-- ── Tabela de configurações do site (chave → valor) ──────────────
-- Usada para o texto do "Sobre Nós" e outros textos editáveis
create table if not exists site_config (
  key        text primary key,
  value      text not null,
  updated_at timestamptz default now()
);

-- ── Tabela de materiais ───────────────────────────────────────────
create table if not exists materials (
  id            bigint primary key generated always as identity,
  nome          text not null,
  descricao     text not null,
  destaque      text default '',
  ativo         boolean default true,
  resistencia   int default 3,
  acabamento    int default 3,
  facilidade    int default 3,
  flexibilidade int default 3,
  created_at    timestamptz default now()
);

-- ── RLS — site_config ─────────────────────────────────────────────
alter table site_config enable row level security;

create policy "publico_le_config"
  on site_config for select using (true);

create policy "admin_escreve_config"
  on site_config for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- ── RLS — materials ───────────────────────────────────────────────
alter table materials enable row level security;

create policy "publico_le_materiais"
  on materials for select using (true);

create policy "admin_escreve_materiais"
  on materials for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- ── Seed: texto padrão do Sobre Nós ──────────────────────────────
insert into site_config (key, value) values
  ('sobre_titulo', 'Feitos para fazer'),
  ('sobre_texto',  'Somos uma empresa especializada em impressão 3D FDM de alta qualidade, atendendo desde makers e designers até indústrias que precisam de peças funcionais de precisão. Nosso objetivo: transformar qualquer arquivo em objeto com velocidade, qualidade e custo acessível.')
on conflict (key) do nothing;

-- ── Seed: materiais padrão ────────────────────────────────────────
insert into materials (nome, descricao, destaque, ativo, resistencia, acabamento, facilidade, flexibilidade) values
  ('PLA',  'Polímero biodegradável, fácil de imprimir. Ideal para protótipos, decoração e peças de baixo esforço mecânico.', 'Acabamento premium', true, 3, 5, 5, 2),
  ('ABS',  'Termoplástico resistente ao calor e impactos. Escolha certa para peças funcionais e uso industrial.',            'Alta resistência',   true, 5, 3, 3, 3),
  ('PETG', 'Equilibra resistência química, boa transparência e facilidade de impressão. Versátil para uso geral.',           'Mais versátil',      true, 4, 4, 4, 4)
on conflict do nothing;
