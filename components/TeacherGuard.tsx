"use client";

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Loader from "./loader";

export default function TeacherGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      const isLoginPage = pathname === "/teacher/login";
      //   const isAuthorizedTeacher =
      //     user && user.email === process.env.NEXT_PUBLIC_TEACHER_EMAIL;
      const isAuthorizedTeacher = user !== null;
      // 🔒 Not logged in → only allow login page
      if (!user || !isAuthorizedTeacher) {
        if (!isLoginPage) {
          router.replace("/teacher/login");
          return;
        }
        setChecked(true);
        return;
      }

      // ✅ Logged in AND on login page → go to upload
      if (isLoginPage) {
        router.replace("/teacher/");
        return;
      }

      // ✅ Logged in AND allowed page
      setChecked(true);
    });

    return () => unsub();
  }, [pathname, router]);

  if (!checked)
    return (
      <div className="flex h-screen justify-center items-center bg-white">
        <Loader />
      </div>
    );

  return <>{children}</>;
}
