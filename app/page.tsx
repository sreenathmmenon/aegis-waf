"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Shield,
  Zap,
  Brain,
  Lock,
  Activity,
  ArrowRight,
  CheckCircle
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0f] via-[#0a0a0f] to-[#0f1419]">
      {/* Hero */}
      <section className="relative px-8 pt-32 pb-24 overflow-hidden">
        {/* Gradient orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl" />

        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-8">
              <Shield className="h-4 w-4 text-cyan-400" />
              <span className="text-sm text-cyan-400 font-medium">AI Security Platform</span>
            </div>

            <h1 className="text-7xl md:text-9xl font-bold mb-8 tracking-tight">
              <span className="bg-gradient-to-r from-white via-cyan-200 to-green-200 bg-clip-text text-transparent">
                AEGIS
              </span>
            </h1>

            <p className="text-2xl md:text-4xl text-white font-semibold mb-6">
              Stop Prompt Injection Attacks
            </p>

            <p className="text-lg text-[#a1a1aa] max-w-2xl mx-auto mb-12 leading-relaxed">
              Real-time AI firewall that protects your LLM applications from malicious inputs,
              data leaks, and adversarial prompts
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
              <Link href="/demo">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-cyan-500 to-green-500 hover:from-cyan-600 hover:to-green-600 text-white h-14 px-10 text-base font-semibold shadow-lg shadow-cyan-500/25"
                >
                  Try Live Demo
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-[#2e2e3e] bg-[#12121a]/50 backdrop-blur hover:bg-[#1a1a24] h-14 px-10 text-base font-semibold"
                >
                  View Dashboard
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-green-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
                <div className="relative bg-[#12121a]/80 backdrop-blur border border-[#2e2e3e] rounded-2xl p-6">
                  <div className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent mb-2">
                    98.8%
                  </div>
                  <div className="text-sm text-[#a1a1aa]">Detection Rate</div>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-green-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
                <div className="relative bg-[#12121a]/80 backdrop-blur border border-[#2e2e3e] rounded-2xl p-6">
                  <div className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent mb-2">
                    &lt;500ms
                  </div>
                  <div className="text-sm text-[#a1a1aa]">Response Time</div>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-green-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
                <div className="relative bg-[#12121a]/80 backdrop-blur border border-[#2e2e3e] rounded-2xl p-6">
                  <div className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent mb-2">
                    24/7
                  </div>
                  <div className="text-sm text-[#a1a1aa]">Protection</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="px-8 py-32">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-white to-[#a1a1aa] bg-clip-text text-transparent">
              Multi-Layer Defense System
            </h2>
            <p className="text-xl text-[#71717a] max-w-2xl mx-auto">
              Five parallel security layers analyze every request in real-time
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Brain,
                title: "AI Intent Analysis",
                description: "Deep learning models detect adversarial intent and hidden manipulation attempts",
                color: "cyan"
              },
              {
                icon: Zap,
                title: "Pattern Detection",
                description: "Real-time regex matching against known attack signatures and exploit patterns",
                color: "green"
              },
              {
                icon: Lock,
                title: "Semantic Guard",
                description: "Similarity analysis compares inputs against database of malicious prompts",
                color: "teal"
              },
              {
                icon: Activity,
                title: "Behavior Tracking",
                description: "Session monitoring builds risk profiles to detect multi-step attacks",
                color: "orange"
              },
              {
                icon: Shield,
                title: "Output Validation",
                description: "Scans LLM responses for PII leaks, API keys, and policy violations",
                color: "purple"
              },
              {
                icon: CheckCircle,
                title: "Real-Time Alerts",
                description: "Instant Slack notifications with detailed threat analysis and context",
                color: "blue"
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="relative group bg-[#12121a]/50 backdrop-blur border border-[#2e2e3e] hover:border-[#3e3e4e] transition-all h-full overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br from-${feature.color}-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity`} />
                  <CardContent className="p-8 relative">
                    <div className={`h-14 w-14 rounded-2xl bg-${feature.color}-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                      <feature.icon className={`h-7 w-7 text-${feature.color}-400`} />
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-white">{feature.title}</h3>
                    <p className="text-[#a1a1aa] leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-8 py-32">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-green-500/20 to-cyan-500/20 rounded-3xl blur-2xl" />
            <Card className="relative bg-gradient-to-br from-[#12121a] to-[#1a1a24] border-2 border-[#2e2e3e]">
              <CardContent className="p-16 text-center">
                <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-white via-cyan-200 to-green-200 bg-clip-text text-transparent">
                  Ready to Secure Your AI?
                </h2>
                <p className="text-xl text-[#a1a1aa] mb-12 max-w-2xl mx-auto">
                  See AEGIS in action with live threat detection and real-time protection
                </p>
                <Link href="/demo">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-cyan-500 to-green-500 hover:from-cyan-600 hover:to-green-600 text-white h-16 px-12 text-lg font-semibold shadow-2xl shadow-cyan-500/25"
                  >
                    Launch Demo
                    <ArrowRight className="h-6 w-6 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      <div className="h-24" />
    </div>
  );
}
