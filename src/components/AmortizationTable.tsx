import { useState } from "react";
import type { YearlyEntry } from "../types/loan";
import { formatEuro } from "../utils/format";

interface Props {
  data: YearlyEntry[];
}

export default function AmortizationTable({ data }: Props) {
  const [expanded, setExpanded] = useState(false);
  const rows = expanded ? data : data.slice(0, 5);

  return (
    <div className="table-container">
      <h2 className="section-title">Tilgungsplan – Jahresübersicht</h2>
      <div className="table-scroll">
        <table className="amort-table">
          <thead>
            <tr>
              <th>Jahr</th>
              <th>Monatliche Rate</th>
              <th>Jahreszinsen</th>
              <th>Jahrestilgung</th>
              <th>Restschuld</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
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
      {data.length > 5 && (
        <button className="expand-btn" onClick={() => setExpanded((e) => !e)}>
          {expanded ? "Weniger anzeigen ↑" : `Alle ${data.length} Jahre anzeigen ↓`}
        </button>
      )}
    </div>
  );
}
