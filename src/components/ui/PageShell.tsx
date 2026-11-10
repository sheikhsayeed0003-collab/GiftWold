"use client";

import { AmbientBackground } from "./AmbientBackground";

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen">
      <AmbientBackground />
      {children}
    </div>
  );
}
