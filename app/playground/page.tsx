"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Zap,
  Eye,
  Lock,
  Activity
} from "lucide-react";
import { ValidationResult } from "@/lib/types";
import attackExamples from "@/lib/data/attackExamples.json";
import legitimateExamples from "@/lib/data/legitimateExamples.json";

export default function PlaygroundPage() {
  const [input, setInput] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!input.trim()) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const response = await fetch('/api/shield/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input,
          sessionId: `playground_${Date.now()}`,
          mode: 'full'
        })
      });

      if (!response.ok) {
        throw new Error('Validation failed');
      }

      const data: ValidationResult = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleClear = () => {
    setInput("");
    setResult(null);
    setError(null);
  };

  const handlePresetClick = (payload: string) => {
    setInput(payload);
    setResult(null);
    setError(null);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'basic': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'intermediate': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'advanced': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    }
  };

  const getDecisionBanner = () => {
    if (!result) return null;

    const configs = {
      ALLOW: {
        color: 'bg-emerald-500/10 border-emerald-500/50',
        icon: CheckCircle,
        iconColor: 'text-emerald-500',
        title: 'SAFE',
        subtitle: 'No threats detected'
      },
      BLOCK: {
        color: 'bg-red-500/10 border-red-500/50',
        icon: XCircle,
        iconColor: 'text-red-500',
        title: 'BLOCKED',
        subtitle: 'Threat detected and prevented'
      },
      FLAG: {
        color: 'bg-amber-500/10 border-amber-500/50',
        icon: AlertTriangle,
        iconColor: 'text-amber-500',
        title: 'FLAGGED',
        subtitle: 'Suspicious activity detected'
      }
    };

    const config = configs[result.decision];
    const Icon = config.icon;

    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-4 rounded-lg border-2 ${config.color} mb-5`}
      >
        <div className="flex items-start gap-3">
          <Icon className={`h-6 w-6 ${config.iconColor} flex-shrink-0`} />
          <div className="flex-1">
            <h3 className={`text-[18px] font-bold ${config.iconColor} mb-1`}>
              {config.title}
            </h3>
            <p className="text-[12px] text-zinc-500 mb-2">{config.subtitle}</p>
            <div className="flex gap-3 text-[12px]">
              <div className="flex items-center gap-1 text-zinc-300">
                <Activity className="h-3.5 w-3.5" />
                <span className="font-mono">
                  {(result.confidence * 100).toFixed(0)}% confidence
                </span>
              </div>
              <div className="flex items-center gap-1 text-zinc-300">
                <Clock className="h-3.5 w-3.5" />
                <span className="font-mono">{Math.round(result.latencyMs)}ms</span>
              </div>
              {result.category && (
                <div className="flex items-center gap-1 text-zinc-300">
                  <Shield className="h-3.5 w-3.5" />
                  <span className="font-mono text-[11px]">{result.category}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  const getLayerIcon = (layerName: string) => {
    switch (layerName) {
      case 'pattern': return Shield;
      case 'intent': return Eye;
      case 'semantic': return Zap;
      default: return Lock;
    }
  };

  const getLayerName = (layerName: string) => {
    switch (layerName) {
      case 'pattern': return 'Pattern Detector';
      case 'intent': return 'Intent Classifier';
      case 'semantic': return 'Semantic Scanner';
      default: return layerName;
    }
  };

  return (
    <div style={{ paddingTop: 40, paddingBottom: 32, paddingLeft: 32, paddingRight: 32, minHeight: '100vh' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', margin: 0 }}>Attack Playground</h1>
          <p style={{ fontSize: 13, color: '#71717a', marginTop: 4 }}>
            Test the AEGIS defense system with real-time multi-layered threat analysis
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* LEFT COLUMN - Input Panel */}
          <div className="space-y-5">
            <Card className="border-[#27272a] bg-[#111113]">
              <CardHeader className="p-4 pb-0">
                <CardTitle className="flex items-center gap-2 text-[14px] text-white">
                  <Lock className="h-4 w-4" />
                  Input Analysis
                </CardTitle>
                <CardDescription className="text-[12px] text-zinc-500">
                  Type or paste a prompt to analyze for security threats
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 p-4 pt-3">
                <Textarea
                  placeholder="Type or paste a prompt to analyze..."
                  className="min-h-[200px] font-mono text-[13px] bg-[#0f0f11] border-[#27272a] focus:border-emerald-500 transition-colors text-zinc-300"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
                <div className="flex gap-2">
                  <Button
                    onClick={handleAnalyze}
                    disabled={!input.trim() || isAnalyzing}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white text-[13px] py-4"
                  >
                    {isAnalyzing ? (
                      <span className="flex items-center gap-2">
                        <div className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Analyzing...
                      </span>
                    ) : (
                      'Analyze'
                    )}
                  </Button>
                  <Button variant="outline" onClick={handleClear} className="text-[13px] py-4 border-[#27272a] bg-[#18181b] hover:bg-[#27272a] text-zinc-300">
                    Clear
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Preset Attacks */}
            <Card className="border-[#27272a] bg-[#111113]">
              <CardHeader className="p-4 pb-0">
                <CardTitle className="flex items-center gap-2 text-red-500 text-[14px]">
                  <AlertTriangle className="h-4 w-4" />
                  Preset Attacks
                </CardTitle>
                <CardDescription className="text-[12px] text-zinc-500">
                  Click to test with known attack patterns
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-3">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-2">
                  {attackExamples.slice(0, 6).map((attack) => (
                    <button
                      key={attack.id}
                      onClick={() => handlePresetClick(attack.payload)}
                      className="text-left p-3 border border-[#27272a] rounded-lg hover:bg-[#18181b] hover:border-red-500/30 transition-all group"
                    >
                      <div className="flex items-start justify-between mb-1.5">
                        <span className="font-semibold text-[12px] text-zinc-300">{attack.name}</span>
                        <Badge
                          variant="outline"
                          className={`text-[11px] ${getDifficultyColor(attack.difficulty)}`}
                        >
                          {attack.difficulty}
                        </Badge>
                      </div>
                      <p className="text-[12px] text-zinc-600 line-clamp-2 mb-1">
                        {attack.description}
                      </p>
                      <Badge variant="outline" className="text-[11px] border-[#27272a]">
                        {attack.category.replace('_', ' ')}
                      </Badge>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Legitimate Prompts */}
            <Card className="border-emerald-500/20 bg-[#111113]">
              <CardHeader className="p-4 pb-0">
                <CardTitle className="flex items-center gap-2 text-emerald-500 text-[14px]">
                  <CheckCircle className="h-4 w-4" />
                  Legitimate Prompts
                </CardTitle>
                <CardDescription className="text-[12px] text-zinc-500">
                  Verify we don't block legitimate use cases
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-3">
                <div className="grid grid-cols-1 gap-2">
                  {legitimateExamples.slice(0, 4).map((example) => (
                    <button
                      key={example.id}
                      onClick={() => handlePresetClick(example.payload)}
                      className="text-left p-3 border border-emerald-500/20 rounded-lg hover:bg-emerald-500/5 hover:border-emerald-500/40 transition-all"
                    >
                      <span className="font-semibold text-[12px] block mb-1 text-zinc-300">
                        {example.name}
                      </span>
                      <p className="text-[12px] text-zinc-600 line-clamp-2">
                        {example.payload}
                      </p>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT COLUMN - Results Panel */}
          <div>
            <Card className="sticky top-4 min-h-[600px] border-[#27272a] bg-[#111113]">
              <CardHeader className="p-4 pb-0">
                <CardTitle className="flex items-center gap-2 text-[14px] text-white">
                  <Activity className="h-4 w-4" />
                  Analysis Results
                </CardTitle>
                <CardDescription className="text-[12px] text-zinc-500">
                  Real-time threat detection and layer breakdown
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-3">
                <AnimatePresence mode="wait">
                  {isAnalyzing ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center py-16"
                    >
                      <div className="h-12 w-12 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
                      <p className="text-[14px] font-semibold text-white mb-1">Scanning...</p>
                      <p className="text-[12px] text-zinc-500">
                        Running multi-layer analysis
                      </p>
                    </motion.div>
                  ) : result ? (
                    <motion.div
                      key="results"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                    >
                      {getDecisionBanner()}

                      {/* Layer Breakdown */}
                      <div className="space-y-2 mb-5">
                        <h4 className="font-semibold text-[12px] text-zinc-300 mb-2">Defense Layers</h4>
                        {result.layers.map((layer, index) => {
                          const Icon = getLayerIcon(layer.layer);
                          const statusColor =
                            layer.status === 'PASS' ? 'text-emerald-500' :
                            layer.status === 'FAIL' ? 'text-red-500' :
                            'text-amber-500';

                          return (
                            <motion.div
                              key={layer.layer}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="p-3 border border-[#27272a] rounded-lg hover:border-[#3f3f46] transition-colors"
                            >
                              <div className="flex items-start justify-between mb-1.5">
                                <div className="flex items-center gap-2">
                                  <Icon className={`h-3.5 w-3.5 ${statusColor}`} />
                                  <span className="font-mono text-[12px] font-semibold text-zinc-300">
                                    {getLayerName(layer.layer)}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge
                                    variant="outline"
                                    className={`text-[11px] ${
                                      layer.status === 'PASS' ? 'text-emerald-500 border-emerald-500/50' :
                                      layer.status === 'FAIL' ? 'text-red-500 border-red-500/50' :
                                      'text-amber-500 border-amber-500/50'
                                    }`}
                                  >
                                    {layer.status}
                                  </Badge>
                                  <span className="text-[11px] text-zinc-600 font-mono">
                                    {layer.latencyMs.toFixed(0)}ms
                                  </span>
                                </div>
                              </div>
                              <p className="text-[12px] text-zinc-500 mb-1.5">
                                {layer.details}
                              </p>
                              <div className="flex items-center gap-2 text-[11px]">
                                <span className="text-zinc-600">Confidence:</span>
                                <div className="flex-1 bg-[#18181b] rounded-full h-1.5">
                                  <div
                                    className={`h-1.5 rounded-full transition-all ${
                                      layer.confidence > 0.7 ? 'bg-emerald-500' :
                                      layer.confidence > 0.4 ? 'bg-amber-500' :
                                      'bg-red-500'
                                    }`}
                                    style={{ width: `${layer.confidence * 100}%` }}
                                  />
                                </div>
                                <span className="font-mono text-zinc-600">
                                  {(layer.confidence * 100).toFixed(0)}%
                                </span>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>

                      {/* Explanation Card */}
                      {result.explanation && (result.decision === 'BLOCK' || result.decision === 'FLAG') && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          className={`p-3 border-l-4 rounded-lg ${
                            result.decision === 'BLOCK'
                              ? 'border-red-500 bg-red-500/5'
                              : 'border-amber-500 bg-amber-500/5'
                          }`}
                        >
                          <h4 className="font-semibold text-[13px] text-white mb-2 flex items-center gap-2">
                            <Shield className="h-3.5 w-3.5" />
                            Security Analysis
                          </h4>
                          <div className="space-y-2 text-[12px]">
                            <div>
                              <span className="text-zinc-500 font-semibold">Summary: </span>
                              <span className="text-zinc-300">{result.explanation.summary}</span>
                            </div>
                            <div>
                              <span className="text-zinc-500 font-semibold">OWASP: </span>
                              <span className="font-mono text-[11px] text-zinc-300">{result.explanation.owaspCategory}</span>
                            </div>
                            <div>
                              <span className="text-zinc-500 font-semibold">Technical Detail: </span>
                              <p className="text-[11px] mt-1 text-zinc-400">{result.explanation.technicalDetail}</p>
                            </div>
                            {result.explanation.evidence.length > 0 && (
                              <div>
                                <span className="text-zinc-500 font-semibold">Evidence:</span>
                                <ul className="list-disc list-inside text-[11px] mt-1 space-y-0.5 text-zinc-400">
                                  {result.explanation.evidence.map((item, i) => (
                                    <li key={i}>{item}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            <div className="pt-2 border-t border-[#27272a]">
                              <span className="text-zinc-500 font-semibold">Recommendation: </span>
                              <p className="text-[11px] mt-1 text-zinc-400">{result.explanation.recommendation}</p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center py-16 text-center"
                    >
                      <Shield className="h-12 w-12 text-zinc-600 mb-4" />
                      <p className="text-[14px] font-semibold text-white mb-1">Ready to Analyze</p>
                      <p className="text-[12px] text-zinc-500 max-w-xs">
                        Submit a prompt to see real-time threat analysis from all defense layers
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 p-3 bg-red-500/10 border border-red-500/50 rounded-lg"
                  >
                    <p className="text-red-500 text-[12px]">{error}</p>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
