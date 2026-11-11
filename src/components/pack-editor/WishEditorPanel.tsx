"use client";

import { usePackEditor } from "@/context/PackEditorContext";
import type { GiftExperienceMode, WishVisualTemplate } from "@/types/gift-pack";
import { defaultWishExperience } from "@/lib/gift-pack/defaults";

const input =
  "w-full rounded-lg border border-white/10 bg-black/40 px-2 py-1.5 text-xs text-white";

export function WishEditorPanel() {
  const { project, patchProject } = usePackEditor();
  const wish = { ...defaultWishExperience(), ...project.wishExperience };
  const mode: GiftExperienceMode = project.experienceMode ?? "pack3d";

  const patchWish = (partial: Partial<typeof wish>) => {
    patchProject({ wishExperience: { ...wish, ...partial } });
  };

  return (
    <section className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
      <h3 className="text-xs font-semibold uppercase text-white/50">Wish Gift Box (ভিডিও স্টাইল)</h3>
      <label className="mt-2 block text-[10px] text-white/45">অভিজ্ঞতা মোড</label>
      <select
        className={input}
        value={mode}
        onChange={(e) =>
          patchProject({
            experienceMode: e.target.value as GiftExperienceMode,
            wishExperience: {
              ...wish,
              enabled: e.target.value !== "pack3d" ? true : wish.enabled,
            },
          })
        }
      >
        <option value="pack3d">শুধু ৩ডি + টিভি প্যাক</option>
        <option value="wish">শুধু Wish (ট্যাপ টু ওপেন)</option>
        <option value="both">Wish তারপর ৩ডি প্যাক</option>
      </select>

      {mode !== "pack3d" ? (
        <>
          <label className="mt-2 block text-[10px] text-white/45">ভিজ্যুয়াল টেমপ্লেট</label>
          <select
            className={input}
            value={wish.template}
            onChange={(e) => patchWish({ template: e.target.value as WishVisualTemplate })}
          >
            <option value="night">Night (তারার আকাশ)</option>
            <option value="tree">Tree (আলোকিত গাছ)</option>
            <option value="matrix">Matrix (অক্ষর বৃষ্টি)</option>
            <option value="poem">Poem (ম্যাট্রিক্স + মেসেজ)</option>
          </select>

          <label className="mt-2 block text-[10px] text-white/45">ট্যাপ হিন্ট</label>
          <input
            className={input}
            value={wish.tapHint}
            onChange={(e) => patchWish({ tapHint: e.target.value })}
          />
          <label className="mt-2 block text-[10px] text-white/45">হেডলাইন</label>
          <input
            className={input}
            value={wish.headline}
            onChange={(e) => patchWish({ headline: e.target.value })}
          />
          <label className="mt-2 block text-[10px] text-white/45">অভিবাদন ({`{name}`})</label>
          <input
            className={input}
            value={wish.greeting}
            onChange={(e) => patchWish({ greeting: e.target.value })}
          />
          <label className="mt-2 block text-[10px] text-white/45">বার্তা</label>
          <textarea
            className={input + " min-h-[88px] resize-y"}
            value={wish.message}
            onChange={(e) => patchWish({ message: e.target.value })}
          />
          <label className="mt-2 block text-[10px] text-white/45">স্বাক্ষর ({`{sender}`}, {`{br}`})</label>
          <textarea
            className={input + " min-h-[56px] resize-y"}
            value={wish.signOff}
            onChange={(e) => patchWish({ signOff: e.target.value })}
          />
          <label className="mt-2 block text-[10px] text-white/45">কাউন্টার লেবেল</label>
          <input
            className={input}
            value={wish.counterLabel}
            onChange={(e) => patchWish({ counterLabel: e.target.value })}
          />
          <label className="mt-2 block text-[10px] text-white/45">কাউন্টার শুরুর তারিখ</label>
          <input
            type="date"
            className={input}
            value={wish.counterStart?.slice(0, 10) ?? ""}
            onChange={(e) =>
              patchWish({
                counterStart: e.target.value ? new Date(e.target.value).toISOString() : undefined,
              })
            }
          />
          <label className="mt-2 block text-[10px] text-white/45">সংগীত URL (খালি = গ্লোবাল অডিও)</label>
          <input
            className={input}
            value={wish.musicSrc ?? ""}
            onChange={(e) => patchWish({ musicSrc: e.target.value })}
            placeholder="https://..."
          />
          <label className="mt-2 block text-[10px] text-white/45">লিংক পাসওয়ার্ড (ঐচ্ছিক)</label>
          <input
            className={input}
            value={wish.linkPassword ?? ""}
            onChange={(e) => patchWish({ linkPassword: e.target.value })}
          />
          <label className="mt-2 flex items-center gap-2 text-[10px] text-white/55">
            <input
              type="checkbox"
              checked={wish.showSoundToggle}
              onChange={(e) => patchWish({ showSoundToggle: e.target.checked })}
            />
            শব্দ টগল বাটন দেখান
          </label>
        </>
      ) : (
        <label className="mt-3 flex items-center gap-2 text-[10px] text-white/55">
          <input
            type="checkbox"
            checked={wish.enabled}
            onChange={(e) => patchWish({ enabled: e.target.checked })}
          />
            ৩ডি প্যাকের আগে Wish স্ক্রীন চালু করুন
        </label>
      )}
    </section>
  );
}
