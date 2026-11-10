"use client";

import clsx from "clsx";

export type MobileEditorTab = "studio" | "boxes" | "layers" | "timeline";

const TABS: { id: MobileEditorTab; label: string; icon: string }[] = [
  { id: "studio", label: "স্টুডিও", icon: "🎬" },
  { id: "boxes", label: "বক্স", icon: "🎁" },
  { id: "layers", label: "এডিট", icon: "✏️" },
  { id: "timeline", label: "টাইম", icon: "⏱" },
];

export function MobileEditorNav({
  active,
  onChange,
}: {
  active: MobileEditorTab;
  onChange: (tab: MobileEditorTab) => void;
}) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-[#0a0612]/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden"
      aria-label="এডিটর মেনু"
    >
      <ul className="mx-auto flex max-w-lg items-stretch justify-around gap-0 px-1 pt-1">
        {TABS.map((tab) => {
          const on = active === tab.id;
          return (
            <li key={tab.id} className="flex-1">
              <button
                type="button"
                onClick={() => onChange(tab.id)}
                className={clsx(
                  "flex w-full flex-col items-center justify-center gap-0.5 rounded-xl py-2.5 text-[10px] font-medium transition active:scale-95",
                  on ? "bg-violet-600/35 text-white" : "text-white/55"
                )}
              >
                <span className="text-lg leading-none" aria-hidden>
                  {tab.icon}
                </span>
                <span>{tab.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
