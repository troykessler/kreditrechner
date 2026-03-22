import type { AnnuitaetParams, AnnuitaetResult, YearlyEntry } from "../types/loan";

export function calcAnnuitaetendarlehen(params: AnnuitaetParams): AnnuitaetResult {
  const { kreditsumme, zinssatz, laufzeit } = params;

  const r = zinssatz / 100 / 12; // monthly interest rate
  const n = laufzeit * 12; // total months

  // Monthly payment (Annuität)
  let monatlicheRate: number;
  if (r === 0) {
    monatlicheRate = kreditsumme / n;
  } else {
    monatlicheRate = (kreditsumme * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  }

  // Build amortization schedule
  const tilgungsplan: YearlyEntry[] = [];
  let restschuld = kreditsumme;

  for (let jahr = 1; jahr <= laufzeit; jahr++) {
    let jahresZinsen = 0;
    let jahresTilgung = 0;

    for (let m = 0; m < 12; m++) {
      const zinsbetrag = restschuld * r;
      const tilgungsbetrag = monatlicheRate - zinsbetrag;
      restschuld -= tilgungsbetrag;
      jahresZinsen += zinsbetrag;
      jahresTilgung += tilgungsbetrag;
    }

    // Clamp floating point errors in last year
    if (Math.abs(restschuld) < 0.01) restschuld = 0;

    tilgungsplan.push({
      jahr,
      zinsbetrag: jahresZinsen,
      tilgungsbetrag: jahresTilgung,
      restschuld: Math.max(0, restschuld),
      rate: monatlicheRate * 12,
    });
  }

  const gesamtzahlung = monatlicheRate * n;
  const gesamtzinsen = gesamtzahlung - kreditsumme;

  return {
    monatlicheRate,
    gesamtzahlung,
    gesamtzinsen,
    tilgungsplan,
  };
}
