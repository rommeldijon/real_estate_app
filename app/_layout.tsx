import { SplashScreen, Stack } from "expo-router";

import GlobalProvider from "@/lib/global-provider";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import "./globals.css";

// Suppress expected development warnings
const originalError = console.error;
const originalWarn = console.warn;

console.error = (...args: any[]) => {
  const message = String(args[0]);
  // Suppress 401 Appwrite auth errors (expected when not logged in)
  if (message.includes("401") || message.includes("Unauthorized")) return;
  // Suppress touch event warnings from React Native Web
  if (message.includes("touch") && message.includes("Touch Bank")) return;
  originalError(...args);
};

console.warn = (...args: any[]) => {
  const message = String(args[0]);
  // Suppress touch event warnings
  if (message.includes("touch") && message.includes("Touch")) return;
  originalWarn(...args);
};

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "Rubik-Regular": require("../assets/fonts/Rubik-Regular.ttf"),
    "Rubik-Medium": require("../assets/fonts/Rubik-Medium.ttf"),
    "Rubik-SemiBold": require("../assets/fonts/Rubik-SemiBold.ttf"),
    "Rubik-Bold": require("../assets/fonts/Rubik-Bold.ttf"),
    "Rubik-Light": require("../assets/fonts/Rubik-Light.ttf"),
    "Rubik-ExtraBold": require("../assets/fonts/Rubik-ExtraBold.ttf"),
  })

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <GlobalProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </GlobalProvider>
  )
}
