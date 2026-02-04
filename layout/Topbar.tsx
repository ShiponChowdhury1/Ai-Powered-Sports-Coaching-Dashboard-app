"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, Search, Menu, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { logout } from "@/features/auth/authSlice";
import { useGetProfileQuery } from "@/store/api/profileApi";
import { useGetNotificationsQuery, useMarkAsReadMutation } from "@/store/api/notificationsApi";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

interface TopbarProps {
  onMenuClick?: () => void;
}

export function Topbar({ onMenuClick }: TopbarProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const { data: profile } = useGetProfileQuery();
  const { data: notifications = [], refetch: refetchNotifications } = useGetNotificationsQuery({ unreadOnly: true });
  const [markAsRead] = useMarkAsReadMutation();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully!");
    router.push("/auth/login");
  };

  const handleNotificationClick = async (notificationId: number, link: string | null) => {
    try {
      await markAsRead(notificationId).unwrap();
      if (link) {
        window.open(link, "_blank");
      }
      refetchNotifications();
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  // Get user initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
    <header className="flex h-[97px] items-center justify-between border-b-[1.11px] border-[#E5E7EB] bg-[#FFFFFF] px-6">
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden mr-2"
        onClick={onMenuClick}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Search */}
      <div className="flex items-center flex-1 max-w-[672px]">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            type="search"
            placeholder="Search users, videos, emails..."
            className="w-full h-[42px] pl-10 pr-4 py-2 bg-gray-50 border-[1.11px] border-[#D1D5DC] rounded-[10px]"
          />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Notifications */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative"
          onClick={() => setShowNotifications(true)}
        >
          <Bell className="h-5 w-5 text-gray-600" />
          {notifications.length > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
              {notifications.length}
            </span>
          )}
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 sm:gap-3 px-1 sm:px-2">
              <Avatar className="h-8 w-8 sm:h-9 sm:w-9">
                <AvatarImage src={profile?.image} alt={profile?.name || user?.name || "Admin"} />
                <AvatarFallback className="bg-emerald-100 text-emerald-700">
                  {profile?.name ? getInitials(profile.name) : user?.name ? getInitials(user.name) : "AD"}
                </AvatarFallback>
              </Avatar>
              <div className="hidden sm:flex flex-col items-start text-sm">
                <span className="font-medium text-gray-900">{profile?.name || user?.name || "Admin"}</span>
                <span className="text-xs text-gray-500">{profile?.email || user?.email || "admin@sportcoach.ai"}</span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[222px] bg-[#FFFFFF] border-[#E5E7EB]">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/dashboard/settings")}>
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-red-600 cursor-pointer"
              onClick={() => setShowLogoutModal(true)}
            >
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>

    {/* Notifications Sheet */}
    <Sheet open={showNotifications} onOpenChange={setShowNotifications}>
      <SheetContent className="w-full sm:max-w-[400px] bg-white">
        <SheetHeader>
          <SheetTitle className="text-xl font-semibold">Notifications</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-2">
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No new notifications
            </div>
          ) : (
            <>
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification.id, notification.link)}
                  className={`p-4 rounded-lg cursor-pointer transition-colors ${
                    notification.priority === "HIGH" 
                      ? "bg-blue-50 hover:bg-blue-100" 
                      : "bg-white hover:bg-gray-50"
                  } border border-gray-200`}
                >
                  <h4 className="font-medium text-gray-900 text-sm">
                    {notification.title}
                  </h4>
                  <p className="text-xs text-gray-600 mt-1">
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                  </p>
                </div>
              ))}
              <div className="pt-4 text-center">
                <button
                  onClick={() => {
                    router.push("/dashboard/notifications");
                    setShowNotifications(false);
                  }}
                  className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  View all notifications
                </button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>

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
