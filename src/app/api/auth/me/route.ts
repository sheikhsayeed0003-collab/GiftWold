import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/current-user";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ user: null });
  return NextResponse.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      plan: user.plan
        ? {
            slug: user.plan.slug,
            name: user.plan.name,
            nameBn: user.plan.nameBn,
            isFree: user.plan.isFree,
          }
        : null,
      planExpiresAt: user.planExpiresAt,
    },
  });
}
