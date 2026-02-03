"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  BookOpen,
  MessageSquare,
  Settings,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

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

interface SidebarProps {
  onClose?: () => void;
}

export function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={cn(
      "flex h-full flex-col border-r-[1.11px] border-[#E5E7EB] bg-[#FFFFFF] transition-all duration-300",
      isCollapsed ? "w-[80px]" : "w-[256px]"
    )}>
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-[#E5E7EB] px-6">
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="text-xl font-bold text-gray-900">
            {isCollapsed ? "M" : "Mait"}
          </span>
          {!isCollapsed && (
            <span className="text-xl font-bold text-emerald-600">Club</span>
          )}
        </Link>
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      {/* Collapse Toggle Button (Desktop Only) */}
      <div className="hidden lg:flex justify-end px-2 py-3 border-b border-[#E5E7EB]">
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 rounded-lg border-[#E5E7EB] hover:bg-emerald-50 hover:border-emerald-600 hover:text-emerald-600 transition-all"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </Button>
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
                title={isCollapsed ? item.title : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-[10px] text-sm font-medium transition-colors w-full h-[44px]",
                  isCollapsed ? "justify-center px-2" : "pl-4",
                  isActive
                    ? "bg-[#E1EDED] text-emerald-700"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                )}
                onClick={onClose}
              >
                <Icon
                  className={cn(
                    "h-5 w-5 flex-shrink-0",
                    isActive ? "text-emerald-600" : "text-gray-500"
                  )}
                />
                {!isCollapsed && <span>{item.title}</span>}
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      {/* Status */}
      <div className="border-t border-[#E5E7EB] p-4">
        {!isCollapsed ? (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
            All Systems Operational
          </div>
        ) : (
          <div className="flex justify-center">
            <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
          </div>
        )}
      </div>
    </div>
  );
}
