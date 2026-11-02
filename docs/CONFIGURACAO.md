# Configuração das integrações e publicação

O código contém a integração, mas precisa das suas contas e variáveis para funcionar com dados reais.
Não existem usuário, senha, banco nem serviço de e-mail compartilhados neste projeto.

## 1. Abrir o projeto no computador

Instale uma versão do Node.js compatível com `engines` em `package.json` e abra a pasta do projeto
no VS Code. No terminal dessa pasta:

```bash
npm ci
```

Copie `.env.example` para um arquivo chamado `.env.local`, na mesma pasta do `package.json`.
Preencha as variáveis nas próximas etapas. `.env.local` é ignorado pelo Git.

Para visualizar somente o frontend, use `npm run dev`. Para frontend **e API local**, use:

```bash
npm run dev:full
```

Esse comando carrega `.env.local`, inicia a API na porta 3001 e o Vite. Abra a URL do Vite indicada
no terminal. Não abra o HTML com duplo clique e não use a porta da API como endereço do site.

## 2. Criar o banco e o login no Supabase

1. Acesse [supabase.com](https://supabase.com/) e crie um projeto seu.
2. Abra o SQL Editor do projeto. Copie **todo** o conteúdo de `supabase/schema.sql` e execute.
   O script cria mensagens, destaques e o limitador de contatos. Pode ser repetido sem apagar dados.
3. Na área Authentication, crie manualmente seu usuário com e-mail e uma senha forte. Use a opção
   que permite confirmar esse usuário no painel, para não depender de uma etapa de confirmação
   por e-mail durante a prova. **Não publique a senha nem a coloque em arquivos do projeto.**
4. Copie o UUID do usuário criado para `PORTFOLIO_OWNER_ID`. É o ID do usuário em Authentication,
   não o ID do projeto Supabase.
5. Desative novos cadastros públicos na configuração do Auth. O site oferece somente login para
   o proprietário, sem uma tela de cadastro.
6. Nas configurações de conexão/API, copie a URL do projeto e as chaves adequadas.

Preencha assim:

| Variável                        | Valor                                          | Visível no navegador? |
| ------------------------------- | ---------------------------------------------- | --------------------- |
| `VITE_SUPABASE_URL`             | URL HTTPS do projeto Supabase                  | Sim                   |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Chave **publishable**, ou a antiga **anon**    | Sim                   |
| `SUPABASE_URL`                  | A mesma URL do projeto                         | Não                   |
| `SUPABASE_SECRET_KEY`           | Chave **secret**, ou a antiga **service_role** | Não                   |
| `PORTFOLIO_OWNER_ID`            | UUID do seu usuário proprietário               | Não                   |

**Não troque as chaves:** a chave secret/service_role permite operações administrativas e nunca
pode aparecer em uma variável `VITE_`, em um print público, no GitHub ou no vídeo.

As tabelas têm RLS ativada e acesso direto negado a visitantes e usuários comuns. A função
`/api/dashboard` valida o token no Supabase e compara o ID do usuário com `PORTFOLIO_OWNER_ID`
antes de ler mensagens ou alterar destaques. Essa comparação protege os dados mesmo que alguém
tente chamar a API sem usar a interface.

O identificador público de um repositório em destaque fica em `featured_projects`. Os dados e
descrições dos projetos continuam vindo da API do GitHub, sem cadastro manual de cards.

## 3. Ativar o e-mail no Resend

1. Acesse [resend.com](https://resend.com/) e crie sua conta.
2. Crie uma chave de API para envio de e-mails e salve o valor em `RESEND_API_KEY`.
3. Defina `CONTACT_EMAIL` com o endereço que deve receber os contatos.
4. Para a demonstração usando o remetente `onboarding@resend.dev`, o destinatário deve ser o
   **mesmo endereço usado na sua conta Resend**. Isso permite receber as notificações sem precisar
   configurar um domínio próprio para esta demonstração.
5. Mantenha `CONTACT_FROM="Portfolio <onboarding@resend.dev>"` no arquivo local.

Para usar outro destinatário ou um remetente com sua marca, siga a verificação de domínio do
Resend e altere `CONTACT_FROM` para um endereço desse domínio. O código define o `reply_to` com o
e-mail preenchido pelo visitante; responder à notificação no seu aplicativo de e-mail direciona
a resposta a ele.

### O que acontece no envio

O servidor valida os campos, grava a mensagem e solicita o envio da notificação ao Resend.
Só retorna sucesso quando o provedor aceita o envio e o status é registrado no banco.
Se a notificação falhar depois da gravação, a interface informa que a mensagem foi salva e que
o e-mail não foi confirmado. Ela continua disponível no dashboard.

Cada tentativa usa um UUID. Repetir a mesma mensagem com esse UUID não cria outra linha no
banco. A API do Resend recebe a mesma chave de idempotência; essa proteção do provedor dura 24
horas. O servidor impede retentativas automáticas de registros pendentes com mais de 23 horas,
para não reutilizar uma chave fora da janela garantida. O proprietário ainda pode consultar a
mensagem salva no dashboard.

O formulário tem um campo invisível de proteção contra robôs e limita novos contatos a cinco
por origem em uma janela de 15 minutos. A contagem é atômica no banco. Em produção, usa o IP
informado pela Vercel, transformado em hash com uma chave privada; o IP em texto não é salvo.
Contadores antigos são removidos no próximo processamento depois de um dia.

Essas medidas são adequadas a esta demonstração. Para um site com tráfego elevado, considere
proteção adicional contra abuso e acompanhamento dos limites dos serviços escolhidos.

## 4. Conferir localmente

Reinicie `npm run dev:full` depois de alterar `.env.local`.

1. Abra `/projetos` e confirme que os repositórios do seu GitHub aparecem.
2. Acesse `/dashboard` em uma janela anônima: o site deve pedir login.
3. Entre em `/login` com seu usuário proprietário. Selecione destaques e confirme que aparecem
   na home em outra janela.
4. Envie uma mensagem de teste pelo seu próprio formulário. **Essa ação envia um e-mail real.**
   Confirme a mensagem no dashboard e na caixa de entrada, incluindo a pasta de spam.
5. Marque a mensagem como respondida e recarregue o painel para conferir a persistência.

Os testes automatizados usam serviços simulados e não enviam e-mails. A confirmação das suas
credenciais e a entrega real só podem ser verificadas após você concluir esta configuração.

## 5. Publicar no GitHub e na Vercel

Siga o procedimento do README para manter o histórico real de branches e commits ao enviar o
projeto para um repositório **público** seu. Antes do push, verifique se `.env.local` não aparece
em `git status` nem nos arquivos preparados para commit. Mantenha `.env.example` versionado.

Na [Vercel](https://vercel.com/), conecte sua conta GitHub e importe o repositório. Configure:

| Configuração       | Valor                                      |
| ------------------ | ------------------------------------------ |
| Framework          | Vite                                       |
| Diretório raiz     | Pasta que contém o `package.json`          |
| Build              | `npm run build`                            |
| Diretório de saída | `dist`                                     |
| Branch de produção | `main`                                     |
| Versão do Node.js  | Compatível com `engines` em `package.json` |

Adicione **todas** as variáveis do `.env.local` às Environment Variables do projeto na Vercel,
com os valores correspondentes. No painel da Vercel, não inclua aspas extras em `CONTACT_FROM`.
As variáveis `VITE_` são lidas durante o build; alterar seu valor exige um novo deployment.

O arquivo `vercel.json` preserva os arquivos estáticos e funções de `/api` antes de direcionar
as rotas do React para `index.html`. Isso permite compartilhar e atualizar diretamente uma URL
como `/projetos/nome-do-repositorio` sem quebrar a navegação.

Com a integração GitHub conectada e a branch de produção definida como `main`, o push nessa
branch aciona a publicação. Faça uma pequena alteração real em uma branch de trabalho, valide,
integre à `main`, envie e confirme o novo deployment. Isso é a evidência do fluxo pedido na prova.

Abra a URL publicada sem login na Vercel para confirmar que o professor consegue acessar o site.
Se a proteção de deployment estiver impedindo o acesso público, ajuste a configuração de
acesso desse projeto de demonstração no painel da Vercel.

## 6. Verificações antes da entrega

- Testes, lint, formatação e build aprovados.
- URLs de detalhes funcionam por acesso direto e após atualizar a página.
- Formulário inválido apresenta erros específicos e não envia.
- Formulário válido chega ao dashboard e ao seu e-mail.
- Dashboard não expõe dados sem o login do dono.
- Destaques alterados pelo dono aparecem para outro visitante.
- Tema continua selecionado após recarregar e reabrir o navegador.
- Layout conferido em celular e desktop.
- Lighthouse executado em **mobile na URL publicada**, com Performance de pelo menos 80.
- Links do GitHub, Vercel e vídeo não listado prontos para enviar no Teams.

Nenhum resultado de Lighthouse ou de envio real deve ser declarado antes de você verificá-lo.

## Solução de problemas comuns

| Sintoma                                          | O que conferir                                                                |
| ------------------------------------------------ | ----------------------------------------------------------------------------- |
| `npm run dev` abre o site, mas o contato falha   | Para usar a API local, execute `npm run dev:full`.                            |
| Erro 503 nos destaques/painel                    | Variáveis do servidor, schema SQL e disponibilidade do Supabase.              |
| Login aceita credenciais, mas painel retorna 403 | `PORTFOLIO_OWNER_ID` deve ser o UUID exato desse usuário.                     |
| Login não confirma o usuário                     | Confirmação do usuário em Authentication e configuração de e-mail.            |
| Mensagem salva, e-mail falha                     | Chave Resend, remetente e destinatário permitido pelo domínio de teste.       |
| Erro 429 no contato                              | Aguarde a janela de 15 minutos; não remova a proteção para disfarçar o teste. |
| Funciona local, mas não publicado                | Inclua também as variáveis privadas na Vercel e publique novamente.           |
| CSS/JavaScript não carrega ao abrir um arquivo   | Use o servidor; este projeto não funciona por `file://`.                      |

## Fontes técnicas

- [Supabase com React](https://supabase.com/docs/guides/getting-started/quickstarts/reactjs)
- [Autenticação por senha](https://supabase.com/docs/guides/auth/passwords)
- [Validação de usuário com getUser](https://supabase.com/docs/reference/javascript/auth-getuser)
- [Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Vite na Vercel](https://vercel.com/docs/frameworks/frontend/vite)
- [Funções Node.js na Vercel](https://vercel.com/docs/functions/runtimes/node-js)
- [Restrição do domínio de teste do Resend](https://resend.com/docs/knowledge-base/403-error-resend-dev-domain)
- [Idempotência no Resend](https://resend.com/docs/dashboard/emails/idempotency-keys)
