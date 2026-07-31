import { useAuth } from "@clerk/expo"
import { AuthView } from "@clerk/expo/native"
import { useRouter } from "expo-router"
import { useEffect } from "react"

export default function SignInScreen() {
    const { isSignedIn } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (isSignedIn) {
            router.replace("/(home)")
        }
    }, [isSignedIn])

    return <AuthView mode="signInOrUp" />
}