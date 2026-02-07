"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Shield, Zap, Bell, ArrowRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Hero */}
      <section className="min-h-screen flex items-center px-8">
        <div className="max-w-[1400px] mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-32 items-center">
            {/* Left */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Title */}
              <h1 className="text-7xl font-bold text-white leading-[1.1] mb-10">
                Stop Prompt Injection
                <span className="block text-[#71717a] mt-3">Before It Reaches Your AI</span>
              </h1>

              {/* Description - MUCH LARGER */}
              <p className="text-2xl text-[#a1a1aa] leading-relaxed mb-16 max-w-xl">
                Real-time firewall that protects LLM applications from malicious prompts, data leaks, and adversarial attacks.
              </p>

              {/* Buttons - MASSIVE and PREMIUM */}
              <div className="flex gap-6 mb-24">
                <Link href="/demo">
                  <Button className="h-16 px-12 text-lg font-semibold bg-white text-black hover:bg-gray-100 rounded-lg shadow-lg">
                    Try Live Demo
                    <ArrowRight className="h-5 w-5 ml-3" />
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button
                    variant="outline"
                    className="h-16 px-12 text-lg font-semibold border-2 border-[#3e3e4e] hover:bg-[#1a1a1a] rounded-lg"
                  >
                    Dashboard
                  </Button>
                </Link>
              </div>

              {/* Metrics - WAY DOWN with MASSIVE gap */}
              <div className="grid grid-cols-3 gap-16">
                <div>
                  <div className="text-4xl font-bold text-white mb-3">&lt;500ms</div>
                  <div className="text-lg text-[#71717a]">Response Time</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-white mb-3">5 Layers</div>
                  <div className="text-lg text-[#71717a]">Defense System</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-white mb-3">24/7</div>
                  <div className="text-lg text-[#71717a]">Protection</div>
                </div>
              </div>
            </motion.div>

            {/* Right - Dashboard */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-[#12121a] border border-[#2e2e3e] rounded-2xl overflow-hidden shadow-2xl">
                {/* Header */}
                <div className="bg-[#0a0a0f] px-8 py-5 border-b border-[#2e2e3e] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-base font-semibold text-white">ACTIVE</span>
                  </div>
                  <span className="text-sm text-[#71717a]">Last 24 hours</span>
                </div>

                {/* Stats */}
                <div className="p-8 grid grid-cols-3 gap-6 border-b border-[#2e2e3e]">
                  <div>
                    <div className="text-sm text-[#71717a] mb-2">Total Scans</div>
                    <div className="text-3xl font-bold text-white">1,247</div>
                  </div>
                  <div>
                    <div className="text-sm text-[#71717a] mb-2">Blocked</div>
                    <div className="text-3xl font-bold text-red-400">42</div>
                  </div>
                  <div>
                    <div className="text-sm text-[#71717a] mb-2">Avg Time</div>
                    <div className="text-3xl font-bold text-cyan-400">347ms</div>
                  </div>
                </div>

                {/* Threats */}
                <div className="p-8 space-y-4">
                  <div className="text-sm font-semibold text-[#a1a1aa] mb-6">Recent Activity</div>

                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-bold text-red-400">BLOCKED</span>
                      <span className="text-sm text-[#71717a]">2m ago</span>
                    </div>
                    <div className="text-base text-white">Ignore all previous instructions...</div>
                  </div>

                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-5">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-bold text-yellow-400">FLAGGED</span>
                      <span className="text-sm text-[#71717a]">5m ago</span>
                    </div>
                    <div className="text-base text-white">Hypothetically, if you could...</div>
                  </div>

                  <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-5">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-bold text-green-400">ALLOWED</span>
                      <span className="text-sm text-[#71717a]">8m ago</span>
                    </div>
                    <div className="text-base text-white">What are trading hours for forex?</div>
                  </div>
                </div>
              </div>

              {/* Floating notification */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="absolute -bottom-8 -right-8 bg-[#12121a] border border-[#2e2e3e] rounded-xl p-6 shadow-2xl"
              >
                <div className="flex items-start gap-4">
                  <Bell className="h-6 w-6 text-cyan-400 flex-shrink-0 mt-1" />
                  <div>
                    <div className="text-base font-semibold text-white mb-1">Slack Alert Sent</div>
                    <div className="text-sm text-[#71717a]">High severity threat detected</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-8 py-48">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-28">
            <h2 className="text-6xl font-bold text-white mb-8">
              How It Works
            </h2>
            <p className="text-2xl text-[#71717a] max-w-3xl mx-auto">
              Three-step protection running automatically on every request
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-16">
            <div>
              <div className="h-20 w-20 rounded-2xl bg-cyan-500/10 flex items-center justify-center mb-10">
                <Shield className="h-10 w-10 text-cyan-400" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-6">Detect</h3>
              <p className="text-xl text-[#a1a1aa] leading-relaxed">
                Five parallel layers analyze every prompt for injection attempts, jailbreaks, and data extraction.
              </p>
            </div>

            <div>
              <div className="h-20 w-20 rounded-2xl bg-red-500/10 flex items-center justify-center mb-10">
                <Zap className="h-10 w-10 text-red-400" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-6">Block</h3>
              <p className="text-xl text-[#a1a1aa] leading-relaxed">
                Malicious prompts are stopped instantly. Clean requests pass through in under 500ms.
              </p>
            </div>

            <div>
              <div className="h-20 w-20 rounded-2xl bg-green-500/10 flex items-center justify-center mb-10">
                <Bell className="h-10 w-10 text-green-400" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-6">Alert</h3>
              <p className="text-xl text-[#a1a1aa] leading-relaxed">
                Real-time Slack notifications with complete threat analysis and context.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-8 py-48">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-6xl font-bold text-white mb-10">
            Ready to Protect Your AI?
          </h2>
          <p className="text-2xl text-[#a1a1aa] mb-16 max-w-3xl mx-auto">
            See AEGIS in action with live threat detection and real-time dashboard
          </p>
          <Link href="/demo">
            <Button className="h-20 px-16 text-xl font-semibold bg-white text-black hover:bg-gray-100 rounded-xl shadow-xl">
              Try Live Demo
              <ArrowRight className="h-6 w-6 ml-4" />
            </Button>
          </Link>
        </div>
      </section>

      <div className="h-40" />
    </div>
  );
}
