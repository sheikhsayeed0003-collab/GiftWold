import { NextResponse } from "next/server";
import { getGiftBySlug } from "@/lib/gifts/repository";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const gift = await getGiftBySlug(id);
  if (!gift) {
    return NextResponse.json({ error: "গিফট খুঁজে পাওয়া যায়নি" }, { status: 404 });
  }
  return NextResponse.json(gift);
}
