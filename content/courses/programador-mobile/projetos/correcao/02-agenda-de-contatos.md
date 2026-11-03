## Como corrigir em 15 minutos

:::steps
1. Clone o repositório numa pasta de correção, rode `npm install` e depois `npm test`. Anote o resultado: ele vai para "Testes".
2. Rode o script de conferência (abaixo), apontando para a pasta do aluno. Cada `FALHA` ou `ERRO` é um caso do enunciado com resultado errado.
3. No terminal, na pasta do aluno: `npm run agenda` e `npm run agenda mar`.
4. `npx serve .` na raiz do aluno e `http://localhost:3000/web/`. Siga o roteiro de uso da página.
5. `git log --reverse --date=short --format="%ad %s"`: o commit do kit e os 4 das etapas, na ordem, e as datas.
6. Leia `src/regras/contato.js`, `lista.js`, `edicao.js`, `grupos.js`, `validacao.js`, os arquivos `.test.js` e o README, nessa ordem.
:::

Repositório que não roda do zero (falta o `package-lock.json`, o `babel.config.json` ou uma pasta do kit) é devolvido para ajuste, não zerado: diga o comando e a mensagem de erro. O `package.json` é o do kit: `"type": "module"`, os scripts `test` e `agenda`, e `jest`, `babel-jest` e `@babel/preset-env` (versão 7) em `devDependencies`. A pasta `web/` precisa ser a do kit, sem mudança: se o aluno editou, compare com a do zip do curso (`materiais/projeto-2/agenda-de-contatos.zip`) e corrija pela versão do curso.

### Conferência das regras

Salve como `conferir-agenda.mjs` **fora** do repositório do aluno, por exemplo na pasta que reúne os clones da turma, e rode `node conferir-agenda.mjs agenda-de-contatos-ana`. O script importa os arquivos de `src/regras/` e compara com os casos do enunciado; ele não mostra como as funções são feitas. Cada caso recebe uma lista nova, igual à do kit: uma função que rasura a lista não estraga os casos seguintes. Uma cópia fica em `privado/projetos/projeto-2/`.

```javascript
// Confere as funções da agenda de um aluno com os casos do enunciado do Projeto 2.
// Uso, fora do repositório do aluno: node conferir-agenda.mjs caminho/do/agenda-de-contatos
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const raiz = path.resolve(process.argv[2] ?? '.');
let falhas = 0;
let casos = 0;

async function carregar(arquivo) {
  try {
    return await import(pathToFileURL(path.join(raiz, arquivo)).href);
  } catch (erro) {
    console.log(`ERRO  não deu para importar ${arquivo}: ${erro.message}`);
    return {};
  }
}

const { contatos: doKit = [] } = await carregar('src/data/contatos.js');
const contato = await carregar('src/regras/contato.js');
const lista = await carregar('src/regras/lista.js');
const edicao = await carregar('src/regras/edicao.js');
const validacao = await carregar('src/regras/validacao.js');
const grupos = await carregar('src/regras/grupos.js');
const f = { ...contato, ...lista, ...edicao, validarContato: validacao.default ?? validacao.validarContato };

// Cada caso recebe uma lista nova, igual à do kit: uma função que rasura não estraga os outros.
const nova = () => structuredClone(doKit);
const ids = (l) => l.map((c) => c.id).join(',');
const nomes = (l) => l.map((c) => c.nome).join(', ');
const rafaela = { nome: ' Rafaela Lopes ', telefone: '(11) 91234-5678', email: '', grupo: 'amigos', aniversario: { dia: 2, mes: 9 } };

function caso(rotulo, calcular, esperado) {
  casos++;
  let obtido;
  try {
    obtido = calcular();
  } catch (erro) {
    falhas++;
    return console.log(`ERRO  ${rotulo}: ${erro.message}`);
  }
  const ok = JSON.stringify(obtido) === JSON.stringify(esperado);
  if (!ok) falhas++;
  console.log(`${ok ? 'ok   ' : 'FALHA'} ${rotulo} -> ${JSON.stringify(obtido)}${ok ? '' : `  (esperado ${JSON.stringify(esperado)})`}`);
}

// Roda a função e responde se a lista recebida ficou igual (true) ou foi rasurada (false).
function naoRasura(nome, ...resto) {
  const l = nova();
  const antes = JSON.stringify(l);
  f[nome](l, ...resto);
  return JSON.stringify(l) === antes;
}

console.log('--- etapa 1 (E13): contato.js');
caso('criarContato(16, dados)', () => f.criarContato(16, rafaela), { id: 16, nome: 'Rafaela Lopes', telefone: '(11) 91234-5678', email: '', grupo: 'amigos', aniversario: { dia: 2, mes: 9 }, favorito: false });
caso('descreverContato(Mariana)', () => f.descreverContato(nova()[0]), 'Mariana Souza, (11) 98765-4321, Amigos');
caso('descreverContato(Helena)', () => f.descreverContato(nova()[2]), 'Helena Martins, (11) 3456-7890, Família');
caso('formatarAniversario(Mariana)', () => f.formatarAniversario(nova()[0]), '30/10');
caso('formatarAniversario(Fernanda)', () => f.formatarAniversario(nova()[8]), '03/03');
caso('formatarAniversario(Daniel, sem data)', () => f.formatarAniversario(nova()[10]), 'sem data');

console.log('--- etapa 2 (E14): lista.js');
caso('nomesDosContatos: 4o nome', () => f.nomesDosContatos(nova())[3], 'Álvaro Mendes');
caso('buscarPorId(4)', () => f.buscarPorId(nova(), 4).nome, 'Álvaro Mendes');
caso('buscarPorId(99) é undefined', () => f.buscarPorId(nova(), 99) === undefined, true);
caso("buscarContatos('ana')", () => ids(f.buscarContatos(nova(), 'ana')), '1,5,7');
caso("buscarContatos('MAR')", () => ids(f.buscarContatos(nova(), 'MAR')), '1,3,15');
caso("buscarContatos('9876')", () => ids(f.buscarContatos(nova(), '9876')), '1,10,11');
caso("buscarContatos('(11) 3456')", () => ids(f.buscarContatos(nova(), '(11) 3456')), '3');
caso("buscarContatos('zé')", () => ids(f.buscarContatos(nova(), 'zé')), '');
caso("buscarContatos('   ') devolve os 15", () => f.buscarContatos(nova(), '   ').length, 15);
caso('ordenarPorNome: ordem', () => ids(f.ordenarPorNome(nova())), '4,7,2,12,11,10,9,8,3,13,5,15,1,14,6');
caso('ordenarPorNome não rasura', () => naoRasura('ordenarPorNome'), true);

console.log('--- etapa 3 (E15): edicao.js e lista.js');
caso('proximoId(kit)', () => f.proximoId(nova()), 16);
caso('proximoId([3, 9, 5])', () => f.proximoId([{ id: 3 }, { id: 9 }, { id: 5 }]), 10);
caso('proximoId([])', () => f.proximoId([]), 1);
caso('adicionarContato: 16o contato', () => f.adicionarContato(nova(), rafaela)[15], { id: 16, nome: 'Rafaela Lopes', telefone: '(11) 91234-5678', email: '', grupo: 'amigos', aniversario: { dia: 2, mes: 9 }, favorito: false });
caso('adicionarContato não rasura', () => naoRasura('adicionarContato', rafaela), true);
caso('removerContato(2)', () => ids(f.removerContato(nova(), 2)), '1,3,4,5,6,7,8,9,10,11,12,13,14,15');
caso('removerContato(99)', () => f.removerContato(nova(), 99).length, 15);
caso('removerContato não rasura', () => naoRasura('removerContato', 2), true);
caso('editarContato(2, grupo trabalho)', () => f.editarContato(nova(), 2, { grupo: 'trabalho' })[1], { ...doKit[1], grupo: 'trabalho' });
caso('editarContato: os outros são os mesmos objetos', () => { const l = nova(); return f.editarContato(l, 2, { grupo: 'trabalho' })[0] === l[0]; }, true);
caso('editarContato não rasura', () => naoRasura('editarContato', 2, { grupo: 'trabalho' }), true);
caso('agruparPorLetra: letras', () => Object.keys(f.agruparPorLetra(f.ordenarPorNome(nova()))).join(''), 'ABCDEFGHJMPR');
caso('agruparPorLetra: A', () => nomes(f.agruparPorLetra(f.ordenarPorNome(nova())).A), 'Álvaro Mendes, Ana Beatriz Costa');
caso('aniversariantesDoMes(10)', () => nomes(f.aniversariantesDoMes(nova(), 10)), 'Juliana Ribeiro, Mariana Souza');
caso('aniversariantesDoMes(3)', () => nomes(f.aniversariantesDoMes(nova(), 3)), 'Fernanda Lima, Bruno Carvalho');
caso('aniversariantesDoMes([Daniel], 1)', () => f.aniversariantesDoMes([nova()[10]], 1).length, 0);
caso('aniversariantesDoMes não rasura', () => naoRasura('aniversariantesDoMes', 3), true);

console.log('--- etapa 4 (E16): validacao.js e grupos.js');
caso('validarContato tem export default', () => typeof validacao.default, 'function');
caso('grupos.js exporta NOMES_DOS_GRUPOS', () => grupos.NOMES_DOS_GRUPOS, { familia: 'Família', amigos: 'Amigos', trabalho: 'Trabalho' });
caso('validarContato: tudo certo', () => f.validarContato({ ...rafaela, nome: 'Ana' }), []);
caso('validarContato: os quatro problemas', () => f.validarContato({ nome: ' ', telefone: '123', email: 'ana@', grupo: 'vizinhos', aniversario: null }), ['Informe o nome', 'O telefone precisa de 10 ou 11 dígitos, com o DDD', 'E-mail inválido', 'Escolha família, amigos ou trabalho']);
caso('validarContato: telefone fixo de 10 dígitos', () => f.validarContato({ ...rafaela, telefone: '(11) 3456-7890' }), []);
caso('validarContato: e-mail certo', () => f.validarContato({ ...rafaela, email: 'ana@exemplo.com' }), []);
caso('validarContato: e-mail sem ponto', () => f.validarContato({ ...rafaela, email: 'ana@exemplo' }), ['E-mail inválido']);

console.log('--- cada função no arquivo combinado (critério Módulos)');
const combinado = {
  'contato.js': [contato, ['criarContato', 'descreverContato', 'formatarAniversario']],
  'lista.js': [lista, ['nomesDosContatos', 'buscarPorId', 'buscarContatos', 'ordenarPorNome', 'agruparPorLetra', 'aniversariantesDoMes']],
  'edicao.js': [edicao, ['proximoId', 'adicionarContato', 'removerContato', 'editarContato']],
};
for (const [arquivo, [modulo, funcoes]] of Object.entries(combinado)) {
  const fora = funcoes.filter((nome) => typeof modulo[nome] !== 'function');
  caso(`${arquivo} tem as suas funções`, () => (fora.length === 0 ? 'todas' : `faltam ${fora.join(', ')}`), 'todas');
}

console.log(`\n${casos - falhas} de ${casos} casos certos.`);
```

São 44 casos; a solução de referência passa em todos. Função com outro nome aparece como `ERRO ... is not a function`: confira se é só o nome (a página também avisa) antes de descontar a regra inteira. Arquivo que não carrega aparece no começo, como `ERRO não deu para importar`, com a mensagem do Node.

### Saídas esperadas no terminal

| Comando | O que deve aparecer |
|---|---|
| `npm test` | verde; a solução de referência tem 39 testes em 5 arquivos (os 4 do kit, em `texto.test.js`, e 35 do aluno) |
| `npm run agenda` | `Agenda: 15 contatos`, `Encontrados: 15`, as 15 linhas em ordem alfabética, de Álvaro a Rafael, como `Daniel Rocha, (21) 98765-0099, Amigos, aniversário sem data`, e depois as 12 letras, de `A: Álvaro Mendes, Ana Beatriz Costa` a `R: Rafael Gomes` |
| `npm run agenda mar` | `Encontrados: 3`, as linhas de Helena, Marcos e Mariana, nessa ordem, e `H: Helena Martins` e `M: Marcos Teixeira, Mariana Souza` |

O script não é uma regra: o texto das linhas pode variar um pouco (o "Pronto quando" de cada etapa dá o esperado). O que conta é ele chamar as funções, e não refazer a busca ou a ordem por conta própria.

### Roteiro de uso da página

| Passo | O que fazer | O que deve aparecer |
|---|---|---|
| 1 | Abrir `http://localhost:3000/web/` | "Funções do seu projeto: 14 de 14", sem aviso vermelho no topo; a lista em ordem, com as letras de A a R |
| 2 | Digitar `mar` na busca | "Resultado da busca (3)": Helena, Marcos e Mariana |
| 3 | Limpar a busca e remover a Mariana | 14 contatos e "Mariana Souza saiu da agenda."; **Desfazer** traz ela de volta |
| 4 | Novo contato, salvar vazio | `Informe o nome`, a mensagem do telefone e `Escolha família, amigos ou trabalho` |
| 5 | Nome, telefone `(11) 91234-5678`, e-mail `rafaela@`, grupo Amigos | só `E-mail inválido`; com `rafaela@exemplo.com`, salva: 16 contatos |
| 6 | Editar o Bruno para Trabalho e salvar; depois, Desfazer | o selo muda para Trabalho e volta para Amigos |

A página diz qual função falhou e por quê, num aviso vermelho no topo e no painel de funções, como `removerContato mudou a lista que recebeu...` ou `aniversariantesDoMes(lista, 11) devolveu Daniel Rocha, que não faz aniversário em novembro.` O texto do aviso é um bom comentário de correção: copie para o aluno. O painel também diz quando uma função está no arquivo errado ("Ela está em edicao.js; o combinado é lista.js") e quando o `validarContato` não tem o `default`.

## Critério por critério

### Regras da agenda (35)

Fonte principal: as seções das etapas 1 a 4 do script de conferência. Depois, leia os arquivos de regras.

| Pontos | Quando |
|---|---|
| 35 | todos os casos das etapas 1 a 4 `ok` (os de "não rasura" contam no critério seguinte) |
| 28 a 32 | uma ou duas bordas erradas: `'zé'` acha todo mundo, `proximoId([])` não dá 1, o Daniel quebra o `aniversariantesDoMes`, `'03/03'` sai `'3/3'` |
| 18 a 25 | uma regra central errada: a busca não ignora maiúsculas, a ordem joga Álvaro e Érica para o fim, o id do contato novo repete, ou a validação tem mensagens diferentes das da tabela |
| 8 a 15 | só as etapas 1 e 2 funcionam |
| 0 | nada importa, ou nenhuma função existe |

Erros comuns:

- `proximoId` com `contatos.length + 1`: dá 16 com os 15 do kit, mas `proximoId([{ id: 3 }, { id: 9 }, { id: 5 }])` dá 4. Na página, depois de uma remoção, o contato novo repete um id
- `sort()` sem `localeCompare`: Álvaro e Érica vão para o fim, porque letra com acento vem depois do Z
- `buscarContatos` sem o `toLowerCase` no termo: `'MAR'` não acha ninguém
- `filter` com a seta de chaves e sem o `return`: a busca devolve `[]`
- `aniversariantesDoMes` sem tirar quem tem `aniversario: null`: `Cannot read properties of null (reading 'mes')`
- `agruparPorLetra` com o `reduce` sem o `{}` no fim: as chaves saem misturadas com `id`, `nome`, `telefone`
- `formatarAniversario` com `dia.padStart`: `dia.padStart is not a function`, porque o `padStart` é de texto
- Mensagens da validação com outro texto ou outra ordem: a página mostra, mas os casos do script falham. Desconte pouco se for só o texto

### Sem rasurar o original (15)

Fonte: os casos `não rasura` do script e os passos 3 e 6 do roteiro da página.

| Pontos | Quando |
|---|---|
| 15 | todos os `não rasura` `ok`; Desfazer funciona depois de remover, salvar e editar; nenhum aviso "mudou a lista que recebeu" |
| 9 a 12 | uma função rasura (em geral o `ordenarPorNome` com `sort` direto na lista, ou o `editarContato` trocando o campo no próprio contato) |
| 3 a 6 | duas ou mais funções rasuram, e o Desfazer não funciona |
| 0 | as mudanças são feitas com `push`, `splice` e atribuição direto na lista do kit |

Erros comuns: `contatos.push(novo); return contatos;` no `adicionarContato`; `splice` no `removerContato`; `contato.grupo = mudancas.grupo` dentro do `map` do `editarContato` (a lista é nova, mas a ficha é a mesma); `sort` sem a cópia `[...contatos]`. O `push` dentro do `reduce` do `agruparPorLetra` **não** é rasura: o objeto e as listas de cada letra nascem ali dentro.

### Testes (20)

Rode `npm test` e leia os quatro arquivos de teste do aluno. A solução de referência tem 35 testes do aluno (39 com os 4 do kit); o número pode variar. Confira cada função e as bordas.

| Pontos | Quando |
|---|---|
| 20 | cada função testada; bordas: termo vazio e `'zé'`, id que não existe, o Daniel sem aniversário, `proximoId([])`, a lista recebida que não muda (adicionar, remover, editar e ordenar) e as mensagens da validação |
| 14 a 17 | falta uma função, ou os testes de "não muda a lista" |
| 8 a 12 | só o caso comum de cada função |
| 0 a 5 | `npm test` vermelho, ou testes sem `expect` |

Erros comuns: `toBe` com lista ou objeto (falha com "serializes to the same string"; o certo é `toEqual`); teste de "não muda" que confere o resultado da função, e não a lista recebida; valor esperado copiado da saída da própria função.

### Módulos e a página web (15)

Fonte: a seção "cada função no arquivo combinado" do script, os casos de `grupos.js` e do default, os `import` de cada arquivo e o painel da página.

| Pontos | Quando |
|---|---|
| 15 | cada função no seu arquivo; `NOMES_DOS_GRUPOS` só em `grupos.js`, importada por `contato.js` e `validacao.js`; `export default function validarContato`; sem `console.log` em `src/regras/`; a página mostra 14 de 14 |
| 10 a 12 | um item falha: uma função no arquivo errado, a ficha dos grupos copiada nos dois arquivos, ou o `validarContato` com `export` de nome |
| 4 a 8 | dois ou três itens falham, ou a página não carrega um dos arquivos |
| 0 | tudo num arquivo só, ou a página não acha nenhuma função |

Confira com `grep -rn "console.log" src/regras` e `grep -rn "Família" src/regras` (o nome com acento aparece só no `grupos.js`). Um `import` sem o `.js` passa no Jest, mas a página não carrega o arquivo: o aviso vermelho diz qual.

### Repositório, commits e README (15)

| Pontos | Quando |
|---|---|
| 15 | repositório público, sem `node_modules`; `Projeto 2: kit da agenda` e os 4 commits de etapa, na ordem, em datas dos encontros E13 a E16 (ou perto delas); README com a frase do aluno, como rodar e o print em `docs/` |
| 10 a 12 | um commit de etapa faltando, ou o README sem o print |
| 5 a 8 | todos os commits num dia só, ou o README ainda igual ao do kit |
| 0 | repositório privado, vazio ou com `node_modules` e nada mais |

## Check-in por etapa

O roteiro de cada encontro reserva 2 a 3 minutos para o check-in. Pergunte quem fez o commit da etapa anterior e abra **um** repositório no projetor. Olhe só a coisa da tabela.

| Encontro | Etapa anterior | O que olhar |
|---|---|---|
| E14 | 1 | `npm test` com 11 verdes; no GitHub, sem `node_modules/` e com o `.gitignore` |
| E15 | 2 | `npm run agenda mar` com Helena, Marcos e Mariana, nessa ordem; o `[...contatos]` no `ordenarPorNome` |
| E16 | 3 | `npm test` com 34 verdes; o `aniversariantesDoMes` tirando os `null` antes de ler o `.mes` |
| E17 | 4 (entrega) | no painel, quantos entregaram; abra um e veja o 14 de 14 na página |

Quem não tem o commit da etapa anterior combina com você quando entrega; a etapa nova não espera.

## Sinais de cópia

- Os cinco commits no mesmo dia, ou um commit só com tudo
- Arquivos de regras idênticos aos de um colega, inclusive nos comentários e nos nomes internos
- Recursos que a turma não viu até o E16: expressões regulares na validação ou na busca, `normalize`, `Map` ou `Set`, `structuredClone`, `forEach`, `??`, `?.`, classes
- Testes que não testam as bordas pedidas, mas o código trata todas
- Aluno que não sabe explicar o próprio `editarContato` ou o `agruparPorLetra`

Como agir: não acuse pelo texto da correção. Marque uma conversa de 5 minutos no próximo encontro e peça para o aluno explicar o `editarContato` linha por linha e mudar uma regra na hora (por exemplo, a busca também procurar no e-mail), rodando os testes. Quem fez explica e muda em minutos. Se não explicar, a nota dos critérios de código fica suspensa até uma nova entrega, feita por ele, com o histórico de commits. Commits num dia só, com explicação boa, perdem só os pontos de commits.

## Como devolver para ajustes

Devolva quando um ajuste pequeno leva o projeto a 70 ou mais: uma função com nome errado ou no arquivo errado, o `default` faltando, o `package-lock.json` fora do commit. No comentário, diga o critério, o comando e o que apareceu:

:::example Comentário de devolução
Sem rasurar o original: na página, depois de remover a Mariana, o Desfazer não trouxe ela de volta, e o aviso diz "removerContato mudou a lista que recebeu". O `splice` tira o contato da própria lista do kit. Troque por um `filter` que fica com quem tem o id diferente: ele devolve uma lista nova e deixa a de antes como estava. Escreva o teste "removerContato não muda a lista recebida", veja o vermelho e corrija. O resto está ótimo: a busca e a ordem acertam todos os casos.
:::
