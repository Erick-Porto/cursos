# Gota

> **Etapa 3 (E31):** troque este parágrafo por duas ou três frases suas: o que o app mostra
> e o que a pessoa consegue fazer nele.

## Como rodar

1. Instale as dependências (uma vez só): `npm install`
2. Ligue o servidor: `npx expo start`
3. Abra o **Expo Go** no celular e leia o QR code que aparece no terminal

O celular e o computador precisam estar no mesmo Wi-Fi. Se a rede não deixar, use
`npx expo start --tunnel`. O Expo Go só abre o app com a mesma conta Expo no terminal
(`npx expo login`) e no Expo Go. Para desligar o servidor, aperte `Ctrl + C` no terminal.

## Prints

> **Etapa 3 (E31):** tire dois prints do app no celular, um com a lista vazia e um com três
> copos registrados. Salve no computador como `docs/vazio.png` e `docs/com-registros.png`
> e troque este parágrafo por estas duas linhas:
> `![Gota com a lista vazia](docs/vazio.png)`
> `![Gota com três copos registrados](docs/com-registros.png)`

## Feito por

> **Etapa 3 (E31):** o seu nome e o link do seu GitHub.

---

## O kit

Este projeto começou do kit do Projeto 5 do curso Programador Mobile: um app Expo com as
peças prontas. Você escreve um componente, o `BotaoCopo`, e a tela no `App.js`.

Antes do primeiro commit, crie na pasta do projeto o arquivo `.gitignore` com estas duas
linhas, para o Git deixar de fora os pacotes e as configurações do Expo:

```plaintext
node_modules/
.expo/
```

### O que tem em cada pasta

| Arquivo ou pasta | O que é |
|---|---|
| `App.js` | a tela do app; é aqui que você trabalha (os comentários dizem onde entra cada etapa) |
| `src/components/` | as peças prontas do kit; o seu `BotaoCopo.js` entra aqui |
| `src/hora.js` | `horaAgora()`, que devolve a hora deste momento, como `'08:05'` |
| `src/tema.js` | as cores, os espaços e os cantos do app, cada um com um nome |
| `assets/` | a gota (`gota.png`) e o ícone do app (`icone.png`) |
| `app.json` | o nome e o ícone do app |
| `index.js` | liga o `App` ao Expo; você não precisa mexer |

### Peças prontas (`src/components/`)

| Componente | Props | O que mostra |
|---|---|---|
| `Tela` | o que vai entre `<Tela>` e `</Tela>` | o fundo do app, longe do entalhe e da barra de status; as peças de dentro ficam uma embaixo da outra |
| `Linha` | o que vai entre `<Linha>` e `</Linha>` | as peças de dentro lado a lado, com o mesmo espaço entre elas |
| `ProgressoMeta` | `total` e `meta` (números, em ml) | o cartão com "800 ml de 2000 ml", a barra, o percentual e quanto falta |
| `ItemRegistro` | `ml` (número), `hora` (texto) e `aoRemover` (função) | um copo da lista: "300 ml", "às 14:05" e o botão Remover |
| `ListaVazia` | `texto` (texto) | a gota clarinha e a frase, quando a lista não tem nenhum copo |

Cada componente tem, no começo do arquivo, um comentário com as props que recebe. Você usa
as peças pelo `import`, sem mudar nada dentro delas.

### Versões

Expo SDK 58 (`expo` 58.0.23), React Native 0.88.1, React 19.3.0, `expo-status-bar` 58.0.4
e `react-native-safe-area-context` 5.11.1. Abre no Expo Go da loja (versão 58) e precisa
do Node 22.13 ou mais novo. O `package-lock.json` guarda as versões exatas: com ele, o
`npm install` instala as mesmas em todos os computadores.
