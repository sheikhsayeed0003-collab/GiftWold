-- AlterTable
ALTER TABLE "SiteSettings" ADD COLUMN "heroGiftBoxMessage" TEXT NOT NULL DEFAULT 'Welcome! You unlocked a secret surprise from Gift World ✨';
ALTER TABLE "SiteSettings" ADD COLUMN "heroGiftBoxMaxOpens" INTEGER NOT NULL DEFAULT 3;
