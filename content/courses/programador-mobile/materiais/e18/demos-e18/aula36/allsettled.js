// Aula 36, slide "Promise.allSettled: cada parte por si"
const esperar = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const buscarDestaques = () => esperar(300).then(() => [1, 4, 7, 10]);
const buscarCategorias = () => esperar(200).then(() => ['audio', 'casa', 'esporte', 'livros']);
const buscarBanners = () =>
  esperar(100).then(() => {
    throw new Error('Banners fora do ar');
  });

Promise.allSettled([buscarDestaques(), buscarCategorias(), buscarBanners()])
  .then(([destaques, categorias, banners]) => {
    if (destaques.status === 'fulfilled') console.log('Destaques:', destaques.value.length);
    if (categorias.status === 'fulfilled') console.log('Categorias:', categorias.value.length);
    if (banners.status === 'rejected') console.log('Sem banners:', banners.reason.message);
  });

// troque allSettled por all e rode de novo: o relatório inteiro cai no primeiro erro
