# Recherche roh · Film #54 Dario „all diseases cured“ (12.11.2026)

Notizen und Links aus Runde 1. Das ist Rohmaterial, kein Faktenzettel (geprüfte Fassung: `faktenzettel.md`). Texter sehen diese Datei nicht (REGELN §10).

## 1. Zugänge und Grenzen in dieser Sitzung

- **Gingen:**
  - WebSearch (Suchauszüge)
  - curl/WebFetch auf youtube.com (Suchseiten, Kanalseiten), anthropic.com, claude.com
  - die YouTube-Data-API (videos, channels, playlistItems; geringer Verbrauch, keine search-Calls)
  - die Projekt-Transkripte in `recherche/transkripte/`
- **Blockiert (ENOTFOUND oder 403):** ipo.anthropic.com, x.com, sec.gov, businessinsider.com, moneywise.com, hyper.ai, digitaltoday, sbs, techspot, cellcog, dnyuz, wikipedia, lexfridman.com, darioamodei.com, substack, reddit, archive.org, instagram.
  - Folge: Wortlaute dieser Quellen nur aus Suchauszügen, im Faktenzettel als „umstritten“ markiert.
- **YouTube-Watch-Seiten** verlangen eine Bot-Prüfung. Die wurde **nicht umgangen**, deshalb gibt es keinen Ton und keine Untertitel aus dieser Sitzung. Zeitmarken stammen aus den Projekt-Transkripten oder sind ungefähr (Whisper beim Schnitt).
- **vidIQ:** 0 Credits (Erneuerung 19.11.).
- **GitHub-API:** für dieses Repo nicht freigeschaltet.

## 2. Der Instagram-Ausschnitt = Roadshow-Schlusswort (10.11.2026)

- **Original:** https://ipo.anthropic.com/us (Rubrik „Roadshow video“, 42:43), gehostet über NetRoadshow.
- **Re-Uploads Dritter** (nur zum Sichten):
  - https://www.youtube.com/watch?v=eynv5VR9qos (bunaul, 42:44, 20,6k, 10.11. 20:11 UTC; Beschreibung: „Anthropic IPO Roadshow video where Dario Amodei shares his views“)
  - https://www.youtube.com/watch?v=sQCZJixZ2Zs (h8ku). Sprecherliste: Dario Amodei, Daniela Amodei, Ami Vora, Jared Kaplan, Greg Meyers, Sam McCandlish, Tom Brown, Julie Sweet, Paul Smith, Eric Andersen, Krishna Rao.
  - https://www.youtube.com/watch?v=sI9wd-XcugQ (10baggers)
- **Kurzclips des Satzes** (so landet er auf Instagram):
  - Yahoo Finance https://www.youtube.com/shorts/z271lh2ZxeU (27 s, 10.11. 20:08 UTC): „relics of the past“, „age of miracles“, *"roadhouse video"* (sic)
  - YTN https://www.youtube.com/watch?v=58mj-TKIO7s (94k) und https://www.youtube.com/watch?v=3IWCHRIRSgo (Quelle Business Insider; erwähnt Darios August-Post)
  - Saam TV https://www.youtube.com/watch?v=fubTtymNlD8 (121k)
  - News 24 (Hindi) https://www.youtube.com/watch?v=wQTCvWv6pzw
- **Quellenliste des koreanischen Shorts** https://www.youtube.com/watch?v=nrCj4xVriFE:
  - Business Insider, Truman Dickerson, „Dario Amodei says AI will cure cancer and Alzheimer's in a decade. Doctors aren't buying it.“ (11.11.): https://www.businessinsider.com/dario-amodei-anthropic-cancer-cure-ipo-roadshow-backlash-doctors-2026-11
  - Economic Times (11.11.): https://economictimes.indiatimes.com/news/science/dario-amodei-says-ai-could-make-cancer-alzheimers-relics-of-the-past-in-less-than-a-decade-as-anthropic-expands-ai-driven-drug-discovery-push/articleshow/135744334.cms
  - India Today (11.11.): https://www.indiatoday.in/technology/news/story/anthropic-ceo-says-ai-will-help-wipe-out-cancer-alzheimers-and-heart-disease-in-10-years-3036888-2026-11-11
  - X Eric Topol: https://x.com/EricTopol/status/2120302576398958633 (11.11. 08:48 KST)
  - X Karl Lauterbach: https://x.com/Karl_Lauterbach/status/2120507772756443596 (11.11. 22:23 KST)
  - Zeitmarke im Roadshow-Video: „약 40:38“ (ca. 40:38)
- **fOx Hsiao** (Chinesisch, gleicher Prüf-Winkel) https://www.youtube.com/watch?v=QdnpbrRSk8E. Aus der Beschreibung:
  - Die Belege der Roadshow: BMS rechnet mit 20–30 % kürzeren Studien; ~950 Claude-Agenten fanden ein neues System; Ebola-Tagesberichte (Ost-Kongo) in einer Stunde statt eines Tages.
  - Die eigene Umrechnung: 2031–2036 aus dem Essay; die „less than a decade“ der Roadshow endet ~Herbst 2036.
- **iabro** (Spanisch) https://www.youtube.com/watch?v=uIV0p7Cz-rQ. Kapitel: La promesa / Lo que juega a su favor / El viaje de un fármaco / Lo que dicen las farmacéuticas / Los atajos que ya existen / Gemelos digitales en España / Del ratón a la persona / Veredicto.
- **Compute Loading** (EN-Short, 11 Abos) https://www.youtube.com/watch?v=Sl7yNPhhHV8. Quellen laut Beschreibung: BI, Simon Willison, SEC EDGAR (S-1/A), Anthropic-Blog.
- **Wortlaut** laut Fireside Alpha / BI: *"You know, if today we look at things like cancer, Alzheimer's, heart disease, mental illness, these will be relics of the past in, I think, less than a decade."* und *"I think if we do this right, we can create an age of miracles where humanity is able to solve problems that have eluded us for millennia."* Danach etwa *"I believe that the company which gets the risks right…"*.
  - Bearly AI: „Dario's concluding pitch“.
  - Nach gut 30 s geht es im Video um das Biowaffen-Risiko.
  - Kunden-Testimonials: BMS, Accenture.
- **Kein neues Interview** in den Tagen vor dem 12.11.:
  - Offizieller Anthropic-Kanal (UCrDwWp7EBBv4NwvScIpBDOA, 837k Abos): letzter Upload 23.9. „Inside Anthropic's molecular biology lab“.
  - Claude-Kanal (UCV03SRZXJEz-hchIAogeJOg, 738k): Fable-5.2-Launch 9.11. ohne Dario (6a1QSJlsYpU, 4sV2Wzo1V1s, vdYynH177h0, FMbXUxn_nBw Kapsid), danach Produktvideos.

## 3. Börsengang

- Primär (anthropic.com/news/roadshow-launch, 10.11.2026):
  - 825.000.000 Aktien (801.351.354 von Anthropic, 23.648.646 von Altaktionären) + Option auf 123.750.000
  - 70–78 $, Nasdaq Global Select „ANT“, Goldman Sachs / Morgan Stanley
- anthropic.com/news/s1-sec: S-1 öffentlich 26.10.2026, vertraulich eingereicht 1.6.2026.
- CNBC (Kreise): Preis 18.11., Handel 19.11.; Bewertung bis 1,405 Bio. $ voll verwässert.
  - Devsplainers-Titel „Before the Nov 19 Anthropic IPO“ (VR6AXz-qT4I) bestätigt das Datum sinngemäß.
- Bloomberg (11.11., Kreise): mehrfach überzeichnet (3hJscphUBAI, apyrjw8VdO0).
- Reuters (10.11.): „Banks got Anthropic IPO plans before quick retraction, reasons unclear“ (ee7tfcYXIpY), Hintergrund unklar.
- Gerücht „Ziel um 600 Mrd. gesenkt“: nur Kleinkanal (bHUy2xL5LKE), unbelegt.
- SiliconANGLE: Q3 ~17 Mrd. $ Umsatz, 536 Mio. $ operativer Verlust. Bloomberg Tech: Q3 16,8 Mrd. $ (2Uyk62Tqh24).
- Letzte private Runde Mai 2026: 965 Mrd. $.
- SpaceX-IPO 12.6.2026: 75 Mrd. $ (86,2 Mrd. mit Mehrzuteilung) = Rekord.
- Public Benefit Fund (18.10.2026): https://www.anthropic.com/news/public-benefit-fund (~20 % der Aktien fürs Gemeinwohl; kein Lobbying; 200 Mio. $ für Arbeitsmarktfolgen).

## 4. Anthropic-Primärquellen (Texte im Scratchpad gelesen)

- **Drug development, 27.10.2026:** https://www.anthropic.com/research/early-progress-drug-development
  - Partner: BigHat, BMS, Divergence, Enveda, Generate, The Column Group/Pleiades
  - Kauf von Mithril (Muskeldystrophie): „as soon as late 2028“ in Menschen
  - „mostly preclinical“, „bottlenecks are distributed all throughout the drug development process“
  - Programme: Claude Science, Life Sciences Verification Program
- **Fable/Mythos 5.2, 9.11.2026:** https://www.anthropic.com/claude-fable-and-mythos-5-2
  - AAV-Kapsid: 28 von 34 genau, AAV2 1,2 Å / 1,4 Å, ~58 min bzw. ~7 min auf einer H200
  - Stimmen: Dyno Therapeutics, Mohammed AlQuraishi (Columbia), Zeming Lin (Biohub)
  - Phonon-Rechnungen ~36× schneller
- **Enzym-System, 23.9.2026:** https://www.anthropic.com/research/claude-discovers-novel-enzyme-system
  - neues Labor im Frühjahr 2026, Bay Area, BSL-1/2, *"All of the lab work is performed by human scientists"*
  - ~950 Agenten, 21 h, 210 Mio. Tokens; Zitat Feng Zhang; Preprint
- **Skorpiongift-Binder, 20.10.2026:** https://www.anthropic.com/research/claude-scorpion-toxin-binder-design
  - 318.484 Designs, 211 getestet, 17 Binder; Zitat Susana Vázquez Torres
- **AI for Science, 28.10.2026:** https://www.anthropic.com/news/ai-for-science-expands-foundations-research-institutions (20 Partner)
- **Gastforscher Life Sciences, 22.10.2026:** https://www.anthropic.com/news/open-call-guest-investigators-life-sciences
- **Erwartungs-Lücke, 16.10.2026:** https://www.anthropic.com/research/ai-expectations-gap (39 % vs. 91 %)
- **Code with Claude, 6.5.2026:** Dario & Daniela, moderiert von Ami Vora: https://www.youtube.com/watch?v=7xco5Qd2Oo8 (Claude-Kanal, 33:10, 83,6k). Wortlaut zu Medizin unbekannt.
- **Fireside Lilly × Anthropic:** Diogo Rau + Dario (20.10.2025): https://www.youtube.com/watch?v=Yiy0cU6ChSw (5:35). Thema Enterprise-KI, Medizin-Stelle unbekannt.
- **„Introducing Claude for Life Sciences“** (20.10.2025): https://www.youtube.com/watch?v=sHImlfVM9r4 (ohne Dario).

## 5. Dario-Zeitleiste (Heilung)

| Datum | Wo | Was |
|---|---|---|
| 11.10.2024 | Essay „Machines of Loving Grace“ | „compressed 21st century“, 50–100 Jahre in 5–10; „7-12 years from now“; Kleingedrucktes (most cancer, prevention of Alzheimer's, difficult to reverse). Volltext: Projektdatei |
| 11.11.2024 | Lex Fridman #452 (ugvHCXCOmm4) | Kapitel „Machines of Loving Grace“ ab 1:58:05; Biologie-Teil ca. 2:28–2:33 (audioscrape 8901–9130 s): *"we'll want to harness the AI systems to improve the clinical trial system as well"*, *"in the early stages, the AIs are going to be like grad students"*, *"AI is not God"* |
| 23.1.2025 | Davos, Panel „Technology in the World“ | *"a doubling of the human lifespan is not at all crazy … five to ten years"* (Gebiet #20, meiden) |
| 20.1.2026 | WEF „The Day After AGI“ (NnVW9epLlTM) | 00:10:12 *"help us cure cancer … eradicate tropical diseases"* |
| 13.2.2026 | Dwarkesh (n1E9IZfvGMA) | 00:49:08 „starting gun“ (in #4 benutzt); 00:54:24 „not infinitely fast“; 01:42:33 „pipeline will get jammed up“; 01:43:12 „superstructure … drugs that barely work“ |
| 19.2.2026 | India AI Impact Summit (Business Today, Izm_Xuo6oGQ) | 00:01:35 *"cure diseases that have been incurable for thousands of years"* |
| 6.5.2026 | Code with Claude | Dario & Daniela (Wortlaut Medizin unbekannt) |
| 6.7.2026 | STAT | 10× noch nicht erreicht (sekundär) |
| 15./16.8.2026 | X-Post | Selbstkritik; „cliché“; *"The thing that will work is actually curing cancer."*; Mehrheit der Krankheiten in 5–10 Jahren *"just barely possible if AI is applied to every stage of the pipeline"*. Quellen: Fox Business, Crypto Briefing (Axios), cybernews, businesstoday.in (17.8.) |
| 12.9.2026 | Essay „We Must Pace the Frontier“ | Bremsen (nicht Medizin) |
| 13.9.2026 | CBS Sunday Morning (rot) | Langinterview hQR_VJF6ukk (738k) |
| 27.10.2026 | Isaacson „The Builders“ (1OdoSzfUkec) | Dario & Daniela; Kapitel ohne Medizin-Schwerpunkt (Neuroscience 37:08) |
| 10.11.2026 | IPO-Roadshow | „relics of the past in, I think, less than a decade“, „age of miracles“ |

## 6. Medizin-Wirklichkeit (Stand Okt./Nov. 2026)

- **Kein von KI entdecktes Medikament zugelassen** (Stand Okt. 2026; #4, #15). Am 16.11. erneut prüfen.
- **Zasocitinib** (Takeda, TYK2, computergestütztes Design über Nimbus/Schrödinger): NDA mit Priority Review am 14.9.2026 angenommen, FDA-Entscheidung Q1 2027; Phase 3 mit 693 und 1.108 Patienten.
- **Rentosertib** (Insilico): Phase 3 seit Juli 2026 (erster Patient 9.9.2026), 320 Patienten, 47 Zentren in China, 52 Wochen. Projektion: Ergebnisse Dez. 2029, Zulassung ~Sept. 2030. In #4 als „final stage“ benutzt.
- **Isomorphic:** bis Mai 2026 noch kein Mensch dosiert, Ziel Ende 2026; Finanzierungsrunde 2,1 Mrd. $ am 12.5.2026. In #15 benutzt.
- **Gleevec:** Antrag 27.2.2001, Zulassung 10.5.2001 (~72 Tage).
- **Larotrectinib:** https://www.fda.gov/drugs/fda-approves-larotrectinib-solid-tumors-ntrk-gene-fusions (26.11.2018; 55 Patienten, 12 Krebsarten, ORR 75 %).
- **ACS Cancer Statistics 2026** (13.1.2026): −34 % Sterberate seit 1991, ~4,8 Mio. vermiedene Todesfälle, 626.140 erwartete Todesfälle 2026.
- **CTX310:** NEJM 8.11.2025 (15 Teilnehmer, höchste Dosis LDL −49/−50 %, TG −55 % an Tag 60); ESC 2026: 12 Monate LDL −52,5 % (unbestätigt).
- **Lilly kauft Verve:** Juni 2025, bis 1,3 Mrd. $; VERVE-102 gegen PCSK9.
- **FDA-Nachbeobachtung:** Guidance Jan. 2020 „up to 15 years“ für Genom-Editierung, Entwurf März 2022 „at least 15 years“.
  - https://endpts.com/genome-editing-products-fda-recommends-at-least-15-years-of-follow-up-after-clinical-trials/
  - https://bioprocessintl.com/regulations/15-year-follow-up-for-gene-editing-outlined-in-fda-draft-guide
- **Alzheimer:**
  - ~20 Jahre Vorlauf (Alzheimer's Association)
  - Leqembi −27 %, Kisunla −35 % Abbau
  - Lumipulse-Bluttest FDA 16.5.2025 (Symptome, ab 55)
  - TRAILBLAZER-ALZ 3: ~2.996 Teilnehmer ohne Symptome, Bluttest-Screening, Primärabschluss ~Okt. 2027
  - AHEAD 3-45 läuft
- **Psyche:**
  - Turner NEJM 2008: 38 von 74 Studien positiv (51 %), publiziert wirkten 94 % positiv. https://pubmed.ncbi.nlm.nih.gov/18199864/
  - COMP360 (Psilocybin): NDA komplett eingereicht 9.11.2026 (HCPLive), National Priority Voucher, Marktstart erwartet H1 2027
  - Cobenfy (Sept. 2024) nicht geprüft
- **Digitale Zwillinge:** EMA-Anerkennung PROCOVA am 20.9.2022; bis 35 % kleinere Kontrollgruppen (Firmenangabe).
  - https://www.clinicaltrialsarena.com/news/ema-qualifies-unlearn-approach/
  - https://www.unlearn.ai/resources/summary-of-the-ema-september-2022-qualification-opinion-for-procova-tm
  - Pilot der FDA für frühe Phasen; bisher Verkleinerung, kein Ersatz.
- **CNPV (FDA Commissioner's National Priority Voucher):** Ziel 1–2 Monate Prüfzeit; 7 Zulassungen bis 8.5.2026; Kritik an den Tempo-Angaben.
- **FDA „Elsa“:** KI-Werkzeug für Prüfer seit Juni 2025.
- **Entwicklungszeiten:** ~9,1 Jahre vom ersten Test am Menschen bis zur Zulassung (Studie mit 405 Medikamenten); Median 9,3 Jahre vom Studienstart bis zur US-Kostenübernahme, kaum verändert (JAMA Health Forum; AJMC 27.7.2026). Uhr-Idee daraus: Ein Mittel, das heute erstmals an Menschen geht, kommt im Schnitt ~2035/36 an.
- **Australien/Gebärmutterhalskrebs:** auf Kurs zur Elimination um 2035 (WHO-Schwelle <4/100.000). Reserve.

## 7. Gegenstimmen

- **Eric Topol** (Kardiologe, Scripps): *"I'm keen on AI having a transformational impact on human health. But these cure projections are wildly off-base and impossible."* Gary Marcus teilte das. Datum unklar (Aug. oder Nov.).
  - https://digg.com/tech/e1hcm8rs
  - https://aiweekly.co/alerts/cancer-scientists-push-back-on-ai-ceos-cure-timeline-pitch
- **Chris J. Maddison** (Informatiker): Glaubwürdigkeit leide, wenn man 5–10 Jahre für alle Krankheiten behauptet, weil man die meisten nicht einmal messen kann (sekundär, s. o.).
- **Dave Ricks** (Lilly-CEO), X um 11./12.11.:
  - Inhalt: unwahrscheinlich; die Karte der Biologie sei weitgehend leer; Fortschritt stetig und schrittweise. Nur über Übersetzungen und Zusammenfassungen (hyper.ai, cryptobriefing, tokenpost, econotimes).
  - März 2026: heutige Modelle „not particularly good“ in Biologie/Chemie (Fortune; Plain English c_h1k906pJ0).
  - Laut WSJ (technews.tw) halten Pharma-Chefs die Biologie für zu komplex.
- **Venki Ramakrishnan** (Nobel 2009), 9.11.2026: *"The experimental part [of drug discovery] is always going to be the bottleneck."* https://www.youtube.com/watch?v=-1q0zA21AkY
- **Karl Lauterbach:** sinngemäß „KI hilft gegen Krebs, Alzheimer, psychische Krankheit, aber in 10 Jahren unmöglich“; nur sekundär und X-ID → nicht verwenden.
- **Melinda B. Chu, MD:** Hype für den Börsengang.
- **Rami Elghandour:** *"I've taken two companies public. These are insane things to say in an IPO pitch."*
- **Gary Marcus:** „ludicrous, Elizabeth Holmes-like“ (polemisch).
- **Fidji Simo** (ChronicleBio, 3.8.2026): *"We are missing the internet of biology"*; *"if AI accomplishes everything but doesn't cure disease, that would be a very sad state of affairs"*. https://www.webull.com/news/15423172831953920
- **Ruxandra Teslo:** Dario vermenge Erfolgsquote und Tempo von Studien.
- **Asimov Press:** Rekrutierung wird durch KI nicht automatisch schneller.
- **The Information:** Krebsforscher widersprechen.
- **ETC Journal** (Shimabukuro, 22.6.2026): Resistenzen, Infrastruktur, Zugang als harte Grenzen. https://www.etcjournal.com/2026/06/22/are-amodeis-medical-predictions-on-track-for-2028-2033/
- **Sam Rodriques** (Edison Scientific): „Curing Every Disease With AI by 2050“, https://www.youtube.com/watch?v=Q7NpRG2gAxc (CoreWeave, 27.5.2026)
- **Shyam Sankar** (Palantir, CBS Face the Nation, Okt. 2026): Anekdote, KI-Forscher rauchen, weil KI Krebs heilen werde. Unbelegt; Avi-Schiffmann-Zitat bei BI. Nicht verwenden.

## 8. Treffer-Check: Methode

- **Werkzeug:** eigene Suche über youtube.com/results (ytInitialData) mit zwei Sortierungen pro Suchwort, „recent“ (nach Datum) und „month_views“ (dieser Monat nach Aufrufen). Danach YouTube-API `videos` und `channels` für Datum, Aufrufe, Dauer und Abos (je 50 IDs pro Call).
- **Suchwörter:**
  - Dario Amodei cure cancer; Dario Amodei Alzheimer's; Anthropic IPO; Anthropic IPO roadshow Dario
  - AI cure all diseases; AI will cure cancer; AI cure disease 10 years; Machines of Loving Grace
  - AI drug discovery; AI cure Alzheimer's; AI cure mental illness; Dario Amodei; end of disease AI; AI cures cancer
  - relics of the past cancer Alzheimer; age of miracles Anthropic; Dario Amodei cancer Alzheimer decade; Anthropic cure cancer; AI end of disease decade; Dario Amodei mental illness
- **Umfang:** 404 verschiedene Videos, davon 266 seit 13.9.2026 und 228 thematisch relevant → `treffer-check.json` (Felder wie bisher: q, mode, t, ch, cid, d, v, dur, s, x = Aufrufe/Abos; dazu „winkel“ bei 50 Videos).
- Auswertung: `runde1-leitgedanken.md` §3.

## 9. Clip-Kandidaten (IDs)

| Kanal | Ampel | Videos |
|---|---|---|
| Roadshow | grün/gelb | ipo.anthropic.com; Re-Upload eynv5VR9qos |
| Dwarkesh | gelb | n1E9IZfvGMA |
| WEF | gelb | NnVW9epLlTM (Livestream-Fassung mmKAnHz36v0; DRM-Kopie 02YLwsCKUww meiden) |
| Lex | gelb | ugvHCXCOmm4 |
| Ryan Peterman / Ramakrishnan | gelb | -1q0zA21AkY |
| NVIDIA & Lilly (Huang + Ricks) | grün | zbiEYMapsvw |
| Plain English (Ricks) | gelb | c_h1k906pJ0 |
| Anthropic | grün | DdCEmlAydcw (Labor), Yiy0cU6ChSw (Lilly-Fireside), sHImlfVM9r4, om2lIWXLLN4 (Building Anthropic, 2024), P1zBiAQU1IA (physische Experimente, 27.8.2026) |
| Claude | grün | 7xco5Qd2Oo8 (Dario & Daniela, 6.5.2026), FMbXUxn_nBw (Kapsid) |
| Isaacson | gelb | 1OdoSzfUkec |
| Rodriques / CoreWeave | gelb | Q7NpRG2gAxc |
| Business Today, India-Gipfel | rot/gelb | Izm_Xuo6oGQ |

**Rot (nur Zitatkarte):**
- CBS hQR_VJF6ukk, h0x7KpG4Lf0
- CNN _JbDZ2Rj2SA
- CNBC NBzrvDLtlxY, qenvwmedg7k, FK3h-3J8Nl4
- Bloomberg TV 3hJscphUBAI, sMO9WTDYgDw, 4wCfWRrD3C0
- Fox Business 5RY6l5WHDAY
- Yahoo-Finance-Short z271lh2ZxeU

## 10. Offene Punkte

1. Roadshow-Original beschaffen und per Whisper prüfen: Wortlaut, Zeitmarke, „age/era“, Reihenfolge, **Musikbett** (bei Musik ist der Clip rot).
2. Topol-Datum und -Wortlaut, Ricks-Wortlaut, Darios X-Post (August) am Original.
3. Am 16.11. vormittags prüfen: IPO-Stand (Preis, Datum), „kein KI-Medikament zugelassen“, COMP360-Status.
4. Ramakrishnan- und Lex-Stelle per Whisper.
5. Zahlen am Original: TRAILBLAZER-ALZ 3, CTX310 (NEJM), Alzheimer's Association „20 years“, CNPV-Stand.
