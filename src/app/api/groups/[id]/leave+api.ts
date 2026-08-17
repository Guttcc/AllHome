import { db } from "@/lib/server/db/client";
import { groupMembers } from "@/lib/server/db/schema";
import { and, eq } from "drizzle-orm";

function getUserIdFromRequest(request: Request): string | null {
    const authHeader = request.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
        return authHeader.split(" ")[1];
    }
    return request.headers.get("x-user-id") || null;
}

export async function POST(
    request: Request,
    { id }: { id?: string } = {}
) {
    try {
        const url = new URL(request.url);
        const pathSegments = url.pathname.split("/").filter(Boolean);

        const groupId = id || pathSegments[pathSegments.length - 2];

        let userId = getUserIdFromRequest(request);

        if (!userId) {
            try {
                const body = await request.json();
                userId = body.userId || null;
            } catch {
            }
        }

        if (!userId) {
            return Response.json(
                { error: "No autorizado: falta identificación de usuario" },
                { status: 401 }
            );
        }

        if (!groupId) {
            return Response.json(
                { error: "Se requiere el ID del grupo" },
                { status: 400 }
            );
        }

        await db
            .delete(groupMembers)
            .where(
                and(
                    eq(groupMembers.groupId, groupId),
                    eq(groupMembers.userId, userId)
                )
            );

        return Response.json({ success: true, groupId });
    } catch (error) {
        console.error("Error leaving group:", error);
        return Response.json({ error: "Error interno del servidor" }, { status: 500 });
    }
}