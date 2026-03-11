"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useGetPrivacyPolicyQuery,
  useUpdatePrivacyPolicyMutation,
} from "@/store/api/privacyPolicyApi";
import RichTextEditor from "./RichTextEditor";
import { toast } from "sonner";

export default function PrivacyPolicy() {
  const { data: privacyPolicy, isLoading } = useGetPrivacyPolicyQuery();
  const [updatePrivacyPolicy, { isLoading: isUpdating }] = useUpdatePrivacyPolicyMutation();

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: "",
    content: "",
    meta_description: "",
  });

  useEffect(() => {
    if (privacyPolicy) {
      setEditData({
        title: privacyPolicy.title,
        content: privacyPolicy.content,
        meta_description: privacyPolicy.meta_description,
      });
    }
  }, [privacyPolicy]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await updatePrivacyPolicy({
        title: editData.title,
        content: editData.content,
        meta_description: editData.meta_description,
        is_published: true,
        published_at: new Date().toISOString(),
      }).unwrap();
      toast.success(result.message || "Privacy policy updated successfully");
      setIsEditing(false);
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message || "Failed to update privacy policy");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {privacyPolicy?.title || "Privacy Policy"}
          </h1>
          {!isEditing && privacyPolicy?.meta_description && (
            <p className="text-sm text-gray-600 mt-1">{privacyPolicy.meta_description}</p>
          )}
        </div>
        {!isEditing && privacyPolicy && (
          <Button
            onClick={() => setIsEditing(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6"
          >
            Edit
          </Button>
        )}
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent mx-auto" />
            <p className="mt-4 text-gray-600">Loading privacy policy...</p>
          </div>
        </div>
      )}

      {/* Edit Mode */}
      {isEditing && privacyPolicy && (
        <form onSubmit={handleUpdate} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="pp-title" className="text-gray-900 font-medium">
              Title
            </Label>
            <Input
              id="pp-title"
              value={editData.title}
              onChange={(e) => setEditData({ ...editData, title: e.target.value })}
              required
              className="w-full h-[45px] bg-[#F9FAFB] border-[#E5E7EB] rounded-xl px-4 py-3"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pp-meta" className="text-gray-900 font-medium">
              Meta Description
            </Label>
            <Input
              id="pp-meta"
              value={editData.meta_description}
              onChange={(e) => setEditData({ ...editData, meta_description: e.target.value })}
              className="w-full h-[45px] bg-[#F9FAFB] border-[#E5E7EB] rounded-xl px-4 py-3"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-gray-900 font-medium">Content</Label>
            <RichTextEditor
              content={editData.content}
              onChange={(html) => setEditData({ ...editData, content: html })}
              minHeight="400px"
            />
          </div>

          <div className="flex justify-center gap-3 pt-4">
            <Button
              type="button"
              onClick={() => setIsEditing(false)}
              variant="outline"
              className="w-[150px] h-[52px] border-[#E5E7EB]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isUpdating}
              className="w-[150px] h-[52px] bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl disabled:opacity-50"
            >
              {isUpdating ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      )}

      {/* View Mode */}
      {!isEditing && !isLoading && privacyPolicy && (
        <div className="bg-gray-50 rounded-lg p-6">
          <div
            className="rte-view-content"
            dangerouslySetInnerHTML={{ __html: privacyPolicy.content }}
          />
          <div className="mt-8 pt-6 border-t border-gray-200 text-xs text-gray-500 space-y-1">
            <p>
              Last updated:{" "}
              {new Date(privacyPolicy.updated_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            {privacyPolicy.published_at && (
              <p>
                Published:{" "}
                {new Date(privacyPolicy.published_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Error */}
      {!isLoading && !privacyPolicy && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600">Failed to load privacy policy. Please try again later.</p>
        </div>
      )}
    </div>
  );
}
