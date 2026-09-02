import { createGroceryItem, listGroceryItems } from "@/lib/server/db-actions";

export async function GET(request: Request) {
    try {
        const userId = request.headers.get("x-user-id") ?? undefined;
        const items = await listGroceryItems(userId);

        return Response.json({ items: items || [] });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to fetch items";
        return Response.json({ error: message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const userId = request.headers.get("x-user-id") ?? undefined;
        const body = await request.json();
        const { name, category, quantity, priority, price, imageUri, groupId } = body;

        // category ya no es obligatoria: solo name y priority lo son
        if (!name || !priority) {
            return Response.json({ error: "Please provide all required fields." }, { status: 400 });
        }

        const item = await createGroceryItem({
            name,
            category: category ?? null,
            quantity,
            priority,
            price: price !== undefined && price !== null && price !== "" ? Number(price) : null,
            imageUri: imageUri ?? null,
            groupId: groupId ?? null,
            userId,
        });

        return Response.json({ item }, { status: 201 });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to create item";
        return Response.json({ error: message }, { status: 500 });
    }
}