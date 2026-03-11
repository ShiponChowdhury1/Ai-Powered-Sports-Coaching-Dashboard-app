"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useGetProfileQuery, useUpdateProfileMutation } from "@/store/api/profileApi";
import { toast } from "sonner";
import { Camera } from "lucide-react";

export default function AdminInformation() {
  const { data: profile, isLoading, error } = useGetProfileQuery();
  const [updateProfile, { isLoading: isUpdatingProfile }] = useUpdateProfileMutation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profileData, setProfileData] = useState({ name: "", phone: "" });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>("");

  useEffect(() => {
    if (profile) {
      setProfileData({ name: profile.name, phone: profile.phone });
      setPreviewImage(profile.image);
    }
  }, [profile]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", profileData.name);
    formData.append("phone", profileData.phone);
    if (selectedImage) formData.append("image", selectedImage);

    try {
      const result = await updateProfile(formData).unwrap();
      toast.success(result.message || "Profile updated successfully");
      setSelectedImage(null);
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message || "Failed to update profile");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-lg text-gray-600">Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-lg text-red-600">Error loading profile. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Information</h1>
        <p className="text-sm text-gray-600 mt-1">Update your store details and branding</p>
      </div>

      {/* Profile Picture */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Avatar className="w-20 h-20">
              <AvatarImage src={previewImage} alt={profileData.name} />
              <AvatarFallback className="text-2xl bg-emerald-100 text-emerald-700">
                {profileData.name?.charAt(0)?.toUpperCase() || "A"}
              </AvatarFallback>
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

      {/* Form */}
      <form onSubmit={handleProfileUpdate} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="fullName" className="text-gray-900 font-medium">Full Name</Label>
          <Input
            id="fullName"
            value={profileData.name}
            onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
            required
            className="w-full h-[45px] bg-[#F9FAFB] border-[#E5E7EB] rounded-xl px-4 py-3"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-gray-900 font-medium">Email</Label>
          <Input
            id="email"
            type="email"
            value={profile?.email || ""}
            disabled
            className="w-full h-[45px] bg-[#F9FAFB] border-[#E5E7EB] rounded-xl px-4 py-3 opacity-60 cursor-not-allowed"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="text-gray-900 font-medium">Phone Number</Label>
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
  );
}
