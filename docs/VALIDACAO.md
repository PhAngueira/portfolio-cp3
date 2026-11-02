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

## Ainda não comprovado

- Execução do SQL em uma instância real do Supabase.
- Login real com a conta do proprietário.
- Gravação/leitura de mensagens, alterações de resposta e destaques no banco real.
- Recebimento de e-mail na caixa do proprietário.
- Push para um repositório GitHub do aluno e execução remota do workflow.
- Publicação na Vercel, rewrites em produção e deploy automático após push.
- **Nota de Performance no Lighthouse mobile: não medida.** O requisito é pelo menos 80.
- Gravação, publicação do vídeo e envio dos três links no Teams.

Esses itens devem ser conferidos após seguir `CONFIGURACAO.md`.
Não declare no vídeo que passaram até observar o resultado real.

## Histórico

As branches e commits incluídos registram a preparação atual. Não foram atribuídas
datas antigas. Os commits iniciais usam a identidade técnica `Portfolio CP3`; antes
de continuar, o aluno deve configurar seu nome/e-mail conforme o README e registrar
as alterações que ele efetivamente revisar e realizar.
