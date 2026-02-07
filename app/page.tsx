"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Shield, Zap, Bell } from "lucide-react";

export default function LandingPage() {
  return (
    <div>
      {/* Hero */}
      <section style={{ paddingTop: "12vh", paddingBottom: "10vh" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingLeft: 32, paddingRight: 32 }}>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            style={{ fontSize: "clamp(36px, 5vw, 64px)", fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.04em", color: "#fff", textAlign: "center" }}
          >
            Stop Prompt Injection
            <br />
            <span className="text-gradient">Before It Reaches Your AI</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.12 }}
            style={{ marginTop: 32, fontSize: 18, lineHeight: 1.7, color: "#a1a1aa", textAlign: "center", maxWidth: 520 }}
          >
            Real-time firewall that protects LLM applications from malicious prompts, data leaks, and adversarial attacks.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.24 }}
            style={{ marginTop: 48, display: "flex", alignItems: "center", justifyContent: "center", gap: 16, flexWrap: "wrap" as const }}
          >
            <Link href="/demo">
              <span
                className="inline-flex items-center justify-center font-semibold text-black bg-white hover:bg-[#e4e4e7] transition-colors cursor-pointer"
                style={{
                  height: 52,
                  paddingLeft: 32,
                  paddingRight: 32,
                  borderRadius: 10,
                  fontSize: 16,
                  gap: 8,
                }}
              >
                Try Live Demo
                <ArrowRight style={{ width: 18, height: 18 }} />
              </span>
            </Link>
            <Link href="/dashboard">
              <span
                className="inline-flex items-center justify-center font-medium text-[#a1a1aa] hover:text-white border border-[#2e2e3e] hover:border-[#52525b] bg-transparent hover:bg-white/[0.03] transition-colors cursor-pointer"
                style={{
                  height: 52,
                  paddingLeft: 32,
                  paddingRight: 32,
                  borderRadius: 10,
                  fontSize: 16,
                }}
              >
                View Dashboard
              </span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ paddingTop: 80, paddingBottom: 80, paddingLeft: 32, paddingRight: 32 }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 48, textAlign: "center" }}
          >
            {[
              { value: "<500ms", label: "Response Time" },
              { value: "5 Layers", label: "Defense System" },
              { value: "24/7", label: "Real-time Protection" },
            ].map((stat) => (
              <div key={stat.label}>
                <div
                  style={{ fontSize: "clamp(28px, 3vw, 44px)", lineHeight: 1, fontWeight: 700, color: "#fff", letterSpacing: "-0.02em" }}
                >
                  {stat.value}
                </div>
                <div style={{ fontSize: 16, marginTop: 10, color: "#71717a" }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Divider */}
      <div style={{ maxWidth: 960, margin: "0 auto", paddingLeft: 32, paddingRight: 32 }}>
        <div style={{ borderTop: "1px solid #1e1e24" }} />
      </div>

      {/* How it works */}
      <section style={{ paddingTop: 100, paddingBottom: 100, paddingLeft: 32, paddingRight: 32 }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
            style={{ textAlign: "center", marginBottom: 80 }}
          >
            <h2
              style={{ fontSize: "clamp(28px, 3vw, 44px)", fontWeight: 700, color: "#fff", letterSpacing: "-0.03em" }}
            >
              How It Works
            </h2>
            <p style={{ fontSize: 18, marginTop: 16, maxWidth: 440, color: "#71717a", margin: "16px auto 0" }}>
              Three steps. Every request. Under 500 milliseconds.
            </p>
          </motion.div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 56 }}>
            {[
              {
                icon: Shield,
                title: "Detect",
                desc: "Five parallel defense layers scan every prompt for injection patterns, role hijacking, and data extraction attempts.",
              },
              {
                icon: Zap,
                title: "Block",
                desc: "Malicious requests are stopped before they reach your LLM. Clean requests pass through with zero added latency.",
              },
              {
                icon: Bell,
                title: "Alert",
                desc: "Every decision is logged with full explainability. Get real-time alerts via Slack, webhook, or the dashboard.",
              },
            ].map((card, i) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.45, delay: i * 0.1 }}
                  style={{ textAlign: "center" }}
                >
                  <div
                    style={{ width: 56, height: 56, borderRadius: 16, marginBottom: 24, margin: "0 auto 24px", display: "flex", alignItems: "center", justifyContent: "center", background: "#12121a", border: "1px solid #2e2e3e" }}
                  >
                    <Icon style={{ width: 24, height: 24, color: "#34d399" }} />
                  </div>
                  <h3 style={{ fontSize: 20, marginBottom: 10, fontWeight: 600, color: "#fff" }}>
                    {card.title}
                  </h3>
                  <p style={{ fontSize: 16, color: "#71717a", lineHeight: 1.65 }}>
                    {card.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ paddingTop: 60, paddingBottom: 120, paddingLeft: 32, paddingRight: 32 }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5 }}
            style={{ textAlign: "center", border: "1px solid #2e2e3e", background: "#12121a", borderRadius: 20, padding: "72px 40px" }}
          >
            <h2
              style={{ fontSize: "clamp(26px, 2.8vw, 40px)", fontWeight: 700, color: "#fff", letterSpacing: "-0.03em" }}
            >
              Ready to Protect Your AI?
            </h2>
            <p style={{ fontSize: 17, marginTop: 14, maxWidth: 420, color: "#71717a", margin: "14px auto 0" }}>
              Test with real attack payloads or explore the interactive security dashboard.
            </p>
            <div style={{ marginTop: 40 }}>
              <Link href="/demo">
                <span
                  className="inline-flex items-center justify-center font-semibold text-black bg-white hover:bg-[#e4e4e7] transition-colors cursor-pointer"
                  style={{
                    height: 52,
                    paddingLeft: 32,
                    paddingRight: 32,
                    borderRadius: 10,
                    fontSize: 16,
                    gap: 8,
                  }}
                >
                  Get Started
                  <ArrowRight style={{ width: 18, height: 18 }} />
                </span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
