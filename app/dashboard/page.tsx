"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Shield, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const dailyData = [
  { date: "Mon", total: 1234, blocked: 89, allowed: 1145 },
  { date: "Tue", total: 1456, blocked: 112, allowed: 1344 },
  { date: "Wed", total: 1678, blocked: 145, allowed: 1533 },
  { date: "Thu", total: 1892, blocked: 178, allowed: 1714 },
  { date: "Fri", total: 2134, blocked: 234, allowed: 1900 },
  { date: "Sat", total: 987, blocked: 67, allowed: 920 },
  { date: "Sun", total: 876, blocked: 45, allowed: 831 },
];

const categoryData = [
  { category: "Direct Injection", count: 234, color: "#ef4444" },
  { category: "Jailbreak", count: 189, color: "#eab308" },
  { category: "Data Exfiltration", count: 145, color: "#f97316" },
  { category: "Encoding Attack", count: 89, color: "#a855f7" },
  { category: "Multi-turn", count: 67, color: "#3b82f6" },
];

export default function DashboardPage() {
  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Real-time security metrics and threat analysis
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">10,357</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-green-500">+12%</span> from last week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Blocked Threats</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">870</div>
              <p className="text-xs text-muted-foreground mt-1">
                8.4% block rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Avg Latency</CardTitle>
                <TrendingUp className="h-4 w-4 text-blue-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">42ms</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-green-500">-5ms</span> improvement
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Detection Rate</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">99.2%</div>
              <Progress value={99.2} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Request Volume</CardTitle>
              <CardDescription>Daily request and threat trends</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" />
                  <XAxis dataKey="date" stroke="#a4a4a8" />
                  <YAxis stroke="#a4a4a8" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#12121a',
                      border: '1px solid #1e1e2e',
                      borderRadius: '8px'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ fill: '#3b82f6', r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="blocked"
                    stroke="#ef4444"
                    strokeWidth={2}
                    dot={{ fill: '#ef4444', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Attack Categories</CardTitle>
              <CardDescription>Distribution of threat types</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#12121a',
                      border: '1px solid #1e1e2e',
                      borderRadius: '8px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recent Threats Table */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Threats</CardTitle>
            <CardDescription>Latest detected and blocked threats</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { id: "thr_001", category: "direct_injection", severity: "HIGH", time: "2 min ago" },
                { id: "thr_002", category: "jailbreak", severity: "MEDIUM", time: "5 min ago" },
                { id: "thr_003", category: "data_exfiltration", severity: "CRITICAL", time: "12 min ago" },
                { id: "thr_004", category: "encoding_obfuscation", severity: "LOW", time: "18 min ago" },
                { id: "thr_005", category: "multi_turn", severity: "MEDIUM", time: "25 min ago" },
              ].map((threat) => (
                <div key={threat.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <Badge variant="outline" className="font-mono text-xs">
                      {threat.id}
                    </Badge>
                    <span className="text-sm">{threat.category.replace('_', ' ')}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge
                      className={
                        threat.severity === 'CRITICAL' ? 'bg-red-500/10 text-red-500' :
                        threat.severity === 'HIGH' ? 'bg-orange-500/10 text-orange-500' :
                        threat.severity === 'MEDIUM' ? 'bg-yellow-500/10 text-yellow-500' :
                        'bg-blue-500/10 text-blue-500'
                      }
                    >
                      {threat.severity}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{threat.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}