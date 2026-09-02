import { useLanguage } from "@/lib/i18n";
import { useGroceryStore } from "@/store/grocery-store";
import { Text, View } from "react-native";

const categoryColors: Record<string, string> = {
    Produce: "#74c49a",
    Dairy: "#8ec5ff",
    Bakery: "#f3bc84",
    Pantry: "#b69cff",
    Snacks: "#f3a1bd",
};

export default function InsightsCategorySection() {
    const { items } = useGroceryStore();
    const { t } = useLanguage();
    const total = items.length;

    const uncategorizedLabel = t("categories.none") || "Sin categoría";

    // La categoría es texto libre: agrupamos por el texto tal cual (sin traducir),
    // y los items sin categoría van juntos bajo la etiqueta "Sin categoría"
    const categories = items.reduce<Record<string, number>>((acc, item) => {
        const label = item.category?.trim() || uncategorizedLabel;
        acc[label] = (acc[label] ?? 0) + 1;
        return acc;
    }, {});
    const categoryEntries = Object.entries(categories).sort((a, b) => b[1] - a[1]);

    return (
        <View className="rounded-3xl border border-border bg-card p-4">
            <View className="flex-row items-center justify-between">
                <Text className="text-sm font-semibold text-foreground">{t("insights.itemsByCategory")}</Text>
                <Text className="text-xs uppercase tracking-[1px] text-muted-foreground">
                    {categoryEntries.length} {t("status.groups")}
                </Text>
            </View>

            {categoryEntries.map(([category, count]) => {
                const widthPercent = total ? Math.max(10, Math.round((count / total) * 100)) : 10;

                return (
                    <View key={category} className="mt-3">
                        <View className="mb-1 flex-row items-center justify-between">
                            <Text className="text-sm font-medium text-foreground">{category}</Text>
                            <Text className="text-sm text-muted-foreground">{count}</Text>
                        </View>
                        <View className="overflow-hidden rounded-full bg-secondary">
                            <View
                                className="h-2 rounded-full"
                                style={{
                                    width: `${widthPercent}%` as `${number}%`,
                                    backgroundColor: categoryColors[category] ?? "#8aa397",
                                }}
                            />
                        </View>
                    </View>
                );
            })}

            {categoryEntries.length === 0 ? (
                <View className="mt-3 rounded-2xl bg-muted px-4 py-3">
                    <Text className="text-sm text-muted-foreground">
                        {t("insights.addItemsMix")}
                    </Text>
                </View>
            ) : null}
        </View>
    );
}