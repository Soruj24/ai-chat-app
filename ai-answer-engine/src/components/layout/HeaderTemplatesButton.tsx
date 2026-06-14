"use client";

import React, { useState, useCallback } from "react";
import { useTemplates, TemplateDialog } from "@/hooks/usePromptTemplates";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

interface HeaderTemplatesButtonProps {
  onApplyTemplate?: (query: string) => void;
}

export function HeaderTemplatesButton({ onApplyTemplate }: HeaderTemplatesButtonProps) {
  const [showDialog, setShowDialog] = useState(false);

  const handleApply = useCallback((query: string) => {
    if (onApplyTemplate) {
      onApplyTemplate(query);
    }
    setShowDialog(false);
  }, [onApplyTemplate]);

  return (
    <>
      <TemplateDialog onApply={handleApply} />
    </>
  );
}
