"use client";

import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  User,
  Search,
  Bookmark,
  Settings,
  LogOut,
  Moon,
  Sun,
  Laptop,
} from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

export function UserDropdown() {
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();
  const initials =
    (user?.name &&
      user.name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((s) => s[0]?.toUpperCase())
        .join("")) ||
    (user?.email ? user.email[0]?.toUpperCase() : "U");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full ring-2 ring-transparent hover:ring-primary/20 transition-all duration-200">
          <Avatar className="h-9 w-9 border border-border/50 shadow-sm">
            <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-medium">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        className="w-64 p-2 rounded-xl border border-border/40 bg-background/80 backdrop-blur-xl shadow-xl shadow-indigo-500/10 animate-in fade-in-0 zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2 duration-200" 
        align="end" 
        forceMount
      >
        <div className="flex flex-col space-y-1 p-2">
          <p className="text-sm font-semibold leading-none text-foreground">{user?.name || "User"}</p>
          <p className="text-xs leading-none text-muted-foreground truncate">
            {user?.email || "—"}
          </p>
        </div>
        
        <DropdownMenuSeparator className="bg-border/40 my-1" />
        
        <div className="space-y-1">
            <DropdownMenuItem className="cursor-pointer rounded-lg focus:bg-primary/10 focus:text-primary transition-colors duration-200 py-2">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
            </DropdownMenuItem>
            
            <Link href="/history" className="block w-full">
                <DropdownMenuItem className="cursor-pointer rounded-lg focus:bg-primary/10 focus:text-primary transition-colors duration-200 py-2">
                    <Search className="mr-2 h-4 w-4" />
                    <span>My Searches</span>
                </DropdownMenuItem>
            </Link>

            <DropdownMenuItem className="cursor-pointer rounded-lg focus:bg-primary/10 focus:text-primary transition-colors duration-200 py-2">
                <Bookmark className="mr-2 h-4 w-4" />
                <span>Bookmarks</span>
            </DropdownMenuItem>
            
            <Link href="/settings" className="block w-full">
                <DropdownMenuItem className="cursor-pointer rounded-lg focus:bg-primary/10 focus:text-primary transition-colors duration-200 py-2">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                </DropdownMenuItem>
            </Link>
        </div>

        <DropdownMenuSeparator className="bg-border/40 my-1" />

        <div className="p-2">
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-2 px-2">Theme</p>
            <div className="grid grid-cols-3 gap-1 bg-muted/30 p-1 rounded-lg">
                <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setTheme("light")}
                    className={cn(
                        "h-7 rounded-md px-0 hover:bg-background transition-all",
                        theme === "light" && "bg-background text-primary shadow-sm ring-1 ring-border/50"
                    )}
                >
                    <Sun className="h-3.5 w-3.5" />
                </Button>
                <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setTheme("dark")}
                    className={cn(
                        "h-7 rounded-md px-0 hover:bg-background transition-all",
                        theme === "dark" && "bg-background text-primary shadow-sm ring-1 ring-border/50"
                    )}
                >
                    <Moon className="h-3.5 w-3.5" />
                </Button>
                <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setTheme("system")}
                    className={cn(
                        "h-7 rounded-md px-0 hover:bg-background transition-all",
                        theme === "system" && "bg-background text-primary shadow-sm ring-1 ring-border/50"
                    )}
                >
                    <Laptop className="h-3.5 w-3.5" />
                </Button>
            </div>
        </div>

        <DropdownMenuSeparator className="bg-border/40 my-1" />

        <DropdownMenuItem onClick={logout} className="cursor-pointer rounded-lg text-red-500 focus:bg-red-500/10 focus:text-red-600 transition-colors duration-200 py-2">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
