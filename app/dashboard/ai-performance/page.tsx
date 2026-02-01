"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatsCard } from "@/components/common/StatsCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Brain,
  Cpu,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface AIFailure {
  id: string;
  videoId: string;
  videoTitle: string;
  errorType: string;
  errorMessage: string;
  timestamp: string;
  resolved: boolean;
}

const mockFailures: AIFailure[] = [
  {
    id: "1",
    videoId: "v1",
    videoTitle: "Golf Swing Practice",
    errorType: "Processing Error",
    errorMessage: "Video codec not supported",
    timestamp: "2024-02-01 10:30",
    resolved: false,
  },
  {
    id: "2",
    videoId: "v2",
    videoTitle: "Putting Analysis",
    errorType: "Model Error",
    errorMessage: "Insufficient frames for analysis",
    timestamp: "2024-02-01 09:15",
    resolved: false,
  },
  {
    id: "3",
    videoId: "v3",
    videoTitle: "Drive Practice",
    errorType: "Timeout",
    errorMessage: "Analysis exceeded time limit",
    timestamp: "2024-01-31 16:45",
    resolved: true,
  },
  {
    id: "4",
    videoId: "v4",
    videoTitle: "Chip Shot Review",
    errorType: "Processing Error",
    errorMessage: "Video resolution too low",
    timestamp: "2024-01-31 14:20",
    resolved: false,
  },
];

const performanceData = [
  { time: "00:00", success: 98, avgTime: 12 },
  { time: "04:00", success: 97, avgTime: 14 },
  { time: "08:00", success: 95, avgTime: 18 },
  { time: "12:00", success: 94, avgTime: 22 },
  { time: "16:00", success: 96, avgTime: 16 },
  { time: "20:00", success: 98, avgTime: 13 },
];

export default function AIPerformancePage() {
  const [failures, setFailures] = useState<AIFailure[]>(mockFailures);

  const handleRetry = (failureId: string) => {
    setFailures(
      failures.map((f) =>
        f.id === failureId ? { ...f, resolved: true } : f
      )
    );
  };

  const unresolvedCount = failures.filter((f) => !f.resolved).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Performance"
        description="Monitor AI analysis metrics and system health"
      />

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Analyses"
          value="48,392"
          icon={Brain}
          iconColor="text-purple-600"
          iconBgColor="bg-purple-50"
          change={15.3}
        />
        <StatsCard
          title="Success Rate"
          value="96.8%"
          icon={CheckCircle}
          iconColor="text-emerald-600"
          iconBgColor="bg-emerald-50"
          change={2.1}
        />
        <StatsCard
          title="Avg Processing Time"
          value="15.4s"
          icon={Clock}
          iconColor="text-blue-600"
          iconBgColor="bg-blue-50"
          change={-8.2}
        />
        <StatsCard
          title="Failed Analyses"
          value={unresolvedCount}
          icon={XCircle}
          iconColor="text-red-600"
          iconBgColor="bg-red-50"
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Success Rate Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Success Rate (24h)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="time"
                    tick={{ fontSize: 12 }}
                    stroke="#9ca3af"
                  />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    stroke="#9ca3af"
                    domain={[90, 100]}
                  />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="success"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ fill: "#10b981", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Processing Time Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Avg Processing Time (24h)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="time"
                    tick={{ fontSize: 12 }}
                    stroke="#9ca3af"
                  />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    stroke="#9ca3af"
                    unit="s"
                  />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="avgTime"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    dot={{ fill: "#8b5cf6", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Failures Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold">
            Recent Failures
          </CardTitle>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs font-medium uppercase text-gray-500">
                  Video
                </TableHead>
                <TableHead className="text-xs font-medium uppercase text-gray-500">
                  Error Type
                </TableHead>
                <TableHead className="text-xs font-medium uppercase text-gray-500">
                  Message
                </TableHead>
                <TableHead className="text-xs font-medium uppercase text-gray-500">
                  Timestamp
                </TableHead>
                <TableHead className="text-xs font-medium uppercase text-gray-500">
                  Status
                </TableHead>
                <TableHead className="text-xs font-medium uppercase text-gray-500">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {failures.map((failure) => (
                <TableRow key={failure.id}>
                  <TableCell className="font-medium text-gray-900">
                    {failure.videoTitle}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-red-100 text-red-700">
                      {failure.errorType}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-600 max-w-[200px] truncate">
                    {failure.errorMessage}
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {failure.timestamp}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={
                        failure.resolved
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-yellow-100 text-yellow-700"
                      }
                    >
                      {failure.resolved ? "Resolved" : "Pending"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {!failure.resolved && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1"
                        onClick={() => handleRetry(failure.id)}
                      >
                        <RefreshCw className="h-4 w-4" />
                        Retry
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
