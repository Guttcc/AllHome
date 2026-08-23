import ThemeToggle from "@/components/insights/ThemeToggle";
import { FontAwesome } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import useSocialAuth from "../../hooks/useSocialAuth";
import { useLanguage } from "../../lib/i18n";

export default function SignInScreen() {
    const { handleSocialAuth, loadingStrategy } = useSocialAuth();
    const { t, changeLanguage, locale } = useLanguage();

    const isGoogleClicked = loadingStrategy === "oauth_google";
    const isGitHubClicked = loadingStrategy === "oauth_github";
    const isLoading = isGitHubClicked || isGoogleClicked;

    const toggleLanguage = () => {
        const nextLang = locale.startsWith("es") ? "en" : "es";
        changeLanguage(nextLang);
    };

    return (
        <SafeAreaView className="flex-1 bg-primary dark:bg-secondary" edges={["top"]}>
            <View className="absolute -left-16 top-12 h-56 w-56 rounded-full bg-primary/80 dark:bg-background/40" />
            <View className="absolute right-[-74px] top-40px h-72 w-72 rounded-full bg-primary/70 dark:bg-background/35" />

            <View className="items-end gap-2 px-6 pt-2 z-10">
                <Pressable
                    onPress={toggleLanguage}
                    className="flex-row items-center rounded-full border border-white/20 bg-white/10 px-3 py-1.5 active:opacity-80"
                >
                    <FontAwesome name="globe" size={14} color="#fff" />
                    <Text className="ml-2 text-xs font-bold uppercase text-primary-foreground dark:text-foreground">
                        {locale.startsWith("es") ? "ES" : "EN"}
                    </Text>
                </Pressable>

                <ThemeToggle />
            </View>

            <View className="px-6 pt-2">
                <Text className="front-mono text-center text-5xl font-extrabold uppercase tracking-tight text-primary-foreground dark:text-foreground">
                    All Home 
                </Text>

                <Text className="mt-1 text-center text-[14px] text-primary-foreground/80 dark:text-foreground/75">
                    {t("auth.tagline")}
                </Text>

                <View className="mt-6 rounded-[30px] border border-white/20 bg-white/10 p-3">
                    <Image
                        source={require("../../../assets/images/auth.png")}
                        style={{ width: "100%", height: 300 }}
                        contentFit="contain"
                    />
                </View>
            </View>

            <View className="mt-8 flex-1 rounded-t-[36px] bg-card2 px-6 pb-8 pt-6">
                <View className="self-center rounded-full bg-secondary px-3 py-1">
                    <Text className="text-xs font-semibold uppercase tracking-[1px] text-secondary-foreground">
                        {t("auth.welcomeBack")}
                    </Text>
                </View>

                <Text className="mt-2 text-center text-sm leading-6 text-muted-foreground">
                    {t("auth.description")}
                </Text>

                <View className="mt-6">
                    <Pressable
                        className={`mb-3 h-14 flex-row items-center rounded-2xl border border-border bg-card3 px-4 active:opacity-90 ${
                            isLoading ? "opacity-70" : ""
                        }`}
                        disabled={isLoading}
                        onPress={() => handleSocialAuth("oauth_google")}
                    >
                        <View className="h-8 w-8 items-center justify-center rounded-full bg-white">
                            <Image
                                source={require("../../../assets/images/google.png")}
                                style={{ width: 20, height: 20 }}
                            />
                        </View>

                        <Text className="ml-3 flex-1 text-lg font-semibold text-card-foreground">
                            {isGoogleClicked ? t("auth.connectingGoogle") : t("auth.continueGoogle")}
                        </Text>

                        <FontAwesome name="angle-right" size={18} color="#5f6e66" />
                    </Pressable>

                    <Pressable
                        className={`mb-3 h-14 flex-row items-center rounded-2xl border border-border bg-card3 px-4 active:opacity-90 ${
                            isLoading ? "opacity-70" : ""
                        }`}
                        disabled={isLoading}
                        onPress={() => handleSocialAuth("oauth_github")}
                    >
                        <View className="h-8 w-8 items-center justify-center rounded-full bg-white">
                            <FontAwesome name="github" size={24} color="#111" />
                        </View>
                        
                        <Text className="ml-3 flex-1 text-lg font-semibold text-card-foreground">
                            {isGitHubClicked ? t("auth.connectingGithub") : t("auth.continueGithub")}
                        </Text>
                        <FontAwesome name="angle-right" size={18} color="#5f6e66" />
                    </Pressable>
                </View>
            </View>
        </SafeAreaView>
    );
}