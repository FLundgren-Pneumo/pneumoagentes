/* PneumoAgents - teste gratuito de 7 dias (controle local, por navegador).
   Primeira camada funcional: fica gravado apenas neste navegador (localStorage).
   Uso: <script src="../../assets/js/trial-gate.js" data-agent="id" data-nome="Nome"></script>
   Botao "Solicitar desbloqueio": abre e-mail (mailto) ao autor com os dados do teste deste navegador.
   "Tenho um codigo de ativacao": codigo pessoal (e-mail + agente + validade) gerado pelo autor; libera ate a validade. */
(function(){
  var s=document.currentScript||document.querySelector('script[data-agent]');
  var AG=(s&&s.getAttribute('data-agent'))||'agente';
  var NOME=(s&&s.getAttribute('data-nome'))||'este agente';
  var PORTAL=(s&&s.getAttribute('data-portal'))||'../../index.html';
  var DIAS=7, KEY='pneumo_trial_'+AG, DIA=86400000;
  var TAXA='R$ 100,00 por semestre de uso';
  var EMAIL='lundgrenf@gmail.com';
  /* --- Codigo de ativacao (mesmo algoritmo do gerador offline do autor) ---
     codigo = PNEU-VVVH-HHHH-HHHH; VVV = validade (dias desde 2026-01-01, base32);
     H = SHA-256("PNEUMOAGENTS|v1|"+SAL+"|"+email normalizado+"|"+slug do agente+"|"+AAAA-MM-DD), base32.
     Alfabeto sem caracteres ambiguos (sem 0, O, 1, I). */
  var ALF='23456789ABCDEFGHJKLMNPQRSTUVWXYZ', SAL='PA-9e43073f0ac299c06c591d78c6523189', EPOCA=Date.UTC(2026,0,1);
  function normEmail(e){return String(e||'').toLowerCase().replace(/\s+/g,'')}
  function sha256js(str){var b=unescape(encodeURIComponent(str)),i,j,K=[],H=[],w=[],l=b.length*8,p=2,n=0,words=[];
    function primo(q){for(var f=2;f*f<=q;f++)if(q%f===0)return false;return true}
    function fr(x){return ((x-Math.floor(x))*4294967296)|0}
    for(;n<64;p++)if(primo(p)){if(n<8)H[n]=fr(Math.pow(p,1/2));K[n++]=fr(Math.pow(p,1/3))}
    b+='\x80';while(b.length%64!==56)b+='\x00';
    for(i=0;i<b.length;i++)words[i>>2]|=b.charCodeAt(i)<<((3-i%4)*8);
    words.push((l/4294967296)|0);words.push(l|0);
    for(j=0;j<words.length;j+=16){var a=H.slice(0,8);
      for(i=0;i<64;i++){
        if(i<16)w[i]=words[j+i]|0;else{var x=w[i-15],y=w[i-2];w[i]=(w[i-16]+((x>>>7|x<<25)^(x>>>18|x<<14)^(x>>>3))+w[i-7]+((y>>>17|y<<15)^(y>>>19|y<<13)^(y>>>10)))|0}
        var e=a[4],t1=a[7]+((e>>>6|e<<26)^(e>>>11|e<<21)^(e>>>25|e<<7))+((e&a[5])^(~e&a[6]))+K[i]+w[i],c=a[0],
            t2=((c>>>2|c<<30)^(c>>>13|c<<19)^(c>>>22|c<<10))+((c&a[1])^(c&a[2])^(a[1]&a[2]));
        a.unshift((t1+t2)|0);a[4]=(a[4]+t1)|0;a.pop();
      }
      for(i=0;i<8;i++)H[i]=(H[i]+a[i])|0;}
    var out=[];for(i=0;i<32;i++)out.push((H[i>>2]>>>((3-i%4)*8))&255);return out}
  function sha(str){try{if(window.crypto&&crypto.subtle&&window.TextEncoder){return crypto.subtle.digest('SHA-256',new TextEncoder().encode(str)).then(function(b){return Array.prototype.slice.call(new Uint8Array(b))},function(){return sha256js(str)})}}catch(e){}return Promise.resolve(sha256js(str))}
  function b32(bytes,n){var bits='',o='',i;for(i=0;i<bytes.length&&bits.length<n*5;i++)bits+=('00000000'+bytes[i].toString(2)).slice(-8);for(i=0;i<n;i++)o+=ALF.charAt(parseInt(bits.substr(i*5,5),2));return o}
  function dataParaDias(iso){var m=/^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso||''));return m?Math.round((Date.UTC(+m[1],m[2]-1,+m[3])-EPOCA)/864e5):NaN}
  function diasParaData(d){return new Date(EPOCA+d*864e5).toISOString().slice(0,10)}
  function limparCodigo(c){var s=String(c||'').toUpperCase().replace(/[^0-9A-Z]/g,'');if(s.length===16&&s.indexOf('PNEU')===0)s=s.slice(4);return s}
  function gerarCodigo(email,slug,validade){var d=dataParaDias(validade);if(!(d>=0&&d<32768))return Promise.reject(new Error('validade fora do intervalo'));
    var v=ALF.charAt((d>>10)&31)+ALF.charAt((d>>5)&31)+ALF.charAt(d&31);
    return sha('PNEUMOAGENTS|v1|'+SAL+'|'+normEmail(email)+'|'+slug+'|'+diasParaData(d)).then(function(h){var c=v+b32(h,9);return 'PNEU-'+c.slice(0,4)+'-'+c.slice(4,8)+'-'+c.slice(8,12)})}
  function verificarCodigo(codigo,email,slug){var s=limparCodigo(codigo);
    if(s.length!==12||/[^23456789A-HJ-NP-Z]/.test(s))return Promise.resolve({ok:false,motivo:'formato'});
    var d=ALF.indexOf(s[0])*1024+ALF.indexOf(s[1])*32+ALF.indexOf(s[2]),validade=diasParaData(d);
    return gerarCodigo(email,slug,validade).then(function(c){return limparCodigo(c)===s?{ok:true,validade:validade,codigo:c}:{ok:false,motivo:'invalido'}})}
  function hojeISO(){var d=new Date();function p(n){return (n<10?'0':'')+n}return d.getFullYear()+'-'+p(d.getMonth()+1)+'-'+p(d.getDate())}
  /* --- fim do bloco compartilhado --- */
  function ler(){try{return JSON.parse(localStorage.getItem(KEY)||'null')}catch(e){return null}}
  function gravar(r){localStorage.setItem(KEY,JSON.stringify(r))}
  function dataBR(iso){var m=/^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso||''));if(m)return m[3]+'/'+m[2]+'/'+m[1];var d=new Date(iso);if(!iso||isNaN(d.getTime()))return '';function p(n){return (n<10?'0':'')+n}return p(d.getDate())+'/'+p(d.getMonth()+1)+'/'+d.getFullYear()}
  function esc(x){return String(x==null?'':x).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
  function linkDesbloqueio(){
    var r=ler()||{};
    var assunto='PneumoAgents — Solicitação de desbloqueio: '+NOME;
    var linhas=['Olá,','','Solicito o desbloqueio do agente abaixo.','',
      'Agente: '+NOME,
      'Página: '+String(location.href).split('#')[0],
      'Nome: '+(r.nome||''),
      'E-mail: '+(r.email||''),
      'CRM: '+(r.crm||''),
      'UF: '+(r.uf||'')];
    var ini=dataBR(r.inicio); if(ini)linhas.push('Início do teste: '+ini);
    if(r.ativacao&&r.ativacao.validade)linhas.push('Ativação anterior válida até: '+dataBR(r.ativacao.validade));
    linhas.push('','Estou ciente da taxa de uso de R$ 100,00 por semestre.','','Observações:');
    return 'mailto:'+EMAIL+'?subject='+encodeURIComponent(assunto)+'&body='+linhas.map(encodeURIComponent).join('%0D%0A');
  }
  function copiarEmail(btn){
    function ok(){if(btn){btn.textContent='E-mail copiado';setTimeout(function(){btn.textContent='Copiar e-mail'},2500)}}
    function manual(){
      try{var ta=document.createElement('textarea');ta.value=EMAIL;ta.setAttribute('readonly','');ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.select();var feito=document.execCommand&&document.execCommand('copy');ta.remove();if(feito){ok();return}}catch(e){}
      window.prompt('Copie o e-mail:',EMAIL);
    }
    try{if(navigator.clipboard&&window.isSecureContext){navigator.clipboard.writeText(EMAIL).then(ok,manual);return}}catch(e){}
    manual();
  }
  function ligarCopiar(raiz){var b=raiz.querySelectorAll('.pneumo-copiar-email');for(var i=0;i<b.length;i++){b[i].addEventListener('click',function(ev){ev.preventDefault();copiarEmail(this)})}}
  var estiloLink='color:#7dd3fc;text-decoration:underline';
  var estiloCopiar='background:transparent;color:#7dd3fc;border:1px solid #243552;border-radius:7px;padding:3px 8px;font:inherit;font-size:.78rem;cursor:pointer';
  var estiloInput='box-sizing:border-box;width:100%;padding:9px;border-radius:8px;border:1px solid #243552;background:#0b1220;color:#e5eef8';
  /* Formulario do codigo: usa o e-mail do cadastro salvo; sem cadastro, pede o e-mail no proprio campo. */
  function formCodigo(aberto){
    var r=ler()||{}, em=normEmail(r.email);
    return '<div class="pneumo-codigo" style="margin-top:14px;border-top:1px solid #243552;padding-top:12px">'+
      (aberto?'<div style="font-weight:650;font-size:.9rem;margin-bottom:6px">Tenho um código de ativação</div>'
             :'<a href="#" class="pneumo-codigo-toggle" style="'+estiloLink+';font-size:.82rem">Tenho um código de ativação</a>')+
      '<div class="pneumo-codigo-corpo" style="display:'+(aberto?'grid':'none')+';gap:8px;margin-top:6px">'+
        (em?'<p style="color:#9fb3c8;font-size:.8rem;margin:0">Código vinculado ao e-mail do cadastro: <b style="color:#e5eef8">'+esc(em)+'</b></p>'
           :'<input class="pc-email" type="email" placeholder="E-mail usado na solicitação" autocomplete="email" style="'+estiloInput+'">')+
        '<div style="display:flex;gap:8px"><input class="pc-codigo" type="text" placeholder="PNEU-XXXX-XXXX-XXXX" autocomplete="off" autocapitalize="characters" spellcheck="false" style="'+estiloInput+';text-transform:uppercase;letter-spacing:.06em;font-family:ui-monospace,Consolas,monospace">'+
        '<button type="button" class="pc-ativar" style="background:#38bdf8;color:#082f49;font-weight:700;border:0;padding:0 14px;border-radius:9px;cursor:pointer">Ativar</button></div>'+
        '<p class="pc-msg" role="status" aria-live="polite" style="margin:0;font-size:.82rem;line-height:1.4;min-height:1em"></p>'+
      '</div></div>';
  }
  function ligarCodigo(raiz){
    var tg=raiz.querySelector('.pneumo-codigo-toggle');
    if(tg)tg.addEventListener('click',function(ev){ev.preventDefault();var c=raiz.querySelector('.pneumo-codigo-corpo');c.style.display=c.style.display==='none'?'grid':'none';var i=c.querySelector('input');if(i&&c.style.display!=='none')i.focus()});
    var bt=raiz.querySelector('.pc-ativar'), cod=raiz.querySelector('.pc-codigo'), msg=raiz.querySelector('.pc-msg');
    if(!bt)return;
    function aviso(txt,tipo){msg.textContent=txt;msg.style.color=tipo==='ok'?'#86efac':tipo==='info'?'#9fb3c8':'#fca5a5'}
    function ativar(){
      var r=ler()||{}, ie=raiz.querySelector('.pc-email');
      var email=normEmail(ie?ie.value:r.email), codigo=cod.value;
      if(!/^\S+@\S+\.\S+$/.test(email)){aviso('Informe um e-mail válido (o mesmo usado na solicitação do código).');return}
      if(!limparCodigo(codigo)){aviso('Digite o código de ativação.');return}
      aviso('Verificando...','info');bt.disabled=true;
      verificarCodigo(codigo,email,AG).then(function(v){
        bt.disabled=false;
        if(!v.ok){
          if(v.motivo==='formato')aviso('Código em formato inválido. O formato é PNEU-XXXX-XXXX-XXXX (o código não usa 0, O, 1 nem I).');
          else aviso('Código inválido para este e-mail e este agente. Confira a digitação e se o código foi emitido para '+NOME+' e para o e-mail '+email+'.');
          return;
        }
        if(v.validade<hojeISO()){aviso('Este código venceu em '+dataBR(v.validade)+'. Solicite um novo código pelo botão "Solicitar desbloqueio".');return}
        var r2=ler()||{agente:AG};
        if(!r2.agente)r2.agente=AG;
        if(!r2.email)r2.email=email;
        r2.ativacao={codigo:v.codigo,email:email,validade:v.validade,ativadoEm:new Date().toISOString()};
        gravar(r2);
        aviso('Código válido! Acesso liberado até '+dataBR(v.validade)+'.','ok');
        setTimeout(function(){location.reload()},1200);
      },function(){bt.disabled=false;aviso('Não foi possível validar o código neste navegador. Tente um navegador atualizado.')});
    }
    bt.addEventListener('click',ativar);
    cod.addEventListener('keydown',function(ev){if(ev.key==='Enter'){ev.preventDefault();ativar()}});
  }
  var t=ler(), agora=Date.now(), ativVencida='';
  if(t&&t.ativacao&&typeof t.ativacao==='object'&&t.ativacao.codigo&&t.ativacao.validade){
    if(hojeISO()<=t.ativacao.validade){
      /* Ativacao dentro da validade: libera e reconfere o codigo em segundo plano (evita ativacao editada a mao). */
      verificarCodigo(t.ativacao.codigo,t.ativacao.email||t.email,AG).then(function(v){
        if(!v.ok||v.validade!==t.ativacao.validade){var r=ler()||{};delete r.ativacao;gravar(r);location.reload()}
      },function(){});
      return;
    }
    ativVencida=t.ativacao.validade;
  }
  if(!ativVencida&&t&&t.inicio&&(agora-new Date(t.inicio).getTime())<DIAS*DIA){
    var rest=Math.ceil((new Date(t.inicio).getTime()+DIAS*DIA-agora)/DIA);
    document.addEventListener('DOMContentLoaded',function(){
      var b=document.createElement('div');
      b.setAttribute('style','position:fixed;right:10px;bottom:10px;z-index:2147483000;background:#0b1220;color:#e5eef8;border:1px solid #38bdf8;border-radius:10px;padding:6px 10px;font:12px system-ui,sans-serif;opacity:.92');
      b.className='pneumo-trial-badge';
      b.appendChild(document.createTextNode('PneumoAgents · teste gratuito: '+rest+' dia(s) restante(s) · depois, '+TAXA+' · '));
      var a=document.createElement('a');
      a.className='pneumo-desbloqueio-link'; a.href=linkDesbloqueio(); a.textContent='Solicitar desbloqueio';
      a.title='Abrir e-mail para '+EMAIL; a.setAttribute('style',estiloLink);
      b.appendChild(a);
      b.appendChild(document.createTextNode(' · '));
      var k=document.createElement('a');
      k.className='pneumo-codigo-link'; k.href='#'; k.textContent='Tenho um código'; k.setAttribute('style',estiloLink);
      k.addEventListener('click',function(ev){ev.preventDefault();abrirModalCodigo()});
      b.appendChild(k);
      document.body.appendChild(b);
    });
    return;
  }
  var expirado=!!(t&&t.inicio)||!!ativVencida;
  var css='position:fixed;inset:0;z-index:2147483647;background:rgba(11,18,32,.97);display:flex;align-items:center;justify-content:center;padding:18px;font-family:system-ui,Segoe UI,sans-serif;color:#e5eef8';
  var caixa='<div style="max-width:460px;width:100%;background:#152238;border:1px solid #243552;border-radius:14px;padding:22px">'+
      '<div style="color:#7dd3fc;font-size:11px;text-transform:uppercase;letter-spacing:.07em;font-weight:650">PneumoAgents</div>';
  function abrirModalCodigo(){
    if(document.getElementById('pneumo-codigo-modal'))return;
    var o=document.createElement('div'); o.id='pneumo-codigo-modal'; o.setAttribute('style',css);
    o.innerHTML=caixa+'<h2 style="margin:.4rem 0 .2rem;font-size:1.15rem">'+NOME+' · código de ativação</h2>'+
      '<p style="color:#9fb3c8;line-height:1.5;font-size:.88rem;margin:.3rem 0 0">Cole o código recebido por e-mail. O código é pessoal, vinculado ao seu e-mail e a este agente.</p>'+
      formCodigo(true)+'<button type="button" class="pc-fechar" style="margin-top:12px;background:transparent;color:#7dd3fc;border:1px solid #243552;border-radius:9px;padding:7px 12px;cursor:pointer">Fechar</button></div>';
    document.body.appendChild(o); ligarCodigo(o);
    o.querySelector('.pc-fechar').addEventListener('click',function(){o.remove()});
    var i=o.querySelector('.pc-email')||o.querySelector('.pc-codigo'); if(i)i.focus();
  }
  function montar(){
    var o=document.createElement('div'); o.id='pneumo-trial-gate'; o.setAttribute('style',css);
    var box=caixa;
    if(expirado){
      box+='<h2 style="margin:.4rem 0 .6rem;font-size:1.25rem">'+(ativVencida?'Ativação vencida':'Período de teste encerrado')+'</h2>'+
        (ativVencida
          ?'<p style="color:#9fb3c8;line-height:1.5;font-size:.92rem">A ativação de <b>'+NOME+'</b> neste navegador venceu em <b>'+dataBR(ativVencida)+'</b>. O uso continuado tem taxa de <b>'+TAXA+'</b>. Para continuar usando, solicite o desbloqueio ao autor pelo botão abaixo ou informe um novo código.</p>'
          :'<p style="color:#9fb3c8;line-height:1.5;font-size:.92rem">O teste gratuito de '+DIAS+' dias de <b>'+NOME+'</b> terminou neste navegador. O uso continuado tem taxa de <b>'+TAXA+'</b>. Para continuar usando, solicite o desbloqueio ao autor pelo botão abaixo.</p>')+
        '<div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:8px">'+
        '<a id="pneumo-desbloqueio" href="'+linkDesbloqueio()+'" style="display:inline-block;background:#38bdf8;color:#082f49;font-weight:700;text-decoration:none;padding:9px 14px;border-radius:9px">Solicitar desbloqueio</a>'+
        '<a href="'+PORTAL+'" style="display:inline-block;background:transparent;color:#7dd3fc;border:1px solid #243552;font-weight:600;text-decoration:none;padding:8px 13px;border-radius:9px">Voltar ao portal</a></div>'+
        '<p style="color:#9fb3c8;font-size:.82rem;margin:.8rem 0 0;display:flex;flex-wrap:wrap;align-items:center;gap:6px">ou escreva para <b style="color:#e5eef8;user-select:all">'+EMAIL+'</b> <button type="button" class="pneumo-copiar-email" style="'+estiloCopiar+'">Copiar e-mail</button></p>'+
        formCodigo(true);
    }else{
      box+='<h2 style="margin:.4rem 0 .6rem;font-size:1.25rem">'+NOME+' · teste gratuito de '+DIAS+' dias</h2>'+
        '<p style="color:#9fb3c8;line-height:1.5;font-size:.9rem">Ferramenta de apoio à decisão para médicos. Informe seus dados para iniciar o teste. Os dados ficam só neste navegador.</p>'+
        '<p style="color:#9fb3c8;line-height:1.5;font-size:.9rem;margin-top:-.2rem">Após o teste, o uso continuado tem taxa de <b style="color:#7dd3fc">'+TAXA+'</b>.</p>'+
        '<form id="pneumo-trial-form" style="display:grid;gap:8px;margin-top:10px">'+
        inp('pt-nome','Nome completo','text')+inp('pt-email','E-mail','email')+
        '<div style="display:grid;grid-template-columns:2fr 1fr;gap:8px">'+inp('pt-crm','CRM','text')+inp('pt-uf','UF','text')+'</div>'+
        '<label style="font-size:.8rem;color:#9fb3c8;display:flex;gap:6px;align-items:flex-start"><input type="checkbox" id="pt-ok" required> Sou médico(a) e entendo que o conteúdo é educativo e não substitui o julgamento clínico.</label>'+
        '<button type="submit" style="background:#38bdf8;color:#082f49;font-weight:700;border:0;padding:10px;border-radius:9px;cursor:pointer">Iniciar teste</button>'+
        '<a href="'+PORTAL+'" style="color:#7dd3fc;font-size:.82rem">Voltar ao portal</a></form>'+
        '<p style="color:#9fb3c8;font-size:.78rem;margin:.7rem 0 0;display:flex;flex-wrap:wrap;align-items:center;gap:6px">Já quer usar sem limite? <a class="pneumo-desbloqueio-link" href="'+linkDesbloqueio()+'" style="'+estiloLink+'">Solicitar desbloqueio</a> · ou escreva para '+EMAIL+' <button type="button" class="pneumo-copiar-email" style="'+estiloCopiar+'">Copiar e-mail</button></p>'+
        formCodigo(false);
    }
    box+='</div>'; o.innerHTML=box; document.body.appendChild(o);
    ligarCopiar(o); ligarCodigo(o);
    var f=document.getElementById('pneumo-trial-form');
    if(f){f.addEventListener('submit',function(ev){ev.preventDefault();
      var v=function(id){return (document.getElementById(id).value||'').trim()};
      var uf=v('pt-uf').toUpperCase();
      if(!v('pt-nome')||!/^\S+@\S+\.\S+$/.test(v('pt-email'))||!v('pt-crm')||!/^[A-Z]{2}$/.test(uf)){alert('Preencha nome, e-mail válido, CRM e UF (2 letras).');return}
      localStorage.setItem(KEY,JSON.stringify({agente:AG,nome:v('pt-nome'),email:v('pt-email'),crm:v('pt-crm'),uf:uf,inicio:new Date().toISOString()}));
      o.remove(); location.reload();
    });}
  }
  function inp(id,ph,type){return '<input id="'+id+'" type="'+type+'" placeholder="'+ph+'" required style="'+estiloInput+'">'}
  if(document.body){montar()}else{document.addEventListener('DOMContentLoaded',montar)}
})();
