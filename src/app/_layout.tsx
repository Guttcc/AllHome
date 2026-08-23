import { THEME_STORAGE_KEY } from "@/components/insights/ThemeToggle";
import { LanguageProvider } from "@/lib/i18n";
import { ClerkProvider, useAuth } from '@clerk/expo';
import * as Sentry from "@sentry/react-native";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SecureStore from 'expo-secure-store';
import { useColorScheme } from "nativewind";
import { useEffect } from 'react';
import { KeyboardProvider } from "react-native-keyboard-controller";
import "../../global.css";

const tokenCache = {
  async getToken(key: string) {
    try { return await SecureStore.getItemAsync(key); } catch (err) { return null; }
  },
  async saveToken(key: string, value: string) {
    try { await SecureStore.setItemAsync(key, value); } catch (err) { return; }
  },
};

const publishableKey = "pk_test_cmFwaWQtYmFybmFjbGUtODAuY2xlcmsuYWNjb3VudHMuZGV2JA";

if (process.env.EXPO_PUBLIC_SENTRY_DSN) {
  Sentry.init({ dsn: process.env.EXPO_PUBLIC_SENTRY_DSN });
}

function InitialLayout() {
  const { isLoaded, isSignedIn } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const { setColorScheme } = useColorScheme();

  useEffect(() => {
    SecureStore.getItemAsync(THEME_STORAGE_KEY).then((saved) => {
      if (saved === "light" || saved === "dark") {
        setColorScheme(saved);
      }
    });
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    const inAuthRoute = segments[0] === 'sign-in' || segments[0] === '(auth)';

    if (isSignedIn && inAuthRoute) {
      router.replace('/');
    }
  }, [isSignedIn, isLoaded, segments]);

  return <Stack screenOptions={{ headerShown: false }} />;
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
});