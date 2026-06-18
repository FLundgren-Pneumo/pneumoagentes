# PulmoAgents Enterprise - Arquitetura

## Objetivo
Reconstruir o PulmoAgents como plataforma comercial de agentes HTML para pneumologia, com cadastro médico, solicitação de acesso, aprovação administrativa, trial de 7 dias, licença permanente e logs.

## Stack
- GitHub: repositório do código.
- Netlify: deploy e funções serverless.
- Supabase: banco, autenticação, políticas RLS e armazenamento futuro.

## Fluxo médico
1. Médico se cadastra.
2. Solicita acesso a um agente.
3. Admin aprova ou rejeita.
4. Sistema cria licença trial de 7 dias ou licença permanente.
5. Médico abre/baixa o agente autorizado.
6. Download/acesso é registrado.

## Fluxo admin
1. Login admin.
2. Visualiza médicos, solicitações e licenças.
3. Aprova trial, concede licença permanente, revoga ou bloqueia.
4. Acompanha catálogo e logs básicos.

## Catálogo inicial
- Bronquiectasias 2026
- SIA-PRO
- EspiroLab2
- Avaliação Pré-Operatória
- Primeira Consulta em Pneumologia
- Decisor Biológicos Asma Grave
- Guia PAC
- Tampões Mucosos
- Alfa-1 Antitripsina Screen

## Próximos passos técnicos
1. Criar projeto Supabase.
2. Executar `supabase/schema.sql`.
3. Preencher `assets/js/config.js` com URL e anon key.
4. Substituir protótipo localStorage por Supabase Auth + tabelas.
5. Proteger downloads com Netlify Functions e service role.
6. Remover placeholders e inserir os HTML/PDF definitivos dos agentes.


## Requisito administrativo adicional

O administrador deve poder excluir registros diretamente pelo portal, sem editar arquivos no GitHub:

- médicos;
- solicitações;
- licenças;
- registros locais de teste.

Na versão com Supabase, recomenda-se não apagar fisicamente registros críticos por padrão. A exclusão operacional pode usar `deleted_at`, `deleted_by` e `delete_reason`, mantendo trilha de auditoria para segurança, suporte e conformidade.


## Atualização administrativa: exclusão de agentes

O painel administrativo agora permite excluir agentes diretamente pelo portal. Na versão protótipo, a exclusão remove o agente do catálogo público via `localStorage`, bloqueia novas solicitações e apaga solicitações/licenças vinculadas ao agente no navegador. Também há opção de restaurar o agente. Na versão Supabase, essa ação deverá corresponder a alteração `status = excluido` ou remoção lógica no banco, com log administrativo.
