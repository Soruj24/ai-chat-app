"use client";

import { motion } from "framer-motion";
import { Search, BrainCircuit, CheckCircle } from "lucide-react";

export function HowItWorksSection() {
  const steps = [
    {
      icon: <Search className="h-10 w-10 text-primary" />,
      title: "Ask a Question",
      description: "Type anything. From simple facts to complex analysis.",
    },
    {
      icon: <BrainCircuit className="h-10 w-10 text-indigo-500" />,
      title: "AI Analysis",
      description: "Our AI scans thousands of trusted sources in real-time.",
    },
    {
      icon: <CheckCircle className="h-10 w-10 text-green-500" />,
      title: "Get Answer",
      description: "Receive a concise, accurate answer with citations.",
    },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-muted/10 relative overflow-hidden">
      <div className="container px-4 md:px-6 relative z-10">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            How it works
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Simple, fast, and transparent. Here is the process.
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-12 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-primary/20 via-primary/50 to-primary/20" />

          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
              className="relative flex flex-col items-center text-center max-w-xs z-10"
            >
              <div className="w-24 h-24 rounded-full bg-background border-4 border-muted flex items-center justify-center shadow-xl mb-6 relative">
                 <div className="absolute inset-0 bg-primary/5 rounded-full animate-ping opacity-20" />
                {step.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
