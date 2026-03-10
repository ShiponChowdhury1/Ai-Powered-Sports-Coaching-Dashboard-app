"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Search, MoreVertical, ToggleLeft, ToggleRight, Mail, Send, Upload } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setCurrentPage, setSearchQuery } from "@/features/subscribers/subscribersSlice";
import {
  useGetSubscribersQuery,
  useToggleSubscriberStatusMutation,
  useSendMessageMutation,
} from "@/store/api/subscribersApi";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

export default function SubscribersPage() {
  const dispatch = useAppDispatch();
  const { currentPage, searchQuery } = useAppSelector((state) => state.subscribers);
  const { data, isLoading } = useGetSubscribersQuery({
    page: currentPage,
    search: searchQuery,
  });
  const [toggleStatus] = useToggleSubscriberStatusMutation();
  const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();
  const [localSearch, setLocalSearch] = useState(searchQuery);

  // Send Message modal state
  const [sendMessageOpen, setSendMessageOpen] = useState(false);
  const [messageRecipientId, setMessageRecipientId] = useState<number | null>(null);
  const [messageRecipientEmail, setMessageRecipientEmail] = useState("");
  const [messageSubject, setMessageSubject] = useState("");
  const [messageBody, setMessageBody] = useState("");
  const [messageAttachment, setMessageAttachment] = useState<File | null>(null);
  const [sendTestEmail, setSendTestEmail] = useState(false);

  const handleSearch = () => {
    dispatch(setSearchQuery(localSearch));
  };


  const handleToggleStatus = async (id: number) => {
    try {
      await toggleStatus(id).unwrap();
      toast.success("Subscriber status updated");
    } catch (error) {
      toast.error("Failed to update subscriber status");
    }
  };

  const handleSendMessage = (subscriber: { id: number; email: string }) => {
    setMessageRecipientId(subscriber.id);
    setMessageRecipientEmail(subscriber.email);
    setMessageSubject("");
    setMessageBody("");
    setMessageAttachment(null);
    setSendTestEmail(false);
    setSendMessageOpen(true);
  };

  const handleSendMessageSubmit = async () => {
    if (!messageSubject.trim() || !messageBody.trim()) {
      toast.error("Subject and message are required");
      return;
    }
    try {
      const formData = new FormData();
      if (messageRecipientId) formData.append("subscriber_id", String(messageRecipientId));
      formData.append("subject", messageSubject);
      formData.append("message", messageBody);
      if (messageAttachment) formData.append("attachment", messageAttachment);
      if (sendTestEmail) formData.append("send_test", "true");
      await sendMessage(formData).unwrap();
      toast.success("Message sent successfully");
      setSendMessageOpen(false);
    } catch {
      toast.error("Failed to send message");
    }
  };

  const totalPages = data?.count ? Math.ceil(data.count / 10) : 0;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Subscribers Management"
        description="Manage email subscribers and their status"
      />

      {/* Search and Filter Section */}
      <div className="flex items-center justify-between gap-4 bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by email..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="pl-10"
            />
          </div>
          <Button onClick={handleSearch} className="bg-emerald-600 hover:bg-emerald-700">
            Search
          </Button>
        </div>
        <div className="text-sm text-gray-600">
          Total Subscribers: <span className="font-semibold">{data?.count || 0}</span>
        </div>
      </div>

      {/* Subscribers Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold text-gray-900">ID</TableHead>
              <TableHead className="font-semibold text-gray-900">Email Address</TableHead>
              <TableHead className="font-semibold text-gray-900">Status</TableHead>
              <TableHead className="font-semibold text-gray-900">Subscribed Date</TableHead>
              <TableHead className="font-semibold text-gray-900">Unsubscribed Date</TableHead>
              <TableHead className="font-semibold text-gray-900 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  Loading subscribers...
                </TableCell>
              </TableRow>
            ) : data?.results.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  No subscribers found
                </TableCell>
              </TableRow>
            ) : (
              data?.results.map((subscriber) => (
                <TableRow key={subscriber.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium text-gray-900">#{subscriber.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-900">{subscriber.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {subscriber.is_active ? (
                      <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                        Inactive
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {formatDistanceToNow(new Date(subscriber.subscribed_at), { addSuffix: true })}
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {subscriber.unsubscribed_at
                      ? formatDistanceToNow(new Date(subscriber.unsubscribed_at), { addSuffix: true })
                      : "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={() => handleToggleStatus(subscriber.id)}>
                          {subscriber.is_active ? (
                            <>
                              <ToggleLeft className="mr-2 h-4 w-4" />
                              Deactivate
                            </>
                          ) : (
                            <>
                              <ToggleRight className="mr-2 h-4 w-4" />
                              Activate
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleSendMessage(subscriber)}
                        >
                          <Send className="mr-2 h-4 w-4" />
                          Send Message
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => dispatch(setCurrentPage(currentPage - 1))}
              disabled={!data?.previous}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => dispatch(setCurrentPage(currentPage + 1))}
              disabled={!data?.next}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Send Message Modal */}
      <Dialog open={sendMessageOpen} onOpenChange={setSendMessageOpen}>
        <DialogContent className="sm:max-w-[500px] bg-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-900">Send Message</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Recipients</Label>
              <div className="flex items-center h-10 px-3 rounded-md border border-gray-200 bg-gray-50 text-sm text-gray-600">
                {messageRecipientEmail || "0 subscribers selected"}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="msg-subject" className="text-sm font-medium text-gray-700">Subject</Label>
              <Input
                id="msg-subject"
                placeholder="Enter email subject"
                value={messageSubject}
                onChange={(e) => setMessageSubject(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="msg-body" className="text-sm font-medium text-gray-700">Message</Label>
              <Textarea
                id="msg-body"
                placeholder="Type your message here..."
                value={messageBody}
                onChange={(e) => setMessageBody(e.target.value)}
                rows={6}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Attachment (Optional)</Label>
              <label
                htmlFor="msg-attachment"
                className="flex items-center justify-center gap-2 h-10 rounded-md border border-dashed border-gray-300 bg-white text-sm text-gray-500 cursor-pointer hover:border-gray-400 transition-colors"
              >
                <Upload className="h-4 w-4" />
                {messageAttachment ? messageAttachment.name : "Click to upload file"}
              </label>
              <input
                id="msg-attachment"
                type="file"
                className="hidden"
                onChange={(e) => setMessageAttachment(e.target.files?.[0] || null)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="send-test"
                checked={sendTestEmail}
                onCheckedChange={(checked) => setSendTestEmail(checked as boolean)}
              />
              <label htmlFor="send-test" className="text-sm text-gray-600">
                Send a test email to yourself first
              </label>
            </div>
          </div>
          <DialogFooter className="gap-3 pt-2">
            <Button variant="outline" onClick={() => setSendMessageOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSendMessageSubmit}
              disabled={isSending}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {isSending ? "Sending..." : "Send Message"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
