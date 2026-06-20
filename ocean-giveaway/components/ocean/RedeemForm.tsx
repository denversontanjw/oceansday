"use client";

import { useEffect, useRef, useState } from "react";
import { TurtleIcon, WaveIcon, iconForGift } from "./icons";

type ResultState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; gift: string }
  | { status: "already_collected" }
  | { status: "not_found" }
  | { status: "invalid"; message: string }
  | { status: "error"; message: string };

const PREFIX_PATTERN = /^[a-zA-Z0-9_]*$/;

export function RedeemForm() {
  const [prefix, setPrefix] = useState("");
  const [result, setResult] = useState<ResultState>({ status: "idle" });
  const submittingRef = useRef(false);
  const resultRef = useRef<HTMLDivElement>(null);

  const isLocked = result.status === "success";
  const isLoading = result.status === "loading";

  useEffect(() => {
    if (result.status !== "idle" && result.status !== "loading") {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [result.status]);

  function handlePrefixChange(value: string) {
    // Soft client-side guard: strip anything outside the allowed character
    // set as the person types, in addition to the hard validation on submit.
    if (PREFIX_PATTERN.test(value)) {
      setPrefix(value);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submittingRef.current || isLocked) return;

    const trimmed = prefix.trim();
    if (trimmed.length === 0) {
      setResult({ status: "invalid", message: "Please enter your email prefix." });
      return;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(trimmed)) {
      setResult({
        status: "invalid",
        message: "Invalid format. Please use only letters, numbers, or underscore (_).",
      });
      return;
    }

    submittingRef.current = true;
    setResult({ status: "loading" });

    try {
      const res = await fetch("/api/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prefix: trimmed }),
      });
      const data = await res.json();

      if (data.status === "success") {
        setResult({ status: "success", gift: data.gift });
      } else if (data.status === "already_collected") {
        setResult({ status: "already_collected" });
      } else if (data.status === "not_found") {
        setResult({ status: "not_found" });
      } else if (data.status === "invalid") {
        setResult({ status: "invalid", message: data.message });
      } else {
        setResult({ status: "error", message: data.message ?? "System temporarily unavailable. Please try again." });
      }
    } catch {
      setResult({ status: "error", message: "System temporarily unavailable. Please try again." });
    } finally {
      submittingRef.current = false;
    }
  }

  const GiftPic = result.status === "success" ? iconForGift(result.gift) : null;

  return (
    <div className="w-full max-w-md">
      <form onSubmit={handleSubmit} className="rounded-3xl bg-white/95 p-6 shadow-2xl shadow-ocean-deep/30 backdrop-blur sm:p-8">
        <label htmlFor="prefix" className="mb-2 block text-sm font-medium text-ocean-deep">
          Your email prefix
        </label>

        <div className="flex items-stretch overflow-hidden rounded-xl border border-slate-200 bg-slate-50 transition focus-within:border-ocean-500 focus-within:ring-2 focus-within:ring-ocean-300">
          <input
            id="prefix"
            name="prefix"
            type="text"
            inputMode="text"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            maxLength={64}
            placeholder="john_tan"
            value={prefix}
            disabled={isLocked || isLoading}
            onChange={(e) => handlePrefixChange(e.target.value)}
            className="min-w-0 flex-1 bg-transparent px-4 py-3.5 text-base text-slate-900 placeholder:text-slate-400 outline-none disabled:opacity-60"
          />
          <span className="flex select-none items-center whitespace-nowrap px-3 text-sm font-medium text-slate-400 sm:px-4">
            @acra.gov.sg
          </span>
        </div>

        <p className="mt-2 text-xs text-slate-500">
          Enter only your email prefix (e.g. john_tan)
        </p>

        {result.status === "invalid" && (
          <p className="mt-2 text-sm font-medium text-coral" role="alert">
            {result.message}
          </p>
        )}

        <button
          type="submit"
          disabled={isLoading || isLocked}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-ocean-700 px-4 py-3.5 text-base font-semibold text-white transition hover:bg-ocean-900 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {isLoading ? (
            <>
              <WaveIcon size={20} className="animate-pulse" />
              Checking...
            </>
          ) : isLocked ? (
            <>
              <TurtleIcon size={20} />
              Gift redeemed
            </>
          ) : (
            <>
              <TurtleIcon size={20} />
              Redeem my gift
            </>
          )}
        </button>
      </form>

      <div ref={resultRef} aria-live="polite" className="mt-5">
        {result.status === "success" && GiftPic && (
          <div className="animate-pop rounded-3xl bg-white p-6 text-center shadow-2xl shadow-ocean-deep/30 sm:p-8">
            <p className="text-2xl font-display font-bold text-ocean-deep">Your selected gift is:</p>

            <div className="mx-auto mt-4 flex w-fit items-center gap-3 rounded-2xl border-2 border-ocean-300 bg-ocean-foam px-6 py-4">
              <GiftPic size={36} className="text-ocean-700" />
              <span className="text-xl font-display font-bold text-ocean-deep">{result.gift}</span>
            </div>

            <p className="mt-5 text-sm font-medium text-slate-700">
              Please show this page to the SWB Committee to claim your gift.
            </p>
            <p className="mt-1 text-sm text-slate-500">Happy Ocean&apos;s Day 🌊🐢</p>
          </div>
        )}

        {result.status === "already_collected" && (
          <div className="animate-rise rounded-3xl bg-white p-6 text-center shadow-xl shadow-ocean-deep/20 sm:p-8">
            <p className="text-xl font-display font-bold text-ocean-deep">🎁 This gift has already been collected.</p>
            <p className="mt-2 text-sm text-slate-500">
              If you believe this is an error, please approach the SWB Committee.
            </p>
          </div>
        )}

        {result.status === "not_found" && (
          <div className="animate-rise rounded-3xl bg-white p-6 text-center shadow-xl shadow-ocean-deep/20 sm:p-8">
            <p className="text-xl font-display font-bold text-ocean-deep">
              Sorry, you did not participate in our Ocean&apos;s Day giveaway session. 🌊
            </p>
            <p className="mt-2 text-sm text-slate-500">
              If you believe this is an error, please approach the SWB Committee.
            </p>
          </div>
        )}

        {result.status === "error" && (
          <div className="animate-rise rounded-3xl bg-white p-6 text-center shadow-xl shadow-ocean-deep/20 sm:p-8">
            <p className="text-base font-semibold text-coral">{result.message}</p>
          </div>
        )}
      </div>
    </div>
  );
}
