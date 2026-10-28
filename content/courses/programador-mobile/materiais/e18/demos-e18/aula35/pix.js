// Aula 35, slide "setInterval: o prazo do Pix"
let restantes = 10; // na loja, 600: 10 minutos

const id = setInterval(() => {
  restantes = restantes - 1;
  const mm = String(Math.floor(restantes / 60)).padStart(2, '0');
  const ss = String(restantes % 60).padStart(2, '0');
  console.log(`O código Pix expira em ${mm}:${ss}`);
  if (restantes === 0) {
    clearInterval(id); // sem isso, o timer repete para sempre
    console.log('Código expirado: gere outro Pix.');
  }
}, 1000);
