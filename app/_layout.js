import { Stack, Slot } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from 'expo-font';
import { useCallback } from "react";
import { AppContextProvider } from './AppContext';
SplashScreen.preventAutoHideAsync()


const Layout = () => {
  const [fontsLoaded] = useFonts({
    'jua': require('../assets/fonts/Jua-Regular.ttf'),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  // if (!fontsLoaded) {
  //   return
  //   <AppContextProvider>
  //     <Slot />;
  //   </AppContextProvider>
  // }

  return (
    <AppContextProvider>
      <Stack>
        <Stack.Screen name="MainScreen" />
      </Stack>
    </AppContextProvider>
  )
}

export default Layout