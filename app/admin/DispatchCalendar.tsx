"use client";

import { useMemo, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  CalendarDays,
  Search,
  AlertTriangle,
  Phone,
  Copy,
  Check,
  ExternalLink,
  Plane,
} from "lucide-react";
import {
  ScheduleRequest,
  VehicleMap,
  splitVehicles,
  lookupDriver,
  getTripWindow,
  minutesToTime12h,
  getConflicts,
  getDriverColor,
  getStatusColor,
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

const STATUS_OPTIONS = ["Pending", "Approved", "On the way", "Completed", "Cancelled", "Emergency"];

// -------------------------------------------------------------- date utils
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
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const jumpInputRef = useRef<HTMLInputElement>(null);

  const todayIso = toISODate(new Date());
  const conflicts = useMemo(() => getConflicts(requests, vehicleMap), [requests, vehicleMap]);

  const driverOptions = useMemo(
    () => Array.from(new Set(Object.values(vehicleMap).map((v) => v.driver))).sort(),
    [vehicleMap]
  );

  // -------------------------------------------------- filtered requests
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

  // -------------------------------------------------- trip counts per day
  const countsByDate = useMemo(() => {
    const map = new Map<string, number>();
    filtered.forEach((r) => {
      if (!r.pick_up_date) return;
      map.set(r.pick_up_date, (map.get(r.pick_up_date) || 0) + 1);
    });
    return map;
  }, [filtered]);

  // -------------------------------------------------- mini month calendar
  const monthLabel = new Date(`${monthAnchor}T00:00:00`).toLocaleDateString("en-PH", {
    month: "long",
    year: "numeric",
  });
  const gridStart = startOfCalendarGrid(monthAnchor);
  const monthCells = useMemo(() => Array.from({ length: 42 }, (_, i) => addDays(gridStart, i)), [gridStart]);

  const goToDate = (iso: string) => {
    onDateChange(iso);
    setMonthAnchor(startOfMonth(iso));
  };
  const goToToday = () => goToDate(todayIso);

  const renderMiniCalendar = () => (
    <div className="dcMiniCal">
      <div className="dcMiniHeader">
        <button className="dcMiniNavBtn" onClick={() => setMonthAnchor((m) => shiftMonth(m, -1))} aria-label="Previous month">
          <ChevronLeft size={15} />
        </button>
        <span className="dcMiniMonthLabel">{monthLabel}</span>
        <button className="dcMiniNavBtn" onClick={() => setMonthAnchor((m) => shiftMonth(m, 1))} aria-label="Next month">
          <ChevronRight size={15} />
        </button>
        <button
          className="dcJumpIconBtn"
          onClick={() => jumpInputRef.current?.showPicker?.()}
          aria-label="Jump to a specific date"
          title="Jump to date"
        >
          <CalendarDays size={14} />
        </button>
        <input
          ref={jumpInputRef}
          type="date"
          className="dcHiddenDate"
          value={activeDate}
          onChange={(e) => e.target.value && goToDate(e.target.value)}
        />
      </div>

      <div className="dcMiniDowRow">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <span key={i} className="dcMiniDow">
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
              className={`dcMiniCell ${isSelected ? "dcMiniCellSelected" : ""} ${
                isToday && !isSelected ? "dcMiniCellToday" : ""
              }`}
              style={{ opacity: inMonth ? 1 : 0.32 }}
              onClick={() => onDateChange(iso)}
              title={count > 0 ? `${count} trip${count === 1 ? "" : "s"}` : undefined}
            >
              <span className="dcMiniDate">{Number(iso.slice(8, 10))}</span>
              {count > 0 && <span className="dcMiniDot" style={{ background: isSelected ? "white" : "#1f5aa6" }} />}
            </button>
          );
        })}
      </div>

      <div className="dcQuickNav">
        <button onClick={() => goToDate(addDays(activeDate, -1))}>
          <ChevronLeft size={13} /> Prev Day
        </button>
        <button className={activeDate === todayIso ? "dcQuickNavActive" : ""} onClick={goToToday}>
          Today
        </button>
        <button onClick={() => goToDate(addDays(activeDate, 1))}>
          Next Day <ChevronRight size={13} />
        </button>
      </div>
    </div>
  );

  // -------------------------------------------------- daily trip list
  const dayTrips = useMemo(
    () =>
      filtered
        .filter((r) => r.pick_up_date === activeDate)
        .map((r) => ({ r, win: getTripWindow(r) }))
        .sort((a, b) => (a.win?.start ?? 9999) - (b.win?.start ?? 9999)),
    [filtered, activeDate]
  );

  const copyCode = (r: ScheduleRequest) => {
    if (!r.request_code) return;
    navigator.clipboard?.writeText(r.request_code).then(() => {
      setCopiedId(r.id);
      setTimeout(() => setCopiedId((cur) => (cur === r.id ? null : cur)), 1500);
    });
  };

  const renderTripCard = (
    { r, win }: { r: ScheduleRequest; win: { start: number; end: number } | null },
    idx: number,
    arr: { r: ScheduleRequest; win: { start: number; end: number } | null }[]
  ) => {
    const vehicles = splitVehicles(r.assigned_vehicle);
    const driverInfo = vehicles.map((v) => lookupDriver(v, vehicleMap)).find(Boolean) || null;
    const driver = driverInfo?.driver || null;
    const color = getDriverColor(driver, driverColorMap);
    const hasConflict = conflicts.has(r.id);
    const isActive = activeRequestId === r.id;
    const isExpanded = expandedId === r.id;
    const pax = getPassengerCount(r);
    const isLast = idx === arr.length - 1;

    return (
      <div className="dcTimelineRow" key={r.id}>
        <div className="dcTimelineRail">
          <span className="dcTimelineDot" style={{ background: color }} />
          {!isLast && <span className="dcTimelineLine" />}
        </div>

        <div className={`dcTripCard ${isActive ? "dcTripCardActive" : ""}`} style={{ borderLeftColor: color }}>
          <button className="dcTripCardMain" onClick={() => setExpandedId(isExpanded ? null : r.id)}>
            <div className="dcTripCardTop">
              <span className="dcTripTime">
                {win ? minutesToTime12h(win.start) : toPHTime(r.pick_up_time) || "No time set"}
              </span>
              {hasConflict && (
                <span className="dcTripWarn" title="Scheduling conflict">
                  <AlertTriangle size={13} />
                </span>
              )}
              <span className="dcStatusPill" style={{ background: getStatusColor(r.status) }}>
                {r.status}
              </span>
              <ChevronDown size={15} className={`dcExpandChevron ${isExpanded ? "dcExpandChevronOpen" : ""}`} />
            </div>
            <div className="dcTripCardBottom">
              <span className="dcTripDriver" style={{ color }} title={driver || "Unassigned"}>
                👤 {driver || "Unassigned"}
              </span>
              <span className="dcTripSep">•</span>
              <span className="dcTripPax">👥 {pax} pax</span>
              {r.flight_no && (
                <>
                  <span className="dcTripSep">•</span>
                  <span className="dcTripFlight">
                    <Plane size={11} /> {r.flight_no}
                  </span>
                </>
              )}
            </div>
          </button>

          {isExpanded && (
            <div className="dcTripExpand">
              <div className="dcTripExpandRoute">
                <span>{r.pickup_location || "Pickup TBD"}</span>
                <span className="dcTripExpandArrow">→</span>
                <span>{r.destination || "Destination TBD"}</span>
              </div>

              {(r.contact_person || r.contact_number) && (
                <div className="dcTripExpandLine">
                  <strong>Contact:</strong> {r.contact_person || "—"}
                  {r.contact_number ? ` · ${r.contact_number}` : ""}
                </div>
              )}

              {r.request_code && (
                <div className="dcTripExpandLine">
                  <strong>Code:</strong> {r.request_code}
                </div>
              )}

              <div className="dcTripActions">
                <button
                  className="dcActionBtn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectRequest(r);
                  }}
                >
                  <ExternalLink size={13} /> Full Details
                </button>
                {driverInfo?.phone && (
                  <a
                    className="dcActionBtn"
                    href={`tel:${driverInfo.phone}`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Phone size={13} /> Call Driver
                  </a>
                )}
                {r.request_code && (
                  <button
                    className="dcActionBtn"
                    onClick={(e) => {
                      e.stopPropagation();
                      copyCode(r);
                    }}
                  >
                    {copiedId === r.id ? <Check size={13} /> : <Copy size={13} />}
                    {copiedId === r.id ? "Copied" : "Copy Code"}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
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
            <div className="dcTitle">Dispatch Calendar</div>
            <div className="dcSubtitle">View and manage all scheduled trips</div>
          </div>
        </div>
      </div>

      <div className="dcSplit">
        <div className="dcLeftCol">{renderMiniCalendar()}</div>

        <div className="dcRightCol">
          <div className="dcDayHeader">
            <span className="dcDayHeaderDate">{fullDateLabel(activeDate)}</span>
            <span className="dcDayHeaderCount">
              {dayTrips.length} Trip{dayTrips.length === 1 ? "" : "s"} Scheduled
            </span>
          </div>

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
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
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
            <select className="dcSelect" value={vehicleFilter} onChange={(e) => setVehicleFilter(e.target.value)}>
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
            <div className="dcTripList">{dayTrips.map((entry, i, arr) => renderTripCard(entry, i, arr))}</div>
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

        /* ============ MINI CALENDAR (left) ============ */
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
          gap: 10px;
          background: white;
        }

        .dcMiniHeader {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .dcMiniMonthLabel {
          flex: 1;
          text-align: center;
          font-size: 14.5px;
          font-weight: 800;
          color: #111827;
        }

        .dcMiniNavBtn,
        .dcJumpIconBtn {
          border: none;
          background: transparent;
          color: #64748b;
          border-radius: 999px;
          width: 28px;
          height: 28px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: background 0.15s ease, color 0.15s ease;
        }

        .dcMiniNavBtn:hover,
        .dcJumpIconBtn:hover {
          background: #f1f5f9;
          color: #1f5aa6;
        }

        .dcHiddenDate {
          position: absolute;
          opacity: 0;
          pointer-events: none;
          width: 0;
          height: 0;
        }

        .dcMiniDowRow {
          display: grid;
          grid-template-columns: repeat(7, minmax(0, 1fr));
        }

        .dcMiniDow {
          text-align: center;
          font-size: 10.5px;
          font-weight: 800;
          color: #9ca3af;
        }

        .dcMiniGrid {
          display: grid;
          grid-template-columns: repeat(7, minmax(0, 1fr));
          row-gap: 3px;
        }

        .dcMiniCell {
          width: 32px;
          height: 32px;
          margin: 0 auto;
          border-radius: 999px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 2px;
          cursor: pointer;
          font-family: inherit;
          box-sizing: border-box;
          padding: 0;
          background: transparent;
          border: 1.5px solid transparent;
          color: #111827;
        }

        .dcMiniCell:hover {
          background: #f1f5f9;
        }

        .dcMiniCellToday {
          border-color: #1f5aa6;
          color: #1f5aa6;
          font-weight: 800;
        }

        .dcMiniCellSelected {
          background: #1f5aa6;
          color: white;
        }

        .dcMiniCellSelected:hover {
          background: #1a4c8f;
        }

        .dcMiniDate {
          font-size: 12.5px;
          font-weight: 700;
          line-height: 1;
        }

        .dcMiniDot {
          width: 4px;
          height: 4px;
          border-radius: 999px;
        }

        .dcQuickNav {
          display: flex;
          gap: 6px;
          margin-top: 4px;
          padding-top: 10px;
          border-top: 1px solid #f1f5f9;
        }

        .dcQuickNav button {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 3px;
          padding: 7px 6px;
          border: none;
          border-radius: 9px;
          background: #f1f5f9;
          font-weight: 700;
          font-size: 11px;
          cursor: pointer;
          color: #475569;
          font-family: inherit;
          transition: background 0.15s ease, color 0.15s ease;
        }

        .dcQuickNav button:hover {
          background: #1f5aa6;
          color: white;
        }

        .dcQuickNavActive {
          background: #1f5aa6 !important;
          color: white !important;
        }

        /* ============ DAILY DISPATCH DASHBOARD (right) ============ */
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
          max-height: 620px;
          overflow-y: auto;
          padding-right: 2px;
        }

        .dcTimelineRow {
          display: flex;
          gap: 10px;
        }

        .dcTimelineRail {
          width: 16px;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding-top: 14px;
        }

        .dcTimelineDot {
          width: 8px;
          height: 8px;
          border-radius: 999px;
          flex-shrink: 0;
        }

        .dcTimelineLine {
          width: 2px;
          flex: 1;
          background: #e2e8f0;
          margin-top: 2px;
        }

        .dcTripCard {
          flex: 1;
          min-width: 0;
          background: white;
          border: 1px solid #e2e8f0;
          border-left: 3px solid #94a3b8;
          border-radius: 10px;
          margin-bottom: 8px;
          box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
          transition: box-shadow 0.15s ease;
        }

        .dcTripCard:hover {
          box-shadow: 0 6px 14px rgba(15, 23, 42, 0.1);
        }

        .dcTripCardActive {
          box-shadow: 0 0 0 2px #1f5aa6;
        }

        .dcTripCardMain {
          width: 100%;
          text-align: left;
          background: transparent;
          border: none;
          padding: 9px 12px;
          cursor: pointer;
          font-family: inherit;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .dcTripCardTop {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .dcTripTime {
          font-size: 14px;
          font-weight: 800;
          color: #111827;
        }

        .dcTripWarn {
          color: #b91c1c;
          display: inline-flex;
        }

        .dcStatusPill {
          margin-left: auto;
          color: white;
          font-size: 10.5px;
          font-weight: 800;
          padding: 3px 9px;
          border-radius: 999px;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .dcExpandChevron {
          color: #9ca3af;
          flex-shrink: 0;
          transition: transform 0.15s ease;
        }

        .dcExpandChevronOpen {
          transform: rotate(180deg);
          color: #1f5aa6;
        }

        .dcTripCardBottom {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          font-weight: 600;
          color: #374151;
        }

        .dcTripDriver {
          font-weight: 700;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .dcTripSep {
          color: #cbd5e1;
        }

        .dcTripPax {
          color: #374151;
          white-space: nowrap;
        }

        .dcTripFlight {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          color: #374151;
          white-space: nowrap;
        }

        /* ============ EXPANDED TRIP DETAILS ============ */
        .dcTripExpand {
          padding: 0 12px 12px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          border-top: 1px dashed #e2e8f0;
          margin-top: 2px;
          padding-top: 10px;
        }

        .dcTripExpandRoute {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 700;
          color: #111827;
        }

        .dcTripExpandArrow {
          color: #94a3b8;
          font-weight: 400;
        }

        .dcTripExpandLine {
          font-size: 12.5px;
          color: #475569;
        }

        .dcTripExpandLine strong {
          color: #111827;
          font-weight: 700;
        }

        .dcTripActions {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: 4px;
        }

        .dcActionBtn {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 6px 10px;
          border-radius: 8px;
          border: 1px solid #cbd5e1;
          background: #f8fafc;
          color: #1f5aa6;
          font-size: 12px;
          font-weight: 700;
          font-family: inherit;
          cursor: pointer;
          text-decoration: none;
          transition: background 0.15s ease, border-color 0.15s ease;
        }

        .dcActionBtn:hover {
          background: #eaf1fb;
          border-color: #1f5aa6;
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
