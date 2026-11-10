import { NextResponse } from "next/server";
import { listPublicGifts } from "@/lib/gifts/repository";

export async function GET() {
  const rows = await listPublicGifts(24);
  const gifts = rows
    .map((row) => {
      try {
        const config = JSON.parse(row.config) as { title?: string; recipientName?: string };
        return {
          slug: row.slug,
          title: config.title ?? "Gift",
          createdAt: row.createdAt,
        };
      } catch {
        return null;
      }
    })
    .filter(Boolean);
  return NextResponse.json({ gifts });
}
