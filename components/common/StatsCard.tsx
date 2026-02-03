"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon?: LucideIcon;
  iconColor?: string;
  iconBgColor?: string;
}

export function StatsCard({
  title,
  value,
  change,
  icon: Icon,
  iconColor = "text-emerald-600",
  iconBgColor = "bg-emerald-50",
}: StatsCardProps) {
  return (
    <Card className="border-[#E5E7EB]">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-gray-500">
          {title}
        </CardTitle>
        {Icon && (
          <div className={cn("rounded-lg p-2", iconBgColor)}>
            <Icon className={cn("h-5 w-5", iconColor)} />
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-xl sm:text-2xl font-bold text-gray-900">{value}</div>
        {change !== undefined && (
          <p
            className={cn(
              "mt-1 text-sm",
              change >= 0 ? "text-emerald-600" : "text-red-600"
            )}
          >
            {change >= 0 ? "+" : ""}
            {change}% from last month
          </p>
        )}
      </CardContent>
    </Card>
  );
}
