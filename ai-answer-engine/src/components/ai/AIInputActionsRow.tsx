 "use client";
 
 import React from "react";
 import { Button } from "@/components/ui/button";
 import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
 import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuLabel,
   DropdownMenuRadioGroup,
   DropdownMenuRadioItem,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
 } from "@/components/ui/dropdown-menu";
 import { cn } from "@/lib/utils";
 import {
   ArrowRight,
   Brain,
   ChevronDown,
   Cloud,
   Globe,
   GraduationCap,
   Link as LinkIcon,
   Lock,
   MessageSquare,
   Mic,
   Paperclip,
   PenTool,
   Sparkles,
   Video,
   MoreHorizontal,
   Plus,
 } from "lucide-react";
 
 interface ActionsRowProps {
   focusMode: string;
   onFocusModeChange: (value: string) => void;
   isResearchMode: boolean;
   onToggleResearchMode: () => void;
   selectedTone: string;
   onToneChange: (value: string) => void;
   selectedModel: string;
   onModelChange?: (value: string) => void;
   isListening: boolean;
   onToggleListening: () => void;
   isUploading: boolean;
   onUploadClick: () => void;
   onCloudImport: () => void;
   onConnectors: () => void;
   onMore: () => void;
   canSubmit: boolean;
   isGenerating: boolean;
   onSubmit: () => void;
 }
 
 export function AIInputActionsRow({
   focusMode,
   onFocusModeChange,
   isResearchMode,
   onToggleResearchMode,
   selectedTone,
   onToneChange,
   selectedModel,
   onModelChange,
   isListening,
   onToggleListening,
   isUploading,
   onUploadClick,
   onCloudImport,
   onConnectors,
   onMore,
   canSubmit,
   isGenerating,
   onSubmit,
 }: ActionsRowProps) {
   return (
     <div className="flex items-center justify-between px-2 pb-2">
       <div className="flex items-center gap-1">
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
             <button
               className="w-full flex items-center justify-between px-2 py-2 text-sm hover:bg-muted/50 rounded-md transition-colors"
               onClick={onUploadClick}
             >
               <span className="flex items-center gap-2">
                 <Paperclip className="h-4 w-4" />
                 Upload files or images
               </span>
             </button>
             <button
               className="w-full flex items-center justify-between px-2 py-2 text-sm hover:bg-muted/50 rounded-md transition-colors"
               onClick={onCloudImport}
             >
               <span className="flex items-center gap-2">
                 <Cloud className="h-4 w-4" />
                 Add files from cloud
               </span>
               <Lock className="h-3.5 w-3.5 opacity-60" />
             </button>
             <button
               className="w-full flex items-center justify-between px-2 py-2 text-sm hover:bg-muted/50 rounded-md transition-colors"
               onClick={onConnectors}
             >
               <span className="flex items-center gap-2">
                 <LinkIcon className="h-4 w-4" />
                 Connectors and sources
               </span>
             </button>
             <button
               className="w-full flex items-center justify-between px-2 py-2 text-sm hover:bg-muted/50 rounded-md transition-colors"
               onClick={onToggleResearchMode}
             >
               <span className="flex items-center gap-2">
                 <Brain className="h-4 w-4" />
                 Deep research
               </span>
             </button>
             <button
               className="w-full flex items-center justify-between px-2 py-2 text-sm hover:bg-muted/50 rounded-md transition-colors"
               onClick={onMore}
             >
               <span className="flex items-center gap-2">
                 <MoreHorizontal className="h-4 w-4" />
                 More
               </span>
             </button>
           </DropdownMenuContent>
         </DropdownMenu>
 
         <TooltipProvider>
           <Tooltip>
             <TooltipTrigger asChild>
               <Button
                 variant="ghost"
                 size="icon"
                 className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full transition-colors shrink-0"
                 aria-label="Attach file"
                 onClick={onUploadClick}
                 disabled={isUploading}
               >
                 {isUploading ? <span className="animate-spin text-xs">⌛</span> : <Paperclip className="h-4 w-4" />}
               </Button>
             </TooltipTrigger>
             <TooltipContent>Attach file (PDF, TXT, MD, JSON)</TooltipContent>
           </Tooltip>
         </TooltipProvider>
 
         <DropdownMenu>
           <DropdownMenuTrigger asChild>
             <Button
               variant="ghost"
               size="sm"
               className="h-8 gap-1.5 px-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full transition-colors"
             >
               {focusMode === "web" && <Globe className="h-4 w-4" />}
               {focusMode === "academic" && <GraduationCap className="h-4 w-4" />}
               {focusMode === "writing" && <PenTool className="h-4 w-4" />}
               {focusMode === "youtube" && <Video className="h-4 w-4" />}
               {focusMode === "reddit" && <MessageSquare className="h-4 w-4" />}
               <span className="text-xs font-medium hidden sm:inline-block">
                 {focusMode === "web" ? "Focus" : focusMode === "reddit" ? "Social" : focusMode.charAt(0).toUpperCase() + focusMode.slice(1)}
               </span>
               <ChevronDown className="h-3 w-3 opacity-50" />
             </Button>
           </DropdownMenuTrigger>
           <DropdownMenuContent align="start" className="w-[180px]">
             <DropdownMenuLabel>Focus</DropdownMenuLabel>
             <DropdownMenuSeparator />
             <DropdownMenuRadioGroup value={focusMode} onValueChange={onFocusModeChange}>
               <DropdownMenuRadioItem value="web">
                 <Globe className="h-4 w-4 mr-2" /> All
               </DropdownMenuRadioItem>
               <DropdownMenuRadioItem value="academic">
                 <GraduationCap className="h-4 w-4 mr-2" /> Academic
               </DropdownMenuRadioItem>
               <DropdownMenuRadioItem value="writing">
                 <PenTool className="h-4 w-4 mr-2" /> Writing
               </DropdownMenuRadioItem>
               <DropdownMenuRadioItem value="youtube">
                 <Video className="h-4 w-4 mr-2" /> YouTube
               </DropdownMenuRadioItem>
               <DropdownMenuRadioItem value="reddit">
                 <MessageSquare className="h-4 w-4 mr-2" /> Social
               </DropdownMenuRadioItem>
             </DropdownMenuRadioGroup>
           </DropdownMenuContent>
         </DropdownMenu>
 
         <TooltipProvider>
           <Tooltip>
             <TooltipTrigger asChild>
               <Button
                 variant="ghost"
                 size="sm"
                 onClick={onToggleResearchMode}
                 className={cn(
                   "h-8 gap-1.5 px-2 rounded-full transition-all duration-300 border",
                   isResearchMode ? "text-indigo-600 bg-indigo-500/10 hover:bg-indigo-500/20 border-indigo-500/20 shadow-sm" : "text-muted-foreground hover:text-primary hover:bg-primary/10 border-transparent",
                 )}
                 aria-label="Toggle Research Mode"
                 aria-pressed={isResearchMode}
               >
                 <Brain className={cn("h-4 w-4", isResearchMode && "text-indigo-600 animate-pulse")} />
                 <span className={cn("text-xs font-medium hidden sm:inline-block transition-colors", isResearchMode && "text-indigo-600")}>
                   Deep Research
                 </span>
               </Button>
             </TooltipTrigger>
             <TooltipContent>{isResearchMode ? "Deep Research Mode On" : "Enable Deep Research"}</TooltipContent>
           </Tooltip>
         </TooltipProvider>
       </div>
 
       <div className="flex items-center gap-1">
         <DropdownMenu>
           <DropdownMenuTrigger asChild>
             <Button
               variant="ghost"
               size="sm"
               className="h-8 gap-1.5 px-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full transition-colors hidden md:flex"
             >
               <span className="text-xs font-medium max-w-[80px] truncate">{selectedTone}</span>
               <ChevronDown className="h-3 w-3 opacity-50" />
             </Button>
           </DropdownMenuTrigger>
           <DropdownMenuContent align="end" className="w-[150px]">
             <DropdownMenuLabel>Select Tone</DropdownMenuLabel>
             <DropdownMenuSeparator />
             <DropdownMenuRadioGroup value={selectedTone} onValueChange={onToneChange}>
               <DropdownMenuRadioItem value="Neutral">Neutral</DropdownMenuRadioItem>
               <DropdownMenuRadioItem value="Professional">Professional</DropdownMenuRadioItem>
               <DropdownMenuRadioItem value="Creative">Creative</DropdownMenuRadioItem>
               <DropdownMenuRadioItem value="Academic">Academic</DropdownMenuRadioItem>
               <DropdownMenuRadioItem value="Simplified">Simplified</DropdownMenuRadioItem>
               <DropdownMenuRadioItem value="Concise">Concise</DropdownMenuRadioItem>
             </DropdownMenuRadioGroup>
           </DropdownMenuContent>
         </DropdownMenu>
 
         <DropdownMenu>
           <DropdownMenuTrigger asChild>
             <Button
               variant="ghost"
               size="sm"
               className="h-8 gap-1.5 px-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full transition-colors hidden md:flex"
             >
               <span className="text-xs font-medium max-w-[80px] truncate">
                 {selectedModel === "llama3.2" ? "Llama 3.2" : selectedModel.split("/").pop()?.split("-")[0] || selectedModel}
               </span>
               <ChevronDown className="h-3 w-3 opacity-50" />
             </Button>
           </DropdownMenuTrigger>
           <DropdownMenuContent align="end" className="w-[200px]">
             <DropdownMenuLabel>Select Model</DropdownMenuLabel>
             <DropdownMenuSeparator />
             <DropdownMenuRadioGroup value={selectedModel} onValueChange={onModelChange}>
               <DropdownMenuRadioItem value="llama3.2">
                 <span className="flex items-center gap-2">
                   <span className="h-2 w-2 rounded-full bg-blue-500" />
                   Llama 3.2
                 </span>
               </DropdownMenuRadioItem>
               <DropdownMenuRadioItem value="deepseek-r1:1.5b">
                 <span className="flex items-center gap-2">
                   <span className="h-2 w-2 rounded-full bg-purple-500" />
                   DeepSeek R1 (1.5B)
                 </span>
               </DropdownMenuRadioItem>
               <DropdownMenuRadioItem value="groq/llama-3.1-8b-instant">
                 <span className="flex items-center gap-2">
                   <span className="h-2 w-2 rounded-full bg-orange-500" />
                   Groq Llama 3.1 8B
                 </span>
               </DropdownMenuRadioItem>
               <DropdownMenuRadioItem value="groq/llama-3.3-70b-versatile">
                 <span className="flex items-center gap-2">
                   <span className="h-2 w-2 rounded-full bg-orange-500" />
                   Groq Llama 3.3 70B
                 </span>
               </DropdownMenuRadioItem>
               <DropdownMenuRadioItem value="gemini/gemini-1.5-flash">
                 <span className="flex items-center gap-2">
                   <span className="h-2 w-2 rounded-full bg-green-500" />
                   Gemini 1.5 Flash
                 </span>
               </DropdownMenuRadioItem>
               <DropdownMenuRadioItem value="gemini/gemini-1.5-pro">
                 <span className="flex items-center gap-2">
                   <span className="h-2 w-2 rounded-full bg-green-500" />
                   Gemini 1.5 Pro
                 </span>
               </DropdownMenuRadioItem>
             </DropdownMenuRadioGroup>
           </DropdownMenuContent>
         </DropdownMenu>
 
         <TooltipProvider>
           <Tooltip>
             <TooltipTrigger asChild>
               <Button
                 variant="ghost"
                 size="icon"
                 onClick={onToggleListening}
                 className={cn(
                   "h-8 w-8 rounded-full transition-all duration-300",
                   isListening ? "text-red-500 bg-red-500/10 hover:bg-red-500/20 animate-pulse" : "text-muted-foreground hover:text-primary hover:bg-primary/10",
                 )}
                 aria-label="Voice Input"
               >
                 <Mic className={cn("h-4 w-4", isListening && "fill-current")} />
               </Button>
             </TooltipTrigger>
             <TooltipContent>{isListening ? "Listening..." : "Voice Input"}</TooltipContent>
           </Tooltip>
         </TooltipProvider>
 
         <Button
           onClick={onSubmit}
           disabled={!canSubmit || isGenerating}
           size="icon"
           className={cn(
             "h-8 w-8 rounded-full transition-all duration-300 shadow-sm ml-1",
             canSubmit && !isGenerating ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 active:scale-95" : "bg-muted text-muted-foreground cursor-not-allowed opacity-50",
           )}
           aria-label="Send message"
         >
           {isGenerating ? <Sparkles className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
         </Button>
       </div>
     </div>
   );
 }
 
