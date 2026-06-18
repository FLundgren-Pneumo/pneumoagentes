# PulmoAgents Enterprise

Estrutura inicial da versão Enterprise do PulmoAgents.

## Publicação rápida
1. Subir todo o conteúdo deste diretório para o GitHub.
2. Publicar pelo Netlify ou GitHub Pages.
3. Para controle real de licenças, usar Netlify + Supabase.

## Arquivos principais
- `index.html`: landing page.
- `catalogo.html`: catálogo oficial.
- `cadastro-medico.html`: cadastro médico.
- `login-medico.html`: login médico em protótipo local.
- `admin/dashboard.html`: painel admin em protótipo local.
- `assets/js/catalogo.js`: lista central dos agentes.
- `supabase/schema.sql`: schema inicial do banco.
- `docs/ARQUITETURA_ENTERPRISE.md`: documentação técnica.

## Observação
A versão entregue aqui é a base estrutural. O fluxo já funciona em modo local usando `localStorage` para validação. A próxima etapa é migrar a persistência e autenticação para Supabase.


## Atualização administrativa

O painel `admin/dashboard.html` agora inclui exclusão direta pelo portal:

- excluir médico cadastrado;
- excluir solicitação de acesso;
- excluir licença;
- limpar todos os dados locais do protótipo.

Toda exclusão exige confirmação explícita. Na etapa Supabase, essas ações devem ser implementadas com autenticação administrativa, RLS, soft delete opcional e tabela de auditoria.
