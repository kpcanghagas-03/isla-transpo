"use client";

import { X, Printer, Truck } from "lucide-react";

// -------- Shared shapes (mirror what AnalyticsDashboard computes) --------
export type ReportStatusRow = { name: string; value: number; color: string };
export type ReportNamedRow = { name: string; value: number };

export type SummaryReportData = {
  total: number;
  statusData: ReportStatusRow[];
  completionRate: number;
  cancelRate: number;
  avgPassengers: number;
  unassignedCount: number;
  unassignedRate: number;
  vehicleData: ReportNamedRow[];
  driverData: ReportNamedRow[];
  routeData: ReportNamedRow[];
  peakHourLabel: string | null;
};

type SummaryReportModalProps = {
  onClose: () => void;
  periodLabel: string; // e.g. "Last 30 Days"
  periodRangeText: string; // e.g. "June 24, 2026 – July 23, 2026"
  generatedAt: string; // e.g. "July 23, 2026, 2:14 PM"
  stats: SummaryReportData;
  insights: string[];
  // Optional "vs previous period" text per KPI, already formatted (e.g.
  // "+12% vs last period"). Omit any (or the whole object) to hide.
  deltas?: {
    total?: string;
    completionRate?: string;
    cancelRate?: string;
    unassignedRate?: string;
    avgPassengers?: string;
  };
};

function pct(part: number, total: number): string {
  if (total <= 0) return "0%";
  return `${Math.round((part / total) * 100)}%`;
}

export default function SummaryReportModal({
  onClose,
  periodLabel,
  periodRangeText,
  generatedAt,
  stats,
  insights,
  deltas,
}: SummaryReportModalProps) {
  return (
    <div className="srmOverlay" onClick={onClose}>
      <div className="srmShell" onClick={(e) => e.stopPropagation()}>
        {/* -------- Toolbar (never printed) -------- */}
        <div className="srmToolbar srmNoPrint">
          <span className="srmToolbarTitle">Summary Report Preview</span>
          <div className="srmToolbarActions">
            <button className="srmPrintBtn" onClick={() => window.print()}>
              <Printer size={15} /> Print / Save as PDF
            </button>
            <button className="srmCloseBtn" onClick={onClose}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* -------- The actual printable document -------- */}
        <div className="srmPaper" id="islaReportPrintArea">
          <div className="srmLetterhead">
            <div className="srmBrand">
              <span className="srmBrandIcon">
                <Truck size={22} />
              </span>
              <div>
                <div className="srmBrandName">ISLA-TRANSPO</div>
                <div className="srmBrandTag">Safe &amp; Reliable Transport Service</div>
              </div>
            </div>
            <div className="srmMeta">
              <div className="srmMetaRow">
                <span className="srmMetaLabel">Report</span>
                <span className="srmMetaValue">Trip Analytics Summary</span>
              </div>
              <div className="srmMetaRow">
                <span className="srmMetaLabel">Period</span>
                <span className="srmMetaValue">
                  {periodLabel} ({periodRangeText})
                </span>
              </div>
              <div className="srmMetaRow">
                <span className="srmMetaLabel">Generated</span>
                <span className="srmMetaValue">{generatedAt}</span>
              </div>
            </div>
          </div>

          <div className="srmDivider" />

          {/* -------- KPI summary -------- */}
          <div className="srmSection">
            <h3 className="srmSectionTitle">At a Glance</h3>
            <div className="srmKpiRow">
              <div className="srmKpiBox">
                <span className="srmKpiValue">{stats.total}</span>
                <span className="srmKpiLabel">Total Trips</span>
                {deltas?.total && <span className="srmKpiDelta">{deltas.total}</span>}
              </div>
              <div className="srmKpiBox">
                <span className="srmKpiValue">{stats.completionRate.toFixed(1)}%</span>
                <span className="srmKpiLabel">Completion Rate</span>
                {deltas?.completionRate && <span className="srmKpiDelta">{deltas.completionRate}</span>}
              </div>
              <div className="srmKpiBox">
                <span className="srmKpiValue">{stats.cancelRate.toFixed(1)}%</span>
                <span className="srmKpiLabel">Cancellation Rate</span>
                {deltas?.cancelRate && <span className="srmKpiDelta">{deltas.cancelRate}</span>}
              </div>
              <div className="srmKpiBox">
                <span className="srmKpiValue">{stats.unassignedRate.toFixed(1)}%</span>
                <span className="srmKpiLabel">Unassigned</span>
                {deltas?.unassignedRate && <span className="srmKpiDelta">{deltas.unassignedRate}</span>}
              </div>
              <div className="srmKpiBox">
                <span className="srmKpiValue">{stats.avgPassengers.toFixed(1)}</span>
                <span className="srmKpiLabel">Avg. Passengers/Trip</span>
                {deltas?.avgPassengers && <span className="srmKpiDelta">{deltas.avgPassengers}</span>}
              </div>
            </div>
          </div>

          {/* -------- Insights -------- */}
          {insights.length > 0 && (
            <div className="srmSection">
              <h3 className="srmSectionTitle">Key Insights</h3>
              <ul className="srmInsightsList">
                {insights.map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ul>
            </div>
          )}

          {/* -------- Status breakdown -------- */}
          <div className="srmSection">
            <h3 className="srmSectionTitle">Status Breakdown</h3>
            <table className="srmTable">
              <thead>
                <tr>
                  <th>Status</th>
                  <th className="srmNumCol">Trips</th>
                  <th className="srmNumCol">% of Total</th>
                </tr>
              </thead>
              <tbody>
                {stats.statusData.map((s) => (
                  <tr key={s.name}>
                    <td>
                      <span className="srmDot" style={{ background: s.color }} />
                      {s.name}
                    </td>
                    <td className="srmNumCol">{s.value}</td>
                    <td className="srmNumCol">{pct(s.value, stats.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* -------- Top vehicles / drivers side by side -------- */}
          <div className="srmSection srmTwoCol">
            <div>
              <h3 className="srmSectionTitle">Top Vehicles</h3>
              {stats.vehicleData.length === 0 ? (
                <p className="srmEmptyNote">No vehicle assignments in this period.</p>
              ) : (
                <table className="srmTable">
                  <thead>
                    <tr>
                      <th>Vehicle</th>
                      <th className="srmNumCol">Trips</th>
                      <th className="srmNumCol">%</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.vehicleData.slice(0, 5).map((v) => (
                      <tr key={v.name}>
                        <td>{v.name}</td>
                        <td className="srmNumCol">{v.value}</td>
                        <td className="srmNumCol">{pct(v.value, stats.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            <div>
              <h3 className="srmSectionTitle">Top Drivers</h3>
              {stats.driverData.length === 0 ? (
                <p className="srmEmptyNote">No driver assignments in this period.</p>
              ) : (
                <table className="srmTable">
                  <thead>
                    <tr>
                      <th>Driver</th>
                      <th className="srmNumCol">Trips</th>
                      <th className="srmNumCol">%</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.driverData.slice(0, 5).map((d) => (
                      <tr key={d.name}>
                        <td>{d.name}</td>
                        <td className="srmNumCol">{d.value}</td>
                        <td className="srmNumCol">{pct(d.value, stats.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* -------- Top routes -------- */}
          {stats.routeData.length > 0 && (
            <div className="srmSection">
              <h3 className="srmSectionTitle">Top Routes</h3>
              <table className="srmTable">
                <thead>
                  <tr>
                    <th>Route</th>
                    <th className="srmNumCol">Trips</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.routeData.map((r) => (
                    <tr key={r.name}>
                      <td>{r.name}</td>
                      <td className="srmNumCol">{r.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="srmDivider" />

          <div className="srmSignoff">
            <div className="srmSignLine">
              <span className="srmSignLabel">Prepared by</span>
              <span className="srmSignBlank" />
            </div>
            <div className="srmSignLine">
              <span className="srmSignLabel">Date</span>
              <span className="srmSignBlank" />
            </div>
          </div>

          <div className="srmFooter">Generated by the ISLA-Transpo Dispatch System · {generatedAt}</div>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #islaReportPrintArea,
          #islaReportPrintArea * {
            visibility: visible;
          }
          #islaReportPrintArea {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            box-shadow: none !important;
            border: none !important;
            border-radius: 0 !important;
            margin: 0 !important;
          }
          .srmNoPrint {
            display: none !important;
          }
        }
      `}</style>

      <style jsx>{`
        .srmOverlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.55);
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding: 24px 16px;
          z-index: 300;
          overflow-y: auto;
        }

        .srmShell {
          background: #e2e8f0;
          border-radius: 14px;
          width: 100%;
          max-width: 820px;
          display: flex;
          flex-direction: column;
          box-shadow: 0 24px 60px rgba(0, 0, 0, 0.3);
        }

        .srmToolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          background: #0f172a;
          border-radius: 14px 14px 0 0;
        }

        .srmToolbarTitle {
          color: white;
          font-weight: 700;
          font-size: 13px;
        }

        .srmToolbarActions {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .srmPrintBtn {
          display: flex;
          align-items: center;
          gap: 6px;
          background: #1f5aa6;
          color: white;
          border: none;
          border-radius: 8px;
          padding: 7px 12px;
          font-weight: 700;
          font-size: 12.5px;
          cursor: pointer;
          font-family: inherit;
        }

        .srmPrintBtn:hover {
          background: #1a4c8c;
        }

        .srmCloseBtn {
          border: none;
          background: rgba(255, 255, 255, 0.12);
          color: white;
          border-radius: 8px;
          padding: 6px;
          cursor: pointer;
          display: flex;
        }

        .srmPaper {
          background: white;
          margin: 16px;
          padding: 40px 44px;
          border-radius: 4px;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
          color: #1e293b;
        }

        .srmLetterhead {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          flex-wrap: wrap;
          gap: 16px;
        }

        .srmBrand {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .srmBrandIcon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: #eaf1fb;
          color: #1f5aa6;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .srmBrandName {
          font-size: 19px;
          font-weight: 800;
          color: #1f5aa6;
          letter-spacing: 0.02em;
        }

        .srmBrandTag {
          font-size: 11px;
          color: #64748b;
          font-weight: 600;
        }

        .srmMeta {
          display: flex;
          flex-direction: column;
          gap: 3px;
          text-align: right;
        }

        .srmMetaRow {
          display: flex;
          gap: 8px;
          justify-content: flex-end;
          font-size: 11.5px;
        }

        .srmMetaLabel {
          color: #94a3b8;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.03em;
          min-width: 62px;
          text-align: left;
        }

        .srmMetaValue {
          color: #1e293b;
          font-weight: 700;
        }

        .srmDivider {
          height: 1px;
          background: #e2e8f0;
          margin: 22px 0;
        }

        .srmSection {
          margin-bottom: 26px;
        }

        .srmSectionTitle {
          margin: 0 0 12px;
          font-size: 13px;
          font-weight: 800;
          color: #1f5aa6;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          border-left: 3px solid #1f5aa6;
          padding-left: 8px;
        }

        .srmKpiRow {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 10px;
        }

        .srmKpiBox {
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 12px 8px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          text-align: center;
        }

        .srmKpiValue {
          font-size: 19px;
          font-weight: 800;
          color: #0f172a;
        }

        .srmKpiLabel {
          font-size: 10px;
          font-weight: 700;
          color: #64748b;
        }

        .srmKpiDelta {
          font-size: 9.5px;
          font-weight: 700;
          color: #475569;
        }

        .srmInsightsList {
          margin: 0;
          padding-left: 18px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .srmInsightsList li {
          font-size: 12.5px;
          color: #334155;
          line-height: 1.5;
        }

        .srmTable {
          width: 100%;
          border-collapse: collapse;
          font-size: 12px;
        }

        .srmTable th {
          text-align: left;
          padding: 6px 8px;
          border-bottom: 2px solid #1e293b;
          font-weight: 700;
          color: #1e293b;
        }

        .srmTable td {
          padding: 6px 8px;
          border-bottom: 1px solid #f1f5f9;
          color: #334155;
        }

        .srmTable tbody tr:nth-child(even) {
          background: #f8fafc;
        }

        .srmNumCol {
          text-align: right;
          white-space: nowrap;
        }

        .srmDot {
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 999px;
          margin-right: 6px;
        }

        .srmTwoCol {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }

        .srmEmptyNote {
          font-size: 12px;
          color: #94a3b8;
          font-style: italic;
        }

        .srmSignoff {
          display: flex;
          gap: 40px;
          margin-top: 10px;
          margin-bottom: 24px;
        }

        .srmSignLine {
          display: flex;
          align-items: flex-end;
          gap: 8px;
          flex: 1;
        }

        .srmSignLabel {
          font-size: 11px;
          font-weight: 700;
          color: #94a3b8;
          white-space: nowrap;
        }

        .srmSignBlank {
          flex: 1;
          border-bottom: 1px solid #94a3b8;
          height: 18px;
        }

        .srmFooter {
          text-align: center;
          font-size: 10.5px;
          color: #94a3b8;
          font-weight: 600;
        }

        @media (max-width: 640px) {
          .srmPaper {
            padding: 24px 18px;
            margin: 10px;
          }
          .srmKpiRow {
            grid-template-columns: repeat(2, 1fr);
          }
          .srmTwoCol {
            grid-template-columns: 1fr;
            gap: 20px;
          }
          .srmLetterhead {
            flex-direction: column;
          }
          .srmMeta {
            text-align: left;
          }
          .srmMetaRow {
            justify-content: flex-start;
          }
        }

        @media print {
          .srmOverlay {
            position: static;
            background: none;
            padding: 0;
            display: block;
          }
          .srmShell {
            background: none;
            box-shadow: none;
            max-width: none;
          }
          .srmPaper {
            margin: 0;
            box-shadow: none;
          }
        }
      `}</style>
    </div>
  );
}
