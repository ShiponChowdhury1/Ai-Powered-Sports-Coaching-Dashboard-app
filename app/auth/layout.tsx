"use client";
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col items-center justify-center px-4">
      {children}
    </div>
  );
}
