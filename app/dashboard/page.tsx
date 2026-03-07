"use client";

import { useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/common/PageHeader";
import { StatsCard } from "@/components/common/StatsCard";
import { Users, UserCheck, UserPlus, Activity, AlertCircle } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchDashboardStats,
  fetchUserRegistrationChart,
} from "@/features/dashboard/dashboardSlice";
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

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const { stats, userRegistrationChart, loading } = useAppSelector(
    (state) => state.dashboard
  );

  useEffect(() => {
    dispatch(fetchDashboardStats());
    dispatch(fetchUserRegistrationChart(30));
  }, [dispatch]);

  const chartData = useMemo(() => {
    if (!userRegistrationChart) return [];
    return userRegistrationChart.labels.map((label, index) => ({
      date: label,
      users: userRegistrationChart.datasets[0]?.data[index] || 0,
    }));
  }, [userRegistrationChart]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard Overview"
        description="Real-time platform metrics and insights"
      />

      {/* Stats Cards */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Users"
          value={loading ? "..." : (stats?.total_users?.toLocaleString() ?? "0")}
          icon={Users}
          iconColor="text-emerald-600"
          iconBgColor="bg-emerald-50"
        />
        <StatsCard
          title="Active Users"
          value={loading ? "..." : (stats?.active_users?.toLocaleString() ?? "0")}
          icon={UserCheck}
          iconColor="text-blue-600"
          iconBgColor="bg-blue-50"
        />
        <StatsCard
          title="Total Subscribers"
          value={loading ? "..." : (stats?.total_subscribers?.toLocaleString() ?? "0")}
          icon={UserPlus}
          iconColor="text-purple-600"
          iconBgColor="bg-purple-50"
        />
        <StatsCard
          title="Active Subscribers"
          value={loading ? "..." : (stats?.active_subscribers?.toLocaleString() ?? "0")}
          icon={Activity}
          iconColor="text-emerald-600"
          iconBgColor="bg-emerald-50"
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
        {/* User Registration Chart */}
        <Card className="border-[#E5E7EB]">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              User Registrations (Last 30 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] sm:h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12 }}
                    stroke="#9ca3af"
                    interval="preserveStartEnd"
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

        {/* New Users Summary */}
        <Card className="border-[#E5E7EB]">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              New Users Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center justify-between rounded-lg border border-[#E5E7EB] p-4">
                <span className="text-sm font-medium text-gray-500">New Today</span>
                <span className="text-xl font-bold text-gray-900">
                  {loading ? "..." : (stats?.new_users_today ?? 0)}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-[#E5E7EB] p-4">
                <span className="text-sm font-medium text-gray-500">New This Week</span>
                <span className="text-xl font-bold text-gray-900">
                  {loading ? "..." : (stats?.new_users_this_week ?? 0)}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-[#E5E7EB] p-4">
                <span className="text-sm font-medium text-gray-500">New This Month</span>
                <span className="text-xl font-bold text-gray-900">
                  {loading ? "..." : (stats?.new_users_this_month ?? 0)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      {stats?.recent_activities && stats.recent_activities.length > 0 && (
        <Card className="border-[#E5E7EB]">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Recent Activities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats.recent_activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between rounded-lg border border-[#E5E7EB] p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50">
                    <Activity className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{activity.description}</p>
                    <p className="text-sm text-gray-500">
                      {activity.user} - {activity.action}
                    </p>
                  </div>
                </div>
                <span className="text-sm text-gray-400">
                  {new Date(activity.timestamp).toLocaleDateString()}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
