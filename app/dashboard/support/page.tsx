"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatsCard } from "@/components/common/StatsCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle,
  Search,
  Filter,
  Eye,
  Send,
} from "lucide-react";

interface SupportTicket {
  id: string;
  userName: string;
  userEmail: string;
  subject: string;
  description: string;
  status: "Open" | "In Progress" | "Resolved" | "Closed";
  priority: "Low" | "Medium" | "High" | "Urgent";
  category: string;
  createdAt: string;
  assignedTo?: string;
}

const mockTickets: SupportTicket[] = [
  {
    id: "TKT-001",
    userName: "John Smith",
    userEmail: "john.smith@email.com",
    subject: "Cannot upload video",
    description: "I'm getting an error when trying to upload my golf swing video.",
    status: "Open",
    priority: "High",
    category: "Technical",
    createdAt: "2024-02-01 10:30",
    assignedTo: "Support Agent 1",
  },
  {
    id: "TKT-002",
    userName: "Sarah Johnson",
    userEmail: "sarah.j@email.com",
    subject: "Subscription billing question",
    description: "I was charged twice for my subscription this month.",
    status: "In Progress",
    priority: "Urgent",
    category: "Billing",
    createdAt: "2024-02-01 09:15",
    assignedTo: "Support Agent 2",
  },
  {
    id: "TKT-003",
    userName: "Mike Davis",
    userEmail: "mdavis@email.com",
    subject: "AI analysis not working",
    description: "My videos are stuck in processing state for over 24 hours.",
    status: "Open",
    priority: "Medium",
    category: "Technical",
    createdAt: "2024-01-31 16:45",
  },
  {
    id: "TKT-004",
    userName: "Emily Wilson",
    userEmail: "emily.w@email.com",
    subject: "Feature request",
    description: "Can you add support for tennis swing analysis?",
    status: "Resolved",
    priority: "Low",
    category: "Feature Request",
    createdAt: "2024-01-31 14:20",
    assignedTo: "Support Agent 1",
  },
  {
    id: "TKT-005",
    userName: "David Brown",
    userEmail: "dbrown@email.com",
    subject: "Account access issue",
    description: "I cannot log in to my account after password reset.",
    status: "Closed",
    priority: "High",
    category: "Account",
    createdAt: "2024-01-30 11:00",
    assignedTo: "Support Agent 3",
  },
];

const statusColors: Record<string, string> = {
  Open: "bg-blue-100 text-blue-700",
  "In Progress": "bg-yellow-100 text-yellow-700",
  Resolved: "bg-emerald-100 text-emerald-700",
  Closed: "bg-gray-100 text-gray-700",
};

const priorityColors: Record<string, string> = {
  Low: "bg-gray-100 text-gray-700",
  Medium: "bg-blue-100 text-blue-700",
  High: "bg-orange-100 text-orange-700",
  Urgent: "bg-red-100 text-red-700",
};

export default function SupportPage() {
  const [tickets] = useState<SupportTicket[]>(mockTickets);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [responseText, setResponseText] = useState("");

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.userName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || ticket.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: tickets.length,
    open: tickets.filter((t) => t.status === "Open").length,
    inProgress: tickets.filter((t) => t.status === "In Progress").length,
    resolved: tickets.filter((t) => t.status === "Resolved" || t.status === "Closed").length,
  };

  const handleView = (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    setViewModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Support & Engagement"
        description="Manage support tickets and user engagement"
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center justify-between gap-3 sm:gap-4">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[130px] sm:w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Open">Open</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Resolved">Resolved</SelectItem>
              <SelectItem value="Closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search tickets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-[250px] lg:w-[300px] pl-10"
          />
        </div>
      </div>

      {/* Tickets Table */}
      <div className="rounded-lg border border-[#E5E7EB] bg-white overflow-x-auto">
        <Table className="min-w-[900px]">
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs font-medium uppercase text-gray-500">
                Ticket ID
              </TableHead>
              <TableHead className="text-xs font-medium uppercase text-gray-500">
                User
              </TableHead>
              <TableHead className="text-xs font-medium uppercase text-gray-500">
                Subject
              </TableHead>
              <TableHead className="text-xs font-medium uppercase text-gray-500">
                Category
              </TableHead>
              <TableHead className="text-xs font-medium uppercase text-gray-500">
                Priority
              </TableHead>
              <TableHead className="text-xs font-medium uppercase text-gray-500">
                Status
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
            {filteredTickets.map((ticket) => (
              <TableRow key={ticket.id}>
                <TableCell className="font-medium text-gray-900">
                  {ticket.id}
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium text-gray-900">{ticket.userName}</p>
                    <p className="text-sm text-gray-500">{ticket.userEmail}</p>
                  </div>
                </TableCell>
                <TableCell className="max-w-[200px] truncate text-gray-600">
                  {ticket.subject}
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                    {ticket.category}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={priorityColors[ticket.priority]}>
                    {ticket.priority}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={statusColors[ticket.status]}>
                    {ticket.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-gray-600">{ticket.createdAt}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleView(ticket)}
                    >
                      <Eye className="h-4 w-4 text-gray-500" />
                    </Button>
                    <Button variant="outline" size="sm">
                      Respond
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* View Ticket Modal */}
      <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Ticket Details - {selectedTicket?.id}</DialogTitle>
          </DialogHeader>
          {selectedTicket && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">
                    {selectedTicket.userName}
                  </p>
                  <p className="text-sm text-gray-500">
                    {selectedTicket.userEmail}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Badge className={priorityColors[selectedTicket.priority]}>
                    {selectedTicket.priority}
                  </Badge>
                  <Badge className={statusColors[selectedTicket.status]}>
                    {selectedTicket.status}
                  </Badge>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Subject</p>
                <p className="font-medium">{selectedTicket.subject}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Description</p>
                <p className="text-gray-700">{selectedTicket.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Category</p>
                  <p className="font-medium">{selectedTicket.category}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Assigned To</p>
                  <p className="font-medium">
                    {selectedTicket.assignedTo || "Unassigned"}
                  </p>
                </div>
              </div>
              <div className="border-t border-[#E5E7EB] pt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Send Response
                </p>
                <Textarea
                  placeholder="Type your response..."
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  className="mb-3"
                />
                <div className="flex gap-3">
                  <Button className="gap-2 bg-[#1D4ED8] hover:bg-[#1e40af] flex-1">
                    <Send className="h-4 w-4" />
                    Send Response
                  </Button>
                  <Button variant="outline" onClick={() => setViewModalOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
