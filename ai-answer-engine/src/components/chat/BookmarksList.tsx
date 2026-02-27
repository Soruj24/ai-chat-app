import React, { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Bookmark, Trash2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Message } from "@/types";
import ReactMarkdown from "react-markdown";

export function BookmarksList() {
  const [bookmarks, setBookmarks] = useState<Message[]>([]);

  useEffect(() => {
    const loadBookmarks = () => {
      try {
        const savedStr = localStorage.getItem("starred_messages");
        if (savedStr) {
          setBookmarks(JSON.parse(savedStr));
        }
      } catch (e) {
        console.error("Failed to load bookmarks", e);
      }
    };

    loadBookmarks();
    // Listen for storage events to update in real-time if changed in another tab/component
    window.addEventListener("storage", loadBookmarks);
    // Custom event for same-tab updates
    window.addEventListener("bookmarks-updated", loadBookmarks);

    return () => {
      window.removeEventListener("storage", loadBookmarks);
      window.removeEventListener("bookmarks-updated", loadBookmarks);
    };
  }, []);

  const removeBookmark = (id: string) => {
    const updated = bookmarks.filter(b => b.id !== id);
    setBookmarks(updated);
    localStorage.setItem("starred_messages", JSON.stringify(updated));
    window.dispatchEvent(new Event("bookmarks-updated"));
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground relative" title="Saved Bookmarks">
          <Bookmark className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Saved Bookmarks</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-100px)] mt-4 pr-4">
          {bookmarks.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
              <Bookmark className="h-8 w-8 mb-2 opacity-20" />
              <p>No bookmarks yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {bookmarks.map((msg) => (
                <div key={msg.id} className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm relative group">
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-destructive" onClick={() => removeBookmark(msg.id || "")}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">
                    {msg.role === "user" ? "You" : "AI Assistant"}
                  </div>
                  <div className="text-sm prose prose-invert max-w-none line-clamp-4">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
