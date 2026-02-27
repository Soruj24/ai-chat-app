 "use client";
 
 import React from "react";
 import ReactMarkdown from "react-markdown";
 import remarkGfm from "remark-gfm";
 import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
 import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
 import { Button } from "@/components/ui/button";
 import { Copy } from "lucide-react";
 import { cn } from "@/lib/utils";
 import { CitationBadge } from "@/components/ai/CitationBadge";
 import { DataChart } from "./DataChart";
 import { Source } from "@/types";
 
 interface MessageMarkdownProps {
   processedContent: string;
   sources?: Source[];
   isStreaming?: boolean;
 }
 
 export function MessageMarkdown({
   processedContent,
   sources,
   isStreaming,
 }: MessageMarkdownProps) {
   return (
     <div className="prose prose-neutral dark:prose-invert max-w-none text-foreground leading-relaxed rounded-xl">
       <ReactMarkdown
         remarkPlugins={[remarkGfm]}
         components={{
           h1: (props) => (
             <h1 className="text-2xl font-bold mt-6 mb-4" {...props} />
           ),
           h2: (props) => (
             <h2 className="text-xl font-bold mt-5 mb-3" {...props} />
           ),
           h3: (props) => (
             <h3 className="text-lg font-semibold mt-4 mb-2" {...props} />
           ),
           ul: (props) => (
             <ul className="list-disc pl-5 my-4 space-y-1" {...props} />
           ),
           ol: (props) => (
             <ol className="list-decimal pl-5 my-4 space-y-1" {...props} />
           ),
           li: (props) => <li className="pl-1" {...props} />,
           p: (props) => (
             <p className="my-3 last:mb-0" {...props} />
           ),
           code({ inline, className, children, ...props }) {
             const match = /language-(\w+)/.exec(className || "");
             const language = match ? match[1] : "";
 
             if (!inline && language === "chart") {
               try {
                 const chartData = JSON.parse(String(children).replace(/\n$/, ""));
                 const xAxisKey =
                   chartData.xAxisKey ||
                   (chartData.data && chartData.data.length > 0
                     ? Object.keys(chartData.data[0])[0]
                     : "name");
                 const chartType = chartData.type || chartData.name || "bar";
                 return (
                   <DataChart
                     data={chartData.data}
                     type={chartType}
                     title={chartData.title}
                     description={chartData.description}
                     xAxisKey={xAxisKey}
                     dataKeys={
                       chartData.series || [{ key: "value", color: "#8884d8" }]
                     }
                   />
                 );
               } catch {
                 return (
                   <div className="text-red-500 text-xs p-2 border border-red-500/50 rounded">
                     Invalid chart data
                   </div>
                 );
               }
             }
 
             return !inline && match ? (
               <div className="rounded-xl overflow-hidden my-4 border border-border/50 shadow-sm group">
                 <div className="bg-muted/30 px-4 py-2 text-xs font-mono text-muted-foreground flex justify-between items-center border-b border-border/50 backdrop-blur-sm">
                   <span className="uppercase tracking-wider opacity-70">
                     {language || "code"}
                   </span>
                   <Button
                     variant="ghost"
                     size="sm"
                     className="h-6 px-2 text-[10px] hover:bg-background/50"
                     onClick={() => {
                       navigator.clipboard.writeText(
                         String(children).replace(/\n$/, ""),
                       );
                     }}
                   >
                     <Copy className="h-3 w-3 mr-1" /> Copy
                   </Button>
                 </div>
                 <SyntaxHighlighter
                   style={vscDarkPlus}
                   language={language}
                   PreTag="div"
                   customStyle={{
                     margin: 0,
                     padding: "1.5rem",
                     fontSize: "0.875rem",
                     lineHeight: "1.6",
                   }}
                   {...props}
                 >
                   {String(children).replace(/\n$/, "")}
                 </SyntaxHighlighter>
               </div>
             ) : (
               <code
                 className={cn(
                   "bg-muted/50 px-1.5 py-0.5 rounded text-sm font-mono text-primary border border-border/30",
                   className,
                 )}
                 {...props}
               >
                 {children}
               </code>
             );
           },
           blockquote: (props) => (
             <blockquote
               className="border-l-4 border-primary/30 pl-4 italic text-muted-foreground my-4"
               {...props}
             />
           ),
           a({ href, children, ...props }) {
             if (
               children &&
               children[0] &&
               typeof children[0] === "string" &&
               children[0].startsWith("^")
             ) {
               const index = parseInt(children[0].substring(1));
               const source = sources?.[index - 1];
               if (source) {
                 return (
                   <CitationBadge index={index} url={source.url} title={source.title} />
                 );
               }
             }
             return (
               <a
                 href={href}
                 target="_blank"
                 rel="noopener noreferrer"
                 className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2"
                 {...props}
               >
                 {children}
               </a>
             );
           },
           strong: (props) => (
             <strong
               className="font-semibold text-foreground bg-indigo-500/10 px-1 rounded box-decoration-clone"
               {...props}
             />
           ),
           img: (props) => (
             <img
               className="rounded-xl shadow-lg max-w-full h-auto my-6 border border-border/50"
               {...props}
               loading="lazy"
             />
           ),
           sup({ children }) {
             if (
               children &&
               typeof children[0] === "string" &&
               !isNaN(parseInt(children[0]))
             ) {
               const index = parseInt(children[0]);
               const source = sources?.[index - 1];
               if (source) {
                 return (
                   <CitationBadge
                     index={index}
                     url={source.url}
                     title={source.title}
                   />
                 );
               }
             }
             return <span className="text-xs text-muted-foreground">{children}</span>;
           },
         }}
       >
         {processedContent}
       </ReactMarkdown>
       {isStreaming && (
         <span className="inline-block w-1.5 h-4 ml-1 align-middle bg-indigo-500 animate-pulse" />
       )}
     </div>
   );
 }
 
