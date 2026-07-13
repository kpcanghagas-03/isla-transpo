// Shared types for the Scheduling Board feature set.
// Mirrors the relevant subset of the `Request` shape defined in the Admin
// Dashboard page. Kept here (rather than imported from page.tsx) so this
// component tree doesn't depend on that file's exact path in your project.
// If you'd rather share one definition end-to-end, move this into your own
// central types module and import it from page.tsx as well.
export type Request = {
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
