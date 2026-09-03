import { calculateContextTotal } from "@/lib/calculateTotal";
import { useLanguage } from "@/lib/i18n";
import { useGroceryStore } from "@/store/grocery-store";
import { useUser } from "@clerk/expo";
import { FontAwesome6 } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

const BudgetSection = () => {
    const { user } = useUser();
    const { items, activeContext, groups, budget, loadBudget, updateBudget, isBudgetLoading } =
        useGroceryStore();
    const { t, locale } = useLanguage();

    const [inputValue, setInputValue] = useState("");
    const [isEditing, setIsEditing] = useState(false);

    const contextId = activeContext === "personal" ? user?.id : activeContext;
    const activeGroup = groups.find((g) => g.id === activeContext);
    const contextLabel = activeContext === "personal" ? t("groups.myList") || "Mi lista" : activeGroup?.name;

    useEffect(() => {
        if (contextId) {
            loadBudget(contextId);
            setIsEditing(false);
        }
    }, [contextId]);

    useEffect(() => {
        if (!isEditing) {
            setInputValue(budget !== null ? String(budget) : "");
        }
    }, [budget, isEditing]);

    const { total } = useMemo(() => calculateContextTotal(items, activeContext), [items, activeContext]);

    const handleChange = (value: string) => {
        setIsEditing(true);
        const cleaned = value.replace(/[^0-9.,]/g, "").replace(",", ".");
        const parts = cleaned.split(".");
        setInputValue(parts.length > 2 ? `${parts[0]}.${parts.slice(1).join("")}` : cleaned);
    };

    const handleSave = () => {
        if (!contextId) return;
        const parsed = Number(inputValue);
        if (inputValue.trim() && !Number.isNaN(parsed) && parsed >= 0) {
            updateBudget(contextId, parsed);
        }
        setIsEditing(false);
    };

    const formatCurrency = (value: number) =>
        new Intl.NumberFormat(locale === "es" ? "es-ES" : "en-US", {
            style: "currency",
            currency: "EUR",
        }).format(value);

    const status = budget === null ? null : total > budget ? "over" : total === budget ? "equal" : "under";

    const statusStyles = {
        under: { bar: "bg-primary", text: "text-primary dark:text-white", bg: "bg-primary/10" },
        equal: { bar: "bg-amber-500", text: "text-amber-600", bg: "bg-amber-500/10" },
        over: { bar: "bg-destructive-foreground", text: "text-destructive-foreground", bg: "bg-destructive" },
    };

    const progressPercent = budget && budget > 0 ? Math.min(100, Math.round((total / budget) * 100)) : 0;

    return (
        <View className="rounded-3xl border border-border bg-card p-4 dark:bg-[hsl(162,100%,21%)]">
            <View className="flex-row items-center justify-between">
                <Text className="text-sm font-semibold text-foreground">
                    {t("budget.title") || "Presupuesto"}{" "}
                    {contextLabel ? (
                        <Text className="text-xs font-normal text-muted-foreground">({contextLabel})</Text>
                    ) : null}
                </Text>
            </View>

            <View className="mt-2 flex-row items-center gap-2">
                <View className="flex-1 flex-row items-center rounded-2xl border border-border bg-muted px-4 py-3">
                    <FontAwesome6 name="euro-sign" size={13} color="#5b7567" />
                    <TextInput
                        value={inputValue}
                        onChangeText={handleChange}
                        onBlur={handleSave}
                        keyboardType="decimal-pad"
                        placeholder={t("budget.placeholder") || "Ej: 50"}
                        placeholderTextColor="#8aa397"
                        className="ml-3 flex-1 text-base text-foreground"
                    />
                </View>

                {isEditing && (
                    <Pressable
                        onPress={handleSave}
                        className="h-11 w-11 items-center justify-center rounded-2xl bg-primary"
                    >
                        <FontAwesome6 name="check" size={14} color="#ffffff" />
                    </Pressable>
                )}
            </View>

            {budget !== null && status && (
                <View className="mt-4">
                    <View className="overflow-hidden rounded-full bg-muted" style={{ height: 10 }}>
                        <View
                            className={`h-full rounded-full ${statusStyles[status].bar}`}
                            style={{ width: `${progressPercent}%` as `${number}%` }}
                        />
                    </View>

                    <View className={`mt-3 flex-row items-center justify-between rounded-2xl px-3 py-2 ${statusStyles[status].bg}`}>
                        <Text className={`text-sm font-semibold ${statusStyles[status].text}`}>
                            {formatCurrency(total)} {t("budget.of") || "de"} {formatCurrency(budget)}
                        </Text>
                        <Text className={`text-xs font-bold uppercase ${statusStyles[status].text}`}>
                            {status === "under" && (t("budget.underBudget") || "Dentro del presupuesto")}
                            {status === "equal" && (t("budget.exactBudget") || "Justo en el límite")}
                            {status === "over" && (t("budget.overBudget") || "Presupuesto superado")}
                        </Text>
                    </View>
                </View>
            )}
        </View>
    );
};

export default BudgetSection;