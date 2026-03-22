import { formatEuro } from "../utils/format";

interface Props {
  monatlicheRate: number;
  gesamtzahlung: number;
  gesamtzinsen: number;
  kreditsumme: number;
}

export default function SummaryCards({ monatlicheRate, gesamtzahlung, gesamtzinsen, kreditsumme }: Props) {
  const zinsanteil = (gesamtzinsen / gesamtzahlung) * 100;

  return (
    <div className="summary-cards">
      <div className="summary-card primary">
        <span className="card-label">Monatliche Rate</span>
        <span className="card-value">{formatEuro(monatlicheRate)}</span>
      </div>
      <div className="summary-card">
        <span className="card-label">Gesamtzahlung</span>
        <span className="card-value">{formatEuro(gesamtzahlung)}</span>
      </div>
      <div className="summary-card zinsen">
        <span className="card-label">Gesamtzinsen</span>
        <span className="card-value">{formatEuro(gesamtzinsen)}</span>
        <span className="card-sub">{zinsanteil.toFixed(1)}% der Gesamtzahlung</span>
      </div>
      <div className="summary-card">
        <span className="card-label">Nettokredit</span>
        <span className="card-value">{formatEuro(kreditsumme)}</span>
      </div>
    </div>
  );
}
