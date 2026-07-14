// Shared types for the Scheduling Board feature set.
// Mirrors the relevant subset of the `Request` shape defined in the Admin
// Dashboard page. Kept here (rather than imported from page.tsx) so this
// component tree doesn't depend on that file's exact path in your project.
// If you'd rather share one definition end-to-end, move this into your own
// central types module and import it from page.tsx as well.
//
// Named `ScheduleRequest` (not `Request`) on purpose: `page.tsx` already
// declares its own local `export type Request = {...}`. Two different
// types with the identical name `Request` in the same project is exactly
// the kind of thing that throws "Import declaration conflicts with local
// declaration of 'Request'" the moment both get imported into one file.
// page.tsx's Request (the fuller shape) is structurally compatible with
// this narrower ScheduleRequest, so passing page.tsx's `requests` prop
// straight into these components continues to work with no changes there.
export type ScheduleRequest = {
  id: number;
  request_code: string | null;
  requester_name: string;
  passenger_names: string | null;
  contact_person: string | null;
  flight_no: string | null;
  pickup_location: string | null;
  destination: string | null;
  assigned_vehicle: string | null;
  pick_up_date: string | null;
  pick_up_time: string | null;
  // NEW: dispatcher-set trip end time ("HH:mm" or "HH:mm:ss"). Nullable --
  // older/unset rows fall back to DEFAULT_TRIP_DURATION_MIN in the helpers
  // below, so nothing needs a backfill before this ships.
  drop_off_time?: string | null;
  status: string;
};

export type VehicleInfo = { driver: string; phone: string };
export type VehicleMap = Record<string, VehicleInfo>;

// `assigned_vehicle` stores one or more vehicles joined with " | ",
// e.g. "Toyota Van - SKB 5333 | Toyota Innova - SHZ 943".
export function splitVehicles(assigned: string | null | undefined): string[] {
  return (assigned || "").split(" | ").filter(Boolean);
}

// Vehicle strings are matched by prefix against vehicleMap keys, same
// convention used for the email lookup logic in the Admin Dashboard.
export function lookupDriver(
  vehicle: string,
  vehicleMap: VehicleMap
): VehicleInfo | null {
  const key = Object.keys(vehicleMap).find((k) => vehicle.startsWith(k));
  return key ? vehicleMap[key] : null;
}

// ================= NEW: SCHEDULER / DISPATCH HELPERS =================
// Everything below is additive -- no existing export above was changed.

// -------- Manual resource status (Off Duty / Maintenance) --------
// Backed by the new `vehicle_status` table (one row per vehicle string,
// same keys as vehicleMap/vehicleOptions). Driver status is derived from
// the vehicle's status since this event maps one driver to one vehicle.
export type ManualStatus = "Available" | "Maintenance" | "Off Duty";

export type VehicleStatusRow = {
  vehicle: string;
  status: ManualStatus;
  note: string | null;
  updated_at?: string;
};

export type VehicleStatusMap = Record<string, ManualStatus>;

// -------- Trip window math --------
// Default duration used whenever a request has no drop_off_time yet.
export const DEFAULT_TRIP_DURATION_MIN = 60;

// Parses "HH:mm" or "HH:mm:ss" into minutes-since-midnight. Returns null
// for anything unparseable so callers can treat it as "unscheduled".
export function timeToMinutes(t: string | null | undefined): number | null {
  if (!t) return null;
  const match = /^(\d{1,2}):(\d{2})/.exec(t);
  if (!match) return null;
  const h = Number(match[1]);
  const m = Number(match[2]);
  if (Number.isNaN(h) || Number.isNaN(m)) return null;
  return h * 60 + m;
}

export function minutesToTime(mins: number): string {
  const wrapped = ((mins % 1440) + 1440) % 1440;
  const h = Math.floor(wrapped / 60);
  const m = wrapped % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export type TripWindow = { start: number; end: number };

// Resolves a request's blocking window on its pickup day. Falls back to
// DEFAULT_TRIP_DURATION_MIN when drop_off_time isn't set. Returns null
// when there isn't even a pickup time to anchor on (can't schedule it).
export function getTripWindow(r: ScheduleRequest): TripWindow | null {
  const start = timeToMinutes(r.pick_up_time);
  if (start === null) return null;
  const explicitEnd = timeToMinutes(r.drop_off_time);
  const end = explicitEnd !== null && explicitEnd > start
    ? explicitEnd
    : start + DEFAULT_TRIP_DURATION_MIN;
  return { start, end };
}

export function windowsOverlap(a: TripWindow, b: TripWindow): boolean {
  return a.start < b.end && b.start < a.end;
}

// A request is only ever cross-checked against others on the SAME pickup
// date -- cross-day comparisons are meaningless for dispatch conflicts.
function samePickupDay(a: ScheduleRequest, b: ScheduleRequest): boolean {
  return !!a.pick_up_date && a.pick_up_date === b.pick_up_date;
}

const NON_BLOCKING_STATUSES = new Set(["Completed", "Disapproved"]);

// -------- Conflict detection --------
// Returns, for every request id, the list of OTHER requests that overlap
// it on the same driver or the same vehicle. An empty array means clear.
export function getConflicts(
  requests: ScheduleRequest[],
  vehicleMap: VehicleMap
): Map<number, ScheduleRequest[]> {
  const result = new Map<number, ScheduleRequest[]>();
  const schedulable = requests.filter(
    (r) => !NON_BLOCKING_STATUSES.has(r.status) && getTripWindow(r) !== null
  );

  for (const r of schedulable) {
    const rWin = getTripWindow(r)!;
    const rVehicles = splitVehicles(r.assigned_vehicle);
    const rDrivers = rVehicles
      .map((v) => lookupDriver(v, vehicleMap)?.driver)
      .filter((d): d is string => !!d);

    const conflicts: ScheduleRequest[] = [];

    for (const other of schedulable) {
      if (other.id === r.id) continue;
      if (!samePickupDay(r, other)) continue;

      const oWin = getTripWindow(other)!;
      if (!windowsOverlap(rWin, oWin)) continue;

      const oVehicles = splitVehicles(other.assigned_vehicle);
      const sharesVehicle = rVehicles.some((v) => oVehicles.includes(v));

      const oDrivers = oVehicles
        .map((v) => lookupDriver(v, vehicleMap)?.driver)
        .filter((d): d is string => !!d);
      const sharesDriver = rDrivers.some((d) => oDrivers.includes(d));

      if (sharesVehicle || sharesDriver) conflicts.push(other);
    }

    if (conflicts.length > 0) result.set(r.id, conflicts);
  }

  return result;
}

// -------- Availability (per driver / per vehicle, for a given date) --------
export type Availability = "available" | "busy" | "conflict" | "off_duty" | "maintenance";

export function getVehicleAvailability(
  vehicle: string,
  date: string | null,
  requests: ScheduleRequest[],
  conflicts: Map<number, ScheduleRequest[]>,
  statusMap: VehicleStatusMap
): Availability {
  const manual = statusMap[vehicle];
  if (manual === "Maintenance") return "maintenance";
  if (manual === "Off Duty") return "off_duty";

  const todaysTrips = requests.filter(
    (r) =>
      !NON_BLOCKING_STATUSES.has(r.status) &&
      r.pick_up_date === date &&
      splitVehicles(r.assigned_vehicle).includes(vehicle)
  );

  if (todaysTrips.some((r) => conflicts.has(r.id))) return "conflict";
  if (todaysTrips.length > 0) return "busy";
  return "available";
}

export function getDriverAvailability(
  driver: string,
  date: string | null,
  requests: ScheduleRequest[],
  vehicleMap: VehicleMap,
  conflicts: Map<number, ScheduleRequest[]>,
  statusMap: VehicleStatusMap
): Availability {
  // Find which vehicle(s) this driver is assigned to, so we can reuse
  // the manual-status lookup (Off Duty / Maintenance is set per vehicle).
  const driverVehicles = Object.keys(vehicleMap).filter(
    (v) => vehicleMap[v].driver === driver
  );
  for (const v of driverVehicles) {
    const manual = statusMap[v];
    if (manual === "Maintenance") return "maintenance";
    if (manual === "Off Duty") return "off_duty";
  }

  const todaysTrips = requests.filter((r) => {
    if (NON_BLOCKING_STATUSES.has(r.status)) return false;
    if (r.pick_up_date !== date) return false;
    return splitVehicles(r.assigned_vehicle).some(
      (v) => lookupDriver(v, vehicleMap)?.driver === driver
    );
  });

  if (todaysTrips.some((r) => conflicts.has(r.id))) return "conflict";
  if (todaysTrips.length > 0) return "busy";
  return "available";
}

export const AVAILABILITY_LABEL: Record<Availability, string> = {
  available: "🟢 Available",
  busy: "🟡 Busy",
  conflict: "🔴 Conflict",
  off_duty: "⚪ Off Duty",
  maintenance: "🔴 Maintenance",
};

export const AVAILABILITY_COLOR: Record<Availability, string> = {
  available: "#22c55e",
  busy: "#facc15",
  conflict: "#ef4444",
  off_duty: "#94a3b8",
  maintenance: "#ef4444",
};

// ================= NEW: DRIVER COLOR CODING =================
// Each driver gets one consistent color across the whole calendar so a
// dispatcher can spot a driver's full workload / any overlap at a glance,
// instead of the card color meaning "status" (status becomes a small
// badge instead -- see STATUS_BADGE below).
const DRIVER_PALETTE = [
  "#2563eb", // blue
  "#16a34a", // green
  "#7c3aed", // purple
  "#f97316", // orange
  "#db2777", // pink/red
  "#0d9488", // teal
  "#ca8a04", // amber
  "#0891b2", // cyan
  "#9333ea", // violet
  "#65a30d", // lime
];

const UNASSIGNED_DRIVER_COLOR = "#94a3b8"; // neutral gray

// Deterministic: same driver always gets the same color for a given
// sorted driver roster, regardless of render order or filtering.
export function getDriverColorMap(vehicleMap: VehicleMap): Record<string, string> {
  const drivers = Array.from(new Set(Object.values(vehicleMap).map((v) => v.driver))).sort();
  const map: Record<string, string> = {};
  drivers.forEach((d, i) => {
    map[d] = DRIVER_PALETTE[i % DRIVER_PALETTE.length];
  });
  return map;
}

export function getDriverColor(
  driver: string | null | undefined,
  driverColorMap: Record<string, string>
): string {
  if (!driver) return UNASSIGNED_DRIVER_COLOR;
  return driverColorMap[driver] || UNASSIGNED_DRIVER_COLOR;
}

// ================= NEW: STATUS BADGE (small indicator, not card color) =================
export const STATUS_BADGE: Record<string, string> = {
  Pending: "🟡",
  Approved: "🟢",
  "On the way": "🔵",
  Completed: "⚫",
  Disapproved: "🔴",
  Emergency: "🟣",
};

export function getStatusBadge(status: string): string {
  return STATUS_BADGE[status] || "⚪";
}

// Solid colors for the status "pill" chips (Dispatch Calendar header cards,
// Today's Dispatch Queue, Status Legend). Separate from STATUS_BADGE (which
// is just the little emoji dot) since the pill needs a real background color.
export const STATUS_COLOR: Record<string, string> = {
  Pending: "#f59e0b",
  Approved: "#22c55e",
  "On the way": "#3b82f6",
  Completed: "#64748b",
  Disapproved: "#ef4444",
  Emergency: "#a855f7",
};

export function getStatusColor(status: string): string {
  return STATUS_COLOR[status] || "#94a3b8";
}

// ================= NEW: PASSENGER COUNT =================
// There's no dedicated passenger-count column -- passenger_names stores a
// comma-separated list (or a single name). Count entries, minimum 1.
export function getPassengerCount(r: ScheduleRequest): number {
  const raw = (r.passenger_names || "").trim();
  if (!raw) return 1;
  return raw.split(",").map((s) => s.trim()).filter(Boolean).length || 1;
}

export {};
