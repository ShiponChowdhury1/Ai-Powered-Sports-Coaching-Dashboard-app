"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatsCard } from "@/components/common/StatsCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  UserCheck,
  CreditCard,
  TrendingUp,
  Filter,
  Search,
  Eye,
} from "lucide-react";
import {
  useGetUsersQuery,
  type ApiUser,
} from "@/store/api/usersApi";

const statusColors: Record<string, string> = {
  Active: "bg-emerald-100 text-emerald-700",
  Inactive: "bg-red-100 text-red-700",
};

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data: usersData, isLoading, isError } = useGetUsersQuery({ search: searchQuery || undefined });
  const users = Array.isArray(usersData) ? usersData : [];

  // Modal states
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<ApiUser | null>(null);

  const filteredUsers = users.filter((user) => {
    if (statusFilter === "all") return true;
    if (statusFilter === "Active") return user.is_active;
    if (statusFilter === "Inactive") return !user.is_active;
    return true;
  });

  const stats = {
    total: users.length,
    active: users.filter((u) => u.is_active).length,
    paid: users.filter((u) => Boolean(u.plan)).length,
    admins: users.filter((u) => u.role?.toUpperCase() === "ADMIN").length,
  };

  const handleView = (user: ApiUser) => {
    setSelectedUser(user);
    setViewModalOpen(true);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Users Management" description="Manage and monitor all platform users" />
        <div className="flex items-center justify-center h-64 text-gray-500">Loading users...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <PageHeader title="Users Management" description="Manage and monitor all platform users" />
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Failed to load users. Please check API access token and users endpoint response.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Users Management"
        description="Manage and monitor all platform users"
      />

      {/* Stats Cards */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Total Users" value={stats.total} icon={Users} iconColor="text-blue-600" iconBgColor="bg-blue-50" />
        <StatsCard title="Active Users" value={stats.active} icon={UserCheck} iconColor="text-emerald-600" iconBgColor="bg-emerald-50" />
        <StatsCard title="Paid Subscribers" value={stats.paid} icon={CreditCard} iconColor="text-purple-600" iconBgColor="bg-purple-50" />
        <StatsCard title="Admins" value={stats.admins} icon={TrendingUp} iconColor="text-orange-600" iconBgColor="bg-orange-50" />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center justify-between gap-3 sm:gap-4">
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
              <SelectItem value="Inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-[250px] lg:w-[300px] pl-10"
            />
          </div>
          <span className="text-sm text-gray-500">
            Showing {filteredUsers.length} of {users.length} users
          </span>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-lg border border-[#E5E7EB] bg-white overflow-x-auto">
        <Table className="min-w-[900px]">
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs font-medium uppercase text-gray-500">User</TableHead>
              <TableHead className="text-xs font-medium uppercase text-gray-500">Sport</TableHead>
              <TableHead className="text-xs font-medium uppercase text-gray-500">Skill Level</TableHead>
              <TableHead className="text-xs font-medium uppercase text-gray-500">Plan</TableHead>
              <TableHead className="text-xs font-medium uppercase text-gray-500">Role</TableHead>
              <TableHead className="text-xs font-medium uppercase text-gray-500">Status</TableHead>
              <TableHead className="text-xs font-medium uppercase text-gray-500">Joined</TableHead>
              <TableHead className="text-xs font-medium uppercase text-gray-500">Actions</TableHead>
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
                <TableCell className="text-gray-600">{user.sport || "—"}</TableCell>
                <TableCell className="text-gray-600">{user.skill_level || "—"}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className={user.plan ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-700"}>
                    {user.plan?.name || "Free"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={user.role?.toUpperCase() === "ADMIN" ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-700"}
                  >
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className={user.is_active ? statusColors.Active : statusColors.Inactive}>
                    {user.is_active ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="text-gray-600">
                  {new Date(user.date_joined).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleView(user)}>
                      <Eye className="h-4 w-4" style={{ color: "#0F744F" }} />
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
                  <p className="font-medium">{selectedUser.sport || "—"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Skill Level</p>
                  <p className="font-medium">{selectedUser.skill_level || "—"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Plan</p>
                  <Badge className={selectedUser.plan ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-700"}>
                    {selectedUser.plan?.name || "Free"}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <Badge className={selectedUser.is_active ? statusColors.Active : statusColors.Inactive}>
                    {selectedUser.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Role</p>
                  <p className="font-medium">{selectedUser.role}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{selectedUser.phone || "—"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Member Since</p>
                  <p className="font-medium">{new Date(selectedUser.date_joined).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Last Login</p>
                  <p className="font-medium">{selectedUser.last_login ? new Date(selectedUser.last_login).toLocaleDateString() : "Never"}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
