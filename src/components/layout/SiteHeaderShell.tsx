export function SiteHeaderShell() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#050308]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8">
        <span className="text-xl font-bold text-white/90">Gift World</span>
        <div className="h-9 w-24 animate-pulse rounded-xl bg-white/10" />
      </div>
    </header>
  );
}
