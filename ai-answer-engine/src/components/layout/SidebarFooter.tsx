"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { User, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";

interface SidebarFooterProps {
  isOpen: boolean;
  isMobile: boolean;
}

export function SidebarFooter({ isOpen, isMobile }: SidebarFooterProps) {
  const { user, logout } = useAuth();
  const expanded = isOpen || isMobile;

  return (
    <div className="p-4 border-t border-border/50 space-y-2">
      <div className="pt-2 mt-auto">
        <Link href="/admin" className={cn("block w-full mb-1", !isOpen && "flex justify-center")}>
          <Button variant="ghost" className={cn("w-full justify-start px-2", !isOpen && "justify-center h-10 w-10 p-0")}>
            <div className="h-8 w-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-500 shrink-0"><ShieldCheck className="h-4 w-4" /></div>
            {expanded && <span className="font-medium truncate ml-3">Admin Panel</span>}
          </Button>
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className={cn("w-full justify-start px-2", !isOpen && "justify-center h-10 w-10 p-0")}>
              <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center shrink-0"><User className="h-4 w-4" /></div>
              {expanded && (
                <div className="flex flex-col items-start text-sm overflow-hidden ml-3">
                  <span className="font-medium truncate">{user ? (user.name || user.email) : "Guest"}</span>
                  <span className="text-xs text-muted-foreground truncate">{user ? "Free Plan" : "Not logged in"}</span>
                </div>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56" side="right" sideOffset={10}>
            {user ? (
              <>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    {user.name && <p className="font-medium">{user.name}</p>}
                    <p className="w-[200px] truncate text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <DropdownMenuItem className="text-red-600 cursor-pointer" onClick={logout}>Log out</DropdownMenuItem>
              </>
            ) : (
              <>
                <DropdownMenuItem asChild><Link href="/login" className="cursor-pointer">Log in</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link href="/register" className="cursor-pointer">Sign up</Link></DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
