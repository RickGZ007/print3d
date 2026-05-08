# 🖨️ PRINT3D — Portfólio de Impressão 3D com Supabase

---

## 🧱 Arquitetura

```
Netlify  → hospeda o front-end React (grátis)
Supabase → banco de dados + autenticação (grátis)
Google Drive → imagens dos projetos (grátis)
```

---

## 🛠️ Tecnologias

| Tecnologia | Função |
|---|---|
| React 18 | Interface |
| React Router 6 | Navegação |
| Tailwind CSS 3 | Estilização com tokens |
| Supabase JS SDK | Banco + Auth |
| Vite 5 | Build |
| Lucide React | Ícones |

---

## 🚀 PASSO A PASSO COMPLETO

### PASSO 1 — Criar conta no Supabase

1. Acesse **supabase.com** → Sign Up (grátis)
2. Crie um novo projeto:
   - Nome: `print3d`
   - Senha do banco: anote em lugar seguro
   - Região: South America (São Paulo)
3. Aguarde o projeto inicializar (~2 minutos)

---

### PASSO 2 — Configurar o banco de dados

1. No painel do Supabase vá em **SQL Editor → New Query**
2. Cole o conteúdo do arquivo `supabase/setup.sql`
3. Clique em **Run**
4. Deve aparecer: `Success. No rows returned`

Isso cria:
- Tabela `projects` (projetos)
- Tabela `filaments` (cores de filamento)
- Regras de segurança RLS
- 12 cores padrão já inseridas

---

### PASSO 3 — Pegar as credenciais do Supabase

1. Vá em **Settings → API**
2. Copie:
   - **Project URL** → `https://xxxx.supabase.co`
   - **anon public key** → chave longa começando com `eyJ...`

---

### PASSO 4 — Criar o usuário admin

1. No Supabase vá em **Authentication → Users → Add user**
2. Preencha:
   - Email: seu email de admin
   - Password: uma senha segura
3. Clique em **Create user**

> Este é o único usuário que consegue fazer login no painel admin.
> Para adicionar mais admins, repita este processo.

---

### PASSO 5 — Configurar as variáveis locais

Abra o arquivo `.env` na raiz do projeto e preencha:

```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...sua_chave_anon...
```

---

### PASSO 6 — Rodar localmente

```bash
npm install
npm run dev
```

Acesse: `http://localhost:5173`
Admin:  `http://localhost:5173/admin/login`

---

### PASSO 7 — Subir no GitHub

```bash
git init
git add .
git commit -m "primeiro commit"
git remote add origin https://github.com/SEU_USUARIO/print3d.git
git push -u origin main
```

> O `.gitignore` já ignora o `.env` — suas credenciais ficam seguras.

---

### PASSO 8 — Deploy no Netlify

1. Acesse **netlify.com** → Add new site → Import from Git
2. Selecione seu repositório `print3d`
3. Configure:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
4. Antes de clicar em Deploy, vá em **Environment variables** e adicione:

| Variável | Valor |
|---|---|
| `VITE_SUPABASE_URL` | `https://xxxx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `eyJ...sua_chave_anon...` |

5. Clique em **Deploy site**
6. Aguarde **"Published"** (~2 minutos)

---

## 🎨 Como personalizar as cores

Abra `src/index.css` e edite as variáveis no topo:

```css
/* Mudar de laranja para azul */
--color-accent:       #3b82f6;
--color-accent-hover: #60a5fa;

/* Mudar fundo para claro */
--color-bg-page:      #f9fafb;
--color-text-primary: #111827;
```

Todo o site atualiza automaticamente — sem precisar mexer em nenhum componente.

---

## 🔐 Acesso ao Admin

| URL | `/admin/login` |
|---|---|
| Email | O que você criou no Supabase Auth |
| Senha | A que você definiu |

> A senha fica criptografada no Supabase — ninguém tem acesso, nem você.
> Para resetar: Supabase → Authentication → Users → clique no usuário → Reset password.

---

## 🖼️ Como adicionar imagens via Google Drive

1. Faça upload da imagem no Google Drive
2. Clique com botão direito → **Compartilhar → Qualquer pessoa com o link**
3. Copie o link (formato: `https://drive.google.com/file/d/ID/view`)
4. Cole no campo "Link da imagem" no painel admin
5. O sistema converte automaticamente para URL de imagem direta

---

## 💰 Custo total

| Serviço | Custo |
|---|---|
| Supabase (banco + auth) | **$0** |
| Netlify (front-end) | **$0** |
| Google Drive (imagens) | **$0** |
| **Total** | **$0/mês** |

---

## 📁 Estrutura do projeto

```
src/
├── lib/
│   └── supabase.js          ← cliente Supabase (conexão)
├── services/
│   ├── api.js               ← CRUD via Supabase SDK
│   └── imageUtils.js        ← conversor de links Google Drive
├── context/
│   └── AuthContext.jsx      ← autenticação via Supabase Auth
├── components/
│   ├── Navbar.jsx
│   ├── ProjectCard.jsx
│   ├── ProjectForm.jsx
│   ├── ProtectedRoute.jsx
│   └── admin/
│       ├── AdminSidebar.jsx
│       └── MaterialsManager.jsx
├── pages/
│   ├── LandingPage.jsx      ← site público
│   ├── LoginPage.jsx        ← login do admin
│   └── AdminDashboard.jsx   ← painel admin
├── data/
│   └── mockData.js          ← materiais e categorias (estáticos)
├── App.jsx
├── main.jsx
└── index.css                ← tokens de cor globais (edite aqui)
```

---

## 🐛 Problemas comuns

**"Invalid API key"**
→ A `VITE_SUPABASE_ANON_KEY` está errada. Copie novamente do Supabase → Settings → API.

**Admin redireciona para login mesmo logado**
→ Supabase demora ~1s para verificar a sessão. O spinner aparece neste momento. É normal.

**Imagem do Drive não carrega**
→ Confirme que o arquivo está compartilhado como "Qualquer pessoa com o link" no Drive.

**Cores não aparecem no site público**
→ Verifique se o SQL foi executado no Supabase e se as 12 cores foram inseridas.
→ Supabase → Table Editor → filaments → deve ter 12 linhas.
