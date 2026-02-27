"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { TrendingUp, MessageSquare, Activity } from "lucide-react";

type Stats = {
  totalChats: number;
  totalMessages: number;
  recentChats: number;
  systemStatus: string;
  version: string;
};

type ActivityItem = {
  id: string;
  title: string;
  updatedAt: string;
  messageCount: number;
  lastMessage: string;
};

export default function DiscoverPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

  useEffect(() => {
    const load = async () => {
      try {
        const [s, a] = await Promise.all([
          fetch(`${apiUrl}/api/admin/stats`),
          fetch(`${apiUrl}/api/admin/activity`),
        ]);
        if (s.ok) setStats(await s.json());
        if (a.ok) setActivity(await a.json());
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="max-w-6xl mx-auto w-full p-4 md:p-8 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Discover</h1>
        <p className="text-muted-foreground">
          Explore trending activity and recent conversations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Total Chats
            </CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">
            {stats ? stats.totalChats : "—"}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Total Messages
            </CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">
            {stats ? stats.totalMessages : "—"}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Last 24h Chats
            </CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">
            {stats ? stats.recentChats : "—"}
          </CardContent>
        </Card>
      </div>

      <Separator />

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Recent Activity</h2>
        </div>

        {loading ? (
          <div className="text-sm text-muted-foreground">Loading…</div>
        ) : activity.length === 0 ? (
          <div className="text-sm text-muted-foreground">No recent activity.</div>
        ) : (
          <div className="space-y-3">
            {activity.map((a) => (
              <Card key={a.id}>
                <CardContent className="p-4 flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="text-sm font-medium">{a.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(a.updatedAt).toLocaleString()} • {a.messageCount} messages
                    </div>
                    <div className="text-sm text-foreground/80">
                      {a.lastMessage}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => (window.location.href = `/chat?session=${a.id}`)}
                  >
                    Open
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

