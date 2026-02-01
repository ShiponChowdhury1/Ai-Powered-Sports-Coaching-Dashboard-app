"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatsCard } from "@/components/common/StatsCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import {
  CreditCard,
  DollarSign,
  Users,
  TrendingUp,
  Search,
  Filter,
  Eye,
  XCircle,
  RefreshCw,
} from "lucide-react";

interface Subscription {
  id: string;
  userName: string;
  userEmail: string;
  plan: "Free" | "Monthly" | "3-Month" | "Yearly" | "School";
  status: "Active" | "Cancelled" | "Expired" | "Trial";
  startDate: string;
  endDate: string;
  amount: number;
  autoRenew: boolean;
}

interface Payment {
  id: string;
  userName: string;
  amount: number;
  status: "Completed" | "Pending" | "Failed" | "Refunded";
  paymentDate: string;
  paymentMethod: string;
  invoiceId: string;
}

const mockSubscriptions: Subscription[] = [
  {
    id: "1",
    userName: "John Smith",
    userEmail: "john.smith@email.com",
    plan: "Monthly",
    status: "Active",
    startDate: "2024-01-15",
    endDate: "2024-02-15",
    amount: 29.99,
    autoRenew: true,
  },
  {
    id: "2",
    userName: "Sarah Johnson",
    userEmail: "sarah.j@email.com",
    plan: "Yearly",
    status: "Active",
    startDate: "2024-01-01",
    endDate: "2025-01-01",
    amount: 249.99,
    autoRenew: true,
  },
  {
    id: "3",
    userName: "Mike Davis",
    userEmail: "mdavis@email.com",
    plan: "3-Month",
    status: "Active",
    startDate: "2024-01-10",
    endDate: "2024-04-10",
    amount: 79.99,
    autoRenew: false,
  },
  {
    id: "4",
    userName: "Emily Wilson",
    userEmail: "emily.w@email.com",
    plan: "Monthly",
    status: "Cancelled",
    startDate: "2024-01-01",
    endDate: "2024-02-01",
    amount: 29.99,
    autoRenew: false,
  },
];

const mockPayments: Payment[] = [
  {
    id: "1",
    userName: "John Smith",
    amount: 29.99,
    status: "Completed",
    paymentDate: "2024-02-01",
    paymentMethod: "Visa •••• 4242",
    invoiceId: "INV-001",
  },
  {
    id: "2",
    userName: "Sarah Johnson",
    amount: 249.99,
    status: "Completed",
    paymentDate: "2024-01-01",
    paymentMethod: "Mastercard •••• 5555",
    invoiceId: "INV-002",
  },
  {
    id: "3",
    userName: "Mike Davis",
    amount: 79.99,
    status: "Completed",
    paymentDate: "2024-01-10",
    paymentMethod: "Visa •••• 1234",
    invoiceId: "INV-003",
  },
  {
    id: "4",
    userName: "David Brown",
    amount: 29.99,
    status: "Failed",
    paymentDate: "2024-01-20",
    paymentMethod: "Visa •••• 9999",
    invoiceId: "INV-004",
  },
  {
    id: "5",
    userName: "Lisa Anderson",
    amount: 249.99,
    status: "Refunded",
    paymentDate: "2024-01-15",
    paymentMethod: "PayPal",
    invoiceId: "INV-005",
  },
];

const planColors: Record<string, string> = {
  Free: "bg-gray-100 text-gray-700",
  Monthly: "bg-emerald-100 text-emerald-700",
  "3-Month": "bg-orange-100 text-orange-700",
  Yearly: "bg-red-100 text-red-700",
  School: "bg-blue-100 text-blue-700",
};

const statusColors: Record<string, string> = {
  Active: "bg-emerald-100 text-emerald-700",
  Cancelled: "bg-gray-100 text-gray-700",
  Expired: "bg-red-100 text-red-700",
  Trial: "bg-blue-100 text-blue-700",
  Completed: "bg-emerald-100 text-emerald-700",
  Pending: "bg-yellow-100 text-yellow-700",
  Failed: "bg-red-100 text-red-700",
  Refunded: "bg-purple-100 text-purple-700",
};

export default function SubscriptionsPage() {
  const [subscriptions] = useState<Subscription[]>(mockSubscriptions);
  const [payments] = useState<Payment[]>(mockPayments);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const totalRevenue = payments
    .filter((p) => p.status === "Completed")
    .reduce((acc, p) => acc + p.amount, 0);

  const activeSubscriptions = subscriptions.filter(
    (s) => s.status === "Active"
  ).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Subscriptions & Payments"
        description="Manage subscriptions and payment transactions"
      />

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Revenue"
          value={`$${totalRevenue.toFixed(2)}`}
          icon={DollarSign}
          iconColor="text-emerald-600"
          iconBgColor="bg-emerald-50"
          change={12.5}
        />
        <StatsCard
          title="Active Subscriptions"
          value={activeSubscriptions}
          icon={Users}
          iconColor="text-blue-600"
          iconBgColor="bg-blue-50"
        />
        <StatsCard
          title="Monthly Recurring"
          value="$2,450"
          icon={TrendingUp}
          iconColor="text-purple-600"
          iconBgColor="bg-purple-50"
          change={8.3}
        />
        <StatsCard
          title="Failed Payments"
          value={payments.filter((p) => p.status === "Failed").length}
          icon={CreditCard}
          iconColor="text-red-600"
          iconBgColor="bg-red-50"
        />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="subscriptions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
        </TabsList>

        <TabsContent value="subscriptions" className="space-y-4">
          {/* Filters */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="h-4 w-4" />
                Filters
              </Button>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                  <SelectItem value="Expired">Expired</SelectItem>
                  <SelectItem value="Trial">Trial</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search subscriptions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-[300px] pl-10"
              />
            </div>
          </div>

          {/* Subscriptions Table */}
          <div className="rounded-lg border bg-white">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs font-medium uppercase text-gray-500">
                    User
                  </TableHead>
                  <TableHead className="text-xs font-medium uppercase text-gray-500">
                    Plan
                  </TableHead>
                  <TableHead className="text-xs font-medium uppercase text-gray-500">
                    Status
                  </TableHead>
                  <TableHead className="text-xs font-medium uppercase text-gray-500">
                    Start Date
                  </TableHead>
                  <TableHead className="text-xs font-medium uppercase text-gray-500">
                    End Date
                  </TableHead>
                  <TableHead className="text-xs font-medium uppercase text-gray-500">
                    Amount
                  </TableHead>
                  <TableHead className="text-xs font-medium uppercase text-gray-500">
                    Auto Renew
                  </TableHead>
                  <TableHead className="text-xs font-medium uppercase text-gray-500">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscriptions.map((sub) => (
                  <TableRow key={sub.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-gray-900">{sub.userName}</p>
                        <p className="text-sm text-gray-500">{sub.userEmail}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={planColors[sub.plan]}>{sub.plan}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[sub.status]}>
                        {sub.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-600">{sub.startDate}</TableCell>
                    <TableCell className="text-gray-600">{sub.endDate}</TableCell>
                    <TableCell className="text-gray-900 font-medium">
                      ${sub.amount}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={
                          sub.autoRenew
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-gray-100 text-gray-700"
                        }
                      >
                        {sub.autoRenew ? "Yes" : "No"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye className="h-4 w-4 text-gray-500" />
                        </Button>
                        {sub.status === "Active" && (
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <XCircle className="h-4 w-4 text-red-500" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          {/* Payments Table */}
          <div className="rounded-lg border bg-white">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs font-medium uppercase text-gray-500">
                    Invoice ID
                  </TableHead>
                  <TableHead className="text-xs font-medium uppercase text-gray-500">
                    User
                  </TableHead>
                  <TableHead className="text-xs font-medium uppercase text-gray-500">
                    Amount
                  </TableHead>
                  <TableHead className="text-xs font-medium uppercase text-gray-500">
                    Status
                  </TableHead>
                  <TableHead className="text-xs font-medium uppercase text-gray-500">
                    Payment Method
                  </TableHead>
                  <TableHead className="text-xs font-medium uppercase text-gray-500">
                    Date
                  </TableHead>
                  <TableHead className="text-xs font-medium uppercase text-gray-500">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium text-gray-900">
                      {payment.invoiceId}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {payment.userName}
                    </TableCell>
                    <TableCell className="text-gray-900 font-medium">
                      ${payment.amount}
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[payment.status]}>
                        {payment.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {payment.paymentMethod}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {payment.paymentDate}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye className="h-4 w-4 text-gray-500" />
                        </Button>
                        {payment.status === "Failed" && (
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <RefreshCw className="h-4 w-4 text-blue-500" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
