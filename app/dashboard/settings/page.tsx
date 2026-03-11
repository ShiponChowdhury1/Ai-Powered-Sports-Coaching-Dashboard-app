"use client";

import { useState, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useGetProfileQuery } from "@/store/api/profileApi";
import AdminInformation from "@/components/settings/AdminInformation";
import ChangePassword from "@/components/settings/ChangePassword";
import Notifications from "@/components/settings/Notifications";
import PrivacyPolicy from "@/components/settings/PrivacyPolicy";
import TermsConditions from "@/components/settings/TermsConditions";
import { Camera } from "lucide-react";

type SettingsTab = "admin-info" | "change-password" | "notification" | "privacy-policy" | "terms";

const menuItems: { id: SettingsTab; label: string }[] = [
  { id: "admin-info", label: "Admin Information" },
  { id: "change-password", label: "Change Password" },
  { id: "notification", label: "Notifications" },
  { id: "privacy-policy", label: "Privacy Policy" },
  { id: "terms", label: "Terms & Conditions" },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("admin-info");
  const { data: profile } = useGetProfileQuery();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>("");

  // Sync preview with API data on first load
  if (profile?.image && !previewImage && !selectedImage) {
    setPreviewImage(profile.image);
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 min-h-screen bg-gray-50">
      {/* Left Sidebar */}
      <div className="w-full lg:w-80 bg-[#FFFFFF] rounded-xl p-4 lg:p-6 space-y-4 lg:space-y-6 h-fit shadow-sm border border-[#E5E7EB]">
        {/* Profile */}
        <div className="text-center space-y-3 lg:space-y-4">
          <div className="flex justify-center">
            <div className="relative cursor-pointer group" onClick={() => fileInputRef.current?.click()}>
              <Avatar className="w-24 h-24 lg:w-32 lg:h-32">
                <AvatarImage src={previewImage || profile?.image} alt={profile?.name} />
                <AvatarFallback className="text-3xl bg-emerald-100 text-emerald-700">
                  {profile?.name?.charAt(0)?.toUpperCase() || "A"}
                </AvatarFallback>
              </Avatar>
              {/* Hover overlay */}
              <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera className="h-6 w-6 text-white" />
              </div>
              {/* Camera badge */}
              <div className="absolute bottom-1 right-1 bg-emerald-600 text-white p-1.5 rounded-full border-2 border-white shadow-sm">
                <Camera className="h-3 w-3" />
              </div>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
            />
          </div>
          <div>
            <h2 className="text-xl lg:text-2xl font-semibold text-gray-900">{profile?.name}</h2>
            <p className="text-sm text-gray-600 mt-1">{profile?.email}</p>
            <p className="text-xs text-emerald-600 mt-1 cursor-pointer hover:underline" onClick={() => fileInputRef.current?.click()}>
              {selectedImage ? "Image selected — save to apply" : "Click photo to change"}
            </p>
          </div>
        </div>

        {/* Menu */}
        <div className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                activeTab === item.id
                  ? "bg-emerald-600 text-white font-medium"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-white rounded-lg p-4 sm:p-6 lg:p-8">
        {activeTab === "admin-info" && (
          <AdminInformation
            previewImage={previewImage}
            selectedImage={selectedImage}
            onImageSaved={() => setSelectedImage(null)}
          />
        )}
        {activeTab === "change-password" && <ChangePassword />}
        {activeTab === "notification" && <Notifications />}
        {activeTab === "privacy-policy" && <PrivacyPolicy />}
        {activeTab === "terms" && <TermsConditions />}
      </div>
    </div>
  );
}
