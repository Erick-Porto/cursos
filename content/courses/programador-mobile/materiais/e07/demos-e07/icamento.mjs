// E07 · aula 14: a declaração é içada; a arrow, não.
// Uso: node icamento.mjs

console.log(totalDoItem(50, 3)); // 150, mesmo antes da linha que cria a função

function totalDoItem(preco, qtd) {
  return preco * qtd;
}

// Passo 3 da demonstração: apague a declaração acima, descomente a linha abaixo e rode de novo.
// const totalDoItem = (preco, qtd) => preco * qtd;
// ReferenceError: Cannot access 'totalDoItem' before initialization
