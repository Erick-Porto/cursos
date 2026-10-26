---
title: Lint, formatação e depuração
summary: Lint do Expo, Prettier e EditorConfig no código do time, e breakpoints no React Native DevTools para achar bugs.
module: ambiente-js
duration_minutes: 40
objectives:
  - Configurar o lint do Expo e corrigir o que as regras de hooks e imports apontam
  - Padronizar o código com Prettier, EditorConfig e formatação ao salvar
  - Depurar a Lojinha com breakpoints, Scope, Watch e pilha de chamadas
  - Reconhecer quando o console.log ainda vale a pena
---

# Lint, formatação e depuração

Programador Mobile: Módulo Específico · Encontro E23 · Aula 27 de 71

---

## O que você vai aprender

:::goal
- Rodar `npx expo lint` e corrigir o que as regras de hooks e imports apontam
- Responder ao aviso de dependências do `useEffect` sem criar laços
- Formatar o código com Prettier, EditorConfig e formatação ao salvar
- Depurar a Lojinha com breakpoints, passo a passo, Scope, Watch e pilha de chamadas
- Deixar o `console.log` para quando o depurador não ajuda
:::

---

## A semana antes da entrega

A Lojinha vai para os testadores na segunda-feira. Na sexta, três coisas acontecem:

- :icon[circle-x] O Detalhe fecha com a tela vermelha: um hook ficou depois de um `return`
- :icon[messages-square] O PR do colega tem 40 comentários, e 35 são sobre aspas e espaços
- :icon[bug] A Garrafa Térmica aparece como `79.90`, sem `R$`, e ninguém sabe de onde vem o valor

Cada problema tem a sua ferramenta: o **linter**, o **formatador** e o **depurador**. Hoje você liga as três na Lojinha.

:::question
Qual dos três problemas daria para achar sem nem abrir o app?
:::

---

## :icon[shield-check] Linter: o revisor que não cansa

Um **linter** lê o código sem executá-lo e aponta erros e riscos conhecidos. No JavaScript, o mais usado é o **ESLint**, e o Expo traz um conjunto de regras pronto para apps React Native.

```bash
npx expo lint
```

- Na primeira vez, o comando oferece instalar `eslint` e `eslint-config-expo` nas devDependencies e cria o `eslint.config.js`: aceite
- Depois, ele confere as pastas `app/` e `src/` e lista o que encontrou
- Se o `package.json` ainda não tiver, crie o script `"lint": "expo lint"` e rode com `npm run lint`

O linter não substitui o teste nem o depurador: ele pega **forma e regras**, não a lógica do negócio.

---

## :icon[list-checks] As regras do Expo: hooks e imports

| Regra | O que aponta | Exemplo na Lojinha |
|---|---|---|
| `react-hooks/rules-of-hooks` | hook dentro de `if`, laço ou depois de um `return` | `useCarrinho()` abaixo do `if (!produto) return` |
| `react-hooks/exhaustive-deps` | `useEffect` que usa um valor de fora da lista de dependências | efeito do `Esqueleto` que anima `opacidade` com `[]` |
| `import/no-unresolved` | import de um arquivo que não existe | `'../utils/formatr'`, com erro de digitação |
| `no-unused-vars` | variável ou import que ninguém usa | `useRef` importado e esquecido |

Cada resultado tem uma gravidade. **error** quebra uma regra do React ou impede o app de funcionar; **warning** aponta um risco. A entrega da Lojinha pede zero dos dois.

---

## :icon[square-terminal] Lendo a saída do lint

```bash
src/telas/Detalhe.js
  15:23  error    React Hook "useCarrinho" is called conditionally. React Hooks must be called in the exact same order in every component render. Did you accidentally call a React Hook after an early return?  react-hooks/rules-of-hooks

src/components/ui/Esqueleto.js
  18:6  warning  React Hook useEffect has a missing dependency: 'opacidade'. Either include it or remove the dependency array  react-hooks/exhaustive-deps

2 problems (1 error, 1 warning)
```

Cada linha traz o arquivo, a posição (linha:coluna), a gravidade, a mensagem e o nome da regra. Para o erro, suba o hook:

```jsx
const { adicionar } = useCarrinho(); // todos os hooks antes de qualquer return
if (!produto) return <Text>Produto não encontrado</Text>;
```

`npx expo lint --fix` corrige sozinho o que é mecânico. Regras de hooks você corrige à mão, entendendo o motivo.

---

## :icon[refresh-cw] O aviso de dependências do useEffect

O `exhaustive-deps` quer na lista todo valor de fora que o efeito usa. Antes, veja o que ele é:

| O valor é... | O que fazer | Exemplo |
|---|---|---|
| estável: veio do `useRef` ou é um `set...` | acrescente à lista, sem medo | `[opacidade]` |
| uma prop ou um estado | acrescente: o efeito roda de novo quando ele muda | `[visivel, mensagem]` |
| uma função criada no componente | mova a função para dentro do efeito | função usada só ali |

Se a função também serve a um botão, como o `carregar` do "Tentar novamente", acrescentá-la cria um laço, porque ela nasce a cada renderização. Desligue a regra **só nessa linha**, com o motivo:

```jsx
// Carrega só ao abrir a tela; carregar muda a cada renderização
// eslint-disable-next-line react-hooks/exhaustive-deps
useEffect(() => { carregar(); }, []);
```

---

## Pense

:::question
Rode o lint de cabeça. Quais problemas deste `Carrinho` o `npx expo lint` aponta, e qual passa sem aviso?

```jsx
import { useEffect } from 'react';
import { formatarPreco } from '../utils/formatr';
// demais imports corretos

export default function Carrinho() {
  const { itens, total } = useCarrinho();
  if (itens.length === 0) return <EstadoVazio titulo="Seu carrinho está vazio" />;
  const { cores } = useTema();
  return (
    <Text style={{ color: cores.texto }}>
      {itens.length} itens: {formatarPreco(total)}
    </Text>
  );
}
```
:::

:::tip Resposta
- `useEffect` importado e sem uso: aviso de `no-unused-vars`
- `'../utils/formatr'`: erro de `import/no-unresolved`
- `useTema()` depois do `return`: erro de `rules-of-hooks`
- `itens.length` conta linhas, não unidades: 2 Garrafas aparecem como "1 itens". Nenhuma regra entende a lógica do negócio: isso é trabalho do depurador e dos testes (E24)
:::

---

## :icon[wand] Prettier: formatação sem discussão

Um **formatador** reescreve o código num estilo fixo: aspas, ponto e vírgula, quebras de linha e recuo. O PR volta a discutir o que importa.

```bash
npx expo install prettier -- --save-dev
```

Crie o `.prettierrc` na raiz, com o estilo que a Lojinha já usa:

```json
{
  "singleQuote": true,
  "printWidth": 100
}
```

```bash
npx prettier --write app src scripts   # formata as três pastas
npx prettier --check app src scripts   # só confere, sem mudar nada
```

Ponto e vírgula e recuo de 2 espaços já são o padrão. No `package.json`, crie `"formatar": "prettier --write app src scripts"`. Lint e Prettier se completam: o lint pega **erros**, o Prettier cuida da **aparência**.

---

## :icon[save] EditorConfig e formatar ao salvar

O **EditorConfig** combina o básico entre editores e sistemas: recuo, fim de linha e codificação. No VS Code, instale as extensões **EditorConfig**, **Prettier** e **ESLint**. Na raiz, o `.editorconfig`:

```plaintext
root = true

[*]
indent_style = space
indent_size = 2
end_of_line = lf
charset = utf-8
insert_final_newline = true
```

E o `.vscode/settings.json`, que vale para quem abrir o projeto:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}
```

Com os três arquivos no repositório, cada <kbd>Ctrl</kbd> + <kbd>S</kbd> formata o arquivo, e o time inteiro salva igual. O `end_of_line = lf` evita o diff em que todas as linhas mudam só por causa do fim de linha do Windows.

---

## :icon[bug] React Native DevTools: a tecla j

A Garrafa Térmica aparece como `79.90`, sem `R$`. Em vez de espalhar `console.log`, abra o **depurador**:

:::steps
1. Com a Lojinha aberta no Expo Go, vá ao terminal do `npx expo start`
2. Tecle <kbd>j</kbd>: o **React Native DevTools** abre no Chrome ou no Edge do computador
3. Abra a aba **Sources**
4. Tecle <kbd>Ctrl</kbd> + <kbd>P</kbd> e digite `formatar` para abrir `src/utils/formatar.js`
:::

O DevTools conversa com o Hermes do celular, e o código que você vê é o seu, com os nomes e as linhas originais. A aba **Console** mostra os `console.log` do app e aceita expressões.

:::tip
Ele precisa do Chrome ou do Edge. Se a tecla não abrir nada, recarregue com <kbd>r</kbd> e tente de novo.
:::

---

## :icon[pause] Breakpoints: pausar e andar passo a passo

Clique no número da linha do `return` de `formatarPreco` para criar um **breakpoint**: quando o app passar por ali, o JavaScript **para** e você comanda.

| Tecla | Botão | O que faz |
|---|---|---|
| <kbd>F8</kbd> | Resume | segue até o próximo breakpoint |
| <kbd>F10</kbd> | Step over | roda a linha e para na próxima |
| <kbd>F11</kbd> | Step into | entra na função chamada na linha |
| <kbd>Shift</kbd> + <kbd>F11</kbd> | Step out | sai da função e volta a quem chamou |

---

## :icon[pause] Breakpoint condicional

O `formatarPreco` roda uma vez por cartão. Para não apertar <kbd>F8</kbd> a cada um, use o botão direito no número da linha, **Add conditional breakpoint**, com `typeof valor !== 'number'`:

:::center
![Animação: com o breakpoint condicional typeof valor !== 'number' na linha do return, as chamadas formatarPreco(199.9) e formatarPreco(249.9) seguem direto e o app pausa quando chega formatarPreco("79.90")](images/e23-breakpoint-condicional.svg)
:::

O app só para quando a condição é verdadeira: os preços em número passam direto, e a pausa acontece no cartão da Garrafa Térmica.

---

## :icon[eye] Scope, Watch e pilha de chamadas

Pausado na Garrafa, três painéis contam a história:

| Painel | O que mostra | Na pausa em `formatarPreco` |
|---|---|---|
| **Scope** | as variáveis da função naquele instante | `valor: "79.90"`, entre aspas: é texto |
| **Watch** | expressões que você escolhe acompanhar | `typeof valor` mostra `"string"` |
| **Call Stack** | quem chamou quem, do mais recente ao mais antigo | `formatarPreco`, `CartaoProduto`, ... |

Clique em `CartaoProduto` na pilha: aparece a linha que chamou, e o Scope mostra `produto` com `preco: "79.90"`. O erro veio do dado, não da função: no `catalogo.json`, alguém escreveu o preço entre aspas.

:::tip
Pausado, o Console avalia expressões com as variáveis do momento, como `Number(valor)`.
:::

---

## Pratique

:::example Desafio
No Início, a tela de erro aparece quase sempre, mas `CHANCE_DE_ERRO` vale `0.3`. O trecho suspeito:

```jsx
setTimeout(() => {
  if (Math.random() > CHANCE_DE_ERRO) setErro('Não conseguimos buscar os produtos.');
  setCarregando(false);
}, 1500);
```

Onde você põe o breakpoint, e como enxerga o número sorteado?
:::

:::tip Resposta
Na linha do `if`, **dentro** do callback: um breakpoint na linha do `setTimeout` para antes da espera, e não depois. O sorteio não fica em variável nenhuma; guarde-o numa por um momento, `const sorteio = Math.random();`, e compare com ele. O Scope mostra `sorteio: 0.62`, e o F10 entra no `setErro`. Só que 0.62 deveria dar sucesso: a comparação está invertida, e o certo é `<`.
:::

---

## :icon[terminal] console.log: o último recurso

O `console.log` funciona: a saída aparece no terminal do `npx expo start` e na aba Console do DevTools. Mas ele custa caro:

- A cada nova suspeita, você edita, salva e reproduz o problema de novo
- Mostra um valor por vez; o breakpoint mostra **todas** as variáveis e a pilha
- Esquecido no código, enche o terminal e vai junto para o app publicado
- Objetos grandes aparecem resumidos ou cortados

Use quando pausar atrapalha: algo que depende do tempo, como uma animação ou uma sequência de toques rápidos. E apague antes do commit: o `git diff` mostra se sobrou algum.

---

## :icon[triangle-alert] Erros comuns

:::warning
- Desligar uma regra no arquivo inteiro para sumir com os avisos: desligue só a linha, com o motivo
- Acrescentar ao `useEffect` uma função que nasce a cada renderização: o efeito vira um laço
- Misturar a formatação de 30 arquivos com uma correção no mesmo commit: formate num commit separado
- Esquecer um breakpoint ativo ou um `debugger;` no código: o app parece travado. Aperte <kbd>F8</kbd> e limpe os breakpoints
- Pôr o breakpoint na linha do `setTimeout` em vez de dentro do callback
- Achar que lint zerado é app sem bug: ele não entende a regra de negócio
:::

---

## Resumo

:::summary
- `npx expo lint` aponta erros e riscos sem executar o código; as regras do Expo vigiam hooks e imports
- Aviso de dependência pede análise: valor estável entra na lista; função do componente vai para dentro do efeito
- Prettier com `.prettierrc`, EditorConfig e formatar ao salvar acabam com a discussão de estilo
- A tecla <kbd>j</kbd> abre o DevTools: breakpoints, passo a passo, Scope, Watch e pilha mostram o que o código faz de verdade
- `console.log` é o último recurso, e não vai para o commit
:::

---

## :icon[arrow-right] Próximos passos

Na aula 28, o editor passa a conferir os seus dados enquanto você digita:

- :icon[file-check] o que o **TypeScript** resolve num app e onde ele confere o código
- :icon[braces] `type` e `interface` para produtos, itens do carrinho e props
- :icon[circle-alert] o `undefined` apontado antes de virar tela vermelha
- :icon[flask-conical] o laboratório: 3 bugs caçados só com breakpoints, lint zerado, Prettier e o `formatar.ts`
