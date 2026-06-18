function el(id){return document.getElementById(id)}
function getLocal(key,fallback=null){try{return JSON.parse(localStorage.getItem(key)||'null')??fallback}catch(e){return fallback}}
function setLocal(key,val){localStorage.setItem(key,JSON.stringify(val))}
function usuarioAtual(){return getLocal('pulmo_user')}
function escapeHtml(v){return String(v??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
function confirmarExclusao(tipo, detalhe){return confirm('Confirmar exclusão definitiva de '+tipo+'?\n\n'+detalhe+'\n\nEsta ação não poderá ser desfeita neste protótipo local.')}
function cadastrarMedico(){
  const medico={id:'med_'+Date.now(),nome:el('nome').value.trim(),email:el('email').value.trim(),crm:el('crm').value.trim(),uf:el('uf').value.trim(),instituicao:el('instituicao').value.trim(),status:'pendente',criadoEm:new Date().toISOString()};
  if(!medico.nome||!medico.email||!medico.crm||!medico.uf){alert('Preencha nome, e-mail, CRM e UF.');return}
  setLocal('pulmo_user',medico);
  const medicos=getLocal('pulmo_medicos',[]);
  const i=medicos.findIndex(m=>m.email===medico.email);
  if(i>=0) medicos[i]={...medicos[i],...medico}; else medicos.push(medico);
  setLocal('pulmo_medicos',medicos);
  alert('Cadastro recebido. Agora você pode solicitar acesso aos agentes.'); location.href='catalogo.html';
}
function loginMedico(){
  const email=el('email').value.trim(); const medicos=getLocal('pulmo_medicos',[]); const m=medicos.find(x=>x.email===email)||{id:'med_'+Date.now(),nome:'Médico',email,status:'pendente'}; setLocal('pulmo_user',m); location.href='catalogo.html';
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
  window.PULMO_AGENTES.forEach(ag=>{ const active=licencaAtiva(ag.id); const div=document.createElement('article'); div.className='card agent-card'; div.innerHTML=`<div class="agent-meta"><span>${escapeHtml(ag.categoria)}</span><span class="badge ${active?'ok':'lock'}">${active?'Liberado':'Acesso controlado'}</span></div><h3>${escapeHtml(ag.nome)}</h3><p class="muted">${escapeHtml(ag.descricao)}</p><div class="agent-file">${escapeHtml(ag.arquivo)}</div><div class="actions">${active?`<button class="btn primary" onclick="abrirAgente('${ag.id}')">Abrir agente</button>`:`<button class="btn primary" onclick="solicitarAcesso('${ag.id}')">Cadastre-se para acessar</button>`}<a class="btn" href="cadastro-medico.html">Cadastro</a></div>`; c.appendChild(div); });
}
function adminLogin(){const email=el('email').value.trim();const senha=el('senha').value.trim(); if(!email||!senha){alert('Informe e-mail e senha.');return} setLocal('pulmo_admin',{email,logadoEm:new Date().toISOString()}); location.href='dashboard.html'}
function nomeAgente(id){const ag=(window.PULMO_AGENTES||[]).find(a=>a.id===id); return ag?ag.nome:id}
function renderAdmin(){
  const sol=getLocal('pulmo_solicitacoes',[]), med=getLocal('pulmo_medicos',[]), lic=getLocal('pulmo_licencas',[]);
  if(el('kpiMedicos')){el('kpiMedicos').textContent=med.length;el('kpiSolicitacoes').textContent=sol.filter(s=>s.status==='pendente').length;el('kpiLicencas').textContent=lic.filter(l=>l.status!=='revogada').length;el('kpiAgentes').textContent=window.PULMO_AGENTES.length}
  if(el('tabelaMedicos')){el('tabelaMedicos').innerHTML=med.map(m=>`<tr><td>${escapeHtml(m.nome)}<br><small>${escapeHtml(m.email)}</small></td><td>${escapeHtml(m.crm||'')}/${escapeHtml(m.uf||'')}</td><td>${escapeHtml(m.instituicao||'')}</td><td>${escapeHtml(m.status||'pendente')}</td><td><button class="btn" onclick="aprovarMedico('${m.email}')">Aprovar</button> <button class="btn" onclick="bloquearMedico('${m.email}')">Bloquear</button> <button class="btn danger" onclick="excluirMedico('${m.email}')">Excluir</button></td></tr>`).join('') || '<tr><td colspan="5">Nenhum médico cadastrado.</td></tr>'}
  if(el('tabelaSolicitacoes')){el('tabelaSolicitacoes').innerHTML=sol.map(s=>`<tr><td>${escapeHtml(s.nome||'')}<br><small>${escapeHtml(s.email)}</small></td><td>${escapeHtml(s.crm||'')}</td><td>${escapeHtml(nomeAgente(s.agentId))}</td><td>${escapeHtml(s.status)}</td><td><button class="btn primary" onclick="aprovar('${s.id}')">Aprovar 7d</button> <button class="btn" onclick="permanente('${s.id}')">Permanente</button> <button class="btn" onclick="rejeitar('${s.id}')">Rejeitar</button> <button class="btn danger" onclick="excluirSolicitacao('${s.id}')">Excluir</button></td></tr>`).join('') || '<tr><td colspan="5">Nenhuma solicitação registrada.</td></tr>'}
  if(el('tabelaLicencas')){el('tabelaLicencas').innerHTML=lic.map(l=>`<tr><td>${escapeHtml(l.email)}</td><td>${escapeHtml(nomeAgente(l.agentId))}</td><td>${escapeHtml(l.tipo)}</td><td>${escapeHtml(l.status)}</td><td>${escapeHtml(l.expiraEm||'Sem expiração')}</td><td><button class="btn" onclick="revogar('${l.id}')">Revogar</button> <button class="btn danger" onclick="excluirLicenca('${l.id}')">Excluir</button></td></tr>`).join('') || '<tr><td colspan="6">Nenhuma licença registrada.</td></tr>'}
}
function aprovarMedico(email){const med=getLocal('pulmo_medicos',[]); const m=med.find(x=>x.email===email); if(m)m.status='aprovado'; setLocal('pulmo_medicos',med); renderAdmin()}
function bloquearMedico(email){const med=getLocal('pulmo_medicos',[]); const m=med.find(x=>x.email===email); if(m)m.status='bloqueado'; setLocal('pulmo_medicos',med); renderAdmin()}
function excluirMedico(email){
  if(!confirmarExclusao('médico',email))return;
  setLocal('pulmo_medicos',getLocal('pulmo_medicos',[]).filter(m=>m.email!==email));
  setLocal('pulmo_solicitacoes',getLocal('pulmo_solicitacoes',[]).filter(s=>s.email!==email));
  setLocal('pulmo_licencas',getLocal('pulmo_licencas',[]).filter(l=>l.email!==email));
  const u=usuarioAtual(); if(u&&u.email===email)localStorage.removeItem('pulmo_user');
  renderAdmin();
}
function excluirSolicitacao(id){const sol=getLocal('pulmo_solicitacoes',[]); const s=sol.find(x=>x.id===id); if(!s)return; if(!confirmarExclusao('solicitação',`${s.email} · ${nomeAgente(s.agentId)}`))return; setLocal('pulmo_solicitacoes',sol.filter(x=>x.id!==id)); renderAdmin()}
function excluirLicenca(id){const lic=getLocal('pulmo_licencas',[]); const l=lic.find(x=>x.id===id); if(!l)return; if(!confirmarExclusao('licença',`${l.email} · ${nomeAgente(l.agentId)}`))return; setLocal('pulmo_licencas',lic.filter(x=>x.id!==id)); renderAdmin()}
function limparTudoAdmin(){if(!confirm('Apagar TODOS os cadastros, solicitações e licenças deste navegador?'))return; localStorage.removeItem('pulmo_medicos'); localStorage.removeItem('pulmo_solicitacoes'); localStorage.removeItem('pulmo_licencas'); localStorage.removeItem('pulmo_user'); renderAdmin()}
function aprovar(id){criarLicenca(id,'trial')} function permanente(id){criarLicenca(id,'permanente')}
function criarLicenca(id,tipo){const sol=getLocal('pulmo_solicitacoes',[]); const s=sol.find(x=>x.id===id); if(!s)return; s.status='aprovada'; setLocal('pulmo_solicitacoes',sol); const lic=getLocal('pulmo_licencas',[]); const exp=new Date(Date.now()+window.PULMO_CONFIG.trialDias*86400000).toISOString(); lic.push({id:'lic_'+Date.now(),email:s.email,agentId:s.agentId,tipo,status:'ativa',inicioEm:new Date().toISOString(),expiraEm:tipo==='trial'?exp:null}); setLocal('pulmo_licencas',lic); renderAdmin()}
function rejeitar(id){const sol=getLocal('pulmo_solicitacoes',[]); const s=sol.find(x=>x.id===id); if(s)s.status='rejeitada'; setLocal('pulmo_solicitacoes',sol); renderAdmin()}
function revogar(id){const lic=getLocal('pulmo_licencas',[]); const l=lic.find(x=>x.id===id); if(l)l.status='revogada'; setLocal('pulmo_licencas',lic); renderAdmin()}
document.addEventListener('DOMContentLoaded',()=>{renderCatalogo('catalogoGrid');renderAdmin();});
