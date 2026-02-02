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
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Trash2,
} from "lucide-react";

// Types
interface SubscriptionPlan {
  id: string;
  name: string;
  duration: string;
  price: number;
  priceLabel: string;
  videoLimit: string;
  feedbackDepth: string;
  trainingPlans: boolean;
  progressTracking: boolean;
  subscribers: number;
}

interface Transaction {
  id: string;
  transactionId: string;
  userName: string;
  plan: string;
  amount: number;
  date: string;
  status: "Paid" | "Failed" | "Refunded";
}

// Mock data for subscription plans
const mockPlans: SubscriptionPlan[] = [
  {
    id: "1",
    name: "Free",
    duration: "Forever",
    price: 0,
    priceLabel: "",
    videoLimit: "5",
    feedbackDepth: "Basic",
    trainingPlans: false,
    progressTracking: false,
    subscribers: 9211,
  },
  {
    id: "2",
    name: "Monthly",
    duration: "1 Month",
    price: 29.99,
    priceLabel: "/1 Month",
    videoLimit: "50",
    feedbackDepth: "Advanced",
    trainingPlans: true,
    progressTracking: true,
    subscribers: 1847,
  },
  {
    id: "3",
    name: "3-Month",
    duration: "3 Months",
    price: 74.99,
    priceLabel: "/3 Months",
    videoLimit: "150",
    feedbackDepth: "Advanced",
    trainingPlans: true,
    progressTracking: true,
    subscribers: 892,
  },
  {
    id: "4",
    name: "Yearly",
    duration: "1 Year",
    price: 249.99,
    priceLabel: "/1 Year",
    videoLimit: "Unlimited",
    feedbackDepth: "Expert",
    trainingPlans: true,
    progressTracking: true,
    subscribers: 458,
  },
];

// Mock data for transactions
const mockTransactions: Transaction[] = [
  {
    id: "1",
    transactionId: "TXN001",
    userName: "John Smith",
    plan: "Monthly",
    amount: 29.99,
    date: "2026-01-23 09:15",
    status: "Paid",
  },
  {
    id: "2",
    transactionId: "TXN002",
    userName: "Sarah Johnson",
    plan: "Yearly",
    amount: 249.99,
    date: "2026-01-23 08:42",
    status: "Paid",
  },
  {
    id: "3",
    transactionId: "TXN003",
    userName: "Mike Davis",
    plan: "3-Month",
    amount: 74.99,
    date: "2026-01-23 07:28",
    status: "Failed",
  },
  {
    id: "4",
    transactionId: "TXN004",
    userName: "Emily Wilson",
    plan: "Monthly",
    amount: 29.99,
    date: "2026-01-22 18:15",
    status: "Paid",
  },
  {
    id: "5",
    transactionId: "TXN005",
    userName: "David Brown",
    plan: "Monthly",
    amount: 29.99,
    date: "2026-01-22 18:32",
    status: "Refunded",
  },
  {
    id: "6",
    transactionId: "TXN006",
    userName: "Lisa Anderson",
    plan: "Yearly",
    amount: 249.99,
    date: "2026-01-22 14:20",
    status: "Paid",
  },
  {
    id: "7",
    transactionId: "TXN007",
    userName: "Robert Taylor",
    plan: "School",
    amount: 999.99,
    date: "2026-01-22 11:45",
    status: "Paid",
  },
  {
    id: "8",
    transactionId: "TXN008",
    userName: "Jennifer Lee",
    plan: "Monthly",
    amount: 29.99,
    date: "2026-01-22 09:10",
    status: "Failed",
  },
];

// Revenue data for chart
const revenueData = [
  { month: "Jan", revenue: 32000 },
  { month: "Feb", revenue: 35000 },
  { month: "Mar", revenue: 38000 },
  { month: "Apr", revenue: 42000 },
  { month: "May", revenue: 48000 },
  { month: "Jun", revenue: 52000 },
  { month: "Jul", revenue: 58000 },
  { month: "Aug", revenue: 62000 },
  { month: "Sep", revenue: 68000 },
  { month: "Oct", revenue: 72000 },
  { month: "Nov", revenue: 78000 },
  { month: "Dec", revenue: 84250 },
];

const statusColors: Record<string, { bg: string; text: string }> = {
  Paid: { bg: "#DCFCE7", text: "#016630" },
  Failed: { bg: "#FFE2E2", text: "#9F0712" },
  Refunded: { bg: "#FEF9C2", text: "#894B00" },
};

export default function SubscriptionsPage() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>(mockPlans);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Stats calculations
  const monthlyRevenue = 84250;
  const growth = 18.7;
  const failedPayments = 5;
  const activeSubscribers = 3247;

  const handleEditPlan = (plan: SubscriptionPlan) => {
    setEditingPlan({ ...plan });
    setIsEditModalOpen(true);
  };

  const handleSavePlan = () => {
    if (editingPlan) {
      setPlans(plans.map(p => p.id === editingPlan.id ? editingPlan : p));
      setIsEditModalOpen(false);
      setEditingPlan(null);
    }
  };

  const handleDeletePlan = (planId: string) => {
    setPlans(plans.filter(p => p.id !== planId));
  };

  // Chart dimensions
  const chartHeight = 200;
  const chartWidth = 800;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Subscriptions & Payments"
        description="Manage subscription plans and monitor revenue"
      />

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Monthly Revenue */}
        <Card className="bg-white border-[#E5E7EB]">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-emerald-50 p-2.5">
                <DollarSign className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Monthly Revenue</p>
                <p className="text-xl font-bold text-gray-900">${monthlyRevenue.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Growth */}
        <Card className="bg-white border-[#E5E7EB]">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-emerald-50 p-2.5">
                <TrendingUp className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Growth</p>
                <p className="text-xl font-bold text-emerald-600">+{growth}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Failed Payments */}
        <Card className="bg-white border-[#E5E7EB]">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-red-50 p-2.5">
                <AlertCircle className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Failed Payments</p>
                <p className="text-xl font-bold text-gray-900">{failedPayments}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active Subscribers */}
        <Card className="bg-white border-[#E5E7EB]">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-emerald-50 p-2.5">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Active Subscribers</p>
                <p className="text-xl font-bold text-gray-900">{activeSubscribers.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Trend Chart */}
      <Card className="bg-white border-[#E5E7EB]" style={{ borderWidth: '1.11px', borderRadius: '10px' }}>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Revenue Trend (1 Year)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative h-[250px] w-full">
            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 flex h-[200px] flex-col justify-between text-xs text-gray-400">
              <span>100000</span>
              <span>75000</span>
              <span>50000</span>
              <span>25000</span>
              <span>0</span>
            </div>
            
            {/* Chart area */}
            <div className="ml-12 h-[200px] w-[calc(100%-48px)]">
              <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="h-full w-full" preserveAspectRatio="none">
                {/* Grid lines */}
                {[0, 25, 50, 75, 100].map((percent) => (
                  <line
                    key={percent}
                    x1="0"
                    y1={chartHeight - (percent / 100) * chartHeight}
                    x2={chartWidth}
                    y2={chartHeight - (percent / 100) * chartHeight}
                    stroke="#f0f0f0"
                    strokeWidth="1"
                  />
                ))}
                
                {/* Area fill */}
                <defs>
                  <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.02" />
                  </linearGradient>
                </defs>
                
                <path
                  d={`
                    M 0 ${chartHeight}
                    ${revenueData.map((d, i) => {
                      const x = (i / (revenueData.length - 1)) * chartWidth;
                      const y = chartHeight - (d.revenue / 100000) * chartHeight;
                      return `L ${x} ${y}`;
                    }).join(' ')}
                    L ${chartWidth} ${chartHeight}
                    Z
                  `}
                  fill="url(#areaGradient)"
                />
                
                {/* Line */}
                <path
                  d={revenueData.map((d, i) => {
                    const x = (i / (revenueData.length - 1)) * chartWidth;
                    const y = chartHeight - (d.revenue / 100000) * chartHeight;
                    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                  }).join(' ')}
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2"
                />
                
                {/* Data points */}
                {revenueData.map((d, i) => {
                  const x = (i / (revenueData.length - 1)) * chartWidth;
                  const y = chartHeight - (d.revenue / 100000) * chartHeight;
                  return (
                    <circle
                      key={i}
                      cx={x}
                      cy={y}
                      r="4"
                      fill="#10b981"
                      stroke="white"
                      strokeWidth="2"
                    />
                  );
                })}
              </svg>
            </div>
            
            {/* X-axis labels */}
            <div className="ml-12 mt-2 flex justify-between text-xs text-gray-400">
              {revenueData.map((d) => (
                <span key={d.month}>{d.month}</span>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subscription Plans */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Subscription Plans</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan) => (
            <Card 
              key={plan.id} 
              className="border-[#E5E7EB]"
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '10px',
                borderWidth: '1.11px',
                minHeight: '352px',
              }}
            >
              <CardContent 
                className="flex flex-col"
                style={{
                  paddingTop: '25.1px',
                  paddingRight: '25.1px',
                  paddingBottom: '1.11px',
                  paddingLeft: '25.1px',
                  gap: '15.99px',
                }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{plan.name}</h3>
                    <p className="text-xs text-gray-500">{plan.duration}</p>
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
                  {plan.priceLabel && (
                    <span className="text-sm text-gray-500">{plan.priceLabel}</span>
                  )}
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Video Limit</span>
                    <span className="text-gray-900">{plan.videoLimit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Feedback Depth</span>
                    <span className="text-gray-900">{plan.feedbackDepth}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Training Plans</span>
                    <span className="text-gray-900">{plan.trainingPlans ? "Yes" : "No"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Progress Tracking</span>
                    <span className="text-gray-900">{plan.progressTracking ? "Yes" : "No"}</span>
                  </div>
                </div>
                
                <div className="border-t border-[#E5E7EB] pt-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Subscribers</span>
                    <span className="font-semibold text-gray-900">{plan.subscribers.toLocaleString()}</span>
                  </div>
                </div>
                
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

      {/* Recent Transactions */}
      <Card className="bg-white border-[#E5E7EB]" style={{ borderWidth: '1.11px', borderRadius: '10px' }}>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-b border-[#E5E7EB]">
                <TableHead className="text-xs font-medium uppercase text-gray-500">
                  Transaction ID
                </TableHead>
                <TableHead className="text-xs font-medium uppercase text-gray-500">
                  User
                </TableHead>
                <TableHead className="text-xs font-medium uppercase text-gray-500">
                  Plan
                </TableHead>
                <TableHead className="text-xs font-medium uppercase text-gray-500">
                  Amount
                </TableHead>
                <TableHead className="text-xs font-medium uppercase text-gray-500">
                  Date
                </TableHead>
                <TableHead className="text-xs font-medium uppercase text-gray-500">
                  Status
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockTransactions.map((transaction) => (
                <TableRow key={transaction.id} className="border-b border-[#E5E7EB]">
                  <TableCell className="font-medium text-gray-900">
                    {transaction.transactionId}
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {transaction.userName}
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {transaction.plan}
                  </TableCell>
                  <TableCell className="font-medium text-[#101828]">
                    ${transaction.amount}
                  </TableCell>
                  <TableCell className="text-gray-500">
                    {transaction.date}
                  </TableCell>
                  <TableCell>
                    <span 
                      className="font-medium px-3 py-1 rounded-full text-xs inline-block"
                      style={{
                        backgroundColor: statusColors[transaction.status].bg,
                        color: statusColors[transaction.status].text,
                      }}
                    >
                      {transaction.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

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
                <Input
                  id="planName"
                  value={editingPlan.name}
                  onChange={(e) => setEditingPlan({ ...editingPlan, name: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <Input
                  id="duration"
                  value={editingPlan.duration}
                  onChange={(e) => setEditingPlan({ ...editingPlan, duration: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  value={editingPlan.price}
                  onChange={(e) => setEditingPlan({ ...editingPlan, price: parseFloat(e.target.value) || 0 })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="videoLimit">Video Limit</Label>
                <Input
                  id="videoLimit"
                  value={editingPlan.videoLimit}
                  onChange={(e) => setEditingPlan({ ...editingPlan, videoLimit: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="feedbackDepth">Feedback Depth</Label>
                <Select
                  value={editingPlan.feedbackDepth}
                  onValueChange={(value) => setEditingPlan({ ...editingPlan, feedbackDepth: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Basic">Basic</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                    <SelectItem value="Expert">Expert</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="trainingPlans">Training Plans</Label>
                <Switch
                  id="trainingPlans"
                  checked={editingPlan.trainingPlans}
                  onCheckedChange={(checked) => setEditingPlan({ ...editingPlan, trainingPlans: checked })}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="progressTracking">Progress Tracking</Label>
                <Switch
                  id="progressTracking"
                  checked={editingPlan.progressTracking}
                  onCheckedChange={(checked) => setEditingPlan({ ...editingPlan, progressTracking: checked })}
                />
              </div>
              
              <DialogFooter className="flex gap-3 pt-4">
                <Button onClick={handleSavePlan} className="bg-[#1D4ED8] hover:bg-[#1e40af] flex-1">
                  Save Changes
                </Button>
                <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                  Cancel
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
