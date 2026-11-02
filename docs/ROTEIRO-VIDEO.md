# Roteiro do vídeo — CP3 Portfólio

**Duração planejada:** 7 minutos e 30 segundos, com 30 segundos de margem para o limite de **8 minutos** do enunciado. Os horários são um plano de gravação: ensaie e ajuste o ritmo antes de publicar.

**Formato obrigatório:** rosto e tela visíveis durante todo o vídeo. Publicar no YouTube como **não listado**. O tom é uma apresentação em entrevista técnica para uma vaga de frontend.

As falas abaixo são uma base para entender e adaptar. **Tudo entre colchetes precisa ser confirmado ou preenchido.** Não ler como realizado um teste, uma publicação ou uma configuração que ainda não aconteceu.

## Antes de gravar

- Separe o site publicado, o editor, o repositório, o diagrama, o resultado dos testes e o relatório real do Lighthouse.
- Use uma mensagem de demonstração sem dados pessoais de outras pessoas.
- Deixe o login preparado sem mostrar senha, tokens ou variáveis secretas. Mostre somente nomes de variáveis no `.env.example`.
- Confira os nomes reais dos arquivos e os recursos de IA efetivamente usados.
- Abra a página de arquitetura do projeto, o histórico real de branches/commits e o deploy correspondente.
- Mantenha a câmera visível durante trocas de janela. Faça uma gravação curta de teste de áudio e tela.

## 0:00–0:25 — Apresentação

**Na tela:** home do portfólio publicado.

**Fala sugerida:**

> Oi, eu sou Paulo Henrique Moreira Angueira, RM 573245, aluno de Engenharia de Software. Este é meu portfólio em React. Ele consulta meus projetos do GitHub, recebe mensagens e tem uma área do proprietário para acompanhar os contatos e escolher os destaques. Vou mostrar a arquitetura, explicar as escolhas da stack e apresentar como organizei o trabalho com a IA.

## 0:25–1:25 — Parte 1: stack e arquitetura

**Na tela:** diagrama de [DECISOES.md](./DECISOES.md), seguido da estrutura de pastas no editor.

**Fala sugerida:**

> A interface foi organizada em React com JavaScript e Vite. React Router relaciona as URLs às páginas. O navegador consulta os repositórios públicos do meu GitHub e usa Supabase Auth para o login. As operações da aplicação passam pela API Node na Vercel: ela valida as entradas, verifica o proprietário quando necessário, acessa o Postgres e chama o Resend para enviar e-mail.
>
> Separei páginas, componentes, serviços e hooks por responsabilidade. Uma página monta a tela; um componente apresenta algo reutilizável, como um card; um serviço concentra a comunicação com uma API. Isso evita espalhar chamadas de rede pelo visual e ajuda a localizar uma mudança.
>
> Neste exemplo, [abra um componente e o serviço que ele utiliza], a apresentação recebe os dados sem precisar conhecer toda a configuração da requisição.

**Atenção:** mostre um exemplo real existente no código; não invente uma camada que não foi implementada.

## 1:25–2:20 — Parte 1: fluxo dos projetos e experiência do visitante

**Na tela:** lista de projetos, página individual, URL atualizada diretamente, troca de tema e visual em largura de celular.

**Fala sugerida:**

> Os projetos vêm da API do GitHub do usuário PhAngueira. Os cards usam informações dos repositórios, e cada projeto tem seu endereço individual. Ao abrir esse endereço diretamente ou atualizar a página, ele precisa continuar funcionando.
>
> O serviço guarda os resultados em memória por cinco minutos. Enquanto o cache está válido, navegar entre as páginas reutiliza os dados. Há estados separados para carregamento, erro e lista vazia.
>
> O tema fica salvo no navegador do visitante. A interface adapta o layout para celular e reaproveita botões, cards e mensagens. Login e dashboard são carregados sob demanda. As imagens têm espaço previsto para reduzir mudanças de posição durante o carregamento.

**Demonstração:** mostre apenas comportamentos que você confirmou. As evidências mais demoradas de erro e lista vazia podem estar nos testes ou em capturas identificadas como cenários controlados.

## 2:20–3:15 — Parte 1: contato, login e dashboard

**Na tela:** erros por campo no formulário; dashboard já autenticado; mensagem de demonstração e escolha de destaques.

**Fala sugerida:**

> O formulário apresenta uma mensagem específica para cada campo inválido e bloqueia o botão durante o envio. A API valida novamente os dados. O objetivo é salvar o contato no banco e enviar a notificação ao meu e-mail. A operação usa idempotência para reduzir duplicações quando uma tentativa precisa ser repetida.
>
> No dashboard, o proprietário pode consultar mensagens, marcar uma como respondida e escolher os projetos destacados. A proteção não depende apenas do redirecionamento da tela: a API verifica o token e o ID do proprietário. O acesso direto às tabelas pelo cliente é bloqueado pelas políticas do banco. As credenciais privilegiadas ficam no servidor.

**Evidências a preencher antes da gravação:** `[mensagem salva e e-mail efetivamente recebido]`; `[alteração de destaque persistida na home pública]`. Se ainda estiverem pendentes, conclua a configuração e a verificação antes de afirmar que a entrega está completa.

## 3:15–4:05 — Parte 1: da branch ao deploy e evidências

**Na tela:** branch/commits reais, workflow do GitHub, deploy correspondente e resultados reais de teste/Lighthouse.

**Fala sugerida:**

> O fluxo definido é desenvolver uma funcionalidade em sua branch, validar e integrar à principal. As mensagens seguem um padrão, como feat para uma funcionalidade e fix para uma correção. As regras aparecem no README e nas instruções do projeto para a IA. Os hooks verificam os padrões locais, e o GitHub Actions executa as verificações configuradas. A integração com a Vercel publica a principal automaticamente.
>
> Aqui estão os testes de [nome real dos cenários], executados em [data]. Eles verificam a validação do formulário e o acesso ao dashboard sem login. No Lighthouse mobile, o site publicado obteve [nota medida] em [data]. O requisito é pelo menos 80 em performance.

**Não preencher por estimativa:** `[resultado dos testes]`, `[execução do workflow]`, `[deploy]` e `[nota do Lighthouse]`. Se algo falhou, corrija e registre a nova execução. Não altere datas para simular histórico.

## 4:05–5:25 — Parte 2: justificativas da stack

**Na tela:** tabela de decisões, destacando uma linha por vez.

**Fala sugerida:**

> React é uma exigência do trabalho. Para estruturar o projeto, comparei Vite com um framework como Next.js. Escolhi Vite porque o escopo é uma interface cliente com uma API separada. Em troca, precisei cuidar da configuração das URLs no deploy e não usei renderização no servidor.
>
> Escolhi JavaScript para conseguir acompanhar melhor a lógica; aceitei abrir mão da checagem de tipos do TypeScript. Para as rotas, React Router atende as páginas e os redirecionamentos. Para o visual, CSS puro me permite explicar os estilos; uma biblioteca pronta reduziria parte desse trabalho, mas eu teria mais convenções externas para aprender.
>
> Comparei o fetch com cache simples a uma biblioteca como TanStack Query. Como há poucas fontes de dados, mantive o cache explícito, aceitando implementar expiração e erros. Supabase reúne autenticação e banco; uma solução própria exigiria mais infraestrutura. A API na Vercel concentra autorização e segredos. O Resend atende o envio de e-mail pelo servidor, mas depende da configuração real do provedor.
>
> Vitest e Testing Library cobrem os comportamentos exigidos. Eles não substituem os testes do site publicado. ESLint, Prettier e a automação ajudam a manter os mesmos padrões. As comparações e as concessões estão registradas na documentação.

**Preparação:** leia as alternativas antes de usar a frase “comparei”. A tabela é um apoio para compreender as decisões, não um histórico fictício de experimentos.

## 5:25–7:10 — Parte 3: harness de IA

**Na tela:** ferramenta usada, instruções versionadas, configurações e um exemplo real de correção validada.

**Fala sugerida — adapte aos fatos do seu trabalho:**

> Usei [ferramenta efetivamente utilizada] com [modelo confirmado na interface ou registro de uso]. Escolhi esse ambiente porque [motivo que corresponde à sua experiência]. Comparei com [alternativa realmente considerada] e aceitei [limitação ou concessão observada]. Eu precisava entender as decisões para revisar o código e apresentar o projeto.
>
> Harness é o conjunto que organiza o trabalho da IA. Neste projeto, inclui as instruções, o contexto e as ferramentas que usei para orientar e verificar as mudanças. Aqui estão os arquivos versionados que definem as pastas, a nomenclatura, os comandos de validação e o padrão de commits e branches.
>
> Em vez de depender somente de pedidos soltos na conversa, registrei as regras junto do projeto. Dividi o trabalho em tarefas menores, com critérios para conferir o resultado. Neste exemplo, [mostre um pedido real, o arquivo afetado e como a mudança foi verificada].
>
> As skills usadas foram [nomes e finalidade, somente se utilizadas]. Os conectores ou MCPs usados foram [nomes e ações reais]. Os agentes configurados tiveram [papéis efetivamente executados]. As configurações relevantes estão nestes arquivos. [Se algum desses recursos não foi usado, explique isso e o motivo, em vez de afirmar uma utilização inexistente.]
>
> As instruções orientam, mas não garantem sozinhas que o resultado esteja correto. Por isso, conferi o código e usei [ferramentas realmente executadas] para verificar os padrões e o funcionamento. Uma correção que precisei fazer foi [caso real]. A IA ajudou em [atividades reais], e eu preciso conseguir explicar o que foi entregue.

**O enunciado pede explicitamente:** ferramenta e modelo; instruções do projeto; skills; conectores/MCPs; agentes configurados; arquivos versionados; como o conjunto orienta arquitetura, código, commits e branches. Mostre a configuração e o uso real. Um nome em um arquivo, sozinho, não comprova execução.

## 7:10–7:30 — Encerramento

**Na tela:** README com links definitivos e visão da home.

**Fala sugerida:**

> O repositório reúne o código, as instruções e as decisões do projeto. GitHub, Vercel e este vídeo são os três entregáveis. Minha principal aprendizagem foi organizar responsabilidades e verificar o código produzido com IA e as integrações. Obrigado.

## Conferência final da gravação

- [ ] Duração final de até 8 minutos, conferida no arquivo ou no YouTube.
- [ ] Rosto e tela visíveis durante toda a gravação.
- [ ] As três partes obrigatórias aparecem: arquitetura, justificativas e harness de IA.
- [ ] Comparações incluem critérios e concessões, sem benchmarks inventados.
- [ ] Resultados e demonstrações correspondem a execuções reais.
- [ ] Nenhuma senha ou chave secreta aparece.
- [ ] Vídeo publicado como não listado e acessível pelo link.
- [ ] Não há colchetes ou campos pendentes sendo lidos como informação final.
