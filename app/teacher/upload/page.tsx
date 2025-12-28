"use client";

import { useState } from "react";
import {
  Calendar,
  ImagePlus,
  Trash2,
  BookOpen,
  Calculator,
  Palette,
  Smile,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { db, storage } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { useRouter } from "next/navigation";

/* ---------- SUBJECT CONFIG ---------- */

const SUBJECTS = [
  {
    name: "Math",
    color: "bg-orange-400",
    icon: <Calculator size={26} strokeWidth={2.5} />,
  },
  {
    name: "English",
    color: "bg-blue-400",
    icon: <BookOpen size={26} strokeWidth={2.5} />,
  },
  {
    name: "Art",
    color: "bg-green-400",
    icon: <Palette size={26} strokeWidth={2.5} />,
  },
  {
    name: "General",
    color: "bg-pink-400",
    icon: <Smile size={26} strokeWidth={2.5} />,
  },
];

export default function CreateHomeworkPage() {
  const router = useRouter();
  const today = new Date().toISOString().split("T")[0];

  const [date, setDate] = useState(today);
  const [subject, setSubject] = useState(SUBJECTS[0]);
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<File[]>([]);

  /* ---------- IMAGE HANDLING ---------- */

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setImages((prev) => [...prev, ...Array.from(e.target.files as FileList)]);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const moveImage = (from: number, to: number) => {
    if (to < 0 || to >= images.length) return;
    const updated = [...images];
    [updated[from], updated[to]] = [updated[to], updated[from]];
    setImages(updated);
  };

  /* ---------- SUBMIT ---------- */

  const handleSubmit = async () => {
    if (!description.trim()) {
      alert("Please add homework instructions");
      return;
    }

    try {
      // 1️⃣ Upload images to Cloudinary
      const imageUrls: string[] = [];

      for (const image of images) {
        const url = await uploadToCloudinary(image);
        imageUrls.push(url);
      }

      // 2️⃣ Save homework in Firestore
      await addDoc(collection(db, "homeworks"), {
        date,
        subject: subject.name,
        color: subject.color,
        description,
        images: imageUrls,
        createdAt: serverTimestamp(),
      });

      // 3️⃣ Reset UI
      setDescription("");
      setImages([]);
      alert("Homework posted successfully 🎉");
    } catch (err) {
      console.error(err);
      alert("Failed to upload homework");
    }
  };

  //   const handleSubmit = () => {
  //     const payload = {
  //       date,
  //       subject: subject.name,
  //       color: subject.color,
  //       description,
  //       images,
  //     };

  //     console.log("Homework payload:", payload);
  //     alert("Homework ready 🚀 (check console)");
  //   };

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

      <main className="relative z-10 max-w-2xl mx-auto px-1 py-8">
        <div className="flex items-center justify-between w-full mb-6">
          {/* <button
            onClick={() => router.back()}
            className="flex items-center gap-2 font-bold text-gray-700"
          >
            <ChevronLeft size={30} />
          </button> */}
          <h1 className="text-3xl sm:text-4xl font-black ">Create Homework</h1>
        </div>

        <div className="bg-white border-4 border-black rounded-2xl p-5 sm:p-6 space-y-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          {/* DATE */}
          <div>
            <label className="font-bold mb-2 block flex items-center gap-2">
              <Calendar size={18} /> Homework Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border-4 border-black rounded-lg px-4 py-2 font-bold text-black focus:outline-none"
            />
          </div>

          {/* SUBJECT */}
          <div>
            <label className="font-bold mb-3 block">Subject</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {SUBJECTS.map((s) => (
                <button
                  key={s.name}
                  type="button"
                  onClick={() => setSubject(s)}
                  className={`
                    ${s.color}
                    text-black
                    border-4 border-black rounded-xl p-4
                    flex flex-col items-center gap-2
                    font-bold
                    transition-all duration-200
                    active:scale-95
                    ${
                      subject.name === s.name
                        ? "opacity-100 saturate-100 ring-4 ring-black scale-[1.02]"
                        : "opacity-60 saturate-75"
                    }
                  `}
                >
                  {s.icon}
                  {s.name}
                </button>
              ))}
            </div>
          </div>

          {/* IMAGES */}
          <div>
            <label className="font-bold mb-3 block">Homework Images</label>

            <label className="cursor-pointer inline-flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg font-bold border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition">
              <ImagePlus size={20} />
              Add Images
              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </label>

            {images.length > 0 && (
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
                {images.map((img, i) => (
                  <div
                    key={i}
                    className="relative border-4 border-black rounded-xl overflow-hidden group"
                  >
                    <img
                      src={URL.createObjectURL(img)}
                      className="object-cover w-full h-32"
                      alt="preview"
                    />

                    {/* REORDER */}
                    <div className="absolute inset-0 flex justify-between items-center px-2">
                      <button
                        onClick={() => moveImage(i, i - 1)}
                        className="bg-white border-2 border-black rounded-full p-1 shadow
                                   opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition"
                      >
                        <ChevronLeft size={16} />
                      </button>

                      <button
                        onClick={() => moveImage(i, i + 1)}
                        className="bg-white border-2 border-black rounded-full p-1 shadow
                                   opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>

                    {/* DELETE */}
                    <button
                      onClick={() => removeImage(i)}
                      className="absolute top-2 right-2 bg-red-400 border-2 border-black rounded-full p-1 shadow
                                 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="font-bold mb-2 block">
              Homework Instructions
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Write what students need to do today..."
              className="w-full h-32 border-4 border-black rounded-xl p-4 font-medium resize-none focus:outline-none text-black"
            />
          </div>

          {/* SUBMIT */}
          <button
            onClick={handleSubmit}
            className={`
              w-full ${subject.color}
              text-black
              border-4 border-black rounded-xl py-4
              font-black text-xl
              shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]
              hover:-translate-y-1 transition
              active:translate-y-1 active:shadow-none
            `}
          >
            Post Homework 🚀
          </button>
        </div>
      </main>
    </div>
  );
}
