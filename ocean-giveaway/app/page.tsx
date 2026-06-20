import Link from "next/link";
import { WaveBackground } from "@/components/ocean/WaveBackground";
import { RedeemForm } from "@/components/ocean/RedeemForm";
import { TurtleIcon } from "@/components/ocean/icons";

export default function HomePage() {
  return (
    <main className="relative flex min-h-screen flex-col items-center px-4 py-12 sm:py-16">
      <WaveBackground />

      <header className="mb-8 max-w-md text-center sm:mb-10">
        <div className="mb-3 flex justify-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-white ring-1 ring-white/25">
            <TurtleIcon size={30} />
          </span>
        </div>
        <h1 className="font-display text-3xl font-bold text-white sm:text-4xl">
          Ocean&apos;s Day Giveaway 🌊🐢
        </h1>
        <p className="mt-2 text-sm text-ocean-foam/90 sm:text-base">
          Thank you for supporting Ocean&apos;s Day!
        </p>
      </header>

      <RedeemForm />

      <footer className="mt-12 text-center">
        <Link
          href="/admin/login"
          className="rounded-full border border-white/20 px-4 py-1.5 text-xs font-medium text-white/70 transition hover:border-white/40 hover:bg-white/10 hover:text-white"
        >
          Admin log in
        </Link>
      </footer>
    </main>
  );
}
