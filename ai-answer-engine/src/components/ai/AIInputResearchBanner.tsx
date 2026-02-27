import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface Props {
  isResearchMode: boolean;
}

export function AIInputResearchBanner({ isResearchMode }: Props) {
  return (
    <AnimatePresence>
      {isResearchMode && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="bg-indigo-500/5 border-t border-indigo-500/10 px-4 py-1.5 flex items-center gap-2 overflow-hidden"
        >
          <Sparkles className="h-3 w-3 text-indigo-500" />
          <span className="text-[10px] font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
            Deep Research Enabled
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
