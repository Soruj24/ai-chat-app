"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MessageSquare, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Activity {
  id: string;
  title: string;
  updatedAt: string;
  messageCount: number;
  lastMessage: string;
}

interface ActivityTableProps {
  activities: Activity[];
}

export function ActivityTable({ activities }: ActivityTableProps) {
  const router = useRouter();

  return (
    <Card className="glass-card col-span-2 overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary" />
          Recent Activity
        </CardTitle>
        <Button variant="ghost" size="sm" asChild className="h-8 text-xs">
          <Link href="/admin/chats">View All <ArrowRight className="ml-1 h-3 w-3" /></Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="rounded-xl border border-border/40 overflow-hidden bg-background/30 backdrop-blur-sm">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="hover:bg-transparent">
                <TableHead>Chat Title</TableHead>
                <TableHead>Last Message</TableHead>
                <TableHead className="w-[100px]">Messages</TableHead>
                <TableHead className="w-[150px] text-right">Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activities.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                    No recent activity found.
                  </TableCell>
                </TableRow>
              ) : (
                activities.map((activity) => (
                  <TableRow 
                    key={activity.id} 
                    className="hover:bg-muted/30 transition-colors cursor-pointer"
                    onClick={() => router.push(`/admin/chats/${activity.id}`)}
                  >
                    <TableCell className="font-medium">
                      <div className="flex flex-col">
                        <span className="truncate max-w-[200px]">{activity.title}</span>
                        <span className="text-[10px] text-muted-foreground font-mono">{activity.id.substring(0, 8)}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground truncate max-w-[300px]">
                      {activity.lastMessage}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-mono text-xs">
                        <MessageSquare className="mr-1 h-3 w-3" />
                        {activity.messageCount}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right text-xs text-muted-foreground">
                      {new Date(activity.updatedAt).toLocaleDateString()} <br/>
                      {new Date(activity.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
