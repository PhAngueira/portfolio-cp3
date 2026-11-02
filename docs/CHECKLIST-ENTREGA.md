# Checklist de entrega — CP3 Portfólio

**Fonte:** enunciado fornecido pelo professor nos prints. **Formato:** individual. **Prazo informado:** 03/11. Todos os 12 requisitos do site são obrigatórios.

Este arquivo começa com itens **não verificados**. Marque uma caixa somente depois de realizar a verificação correspondente. Ter código para uma funcionalidade não comprova que a integração funciona no ambiente publicado.

## 1. Três links para entregar no Teams

| Entregável obrigatório        | Link definitivo                                |
| ----------------------------- | ---------------------------------------------- |
| Repositório público no GitHub | `[PREENCHER APÓS PUBLICAR O REPOSITÓRIO]`      |
| Site publicado na Vercel      | `[PREENCHER APÓS DEPLOY REAL]`                 |
| Vídeo não listado no YouTube  | `[PREENCHER APÓS PUBLICAR E CONFERIR O VÍDEO]` |

- [ ] Os três links abrem em uma janela sem login do proprietário.
- [ ] O repositório está público e é o mesmo utilizado no deploy.
- [ ] O link da Vercel abre a versão final, sem exigir acesso à equipe do projeto.
- [ ] O vídeo está não listado, não privado.
- [ ] Os três links foram enviados na tarefa correta do Teams até o prazo informado.

## 2. Configuração anterior às verificações

- [ ] Instalar as dependências e seguir os comandos reais do README.
- [ ] Configurar Supabase Auth e criar/definir o proprietário, usando seu ID correto.
- [ ] Aplicar o esquema e as políticas RLS das tabelas da aplicação.
- [ ] Configurar as variáveis públicas e privadas nos ambientes apropriados.
- [ ] Configurar o provedor de e-mail, o remetente autorizado e o destinatário do proprietário.
- [ ] Configurar o repositório na Vercel, as variáveis do servidor e a branch de produção.
- [ ] Conferir que nenhum segredo foi colocado em variável exposta ao frontend.
- [ ] Manter `.env` fora do Git; fornecer `.env.example` apenas com nomes e exemplos seguros.

## 3. Os 12 requisitos e suas evidências

### 1 — Rotas

- [ ] Abrir um projeto por seu link individual.
- [ ] Colar esse link diretamente em outra janela e atualizar o navegador sem perder a página.
- [ ] Acessar uma rota inexistente e conferir a página 404 amigável.
- [ ] Provocar uma falha controlada da API e conferir mensagem e recuperação adequadas.

**Evidência:** URL real de um projeto, registro da atualização direta e capturas dos estados 404/erro. Falha da API não deve ser apresentada como lista vazia.

### 2 — Estados de carregamento

- [ ] Conferir indicador de carregamento ao buscar dados da API.
- [ ] Conferir estados distintos de erro e lista vazia, usando cenário controlado quando necessário.
- [ ] Conferir indicador de envio e botão bloqueado enquanto o formulário aguarda a resposta.
- [ ] Confirmar que cliques repetidos não disparam múltiplos envios concorrentes.

**Evidência:** testes ou captura de cenário reproduzível. Identificar dados simulados como simulação.

### 3 — Integração com GitHub

- [ ] Confirmar consulta à API pública do usuário `PhAngueira`.
- [ ] Conferir que os cards usam dados reais do repositório, incluindo descrição, linguagem e atualização quando disponíveis.
- [ ] Confirmar que selecionar destaques não substitui a API por projetos cadastrados manualmente.
- [ ] Conferir tratamento de falha/limite da API sem apresentar uma mensagem incorreta.

**Evidência:** painel de rede e comparação de um card com seu repositório real.

### 4 — Formulário de contato

- [ ] Enviar campos inválidos e conferir mensagens específicas por campo.
- [ ] Enviar uma mensagem de teste válida e identificar a mesma mensagem no dashboard.
- [ ] Confirmar o recebimento real do e-mail pelo proprietário.
- [ ] Verificar retorno de sucesso e de erro, sem anunciar sucesso completo quando o envio falha.
- [ ] Testar repetição da mesma operação e confirmar ausência de registros/notificações indevidamente duplicados.
- [ ] Verificar o comportamento quando o e-mail falha após o armazenamento, incluindo a recuperação sem duplicação.

**Evidência:** mensagem de teste no dashboard e e-mail correspondente, sem divulgar dados pessoais. Uma resposta aceita pelo provedor não substitui a conferência da caixa de entrada.

### 5 — Dashboard do dono

- [ ] Sem sessão, abrir diretamente o dashboard e confirmar redirecionamento para login.
- [ ] Confirmar que a API administrativa rejeita solicitações sem token ou com token inválido.
- [ ] Confirmar que uma identidade diferente do proprietário não pode acessar operações administrativas.
- [ ] Conferir que as políticas RLS negam acesso direto às tabelas pelo cliente.
- [ ] Entrar como proprietário e consultar as mensagens.
- [ ] Marcar uma mensagem como respondida e conferir a alteração após atualizar a página.
- [ ] Alterar os destaques e conferir a seleção persistida na home pública, inclusive em outro navegador.

**Evidência:** teste de acesso protegido, respostas da API e demonstração do painel com sessão autorizada. Esconder um link no menu não é evidência de proteção.

### 6 — Preferências do visitante

- [ ] Trocar o tema, atualizar a página e confirmar a preferência.
- [ ] Fechar e reabrir o site e conferir a preferência preservada no mesmo navegador.
- [ ] Conferir legibilidade e foco de navegação nos dois temas.

**Evidência:** demonstração da preferência persistente. Tema é dado local; mensagens e destaques precisam permanecer no banco.

### 7 — Interface

- [ ] Conferir o layout em celular e desktop, sem conteúdo cortado ou rolagem horizontal indevida.
- [ ] Conferir menu, links, campos e botões em ambos os tamanhos.
- [ ] Mostrar no código componentes visuais reaproveitados.
- [ ] Conferir a identidade visual e a consistência entre páginas.

**Evidência:** capturas mobile/desktop e exemplos de reutilização. Elementos 3D são opcionais no enunciado.

### 8 — Performance

- [ ] Executar Lighthouse em modo mobile no endereço publicado e obter **pelo menos 80 em performance**.
- [ ] Registrar URL, data e resultado reais da execução abaixo.
- [ ] Conferir formato, tamanho e carregamento adequado das imagens.
- [ ] Conferir reserva de espaço para imagens e carregamentos, evitando saltos de layout.
- [ ] Confirmar que login/dashboard e eventuais recursos pesados ficam fora do carregamento inicial público.
- [ ] No painel de rede, navegar entre páginas e confirmar reutilização dos dados do GitHub durante a validade de 5 minutos do cache.
- [ ] Confirmar que consultas concorrentes ao mesmo recurso não se duplicam desnecessariamente.

| Registro real do Lighthouse | Preencher somente após executar |
| --------------------------- | ------------------------------- |
| URL publicada avaliada      | `[PENDENTE]`                    |
| Data e horário              | `[PENDENTE]`                    |
| Modo                        | `[CONFIRMAR MOBILE]`            |
| Nota de performance         | `[PENDENTE — NÃO ESTIMAR]`      |
| Relatório/captura           | `[PENDENTE]`                    |

**Limite da evidência:** a nota corresponde à execução registrada. Não afirmar que qualquer dispositivo ou execução terá exatamente a mesma nota.

### 9 — Testes

- [ ] Executar os testes automatizados de validação do formulário.
- [ ] Executar os testes automatizados de bloqueio do dashboard sem login.
- [ ] Conferir os cenários e o resultado real, sem confundir existência dos arquivos com execução bem-sucedida.
- [ ] Registrar o comando executado, a data e o resultado no registro abaixo.

| Registro de verificação | Comando/configuração real | Resultado e data |
| ----------------------- | ------------------------- | ---------------- |
| Testes                  | `[PREENCHER]`             | `[PENDENTE]`     |
| Lint                    | `[PREENCHER]`             | `[PENDENTE]`     |
| Formatação              | `[PREENCHER]`             | `[PENDENTE]`     |
| Build                   | `[PREENCHER]`             | `[PENDENTE]`     |

**Evidência:** saída real dos comandos ou execução do workflow. Testes com respostas simuladas não comprovam envio real de e-mail ou autorização do banco publicado.

### 10 — Deploy

- [ ] Confirmar URL pública na Vercel.
- [ ] Fazer uma alteração real na branch de trabalho, integrar à principal e conferir o deploy automático correspondente.
- [ ] Conferir o commit publicado e executar uma verificação básica de home, projeto individual, contato e login na URL final.

**Evidência:** deploy bem-sucedido associado ao commit real. O enunciado menciona outras possibilidades, mas a seção de entrega solicita o link da Vercel.

### 11 — Versionamento

- [ ] Definir o padrão de mensagens e usar mensagens coerentes nos commits reais.
- [ ] Desenvolver funcionalidades em branches próprias e integrá-las à principal.
- [ ] Explicar a estratégia no README e nas instruções para IA.
- [ ] Conferir histórico público que reflita o desenvolvimento realizado.

**Evidência:** branches, commits e integrações reais. Não inventar datas ou atividades para simular um histórico distribuído.

### 12 — Arquitetura e padronização

- [ ] Conferir pastas com responsabilidades claras e componentes pequenos/reutilizáveis.
- [ ] Conferir lógica de API separada da apresentação.
- [ ] Documentar nomenclatura no README e nas instruções para IA.
- [ ] Conferir funcionamento das verificações automáticas de código e formatação.
- [ ] Conseguir explicar um exemplo real de página, componente, serviço e hook, quando utilizado.

**Evidência:** estrutura real do projeto, documentação e saída de verificações automatizadas.

## 4. Repositório e vídeo

- [ ] README informa objetivo, stack, configuração e comandos para executar o projeto.
- [ ] README aponta para as decisões e o roteiro/checklist quando apropriado.
- [ ] `.env.example` lista as variáveis necessárias sem valores secretos.
- [ ] A documentação diferencia recursos implementados, configuração pendente e resultados verificados.
- [ ] O vídeo tem até 8 minutos, com rosto e tela visíveis durante todo o tempo.
- [ ] O vídeo apresenta stack, diagrama/estrutura, critérios de divisão e fluxo da branch ao deploy.
- [ ] O vídeo justifica escolhas relevantes com alternativas, critérios e concessões.
- [ ] O vídeo identifica a ferramenta e o modelo de IA realmente utilizados.
- [ ] O vídeo mostra instruções, skills, conectores/MCPs e agentes configurados que efetivamente participaram, com arquivos versionados.
- [ ] O vídeo explica como o ambiente de IA orientou arquitetura, código, commits e branches, e como o resultado foi verificado.
- [ ] O aluno consegue explicar o código apresentado e relata limitações honestamente.
- [ ] Campos `[PENDENTE]` e placeholders dos links foram substituídos apenas por informações reais onde a entrega exige conclusão.

O roteiro sugerido está em [ROTEIRO-VIDEO.md](./ROTEIRO-VIDEO.md). As decisões e links de documentação oficial estão em [DECISOES.md](./DECISOES.md).
