import { db } from "@/lib/server/db/client";
import { groupMembers, groups } from "@/lib/server/db/schema";
import { eq } from "drizzle-orm";

function getUserIdFromRequest(request: Request): string | null {
    const authHeader = request.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
        return authHeader.split(" ")[1];
    }
    return request.headers.get("x-user-id") || null;
}

export async function GET(request: Request) {
    try {
        const userId = getUserIdFromRequest(request);

        if (!userId) {
            return Response.json([]);
        }

        const userGroups = await db
            .select({
                id: groups.id,
                name: groups.name,
                code: groups.code,
            })
            .from(groups)
            .innerJoin(groupMembers, eq(groups.id, groupMembers.groupId))
            .where(eq(groupMembers.userId, userId));

        return Response.json(userGroups);
    } catch (error) {
        console.error("Error fetching groups:", error);
        return Response.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, userId: bodyUserId } = body;

        const userId = getUserIdFromRequest(request) || bodyUserId;

        if (!userId) {
            return Response.json({ error: "Unauthorized: Missing user identification" }, { status: 401 });
        }

        if (!name || typeof name !== "string") {
            return Response.json({ error: "Group name is required" }, { status: 400 });
        }

        const groupId = crypto.randomUUID();
        const memberId = crypto.randomUUID();
        const inviteCode = crypto.randomUUID().replace(/-/g, "").substring(0, 6).toUpperCase();
        const now = Date.now();

        // Operación atómica con transacción
        const newGroup = await db.transaction(async (tx) => {
            const [insertedGroup] = await tx
                .insert(groups)
                .values({
                    id: groupId,
                    name: name.trim(),
                    code: inviteCode,
                    createdById: userId,
                    createdAt: now,
                })
                .returning();

            await tx.insert(groupMembers).values({
                id: memberId,
                groupId: insertedGroup.id,
                userId: userId,
                role: "owner",
                joinedAt: now,
            });

            return insertedGroup;
        });

        return Response.json(newGroup, { status: 201 });
    } catch (error) {
        console.error("Error creating group:", error);
        return Response.json({ error: "Internal Server Error" }, { status: 500 });
    }
}