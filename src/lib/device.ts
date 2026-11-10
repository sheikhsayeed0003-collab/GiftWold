import { createHash } from "crypto";

export function hashDeviceId(deviceId: string, ip?: string | null) {
  const salt = process.env.SESSION_SECRET ?? "gw";
  return createHash("sha256").update(`${salt}:${deviceId}:${ip ?? ""}`).digest("hex");
}
