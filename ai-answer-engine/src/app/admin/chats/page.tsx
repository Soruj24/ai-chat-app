"use client";

import React, { useEffect, useState } from "react";
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { showConfirm, showToast } from "@/lib/swal";
import { AdminChatsRow } from "@/components/admin/AdminChatsRow";
import { AdminChatsSkeletonRow } from "@/components/admin/AdminChatsSkeletonRow";
import { AdminPagination } from "@/components/admin/AdminPagination";

interface ChatSession {
  sessionId: string;
  title: string;
  updatedAt: string;
  messageCount: number;
  lastMessage: string;
}

interface ChatsResponse {
  chats: ChatSession[];
  total: number;
  page: number;
  pages: number;
}

export default function AdminChatsPage() {
  const [chats, setChats] = useState<ChatSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchChats = async (pageNum: number, search: string) => {
    setIsLoading(true);
    setError("");
    try {
      const url = new URL("http://localhost:3001/api/admin/chats");
      url.searchParams.append("page", pageNum.toString());
      url.searchParams.append("limit", "10");
      if (search) url.searchParams.append("search", search);

      const res = await fetch(url.toString());
      if (!res.ok) throw new Error("Failed to fetch chats");
      const data: ChatsResponse = await res.json();
      setChats(data.chats);
      setTotalPages(data.pages);
      setPage(data.page);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchChats(page, debouncedSearch);
  }, [page, debouncedSearch]);

  const handleDelete = async (sessionId: string) => {
    const isConfirmed = await showConfirm(
      "Delete Chat Session?",
      "Are you sure you want to delete this chat session? This action cannot be undone."
    );

    if (!isConfirmed) return;

    setDeleteLoading(sessionId);
    try {
      const res = await fetch(`http://localhost:3001/api/admin/chats/${sessionId}`, {
        method: "DELETE",
      });
      
      if (!res.ok) throw new Error("Failed to delete chat");
      
      showToast("Chat session deleted successfully");
      
      // Refresh list
      fetchChats(page, debouncedSearch);
    } catch (err) {
      showToast(err instanceof Error ? err.message : String(err), "error");
    } finally {
      setDeleteLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Chat Sessions</h2>
          <p className="text-muted-foreground">
            Manage and monitor user chat sessions
          </p>
        </div>
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search chats..."
            className="pl-8 w-full sm:w-[300px] bg-background/50 backdrop-blur-sm border-border/50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card className="glass-card border-border/50 overflow-hidden">
        <CardHeader className="border-b border-border/10 bg-muted/5">
          <CardTitle className="text-lg">All Chats</CardTitle>
          <CardDescription>
            A list of all chat sessions created by users.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/5">
                <TableRow className="hover:bg-transparent border-b border-border/10">
                  <TableHead className="w-[300px]">Title</TableHead>
                  <TableHead>Messages</TableHead>
                  <TableHead>Last Activity</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => <AdminChatsSkeletonRow key={i} />)
                ) : chats.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                      No chat sessions found.
                    </TableCell>
                  </TableRow>
                ) : (
                  chats.map((chat) => (
                    <AdminChatsRow
                      key={chat.sessionId}
                      chat={chat}
                      onDelete={handleDelete}
                      deleteLoadingId={deleteLoading}
                    />
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <AdminPagination
            page={page}
            totalPages={totalPages}
            onPrev={() => setPage((p) => Math.max(1, p - 1))}
            onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
          />
        </CardContent>
      </Card>
    </div>
  );
}
