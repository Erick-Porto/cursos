---
title: Checklist de qualidade de telas
summary: Os 6 itens que dizem quando uma tela está pronta e como revisar o PR de outra equipe na Sprint 1.
module: integracao
duration_minutes: 30
objectives:
  - Conferir cada tela com o checklist de qualidade antes de abrir o PR
  - Forçar os 4 estados e testar acessibilidade, tema e formulário no celular
  - Proteger as regras do domínio com testes Jest
  - Revisar o PR de outra equipe com comentários ligados ao checklist
---

# Checklist de qualidade de telas

Programador Mobile · Encontro E43 · Aula 84 de 89

---

## O que você vai aprender

:::goal
- Dizer quando uma tela está **pronta**, e não só funcionando, com um checklist de 6 itens
- Forçar os 4 estados e testar acessibilidade e os dois temas no celular
- Enviar formulários com validação, trava e aviso do resultado
- Testar as regras do domínio do app da equipe
- Revisar o PR de outra equipe com comentários que ajudam
:::

---

## :icon[book-open] Palavras novas de hoje

| Palavra | O que é |
|---|---|
| **checklist** | a lista de conferência: cada item é marcado antes de dizer "pronto" |
| **estado da tela** | o que a tela mostra em cada momento: carregando, erro, vazio ou com dados |
| **leitor de tela** | o recurso do celular que lê a tela em voz alta: TalkBack no Android, VoiceOver no iPhone |
| **alvo de toque** | a área que responde ao dedo; no mínimo, 44 por 44 |
| **feedback** | a resposta do app a um toque: o botão muda, um aviso aparece |
| **revisão cruzada** | uma equipe testa e comenta o PR de outra |

---

## A demo que travou

A equipe do app de cardápio mostra a sprint ao dono da lanchonete, no celular dele e no Wi-Fi da loja. No computador da equipe, tudo funcionava. No celular do cliente:

- o cardápio fica em branco por 4 segundos e depois aparece de repente
- o preço some, porque o celular dele está no modo escuro
- o toque em **Fazer pedido** parece perdido, ele toca de novo e a cozinha recebe dois pedidos iguais

Nenhum desses é erro de lógica. São itens de qualidade que ninguém conferiu antes do merge.

:::question
O que precisa ser verdade para uma tela estar pronta, e não só funcionando?
:::

---

## O checklist

Antes de decolar, o piloto confia na memória ou numa lista?

---

## :icon[list-checks] Pronto é passar nos 6 itens

O **checklist de qualidade** é a lista que a equipe confere em cada tela antes do PR. É como o checklist do piloto: os mesmos itens, toda vez, mesmo com pressa.

| Item | Pergunta |
|---|---|
| 4 estados | carrega, falha, esvazia e mostra? |
| Acessibilidade | o leitor entende e o dedo acerta? |
| Tema | claro e escuro funcionam? |
| Formulário | dado errado é barrado? |
| Feedback de toque | todo toque responde? |
| Testes das regras | o cálculo tem teste? |

O cartão só vai para **Done** com os 6 marcados: ponha-os no Checklist do modelo de PR do E41.

---

## :icon[smartphone] O checklist na prática

Cada item tem um jeito de testar no celular, em poucos segundos:

| Item | Como testar no celular |
|---|---|
| 4 estados | json-server parado; coleção vazia |
| Acessibilidade | leitor de tela; fonte máxima |
| Tema | percorra a tela nos dois temas |
| Formulário | envie vazio e com `0` |
| Feedback de toque | toque duplo em enviar |
| Testes das regras | `npm test` verde |

Na "Meus agendamentos" da Agenda: com o json-server parado, a tela mostra o erro? Com o celular no escuro, o nome do serviço aparece?

---

## Os 4 estados

Num balcão, o que um bom atendente diz enquanto você espera?

---

## :icon[layout-grid] 1. Os 4 estados de cada tela

Toda tela que busca dados passa por quatro **estados**: carregando, erro, vazio e dados. Pense num bom atendente: ele nunca fica mudo. Diz "um momento", "deu um problema, vou tentar de novo", "hoje não tem" ou entrega o pedido.

Na agenda, "Meus agendamentos":

```jsx
// depois de todos os hooks da tela
if (carregando) return <EstadoCarregando />;
if (erro) return <EstadoErro mensagem={erro} onTentarNovamente={recarregar} />;
if (agendamentos.length === 0) {
  return (
    <EstadoVazio icone="calendar-outline" titulo="Nenhum agendamento ainda"
      mensagem="Escolha um serviço e um horário livre."
      textoAcao="Agendar" onAcao={() => router.push('/servicos')} />
  );
}
return <FlatList data={agendamentos} /* ... */ />;
```

Cada `if` devolve um estado e para; só chega ao `FlatList` quem tem dados. Os componentes vêm do kit do E39.

---

## :icon[layout-grid] Os 4 estados na prática

Para conferir, force cada estado à mão:

| Estado | Como forçar | O que aparece |
|---|---|---|
| Carregando | atraso temporário no `pedir` da `api/`, que sai antes do commit | a rodinha |
| Erro | <kbd>Ctrl</kbd> + <kbd>C</kbd> no terminal do json-server | `EstadoErro` com "Tentar novamente" |
| Vazio | `"agendamentos": []` no `db.json` | `EstadoVazio` com "Agendar" |
| Dados | registros reais, com um nome bem longo | a lista, sem cortar o nome |

O atraso temporário é uma linha só, no começo do `pedir`, que espera 2 segundos:

```javascript
await new Promise((resolver) => setTimeout(resolver, 2000));
```

---

## Acessibilidade

Para que serve a rampa na entrada de um prédio, e quem mais a usa?

---

## :icon[eye] 2. Acessibilidade: nome, papel e alvo

**Acessibilidade** é a tela funcionar para todo mundo, inclusive quem usa leitor de tela ou fonte grande. É a rampa do prédio: feita para quem usa cadeira de rodas, ajuda também quem leva carrinho de bebê.

Um horário da agenda, pronto para o leitor de tela e para o dedo:

```jsx
<Pressable
  onPress={() => escolher(horario)}
  disabled={!horario.livre}
  hitSlop={8} // chip de 28 de altura + 8 em cima e 8 embaixo = 44
  accessibilityRole="button"
  accessibilityLabel={`Horário das ${horario.hora}`}
  accessibilityState={{ selected: escolhido === horario.hora, disabled: !horario.livre }}
  style={({ pressed }) => [estilos.horario, pressed && estilos.pressionado]}
>
  <Text style={[estilos.hora, { color: cores.texto }]}>{horario.hora}</Text>
</Pressable>
```

- `accessibilityLabel` é o **nome** que o leitor fala; `accessibilityRole`, o **papel**: "botão"
- `accessibilityState` diz o estado: selecionado ou desativado
- `hitSlop` aumenta o **alvo** do toque sem mudar o desenho

---

## :icon[eye] Acessibilidade na prática

Três conferências que reprovam muitas telas:

- **Leitor de tela**: nos chips sem rótulo, ele fala só "14:30". Com `accessibilityLabel`, `accessibilityRole` e `accessibilityState`, ele anuncia o nome, o papel de botão e se está selecionado ou desativado
- **Fonte no máximo**: com a fonte do sistema no máximo, nada fica cortado nem sobreposto; o texto quebra linha
- **Nada dito só por cor**: o horário ocupado aparece cinza **e** riscado, para quem não distingue as cores

E o botão só com ícone também ganha nome. Na mesma agenda, o de cancelar:

```jsx
accessibilityLabel={`Cancelar ${a.servicoNome} de ${a.data} às ${a.hora}`}
```

Contraste mínimo de 4,5 para 1 entre texto e fundo.

---

## Tema

Parede pintada com uma tinta sem nome: o que acontece quando a casa troca de cores?

---

## :icon[sun] 3. Tema: nenhuma cor fixa

Os **tokens** de cor, do E31, são uma paleta de tintas com nome: `cores.texto`, `cores.primaria`. O valor de cada uma mora num lugar só e troca com o tema. Uma **cor fixa**, como `'#222'`, é tinta sem nome: quando o tema muda, ela fica igual e some no fundo escuro.

Como usar: em toda tela, pegue as cores do tema e use só elas.

```jsx
const { cores } = useTema();
```

- Texto, fundo, borda e ícone: sempre `cores.algumaCoisa`
- Percorra cada tela nos dois temas, inclusive modais e barra de status
- `Badge` de status sempre com `texto`, não só com `tom`: a cor reforça, a palavra informa

---

## :icon[sun] Tema na prática

Cor escrita no código não troca com o tema. Na revisão, procure por ela:

```jsx
// reprova: no escuro, texto quase preto sobre fundo escuro
<Text style={{ color: '#222' }}>{item.nome}</Text>
<Ionicons name="add-circle-outline" size={24} />

// passa: cores dos tokens, que trocam com o tema
<Text style={[estilos.nome, { color: cores.texto }]}>{item.nome}</Text>
<Ionicons name="add-circle-outline" size={24} color={cores.primaria} />
```

- Ícone sem `color` sai preto e some no escuro
- No VS Code, <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>F</kbd> com regex `#[0-9a-fA-F]{3,6}` acha as cores fixas. As de `tokens.js` estão certas; as das telas são o defeito

---

## Pense

:::question
Você revisa o PR "Tela do cardápio" da equipe vizinha. Quais itens do checklist este trecho reprova?

```jsx
export default function TelaCardapio() {
  const [produtos, setProdutos] = useState([]);
  useEffect(() => {
    listarProdutos().then(setProdutos).catch((e) => console.log(e));
  }, []);
  return (
    <FlatList data={produtos} keyExtractor={(p) => p.id}
      renderItem={({ item }) => (
        <Pressable onPress={() => adicionar(item)}>
          <Text style={{ color: '#222' }}>{item.nome}</Text>
          <Ionicons name="add-circle" size={20} />
        </Pressable>
      )} />
  );
}
```
:::

:::tip Resposta
- **4 estados**: não há carregando, e o erro vai para o terminal; o cliente vê uma tela em branco, igual à da lista vazia
- **Tema**: `#222` e o ícone sem `color` somem no escuro
- **Acessibilidade**: o `Pressable` não tem papel nem rótulo, e a linha tem menos de 44 de altura
- **Feedback de toque**: `adicionar` não avisa nada; um toast "Adicionado ao carrinho" resolve

Fora do checklist, vale um comentário: a busca deveria morar no `useCardapio`, não na tela.
:::

---

## Formulário e toque

Você aperta o botão do elevador duas vezes: vêm dois elevadores?

---

## :icon[send] 4 e 5. Formulário e toque: validar, travar, avisar

O botão do elevador acende quando você aperta, e apertar de novo não chama outro. O botão de enviar faz o mesmo: **valida** os campos, **trava** enquanto envia e **avisa** o resultado. No controle de gastos, "Novo lançamento" segue a receita do cadastro do E35, agora gravando no json-server:

```jsx
async function salvar() {
  const novos = validarLancamento(valores); // { valorCentavos: 'Informe um valor maior que zero' }
  setErros(novos);
  if (Object.values(novos).some(Boolean)) return;
  setEnviando(true);
  try {
    await adicionar(valores); // vem do useLancamentos(), que chama a api/
    setValores(VAZIO);
    setToastVisivel(true);
  } catch {
    Alert.alert('Não foi possível salvar', 'Confira a conexão e tente de novo.');
  } finally {
    setEnviando(false);
  }
}
```

```jsx
<Botao titulo={enviando ? 'Salvando...' : 'Salvar'} onPress={salvar} desabilitado={enviando} />
```

---

## :icon[list-ordered] O salvar em português

| Linha | O que ela diz |
|---|---|
| `validarLancamento(valores)` | "confira os campos e me dê as mensagens de erro" |
| `Object.values(novos).some(Boolean)` | "alguma mensagem não está vazia? Então pare aqui" |
| `setEnviando(true)` | "trave o botão" |
| `await adicionar(valores)` | "grave no json-server e espere" |
| `catch` | "falhou: avise com um `Alert`" |
| `finally` | "deu certo ou errado: destrave o botão" |

- **Validar**: o erro aparece no `Campo`, pela prop `erro`, antes de qualquer pedido à rede
- **Avisar**: toast no sucesso; `Alert` na falha e antes de ação destrutiva, como "Cancelar este agendamento?"
- **Responder**: todo `Pressable` muda ao toque com `pressed`

---

## :icon[hand] Dois toques, um lançamento

:::center
![Animação: o primeiro toque em Salvar chama setEnviando(true) e o botão vira Salvando..., desabilitado; o segundo toque é barrado; com a resposta, o finally chama setEnviando(false) e o db.json fica com um lançamento só](images/e43-toque-duplo.svg)
:::

O primeiro toque chama `salvar`, que faz `setEnviando(true)`. Com `desabilitado={enviando}`, o segundo toque encontra o botão travado e não envia nada. O `finally` destrava o botão quando a resposta chega, com sucesso ou com falha.

---

## Testes das regras

Quem corrige uma prova que já vem com gabarito?

---

## :icon[test-tube] 6. Testes das regras

Um **teste automatizado** é uma prova com gabarito que o computador corrige sozinho, como no E04. Regra que decide dinheiro, horário ou status mora numa função pura, sem React, com o teste ao lado:

```javascript
// src/features/lancamentos/saldo.js
export function saldoDoMes(lancamentos, mes) { // mes: '2026-10'
  return lancamentos
    .filter((l) => l.data.startsWith(mes))
    .reduce((saldo, l) =>
      (l.tipo === 'entrada' ? saldo + l.valorCentavos : saldo - l.valorCentavos), 0);
}
```

- `filter` fica só com os lançamentos do mês: `startsWith` pergunta se a data começa com `'2026-10'`
- `reduce` vai acumulando: soma a entrada e desconta a saída, a partir do 0
- O resultado é em centavos, como no briefing

---

## :icon[test-tube] Testes na prática

```javascript
// saldo.test.js
import { saldoDoMes } from './saldo';

const lancamentos = [
  { valorCentavos: 300000, tipo: 'entrada', data: '2026-10-05' },
  { valorCentavos: 4590, tipo: 'saida', data: '2026-10-07' },
  { valorCentavos: 9900, tipo: 'saida', data: '2026-09-30' },
];

test('soma entradas e desconta saídas só do mês', () => {
  expect(saldoDoMes(lancamentos, '2026-10')).toBe(295410);
});
test('mês sem lançamentos tem saldo zero', () => {
  expect(saldoDoMes([], '2026-10')).toBe(0);
});
```

R$ 3.000,00 menos R$ 45,90 dá `295410` centavos; a saída de setembro fica de fora. `npm test` termina com `Tests: 2 passed, 2 total`.

Teste um caso comum, um limite e um inválido. Nos outros apps: `horariosLivres(horarios, agendamentos)` e `textoDoStatus(status)`. `npm test` verde antes de abrir o PR.

---

## Revisão cruzada

O que um cliente oculto faz numa loja?

---

## :icon[users] A revisão cruzada em anel

Na **revisão cruzada**, uma equipe testa e comenta o PR de outra. É o cliente oculto: alguém de fora usa o app como cliente comum e conta o que viu.

::::columns
:::col
![Diagrama: quatro equipes em anel; a equipe A revisa a B, a B revisa a C, a C revisa a D e a D, a última, revisa a A](images/e43-anel-revisao.svg)
:::
:::col
- Cada equipe revisa o PR da seguinte, e a última revisa a primeira
- Ninguém revisa quem o revisa; de preferência, o revisor é de outro briefing
- Em cada equipe, uma pessoa fica como anfitriã, com o app na branch do PR; as outras revisam a equipe seguinte
:::
::::

---

## :icon[messages-square] Revisando o PR de outra equipe

Na revisão cruzada, você é o primeiro usuário de fora.

:::steps
1. Leia a descrição: a história e o "Como testar"
2. Teste no celular da equipe autora, você no comando, item por item do checklist
3. Em **Files changed** (arquivos alterados), procure cor fixa, `catch` só com `console.log` e regra sem teste
4. Comente na linha: item do checklist, o que acontece e uma sugestão
5. Envie com **Comment** (comentar) ou **Request changes** (pedir mudanças); o **Approve** (aprovar) que libera o merge é da própria equipe
:::

Comece por um ponto forte e comente o código, não a pessoa nem o seu gosto.

---

## :icon[message-square] Revisão na prática

Um bom comentário diz o item do checklist, o que acontece no celular e uma sugestão:

:::example Comentários que ajudam
- **Estados:** com o json-server parado, "Meus agendamentos" fica em branco. Que tal um `EstadoErro` com "Tentar novamente"?
- **Acessibilidade:** nos horários, o leitor de tela fala só "14:30". Dá para pôr `accessibilityRole` e `accessibilityLabel`?
- **Ponto forte:** o toast "Agendamento cancelado" ficou claro e some sozinho.
:::

:::warning Comentários que não ajudam
"Tá estranho" não diz o quê nem onde. "Eu faria com outra função" é gosto, não item do checklist.
:::

---

## :icon[triangle-alert] Erros comuns

:::warning
- Testar só com Wi-Fi bom, lista cheia e nomes curtos
- `catch` que só faz `console.log`: o erro vai para o terminal e o cliente vê uma tela em branco
- Ícone sem `color` e cor fixa "só neste lugar": no escuro, somem
- Botão de enviar sem trava: dois toques, dois registros no `db.json`
- Aprovar o PR pela descrição, sem rodar no celular
- Comentário vago, como "tá estranho", ou sobre a pessoa
- Deixar o checklist para o fim da sprint: vira uma pilha de retrabalho
:::

---

## Resumo

:::summary
- Pronto é passar nos 6 itens: 4 estados, acessibilidade, tema, formulário, feedback de toque e testes das regras
- Force cada estado à mão: atraso temporário, json-server parado, coleção vazia
- Todo tocável tem rótulo, papel e 44 por 44; toda cor vem dos tokens
- Enviar é validar, travar o botão e avisar o resultado, com o `finally` destravando
- Na revisão, rode no celular, cite o item do checklist e sugira; o Approve que libera o merge vem da equipe
:::

---

## :icon[kanban] Sprint 1, parte 1

**Até a pausa**: as histórias Must do fluxo principal rodando no json-server, tela por tela pelo checklist.

:::steps
1. Daily de 5 minutos: cada pessoa leva para In Progress uma história **Must**
2. Uma branch por história; checklist conferido no celular antes do PR
3. PR com "Como testar" e checklist marcado, revisado pela equipe
4. Regras em funções puras, com pelo menos 5 testes
:::

**Critérios**: telas novas com os 4 estados; nenhuma cor fixa; `npm test` verde; quadro em dia.

Depois da pausa, a aula 85 traz os dados no aparelho e o login, e a sprint segue até a revisão cruzada.
