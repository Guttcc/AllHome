import { useLanguage } from "@/lib/i18n";
import { useGroceryStore } from "@/store/grocery-store";
import { Text, View } from "react-native";

const ListHeroCard = () => {
    const { items } = useGroceryStore();
    const { t } = useLanguage();

    const completedCount = items.filter((item) => item.purchased).length;
    const pendingCount = items.length - completedCount;
    const completionRate = items.length ? Math.round((completedCount / items.length) * 100) : 0;

    return (
        <View className="rounded-3xl bg-primary p-5">
            <Text className="text-sm font-semibold uppercase tracking-[1px] text-primary-foreground/70">
                {t("hero.today")}
            </Text>

            <Text className="mt-1 text-3xl font-extrabold text-primary-foreground">
                {t("hero.title")}
            </Text>

            <Text className="mt-1 text-sm text-primary-foreground/80">
                {pendingCount} {t("status.pending").toLowerCase()} · {completedCount} {t("status.completed").toLowerCase()}
            </Text>

            <View className="mt-4 overflow-hidden rounded-full bg-white/50">
                <View className="h-2 rounded-full bg-secondary" style={{ width: `${completionRate}%` }} />
            </View>
        </View>
    );
};

export default ListHeroCard;