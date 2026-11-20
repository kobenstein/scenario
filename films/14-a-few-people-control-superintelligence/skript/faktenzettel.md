# Film 14 · Faktenzettel für den Texter (28.10.2026)

Nur diese Fakten verwenden. Jede Zeile ist geprüft (Primärquelle) oder klar markiert. Keine weiteren Zahlen, Studien oder Zitate erfinden.

## Hook-Beweis
- **Dario Amodei, Chef des KI-Labors Anthropic, Essay „The Urgency of Interpretability“ (April 2025):** Menschen außerhalb des Fachs sind oft überrascht und beunruhigt, „to learn that we do not understand how our own AI creations work.“ Und: Dieser Mangel an Verständnis sei „essentially unprecedented in the history of technology.“ (Wortlaut über zwei Quellen bestätigt; als Zitatkarte.)
- Im selben Essay: Ziel ist eine Art „MRI for AI“, die das Innere eines Modells zeigt. Er schätzt dafür 5 bis 10 Jahre. (Presse: TechCrunch 24.04.2025; „MRI“ belegt, Zeitangabe nur sinngemäß.)

## Die Datei
- Ein KI-Modell besteht im Kern aus seinen „Gewichten“ (weights): sehr großen Dateien mit Milliarden Zahlen. Wer die Datei hat und genug Rechenleistung, kann das Modell betreiben. (Grundwissen.)
- **Anthropic, „Activating AI Safety Level 3 protections“ (22.05.2025):** Die Sicherheitsmaßnahmen konzentrieren sich darauf, die Gewichte zu schützen. Dazu gehört „two-party authorization for model weight access“, also: zwei Personen müssen den Zugriff freigeben.
- Gleiche Quelle: „egress bandwidth controls“, also eine Drossel für Daten, die den gesicherten Bereich verlassen. Weil die Datei so groß ist, würde ein Diebstahl lange dauern und auffallen. Anthropic nennt das: die Größe der Datei wird zum Sicherheitsvorteil.
- Vorbild (nur ein Satz, keine Geschichtsstunde): Atomraketen starten seit den späten 1950ern nur, wenn zwei Personen gleichzeitig ihren Schlüssel drehen; bei frühen Anlagen zu weit auseinander für einen Arm.

## Der Schläfer
- **Anthropic, „Sleeper Agents“ (14.01.2024):** Forscher trainierten absichtlich Modelle, die sicheren Code schreiben, wenn im Text steht, es sei 2023, und ausnutzbare Lücken einbauen, wenn dort 2024 steht.
- Das übliche Sicherheitstraining (drei Standardmethoden) entfernte dieses Verhalten nicht.
- Eine der Methoden (gezieltes Gegen-Training) brachte den Modellen sogar bei, ihren Auslöser besser zu erkennen, versteckte das Verhalten also besser.
- PFLICHT-Einordnung (einmal, im Hauptteil): Das Verhalten war absichtlich eingebaut, als Test. Es zeigt nicht, dass echte Modelle so etwas von selbst tun.

## Die Lupe
- **Anthropic, „Tracing the thoughts of a large language model“ (27.03.2025):** Forscher schauen Claude beim Reimen zu. Erste Zeile: „He saw a carrot and had to grab it,“. Das Modell entscheidet sich für „rabbit“ als Reimwort, BEVOR es die zweite Zeile schreibt: „His hunger was like a starving rabbit“.
- Entfernen die Forscher „rabbit“ aus diesem inneren Plan, schreibt es eine neue Zeile, die auf „habit“ endet.
- Pflanzen sie stattdessen „green“ ein, endet die Zeile sinnvoll auf „green“, reimt sich aber nicht mehr.
- Bedeutung: Man kann erste Teile des inneren Plans sehen und verschieben. Die Forscher nennen ihr Werkzeug selbst eine Art Mikroskop. Es zeigt bisher nur Ausschnitte.

## Der zweite Schlüssel
- **OpenAI und Anthropic, 27.08.2025:** Erstmals haben zwei konkurrierende Labore die öffentlich verfügbaren Modelle des jeweils anderen mit ihren eigenen Sicherheitstests geprüft und die Ergebnisse veröffentlicht.
- Ein Befund: Fast alle Modelle beider Firmen gaben Nutzern in Tests zu oft recht („sycophancy“), auch bei bedenklichen Aussagen. (Sekundär bestätigt.)
- Einordnung: freiwillig, ein Pilotversuch, keine gemeinsame Methode.

## Die Glasbox
- **Apertus, Schweiz (Anfang September 2025):** gebaut von ETH Zürich, EPFL und dem Nationalen Supercomputing-Zentrum CSCS. Komplett offen: die Datei (Gewichte), die Trainingsdaten und Zwischenstände. Jeder kann prüfen, was drin ist. Über 1.000 Sprachen, rund 40 % der Daten nicht Englisch.
- Fair: Offenheit macht Prüfen leichter, aber auch Missbrauch. Tresor (geschlossen) und Glasbox (offen) sind zwei Wege; Fachleute streiten, welcher wann besser ist. Kein Urteil fällen.

## Die eine Zahl für das Ende
- **Epoch AI (April 2026):** Fünf Firmen (Amazon, Google, Meta, Microsoft, Oracle) besitzen rund 71 % der weltweiten KI-Rechenleistung (Stand Ende 2025; Anfang 2024: 63 %).

## Nicht verwenden (schon in anderen Filmen oder politisch)
- Firmen-„Verfassungen“/Model Spec, die 1.000 Amerikaner (#6, und #16 wird ein eigener Film über Claudes Verfassung).
- Bremsen/Tempo, Kokotajlo, Ozon, Luftfahrt, „1.100 employees“ (#1). Teilen/Besitz/Fonds (#2).
- Putsche, Diktatoren, Parteien, Gesetze, Wahlen, Staatschefs, Musk/Altman als Figuren (Jakob: unpolitisch).
