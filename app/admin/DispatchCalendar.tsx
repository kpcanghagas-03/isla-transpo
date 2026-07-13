"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import {
  ScheduleRequest,
  VehicleMap,
  splitVehicles,
  lookupDriver,
  getTripWindow,
  minutesToTime,
  getConflicts,
} from "./types";

type CalendarView = "day" | "week" | "month";

type DispatchCalendarProps = {
  requests: ScheduleRequest[];
  vehicleMap: VehicleMap;
  toPHDate: (isoDate: string | null) => string | null;
  toPHTime: (time: string | null) => string | null;
  statusColor: (status: string) => string;
  onSelectRequest: (request: ScheduleRequest) => void;
};

const DAY_START_MIN = 5 * 60; // 5:00 AM
const DAY_END_MIN = 22 * 60; // 10:00 PM
const PX_PER_MIN = 1.1;

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
  const day = d.getDay(); // 0 = Sunday
  d.setDate(d.getDate() - day);
  return toISODate(d);
}

function startOfMonth(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  d.setDate(1);
  return toISODate(d);
}

export default function DispatchCalendar({
  requests,
  vehicleMap,
  toPHDate,
  toPHTime,
  statusColor,
  onSelectRequest,
}: DispatchCalendarProps) {
  const [view, setView] = useState<CalendarView>("day");
  const [anchor, setAnchor] = useState<string>(() => toISODate(new Date()));

  const conflicts = useMemo(() => getConflicts(requests, vehicleMap), [requests, vehicleMap]);

  const eventLabel = (r: ScheduleRequest) => {
    const win = getTripWindow(r);
    const vehicles = splitVehicles(r.assigned_vehicle);
    const drivers = vehicles
      .map((v) => lookupDriver(v, vehicleMap)?.driver)
      .filter(Boolean)
      .join(", ");
    return { win, vehicles, drivers };
  };

  const renderEventCard = (r: ScheduleRequest, compact = false) => {
    const { win, vehicles, drivers } = eventLabel(r);
    const hasConflict = conflicts.has(r.id);
    return (
      <button
        key={r.id}
        className={`dcEvent ${hasConflict ? "dcEventConflict" : ""} ${compact ? "dcEventCompact" : ""}`}
        onClick={() => onSelectRequest(r)}
        style={{ borderLeftColor: statusColor(r.status) }}
      >
        <div className="dcEventTop">
          <span className="dcEventTime">
            {win ? `${minutesToTime(win.start)}–${minutesToTime(win.end)}` : "No time"}
          </span>
          {hasConflict && <span className="dcConflictBadge">⚠ Conflict</span>}
        </div>
        <div className="dcEventPassenger">{r.passenger_names || r.requester_name}</div>
        {!compact && (
          <div className="dcEventRoute">
            📍 {r.pickup_location || "N/A"} → 🎯 {r.destination || "N/A"}
          </div>
        )}
        <div className="dcEventMeta">
          <span>{drivers || "Unassigned"}</span>
          <span className="dcEventVehicle">{vehicles.map((v) => v.split(" - ")[0]).join(", ") || "No vehicle"}</span>
        </div>
        <span className="dcEventStatus" style={{ background: statusColor(r.status) }}>
          {r.status}
        </span>
      </button>
    );
  };

  // ================= DAY VIEW =================
  const dayRequests = useMemo(
    () =>
      requests
        .filter((r) => r.pick_up_date === anchor)
        .sort((a, b) => (a.pick_up_time || "").localeCompare(b.pick_up_time || "")),
    [requests, anchor]
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
          const height = Math.max(28, (win.end - win.start) * PX_PER_MIN);
          const hasConflict = conflicts.has(r.id);
          const { vehicles, drivers } = eventLabel(r);
          return (
            <button
              key={r.id}
              className={`dcBlock ${hasConflict ? "dcBlockConflict" : ""}`}
              style={{ top, height, borderLeftColor: statusColor(r.status) }}
              onClick={() => onSelectRequest(r)}
            >
              <div className="dcBlockTitle">
                {minutesToTime(win.start)}–{minutesToTime(win.end)} · {r.passenger_names || r.requester_name}
              </div>
              <div className="dcBlockMeta">
                {drivers || "Unassigned"} · {vehicles.map((v) => v.split(" - ")[0]).join(", ") || "No vehicle"}
                {hasConflict && <span className="dcConflictBadge"> ⚠ Conflict</span>}
              </div>
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

  // ================= WEEK VIEW =================
  const weekStart = startOfWeek(anchor);
  const weekDays = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)), [weekStart]);

  const renderWeekView = () => (
    <div className="dcWeekGrid">
      {weekDays.map((iso) => {
        const dayReqs = requests
          .filter((r) => r.pick_up_date === iso)
          .sort((a, b) => (a.pick_up_time || "").localeCompare(b.pick_up_time || ""));
        const isToday = iso === toISODate(new Date());
        return (
          <div key={iso} className={`dcWeekCol ${isToday ? "dcWeekColToday" : ""}`}>
            <div className="dcWeekColHeader">{toPHDate(iso) || iso}</div>
            <div className="dcWeekColBody">
              {dayReqs.length === 0 ? (
                <p className="dcEmptySmall">No trips</p>
              ) : (
                dayReqs.map((r) => renderEventCard(r, true))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );

  // ================= MONTH VIEW =================
  const monthStart = startOfMonth(anchor);
  const monthGridStart = startOfWeek(monthStart);
  const monthDate = new Date(`${anchor}T00:00:00`);
  const monthLabel = monthDate.toLocaleDateString("en-PH", { month: "long", year: "numeric" });

  const monthCells = useMemo(() => Array.from({ length: 42 }, (_, i) => addDays(monthGridStart, i)), [monthGridStart]);

  const countsByDate = useMemo(() => {
    const map = new Map<string, number>();
    requests.forEach((r) => {
      if (!r.pick_up_date) return;
      map.set(r.pick_up_date, (map.get(r.pick_up_date) || 0) + 1);
    });
    return map;
  }, [requests]);

  const conflictDatesSet = useMemo(() => {
    const set = new Set<string>();
    requests.forEach((r) => {
      if (conflicts.has(r.id) && r.pick_up_date) set.add(r.pick_up_date);
    });
    return set;
  }, [requests, conflicts]);

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
          const count = countsByDate.get(iso) || 0;
          const hasConflict = conflictDatesSet.has(iso);
          return (
            <button
              key={iso}
              className={`dcMonthCell ${inMonth ? "" : "dcMonthCellMuted"}`}
              onClick={() => {
                setAnchor(iso);
                setView("day");
              }}
            >
              <span className="dcMonthDate">{Number(iso.slice(8, 10))}</span>
              {count > 0 && (
                <span className={`dcMonthCount ${hasConflict ? "dcMonthCountConflict" : ""}`}>
                  {count} trip{count === 1 ? "" : "s"}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );

  const shiftAnchor = (dir: 1 | -1) => {
    if (view === "day") setAnchor((a) => addDays(a, dir));
    else if (view === "week") setAnchor((a) => addDays(a, dir * 7));
    else {
      const d = new Date(`${anchor}T00:00:00`);
      d.setMonth(d.getMonth() + dir);
      setAnchor(toISODate(d));
    }
  };

  return (
    <div className="dcPanel">
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
          <button className="dcNavBtn" onClick={() => shiftAnchor(-1)}>
            <ChevronLeft size={16} />
          </button>
          <span className="dcNavLabel">
            <CalendarDays size={14} />
            {view === "month" ? monthLabel : toPHDate(anchor) || anchor}
          </span>
          <button className="dcNavBtn" onClick={() => shiftAnchor(1)}>
            <ChevronRight size={16} />
          </button>
          <button className="dcTodayBtn" onClick={() => setAnchor(toISODate(new Date()))}>
            Today
          </button>
        </div>
      </div>

      {view === "day" && renderDayView()}
      {view === "week" && renderWeekView()}
      {view === "month" && renderMonthView()}

      <style jsx>{`
        .dcPanel {
            display: flex;
            flex-direction: column;
            gap: 16px;

            width: 100%;
            box-sizing: border-box;

            background: #fff;
            border: 1px solid #e5e7eb;
            border-radius: 16px;
            padding: 20px;

            box-shadow:
                0 1px 3px rgba(15,23,42,.05),
                0 8px 24px rgba(15,23,42,.06);

            overflow: hidden;
            }

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
          gap: 6px;
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
          padding: 6px 10px;
          font-size: 12px;
          font-weight: 700;
          color: #1f5aa6;
          cursor: pointer;
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
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-left: 4px solid #1f5aa6;
          border-radius: 10px;
          padding: 6px 10px;
          text-align: left;
          cursor: pointer;
          font-family: inherit;
          overflow: auto;
        }

        .dcBlockConflict {
          background: #fef2f2;
          border-color: #fecaca;
        }

        .dcBlockTitle {
          font-size: 12.5px;
          font-weight: 700;
          color: #111827;
        }

        .dcBlockMeta {
          font-size: 11px;
          color: #64748b;
          margin-top: 2px;
        }

        .dcNoTimeNote {
          position: relative;
          margin: 8px;
          font-size: 11.5px;
          color: #94a3b8;
          font-weight: 600;
        }

        /* ---- Week view ---- */
        .dcWeekGrid {
        display: grid;
        grid-template-columns: repeat(7, minmax(220px, 1fr));
        overflow-x: auto;
        }

        .dcWeekCol {
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 8px;
          min-height: 160px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .dcWeekColToday {
          border-color: #1f5aa6;
          background: #f5f9ff;
        }

        .dcWeekColHeader {
          font-size: 11.5px;
          font-weight: 800;
          color: #475569;
          text-align: center;
        }

        .dcWeekColBody {
          display: flex;
          flex-direction: column;
          gap: 6px;
          max-height: 420px;
          overflow-y: auto;
        }

        .dcEmptySmall {
          font-size: 11px;
          color: #cbd5e1;
          text-align: center;
          font-weight: 600;
        }

        /* ---- Event card (used in week view + list contexts) ---- */
        .dcEvent {
          text-align: left;
          background: white;
          border: 1px solid #e2e8f0;
          border-left: 4px solid #1f5aa6;
          border-radius: 10px;
          padding: 8px 10px;
          cursor: pointer;
          font-family: inherit;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .dcEvent:hover {
          background: #f8fafc;
        }

        .dcEventConflict {
          background: #fef2f2;
          border-color: #fecaca;
        }

        .dcEventCompact {
          padding: 6px 8px;
        }

        .dcEventTop {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .dcEventTime {
          font-size: 11px;
          font-weight: 800;
          color: #1f5aa6;
        }

        .dcConflictBadge {
          font-size: 10px;
          font-weight: 800;
          color: #b91c1c;
        }

        .dcEventPassenger{
            word-break: break-word;
            line-height:1.3;
        }

        .dcEventRoute {
          font-size: 11px;
          color: #64748b;
        }

        .dcEventMeta{
            display:flex;
            flex-wrap:wrap;
            gap:6px;
            justify-content:space-between;
        }

        .dcEventVehicle {
          color: #a61e22;
        }

        .dcEventStatus {
          align-self: flex-start;
          color: white;
          font-size: 10px;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 999px;
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
          min-height: 64px;
          padding: 6px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          cursor: pointer;
          font-family: inherit;
          text-align: left;
        }

        .dcMonthCell:hover {
          background: #f8fafc;
        }

        .dcMonthCellMuted {
          opacity: 0.4;
        }

        .dcMonthDate {
          font-size: 12px;
          font-weight: 700;
          color: #111827;
        }

        .dcMonthCount {
          font-size: 10px;
          font-weight: 700;
          color: #1f5aa6;
          background: #eaf1fb;
          border-radius: 999px;
          padding: 2px 6px;
          width: fit-content;
        }

        .dcMonthCountConflict {
          color: #b91c1c;
          background: #fee2e2;
        }

        @media (max-width: 900px) {
          .dcWeekGrid {
            grid-template-columns: 1fr;
          }
          .dcMonthGrid {
            grid-template-columns: repeat(7, minmax(32px, 1fr));
          }
          .dcMonthCell {
            min-height: 48px;
          }
          .dcMonthCount {
            font-size: 9px;
          }
        }
      `}</style>
    </div>
  );
}
