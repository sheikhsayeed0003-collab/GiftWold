import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/current-user";
import { saveGiftToDb } from "@/lib/gifts/repository";
import { isGiftPackProject } from "@/types/gift-pack";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "লগইন প্রয়োজন" }, { status: 401 });
  }
  const body = await request.json();
  if (!isGiftPackProject(body)) {
    return NextResponse.json({ error: "অবৈধ প্রজেক্ট" }, { status: 400 });
  }
  const id = await saveGiftToDb(body, { userId: user.id, published: false });
  return NextResponse.json({ id, draft: true });
}
