import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import { Pressable } from "react-native";

export default function ThemeToggle() {
    const { colorScheme, setColorScheme } = useColorScheme();
    const isDark = colorScheme === "dark";

    const toggleTheme = () => {
        setColorScheme(isDark ? "light" : "dark");
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