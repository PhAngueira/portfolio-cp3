# Paulo Henrique — Portfólio CP3

Portfólio em React desenvolvido a partir do enunciado **CP3 — Portfólio, Stack e
Harness Engineering**. Nome: **Paulo Henrique Moreira Angueira**, RM **573245**.

O site busca os repositórios públicos de `PhAngueira`, oferece páginas individuais,
contato com armazenamento e notificação por e-mail, e uma área do proprietário.
Não há conteúdo de projetos inventado ou login com senha escrita no código.

## Situação da entrega

O código passou pelas verificações locais, e o banco Supabase já foi criado com o
esquema e as permissões verificados. O repositório público
[PhAngueira/portfolio-cp3](https://github.com/PhAngueira/portfolio-cp3) recebeu os
14 commits importados e as cinco branches da preparação inicial. O primeiro
[workflow de qualidade](https://github.com/PhAngueira/portfolio-cp3/actions/runs/41522940095)
terminou com sucesso em 02/11/2026, incluindo lint, formatação, testes e build.

Ainda faltam a configuração do usuário proprietário, das credenciais privadas e do
Resend, a publicação e a verificação completa na Vercel, a medição do Lighthouse
mobile e a gravação do vídeo. A conexão das contas aos assistentes não comprova que
esses fluxos da aplicação já funcionem.
Consulte `docs/VALIDACAO.md` para as evidências confirmadas e as pendências.

Na tarefa do Teams, o enunciado pede **três links**, até **03/11**:

1. Repositório público no GitHub.
2. Site publicado na Vercel.
3. Vídeo não listado no YouTube, com no máximo 8 minutos e rosto e tela visíveis.

## Primeiro uso

Use Node.js **24** e npm. Abra esta pasta no VS Code e execute no terminal:

```bash
npm ci
npm run dev
```

Abra a URL que aparecer no terminal. Este comando inicia a interface; páginas de
projetos consultam o GitHub público. Contato, destaques salvos e login dependem das
configurações dos serviços. Nenhuma mensagem será tratada como enviada sem o servidor.

### Rodar o sistema completo

Siga `docs/CONFIGURACAO.md`, copie `.env.example` para `.env.local` e preencha os
valores da sua própria conta. Depois execute:

```bash
npm run dev:full
```

Esse comando inicia a interface e a API local. Não execute `dev` ao mesmo tempo.
Não compartilhe `.env.local` e não envie chaves privadas por mensagem ou commit.

## Stack e organização

| Camada                | Escolha                                   | Responsabilidade                            |
| --------------------- | ----------------------------------------- | ------------------------------------------- |
| Interface             | React + JavaScript                        | Componentes e estados das páginas           |
| Desenvolvimento/build | Vite                                      | Servidor local e arquivos de produção       |
| Navegação             | React Router                              | Links próprios, 404 e acesso ao dashboard   |
| Estilo                | CSS próprio                               | Identidade, responsividade e temas          |
| Projetos              | API REST do GitHub + fetch                | Dados reais e cache compartilhado           |
| Login                 | Supabase Auth                             | Sessão do proprietário                      |
| Dados                 | Supabase Postgres                         | Mensagens e destaques persistentes          |
| API                   | Vercel Functions em Node                  | Validação, autorização e operações privadas |
| E-mail                | Resend                                    | Notificação do contato ao dono do site      |
| Qualidade             | Vitest, Testing Library, ESLint, Prettier | Testes e padrões                            |
| Publicação            | GitHub + Vercel                           | Deploy automático da branch principal       |

`src/pages` compõe as telas; `src/components` contém elementos reutilizáveis;
`src/hooks` controla estados; `src/services` concentra chamadas HTTP;
`shared` guarda validação compartilhada; `api` expõe as funções;
`server` mantém lógica privada; `supabase` contém o SQL de configuração.

Componentes/páginas usam **PascalCase**, hooks começam com **use**, funções e
variáveis usam **camelCase**. As chamadas HTTP ficam fora da apresentação.
O dashboard e o SDK de autenticação são carregados sob demanda. O cache de projetos
dura cinco minutos e evita consultas repetidas ao navegar entre páginas.

## Verificações

```bash
npm run lint
npm run format:check
npm test
npm run build
```

Ou execute tudo com `npm run check`. Para ajustar formatação, use `npm run format`.
Os testes usam respostas controladas: não enviam e-mails reais nem acessam contas.
A nota do Lighthouse deve ser medida no **site publicado**, em modo **mobile**,
e atingir pelo menos **80 em Performance**, conforme o enunciado.

## Git e branches

O desenvolvimento local foi registrado em branches, com datas reais. A publicação
inicial pela integração GitHub importa essas alterações e os merges pela API.
Os commits importados recebem novos identificadores e datas de publicação, com o
trailer `Original-Commit` ligando cada um ao commit local de origem. Não há datas
retroativas nem simulação de trabalho do aluno em dias anteriores.

O ZIP inicial contém o histórico local anterior à importação. Para continuar a
partir da versão publicada, use um clone novo do repositório; os históricos não
possuem os mesmos identificadores. Consulte `docs/HARNESS-IA.md` para os detalhes.
Configure sua identidade para as próximas alterações e instale os hooks:

```bash
git config user.name "Paulo Henrique Moreira Angueira"
git config user.email "SEU_EMAIL_DO_GITHUB"
npm run hooks:install
```

Cada funcionalidade usa uma branch própria, por exemplo `feature/nova-secao`.
Correções usam `fix/nome` e documentação usa `docs/nome`.
Commits seguem Conventional Commits: `feat:`, `fix:`, `docs:`, `test:`, `chore:`.

```bash
git switch -c feature/nova-secao
git add src
git commit -m "feat: adiciona nova seção"
git switch main
git merge --no-ff feature/nova-secao
git push origin main
```

O hook verifica lint/formatação e padrão da mensagem. O workflow
`.github/workflows/quality.yml` repete as verificações no GitHub. O deploy automático
é configurado ao conectar o repositório à Vercel, usando `main` como produção.
O deploy não é bloqueado automaticamente pelo workflow de qualidade: espere a
verificação passar antes de integrar as mudanças.

Para obter uma cópia com o histórico remoto publicado:

```bash
git clone https://github.com/PhAngueira/portfolio-cp3.git portfolio-cp3-remoto
cd portfolio-cp3-remoto
npm ci
```

Use uma pasta nova. Não force um push do `.git` do ZIP inicial sobre o remoto nem
combine os dois históricos apenas para eliminar uma mensagem de erro. Preserve
qualquer alteração local que você tenha feito e reaplique-a em uma branch do clone.
A autenticação de futuros pushes será feita pelo Git no seu computador.

## Guia de estudo e entrega

- `docs/CONFIGURACAO.md`: Supabase, e-mail, variáveis, Vercel e verificação real.
- `docs/DECISOES.md`: alternativas, critérios e concessões das escolhas.
- `docs/HARNESS-IA.md`: instruções, ferramentas e agentes realmente utilizados.
- `docs/HARNESS-CONEXOES.json`: registro dos alvos e operações dos conectores, sem credenciais.
- `docs/ROTEIRO-VIDEO.md`: roteiro de apresentação dentro do limite de 8 minutos.
- `docs/CHECKLIST-ENTREGA.md`: requisitos e evidências a conferir.
- `AGENTS.md`: regras para continuar o trabalho com IA.

## Referências

Requisitos: nove capturas de tela do enunciado fornecidas pelo aluno nesta conversa.
Consultas de implementação: [Vite](https://vite.dev/guide/),
[React Router](https://reactrouter.com/start/declarative/installation),
[Supabase React](https://supabase.com/docs/guides/getting-started/quickstarts/reactjs),
[autenticação](https://supabase.com/docs/guides/auth/passwords),
[RLS](https://supabase.com/docs/guides/database/postgres/row-level-security),
[Vite na Vercel](https://vercel.com/docs/frameworks/frontend/vite) e
[Resend](https://resend.com/docs/send-with-nodejs).
