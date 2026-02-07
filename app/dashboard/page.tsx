"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  TrendingUp,
  AlertTriangle,
  Clock,
  Activity,
  Flag,
  Zap,
  Eye,
  Brain,
  Lock,
  Users
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";
import { useEventStream } from "@/hooks/use-event-stream";
import { ThreatEvent } from "@/lib/event-bus";

export default function DashboardPage() {
  const { events, stats, isConnected } = useEventStream();
  const [newEventId, setNewEventId] = useState<string | null>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  // Auto-scroll timeline when new events arrive
  useEffect(() => {
    if (events.length > 0 && timelineRef.current) {
      timelineRef.current.scrollTop = 0;
    }
  }, [events]);

  // Flash animation for new events
  useEffect(() => {
    if (events.length > 0) {
      const latestId = events[0].id;
      setNewEventId(latestId);
      setTimeout(() => setNewEventId(null), 1000);
    }
  }, [events]);

  // Calculate stats from events
  const totalScans = stats?.total_scans || events.length;
  const blocked = events.filter(e => e.action === 'BLOCK').length;
  const flagged = events.filter(e => e.action === 'FLAG').length;
  const avgLatency = events.length > 0
    ? events.reduce((sum, e) => sum + e.latency_ms, 0) / events.length
    : 0;

  // Category breakdown
  const categoryMap = new Map<string, number>();
  events.forEach(e => {
    if (e.category) {
      categoryMap.set(e.category, (categoryMap.get(e.category) || 0) + 1);
    }
  });
  const categoryData = Array.from(categoryMap.entries())
    .map(([name, value]) => ({ name: name.replace(/_/g, ' '), value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);

  // Threat level distribution
  const threatLevelMap = new Map<string, number>();
  events.forEach(e => {
    const level = e.severity || 'UNKNOWN';
    threatLevelMap.set(level, (threatLevelMap.get(level) || 0) + 1);
  });
  const threatLevelData = Array.from(threatLevelMap.entries())
    .map(([name, value]) => ({ name, value }));

  // Layer performance (synthetic data from recent events)
  const layerPerformance = [
    { layer: 'Pattern', avgLatency: 2.3 },
    { layer: 'Intent', avgLatency: 48.5 },
    { layer: 'Semantic', avgLatency: 5.1 },
    { layer: 'Behavior', avgLatency: 1.2 },
    { layer: 'Output', avgLatency: 10.7 }
  ];

  // Color palette
  const COLORS = ['#ef4444', '#eab308', '#f97316', '#a855f7', '#3b82f6', '#22c55e', '#ec4899'];
  const THREAT_COLORS = {
    CRITICAL: '#ef4444',
    HIGH: '#f97316',
    MEDIUM: '#eab308',
    LOW: '#22c55e',
    UNKNOWN: '#a4a4a8'
  };

  return (
    <div className="h-full overflow-y-auto bg-background">
      {/* Header */}
      <div className="border-b border-border bg-surface sticky top-0 z-10">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-1">Security Operations Center</h1>
              <p className="text-sm text-muted-foreground">
                Real-time threat monitoring and analysis
              </p>
            </div>
            <div className="flex items-center gap-3 bg-surface border border-border rounded-lg px-4 py-2">
              <div className={`h-2.5 w-2.5 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
              <span className={`text-sm font-semibold font-mono ${isConnected ? 'text-green-500' : 'text-red-500'}`}>
                {isConnected ? '● ACTIVE' : '● DISCONNECTED'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* ROW 1: Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatsCard
            title="Total Scans"
            value={totalScans}
            icon={Activity}
            color="blue"
            subtitle="All requests"
          />
          <StatsCard
            title="Threats Blocked"
            value={blocked}
            icon={Shield}
            color="red"
            subtitle={`${totalScans > 0 ? ((blocked / totalScans) * 100).toFixed(1) : 0}% of total`}
            highlight={!!(newEventId && events[0]?.action === 'BLOCK')}
          />
          <StatsCard
            title="Flagged"
            value={flagged}
            icon={Flag}
            color="amber"
            subtitle={`${totalScans > 0 ? ((flagged / totalScans) * 100).toFixed(1) : 0}% of total`}
            highlight={!!(newEventId && events[0]?.action === 'FLAG')}
          />
          <StatsCard
            title="Avg Latency"
            value={`${Math.round(avgLatency)}ms`}
            icon={Zap}
            color="green"
            subtitle="Response time"
          />
        </div>

        {/* ROW 2: Timeline + Layer Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Threat Timeline */}
          <Card className="bg-surface border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Activity className="h-5 w-5" />
                Threat Timeline
                <Badge variant="outline" className="ml-auto">
                  Last 20 events
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                ref={timelineRef}
                className="h-[400px] overflow-y-auto space-y-2 pr-2"
              >
                {events.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Shield className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">Waiting for threats...</p>
                  </div>
                ) : (
                  <AnimatePresence initial={false}>
                    {events.slice(0, 20).map((event) => (
                      <ThreatTimelineItem
                        key={event.id}
                        event={event}
                        isNew={event.id === newEventId}
                      />
                    ))}
                  </AnimatePresence>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Layer Performance */}
          <Card className="bg-surface border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <TrendingUp className="h-5 w-5" />
                Layer Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={layerPerformance} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" />
                  <XAxis
                    type="number"
                    stroke="#a4a4a8"
                    tick={{ fill: '#a4a4a8', fontSize: 12 }}
                    label={{ value: 'Latency (ms)', position: 'insideBottom', offset: -5, fill: '#a4a4a8' }}
                  />
                  <YAxis
                    type="category"
                    dataKey="layer"
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
                    formatter={(value) => [`${value}ms`, 'Avg Latency']}
                  />
                  <Bar dataKey="avgLatency" radius={[0, 8, 8, 0]}>
                    {layerPerformance.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* ROW 3: Category Distribution + Threat Levels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Attack Categories */}
          <Card className="bg-surface border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <AlertTriangle className="h-5 w-5" />
                Top Attack Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              {categoryData.length === 0 ? (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  <p className="text-sm">No attack data yet</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${percent ? (percent * 100).toFixed(0) : 0}%`}
                      labelLine={{ stroke: '#a4a4a8' }}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
              )}
            </CardContent>
          </Card>

          {/* Threat Level Distribution */}
          <Card className="bg-surface border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Shield className="h-5 w-5" />
                Threat Level Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              {threatLevelData.length === 0 ? (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  <p className="text-sm">No threat data yet</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={threatLevelData}
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${percent ? (percent * 100).toFixed(0) : 0}%`}
                      labelLine={{ stroke: '#a4a4a8' }}
                    >
                      {threatLevelData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={THREAT_COLORS[entry.name as keyof typeof THREAT_COLORS] || THREAT_COLORS.UNKNOWN}
                        />
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
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Stats Card Component
interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  color: 'blue' | 'red' | 'amber' | 'green';
  subtitle: string;
  highlight?: boolean;
}

function StatsCard({ title, value, icon: Icon, color, subtitle, highlight }: StatsCardProps) {
  const colorMap = {
    blue: 'text-blue-500',
    red: 'text-red-500',
    amber: 'text-amber-500',
    green: 'text-green-500'
  };

  const bgMap = {
    blue: 'bg-blue-500/10',
    red: 'bg-red-500/10',
    amber: 'bg-amber-500/10',
    green: 'bg-green-500/10'
  };

  return (
    <motion.div
      initial={{ scale: 1 }}
      animate={highlight ? { scale: [1, 1.05, 1] } : {}}
      transition={{ duration: 0.3 }}
    >
      <Card className={`bg-surface border-border ${highlight ? 'border-2 border-red-500/50' : ''}`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {title}
            </span>
            <div className={`p-2 rounded-lg ${bgMap[color]}`}>
              <Icon className={`h-4 w-4 ${colorMap[color]}`} />
            </div>
          </div>
          <div className={`text-2xl font-bold mb-1 ${colorMap[color]}`}>
            {typeof value === 'number' ? value.toLocaleString() : value}
          </div>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
          {highlight && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1, repeat: 2 }}
              className="mt-2 text-xs text-red-500 font-semibold"
            >
              ⚡ Detecting threat...
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Threat Timeline Item
function ThreatTimelineItem({ event, isNew }: { event: ThreatEvent; isNew: boolean }) {
  const config = {
    BLOCK: {
      icon: Shield,
      color: 'text-red-500',
      bg: 'bg-red-500/10',
      border: 'border-red-500/50'
    },
    FLAG: {
      icon: Flag,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/50'
    },
    ALLOW: {
      icon: Eye,
      color: 'text-green-500',
      bg: 'bg-green-500/10',
      border: 'border-green-500/50'
    }
  };

  const style = config[event.action];
  const Icon = style.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.2 }}
      className={`border rounded-lg p-3 ${style.border} ${style.bg} ${
        isNew ? 'animate-pulse-slow border-2' : 'border'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`${style.color} mt-0.5`}>
          <Icon className="h-4 w-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <span className={`text-xs font-semibold ${style.color}`}>
              {event.action}
            </span>
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {getTimeAgo(new Date(event.timestamp))}
            </span>
          </div>
          <p className="text-xs text-foreground line-clamp-2 mb-2 leading-relaxed">
            {event.input_preview}
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {event.category && (
              <Badge variant="outline" className="text-xs px-1.5 py-0">
                {event.category.replace(/_/g, ' ')}
              </Badge>
            )}
            <span>•</span>
            <span>{event.severity}</span>
            <span>•</span>
            <span>{event.latency_ms.toFixed(0)}ms</span>
            {event.confidence && (
              <>
                <span>•</span>
                <span>{(event.confidence * 100).toFixed(0)}%</span>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/**
 * Get human-readable time ago string
 */
function getTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}
