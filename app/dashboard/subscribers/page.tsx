"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { ConfirmModal } from "@/components/common/ConfirmModal";
import { Search, MoreVertical, Trash2, ToggleLeft, ToggleRight, Mail } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setCurrentPage, setSearchQuery } from "@/features/subscribers/subscribersSlice";
import {
  useGetSubscribersQuery,
  useDeleteSubscriberMutation,
  useToggleSubscriberStatusMutation,
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
  const [deleteSubscriber] = useDeleteSubscriberMutation();
  const [toggleStatus] = useToggleSubscriberStatusMutation();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedSubscriberId, setSelectedSubscriberId] = useState<number | null>(null);
  const [localSearch, setLocalSearch] = useState(searchQuery);

  const handleSearch = () => {
    dispatch(setSearchQuery(localSearch));
  };

  const handleDeleteClick = (id: number) => {
    setSelectedSubscriberId(id);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedSubscriberId) return;
    
    try {
      await deleteSubscriber(selectedSubscriberId).unwrap();
      toast.success("Subscriber deleted successfully");
      setDeleteModalOpen(false);
      setSelectedSubscriberId(null);
    } catch (error) {
      toast.error("Failed to delete subscriber");
    }
  };

  const handleToggleStatus = async (id: number) => {
    try {
      await toggleStatus(id).unwrap();
      toast.success("Subscriber status updated");
    } catch (error) {
      toast.error("Failed to update subscriber status");
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
                          onClick={() => handleDeleteClick(subscriber.id)}
                          className="text-red-600 focus:text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
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

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        title="Delete Subscriber"
        description="Are you sure you want to delete this subscriber? This action cannot be undone."
        onConfirm={handleDeleteConfirm}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
}
