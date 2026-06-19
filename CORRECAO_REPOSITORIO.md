# Correção do repositório pneumoagentes

## Problema identificado
O arquivo `index.html` foi sobrescrito com código JavaScript da função `license-check.js`. Por isso o domínio Netlify mostra o código da função em vez da página inicial.

## Correção segura
1. Baixar e descompactar este pacote.
2. No GitHub, apagar os arquivos soltos errados na raiz, especialmente:
   - `app.js`
   - `config.js`
   - `dashboard.html`
   - `download (2)`
   - `download (4)`
   - `download (5)`
   - `download (7)`
   - qualquer `license-check.js` fora de `netlify/functions/`
3. Subir todos os arquivos deste pacote respeitando as pastas.
4. Confirmar que a raiz contém `index.html` com código HTML começando por `<!doctype html>`.
5. Confirmar que `license-check.js` está apenas em `netlify/functions/license-check.js`.
6. Fazer commit: `Reconstrói árvore limpa do PulmoAgents Enterprise`.
7. No Netlify, clicar em `Trigger deploy` ou `Retry deploy`.

## Netlify
O arquivo `netlify.toml` correto é:

```toml
[build]
command = ""
publish = "."

[functions]
directory = "netlify/functions"
```
