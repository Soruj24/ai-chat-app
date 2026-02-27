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
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { 
  User, 
  Settings, 
  LogOut, 
  Sparkles,
  CreditCard,
  Laptop,
  Moon,
  Sun
} from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils"; 

export interface ProfileDropdownProps {
  user?: {
    name: string;
    email: string;
    image?: string;
    plan?: "free" | "pro" | "enterprise";
  };
  onLogout?: () => void;
  className?: string;
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
}

export function ProfileDropdown({
  user = {
    name: "User",
    email: "",
    plan: "free"
  },
  onLogout,
  className,
  side = "top",
  align = "end"
}: ProfileDropdownProps) {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className={cn(
            "relative h-10 w-10 rounded-full ring-2 ring-transparent hover:ring-primary/20 transition-all duration-200 p-0",
            className
          )}
        >
          <Avatar className="h-10 w-10 border border-border/50 shadow-sm transition-transform hover:scale-105">
            <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-medium">
              {user.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          {user.plan === "pro" && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-sky-500 ring-2 ring-background">
              <Sparkles className="h-2.5 w-2.5 text-white" />
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        className="w-64 p-2 rounded-xl border border-border/40 bg-background/80 backdrop-blur-xl shadow-xl shadow-indigo-500/10 animate-in fade-in-0 zoom-in-95 duration-200" 
        side={side}
        align={align}
        forceMount
      >
        <div className="flex flex-col space-y-1 p-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold leading-none text-foreground">{user.name}</p>
            {user.plan && (
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-1.5 py-0.5 rounded border border-primary/20">
                {user.plan}
              </span>
            )}
          </div>
          <p className="text-xs leading-none text-muted-foreground truncate">
            {user.email}
          </p>
        </div>
        
        <DropdownMenuSeparator className="bg-border/40 my-1" />
        
        <DropdownMenuGroup>
          <DropdownMenuItem className="cursor-pointer rounded-lg focus:bg-primary/10 focus:text-primary transition-colors duration-200 py-2">
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem className="cursor-pointer rounded-lg focus:bg-primary/10 focus:text-primary transition-colors duration-200 py-2">
            <CreditCard className="mr-2 h-4 w-4" />
            <span>Billing</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem className="cursor-pointer rounded-lg focus:bg-primary/10 focus:text-primary transition-colors duration-200 py-2">
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="bg-border/40 my-1" />

        <div className="p-2">
          <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-2 px-2">Appearance</p>
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

        <DropdownMenuItem 
          className="cursor-pointer rounded-lg text-red-500 focus:bg-red-500/10 focus:text-red-600 transition-colors duration-200 py-2"
          onClick={onLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
