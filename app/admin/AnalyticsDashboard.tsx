"use client";

import { useMemo, useState } from "react";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Minus,
  Users,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import {
  ScheduleRequest,
  VehicleMap,
  splitVehicles,
  lookupDriver,
  timeToMinutes,
  getPassengerCount,
  getStatusColor,
} from "./types";
import SummaryReportModal from "./SummaryReportModal";

// NOTE: this component uses the `recharts` charting library.
// If it isn't already in package.json, install it once with:
//   npm install recharts

type AnalyticsDashboardProps = {
  requests: ScheduleRequest[];
  vehicleMap: VehicleMap;
  toPHDate: (isoDate: string | null) => string | null;
};

type RangeOption = 7 | 30 | 90 | null; // null = All Time

const RANGE_OPTIONS: { label: string; value: RangeOption }[] = [
  { label: "7 Days", value: 7 },
  { label: "30 Days", value: 30 },
  { label: "90 Days", value: 90 },
  { label: "All Time", value: null },
];

const CANCELLED_STATUSES = new Set(["Cancelled", "Disapproved"]);

const DOW_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DOW_FULL = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// Distinct palette for vehicle/driver/route bars -- separate from the
// driver-color-coding used elsewhere since those colors are meant to be
// stable per-driver everywhere, while these charts just need N distinct
// readable colors regardless of who's #1 this period.
const CHART_PALETTE = [
  "#1f5aa6",
  "#0d9488",
  "#f97316",
  "#7c3aed",
  "#db2777",
  "#ca8a04",
  "#0891b2",
  "#65a30d",
];

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function addDaysStr(iso: string, days: number): string {
  const d = new Date(`${iso}T00:00:00`);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function shortVehicleLabel(v: string): string {
  return v.split(" - ")[0];
}

function hourLabel(h: number): string {
  const period = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12} ${period}`;
}

function shortDateLabel(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-PH", { month: "short", day: "numeric" });
}

function fullDateLabel(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-PH", { month: "long", day: "numeric", year: "numeric" });
}

function average(nums: number[]): number {
  if (nums.length === 0) return 0;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

type Delta = { direction: "up" | "down" | "flat"; text: string };

// For count-based metrics (e.g. total trips) -- percent change.
function deltaPercent(current: number, previous: number): Delta {
  if (previous === 0) {
    if (current === 0) return { direction: "flat", text: "No change" };
    return { direction: "up", text: "New this period" };
  }
  const change = ((current - previous) / previous) * 100;
  if (Math.abs(change) < 1) return { direction: "flat", text: "Flat vs last period" };
  return {
    direction: change > 0 ? "up" : "down",
    text: `${change > 0 ? "+" : ""}${change.toFixed(0)}% vs last period`,
  };
}

// For percentage-based metrics (e.g. completion rate) -- percentage-point
// difference reads more naturally than a "percent change of a percentage."
function deltaPoints(current: number, previous: number): Delta {
  const diff = current - previous;
  if (Math.abs(diff) < 0.5) return { direction: "flat", text: "Flat vs last period" };
  return {
    direction: diff > 0 ? "up" : "down",
    text: `${diff > 0 ? "+" : ""}${diff.toFixed(1)} pts vs last period`,
  };
}

// For small absolute averages (e.g. avg passengers/trip).
function deltaAbsolute(current: number, previous: number, decimals = 1): Delta {
  const diff = current - previous;
  if (Math.abs(diff) < 0.05) return { direction: "flat", text: "Flat vs last period" };
  return {
    direction: diff > 0 ? "up" : "down",
    text: `${diff > 0 ? "+" : ""}${diff.toFixed(decimals)} vs last period`,
  };
}

// goodDirection tells the badge which direction of change should read as
// positive (green) vs negative (red) for that particular metric -- e.g.
// "up" is good for completion rate but bad for cancellation rate.
function DeltaBadge({ delta, goodDirection }: { delta: Delta; goodDirection: "up" | "down" | "neutral" }) {
  if (delta.direction === "flat") {
    return (
      <span className="anzDelta anzDeltaFlat">
        <Minus size={11} /> {delta.text}
      </span>
    );
  }
  const isGood = goodDirection === "neutral" ? null : delta.direction === goodDirection;
  const colorClass = isGood === null ? "anzDeltaNeutral" : isGood ? "anzDeltaGood" : "anzDeltaBad";
  const Icon = delta.direction === "up" ? TrendingUp : TrendingDown;
  return (
    <span className={`anzDelta ${colorClass}`}>
      <Icon size={11} /> {delta.text}
    </span>
  );
}

export default function AnalyticsDashboard({ requests, vehicleMap, toPHDate }: AnalyticsDashboardProps) {
  const [rangeDays, setRangeDays] = useState<RangeOption>(30);
  const [showReport, setShowReport] = useState(false);

  const today = todayISO();

  const filtered = useMemo(() => {
    if (rangeDays === null) return requests;
    const cutoff = addDaysStr(today, -(rangeDays - 1));
    return requests.filter((r) => r.pick_up_date && r.pick_up_date >= cutoff && r.pick_up_date <= today);
  }, [requests, rangeDays, today]);

  const stats = useMemo(() => {
    const total = filtered.length;

    // -------- Status breakdown --------
    const statusCounts = new Map<string, number>();
    filtered.forEach((r) => statusCounts.set(r.status, (statusCounts.get(r.status) || 0) + 1));
    const statusData = Array.from(statusCounts.entries())
      .map(([name, value]) => ({ name, value, color: getStatusColor(name) }))
      .sort((a, b) => b.value - a.value);

    const completed = statusCounts.get("Completed") || 0;
    const cancelled = Array.from(statusCounts.entries())
      .filter(([s]) => CANCELLED_STATUSES.has(s))
      .reduce((sum, [, c]) => sum + c, 0);

    const completionRate = total > 0 ? (completed / total) * 100 : 0;
    const cancelRate = total > 0 ? (cancelled / total) * 100 : 0;

    // -------- Passengers --------
    const avgPassengers = total > 0 ? average(filtered.map(getPassengerCount)) : 0;

    // -------- Unassigned --------
    const unassignedCount = filtered.filter((r) => !r.assigned_vehicle).length;
    const unassignedRate = total > 0 ? (unassignedCount / total) * 100 : 0;

    // -------- Vehicle utilization --------
    const vehicleCounts = new Map<string, number>();
    filtered.forEach((r) => {
      splitVehicles(r.assigned_vehicle).forEach((v) => {
        vehicleCounts.set(v, (vehicleCounts.get(v) || 0) + 1);
      });
    });
    const vehicleData = Array.from(vehicleCounts.entries())
      .map(([vehicle, value]) => ({ name: shortVehicleLabel(vehicle), value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);

    // -------- Driver workload --------
    const driverCounts = new Map<string, number>();
    filtered.forEach((r) => {
      splitVehicles(r.assigned_vehicle).forEach((v) => {
        const info = lookupDriver(v, vehicleMap);
        if (info) driverCounts.set(info.driver, (driverCounts.get(info.driver) || 0) + 1);
      });
    });
    const driverData = Array.from(driverCounts.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);

    // -------- Peak hours --------
    const hourCounts = new Array(24).fill(0);
    filtered.forEach((r) => {
      const mins = timeToMinutes(r.pick_up_time);
      if (mins !== null) hourCounts[Math.floor(mins / 60)]++;
    });
    const hourData = hourCounts.map((value, h) => ({ name: hourLabel(h), value, hour: h }));
    const peakHour = hourData.reduce((max, cur) => (cur.value > max.value ? cur : max), hourData[0]);

    // -------- Top routes --------
    const routeCounts = new Map<string, number>();
    filtered.forEach((r) => {
      if (r.pickup_location && r.destination) {
        const key = `${r.pickup_location} → ${r.destination}`;
        routeCounts.set(key, (routeCounts.get(key) || 0) + 1);
      }
    });
    const routeData = Array.from(routeCounts.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    // -------- Day of week pattern --------
    const dowCounts = new Array(7).fill(0);
    filtered.forEach((r) => {
      if (!r.pick_up_date) return;
      const d = new Date(`${r.pick_up_date}T00:00:00`);
      if (!Number.isNaN(d.getTime())) dowCounts[d.getDay()]++;
    });
    const dowData = DOW_SHORT.map((name, i) => ({ name, value: dowCounts[i], dow: i }));
    const busiestDow = dowData.reduce((max, cur) => (cur.value > max.value ? cur : max), dowData[0]);

    // -------- Daily trend --------
    const dayCounts = new Map<string, number>();
    filtered.forEach((r) => {
      if (r.pick_up_date) dayCounts.set(r.pick_up_date, (dayCounts.get(r.pick_up_date) || 0) + 1);
    });
    const dailyTrend = Array.from(dayCounts.entries())
      .map(([date, value]) => ({ date, name: shortDateLabel(date), value }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return {
      total,
      statusData,
      completionRate,
      cancelRate,
      avgPassengers,
      unassignedCount,
      unassignedRate,
      vehicleData,
      driverData,
      hourData,
      peakHour,
      dowData,
      busiestDow,
      routeData,
      dailyTrend,
    };
  }, [filtered, vehicleMap]);

  const periodLabel = RANGE_OPTIONS.find((o) => o.value === rangeDays)?.label || "All Time";

  const periodRangeText = useMemo(() => {
    if (rangeDays === null) {
      if (stats.dailyTrend.length === 0) return "No dated trips yet";
      const first = stats.dailyTrend[0].date;
      const last = stats.dailyTrend[stats.dailyTrend.length - 1].date;
      return first === last ? fullDateLabel(first) : `${fullDateLabel(first)} – ${fullDateLabel(last)}`;
    }
    const cutoff = addDaysStr(today, -(rangeDays - 1));
    return `${fullDateLabel(cutoff)} – ${fullDateLabel(today)}`;
  }, [rangeDays, stats.dailyTrend, today]);

  // -------- Previous period (same length window immediately before the
  // current one) -- powers the "vs last period" comparison badges. Not
  // meaningful for "All Time", so this stays empty when rangeDays is null.
  const previousFiltered = useMemo(() => {
    if (rangeDays === null) return [];
    const currentStart = addDaysStr(today, -(rangeDays - 1));
    const prevEnd = addDaysStr(currentStart, -1);
    const prevStart = addDaysStr(prevEnd, -(rangeDays - 1));
    return requests.filter((r) => r.pick_up_date && r.pick_up_date >= prevStart && r.pick_up_date <= prevEnd);
  }, [requests, rangeDays, today]);

  const prevStats = useMemo(() => {
    const total = previousFiltered.length;
    let completed = 0;
    let cancelled = 0;
    let unassigned = 0;
    previousFiltered.forEach((r) => {
      if (r.status === "Completed") completed++;
      if (CANCELLED_STATUSES.has(r.status)) cancelled++;
      if (!r.assigned_vehicle) unassigned++;
    });
    return {
      total,
      completionRate: total > 0 ? (completed / total) * 100 : 0,
      cancelRate: total > 0 ? (cancelled / total) * 100 : 0,
      unassignedRate: total > 0 ? (unassigned / total) * 100 : 0,
      avgPassengers: total > 0 ? average(previousFiltered.map(getPassengerCount)) : 0,
    };
  }, [previousFiltered]);

  const hasComparison = rangeDays !== null && prevStats.total > 0;


  // -------- Auto-generated insights (rule-based, from the numbers above) --------
  const insights = useMemo(() => {
    const lines: string[] = [];
    if (stats.total === 0) {
      return ["No trips found in this period yet."];
    }

    if (stats.vehicleData.length > 0) {
      const top = stats.vehicleData[0];
      const pct = Math.round((top.value / stats.total) * 100);
      lines.push(`${top.name} handled the most trips — ${top.value} (${pct}% of all trips this period).`);
    }

    if (stats.driverData.length > 0) {
      const top = stats.driverData[0];
      const pct = Math.round((top.value / stats.total) * 100);
      lines.push(`${top.name} carried the heaviest driver workload, with ${top.value} trips (${pct}%).`);
    }

    if (stats.routeData.length > 0) {
      const top = stats.routeData[0];
      lines.push(`"${top.name}" is your most requested route, with ${top.value} trip${top.value === 1 ? "" : "s"}.`);
    }

    if (stats.peakHour && stats.peakHour.value > 0) {
      lines.push(`Pickups peak around ${stats.peakHour.name} — plan driver availability around that window.`);
    }

    if (stats.busiestDow && stats.busiestDow.value > 0) {
      lines.push(`${DOW_FULL[stats.busiestDow.dow]}s see the most requests (${stats.busiestDow.value} trips this period).`);
    }

    if (stats.cancelRate > 15) {
      lines.push(
        `Cancellation rate is high at ${stats.cancelRate.toFixed(1)}% — worth reviewing scheduling conflicts or driver no-shows.`
      );
    } else if (stats.cancelRate > 0) {
      lines.push(`Cancellation rate is ${stats.cancelRate.toFixed(1)}%, within a normal range.`);
    } else {
      lines.push("No cancellations in this period — clean run.");
    }

    if (stats.unassignedRate > 10) {
      lines.push(
        `${stats.unassignedRate.toFixed(1)}% of requests (${stats.unassignedCount}) still have no vehicle assigned — a coverage gap worth closing.`
      );
    }

    if (hasComparison) {
      const change = prevStats.total > 0 ? ((stats.total - prevStats.total) / prevStats.total) * 100 : 0;
      if (Math.abs(change) >= 5) {
        lines.push(
          `Trip volume is ${change > 0 ? "up" : "down"} ${Math.abs(Math.round(change))}% vs the previous ${rangeDays}-day period (${prevStats.total} → ${stats.total} trips).`
        );
      } else {
        lines.push(`Trip volume is steady compared to the previous ${rangeDays}-day period.`);
      }
    } else if (stats.dailyTrend.length >= 4) {
      const half = Math.floor(stats.dailyTrend.length / 2);
      const firstHalf = average(stats.dailyTrend.slice(0, half).map((d) => d.value));
      const secondHalf = average(stats.dailyTrend.slice(half).map((d) => d.value));
      const change = firstHalf > 0 ? ((secondHalf - firstHalf) / firstHalf) * 100 : 0;
      if (change > 10) {
        lines.push(`Trip volume is trending up — about ${Math.round(change)}% higher in the second half of this period.`);
      } else if (change < -10) {
        lines.push(`Trip volume is trending down — about ${Math.round(Math.abs(change))}% lower in the second half of this period.`);
      } else {
        lines.push("Trip volume has been steady across this period.");
      }
    }

    return lines;
  }, [stats, hasComparison, prevStats, rangeDays]);

  return (
    <div className="anzWrap">
      <div className="anzHeader">
        <span className="anzTitle">
          <BarChart3 size={16} /> Analytics
        </span>
        <div className="anzHeaderActions">
          <div className="anzRangeSwitch">
            {RANGE_OPTIONS.map((opt) => (
              <button
                key={opt.label}
                className={`anzRangeBtn ${rangeDays === opt.value ? "anzRangeBtnActive" : ""}`}
                onClick={() => setRangeDays(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <button className="anzReportBtn" onClick={() => setShowReport(true)}>
            <FileText size={14} /> Preview Summary Report
          </button>
        </div>
      </div>

      {/* -------- KPI cards -------- */}
      <div className="anzKpiGrid">
        <div className="anzKpiCard">
          <div className="anzKpiIcon" style={{ color: "#1f5aa6" }}>
            <Users size={18} />
          </div>
          <div className="anzKpiValue">{stats.total}</div>
          <div className="anzKpiLabel">Total Trips</div>
          {hasComparison && <DeltaBadge delta={deltaPercent(stats.total, prevStats.total)} goodDirection="up" />}
        </div>
        <div className="anzKpiCard">
          <div className="anzKpiIcon" style={{ color: "#22c55e" }}>
            <CheckCircle2 size={18} />
          </div>
          <div className="anzKpiValue">{stats.completionRate.toFixed(1)}%</div>
          <div className="anzKpiLabel">Completion Rate</div>
          {hasComparison && (
            <DeltaBadge delta={deltaPoints(stats.completionRate, prevStats.completionRate)} goodDirection="up" />
          )}
        </div>
        <div className="anzKpiCard">
          <div className="anzKpiIcon" style={{ color: "#ef4444" }}>
            <XCircle size={18} />
          </div>
          <div className="anzKpiValue">{stats.cancelRate.toFixed(1)}%</div>
          <div className="anzKpiLabel">Cancellation Rate</div>
          {hasComparison && (
            <DeltaBadge delta={deltaPoints(stats.cancelRate, prevStats.cancelRate)} goodDirection="down" />
          )}
        </div>
        <div className="anzKpiCard">
          <div className="anzKpiIcon" style={{ color: "#f59e0b" }}>
            <AlertTriangle size={18} />
          </div>
          <div className="anzKpiValue">{stats.unassignedRate.toFixed(1)}%</div>
          <div className="anzKpiLabel">Unassigned</div>
          {hasComparison && (
            <DeltaBadge delta={deltaPoints(stats.unassignedRate, prevStats.unassignedRate)} goodDirection="down" />
          )}
        </div>
        <div className="anzKpiCard">
          <div className="anzKpiIcon" style={{ color: "#7c3aed" }}>
            <Users size={18} />
          </div>
          <div className="anzKpiValue">{stats.avgPassengers.toFixed(1)}</div>
          <div className="anzKpiLabel">Avg. Passengers/Trip</div>
          {hasComparison && (
            <DeltaBadge delta={deltaAbsolute(stats.avgPassengers, prevStats.avgPassengers)} goodDirection="neutral" />
          )}
        </div>
      </div>

      {/* -------- Insights -------- */}
      <div className="anzInsightsBox">
        <span className="anzInsightsTitle">
          <TrendingUp size={15} /> What the numbers say
        </span>
        <ul className="anzInsightsList">
          {insights.map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ul>
      </div>

      {stats.total === 0 ? (
        <p className="anzEmpty">No trips in this range to chart yet.</p>
      ) : (
        <div className="anzChartsGrid">
          <div className="anzChartCard anzChartWide">
            <span className="anzChartTitle">Trips Over Time</span>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={stats.dailyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} interval="preserveStartEnd" />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} width={28} />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#1f5aa6" strokeWidth={2} dot={false} name="Trips" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="anzChartCard">
            <span className="anzChartTitle">Status Breakdown</span>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={stats.statusData} dataKey="value" nameKey="name" innerRadius={45} outerRadius={75}>
                  {stats.statusData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="anzLegendWrap">
              {stats.statusData.map((s) => (
                <span key={s.name} className="anzLegendChip">
                  <span className="anzLegendDot" style={{ background: s.color }} />
                  {s.name} ({s.value})
                </span>
              ))}
            </div>
          </div>

          <div className="anzChartCard">
            <span className="anzChartTitle">Vehicle Utilization</span>
            <ResponsiveContainer width="100%" height={Math.max(180, stats.vehicleData.length * 32)}>
              <BarChart data={stats.vehicleData} layout="vertical" margin={{ left: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" />
                <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={100} />
                <Tooltip />
                <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                  {stats.vehicleData.map((_, i) => (
                    <Cell key={i} fill={CHART_PALETTE[i % CHART_PALETTE.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="anzChartCard">
            <span className="anzChartTitle">Driver Workload</span>
            <ResponsiveContainer width="100%" height={Math.max(180, stats.driverData.length * 32)}>
              <BarChart data={stats.driverData} layout="vertical" margin={{ left: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" />
                <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={100} />
                <Tooltip />
                <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                  {stats.driverData.map((_, i) => (
                    <Cell key={i} fill={CHART_PALETTE[(i + 3) % CHART_PALETTE.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="anzChartCard">
            <span className="anzChartTitle">Requests by Day of Week</span>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={stats.dowData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} width={28} />
                <Tooltip />
                <Bar dataKey="value" fill="#7c3aed" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="anzChartCard anzChartWide">
            <span className="anzChartTitle">Peak Pickup Hours</span>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={stats.hourData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={2} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} width={28} />
                <Tooltip />
                <Bar dataKey="value" fill="#0d9488" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {stats.routeData.length > 0 && (
            <div className="anzChartCard anzChartWide">
              <span className="anzChartTitle">Top Routes</span>
              <ResponsiveContainer width="100%" height={Math.max(180, stats.routeData.length * 36)}>
                <BarChart data={stats.routeData} layout="vertical" margin={{ left: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" />
                  <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={220} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#f97316" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}

      {showReport && (
        <SummaryReportModal
          onClose={() => setShowReport(false)}
          periodLabel={periodLabel}
          periodRangeText={periodRangeText}
          generatedAt={new Date().toLocaleString("en-PH", {
            month: "long",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
          })}
          stats={{
            total: stats.total,
            statusData: stats.statusData,
            completionRate: stats.completionRate,
            cancelRate: stats.cancelRate,
            avgPassengers: stats.avgPassengers,
            unassignedCount: stats.unassignedCount,
            unassignedRate: stats.unassignedRate,
            vehicleData: stats.vehicleData,
            driverData: stats.driverData,
            routeData: stats.routeData,
            peakHourLabel: stats.peakHour ? stats.peakHour.name : null,
          }}
          insights={insights}
          deltas={
            hasComparison
              ? {
                  total: deltaPercent(stats.total, prevStats.total).text,
                  completionRate: deltaPoints(stats.completionRate, prevStats.completionRate).text,
                  cancelRate: deltaPoints(stats.cancelRate, prevStats.cancelRate).text,
                  unassignedRate: deltaPoints(stats.unassignedRate, prevStats.unassignedRate).text,
                  avgPassengers: deltaAbsolute(stats.avgPassengers, prevStats.avgPassengers).text,
                }
              : undefined
          }
        />
      )}

      <style jsx>{`
        .anzWrap {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .anzHeader {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 10px;
        }

        .anzHeaderActions {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .anzReportBtn {
          display: flex;
          align-items: center;
          gap: 6px;
          border: 1px solid #1f5aa6;
          background: white;
          color: #1f5aa6;
          font-weight: 700;
          font-size: 12.5px;
          padding: 8px 14px;
          border-radius: 10px;
          cursor: pointer;
          font-family: inherit;
        }

        .anzReportBtn:hover {
          background: #eef2ff;
        }

        .anzTitle {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 800;
          color: #0f172a;
          font-size: 15px;
        }

        .anzRangeSwitch {
          display: flex;
          gap: 6px;
          background: #f1f5f9;
          padding: 4px;
          border-radius: 10px;
        }

        .anzRangeBtn {
          border: none;
          background: transparent;
          color: #64748b;
          font-weight: 700;
          font-size: 12px;
          padding: 6px 12px;
          border-radius: 8px;
          cursor: pointer;
          font-family: inherit;
        }

        .anzRangeBtnActive {
          background: white;
          color: #1f5aa6;
          box-shadow: 0 1px 4px rgba(15, 23, 42, 0.15);
        }

        .anzKpiGrid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 12px;
        }

        .anzKpiCard {
          background: white;
          border-radius: 14px;
          padding: 12px 14px;
          box-shadow: 0 8px 18px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(0, 0, 0, 0.05);
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .anzKpiIcon {
          display: flex;
          justify-content: flex-end;
        }

        .anzKpiValue {
          font-size: 22px;
          font-weight: 800;
          color: #0f172a;
        }

        .anzKpiLabel {
          font-size: 12px;
          font-weight: 600;
          color: #64748b;
        }

        .anzDelta {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          font-size: 10.5px;
          font-weight: 700;
          margin-top: 2px;
          width: fit-content;
        }

        .anzDeltaGood {
          color: #16a34a;
        }

        .anzDeltaBad {
          color: #dc2626;
        }

        .anzDeltaNeutral {
          color: #64748b;
        }

        .anzDeltaFlat {
          color: #94a3b8;
        }

        .anzInsightsBox {
          background: #eaf1fb;
          border: 1px solid #c7d7f5;
          border-radius: 14px;
          padding: 14px 16px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .anzInsightsTitle {
          display: flex;
          align-items: center;
          gap: 6px;
          font-weight: 800;
          color: #1f5aa6;
          font-size: 13px;
        }

        .anzInsightsList {
          margin: 0;
          padding-left: 20px;
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .anzInsightsList li {
          font-size: 12.5px;
          color: #1e3a5f;
          font-weight: 600;
        }

        .anzEmpty {
          font-size: 13px;
          color: #94a3b8;
          font-weight: 600;
        }

        .anzChartsGrid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 14px;
        }

        .anzChartWide {
          grid-column: 1 / -1;
        }

        .anzChartCard {
          background: white;
          border-radius: 16px;
          padding: 14px 16px 8px;
          box-shadow: 0 8px 18px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(0, 0, 0, 0.05);
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .anzChartTitle {
          font-size: 13px;
          font-weight: 700;
          color: #0f172a;
        }

        .anzLegendWrap {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          justify-content: center;
          padding-bottom: 6px;
        }

        .anzLegendChip {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 11px;
          font-weight: 600;
          color: #334155;
        }

        .anzLegendDot {
          width: 8px;
          height: 8px;
          border-radius: 999px;
          flex-shrink: 0;
        }

        @media (max-width: 900px) {
          .anzChartsGrid {
            grid-template-columns: 1fr;
          }
          .anzChartWide {
            grid-column: auto;
          }
        }
      `}</style>
    </div>
  );
}
