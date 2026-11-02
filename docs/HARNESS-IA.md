# Como a IA foi orientada neste projeto

## Ferramenta, modelo e critério de escolha

Este projeto foi preparado com auxílio do ChatGPT nesta conversa, usando o modelo
GPT-6 Astra Pro. O aluno precisa revisar e compreender os arquivos antes da entrega.
Se a ferramenta ou o modelo mudar durante a continuação, registre a mudança.

A escolha reuniu leitura do enunciado, implementação, delegação de tarefas e
verificação no mesmo ambiente. Não foi feito benchmark entre modelos. Uma
alternativa seria trabalhar com uma IA no editor e configurar cada serviço
manualmente; aqui foram usados conectores para operar as contas autorizadas.
Isso reduz parte do trabalho manual, mas depende das permissões e das operações
que cada integração oferece. Um login aceito não garante acesso de escrita a um
repositório nem uma aplicação publicada.

## Instruções versionadas

`AGENTS.md` foi criado antes da implementação e indicado aos agentes. Ele define
responsabilidades das pastas, nomenclatura, separação de segredos, validações,
branches, commits e critérios de revisão. `docs/CONTRATOS.md` fixou a forma das
requisições e respostas para tornar compatíveis interface e servidor.

`docs/HARNESS-CONEXOES.json` registra os serviços, os alvos e as operações
observadas, sem credenciais. É documentação da configuração gerenciada usada nesta
conversa; não é um arquivo executável de instalação ou autenticação de MCPs.
As permissões efetivas continuam administradas nas contas dos provedores.

## Skills efetivamente utilizadas

| Skill do ambiente                           | Finalidade nesta preparação                                         |
| ------------------------------------------- | ------------------------------------------------------------------- |
| Sites                                       | Organização, identidade visual e verificação da interface           |
| Library                                     | Preparação e entrega do pacote inicial ao aluno                     |
| Plugin Management                           | Descoberta das integrações disponíveis e orientação das conexões    |
| Supabase                                    | Configuração do projeto, documentação atual, migração e verificação |
| Supabase Postgres Best Practices            | Revisão do esquema, privilégios e acesso ao banco                   |
| Vercel Deployments & CI/CD                  | Preparação da publicação e do vínculo com o repositório             |
| Vercel Knowledge Update                     | Consulta das orientações atuais da plataforma                       |
| Vercel Environment Variables                | Separação da configuração pública e das credenciais privadas        |
| Vercel Marketplace                          | Investigação da conexão oficial com o Supabase existente            |
| Vercel Verification (`vercel:verification`) | Verificação do site publicado, rotas e respostas da API             |

As skills são recursos do ambiente do ChatGPT; não foram instaladas como skills
locais do aplicativo. Seus textos completos não foram copiados para o repositório:
o conteúdo e a versão são mantidos pelos respectivos provedores, e copiar esse
material não comprovaria sua execução. O registro versionado mostra o que foi
utilizado, com qual finalidade e sob quais limites. O site funciona sem depender
dessas ferramentas de desenvolvimento.

## Agentes e divisão real do trabalho

| Papel                                  | Responsabilidade                                                              | Organização do trabalho                    |
| -------------------------------------- | ----------------------------------------------------------------------------- | ------------------------------------------ |
| Coordenador                            | Contratos, serviços do cliente, integração, testes e entrega                  | Branch `feature/integracao`                |
| Interface                              | Páginas públicas, contato, login, dashboard e CSS                             | Worktree e branch `feature/interface`      |
| Servidor                               | API, autorização, persistência e integração de e-mail                         | Worktree e branch `feature/backend`        |
| Revisão do enunciado e da documentação | Requisitos, roteiro e checklist                                               | Arquivos separados, integrados depois      |
| Configuração Supabase                  | Criar a instância, aplicar SQL e verificar privilégios                        | Operações autorizadas no projeto do aluno  |
| Preparação Vercel                      | Verificar acesso, criar o projeto vinculado e preparar a configuração pública | Operações autorizadas na equipe do aluno   |
| Publicação GitHub                      | Preparar a importação das árvores, commits e branches reais                   | Repositório público do trabalho            |
| Documentação das conexões              | Atualizar evidências e pendências após a configuração                         | Cópias separadas para revisão e integração |

São agentes delegados nesta conversa. Não há um processo de agentes locais que se
execute sozinho no computador do aluno. As divisões de implementação aparecem nas
branches; as operações dos serviços são registradas neste documento e em
`VALIDACAO.md`. Os resultados devem ser revistos antes de apresentar o vídeo.

## Conectores e uso real

### Supabase

Após a confirmação da organização e da opção gratuita pelo usuário, o conector
criou `portfolio-cp3` (`kkfiuvaiubknnjxoaoac`) na região de São Paulo. Aplicou o SQL
versionado e verificou as três tabelas, RLS, privilégios e a função de limite de
contatos. Um teste transacional comprovou cinco tentativas permitidas e a sexta
bloqueada; a transação foi revertida, sem registros de teste remanescentes.

A escolha permitiu executar e verificar a configuração do banco sem trocar uma
senha administrativa pelo chat. A URL e a chave publicável foram obtidas. A chave
secreta do servidor e a criação do usuário proprietário continuam pendentes neste
registro; o conector disponível não expõe essas operações.

### GitHub

O conector identifica a conta `PhAngueira` e o repositório alvo
`PhAngueira/portfolio-cp3`. A criação do repositório foi feita pelo navegador, pois
essa operação não estava disponível na integração. O usuário concluiu o login e
instalou o ChatGPT Codex Connector com seleção de repositórios para este trabalho.
A autorização da identidade sozinha havia permitido leituras, mas o primeiro envio
de arquivo foi negado até a instalação do aplicativo.

A publicação inicial usa a API de objetos Git. Ela preserva os arquivos, os modos
e a relação entre os commits e merges reais, verificando os identificadores das
árvores. O wrapper disponível cria novos commits com metadados de publicação;
ele não permite preservar os objetos originais byte por byte. Cada commit importado
recebe o trailer `Original-Commit` para apontar a sua origem.

A importação inicial foi concluída: 14 commits importados, um commit de inicialização
da publicação e cinco branches. A árvore final coincide com a local:
`278612dadf7e09592303bd2d0752bd9ad4355915`. O commit principal da importação é
`115a2e792715968e97b49c65258eb09eeecaa38e`. A execução de qualidade
[41522940095](https://github.com/PhAngueira/portfolio-cp3/actions/runs/41522940095)
terminou com sucesso nesse commit. Alterações posteriores têm suas próprias
execuções e precisam ser conferidas separadamente.

O ZIP inicial contém o histórico local, com a identidade técnica `Portfolio CP3`.
Depois da publicação, use um clone novo do remoto para continuar. Não force a
substituição do histórico remoto pelo `.git` antigo. Nenhuma data foi retroagida
para simular trabalho distribuído em dias anteriores. A participação e a revisão
do aluno devem ser registradas nas próximas alterações reais.

### Vercel

A conexão foi autorizada pelo usuário para a equipe do projeto. Depois, ele
confirmou a instalação do aplicativo GitHub da Vercel, limitada ao repositório
`PhAngueira/portfolio-cp3`. Isso resolveu o bloqueio inicial de conexão entre os
serviços e permitiu criar o projeto `prj_FL7aH81AkVAYb2CAmrplMgJXHBQQ`.

Foram conferidos Vite, `dist`, `npm run build`, as funções da API e a configuração
das rotas. A configuração pública do cliente Supabase foi cadastrada na Vercel.
O primeiro deploy de produção (`dpl_4S5x1cr4sdgjBQtwwpRNr5vJTNSy`) terminou como
`READY` no commit `e2a8ac5`, e a URL
[portfolio-cp3.vercel.app](https://portfolio-cp3.vercel.app/) foi aberta sem login
na Vercel. A página individual continuou funcionando após recarga, o dashboard
sem sessão redirecionou para login e a rota inexistente mostrou a página amigável.
As credenciais privadas continuam pendentes, por isso contato e painel ainda não
têm um teste completo comprovado. A tentativa PageSpeed mobile retornou erro de
cota sem nota; o resultado não foi apresentado como aprovação de performance.

A preparação usa a integração Git para obter deploy automático da branch `main`.
Uma conexão oficial Supabase–Vercel foi pesquisada como forma de sincronizar a chave
secreta diretamente entre os provedores, sem exibi-la no chat. A pesquisa não
significa que essa conexão já tenha sido instalada ou autorizada.

## Limites e proteção de credenciais

As instruções do projeto, os alvos e as decisões são versionados. Senhas, cookies,
tokens de sessão e chaves privadas ficam fora do repositório e do vídeo. Não há
um `.mcp.json` com credenciais nem uma configuração local de MCP apresentada como
executada. `.env.example` lista os nomes necessários; `.env.local` permanece fora
do Git. As autorizações dos conectores são concedidas pelas interfaces seguras dos
serviços, com a participação do usuário quando necessária.

Neste checkpoint, o banco e a primeira publicação pública estão configurados;
proprietário, e-mail, variáveis privadas e verificação completa do site ainda
precisam ser concluídos. Não
apresente no vídeo uma etapa pendente como pronta nem um conector de e-mail como
utilizado: o código possui integração com Resend, mas a conta ainda precisa ser
configurada.

## Como as regras são verificadas

As instruções orientam a geração e a revisão. O projeto também usa verificações
executáveis:

1. ESLint encontra problemas de código e regras de hooks.
2. Prettier verifica a formatação.
3. Testes verificam o formulário, a proteção de rotas, o cache e a API.
4. Vite compila a versão de produção.
5. Hooks locais e GitHub Actions repetem as verificações configuradas nas alterações.

`docs/VALIDACAO.md` registra o que foi observado. Build e testes locais não
comprovam login real, recebimento de e-mail, deploy automático ou Lighthouse.
Cada um desses resultados precisa de sua própria verificação.

Um exemplo concreto da revisão foi a contagem de caracteres: nome e mensagem
passaram a usar pontos de código Unicode no JavaScript para corresponder ao
`char_length` do PostgreSQL. Os testes cobrem essa regra. Também foram corrigidos
o tratamento de erros dos hooks e o redirecionamento do painel sem sessão válida.

## Como continuar com a IA

Antes de uma alteração, forneça `AGENTS.md`, o requisito e os arquivos envolvidos.
Peça uma explicação da mudança e revise o diff. Faça a alteração em uma branch,
execute as verificações relevantes e integre à `main`. Registre decisões em
`docs/DECISOES.md` e repita o comportamento no site publicado.

Exemplo de instrução para continuar:

> Leia AGENTS.md e docs/CONTRATOS.md. Na branch fix/contato, investigue este erro
> de envio. Preserve validação no cliente e no servidor e a deduplicação por UUID.
> Mostre a causa, a mudança e os testes executados. Não exponha chaves nem afirme
> que o e-mail chegou sem uma verificação real.
