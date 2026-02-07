"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Shield, Zap, Bell, ArrowRight, CheckCircle2 } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Hero - Full viewport height with massive padding */}
      <section className="min-h-screen flex items-center px-8 py-32">
        <div className="max-w-[1400px] mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            {/* Left: Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-12"
            >
              <div className="space-y-8">
                <h1 className="text-6xl md:text-7xl font-bold text-white leading-[1.1]">
                  Stop Prompt Injection
                  <span className="block text-[#71717a] mt-2">Before It Reaches Your AI</span>
                </h1>

                <p className="text-xl md:text-2xl text-[#a1a1aa] leading-relaxed max-w-xl">
                  Real-time firewall that protects LLM applications from malicious prompts, data leaks, and adversarial attacks.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/demo" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="w-full bg-white text-black hover:bg-gray-100 h-14 px-10 text-lg font-medium"
                  >
                    Try Live Demo
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </Link>
                <Link href="/dashboard" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full border-[#2e2e3e] hover:bg-[#12121a] h-14 px-10 text-lg font-medium"
                  >
                    Dashboard
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-3 gap-12 pt-8">
                <div>
                  <div className="text-3xl font-semibold text-white mb-2">&lt;500ms</div>
                  <div className="text-base text-[#71717a]">Response Time</div>
                </div>
                <div>
                  <div className="text-3xl font-semibold text-white mb-2">5 Layers</div>
                  <div className="text-base text-[#71717a]">Defense System</div>
                </div>
                <div>
                  <div className="text-3xl font-semibold text-white mb-2">24/7</div>
                  <div className="text-base text-[#71717a]">Protection</div>
                </div>
              </div>
            </motion.div>

            {/* Right: Dashboard Mockup */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-[#12121a] border border-[#2e2e3e] rounded-xl overflow-hidden shadow-2xl">
                {/* Header */}
                <div className="bg-[#0a0a0f] px-6 py-4 border-b border-[#2e2e3e] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-2.5 w-2.5 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-white">ACTIVE</span>
                  </div>
                  <span className="text-xs text-[#71717a]">Last 24 hours</span>
                </div>

                {/* Stats */}
                <div className="p-6 grid grid-cols-3 gap-4 border-b border-[#2e2e3e]">
                  <div className="space-y-2">
                    <div className="text-sm text-[#71717a]">Total Scans</div>
                    <div className="text-2xl font-semibold text-white">1,247</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm text-[#71717a]">Blocked</div>
                    <div className="text-2xl font-semibold text-red-400">42</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm text-[#71717a]">Avg Time</div>
                    <div className="text-2xl font-semibold text-cyan-400">347ms</div>
                  </div>
                </div>

                {/* Threats */}
                <div className="p-6 space-y-3">
                  <div className="text-sm font-medium text-[#a1a1aa] mb-4">Recent Activity</div>

                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-red-400">BLOCKED</span>
                      <span className="text-xs text-[#71717a]">2m ago</span>
                    </div>
                    <div className="text-sm text-white">Ignore all previous instructions...</div>
                  </div>

                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-yellow-400">FLAGGED</span>
                      <span className="text-xs text-[#71717a]">5m ago</span>
                    </div>
                    <div className="text-sm text-white">Hypothetically, if you could...</div>
                  </div>

                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-green-400">ALLOWED</span>
                      <span className="text-xs text-[#71717a]">8m ago</span>
                    </div>
                    <div className="text-sm text-white">What are trading hours for forex?</div>
                  </div>
                </div>
              </div>

              {/* Floating alert */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="absolute -bottom-6 -right-6 bg-[#12121a] border border-[#2e2e3e] rounded-lg p-5 shadow-2xl max-w-[280px]"
              >
                <div className="flex items-start gap-3">
                  <Bell className="h-5 w-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-white">Slack Alert Sent</div>
                    <div className="text-xs text-[#71717a]">High severity threat detected</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works - Massive spacing */}
      <section className="px-8 py-40">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-24 space-y-6">
            <h2 className="text-5xl md:text-6xl font-bold text-white">
              How It Works
            </h2>
            <p className="text-xl text-[#71717a] max-w-2xl mx-auto">
              Three-step protection running automatically on every request
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {/* Detect */}
            <div className="space-y-8">
              <div className="h-16 w-16 rounded-2xl bg-cyan-500/10 flex items-center justify-center">
                <Shield className="h-8 w-8 text-cyan-400" />
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-semibold text-white">Detect</h3>
                <p className="text-lg text-[#a1a1aa] leading-relaxed">
                  Five parallel layers analyze every prompt for injection attempts, jailbreaks, and data extraction.
                </p>
              </div>
            </div>

            {/* Block */}
            <div className="space-y-8">
              <div className="h-16 w-16 rounded-2xl bg-red-500/10 flex items-center justify-center">
                <Zap className="h-8 w-8 text-red-400" />
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-semibold text-white">Block</h3>
                <p className="text-lg text-[#a1a1aa] leading-relaxed">
                  Malicious prompts are stopped instantly. Clean requests pass through in under 500ms.
                </p>
              </div>
            </div>

            {/* Alert */}
            <div className="space-y-8">
              <div className="h-16 w-16 rounded-2xl bg-green-500/10 flex items-center justify-center">
                <Bell className="h-8 w-8 text-green-400" />
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-semibold text-white">Alert</h3>
                <p className="text-lg text-[#a1a1aa] leading-relaxed">
                  Real-time Slack notifications with complete threat analysis and context.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA - Massive spacing */}
      <section className="px-8 py-40">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          <div className="space-y-8">
            <h2 className="text-5xl md:text-6xl font-bold text-white">
              Ready to Protect Your AI?
            </h2>
            <p className="text-xl text-[#a1a1aa] max-w-2xl mx-auto">
              See AEGIS in action with live threat detection and real-time dashboard
            </p>
          </div>

          <Link href="/demo">
            <Button
              size="lg"
              className="bg-white text-black hover:bg-gray-100 h-16 px-12 text-lg font-medium"
            >
              Try Live Demo
              <ArrowRight className="h-6 w-6 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      <div className="h-32" />
    </div>
  );
}
