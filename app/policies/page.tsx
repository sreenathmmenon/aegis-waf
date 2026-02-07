"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Shield, AlertTriangle, Settings, Plus, Save, RefreshCw } from "lucide-react";

export default function PoliciesPage() {
  const [thresholds, setThresholds] = useState({
    confidence: 0.85,
    latency: 100,
    blockRate: 0.1
  });

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Policies</h1>
          <p className="text-muted-foreground">
            Configure firewall behavior and security policies
          </p>
        </div>

        <Tabs defaultValue="general" className="w-full">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="patterns">Pattern Rules</TabsTrigger>
            <TabsTrigger value="thresholds">Thresholds</TabsTrigger>
            <TabsTrigger value="allowlist">Allowlist</TabsTrigger>
            <TabsTrigger value="blocklist">Blocklist</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Defense Configuration</CardTitle>
                <CardDescription>
                  Configure which defense layers are active
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-green-500" />
                    <div>
                      <div className="font-semibold">Pattern Detection</div>
                      <div className="text-sm text-muted-foreground">
                        Regex-based pattern matching
                      </div>
                    </div>
                  </div>
                  <Badge className="bg-green-500/10 text-green-500">
                    ENABLED
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-blue-500" />
                    <div>
                      <div className="font-semibold">Intent Classification</div>
                      <div className="text-sm text-muted-foreground">
                        AI-powered intent analysis
                      </div>
                    </div>
                  </div>
                  <Badge className="bg-green-500/10 text-green-500">
                    ENABLED
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-purple-500" />
                    <div>
                      <div className="font-semibold">Semantic Analysis</div>
                      <div className="text-sm text-muted-foreground">
                        Embedding-based similarity detection
                      </div>
                    </div>
                  </div>
                  <Badge className="bg-green-500/10 text-green-500">
                    ENABLED
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Default Actions</CardTitle>
                <CardDescription>
                  Configure default behavior for different threat levels
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Critical Threats</label>
                    <Select defaultValue="block">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="block">Block</SelectItem>
                        <SelectItem value="flag">Flag</SelectItem>
                        <SelectItem value="allow">Allow</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">High Threats</label>
                    <Select defaultValue="block">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="block">Block</SelectItem>
                        <SelectItem value="flag">Flag</SelectItem>
                        <SelectItem value="allow">Allow</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Medium Threats</label>
                    <Select defaultValue="flag">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="block">Block</SelectItem>
                        <SelectItem value="flag">Flag</SelectItem>
                        <SelectItem value="allow">Allow</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Low Threats</label>
                    <Select defaultValue="allow">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="block">Block</SelectItem>
                        <SelectItem value="flag">Flag</SelectItem>
                        <SelectItem value="allow">Allow</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="patterns" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Pattern Rules</CardTitle>
                    <CardDescription>
                      Define custom regex patterns for threat detection
                    </CardDescription>
                  </div>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Pattern
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    name: "Direct Injection Pattern",
                    pattern: "/ignore.*previous.*instructions/i",
                    severity: "HIGH",
                    enabled: true
                  },
                  {
                    name: "Jailbreak Attempt",
                    pattern: "/pretend.*you.*are|act.*as.*if/i",
                    severity: "MEDIUM",
                    enabled: true
                  },
                  {
                    name: "Data Exfiltration",
                    pattern: "/repeat.*everything.*above|show.*system.*prompt/i",
                    severity: "CRITICAL",
                    enabled: true
                  }
                ].map((rule, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="font-semibold">{rule.name}</div>
                      <code className="text-xs text-muted-foreground">{rule.pattern}</code>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge
                        variant="outline"
                        className={
                          rule.severity === 'CRITICAL' ? 'text-red-500' :
                          rule.severity === 'HIGH' ? 'text-orange-500' :
                          'text-yellow-500'
                        }
                      >
                        {rule.severity}
                      </Badge>
                      <Badge className={rule.enabled ? 'bg-green-500/10 text-green-500' : 'bg-gray-500/10 text-gray-500'}>
                        {rule.enabled ? 'ENABLED' : 'DISABLED'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="thresholds" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Thresholds</CardTitle>
                <CardDescription>
                  Set limits and thresholds for various metrics
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Minimum Confidence for Block: {(thresholds.confidence * 100).toFixed(0)}%
                  </label>
                  <Input
                    type="range"
                    min="0"
                    max="100"
                    value={thresholds.confidence * 100}
                    onChange={(e) => setThresholds({...thresholds, confidence: Number(e.target.value) / 100})}
                    className="w-full"
                  />
                </div>

                <Separator />

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Maximum Acceptable Latency: {thresholds.latency}ms
                  </label>
                  <Input
                    type="range"
                    min="10"
                    max="500"
                    value={thresholds.latency}
                    onChange={(e) => setThresholds({...thresholds, latency: Number(e.target.value)})}
                    className="w-full"
                  />
                </div>

                <Separator />

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Alert if Block Rate Exceeds: {(thresholds.blockRate * 100).toFixed(0)}%
                  </label>
                  <Input
                    type="range"
                    min="0"
                    max="50"
                    value={thresholds.blockRate * 100}
                    onChange={(e) => setThresholds({...thresholds, blockRate: Number(e.target.value) / 100})}
                    className="w-full"
                  />
                </div>

                <div className="flex gap-2">
                  <Button>
                    <Save className="h-4 w-4 mr-2" />
                    Save Thresholds
                  </Button>
                  <Button variant="outline">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reset to Defaults
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="allowlist" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Allowlist</CardTitle>
                    <CardDescription>
                      IP addresses and patterns that bypass security checks
                    </CardDescription>
                  </div>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Entry
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <code className="text-sm">192.168.1.0/24</code>
                    <div className="flex gap-2">
                      <Badge variant="outline">Internal Network</Badge>
                      <Button variant="ghost" size="sm">Remove</Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <code className="text-sm">10.0.0.0/8</code>
                    <div className="flex gap-2">
                      <Badge variant="outline">VPN Range</Badge>
                      <Button variant="ghost" size="sm">Remove</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="blocklist" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Blocklist</CardTitle>
                    <CardDescription>
                      IP addresses and patterns that are always blocked
                    </CardDescription>
                  </div>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Entry
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <code className="text-sm">203.0.113.42</code>
                    <div className="flex gap-2">
                      <Badge variant="outline" className="text-red-500">Known Attacker</Badge>
                      <Button variant="ghost" size="sm">Remove</Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <code className="text-sm">198.51.100.0/24</code>
                    <div className="flex gap-2">
                      <Badge variant="outline" className="text-red-500">Suspicious Range</Badge>
                      <Button variant="ghost" size="sm">Remove</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}