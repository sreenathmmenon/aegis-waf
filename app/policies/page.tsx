"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import {
  Shield,
  Brain,
  Lock,
  Activity,
  Settings,
  Save,
  RotateCcw,
  AlertCircle,
  CheckCircle2,
  Eye
} from "lucide-react";

export default function PoliciesPage() {
  // Defense layer toggles
  const [patternEnabled, setPatternEnabled] = useState(true);
  const [intentEnabled, setIntentEnabled] = useState(true);
  const [semanticEnabled, setSemanticEnabled] = useState(true);
  const [behaviorEnabled, setBehaviorEnabled] = useState(true);

  // Threshold sliders
  const [patternThreshold, setPatternThreshold] = useState([80]);
  const [intentThreshold, setIntentThreshold] = useState([70]);
  const [semanticThreshold, setSemanticThreshold] = useState([85]);
  const [behaviorThreshold, setBehaviorThreshold] = useState([80]);

  // Blocklist and allowlist
  const [blocklist, setBlocklist] = useState(
    `ignore previous instructions\nforget everything\nyou are now DAN\nrepeat after me`
  );
  const [allowlist, setAllowlist] = useState(
    `system health check\ninternal monitoring\nlegitimate test query`
  );

  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");

  const handleSave = () => {
    setSaveStatus("saving");
    // Simulate save operation
    setTimeout(() => {
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2000);
    }, 1000);
  };

  const handleReset = () => {
    setPatternEnabled(true);
    setIntentEnabled(true);
    setSemanticEnabled(true);
    setBehaviorEnabled(true);
    setPatternThreshold([80]);
    setIntentThreshold([70]);
    setSemanticThreshold([85]);
    setBehaviorThreshold([80]);
  };

  return (
    <div style={{ paddingTop: 40, paddingBottom: 32, paddingLeft: 32, paddingRight: 32, minHeight: '100vh' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', margin: 0 }}>Security Policies</h1>
          <p style={{ fontSize: 13, color: '#71717a', marginTop: 4 }}>
            Configure defense layers, thresholds, and custom rules for your AI firewall
          </p>
        </div>

        {/* Info Banner */}
        <Card className="bg-blue-500/5 border-blue-500/50 mb-8">
          <CardContent className="p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
            <div className="text-sm text-zinc-300">
              <strong className="text-white">Demo Mode:</strong> Configuration changes are
              visual only and will not persist. In production, these settings would be stored
              in your security policy database.
            </div>
          </CardContent>
        </Card>

        {/* Defense Layers Configuration */}
        <Card className="bg-[#111113] border-[#27272a] mb-8">
          <CardHeader className="p-4">
            <CardTitle className="flex items-center gap-2 text-base">
              <Shield className="h-5 w-5" />
              Defense Layers
            </CardTitle>
            <CardDescription className="text-zinc-500">
              Enable or disable individual security layers. Disabled layers will be skipped
              during validation.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 p-4 pt-0">
            {/* Pattern Detection */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-[#18181b] border border-[#27272a]">
              <div className="flex items-start gap-4 flex-1">
                <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <Eye className="h-5 w-5 text-emerald-500" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-white">Pattern Detection</h3>
                    <Badge variant="outline" className="text-xs">Regex-based</Badge>
                  </div>
                  <p className="text-sm text-zinc-500">
                    Zero-latency detection of known attack patterns using regex rules
                  </p>
                </div>
              </div>
              <Switch checked={patternEnabled} onCheckedChange={setPatternEnabled} />
            </div>

            {/* Intent Classification */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-[#18181b] border border-[#27272a]">
              <div className="flex items-start gap-4 flex-1">
                <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Brain className="h-5 w-5 text-blue-500" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-white">Intent Classification</h3>
                    <Badge variant="outline" className="text-xs">AI-powered</Badge>
                  </div>
                  <p className="text-sm text-zinc-500">
                    AI analysis to detect hidden malicious intent and adversarial goals
                  </p>
                </div>
              </div>
              <Switch checked={intentEnabled} onCheckedChange={setIntentEnabled} />
            </div>

            {/* Semantic Scanning */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-[#18181b] border border-[#27272a]">
              <div className="flex items-start gap-4 flex-1">
                <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <Lock className="h-5 w-5 text-purple-500" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-white">Semantic Guard</h3>
                    <Badge variant="outline" className="text-xs">Similarity-based</Badge>
                  </div>
                  <p className="text-sm text-zinc-500">
                    Similarity matching against known attack database to catch variants
                  </p>
                </div>
              </div>
              <Switch checked={semanticEnabled} onCheckedChange={setSemanticEnabled} />
            </div>

            {/* Behavior Monitor */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-[#18181b] border border-[#27272a]">
              <div className="flex items-start gap-4 flex-1">
                <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <Activity className="h-5 w-5 text-amber-500" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-white">Behavior Monitor</h3>
                    <Badge variant="outline" className="text-xs">Session-based</Badge>
                  </div>
                  <p className="text-sm text-zinc-500">
                    Track session behavior and detect repeated probing attempts
                  </p>
                </div>
              </div>
              <Switch checked={behaviorEnabled} onCheckedChange={setBehaviorEnabled} />
            </div>
          </CardContent>
        </Card>

        {/* Threat Thresholds */}
        <Card className="bg-[#111113] border-[#27272a] mb-8">
          <CardHeader className="p-4">
            <CardTitle className="flex items-center gap-2 text-base">
              <Settings className="h-5 w-5" />
              Detection Thresholds
            </CardTitle>
            <CardDescription className="text-zinc-500">
              Adjust confidence thresholds for blocking decisions. Higher values reduce false
              positives but may miss some threats.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 p-4 pt-0">
            {/* Pattern Threshold */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-white">Pattern Detection Threshold</label>
                  <p className="text-sm text-zinc-500">
                    Minimum confidence to block based on pattern matching
                  </p>
                </div>
                <Badge variant="outline" className="font-mono">
                  {patternThreshold[0]}%
                </Badge>
              </div>
              <Slider
                value={patternThreshold}
                onValueChange={setPatternThreshold}
                min={0}
                max={100}
                step={5}
                disabled={!patternEnabled}
                className="w-full"
              />
            </div>

            <Separator />

            {/* Intent Threshold */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-white">Intent Classification Threshold</label>
                  <p className="text-sm text-zinc-500">
                    Minimum confidence to block based on AI intent analysis
                  </p>
                </div>
                <Badge variant="outline" className="font-mono">
                  {intentThreshold[0]}%
                </Badge>
              </div>
              <Slider
                value={intentThreshold}
                onValueChange={setIntentThreshold}
                min={0}
                max={100}
                step={5}
                disabled={!intentEnabled}
                className="w-full"
              />
            </div>

            <Separator />

            {/* Semantic Threshold */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-white">Semantic Similarity Threshold</label>
                  <p className="text-sm text-zinc-500">
                    Minimum similarity to known attacks for blocking
                  </p>
                </div>
                <Badge variant="outline" className="font-mono">
                  {semanticThreshold[0]}%
                </Badge>
              </div>
              <Slider
                value={semanticThreshold}
                onValueChange={setSemanticThreshold}
                min={0}
                max={100}
                step={5}
                disabled={!semanticEnabled}
                className="w-full"
              />
            </div>

            <Separator />

            {/* Behavior Threshold */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-white">Behavior Risk Threshold</label>
                  <p className="text-sm text-zinc-500">
                    Session risk score threshold for escalating FLAG to BLOCK
                  </p>
                </div>
                <Badge variant="outline" className="font-mono">
                  {behaviorThreshold[0]}%
                </Badge>
              </div>
              <Slider
                value={behaviorThreshold}
                onValueChange={setBehaviorThreshold}
                min={0}
                max={100}
                step={5}
                disabled={!behaviorEnabled}
                className="w-full"
              />
            </div>
          </CardContent>
        </Card>

        {/* Custom Rules */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Blocklist */}
          <Card className="bg-[#111113] border-[#27272a]">
            <CardHeader className="p-4">
              <CardTitle className="flex items-center gap-2 text-base">
                <AlertCircle className="h-5 w-5 text-red-500" />
                Blocklist Patterns
              </CardTitle>
              <CardDescription className="text-zinc-500">
                Custom phrases to always block (one per line)
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <Textarea
                value={blocklist}
                onChange={(e) => setBlocklist(e.target.value)}
                placeholder="Enter phrases to block, one per line..."
                className="font-mono text-[13px] min-h-[200px] bg-[#09090b]"
              />
              <p className="text-xs text-zinc-600 mt-2">
                {blocklist.split("\n").filter((line) => line.trim()).length} patterns defined
              </p>
            </CardContent>
          </Card>

          {/* Allowlist */}
          <Card className="bg-[#111113] border-[#27272a]">
            <CardHeader className="p-4">
              <CardTitle className="flex items-center gap-2 text-base">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                Allowlist Patterns
              </CardTitle>
              <CardDescription className="text-zinc-500">
                Known-safe phrases to always allow (one per line)
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <Textarea
                value={allowlist}
                onChange={(e) => setAllowlist(e.target.value)}
                placeholder="Enter safe phrases, one per line..."
                className="font-mono text-[13px] min-h-[200px] bg-[#09090b]"
              />
              <p className="text-xs text-zinc-600 mt-2">
                {allowlist.split("\n").filter((line) => line.trim()).length} patterns defined
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-4">
          <Button variant="outline" onClick={handleReset} className="gap-2 border-[#27272a] bg-[#18181b]">
            <RotateCcw className="h-4 w-4" />
            Reset to Defaults
          </Button>
          <Button
            onClick={handleSave}
            disabled={saveStatus === "saving"}
            className="gap-2 bg-emerald-600 hover:bg-emerald-700"
          >
            {saveStatus === "saving" ? (
              <>
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : saveStatus === "saved" ? (
              <>
                <CheckCircle2 className="h-4 w-4" />
                Saved!
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Configuration
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
