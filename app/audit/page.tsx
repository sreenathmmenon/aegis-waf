"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Search,
  Filter,
  FileText
} from "lucide-react";
import { ThreatLogEntry, Decision, AttackCategory } from "@/lib/types";

interface AuditResponse {
  entries: ThreatLogEntry[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    pageSize: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
  filters: {
    decision: Decision | null;
    category: AttackCategory | null;
    search: string | null;
  };
  summary: {
    totalBlocked: number;
    totalAllowed: number;
    totalFlagged: number;
    averageLatency: number;
  };
}

export default function AuditLogPage() {
  const [auditData, setAuditData] = useState<AuditResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [currentPage, setCurrentPage] = useState(1);
  const [decisionFilter, setDecisionFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    fetchAuditLog();
  }, [currentPage, decisionFilter, categoryFilter, searchQuery]);

  const fetchAuditLog = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "20",
      });

      if (decisionFilter !== "all") {
        params.append("decision", decisionFilter);
      }
      if (categoryFilter !== "all") {
        params.append("category", categoryFilter);
      }
      if (searchQuery) {
        params.append("search", searchQuery);
      }

      const response = await fetch(`/api/shield/audit-log?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch audit log");

      const data = await response.json();
      setAuditData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setSearchQuery(searchInput);
    setCurrentPage(1); // Reset to first page on search
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const exportToCSV = () => {
    if (!auditData?.entries) return;

    const headers = ["Timestamp", "Input", "Decision", "Category", "Confidence", "Latency (ms)", "Session ID", "IP Address"];
    const rows = auditData.entries.map(entry => [
      new Date(entry.timestamp).toISOString(),
      entry.input.replace(/"/g, '""'), // Escape quotes
      entry.decision,
      entry.category || "N/A",
      (entry.confidence * 100).toFixed(0) + "%",
      Math.round(entry.latencyMs).toString(),
      entry.sessionId || "N/A",
      entry.ipAddress || "N/A"
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `aegis-audit-log-${new Date().toISOString()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading && !auditData) {
    return (
      <div style={{ padding: '40px 32px', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-zinc-500">Loading audit log...</p>
        </div>
      </div>
    );
  }

  if (error && !auditData) {
    return (
      <div style={{ padding: '40px 32px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Card className="border-red-500/50 bg-red-500/5">
            <CardContent className="p-4">
              <p className="text-red-500">Error loading audit log: {error}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: 40, paddingBottom: 32, paddingLeft: 32, paddingRight: 32, minHeight: '100vh' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', margin: 0 }}>Audit Log</h1>
          <p style={{ fontSize: 13, color: '#71717a', marginTop: 4 }}>
            Complete history of security decisions and threat analysis
          </p>
        </div>

        {/* Summary Cards */}
        {auditData && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-8">
            <div className="bg-[#18181b]/60 border border-[#27272a] rounded-lg px-4 py-3">
              <div className="text-[11px] text-[#71717a] uppercase tracking-wider font-medium mb-1.5">Total Entries</div>
              <div className="text-lg font-bold text-white">{auditData.pagination.totalCount}</div>
            </div>
            <div className="bg-[#18181b]/60 border border-[#27272a] rounded-lg px-4 py-3">
              <div className="text-[11px] text-[#71717a] uppercase tracking-wider font-medium mb-1.5">Blocked</div>
              <div className="text-lg font-bold text-red-500">{auditData.summary.totalBlocked}</div>
            </div>
            <div className="bg-[#18181b]/60 border border-[#27272a] rounded-lg px-4 py-3">
              <div className="text-[11px] text-[#71717a] uppercase tracking-wider font-medium mb-1.5">Flagged</div>
              <div className="text-lg font-bold text-amber-500">{auditData.summary.totalFlagged}</div>
            </div>
            <div className="bg-[#18181b]/60 border border-[#27272a] rounded-lg px-4 py-3">
              <div className="text-[11px] text-[#71717a] uppercase tracking-wider font-medium mb-1.5">Avg Latency</div>
              <div className="text-lg font-bold text-emerald-500">
                {Math.round(auditData.summary.averageLatency)}ms
              </div>
            </div>
          </div>
        )}

        {/* Filters and Search */}
        <Card className="bg-[#111113] border-[#27272a] mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Decision Filter */}
              <div>
                <label className="text-[13px] text-zinc-500 mb-2 block">Decision</label>
                <Select value={decisionFilter} onValueChange={(value) => {
                  setDecisionFilter(value);
                  setCurrentPage(1);
                }}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Decisions</SelectItem>
                    <SelectItem value="ALLOW">Allow</SelectItem>
                    <SelectItem value="BLOCK">Block</SelectItem>
                    <SelectItem value="FLAG">Flag</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Category Filter */}
              <div>
                <label className="text-[13px] text-zinc-500 mb-2 block">Category</label>
                <Select value={categoryFilter} onValueChange={(value) => {
                  setCategoryFilter(value);
                  setCurrentPage(1);
                }}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="direct_injection">Direct Injection</SelectItem>
                    <SelectItem value="indirect_injection">Indirect Injection</SelectItem>
                    <SelectItem value="encoding_obfuscation">Encoding/Obfuscation</SelectItem>
                    <SelectItem value="jailbreak">Jailbreak</SelectItem>
                    <SelectItem value="data_exfiltration">Data Exfiltration</SelectItem>
                    <SelectItem value="output_manipulation">Output Manipulation</SelectItem>
                    <SelectItem value="multi_turn">Multi-turn</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Search */}
              <div className="md:col-span-2">
                <label className="text-[13px] text-zinc-500 mb-2 block">Search Input Text</label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Search in inputs..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1"
                  />
                  <Button onClick={handleSearch} variant="outline" size="icon" className="border-[#27272a] bg-[#18181b]">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Audit Table */}
        <Card className="bg-[#111113] border-[#27272a] mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <FileText className="h-5 w-5" />
                Audit Entries
              </CardTitle>
              <Button
                onClick={exportToCSV}
                variant="outline"
                size="sm"
                className="gap-2 border-[#27272a] bg-[#18181b]"
                disabled={!auditData?.entries.length}
              >
                <Download className="h-4 w-4" />
                Export CSV
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {auditData && auditData.entries.length > 0 ? (
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-[#27272a] bg-[#111113] hover:bg-transparent">
                        <TableHead className="text-zinc-500 text-[13px]">Timestamp</TableHead>
                        <TableHead className="text-zinc-500 text-[13px]">Input</TableHead>
                        <TableHead className="text-zinc-500 text-[13px]">Decision</TableHead>
                        <TableHead className="text-zinc-500 text-[13px]">Category</TableHead>
                        <TableHead className="text-zinc-500 text-[13px]">Confidence</TableHead>
                        <TableHead className="text-zinc-500 text-[13px]">Latency</TableHead>
                        <TableHead className="text-zinc-500 text-[13px]">Session</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {auditData.entries.map((entry, index) => (
                        <TableRow
                          key={entry.id}
                          className={`border-[#27272a] ${
                            index % 2 === 0 ? "bg-[#111113]/50" : "bg-transparent"
                          }`}
                        >
                          <TableCell className="text-[13px] text-zinc-500 font-mono">
                            {new Date(entry.timestamp).toLocaleString()}
                          </TableCell>
                          <TableCell className="max-w-[400px]">
                            <div className="truncate text-[13px] text-zinc-300">{entry.input}</div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={
                                entry.decision === "BLOCK"
                                  ? "bg-red-500/10 text-red-500 border-red-500/50"
                                  : entry.decision === "FLAG"
                                  ? "bg-amber-500/10 text-amber-500 border-amber-500/50"
                                  : "bg-emerald-500/10 text-emerald-500 border-emerald-500/50"
                              }
                            >
                              {entry.decision}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {entry.category ? (
                              <Badge variant="outline" className="text-xs">
                                {entry.category.replace(/_/g, " ")}
                              </Badge>
                            ) : (
                              <span className="text-zinc-600 text-xs">-</span>
                            )}
                          </TableCell>
                          <TableCell className="font-mono text-[13px] text-zinc-300">
                            {(entry.confidence * 100).toFixed(0)}%
                          </TableCell>
                          <TableCell className="font-mono text-[13px] text-zinc-300">
                            {Math.round(entry.latencyMs)}ms
                          </TableCell>
                          <TableCell className="font-mono text-[13px] text-zinc-500">
                            {entry.sessionId?.substring(0, 8) || "-"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-[#27272a]">
                  <div className="text-sm text-zinc-500">
                    Showing {((auditData.pagination.currentPage - 1) * auditData.pagination.pageSize) + 1} to{" "}
                    {Math.min(
                      auditData.pagination.currentPage * auditData.pagination.pageSize,
                      auditData.pagination.totalCount
                    )}{" "}
                    of {auditData.pagination.totalCount} entries
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={!auditData.pagination.hasPrevious || loading}
                      className="border-[#27272a] bg-[#18181b]"
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Previous
                    </Button>
                    <div className="text-sm text-zinc-500">
                      Page {auditData.pagination.currentPage} of {auditData.pagination.totalPages}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={!auditData.pagination.hasNext || loading}
                      className="border-[#27272a] bg-[#18181b]"
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-zinc-500">
                No audit entries found matching your filters.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
