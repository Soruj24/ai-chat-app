import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  Paperclip,
  Cloud,
  Link as LinkIcon,
  Lock,
  Brain,
  MoreHorizontal,
} from "lucide-react";

interface Props {
  onUploadClick: () => void;
  onCloudImport: () => void;
  onConnectors: () => void;
  onToggleResearchMode: () => void;
  onMore: () => void;
}

function MenuItem({
  icon,
  label,
  onClick,
  trailing,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  trailing?: React.ReactNode;
}) {
  return (
    <button
      className="w-full flex items-center justify-between px-2 py-2 text-sm hover:bg-muted/50 rounded-md transition-colors"
      onClick={onClick}
    >
      <span className="flex items-center gap-2">
        {icon}
        {label}
      </span>
      {trailing}
    </button>
  );
}

export function ActionsMenu({
  onUploadClick,
  onCloudImport,
  onConnectors,
  onToggleResearchMode,
  onMore,
}: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full transition-colors shrink-0"
          aria-label="More actions"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <MenuItem
          icon={<Paperclip className="h-4 w-4" />}
          label="Upload files or images"
          onClick={onUploadClick}
        />
        <MenuItem
          icon={<Cloud className="h-4 w-4" />}
          label="Add files from cloud"
          onClick={onCloudImport}
          trailing={<Lock className="h-3.5 w-3.5 opacity-60" />}
        />
        <MenuItem
          icon={<LinkIcon className="h-4 w-4" />}
          label="Connectors and sources"
          onClick={onConnectors}
        />
        <MenuItem
          icon={<Brain className="h-4 w-4" />}
          label="Deep research"
          onClick={onToggleResearchMode}
        />
        <MenuItem
          icon={<MoreHorizontal className="h-4 w-4" />}
          label="More"
          onClick={onMore}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
