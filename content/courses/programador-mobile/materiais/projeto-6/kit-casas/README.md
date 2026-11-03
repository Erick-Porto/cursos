# Casas de adoção: kit do Projeto 6

Ponto de partida do Projeto 6 do curso Programador Mobile: um app Expo com Expo Router, um UI kit
pronto, tokens de design, tema claro e escuro e os dados de 12 casas de adoção fictícias.
Você monta as telas com as peças do kit e cria o seu componente, o `CartaoCasa`.

## Como rodar

```bash
npm install
npx expo start
```

Abra o app Expo Go no celular e leia o QR code que aparece no terminal. O celular e o computador
precisam estar na mesma rede Wi-Fi. Se o QR code não abrir, rode `npx expo start --tunnel`.

Antes do primeiro commit, crie o arquivo `.gitignore` com estas linhas (o zip do kit não traz
arquivos que começam com ponto):

```plaintext
node_modules/
.expo/
dist/
```

## Versões

Expo SDK 58 (`expo` 58.0.23), React Native 0.88.1, React 19.3.0, Expo Router 58.0.30.
Abra no Expo Go da loja (versão para o SDK 58).
O `package-lock.json` garante as mesmas versões para toda a turma: use `npm install`, nunca apague o lock.

## Pastas

```plaintext
app/                    as telas (cada arquivo é uma rota do Expo Router)
  _layout.js            o que envolve todas as telas: tema, lista de casas e a pilha
  index.js              Início, a primeira tela (você monta no E33)
  cadastro.js           Cadastro (você monta no E38)
  sobre.js              Sobre, pronta (vira uma aba no E37)
src/
  components/ui/        o UI kit pronto: importe de '@/components/ui'
  components/           o seu CartaoCasa (E35)
  theme/                tokens.js (cores, espaços, raios, fontes), useTema e as opções da navegação
  data/                 casas.js, o servidor de mentira e o useCasas
  utils/                paraBusca e resumoDasCasas
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

Fora das peças: `useTema()` devolve `{ cores, escuro, alternarTema }`; `useCasas()` devolve
`{ casas, carregando, atualizando, erro, recarregar, adicionarCasa }`.

## Os dados

`src/data/casas.js` tem as 12 casas do curso. Não mude os dados: a correção confere a tela com eles.
As casas que você cadastrar ficam na memória e somem quando o app recarrega.
