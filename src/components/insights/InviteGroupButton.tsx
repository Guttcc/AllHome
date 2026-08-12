import { useLanguage } from "@/lib/i18n";
import { useGroceryStore } from "@/store/grocery-store";
import { FontAwesome6 } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { Alert, Pressable, Text } from "react-native";

const InviteGroupButton = () => {
    const { activeContext, groups } = useGroceryStore();
    const { t } = useLanguage();

    if (activeContext === "personal") return null;

    const activeGroup = groups.find((g) => g.id === activeContext);

    if (!activeGroup?.code) return null;

    const handleCopyCode = async () => {
        await Clipboard.setStringAsync(activeGroup.code);
        Alert.alert(
            "¡Código copiado! 📋",
            `Comparte el código (${activeGroup.code}) con tus familiares para que puedan unirse.`
        );
    };

    return (
        <Pressable
            className="flex-row items-center justify-center gap-2 rounded-2xl border border-primary/30 bg-primary/10 py-3.5"
            onPress={handleCopyCode}
        >
            <FontAwesome6 name="share-nodes" size={16} color="#3b5a4a" />
            <Text className="font-semibold text-primary">
                {t("groups.copyInviteCode") || `Copiar código: ${activeGroup.code}`}
            </Text>
        </Pressable>
    );
};

export default InviteGroupButton;