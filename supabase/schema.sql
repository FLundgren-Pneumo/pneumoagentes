-- PulmoAgents Enterprise - schema inicial Supabase
create extension if not exists pgcrypto;

create table if not exists public.medicos (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  email text not null unique,
  crm text not null,
  uf text not null,
  instituicao text,
  status text not null default 'pendente' check (status in ('pendente','aprovado','bloqueado')),
  created_at timestamptz not null default now()
);

create table if not exists public.agentes (
  id text primary key,
  categoria text not null,
  nome text not null,
  descricao text not null,
  arquivo text not null,
  pasta text not null,
  ativo boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.solicitacoes_acesso (
  id uuid primary key default gen_random_uuid(),
  medico_id uuid references public.medicos(id) on delete cascade,
  agente_id text references public.agentes(id) on delete cascade,
  status text not null default 'pendente' check (status in ('pendente','aprovada','rejeitada')),
  observacao text,
  created_at timestamptz not null default now(),
  decided_at timestamptz
);

create table if not exists public.licencas (
  id uuid primary key default gen_random_uuid(),
  medico_id uuid references public.medicos(id) on delete cascade,
  agente_id text references public.agentes(id) on delete cascade,
  tipo text not null check (tipo in ('trial','permanente','assinatura')),
  status text not null default 'ativa' check (status in ('ativa','expirada','revogada')),
  inicio_em timestamptz not null default now(),
  expira_em timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.download_logs (
  id uuid primary key default gen_random_uuid(),
  medico_id uuid references public.medicos(id) on delete set null,
  agente_id text references public.agentes(id) on delete set null,
  ip text,
  user_agent text,
  created_at timestamptz not null default now()
);

insert into public.agentes (id,categoria,nome,descricao,arquivo,pasta) values
('bronquiectasias-2026','Bronquiectasias','Agente Bronquiectasias 2026','Avaliação, estratificação, microbiologia, investigação etiológica, tratamento e geração de documentos.','bronquiectasias-2026.html','agentes/bronquiectasias/'),
('sia-pro','Espirometria','SIA-PRO','Aplicativo HTML para apoio à análise e interpretação clínica da espirometria.','sia-pro.html','agentes/sia-pro/'),
('espirolab2','Espirometria','EspiroLab2','Lê PDFs do espirômetro, aceita entrada manual e produz laudo estruturado.','espirolab2.html','agentes/espirolab2/'),
('preoperatorio','Pré-operatório','Agente de Avaliação Pré-Operatória','Avaliação pré-operatória de risco cardiopulmonar com relatório local.','preoperatorio.html','agentes/preoperatorio/'),
('primeira-consulta-pneumologia','Consulta','Primeira Consulta em Pneumologia','Anamnese estruturada, diagnósticos múltiplos, exames sugeridos e documentação clínica.','primeira-consulta-pneumologia.html','agentes/consulta/'),
('biologicos-asma','Asma','Decisor Biológicos Asma Grave','Critérios de indicação, posologia e monitoramento de terapias biológicas na asma grave.','biologicos-asma.html','agentes/biologicos-asma/'),
('guia-pac','Infecções','Guia de Pneumonia Adquirida na Comunidade','Estratificação de risco, antibioticoterapia empírica e critérios de internação em PAC.','guia-pac.html','agentes/guia-pac/'),
('tampoes-mucosos','Imagem','Assistente de Tampões Mucosos','Avaliação semiquantitativa de tampões de muco em TC de tórax.','tampoes-mucosos.html','agentes/tampoes-mucosos/'),
('alfa1-screen','Outros','Alfa-1 Antitripsina Screen','Rastreio, diagnóstico e manejo da deficiência de alfa-1 antitripsina.','alfa1-screen.html','agentes/alfa1/')
on conflict (id) do update set nome=excluded.nome, descricao=excluded.descricao, arquivo=excluded.arquivo, pasta=excluded.pasta;

alter table public.medicos enable row level security;
alter table public.agentes enable row level security;
alter table public.solicitacoes_acesso enable row level security;
alter table public.licencas enable row level security;
alter table public.download_logs enable row level security;

-- Politicas devem ser refinadas apos ativar Supabase Auth.
create policy if not exists "agentes_public_read" on public.agentes for select using (ativo = true);
