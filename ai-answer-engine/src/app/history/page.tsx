"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Bookmark, Clock, MoreHorizontal, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface HistoryItem {
  id: string;
  query: string;
  preview: string;
  timestamp: string;
  dateCategory: "Today" | "Yesterday" | "Last Week" | "Older";
  isBookmarked: boolean;
}

const MOCK_HISTORY: HistoryItem[] = [
  {
    id: "1",
    query: "Quantum Computing Explained",
    preview: "Quantum computing uses the principles of quantum mechanics to solve complex problems...",
    timestamp: "2 hours ago",
    dateCategory: "Today",
    isBookmarked: true,
  },
  {
    id: "2",
    query: "React vs Vue Performance",
    preview: "React generally uses a virtual DOM, while Vue uses a similar approach but with...",
    timestamp: "5 hours ago",
    dateCategory: "Today",
    isBookmarked: false,
  },
  {
    id: "3",
    query: "Next.js 14 Server Actions",
    preview: "Server Actions allow you to run asynchronous code directly on the server...",
    timestamp: "Yesterday",
    dateCategory: "Yesterday",
    isBookmarked: false,
  },
  {
    id: "4",
    query: "Python AsyncIO Tutorial",
    preview: "AsyncIO is a library to write concurrent code using the async/await syntax...",
    timestamp: "Yesterday",
    dateCategory: "Yesterday",
    isBookmarked: true,
  },
  {
    id: "5",
    query: "Machine Learning Basics",
    preview: "Machine learning is a subset of AI that focuses on building systems that learn...",
    timestamp: "3 days ago",
    dateCategory: "Last Week",
    isBookmarked: false,
  },
  {
    id: "6",
    query: "Docker vs Kubernetes",
    preview: "Docker is a containerization platform, while Kubernetes is an orchestration tool...",
    timestamp: "5 days ago",
    dateCategory: "Last Week",
    isBookmarked: false,
  },
];

export default function HistoryPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("All");

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const filters = ["All", "Today", "Yesterday", "Last Week", "Bookmarked"];

  const filteredHistory = MOCK_HISTORY.filter((item) => {
    const matchesSearch = item.query.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.preview.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;

    if (activeFilter === "All") return true;
    if (activeFilter === "Bookmarked") return item.isBookmarked;
    return item.dateCategory === activeFilter;
  });

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground font-sans selection:bg-primary/20">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className="flex-1 flex flex-col relative min-w-0 overflow-hidden">
        <Header toggleSidebar={toggleSidebar} />
        
        <main className="flex-1 flex flex-col relative overflow-hidden p-4 md:p-8">
            <div className="max-w-5xl mx-auto w-full h-full flex flex-col gap-6">
                
                {/* Page Header */}
                <div className="flex flex-col gap-4">
                    <h1 className="text-2xl font-bold">Search History</h1>
                    
                    {/* Search Input */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                            placeholder="Search your history..." 
                            className="pl-10 bg-card/50 backdrop-blur-sm border-border/50"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex-1 flex gap-8 min-h-0">
                    {/* Left Sidebar Filters */}
                    <div className="w-48 hidden md:flex flex-col gap-2 pt-2">
                        {filters.map((filter) => (
                            <Button
                                key={filter}
                                variant={activeFilter === filter ? "secondary" : "ghost"}
                                className={cn(
                                    "justify-start",
                                    activeFilter === filter && "bg-secondary/50 font-medium"
                                )}
                                onClick={() => setActiveFilter(filter)}
                            >
                                {filter === "Bookmarked" ? (
                                    <Bookmark className="h-4 w-4 mr-2" />
                                ) : (
                                    <Calendar className="h-4 w-4 mr-2" />
                                )}
                                {filter}
                            </Button>
                        ))}
                    </div>

                    {/* History List */}
                    <ScrollArea className="flex-1 h-full pr-4">
                        <div className="space-y-4 pb-10">
                            {filteredHistory.length > 0 ? (
                                filteredHistory.map((item, index) => (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="group relative p-4 rounded-xl border border-border/40 bg-card/30 hover:bg-card/60 hover:border-primary/20 hover:shadow-sm transition-all duration-200 cursor-pointer"
                                    >
                                        <div className="flex justify-between items-start gap-4">
                                            <div className="flex-1 space-y-1.5">
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                                                        {item.query}
                                                    </h3>
                                                    {item.isBookmarked && (
                                                        <Bookmark className="h-3 w-3 text-indigo-500 fill-indigo-500" />
                                                    )}
                                                </div>
                                                <p className="text-sm text-muted-foreground line-clamp-2">
                                                    {item.preview}
                                                </p>
                                                <div className="flex items-center gap-3 pt-1">
                                                    <span className="flex items-center text-xs text-muted-foreground/70">
                                                        <Clock className="h-3 w-3 mr-1" />
                                                        {item.timestamp}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground/50">•</span>
                                                    <span className="text-xs text-muted-foreground/70">
                                                        {item.dateCategory}
                                                    </span>
                                                </div>
                                            </div>
                                            
                                            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="text-center py-20 text-muted-foreground">
                                    <p>No history found.</p>
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                </div>
            </div>
        </main>
      </div>
    </div>
  );
}
