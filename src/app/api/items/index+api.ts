import { createGroceryItem, listGroceryItems } from "@/lib/server/db-actions";

export async function GET() {
    try {
        const items = await listGroceryItems();

        return Response.json({ items });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to fetch items";

        return Response.json({ error: message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, category, quantity, priority } = body;

        if (!name || !category || !priority) {
        return Response.json({ error: "Please provide all required fields." }, { status: 400 });
        }

        const item = await createGroceryItem({ name, category, quantity, priority });

        return Response.json({ item }, { status: 201 });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to create item";
        return Response.json({ error: message }, { status: 500 });
    }
}