"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Calendar,
  ImagePlus,
  Trash2,
  Calculator,
  BookOpen,
  Palette,
  Smile,
  ChevronLeft,
} from "lucide-react";

import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { uploadToCloudinary } from "@/lib/cloudinary";

/* ---------- SUBJECT CONFIG ---------- */

const SUBJECTS = [
  { name: "Math", color: "bg-orange-400", icon: <Calculator size={24} /> },
  { name: "English", color: "bg-blue-400", icon: <BookOpen size={24} /> },
  { name: "Art", color: "bg-green-400", icon: <Palette size={24} /> },
  { name: "General", color: "bg-pink-400", icon: <Smile size={24} /> },
];

export default function EditHomeworkPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const [date, setDate] = useState("");
  const [subject, setSubject] = useState(SUBJECTS[0]);
  const [description, setDescription] = useState("");

  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);

  /* ---------- LOAD HOMEWORK ---------- */

  useEffect(() => {
    const loadHomework = async () => {
      const ref = doc(db, "homeworks", id);
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        alert("Homework not found");
        router.push("/teacher");
        return;
      }

      const data = snap.data();
      setDate(data.date);
      setDescription(data.description);
      setExistingImages(data.images || []);

      const matched =
        SUBJECTS.find((s) => s.name === data.subject) || SUBJECTS[0];
      setSubject(matched);

      setLoading(false);
    };

    loadHomework();
  }, [id, router]);

  /* ---------- IMAGE HANDLING ---------- */

  const handleNewImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setNewImages((prev) => [...prev, ...Array.from(e.target.files as FileList)]);
  };

  const removeExistingImage = (url: string) => {
    setExistingImages((prev) => prev.filter((img) => img !== url));
  };

  const removeNewImage = (index: number) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  /* ---------- IMAGE REORDER ---------- */

  const moveExistingImage = (from: number, to: number) => {
    if (to < 0 || to >= existingImages.length) return;
    const updated = [...existingImages];
    [updated[from], updated[to]] = [updated[to], updated[from]];
    setExistingImages(updated);
  };

  const moveNewImage = (from: number, to: number) => {
    if (to < 0 || to >= newImages.length) return;
    const updated = [...newImages];
    [updated[from], updated[to]] = [updated[to], updated[from]];
    setNewImages(updated);
  };

  /* ---------- SAVE ---------- */

  const handleSave = async () => {
    if (!description.trim()) {
      alert("Description is required");
      return;
    }

    try {
      const uploadedUrls: string[] = [];

      for (const img of newImages) {
        const url = await uploadToCloudinary(img);
        uploadedUrls.push(url);
      }

      const finalImages = [...existingImages, ...uploadedUrls];

      await updateDoc(doc(db, "homeworks", id), {
        date,
        subject: subject.name,
        color: subject.color,
        description,
        images: finalImages,
      });

      alert("Homework updated ✅");
      router.push("/teacher");
    } catch (err) {
      console.error(err);
      alert("Failed to update homework");
    }
  };

  if (loading) {
    return <p className="p-6 font-bold">Loading…</p>;
  }

  return (
    <div className="min-h-screen bg-slate-100 relative font-[Comic_Neue] text-black">
      {/* Grid */}
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
          <h1 className="text-3xl font-black">Edit Homework</h1>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-1.5 font-semibold text-gray-700 bg-white/70 px-2 py-1.5 rounded-md active:opacity-60"
          >
            <ChevronLeft size={18} />
            Back
          </button>
        </div>

        {/* DATE */}
        <div>
          <label className="font-bold block mb-1">
            <Calendar size={16} className="inline mr-2" />
            Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border-4 border-black rounded-lg px-4 py-2 font-bold"
          />
        </div>

        {/* SUBJECT */}
        <div>
          <label className="font-bold block mb-2">Subject</label>
          <div className="grid grid-cols-2 gap-3">
            {SUBJECTS.map((s) => (
              <button
                key={s.name}
                type="button"
                onClick={() => setSubject(s)}
                className={`${
                  s.color
                } border-4 border-black rounded-xl p-4 font-bold flex items-center gap-2 ${
                  subject.name === s.name ? "ring-4 ring-black" : "opacity-60"
                }`}
              >
                {s.icon}
                {s.name}
              </button>
            ))}
          </div>
        </div>

        {/* DESCRIPTION */}
        <div>
          <label className="font-bold block mb-1">Homework Instructions</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full h-32 border-4 border-black rounded-xl p-4"
          />
        </div>

        {/* IMAGES */}
        <div>
          <label className="font-bold block mb-2">Images</label>

          <label className="inline-flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg border-4 border-black font-bold cursor-pointer">
            <ImagePlus size={18} />
            Add Images
            <input
              type="file"
              multiple
              accept="image/*"
              hidden
              onChange={handleNewImages}
            />
          </label>

          {/* EXISTING IMAGES */}
          {existingImages.length > 0 && (
            <div className="grid grid-cols-3 gap-3 mt-4">
              {existingImages.map((img, index) => (
                <div
                  key={img}
                  className="relative border-4 border-black rounded-xl overflow-hidden group"
                >
                  <img src={img} className="h-24 w-full object-cover" />

                  <div className="absolute inset-x-0 bottom-1 flex justify-center gap-1 opacity-0 group-hover:opacity-100 transition">
                    <button
                      onClick={() => moveExistingImage(index, index - 1)}
                      className="bg-white border-2 border-black rounded px-1"
                    >
                      ←
                    </button>
                    <button
                      onClick={() => moveExistingImage(index, index + 1)}
                      className="bg-white border-2 border-black rounded px-1"
                    >
                      →
                    </button>
                  </div>

                  <button
                    onClick={() => removeExistingImage(img)}
                    className="absolute top-1 right-1 bg-red-400 border-2 border-black rounded-full p-1"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* NEW IMAGES */}
          {newImages.length > 0 && (
            <div className="grid grid-cols-3 gap-3 mt-4">
              {newImages.map((img, index) => (
                <div
                  key={index}
                  className="relative border-4 border-black rounded-xl overflow-hidden group"
                >
                  <img
                    src={URL.createObjectURL(img)}
                    className="h-24 w-full object-cover"
                  />

                  <div className="absolute inset-x-0 bottom-1 flex justify-center gap-1 opacity-0 group-hover:opacity-100 transition">
                    <button
                      onClick={() => moveNewImage(index, index - 1)}
                      className="bg-white border-2 border-black rounded px-1"
                    >
                      ←
                    </button>
                    <button
                      onClick={() => moveNewImage(index, index + 1)}
                      className="bg-white border-2 border-black rounded px-1"
                    >
                      →
                    </button>
                  </div>

                  <button
                    onClick={() => removeNewImage(index)}
                    className="absolute top-1 right-1 bg-red-400 border-2 border-black rounded-full p-1"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SAVE */}
        <button
          onClick={handleSave}
          className={`${subject.color} w-full border-4 border-black rounded-xl py-4 font-black text-xl shadow`}
        >
          Save Changes
        </button>
      </main>
    </div>
  );
}
