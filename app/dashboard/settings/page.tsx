"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { useGetProfileQuery, useUpdateProfileMutation } from "@/store/api/profileApi";
import { useChangePasswordMutation } from "@/store/api/authApi";
import { useGetPrivacyPolicyQuery, useGetTermsConditionsQuery } from "@/store/api/privacyPolicyApi";
import { toast } from "sonner";
import { 
  Camera, 
  Bell, 
  Eye,
  EyeOff
} from "lucide-react";

type SettingsTab = "admin-info" | "change-password" | "notification" | "privacy-policy" | "terms";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("admin-info");
  const { data: profile, isLoading, error } = useGetProfileQuery();
  const { data: privacyPolicy, isLoading: isLoadingPrivacyPolicy } = useGetPrivacyPolicyQuery();
  const { data: termsConditions, isLoading: isLoadingTermsConditions } = useGetTermsConditionsQuery();
  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();
  const [updateProfile, { isLoading: isUpdatingProfile }] = useUpdateProfileMutation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [profileData, setProfileData] = useState({
    name: "",
    phone: "",
  });

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>("");

  // Update form when profile data loads
  useEffect(() => {
    if (profile) {
      setProfileData({
        name: profile.name,
        phone: profile.phone,
      });
      setPreviewImage(profile.image);
    }
  }, [profile]);

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const [notificationSettings, setNotificationSettings] = useState({
    failedAIAnalysis: true,
    paymentFailures: true,
    highPriorityTickets: true,
    flaggedContent: true,
  });

  const menuItems = [
    { id: "admin-info" as SettingsTab, label: "Admin Information" },
    { id: "change-password" as SettingsTab, label: "Change Password" },
    { id: "notification" as SettingsTab, label: "Notification" },
    { id: "privacy-policy" as SettingsTab, label: "Privacy Policy" },
    { id: "terms" as SettingsTab, label: "trams & Conditions" },
  ];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append("name", profileData.name);
    formData.append("phone", profileData.phone);
    
    if (selectedImage) {
      formData.append("image", selectedImage);
    }

    try {
      const result = await updateProfile(formData).unwrap();
      toast.success(result.message || "Profile updated successfully");
      setSelectedImage(null);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update profile");
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      const result = await changePassword({
        old_password: passwordData.oldPassword,
        new_password: passwordData.newPassword,
      }).unwrap();
      
      toast.success(result.message || "Password changed successfully");
      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to change password");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600">Loading profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-red-600">Error loading profile. Please try again.</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 min-h-screen bg-gray-50">
      {/* Left Sidebar */}
      <div className="w-full lg:w-80 bg-[#FFFFFF] rounded-xl p-4 lg:p-6 space-y-4 lg:space-y-6 h-fit shadow-sm border border-[#E5E7EB]">
        {/* Profile Section */}
        <div className="text-center space-y-3 lg:space-y-4">
          <div className="flex justify-center">
            <Avatar className="w-24 h-24 lg:w-32 lg:h-32">
              <AvatarImage src={profile?.image} alt={profile?.name} />
              <AvatarFallback className="text-3xl bg-emerald-100 text-emerald-700">{profile?.name?.charAt(0)?.toUpperCase() || "A"}</AvatarFallback>
            </Avatar>
          </div>
          <div>
            <h2 className="text-xl lg:text-2xl font-semibold text-gray-900">{profile?.name}</h2>
            <p className="text-sm text-gray-600 mt-1">{profile?.email}</p>
          </div>
        </div>

        {/* Menu Items */}
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

      {/* Main Content Area */}
      <div className="flex-1 bg-white rounded-lg p-4 sm:p-6 lg:p-8">
        {activeTab === "admin-info" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Information</h1>
              <p className="text-sm text-gray-600 mt-1">Update your store details and branding</p>
            </div>

            {/* Profile Picture Upload */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={previewImage} alt={profileData.name} />
                    <AvatarFallback className="text-2xl bg-emerald-100 text-emerald-700">{profileData.name?.charAt(0)?.toUpperCase() || "A"}</AvatarFallback>
                  </Avatar>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <button 
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 bg-emerald-600 text-white p-1.5 rounded-full hover:bg-emerald-700 transition-colors"
                  >
                    <Camera className="h-3 w-3" />
                  </button>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{profileData.name}</h3>
                  <p className="text-sm text-gray-600">{profile?.role}</p>
                  <p className="text-xs text-gray-500 mt-1">Click camera icon to upload profile picture</p>
                </div>
              </div>
            </div>

            {/* Form Fields */}
            <form onSubmit={handleProfileUpdate} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-gray-900 font-medium">
                  Full Name
                </Label>
                <Input
                  id="fullName"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  required
                  className="w-full h-[45px] bg-[#F9FAFB] border-[#E5E7EB] rounded-xl px-4 py-3"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-900 font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={profile?.email || ""}
                  disabled
                  className="w-full h-[45px] bg-[#F9FAFB] border-[#E5E7EB] rounded-xl px-4 py-3 opacity-60 cursor-not-allowed"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-gray-900 font-medium">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  required
                  className="w-full h-[45px] bg-[#F9FAFB] border-[#E5E7EB] rounded-xl px-4 py-3"
                />
              </div>

              <div className="flex justify-center pt-4">
                <Button 
                  type="submit"
                  disabled={isUpdatingProfile}
                  className="w-[226px] h-[52px] bg-emerald-600 hover:bg-emerald-700 text-white px-[82px] py-[14px] rounded-xl disabled:opacity-50"
                >
                  {isUpdatingProfile ? "Updating..." : "Confirm"}
                </Button>
              </div>
            </form>
          </div>
        )}

        {activeTab === "change-password" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Change Password</h1>
              <p className="text-sm text-gray-600 mt-1">Update your password to keep your account secure</p>
            </div>

            <form onSubmit={handlePasswordChange} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="currentPassword" className="text-gray-900 font-medium">
                  Current Password
                </Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showPasswords.oldPassword ? "text" : "password"}
                    placeholder="Enter current password"
                    value={passwordData.oldPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                    required
                    className="w-full h-[45px] bg-[#F9FAFB] border-[#E5E7EB] rounded-xl px-4 py-3 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords({ ...showPasswords, oldPassword: !showPasswords.oldPassword })}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPasswords.oldPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-gray-900 font-medium">
                  New Password
                </Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showPasswords.newPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    required
                    className="w-full h-[45px] bg-[#F9FAFB] border-[#E5E7EB] rounded-xl px-4 py-3 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords({ ...showPasswords, newPassword: !showPasswords.newPassword })}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPasswords.newPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-900 font-medium">
                  Confirm New Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showPasswords.confirmPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    required
                    className="w-full h-[45px] bg-[#F9FAFB] border-[#E5E7EB] rounded-xl px-4 py-3 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords({ ...showPasswords, confirmPassword: !showPasswords.confirmPassword })}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPasswords.confirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="flex justify-center pt-4">
                <Button 
                  type="submit"
                  disabled={isChangingPassword}
                  className="w-[226px] h-[52px] bg-emerald-600 hover:bg-emerald-700 text-white px-[82px] py-[14px] rounded-xl disabled:opacity-50"
                >
                  {isChangingPassword ? "Updating..." : "Update Password"}
                </Button>
              </div>
            </form>
          </div>
        )}

        {activeTab === "notification" && (
          <div className="space-y-6">
            {/* Notification Rules Card */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-6">
                <Bell className="h-5 w-5 text-gray-700" />
                <h2 className="text-lg font-semibold text-gray-900">Notification Rules</h2>
              </div>

              <div className="space-y-4">
                {/* Failed AI Analysis */}
                <div className="bg-white rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">Failed AI Analysis</h3>
                    <p className="text-sm text-gray-500">Notify when AI analysis fails</p>
                  </div>
                  <Switch
                    checked={notificationSettings.failedAIAnalysis}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({ ...notificationSettings, failedAIAnalysis: checked })
                    }
                    className="data-[state=checked]:bg-emerald-600"
                  />
                </div>

                {/* Payment Failures */}
                <div className="bg-white rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">Payment Failures</h3>
                    <p className="text-sm text-gray-500">Alert on failed payment transactions</p>
                  </div>
                  <Switch
                    checked={notificationSettings.paymentFailures}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({ ...notificationSettings, paymentFailures: checked })
                    }
                    className="data-[state=checked]:bg-emerald-600"
                  />
                </div>

                {/* High Priority Support Tickets */}
                <div className="bg-white rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">High Priority Support Tickets</h3>
                    <p className="text-sm text-gray-500">Immediate notification for urgent tickets</p>
                  </div>
                  <Switch
                    checked={notificationSettings.highPriorityTickets}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({ ...notificationSettings, highPriorityTickets: checked })
                    }
                    className="data-[state=checked]:bg-emerald-600"
                  />
                </div>

                {/* Flagged Content */}
                <div className="bg-white rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">Flagged Content</h3>
                    <p className="text-sm text-gray-500">Alert when videos are flagged</p>
                  </div>
                  <Switch
                    checked={notificationSettings.flaggedContent}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({ ...notificationSettings, flaggedContent: checked })
                    }
                    className="data-[state=checked]:bg-emerald-600"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "privacy-policy" && (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {privacyPolicy?.title || "Privacy Policy"}
                </h1>
                {privacyPolicy?.meta_description && (
                  <p className="text-sm text-gray-600 mt-1">{privacyPolicy.meta_description}</p>
                )}
              </div>
            </div>

            {/* Loading State */}
            {isLoadingPrivacyPolicy && (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading privacy policy...</p>
                </div>
              </div>
            )}

            {/* Privacy Policy Content */}
            {!isLoadingPrivacyPolicy && privacyPolicy && (
              <div className="bg-gray-50 rounded-lg p-6">
                <div 
                  className="prose prose-sm max-w-none text-gray-700"
                  dangerouslySetInnerHTML={{ __html: privacyPolicy.content }}
                  style={{
                    fontSize: '14px',
                    lineHeight: '1.75',
                  }}
                />
                
                {/* Metadata */}
                <div className="mt-8 pt-6 border-t border-gray-200 text-xs text-gray-500 space-y-1">
                  <p>Last updated: {new Date(privacyPolicy.updated_at).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</p>
                  {privacyPolicy.published_at && (
                    <p>Published: {new Date(privacyPolicy.published_at).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</p>
                  )}
                </div>
              </div>
            )}

            {/* Error State */}
            {!isLoadingPrivacyPolicy && !privacyPolicy && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <p className="text-red-600">Failed to load privacy policy. Please try again later.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "terms" && (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {termsConditions?.title || "Terms & Conditions"}
                </h1>
                {termsConditions?.meta_description && (
                  <p className="text-sm text-gray-600 mt-1">{termsConditions.meta_description}</p>
                )}
              </div>
            </div>

            {/* Loading State */}
            {isLoadingTermsConditions && (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading terms & conditions...</p>
                </div>
              </div>
            )}

            {/* Terms & Conditions Content */}
            {!isLoadingTermsConditions && termsConditions && (
              <div className="bg-gray-50 rounded-lg p-6">
                <div 
                  className="prose prose-sm max-w-none text-gray-700"
                  dangerouslySetInnerHTML={{ __html: termsConditions.content }}
                  style={{
                    fontSize: '14px',
                    lineHeight: '1.75',
                  }}
                />
                
                {/* Metadata */}
                <div className="mt-8 pt-6 border-t border-gray-200 text-xs text-gray-500 space-y-1">
                  <p>Last updated: {new Date(termsConditions.updated_at).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</p>
                  {termsConditions.published_at && (
                    <p>Published: {new Date(termsConditions.published_at).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</p>
                  )}
                </div>
              </div>
            )}

            {/* Error State */}
            {!isLoadingTermsConditions && !termsConditions && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <p className="text-red-600">Failed to load terms & conditions. Please try again later.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
