"use client";

import { useState, useEffect, createContext, useContext, ReactNode, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Edit2, Copy, FileText, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  template: string;
  category: string;
  variables: string[];
  createdAt: string;
  updatedAt: string;
}

interface TemplatesContextType {
  templates: PromptTemplate[];
  addTemplate: (template: Omit<PromptTemplate, "id" | "createdAt" | "updatedAt">) => void;
  updateTemplate: (id: string, template: Partial<PromptTemplate>) => void;
  deleteTemplate: (id: string) => void;
  applyTemplate: (template: PromptTemplate, variables: Record<string, string>) => string;
}

const TemplatesContext = createContext<TemplatesContextType | undefined>(undefined);

const DEFAULT_TEMPLATES: Omit<PromptTemplate, "id" | "createdAt" | "updatedAt">[] = [
  {
    name: "Summarize",
    description: "Summarize the provided text",
    template: "Please summarize the following text in 3-5 bullet points:\n\n{{content}}",
    category: "writing",
    variables: ["content"],
  },
  {
    name: "Translate",
    description: "Translate text to another language",
    template: "Translate the following text to {{language}}:\n\n{{content}}",
    category: "writing",
    variables: ["language", "content"],
  },
  {
    name: "Code Review",
    description: "Review code and provide feedback",
    template: "Please review the following code and provide feedback on:\n- Code quality\n- Potential bugs\n- Performance improvements\n- Security concerns\n\n\`\`\`\n{{code}}\n\`\`\`",
    category: "development",
    variables: ["code"],
  },
  {
    name: "Explain Like I'm 5",
    description: "Explain complex topics simply",
    template: "Explain the following concept to a 5-year-old child:\n\n{{topic}}",
    category: "education",
    variables: ["topic"],
  },
  {
    name: "Pros & Cons",
    description: "List advantages and disadvantages",
    template: "Analyze the following topic and provide a balanced list of pros and cons:\n\n{{topic}}",
    category: "analysis",
    variables: ["topic"],
  },
];

export function TemplatesProvider({ children }: { children: ReactNode }) {
  const [templates, setTemplates] = useState<PromptTemplate[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("promptTemplates");
    if (saved) {
      setTemplates(JSON.parse(saved));
    } else {
      const initial = DEFAULT_TEMPLATES.map((t, idx) => ({
        ...t,
        id: `default-${idx}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));
      setTemplates(initial);
      localStorage.setItem("promptTemplates", JSON.stringify(initial));
    }
    setIsLoaded(true);
  }, []);

  const addTemplate = useCallback((template: Omit<PromptTemplate, "id" | "createdAt" | "updatedAt">) => {
    const newTemplate: PromptTemplate = {
      ...template,
      id: `template-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTemplates((prev) => {
      const updated = [...prev, newTemplate];
      localStorage.setItem("promptTemplates", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const updateTemplate = useCallback((id: string, updates: Partial<PromptTemplate>) => {
    setTemplates((prev) => {
      const updated = prev.map((t) =>
        t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t
      );
      localStorage.setItem("promptTemplates", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const deleteTemplate = useCallback((id: string) => {
    setTemplates((prev) => {
      const updated = prev.filter((t) => t.id !== id);
      localStorage.setItem("promptTemplates", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const applyTemplate = useCallback((template: PromptTemplate, variables: Record<string, string>): string => {
    let result = template.template;
    for (const [key, value] of Object.entries(variables)) {
      result = result.replace(new RegExp(`{{${key}}}`, "g"), value);
    }
    return result;
  }, []);

  if (!isLoaded) {
    return <>{children}</>;
  }

  return (
    <TemplatesContext.Provider
      value={{
        templates,
        addTemplate,
        updateTemplate,
        deleteTemplate,
        applyTemplate,
      }}
    >
      {children}
    </TemplatesContext.Provider>
  );
}

export function useTemplates() {
  const context = useContext(TemplatesContext);
  if (!context) {
    throw new Error("useTemplates must be used within a TemplatesProvider");
  }
  return context;
}

export function TemplateDialog({ onApply }: { onApply: (query: string) => void }) {
  const { templates, addTemplate, updateTemplate, deleteTemplate, applyTemplate } = useTemplates();
  const [isOpen, setIsOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<PromptTemplate | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<PromptTemplate | null>(null);
  const [variableValues, setVariableValues] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    template: "",
    category: "general",
    variables: "",
  });
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleUseTemplate = (template: PromptTemplate) => {
    setSelectedTemplate(template);
    const initialVars: Record<string, string> = {};
    template.variables.forEach((v) => {
      initialVars[v] = "";
    });
    setVariableValues(initialVars);
  };

  const handleApply = () => {
    if (selectedTemplate) {
      const result = applyTemplate(selectedTemplate, variableValues);
      onApply(result);
      setIsOpen(false);
      setSelectedTemplate(null);
    }
  };

  const handleCreateTemplate = () => {
    const variables = formData.variables
      .split(",")
      .map((v) => v.trim())
      .filter((v) => v);

    addTemplate({
      name: formData.name,
      description: formData.description,
      template: formData.template,
      category: formData.category,
      variables,
    });

    setFormData({ name: "", description: "", template: "", category: "general", variables: "" });
    setIsCreateOpen(false);
  };

  const handleCopyTemplate = (template: PromptTemplate) => {
    navigator.clipboard.writeText(template.template);
    setCopiedId(template.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <FileText className="h-4 w-4" />
          Templates
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Prompt Templates</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-auto space-y-4">
          {selectedTemplate ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">{selectedTemplate.name}</h3>
                <Button variant="ghost" size="sm" onClick={() => setSelectedTemplate(null)}>
                  Back
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">{selectedTemplate.description}</p>

              <div className="space-y-3">
                {selectedTemplate.variables.map((variable) => (
                  <div key={variable} className="space-y-1">
                    <Label htmlFor={variable}>{variable}</Label>
                    <Textarea
                      id={variable}
                      value={variableValues[variable] || ""}
                      onChange={(e) =>
                        setVariableValues((prev) => ({ ...prev, [variable]: e.target.value }))
                      }
                      placeholder={`Enter ${variable}...`}
                      className="min-h-[80px]"
                    />
                  </div>
                ))}
              </div>

              <div className="p-3 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground mb-2">Preview:</p>
                <p className="text-sm whitespace-pre-wrap">
                  {applyTemplate(selectedTemplate, variableValues)}
                </p>
              </div>

              <Button onClick={handleApply} className="w-full">
                Use Template
              </Button>
            </div>
          ) : (
            <>
              <div className="flex justify-end">
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="gap-2">
                      <Plus className="h-4 w-4" />
                      New Template
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create Template</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Name</Label>
                        <Input
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="My Template"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Input
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          placeholder="What this template does"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Template (use {"{{variable}}"} for placeholders)</Label>
                        <Textarea
                          value={formData.template}
                          onChange={(e) => setFormData({ ...formData, template: e.target.value })}
                          placeholder="Write your template here..."
                          className="min-h-[150px]"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Variables (comma separated)</Label>
                        <Input
                          value={formData.variables}
                          onChange={(e) => setFormData({ ...formData, variables: e.target.value })}
                          placeholder="topic, content, language"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Category</Label>
                        <Select
                          value={formData.category}
                          onValueChange={(v) => setFormData({ ...formData, category: v })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="general">General</SelectItem>
                            <SelectItem value="writing">Writing</SelectItem>
                            <SelectItem value="development">Development</SelectItem>
                            <SelectItem value="education">Education</SelectItem>
                            <SelectItem value="analysis">Analysis</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={handleCreateTemplate}>Create</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid gap-3">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{template.name}</h4>
                          <span className="text-xs px-2 py-0.5 bg-secondary rounded-full">
                            {template.category}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{template.description}</p>
                        <p className="text-xs text-muted-foreground font-mono mt-2 line-clamp-2">
                          {template.template}
                        </p>
                      </div>
                      <div className="flex gap-1 ml-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleCopyTemplate(template)}
                        >
                          {copiedId === template.id ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleUseTemplate(template)}
                        >
                          Use
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
