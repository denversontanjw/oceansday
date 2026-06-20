"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TurtleIcon } from "@/components/ocean/icons";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (res.ok) {
        router.push("/admin");
        router.refresh();
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Incorrect username or password.");
      }
    } catch {
      setError("System temporarily unavailable. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-ocean-900 via-ocean-700 to-ocean-500 px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-2xl">
        <div className="mb-5 flex justify-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-ocean-foam text-ocean-700">
            <TurtleIcon size={26} />
          </span>
        </div>
        <h1 className="text-center font-display text-xl font-bold text-ocean-deep">SWB Committee Login</h1>
        <p className="mt-1 text-center text-sm text-slate-500">Ocean&apos;s Day Giveaway admin</p>

        <label htmlFor="username" className="mt-6 block text-sm font-medium text-slate-700">
          Username
        </label>
        <input
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
          className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-base outline-none focus:border-ocean-500 focus:ring-2 focus:ring-ocean-300"
        />

        <label htmlFor="password" className="mt-4 block text-sm font-medium text-slate-700">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-base outline-none focus:border-ocean-500 focus:ring-2 focus:ring-ocean-300"
        />

        {error && (
          <p className="mt-3 text-sm font-medium text-coral" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-xl bg-ocean-700 px-4 py-3 font-semibold text-white transition hover:bg-ocean-900 disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </main>
  );
}
