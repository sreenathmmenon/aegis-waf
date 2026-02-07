"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Shield,
  Zap,
  Eye,
  Brain,
  Lock,
  TrendingUp,
  Activity,
  CheckCircle2,
  ArrowRight
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            {/* Main Title */}
            <h1 className="text-7xl md:text-8xl font-bold mb-6">
              <span className="bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                AEGIS
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-2xl md:text-3xl text-muted-foreground mb-4 font-medium">
              The immune system for AI agents
            </p>

            {/* Description */}
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
              Multi-layered AI firewall that detects prompt injection, validates outputs,
              monitors behavior, and explains every security decision.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/playground">
                <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white gap-2">
                  Try the Playground
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button size="lg" variant="outline" className="border-border hover:bg-surface">
                  View Dashboard
                </Button>
              </Link>
            </div>

            {/* Stats Bar */}
            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-500" />
                <span>4 Defense Layers</span>
              </div>
              <div className="hidden sm:block text-border">·</div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-blue-500" />
                <span>&lt;500ms Latency</span>
              </div>
              <div className="hidden sm:block text-border">·</div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span>&lt;2% False Positives</span>
              </div>
              <div className="hidden sm:block text-border">·</div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>OWASP Aligned</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-8 bg-surface/30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Defense in Depth</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Four independent security layers working in parallel to protect your AI agents
              from adversarial inputs and malicious exploitation.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1: Pattern Detection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="bg-surface border-border h-full hover:border-green-500/50 transition-colors">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-green-500/10 flex items-center justify-center mb-4">
                    <Eye className="h-6 w-6 text-green-500" />
                  </div>
                  <CardTitle className="text-xl">Pattern Detection</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Zero-latency regex-based detection of 7 known attack patterns including
                    instruction overrides, role hijacking, and encoding tricks.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Feature 2: Intent Classification */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="bg-surface border-border h-full hover:border-blue-500/50 transition-colors">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4">
                    <Brain className="h-6 w-6 text-blue-500" />
                  </div>
                  <CardTitle className="text-xl">Intent Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    AI-powered semantic analysis using GPT-4o-mini to understand hidden goals,
                    adversarial intent, and sophisticated attack vectors.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Feature 3: Semantic Scanning */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
            >
              <Card className="bg-surface border-border h-full hover:border-purple-500/50 transition-colors">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4">
                    <Lock className="h-6 w-6 text-purple-500" />
                  </div>
                  <CardTitle className="text-xl">Semantic Guard</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Similarity matching against known attack database using Jaccard and n-gram
                    algorithms to catch variants and obfuscated attempts.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Feature 4: Behavior Monitor */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              viewport={{ once: true }}
            >
              <Card className="bg-surface border-border h-full hover:border-yellow-500/50 transition-colors">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-yellow-500/10 flex items-center justify-center mb-4">
                    <Activity className="h-6 w-6 text-yellow-500" />
                  </div>
                  <CardTitle className="text-xl">Behavior Tracking</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Session-based monitoring with risk scoring to detect multi-turn attacks,
                    repeated probing, and coordinated exploitation attempts.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Architecture Section */}
      <section className="py-16 px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              All layers execute in parallel for minimal latency. Decisions are made through
              weighted consensus with explainable AI reasoning.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Card className="bg-surface border-border">
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {/* Layer 1 */}
                  <div className="flex flex-col items-center text-center">
                    <div className="h-16 w-16 rounded-full bg-green-500/10 border-2 border-green-500/50 flex items-center justify-center mb-4">
                      <span className="text-2xl font-bold text-green-500">1</span>
                    </div>
                    <h3 className="font-semibold mb-2">Pattern Layer</h3>
                    <p className="text-xs text-muted-foreground">
                      Regex detection ~2ms
                    </p>
                  </div>

                  {/* Arrow */}
                  <div className="hidden md:flex items-center justify-center">
                    <ArrowRight className="h-6 w-6 text-border" />
                  </div>

                  {/* Layer 2 */}
                  <div className="flex flex-col items-center text-center">
                    <div className="h-16 w-16 rounded-full bg-blue-500/10 border-2 border-blue-500/50 flex items-center justify-center mb-4">
                      <span className="text-2xl font-bold text-blue-500">2</span>
                    </div>
                    <h3 className="font-semibold mb-2">Intent Layer</h3>
                    <p className="text-xs text-muted-foreground">
                      AI analysis ~50ms
                    </p>
                  </div>

                  {/* Arrow */}
                  <div className="hidden md:flex items-center justify-center">
                    <ArrowRight className="h-6 w-6 text-border" />
                  </div>

                  {/* Layer 3 */}
                  <div className="flex flex-col items-center text-center">
                    <div className="h-16 w-16 rounded-full bg-purple-500/10 border-2 border-purple-500/50 flex items-center justify-center mb-4">
                      <span className="text-2xl font-bold text-purple-500">3</span>
                    </div>
                    <h3 className="font-semibold mb-2">Semantic Layer</h3>
                    <p className="text-xs text-muted-foreground">
                      Similarity check ~5ms
                    </p>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-border">
                  <div className="flex flex-col items-center text-center">
                    <div className="h-16 w-16 rounded-full bg-yellow-500/10 border-2 border-yellow-500/50 flex items-center justify-center mb-4">
                      <span className="text-2xl font-bold text-yellow-500">4</span>
                    </div>
                    <h3 className="font-semibold mb-2">Behavior Monitor</h3>
                    <p className="text-xs text-muted-foreground mb-4">
                      Session tracking and risk scoring
                    </p>
                    <div className="flex gap-4 text-xs">
                      <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-500 border border-green-500/50">
                        ALLOW
                      </span>
                      <span className="px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-500 border border-yellow-500/50">
                        FLAG
                      </span>
                      <span className="px-3 py-1 rounded-full bg-red-500/10 text-red-500 border border-red-500/50">
                        BLOCK
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-8 bg-surface/30">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4">Ready to secure your AI?</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Test AEGIS with real attack scenarios in our interactive playground or explore
              detailed analytics in the security dashboard.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/playground">
                <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white gap-2">
                  Launch Playground
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button size="lg" variant="outline" className="border-border hover:bg-surface">
                  View Analytics
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
