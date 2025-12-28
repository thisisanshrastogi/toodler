"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { LogoBlocks } from "@/components/logo-blocks";

const buttonColors = [
  "bg-pink-400",
  "bg-yellow-400",
  "bg-orange-400",
  "bg-green-400",
  "bg-blue-400",
  "bg-purple-400",
  "bg-cyan-400",
];

function getRandomColor() {
  return buttonColors[Math.floor(Math.random() * buttonColors.length)];
}

import { useEffect, useState } from "react";

export default function LandingPage() {
  const [randomColor, setRandomColor] = useState(buttonColors[0]);

  useEffect(() => {
    setRandomColor(getRandomColor());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 relative font-[Comic_Neue] text-black flex items-center justify-center">
      {/* Font + Grid */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Comic+Neue:wght@400;700&display=swap');
        .notebook-bg {
          background-color: #f1f5f9;
          background-image:
            linear-gradient(#e2e8f0 2px, transparent 2px),
            linear-gradient(90deg, #e2e8f0 2px, transparent 2px);
          background-size: 40px 40px;
        }
      `}</style>

      <div className="fixed inset-0 notebook-bg opacity-70 pointer-events-none" />

      <main className="relative z-10 max-w-md w-full px-6 text-center space-y-10">
        {/* Animated Logo */}
        <div className="flex justify-center ">
          <LogoBlocks size="sm" />
        </div>

        {/* Tagline */}
        <div className="space-y-3">
          {/* <h1 className="text-4xl font-black tracking-tight">Toodler</h1> */}
          <p className="text-lg font-medium text-gray-700">
            Your homework, neatly in one place.
          </p>
        </div>

        {/* Primary CTA */}
        <Link
          href="/homework"
          className={`
            block
            ${randomColor} text-white
            border-4 border-black
            rounded-2xl
            py-4
            text-2xl font-black
            shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]
            active:translate-y-1
            active:shadow-none
            transition
          `}
        >
          <span className="flex items-center justify-center gap-3">
            See Today’s Homework
            <ArrowRight size={24} />
          </span>
        </Link>

        {/* Helper text */}
        <p className="text-sm font-semibold text-gray-500">No login required</p>
      </main>
    </div>
  );
}
