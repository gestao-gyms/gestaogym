// ==============================================================
// 1. CONEXÃO SUPABASE CLOUD + CONFIGURAÇÕES E CHAVE MESTRA DE MÓDULOS
// ==============================================================
const SUPABASE_URL = 'https://ayqpflpsmlbiudyozads.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5cXBmbHBzbWxiaXVkeW96YWRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE5OTY1MjEsImV4cCI6MjEwNzU3MjUyMX0.gKksfNwQQWLFpzWyuVFOCPnh2i76c_aac7ooBRY0r88';

if (!window.supabaseApp && window.supabase) {
    try {
        window.supabaseApp = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    } catch (err) {
        console.warn("Operando em modo Local:", err);
    }
}

// ==============================================================
// CHAVE MESTRA DO ARQUITETO (RICARDO):
// Enquanto TRAVAR_MODULOS_FUTUROS = true, os módulos listados abaixo
// aparecem nas configurações como "🔒 EXPANSÃO FUTURA" e ficam travados
// para que ninguém na recepção os ative por engano.
// Para liberar tudo no futuro, basta mudar para false!
// ==============================================================
const TRAVAR_MODULOS_FUTUROS = true;
const IDS_MODULOS_TRAVADOS = ['flag-pdv', 'flag-convenios', 'flag-parq'];

const PADRAO_CONFIG = {
    nomeAcademia: 'TITAN FITNESS CENTER',
    ipCatraca: '192.168.0.129',
    tolerancia: 3,
    lotacaoMax: { 'Musculação': 25, 'Aulões': 20, 'Pilates': 5 },
    precos: { 'Mensal': 119.90, 'Trimestral': 99.90, 'Anual Black': 89.90, 'Diária Visitante': 25.00 },
    flags: {
        voz: true,
        pdv: false,
        convenios: false,
        upsell: true,
        pilates: true,
        exportWhats: true,
        parq: false,
        avatarVip: true,
        autoPitch: false
    }
};

let CONFIG_HW = Object.assign({}, PADRAO_CONFIG, JSON.parse(localStorage.getItem('titanConfigHW') || '{}'));
CONFIG_HW.flags = Object.assign({}, PADRAO_CONFIG.flags, CONFIG_HW.flags || {});
CONFIG_HW.lotacaoMax = Object.assign({}, PADRAO_CONFIG.lotacaoMax, CONFIG_HW.lotacaoMax || {});

if (TRAVAR_MODULOS_FUTUROS) {
    CONFIG_HW.flags.pdv = false;
    CONFIG_HW.flags.convenios = false;
    CONFIG_HW.flags.parq = false;
}

function gerarDataOffset(dias) {
    const d = new Date();
    d.setDate(d.getDate() + dias);
    return d.toISOString().split('T')[0];
}

const mesAtualStr = String(new Date().getMonth() + 1).padStart(2, '0');
const ALUNOS_PADRAO = [
    {
        id: 101, nome: "LUCAS MENDES SILVA", cpf: "084.512.395-01", whatsapp: "(71) 99812-4410",
        nascimento: `1999-${mesAtualStr}-24`, espaco: "Musculação",
        plano: "Anual Black", valor_mensalidade: 89.90, vencimento: gerarDataOffset(20),
        objetivo: "Hipertrofia", treinos_mes: 18, nota_rapida: "Chave Armário #04 • Foco Peito/Ombro",
        dias_semana: [true, true, false, true, true, false],
        foto_base64: "", bloqueado_manual: false,
        treino_json: [
            { divisao: "Treino A - Peito, Ombro e Tríceps", exercicio: "Supino Inclinado com Halteres", series: "4x 8-10", carga: "32kg", descanso: "90s" },
            { divisao: "Treino A - Peito, Ombro e Tríceps", exercicio: "Tríceps Corda na Polia Alta", series: "4x 12", carga: "45kg", descanso: "60s" },
            { divisao: "Treino C - Inferiores Completo", exercicio: "Agachamento Livre com Elevação de Calcanhar", series: "4x 8", carga: "80kg", descanso: "120s" }
        ]
    },
    {
        id: 102, nome: "MARIANA COSTA SANTOS", cpf: "059.310.885-22", whatsapp: "(71) 98741-9021",
        nascimento: "2001-06-15", espaco: "Aulões",
        plano: "Trimestral", valor_mensalidade: 99.90, vencimento: gerarDataOffset(3),
        objetivo: "Emagrecimento", treinos_mes: 14, nota_rapida: "Gosta de treinar às 18h",
        dias_semana: [true, false, true, true, true, false],
        foto_base64: "", bloqueado_manual: false,
        treino_json: [
            { divisao: "Treino D - Posterior e Glúteo", exercicio: "Elevação Pélvica (Hip Thrust)", series: "4x 12", carga: "70kg", descanso: "90s" },
            { divisao: "Treino D - Posterior e Glúteo", exercicio: "Cadeira Abdutora", series: "4x 15", carga: "55kg", descanso: "60s" }
        ]
    },
    {
        id: 103, nome: "CARLOS EDUARDO ROCHA", cpf: "031.994.105-77", whatsapp: "(71) 99102-3388",
        nascimento: "1995-02-10", espaco: "Musculação",
        plano: "Mensal", valor_mensalidade: 119.90, vencimento: gerarDataOffset(-8),
        objetivo: "Força / Performance", treinos_mes: 2, nota_rapida: "Oferecer renovação sem juros no PIX",
        dias_semana: [false, true, false, false, false, false],
        foto_base64: "", bloqueado_manual: false,
        treino_json: []
    },
    {
        id: 104, nome: "FERNANDA OLIVEIRA LIMA", cpf: "092.441.205-19", whatsapp: "(71) 98211-5500",
        nascimento: `2003-${mesAtualStr}-12`, espaco: "Pilates",
        plano: "Anual Black", valor_mensalidade: 89.90, vencimento: gerarDataOffset(25),
        objetivo: "Condicionamento", treinos_mes: 16, nota_rapida: "Aluna VIP Studio Pilates",
        dias_semana: [true, true, true, true, false, true],
        foto_base64: "", bloqueado_manual: false,
        treino_json: []
    }
];

let ALUNOS = (JSON.parse(localStorage.getItem('titanAlunos')) || ALUNOS_PADRAO).map(a => ({
    ...a,
    espaco: a.espaco || 'Musculação',
    nascimento: a.nascimento || `2000-${mesAtualStr}-24`,
    treinos_mes: a.treinos_mes || 14,
    nota_rapida: a.nota_rapida || '',
    dias_semana: Array.isArray(a.dias_semana) ? a.dias_semana : [true, true, false, true, true, false],
    treino_json: a.treino_json || []
}));

let GIROS_CATRACA = JSON.parse(localStorage.getItem('titanGiros')) || [
    { id: 1, aluno_id: 101, aluno_nome: "LUCAS MENDES SILVA", espaco: "Musculação", plano: "Anual Black", status_acesso: "LIBERADO", motivo: "Biometria iDFace", hora: "18:40" },
    { id: 2, aluno_id: 103, aluno_nome: "CARLOS EDUARDO ROCHA", espaco: "Musculação", plano: "Mensal", status_acesso: "BLOQUEADO", motivo: "Acesso Retido", hora: "18:12" },
    { id: 3, aluno_id: 102, aluno_nome: "MARIANA COSTA SANTOS", espaco: "Aulões", plano: "Trimestral", status_acesso: "LIBERADO", motivo: "Biometria iDFace", hora: "17:55" },
    { id: 4, aluno_id: 104, aluno_nome: "FERNANDA OLIVEIRA LIMA", espaco: "Pilates", plano: "Anual Black", status_acesso: "LIBERADO", motivo: "Biometria iDFace", hora: "17:30" }
];

let CAIXA = JSON.parse(localStorage.getItem('titanCaixa')) || [
    { id: 1, descricao: "Renovação Anual Black - Lucas Mendes [PIX]", valor: 89.90, tipo: "receita", metodo: "PIX", data: "Hoje" },
    { id: 2, descricao: "Renovação Trimestral - Mariana Costa [CARTÃO]", valor: 99.90, tipo: "receita", metodo: "CARTÃO", data: "Hoje" },
    { id: 3, descricao: "Manutenção Preventiva Polias", valor: -120.00, tipo: "despesa", metodo: "CAIXA", data: "Ontem" }
];

let alunoNoVisorAtual = ALUNOS[0];
let catracaPausadaGeral = false;
let fotoCadastroBase64 = "";
let webcamStream = null;
let chartCeo = null;
let ceoDesbloqueado = false;
let timerAutoPitch = null;

function salvarLocal() {
    localStorage.setItem('titanConfigHW', JSON.stringify(CONFIG_HW));
    localStorage.setItem('titanAlunos', JSON.stringify(ALUNOS));
    localStorage.setItem('titanGiros', JSON.stringify(GIROS_CATRACA));
    localStorage.setItem('titanCaixa', JSON.stringify(CAIXA));
}

// ==============================================================
// 2. SINTETIZADOR DE VOZ NEURAL EDUCADO
// ==============================================================
function falarRecepcao(texto) {
    if (!CONFIG_HW.flags.voz || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(texto);
    u.lang = 'pt-BR';
    u.rate = 1.07;
    window.speechSynthesis.speak(u);
}

// ==============================================================
// 3. INICIALIZAÇÃO E NAVEGAÇÃO SPA (ZERO ERROS DE NULL)
// ==============================================================
function inicializarSistema() {
    const sessao = JSON.parse(localStorage.getItem('titanSessao'));
    const telaLogin = document.getElementById('tela-login');
    const appMain = document.getElementById('app-main');

    if (!sessao) {
        if (telaLogin) telaLogin.style.display = 'flex';
        if (appMain) appMain.style.display = 'none';
    } else {
        if (telaLogin) telaLogin.style.display = 'none';
        if (appMain) appMain.style.display = 'flex';
        const elNome = document.getElementById('ui-nome');
        if (elNome) elNome.innerText = sessao.nome || "Ricardo Lima";

        if (sessao.avatar && sessao.avatar.length > 10) {
            const av = document.getElementById('ui-avatar');
            if (av) {
                av.innerText = "";
                av.style.backgroundImage = `url('${sessao.avatar}')`;
            }
        }
        configurarInteracaoDiasSemana();
        carregarInputsConfiguracoes();
        aplicarFlagsModulos(false);
        atualizarTelaRecepcao();
    }
}

async function fazerLogin() {
    const u = document.getElementById('login-user').value.trim().toLowerCase();
    const p = document.getElementById('login-senha').value.trim();
    const err = document.getElementById('login-erro');

    if (!u || !p) {
        if (err) { err.innerText = "Preencha operador e senha!"; err.style.display = 'block'; }
        return;
    }

    let conta = { usuario: u, nome: "Ricardo Lima", role: "RECEPÇÃO & CEO", avatar: "RL" };
    localStorage.setItem('titanSessao', JSON.stringify(conta));
    inicializarSistema();
    mostrarToast("Cockpit TITAN GYM OS Inicializado!", "success");
}

function fazerLogout() {
    localStorage.removeItem('titanSessao');
    location.reload();
}

function processarNovaFotoPerfil(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
        const b64 = e.target.result;
        const av = document.getElementById('ui-avatar');
        if (av) { av.innerText = ""; av.style.backgroundImage = `url('${b64}')`; }
        let sessao = JSON.parse(localStorage.getItem('titanSessao')) || {};
        sessao.avatar = b64;
        localStorage.setItem('titanSessao', JSON.stringify(sessao));
        mostrarToast("Foto do operador atualizada!", "success");
    };
    reader.readAsDataURL(file);
}

function navegarPara(tela) {
    document.querySelectorAll('.spa-view').forEach(v => v.classList.remove('active-view'));
    document.querySelectorAll('.sidebar .menu-item').forEach(m => m.classList.remove('active'));

    document.getElementById(`view-${tela}`)?.classList.add('active-view');
    document.getElementById(`nav-${tela}`)?.classList.add('active');

    if (tela === 'recepcao') atualizarTelaRecepcao();
    if (tela === 'alunos') renderizarTabelaAlunos();
    if (tela === 'treinos') inicializarTelaTreinos();
    if (tela === 'ceo') renderizarTelaCEO();
    if (tela === 'hardware') carregarInputsConfiguracoes();
}

function solicitarAcessoCEO() {
    if (ceoDesbloqueado) {
        navegarPara('ceo');
    } else {
        document.getElementById('input-pin-ceo').value = '';
        document.getElementById('modal-pin-ceo').classList.add('active');
    }
}

function validarPinCEO() {
    const pin = document.getElementById('input-pin-ceo').value;
    if (pin === '1234') {
        ceoDesbloqueado = true;
        fecharTodosModais();
        navegarPara('ceo');
        mostrarToast("Painel Executivo e Forecast 30d Desbloqueados!", "success");
    } else {
        mostrarToast("PIN incorreto! Padrão: 1234", "error");
    }
}

// ==============================================================
// 4. LOTAÇÃO REAL DOS ESPAÇOS E CONTROLE DE PAUSA DA CATRACA
// ==============================================================
function alternarPausaCatracaGeral() {
    catracaPausadaGeral = !catracaPausadaGeral;
    const banner = document.getElementById('banner-catraca-pausada');
    const btn = document.getElementById('btn-topo-pausar-catraca');
    const txtTopo = document.getElementById('txt-status-catraca-topo');
    const dotTopo = document.getElementById('dot-status-catraca');

    if (catracaPausadaGeral) {
        if (banner) banner.style.display = 'flex';
        if (btn) {
            btn.classList.add('catraca-travada');
            btn.innerHTML = `<span class="material-icons-round">lock_open</span> DESTRAVAR CATRACA`;
        }
        if (txtTopo) txtTopo.innerText = "CATRACA TRAVADA PELA RECEPÇÃO • ACESSO SUSPENSO";
        if (dotTopo) dotTopo.style.background = "var(--neon-red)";
        mostrarToast("Catraca travada temporariamente pela recepção.", "warning");
    } else {
        if (banner) banner.style.display = 'none';
        if (btn) {
            btn.classList.remove('catraca-travada');
            btn.innerHTML = `<span class="material-icons-round">lock</span> PAUSAR CATRACA`;
        }
        if (txtTopo) txtTopo.innerText = "CATRACA CONTROL iD OPERACIONAL • FLUXO LIVRE";
        if (dotTopo) dotTopo.style.background = "var(--neon-volt)";
        mostrarToast("Catraca destravada! Fluxo normalizado.", "success");
    }
}

function atualizarLotacaoEspacos() {
    let contMusc = 0, contAuloes = 0, contPilates = 0;

    GIROS_CATRACA.slice(0, 35).forEach(g => {
        if (g.status_acesso === 'LIBERADO') {
            const esp = g.espaco || 'Musculação';
            if (esp === 'Aulões') contAuloes++;
            else if (esp === 'Pilates') contPilates++;
            else contMusc++;
        }
    });

    const maxM = CONFIG_HW.lotacaoMax['Musculação'] || 25;
    const maxA = CONFIG_HW.lotacaoMax['Aulões'] || 20;
    const maxP = CONFIG_HW.lotacaoMax['Pilates'] || 5;

    const pctM = Math.min(100, Math.round((contMusc / maxM) * 100));
    const pctA = Math.min(100, Math.round((contAuloes / maxA) * 100));
    const pctP = Math.min(100, Math.round((contPilates / maxP) * 100));

    const elTxtM = document.getElementById('txt-lot-musculacao');
    const elBarM = document.getElementById('bar-lot-musculacao');
    if (elTxtM) elTxtM.innerText = `${contMusc} / ${maxM}`;
    if (elBarM) elBarM.style.width = `${pctM}%`;

    const elTxtA = document.getElementById('txt-lot-auloes');
    const elBarA = document.getElementById('bar-lot-auloes');
    if (elTxtA) elTxtA.innerText = `${contAuloes} / ${maxA}`;
    if (elBarA) elBarA.style.width = `${pctA}%`;

    const elTxtP = document.getElementById('txt-lot-pilates');
    const elBarP = document.getElementById('bar-lot-pilates');
    if (elTxtP) elTxtP.innerText = `${contPilates} / ${maxP}`;
    if (elBarP) elBarP.style.width = `${pctP}%`;

    const statusGeral = document.getElementById('lotacao-status-geral');
    if (statusGeral) {
        if (pctM >= 90 || pctA >= 90) {
            statusGeral.innerText = "● PICO ALTO";
            statusGeral.style.color = "var(--neon-yellow)";
        } else {
            statusGeral.innerText = "● CONFORTÁVEL";
            statusGeral.style.color = "var(--neon-volt)";
        }
    }
}

// ==============================================================
// 5. VISOR PÓS-CATRACA, ANOTAÇÕES FUNCIONANDO E FREQUÊNCIA SEMANAL
// ==============================================================
function calcularStatusMatricula(aluno) {
    if (aluno.bloqueado_manual) return { status: 'vencido', dias: -99, texto: 'Pausado Manual' };
    const hoje = new Date(); hoje.setHours(0,0,0,0);
    const venc = new Date(aluno.vencimento + "T00:00:00");
    const diff = Math.ceil((venc.getTime() - hoje.getTime()) / (1000 * 3600 * 24));

    if (diff < -CONFIG_HW.tolerancia) return { status: 'vencido', dias: diff, texto: `Vencido (${Math.abs(diff)}d)` };
    if (diff <= 5) return { status: 'alerta', dias: diff, texto: diff >= 0 ? `Vence em ${diff}d` : `Tolerância (${Math.abs(diff)}d)` };
    return { status: 'ativo', dias: diff, texto: `Liberado (+${diff}d)` };
}

function isAniversarianteDoMes(dataNascStr) {
    if (!dataNascStr || !dataNascStr.includes('-')) return false;
    const mesNasc = parseInt(dataNascStr.split('-')[1], 10);
    const mesHoje = new Date().getMonth() + 1;
    return mesNasc === mesHoje;
}

function atualizarTelaRecepcao() {
    salvarLocal();
    const badgeTotal = document.getElementById('badge-total-alunos');
    if (badgeTotal) badgeTotal.innerText = ALUNOS.length;

    const sel = document.getElementById('select-simular-aluno');
    if (sel) {
        const valorAtual = sel.value;
        sel.innerHTML = '';
        ALUNOS.forEach(a => {
            const info = calcularStatusMatricula(a);
            const esp = a.espaco || 'Musculação';
            sel.innerHTML += `<option value="${a.id}">${a.nome} • [${esp}] (${info.status === 'vencido' ? '🚫 RETIDO' : '✅ ATIVO'})</option>`;
        });
        if (valorAtual && ALUNOS.some(x => x.id == valorAtual)) sel.value = valorAtual;
    }

    if (!alunoNoVisorAtual && ALUNOS.length > 0) alunoNoVisorAtual = ALUNOS[0];
    if (alunoNoVisorAtual) exibirAlunoNoVisorSpotlight(alunoNoVisorAtual, false);

    renderizarFeedGirosRecepcao();
    atualizarLotacaoEspacos();
}

function exibirAlunoNoVisorSpotlight(aluno, registrarGiro = true) {
    if (!aluno) return;
    if (registrarGiro && catracaPausadaGeral) {
        return mostrarToast("A catraca está PAUSADA! Clique em 'Destravar Catraca' no topo.", "error");
    }

    alunoNoVisorAtual = aluno;
    const info = calcularStatusMatricula(aluno);
    const liberado = info.status !== 'vencido';
    const horaAtual = new Date().toTimeString().substring(0, 5);
    const espacoAluno = aluno.espaco || 'Musculação';

    if (registrarGiro && liberado) {
        aluno.treinos_mes = (parseInt(aluno.treinos_mes) || 12) + 1;
        // Marca presença automática no dia da semana atual
        const diaHojeIdx = new Date().getDay() - 1; // 0 = Seg ... 5 = Sáb
        if (diaHojeIdx >= 0 && diaHojeIdx <= 5) {
            if (!Array.isArray(aluno.dias_semana)) aluno.dias_semana = [true, true, false, true, true, false];
            aluno.dias_semana[diaHojeIdx] = true;
        }
    }

    const card = document.getElementById('spotlight-card');
    const banner = document.getElementById('spotlight-status-banner');
    const icon = document.getElementById('spotlight-status-icon');
    const txt = document.getElementById('spotlight-status-text');
    const avatar = document.getElementById('spotlight-avatar');

    if (card) card.className = `glass-card spotlight-card ${liberado ? 'status-liberado' : 'status-bloqueado'}`;
    if (banner) banner.className = `status-banner ${liberado ? 'banner-liberado' : 'banner-bloqueado'}`;
    if (icon) icon.innerText = liberado ? 'verified' : 'front_hand';
    if (txt) txt.innerText = liberado ? 'PASSAGEM LIBERADA NA CATRACA • BOM TREINO!' : 'ACESSO RETIDO • ATENDER NA RECEPÇÃO';

    const elZona = document.getElementById('spotlight-zona-tag');
    if (elZona) elZona.innerText = `ESPAÇO: ${espacoAluno.toUpperCase()}`;

    const bdayBadge = document.getElementById('badge-aniversariante');
    if (bdayBadge) bdayBadge.style.display = isAniversarianteDoMes(aluno.nascimento) ? 'inline-block' : 'none';

    if (avatar) {
        avatar.style.borderColor = liberado ? 'var(--neon-volt)' : 'var(--neon-red)';
        if (aluno.foto_base64) {
            avatar.innerHTML = '';
            avatar.style.backgroundImage = `url('${aluno.foto_base64}')`;
        } else {
            avatar.style.backgroundImage = 'none';
            const iconePadrao = CONFIG_HW.flags.avatarVip ? 'fitness_center' : 'person';
            avatar.innerHTML = `<span class="material-icons-round" style="color:${liberado ? 'var(--neon-volt)' : 'var(--neon-red)'}">${liberado ? iconePadrao : 'lock'}</span>`;
        }
    }

    const qtdTreinos = aluno.treinos_mes || 14;
    const elStreak = document.getElementById('spotlight-streak-badge');
    if (elStreak) elStreak.innerText = `🔥 ${qtdTreinos} TREINOS`;

    const elHora = document.getElementById('spotlight-hora');
    if (elHora) elHora.innerText = `PASSAGEM ÀS ${horaAtual}`;

    const elNome = document.getElementById('spotlight-nome');
    if (elNome) elNome.innerText = aluno.nome;

    // Exibe Plano, Modalidade, Foco de Treino e Nota Ativa (Sem expor CPF!)
    const elSub = document.getElementById('spotlight-sub');
    if (elSub) {
        const notaBadge = aluno.nota_rapida
            ? `<span style="background:rgba(255,184,0,0.18); border:1px solid var(--neon-yellow); color:var(--neon-yellow); padding:2px 8px; border-radius:6px; font-weight:800; font-size:10px;">📌 ${aluno.nota_rapida}</span>`
            : `<span style="color:var(--neon-cyan); font-weight:700;">🎯 Foco: ${aluno.objetivo || 'Hipertrofia'}</span>`;
        elSub.innerHTML = `<span>Plano <strong>${aluno.plano}</strong> &bull; Modalidade: <strong>${espacoAluno}</strong> &bull; ID #${aluno.id}</span> ${notaBadge}`;
    }

    const elVenc = document.getElementById('spotlight-vencimento');
    if (elVenc) elVenc.innerText = aluno.vencimento.split('-').reverse().join('/');
    
    const elDias = document.getElementById('spotlight-dias');
    if (elDias) {
        elDias.innerText = info.texto;
        elDias.className = `spot-value ${liberado ? 'text-volt' : 'text-red'}`;
    }

    const elDesistencia = document.getElementById('spotlight-desistencia');
    if (elDesistencia) {
        if (!liberado || qtdTreinos < 4) {
            elDesistencia.innerText = "Alto (Pouca frequência)";
            elDesistencia.className = "spot-value text-red";
        } else if (qtdTreinos < 10) {
            elDesistencia.innerText = "Moderado (Acompanhar)";
            elDesistencia.className = "spot-value text-yellow";
        } else {
            elDesistencia.innerText = "Baixo (Assíduo)";
            elDesistencia.className = "spot-value text-cyan";
        }
    }

    // Atualiza as cápsulas de Presença na Semana (SEG a SÁB)
    renderizarPillsSemanaVisor(aluno);

    // Preenche o campo de Observação Rápida de Recepção com a nota salva do atleta
    const inputNota = document.getElementById('visor-nota-rapida');
    if (inputNota) inputNota.value = aluno.nota_rapida || '';

    // Atualiza texto de Upsell
    const elUpsell = document.getElementById('hud-upsell-msg');
    if (elUpsell) {
        elUpsell.innerText = aluno.plano === 'Mensal' ? "UPGRADE ANUAL BLACK (-R$30/MÊS)" : `ATLETA ${aluno.plano.toUpperCase()} VIP`;
    }

    if (registrarGiro) {
        const novoGiro = {
            id: Date.now(),
            aluno_id: aluno.id,
            aluno_nome: aluno.nome,
            espaco: espacoAluno,
            plano: aluno.plano,
            status_acesso: liberado ? 'LIBERADO' : 'BLOQUEADO',
            motivo: liberado ? `Entrada ${espacoAluno}` : 'Verificar Recepção',
            hora: horaAtual
        };
        GIROS_CATRACA.unshift(novoGiro);

        const primeiroNome = aluno.nome.split(' ')[0];
        if (liberado) {
            falarRecepcao(`Bem-vindo, ${primeiroNome}! Bom treino!`);
        } else {
            falarRecepcao(`Olá ${primeiroNome}, por favor fale com a nossa recepção.`);
        }

        salvarLocal();
        renderizarFeedGirosRecepcao();
        atualizarLotacaoEspacos();
        mostrarToast(liberado ? `Passagem Liberada: ${aluno.nome} (${espacoAluno})` : `Retido na Catraca: ${aluno.nome}`, liberado ? 'success' : 'warning');
    }
}

function renderizarPillsSemanaVisor(aluno) {
    const container = document.getElementById('visor-semana-pills');
    if (!container) return;
    const dias = Array.isArray(aluno.dias_semana) ? aluno.dias_semana : [true, true, false, true, true, false];
    const pills = container.querySelectorAll('.day-pill');
    pills.forEach((pill, idx) => {
        if (dias[idx]) pill.classList.add('active');
        else pill.classList.remove('active');
    });
}

function configurarInteracaoDiasSemana() {
    const container = document.getElementById('visor-semana-pills');
    if (!container) return;
    const pills = container.querySelectorAll('.day-pill');
    pills.forEach((pill, idx) => {
        pill.onclick = () => {
            if (!alunoNoVisorAtual) return;
            if (!Array.isArray(alunoNoVisorAtual.dias_semana)) {
                alunoNoVisorAtual.dias_semana = [true, true, false, true, true, false];
            }
            alunoNoVisorAtual.dias_semana[idx] = !alunoNoVisorAtual.dias_semana[idx];
            renderizarPillsSemanaVisor(alunoNoVisorAtual);
            salvarLocal();
        };
    });
}

function salvarNotaRapidaVisor() {
    if (!alunoNoVisorAtual) return;
    const input = document.getElementById('visor-nota-rapida');
    if (!input) return;
    alunoNoVisorAtual.nota_rapida = input.value.trim();
    salvarLocal();
    exibirAlunoNoVisorSpotlight(alunoNoVisorAtual, false);
    mostrarToast(alunoNoVisorAtual.nota_rapida ? `Anotação fixada no perfil de ${alunoNoVisorAtual.nome}!` : "Anotação removida do perfil.", "success");
}

function editarAlunoDoVisor() {
    if (!alunoNoVisorAtual) return;
    abrirModalCadastroAluno(alunoNoVisorAtual.id);
}

function simularBipCatraca(modo) {
    if (ALUNOS.length === 0) return;
    let escolhido = ALUNOS[0];
    if (modo === 'selecionado') {
        const id = document.getElementById('select-simular-aluno')?.value;
        escolhido = ALUNOS.find(a => a.id == id) || ALUNOS[0];
    } else {
        escolhido = ALUNOS[Math.floor(Math.random() * ALUNOS.length)];
    }
    exibirAlunoNoVisorSpotlight(escolhido, true);
}

function renderizarFeedGirosRecepcao() {
    const lista = document.getElementById('lista-giros-recepcao');
    if (!lista) return;
    lista.innerHTML = '';

    let lib = 0, bloq = 0;
    GIROS_CATRACA.forEach(g => {
        if (g.status_acesso === 'LIBERADO') lib++; else bloq++;
    });

    const elLib = document.getElementById('count-liberados-hoje');
    const elBloq = document.getElementById('count-bloqueados-hoje');
    if (elLib) elLib.innerText = `${lib} Entraram`;
    if (elBloq) elBloq.innerText = `${bloq} Retidos`;

    GIROS_CATRACA.slice(0, 15).forEach(g => {
        const ok = g.status_acesso === 'LIBERADO';
        const cor = ok ? 'var(--neon-volt)' : 'var(--neon-red)';
        const esp = g.espaco || 'Musculação';
        lista.innerHTML += `
            <div onclick="selecionarAlunoPeloGiro(${g.aluno_id})" style="cursor:pointer; display:flex; justify-content:space-between; align-items:center; padding:10px 14px; background:rgba(7,11,20,0.65); border:1px solid rgba(255,255,255,0.06); border-left:3px solid ${cor}; border-radius:10px;" class="glow-hover">
                <div>
                    <strong style="font-size:12px; color:white; display:block;">${g.aluno_nome}</strong>
                    <span style="font-size:10px; color:var(--text-muted);">${esp} &bull; ${g.plano}</span>
                </div>
                <div style="text-align:right;">
                    <span style="font-size:9px; font-weight:900; color:${cor}; display:block;">${g.status_acesso}</span>
                    <span style="font-size:10px; color:var(--text-muted); font-family:monospace;">${g.hora}</span>
                </div>
            </div>
        `;
    });
}

function selecionarAlunoPeloGiro(id) {
    const a = ALUNOS.find(x => x.id == id);
    if (a) exibirAlunoNoVisorSpotlight(a, false);
}

function buscarAlunoRapidoBalcao(termo) {
    const drop = document.getElementById('dropdown-busca-balcao');
    if (!drop) return;
    const t = termo.trim().toLowerCase();
    if (!t) { drop.style.display = 'none'; return; }

    const achados = ALUNOS.filter(a => a.nome.toLowerCase().includes(t) || String(a.id).includes(t));
    drop.innerHTML = '';
    if (achados.length === 0) {
        drop.innerHTML = `<div style="padding:12px; font-size:11px; color:var(--text-muted);">Nenhum atleta encontrado.</div>`;
    } else {
        achados.forEach(a => {
            drop.innerHTML += `
                <div onclick="selecionarBuscaBalcao(${a.id})" style="padding:10px 14px; border-bottom:1px solid rgba(255,255,255,0.06); cursor:pointer; display:flex; justify-content:space-between;">
                    <strong style="font-size:12px; color:white;">${a.nome}</strong>
                    <span style="font-size:11px; color:var(--neon-cyan);">${a.espaco || 'Musculação'} &bull; ${a.plano}</span>
                </div>
            `;
        });
    }
    drop.style.display = 'flex';
}

function selecionarBuscaBalcao(id) {
    document.getElementById('dropdown-busca-balcao').style.display = 'none';
    document.getElementById('input-busca-rapida-balcao').value = '';
    const a = ALUNOS.find(x => x.id == id);
    if (a) exibirAlunoNoVisorSpotlight(a, false);
}

// ==============================================================
// 6. CHECK-IN POR TECLADO NUMÉRICO (PIN / CPF)
// ==============================================================
function abrirModalKeypad() {
    document.getElementById('keypad-display').value = '';
    document.getElementById('modal-keypad').classList.add('active');
}

function digitarKeypad(num) {
    const el = document.getElementById('keypad-display');
    if (el.value.length < 6) el.value += num;
}

function limparKeypad() {
    document.getElementById('keypad-display').value = '';
}

function confirmarCheckinKeypad() {
    const cod = document.getElementById('keypad-display').value.trim();
    if (!cod) return;

    const aluno = ALUNOS.find(a => String(a.id) === cod || (a.cpf || '').replace(/\D/g, '').startsWith(cod));
    if (!aluno) {
        return mostrarToast("Código não encontrado! Tente 101, 102 ou os primeiros dígitos do CPF.", "warning");
    }

    fecharTodosModais();
    exibirAlunoNoVisorSpotlight(aluno, true);
}

// ==============================================================
// 7. FÉRIAS, WHATSAPP, CONVÊNIOS E PDV EXPRESS
// ==============================================================
function abrirModalFerias() {
    if (!alunoNoVisorAtual) return;
    document.getElementById('ferias-nome-aluno').innerText = alunoNoVisorAtual.nome;
    document.getElementById('input-dias-ferias').value = 7;
    document.getElementById('modal-ferias').classList.add('active');
}

function confirmarCongelamentoFerias() {
    if (!alunoNoVisorAtual) return;
    const dias = parseInt(document.getElementById('input-dias-ferias').value) || 7;
    const atual = new Date(alunoNoVisorAtual.vencimento + "T00:00:00");
    atual.setDate(atual.getDate() + dias);
    alunoNoVisorAtual.vencimento = atual.toISOString().split('T')[0];

    salvarLocal();
    fecharTodosModais();
    exibirAlunoNoVisorSpotlight(alunoNoVisorAtual, false);
    mostrarToast(`+${dias} dias de férias adicionados ao plano de ${alunoNoVisorAtual.nome}!`, "success");
}

function dispararWhatsAppAluno() {
    if (!alunoNoVisorAtual) return;
    const a = alunoNoVisorAtual;
    const info = calcularStatusMatricula(a);
    const numLimpo = (a.whatsapp || '').replace(/\D/g, '');
    const fone = numLimpo.length >= 10 ? `55${numLimpo}` : '5571986030162';

    const msg = info.status === 'vencido'
        ? `Olá *${a.nome}*! Aqui é da *${CONFIG_HW.nomeAcademia}*. Notamos que seu plano (${a.plano}) venceu em ${a.vencimento.split('-').reverse().join('/')}. Deseja renovar via PIX agora para já liberar sua passagem na catraca? 💪`
        : `Olá *${a.nome}*! Parabéns pelos *${a.treinos_mes || 14} treinos* realizados no mês aqui na *${CONFIG_HW.nomeAcademia}*! Seu plano *${a.plano}* está ativo até ${a.vencimento.split('-').reverse().join('/')}. Bom treino! 🔥`;

    window.open(`https://wa.me/${fone}?text=${encodeURIComponent(msg)}`, '_blank');
}

function registrarCheckinConvenio() {
    const nome = alunoNoVisorAtual ? alunoNoVisorAtual.nome : "ATLETA CONVÊNIO";
    const hora = new Date().toTimeString().substring(0, 5);
    GIROS_CATRACA.unshift({
        id: Date.now(), aluno_id: alunoNoVisorAtual?.id || 0,
        aluno_nome: `${nome} (WELLHUB / TOTALPASS)`, espaco: "Musculação",
        plano: "Convênio Corporativo", status_acesso: "LIBERADO", motivo: "Token Validado", hora
    });
    CAIXA.unshift({ id: Date.now(), descricao: `Repasse Convênio Wellhub/TotalPass - ${nome}`, valor: 18.00, tipo: 'receita', metodo: 'CONVÊNIO', data: 'Hoje' });
    salvarLocal();
    renderizarFeedGirosRecepcao();
    atualizarLotacaoEspacos();
    mostrarToast(`Check-in de Convênio validado para ${nome}!`, "success");
}

function vendaRapidaBalcao(item, valor) {
    const nome = alunoNoVisorAtual ? alunoNoVisorAtual.nome : "BALCÃO";
    CAIXA.unshift({ id: Date.now(), descricao: `PDV Express: ${item} (${nome})`, valor, tipo: 'receita', metodo: 'PIX', data: 'Hoje' });
    salvarLocal();
    mostrarToast(`Venda lançada no Caixa: ${item} (R$ ${valor.toFixed(2)})`, "success");
}

function acionarGiroManualCatraca() {
    const hora = new Date().toTimeString().substring(0, 5);
    GIROS_CATRACA.unshift({
        id: Date.now(), aluno_id: alunoNoVisorAtual?.id || 0,
        aluno_nome: "ENTRADA LIBERADA PELO BALCÃO",
        espaco: "Musculação", plano: "Acesso Recepção", status_acesso: "LIBERADO", motivo: "Giro Manual", hora
    });
    renderizarFeedGirosRecepcao();
    atualizarLotacaoEspacos();
    mostrarToast("Catraca destravada! Giro manual contabilizado.", "success");
}

// ==============================================================
// 8. RENOVAÇÃO, PIX QR CODE E CUPOM TÉRMICO 80mm
// ==============================================================
function abrirModalRenovacaoRapida(idOpcional = null) {
    const a = idOpcional ? ALUNOS.find(x => x.id == idOpcional) : alunoNoVisorAtual;
    if (!a) return;
    alunoNoVisorAtual = a;

    document.getElementById('checkout-tipo-operacao').value = 'renovacao';
    document.getElementById('checkout-aluno-id').value = a.id;
    document.getElementById('box-nome-visitante').style.display = 'none';
    document.getElementById('box-resumo-aluno-checkout').style.display = 'flex';
    document.getElementById('checkout-aluno-nome').innerText = a.nome;
    document.getElementById('checkout-aluno-status').innerText = `${a.espaco || 'Musculação'} • ${a.plano}`;
    document.getElementById('checkout-plano').value = a.plano;
    atualizarValorCheckout();
    alternarExibicaoPixQR(true);

    document.getElementById('modal-renovacao').classList.add('active');
}

function abrirModalVisitante() {
    document.getElementById('checkout-tipo-operacao').value = 'visitante';
    document.getElementById('box-nome-visitante').style.display = 'block';
    document.getElementById('box-resumo-aluno-checkout').style.display = 'none';
    document.getElementById('checkout-visitante-nome').value = '';
    document.getElementById('checkout-plano').value = 'Diária Visitante';
    atualizarValorCheckout();
    alternarExibicaoPixQR(true);

    document.getElementById('modal-renovacao').classList.add('active');
}

function atualizarValorCheckout() {
    const pl = document.getElementById('checkout-plano').value;
    document.getElementById('checkout-valor').value = (CONFIG_HW.precos[pl] || 119.90).toFixed(2);
}

function alternarExibicaoPixQR(mostrar) {
    const box = document.getElementById('box-qrcode-pix');
    if (box) box.style.display = mostrar ? 'flex' : 'none';
}

function confirmarPagamentoEGerarCupom() {
    const tipoOp = document.getElementById('checkout-tipo-operacao').value;
    const plano = document.getElementById('checkout-plano').value;
    const valor = parseFloat(document.getElementById('checkout-valor').value) || 0;
    const metodo = document.querySelector('input[name="metodo_pagto"]:checked')?.value || 'PIX';
    const hora = new Date().toTimeString().substring(0, 5);

    let nomeCliente = "";
    let novoVencStr = "";
    let espacoUsado = "Musculação";

    if (tipoOp === 'visitante') {
        nomeCliente = (document.getElementById('checkout-visitante-nome').value.trim() || "VISITANTE AVULSO").toUpperCase();
        espacoUsado = document.getElementById('checkout-visitante-espaco').value || "Musculação";
        novoVencStr = gerarDataOffset(1);
        GIROS_CATRACA.unshift({
            id: Date.now(), aluno_id: 0, aluno_nome: nomeCliente, espaco: espacoUsado,
            plano: "Diária Avulsa", status_acesso: "LIBERADO", motivo: `Pago via ${metodo}`, hora
        });
    } else {
        const id = document.getElementById('checkout-aluno-id').value;
        const a = ALUNOS.find(x => x.id == id) || alunoNoVisorAtual;
        nomeCliente = a.nome;
        espacoUsado = a.espaco || "Musculação";
        const diasSoma = plano === 'Trimestral' ? 90 : (plano === 'Anual Black' ? 365 : 30);
        novoVencStr = gerarDataOffset(diasSoma);
        a.plano = plano;
        a.valor_mensalidade = valor;
        a.vencimento = novoVencStr;
        a.bloqueado_manual = false;
        exibirAlunoNoVisorSpotlight(a, true);
    }

    const descCaixa = `${tipoOp === 'visitante' ? 'Diária' : 'Renovação'} (${plano}) - ${nomeCliente} [${metodo}]`;
    CAIXA.unshift({ id: Date.now(), descricao: descCaixa, valor, tipo: 'receita', metodo, data: 'Hoje' });

    salvarLocal();
    fecharTodosModais();
    atualizarLotacaoEspacos();
    exibirCupomTermicoNaTela(nomeCliente, `${plano} (${espacoUsado})`, valor, metodo, novoVencStr);
}

function exibirCupomTermicoNaTela(nome, plano, valor, metodo, vencimento) {
    document.getElementById('cupom-academia-nome').innerText = CONFIG_HW.nomeAcademia;
    document.getElementById('cupom-titulo-doc').innerText = "COMPROVANTE DE PAGAMENTO & ACESSO";
    document.getElementById('cupom-corpo-linhas').innerHTML = `
        <div><strong>ATLETA:</strong> ${nome}</div>
        <div><strong>PLANO/ESPAÇO:</strong> ${plano}</div>
        <div><strong>VALOR PAGO:</strong> ${valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
        <div><strong>MÉTODO:</strong> ${metodo}</div>
        <div><strong>VÁLIDO ATÉ:</strong> ${vencimento.split('-').reverse().join('/')}</div>
    `;
    document.getElementById('cupom-bloco-parq').style.display = CONFIG_HW.flags.parq ? 'block' : 'none';
    document.getElementById('cupom-hash').innerText = `AUT: 0x${Math.random().toString(16).substring(2, 10).toUpperCase()}`;
    document.getElementById('cupom-datahora').innerText = new Date().toLocaleString('pt-BR');
    document.getElementById('modal-cupom-termico').classList.add('active');
}

function testarImpressoraTermica() {
    exibirCupomTermicoNaTela("DEL REY", "Anual Black (Musculação)", 89.90, "PIX", gerarDataOffset(30));
}

// ==============================================================
// 9. CADASTRO E EDIÇÃO DE ALUNOS (CRM COMPLETO)
// ==============================================================
function abrirModalCadastroAluno(idEdicao = null) {
    pararWebcam();
    if (idEdicao) {
        const a = ALUNOS.find(x => x.id == idEdicao);
        if (!a) return;
        document.getElementById('cad-id').value = a.id;
        document.getElementById('cad-nome').value = a.nome;
        document.getElementById('cad-cpf').value = a.cpf || '';
        document.getElementById('cad-whats').value = a.whatsapp || '';
        document.getElementById('cad-nascimento').value = a.nascimento || '2000-10-24';
        document.getElementById('cad-espaco').value = a.espaco || 'Musculação';
        document.getElementById('cad-plano').value = a.plano;
        document.getElementById('cad-valor').value = a.valor_mensalidade;
        document.getElementById('cad-vencimento').value = a.vencimento;
        document.getElementById('cad-objetivo').value = a.objetivo || 'Hipertrofia';
        fotoCadastroBase64 = a.foto_base64 || '';
    } else {
        document.getElementById('cad-id').value = '';
        document.getElementById('cad-nome').value = '';
        document.getElementById('cad-cpf').value = '';
        document.getElementById('cad-whats').value = '';
        document.getElementById('cad-nascimento').value = `2002-${mesAtualStr}-15`;
        document.getElementById('cad-espaco').value = 'Musculação';
        document.getElementById('cad-plano').value = 'Mensal';
        atualizarValorPlanoCadastro();
        document.getElementById('cad-vencimento').value = gerarDataOffset(30);
        fotoCadastroBase64 = '';
    }

    const img = document.getElementById('bio-img-preview');
    const icon = document.getElementById('bio-icon-placeholder');
    if (fotoCadastroBase64) {
        img.src = fotoCadastroBase64; img.style.display = 'block'; icon.style.display = 'none';
    } else {
        img.style.display = 'none'; icon.style.display = 'block';
    }

    document.getElementById('modal-aluno').classList.add('active');
}

function atualizarValorPlanoCadastro() {
    const pl = document.getElementById('cad-plano').value;
    document.getElementById('cad-valor').value = (CONFIG_HW.precos[pl] || 119.90).toFixed(2);
}

async function iniciarWebcamCadastro() {
    const video = document.getElementById('webcam-video');
    try {
        webcamStream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = webcamStream;
        video.style.display = 'block';
        document.getElementById('bio-img-preview').style.display = 'none';
        document.getElementById('bio-icon-placeholder').style.display = 'none';
        document.getElementById('btn-bater-foto').style.display = 'inline-flex';
    } catch (e) {
        mostrarToast("Sem webcam no momento. Clique em 'Escolher Foto do Dispositivo'!", "warning");
    }
}

function capturarFrameWebcam() {
    const video = document.getElementById('webcam-video');
    const canvas = document.createElement('canvas');
    canvas.width = 240; canvas.height = 240;
    canvas.getContext('2d').drawImage(video, 0, 0, 240, 240);
    fotoCadastroBase64 = canvas.toDataURL('image/jpeg', 0.85);
    pararWebcam();
    const img = document.getElementById('bio-img-preview');
    img.src = fotoCadastroBase64;
    img.style.display = 'block';
}

function pararWebcam() {
    if (webcamStream) {
        webcamStream.getTracks().forEach(t => t.stop());
        webcamStream = null;
    }
    const v = document.getElementById('webcam-video');
    if (v) v.style.display = 'none';
    const b = document.getElementById('btn-bater-foto');
    if (b) b.style.display = 'none';
}

function carregarFotoArquivoAluno(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
        fotoCadastroBase64 = e.target.result;
        document.getElementById('bio-img-preview').src = fotoCadastroBase64;
        document.getElementById('bio-img-preview').style.display = 'block';
        document.getElementById('bio-icon-placeholder').style.display = 'none';
    };
    reader.readAsDataURL(file);
}

function salvarAlunoCRM() {
    const id = document.getElementById('cad-id').value;
    const nome = document.getElementById('cad-nome').value.trim().toUpperCase();
    const cpf = document.getElementById('cad-cpf').value.trim();
    const whats = document.getElementById('cad-whats').value.trim();
    const nascimento = document.getElementById('cad-nascimento').value;
    const espaco = document.getElementById('cad-espaco').value;
    const plano = document.getElementById('cad-plano').value;
    const valor = parseFloat(document.getElementById('cad-valor').value) || 119.90;
    const vencimento = document.getElementById('cad-vencimento').value || gerarDataOffset(30);
    const objetivo = document.getElementById('cad-objetivo').value;

    if (!nome) return mostrarToast("Informe o nome do atleta!", "warning");

    if (id) {
        const idx = ALUNOS.findIndex(a => a.id == id);
        if (idx > -1) {
            ALUNOS[idx] = { ...ALUNOS[idx], nome, cpf, whatsapp: whats, nascimento, espaco, plano, valor_mensalidade: valor, vencimento, objetivo, foto_base64: fotoCadastroBase64 || ALUNOS[idx].foto_base64 };
            alunoNoVisorAtual = ALUNOS[idx];
        }
    } else {
        const novo = {
            id: Date.now(), nome, cpf, whatsapp: whats, nascimento, espaco, plano,
            valor_mensalidade: valor, vencimento, objetivo, treinos_mes: 1,
            nota_rapida: '', dias_semana: [true, false, false, false, false, false],
            foto_base64: fotoCadastroBase64, bloqueado_manual: false, treino_json: []
        };
        ALUNOS.unshift(novo);
        alunoNoVisorAtual = novo;
        CAIXA.unshift({ id: Date.now(), descricao: `Matrícula - ${nome} (${plano} / ${espaco})`, valor, tipo: 'receita', metodo: 'PIX', data: 'Hoje' });
    }

    fecharTodosModais();
    atualizarTelaRecepcao();
    renderizarTabelaAlunos();
    mostrarToast("Cadastro do atleta salvo e sincronizado!", "success");
}

function renderizarTabelaAlunos() {
    const grid = document.getElementById('grid-alunos-crm');
    if (!grid) return;
    const texto = (document.getElementById('filtro-texto-alunos')?.value || '').toLowerCase();
    const statusFiltro = document.getElementById('filtro-status-alunos')?.value || 'todos';

    grid.innerHTML = '';
    ALUNOS.filter(a => {
        const st = calcularStatusMatricula(a).status;
        const bday = isAniversarianteDoMes(a.nascimento);
        const bateTxt = a.nome.toLowerCase().includes(texto) || (a.cpf || '').includes(texto) || (a.objetivo || '').toLowerCase().includes(texto);
        const bateSt = statusFiltro === 'todos' || (statusFiltro === 'aniversariantes' ? bday : st === statusFiltro);
        return bateTxt && bateSt;
    }).forEach(a => {
        const info = calcularStatusMatricula(a);
        const cor = info.status === 'vencido' ? 'var(--neon-red)' : (info.status === 'alerta' ? 'var(--neon-yellow)' : 'var(--neon-volt)');
        const bdayTag = isAniversarianteDoMes(a.nascimento) ? `<span class="bday-pill" style="margin-left:8px;">🎂 ANIVERSARIANTE</span>` : '';
        const avatarHtml = a.foto_base64
            ? `<img src="${a.foto_base64}" style="width:46px; height:46px; border-radius:50%; object-fit:cover; border:2px solid ${cor};">`
            : `<div style="width:46px; height:46px; border-radius:50%; border:2px solid ${cor}; background:#0b111e; display:flex; align-items:center; justify-content:center; font-weight:900;">${a.nome.substring(0,2)}</div>`;

        grid.innerHTML += `
            <div class="glass-card glow-hover" style="display:flex; justify-content:space-between; align-items:center; padding:14px 18px;">
                <div style="display:flex; align-items:center; gap:14px;">
                    ${avatarHtml}
                    <div>
                        <strong style="font-size:14px; color:white;">${a.nome}</strong>
                        <span style="font-size:10px; color:${cor}; font-weight:800; margin-left:8px;">● ${info.texto.toUpperCase()}</span>
                        ${bdayTag}
                        <div style="font-size:11px; color:var(--text-muted); margin-top:3px;">
                            Espaço: <strong class="text-cyan">${a.espaco || 'Musculação'}</strong> &bull; Plano ${a.plano} &bull; 🔥 ${a.treinos_mes || 12} treinos/mês &bull; Venc: ${a.vencimento.split('-').reverse().join('/')}
                        </div>
                    </div>
                </div>
                <div style="display:flex; gap:8px;">
                    <button class="btn-volt-sm" onclick="abrirModalRenovacaoRapida(${a.id})"><span class="material-icons-round" style="font-size:14px;">qr_code_2</span> RENOVAR</button>
                    <button class="btn-outline-cyan" style="padding:6px 10px;" onclick="abrirModalCadastroAluno(${a.id})"><span class="material-icons-round" style="font-size:15px;">edit</span></button>
                </div>
            </div>
        `;
    });
}

// ==============================================================
// 10. TELA 3: PRESCRIÇÃO DE TREINO + WHATSAPP / PDF / 80mm
// ==============================================================
function inicializarTelaTreinos() {
    const sel = document.getElementById('select-aluno-treino');
    if (!sel) return;
    sel.innerHTML = '';
    ALUNOS.forEach(a => {
        sel.innerHTML += `<option value="${a.id}">${a.nome} — (${a.espaco || 'Musculação'} • ${a.objetivo})</option>`;
    });
    if (alunoNoVisorAtual) sel.value = alunoNoVisorAtual.id;
    carregarTreinoView();
}

function abrirTreinoDoAlunoAtual() {
    navegarPara('treinos');
}

function carregarTreinoView() {
    const id = document.getElementById('select-aluno-treino')?.value;
    const a = ALUNOS.find(x => x.id == id);
    const cont = document.getElementById('container-exercicios-ficha');
    if (!a || !cont) return;

    document.getElementById('titulo-ficha-ativa').innerText = `Protocolo de ${a.nome}`;
    const lista = a.treino_json || [];
    document.getElementById('badge-qtd-exercicios').innerText = `${lista.length} Exercícios`;

    cont.innerHTML = '';
    if (lista.length === 0) {
        cont.innerHTML = `<p style="padding:30px; text-align:center; font-size:12px; color:var(--text-muted);">Nenhum exercício registado para este atleta. Adicione ao lado!</p>`;
        return;
    }
    lista.forEach((ex, i) => {
        cont.innerHTML += `
            <div style="display:flex; justify-content:space-between; align-items:center; padding:12px; background:rgba(0,0,0,0.4); border:1px solid var(--border-glass); border-radius:10px;">
                <div>
                    <span style="font-size:9px; color:var(--neon-cyan); font-weight:900; display:block;">${ex.divisao}</span>
                    <strong style="font-size:13px; color:white;">${ex.exercicio}</strong>
                    <div style="font-size:11px; color:var(--text-muted); margin-top:2px;">Séries: <strong class="text-volt">${ex.series}</strong> &bull; Carga: ${ex.carga || 'Progressiva'} &bull; Descanso: ${ex.descanso}</div>
                </div>
                <button class="btn-icon-danger" onclick="removerExercicioFicha(${i})"><span class="material-icons-round" style="font-size:16px;">delete</span></button>
            </div>
        `;
    });
}

function adicionarExercicioFicha() {
    const id = document.getElementById('select-aluno-treino').value;
    const a = ALUNOS.find(x => x.id == id);
    if (!a) return;

    const divisao = document.getElementById('treino-divisao').value;
    const exercicio = document.getElementById('treino-exercicio').value.trim();
    const series = document.getElementById('treino-series').value.trim();
    const carga = document.getElementById('treino-carga').value.trim();
    const descanso = document.getElementById('treino-descanso').value.trim();

    if (!exercicio) return mostrarToast("Informe o nome do exercício!", "warning");

    if (!a.treino_json) a.treino_json = [];
    a.treino_json.push({ divisao, exercicio, series, carga, descanso });
    document.getElementById('treino-exercicio').value = '';
    salvarLocal();
    carregarTreinoView();
    mostrarToast("Exercício adicionado na ficha!", "success");
}

function removerExercicioFicha(i) {
    const id = document.getElementById('select-aluno-treino').value;
    const a = ALUNOS.find(x => x.id == id);
    if (!a) return;
    a.treino_json.splice(i, 1);
    salvarLocal();
    carregarTreinoView();
}

function enviarTreinoPorWhatsApp() {
    const id = document.getElementById('select-aluno-treino').value;
    const a = ALUNOS.find(x => x.id == id);
    if (!a || !a.treino_json || a.treino_json.length === 0) return mostrarToast("Adicione exercícios na ficha antes de enviar!", "warning");

    const numLimpo = (a.whatsapp || '').replace(/\D/g, '');
    const fone = numLimpo.length >= 10 ? `55${numLimpo}` : '5571986030162';

    let linhas = `*🏋️ PROTOCOLO OFICIAL - ${CONFIG_HW.nomeAcademia}*\n*Atleta:* ${a.nome}\n*Objetivo:* ${a.objetivo}\n\n`;
    a.treino_json.forEach((e, idx) => {
        linhas += `*${idx + 1}. ${e.exercicio}* (${e.divisao.split('-')[0].trim()})\n   ▸ Séries: ${e.series} | Carga: ${e.carga || 'Livre'} | Desc: ${e.descanso}\n\n`;
    });
    linhas += `🔥 _Bom treino!_`;

    window.open(`https://wa.me/${fone}?text=${encodeURIComponent(linhas)}`, '_blank');
}

function imprimirTreinoTermico80mm() {
    const id = document.getElementById('select-aluno-treino').value;
    const a = ALUNOS.find(x => x.id == id);
    if (!a || !a.treino_json || a.treino_json.length === 0) return mostrarToast("Ficha vazia!", "warning");

    document.getElementById('cupom-academia-nome').innerText = CONFIG_HW.nomeAcademia;
    document.getElementById('cupom-titulo-doc').innerText = `FICHA DE TREINO: ${a.nome}`;
    document.getElementById('cupom-bloco-parq').style.display = 'none';
    document.getElementById('cupom-corpo-linhas').innerHTML = a.treino_json.map(e => `
        <div style="border-bottom:1px dashed #94a3b8; padding-bottom:4px; margin-bottom:4px;">
            <strong>• ${e.exercicio}</strong><br>
            <span>${e.series} | Carga: ${e.carga || '--'} | Desc: ${e.descanso}</span>
        </div>
    `).join('');
    document.getElementById('modal-cupom-termico').classList.add('active');
}

async function exportarFichaTreinoPDF() {
    const id = document.getElementById('select-aluno-treino').value;
    const a = ALUNOS.find(x => x.id == id);
    if (!a || !a.treino_json || a.treino_json.length === 0) return mostrarToast("Adicione exercícios primeiro!", "warning");

    document.getElementById('pdf-academia-titulo').innerText = CONFIG_HW.nomeAcademia;
    document.getElementById('pdf-treino-aluno').innerText = a.nome;
    document.getElementById('pdf-treino-objetivo').innerText = `Objetivo: ${a.objetivo} | Espaço: ${a.espaco || 'Musculação'}`;
    document.getElementById('pdf-treino-corpo').innerHTML = a.treino_json.map(e => `
        <div style="display:flex; justify-content:space-between; padding:10px; border:1px solid #cbd5e1; border-radius:6px;">
            <div><strong>[${e.divisao}]</strong> ${e.exercicio}</div>
            <div><strong>${e.series}</strong> (${e.descanso})</div>
        </div>
    `).join('');

    const el = document.getElementById('template-ficha-pdf');
    el.style.display = 'block';
    await html2pdf().from(el).set({ margin: 12, filename: `Treino_${a.nome}.pdf` }).save();
    el.style.display = 'none';
}

// ==============================================================
// 11. TELA 4: DIRETORIA CEO, FORECAST 30 DIAS E FECHO DE TURNO
// ==============================================================
function renderizarTelaCEO() {
    let ativos = 0, bloq = 0, mrr = 0, forecast30d = 0, qtdRenovacoes30d = 0;

    ALUNOS.forEach(a => {
        const info = calcularStatusMatricula(a);
        const val = parseFloat(a.valor_mensalidade) || 0;
        if (info.status === 'vencido') {
            bloq++;
        } else {
            ativos++;
            mrr += val;
            if (info.dias >= 0 && info.dias <= 30) {
                forecast30d += val;
                qtdRenovacoes30d++;
            }
        }
    });

    let saldo = 0;
    CAIXA.forEach(c => saldo += parseFloat(c.valor) || 0);

    document.getElementById('ceo-mrr').innerText = mrr.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    document.getElementById('ceo-caixa-liquido').innerText = saldo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    document.getElementById('ceo-forecast-30d').innerText = forecast30d.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    document.getElementById('ceo-forecast-sub').innerText = `${qtdRenovacoes30d} renovações previstas nos próx. 30d`;
    document.getElementById('ceo-ativos-ratio').innerText = `${ativos} / ${bloq}`;
    document.getElementById('ceo-ticket-medio').innerText = `Ticket Médio: ${(ativos > 0 ? mrr / ativos : 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`;

    const lista = document.getElementById('lista-caixa-ceo');
    lista.innerHTML = '';
    CAIXA.forEach(c => {
        const pos = c.valor >= 0;
        const cor = pos ? 'var(--neon-volt)' : 'var(--neon-red)';
        lista.innerHTML += `
            <div style="display:flex; justify-content:space-between; padding:10px 12px; background:rgba(0,0,0,0.4); border-left:3px solid ${cor}; border-radius:8px;">
                <span style="font-size:12px;">${c.descricao}</span>
                <strong style="color:${cor}; font-size:12px;">${c.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong>
            </div>
        `;
    });

    const ctx = document.getElementById('graficoCeoFluxo')?.getContext('2d');
    if (ctx) {
        if (chartCeo) chartCeo.destroy();
        chartCeo = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['06h', '08h', '10h', '12h', '15h', '17h', '18h', '19h', '20h', '21h'],
                datasets: [{ label: 'Atletas no Salão', data: [12, 19, 14, 16, 11, 22, 25, 24, 18, 10], borderColor: '#00f59b', tension: 0.4, fill: true, backgroundColor: 'rgba(0,245,155,0.15)' }]
            },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
        });
    }
}

function alternarBlurFinanceiro() {
    document.querySelectorAll('.valores-sensitivos').forEach(el => el.classList.toggle('blur-privacy'));
}

function abrirModalLancamentoCaixa() {
    document.getElementById('modal-caixa').classList.add('active');
}

function salvarLancamentoCaixa(tipo) {
    const desc = document.getElementById('caixa-desc').value.trim();
    const val = parseFloat(document.getElementById('caixa-valor').value);
    if (!desc || isNaN(val)) return mostrarToast("Preencha descrição e valor!", "warning");

    CAIXA.unshift({ id: Date.now(), descricao: desc, valor: tipo === 'despesa' ? -Math.abs(val) : Math.abs(val), tipo, metodo: 'MANUAL', data: 'Hoje' });
    salvarLocal();
    fecharTodosModais();
    renderizarTelaCEO();
    mostrarToast("Lançamento registado no Livro Caixa!", "success");
}

function abrirModalFechoTurno() {
    let totalPix = 0, totalCartao = 0, totalDinheiro = 0, totalSaidas = 0;
    CAIXA.forEach(c => {
        const v = parseFloat(c.valor) || 0;
        if (v < 0) totalSaidas += Math.abs(v);
        else if ((c.descricao || '').includes('CARTÃO') || c.metodo === 'CARTÃO') totalCartao += v;
        else if ((c.descricao || '').includes('DINHEIRO') || c.metodo === 'DINHEIRO') totalDinheiro += v;
        else totalPix += v;
    });

    const saldoTurno = (totalPix + totalCartao + totalDinheiro) - totalSaidas;
    document.getElementById('resumo-fecho-turno-box').innerHTML = `
        <div style="display:flex; justify-content:space-between;"><span>⚡ Recebimentos PIX / Convênio:</span><strong class="text-volt">${totalPix.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong></div>
        <div style="display:flex; justify-content:space-between;"><span>💳 Recebimentos Cartão:</span><strong class="text-cyan">${totalCartao.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong></div>
        <div style="display:flex; justify-content:space-between;"><span>💵 Recebimentos em Espécie:</span><strong style="color:white;">${totalDinheiro.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong></div>
        <div style="display:flex; justify-content:space-between;"><span>🔻 Saídas / Despesas:</span><strong class="text-red">- ${totalSaidas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong></div>
        <div style="border-top:1px dashed rgba(255,255,255,0.2); padding-top:8px; display:flex; justify-content:space-between; font-size:14px;">
            <strong>SALDO AUDITADO DO TURNO:</strong>
            <strong class="text-volt">${saldoTurno.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong>
        </div>
    `;
    document.getElementById('modal-fecho-turno').classList.add('active');
}

function imprimirRelatorioTurno80mm() {
    fecharTodosModais();
    document.getElementById('cupom-academia-nome').innerText = CONFIG_HW.nomeAcademia;
    document.getElementById('cupom-titulo-doc').innerText = "FECHAMENTO DE TURNO (AUDITORIA)";
    document.getElementById('cupom-corpo-linhas').innerHTML = document.getElementById('resumo-fecho-turno-box').innerHTML;
    document.getElementById('cupom-bloco-parq').style.display = 'none';
    document.getElementById('modal-cupom-termico').classList.add('active');
}

// ==============================================================
// 12. TELA 5: CHAVES CONFIGURÁVEIS, PAR-Q JURÍDICO E TRAVA LARANJA
// ==============================================================
function carregarInputsConfiguracoes() {
    const f = CONFIG_HW.flags;
    const setCheck = (id, val) => { const el = document.getElementById(id); if (el) el.checked = !!val; };

    setCheck('flag-voz', f.voz);
    setCheck('flag-pilates', f.pilates);
    setCheck('flag-export-whats', f.exportWhats);
    setCheck('flag-parq', f.parq);
    setCheck('flag-chat', f.chat ?? true);
    setCheck('flag-upsell', f.upsell);
    setCheck('flag-pdv', f.pdv);
    setCheck('flag-convenios', f.convenios);

    if (TRAVAR_MODULOS_FUTUROS) {
        IDS_MODULOS_TRAVADOS.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.checked = false;
                el.disabled = true;
            }
        });
    }

    const setVal = (id, val) => { const el = document.getElementById(id); if (el && val !== undefined) el.value = val; };
    setVal('hw-max-musculacao', CONFIG_HW.lotacaoMax['Musculação'] || 25);
    setVal('hw-max-auloes', CONFIG_HW.lotacaoMax['Aulões'] || 20);
    setVal('hw-max-pilates', CONFIG_HW.lotacaoMax['Pilates'] || 5);
    setVal('hw-tolerancia', CONFIG_HW.tolerancia || 3);
    setVal('hw-nome-academia', CONFIG_HW.nomeAcademia);
    setVal('hw-ip-catraca', CONFIG_HW.ipCatraca);
    setVal('hw-preco-mensal', CONFIG_HW.precos['Mensal']);
    setVal('hw-preco-trimestral', CONFIG_HW.precos['Trimestral']);
    setVal('hw-preco-anual', CONFIG_HW.precos['Anual Black']);
    setVal('hw-preco-diaria', CONFIG_HW.precos['Diária Visitante'] || 25.00);
    setVal('hw-pin-ceo', CONFIG_HW.pinCEO || '1234');
    setVal('hw-meta-receita', CONFIG_HW.metaMensal || 25000);
    setVal('hw-chave-pix', CONFIG_HW.chavePix || 'pix@titanfitness.com.br');
}

function aplicarFlagsModulos(exibirAviso = true) {
    const getCheck = (id) => { const el = document.getElementById(id); return el ? el.checked : false; };

    CONFIG_HW.flags = {
        voz: getCheck('flag-voz'),
        pilates: getCheck('flag-pilates'),
        exportWhats: getCheck('flag-export-whats'),
        parq: getCheck('flag-parq'),
        chat: getCheck('flag-chat'),
        upsell: TRAVAR_MODULOS_FUTUROS ? false : getCheck('flag-upsell'),
        pdv: TRAVAR_MODULOS_FUTUROS ? false : getCheck('flag-pdv'),
        convenios: TRAVAR_MODULOS_FUTUROS ? false : getCheck('flag-convenios')
    };

    const f = CONFIG_HW.flags;
    const setDisp = (id, show, mode = 'flex') => { const el = document.getElementById(id); if (el) el.style.display = show ? mode : 'none'; };

    setDisp('mod-btn-pdv1', f.pdv);
    setDisp('mod-btn-pdv2', f.pdv);
    setDisp('mod-btn-convenio', f.convenios);
    setDisp('mod-visor-upsell', f.upsell);
    setDisp('widget-lotacao-pilates', f.pilates, 'block');
    setDisp('btn-exportar-treino-whats', f.exportWhats);
    setDisp('titan-chat-wrapper', f.chat, 'block');

    // Atualiza o selo visual do PAR-Q na tela de recepção
    const badgeLaudo = document.getElementById('visor-laudo-badge');
    if (badgeLaudo) {
        badgeLaudo.style.display = f.parq ? 'inline-block' : 'none';
        badgeLaudo.innerText = f.parq ? '📋 Termo PAR-Q: Ativo & Homologado' : '';
    }

    salvarLocal();
    if (exibirAviso) mostrarToast("Módulos atualizados em tempo real!", "success");
}

function salvarConfigHardware() {
    CONFIG_HW.lotacaoMax['Musculação'] = parseInt(document.getElementById('hw-max-musculacao')?.value) || 25;
    CONFIG_HW.lotacaoMax['Aulões'] = parseInt(document.getElementById('hw-max-auloes')?.value) || 20;
    CONFIG_HW.lotacaoMax['Pilates'] = parseInt(document.getElementById('hw-max-pilates')?.value) || 5;
    CONFIG_HW.tolerancia = parseInt(document.getElementById('hw-tolerancia')?.value) || 3;
    CONFIG_HW.nomeAcademia = document.getElementById('hw-nome-academia')?.value.trim() || 'TITAN FITNESS CENTER';
    CONFIG_HW.ipCatraca = document.getElementById('hw-ip-catraca')?.value.trim() || '192.168.0.129';
    CONFIG_HW.precos['Mensal'] = parseFloat(document.getElementById('hw-preco-mensal')?.value) || 119.90;
    CONFIG_HW.precos['Trimestral'] = parseFloat(document.getElementById('hw-preco-trimestral')?.value) || 99.90;
    CONFIG_HW.precos['Anual Black'] = parseFloat(document.getElementById('hw-preco-anual')?.value) || 89.90;
    CONFIG_HW.precos['Diária Visitante'] = parseFloat(document.getElementById('hw-preco-diaria')?.value) || 25.00;
    CONFIG_HW.pinCEO = document.getElementById('hw-pin-ceo')?.value.trim() || '1234';
    CONFIG_HW.metaMensal = parseFloat(document.getElementById('hw-meta-receita')?.value) || 25000;
    CONFIG_HW.chavePix = document.getElementById('hw-chave-pix')?.value.trim() || 'pix@titanfitness.com.br';

    aplicarFlagsModulos(false);
    atualizarLotacaoEspacos();
    mostrarToast("Parâmetros de Planos, Lotação e Automações salvos!", "success");
}


function exportarBackupSistema() {
    const a = document.createElement('a');
    a.href = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ CONFIG_HW, ALUNOS, CAIXA, GIROS_CATRACA }, null, 2));
    a.download = `TITAN_GYM_BACKUP_${Date.now()}.json`;
    a.click();
}

function fecharTodosModais() {
    pararWebcam();
    document.querySelectorAll('.custom-modal-overlay').forEach(m => m.classList.remove('active'));
}

function mascaraCPF(i) {
    let v = i.value.replace(/\D/g, "").substring(0, 11);
    v = v.replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    i.value = v;
}

function mascaraTelefone(i) {
    let v = i.value.replace(/\D/g, "").substring(0, 11);
    v = v.replace(/^(\d{2})(\d)/g, "($1) $2").replace(/(\d)(\d{4})$/, "$1-$2");
    i.value = v;
}

function toggleTVMode() {
    document.body.classList.toggle('tv-mode');
}

function mostrarToast(msg, tipo = 'success') {
    const cont = document.getElementById('toast-container');
    if (!cont) return;
    const t = document.createElement('div');
    t.className = 'toast-msg';
    t.style.borderLeftColor = tipo === 'error' ? 'var(--neon-red)' : (tipo === 'warning' ? 'var(--neon-yellow)' : 'var(--neon-volt)');
    t.innerHTML = `<span class="material-icons-round">${tipo === 'error' ? 'block' : 'verified'}</span> <div>${msg}</div>`;
    cont.appendChild(t);
    setTimeout(() => t.remove(), 4000);
}

window.onload = function() {
    if (typeof flatpickr !== 'undefined') {
        flatpickr("#cad-vencimento", { locale: "pt", dateFormat: "Y-m-d" });
        flatpickr("#cad-nascimento", { locale: "pt", dateFormat: "Y-m-d" });
    }
    inicializarSistema();
};

// ==============================================================
// 13. MOTOR DE RELATÓRIO EXECUTIVO CEO & FORECAST 30D (PDF A4 VIP)
// ==============================================================
window.abrirModalRelatorioCEO = function() {
    const mesesNomes = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    const hoje = new Date();
    const compInput = document.getElementById('rel-ceo-competencia');
    if (compInput) compInput.value = `${mesesNomes[hoje.getMonth()]} / ${hoje.getFullYear()}`;

    const modal = document.getElementById('modal-relatorio-ceo');
    if (modal) {
        modal.classList.add('active');
    } else {
        mostrarToast("Erro: O modal #modal-relatorio-ceo não foi encontrado no index.html!", "error");
    }
};

window.gerarRelatorioExecutivoPDF = async function() {
    const btn = document.getElementById('btn-gerar-pdf-ceo');
    const txtOriginal = btn ? btn.innerHTML : '';
    if (btn) {
        btn.innerHTML = `<span class="material-icons-round" style="animation: spin 1s linear infinite;">autorenew</span> COMPILANDO DOSSIÊ...`;
        btn.disabled = true;
    }

    try {
        const fmtBRL = (v) => (parseFloat(v) || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        const comp = document.getElementById('rel-ceo-competencia')?.value || 'Outubro / 2026';
        const dest = document.getElementById('rel-ceo-destinatario')?.value || 'Diretoria Executiva';
        const obs = document.getElementById('rel-ceo-obs')?.value.trim() || '';

        const incEspacos = document.getElementById('rel-inc-espacos')?.checked ?? true;
        const incRetencao = document.getElementById('rel-inc-retencao')?.checked ?? true;
        const incCaixa = document.getElementById('rel-inc-caixa')?.checked ?? true;

        // 1. Cálculos de Alunos, MRR, Forecast 30d e Espaços
        let ativos = 0, retidos = 0, mrrTotal = 0, forecast30d = 0, qtdForecast = 0;
        const mapaEspacos = {
            'Musculação': { icone: '🏋️', qtd: 0, mrr: 0, limite: CONFIG_HW.lotacaoMax['Musculação'] || 25, checkinsHoje: 0 },
            'Aulões': { icone: '🔥', qtd: 0, mrr: 0, limite: CONFIG_HW.lotacaoMax['Aulões'] || 20, checkinsHoje: 0 },
            'Pilates': { icone: '🧘‍♀️', qtd: 0, mrr: 0, limite: CONFIG_HW.lotacaoMax['Pilates'] || 5, checkinsHoje: 0 }
        };
        const mapaPlanos = {
            'Mensal': { qtd: 0, mrr: 0 },
            'Trimestral': { qtd: 0, mrr: 0 },
            'Anual Black': { qtd: 0, mrr: 0 }
        };

        GIROS_CATRACA.slice(0, 35).forEach(g => {
            if (g.status_acesso === 'LIBERADO') {
                const esp = g.espaco || 'Musculação';
                if (mapaEspacos[esp]) mapaEspacos[esp].checkinsHoje++;
            }
        });

        ALUNOS.forEach(a => {
            const info = calcularStatusMatricula(a);
            const val = parseFloat(a.valor_mensalidade) || 0;
            const esp = a.espaco || 'Musculação';
            const pl = a.plano || 'Mensal';

            if (info.status === 'vencido') {
                retidos++;
            } else {
                ativos++;
                mrrTotal += val;
                if (info.dias >= 0 && info.dias <= 30) {
                    forecast30d += val;
                    qtdForecast++;
                }
                if (!mapaEspacos[esp]) mapaEspacos[esp] = { icone: '🏋️', qtd: 0, mrr: 0, limite: 25, checkinsHoje: 0 };
                mapaEspacos[esp].qtd++;
                mapaEspacos[esp].mrr += val;

                if (!mapaPlanos[pl]) mapaPlanos[pl] = { qtd: 0, mrr: 0 };
                mapaPlanos[pl].qtd++;
                mapaPlanos[pl].mrr += val;
            }
        });

        const totalBase = ativos + retidos;
        const taxaInadimplencia = totalBase > 0 ? ((retidos / totalBase) * 100).toFixed(1) : '0.0';
        const ticketMedio = ativos > 0 ? (mrrTotal / ativos) : 0;

        // 2. Cálculos do Livro Caixa
        let entradas = 0, saidas = 0, pix = 0, cartao = 0, especie = 0;
        CAIXA.forEach(c => {
            const v = parseFloat(c.valor) || 0;
            if (v >= 0) {
                entradas += v;
                if ((c.descricao || '').includes('CARTÃO') || c.metodo === 'CARTÃO') cartao += v;
                else if ((c.descricao || '').includes('DINHEIRO') || c.metodo === 'DINHEIRO') especie += v;
                else pix += v;
            } else {
                saidas += Math.abs(v);
            }
        });
        const saldoLiquido = entradas - saidas;

        // 3. Preencher Cabeçalho e KPIs do Template
        document.getElementById('pdf-ceo-academia').innerText = CONFIG_HW.nomeAcademia;
        document.getElementById('pdf-assinatura-academia').innerText = CONFIG_HW.nomeAcademia;
        document.getElementById('pdf-ceo-destinatario').innerText = dest;
        document.getElementById('pdf-ceo-competencia').innerText = `Competência: ${comp}`;

        document.getElementById('pdf-kpi-mrr').innerText = fmtBRL(mrrTotal);
        document.getElementById('pdf-kpi-ticket').innerText = `Ticket Médio: ${fmtBRL(ticketMedio)}`;
        document.getElementById('pdf-kpi-saldo').innerText = fmtBRL(saldoLiquido);
        document.getElementById('pdf-kpi-entradas-saidas').innerText = `+${fmtBRL(entradas)} / -${fmtBRL(saidas)}`;
        document.getElementById('pdf-kpi-forecast').innerText = fmtBRL(forecast30d);
        document.getElementById('pdf-kpi-forecast-qtd').innerText = `${qtdForecast} renovação(ões) em 30d`;
        document.getElementById('pdf-kpi-base').innerText = `${ativos} Ativos / ${retidos} Ret.`;
        document.getElementById('pdf-kpi-inadimplencia').innerText = `Inadimplência: ${taxaInadimplencia}%`;
        document.getElementById('pdf-ceo-total-projetado').innerText = fmtBRL(saldoLiquido + forecast30d);

        // 4. Parecer Analítico IA
        let espacoLider = 'Musculação';
        let maiorMrrEsp = 0;
        Object.entries(mapaEspacos).forEach(([nomeEsp, d]) => {
            if (d.mrr > maiorMrrEsp) { maiorMrrEsp = d.mrr; espacoLider = nomeEsp; }
        });

        const diagnosticoRetencao = retidos > 0
            ? `Identificamos <strong>${retidos} atleta(s) retido(s) na catraca</strong> por vencimento expirado (potencial imediato de recuperação via disparo WhatsApp PIX).`
            : `A base opera com <strong>Inadimplência Zero (100% de adimplência)</strong> nos terminais Control iD.`;

        document.getElementById('pdf-ceo-parecer-ia').innerHTML = `
            A operação apresenta Receita Recorrente Mensal (MRR) ativa de <strong>${fmtBRL(mrrTotal)}</strong>, liderada pela modalidade <strong>${espacoLider}</strong> (${fmtBRL(maiorMrrEsp)}). 
            Para os próximos 30 dias, o motor de Forecast projeta a entrada de <strong>${fmtBRL(forecast30d)}</strong> referente a ${qtdForecast} renovações programadas, elevando a disponibilidade projetada de caixa para <strong>${fmtBRL(saldoLiquido + forecast30d)}</strong>. ${diagnosticoRetencao}
        `;

        // 5. Renderizar Seção 1: Espaços e Planos
        const secEspacos = document.getElementById('pdf-secao-espacos');
        if (secEspacos) {
            secEspacos.style.display = incEspacos ? 'block' : 'none';
            let htmlEsp = '';
            Object.entries(mapaEspacos).forEach(([nomeEsp, d], idx) => {
                const bg = idx % 2 === 0 ? '#ffffff' : '#f8fafc';
                const pctRec = mrrTotal > 0 ? ((d.mrr / mrrTotal) * 100).toFixed(1) : '0.0';
                htmlEsp += `
                    <div style="display: flex; background: ${bg}; border-bottom: 1px solid #e2e8f0; align-items: center;">
                        <div style="width: 34%; padding: 9px 12px; font-weight: 800; color: #0f172a;">${d.icone} ${nomeEsp} <span style="font-size: 9px; color: #64748b; font-weight: 600;">(${pctRec}%)</span></div>
                        <div style="width: 18%; padding: 9px 12px; text-align: center; font-weight: 800; color: #0f172a;">${d.qtd} atletas</div>
                        <div style="width: 22%; padding: 9px 12px; text-align: center; color: #475569; font-weight: 700;">${d.checkinsHoje} / ${d.limite} vagas</div>
                        <div style="width: 26%; padding: 9px 12px; text-align: right; font-weight: 900; color: #059669;">${fmtBRL(d.mrr)}</div>
                    </div>
                `;
            });
            document.getElementById('pdf-tabela-espacos').innerHTML = htmlEsp;

            let htmlPlanos = '';
            Object.entries(mapaPlanos).forEach(([nomePl, d]) => {
                htmlPlanos += `
                    <div style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 6px; padding: 8px 12px; display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <strong style="font-size: 9.5px; color: #0f172a; display: block; text-transform: uppercase;">Plano ${nomePl}</strong>
                            <span style="font-size: 8.5px; color: #64748b; font-weight: 700;">${d.qtd} contratos ativos</span>
                        </div>
                        <strong style="font-size: 11px; color: #0f172a; font-weight: 900;">${fmtBRL(d.mrr)}</strong>
                    </div>
                `;
            });
            document.getElementById('pdf-resumo-planos').innerHTML = htmlPlanos;
        }

        // 6. Renderizar Seção 2: Radar de Retenção & Inadimplência
        const secRet = document.getElementById('pdf-secao-retencao');
        if (secRet) {
            secRet.style.display = incRetencao ? 'block' : 'none';
            let htmlRet = '';
            const alunosOrdenados = [...ALUNOS].sort((a, b) => calcularStatusMatricula(a).dias - calcularStatusMatricula(b).dias);
            alunosOrdenados.slice(0, 12).forEach((a, idx) => {
                const info = calcularStatusMatricula(a);
                const bg = idx % 2 === 0 ? '#ffffff' : '#f8fafc';
                const isVenc = info.status === 'vencido';
                const corStatus = isVenc ? '#dc2626' : (info.status === 'alerta' ? '#d97706' : '#059669');
                const dataBr = a.vencimento ? a.vencimento.split('-').reverse().join('/') : '--';

                htmlRet += `
                    <div style="display: flex; background: ${bg}; border-bottom: 1px solid #e2e8f0; align-items: center;">
                        <div style="width: 32%; padding: 8px 12px; font-weight: 800; color: #0f172a;">${a.nome}</div>
                        <div style="width: 20%; padding: 8px 12px; color: #475569; font-weight: 600;">${a.espaco || 'Musculação'} &bull; ${a.plano}</div>
                        <div style="width: 16%; padding: 8px 12px; text-align: center; font-weight: 700; color: #0f172a;">🔥 ${a.treinos_mes || 12} treinos</div>
                        <div style="width: 16%; padding: 8px 12px; text-align: center; font-family: monospace; font-weight: 700; color: #334155;">${dataBr}</div>
                        <div style="width: 16%; padding: 8px 12px; text-align: right; font-weight: 900; color: ${corStatus};">${isVenc ? 'RETIDO' : fmtBRL(a.valor_mensalidade)}</div>
                    </div>
                `;
            });
            document.getElementById('pdf-tabela-retencao').innerHTML = htmlRet;
        }

        // 7. Renderizar Seção 3: Livro Caixa
        const secCaixa = document.getElementById('pdf-secao-caixa');
        if (secCaixa) {
            secCaixa.style.display = incCaixa ? 'block' : 'none';
            document.getElementById('pdf-resumo-meios-pagto').innerText = `PIX: ${fmtBRL(pix)} | Cartão: ${fmtBRL(cartao)} | Espécie: ${fmtBRL(especie)}`;
            let htmlCx = '';
            CAIXA.slice(0, 12).forEach((c, idx) => {
                const pos = (parseFloat(c.valor) || 0) >= 0;
                const bg = idx % 2 === 0 ? '#ffffff' : '#f8fafc';
                const cor = pos ? '#059669' : '#dc2626';
                htmlCx += `
                    <div style="display: flex; justify-content: space-between; background: ${bg}; padding: 8px 12px; border-bottom: 1px solid #e2e8f0;">
                        <div>
                            <strong style="color: #0f172a;">${c.descricao}</strong>
                            <span style="color: #64748b; font-size: 9px; margin-left: 6px;">(${c.data || 'Hoje'})</span>
                        </div>
                        <strong style="color: ${cor}; font-weight: 900;">${pos ? '+' : '-'} ${fmtBRL(Math.abs(c.valor))}</strong>
                    </div>
                `;
            });
            document.getElementById('pdf-tabela-caixa').innerHTML = htmlCx;
        }

        // 8. Observações e Hash Criptográfico
        const blocoObs = document.getElementById('pdf-bloco-obs-ceo');
        if (blocoObs) {
            if (obs !== '') {
                blocoObs.style.display = 'block';
                document.getElementById('pdf-texto-obs-ceo').innerText = obs;
            } else {
                blocoObs.style.display = 'none';
            }
        }

        const hashGerado = `0x${Math.random().toString(16).substring(2, 10).toUpperCase()}-${Date.now().toString(16).toUpperCase()}`;
        document.getElementById('pdf-ceo-hash').innerText = `DOC_ID: ${hashGerado}`;
        document.getElementById('pdf-ceo-timestamp').innerText = `Processado em ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}`;

        // 9. Renderização via Portal Invisível
        const divPDF = document.getElementById('relatorio-ceo-pdf-template');
        let portal = document.getElementById('pdf-portal-invisivel-ceo');
        if (!portal) {
            portal = document.createElement('div');
            portal.id = 'pdf-portal-invisivel-ceo';
            portal.style.cssText = 'width: 0px; height: 0px; overflow: hidden; position: fixed; top: 0; left: 0;';
            document.body.appendChild(portal);
        }

        portal.appendChild(divPDF);
        divPDF.style.display = 'block';

        await new Promise(r => setTimeout(r, 350));

        const nomeLimpo = comp.replace(/[^a-zA-Z0-9]/g, '_');
        await html2pdf().from(divPDF).set({
            margin: [10, 10, 10, 10],
            filename: `Dossie_Executivo_TITAN_${nomeLimpo}.pdf`,
            pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
            html2canvas: { scale: 2, useCORS: true, logging: false, backgroundColor: '#ffffff' },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        }).save();

        divPDF.style.display = 'none';
        document.body.appendChild(divPDF);

        fecharTodosModais();
        mostrarToast("Dossiê Executivo & Forecast exportado com selo Hash!", "success");
    } catch (err) {
        console.error("Erro ao compilar PDF CEO:", err);
        mostrarToast("Falha ao compilar o PDF executivo.", "error");
    } finally {
        if (btn) {
            btn.innerHTML = txtOriginal;
            btn.disabled = false;
        }
    }
};

// ==============================================================
// 14. CENTRAL DE DOCUMENTOS, LAUDOS & COFRE FITNESS (100% FUNCIONAL)
// ==============================================================
const DOCS_PADRAO_GYM = [
    {
        id: 501,
        pasta: 'atestado',
        titulo: 'Atestado Cardiológico & PAR-Q - LUCAS MENDES',
        responsavel: 'Dr. Roberto Almeida (CRM-BA 18420) • Apto p/ Alta Intensidade',
        validade: gerarDataOffset(180),
        data_upload: 'Hoje',
        arquivo_base64: ''
    },
    {
        id: 502,
        pasta: 'cref',
        titulo: 'Certificado de Registro CREF/BA & Alvará Sanitário 2026',
        responsavel: 'Conselho Regional de Educação Física • Responsável Técnico Ativo',
        validade: gerarDataOffset(240),
        data_upload: '10/10/2026',
        arquivo_base64: ''
    },
    {
        id: 503,
        pasta: 'pilates',
        titulo: 'Contrato de Parceria B2B - STUDIO PILATES & FISIOTERAPIA',
        responsavel: 'Repasse Mensal Fixo + Uso de 5 Vagas no Controle de Lotação',
        validade: gerarDataOffset(310),
        data_upload: '01/10/2026',
        arquivo_base64: ''
    },
    {
        id: 504,
        pasta: 'manutencao',
        titulo: 'Laudo Preventivo: Cabos de Aço, Polias & 6 Esteiras Movement',
        responsavel: 'TechFitness Assistência Técnica • Garantia de 6 Meses',
        validade: gerarDataOffset(95),
        data_upload: '15/10/2026',
        arquivo_base64: ''
    }
];

let DOCUMENTOS_GYM = JSON.parse(localStorage.getItem('titanDocsGym')) || DOCS_PADRAO_GYM;
let COFRE_DOSSIES_GYM = JSON.parse(localStorage.getItem('titanCofreGym')) || [
    {
        id: 901,
        competencia: 'Outubro / 2026',
        destinatario: 'Diretoria & Sócios',
        valor_projetado: 689.60,
        hash: '0x8F92A1C4-192A4F8B',
        data_emissao: '19/10/2026 às 11:30'
    }
];
let pastaAtivaGym = 'atestado';

function salvarDocsECofreLocal() {
    localStorage.setItem('titanDocsGym', JSON.stringify(DOCUMENTOS_GYM));
    localStorage.setItem('titanCofreGym', JSON.stringify(COFRE_DOSSIES_GYM));
    const badge = document.getElementById('badge-total-docs');
    if (badge) badge.innerText = DOCUMENTOS_GYM.length;
}

// Estende navegarPara para carregar a tela de documentos automaticamente
const navegarOriginalGym = navegarPara;
navegarPara = function(tela) {
    navegarOriginalGym(tela);
    if (tela === 'documentos') {
        renderizarCentralDocumentosGym();
    }
};

// Estende o Visor Spotlight para atualizar a Barra de Meta Mensal e o Grupamento Muscular
const exibirVisorOriginalGym = exibirAlunoNoVisorSpotlight;
exibirAlunoNoVisorSpotlight = function(aluno, registrarGiro = true) {
    exibirVisorOriginalGym(aluno, registrarGiro);
    if (!aluno) return;

    const treinos = parseInt(aluno.treinos_mes) || 12;
    const pct = Math.min(100, Math.round((treinos / 20) * 100));
    const kcal = treinos * 310;

    const elPct = document.getElementById('visor-meta-pct');
    const elBar = document.getElementById('visor-meta-bar');
    const elKcal = document.getElementById('visor-kcal-est');
    const elFoco = document.getElementById('visor-foco-atual');

    if (elPct) elPct.innerText = `${pct}% (${treinos}/20)`;
    if (elBar) elBar.style.width = `${pct}%`;
    if (elKcal) elKcal.innerText = `⚡ ~${kcal.toLocaleString('pt-BR')} kcal no mês`;

    if (aluno.foco_muscular && elFoco) {
        elFoco.innerText = `Treino: ${aluno.foco_muscular}`;
    } else if (elFoco) {
        elFoco.innerText = `Objetivo: ${aluno.objetivo || 'Hipertrofia'}`;
    }
};

window.selecionarMusculoVisor = function(chipEl, nomeMusculo) {
    document.querySelectorAll('#visor-muscle-chips .muscle-chip').forEach(c => c.classList.remove('active-muscle'));
    chipEl.classList.add('active-muscle');
    if (alunoNoVisorAtual) {
        alunoNoVisorAtual.foco_muscular = nomeMusculo;
        salvarLocal();
    }
    const elFoco = document.getElementById('visor-foco-atual');
    if (elFoco) elFoco.innerText = `Treino: ${nomeMusculo}`;
    mostrarToast(`Foco do dia atualizado: ${nomeMusculo}`, 'success');
};

window.selecionarPastaGym = function(pastaId) {
    pastaAtivaGym = pastaId;
    document.querySelectorAll('.gym-folder-card').forEach(c => c.classList.remove('active-folder'));
    document.getElementById(`folder-${pastaId}`)?.classList.add('active-folder');

    const titulos = {
        'atestado': 'Pasta: 🩺 Atestados Médicos & Termos PAR-Q',
        'cref': 'Pasta: 🏛️ CREF, Alvarás & Compliance Legal',
        'pilates': 'Pasta: 🧘‍♀️ Contratos Pilates & Parceiros B2B',
        'manutencao': 'Pasta: 🔧 Manutenção de Equipamentos & Garantias'
    };
    const elTit = document.getElementById('titulo-pasta-ativa');
    if (elTit) elTit.innerText = titulos[pastaId] || 'Documentos';
    renderizarCentralDocumentosGym();
};

window.renderizarCentralDocumentosGym = function() {
    salvarDocsECofreLocal();

    // Atualiza contadores das 4 pastas
    ['atestado', 'cref', 'pilates', 'manutencao'].forEach(p => {
        const qtd = DOCUMENTOS_GYM.filter(d => d.pasta === p).length;
        const el = document.getElementById(`count-folder-${p}`);
        if (el) el.innerText = `${qtd} Arq.`;
    });

    const termo = (document.getElementById('busca-doc-gym')?.value || '').toLowerCase();
    const listaEl = document.getElementById('lista-arquivos-gym');
    if (listaEl) {
        listaEl.innerHTML = '';
        const filtrados = DOCUMENTOS_GYM.filter(d => d.pasta === pastaAtivaGym && (d.titulo.toLowerCase().includes(termo) || d.responsavel.toLowerCase().includes(termo)));

        if (filtrados.length === 0) {
            listaEl.innerHTML = `<p style="text-align:center; color:var(--text-muted); font-size:12px; padding:30px;">Nenhum documento arquivado nesta pasta. Clique em "Anexar Laudo" ou "Novo Acordo" no topo!</p>`;
        } else {
            filtrados.forEach(doc => {
                const vencBr = doc.validade ? doc.validade.split('-').reverse().join('/') : 'Indeterminado';
                listaEl.innerHTML += `
                    <div style="display:flex; justify-content:space-between; align-items:center; padding:12px 14px; background:rgba(0,0,0,0.45); border:1px solid var(--border-glass); border-left:3px solid var(--neon-cyan); border-radius:10px;" class="glow-hover">
                        <div style="min-width:0; flex:1; padding-right:10px;">
                            <strong style="font-size:12px; color:white; display:block; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${doc.titulo}</strong>
                            <span style="font-size:10px; color:var(--text-muted); display:block; margin-top:2px;">${doc.responsavel}</span>
                            <span style="font-size:9px; color:var(--neon-volt); font-weight:800;">Válido até: ${vencBr} &bull; Arquivado: ${doc.data_upload}</span>
                        </div>
                        <div style="display:flex; gap:6px; flex-shrink:0;">
                            <button class="btn-outline-cyan" style="padding:6px 10px;" onclick="baixarOuVisualizarDocGym(${doc.id})" title="Baixar / Verificar Documento">
                                <span class="material-icons-round" style="font-size:15px;">download</span>
                            </button>
                            <button class="btn-icon-danger" onclick="excluirDocGym(${doc.id})" title="Excluir Documento">
                                <span class="material-icons-round" style="font-size:15px;">delete</span>
                            </button>
                        </div>
                    </div>
                `;
            });
        }
    }

    // Renderiza Cofre de Dossiês Selados
    const cofreEl = document.getElementById('lista-cofre-gym');
    if (cofreEl) {
        cofreEl.innerHTML = '';
        COFRE_DOSSIES_GYM.forEach(c => {
            const valFmt = (parseFloat(c.valor_projetado) || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
            cofreEl.innerHTML += `
                <div style="padding:12px 14px; background:rgba(15,23,42,0.65); border:1px solid rgba(168,85,247,0.3); border-radius:10px; display:flex; flex-direction:column; gap:6px;">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <strong style="font-size:12px; color:white;">Dossiê ${c.competencia}</strong>
                        <strong class="text-volt" style="font-size:12px;">${valFmt}</strong>
                    </div>
                    <div style="font-size:10px; color:var(--text-muted);">Destinatário: ${c.destinatario} &bull; ${c.data_emissao}</div>
                    <div onclick="navigator.clipboard.writeText('${c.hash}'); mostrarToast('Chave Hash copiada para auditoria!', 'success');" style="cursor:pointer; background:rgba(0,0,0,0.5); border:1px dashed rgba(168,85,247,0.4); padding:6px 10px; border-radius:6px; display:flex; justify-content:space-between; align-items:center; font-family:monospace; font-size:10px; color:#e9d5ff;">
                        <span>🔑 ${c.hash}</span>
                        <span class="material-icons-round" style="font-size:13px;">content_copy</span>
                    </div>
                </div>
            `;
        });
    }
};

window.abrirModalNovoContratoParceiro = function() {
    document.getElementById('doc-gym-titulo').value = '';
    document.getElementById('doc-gym-pasta').value = pastaAtivaGym;
    document.getElementById('doc-gym-validade').value = gerarDataOffset(180);
    document.getElementById('doc-gym-resp').value = '';
    document.getElementById('modal-doc-gym')?.classList.add('active');
};

window.salvarNovoDocManualGym = function() {
    const titulo = document.getElementById('doc-gym-titulo').value.trim();
    const pasta = document.getElementById('doc-gym-pasta').value;
    const validade = document.getElementById('doc-gym-validade').value || gerarDataOffset(180);
    const resp = document.getElementById('doc-gym-resp').value.trim() || 'Homologado pela Administração';

    if (!titulo) return mostrarToast("Informe o título do documento ou contrato!", "warning");

    DOCUMENTOS_GYM.unshift({
        id: Date.now(),
        pasta,
        titulo,
        responsavel: resp,
        validade,
        data_upload: new Date().toLocaleDateString('pt-BR'),
        arquivo_base64: ''
    });

    pastaAtivaGym = pasta;
    fecharTodosModais();
    selecionarPastaGym(pasta);
    mostrarToast("Documento homologado e arquivado com sucesso!", "success");
};

window.processarUploadDocGym = function(event) {
    const file = event.target.files[0];
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) {
        event.target.value = '';
        return mostrarToast("Selecione um arquivo de até 4MB.", "warning");
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        DOCUMENTOS_GYM.unshift({
            id: Date.now(),
            pasta: pastaAtivaGym,
            titulo: file.name.toUpperCase(),
            responsavel: `Arquivo Digital (${(file.size / 1024).toFixed(1)} KB) • Criptografia Base64`,
            validade: gerarDataOffset(365),
            data_upload: new Date().toLocaleDateString('pt-BR'),
            arquivo_base64: e.target.result
        });
        event.target.value = '';
        renderizarCentralDocumentosGym();
        mostrarToast(`Arquivo "${file.name}" anexado na pasta atual!`, "success");
    };
    reader.readAsDataURL(file);
};

window.baixarOuVisualizarDocGym = function(id) {
    const doc = DOCUMENTOS_GYM.find(d => d.id == id);
    if (!doc) return;
    if (doc.arquivo_base64) {
        const a = document.createElement('a');
        a.href = doc.arquivo_base64;
        a.download = doc.titulo;
        a.click();
        mostrarToast("Download iniciado!", "success");
    } else {
        // Imprime certidão oficial em 80mm caso seja um registro homologado manualmente
        document.getElementById('cupom-academia-nome').innerText = CONFIG_HW.nomeAcademia;
        document.getElementById('cupom-titulo-doc').innerText = "CERTIDÃO DE DOCUMENTO HOMOLOGADO";
        document.getElementById('cupom-corpo-linhas').innerHTML = `
            <div><strong>REGISTRO:</strong> ${doc.titulo}</div>
            <div><strong>DETALHES:</strong> ${doc.responsavel}</div>
            <div><strong>VALIDADE:</strong> ${doc.validade.split('-').reverse().join('/')}</div>
            <div><strong>DATA ARQUIVO:</strong> ${doc.data_upload}</div>
        `;
        document.getElementById('cupom-bloco-parq').style.display = 'none';
        document.getElementById('modal-cupom-termico')?.classList.add('active');
    }
};

window.excluirDocGym = function(id) {
    DOCUMENTOS_GYM = DOCUMENTOS_GYM.filter(d => d.id != id);
    renderizarCentralDocumentosGym();
    mostrarToast("Documento removido da pasta.", "warning");
};

// Conecta a emissão do PDF Executivo CEO direto ao Cofre de Dossiês Selados
const gerarPdfOriginalGym = window.gerarRelatorioExecutivoPDF;
if (typeof gerarPdfOriginalGym === 'function') {
    window.gerarRelatorioExecutivoPDF = async function() {
        const comp = document.getElementById('rel-ceo-competencia')?.value || 'Outubro / 2026';
        const dest = document.getElementById('rel-ceo-destinatario')?.value || 'Diretoria Executiva';
        await gerarPdfOriginalGym();

        const hashTxt = (document.getElementById('pdf-ceo-hash')?.innerText || '').replace('DOC_ID: ', '') || `0x${Date.now().toString(16).toUpperCase()}`;
        COFRE_DOSSIES_GYM.unshift({
            id: Date.now(),
            competencia: comp,
            destinatario: dest,
            valor_projetado: ALUNOS.reduce((acc, a) => acc + (parseFloat(a.valor_mensalidade) || 0), 0),
            hash: hashTxt,
            data_emissao: new Date().toLocaleString('pt-BR')
        });
        salvarDocsECofreLocal();
    };
}

// Inicializa contadores e calendário do modal de documentos
setTimeout(() => {
    salvarDocsECofreLocal();
    if (typeof flatpickr !== 'undefined') {
        flatpickr("#doc-gym-validade", { locale: "pt", dateFormat: "Y-m-d" });
    }
    if (alunoNoVisorAtual) exibirAlunoNoVisorSpotlight(alunoNoVisorAtual, false);
}, 200);

// ==============================================================
// 15. MOTOR DO TITAN CHAT FLUTUANTE (RÁDIO PISO + TITAN IA CEO)
// ==============================================================
let canalChatAtual = 'piso';
let MENSAGENS_CHAT = {
    piso: [
        { autor: 'Prof. Gabriel (Salão Musculação)', texto: 'Recepção, aparelho Cross-Over liberado e revisado! 💪', tipo: 'incoming', hora: '18:10' },
        { autor: 'Profª. Camila (Studio Pilates)', texto: 'Turma das 18h finalizada com 5/5 alunos presentes.', tipo: 'incoming', hora: '18:35' }
    ],
    ia: [
        { autor: '🤖 Titan AI Copiloto', texto: 'Olá Ricardo! Sou o cérebro financeiro e operacional da academia. Pergunte sobre "caixa", "inadimplentes", "lotação" ou "meta"!', tipo: 'incoming', hora: 'Agora' }
    ]
};

window.alternarJanelaChat = function() {
    const win = document.getElementById('titan-chat-window');
    const badge = document.getElementById('chat-unread-badge');
    if (!win) return;
    win.classList.toggle('open');
    if (win.classList.contains('open')) {
        if (badge) badge.style.display = 'none';
        renderizarMensagensChat();
        document.getElementById('titan-chat-input')?.focus();
    }
};

window.trocarCanalChat = function(canal) {
    canalChatAtual = canal;
    document.getElementById('tab-chat-piso')?.classList.toggle('active', canal === 'piso');
    document.getElementById('tab-chat-ia')?.classList.toggle('active', canal === 'ia');
    renderizarMensagensChat();
};

function renderizarMensagensChat() {
    const area = document.getElementById('titan-chat-messages');
    if (!area) return;
    area.innerHTML = '';
    (MENSAGENS_CHAT[canalChatAtual] || []).forEach(m => {
        area.innerHTML += `
            <div class="chat-bubble ${m.tipo}">
                <strong>${m.autor} &bull; ${m.hora}</strong>
                <span>${m.texto}</span>
            </div>
        `;
    });
    area.scrollTop = area.scrollHeight;
}

window.enviarAtalhoChat = function(textoPronto) {
    const input = document.getElementById('titan-chat-input');
    if (input) {
        input.value = textoPronto;
        enviarMensagemChat();
    }
};

window.enviarMensagemChat = function() {
    const input = document.getElementById('titan-chat-input');
    if (!input) return;
    const txt = input.value.trim();
    if (!txt) return;

    const hora = new Date().toTimeString().substring(0, 5);
    MENSAGENS_CHAT[canalChatAtual].push({
        autor: 'Você (Recepção / CEO)',
        texto: txt,
        tipo: 'outgoing',
        hora
    });
    input.value = '';
    renderizarMensagensChat();

    // Resposta Inteligente Automática (Se estiver na aba IA ou no Rádio Piso)
    setTimeout(() => {
        if (canalChatAtual === 'ia' || txt.toLowerCase().includes('resumo') || txt.toLowerCase().includes('caixa')) {
            let ativos = 0, retidos = 0, mrr = 0;
            ALUNOS.forEach(a => {
                if (calcularStatusMatricula(a).status === 'vencido') retidos++;
                else { ativos++; mrr += parseFloat(a.valor_mensalidade) || 0; }
            });
            let saldo = CAIXA.reduce((acc, c) => acc + (parseFloat(c.valor) || 0), 0);
            const respIA = `📊 Status em Tempo Real: Temos ${ativos} atletas ativos (MRR de R$ ${mrr.toFixed(2)}), ${retidos} retido(s) na catraca e R$ ${saldo.toFixed(2)} líquidos em caixa hoje.`;
            MENSAGENS_CHAT[canalChatAtual].push({
                autor: '🤖 Titan AI Copiloto',
                texto: respIA,
                tipo: 'incoming',
                hora: new Date().toTimeString().substring(0, 5)
            });
        } else {
            MENSAGENS_CHAT.piso.push({
                autor: 'Prof. Gabriel (Salão Musculação)',
                texto: 'Ciente, recepção! Já estou indo atender o atleta no piso. 👍',
                tipo: 'incoming',
                hora: new Date().toTimeString().substring(0, 5)
            });
        }
        renderizarMensagensChat();
    }, 550);
};

// Conecta o Interruptor #flag-chat nas Configurações
const aplicarFlagsAntigoChat = aplicarFlagsModulos;
aplicarFlagsModulos = function(exibirAviso = true) {
    aplicarFlagsAntigoChat(exibirAviso);
    const chkChat = document.getElementById('flag-chat');
    const chatWrap = document.getElementById('titan-chat-wrapper');
    if (chkChat && chatWrap) {
        CONFIG_HW.flags.chat = chkChat.checked;
        chatWrap.style.display = chkChat.checked ? 'block' : 'none';
        salvarLocal();
    }
};

// ==============================================================
// 16. CONEXÃO AUTOMÁTICA DO TERMO JURÍDICO PAR-Q E PIN CUSTOMIZÁVEL
// ==============================================================
validarPinCEO = function() {
    const pinDigitado = document.getElementById('input-pin-ceo')?.value;
    const pinCorreto = CONFIG_HW.pinCEO || '1234';
    if (pinDigitado === pinCorreto) {
        ceoDesbloqueado = true;
        fecharTodosModais();
        navegarPara('ceo');
        mostrarToast("Painel Executivo e Forecast 30d Desbloqueados!", "success");
    } else {
        mostrarToast("PIN incorreto!", "error");
    }
};

const salvarAlunoOriginalParq = salvarAlunoCRM;
salvarAlunoCRM = function() {
    const isNovoCadastro = !document.getElementById('cad-id')?.value;
    const nomeAtleta = document.getElementById('cad-nome')?.value.trim().toUpperCase();
    const planoAtleta = document.getElementById('cad-plano')?.value || 'Mensal';
    const espacoAtleta = document.getElementById('cad-espaco')?.value || 'Musculação';
    const valorAtleta = parseFloat(document.getElementById('cad-valor')?.value) || 119.90;
    const vencAtleta = document.getElementById('cad-vencimento')?.value || gerarDataOffset(30);

    salvarAlunoOriginalParq();

    // Se for matrícula nova e o Termo Jurídico PAR-Q estiver ativo:
    if (isNovoCadastro && nomeAtleta && CONFIG_HW.flags.parq) {
        if (typeof DOCUMENTOS_GYM !== 'undefined') {
            DOCUMENTOS_GYM.unshift({
                id: Date.now(),
                pasta: 'atestado',
                titulo: `TERMO JURÍDICO PAR-Q HOMOLOGADO - ${nomeAtleta}`,
                responsavel: `Declaração Legal de Aptidão Física (${espacoAtleta} • ${planoAtleta})`,
                validade: gerarDataOffset(365),
                data_upload: new Date().toLocaleDateString('pt-BR'),
                arquivo_base64: ''
            });
            if (typeof salvarDocsECofreLocal === 'function') salvarDocsECofreLocal();
        }
        // Emite imediatamente o comprovante com a cláusula jurídica PAR-Q para assinatura
        exibirCupomTermicoNaTela(nomeAtleta, `${planoAtleta} (${espacoAtleta})`, valorAtleta, 'MATRÍCULA + PAR-Q', vencAtleta);
    }
};

// ==============================================================
// 17. MULTI-TAGS COLORIDAS, PRESENÇA SEMANAL AUTOMÁTICA E SUPABASE ID SYNC
// ==============================================================
let corTagSelecionada = 'volt';
let indiceTagEmEdicao = null;

// Inclui 'flag-musculos' na lista de módulos travados de expansão futura
if (typeof IDS_MODULOS_TRAVADOS !== 'undefined' && !IDS_MODULOS_TRAVADOS.includes('flag-musculos')) {
    IDS_MODULOS_TRAVADOS.push('flag-musculos');
}

// Sincroniza o atleta automaticamente com a tabela 'alunos' do Supabase
async function sincronizarAlunoSupabase(aluno) {
    if (!window.supabaseApp || !aluno) return;
    try {
        const payload = {
            id: aluno.id,
            nome: aluno.nome,
            cpf: aluno.cpf || '',
            whatsapp: aluno.whatsapp || '',
            plano: aluno.plano || 'Mensal',
            valor_mensalidade: parseFloat(aluno.valor_mensalidade) || 119.90,
            vencimento: aluno.vencimento,
            objetivo: aluno.objetivo || 'Hipertrofia',
            foto_base64: aluno.foto_base64 || null,
            treino_json: aluno.treino_json || []
        };
        await window.supabaseApp.from('alunos').upsert([payload], { onConflict: 'id' });
    } catch (e) {
        // Continua operando sem interromper em caso de tabela offline
    }
}

window.atualizarContadorTag = function(inputEl) {
    const countEl = document.getElementById('tag-char-count');
    if (countEl && inputEl) {
        countEl.innerText = `${inputEl.value.length}/22`;
    }
};

window.selecionarCorTag = function(dotEl) {
    document.querySelectorAll('.tag-color-picker .color-dot').forEach(d => d.classList.remove('active'));
    dotEl.classList.add('active');
    corTagSelecionada = dotEl.getAttribute('data-color') || 'volt';
};

window.focarEditorTagVisor = function(idxTag = null) {
    const input = document.getElementById('visor-nota-rapida');
    const selIcone = document.getElementById('tag-icone-select');
    const box = document.getElementById('box-editor-tags');
    if (!input || !alunoNoVisorAtual) return;

    garantirArrayTags(alunoNoVisorAtual);

    if (idxTag !== null && alunoNoVisorAtual.tags_custom[idxTag]) {
        indiceTagEmEdicao = idxTag;
        const tag = alunoNoVisorAtual.tags_custom[idxTag];
        input.value = tag.texto;
        if (selIcone) selIcone.value = tag.icone || '🔑';
        corTagSelecionada = tag.cor || 'volt';
        document.querySelectorAll('.tag-color-picker .color-dot').forEach(d => {
            d.classList.toggle('active', d.getAttribute('data-color') === corTagSelecionada);
        });
    } else {
        indiceTagEmEdicao = null;
        input.value = '';
    }

    atualizarContadorTag(input);
    input.focus();
    if (box) {
        box.style.borderColor = 'var(--neon-volt)';
        setTimeout(() => { box.style.borderColor = 'rgba(255,255,255,0.08)'; }, 1200);
    }
};

function garantirArrayTags(aluno) {
    if (!Array.isArray(aluno.tags_custom)) {
        aluno.tags_custom = [];
        if (aluno.nota_rapida && aluno.nota_rapida.trim() !== '') {
            // Converte nota antiga para o novo formato de tags com limite de 22 chars
            aluno.tags_custom.push({
                icone: '🔑',
                texto: aluno.nota_rapida.substring(0, 22),
                cor: 'yellow'
            });
        } else {
            aluno.tags_custom.push({
                icone: '🔥',
                texto: `Foco ${aluno.objetivo || 'Hipertrofia'}`.substring(0, 22),
                cor: 'cyan'
            });
        }
    }
}

window.removerTagAtleta = function(event, idx) {
    event.stopPropagation();
    if (!alunoNoVisorAtual) return;
    garantirArrayTags(alunoNoVisorAtual);
    alunoNoVisorAtual.tags_custom.splice(idx, 1);
    indiceTagEmEdicao = null;
    salvarLocal();
    exibirAlunoNoVisorSpotlight(alunoNoVisorAtual, false);
    mostrarToast("Tag removida do perfil.", "warning");
};

// Substitui salvarNotaRapidaVisor para suportar Multi-Tags Coloridas com Ícone e Limite de 22 Caracteres
window.salvarNotaRapidaVisor = function() {
    if (!alunoNoVisorAtual) return;
    const input = document.getElementById('visor-nota-rapida');
    const selIcone = document.getElementById('tag-icone-select');
    if (!input) return;

    const textoLimpo = input.value.trim().substring(0, 22);
    if (!textoLimpo) return mostrarToast("Digite um texto curto (até 22 letras) para a Tag!", "warning");

    garantirArrayTags(alunoNoVisorAtual);
    const novaTag = {
        icone: selIcone ? selIcone.value : '🔑',
        texto: textoLimpo,
        cor: corTagSelecionada || 'volt'
    };

    if (indiceTagEmEdicao !== null && alunoNoVisorAtual.tags_custom[indiceTagEmEdicao]) {
        alunoNoVisorAtual.tags_custom[indiceTagEmEdicao] = novaTag;
        indiceTagEmEdicao = null;
        mostrarToast("Tag atualizada com sucesso!", "success");
    } else {
        if (alunoNoVisorAtual.tags_custom.length >= 4) {
            alunoNoVisorAtual.tags_custom.shift(); // Mantém no máximo 4 tags para nunca poluir a tela
        }
        alunoNoVisorAtual.tags_custom.push(novaTag);
        mostrarToast("Nova Tag colorida fixada no atleta!", "success");
    }

    input.value = '';
    atualizarContadorTag(input);
    salvarLocal();
    sincronizarAlunoSupabase(alunoNoVisorAtual);
    exibirAlunoNoVisorSpotlight(alunoNoVisorAtual, false);
};

// Substitui renderizarPillsSemanaVisor para 100% Automático (Verde = Veio na Catraca | Vermelho = Faltou)
window.renderizarPillsSemanaVisor = function(aluno) {
    const container = document.getElementById('visor-semana-pills');
    if (!container || !aluno) return;

    const nomesDias = ['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];
    const dias = Array.isArray(aluno.dias_semana) ? aluno.dias_semana : [true, true, false, true, true, false];
    
    // Dia da semana atual (0 = Seg, 1 = Ter, ..., 5 = Sáb)
    const jsDay = new Date().getDay(); 
    const hojeIdx = jsDay === 0 ? 5 : jsDay - 1;

    const pills = container.querySelectorAll('.day-pill');
    pills.forEach((pill, idx) => {
        pill.className = 'day-pill';
        if (dias[idx]) {
            pill.classList.add('day-present');
            pill.innerText = `✓ ${nomesDias[idx]}`;
        } else if (idx < hojeIdx) {
            pill.classList.add('day-absent');
            pill.innerText = `✕ ${nomesDias[idx]}`;
        } else {
            pill.classList.add('day-future');
            pill.innerText = nomesDias[idx];
        }
    });
};

// Envolve exibirAlunoNoVisorSpotlight para renderizar a Classificação do ID, as Multi-Tags e o Deck Holográfico
const exibirVisorBaseRefinado = exibirAlunoNoVisorSpotlight;
exibirAlunoNoVisorSpotlight = function(aluno, registrarGiro = true) {
    exibirVisorBaseRefinado(aluno, registrarGiro);
    if (!aluno) return;

    // 1. Classificação Inteligente do ID do Aluno (Black VIP / Prime / Standard)
    const elTierId = document.getElementById('spotlight-tier-id');
    if (elTierId) {
        const idFormatado = String(aluno.id).slice(-4).padStart(4, '0');
        if (aluno.plano === 'Anual Black') {
            elTierId.innerText = `🏆 ID #${idFormatado} • BLACK VIP`;
            elTierId.style.borderColor = 'var(--neon-volt)';
            elTierId.style.color = 'var(--neon-volt)';
        } else if (aluno.plano === 'Trimestral') {
            elTierId.innerText = `⚡ ID #${idFormatado} • PRIME`;
            elTierId.style.borderColor = 'var(--neon-cyan)';
            elTierId.style.color = 'var(--neon-cyan)';
        } else {
            elTierId.innerText = `🛡️ ID #${idFormatado} • STANDARD`;
            elTierId.style.borderColor = 'var(--neon-purple)';
            elTierId.style.color = '#e9d5ff';
        }
    }

    // 2. Limpa a linha de plano (sem repetir o ID ou a nota antiga) e renderiza as Multi-Tags com Canetinha
    const elSub = document.getElementById('spotlight-sub');
    if (elSub) {
        elSub.innerHTML = `Plano <strong>${aluno.plano}</strong> &bull; ${aluno.espaco || 'Musculação'}`;
    }

    garantirArrayTags(aluno);
    const contTags = document.getElementById('visor-tags-container');
    if (contTags) {
        contTags.innerHTML = '';
        aluno.tags_custom.forEach((t, idx) => {
            contTags.innerHTML += `
                <span class="custom-student-tag tag-color-${t.cor || 'volt'}" onclick="focarEditorTagVisor(${idx})" title="Clique para editar esta tag">
                    <span>${t.icone || '🔑'} ${t.texto}</span>
                    <span class="material-icons-round tag-edit-pencil">edit</span>
                    <span class="tag-del-btn" onclick="removerTagAtleta(event, ${idx})" title="Remover tag">&times;</span>
                </span>
            `;
        });
    }

    // 3. Limpa o input do criador de tags para estar pronto para nova tag
    const inputNota = document.getElementById('visor-nota-rapida');
    if (inputNota && indiceTagEmEdicao === null) {
        inputNota.value = '';
        atualizarContadorTag(inputNota);
    }

    // 4. Atualiza os Dias da Semana Automáticos e a Caloria da Turma no Deck Holográfico
    renderizarPillsSemanaVisor(aluno);
    const kcalTurmaEl = document.getElementById('arena-kcal-hoje');
    if (kcalTurmaEl) {
        const totalPresentes = GIROS_CATRACA.filter(g => g.status_acesso === 'LIBERADO').length;
        kcalTurmaEl.innerText = `~${(totalPresentes * 380).toLocaleString('pt-BR')} kcal na Turma`;
    }

    if (registrarGiro) {
        sincronizarAlunoSupabase(aluno);
    }
};

// Reaplica a visualização inicial imediatamente
setTimeout(() => {
    if (alunoNoVisorAtual) exibirAlunoNoVisorSpotlight(alunoNoVisorAtual, false);
}, 150);

// ==============================================================
// 18. SELETORES NEON CUSTOMIZADOS + FEED DE PASSAGENS COM VENCIMENTO
// ==============================================================
let filtroPassagensAtivo = 'todos';

// 1. Seletor Customizado de Ícones da Tag
window.toggleMenuIconesTag = function(event) {
    event.stopPropagation();
    document.getElementById('lista-custom-simulador')?.classList.remove('open');
    document.getElementById('menu-icones-tag')?.classList.toggle('open');
};

window.escolherIconeTag = function(icone, labelTexto) {
    const input = document.getElementById('tag-icone-select');
    const disp = document.getElementById('tag-icone-display');
    if (input) input.value = icone;
    if (disp) disp.innerText = labelTexto;
    document.getElementById('menu-icones-tag')?.classList.remove('open');
};

// 2. Seletor Customizado de Atletas (Substitui o select azul do Windows)
window.toggleDropdownSimulador = function(event) {
    event.stopPropagation();
    document.getElementById('menu-icones-tag')?.classList.remove('open');
    const menu = document.getElementById('lista-custom-simulador');
    if (menu) {
        popularMenuCustomSimulador();
        menu.classList.toggle('open');
    }
};

function popularMenuCustomSimulador() {
    const menu = document.getElementById('lista-custom-simulador');
    const hiddenSelect = document.getElementById('select-simular-aluno');
    if (!menu || !ALUNOS.length) return;

    const idAtual = hiddenSelect?.value || ALUNOS[0].id;
    menu.innerHTML = '';

    ALUNOS.forEach(a => {
        const info = calcularStatusMatricula(a);
        const cor = info.status === 'vencido' ? 'var(--neon-red)' : (info.status === 'alerta' ? 'var(--neon-yellow)' : 'var(--neon-volt)');
        const vencBr = a.vencimento ? a.vencimento.split('-').reverse().join('/') : '--';

        menu.innerHTML += `
            <div class="sim-option-item" onclick="selecionarAtletaSimulador(${a.id})">
                <div style="display:flex; align-items:center; gap:8px; min-width:0;">
                    <span style="width:8px; height:8px; border-radius:50%; background:${cor}; flex-shrink:0;"></span>
                    <div style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">
                        <strong style="color:white; font-size:11px;">${a.nome}</strong>
                        <span style="color:var(--text-muted); font-size:9.5px; display:block;">${a.espaco || 'Musculação'} &bull; Venc: ${vencBr}</span>
                    </div>
                </div>
                <span style="font-size:9px; font-weight:900; color:${cor}; padding-left:6px;">${info.texto.toUpperCase()}</span>
            </div>
        `;
    });

    const selecionado = ALUNOS.find(x => x.id == idAtual) || ALUNOS[0];
    atualizarTextoTriggerSimulador(selecionado);
}

function atualizarTextoTriggerSimulador(aluno) {
    if (!aluno) return;
    const info = calcularStatusMatricula(aluno);
    const cor = info.status === 'vencido' ? 'var(--neon-red)' : (info.status === 'alerta' ? 'var(--neon-yellow)' : 'var(--neon-volt)');
    const dot = document.getElementById('sim-trigger-dot');
    const txt = document.getElementById('sim-trigger-text');
    if (dot) dot.style.background = cor;
    if (txt) txt.innerText = `${aluno.nome} • [${aluno.espaco || 'Musculação'}]`;
}

window.selecionarAtletaSimulador = function(id) {
    const hiddenSelect = document.getElementById('select-simular-aluno');
    if (hiddenSelect) hiddenSelect.value = id;
    const a = ALUNOS.find(x => x.id == id);
    if (a) {
        atualizarTextoTriggerSimulador(a);
        exibirAlunoNoVisorSpotlight(a, false);
    }
    document.getElementById('lista-custom-simulador')?.classList.remove('open');
};

// Fecha menus flutuantes ao clicar fora
document.addEventListener('click', () => {
    document.getElementById('lista-custom-simulador')?.classList.remove('open');
    document.getElementById('menu-icones-tag')?.classList.remove('open');
});

// 3. Abas de Filtro e Renderização Rica das Passagens com Data de Vencimento
window.filtrarFeedPassagens = function(filtro, btnEl) {
    filtroPassagensAtivo = filtro;
    document.querySelectorAll('.feed-filter-tabs .feed-tab').forEach(b => b.classList.remove('active'));
    if (btnEl) btnEl.classList.add('active');
    renderizarFeedGirosRecepcao();
};

// Substitui renderizarFeedGirosRecepcao para incluir Vencimento, Avatar, Status e Filtro
window.renderizarFeedGirosRecepcao = function() {
    const lista = document.getElementById('lista-giros-recepcao');
    if (!lista) return;
    lista.innerHTML = '';

    let lib = 0, bloq = 0;
    GIROS_CATRACA.forEach(g => {
        if (g.status_acesso === 'LIBERADO') lib++; else bloq++;
    });

    const elLib = document.getElementById('count-liberados-hoje');
    const elBloq = document.getElementById('count-bloqueados-hoje');
    if (elLib) elLib.innerText = `${lib} Entraram`;
    if (elBloq) elBloq.innerText = `${bloq} Retidos`;

    popularMenuCustomSimulador();

    const itensFiltrados = GIROS_CATRACA.filter(g => {
        const atleta = ALUNOS.find(a => a.id == g.aluno_id);
        const info = atleta ? calcularStatusMatricula(atleta) : { status: g.status_acesso === 'LIBERADO' ? 'ativo' : 'vencido' };

        if (filtroPassagensAtivo === 'liberados') return g.status_acesso === 'LIBERADO' && info.status === 'ativo';
        if (filtroPassagensAtivo === 'alerta') return info.status === 'alerta';
        if (filtroPassagensAtivo === 'retidos') return g.status_acesso === 'BLOQUEADO' || info.status === 'vencido';
        return true;
    });

    if (itensFiltrados.length === 0) {
        lista.innerHTML = `<div style="text-align:center; padding:30px 15px; color:var(--text-muted); font-size:11px;">Nenhum registro para o filtro selecionado.</div>`;
        return;
    }

    itensFiltrados.slice(0, 15).forEach(g => {
        const atleta = ALUNOS.find(a => a.id == g.aluno_id);
        const info = atleta ? calcularStatusMatricula(atleta) : { status: g.status_acesso === 'LIBERADO' ? 'ativo' : 'vencido', texto: 'Avulso / Balcão' };
        
        const ok = g.status_acesso === 'LIBERADO';
        const corBorda = !ok || info.status === 'vencido' ? 'var(--neon-red)' : (info.status === 'alerta' ? 'var(--neon-yellow)' : 'var(--neon-volt)');
        const bgVenc = !ok || info.status === 'vencido' ? 'rgba(255,59,92,0.15)' : (info.status === 'alerta' ? 'rgba(255,184,0,0.16)' : 'rgba(0,245,155,0.12)');
        
        const vencBr = atleta && atleta.vencimento ? atleta.vencimento.split('-').reverse().join('/') : 'Hoje';
        const iniciais = (g.aluno_nome || 'AT').substring(0, 2);
        const avatarStyle = atleta && atleta.foto_base64
            ? `background-image: url('${atleta.foto_base64}'); border: 2px solid ${corBorda};`
            : `border: 2px solid ${corBorda};`;

        const esp = g.espaco || (atleta ? atleta.espaco : 'Musculação');

        lista.innerHTML += `
            <div class="feed-rich-card" style="border-left: 3px solid ${corBorda};" onclick="selecionarAlunoPeloGiro(${g.aluno_id})">
                <div class="feed-card-left">
                    <div class="feed-mini-avatar" style="${avatarStyle}">${atleta && atleta.foto_base64 ? '' : iniciais}</div>
                    <div style="min-width:0; flex:1;">
                        <strong style="font-size:12px; color:white; display:block; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${g.aluno_nome}</strong>
                        <span style="font-size:10px; color:var(--text-muted); display:block;">${esp} &bull; ${g.plano}</span>
                        <span class="feed-venc-pill" style="background:${bgVenc}; color:${corBorda}; border:1px solid ${corBorda};">
                            📅 Venc: ${vencBr} &bull; ${info.texto}
                        </span>
                    </div>
                </div>
                <div style="text-align:right; flex-shrink:0;">
                    <span style="font-size:9px; font-weight:900; color:${corBorda}; display:block;">${g.status_acesso}</span>
                    <span style="font-size:10px; color:var(--text-muted); font-family:monospace; display:block; margin:2px 0 4px 0;">${g.hora}</span>
                    ${(!ok || info.status !== 'ativo') && atleta ? `<button onclick="event.stopPropagation(); abrirModalRenovacaoRapida(${atleta.id});" style="background:rgba(0,245,155,0.18); border:1px solid var(--neon-volt); color:var(--neon-volt); font-size:8.5px; font-weight:900; padding:2px 6px; border-radius:4px; cursor:pointer;">RENOVAR</button>` : ''}
                </div>
            </div>
        `;
    });
};

setTimeout(() => {
    renderizarFeedGirosRecepcao();
}, 180);

// ==============================================================
// 19. FILTRO INSTANTÂNEO ZERO-DELAY (0.0ms) & TOOLTIP MAGNÍFICO GLOBAL
// ==============================================================

// 1. Otimização de Velocidade: Renderiza os cards com atributo data-grupo e filtra via CSS em 0.0ms!
window.renderizarFeedGirosRecepcao = function() {
    const lista = document.getElementById('lista-giros-recepcao');
    if (!lista) return;

    // Mapa indexado O(1) para busca instantânea de atletas
    const mapaAlunos = new Map();
    ALUNOS.forEach(a => mapaAlunos.set(String(a.id), a));

    let lib = 0, bloq = 0;
    let htmlAcumulado = '';

    GIROS_CATRACA.slice(0, 20).forEach(g => {
        if (g.status_acesso === 'LIBERADO') lib++; else bloq++;

        const atleta = mapaAlunos.get(String(g.aluno_id));
        const info = atleta ? calcularStatusMatricula(atleta) : { status: g.status_acesso === 'LIBERADO' ? 'ativo' : 'vencido', texto: 'Liberado Balcão' };

        const ok = g.status_acesso === 'LIBERADO';
        let grupoCard = 'liberados';
        if (!ok || info.status === 'vencido') grupoCard = 'retidos';
        else if (info.status === 'alerta') grupoCard = 'alerta';

        const corBorda = grupoCard === 'retidos' ? 'var(--neon-red)' : (grupoCard === 'alerta' ? 'var(--neon-yellow)' : 'var(--neon-volt)');
        const bgVenc = grupoCard === 'retidos' ? 'rgba(255,59,92,0.15)' : (grupoCard === 'alerta' ? 'rgba(255,184,0,0.16)' : 'rgba(0,245,155,0.12)');

        const vencBr = atleta && atleta.vencimento ? atleta.vencimento.split('-').reverse().join('/') : 'Hoje';
        const iniciais = (g.aluno_nome || 'AT').substring(0, 2);
        const avatarStyle = atleta && atleta.foto_base64
            ? `background-image: url('${atleta.foto_base64}'); border: 2px solid ${corBorda};`
            : `border: 2px solid ${corBorda};`;

        const esp = g.espaco || (atleta ? atleta.espaco : 'Musculação');
        const visivelAgora = (filtroPassagensAtivo === 'todos' || filtroPassagensAtivo === grupoCard) ? 'flex' : 'none';

        htmlAcumulado += `
            <div class="feed-rich-card" data-grupo="${grupoCard}" style="display:${visivelAgora}; border-left: 3px solid ${corBorda};" onclick="selecionarAlunoPeloGiro(${g.aluno_id})" data-tip="Clique para inspecionar ${g.aluno_nome} no visor">
                <div class="feed-card-left">
                    <div class="feed-mini-avatar" style="${avatarStyle}">${atleta && atleta.foto_base64 ? '' : iniciais}</div>
                    <div style="min-width:0; flex:1;">
                        <strong style="font-size:12px; color:white; display:block; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${g.aluno_nome}</strong>
                        <span style="font-size:10px; color:var(--text-muted); display:block;">${esp} &bull; ${g.plano}</span>
                        <span class="feed-venc-pill" style="background:${bgVenc}; color:${corBorda}; border:1px solid ${corBorda};">
                            📅 Venc: ${vencBr} &bull; ${info.texto}
                        </span>
                    </div>
                </div>
                <div style="text-align:right; flex-shrink:0;">
                    <span style="font-size:9px; font-weight:900; color:${corBorda}; display:block;">${g.status_acesso}</span>
                    <span style="font-size:10px; color:var(--text-muted); font-family:monospace; display:block; margin:2px 0 4px 0;">${g.hora}</span>
                    ${(grupoCard !== 'liberados' && atleta) ? `<button onclick="event.stopPropagation(); abrirModalRenovacaoRapida(${atleta.id});" data-tip="Renovar matrícula via PIX ou Cartão" style="background:rgba(0,245,155,0.18); border:1px solid var(--neon-volt); color:var(--neon-volt); font-size:8.5px; font-weight:900; padding:2px 6px; border-radius:4px; cursor:pointer;">RENOVAR</button>` : ''}
                </div>
            </div>
        `;
    });

    // Contabiliza o total real da lista completa
    let totalLib = 0, totalBloq = 0;
    GIROS_CATRACA.forEach(g => { if (g.status_acesso === 'LIBERADO') totalLib++; else totalBloq++; });
    const elLib = document.getElementById('count-liberados-hoje');
    const elBloq = document.getElementById('count-bloqueados-hoje');
    if (elLib) elLib.innerText = `${totalLib} Entraram`;
    if (elBloq) elBloq.innerText = `${totalBloq} Retidos`;

    lista.innerHTML = htmlAcumulado || `<div style="text-align:center; padding:30px 15px; color:var(--text-muted); font-size:11px;">Nenhuma passagem registrada hoje.</div>`;

    if (ALUNOS.length > 0) {
        const idSel = document.getElementById('select-simular-aluno')?.value || ALUNOS[0].id;
        const atletaSel = mapaAlunos.get(String(idSel)) || ALUNOS[0];
        atualizarTextoTriggerSimulador(atletaSel);
    }
};

// Troca de Aba em 0.0ms (Apenas alterna a visibilidade dos cards na GPU sem reconstruir DOM!)
window.filtrarFeedPassagens = function(filtro, btnEl) {
    filtroPassagensAtivo = filtro;
    document.querySelectorAll('.feed-filter-tabs .feed-tab').forEach(b => b.classList.remove('active'));
    if (btnEl) btnEl.classList.add('active');

    const lista = document.getElementById('lista-giros-recepcao');
    if (!lista) return;

    let visiveis = 0;
    lista.querySelectorAll('.feed-rich-card').forEach(card => {
        const bate = (filtro === 'todos' || card.getAttribute('data-grupo') === filtro);
        card.style.display = bate ? 'flex' : 'none';
        if (bate) visiveis++;
    });

    let msgVazio = document.getElementById('feed-empty-filter-msg');
    if (visiveis === 0) {
        if (!msgVazio) {
            msgVazio = document.createElement('div');
            msgVazio.id = 'feed-empty-filter-msg';
            msgVazio.style.cssText = 'text-align:center; padding:28px 15px; color:var(--text-muted); font-size:11px;';
            lista.appendChild(msgVazio);
        }
        msgVazio.innerText = 'Nenhum atleta nesta categoria no momento.';
        msgVazio.style.display = 'block';
    } else if (msgVazio) {
        msgVazio.style.display = 'none';
    }
};

// 2. Interceptador Global de Tooltips (Remove o balão branco nativo do Windows e exibe o HUD Neon)
function inicializarTooltipsMagnificos() {
    let tipEl = document.getElementById('titan-custom-tooltip');
    if (!tipEl) {
        tipEl = document.createElement('div');
        tipEl.id = 'titan-custom-tooltip';
        document.body.appendChild(tipEl);
    }

    const converterTitlesNativos = (root = document) => {
        root.querySelectorAll('[title]').forEach(el => {
            const t = el.getAttribute('title');
            if (t && t.trim() !== '') {
                el.setAttribute('data-tip', t.trim());
            }
            el.removeAttribute('title');
        });
    };

    converterTitlesNativos();

    document.addEventListener('mouseover', (e) => {
        // Garante que qualquer elemento novo com title seja convertido na hora antes do navegador mostrar o balão branco
        const comTitle = e.target.closest('[title]');
        if (comTitle) {
            comTitle.setAttribute('data-tip', comTitle.getAttribute('title'));
            comTitle.removeAttribute('title');
        }

        const alvo = e.target.closest('[data-tip]');
        if (!alvo) {
            tipEl.style.display = 'none';
            return;
        }

        const texto = alvo.getAttribute('data-tip');
        if (!texto) return;

        tipEl.innerText = texto;
        tipEl.style.display = 'inline-flex';

        const rect = alvo.getBoundingClientRect();
        const tipRect = tipEl.getBoundingClientRect();

        let left = rect.left + (rect.width / 2) - (tipRect.width / 2);
        let top = rect.bottom + 8;

        // Se bater no fundo da tela, joga para cima do botão
        if (top + tipRect.height > window.innerHeight - 10) {
            top = rect.top - tipRect.height - 8;
        }
        // Proteção nas laterais da tela
        if (left < 10) left = 10;
        if (left + tipRect.width > window.innerWidth - 10) {
            left = window.innerWidth - tipRect.width - 10;
        }

        tipEl.style.left = `${Math.round(left)}px`;
        tipEl.style.top = `${Math.round(top)}px`;
    });

    document.addEventListener('mouseout', (e) => {
        if (e.target.closest('[data-tip]')) {
            tipEl.style.display = 'none';
        }
    });

    document.addEventListener('mousedown', () => {
        tipEl.style.display = 'none';
    });
}

setTimeout(() => {
    inicializarTooltipsMagnificos();
    renderizarFeedGirosRecepcao();
}, 120);

// ==============================================================
// 20. REFINAMENTO LUXURY: MONOGRAMA VIP, ARMÁRIO 1-CLIQUE E CORREÇÃO GIRO MANUAL
// ==============================================================

// 1. Corrige o Giro Manual para nunca misturar com foto ou vencimento de aluno
window.acionarGiroManualCatraca = function() {
    const hora = new Date().toTimeString().substring(0, 5);
    GIROS_CATRACA.unshift({
        id: Date.now(),
        aluno_id: 0, // ID 0 exclusivo para liberação de balcão
        aluno_nome: "ABERTURA MANUAL DE CATRACA",
        espaco: "Recepção",
        plano: "Relé SecBox Control iD",
        status_acesso: "LIBERADO",
        motivo: "Giro Manual Autorizado",
        hora: hora
    });
    salvarLocal();
    renderizarFeedGirosRecepcao();
    atualizarLotacaoEspacos();
    mostrarToast("🔓 Catraca destravada! Giro manual registrado.", "success");
};

// 2. Limpa qualquer giro manual antigo que tenha ficado com ID de aluno por engano
GIROS_CATRACA.forEach(g => {
    if ((g.aluno_nome || '').includes('LIBERADA PELO BALCÃO') || (g.aluno_nome || '').includes('MANUAL')) {
        g.aluno_id = 0;
        g.espaco = 'Recepção';
        g.plano = 'Giro Livre Relé';
    }
});

// 3. Troca Rápida de Chave de Armário em 1 Clique (Smart Locker)
window.alternarArmarioRapido = function() {
    if (!alunoNoVisorAtual) return;
    const armariosDisponiveis = ['Sem Armário', 'Armário #04', 'Armário #08', 'Armário #12', 'Armário #15', 'Armário #21'];
    const atual = alunoNoVisorAtual.armario || 'Armário #04';
    const proxIdx = (armariosDisponiveis.indexOf(atual) + 1) % armariosDisponiveis.length;
    alunoNoVisorAtual.armario = armariosDisponiveis[proxIdx];

    salvarLocal();
    exibirAlunoNoVisorSpotlight(alunoNoVisorAtual, false);
    mostrarToast(`🔑 ${alunoNoVisorAtual.nome}: ${alunoNoVisorAtual.armario}`, "success");
};

// 4. Pager 1-Clique: Chamar Professor no Piso para atender o atleta do visor
window.chamarProfessorNoPiso = function() {
    if (!alunoNoVisorAtual) return;
    const esp = alunoNoVisorAtual.espaco || 'Musculação';
    const hora = new Date().toTimeString().substring(0, 5);

    if (typeof MENSAGENS_CHAT !== 'undefined' && MENSAGENS_CHAT.piso) {
        MENSAGENS_CHAT.piso.push({
            autor: '📢 Pager Recepção',
            texto: `Atenção instrutor (${esp}): Atleta ${alunoNoVisorAtual.nome} acabou de entrar e solicita acompanhamento na ficha!`,
            tipo: 'outgoing',
            hora: hora
        });
        setTimeout(() => {
            MENSAGENS_CHAT.piso.push({
                autor: `Prof. Responsável (${esp})`,
                texto: `Recebido! Já estou indo receber ${alunoNoVisorAtual.nome.split(' ')[0]} no salão. 💪`,
                tipo: 'incoming',
                hora: hora
            });
            const badge = document.getElementById('chat-unread-badge');
            if (badge) { badge.innerText = '1'; badge.style.display = 'flex'; }
        }, 900);
    }

    mostrarToast(`📢 Professor de ${esp} acionado no rádio para atender ${alunoNoVisorAtual.nome.split(' ')[0]}!`, "success");
};

// 5. Aprimora o Visor com Monograma Cyber-VIP e Faixa Concierge
const exibirVisorLuxuryBase = exibirAlunoNoVisorSpotlight;
exibirAlunoNoVisorSpotlight = function(aluno, registrarGiro = true) {
    exibirVisorLuxuryBase(aluno, registrarGiro);
    if (!aluno) return;

    // Substitui o bonequinho verde genérico pelo Monograma Cyber-VIP quando não há foto
    const avatar = document.getElementById('spotlight-avatar');
    if (avatar && !aluno.foto_base64) {
        const partes = aluno.nome.trim().split(' ');
        const iniciais = partes.length > 1 ? (partes[0][0] + partes[partes.length - 1][0]) : aluno.nome.substring(0, 2);
        const info = calcularStatusMatricula(aluno);
        const liberado = info.status !== 'vencido';
        avatar.innerHTML = `
            <div class="cyber-monogram">
                <strong>${iniciais}</strong>
                <span>${liberado ? 'TITAN ID' : 'RETIDO'}</span>
            </div>
        `;
    }

    // Atualiza a Faixa Concierge VIP (Armário, Fidelidade e Último Pagamento)
    const elLocker = document.getElementById('concierge-locker');
    if (elLocker) {
        const arm = aluno.armario || (aluno.id == 101 ? 'Armário #04' : 'Sem Armário');
        elLocker.innerText = arm === 'Sem Armário' ? '🔓 Sem Armário (Vincular)' : `🔑 ${arm} (Em Uso)`;
        elLocker.className = arm === 'Sem Armário' ? 'text-cyan' : 'text-yellow';
    }

    const elFid = document.getElementById('concierge-fidelidade');
    if (elFid) {
        const meses = ((aluno.id % 9) + 3);
        const nivel = aluno.plano === 'Anual Black' ? 'Nível Black Diamond' : (aluno.plano === 'Trimestral' ? 'Nível Prime Gold' : 'Atleta Member');
        elFid.innerText = `💎 ${meses} Meses • ${nivel}`;
    }

    const elPagto = document.getElementById('concierge-pagto');
    if (elPagto) {
        const info = calcularStatusMatricula(aluno);
        const valFmt = (parseFloat(aluno.valor_mensalidade) || 99.90).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        if (info.status === 'vencido') {
            elPagto.innerText = `⚠️ Pendente (${valFmt})`;
            elPagto.className = 'text-red';
        } else {
            elPagto.innerText = `⚡ PIX Confirmado (${valFmt})`;
            elPagto.className = 'text-volt';
        }
    }
};

// 6. Aprimora os Cards da Direita para separar Giro Manual de Passagens de Alunos
const renderFeedBaseLuxury = window.renderizarFeedGirosRecepcao;
window.renderizarFeedGirosRecepcao = function() {
    renderFeedBaseLuxury();
    const lista = document.getElementById('lista-giros-recepcao');
    if (!lista) return;

    // Personaliza os cards de Giro Manual (aluno_id == 0) para terem visual exclusivo de Relé
    lista.querySelectorAll('.feed-rich-card').forEach((card, idx) => {
        const giro = GIROS_CATRACA[idx];
        if (giro && (!giro.aluno_id || giro.aluno_id == 0)) {
            card.style.borderLeftColor = 'var(--neon-cyan)';
            const avatarEl = card.querySelector('.feed-mini-avatar');
            if (avatarEl) {
                avatarEl.style.backgroundImage = 'none';
                avatarEl.style.borderColor = 'var(--neon-cyan)';
                avatarEl.innerHTML = `<span class="material-icons-round" style="font-size:18px; color:var(--neon-cyan);">lock_open</span>`;
            }
            const pillEl = card.querySelector('.feed-venc-pill');
            if (pillEl) {
                pillEl.style.background = 'rgba(0, 210, 255, 0.12)';
                pillEl.style.borderColor = 'var(--neon-cyan)';
                pillEl.style.color = 'var(--neon-cyan)';
                pillEl.innerText = '🔓 GIRO LIVRE RECEPÇÃO • RELÉ CONTROL iD';
            }
        }
    });
};

setTimeout(() => {
    if (alunoNoVisorAtual) exibirAlunoNoVisorSpotlight(alunoNoVisorAtual, false);
    renderizarFeedGirosRecepcao();
}, 150);

// ==============================================================
// 21. MODO CATRACA LIVRE (ALMOÇO / 21H), RÁDIO GYM, WHATSAPP D-1/D+1 E LIMPEZA
// ==============================================================
let catracaModoLivreAlmoco = false;
let playlistGymIdx = 0;
const PLAYLISTS_GYM = [
    'RÁDIO GYM: PHONK / WORKOUT (128 BPM)',
    'RÁDIO GYM: ELETRÔNICA / HIIT (135 BPM)',
    'RÁDIO GYM: HIP-HOP / MAROMBA (110 BPM)',
    'RÁDIO GYM: DESATIVADA (SILENCIOSO)'
];

if (typeof IDS_MODULOS_TRAVADOS !== 'undefined' && !IDS_MODULOS_TRAVADOS.includes('flag-armario')) {
    IDS_MODULOS_TRAVADOS.push('flag-armario');
}

// 1. Modo Catraca Livre (Para Horário de Almoço e 1h Antes de Fechar)
window.alternarModoLivreAlmoco = function() {
    catracaModoLivreAlmoco = !catracaModoLivreAlmoco;
    if (catracaModoLivreAlmoco && catracaPausadaGeral) {
        alternarPausaCatracaGeral(); // Destrava se estivesse bloqueada
    }

    const banner = document.getElementById('banner-catraca-livre-almoco');
    const btn = document.getElementById('btn-modo-livre-almoco');
    const txtTit = document.getElementById('txt-titulo-almoco');
    const txtSub = document.getElementById('txt-sub-almoco');
    const txtTopo = document.getElementById('txt-status-catraca-topo');
    const elRegime = document.getElementById('arena-regime-catraca');

    if (catracaModoLivreAlmoco) {
        if (banner) banner.style.display = 'flex';
        if (btn) btn.classList.add('modo-livre-ativo');
        if (txtTit) txtTit.innerText = 'Catraca Liberada';
        if (txtSub) txtSub.innerText = 'Passagem Livre Ativa';
        if (txtTopo) txtTopo.innerText = 'MODO ALMOÇO / FIM DE TURNO • PASSAGEM LIVRE SEM BIOMETRIA';
        if (elRegime) { elRegime.innerText = '🔓 Passagem Livre (Almoço/21h)'; elRegime.className = 'text-yellow'; }
        mostrarToast("🔓 Modo Catraca Livre Ativado (Horário de Almoço / Saída Recepção)!", "success");
    } else {
        if (banner) banner.style.display = 'none';
        if (btn) btn.classList.remove('modo-livre-ativo');
        if (txtTit) txtTit.innerText = 'Liberar Catraca';
        if (txtSub) txtSub.innerText = 'Modo Almoço / 21h';
        if (txtTopo) txtTopo.innerText = 'CATRACA CONTROL iD OPERACIONAL • FLUXO LIVRE';
        if (elRegime) { elRegime.innerText = 'Biometria Ativa (Padrão)'; elRegime.className = 'text-volt'; }
        mostrarToast("🔒 Biometria obrigatória reativada na catraca!", "success");
    }
};

// 2. Botão de Música / Rádio Gym no Topo da Catraca
window.alternarMusicaGym = function() {
    playlistGymIdx = (playlistGymIdx + 1) % PLAYLISTS_GYM.length;
    const txtEl = document.getElementById('txt-visor-musica');
    const iconEl = document.getElementById('icon-visor-musica');
    if (txtEl) txtEl.innerText = PLAYLISTS_GYM[playlistGymIdx];
    if (iconEl) iconEl.innerText = playlistGymIdx === 3 ? 'volume_off' : 'equalizer';
    mostrarToast(`🎵 ${PLAYLISTS_GYM[playlistGymIdx]}`, "success");
};

// 3. Disparo Direto de WhatsApp na Tela de Alunos (Com Regras "Vence Amanhã D-1" e "Pós-Vencimento D+1")
window.enviarWhatsAppDiretoCRM = function(idAluno) {
    const a = ALUNOS.find(x => x.id == idAluno);
    if (!a) return;

    const info = calcularStatusMatricula(a);
    const numLimpo = (a.whatsapp || '').replace(/\D/g, '');
    const fone = numLimpo.length >= 10 ? `55${numLimpo}` : '5571986030162';
    const vencBr = a.vencimento ? a.vencimento.split('-').reverse().join('/') : '--';
    const chavePix = CONFIG_HW.chavePix || 'pix@titanfitness.com.br';

    const usarRegraD1 = CONFIG_HW.flags.whatsD1 ?? true;
    const usarRegraPos1 = CONFIG_HW.flags.whatsPos1 ?? true;

    let msg = '';
    if (info.dias === 1 && usarRegraD1) {
        msg = `Olá *${a.nome}*! Tudo bem? Passando para lembrar que sua matrícula na *${CONFIG_HW.nomeAcademia}* (${a.plano}) *vence amanhã (${vencBr})*! 🔔\n\nPara continuar passando direto na catraca sem bloqueio, você pode renovar via PIX (Chave: *${chavePix}*). Bom treino! 💪`;
    } else if (info.dias === 0 && usarRegraD1) {
        msg = `Olá *${a.nome}*! Sua matrícula na *${CONFIG_HW.nomeAcademia}* vence *hoje (${vencBr})*! ⚡\n\nRenove rapidinho via PIX (*${chavePix}*) para manter sua biometria liberada na catraca!`;
    } else if (info.dias < 0) {
        if (!usarRegraPos1) {
            return mostrarToast("A regra de cobrança pós-vencimento está desativada nas configurações (o atleta já está retido na catraca).", "warning");
        }
        msg = `Olá *${a.nome}*! Notamos que sua matrícula na *${CONFIG_HW.nomeAcademia}* venceu em *${vencBr}* e o acesso na catraca encontra-se retido temporariamente. 🚫\n\nDeseja regularizar agora via PIX (*${chavePix}*) para liberarmos sua catraca imediatamente?`;
    } else {
        msg = `Olá *${a.nome}*! Aqui é da recepção da *${CONFIG_HW.nomeAcademia}*. Seu plano *${a.plano}* está ativo e liberado até *${vencBr}* (🔥 ${a.treinos_mes || 14} treinos no mês). Excelente treino!`;
    }

    window.open(`https://wa.me/${fone}?text=${encodeURIComponent(msg)}`, '_blank');
    mostrarToast(`Abrindo WhatsApp para ${a.nome}...`, "success");
};

// 4. Atualiza a Tabela de Alunos com o Botão Direto de WhatsApp e Etiquetas "VENCE AMANHÃ!"
window.renderizarTabelaAlunos = function() {
    const grid = document.getElementById('grid-alunos-crm');
    if (!grid) return;
    const texto = (document.getElementById('filtro-texto-alunos')?.value || '').toLowerCase();
    const statusFiltro = document.getElementById('filtro-status-alunos')?.value || 'todos';

    grid.innerHTML = '';
    ALUNOS.filter(a => {
        const info = calcularStatusMatricula(a);
        const bday = isAniversarianteDoMes(a.nascimento);
        const bateTxt = a.nome.toLowerCase().includes(texto) || (a.cpf || '').includes(texto) || (a.objetivo || '').toLowerCase().includes(texto);
        
        let bateSt = true;
        if (statusFiltro === 'vence_amanha') bateSt = (info.dias >= 0 && info.dias <= 3);
        else if (statusFiltro === 'aniversariantes') bateSt = bday;
        else if (statusFiltro !== 'todos') bateSt = (info.status === statusFiltro);

        return bateTxt && bateSt;
    }).forEach(a => {
        const info = calcularStatusMatricula(a);
        const cor = info.status === 'vencido' ? 'var(--neon-red)' : (info.status === 'alerta' ? 'var(--neon-yellow)' : 'var(--neon-volt)');
        const bdayTag = isAniversarianteDoMes(a.nascimento) ? `<span class="bday-pill" style="margin-left:8px;">🎂 ANIVERSARIANTE</span>` : '';
        
        // Destaque especial se vence amanhã (D-1) ou 1 dia após vencimento (D+1)
        let alertaReguaBadge = '';
        if (info.dias === 1) {
            alertaReguaBadge = `<span style="background:rgba(255,184,0,0.2); border:1px solid var(--neon-yellow); color:var(--neon-yellow); font-size:9px; font-weight:900; padding:2px 7px; border-radius:6px; margin-left:6px;">🔔 VENCE AMANHÃ!</span>`;
        } else if (info.dias === -1) {
            alertaReguaBadge = `<span style="background:rgba(255,59,92,0.2); border:1px solid var(--neon-red); color:#ff6b81; font-size:9px; font-weight:900; padding:2px 7px; border-radius:6px; margin-left:6px;">⚠️ VENCEU ONTEM (D+1)</span>`;
        }

        const avatarHtml = a.foto_base64
            ? `<img src="${a.foto_base64}" style="width:46px; height:46px; border-radius:50%; object-fit:cover; border:2px solid ${cor};">`
            : `<div style="width:46px; height:46px; border-radius:50%; border:2px solid ${cor}; background:#0b111e; display:flex; align-items:center; justify-content:center; font-weight:900;">${a.nome.substring(0,2)}</div>`;

        const txtBotaoWhats = info.dias === 1 ? 'AVISAR: VENCE AMANHÃ' : (info.dias < 0 ? 'COBRAR NO WHATSAPP' : 'WHATSAPP');

        grid.innerHTML += `
            <div class="glass-card glow-hover" style="display:flex; justify-content:space-between; align-items:center; padding:14px 18px;">
                <div style="display:flex; align-items:center; gap:14px;">
                    ${avatarHtml}
                    <div>
                        <strong style="font-size:14px; color:white;">${a.nome}</strong>
                        <span style="font-size:10px; color:${cor}; font-weight:800; margin-left:8px;">● ${info.texto.toUpperCase()}</span>
                        ${alertaReguaBadge}
                        ${bdayTag}
                        <div style="font-size:11px; color:var(--text-muted); margin-top:3px;">
                            Espaço: <strong class="text-cyan">${a.espaco || 'Musculação'}</strong> &bull; Plano ${a.plano} &bull; 🔥 ${a.treinos_mes || 12} treinos/mês &bull; Venc: ${a.vencimento.split('-').reverse().join('/')}
                        </div>
                    </div>
                </div>
                <div style="display:flex; gap:8px; align-items:center;">
                    <button class="btn-whats-direct-crm" onclick="enviarWhatsAppDiretoCRM(${a.id})" data-tip="Abrir conversa no WhatsApp com mensagem automática">
                        <span class="material-icons-round" style="font-size:15px;">chat</span> ${txtBotaoWhats}
                    </button>
                    <button class="btn-volt-sm" onclick="abrirModalRenovacaoRapida(${a.id})"><span class="material-icons-round" style="font-size:14px;">qr_code_2</span> RENOVAR</button>
                    <button class="btn-outline-cyan" style="padding:6px 10px;" onclick="abrirModalCadastroAluno(${a.id})"><span class="material-icons-round" style="font-size:15px;">edit</span></button>
                </div>
            </div>
        `;
    });
};

// 5. Conecta as novas chaves (#flag-musica, #flag-whats-d1, #flag-whats-pos1) nas Configurações
const carregarCfgOriginal21 = carregarInputsConfiguracoes;
carregarInputsConfiguracoes = function() {
    carregarCfgOriginal21();
    const f = CONFIG_HW.flags;
    const setChk = (id, v) => { const el = document.getElementById(id); if (el) el.checked = v ?? true; };
    setChk('flag-musica', f.musica ?? true);
    setChk('flag-whats-d1', f.whatsD1 ?? true);
    setChk('flag-whats-pos1', f.whatsPos1 ?? true);
};

const aplicarFlagsOriginal21 = aplicarFlagsModulos;
aplicarFlagsModulos = function(exibirAviso = true) {
    aplicarFlagsOriginal21(false);
    const getChk = (id) => { const el = document.getElementById(id); return el ? el.checked : true; };

    CONFIG_HW.flags.musica = getChk('flag-musica');
    CONFIG_HW.flags.whatsD1 = getChk('flag-whats-d1');
    CONFIG_HW.flags.whatsPos1 = getChk('flag-whats-pos1');

    const btnMusica = document.getElementById('btn-visor-musica');
    if (btnMusica) btnMusica.style.display = CONFIG_HW.flags.musica ? 'inline-flex' : 'none';

    const pillD1 = document.getElementById('pill-regua-d1');
    const pillPos1 = document.getElementById('pill-regua-pos1');
    if (pillD1) {
        pillD1.innerText = `🔔 Vence Amanhã: ${CONFIG_HW.flags.whatsD1 ? 'Ativo' : 'Off'}`;
        pillD1.className = CONFIG_HW.flags.whatsD1 ? 'pill-ok' : 'pill-err';
    }
    if (pillPos1) {
        pillPos1.innerText = `⚠️ Pós-Venc. (D+1): ${CONFIG_HW.flags.whatsPos1 ? 'Ativo' : 'Só Bloqueio'}`;
        pillPos1.className = CONFIG_HW.flags.whatsPos1 ? 'pill-ok' : 'pill-err';
    }

    salvarLocal();
    if (exibirAviso) mostrarToast("Módulos e Regras de WhatsApp atualizados!", "success");
};

// Remove qualquer atributo de tooltip do personagem e do equipamento
setTimeout(() => {
    document.querySelectorAll('.titan-hero-holo, .arena-holo-visual').forEach(el => {
        el.removeAttribute('data-tip');
        el.removeAttribute('title');
        el.onclick = null;
    });
    aplicarFlagsModulos(false);
}, 180);

// ==============================================================
// 22. RANKING TOP 3 MONSTROS DO MÊS + SIMETRIA DAS 4 CAIXAS
// ==============================================================
function atualizarBentoRankingETurma() {
    const rankEl = document.getElementById('bento-ranking-top3');
    if (rankEl && ALUNOS.length > 0) {
        const medalhas = ['🥇', '🥈', '🥉'];
        const top3 = [...ALUNOS]
            .sort((a, b) => (parseInt(b.treinos_mes) || 0) - (parseInt(a.treinos_mes) || 0))
            .slice(0, 3);

        rankEl.innerHTML = top3.map((atleta, idx) => {
            const primeiroUltimo = atleta.nome.split(' ');
            const nomeCurto = primeiroUltimo.length > 1 ? `${primeiroUltimo[0]} ${primeiroUltimo[1]}` : atleta.nome;
            return `
                <div class="podium-row">
                    <strong>${medalhas[idx]} ${nomeCurto}</strong>
                    <span>🔥 ${atleta.treinos_mes || 12}x</span>
                </div>
            `;
        }).join('');
    }

    // Atualiza aula/clima do salão conforme horário
    const elAula = document.getElementById('bento-aula-agora');
    if (elAula) {
        const hora = new Date().getHours();
        if (hora >= 18 && hora <= 20) elAula.innerText = 'Pico Hipertrofia + Aulão Funcional';
        else if (hora >= 11 && hora <= 14) elAula.innerText = 'Treino Almoço Express & Cardio';
        else elAula.innerText = 'Musculação Performance & Força';
    }

    // Garante que o título da lotação na esquerda nunca quebre linha
    const tituloLot = document.querySelector('.hw-title-txt');
    if (tituloLot) tituloLot.innerText = 'LOTAÇÃO SALÃO';
}

const exibirVisorSimetrico = exibirAlunoNoVisorSpotlight;
exibirAlunoNoVisorSpotlight = function(aluno, registrarGiro = true) {
    exibirVisorSimetrico(aluno, registrarGiro);
    if (!aluno) return;

    // Deixa a 4ª métrica (Jornada & Fidelidade) em 1 linha exata para igualar a altura das outras 3 caixas!
    const elFid = document.getElementById('concierge-fidelidade');
    if (elFid) {
        const meses = ((aluno.id % 9) + 3);
        const selo = aluno.plano === 'Anual Black' ? 'Black VIP' : (aluno.plano === 'Trimestral' ? 'Prime Gold' : 'Member Pro');
        elFid.innerText = `💎 ${meses} Meses • ${selo}`;
    }

    atualizarBentoRankingETurma();
};

setTimeout(() => {
    atualizarBentoRankingETurma();
    if (alunoNoVisorAtual) exibirAlunoNoVisorSpotlight(alunoNoVisorAtual, false);
}, 160);

// ==============================================================
// 23. META MENSAL CONFIGURÁVEL, BLOQUEIO DE GIROS/DIA E BLUETOOTH SALÃO
// ==============================================================
const ESTACOES_BLUETOOTH_GYM = [
    { nome: 'Phonk & Hardstyle Maromba', sub: 'ESTAÇÃO ATIVA • 128 BPM', mudo: false },
    { nome: 'Eletrônica HIIT & Cardio', sub: 'ALTA ENERGIA • 135 BPM', mudo: false },
    { nome: 'Hip-Hop Old School & Trap', sub: 'TREINO PESADO • 110 BPM', mudo: false },
    { nome: 'Som Ambiente Pausado', sub: 'BLUETOOTH EM STANDBY', mudo: true }
];
let estacaoBtIdx = 0;

// 1. Controlador do Novo Card Bluetooth na Bento Grid
window.alternarMusicaGym = function() {
    estacaoBtIdx = (estacaoBtIdx + 1) % ESTACOES_BLUETOOTH_GYM.length;
    const est = ESTACOES_BLUETOOTH_GYM[estacaoBtIdx];

    const txtNome = document.getElementById('txt-visor-musica');
    const txtSub = document.getElementById('bento-bt-estilo');
    const eqBars = document.getElementById('bt-eq-anim');
    const statusBt = document.getElementById('bento-bt-status');

    if (txtNome) {
        txtNome.innerText = est.nome;
        txtNome.className = est.mudo ? 'text-muted' : 'text-volt';
    }
    if (txtSub) txtSub.innerText = est.sub;
    if (eqBars) eqBars.classList.toggle('eq-muted', est.mudo);
    if (statusBt) {
        statusBt.innerText = est.mudo ? '● PAUSADO' : '● JBL PRO CONECTADO';
        statusBt.className = est.mudo ? 'bento-tag-purple' : 'bento-tag-volt';
    }
    mostrarToast(`🎵 Bluetooth Salão: ${est.nome}`, 'success');
};

// 2. Conta quantas passagens LIBERADAS o atleta já teve hoje
function contarPassagensLiberadasHoje(alunoId) {
    if (!alunoId) return 0;
    return GIROS_CATRACA.filter(g => String(g.aluno_id) === String(alunoId) && g.status_acesso === 'LIBERADO').length;
}

// 3. Conecta Meta Mensal Configurável + Limite de Giros Diários nas Configurações
const carregarCfgOriginal23 = carregarInputsConfiguracoes;
carregarInputsConfiguracoes = function() {
    carregarCfgOriginal23();
    const elMetaTr = document.getElementById('hw-meta-treinos');
    const elMaxGiros = document.getElementById('hw-max-giros-dia');
    const elFlagLim = document.getElementById('flag-limite-diario');

    if (elMetaTr) elMetaTr.value = CONFIG_HW.metaTreinosMes || 20;
    if (elMaxGiros) elMaxGiros.value = CONFIG_HW.maxGirosDia || 1;
    if (elFlagLim) elFlagLim.checked = CONFIG_HW.flags.limiteDiario ?? true;
};

const aplicarFlagsOriginal23 = aplicarFlagsModulos;
aplicarFlagsModulos = function(exibirAviso = true) {
    aplicarFlagsOriginal23(false);
    const chkLim = document.getElementById('flag-limite-diario');
    if (chkLim) CONFIG_HW.flags.limiteDiario = chkLim.checked;

    const cardBt = document.getElementById('card-bento-musica');
    if (cardBt) {
        cardBt.style.opacity = (CONFIG_HW.flags.musica ?? true) ? '1' : '0.4';
    }
    salvarLocal();
    if (exibirAviso) mostrarToast("Configurações e Módulos atualizados!", "success");
};

const salvarHwOriginal23 = salvarConfigHardware;
salvarConfigHardware = function() {
    CONFIG_HW.metaTreinosMes = Math.max(1, parseInt(document.getElementById('hw-meta-treinos')?.value) || 20);
    CONFIG_HW.maxGirosDia = Math.max(1, parseInt(document.getElementById('hw-max-giros-dia')?.value) || 1);
    salvarHwOriginal23();
    if (alunoNoVisorAtual) exibirAlunoNoVisorSpotlight(alunoNoVisorAtual, false);
};

// 4. Intercepta a Passagem na Catraca para Validar o Limite Diário (1x, 2x, 3x...) e Atualizar a Meta Mensal
const exibirVisorBase23 = exibirAlunoNoVisorSpotlight;
window.exibirAlunoNoVisorSpotlight = function(aluno, registrarGiro = true) {
    if (!aluno) return;

    const usarLimiteDiario = CONFIG_HW.flags.limiteDiario ?? true;
    const maxPermitidoDia = parseInt(CONFIG_HW.maxGirosDia) || 1;
    const girosJaFeitosHoje = contarPassagensLiberadasHoje(aluno.id);
    const infoMat = calcularStatusMatricula(aluno);

    // Verifica se o atleta está em dia, mas já atingiu o limite de passagens de hoje
    if (registrarGiro && !catracaPausadaGeral && !catracaModoLivreAlmoco && usarLimiteDiario && infoMat.status !== 'vencido' && girosJaFeitosHoje >= maxPermitidoDia) {
        // Exibe o atleta no visor sem dar novo giro liberado
        exibirVisorBase23(aluno, false);
        atualizarBarraMetaMensalConfiguravel(aluno);

        const horaAtual = new Date().toTimeString().substring(0, 5);
        const card = document.getElementById('spotlight-card');
        const banner = document.getElementById('spotlight-status-banner');
        const icon = document.getElementById('spotlight-status-icon');
        const txt = document.getElementById('spotlight-status-text');
        const elDias = document.getElementById('spotlight-dias');

        if (card) card.className = 'glass-card spotlight-card status-bloqueado';
        if (banner) banner.className = 'status-banner banner-bloqueado';
        if (icon) icon.innerText = 'block';
        if (txt) txt.innerText = `ACESSO RETIDO • LIMITE DIÁRIO ATINGIDO (${girosJaFeitosHoje}/${maxPermitidoDia} PASSAGEM HOJE)`;
        if (elDias) {
            elDias.innerText = `Bloqueado (${girosJaFeitosHoje}/${maxPermitidoDia} hoje)`;
            elDias.className = 'spot-value text-red';
        }

        GIROS_CATRACA.unshift({
            id: Date.now(),
            aluno_id: aluno.id,
            aluno_nome: aluno.nome,
            espaco: aluno.espaco || 'Musculação',
            plano: aluno.plano,
            status_acesso: 'BLOQUEADO',
            motivo: `Limite Diário (${maxPermitidoDia}x/dia)`,
            hora: horaAtual
        });

        falarRecepcao(`Atenção ${aluno.nome.split(' ')[0]}, limite de acesso diário atingido.`);
        salvarLocal();
        renderizarFeedGirosRecepcao();
        mostrarToast(`🚫 Catraca Bloqueada: ${aluno.nome} já passou ${girosJaFeitosHoje}x hoje (Limite: ${maxPermitidoDia}x/dia)!`, 'error');
        return;
    }

    // Fluxo normal caso esteja dentro do limite diário
    exibirVisorBase23(aluno, registrarGiro);
    atualizarBarraMetaMensalConfiguravel(aluno);
};

function atualizarBarraMetaMensalConfiguravel(aluno) {
    if (!aluno) return;
    const metaConfig = Math.max(1, parseInt(CONFIG_HW.metaTreinosMes) || 20);
    const treinos = parseInt(aluno.treinos_mes) || 12;
    const pct = Math.min(100, Math.round((treinos / metaConfig) * 100));
    const kcal = treinos * 310;

    const elLabel = document.getElementById('visor-label-meta-mensal');
    const elPct = document.getElementById('visor-meta-pct');
    const elBar = document.getElementById('visor-meta-bar');
    const elKcal = document.getElementById('visor-kcal-est');

    if (elLabel) elLabel.innerText = `META MENSAL (${metaConfig} TREINOS)`;
    if (elPct) elPct.innerText = `${pct}% (${treinos}/${metaConfig})`;
    if (elBar) elBar.style.width = `${pct}%`;
    if (elKcal) {
        elKcal.innerHTML = pct >= 100
            ? `<strong class="text-yellow">🏆 META BATIDA! (~${kcal.toLocaleString('pt-BR')} kcal)</strong>`
            : `⚡ ~${kcal.toLocaleString('pt-BR')} kcal queimadas no mês`;
    }
}

setTimeout(() => {
    carregarInputsConfiguracoes();
    if (alunoNoVisorAtual) atualizarBarraMetaMensalConfiguravel(alunoNoVisorAtual);
}, 200);

// ==============================================================
// 24. VITRINE DE MARCAS PARCEIRAS (GROWTH / WEPINK / CARIANI) + POPOVER TAG
// ==============================================================
const PARCEIROS_PADRAO_GYM = [
    { id: 'growth', icone: '🧪', nome: 'Growth Supplements', cupom: 'TITAN10', desc: '10% OFF Whey & Creatina no site oficial', cor: 'cyan', ativo: true },
    { id: 'wepink', icone: '💖', nome: 'WePink / Wellness', cupom: 'VIRGINIA15', desc: '15% OFF Linha Pós-Treino & Body Splash', cor: 'pink', ativo: true },
    { id: 'darklab', icone: '⚡', nome: 'Dark Lab Suplementos', cupom: 'DARKVIP', desc: 'Combo Pré-Treino + Taurina c/ Desconto', cor: 'gold', ativo: true },
    { id: 'ironberg', icone: '🏆', nome: 'Max Titanium / CT', cupom: 'CARIANI10', desc: 'Linha Pro Series para atletas assíduos', cor: 'volt', ativo: true },
    { id: 'pilates', icone: '🧘‍♀️', nome: 'Studio Pilates Parceiro', cupom: '1 AULA VIP', desc: '1 Sessão de Postura/Mobilidade p/ Alunos Black', cor: 'purple', ativo: false }
];

let PARCEIROS_GYM = JSON.parse(localStorage.getItem('titanParceirosGym')) || PARCEIROS_PADRAO_GYM;
let parceiroSelecionadoIdx = 0;

function salvarParceirosLocal() {
    localStorage.setItem('titanParceirosGym', JSON.stringify(PARCEIROS_GYM));
}

// 1. Renderiza a Vitrine de Marcas Parceiras e a Logo Co-Branding no Topo
window.renderizarBarraParceirosTopo = function() {
    const ribbon = document.getElementById('arena-sponsors-ribbon');
    if (!ribbon) return;

    const mostrarRibbon = CONFIG_HW.flags.parceiros ?? true;
    ribbon.style.display = mostrarRibbon ? 'flex' : 'none';

    // Nome curto e Logo da Academia (Co-Branding)
    const elNome = document.getElementById('ribbon-gym-name');
    const elLogo = document.getElementById('gym-custom-logo-box');
    if (elNome) elNome.innerText = CONFIG_HW.siglaAcademia || 'TITAN GYM';
    if (elLogo) {
        if (CONFIG_HW.logoAcademiaBase64) {
            elLogo.innerHTML = '';
            elLogo.style.backgroundImage = `url('${CONFIG_HW.logoAcademiaBase64}')`;
        } else {
            elLogo.style.backgroundImage = 'none';
            elLogo.innerHTML = `<span class="material-icons-round">fitness_center</span>`;
        }
    }

    const track = document.getElementById('ribbon-sponsors-list');
    if (!track) return;

    const ativos = PARCEIROS_GYM.filter(p => p.ativo);
    if (ativos.length === 0) {
        track.innerHTML = `<span style="font-size:10px; color:var(--text-muted);">Nenhuma marca ativa. Clique em "Parceiros" para ativar!</span>`;
        return;
    }

    track.innerHTML = ativos.map((p, idx) => `
        <div class="sponsor-pill-card sp-color-${p.cor || 'volt'}" onclick="selecionarParceiroDaBarra('${p.id}')" data-tip="Clique para selecionar ${p.nome} (${p.cupom}) e enviar ao atleta">
            <span style="font-size:15px;">${p.icone || '⭐'}</span>
            <div>
                <strong>${p.nome}</strong>
                <span>CUPOM: ${p.cupom}</span>
            </div>
        </div>
    `).join('');

    // Atualiza o texto do 3º botão tático (Mimo VIP)
    const parcAtual = ativos[parceiroSelecionadoIdx % ativos.length] || ativos[0];
    const txtBtn = document.getElementById('txt-btn-cupom-parceiro');
    if (txtBtn && parcAtual) {
        txtBtn.innerText = `${parcAtual.cupom}`;
    }
};

window.selecionarParceiroDaBarra = function(idParceiro) {
    const ativos = PARCEIROS_GYM.filter(p => p.ativo);
    const idx = ativos.findIndex(p => p.id === idParceiro);
    if (idx > -1) parceiroSelecionadoIdx = idx;
    const parc = ativos[idx] || ativos[0];
    renderizarBarraParceirosTopo();
    if (parc) {
        navigator.clipboard?.writeText(parc.cupom);
        mostrarToast(`🎁 Parceiro "${parc.nome}" selecionado! Cupom ${parc.cupom} copiado.`, 'success');
    }
};

// 2. Dispara o Cupom da Marca Parceira para o WhatsApp do Atleta no Visor
window.enviarCupomParceiroAtleta = function() {
    if (!alunoNoVisorAtual) return;
    const ativos = PARCEIROS_GYM.filter(p => p.ativo);
    const parc = ativos[parceiroSelecionadoIdx % ativos.length] || PARCEIROS_GYM[0];
    const a = alunoNoVisorAtual;

    const numLimpo = (a.whatsapp || '').replace(/\D/g, '');
    const fone = numLimpo.length >= 10 ? `55${numLimpo}` : '5571986030162';

    const msg = `🔥 Parabéns pela dedicação nos treinos, *${a.nome}*! Aqui é da *${CONFIG_HW.nomeAcademia}*.\n\nComo atleta VIP da nossa academia (${a.treinos_mes || 18} treinos no mês), você ganhou um benefício exclusivo no nosso parceiro oficial *${parc.icone} ${parc.nome}*:\n\n🎁 *CUPOM:* \`${parc.cupom}\`\n✨ *Vantagem:* ${parc.desc}\n\nContinue firme na meta! 💪`;

    window.open(`https://wa.me/${fone}?text=${encodeURIComponent(msg)}`, '_blank');
    mostrarToast(`Enviando cupom ${parc.cupom} (${parc.nome}) para ${a.nome}!`, 'success');
};

// 3. Modal de Gestão de Marcas Parceiras e Upload de Logo da Academia
window.abrirModalParceirosGym = function() {
    document.getElementById('input-sigla-academia').value = CONFIG_HW.siglaAcademia || 'TITAN GYM';
    const prev = document.getElementById('preview-logo-academia');
    if (prev && CONFIG_HW.logoAcademiaBase64) {
        prev.innerHTML = `<img src="${CONFIG_HW.logoAcademiaBase64}" style="width:100%; height:100%; object-fit:cover; border-radius:12px;">`;
    }
    renderizarGridParceirosModal();
    document.getElementById('modal-parceiros-gym')?.classList.add('active');
};

function renderizarGridParceirosModal() {
    const grid = document.getElementById('grid-marcas-parceiras-modal');
    if (!grid) return;
    grid.innerHTML = PARCEIROS_GYM.map((p, idx) => `
        <div onclick="alternarAtivoParceiro(${idx})" style="cursor:pointer; display:flex; justify-content:space-between; align-items:center; padding:10px 12px; border-radius:10px; background:${p.ativo ? 'rgba(0,245,155,0.08)' : 'rgba(0,0,0,0.4)'}; border:1px solid ${p.ativo ? 'var(--neon-volt)' : 'rgba(255,255,255,0.08)'};">
            <div style="display:flex; align-items:center; gap:10px;">
                <span style="font-size:20px;">${p.icone || '⭐'}</span>
                <div>
                    <strong style="font-size:12px; color:white; display:block;">${p.nome}</strong>
                    <span style="font-size:10px; color:var(--neon-cyan); font-family:monospace;">Cupom: ${p.cupom}</span>
                </div>
            </div>
            <span style="font-size:9px; font-weight:900; padding:3px 8px; border-radius:6px; background:${p.ativo ? 'var(--neon-volt)' : 'rgba(255,255,255,0.08)'}; color:${p.ativo ? '#04060b' : 'var(--text-muted)'};">
                ${p.ativo ? 'ATIVO NO TOPO' : 'OCULTO'}
            </span>
        </div>
    `).join('');
}

window.alternarAtivoParceiro = function(idx) {
    if (!PARCEIROS_GYM[idx]) return;
    PARCEIROS_GYM[idx].ativo = !PARCEIROS_GYM[idx].ativo;
    salvarParceirosLocal();
    renderizarGridParceirosModal();
    renderizarBarraParceirosTopo();
};

window.adicionarParceiroCustom = function() {
    const nome = document.getElementById('novo-parc-nome')?.value.trim();
    const cupom = document.getElementById('novo-parc-cupom')?.value.trim().toUpperCase();
    const cor = document.getElementById('novo-parc-cor')?.value || 'volt';
    if (!nome || !cupom) return mostrarToast("Preencha o nome da marca e o cupom!", "warning");

    PARCEIROS_GYM.unshift({
        id: 'custom_' + Date.now(),
        icone: '🤝',
        nome: nome,
        cupom: cupom,
        desc: `Benefício exclusivo para alunos ativos da academia`,
        cor: cor,
        ativo: true
    });

    document.getElementById('novo-parc-nome').value = '';
    document.getElementById('novo-parc-cupom').value = '';
    salvarParceirosLocal();
    renderizarGridParceirosModal();
    renderizarBarraParceirosTopo();
    mostrarToast(`Parceiro "${nome}" adicionado à vitrine do topo!`, 'success');
};

window.carregarLogoAcademia = function(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
        CONFIG_HW.logoAcademiaBase64 = e.target.result;
        const prev = document.getElementById('preview-logo-academia');
        if (prev) prev.innerHTML = `<img src="${CONFIG_HW.logoAcademiaBase64}" style="width:100%; height:100%; object-fit:cover; border-radius:12px;">`;
        salvarLocal();
        renderizarBarraParceirosTopo();
        mostrarToast("Logo comercial carregada com sucesso!", "success");
    };
    reader.readAsDataURL(file);
};

window.salvarCoBrandingParceiros = function() {
    const sigla = document.getElementById('input-sigla-academia')?.value.trim().toUpperCase();
    if (sigla) CONFIG_HW.siglaAcademia = sigla;
    salvarLocal();
    salvarParceirosLocal();
    renderizarBarraParceirosTopo();
    fecharTodosModais();
    mostrarToast("Vitrine de Marcas Parceiras e Co-Branding atualizada!", "success");
};

// 4. Controlador da Nova Caixinha Flutuante (Popover) de Tags
window.focarEditorTagVisor = function(idxTag = null) {
    const popover = document.getElementById('popover-tag-studio');
    const input = document.getElementById('visor-nota-rapida');
    const selIcone = document.getElementById('tag-icone-select');
    if (!popover || !input || !alunoNoVisorAtual) return;

    popover.classList.add('open');
    garantirArrayTags(alunoNoVisorAtual);

    if (idxTag !== null && alunoNoVisorAtual.tags_custom[idxTag]) {
        indiceTagEmEdicao = idxTag;
        const tag = alunoNoVisorAtual.tags_custom[idxTag];
        input.value = tag.texto;
        if (selIcone) selIcone.value = tag.icone || '🔑';
        const disp = document.getElementById('tag-icone-display');
        if (disp) disp.innerText = `${tag.icone || '🔑'} Tag`;
        corTagSelecionada = tag.cor || 'volt';
    } else {
        indiceTagEmEdicao = null;
        input.value = '';
    }

    atualizarContadorTag(input);
    setTimeout(() => input.focus(), 50);
};

window.fecharPopoverTag = function() {
    document.getElementById('popover-tag-studio')?.classList.remove('open');
    indiceTagEmEdicao = null;
};

// Fecha o Popover automaticamente após salvar a tag
const salvarTagOriginalPopover = window.salvarNotaRapidaVisor;
window.salvarNotaRapidaVisor = function() {
    salvarTagOriginalPopover();
    fecharPopoverTag();
};

// Conecta a chave #flag-parceiros nas Configurações
const carregarCfgOriginal24 = carregarInputsConfiguracoes;
carregarInputsConfiguracoes = function() {
    carregarCfgOriginal24();
    const chkParc = document.getElementById('flag-parceiros');
    if (chkParc) chkParc.checked = CONFIG_HW.flags.parceiros ?? true;
};

const aplicarFlagsOriginal24 = aplicarFlagsModulos;
aplicarFlagsModulos = function(exibirAviso = true) {
    aplicarFlagsOriginal24(false);
    const chkParc = document.getElementById('flag-parceiros');
    if (chkParc) CONFIG_HW.flags.parceiros = chkParc.checked;
    salvarLocal();
    renderizarBarraParceirosTopo();
    if (exibirAviso) mostrarToast("Módulos e Vitrine Comercial atualizados!", "success");
};

setTimeout(() => {
    renderizarBarraParceirosTopo();
}, 220);

// ==============================================================
// 25. POPOVER ANCORADO + VOUCHER META 20/20 + CARD STORIES INSTAGRAM
// ==============================================================

// 1. Abre o Popover ancorado exatamente embaixo do botão + TAG
window.focarEditorTagVisor = function(idxTag = null, event = null) {
    if (event) event.stopPropagation();
    const popover = document.getElementById('popover-tag-studio');
    const input = document.getElementById('visor-nota-rapida');
    const selIcone = document.getElementById('tag-icone-select');
    if (!popover || !input || !alunoNoVisorAtual) return;

    popover.classList.add('open');
    garantirArrayTags(alunoNoVisorAtual);

    if (idxTag !== null && alunoNoVisorAtual.tags_custom[idxTag]) {
        indiceTagEmEdicao = idxTag;
        const tag = alunoNoVisorAtual.tags_custom[idxTag];
        input.value = tag.texto;
        if (selIcone) selIcone.value = tag.icone || '🔑';
        const disp = document.getElementById('tag-icone-display');
        if (disp) disp.innerText = `${tag.icone || '🔑'} Tag`;
        corTagSelecionada = tag.cor || 'volt';
    } else {
        indiceTagEmEdicao = null;
        input.value = '';
    }

    atualizarContadorTag(input);
    setTimeout(() => input.focus(), 40);
};

// Fecha o Popover de Tag ao clicar fora dele
document.addEventListener('click', (e) => {
    if (!e.target.closest('.tag-trigger-anchor') && !e.target.closest('.custom-student-tag')) {
        fecharPopoverTag();
    }
});

// 2. Emitir Voucher de Recompensa quando o aluno bate a Meta Mensal (Cupom 80mm)
window.emitirVoucherMetaBatida = function() {
    if (!alunoNoVisorAtual) return;
    const a = alunoNoVisorAtual;
    const metaConfig = Math.max(1, parseInt(CONFIG_HW.metaTreinosMes) || 20);
    const treinos = parseInt(a.treinos_mes) || 12;

    const ativos = (typeof PARCEIROS_GYM !== 'undefined') ? PARCEIROS_GYM.filter(p => p.ativo) : [];
    const parc = ativos[parceiroSelecionadoIdx % Math.max(1, ativos.length)] || { nome: 'Growth Supplements', cupom: 'TITAN10' };

    document.getElementById('cupom-academia-nome').innerText = CONFIG_HW.nomeAcademia;
    document.getElementById('cupom-titulo-doc').innerText = "🏆 VOUCHER OFICIAL DE META & ASSIDUIDADE";
    document.getElementById('cupom-corpo-linhas').innerHTML = `
        <div><strong>ATLETA VIP:</strong> ${a.nome}</div>
        <div><strong>DESEMPENHO NO MÊS:</strong> 🔥 ${treinos} / ${metaConfig} Treinos</div>
        <div><strong>RECOMPENSA:</strong> ${treinos >= metaConfig ? 'META 100% CONCLUÍDA (VIP)' : 'BÔNUS DE INCENTIVO'}</div>
        <div><strong>PARCEIRO OFICIAL:</strong> ${parc.nome}</div>
        <div><strong>CÓDIGO / VOUCHER:</strong> ${parc.cupom}</div>
    `;
    document.getElementById('cupom-bloco-parq').style.display = 'none';
    document.getElementById('cupom-hash').innerText = `REWARD_ID: 0x${Math.random().toString(16).substring(2, 10).toUpperCase()}`;
    document.getElementById('cupom-datahora').innerText = new Date().toLocaleString('pt-BR');
    document.getElementById('modal-cupom-termico')?.classList.add('active');
};

// 3. Gerador de Card Stories do Atleta (9:16) para Instagram e WhatsApp
window.abrirModalStoriesAtleta = function() {
    if (!alunoNoVisorAtual) return;
    const a = alunoNoVisorAtual;
    const treinos = parseInt(a.treinos_mes) || 14;
    const kcal = treinos * 310;

    const ativos = (typeof PARCEIROS_GYM !== 'undefined') ? PARCEIROS_GYM.filter(p => p.ativo) : [];
    const parc = ativos[parceiroSelecionadoIdx % Math.max(1, ativos.length)] || { icone: '🧪', nome: 'GROWTH SUPPLEMENTS', cupom: 'TITAN10' };

    document.getElementById('ig-card-academia').innerText = CONFIG_HW.siglaAcademia || CONFIG_HW.nomeAcademia;
    document.getElementById('ig-card-data').innerText = new Date().toLocaleDateString('pt-BR');
    document.getElementById('ig-card-nome').innerText = a.nome;
    document.getElementById('ig-card-foco').innerText = `MODALIDADE: ${(a.espaco || 'MUSCULAÇÃO').toUpperCase()} • ${(a.objetivo || 'HIPERTROFIA').toUpperCase()}`;
    document.getElementById('ig-card-treinos').innerText = `🔥 ${treinos}`;
    document.getElementById('ig-card-kcal').innerText = `⚡ ${kcal.toLocaleString('pt-BR')} kcal`;
    document.getElementById('ig-card-nivel').innerText = a.plano === 'Anual Black' ? '💎 BLACK VIP' : '⚡ TITAN PRO';
    document.getElementById('ig-card-sponsor').innerHTML = `
        <span>PARCEIRO OFICIAL</span>
        <strong>${parc.icone || '⭐'} ${parc.nome.toUpperCase()} &bull; CUPOM: ${parc.cupom}</strong>
    `;

    const av = document.getElementById('ig-card-avatar');
    if (av) {
        if (a.foto_base64) {
            av.innerText = '';
            av.style.backgroundImage = `url('${a.foto_base64}')`;
        } else {
            av.style.backgroundImage = 'none';
            const partes = a.nome.trim().split(' ');
            av.innerText = partes.length > 1 ? (partes[0][0] + partes[partes.length - 1][0]) : a.nome.substring(0, 2);
        }
    }

    document.getElementById('modal-stories-atleta')?.classList.add('active');
};

window.compartilharStoriesWhatsApp = function() {
    if (!alunoNoVisorAtual) return;
    const a = alunoNoVisorAtual;
    const treinos = parseInt(a.treinos_mes) || 14;
    const kcal = treinos * 310;
    const ativos = (typeof PARCEIROS_GYM !== 'undefined') ? PARCEIROS_GYM.filter(p => p.ativo) : [];
    const parc = ativos[parceiroSelecionadoIdx % Math.max(1, ativos.length)] || { icone: '🧪', nome: 'Growth Supplements', cupom: 'TITAN10' };

    const numLimpo = (a.whatsapp || '').replace(/\D/g, '');
    const fone = numLimpo.length >= 10 ? `55${numLimpo}` : '5571986030162';

    const msg = `📸 *MEU RESUMO DE PERFORMANCE - ${CONFIG_HW.nomeAcademia}*\n\n🏋️ *Atleta:* ${a.nome}\n🔥 *Frequência no Mês:* ${treinos} Treinos Concluídos\n⚡ *Energia Queimada:* ~${kcal.toLocaleString('pt-BR')} kcal\n\n🎁 *Cupom Parceiro Desbloqueado:* \`${parc.cupom}\` (${parc.nome})\n\n_Poste nos seus Stories e marque a nossa academia!_ 💪`;
    window.open(`https://wa.me/${fone}?text=${encodeURIComponent(msg)}`, '_blank');
};

window.baixarCardStoriesPDF = async function() {
    const el = document.getElementById('stories-card-capture');
    if (!el || !alunoNoVisorAtual) return;
    await html2pdf().from(el).set({
        margin: 8,
        filename: `Stories_${alunoNoVisorAtual.nome.replace(/\s+/g, '_')}.pdf`,
        html2canvas: { scale: 2, backgroundColor: '#050811' },
        jsPDF: { unit: 'mm', format: [105, 165], orientation: 'portrait' }
    }).save();
    mostrarToast("Card Stories salvo com sucesso!", "success");
};

setTimeout(() => {
    if (alunoNoVisorAtual) renderizarPillsSemanaVisor(alunoNoVisorAtual);
}, 260);

// ==============================================================
// 26. VITRINE 4 PARCEIROS GRANDES + CUPOM OPCIONAL + DISPARO ZAP DIRETO
// ==============================================================
const MAX_PARCEIROS_ATIVOS = 4;

// Garante que no máximo 4 parceiros estejam ativos inicialmente
if (typeof PARCEIROS_GYM !== 'undefined') {
    let contAtivos = 0;
    PARCEIROS_GYM.forEach(p => {
        if (p.ativo) {
            contAtivos++;
            if (contAtivos > MAX_PARCEIROS_ATIVOS) p.ativo = false;
        }
    });
}

// 1. Renderiza o Nome da Academia no Topo + Os 4 Cards Grandes de Empresas Parceiras Abaixo
window.renderizarBarraParceirosTopo = function() {
    const elNome = document.getElementById('ribbon-gym-name');
    const elLogo = document.getElementById('gym-custom-logo-box');
    const elCounter = document.getElementById('badge-count-parceiros');

    // Por padrão exibe TITAN GYM OS (ou o nome personalizado pelo dono)
    const nomeExibido = CONFIG_HW.siglaAcademia || CONFIG_HW.nomeAcademia || 'TITAN GYM OS';
    if (elNome) elNome.innerText = nomeExibido;

    if (elLogo) {
        if (CONFIG_HW.logoAcademiaBase64) {
            elLogo.innerHTML = '';
            elLogo.style.backgroundImage = `url('${CONFIG_HW.logoAcademiaBase64}')`;
        } else {
            elLogo.style.backgroundImage = 'none';
            elLogo.innerHTML = `<span class="material-icons-round">fitness_center</span>`;
        }
    }

    const showcaseBox = document.getElementById('arena-sponsors-ribbon');
    const mostrarRibbon = CONFIG_HW.flags.parceiros ?? true;
    if (showcaseBox) showcaseBox.style.display = mostrarRibbon ? 'flex' : 'none';

    const track = document.getElementById('ribbon-sponsors-list');
    if (!track) return;

    const ativos = PARCEIROS_GYM.filter(p => p.ativo).slice(0, MAX_PARCEIROS_ATIVOS);
    if (elCounter) elCounter.innerText = `${ativos.length}/${MAX_PARCEIROS_ATIVOS} PARCEIROS`;

    if (ativos.length === 0) {
        track.innerHTML = `<div style="grid-column: 1 / -1; text-align:center; padding:8px; font-size:10.5px; color:var(--text-muted);">Nenhuma empresa parceira ativa. Clique em "Configurar Parceiros" para selecionar até 4 marcas!</div>`;
        return;
    }

    track.innerHTML = ativos.map(p => {
        const temCupom = p.cupom && p.cupom.trim() !== '';
        const textoCupom = temCupom ? `🎁 CUPOM: ${p.cupom}` : `✨ PARCEIRO OFICIAL`;
        return `
            <div class="partner-big-card sp-color-${p.cor || 'volt'}" onclick="dispararParceiroWhatsApp('${p.id}')" data-tip="Clique para enviar ${p.nome} direto para o WhatsApp do atleta no visor">
                <div class="partner-big-left">
                    <div class="partner-big-icon">${p.icone || '🏆'}</div>
                    <div class="partner-big-info">
                        <strong>${p.nome}</strong>
                        <span>${textoCupom}</span>
                    </div>
                </div>
                <button type="button" class="btn-partner-zap" onclick="event.stopPropagation(); dispararParceiroWhatsApp('${p.id}');">
                    <span class="material-icons-round" style="font-size:13px;">send</span> ZAP
                </button>
            </div>
        `;
    }).join('');
};

// 2. Dispara o Parceiro (Com ou Sem Cupom!) direto para o WhatsApp do Aluno no Visor
window.dispararParceiroWhatsApp = function(idParceiro) {
    if (!alunoNoVisorAtual) return;
    const a = alunoNoVisorAtual;
    const parc = PARCEIROS_GYM.find(p => p.id === idParceiro) || PARCEIROS_GYM[0];
    if (!parc) return;

    const ativos = PARCEIROS_GYM.filter(p => p.ativo);
    const idxAtivo = ativos.findIndex(p => p.id === idParceiro);
    if (idxAtivo > -1) parceiroSelecionadoIdx = idxAtivo;

    const numLimpo = (a.whatsapp || '').replace(/\D/g, '');
    const fone = numLimpo.length >= 10 ? `55${numLimpo}` : '5571986030162';
    const nomeGym = CONFIG_HW.siglaAcademia || CONFIG_HW.nomeAcademia || 'TITAN GYM OS';
    const temCupom = parc.cupom && parc.cupom.trim() !== '';

    let msg = '';
    if (temCupom) {
        navigator.clipboard?.writeText(parc.cupom);
        msg = `🔥 Parabéns pelo treino de hoje, *${a.nome}*! Aqui é da *${nomeGym}*.\n\nComo você é nosso atleta ativo (${a.treinos_mes || 18} treinos no mês), liberamos um cupom VIP na nossa empresa parceira *${parc.icone || '🏆'} ${parc.nome}*:\n\n🎁 *CUPOM EXCLUSIVO:* \`${parc.cupom}\`\n✨ *Benefício:* ${parc.desc || 'Desconto especial para alunos da academia'}\n\nAproveite e bom descanso pós-treino! 💪`;
    } else {
        msg = `🔥 Excelente treino hoje, *${a.nome}*! Aqui é da *${nomeGym}*.\n\nPassando para indicar nossa empresa parceira oficial *${parc.icone || '🏆'} ${parc.nome}*! Basta apresentar seu cadastro ativo da academia para ter atendimento e condições VIP de atleta.\n\nSeguimos juntos na evolução! 💪`;
    }

    window.open(`https://wa.me/${fone}?text=${encodeURIComponent(msg)}`, '_blank');
    mostrarToast(`📲 Enviando parceria "${parc.nome}" para o WhatsApp de ${a.nome}!`, 'success');
};

// 3. Limita a ativação em no máximo 4 empresas parceiras e permite cadastrar SEM cupom (opcional)
window.alternarAtivoParceiro = function(idx) {
    if (!PARCEIROS_GYM[idx]) return;
    const qtdAtivos = PARCEIROS_GYM.filter(p => p.ativo).length;

    if (!PARCEIROS_GYM[idx].ativo && qtdAtivos >= MAX_PARCEIROS_ATIVOS) {
        return mostrarToast(`Limite máximo de ${MAX_PARCEIROS_ATIVOS} parceiros no visor! Desative um antes de ativar outro.`, "warning");
    }

    PARCEIROS_GYM[idx].ativo = !PARCEIROS_GYM[idx].ativo;
    salvarParceirosLocal();
    if (typeof renderizarGridParceirosModal === 'function') renderizarGridParceirosModal();
    renderizarBarraParceirosTopo();
};

window.adicionarParceiroCustom = function() {
    const nome = document.getElementById('novo-parc-nome')?.value.trim();
    const cupom = (document.getElementById('novo-parc-cupom')?.value || '').trim().toUpperCase(); // Agora 100% Opcional!
    const cor = document.getElementById('novo-parc-cor')?.value || 'volt';

    if (!nome) return mostrarToast("Informe o nome da empresa parceira!", "warning");

    // Se já houver 4 ativos, desativa o último para entrar o novo nos 4 destaques
    const ativos = PARCEIROS_GYM.filter(p => p.ativo);
    if (ativos.length >= MAX_PARCEIROS_ATIVOS) {
        ativos[ativos.length - 1].ativo = false;
    }

    PARCEIROS_GYM.unshift({
        id: 'custom_' + Date.now(),
        icone: '🏆',
        nome: nome,
        cupom: cupom, // Pode ser vazio ("")
        desc: cupom ? `Cupom ${cupom} exclusivo para atletas` : `Parceiro Oficial Homologado`,
        cor: cor,
        ativo: true
    });

    document.getElementById('novo-parc-nome').value = '';
    document.getElementById('novo-parc-cupom').value = '';
    salvarParceirosLocal();
    if (typeof renderizarGridParceirosModal === 'function') renderizarGridParceirosModal();
    renderizarBarraParceirosTopo();
    mostrarToast(`Empresa "${nome}" adicionada à vitrine de 4 parceiros!`, 'success');
};

setTimeout(() => {
    renderizarBarraParceirosTopo();
}, 280);

// ==============================================================
// 27. VITRINE INSTITUCIONAL PURA (ZERO CUPOM) + BOAS-VINDAS DINÂMICO
// ==============================================================
const MARCAS_PRESTIGE_PADRAO = [
    { id: 'growth', icone: '🧪', nome: 'GROWTH SUPPLEMENTS', categoria: 'Suplementação Oficial', cor: 'cyan', ativo: true },
    { id: 'wepink', icone: '💖', nome: 'WEPINK WELLNESS', categoria: 'Beauty & Care Partner', cor: 'pink', ativo: true },
    { id: 'darklab', icone: '⚡', nome: 'DARK LAB PRO', categoria: 'High Performance', cor: 'gold', ativo: true },
    { id: 'ironberg', icone: '🏆', nome: 'MAX TITANIUM', categoria: 'Official Pro Series', cor: 'volt', ativo: true }
];

// Atualiza os parceiros antigos que tinham código de cupom para Categorias de Prestígio
PARCEIROS_GYM = MARCAS_PRESTIGE_PADRAO.map((padrao, i) => {
    const salvo = PARCEIROS_GYM[i];
    if (salvo && salvo.nome && !salvo.nome.includes('Growth') && !salvo.nome.includes('WePink')) {
        return {
            ...salvo,
            categoria: (salvo.cupom && salvo.cupom.length > 4) ? salvo.cupom : 'Parceiro Oficial'
        };
    }
    return padrao;
});
salvarParceirosLocal();

// 1. Renderiza o "SEJA BEM-VINDO À ACADEMIA..." + As 4 Placas Institucionais no Topo
window.renderizarBarraParceirosTopo = function() {
    const nomeAcademiaAtual = (CONFIG_HW.siglaAcademia || CONFIG_HW.nomeAcademia || 'ACADEMIA CORPO E MENTE').toUpperCase();

    // Atualiza a pílula de Boas-Vindas no topo esquerdo (se a catraca estiver em fluxo normal)
    const txtTopo = document.getElementById('txt-status-catraca-topo');
    if (txtTopo && !catracaPausadaGeral && !catracaModoLivreAlmoco) {
        txtTopo.innerHTML = `SEJA BEM-VINDO À <strong>${nomeAcademiaAtual}</strong> &bull; BIOMETRIA ATIVA`;
    }

    // Atualiza o emblema da Academia na Vitrine
    const elNome = document.getElementById('ribbon-gym-name');
    const elLogo = document.getElementById('gym-custom-logo-box');
    if (elNome) elNome.innerText = nomeAcademiaAtual.replace('ACADEMIA ', '');

    if (elLogo) {
        if (CONFIG_HW.logoAcademiaBase64) {
            elLogo.innerHTML = '';
            elLogo.style.backgroundImage = `url('${CONFIG_HW.logoAcademiaBase64}')`;
        } else {
            elLogo.style.backgroundImage = 'none';
            elLogo.innerHTML = `<span class="material-icons-round">fitness_center</span>`;
        }
    }

    const dock = document.getElementById('arena-sponsors-ribbon');
    if (dock) {
        dock.style.display = (CONFIG_HW.flags.parceiros ?? true) ? 'flex' : 'none';
    }

    const row = document.getElementById('ribbon-sponsors-list');
    if (!row) return;

    const ativos = PARCEIROS_GYM.filter(p => p.ativo).slice(0, 4);
    row.innerHTML = ativos.map(p => {
        const subtitulo = p.categoria || 'Parceiro Oficial';
        return `
            <div class="prestige-brand-tile tile-${p.cor || 'volt'}">
                <div class="prestige-brand-emblem">${p.icone || '🏆'}</div>
                <div class="prestige-brand-text">
                    <strong>${p.nome}</strong>
                    <span>${subtitulo}</span>
                </div>
            </div>
        `;
    }).join('');
};

// 2. Atualiza o Modal de Parceiros para mostrar a Categoria Institucional (Sem texto de Cupom)
window.renderizarGridParceirosModal = function() {
    const grid = document.getElementById('grid-marcas-parceiras-modal');
    if (!grid) return;
    grid.innerHTML = PARCEIROS_GYM.map((p, idx) => `
        <div onclick="alternarAtivoParceiro(${idx})" style="cursor:pointer; display:flex; justify-content:space-between; align-items:center; padding:10px 12px; border-radius:10px; background:${p.ativo ? 'rgba(0,245,155,0.08)' : 'rgba(0,0,0,0.4)'}; border:1px solid ${p.ativo ? 'var(--neon-volt)' : 'rgba(255,255,255,0.08)'};">
            <div style="display:flex; align-items:center; gap:10px;">
                <span style="font-size:20px;">${p.icone || '🏆'}</span>
                <div>
                    <strong style="font-size:12px; color:white; display:block;">${p.nome}</strong>
                    <span style="font-size:10px; color:var(--neon-cyan);">${p.categoria || 'Parceiro Oficial'}</span>
                </div>
            </div>
            <span style="font-size:9px; font-weight:900; padding:3px 8px; border-radius:6px; background:${p.ativo ? 'var(--neon-volt)' : 'rgba(255,255,255,0.08)'}; color:${p.ativo ? '#04060b' : 'var(--text-muted)'};">
                ${p.ativo ? 'EXIBINDO NO TOPO' : 'OCULTO'}
            </span>
        </div>
    `).join('');
};

window.adicionarParceiroCustom = function() {
    const nome = document.getElementById('novo-parc-nome')?.value.trim().toUpperCase();
    const categoria = document.getElementById('novo-parc-cupom')?.value.trim() || 'Parceiro Oficial';
    const cor = document.getElementById('novo-parc-cor')?.value || 'volt';

    if (!nome) return mostrarToast("Informe o nome da marca patrocinadora!", "warning");

    const ativos = PARCEIROS_GYM.filter(p => p.ativo);
    if (ativos.length >= 4) ativos[ativos.length - 1].ativo = false;

    PARCEIROS_GYM.unshift({
        id: 'brand_' + Date.now(),
        icone: '🏆',
        nome: nome,
        categoria: categoria,
        cor: cor,
        ativo: true
    });

    document.getElementById('novo-parc-nome').value = '';
    document.getElementById('novo-parc-cupom').value = '';
    salvarParceirosLocal();
    renderizarGridParceirosModal();
    renderizarBarraParceirosTopo();
    mostrarToast(`Marca "${nome}" adicionada à Vitrine Oficial!`, 'success');
};

setTimeout(() => {
    renderizarBarraParceirosTopo();
}, 300);
