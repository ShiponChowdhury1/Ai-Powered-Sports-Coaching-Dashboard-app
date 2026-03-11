"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  MessageSquare,
  Settings,
  X,
  PanelLeftClose,
  PanelLeftOpen,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
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
import { baseApi } from "@/store/api/baseApi";

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
    title: "Subscribers",
    href: "/dashboard/subscribers",
    icon: Users,
  },

  // {
  //   title: "Feature Access Control",
  //   href: "/dashboard/feature-access",
  //   icon: ShieldCheck,
  // },

   {
    title: "Subscriptions",
    href: "/dashboard/subscriptions",
    icon: CreditCard,
  },
  // {
  //   title: "Videos & Uploads",
  //   href: "/dashboard/videos",
  //   icon: Video,
  // },
  {
    title: "Help & Support",
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
    // Clear API cache before logging out
    dispatch(baseApi.util.resetApiState());
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
      <div className="relative flex items-center justify-between border-b border-[#E5E7EB] px-4 py-4">
        <Link href="/dashboard" className="flex items-center">
          {isCollapsed ? (
            <Image src="/auth/toggle.png" alt="Logo" width={40} height={40} />
          ) : (
            <Image src="/auth/logo.png" alt="Logo" width={140} height={40} style={{ objectFit: 'contain' }} />
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
        {/* Collapse Toggle Button (Desktop Only) */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="hidden lg:flex absolute -right-[18px] top-1/2 -translate-y-1/2 z-10 h-9 w-9 items-center justify-center rounded-full border border-[#E5E7EB] bg-white text-gray-500 shadow-sm hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-300 transition-all duration-200"
        >
          {isCollapsed ? (
            <PanelLeftOpen className="h-4 w-4" />
          ) : (
            <PanelLeftClose className="h-4 w-4" />
          )}
        </button>
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
                <div className={cn(
                  "flex items-center justify-center rounded-lg flex-shrink-0",
                  isActive
                    ? "bg-emerald-600 text-white h-8 w-8"
                    : "text-gray-500 h-8 w-8"
                )}>
                  <Icon className="h-5 w-5" />
                </div>
                {!isCollapsed && <span>{item.title}</span>}
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      {/* Profile Section */}
      <div className="border-t border-[#E5E7EB] px-4 py-4 space-y-3">
        {!isCollapsed && profile && (
          <div className="flex items-center gap-3 px-2">
            
          
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
