## Antes de corrigir

Separe uns 25 minutos por aluno. A ordem abaixo deixa o mais caro (ler código) para o fim, quando você
já sabe onde olhar.

:::steps
1. `git clone` do link entregue, `npm install` e `npm run verificar`. Anote quantos testes passam e se o lint ficou verde
2. `git log --oneline --date=short --format="%ad %s"`: os oito commits de etapa, com datas espalhadas entre o E13 e o E21
3. Desligue o Wi-Fi e rode `npm test` de novo: tem que continuar verde
4. Religue, rode `npx serve .` e abra o endereço numa **janela anônima** (o `localStorage` começa limpo), com o DevTools no Console
5. Siga o roteiro de uso abaixo; depois, a conferência rápida e a leitura do código
:::

A solução de referência completa fica só na máquina do Erick, em `privado/projetos/projeto-3/`
(fora do Git). Este guia não traz a solução: o repositório do curso é público.

## Roteiro de uso

| Passo | O que fazer | Resultado esperado |
|---|---|---|
| 1 | Abrir a página | Lista vazia com a mensagem do `#vazio`; resumo com zeros; nenhum erro no Console |
| 2 | Enviar o formulário com o título vazio | "Escreva o título..." embaixo do título, campo com borda vermelha; nada entra na lista |
| 3 | Título "ab" | Mensagem dos 3 caracteres, embaixo do título |
| 4 | "Regar as plantas", Toda semana, sem prazo | Mensagem embaixo do **prazo** |
| 5 | Cinco tarefas válidas: uma de ontem com prioridade alta, uma de hoje semanal, uma de amanhã, uma daqui a 5 dias, uma sem prazo | A lista em ordem: ontem, hoje, amanhã, 5 dias, sem prazo; textos "Atrasada há 1 dia", "Vence hoje", "Vence amanhã", "Vence em 5 dias", "Sem prazo"; o formulário limpa a cada envio |
| 6 | Repetir o título da primeira, em maiúsculas | "Já existe uma tarefa pendente..." embaixo do título |
| 7 | Concluir a semanal | Ela fica riscada, sem o botão Concluir, e aparece outra igual vencendo em 7 dias |
| 8 | Remover a sem prazo | Some; o resumo acompanha |
| 9 | Recarregar a página | Tudo volta igual; o aviso mostrou "Salvando..." e "Tudo salvo." nas mudanças |
| 10 | Buscar "REGAR plantas", depois filtrar Atrasadas e Concluídas | A busca ignora acento e maiúsculas; os filtros mostram só o que devem |
| 11 | Importar exemplos | Botão desligado e "Carregando exemplos..."; depois 10 tarefas novas em inglês, algumas concluídas |
| 12 | Importar de novo | Nenhuma duplicada; mensagem dizendo que nada entrou |
| 13 | DevTools, Network em Offline, Importar | Mensagem de falta de conexão; o botão volta a funcionar |

No passo 5, use datas relativas ao dia em que você corrige. O DevTools em modo celular (ícone de
celular, largura 390) mostra se a página continua usável no telefone; como o HTML e o CSS vêm prontos,
só perde ponto quem estragou o layout.

## Conferência rápida das regras

Para não depender só dos testes do aluno, cole este arquivo como `src/conferencia.test.js`, rode
`npx jest conferencia` e apague em seguida. Ele usa só os nomes fixados no enunciado; falha de import
já indica nome fora do combinado.

```javascript
import { situacaoDoPrazo, textoDoPrazo, pesoDaPrioridade, buscarTarefas, ordenarPorUrgencia } from './regras/tarefas.js';
import ListaDeTarefas from './modelos/ListaDeTarefas.js';
import TarefaRecorrente from './modelos/TarefaRecorrente.js';
import { TituloInvalidoError, TarefaNaoEncontradaError } from './modelos/erros.js';

const HOJE = new Date(2026, 9, 28, 23, 59);

test('prazo e prioridade', () => {
  expect(['2026-10-27', '2026-10-28', '2026-10-29', null].map((p) => situacaoDoPrazo(p, HOJE)))
    .toEqual(['atrasada', 'vence-hoje', 'em-dia', 'sem-prazo']);
  expect(textoDoPrazo('2026-10-25', HOJE)).toBe('Atrasada há 3 dias');
  expect(pesoDaPrioridade('urgente')).toBe(0);
});

test('busca e ordem', () => {
  const t = [
    { id: 1, titulo: 'Ligar para o técnico', prioridade: 'baixa', prazo: null, concluida: false },
    { id: 2, titulo: 'Pagar a conta', prioridade: 'baixa', prazo: '2026-10-30', concluida: false },
    { id: 3, titulo: 'Estudar', prioridade: 'alta', prazo: '2026-10-30', concluida: false },
  ];
  expect(buscarTarefas(t, 'TECNICO ligar').map((x) => x.id)).toEqual([1]);
  expect(ordenarPorUrgencia(t).map((x) => x.id)).toEqual([3, 2, 1]);
  expect(t.map((x) => x.id)).toEqual([1, 2, 3]);
});

test('lista, recorrente e erros', () => {
  const lista = new ListaDeTarefas();
  lista.adicionar({ titulo: 'Regar', prazo: '2026-10-30', frequencia: 'semanal' });
  expect(lista.concluir(1).prazo).toBe('2026-11-06');
  expect(lista.todas[1]).toBeInstanceOf(TarefaRecorrente);
  expect(() => lista.adicionar({ titulo: 'REGAR' })).toThrow(TituloInvalidoError);
  expect(() => lista.remover(99)).toThrow(TarefaNaoEncontradaError);
  lista.todas.pop();
  expect(lista.tamanho).toBe(2);
});
```

## Critério por critério

### Regras e classes (25)

**O que conferir:** a conferência rápida; `src/regras/tarefas.js` e as três classes. Procure no
`ListaDeTarefas.js` um `instanceof` ou um `if` sobre `frequencia` dentro do `concluir`: não pode
haver, quem decide é o `proxima()`. Procure `this.concluida = true` dentro de `concluir()`: a
instância não muda.

| Nota | Quando |
|---|---|
| 25 | As tabelas do enunciado batem; nomes certos; `#tarefas` e `#frequencia`; `todas` devolve cópia; recorrente por polimorfismo |
| 18 a 22 | Uma regra com uma borda errada (amanhã "vence hoje" por não zerar a hora, busca que não ignora acento, empate de prioridade fora de ordem), o resto certo |
| 12 a 17 | Duas ou três regras erradas, ou a recorrente decidida com `instanceof`, ou `concluir()` mudando a própria instância |
| 5 a 11 | Classes sem campo privado, regras soltas dentro das classes ou da tela, metade das funções faltando |
| 0 | Sem as classes, ou regras que não rodam |

**Erros comuns:** `new Date('2026-10-28')` (o dia 27 no Brasil); `diasEntre` sem `inicioDoDia`;
`sort` direto na lista recebida; `filtrarTarefas('atrasadas')` contando concluídas; `adicionar` que
devolve a lista em vez da tarefa; id com `tarefas.length + 1`, que repete depois de uma remoção.

### A tela no navegador (25)

**O que conferir:** os passos 1 a 10 do roteiro de uso; depois, `src/tela/`. Procure ali `if` sobre
prazo, prioridade ou datas, `diasEntre`, `sort` ou um texto como "Atrasada há": tudo isso é regra e
devia vir das classes.

| Nota | Quando |
|---|---|
| 25 | Os passos 1 a 10 sem erro no Console; um ouvinte só na lista; `renderizar()` chamado depois de cada mudança; nenhuma regra na tela |
| 18 a 22 | Um defeito pequeno: o resumo não acompanha uma ação, o `#vazio` não aparece, o foco não volta ao título |
| 12 a 17 | Lista que duplica a cada ação (faltou apagar antes de desenhar), busca ou filtro sem efeito, ou regra calculada na tela |
| 5 a 11 | Só a lista aparece; formulário ou botões não funcionam |
| 0 | A página não carrega o JavaScript |

**Erros comuns:** `innerHTML` com o título (anote como orientação; tire 2 pontos se um título como
`<b>x</b>` vira negrito); ouvinte de `click` em cada botão, criado a cada desenho (funciona, mas
explique a delegação); `dataset.id` comparado sem `Number`; `submit` sem `preventDefault`.

### Erros, salvamento e API (20)

**O que conferir:** passos 2 a 4, 9 e 11 a 13 do roteiro; `erros.js`, os `catch` de `src/tela/`,
`armazenamento.js` e `api/exemplos.js`.

| Nota | Quando |
|---|---|
| 20 | Erros com `name` e `codigo`; todo `catch` relança o que não é `ErroDeTarefa`; mensagem no campo certo pelo `codigo`; salvar e carregar com Promise e `finally`; importar com botão desligado e mensagem sem rede |
| 14 a 17 | Tudo funciona, mas a mensagem vai sempre para o mesmo lugar, ou um `catch` esconde qualquer erro, ou o botão não é desligado |
| 8 a 13 | Erros próprios sem `codigo`, salvamento sem Promise (direto no `localStorage` na tela), ou importar sem tratar a falta de rede |
| 1 a 7 | Só uma das três partes (erros, salvamento, API) funciona |
| 0 | Nenhuma das três |

**Erros comuns:** `catch` que mostra "Algo deu errado" para tudo; `.json()` antes de conferir
`resposta.ok`; botão que fica desligado depois da falha (faltou `finally`); `salvarTarefas` que lê a
lista depois do atraso (funciona, mas grava o estado errado se duas mudanças vierem juntas: só
comente); `JSON.stringify(lista)` de instâncias em vez de `paraJSON()`, e a recorrente volta como
tarefa comum.

### Testes e lint (20)

**O que conferir:** a saída do `npm run verificar` com e sem Wi-Fi; os nomes dos testes, que devem se
ler como as regras; `armazenamento.test.js` e `exemplos.test.js`.

| Nota | Quando |
|---|---|
| 20 | Verde com e sem rede; bordas das tabelas testadas (ontem, hoje, amanhã, 23h59, 2, 3, 80 e 81 caracteres); armazenamento falso; `fetch` simulado; testes assíncronos com `return` ou `await` |
| 14 a 17 | Verde, mas faltam bordas, ou um arquivo de testes tem só um caso |
| 8 a 13 | Testes que usam `new Date()` sem data fixa, ou que chamam a DummyJSON, ou lint vermelho |
| 1 a 7 | Poucos testes, só das primeiras etapas |
| 0 | `npm test` não roda |

**Erros comuns:** `expect(...).rejects` sem `await` nem `return` (passa com o código quebrado: troque
o esperado e veja se fica vermelho); `toThrow` sem a arrow; teste de tela importando `src/tela/`
(quebra com `document is not defined`).

### Repositório e README (10)

| Nota | Quando |
|---|---|
| 10 | Público, sem `node_modules/`, oito commits de etapa com as mensagens, README com o que faz, dois prints, como rodar e como testar |
| 6 a 8 | Falta um item do README ou alguns commits de etapa |
| 3 a 5 | Commit único no fim, ou README do ponto de partida sem mudança |
| 0 | Repositório privado ou vazio |

## Check-in por etapa

No bloco Projeto do roteiro, o check-in leva 2 a 3 minutos: pergunte quem fez o commit da etapa
anterior (mãos levantadas) e abra **um** repositório no projetor, olhando uma coisa só:

| Encontro | Etapa conferida | Olhe |
|---|---|---|
| E14 | 1 | O teste das 23h59 e o de `''` sem prazo; `lerData` sem `new Date('AAAA-MM-DD')` |
| E15 | 2 | `ordenarPorUrgencia` com `[...tarefas]` antes do `sort` e o teste que prova a lista intacta |
| E16 | 3 | A página com as tarefas do aluno no lugar do molde, e nenhum `if` de prazo em `src/tela/` |
| E17 | 4 | Concluir a semanal ao vivo: a próxima aparece; no código, nenhum `instanceof` no `concluir` da lista |
| E18 | 5 | Enviar o título vazio: a mensagem aparece embaixo do campo; no código, o `catch` com `instanceof` |
| E19 | 6 | Recarregar a página: as tarefas voltam; no teste, o armazenamento falso |
| E20 | 7 | Importar com a aba Network em Offline: a mensagem aparece e o botão volta |

Quem não fez a etapa anterior começa por ela em casa: as etapas se apoiam umas nas outras, e o atraso
acumula rápido a partir da etapa 3.

## Sinais de cópia

- Os oito commits no mesmo dia, ou todos depois do E20
- Código igual ao de um colega: mesmos nomes internos, mesmos comentários, até os mesmos erros
- O `lojinha-regras` renomeado: `buscarTarefas` com `produto` dentro, comentários sobre frete ou CEP
- Recursos que o curso não viu, em volume: `static #`, `structuredClone`, `Intl.RelativeTimeFormat`,
  `<template>`, um `innerHTML` gigante montado com `map` e `join`. Um ou outro pode ser curiosidade;
  muitos juntos, sem conseguir explicar, é sinal
- O aluno não consegue explicar a própria função no check-in

**Como agir:** nenhum sinal sozinho prova cópia. Converse em particular, 5 minutos: peça que ele
explique uma função à escolha dele e faça uma mudança pequena ao vivo (o limite do título para 60, uma
frequência `'mensal'` de 30 dias, um filtro novo). Se ele faz, siga a correção normal. Se não faz,
devolva para ajustes pela plataforma, com o pedido de refazer a parte que ele não explicou e de
explicá-la no encontro seguinte. Cópia entre colegas: converse com os dois, separados. Persistindo,
siga a regra da instituição.

## Devolver para ajustes

Devolva, em vez de dar a nota final, quando o problema impede a correção, não quando é uma falha que a
rubrica já desconta: `npm install` ou `npm run verificar` quebrado por um arquivo que faltou no
commit, repositório privado, página que não carrega por um import sem `.js`. No comentário, diga o
que fazer e o prazo (uma semana, sem passar do E23).
