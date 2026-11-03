## Como corrigir em 20 minutos

:::steps
1. Clone o repositório numa pasta de correção, rode `npm install` e depois `npm test` **com o Wi-Fi desligado**. Anote o resultado: ele vai para "Testes"
2. Religue a internet, rode `npx serve .` na raiz do aluno e abra `http://localhost:3000/web/` numa **janela anônima** (o `localStorage` começa limpo). Desça até a lista "O que a página usa": ela confere 32 itens com os exemplos do enunciado e já mostra o que falta ou não bate
3. Siga o roteiro de uso da tela, abaixo
4. Se quiser a conferência no terminal, use o arquivo de conferência rápida, abaixo
5. `git log --reverse --date=short --format="%ad %s"`: o commit do kit e os 6 de etapa, na ordem, com as datas espalhadas entre o E17 e o E24
6. Leia `src/modelos/ListaDeTarefas.js`, `src/modelos/TarefaRecorrente.js`, os testes e o README, nessa ordem
:::

A solução de referência fica só na máquina do Erick, em `privado/projetos/projeto-3/` (fora do Git): `lista-de-tarefas/` é o projeto pronto e `etapa-1/` a `etapa-6/` são o estado do código no fim de cada encontro. Este guia não traz a solução: o repositório do curso é público.

Repositório que não roda do zero (falta o `package-lock.json`, o `babel.config.json` ou um arquivo de `src/`) é devolvido para ajuste, não zerado: diga o comando e a mensagem de erro. O `package.json` esperado é o do kit, sem pacotes a mais: `jest`, `babel-jest` e `@babel/preset-env` (versão 7) em `devDependencies` e o script `test`.

## Roteiro de uso da tela

| Passo | O que fazer | Resultado esperado |
|---|---|---|
| 1 | Abrir a página numa janela anônima | Lista vazia ("Nenhuma tarefa por aqui"), resumo com zeros, nenhum aviso no topo, "O que a página usa" com todas as etapas completas |
| 2 | Enviar o formulário com o título vazio | "Escreva o título da tarefa." embaixo do título, campo com borda vermelha; nada entra na lista |
| 3 | Título "ab" | A mensagem das 3 letras, embaixo do título |
| 4 | "Regar as plantas", Toda semana, sem prazo | A mensagem embaixo do **prazo** |
| 5 | Cinco tarefas que valem: uma de ontem com prioridade alta, uma semanal de hoje, uma de amanhã, uma daqui a 5 dias e uma sem prazo | Na ordem: ontem, hoje, amanhã, 5 dias, sem prazo; "Atrasada há 1 dia", "Vence hoje", "Vence amanhã", "Vence em 5 dias", "Sem prazo"; o formulário limpa a cada envio |
| 6 | Repetir o título da primeira, em maiúsculas | "Já existe uma tarefa pendente..." embaixo do título |
| 7 | Concluir a semanal | Ela fica riscada, sem o Concluir, e aparece outra igual, "Vence em 7 dias", com o selo "Toda semana" |
| 8 | Remover a sem prazo | Some; o resumo acompanha |
| 9 | Recarregar a página | Tudo volta igual; nas mudanças, o topo mostrou "Salvando..." e "Tudo salvo." |
| 10 | Importar exemplos | O botão desliga durante a espera; depois, "5 tarefas novas na lista", em inglês |
| 11 | Importar de novo | "Nenhuma tarefa nova: os exemplos já estão na lista." |
| 12 | DevTools, aba Network em Offline, Importar | "Sem conexão com a internet..." e o botão volta a funcionar |

No passo 5, use datas relativas ao dia em que você corrige. A tela é a mesma para todos (veio no kit): confira no `git log -- web/` que o aluno não mudou nada em `web/`. Se mudou, peça para restaurar e corrija com a tela do kit.

## Conferência rápida

A lista "O que a página usa" é a conferência principal: os 32 itens usam os nomes e os exemplos do enunciado, com o hoje de 10/11/2026, e cada item que não bate diz a chamada, o que voltou e o que era esperado. Quem quiser a mesma conferência no terminal: cole este arquivo como `src/conferencia.test.js`, rode `npx jest conferencia` e apague em seguida. Falha de import já indica nome fora do combinado.

```javascript
import { pesoDaPrioridade, proximoPrazo, situacaoDoPrazo, textoDoPrazo } from './regras/prazos.js';
import Tarefa from './modelos/Tarefa.js';
import TarefaRecorrente from './modelos/TarefaRecorrente.js';
import ListaDeTarefas, { criarTarefa } from './modelos/ListaDeTarefas.js';
import ErroDeTarefa from './modelos/ErroDeTarefa.js';
import { CHAVE, carregarTarefas, salvarTarefas } from './servicos/armazenamento.js';
import { buscarExemplos, converterTodo } from './servicos/exemplos.js';

const HOJE = new Date(2026, 10, 10, 23, 59);

class Guardado {
  constructor() { this.d = {}; }
  getItem(c) { return this.d[c] ?? null; }
  setItem(c, t) { this.d[c] = t; }
}

class Resposta {
  constructor(status, dados) { this.status = status; this.ok = status === 200; this.dados = dados; }
  async json() { return this.dados; }
}

test('etapa 1: prazos', () => {
  expect([null, '2026-11-09', '2026-11-10', '2026-11-11'].map((p) => situacaoDoPrazo(p, HOJE)))
    .toEqual(['sem-prazo', 'atrasada', 'vence-hoje', 'em-dia']);
  expect(['2026-11-07', '2026-11-09', '2026-11-11', '2026-11-15'].map((p) => textoDoPrazo(p, HOJE)))
    .toEqual(['Atrasada há 3 dias', 'Atrasada há 1 dia', 'Vence amanhã', 'Vence em 5 dias']);
  expect(pesoDaPrioridade('urgente')).toBe(0);
  expect(proximoPrazo('2026-10-27', 'semanal', HOJE)).toBe('2026-11-17');
});

test('etapas 2 e 3: classes e lista', () => {
  const t = new Tarefa({ titulo: 'Pagar a conta de luz', prioridade: 'alta', prazo: '2026-11-09' });
  expect([t.rotuloDaPrioridade, t.peso, t.situacao(HOJE), t.prazoEmTexto(HOJE)])
    .toEqual(['Alta', 3, 'atrasada', 'Atrasada há 1 dia']);
  const lista = new ListaDeTarefas();
  lista.adicionar(criarTarefa({ titulo: 'Regar as plantas', prazo: '2026-11-10', frequencia: 'semanal' }));
  lista.adicionar(t);
  lista.concluir(1, HOJE);
  expect(lista.tarefas.map((x) => [x.id, x.prazo, x.concluida]))
    .toEqual([[1, '2026-11-10', true], [2, '2026-11-09', false], [3, '2026-11-17', false]]);
  expect(lista.buscar(3)).toBeInstanceOf(TarefaRecorrente);
  expect(lista.resumo(HOJE)).toEqual({ pendentes: 2, atrasadas: 1, concluidas: 1 });
  lista.remover(2);
  expect(lista.tarefas.map((x) => x.id)).toEqual([1, 3]);
});

test('etapa 4: erros', () => {
  expect(() => new Tarefa({ titulo: '  ' })).toThrow(ErroDeTarefa);
  expect(() => new Tarefa({ titulo: 'ab' })).toThrow(ErroDeTarefa);
  expect(() => new Tarefa({ titulo: 'Pão', prioridade: 'urgente' })).toThrow(ErroDeTarefa);
  expect(() => new TarefaRecorrente({ titulo: 'Regar as plantas' })).toThrow(ErroDeTarefa);
  const lista = new ListaDeTarefas();
  expect(lista.importar([{ titulo: 'Pagar' }, { titulo: '' }, { titulo: 'PAGAR' }])).toBe(1);
  expect(() => lista.adicionar(new Tarefa({ titulo: 'pagar' }))).toThrow('pendente');
});

test('etapa 5: salvar e carregar', async () => {
  const lugar = new Guardado();
  const lista = new ListaDeTarefas();
  lista.adicionar(new TarefaRecorrente({ titulo: 'Regar as plantas', prazo: '2026-11-10' }));
  await salvarTarefas(lista, lugar);
  expect(JSON.parse(lugar.getItem(CHAVE))[0].titulo).toBe('Regar as plantas');
  expect((await carregarTarefas(lugar)).buscar(1).frequencia).toBe('semanal');
  lugar.setItem(CHAVE, '{quebrado');
  expect((await carregarTarefas(lugar)).tarefas).toEqual([]);
});

test('etapa 6: exemplos', async () => {
  const todos = [{ id: 1, todo: 'Watch a documentary', completed: false }, { id: 2, todo: 'Memorize a poem', completed: true }];
  const exemplos = await buscarExemplos(async () => new Resposta(200, { todos: todos }));
  expect(exemplos.map((e) => e.titulo)).toEqual(['Watch a documentary']);
  expect(converterTodo(todos[0])).toMatchObject({ titulo: 'Watch a documentary', prioridade: 'media', prazo: null });
  await expect(buscarExemplos(async () => new Resposta(500, null))).rejects.toThrow(ErroDeTarefa);
  await expect(buscarExemplos(async () => { throw new TypeError('Failed to fetch'); })).rejects.toThrow(ErroDeTarefa);
});
```

## Critério por critério

### Regras e classes (35)

**O que conferir:** as etapas 1 a 3 da lista "O que a página usa" (16 itens) e os passos 5, 7 e 8 do roteiro. No `ListaDeTarefas.js`, o `concluir` da lista não pode ter `instanceof`, `frequencia` nem outro `if` sobre o tipo da tarefa: quem decide se há próxima é o `concluir` de cada classe. No `TarefaRecorrente.js`, o `concluir(hoje)` chama `super.concluir()`.

| Nota | Quando |
|---|---|
| 35 | As etapas 1 a 3 completas na tela; a próxima semanal nasce com o prazo certo; `concluir` sem `if` de tipo; `super` no `constructor` e no `concluir` |
| 26 a 32 | Uma regra com uma borda errada (amanhã "vence hoje", "1 dias", a próxima que nasce atrasada), o resto certo |
| 18 a 25 | Duas ou três regras erradas, ou o `concluir` da lista decidindo com `if` sobre a frequência, ou a recorrente copiando o código do `concluir` da mãe em vez de chamar o `super` |
| 8 a 17 | Só as funções da etapa 1 e a `Tarefa`; a lista ou a recorrente faltando |
| 0 | Sem as classes, ou nada roda |

**Erros comuns:** `prazo === null` trocado por `!prazo` (funciona, não desconte); `textoDoPrazo` com `Math.abs` em vez de `-dias` (funciona, não desconte); o `while` do `proximoPrazo` com `< 0` em vez de `<= 0` (a próxima vence hoje logo depois de concluir: desconte como borda); `proximoId` trocado por `this.tarefas.length + 1` (repete id depois de remover: desconte como borda); getter escrito como método (`peso()`): a tela avisa "precisa ser um get".

### Erros próprios (15)

**O que conferir:** a etapa 4 da tela (7 itens) e os passos 2, 3, 4 e 6 do roteiro. Em `ErroDeTarefa.js`, o `super(mensagem)`, o `name` e o `campo`. No `importar`, o `catch` deixa passar o que não é `ErroDeTarefa` (com `throw erro`).

| Nota | Quando |
|---|---|
| 15 | A tabela "Erros" inteira, com o `campo` certo; mensagem embaixo do campo na tela; `importar` pulando só o `ErroDeTarefa` |
| 10 a 13 | Uma conferência faltando (o prazo fora do formato, por exemplo), ou o `catch` do `importar` sem o `throw erro` |
| 5 a 9 | Erros lançados com `Error` comum, sem `campo` (a mensagem vai sempre para o topo do formulário), ou o `importar` faltando |
| 0 | Nada é recusado |

**Erros comuns:** `throw 'mensagem'` (um texto, não um erro); `name` esquecido (a tela trata como erro inesperado); a conferência da recorrente antes do `super` (o JavaScript não deixa usar o `this` antes do `super`); o título sem o `trim()`, e "   " passa.

### Salvar e importar (15)

**O que conferir:** a etapa 5 e a etapa 6 da tela e os passos 9 a 12 do roteiro. Em `armazenamento.js`, o armazenamento vem por parâmetro (nada de `localStorage` dentro de `src/`); em `exemplos.js`, a busca vem por parâmetro (nada de `fetch` dentro de `src/`).

| Nota | Quando |
|---|---|
| 15 | As tarefas voltam ao recarregar, com a recorrente; texto quebrado vira lista vazia; Importar traz 5, não repete e avisa sem internet |
| 10 a 13 | Tudo funciona, mas o texto quebrado derruba a página, ou a resposta 500 vira "Sem conexão" |
| 5 a 9 | Só o salvamento ou só o Importar funciona; ou `localStorage` e `fetch` usados direto dentro de `src/` |
| 0 | Nem salvar nem importar |

**Erros comuns:** `salvarTarefas` sem `async`/`await` (salva antes da espera: funciona, só comente); `resposta.json()` antes de conferir o `ok`; o `let resposta` declarado dentro do `try` (o resto da função não enxerga: "resposta is not defined"); a tela avisando "O salvarTarefas gravou no localStorage de verdade": o aluno usou o `localStorage` no lugar do parâmetro.

### Testes (20)

**O que conferir:** a saída do `npm test` com e sem internet; os nomes dos testes, que devem se ler como as regras; `armazenamento.test.js` e `exemplos.test.js`.

| Nota | Quando |
|---|---|
| 20 | Verde com e sem rede; um teste por linha das tabelas, com `HOJE` fixo; as bordas (ontem, hoje, amanhã, 23h59, 2 e 3 letras); armazenamento falso; busca e resposta falsas; os testes assíncronos com `await` |
| 14 a 18 | Verde, mas faltam bordas, ou um arquivo tem só um caso |
| 8 a 13 | Um teste usa `new Date()` sem data fixa, ou chama a DummyJSON de verdade, ou toca no `localStorage` |
| 1 a 7 | Poucos testes, só das primeiras etapas |
| 0 | `npm test` não roda |

**Erros comuns:** `expect(...).rejects` sem `await` (com o código certo, passa sem conferir; troque o esperado e veja se o Jest reclama); `toThrow` sem a seta; arquivo `.test.js` vazio, que derruba o `npm test`; import sem `.js`, que passa no Jest e quebra a tela ("Failed to fetch dynamically imported module").

### Repositório, commits e README (15)

| Nota | Quando |
|---|---|
| 15 | Público, sem `node_modules/`, o commit do kit e os 6 de etapa com as mensagens, README com o que faz, dois prints, como rodar e como testar |
| 10 a 13 | Falta um item do README ou um commit de etapa |
| 5 a 9 | Commit único no fim, ou o README do kit sem mudança |
| 0 | Repositório privado ou vazio |

## Check-in por etapa

No começo de cada encontro, 2 a 3 minutos: pergunte quem fez o commit da etapa anterior (mãos levantadas) e abra **um** repositório no projetor, olhando uma coisa só.

| Encontro | Etapa conferida | Olhe |
|---|---|---|
| E18 | 1 | Na tela, a Etapa 1 com 4 de 4; no teste, o `HOJE` fixo e o das 23h59 |
| E19 | 2 | O Concluir da tela riscando a tarefa; na classe, `get` sem parênteses ao usar |
| E20 | 3 | Concluir a semanal ao vivo: a próxima aparece; no `concluir` da lista, nenhum `if` de tipo |
| E21 | 4 | Enviar o título vazio: a mensagem embaixo do campo; no `importar`, o `throw erro` |
| E22 | 5 | Recarregar a página: as tarefas voltam; no teste, o armazenamento falso |
| E23 | 6 | Importar com a aba Network em Offline: a mensagem aparece e o botão volta |

Quem não fez a etapa anterior começa por ela: as etapas se apoiam umas nas outras, e o atraso acumula rápido a partir da etapa 3. O E23 tem tempo reservado para terminar o projeto antes da Prova 1.

## Sinais de cópia

- Os sete commits no mesmo dia, ou todos depois do E23
- Código igual ao de um colega: mesmos nomes internos, mesmos comentários, até os mesmos erros
- Recursos que o curso não viu, em volume: campos com `#`, `static`, expressões regulares, `instanceof` decidindo a próxima, `structuredClone`, `Intl.RelativeTimeFormat`. Um ou outro pode ser curiosidade; muitos juntos, sem conseguir explicar, é sinal
- O aluno não consegue explicar o próprio `concluir` ou o próprio `importar` no check-in

**Como agir:** nenhum sinal sozinho prova cópia. Converse em particular, 5 minutos: peça que ele explique um método à escolha dele e faça uma mudança pequena ao vivo (o limite do título para 5 letras, uma frequência `'quinzenal'` de 14 dias, um campo novo no resumo). Se ele faz, siga a correção normal. Se não faz, devolva para ajustes pela plataforma, com o pedido de refazer a parte que ele não explicou e de explicá-la no encontro seguinte. Cópia entre colegas: converse com os dois, separados. Persistindo, siga a regra da instituição.

## Devolver para ajustes

Devolva, em vez de dar a nota final, quando o problema impede a correção, não quando é uma falha que a rubrica já desconta: `npm install` ou `npm test` quebrado por um arquivo que faltou no commit, repositório privado, tela que não carrega por um import sem `.js`, a pasta `web/` alterada. No comentário, diga o que fazer e o prazo (uma semana).
