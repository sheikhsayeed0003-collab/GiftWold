import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { nanoid } from "nanoid";
import { put } from "@vercel/blob";

const VIDEO_MIME = /^video\//i;
const IMAGE_MIME = /^image\//i;
const AUDIO_MIME = /^audio\//i;

export function mediaKind(mime: string, filename: string): "image" | "video" | "audio" | "other" {
  if (IMAGE_MIME.test(mime)) return "image";
  if (VIDEO_MIME.test(mime)) return "video";
  if (AUDIO_MIME.test(mime)) return "audio";
  const ext = path.extname(filename).toLowerCase();
  if ([".mp4", ".webm", ".mov", ".mkv"].includes(ext)) return "video";
  if ([".jpg", ".jpeg", ".png", ".gif", ".webp", ".avif"].includes(ext)) return "image";
  if ([".mp3", ".wav", ".ogg", ".webm"].includes(ext)) return "audio";
  return "other";
}

export async function persistUserUpload(
  userId: string,
  file: File
): Promise<{ url: string; storage: "blob" | "local" }> {
  const ext = path.extname(file.name).slice(0, 16) || ".bin";
  const safeName = `${nanoid(12)}${ext}`;
  const key = `gift-world/${userId}/${safeName}`;

  const onVercel = process.env.VERCEL === "1";

  if (onVercel && !process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error("BLOB_READ_WRITE_TOKEN missing on Vercel — Blob store লিংক করুন");
  }

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(key, file, {
      access: "public",
      addRandomSuffix: false,
      contentType: file.type || undefined,
    });
    return { url: blob.url, storage: "blob" };
  }

  const dir = path.join(process.cwd(), "public", "uploads", userId);
  await mkdir(dir, { recursive: true });
  const buf = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(dir, safeName), buf);
  return { url: `/uploads/${userId}/${safeName}`, storage: "local" };
}
