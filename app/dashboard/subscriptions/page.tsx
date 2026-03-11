"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Trash2,
  Plus,
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  useGetSubscriptionPlansQuery,
  useGetSubscriptionStatsQuery,
  useGetAllSubscriptionsQuery,
  useCreatePlanMutation,
  useUpdatePlanMutation,
  useDeletePlanMutation,
  type SubscriptionPlan,
} from "@/store/api/subscriptionsApi";
import { toast } from "sonner";

const subscriptionStatusColors: Record<string, { bg: string; text: string }> = {
  ACTIVE: { bg: "#DCFCE7", text: "#016630" },
  TRIAL: { bg: "#DBEAFE", text: "#1E40AF" },
  CANCELLED: { bg: "#FFE2E2", text: "#9F0712" },
  EXPIRED: { bg: "#FEF9C2", text: "#894B00" },
};

export default function SubscriptionsPage() {
  const { data: plans = [], isLoading: plansLoading } = useGetSubscriptionPlansQuery();
  const { data: stats, isLoading: statsLoading } = useGetSubscriptionStatsQuery();
  const { data: subscriptions = [] } = useGetAllSubscriptionsQuery();
  const [createPlan] = useCreatePlanMutation();
  const [updatePlan] = useUpdatePlanMutation();
  const [deletePlan] = useDeletePlanMutation();

  const defaultNewPlan = {
    name: "",
    plan_type: "FREE",
    description: "",
    price: "",
    billing_cycle: "MONTHLY",
    max_users: 0,
    max_storage_gb: 0,
    is_active: true,
    is_popular: false,
  };

  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newPlan, setNewPlan] = useState(defaultNewPlan);
  const [isCreating, setIsCreating] = useState(false);

  const loading = plansLoading || statsLoading;

  const handleCreatePlan = async () => {
    if (!newPlan.name || !newPlan.price) {
      toast.error("Plan name and price are required");
      return;
    }
    setIsCreating(true);
    try {
      await createPlan({
        ...newPlan,
        features: {},
      }).unwrap();
      toast.success("Plan created successfully");
      setIsCreateModalOpen(false);
      setNewPlan(defaultNewPlan);
    } catch {
      toast.error("Failed to create plan");
    } finally {
      setIsCreating(false);
    }
  };

  const handleEditPlan = (plan: SubscriptionPlan) => {
    setEditingPlan({ ...plan });
    setIsEditModalOpen(true);
  };

  const handleSavePlan = async () => {
    if (editingPlan) {
      try {
        await updatePlan({ planId: editingPlan.id, data: editingPlan }).unwrap();
        toast.success("Plan updated successfully");
        setIsEditModalOpen(false);
        setEditingPlan(null);
      } catch {
        toast.error("Failed to update plan");
      }
    }
  };

  const handleDeletePlan = async (planId: number) => {
    try {
      await deletePlan(planId).unwrap();
      toast.success("Plan deleted successfully");
    } catch {
      toast.error("Failed to delete plan");
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Subscriptions & Payments" description="Manage subscription plans and monitor revenue" />
        <div className="flex items-center justify-center h-64 text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Subscriptions & Payments"
        description="Manage subscription plans and monitor revenue"
      />

      {/* Stats Cards */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white border-[#E5E7EB]">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-emerald-50 p-2.5">
                <DollarSign className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Monthly Revenue</p>
                <p className="text-xl font-bold text-gray-900">${stats?.monthly_revenue?.toLocaleString() ?? "0"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-[#E5E7EB]">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-emerald-50 p-2.5">
                <TrendingUp className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Total Revenue</p>
                <p className="text-xl font-bold text-gray-900">${stats?.total_revenue?.toLocaleString() ?? "0"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-[#E5E7EB]">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-red-50 p-2.5">
                <AlertCircle className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Cancelled</p>
                <p className="text-xl font-bold text-gray-900">{stats?.cancelled_subscriptions ?? 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-[#E5E7EB]">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-emerald-50 p-2.5">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Active Subscribers</p>
                <p className="text-xl font-bold text-gray-900">{stats?.active_subscriptions?.toLocaleString() ?? "0"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subscription Plans */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Subscription Plans</h2>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Plan
          </Button>
        </div>
        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className="border-[#E5E7EB]"
              style={{ backgroundColor: '#FFFFFF', borderRadius: '10px', borderWidth: '1.11px', minHeight: '300px' }}
            >
              <CardContent className="flex flex-col" style={{ paddingTop: '25.1px', paddingRight: '25.1px', paddingBottom: '1.11px', paddingLeft: '25.1px', gap: '15.99px' }}>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{plan.name}</h3>
                    <p className="text-xs text-gray-500">{plan.billing_cycle}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-400 hover:bg-red-50 hover:text-red-500"
                    onClick={() => handleDeletePlan(plan.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div>
                  <span className="text-2xl font-bold text-gray-900">${plan.price}</span>
                  <span className="text-sm text-gray-500">/{plan.billing_cycle.toLowerCase()}</span>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Plan Type</span>
                    <span className="text-gray-900">{plan.plan_type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Max Users</span>
                    <span className="text-gray-900">{plan.max_users}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Storage</span>
                    <span className="text-gray-900">{plan.max_storage_gb} GB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Status</span>
                    <span className="text-gray-900">{plan.is_active ? "Active" : "Inactive"}</span>
                  </div>
                </div>

                {stats?.by_plan && (
                  <div className="border-t border-[#E5E7EB] pt-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Subscribers</span>
                      <span className="font-semibold text-gray-900">
                        {(stats.by_plan[plan.name] || 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                  onClick={() => handleEditPlan(plan)}
                >
                  Edit Plan
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* All Subscriptions Table */}
      {subscriptions.length > 0 && (
        <Card className="bg-white border-[#E5E7EB]" style={{ borderWidth: '1.11px', borderRadius: '10px' }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">All Subscriptions</CardTitle>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <Table className="min-w-[700px]">
              <TableHeader>
                <TableRow className="hover:bg-transparent border-b border-[#E5E7EB]">
                  <TableHead className="text-xs font-medium uppercase text-gray-500">ID</TableHead>
                  <TableHead className="text-xs font-medium uppercase text-gray-500">Plan</TableHead>
                  <TableHead className="text-xs font-medium uppercase text-gray-500">Price</TableHead>
                  <TableHead className="text-xs font-medium uppercase text-gray-500">Billing</TableHead>
                  <TableHead className="text-xs font-medium uppercase text-gray-500">Start Date</TableHead>
                  <TableHead className="text-xs font-medium uppercase text-gray-500">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscriptions.map((sub) => {
                  const colors = subscriptionStatusColors[sub.status] || { bg: "#F3F4F6", text: "#374151" };
                  return (
                    <TableRow key={sub.id} className="border-b border-[#E5E7EB]">
                      <TableCell className="font-medium text-gray-900">#{sub.id}</TableCell>
                      <TableCell className="text-gray-600">{sub.plan_name}</TableCell>
                      <TableCell className="font-medium text-[#101828]">${sub.plan_price}</TableCell>
                      <TableCell className="text-gray-600">{sub.billing_cycle}</TableCell>
                      <TableCell className="text-gray-500">{new Date(sub.start_date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <span
                          className="font-medium px-3 py-1 rounded-full text-xs inline-block"
                          style={{ backgroundColor: colors.bg, color: colors.text }}
                        >
                          {sub.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Create Plan Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={(open) => { setIsCreateModalOpen(open); if (!open) setNewPlan(defaultNewPlan); }}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">Create Subscription Plan</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Plan Name</Label>
                <Input
                  placeholder="e.g. Pro"
                  value={newPlan.name}
                  onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
                  className="h-10 rounded-lg"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Price ($)</Label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={newPlan.price}
                  onChange={(e) => setNewPlan({ ...newPlan, price: e.target.value })}
                  className="h-10 rounded-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Plan Type</Label>
                <Select value={newPlan.plan_type} onValueChange={(v) => setNewPlan({ ...newPlan, plan_type: v })}>
                  <SelectTrigger className="h-10 rounded-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FREE">FREE</SelectItem>
                    <SelectItem value="BASIC">BASIC</SelectItem>
                    <SelectItem value="PRO">PRO</SelectItem>
                    <SelectItem value="ENTERPRISE">ENTERPRISE</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Billing Cycle</Label>
                <Select value={newPlan.billing_cycle} onValueChange={(v) => setNewPlan({ ...newPlan, billing_cycle: v })}>
                  <SelectTrigger className="h-10 rounded-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MONTHLY">MONTHLY</SelectItem>
                    <SelectItem value="YEARLY">YEARLY</SelectItem>
                    <SelectItem value="WEEKLY">WEEKLY</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Description</Label>
              <Textarea
                placeholder="Describe this plan..."
                value={newPlan.description}
                onChange={(e) => setNewPlan({ ...newPlan, description: e.target.value })}
                className="rounded-lg resize-none"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Max Users</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={newPlan.max_users || ""}
                  onChange={(e) => setNewPlan({ ...newPlan, max_users: parseInt(e.target.value) || 0 })}
                  className="h-10 rounded-lg"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Max Storage (GB)</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={newPlan.max_storage_gb || ""}
                  onChange={(e) => setNewPlan({ ...newPlan, max_storage_gb: parseInt(e.target.value) || 0 })}
                  className="h-10 rounded-lg"
                />
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-4 py-3">
              <div>
                <p className="text-sm font-medium text-gray-800">Active</p>
                <p className="text-xs text-gray-500">Make this plan available to users</p>
              </div>
              <Switch checked={newPlan.is_active} onCheckedChange={(v) => setNewPlan({ ...newPlan, is_active: v })} />
            </div>

            <div className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-4 py-3">
              <div>
                <p className="text-sm font-medium text-gray-800">Popular</p>
                <p className="text-xs text-gray-500">Highlight as a popular plan</p>
              </div>
              <Switch checked={newPlan.is_popular} onCheckedChange={(v) => setNewPlan({ ...newPlan, is_popular: v })} />
            </div>
          </div>

          <DialogFooter className="gap-2 pt-2">
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)} className="flex-1 rounded-xl">Cancel</Button>
            <Button
              onClick={handleCreatePlan}
              disabled={isCreating}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl"
            >
              {isCreating ? "Creating..." : "Create Plan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Plan Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Plan</DialogTitle>
          </DialogHeader>
          {editingPlan && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="planName">Plan Name</Label>
                <Input id="planName" value={editingPlan.name ?? ""} onChange={(e) => setEditingPlan({ ...editingPlan, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input id="description" value={editingPlan.description ?? ""} onChange={(e) => setEditingPlan({ ...editingPlan, description: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input id="price" type="number" value={editingPlan.price ?? ""} onChange={(e) => setEditingPlan({ ...editingPlan, price: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxUsers">Max Users</Label>
                <Input id="maxUsers" type="number" value={editingPlan.max_users ?? ""} onChange={(e) => setEditingPlan({ ...editingPlan, max_users: parseInt(e.target.value) || 0 })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxStorage">Max Storage (GB)</Label>
                <Input id="maxStorage" type="number" value={editingPlan.max_storage_gb ?? ""} onChange={(e) => setEditingPlan({ ...editingPlan, max_storage_gb: parseInt(e.target.value) || 0 })} />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="isActive">Active</Label>
                <Switch id="isActive" checked={editingPlan.is_active} onCheckedChange={(checked) => setEditingPlan({ ...editingPlan, is_active: checked })} />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="isPopular">Popular</Label>
                <Switch id="isPopular" checked={editingPlan.is_popular} onCheckedChange={(checked) => setEditingPlan({ ...editingPlan, is_popular: checked })} />
              </div>
              <DialogFooter className="flex gap-3 pt-4">
                <Button onClick={handleSavePlan} className="bg-[#1D4ED8] hover:bg-[#1e40af] flex-1">Save Changes</Button>
                <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
