"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Video,
  Plus,
  Pencil,
  Trash2,
  Upload,
  Calendar,
} from "lucide-react";

interface TrainingContent {
  id: string;
  title: string;
  description: string;
  sport: string;
  category: "Drill" | "Training Plan" | "Correction";
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  targetSkill: string;
  usage: number;
  hasVideo: boolean;
  createdAt: string;
}

const mockContent: TrainingContent[] = [
  {
    id: "1",
    title: "Driver Swing Setup",
    description: "Fundamental setup position for driver swing",
    sport: "Golf",
    category: "Drill",
    difficulty: "Beginner",
    targetSkill: "Driver",
    usage: 1247,
    hasVideo: true,
    createdAt: "2025-08-15",
  },
  {
    id: "2",
    title: "Complete Putting Mastery",
    description: "4-week training plan to improve putting accuracy",
    sport: "Golf",
    category: "Training Plan",
    difficulty: "Intermediate",
    targetSkill: "Putting",
    usage: 892,
    hasVideo: false,
    createdAt: "2025-09-20",
  },
  {
    id: "3",
    title: "Fix Slice Issue",
    description: "Step-by-step correction for common slice problem",
    sport: "Golf",
    category: "Correction",
    difficulty: "Intermediate",
    targetSkill: "Driver",
    usage: 1584,
    hasVideo: true,
    createdAt: "2025-07-10",
  },
  {
    id: "4",
    title: "Iron Shot Consistency",
    description: "Drill to improve iron shot consistency",
    sport: "Golf",
    category: "Drill",
    difficulty: "Advanced",
    targetSkill: "Irons",
    usage: 673,
    hasVideo: true,
    createdAt: "2025-10-05",
  },
  {
    id: "5",
    title: "Beginner Golf Foundation",
    description: "Complete 8-week program for golf beginners",
    sport: "Golf",
    category: "Training Plan",
    difficulty: "Beginner",
    targetSkill: "General",
    usage: 2341,
    hasVideo: false,
    createdAt: "2025-06-12",
  },
  {
    id: "6",
    title: "Improve Backswing",
    description: "Correct common backswing mistakes",
    sport: "Golf",
    category: "Correction",
    difficulty: "Intermediate",
    targetSkill: "Full Swing",
    usage: 1128,
    hasVideo: true,
    createdAt: "2025-11-18",
  },
];

const categoryColors: Record<string, string> = {
  Drill: "bg-emerald-500 text-white",
  "Training Plan": "bg-emerald-500 text-white",
  Correction: "bg-emerald-500 text-white",
};

const difficultyColors: Record<string, string> = {
  Beginner: "bg-emerald-100 text-emerald-700",
  Intermediate: "bg-yellow-100 text-yellow-700",
  Advanced: "bg-red-100 text-red-700",
};

export default function TrainingPage() {
  const [content, setContent] = useState<TrainingContent[]>(mockContent);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState<TrainingContent | null>(null);

  const filteredContent = content.filter((item) => {
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    const matchesDifficulty = difficultyFilter === "all" || item.difficulty === difficultyFilter;
    return matchesCategory && matchesDifficulty;
  });

  const stats = {
    total: content.length,
    drills: content.filter((c) => c.category === "Drill").length,
    trainingPlans: content.filter((c) => c.category === "Training Plan").length,
    corrections: content.filter((c) => c.category === "Correction").length,
  };

  const handleDelete = (item: TrainingContent) => {
    setSelectedContent(item);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedContent) {
      setContent(content.filter((c) => c.id !== selectedContent.id));
      setDeleteModalOpen(false);
      setSelectedContent(null);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Training Content Management"
        description="Create and manage drills, training plans, and corrections"
      >
        <Button onClick={() => setCreateModalOpen(true)} className="gap-2 bg-emerald-600 hover:bg-emerald-700">
          <Plus className="h-4 w-4" />
          Create Content
        </Button>
      </PageHeader>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-500">Total Content</p>
            <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-500">Drills</p>
            <p className="text-3xl font-bold text-emerald-600">{stats.drills}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-500">Training Plans</p>
            <p className="text-3xl font-bold text-emerald-600">{stats.trainingPlans}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-500">Corrections</p>
            <p className="text-3xl font-bold text-emerald-600">{stats.corrections}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <span className="text-sm text-gray-600">Filters:</span>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="Drill">Drill</SelectItem>
            <SelectItem value="Training Plan">Training Plan</SelectItem>
            <SelectItem value="Correction">Correction</SelectItem>
          </SelectContent>
        </Select>
        <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="Beginner">Beginner</SelectItem>
            <SelectItem value="Intermediate">Intermediate</SelectItem>
            <SelectItem value="Advanced">Advanced</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-sm text-gray-500 ml-auto">
          Showing {filteredContent.length} of {content.length} items
        </span>
      </div>

      {/* Content Cards Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredContent.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <CardContent className="p-5">
              {/* Header with badges and actions */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Badge className={categoryColors[item.category]}>
                    {item.category}
                  </Badge>
                  <Badge className={difficultyColors[item.difficulty]}>
                    {item.difficulty}
                  </Badge>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Pencil className="h-4 w-4 text-gray-400" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleDelete(item)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>

              {/* Title and Description */}
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {item.title}
              </h3>
              <p className="text-sm text-gray-500 mb-4">{item.description}</p>

              {/* Details */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Sport:</span>
                  <span className="text-gray-900">{item.sport}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Target Skill:</span>
                  <span className="text-gray-900">{item.targetSkill}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Usage:</span>
                  <span className="text-gray-900">{item.usage.toLocaleString()}</span>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                {item.hasVideo ? (
                  <div className="flex items-center gap-1.5 text-emerald-600">
                    <Video className="h-4 w-4" />
                    <span className="text-sm">Has video</span>
                  </div>
                ) : (
                  <div />
                )}
                <div className="flex items-center gap-1.5 text-gray-500">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">{item.createdAt}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create Content Modal */}
      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create New Content</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input placeholder="Enter content title" />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea placeholder="Enter description" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Drill">Drill</SelectItem>
                    <SelectItem value="Training Plan">Training Plan</SelectItem>
                    <SelectItem value="Correction">Correction</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Difficulty</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Sport</Label>
                <Input placeholder="e.g., Golf" />
              </div>
              <div className="space-y-2">
                <Label>Target Skill</Label>
                <Input placeholder="e.g., Driver" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Upload Video (Optional)</Label>
              <div className="flex items-center justify-center border-2 border-dashed rounded-lg p-6 cursor-pointer hover:bg-gray-50">
                <div className="text-center">
                  <Upload className="h-8 w-8 mx-auto text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">
                    Click to upload or drag and drop
                  </p>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700">Create Content</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        title="Delete Content"
        description={`Are you sure you want to delete "${selectedContent?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="destructive"
        onConfirm={confirmDelete}
      />
    </div>
  );
}
