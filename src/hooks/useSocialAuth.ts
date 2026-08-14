import { useSSO } from "@clerk/expo";
import * as WebBrowser from "expo-web-browser";
import { useState } from "react";
import { Alert } from "react-native";

WebBrowser.maybeCompleteAuthSession();

export default function useSocialAuth() {
    const [loadingStrategy, setLoadingStrategy] = useState<string | null>(null);
    const { startSSOFlow } = useSSO();

    const handleSocialAuth = async (strategy: "oauth_google" | "oauth_github" | string) => {
        if (loadingStrategy) return;
        setLoadingStrategy(strategy);

        try {
            const { createdSessionId, setActive } = await startSSOFlow({ strategy: strategy as any });

            if (createdSessionId && setActive) {
                await setActive({ session: createdSessionId });
            }
        } catch (error) {
            console.error("Auth error:", error);
            Alert.alert("Error", "No se pudo completar la autenticación.");
        } finally {
            setLoadingStrategy(null);
        }
    };

    return { handleSocialAuth, loadingStrategy };
}
