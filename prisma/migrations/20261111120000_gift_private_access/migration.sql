-- AlterTable
ALTER TABLE "Gift" ADD COLUMN "recipientEmail" TEXT;
CREATE INDEX "Gift_recipientEmail_idx" ON "Gift"("recipientEmail");
