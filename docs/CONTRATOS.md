# Contratos de implementação

Este arquivo fixa a integração entre interface e servidor.

## API

Todas as respostas são JSON. Erros: `{ "error": "Mensagem em português", "fields": {} }` (fields opcional).

- `GET /api/featured`: `{ "featuredIds": [123, 456] }`.
- `POST /api/contact`: corpo `{ name, email, message, website, requestId }`.
  `website` é um honeypot vazio. `requestId` é um UUID para deduplicação.
  Sucesso: `{ message: "Mensagem enviada com sucesso." }`.
  Falha depois de salvar pode incluir `saved: true`.
- `GET /api/dashboard`: requer `Authorization: Bearer <access_token>`.
  Resposta: `{ messages: [...], featuredIds: [...] }`.
  Mensagem: `{ id, name, email, message, created_at, responded, email_status }`.
- `PATCH /api/dashboard`: mesmo token. Corpo
  `{ action: "respond", id, responded: true|false }` ou
  `{ action: "feature", repoId: 123, featured: true|false }`.
  Sucesso `{ ok: true }`.

## Variáveis

Públicas: `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`.
Servidor: `SUPABASE_URL`, `SUPABASE_SECRET_KEY`, `PORTFOLIO_OWNER_ID`,
`RESEND_API_KEY`, `CONTACT_EMAIL`, `CONTACT_FROM`.
O servidor também aceita a antiga chave service_role em SUPABASE_SECRET_KEY.

## Módulos da interface (implementados na integração)

- `src/data/profile.js`: export `profile` com `name`, `shortName`, `githubUsername`,
  `githubUrl`, `linkedinUrl`, `role`, `bio`, `skills` (array de strings).
- `src/hooks/useProjects.js`: `useProjects()` retorna `{ projects, loading, error, reload }`.
  Repositórios no formato original da API GitHub.
- `src/hooks/useFeatured.js`: `useFeatured()` retorna `{ featuredIds, loading, error, reload }`.
- `src/services/contact.js`: `sendContact(values, requestId)`; lança Error com `.fields` e `.saved`.
- `shared/contact.js`: `validateContact(values)` retorna mapa `{ campo: mensagem }`;
  `normalizeContact(values)` retorna `{ name, email, message, website }`.
- `src/services/auth.js`: `getAuthClient()` retorna cliente Supabase ou lança erro de configuração.
- `src/services/dashboard.js`: `loadDashboard(token)`, `updateDashboard(token, payload)`.
- `src/components/ProtectedRoute.jsx`: aceita `{ session, loading, children }`; sem sessão redireciona `/login`.

## Arquivos da interface

`src/App.jsx`, `src/main.jsx`, `src/styles.css`, `src/components/*` (exceto ProtectedRoute),
`src/pages/*`, `index.html`, `public/*`. Páginas de login/dashboard são lazy.
O dashboard obtém sessão do Supabase e verifica autorização ao carregar a API.
Não importar SDK de autenticação no pacote inicial das páginas públicas.

## Testes

Vitest + jsdom + Testing Library. Formulário reutilizável em `src/components/ContactForm.jsx`
com labels Nome, E-mail, Mensagem e botão Enviar mensagem. Seus testes usam serviços simulados,
sem e-mails reais. Todos os imports internos JS/JSX usam extensão explícita.
