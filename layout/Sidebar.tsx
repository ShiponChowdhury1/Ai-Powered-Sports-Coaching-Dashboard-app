"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useGetProfileQuery } from "@/store/api/profileApi";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAppDispatch } from "@/store/hooks";
import { logout } from "@/features/auth/authSlice";
import { toast } from "react-toastify";

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
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { data: profile } = useGetProfileQuery();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully!");
    router.push("/auth/login");
  };

  return (
    <>
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

      {/* Profile Section */}
      <div className="border-t border-[#E5E7EB] p-4 space-y-3">
        {!isCollapsed && profile && (
          <div className="flex items-center gap-3 px-2">
            <Avatar className="w-10 h-10">
              <AvatarImage src={profile.image} alt={profile.name} />
              <AvatarFallback className="bg-emerald-100 text-emerald-700">
                {profile.name?.charAt(0)?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{profile.name}</p>
              <p className="text-xs text-gray-500 truncate">{profile.email}</p>
            </div>
          </div>
        )}
        {!isCollapsed ? (
          <button
            onClick={() => setShowLogoutModal(true)}
            className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700 w-full px-2 py-2 rounded-lg hover:bg-red-50 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        ) : (
          <button
            onClick={() => setShowLogoutModal(true)}
            className="flex justify-center w-full p-2 rounded-lg hover:bg-red-50 transition-colors"
            title="Logout"
          >
            <LogOut className="h-5 w-5 text-red-600" />
          </button>
        )}
      </div>
    </div>

    {/* Logout Confirmation Modal */}
    <Dialog open={showLogoutModal} onOpenChange={setShowLogoutModal}>
      <DialogContent className="sm:max-w-[400px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Confirm Logout
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Are you sure you want to logout? 
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-3">
          <Button
            variant="outline"
            onClick={() => setShowLogoutModal(false)}
            className="border-[#E5E7EB]"
          >
            Cancel
          </Button>
          <Button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Logout
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  );
}
