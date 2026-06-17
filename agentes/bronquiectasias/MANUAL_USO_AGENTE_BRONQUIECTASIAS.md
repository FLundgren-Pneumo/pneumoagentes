# Manual de Uso - Agente Bronquiectasias 2026

## PneumoAgents

Este manual acompanha o `Agente_Bronquiectasias_PneumoAgents_2026.html`, uma ferramenta de apoio a decisao medica para avaliacao, estratificacao, documentacao e emissao de documentos relacionados a bronquiectasias nao fibrocisticas em adultos.

O agente foi preparado para publicacao no portal PneumoAgents, com acesso gratuito por 7 dias apos cadastro. Apos esse periodo, a continuidade de uso dependera de cadastro ativo e pagamento da taxa vigente no portal.

O controle de login, prazo gratuito, autorizacao, pagamento e cancelamento deve ser realizado pelo backend do PneumoAgents. O arquivo HTML nao deve ser usado como mecanismo isolado de controle comercial.

## Aviso medico

O agente e uma ferramenta de apoio. Ele nao substitui:

- julgamento clinico;
- decisao medica individualizada;
- relacao medico-paciente;
- protocolos institucionais;
- diretrizes vigentes;
- bulas;
- auditoria local;
- avaliacao regulatoria.

## LGPD

O agente manipula dados pessoais e dados de saude, considerados sensiveis pela LGPD - Lei No. 13.709/2018.

Recomendacoes:

- usar apenas em ambiente autorizado;
- manter controle de acesso ao computador, navegador e portal;
- nao publicar exemplos com dados reais de pacientes;
- exportar TXT/PDF/JSON somente quando houver finalidade legitima;
- armazenar documentos gerados em local seguro;
- descartar arquivos quando nao houver mais finalidade assistencial ou administrativa;
- revisar commits, issues e releases antes de publicar no GitHub.

## Arquivo principal

Abra no navegador:

`Agente_Bronquiectasias_PneumoAgents_2026.html`

O agente funciona como HTML local. No portal, ele pode ser incorporado como pagina/aplicativo, desde que o controle de acesso seja feito pelo PneumoAgents.

## Evolucao pos-upload

A versao atual pode ser usada como versao inicial/beta. A evolucao recomendada para a v1.1 esta documentada em:

`ROADMAP_BRONQUIECTASIAS_v1.1.md`

Prioridades da v1.1:

- dashboard grafico longitudinal;
- linha do tempo microbiologica visual;
- escore de completude dos dados;
- impressao PDF mais profissional;
- protecao comercial real pelo portal PneumoAgents.

## Primeiro acesso

Ao abrir o agente, o medico visualiza:

1. Aviso de apoio a decisao medica.
2. Aviso LGPD.
3. Condicoes de acesso PneumoAgents.
4. Cadastro medico.

O cadastro medico preenche automaticamente os documentos:

- nome do medico;
- CRM/UF;
- instituicao;
- CNES;
- cabecalho institucional.

O cadastro fica salvo localmente no navegador.

## Fluxo de uso

### 1. Dados

Preencha identificacao do paciente e dados administrativos.

Esses campos sao usados nos documentos e no banco local.

### 2. Diagnostico

Informe:

- confirmacao por TCAR;
- extensao radiologica;
- VEF1;
- mMRC;
- exacerbacoes;
- internacoes;
- hemoptise;
- IMC;
- sintomas;
- qualidade de vida ou funcionalidade.

O agente gera uma estratificacao simplificada de risco. Use como triagem. Quando necessario, calcule BSI, FACED ou E-FACED formalmente.

### 3. Etiologia

O consenso brasileiro SBPT 2019 e a diretriz ERS 2025 reforcam investigacao etiologica sistematica.

Marque causas e tracos trataveis:

- fibrose cistica adulta/atipica;
- discinesia ciliar primaria;
- ABPA;
- imunodeficiencia;
- micobacteriose NTM;
- doenca autoimune/reumatologica;
- aspiracao/DRGE;
- pos-infecciosa/TB.

Evite rotular como idiopatica antes de investigacao adequada e clinicamente viavel.

### 4. Microbiologia

Registre:

- Pseudomonas aeruginosa;
- NTM;
- patogeno predominante;
- escarro diario;
- historico de antibioticos;
- disbiose/microbioma/infeccoes recorrentes.

Novo isolamento de Pseudomonas pode demandar estrategia de erradicacao. Pseudomonas cronica com alto risco de exacerbacao pode justificar antibiotico inalatorio. Suspeita ou confirmacao de NTM exige cautela com macrolideo isolado.

### 5. Tratamento

O agente oferece opcoes para o medico escolher ou digitar livremente:

- antibioticos;
- mucoliticos/mucoativos;
- NAC;
- broncodilatadores;
- azitromicina como anti-inflamatorio/imunomodulador;
- brensocatibe.

O texto digitado nesses campos e usado na formulacao da receita e tambem aparece no relatorio clinico.

Se o medico marcar uma opcao e nao digitar texto, o agente inclui uma orientacao generica segura, indicando que dose, farmaco, duracao e disponibilidade devem ser definidos pelo medico.

## Pontos de seguranca terapeutica

### Antibioticos

Devem ser guiados por:

- cultura de escarro;
- gravidade da exacerbacao;
- historico de Pseudomonas;
- alergias;
- funcao renal;
- resistencia antimicrobiana local.

### Mucoliticos, mucoativos e NAC

Podem ser considerados quando ha secrecao espessa, alto volume de escarro ou dificuldade de clearance. Ajustar conforme tolerancia, broncoespasmo e resposta clinica.

### Broncodilatadores

Considerar se houver:

- obstrucao ao fluxo aereo;
- broncoespasmo;
- asma;
- DPOC associada;
- melhora sintomatica com broncodilatador.

### Azitromicina

Uso prolongado com objetivo anti-inflamatorio/imunomodulador deve ser considerado especialmente em exacerbador frequente, com cautela.

Antes de usar, avaliar:

- NTM, evitando macrolideo isolado em micobacteriose;
- ECG/QT;
- audicao;
- interacoes medicamentosas;
- risco de resistencia antimicrobiana.

### Brensocatibe

Brensocatibe e uma terapia DPP-1 emergente/especifica para bronquiectasias, com dados recentes de estudo fase 3.

Antes de prescrever, confirmar:

- registro regulatorio local;
- indicacao aprovada;
- disponibilidade no Brasil;
- cobertura;
- criterios clinicos;
- seguranca e monitoramento.

## Documentos gerados

O agente gera:

- Relatorio clinico;
- Receita / plano de tratamento;
- Plano de exacerbacao;
- Resumo do agente.

Cada documento pode ser impresso como PDF pelo navegador ou baixado em TXT.

## Banco local e reemissao

Ao clicar em `Salvar no banco`, o caso e armazenado no `localStorage` do navegador.

Depois, e possivel:

1. Buscar o paciente no painel `Banco`.
2. Clicar em `Reemitir`.
3. Recuperar dados clinicos, tratamentos escolhidos/digitados e documentos.
4. Reemitir a receita, relatorio, plano de exacerbacao ou resumo.

Atencao: se o usuario limpar dados do navegador, trocar de computador, usar outro navegador ou modo anonimo, o banco pode nao estar disponivel.

Para backup, use `Exportar JSON`. Esse arquivo contem dados sensiveis e deve ser protegido pela LGPD.

## Publicacao no GitHub

Arquivos recomendados:

- `Agente_Bronquiectasias_PneumoAgents_2026.html`
- `MANUAL_USO_AGENTE_BRONQUIECTASIAS.md`
- `outputs/Manual_Uso_Agente_Bronquiectasias_PneumoAgents_2026.pdf`

Nao publicar:

- bancos JSON com dados reais;
- receitas preenchidas de pacientes;
- relatorios preenchidos;
- PDFs/TXT com dados pessoais;
- imagens contendo CPF, CNS, nome completo, telefone, endereco ou dados clinicos identificaveis.

## Referencias principais

- Pereira MC, Athanazio RA, Dalcin PTR, Figueiredo MRF, Gomes M, Freitas CG, Ludgren F, Paschoal IA, Rached SZ, Maurici R. Consenso brasileiro sobre bronquiectasias nao fibrocisticas. J Bras Pneumol. 2019;45(4):e20190122.
- Chalmers JD et al. European Respiratory Society clinical practice guideline for the management of adult bronchiectasis. Eur Respir J. 2025;66:2501126. DOI: 10.1183/13993003.01126-2025.
- Choi H, McShane PJ, Aliberti S, Chalmers JD. Bronchiectasis management in adults: state of the art and future directions. Eur Respir J. 2024;63:2400518. DOI: 10.1183/13993003.00518-2024.
- Mac Aogain M et al. Infection and the microbiome in bronchiectasis. Eur Respir Rev. 2024;33:240038. DOI: 10.1183/16000617.0038-2024.
- De Angelis A et al. Exacerbations of bronchiectasis. Eur Respir Rev. 2024;33:240085. DOI: 10.1183/16000617.0085-2024.
- Perea L, Faner R, Chalmers JD, Sibila O. Pathophysiology and genomics of bronchiectasis. Eur Respir Rev. 2024;33:240055. DOI: 10.1183/16000617.0055-2024.
- Chalmers JD et al. Neutrophilic inflammation in bronchiectasis. Eur Respir Rev. 2025;34:240179. DOI: 10.1183/16000617.0179-2024.
- Johnson E, Long MB, Chalmers JD. Biomarkers in bronchiectasis. Eur Respir Rev. 2024;33:230234. DOI: 10.1183/16000617.0234-2023.
- Chalmers JD et al. Phase 3 trial of the DPP-1 inhibitor brensocatib in bronchiectasis. N Engl J Med. 2025;392:1569-1581.
