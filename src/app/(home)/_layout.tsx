import { useAuth } from '@clerk/expo';
import { Stack, useRouter } from 'expo-router';
import { useEffect } from 'react';

export default function HomeLayout() {
    const { isSignedIn, isLoaded } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (isLoaded && !isSignedIn) {
        router.replace('/(auth)/sign-in');
        }
    }, [isLoaded, isSignedIn]);

    if (!isLoaded) return null;

    return <Stack screenOptions={{ headerShown: false }} />;
}