"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Filter,
  Eye,
  Send,
} from "lucide-react";
import {
  useGetTicketsQuery,
  useGetTicketDetailQuery,
  useReplyToTicketMutation,
  useUpdateTicketStatusMutation,
} from "@/store/api/supportApi";
import { toast } from "sonner";

const statusColors: Record<string, string> = {
  OPEN: "bg-blue-100 text-blue-700",
  IN_PROGRESS: "bg-yellow-100 text-yellow-700",
  RESOLVED: "bg-emerald-100 text-emerald-700",
  CLOSED: "bg-gray-100 text-gray-700",
};

const priorityColors: Record<string, string> = {
  LOW: "bg-gray-100 text-gray-700",
  MEDIUM: "bg-blue-100 text-blue-700",
  HIGH: "bg-orange-100 text-orange-700",
  URGENT: "bg-red-100 text-red-700",
};

const statusLabels: Record<string, string> = {
  OPEN: "Open",
  IN_PROGRESS: "In Progress",
  RESOLVED: "Resolved",
  CLOSED: "Closed",
};

export default function SupportPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [responseText, setResponseText] = useState("");

  const queryParams: { status?: string; priority?: string } = {};
  if (statusFilter !== "all") queryParams.status = statusFilter;

  const { data: tickets = [], isLoading } = useGetTicketsQuery(queryParams);
  const { data: ticketDetail } = useGetTicketDetailQuery(selectedTicketId!, {
    skip: !selectedTicketId,
  });
  const [replyToTicket] = useReplyToTicketMutation();
  const [updateTicketStatus] = useUpdateTicketStatusMutation();

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.user_name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleView = (ticketId: number) => {
    setSelectedTicketId(ticketId);
    setViewModalOpen(true);
    setResponseText("");
  };

  const handleSendReply = async () => {
    if (!selectedTicketId || !responseText.trim()) return;
    try {
      await replyToTicket({ ticketId: selectedTicketId, message: responseText }).unwrap();
      toast.success("Reply sent successfully");
      setResponseText("");
    } catch {
      toast.error("Failed to send reply");
    }
  };

  const handleStatusChange = async (ticketId: number, status: string) => {
    try {
      await updateTicketStatus({ ticketId, status }).unwrap();
      toast.success("Status updated successfully");
    } catch {
      toast.error("Failed to update status");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Support & Engagement" description="Manage support tickets and user engagement" />
        <div className="flex items-center justify-center h-64 text-gray-500">Loading...</div>
      </div>
    );
  }

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
              <SelectItem value="OPEN">Open</SelectItem>
              <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
              <SelectItem value="RESOLVED">Resolved</SelectItem>
              <SelectItem value="CLOSED">Closed</SelectItem>
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
      <div className="rounded-lg border border-[#E5E7EB] bg-white overflow-x-auto" style={{ borderWidth: '1.11px', borderRadius: '10px' }}>
        <Table className="min-w-[900px]">
          <TableHeader>
            <TableRow className="hover:bg-transparent border-b border-[#E5E7EB]">
              <TableHead className="text-xs font-medium uppercase text-gray-500">Ticket ID</TableHead>
              <TableHead className="text-xs font-medium uppercase text-gray-500">User</TableHead>
              <TableHead className="text-xs font-medium uppercase text-gray-500">Subject</TableHead>
              <TableHead className="text-xs font-medium uppercase text-gray-500">Category</TableHead>
              <TableHead className="text-xs font-medium uppercase text-gray-500">Priority</TableHead>
              <TableHead className="text-xs font-medium uppercase text-gray-500">Status</TableHead>
              <TableHead className="text-xs font-medium uppercase text-gray-500">Created</TableHead>
              <TableHead className="text-xs font-medium uppercase text-gray-500">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTickets.map((ticket) => (
              <TableRow key={ticket.id} className="border-b border-[#E5E7EB]">
                <TableCell className="font-medium text-gray-900">#{ticket.id}</TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium text-gray-900">{ticket.user_name}</p>
                    <p className="text-sm text-gray-500">{ticket.user_email}</p>
                  </div>
                </TableCell>
                <TableCell className="max-w-[200px] truncate text-gray-600">{ticket.subject}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="bg-gray-100 text-gray-700">{ticket.category}</Badge>
                </TableCell>
                <TableCell>
                  <Badge className={priorityColors[ticket.priority] || "bg-gray-100 text-gray-700"}>{ticket.priority}</Badge>
                </TableCell>
                <TableCell>
                  <Badge className={statusColors[ticket.status] || "bg-gray-100 text-gray-700"}>
                    {statusLabels[ticket.status] || ticket.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-gray-500">{new Date(ticket.created_at).toLocaleDateString()}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleView(ticket.id)}
                    >
                      <Eye className="h-4 w-4 text-gray-500" />
                    </Button>
                    <Select
                      value={ticket.status}
                      onValueChange={(value) => handleStatusChange(ticket.id, value)}
                    >
                      <SelectTrigger className="w-[120px] h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="OPEN">Open</SelectItem>
                        <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                        <SelectItem value="RESOLVED">Resolved</SelectItem>
                        <SelectItem value="CLOSED">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filteredTickets.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-gray-500 py-8">
                  No tickets found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* View Ticket Modal */}
      <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Ticket #{selectedTicketId}</DialogTitle>
          </DialogHeader>
          {ticketDetail && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{ticketDetail.user_name}</p>
                  <p className="text-sm text-gray-500">{ticketDetail.user_email}</p>
                </div>
                <div className="flex gap-2">
                  <Badge className={priorityColors[ticketDetail.priority] || "bg-gray-100 text-gray-700"}>
                    {ticketDetail.priority}
                  </Badge>
                  <Badge className={statusColors[ticketDetail.status] || "bg-gray-100 text-gray-700"}>
                    {statusLabels[ticketDetail.status] || ticketDetail.status}
                  </Badge>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Subject</p>
                <p className="font-medium">{ticketDetail.subject}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Description</p>
                <p className="text-gray-700">{ticketDetail.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Category</p>
                  <p className="font-medium">{ticketDetail.category}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Assigned To</p>
                  <p className="font-medium">{ticketDetail.assigned_to_name || "Unassigned"}</p>
                </div>
              </div>

              {/* Replies */}
              {ticketDetail.replies && ticketDetail.replies.length > 0 && (
                <div className="border-t border-[#E5E7EB] pt-3 space-y-3">
                  <p className="text-sm font-medium text-gray-700">Replies</p>
                  <div className="max-h-48 overflow-y-auto space-y-2">
                    {ticketDetail.replies.map((reply) => (
                      <div
                        key={reply.id}
                        className={`p-3 rounded-lg text-sm ${
                          reply.is_staff_reply ? "bg-blue-50 border border-blue-100" : "bg-gray-50 border border-gray-100"
                        }`}
                      >
                        <div className="flex justify-between mb-1">
                          <span className="font-medium text-gray-900">{reply.user_name}</span>
                          <span className="text-xs text-gray-500">{new Date(reply.created_at).toLocaleString()}</span>
                        </div>
                        <p className="text-gray-700">{reply.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="border-t border-[#E5E7EB] pt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Send Response</p>
                <Textarea
                  placeholder="Type your response..."
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  className="mb-3"
                />
                <div className="flex gap-3">
                  <Button
                    className="gap-2 bg-[#1D4ED8] hover:bg-[#1e40af] flex-1"
                    onClick={handleSendReply}
                    disabled={!responseText.trim()}
                  >
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
