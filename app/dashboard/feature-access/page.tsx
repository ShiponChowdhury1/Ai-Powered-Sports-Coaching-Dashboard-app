"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Check, X } from "lucide-react";
import {
  useGetFeatureAccessQuery,
  useUpdateFeatureAccessMutation,
} from "@/store/api/featureAccessApi";
import { toast } from "sonner";

// Fallback mock data when API is loading or unavailable
const defaultPlans = [
  { id: 1, name: "Free", price: "$0", billing_cycle: "" },
  { id: 2, name: "Monthly", price: "$29.99", billing_cycle: "/mo" },
  { id: 3, name: "3-Month", price: "$74.99", billing_cycle: "" },
  { id: 4, name: "Yearly", price: "$249.99", billing_cycle: "/yr" },
  { id: 5, name: "School", price: "$999.99", billing_cycle: "/yr" },
];

const defaultFeatures = [
  { id: 1, name: "Upload Limit", description: "Maximum number of videos per month", values: { Free: "5 videos", Monthly: "50 videos", "3-Month": "150 videos", Yearly: "Unlimited", School: "Unlimited" } },
  { id: 2, name: "AI Feedback Depth", description: "Level of AI analysis detail", values: { Free: "Basic", Monthly: "Advanced", "3-Month": "Advanced", Yearly: "Expert", School: "Expert" } },
  { id: 3, name: "Screenshot Feedback", description: "Visual overlay on swing positions", values: { Free: false, Monthly: true, "3-Month": true, Yearly: true, School: true } },
  { id: 4, name: "Progress Analytics", description: "Track improvement over time", values: { Free: false, Monthly: true, "3-Month": true, Yearly: true, School: true } },
  { id: 5, name: "Training Plans", description: "Access to structured training programs", values: { Free: false, Monthly: true, "3-Month": true, Yearly: true, School: true } },
  { id: 6, name: "Custom Drills", description: "Personalized drill recommendations", values: { Free: false, Monthly: true, "3-Month": true, Yearly: true, School: true } },
  { id: 7, name: "Video Comparisons", description: "Side-by-side swing comparison", values: { Free: false, Monthly: false, "3-Month": true, Yearly: true, School: true } },
  { id: 8, name: "Export Reports", description: "Download progress and analysis reports", values: { Free: false, Monthly: false, "3-Month": false, Yearly: true, School: true } },
  { id: 9, name: "Priority Support", description: "24/7 priority customer support", values: { Free: false, Monthly: false, "3-Month": false, Yearly: true, School: true } },
  { id: 10, name: "Multi-User Management", description: "Manage multiple student accounts", values: { Free: false, Monthly: false, "3-Month": false, Yearly: false, School: true } },
];

export default function FeatureAccessPage() {
  const { data, isLoading } = useGetFeatureAccessQuery();
  const [updateFeatureAccess] = useUpdateFeatureAccessMutation();
  const [editedCells, setEditedCells] = useState<Record<string, string | boolean>>({});

  const plans = data?.plans || defaultPlans;
  const features = data?.features || defaultFeatures;

  const getCellKey = (featureId: number, planName: string) => `${featureId}-${planName}`;

  const getValue = (feature: typeof features[0], planName: string) => {
    const key = getCellKey(feature.id, planName);
    if (key in editedCells) return editedCells[key];
    return (feature.values as Record<string, string | boolean>)[planName];
  };

  const handleToggle = (feature: typeof features[0], planName: string) => {
    const currentValue = getValue(feature, planName);
    if (typeof currentValue === "boolean") {
      const key = getCellKey(feature.id, planName);
      setEditedCells((prev) => ({ ...prev, [key]: !currentValue }));
    }
  };

  const handleTextEdit = (feature: typeof features[0], planName: string) => {
    const currentValue = getValue(feature, planName);
    if (typeof currentValue === "string") {
      const newValue = prompt("Edit value:", currentValue);
      if (newValue !== null && newValue !== currentValue) {
        const key = getCellKey(feature.id, planName);
        setEditedCells((prev) => ({ ...prev, [key]: newValue }));
      }
    }
  };

  const handleSave = async () => {
    try {
      for (const [key, value] of Object.entries(editedCells)) {
        const [featureId, ...planParts] = key.split("-");
        const planName = planParts.join("-");
        const plan = plans.find((p) => p.name === planName);
        if (plan) {
          await updateFeatureAccess({ featureId: Number(featureId), planId: plan.id, value }).unwrap();
        }
      }
      toast.success("Feature access updated successfully");
      setEditedCells({});
    } catch {
      toast.error("Failed to update feature access");
    }
  };

  const hasChanges = Object.keys(editedCells).length > 0;

  const renderCellValue = (feature: typeof features[0], planName: string) => {
    const value = getValue(feature, planName);
    const key = getCellKey(feature.id, planName);
    const isEdited = key in editedCells;

    if (typeof value === "boolean") {
      return (
        <button
          onClick={() => handleToggle(feature, planName)}
          className={`flex items-center justify-center w-full ${isEdited ? "opacity-80" : ""}`}
        >
          {value ? (
            <Check className="h-5 w-5 text-emerald-500" />
          ) : (
            <X className="h-5 w-5 text-red-400" />
          )}
        </button>
      );
    }

    return (
      <button
        onClick={() => handleTextEdit(feature, planName)}
        className={`text-sm text-gray-700 hover:underline cursor-pointer ${isEdited ? "bg-yellow-50 px-2 py-0.5 rounded" : ""}`}
      >
        {value}
      </button>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Feature Access Control" description="Configure feature availability for each subscription plan" />
        <div className="flex items-center justify-center h-64 text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Feature Access Control"
        description="Configure feature availability for each subscription plan"
      />

      {/* Info Banner */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3">
        <p className="text-sm text-emerald-700">
          Toggle features on/off for boolean values (checkmarks). Text values can be edited by clicking on them. Changes will be highlighted until saved.
        </p>
      </div>

      {/* Feature Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-gray-200">
              <TableHead className="font-semibold text-gray-900 min-w-[200px]">Feature</TableHead>
              {plans.map((plan) => (
                <TableHead key={plan.id} className="text-center min-w-[120px]">
                  <div className="font-semibold text-gray-900">{plan.name}</div>
                  <div className="text-xs text-gray-500 font-normal">{plan.price}{plan.billing_cycle}</div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {features.map((feature) => (
              <TableRow key={feature.id} className="border-b border-gray-100 hover:bg-gray-50">
                <TableCell>
                  <div>
                    <div className="font-medium text-gray-900 text-sm">{feature.name}</div>
                    <div className="text-xs text-gray-500">{feature.description}</div>
                  </div>
                </TableCell>
                {plans.map((plan) => (
                  <TableCell key={plan.id} className="text-center">
                    {renderCellValue(feature, plan.name)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Save Button */}
      {hasChanges && (
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
}
