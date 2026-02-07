"use client";

import type { Metadata } from "next";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Shield, BarChart3, FileText, Settings, Home, PlayCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import "./globals.css";

const navItems = [
  {
    href: "/",
    icon: Home,
    label: "Home",
  },
  {
    href: "/playground",
    icon: PlayCircle,
    label: "Playground",
  },
  {
    href: "/dashboard",
    icon: BarChart3,
    label: "Dashboard",
  },
  {
    href: "/audit",
    icon: FileText,
    label: "Audit Log",
  },
  {
    href: "/policies",
    icon: Settings,
    label: "Policies",
  },
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
      </head>
      <body className="antialiased">
        <div className="flex h-screen bg-background">
          {/* Sidebar */}
          <aside className="w-64 border-r border-border bg-surface">
            <div className="flex h-full flex-col">
              {/* Logo Header */}
              <div className="flex h-16 items-center justify-center border-b border-border">
                <div className="flex items-center gap-2">
                  <Shield className="h-8 w-8 text-green-500" />
                  <span className="text-2xl font-bold font-mono text-gradient">AEGIS</span>
                </div>
              </div>

              {/* Navigation */}
              <nav className="flex-1 space-y-1 p-4">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-mono transition-colors",
                        isActive
                          ? "bg-green-500/10 text-green-500"
                          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* Footer */}
              <div className="border-t border-border p-4">
                <div className="text-xs text-muted-foreground font-mono">
                  AI WAF v1.0.0
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 overflow-auto">
            <div className="h-full">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
