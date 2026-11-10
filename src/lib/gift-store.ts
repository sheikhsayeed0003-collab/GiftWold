import { promises as fs } from "fs";
import path from "path";
import type { GiftConfig } from "@/types/gift";

const DATA_DIR = path.join(process.cwd(), "data", "gifts");

export async function saveGift(gift: GiftConfig): Promise<GiftConfig> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const filePath = path.join(DATA_DIR, `${gift.id}.json`);
  await fs.writeFile(filePath, JSON.stringify(gift, null, 2), "utf-8");
  return gift;
}

export async function getGift(id: string): Promise<GiftConfig | null> {
  try {
    const filePath = path.join(DATA_DIR, `${id}.json`);
    const raw = await fs.readFile(filePath, "utf-8");
    return JSON.parse(raw) as GiftConfig;
  } catch {
    return null;
  }
}
