import { Stack } from "expo-router";
import {useFonts} from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import {useCallback} from "react";
SplashScreen.preventAutoHideAsync()


const Layout =() =>{

    return(
        <Stack>
            <Stack.Screen name = "MainScreen"/>
        </Stack>
    )
}

export default Layout