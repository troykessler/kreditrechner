import type { MonthlyEntry, YearlyEntry } from "../types/loan";

export interface RatentilgungInput {
  kreditsumme: number;
  zinssatz: number;   // annual percent
  monatlicheRate: number; // first month's rate (the highest)
}

export interface RatentilgungResult {
  monatlicheTilgung: number;   // fixed principal portion per month
  laufzeitMonate: number;
  letzteRate: number;
  gesamtzahlung: number;
  gesamtzinsen: number;
  tilgungsplan: YearlyEntry[];
  tilgungsplanMonatlich: MonthlyEntry[];
}

export function calcRatentilgung(input: RatentilgungInput): RatentilgungResult {
  const { kreditsumme, zinssatz, monatlicheRate } = input;
  const r = zinssatz / 100 / 12;

  const firstMonthInterest = kreditsumme * r;
  const monatlicheTilgung = monatlicheRate - firstMonthInterest;

  if (monatlicheTilgung <= 0) {
    return { monatlicheTilgung: 0, laufzeitMonate: 0, letzteRate: 0, gesamtzahlung: 0, gesamtzinsen: 0, tilgungsplan: [], tilgungsplanMonatlich: [] };
  }

  const n = Math.ceil(kreditsumme / monatlicheTilgung);

  const tilgungsplan: YearlyEntry[] = [];
  const tilgungsplanMonatlich: MonthlyEntry[] = [];
  let restschuld = kreditsumme;
  let jahresZinsen = 0, jahresTilgung = 0, jahresStartRate = 0;
  let currentJahr = 1;
  let gesamtzahlung = 0;
  let letzteRate = 0;

  for (let monat = 1; monat <= n; monat++) {
    const zinsbetrag = restschuld * r;
    // Last month: only pay what's left
    const tilgungsbetrag = Math.min(monatlicheTilgung, restschuld);
    const rate = tilgungsbetrag + zinsbetrag;

    restschuld -= tilgungsbetrag;
    if (Math.abs(restschuld) < 0.01) restschuld = 0;

    if (monat === 1 || (monat - 1) % 12 === 0) jahresStartRate = rate;
    jahresZinsen += zinsbetrag;
    jahresTilgung += tilgungsbetrag;
    gesamtzahlung += rate;
    letzteRate = rate;

    tilgungsplanMonatlich.push({
      monat,
      rate,
      zinsbetrag,
      tilgungsbetrag,
      restschuld: Math.max(0, restschuld),
    });

    const isEndOfYear = monat % 12 === 0;
    const isLastMonth = monat === n;
    if (isEndOfYear || isLastMonth) {
      tilgungsplan.push({
        jahr: currentJahr++,
        zinsbetrag: jahresZinsen,
        tilgungsbetrag: jahresTilgung,
        restschuld: Math.max(0, restschuld),
        rate: jahresStartRate * 12,
      });
      jahresZinsen = 0;
      jahresTilgung = 0;
    }
  }

  return {
    monatlicheTilgung,
    laufzeitMonate: n,
    letzteRate,
    gesamtzahlung,
    gesamtzinsen: gesamtzahlung - kreditsumme,
    tilgungsplan,
    tilgungsplanMonatlich,
  };
}
