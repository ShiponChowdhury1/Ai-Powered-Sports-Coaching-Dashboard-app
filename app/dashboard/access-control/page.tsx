"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatsCard } from "@/components/common/StatsCard";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Shield,
  Users,
  Key,
  Plus,
  Pencil,
  Trash2,
} from "lucide-react";

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
  createdAt: string;
}

interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
}

const mockRoles: Role[] = [
  {
    id: "1",
    name: "Super Admin",
    description: "Full access to all features and settings",
    permissions: ["all"],
    userCount: 2,
    createdAt: "2024-01-01",
  },
  {
    id: "2",
    name: "Admin",
    description: "Access to most features except system settings",
    permissions: ["users.read", "users.write", "videos.read", "videos.write", "support.read", "support.write"],
    userCount: 5,
    createdAt: "2024-01-01",
  },
  {
    id: "3",
    name: "Support Agent",
    description: "Access to support tickets and user management",
    permissions: ["users.read", "support.read", "support.write"],
    userCount: 12,
    createdAt: "2024-01-05",
  },
  {
    id: "4",
    name: "Content Manager",
    description: "Manage training content and videos",
    permissions: ["videos.read", "videos.write", "training.read", "training.write"],
    userCount: 8,
    createdAt: "2024-01-10",
  },
  {
    id: "5",
    name: "Viewer",
    description: "Read-only access to dashboard",
    permissions: ["dashboard.read"],
    userCount: 15,
    createdAt: "2024-01-15",
  },
];

const mockPermissions: Permission[] = [
  { id: "1", name: "users.read", description: "View users", category: "Users" },
  { id: "2", name: "users.write", description: "Manage users", category: "Users" },
  { id: "3", name: "videos.read", description: "View videos", category: "Videos" },
  { id: "4", name: "videos.write", description: "Manage videos", category: "Videos" },
  { id: "5", name: "training.read", description: "View training content", category: "Training" },
  { id: "6", name: "training.write", description: "Manage training content", category: "Training" },
  { id: "7", name: "support.read", description: "View support tickets", category: "Support" },
  { id: "8", name: "support.write", description: "Manage support tickets", category: "Support" },
  { id: "9", name: "settings.read", description: "View settings", category: "Settings" },
  { id: "10", name: "settings.write", description: "Manage settings", category: "Settings" },
  { id: "11", name: "dashboard.read", description: "View dashboard", category: "Dashboard" },
];

export default function AccessControlPage() {
  const [roles, setRoles] = useState<Role[]>(mockRoles);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [formData, setFormData] = useState({ name: "", description: "" });

  const handleEdit = (role: Role) => {
    setSelectedRole(role);
    setFormData({ name: role.name, description: role.description });
    setSelectedPermissions(role.permissions);
    setEditModalOpen(true);
  };

  const handleDelete = (role: Role) => {
    setSelectedRole(role);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedRole) {
      setRoles(roles.filter((r) => r.id !== selectedRole.id));
      setDeleteModalOpen(false);
      setSelectedRole(null);
    }
  };

  const handlePermissionToggle = (permission: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permission)
        ? prev.filter((p) => p !== permission)
        : [...prev, permission]
    );
  };

  const permissionCategories = Array.from(
    new Set(mockPermissions.map((p) => p.category))
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Access Control"
        description="Manage roles and permissions"
      >
        <Button onClick={() => setCreateModalOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Create Role
        </Button>
      </PageHeader>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Roles"
          value={roles.length}
          icon={Shield}
          iconColor="text-purple-600"
          iconBgColor="bg-purple-50"
        />
        <StatsCard
          title="Total Users"
          value={roles.reduce((acc, r) => acc + r.userCount, 0)}
          icon={Users}
          iconColor="text-blue-600"
          iconBgColor="bg-blue-50"
        />
        <StatsCard
          title="Permissions"
          value={mockPermissions.length}
          icon={Key}
          iconColor="text-emerald-600"
          iconBgColor="bg-emerald-50"
        />
        <StatsCard
          title="Categories"
          value={permissionCategories.length}
          icon={Shield}
          iconColor="text-orange-600"
          iconBgColor="bg-orange-50"
        />
      </div>

      {/* Roles Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Roles</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs font-medium uppercase text-gray-500">
                  Role
                </TableHead>
                <TableHead className="text-xs font-medium uppercase text-gray-500">
                  Description
                </TableHead>
                <TableHead className="text-xs font-medium uppercase text-gray-500">
                  Permissions
                </TableHead>
                <TableHead className="text-xs font-medium uppercase text-gray-500">
                  Users
                </TableHead>
                <TableHead className="text-xs font-medium uppercase text-gray-500">
                  Created
                </TableHead>
                <TableHead className="text-xs font-medium uppercase text-gray-500">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-100">
                        <Shield className="h-4 w-4 text-purple-600" />
                      </div>
                      <span className="font-medium text-gray-900">{role.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-600 max-w-[250px]">
                    {role.description}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {role.permissions.slice(0, 3).map((perm) => (
                        <Badge
                          key={perm}
                          variant="secondary"
                          className="bg-gray-100 text-gray-700 text-xs"
                        >
                          {perm}
                        </Badge>
                      ))}
                      {role.permissions.length > 3 && (
                        <Badge
                          variant="secondary"
                          className="bg-gray-100 text-gray-700 text-xs"
                        >
                          +{role.permissions.length - 3}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-600">{role.userCount}</TableCell>
                  <TableCell className="text-gray-600">{role.createdAt}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleEdit(role)}
                      >
                        <Pencil className="h-4 w-4 text-gray-500" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleDelete(role)}
                        disabled={role.name === "Super Admin"}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create/Edit Role Modal */}
      <Dialog
        open={createModalOpen || editModalOpen}
        onOpenChange={(open) => {
          if (!open) {
            setCreateModalOpen(false);
            setEditModalOpen(false);
            setSelectedPermissions([]);
            setFormData({ name: "", description: "" });
          }
        }}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editModalOpen ? "Edit Role" : "Create New Role"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Role Name</Label>
              <Input
                placeholder="Enter role name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input
                placeholder="Enter description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
            <div className="space-y-3">
              <Label>Permissions</Label>
              <div className="max-h-[250px] overflow-y-auto space-y-4 border rounded-lg p-4">
                {permissionCategories.map((category) => (
                  <div key={category}>
                    <p className="font-medium text-sm text-gray-700 mb-2">
                      {category}
                    </p>
                    <div className="space-y-2">
                      {mockPermissions
                        .filter((p) => p.category === category)
                        .map((permission) => (
                          <div
                            key={permission.id}
                            className="flex items-center gap-2"
                          >
                            <Checkbox
                              id={permission.id}
                              checked={selectedPermissions.includes(
                                permission.name
                              )}
                              onCheckedChange={() =>
                                handlePermissionToggle(permission.name)
                              }
                            />
                            <label
                              htmlFor={permission.id}
                              className="text-sm text-gray-600"
                            >
                              {permission.description}
                            </label>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setCreateModalOpen(false);
                setEditModalOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button>{editModalOpen ? "Save Changes" : "Create Role"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        title="Delete Role"
        description={`Are you sure you want to delete the "${selectedRole?.name}" role? This action cannot be undone.`}
        confirmText="Delete"
        variant="destructive"
        onConfirm={confirmDelete}
      />
    </div>
  );
}
