"use client";

import React, { useEffect, useState } from "react";
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { showConfirm, showToast } from "@/lib/swal";
import { AdminUsersRow } from "@/components/admin/AdminUsersRow";
import { AdminUsersSkeletonRow } from "@/components/admin/AdminUsersSkeletonRow";
import { AdminPagination } from "@/components/admin/AdminPagination";

interface UserType {
  _id: string;
  name?: string;
  email: string;
  role: string;
  createdAt: string;
}

interface UsersResponse {
  users: UserType[];
  total: number;
  page: number;
  pages: number;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserType[]>([]);
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
      setPage(1); // Reset to page 1 on search
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchUsers = async (pageNum: number, search: string) => {
    setIsLoading(true);
    setError("");
    try {
      const url = new URL("http://localhost:3001/api/admin/users");
      url.searchParams.append("page", pageNum.toString());
      url.searchParams.append("limit", "10");
      if (search) url.searchParams.append("search", search);

      const res = await fetch(url.toString());
      if (!res.ok) throw new Error("Failed to fetch users");
      const data: UsersResponse = await res.json();
      setUsers(data.users);
      setTotalPages(data.pages);
      setPage(data.page);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(page, debouncedSearch);
  }, [page, debouncedSearch]);

  const handleDelete = async (userId: string) => {
    const isConfirmed = await showConfirm(
      "Delete User?",
      "Are you sure you want to delete this user? This action cannot be undone."
    );

    if (!isConfirmed) return;

    setDeleteLoading(userId);
    try {
      const res = await fetch(`http://localhost:3001/api/admin/users/${userId}`, {
        method: "DELETE",
      });
      
      if (!res.ok) throw new Error("Failed to delete user");
      
      showToast("User deleted successfully");
      
      // Refresh list
      fetchUsers(page, debouncedSearch);
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
          <h2 className="text-3xl font-bold tracking-tight">Users</h2>
          <p className="text-muted-foreground">
            Manage registered users and administrators
          </p>
        </div>
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search users..."
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
          <CardTitle className="text-lg">All Users</CardTitle>
          <CardDescription>
            A directory of all registered users in the system.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/5">
                <TableRow className="hover:bg-transparent border-b border-border/10">
                  <TableHead className="w-[300px]">User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => <AdminUsersSkeletonRow key={i} />)
                ) : users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                      No users found.
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <AdminUsersRow
                      key={user._id}
                      user={user}
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
