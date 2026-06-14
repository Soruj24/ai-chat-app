"use client";

import React, { useState } from "react";
import {
  CodeBlock,
  CodeBlockContainer,
  CodeBlockHeader,
  CodeBlockTitle,
  CodeBlockFilename,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockLanguageSelector,
  CodeBlockLanguageSelectorTrigger,
  CodeBlockLanguageSelectorValue,
  CodeBlockLanguageSelectorContent,
  CodeBlockLanguageSelectorItem,
} from "@/components/ai-elements/code-block";
import type { BundledLanguage } from "shiki";

interface CodeBlockWrapperProps {
  code: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
}

const LANGUAGE_MAP: Record<string, BundledLanguage> = {
  js: "javascript",
  ts: "typescript",
  tsx: "tsx",
  jsx: "jsx",
  py: "python",
  rb: "ruby",
  go: "go",
  rs: "rust",
  java: "java",
  c: "c",
  cpp: "cpp",
  cs: "csharp",
  php: "php",
  swift: "swift",
  kt: "kotlin",
  scala: "scala",
  sh: "bash",
  bash: "bash",
  zsh: "bash",
  ps1: "powershell",
  powershell: "powershell",
  html: "html",
  css: "css",
  scss: "scss",
  less: "less",
  json: "json",
  yaml: "yaml",
  yml: "yaml",
  toml: "toml",
  xml: "xml",
  sql: "sql",
  md: "markdown",
  markdown: "markdown",
  dockerfile: "dockerfile",
  docker: "dockerfile",
  graphql: "graphql",
  gql: "graphql",
};

const COMMON_LANGUAGES: BundledLanguage[] = [
  "javascript",
  "typescript",
  "python",
  "html",
  "css",
  "json",
  "bash",
  "sql",
  "markdown",
];

function normalizeLanguage(lang: string): BundledLanguage {
  const normalized = lang.toLowerCase().trim();
  return LANGUAGE_MAP[normalized] || (normalized as BundledLanguage);
}

export function CodeBlockWrapper({
  code,
  language = "text",
  filename,
  showLineNumbers = false,
}: CodeBlockWrapperProps) {
  const [selectedLang, setSelectedLang] = useState<BundledLanguage>(
    normalizeLanguage(language)
  );

  return (
    <CodeBlock code={code} language={selectedLang} showLineNumbers={showLineNumbers}>
      <CodeBlockHeader>
        <CodeBlockTitle>
          {filename && <CodeBlockFilename>{filename}</CodeBlockFilename>}
        </CodeBlockTitle>
        <CodeBlockActions>
          <CodeBlockLanguageSelector
            value={selectedLang}
            onValueChange={(v) => setSelectedLang(v as BundledLanguage)}
          >
            <CodeBlockLanguageSelectorTrigger />
            <CodeBlockLanguageSelectorValue />
            <CodeBlockLanguageSelectorContent>
              {COMMON_LANGUAGES.map((lang) => (
                <CodeBlockLanguageSelectorItem key={lang} value={lang}>
                  {lang}
                </CodeBlockLanguageSelectorItem>
              ))}
            </CodeBlockLanguageSelectorContent>
          </CodeBlockLanguageSelector>
          <CodeBlockCopyButton />
        </CodeBlockActions>
      </CodeBlockHeader>
    </CodeBlock>
  );
}
