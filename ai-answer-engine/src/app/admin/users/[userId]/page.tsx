"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Loader2, 
  Trash2, 
  ArrowLeft,
  Calendar,
  Clock,
  MessageSquare,
  Shield,
  Mail,
  Copy,
  Check,
  Eye
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { format } from "date-fns";
import { showConfirm, showToast } from "@/lib/swal";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ChatSession {
  sessionId: string;
  title: string;
  updatedAt: string;
  messageCount: number;
  lastMessage: string;
}

interface UserDetail {
  user: {
    _id: string;
    name?: string;
    email: string;
    role: string;
    createdAt: string;
  };
  stats: {
    totalChats: number;
    totalMessages: number;
    lastActive: string | null;
  };
  chats: ChatSession[];
}

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.userId as string;
  
  const [data, setData] = useState<UserDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      setError("");
      try {
        const res = await fetch(`http://localhost:3001/api/admin/users/${userId}`);
        if (!res.ok) throw new Error("Failed to fetch user details");
        const userData = await res.json();
        setData(userData);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchUser();
    }
  }, [userId]);

  const handleDelete = async () => {
    const isConfirmed = await showConfirm(
      "Delete User?",
      "Are you sure you want to delete this user? This action cannot be undone and will delete all their chat history."
    );

    if (!isConfirmed) return;

    setDeleteLoading(true);
    try {
      const res = await fetch(`http://localhost:3001/api/admin/users/${userId}`, {
        method: "DELETE",
      });
      
      if (!res.ok) throw new Error("Failed to delete user");
      
      showToast("User deleted successfully");
      
      router.push("/admin/users");
    } catch (err) {
      showToast(err instanceof Error ? err.message : String(err), "error");
      setDeleteLoading(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getInitials = (name?: string, email?: string) => {
    if (name) return name.substring(0, 2).toUpperCase();
    if (email) return email.substring(0, 2).toUpperCase();
    return "U";
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="space-y-4 max-w-4xl mx-auto p-6">
        <Link href="/admin/users">
          <Button variant="ghost" className="mb-4 pl-0 hover:pl-2 transition-all">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Users
          </Button>
        </Link>
        <Alert variant="destructive">
          <AlertDescription>{error || "User not found"}</AlertDescription>
        </Alert>
      </div>
    );
  }

  const { user, stats, chats } = data;

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-10">
      {/* Header */}
      <div className="glass-card border-border/50 rounded-xl p-6 backdrop-blur-xl">
        <div className="flex flex-col md:flex-row items-start justify-between gap-6">
          <div className="flex items-start gap-4 w-full">
            <Link href="/admin/users">
              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-muted/50 -ml-2">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            
            <div className="flex flex-col sm:flex-row gap-6 w-full">
              <Avatar className="h-20 w-20 border-2 border-border/50 shadow-sm">
                <AvatarFallback className="bg-primary/5 text-primary text-xl font-bold">
                  {getInitials(user.name, user.email)}
                </AvatarFallback>
              </Avatar>
              
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight">{user.name || "No Name"}</h2>
                    <div className="flex items-center gap-2 text-muted-foreground mt-1">
                      <Mail className="h-3.5 w-3.5" />
                      <span className="text-sm">{user.email}</span>
                      <div 
                        className="cursor-pointer hover:text-foreground transition-colors p-1"
                        onClick={() => handleCopy(user.email, "email")}
                      >
                        {copiedId === "email" ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3 opacity-50" />}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant={user.role === "admin" ? "default" : "secondary"} className="capitalize">
                      {user.role === "admin" && <Shield className="h-3 w-3 mr-1" />}
                      {user.role}
                    </Badge>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground pt-2">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 opacity-70" />
                    <span>Joined {format(new Date(user.createdAt), "MMM d, yyyy")}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 opacity-70" />
                    <span>Last Active: {stats.lastActive ? format(new Date(stats.lastActive), "MMM d, HH:mm") : "Never"}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono text-xs opacity-70">
                    <span>ID: {user._id}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <Button 
            variant="destructive" 
            size="sm"
            onClick={handleDelete}
            disabled={deleteLoading}
            className="shrink-0"
          >
            {deleteLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="mr-2 h-4 w-4" />
            )}
            Delete User
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="glass-card border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Chats</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalChats}</div>
          </CardContent>
        </Card>
        <Card className="glass-card border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
            <div className="h-4 w-4 text-muted-foreground">💬</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMessages}</div>
          </CardContent>
        </Card>
        <Card className="glass-card border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Messages/Chat</CardTitle>
            <div className="h-4 w-4 text-muted-foreground">📊</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalChats > 0 ? (stats.totalMessages / stats.totalChats).toFixed(1) : 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User's Chats */}
      <Card className="glass-card border-border/50 overflow-hidden">
        <CardHeader className="border-b border-border/10 bg-muted/5">
          <CardTitle className="text-lg">Chat History</CardTitle>
          <CardDescription>
            A list of all chat sessions created by this user.
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
                {chats.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                      No chat sessions found for this user.
                    </TableCell>
                  </TableRow>
                ) : (
                  chats.map((chat) => (
                    <TableRow key={chat.sessionId} className="group border-b border-border/10 hover:bg-muted/5 transition-colors">
                      <TableCell className="font-medium">
                        <div className="flex flex-col gap-1">
                          <span className="truncate max-w-[200px] sm:max-w-[300px] font-semibold text-foreground/90">{chat.title}</span>
                          <span className="text-xs text-muted-foreground truncate max-w-[200px] sm:max-w-[300px] font-normal opacity-80">
                            {chat.lastMessage}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-mono bg-background/50">
                          {chat.messageCount}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="mr-2 h-3 w-3 opacity-70" />
                          {format(new Date(chat.updatedAt), "MMM d, HH:mm")}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/admin/chats/${chat.sessionId}`} className="flex items-center cursor-pointer">
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
