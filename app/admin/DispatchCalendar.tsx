"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, CalendarDays, Search, AlertTriangle } from "lucide-react";
import {
  ScheduleRequest,
  VehicleMap,
  splitVehicles,
  lookupDriver,
  getTripWindow,
  minutesToTime12h,
  getConflicts,
  getDriverColor,
  getStatusBadge,
  getPassengerCount,
} from "./types";
import DispatchLegends from "./DispatchLegends";

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

function toISODate(d: Date): string {
  return d.toISOString().slice(0, 10);
}
function addDays(iso: string, days: number): string {
  const d = new Date(`${iso}T00:00:00`);
  d.setDate(d.getDate() + days);
  return toISODate(d);
}
function startOfMonth(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  d.setDate(1);
  return toISODate(d);
}
function startOfCalendarGrid(monthStartIso: string): string {
  const d = new Date(`${monthStartIso}T00:00:00`);
  d.setDate(d.getDate() - d.getDay());
  return toISODate(d);
}
function shiftMonth(iso: string, dir: 1 | -1): string {
  const d = new Date(`${iso}T00:00:00`);
  d.setMonth(d.getMonth() + dir);
  return toISODate(d);
}
function fullDateLabel(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-PH", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
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
  const [monthAnchor, setMonthAnchor] = useState<string>(() => startOfMonth(activeDate));
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [driverFilter, setDriverFilter] = useState("All");
  const [vehicleFilter, setVehicleFilter] = useState("All");

  const todayIso = toISODate(new Date());
  const conflicts = useMemo(() => getConflicts(requests, vehicleMap), [requests, vehicleMap]);

  const driverOptions = useMemo(
    () => Array.from(new Set(Object.values(vehicleMap).map((v) => v.driver))).sort(),
    [vehicleMap]
  );

  // ================= FILTERED REQUESTS (search + status + driver + vehicle) =================
  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    return requests.filter((r) => {
      const vehicles = splitVehicles(r.assigned_vehicle);
      const driver = vehicles.map((v) => lookupDriver(v, vehicleMap)?.driver).find(Boolean) || null;

      if (statusFilter !== "All" && r.status !== statusFilter) return false;
      if (driverFilter !== "All" && driver !== driverFilter) return false;
      if (vehicleFilter !== "All" && !vehicles.includes(vehicleFilter)) return false;
      if (!s) return true;

      return (
        (r.passenger_names || "").toLowerCase().includes(s) ||
        (r.requester_name || "").toLowerCase().includes(s) ||
        (r.request_code || "").toLowerCase().includes(s) ||
        (r.flight_no || "").toLowerCase().includes(s) ||
        (driver || "").toLowerCase().includes(s)
      );
    });
  }, [requests, search, statusFilter, driverFilter, vehicleFilter, vehicleMap]);

  // ================= TRIP COUNTS PER DAY (for the mini calendar dots) =================
  const countsByDate = useMemo(() => {
    const map = new Map<string, number>();
    filtered.forEach((r) => {
      if (!r.pick_up_date) return;
      map.set(r.pick_up_date, (map.get(r.pick_up_date) || 0) + 1);
    });
    return map;
  }, [filtered]);

  // ================= MINI MONTH CALENDAR =================
  const monthLabel = new Date(`${monthAnchor}T00:00:00`).toLocaleDateString("en-PH", {
    month: "long",
    year: "numeric",
  });
  const gridStart = startOfCalendarGrid(monthAnchor);
  const monthCells = useMemo(() => Array.from({ length: 42 }, (_, i) => addDays(gridStart, i)), [gridStart]);

  const goToToday = () => {
    setMonthAnchor(startOfMonth(todayIso));
    onDateChange(todayIso);
  };

  const renderMiniCalendar = () => (
    <div className="dcMiniCal">
      <div className="dcMiniHeader">
        <button
          className="dcMiniNavBtn"
          style={{ color: "#374151" }}
          onClick={() => setMonthAnchor((m) => shiftMonth(m, -1))}
          aria-label="Previous month"
        >
          <ChevronLeft size={16} />
        </button>
        <span className="dcMiniMonthLabel" style={{ color: "#111827" }}>
          {monthLabel}
        </span>
        <button
          className="dcMiniNavBtn"
          style={{ color: "#374151" }}
          onClick={() => setMonthAnchor((m) => shiftMonth(m, 1))}
          aria-label="Next month"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      <button className="dcTodayBtn" style={{ color: "#1f5aa6" }} onClick={goToToday}>
        Today
      </button>

      <div className="dcJumpToDate">
        <label className="dcJumpLabel" style={{ color: "#374151" }} htmlFor="dcJumpDateInput">
          Jump to date
        </label>
        <input
          id="dcJumpDateInput"
          type="date"
          className="dcJumpInput"
          style={{ color: "#111827" }}
          value={activeDate}
          onChange={(e) => {
            const v = e.target.value;
            if (!v) return;
            onDateChange(v);
            setMonthAnchor(startOfMonth(v));
          }}
        />
      </div>

      <div className="dcMiniDowRow">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <span key={i} className="dcMiniDow" style={{ color: "#6b7280" }}>
            {d}
          </span>
        ))}
      </div>

      <div className="dcMiniGrid">
        {monthCells.map((iso) => {
          const inMonth = iso.slice(0, 7) === monthAnchor.slice(0, 7);
          const isToday = iso === todayIso;
          const isSelected = iso === activeDate;
          const count = countsByDate.get(iso) || 0;

          return (
            <button
              key={iso}
              className="dcMiniCell"
              style={{
                background: isSelected ? "#1f5aa6" : "white",
                border: isToday ? "1.5px solid #1f5aa6" : "1px solid #e5e7eb",
                opacity: inMonth ? 1 : 0.35,
              }}
              onClick={() => onDateChange(iso)}
            >
              <span
                className="dcMiniDate"
                style={{ color: isSelected ? "white" : isToday ? "#1f5aa6" : "#111827" }}
              >
                {Number(iso.slice(8, 10))}
              </span>
              <span className="dcMiniDotRow">
                {count > 0 && (
                  <>
                    <span className="dcMiniDot" style={{ background: isSelected ? "white" : "#1f5aa6" }} />
                    {count > 1 && (
                      <span className="dcMiniDotCount" style={{ color: isSelected ? "white" : "#1f5aa6" }}>
                        {count}
                      </span>
                    )}
                  </>
                )}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );

  // ================= DAILY DISPATCH LIST =================
  const dayTrips = useMemo(
    () =>
      filtered
        .filter((r) => r.pick_up_date === activeDate)
        .map((r) => ({ r, win: getTripWindow(r) }))
        .sort((a, b) => (a.win?.start ?? 9999) - (b.win?.start ?? 9999)),
    [filtered, activeDate]
  );

  const renderTripCard = ({ r, win }: { r: ScheduleRequest; win: { start: number; end: number } | null }) => {
    const vehicles = splitVehicles(r.assigned_vehicle);
    const driver = vehicles.map((v) => lookupDriver(v, vehicleMap)?.driver).find(Boolean) || null;
    const color = getDriverColor(driver, driverColorMap);
    const hasConflict = conflicts.has(r.id);
    const isActive = activeRequestId === r.id;

    return (
      <button
        key={r.id}
        className={`dcTripCard ${isActive ? "dcTripCardActive" : ""}`}
        style={{ borderLeftColor: color, background: "white" }}
        onClick={() => onSelectRequest(r)}
      >
        <div className="dcTripTime" style={{ color: "#111827" }}>
          {win ? minutesToTime12h(win.start) : toPHTime(r.pick_up_time) || "No time set"}
          {hasConflict && (
            <span className="dcTripWarn" title="Scheduling conflict">
              <AlertTriangle size={14} />
            </span>
          )}
        </div>
        <div className="dcTripDriver" style={{ color: "#111827" }} title={driver || "Unassigned"}>
          👤 {driver || "Unassigned"}
        </div>
        <div className="dcTripPax" style={{ color: "#374151" }}>
          👥 {getPassengerCount(r)} Passenger{getPassengerCount(r) === 1 ? "" : "s"}
        </div>
        <div className="dcTripStatus" style={{ color: "#374151" }}>
          {getStatusBadge(r.status)} {r.status}
        </div>
      </button>
    );
  };

  return (
    <div className="dcCard">
      <div className="dcTopHeader">
        <div className="dcTitleWrap">
          <div className="dcTitleIcon">
            <CalendarDays size={20} />
          </div>
          <div>
            <div className="dcTitle" style={{ color: "#111827" }}>
              Dispatch Calendar
            </div>
            <div className="dcSubtitle" style={{ color: "#374151" }}>
              View and manage all scheduled trips
            </div>
          </div>
        </div>
      </div>

      <div className="dcSplit">
        {/* ================= LEFT: MINI CALENDAR ================= */}
        <div className="dcLeftCol">{renderMiniCalendar()}</div>

        {/* ================= RIGHT: DAILY DISPATCH DASHBOARD ================= */}
        <div className="dcRightCol">
          <div className="dcDayHeader">
            <span className="dcDayHeaderDate" style={{ color: "#111827" }}>
              {fullDateLabel(activeDate)}
            </span>
            <span className="dcDayHeaderCount" style={{ color: "#374151" }}>
              {dayTrips.length} Trip{dayTrips.length === 1 ? "" : "s"} Scheduled
            </span>
          </div>

          <div className="dcFilterRow">
            <div className="dcSearchWrap">
              <Search size={14} className="dcSearchIcon" />
              <input
                className="dcSearchInput"
                style={{ color: "#111827" }}
                placeholder="Search trip, passenger, flight..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              className="dcSelect"
              style={{ color: "#111827" }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Status</option>
              {["Pending", "Approved", "On the way", "Completed", "Disapproved", "Emergency"].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <select
              className="dcSelect"
              style={{ color: "#111827" }}
              value={driverFilter}
              onChange={(e) => setDriverFilter(e.target.value)}
            >
              <option value="All">All Drivers</option>
              {driverOptions.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            <select
              className="dcSelect"
              style={{ color: "#111827" }}
              value={vehicleFilter}
              onChange={(e) => setVehicleFilter(e.target.value)}
            >
              <option value="All">All Vehicles</option>
              {vehicleOptions.map((v) => (
                <option key={v} value={v}>
                  {v.split(" - ")[0]}
                </option>
              ))}
            </select>
          </div>

          {loading ? (
            <div className="dcSkeletonWrap">
              {[0, 1, 2].map((i) => (
                <div key={i} className="dcSkeletonRow" />
              ))}
            </div>
          ) : dayTrips.length === 0 ? (
            <div className="dcEmptyState">
              <CalendarDays size={30} strokeWidth={1.5} />
              <p className="dcEmptyTitle">No transport requests scheduled.</p>
              <p className="dcEmptySub">Select another date to view trips.</p>
            </div>
          ) : (
            <div className="dcTripList">{dayTrips.map(renderTripCard)}</div>
          )}

          <DispatchLegends vehicleMap={vehicleMap} driverColorMap={driverColorMap} embedded />
        </div>
      </div>

      <style jsx>{`
        .dcCard {
          background: white;
          border-radius: 20px;
          padding: 20px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
          border: 1px solid rgba(0, 0, 0, 0.05);
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .dcTopHeader {
          display: flex;
          align-items: center;
        }

        .dcTitleWrap {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .dcTitleIcon {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          background: #eaf1fb;
          color: #1f5aa6;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .dcTitle {
          font-size: 17px;
          font-weight: 800;
          color: #111827;
        }

        .dcSubtitle {
          font-size: 13px;
          color: #374151;
          font-weight: 600;
        }

        .dcSplit {
          display: grid;
          grid-template-columns: 300px 1fr;
          gap: 20px;
          align-items: start;
        }

        /* ================= MINI CALENDAR ================= */
        .dcLeftCol {
          position: sticky;
          top: 12px;
        }

        .dcMiniCal {
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 14px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          background: white;
        }

        .dcMiniHeader {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .dcMiniNavBtn {
          border: 1px solid #e2e8f0;
          background: white;
          border-radius: 8px;
          padding: 6px;
          cursor: pointer;
          display: flex;
        }

        .dcMiniMonthLabel {
          font-size: 15px;
          font-weight: 800;
        }

        .dcTodayBtn {
          border: 1px solid #1f5aa6;
          background: white;
          border-radius: 9px;
          padding: 7px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          width: 100%;
        }

        .dcTodayBtn:hover {
          background: #eef2ff;
        }

        .dcJumpToDate {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .dcJumpLabel {
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.02em;
        }

        .dcJumpInput {
          border: 1px solid #cbd5e1;
          border-radius: 9px;
          padding: 8px 10px;
          font-size: 13px;
          font-weight: 600;
          width: 100%;
          box-sizing: border-box;
          background: white;
        }

        .dcMiniDowRow {
          display: grid;
          grid-template-columns: repeat(7, minmax(0, 1fr));
          gap: 4px;
        }

        .dcMiniDow {
          text-align: center;
          font-size: 11px;
          font-weight: 800;
        }

        .dcMiniGrid {
          display: grid;
          grid-template-columns: repeat(7, minmax(0, 1fr));
          gap: 4px;
        }

        .dcMiniCell {
          width: 100%;
          height: 36px;
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 2px;
          cursor: pointer;
          font-family: inherit;
          box-sizing: border-box;
          padding: 0;
        }

        .dcMiniCell:hover {
          filter: brightness(0.97);
        }

        .dcMiniDate {
          font-size: 13px;
          font-weight: 700;
          line-height: 1;
        }

        .dcMiniDotRow {
          display: flex;
          align-items: center;
          gap: 3px;
          height: 6px;
        }

        .dcMiniDot {
          width: 5px;
          height: 5px;
          border-radius: 999px;
        }

        .dcMiniDotCount {
          font-size: 8.5px;
          font-weight: 800;
        }

        /* ================= RIGHT: DAILY DISPATCH DASHBOARD ================= */
        .dcRightCol {
          display: flex;
          flex-direction: column;
          gap: 14px;
          min-width: 0;
        }

        .dcDayHeader {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .dcDayHeaderDate {
          font-size: 18px;
          font-weight: 800;
          color: #111827;
        }

        .dcDayHeaderCount {
          font-size: 14px;
          font-weight: 700;
          color: #374151;
        }

        .dcFilterRow {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .dcSearchWrap {
          position: relative;
          flex: 2;
          min-width: 220px;
        }

        .dcSearchIcon {
          position: absolute;
          left: 10px;
          top: 50%;
          transform: translateY(-50%);
          color: #9ca3af;
        }

        .dcSearchInput {
          width: 100%;
          padding: 9px 10px 9px 32px;
          border-radius: 9px;
          border: 1px solid #cbd5e1;
          font-size: 14px;
          color: #111827;
          box-sizing: border-box;
        }

        .dcSelect {
          flex: 1;
          min-width: 130px;
          padding: 9px 10px;
          border-radius: 9px;
          border: 1px solid #cbd5e1;
          color: #111827;
          font-size: 14px;
        }

        .dcSkeletonWrap {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .dcSkeletonRow {
          height: 84px;
          border-radius: 12px;
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

        .dcEmptyState {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 56px 20px;
          color: #9ca3af;
          border: 1px dashed #e2e8f0;
          border-radius: 14px;
          text-align: center;
        }

        .dcEmptyTitle {
          font-size: 15px;
          font-weight: 700;
          color: #374151;
          margin: 4px 0 0;
        }

        .dcEmptySub {
          font-size: 14px;
          color: #9ca3af;
          margin: 0;
        }

        .dcTripList {
          display: flex;
          flex-direction: column;
          gap: 12px;
          max-height: 620px;
          overflow-y: auto;
          padding-right: 2px;
        }

        .dcTripCard {
          text-align: left;
          background: white;
          border: 1px solid #e2e8f0;
          border-left: 6px solid #94a3b8;
          border-radius: 14px;
          padding: 16px 18px;
          cursor: pointer;
          font-family: inherit;
          display: flex;
          flex-direction: column;
          gap: 6px;
          box-shadow: 0 1px 4px rgba(15, 23, 42, 0.04);
        }

        .dcTripCard:hover {
          box-shadow: 0 8px 18px rgba(15, 23, 42, 0.1);
        }

        .dcTripCardActive {
          box-shadow: 0 0 0 2px #1f5aa6;
        }

        .dcTripTime {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 17px;
          font-weight: 800;
          color: #111827;
        }

        .dcTripWarn {
          color: #b91c1c;
          display: inline-flex;
        }

        .dcTripDriver {
          font-size: 15px;
          font-weight: 700;
          color: #111827;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .dcTripPax {
          font-size: 14px;
          font-weight: 600;
          color: #374151;
        }

        .dcTripStatus {
          font-size: 14px;
          font-weight: 700;
          color: #374151;
        }

        @media (max-width: 900px) {
          .dcSplit {
            grid-template-columns: 1fr;
          }
          .dcLeftCol {
            position: static;
          }
        }
      `}</style>
    </div>
  );
}
