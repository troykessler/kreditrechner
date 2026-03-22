import { useMemo, useState } from "react";
import { calcAnnuitaetendarlehen } from "../utils/annuitaetendarlehen";
import InputField from "./InputField";
import SummaryCards from "./SummaryCards";
import AmortizationChart from "./AmortizationChart";
import AmortizationTable from "./AmortizationTable";

const formatK = (v: number) => {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(2)} Mio €`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(0)}k €`;
  return `${v} €`;
};

export default function AnnuitaetenRechner() {
  const [kreditsumme, setKreditsumme] = useState(300_000);
  const [zinssatz, setZinssatz] = useState(3.5);
  const [laufzeit, setLaufzeit] = useState(20);

  const result = useMemo(
    () => calcAnnuitaetendarlehen({ kreditsumme, zinssatz, laufzeit }),
    [kreditsumme, zinssatz, laufzeit]
  );

  return (
    <div className="rechner-layout">
      <aside className="sidebar">
        <h2 className="sidebar-title">Parameter</h2>

        <InputField
          label="Kreditsumme"
          value={kreditsumme}
          onChange={setKreditsumme}
          min={10_000}
          max={2_000_000}
          step={5_000}
          unit="€"
          formatDisplay={formatK}
        />

        <InputField
          label="Sollzinssatz (p.a.)"
          value={zinssatz}
          onChange={setZinssatz}
          min={0.1}
          max={15}
          step={0.05}
          unit="%"
          formatDisplay={(v) => `${v.toFixed(2)} %`}
        />

        <InputField
          label="Laufzeit"
          value={laufzeit}
          onChange={setLaufzeit}
          min={1}
          max={40}
          step={1}
          unit="Jahre"
          formatDisplay={(v) => `${v} Jahre`}
        />

        <div className="sidebar-info">
          <div className="info-row">
            <span>Anfängliche Tilgungsrate</span>
            <strong>
              {(((result.monatlicheRate * 12 - kreditsumme * (zinssatz / 100)) / kreditsumme) * 100).toFixed(2)} %
            </strong>
          </div>
          <div className="info-row">
            <span>Effektiver Jahreszins</span>
            <strong>{zinssatz.toFixed(2)} %</strong>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <SummaryCards
          monatlicheRate={result.monatlicheRate}
          gesamtzahlung={result.gesamtzahlung}
          gesamtzinsen={result.gesamtzinsen}
          kreditsumme={kreditsumme}
        />
        <AmortizationChart data={result.tilgungsplan} />
        <AmortizationTable data={result.tilgungsplan} />
      </main>
    </div>
  );
}
