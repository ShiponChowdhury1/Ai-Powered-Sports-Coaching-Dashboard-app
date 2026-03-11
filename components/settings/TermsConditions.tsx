"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useGetTermsConditionsQuery,
  useUpdateTermsConditionsMutation,
} from "@/store/api/privacyPolicyApi";
import RichTextEditor from "./RichTextEditor";
import { toast } from "sonner";

export default function TermsConditions() {
  const { data: termsConditions, isLoading } = useGetTermsConditionsQuery();
  const [updateTermsConditions, { isLoading: isUpdating }] = useUpdateTermsConditionsMutation();

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: "",
    content: "",
    meta_description: "",
  });

  useEffect(() => {
    if (termsConditions) {
      setEditData({
        title: termsConditions.title,
        content: termsConditions.content,
        meta_description: termsConditions.meta_description,
      });
    }
  }, [termsConditions]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await updateTermsConditions({
        title: editData.title,
        content: editData.content,
        meta_description: editData.meta_description,
        is_published: true,
        published_at: new Date().toISOString(),
      }).unwrap();
      toast.success(result.message || "Terms & Conditions updated successfully");
      setIsEditing(false);
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message || "Failed to update terms & conditions");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {termsConditions?.title || "Terms & Conditions"}
          </h1>
          {!isEditing && termsConditions?.meta_description && (
            <p className="text-sm text-gray-600 mt-1">{termsConditions.meta_description}</p>
          )}
        </div>
        {!isEditing && termsConditions && (
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
            <p className="mt-4 text-gray-600">Loading terms &amp; conditions...</p>
          </div>
        </div>
      )}

      {/* Edit Mode */}
      {isEditing && termsConditions && (
        <form onSubmit={handleUpdate} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="tc-title" className="text-gray-900 font-medium">
              Title
            </Label>
            <Input
              id="tc-title"
              value={editData.title}
              onChange={(e) => setEditData({ ...editData, title: e.target.value })}
              required
              className="w-full h-[45px] bg-[#F9FAFB] border-[#E5E7EB] rounded-xl px-4 py-3"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tc-meta" className="text-gray-900 font-medium">
              Meta Description
            </Label>
            <Input
              id="tc-meta"
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
      {!isEditing && !isLoading && termsConditions && (
        <div className="bg-gray-50 rounded-lg p-6">
          <div
            className="rte-view-content"
            dangerouslySetInnerHTML={{ __html: termsConditions.content }}
          />
          <div className="mt-8 pt-6 border-t border-gray-200 text-xs text-gray-500 space-y-1">
            <p>
              Last updated:{" "}
              {new Date(termsConditions.updated_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            {termsConditions.published_at && (
              <p>
                Published:{" "}
                {new Date(termsConditions.published_at).toLocaleDateString("en-US", {
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
      {!isLoading && !termsConditions && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600">Failed to load terms &amp; conditions. Please try again later.</p>
        </div>
      )}
    </div>
  );
}
