import { useLanguage } from "@/lib/i18n";
import { GroceryItem, useGroceryStore } from "@/store/grocery-store";
import { FontAwesome6 } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Pressable, Text, View } from "react-native";

const priorityPillBg = {
    low: "bg-priority-low",
    medium: "bg-priority-medium",
    high: "bg-priority-high",
};

const priorityPillText = {
    low: "text-priority-low-foreground",
    medium: "text-priority-medium-foreground",
    high: "text-priority-high-foreground",
};

const PendingItemCard = ({ item }: { item: GroceryItem }) => {
    const { removeItem, updateQuantity, togglePurchased } = useGroceryStore();
    const { t, locale } = useLanguage();

    const translatedPriority = t(`priorities.${item.priority}`) || item.priority;
    const translatedCategory = item.category
        ? t(`categories.${item.category.toLowerCase()}`) || item.category
        : null;

    const formattedPrice =
        item.price !== null && item.price !== undefined
            ? new Intl.NumberFormat(locale === "es" ? "es-ES" : "en-US", {
                style: "currency",
                currency: "EUR",
                }).format(item.price)
            : null;

    return (
        <View className="rounded-3xl border border-border bg-card p-4">
            <View className="flex-row items-start gap-3">
                <Pressable
                    className="mt-1 size-6 items-center justify-center rounded-full border-2 border-border bg-card"
                    onPress={() => togglePurchased(item.id)}
                ></Pressable>

                {/* MINIATURA DE IMAGEN (solo si el producto tiene una) */}
                {item.imageUri && (
                    <Image
                        source={{ uri: item.imageUri }}
                        style={{ width: 48, height: 48, borderRadius: 12 }}
                        contentFit="cover"
                        transition={150}
                    />
                )}

                <View className="flex-1">
                    <View className="flex-row items-center justify-between gap-2">
                        <Text className="flex-1 text-lg font-semibold text-card-foreground">{item.name}</Text>
                        <View className={`rounded-full px-3 py-1 ${priorityPillBg[item.priority]}`}>
                            <Text className={`text-xs font-bold uppercase ${priorityPillText[item.priority]}`}>
                                {translatedPriority}
                            </Text>
                        </View>
                    </View>

                    {(translatedCategory || formattedPrice) && (
                        <View className="mt-2 flex-row flex-wrap items-center gap-2">
                            {translatedCategory && (
                                <View className="rounded-full bg-secondary px-3 py-1">
                                    <Text className="text-xs font-semibold text-secondary-foreground">
                                        {translatedCategory}
                                    </Text>
                                </View>
                            )}

                            {/* PRECIO EN EUROS (solo si el producto tiene precio) */}
                            {formattedPrice && (
                                <View className="flex-row items-center gap-1 rounded-full bg-muted px-3 py-1">
                                    <FontAwesome6 name="euro-sign" size={10} color="#5b7567" />
                                    <Text className="text-xs font-semibold text-foreground">
                                        {formattedPrice}
                                    </Text>
                                </View>
                            )}
                        </View>
                    )}

                    <View className="mt-3 flex-row items-center gap-2">
                        <Pressable
                            className="h-8 w-8 items-center justify-center rounded-xl border border-border bg-muted"
                            onPress={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        >
                            <FontAwesome6 name="minus" size={12} color="#3b5a4a" />
                        </Pressable>

                        <Text className="min-w-9 text-center text-base font-semibold text-foreground">
                            {item.quantity}
                        </Text>

                        <Pressable
                            className="h-8 w-8 items-center justify-center rounded-xl border border-border bg-muted"
                            onPress={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                            <FontAwesome6 name="plus" size={12} color="#3b5a4a" />
                        </Pressable>
                    </View>
                </View>

                <Pressable
                    className="h-9 w-9 items-center justify-center rounded-xl bg-destructive"
                    onPress={() => removeItem(item.id)}
                >
                    <FontAwesome6 name="trash" size={13} color="#d45f58" />
                </Pressable>
            </View>
        </View>
    );
};

export default PendingItemCard;