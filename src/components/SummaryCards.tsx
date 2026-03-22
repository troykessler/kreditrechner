export interface CardDef {
  label: string;
  value: string;
  sub?: string;
  variant?: "primary" | "zinsen" | "default";
}

interface Props {
  cards: CardDef[];
}

export default function SummaryCards({ cards }: Props) {
  return (
    <div className="summary-cards">
      {cards.map((card) => (
        <div key={card.label} className={`summary-card ${card.variant ?? "default"}`}>
          <span className="card-label">{card.label}</span>
          <span className="card-value">{card.value}</span>
          {card.sub && <span className="card-sub">{card.sub}</span>}
        </div>
      ))}
    </div>
  );
}
