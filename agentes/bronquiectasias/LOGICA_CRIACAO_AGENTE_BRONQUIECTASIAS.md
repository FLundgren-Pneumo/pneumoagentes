# Logica de Criacao do Agente Bronquiectasias PneumoAgents 2026

## 1. Objetivo do agente

O Agente Bronquiectasias PneumoAgents 2026 foi criado como uma ferramenta HTML local/portal para apoio a decisao medica em bronquiectasias nao fibrocisticas em adultos.

O objetivo central nao e apenas coletar dados, mas transformar dados clinicos em:

- estratificacao formal de gravidade;
- identificacao de fenotipos e tracos trataveis;
- apoio a investigacao etiologica;
- interpretacao microbiologica;
- sugestao estruturada de condutas;
- geracao de relatorio;
- geracao de receita/plano terapeutico;
- plano de exacerbacao;
- resumo clinico para reemissao e acompanhamento;
- banco local exportavel para futuras implementacoes no portal.

O agente foi desenhado para funcionar como versao inicial/beta no portal PneumoAgents, com a premissa de que o controle comercial real, login, prazo gratuito, cobranca e autorizacao de acesso devem ser implementados pelo backend do portal.

## 2. Princípios de construcao

### 2.1 Apoio, nao substituicao da decisao medica

Toda a logica foi construida para apoiar o medico, nunca para substituir:

- julgamento clinico;
- decisao individualizada;
- relacao medico-paciente;
- diretrizes vigentes;
- protocolos locais;
- bulas;
- auditoria regulatoria;
- disponibilidade local de medicamentos e exames.

### 2.2 Dados estruturados antes de texto livre

Sempre que possivel, a informacao clinica foi transformada em campos estruturados:

- seletores;
- checkboxes;
- datas;
- campos numericos;
- listas de bacterias;
- status vacinais;
- status de reabilitacao;
- cultura microbiologica por encontro.

Texto livre permanece disponivel para individualizacao, mas a logica decisoria depende principalmente dos campos estruturados.

### 2.3 Um HTML funcional

A primeira versao foi construida como arquivo HTML unico, para facilitar:

- uso local;
- upload no GitHub;
- hospedagem simples no portal;
- edicao rapida;
- reemissao de documentos;
- exportacao/importacao de banco local.

## 3. Fontes clinicas usadas como base

A arquitetura clinica do agente usa como base:

- Consenso Brasileiro SBPT 2019 sobre bronquiectasias nao fibrocisticas;
- Diretriz ERS 2025 para bronquiectasias em adultos;
- literatura ERJ/ERR 2024-2025 sobre microbioma, exacerbacao, biomarcadores, fisiopatologia e terapias futuras;
- publicacao NEJM 2025 sobre brensocatibe/DPP-1;
- escores FACED, E-FACED e BSI.

As referencias completas ficam documentadas em `REFERENCIAS.md` e nos documentos gerados pelo agente.

## 4. Estrutura geral do agente

O agente foi organizado em blocos clinicos:

1. Dados do paciente e medico.
2. Diagnostico e gravidade.
3. Etiologia e investigacao.
4. Microbiologia, exacerbacao e fenotipo infeccioso.
5. Tratamento, encaminhamento, vacinas e reabilitacao.
6. Documentos gerados.
7. Banco local.

Cada bloco alimenta o motor clinico central e os documentos finais.

## 5. Coleta de dados

### 5.1 Dados administrativos

Coleta:

- nome do paciente;
- data de nascimento;
- sexo;
- CPF/CNS;
- peso e altura;
- telefone;
- medico;
- CRM;
- instituicao;
- CNES;
- data do documento.

Uso:

- preenchimento dos documentos;
- identificacao no banco local;
- calculo de idade;
- emissao de relatorio, receita, resumo e plano de exacerbacao.

### 5.2 Dados diagnosticos e funcionais

Coleta:

- TCAR confirmando bronquiectasias;
- extensao radiologica por lobos;
- bronquiectasias cisticas;
- VEF1 percentual previsto;
- mMRC;
- exacerbacao no ultimo ano;
- internacao no ultimo ano;
- hemoptise;
- IMC;
- sintomas;
- qualidade de vida;
- resumo clinico.

Uso:

- calculo de FACED;
- calculo de E-FACED;
- calculo de BSI;
- definicao de risco;
- indicacao de especialista;
- indicacao de reabilitacao;
- geracao de relatorio.

## 6. Motor de gravidade

O motor de gravidade fica concentrado na funcao `analyze(d)`.

### 6.1 FACED

Componentes usados:

- VEF1;
- idade;
- Pseudomonas cronica;
- mMRC;
- extensao radiologica.

Classificacao:

- 0-2: leve;
- 3-4: moderado;
- 5-7: grave.

Uso no agente:

- exibicao no painel;
- relatorio;
- resumo;
- banco local;
- conclusao automatica.

### 6.2 E-FACED

Componentes:

- FACED;
- exacerbacao frequente.

Uso:

- aumentar sensibilidade para risco de exacerbacao;
- apoiar decisao sobre prevencao;
- reforcar necessidade de cultura, clearance, macrolideo/antibiotico inalatorio quando apropriado.

### 6.3 BSI

Componentes:

- idade;
- IMC;
- VEF1;
- internacao;
- exacerbacao;
- mMRC;
- Pseudomonas;
- outras bacterias cronicas;
- extensao radiologica/bronquiectasia cistica.

Classificacao:

- baixo;
- intermediario;
- alto.

Uso:

- risco de hospitalizacao;
- mortalidade estimada;
- prioridade de seguimento;
- necessidade de especialista;
- resumo para acompanhamento.

## 7. Conclusao automatica

A funcao `clinicalConclusion(d)` transforma os escores e os dados principais em conclusao pratica.

Ela produz:

- fenotipo geral;
- tracos trataveis identificados;
- prioridades clinicas.

Exemplo de saida esperada:

```text
Fenotipo:
Bronquiectasias graves.

Estratificacao:
FACED grave, E-FACED grave, BSI alto.

Condutas prioritarias:
Definir clearance supervisionado;
coletar cultura seriada com antibiograma;
considerar antibiotico inalatorio;
considerar macrolideo somente apos excluir NTM;
encaminhar para centro especializado.
```

## 8. Tracos trataveis

O agente identifica automaticamente tracos trataveis a partir dos campos preenchidos.

Tracos principais:

- Pseudomonas cronica;
- exacerbador frequente;
- grande producao de escarro;
- DRGE/aspiracao;
- rinossinusite;
- obstrucao ao fluxo aereo;
- asma/DPOC associada;
- imunodeficiencia;
- ABPA;
- NTM;
- hemoptise;
- baixo IMC/desnutricao.

Uso:

- orientar condutas;
- gerar relatorio;
- apontar exames faltantes;
- apoiar encaminhamento especializado.

## 9. Investigacao etiologica inteligente

A funcao `intelligentEtiology(d)` interpreta:

- etiologia provavel;
- probabilidade clinica;
- exames faltantes.

### 9.1 Etiologias consideradas

- pos-infecciosa/pos-TB;
- ABPA/sensibilizacao por Aspergillus;
- imunodeficiencia humoral;
- micobacteria nao tuberculosa;
- aspiracao/DRGE/disfagia;
- fibrose cistica adulta/atipica;
- discinesia ciliar primaria;
- autoimune;
- indefinida.

### 9.2 Exames rastreados

O agente procura no campo de exames realizados:

- IgG;
- IgA;
- IgM;
- IgE total;
- Aspergillus IgE/IgG;
- BAAR;
- cultura para NTM;
- teste do suor/CFTR;
- investigacao de discinesia ciliar primaria;
- autoimunidade dirigida;
- alfa-1 antitripsina.

Uso:

- gerar checklist visual;
- sugerir pendencias no relatorio;
- evitar laudo incompleto;
- orientar retorno.

## 10. Microbiologia e disbiose

O modulo microbiologico foi desenhado para sair do texto livre e virar cronologia estruturada.

### 10.1 Campos principais

- Pseudomonas aeruginosa: ausente, novo isolamento ou cronica;
- NTM: nao documentada, suspeita ou confirmada;
- bacteria predominante;
- outras bacterias cronicas;
- volume de escarro;
- qualidade da amostra;
- cultura 1: data e bacteria;
- cultura 2: data e bacteria;
- cultura 3: data e bacteria;
- antibiograma;
- antibiotico recente;
- resposta ao antibiotico;
- historico de antibioticos/culturas;
- microbioma/disbiose;
- linha do tempo de exacerbacao.

### 10.2 Logica de interpretacao

A funcao `microbiologyDecision(d)` avalia:

- culturas ausentes;
- culturas recorrentes;
- Pseudomonas cronica;
- novo isolamento de Pseudomonas;
- suspeita ou confirmacao de NTM;
- uso repetido de antibioticos;
- falha terapeutica;
- resposta parcial;
- evento adverso;
- DRGE/aspiracao;
- escarro moderado/alto;
- exacerbador frequente.

### 10.3 Disbiose

O agente nao trata disbiose como diagnostico laboratorial obrigatorio de rotina.

Ele usa suspeita clinica baseada em:

- antibioticos repetidos;
- Pseudomonas;
- NTM;
- DRGE;
- aspiracao;
- escarro purulento;
- culturas recorrentes;
- bronquiectasias extensas;
- exacerbacao frequente.

Classificacao:

- baixa;
- moderada;
- alta.

Uso:

- alertar para fenotipo infeccioso;
- sugerir cultura seriada;
- evitar antibiotico empirico repetido sem cultura;
- reforcar exclusao de NTM antes de macrolideo prolongado.

## 11. Tratamento e encaminhamento

A funcao `treatmentDecision(d)` transforma o tratamento escolhido e o risco do paciente em orientacao pratica.

### 11.1 Itens avaliados

- clearance de vias aereas;
- frequencia do clearance;
- impacto da secrecao;
- NTM excluida antes de macrolideo;
- ECG/QT e audicao antes de macrolideo;
- criterio para antibiotico inalatorio;
- retorno sugerido;
- tratamento atual;
- plano de exacerbacao;
- motivo de encaminhamento.

### 11.2 Opcoes terapeuticas

O medico pode selecionar e editar:

- antibiotico para exacerbacao ou cultura dirigida;
- mucolitico/mucoativo;
- NAC;
- broncodilatador;
- azitromicina anti-inflamatoria/imunomoduladora;
- brensocatibe/DPP-1, se houver criterio, registro, disponibilidade e cobertura.

### 11.3 Alertas de seguranca

O agente reforca:

- nao iniciar macrolideo prolongado sem excluir NTM;
- avaliar ECG/QT;
- avaliar audicao;
- revisar interacoes;
- confirmar disponibilidade/regulacao de brensocatibe;
- confirmar tecnica e tolerancia de antibiotico inalatorio.

## 12. Vacinas e reabilitacao

A funcao `vaccineRehabDecision(d)` interpreta o modulo de vacinas e reabilitacao.

### 12.1 Vacinas

Checklist:

- influenza anual;
- COVID-19;
- pneumococica;
- dT/dTpa;
- RSV/VSR;
- herpes-zoster.

Status:

- atualizada;
- pendente/avaliar;
- contraindicada;
- nao se aplica/indisponivel;
- nao informado.

Uso:

- apontar vacinas pendentes;
- gerar resumo;
- incluir no relatorio;
- orientar conferencia pelo calendario vigente do Ministerio da Saude.

### 12.2 Reabilitacao pulmonar

O agente considera reabilitacao quando ha:

- mMRC maior ou igual a 2;
- limitacao funcional;
- exacerbador frequente;
- internacao;
- BSI alto/intermediario;
- secrecao impactante;
- baixa tolerancia ao exercicio;
- necessidade de treinamento de clearance.

Campos:

- status da reabilitacao;
- motivo principal;
- teste funcional;
- programa sugerido.

Uso:

- relatorio;
- resumo;
- pendencias automaticas;
- plano de retorno.

## 13. Pendencias e completude

A funcao `reportSuggestions(d)` identifica:

- dados faltantes;
- exames a considerar;
- cuidados pendentes.

Exemplos de pendencias:

- nome do paciente;
- data de nascimento;
- VEF1;
- IMC;
- exacerbacao/internacao;
- mMRC;
- microbiologia;
- tratamento atual;
- plano de exacerbacao;
- TCAR;
- cultura de escarro;
- BAAR/cultura para NTM;
- IgG/IgA/IgM;
- IgE/Aspergillus;
- alfa-1 antitripsina;
- clearance;
- reabilitacao;
- vacinas;
- especialista.

Essa logica prepara a futura criacao de um escore de completude dos dados na v1.1.

## 14. Documentos gerados

O agente gera quatro documentos:

### 14.1 Relatorio

Inclui:

- identificacao;
- base cientifica;
- resumo clinico;
- conclusao automatica;
- escores;
- microbiologia;
- etiologia;
- tracos trataveis;
- investigacao;
- tratamento;
- vacinas/reabilitacao;
- pendencias;
- seguimento;
- referencias;
- LGPD;
- aviso medico.

### 14.2 Receita/plano terapeutico

Inclui:

- clearance;
- mucoativo/NAC;
- broncodilatador;
- antibiotico;
- azitromicina;
- antibiotico inalatorio;
- brensocatibe quando selecionado;
- observacoes de seguranca.

A receita nao prescreve automaticamente sem decisao medica. Ela organiza o que o medico escolheu ou digitou.

### 14.3 Plano de exacerbacao

Inclui:

- sinais de alerta;
- coleta de escarro antes de antibiotico;
- escolha baseada em cultura;
- duracao aproximada conforme caso;
- criterios de urgencia;
- plano individual.

### 14.4 Resumo

Inclui os pontos principais para banco local e retornos:

- fenotipo;
- FACED/E-FACED/BSI;
- prognostico;
- TCAR/funcao;
- exacerbacao;
- microbiologia;
- disbiose;
- etiologia;
- tracos trataveis;
- prioridades;
- vacinas;
- reabilitacao;
- conduta;
- pendencias.

## 15. Banco de dados local

O banco usa `localStorage` do navegador.

### 15.1 O que e salvo

Ao salvar, o agente guarda:

- todos os campos preenchidos;
- analise dos escores;
- resumo estruturado;
- snapshots de acompanhamento;
- data de atualizacao.

### 15.2 Resumo indexado

A funcao `caseSnapshot(d)` cria um resumo estruturado com:

- versao do agente;
- data de geracao;
- paciente;
- idade;
- escores;
- fenotipo;
- tracos trataveis;
- prioridades;
- microbiologia;
- etiologia;
- tratamento;
- vacinas;
- reabilitacao;
- pendencias;
- texto curto para busca/listagem.

### 15.3 Snapshots de acompanhamento

Cada salvamento do mesmo caso adiciona um snapshot ao campo:

```text
followupSnapshots
```

Isso prepara futuras implementacoes:

- comparacao entre consultas;
- graficos longitudinais;
- linha de tempo de culturas;
- acompanhamento de risco;
- migracao para banco do portal.

### 15.4 Exportacao e importacao

O banco pode ser:

- exportado em JSON;
- importado posteriormente;
- usado para reemissao de relatorio, receita, plano de exacerbacao e resumo.

Como contem dados sensiveis, nao deve ser versionado no GitHub.

## 16. LGPD

O agente manipula dados pessoais e dados de saude, considerados sensiveis.

Alertas implementados:

- aviso no primeiro acesso;
- aviso em documentos;
- confirmacao antes de exportar TXT/JSON;
- orientacao para armazenamento seguro;
- recomendacao de nao publicar dados reais.

Para uso comercial, o portal deve implementar:

- autenticacao;
- autorizacao;
- criptografia;
- logs;
- controle de acesso;
- politica de retencao;
- exclusao segura;
- auditoria.

## 17. Protecao comercial

O HTML contem aviso de:

- acesso gratuito por 7 dias;
- continuidade mediante cadastro ativo e taxa vigente;
- necessidade de controle pelo portal.

O arquivo HTML isolado nao deve ser considerado protecao comercial real.

O controle real deve ficar no PneumoAgents:

- login;
- cadastro;
- inicio do trial;
- bloqueio apos 7 dias;
- pagamento;
- renovacao;
- cancelamento;
- auditoria.

## 18. Versao v1.1 planejada

A evolucao pos-upload esta documentada em:

```text
ROADMAP_BRONQUIECTASIAS_v1.1.md
```

Prioridades:

- dashboard grafico longitudinal;
- linha do tempo microbiologica visual;
- escore de completude dos dados;
- PDF mais profissional;
- protecao comercial real pelo portal.

## 19. Fluxo logico resumido

```text
Entrada de dados
    |
    v
Analise de gravidade
FACED + E-FACED + BSI
    |
    v
Fenotipo e tracos trataveis
    |
    v
Investigacao etiologica inteligente
    |
    v
Microbiologia + disbiose + cultura seriada
    |
    v
Tratamento + vacinas + reabilitacao + encaminhamento
    |
    v
Relatorio + Receita + Plano de Exacerbacao + Resumo
    |
    v
Banco local + resumo indexado + snapshots
    |
    v
Base para retornos e acompanhamento longitudinal
```

## 20. Arquivos relacionados

- `Agente_Bronquiectasias_PneumoAgents_2026.html`: agente principal.
- `MANUAL_USO_AGENTE_BRONQUIECTASIAS.md`: manual de uso.
- `ROADMAP_BRONQUIECTASIAS_v1.1.md`: plano de evolucao.
- `REFERENCIAS.md`: referencias cientificas.
- `CHANGELOG.md`: historico de versoes.
- `Manual_Uso_Agente_Bronquiectasias_PneumoAgents_2026.pdf`: manual em PDF.

