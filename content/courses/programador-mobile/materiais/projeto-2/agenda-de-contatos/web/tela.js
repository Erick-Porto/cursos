// Agenda de contatos: a página pronta do Projeto 2 (Programador Mobile).
//
// Você não precisa mudar este arquivo. Ele lê o que a pessoa digita, chama as SUAS funções
// de src/regras/ e desenha o resultado na página. Se algo sair errado, o problema está numa
// função sua: escreva um teste para o caso e corrija lá.
//
// Abra pelo servidor, na raiz do projeto: npx serve . e depois http://localhost:3000/web/

// Os arquivos que a página importa. Os nomes e as pastas são os do kit.
const ARQUIVOS = [
  { chave: 'dados', caminho: '../src/data/contatos.js' },
  { chave: 'contato.js', caminho: '../src/regras/contato.js' },
  { chave: 'lista.js', caminho: '../src/regras/lista.js' },
  { chave: 'edicao.js', caminho: '../src/regras/edicao.js' },
  { chave: 'validacao.js', caminho: '../src/regras/validacao.js' },
];

const ENCONTROS = { 1: 'E13', 2: 'E14', 3: 'E15', 4: 'E16' };

// As funções que a página usa, com os nomes, os arquivos e as etapas do enunciado.
const FUNCOES = [
  { nome: 'criarContato', arquivo: 'contato.js', etapa: 1, uso: 'criarContato(id, dados)', onde: 'monta a ficha do contato novo (o adicionarContato usa)' },
  { nome: 'descreverContato', arquivo: 'contato.js', etapa: 1, uso: 'descreverContato(contato)', onde: 'o botão Copiar de cada contato' },
  { nome: 'formatarAniversario', arquivo: 'contato.js', etapa: 1, uso: 'formatarAniversario(contato)', onde: 'o aniversário de cada contato' },
  { nome: 'nomesDosContatos', arquivo: 'lista.js', etapa: 2, uso: 'nomesDosContatos(contatos)', onde: 'as sugestões do campo de busca' },
  { nome: 'buscarPorId', arquivo: 'lista.js', etapa: 2, uso: 'buscarPorId(contatos, id)', onde: 'o botão Editar' },
  { nome: 'buscarContatos', arquivo: 'lista.js', etapa: 2, uso: 'buscarContatos(contatos, termo)', onde: 'o campo de busca' },
  { nome: 'ordenarPorNome', arquivo: 'lista.js', etapa: 2, uso: 'ordenarPorNome(contatos)', onde: 'a lista em ordem alfabética' },
  { nome: 'agruparPorLetra', arquivo: 'lista.js', etapa: 3, uso: 'agruparPorLetra(contatos)', onde: 'as letras da lista' },
  { nome: 'aniversariantesDoMes', arquivo: 'lista.js', etapa: 3, uso: 'aniversariantesDoMes(contatos, mes)', onde: 'os aniversariantes do mês' },
  { nome: 'proximoId', arquivo: 'edicao.js', etapa: 3, uso: 'proximoId(contatos)', onde: 'o id do contato novo (o adicionarContato usa)' },
  { nome: 'adicionarContato', arquivo: 'edicao.js', etapa: 3, uso: 'adicionarContato(contatos, dados)', onde: 'o botão Salvar contato' },
  { nome: 'removerContato', arquivo: 'edicao.js', etapa: 3, uso: 'removerContato(contatos, id)', onde: 'o botão Remover' },
  { nome: 'editarContato', arquivo: 'edicao.js', etapa: 3, uso: 'editarContato(contatos, id, mudancas)', onde: 'o botão Salvar alterações' },
  { nome: 'validarContato', arquivo: 'validacao.js', etapa: 4, uso: 'validarContato(dados)', onde: 'os problemas do formulário (export default)' },
];

// Para ir além: a página usa se existirem, e não reclama se faltarem.
const EXTRAS = [
  { nome: 'contarPorGrupo', arquivo: 'lista.js', uso: 'contarPorGrupo(contatos)', onde: 'quantos contatos em cada grupo, no topo' },
  { nome: 'alternarFavorito', arquivo: 'edicao.js', uso: 'alternarFavorito(contatos, id)', onde: 'a estrela de cada contato' },
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

// Ícones do lucide, desenhados com traço.
const ICONES = {
  ok: '<path d="M20 6 9 17l-5-5" />',
  falta: '<circle cx="12" cy="12" r="10" />',
  erro: '<circle cx="12" cy="12" r="10" /><path d="M12 8v4" /><path d="M12 16h.01" />',
  estrela:
    '<path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />',
  copiar:
    '<rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />',
  editar:
    '<path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" /><path d="m15 5 4 4" />',
  remover:
    '<path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" />',
};

// ---------------------------------------------------------------- elementos da página

const $ = (seletor) => document.querySelector(seletor);

const aviso = $('#aviso');
const avisoTitulo = $('#aviso-titulo');
const avisoTexto = $('#aviso-texto');
const app = $('#app');
const resumo = $('#resumo');
const painel = $('#status');
const painelTitulo = $('#status-titulo');
const painelLista = $('#status-lista');
const campoBusca = $('#busca');
const buscaDica = $('#busca-dica');
const sugestoes = $('#sugestoes');
const tituloAniversarios = $('#t-aniversarios');
const caixaAniversarios = $('#aniversariantes');
const painelForm = $('#painel-form');
const tituloForm = $('#titulo-form');
const formulario = $('#form-contato');
const campoNome = $('#campo-nome');
const campoTelefone = $('#campo-telefone');
const campoEmail = $('#campo-email');
const campoGrupo = $('#campo-grupo');
const campoDia = $('#campo-dia');
const campoMes = $('#campo-mes');
const caixaErros = $('#erros-form');
const listaErros = $('#erros-lista');
const avisoForm = $('#aviso-form');
const botaoSalvar = $('#salvar');
const botaoCancelar = $('#cancelar');
const mensagem = $('#mensagem');
const mensagemTexto = $('#mensagem-texto');
const botaoDesfazer = $('#desfazer');
const tituloLista = $('#t-lista');
const notasLista = $('#notas-lista');
const caixaLista = $('#lista');

// ---------------------------------------------------------------- estado da página

const regras = {}; // nome da função -> a função
const ondeEsta = {}; // nome da função -> arquivo em que a página achou
let validarSemDefault = false; // validarContato exportada com nome, e não como default
const falhas = []; // arquivos que não carregaram: { caminho, mensagem }
const errosDaTela = new Map(); // erros ao desenhar; limpos a cada desenho
const errosDasAcoes = new Map(); // erros de cliques e do formulário
const rasuras = new Map(); // funções que mudaram o que receberam

const estado = {
  lista: [],
  termo: '',
  editando: null, // id do contato no formulário, ou null para um contato novo
  desfazer: null, // a lista de antes da última mudança, para o Desfazer
};

// ---------------------------------------------------------------- ajudantes

function criar(tag, texto, classe) {
  const elemento = document.createElement(tag);
  if (texto !== undefined && texto !== null) elemento.textContent = texto;
  if (classe) elemento.className = classe;
  return elemento;
}

function icone(nome) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('class', 'ico');
  svg.setAttribute('aria-hidden', 'true');
  svg.innerHTML = ICONES[nome];
  return svg;
}

function tem(nome) {
  return typeof regras[nome] === 'function';
}

function infoDa(nome) {
  return FUNCOES.find((f) => f.nome === nome) || EXTRAS.find((f) => f.nome === nome);
}

// Mostra um valor do jeito que ele aparece no código: 'texto', 42, null, [3 itens].
function resumir(valor) {
  if (typeof valor === 'string') return `'${valor}'`;
  if (Array.isArray(valor)) return `[${valor.length} itens]`;
  if (valor === null) return 'null';
  if (typeof valor === 'object') {
    const texto = JSON.stringify(valor);
    return texto.length > 70 ? `${texto.slice(0, 67)}...` : texto;
  }
  return String(valor);
}

function fotografar(valor) {
  if (valor === null || typeof valor !== 'object') return null;
  return JSON.stringify(valor);
}

function erroDe(nome, texto) {
  const erro = new Error(texto);
  erro.funcao = nome;
  return erro;
}

// Chama uma função sua. Se ela lançar um erro, a mensagem diz qual foi; se ela mudar
// a lista ou o contato que recebeu, a página avisa: o Desfazer depende disso.
function chamar(nome, ...argumentos) {
  if (!tem(nome)) throw erroDe(nome, `A função ${nome} não existe.`);
  const fotos = argumentos.map(fotografar);
  let resultado;
  try {
    resultado = regras[nome](...argumentos);
  } catch (erro) {
    console.error(erro);
    const chamada = `${nome}(${argumentos.map(resumir).join(', ')})`;
    throw erroDe(nome, `${chamada} lançou um erro: ${erro.message}`);
  }
  argumentos.forEach((argumento, i) => {
    if (fotos[i] !== null && fotografar(argumento) !== fotos[i]) {
      const oQue = Array.isArray(argumento) ? 'a lista' : 'o objeto';
      rasuras.set(
        nome,
        `${nome} mudou ${oQue} que recebeu. Ela precisa devolver uma lista ou uma ficha nova e deixar a original como estava: sem isso, o Desfazer não funciona.`,
      );
    }
  });
  return resultado;
}

function exigirContatos(nome, valor) {
  if (!Array.isArray(valor)) {
    throw erroDe(nome, `${nome} devolveu ${resumir(valor)}; o esperado é uma lista de contatos.`);
  }
  for (const item of valor) {
    if (item === null || typeof item !== 'object' || typeof item.nome !== 'string') {
      throw erroDe(nome, `${nome} devolveu uma lista com ${resumir(item)}; o esperado é uma lista de contatos.`);
    }
  }
  return valor;
}

function exigirTexto(nome, valor) {
  if (typeof valor !== 'string') {
    throw erroDe(nome, `${nome} devolveu ${resumir(valor)}; o esperado é um texto.`);
  }
  return valor;
}

function registrar(mapa, erro) {
  console.error(erro);
  mapa.set(erro.funcao || 'página', erro.message);
}

// Desenha uma parte da página; se uma função sua der erro, o erro aparece ali.
function desenhar(alvo, montar) {
  try {
    alvo.replaceChildren(...montar());
  } catch (erro) {
    registrar(errosDaTela, erro);
    alvo.replaceChildren(criar('p', `${erro.message} Detalhes no Console (F12).`, 'problema'));
  }
}

// Uma parte da página que espera uma função que ainda não existe.
function pendente(nome, efeito) {
  const info = infoDa(nome);
  const p = criar('p', undefined, 'pendente');
  p.append('Falta ', criar('code', nome), ` (etapa ${info.etapa}, ${ENCONTROS[info.etapa]}, em src/regras/${info.arquivo})`);
  p.append(efeito ? `: ${efeito}.` : '.');
  return p;
}

function iniciais(nome) {
  const partes = nome.trim().split(' ').filter((parte) => parte !== '');
  if (partes.length === 0) return '?';
  const ultima = partes.length > 1 ? partes[partes.length - 1][0] : '';
  return (partes[0][0] + ultima).toUpperCase();
}

// ---------------------------------------------------------------- avisos

function mostrarAviso(titulo, paragrafos) {
  avisoTitulo.textContent = titulo;
  avisoTexto.replaceChildren(...paragrafos.map((texto) => criar('p', texto)));
  aviso.hidden = false;
}

function atualizarAviso() {
  const problemas = [];
  for (const falha of falhas) {
    problemas.push(`Não deu para importar ${falha.caminho}: ${falha.mensagem}`);
  }
  for (const texto of rasuras.values()) problemas.push(texto);
  for (const texto of errosDasAcoes.values()) problemas.push(texto);
  if (problemas.length === 0) {
    aviso.hidden = true;
    return;
  }
  if (falhas.length > 0) {
    problemas.push(
      'Confira o arquivo: um erro de digitação aparece no npm test, com a linha. Um import precisa do .js no fim, e o nome importado precisa ter export no outro arquivo. O Console do navegador (F12) mostra os detalhes.',
    );
  }
  mostrarAviso('Uma parte do seu código não fez o combinado', problemas);
}

// ---------------------------------------------------------------- carregar as funções

function guardar(nome, funcao, arquivo) {
  if (tem(nome)) return;
  regras[nome] = funcao;
  ondeEsta[nome] = arquivo;
}

async function carregar() {
  for (const arquivo of ARQUIVOS) {
    let modulo;
    try {
      // o ?v= faz o navegador buscar a versão mais nova do arquivo a cada recarga
      modulo = await import(`${arquivo.caminho}?v=${Date.now()}`);
    } catch (erro) {
      falhas.push({ caminho: arquivo.caminho.replace('../', ''), mensagem: erro.message });
      continue;
    }
    if (arquivo.chave === 'dados') {
      if (Array.isArray(modulo.contatos)) estado.lista = modulo.contatos;
      else falhas.push({ caminho: 'src/data/contatos.js', mensagem: 'o arquivo não exporta a lista contatos.' });
      continue;
    }
    for (const [nome, valor] of Object.entries(modulo)) {
      if (typeof valor !== 'function') continue;
      if (nome === 'default') {
        if (arquivo.chave === 'validacao.js') guardar('validarContato', valor, arquivo.chave);
        continue;
      }
      if (nome === 'validarContato') validarSemDefault = typeof modulo.default !== 'function';
      guardar(nome, valor, arquivo.chave);
    }
  }
}

// ---------------------------------------------------------------- painel das funções

function situacao(info) {
  const nome = info.nome;
  if (rasuras.has(nome)) return { classe: 'erro', texto: rasuras.get(nome) };
  if (errosDaTela.has(nome)) return { classe: 'erro', texto: errosDaTela.get(nome) };
  if (errosDasAcoes.has(nome)) return { classe: 'erro', texto: errosDasAcoes.get(nome) };
  if (!tem(nome) && falhas.some((falha) => falha.caminho === `src/regras/${info.arquivo}`)) {
    return { classe: 'erro', texto: `O arquivo src/regras/${info.arquivo} não carregou: veja o aviso no topo da página.` };
  }
  if (!tem(nome)) {
    const quando = info.etapa ? `Etapa ${info.etapa} (${ENCONTROS[info.etapa]}), ` : 'Para ir além, ';
    return { classe: 'falta', texto: `Ainda não existe. ${quando}em src/regras/${info.arquivo}: ${info.onde}.` };
  }
  let texto = `Encontrada: ${info.onde}.`;
  if (ondeEsta[nome] !== info.arquivo) {
    texto += ` Ela está em ${ondeEsta[nome]}; o combinado é ${info.arquivo}.`;
  }
  if (nome === 'validarContato' && validarSemDefault) {
    texto += ' Ela tem export com nome; o combinado é export default.';
  }
  return { classe: 'ok', texto };
}

function itemDoPainel(info) {
  const { classe, texto } = situacao(info);
  const item = criar('li', undefined, classe);
  item.append(icone(classe));
  const corpo = criar('div');
  corpo.append(criar('code', info.uso), criar('small', texto));
  item.append(corpo);
  return item;
}

function desenharPainel() {
  const partes = [];
  for (const etapa of [1, 2, 3, 4]) {
    partes.push(criar('h3', `Etapa ${etapa} · ${ENCONTROS[etapa]}`, 'etapa-titulo'));
    const lista = criar('ul', undefined, 'funcoes');
    for (const info of FUNCOES.filter((f) => f.etapa === etapa)) lista.append(itemDoPainel(info));
    partes.push(lista);
  }
  partes.push(criar('h3', 'Para ir além (opcional)', 'etapa-titulo'));
  const extras = criar('ul', undefined, 'funcoes');
  for (const info of EXTRAS) extras.append(itemDoPainel(info));
  partes.push(extras);
  painelLista.replaceChildren(...partes);

  const prontas = FUNCOES.filter((info) => situacao(info).classe === 'ok').length;
  painelTitulo.textContent = `Funções do seu projeto: ${prontas} de ${FUNCOES.length}`;
  return prontas;
}

// ---------------------------------------------------------------- partes da página

function desenharResumo() {
  let texto = `${estado.lista.length} contatos na agenda.`;
  if (tem('contarPorGrupo')) {
    try {
      const contagem = chamar('contarPorGrupo', estado.lista);
      const partes = Object.entries(GRUPOS).map(([chave, rotulo]) => `${rotulo}: ${contagem[chave]}`);
      texto += ` ${partes.join(' · ')}.`;
    } catch (erro) {
      registrar(errosDaTela, erro);
    }
  }
  resumo.textContent = texto;
}

function desenharSugestoes() {
  sugestoes.replaceChildren();
  if (!tem('nomesDosContatos')) return;
  try {
    const nomes = chamar('nomesDosContatos', estado.lista);
    if (!Array.isArray(nomes) || nomes.some((nome) => typeof nome !== 'string')) {
      throw erroDe('nomesDosContatos', `nomesDosContatos devolveu ${resumir(nomes)}; o esperado é uma lista de textos.`);
    }
    for (const nome of nomes) {
      const opcao = criar('option');
      opcao.value = nome;
      sugestoes.append(opcao);
    }
  } catch (erro) {
    registrar(errosDaTela, erro);
  }
}

function desenharBusca() {
  campoBusca.disabled = !tem('buscarContatos');
  if (!tem('buscarContatos')) {
    buscaDica.replaceChildren(pendente('buscarContatos', 'sem ela, a busca fica desligada'));
    return;
  }
  let texto = 'Pelo nome, sem diferenciar maiúsculas, ou por um pedaço do telefone.';
  if (tem('nomesDosContatos')) texto += ' Os nomes aparecem como sugestão enquanto você digita.';
  buscaDica.textContent = texto;
}

function textoDoAniversario(contato) {
  if (tem('formatarAniversario')) {
    return exigirTexto('formatarAniversario', chamar('formatarAniversario', contato));
  }
  const { dia, mes } = contato.aniversario;
  return `${String(dia).padStart(2, '0')}/${String(mes).padStart(2, '0')}`;
}

function desenharAniversariantes() {
  const mes = new Date().getMonth() + 1;
  tituloAniversarios.textContent = `Aniversariantes de ${MESES[mes - 1]}`;
  desenhar(caixaAniversarios, () => {
    if (!tem('aniversariantesDoMes')) return [pendente('aniversariantesDoMes')];
    const lista = exigirContatos('aniversariantesDoMes', chamar('aniversariantesDoMes', estado.lista, mes));
    for (const contato of lista) {
      if (contato.aniversario === null || contato.aniversario.mes !== mes) {
        throw erroDe(
          'aniversariantesDoMes',
          `aniversariantesDoMes(lista, ${mes}) devolveu ${contato.nome}, que não faz aniversário em ${MESES[mes - 1]}.`,
        );
      }
    }
    if (lista.length === 0) return [criar('p', `Ninguém faz aniversário em ${MESES[mes - 1]}.`, 'vazio')];
    const itens = lista.map((contato) => {
      const item = criar('li');
      item.append(criar('span', textoDoAniversario(contato), 'dia'), criar('span', contato.nome));
      return item;
    });
    const ul = criar('ul', undefined, 'aniversarios');
    ul.append(...itens);
    return [ul];
  });
}

function botaoIcone(nomeDoIcone, rotulo, aoClicar, classe) {
  const botao = criar('button', undefined, classe ? `botao-icone ${classe}` : 'botao-icone');
  botao.type = 'button';
  botao.setAttribute('aria-label', rotulo);
  botao.title = rotulo;
  botao.append(icone(nomeDoIcone));
  botao.addEventListener('click', () => {
    try {
      aoClicar();
    } catch (erro) {
      registrar(errosDasAcoes, erro);
      desenharPainel();
      atualizarAviso();
      aviso.scrollIntoView({ block: 'start' });
    }
  });
  return botao;
}

function cartao(contato) {
  const dados = criar('div', undefined, 'dados');
  const nome = criar('p', contato.nome, 'nome');
  if (contato.favorito === true && !tem('alternarFavorito')) {
    const estrela = icone('estrela');
    estrela.setAttribute('aria-hidden', 'false');
    estrela.setAttribute('role', 'img');
    estrela.setAttribute('aria-label', 'favorito');
    nome.append(estrela);
  }
  dados.append(nome, criar('p', contato.telefone, 'detalhe'));
  if (contato.email) dados.append(criar('p', contato.email, 'detalhe'));
  if (tem('formatarAniversario')) {
    dados.append(criar('p', `Aniversário: ${textoDoAniversario(contato)}`, 'detalhe'));
  }
  dados.append(criar('span', GRUPOS[contato.grupo] || contato.grupo, `grupo ${contato.grupo}`));

  const botoes = criar('div', undefined, 'botoes');
  if (tem('alternarFavorito')) {
    const estrela = botaoIcone('estrela', `Favorito: ${contato.nome}`, () => alternarFavorito(contato));
    estrela.setAttribute('aria-pressed', String(contato.favorito === true));
    botoes.append(estrela);
  }
  if (tem('descreverContato')) {
    botoes.append(botaoIcone('copiar', `Copiar ${contato.nome}`, () => copiar(contato)));
  }
  if (tem('buscarPorId') && tem('editarContato')) {
    botoes.append(botaoIcone('editar', `Editar ${contato.nome}`, () => abrirEdicao(contato.id)));
  }
  if (tem('removerContato')) {
    botoes.append(botaoIcone('remover', `Remover ${contato.nome}`, () => remover(contato), 'remover'));
  }

  const item = criar('li', undefined, 'contato');
  const avatar = criar('span', iniciais(contato.nome), 'avatar');
  avatar.setAttribute('aria-hidden', 'true');
  item.append(avatar, dados, botoes);
  return item;
}

function listaDeCartoes(contatos) {
  const ul = criar('ul', undefined, 'contatos');
  ul.append(...contatos.map(cartao));
  return ul;
}

function desenharLista() {
  const notas = [];
  const buscando = estado.termo.trim() !== '' && tem('buscarContatos');
  tituloLista.textContent = buscando ? 'Resultado da busca' : 'Contatos';
  desenhar(caixaLista, () => {
    let visiveis = estado.lista;
    if (buscando) {
      visiveis = exigirContatos('buscarContatos', chamar('buscarContatos', estado.lista, estado.termo));
    }
    if (tem('ordenarPorNome')) {
      visiveis = exigirContatos('ordenarPorNome', chamar('ordenarPorNome', visiveis));
    } else {
      notas.push(pendente('ordenarPorNome', 'a lista fica na ordem do arquivo'));
    }
    tituloLista.textContent += ` (${visiveis.length})`;
    if (!tem('agruparPorLetra')) notas.push(pendente('agruparPorLetra', 'a lista fica sem as letras'));
    if (visiveis.length === 0) return [criar('p', 'Nenhum contato encontrado.', 'vazio')];
    if (!tem('agruparPorLetra')) return [listaDeCartoes(visiveis)];

    const grupos = chamar('agruparPorLetra', visiveis);
    if (grupos === null || typeof grupos !== 'object' || Array.isArray(grupos)) {
      throw erroDe('agruparPorLetra', `agruparPorLetra devolveu ${resumir(grupos)}; o esperado é um objeto como { A: [...], B: [...] }.`);
    }
    const partes = [];
    let total = 0;
    for (const [letra, daLetra] of Object.entries(grupos)) {
      exigirContatos('agruparPorLetra', daLetra);
      total += daLetra.length;
      partes.push(criar('h3', letra, 'letra'), listaDeCartoes(daLetra));
    }
    if (total !== visiveis.length) {
      throw erroDe('agruparPorLetra', `agruparPorLetra recebeu ${visiveis.length} contatos e devolveu ${total} nas letras.`);
    }
    return partes;
  });
  notasLista.replaceChildren(...notas);
}

function desenharMensagem(texto, comDesfazer) {
  mensagemTexto.textContent = texto;
  botaoDesfazer.hidden = !comDesfazer;
  mensagem.hidden = false;
}

function desenharFormulario() {
  avisoForm.textContent = tem('validarContato')
    ? ''
    : 'Sem o validarContato (etapa 4, E16), o contato é salvo sem conferir os campos.';
}

function render() {
  errosDaTela.clear();
  desenharResumo();
  desenharSugestoes();
  desenharBusca();
  desenharAniversariantes();
  desenharLista();
  desenharFormulario();
  const prontas = desenharPainel();
  atualizarAviso();
  return prontas;
}

// ---------------------------------------------------------------- mudanças na agenda

// Troca a lista por uma nova, guardando a de antes para o Desfazer.
function trocarLista(nome, nova, texto) {
  exigirContatos(nome, nova);
  errosDasAcoes.delete(nome);
  estado.desfazer = estado.lista;
  estado.lista = nova;
  render();
  desenharMensagem(texto, true);
}

function remover(contato) {
  const nova = chamar('removerContato', estado.lista, contato.id);
  trocarLista('removerContato', nova, `${contato.nome} saiu da agenda.`);
}

function alternarFavorito(contato) {
  const nova = chamar('alternarFavorito', estado.lista, contato.id);
  const texto = contato.favorito ? `${contato.nome} saiu dos favoritos.` : `${contato.nome} entrou nos favoritos.`;
  trocarLista('alternarFavorito', nova, texto);
}

function copiar(contato) {
  const texto = exigirTexto('descreverContato', chamar('descreverContato', contato));
  errosDasAcoes.delete('descreverContato');
  const mostrar = () => desenharMensagem(`Para colar: ${texto}`, false);
  if (navigator.clipboard) {
    navigator.clipboard.writeText(texto).then(() => desenharMensagem(`Copiado: ${texto}`, false), mostrar);
  } else {
    mostrar();
  }
}

botaoDesfazer.addEventListener('click', () => {
  if (estado.desfazer === null) return;
  estado.lista = estado.desfazer;
  estado.desfazer = null;
  mensagem.hidden = true;
  render();
});

// ---------------------------------------------------------------- busca

campoBusca.addEventListener('input', () => {
  estado.termo = campoBusca.value;
  errosDaTela.delete('buscarContatos');
  desenharLista();
  desenharPainel();
});

// ---------------------------------------------------------------- formulário

function preencherSelects() {
  const vazioDia = criar('option', '--');
  vazioDia.value = '';
  campoDia.append(vazioDia);
  for (let dia = 1; dia <= 31; dia++) {
    const opcao = criar('option', String(dia));
    opcao.value = String(dia);
    campoDia.append(opcao);
  }
  const vazioMes = criar('option', '--');
  vazioMes.value = '';
  campoMes.append(vazioMes);
  MESES.forEach((nome, i) => {
    const opcao = criar('option', nome);
    opcao.value = String(i + 1);
    campoMes.append(opcao);
  });
}

// Os dados do formulário, no formato combinado no enunciado.
function lerFormulario() {
  let aniversario = null;
  if (campoDia.value !== '' && campoMes.value !== '') {
    aniversario = { dia: Number(campoDia.value), mes: Number(campoMes.value) };
  }
  return {
    nome: campoNome.value.trim(),
    telefone: campoTelefone.value.trim(),
    email: campoEmail.value.trim(),
    grupo: campoGrupo.value,
    aniversario: aniversario,
  };
}

function mostrarErrosDoForm(titulo, erros) {
  if (erros.length === 0) {
    caixaErros.hidden = true;
    return;
  }
  $('#erros-titulo').textContent = titulo;
  listaErros.replaceChildren(...erros.map((texto) => criar('li', texto)));
  caixaErros.hidden = false;
}

function limparFormulario() {
  formulario.reset();
  mostrarErrosDoForm('', []);
  estado.editando = null;
  tituloForm.textContent = 'Novo contato';
  botaoSalvar.textContent = 'Salvar contato';
  botaoCancelar.hidden = true;
}

function abrirEdicao(id) {
  const contato = chamar('buscarPorId', estado.lista, id);
  if (contato === null || typeof contato !== 'object' || contato.id !== id) {
    throw erroDe('buscarPorId', `buscarPorId(lista, ${id}) devolveu ${resumir(contato)}; o esperado é o contato de id ${id}.`);
  }
  errosDasAcoes.delete('buscarPorId');
  limparFormulario();
  estado.editando = id;
  campoNome.value = contato.nome;
  campoTelefone.value = contato.telefone;
  campoEmail.value = contato.email || '';
  campoGrupo.value = contato.grupo;
  if (contato.aniversario) {
    campoDia.value = String(contato.aniversario.dia);
    campoMes.value = String(contato.aniversario.mes);
  }
  tituloForm.textContent = `Editar ${contato.nome}`;
  botaoSalvar.textContent = 'Salvar alterações';
  botaoCancelar.hidden = false;
  painelForm.open = true;
  painelForm.scrollIntoView({ block: 'start' });
  campoNome.focus({ preventScroll: true });
}

function salvar() {
  if ((campoDia.value === '') !== (campoMes.value === '')) {
    mostrarErrosDoForm('Falta uma parte do aniversário:', [
      'Escolha o dia e o mês, ou deixe os dois em branco.',
    ]);
    return;
  }
  const dados = lerFormulario();
  if (tem('validarContato')) {
    const erros = chamar('validarContato', dados);
    if (!Array.isArray(erros) || erros.some((texto) => typeof texto !== 'string')) {
      throw erroDe('validarContato', `validarContato devolveu ${resumir(erros)}; o esperado é uma lista de textos (vazia quando está tudo certo).`);
    }
    errosDasAcoes.delete('validarContato');
    if (erros.length > 0) {
      mostrarErrosDoForm('Confira antes de salvar:', erros);
      return;
    }
  }
  if (estado.editando !== null) {
    const nova = exigirContatos('editarContato', chamar('editarContato', estado.lista, estado.editando, dados));
    limparFormulario();
    painelForm.open = false;
    trocarLista('editarContato', nova, `${dados.nome} foi atualizado.`);
    return;
  }
  if (!tem('adicionarContato')) {
    mostrarErrosDoForm('Ainda não dá para salvar:', [
      'Falta adicionarContato (etapa 3, E15, em src/regras/edicao.js).',
    ]);
    return;
  }
  const nova = exigirContatos('adicionarContato', chamar('adicionarContato', estado.lista, dados));
  limparFormulario();
  trocarLista('adicionarContato', nova, `${dados.nome} entrou na agenda.`);
}

formulario.addEventListener('submit', (evento) => {
  evento.preventDefault();
  try {
    salvar();
  } catch (erro) {
    registrar(errosDasAcoes, erro);
    mostrarErrosDoForm('Uma função sua não fez o combinado:', [erro.message]);
    desenharPainel();
    atualizarAviso();
  }
});

botaoCancelar.addEventListener('click', () => {
  limparFormulario();
  painelForm.open = false;
});

// ---------------------------------------------------------------- começo

async function comecar() {
  if (location.protocol === 'file:') return; // o aviso do HTML já explica como abrir
  preencherSelects();
  await carregar();
  aviso.hidden = true;
  app.hidden = false;
  const prontas = render();
  painel.open = prontas < FUNCOES.length;
}

comecar();
