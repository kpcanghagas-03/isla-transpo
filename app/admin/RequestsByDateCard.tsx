"use client";

import { useMemo } from "react";
import { CalendarRange, Flame } from "lucide-react";
import { Request } from "./types";

type RequestsByDateCardProps = {
  requests: Request[];
  activeDate: string | null;
  onSelectDate: (date: string | null) => void;
  toPHDate: (isoDate: string | null) => string | null;
};

export default function RequestsByDateCard({
  requests,
  activeDate,
  onSelectDate,
  toPHDate,
}: RequestsByDateCardProps) {
  const dayCounts = useMemo(() => {
    const counts = new Map<string, number>();

    requests.forEach((r) => {
      if (!r.pick_up_date) return;
      counts.set(r.pick_up_date, (counts.get(r.pick_up_date) || 0) + 1);
    });

    const rows = Array.from(counts.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));

    const max = rows.reduce((m, r) => Math.max(m, r.count), 0);

    return { rows, max };
  }, [requests]);

  return (
    <div className="rbdPanel">
      <div className="rbdHeader">
        <CalendarRange size={16} />
        <span>Requests by Pickup Date</span>
      </div>

      {dayCounts.rows.length === 0 ? (
        <p className="rbdEmpty">No scheduled pickup dates yet.</p>
      ) : (
        <div className="rbdList">
          {dayCounts.rows.map(({ date, count }) => {
            const isActive = activeDate === date;
            const isBusiest = count === dayCounts.max && count > 0;

            return (
              <button
                key={date}
                className={`rbdRow ${isActive ? "rbdRowActive" : ""}`}
                onClick={() => onSelectDate(isActive ? null : date)}
              >
                <span className="rbdDate">
                  {toPHDate(date) || date}
                  {isBusiest && <Flame size={12} className="rbdFlame" />}
                </span>
                <span className="rbdCount">{count} Request{count === 1 ? "" : "s"}</span>
              </button>
            );
          })}
        </div>
      )}

      <style jsx>{`
        .rbdPanel {
          background: white;
          border-radius: 16px;
          padding: 16px;
          box-shadow: 0 8px 18px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(0, 0, 0, 0.05);
          display: flex;
          flex-direction: column;
          gap: 12px;
          height: 100%;
        }

        .rbdHeader {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 700;
          color: #0f172a;
          font-size: 14px;
        }

        .rbdEmpty {
          font-size: 12px;
          color: #94a3b8;
          font-weight: 600;
        }

        .rbdList {
          display: flex;
          flex-direction: column;
          gap: 6px;
          max-height: 260px;
          overflow-y: auto;
        }

        .rbdRow {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 8px;
          background: #f8fafc;
          border: 1px solid transparent;
          border-radius: 10px;
          padding: 9px 10px;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.15s ease;
        }

        .rbdRow:hover {
          background: #f1f5f9;
        }

        .rbdRowActive {
          border-color: #f27a35;
          background: #fef1e9;
        }

        .rbdDate {
          font-size: 13px;
          font-weight: 700;
          color: #111827;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .rbdFlame {
          color: #f97316;
        }

        .rbdCount {
          font-size: 11px;
          font-weight: 700;
          color: #1f5aa6;
          white-space: nowrap;
        }
      `}</style>
    </div>
  );
}