"use client";

import React from "react";
import {
  Task,
  TaskTrigger,
  TaskContent,
  TaskItem,
  TaskItemFile,
} from "@/components/ai-elements/task";
import { Check, Loader2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

interface TaskStep {
  id: string;
  title: string;
  status: "pending" | "in_progress" | "completed";
  details?: string[];
}

interface TaskDisplayProps {
  steps: TaskStep[];
  title?: string;
  defaultOpen?: boolean;
  className?: string;
}

function getStatusIcon(status: TaskStep["status"]) {
  switch (status) {
    case "completed":
      return <Check className="h-3.5 w-3.5 text-green-500" />;
    case "in_progress":
      return <Loader2 className="h-3.5 w-3.5 text-blue-500 animate-spin" />;
    default:
      return <Circle className="h-3.5 w-3.5 text-muted-foreground" />;
  }
}

export function TaskDisplay({
  steps,
  title = "Tasks",
  defaultOpen = true,
  className,
}: TaskDisplayProps) {
  if (steps.length === 0) return null;

  const completedCount = steps.filter((s) => s.status === "completed").length;
  const totalCount = steps.length;

  return (
    <Task defaultOpen={defaultOpen} className={className}>
      <TaskTrigger title={`${title} (${completedCount}/${totalCount})`} />
      <TaskContent>
        {steps.map((step) => (
          <TaskItem key={step.id}>
            <div className="flex items-start gap-2">
              {getStatusIcon(step.status)}
              <div className="flex-1">
                <span
                  className={cn(
                    "text-sm",
                    step.status === "completed" && "line-through text-muted-foreground",
                    step.status === "in_progress" && "font-medium"
                  )}
                >
                  {step.title}
                </span>
                {step.details && step.details.length > 0 && (
                  <div className="mt-1 space-y-1">
                    {step.details.map((detail, i) => (
                      <div key={i} className="text-xs text-muted-foreground">
                        {detail}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </TaskItem>
        ))}
      </TaskContent>
    </Task>
  );
}
