"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getOrCreateDeviceId } from "@/lib/client-device";

type Mode = "login" | "register";

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const fd = new FormData(e.currentTarget);

    try {
      if (mode === "register") {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: fd.get("name"),
            email: fd.get("email"),
            phone: fd.get("phone"),
            password: fd.get("password"),
            deviceId: getOrCreateDeviceId(),
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed");
      } else {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            identifier: fd.get("identifier"),
            password: fd.get("password"),
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed");
      }
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "ত্রুটি");
    } finally {
      setLoading(false);
    }
  }

  const input =
    "w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white placeholder:text-white/35 focus:border-rose-400/50 focus:outline-none focus:ring-2 focus:ring-rose-400/20";

  return (
    <form onSubmit={onSubmit} className="glass-panel gradient-border space-y-4 rounded-3xl p-8">
      <h1 className="font-bengali text-2xl font-bold text-white">
        {mode === "register" ? "অ্যাকাউন্ট খুলুন" : "লগইন"}
      </h1>
      <p className="text-sm text-white/50">
        Gift World — ফ্রি প্যাকেজ অটো সক্রিয় হয়
      </p>

      {mode === "register" ? (
        <>
          <input name="name" required placeholder="নাম" className={input} />
          <input name="email" type="email" placeholder="ইমেইল (ঐচ্ছিক)" className={input} />
          <input name="phone" placeholder="ফোন (ঐচ্ছিক)" className={input} />
          <p className="text-xs text-white/40">ইমেইল অথবা ফোন — অন্তত একটি দিন</p>
        </>
      ) : (
        <input
          name="identifier"
          required
          placeholder="ইমেইল বা ফোন"
          className={input}
        />
      )}

      <input
        name="password"
        type="password"
        required
        minLength={8}
        placeholder="পাসওয়ার্ড (৮+ অক্ষর)"
        className={input}
      />

      {error && <p className="text-sm text-rose-300">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-gradient-to-r from-rose-500 to-violet-600 py-3 text-sm font-semibold text-white disabled:opacity-60"
      >
        {loading ? "অপেক্ষা..." : mode === "register" ? "রেজিস্টার" : "লগইন"}
      </button>

      <p className="text-center text-sm text-white/50">
        {mode === "register" ? (
          <>
            আগে থেকে অ্যাকাউন্ট?{" "}
            <Link href="/login" className="text-rose-300 underline">
              লগইন
            </Link>
          </>
        ) : (
          <>
            নতুন?{" "}
            <Link href="/register" className="text-rose-300 underline">
              অ্যাকাউন্ট খুলুন
            </Link>
          </>
        )}
      </p>
    </form>
  );
}
