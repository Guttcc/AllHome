import { useLanguage } from "@/lib/i18n";
import { GroceryPriority, useGroceryStore } from "@/store/grocery-store";
import { useUser } from "@clerk/expo";
import { FontAwesome6 } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

const priorities: GroceryPriority[] = ["low", "medium", "high"];

const PlannerFormCard = ({
    imageUri = null,
    onItemCreated,
}: {
    imageUri?: string | null;
    onItemCreated?: () => void;
}) => {
    const { error, addItem, groups, activeContext } = useGroceryStore();
    const { t } = useLanguage();
    const { user } = useUser();

    const [name, setName] = useState("");
    const [quantity, setQuantity] = useState("1");
    const [category, setCategory] = useState("");
    const [price, setPrice] = useState("");
    const [priority, setPriority] = useState<GroceryPriority>("medium");

    const canCreate = name.trim().length > 0;
    const activeGroup = groups.find((g) => g.id === activeContext) || groups[0];

    const handleQuantityChange = (value: string) => {
        setQuantity(value.replace(/[^0-9]/g, ""));
    };

    // Permite dígitos y un solo separador decimal (, o .)
    const handlePriceChange = (value: string) => {
        const cleaned = value.replace(/[^0-9.,]/g, "").replace(",", ".");
        const parts = cleaned.split(".");
        const normalized = parts.length > 2 ? `${parts[0]}.${parts.slice(1).join("")}` : cleaned;
        setPrice(normalized);
    };

    const createItem = async (targetGroupId: string | null = null) => {
        if (!user?.id) return;

        const trimmedCategory = category.trim();
        const parsedPrice = price.trim() ? Number(price) : null;

        await addItem(
            {
                name: name.trim(),
                category: trimmedCategory.length > 0 ? trimmedCategory : null,
                priority,
                quantity: Number(quantity) || 1,
                price: parsedPrice !== null && !Number.isNaN(parsedPrice) ? parsedPrice : null,
                imageUri: imageUri ?? null,
                groupId: targetGroupId,
            },
            user.id
        );

        setName("");
        setQuantity("1");
        setCategory("");
        setPrice("");
        setPriority("medium");
        onItemCreated?.();
    };

    return (
        <View className="rounded-3xl border border-border bg-card p-4">
            {/* NAME */}
            <Text className="text-sm font-semibold text-foreground">
                {t("planner.itemName") || "Item name"}
            </Text>
            <View className="mt-2 flex-row items-center rounded-2xl border border-border bg-muted px-4 py-3">
                <FontAwesome6 name="bag-shopping" size={13} color="#5b7567" />
                <TextInput
                    value={name}
                    onChangeText={setName}
                    placeholder={t("planner.namePlaceholder") || "Ex: Blueberries"}
                    className="ml-3 flex-1 text-base text-foreground"
                    placeholderTextColor="#8aa397"
                />
            </View>

            {/* QUANTITY + PRICE */}
            <View className="mt-4 flex-row gap-3">
                <View className="flex-1">
                    <Text className="text-sm font-semibold text-foreground">
                        {t("planner.quantity") || "Quantity"}
                    </Text>
                    <View className="mt-2 flex-row items-center rounded-2xl border border-border bg-muted px-4 py-3">
                        <FontAwesome6 name="hashtag" size={13} color="#5b7567" />
                        <TextInput
                            value={quantity}
                            onChangeText={handleQuantityChange}
                            keyboardType="number-pad"
                            placeholder="1"
                            placeholderTextColor="#8aa397"
                            className="ml-3 flex-1 text-base text-foreground"
                        />
                    </View>
                </View>

                <View className="flex-1">
                    <Text className="text-sm font-semibold text-foreground">
                        {t("planner.price") || "Precio"}
                    </Text>
                    <View className="mt-2 flex-row items-center rounded-2xl border border-border bg-muted px-4 py-3">
                        <FontAwesome6 name="euro-sign" size={13} color="#5b7567" />
                        <TextInput
                            value={price}
                            onChangeText={handlePriceChange}
                            keyboardType="decimal-pad"
                            placeholder="0.00"
                            placeholderTextColor="#8aa397"
                            className="ml-3 flex-1 text-base text-foreground"
                        />
                    </View>
                </View>
            </View>

            {/* CATEGORÍA LIBRE (OPCIONAL) */}
            <Text className="mt-4 text-sm font-semibold text-foreground">
                {t("planner.category") || "Category"}{" "}
                <Text className="text-xs font-normal text-muted-foreground">
                    ({t("common.optional") || "opcional"})
                </Text>
            </Text>
            <View className="mt-2 flex-row items-center rounded-2xl border border-border bg-muted px-4 py-3">
                <FontAwesome6 name="plus" size={13} color="#5b7567" />
                <TextInput
                    value={category}
                    onChangeText={setCategory}
                    placeholder={t("planner.categoryPlaceholder") || "Añadir..."}
                    placeholderTextColor="#8aa397"
                    className="ml-3 flex-1 text-base text-foreground"
                />
                {category.length > 0 && (
                    <Pressable onPress={() => setCategory("")} hitSlop={8}>
                        <FontAwesome6 name="xmark" size={14} color="#8aa397" />
                    </Pressable>
                )}
            </View>

            {/* PRIORITY */}
            <Text className="mt-4 text-sm font-semibold text-foreground">
                {t("planner.priority") || "Priority"}
            </Text>
            <View className="mt-2 flex-row gap-2">
                {priorities.map((option) => {
                    const active = option === priority;
                    const icon = option === "high" ? "bolt" : option === "medium" ? "compass" : "seedling";
                    const translatedPriority = t(`priorities.${option}`) || option;

                    return (
                        <Pressable
                            key={option}
                            onPress={() => setPriority(option)}
                            className={`flex-1 flex-row items-center justify-center gap-2 rounded-2xl py-2 ${
                                active ? "bg-primary" : "bg-secondary"
                            }`}
                        >
                            <FontAwesome6 name={icon} size={12} color={active ? "#ffffff" : "#486856"} />
                            <Text
                                className={`mt-1 text-sm font-semibold capitalize ${
                                    active ? "text-primary-foreground" : "text-secondary-foreground"
                                }`}
                            >
                                {translatedPriority}
                            </Text>
                        </Pressable>
                    );
                })}
            </View>

            {/* BOTÓN 1: LISTA PERSONAL */}
            <Pressable
                className={`mt-5 flex-row items-center justify-center rounded-2xl py-3 ${
                    canCreate ? "bg-primary" : "bg-muted"
                }`}
                onPress={() => createItem(null)}
                disabled={!canCreate}
            >
                <FontAwesome6 name="plus" size={14} color={canCreate ? "#ffffff" : "#7a9386"} />
                <Text
                    className={`ml-2 text-base font-semibold ${
                        canCreate ? "text-primary-foreground" : "text-muted-foreground"
                    }`}
                >
                    {t("planner.addButton") || "Add to Grocery List"}
                </Text>
            </Pressable>

            {/* BOTÓN 2: LISTA FAMILIAR */}
            {groups.length > 0 && activeGroup && (
                <Pressable
                    className={`mt-2 flex-row items-center justify-center rounded-2xl border border-primary py-3 ${
                        canCreate ? "bg-primary/10" : "bg-muted"
                    }`}
                    onPress={() => createItem(activeGroup.id)}
                    disabled={!canCreate}
                >
                    <FontAwesome6 name="house-user" size={14} color={canCreate ? "#3b5a4a" : "#7a9386"} />
                    <Text
                        className={`ml-2 text-base font-semibold ${
                            canCreate ? "text-primary" : "text-muted-foreground"
                        }`}
                    >
                        {t("groups.addToGroup") || "Añadir a"} {activeGroup.name}
                    </Text>
                </Pressable>
            )}

            {error ? (
                <View className="mt-3 rounded-2xl border border-destructive bg-destructive px-3 py-2">
                    <Text className="text-center text-sm uppercase text-white">{error}</Text>
                </View>
            ) : null}
        </View>
    );
};

export default PlannerFormCard;