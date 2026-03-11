"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Bell } from "lucide-react";

export default function Notifications() {
  const [notificationSettings, setNotificationSettings] = useState({
    failedAIAnalysis: true,
    paymentFailures: true,
    highPriorityTickets: true,
    flaggedContent: true,
  });

  const rules = [
    {
      key: "failedAIAnalysis" as const,
      title: "Failed AI Analysis",
      description: "Notify when AI analysis fails",
    },
    {
      key: "paymentFailures" as const,
      title: "Payment Failures",
      description: "Alert on failed payment transactions",
    },
    {
      key: "highPriorityTickets" as const,
      title: "High Priority Support Tickets",
      description: "Immediate notification for urgent tickets",
    },
    {
      key: "flaggedContent" as const,
      title: "Flagged Content",
      description: "Alert when videos are flagged",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-6">
          <Bell className="h-5 w-5 text-gray-700" />
          <h2 className="text-lg font-semibold text-gray-900">Notification Rules</h2>
        </div>

        <div className="space-y-4">
          {rules.map(({ key, title, description }) => (
            <div key={key} className="bg-white rounded-lg p-4 flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">{title}</h3>
                <p className="text-sm text-gray-500">{description}</p>
              </div>
              <Switch
                checked={notificationSettings[key]}
                onCheckedChange={(checked) =>
                  setNotificationSettings({ ...notificationSettings, [key]: checked })
                }
                className="data-[state=checked]:bg-emerald-600"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
