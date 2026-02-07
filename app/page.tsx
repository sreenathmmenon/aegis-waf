"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Shield,
  Zap,
  Brain,
  Activity,
  CheckCircle2,
  ArrowRight,
  AlertTriangle
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-32 px-8">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-8xl font-bold mb-6">
              <span className="bg-gradient-to-r from-cyan-500 to-green-500 bg-clip-text text-transparent">
                AEGIS
              </span>
            </h1>

            <p className="text-3xl text-[#a1a1aa] font-medium mb-16">
              AI Firewall for LLM Applications
            </p>

            {/* Stats */}
            <div className="flex items-center justify-center gap-12 mb-16 text-lg">
              <div>
                <div className="font-mono font-bold text-3xl text-cyan-400">98.8%</div>
                <div className="text-[#71717a]">Accuracy</div>
              </div>
              <div>
                <div className="font-mono font-bold text-3xl text-green-400">&lt;500ms</div>
                <div className="text-[#71717a]">Latency</div>
              </div>
              <div>
                <div className="font-mono font-bold text-3xl text-red-400">Zero</div>
                <div className="text-[#71717a]">False Positives</div>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <Link href="/demo">
                <Button size="lg" className="bg-green-600 hover:bg-green-700 h-14 px-12 text-lg">
                  Live Demo
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button size="lg" variant="outline" className="border-[#1e1e2e] hover:bg-[#12121a] h-14 px-12 text-lg">
                  View Dashboard
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-8 bg-[#0a0a0f]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Enterprise-Grade Protection</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-[#12121a] border border-[#1e1e2e]">
              <CardContent className="p-8">
                <Brain className="h-12 w-12 text-cyan-500 mb-6" />
                <h3 className="text-2xl font-semibold mb-4">AI-Powered Detection</h3>
                <p className="text-[#a1a1aa] leading-relaxed">
                  Five parallel defense layers using pattern matching, intent analysis, and semantic scanning to stop prompt injection attacks.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-[#12121a] border border-[#1e1e2e]">
              <CardContent className="p-8">
                <Zap className="h-12 w-12 text-green-500 mb-6" />
                <h3 className="text-2xl font-semibold mb-4">Real-Time Response</h3>
                <p className="text-[#a1a1aa] leading-relaxed">
                  Sub-500ms latency with parallel execution. Integrated Slack alerts and live dashboards for security teams.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-[#12121a] border border-[#1e1e2e]">
              <CardContent className="p-8">
                <Shield className="h-12 w-12 text-teal-500 mb-6" />
                <h3 className="text-2xl font-semibold mb-4">Output Validation</h3>
                <p className="text-[#a1a1aa] leading-relaxed">
                  Scans LLM responses for PII, API keys, and policy violations before reaching users. Automatic redaction.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Integration */}
      <section className="py-24 px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-6">Simple Integration</h2>
          <p className="text-xl text-[#71717a] text-center mb-12">
            Add AEGIS to your AI application in minutes
          </p>

          <Card className="bg-[#12121a] border border-[#1e1e2e]">
            <CardContent className="p-8">
              <pre className="text-sm font-mono overflow-x-auto">
                <code>
                  <span className="text-cyan-500">const</span> <span className="text-white">result</span> = <span className="text-cyan-500">await</span> <span className="text-green-400">aegis.validate</span>(userInput);{"\n"}
                  <span className="text-cyan-500">if</span> (result.decision === <span className="text-amber-400">'BLOCK'</span>) <span className="text-cyan-500">return</span> error;{"\n"}
                  <span className="text-cyan-500">return</span> <span className="text-cyan-500">await</span> llm.generate(userInput);
                </code>
              </pre>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="text-center">
              <CheckCircle2 className="h-10 w-10 text-green-500 mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Framework Agnostic</h3>
              <p className="text-sm text-[#71717a]">Works with any stack</p>
            </div>
            <div className="text-center">
              <Activity className="h-10 w-10 text-cyan-500 mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Real-Time Monitoring</h3>
              <p className="text-sm text-[#71717a]">Live threat dashboard</p>
            </div>
            <div className="text-center">
              <AlertTriangle className="h-10 w-10 text-amber-500 mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Instant Alerts</h3>
              <p className="text-sm text-[#71717a]">Slack integration</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-8 bg-[#0a0a0f]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Protect Your AI Today</h2>
          <p className="text-xl text-[#71717a] mb-12">
            Join companies securing their LLM applications with AEGIS
          </p>
          <Link href="/demo">
            <Button size="lg" className="bg-green-600 hover:bg-green-700 h-16 px-16 text-xl">
              Get Started
              <ArrowRight className="h-6 w-6 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
