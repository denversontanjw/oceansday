"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { Participant } from "@/lib/constants";

type Stats = { total: number; collected: number };

const PAGE_SIZE = 50;

export function Dashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [rows, setRows] = useState<Participant[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [hasLoaded, setHasLoaded] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [bannerError, setBannerError] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [draft, setDraft] = useState<{ gift: string; collected: boolean; collected_at: string }>({
    gift: "",
    collected: false,
    collected_at: "",
  });
  const [saving, setSaving] = useState(false);

  const loadStats = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/stats");
      if (res.ok) setStats(await res.json());
    } catch {
      // surfaced via bannerError on the participants fetch instead
    }
  }, []);

  const loadRows = useCallback(async (currentPage: number, q: string) => {
    setRefreshing(true);
    setBannerError(null);
    try {
      const params = new URLSearchParams({ page: String(currentPage), pageSize: String(PAGE_SIZE) });
      if (q.trim()) params.set("q", q.trim());
      const res = await fetch(`/api/admin/participants?${params.toString()}`);
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setBannerError(data.error ?? "System temporarily unavailable. Please try again.");
        return;
      }
      const data = await res.json();
      setRows(data.rows);
      setTotal(data.total);
      setHasLoaded(true);
    } catch {
      setBannerError("System temporarily unavailable. Please try again.");
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const isFirstRun = useRef(true);
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      loadRows(page, search);
      return;
    }
    const t = setTimeout(() => loadRows(page, search), 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search]);

  function startEdit(row: Participant) {
    setEditingId(row.id);
    setDraft({
      gift: row.gift ?? "",
      collected: Boolean(row.collected),
      collected_at: row.collected_at ? row.collected_at.slice(0, 16) : "",
    });
  }

  function cancelEdit() {
    setEditingId(null);
  }

  async function saveEdit(id: number) {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/participants/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gift: draft.gift,
          collected: draft.collected,
          collected_at: draft.collected ? draft.collected_at || new Date().toISOString() : null,
        }),
      });
      if (res.ok) {
        const { row } = await res.json();
        setRows((prev) => prev.map((r) => (r.id === id ? row : r)));
        setEditingId(null);
        loadStats();
      } else {
        const data = await res.json().catch(() => ({}));
        setBannerError(data.error ?? "Could not save changes. Please try again.");
      }
    } catch {
      setBannerError("Could not save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  const percent = stats && stats.total > 0 ? Math.round((stats.collected / stats.total) * 100) : 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="font-display text-2xl font-bold text-ocean-deep">Ocean&apos;s Day Giveaway — Admin</h1>
          <button
            onClick={handleLogout}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
          >
            Log out
          </button>
        </div>

        {/* Stats card */}
        <div className="mt-6 rounded-2xl bg-gradient-to-br from-ocean-700 to-ocean-900 p-6 text-white shadow-lg">
          <p className="text-sm font-medium text-ocean-foam/80">🎁 Gift Collection Progress</p>
          {stats ? (
            <>
              <p className="mt-1 font-display text-3xl font-bold">
                {stats.collected} / {stats.total}{" "}
                <span className="text-xl font-semibold text-ocean-foam/90">({percent}%) collected</span>
              </p>
              <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-white/20">
                <div
                  className="h-full rounded-full bg-white transition-all"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </>
          ) : (
            <p className="mt-1 text-lg">Loading…</p>
          )}
        </div>

        {bannerError && (
          <div className="mt-4 rounded-xl bg-coral/10 px-4 py-3 text-sm font-medium text-coral" role="alert">
            {bannerError}
          </div>
        )}

        {/* Controls */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex w-full max-w-sm items-center gap-2">
            <input
              value={search}
              onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
              }}
              placeholder="Search by email prefix or full email"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-ocean-500 focus:ring-2 focus:ring-ocean-300"
            />
            {refreshing && <span className="shrink-0 text-xs text-slate-400">Updating…</span>}
          </div>
          <a
            href="/api/admin/export"
            className="rounded-xl bg-ocean-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-ocean-900"
          >
            Download CSV
          </a>
        </div>

        {/* Table */}
        <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Gift</th>
                <th className="px-4 py-3">Collected</th>
                <th className="px-4 py-3">Collected at</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {!hasLoaded ? (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-slate-400">
                    Loading…
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-slate-400">
                    No participants found.
                  </td>
                </tr>
              ) : (
                rows.map((row) => {
                  const isEditing = editingId === row.id;
                  return (
                    <tr key={row.id} className="align-middle">
                      <td className="px-4 py-3 font-medium text-slate-800">{row.email}</td>
                      <td className="px-4 py-3">
                        {isEditing ? (
                          <input
                            value={draft.gift}
                            onChange={(e) => setDraft((d) => ({ ...d, gift: e.target.value }))}
                            className="w-full rounded-lg border border-slate-200 px-2 py-1.5 outline-none focus:border-ocean-500"
                          />
                        ) : (
                          row.gift ?? "—"
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {isEditing ? (
                          <input
                            type="checkbox"
                            checked={draft.collected}
                            onChange={(e) => setDraft((d) => ({ ...d, collected: e.target.checked }))}
                            className="h-4 w-4"
                          />
                        ) : row.collected ? (
                          <span className="rounded-full bg-seagrass/10 px-2.5 py-1 text-xs font-semibold text-seagrass">Yes</span>
                        ) : (
                          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500">No</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-slate-500">
                        {isEditing ? (
                          <input
                            type="datetime-local"
                            value={draft.collected_at}
                            onChange={(e) => setDraft((d) => ({ ...d, collected_at: e.target.value }))}
                            className="rounded-lg border border-slate-200 px-2 py-1.5 outline-none focus:border-ocean-500"
                          />
                        ) : row.collected_at ? (
                          row.collected_at.replace("T", " ").slice(0, 19)
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {isEditing ? (
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => saveEdit(row.id)}
                              disabled={saving}
                              className="rounded-lg bg-ocean-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-ocean-900 disabled:opacity-60"
                            >
                              Save
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-50"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => startEdit(row)}
                            className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-ocean-700 hover:bg-ocean-foam"
                          >
                            Edit
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500">
          <span>
            Page {page} of {totalPages} · {total} total
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-medium disabled:opacity-40"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-medium disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
