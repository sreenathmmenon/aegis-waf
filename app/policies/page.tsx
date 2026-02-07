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
    <div className="p-8 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-gradient">Security Policies</h1>
          <p className="text-muted-foreground">
            Configure defense layers, thresholds, and custom rules for your AI firewall
          </p>
        </div>

        {/* Info Banner */}
        <Card className="bg-blue-500/5 border-blue-500/50 mb-6">
          <CardContent className="p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
            <div className="text-sm text-muted-foreground">
              <strong className="text-foreground">Demo Mode:</strong> Configuration changes are
              visual only and will not persist. In production, these settings would be stored
              in your security policy database.
            </div>
          </CardContent>
        </Card>

        {/* Defense Layers Configuration */}
        <Card className="bg-surface border-border mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Defense Layers
            </CardTitle>
            <CardDescription>
              Enable or disable individual security layers. Disabled layers will be skipped
              during validation.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Pattern Detection */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-surface/50 border border-border">
              <div className="flex items-start gap-4 flex-1">
                <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <Eye className="h-5 w-5 text-green-500" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">Pattern Detection</h3>
                    <Badge variant="outline" className="text-xs">Regex-based</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Zero-latency detection of known attack patterns using regex rules
                  </p>
                </div>
              </div>
              <Switch checked={patternEnabled} onCheckedChange={setPatternEnabled} />
            </div>

            {/* Intent Classification */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-surface/50 border border-border">
              <div className="flex items-start gap-4 flex-1">
                <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Brain className="h-5 w-5 text-blue-500" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">Intent Classification</h3>
                    <Badge variant="outline" className="text-xs">AI-powered</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    AI analysis to detect hidden malicious intent and adversarial goals
                  </p>
                </div>
              </div>
              <Switch checked={intentEnabled} onCheckedChange={setIntentEnabled} />
            </div>

            {/* Semantic Scanning */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-surface/50 border border-border">
              <div className="flex items-start gap-4 flex-1">
                <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <Lock className="h-5 w-5 text-purple-500" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">Semantic Guard</h3>
                    <Badge variant="outline" className="text-xs">Similarity-based</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Similarity matching against known attack database to catch variants
                  </p>
                </div>
              </div>
              <Switch checked={semanticEnabled} onCheckedChange={setSemanticEnabled} />
            </div>

            {/* Behavior Monitor */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-surface/50 border border-border">
              <div className="flex items-start gap-4 flex-1">
                <div className="h-10 w-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                  <Activity className="h-5 w-5 text-yellow-500" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">Behavior Monitor</h3>
                    <Badge variant="outline" className="text-xs">Session-based</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Track session behavior and detect repeated probing attempts
                  </p>
                </div>
              </div>
              <Switch checked={behaviorEnabled} onCheckedChange={setBehaviorEnabled} />
            </div>
          </CardContent>
        </Card>

        {/* Threat Thresholds */}
        <Card className="bg-surface border-border mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Detection Thresholds
            </CardTitle>
            <CardDescription>
              Adjust confidence thresholds for blocking decisions. Higher values reduce false
              positives but may miss some threats.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Pattern Threshold */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <label className="font-medium">Pattern Detection Threshold</label>
                  <p className="text-sm text-muted-foreground">
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
                  <label className="font-medium">Intent Classification Threshold</label>
                  <p className="text-sm text-muted-foreground">
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
                  <label className="font-medium">Semantic Similarity Threshold</label>
                  <p className="text-sm text-muted-foreground">
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
                  <label className="font-medium">Behavior Risk Threshold</label>
                  <p className="text-sm text-muted-foreground">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Blocklist */}
          <Card className="bg-surface border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <AlertCircle className="h-5 w-5 text-red-500" />
                Blocklist Patterns
              </CardTitle>
              <CardDescription>
                Custom phrases to always block (one per line)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={blocklist}
                onChange={(e) => setBlocklist(e.target.value)}
                placeholder="Enter phrases to block, one per line..."
                className="font-mono text-sm min-h-[200px] bg-background"
              />
              <p className="text-xs text-muted-foreground mt-2">
                {blocklist.split("\n").filter((line) => line.trim()).length} patterns defined
              </p>
            </CardContent>
          </Card>

          {/* Allowlist */}
          <Card className="bg-surface border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                Allowlist Patterns
              </CardTitle>
              <CardDescription>
                Known-safe phrases to always allow (one per line)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={allowlist}
                onChange={(e) => setAllowlist(e.target.value)}
                placeholder="Enter safe phrases, one per line..."
                className="font-mono text-sm min-h-[200px] bg-background"
              />
              <p className="text-xs text-muted-foreground mt-2">
                {allowlist.split("\n").filter((line) => line.trim()).length} patterns defined
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-4">
          <Button variant="outline" onClick={handleReset} className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Reset to Defaults
          </Button>
          <Button
            onClick={handleSave}
            disabled={saveStatus === "saving"}
            className="gap-2 bg-green-600 hover:bg-green-700"
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
