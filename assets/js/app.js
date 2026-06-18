function el(id){return document.getElementById(id)}
function getLocal(key,fallback=null){try{return JSON.parse(localStorage.getItem(key)||'null')??fallback}catch(e){return fallback}}
function setLocal(key,val){localStorage.setItem(key,JSON.stringify(val))}
function usuarioAtual(){return getLocal('pulmo_user')}
function cadastrarMedico(){
  const medico={nome:el('nome').value.trim(),email:el('email').value.trim(),crm:el('crm').value.trim(),uf:el('uf').value.trim(),instituicao:el('instituicao').value.trim(),status:'pendente',criadoEm:new Date().toISOString()};
  if(!medico.nome||!medico.email||!medico.crm||!medico.uf){alert('Preencha nome, e-mail, CRM e UF.');return}
  setLocal('pulmo_user',medico);
  const medicos=getLocal('pulmo_medicos',[]); medicos.push(medico); setLocal('pulmo_medicos',medicos);
  alert('Cadastro recebido. Agora você pode solicitar acesso aos agentes.'); location.href='catalogo.html';
}
function loginMedico(){
  const email=el('email').value.trim(); const medicos=getLocal('pulmo_medicos',[]); const m=medicos.find(x=>x.email===email)||{nome:'Médico',email,status:'pendente'}; setLocal('pulmo_user',m); location.href='catalogo.html';
}
function solicitarAcesso(agentId){
  const u=usuarioAtual(); if(!u){location.href='cadastro-medico.html';return}
  const solicitacoes=getLocal('pulmo_solicitacoes',[]);
  if(solicitacoes.some(s=>s.email===u.email&&s.agentId===agentId&&s.status==='pendente')){alert('Solicitação já enviada.');return}
  solicitacoes.push({id:'sol_'+Date.now(),agentId,email:u.email,nome:u.nome,crm:u.crm,status:'pendente',criadoEm:new Date().toISOString()});
  setLocal('pulmo_solicitacoes',solicitacoes); alert('Solicitação enviada ao administrador.');
}
function licencaAtiva(agentId){
  const u=usuarioAtual(); if(!u)return null; const lic=getLocal('pulmo_licencas',[]).find(l=>l.email===u.email&&l.agentId===agentId&&l.status!=='revogada');
  if(!lic)return null; if(lic.tipo==='permanente')return lic; return new Date(lic.expiraEm).getTime()>Date.now()?lic:null;
}
function abrirAgente(agentId){
  const ag=window.PULMO_AGENTES.find(a=>a.id===agentId); const lic=licencaAtiva(agentId);
  if(!lic){alert('Acesso não liberado. Cadastre-se e solicite aprovação.');return}
  window.open(ag.pasta+ag.arquivo,'_blank','noopener');
}
function renderCatalogo(containerId,admin=false){
  const c=el(containerId); if(!c)return; c.innerHTML='';
  window.PULMO_AGENTES.forEach(ag=>{ const active=licencaAtiva(ag.id); const div=document.createElement('article'); div.className='card agent-card'; div.innerHTML=`<div class="agent-meta"><span>${ag.categoria}</span><span class="badge ${active?'ok':'lock'}">${active?'Liberado':'Acesso controlado'}</span></div><h3>${ag.nome}</h3><p class="muted">${ag.descricao}</p><div class="agent-file">${ag.arquivo}</div><div class="actions">${active?`<button class="btn primary" onclick="abrirAgente('${ag.id}')">Abrir agente</button>`:`<button class="btn primary" onclick="solicitarAcesso('${ag.id}')">Cadastre-se para acessar</button>`}<a class="btn" href="cadastro-medico.html">Cadastro</a></div>`; c.appendChild(div); });
}
function adminLogin(){const email=el('email').value.trim();const senha=el('senha').value.trim(); if(!email||!senha){alert('Informe e-mail e senha.');return} setLocal('pulmo_admin',{email,logadoEm:new Date().toISOString()}); location.href='dashboard.html'}
function renderAdmin(){
  const sol=getLocal('pulmo_solicitacoes',[]), med=getLocal('pulmo_medicos',[]), lic=getLocal('pulmo_licencas',[]);
  if(el('kpiMedicos')){el('kpiMedicos').textContent=med.length;el('kpiSolicitacoes').textContent=sol.filter(s=>s.status==='pendente').length;el('kpiLicencas').textContent=lic.filter(l=>l.status!=='revogada').length;el('kpiAgentes').textContent=window.PULMO_AGENTES.length}
  if(el('tabelaSolicitacoes')){el('tabelaSolicitacoes').innerHTML=sol.map(s=>`<tr><td>${s.nome||''}<br><small>${s.email}</small></td><td>${s.crm||''}</td><td>${s.agentId}</td><td>${s.status}</td><td><button class="btn primary" onclick="aprovar('${s.id}')">Aprovar 7d</button> <button class="btn" onclick="permanente('${s.id}')">Permanente</button> <button class="btn danger" onclick="rejeitar('${s.id}')">Rejeitar</button></td></tr>`).join('')}
  if(el('tabelaLicencas')){el('tabelaLicencas').innerHTML=lic.map(l=>`<tr><td>${l.email}</td><td>${l.agentId}</td><td>${l.tipo}</td><td>${l.status}</td><td>${l.expiraEm||'Sem expiração'}</td><td><button class="btn danger" onclick="revogar('${l.id}')">Revogar</button></td></tr>`).join('')}
}
function aprovar(id){criarLicenca(id,'trial')} function permanente(id){criarLicenca(id,'permanente')}
function criarLicenca(id,tipo){const sol=getLocal('pulmo_solicitacoes',[]); const s=sol.find(x=>x.id===id); if(!s)return; s.status='aprovada'; setLocal('pulmo_solicitacoes',sol); const lic=getLocal('pulmo_licencas',[]); const exp=new Date(Date.now()+window.PULMO_CONFIG.trialDias*86400000).toISOString(); lic.push({id:'lic_'+Date.now(),email:s.email,agentId:s.agentId,tipo,status:'ativa',inicioEm:new Date().toISOString(),expiraEm:tipo==='trial'?exp:null}); setLocal('pulmo_licencas',lic); renderAdmin()}
function rejeitar(id){const sol=getLocal('pulmo_solicitacoes',[]); const s=sol.find(x=>x.id===id); if(s)s.status='rejeitada'; setLocal('pulmo_solicitacoes',sol); renderAdmin()}
function revogar(id){const lic=getLocal('pulmo_licencas',[]); const l=lic.find(x=>x.id===id); if(l)l.status='revogada'; setLocal('pulmo_licencas',lic); renderAdmin()}
document.addEventListener('DOMContentLoaded',()=>{renderCatalogo('catalogoGrid');renderAdmin();});
