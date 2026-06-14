"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Sun, Moon, Laptop } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="p-2">
      <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-2 px-2">Appearance</p>
      <div className="grid grid-cols-3 gap-1 bg-muted/30 p-1 rounded-lg">
        <Button variant="ghost" size="sm" onClick={() => setTheme("light")}
          className={cn("h-7 rounded-md px-0 hover:bg-background transition-all", theme === "light" && "bg-background text-primary shadow-sm ring-1 ring-border/50")}>
          <Sun className="h-3.5 w-3.5" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setTheme("dark")}
          className={cn("h-7 rounded-md px-0 hover:bg-background transition-all", theme === "dark" && "bg-background text-primary shadow-sm ring-1 ring-border/50")}>
          <Moon className="h-3.5 w-3.5" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setTheme("system")}
          className={cn("h-7 rounded-md px-0 hover:bg-background transition-all", theme === "system" && "bg-background text-primary shadow-sm ring-1 ring-border/50")}>
          <Laptop className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
