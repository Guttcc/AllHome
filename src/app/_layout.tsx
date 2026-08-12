import { LanguageProvider } from "@/lib/i18n";
import { ClerkProvider, useUser } from '@clerk/expo';
import { tokenCache } from '@clerk/expo/token-cache';

import { useGroceryStore } from '@/store/grocery-store';
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import "../../global.css";

import * as Sentry from "@sentry/react-native";
import { KeyboardProvider } from "react-native-keyboard-controller";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!

if (!publishableKey) {
  throw new Error('Add your Clerk Publishable Key to the .env file')
}

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  integrations: [Sentry.feedbackIntegration()],
});

function InitialLayout() {
  const { user } = useUser();
  const { switchUser } = useGroceryStore();
  const colorScheme = useColorScheme();

  useEffect(() => {
    if (user?.id) {
      switchUser(user.id);
    }
  }, [user?.id]);

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }} />
    </ThemeProvider>
  );
}

export default Sentry.wrap(function RootLayout() {
  return (
    <LanguageProvider>
      <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
        <KeyboardProvider>
          <InitialLayout />
        </KeyboardProvider>
      </ClerkProvider>
    </LanguageProvider>
  );
})