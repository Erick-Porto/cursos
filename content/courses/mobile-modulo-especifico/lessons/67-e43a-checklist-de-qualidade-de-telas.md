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

Programador Mobile: Módulo Específico · Encontro E43 · Aula 67 de 71

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

## :icon[list-checks] Pronto é passar nos 6 itens

| Item | Pergunta | Como testar no celular |
|---|---|---|
| 4 estados | carrega, falha, esvazia e mostra? | json-server parado; coleção vazia |
| Acessibilidade | o leitor entende e o dedo acerta? | leitor de tela; fonte máxima |
| Tema | claro e escuro funcionam? | percorra a tela nos dois temas |
| Formulário | dado errado é barrado? | envie vazio e com `0` |
| Feedback de toque | todo toque responde? | toque duplo em enviar |
| Testes das regras | o cálculo tem teste? | `npm test` verde |

O cartão só vai para **Done** com os 6 marcados: ponha-os no Checklist do modelo de PR do E41.

---

## :icon[layout-grid] 1. Os 4 estados de cada tela

Toda tela que busca dados no json-server passa por carregando, erro, vazio e dados. Na agenda, "Meus agendamentos":

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

| Estado | Como forçar |
|---|---|
| Carregando | atraso temporário no `pedir` da `api/`, que sai antes do commit |
| Erro | <kbd>Ctrl</kbd> + <kbd>C</kbd> no terminal do json-server |
| Vazio | `"agendamentos": []` no `db.json` |
| Dados | registros reais, com um nome bem longo |

---

## :icon[eye] 2. Acessibilidade: nome, papel e alvo

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

- O leitor anuncia o rótulo, o papel e o estado: selecionado ou desativado
- Com a fonte do sistema no máximo, nada fica cortado nem sobreposto
- Contraste de 4,5 para 1 e nada dito só por cor: o horário ocupado também aparece riscado

---

## :icon[sun] 3. Tema: nenhuma cor fixa

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
- No VS Code, <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>F</kbd> com regex `#[0-9a-fA-F]{3,6}` acha as cores fixas fora dos tokens
- Percorra cada tela nos dois temas, inclusive modais e barra de status
- `Badge` de status sempre com `texto`, não só com `tom`: a cor reforça, a palavra informa

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

## :icon[send] 4 e 5. Formulário e toque: validar, travar, avisar

No controle de gastos, "Novo lançamento" segue a receita do cadastro do E15, agora gravando no json-server:

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

- **Validar**: o erro aparece no `Campo`, pela prop `erro`, antes de qualquer pedido à rede
- **Travar**: o botão desabilitado barra o segundo toque e o lançamento duplicado; o `finally` destrava nos dois caminhos
- **Avisar**: toast no sucesso; `Alert` na falha e antes de ação destrutiva, como "Cancelar este agendamento?"
- **Responder**: todo `Pressable` muda ao toque com `pressed`

---

## :icon[hand] Dois toques, um lançamento

:::center
![Animação: o primeiro toque em Salvar chama setEnviando(true) e o botão vira Salvando..., desabilitado; o segundo toque é barrado; com a resposta, o finally chama setEnviando(false) e o db.json fica com um lançamento só](images/e43-toque-duplo.svg)
:::

O primeiro toque chama `salvar`, que faz `setEnviando(true)`. Com `desabilitado={enviando}`, o segundo toque encontra o botão travado e não envia nada. O `finally` destrava o botão quando a resposta chega, com sucesso ou com falha.

---

## :icon[test-tube] 6. Testes das regras

Regra que decide dinheiro, horário ou status mora numa função pura, sem React, com o teste ao lado:

```javascript
// src/features/lancamentos/saldo.js
export function saldoDoMes(lancamentos, mes) { // mes: '2026-10'
  return lancamentos
    .filter((l) => l.data.startsWith(mes))
    .reduce((saldo, l) =>
      (l.tipo === 'entrada' ? saldo + l.valorCentavos : saldo - l.valorCentavos), 0);
}
```

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

Teste um caso comum, um limite e um inválido. Nos outros apps: `horariosLivres(horarios, agendamentos)` e `textoDoStatus(status)`. `npm test` verde antes de abrir o PR.

---

## :icon[users] A revisão cruzada em anel

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
3. Em **Files changed**, procure cor fixa, `catch` só com `console.log` e regra sem teste
4. Comente na linha: item do checklist, o que acontece e uma sugestão
5. Envie com **Comment** ou **Request changes**; o **Approve** que libera o merge é da própria equipe
:::

:::example Comentário que ajuda
**Estados:** com o json-server parado, "Meus agendamentos" fica em branco. Que tal um `EstadoErro` com "Tentar novamente"?
:::

Comece por um ponto forte e comente o código, não a pessoa nem o seu gosto.

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

## :icon[kanban] Sprint

**Até a revisão cruzada**: o fluxo principal do briefing rodando no json-server, tela por tela pelo checklist.

:::steps
1. Daily de 5 minutos: cada pessoa leva para In Progress uma história **Must**
2. Uma branch por história; checklist conferido no celular antes do PR
3. PR com "Como testar" e checklist marcado, revisado pela equipe
4. Regras em funções puras, com pelo menos 5 testes
5. Um PR aberto, sem merge, para a revisão cruzada
6. PR com o commit `docs: E43 fechamento da sprint 1`: README com o que entrou e o que ficou
:::

**Critérios**: fluxo principal de ponta a ponta no celular; telas novas com os 4 estados; nenhuma cor fixa; `npm test` verde; board em dia. Entregue o link do repositório no sistema.
