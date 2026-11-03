// Tema claro e escuro, compartilhado por todas as telas (o "quadro de avisos" da casa).
// O TemaProvider fica em app/_layout.js, em volta do app inteiro.
// Em qualquer tela ou componente:
//   const { cores, escuro, alternarTema } = useTema();
//   cores         as cores do tema da vez (cores.texto, cores.primaria...)
//   escuro        true no tema escuro, false no claro
//   alternarTema  troca para o outro tema
// O app começa no tema do celular e acompanha quando ele muda.
import { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import { cores } from './tokens';

const TemaContext = createContext(null);

export function TemaProvider({ children }) {
  const sistema = useColorScheme(); // 'light' ou 'dark'
  const [escuro, setEscuro] = useState(sistema === 'dark');

  // a pessoa trocou o tema do celular: o app acompanha
  useEffect(() => {
    setEscuro(sistema === 'dark');
  }, [sistema]);

  function alternarTema() {
    setEscuro(!escuro);
  }

  const valor = {
    cores: escuro ? cores.escuro : cores.claro,
    escuro,
    alternarTema,
  };
  return <TemaContext.Provider value={valor}>{children}</TemaContext.Provider>;
}

export function useTema() {
  const valor = useContext(TemaContext);
  if (!valor) throw new Error('useTema só funciona dentro do TemaProvider (veja app/_layout.js)');
  return valor;
}
