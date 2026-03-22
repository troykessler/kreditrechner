import { useState } from "react";
import KreditbedarfRechner, { type KreditbedarfState } from "./components/KreditbedarfRechner";
import AnnuitaetenRechner from "./components/AnnuitaetenRechner";
import RatentilgungRechner from "./components/RatentilgungRechner";
import EndfaelligeRechner from "./components/EndfaelligeRechner";
import "./App.css";

type LoanType = "kreditbedarf" | "annuitaeten" | "ratentilgung" | "endfaellige";

const LOAN_TYPES: { id: LoanType; label: string }[] = [
  { id: "kreditbedarf", label: "Kreditbedarf" },
  { id: "annuitaeten", label: "Annuitätendarlehen" },
  { id: "ratentilgung", label: "Ratentilgung" },
  { id: "endfaellige", label: "Endfällige Tilgung" },
];

function minRate(kreditsumme: number, zinssatz: number) {
  return Math.ceil(kreditsumme * zinssatz / 100 / 12) + 10;
}

export default function App() {
  const [active, setActive] = useState<LoanType>("kreditbedarf");

  // Shared loan calculator params
  const [kreditsumme, setKreditsummeRaw] = useState(300_000);
  const [zinssatz, setZinssatzRaw] = useState(3.5);
  const [monatlicheRate, setMonatlicheRate] = useState(1_740);

  const setKreditsumme = (v: number) => {
    setKreditsummeRaw(v);
    setMonatlicheRate((prev) => Math.max(prev, minRate(v, zinssatz)));
  };

  const setZinssatz = (v: number) => {
    setZinssatzRaw(v);
    setMonatlicheRate((prev) => Math.max(prev, minRate(kreditsumme, v)));
  };

  const sharedParams = { kreditsumme, zinssatz, monatlicheRate, setKreditsumme, setZinssatz, setMonatlicheRate };

  // Kreditbedarf page state
  const [kreditbedarfState, setKreditbedarfState] = useState<KreditbedarfState>({
    kaufpreis: 400_000,
    eigenkapitalRaw: 80_000,
    bundeslandIndex: 6, // Hessen
    withMakler: true,
  });

  const adoptKreditsumme = (v: number, loanType: "annuitaeten" | "ratentilgung" | "endfaellige") => {
    setKreditsumme(v);
    setActive(loanType);
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-icon">📊</span>
            <span className="logo-text">Kreditrechner</span>
          </div>
          <nav className="loan-tabs">
            {LOAN_TYPES.map((t) => (
              <button
                key={t.id}
                className={`tab-btn ${active === t.id ? "active" : ""}`}
                onClick={() => setActive(t.id)}
              >
                {t.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <div className="page-wrapper">
        {active === "kreditbedarf" && (
          <KreditbedarfRechner
            state={kreditbedarfState}
            setState={setKreditbedarfState}
            onAdopt={adoptKreditsumme}
            onKreditsummeChange={setKreditsumme}
          />
        )}
        {active === "annuitaeten" && <AnnuitaetenRechner {...sharedParams} />}
        {active === "ratentilgung" && <RatentilgungRechner {...sharedParams} />}
        {active === "endfaellige" && <EndfaelligeRechner {...sharedParams} />}
      </div>
    </div>
  );
}
