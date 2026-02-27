 "use client";
 
 import React from "react";
 import { Image as ImageIcon } from "lucide-react";
 
 interface MessageImagesProps {
   images: string[];
 }
 
 export function MessageImages({ images }: MessageImagesProps) {
   if (!images || images.length === 0) return null;
 
   return (
     <div className="mb-6 -mx-4 px-4 md:mx-0 md:px-0">
       <div className="flex items-center gap-2 mb-3 text-sm font-medium text-muted-foreground">
         <ImageIcon className="h-4 w-4" />
         <span>Images</span>
         <span className="bg-secondary text-secondary-foreground text-[10px] rounded-full px-2 py-0.5 font-medium">
           {images.length}
         </span>
       </div>
       <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent snap-x">
         {images.map((img, idx) => (
           <div
             key={idx}
             className="snap-start flex-shrink-0 w-40 h-28 md:w-48 md:h-32 rounded-xl border border-border/50 overflow-hidden bg-muted/30 relative group cursor-pointer"
             onClick={() => window.open(img, "_blank")}
          >
             <img
               src={img}
               alt={`Image ${idx + 1}`}
               className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
               loading="lazy"
               onError={(e) => (e.currentTarget.style.display = "none")}
             />
           </div>
         ))}
       </div>
     </div>
   );
 }
 
