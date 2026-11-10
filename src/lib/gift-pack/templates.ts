import type { GiftPackProject } from "@/types/gift-pack";
import { createPackNode, defaultPackProject } from "./defaults";

export type PackTemplate = {
  id: string;
  nameBn: string;
  description: string;
  build: () => GiftPackProject;
};

export const PACK_TEMPLATES: PackTemplate[] = [
  {
    id: "romantic-pack",
    nameBn: "রোমান্টিক সারপ্রাইজ",
    description: "৩টি নেস্টেড বক্স + হার্ট ইফেক্ট",
    build: () => {
      const p = defaultPackProject();
      p.title = "তোমার জন্য ভালোবাসা";
      p.backgroundColor = "#3b1530";
      const root = createPackNode("romantic", 0);
      root.children = [createPackNode("heart", 1), createPackNode("luxury", 2)];
      root.layers[0].data = {
        ...(root.layers[0].data as import("@/types/gift-pack").TextLayerData),
        content: "প্রথমটি খোলো…",
        animation: "heart_text",
      };
      p.roots = [root];
      return p;
    },
  },
  {
    id: "birthday-pack",
    nameBn: "জন্মদিন প্যাক",
    description: "কনফেটি ও ফানি বক্স",
    build: () => {
      const p = defaultPackProject();
      p.title = "শুভ জন্মদিন!";
      const a = createPackNode("birthday", 0);
      const b = createPackNode("funny", 1);
      a.childOrder = "sequential";
      a.children = [b];
      p.roots = [a];
      return p;
    },
  },
  {
    id: "multi-5",
    nameBn: "৫টি আলাদা বক্স",
    description: "একই স্তরে ৫টি গিফট",
    build: () => {
      const p = defaultPackProject();
      p.roots = Array.from({ length: 5 }, (_, i) => createPackNode("classic", i));
      return p;
    },
  },
];
