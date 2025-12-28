"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  BookOpen,
  Calculator,
  Palette,
  Smile,
  ChevronRight,
} from "lucide-react";

import { db } from "@/lib/firebase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import Loader from "@/components/loader";

/* ---------- TYPES ---------- */

type Homework = {
  id: string;
  date: string;
  subject: string;
  color: string;
  description: string;
};

/* ---------- SUBJECT ICON ---------- */

const subjectIcon = (subject: string) => {
  switch (subject) {
    case "Math":
      return <Calculator size={22} strokeWidth={2.5} />;
    case "English":
      return <BookOpen size={22} strokeWidth={2.5} />;
    case "Art":
      return <Palette size={22} strokeWidth={2.5} />;
    default:
      return <Smile size={22} strokeWidth={2.5} />;
  }
};

/* ---------- PAGE ---------- */

export default function HomeworkListPage() {
  const [homeworks, setHomeworks] = useState<Homework[]>([]);
  const [loading, setLoading] = useState(true);

  /* ---------- FETCH FROM FIRESTORE ---------- */

  useEffect(() => {
    const q = query(collection(db, "homeworks"), orderBy("date", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: Homework[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Homework, "id">),
      }));

      setHomeworks(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 relative font-[Comic_Neue] text-black">
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

      <main className="relative z-10 max-w-xl mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <h1 className="text-3xl font-black">Homework </h1>

        {/* Content */}
        {loading ? (
          <div className="flex h-full justify-center items-center">
            <Loader />
          </div>
        ) : homeworks.length === 0 ? (
          <p className="font-bold text-gray-600">No homework posted yet.</p>
        ) : (
          <div className="space-y-5">
            {homeworks.map((hw) => (
              <Link key={hw.id} href={`/homework/${hw.id}`} className="block">
                <div
                  className="
                    bg-white border-4 border-black rounded-xl
                    shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]
                    transition-all
                    hover:-translate-y-1
                  "
                >
                  {/* Subject Strip */}
                  <div
                    className={`${hw.color} border-b-4 border-black px-4 py-3`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex gap-3">
                        {/* Icon */}
                        <div className="bg-white/70 border-2 border-black rounded-full p-2 shrink-0">
                          {subjectIcon(hw.subject)}
                        </div>

                        {/* Subject + Date */}
                        <div className="flex flex-col gap-1">
                          <span className="font-black text-lg leading-none">
                            {hw.subject}
                          </span>

                          <div className="flex gap-2">
                            <span className="bg-black text-white text-xs font-bold px-2 py-0.5 rounded-md border-2 border-black">
                              {new Date(hw.date).toLocaleDateString("en-US", {
                                weekday: "short",
                              })}
                            </span>
                            <span className="bg-white text-gray-800 text-xs font-bold px-2 py-0.5 rounded-md border-2 border-black">
                              {new Date(hw.date).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                          </div>
                        </div>
                      </div>

                      <ChevronRight size={22} />
                    </div>
                  </div>

                  {/* Description */}
                  <div className="p-4">
                    <p className="font-medium text-lg leading-snug text-gray-800 line-clamp-2">
                      {hw.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Footer */}

        <p className="text-center text-gray-500 font-semibold pt-6">
          Tap a homework to see details ✨
        </p>
      </main>
    </div>
  );
}
