"use client";

import { motion } from "framer-motion";
import { Zap, ShieldCheck, FileText, Globe } from "lucide-react";

const features = [
  {
    icon: <Zap className="h-6 w-6 text-yellow-500" />,
    title: "Instant Answers",
    description: "No more endless scrolling. Get precise, summarized answers in seconds.",
  },
  {
    icon: <ShieldCheck className="h-6 w-6 text-emerald-500" />,
    title: "Verified Sources",
    description: "Every answer comes with citations from trusted websites so you can verify facts.",
  },
  {
    icon: <FileText className="h-6 w-6 text-sky-500" />,
    title: "AI Summaries",
    description: "Complex topics broken down into easy-to-understand summaries.",
  },
  {
    icon: <Globe className="h-6 w-6 text-indigo-500" />,
    title: "Global Knowledge",
    description: "Access real-time information from the entire web, updated instantly.",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-background relative overflow-hidden">
      <div className="container px-4 md:px-6 relative z-10">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            Why choose our AI Engine?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Experience the future of search with features designed for speed, accuracy, and clarity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="group p-6 rounded-2xl bg-secondary/20 border border-border/50 hover:bg-secondary/40 transition-colors hover:shadow-xl hover:-translate-y-1 duration-300"
            >
              <div className="mb-4 p-3 bg-background rounded-xl w-fit border border-border/50 shadow-sm group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
