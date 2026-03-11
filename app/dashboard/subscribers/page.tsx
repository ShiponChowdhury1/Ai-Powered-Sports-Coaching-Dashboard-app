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
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Search, Mail, Send } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setCurrentPage, setSearchQuery } from "@/features/subscribers/subscribersSlice";
import {
  useGetSubscribersQuery,
  useSendPromotionMutation,
  useBulkSendPromotionMutation,
} from "@/store/api/subscribersApi";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

export default function SubscribersPage() {
  const dispatch = useAppDispatch();
  const { currentPage, searchQuery } = useAppSelector((state) => state.subscribers);
  const { data, isLoading } = useGetSubscribersQuery({ page: currentPage, search: searchQuery });

  const [sendPromotion, { isLoading: isSendingSingle }] = useSendPromotionMutation();
  const [bulkSendPromotion, { isLoading: isBulkSending }] = useBulkSendPromotionMutation();

  const [localSearch, setLocalSearch] = useState(searchQuery);

  // Checkbox selection
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const allIds = data?.results.map((s) => s.id) ?? [];
  const allSelected = allIds.length > 0 && allIds.every((id) => selectedIds.includes(id));
  const isIndeterminate = selectedIds.length > 0 && !allSelected;

  const toggleSelectAll = () => {
    setSelectedIds(allSelected ? [] : allIds);
  };

  const toggleSelectOne = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  // Single send modal state
  const [singleModalOpen, setSingleModalOpen] = useState(false);
  const [singleRecipientId, setSingleRecipientId] = useState<number | null>(null);
  const [singleRecipientEmail, setSingleRecipientEmail] = useState("");

  // Bulk send modal state
  const [bulkModalOpen, setBulkModalOpen] = useState(false);

  // Shared message fields
  const [msgSubject, setMsgSubject] = useState("");
  const [msgBody, setMsgBody] = useState("");
  const [msgHtml, setMsgHtml] = useState("");

  const handleSearch = () => {
    dispatch(setSearchQuery(localSearch));
    setSelectedIds([]);
  };

  const openSingleModal = (subscriber: { id: number; email: string }) => {
    setSingleRecipientId(subscriber.id);
    setSingleRecipientEmail(subscriber.email);
    setMsgSubject("");
    setMsgBody("");
    setMsgHtml("");
    setSingleModalOpen(true);
  };

  const openBulkModal = () => {
    setMsgSubject("");
    setMsgBody("");
    setMsgHtml("");
    setBulkModalOpen(true);
  };

  const handleSingleSend = async () => {
    if (!msgSubject.trim() || !msgBody.trim()) {
      toast.error("Subject and message are required");
      return;
    }
    if (!singleRecipientId) return;
    try {
      await sendPromotion({
        id: singleRecipientId,
        subject: msgSubject,
        message: msgBody,
        html_message: msgHtml || undefined,
      }).unwrap();
      toast.success("Message sent successfully");
      setSingleModalOpen(false);
    } catch {
      toast.error("Failed to send message");
    }
  };

  const handleBulkSend = async () => {
    if (!msgSubject.trim() || !msgBody.trim()) {
      toast.error("Subject and message are required");
      return;
    }
    try {
      const result = await bulkSendPromotion({
        subscriber_ids: selectedIds,
        subject: msgSubject,
        message: msgBody,
        html_message: msgHtml || undefined,
      }).unwrap();
      toast.success(
        `Sent to ${result.sent_successfully} subscriber(s).${result.failed_count > 0 ? ` ${result.failed_count} failed.` : ""}`
      );
      setBulkModalOpen(false);
      setSelectedIds([]);
    } catch {
      toast.error("Failed to send bulk message");
    }
  };

  const totalPages = data?.count ? Math.ceil(data.count / 10) : 0;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Subscribers Management"
        description="Manage email subscribers and their status"
      />

      {/* Search + Bulk Action Bar */}
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

        <div className="flex items-center gap-3">
          {selectedIds.length > 0 && (
            <Button
              onClick={openBulkModal}
              className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
            >
              <Send className="h-4 w-4" />
              Send Message ({selectedIds.length} selected)
            </Button>
          )}
          <div className="text-sm text-gray-600">
            Total: <span className="font-semibold">{data?.count || 0}</span>
          </div>
        </div>
      </div>

      {/* Subscribers Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-12 pl-4">
                <Checkbox
                  checked={allSelected}
                  data-state={isIndeterminate ? "indeterminate" : allSelected ? "checked" : "unchecked"}
                  onCheckedChange={toggleSelectAll}
                  aria-label="Select all subscribers"
                />
              </TableHead>
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
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  Loading subscribers...
                </TableCell>
              </TableRow>
            ) : !data?.results.length ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  No subscribers found
                </TableCell>
              </TableRow>
            ) : (
              data.results.map((subscriber) => (
                <TableRow
                  key={subscriber.id}
                  className={`hover:bg-gray-50 ${selectedIds.includes(subscriber.id) ? "bg-emerald-50" : ""}`}
                >
                  <TableCell className="pl-4">
                    <Checkbox
                      checked={selectedIds.includes(subscriber.id)}
                      onCheckedChange={() => toggleSelectOne(subscriber.id)}
                      aria-label={`Select ${subscriber.email}`}
                    />
                  </TableCell>
                  <TableCell className="font-medium text-gray-900">{subscriber.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-900">{subscriber.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {subscriber.is_active ? (
                      <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Active</Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-gray-100 text-gray-700">Inactive</Badge>
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
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openSingleModal(subscriber)}
                      className="gap-1.5 border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800"
                    >
                      <Send className="h-3.5 w-3.5" />
                      Message
                    </Button>
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

      {/* Single Send Message Modal */}
      <Dialog open={singleModalOpen} onOpenChange={setSingleModalOpen}>
        <DialogContent className="sm:max-w-120 bg-white border border-gray-200 shadow-xl rounded-2xl p-0 overflow-hidden">
          <div className="bg-emerald-600 px-6 py-4">
            <DialogTitle className="text-lg font-semibold text-white">Send Message</DialogTitle>
            <p className="text-emerald-100 text-sm mt-0.5">{singleRecipientEmail}</p>
          </div>
          <div className="px-6 py-5 space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Recipient</Label>
              <div className="flex items-center h-10 px-3 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-600">
                <Mail className="h-4 w-4 text-gray-400 mr-2" />
                {singleRecipientEmail}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="single-subject" className="text-sm font-medium text-gray-700">Subject</Label>
              <Input
                id="single-subject"
                placeholder="Enter email subject"
                value={msgSubject}
                onChange={(e) => setMsgSubject(e.target.value)}
                className="border-gray-200"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="single-body" className="text-sm font-medium text-gray-700">Message</Label>
              <Textarea
                id="single-body"
                placeholder="Type your message here..."
                value={msgBody}
                onChange={(e) => setMsgBody(e.target.value)}
                rows={14}
                className="border-gray-200 resize-none"
              />
            </div>
          </div>
          <div className="px-6 pb-6 flex justify-end gap-3">
            <Button variant="outline" onClick={() => setSingleModalOpen(false)} className="border-gray-200">
              Cancel
            </Button>
            <Button
              onClick={handleSingleSend}
              disabled={isSendingSingle}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {isSendingSingle ? "Sending..." : "Send Message"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Bulk Send Message Modal */}
      <Dialog open={bulkModalOpen} onOpenChange={setBulkModalOpen}>
        <DialogContent className="sm:max-w-120 bg-white border border-gray-200 shadow-xl rounded-2xl p-0 overflow-hidden">
          <div className="bg-emerald-600 px-6 py-4">
            <DialogTitle className="text-lg font-semibold text-white">Send Bulk Message</DialogTitle>
            <p className="text-emerald-100 text-sm mt-0.5">{selectedIds.length} subscriber{selectedIds.length !== 1 ? "s" : ""} selected</p>
          </div>
          <div className="px-6 py-5 space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Recipients</Label>
              <div className="flex items-center h-10 px-3 rounded-lg border border-emerald-200 bg-emerald-50 text-sm text-emerald-700 font-medium">
                {selectedIds.length} subscriber{selectedIds.length !== 1 ? "s" : ""} selected
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bulk-subject" className="text-sm font-medium text-gray-700">Subject</Label>
              <Input
                id="bulk-subject"
                placeholder="Enter email subject"
                value={msgSubject}
                onChange={(e) => setMsgSubject(e.target.value)}
                className="border-gray-200"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bulk-body" className="text-sm font-medium text-gray-700">Message</Label>
              <Textarea
                id="bulk-body"
                placeholder="Type your message here..."
                value={msgBody}
                onChange={(e) => setMsgBody(e.target.value)}
                rows={12}
                className="border-gray-200 resize-none"
              />
            </div>

          </div>
          <div className="px-6 pb-6 flex justify-end gap-3">
            <Button variant="outline" onClick={() => setBulkModalOpen(false)} className="border-gray-200">
              Cancel
            </Button>
            <Button
              onClick={handleBulkSend}
              disabled={isBulkSending}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {isBulkSending ? "Sending..." : `Send to ${selectedIds.length} Subscriber${selectedIds.length !== 1 ? "s" : ""}`}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
