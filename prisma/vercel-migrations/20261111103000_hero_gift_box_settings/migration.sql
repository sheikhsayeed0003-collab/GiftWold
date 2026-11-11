ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "heroGiftBoxMessage" TEXT NOT NULL DEFAULT 'Welcome! You unlocked a secret surprise from Gift World ✨';
ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "heroGiftBoxMaxOpens" INTEGER NOT NULL DEFAULT 3;
