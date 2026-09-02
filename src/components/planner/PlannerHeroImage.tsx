import { useLanguage } from "@/lib/i18n";
import { FontAwesome6 } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { ActivityIndicator, Alert, Image, Pressable, View } from "react-native";

type PlannerHeroImageProps = {
    imageUri: string | null;
    onImagePicked: (url: string | null) => void;
};

const PlannerHeroImage = ({ imageUri, onImagePicked }: PlannerHeroImageProps) => {
    const { t } = useLanguage();
    const [uploading, setUploading] = useState(false);

    const hasImage = !!imageUri;

    const pickImage = async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
            Alert.alert(
                t("planner.imagePermissionTitle") || "Permiso necesario",
                t("planner.imagePermissionDesc") || "Necesitamos acceso a tu galería para subir una foto."
            );
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            quality: 0.6,
            base64: true,
            allowsEditing: true,
            aspect: [16, 9],
        });

        if (result.canceled || !result.assets?.[0]?.base64) return;

        const asset = result.assets[0];
        const mimeType = asset.mimeType ?? "image/jpeg";
        const dataUri = `data:${mimeType};base64,${asset.base64}`;

        setUploading(true);
        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ imageBase64: dataUri }),
            });

            if (!res.ok) throw new Error("Upload failed");

            const data = await res.json();
            onImagePicked(data.url as string);
        } catch (err) {
            console.error("Error uploading image:", err);
            Alert.alert(
                t("planner.imageUploadErrorTitle") || "No se pudo subir la imagen",
                t("planner.imageUploadErrorDesc") || "Inténtalo de nuevo en unos segundos."
            );
        } finally {
            setUploading(false);
        }
    };

    const removeImage = () => onImagePicked(null);

    return (
        <Pressable
            onPress={pickImage}
            disabled={uploading}
            className="overflow-hidden rounded-[30px] border border-border bg-card"
        >
            <View>
                <Image
                    source={hasImage ? { uri: imageUri! } : require("../../../assets/images/hero.png")}
                    className="h-56 w-full"
                    resizeMode="cover"
                />

                {/* Gradientes para legibilidad, siempre presentes */}
                <LinearGradient
                    pointerEvents="none"
                    colors={["rgba(0,0,0,0.4)", "transparent"]}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                    style={{ position: "absolute", top: 0, left: 0, right: 0, height: 72 }}
                />
                <LinearGradient
                    pointerEvents="none"
                    colors={["transparent", "rgba(0,0,0,0.4)"]}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                    style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 72 }}
                />

                {/* Overlay opaco + botón "+" solo cuando NO hay imagen elegida */}
                {!hasImage && (
                    <View
                        pointerEvents="none"
                        className="absolute inset-0 items-center justify-center bg-black/40"
                    >
                        {uploading ? (
                            <ActivityIndicator color="#ffffff" size="large" />
                        ) : (
                            <View className="h-14 w-14 items-center justify-center rounded-full bg-white/25 border-2 border-white/70">
                                <FontAwesome6 name="plus" size={22} color="#ffffff" />
                            </View>
                        )}
                    </View>
                )}

                {/* Loader cuando SÍ hay imagen pero está subiendo otra */}
                {hasImage && uploading && (
                    <View
                        pointerEvents="none"
                        className="absolute inset-0 items-center justify-center bg-black/30"
                    >
                        <ActivityIndicator color="#ffffff" size="large" />
                    </View>
                )}

                {/* Botón para quitar la imagen elegida y volver a la imagen por defecto */}
                {hasImage && !uploading && (
                    <Pressable
                        onPress={removeImage}
                        hitSlop={8}
                        className="absolute right-3 top-3 h-8 w-8 items-center justify-center rounded-full bg-black/50"
                    >
                        <FontAwesome6 name="xmark" size={14} color="#ffffff" />
                    </Pressable>
                )}
            </View>
        </Pressable>
    );
};

export default PlannerHeroImage;