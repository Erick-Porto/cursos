// Aparência da pilha e das abas nas cores do tema. Use nos arquivos _layout.js:
//   <Stack screenOptions={opcoesDaPilha(cores)}>
//   <Tabs screenOptions={opcoesDasAbas(cores)}>
//   <Tabs.Screen name="index" options={{ title: 'Casas', tabBarIcon: iconeDaAba('paw-outline') }} />
import { Ionicons } from '@expo/vector-icons';

// cabeçalho e fundo das telas da pilha
export function opcoesDaPilha(cores) {
  return {
    headerStyle: { backgroundColor: cores.superficie },
    headerTintColor: cores.primaria,
    headerTitleStyle: { color: cores.texto },
    headerShadowVisible: false,
    contentStyle: { backgroundColor: cores.fundo },
  };
}

// barra de abas embaixo; cada tela de aba desenha o próprio topo (headerShown: false)
export function opcoesDasAbas(cores) {
  return {
    headerShown: false,
    tabBarActiveTintColor: cores.primaria,
    tabBarInactiveTintColor: cores.textoSuave,
    tabBarStyle: { backgroundColor: cores.superficie, borderTopColor: cores.borda },
    sceneStyle: { backgroundColor: cores.fundo },
  };
}

// o ícone de uma aba: as abas chamam esta função com a cor e o tamanho da vez
export function iconeDaAba(nome) {
  return ({ color, size }) => <Ionicons name={nome} size={size} color={color} />;
}
