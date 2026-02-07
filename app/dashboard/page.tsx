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
    <div className="h-full overflow-y-auto">
      {/* Header */}
      <div style={{ borderBottom: '1px solid #27272a', background: 'rgba(17,17,19,0.6)', paddingTop: 28, paddingBottom: 24, paddingLeft: 32, paddingRight: 32 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', margin: 0 }}>Security Operations Center</h1>
            <p style={{ fontSize: 13, color: '#71717a', marginTop: 4 }}>
              Real-time threat monitoring and analysis
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#18181b', border: '1px solid #27272a', borderRadius: 8, padding: '8px 14px' }}>
            <div className={`h-2 w-2 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
            <span style={{ fontSize: 12, fontWeight: 600, fontFamily: 'monospace', color: isConnected ? '#34d399' : '#f87171' }}>
              {isConnected ? 'ACTIVE' : 'DISCONNECTED'}
            </span>
          </div>
        </div>
      </div>

      <div style={{ padding: '32px 32px', maxWidth: 1200, margin: '0 auto' }}>
        {/* ROW 1: Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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
            color="emerald"
            subtitle="Response time"
          />
        </div>

        {/* ROW 2: Timeline + Layer Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Threat Timeline */}
          <Card className="bg-[#111113] border-[#27272a]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Activity className="h-5 w-5" />
                Threat Timeline
                <Badge variant="outline" className="ml-auto text-xs">
                  Last 20 events
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div
                ref={timelineRef}
                className="h-[400px] overflow-y-auto space-y-2 pr-2"
              >
                {events.length === 0 ? (
                  <div className="text-center py-12 text-zinc-500">
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
          <Card className="bg-[#111113] border-[#27272a]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <TrendingUp className="h-5 w-5" />
                Layer Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={layerPerformance} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis
                    type="number"
                    stroke="#71717a"
                    tick={{ fill: '#71717a', fontSize: 12 }}
                    label={{ value: 'Latency (ms)', position: 'insideBottom', offset: -5, fill: '#71717a' }}
                  />
                  <YAxis
                    type="category"
                    dataKey="layer"
                    stroke="#71717a"
                    tick={{ fill: '#71717a', fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#111113',
                      border: '1px solid #27272a',
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
          <Card className="bg-[#111113] border-[#27272a]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <AlertTriangle className="h-5 w-5" />
                Top Attack Categories
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              {categoryData.length === 0 ? (
                <div className="h-[300px] flex items-center justify-center text-zinc-500">
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
                      labelLine={{ stroke: '#71717a' }}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#111113',
                        border: '1px solid #27272a',
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
          <Card className="bg-[#111113] border-[#27272a]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Shield className="h-5 w-5" />
                Threat Level Distribution
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              {threatLevelData.length === 0 ? (
                <div className="h-[300px] flex items-center justify-center text-zinc-500">
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
                      labelLine={{ stroke: '#71717a' }}
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
                        backgroundColor: '#111113',
                        border: '1px solid #27272a',
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
  color: 'blue' | 'red' | 'amber' | 'emerald';
  subtitle: string;
  highlight?: boolean;
}

function StatsCard({ title, value, icon: Icon, color, subtitle, highlight }: StatsCardProps) {
  const colorMap = {
    blue: 'text-blue-500',
    red: 'text-red-500',
    amber: 'text-amber-500',
    emerald: 'text-emerald-500'
  };

  const bgMap = {
    blue: 'bg-blue-500/10',
    red: 'bg-red-500/10',
    amber: 'bg-amber-500/10',
    emerald: 'bg-emerald-500/10'
  };

  return (
    <motion.div
      initial={{ scale: 1 }}
      animate={highlight ? { scale: [1, 1.05, 1] } : {}}
      transition={{ duration: 0.3 }}
    >
      <Card className={`bg-[#111113] border-[#27272a] ${highlight ? 'border-2 border-red-500/50' : ''}`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-medium text-[#71717a] uppercase tracking-wider">
              {title}
            </span>
            <div className={`p-2.5 rounded-lg ${bgMap[color]}`}>
              <Icon className={`h-4 w-4 ${colorMap[color]}`} />
            </div>
          </div>
          <div className={`text-xl font-bold mb-1.5 ${colorMap[color]}`}>
            {typeof value === 'number' ? value.toLocaleString() : value}
          </div>
          <p className="text-[12px] text-[#71717a]">{subtitle}</p>
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
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/50'
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
            <span className="text-xs text-zinc-500 whitespace-nowrap">
              {getTimeAgo(new Date(event.timestamp))}
            </span>
          </div>
          <p className="text-xs text-zinc-300 line-clamp-2 mb-2 leading-relaxed">
            {event.input_preview}
          </p>
          <div className="flex items-center gap-2 text-xs text-zinc-500">
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
