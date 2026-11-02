# Instruções de trabalho — Portfólio CP3

## Objetivo

Portfólio de Paulo Henrique em React e JavaScript, publicado na Vercel.
Todos os 12 requisitos dos prints do CP3 precisam ser verificáveis.

## Arquitetura

- Componentes e páginas em PascalCase; hooks começam com `use`.
- `src/components`: interface reutilizável; `src/pages`: composição das telas.
- `src/services`: acesso HTTP e autenticação; `src/hooks`: estado compartilhável.
- `api`: funções da Vercel; `server`: regras e integrações privadas.
- `shared`: validação pura utilizada pelo formulário e pelo servidor.
- Nunca colocar credenciais privadas em variáveis `VITE_`.
- Dados dos projetos vêm do GitHub, sem inventar repositórios ou resultados.
- Preferências públicas ficam no banco; localStorage serve somente ao tema.
- A API verifica o token e o ID do proprietário antes de ler mensagens ou alterar dados.

## Fluxo

1. Leia estas instruções, o requisito envolvido e os contratos existentes.
2. Trabalhe em `feature/nome`, `fix/nome` ou `docs/nome`.
3. Faça a menor implementação que atenda ao requisito e seja explicável.
4. Rode lint, formatação, testes relevantes e build.
5. Integre a branch à `main` com histórico preservado.

Commits usam `feat:`, `fix:`, `test:`, `docs:`, `chore:` ou `style:`.
Não falsifique datas, autoria, execução de ferramentas, notas de Lighthouse ou histórico.
Não envie mensagens, e-mails reais ou altere serviços externos sem a ação do usuário.

## Revisão obrigatória

- Contato: validação por campo, espera, proteção contra duplicidade, erro e sucesso.
- Dashboard: visitante é redirecionado; API sem token ou com outro usuário é rejeitada.
- GitHub: cache entre rotas e estados de carregamento, erro e vazio.
- Imagens com tamanho reservado; layout utilizável em celular e desktop.
- Segredos fora do Git e das saídas de comandos.
- Documente o que realmente foi executado e o que depende das contas do aluno.
