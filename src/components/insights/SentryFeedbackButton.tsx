import { FontAwesome6 } from "@expo/vector-icons";
import * as Sentry from "@sentry/react-native";
import { useColorScheme } from "nativewind";
import { Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SentryFeedbackButton = () => {
    const insets = useSafeAreaInsets();
    const { colorScheme } = useColorScheme();
    const iconColor = colorScheme === "dark" ? "hsl(136 42% 92%)" : "hsl(146 60% 22%)";

    return (
        <View
            style={{
                position: "absolute",
                right: 16,
                zIndex: 50,
                bottom: insets.bottom + 90,
            }}
        >
            <Pressable
                onPress={() => Sentry.showFeedbackWidget()}
                className="h-12 w-12 items-center justify-center rounded-full border border-border bg-card"
            >
                <FontAwesome6 name="comment-dots" size={16} color={iconColor} />
            </Pressable>
        </View>
    );
};
export default SentryFeedbackButton;