"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatsCard } from "@/components/common/StatsCard";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import {
  Users,
  UserCheck,
  CreditCard,
  TrendingUp,
  Filter,
  Search,
  Eye,
  Pencil,
  Trash2,
  MoreVertical,
  ChevronDown,
} from "lucide-react";
import { User } from "@/api/users.api";

// Mock users data
const mockUsers: User[] = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@email.com",
    sport: "Golf",
    skillLevel: "Intermediate",
    plan: "Monthly",
    status: "Active",
    videos: 24,
    engagement: 87,
    createdAt: "2024-01-15",
    lastActive: "2024-02-01",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah.j@email.com",
    sport: "Golf",
    skillLevel: "Beginner",
    plan: "Yearly",
    status: "Active",
    videos: 18,
    engagement: 92,
    createdAt: "2024-01-10",
    lastActive: "2024-02-01",
  },
  {
    id: "3",
    name: "Mike Davis",
    email: "mdavis@email.com",
    sport: "Golf",
    skillLevel: "Advanced",
    plan: "3-Month",
    status: "Active",
    videos: 42,
    engagement: 95,
    createdAt: "2023-12-20",
    lastActive: "2024-02-01",
  },
  {
    id: "4",
    name: "Emily Wilson",
    email: "emily.w@email.com",
    sport: "Golf",
    skillLevel: "Intermediate",
    plan: "Free",
    status: "Active",
    videos: 8,
    engagement: 68,
    createdAt: "2024-01-25",
    lastActive: "2024-01-30",
  },
  {
    id: "5",
    name: "David Brown",
    email: "dbrown@email.com",
    sport: "Golf",
    skillLevel: "Beginner",
    plan: "Monthly",
    status: "Suspended",
    videos: 15,
    engagement: 45,
    createdAt: "2024-01-05",
    lastActive: "2024-01-20",
  },
  {
    id: "6",
    name: "Lisa Anderson",
    email: "l.anderson@email.com",
    sport: "Golf",
    skillLevel: "Advanced",
    plan: "Yearly",
    status: "Active",
    videos: 67,
    engagement: 98,
    createdAt: "2023-11-15",
    lastActive: "2024-02-01",
  },
  {
    id: "7",
    name: "Robert Taylor",
    email: "rtaylor@email.com",
    sport: "Golf",
    skillLevel: "Intermediate",
    plan: "School",
    status: "Active",
    videos: 31,
    engagement: 84,
    createdAt: "2024-01-12",
    lastActive: "2024-02-01",
  },
  {
    id: "8",
    name: "Jennifer Lee",
    email: "jlee@email.com",
    sport: "Golf",
    skillLevel: "Beginner",
    plan: "Free",
    status: "Active",
    videos: 5,
    engagement: 72,
    createdAt: "2024-01-28",
    lastActive: "2024-02-01",
  },
];

const planColors: Record<string, string> = {
  Free: "bg-gray-100 text-gray-700",
  Monthly: "bg-emerald-100 text-emerald-700",
  "3-Month": "bg-orange-100 text-orange-700",
  Yearly: "bg-red-100 text-red-700",
  School: "bg-emerald-100 text-emerald-700",
};

const statusColors: Record<string, string> = {
  Active: "bg-emerald-100 text-emerald-700",
  Suspended: "bg-red-100 text-red-700",
  Inactive: "bg-gray-100 text-gray-700",
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [planFilter, setPlanFilter] = useState<string>("all");

  // Modal states
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Edit form state
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    sport: "",
    skillLevel: "" as User["skillLevel"],
    plan: "" as User["plan"],
    status: "" as User["status"],
  });

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || user.status === statusFilter;
    const matchesPlan = planFilter === "all" || user.plan === planFilter;
    return matchesSearch && matchesStatus && matchesPlan;
  });

  const stats = {
    total: users.length,
    active: users.filter((u) => u.status === "Active").length,
    paid: users.filter((u) => u.plan !== "Free").length,
    avgEngagement: Math.round(
      users.reduce((acc, u) => acc + u.engagement, 0) / users.length
    ),
  };

  const handleView = (user: User) => {
    setSelectedUser(user);
    setViewModalOpen(true);
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setEditForm({
      name: user.name,
      email: user.email,
      sport: user.sport,
      skillLevel: user.skillLevel,
      plan: user.plan,
      status: user.status,
    });
    setEditModalOpen(true);
  };

  const handleDelete = (user: User) => {
    setSelectedUser(user);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedUser) {
      setUsers(users.filter((u) => u.id !== selectedUser.id));
      setDeleteModalOpen(false);
      setSelectedUser(null);
    }
  };

  const saveEdit = () => {
    if (selectedUser) {
      setUsers(
        users.map((u) =>
          u.id === selectedUser.id ? { ...u, ...editForm } : u
        )
      );
      setEditModalOpen(false);
      setSelectedUser(null);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Users Management"
        description="Manage and monitor all platform users"
      />

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Users"
          value={stats.total}
          icon={Users}
          iconColor="text-blue-600"
          iconBgColor="bg-blue-50"
        />
        <StatsCard
          title="Active Users"
          value={stats.active}
          icon={UserCheck}
          iconColor="text-emerald-600"
          iconBgColor="bg-emerald-50"
        />
        <StatsCard
          title="Paid Subscribers"
          value={stats.paid}
          icon={CreditCard}
          iconColor="text-purple-600"
          iconBgColor="bg-purple-50"
        />
        <StatsCard
          title="Avg Engagement"
          value={`${stats.avgEngagement}%`}
          icon={TrendingUp}
          iconColor="text-orange-600"
          iconBgColor="bg-orange-50"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Suspended">Suspended</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          <Select value={planFilter} onValueChange={setPlanFilter}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Plan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="Free">Free</SelectItem>
              <SelectItem value="Monthly">Monthly</SelectItem>
              <SelectItem value="3-Month">3-Month</SelectItem>
              <SelectItem value="Yearly">Yearly</SelectItem>
              <SelectItem value="School">School</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search users, videos, emails..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-[300px] pl-10"
            />
          </div>
          <span className="text-sm text-gray-500">
            Showing {filteredUsers.length} of {users.length} users
          </span>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-lg border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs font-medium uppercase text-gray-500">
                User
              </TableHead>
              <TableHead className="text-xs font-medium uppercase text-gray-500">
                Sport
              </TableHead>
              <TableHead className="text-xs font-medium uppercase text-gray-500">
                Skill Level
              </TableHead>
              <TableHead className="text-xs font-medium uppercase text-gray-500">
                Plan
              </TableHead>
              <TableHead className="text-xs font-medium uppercase text-gray-500">
                Status
              </TableHead>
              <TableHead className="text-xs font-medium uppercase text-gray-500">
                Videos
              </TableHead>
              <TableHead className="text-xs font-medium uppercase text-gray-500">
                Engagement
              </TableHead>
              <TableHead className="text-xs font-medium uppercase text-gray-500">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-gray-100 text-sm font-medium text-gray-600">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-gray-600">{user.sport}</TableCell>
                <TableCell className="text-gray-600">{user.skillLevel}</TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={planColors[user.plan] || "bg-gray-100 text-gray-700"}
                  >
                    {user.plan}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={statusColors[user.status]}
                  >
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-gray-600">{user.videos}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress
                      value={user.engagement}
                      className="h-2 w-20"
                      indicatorClassName="bg-[#0F744F]"
                    />
                    <span className="text-sm">
                      {user.engagement}%
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleView(user)}
                    >
                      <Eye className="h-4 w-4" style={{ color: "#0F744F" }} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleEdit(user)}
                    >
                      <Pencil className="h-4 w-4" style={{ color: "#0F744F" }} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleDelete(user)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* View User Modal */}
      <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-emerald-100 text-lg font-medium text-emerald-700">
                    {getInitials(selectedUser.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">{selectedUser.name}</h3>
                  <p className="text-gray-500">{selectedUser.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div>
                  <p className="text-sm text-gray-500">Sport</p>
                  <p className="font-medium">{selectedUser.sport}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Skill Level</p>
                  <p className="font-medium">{selectedUser.skillLevel}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Plan</p>
                  <Badge className={planColors[selectedUser.plan]}>
                    {selectedUser.plan}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <Badge className={statusColors[selectedUser.status]}>
                    {selectedUser.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Videos Uploaded</p>
                  <p className="font-medium">{selectedUser.videos}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Engagement</p>
                  <p className="font-medium">{selectedUser.engagement}%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Member Since</p>
                  <p className="font-medium">{selectedUser.createdAt}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Last Active</p>
                  <p className="font-medium">{selectedUser.lastActive}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit User Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={editForm.name}
                onChange={(e) =>
                  setEditForm({ ...editForm, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={editForm.email}
                onChange={(e) =>
                  setEditForm({ ...editForm, email: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-sport">Sport</Label>
              <Input
                id="edit-sport"
                value={editForm.sport}
                onChange={(e) =>
                  setEditForm({ ...editForm, sport: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Skill Level</Label>
              <Select
                value={editForm.skillLevel}
                onValueChange={(value) =>
                  setEditForm({ ...editForm, skillLevel: value as User["skillLevel"] })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select skill level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Plan</Label>
              <Select
                value={editForm.plan}
                onValueChange={(value) =>
                  setEditForm({ ...editForm, plan: value as User["plan"] })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Free">Free</SelectItem>
                  <SelectItem value="Monthly">Monthly</SelectItem>
                  <SelectItem value="3-Month">3-Month</SelectItem>
                  <SelectItem value="Yearly">Yearly</SelectItem>
                  <SelectItem value="School">School</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={editForm.status}
                onValueChange={(value) =>
                  setEditForm({ ...editForm, status: value as User["status"] })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Suspended">Suspended</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        title="Delete User"
        description={`Are you sure you want to delete ${selectedUser?.name}? This action cannot be undone.`}
        confirmText="Delete"
        variant="destructive"
        onConfirm={confirmDelete}
      />
    </div>
  );
}
