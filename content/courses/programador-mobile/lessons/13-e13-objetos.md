---
title: Objetos
summary: "Começa o Projeto 2: a ficha de cada contato, com campos, colchetes, Object.entries e desestruturação."
module: linguagem-js
duration_minutes: 90
objectives:
  - Criar, ler e mudar fichas, inclusive uma ficha dentro de outra
  - Ler um campo cujo nome está numa variável, com colchetes
  - Percorrer uma ficha com Object.keys, Object.values e Object.entries
  - Tirar campos de uma ficha com a desestruturação e escrever as primeiras regras da agenda
---

# Objetos

Programador Mobile · Encontro E13 · Aula 13 de 45

---

## O que você vai aprender

:::goal
- Começar o Projeto 2, a Agenda de contatos, a partir de um kit pronto
- Criar uma ficha, ler, mudar e acrescentar campos
- Ler um campo cujo nome está guardado numa caixa, com colchetes
- Percorrer os campos de uma ficha com `Object.keys` e `Object.entries`
- Tirar vários campos de uma ficha de uma vez, com a desestruturação
:::

---

## :icon[book-open] Palavras novas de hoje

| Palavra | O que é |
|---|---|
| **objeto** | uma ficha de cadastro: junta os dados de uma coisa, e cada campo tem nome e valor |
| **campo** | um nome e um valor dentro da ficha, como `nome: 'Mariana Souza'`. O nome do campo também se chama **chave** |
| **colchetes** | `[ ]` depois da ficha: leem o campo cujo nome está guardado numa caixa |
| **`Object.entries`** | transforma a ficha numa lista de pares `[campo, valor]`, para percorrer |
| **desestruturar** | tirar da ficha os campos que você vai usar, cada um numa caixa com o mesmo nome |
| **kit** | a pasta do projeto que vem montada, para você completar |

---

## A agenda do celular

Na agenda do celular, cada contato tem nome, telefone, grupo e aniversário. O kit do Projeto 2 já traz 15 contatos, mas por enquanto só mostra os nomes.

**Hoje**, o `npm run agenda` do kit:

```plaintext
Agenda: 15 contatos
Mariana Souza
Bruno Carvalho
...
```

**No fim do dia**, uma linha completa por contato:

```plaintext
Agenda: 15 contatos
Mariana Souza, (11) 98765-4321, Amigos, aniversário 30/10
Bruno Carvalho, (21) 99812-3344, Amigos, aniversário 14/03
...
Daniel Rocha, (21) 98765-0099, Amigos, aniversário sem data
```

:::question
Se você anotasse um contato numa ficha de papel, que campos ela teria?
:::

---

## :icon[milestone] Projeto 2: a Agenda de contatos

A **Agenda de contatos** é o segundo projeto avaliado: as regras da agenda do celular, em JavaScript, com testes. Ela vem num **kit**, a pasta do projeto montada: os 15 contatos de exemplo, o Jest configurado e uma página web pronta, que usa as suas funções.

| Encontro | A agenda ganha |
|---|---|
| E13, hoje | a ficha de cada contato |
| E14 | buscar e pôr em ordem |
| E15 | adicionar, editar e remover sem rasurar a lista |
| E16 | a conferência do formulário e a página web |

Cada etapa é feita em aula, num repositório só seu. Enunciado, rubrica e entrega: página do curso, em **Projetos**. Prazo: início do E17.

---

## :icon[milestone] Projeto 2 · Passo 1: o kit rodando

:::steps
1. Baixe o [agenda-de-contatos.zip](materiais/projeto-2/agenda-de-contatos.zip)
2. Botão direito no zip, **Extrair tudo**, e escolha a pasta de projetos, a mesma do `racha-conta`
3. No VS Code, **Abrir Pasta**: a `agenda-de-contatos` que tem o `package.json`. Abra o terminal
4. `npm install`, depois `npm test` e `npm run agenda`
:::

O `npm install` avisa `deprecated` e `19 vulnerabilities`: são pacotes que o Jest usa por dentro, e não afetam o projeto. Não rode `npm audit fix --force`: ele troca o Jest por uma versão velha.

**Pronto quando:** `npm test` mostra `Tests: 4 passed, 4 total`, os testes que vieram no kit, e `npm run agenda` mostra `Agenda: 15 contatos` e os 15 nomes.

---

## :icon[milestone] Projeto 2 · Passo 1: a primeira foto

O que veio no kit:

```plaintext
agenda-de-contatos/
├── src/data/contatos.js     os 15 contatos de exemplo
├── src/regras/              as regras: o texto.js pronto, os outros só com um comentário
├── src/scripts/agenda.js    o que o npm run agenda mostra
├── web/                     a página pronta, que volta no E16
└── package.json, package-lock.json, babel.config.json, README.md
```

O zip não traz o `.gitignore`: arquivos que começam com ponto ficam fora dele.

:::steps
1. Na raiz, crie o `.gitignore` com a linha `node_modules/`, como no E05
2. `git init`, `git add .` e `git commit -m "Projeto 2: kit da agenda"`
:::

O `git add .` mostra vários `LF will be replaced by CRLF`: é o Windows avisando sobre o fim de linha dos arquivos. Não é erro.

**Pronto quando:** `git log --oneline` mostra `Projeto 2: kit da agenda`.

---

## Objetos

Numa ficha de cadastro em branco, o que já vem impresso e o que você escreve?

---

## :icon[braces] Objeto: a ficha de cadastro

Um **objeto** é uma ficha de cadastro: junta os dados de uma coisa só, e cada **campo** tem um nome e um valor. Você lê fichas desde a aula 3. Hoje, você cria uma:

```javascript
const contato = {
  nome: 'Rafaela Lopes',
  telefone: '(11) 91234-5678',
  grupo: 'amigos',
};

console.log(contato.nome);      // Rafaela Lopes
console.log(contato.apelido);   // undefined
console.log(contato);
// { nome: 'Rafaela Lopes', telefone: '(11) 91234-5678', grupo: 'amigos' }
```

- As chaves `{ }` abrem e fecham a ficha. Cada campo é `nome: valor`, e uma vírgula separa um campo do outro
- O **ponto** lê um campo: `contato.nome`
- Um campo que a ficha não tem dá `undefined`: ninguém pôs nada ali, como no E10

---

## :icon[pencil] Mudar e acrescentar campos

O amigo trocou de número? Com o ponto e o `=`, você escreve na ficha:

```javascript
const contato = { nome: 'Bruno Carvalho', telefone: '(21) 99812-3344' };

contato.telefone = '(21) 91111-2222';   // o campo existe: troca o valor
contato.apelido = 'Bru';                // o campo não existe: nasce no fim
console.log(contato);
// { nome: 'Bruno Carvalho', telefone: '(21) 91111-2222', apelido: 'Bru' }
```

E a `const`, a caixa lacrada do E06? Ela lacra a **caixa**, não a ficha guardada dentro dela:

- trocar a ficha inteira dá erro: `contato = { nome: 'Outro' }` para com `TypeError: Assignment to constant variable.`
- escrever nos campos da ficha pode: o `contato.telefone = ...` funciona

---

## :icon[braces] Objetos na prática

**Caso 1: as fichas do kit.** Num arquivo de treino, `src/scripts/treino.js`, rodado com `node src/scripts/treino.js`:

```javascript
import { contatos } from '../data/contatos.js';

console.log(contatos[0].nome);       // Mariana Souza
console.log(contatos[0].telefone);   // (11) 98765-4321
console.log(contatos[10].nome);      // Daniel Rocha
```

**Caso 2: uma função que monta uma ficha.** O `return` entrega a ficha nova:

```javascript
function fichaDoPedido(lanche, preco) {
  return { lanche: lanche, preco: preco, pronto: false };
}
console.log(fichaDoPedido('X-salada', 2500));
// { lanche: 'X-salada', preco: 2500, pronto: false }
```

Em `lanche: lanche`, à esquerda está o nome do campo; à direita, a caixa de onde vem o valor.

**Caso 3: um nome errado não avisa.** `contato.telefon = '(21) 91111-2222'` cria um campo novo, `telefon`, e o `telefone` continua o antigo. Confira o nome letra por letra.

---

## Ficha dentro da ficha

No seu cadastro da loja, o endereço é um campo só, ou tem rua, número e CEP?

---

## :icon[layers] Uma ficha dentro da outra

Um campo pode guardar outra ficha. No kit, o aniversário de cada contato é uma ficha com dois campos, `dia` e `mes`, dentro da ficha do contato:

```javascript
const mariana = {
  nome: 'Mariana Souza',
  aniversario: { dia: 30, mes: 10 },
};

console.log(mariana.aniversario);       // { dia: 30, mes: 10 }
console.log(mariana.aniversario.dia);   // 30
```

Leia da esquerda para a direita, um ponto por vez: "na `mariana`, abra o `aniversario`; nele, leia o `dia`".

Quem não informou o aniversário tem `aniversario: null`: a caixa vazia de propósito, do E10. No kit, é o Daniel, o `contatos[10]`.

---

## :icon[layers] Ficha dentro da ficha na prática

**Caso 1: o aniversário no kit.** No `treino.js`, com o `import` dos contatos:

```javascript
console.log(contatos[0].aniversario.mes);   // 10
console.log(contatos[10].aniversario);      // null
```

**Caso 2: dentro do `null` não há campo.** Ler o dia do Daniel derruba o programa:

```javascript
console.log(contatos[10].aniversario.dia);
// TypeError: Cannot read properties of null (reading 'dia')
```

Antes de ler dentro de um campo que pode ser `null`, pergunte com `if (contato.aniversario === null)`.

**Caso 3: você já faz isso desde o E04.** Em `conta.itens[2].preco`, o caminho entra na ficha da conta, abre a lista `itens`, a gaveta 2 e, nela, o campo `preco`.

---

## :icon[milestone] Projeto 2 · Passo 2: criarContato

Quando alguém salva o formulário, a agenda monta a ficha do contato novo. Em `src/regras/contato.js`, abaixo do comentário do kit:

```javascript
// A ficha de um contato novo. Os textos perdem os espaços das pontas,
// e todo contato novo começa fora dos favoritos.
export function criarContato(id, dados) {
  return {
    id: id,
    nome: dados.nome.trim(),
    telefone: dados.telefone.trim(),
    email: dados.email.trim(),
    grupo: dados.grupo,
    aniversario: dados.aniversario,
    favorito: false,
  };
}
```

- `dados` é a ficha do formulário, com cinco campos: `nome`, `telefone`, `email`, `grupo` e `aniversario`
- `return { ... }`: a função entrega uma ficha nova, montada ali
- `dados.nome.trim()`: o nome do formulário sem os espaços das pontas, com o `trim` do E09
- `aniversario: dados.aniversario`: vai como veio, uma ficha `{ dia, mes }` ou `null`
- `favorito: false`: um campo que o formulário não tem

---

## :icon[milestone] Projeto 2 · Passo 2: o teste da ficha inteira

Crie `src/regras/contato.test.js` com o `import` e a ficha do formulário. O nome vem com espaços sobrando, de propósito:

```javascript
import { criarContato } from './contato.js';

const dados = {
  nome: '  Rafaela Lopes ',
  telefone: '(11) 91234-5678',
  email: '',
  grupo: 'amigos',
  aniversario: { dia: 2, mes: 9 },
};
```

Logo abaixo, o teste confere a ficha que a função devolve:

```javascript
test('criarContato monta a ficha, sem os espaços das pontas', () => {
  expect(criarContato(16, dados)).toEqual({
    id: 16,
    nome: 'Rafaela Lopes',
    telefone: '(11) 91234-5678',
    email: '',
    grupo: 'amigos',
    aniversario: { dia: 2, mes: 9 },
    favorito: false,
  });
});
```

O **`toEqual`** confere campo por campo, como conferia as listas gaveta por gaveta no E08, e entra também na ficha de dentro. Com `toBe`, o teste falha mesmo com tudo igual: `Received: serializes to the same string`.

---

## :icon[milestone] Projeto 2 · Passo 2: o aniversário no teste

No fim do `contato.test.js`, o segundo teste lê o aniversário com dois pontos:

```javascript
test('criarContato guarda o aniversário, uma ficha dentro da ficha', () => {
  const contato = criarContato(16, dados);
  expect(contato.aniversario.dia).toBe(2);
  expect(contato.aniversario.mes).toBe(9);
});
```

**Pronto quando** `npm test` mostra:

```plaintext
Test Suites: 2 passed, 2 total
Tests:       6 passed, 6 total
```

Esqueceu o `trim`? O vermelho mostra a linha do campo diferente, com `-` no gabarito e `+` no que a função devolveu: `- "nome": "Rafaela Lopes"` e `+ "nome": "  Rafaela Lopes "`. O Jest lista os campos em ordem alfabética.

---

## Colchetes

Num papel está escrito "família". No dicionário, você procura a palavra "papel" ou a palavra "família"?

---

## :icon[key] Colchetes: o nome do campo numa caixa

O ponto lê o campo pelo nome escrito no código, ao pé da letra. Os **colchetes** abrem uma caixa e procuram o campo cujo nome está escrito nela:

```javascript
const NOMES_DOS_GRUPOS = {
  familia: 'Família',
  amigos: 'Amigos',
  trabalho: 'Trabalho',
};
const grupo = 'familia';

console.log(NOMES_DOS_GRUPOS[grupo]);      // Família
console.log(NOMES_DOS_GRUPOS['amigos']);   // Amigos
console.log(NOMES_DOS_GRUPOS.grupo);       // undefined
```

| Escrito | Procura o campo |
|---|---|
| `[grupo]` | cujo nome está na caixa `grupo`: `familia` |
| `['amigos']` | `amigos`: com aspas, é o nome escrito, como `.amigos` |
| `.grupo` | chamado `grupo`, que esta ficha não tem |

O nome todo em maiúsculas, com `_` entre as palavras, é um costume para uma ficha fixa, que o código só consulta.

---

## :icon[key] Colchetes na prática

**Caso 1: o grupo de cada contato, item por item.** A caixa `contato.grupo` muda a cada contato, e os colchetes acompanham:

| Contato | `contato.grupo` | `NOMES_DOS_GRUPOS[contato.grupo]` |
|---|---|---|
| Mariana | `'amigos'` | `'Amigos'` |
| Helena | `'familia'` | `'Família'` |
| Álvaro | `'trabalho'` | `'Trabalho'` |

**Caso 2: a ficha `SEM_ACENTO` do kit.** Em `src/regras/texto.js`, ela guarda cada letra com acento e a versão sem acento. Um pedaço dela:

```javascript
const SEM_ACENTO = { Á: 'A', É: 'E', Ç: 'C' };
console.log(SEM_ACENTO['Á']);   // A
console.log(SEM_ACENTO['M']);   // undefined: o M não tem acento
```

A `inicial` do kit usa essa resposta: com `undefined`, a letra fica como está. Ela entra no projeto no E15.

**Caso 3: os colchetes também escrevem.** Com `campo` valendo `'apelido'`, `ficha[campo] = 'Mari'` cria o campo `apelido`.

---

## :icon[milestone] Projeto 2 · Passo 3: descreverContato

A linha de cada contato: o nome, o telefone e o grupo como aparece na tela. No `contato.js`, depois da `criarContato`:

```javascript
// O nome de cada grupo, do jeito que aparece na tela.
const NOMES_DOS_GRUPOS = {
  familia: 'Família',
  amigos: 'Amigos',
  trabalho: 'Trabalho',
};

// Uma linha com o nome, o telefone e o grupo: 'Mariana Souza, (11) 98765-4321, Amigos'.
export function descreverContato(contato) {
  const grupo = NOMES_DOS_GRUPOS[contato.grupo];
  return `${contato.nome}, ${contato.telefone}, ${grupo}`;
}
```

- `NOMES_DOS_GRUPOS` fica sem `export`: só as funções deste arquivo usam
- `NOMES_DOS_GRUPOS[contato.grupo]`: abre a caixa `contato.grupo` (`'familia'`, na Helena) e lê o campo com esse nome (`'Família'`)
- A template string do E06 junta as três partes, com vírgula e espaço

---

## :icon[milestone] Projeto 2 · Passo 3: os testes e o agenda.js

No `contato.test.js`, a primeira linha vira duas: `import { contatos } from '../data/contatos.js';` e `import { criarContato, descreverContato } from './contato.js';`. No fim do arquivo, com a Mariana (`contatos[0]`) e a Helena (`contatos[2]`):

```javascript
test('descreverContato da Mariana', () => {
  expect(descreverContato(contatos[0])).toBe('Mariana Souza, (11) 98765-4321, Amigos');
});

test('descreverContato da Helena, do grupo familia', () => {
  expect(descreverContato(contatos[2])).toBe('Helena Martins, (11) 3456-7890, Família');
});
```

O `src/scripts/agenda.js` inteiro fica assim:

```javascript
// npm run agenda: mostra a agenda no terminal.
import { contatos } from '../data/contatos.js';
import { descreverContato } from '../regras/contato.js';

console.log(`Agenda: ${contatos.length} contatos`);

for (const contato of contatos) {
  console.log(descreverContato(contato));
}
```

**Pronto quando:** `npm test` mostra `Tests: 8 passed, 8 total`, e `npm run agenda` mostra `Agenda: 15 contatos` e as 15 linhas, a primeira `Mariana Souza, (11) 98765-4321, Amigos`.

---

## Percorrer a ficha

Como você leria em voz alta todos os campos de uma ficha, um por um?

---

## :icon[list] Object.keys, values e entries

O `for...of` do E11 percorre listas. Numa ficha, ele para com `TypeError: aniversario is not iterable` (não dá para percorrer). Primeiro, a ficha vira lista. Quem faz isso é o **`Object`**, a caixa de ferramentas de fichas do JavaScript, como o `Math` do E06 é a das contas:

```javascript
const aniversario = { dia: 30, mes: 10 };

console.log(Object.keys(aniversario));      // [ 'dia', 'mes' ]
console.log(Object.values(aniversario));    // [ 30, 10 ]
console.log(Object.entries(aniversario));   // [ [ 'dia', 30 ], [ 'mes', 10 ] ]
```

| Ferramenta | Devolve a lista |
|---|---|
| `Object.keys` (*keys*, chaves) | dos nomes dos campos |
| `Object.values` (*values*, valores) | dos valores |
| `Object.entries` (*entries*, entradas) | dos pares `[nome, valor]`: cada par é uma lista de 2 gavetas |

---

## :icon[repeat] for...of com Object.entries, volta por volta

Com a lista de pares, o `for...of` lê a ficha campo por campo:

```javascript
const NOMES_DOS_GRUPOS = { familia: 'Família', amigos: 'Amigos', trabalho: 'Trabalho' };

for (const [campo, valor] of Object.entries(NOMES_DOS_GRUPOS)) {
  console.log(`${campo}: ${valor}`);
}
```

A cada volta chega um par. Os colchetes antes do `of` dão nome às gavetas do par, pela posição: a gaveta 0 vira `campo`, e a 1 vira `valor`.

| Volta | O par | `campo` | `valor` | Mostra |
|---|---|---|---|---|
| 1 | `['familia', 'Família']` | `'familia'` | `'Família'` | `familia: Família` |
| 2 | `['amigos', 'Amigos']` | `'amigos'` | `'Amigos'` | `amigos: Amigos` |
| 3 | `['trabalho', 'Trabalho']` | `'trabalho'` | `'Trabalho'` | `trabalho: Trabalho` |

No E15, o `agenda.js` usa este mesmo laço para mostrar os contatos separados por letra.

---

## :icon[list] Percorrer na prática

**Caso 1: quantos campos tem um contato?** No `treino.js`, com o `import` dos contatos:

```javascript
console.log(Object.keys(contatos[0]).length);   // 7
```

Os 7 são `id`, `nome`, `telefone`, `email`, `grupo`, `aniversario` e `favorito`.

**Caso 2: quantos campos vazios a Fernanda tem?** A peneira da aula 3, nos valores da ficha:

```javascript
const vazios = Object.values(contatos[8]).filter((valor) => valor === '');
console.log(vazios.length);   // 1: o e-mail
```

**Caso 3: que grupos a agenda aceita?** Os nomes dos campos da `NOMES_DOS_GRUPOS`, a ficha dos grupos:

```javascript
console.log(Object.keys(NOMES_DOS_GRUPOS));   // [ 'familia', 'amigos', 'trabalho' ]
```

No E16, a conferência do formulário usa esta lista para saber se o grupo vale.

---

## Desestruturação

Para ligar para alguém, de quais campos da ficha você precisa?

---

## :icon[contact] Desestruturar: tirar campos da ficha

**Desestruturar** é tirar da ficha os campos que você vai usar, cada um numa caixa com o mesmo nome do campo. No `treino.js`, com a Helena:

```javascript
const contato = contatos[2];
const { nome, telefone } = contato;

console.log(nome);       // Helena Martins
console.log(telefone);   // (11) 3456-7890
```

A linha das chaves faz o mesmo que estas duas:

```javascript
const nome = contato.nome;
const telefone = contato.telefone;
```

- À esquerda do `=`, entre chaves, os campos que você quer; à direita, a ficha
- A caixa ganha o nome do campo. `const { fone } = contato` dá `undefined`: a ficha não tem `fone`
- Com colchetes, a desestruturação tira itens de uma lista pela posição: é o `[campo, valor]` do `for...of`

---

## :icon[contact] Desestruturação na prática

**Caso 1: a ficha de dentro.** O dia e o mês do aniversário, numa linha:

```javascript
const { dia, mes } = contatos[0].aniversario;
console.log(dia, mes);   // 30 10
```

**Caso 2: nos parâmetros.** As chaves no lugar do parâmetro tiram os campos da ficha que chegar:

```javascript
function linhaDeLigacao({ nome, telefone }) {
  return `Ligar para ${nome}: ${telefone}`;
}

console.log(linhaDeLigacao(contatos[2]));
// Ligar para Helena Martins: (11) 3456-7890
```

**Caso 3: do `null`, nada se tira.** Com o Daniel, a desestruturação para:

```javascript
const { dia, mes } = contatos[10].aniversario;
// TypeError: Cannot destructure property 'dia' of 'contatos[10].aniversario' as it is null.
```

---

## :icon[milestone] Projeto 2 · Sua vez: formatarAniversario

Agora, sozinho. No `contato.js`, com `export`, escreva `formatarAniversario(contato)`: o aniversário como dia/mês, com dois algarismos cada.

| Contato | Devolve |
|---|---|
| a Mariana, `contatos[0]` | `'30/10'` |
| a Fernanda, `contatos[8]` | `'03/03'` |
| o Daniel, `contatos[10]` | `'sem data'`: ele tem `aniversario: null` |

Um teste para cada linha. No `agenda.js`, cada linha ganha no fim `, aniversário ` e o resultado da função.

:::tip Dicas
- Primeiro o `null`, com `if` e o retorno antecipado do E10
- A desestruturação tira o `dia` e o `mes` de uma vez
- O zero da frente é o do E12: `String(numero).padStart(2, '0')`
:::

**Pronto quando:** `npm test` passa com 11 testes, e o `npm run agenda` mostra:

```plaintext
Agenda: 15 contatos
Mariana Souza, (11) 98765-4321, Amigos, aniversário 30/10
...
Daniel Rocha, (21) 98765-0099, Amigos, aniversário sem data
...
```

---

## :icon[siren] Quando aparece um erro

| A mensagem tem | Quer dizer | O que fazer |
|---|---|---|
| `(0 , _contato.criarContato) is not a function` | faltou o `export` | `export function criarContato` |
| `Cannot read properties of undefined (reading 'grupo')` | o ponto procurou um campo chamado `contato` | `NOMES_DOS_GRUPOS[contato.grupo]` |
| `of null (reading 'dia')` ou `as it is null` | o Daniel chegou na leitura do aniversário | o `if` do `null` vem primeiro |
| `dia.padStart is not a function` | `padStart` é de texto; `dia` é número | `String(dia).padStart(2, '0')` |
| `is not iterable` | `for...of` direto numa ficha | `Object.entries(ficha)` |
| `Cannot find module` | um `import` sem o `.js` | `'../regras/contato.js'` |

---

## :icon[milestone] Projeto 2 · Etapa 1 pronta

| Comando | Precisa aparecer |
|---|---|
| `npm test` | `Tests: 11 passed, 11 total` |
| `npm run agenda` | as 15 linhas, com o aniversário no fim |

Apague o `treino.js`, se criou, e tire a foto da etapa:

```bash
git add .
git commit -m "Projeto 2: etapa 1, a ficha do contato"
```

Depois, o repositório no GitHub, como no E05:

:::steps
1. No github.com, **+** e **New repository**: `agenda-de-contatos`, **Public**, sem README, `.gitignore` nem licença
2. No terminal, as três linhas de *…or push an existing repository*
:::

**Pronto quando:** recarregada, a página do repositório mostra `src`, `web` e o `.gitignore`, sem `node_modules`, e os 2 commits. Em casa, se faltar: a Sua vez, o commit e o push.

---

## Resumo

:::summary
- Um objeto é uma ficha: `{ nome: 'Ana', grupo: 'amigos' }`. O ponto lê um campo; um campo que não existe dá `undefined`
- `contato.telefone = '...'` troca o valor; num campo que não existe, o `=` cria. A `const` lacra a caixa, não a ficha
- Ficha dentro da ficha: `contato.aniversario.dia`. Dentro de `null`, não há campo para ler
- Os colchetes leem o campo cujo nome está numa caixa: `NOMES_DOS_GRUPOS[contato.grupo]`
- `Object.keys`, `Object.values` e `Object.entries` transformam a ficha em lista; `for (const [campo, valor] of Object.entries(ficha))` percorre campo por campo
- `const { nome, telefone } = contato` desestrutura: cada campo na sua caixa, também no parâmetro
:::

---

## :icon[arrow-right] Próximos passos

No E14, **listas a fundo**: a agenda aprende a procurar e a pôr em ordem.

- :icon[search] achar um contato pelo id, com o `find`
- :icon[funnel] buscar pelo nome ou pelo telefone: `npm run agenda mar`
- :icon[arrow-down-a-z] a ordem alfabética, com o Álvaro antes da Ana
- :icon[list] a lista só com os nomes, com o `map`
