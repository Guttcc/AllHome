import { useLanguage } from "@/lib/i18n";
import { useGroceryStore } from "@/store/grocery-store";
import { useUser } from "@clerk/expo";
import { FontAwesome6 } from "@expo/vector-icons";
import { useState } from "react";
import { Modal, Pressable, Text, TextInput, View } from "react-native";

const ListHeroCard = () => {
    const { items, groups, activeContext, setActiveContext, createGroup, joinGroup } = useGroceryStore();
    const { t } = useLanguage();
    const { user } = useUser(); 

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isJoinOpen, setIsJoinOpen] = useState(false);
    const [groupName, setGroupName] = useState("");
    const [joinCode, setJoinCode] = useState("");

    const activeGroup = groups.find((g) => g.id === activeContext);

    const filteredItems = items.filter((item) => {
        if (activeContext === "personal") {
            return !item.groupId;
        }
        return item.groupId === activeContext;
    });

    const completedCount = filteredItems.filter((item) => item.purchased).length;
    const pendingCount = filteredItems.length - completedCount;
    const completionRate = filteredItems.length ? Math.round((completedCount / filteredItems.length) * 100) : 0;

    const handleCreateGroup = async () => {
        if (!groupName.trim() || !user?.id) return;
        await createGroup(groupName.trim(), user.id); 
        setGroupName("");
        setIsCreateOpen(false);
        setIsMenuOpen(false);
    };

    const handleJoinGroup = async () => {
        if (!joinCode.trim() || !user?.id) return;
        await joinGroup(joinCode.trim(), user.id); 
        setJoinCode("");
        setIsJoinOpen(false);
        setIsMenuOpen(false);
    };

    const displayTitle = activeContext === "personal"
        ? (t("groups.myList") || "Mi lista de compras")
        : `${t("groups.familyList") || "Lista Familiar"}: ${activeGroup?.name || ""}`;

    return (
        <View className="rounded-3xl bg-primary p-5">
            <Text className="text-sm font-semibold uppercase tracking-[1px] text-primary-foreground/70">
                {t("hero.today")}
            </Text>

            <Pressable
                className="mt-1 flex-row items-center gap-2 self-start"
                onPress={() => setIsMenuOpen(true)}
            >
                <Text className="text-2xl font-extrabold text-primary-foreground">
                    {displayTitle}
                </Text>
                <FontAwesome6 name="chevron-down" size={16} color="#ffffff" />
            </Pressable>

            <Text className="mt-1 text-sm text-primary-foreground/80">
                {pendingCount} {t("status.pending").toLowerCase()} · {completedCount} {t("status.completed").toLowerCase()}
            </Text>

            <View className="mt-4 overflow-hidden rounded-full bg-white/50">
                <View className="h-2 rounded-full bg-secondary" style={{ width: `${completionRate}%` }} />
            </View>

            {/* MENÚ DE SELECCIÓN */}
            <Modal visible={isMenuOpen} transparent animationType="fade" onRequestClose={() => setIsMenuOpen(false)}>
                <Pressable className="flex-1 justify-end bg-black/60" onPress={() => setIsMenuOpen(false)}>
                    <View className="rounded-t-3xl border-t border-border bg-card p-6 gap-3">
                        <Text className="text-lg font-bold text-card-foreground mb-2">
                            {t("groups.selectList") || "Seleccionar Lista"}
                        </Text>

                        <Pressable
                            className={`flex-row items-center justify-between rounded-2xl p-4 ${
                                activeContext === "personal" ? "bg-primary/10 border border-primary" : "bg-muted"
                            }`}
                            onPress={() => {
                                setActiveContext("personal");
                                setIsMenuOpen(false);
                            }}
                        >
                            <View className="flex-row items-center gap-3">
                                <FontAwesome6 name="user" size={16} color="#3b5a4a" />
                                <Text className="font-semibold text-foreground">
                                    {t("groups.myList") || "Mi lista de compras"}
                                </Text>
                            </View>
                            {activeContext === "personal" && <FontAwesome6 name="check" size={14} color="#3b5a4a" />}
                        </Pressable>

                        {groups.map((group) => (
                            <Pressable
                                key={group.id}
                                className={`flex-row items-center justify-between rounded-2xl p-4 ${
                                    activeContext === group.id ? "bg-primary/10 border border-primary" : "bg-muted"
                                }`}
                                onPress={() => {
                                    setActiveContext(group.id);
                                    setIsMenuOpen(false);
                                }}
                            >
                                <View className="flex-row items-center gap-3">
                                    <FontAwesome6 name="house-user" size={16} color="#3b5a4a" />
                                    <Text className="font-semibold text-foreground">
                                        {t("groups.familyList") || "Lista Familiar"}: {group.name}
                                    </Text>
                                </View>
                                {activeContext === group.id && <FontAwesome6 name="check" size={14} color="#3b5a4a" />}
                            </Pressable>
                        ))}

                        <View className="h-[1px] bg-border my-1" />

                        <Pressable
                            className="flex-row items-center gap-3 rounded-2xl bg-muted p-4"
                            onPress={() => {
                                setIsMenuOpen(false);
                                setIsJoinOpen(true);
                            }}
                        >
                            <FontAwesome6 name="link" size={16} color="#3b5a4a" />
                            <Text className="font-semibold text-foreground">
                                {t("groups.joinGroup") || "Unirme a grupo"}
                            </Text>
                        </Pressable>

                        <Pressable
                            className="flex-row items-center gap-3 rounded-2xl bg-primary p-4"
                            onPress={() => {
                                setIsMenuOpen(false);
                                setIsCreateOpen(true);
                            }}
                        >
                            <FontAwesome6 name="plus" size={16} color="#ffffff" />
                            <Text className="font-semibold text-primary-foreground">
                                {t("groups.createGroup") || "Crear grupo"}
                            </Text>
                        </Pressable>
                    </View>
                </Pressable>
            </Modal>

            {/* MODAL CREAR GRUPO */}
            <Modal visible={isCreateOpen} transparent animationType="slide" onRequestClose={() => setIsCreateOpen(false)}>
                <View className="flex-1 justify-center bg-black/60 p-5">
                    <View className="rounded-3xl bg-card p-6 gap-4">
                        <Text className="text-xl font-bold text-card-foreground">
                            {t("groups.createGroup") || "Crear Grupo Familiar"}
                        </Text>
                        <TextInput
                            className="rounded-2xl border border-border bg-muted p-4 text-foreground"
                            placeholder={t("groups.enterGroupName") || "Nombre del grupo"}
                            placeholderTextColor="#888"
                            value={groupName}
                            onChangeText={setGroupName}
                        />
                        <View className="flex-row gap-3">
                            <Pressable className="flex-1 rounded-2xl bg-muted p-4 items-center" onPress={() => setIsCreateOpen(false)}>
                                <Text className="font-semibold text-foreground">{t("groups.cancel") || "Cancelar"}</Text>
                            </Pressable>
                            <Pressable className="flex-1 rounded-2xl bg-primary p-4 items-center" onPress={handleCreateGroup}>
                                <Text className="font-semibold text-primary-foreground">{t("groups.createGroup") || "Crear"}</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* MODAL UNIRME A GRUPO */}
            <Modal visible={isJoinOpen} transparent animationType="slide" onRequestClose={() => setIsJoinOpen(false)}>
                <View className="flex-1 justify-center bg-black/60 p-5">
                    <View className="rounded-3xl bg-card p-6 gap-4">
                        <Text className="text-xl font-bold text-card-foreground">
                            {t("groups.joinGroup") || "Unirme a Grupo"}
                        </Text>
                        <TextInput
                            className="rounded-2xl border border-border bg-muted p-4 text-foreground"
                            placeholder={t("groups.enterCode") || "Código o link de invitación"}
                            placeholderTextColor="#888"
                            value={joinCode}
                            onChangeText={setJoinCode}
                            autoCapitalize="characters"
                        />
                        <View className="flex-row gap-3">
                            <Pressable className="flex-1 rounded-2xl bg-muted p-4 items-center" onPress={() => setIsJoinOpen(false)}>
                                <Text className="font-semibold text-foreground">{t("groups.cancel") || "Cancelar"}</Text>
                            </Pressable>
                            <Pressable className="flex-1 rounded-2xl bg-primary p-4 items-center" onPress={handleJoinGroup}>
                                <Text className="font-semibold text-primary-foreground">{t("groups.joinGroup") || "Unirme"}</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default ListHeroCard;