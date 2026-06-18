# PulmoAgents - pacote corrigido para publicação

Este pacote mantém a estrutura administrativa do PulmoAgents original e incorpora os novos agentes listados no index.html enviado.

## O que foi preservado

- Painel de administrador.
- Login administrativo local.
- Cadastro/login médico local.
- Solicitações de acesso por agente.
- Aprovação pelo administrador.
- Licença trial de 7 dias.
- Extensão por mais 7 dias.
- Liberação permanente.
- Revogação de licença.
- Persistência local por localStorage/sessionStorage.
- Função Netlify `netlify/functions/cadastro-medico.js` para envio administrativo por e-mail.

## O que foi corrigido

- O arquivo principal está como `index.html` em minúsculas.
- O arquivo antigo `Index.html` foi removido para evitar conflito no GitHub Pages/Netlify.
- A estrutura de pastas esperada foi recriada.
- Os agentes novos foram incluídos no catálogo do portal.

## Agentes no catálogo

- Bronquiectasias 2026.
- SIA-PRO.
- EspiroLab2.
- Agente de Avaliação Pré-Operatória.
- Primeira Consulta em Pneumologia.

## Estrutura esperada

```text
/
├── index.html
├── netlify.toml
├── netlify/functions/cadastro-medico.js
├── agentes/
│   ├── bronquiectasias/
│   ├── espirolab2/
│   ├── espirometria/
│   ├── preoperatorio/
│   └── consulta/
└── biblioteca/
    ├── escalas/
    └── infograficos/
        ├── medicos/
        └── pacientes/
```

## Arquivos dos agentes que devem ser colocados nas pastas

```text
agentes/bronquiectasias/Agente_Bronquiectasias_PneumoAgents_2026.html
agentes/bronquiectasias/Manual_Uso_Agente_Bronquiectasias_PneumoAgents_2026.pdf
agentes/espirolab2/EspiroLab2.htm
agentes/espirolab2/EspirolabII__Manual_de_Uso.pdf
agentes/espirometria/       # colocar aqui o HTML definitivo do SIA-PRO quando definido
agentes/preoperatorio/      # colocar aqui o HTML definitivo do pré-operatório
agentes/consulta/           # colocar aqui o HTML definitivo da primeira consulta
```

## Publicação no GitHub

1. Descompacte este pacote.
2. Abra o repositório do GitHub.
3. Faça backup dos arquivos atuais.
4. Apague o `Index.html` antigo, caso exista.
5. Suba todo o conteúdo deste pacote para a raiz do repositório.
6. Faça commit.
7. Ative ou confira GitHub Pages em Settings > Pages.
8. Acesse a URL pública do GitHub Pages.

## Publicação no Netlify

Este pacote já inclui `netlify.toml` e a função serverless. Para o envio de e-mail funcionar, configure no Netlify:

- `RESEND_API_KEY`
- `ADMIN_EMAIL`
- `FROM_EMAIL` opcional
- `CORS_ORIGIN` opcional, com o domínio público do portal

## Observação de segurança

O controle atual usa localStorage e serve para controle leve, teste local e demonstração. Para venda comercial ampla, recomenda-se evoluir para banco externo, por exemplo Supabase, com autenticação real e validação de licença no servidor.
