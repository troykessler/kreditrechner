import { useState } from "react";
import AnnuitaetenRechner from "./components/AnnuitaetenRechner";
import RatentilgungRechner from "./components/RatentilgungRechner";
import EndfaelligeRechner from "./components/EndfaelligeRechner";
import "./App.css";

type LoanType = "annuitaeten" | "ratentilgung" | "endfaellige";

const LOAN_TYPES: { id: LoanType; label: string }[] = [
  { id: "annuitaeten", label: "Annuitätendarlehen" },
  { id: "ratentilgung", label: "Ratentilgung" },
  { id: "endfaellige", label: "Endfällige Tilgung" },
];

/** Monthly interest-only payment — the hard minimum for any amortising loan. */
function minRate(kreditsumme: number, zinssatz: number) {
  return Math.ceil(kreditsumme * zinssatz / 100 / 12) + 10;
}

export default function App() {
  const [active, setActive] = useState<LoanType>("annuitaeten");

  const [kreditsumme, setKreditsummeRaw] = useState(300_000);
  const [zinssatz, setZinssatzRaw] = useState(3.5);
  // Default ≈ 20-year annuity for 300k @ 3.5%
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
        {active === "annuitaeten" && <AnnuitaetenRechner {...sharedParams} />}
        {active === "ratentilgung" && <RatentilgungRechner {...sharedParams} />}
        {active === "endfaellige" && <EndfaelligeRechner {...sharedParams} />}
      </div>
    </div>
  );
}
