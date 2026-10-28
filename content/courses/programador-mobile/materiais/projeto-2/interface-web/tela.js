/* global document */
// Projeto 2 · Agenda de contatos: a tela pronta.
//
// Este arquivo não tem regra nenhuma: ele lê o que a pessoa digita, chama as SUAS
// funções (todas importadas do src/index.js) e desenha o resultado na página.
// Copie a pasta inteira para web/ no seu repositório e, na raiz dele, rode:
//   npx serve .
// Depois abra o endereço que o serve mostrar, com /web/ no fim.
//
// Você não precisa entender este arquivo para fazer o projeto. Se quiser ler, ele usa
// o DOM (o document do E01) e alguns recursos que o curso mostra mais adiante.
import * as agenda from '../src/index.js';

// ---------------------------------------------------------------------------
// O que a tela usa do seu src/index.js, e a etapa em que cada nome nasce
// ---------------------------------------------------------------------------
const NOMES = [
  ['contatos', 'E08', 'a lista de src/data/contatos.js'],
  ['buscarContatos', 'E08', 'campo de busca'],
  ['ordenarPorNome', 'E08', 'lista em ordem alfabética'],
  ['registrarBusca', 'E08', 'buscas recentes (Enter)'],
  ['agruparPorInicial', 'E09', 'letras da lista'],
  ['contarPorGrupo', 'E09', 'números dos filtros'],
  ['aniversariantesDoMes', 'E09', 'aniversariantes'],
  ['adicionarContato', 'E09', 'salvar contato novo'],
  ['removerContato', 'E09', 'botão remover'],
  ['validarContato', 'E10', 'mensagens do formulário'],
  ['debounce', 'E10', 'espera na busca'],
  ['doGrupo', 'E10', 'filtros por grupo'],
  ['editarContato', 'E11', 'botão editar'],
  ['indexarPorId', 'E12', 'favoritos'],
  ['alternarFavorito', 'E12', 'estrela'],
  ['ehFavorito', 'E12', 'estrela acesa'],
  ['listarFavoritos', 'E12', 'seção Favoritos'],
];

const GRUPOS = { familia: 'Família', amigos: 'Amigos', trabalho: 'Trabalho' };
const MESES = [
  'janeiro',
  'fevereiro',
  'março',
  'abril',
  'maio',
  'junho',
  'julho',
  'agosto',
  'setembro',
  'outubro',
  'novembro',
  'dezembro',
];
const ESPERA_DA_BUSCA = 300; // ms

// Erros lançados pelas suas funções, por nome, para o painel mostrar.
const erros = new Map();

function tem(nome) {
  if (nome === 'contatos') return Array.isArray(agenda.contatos);
  return typeof agenda[nome] === 'function';
}

// Chama uma função sua; se ela lançar erro, o painel mostra qual foi.
function usar(nome, ...args) {
  try {
    return agenda[nome](...args);
  } catch (erro) {
    erros.set(nome, erro.message);
    throw erro;
  }
}

// ---------------------------------------------------------------------------
// Estado da tela: tudo o que muda fica aqui, e render() desenha a partir dele
// ---------------------------------------------------------------------------
const estado = {
  lista: tem('contatos') ? agenda.contatos : [],
  favoritos: new Set(),
  historico: [],
  termo: '',
  grupo: 'todos',
  editando: null, // id do contato no formulário, ou null para um novo
  desfazer: null, // { lista, texto }: a lista de antes da última mudança
  teclas: 0,
  buscas: 0,
};

// ---------------------------------------------------------------------------
// Pequenos ajudantes de DOM
// ---------------------------------------------------------------------------
const $ = (id) => document.getElementById(id);

// el('p', { className: 'nome' }, 'Ana') cria <p class="nome">Ana</p>.
// Chaves como ariaLabel viram atributos aria-label.
function el(tag, props = {}, ...filhos) {
  const elemento = document.createElement(tag);
  for (const [chave, valor] of Object.entries(props)) {
    if (chave.startsWith('aria')) {
      elemento.setAttribute(`aria-${chave.slice(4).toLowerCase()}`, valor);
    } else {
      elemento[chave] = valor;
    }
  }
  for (const filho of filhos) {
    if (filho !== null && filho !== undefined) elemento.append(filho);
  }
  return elemento;
}

const ICONES = {
  star: '<path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/>',
  pencil:
    '<path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/>',
  trash:
    '<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/>',
};

function icone(nome) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('class', 'icone');
  svg.setAttribute('aria-hidden', 'true');
  svg.innerHTML = ICONES[nome];
  return svg;
}

// Uma parte da tela que depende de uma função que ainda não existe.
function pendente(nome) {
  const etapa = NOMES.find(([n]) => n === nome)[1];
  return el(
    'p',
    { className: 'pendente' },
    'Falta ',
    el('code', {}, nome),
    ` (etapa ${etapa}) no src/index.js.`,
  );
}

// Desenha uma parte da tela; se uma função sua lançar erro, mostra o erro ali.
function desenhar(alvo, montar) {
  try {
    alvo.replaceChildren(...montar());
  } catch (erro) {
    console.error(erro);
    alvo.replaceChildren(
      el('p', { className: 'pendente' }, `Erro: ${erro.message}. Detalhes no Console (F12).`),
    );
  }
}

function diaEMes(data) {
  const [, mes, dia] = data.split('-');
  return `${dia}/${mes}`;
}

function iniciais(nome) {
  const partes = nome.trim().split(/\s+/);
  const ultima = partes.length > 1 ? partes[partes.length - 1][0] : '';
  return (partes[0][0] + ultima).toUpperCase();
}

// ---------------------------------------------------------------------------
// Partes da tela
// ---------------------------------------------------------------------------

function contatosVisiveis() {
  let lista = estado.lista;
  if (estado.termo.trim() !== '' && tem('buscarContatos')) {
    lista = usar('buscarContatos', lista, estado.termo);
  }
  if (estado.grupo !== 'todos' && tem('doGrupo')) {
    const teste = usar('doGrupo', estado.grupo);
    if (typeof teste !== 'function') {
      erros.set('doGrupo', 'doGrupo precisa devolver uma função (faltou o return?)');
      throw new Error('doGrupo não devolveu uma função');
    }
    lista = lista.filter(teste);
  }
  return lista;
}

function desenharStatus() {
  let ligados = 0;
  const itens = NOMES.map(([nome, etapa, uso]) => {
    let selo = el('span', { className: 'selo falta' }, 'falta');
    if (erros.has(nome)) {
      selo = el('span', { className: 'selo erro' }, 'erro');
    } else if (tem(nome)) {
      selo = el('span', { className: 'selo ok' }, 'ok');
      ligados += 1;
    }
    const detalhe = erros.has(nome) ? erros.get(nome) : `${etapa} · ${uso}`;
    return el('li', {}, selo, el('code', {}, nome), el('span', { className: 'etapa' }, detalhe));
  });
  $('status-lista').replaceChildren(...itens);
  $('status-titulo').textContent =
    `Funções do seu src/index.js: ${ligados} de ${NOMES.length} ligadas`;
  return ligados;
}

function desenharBuscaInfo() {
  let texto = `${estado.teclas} teclas, ${estado.buscas} buscas`;
  if (tem('debounce')) texto += ` (debounce de ${ESPERA_DA_BUSCA} ms)`;
  else texto += ' (sem debounce: ele chega no E10)';
  if (!tem('buscarContatos')) texto = 'A busca liga quando buscarContatos (E08) existir.';
  $('contador-busca').textContent = texto;
}

function desenharHistorico() {
  desenhar($('historico'), () => {
    if (!tem('registrarBusca') || estado.historico.length === 0) return [];
    const chips = estado.historico.map((termo) =>
      el('button', {
        type: 'button',
        className: 'chip',
        textContent: termo,
        onclick: () => {
          $('busca').value = termo;
          confirmarBusca(termo);
        },
      }),
    );
    return [el('span', { className: 'rotulo' }, 'Buscas recentes:'), ...chips];
  });
}

function desenharFiltros() {
  desenhar($('filtros'), () => {
    let contagem = null;
    if (tem('contarPorGrupo')) contagem = usar('contarPorGrupo', estado.lista);
    const opcoes = [['todos', 'Todos'], ...Object.entries(GRUPOS)];
    return opcoes.map(([valor, rotulo]) => {
      let texto = rotulo;
      if (valor === 'todos') texto += ` (${estado.lista.length})`;
      else if (contagem !== null) texto += ` (${contagem[valor]})`;
      return el('button', {
        type: 'button',
        className: 'chip',
        textContent: texto,
        disabled: valor !== 'todos' && !tem('doGrupo'),
        title: tem('doGrupo') ? '' : 'Os filtros ligam quando doGrupo (E10) existir',
        ariaPressed: String(estado.grupo === valor),
        onclick: () => {
          estado.grupo = valor;
          render();
        },
      });
    });
  });
}

function desenharAniversariantes() {
  const mes = new Date().getMonth() + 1;
  $('titulo-aniversarios').textContent = `Aniversariantes de ${MESES[mes - 1]}`;
  desenhar($('aniversariantes'), () => {
    if (!tem('aniversariantesDoMes')) return [pendente('aniversariantesDoMes')];
    const lista = usar('aniversariantesDoMes', estado.lista, mes);
    if (lista.length === 0) {
      return [el('p', { className: 'vazio' }, `Ninguém faz aniversário em ${MESES[mes - 1]}.`)];
    }
    const itens = lista.map((contato) =>
      el(
        'li',
        {},
        el('span', { className: 'dia' }, diaEMes(contato.aniversario)),
        el('span', {}, contato.nome),
      ),
    );
    return [el('ul', { className: 'aniversarios' }, ...itens)];
  });
}

function desenharFavoritos() {
  desenhar($('favoritos'), () => {
    for (const nome of ['indexarPorId', 'alternarFavorito', 'ehFavorito', 'listarFavoritos']) {
      if (!tem(nome)) return [pendente(nome)];
    }
    const porId = usar('indexarPorId', estado.lista);
    const lista = usar('listarFavoritos', estado.favoritos, porId);
    if (lista.length === 0) {
      return [
        el('p', { className: 'vazio' }, 'Toque na estrela de um contato para ele aparecer aqui.'),
      ];
    }
    return [el('ul', { className: 'contatos' }, ...lista.map(cartaoDoContato))];
  });
}

function desenharLista() {
  const buscando = estado.termo.trim() !== '' || estado.grupo !== 'todos';
  $('titulo-lista').textContent = buscando ? 'Resultado' : 'Contatos';
  desenhar($('lista'), () => {
    if (!tem('contatos')) return [pendente('contatos')];
    const visiveis = contatosVisiveis();
    $('titulo-lista').textContent += ` (${visiveis.length})`;
    if (visiveis.length === 0) {
      return [el('p', { className: 'vazio' }, 'Nenhum contato encontrado.')];
    }
    let ordenados = visiveis;
    if (tem('ordenarPorNome')) ordenados = usar('ordenarPorNome', visiveis);
    let porLetra = { '': ordenados };
    if (tem('agruparPorInicial')) porLetra = usar('agruparPorInicial', ordenados);
    const partes = [];
    for (const [letra, contatos] of Object.entries(porLetra)) {
      if (letra !== '') partes.push(el('h3', { className: 'letra' }, letra));
      partes.push(el('ul', { className: 'contatos' }, ...contatos.map(cartaoDoContato)));
    }
    return partes;
  });
}

function cartaoDoContato(contato) {
  const dados = el(
    'div',
    { className: 'dados' },
    el('p', { className: 'nome' }, contato.nome),
    el('p', { className: 'detalhe' }, contato.telefone),
    contato.email ? el('p', { className: 'detalhe' }, contato.email) : null,
    contato.aniversario
      ? el('p', { className: 'detalhe' }, `Aniversário: ${diaEMes(contato.aniversario)}`)
      : null,
    el('span', { className: `grupo ${contato.grupo}` }, GRUPOS[contato.grupo] || contato.grupo),
  );

  const botoes = el('div', { className: 'botoes' });
  if (tem('alternarFavorito') && tem('ehFavorito')) {
    const favorito = usar('ehFavorito', estado.favoritos, contato.id);
    botoes.append(
      el(
        'button',
        {
          type: 'button',
          className: 'botao-icone',
          ariaLabel: `Favorito: ${contato.nome}`,
          ariaPressed: String(favorito === true),
          onclick: () => {
            estado.favoritos = usar('alternarFavorito', estado.favoritos, contato.id);
            render();
          },
        },
        icone('star'),
      ),
    );
  }
  if (tem('editarContato')) {
    botoes.append(
      el(
        'button',
        {
          type: 'button',
          className: 'botao-icone',
          ariaLabel: `Editar ${contato.nome}`,
          onclick: () => abrirEdicao(contato),
        },
        icone('pencil'),
      ),
    );
  }
  if (tem('removerContato')) {
    botoes.append(
      el(
        'button',
        {
          type: 'button',
          className: 'botao-icone remover',
          ariaLabel: `Remover ${contato.nome}`,
          onclick: () => {
            const antes = estado.lista;
            estado.lista = usar('removerContato', estado.lista, contato.id);
            avisar(`${contato.nome} saiu da agenda.`, antes);
          },
        },
        icone('trash'),
      ),
    );
  }

  return el(
    'li',
    { className: 'contato' },
    el('span', { className: 'avatar', ariaHidden: 'true' }, iniciais(contato.nome)),
    dados,
    botoes,
  );
}

function desenharMensagem() {
  $('mensagem').hidden = estado.desfazer === null;
  if (estado.desfazer !== null) $('mensagem-texto').textContent = estado.desfazer.texto;
}

function render() {
  erros.clear();
  desenharBuscaInfo();
  desenharHistorico();
  desenharFiltros();
  desenharAniversariantes();
  desenharFavoritos();
  desenharLista();
  desenharMensagem();
  desenharStatus();
  $('resumo').textContent =
    `${estado.lista.length} contatos. A tela é pronta; as regras são suas, em src/index.js.`;
}

// Uma mudança na lista guarda a lista de antes: o Desfazer só funciona porque as
// suas regras devolvem uma lista nova e deixam a antiga como estava.
function avisar(texto, listaDeAntes) {
  estado.desfazer = { texto, lista: listaDeAntes };
  render();
}

// ---------------------------------------------------------------------------
// Busca
// ---------------------------------------------------------------------------
function aplicarBusca(termo) {
  estado.termo = termo;
  estado.buscas += 1;
  render();
}

const buscarComEspera = tem('debounce')
  ? agenda.debounce(aplicarBusca, ESPERA_DA_BUSCA)
  : aplicarBusca;

function confirmarBusca(termo) {
  if (tem('registrarBusca')) {
    try {
      estado.historico = usar('registrarBusca', estado.historico, termo);
    } catch (erro) {
      console.error(erro);
    }
  }
  aplicarBusca(termo);
}

$('busca').addEventListener('input', (evento) => {
  estado.teclas += 1;
  desenharBuscaInfo();
  buscarComEspera(evento.target.value);
});

$('form-busca').addEventListener('submit', (evento) => {
  evento.preventDefault();
  confirmarBusca($('busca').value);
});

// ---------------------------------------------------------------------------
// Formulário: novo contato e edição
// ---------------------------------------------------------------------------
const CAMPOS = ['nome', 'telefone', 'email', 'aniversario', 'grupo'];

function lerFormulario() {
  const dados = {};
  for (const campo of CAMPOS) dados[campo] = $(`campo-${campo}`).value.trim();
  return dados;
}

function mostrarErros(errosDoForm) {
  let primeiro = null;
  for (const campo of CAMPOS) {
    const mensagem = errosDoForm[campo] || '';
    $(`erro-${campo}`).textContent = mensagem;
    $(`campo-${campo}`).setAttribute('aria-invalid', String(mensagem !== ''));
    if (mensagem !== '' && primeiro === null) primeiro = $(`campo-${campo}`);
  }
  if (primeiro !== null) primeiro.focus();
  return primeiro === null;
}

function limparFormulario() {
  $('form-contato').reset();
  mostrarErros({});
  estado.editando = null;
  $('titulo-form').textContent = 'Novo contato';
  $('salvar').textContent = 'Salvar contato';
  $('cancelar').hidden = true;
  $('aviso-form').textContent = '';
}

function abrirEdicao(contato) {
  limparFormulario();
  estado.editando = contato.id;
  for (const campo of CAMPOS) $(`campo-${campo}`).value = contato[campo] || '';
  $('titulo-form').textContent = `Editar ${contato.nome}`;
  $('salvar').textContent = 'Salvar alterações';
  $('cancelar').hidden = false;
  $('painel-form').open = true;
  $('painel-form').scrollIntoView({ behavior: 'smooth', block: 'start' });
  $('campo-nome').focus({ preventScroll: true });
}

$('form-contato').addEventListener('submit', (evento) => {
  evento.preventDefault();
  const dados = lerFormulario();
  try {
    if (tem('validarContato')) {
      if (!mostrarErros(usar('validarContato', dados))) return;
    } else {
      $('aviso-form').textContent =
        'Sem validarContato (E10): o contato foi salvo sem conferir os campos.';
    }
    const antes = estado.lista;
    if (estado.editando !== null) {
      estado.lista = usar('editarContato', estado.lista, estado.editando, dados);
      limparFormulario();
      avisar(`${dados.nome} foi atualizado.`, antes);
    } else {
      if (!tem('adicionarContato')) {
        $('aviso-form').textContent = 'Falta adicionarContato (E09) no src/index.js.';
        return;
      }
      estado.lista = usar('adicionarContato', estado.lista, dados);
      limparFormulario();
      avisar(`${dados.nome} entrou na agenda.`, antes);
    }
  } catch (erro) {
    console.error(erro);
    $('aviso-form').textContent = `Erro: ${erro.message}. Detalhes no Console (F12).`;
    desenharStatus();
  }
});

$('cancelar').addEventListener('click', () => {
  limparFormulario();
  $('painel-form').open = false;
});

$('desfazer').addEventListener('click', () => {
  estado.lista = estado.desfazer.lista;
  estado.desfazer = null;
  render();
});

// ---------------------------------------------------------------------------
// Começo: o src/index.js carregou, então some o aviso e aparece a agenda
// ---------------------------------------------------------------------------
$('carregando').hidden = true;
$('app').hidden = false;
render();
// Com alguma função faltando ou com erro, o painel já abre mostrando qual.
$('status').open = desenharStatus() < NOMES.length;
