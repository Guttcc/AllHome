import { db } from "@/lib/server/db/client";
import { groupMembers, groups } from "@/lib/server/db/schema";
import { and, eq } from "drizzle-orm";

function getUserIdFromRequest(request: Request): string | null {
    const authHeader = request.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
        return authHeader.split(" ")[1];
    }
    return request.headers.get("x-user-id") || null;
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { code, userId: bodyUserId } = body;

        const userId = getUserIdFromRequest(request) || bodyUserId;

        if (!userId) {
            return Response.json({ error: "No autorizado: falta identificación de usuario" }, { status: 401 });
        }

        if (!code || typeof code !== "string") {
            return Response.json({ error: "El código de grupo es requerido" }, { status: 400 });
        }

        const cleanCode = code.trim().toUpperCase();

        const [targetGroup] = await db
            .select()
            .from(groups)
            .where(eq(groups.code, cleanCode));

        if (!targetGroup) {
            return Response.json({ error: "No se encontró ningún grupo con ese código" }, { status: 404 });
        }

        const existingMember = await db
            .select()
            .from(groupMembers)
            .where(
                and(
                    eq(groupMembers.groupId, targetGroup.id),
                    eq(groupMembers.userId, userId)
                )
            );

        // 3. Si no es miembro, lo agregamos
        if (existingMember.length === 0) {
            await db.insert(groupMembers).values({
                id: crypto.randomUUID(),
                groupId: targetGroup.id,
                userId: userId,
                role: "member",
                joinedAt: Date.now(),
            });
        }

        return Response.json({
            id: targetGroup.id,
            name: targetGroup.name,
            code: targetGroup.code,
        });
    } catch (error) {
        console.error("Error joining group:", error);
        return Response.json({ error: "Error interno del servidor" }, { status: 500 });
    }
}