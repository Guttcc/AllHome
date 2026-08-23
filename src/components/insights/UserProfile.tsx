import ThemeToggle from "@/components/insights/ThemeToggle";
import { useLanguage } from "@/lib/i18n";
import { useClerk, useUser } from "@clerk/expo";
import { FontAwesome6 } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Pressable, Text, View } from "react-native";

const UserProfile = () => {
    const { signOut } = useClerk();
    const { user } = useUser();
    const { t, locale, toggleLanguage } = useLanguage();

    const email = user?.primaryEmailAddress?.emailAddress;
    const displayName = user?.fullName || email?.split("@")[0];

    return (
        <View className="rounded-3xl border border-border bg-card p-4">
            <View className="flex-row items-center gap-3">
                <View className="size-12 overflow-hidden rounded-full">
                    <Image source={{ uri: user?.imageUrl }} style={{ width: "100%", height: "100%" }} />
                </View>

                <View className="flex-1">
                    <Text className="text-xs uppercase tracking-[1px] text-muted-foreground">
                        {t("auth.signedInAs")}
                    </Text>
                    <Text className="mt-1 text-lg font-bold text-foreground">{displayName}</Text>
                    <Text className="text-sm text-muted-foreground">{email}</Text>
                </View>

                <View className="flex-row items-center gap-2">
                    <View className="items-center gap-2">
                        <ThemeToggle />
                        <Pressable
                            onPress={toggleLanguage}
                            className="h-9 px-3 flex-row items-center justify-center gap-1.5 rounded-xl border border-border bg-secondary"
                        >
                            <FontAwesome6 name="globe" size={12} color="#3b5a4a" />
                            <Text className="text-xs font-bold uppercase text-secondary-foreground">
                                {locale === "es" ? "ES" : "EN"}
                            </Text>
                        </Pressable>

                    </View>

                    <Pressable
                        onPress={() => signOut()}
                        className="h-9 w-9 items-center justify-center rounded-xl bg-destructive"
                    >
                        <FontAwesome6 name="right-from-bracket" size={13} color="#d45f58" />
                    </Pressable>
                </View>
            </View>
        </View>
    );
};

export default UserProfile;