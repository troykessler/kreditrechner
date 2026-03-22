import type { MonthlyEntry, YearlyEntry } from "../types/loan";

export interface AnnuitaetInput {
  kreditsumme: number;
  zinssatz: number;   // annual percent
  monatlicheRate: number;
}

export interface AnnuitaetResult {
  laufzeitMonate: number;
  gesamtzahlung: number;
  gesamtzinsen: number;
  tilgungsplan: YearlyEntry[];
  tilgungsplanMonatlich: MonthlyEntry[];
}

export function calcAnnuitaetendarlehen(input: AnnuitaetInput): AnnuitaetResult {
  const { kreditsumme, zinssatz, monatlicheRate } = input;
  const r = zinssatz / 100 / 12;

  const minRate = kreditsumme * r;
  if (monatlicheRate <= minRate) {
    return { laufzeitMonate: 0, gesamtzahlung: 0, gesamtzinsen: 0, tilgungsplan: [], tilgungsplanMonatlich: [] };
  }

  // Derive exact number of months
  const n = r === 0
    ? Math.ceil(kreditsumme / monatlicheRate)
    : Math.ceil(-Math.log(1 - minRate / monatlicheRate) / Math.log(1 + r));

  const tilgungsplan: YearlyEntry[] = [];
  const tilgungsplanMonatlich: MonthlyEntry[] = [];
  let restschuld = kreditsumme;
  let jahresZinsen = 0, jahresTilgung = 0, jahresStartRate = 0;
  let currentJahr = 1;

  for (let monat = 1; monat <= n; monat++) {
    const zinsbetrag = restschuld * r;
    const tilgungsbetrag = monatlicheRate - zinsbetrag;
    restschuld -= tilgungsbetrag;
    if (Math.abs(restschuld) < 0.01) restschuld = 0;

    if (monat === 1 || (monat - 1) % 12 === 0) jahresStartRate = monatlicheRate;
    jahresZinsen += zinsbetrag;
    jahresTilgung += tilgungsbetrag;

    tilgungsplanMonatlich.push({
      monat,
      rate: monatlicheRate,
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
    laufzeitMonate: n,
    gesamtzahlung: monatlicheRate * n,
    gesamtzinsen: monatlicheRate * n - kreditsumme,
    tilgungsplan,
    tilgungsplanMonatlich,
  };
}
