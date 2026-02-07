"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import "./globals.css";

const navItems = [
  { href: "/demo", label: "Live Demo" },
  { href: "/playground", label: "Playground" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/audit", label: "Audit Log" },
  { href: "/policies", label: "Policies" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  return (
    <html lang="en">
      <head>
        <title>AEGIS - AI WAF for LLM Protection</title>
        <meta name="description" content="Multi-layered AI firewall that detects prompt injection, validates outputs, monitors behavior, and explains every security decision." />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased bg-[#0a0a0f]">
        <div className="min-h-screen flex flex-col">
          <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#0a0a0f]/80 backdrop-blur-xl">
            <div className="w-full h-[56px] flex items-center justify-between" style={{ paddingLeft: 24, paddingRight: 24 }}>
              <Link href="/" className="flex items-center gap-2.5 shrink-0">
                <Shield className="h-5 w-5 text-emerald-400" />
                <span className="text-[15px] font-semibold text-white tracking-[-0.01em]">AEGIS</span>
              </Link>

              <nav className="flex items-center" style={{ gap: 8 }}>
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "transition-colors",
                        isActive
                          ? "text-white"
                          : "text-[#a1a1aa] hover:text-white"
                      )}
                      style={{ fontSize: 14, padding: "6px 14px" }}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </header>

          <main className="flex-1">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
