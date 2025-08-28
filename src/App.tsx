// App.tsx
import React from "react";
import Roadmap from "./components/Roadmap";
import ViewportBadge from "./ViewportBadge";

const YEARS = ["2023", "2024", "2025"] as const;

export default function App() {
  return (
    <div className="min-h-dvh bg-white text-zinc-900">
      <ViewportBadge />

      <header className="px-4 pt-10 -mb-50 text-center">
        <div className="mx-auto h-[72px] w-[72px] sm:h-[88px] sm:w-[88px]">
          <img
            src="/logo.png"
            alt="DRX"
            className="h-full w-full object-contain"
            decoding="async"
          />
        </div>

        <h1 className="text-3xl font-extrabold leading-tight sm:text-4xl">DRX</h1>
        <h1 className="text-3xl font-extrabold leading-tight sm:text-5xl">ROADMAP</h1>

        <select
          aria-label="year"
          className="mt-3 inline-flex rounded-lg border border-zinc-300 bg-white px-3 py-1 text-sm shadow-sm"
          defaultValue="2024"
        >
          {YEARS.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </header>

      <main className="mx-auto max-w-[1100px] px-4 py-8 sm:px-6 lg:px-8">
        <Roadmap />
      </main>
    </div>
  );
}
