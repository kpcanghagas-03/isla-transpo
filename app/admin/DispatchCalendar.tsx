"use client";

import { useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  CalendarDays,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import {
  ScheduleRequest,
  VehicleMap,
  splitVehicles,
  lookupDriver,
  getTripWindow,
  minutesToTime,
  getConflicts,
  getDriverColor,
  getStatusBadge,
  getStatusColor,
  getPassengerCount,
} from "./types";

type CalendarView = "day" | "week" | "month";

type DispatchCalendarProps = {
  requests: ScheduleRequest[];
  vehicleMap: VehicleMap;
  vehicleOptions: string[];
  driverColorMap: Record<string, string>;
  loading?: boolean;
  toPHDate: (isoDate: string | null) => string | null;
  toPHTime: (time: string | null) => string | null;
  activeDate: string;
  onDateChange: (date: string) => void;
  activeRequestId: number | null;
  onSelectRequest: (request: ScheduleRequest) => void;
};

const DAY_START_MIN = 5 * 60; // 5:00 AM
const DAY_END_MIN = 22 * 60; // 10:00 PM
const PX_PER_MIN = 1.1;
const MAX_VISIBLE_PER_CELL = 3;

const WEEK_START_MIN = 6 * 60; // 6:00 AM
const WEEK_END_MIN = 20 * 60; // 8:00 PM
const WEEK_PX_PER_MIN = 0.95;

const MAX_VISIBLE_DRIVER_CHIPS = 4;

function toISODate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function addDays(iso: string, days: number): string {
  const d = new Date(`${iso}T00:00:00`);
  d.setDate(d.getDate() + days);
  return toISODate(d);
}

function startOfWeek(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  const day = d.getDay();
  d.setDate(d.getDate() - day);
  return toISODate(d);
}

function startOfMonth(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  d.setDate(1);
  return toISODate(d);
}

function fmt(iso: string, opts: Intl.DateTimeFormatOptions): string {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-PH", opts);
}

export default function DispatchCalendar({
  requests,
  vehicleMap,
  vehicleOptions,
  driverColorMap,
  loading,
  toPHDate,
  toPHTime,
  activeDate,
  onDateChange,
  activeRequestId,
  onSelectRequest,
}: DispatchCalendarProps) {
  const [view, setView] = useState<CalendarView>("week");
  const [search, setSearch] = useState("");
  const [vehicleFilter, setVehicleFilter] = useState("All");
  const [driverFilter, setDriverFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [expandedCells, setExpandedCells] = useState<Set<string>>(new Set());
  const [filterRowOpen, setFilterRowOpen] = useState(true);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [conflictsOnly, setConflictsOnly] = useState(false);
  const [unassignedOnly, setUnassignedOnly] = useState(false);
  const [showAllDrivers, setShowAllDrivers] = useState(false);

  const conflicts = useMemo(() => getConflicts(requests, vehicleMap), [requests, vehicleMap]);

  const driverOptions = useMemo(
    () => Array.from(new Set(Object.values(vehicleMap).map((v) => v.driver))).sort(),
    [vehicleMap]
  );

  const visibleDriverChips = showAllDrivers ? driverOptions : driverOptions.slice(0, MAX_VISIBLE_DRIVER_CHIPS);
  const hiddenDriverCount = driverOptions.length - visibleDriverChips.length;

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    return requests.filter((r) => {
      const vehicles = splitVehicles(r.assigned_vehicle);
      const driver = vehicles.map((v) => lookupDriver(v, vehicleMap)?.driver).find(Boolean) || null;

      if (vehicleFilter !== "All" && !vehicles.includes(vehicleFilter)) return false;
      if (driverFilter !== "All" && driver !== driverFilter) return false;
      if (statusFilter !== "All" && r.status !== statusFilter) return false;
      if (conflictsOnly && !conflicts.has(r.id)) return false;
      if (unassignedOnly && r.assigned_vehicle) return false;
      if (!s) return true;

      return (
        (r.passenger_names || "").toLowerCase().includes(s) ||
        (r.requester_name || "").toLowerCase().includes(s) ||
        (r.request_code || "").toLowerCase().includes(s) ||
        (r.flight_no || "").toLowerCase().includes(s) ||
        (r.pickup_location || "").toLowerCase().includes(s) ||
        (r.destination || "").toLowerCase().includes(s) ||
        (driver || "").toLowerCase().includes(s)
      );
    });
  }, [requests, search, vehicleFilter, driverFilter, statusFilter, conflictsOnly, unassignedOnly, conflicts, vehicleMap]);

  const toggleExpanded = (key: string) => {
    setExpandedCells((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  // ---- Shared compact card renderer (month view) ----
  const renderCard = (r: ScheduleRequest, keyPrefix: string) => {
    const win = getTripWindow(r);
    const vehicles = splitVehicles(r.assigned_vehicle);
    const driver = vehicles.map((v) => lookupDriver(v, vehicleMap)?.driver).find(Boolean) || null;
    const color = getDriverColor(driver, driverColorMap);
    const hasConflict = conflicts.has(r.id);
    const isActive = activeRequestId === r.id;

    return (
      <button
        key={`${keyPrefix}-${r.id}`}
        className={`dcCard ${isActive ? "dcCardActive" : ""}`}
        style={{ background: `${color}14`, borderLeftColor: color }}
        onClick={() => onSelectRequest(r)}
        title={`${r.passenger_names || r.requester_name} · ${r.pickup_location || "?"} → ${r.destination || "?"}`}
      >
        {hasConflict && <span className="dcCardWarn">⚠</span>}
        <div className="dcCardTime">
          {win ? `${minutesToTime(win.start)}–${minutesToTime(win.end)}` : r.pick_up_time || "No time"}
        </div>
        <div className="dcCardRow">👥 {getPassengerCount(r)}</div>
        <div className="dcCardRow">🚐 {vehicles.map((v) => v.split(" - ")[0]).join(", ") || "No vehicle"}</div>
        <div className="dcCardRow" style={{ color, fontWeight: 700 }}>
          👨 {driver || "Unassigned"}
        </div>
        <span className="dcCardBadge">{getStatusBadge(r.status)}</span>
      </button>
    );
  };

  const renderCellList = (dayReqs: ScheduleRequest[], cellKey: string) => {
    const expanded = expandedCells.has(cellKey);
    const visible = expanded ? dayReqs : dayReqs.slice(0, MAX_VISIBLE_PER_CELL);
    const hidden = dayReqs.length - visible.length;

    return (
      <>
        {visible.map((r) => renderCard(r, cellKey))}
        {hidden > 0 && (
          <button className="dcMoreBtn" onClick={() => toggleExpanded(cellKey)}>
            +{hidden} more
          </button>
        )}
        {expanded && dayReqs.length > MAX_VISIBLE_PER_CELL && (
          <button className="dcMoreBtn" onClick={() => toggleExpanded(cellKey)}>
            Show less
          </button>
        )}
      </>
    );
  };

  // ================= DAY VIEW =================
  const dayRequests = useMemo(
    () =>
      filtered
        .filter((r) => r.pick_up_date === activeDate)
        .sort((a, b) => (a.pick_up_time || "").localeCompare(b.pick_up_time || "")),
    [filtered, activeDate]
  );

  const hours = useMemo(() => {
    const list: number[] = [];
    for (let m = DAY_START_MIN; m <= DAY_END_MIN; m += 60) list.push(m);
    return list;
  }, []);

  const trackHeight = (DAY_END_MIN - DAY_START_MIN) * PX_PER_MIN;

  const renderDayView = () => (
    <div className="dcDayWrap">
      <div className="dcDayHours">
        {hours.map((h) => (
          <div key={h} className="dcHourRow" style={{ height: 60 * PX_PER_MIN }}>
            {minutesToTime(h)}
          </div>
        ))}
      </div>
      <div className="dcDayTrack" style={{ height: trackHeight }}>
        {hours.map((h) => (
          <div key={h} className="dcHourLine" style={{ top: (h - DAY_START_MIN) * PX_PER_MIN }} />
        ))}
        {dayRequests.map((r) => {
          const win = getTripWindow(r);
          if (!win) return null;
          const top = Math.max(0, (win.start - DAY_START_MIN) * PX_PER_MIN);
          const height = Math.max(46, (win.end - win.start) * PX_PER_MIN);
          const vehicles = splitVehicles(r.assigned_vehicle);
          const driver = vehicles.map((v) => lookupDriver(v, vehicleMap)?.driver).find(Boolean) || null;
          const color = getDriverColor(driver, driverColorMap);
          const hasConflict = conflicts.has(r.id);
          const isActive = activeRequestId === r.id;

          return (
            <button
              key={r.id}
              className={`dcBlock ${isActive ? "dcBlockActive" : ""}`}
              style={{ top, height, background: `${color}14`, borderLeftColor: color }}
              onClick={() => onSelectRequest(r)}
            >
              <div className="dcBlockTitle">
                {minutesToTime(win.start)}–{minutesToTime(win.end)} · 👥 {getPassengerCount(r)}
              </div>
              <div className="dcBlockMeta" style={{ color }}>
                👨 {driver || "Unassigned"} · 🚐 {vehicles.map((v) => v.split(" - ")[0]).join(", ") || "No vehicle"}
              </div>
              <span className="dcBlockStatusPill" style={{ background: getStatusColor(r.status) }}>
                {r.status}
              </span>
              {hasConflict && <span className="dcBlockWarn">⚠</span>}
            </button>
          );
        })}
        {dayRequests.filter((r) => !getTripWindow(r)).length > 0 && (
          <div className="dcNoTimeNote">
            {dayRequests.filter((r) => !getTripWindow(r)).length} request(s) today have no pickup time and aren't shown on the timeline.
          </div>
        )}
      </div>
    </div>
  );

  // ================= WEEK VIEW (real hour grid, like a proper dispatch calendar) =================
  const weekStart = startOfWeek(activeDate);
  const weekEnd = addDays(weekStart, 6);
  const weekDays = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)), [weekStart]);
  const todayIso = toISODate(new Date());

  const weekHours = useMemo(() => {
    const list: number[] = [];
    for (let m = WEEK_START_MIN; m <= WEEK_END_MIN; m += 60) list.push(m);
    return list;
  }, []);
  const weekTrackHeight = (WEEK_END_MIN - WEEK_START_MIN) * WEEK_PX_PER_MIN;

  const renderWeekBlock = (r: ScheduleRequest, win: { start: number; end: number }) => {
    const top = Math.max(0, (win.start - WEEK_START_MIN) * WEEK_PX_PER_MIN);
    const height = Math.max(52, (win.end - win.start) * WEEK_PX_PER_MIN);
    const vehicles = splitVehicles(r.assigned_vehicle);
    const driver = vehicles.map((v) => lookupDriver(v, vehicleMap)?.driver).find(Boolean) || null;
    const color = getDriverColor(driver, driverColorMap);
    const hasConflict = conflicts.has(r.id);
    const isActive = activeRequestId === r.id;

    return (
      <button
        key={r.id}
        className={`dcWkBlock ${isActive ? "dcWkBlockActive" : ""}`}
        style={{ top, height, background: `${color}17`, borderLeftColor: color }}
        onClick={() => onSelectRequest(r)}
      >
        <div className="dcWkBlockTop">
          <span className="dcWkBlockTime">
            {minutesToTime(win.start)}–{minutesToTime(win.end)}
          </span>
          <span className="dcWkBlockPill" style={{ background: getStatusColor(r.status) }}>
            {r.status}
          </span>
        </div>
        <div className="dcWkBlockRow">👥 {getPassengerCount(r)} pax</div>
        <div className="dcWkBlockRow">🚐 {vehicles.map((v) => v.split(" - ")[0]).join(", ") || "No vehicle"}</div>
        <div className="dcWkBlockRow dcWkBlockDriver" style={{ color }}>
          👤 {driver || "Unassigned"}
        </div>
        {hasConflict && <span className="dcWkBlockWarn">⚠</span>}
      </button>
    );
  };

  const renderWeekView = () => (
    <div className="dcWkWrap">
      <div className="dcWkHeaderRow">
        <div className="dcWkGutterSpacer" />
        {weekDays.map((iso) => {
          const isToday = iso === todayIso;
          const isSun = new Date(`${iso}T00:00:00`).getDay() === 0;
          return (
            <button
              key={iso}
              className={`dcWkDayHeader ${isToday ? "dcWkDayHeaderToday" : ""}`}
              onClick={() => {
                onDateChange(iso);
                setView("day");
              }}
            >
              <span className={`dcWkDow ${isSun ? "dcWkDowSun" : ""}`}>{fmt(iso, { weekday: "short" }).toUpperCase()}</span>
              <span className={`dcWkDateNum ${isSun ? "dcWkDateNumSun" : ""} ${isToday ? "dcWkDateNumToday" : ""}`}>
                {fmt(iso, { month: "short", day: "numeric" })}
              </span>
            </button>
          );
        })}
      </div>

      <div className="dcWkBody">
        <div className="dcWkGutter">
          {weekHours.map((h) => (
            <div key={h} className="dcWkHourRow" style={{ height: 60 * WEEK_PX_PER_MIN }}>
              {minutesToTime(h)}
            </div>
          ))}
        </div>

        <div className="dcWkColsScroll">
          {weekDays.map((iso) => {
            const isToday = iso === todayIso;
            const dayReqs = filtered
              .filter((r) => r.pick_up_date === iso)
              .sort((a, b) => (a.pick_up_time || "").localeCompare(b.pick_up_time || ""));

            const withWindow = dayReqs
              .map((r) => ({ r, win: getTripWindow(r) }))
              .filter((x): x is { r: ScheduleRequest; win: { start: number; end: number } } => x.win !== null);

            const inRange = withWindow.filter(({ win }) => win.start >= WEEK_START_MIN && win.start <= WEEK_END_MIN);
            const overflowCount = withWindow.length - inRange.length;

            return (
              <div key={iso} className={`dcWkDayCol ${isToday ? "dcWkDayColToday" : ""}`}>
                <div className="dcWkDayTrack" style={{ height: weekTrackHeight }}>
                  {weekHours.map((h) => (
                    <div key={h} className="dcHourLine" style={{ top: (h - WEEK_START_MIN) * WEEK_PX_PER_MIN }} />
                  ))}
                  {inRange.map(({ r, win }) => renderWeekBlock(r, win))}
                </div>
                <div className="dcWkColFooter">
                  {overflowCount > 0 ? (
                    <button
                      className="dcWkMoreBtn"
                      onClick={() => {
                        onDateChange(iso);
                        setView("day");
                      }}
                    >
                      +{overflowCount} more
                    </button>
                  ) : (
                    <span className="dcWkMoreBtnGhost">+0 more</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  // ================= MONTH VIEW =================
  const monthStart = startOfMonth(activeDate);
  const monthGridStart = startOfWeek(monthStart);
  const monthDate = new Date(`${activeDate}T00:00:00`);
  const monthLabel = monthDate.toLocaleDateString("en-PH", { month: "long", year: "numeric" });
  const monthCells = useMemo(() => Array.from({ length: 42 }, (_, i) => addDays(monthGridStart, i)), [monthGridStart]);

  const renderMonthView = () => (
    <div>
      <div className="dcMonthLabel">{monthLabel}</div>
      <div className="dcMonthGrid">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="dcMonthDow">
            {d}
          </div>
        ))}
        {monthCells.map((iso) => {
          const inMonth = iso.slice(0, 7) === monthStart.slice(0, 7);
          const dayReqs = filtered
            .filter((r) => r.pick_up_date === iso)
            .sort((a, b) => (a.pick_up_time || "").localeCompare(b.pick_up_time || ""));
          return (
            <div key={iso} className={`dcMonthCell ${inMonth ? "" : "dcMonthCellMuted"}`}>
              <button
                className="dcMonthDate"
                onClick={() => {
                  onDateChange(iso);
                  setView("day");
                }}
              >
                {Number(iso.slice(8, 10))}
              </button>
              <div className="dcMonthCellBody">
                {dayReqs.length === 0 ? null : renderCellList(dayReqs, `month-${iso}`)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const shiftAnchor = (dir: 1 | -1) => {
    if (view === "day") onDateChange(addDays(activeDate, dir));
    else if (view === "week") onDateChange(addDays(activeDate, dir * 7));
    else {
      const d = new Date(`${activeDate}T00:00:00`);
      d.setMonth(d.getMonth() + dir);
      onDateChange(toISODate(d));
    }
  };

  const navLabel =
    view === "month"
      ? monthLabel
      : view === "week"
      ? `${fmt(weekStart, { month: "long", day: "numeric" })} – ${fmt(weekEnd, { month: "long", day: "numeric", year: "numeric" })}`
      : toPHDate(activeDate) || activeDate;

  return (
    <div className="dcPanel">
      {/* ================= HEADER: title + driver roster ================= */}
      <div className="dcHeaderRow">
        <div className="dcHeaderLeft">
          <div className="dcHeaderIcon">
            <CalendarDays size={20} />
          </div>
          <div>
            <h2 className="dcTitle">Dispatch Calendar</h2>
            <p className="dcSubtitle">View and manage all scheduled trips</p>
          </div>
        </div>

        {driverOptions.length > 0 && (
          <div className="dcDriversRow">
            <span className="dcDriversLabel">Drivers</span>
            <div className="dcDriverChips">
              {visibleDriverChips.map((d) => (
                <span key={d} className="dcDriverChip">
                  <span className="dcDriverDot" style={{ background: getDriverColor(d, driverColorMap) }} />
                  {d}
                </span>
              ))}
              {hiddenDriverCount > 0 && (
                <button className="dcDriverMoreBtn" onClick={() => setShowAllDrivers(true)}>
                  +{hiddenDriverCount} more
                </button>
              )}
              {showAllDrivers && hiddenDriverCount === 0 && driverOptions.length > MAX_VISIBLE_DRIVER_CHIPS && (
                <button className="dcDriverMoreBtn" onClick={() => setShowAllDrivers(false)}>
                  Show less
                </button>
              )}
            </div>
            <button
              className="dcDriverCollapseBtn"
              onClick={() => setShowAllDrivers((s) => !s)}
              title={showAllDrivers ? "Collapse driver list" : "Expand driver list"}
            >
              <ChevronDown size={14} style={{ transform: showAllDrivers ? "rotate(180deg)" : "none" }} />
            </button>
          </div>
        )}
      </div>

      {/* ================= TOOLBAR: view switch + date nav + filter toggle ================= */}
      <div className="dcToolbar">
        <div className="dcViewSwitch">
          {(["day", "week", "month"] as CalendarView[]).map((v) => (
            <button
              key={v}
              className={`dcViewBtn ${view === v ? "dcViewBtnActive" : ""}`}
              onClick={() => setView(v)}
            >
              {v[0].toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>
        <div className="dcNav">
          <button className="dcTodayBtn" onClick={() => onDateChange(toISODate(new Date()))}>
            Today
          </button>
          <button className="dcNavBtn" onClick={() => shiftAnchor(-1)}>
            <ChevronLeft size={16} />
          </button>
          <span className="dcNavLabel">{navLabel}</span>
          <button className="dcNavBtn" onClick={() => shiftAnchor(1)}>
            <ChevronRight size={16} />
          </button>
        </div>
        <button
          className={`dcFilterToggleBtn ${filterRowOpen ? "dcFilterToggleBtnActive" : ""}`}
          onClick={() => setFilterRowOpen((s) => !s)}
          title="Toggle filters"
        >
          <SlidersHorizontal size={15} />
          <ChevronDown size={12} style={{ transform: filterRowOpen ? "rotate(180deg)" : "none" }} />
        </button>
      </div>

      {/* ================= FILTER ROW: search + status/vehicle/driver + advanced ================= */}
      {filterRowOpen && (
        <div className="dcFilterRow">
          <div className="dcSearchWrap">
            <Search size={14} className="dcSearchIcon" />
            <input
              className="dcSearchInput"
              placeholder="Search trip, passenger, flight..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select className="dcSelect" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="All">All Status</option>
            {["Pending", "Approved", "On the way", "Completed", "Disapproved", "Emergency"].map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <select className="dcSelect" value={vehicleFilter} onChange={(e) => setVehicleFilter(e.target.value)}>
            <option value="All">All Vehicles</option>
            {vehicleOptions.map((v) => (
              <option key={v} value={v}>
                {v.split(" - ")[0]}
              </option>
            ))}
          </select>
          <select className="dcSelect" value={driverFilter} onChange={(e) => setDriverFilter(e.target.value)}>
            <option value="All">All Drivers</option>
            {driverOptions.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          <div className="dcAdvancedWrap">
            <button
              className={`dcAdvancedBtn ${advancedOpen ? "dcAdvancedBtnActive" : ""}`}
              onClick={() => setAdvancedOpen((s) => !s)}
            >
              <SlidersHorizontal size={13} /> Filter
            </button>
            {advancedOpen && (
              <div className="dcAdvancedPanel">
                <label className="dcAdvancedOption">
                  <input type="checkbox" checked={conflictsOnly} onChange={(e) => setConflictsOnly(e.target.checked)} />
                  Conflicts only
                </label>
                <label className="dcAdvancedOption">
                  <input type="checkbox" checked={unassignedOnly} onChange={(e) => setUnassignedOnly(e.target.checked)} />
                  Unassigned only
                </label>
              </div>
            )}
          </div>
        </div>
      )}

      {loading ? (
        <div className="dcSkeletonWrap">
          {[0, 1, 2].map((i) => (
            <div key={i} className="dcSkeletonRow" />
          ))}
        </div>
      ) : (
        <>
          {view === "day" && renderDayView()}
          {view === "week" && renderWeekView()}
          {view === "month" && renderMonthView()}
        </>
      )}

      <style jsx>{`
        .dcPanel {
          display: flex;
          flex-direction: column;
          gap: 14px;
          background: white;
          border-radius: 16px;
          padding: 16px;
          box-shadow: 0 8px 18px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(0, 0, 0, 0.05);
        }

        /* ---- Header ---- */
        .dcHeaderRow {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          flex-wrap: wrap;
          gap: 14px;
          padding-bottom: 4px;
        }

        .dcHeaderLeft {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .dcHeaderIcon {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: #eef2ff;
          color: #1f5aa6;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .dcTitle {
          font-size: 17px;
          font-weight: 800;
          color: #0f172a;
          margin: 0;
        }

        .dcSubtitle {
          font-size: 12px;
          font-weight: 600;
          color: #94a3b8;
          margin: 2px 0 0;
        }

        .dcDriversRow {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .dcDriversLabel {
          font-size: 11px;
          font-weight: 800;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.02em;
        }

        .dcDriverChips {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .dcDriverChip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 999px;
          padding: 5px 12px 5px 8px;
          font-size: 12px;
          font-weight: 700;
          color: #334155;
        }

        .dcDriverDot {
          width: 8px;
          height: 8px;
          border-radius: 999px;
          flex-shrink: 0;
        }

        .dcDriverMoreBtn {
          border: 1px dashed #cbd5e1;
          background: transparent;
          border-radius: 999px;
          padding: 5px 12px;
          font-size: 12px;
          font-weight: 700;
          color: #64748b;
          cursor: pointer;
          font-family: inherit;
        }

        .dcDriverCollapseBtn {
          border: 1px solid #e2e8f0;
          background: white;
          border-radius: 8px;
          width: 26px;
          height: 26px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #64748b;
          cursor: pointer;
          flex-shrink: 0;
        }

        /* ---- Toolbar ---- */
        .dcToolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 10px;
        }

        .dcViewSwitch {
          display: flex;
          gap: 4px;
          background: #f1f5f9;
          padding: 4px;
          border-radius: 10px;
        }

        .dcViewBtn {
          border: none;
          background: transparent;
          padding: 7px 14px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 13px;
          color: #475569;
          cursor: pointer;
          font-family: inherit;
        }

        .dcViewBtnActive {
          background: #1f5aa6;
          color: white;
        }

        .dcNav {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .dcNavBtn {
          border: 1px solid #e2e8f0;
          background: white;
          border-radius: 8px;
          padding: 6px;
          cursor: pointer;
          display: flex;
        }

        .dcNavLabel {
          display: flex;
          align-items: center;
          font-weight: 700;
          font-size: 13px;
          color: #0f172a;
          padding: 0 6px;
          white-space: nowrap;
        }

        .dcTodayBtn {
          border: 1px solid #e2e8f0;
          background: #f8fafc;
          border-radius: 8px;
          padding: 6px 12px;
          font-size: 12px;
          font-weight: 700;
          color: #1f5aa6;
          cursor: pointer;
        }

        .dcFilterToggleBtn {
          display: flex;
          align-items: center;
          gap: 4px;
          border: 1px solid #e2e8f0;
          background: white;
          border-radius: 8px;
          padding: 7px 10px;
          cursor: pointer;
          color: #475569;
        }

        .dcFilterToggleBtnActive {
          border-color: #1f5aa6;
          color: #1f5aa6;
          background: #eef2ff;
        }

        /* ---- Filter row ---- */
        .dcFilterRow {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          align-items: flex-start;
        }

        .dcSearchWrap {
          position: relative;
          flex: 2;
          min-width: 200px;
        }

        .dcSearchIcon {
          position: absolute;
          left: 10px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
        }

        .dcSearchInput {
          width: 100%;
          padding: 8px 10px 8px 30px;
          border-radius: 9px;
          border: 1px solid #cbd5e1;
          font-size: 12.5px;
          color: #111827;
          box-sizing: border-box;
        }

        .dcSelect {
          flex: 1;
          min-width: 120px;
          padding: 8px 10px;
          border-radius: 9px;
          border: 1px solid #cbd5e1;
          color: #111827;
          font-size: 12.5px;
        }

        .dcAdvancedWrap {
          position: relative;
        }

        .dcAdvancedBtn {
          display: flex;
          align-items: center;
          gap: 6px;
          border: 1px solid #1f5aa6;
          background: white;
          color: #1f5aa6;
          border-radius: 9px;
          padding: 8px 14px;
          font-size: 12.5px;
          font-weight: 700;
          cursor: pointer;
          font-family: inherit;
          white-space: nowrap;
        }

        .dcAdvancedBtnActive {
          background: #1f5aa6;
          color: white;
        }

        .dcAdvancedPanel {
          position: absolute;
          top: calc(100% + 6px);
          right: 0;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
          padding: 10px 12px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          z-index: 10;
          min-width: 160px;
        }

        .dcAdvancedOption {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          font-weight: 600;
          color: #334155;
          cursor: pointer;
          white-space: nowrap;
        }

        .dcSkeletonWrap {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .dcSkeletonRow {
          height: 48px;
          border-radius: 10px;
          background: linear-gradient(90deg, #f1f5f9 25%, #e8edf3 37%, #f1f5f9 63%);
          background-size: 400% 100%;
          animation: dcShimmer 1.4s ease infinite;
        }

        @keyframes dcShimmer {
          0% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0 50%;
          }
        }

        /* ---- Day view ---- */
        .dcDayWrap {
          display: flex;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          overflow: auto;
          max-height: 640px;
        }

        .dcDayHours {
          display: flex;
          flex-direction: column;
          border-right: 1px solid #e2e8f0;
          flex-shrink: 0;
          position: sticky;
          left: 0;
          background: white;
          z-index: 2;
        }

        .dcHourRow {
          width: 64px;
          font-size: 11px;
          font-weight: 600;
          color: #94a3b8;
          padding: 4px 8px;
          box-sizing: border-box;
          border-bottom: 1px dashed #f1f5f9;
        }

        .dcDayTrack {
          position: relative;
          flex: 1;
          min-width: 280px;
        }

        .dcHourLine {
          position: absolute;
          left: 0;
          right: 0;
          border-top: 1px dashed #f1f5f9;
        }

        .dcBlock {
          position: absolute;
          left: 8px;
          right: 8px;
          border: 1px solid #e2e8f0;
          border-left: 4px solid #94a3b8;
          border-radius: 10px;
          padding: 6px 10px;
          text-align: left;
          cursor: pointer;
          font-family: inherit;
          overflow: hidden;
        }

        .dcBlockActive {
          box-shadow: 0 0 0 2px #1f5aa6;
        }

        .dcBlockTitle {
          font-size: 12px;
          font-weight: 700;
          color: #111827;
        }

        .dcBlockMeta {
          font-size: 10.5px;
          font-weight: 700;
          margin-top: 2px;
        }

        .dcBlockStatusPill {
          position: absolute;
          bottom: 6px;
          right: 10px;
          font-size: 9.5px;
          font-weight: 800;
          color: white;
          padding: 2px 8px;
          border-radius: 999px;
        }

        .dcBlockWarn {
          position: absolute;
          top: 6px;
          right: 8px;
          color: #b91c1c;
          font-weight: 800;
        }

        .dcNoTimeNote {
          position: relative;
          margin: 8px;
          font-size: 11.5px;
          color: #94a3b8;
          font-weight: 600;
        }

        /* ---- Week view (real hour grid) ---- */
        .dcWkWrap {
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          overflow: hidden;
        }

        .dcWkHeaderRow {
          display: flex;
          border-bottom: 1px solid #e2e8f0;
          background: #f8fafc;
        }

        .dcWkGutterSpacer {
          width: 56px;
          flex-shrink: 0;
        }

        .dcWkDayHeader {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          padding: 10px 4px;
          border-left: 1px solid #eef2f7;
          background: transparent;
          border-top: none;
          border-bottom: none;
          border-right: none;
          cursor: pointer;
          font-family: inherit;
        }

        .dcWkDayHeaderToday {
          background: #eaf1fb;
        }

        .dcWkDow {
          font-size: 10.5px;
          font-weight: 800;
          color: #94a3b8;
          letter-spacing: 0.03em;
        }

        .dcWkDowSun {
          color: #ef4444;
        }

        .dcWkDateNum {
          font-size: 12.5px;
          font-weight: 800;
          color: #0f172a;
        }

        .dcWkDateNumSun {
          color: #ef4444;
        }

        .dcWkDateNumToday {
          color: #1f5aa6;
        }

        .dcWkBody {
          display: flex;
          max-height: 560px;
          overflow: auto;
        }

        .dcWkGutter {
          display: flex;
          flex-direction: column;
          border-right: 1px solid #e2e8f0;
          flex-shrink: 0;
          position: sticky;
          left: 0;
          background: white;
          z-index: 2;
        }

        .dcWkHourRow {
          width: 56px;
          font-size: 10.5px;
          font-weight: 600;
          color: #94a3b8;
          padding: 3px 6px;
          box-sizing: border-box;
          border-bottom: 1px dashed #f1f5f9;
        }

        .dcWkColsScroll {
          display: flex;
          flex: 1;
          min-width: 0;
        }

        .dcWkDayCol {
          flex: 1;
          min-width: 130px;
          display: flex;
          flex-direction: column;
          border-left: 1px solid #eef2f7;
        }

        .dcWkDayColToday {
          background: #f8fbff;
        }

        .dcWkDayTrack {
          position: relative;
        }

        .dcWkColFooter {
          padding: 6px;
          border-top: 1px solid #eef2f7;
          text-align: center;
        }

        .dcWkMoreBtn {
          font-size: 10.5px;
          font-weight: 700;
          color: #1f5aa6;
          background: transparent;
          border: none;
          cursor: pointer;
          font-family: inherit;
        }

        .dcWkMoreBtnGhost {
          font-size: 10.5px;
          font-weight: 700;
          color: #cbd5e1;
        }

        .dcWkBlock {
          position: absolute;
          left: 3px;
          right: 3px;
          border: 1px solid #e2e8f0;
          border-left: 3px solid #94a3b8;
          border-radius: 8px;
          padding: 5px 7px;
          text-align: left;
          cursor: pointer;
          font-family: inherit;
          overflow: hidden;
        }

        .dcWkBlockActive {
          box-shadow: 0 0 0 2px #1f5aa6;
        }

        .dcWkBlockTop {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 4px;
        }

        .dcWkBlockTime {
          font-size: 10px;
          font-weight: 800;
          color: #111827;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .dcWkBlockPill {
          font-size: 8px;
          font-weight: 800;
          color: white;
          padding: 1.5px 6px;
          border-radius: 999px;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .dcWkBlockRow {
          font-size: 9.5px;
          font-weight: 600;
          color: #475569;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          margin-top: 1px;
        }

        .dcWkBlockDriver {
          font-weight: 800;
        }

        .dcWkBlockWarn {
          position: absolute;
          top: 4px;
          right: 6px;
          color: #b91c1c;
          font-weight: 800;
          font-size: 10px;
        }

        /* ---- Compact dispatch card (month) ---- */
        .dcCard {
          position: relative;
          text-align: left;
          border: 1px solid #e2e8f0;
          border-left: 4px solid #94a3b8;
          border-radius: 10px;
          padding: 6px 8px 6px 8px;
          cursor: pointer;
          font-family: inherit;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .dcCardActive {
          box-shadow: 0 0 0 2px #1f5aa6;
        }

        .dcCardWarn {
          position: absolute;
          top: 4px;
          right: 6px;
          color: #b91c1c;
          font-weight: 800;
          font-size: 11px;
        }

        .dcCardTime {
          font-size: 11px;
          font-weight: 800;
          color: #111827;
        }

        .dcCardRow {
          font-size: 10px;
          color: #475569;
          font-weight: 600;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .dcCardBadge {
          align-self: flex-end;
          font-size: 12px;
          margin-top: -2px;
        }

        .dcMoreBtn {
          font-size: 10.5px;
          font-weight: 700;
          color: #1f5aa6;
          background: #eef2ff;
          border: 1px dashed #c7d7f5;
          border-radius: 8px;
          padding: 4px 6px;
          cursor: pointer;
          font-family: inherit;
        }

        /* ---- Month view ---- */
        .dcMonthLabel {
          font-size: 15px;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 8px;
        }

        .dcMonthGrid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 6px;
        }

        .dcMonthDow {
          font-size: 11px;
          font-weight: 800;
          color: #94a3b8;
          text-align: center;
          padding-bottom: 4px;
        }

        .dcMonthCell {
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          background: white;
          min-height: 96px;
          padding: 6px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .dcMonthCellMuted {
          opacity: 0.4;
        }

        .dcMonthDate {
          font-size: 12px;
          font-weight: 700;
          color: #111827;
          background: transparent;
          border: none;
          cursor: pointer;
          text-align: left;
          padding: 0;
          font-family: inherit;
        }

        .dcMonthCellBody {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        @media (max-width: 900px) {
          .dcMonthGrid {
            grid-template-columns: repeat(7, minmax(34px, 1fr));
          }
          .dcMonthCell {
            min-height: 60px;
          }
          .dcCardRow {
            font-size: 9px;
          }
          .dcWkDayCol {
            min-width: 96px;
          }
          .dcHeaderRow {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}
