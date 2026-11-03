// Lista de tarefas: tela pronta do Projeto 3 (Programador Mobile).
//
// Você não precisa mudar este arquivo. Ele importa as SUAS funções e classes de src/,
// desenha a lista e chama os seus métodos quando você clica. A tela cresce com o
// projeto: a cada etapa pronta, uma parte nova passa a funcionar. Se algo sair
// errado, o problema está no seu código: escreva um teste para o caso e corrija lá.
//
// Abra com o servidor, na raiz do repositório: npx serve . e http://localhost:3000/web/

// O "hoje" fixo dos exemplos do enunciado, o mesmo dos seus testes: 10 de novembro de 2026.
const HOJE_DOS_EXEMPLOS = new Date(2026, 10, 10);

const ARQUIVOS = {
  datas: '../src/utils/datas.js',
  prazos: '../src/regras/prazos.js',
  tarefa: '../src/modelos/Tarefa.js',
  recorrente: '../src/modelos/TarefaRecorrente.js',
  lista: '../src/modelos/ListaDeTarefas.js',
  erro: '../src/modelos/ErroDeTarefa.js',
  armazenamento: '../src/servicos/armazenamento.js',
  exemplos: '../src/servicos/exemplos.js',
};

const ROTULOS = { alta: 'Alta', media: 'Média', baixa: 'Baixa' };
const PRIORIDADES = ['alta', 'media', 'baixa'];
const SITUACOES = ['atrasada', 'vence-hoje', 'em-dia', 'sem-prazo', 'concluida'];
const CHAVE_PADRAO = 'lista-de-tarefas';

// Ícones do lucide, desenhados com traço.
const ICONES = {
  ok: '<circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" />',
  falta: '<circle cx="12" cy="12" r="10" />',
  errado: '<circle cx="12" cy="12" r="10" /><path d="M12 8v4" /><path d="M12 16h.01" />',
  concluir: '<path d="M20 6 9 17l-5-5" />',
  remover: '<path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />',
};

// ---------------------------------------------------------------- elementos da página

const $ = (seletor) => document.querySelector(seletor);

const aviso = $('#aviso');
const avisoTitulo = $('#aviso-titulo');
const avisoTexto = $('#aviso-texto');
const status = $('#status');
const formulario = $('#formulario');
const campos = $('#campos');
const notaFormulario = $('#nota-formulario');
const erroFormulario = $('#erro-formulario');
const campoTitulo = $('#titulo');
const campoPrioridade = $('#prioridade');
const campoPrazo = $('#prazo');
const campoFrequencia = $('#frequencia');
const listaNaTela = $('#lista');
const vazio = $('#vazio');
const resumo = $('#resumo');
const notaLista = $('#nota-lista');
const filtro = $('#filtro');
const botaoImportar = $('#importar');
const statusImportacao = $('#status-importacao');
const etapasNaTela = $('#etapas');

const CAMPOS_COM_ERRO = {
  titulo: [campoTitulo, $('#erro-titulo')],
  prioridade: [campoPrioridade, $('#erro-prioridade')],
  prazo: [campoPrazo, $('#erro-prazo')],
};

// ---------------------------------------------------------------- estado da tela

const modulos = {}; // nome -> o que o arquivo exporta
const falhas = {}; // nome -> mensagem do navegador, quando o arquivo não carregou
let modo = 'kit'; // 'kit' | 'funcoes' | 'tarefa' | 'lista'
let tarefasSoltas = []; // modo 'funcoes' (objetos) e 'tarefa' (instâncias da sua Tarefa)
let lista = null; // modo 'lista': a sua ListaDeTarefas
let erroAtual = null; // um erro inesperado do seu código, mostrado no aviso
let avisoDasEtapas = null; // o que falta, calculado pela lista "O que a página usa"
let salvamentos = 0; // quantos salvarTarefas ainda não terminaram

// ---------------------------------------------------------------- ajudantes

function icone(nome) {
  return `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true">${ICONES[nome]}</svg>`;
}

function criar(tag, texto, classe) {
  const elemento = document.createElement(tag);
  if (texto !== undefined) elemento.textContent = texto;
  if (classe) elemento.className = classe;
  return elemento;
}

// Mostra um valor do jeito que ele aparece no código: 'texto', 42, null, { campo: 1 }.
function comoCodigo(valor, profundidade = 0) {
  if (typeof valor === 'string') return `'${valor}'`;
  if (valor === null || valor === undefined) return String(valor);
  if (typeof valor === 'function') return `function ${valor.name || ''}`.trim();
  if (Array.isArray(valor)) {
    if (profundidade > 1) return '[...]';
    return `[${valor.map((v) => comoCodigo(v, profundidade + 1)).join(', ')}]`;
  }
  if (typeof valor === 'object') {
    if (profundidade > 1) return '{...}';
    const nome = valor.constructor && valor.constructor !== Object ? `${valor.constructor.name} ` : '';
    const campos = Object.entries(valor).map(([k, v]) => `${k}: ${comoCodigo(v, profundidade + 1)}`);
    return `${nome}{ ${campos.join(', ')} }`;
  }
  return String(valor);
}

function iguais(a, b) {
  if (a === b) return true;
  if (typeof a !== 'object' || typeof b !== 'object' || a === null || b === null) return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  const chavesA = Object.keys(a);
  const chavesB = Object.keys(b);
  if (chavesA.length !== chavesB.length) return false;
  return chavesA.every((k) => iguais(a[k], b[k]));
}

function mensagem(erro) {
  return erro && erro.message ? erro.message : String(erro);
}

function ehErroDeTarefa(erro) {
  return erro !== null && typeof erro === 'object' && erro.name === 'ErroDeTarefa';
}

function plural(n, um, varios) {
  return `${n} ${n === 1 ? um : varios}`;
}

function dataBr(prazo) {
  const [ano, mes, dia] = String(prazo).split('-');
  return `${dia}/${mes}/${ano}`;
}

// Chama o seu código; se ele lançar um erro, a mensagem diz qual chamada foi.
function chamar(descricao, executar) {
  try {
    return executar();
  } catch (erro) {
    throw new Error(`${descricao} lançou um erro: ${mensagem(erro)}`, { cause: erro });
  }
}

// O que a página procura em cada classe: métodos e gets, também os herdados.
function descritor(Classe, nome) {
  let prototipo = Classe.prototype;
  while (prototipo && prototipo !== Object.prototype) {
    const d = Object.getOwnPropertyDescriptor(prototipo, nome);
    if (d) return d;
    prototipo = Object.getPrototypeOf(prototipo);
  }
  return null;
}

function temMetodo(Classe, nome) {
  const d = descritor(Classe, nome);
  return d !== null && typeof d.value === 'function';
}

function temGet(Classe, nome) {
  const d = descritor(Classe, nome);
  return d !== null && typeof d.get === 'function';
}

function exportado(modulo, nome) {
  const valor = modulos[modulo] ? modulos[modulo][nome] : undefined;
  return typeof valor === 'function' ? valor : null;
}

// ---------------------------------------------------------------- avisos

function mostrarAviso({ titulo, paragrafos, detalhe, problema }) {
  avisoTitulo.textContent = titulo;
  avisoTexto.replaceChildren();
  for (const texto of paragrafos) avisoTexto.append(criar('p', texto));
  if (detalhe) {
    const p = criar('p');
    p.append('Mensagem do navegador: ', criar('code', detalhe));
    avisoTexto.append(p);
  }
  aviso.classList.toggle('problema', Boolean(problema));
  aviso.hidden = false;
}

function atualizarAviso() {
  const falhou = Object.keys(falhas)[0];
  if (erroAtual) {
    mostrarAviso(erroAtual);
  } else if (falhou) {
    mostrarAviso({
      titulo: `Não deu para importar ${ARQUIVOS[falhou].slice(3)}`,
      paragrafos: [
        "Confira os imports desse arquivo e dos que ele importa: o nome, letra por letra, e o .js no fim ('./Tarefa.js', e não './Tarefa'). O Jest aceita sem o .js; o navegador, não.",
        'Confira também o export de cada nome importado. Um erro de sintaxe aparece no npm test, com a linha.',
        'O servidor precisa ter sido aberto na raiz do repositório (a pasta do package.json), e não dentro de web/.',
      ],
      detalhe: falhas[falhou],
      problema: true,
    });
  } else if (avisoDasEtapas) {
    mostrarAviso(avisoDasEtapas);
  } else {
    aviso.hidden = true;
  }
}

function erroInesperado(descricao, erro) {
  console.error(erro);
  erroAtual = {
    titulo: 'O seu código lançou um erro inesperado',
    paragrafos: [
      descricao ? `${descricao}: ${mensagem(erro)}` : mensagem(erro),
      'Escreva um teste com esse caso, veja o vermelho e corrija. O Console do navegador (F12) mostra a linha do erro.',
    ],
    problema: true,
  };
  atualizarAviso();
  aviso.scrollIntoView({ block: 'nearest' });
}

function tudoCerto() {
  if (erroAtual) {
    erroAtual = null;
    atualizarAviso();
  }
}

// ---------------------------------------------------------------- carregar o seu código

async function importarTudo() {
  for (const [nome, caminho] of Object.entries(ARQUIVOS)) {
    try {
      modulos[nome] = await import(caminho);
    } catch (erro) {
      modulos[nome] = {};
      falhas[nome] = mensagem(erro);
    }
  }
}

// A tela usa uma parte só quando ela tem tudo de que precisa (só a existência;
// se os resultados batem com o enunciado, quem diz é a lista "O que a página usa").
function decidirModo() {
  if (!exportado('prazos', 'pesoDaPrioridade') || !exportado('prazos', 'situacaoDoPrazo')) {
    return 'kit';
  }
  const Tarefa = exportado('tarefa', 'default');
  const tarefaCompleta =
    Tarefa &&
    ['concluir', 'situacao', 'prazoEmTexto'].every((m) => temMetodo(Tarefa, m)) &&
    ['rotuloDaPrioridade', 'peso'].every((g) => temGet(Tarefa, g));
  if (!tarefaCompleta) return 'funcoes';
  const Lista = exportado('lista', 'default');
  const listaCompleta =
    Lista &&
    exportado('lista', 'criarTarefa') &&
    exportado('recorrente', 'default') &&
    ['adicionar', 'buscar', 'concluir', 'remover'].every((m) => temMetodo(Lista, m));
  if (!listaCompleta) return 'tarefa';
  return 'lista';
}

// Tarefas de demonstração, com prazos perto do dia de hoje.
function tarefasDeDemonstracao() {
  const { paraPrazo, somarDias } = modulos.datas;
  const hoje = paraPrazo(new Date());
  const dia = (n) => somarDias(hoje, n);
  return [
    { titulo: 'Pagar a conta de luz', prioridade: 'alta', prazo: dia(-2) },
    { titulo: 'Regar as plantas', prioridade: 'media', prazo: dia(0), frequencia: 'semanal' },
    { titulo: 'Ligar para o técnico da geladeira', prioridade: 'baixa', prazo: dia(1) },
    { titulo: 'Estudar para a prova', prioridade: 'alta', prazo: dia(5) },
    { titulo: 'Comprar ração do gato', prioridade: 'media', prazo: null },
    { titulo: 'Separar roupas para doação', prioridade: 'baixa', prazo: null, concluida: true },
  ];
}

function listaDeDemonstracao() {
  const ListaDeTarefas = modulos.lista.default;
  const criarTarefa = modulos.lista.criarTarefa;
  const nova = chamar('new ListaDeTarefas()', () => new ListaDeTarefas());
  for (const dados of tarefasDeDemonstracao()) {
    chamar(`lista.adicionar(criarTarefa(${comoCodigo(dados)}))`, () =>
      nova.adicionar(criarTarefa(dados)),
    );
  }
  return nova;
}

function exigirLista(valor, quem) {
  if (!valor || typeof valor !== 'object' || !Array.isArray(valor.tarefas)) {
    throw new Error(
      `${quem} devolveu ${comoCodigo(valor)}; o esperado é uma ListaDeTarefas, com as tarefas em this.tarefas.`,
    );
  }
  return valor;
}

async function prepararDados() {
  if (modo === 'funcoes') {
    tarefasSoltas = tarefasDeDemonstracao();
    return;
  }
  if (modo === 'tarefa') {
    const Tarefa = modulos.tarefa.default;
    tarefasSoltas = tarefasDeDemonstracao().map((dados) =>
      chamar(`new Tarefa(${comoCodigo(dados)})`, () => new Tarefa(dados)),
    );
    return;
  }
  if (modo !== 'lista') return;

  const carregarTarefas = exportado('armazenamento', 'carregarTarefas');
  if (!carregarTarefas) {
    lista = listaDeDemonstracao();
    return;
  }
  status.textContent = 'Carregando...';
  try {
    lista = exigirLista(await carregarTarefas(localStorage), 'carregarTarefas(localStorage)');
    status.textContent = 'Tarefas carregadas.';
  } catch (erro) {
    lista = listaDeDemonstracao();
    status.textContent = 'Não deu para carregar: a lista começou com as tarefas de demonstração.';
    erroInesperado('carregarTarefas(localStorage)', erro);
  }
}

// ---------------------------------------------------------------- desenhar a lista

function vistaDosDados(dados, id, hoje) {
  const { pesoDaPrioridade, situacaoDoPrazo, textoDoPrazo } = modulos.prazos;
  const vista = {
    id,
    titulo: dados.titulo,
    prioridade: dados.prioridade,
    rotulo: ROTULOS[dados.prioridade],
    prazo: dados.prazo,
    concluida: dados.concluida === true,
    repete: null,
  };
  vista.peso = chamar(`pesoDaPrioridade('${dados.prioridade}')`, () =>
    pesoDaPrioridade(dados.prioridade),
  );
  if (vista.concluida) {
    vista.situacao = 'concluida';
    vista.texto = 'Concluída';
    return vista;
  }
  const argumentos = `${comoCodigo(dados.prazo)}, hoje`;
  vista.situacao = chamar(`situacaoDoPrazo(${argumentos})`, () =>
    situacaoDoPrazo(dados.prazo, hoje),
  );
  if (typeof textoDoPrazo === 'function') {
    vista.texto = chamar(`textoDoPrazo(${argumentos})`, () => textoDoPrazo(dados.prazo, hoje));
  } else {
    vista.texto = dados.prazo === null ? 'Sem prazo' : `Prazo: ${dataBr(dados.prazo)}`;
  }
  return vista;
}

function vistaDaTarefa(tarefa, id, hoje) {
  const de = `da tarefa '${tarefa.titulo}'`;
  return {
    id,
    titulo: tarefa.titulo,
    prioridade: tarefa.prioridade,
    prazo: tarefa.prazo,
    concluida: tarefa.concluida === true,
    rotulo: chamar(`rotuloDaPrioridade ${de}`, () => tarefa.rotuloDaPrioridade),
    peso: chamar(`peso ${de}`, () => tarefa.peso),
    situacao: chamar(`situacao(hoje) ${de}`, () => tarefa.situacao(hoje)),
    texto: chamar(`prazoEmTexto(hoje) ${de}`, () => tarefa.prazoEmTexto(hoje)),
    repete: tarefa.frequencia ? (tarefa.frequencia === 'diaria' ? 'Todo dia' : 'Toda semana') : null,
  };
}

function vistas(hoje) {
  if (modo === 'funcoes') return tarefasSoltas.map((dados, i) => vistaDosDados(dados, i, hoje));
  if (modo === 'tarefa') return tarefasSoltas.map((t, i) => vistaDaTarefa(t, i, hoje));
  if (modo === 'lista') {
    exigirLista(lista, 'A sua ListaDeTarefas');
    return lista.tarefas.map((t) => vistaDaTarefa(t, t.id, hoje));
  }
  return [];
}

// Ordem de urgência: pendentes antes; atrasadas, hoje, em dia e sem prazo; o prazo mais
// cedo; a prioridade com mais peso; o título em ordem alfabética.
const ORDEM = { atrasada: 0, 'vence-hoje': 1, 'em-dia': 2, 'sem-prazo': 3, concluida: 4 };

function compararPorUrgencia(a, b) {
  if (a.concluida !== b.concluida) return a.concluida ? 1 : -1;
  const oa = ORDEM[a.situacao] ?? 5;
  const ob = ORDEM[b.situacao] ?? 5;
  if (oa !== ob) return oa - ob;
  if (a.prazo !== b.prazo) {
    if (!a.prazo) return 1;
    if (!b.prazo) return -1;
    return String(a.prazo).localeCompare(String(b.prazo));
  }
  const pa = Number(a.peso) || 0;
  const pb = Number(b.peso) || 0;
  if (pa !== pb) return pb - pa;
  return String(a.titulo).localeCompare(String(b.titulo), 'pt-BR');
}

function passaNoFiltro(vista) {
  switch (filtro.value) {
    case 'pendentes':
      return !vista.concluida;
    case 'atrasadas':
      return !vista.concluida && vista.situacao === 'atrasada';
    case 'concluidas':
      return vista.concluida;
    default:
      return true;
  }
}

function desenharItem(vista) {
  const item = criar('li', undefined, 'tarefa');
  if (PRIORIDADES.includes(vista.prioridade)) item.classList.add(`prioridade-${vista.prioridade}`);
  if (SITUACOES.includes(vista.situacao)) item.classList.add(vista.situacao);

  const info = criar('div', undefined, 'tarefa-info');
  info.append(criar('p', String(vista.titulo), 'tarefa-titulo'));
  const detalhes = criar('p', undefined, 'tarefa-detalhes');
  detalhes.append(criar('span', String(vista.rotulo ?? vista.prioridade), 'selo'));
  detalhes.append(criar('span', String(vista.texto), 'prazo'));
  if (vista.repete) detalhes.append(criar('span', vista.repete, 'selo selo-repete'));
  info.append(detalhes);
  item.append(info);

  const acoes = criar('div', undefined, 'tarefa-acoes');
  if (!vista.concluida && (modo === 'tarefa' || modo === 'lista')) {
    acoes.append(botaoDaTarefa('concluir', 'Concluir', vista));
  }
  if (modo === 'lista') acoes.append(botaoDaTarefa('remover', 'Remover', vista));
  if (acoes.children.length > 0) item.append(acoes);
  return item;
}

function botaoDaTarefa(acao, texto, vista) {
  const botao = criar('button', undefined, `botao-${acao}`);
  botao.type = 'button';
  botao.dataset.acao = acao;
  botao.dataset.id = String(vista.id);
  botao.innerHTML = icone(acao);
  botao.append(texto);
  botao.setAttribute('aria-label', `${texto}: ${vista.titulo}`);
  return botao;
}

const NOTAS_DA_LISTA = {
  funcoes:
    'Tarefas de demonstração, com o prazo e o peso calculados pelas suas funções de src/regras/prazos.js. O botão Concluir chega com a classe Tarefa (etapa 2).',
  tarefa:
    'Tarefas de demonstração, agora feitas com a sua classe Tarefa: o Concluir funciona. Remover, o formulário e a tarefa que se repete chegam com a ListaDeTarefas (etapa 3).',
};

function desenhar() {
  const hoje = new Date();
  let todas = [];
  try {
    todas = vistas(hoje);
  } catch (erro) {
    erroInesperado('', erro);
  }
  const visiveis = todas.filter(passaNoFiltro).sort(compararPorUrgencia);

  listaNaTela.replaceChildren(...visiveis.map(desenharItem));

  if (modo === 'kit') {
    vazio.textContent =
      'A lista aparece quando src/regras/prazos.js tiver pesoDaPrioridade e situacaoDoPrazo (etapa 1).';
  } else if (todas.length === 0) {
    vazio.textContent = 'Nenhuma tarefa por aqui. Escreva uma nova ou importe os exemplos.';
  } else {
    vazio.textContent = 'Nenhuma tarefa neste filtro.';
  }
  vazio.hidden = visiveis.length > 0;

  notaLista.textContent = NOTAS_DA_LISTA[modo] ?? '';
  notaLista.hidden = !NOTAS_DA_LISTA[modo];
  filtro.disabled = modo === 'kit';

  desenharResumo(hoje);
  desenharFormulario();
  desenharImportar();
}

function desenharResumo(hoje) {
  resumo.textContent = '';
  if (modo !== 'lista') return;
  if (typeof lista.resumo !== 'function') {
    resumo.textContent = 'O resumo aparece com o método resumo(hoje).';
    return;
  }
  try {
    const r = chamar('lista.resumo(hoje)', () => lista.resumo(hoje));
    const numeros = r && ['pendentes', 'atrasadas', 'concluidas'].every((k) => Number.isInteger(r[k]));
    if (!numeros) {
      resumo.textContent = `resumo(hoje) devolveu ${comoCodigo(r)}; o esperado é { pendentes, atrasadas, concluidas }.`;
      return;
    }
    resumo.textContent = [
      plural(r.pendentes, 'pendente', 'pendentes'),
      plural(r.atrasadas, 'atrasada', 'atrasadas'),
      plural(r.concluidas, 'concluída', 'concluídas'),
    ].join(' · ');
  } catch (erro) {
    resumo.textContent = mensagem(erro);
  }
}

function desenharFormulario() {
  const ligado = modo === 'lista';
  campos.disabled = !ligado;
  notaFormulario.textContent = ligado
    ? ''
    : 'O formulário funciona com a ListaDeTarefas e o criarTarefa (etapa 3).';
  notaFormulario.hidden = ligado;
}

function desenharImportar() {
  if (botaoImportar.dataset.ocupado === 'sim') return;
  let motivo = '';
  if (modo !== 'lista') motivo = 'Funciona com a ListaDeTarefas (etapa 3) e o importar (etapa 4).';
  else if (typeof lista.importar !== 'function') motivo = 'Falta o método importar da ListaDeTarefas (etapa 4).';
  else if (!exportado('exemplos', 'buscarExemplos')) motivo = 'Chega na etapa 6: falta buscarExemplos em src/servicos/exemplos.js.';
  botaoImportar.disabled = motivo !== '';
  if (motivo) {
    statusImportacao.textContent = motivo;
    statusImportacao.classList.remove('problema');
  } else if (statusImportacao.dataset.dePedido !== 'sim') {
    statusImportacao.textContent = '';
  }
}

// ---------------------------------------------------------------- salvar

async function salvar() {
  if (modo !== 'lista') return;
  const salvarTarefas = exportado('armazenamento', 'salvarTarefas');
  const temCarregar = exportado('armazenamento', 'carregarTarefas') !== null;
  if (!salvarTarefas) {
    status.textContent = 'Sem salvar: ao recarregar, a lista volta ao começo (etapa 5).';
    return;
  }
  salvamentos += 1;
  status.textContent = 'Salvando...';
  let deuCerto = true;
  try {
    await salvarTarefas(lista, localStorage);
  } catch (erro) {
    deuCerto = false;
    status.textContent = 'Não deu para salvar.';
    erroInesperado('salvarTarefas(lista, localStorage)', erro);
  } finally {
    salvamentos -= 1;
  }
  if (deuCerto && salvamentos === 0) {
    status.textContent = temCarregar
      ? 'Tudo salvo.'
      : 'Salvo. Ao recarregar, a lista ainda volta ao começo: falta carregarTarefas.';
  }
}

// ---------------------------------------------------------------- ações

function limparErrosDosCampos() {
  erroFormulario.hidden = true;
  for (const [campo, erro] of Object.values(CAMPOS_COM_ERRO)) {
    erro.hidden = true;
    campo.removeAttribute('aria-invalid');
  }
}

function mostrarErroDaTarefa(erro) {
  const alvo = CAMPOS_COM_ERRO[erro.campo];
  const [campo, lugar] = alvo ?? [null, erroFormulario];
  lugar.innerHTML = icone('errado');
  lugar.append(criar('span', erro.message));
  lugar.hidden = false;
  if (campo) {
    campo.setAttribute('aria-invalid', 'true');
    campo.focus();
  }
}

formulario.addEventListener('submit', async (evento) => {
  evento.preventDefault();
  if (modo !== 'lista') return;
  limparErrosDosCampos();
  const dados = {
    titulo: campoTitulo.value,
    prioridade: campoPrioridade.value,
    prazo: campoPrazo.value === '' ? null : campoPrazo.value,
  };
  if (campoFrequencia.value !== '') dados.frequencia = campoFrequencia.value;

  try {
    lista.adicionar(modulos.lista.criarTarefa(dados));
  } catch (erro) {
    if (ehErroDeTarefa(erro)) {
      mostrarErroDaTarefa(erro);
    } else {
      erroInesperado(`lista.adicionar(criarTarefa(${comoCodigo(dados)}))`, erro);
    }
    return;
  }
  tudoCerto();
  formulario.reset();
  campoTitulo.focus();
  desenhar();
  await salvar();
});

listaNaTela.addEventListener('click', async (evento) => {
  const botao = evento.target.closest('button[data-acao]');
  if (!botao) return;
  const id = Number(botao.dataset.id);
  const acao = botao.dataset.acao;
  const hoje = new Date();
  try {
    if (modo === 'tarefa') {
      tarefasSoltas[id].concluir(hoje);
    } else if (acao === 'concluir') {
      lista.concluir(id, hoje);
    } else {
      lista.remover(id);
    }
    tudoCerto();
  } catch (erro) {
    if (ehErroDeTarefa(erro)) {
      erroAtual = { titulo: `Não deu para ${acao} a tarefa`, paragrafos: [erro.message] };
      atualizarAviso();
    } else {
      const chamada = modo === 'tarefa' ? 'tarefa.concluir(hoje)' : `lista.${acao}(${id}${acao === 'concluir' ? ', hoje' : ''})`;
      erroInesperado(chamada, erro);
    }
  }
  desenhar();
  await salvar();
});

filtro.addEventListener('change', desenhar);

botaoImportar.addEventListener('click', async () => {
  const buscarExemplos = exportado('exemplos', 'buscarExemplos');
  botaoImportar.disabled = true;
  botaoImportar.dataset.ocupado = 'sim';
  statusImportacao.dataset.dePedido = 'sim';
  statusImportacao.classList.remove('problema');
  statusImportacao.textContent = 'Buscando os exemplos...';
  try {
    const exemplos = await buscarExemplos(fetch);
    if (!Array.isArray(exemplos)) {
      throw new Error(`buscarExemplos(fetch) devolveu ${comoCodigo(exemplos)}; o esperado é uma lista.`);
    }
    const quantas = chamar('lista.importar(exemplos)', () => lista.importar(exemplos));
    const primeiro = exemplos[0];
    if (quantas === 0 && primeiro && typeof primeiro.titulo !== 'string') {
      statusImportacao.classList.add('problema');
      statusImportacao.textContent = `Chegaram ${exemplos.length} exemplos, mas nenhum entrou: vieram sem o campo titulo (com ${Object.keys(primeiro).join(', ')}). A API fala inglês: converta cada um para o formato da tarefa.`;
    } else if (quantas === 0) {
      statusImportacao.textContent = 'Nenhuma tarefa nova: os exemplos já estão na lista.';
    } else {
      statusImportacao.textContent = `${plural(quantas, 'tarefa nova', 'tarefas novas')} na lista.`;
    }
    tudoCerto();
    desenhar();
    await salvar();
  } catch (erro) {
    statusImportacao.classList.add('problema');
    if (ehErroDeTarefa(erro)) {
      statusImportacao.textContent = erro.message;
    } else {
      statusImportacao.textContent = `Erro inesperado: ${mensagem(erro)}`;
      erroInesperado('', erro);
    }
  } finally {
    botaoImportar.dataset.ocupado = '';
    botaoImportar.disabled = false;
  }
});

// ---------------------------------------------------------------- o que a página usa

// Cada item confere uma parte do enunciado com os exemplos dele. O confere devolve null
// quando está tudo certo, ou um texto com o que não bateu. Quando a parte ainda não
// existe, lança Falta.
class Falta extends Error {}

function exigir(modulo, nome) {
  const caminho = ARQUIVOS[modulo].slice(3);
  if (falhas[modulo]) throw new Falta(`O arquivo ${caminho} não carregou: veja o aviso no topo.`);
  const valor = exportado(modulo, nome);
  if (!valor) {
    throw new Falta(
      nome === 'default'
        ? `Ainda não existe: falta o export default em ${caminho}.`
        : `Ainda não existe em ${caminho}. Confira o nome, letra por letra, e o export.`,
    );
  }
  return valor;
}

function exigirMembro(Classe, nome, tipo) {
  const d = descritor(Classe, nome);
  if (!d) throw new Falta(`A classe ${Classe.name} ainda não tem ${nome}.`);
  if (tipo === 'get' && typeof d.get !== 'function') {
    throw new Error(`${nome} precisa ser um get: get ${nome}() { ... }, usado sem parênteses.`);
  }
  if (tipo === 'metodo' && typeof d.value !== 'function') {
    throw new Error(`${nome} precisa ser um método: ${nome}(...) { ... }.`);
  }
}

async function conferirCasos(casos) {
  for (const [descricao, executar, esperado] of casos) {
    let obtido;
    try {
      obtido = await executar();
    } catch (erro) {
      if (erro instanceof Falta) throw erro;
      return `${descricao} lançou um erro: ${mensagem(erro)}`;
    }
    if (!iguais(obtido, esperado)) {
      return `${descricao} devolveu ${comoCodigo(obtido)}; o esperado é ${comoCodigo(esperado)}.`;
    }
  }
  return null;
}

async function conferirErro(descricao, executar, campo) {
  try {
    await executar();
  } catch (erro) {
    if (!ehErroDeTarefa(erro)) {
      return `${descricao} lançou ${erro && erro.name ? erro.name : 'um erro'} (${mensagem(erro)}); o esperado é um ErroDeTarefa.`;
    }
    if (erro.campo !== campo) {
      return `${descricao} lançou um ErroDeTarefa com campo ${comoCodigo(erro.campo)}; o esperado é ${comoCodigo(campo)}.`;
    }
    return null;
  }
  throw new Falta(`${descricao} ainda não lança erro.`);
}

// Um armazenamento de mentira e uma resposta de mentira: os testes da página não
// tocam no localStorage de verdade nem na internet.
class ArmazenamentoDeTeste {
  constructor() {
    this.guardado = {};
  }
  getItem(chave) {
    return chave in this.guardado ? this.guardado[chave] : null;
  }
  setItem(chave, texto) {
    this.guardado[chave] = String(texto);
  }
}

class RespostaDeTeste {
  constructor(status, dados) {
    this.status = status;
    this.ok = status >= 200 && status < 300;
    this.dados = dados;
  }
  async json() {
    return this.dados;
  }
}

const TODOS_DE_TESTE = {
  todos: [
    { id: 1, todo: 'Do something nice for someone you care about', completed: false, userId: 152 },
    { id: 2, todo: 'Memorize a poem', completed: true, userId: 13 },
  ],
  total: 254,
  skip: 0,
  limit: 2,
};

const H = HOJE_DOS_EXEMPLOS;
const novaTarefa = (dados) => new (exigir('tarefa', 'default'))(dados);
const novaRecorrente = (dados) => new (exigir('recorrente', 'default'))(dados);
const novaLista = () => new (exigir('lista', 'default'))();

function listaCom(...dados) {
  const l = novaLista();
  for (const d of dados) l.adicionar(d.frequencia ? novaRecorrente(d) : novaTarefa(d));
  return l;
}

const ETAPAS = [
  {
    titulo: 'Etapa 1 · E17 · prazos.js',
    itens: [
      {
        uso: 'pesoDaPrioridade(prioridade)',
        diz: "3 para 'alta', 2 para 'media', 1 para 'baixa' e 0 para o resto",
        confere() {
          const peso = exigir('prazos', 'pesoDaPrioridade');
          return conferirCasos(
            [['alta', 3], ['media', 2], ['baixa', 1], ['urgente', 0]].map(([p, e]) => [
              `pesoDaPrioridade('${p}')`,
              () => peso(p),
              e,
            ]),
          );
        },
      },
      {
        uso: 'situacaoDoPrazo(prazo, hoje)',
        diz: "'atrasada', 'vence-hoje', 'em-dia' ou 'sem-prazo'",
        confere() {
          const situacao = exigir('prazos', 'situacaoDoPrazo');
          const quaseMeiaNoite = new Date(2026, 10, 10, 23, 59);
          return conferirCasos([
            ['situacaoDoPrazo(null, hoje)', () => situacao(null, H), 'sem-prazo'],
            ["situacaoDoPrazo('2026-11-09', hoje)", () => situacao('2026-11-09', H), 'atrasada'],
            ["situacaoDoPrazo('2026-11-10', hoje)", () => situacao('2026-11-10', H), 'vence-hoje'],
            ["situacaoDoPrazo('2026-11-11', hoje)", () => situacao('2026-11-11', H), 'em-dia'],
            ["situacaoDoPrazo('2026-11-10', hoje às 23h59)", () => situacao('2026-11-10', quaseMeiaNoite), 'vence-hoje'],
          ]);
        },
      },
      {
        uso: 'proximoPrazo(prazo, frequencia, hoje)',
        diz: 'o prazo da próxima vez, sempre depois de hoje',
        confere() {
          const proximo = exigir('prazos', 'proximoPrazo');
          return conferirCasos([
            ["proximoPrazo('2026-11-10', 'semanal', hoje)", () => proximo('2026-11-10', 'semanal', H), '2026-11-17'],
            ["proximoPrazo('2026-11-10', 'diaria', hoje)", () => proximo('2026-11-10', 'diaria', H), '2026-11-11'],
            ["proximoPrazo('2026-10-27', 'semanal', hoje)", () => proximo('2026-10-27', 'semanal', H), '2026-11-17'],
          ]);
        },
      },
      {
        uso: 'textoDoPrazo(prazo, hoje)',
        diz: "'Atrasada há 3 dias', 'Vence hoje', 'Vence amanhã', 'Vence em 5 dias' ou 'Sem prazo'",
        confere() {
          const texto = exigir('prazos', 'textoDoPrazo');
          return conferirCasos(
            [
              [null, 'Sem prazo'],
              ['2026-11-07', 'Atrasada há 3 dias'],
              ['2026-11-09', 'Atrasada há 1 dia'],
              ['2026-11-10', 'Vence hoje'],
              ['2026-11-11', 'Vence amanhã'],
              ['2026-11-15', 'Vence em 5 dias'],
            ].map(([p, e]) => [`textoDoPrazo(${comoCodigo(p)}, hoje)`, () => texto(p, H), e]),
          );
        },
      },
    ],
  },
  {
    titulo: 'Etapa 2 · E18 · Tarefa.js',
    itens: [
      {
        uso: 'new Tarefa(dados)',
        diz: "export default; sem prioridade, prazo ou concluida, usa 'media', null e false",
        confere() {
          exigir('tarefa', 'default');
          return conferirCasos([
            [
              "new Tarefa({ titulo: 'Regar as plantas' })",
              () => {
                const t = novaTarefa({ titulo: 'Regar as plantas' });
                return { titulo: t.titulo, prioridade: t.prioridade, prazo: t.prazo, concluida: t.concluida };
              },
              { titulo: 'Regar as plantas', prioridade: 'media', prazo: null, concluida: false },
            ],
            [
              "new Tarefa({ titulo: 'Pagar a conta de luz', prioridade: 'alta', prazo: '2026-11-12', concluida: true })",
              () => {
                const t = novaTarefa({ titulo: 'Pagar a conta de luz', prioridade: 'alta', prazo: '2026-11-12', concluida: true });
                return { prioridade: t.prioridade, prazo: t.prazo, concluida: t.concluida };
              },
              { prioridade: 'alta', prazo: '2026-11-12', concluida: true },
            ],
          ]);
        },
      },
      {
        uso: 'concluir()',
        diz: 'marca a tarefa como concluída',
        confere() {
          exigirMembro(exigir('tarefa', 'default'), 'concluir', 'metodo');
          return conferirCasos([
            [
              'tarefa.concluida depois de tarefa.concluir()',
              () => {
                const t = novaTarefa({ titulo: 'Regar as plantas' });
                t.concluir(H);
                return t.concluida;
              },
              true,
            ],
          ]);
        },
      },
      {
        uso: 'get rotuloDaPrioridade',
        diz: "'Alta', 'Média' ou 'Baixa'",
        confere() {
          exigirMembro(exigir('tarefa', 'default'), 'rotuloDaPrioridade', 'get');
          return conferirCasos(
            [['alta', 'Alta'], ['media', 'Média'], ['baixa', 'Baixa']].map(([p, e]) => [
              `rotuloDaPrioridade de uma tarefa '${p}'`,
              () => novaTarefa({ titulo: 'Regar as plantas', prioridade: p }).rotuloDaPrioridade,
              e,
            ]),
          );
        },
      },
      {
        uso: 'get peso',
        diz: 'o peso da prioridade, de pesoDaPrioridade',
        confere() {
          exigirMembro(exigir('tarefa', 'default'), 'peso', 'get');
          return conferirCasos(
            [['alta', 3], ['media', 2], ['baixa', 1]].map(([p, e]) => [
              `peso de uma tarefa '${p}'`,
              () => novaTarefa({ titulo: 'Regar as plantas', prioridade: p }).peso,
              e,
            ]),
          );
        },
      },
      {
        uso: 'situacao(hoje)',
        diz: "'concluida' quando a tarefa está concluída; senão, a situação do prazo",
        confere() {
          exigirMembro(exigir('tarefa', 'default'), 'situacao', 'metodo');
          return conferirCasos([
            ["situacao(hoje) com prazo '2026-11-09'", () => novaTarefa({ titulo: 'Regar as plantas', prazo: '2026-11-09' }).situacao(H), 'atrasada'],
            ['situacao(hoje) sem prazo', () => novaTarefa({ titulo: 'Regar as plantas' }).situacao(H), 'sem-prazo'],
            [
              "situacao(hoje) de uma concluída com prazo '2026-11-09'",
              () => novaTarefa({ titulo: 'Regar as plantas', prazo: '2026-11-09', concluida: true }).situacao(H),
              'concluida',
            ],
          ]);
        },
      },
      {
        uso: 'prazoEmTexto(hoje)',
        diz: "'Concluída' quando a tarefa está concluída; senão, o texto do prazo",
        confere() {
          exigirMembro(exigir('tarefa', 'default'), 'prazoEmTexto', 'metodo');
          return conferirCasos([
            ["prazoEmTexto(hoje) com prazo '2026-11-10'", () => novaTarefa({ titulo: 'Regar as plantas', prazo: '2026-11-10' }).prazoEmTexto(H), 'Vence hoje'],
            [
              'prazoEmTexto(hoje) de uma concluída',
              () => novaTarefa({ titulo: 'Regar as plantas', prazo: '2026-11-10', concluida: true }).prazoEmTexto(H),
              'Concluída',
            ],
          ]);
        },
      },
    ],
  },
  {
    titulo: 'Etapa 3 · E19 · TarefaRecorrente.js e ListaDeTarefas.js',
    itens: [
      {
        uso: 'class TarefaRecorrente extends Tarefa',
        diz: "tudo o que a Tarefa tem, mais a frequencia ('semanal' quando não vem)",
        confere() {
          const Recorrente = exigir('recorrente', 'default');
          const Tarefa = exigir('tarefa', 'default');
          if (Object.getPrototypeOf(Recorrente) !== Tarefa) {
            return 'A TarefaRecorrente precisa nascer com extends Tarefa, importando a Tarefa de ./Tarefa.js.';
          }
          return conferirCasos([
            [
              "new TarefaRecorrente({ titulo: 'Regar as plantas', prazo: '2026-11-10', frequencia: 'diaria' })",
              () => {
                const r = novaRecorrente({ titulo: 'Regar as plantas', prazo: '2026-11-10', frequencia: 'diaria' });
                return { titulo: r.titulo, prioridade: r.prioridade, frequencia: r.frequencia, rotulo: r.rotuloDaPrioridade };
              },
              { titulo: 'Regar as plantas', prioridade: 'media', frequencia: 'diaria', rotulo: 'Média' },
            ],
            [
              'a frequencia de uma recorrente criada sem frequencia',
              () => novaRecorrente({ titulo: 'Regar as plantas', prazo: '2026-11-10' }).frequencia,
              'semanal',
            ],
          ]);
        },
      },
      {
        uso: 'concluir(hoje) da TarefaRecorrente',
        diz: 'a tarefa comum devolve null; a recorrente devolve a próxima, pendente',
        confere() {
          const Recorrente = exigir('recorrente', 'default');
          if (!Object.prototype.hasOwnProperty.call(Recorrente.prototype, 'concluir')) {
            throw new Falta('A TarefaRecorrente ainda não sobrescreve o concluir.');
          }
          return conferirCasos([
            ['concluir(hoje) de uma tarefa comum', () => novaTarefa({ titulo: 'Pagar a conta de luz' }).concluir(H), null],
            [
              "concluir(hoje) da semanal com prazo '2026-11-10'",
              () => {
                const r = novaRecorrente({ titulo: 'Regar as plantas', prazo: '2026-11-10', frequencia: 'semanal' });
                const p = r.concluir(H);
                if (!p || typeof p !== 'object') return p;
                return {
                  original: r.concluida,
                  prazo: p.prazo,
                  concluida: p.concluida,
                  frequencia: p.frequencia,
                  recorrente: p instanceof Recorrente,
                };
              },
              { original: true, prazo: '2026-11-17', concluida: false, frequencia: 'semanal', recorrente: true },
            ],
          ]);
        },
      },
      {
        uso: 'new ListaDeTarefas(), adicionar(tarefa) e buscar(id)',
        diz: 'this.tarefas começa vazia; adicionar dá o id 1, 2, 3... e devolve a tarefa',
        confere() {
          const Lista = exigir('lista', 'default');
          exigirMembro(Lista, 'adicionar', 'metodo');
          exigirMembro(Lista, 'buscar', 'metodo');
          return conferirCasos([
            ['new ListaDeTarefas().tarefas', () => novaLista().tarefas, []],
            [
              'os ids de duas tarefas adicionadas',
              () => {
                const l = novaLista();
                const a = l.adicionar(novaTarefa({ titulo: 'Pagar a conta de luz' }));
                const b = l.adicionar(novaTarefa({ titulo: 'Comprar ração do gato' }));
                return [a && a.id, b && b.id, l.tarefas.length];
              },
              [1, 2, 2],
            ],
            [
              'buscar(2) e buscar(99)',
              () => {
                const l = listaCom({ titulo: 'Pagar a conta de luz' }, { titulo: 'Comprar ração do gato' });
                const achada = l.buscar(2);
                return [achada && achada.titulo, l.buscar(99)];
              },
              ['Comprar ração do gato', undefined],
            ],
          ]);
        },
      },
      {
        uso: 'concluir(id, hoje) e remover(id) da lista',
        diz: 'concluir a recorrente acrescenta a próxima; remover tira da lista',
        confere() {
          const Lista = exigir('lista', 'default');
          exigirMembro(Lista, 'concluir', 'metodo');
          exigirMembro(Lista, 'remover', 'metodo');
          exigir('recorrente', 'default');
          return conferirCasos([
            [
              'lista.concluir(1, hoje) com uma semanal de prazo 2026-11-10',
              () => {
                const l = listaCom({ titulo: 'Regar as plantas', prazo: '2026-11-10', frequencia: 'semanal' });
                l.concluir(1, H);
                return l.tarefas.map((t) => [t.id, t.prazo, t.concluida]);
              },
              [[1, '2026-11-10', true], [2, '2026-11-17', false]],
            ],
            [
              'lista.concluir(1, hoje) com uma tarefa comum',
              () => {
                const l = listaCom({ titulo: 'Pagar a conta de luz' });
                l.concluir(1, H);
                return l.tarefas.map((t) => [t.id, t.concluida]);
              },
              [[1, true]],
            ],
            [
              'os ids depois de lista.remover(1)',
              () => {
                const l = listaCom({ titulo: 'Pagar a conta de luz' }, { titulo: 'Comprar ração do gato' });
                l.remover(1);
                return l.tarefas.map((t) => t.id);
              },
              [2],
            ],
          ]);
        },
      },
      {
        uso: 'criarTarefa(dados)',
        diz: 'uma TarefaRecorrente quando dados.frequencia vem preenchida; uma Tarefa nos outros casos',
        confere() {
          const criarTarefa = exigir('lista', 'criarTarefa');
          const Recorrente = exigir('recorrente', 'default');
          const Tarefa = exigir('tarefa', 'default');
          return conferirCasos([
            [
              "criarTarefa({ titulo: 'Regar as plantas', prazo: '2026-11-10', frequencia: 'diaria' })",
              () => criarTarefa({ titulo: 'Regar as plantas', prazo: '2026-11-10', frequencia: 'diaria' }) instanceof Recorrente,
              true,
            ],
            [
              "criarTarefa({ titulo: 'Pagar a conta de luz' })",
              () => {
                const t = criarTarefa({ titulo: 'Pagar a conta de luz' });
                return t instanceof Tarefa && !(t instanceof Recorrente);
              },
              true,
            ],
          ]);
        },
      },
      {
        uso: 'resumo(hoje)',
        diz: '{ pendentes, atrasadas, concluidas }',
        confere() {
          exigirMembro(exigir('lista', 'default'), 'resumo', 'metodo');
          return conferirCasos([
            [
              'resumo(hoje) de 1 atrasada, 1 em dia e 1 concluída',
              () =>
                listaCom(
                  { titulo: 'Pagar a conta de luz', prazo: '2026-11-08' },
                  { titulo: 'Estudar para a prova', prazo: '2026-11-15' },
                  { titulo: 'Separar roupas para doação', prazo: '2026-11-01', concluida: true },
                ).resumo(H),
              { pendentes: 2, atrasadas: 1, concluidas: 1 },
            ],
          ]);
        },
      },
    ],
  },
  {
    titulo: 'Etapa 4 · E20 · ErroDeTarefa.js e as validações',
    itens: [
      {
        uso: 'class ErroDeTarefa extends Error',
        diz: "new ErroDeTarefa(mensagem, campo), com name 'ErroDeTarefa'; campo null quando não vem",
        confere() {
          const ErroDeTarefa = exigir('erro', 'default');
          return conferirCasos([
            [
              "new ErroDeTarefa('Teste', 'titulo')",
              () => {
                const e = new ErroDeTarefa('Teste', 'titulo');
                return { message: e.message, campo: e.campo, name: e.name, ehError: e instanceof Error };
              },
              { message: 'Teste', campo: 'titulo', name: 'ErroDeTarefa', ehError: true },
            ],
            ["new ErroDeTarefa('Teste').campo", () => new ErroDeTarefa('Teste').campo, null],
          ]);
        },
      },
      {
        uso: 'Tarefa recusa título vazio',
        diz: "ErroDeTarefa com campo 'titulo'; o título é guardado sem os espaços das pontas",
        async confere() {
          exigir('erro', 'default');
          const vazio = await conferirErro("new Tarefa({ titulo: '   ' })", () => novaTarefa({ titulo: '   ' }), 'titulo');
          if (vazio) return vazio;
          return conferirCasos([
            ["new Tarefa({ titulo: '  Regar as plantas  ' }).titulo", () => novaTarefa({ titulo: '  Regar as plantas  ' }).titulo, 'Regar as plantas'],
          ]);
        },
      },
      {
        uso: 'adicionar recusa título repetido',
        diz: "ErroDeTarefa com campo 'titulo' quando já existe uma pendente com o título, sem ligar para maiúsculas",
        confere() {
          exigir('erro', 'default');
          return conferirErro(
            "adicionar 'PAGAR A CONTA DE LUZ' com 'Pagar a conta de luz' pendente",
            () => {
              const l = listaCom({ titulo: 'Pagar a conta de luz' });
              l.adicionar(novaTarefa({ titulo: 'PAGAR A CONTA DE LUZ' }));
            },
            'titulo',
          );
        },
      },
      {
        uso: 'importar(listaDeDados)',
        diz: 'acrescenta as tarefas que estão certas, pula as outras e devolve quantas entraram',
        confere() {
          exigirMembro(exigir('lista', 'default'), 'importar', 'metodo');
          return conferirCasos([
            [
              'importar de 1 certa, 1 sem título, 1 repetida e 1 recorrente',
              () => {
                const l = novaLista();
                const quantas = l.importar([
                  { titulo: 'Pagar a conta de luz' },
                  { titulo: '' },
                  { titulo: 'pagar a conta de luz' },
                  { titulo: 'Regar as plantas', prazo: '2026-11-10', frequencia: 'semanal' },
                ]);
                return [quantas, l.tarefas.length];
              },
              [2, 2],
            ],
          ]);
        },
      },
      {
        uso: 'Tarefa recusa título com menos de 3 letras',
        diz: "ErroDeTarefa com campo 'titulo'",
        confere() {
          exigir('erro', 'default');
          return conferirErro("new Tarefa({ titulo: 'ab' })", () => novaTarefa({ titulo: 'ab' }), 'titulo');
        },
      },
      {
        uso: 'Tarefa recusa prioridade e prazo errados',
        diz: "ErroDeTarefa com campo 'prioridade' ou 'prazo'",
        async confere() {
          exigir('erro', 'default');
          const prioridade = await conferirErro(
            "new Tarefa({ titulo: 'Regar as plantas', prioridade: 'urgente' })",
            () => novaTarefa({ titulo: 'Regar as plantas', prioridade: 'urgente' }),
            'prioridade',
          );
          if (prioridade) return prioridade;
          return conferirErro(
            "new Tarefa({ titulo: 'Regar as plantas', prazo: '10/11/2026' })",
            () => novaTarefa({ titulo: 'Regar as plantas', prazo: '10/11/2026' }),
            'prazo',
          );
        },
      },
      {
        uso: 'TarefaRecorrente recusa ficar sem prazo',
        diz: "ErroDeTarefa com campo 'prazo'",
        confere() {
          exigir('erro', 'default');
          return conferirErro(
            "new TarefaRecorrente({ titulo: 'Regar as plantas', frequencia: 'semanal' })",
            () => novaRecorrente({ titulo: 'Regar as plantas', frequencia: 'semanal' }),
            'prazo',
          );
        },
      },
    ],
  },
  {
    titulo: 'Etapa 5 · E21 · armazenamento.js',
    itens: [
      {
        uso: 'esperar(ms)',
        diz: 'uma Promise que termina depois de ms milissegundos',
        confere() {
          const esperar = exigir('armazenamento', 'esperar');
          return conferirCasos([
            [
              'esperar(10)',
              async () => {
                const promessa = esperar(10);
                const ehPromise = Boolean(promessa) && typeof promessa.then === 'function';
                await promessa;
                return ehPromise ? 'uma Promise' : promessa;
              },
              'uma Promise',
            ],
          ]);
        },
      },
      {
        uso: 'salvarTarefas(lista, armazenamento)',
        diz: "espera e grava a lista, em JSON, na CHAVE 'lista-de-tarefas'",
        confere() {
          const salvarTarefas = exigir('armazenamento', 'salvarTarefas');
          return conferirCasos([
            [
              'o que salvarTarefas grava no armazenamento',
              async () => {
                const armazenamento = new ArmazenamentoDeTeste();
                await salvarTarefas(listaCom({ titulo: 'Pagar a conta de luz' }), armazenamento);
                const texto = armazenamento.getItem(CHAVE_PADRAO);
                if (texto === null) return Object.keys(armazenamento.guardado).length ? `outra chave: ${Object.keys(armazenamento.guardado)}` : 'nada';
                return JSON.parse(texto).map((t) => t.titulo);
              },
              ['Pagar a conta de luz'],
            ],
          ]);
        },
      },
      {
        uso: 'carregarTarefas(armazenamento)',
        diz: 'espera e devolve a ListaDeTarefas salva; vazia na primeira visita',
        confere() {
          const salvarTarefas = exigir('armazenamento', 'salvarTarefas');
          const carregarTarefas = exigir('armazenamento', 'carregarTarefas');
          return conferirCasos([
            [
              'carregarTarefas de um armazenamento vazio',
              async () => exigirLista(await carregarTarefas(new ArmazenamentoDeTeste()), 'carregarTarefas').tarefas.length,
              0,
            ],
            [
              'salvar uma semanal e carregar de volta',
              async () => {
                const armazenamento = new ArmazenamentoDeTeste();
                await salvarTarefas(
                  listaCom({ titulo: 'Regar as plantas', prazo: '2026-11-10', frequencia: 'semanal' }),
                  armazenamento,
                );
                const l = exigirLista(await carregarTarefas(armazenamento), 'carregarTarefas');
                return l.tarefas.map((t) => [t.titulo, t.frequencia]);
              },
              [['Regar as plantas', 'semanal']],
            ],
          ]);
        },
      },
      {
        uso: 'carregarTarefas com o texto salvo quebrado',
        diz: 'devolve a lista vazia, sem lançar erro',
        confere() {
          const carregarTarefas = exigir('armazenamento', 'carregarTarefas');
          return conferirCasos([
            [
              "carregarTarefas com '{quebrado' salvo",
              async () => {
                const armazenamento = new ArmazenamentoDeTeste();
                armazenamento.setItem(CHAVE_PADRAO, '{quebrado');
                let l;
                try {
                  l = await carregarTarefas(armazenamento);
                } catch (erro) {
                  throw new Falta(`Ainda lança um erro: ${mensagem(erro)}`);
                }
                return exigirLista(l, 'carregarTarefas').tarefas.length;
              },
              0,
            ],
          ]);
        },
      },
    ],
  },
  {
    titulo: 'Etapa 6 · E22 · exemplos.js',
    itens: [
      {
        uso: 'buscarExemplos(buscar)',
        diz: 'pede as tarefas com buscar (na tela, o fetch) e devolve uma lista',
        confere() {
          const buscarExemplos = exigir('exemplos', 'buscarExemplos');
          return conferirCasos([
            [
              'buscarExemplos com uma resposta 200',
              async () => {
                const exemplos = await buscarExemplos(async () => new RespostaDeTeste(200, TODOS_DE_TESTE));
                return Array.isArray(exemplos) ? 'uma lista' : exemplos;
              },
              'uma lista',
            ],
          ]);
        },
      },
      {
        uso: 'buscarExemplos quando o servidor responde erro',
        diz: 'lança ErroDeTarefa com o status na mensagem',
        async confere() {
          const buscarExemplos = exigir('exemplos', 'buscarExemplos');
          const problema = await conferirErro(
            'buscarExemplos com uma resposta 500',
            () => buscarExemplos(async () => new RespostaDeTeste(500, null)),
            null,
          );
          return problema;
        },
      },
      {
        uso: 'buscarExemplos sem internet',
        diz: 'lança ErroDeTarefa com uma mensagem em português',
        async confere() {
          const buscarExemplos = exigir('exemplos', 'buscarExemplos');
          const problema = await conferirErro(
            'buscarExemplos sem internet',
            () =>
              buscarExemplos(async () => {
                throw new TypeError('Failed to fetch');
              }),
            null,
          );
          if (problema && problema.includes('Failed to fetch')) {
            throw new Falta('Sem internet, o erro do fetch ainda passa direto: troque por um ErroDeTarefa, com try/catch.');
          }
          return problema;
        },
      },
      {
        uso: 'converterTodo(todo)',
        diz: "{ titulo, prioridade: 'media', prazo: null }",
        confere() {
          const converterTodo = exigir('exemplos', 'converterTodo');
          return conferirCasos([
            [
              "converterTodo({ id: 4, todo: 'Watch a documentary', completed: false, userId: 84 })",
              () => {
                const t = converterTodo({ id: 4, todo: 'Watch a documentary', completed: false, userId: 84 });
                return t && typeof t === 'object' ? { titulo: t.titulo, prioridade: t.prioridade, prazo: t.prazo } : t;
              },
              { titulo: 'Watch a documentary', prioridade: 'media', prazo: null },
            ],
          ]);
        },
      },
      {
        uso: 'buscarExemplos traz só as pendentes, no formato da tarefa',
        diz: 'a concluída fica de fora; cada exemplo com titulo, prioridade e prazo',
        confere() {
          const buscarExemplos = exigir('exemplos', 'buscarExemplos');
          exigir('exemplos', 'converterTodo');
          return conferirCasos([
            [
              'os títulos de buscarExemplos com 1 pendente e 1 concluída',
              async () => {
                const exemplos = await buscarExemplos(async () => new RespostaDeTeste(200, TODOS_DE_TESTE));
                if (!Array.isArray(exemplos)) return exemplos;
                return exemplos.map((t) => (t && typeof t === 'object' ? t.titulo : t));
              },
              ['Do something nice for someone you care about'],
            ],
          ]);
        },
      },
    ],
  },
];

// Os testes da etapa 5 recebem um armazenamento de mentira. Se o seu código gravar no
// localStorage de verdade, a página devolve o que estava lá antes.
function copiarLocalStorage() {
  const copia = {};
  for (let i = 0; i < localStorage.length; i += 1) {
    const chave = localStorage.key(i);
    copia[chave] = localStorage.getItem(chave);
  }
  return copia;
}

async function conferirItem(item) {
  try {
    const problema = await item.confere();
    return problema === null ? { estado: 'ok', texto: 'Pronto: bate com o enunciado.' } : { estado: 'errado', texto: problema };
  } catch (erro) {
    if (erro instanceof Falta) return { estado: 'falta', texto: erro.message };
    return { estado: 'errado', texto: mensagem(erro) };
  }
}

async function conferirEtapas() {
  const antes = copiarLocalStorage();
  const resultados = await Promise.all(
    ETAPAS.map((etapa) => Promise.all(etapa.itens.map((item) => conferirItem(item)))),
  );
  const depois = copiarLocalStorage();
  let mexeu = false;
  if (!iguais(antes, depois)) {
    mexeu = true;
    localStorage.clear();
    for (const [chave, texto] of Object.entries(antes)) localStorage.setItem(chave, texto);
  }
  return { resultados, mexeu };
}

function desenharEtapas(resultados) {
  etapasNaTela.replaceChildren();
  let abriuUma = false;
  ETAPAS.forEach((etapa, i) => {
    const deEtapa = resultados[i];
    const prontos = deEtapa.filter((r) => r.estado === 'ok').length;
    const completa = prontos === deEtapa.length;
    const detalhes = criar('details', undefined, completa ? 'etapa completa' : 'etapa');
    if (!completa && !abriuUma) {
      detalhes.open = true;
      abriuUma = true;
    }
    const resumoDaEtapa = criar('summary');
    resumoDaEtapa.append(criar('span', etapa.titulo), criar('small', `${prontos} de ${deEtapa.length}`));
    detalhes.append(resumoDaEtapa);
    const itens = criar('ul', undefined, 'itens');
    etapa.itens.forEach((item, k) => {
      const r = deEtapa[k];
      const li = criar('li', undefined, r.estado);
      li.innerHTML = icone(r.estado);
      const texto = criar('div');
      texto.append(criar('code', item.uso));
      texto.append(criar('small', r.estado === 'ok' ? item.diz : r.texto));
      li.append(texto);
      itens.append(li);
    });
    detalhes.append(itens);
    etapasNaTela.append(detalhes);
  });
}

function calcularAvisoDasEtapas(resultados, mexeu) {
  if (mexeu) {
    return {
      titulo: 'O salvarTarefas gravou no localStorage de verdade',
      paragrafos: [
        'Grave no armazenamento que a função recebe (armazenamento.setItem), não direto no localStorage: é assim que o teste usa um armazenamento de mentira.',
      ],
      problema: true,
    };
  }
  for (let i = 0; i < ETAPAS.length; i += 1) {
    const k = resultados[i].findIndex((r) => r.estado !== 'ok');
    if (k === -1) continue;
    const r = resultados[i][k];
    const item = ETAPAS[i].itens[k];
    return {
      titulo: r.estado === 'errado' ? `${ETAPAS[i].titulo}: um resultado não bateu` : `Próximo passo: ${ETAPAS[i].titulo}`,
      paragrafos: [`${item.uso}: ${r.texto}`, 'A lista "O que a página usa", no fim da página, mostra cada item.'],
      problema: r.estado === 'errado',
    };
  }
  return null;
}

// ---------------------------------------------------------------- começar

async function iniciar() {
  if (location.protocol === 'file:') return; // o aviso do HTML já explica como abrir pelo servidor

  aviso.hidden = true;
  await importarTudo();
  if (!modulos.datas.somarDias) {
    atualizarAviso();
    return; // sem as datas do kit, nada funciona: o aviso mostra a mensagem do navegador
  }
  modo = decidirModo();
  try {
    await prepararDados();
  } catch (erro) {
    erroInesperado('', erro);
    modo = 'kit';
  }
  desenhar();
  if (modo !== 'lista') {
    status.textContent = 'Demonstração: nada é salvo.';
  } else if (!exportado('armazenamento', 'salvarTarefas')) {
    status.textContent = 'Sem salvar: ao recarregar, a lista volta ao começo (etapa 5).';
  } else if (!exportado('armazenamento', 'carregarTarefas')) {
    status.textContent = 'Salva a cada mudança, mas ainda não carrega ao abrir: falta carregarTarefas.';
  }

  const { resultados, mexeu } = await conferirEtapas();
  desenharEtapas(resultados);
  avisoDasEtapas = calcularAvisoDasEtapas(resultados, mexeu);
  atualizarAviso();
}

iniciar();
