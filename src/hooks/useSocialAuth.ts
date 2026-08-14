import { useOAuth } from "@clerk/expo";
import { useState } from "react";
import { Alert } from "react-native";

export default function useSocialAuth() {
    const [loadingStrategy, setLoadingStrategy] = useState<string | null>(null);
    const { startOAuthFlow: startGoogleFlow } = useOAuth({ strategy: "oauth_google" });
    const { startOAuthFlow: startGithubFlow } = useOAuth({ strategy: "oauth_github" });

    const handleSocialAuth = async (strategy: "oauth_oauth_google" | "oauth_github" | string) => {
        if (loadingStrategy) return;
        setLoadingStrategy(strategy);

        try {
            const startFlow = strategy === "oauth_google" ? startGoogleFlow : startGithubFlow;
            
            // Ejecutamos el flujo sin parámetros forzados para que Clerk use su manejador nativo
            const { createdSessionId, setActive } = await startFlow();

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