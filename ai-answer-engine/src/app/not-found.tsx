import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="mx-auto h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
          <span className="text-2xl font-bold">404</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
          Page Not Found
        </h1>
        <p className="text-muted-foreground">
          The page you’re looking for doesn’t exist or was moved.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center rounded-xl bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Go Home
          </Link>
          <Link
            href="/chat"
            className="inline-flex items-center rounded-xl border border-border px-4 py-2 text-sm font-medium hover:bg-muted/50 transition-colors"
          >
            Open Chat
          </Link>
        </div>
      </div>
    </div>
  );
}
