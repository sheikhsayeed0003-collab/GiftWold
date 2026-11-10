import { UserRole } from "@prisma/client";
import { prisma } from "@/lib/db";
import { getSessionUserId } from "@/lib/auth/session";

export async function getCurrentUser() {
  const userId = await getSessionUserId();
  if (!userId) return null;
  return prisma.user.findUnique({
    where: { id: userId },
    include: { plan: true },
  });
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) throw new Error("UNAUTHORIZED");
  return user;
}

export function isOwnerOrAdmin(role: UserRole) {
  return role === UserRole.OWNER || role === UserRole.ADMIN;
}
