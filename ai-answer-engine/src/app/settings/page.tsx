"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useTheme } from "next-themes";
import { 
  User, 
  Key, 
  Moon, 
  Bell, 
  Save, 
  Eye, 
  EyeOff
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function SettingsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { theme, setTheme } = useTheme();
  const [apiKeyVisible, setApiKeyVisible] = useState(false);
  const { user, token, updateUser } = useAuth();
  
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    apiKey: "",
    language: "en",
    notifications: {
      email: true,
      push: false,
      updates: true
    }
  });

  React.useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
      }));
    }
  }, [user]);

  const handleSaveProfile = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
      const res = await fetch(`${apiUrl}/api/auth/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ name: formData.name, email: formData.email }),
      });
      if (!res.ok) {
        return;
      }
      const data = await res.json();
      if (data?.user) {
        updateUser({
          id: data.user.id,
          email: data.user.email,
          name: data.user.name,
          role: data.user.role,
        });
      }
    } catch {}
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNotificationChange = (key: string) => {
    setFormData(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key as keyof typeof prev.notifications]
      }
    }));
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground font-sans selection:bg-primary/20">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className="flex-1 flex flex-col relative min-w-0 overflow-hidden">
        <Header toggleSidebar={toggleSidebar} />
        
        <main className="flex-1 flex flex-col relative overflow-y-auto scroll-smooth">
            <div className="max-w-4xl mx-auto w-full p-4 md:p-8 space-y-8 pb-32">
                
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                    <p className="text-muted-foreground">
                        Manage your account settings and preferences.
                    </p>
                </div>

                {/* 1. Profile Info */}
                <section id="profile">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5 text-primary" />
                                Profile Information
                            </CardTitle>
                            <CardDescription>Update your photo and personal details.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center gap-6">
                                <Avatar className="h-20 w-20 border-2 border-border">
                                    <AvatarFallback className="text-lg">
                                      {(user?.name && user.name.split(' ').map(p => p[0]).join('').slice(0,2).toUpperCase()) || (user?.email?.[0]?.toUpperCase() || 'U')}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="space-y-2">
                                    <Button variant="outline" size="sm">Change Avatar</Button>
                                    <p className="text-xs text-muted-foreground">JPG, GIF or PNG. 1MB max.</p>
                                </div>
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Full Name</label>
                                    <Input 
                                        value={formData.name} 
                                        onChange={(e) => handleInputChange("name", e.target.value)} 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Email Address</label>
                                    <Input 
                                        value={formData.email} 
                                        onChange={(e) => handleInputChange("email", e.target.value)} 
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </section>

                {/* 2. API Keys */}
                <section id="api-keys">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Key className="h-5 w-5 text-primary" />
                                API Keys
                            </CardTitle>
                            <CardDescription>Manage your API keys for external services.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">OpenAI API Key</label>
                                <div className="relative">
                                    <Input 
                                        type={apiKeyVisible ? "text" : "password"}
                                        value={formData.apiKey}
                                        onChange={(e) => handleInputChange("apiKey", e.target.value)}
                                        className="pr-10 font-mono text-sm"
                                    />
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                        onClick={() => setApiKeyVisible(!apiKeyVisible)}
                                    >
                                        {apiKeyVisible ? (
                                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                                        ) : (
                                            <Eye className="h-4 w-4 text-muted-foreground" />
                                        )}
                                    </Button>
                                </div>
                                <p className="text-xs text-muted-foreground">Only enter a valid key if required by your workflow.</p>
                            </div>
                        </CardContent>
                    </Card>
                </section>

                {/* Subscription section intentionally removed until a real billing source exists */}

                {/* 4. Preferences (Dark Mode & Language) */}
                <section id="preferences">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Moon className="h-5 w-5 text-primary" />
                                Appearance & Language
                            </CardTitle>
                            <CardDescription>Customize your interface experience.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <label className="text-sm font-medium">Dark Mode</label>
                                    <p className="text-xs text-muted-foreground">
                                        Switch between light and dark themes.
                                    </p>
                                </div>
                                <Switch 
                                    checked={theme === "dark"}
                                    onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <label className="text-sm font-medium">Language</label>
                                    <p className="text-xs text-muted-foreground">
                                        Select your preferred language.
                                    </p>
                                </div>
                                <select 
                                    className="h-9 w-[180px] rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                    value={formData.language}
                                    onChange={(e) => handleInputChange("language", e.target.value)}
                                >
                                    <option value="en">English</option>
                                    <option value="es">Spanish</option>
                                    <option value="fr">French</option>
                                    <option value="de">German</option>
                                    <option value="zh">Chinese</option>
                                </select>
                            </div>
                        </CardContent>
                    </Card>
                </section>

                {/* 5. Notifications */}
                <section id="notifications">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Bell className="h-5 w-5 text-primary" />
                                Notifications
                            </CardTitle>
                            <CardDescription>Choose what updates you want to receive.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <label className="text-sm font-medium">Email Notifications</label>
                                    <p className="text-xs text-muted-foreground">
                                        Receive daily summaries and alerts.
                                    </p>
                                </div>
                                <Switch 
                                    checked={formData.notifications.email}
                                    onCheckedChange={() => handleNotificationChange("email")}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <label className="text-sm font-medium">Push Notifications</label>
                                    <p className="text-xs text-muted-foreground">
                                        Receive real-time updates in the browser.
                                    </p>
                                </div>
                                <Switch 
                                    checked={formData.notifications.push}
                                    onCheckedChange={() => handleNotificationChange("push")}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <label className="text-sm font-medium">Product Updates</label>
                                    <p className="text-xs text-muted-foreground">
                                        Get notified about new features and improvements.
                                    </p>
                                </div>
                                <Switch 
                                    checked={formData.notifications.updates}
                                    onCheckedChange={() => handleNotificationChange("updates")}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </section>

            </div>

            {/* Sticky Save Button */}
            <div className="fixed bottom-0 right-0 left-0 md:left-20 lg:left-72 p-4 bg-background/80 backdrop-blur-lg border-t border-border/50 flex justify-end items-center gap-4 z-10 transition-all duration-300">
                <div className="mr-auto px-4 hidden sm:block text-sm text-muted-foreground">
                    Unsaved changes will be lost.
                </div>
                <Button variant="outline">Cancel</Button>
                <Button className="min-w-[120px]" onClick={handleSaveProfile}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                </Button>
            </div>
        </main>
      </div>
    </div>
  );
}
