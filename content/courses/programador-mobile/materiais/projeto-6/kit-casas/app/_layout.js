// Layout raiz: o que envolve todas as telas do app.
//   TemaProvider   o tema claro ou escuro, para todas as telas (E34)
//   CasasProvider  a lista de casas, a mesma em todas as telas (E36)
//   Stack          a pilha de telas: a tela nova entra por cima, voltar tira a de cima (E37)
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { CasasProvider } from '@/data/CasasContext';
import { opcoesDaPilha, TemaProvider, useTema } from '@/theme';

// A pilha fica num componente separado porque precisa do useTema(),
// que só funciona dentro do TemaProvider.
function Pilha() {
  const { cores, escuro } = useTema();
  return (
    <>
      <StatusBar style={escuro ? 'light' : 'dark'} />
      <Stack screenOptions={opcoesDaPilha(cores)}>
        {/* E37 (etapa 5): troque a linha "index" por (abas) e acrescente casa/[id] */}
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="cadastro" options={{ title: 'Nova casa' }} />
      </Stack>
    </>
  );
}

export default function LayoutRaiz() {
  return (
    <TemaProvider>
      <CasasProvider>
        <Pilha />
      </CasasProvider>
    </TemaProvider>
  );
}
