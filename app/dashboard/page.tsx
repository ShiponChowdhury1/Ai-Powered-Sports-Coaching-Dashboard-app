"use client";

import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/common/PageHeader";
import { StatsCard } from "@/components/common/StatsCard";
import { Users, Video, DollarSign, TrendingUp, AlertCircle } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

// Mock data for demonstration
const userGrowthData = [
  { month: "Jan", users: 7200 },
  { month: "Feb", users: 8400 },
  { month: "Mar", users: 9100 },
  { month: "Apr", users: 10200 },
  { month: "May", users: 10800 },
  { month: "Jun", users: 11200 },
  { month: "Jul", users: 11500 },
  { month: "Aug", users: 11800 },
  { month: "Sep", users: 12000 },
  { month: "Oct", users: 12100 },
  { month: "Nov", users: 12300 },
  { month: "Dec", users: 12458 },
];

const videoUploadsData = [
  { month: "Aug", uploads: 4200 },
  { month: "Aug", uploads: 5100 },
  { month: "Aug", uploads: 4800 },
  { month: "Aug", uploads: 6200 },
  { month: "Aug", uploads: 5500 },
  { month: "Aug", uploads: 7200 },
  { month: "Aug", uploads: 6800 },
  { month: "Aug", uploads: 5900 },
  { month: "Aug", uploads: 4500 },
  { month: "Aug", uploads: 6100 },
  { month: "Aug", uploads: 5800 },
  { month: "Aug", uploads: 7500 },
];

const subscriptionData = [
  { plan: "Free", count: 8500 },
  { plan: "Monthly", count: 2100 },
  { plan: "3-Month", count: 980 },
  { plan: "Yearly", count: 450 },
];

const quickActions = [
  {
    id: "1",
    title: "Flagged Videos",
    count: 8,
    action: "Review Now",
    actionColor: "text-red-600",
  },
  {
    id: "2",
    title: "AI Failures",
    count: 12,
    action: "View Details",
    actionColor: "text-gray-600",
  },
  {
    id: "3",
    title: "Support Tickets",
    count: 23,
    action: "Respond",
    actionColor: "text-gray-900",
  },
  {
    id: "4",
    title: "Failed Payments",
    count: 5,
    action: "Investigate",
    actionColor: "text-red-600",
  },
];

export default function DashboardPage() {
  useEffect(() => {
    // In production, dispatch fetchDashboardStats() here
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard Overview"
        description="Real-time platform metrics and insights"
      />

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Registered Users"
          value="12,458"
          change={12.5}
          icon={Users}
          iconColor="text-emerald-600"
          iconBgColor="bg-emerald-50"
        />
        <StatsCard
          title="Active Subscribers"
          value="3,247"
          change={8.2}
          icon={TrendingUp}
          iconColor="text-emerald-600"
          iconBgColor="bg-emerald-50"
        />
        <StatsCard
          title="Total Videos Uploaded"
          value="48,392"
          change={15.3}
          icon={Video}
          iconColor="text-purple-600"
          iconBgColor="bg-purple-50"
        />
        <StatsCard
          title="Monthly Revenue"
          value="$84,250"
          change={18.7}
          icon={DollarSign}
          iconColor="text-emerald-600"
          iconBgColor="bg-emerald-50"
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* User Growth Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              User Growth (1 Years)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={userGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 12 }}
                    stroke="#9ca3af"
                  />
                  <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="users"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ fill: "#10b981", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Video Uploads Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Video Upload (1 Years)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={videoUploadsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 12 }}
                    stroke="#9ca3af"
                  />
                  <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                  <Tooltip />
                  <Bar dataKey="uploads" fill="#a855f7" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Subscription Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Subscription Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={subscriptionData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis type="number" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                  <YAxis
                    type="category"
                    dataKey="plan"
                    tick={{ fontSize: 12 }}
                    stroke="#9ca3af"
                    width={80}
                  />
                  <Tooltip />
                  <Bar dataKey="count" fill="#10b981" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {quickActions.map((action) => (
              <div
                key={action.id}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50">
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{action.title}</p>
                    <p className="text-sm text-gray-500">
                      {action.count} items need attention
                    </p>
                  </div>
                </div>
                <Button
                  variant={action.actionColor === "text-gray-900" ? "outline" : "ghost"}
                  className={action.actionColor}
                >
                  {action.action}
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
