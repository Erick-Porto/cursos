// rascunhos/tipos.ts
function totalDoItem(preco: number, qtd: number): number {
  return preco * qtd;
}

console.log(totalDoItem(79.9, 2));
console.log(totalDoItem('79,90', 2)); // erro de tipo, de propósito
