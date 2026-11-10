import { NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { nanoid } from "nanoid";
import { getCurrentUser } from "@/lib/auth/current-user";
import { userHasActivePremium } from "@/lib/plans/limits";

const MAX_FREE = 2 * 1024 * 1024;
const MAX_PREMIUM = 25 * 1024 * 1024;

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "লগইন প্রয়োজন" }, { status: 401 });
  }

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "ফাইল নেই" }, { status: 400 });
  }

  const premium = userHasActivePremium(user) || user.role === "OWNER";
  const max = premium ? MAX_PREMIUM : MAX_FREE;
  if (file.size > max) {
    return NextResponse.json(
      { error: premium ? "ফাইল খুব বড়" : "ফ্রি প্যাকেজে সর্বোচ্চ ২MB — প্রিমিয়াম নিন" },
      { status: 403 }
    );
  }

  const ext = path.extname(file.name).slice(0, 12) || ".bin";
  const safeName = `${nanoid(10)}${ext}`;
  const dir = path.join(process.cwd(), "public", "uploads", user.id);
  await mkdir(dir, { recursive: true });
  const buf = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(dir, safeName), buf);

  const url = `/uploads/${user.id}/${safeName}`;
  return NextResponse.json({ url });
}
