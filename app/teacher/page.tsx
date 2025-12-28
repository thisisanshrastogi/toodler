"use client";

import { useEffect, useState } from "react";
import {
  BookOpen,
  Calculator,
  Palette,
  Smile,
  Pencil,
  Trash2,
  Plus,
} from "lucide-react";
import Link from "next/link";

import { db } from "@/lib/firebase";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  deleteDoc,
  doc,
} from "firebase/firestore";

/* ---------- TYPES ---------- */

type Homework = {
  id: string;
  date: string;
  subject: string;
  color: string;
  description: string;
  images: string[];
};

/* ---------- SUBJECT ICON ---------- */

const subjectIcon = (subject: string) => {
  switch (subject) {
    case "Math":
      return <Calculator size={20} strokeWidth={2.5} />;
    case "English":
      return <BookOpen size={20} strokeWidth={2.5} />;
    case "Art":
      return <Palette size={20} strokeWidth={2.5} />;
    default:
      return <Smile size={20} strokeWidth={2.5} />;
  }
};

/* ---------- PAGE ---------- */

export default function TeacherDashboardPage() {
  const [homeworks, setHomeworks] = useState<Homework[]>([]);
  const [loading, setLoading] = useState(true);

  /* ---------- FETCH HOMEWORKS ---------- */

  useEffect(() => {
    const q = query(collection(db, "homeworks"), orderBy("date", "desc"));

    const unsub = onSnapshot(q, (snap) => {
      const data: Homework[] = snap.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Homework, "id">),
      }));
      setHomeworks(data);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  /* ---------- DELETE ---------- */

  const handleDelete = async (id: string) => {
    const ok = confirm("Delete this homework?");
    if (!ok) return;

    await deleteDoc(doc(db, "homeworks", id));
  };

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
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-black">Teacher Dashboard 🧑‍🏫</h1>

          <Link
            href="/teacher/upload"
            className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg font-bold border-4 border-black shadow"
          >
            <Plus size={18} />
            New
          </Link>
        </div>

        {/* Content */}
        {loading ? (
          <p className="font-bold text-gray-600">Loading…</p>
        ) : homeworks.length === 0 ? (
          <p className="font-bold text-gray-600">No homework posted yet.</p>
        ) : (
          <div className="space-y-4">
            {homeworks.map((hw) => (
              <div
                key={hw.id}
                className="bg-white border-4 border-black rounded-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
              >
                {/* Subject Row */}
                <div
                  className={`${hw.color} border-b-4 border-black px-4 py-3 flex items-center justify-between`}
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-white/70 border-2 border-black rounded-full p-2">
                      {subjectIcon(hw.subject)}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-black text-lg leading-none">
                        {hw.subject}
                      </span>
                      <span className="text-xs font-bold">
                        {new Date(hw.date).toDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <Link
                      href={`/teacher/edit/${hw.id}`}
                      className="bg-white border-2 border-black rounded-lg p-2"
                    >
                      <Pencil size={16} />
                    </Link>

                    <button
                      onClick={() => handleDelete(hw.id)}
                      className="bg-red-400 border-2 border-black rounded-lg p-2"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Description */}
                <div className="p-4">
                  <p className="font-medium text-gray-800 line-clamp-2">
                    {hw.description}
                  </p>
                  <p className="text-xs font-bold text-gray-500 mt-2">
                    {hw.images.length} image(s)
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
