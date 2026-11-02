# Como a IA foi orientada neste projeto

## O que foi utilizado nesta preparação

Este projeto foi preparado com auxílio do ChatGPT nesta conversa, usando o modelo
GPT-6 Astra Pro. O aluno precisa revisar e compreender os arquivos antes da entrega.
Se a ferramenta ou modelo mudar durante a continuação, registre aqui a mudança.

O objetivo da escolha foi reunir leitura do enunciado, implementação, revisão e
execução de verificações em um mesmo trabalho. Não foi feito benchmark entre modelos;
não há base para afirmar que este é o melhor modelo ou o mais barato.

### Instruções do projeto

O arquivo `AGENTS.md` foi criado antes da implementação e foi indicado aos agentes.
Ele define as responsabilidades das pastas, nomenclatura, separação de segredos,
validações, branches, commits e critérios de revisão. `docs/CONTRATOS.md` fixou a
forma das requisições e respostas para que a interface e o servidor fossem compatíveis.

### Skills utilizadas no ambiente da conversa

- **Sites:** orientação de organização, design e verificação da interface. O destino
  solicitado no enunciado é a Vercel; não foi substituído por uma hospedagem do ChatGPT.
- **Library:** organização e entrega do arquivo gerado.

Essas skills são recursos do ambiente do ChatGPT. Não são dependências do aplicativo
nem foram instaladas como skills locais neste repositório. Seus textos completos não
foram copiados. O código do site funciona sem essas ferramentas.

### Agentes e divisão de trabalho realmente utilizada

| Papel                             | Responsabilidade                                                        | Isolamento                            |
| --------------------------------- | ----------------------------------------------------------------------- | ------------------------------------- |
| Coordenador                       | Contratos, serviços do cliente, integração, testes e entrega            | Branch `feature/integracao`           |
| Interface                         | Páginas públicas, formulário, login, dashboard e CSS                    | Worktree e branch `feature/interface` |
| Servidor                          | Funções da API, autorização, banco, e-mail e instruções de configuração | Worktree e branch `feature/backend`   |
| Revisão do enunciado/documentação | Conferir requisitos e preparar roteiro/checklist                        | Arquivos separados, integrados depois |

São agentes delegados nesta conversa. Não há configuração de agentes locais que
execute sozinha no computador do aluno. Os nomes de branch e as integrações ficam no
histórico do Git. O histórico incluído registra esta preparação, em datas reais;
ele não comprova trabalho do aluno em dias anteriores.

### Ferramentas e conectores

Foram utilizados leitura dos prints, consulta a documentação pública, comandos no
terminal, edição de arquivos e delegação de tarefas. A configuração de contas do
Supabase, Resend, GitHub e Vercel ainda depende do usuário.

Não foi configurado um MCP com acesso às contas do aluno e não foram usadas chaves
dele. A escolha evita conceder permissões de alteração desnecessárias para preparar
o código. Em contrapartida, configurar os serviços e publicar requer ações manuais.
Não apresente no vídeo um conector ou MCP como utilizado se ele não foi realmente
configurado. Se o professor exigir um MCP específico, confirme esse ponto e
documente a configuração real, sem inventar arquivo ou execução.

## Como as regras são verificadas

As instruções orientam a geração, mas não garantem que toda saída esteja correta.
O projeto usa verificações executáveis:

1. ESLint encontra problemas de código e regras de hooks.
2. Prettier verifica formatação.
3. Testes verificam comportamentos do formulário, proteção de rotas, cache e API.
4. Vite compila a versão de produção.
5. Hooks locais e GitHub Actions repetem verificações nas próximas alterações.

O relatório `docs/VALIDACAO.md` deve registrar somente verificações realmente
executadas. Conta configurada, e-mail recebido, site publicado e Lighthouse mobile
precisam de evidência própria: build local não comprova esses pontos.

## Como continuar com a IA

Antes de uma alteração, forneça `AGENTS.md`, o requisito e os arquivos envolvidos.
Peça uma explicação do que mudará e revise o diff. Faça a alteração em uma branch,
execute as verificações e só depois integre à `main`. Registre a decisão relevante
em `docs/DECISOES.md` e repita o comportamento no site publicado.

Exemplo de instrução para continuar:

> Leia AGENTS.md e docs/CONTRATOS.md. Na branch fix/contato, investigue este erro
> de envio. Preserve validação no cliente e no servidor e a deduplicação por UUID.
> Mostre a causa, a mudança e os testes executados. Não exponha chaves nem afirme
> que o e-mail chegou sem uma verificação real.
