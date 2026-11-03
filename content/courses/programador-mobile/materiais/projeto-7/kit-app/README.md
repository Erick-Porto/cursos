# Kit do app: Projeto 7 (projeto integrador)

Ponto de partida do projeto integrador do curso Programador Mobile: um app Expo com Expo Router,
o mesmo UI kit, os mesmos tokens e o mesmo tema claro e escuro do Projeto 6, e os dados dos três
briefings. A equipe monta as telas com as peças do kit, e cada pessoa cria o seu componente.

## Como rodar

```bash
npm install
npx expo start
```

Abra o app Expo Go no celular e leia o QR code que aparece no terminal. O celular e o computador
precisam estar na mesma rede Wi-Fi. Se o QR code não abrir, rode `npx expo start --tunnel`.

## Primeiros passos da equipe (E41)

Quem cria o repositório faz, nesta ordem:

1. Crie o arquivo `.gitignore` com as linhas abaixo (o zip do kit não traz arquivos que começam com ponto)
2. Crie a pasta `app/(abas)`, com os parênteses, e leve para dentro dela o `index.js` e o `sobre.js`
3. Crie o `app/(abas)/_layout.js` com as abas Início e Sobre e, no `app/_layout.js`, troque a linha
   `index` por `(abas)`, como no E37
4. Apague de `src/data/` os dois arquivos dos briefings que a equipe não escolheu
5. Primeiro commit, push para um repositório público e o convite para a equipe

```plaintext
node_modules/
.expo/
dist/
```

## Versões

Expo SDK 58 (`expo` 58.0.23), React Native 0.88.1, React 19.3.0, Expo Router 58.0.30 e
AsyncStorage 2.2.0 (`@react-native-async-storage/async-storage`, usado no E43). Abra no Expo Go da
loja (versão para o SDK 58). O `package-lock.json` garante as mesmas versões para toda a equipe:
use `npm install`, nunca apague o lock.

## Pastas

```plaintext
app/                    as telas (cada arquivo é uma rota do Expo Router)
  _layout.js            o que envolve todas as telas: o tema e a pilha
  index.js              Início (vai para app/(abas)/ no E41)
  sobre.js              Sobre, pronta (vai para app/(abas)/ no E41)
src/
  components/ui/        o UI kit pronto: importe de '@/components/ui'
  components/           os componentes da equipe, um ou dois por pessoa
  theme/                tokens.js (cores, espaços, raios, fontes), useTema e as opções da navegação
  data/                 equipe.js (nome do app e equipe) e os dados dos três briefings
  utils/                formatarReais, lerValor, formatarData e paraBusca
```

O `@` nos imports é um atalho para a pasta `src/`: `import { Botao } from '@/components/ui'`
funciona em qualquer arquivo, em qualquer pasta. Quem cria o atalho é o `jsconfig.json`.

## Peças do kit

Cada peça tem, no topo do arquivo, a lista das props que recebe.

| Peça | Props | O que mostra |
|---|---|---|
| `Tela` | `rolar`, `comCabecalho`, `style` | o fundo do tema e a área segura, com padding e gap de 16 |
| `Cartao` | `titulo`, `style` | moldura com fundo, borda e cantos arredondados |
| `Badge` | `texto`, `tom` | selo pequeno: tons `neutro`, `sucesso`, `alerta` e `perigo` |
| `Botao` | `titulo`, `onPress`, `variante`, `icone`, `desabilitado` | botão: `primaria`, `secundaria` ou `perigo` |
| `BotaoIcone` | `icone`, `rotulo`, `onPress`, `cor` | botão redondo só com ícone, alvo de 48 por 48 |
| `Campo` | `rotulo`, `erro`, `icone` e as props do `TextInput` | rótulo, caixa de texto e erro embaixo |
| `Opcoes` | `rotulo`, `opcoes`, `valor`, `onMudar`, `erro` | fileira de botões para escolher uma opção |
| `LinhaInfo` | `icone`, `texto` | uma linha com ícone e texto |
| `EstadoVazio` | `titulo`, `mensagem`, `icone`, `textoAcao`, `onAcao` | aviso de lista vazia, com ação opcional |
| `EstadoErro` | `mensagem`, `titulo`, `onTentarDeNovo` | aviso de erro com "Tentar de novo" |
| `Carregando` | `texto` | rodinha de espera com texto |

Fora das peças: `useTema()` devolve `{ cores, escuro, alternarTema }`.

## Os dados

`src/data/agenda.js`, `src/data/cardapio.js` e `src/data/gastos.js` têm os dados fixos de cada
briefing e uma lista de exemplo, para as telas não começarem vazias. A equipe fica só com o do seu
briefing. No E43, o que a pessoa cria no app passa a ficar guardado no celular.
