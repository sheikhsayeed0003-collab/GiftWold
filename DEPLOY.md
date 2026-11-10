# Gift World — Vercel Deploy

## Live

- Production: https://gefty.vercel.app
- GitHub: https://github.com/sheikhsayeed0003-collab/GiftWold

## ১. Postgres (Neon — বিনামূল্যে)

1. [Vercel Dashboard](https://vercel.com) → **Storage** → **Neon** (অথবা [neon.tech](https://neon.tech))
2. `DATABASE_URL` কপি করুন (`postgresql://...?sslmode=require`)

## ২. Vercel Environment Variables

Project: **gefty** → Settings → Environment Variables (Production):

| Key | Value |
|-----|--------|
| `DATABASE_URL` | Neon connection string |
| `SESSION_SECRET` | দীর্ঘ র‍্যান্ডম স্ট্রিং (৩২+ বাইট) |
| `OWNER_EMAIL` | owner email |
| `OWNER_PASSWORD` | owner প্রাথমিক পাসওয়ার্ড |

তারপর **Redeploy** (Deployments → … → Redeploy).

বিল্ডে `prisma migrate deploy` ও `db:seed` চালানোর জন্য একবার Vercel Shell বা লোকাল থেকে:

```bash
DATABASE_URL="..." npx prisma db seed
```

## ৩. Git auto-deploy

`chebengwaemma` Vercel অ্যাকাউন্টে `GiftWold` রিপো লিংক করতে GitHub-এ **write/admin** দরকার, অথবা `sheikhsayeed0003-collab` অ্যাকাউন্টে Vercel ইম্পোর্ট করুন।

## ৪. Uploads

`public/uploads` Vercel-এ স্থায়ী নয়। প্রোডাকশনে **Vercel Blob** যোগ করা ভালো (পরবর্তী ধাপ)।
