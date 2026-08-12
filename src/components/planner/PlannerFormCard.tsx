import { useLanguage } from "@/lib/i18n";
import { GroceryCategory, GroceryPriority, useGroceryStore } from "@/store/grocery-store";
import { FontAwesome6 } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

const categories: GroceryCategory[] = ["Produce", "Dairy", "Bakery", "Pantry", "Snacks"];
const priorities: GroceryPriority[] = ["low", "medium", "high"];

const categoryIcons = {
    Produce: "leaf",
    Dairy: "cow",
    Bakery: "bread-slice",
    Pantry: "box-open",
    Snacks: "cookie-bite",
};

const PlannerFormCard = () => {
    const { error, addItem } = useGroceryStore();
    const { t } = useLanguage();

    const [name, setName] = useState("");
    const [quantity, setQuantity] = useState("1");
    const [category, setCategory] = useState<GroceryCategory>("Produce");
    const [priority, setPriority] = useState<GroceryPriority>("medium");

    const canCreate = name.trim().length > 0;

    const handleQuantityChange = (value: string) => {
        setQuantity(value.replace(/[^0-9]/g, ""));
    };

    const createItem = async () => {
        await addItem({
            name: name.trim(),
            category,
            priority,
            quantity: Number(quantity) || 1,
        });

        setName("");
        setQuantity("1");
        setCategory("Produce");
        setPriority("medium");
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

            {/* QUANTITY */}
            <Text className="mt-4 text-sm font-semibold text-foreground">
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

            {/* CATEGORIES */}
            <Text className="mt-4 text-sm font-semibold text-foreground">
                {t("planner.category") || "Category"}
            </Text>
            <View className="mt-2 flex-row flex-wrap gap-2">
                {categories.map((option) => {
                    const active = option === category;
                    const translatedCategory = t(`categories.${option.toLowerCase()}`) || option;

                    return (
                        <Pressable
                            key={option}
                            onPress={() => setCategory(option)}
                            className={`flex-row items-center rounded-full px-4 py-2 ${
                                active ? "bg-primary" : "bg-secondary"
                            }`}
                        >
                            <FontAwesome6
                                name={categoryIcons[option]}
                                size={12}
                                color={active ? "#fff" : "#486856"}
                            />
                            <Text
                                className={`ml-2 text-sm font-semibold ${
                                    active ? "text-primary-foreground" : "text-secondary-foreground"
                                }`}
                            >
                                {translatedCategory}
                            </Text>
                        </Pressable>
                    );
                })}
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

            <Pressable
                className={`mt-5 flex-row items-center justify-center rounded-2xl py-3 ${
                    canCreate ? "bg-primary" : "bg-muted"
                }`}
                onPress={createItem}
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

            {error ? (
                <View className="mt-3 rounded-2xl border border-destructive bg-destructive px-3 py-2">
                    <Text className="text-center text-sm uppercase text-white">{error}</Text>
                </View>
            ) : null}
        </View>
    );
};

export default PlannerFormCard;