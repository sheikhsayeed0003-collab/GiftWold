import { nanoid } from "nanoid";
import type { GiftConfig } from "@/types/gift";

export type InspirationCategory = "tech" | "lifestyle" | "kitchen";

export type GiftInspiration = {
  id: string;
  category: InspirationCategory;
  categoryLabel: string;
  emoji: string;
  name: string;
  nameEn: string;
  hook: string;
  description: string;
  apply: () => Omit<GiftConfig, "id" | "createdAt">;
};

const personalFields = (): Pick<
  GiftConfig,
  "recipientName" | "senderName" | "musicUrl" | "coverImage"
> => ({
  recipientName: "",
  senderName: "",
  musicUrl: "",
  coverImage: "",
});

export const INSPIRATION_CATEGORIES: Record<
  InspirationCategory,
  { label: string; subtitle: string }
> = {
  tech: {
    label: "গ্যাজেট ও ডেস্ক",
    subtitle: "Premium & functional tech",
  },
  lifestyle: {
    label: "দৈনন্দিন লাইফস্টাইল",
    subtitle: "Clever daily utility",
  },
  kitchen: {
    label: "কিচেন ও ফুড টুলস",
    subtitle: "Unconventional utility",
  },
};

export const GIFT_INSPIRATIONS: GiftInspiration[] = [
  {
    id: "ember-mug",
    category: "tech",
    categoryLabel: "গ্যাজেট",
    emoji: "☕",
    name: "স্মার্ট থার্মাল মগ",
    nameEn: "Ember Mug 2",
    hook: "ঠান্ডা কফির দিন শেষ — অ্যাপ দিয়ে ১৩৫°F এ ৮০ মিনিট গরম",
    description:
      "আপাতদৃষ্টিতে সাধারণ কফি মগ, কিন্তু মোবাইল অ্যাপে সঠিক তাপমাত্রায় চা/কফি ধরে রাখে। ডেস্কে কাজ করলে চরম সারপ্রাইজড হবে।",
    apply: () => ({
      ...personalFields(),
      title: "তোমার ডেস্কে এক চুমুক গরম চা",
      backgroundColor: "#0f172a",
      boxStyle: "minimal",
      fontFamily: "inter",
      effect: "none",
      boxes: [
        {
          id: nanoid(6),
          label: "১",
          message: "ডেস্কে কফি ঠান্ডা হয়ে যায়? আমি লক্ষ্য করেছিলাম…",
        },
        {
          id: nanoid(6),
          label: "২",
          message:
            "Ember Mug 2 — অ্যাপে ঠিক তোমার পছন্দের ডিগ্রিতে, ৮০ মিনিট পর্যন্ত গরম।",
        },
        {
          id: nanoid(6),
          label: "৩",
          message: "পরের চুমুকটা ঠান্ডা নয় — চিন্তা নিয়ে না থেকে কাজ করো।",
        },
      ],
    }),
  },
  {
    id: "word-clock",
    category: "tech",
    categoryLabel: "গ্যাজেট",
    emoji: "🕐",
    name: "LED ওয়ার্ড ক্লক",
    nameEn: "Word Clock",
    hook: '"IT IS FIVE MINUTES PAST TEN" — সংখ্যা নয়, শব্দে সময়',
    description:
      "সংখ্যাহীন ডিজিটাল ঘড়ি; ইংরেজি লেখায় সময় বলে। অফিস টেবিলে লাক্সারি আর্ট ফিল।",
    apply: () => ({
      ...personalFields(),
      title: "সময় এখন শুধু সংখ্যা নয়",
      backgroundColor: "#1a0a2e",
      boxStyle: "neon",
      fontFamily: "playfair",
      effect: "both",
      boxes: [
        {
          id: nanoid(6),
          label: "IT",
          message: "তোমার টেবিলে এমন কিছু দরকার যা চোখ ধরে রাখে।",
        },
        {
          id: nanoid(6),
          label: "IS",
          message: "LED Word Clock — শব্দে সময়: মিনিট, পাস্ট, টুইলভ…",
        },
        {
          id: nanoid(6),
          label: "GIFT",
          message: "লাক্সারি ডেস্ক আর্ট — তোমার স্পেসের জন্য।",
        },
      ],
    }),
  },
  {
    id: "volume-knob",
    category: "tech",
    categoryLabel: "গ্যাজেট",
    emoji: "🎛️",
    name: "ওয়্যারলেস ভলিউম নব",
    nameEn: "Volume Knob",
    hook: "মেটালিক নব — PC থেকে গান, ভলিউম, প্লে/পজ",
    description:
      "ডেস্কের প্রিমিয়াম ঘূর্ণন নব; মিউজিক ও পিসি সেটআপ প্রেমীদের জন্য আদর্শ সারপ্রাইজ।",
    apply: () => ({
      ...personalFields(),
      title: "তোমার সাউন্ড, তোমার নব",
      backgroundColor: "#2d1b4e",
      boxStyle: "minimal",
      fontFamily: "noto-bengali",
      effect: "confetti",
      boxes: [
        { id: nanoid(6), label: "♫", message: "মিউজিক ছাড়া তোমার ডেস্ক incomplete…" },
        {
          id: nanoid(6),
          label: "○",
          message: "Wireless Volume Knob — মেটাল ফিনিশ, ঘুরিয়েই ভলিউম ও প্লে/পজ।",
        },
        {
          id: nanoid(6),
          label: "✦",
          message: "নেক্সট ট্র্যাকটা এই নব দিয়ে শুরু করো।",
        },
      ],
    }),
  },
  {
    id: "towel-warmer",
    category: "lifestyle",
    categoryLabel: "লাইফস্টাইল",
    emoji: "🧺",
    name: "বাকেট টাউয়েল ওয়ার্মার",
    nameEn: "Towel Warmer",
    hook: "গোসলের পর স্পা-লেভেল গরম তোয়ালে",
    description:
      "প্রিমিয়াম বাকেটে তোয়ালে/মোজা গরম করো। শীতে বা এসিতে চমকে দেওয়ার মতো আরাম।",
    apply: () => ({
      ...personalFields(),
      title: "গোসলের পর এক স্পা মুহূর্ত",
      backgroundColor: "#3b1530",
      boxStyle: "ribbon",
      fontFamily: "noto-bengali",
      effect: "hearts",
      boxes: [
        { id: nanoid(6), label: "১", message: "শীত বা ঠান্ডা এসি — তোমার জন্য একটু চিন্তা…" },
        {
          id: nanoid(6),
          label: "২",
          message: "Bucket Towel Warmer — বাটন চাপো, গরম তোয়ালে বের করো।",
        },
        {
          id: nanoid(6),
          label: "৩",
          message: "নিজেকে ছোট্ট একটা স্পা ডে উপহার দিই।",
        },
      ],
    }),
  },
  {
    id: "solo-stove",
    category: "lifestyle",
    categoryLabel: "লাইফস্টাইল",
    emoji: "🔥",
    name: "স্মোকলেস টেবিলটপ ফায়ার পিট",
    nameEn: "Solo Stove Mesa",
    hook: "বারান্দায় ধোঁয়া ছাড়াই প্রিমিয়াম আগুন",
    description:
      "স্টেইনলেস মিনি ফায়ার পিট; বারবিকিউ বা উইন্টার ভাইব — ঘরেই বারান্দা ম্যাজিক।",
    apply: () => ({
      ...personalFields(),
      title: "বারান্দায় মৃদু আলো, শূন্য ধোঁয়া",
      backgroundColor: "#0d2818",
      boxStyle: "classic",
      fontFamily: "dancing",
      effect: "both",
      boxes: [
        { id: nanoid(6), label: "🔥", message: "শীতের সন্ধ্যা বারান্দায় কিছু উষ্ণ দরকার…" },
        {
          id: nanoid(6),
          label: "✦",
          message: "Solo Stove Mesa — স্মোকলেস ফ্লেম, প্রিমিয়াম স্টিল লুক।",
        },
        {
          id: nanoid(6),
          label: "♨",
          message: "BBQ, চা, আড্ডা — এই শীতে তোমার কোণে।",
        },
      ],
    }),
  },
  {
    id: "pizza-axe",
    category: "kitchen",
    categoryLabel: "কিচেন",
    emoji: "🍕",
    name: "ভারী পিৎজা কুড়াল",
    nameEn: "Pizza Axe",
    hook: "ভাইকিং কুড়াল লুক — পিৎজা কাটা থ্রিলিং",
    description:
      "মেটাল ব্লেড, কাঠের হ্যান্ডেল; সাধারণ কাটার নয়, অভিজ্ঞতাই উপহার।",
    apply: () => ({
      ...personalFields(),
      title: "পিৎজা রাতটা একটু এপিক",
      backgroundColor: "#2d1b4e",
      boxStyle: "neon",
      fontFamily: "playfair",
      effect: "confetti",
      boxes: [
        { id: nanoid(6), label: "⚔", message: "সাধারণ রোলার কাটার? বোরিং…" },
        {
          id: nanoid(6),
          label: "🍕",
          message: "Heavy-Duty Pizza Axe — ধারালো, প্রিমিয়াম, থ্রিলিং কাট।",
        },
        {
          id: nanoid(6),
          label: "✓",
          message: "পরের স্লাইস তোমার হাতে — লিজেন্ডারি স্টাইলে।",
        },
      ],
    }),
  },
  {
    id: "popcorn-bowl",
    category: "kitchen",
    categoryLabel: "কিচেন",
    emoji: "🍿",
    name: "ছাকনি যুক্ত পপকর্ন বাটি",
    nameEn: "Kernel Sifter Bowl",
    hook: "না-ফোটা দানা নিচে, শুধু পারফেক্ট বাইট",
    description:
      "সিরামিক/কাঠের বাটির নিচে কোলেন্ডার — মুভি নাইটে দাঁতে শক্ত দানার ভয় নেই।",
    apply: () => ({
      ...personalFields(),
      title: "মুভি নাইট, পারফেক্ট পপকর্ন",
      backgroundColor: "#1a0a2e",
      boxStyle: "ribbon",
      fontFamily: "noto-bengali",
      effect: "confetti",
      boxes: [
        { id: nanoid(6), label: "🎬", message: "পপকর্ন খেতে গিয়ে শক্ত দানা? আর না।" },
        {
          id: nanoid(6),
          label: "🍿",
          message: "Kernel Sifter Bowl — নিচের ছাকনিতে দানা ঝরে, উপরে শুধু মাখা।",
        },
        {
          id: nanoid(6),
          label: "❤",
          message: "পরের মুভি নাইট আমাদের — এই বাটি হাতে।",
        },
      ],
    }),
  },
];
