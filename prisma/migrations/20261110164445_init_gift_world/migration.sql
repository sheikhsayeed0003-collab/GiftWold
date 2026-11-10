-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "planId" TEXT,
    "planExpiresAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "User_planId_fkey" FOREIGN KEY ("planId") REFERENCES "PackagePlan" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PackagePlan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameBn" TEXT,
    "priceUsd" REAL NOT NULL DEFAULT 0,
    "durationDays" INTEGER NOT NULL DEFAULT 0,
    "features" TEXT NOT NULL DEFAULT '[]',
    "featureListBn" TEXT NOT NULL DEFAULT '[]',
    "isPremium" BOOLEAN NOT NULL DEFAULT true,
    "isFree" BOOLEAN NOT NULL DEFAULT false,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Gift" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "userId" TEXT,
    "config" TEXT NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Gift_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SiteSettings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT DEFAULT 1,
    "siteName" TEXT NOT NULL DEFAULT 'Gift World',
    "whatsappNumber" TEXT NOT NULL DEFAULT '8801302003306',
    "freeGiftsLimit" INTEGER NOT NULL DEFAULT 1,
    "freePublishLimit" INTEGER NOT NULL DEFAULT 1,
    "freeTemplateSlugs" TEXT NOT NULL DEFAULT '["classic","ribbon"]',
    "freeEffectSlugs" TEXT NOT NULL DEFAULT '["none","confetti"]',
    "maxRegistrationsPerDevice" INTEGER NOT NULL DEFAULT 3,
    "registrationWindowHours" INTEGER NOT NULL DEFAULT 168,
    "homepageTaglineBn" TEXT NOT NULL DEFAULT 'নিজের মতো করে 3D গিফট বক্স বানান',
    "homepageHeroBn" TEXT NOT NULL DEFAULT 'ছবি, গান, ভিডিও ও সারপ্রাইজ — এক লিংকে শেয়ার করুন',
    "contactEmail" TEXT NOT NULL DEFAULT 'hello@giftworld.local',
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "DeviceRegistrationLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "deviceHash" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "DeviceRegistrationLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AdminPermission" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "canManageUsers" BOOLEAN NOT NULL DEFAULT false,
    "canManagePackages" BOOLEAN NOT NULL DEFAULT false,
    "canManageGifts" BOOLEAN NOT NULL DEFAULT true,
    "canManageTemplates" BOOLEAN NOT NULL DEFAULT true,
    "canManageSettings" BOOLEAN NOT NULL DEFAULT false,
    "canManageHomepage" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "PackagePlan_slug_key" ON "PackagePlan"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Gift_slug_key" ON "Gift"("slug");

-- CreateIndex
CREATE INDEX "DeviceRegistrationLog_deviceHash_createdAt_idx" ON "DeviceRegistrationLog"("deviceHash", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "AdminPermission_userId_key" ON "AdminPermission"("userId");
