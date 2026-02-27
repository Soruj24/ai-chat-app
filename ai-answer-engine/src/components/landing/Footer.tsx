import Link from "next/link";
import { Twitter, Github, Linkedin, MessageCircle } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-background/50 backdrop-blur-xl">
      <div className="container py-12 px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-sky-500" />
              <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-sky-500">
                AI Engine
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              The next generation of search. Fast, accurate, and citation-backed.
            </p>
            <div className="flex items-center gap-4 text-muted-foreground">
              <Link href="#" className="hover:text-foreground transition-colors"><Twitter className="h-5 w-5" /></Link>
              <Link href="#" className="hover:text-foreground transition-colors"><Github className="h-5 w-5" /></Link>
              <Link href="#" className="hover:text-foreground transition-colors"><Linkedin className="h-5 w-5" /></Link>
              <Link href="#" className="hover:text-foreground transition-colors"><MessageCircle className="h-5 w-5" /></Link>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-foreground transition-colors">Features</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Pricing</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">API</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Integration</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-foreground transition-colors">About</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Blog</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Careers</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-border/50 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} AI Engine Inc. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
