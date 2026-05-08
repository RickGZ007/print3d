// ─────────────────────────────────────────────────────────────────────────────
// src/data/mockData.js
// Dados estáticos — não precisam de banco de dados.
// Projetos e cores agora vêm do Supabase.
// ─────────────────────────────────────────────────────────────────────────────

export const CATEGORIAS = [
  "Industrial",
  "Decoração",
  "Prototipagem",
  "Medicina",
  "Educação",
];

export const NOMES_MATERIAIS = ["PLA", "ABS", "PETG", "TPU", "Resina"];

export const MATERIAIS = [
  {
    nome: "PLA",
    descricao: "Polímero biodegradável, fácil de imprimir. Ideal para protótipos, decoração e peças de baixo esforço mecânico.",
    propriedades: { Resistência: 3, Acabamento: 5, Facilidade: 5, Flexibilidade: 2 },
    destaque: "Acabamento premium",
  },
  {
    nome: "ABS",
    descricao: "Termoplástico resistente ao calor e impactos. Escolha certa para peças funcionais e uso industrial.",
    propriedades: { Resistência: 5, Acabamento: 3, Facilidade: 3, Flexibilidade: 3 },
    destaque: "Alta resistência",
  },
  {
    nome: "PETG",
    descricao: "Equilibra resistência química, boa transparência e facilidade de impressão. Versátil para uso geral.",
    propriedades: { Resistência: 4, Acabamento: 4, Facilidade: 4, Flexibilidade: 4 },
    destaque: "Mais versátil",
  },
];
