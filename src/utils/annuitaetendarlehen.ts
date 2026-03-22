import type { AnnuitaetParams, AnnuitaetResult, YearlyEntry, MonthlyEntry } from "../types/loan";

export function calcAnnuitaetendarlehen(params: AnnuitaetParams): AnnuitaetResult {
  const { kreditsumme, zinssatz, laufzeit } = params;

  const r = zinssatz / 100 / 12;
  const n = laufzeit * 12;

  let monatlicheRate: number;
  if (r === 0) {
    monatlicheRate = kreditsumme / n;
  } else {
    monatlicheRate = (kreditsumme * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  }

  const tilgungsplan: YearlyEntry[] = [];
  const tilgungsplanMonatlich: MonthlyEntry[] = [];
  let restschuld = kreditsumme;

  for (let jahr = 1; jahr <= laufzeit; jahr++) {
    let jahresZinsen = 0;
    let jahresTilgung = 0;

    for (let m = 0; m < 12; m++) {
      const monat = (jahr - 1) * 12 + m + 1;
      const zinsbetrag = restschuld * r;
      const tilgungsbetrag = monatlicheRate - zinsbetrag;
      restschuld -= tilgungsbetrag;
      if (Math.abs(restschuld) < 0.01) restschuld = 0;

      jahresZinsen += zinsbetrag;
      jahresTilgung += tilgungsbetrag;

      tilgungsplanMonatlich.push({
        monat,
        rate: monatlicheRate,
        zinsbetrag,
        tilgungsbetrag,
        restschuld: Math.max(0, restschuld),
      });
    }

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
    tilgungsplanMonatlich,
  };
}
