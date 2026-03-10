"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import {
  Filter,
  Play,
  RefreshCw,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
} from "lucide-react";
import {
  useGetVideosQuery,
  useReprocessVideoMutation,
  useDeleteVideoMutation,
  type VideoItem,
} from "@/store/api/videosApi";
import { toast } from "sonner";
import Image from "next/image";

const aiStatusConfig: Record<string, { icon: typeof CheckCircle; color: string; bg: string }> = {
  Completed: { icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50" },
  Processing: { icon: Clock, color: "text-blue-600", bg: "bg-blue-50" },
  Failed: { icon: XCircle, color: "text-red-600", bg: "bg-red-50" },
  Pending: { icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-50" },
};

const flagStatusColors: Record<string, { bg: string; text: string }> = {
  None: { bg: "bg-gray-100", text: "text-gray-600" },
  Flagged: { bg: "bg-red-100", text: "text-red-700" },
  Reviewed: { bg: "bg-blue-100", text: "text-blue-700" },
};

// Fallback mock data
const mockVideos: VideoItem[] = [
  { id: 1, title: "Driver Swing Practice", thumbnail: "", duration: "0:45", user_name: "John Smith", user_email: "john.smith@email.com", upload_date: "2026-01-23 09:15", ai_status: "Completed", flag_status: "None" },
  { id: 2, title: "Putting Drill", thumbnail: "", duration: "1:20", user_name: "Sarah Johnson", user_email: "sarah.j@email.com", upload_date: "2026-01-23 08:32", ai_status: "Completed", flag_status: "None" },
  { id: 3, title: "Chipping Technique", thumbnail: "", duration: "0:38", user_name: "Mike Davis", user_email: "mdavis@email.com", upload_date: "2026-01-23 07:48", ai_status: "Failed", flag_status: "Flagged" },
  { id: 4, title: "Full Swing Analysis", thumbnail: "", duration: "1:05", user_name: "Emily Wilson", user_email: "emily.w@email.com", upload_date: "2026-01-22 18:25", ai_status: "Processing", flag_status: "None" },
  { id: 5, title: "Iron Shot Practice", thumbnail: "", duration: "0:52", user_name: "David Brown", user_email: "dbrown@email.com", upload_date: "2026-01-22 16:15", ai_status: "Completed", flag_status: "Reviewed" },
  { id: 6, title: "Bunker Shot Training", thumbnail: "", duration: "1:15", user_name: "Lisa Anderson", user_email: "l.anderson@email.com", upload_date: "2026-01-22 14:40", ai_status: "Pending", flag_status: "None" },
  { id: 7, title: "Wood Shot Technique", thumbnail: "", duration: "0:48", user_name: "Robert Taylor", user_email: "rtaylor@email.com", upload_date: "2026-01-22 12:20", ai_status: "Failed", flag_status: "Flagged" },
  { id: 8, title: "Approach Shot Practice", thumbnail: "", duration: "1:30", user_name: "Jennifer Lee", user_email: "jlee@email.com", upload_date: "2026-01-22 10:05", ai_status: "Completed", flag_status: "None" },
];

export default function VideosPage() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [flagFilter, setFlagFilter] = useState<string>("all");
  const { data, isLoading } = useGetVideosQuery({ status: statusFilter !== "all" ? statusFilter : undefined, flag: flagFilter !== "all" ? flagFilter : undefined });
  const [reprocessVideo] = useReprocessVideoMutation();
  const [deleteVideo] = useDeleteVideoMutation();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedVideoId, setSelectedVideoId] = useState<number | null>(null);

  const videos = data?.results || mockVideos;
  const stats = data?.stats || {
    total_videos: mockVideos.length,
    completed: mockVideos.filter((v) => v.ai_status === "Completed").length,
    processing: mockVideos.filter((v) => v.ai_status === "Processing").length,
    failed: mockVideos.filter((v) => v.ai_status === "Failed").length,
    flagged: mockVideos.filter((v) => v.flag_status === "Flagged").length,
  };

  const filteredVideos = videos.filter((v) => {
    if (statusFilter !== "all" && v.ai_status !== statusFilter) return false;
    if (flagFilter !== "all" && v.flag_status !== flagFilter) return false;
    return true;
  });

  const handleReprocess = async (id: number) => {
    try {
      await reprocessVideo(id).unwrap();
      toast.success("Video reprocessing started");
    } catch {
      toast.error("Failed to reprocess video");
    }
  };

  const handleDeleteClick = (id: number) => {
    setSelectedVideoId(id);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedVideoId) return;
    try {
      await deleteVideo(selectedVideoId).unwrap();
      toast.success("Video deleted successfully");
      setDeleteModalOpen(false);
      setSelectedVideoId(null);
    } catch {
      toast.error("Failed to delete video");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Videos & Uploads" description="Monitor and manage all video uploads and AI analysis" />
        <div className="flex items-center justify-center h-64 text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Videos & Uploads"
        description="Monitor and manage all video uploads and AI analysis"
      />

      {/* Stats Cards */}
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
        <Card className="bg-white border-gray-200">
          <CardContent className="p-4">
            <p className="text-xs text-gray-500">Total Videos</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total_videos}</p>
          </CardContent>
        </Card>
        <Card className="bg-white border-gray-200">
          <CardContent className="p-4">
            <p className="text-xs text-gray-500">Completed</p>
            <p className="text-2xl font-bold text-emerald-600">{stats.completed}</p>
          </CardContent>
        </Card>
        <Card className="bg-white border-gray-200">
          <CardContent className="p-4">
            <p className="text-xs text-gray-500">Processing</p>
            <p className="text-2xl font-bold text-blue-600">{stats.processing}</p>
          </CardContent>
        </Card>
        <Card className="bg-white border-gray-200">
          <CardContent className="p-4">
            <p className="text-xs text-gray-500">Failed</p>
            <p className="text-2xl font-bold text-red-600">{stats.failed}</p>
          </CardContent>
        </Card>
        <Card className="bg-white border-gray-200">
          <CardContent className="p-4">
            <p className="text-xs text-gray-500">Flagged</p>
            <p className="text-2xl font-bold text-amber-600">{stats.flagged}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 bg-white p-4 rounded-lg border border-gray-200">
        <Filter className="h-4 w-4 text-gray-500" />
        <span className="text-sm font-medium text-gray-700">Filters:</span>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[140px] h-9">
            <SelectValue placeholder="AI Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
            <SelectItem value="Processing">Processing</SelectItem>
            <SelectItem value="Failed">Failed</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
          </SelectContent>
        </Select>
        <Select value={flagFilter} onValueChange={setFlagFilter}>
          <SelectTrigger className="w-[140px] h-9">
            <SelectValue placeholder="Flag Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Flags</SelectItem>
            <SelectItem value="None">None</SelectItem>
            <SelectItem value="Flagged">Flagged</SelectItem>
            <SelectItem value="Reviewed">Reviewed</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-sm text-gray-500 ml-auto">
          Showing {filteredVideos.length} of {stats.total_videos} videos
        </span>
      </div>

      {/* Videos Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="text-xs font-medium uppercase text-gray-500">Thumbnail</TableHead>
              <TableHead className="text-xs font-medium uppercase text-gray-500">Video Details</TableHead>
              <TableHead className="text-xs font-medium uppercase text-gray-500">User</TableHead>
              <TableHead className="text-xs font-medium uppercase text-gray-500">Upload Date</TableHead>
              <TableHead className="text-xs font-medium uppercase text-gray-500">AI Status</TableHead>
              <TableHead className="text-xs font-medium uppercase text-gray-500">Flag Status</TableHead>
              <TableHead className="text-xs font-medium uppercase text-gray-500">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredVideos.map((video) => {
              const statusCfg = aiStatusConfig[video.ai_status] || aiStatusConfig.Pending;
              const StatusIcon = statusCfg.icon;
              const flagColors = flagStatusColors[video.flag_status] || flagStatusColors.None;

              return (
                <TableRow key={video.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div className="relative w-16 h-12 rounded-lg overflow-hidden bg-gray-200">
                      {video.thumbnail ? (
                        <Image src={video.thumbnail} alt={video.title} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-300">
                          <Play className="h-4 w-4 text-white" />
                        </div>
                      )}
                      <span className="absolute bottom-0.5 left-0.5 bg-black/70 text-white text-[10px] px-1 rounded">
                        {video.duration}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-gray-900 text-sm">{video.title}</div>
                    <div className="text-xs text-gray-500">ID: {video.id}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-900">{video.user_name}</div>
                    <div className="text-xs text-gray-500">{video.user_email}</div>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">{video.upload_date}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <StatusIcon className={`h-4 w-4 ${statusCfg.color}`} />
                      <Badge className={`${statusCfg.bg} ${statusCfg.color} border-0 text-xs font-medium`}>
                        {video.ai_status}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={`${flagColors.bg} ${flagColors.text} border-0 text-xs font-medium`}>
                      {video.flag_status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" title="Play">
                        <Play className="h-4 w-4 text-gray-500" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" title="Reprocess" onClick={() => handleReprocess(video.id)}>
                        <RefreshCw className="h-4 w-4 text-gray-500" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" title="Delete" onClick={() => handleDeleteClick(video.id)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation */}
      <ConfirmModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        title="Delete Video"
        description="Are you sure you want to delete this video? This action cannot be undone."
        onConfirm={handleDeleteConfirm}
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />
    </div>
  );
}
