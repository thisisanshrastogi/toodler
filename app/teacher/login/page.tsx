"use client";

import { auth } from "@/lib/firebase";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
} from "firebase/auth";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";

export default function LoginPage() {
  const handleGoogleSignIn = async () => {
    // TODO: Firebase Google Sign-In

    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const email = result.user.email;

    if (email !== process.env.NEXT_PUBLIC_TEACHER_EMAIL) {
      await auth.signOut();
      throw new Error("Not authorized");
    }
    console.log(result.user);
    window.location.href = "/teacher/upload";

    console.log("Google sign-in successful");
  };

  

  return (
    <div className="h-screen w-screen bg-slate-100 flex items-center justify-center relative overflow-hidden font-[Comic_Neue]">
      {/* Font + Grid Background */}
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

      {/* Background Grid */}
      <div className="fixed inset-0 notebook-bg opacity-70 pointer-events-none" />

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md mx-4 bg-white border-4 border-gray-900 rounded-2xl p-6 sm:p-8 shadow-[8px_8px_0px_0px_rgba(30,41,59,1)]">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-pink-500 border-4 border-gray-900 rounded-xl flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(30,41,59,1)]">
            <span className="text-3xl sm:text-4xl">🧩</span>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-4xl font-black text-center tracking-tight mb-2 text-gray-900">
          Welcome to Toodler.
        </h1>

        <p className="text-center text-gray-700 font-semibold mb-8">
          Teachers only beyond this point.
        </p>

        {/* Google Sign-In Button */}
        <button
          onClick={handleGoogleSignIn}
          className="
            w-full flex items-center justify-center gap-3
            bg-white border-4 border-gray-900 rounded-xl
            py-3 sm:py-4
            font-bold text-base sm:text-lg text-gray-900
            shadow-[4px_4px_0px_0px_rgba(30,41,59,1)]
            hover:-translate-y-1 transition-all
            active:translate-y-1 active:shadow-none
            focus:outline-none focus:ring-2 focus:ring-pink-400
          "
        >
          <FcGoogle size={24} className="sm:size-[28px]" />
          Continue with Google
        </button>

        {/* Footer */}
        <p className="mt-6 text-center text-xs sm:text-sm text-gray-500 font-semibold">
          No students sneaking in. We see you.
        </p>
      </div>
    </div>
  );
}
