ALTER TABLE "Gift" ADD COLUMN IF NOT EXISTS "recipientEmail" TEXT;
CREATE INDEX IF NOT EXISTS "Gift_recipientEmail_idx" ON "Gift"("recipientEmail");
