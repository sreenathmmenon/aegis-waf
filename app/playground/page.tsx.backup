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
      case 'basic': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'intermediate': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'advanced': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    }
  };

  const getDecisionBanner = () => {
    if (!result) return null;

    const configs = {
      ALLOW: {
        color: 'bg-green-500/10 border-green-500/50',
        icon: CheckCircle,
        iconColor: 'text-green-500',
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
        color: 'bg-yellow-500/10 border-yellow-500/50',
        icon: AlertTriangle,
        iconColor: 'text-yellow-500',
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
        className={`p-6 rounded-lg border-2 ${config.color} mb-6`}
      >
        <div className="flex items-start gap-4">
          <Icon className={`h-8 w-8 ${config.iconColor} flex-shrink-0`} />
          <div className="flex-1">
            <h3 className={`text-2xl font-bold ${config.iconColor} mb-1`}>
              {config.title}
            </h3>
            <p className="text-muted-foreground mb-3">{config.subtitle}</p>
            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Activity className="h-4 w-4" />
                <span className="font-mono">
                  {(result.confidence * 100).toFixed(0)}% confidence
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span className="font-mono">{Math.round(result.latencyMs)}ms</span>
              </div>
              {result.category && (
                <div className="flex items-center gap-1">
                  <Shield className="h-4 w-4" />
                  <span className="font-mono text-xs">{result.category}</span>
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
    <div className="p-8 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-gradient">Attack Playground</h1>
          <p className="text-muted-foreground">
            Test the AEGIS defense system with real-time multi-layered threat analysis
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* LEFT COLUMN - Input Panel */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Input Analysis
                </CardTitle>
                <CardDescription>
                  Type or paste a prompt to analyze for security threats
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Type or paste a prompt to analyze..."
                  className="min-h-[200px] font-mono bg-surface border-border focus:border-green-500 transition-colors"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
                <div className="flex gap-2">
                  <Button
                    onClick={handleAnalyze}
                    disabled={!input.trim() || isAnalyzing}
                    className="flex-1 bg-green-500 hover:bg-green-600"
                  >
                    {isAnalyzing ? (
                      <span className="flex items-center gap-2">
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Analyzing...
                      </span>
                    ) : (
                      'Analyze'
                    )}
                  </Button>
                  <Button variant="outline" onClick={handleClear}>
                    Clear
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Preset Attacks */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-500">
                  <AlertTriangle className="h-5 w-5" />
                  Preset Attacks
                </CardTitle>
                <CardDescription>
                  Click to test with known attack patterns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-3">
                  {attackExamples.slice(0, 6).map((attack) => (
                    <button
                      key={attack.id}
                      onClick={() => handlePresetClick(attack.payload)}
                      className="text-left p-3 border border-border rounded-lg hover:bg-secondary hover:border-red-500/30 transition-all group"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <span className="font-semibold text-sm">{attack.name}</span>
                        <Badge
                          variant="outline"
                          className={`text-xs ${getDifficultyColor(attack.difficulty)}`}
                        >
                          {attack.difficulty}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-1">
                        {attack.description}
                      </p>
                      <Badge variant="outline" className="text-xs">
                        {attack.category.replace('_', ' ')}
                      </Badge>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Legitimate Prompts */}
            <Card className="border-green-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-500">
                  <CheckCircle className="h-5 w-5" />
                  Legitimate Prompts
                </CardTitle>
                <CardDescription>
                  Verify we don't block legitimate use cases
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-3">
                  {legitimateExamples.slice(0, 4).map((example) => (
                    <button
                      key={example.id}
                      onClick={() => handlePresetClick(example.payload)}
                      className="text-left p-3 border border-green-500/20 rounded-lg hover:bg-green-500/5 hover:border-green-500/40 transition-all"
                    >
                      <span className="font-semibold text-sm block mb-1">
                        {example.name}
                      </span>
                      <p className="text-xs text-muted-foreground line-clamp-2">
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
            <Card className="sticky top-4 min-h-[600px]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Analysis Results
                </CardTitle>
                <CardDescription>
                  Real-time threat detection and layer breakdown
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AnimatePresence mode="wait">
                  {isAnalyzing ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center py-20"
                    >
                      <div className="h-16 w-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-4" />
                      <p className="text-lg font-semibold mb-2">Scanning...</p>
                      <p className="text-sm text-muted-foreground">
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
                      <div className="space-y-3 mb-6">
                        <h4 className="font-semibold text-sm mb-3">Defense Layers</h4>
                        {result.layers.map((layer, index) => {
                          const Icon = getLayerIcon(layer.layer);
                          const statusColor =
                            layer.status === 'PASS' ? 'text-green-500' :
                            layer.status === 'FAIL' ? 'text-red-500' :
                            'text-yellow-500';

                          return (
                            <motion.div
                              key={layer.layer}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="p-4 border border-border rounded-lg hover:border-green-500/30 transition-colors"
                            >
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <Icon className={`h-4 w-4 ${statusColor}`} />
                                  <span className="font-mono text-sm font-semibold">
                                    {getLayerName(layer.layer)}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge
                                    variant="outline"
                                    className={
                                      layer.status === 'PASS' ? 'text-green-500 border-green-500/50' :
                                      layer.status === 'FAIL' ? 'text-red-500 border-red-500/50' :
                                      'text-yellow-500 border-yellow-500/50'
                                    }
                                  >
                                    {layer.status}
                                  </Badge>
                                  <span className="text-xs text-muted-foreground font-mono">
                                    {layer.latencyMs.toFixed(0)}ms
                                  </span>
                                </div>
                              </div>
                              <p className="text-xs text-muted-foreground mb-2">
                                {layer.details}
                              </p>
                              <div className="flex items-center gap-2 text-xs">
                                <span className="text-muted-foreground">Confidence:</span>
                                <div className="flex-1 bg-surface rounded-full h-2">
                                  <div
                                    className={`h-2 rounded-full transition-all ${
                                      layer.confidence > 0.7 ? 'bg-green-500' :
                                      layer.confidence > 0.4 ? 'bg-yellow-500' :
                                      'bg-red-500'
                                    }`}
                                    style={{ width: `${layer.confidence * 100}%` }}
                                  />
                                </div>
                                <span className="font-mono text-muted-foreground">
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
                          className={`p-4 border-l-4 rounded-lg ${
                            result.decision === 'BLOCK'
                              ? 'border-red-500 bg-red-500/5'
                              : 'border-yellow-500 bg-yellow-500/5'
                          }`}
                        >
                          <h4 className="font-semibold mb-2 flex items-center gap-2">
                            <Shield className="h-4 w-4" />
                            Security Analysis
                          </h4>
                          <div className="space-y-3 text-sm">
                            <div>
                              <span className="text-muted-foreground font-semibold">Summary: </span>
                              <span>{result.explanation.summary}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground font-semibold">OWASP: </span>
                              <span className="font-mono text-xs">{result.explanation.owaspCategory}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground font-semibold">Technical Detail: </span>
                              <p className="text-xs mt-1">{result.explanation.technicalDetail}</p>
                            </div>
                            {result.explanation.evidence.length > 0 && (
                              <div>
                                <span className="text-muted-foreground font-semibold">Evidence:</span>
                                <ul className="list-disc list-inside text-xs mt-1 space-y-1">
                                  {result.explanation.evidence.map((item, i) => (
                                    <li key={i}>{item}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            <div className="pt-2 border-t border-border">
                              <span className="text-muted-foreground font-semibold">Recommendation: </span>
                              <p className="text-xs mt-1">{result.explanation.recommendation}</p>
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
                      className="flex flex-col items-center justify-center py-20 text-center"
                    >
                      <Shield className="h-16 w-16 text-muted-foreground/50 mb-4" />
                      <p className="text-lg font-semibold mb-2">Ready to Analyze</p>
                      <p className="text-sm text-muted-foreground max-w-xs">
                        Submit a prompt to see real-time threat analysis from all defense layers
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 bg-red-500/10 border border-red-500/50 rounded-lg"
                  >
                    <p className="text-red-500 text-sm">{error}</p>
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