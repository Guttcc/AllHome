import { useLanguage } from "@/lib/i18n";
import { useGroceryStore } from "@/store/grocery-store";
import { Alert, Pressable, Text } from "react-native";

export default function LeaveGroupButton() {
    const { activeContext, groups, leaveGroup } = useGroceryStore();
    const { t } = useLanguage();

    if (activeContext === "personal") return null;

    const currentGroup = groups.find((g) => g.id === activeContext);

    const handleLeave = () => {
        Alert.alert(
            t("groups.leaveTitle") || "Salir del grupo",
            `${t("groups.leaveConfirm") || "¿Estás seguro de que deseas salir de este grupo?"} (${currentGroup?.name || ""})`,
            [
                { text: t("groups.cancel") || "Cancelar", style: "cancel" },
                {
                    text: t("groups.leave") || "Salir",
                    style: "destructive",
                    onPress: () => leaveGroup(activeContext),
                },
            ]
        );
    };

    return (
        <Pressable
            className="rounded-2xl bg-destructive py-3"
            onPress={handleLeave}
        >
            <Text className="text-center text-base font-semibold text-[#d45f58]">
                {t("groups.leaveGroup") || "Salir del grupo familiar"}
            </Text>
        </Pressable>
    );
}