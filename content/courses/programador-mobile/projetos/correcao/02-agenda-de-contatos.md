## Antes de corrigir

Clone o repositório do aluno numa pasta de correção e rode, na raiz:

```bash
npm ci                 # ou npm install, se não houver package-lock.json
npm run verificar      # ESLint e Jest
git log --reverse --format="%ad  %s" --date=format:"%d/%m %H:%M"
node src/scripts/buscar.js ana 9876 zé
node src/scripts/resumo.js 10
node src/scripts/digitar.js
npx serve .            # e abra o endereço com /web/ no fim
```

Se você tiver a solução de referência (pasta `privado/projetos/projeto-2/`, fora do git, com um commit por etapa), rode `npm ci` e `npm test` nela uma vez: 58 testes, e os scripts com as saídas do enunciado. Ela serve para comparar resultados, não para comparar código: soluções diferentes que acertam os exemplos valem nota cheia.

**Bateria das regras.** Salve as linhas abaixo como `conferir.mjs` na raiz do repositório do aluno, rode `node conferir.mjs` e apague o arquivo depois (colado no REPL, o `await` da primeira linha não espera). Cada linha imprime só `true` quando as funções acertam os exemplos do enunciado; um `false` ou um erro aponta a função e a borda.

```javascript
const a = await import('./src/index.js');
const ids = (lista) => lista.map((c) => c.id).join(',');
console.log(ids(a.buscarContatos(a.contatos, 'ana')) === '1,5,7', ids(a.buscarContatos(a.contatos, '9876')) === '1,10,11', a.buscarContatos(a.contatos, 'zé').length === 0, a.buscarContatos(a.contatos, '  ').length === 15);
console.log(a.ordenarPorNome(a.contatos)[0].id === 4, a.contatos[0].id === 1, a.registrarBusca(['ana', 'bruno', 'carla'], 'Bruno').join() === 'Bruno,ana,carla', a.registrarBusca(['a', 'b', 'c', 'd', 'e'], 'f').length === 5);
console.log(Object.keys(a.agruparPorInicial(a.ordenarPorNome(a.contatos))).join('') === 'ABCDEFGHJMPR', JSON.stringify(a.contarPorGrupo([])) === '{"familia":0,"amigos":0,"trabalho":0}', ids(a.aniversariantesDoMes(a.contatos, 10)) === '5,1');
const nova = a.adicionarContato(a.contatos, { nome: 'Teste', telefone: '11912345678', grupo: 'amigos', senha: '1' });
console.log(nova.length === 16, nova[15].id === 16, nova[15].email === '', !('senha' in nova[15]), a.removerContato(a.contatos, 99).length === 15);
console.log(JSON.stringify(a.validarContato({ nome: 'Ana', telefone: '1134567890', grupo: 'amigos' })) === '{}', Object.keys(a.validarContato({ nome: ' ', telefone: '98765-4321', email: 'ana@', aniversario: '2001-02-29', grupo: '' })).join() === 'nome,telefone,email,aniversario,grupo', a.validarContato({ aniversario: '2000-02-29' }).aniversario === undefined);
console.log(a.contatos.filter(a.doGrupo('familia')).length === 4, a.editarContato(a.contatos, 2, { id: 50, grupo: 'trabalho' })[1].id === 2, a.editarContato(a.contatos, 2, { grupo: 'trabalho' })[0] === a.contatos[0], Object.isFrozen(a.contatos) && Object.isFrozen(a.contatos[0]));
const fav = a.alternarFavorito(new Set([1]), 4);
console.log(fav.size === 2, a.ehFavorito(fav, '4') === false, a.listarFavoritos(new Set([1, 4, 99]), a.indexarPorId(a.contatos)).map((c) => c.nome).join() === 'Álvaro Mendes,Mariana Souza', a.indexarPorId(a.contatos).get(4) === a.contatos[3]);
```

Um `SyntaxError` na primeira linha (`does not provide an export named`) ou um `TypeError: a.nome is not a function` mostra que o barril não exporta alguma função: abra a interface, que lista o que falta.

## Regras da agenda (35)

**O que conferir:** a bateria acima. Ela cobre todos os exemplos do enunciado e as bordas principais.

**Como pontuar:**

- **35**: todas as linhas só com `true`
- **25 a 34**: o caso comum funciona, com até três bordas erradas. Desconte 2 a 3 pontos por borda: `'zé'` achando os 15 (o termo sem dígitos virou `''`, que está em todo telefone), Álvaro fora do A ou numa letra `Á`, `contarPorGrupo([])` sem os zeros, `2001-02-29` aceito, o id do `editarContato` trocado, o campo `senha` entrando no contato
- **12 a 24**: uma ou duas funções faltando ou erradas no caso comum (cerca de 4 pontos por função)
- **0 a 11**: o barril não carrega, ou a maior parte das funções falta

**Erros comuns:** `sort` direto na lista recebida (a bateria acusa: `a.contatos[0].id` deixa de ser 1, ou o `TypeError` dos dados congelados aparece); `contarPorGrupo` com valor inicial `{}`; aniversariantes do mês comparando o texto `'10'` com o número `10`; `adicionarContato` usando `contatos.length + 1` como id (funciona com os dados de exemplo, falha depois de uma remoção); `listarFavoritos` na ordem dos ids, e não na alfabética.

## Testes (20)

**O que conferir:** a saída do `npm test` (quantos testes, todos verdes) e os nomes dos testes em `src/regras/` e `src/utils/`. Procure:

- pelo menos um teste por função pública, inclusive `doGrupo`, `editarContato` e os favoritos
- as bordas das tabelas do enunciado (termo vazio, `'zé'`, inicial com acento, mês sem aniversariante, maior id fora de ordem, data que não existe, id que não existe)
- "não altera a lista recebida" nas regras, e o arquivo da etapa 4 que roda as regras sobre os contatos congelados

**Teste dos testes (2 minutos):** em `ordenarPorNome`, apague o `slice()` (ou o spread) antes do `sort` e rode `npm test`. Algum teste precisa ficar vermelho. Depois, `git restore src/regras/agenda.js`.

**Como pontuar:**

- **20**: tudo acima, verde
- **12 a 19**: testes só do caso comum, ou sem os de "não altera", ou funções da etapa 5 sem teste
- **5 a 11**: poucos testes, ou algum vermelho
- **0 a 4**: sem testes, ou `npm test` não roda

**Erros comuns:** `toBe` comparando arrays (vermelho com conteúdo igual); teste que só imprime com `console.log` e não tem `expect`; testes usando os 15 contatos com resultados copiados da saída do script, sem pensar na borda.

## Interface web ligada (15)

**O que conferir:** `npx serve .` na raiz e o endereço com `/web/` no fim. O painel do topo diz quantas das 17 funções e dados a tela achou, e mostra "erro" com a mensagem quando uma função lança. Depois, este roteiro de 2 minutos:

:::steps
1. Digite "mar" rápido no campo de busca: a lista mostra Helena, Marcos e Mariana, e o contador embaixo mostra mais teclas do que buscas (o debounce)
2. <kbd>Enter</kbd>: "mar" aparece em Buscas recentes
3. Limpe a busca e toque em Família: 4 contatos
4. Marque a estrela de Mariana e de Álvaro: Favoritos mostra Álvaro e depois Mariana
5. Remova a Mariana: ela some da lista e dos favoritos. Toque em Desfazer: ela volta nos dois
6. Abra Novo contato e salve vazio: mensagens embaixo de nome, telefone e grupo
7. Salve um contato certo: a lista e o filtro do grupo aumentam em 1
8. Edite o Bruno para Trabalho: o selo dele muda
:::

**Como pontuar:**

- **15**: painel em 17 de 17 e os 8 passos funcionando
- **8 a 14**: um ou dois recursos sem resposta, ou funções faltando no painel
- **1 a 7**: a página carrega, mas a maior parte dos recursos não liga
- **0**: a página fica em "Carregando as suas regras", ou não há pasta `web/`

**Erros comuns:** `src/index.js` com um `import` sem `.js` (o Jest passa, o navegador não carrega: a mensagem de "Carregando" fica na tela); `favoritos.js` fora do barril; `doGrupo` sem o `return` (o painel mostra "erro" com a dica); `alternarFavorito` devolvendo um array em vez de um `Set` (a estrela não acende). Se o aluno mudou os arquivos de `web/`, compare com a interface do curso, baixada de `materiais/projeto-2/interface-web.zip`; a nota vale para a interface original.

## Organização e dados protegidos (15)

**O que conferir:**

- pastas `src/data`, `src/regras`, `src/utils` e `src/scripts`, e o `src/index.js` reexportando tudo
- `Object.isFrozen` da lista e de um contato (a bateria já confere)
- nenhum `console.log` em `src/regras/` e `src/utils/`: `grep -rn "console.log" src/regras src/utils`
- scripts que só montam os dados, chamam as regras e imprimem: abra o `resumo.js` e procure contas ou `filter` que deveriam estar numa regra
- arquivos de `regras/` importando o próprio barril: `grep -rn "index.js" src/regras src/utils`
- `npm run lint` sem erros

**Como pontuar:** 15 com tudo certo; tire 3 pontos por item que falha.

## Repositório, commits e README (15)

**O que conferir:** o `git log` do começo da página, o README e o `.gitignore`.

- os cinco commits das etapas, com as mensagens do enunciado (pequenas diferenças de grafia não descontam)
- datas espalhadas pelos encontros do E08 ao E12
- README: o que é, como instalar, como rodar testes, scripts e interface, e os prints (celular e computador)
- repositório público, sem `node_modules`

**Como pontuar:**

- **15**: tudo acima
- **10 a 14**: um commit de etapa faltando, ou README sem prints, ou sem como abrir a interface
- **5 a 9**: um commit só no fim, ou README que é só o título
- **0 a 4**: repositório privado ou sem README

## Check-in por etapa

No bloco Projeto de cada roteiro, abra um repositório e olhe uma coisa só:

| Etapa | No commit, olhe | Sinal de alerta |
|---|---|---|
| E08 | o teste do `'zé'` e o "não altera" do `ordenarPorNome` | `sort` direto na lista; `includes` do telefone sem conferir se o termo tem dígitos |
| E09 | o valor inicial do `contarPorGrupo` | `{}` como valor inicial; `push` ou `splice` na lista recebida |
| E10 | o objeto de validadores e o `digitar.js` com 120 ms | `validarContato` com um `if` gigante; a busca do `digitar.js` imprimindo quatro vezes com 120 ms |
| E11 | o `src/index.js` e o arquivo de teste com os dados congelados | `Object.freeze` só na lista; arquivo de `regras/` importando do barril |
| E12 | o painel da interface em 17 de 17 | `listarFavoritos` sem ordem; `npx serve` aberto sem o `/web/` |

## Sinais de cópia

- Os cinco commits no mesmo dia, ou em minutos, perto do prazo, sem nenhum commit nas semanas das etapas
- Código igual ao de um colega: os mesmos nomes de variáveis auxiliares, os mesmos comentários, o mesmo erro incomum
- Regras da agenda que são o laboratório com as palavras trocadas: `produto` virou `contato`, mas sobrou um `preco` ou um `categoria` no meio
- O aluno não explica o próprio código

O `registrarBusca` tem a mesma regra do histórico do laboratório do E08, e o `debounce` é o mesmo utilitário: código parecido nesses dois é esperado e não é sinal de cópia. O que vale é o aluno saber explicar.

**Como agir:** antes de dar a nota, converse 5 minutos com o aluno. Peça para explicar uma função à escolha do instrutor e para fazer uma mudança pequena ao vivo, como "o histórico agora guarda 3 buscas" ou "a busca também acha pelo e-mail", rodando os testes. Quem fez o projeto resolve em poucos minutos. Se não conseguir, devolva para ajustes com o pedido de refazer as regras e registre a conversa. Em caso de cópia entre colegas, converse com os dois separadamente e siga a política da instituição.
