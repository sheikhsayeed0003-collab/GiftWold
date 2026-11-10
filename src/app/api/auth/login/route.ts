import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { verifyPassword } from "@/lib/auth/password";
import { createSessionToken, setSessionCookie } from "@/lib/auth/session";

const schema = z.object({
  identifier: z.string().min(3),
  password: z.string().min(8),
});

export async function POST(request: Request) {
  try {
    const body = schema.parse(await request.json());
    const id = body.identifier.trim();
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: id }, { phone: id }],
      },
    });
    if (!user || !(await verifyPassword(body.password, user.passwordHash))) {
      return NextResponse.json({ error: "ভুল তথ্য বা পাসওয়ার্ড" }, { status: 401 });
    }

    const token = await createSessionToken(user.id);
    await setSessionCookie(token);

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch {
    return NextResponse.json({ error: "লগইন ব্যর্থ" }, { status: 400 });
  }
}
