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
