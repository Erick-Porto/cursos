---
title: npm e as dependências do Expo
summary: O package.json da Lojinha linha a linha, faixas de versão, npx expo install, expo-doctor, scripts e pacotes.
module: ambiente-js
duration_minutes: 40
objectives:
  - Ler o package.json da Lojinha e separar dependencies de devDependencies
  - Interpretar as faixas de versão com ^ e ~ e o papel do package-lock.json
  - Instalar e conferir pacotes com npx expo install, --check e expo-doctor
  - Criar scripts no package.json e avaliar um pacote antes de instalá-lo
---

# npm e as dependências do Expo

Programador Mobile: Módulo Específico · Encontro E22 · Aula 25 de 71

---

## O que você vai aprender

:::goal
- Ler o `package.json` da Lojinha linha a linha
- Entender as faixas de versão (`^` e `~`) e o `package-lock.json`
- Instalar com `npx expo install` e conferir a saúde do projeto com `expo-doctor`
- Criar o script `relatorio` e escolher pacotes com critério
:::

---

## Funciona no meu celular

Sexta à tarde, você instala com `npm install` uma biblioteca de carrossel para os banners da Início e faz o commit sem o `package-lock.json`. No seu celular, tudo certo.

Segunda de manhã, seu colega clona a Lojinha, roda `npm install`, lê o QR e o Expo Go mostra a tela vermelha. O terminal avisa que um pacote não está na versão esperada pelo SDK. O código é o mesmo; as versões, não.

:::question
Como a equipe inteira, e o Expo Go, passam a usar exatamente as mesmas versões de cada pacote?
:::

---

## :icon[file-code] O package.json (1): identidade e scripts

```json
{
  "name": "lojinha",
  "version": "1.0.0",
  "main": "expo-router/entry",
  "private": true,
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web"
  }
}
```

- **`name`** e **`version`**: nome e versão do projeto no npm; a versão que aparece na loja fica no `app.json` (E44)
- **`main`**: a porta de entrada; desde o E16, o Expo Router
- **`private`**: impede que a Lojinha seja publicada no npm por engano
- **`scripts`**: atalhos de terminal; `npm start` roda `expo start`

---

## :icon[package] O package.json (2): dependências

```json
"dependencies": {
  "expo": "~X.Y.Z",
  "expo-font": "~X.Y.Z",
  "expo-image": "~X.Y.Z",
  "expo-router": "~X.Y.Z",
  "react": "X.Y.Z",
  "react-native": "X.Y.Z"
},
"devDependencies": {
  "jest-expo": "~X.Y.Z"
}
```

- **`dependencies`**: o que o app usa quando roda no celular
- **`devDependencies`**: ferramentas de quem desenvolve (testes, lint, formatação), que as telas nunca importam
- No lugar de `X.Y.Z`, o seu arquivo tem os números de cada pacote. O `jest-expo` só chega no E24

```bash
npx expo install expo-haptics                  # entra em dependencies
npx expo install jest-expo jest -- --save-dev  # entra em devDependencies
```

---

## :icon[tag] Versão semântica: X.Y.Z

Quase todo pacote segue a **versão semântica** (semver): **MAJOR.MINOR.PATCH**, ou maior, menor e correção. Imagine a biblioteca de carrossel na versão `2.4.1`:

| Lançamento | Nova versão | O que significa para a Lojinha |
|---|---|---|
| Correção | `2.4.2` | um bug corrigido; seu código não muda |
| Menor | `2.5.0` | recurso novo; o que existia continua igual |
| Maior | `3.0.0` | algo quebrou de propósito: props ou funções mudaram |

Antes de subir uma versão maior, leia as notas de lançamento (o *changelog*). E lembre: semver é uma promessa do autor, não uma garantia. Por isso a equipe trava as versões.

---

## :icon[sliders-horizontal] Faixas: ^ e ~

No `package.json`, o símbolo antes do número diz quais versões o npm pode instalar:

:::center
![Diagrama: numa reta de versões, a faixa ~2.4.1 vai até 2.4.9 e para antes de 2.5.0; a faixa ^2.4.1 vai até 2.9.3 e para antes de 3.0.0, a versão maior](images/e22-faixas-semver.svg)
:::

- **`"~2.4.1"`** aceita só correções (`2.4.2`, `2.4.9`); **`"^2.4.1"`** aceita também recursos novos (`2.5.0`, `2.9.3`); nenhum dos dois aceita `3.0.0`
- Sem símbolo, `"2.4.1"` aceita só a própria `2.4.1`
- O `npm install` grava `^` por padrão
- O `npx expo install` grava `~` nos pacotes do SDK: cada SDK é testado com uma versão de cada pacote nativo, e o Expo Go traz exatamente essas

---

## :icon[lock] package-lock.json: a versão exata

O `package.json` guarda a faixa que você pediu. O **`package-lock.json`** guarda a versão exata que foi instalada de cada pacote e de cada dependência deles.

| Arquivo | Guarda | Vai para o Git? |
|---|---|---|
| `package.json` | as faixas que você pediu | sim |
| `package-lock.json` | a versão exata de tudo | sim |
| `node_modules/` | os arquivos baixados | não |

- Commit do lock sempre junto com o `package.json`
- Nunca edite o lock à mão: quem escreve nele é o npm
- `npm install` respeita o lock; `npm ci` apaga o `node_modules` e instala exatamente o lock (é o que a integração contínua usa no E24)

---

## Pense

:::question
No `package.json`, a biblioteca de carrossel está como `"^2.4.1"`. O autor já publicou `2.4.3`, `2.6.0` e `3.0.0`.

1. Sem `package-lock.json`, que versão um `npm install` instala?
2. E se o lock do commit registrou `2.4.1`?
3. E se a faixa fosse `"~2.4.1"`, sem lock?
:::

:::tip Resposta
1. `2.6.0`: a mais nova dentro de `^`, que para antes de `3.0.0`
2. `2.4.1`, para todos da equipe: o lock manda enquanto a versão dele couber na faixa
3. `2.4.3`: o `~` só aceita correções

É o caso da sexta-feira: com o lock no commit, seu colega teria recebido a mesma versão que você.
:::

---

## :icon[terminal] npm install ou npx expo install?

| | `npm install pacote` | `npx expo install pacote` |
|---|---|---|
| Versão escolhida | a mais nova publicada | a testada com o SDK do projeto |
| Faixa gravada | `^` | `~` nos pacotes do SDK |
| Pacote fora da lista do SDK | instala | repassa ao npm, que instala |

```bash
npx expo install expo-haptics   # vibração ao adicionar ao carrinho
```

Regra da Lojinha: pacote do app entra **sempre** com `npx expo install`. Ele nunca escolhe pior que o `npm install`: quando o Expo não conhece o pacote, o resultado é o mesmo; quando conhece, a versão é a que o Expo Go suporta.

---

## :icon[stethoscope] Conferindo a saúde do projeto

```bash
npx expo install --check   # lista pacotes fora da versão do SDK e oferece corrigir
npx expo install --fix     # corrige sem perguntar
npx expo-doctor            # checagem completa do projeto
```

- **`--check`** compara cada pacote com a versão que o SDK espera
- **`expo-doctor`** vai além: versões, pacotes duplicados, configuração do `app.json` e pacotes sem manutenção, consultando o React Native Directory
- Rode os dois depois de instalar um pacote, ao clonar um projeto e antes de abrir um Pull Request
- A meta é a mensagem final do `expo-doctor` dizendo que nenhum problema foi encontrado

:::tip
Mensagem de versão no terminal do `npx expo start`? É o mesmo aviso do `--check`: corrija antes de seguir.
:::

---

## :icon[zap] npx: executar sem instalar

O **`npx`** roda o comando de um pacote. Se o pacote está no `node_modules` do projeto, usa essa versão; se não está, baixa, roda e descarta.

| Comando | O que acontece |
|---|---|
| `npx expo start` | usa o CLI que vem no pacote `expo` do projeto |
| `npx expo-doctor` | baixa o doutor só para esta execução |
| `npx create-expo-app lojinha` | baixa o criador de projetos só para esta vez |

Por isso o curso nunca pede para instalar o CLI do Expo de forma global: ele vem dentro do pacote `expo`, na versão certa para o seu SDK. Cada projeto usa o seu.

---

## :icon[square-terminal] Scripts: o relatório com um comando

No E21, você rodava `node scripts/relatorio-catalogo.mjs`. Dê um nome a esse comando:

```json
"scripts": {
  "start": "expo start",
  "android": "expo start --android",
  "ios": "expo start --ios",
  "web": "expo start --web",
  "relatorio": "node scripts/relatorio-catalogo.mjs"
}
```

```bash
npm run relatorio
npm run relatorio -- --categoria=audio
```

- `npm run nome` executa o script; `start` e `test` dispensam o `run`
- Tudo depois de `--` vai para o script; sem ele, o npm fica com o `--categoria` e o filtro não chega
- Dentro de um script, os comandos do `node_modules` rodam sem `npx`
- Quem clona a Lojinha descobre os comandos lendo o `package.json`

---

## :icon[shield-alert] npm audit: vulnerabilidades conhecidas

```bash
npm audit
```

O **`npm audit`** compara as versões instaladas com uma lista pública de falhas de segurança e mostra cada uma com a gravidade: *low*, *moderate*, *high* ou *critical*.

- Boa parte dos alertas vem de ferramentas que rodam só no seu computador, como o Metro e o Babel, e não vão para o app instalado
- `npm audit fix`, sem mais nada, só atualiza dentro das faixas; depois, rode o `expo-doctor`
- Alerta grave num pacote que as telas importam: procure a versão corrigida com `npx expo install` ou troque de pacote

:::danger
Nunca rode `npm audit fix --force` num app Expo: ele sobe versões maiores, tira pacotes da versão do SDK e o app deixa de abrir.
:::

---

## :icon[search-check] Como escolher um pacote

Antes de instalar, responda:

1. **Existe no Expo SDK?** Pacotes `expo-*` da documentação do Expo são a primeira escolha: testados com o SDK e com o Expo Go
2. **O que diz o React Native Directory?** Em reactnative.directory, veja as plataformas (Android e iOS) e se funciona no Expo Go
3. **Está vivo?** Lançamento recente e issues respondidas
4. **Quantos usam?** Downloads por semana e estrelas são sinal, não prova
5. **Precisa mesmo?** Para formatar preço, o `Intl` do JavaScript resolve; não instale um pacote por uma função de cinco linhas
6. **A licença permite uso comercial?** MIT e Apache permitem

Exemplo: vibrar ao adicionar ao carrinho pede o `expo-haptics`, do SDK, que funciona no Expo Go.

---

## :icon[triangle-alert] Erros comuns

:::warning
- Instalar pacote do app com `npm install`: versão fora do SDK e tela vermelha no Expo Go
- Deixar o `package-lock.json` fora do commit, ou apagá-lo para "resolver" um erro
- Trocar números à mão no `package.json` em vez de reinstalar com `npx expo install`
- Ferramenta de teste ou de lint em `dependencies`: faltou o `-- --save-dev`
- `npm run relatorio --categoria=audio` sem o `--`: o filtro não chega ao script
- `npm audit fix --force` num app Expo
:::

---

## Resumo

:::summary
- `dependencies` vão para o app; `devDependencies` são ferramentas de quem desenvolve
- Semver é MAJOR.MINOR.PATCH: `~` aceita correções, `^` aceita também recursos novos, nenhum aceita versão maior
- O `package-lock.json` trava a versão exata de tudo e vai para o Git junto com o `package.json`
- No Expo, instale com `npx expo install` e confira com `--check` e `npx expo-doctor`
- Scripts dão nome aos comandos (`npm run relatorio -- --categoria=audio`); escolha pacotes pelo SDK, pelo React Native Directory e pela manutenção
:::

---

## :icon[arrow-right] Próximos passos

Na aula 26, a Lojinha passa a ser trabalho de equipe:

- :icon[git-branch] a branch `feature/relatorio-categoria`, sem mexer na `main`
- :icon[messages-square] um Pull Request revisado por um colega antes do merge
- :icon[swords] um conflito de verdade no `catalogo.json`, resolvido em dupla
- :icon[eye-off] o `.gitignore` do Expo, boas mensagens de commit e Issues
