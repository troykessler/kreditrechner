import { useState } from "react";
import type { YearlyEntry, MonthlyEntry } from "../types/loan";
import { formatEuro } from "../utils/format";

interface Props {
  yearly: YearlyEntry[];
  monthly: MonthlyEntry[];
  view: "jährlich" | "monatlich";
}

const DEFAULT_ROWS = 12;

export default function AmortizationTable({ yearly, monthly, view }: Props) {
  const [expanded, setExpanded] = useState(false);

  const allRows = view === "monatlich" ? monthly : yearly;
  const rows = expanded ? allRows : allRows.slice(0, DEFAULT_ROWS);
  const isMonatlich = view === "monatlich";

  return (
    <div className="table-container">
      <h2 className="section-title">Tilgungsplan – {isMonatlich ? "Monatsübersicht" : "Jahresübersicht"}</h2>
      <div className="table-scroll">
        <table className="amort-table">
          <thead>
            <tr>
              <th>{isMonatlich ? "Monat" : "Jahr"}</th>
              <th>{isMonatlich ? "Rate" : "Monatliche Rate"}</th>
              <th>{isMonatlich ? "Zinsen" : "Jahreszinsen"}</th>
              <th>{isMonatlich ? "Tilgung" : "Jahrestilgung"}</th>
              <th>Restschuld</th>
            </tr>
          </thead>
          <tbody>
            {isMonatlich
              ? (rows as MonthlyEntry[]).map((row) => (
                  <tr key={row.monat}>
                    <td>{row.monat}</td>
                    <td>{formatEuro(row.rate)}</td>
                    <td className="zinsen-cell">{formatEuro(row.zinsbetrag)}</td>
                    <td className="tilgung-cell">{formatEuro(row.tilgungsbetrag)}</td>
                    <td>{formatEuro(row.restschuld)}</td>
                  </tr>
                ))
              : (rows as YearlyEntry[]).map((row) => (
                  <tr key={row.jahr}>
                    <td>{row.jahr}</td>
                    <td>{formatEuro(row.rate / 12)}</td>
                    <td className="zinsen-cell">{formatEuro(row.zinsbetrag)}</td>
                    <td className="tilgung-cell">{formatEuro(row.tilgungsbetrag)}</td>
                    <td>{formatEuro(row.restschuld)}</td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
      {allRows.length > DEFAULT_ROWS && (
        <button className="expand-btn" onClick={() => setExpanded((e) => !e)}>
          {expanded
            ? "Weniger anzeigen ↑"
            : `Alle ${allRows.length} ${isMonatlich ? "Monate" : "Jahre"} anzeigen ↓`}
        </button>
      )}
    </div>
  );
}
