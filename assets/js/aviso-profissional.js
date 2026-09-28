/* PneumoAgents - aviso de conteudo profissional.
   Incluir com 1 linha no <head> de cada pagina profissional, ANTES do trial-gate.js:
   <script src="(caminho)/assets/js/aviso-profissional.js"></script>
   Nao e bloqueio real: a confirmacao fica apenas neste navegador (localStorage)
   e vale por 30 dias. Funciona offline. Nao incluir nas paginas de paciente. */
(function () {
  'use strict';
  var KEY = 'pneumo_prof_ok';
  var VALIDADE_MS = 30 * 24 * 60 * 60 * 1000;
  var memoria = null; // usado se o localStorage estiver indisponivel

  // Caminho da area do paciente, calculado a partir do endereco deste script (assets/js/ -> raiz)
  var script = document.currentScript;
  var areaPaciente = 'https://flundgren-pneumo.github.io/pneumoagentes-pacientes/';

  function ler() {
    try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { return memoria; }
  }
  function gravar() {
    var r = { ok: true, data: new Date().toISOString() };
    memoria = r;
    try { localStorage.setItem(KEY, JSON.stringify(r)); } catch (e) {}
  }
  function valido() {
    var r = ler();
    if (!r || !r.ok || !r.data) return false;
    var t = Date.parse(r.data);
    if (isNaN(t)) return false;
    var idade = Date.now() - t;
    return idade >= 0 && idade < VALIDADE_MS;
  }

  window.PneumoAvisoProfissional = { chave: KEY, valido: valido, areaPaciente: areaPaciente };
  if (valido()) return;

  // Esconde a pagina (inclusive o trial-gate) ate a confirmacao; so o aviso fica visivel.
  var root = document.documentElement;
  root.classList.add('pa-aviso-pendente');
  var st = document.createElement('style');
  st.id = 'pa-aviso-estilo';
  st.textContent =
    'html.pa-aviso-pendente{background:#0b1220;overflow:hidden!important}' +
    'html.pa-aviso-pendente body{visibility:hidden!important;overflow:hidden!important;max-width:100vw!important;max-height:100vh!important}' +
    '#pa-aviso{visibility:visible!important;position:fixed;inset:0;z-index:2147483647;display:flex;align-items:center;justify-content:center;padding:18px;background:rgba(11,18,32,.98);font-family:system-ui,"Segoe UI",Arial,sans-serif;color:#e5eef8;overflow:auto}' +
    '#pa-aviso *{font-family:system-ui,"Segoe UI",Arial,sans-serif;letter-spacing:normal;text-transform:none;text-shadow:none;box-sizing:border-box}' +
    '#pa-aviso .pa-caixa{max-width:560px;width:100%;background:#152238;border:1px solid #243552;border-top:5px solid #f59e0b;border-radius:16px;padding:24px 22px;box-shadow:0 20px 60px rgba(0,0,0,.45)}' +
    '#pa-aviso .pa-marca{color:#7dd3fc;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase}' +
    '#pa-aviso h2{margin:8px 0 12px;font-size:22px;font-weight:750;line-height:1.25;color:#fff}' +
    '#pa-aviso p{margin:0 0 10px;color:#c9d6e6;font-size:15px;line-height:1.5}' +
    '#pa-aviso ul{margin:0 0 14px;padding-left:20px;color:#c9d6e6;font-size:15px;line-height:1.5}' +
    '#pa-aviso .pa-botoes{display:flex;flex-direction:column;gap:10px;margin-top:16px}' +
    '#pa-aviso button,#pa-aviso a.pa-btn{display:block;width:100%;box-sizing:border-box;text-align:center;padding:13px 14px;border-radius:10px;font:700 15px system-ui,"Segoe UI",Arial,sans-serif;cursor:pointer;text-decoration:none}' +
    '#pa-aviso .pa-prof{background:#38bdf8;color:#082f49;border:0}' +
    '#pa-aviso .pa-pac{background:transparent;color:#e5eef8;border:2px solid #5eead4}' +
    '#pa-aviso button:focus-visible,#pa-aviso a.pa-btn:focus-visible{outline:3px solid #fde68a;outline-offset:2px}' +
    '#pa-aviso .pa-nota{margin-top:14px;color:#8aa0b8;font-size:12.5px}';
  (document.head || root).appendChild(st);

  function montar() {
    if (document.getElementById('pa-aviso')) return;
    var o = document.createElement('div');
    o.id = 'pa-aviso';
    o.setAttribute('role', 'dialog');
    o.setAttribute('aria-modal', 'true');
    o.setAttribute('aria-labelledby', 'pa-aviso-titulo');
    o.innerHTML =
      '<div class="pa-caixa">' +
      '<div class="pa-marca">PneumoAgents · área profissional</div>' +
      '<h2 id="pa-aviso-titulo">Conteúdo destinado a profissionais de saúde</h2>' +
      '<ul>' +
      '<li>Esta área traz informação técnica, com <b>doses e condutas</b>.</li>' +
      '<li>É de uso exclusivo de profissionais de saúde habilitados.</li>' +
      '<li>É material de apoio e não substitui a avaliação clínica individual.</li>' +
      '</ul>' +
      '<p>Se você é paciente ou familiar, vá para o site do paciente, com materiais em linguagem simples.</p>' +
      '<div class="pa-botoes">' +
      '<button type="button" class="pa-prof">Sou profissional de saúde — continuar</button>' +
      '<a class="pa-btn pa-pac" href="' + areaPaciente + '">Sou paciente — ir para o site do paciente</a>' +
      '</div>' +
      '<p class="pa-nota">A confirmação fica salva só neste navegador por 30 dias.</p>' +
      '</div>';
    document.body.appendChild(o);
    var bProf = o.querySelector('.pa-prof');
    var bPac = o.querySelector('.pa-pac');
    bProf.addEventListener('click', function () {
      gravar();
      root.classList.remove('pa-aviso-pendente');
      if (o.parentNode) o.parentNode.removeChild(o);
      // devolve o foco ao primeiro campo de um eventual cadastro/teste (trial-gate)
      var campo = document.querySelector('.pc-email, .pc-codigo, #pt-nome');
      if (campo && campo.focus) { try { campo.focus(); } catch (e) {} }
    });
    // mantem o foco do teclado dentro do aviso
    o.addEventListener('keydown', function (ev) {
      if (ev.key !== 'Tab') return;
      if (ev.shiftKey && document.activeElement === bProf) { ev.preventDefault(); bPac.focus(); }
      else if (!ev.shiftKey && document.activeElement === bPac) { ev.preventDefault(); bProf.focus(); }
    });
    try { bProf.focus(); } catch (e) {}
    // se outro script tirar o foco (ex.: campo do trial-gate, invisivel), volta ao aviso
    setTimeout(function () { if (document.getElementById('pa-aviso') && !o.contains(document.activeElement)) { try { bProf.focus(); } catch (e) {} } }, 50);
  }
  if (document.body) montar(); else document.addEventListener('DOMContentLoaded', montar);
})();
