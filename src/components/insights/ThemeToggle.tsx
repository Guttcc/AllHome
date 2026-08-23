import { Ionicons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import { useColorScheme } from "nativewind";
import { Pressable } from "react-native";

export const THEME_STORAGE_KEY = "app_theme";

export default function ThemeToggle() {
    const { colorScheme, setColorScheme } = useColorScheme();
    const isDark = colorScheme === "dark";

    const toggleTheme = () => {
        const next = isDark ? "light" : "dark";
        setColorScheme(next);
        SecureStore.setItemAsync(THEME_STORAGE_KEY, next).catch(() => {});
    };

    return (
        <Pressable
            onPress={toggleTheme}
            className="w-10 h-10 items-center justify-center rounded-full bg-muted"
        >
            <Ionicons
                name={isDark ? "moon" : "sunny"}
                size={20}
                color={isDark ? "hsl(147 75% 33%)" : "hsl(147 75% 33%)"}
            />
        </Pressable>
    );
}