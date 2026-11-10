# Gift World

৩D ডিজিটাল গিফট তৈরি, পাবলিশ ও শেয়ার — Next.js 16, Prisma (SQLite), React Three Fiber।

## শুরু

```bash
npm install
cp .env.example .env   # আগে না থাকলে
npx prisma migrate dev
npm run db:seed
npm run dev
```

- হোম: `/`
- এডিটর: `/create`
- Owner অ্যাডমিন: `/admin` (সিড থেকে owner অ্যাকাউন্ট)

### Owner লগইন (ডিফল্ট সিড)

- ইমেইল: `OWNER_EMAIL` (.env)
- পাসওয়ার্ড: `OWNER_PASSWORD` (.env)

## বর্তমান অবস্থা (ফেজ)

| ধাপ | স্ট্যাটাস |
|-----|---------|
| ১. হোমপেজ + অ্যাকাউন্ট + DB | ✅ |
| ২. ফ্রি/প্রিমিয়াম + WhatsApp অর্ডার | ✅ (ম্যানুয়াল প্রিমিয়াম গ্রান্ট) |
| ৩. 3D এডিটর (R3F হিরো + প্রিভিউ) | ✅ বেসিক |
| ৪. ভিডিও/গান আপলোড লাইব্রেরি | 🔜 |
| ৫. পাবলিশ + QR + শেয়ার | ✅ |
| ৬. WhatsApp অর্ডার | ✅ |
| ৭. Owner ড্যাশবোর্ড | ✅ বেসিক |
| ৮. মোবাইল পলিশ + টেস্ট | চলমান |

পুরনো JSON গিফট (`data/gifts/`) এখনও `/g/[id]` এ ফলব্যাক হিসেবে কাজ করে।

## স্ক্রিপ্ট

- `npm run db:migrate` — মাইগ্রেশন
- `npm run db:seed` — প্যাকেজ + owner
- `npm run db:studio` — Prisma Studio
