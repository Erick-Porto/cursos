// E11 · this em métodos e callbacks. Rode: node this.mjs
// É .mjs de propósito: em módulo, a chamada sem ponto recebe this igual a undefined.
// No REPL do Node (fora de módulo) o this solto é o objeto global e o TypeError não aparece.
const promocao = {
  nome: 'Semana do Áudio',
  percentual: 10,
  anunciar() {
    console.log(`${this.nome}: ${this.percentual}% de desconto`);
  },
};

// 1. O aviso que sai pela metade
promocao.anunciar(); // Semana do Áudio: 10% de desconto
setTimeout(promocao.anunciar, 1000); // um segundo depois: undefined: undefined% de desconto

// 2. Os consertos (tire o // de uma linha por vez)
// setTimeout(() => promocao.anunciar(), 1000); // certo: a arrow chama com ponto
// setTimeout(promocao.anunciar.bind(promocao), 1000); // certo: o bind prendeu o this

// 3. Quem chama sem nada antes do ponto (tire o // para ver o TypeError)
// ['seg', 'qua'].forEach(promocao.anunciar); // TypeError: Cannot read properties of undefined (reading 'nome')

// 4. Parênteses demais: anuncia na hora e o setTimeout recebe undefined
// setTimeout(promocao.anunciar(), 1000); // TypeError [ERR_INVALID_ARG_TYPE]: The "callback" argument must be of type function
