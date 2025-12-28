import TeacherGuard from "@/components/TeacherGuard";

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TeacherGuard>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 w-full">
        {children}
      </div>
    </TeacherGuard>
  );
}
