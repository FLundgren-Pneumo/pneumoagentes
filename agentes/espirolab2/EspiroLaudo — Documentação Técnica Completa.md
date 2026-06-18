# EspiroLaudo — Documentação Técnica Completa

> Agente de espirometria com IA para geração de laudos médicos. Desenvolvido sobre a stack React 19 + Express 4 + tRPC 11 + MySQL/TiDB, hospedado na plataforma Manus.

---

## 1. Visão Geral do Sistema

O **EspiroLaudo** é uma aplicação web médica que automatiza o fluxo completo de laudos espirométricos:

1. Upload do PDF do espirômetro
2. Extração automática de dados via OCR com LLM (GPT-4o)
3. Cálculo por equações de referência brasileiras (SBPT 2024)
4. Geração de interpretação clínica via LLM (Protocolo Lundgren v7)
5. Geração de laudo Word (.docx) e PDF
6. Histórico de exames com exportação Excel (4 abas)

O sistema possui autenticação customizada para médicos (JWT + bcryptjs), painel administrativo, sistema de licença trial/pago e notificações ao proprietário.

---

## 2. Stack Tecnológica

### Backend

| Tecnologia | Versão | Uso |
|---|---|---|
| Node.js | 22.x | Runtime |
| TypeScript | 5.9.3 | Tipagem estática |
| Express | 4.x | Servidor HTTP |
| tRPC | 11.x | API type-safe (sem REST manual) |
| Drizzle ORM | 0.44.x | Queries e schema do banco |
| MySQL / TiDB | — | Banco de dados relacional |
| bcryptjs | 3.x | Hash de senhas |
| jose | 6.x | JWT (geração e verificação) |
| docx | 9.x | Geração de laudos Word (.docx) |
| exceljs | 4.x | Exportação Excel (.xlsx) |
| canvas | 3.x | Renderização de curvas fluxo-volume em PNG |
| puppeteer-core | 25.x | Geração de PDF via Chromium headless |
| zod | 4.x | Validação de inputs nos endpoints tRPC |

### Frontend

| Tecnologia | Versão | Uso |
|---|---|---|
| React | 19.x | Framework UI |
| Vite | 7.x | Build e HMR |
| Tailwind CSS | 4.x | Estilização utilitária |
| shadcn/ui | — | Componentes Radix UI pré-estilizados |
| TanStack Query | 5.x | Cache e sincronização de dados |
| wouter | 3.x | Roteamento client-side |
| recharts | 2.x | Gráficos interativos (curvas FV) |
| framer-motion | 12.x | Animações |
| sonner | 2.x | Notificações toast |

### Infraestrutura

| Serviço | Uso |
|---|---|
| Manus Platform | Hosting, banco de dados, S3, OAuth, LLM proxy |
| AWS S3 (via Manus) | Armazenamento de arquivos Word e PDF |
| GPT-4o (via Manus Forge API) | OCR de PDFs + geração de interpretação clínica |

---

## 3. Estrutura de Arquivos

```
espirolaud_comercial/
├── client/
│   ├── index.html                    ← Ponto de entrada HTML
│   └── src/
│       ├── App.tsx                   ← Rotas e layout global
│       ├── index.css                 ← Tokens de design (OKLCH)
│       ├── main.tsx                  ← Providers React
│       ├── contexts/
│       │   └── DoctorAuthContext.tsx ← Estado de autenticação do médico
│       ├── components/
│       │   ├── AppLayout.tsx         ← Layout com sidebar (wizard)
│       │   ├── FlowVolumeCurve.tsx   ← Gráfico interativo de curvas FV
│       │   └── ui/                   ← Componentes shadcn/ui
│       └── pages/
│           ├── Home.tsx              ← Landing page + login split-screen
│           ├── Login.tsx             ← Formulário de login
│           ├── Register.tsx          ← Cadastro de médico
│           ├── NewExam.tsx           ← Wizard de 5 etapas (principal)
│           ├── History.tsx           ← Histórico de exames
│           ├── ExamDetail.tsx        ← Detalhes de exame individual
│           ├── Profile.tsx           ← Perfil do médico
│           ├── Admin.tsx             ← Painel administrativo
│           ├── TrialExpirado.tsx     ← Página de trial expirado
│           ├── LicencaExpirada.tsx   ← Página de licença expirada
│           └── PendingApproval.tsx   ← Aguardando aprovação do admin
├── server/
│   ├── routers.ts                    ← Todos os endpoints tRPC
│   ├── spirometry.ts                 ← Motor de cálculo espirométrico
│   ├── spirometry.test.ts            ← 55 testes Vitest
│   ├── auth.logout.test.ts           ← Teste de autenticação
│   ├── doctorAuth.ts                 ← Auth customizada (JWT + bcrypt)
│   ├── db.ts                         ← Helpers de banco de dados
│   ├── wordGenerator.ts              ← Geração de laudo Word
│   ├── pdfGenerator.ts               ← Geração de laudo PDF
│   ├── excelGenerator.ts             ← Exportação Excel 4 abas
│   ├── curveRenderer.ts              ← Renderização de curvas FV em PNG
│   ├── gli2022.ts                    ← Equações GLI 2022 race-neutral
│   ├── gli2022Splines.ts             ← Splines LMS para GLI 2022
│   └── storage.ts                    ← Helpers S3
├── drizzle/
│   ├── schema.ts                     ← Definição das tabelas
│   ├── relations.ts                  ← Relações Drizzle
│   └── migrations/                   ← Migrações SQL (0000–0006)
└── shared/
    ├── const.ts                      ← Constantes compartilhadas
    └── types.ts                      ← Tipos compartilhados
```

---

## 4. Banco de Dados

### 4.1 Tabelas

O banco possui 4 tabelas principais:

#### `users`
Tabela de compatibilidade com o framework Manus OAuth. Não usada diretamente pela aplicação.

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | INT PK | Identificador |
| `openId` | VARCHAR(64) | ID do Manus OAuth |
| `name` | TEXT | Nome |
| `email` | VARCHAR(320) | E-mail |
| `role` | ENUM(user, admin) | Papel |

#### `doctors`
Médicos cadastrados no sistema com autenticação própria.

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | INT PK | Identificador |
| `nome` | VARCHAR(200) | Nome completo |
| `email` | VARCHAR(320) UNIQUE | E-mail de login |
| `senhaHash` | VARCHAR(255) | Hash bcrypt da senha |
| `crm` | VARCHAR(20) | CRM |
| `ufCrm` | VARCHAR(2) | UF do CRM |
| `rqe` | VARCHAR(20) | RQE (opcional) |
| `especialidade` | VARCHAR(100) | Especialidade médica |
| `role` | ENUM(medico, admin) | Papel no sistema |
| `ativo` | TINYINT | 0 = inativo |
| `status` | ENUM(pendente, aprovado, bloqueado) | Status de acesso |
| `nomeExibicao` | VARCHAR(200) | Nome no cabeçalho do laudo |
| `clinicaNome` | VARCHAR(200) | Nome da clínica |
| `clinicaEndereco` | VARCHAR(400) | Endereço |
| `clinicaTelefone` | VARCHAR(30) | Telefone |
| `clinicaSite` | VARCHAR(200) | Site |
| `clinicaLogo` | TEXT | URL do logo no S3 |
| `tipoLicenca` | ENUM(trial, pago, admin) | Tipo de licença |
| `trialExpira` | TIMESTAMP | Expiração do trial (7 dias) |
| `licencaExpira` | TIMESTAMP | Expiração da licença paga |

#### `exam_records`
Exames espirométricos com todos os valores calculados (~70 campos).

| Grupo | Campos |
|---|---|
| Identificação | `id`, `doctorId`, `convenio`, `tecnico`, `medico`, `cid` |
| Paciente | `nomePaciente`, `dataNascimento`, `dataExame`, `sexo`, `idade`, `alturaCm`, `pesoKg`, `corPele`, `diagnostico` |
| Previstos + LIN | `cvfPrev`, `cvfLin`, `vef1Prev`, `vef1Lin`, `ratioPrev`, `ratioLin`, `fefPrev`, `fefLin` |
| Pré-BD | `cvfPre`, `cvfPrePct`, `vef1Pre`, `vef1PrePct`, `ratioPre`, `ratioPrePct`, `fefPre`, `fefPrePct`, `pefrPre`, `cvlPre`, `ciPre`, `ervPre` |
| Z-scores Pré | `zCvfPre`, `zVef1Pre`, `zRatioPre`, `zFefPre` |
| Pós-BD | `cvfPos`, `cvfPosPct`, `vef1Pos`, `vef1PosPct`, `ratioPos`, `fefPos`, `pefrPos`, `cvlPos` |
| Z-scores Pós | `zCvfPos`, `zVef1Pos`, `zRatioPos`, `zFefPos` |
| Padrão funcional | `padraoPre`, `gravidade`, `deltaBdVef1`, `deltaBdCvf`, `limiarBd`, `respBdVef1`, `respBdCvf`, `respBd`, `prisma`, `prismaCvfReduzida`, `paradoxoCvf` |
| Metadados | `modoEntrada`, `equacaoUsada`, `notaEquacao`, `laudoTexto`, `laudoWordKey`, `anonimizado`, `createdAt`, `updatedAt` |

#### `license_renewals`
Histórico de aprovações e renovações de licença.

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | INT PK | Identificador |
| `doctorId` | INT | Médico beneficiado |
| `renovadoPorId` | INT | Admin que renovou |
| `renovadoPorNome` | VARCHAR(200) | Nome do admin |
| `licencaAnterior` | TIMESTAMP | Expiração anterior |
| `novaExpiracao` | TIMESTAMP | Nova expiração |
| `tipo` | ENUM(aprovacao_inicial, renovacao_manual) | Tipo do evento |
| `observacao` | TEXT | Nota livre (ex: "PIX confirmado") |

### 4.2 Migrações

As migrações foram aplicadas sequencialmente via `webdev_execute_sql`:

| Arquivo | Conteúdo |
|---|---|
| `0000_shallow_sersi.sql` | Criação das tabelas `users`, `doctors`, `exam_records` |
| `0001_dry_mathemanic.sql` | Adição de campos de clínica e licença em `doctors` |
| `0002_lush_vargas.sql` | Tabela `license_renewals` |
| `0003_lucky_purple_man.sql` | Campo `modoEntrada` em `exam_records` |
| `0004_chubby_hemingway.sql` | Campos `equacaoUsada` e `notaEquacao` |
| `0005_bizarre_pet_avengers.sql` | Ampliação de `padraoPre` e `gravidade` (varchar insuficiente) |
| `0006_lying_reptil.sql` | Campos `trialExpira`, `tipoLicenca`, `nomeExibicao` |

---

## 5. Motor de Cálculo Espirométrico (`server/spirometry.ts`)

O motor implementa as equações de referência brasileiras conforme a **Diretriz SBPT 2024** (J Bras Pneumol. 2024;50(6):e20240169).

### 5.1 Seleção de Equação

```
Idade 3–12 anos  → Marcus Jones 2020 (qualquer raça)
Idade 13–17 anos → Mallozi 1995 (qualquer raça) + LIN via GLI-2022
Idade > 17 anos  → Pereira 2007 (branca/parda/amarela/indígena)
                 → Prata 2018 (negra)
Opção manual     → GLI 2022 race-neutral (3–95 anos)
```

**Nota sobre cor da pele:** Para Marcus Jones 2020, parda = corNum 1 (igual à negra), conforme nota de rodapé da Tabela 2 do artigo original. Para Pereira 2007, parda/amarela/indígena usam os coeficientes de brancos com nota explícita no laudo.

### 5.2 Parâmetros Calculados

Para cada parâmetro (CVF, VEF₁, VEF₁/CVF, FEF₂₅₋₇₅%):

- **Previsto**: valor esperado para a idade/altura/sexo/raça
- **LIN** (Limite Inferior da Normalidade): percentil 5 = Previsto − 1,645 × EPE
- **%Previsto**: (medido ÷ previsto) × 100
- **Z-score**: (medido − previsto) ÷ EPE

### 5.3 Classificação de Padrões Funcionais

| Padrão | Critério |
|---|---|
| **Normal** | VEF₁/CVF ≥ LIN e CVF ≥ LIN e VEF₁ ≥ LIN |
| **DVO** (Obstrutivo) | VEF₁/CVF < LIN |
| **DVR** (Restritivo) | VEF₁/CVF ≥ LIN e CVF < LIN e VEF₁ ≥ LIN |
| **Misto** | VEF₁/CVF < LIN e CVF < LIN |
| **PRISm** | VEF₁/CVF ≥ LIN e VEF₁ < LIN (critério Huang 2024) |

### 5.4 Graduação de Severidade (SBPT 2024, Quadro 7)

| %Previsto VEF₁ | Grau |
|---|---|
| ≥ 70% | Leve |
| 60–69% | Moderado |
| 50–59% | Moderadamente grave |
| 35–49% | Grave |
| < 35% | Muito grave |

### 5.5 Resposta ao Broncodilatador

- **Adultos (> 17 anos):** ΔVEF₁ ≥ 10% do previsto **ou** ΔCVF ≥ 10% do previsto
- **Crianças/adolescentes (≤ 17 anos):** ΔVEF₁ ≥ 10% do previsto
- Fórmula: Δ = [(pós − pré) ÷ previsto] × 100

### 5.6 Alertas Especiais

- **Paradoxo de CVF**: CVF pós-BD < CVF pré-BD (sinal de aprisionamento aéreo)
- **PRISm com CVF reduzida**: PRISm + CVF < LIN (nota adicional no laudo)
- **Nota de faixa etária**: quando a equação usada não cobre a faixa etária ideal

---

## 6. API tRPC (`server/routers.ts`)

### 6.1 Router `doctors`

| Endpoint | Tipo | Acesso | Descrição |
|---|---|---|---|
| `doctors.register` | mutation | público | Cadastro de médico (trial 7 dias automático) |
| `doctors.login` | mutation | público | Login com e-mail + senha |
| `doctors.logout` | mutation | público | Limpa cookie de sessão |
| `doctors.me` | query | público | Retorna médico autenticado pelo cookie |
| `doctors.updateProfile` | mutation | autenticado | Atualiza perfil e dados da clínica |
| `doctors.list` | query | admin | Lista todos os médicos |
| `doctors.updateStatus` | mutation | admin | Aprovar/bloquear/reativar médico |
| `doctors.remove` | mutation | admin | Remove médico (não pode remover a si mesmo) |
| `doctors.renovarLicenca` | mutation | admin | Renova licença por 30 dias |
| `doctors.listarRenovacoes` | query | admin | Histórico de renovações |
| `doctors.converterParaPago` | mutation | admin | Converte trial → pago |

### 6.2 Router `exams`

| Endpoint | Tipo | Acesso | Descrição |
|---|---|---|---|
| `exams.extractFromPdf` | mutation | público | OCR via GPT-4o (imagem base64) |
| `exams.calculate` | mutation | público | Cálculo espirométrico completo |
| `exams.generateInterpretation` | mutation | público | Interpretação LLM (Protocolo Lundgren v7) |
| `exams.save` | mutation | autenticado | Salva exame no banco |
| `exams.generateWord` | mutation | autenticado | Gera laudo Word e salva no S3 |
| `exams.generatePdf` | mutation | autenticado | Gera laudo PDF e salva no S3 |
| `exams.list` | query | autenticado | Lista exames com paginação e filtros |
| `exams.getById` | query | autenticado | Detalhes de um exame |
| `exams.exportExcel` | mutation | autenticado | Exporta todos os exames em Excel (4 abas) |

---

## 7. Autenticação Customizada (`server/doctorAuth.ts`)

O sistema usa autenticação **independente do Manus OAuth**, projetada para médicos com CRM:

```
Cadastro → bcrypt.hash(senha, 12) → salva no banco
Login    → bcrypt.compare(senha, hash) → gera JWT (jose) → cookie httpOnly 7 dias
Request  → lê cookie → verifica JWT → busca médico no banco → injeta no contexto tRPC
```

**Fluxo de aprovação:**
1. Médico se cadastra → `status = 'pendente'`, `tipoLicenca = 'trial'`, `trialExpira = agora + 7 dias`
2. **Exceção:** o primeiro médico cadastrado vira `admin` automaticamente e é aprovado imediatamente
3. Admin aprova → `status = 'aprovado'`, `licencaExpira = agora + 30 dias`
4. Ao aprovar, `notifyOwner()` é chamado com dados completos do médico
5. Trial expira → login retorna erro `TRIAL_EXPIRADO` → frontend redireciona para `/trial-expirado`
6. Licença paga expira → login retorna erro `LICENCA_EXPIRADA` → frontend redireciona para `/licenca-expirada`

---

## 8. Geração de Laudo Word (`server/wordGenerator.ts`)

O laudo Word segue o **Protocolo Lundgren v7** e é gerado com a biblioteca `docx`:

### 8.1 Estrutura do Documento

1. **Cabeçalho** — Nome do médico/clínica, endereço, telefone, logo (se disponível)
2. **Dados do Paciente** — Nome, data de nascimento, data do exame, sexo, idade, altura, peso, cor da pele, diagnóstico, convênio, CID-10, técnico
3. **Equação de Referência** — Nome da equação usada + nota de faixa etária (fundo amarelo quando aplicável)
4. **Tabela de Valores Espirométricos** — CVF, VEF₁, VEF₁/CVF, FEF₂₅₋₇₅%, PEFR com colunas: Previsto, LIN, Pré-BD, %Prev, Z-score, Pós-BD, Z-score Pós
5. **Tabela de Status** — Classificação Normal/Reduzido por Z-score para cada parâmetro
6. **Cálculo do Broncodilatador** — Fórmulas explícitas com resultado e limiar
7. **Alertas Clínicos** — PRISm, paradoxo de CVF, nota de equação
8. **Interpretação** — 4 parágrafos gerados por LLM (máx. 300 palavras)
9. **Assinatura** — "Dr. Nome, Especialidade, CRM/UF, RQE"

### 8.2 Cabeçalho Condicional

O cabeçalho adapta-se ao médico:
- Se CRM = 26120 (Dr. Lundgren): usa cabeçalho fixo do CPAC
- Caso contrário: usa `nomeExibicao ?? clinicaNome ?? "Dr. {nome}"` com dados da clínica

---

## 9. OCR com LLM (`server/routers.ts` — `extractFromPdf`)

O endpoint recebe a imagem do PDF em base64 e envia ao GPT-4o com um prompt estruturado:

**Campos extraídos:**
- Dados demográficos: nome, data de nascimento, data do exame, sexo, idade, altura, peso, diagnóstico
- Valores espirométricos: CVF, VEF₁, VEF₁/CVF, FEF₂₅₋₇₅%, PEFR (pré e pós-BD)
- Percentuais do previsto para cada parâmetro

**Sanitização pós-OCR:**
- Se VEF₁/CVF > 100, o sistema recalcula automaticamente: `(VEF₁ ÷ CVF) × 100`
- Isso evita que o OCR confunda o %Previsto do ratio com o valor absoluto

---

## 10. Interpretação LLM (Protocolo Lundgren v7)

O prompt de interpretação instrui o modelo a gerar **4 parágrafos** em português:

1. Descrição dos valores principais (CVF, VEF₁, VEF₁/CVF, FEF₂₅₋₇₅%) com %Previsto
2. Classificação do padrão funcional com justificativa baseada nos critérios SBPT 2024
3. Análise da resposta ao broncodilatador com fórmulas explícitas
4. Conclusão clínica com nome do paciente, idade, sexo e padrão final

**Restrições do prompt:**
- Máximo 300 palavras
- Não mencionar "curvas fluxo-volume" (versão EspirolabII)
- Consistência obrigatória com o padrão calculado pelo motor espirométrico
- Linguagem técnica, formal, em português brasileiro

---

## 11. Curvas Fluxo-Volume Interativas (`client/src/components/FlowVolumeCurve.tsx`)

O componente usa o modelo matemático de **Krowka/Hankinson**:

```
F(V) = PEFR × (V/FVC)^α × (1 − V/FVC)^β
```

Onde α e β variam por padrão funcional (normal, obstrutivo, restritivo). O gráfico exibe:
- Curva pré-BD (azul sólido)
- Curva pós-BD (laranja sólido, quando disponível)
- Curva prevista (cinza pontilhado)

Renderizado com **Recharts** no frontend. No laudo Word, o módulo `curveRenderer.ts` usa **canvas** para gerar um PNG 1080×340 com curvas FV e VT lado a lado.

---

## 12. Exportação Excel (`server/excelGenerator.ts`)

O arquivo Excel possui 4 abas:

| Aba | Conteúdo |
|---|---|
| **Exames** | Todos os exames com todos os campos (cronológico) |
| **Por Convênio** | Agrupado por convênio com totais |
| **Por Relator** | Agrupado por médico relator |
| **Por Padrão** | Agrupado por padrão funcional (Normal, DVO, DVR, Misto, PRISm) |

Recursos: congelamento de colunas, filtros automáticos, cores por grupo de colunas, campos vazios como "(não informado)".

---

## 13. Wizard de 5 Etapas (`client/src/pages/NewExam.tsx`)

### Fluxo com PDF

```
Step 1 (Upload)
  └─ Selecionar/arrastar PDF → extração inicia automaticamente
Step 2 (Loading)
  └─ Tela de loading enquanto GPT-4o extrai os dados
  └─ Ao concluir → vai para Step 3
Step 3 (Edição)
  └─ Formulário com todos os campos pré-preenchidos pelo OCR
  └─ Cálculo automático de VEF₁/CVF ao editar VEF₁ ou CVF
  └─ "Calcular" → chama exams.calculate
Step 4 (Interpretação)
  └─ Tabela de resultados com Z-scores e %Previsto
  └─ Interpretação LLM gerada automaticamente
  └─ Botão "Regenerar" para nova interpretação
  └─ "Salvar e Continuar" → chama exams.save
Step 5 (Laudo Final)
  └─ Botão "Baixar Word" → chama exams.generateWord
  └─ Botão "Baixar PDF" → chama exams.generatePdf
  └─ Botão "Imprimir" → window.print()
```

### Fluxo Manual (sem PDF)

```
Step 1 → "Inserir dados manualmente"
Step 3 (Edição) → formulário em branco
Step 4 (Interpretação)
Step 5 (Laudo Final)
```

---

## 14. Sistema de Licenças

### Tipos de Licença

| Tipo | Comportamento |
|---|---|
| `trial` | 7 dias a partir do cadastro, aprovação automática |
| `pago` | 30 dias por renovação manual pelo admin |
| `admin` | Sem expiração |

### Verificações no Login

```typescript
if (tipoLicenca === 'trial' && trialExpira < now) → TRIAL_EXPIRADO
if (tipoLicenca === 'pago' && licencaExpira < now) → LICENCA_EXPIRADA
if (status === 'pendente') → PENDENTE_APROVACAO
if (status === 'bloqueado') → ACESSO_BLOQUEADO
```

### Banner de Aviso

Nos últimos 2 dias do trial, um banner laranja aparece no topo da interface com contagem regressiva.

---

## 15. Painel Administrativo (`client/src/pages/Admin.tsx`)

Acessível apenas para `role = 'admin'`:

- **Cards de estatísticas**: total de médicos, aprovados, pendentes, em trial
- **Tabela de médicos**: pesquisa por nome/e-mail, filtro por status/licença
- **Ações por médico**: Aprovar, Bloquear, Reativar, Remover, Renovar Licença, Converter para Pago
- **Aba "Renovações"**: histórico completo com filtro por médico e campo de observação
- **Proteção**: admin não pode alterar ou remover a própria conta

---

## 16. Design Visual

### Paleta de Cores (OKLCH)

| Papel | Valor OKLCH | Uso |
|---|---|---|
| Primário | `oklch(0.28 0.08 240)` | Azul marinho escuro — botões, header |
| Destaque | `oklch(0.65 0.15 60)` | Dourado — títulos hero, acentos |
| Fundo | `oklch(0.97 0.008 240)` | Branco azulado — fundo de cards |
| Borda | `oklch(0.88 0.01 240)` | Cinza azulado — bordas |
| Sucesso | `oklch(0.45 0.12 160)` | Verde — valores normais |
| Alerta | `oklch(0.55 0.18 30)` | Laranja — valores reduzidos |
| Erro | `oklch(0.45 0.18 25)` | Vermelho — valores muito reduzidos |

### Tipografia

- **Títulos**: Playfair Display (serif, elegante)
- **Corpo**: Inter (sans-serif, legível)
- Importadas via Google Fonts CDN no `client/index.html`

### Layout

- **Landing page**: split-screen (hero escuro à esquerda + formulário branco à direita)
- **Wizard**: header escuro com indicador de progresso linear, conteúdo em card centralizado
- **Histórico/Admin**: sidebar fixa com navegação, conteúdo em grid responsivo

---

## 17. Testes (`server/spirometry.test.ts`)

O projeto possui **56 testes Vitest** cobrindo:

| Grupo | Testes | Cobertura |
|---|---|---|
| Marcus Jones 2020 | MJ-01 a MJ-06 | Faixa 3–12 anos, ambos os sexos, parda=negra |
| Mallozi 1995 | ML-01 a ML-04 | Faixa 13–17 anos, LIN via GLI-2022 |
| Pereira 2007 | PE-01 a PE-06 | Adultos brancos/pardos, ambos os sexos |
| Prata 2018 | PR-01 a PR-04 | Adultos negros, ambos os sexos |
| GLI 2022 | GL-01 a GL-04 | Race-neutral, faixas extremas |
| Padrões funcionais | PADRAO-01 a PADRAO-10 | Normal, DVO, DVR, Misto, PRISm, PRISm+CVF |
| Broncodilatador | BD-01 a BD-06 | Positivo/negativo, adulto/criança |
| Paradoxo CVF | PARADOX-01 | Detecção de aprisionamento aéreo |
| Autenticação | AUTH-01 | Logout limpa cookie |

Execução: `pnpm test`

---

## 18. Variáveis de Ambiente

Todas as variáveis são injetadas automaticamente pela plataforma Manus:

| Variável | Uso |
|---|---|
| `DATABASE_URL` | Conexão MySQL/TiDB |
| `JWT_SECRET` | Assinatura dos tokens JWT dos médicos |
| `BUILT_IN_FORGE_API_KEY` | Chave para chamadas LLM (GPT-4o) no servidor |
| `BUILT_IN_FORGE_API_URL` | URL base da API Forge (LLM, storage, notificações) |
| `VITE_FRONTEND_FORGE_API_KEY` | Chave Forge para o frontend |
| `VITE_APP_ID` | ID do app para Manus OAuth (framework) |
| `OWNER_OPEN_ID` | ID do proprietário para notificações |

---

## 19. Processo de Desenvolvimento — Linha do Tempo

O projeto foi desenvolvido em **29 fases iterativas**, cada uma com checkpoint versionado:

| Fase | Descrição | Destaque Técnico |
|---|---|---|
| 1 | Schema do banco | 4 tabelas, ~70 campos em `exam_records` |
| 2 | Autenticação customizada | JWT + bcrypt, independente do Manus OAuth |
| 3 | Motor espirométrico | 4 equações brasileiras + Z-scores + padrões |
| 4 | Laudo Word + Excel | `docx` + `exceljs`, 4 abas Excel |
| 5 | Wizard 5 etapas | Upload → OCR → Edição → Interpretação → Download |
| 6 | Histórico de exames | Paginação, filtros, download retroativo |
| 7 | Painel administrativo | CRUD de médicos, aprovação, bloqueio |
| 8 | Design visual | Paleta OKLCH, Playfair + Inter, split-screen |
| 9 | Testes Vitest | 36+ testes, golden-values contra artigos originais |
| 10 | Licença mensal | Campo `licencaExpira`, renovação +30 dias |
| 11 | Histórico de renovações | Tabela `license_renewals`, observações |
| 12 | Análise morfológica (IA) | GPT-4o analisa imagem da curva FV |
| 13 | Curvas FV interativas | Recharts + modelo Krowka/Hankinson |
| 14 | Curva PNG no Word | `canvas` renderiza PNG 1080×340 no laudo |
| 15 | Entrada manual | Modo sem PDF, pula OCR |
| 16 | Redesign moderno | Header escuro, indicador de progresso linear |
| 17 | Correções diagnósticas | LIN Pereira/Prata/Mallozi corrigidos contra artigos |
| 18 | PRISm + equação usada | Critério Huang 2024, nota de faixa etária |
| 20 | Correções Parecer v2 | GLI-2022 como LIN para Mallozi, extrapolação |
| 21 | Marcus Jones corrigido | Faixa 3–12a, parda=negra (corNum=1) |
| 22 | Correção banco | varchar insuficiente, sanitização NaN→null |
| 23 | Reconstrução wordGenerator | Fiel ao modelo PDF do agente_cpac |
| 24 | Laudo PDF | Puppeteer headless, template HTML |
| 25 | Trial 7 dias | `tipoLicenca`, `trialExpira`, notificação ao dono |
| 26 | PRISm Huang 2024 | `prismaCvfReduzida`, nota no laudo |
| 27–28 | Análise morfológica math | Classificação matemática por Z-scores |
| 29 | EspirolabII | Remoção da análise morfológica (versão simplificada) |

---

## 20. Comandos Úteis

```bash
# Desenvolvimento
pnpm dev                    # Inicia servidor + Vite HMR

# Banco de dados
pnpm drizzle-kit generate   # Gera migração SQL a partir do schema
# Aplicar migração: usar webdev_execute_sql com o SQL gerado

# Testes
pnpm test                   # Executa 56 testes Vitest

# TypeScript
pnpm tsc --noEmit           # Verifica erros de tipo

# Build
pnpm build                  # Build de produção
```

---

## 21. Referências Científicas

| Equação | Referência |
|---|---|
| Marcus Jones 2020 | Jones MH et al. *J Bras Pneumol.* 2020;46(2):e20190169 |
| Mallozi 1995 | Mallozi MC. *J Pneumol.* 1995;21(2):51–66 |
| Pereira 2007 | Pereira CAC et al. *J Bras Pneumol.* 2007;33(4):397–406 |
| Prata 2018 | Prata TA et al. *J Bras Pneumol.* 2018;44(4):295–305 |
| GLI 2022 | Stanojevic S et al. *Eur Respir J.* 2022;60(3):2101499 |
| SBPT 2024 | Pereira CAC et al. *J Bras Pneumol.* 2024;50(6):e20240169 |
| PRISm (Huang 2024) | Huang YC et al. *Chest.* 2024 |
| Morfologia FV | Pellegrino R et al. *Eur Respir J.* 2005;26(5):948–968 |
| BD (SBPT 2024) | Critério ≥10% previsto para adultos e crianças |

---

*Documento gerado em 18 de junho de 2026. Versão do projeto: `8370d097`.*
