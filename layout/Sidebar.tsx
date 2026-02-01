"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  BookOpen,
  MessageSquare,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Users",
    href: "/dashboard/users",
    icon: Users,
  },
  {
    title: "Subscriptions & Payments",
    href: "/dashboard/subscriptions",
    icon: CreditCard,
  },
  {
    title: "Training Content",
    href: "/dashboard/training",
    icon: BookOpen,
  },
  {
    title: "Support & Engagement",
    href: "/dashboard/support",
    icon: MessageSquare,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-[240px] flex-col border-r bg-white">
      {/* Logo */}
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="text-xl font-bold text-gray-900">Mait</span>
          <span className="text-xl font-bold text-emerald-600">Club</span>
        </Link>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 py-4">
        <nav className="space-y-1 px-2">
          {sidebarItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-[10px] pl-4 text-sm font-medium transition-colors w-[223px] h-[44px]",
                  isActive
                    ? "bg-[#E1EDED] text-emerald-700"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                )}
              >
                <Icon
                  className={cn(
                    "h-5 w-5",
                    isActive ? "text-emerald-600" : "text-gray-500"
                  )}
                />
                {item.title}
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      {/* Status */}
      <div className="border-t p-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
          All Systems Operational
        </div>
      </div>
    </div>
  );
}
