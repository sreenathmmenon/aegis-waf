"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Shield,
  TrendingUp,
  AlertTriangle,
  Clock,
  Activity,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";
import { AnalyticsData, ThreatLogEntry } from "@/lib/types";

export default function DashboardPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/shield/analytics');
      if (!response.ok) throw new Error('Failed to fetch analytics');
      const data = await response.json();
      setAnalytics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <Card className="border-red-500/50 bg-red-500/5">
            <CardContent className="p-6">
              <p className="text-red-500">Error loading analytics: {error}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const blockRate = (analytics.blocked / analytics.totalRequests) * 100;
  const falsePositiveRate = analytics.falsePositiveRate * 100;

  // Prepare category data for pie chart
  const categoryChartData = analytics.categoryBreakdown.map((item, index) => ({
    name: item.category.replace(/_/g, ' '),
    value: item.count,
    color: [
      '#ef4444', // red
      '#eab308', // yellow
      '#f97316', // orange
      '#a855f7', // purple
      '#3b82f6', // blue
      '#22c55e', // green
      '#ec4899', // pink
    ][index % 7]
  }));

  const toggleRow = (id: string) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  return (
    <div className="p-8 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-gradient">Security Dashboard</h1>
          <p className="text-muted-foreground">
            Real-time threat intelligence and system performance metrics
          </p>
        </div>

        {/* ROW 1: Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-surface border-border">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Requests
                  </CardTitle>
                  <Activity className="h-4 w-4 text-blue-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{analytics.totalRequests.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Last 7 days
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-surface border-border">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Threats Blocked
                  </CardTitle>
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-500">
                  {analytics.blocked.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {blockRate.toFixed(1)}% of total requests
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-surface border-border">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    False Positive Rate
                  </CardTitle>
                  <TrendingUp className={`h-4 w-4 ${falsePositiveRate < 3 ? 'text-green-500' : 'text-yellow-500'}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className={`text-3xl font-bold ${falsePositiveRate < 3 ? 'text-green-500' : 'text-yellow-500'}`}>
                  {falsePositiveRate.toFixed(2)}%
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {falsePositiveRate < 3 ? 'Excellent accuracy' : 'Within acceptable range'}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-surface border-border">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Avg Latency
                  </CardTitle>
                  <Clock className="h-4 w-4 text-blue-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-500">
                  {Math.round(analytics.avgLatencyMs)}ms
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Response time
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* ROW 2: Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Threat Timeline */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="bg-surface border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Threat Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={analytics.dailyBreakdown}>
                    <defs>
                      <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorBlocked" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.5} />
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" />
                    <XAxis
                      dataKey="date"
                      stroke="#a4a4a8"
                      tick={{ fill: '#a4a4a8', fontSize: 12 }}
                    />
                    <YAxis
                      stroke="#a4a4a8"
                      tick={{ fill: '#a4a4a8', fontSize: 12 }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#12121a',
                        border: '1px solid #1e1e2e',
                        borderRadius: '8px',
                        color: '#f5f5f5'
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="total"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorTotal)"
                      name="Total Requests"
                    />
                    <Area
                      type="monotone"
                      dataKey="blocked"
                      stroke="#ef4444"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorBlocked)"
                      name="Blocked"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Attack Category Distribution */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="bg-surface border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Attack Categories
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryChartData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${percent ? (percent * 100).toFixed(0) : 0}%`}
                      labelLine={{ stroke: '#a4a4a8' }}
                    >
                      {categoryChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#12121a',
                        border: '1px solid #1e1e2e',
                        borderRadius: '8px',
                        color: '#f5f5f5'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* ROW 3: Recent Threats Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="bg-surface border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Recent Threats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border hover:bg-transparent">
                      <TableHead className="text-muted-foreground">Time</TableHead>
                      <TableHead className="text-muted-foreground">Input</TableHead>
                      <TableHead className="text-muted-foreground">Decision</TableHead>
                      <TableHead className="text-muted-foreground">Category</TableHead>
                      <TableHead className="text-muted-foreground">Confidence</TableHead>
                      <TableHead className="text-muted-foreground">Latency</TableHead>
                      <TableHead className="text-muted-foreground"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {analytics.recentThreats.slice(0, 20).map((threat, index) => {
                      const isExpanded = expandedRow === threat.id;
                      return (
                        <>
                          <TableRow
                            key={threat.id}
                            onClick={() => toggleRow(threat.id)}
                            className={`border-border cursor-pointer transition-colors ${
                              index % 2 === 0 ? 'bg-surface/50' : 'bg-transparent'
                            } hover:bg-secondary`}
                          >
                            <TableCell className="text-xs text-muted-foreground font-mono">
                              {new Date(threat.timestamp).toLocaleTimeString()}
                            </TableCell>
                            <TableCell className="max-w-[300px]">
                              <div className="truncate text-sm">{threat.input}</div>
                            </TableCell>
                            <TableCell>
                              <Badge
                                className={
                                  threat.decision === 'BLOCK'
                                    ? 'bg-red-500/10 text-red-500 border-red-500/50'
                                    : threat.decision === 'FLAG'
                                    ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/50'
                                    : 'bg-green-500/10 text-green-500 border-green-500/50'
                                }
                              >
                                {threat.decision}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {threat.category ? (
                                <Badge variant="outline" className="text-xs">
                                  {threat.category.replace(/_/g, ' ')}
                                </Badge>
                              ) : (
                                <span className="text-muted-foreground text-xs">-</span>
                              )}
                            </TableCell>
                            <TableCell className="font-mono text-xs">
                              {(threat.confidence * 100).toFixed(0)}%
                            </TableCell>
                            <TableCell className="font-mono text-xs">
                              {Math.round(threat.latencyMs)}ms
                            </TableCell>
                            <TableCell>
                              {isExpanded ? (
                                <ChevronUp className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <ChevronDown className="h-4 w-4 text-muted-foreground" />
                              )}
                            </TableCell>
                          </TableRow>
                          {isExpanded && (
                            <TableRow className="border-border bg-secondary/50">
                              <TableCell colSpan={7} className="p-4">
                                <div className="space-y-3">
                                  <div>
                                    <span className="text-xs font-semibold text-muted-foreground">
                                      Full Input:
                                    </span>
                                    <p className="text-sm mt-1 font-mono bg-surface p-3 rounded border border-border">
                                      {threat.input}
                                    </p>
                                  </div>
                                  {threat.explanation && (
                                    <div>
                                      <span className="text-xs font-semibold text-muted-foreground">
                                        Analysis:
                                      </span>
                                      <div className="text-sm mt-1 bg-surface p-3 rounded border border-border space-y-2">
                                        <p><strong>Summary:</strong> {threat.explanation.summary}</p>
                                        <p><strong>OWASP:</strong> {threat.explanation.owaspCategory}</p>
                                        <p><strong>Recommendation:</strong> {threat.explanation.recommendation}</p>
                                      </div>
                                    </div>
                                  )}
                                  <div className="flex gap-4 text-xs text-muted-foreground">
                                    <span>ID: {threat.id}</span>
                                    {threat.ipAddress && <span>IP: {threat.ipAddress}</span>}
                                    {threat.sessionId && <span>Session: {threat.sessionId}</span>}
                                  </div>
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}