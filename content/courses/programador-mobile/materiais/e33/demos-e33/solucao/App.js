import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts, Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter';
import { TemaProvider } from './src/theme/TemaContext';
// import Inicio from './src/telas/Inicio';
import Galeria from './src/telas/Galeria';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontesCarregadas, erroFonte] = useFonts({ Inter_400Regular, Inter_700Bold });

  useEffect(() => {
    if (fontesCarregadas || erroFonte) SplashScreen.hideAsync();
  }, [fontesCarregadas, erroFonte]);

  if (!fontesCarregadas && !erroFonte) return null;

  return (
    <SafeAreaProvider>
      <TemaProvider>
        {/* <Inicio /> */}
        <Galeria />
      </TemaProvider>
    </SafeAreaProvider>
  );
}
