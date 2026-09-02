import crypto from "crypto";

export async function POST(request: Request) {
    try {
        const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
        const apiKey = process.env.CLOUDINARY_API_KEY;
        const apiSecret = process.env.CLOUDINARY_API_SECRET;

        if (!cloudName || !apiKey || !apiSecret) {
            return Response.json({ error: "Cloudinary no está configurado en el servidor." }, { status: 500 });
        }

        const body = await request.json();
        const { imageBase64 } = body;

        if (!imageBase64 || typeof imageBase64 !== "string") {
            return Response.json({ error: "No se recibió ninguna imagen." }, { status: 400 });
        }

        const timestamp = Math.floor(Date.now() / 1000);

        const signature = crypto
            .createHash("sha1")
            .update(`timestamp=${timestamp}${apiSecret}`)
            .digest("hex");

        const form = new URLSearchParams();
        form.append("file", imageBase64); 
        form.append("timestamp", String(timestamp));
        form.append("api_key", apiKey);
        form.append("signature", signature);
        form.append("folder", "allhome-items");

        const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: form.toString(),
        });

        const uploadData = await uploadRes.json();

        if (!uploadRes.ok) {
            console.error("Cloudinary upload error:", uploadData);
            return Response.json({ error: "Error al subir la imagen." }, { status: 500 });
        }

        return Response.json({ url: uploadData.secure_url as string });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to upload image";
        return Response.json({ error: message }, { status: 500 });
    }
}