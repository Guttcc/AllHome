import { getBudget, setBudget } from "@/lib/server/db-actions";

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const contextId = url.searchParams.get("contextId");

        if (!contextId) {
            return Response.json({ error: "contextId is required" }, { status: 400 });
        }

        const budget = await getBudget(contextId);
        return Response.json({ budget });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to fetch budget";
        return Response.json({ error: message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { contextId, amount } = body;

        if (!contextId || amount === undefined || amount === null) {
            return Response.json({ error: "contextId and amount are required" }, { status: 400 });
        }

        const numericAmount = Number(amount);
        if (Number.isNaN(numericAmount) || numericAmount < 0) {
            return Response.json({ error: "Invalid amount" }, { status: 400 });
        }

        const budget = await setBudget(contextId, numericAmount);
        return Response.json({ budget });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to save budget";
        return Response.json({ error: message }, { status: 500 });
    }
}