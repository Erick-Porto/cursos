---
title: Módulos e a agenda na web
summary: "Fim do Projeto 2: export com nome e default, a validação com lista de erros, a página web ligada e a entrega."
module: linguagem-js
duration_minutes: 90
objectives:
  - Exportar com nome e com default e importar cada um, inclusive os dois numa linha só
  - Validar os dados do formulário devolvendo uma lista de erros, vazia quando está tudo certo
  - Organizar o código num arquivo por assunto, com a ficha dos grupos num módulo próprio
  - Ligar a página web do kit às suas funções, completar o README e entregar o Projeto 2
---

# Módulos e a agenda na web

Programador Mobile · Encontro E16 · Aula 16 de 45

---

## O que você vai aprender

:::goal
- Pôr uma coisa na vitrine com `export` com nome ou com `export default`, e importar cada uma
- Conferir os dados do formulário e devolver a lista dos problemas
- Separar o código num arquivo por assunto
- Ver a agenda no navegador, ligada às suas 14 funções
- Fechar e entregar o Projeto 2
:::

---

## :icon[book-open] Palavras novas de hoje

| Palavra | O que é |
|---|---|
| **módulo** | um arquivo `.js`; o que tem `export` os outros arquivos podem usar |
| **`export` com nome** | põe uma coisa na vitrine com a etiqueta do nome dela; quem importa pede pelo nome |
| **`export default`** | o destaque da vitrine: a coisa principal do arquivo, uma só |
| **validar** | conferir os dados antes de guardar |
| **lista de erros** | os problemas que a validação achou, um texto por problema; vazia quando está tudo certo |

---

## A agenda aceita qualquer coisa

A agenda do E15 salva, edita, remove e desfaz, mas salva qualquer coisa. Na página, abra **Novo contato**, deixe o nome vazio, escreva `123` no telefone e salve:

| Hoje, com a etapa 3 | No fim do encontro |
|---|---|
| a mensagem sai sem nome: "entrou na agenda." | "Confira antes de salvar:" e a lista dos problemas |
| a lista por letra quebra: `agruparPorLetra(...) lançou um erro` | nada é salvo até os campos estarem certos |
| o painel: 13 de 14 funções | 14 de 14 e o Projeto 2 entregue |

Hoje é a última etapa. A entrega vai até o início do E17.

:::question
Que problemas um contato pode ter que a agenda deveria recusar?
:::

---

## Export com nome

Na vitrine de uma loja, como você pede o produto que quer levar?

---

## :icon[store] export com nome: a etiqueta na vitrine

Cada arquivo `.js` é um **módulo**: uma loja com vitrine (E07). O **`export`** põe uma coisa na vitrine com a etiqueta do nome dela, e o **`import`** pede pelo nome, entre chaves. O que não tem `export` fica no **estoque**: só o próprio arquivo usa.

| Arquivo do kit | Na vitrine | No estoque |
|---|---|---|
| `src/regras/texto.js` | `soDigitos` e `inicial` | `SEM_ACENTO` |
| `src/regras/contato.js` | `criarContato`, `descreverContato` e `formatarAniversario` | `NOMES_DOS_GRUPOS` |
| `src/data/contatos.js` | `contatos`, a lista | |

```javascript
import { inicial, soDigitos } from './texto.js';
```

- As chaves pedem os nomes exatos, separados por vírgula, em qualquer ordem
- O `./` é "nesta mesma pasta", e o `.js` no fim é obrigatório

---

## :icon[store] export com nome na prática

**Caso 1: funções e uma lista na vitrine.** Num `rascunho.js` na raiz do projeto, que você apaga depois:

```javascript
import { contatos } from './src/data/contatos.js';
import { inicial, soDigitos } from './src/regras/texto.js';

console.log(contatos.length); // 15
console.log(inicial('Érica Nogueira')); // E
console.log(soDigitos('(11) 3456-7890')); // 1134567890
```

O `contatos.js` começa com `export const contatos`: uma constante também vai para a vitrine.

**Caso 2: pedir o que está no estoque.** O Node confere os `import` antes de rodar a primeira linha:

```javascript
import { SEM_ACENTO } from './src/regras/texto.js';
// SyntaxError: The requested module './src/regras/texto.js'
//   does not provide an export named 'SEM_ACENTO'
```

Em português: "esse arquivo não tem na vitrine nada com esse nome". Um nome com uma letra errada, como `soDigito`, dá o mesmo erro.

---

## Export default

Toda vitrine tem um produto em destaque, bem no meio. Quantos destaques cabem numa vitrine?

---

## :icon[store] export default: o destaque da vitrine

O **`export default`** (*default*, padrão) põe na vitrine o **destaque**: a coisa principal do arquivo. Só cabe um por arquivo. Quem importa não usa chaves e escolhe o nome. É assim que o `validarContato` de hoje sai do `validacao.js`:

```javascript
export default function validarContato(dados) {
  // as regras da validação
}
```

```javascript
import validarContato from './validacao.js';
```

| | `export` com nome | `export default` |
|---|---|---|
| Quantos por arquivo | quantos quiser | um só |
| Como se escreve | `export function inicial` | `export default function validarContato` |
| Como se importa | `import { inicial } from` | `import validarContato from` |
| O nome no `import` | o mesmo, letra por letra | você escolhe |

Outra forma: a função sem `export` e, no fim do arquivo, `export default validarContato;`.

---

## :icon[store] export default na prática

Um arquivo pode ter o destaque e outras coisas com nome. O `cardapio.js` de uma lanchonete:

```javascript
const PRATOS = { segunda: 'Virado à paulista', quarta: 'Feijoada', sexta: 'Peixe frito' };

export default function pratoDoDia(dia) {
  return PRATOS[dia];
}

export const BEBIDAS = ['suco', 'refrigerante', 'água'];
```

Na mesma pasta, o `pedido.js` pega os dois num `import` só:

```javascript
import pratoDoDia, { BEBIDAS } from './cardapio.js';

console.log(pratoDoDia('quarta')); // Feijoada
console.log(BEBIDAS.join(', ')); // suco, refrigerante, água
```

- O destaque vem primeiro, sem chaves; depois da vírgula, os nomes, entre chaves
- `import prato from './cardapio.js'` também funciona: `prato('sexta')` dá `Peixe frito`
- Com chaves no destaque, `import { pratoDoDia }`, o Node para: `does not provide an export named 'pratoDoDia'`
- Dois `export default` no mesmo arquivo: `SyntaxError: Duplicate export of 'default'`

---

## Validar os dados

Num cadastro, você prefere saber todos os problemas de uma vez ou um de cada vez?

---

## :icon[clipboard-check] Validar: a folha da vistoria

**Validar** é conferir os dados antes de guardar. Pense na vistoria do carro: o vistoriador confere item por item e anota numa folha cada problema que encontra. Folha em branco: carro aprovado. A função de validar faz igual: a **lista de erros** começa vazia, e cada regra que falha faz `push` da sua mensagem.

```javascript
function validarSenha(senha) {
  const erros = [];
  if (senha.length < 8) {
    erros.push('Use pelo menos 8 caracteres');
  }
  if (senha.includes(' ')) {
    erros.push('Não use espaço');
  }
  return erros;
}

console.log(validarSenha('ab c')); // [ 'Use pelo menos 8 caracteres', 'Não use espaço' ]
console.log(validarSenha('girassol26')); // []
```

- Um `if` por regra, sem `else`: toda regra é conferida, e a lista traz **todos** os problemas, na ordem das regras
- Lista vazia, `[]`, quer dizer "tudo certo"

---

## :icon[clipboard-check] A vistoria, regra por regra

| Senha | Regra | A pergunta vira | Resposta | `erros` depois |
|---|---|---|---|---|
| `'ab c'` | tamanho | `4 < 8` | `true` | `['Use pelo menos 8 caracteres']` |
| `'ab c'` | espaço | `'ab c'.includes(' ')` | `true` | `['Use pelo menos 8 caracteres', 'Não use espaço']` |
| `'girassol26'` | tamanho | `10 < 8` | `false` | `[]` |
| `'girassol26'` | espaço | `'girassol26'.includes(' ')` | `false` | `[]` |

- `'ab c'.length` é 4: o espaço também conta
- Com `else if` na regra do espaço, `'ab c'` mostraria só o primeiro problema. O espaço, a pessoa só descobriria na segunda tentativa

---

## :icon[clipboard-check] Lista de erros na prática

**Caso 1: quem chama decide pelo `.length`.** Vazia, segue; com problemas, mostra cada um:

```javascript
const erros = validarSenha('girassol 26');
if (erros.length === 0) {
  console.log('Senha cadastrada');
} else {
  console.log(`Confira: ${erros.join(', ')}`);
}
// Confira: Não use espaço
```

**Caso 2: a página do kit faz o mesmo com o seu `validarContato`.** Lista vazia, ela salva o contato. Com problemas, ela não salva e mostra "Confira antes de salvar:", com uma linha por mensagem.

**Caso 3: mensagens fixas.** A tela mostra o texto como ele veio, e o teste compara letra por letra, com acento e vírgula. Por isso o enunciado do Projeto 2 traz as mensagens exatas.

---

## :icon[phone] O soDigitos do kit, letra por letra

Para contar os algarismos de um telefone, o kit traz pronta, em `src/regras/texto.js`, a `soDigitos`:

```javascript
export function soDigitos(texto) {
  let digitos = '';
  for (const letra of texto) {
    if ('0123456789'.includes(letra)) {
      digitos = digitos + letra;
    }
  }
  return digitos;
}
```

No E11, o `for...of` percorreu listas. Ele também percorre um **texto**: a cada volta, a caixa `letra` recebe uma letra, da primeira à última. O `includes` do E09 pergunta: "esta letra está entre os algarismos?". Com `'(11) 9'`:

| Volta | `letra` | É algarismo? | `digitos` depois |
|---|---|---|---|
| 1 | `'('` | não | `''` |
| 2 | `'1'` | sim | `'1'` |
| 3 | `'1'` | sim | `'11'` |
| 4 | `')'` | não | `'11'` |
| 5 | `' '` | não | `'11'` |
| 6 | `'9'` | sim | `'119'` |

---

## :icon[milestone] Projeto 2 · Passo 1: validarContato

Em `src/regras/validacao.js`, logo abaixo do comentário do kit, o `import` da `soDigitos`:

```javascript
import { soDigitos } from './texto.js';
```

Abaixo dele, o destaque do arquivo, com as regras do nome e do telefone:

```javascript
export default function validarContato(dados) {
  const erros = [];

  if (dados.nome.trim() === '') {
    erros.push('Informe o nome');
  }

  const digitos = soDigitos(dados.telefone).length;
  if (digitos !== 10 && digitos !== 11) {
    erros.push('O telefone precisa de 10 ou 11 dígitos, com o DDD');
  }

  return erros;
}
```

As mensagens são exatamente estas: a página e a correção conferem o texto.

---

## :icon[list-ordered] validarContato em português

| Linha | O que ela diz |
|---|---|
| `export default function validarContato(dados)` | "o destaque do arquivo; recebe a ficha do formulário" |
| `const erros = [];` | "a folha da vistoria começa em branco" |
| `if (dados.nome.trim() === '')` e o `push` | "nome vazio, sem os espaços das pontas? Anote `Informe o nome`" |
| `const digitos = soDigitos(dados.telefone).length;` | "quantos algarismos o telefone tem" |
| `if (digitos !== 10 && digitos !== 11)` e o `push` | "não são 10 nem 11? Anote o problema do telefone" |
| `return erros;` | "entregue a folha: vazia é tudo certo" |

O **`!==`**, do E14, pergunta "é diferente?": o contrário do `===`.

---

## :icon[phone] O telefone, caso por caso

| `dados.telefone` | `soDigitos` dá | `digitos` | Problema? |
|---|---|---|---|
| `'(11) 91234-5678'` | `'11912345678'` | 11 | não: celular com DDD |
| `'(11) 3456-7890'` | `'1134567890'` | 10 | não: fixo com DDD |
| `'98765-4321'` | `'987654321'` | 9 | sim: falta o DDD |
| `''` | `''` | 0 | sim: vazio |
| `'+55 11 91234-5678'` | `'5511912345678'` | 13 | sim: o 55 do país sobra |

- A pergunta do `if` dá `true` só quando o número não é 10 **e** não é 11
- Com 11, a segunda parte dá `false`, e o `&&` todo dá `false`: nada é anotado
- O telefone vazio cai nesta mesma regra: zero algarismos

---

## :icon[milestone] Projeto 2 · Passo 1: os testes

Crie `src/regras/validacao.test.js`. O `import` do destaque vai sem chaves, e a ficha `certo` serve de base para os testes:

```javascript
import validarContato from './validacao.js';

const certo = {
  nome: 'Rafaela Lopes',
  telefone: '(11) 91234-5678',
  email: '',
  grupo: 'amigos',
  aniversario: null,
};

test('dados certos: nenhum problema', () => {
  expect(validarContato(certo)).toEqual([]);
});
```

No fim do arquivo, a ficha certa com dois campos trocados, com o spread do E15:

```javascript
test('nome vazio e telefone sem DDD: dois problemas, na ordem dos campos', () => {
  const dados = { ...certo, nome: '   ', telefone: '98765-4321' };
  expect(validarContato(dados)).toEqual([
    'Informe o nome',
    'O telefone precisa de 10 ou 11 dígitos, com o DDD',
  ]);
});
```

**Pronto quando:** `npm test` mostra `Test Suites: 5 passed, 5 total` e `Tests: 36 passed, 36 total`.

---

## Um assunto por arquivo

No shopping, onde você procura um remédio? E um tênis?

---

## :icon[folder-tree] Cada arquivo cuida de um assunto

Num shopping, cada loja cuida de um assunto: remédio na farmácia, tênis na loja de calçados. Em `src/regras/`, cada arquivo é uma loja assim:

| Arquivo | O assunto | Quem importa dele |
|---|---|---|
| `texto.js` | textos | `lista.js` e `validacao.js` |
| `contato.js` | a ficha de um contato | `edicao.js`, `agenda.js` e a página |
| `lista.js` | perguntas à lista | `agenda.js` e a página |
| `edicao.js` | mudanças na lista | a página |
| `validacao.js` | conferir o formulário | a página |

- Cada função tem o seu lugar, e o teste dela fica ao lado
- O que **dois** arquivos usam mora num terceiro, e os dois importam de lá

---

## :icon[folder-tree] Arquivos na prática

**Caso 1: a página importa pelo caminho.** No `web/tela.js` do kit, cada arquivo tem o seu endereço:

```javascript
const ARQUIVOS = [
  { chave: 'dados', caminho: '../src/data/contatos.js' },
  { chave: 'contato.js', caminho: '../src/regras/contato.js' },
  { chave: 'lista.js', caminho: '../src/regras/lista.js' },
  { chave: 'edicao.js', caminho: '../src/regras/edicao.js' },
  { chave: 'validacao.js', caminho: '../src/regras/validacao.js' },
];
```

O `..` sobe de `web/` para a raiz (E12). Arquivo com outro nome, a página não acha; função no arquivo errado, ela avisa onde achou.

**Caso 2: uma ficha que dois arquivos usam.** A `NOMES_DOS_GRUPOS` mora no estoque do `contato.js`. Na Sua vez, o `validacao.js` também vai precisar dela.

:::question
Se a ficha ficasse copiada nos dois arquivos, o que aconteceria no dia em que o grupo "Vizinhos" entrasse só numa das cópias?
:::

---

## :icon[milestone] Projeto 2 · Passo 2: grupos.js

A ficha muda de casa. Crie `src/regras/grupos.js`, com o `export` na frente do `const`:

```javascript
// O nome de cada grupo, do jeito que aparece na tela.
// Mora num arquivo só dele: contato.js e validacao.js usam a mesma ficha.
export const NOMES_DOS_GRUPOS = {
  familia: 'Família',
  amigos: 'Amigos',
  trabalho: 'Trabalho',
};
```

No `contato.js`, apague a ficha `NOMES_DOS_GRUPOS` e o comentário dela, acima do `descreverContato`. Logo abaixo do comentário do kit, o `import`:

```javascript
import { NOMES_DOS_GRUPOS } from './grupos.js';
```

O `descreverContato` não muda uma letra. O nome todo em maiúsculas, com `_`, é o costume do E13 para uma ficha fixa.

**Pronto quando:** `npm test` continua com `Tests: 36 passed, 36 total`. A mudança de casa não quebrou nada, e os testes provam isso.

---

## A agenda na web

A página do kit não tem regra nenhuma. Então quem decide o que ela mostra?

---

## :icon[globe] A página usa as suas funções

A página da pasta `web/` veio pronta no kit, como a do Racha-conta (E12). A cada ação, ela chama uma função **sua**:

| Na página | Ela chama |
|---|---|
| a busca | `buscarContatos` e `nomesDosContatos` |
| a lista, com as letras | `ordenarPorNome` e `agruparPorLetra` |
| Salvar contato | `validarContato` e, com a lista de erros vazia, `adicionarContato` |
| Editar | `buscarPorId`, `validarContato` e `editarContato` |
| Remover e Desfazer | `removerContato`; o Desfazer volta à lista de antes |

- Ela abre pelo servidor local: `npx serve .` na raiz e `http://localhost:3000/web/`
- O painel **Funções do seu projeto** conta quantas das 14 ela achou
- Recarregar volta aos 15 contatos do kit

---

## :icon[globe] A página confere o combinado

Quando algo foge do combinado, a página avisa num quadro vermelho, no topo, ou no painel, ao lado da função:

| O aviso tem | Quer dizer |
|---|---|
| `does not provide an export named 'NOMES_DOS_GRUPOS'` | o `grupos.js` sem o `export`; caem junto os arquivos que importam dele |
| `Failed to fetch dynamically imported module` | um `import` sem o `.js`: o Jest passa, o navegador não |
| `mudou a lista que recebeu` | uma rasura (E15): o Desfazer deixa de funcionar |
| `Ainda não existe` | falta a função, ou o nome difere |
| `Ela tem export com nome; o combinado é export default` | o `validarContato` saiu sem o `default` |

---

## :icon[milestone] Projeto 2 · Passo 3: a agenda na web

:::steps
1. Na raiz do projeto, `npx serve .`. Na primeira vez, `y` para instalar
2. No navegador, `http://localhost:3000/web/`
3. Abra o painel **Funções do seu projeto**
4. Busque `mar`. Remova a Mariana e toque em **Desfazer**
5. Abra **Novo contato** e salve vazio. Depois, cadastre um contato certo
6. Edite o Bruno para o grupo Trabalho
:::

**Pronto quando:** o painel mostra 14 de 14, sem aviso vermelho, e salvar vazio mostra `Informe o nome` e `O telefone precisa de 10 ou 11 dígitos, com o DDD`.

Porta 3000 ocupada, com o servidor do Racha-conta aberto? O `serve` escolhe outra porta: use o endereço que ele mostrar. Para parar, <kbd>Ctrl</kbd> + <kbd>C</kbd>.

---

## :icon[milestone] Projeto 2 · Passo 4: o README com o print

O README do kit tem dois **comentários** do Markdown, `<!-- Etapa 4: ... -->`: textos que a prévia não mostra. Troque:

1. o primeiro por uma frase sua sobre o que a agenda faz
2. o segundo pelo print da página: recorte com <kbd>Win</kbd> + <kbd>Shift</kbd> + <kbd>S</kbd> e salve como `agenda.png` numa pasta nova `docs`, na raiz

```markdown
![A agenda no navegador: busca, aniversariantes do mês e a lista separada por letra](docs/agenda.png)
```

Entre colchetes, a descrição da imagem; entre parênteses, o caminho, tudo em minúsculas, como no E12.

**Pronto quando:** a prévia do README no VS Code (<kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>V</kbd>) mostra a sua frase e a imagem.

---

## :icon[milestone] Projeto 2 · Sua vez: o e-mail

Agora, sozinho. No `validarContato`, depois da regra do telefone, a do e-mail:

- o e-mail pode ficar vazio
- quando vem, precisa ter `@` e ponto; senão, `E-mail inválido`

Dois testes: com `@` e ponto passa (`[]`); sem `@`, como `'rafaela.exemplo.com'`, dá `['E-mail inválido']`.

:::tip Dicas
- Primeiro a pergunta "veio alguma coisa?"; só dentro dela, a do `@` e do ponto: um `if` dentro do outro
- "Não tem `@`" é `!email.includes('@')`. Faltar um **ou** o outro já é problema
- Nos testes, a ficha `certo` com o campo trocado: `{ ...certo, email: 'rafaela@exemplo.com' }`
:::

**Pronto quando:** `npm test` mostra `Tests: 38 passed, 38 total`, e na página, recarregada, o e-mail `rafaela@` mostra `E-mail inválido`.

---

## :icon[milestone] Projeto 2 · Sua vez: o grupo

Depois da regra do e-mail, a do grupo: ele precisa ser uma das chaves de `NOMES_DOS_GRUPOS`, importada de `grupos.js`. Senão, a mensagem é `Escolha família, amigos ou trabalho`.

Um teste: o grupo `'vizinhos'` dá `['Escolha família, amigos ou trabalho']`.

:::tip Dicas
- O `validacao.js` ganha um segundo `import`, abaixo do da `soDigitos`: a ficha de `grupos.js`, entre chaves
- `Object.keys(NOMES_DOS_GRUPOS)` dá a lista `['familia', 'amigos', 'trabalho']`, do E13
- O `includes` de lista, do E14, pergunta se o grupo está nela; o `!` na frente vira "não está"
:::

**Pronto quando:** `npm test` mostra `Tests: 39 passed, 39 total`, e na página, recarregada, salvar vazio mostra três mensagens: a do nome, a do telefone e `Escolha família, amigos ou trabalho`.

---

## :icon[siren] Quando aparece um erro

| A mensagem tem | Quer dizer | O que fazer |
|---|---|---|
| `(0 , _validacao.default) is not a function` | saiu sem o `default` | `export default function validarContato` |
| `(0 , _validacao.validarContato) is not a function` | chaves no destaque | `import validarContato from './validacao.js'` |
| `does not provide an export named` | o nome não está na vitrine | conferir o `export` e o nome |
| `NOMES_DOS_GRUPOS is not defined` | faltou o `import` | `import { NOMES_DOS_GRUPOS } from './grupos.js';` |
| `(reading 'amigos')` | o `grupos.js` sem o `export` | `export const NOMES_DOS_GRUPOS` |
| a página parada em "Carregando..." | aberta com dois cliques | `npx serve .` e `/web/` |

---

## :icon[milestone] Projeto 2 · Etapa 4 pronta

Antes de entregar, na raiz:

| O quê | Precisa aparecer |
|---|---|
| `npm test` | `Tests: 39 passed, 39 total` |
| `npm run agenda mar` | Helena, Marcos e Mariana, e as letras `H` e `M` |
| a página | 14 de 14, sem aviso vermelho |
| o README | a sua frase e o print |

Depois, `git add .`, `git commit -m "Projeto 2: etapa 4, validação e a agenda na web"` e `git push`. No GitHub, confira o print e os 5 commits.

**Entrega:** na página do curso, em **Projetos**, abra o Projeto 2, cole o link `https://github.com/seu-usuario/agenda-de-contatos` e envie. Prazo: **início do E17**. Faltou algo? Termine em casa.

---

## Resumo

:::summary
- `export` com nome põe na vitrine com etiqueta, e o `import` pede o nome exato, entre chaves: `import { inicial } from './texto.js'`
- `export default` é o destaque, um por arquivo, importado sem chaves e com o nome que você quiser: `import validarContato from './validacao.js'`
- Os dois numa linha: `import pratoDoDia, { BEBIDAS } from './cardapio.js'`
- Validar: a lista de erros começa vazia, cada regra que falha faz `push` da sua mensagem, e `[]` quer dizer tudo certo
- Cada arquivo cuida de um assunto; o que dois arquivos usam mora num terceiro, como o `grupos.js`
- A página do kit importa as suas funções pelo caminho combinado: com `npx serve .`, 14 de 14
:::

---

## :icon[arrow-right] Próximos passos

No E17 começa a unidade Classes e estruturas de controle, com o **Projeto 3, a Lista de tarefas**, a partir de um kit novo:

- :icon[split] o `switch` e o `else if` em ordem, para dizer o prazo de cada tarefa em palavras
- :icon[link] o `?.`, que lê o aniversário do Daniel sem quebrar
- :icon[send] a Agenda de contatos entregue até o início do encontro
