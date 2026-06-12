import { Zap } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar */}
      <header className="border-b-[3px] border-black px-6 py-4">
        <Link href="/" className="inline-flex items-center gap-2 group">
          <span className="flex items-center justify-center w-7 h-7 bg-brand-yellow border-[3px] border-black rounded-sm shadow-[2px_2px_0_#000] group-hover:shadow-none group-hover:translate-x-[2px] group-hover:translate-y-[2px] transition-all duration-100">
            <Zap className="w-3.5 h-3.5 text-black fill-black" />
          </span>
          <span className="font-extrabold text-base tracking-tight">
            FreelanceOS
          </span>
        </Link>
      </header>

      {/* Centered content */}
      <main className="flex-1 flex items-center justify-center p-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t-[3px] border-black px-6 py-3 text-center">
        <p className="text-xs text-muted-foreground">
          Built for Singapore freelancers.{" "}
          <span className="font-bold text-foreground">Own your business.</span>
        </p>
      </footer>
    </div>
  );
}
