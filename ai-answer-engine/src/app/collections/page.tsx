"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Plus, Folder, ExternalLink } from "lucide-react";

type Collection = {
  _id: string;
  name: string;
  description?: string;
  items: Array<{
    _id: string;
    sessionId: string;
    messageId?: string;
    role: string;
    content: string;
  }>;
};

export default function CollectionsPage() {
  const { token } = useAuth();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/api/collections`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        const data = await res.json();
        setCollections(data.collections || []);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) load();
  }, [token]);

  const create = async () => {
    if (!name.trim()) return;
    setCreating(true);
    try {
      const res = await fetch(`${apiUrl}/api/collections`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ name: name.trim(), description: desc }),
      });
      if (res.ok) {
        setName("");
        setDesc("");
        await load();
      }
    } finally {
      setCreating(false);
    }
  };

  const remove = async (id: string) => {
    const res = await fetch(`${apiUrl}/api/collections/${id}`, {
      method: "DELETE",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (res.ok) setCollections((prev) => prev.filter((c) => c._id !== id));
  };

  const removeItem = async (colId: string, itemId: string) => {
    const res = await fetch(`${apiUrl}/api/collections/${colId}/items/${itemId}`, {
      method: "DELETE",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (res.ok) load();
  };

  return (
    <div className="max-w-5xl mx-auto w-full p-4 md:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold">Collections</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Folder className="h-5 w-5" />
            New Collection
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="grid gap-2">
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="My Research" />
          </div>
          <div className="grid gap-2 md:col-span-2">
            <Label>Description</Label>
            <Input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Optional" />
          </div>
          <div className="md:col-span-3 flex justify-end">
            <Button onClick={create} disabled={creating || !name.trim()} className="gap-2">
              <Plus className="h-4 w-4" />
              Create
            </Button>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="text-sm text-muted-foreground">Loading…</div>
      ) : collections.length === 0 ? (
        <div className="text-sm text-muted-foreground">No collections yet.</div>
      ) : (
        <div className="space-y-4">
          {collections.map((c) => (
            <Card key={c._id}>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>{c.name}</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => remove(c._id)} title="Delete collection">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                {c.items.length === 0 ? (
                  <div className="text-sm text-muted-foreground">Empty</div>
                ) : (
                  <div className="space-y-3">
                    {c.items.map((it) => (
                      <div key={it._id} className="flex items-start justify-between gap-3 border rounded-lg p-3">
                        <div className="text-sm">
                          <div className="font-medium mb-1">{it.role === "assistant" ? "Answer" : "User"}</div>
                          <div className="text-foreground/90">{it.content.slice(0, 240)}{it.content.length > 240 ? "…" : ""}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Open chat"
                            onClick={() => {
                              window.location.href = `/chat?session=${it.sessionId}`;
                            }}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Remove"
                            onClick={() => removeItem(c._id, it._id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

