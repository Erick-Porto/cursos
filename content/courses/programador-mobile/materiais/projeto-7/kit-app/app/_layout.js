// Layout raiz: o que envolve todas as telas do app.
//   TemaProvider  o tema claro ou escuro, para todas as telas (o mesmo do Projeto 6)
//   Stack         a pilha de telas: a tela nova entra por cima, voltar tira a de cima
// Onde cada etapa entra:
//   E41  a equipe cria a pasta app/(abas), leva para dentro dela o index.js e o sobre.js
//        e troca a linha "index" daqui por "(abas)"
//   E43  o quadro de avisos com os dados da equipe entra aqui, em volta da <Pilha />
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { opcoesDaPilha, TemaProvider, useTema } from '@/theme';

// A pilha fica num componente separado porque precisa do useTema(),
// que só funciona dentro do TemaProvider.
function Pilha() {
  const { cores, escuro } = useTema();
  return (
    <>
      <StatusBar style={escuro ? 'light' : 'dark'} />
      <Stack screenOptions={opcoesDaPilha(cores)}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}

export default function LayoutRaiz() {
  return (
    <TemaProvider>
      <Pilha />
    </TemaProvider>
  );
}
