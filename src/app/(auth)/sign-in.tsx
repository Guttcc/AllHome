import useSocialAuth from "@/hooks/useSocialAuth";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignInScreen() {
    const {hadleSocialAuth, loadingStrategy}=useSocialAuth()

    return (
        <SafeAreaView className="flex-1 bg-primary dark:bg-secondary">
            <Text> HEY EVERYONE </Text>
        </SafeAreaView>
    );
}