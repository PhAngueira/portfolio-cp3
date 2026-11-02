# Verificações realizadas — 02/11/2026

Este registro diferencia o que foi observado do que ainda depende da configuração
dos serviços pelo aluno. A preparação usou Node.js 24.22.1.

## Verificações automáticas executadas

O comando `npm run check` terminou com sucesso e executou:

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
- Criação do projeto Vercel ainda bloqueada por `missing GitHub Login Connection`;
  essa tentativa não criou projeto nem configurou variáveis.

A CI acima corresponde à importação inicial. A atualização desta documentação
aciona outra execução, cujo resultado deve ser conferido pelo próprio commit.

## Ainda não comprovado

- Login real com a conta do proprietário.
- Gravação/leitura de mensagens, alterações de resposta e destaques no banco real.
- Recebimento de e-mail na caixa do proprietário.
- Publicação na Vercel, rewrites em produção e deploy automático após push.
- **Nota de Performance no Lighthouse mobile: não medida.** O requisito é pelo menos 80.
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
