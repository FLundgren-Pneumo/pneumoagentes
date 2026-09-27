/* PneumoAgents - teste gratuito de 7 dias (controle local, por navegador).
   Primeira camada funcional: fica gravado apenas neste navegador (localStorage).
   Uso: <script src="../../assets/js/trial-gate.js" data-agent="id" data-nome="Nome"></script> */
(function(){
  var s=document.currentScript||document.querySelector('script[data-agent]');
  var AG=(s&&s.getAttribute('data-agent'))||'agente';
  var NOME=(s&&s.getAttribute('data-nome'))||'este agente';
  var PORTAL=(s&&s.getAttribute('data-portal'))||'../../index.html';
  var DIAS=7, KEY='pneumo_trial_'+AG, DIA=86400000;
  var TAXA='R$ 100,00 por semestre de uso';
  function ler(){try{return JSON.parse(localStorage.getItem(KEY)||'null')}catch(e){return null}}
  var t=ler(), agora=Date.now();
  if(t&&t.ativacao){return;}
  if(t&&t.inicio&&(agora-new Date(t.inicio).getTime())<DIAS*DIA){
    var rest=Math.ceil((new Date(t.inicio).getTime()+DIAS*DIA-agora)/DIA);
    document.addEventListener('DOMContentLoaded',function(){
      var b=document.createElement('div');
      b.setAttribute('style','position:fixed;right:10px;bottom:10px;z-index:2147483000;background:#0b1220;color:#e5eef8;border:1px solid #38bdf8;border-radius:10px;padding:6px 10px;font:12px system-ui,sans-serif;opacity:.92');
      b.className='pneumo-trial-badge';
      b.textContent='PneumoAgents · teste gratuito: '+rest+' dia(s) restante(s) · depois, '+TAXA;
      document.body.appendChild(b);
    });
    return;
  }
  var expirado=!!(t&&t.inicio);
  var css='position:fixed;inset:0;z-index:2147483647;background:rgba(11,18,32,.97);display:flex;align-items:center;justify-content:center;padding:18px;font-family:system-ui,Segoe UI,sans-serif;color:#e5eef8';
  function montar(){
    var o=document.createElement('div'); o.id='pneumo-trial-gate'; o.setAttribute('style',css);
    var box='<div style="max-width:460px;width:100%;background:#152238;border:1px solid #243552;border-radius:14px;padding:22px">'+
      '<div style="color:#7dd3fc;font-size:11px;text-transform:uppercase;letter-spacing:.07em;font-weight:650">PneumoAgents</div>';
    if(expirado){
      box+='<h2 style="margin:.4rem 0 .6rem;font-size:1.25rem">Período de teste encerrado</h2>'+
        '<p style="color:#9fb3c8;line-height:1.5;font-size:.92rem">O teste gratuito de '+DIAS+' dias de <b>'+NOME+'</b> terminou neste navegador. O uso continuado tem taxa de <b>'+TAXA+'</b>. Para continuar usando, solicite a ativação ao autor.</p>'+
        '<a href="'+PORTAL+'" style="display:inline-block;margin-top:8px;background:#38bdf8;color:#082f49;font-weight:700;text-decoration:none;padding:9px 14px;border-radius:9px">Voltar ao portal</a>';
    }else{
      box+='<h2 style="margin:.4rem 0 .6rem;font-size:1.25rem">'+NOME+' · teste gratuito de '+DIAS+' dias</h2>'+
        '<p style="color:#9fb3c8;line-height:1.5;font-size:.9rem">Ferramenta de apoio à decisão para médicos. Informe seus dados para iniciar o teste. Os dados ficam só neste navegador.</p>'+
        '<p style="color:#9fb3c8;line-height:1.5;font-size:.9rem;margin-top:-.2rem">Após o teste, o uso continuado tem taxa de <b style="color:#7dd3fc">'+TAXA+'</b>.</p>'+
        '<form id="pneumo-trial-form" style="display:grid;gap:8px;margin-top:10px">'+
        inp('pt-nome','Nome completo','text')+inp('pt-email','E-mail','email')+
        '<div style="display:grid;grid-template-columns:2fr 1fr;gap:8px">'+inp('pt-crm','CRM','text')+inp('pt-uf','UF','text')+'</div>'+
        '<label style="font-size:.8rem;color:#9fb3c8;display:flex;gap:6px;align-items:flex-start"><input type="checkbox" id="pt-ok" required> Sou médico(a) e entendo que o conteúdo é educativo e não substitui o julgamento clínico.</label>'+
        '<button type="submit" style="background:#38bdf8;color:#082f49;font-weight:700;border:0;padding:10px;border-radius:9px;cursor:pointer">Iniciar teste</button>'+
        '<a href="'+PORTAL+'" style="color:#7dd3fc;font-size:.82rem">Voltar ao portal</a></form>';
    }
    box+='</div>'; o.innerHTML=box; document.body.appendChild(o);
    var f=document.getElementById('pneumo-trial-form');
    if(f){f.addEventListener('submit',function(ev){ev.preventDefault();
      var v=function(id){return (document.getElementById(id).value||'').trim()};
      var uf=v('pt-uf').toUpperCase();
      if(!v('pt-nome')||!/^\S+@\S+\.\S+$/.test(v('pt-email'))||!v('pt-crm')||!/^[A-Z]{2}$/.test(uf)){alert('Preencha nome, e-mail válido, CRM e UF (2 letras).');return}
      localStorage.setItem(KEY,JSON.stringify({agente:AG,nome:v('pt-nome'),email:v('pt-email'),crm:v('pt-crm'),uf:uf,inicio:new Date().toISOString()}));
      o.remove(); location.reload();
    });}
  }
  function inp(id,ph,type){return '<input id="'+id+'" type="'+type+'" placeholder="'+ph+'" required style="box-sizing:border-box;width:100%;padding:9px;border-radius:8px;border:1px solid #243552;background:#0b1220;color:#e5eef8">'}
  if(document.body){montar()}else{document.addEventListener('DOMContentLoaded',montar)}
})();
