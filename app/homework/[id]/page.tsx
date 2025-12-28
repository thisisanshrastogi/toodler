"use client";

import {
  BookOpen,
  Calculator,
  Palette,
  Smile,
  ChevronLeft,
  X,
  Download,
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import Loader from "@/components/loader";

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
      return <Calculator size={26} strokeWidth={2.5} />;
    case "English":
      return <BookOpen size={26} strokeWidth={2.5} />;
    case "Art":
      return <Palette size={26} strokeWidth={2.5} />;
    default:
      return <Smile size={26} strokeWidth={2.5} />;
  }
};

export default function HomeworkDetailPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const [homework, setHomework] = useState<Homework | null>(null);
  const [loading, setLoading] = useState(true);

  const [viewerIndex, setViewerIndex] = useState<number | null>(null);

  /* ---------- LOAD HOMEWORK ---------- */

  useEffect(() => {
    const loadHomework = async () => {
      try {
        const ref = doc(db, "homeworks", id);
        const snap = await getDoc(ref);

        if (!snap.exists()) {
          alert("Homework not found");
          router.push("/homework");
          return;
        }

        setHomework({
          id: snap.id,
          ...(snap.data() as Omit<Homework, "id">),
        });
      } catch (err) {
        console.error(err);
        alert("Failed to load homework");
      } finally {
        setLoading(false);
      }
    };

    loadHomework();
  }, [id, router]);

  /* ---------- SWIPE STATE ---------- */

  const startX = useRef<number | null>(null);

  const handlePointerDown = (e: React.PointerEvent) => {
    startX.current = e.clientX;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!homework || viewerIndex === null || startX.current === null) return;

    const diff = startX.current - e.clientX;
    const threshold = 50;

    if (diff > threshold && viewerIndex < homework.images.length - 1) {
      setViewerIndex(viewerIndex + 1);
    }

    if (diff < -threshold && viewerIndex > 0) {
      setViewerIndex(viewerIndex - 1);
    }

    startX.current = null;
  };

  /* ---------- DOWNLOAD ---------- */

  const downloadAllImages = async () => {
    if (!homework) return;

    for (let i = 0; i < homework.images.length; i++) {
      const imageUrl = homework.images[i];

      try {
        const response = await fetch(imageUrl, { mode: "cors" });
        const blob = await response.blob();

        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement("a");

        a.href = blobUrl;
        a.download = `homework-${homework.id}-${i + 1}.jpg`;

        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        URL.revokeObjectURL(blobUrl);

        // Small delay so mobile browsers don't cancel downloads
        await new Promise((r) => setTimeout(r, 400));
      } catch (err) {
        console.error("Failed to download image:", err);
      }
    }
  };

  /* ---------- LOADING ---------- */

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <Loader />
      </div>
    );
  }

  if (!homework) return null;

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

      <main className="relative z-10 max-w-xl mx-auto px-4 py-6 space-y-6">
        {/* Back */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 font-bold text-gray-700"
        >
          <ChevronLeft size={20} />
          Back
        </button>

        {/* Card */}
        <div className="bg-white border-4 border-black rounded-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
          {/* Header */}
          <div
            className={`${homework.color} border-b-4 border-black px-4 py-4`}
          >
            <div className="flex items-start justify-between">
              <div className="flex gap-3">
                <div className="bg-white/70 border-2 border-black rounded-full p-2">
                  {subjectIcon(homework.subject)}
                </div>

                <div className="flex flex-col gap-1">
                  <span className="font-black text-xl leading-none">
                    {homework.subject}
                  </span>

                  <div className="flex gap-2">
                    <span className="bg-black text-white text-xs font-bold px-2 py-0.5 rounded-md border-2 border-black">
                      {new Date(homework.date).toLocaleDateString("en-US", {
                        weekday: "short",
                      })}
                    </span>
                    <span className="bg-white text-gray-800 text-xs font-bold px-2 py-0.5 rounded-md border-2 border-black">
                      {new Date(homework.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {homework.images.length > 0 && (
                <button
                  onClick={downloadAllImages}
                  className="bg-white border-2 border-black rounded-lg px-3 py-2 font-bold flex items-center gap-2 shadow"
                >
                  <Download size={18} />
                  All
                </button>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="p-4">
            <p className="text-lg font-medium leading-relaxed text-gray-800">
              {homework.description}
            </p>
          </div>

          {/* Thumbnails */}
          {homework.images.length > 0 && (
            <div className="px-4 pb-4 grid grid-cols-2 gap-3">
              {homework.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setViewerIndex(i)}
                  className="border-4 border-black rounded-xl overflow-hidden"
                >
                  <img
                    src={img}
                    alt="homework"
                    className="object-cover w-full h-40"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* ---------- IMAGE VIEWER ---------- */}
      {viewerIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center touch-pan-y"
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
        >
          <button
            onClick={() => setViewerIndex(null)}
            className="absolute top-4 right-4 bg-white rounded-full p-2 border-2 border-black"
          >
            <X size={24} />
          </button>

          <img
            src={homework.images[viewerIndex]}
            alt="full"
            className="max-h-[90vh] max-w-[90vw] object-contain select-none"
            draggable={false}
          />
        </div>
      )}
    </div>
  );
}
