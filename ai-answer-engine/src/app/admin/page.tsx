"use client";

import React, { useEffect, useState } from "react";
import { MessageSquare, Users, Activity, HardDrive, AlertCircle } from "lucide-react";
import { StatsCard } from "@/components/admin/StatsCard";
import { ActivityTable } from "@/components/admin/ActivityTable";
import { AdminOverviewChart } from "@/components/admin/AdminOverviewChart";

interface Stats {
  totalChats: number;
  totalMessages: number;
  recentChats: number;
  systemStatus: string;
}

interface ActivityItem {
  id: string;
  title: string;
  updatedAt: string;
  messageCount: number;
  lastMessage: string;
}

interface DailyStats {
  _id: string;
  count: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, activityRes, dailyRes] = await Promise.all([
          fetch("http://localhost:3001/api/admin/stats"),
          fetch("http://localhost:3001/api/admin/activity"),
          fetch("http://localhost:3001/api/admin/daily-stats")
        ]);

        if (!statsRes.ok || !activityRes.ok || !dailyRes.ok) {
          throw new Error("Failed to fetch dashboard data");
        }

        const statsData = await statsRes.json();
        const activityData = await activityRes.json();
        const dailyData = await dailyRes.json();

        setStats(statsData);
        setActivities(activityData);
        setDailyStats(dailyData);
      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard data. Please ensure the backend is running.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center text-destructive">
        <AlertCircle className="mr-2 h-6 w-6" />
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Dashboard Overview
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Chats"
          value={stats?.totalChats || 0}
          icon={MessageSquare}
          description="All time conversations"
          href="/admin/chats"
        />
        <StatsCard
          title="Total Messages"
          value={stats?.totalMessages || 0}
          icon={Activity}
          description="Across all chats"
          href="/admin/chats"
        />
        <StatsCard
          title="Recent Chats (24h)"
          value={stats?.recentChats || 0}
          icon={Users}
          description="Active in last 24h"
          href="/admin/chats"
        />
        <StatsCard
          title="System Status"
          value={stats?.systemStatus || "Unknown"}
          icon={HardDrive}
          description="Backend Health"
          className="border-green-500/20 bg-green-500/5"
          href="/admin/settings"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4">
          <AdminOverviewChart data={dailyStats} />
        </div>
        <div className="col-span-3">
            <ActivityTable activities={activities} />
        </div>
      </div>
    </div>
  );
}
