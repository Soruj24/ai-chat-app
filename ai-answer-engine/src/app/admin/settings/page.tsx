"use client";

import React, { useEffect, useState } from "react";
import { Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { showToast } from "@/lib/swal";

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(false);
  const [ , setSuccess] = useState(false);

  const [, setActiveTab] = useState("general");

  type Settings = {
    siteName: string;
    supportEmail: string;
    defaultModel: string;
    groqApiKey: string;
    openaiApiKey: string;
    anthropicApiKey: string;
    temperature: number;
    maxTokens: number;
    systemPrompt: string;
    allowRegistration: boolean;
    requireEmailVerification: boolean;
    maintenanceMode: boolean;
  };

  const [settings, setSettings] = useState<Settings>({
    siteName: "",
    supportEmail: "",
    defaultModel: "",
    groqApiKey: "",
    openaiApiKey: "",
    anthropicApiKey: "",
    temperature: 0.7,
    maxTokens: 4096,
    systemPrompt: "",
    allowRegistration: true,
    requireEmailVerification: false,
    maintenanceMode: false,
  });

  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/admin/settings");
        if (!res.ok) throw new Error("Failed to load settings");
        const data = await res.json();
        setSettings({
          siteName: data.siteName ?? "",
          supportEmail: data.supportEmail ?? "",
          defaultModel: data.defaultModel ?? "llama-3.2-11b-vision-preview",
          groqApiKey: data.groqApiKey ?? "",
          openaiApiKey: data.openaiApiKey ?? "",
          anthropicApiKey: data.anthropicApiKey ?? "",
          temperature: typeof data.temperature === "number" ? data.temperature : 0.7,
          maxTokens: typeof data.maxTokens === "number" ? data.maxTokens : 4096,
          systemPrompt:
            data.systemPrompt ??
            "You are a helpful AI assistant. You answer questions accurately and concisely.",
          allowRegistration:
            typeof data.allowRegistration === "boolean" ? data.allowRegistration : true,
          requireEmailVerification:
            typeof data.requireEmailVerification === "boolean"
              ? data.requireEmailVerification
              : false,
          maintenanceMode:
            typeof data.maintenanceMode === "boolean" ? data.maintenanceMode : false,
        });
      } catch {
        showToast("Failed to load settings");
      } finally {
        setInitializing(false);
      }
    };
    loadSettings();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    setSuccess(false);

    try {
      const res = await fetch("http://localhost:3001/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (!res.ok) throw new Error("Failed to save settings");
      setSuccess(true);
      showToast("Settings saved successfully");
    } catch {
      showToast("Failed to save settings");
    }

    setLoading(false);

    setTimeout(() => setSuccess(false), 3000);
  };

  const handleChange = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Settings
          </h2>
          <p className="text-muted-foreground">
            Manage your AI engine configuration
          </p>
        </div>
        <Button
          onClick={handleSave}
          disabled={loading || initializing}
          className="gap-2 shadow-lg shadow-primary/20"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Save Changes
        </Button>
      </div>

      <Tabs
        defaultValue="general"
        className="space-y-4"
        onValueChange={setActiveTab}
      >
        <TabsList className="grid w-full grid-cols-3 sm:max-w-[420px]">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="ai">AI Models</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>General Configuration</CardTitle>
              <CardDescription>
                Basic settings for your application.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="siteName">Site Name</Label>
                <Input
                  id="siteName"
                  value={settings.siteName}
                  onChange={(e) => handleChange("siteName", e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="supportEmail">Support Email</Label>
                <Input
                  id="supportEmail"
                  type="email"
                  value={settings.supportEmail}
                  onChange={(e) => handleChange("supportEmail", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Model Settings */}
        <TabsContent value="ai" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Model Configuration</CardTitle>
              <CardDescription>
                Configure LLM providers and default parameters.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-2">
                <Label htmlFor="defaultModel">Default Model</Label>
                <Select
                  value={settings.defaultModel}
                  onValueChange={(val) => handleChange("defaultModel", val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="llama-3.2-11b-vision-preview">
                      Llama 3.2 11B Vision (Groq)
                    </SelectItem>
                    <SelectItem value="llama-3.2-90b-vision-preview">
                      Llama 3.2 90B Vision (Groq)
                    </SelectItem>
                    <SelectItem value="gpt-4o">GPT-4o (OpenAI)</SelectItem>
                    <SelectItem value="claude-3-5-sonnet-20240620">
                      Claude 3.5 Sonnet (Anthropic)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="temperature">
                    Temperature ({settings.temperature})
                  </Label>
                  <Input
                    id="temperature"
                    type="number"
                    min="0"
                    max="2"
                    step="0.1"
                    value={settings.temperature}
                    onChange={(e) =>
                      handleChange("temperature", parseFloat(e.target.value))
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    Controls randomness (0 = deterministic, 1 = creative).
                  </p>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="maxTokens">Max Tokens</Label>
                  <Input
                    id="maxTokens"
                    type="number"
                    value={settings.maxTokens}
                    onChange={(e) =>
                      handleChange("maxTokens", parseInt(e.target.value))
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="systemPrompt">System Prompt</Label>
                <Textarea
                  id="systemPrompt"
                  className="min-h-[150px] font-mono text-sm"
                  value={settings.systemPrompt}
                  onChange={(e) => handleChange("systemPrompt", e.target.value)}
                />
              </div>

              <div className="space-y-4 border-t pt-4">
                <h3 className="text-sm font-medium">API Keys</h3>
                <div className="grid gap-2">
                  <Label htmlFor="groqApiKey">Groq API Key</Label>
                  <Input
                    id="groqApiKey"
                    type="password"
                    value={settings.groqApiKey}
                    onChange={(e) => handleChange("groqApiKey", e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="openaiApiKey">OpenAI API Key</Label>
                  <Input
                    id="openaiApiKey"
                    type="password"
                    value={settings.openaiApiKey}
                    onChange={(e) =>
                      handleChange("openaiApiKey", e.target.value)
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security & Access</CardTitle>
              <CardDescription>
                Manage user access and system maintenance.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label className="text-base">Allow Registration</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow new users to sign up.
                  </p>
                </div>
                <Switch
                  checked={settings.allowRegistration}
                  onCheckedChange={(checked) =>
                    handleChange("allowRegistration", checked)
                  }
                />
              </div>
              <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label className="text-base">Maintenance Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Disable access for non-admin users.
                  </p>
                </div>
                <Switch
                  checked={settings.maintenanceMode}
                  onCheckedChange={(checked) =>
                    handleChange("maintenanceMode", checked)
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
