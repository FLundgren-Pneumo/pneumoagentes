# Correção PulmoAgents

Este pacote corrige a estrutura básica do portal para GitHub/Netlify:

- `index.html` na raiz em minúsculas.
- `netlify.toml` preservado.
- `netlify/functions/cadastro-medico.js` preservado para cadastro administrativo.
- Mecanismos PulmoAgents preservados: login médico/admin, painel administrativo, solicitações, aprovações, licenças por médico/agente, teste de 7 dias, revogação/extensão/permanente via localStorage.
- Novos agentes do `index.html` enviado adicionados ao catálogo inicial:
  - Agente Bronquiectasias 2026
  - SIA-PRO
  - EspiroLab2
  - Agente de Avaliação Pré-Operatória
  - Primeira Consulta em Pneumologia
- Links externos/folders do GitHub foram mantidos em `arquivo_url` e protegidos pelo mesmo fluxo de acesso.

Observação: este pacote não inclui os arquivos HTML/PDF dos agentes referenciados por caminho. Eles devem existir no repositório GitHub nas pastas indicadas.
