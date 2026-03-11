"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useGetProfileQuery } from "@/store/api/profileApi";
import AdminInformation from "@/components/settings/AdminInformation";
import ChangePassword from "@/components/settings/ChangePassword";
import Notifications from "@/components/settings/Notifications";
import PrivacyPolicy from "@/components/settings/PrivacyPolicy";
import TermsConditions from "@/components/settings/TermsConditions";

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

  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 min-h-screen bg-gray-50">
      {/* Left Sidebar */}
      <div className="w-full lg:w-80 bg-[#FFFFFF] rounded-xl p-4 lg:p-6 space-y-4 lg:space-y-6 h-fit shadow-sm border border-[#E5E7EB]">
        {/* Profile */}
        <div className="text-center space-y-3 lg:space-y-4">
          <div className="flex justify-center">
            <Avatar className="w-24 h-24 lg:w-32 lg:h-32">
              <AvatarImage src={profile?.image} alt={profile?.name} />
              <AvatarFallback className="text-3xl bg-emerald-100 text-emerald-700">
                {profile?.name?.charAt(0)?.toUpperCase() || "A"}
              </AvatarFallback>
            </Avatar>
          </div>
          <div>
            <h2 className="text-xl lg:text-2xl font-semibold text-gray-900">{profile?.name}</h2>
            <p className="text-sm text-gray-600 mt-1">{profile?.email}</p>
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
        {activeTab === "admin-info" && <AdminInformation />}
        {activeTab === "change-password" && <ChangePassword />}
        {activeTab === "notification" && <Notifications />}
        {activeTab === "privacy-policy" && <PrivacyPolicy />}
        {activeTab === "terms" && <TermsConditions />}
      </div>
    </div>
  );
}
