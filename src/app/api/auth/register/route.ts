import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/auth/password";
import { createSessionToken, setSessionCookie } from "@/lib/auth/session";
import { hashDeviceId } from "@/lib/device";

const schema = z
  .object({
    name: z.string().min(2).max(80),
    email: z.string().email().optional().or(z.literal("")),
    phone: z.string().min(6).max(20).optional().or(z.literal("")),
    password: z.string().min(8).max(100),
    deviceId: z.string().min(8).max(128),
  })
  .refine((d) => (d.email && d.email.length > 0) || (d.phone && d.phone.length > 0), {
    message: "ইমেইল অথবা ফোন নম্বর প্রয়োজন",
  });

export async function POST(request: Request) {
  try {
    const body = schema.parse(await request.json());
    const settings = await prisma.siteSettings.findFirst({ where: { id: 1 } });
    if (!settings) {
      return NextResponse.json({ error: "সেটিংস লোড হয়নি" }, { status: 500 });
    }

    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      request.headers.get("x-real-ip");
    const deviceHash = hashDeviceId(body.deviceId, ip);

    const since = new Date(
      Date.now() - settings.registrationWindowHours * 60 * 60 * 1000
    );
    const recentOnDevice = await prisma.deviceRegistrationLog.count({
      where: { deviceHash, createdAt: { gte: since } },
    });
    if (recentOnDevice >= settings.maxRegistrationsPerDevice) {
      return NextResponse.json(
        {
          error:
            "এই ডিভাইস থেকে সাইনআপ সীমা পূর্ণ হয়েছে। সাপোর্টের সাথে যোগাযোগ করুন।",
        },
        { status: 429 }
      );
    }

    const email = body.email?.trim() || null;
    const phone = body.phone?.trim() || null;

    if (email) {
      const exists = await prisma.user.findUnique({ where: { email } });
      if (exists) {
        return NextResponse.json({ error: "ইমেইল ইতিমধ্যে ব্যবহারে" }, { status: 409 });
      }
    }
    if (phone) {
      const exists = await prisma.user.findUnique({ where: { phone } });
      if (exists) {
        return NextResponse.json({ error: "ফোন নম্বর ইতিমধ্যে ব্যবহারে" }, { status: 409 });
      }
    }

    const freePlan = await prisma.packagePlan.findUnique({ where: { slug: "free" } });
    if (!freePlan) {
      return NextResponse.json({ error: "ফ্রি প্যাকেজ সেটআপ নেই" }, { status: 500 });
    }

    const user = await prisma.user.create({
      data: {
        name: body.name.trim(),
        email,
        phone,
        passwordHash: await hashPassword(body.password),
        planId: freePlan.id,
      },
    });

    await prisma.deviceRegistrationLog.create({
      data: { deviceHash, userId: user.id },
    });

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
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json(
        { error: e.issues[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "রেজিস্ট্রেশন ব্যর্থ" }, { status: 500 });
  }
}
