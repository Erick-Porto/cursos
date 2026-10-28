// Racha-conta: interface pronta do Projeto 1 (Programador Mobile).
//
// Você não precisa mudar este arquivo. Ele lê o formulário, chama as SUAS funções de
// src/regras/conta.js e mostra o resultado na página. Se uma conta sair errada, o problema
// está numa função sua: escreva um teste para o caso e corrija lá.
//
// Abra com o servidor, na raiz do repositório: npx serve . e http://localhost:3000/web/

// Este arquivo roda no navegador. A linha abaixo avisa ao ESLint do projeto, configurado
// para o Node, que estes nomes existem aqui: assim o npm run lint passa sem mudar nada.
/* global document, location, window */

const CAMINHO_DAS_REGRAS = '../src/regras/conta.js';

// As funções que a página usa, com os nomes e as assinaturas do enunciado.
const FUNCOES = [
  { nome: 'lerValor', uso: 'lerValor(texto)', devolve: 'centavos, ou null se o texto não vale' },
  { nome: 'lerPessoas', uso: 'lerPessoas(texto)', devolve: 'número de 1 a 50, ou null' },
  { nome: 'calcularGorjeta', uso: 'calcularGorjeta(subtotal, percentual)', devolve: 'centavos' },
  { nome: 'dividirConta', uso: 'dividirConta(total, pessoas)', devolve: 'lista de centavos' },
  { nome: 'formatarReais', uso: 'formatarReais(centavos)', devolve: "texto: 'R$ 187,50'" },
  { nome: 'formatarDataHora', uso: 'formatarDataHora(data)', devolve: "texto: '28/10/2026 19:42'" },
  { nome: 'montarRecibo', uso: 'montarRecibo(dados)', devolve: 'o recibo, em texto' },
];

// Sem estas, a página não consegue dividir a conta. Sem o montarRecibo, só falta o recibo.
const ESSENCIAIS = ['lerValor', 'lerPessoas', 'calcularGorjeta', 'dividirConta', 'formatarReais'];

// Ícones do lucide (check, x e circle-alert), desenhados com traço.
const ICONES = {
  ok: '<path d="M20 6 9 17l-5-5" />',
  falta: '<path d="M18 6 6 18" /><path d="m6 6 12 12" />',
  alerta: '<circle cx="12" cy="12" r="10" /><path d="M12 8v4" /><path d="M12 16h.01" />',
};

const aviso = document.querySelector('#aviso');
const avisoTitulo = document.querySelector('#aviso-titulo');
const avisoTexto = document.querySelector('#aviso-texto');
const formulario = document.querySelector('#formulario');
const campoRestaurante = document.querySelector('#restaurante');
const campoValor = document.querySelector('#valor');
const campoPessoas = document.querySelector('#pessoas');
const erroValor = document.querySelector('#valor-erro');
const erroPessoas = document.querySelector('#pessoas-erro');
const botaoDividir = document.querySelector('#dividir');
const resultado = document.querySelector('#resultado');
const secaoRecibo = document.querySelector('#secao-recibo');
const recibo = document.querySelector('#recibo');
const botaoCopiar = document.querySelector('#copiar');
const listaFuncoes = document.querySelector('#lista-funcoes');

let regras = {};

function icone(nome) {
  return `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true">${ICONES[nome]}</svg>`;
}

// Mostra um valor do jeito que ele aparece no código: 'texto', 42, null, undefined.
function comoCodigo(valor) {
  if (typeof valor === 'string') return `'${valor}'`;
  if (Array.isArray(valor)) return `[${valor.map(comoCodigo).join(', ')}]`;
  return String(valor);
}

function criar(tag, texto, classe) {
  const elemento = document.createElement(tag);
  if (texto !== undefined) elemento.textContent = texto;
  if (classe) elemento.className = classe;
  return elemento;
}

// ---------------------------------------------------------------- avisos

function mostrarAviso(titulo, paragrafos, detalhe) {
  avisoTitulo.textContent = titulo;
  avisoTexto.replaceChildren();
  for (const texto of paragrafos) avisoTexto.append(criar('p', texto));
  if (detalhe) {
    const p = criar('p');
    p.append('Mensagem do navegador: ', criar('code', detalhe));
    avisoTexto.append(p);
  }
  aviso.hidden = false;
}

function esconderAviso() {
  aviso.hidden = true;
}

function mostrarErroNoCampo(campo, erro, mensagem) {
  erro.innerHTML = `${icone('alerta')}<span></span>`;
  erro.querySelector('span').textContent = mensagem;
  erro.hidden = false;
  campo.setAttribute('aria-invalid', 'true');
}

function limparErrosDosCampos() {
  for (const [campo, erro] of [
    [campoValor, erroValor],
    [campoPessoas, erroPessoas],
  ]) {
    erro.hidden = true;
    campo.removeAttribute('aria-invalid');
  }
}

// ---------------------------------------------------------------- carregar as regras

function listarFuncoes() {
  listaFuncoes.replaceChildren();
  for (const funcao of FUNCOES) {
    const existe = typeof regras[funcao.nome] === 'function';
    const item = criar('li', undefined, existe ? 'ok' : 'falta');
    item.innerHTML = icone(existe ? 'ok' : 'falta');
    const texto = criar('div');
    texto.append(criar('code', funcao.uso));
    texto.append(
      criar('small', `${existe ? 'Encontrada' : 'Não encontrada'}. Devolve ${funcao.devolve}.`),
    );
    item.append(texto);
    listaFuncoes.append(item);
  }
}

async function carregarRegras() {
  if (location.protocol === 'file:') {
    listarFuncoes();
    return; // o aviso do HTML já explica como abrir pelo servidor
  }

  try {
    // o ?v= faz o navegador buscar a versão mais nova do seu arquivo a cada recarga
    regras = await import(`${CAMINHO_DAS_REGRAS}?v=${Date.now()}`);
  } catch (erro) {
    listarFuncoes();
    mostrarAviso(
      'Não deu para importar src/regras/conta.js',
      [
        'Confira três coisas: o arquivo existe em src/regras/conta.js; o servidor foi aberto na raiz do repositório (a pasta do package.json), e não dentro de web/; e o arquivo não tem erro de sintaxe (rode npm test).',
        'As regras também rodam no navegador: elas não podem importar node:fs nem outro módulo do Node. Quem lê arquivo é o script de terminal.',
      ],
      erro.message,
    );
    return;
  }

  listarFuncoes();
  const faltando = FUNCOES.filter((f) => typeof regras[f.nome] !== 'function').map((f) => f.nome);
  const faltamEssenciais = faltando.some((nome) => ESSENCIAIS.includes(nome));
  botaoDividir.disabled = faltamEssenciais;

  if (faltando.length === 0) {
    esconderAviso();
  } else {
    mostrarAviso(`Faltam funções em src/regras/conta.js: ${faltando.join(', ')}`, [
      faltamEssenciais
        ? 'Sem elas, a página não consegue dividir a conta.'
        : 'A divisão já funciona; falta só o que o recibo usa.',
      'Confira o nome, letra por letra, e o export antes de cada função. A lista no fim da página mostra o que foi encontrado.',
    ]);
  }
}

// ---------------------------------------------------------------- chamar as funções do aluno

// Chama uma função de conta.js. Se ela lançar um erro, a mensagem diz qual foi.
function chamar(nome, ...argumentos) {
  if (typeof regras[nome] !== 'function') {
    throw new Error(`A função ${nome} não existe em src/regras/conta.js.`);
  }
  try {
    return regras[nome](...argumentos);
  } catch (erro) {
    const chamada = `${nome}(${argumentos.map(comoCodigo).join(', ')})`;
    throw new Error(`${chamada} lançou um erro: ${erro.message}`, { cause: erro });
  }
}

function exigirCentavos(nome, valor, ouNull = '') {
  if (!Number.isInteger(valor)) {
    throw new Error(
      `${nome} devolveu ${comoCodigo(valor)}; o esperado é um número inteiro de centavos${ouNull}.`,
    );
  }
}

function emReais(centavos) {
  const texto = chamar('formatarReais', centavos);
  if (typeof texto !== 'string') {
    throw new Error(
      `formatarReais(${centavos}) devolveu ${comoCodigo(texto)}; o esperado é um texto.`,
    );
  }
  return texto;
}

function percentualEscolhido() {
  return Number(formulario.querySelector('input[name="gorjeta"]:checked').value);
}

// ---------------------------------------------------------------- dividir

function dividir(rolar) {
  limparErrosDosCampos();
  const textoValor = campoValor.value;
  const textoPessoas = campoPessoas.value;

  const subtotal = chamar('lerValor', textoValor);
  const pessoas = chamar('lerPessoas', textoPessoas);

  if (subtotal !== null) {
    const chamada = `lerValor(${comoCodigo(textoValor)})`;
    exigirCentavos(chamada, subtotal, ', ou null quando o texto não vale');
  }
  if (pessoas !== null && !(Number.isInteger(pessoas) && pessoas >= 1 && pessoas <= 50)) {
    throw new Error(
      `lerPessoas(${comoCodigo(textoPessoas)}) devolveu ${comoCodigo(pessoas)}; o esperado é um número inteiro de 1 a 50, ou null.`,
    );
  }

  if (subtotal === null) {
    mostrarErroNoCampo(campoValor, erroValor, 'Valor inválido. Digite como 187,50 ou R$ 187,50.');
  }
  if (pessoas === null) {
    mostrarErroNoCampo(campoPessoas, erroPessoas, 'Digite um número inteiro de 1 a 50.');
  }
  if (subtotal === null || pessoas === null) {
    resultado.hidden = true;
    secaoRecibo.hidden = true;
    (subtotal === null ? campoValor : campoPessoas).focus();
    return;
  }

  const percentual = percentualEscolhido();
  const gorjeta = chamar('calcularGorjeta', subtotal, percentual);
  exigirCentavos(`calcularGorjeta(${subtotal}, ${percentual})`, gorjeta);
  const total = subtotal + gorjeta;

  const partes = chamar('dividirConta', total, pessoas);
  if (!Array.isArray(partes) || partes.length !== pessoas) {
    throw new Error(
      `dividirConta(${total}, ${pessoas}) devolveu ${comoCodigo(partes)}; o esperado é uma lista com ${pessoas} partes.`,
    );
  }
  for (const parte of partes) exigirCentavos(`dividirConta(${total}, ${pessoas})`, parte);

  mostrarResultado(subtotal, percentual, gorjeta, total, partes);
  mostrarRecibo(subtotal, percentual, pessoas);
  esconderAvisoSeTudoExiste();

  if (rolar) {
    const semMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    resultado.scrollIntoView({ behavior: semMovimento ? 'auto' : 'smooth', block: 'start' });
  }
}

function mostrarResultado(subtotal, percentual, gorjeta, total, partes) {
  document.querySelector('#subtotal').textContent = emReais(subtotal);
  document.querySelector('#rotulo-gorjeta').textContent =
    percentual === 0 ? 'Sem gorjeta' : `Gorjeta (${percentual}%)`;
  document.querySelector('#gorjeta').textContent = emReais(gorjeta);
  document.querySelector('#total').textContent = emReais(total);

  const lista = document.querySelector('#partes');
  lista.replaceChildren();
  partes.forEach((parte, i) => {
    const item = criar('li');
    item.append(criar('span', `Pessoa ${i + 1}`), criar('strong', emReais(parte)));
    lista.append(item);
  });

  // a promessa da divisão: as partes somam o total, e diferem em no máximo 1 centavo,
  // com os centavos a mais nas primeiras pessoas
  let soma = 0;
  let emOrdem = true;
  partes.forEach((parte, i) => {
    soma += parte;
    if (i > 0 && (parte > partes[i - 1] || partes[0] - parte > 1)) emOrdem = false;
  });

  const conferencia = document.querySelector('#conferencia');
  if (soma !== total) {
    conferencia.className = 'conferencia problema';
    conferencia.innerHTML = `${icone('alerta')}<span></span>`;
    conferencia.querySelector('span').textContent =
      `As partes somam ${emReais(soma)}, mas o total é ${emReais(total)}. Confira o dividirConta: os centavos que sobram vão para as primeiras pessoas.`;
  } else if (!emOrdem) {
    conferencia.className = 'conferencia problema';
    conferencia.innerHTML = `${icone('alerta')}<span></span>`;
    conferencia.querySelector('span').textContent =
      'A soma fecha, mas as partes deveriam diferir em no máximo 1 centavo, com os centavos a mais nas primeiras pessoas.';
  } else {
    conferencia.className = 'conferencia';
    conferencia.innerHTML = `${icone('ok')}<span></span>`;
    const quantas = partes.length === 1 ? 'A parte soma' : `As ${partes.length} partes somam`;
    conferencia.querySelector('span').textContent =
      `${quantas} ${emReais(soma)}, o total da conta. Nenhum centavo sumiu.`;
  }
  resultado.hidden = false;
}

function mostrarRecibo(subtotal, percentual, pessoas) {
  secaoRecibo.hidden = false;
  if (typeof regras.montarRecibo !== 'function') {
    recibo.textContent =
      'O recibo aparece aqui quando o montarRecibo existir em src/regras/conta.js.';
    botaoCopiar.hidden = true;
    return;
  }
  const texto = chamar('montarRecibo', {
    restaurante: campoRestaurante.value.trim() || 'Racha-conta',
    subtotal: subtotal,
    percentual: percentual,
    pessoas: pessoas,
    data: new Date(),
  });
  if (typeof texto !== 'string') {
    throw new Error(`montarRecibo devolveu ${comoCodigo(texto)}; o esperado é um texto.`);
  }
  recibo.textContent = texto;
  botaoCopiar.hidden = false;
}

function esconderAvisoSeTudoExiste() {
  if (FUNCOES.every((f) => typeof regras[f.nome] === 'function')) esconderAviso();
}

function tentarDividir(rolar) {
  try {
    dividir(rolar);
  } catch (erro) {
    resultado.hidden = true;
    secaoRecibo.hidden = true;
    mostrarAviso('Uma das suas funções não fez o combinado', [
      erro.message,
      'Escreva um teste com essa entrada, veja o vermelho e corrija a função. O Console do navegador (F12) mostra a linha do erro.',
    ]);
    aviso.scrollIntoView({ block: 'start' });
    console.error(erro);
  }
}

// ---------------------------------------------------------------- eventos

formulario.addEventListener('submit', (evento) => {
  evento.preventDefault();
  tentarDividir(true);
});

// trocar a gorjeta ou as pessoas depois do primeiro resultado refaz a conta na hora
formulario.addEventListener('change', (evento) => {
  if (evento.target.name === 'gorjeta' && !resultado.hidden) tentarDividir(false);
});

for (const botao of document.querySelectorAll('.passo')) {
  botao.addEventListener('click', () => {
    const atual = parseInt(campoPessoas.value, 10);
    const proximo = (Number.isNaN(atual) ? 1 : atual) + Number(botao.dataset.passo);
    campoPessoas.value = String(Math.min(Math.max(proximo, 1), 50));
    if (!resultado.hidden) tentarDividir(false);
  });
}

botaoCopiar.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(recibo.textContent);
    botaoCopiar.textContent = 'Copiado';
  } catch {
    // sem permissão para a área de transferência: seleciona o texto para o Ctrl + C
    window.getSelection().selectAllChildren(recibo);
    botaoCopiar.textContent = 'Selecionado';
  }
  setTimeout(() => {
    botaoCopiar.textContent = 'Copiar';
  }, 2000);
});

carregarRegras();
