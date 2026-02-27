import React from "react";

export function AIInputKeyboardHint() {
  return (
    <div className="flex items-center justify-end px-4 pb-2">
      <span className="text-[10px] md:text-xs text-muted-foreground">
        Enter to send • Shift+Enter for newline
      </span>
    </div>
  );
}
