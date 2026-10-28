## Como corrigir em 15 minutos

:::steps
1. Clone o repositório, rode `npm install` e `npx expo start` e abra no Expo Go. Não abriu? `npx expo start -c`; se faltar pacote, veja se `react-native-safe-area-context` está no `package.json`. App que não abre do zero é devolvido para ajuste, não zerado.
2. Siga o roteiro de uso abaixo no celular (5 min). Anote o que falhou, critério por critério.
3. `git log --oneline --date=short --format="%ad %s"`: os quatro commits de etapa e as datas.
4. Leia `src/regras/agua.js`, `src/hooks/useConsumo.js`, `App.js` e `src/components/`, nessa ordem.
5. Confira as regras sem o celular com o comando de "Regras no terminal".
6. Leia o README: prints, como rodar e a seção Caça ao bug.
:::

O Alert não funciona na versão web (tecla `w`): o `Alert.alert` não faz nada no navegador. Corrija a
remoção sempre no Expo Go ou no emulador.

### Roteiro de uso

| Passo | O que fazer | O que deve aparecer |
|---|---|---|
| 1 | Abrir o app | 0 ml de 2000 ml, barra vazia, lista vazia com mensagem, frase da faixa 0 |
| 2 | +300 e +500 | 800 ml, 40%, faltam 1200 ml, dois registros com a hora atual, o mais novo no topo, frase da faixa 1 a 49 |
| 3 | +500 três vezes | 2300 ml, 115%, barra cheia sem sair do cartão, nada falta, frase de meta batida |
| 4 | Remover um de 500 e tocar em Cancelar | continua com 2300 ml |
| 5 | Remover o mesmo e confirmar | 1800 ml, 90%, frase da faixa 50 a 99 |
| 6 | Meta vazia, `2.000`, `2000,5`, `300` e `6000`, cada um com Salvar | erro embaixo do campo; a meta continua 2000 |
| 7 | Meta `2500` | 72%, faltam 700 ml |
| 8 | Remover todos | volta a mensagem de lista vazia |

### Regras no terminal

Na pasta do aluno, no Git Bash ou no terminal do VS Code:

```bash
node -e "import('./src/regras/agua.js').then((r) => console.log(r.totalDoDia([{ ml: 300 }, { ml: 500 }]), r.percentualDaMeta(1999, 2000), r.percentualDaMeta(2500, 2000), r.quantoFalta(2500, 2000), r.mensagemDaFaixa(0), r.mensagemDaFaixa(50), r.validarMeta(' 2500 '), r.validarMeta('2000,5'), r.formatarHora(new Date(2026, 9, 28, 8, 5))))"
```

Esperado: `800 99 125 0`, a frase da faixa 0, a frase da faixa 50 a 99,
`{ valida: true, meta: 2500, mensagem: '' }`, um objeto com `valida: false` e uma mensagem, e `08:05`.
O aviso `MODULE_TYPELESS_PACKAGE_JSON` do Node é normal. Se o comando quebrar com erro de `react`,
`react-native` ou JSX, o arquivo de regras não é puro: isso pesa no critério Regras puras e hook.

## Tela com componentes nativos (20)

**O que conferir.** Em `src/components/`: `Cabecalho` com `Image` da `gota.png` (com `width` e
`height`), `CartaoProgresso` com o trilho e o preenchimento em duas `View` e a largura em porcentagem,
`BotaoCopo` com `Pressable`, `CampoMeta` e `ItemRegistro`. No `App`, `SafeAreaProvider` e
`SafeAreaView` de `react-native-safe-area-context`, com `flex: 1`. Estilos com `StyleSheet.create` no
fim de cada arquivo.

**Como pontuar.**

- **20**: tudo acima, nada atrás do notch, nomes de estilo pelo papel
- **Parcial**: componente que ficou dentro do `App` (-3 cada, até -9); barra feita com texto, como
  `"#####"` (-8); `Button` no lugar de `Pressable` (-4); título atrás do notch (-4); estilos inline
  espalhados ou `StyleSheet.create` no meio do arquivo (-3)
- **0**: a tela do modelo do Expo, ou a tela do `minhas-tarefas-mobile` com os textos trocados

**Erros comuns.** `SafeAreaView` importado de `react-native` (no Android não afasta nada);
`require('./assets/gota.png')` dentro de `src/components/` (o caminho certo sobe duas pastas);
preenchimento sem `height`, que some sem erro; `width: '60'` sem o `%`.

## Registros, lista e remoção (25)

**O que conferir.** Roteiro, passos 2 a 5 e 8. No código: array novo ao adicionar e ao remover
(spread e `filter`), `keyExtractor` devolvendo texto, `ListEmptyComponent`, `Alert.alert` com dois
botões e `onPress` com arrow function no Remover, total com `reduce` e valor inicial.

**Como pontuar.**

- **25**: todos os passos do roteiro certos
- **Parcial**: remove sem pedir confirmação (-6); Cancelar também remove (-6; o bug do enunciado ficou
  no código); a barra passa do cartão (-4); sem mensagem de lista vazia (-4); `ScrollView` com `map` no
  lugar da `FlatList` (-5); registro sem hora (-3); `keyExtractor` faltando ou com o índice (-2)
- **0**: os botões não adicionam nada

**Erros comuns.** `registros.push(novo)`, que não redesenha; `onPress={onAdicionar(ml)}`, que adiciona
copos sem parar ao abrir e termina em "Maximum update depth exceeded"; `ml="300"` no botão, que junta
textos ("0300500"); `reduce` sem valor inicial, que quebra com a lista vazia ("Reduce of empty array
with no initial value").

## Meta editável e validada (10)

**O que conferir.** Roteiro, passos 6 e 7. No `CampoMeta`: `TextInput` com `value` e
`onChangeText`, `keyboardType="numeric"`, mensagem de erro num `Text` embaixo do campo, meta guardada
como número.

**Como pontuar.**

- **10**: os cinco casos errados mostram erro e não mudam a meta; `2500` muda
- **Parcial**: aceita `2000,5` (quase sempre por `parseInt`, que para na vírgula) (-2); erro num
  `Alert` em vez de embaixo do campo (-2); meta guardada como texto (-2); aceita fora de 500 a 5000 (-3)
- **3**: o campo muda a meta, mas não há validação nenhuma
- **0**: meta fixa no código

## Regras puras e hook (20)

**O que conferir.** O comando de "Regras no terminal". `agua.js` sem `import` de `react` ou de
componentes, com as seis funções e os nomes do enunciado. `useConsumo` exportado com nome, devolvendo
`{ registros, meta, total, percentual, falta, mensagem, adicionarCopo, removerRegistro, definirMeta }`
e usando as regras. `App` sem `reduce` nem conta de percentual; `CampoMeta` usando `validarMeta`.

**Como pontuar.**

- **20**: tudo acima, com os resultados esperados
- **Parcial**: cada regra com resultado errado nos exemplos (-3), como `Math.round` no percentual (1999
  de 2000 vira 100) ou `quantoFalta` negativo; regra que lê a hora atual ou o estado por dentro, em vez
  de receber o valor (-3); hook que recalcula sem usar as regras (-4); `App` ainda com cálculo (-4);
  nomes diferentes do enunciado (-2, e peça o ajuste)
- **0**: nem arquivo de regras nem hook; a lógica continua toda no `App`

**Erros comuns.** Faixas com a borda trocada (`mensagemDaFaixa(50)` caindo em "começou");
`formatarHora()` sem parâmetro, usando `new Date()` por dentro; `validarMeta` que devolve só
`true` ou `false`, sem a mensagem; `useConsumo` com `export default` e importado com chaves.

## Caça ao bug (10)

**O bug.** No trecho do enunciado, o botão Remover tem `onPress: removerRegistro(registro.id)`. A
função roda na hora em que o `Alert` é montado, e o `onPress` recebe o que ela devolve (`undefined`).
Sintoma: o registro some assim que a caixa abre, e Cancelar não o traz de volta. Correção:
`onPress: () => removerRegistro(registro.id)`.

**O que conferir.** A seção Caça ao bug do README e o `confirmarRemocao` corrigido no código. O que
vale mais é o "como isolou": um `console.log` em `removerRegistro` que aparece no terminal antes de
qualquer toque na caixa, ou um breakpoint ali que pausa ao abrir o `Alert`.

**Como pontuar.**

- **10**: sintoma, passos, evidência do terminal ou do breakpoint, causa certa e correção testada
- **6**: causa e correção certas, sem dizer como chegou nelas
- **5**: processo bem descrito (reproduziu, isolou, testou hipóteses), mas a causa explicada errada
- **3**: só "faltava a arrow function", sem sintoma nem evidência
- **2**: bug corrigido no código, sem a seção no README
- **0**: nada

**Erros comuns.** Descrever o sintoma como "o Alert não funciona" (ele abre; o problema é a hora em
que a remoção acontece); corrigir trocando o `Alert` por remoção direta, o que tira a confirmação e
pesa também em Registros.

## Repositório e README (15)

**O que conferir.** Repositório público `gota`, sem `node_modules/`; os quatro commits de etapa com as
mensagens do enunciado, de preferência em dias diferentes; README com o que o app faz, dois prints do
celular, como rodar e a seção do bug; `app.json` com `"name": "Gota"`; o app abrindo do zero.

**Como pontuar.**

- **15**: tudo acima
- **Parcial**: cada commit de etapa faltando (-2, até -6); um commit único no fim (no máximo 7); README
  sem prints (-3); sem "como rodar" (-2); `node_modules/` no repositório (-3); `name` do modelo (-1)
- **Devolver para ajuste**, antes da nota: repositório privado, link errado, app que não abre do zero

## Check-in por etapa

No bloco Projeto do roteiro, o check-in tem 2 ou 3 minutos: mãos para quem fez o commit e **uma**
coisa olhada num repositório aberto no projetor.

| Encontro | Commit da etapa anterior | Uma coisa para olhar |
|---|---|---|
| E27 | `Projeto 5: etapa 1, app no celular` | repositório público, sem `node_modules/`, README com "Como rodar" |
| E28 | `Projeto 5: etapa 2, tela com StyleSheet` | `CartaoProgresso.js`: trilho e preenchimento em duas `View`, largura com `%` |
| E29 | `Projeto 5: etapa 3, estado, lista e bug` | README: a seção Caça ao bug tem o "como isolou"? |
| E30 | `Projeto 5: etapa 4, hook, regras e entrega` | `src/regras/agua.js` sem `import` de `react` (a entrega fecha no início do E30) |

## Sinais de cópia

- **Commits** todos no mesmo dia, perto do prazo, ou um commit só com o app pronto
- **Código do laboratório** com nomes trocados: `CartaoTarefa` virou `ItemRegistro` com a mesma
  estrutura e os mesmos estilos, placeholder "Nova tarefa", variáveis `tarefas` ou `pendentes`
- **Código de colega**: mesmas cores, mesmos nomes de estilo, mesmas mensagens de erro, mesmos prints
- **Seção do bug** igual à de outro aluno, ou genérica, sem nenhuma evidência do próprio terminal
- **O aluno não explica o próprio código**

Como agir: converse em particular e peça, em 5 minutos, uma mudança ao vivo no próprio projeto:
"troque o copo de 500 por 400", "deixe a barra verde quando bater a meta", "mostre onde o total é
calculado". Quem fez resolve rápido. Se não explicar nem alterar, devolva o projeto para refazer as
etapas com commits próprios e siga a regra da instituição para cópia; a conversa vale mais que a
punição.
