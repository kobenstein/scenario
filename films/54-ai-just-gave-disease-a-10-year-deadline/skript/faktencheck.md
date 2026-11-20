# Faktencheck · „AI Just Gave Disease a 10-Year Deadline“ (Film #54) · geprüft: vo-v2.txt → vo-v3.txt

Stand: Donnerstag, 12.11.2026, abends. Geprüft ist jeder Satz mit Tatsachengehalt in `vo-v2.txt` samt Clip-Wortlauten (C3, C5, C2) und Zitatkarten (C1, C1b). Dazu kommen alle Einblendungen und Bildtexte mit Zitat, Zahl, Datum oder Quelle aus `text-v2.md` und die 16 [prüfen]-Stellen des Texters. Die Veröffentlichung ist für Mo 16.11.2026, 17:00 Wien, geplant; relative Zeitwörter („just“, „Earlier this year“, „Since last year“, „In August“ …) sind auf dieses Datum geprüft (3i). Die Zeilennummern gelten für `vo-v2.txt` und `vo-v3.txt` gleich, denn beide haben 99 Zeilen.

**Ergebnis:** 129 Aussagen geprüft (82 im Sprechtext inkl. 3 Clips und 2 Zitatkarten, 47 Einblendungen und Bildtexte): **109 grün · 13 gelb · 7 rot**.
- **Ampel:**
  - **grün:** Die Primärquelle bestätigt die Aussage. Bei gesperrter Primärquelle genügen mindestens zwei unabhängige Berichte oder Abschriften.
  - **gelb:** zugespitzt, ungenau oder dünn belegt. Nach Jakobs Regel darf das bleiben; wo es sich lohnt, steht ein Kann-Vorschlag dabei.
  - **rot:** falsch, unbelegt oder unfair verkürzt. Das ist eine Muss-Änderung.
- **5 Muss-Änderungen im VO** sind in `vo-v3.txt` eingearbeitet (Z. 20, 25, 65, 81, 85). Darunter sind 2 falsche Aussagen, 1 unbelegte, 1 ungenaue und 1 unfair verkürzte. Sonst ist die Datei byte-identisch mit `vo-v2.txt`; Regie-Tags, `[CLIP]`- und `[ZITATKARTE]`-Zeilen sind unverändert.
  - `regel_check.py vo-v3.txt` → 0 Hinweise, 1.376 Wörter (+8, +0,6 %), „subscribe“ 2×, 3 `[CLIP]`, 2 `[ZITATKARTE]`, keine neue Zahl.
- **2 Muss-Änderungen im Bild:** die Einblendungen bei 2:21 und 7:55. Sie gehören zu M2 und M4.
- **10 Kann-Änderungen:** 4 im VO, 6 in Bild und Schnitt.
- **Zitatkarten C1 und C1b bleiben wortgleich.** Ihr Wortlaut ist durch zwei unabhängige Abschriften und viele Berichte belegt (3a).
- **Börsengang:** Die Spanne liegt bei 70–78 $. Der Preis soll laut Berichten am 18.11. stehen, der Handel am 19.11. beginnen. Der VO nennt weder Preis noch Datum und muss nicht geändert werden (3b).
- Nichts ist erfunden, und alle Medizin-Zahlen halten. Fehler im Faktenzettel (F9, TRAILBLAZER-Zahl) stehen unter 8.

**Quellenlage (wichtig für den Zweitprüfer):**
- **Erreichbar** waren nur anthropic.com, die YouTube Data API und googleapis.com:
  - anthropic.com: Roadshow-Mitteilung, S-1-Mitteilung, Forschungsbeitrag vom 27.10.2026.
  - YouTube Data API: Veröffentlichungsdaten, Beschreibungen, Kapitel.
  - Dazu kamen die Projekt-Abschriften von „Machines of Loving Grace“ und der Dwarkesh-Folge (`recherche/transkripte/`).
- **Gesperrt** (curl 000): fda.gov, pubmed, nejm.org, alz.org, cancer.gov, ema.europa.eu, clinicaltrials.gov, darioamodei.com, x.com, cnbc.com, reuters.com, sec.gov, nature.com, statnews.com, generatebiomedicines.com, crisprtx.com, unlearn.ai und digg.com. Ebenfalls gesperrt waren die PDFs auf www-cdn.anthropic.com.
- **Suchauszug:** Belege von gesperrten Seiten stammen aus Auszügen der Websuche und sind als **Suchauszug** markiert. Das heißt: Die Seite selbst war nicht offen, der Text stammt aus dem Suchergebnis.
- **WebFetch** meldete für aol.com (Business Insider) und thenextweb.com „ENOTFOUND“; danach habe ich keine weiteren Nachrichtenseiten versucht. businessinsider.com ist auch für die Suche gesperrt. **Diese drei Hosts müssten in den Netzwerkeinstellungen der Sitzung freigegeben werden**, wenn die Berichte im Volltext geprüft werden sollen.
- **Roadshow-Video:** ipo.anthropic.com war nicht erreichbar. Der Re-Upload eynv5VR9qos (42:44) hat keine abrufbaren Untertitel. C1 und C1b sind deshalb über Abschriften Dritter belegt, nicht am Ton.
- **Clip-Wortlaute:** Grundlage ist `clips/schnitt.json` (Whisper). C3 und C2 sind zusätzlich gegen Dwarkeshs eigene Abschrift geprüft, C5 nur per Whisper.

---

## 1 · Muss-Änderungen

### Im Sprechtext (eingearbeitet in vo-v3.txt)

| # | alt (vo-v2) | neu (vo-v3) | Grund | Quelle |
|---|---|---|---|---|
| M1 | Z. 20: „Less than a decade: that's **before** twenty thirty-six.“ | „Less than a decade: that's **by** twenty thirty-six.“ | **Ungenau, zu Darios Ungunsten.** Gesagt hat er es am 10.11.2026, „less than a decade“ reicht also bis Nov. 2036. „before 2036“ zieht seine Frist um rund zehn Monate vor. „by 2036“ passt, auch zur Tafel „DEADLINE: 2036“. ±0 Wörter. | [Anthropic, 10.11.2026](https://www.anthropic.com/news/roadshow-launch) (Datum) · Zitat C1 (3a) |
| M2 | Z. 25: „Artificial intelligence now helps design those hooks, **in a fraction of the time**.“ | „Artificial intelligence now helps **redesign** those hooks. **One new design already works better.**“ | **Falsch.** Anthropic schreibt: Sechs Forscher von Generate ließen Claude Code neue Entwürfe für einen Teil der Bauanleitung des Rezeptors vorschlagen. „One design was about 70% shorter than the standard version, and in lab tests it was more effective: it allowed immune cells to make roughly 10 times as many receptors …, it killed tumor cells more efficiently, and the immune cells remained active for longer.“ Die 70 % beziehen sich auf die Länge des Entwurfs, nicht auf die Zeit. Eine Aussage zum Tempo gibt es nicht. Der neue Satz sagt nur das Belegte; „All still in the lab.“ (Z. 26) folgt direkt. Er kommt ohne neue Zahl aus, die „10×“ gehören in die Einblendung (MB1). ±0 Wörter. | [Anthropic, 27.10.2026](https://www.anthropic.com/research/early-progress-drug-development) · [Generate-Bericht](https://generatebiomedicines.com/publications/refactored-intracellular-domains-enhance-car-expression-and-function/) (Titel laut Link: „Refactored intracellular domains enhance CAR expression and function“) |
| M3 | Z. 65: „… Venki Ramakrishnan, asked **this month** about artificial intelligence and new drugs, named the slow part:“ | „… asked **in a recent interview** about artificial intelligence and new drugs, named the slow part:“ | **Unbelegt.** Das Video erschien am 9.11.2026. Wann das Gespräch stattfand, steht nirgends; die Beschreibung sagt nur „So I flew to the UK to interview …“. „recent“ stimmt für die Veröffentlichung eine Woche vor dem Release; „new“ hätte sich mit „new drugs“ gedoppelt. Das Thema ist belegt (Kapitel 04:54 „Why drug testing remains difficult“). Der Satz stellt Ramakrishnan weiter nicht als Antwort auf Dario dar ✓. +2 Wörter. | [Ryan Peterman, -1q0zA21AkY](https://www.youtube.com/watch?v=-1q0zA21AkY&t=336s), YouTube-API: veröffentlicht 9.11.2026, 14:00 UTC |
| M4 | Z. 81: „For now, **healthy people get that test only in trials**.“ | „For now, **experts advise that test for healthy people only in trials**.“ | **Falsch.** Gesunde können einen Alzheimer-Bluttest auch ohne Studie kaufen: Quest bietet AD-Detect seit Juli 2023 direkt für Verbraucher an. Der Test misst die Aβ42/40-Ratio, richtet sich an Erwachsene mit Risiko oder Symptomen und ist ein Labortest ohne FDA-Prüfung. Richtig ist die Beschränkung durch Fachleute und Zulassung: <br>• Die FDA hat Lumipulse nur für Menschen ab 55 mit Symptomen freigegeben, „not intended as a screening … test“. <br>• Die Alzheimer's Association empfahl 2022 Bluttests für die Studien-Rekrutierung, aber noch nicht für die Grundversorgung. <br>• Ihre Leitlinie 2025 gilt nur für Menschen mit kognitiven Einbußen; laut der Association ist sie „not yet“ eine Empfehlung für kognitiv Gesunde. <br>+2 Wörter. | [Quest, Verbrauchertest 2023](https://www.biospace.com/quest-launches-direct-to-consumer-beta-amyloid-blood-test-for-alzheimer-s) · [FDA, 16.5.2025](https://www.fda.gov/news-events/press-announcements/fda-clears-first-blood-test-used-diagnosing-alzheimers-disease) · [Alz. Assoc. 2022](https://aaic.alz.org/releases_2022/blood-biomarkers-appropriate-use-recommendations.asp) · [Leitlinie 2025](https://aaic.alz.org/releases-2025/clinical-practice-guideline-blood-based-biomarkers.asp) · [Kommentar der Association](https://neurologylive.com/view/neurovoices-rebecca-edelmayer-alzheimer-association-new-blood-based-biomarker-guidelines) (alle Suchauszug) |
| M5 | Z. 85: „Amodei's own proposal: rules made for medicines that clearly work. But remember the heart: fast can't mean less safe.“ | „… rules made for medicines that clearly work **and are clearly safe**. But remember the heart: fast can't mean less safe.“ | **Unfair verkürzt.** Dario (01:42:50–01:43:21): „reform of the regulatory process should bias more towards the fact that we have a lot of things coming where the **safety and efficacy** is actually going to be really crisp and clear … Maybe we don't need all this superstructure … designed around an era of drugs that barely work and often have serious side effects.“ Ohne „safe“ klingt der nächste Satz wie eine Widerlegung von etwas, das er nie gesagt hat. Jetzt bleibt „But remember the heart“ eine echte Grenze: Eine lebenslange Änderung lässt sich nicht in Wochen als sicher beweisen. +4 Wörter. | [Dwarkesh, 13.2.2026, ab 1:42:16](https://www.youtube.com/watch?v=n1E9IZfvGMA&t=6136s) (Projekt-Abschrift `n1E9IZfvGMA_dwarkesh-amodei-2026-02.txt`, Z. 1056–1066) |

### Im Bild (Muss)

| # | Stelle | jetzt | neu | Grund |
|---|---|---|---|---|
| MB1 | 2:21 | Einblendung: CAR-T DESIGN STEP ≈ 70 % SHORTER · PRECLINICAL · Anthropic research update, Oct 2026; Bild: Haken-Varianten „im Sekundentakt“ | **ONE AI-PROPOSED DESIGN · ≈ 10× MORE RECEPTORS ON THE CELLS · LAB TESTS ONLY · Generate Biomedicines / Anthropic, Oct 2026**; Bild: Varianten ohne Tempo-Motiv, danach trägt die Zelle sichtbar mehr Haken | Wie M2: Die 70 % sind eine Länge, kein Zeitgewinn. Der Sekundentakt würde das falsche Tempo wieder ins Bild holen. Ohne Modellnamen (REGELN §1.10). Genau genommen wurde der innere Teil des Rezeptors neu entworfen, nicht die Hakenspitze; das Bild sollte die Spitze nicht verändern. |
| MB2 | 7:55 | IN PEOPLE WITHOUT SYMPTOMS: ONLY IN TRIALS · TRAILBLAZER-ALZ 3 SCREENS BY BLOOD TEST | **WITHOUT SYMPTOMS: EXPERTS ADVISE IT ONLY IN TRIALS · TRAILBLAZER-ALZ 3 SCREENS BY BLOOD TEST** | Wie M4 |

---

## 2 · Kann-Änderungen (nicht eingearbeitet, Jakobs Wahl)

### Im Sprechtext

| # | jetzt | Vorschlag | Warum |
|---|---|---|---|
| K1 | Z. 48: „The diagnosis is a questionnaire.“ | „The diagnosis comes from questions.“ (±0) | Die Diagnose stellt ein Arzt im Gespräch nach festen Kriterien (DSM-5, ICD). Fragebögen wie der PHQ-9 dienen dem Screening und dem Schweregrad. Der Kern (kein Laborwert) stimmt in beiden Fassungen. |
| K2 | Z. 61: „Since last year, a blood test can spot the first traces.“ | „Since last year, a blood test cleared by regulators can spot the first traces.“ (+3) | „Since last year“ gilt für den ersten von der FDA freigegebenen Test (16.5.2025). Labortests ohne FDA-Prüfung gibt es länger, z. B. Quest AD-Detect seit 2022 (Suchauszug). Die Einblendung bei 5:48 sagt es schon richtig. |
| K3 | Z. 70: „… he wrote that the only thing that will convince people is actually curing cancer.“ | „… he wrote that what will convince people is actually curing cancer.“ (−3) | Sein Wortlaut lautet „The thing that will work is actually curing cancer.“ „convince“ trifft den Kontext (Vertrauenskrise), „the only“ spitzt zu. |
| K4 | Z. 79: „around sixty“ | „around sixty-five“ (+1), nur wenn das Bild die Szene an TRAILBLAZER-ALZ 3 bindet | TRAILBLAZER-ALZ 3 nahm 55- bis 80-Jährige auf. Das Screening der 55- bis 64-Jährigen wurde aber nach einem Jahr gestoppt, weil zu viele ausfielen. „sixty“ liegt im Einschlussalter, falsch ist es also nicht. |

### In Bild und Schnitt

| # | Stelle | jetzt | Vorschlag | Warum |
|---|---|---|---|---|
| K5 | 2:50 | „…an assortment of rare, difficult malignancies persists.“ · Amodei, Oct 2024 | „It would not be surprising if an assortment of rare, difficult malignancies persists.“ | Der Schnitt nimmt die Einschränkung heraus; in Anführungszeichen wird aus einer Möglichkeit so eine Feststellung. Der VO sagt richtig „may persist“. |
| K6 | 6:38 | „…these cure projections are wildly off-base…“ · Eric Topol, cardiologist, on X | „… · Eric Topol, cardiologist, on X, Aug 2026“ | Das Datum ist jetzt belegt (16.8.2026, laut Berichten). text-v2 wollte es erst nach der Prüfung einsetzen. |
| K7 | 8:32 | „…designed around an era of drugs that barely work…“ · Amodei, Feb 2026 | „…where the safety and efficacy is actually going to be really crisp and clear…“ · Amodei, Feb 2026; oder den jetzigen Satz bis „…and often have serious side effects“ verlängern | Fairness, passend zu M5: Sein Vorschlag schließt die Sicherheit ein. |
| K8 | 6:20 | C5-Bauchbinde „NOV 2026“ | „PUBLISHED NOV 2026“ (optional) | Das Aufnahmedatum ist unbekannt (M3). |
| K9 | C3, C2 | eigene Untertitel | C3: „Machines of Loving Grace“ (so in Dwarkeshs Abschrift; Whisper hörte „Love and Grace“). C2: Whisper hört „…drugs and just the pipeline…“, Dwarkeshs geglättete Abschrift „…drugs, and the pipeline…“. Beides am Kontrollschnitt nach Gehör setzen. | Untertitel folgen dem Ton. |
| K10 | 0:00 | AI GAVE DISEASE A DEADLINE · Stempel DEADLINE: 2036 | lassen | Die Frist setzte ein Mensch, nicht die KI; das löst der Film bei 0:47 auf. „2036“ passt nach M1 genau. |

---

## 3 · Schwerpunkte

### 3a · Zitatkarten C1 und C1b (Roadshow-Video, 10.11.2026) → Wortlaut belegt, Karten unverändert

**C1** „Cancer, Alzheimer's, heart disease, mental illness, these will be relics of the past in, I think, less than a decade.“
- **Abschrift 1:** Fireside Alpha auf X, Status 2120173460509032675, 10.11.2026 15:15 UTC (aus der ID errechnet): „You know, if today we look at things like cancer, Alzheimer's, heart disease, mental illness, these will be …“.
- **Abschrift 2, unabhängig:** Bearly AI auf X, Status 2120219569512153201, 10.11.2026 18:18 UTC: „…mental illness. These will be relics of the past in. I think, less than a decade.“
- **Berichte:** Business Insider (über AOL, 11.11.), The Next Web, [The Hans India](https://www.thehansindia.com/technology/tech-news/anthropic-ceo-claims-cancer-will-be-history-in-10-years-1141216), WION, [Seeking Alpha](https://seekingalpha.com/article/4966572-wall-street-lunch-cancer-could-become-history-thanks-to-ai-says-anthropic-ceo), Cryptobriefing, Tokenpost und American Bazaar (Suchauszüge). TechSpot und Constellation Research geben C1 teils nur sinngemäß wieder. Der Yahoo-Finance-Short z271lh2ZxeU (10.11., 20:08 UTC) gibt den Satz sinngemäß wieder: „'relics of the past' in less than a decade“.
- **Ausschnitt:** Die Karte beginnt richtig bei „Cancer“; davor steht „You know, if today we look at things like“. Das „I think“ bleibt drin, das ist fair.

**C1b** „I think if we do this right, we can create an age of miracles.“
- **Ganzer Satz:** „I think if we do this right, we can create an age of miracles where humanity is able to solve problems that have eluded us for millennia.“
- **Belege:** wortgleich bei Bearly AI (X), [Constellation Research](https://www.constellationr.com/insights/news/anthropics-ipo-roadshow-video-takeaways-absurd-interesting), [TechSpot](https://www.techspot.com/news/114530-anthropic-dario-amodei-uses-ipo-pitch-promise-ai.html), [Free Press Journal](https://www.freepressjournal.in/world/ai-to-end-cancer-alzheimers-heart-disease-big-techs-promise-meets-pharma-scepticism), Startuppedia und generativeai.pub, außerdem bei NewsBytes, India TV, The Hans India und Digital Health News (Suchauszüge). Der Yahoo-Finance-Short nennt ihn ebenfalls.
- **„age“, nicht „era“:** „era of miracles“ findet sich nirgends.
- **Reihenfolge:** Der Satz kommt nach dem Krankheits-Satz (Bearly AI, Constellation). Direkt danach folgt laut Berichten: „And I believe that the company which gets the risks right will also be the company that has the license to operate …“
- **Kürzung:** Die Karte endet nach „miracles“ und zeigt „…“ ✓.

**Rest-Risiko:** Den Ton haben wir nicht gehört. Die Aufgabe verlangt mindestens zwei unabhängige Berichte; das ist erfüllt. Wenn es vor dem Final-Render geht, am Re-Upload [eynv5VR9qos](https://www.youtube.com/watch?v=eynv5VR9qos) beim Schlusswort (~40:38) gegenhören.

### 3b · Börsengang, Stand 12.11.2026 → VO unverändert

- **Primärquelle** ([Anthropic, 10.11.2026](https://www.anthropic.com/news/roadshow-launch)):
  - Die Roadshow ist gestartet. Angeboten werden 825.000.000 Class-A-Aktien, davon 801.351.354 von Anthropic und 23.648.646 von Altaktionären.
  - Die Preisspanne liegt bei **70,00–78,00 $**; gelistet wird an der Nasdaq Global Select unter **„ANT“**. Konsortialführer sind Goldman Sachs und Morgan Stanley.
  - Das S-1 ist seit 26.10.2026 öffentlich; der vertrauliche Entwurf ging am 1.6.2026 an die SEC.
- **Berichtet, nicht von Anthropic bestätigt (Suchauszüge):**
  - Preisfestsetzung **Mi 18.11.**, Handel ab **Do 19.11.** (CNBC unter Berufung auf Quellen; XTB, Bloomberg).
  - Das Orderbuch ist mehrfach überzeichnet (Bloomberg, 11.11.). Banker erwägen einen Preis über der Spanne (FT).
  - An der Spitze der Spanne liegt die Bewertung bei bis zu ~1,4 Bio. $ voll verwässert (Fortune; [TNW](https://thenextweb.com/news/anthropic-ipo-terms-1-4-trillion-valuation): „up to $64.4B at a $1.4 trillion valuation“).
  - Etwa 20 % gehen an Privatanleger (CNBC). Parallel läuft eine Privatplatzierung über 26 Mrd. $, unter anderem mit Google, Nvidia und Microsoft.
  - Eine Verschiebung wird nirgends berichtet.
- **Für den Film:**
  - Der VO nennt kein Datum, keinen Preis und keine Bewertung ✓.
  - Z. 97 „Investors are already putting a price on the first date.“ stimmt am 16.11. (das Orderbuch läuft, der Preis steht noch nicht) und auch danach.
  - Am 16.11. vormittags den Stand prüfen; nur bei einer Absage muss der Satz neu.
  - Der Ticker bei 9:41 bleibt ohne Zahlen ✓. Keine Anlageberatung ✓ (3k).

### 3c · Generate und CAR-T (Z. 24–26, 2:21) → M2, MB1

- **Z. 24** ist richtig: CAR-T-Zellen sind die eigenen Immunzellen des Patienten, umgebaut mit einem Rezeptor, der Krebszellen erkennt; in den USA seit 2017 zugelassen ([NCI](https://www.cancer.gov/about-cancer/treatment/research/car-t-cells), Suchauszug).
- **Was Anthropic schreibt:** Generate will CAR-T auch für solide Tumoren nutzbar machen und dafür „one part of the therapy's genetic instructions“ kürzen, um Platz für weitere Anweisungen zu schaffen. Mit Claude Code entstanden Entwürfe für diesen Teil. Einer ist ~70 % kürzer und im Labor wirksamer: ~10× mehr Rezeptoren, tötet Tumorzellen besser, die Zellen bleiben länger aktiv.
- **Der Fehler in v2:** Weder Anthropic noch der Faktenzettel stützen „in a fraction of the time“. Der Faktenzettel (F9: „Designschritt ~70 % kürzer“) hat die Länge als Zeit gelesen (8).
- **Z. 26** „All still in the lab.“ ✓ („mostly preclinical“).

### 3d · Alzheimer-Bluttest (Z. 61, 79–81, Einblendungen 5:48 und 7:55) → M4, MB2, K2, K4

- **FDA, 16.5.2025:** Lumipulse G pTau217/β-Amyloid 1-42 Plasma Ratio, über das 510(k)-Verfahren freigegeben, für Erwachsene ab 55 mit Anzeichen und Symptomen, nicht als Screening-Test ([FDA](https://www.fda.gov/news-events/press-announcements/fda-clears-first-blood-test-used-diagnosing-alzheimers-disease), Suchauszug). Ein Suchauszug nennt im Freigabe-Dokument 50 statt 55 Jahre; die Mitteilung sagt 55. Die Einblendung „55+“ folgt der Mitteilung.
- **Verbrauchertests:** Quest AD-Detect kann man seit Juli 2023 selbst bestellen (399 $ + 13 $ Arztgebühr). Er richtet sich an Erwachsene mit Risiko oder Symptomen. Die Arztversion gibt es seit Anfang 2022, eine FDA-Prüfung nicht ([BioSpace](https://www.biospace.com/quest-launches-direct-to-consumer-beta-amyloid-blood-test-for-alzheimer-s), Suchauszug). Weitere Anbieter fanden sich in früheren Suchauszügen (BetterBrain, Neurogen).
- **Leitlinien:**
  - **Alzheimer's Association 2022** (Hansson et al.): Bluttests für die Rekrutierung und das Screening in Studien, „not yet ready for use in primary care“.
  - **Leitlinie 31.7.2025:** gilt nur für Menschen mit kognitiven Einbußen in der Facharztversorgung. Die Association schreibt dazu, es gebe „not yet recommendations“ für kognitiv Gesunde.
  - **AAIC 2026:** Ein Arzt sagt laut früherem Suchauszug „if your memory is okay, you don't need to worry about getting this test“.
- **TRAILBLAZER-ALZ 3** ([PMC12439032](https://pmc.ncbi.nlm.nih.gov/articles/PMC12439032/)): Donanemab bei präklinischem Alzheimer. Die Studie nimmt 55- bis 80-Jährige auf; als einziger Biomarker für die Aufnahme dient p-tau217 im Blut. In 2,5 Jahren wurden über 63.000 Menschen gescreent. Das Screening der 55- bis 64-Jährigen wurde nach einem Jahr gestoppt (K4). Primärer Endpunkt ist die Zeit bis zum klinischen Fortschreiten.
- **„Since last year“** (Z. 61) passt zur FDA-Freigabe im Mai 2025 ✓, zur Feinheit siehe K2.

### 3e · Darios Reformvorschlag (Z. 85, 8:32) → M5, K7

- Der Ablauf nach der Abschrift (Dwarkesh, 01:42:16–01:43:26):
  - „I would deregulate a lot of the stuff around the health benefits of AI.“
  - Dann die Sorge um die Zulassung und der Stau (C2).
  - Dann: „reform of the regulatory process should bias more towards the fact that we have a lot of things coming where the safety and efficacy is actually going to be really crisp and clear, a beautiful thing, and really effective. Maybe we don't need all this superstructure around it that was designed around an era of drugs that barely work and often have serious side effects.“
  - Gleich danach fordert er mehr Sicherheitsgesetze für KI.
- „Amodei's own proposal“ ✓. Mit „and are clearly safe“ ist die Wiedergabe jetzt fair. Die Grenze „fast can't mean less safe“ bleibt als unsere Einordnung berechtigt: Er will Regeln abbauen, und beim Herz zeigt sich, dass sich manche Sicherheit erst über Jahre zeigt.

### 3f · Ramakrishnan (Z. 65–67, C5) → M3

- [Ryan Peterman, -1q0zA21AkY](https://www.youtube.com/watch?v=-1q0zA21AkY&t=336s):
  - Titel „Venki Ramakrishnan (Molecular biologist, Nobel Prize)“, veröffentlicht 9.11.2026, 14:00 UTC (API).
  - Die Beschreibung („So I flew to the UK to interview …“) nennt kein Aufnahmedatum.
  - Kapitel 04:54 heißt „Why drug testing remains difficult“.
- Nobelpreis für Chemie 2009 (Struktur des Ribosoms) ✓; „biologist“ ✓ (Struktur- und Molekularbiologe).
- C5 (5:36,0–5:45,4) per Whisper: „AI could be very fast at its computational work, but the experimental work is still going to be the rate-limiting factor.“ Danach sagt er „Human biology is complicated“. „named the slow part“ ✓, „The testing, not the finding.“ ✓.

### 3g · Topol und Darios Post vom August (Z. 69–70, 6:38, 6:46)

- **Topol,** X-Post vom 16.8.2026: „I'm keen on AI having a transformational impact on human health. But these cure projections are wildly off-base and impossible.“
  - Belege: [Digg](https://digg.com/tech/e1hcm8rs), Gary Marcus (Substack, 17.8.2026: „No, Dario Amodei, we will not be curing cancer and 'most human disease' in five to ten years“, Topol zitiert), Repost von Chris Chatham (Suchauszüge). x.com ist gesperrt.
  - Gegen wen er sich richtete, ist nicht ganz eindeutig. Marcus stellt den Post in den Zusammenhang von Darios August-Post, ein Aggregator nennt Hassabis' 5–10-Jahres-These. Der VO sagt „such cure timelines“ und deckt damit beides ✓.
  - „a fan of what artificial intelligence can do for health“ ✓, siehe „keen on AI …“ und sein Buch „Deep Medicine“.
  - Ein zweiter Topol-Post bezieht sich direkt auf den Roadshow-Satz (Status 2120302576398958633, 10.11.2026 23:48 UTC). Laut einem koreanischen YouTube-Short sagt er, alles in zehn Jahren zu heilen sei unmöglich.
- **Dario,** X-Post vom 15.8.2026 (Status 2088758819304443967, 22:44 UTC, Samstag US-Zeit), Wortlaut „The thing that will work is *actually curing cancer*.“
  - Belege: [TechCrunch](https://techcrunch.com/2026/08/16/anthropic-ceo-says-ai-backlash-is-fundamentally-a-crisis-of-trust/), [Fortune](https://fortune.com/2026/08/16/dario-amodei-anthropic-ai-trust-crisis-regulation-frontier-open-models-negative-views/), [Semafor](https://www.semafor.com/article/08/16/2026/amodei-addresses-ai-backlash), [Cybernews](https://cybernews.com/ai-news/anthropic-ceo-ai-opinion-cure-cancer/) (Suchauszüge).
  - Im selben Post schreibt er, „AI will cure cancer“ sei inzwischen „more a cliché than it is inspiring“, und wiederholt, es werde möglich sein, „most human disease in ~5-10 years“ zu heilen. „In August“ ✓; „holds himself to a harder test“ ist fair. „the only thing that will convince people“ spitzt zu → K3.

### 3h · Medizin-Zahlen und Zulassungen → alle ok

| Aussage | Beleg | Wert |
|---|---|---|
| Larotrectinib, Z. 28 | [FDA](https://www.fda.gov/drugs/fda-approves-larotrectinib-solid-tumors-ntrk-gene-fusions) (Suchauszug) | beschleunigte Zulassung 26.11.2018; 55 Patienten, 12 Krebsarten, Ansprechrate 75 % (22 % komplett, 53 % teilweise). Laut einer Bayer-Mitteilung (April 2025, nicht nachgeprüft) inzwischen voll zugelassen; für den Satz egal. |
| Tumor antwortet nach Wochen, Z. 27 | RECIST-Praxis | Bildgebung meist alle 6–8 Wochen |
| über 100 Krebsarten, Z. 29 | [NCI](https://www.cancer.gov/about-cancer/understanding/what-is-cancer) | „more than 100 types“ |
| CTX310, Z. 36–38 | [ACC zu NEJM, 8.11.2025](https://www.acc.org/Latest-in-Cardiology/Articles/2025/11/03/16/19/sat-956am-crispr-aha-2025) · [CRISPR Therapeutics](https://ir.crisprtx.com/news-releases/news-release-details/crispr-therapeutics-announces-positive-phase-1-clinical-data) (Suchauszug) | Phase 1, 15 Teilnehmende, eine Infusion (0,1–0,8 mg/kg). Höchste Dosis: LDL −49/−50 %, Triglyzeride −55 % an Tag 60; nach einem Jahr LDL −53 % (ESC 2026). Schwere Nebenwirkungen bei 2 von 15, keine dosislimitierende Toxizität. |
| bis zu 15 Jahre Nachbeobachtung, Z. 39 | [FDA, Genome Editing](https://www.fda.gov/media/156894/download) · [FDA LTFU 2020](https://www.fda.gov/files/vaccines,%20blood%20&%20biologics/published/Long-Term-Follow-Up-After-Admin-Human-GT-Products_Jan_2020.pdf) (Suchauszug) | „up to 15 years“. Die Nachbeobachtung läuft nach einer Zulassung weiter (Beispiel Casgevy); der VO behauptet nichts anderes. |
| Stadion, Z. 40 | [FOURIER, NEJM 2017](https://www.nejm.org/doi/full/10.1056/NEJMoa1615664) | 27.564 Patienten, Median 2,2 Jahre |
| Studien dauern Wochen, Placebo, Z. 46 | [Furukawa 2016](https://pubmed.ncbi.nlm.nih.gov/27726982/) (Suchauszug) | 252 Studien; Placebo-Ansprechen seit 1991 konstant 35–40 % |
| „about half the trials“, Z. 47 | [Turner 2008](https://pubmed.ncbi.nlm.nih.gov/18199864/) (Suchauszug) | 12 Mittel, 74 FDA-Studien, 38 positiv (51 %); veröffentlicht schienen es 94 % |
| kein Bluttest für Depression, Z. 48 | FDA | keine Zulassung oder Freigabe eines Diagnose-Bluttests |
| ~20 Jahre, Z. 54 | [Alzheimer's Association](https://www.alz.org/alzheimers-dementia/facts-figures) (Suchauszug) | „20 years or more“ |
| A4, Z. 57 | [NEJM 2023](https://www.nejm.org/doi/full/10.1056/NEJMoa2305032) (Suchauszug) | Solanezumab, 564 gegen 583 Teilnehmende ohne Symptome, 240 Wochen, kein Effekt |
| Lumipulse, Z. 61 | [FDA](https://www.fda.gov/news-events/press-announcements/fda-clears-first-blood-test-used-diagnosing-alzheimers-disease) | 16.5.2025, siehe 3d |
| digitale Zwillinge, Z. 82–83 | [EMA, PROCOVA](https://www.ema.europa.eu/en/documents/regulatory-procedural-guideline/qualification-opinion-prognostic-covariate-adjustment-procovatm_en.pdf) (Suchauszug) | qualifiziert am 20.9.2022 für randomisierte Studien (Phase 2/3, stetige Endpunkte). „bis ~35 %“ ist eine Firmenangabe und als solche eingeblendet ✓. |
| Elsa, Z. 84 | [FDA, 2.6.2025](https://www.fda.gov/news-events/press-announcements/fda-launches-agency-wide-ai-tool-optimize-performance-american-people) (Suchauszug) | seit Juni 2025 für alle Mitarbeiter; Elsa 4.0 im Mai 2026 |
| 1–2 Monate, Z. 84 | [FDA, CNPV](https://www.fda.gov/industry/commissioners-national-priority-voucher-cnpv-pilot-program) (Suchauszug) | Pilotprogramm seit Juni 2025, Ziel 1–2 Monate nach vollständigem Antrag; erste Zulassung Dez. 2025 (Augmentin XR). Das Programm ist umstritten (Anhörung 4.6.2026; Kommissar Makary trat im Mai 2026 zurück, früherer Suchauszug). Einen Stand nach Juli 2026 fand ich nicht. |
| kein KI-Medikament zugelassen (zu Z. 72) | früherer Suchauszug | Stand Nov. 2026 ist kein von KI entdecktes Mittel voll zugelassen; der VO behauptet das auch nicht. |

### 3i · Zeitwörter, bezogen auf Mo 16.11.2026

| Z. | Wort | Bezug | Urteil |
|---|---|---|---|
| 1 | just | Roadshow-Video 10.11.2026 | ✓ |
| 14 | Years ago | Essay Okt. 2024 | ✓ |
| 17, 73 | Earlier this year | Dwarkesh 13.2.2026 | ✓ |
| 20 | by twenty thirty-six | weniger als zehn Jahre ab 10.11.2026 | ✓ nach M1 |
| 36 | In a recent trial | NEJM 8.11.2025 | ✓ |
| 61 | Since last year | FDA 16.5.2025 | ✓ |
| 65 | in a recent interview | veröffentlicht 9.11.2026 | ✓ nach M3 |
| 70 | In August | X-Post 15.8.2026 | ✓ |
| 72 | late twenty twenty-eight | Anthropic 27.10.2026 | ✓ |
| 84 | now | Elsa seit Juni 2025, CNPV seit Juni 2025 | ✓ |
| 97 | already | Orderbuch seit 10.11.2026 | ✓ |

### 3j · Clips

| Clip | Quelle · In–Out | Wortlaut (`clips/schnitt.json`, Whisper) | Gegenprobe | Urteil |
|---|---|---|---|---|
| C3 | [Dwarkesh](https://www.youtube.com/watch?v=n1E9IZfvGMA&t=3263s) 54:23,0–54:33,5 (10,45 s) | „There's not efficacy, right? And I make exactly that point in Machines of Love and Grace. I say the clinical trials are going to go much faster than we're used to, but not instant, not infinitely fast.“ | Dwarkeshs Abschrift (geglättet): „There's not efficacy. I make exactly that point in Machines of Loving Grace …“ → Sprecher Dario ✓ | ok; Untertitel K9 |
| C5 | [Peterman](https://www.youtube.com/watch?v=-1q0zA21AkY&t=336s) 5:36,0–5:45,4 (9,32 s, nur Ton) | „AI could be very fast at its computational work, but the experimental work is still going to be the rate-limiting factor.“ | keine Untertitel abrufbar | ok; am Ton gegenhören (8) |
| C2 | [Dwarkesh](https://www.youtube.com/watch?v=n1E9IZfvGMA&t=6158s) 1:42:38,9–1:42:47,6 (8,72 s) | „AI models are going to greatly accelerate the rate at which we discover drugs and just the pipeline will get jammed up.“ | Abschrift: „…drugs, and the pipeline will get jammed up“ (geglättet) | ok; Untertitel K9 |

Dwarkesh zusammen 19,2 s (≤ 20 s ✓). Die Einordnungssätze vor und nach den Clips (Z. 17/19, 65/67, 73/75) passen zu den Wortlauten.

### 3k · Anlageberatung und Offenlegung → ok

- Z. 13 „This isn't about whether to buy the stock.“ und die Karte NOT INVESTMENT ADVICE. Keine Kurse, Preise oder Bewertungen in VO und Bild ✓.
- REGELN §1.10: Claude wird im Film nicht genannt, auch nicht im neuen Satz Z. 25 und in MB1. Die Offenlegung steht in `quellen.md` am Ende des Beschreibungsblocks; bei diesem Thema ist sie Pflicht.

---

## 4 · Vollständige Aussagen-Tabelle Sprechtext (vo-v2, in Sprechreihenfolge)

| # | Z. | Aussage (VO) | Ampel | Quelle | Änderung / Anmerkung |
|---|---|---|---|---|---|
| 1 | 1 | „Artificial intelligence just gave disease a ten-year deadline.“ | gelb | [Anthropic](https://www.anthropic.com/news/roadshow-launch) · [TechSpot](https://www.techspot.com/news/114530-anthropic-dario-amodei-uses-ipo-pitch-promise-ai.html) | Titel-Zuspitzung: Die Frist setzte ein Mensch, wörtlich „less than a decade“; Z. 9–11 löst es auf. „just“ ✓. Darf bleiben. |
| 2 | 2–4 | Szene: ein Arzt, „cancer … Alzheimer's. Heart disease. Depression.“; die Enkel hören es wie „plague“ | grün | C1 · [Essay](https://www.darioamodei.com/essay/machines-of-loving-grace) | Szene ohne Tatsachenbehauptung; die vier Wörter folgen C1, „Depression“ steht für „mental illness“ (Z. 46 sagt das). |
| 3 | 6 | „The machines can find cures faster. They can't rush the human body.“ | gelb | [Anthropic, 27.10.2026](https://www.anthropic.com/research/early-progress-drug-development) · C2 | These des Films. „find cures faster“ ist eine Prognose (auch Darios, C2); belegt sind frühe Laborbeispiele. Darf bleiben. |
| 4 | 7 | „Every cure has two dates. The day it's found. And the day it's proven.“ | grün | – | Rahmung |
| 5 | 8 | „The fastest, in weeks. The slowest, only after decades.“ | gelb | RECIST · [Alzheimer's Association](https://www.alz.org/alzheimers-dementia/facts-figures) · [A4](https://www.nejm.org/doi/full/10.1056/NEJMoa2305032) | „weeks“ ✓. „decades“ spitzt zu: Die Veränderungen beginnen ~20 Jahre vorher, eine Vorbeugestudie selbst läuft ~4–5 Jahre. Z. 54–57 erklärt es. Darf bleiben. |
| 6 | 9 | „That deadline comes from Dario Amodei.“ | grün | [Anthropic](https://www.anthropic.com/news/roadshow-launch) | ✓ |
| 7 | 10–11 | [ZITATKARTE C1] „Cancer, Alzheimer's, heart disease, mental illness, these will be relics of the past in, I think, less than a decade.“ | grün | Abschriften [Fireside Alpha](https://x.com/i/web/status/2120173460509032675) und [Bearly AI](https://x.com/i/web/status/2120219569512153201) · [Seeking Alpha](https://seekingalpha.com/article/4966572-wall-street-lunch-cancer-could-become-history-thanks-to-ai-says-anthropic-ceo) · [The Hans India](https://www.thehansindia.com/technology/tech-news/anthropic-ceo-claims-cancer-will-be-history-in-10-years-1141216) | Wortlaut zweifach unabhängig belegt (3a); Ton nicht gehört. Karte unverändert. |
| 8 | 12 | „He runs Anthropic, …“ | grün | [Anthropic](https://www.anthropic.com/news/roadshow-launch) | CEO ✓ |
| 9 | 12 | „… among the biggest artificial intelligence labs, …“ | grün | [TNW](https://thenextweb.com/news/anthropic-ipo-terms-1-4-trillion-valuation) (Suchauszug) | bis ~1,4 Bio. $ Bewertung; kein Superlativ im VO ✓ |
| 10 | 12 | „… and he said it in the video made to sell its shares.“ | grün | [Anthropic](https://www.anthropic.com/news/roadshow-launch) · [Constellation](https://www.constellationr.com/insights/news/anthropics-ipo-roadshow-video-takeaways-absurd-interesting) | Retail-Roadshow-Video, 10.11.2026 |
| 11 | 13 | „This isn't about whether to buy the stock.“ | grün | – | Hinweis (3k) |
| 12 | 14 | „He didn't invent it for investors. Years ago, he wrote the same bet into an essay called Machines of Loving Grace. With small print.“ | gelb | [Essay](https://www.darioamodei.com/essay/machines-of-loving-grace) | Okt. 2024 ✓, Titel ✓, Kleingedrucktes ✓. „the same bet“ spitzt zu: 2024 hieß es 5–10 Jahre nach „powerful AI“ („7-12 years from now“), „most cancer“, Herzkrankheit nur unter „Improved treatment of most other ailments“. Darf bleiben. |
| 13 | 15 | „Trials are slow, he argues, largely because most drugs barely work.“ | grün | Essay | „a lot (though by no means all!) of their slowness ultimately derives from the need to rigorously evaluate drugs that barely work or ambiguously work. This is sadly true of most therapies today“ |
| 14 | 16 | „When something works really well, the proof comes fast.“ | grün | Essay | „When something works really well, it goes much faster“ |
| 15 | 17 | „Earlier this year, on a podcast, he made the same point, and set his own limit.“ | grün | [Dwarkesh](https://www.youtube.com/watch?v=n1E9IZfvGMA&t=3263s) | 13.2.2026 ✓ |
| 16 | 18 | [CLIP C3] | grün | ebd. 54:23,0–54:33,5 | Whisper und Abschrift stimmen überein, Sprecher Dario ✓ (3j); Untertitel K9 |
| 17 | 19 | „So even in his view, proof takes time.“ | grün | C3 | Deutung von „not instant, not infinitely fast“ |
| 18 | 20 | „Less than a decade: that's before twenty thirty-six.“ | **rot** | [Anthropic](https://www.anthropic.com/news/roadshow-launch) (Datum) | **M1** → „by twenty thirty-six“ |
| 19 | 20 | „Four diseases, and one question for each. When a medicine really works, how fast does the body say so?“ | grün | C1 | vier ✓ |
| 20 | 21 | „The fastest clear answer comes from cancer.“ | gelb | [FDA, Larotrectinib](https://www.fda.gov/drugs/fda-approves-larotrectinib-solid-tumors-ntrk-gene-fusions) · CTX310 | Auch das LDL antwortet in Wochen (Z. 37). Als Reihenfolge der Stationen vertretbar. |
| 21 | 23 | „In the lab, the day a cure is found is already getting closer.“ | grün | [Anthropic, 27.10.2026](https://www.anthropic.com/research/early-progress-drug-development) | Rahmung, belegt durch Z. 25 und 71 |
| 22 | 24 | „Doctors can rebuild a patient's own immune cells to hunt cancer, with a receptor that works like a hook.“ | grün | [NCI, CAR T cells](https://www.cancer.gov/about-cancer/treatment/research/car-t-cells) (Suchauszug) | CAR-T, seit 2017 zugelassen |
| 23 | 25 | „Artificial intelligence now helps design those hooks, in a fraction of the time.“ | **rot** | [Anthropic, 27.10.2026](https://www.anthropic.com/research/early-progress-drug-development) · [Generate](https://generatebiomedicines.com/publications/refactored-intracellular-domains-enhance-car-expression-and-function/) | **M2** → „…helps redesign those hooks. One new design already works better.“ |
| 24 | 26 | „All still in the lab.“ | grün | ebd. | „mostly preclinical“, „in lab tests“ |
| 25 | 27 | „Then the body answers. And a tumor answers fast: on a scan, within weeks, it shrinks or it doesn't.“ | grün | RECIST · FDA | Bildgebung alle 6–8 Wochen |
| 26 | 28 | „That's how one pill won approval with just fifty-five patients, spread across many different cancers. Most of them responded.“ | grün | [FDA, 26.11.2018](https://www.fda.gov/drugs/fda-approves-larotrectinib-solid-tumors-ntrk-gene-fusions) (Suchauszug) | 55 Patienten, 12 Krebsarten, 75 %; beschleunigte Zulassung. Kapsel bzw. Lösung = „pill“ ✓ |
| 27 | 29 | „But cancer isn't one disease. It's more than a hundred, and they fight back.“ | grün | [NCI](https://www.cancer.gov/about-cancer/understanding/what-is-cancer) (Suchauszug) | „more than 100 types“; „fight back“ = Resistenz |
| 28 | 30 | „His own essay said so: the end of most cancer, not all. Some rare, difficult cancers may persist.“ | grün | Essay | „Elimination of most cancer“ · „It would not be surprising if an assortment of rare, difficult malignancies persists.“ |
| 29 | 31 | „The line in the sales video just says: cancer.“ | grün | C1 (3a) | bezieht sich nur auf den zitierten Satz ✓ |
| 30 | 32 | Urteil Krebs: „for many kinds, the proof can come in time. Not for every kind.“ | grün | Nr. 25–28 | Wertung, gedeckt |
| 31 | 35–36 | „Heart disease answers twice. … In a recent trial, people got a single infusion that switched off a gene in the liver.“ | grün | [ACC zu NEJM](https://www.acc.org/Latest-in-Cardiology/Articles/2025/11/03/16/19/sat-956am-crispr-aha-2025) (Suchauszug) | CTX310 (ANGPTL3), 15 Teilnehmende, NEJM 8.11.2025 |
| 32 | 37 | „At the highest dose, weeks later, their bad cholesterol was cut roughly in half.“ | grün | ebd. · [CRISPR Therapeutics](https://ir.crisprtx.com/news-releases/news-release-details/crispr-therapeutics-announces-positive-phase-1-clinical-data) | LDL −49/−50 % an Tag 60; nach einem Jahr −53 % |
| 33 | 38 | „One treatment, meant to last a lifetime.“ | grün | ebd. | „one-time“, dauerhafte Genänderung |
| 34 | 39 | „But a change to your DNA is for life. So regulators ask to follow patients for up to fifteen years.“ | grün | [FDA, Genome Editing](https://www.fda.gov/media/156894/download) (Suchauszug) | „up to 15 years“ ✓ |
| 35 | 40 | „And whether the heart attacks really stay away takes a stadium full of people, followed for years.“ | grün | [FOURIER](https://www.nejm.org/doi/full/10.1056/NEJMoa1615664) | 27.564 Patienten, 2,2 Jahre. Für eine Zulassung reicht beim LDL oft der Laborwert; der Satz meint aber den Beweis gegen Herzinfarkte ✓ |
| 36 | 41 | Urteil Herz: „only halfway. The tool can be ready in time. The proof that it's safe for a lifetime can't.“ | grün | Nr. 31–35 | Wertung; Gabe 2025 plus 15 Jahre ergibt ~2040 |
| 37 | 43 | Abo-Aufruf Mitte | grün | – | Mission, keine Tatsache |
| 38 | 45–46 | „Take depression, one part of mental illness. A trial runs for weeks. But in those weeks, many people improve on a sugar pill too.“ | grün | [Furukawa 2016](https://pubmed.ncbi.nlm.nih.gov/27726982/) (Suchauszug) | 6–8 Wochen üblich; Placebo-Ansprechen 35–40 % |
| 39 | 47 | „Even for the antidepressants already approved, only about half the trials beat the sugar pill.“ | grün | [Turner 2008](https://pubmed.ncbi.nlm.nih.gov/18199864/) (Suchauszug) | 38 von 74 (51 %) |
| 40 | 48 | „And there's no blood test for depression.“ | grün | FDA | kein zugelassener Diagnose-Bluttest |
| 41 | 48 | „The diagnosis is a questionnaire.“ | gelb | DSM-5 / ICD | ärztliches Gespräch nach Kriterien → **K1** |
| 42 | 49 | „In his essay, he wrote that most mental illness can probably be cured.“ | grün | Essay | wortgleich |
| 43 | 50 | „Cancer has its scan. The mind is still waiting for one.“ | grün | – | Wertung; kein validierter Scan für die Depressionsdiagnose |
| 44 | 51 | „And then the fourth disease. The slowest. It starts long before it shows.“ | grün | [Alzheimer's Association](https://www.alz.org/alzheimers-dementia/facts-figures) | ✓ |
| 45 | 54 | „The changes in the brain start around twenty years before the first forgotten name.“ | grün | ebd. (Suchauszug) | „20 years or more“ |
| 46 | 55 | „… many people who'll be diagnosed by the deadline already carry the first traces today.“ | grün | ebd. | Ableitung aus Nr. 45 |
| 47 | 56 | „So the medicine has to come before the symptoms. Proving that means following healthy people for years, and counting who doesn't get sick.“ | grün | Essay („Prevention of Alzheimer's“) · A4 · [TRAILBLAZER-ALZ 3](https://pmc.ncbi.nlm.nih.gov/articles/PMC12439032/) | Vorbeugestudien mit Gesunden über Jahre ✓ |
| 48 | 57 | „One such trial waited years for its answer. The drug didn't work.“ | grün | [A4, NEJM 2023](https://www.nejm.org/doi/full/10.1056/NEJMoa2305032) (Suchauszug) | 240 Wochen, kein Effekt |
| 49 | 58 | „And for those already sick, his essay had more small print: existing damage may be very difficult to reverse.“ | grün | Essay | „That said, damage from already existing Alzheimer's may be very difficult to reverse.“ |
| 50 | 59 | „The line in the sales video doesn't mention that either.“ | grün | C1 | nur der zitierte Satz ✓ |
| 51 | 60 | Urteil Alzheimer: „no. For many who'll get it by then, it has already begun.“ | grün | Nr. 45–49 | Wertung, gedeckt |
| 52 | 61 | „But the race doesn't start at the deadline. It starts now. Since last year, a blood test can spot the first traces.“ | gelb | [FDA, 16.5.2025](https://www.fda.gov/news-events/press-announcements/fda-clears-first-blood-test-used-diagnosing-alzheimers-disease) (Suchauszug) | erster FDA-freigegebener Test; Labortests gab es früher → **K2** |
| 53 | 62 | „So if the machines aren't the slow part, why set a date at all?“ | grün | – | Frage |
| 54 | 64 | „Partly, because a sales pitch rewards a promise with a date on it. No villain needed.“ | gelb | – | Deutung (Anreiz), fair gerahmt („Partly“, „No villain needed“, zweite Antwort Z. 68). Darf bleiben. |
| 55 | 65 | „The Nobel Prize-winning biologist Venki Ramakrishnan, …“ | grün | Nobelpreis Chemie 2009 | ✓ |
| 56 | 65 | „… asked this month about artificial intelligence and new drugs, named the slow part:“ | **rot** | [Peterman](https://www.youtube.com/watch?v=-1q0zA21AkY&t=336s) · YouTube-API | **M3** → „asked in a recent interview about …“ |
| 57 | 66 | [CLIP C5] | grün | ebd. 5:36,0–5:45,4 | Whisper (3j) |
| 58 | 67 | „The testing, not the finding.“ | grün | C5 | Deutung |
| 59 | 68 | „The other reason for Amodei's date: he's betting that the testing can speed up too.“ | grün | Essay · C3 | „much faster than we're used to“ |
| 60 | 69 | „The cardiologist Eric Topol, a fan of what artificial intelligence can do for health, called such cure timelines wildly off-base.“ | grün | [Digg](https://digg.com/tech/e1hcm8rs) · Gary Marcus, 17.8.2026 (Suchauszüge) | X-Post 16.8.2026 (3g); zwei unabhängige Wiedergaben, x.com gesperrt |
| 61 | 70 | „To be fair, Amodei holds himself to a harder test. In August, he wrote …“ | grün | [TechCrunch](https://techcrunch.com/2026/08/16/anthropic-ceo-says-ai-backlash-is-fundamentally-a-crisis-of-trust/) · [Fortune](https://fortune.com/2026/08/16/dario-amodei-anthropic-ai-trust-crisis-regulation-frontier-open-models-negative-views/) · [Semafor](https://www.semafor.com/article/08/16/2026/amodei-addresses-ai-backlash) | 15.8.2026 ✓; im selben Post wiederholt er „~5-10 years“ → „harder test“ fair |
| 62 | 70 | „… that the only thing that will convince people is actually curing cancer.“ | gelb | ebd. · [Cybernews](https://cybernews.com/ai-news/anthropic-ceo-ai-opinion-cure-cancer/) | Wortlaut „The thing that will work is actually curing cancer.“ → **K3** |
| 63 | 71 | „His own company now designs medicines.“ | grün | [Anthropic, 27.10.2026](https://www.anthropic.com/research/early-progress-drug-development) | „We've also started drug discovery efforts of our own“; Mithril übernommen |
| 64 | 71 | „One, for muscular dystrophy, went from idea to promising results in mice in under eighteen months.“ | grün | ebd. | wortgleich belegt. Die 18 Monate liefen bei Mithril (Ein-Personen-Firma mit Claude) vor der Übernahme; der VO schreibt sie nicht Anthropic zu. |
| 65 | 72 | „Its human trials could start as soon as late twenty twenty-eight.“ | grün | ebd. | „as soon as late 2028“ |
| 66 | 72 | „Same road as everyone else. First date: fast. Second date: years away.“ | grün | ebd. | Deutung ✓ |
| 67 | 73 | „He even warned of a jam himself, earlier this year, on that same podcast.“ | grün | [Dwarkesh](https://www.youtube.com/watch?v=n1E9IZfvGMA&t=6149s) | 1:42:29 ✓ |
| 68 | 74 | [CLIP C2] | grün | ebd. 1:42:38,9–1:42:47,6 | Whisper und Abschrift stimmen überein, bis auf das Wort „just“ (K9) |
| 69 | 75 | „Discovery speeds up. Proof jams.“ | grün | C2 | Echo |
| 70 | 78 | „It can. And it's already starting.“ | grün | Nr. 71–77 | Rahmung, gedeckt |
| 71 | 79–80 | „Picture someone you love, around sixty, sharp as ever. At a study clinic, a blood test finds the first traces, years early. So they join a trial: can a medicine hold off the first forgotten name?“ | grün | [TRAILBLAZER-ALZ 3](https://pmc.ncbi.nlm.nih.gov/articles/PMC12439032/) (Suchauszug) | Szene; Einschluss 55–80, Screening per p-tau217 im Blut ✓ → **K4** |
| 72 | 81 | „For now, healthy people get that test only in trials.“ | **rot** | [Quest](https://www.biospace.com/quest-launches-direct-to-consumer-beta-amyloid-blood-test-for-alzheimer-s) · [FDA](https://www.fda.gov/news-events/press-announcements/fda-clears-first-blood-test-used-diagnosing-alzheimers-disease) · [Alz. Assoc.](https://aaic.alz.org/releases-2025/clinical-practice-guideline-blood-based-biomarkers.asp) | **M4** → „For now, experts advise that test for healthy people only in trials.“ |
| 73 | 81 | „But that's how the slowest proof gets a head start.“ | grün | TRAILBLAZER-ALZ 3 | ✓ |
| 74 | 82 | „In other trials, part of the sugar-pill group is replaced by a prediction: a digital twin of each patient.“ | gelb | [EMA, PROCOVA](https://www.ema.europa.eu/en/documents/regulatory-procedural-guideline/qualification-opinion-prognostic-covariate-adjustment-procovatm_en.pdf) | PROCOVA rechnet mit einer Prognose je Patient und erlaubt kleinere Kontrollgruppen; „replaced“ vereinfacht, Z. 83 stellt es richtig. Darf bleiben. |
| 75 | 83 | „Fewer people on a sugar pill, answers sooner. Europe's regulator accepts it for some trials. It shrinks the comparison group. It doesn't replace it.“ | grün | ebd. (Suchauszug) | 20.9.2022, randomisierte Phase-2/3-Studien |
| 76 | 84 | „At America's regulator, reviewers now work with an artificial intelligence assistant.“ | grün | [FDA, 2.6.2025](https://www.fda.gov/news-events/press-announcements/fda-launches-agency-wide-ai-tool-optimize-performance-american-people) (Suchauszug) | Elsa ✓ |
| 77 | 84 | „For a few priority medicines, the goal is a decision within one or two months.“ | grün | [FDA, CNPV](https://www.fda.gov/industry/commissioners-national-priority-voucher-cnpv-pilot-program) (Suchauszug) | Ziel ✓; umstritten, Stand am 16.11. prüfen (8) |
| 78 | 85 | „Amodei's own proposal: rules made for medicines that clearly work. But remember the heart: fast can't mean less safe.“ | **rot** | [Dwarkesh](https://www.youtube.com/watch?v=n1E9IZfvGMA&t=6170s) 1:42:50–1:43:21 | **M5** → „…that clearly work and are clearly safe.“ |
| 79 | 86–88 | „In the sales video, his promise came with a condition. In his words:“ + [ZITATKARTE C1b] „I think if we do this right, we can create an age of miracles.“ | grün | [Constellation](https://www.constellationr.com/insights/news/anthropics-ipo-roadshow-video-takeaways-absurd-interesting) · [TechSpot](https://www.techspot.com/news/114530-anthropic-dario-amodei-uses-ipo-pitch-promise-ai.html) · [Bearly AI](https://x.com/i/web/status/2120219569512153201) | „age“ ✓, Reihenfolge ✓ (3a). Karte unverändert. |
| 80 | 89–96 | „the second date becomes the real deadline. And people set that one.“ · Bilanz ✓ ½ ? ✗ · Enkel · Kernsatz | grün | Stationen 2–7 | Wertungen, gedeckt |
| 81 | 97 | „Investors are already putting a price on the first date. The second one is still ours to move.“ | grün | [Anthropic](https://www.anthropic.com/news/roadshow-launch) · 3b | Orderbuch läuft seit 10.11. ✓ |
| 82 | 99 | Abo-Aufruf Schluss | grün | – | Mission, keine Tatsache |

**Sprechtext:** 82 Aussagen · 67 grün · 10 gelb · 5 rot.

---

## 5 · Einblendungen und Bildtexte (text-v2, in Bildreihenfolge)

| # | Zeit | Einblendung / Bildtext | Ampel | Quelle | Anmerkung |
|---|---|---|---|---|---|
| E1 | 0:00 | AI GAVE DISEASE A DEADLINE · Stempel DEADLINE: 2036 | gelb | C1 | Titel-Zuspitzung (K10); „2036“ passt nach M1 |
| E2 | 0:01 | „…relics of the past in, I think, less than a decade.“ · Dario Amodei, Nov 10, 2026 | grün | 3a | ✓ |
| E3 | 0:21 | WHICH COULD BE HISTORY BY THE DEADLINE? | grün | – | Frage |
| E4 | 0:47 | DARIO AMODEI · CEO, ANTHROPIC · NOV 10, 2026 | grün | Anthropic | ✓ |
| E5 | 0:50 | Zitatkarte C1 · Quelle: Anthropic, retail roadshow video, Nov 10, 2026 | grün | 3a | ✓ |
| E6 | 0:59 | Rahmen ROADSHOW, Kürzel ANT, keine Kurse | grün | Anthropic | „ANT“ ✓ |
| E7 | 1:08 | NOT INVESTMENT ADVICE | grün | – | ✓ |
| E8 | 1:11 | MACHINES OF LOVING GRACE · OCT 2024 | grün | Essay | ✓ |
| E9 | 1:39 | C3: DARIO AMODEI · CEO, ANTHROPIC · FEB 2026 · ORIGINAL FOOTAGE (Dwarkesh Podcast), eigene Untertitel | grün | Dwarkesh | Untertitel K9 |
| E10 | 1:50 | NOT INSTANT, NOT INFINITELY FAST | grün | C3 | ✓ |
| E11 | 1:53 | DEADLINE: 2036 · OUR CONVERSION OF „LESS THAN A DECADE“ (NOV 2026) | grün | M1 | ✓ |
| E12 | 2:21 | CAR-T DESIGN STEP ≈ 70 % SHORTER · PRECLINICAL · Anthropic research update, Oct 2026 | **rot** | Anthropic, 27.10.2026 | **MB1** |
| E13 | 2:29 | Tafel: CANCER · ANSWERS IN WEEKS | grün | Nr. 25 | ✓ |
| E14 | 2:37 | LAROTRECTINIB · FDA, NOV 2018 · 55 PATIENTS · 12 CANCER TYPES · 75 % RESPONDED | grün | FDA | ✓ |
| E15 | 2:44 | 100+ TYPES OF CANCER · NCI | grün | NCI | ✓ |
| E16 | 2:50 | „Elimination of most cancer“ · „…an assortment of rare, difficult malignancies persists.“ · Amodei, Oct 2024 | gelb | Essay | Die Einschränkung ist abgeschnitten → **K5** |
| E17 | 3:02 | Tafel: CANCER · WEEKS · ✓ MANY KINDS | grün | – | Wertung |
| E18 | 3:15 | CTX310 · NEJM, NOV 2025 · 15 PEOPLE · ONE INFUSION | grün | ACC/NEJM | ✓ |
| E19 | 3:23 | LDL ≈ −50 % · HIGHEST DOSE · DAY 60 | grün | ebd. | ✓ |
| E20 | 3:32 | FDA: UP TO 15 YEARS FOLLOW-UP FOR GENOME EDITING | grün | FDA | ✓ |
| E21 | 3:40 | E.G. FOURIER: 27,564 PATIENTS · MEDIAN 2.2 YEARS | grün | NEJM 2017 | ✓ |
| E22 | 3:48 | Tafel: HEART · WEEKS (BLOOD) / YEARS (HEART) · ½ | grün | – | Wertung |
| E23 | 4:29 | 38 OF 74 TRIALS POSITIVE (51 %) · FDA REVIEWS · Turner et al., NEJM 2008 | grün | Turner | ✓ |
| E24 | 4:40 | „Most mental illness can probably be cured.“ · Amodei, Oct 2024 | grün | Essay | ✓ |
| E25 | 4:47 | Tafel: MIND · WEEKS, BUT FAINT · ? | grün | – | Wertung |
| E26 | 5:02 | CHANGES CAN BEGIN 20+ YEARS BEFORE SYMPTOMS · Alzheimer's Association | grün | Alz. Assoc. | ✓ |
| E27 | 5:24 | A4 (SOLANEZUMAB) · 240 WEEKS · FAILED | grün | NEJM 2023 | ✓ |
| E28 | 5:29 | „…damage from already existing Alzheimer's may be very difficult to reverse.“ · Amodei, Oct 2024 | grün | Essay | ✓ |
| E29 | 5:41 | Tafel: ALZHEIMER'S · DECADES · ✗ | grün | – | Wertung |
| E30 | 5:48 | FIRST ALZHEIMER'S BLOOD TEST CLEARED · FDA, MAY 2025 · FOR PEOPLE WITH SYMPTOMS, 55+ | grün | FDA | ✓ („cleared“ ist das richtige Wort) |
| E31 | 6:20 | C5: VENKI RAMAKRISHNAN · MOLECULAR BIOLOGIST · NOBEL PRIZE IN CHEMISTRY 2009 · NOV 2026 · ORIGINAL AUDIO (Ryan Peterman) | grün | API | „NOV 2026“ ist das Veröffentlichungsdatum → K8 |
| E32 | 6:32 | „…the clinical trials are going to go much faster than we're used to…“ · Amodei, Feb 2026 | grün | C3 | ✓ |
| E33 | 6:38 | „…these cure projections are wildly off-base…“ · Eric Topol, cardiologist, on X | grün | 3g | Wiedergaben; Datum → K6 |
| E34 | 6:46 | „The thing that will work is actually curing cancer.“ · Amodei on X, Aug 2026 | grün | 3g | ✓ |
| E35 | 6:57 | MITHRIL · MUSCULAR DYSTROPHY · IDEA → MOUSE DATA IN < 18 MONTHS | grün | Anthropic | ✓ |
| E36 | 7:06 | „as soon as late 2028“ | grün | Anthropic | ✓ |
| E37 | 7:22 | C2: DARIO AMODEI · CEO, ANTHROPIC · FEB 2026 · ORIGINAL FOOTAGE (Dwarkesh Podcast) | grün | Dwarkesh | ✓ |
| E38 | 7:30 | Tafel komplett ✓ ½ ? ✗ | grün | – | Wertung |
| E39 | 7:55 | IN PEOPLE WITHOUT SYMPTOMS: ONLY IN TRIALS · TRAILBLAZER-ALZ 3 SCREENS BY BLOOD TEST | **rot** | 3d | **MB2** |
| E40 | 8:11 | DIGITAL TWINS (PROCOVA) · QUALIFIED BY EMA, SEPT 2022 · UP TO ~35 % SMALLER CONTROL GROUPS (COMPANY FIGURE) | grün | EMA | ✓ |
| E41 | 8:21 | FDA „ELSA“ SINCE JUNE 2025 · NATIONAL PRIORITY VOUCHER: TARGET 1–2 MONTHS | grün | FDA | ✓ |
| E42 | 8:32 | „…designed around an era of drugs that barely work…“ · Amodei, Feb 2026, dann UP TO 15 YEARS FOLLOW-UP | gelb | Dwarkesh | richtig zitiert, aber einseitig → **K7** |
| E43 | 8:45 | Zitatkarte C1b „I think if we do this right, we can create an age of miracles…“ · Anthropic, retail roadshow video, Nov 10, 2026 | grün | 3a | ✓ |
| E44 | 9:14 | ✓ ½ ? ✗ | grün | – | Wertung |
| E45 | 9:24 | Bild: Vitrine mit verblasstem Schild ALZHEIMER'S | grün | – | Bild, „Maybe“ im VO |
| E46 | 9:35 | EVERY CURE HAS TWO DATES | grün | – | Kernsatz |
| E47 | 9:41 | Börsenticker ohne Kurs und Preis | grün | 3b | ✓ |

**Einblendungen:** 47 Aussagen · 42 grün · 3 gelb · 2 rot.

---

## 6 · Die 16 [prüfen]-Stellen des Texters (text-v2, „Faktencheck: besonders prüfen“)

| Nr. in text-v2 | Stelle | Ergebnis |
|---|---|---|
| 1 | 0:50 Zitatkarte C1 und Quellzeile ab 0:01 | **grün**: zwei unabhängige Abschriften plus Berichte; Ausschnitt ab „cancer“ ✓; Ton nicht gehört (3a) |
| 2 | 0:59 „among the biggest artificial intelligence labs“ | **grün** |
| 5 | 2:13 CAR-T-Erklärung | **grün** (NCI) |
| 6 | 2:21 „…in a fraction of the time“ | **rot → M2, MB1**: Die 70 % sind die Länge des Entwurfs; der Schritt betrifft einen Teil des Rezeptors (innen), nicht die Bindungsspitze |
| 8 | 2:58 „The line in the sales video just says: cancer.“ | **grün** |
| 11 | 3:40 „a stadium full of people“ | **grün**: FOURIER 27.564, Median 2,2 Jahre; ein großes Stadion fasst so viele |
| 12 | 4:19 Wochen und Placebo | **grün**: 6–8 Wochen, Placebo-Ansprechen 35–40 % (Furukawa 2016) |
| 16 | 5:24 A4 | **grün** |
| 17 | 5:37 „doesn't mention that either“ | **grün** |
| 19 | 6:12 Ramakrishnan | „this month“ **rot → M3**; „biologist“ und Thema **grün**; nicht als Antwort auf Dario ✓ |
| 21 | 6:38 Topol | **grün** (16.8.2026, Wiedergaben); Datum in die Einblendung → K6 |
| 22 | 6:46 August-Post | **grün** (15.8.2026, Wortlaut bestätigt); VO zugespitzt → K3 |
| 25 | 7:40 „around sixty“ | **grün**: Einschluss 55–80; das Screening der 55- bis 64-Jährigen in TRAILBLAZER-ALZ 3 endete nach einem Jahr → K4 |
| 27 | 8:21 FDA | **grün**; Stand am 16.11. prüfen |
| 29 | 8:45 Zitatkarte C1b | **grün**: „age“, Reihenfolge ✓ |
| 30 | 9:41 Anleger-Satz | **grün** (3b) |

Zusatz zu Punkt 31 (Stand am 16.11.): Bisher ist kein von KI entdecktes Medikament voll zugelassen. Der Satz „Same road as everyone else“ bleibt in jedem Fall richtig. Alle Zeitwörter stehen in 3i.

---

## 7 · Zweite Runde: Gegenprüfung mit frischem Blick

**Vorgehen:** Ich bin noch einmal von `vo-v2.txt` und den Quellen ausgegangen, nicht von meiner ersten Tabelle, und habe aus Sicht eines Kenners gefragt: Was würde ein Onkologe, Kardiologe, Psychiater, Alzheimer-Forscher, Regulierungs-Fachmann oder ein Anthropic-Sprecher angreifen? Der Schwerpunkt lag auf Rot und Gelb, Fairness gegenüber Dario, Medizin-Zahlen und Zulassungen.

**Einschränkung:** Es ist derselbe Prüfer. Im Sinne der Ampelseiten-Regel ist das keine unabhängige Zweitprüfung; die Ampelseite (9) braucht weiter einen Prüfer, der diese Datei nicht sieht. Die Ampel hier ist strenger als in Abschnitt 4: **grün** = Primärquelle selbst eingesehen · **gelb** = nur Suchauszug oder Bericht, oder eine Abweichung · **rot** = falsch.

| # | Aussage | Urteil | Ampel | Begründung (ein Satz) | Links |
|---|---|---|---|---|---|
| 1 | C1: „…relics of the past in, I think, less than a decade.“ | bestätigt (sekundär) | gelb | Zwei unabhängige Abschriften vom 10.11. und mehrere Berichte stimmen Wort für Wort überein; den Ton hat niemand von uns gehört. | [Bearly AI](https://x.com/i/web/status/2120219569512153201) · [Seeking Alpha](https://seekingalpha.com/article/4966572-wall-street-lunch-cancer-could-become-history-thanks-to-ai-says-anthropic-ceo) |
| 2 | C1b: „age of miracles“, nach dem Krankheits-Satz | bestätigt (sekundär) | gelb | „era of miracles“ steht nirgends; die Reihenfolge belegen Bearly AI und Constellation. | [Constellation](https://www.constellationr.com/insights/news/anthropics-ipo-roadshow-video-takeaways-absurd-interesting) |
| 3 | Z. 20 „before 2036“ | korrigiert (M1) | grün | Das Datum der Aussage (10.11.2026) steht bei Anthropic; weniger als zehn Jahre reichen bis Nov. 2036. | [Anthropic](https://www.anthropic.com/news/roadshow-launch) |
| 4 | Z. 25 „in a fraction of the time“ | falsch, korrigiert (M2) | rot → behoben | Die Primärquelle spricht von einem 70 % kürzeren Entwurf, nicht von Zeit. | [Anthropic](https://www.anthropic.com/research/early-progress-drug-development) |
| 5 | Z. 28 Larotrectinib 55 Patienten, „most responded“ | bestätigt | gelb | FDA-Mitteilung laut Suchauszug: 55 Patienten, 12 Arten, 75 %, beschleunigte Zulassung. | [FDA](https://www.fda.gov/drugs/fda-approves-larotrectinib-solid-tumors-ntrk-gene-fusions) |
| 6 | Z. 37 LDL „roughly in half“ | bestätigt | gelb | NEJM-Daten über ACC und Firmenmitteilung: −49/−50 % bei der höchsten Dosis; der Kenner-Einwand „nur 15 Menschen, Phase 1“ trifft nicht, weil der VO „In a recent trial“ sagt und nichts verallgemeinert. | [ACC](https://www.acc.org/Latest-in-Cardiology/Articles/2025/11/03/16/19/sat-956am-crispr-aha-2025) |
| 7 | Z. 39 „up to fifteen years“ | bestätigt | gelb | FDA-Leitlinien laut Suchauszug; Kenner-Einwand „Zulassung wartet nicht 15 Jahre“: stimmt, der VO behauptet das nicht, Z. 41 spricht vom Beweis lebenslanger Sicherheit. | [FDA](https://www.fda.gov/media/156894/download) |
| 8 | Z. 47 „only about half the trials“ | bestätigt | gelb | Turner 2008: 38 von 74 laut FDA positiv; „already approved“ trifft, denn alle 12 Mittel waren zugelassen. | [PubMed](https://pubmed.ncbi.nlm.nih.gov/18199864/) |
| 9 | Z. 54 „around twenty years“ | bestätigt | gelb | Alzheimer's Association: „20 years or more“ (Suchauszug). | [alz.org](https://www.alz.org/alzheimers-dementia/facts-figures) |
| 10 | Z. 81 „healthy people get that test only in trials“ | falsch, korrigiert (M4) | rot → behoben | Verbrauchertests sind seit 2023 frei bestellbar; beschränkt ist nur der Rat der Fachleute und die Freigabe. | [BioSpace](https://www.biospace.com/quest-launches-direct-to-consumer-beta-amyloid-blood-test-for-alzheimer-s) |
| 11 | Z. 65 „asked this month“ | unbelegt, korrigiert (M3) | grün | YouTube-API: veröffentlicht 9.11.2026, kein Aufnahmedatum. | [Video](https://www.youtube.com/watch?v=-1q0zA21AkY) |
| 12 | Z. 69 Topol „wildly off-base“ | bestätigt (sekundär) | gelb | Wortlaut zweifach wiedergegeben, x.com gesperrt; wem genau er antwortete, ist offen, „such cure timelines“ deckt das. | [Digg](https://digg.com/tech/e1hcm8rs) |
| 13 | Z. 70 „the only thing that will convince people“ | zugespitzt | gelb | Wortlaut „The thing that will work is actually curing cancer.“; der Kontext Vertrauen ist korrekt (K3). | [TechCrunch](https://techcrunch.com/2026/08/16/anthropic-ceo-says-ai-backlash-is-fundamentally-a-crisis-of-trust/) |
| 14 | Z. 71 Mithril, unter 18 Monate | bestätigt | grün | Anthropic wortgleich; Kenner-Einwand „das war vor der Übernahme“: stimmt, der VO schreibt es nicht Anthropic zu. | [Anthropic](https://www.anthropic.com/research/early-progress-drug-development) |
| 15 | Z. 85 Darios Vorschlag | unfair verkürzt, korrigiert (M5) | grün | Abschrift: „safety and efficacy … crisp and clear“. | [Dwarkesh](https://www.youtube.com/watch?v=n1E9IZfvGMA&t=6170s) |
| 16 | Z. 82 „replaced by a prediction“ | zugespitzt | gelb | PROCOVA ist eine Kovariaten-Anpassung; Z. 83 sagt richtig „It shrinks the comparison group. It doesn't replace it.“ | [EMA](https://www.ema.europa.eu/en/documents/regulatory-procedural-guideline/qualification-opinion-prognostic-covariate-adjustment-procovatm_en.pdf) |
| 17 | Z. 84 „one or two months“ | bestätigt | gelb | FDA-Seite laut Suchauszug; das Programm ist umstritten, und einen Stand nach Juli 2026 fand ich nicht. | [FDA](https://www.fda.gov/industry/commissioners-national-priority-voucher-cnpv-pilot-program) |
| 18 | Börsengang: Spanne, Termin | Spanne bestätigt, Termin nur berichtet | gelb | Spanne und Aktienzahl stehen bei Anthropic; Preis 18.11. und Handel 19.11. nur laut Berichten. | [Anthropic](https://www.anthropic.com/news/roadshow-launch) |

**Ergebnis der zweiten Runde:**
- Sie bestätigt alle fünf roten Stellen im VO und die zwei im Bild. Eine weitere rote Stelle fand sie nicht.
- **Neu dazugekommen sind:**
  - K4: TRAILBLAZER-ALZ 3 stoppte das Screening der 55- bis 64-Jährigen.
  - K5: Die Einblendung bei 2:50 schneidet die Einschränkung ab.
  - K9: Unterschied „just“ in C2 zwischen Whisper und Abschrift.
  - Bei M5 der Satz „I would deregulate a lot of the stuff around the health benefits of AI“, der die Grenze „fast can't mean less safe“ stützt.
  - Bei MB1 die Feinheit, dass der innere Teil des Rezeptors neu entworfen wurde, nicht die Hakenspitze.
- **Fairness gegenüber Dario:**
  - Mit M1 und M5 ist der VO an zwei Stellen fairer: keine verkürzte Frist, kein Strohmann beim Vorschlag.
  - Seine Kernaussagen erscheinen mit seinen eigenen Einschränkungen: „I think“, „if we do this right“, „not instant“, „most cancer“, „difficult to reverse“.
  - Die Kritik bleibt am zitierten Satz, nicht an der Person.

---

## 8 · Offen und Rest-Risiken

1. **Roadshow-Ton nicht gehört:** C1 und C1b sind über Abschriften und Berichte belegt (≥ 2 unabhängige). Wenn es vor dem Final-Render geht, am Re-Upload [eynv5VR9qos](https://www.youtube.com/watch?v=eynv5VR9qos) gegenhören (~40:38).
2. **Termin des Börsengangs:** Preis am 18.11. und Handel am 19.11. sind nur berichtet. Am 16.11. vormittags prüfen; nur eine Absage verlangt einen neuen Z. 97.
3. **FDA-Prioritätsprogramm (CNPV):** Für die Zeit nach Juli 2026 fand ich keinen Stand. Das Programm ist politisch umstritten (Anhörung im Juni, Rücktritt Makary im Mai). „the goal is“ bleibt wahr, solange es nicht eingestellt ist; am 16.11. kurz prüfen.
4. **C5** ist nur per Whisper belegt. Am Kontrollschnitt `C5.wav` gegenhören, ebenso die Untertitel-Wörter in C3 und C2 (K9).
5. **Gesperrte Hosts:** aol.com und thenextweb.com (WebFetch: ENOTFOUND, nicht wiederholt), businessinsider.com (auch für die Suche gesperrt). Dazu x.com, fda.gov, nejm.org, pubmed, alz.org und ema.europa.eu: Diese Seiten sind nur als Suchauszug geprüft. Für Volltext müssten sie in den Netzwerkeinstellungen der Sitzung freigegeben werden.
6. **Topol:** Wortlaut und Datum nur über Wiedergaben (x.com gesperrt). Falls jemand den Post findet, die Status-Nummer in `quellen.md` statt des Digg-Links eintragen.
7. **Fehler im Faktenzettel** (nicht im VO, für spätere Filme):
   - F9 „Designschritt ~70 % kürzer“ meint die Länge des Entwurfs, nicht die Zeit.
   - TRAILBLAZER-ALZ 3: Die Zahl 2.996 ist die geplante Teilnehmerzahl im Register. Laut früherem Suchauszug wurden 2.196 aufgenommen (63.124 gescreent).
8. **Bild nach MB1 und MB2:** Die Haken-Animation bei 2:21 und die Einblendung bei 7:55 müssen vor dem Render angepasst werden, sonst widersprechen Bild und neuer Ton einander.

---

## 9 · Ampelseite-Kandidaten (für den unabhängigen Zweitprüfer)

**Ampel:** sicher = Primärquelle eindeutig · umstritten = Quelle trägt, aber Maß oder Deutung angreifbar · dünn = nur eine Quelle oder Primärtext hier nicht einsehbar. Grün erst, wenn der Zweitprüfer die Primärquelle selbst geöffnet hat.

| # | Aussage (ein Satz) | Ampel | Primärquelle |
|---|---|---|---|
| 1 | Z. 10–11: Amodei sagte im Roadshow-Video vom 10.11.2026: „Cancer, Alzheimer's, heart disease, mental illness, these will be relics of the past in, I think, less than a decade.“ | dünn | Roadshow-Video (ipo.anthropic.com; Re-Upload [eynv5VR9qos](https://www.youtube.com/watch?v=eynv5VR9qos)); Abschriften [Bearly AI](https://x.com/i/web/status/2120219569512153201), [Fireside Alpha](https://x.com/i/web/status/2120173460509032675) |
| 2 | Z. 25 (neu): Mit KI vorgeschlagene Entwürfe für einen Teil des CAR-T-Rezeptors; einer ist ~70 % kürzer und lässt die Zellen im Labor ~10× so viele Rezeptoren bilden. | sicher | [Anthropic, 27.10.2026](https://www.anthropic.com/research/early-progress-drug-development) · [Generate](https://generatebiomedicines.com/publications/refactored-intracellular-domains-enhance-car-expression-and-function/) |
| 3 | Z. 28: Larotrectinib wurde 2018 auf Basis von 55 Patienten mit 12 Krebsarten beschleunigt zugelassen; 75 % sprachen an. | sicher | [FDA](https://www.fda.gov/drugs/fda-approves-larotrectinib-solid-tumors-ntrk-gene-fusions) |
| 4 | Z. 36–39: Eine einzige CTX310-Infusion senkte das LDL bei der höchsten Dosis um rund die Hälfte; die FDA empfiehlt bei Genom-Editierung bis zu 15 Jahre Nachbeobachtung. | sicher | [ACC zu NEJM](https://www.acc.org/Latest-in-Cardiology/Articles/2025/11/03/16/19/sat-956am-crispr-aha-2025) · [FDA](https://www.fda.gov/media/156894/download) |
| 5 | Z. 47: Von 74 bei der FDA registrierten Studien zu 12 zugelassenen Antidepressiva waren 38 (51 %) positiv. | sicher | [Turner 2008](https://pubmed.ncbi.nlm.nih.gov/18199864/) |
| 6 | Z. 81 (neu): Für Gesunde raten Fachleute zum Alzheimer-Bluttest bisher nur in Studien; frei kaufbare Tests gibt es trotzdem. | umstritten | [Alz. Assoc. 2025](https://aaic.alz.org/releases-2025/clinical-practice-guideline-blood-based-biomarkers.asp) · [FDA](https://www.fda.gov/news-events/press-announcements/fda-clears-first-blood-test-used-diagnosing-alzheimers-disease) · [Quest](https://www.biospace.com/quest-launches-direct-to-consumer-beta-amyloid-blood-test-for-alzheimer-s) |
| 7 | Z. 69: Eric Topol nannte im August 2026 solche Heilungs-Prognosen „wildly off-base and impossible“. | dünn | X-Post (x.com gesperrt); Wiedergabe [Digg](https://digg.com/tech/e1hcm8rs) |
| 8 | Z. 85 (neu): Amodei will Zulassungsregeln für Mittel, deren Sicherheit und Wirkung „really crisp and clear“ sind. | sicher | [Dwarkesh, 1:42:50](https://www.youtube.com/watch?v=n1E9IZfvGMA&t=6170s) |
| 9 | Z. 84: Die FDA will im Prioritätsprogramm CNPV binnen 1–2 Monaten entscheiden. | umstritten | [FDA, CNPV](https://www.fda.gov/industry/commissioners-national-priority-voucher-cnpv-pilot-program) |

**Ohne Ampel, am Ton prüfen:** C5-Wortlaut (`C5.wav`), C3 „Loving“ oder „Love and“, C2 „just“ (K9).

---

## 10 · Regel-Check

`python3 /mnt/project-files/scenario/schreibraum/regel_check.py vo-v3.txt` (12.11.2026, auf der Projektdatei im Ordner `film-heilung`):

```
===== vo-v3.txt  (1376 Wörter ≈ 9.5 Min)
  → 0 Hinweis(e)
```

Exit-Code 0. Zum Vergleich hatte vo-v2.txt 1.368 Wörter und 0 Hinweise; die Länge ändert sich um +0,6 % (erlaubt sind ±3 %). Dazu per Textsuche in `vo-v3.txt`:
- „subscribe“ = 2
- `[CLIP …]` = 3 (C3, C5, C2), `[ZITATKARTE …]` = 2 (C1, C1b)
- Tags unverändert: `[calm, conversational]` 1, `[curious]` 1, `[thoughtful]` 2, `[warm]` 2, `[pause]` 2
- „AI“ im Sprechtext 0 · Ich-Sätze 0 · 99 Zeilen wie vo-v2
- `diff vo-v2.txt vo-v3.txt` zeigt nur Z. 20, 25, 65, 81 und 85
