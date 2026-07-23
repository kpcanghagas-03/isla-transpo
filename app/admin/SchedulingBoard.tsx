"use client";

import { useMemo, useRef, useState } from "react";
import { Search, ArrowUpDown, ArrowUp, ArrowDown, CalendarX2, X, Table2, CalendarClock } from "lucide-react";
import {
  ScheduleRequest,
  VehicleMap,
  VehicleStatusMap,
  splitVehicles,
  lookupDriver,
  getDriverColorMap,
  getPassengerCount,
} from "./types";
import DailySummaryCards from "./DailySummaryCards";
import VehicleWorkloadPanel from "./VehicleWorkloadPanel";
import DriverWorkloadPanel from "./DriverWorkloadPanel";
import RequestsByDateCard from "./RequestsByDateCard";
import UnassignedRequestsCard from "./UnassignedRequestsCard";
import DispatchCalendar from "./DispatchCalendar";
import DriverTimeline from "./DriverTimeline";
import VehicleTimeline from "./VehicleTimeline";
import DispatchBoard from "./DispatchBoard";
import TripDetailPanel from "./TripDetailPanel";

type SortField = "pick_up_date" | "pick_up_time";
type SortDirection = "asc" | "desc";
type SchedView = "table" | "scheduler";

type SchedulingBoardProps = {
  requests: ScheduleRequest[];
  loading: boolean;
  vehicleOptions: string[];
  vehicleMap: VehicleMap;
  toPHDate: (isoDate: string | null) => string | null;
  toPHTime: (time: string | null) => string | null;
  statusColor: (status: string) => string;
  // NEW -- both optional so this component still works untouched if
  // page.tsx hasn't wired the new vehicle_status table / drop-off save
  // handler yet. See page.tsx patch notes for how to supply these.
  vehicleStatusMap?: VehicleStatusMap;
  onSaveDropOffTime?: (id: number, dropOffTime: string) => void;
  // NEW -- power the status dropdown and vehicle/driver dropdown in the
  // Trip Detail side panel. Same optional pattern as onSaveDropOffTime:
  // the panel renders read-only until these are supplied. Wire these to
  // the same updateField("status", ...) / updateAssignedVehicle(...)
  // functions the Dashboard tab already uses, so both tabs share one
  // source of truth (and the same email-on-change behavior).
  onUpdateStatus?: (id: number, status: string) => void;
  onAssignVehicle?: (id: number, vehicleString: string) => void;
};

const STATUS_OPTIONS = [
  "Pending",
  "Approved",
  "On the way",
  "Completed",
  "Cancelled",
  "Emergency",
];

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function SchedulingBoard({
  requests,
  loading,
  vehicleOptions,
  vehicleMap,
  toPHDate,
  toPHTime,
  statusColor,
  vehicleStatusMap,
  onSaveDropOffTime,
  onUpdateStatus,
  onAssignVehicle,
}: SchedulingBoardProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [vehicleFilter, setVehicleFilter] = useState("All");
  const [driverFilter, setDriverFilter] = useState("All");
  const [unassignedOnly, setUnassignedOnly] = useState(false);
  const [sortField, setSortField] = useState<SortField>("pick_up_date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  // ================= NEW: SCHEDULER VIEW STATE =================
  const [schedView, setSchedView] = useState<SchedView>("table");
  const [timelineDate, setTimelineDate] = useState<string>(todayISO());
  const [selectedRequest, setSelectedRequest] = useState<ScheduleRequest | null>(null);
  const statusMap: VehicleStatusMap = vehicleStatusMap || {};
  const driverColorMap = useMemo(() => getDriverColorMap(vehicleMap), [vehicleMap]);

  const tableRef = useRef<HTMLDivElement | null>(null);
  const scrollToTable = () => {
    tableRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setDateFilter("All");
    setStatusFilter("All");
    setVehicleFilter("All");
    setDriverFilter("All");
    setUnassignedOnly(false);
  };

  const handleFocusRequest = (term: string) => {
    clearAllFilters();
    setSchedView("table");
    setSearchTerm(term);
    scrollToTable();
  };

  // ================= DISTINCT DRIVERS (for filter dropdown) =================
  const driverOptions = useMemo(() => {
    const drivers = new Set<string>();
    Object.values(vehicleMap).forEach((info) => drivers.add(info.driver));
    return Array.from(drivers).sort();
  }, [vehicleMap]);

  // ================= DISTINCT PICKUP DATES (for filter dropdown) =================
  const pickupDates = useMemo(() => {
    const dates = new Set<string>();
    requests.forEach((r) => {
      if (r.pick_up_date) dates.add(r.pick_up_date);
    });
    return Array.from(dates).sort();
  }, [requests]);

  // ================= FILTER + SEARCH + SORT =================
  const rows = useMemo(() => {
    const s = searchTerm.toLowerCase();

    const filtered = requests.filter((r) => {
      if (dateFilter !== "All" && r.pick_up_date !== dateFilter) return false;
      if (statusFilter !== "All" && r.status !== statusFilter) return false;
      if (unassignedOnly && r.assigned_vehicle) return false;

      if (
        vehicleFilter !== "All" &&
        !splitVehicles(r.assigned_vehicle).includes(vehicleFilter)
      )
        return false;

      if (driverFilter !== "All") {
        const drivesForRequest = splitVehicles(r.assigned_vehicle).some(
          (v) => lookupDriver(v, vehicleMap)?.driver === driverFilter
        );
        if (!drivesForRequest) return false;
      }

      if (!s) return true;

      return (
        (r.request_code || "").toLowerCase().includes(s) ||
        (r.requester_name || "").toLowerCase().includes(s) ||
        (r.passenger_names || "").toLowerCase().includes(s) ||
        String(getPassengerCount(r)).includes(s) ||
        (r.contact_person || "").toLowerCase().includes(s) ||
        (r.flight_no || "").toLowerCase().includes(s) ||
        (r.pickup_location || "").toLowerCase().includes(s) ||
        (r.destination || "").toLowerCase().includes(s) ||
        (r.assigned_vehicle || "").toLowerCase().includes(s) ||
        (r.status || "").toLowerCase().includes(s)
      );
    });

    const sorted = [...filtered].sort((a, b) => {
      const dateA = a.pick_up_date || "";
      const dateB = b.pick_up_date || "";
      const timeA = a.pick_up_time || "";
      const timeB = b.pick_up_time || "";

      let cmp = 0;
      if (sortField === "pick_up_date") {
        cmp = dateA.localeCompare(dateB) || timeA.localeCompare(timeB);
      } else {
        cmp = timeA.localeCompare(timeB) || dateA.localeCompare(dateB);
      }

      // Requests with no pickup date/time sink to the bottom regardless of direction.
      if (!dateA && dateB) return 1;
      if (dateA && !dateB) return -1;

      return sortDirection === "asc" ? cmp : -cmp;
    });

    return sorted;
  }, [
    requests,
    searchTerm,
    dateFilter,
    statusFilter,
    vehicleFilter,
    driverFilter,
    unassignedOnly,
    vehicleMap,
    sortField,
    sortDirection,
  ]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown size={13} />;
    return sortDirection === "asc" ? <ArrowUp size={13} /> : <ArrowDown size={13} />;
  };

  const activeFilterChips: { label: string; clear: () => void }[] = [];
  if (searchTerm) activeFilterChips.push({ label: `Search: "${searchTerm}"`, clear: () => setSearchTerm("") });
  if (dateFilter !== "All")
    activeFilterChips.push({ label: `Date: ${toPHDate(dateFilter) || dateFilter}`, clear: () => setDateFilter("All") });
  if (statusFilter !== "All")
    activeFilterChips.push({ label: `Status: ${statusFilter}`, clear: () => setStatusFilter("All") });
  if (vehicleFilter !== "All")
    activeFilterChips.push({ label: `Vehicle: ${vehicleFilter.split(" - ")[0]}`, clear: () => setVehicleFilter("All") });
  if (driverFilter !== "All")
    activeFilterChips.push({ label: `Driver: ${driverFilter}`, clear: () => setDriverFilter("All") });
  if (unassignedOnly)
    activeFilterChips.push({ label: "No Vehicle Assigned", clear: () => setUnassignedOnly(false) });

  return (
    <section className="schedSection">
      <div className="schedTitleRow">
        <div>
          <h2 className="schedTitle" style={{ color: "#475569" }}>
            Scheduling Board
          </h2>
          <p className="schedSubtitle">
            A real-time dispatch dashboard: scan workload, spot gaps, then drill into the table below.
          </p>
        </div>

        {/* ================= NEW: TABLE / SCHEDULER VIEW SWITCH ================= */}
        <div className="schedViewSwitch">
          <button
            className={`schedViewBtn ${schedView === "table" ? "schedViewBtnActive" : ""}`}
            onClick={() => setSchedView("table")}
          >
            <Table2 size={14} /> Table
          </button>
          <button
            className={`schedViewBtn ${schedView === "scheduler" ? "schedViewBtnActive" : ""}`}
            onClick={() => setSchedView("scheduler")}
          >
            <CalendarClock size={14} /> Scheduler
          </button>
        </div>
      </div>

      {/* ================= FEATURE 1: DAILY SUMMARY CARDS ================= */}
      <DailySummaryCards
        requests={requests}
        activeStatus={statusFilter === "All" ? null : statusFilter}
        onSelectStatus={(status) => {
          setStatusFilter(status ?? "All");
          setUnassignedOnly(false);
          setSchedView("table");
          scrollToTable();
        }}
        unassignedOnly={unassignedOnly}
        onToggleUnassigned={() => {
          setUnassignedOnly((prev) => !prev);
          setStatusFilter("All");
          setSchedView("table");
          scrollToTable();
        }}
      />

      {/* ================= FEATURE 4: UNASSIGNED REQUESTS ================= */}
      <UnassignedRequestsCard
        requests={requests}
        toPHDate={toPHDate}
        toPHTime={toPHTime}
        onFocusRequest={handleFocusRequest}
      />

      {/* ================= FEATURES 2, 3, 5: WORKLOAD + DATE PANELS ================= */}
      <div className="schedPanelsGrid">
        <VehicleWorkloadPanel
          requests={requests}
          vehicleOptions={vehicleOptions}
          activeVehicle={vehicleFilter === "All" ? null : vehicleFilter}
          onSelectVehicle={(v) => {
            setVehicleFilter(v ?? "All");
            setSchedView("table");
            scrollToTable();
          }}
        />
        <DriverWorkloadPanel
          requests={requests}
          vehicleMap={vehicleMap}
          activeDriver={driverFilter === "All" ? null : driverFilter}
          onSelectDriver={(d) => {
            setDriverFilter(d ?? "All");
            setSchedView("table");
            scrollToTable();
          }}
        />
        <RequestsByDateCard
          requests={requests}
          activeDate={dateFilter === "All" ? null : dateFilter}
          onSelectDate={(d) => {
            setDateFilter(d ?? "All");
            setSchedView("table");
            scrollToTable();
          }}
          toPHDate={toPHDate}
        />
      </div>

      {schedView === "scheduler" ? (
        /* ================= DISPATCH CALENDAR (mini calendar + daily list) / BOARD / TIMELINES ================= */
        <div className="schedSchedulerWrap">
          <DispatchCalendar
            requests={requests}
            vehicleMap={vehicleMap}
            vehicleOptions={vehicleOptions}
            driverColorMap={driverColorMap}
            loading={loading}
            toPHDate={toPHDate}
            toPHTime={toPHTime}
            activeDate={timelineDate}
            onDateChange={setTimelineDate}
            activeRequestId={selectedRequest?.id ?? null}
            onSelectRequest={setSelectedRequest}
          />

          <DispatchBoard
            requests={requests}
            vehicleOptions={vehicleOptions}
            vehicleMap={vehicleMap}
            statusMap={statusMap}
            toPHTime={toPHTime}
            onSelectRequest={setSelectedRequest}
          />

          <div className="schedTimelineGrid">
            <DriverTimeline
              requests={requests}
              vehicleMap={vehicleMap}
              statusMap={statusMap}
              date={timelineDate}
              onDateChange={setTimelineDate}
              toPHDate={toPHDate}
              onSelectRequest={setSelectedRequest}
            />
            <VehicleTimeline
              requests={requests}
              vehicleOptions={vehicleOptions}
              vehicleMap={vehicleMap}
              statusMap={statusMap}
              date={timelineDate}
              onDateChange={setTimelineDate}
              toPHDate={toPHDate}
              onSelectRequest={setSelectedRequest}
            />
          </div>
        </div>
      ) : (
        <>
          {/* ================= SEARCH & FILTERS ================= */}
          <div className="schedControls">
            <div className="schedSearchWrap">
              <Search size={16} className="schedSearchIcon" />
              <input
                type="text"
                placeholder="Search code, name, passengers, contact, flight, location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="schedSearchInput"
              />
            </div>

            <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="schedSelect">
              <option value="All">All Pickup Dates</option>
              {pickupDates.map((d) => (
                <option key={d} value={d}>
                  {toPHDate(d) || d}
                </option>
              ))}
            </select>

            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="schedSelect">
              <option value="All">All Statuses</option>
              {STATUS_OPTIONS.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>

            <select value={vehicleFilter} onChange={(e) => setVehicleFilter(e.target.value)} className="schedSelect">
              <option value="All">All Vehicles</option>
              {vehicleOptions.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>

            <select value={driverFilter} onChange={(e) => setDriverFilter(e.target.value)} className="schedSelect">
              <option value="All">All Drivers</option>
              {driverOptions.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {activeFilterChips.length > 0 && (
            <div className="schedChips">
              {activeFilterChips.map((chip) => (
                <button key={chip.label} className="schedChip" onClick={chip.clear}>
                  {chip.label}
                  <X size={12} />
                </button>
              ))}
              <button className="schedChipClearAll" onClick={clearAllFilters}>
                Clear All
              </button>
            </div>
          )}

          <div className="schedCount">
            Showing {rows.length} of {requests.length} requests
          </div>

          {/* ================= TABLE ================= */}
          <div className="schedTableWrap" ref={tableRef}>
            {loading ? (
              <p className="loading">Loading...</p>
            ) : rows.length === 0 ? (
              <div className="schedEmpty">
                <CalendarX2 size={28} />
                <span>No requests match your search or filters.</span>
              </div>
            ) : (
              <table className="schedTable">
                <colgroup>
                  <col style={{ width: "110px" }} />
                  <col style={{ width: "100px" }} />
                  <col style={{ width: "130px" }} />
                  <col style={{ width: "150px" }} />
                  <col style={{ width: "90px" }} />
                  <col style={{ width: "190px" }} />
                  <col style={{ width: "150px" }} />
                  <col style={{ width: "90px" }} />
                  <col style={{ width: "170px" }} />
                  <col style={{ width: "170px" }} />
                  <col style={{ width: "190px" }} />
                  <col style={{ width: "210px" }} />
                  <col style={{ width: "110px" }} />
                </colgroup>
                <thead>
                  <tr>
                    <th onClick={() => toggleSort("pick_up_date")} className="schedSortable">
                      <span>Pickup Date {sortIcon("pick_up_date")}</span>
                    </th>
                    <th onClick={() => toggleSort("pick_up_time")} className="schedSortable">
                      <span>Pickup Time {sortIcon("pick_up_time")}</span>
                    </th>
                    <th>Request Code</th>
                    <th>Requester</th>
                    <th>Passengers</th>
                    <th>Passenger Name(s)</th>
                    <th>Contact Person</th>
                    <th>Flight No.</th>
                    <th>Pickup Location</th>
                    <th>Drop-off Location</th>
                    <th>Assigned Vehicle</th>
                    <th>Assigned Driver</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => {
                    const vehicles = splitVehicles(r.assigned_vehicle);
                    const driverNames = vehicles
                      .map((v) => lookupDriver(v, vehicleMap)?.driver)
                      .filter((d): d is string => Boolean(d));

                    return (
                      <tr
                        key={r.id}
                        className={!r.assigned_vehicle ? "schedRowUnassigned" : ""}
                        onClick={() => {
                          setSelectedRequest(r);
                          if (r.pick_up_date) setTimelineDate(r.pick_up_date);
                        }}
                        style={{ cursor: "pointer" }}
                      >
                        <td>{toPHDate(r.pick_up_date) || "—"}</td>
                        <td>{toPHTime(r.pick_up_time) || "—"}</td>
                        <td className="schedMono">{r.request_code || "—"}</td>
                        <td className="schedWrap">{r.requester_name || "—"}</td>
                        <td>{getPassengerCount(r)}</td>
                        <td className="schedWrap">
                          {r.passenger_names || r.requester_name || "—"}
                        </td>
                        <td className="schedWrap">{r.contact_person || "—"}</td>
                        <td>{r.flight_no || "—"}</td>
                        <td className="schedWrap">{r.pickup_location || "—"}</td>
                        <td className="schedWrap">{r.destination || "—"}</td>
                        <td className="schedWrap">
                          {vehicles.length > 0 ? (
                            <div className="schedMultiList">
                              {vehicles.map((v) => (
                                <div key={v}>{v.split(" - ")[0]}</div>
                              ))}
                            </div>
                          ) : (
                            "Unassigned"
                          )}
                        </td>
                        <td className="schedWrap">
                          {driverNames.length > 0 ? (
                            <div className="schedMultiList">
                              {driverNames.map((d) => (
                                <div key={d}>{d}</div>
                              ))}
                            </div>
                          ) : (
                            "—"
                          )}
                        </td>
                        <td>
                          <span className="schedStatusBadge" style={{ background: statusColor(r.status) }}>
                            {r.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}

      {/* ================= NEW: TRIP DETAIL SLIDE-OVER PANEL ================= */}
      {selectedRequest && (
        <TripDetailPanel
          request={selectedRequest}
          requests={requests}
          vehicleOptions={vehicleOptions}
          vehicleMap={vehicleMap}
          statusMap={statusMap}
          driverColorMap={driverColorMap}
          toPHDate={toPHDate}
          toPHTime={toPHTime}
          onClose={() => setSelectedRequest(null)}
          onUpdateStatus={
            onUpdateStatus
              ? (id, status) => {
                  onUpdateStatus(id, status);
                  setSelectedRequest((prev) => (prev && prev.id === id ? { ...prev, status } : prev));
                }
              : undefined
          }
          onAssignVehicle={
            onAssignVehicle
              ? (id, vehicleString) => {
                  onAssignVehicle(id, vehicleString);
                  // Mirrors updateAssignedVehicle()'s own status side-effect in
                  // page.tsx (assigning -> "Approved", clearing -> "Pending") so
                  // the panel's status dropdown reflects it immediately instead
                  // of waiting for the next realtime refresh.
                  setSelectedRequest((prev) =>
                    prev && prev.id === id
                      ? { ...prev, assigned_vehicle: vehicleString, status: vehicleString ? "Approved" : "Pending" }
                      : prev
                  );
                }
              : undefined
          }
          // onEditSchedule / onCompleteTrip are intentionally left unset here --
          // wire them the same way if/when you build that logic. Each button
          // hides itself until wired.
        />
      )}

      <style jsx>{`
        .schedSection {
          background: white;
          border-radius: 20px;
          padding: 20px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
          margin-bottom: 28px;
        }

        .schedTitleRow {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 4px;
        }

        .schedTitle {
          margin: 0 0 12px;
          font-size: 24px;
          font-weight: bold;
        }

        .schedSubtitle {
          color: #64748b;
          font-size: 13px;
          margin-top: -6px;
          margin-bottom: 16px;
        }

        .schedViewSwitch {
          display: flex;
          gap: 4px;
          background: #f1f5f9;
          padding: 4px;
          border-radius: 12px;
          height: fit-content;
        }

        .schedViewBtn {
          display: flex;
          align-items: center;
          gap: 6px;
          border: none;
          background: transparent;
          padding: 9px 16px;
          border-radius: 9px;
          font-weight: 700;
          font-size: 13px;
          color: #475569;
          cursor: pointer;
          font-family: inherit;
        }

        .schedViewBtnActive {
          background: linear-gradient(90deg, #f27a35, #a61e22);
          color: white;
        }

        .schedSchedulerWrap {
          display: flex;
          flex-direction: column;
          gap: 20px;
          margin-bottom: 8px;
        }

        .schedTimelineGrid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
        }

        .schedPanelsGrid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-bottom: 20px;
        }

        .schedControls {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: 12px;
        }

        .schedSearchWrap {
          position: relative;
          flex: 2;
          min-width: 260px;
        }

        .schedSearchIcon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
        }

        .schedSearchInput {
          width: 100%;
          padding: 12px 12px 12px 36px;
          border-radius: 12px;
          border: 2px solid #cbd5e1;
          font-size: 14px;
          color: #111827;
          background: white;
          outline: none;
          box-sizing: border-box;
        }

        .schedSelect {
          flex: 1;
          min-width: 160px;
          padding: 12px;
          border-radius: 12px;
          border: 2px solid #cbd5e1;
          color: #111827;
          background: white;
          outline: none;
        }

        .schedChips {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          align-items: center;
          margin-bottom: 12px;
        }

        .schedChip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #eef2ff;
          color: #1f5aa6;
          border: 1px solid #c7d7f5;
          padding: 6px 10px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          font-family: inherit;
        }

        .schedChip:hover {
          background: #e0e9fb;
        }

        .schedChipClearAll {
          background: transparent;
          border: none;
          color: #94a3b8;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          text-decoration: underline;
          font-family: inherit;
        }

        .schedCount {
          font-size: 12px;
          color: #64748b;
          font-weight: 600;
          margin-bottom: 10px;
        }

        .schedTableWrap {
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          overflow: auto;
          max-height: 640px;
          scroll-margin-top: 16px;
        }

        .schedTable {
          border-collapse: collapse;
          table-layout: fixed;
          width: 100%;
          min-width: 1860px;
          font-size: 13px;
        }

        .schedTable thead th {
          position: sticky;
          top: 0;
          z-index: 5;
          background: #0f172a;
          color: white;
          text-align: left;
          padding: 12px 14px;
          font-weight: 700;
          font-size: 12px;
          white-space: normal;
          word-break: break-word;
        }

        .schedSortable {
          cursor: pointer;
          user-select: none;
        }

        .schedSortable span {
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .schedSortable:hover {
          background: #1e293b;
        }

        .schedTable tbody td {
          padding: 10px 14px;
          border-bottom: 1px solid #eef2f7;
          color: #111827;
          vertical-align: top;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .schedRowUnassigned {
          box-shadow: inset 3px 0 0 #ef4444;
        }

        .schedWrap {
          white-space: normal;
          overflow: visible;
          text-overflow: clip;
          word-break: break-word;
        }

        .schedMultiList {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .schedMono {
          font-family: monospace;
          font-weight: 600;
        }

        .schedTable tbody tr:hover {
          background: #f8fafc;
        }

        .schedStatusBadge {
          color: white;
          padding: 4px 10px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 700;
          white-space: nowrap;
        }

        .schedEmpty {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          padding: 48px 0;
          color: #94a3b8;
          font-weight: 600;
        }

        .loading {
          text-align: center;
          padding: 40px 0;
        }

        @media (max-width: 1024px) {
          .schedPanelsGrid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .schedTitleRow {
            flex-direction: column;
          }
          .schedViewSwitch {
            width: 100%;
          }
          .schedViewBtn {
            flex: 1;
            justify-content: center;
          }
          .schedControls {
            flex-direction: column;
          }
          .schedSelect {
            width: 100%;
          }
          .schedTableWrap {
            max-height: 70vh;
          }
        }
      `}</style>
    </section>
  );
}
