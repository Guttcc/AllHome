import PlannerFormCard from "@/components/planner/PlannerFormCard";
import PlannerHeroImage from "@/components/planner/PlannerHeroImage";
import TabScreenBackground from "@/components/TabScreenBackground";
import { useLanguage } from "@/lib/i18n";
import { useGroceryStore } from "@/store/grocery-store";
import { FontAwesome6 } from "@expo/vector-icons";
import { useState } from "react";
import { Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

const PlannerScreen = () => {
    const { items } = useGroceryStore();
    const { t } = useLanguage();
    const [pendingImageUri, setPendingImageUri] = useState<string | null>(null);

    const pendingCount = items.filter((item) => !item.purchased).length;
    const highPriorityCount = items.filter(
        (item) => !item.purchased && item.priority === "high",
    ).length;

    const totalQuantity = items
        .filter((item) => !item.purchased)
        .reduce((sum, item) => sum + item.quantity, 0);

    return (
        <KeyboardAwareScrollView
            bottomOffset={80}
            contentContainerStyle={{ padding: 20, gap: 14 }}
            showsVerticalScrollIndicator={false}
            className="flex-1 bg-background py-4"
            contentInsetAdjustmentBehavior="automatic"
            keyboardShouldPersistTaps="handled"
        >
            <TabScreenBackground />

            <View className="gap-4 rounded-3xl border border-border bg-card/70 p-5">
                <View className="flex-row items-start justify-between">
                    <View className="flex-1 pr-4">
                        <Text className="text-xs font-semibold uppercase tracking-[1.2px] text-muted-foreground">
                            {t("planner.title")}
                        </Text>
                        <Text className="mt-1 text-3xl font-bold leading-9 text-foreground">
                            {t("planner.tagline")}
                        </Text>
                        <Text className="mt-2 text-sm leading-5 text-muted-foreground">
                            {t("planner.description")}
                        </Text>
                    </View>

                    <View className="h-12 w-12 items-center justify-center rounded-2xl bg-primary">
                        <FontAwesome6 name="wand-magic-sparkles" size={18} color="#ffffff" />
                    </View>
                </View>

                <View className="flex-row gap-2">
                    <View className="flex-1 rounded-2xl border border-border bg-background/80 p-3">
                        <Text className="text-xs font-medium uppercase tracking-[1px] text-muted-foreground">
                            {t("status.pending")}
                        </Text>
                        <Text className="mt-1 text-xl font-bold text-foreground">{pendingCount}</Text>
                    </View>

                    <View className="flex-1 rounded-2xl border border-border bg-background/80 p-3">
                        <Text className="text-xs font-medium uppercase tracking-[1px] text-muted-foreground">
                            {t("priorities.highPriority")}
                        </Text>
                        <Text className="mt-1 text-xl font-bold text-foreground">{highPriorityCount}</Text>
                    </View>

                    <View className="flex-1 rounded-2xl border border-border bg-background/80 p-3">
                        <Text className="text-xs font-medium uppercase tracking-[1px] text-muted-foreground">
                            {t("form.units")}
                        </Text>
                        <Text className="mt-1 text-xl font-bold text-foreground">{totalQuantity}</Text>
                    </View>
                </View>
            </View>

            <PlannerHeroImage imageUri={pendingImageUri} onImagePicked={setPendingImageUri} />

            <View className="px-1">
                <Text className="text-sm font-semibold uppercase tracking-[1px] text-muted-foreground">
                    {t("planner.buildYourList")}
                </Text>
                <Text className="mt-1 text-sm text-muted-foreground">
                    {t("planner.buildYourListDesc")}
                </Text>
            </View>

            <PlannerFormCard imageUri={pendingImageUri} onItemCreated={() => setPendingImageUri(null)} />
        </KeyboardAwareScrollView>
    );
};

export default PlannerScreen;