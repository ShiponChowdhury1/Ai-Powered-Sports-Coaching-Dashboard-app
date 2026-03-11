"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGetProfileQuery, useUpdateProfileMutation } from "@/store/api/profileApi";
import { toast } from "sonner";

interface AdminInformationProps {
  previewImage: string;
  selectedImage: File | null;
  onImageSaved: () => void;
}

export default function AdminInformation({ selectedImage, onImageSaved }: AdminInformationProps) {
  const { data: profile, isLoading, error } = useGetProfileQuery();
  const [updateProfile, { isLoading: isUpdatingProfile }] = useUpdateProfileMutation();

  const [profileData, setProfileData] = useState({ name: "", phone: "" });

  useEffect(() => {
    if (profile) {
      setProfileData({ name: profile.name, phone: profile.phone });
    }
  }, [profile]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", profileData.name);
    formData.append("phone", profileData.phone);
    if (selectedImage) formData.append("image", selectedImage);

    try {
      const result = await updateProfile(formData).unwrap();
      toast.success(result.message || "Profile updated successfully");
      onImageSaved();
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

      <div className="w-full md:w-1/2 bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
        <form onSubmit={handleProfileUpdate} className="space-y-5">
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

          <div className="flex justify-center pt-2">
            <Button
              type="submit"
              disabled={isUpdatingProfile}
              className="w-full h-[48px] bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl disabled:opacity-50"
            >
              {isUpdatingProfile ? "Updating..." : "Confirm"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
