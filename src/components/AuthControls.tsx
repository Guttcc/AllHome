import { useAuth, useUser } from "@clerk/expo";
import { Link, router } from "expo-router";
import { Pressable, Text, View } from "react-native";

export function AuthControls() {
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();

  if (!isLoaded) {
    return null;
  }

  if (!isSignedIn) {
    return (
      <View className="flex-row items-center gap-3">
        <Link href="/(auth)/sign-in" asChild>
          <Pressable className="rounded-full bg-slate-900 px-4 py-2">
            <Text className="text-sm font-semibold text-white">Iniciar sesión</Text>
          </Pressable>
        </Link>
        <Link href="/(auth)/sign-up" asChild>
          <Pressable className="rounded-full border border-slate-300 px-4 py-2">
            <Text className="text-sm font-semibold text-slate-900">Crear cuenta</Text>
          </Pressable>
        </Link>
      </View>
    );
  }

  return (
    <View className="flex-row items-center gap-3">
      <Text className="text-sm font-medium text-slate-700">
        Hola, {user?.firstName ?? user?.emailAddresses[0]?.emailAddress ?? "usuario"}
      </Text>
      <Pressable
        className="rounded-full bg-slate-900 px-4 py-2"
        onPress={() => router.replace("/")}
      >
        <Text className="text-sm font-semibold text-white">Ir al inicio</Text>
      </Pressable>
    </View>
  );
}
