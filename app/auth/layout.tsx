"use client";

import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col items-center py-8">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="w-8 h-8 text-white"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </div>
        <div className="flex items-center">
          <span className="text-2xl font-bold text-emerald-600">Mait</span>
          <span className="text-2xl font-bold text-gray-900 ml-1">Club</span>
        </div>
      </Link>

      {/* Auth Content */}
      {children}
    </div>
  );
}
