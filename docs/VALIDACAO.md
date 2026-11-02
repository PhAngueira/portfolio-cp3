# Verificações realizadas — 02/11/2026

Este registro diferencia o que foi observado do que ainda depende da configuração
dos serviços pelo aluno. A preparação usou Node.js 24.22.1.

## Verificações automáticas executadas

O comando `npm run check` terminou com sucesso. O gate e a conferência de diff
apresentaram estes resultados:

| Verificação        | Resultado observado                              |
| ------------------ | ------------------------------------------------ |
| ESLint             | Aprovado, sem erros                              |
| Prettier           | Todos os arquivos verificados estavam formatados |
| Vitest             | **23 testes aprovados, em 6 arquivos**           |
| Build Vite         | Compilação de produção concluída                 |
| `git diff --check` | Sem erros de espaços/conflitos                   |

Os testes cobrem:

- Campos obrigatórios, e-mail inválido, limites de tamanho e caracteres Unicode.
- Formulário sem envio inválido, botão desabilitado e proteção contra dois envios simultâneos.
- Retentativa do mesmo conteúdo com a mesma chave após falha parcial do e-mail.
- Redirecionamento da rota protegida sem sessão e espera durante restauração.
- Cache compartilhado e consultas concorrentes do GitHub.
- Rejeição da API sem token, com token inválido e com usuário diferente do proprietário.
- Validação do contato no servidor, honeypot, limite de frequência e mensagem sem duplicação.

As integrações privadas foram simuladas nos testes. Eles não enviaram e-mails nem
utilizaram contas, dados privados ou credenciais do aluno.

### Alinhamento do Node.js — verificação local

Após o primeiro deploy, `package.json` e os metadados raiz do lockfile foram
ajustados para `engines.node: 24.x`, e o workflow passou a usar Node.js 24.
A configuração do projeto na Vercel e `.nvmrc` também indicam 24.x/24.
O primeiro deploy tinha a opção 24.x selecionada no projeto; este registro não
trata essa seleção como medição independente do runtime que o executou.

Após o ajuste, `npm run check` foi executado novamente e aprovado: lint,
formatação, **23 testes em 6 arquivos** e build de produção. A publicação no merge
`0f60624` também teve [CI aprovada](https://github.com/PhAngueira/portfolio-cp3/actions/runs/41527006285)
e deploy automático `READY`, com evidências próprias registradas abaixo.

## Verificação no navegador

Foi aberta uma prévia de desenvolvimento e observados:

- Home em layout desktop, com identidade visual e navegação.
- Listagem de **37 repositórios não derivados de forks** retornados pela API pública
  de `PhAngueira` naquele momento. A quantidade pode mudar.
- Página `/projetos/CP6_Frontend` funcionando após atualizar diretamente o navegador.
- Home e formulário em uma área de visualização de **390 pixels de largura**,
  usando um iframe de teste temporário. Não foi um teste em um aparelho físico.
- Menu mobile abrindo e permitindo navegar para Contato.
- Formulário vazio mostrando uma mensagem específica em cada campo e focando o nome.
- Tema escuro preservado ao recarregar.
- Acesso direto a `/dashboard` sem configuração/sessão redirecionado para `/login`.

O arquivo temporário usado para conferir a largura de celular foi removido do pacote.
A prévia foi executada sem credenciais; por isso o aviso de destaques indisponíveis
e o login ainda não configurado são esperados nessa etapa.

## Revisão técnica

A revisão independente do servidor examinou autorização, RLS, idempotência e erros.
Foi corrigida uma diferença de contagem de caracteres entre JavaScript e PostgreSQL:
nome e mensagem agora são contados por pontos de código, compatíveis com `char_length`.
O limite do corpo JSON permite a codificação UTF-8 desses textos.

Também foi corrigida a apresentação dos erros dos hooks e garantido o redirecionamento
para login quando a restauração/configuração de autenticação falha.

## Supabase real — configuração verificada

O projeto `portfolio-cp3`, ID `kkfiuvaiubknnjxoaoac`, foi criado na organização
confirmada pelo proprietário, em `sa-east-1` (São Paulo). O custo cotado na criação
foi **US$ 0/mês**, e o status observado foi `ACTIVE_HEALTHY`.

Foi aplicada a migração `20261102202426_create_portfolio_schema` a partir do SQL
versionado em `supabase/schema.sql`. As verificações confirmaram:

- Tabelas `contact_messages`, `featured_projects` e `contact_rate_limits` criadas.
- RLS ativada nas três tabelas.
- Papéis `anon` e `authenticated` sem acesso direto aos dados.
- Papel `service_role` com os privilégios necessários.
- Função `check_contact_rate_limit(text)` executável somente pelo papel de serviço.
- Teste real do limitador: cinco tentativas permitidas; a sexta bloqueada.
- Teste revertido por transação, sem registros de demonstração restantes.
- Advisors sem avisos de gravidade WARNING ou ERROR. As informações sobre RLS sem
  políticas de cliente e índice ainda sem uso são esperadas nesta arquitetura de
  acesso pelo servidor e em uma tabela recém-criada.

A URL e uma chave publicável ativa foram obtidas para a configuração do cliente.
Nenhuma chave secreta foi extraída ou incluída no Git, e nenhum usuário de Auth ou
mensagem de e-mail foi criado por essa verificação. Esse resultado comprova o
esquema e os privilégios do banco, ainda sem comprovar o fluxo do site publicado.

## Conexões e repositório — estado confirmado

- Repositório público `PhAngueira/portfolio-cp3` criado, ID `1443458829`.
- Conector GitHub instalado na conta `PhAngueira`, com seleção de repositórios,
  instalação `177963185`. O alvo autorizado para este trabalho é `portfolio-cp3`.
- Conector Vercel com acesso confirmado à equipe `team_2dZpniMTGrDJ6YEogzdSuFt4`.
- Importação inicial pela API concluída: 14 commits importados, um commit inicial
  de publicação e cinco branches conferidas no remoto.
- Commit final da importação: `115a2e792715968e97b49c65258eb09eeecaa38e`.
- Árvore final igual à origem local: `278612dadf7e09592303bd2d0752bd9ad4355915`.
- CI inicial [41522940095](https://github.com/PhAngueira/portfolio-cp3/actions/runs/41522940095)
  com status `completed` e conclusão `success`, nesse mesmo commit, em 02/11/2026.
  O workflow executou `npm ci` e `npm run check` (lint, formatação, testes e build).
- Aplicativo GitHub da Vercel instalado com confirmação do usuário, somente para
  `PhAngueira/portfolio-cp3`; instalação `177969031`.
- Projeto Vercel `portfolio-cp3` criado, ID `prj_FL7aH81AkVAYb2CAmrplMgJXHBQQ`, na
  equipe `team_2dZpniMTGrDJ6YEogzdSuFt4`, vinculado ao repositório.
- Configuração pública do cliente Supabase cadastrada na Vercel. Credenciais
  privadas ainda ausentes; nenhum resultado do fluxo de contato/painel é afirmado.
- O bloqueio inicial de conexão GitHub foi resolvido.
- CI da documentação [41523481865](https://github.com/PhAngueira/portfolio-cp3/actions/runs/41523481865)
  aprovada (`completed / success`) no commit `e2a8ac5e7ae7c8b438a687d4b7828ba9c05245a2`.
- CI após configuração da Vercel e alinhamento do Node.js
  [41527006285](https://github.com/PhAngueira/portfolio-cp3/actions/runs/41527006285)
  aprovada (`completed / success`) no commit `0f6062420a68d70556c58e43d0715fa9ad61567a`.

Cada execução de CI corresponde ao commit indicado. Alterações posteriores exigem
conferir o workflow acionado para o novo commit.

## Primeiro deploy de produção — verificado

| Item                | Resultado observado em 02/11/2026                                      |
| ------------------- | ---------------------------------------------------------------------- |
| URL canônica        | [https://portfolio-cp3.vercel.app/](https://portfolio-cp3.vercel.app/) |
| Deployment          | `dpl_4S5x1cr4sdgjBQtwwpRNr5vJTNSy`                                     |
| Ambiente e estado   | Production, `READY`                                                    |
| Commit              | `e2a8ac5e7ae7c8b438a687d4b7828ba9c05245a2`                             |
| Node.js selecionado | `24.x`                                                                 |
| Build               | Concluído na Vercel                                                    |
| Acesso público      | Home aberta no navegador sem login na Vercel                           |
| Projetos            | 38 repositórios do GitHub carregados na interface naquele momento      |

No ambiente existem somente `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY` e
`SUPABASE_URL`. A chave secreta, o proprietário e as configurações de e-mail ainda
estão ausentes. Os HTTPs observados foram:

| Requisição                     | Resposta | Significado da evidência                                       |
| ------------------------------ | -------- | -------------------------------------------------------------- |
| `GET /api/dashboard` sem token | 401      | A API rejeitou acesso não autenticado                          |
| `GET /api/featured`            | 503      | O serviço ainda está indisponível sem a chave privada Supabase |
| `GET /api/contact`             | 405      | O endpoint recusou GET; isso não é um teste de envio           |

No navegador, também foram confirmados:

- Acesso direto a `/projetos/portfolio-cp3` e funcionamento após recarregar.
- Redirecionamento de `/dashboard` para `/login` sem sessão.
- Página amigável para `/pagina-inexistente`, com o texto “Este caminho ainda não foi construído.”

A consulta restrita do Auth não encontrou usuário proprietário para a configuração
deste trabalho. Nenhum e-mail real foi enviado nessa verificação. Ainda é necessário
criar o usuário, completar as variáveis e verificar os fluxos de contato e painel.

## Deploy automático após alteração — verificado

O merge `0f6062420a68d70556c58e43d0715fa9ad61567a` na branch `main` acionou a integração
Git da Vercel, gerando o deploy de produção `dpl_Ba7Q2V1n6nXmt2iFsF68izxPeYGh`,
com estado **`READY`**. A URL canônica permaneceu
[portfolio-cp3.vercel.app](https://portfolio-cp3.vercel.app/).
A [CI 41527006285](https://github.com/PhAngueira/portfolio-cp3/actions/runs/41527006285) desse mesmo commit
terminou como **`completed / success`**. Isso registra um fluxo real de alteração,
merge e publicação automática; futuras alterações terão seus próprios resultados.

## Lighthouse mobile — medição oficial

Foi concluída uma execução pela interface oficial do PageSpeed Insights para a
home [https://portfolio-cp3.vercel.app/](https://portfolio-cp3.vercel.app/).
O [relatório público](https://pagespeed.web.dev/analysis/https-portfolio-cp3-vercel-app/6a2jg0r3n5?form_factor=mobile)
foi criado em **02/11/2026 às 18:17:52 BRT** e registrou:

| Medida                         | Resultado |
| ------------------------------ | --------- |
| Performance                    | **100**   |
| Acessibilidade                 | **100**   |
| Boas práticas                  | **96**    |
| SEO                            | **91**    |
| First Contentful Paint (FCP)   | 1,2 s     |
| Largest Contentful Paint (LCP) | 1,2 s     |
| Total Blocking Time (TBT)      | 0 ms      |
| Cumulative Layout Shift (CLS)  | 0         |
| Speed Index                    | 2,4 s     |

A auditoria usou **Moto G Power emulado**, **4G lento**, carregamento inicial,
Lighthouse **13.6.0** e Chrome **153.0.8010.36**. Não havia dados de campo do CrUX.
A nota atende ao mínimo de 80 em Performance mobile nessa execução da home.
O relatório identifica a URL e o horário; **não foi associado a um SHA**.
É uma medição de laboratório, que não garante o mesmo resultado em outras
páginas, dispositivos ou execuções, nem comprova os fluxos privados ainda pendentes.

### Tentativa anterior pela API — histórico

Antes da execução pela interface, foi feita uma chamada à API PageSpeed Insights
v5 para a mesma URL, com estratégia `mobile` e categoria `performance`.
A API retornou **HTTP 429 — `RESOURCE_EXHAUSTED`**, com `RATE_LIMIT_EXCEEDED`
e limite diário informado como `0`. Não houve repetição dessa chamada direta.

Essa resposta não produziu nota nem métricas e foi preservada no arquivo de
evidência `pagespeed-mobile-response.json` da execução. O resultado válido de
performance é o relatório oficial concluído pela interface, registrado acima.

## Ainda não comprovado

- Login real com a conta do proprietário.
- Gravação/leitura de mensagens, alterações de resposta e destaques no banco real.
- Recebimento de e-mail na caixa do proprietário.
- Gravação, publicação do vídeo e envio dos três links no Teams.

Esses itens devem ser conferidos após seguir `CONFIGURACAO.md`.
Não declare no vídeo que passaram até observar o resultado real.

## Histórico

As branches e commits locais registram a preparação atual, com a identidade técnica
`Portfolio CP3`. A integração GitHub disponível publica os snapshots e o grafo de
pais/merges por meio da API, gerando novos identificadores e metadados de publicação.
O trailer `Original-Commit` permite relacionar cada commit importado ao original.
Isso não é um push que preserva os objetos Git byte por byte.

A publicação não atribui datas antigas nem comprova trabalho em dias anteriores.
Depois dela, o aluno deve usar um clone novo do remoto, configurar seu nome/e-mail
conforme o README e registrar as alterações que efetivamente revisar e realizar.
