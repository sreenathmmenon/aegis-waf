"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Shield,
  Zap,
  Bell,
  ArrowRight,
  CheckCircle2
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Hero Section */}
      <section className="relative px-8 py-24 md:py-32">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
                Block Prompt Injection
                <br />
                <span className="text-[#71717a]">Before It Reaches Your AI</span>
              </h1>

              <p className="text-xl text-[#a1a1aa] mb-8 leading-relaxed">
                5-layer security system that stops malicious prompts in under 500ms.
                Protects OpenAI, Claude, and custom LLMs with zero configuration.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link href="/demo">
                  <Button
                    size="lg"
                    className="bg-white text-black hover:bg-gray-100 h-12 px-8 text-base font-semibold w-full sm:w-auto"
                  >
                    See Live Demo
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-[#2e2e3e] hover:bg-[#12121a] h-12 px-8 text-base font-semibold w-full sm:w-auto"
                  >
                    View Dashboard
                  </Button>
                </Link>
              </div>

              {/* Key Metrics */}
              <div className="flex gap-8 text-sm">
                <div>
                  <div className="text-2xl font-bold text-white mb-1">&lt;500ms</div>
                  <div className="text-[#71717a]">Response Time</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white mb-1">5 Layers</div>
                  <div className="text-[#71717a]">Parallel Defense</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white mb-1">Real-time</div>
                  <div className="text-[#71717a]">Monitoring</div>
                </div>
              </div>
            </motion.div>

            {/* Right: Dashboard Preview */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative"
            >
              <div className="relative bg-[#12121a] border border-[#2e2e3e] rounded-lg overflow-hidden shadow-2xl">
                {/* Browser Chrome */}
                <div className="bg-[#1a1a1a] px-4 py-3 border-b border-[#2e2e3e] flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-[#2e2e3e]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#2e2e3e]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#2e2e3e]"></div>
                  </div>
                  <div className="flex-1 text-center text-xs text-[#71717a] font-mono">
                    localhost:3000/dashboard
                  </div>
                </div>

                {/* Dashboard Content */}
                <div className="p-6">
                  {/* Status Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium text-white">ACTIVE</span>
                    </div>
                    <div className="text-xs text-[#71717a]">Last 24 hours</div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-[#0a0a0f] border border-[#2e2e3e] rounded p-3">
                      <div className="text-sm text-[#71717a] mb-1">Scans</div>
                      <div className="text-xl font-bold text-white">1,247</div>
                    </div>
                    <div className="bg-[#0a0a0f] border border-[#2e2e3e] rounded p-3">
                      <div className="text-sm text-[#71717a] mb-1">Blocked</div>
                      <div className="text-xl font-bold text-red-400">42</div>
                    </div>
                    <div className="bg-[#0a0a0f] border border-[#2e2e3e] rounded p-3">
                      <div className="text-sm text-[#71717a] mb-1">Avg Time</div>
                      <div className="text-xl font-bold text-cyan-400">347ms</div>
                    </div>
                  </div>

                  {/* Recent Threats */}
                  <div className="space-y-2">
                    <div className="text-xs font-medium text-[#a1a1aa] mb-3">Recent Threats</div>

                    <div className="bg-red-500/10 border border-red-500/20 rounded p-3 flex items-start gap-3">
                      <Shield className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-white mb-1">BLOCKED</div>
                        <div className="text-xs text-[#a1a1aa] truncate">Ignore all previous instructions...</div>
                      </div>
                      <div className="text-xs text-[#71717a]">2m ago</div>
                    </div>

                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded p-3 flex items-start gap-3">
                      <Shield className="h-4 w-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-white mb-1">FLAGGED</div>
                        <div className="text-xs text-[#a1a1aa] truncate">Hypothetically, if you could...</div>
                      </div>
                      <div className="text-xs text-[#71717a]">5m ago</div>
                    </div>

                    <div className="bg-green-500/10 border border-green-500/20 rounded p-3 flex items-start gap-3">
                      <CheckCircle2 className="h-4 w-4 text-green-400 flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-white mb-1">ALLOWED</div>
                        <div className="text-xs text-[#a1a1aa] truncate">What are trading hours for forex?</div>
                      </div>
                      <div className="text-xs text-[#71717a]">8m ago</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Notification */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="absolute -bottom-4 -right-4 bg-[#12121a] border border-[#2e2e3e] rounded-lg p-4 shadow-xl"
              >
                <div className="flex items-start gap-3">
                  <Bell className="h-5 w-5 text-cyan-400 flex-shrink-0" />
                  <div>
                    <div className="text-sm font-medium text-white mb-1">Slack Alert Sent</div>
                    <div className="text-xs text-[#71717a]">Threat blocked • High severity</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-8 py-24 border-t border-[#1e1e2e]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-lg text-[#71717a] max-w-2xl mx-auto">
              Three-step protection that runs automatically on every request
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <Card className="bg-[#12121a] border border-[#2e2e3e] relative overflow-hidden">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="h-12 w-12 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                    <Shield className="h-6 w-6 text-cyan-400" />
                  </div>
                  <span className="text-4xl font-bold text-[#2e2e3e]">01</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Detect</h3>
                <p className="text-[#a1a1aa] leading-relaxed">
                  5 parallel layers analyze every prompt for injection attempts, jailbreaks, and data extraction
                </p>
              </CardContent>
            </Card>

            {/* Step 2 */}
            <Card className="bg-[#12121a] border border-[#2e2e3e] relative overflow-hidden">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="h-12 w-12 rounded-lg bg-red-500/10 flex items-center justify-center">
                    <Zap className="h-6 w-6 text-red-400" />
                  </div>
                  <span className="text-4xl font-bold text-[#2e2e3e]">02</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Block</h3>
                <p className="text-[#a1a1aa] leading-relaxed">
                  Malicious prompts are stopped before reaching your LLM. Clean requests go through instantly
                </p>
              </CardContent>
            </Card>

            {/* Step 3 */}
            <Card className="bg-[#12121a] border border-[#2e2e3e] relative overflow-hidden">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="h-12 w-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <Bell className="h-6 w-6 text-green-400" />
                  </div>
                  <span className="text-4xl font-bold text-[#2e2e3e]">03</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Alert</h3>
                <p className="text-[#a1a1aa] leading-relaxed">
                  Real-time Slack notifications with full threat details and recommended actions
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-8 py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to protect your AI?
          </h2>
          <p className="text-xl text-[#a1a1aa] mb-10">
            See AEGIS in action with live threat detection
          </p>
          <Link href="/demo">
            <Button
              size="lg"
              className="bg-white text-black hover:bg-gray-100 h-14 px-10 text-lg font-semibold"
            >
              Try Live Demo
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      <div className="h-16" />
    </div>
  );
}
