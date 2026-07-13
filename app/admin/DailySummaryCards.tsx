"use client";

import { useMemo } from "react";
import { Users, Clock, CheckCircle, Truck, Flag, AlertTriangle } from "lucide-react";
import { ScheduleRequest } from "./types";

type DailySummaryCardsProps = {
  requests: ScheduleRequest[];
  activeStatus: string | null;
  onSelectStatus: (status: string | null) => void;
  unassignedOnly: boolean;
  onToggleUnassigned: () => void;
};

export default function DailySummaryCards({
  requests,
  activeStatus,
  onSelectStatus,
  unassignedOnly,
  onToggleUnassigned,
}: DailySummaryCardsProps) {
  const counts = useMemo(() => {
    let pending = 0;
    let assigned = 0;
    let onTheWay = 0;
    let completed = 0;
    let noVehicle = 0;

    requests.forEach((r) => {
      if (r.status === "Pending") pending++;
      // "Assigned" tracks the same status the rest of the dashboard uses
      // for a vehicle-assigned request ("Approved") -- kept consistent
      // with updateAssignedVehicle() in the Admin Dashboard rather than
      // introducing a new status value.
      if (r.status === "Approved") assigned++;
      if (r.status === "On the way") onTheWay++;
      if (r.status === "Completed") completed++;
      if (!r.assigned_vehicle) noVehicle++;
    });

    return {
      total: requests.length,
      pending,
      assigned,
      onTheWay,
      completed,
      noVehicle,
    };
  }, [requests]);

  const cards = [
    {
      key: null as string | null,
      label: "Total Requests",
      value: counts.total,
      icon: <Users size={18} />,
      accent: "#0ea5e9",
      isUnassignedCard: false,
    },
    {
      key: "Pending",
      label: "Pending",
      value: counts.pending,
      icon: <Clock size={18} />,
      accent: "#facc15",
      isUnassignedCard: false,
    },
    {
      key: "Approved",
      label: "Assigned",
      value: counts.assigned,
      icon: <CheckCircle size={18} />,
      accent: "#22c55e",
      isUnassignedCard: false,
    },
    {
      key: "On the way",
      label: "On the Way",
      value: counts.onTheWay,
      icon: <Truck size={18} />,
      accent: "#3b82f6",
      isUnassignedCard: false,
    },
    {
      key: "Completed",
      label: "Completed",
      value: counts.completed,
      icon: <Flag size={18} />,
      accent: "#6b7280",
      isUnassignedCard: false,
    },
    {
      key: "unassigned",
      label: "No Vehicle Assigned",
      value: counts.noVehicle,
      icon: <AlertTriangle size={18} />,
      accent: "#ef4444",
      isUnassignedCard: true,
    },
  ];

  return (
    <div className="dscGrid">
      {cards.map((card) => {
        const isActive = card.isUnassignedCard
          ? unassignedOnly
          : card.key === null
          ? activeStatus === null && !unassignedOnly
          : activeStatus === card.key;

        return (
          <button
            key={card.label}
            className={`dscCard ${isActive ? "dscCardActive" : ""}`}
            style={{ borderLeft: `5px solid ${card.accent}` }}
            onClick={() =>
              card.isUnassignedCard
                ? onToggleUnassigned()
                : onSelectStatus(activeStatus === card.key ? null : card.key)
            }
          >
            <div className="dscIcon" style={{ color: card.accent }}>
              {card.icon}
            </div>
            <div className="dscValue">{card.value}</div>
            <div className="dscLabel">{card.label}</div>
          </button>
        );
      })}

      <style jsx>{`
        .dscGrid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 12px;
          margin-bottom: 20px;
        }

        .dscCard {
          background: white;
          border-radius: 14px;
          padding: 12px 14px;
          box-shadow: 0 8px 18px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(0, 0, 0, 0.05);
          display: flex;
          flex-direction: column;
          gap: 6px;
          min-height: 82px;
          text-align: left;
          cursor: pointer;
          transition: all 0.15s ease;
          font-family: inherit;
        }

        .dscCard:hover {
          transform: translateY(-2px);
          box-shadow: 0 14px 26px rgba(0, 0, 0, 0.16);
        }

        .dscCardActive {
          outline: 2px solid #1f5aa6;
          outline-offset: -2px;
        }

        .dscIcon {
          display: flex;
          justify-content: flex-end;
        }

        .dscValue {
          font-size: 22px;
          font-weight: 800;
          color: #0f172a;
        }

        .dscLabel {
          font-size: 12px;
          font-weight: 600;
          color: #64748b;
        }

        @media (max-width: 768px) {
          .dscGrid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </div>
  );
}
