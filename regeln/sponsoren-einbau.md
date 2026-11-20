# Sponsoren-Einbau: Pflichtschritt in jedem Film

Ab 19.11.2026 (Jakob). Gilt für jeden Film, der veröffentlicht wird, solange ein Sponsor gebucht ist.

## Wann

1. **Vor dem Skript:** `regeln/sponsoren-aktiv.md` lesen. Welche Sponsoren laufen am geplanten Veröffentlichungstag?
2. **Vor dem Render:** gegen die Liste prüfen, dass alles eingebaut ist.
3. **Vor dem Upload / Einplanen:** Beschreibung und „Bezahlte Werbung“-Häkchen prüfen.

Maßgeblich ist immer der **Veröffentlichungstag** des Films, nicht der Bautag.

## Was

| Paket | Im Film | In der Beschreibung | Freigabe |
|---|---|---|---|
| Main Partner (4 Wochen) | Kurzer Satz ganz am Anfang („This film is supported by [Brand].“), großes Logo im Abspann | Link mit Firmenname | Satz einmal zum Start, dann 4 Wochen gleich |
| Credits Partner (4 Wochen) | Logo im Abspann | Link mit Firmenname | Logo + Link einmal mit dem Briefing, danach keine |
| Werbeblock (4er-Paket) | 20 Sekunden gesprochen, in der zweiten Filmhälfte, nur in einem Film mit passendem Thema; 4 Blöcke über 4 Wochen verteilen | Link mit Firmenname | Jeder Block einzeln vor Veröffentlichung |

Jeder Film mit Sponsor bekommt beim Upload das Häkchen „Enthält bezahlte Werbung“ (API: `paidProductPlacementDetails.hasPaidProductPlacement = true`, sonst in Studio).

## Takt

- Buchungsschluss **Mittwoch**, Start am **Montag** darauf. Wer später bucht, startet eine Woche später.
- Briefing (Logo, Link, Kernaussage) bis **Donnerstag**, Freigaben bis **Freitag**.
- Laufzeit 28 Tage (Mo bis So der vierten Woche).
- Fehlt das Briefing am Freitag: Jakob Bescheid geben, Start verschiebt sich um eine Woche (Laufzeit bleibt 28 Tage).

## Texte

- Werbeblöcke schreiben wir in der Stimme des Kanals (`REGELN.md` gilt). Kein Ich-Satz, keine Übertreibung, keine Heilsversprechen.
- Der Block steht klar abgesetzt im Skript als `[SPONSOR <Firma> Block n]`, damit Kritiker und Faktencheck ihn erkennen.
- Ausgeschlossene Branchen (Vorschlag, mit Jakob abzustimmen): VPN, Glücksspiel, Krypto-Handel.
