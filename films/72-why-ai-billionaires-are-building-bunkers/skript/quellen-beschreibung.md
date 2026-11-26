# #72 · Quellen für die YouTube-Beschreibung (Stand 25.11.2026)

Grundlage ist `faktencheck.md`, dort steht jede Quelle mit Datum und Befund. Den Block unten wörtlich in die Beschreibung kopieren: nach Hook, Kaffee-Zeile, Sponsor-Zeile und Kurs-Zeile (REGELN §12, Stand 25.11.: Sponsor-Zeile als Absatz 3 direkt unter der Kaffee-Zeile, keine Sponsor-Schlusszeile mehr). Wird die Beschreibung zu lang, zuerst Beschriftungen kürzen, nie Links (REGELN §12). Reihenfolge wie im Film, eine Zeile je Aussage. Die drei Zeilen „ORIGINAL FOOTAGE“ gehören zu den Clips C1, C2 und C3 laut `clips.json`; `clips-geprueft.json` lag noch nicht vor. Fällt ein Clip weg oder ändert sich die Quelle, die Zeile anpassen.

Bewusst nicht im Block:
- **Singju-Post-Transkripte (Harris, „Write laws“, „right now the AI company leaders …“).** Inoffiziell; die Folge selbst steht als ORIGINAL FOOTAGE drin. Stammt „Write laws“ am Ende aus einem anderen Gespräch, dessen Video als eigene Zeile ergänzen.
- **Moneywise und Yahoo Finance.** Sie dienten nur als Zugang zum gesperrten WaPo-Text; verlinkt wird die WaPo selbst.
- **Karen Haos Buch direkt, Wired 2023, Bloomberg, WSJ.** Gesperrt oder Paywall; die Zeilen zeigen auf Berichte darüber (Fortune, Business Insider).
- **UN (acht Milliarden) und der Prüfbericht des Bundes zu den Schutzplätzen.** Allgemeinwissen bzw. nur für den Faktencheck; für die Schweiz reicht die BABS-Seite.
- **Raw Story, Inc42, CXOToday, Roll Call, National Review, KJZZ, Latitude Media.** Zweitquellen für den Faktencheck; Axios, congress.gov und Microsoft sind die Primärquellen.

```
SOURCES

The bunker before AGI
• Karen Hao's book, via Fortune, 2025: https://fortune.com/2025/05/20/chatgpt-openai-ilya-sutskever-chief-scientist-planneddoomsday-bunker-agi/

The bomb
• Zuckerberg, Fortune, Dec 2024: https://fortune.com/2024/12/27/mark-zuckerberg-hawaii-underground-doomsday-bunker/
• Altman on Theo Von, Fortune, Jul 2025: https://fortune.com/2025/07/24/sam-altman-theo-von-podcast-ai-fears-humanity/
• Newsweek, Oct 2026: https://www.newsweek.com/ai-war-and-civil-unrest-why-the-rich-are-getting-their-bunkers-ready-12518873

The machine
• International AI Safety Report 2026: https://internationalaisafetyreport.org/sites/default/files/2026-02/international-ai-safety-report-2026.pdf
• Altman, Business Insider, 2023: https://finance.yahoo.com/news/ultra-rich-obsessed-doomsday-bunkers-052026694.html
• Wendy Hall, BBC, Oct 2025: https://www.aol.com/articles/tech-billionaires-seem-doom-prepping-230256740.html

The chaos
• Atlas shelters: https://atlassurvivalshelters.com/shelter-features/
• Axios, "day after", Oct 2026: https://www.axios.com/2026/10/09/ai-companies-day-after-major-attack
• Axios, FAA, Nov 2026: https://www.axios.com/2026/11/16/faa-flights-ground-stop-router-cause-reasons

Us
• Rushkoff, Survival of the Richest, 2018: https://archive.rushkoff.com/articles/1094-survival-of-the-richest.html
• Washington Post, Oct 2026: https://www.washingtonpost.com/style/2026/10/09/spas-rock-walls-other-must-have-amenities-your-doomsday-bunker/
• Gallup, May 2026: https://news.gallup.com/file/poll/709808/260513_AIDataCenters.pdf

The door
• Swiss civil protection: https://www.babs.admin.ch/en/shelters-for-the-population
• swissinfo: https://www.swissinfo.ch/eng/demographics/switzerland-trying-to-keep-nuclear-shelters-up-and-running-with-some-being-turned-into-wine-cellars-or-party-rooms/91560820
• Helsinki, finland.fi: https://finland.fi/life-society/helsinki-underground-where-the-city-plays-swims-and-shelters/
• Senate bill S. 5518, 2026: https://www.congress.gov/bill/119th-congress/senate-bill/5518
• Microsoft, Jan 2026: https://blogs.microsoft.com/on-the-issues/2026/01/13/community-first-ai-infrastructure/

ORIGINAL FOOTAGE: Sam Altman, This Past Weekend w/ Theo Von, Jul 23, 2025: https://youtu.be/aYn8VKW6vXA
ORIGINAL FOOTAGE: Tristan Harris, Modern Wisdom, Apr 2, 2026: https://youtu.be/NufB1LL_rCU
ORIGINAL FOOTAGE: Douglas Rushkoff, The Great Simplification, Sep 15, 2022: https://youtu.be/q7grRir4KPQ
```

**Länge des Blocks:** 2.454 Zeichen (Ziel ≤ 2.500), 21 Links. Kaffee-, Sponsor-, Kurs- und Fehler-Zeile kommen dazu; zusammen bleibt die Beschreibung bei Hook, Kapiteln und Hashtags unter ~4.850 Zeichen, wenn der Rest knapp bleibt. `python3 tools/check_descriptions.py` vor dem Release laufen lassen.

**Die Clip-Zeilen** folgen dem Muster „ORIGINAL FOOTAGE: <speaker>, <channel>, <date>“, das Datum ist das Upload-Datum des Quellvideos. Der Link dahinter ist eine Zugabe; wird es eng, darf er weg.

**Hinweise zu einzelnen Zeilen:**
- „Altman, Business Insider, 2023“ zeigt auf die Yahoo-Kopie des Business-Insider-Texts (kürzere Adresse, gleicher Inhalt). Die indische Ausgabe wäre `https://www.businessinsider.in/tech/news/the-ultra-rich-are-obsessed-with-their-doomsday-bunkers-but-sam-altman-joked-they-wont-really-matter-if-theres-an-ai-apocalypse/articleshow/104574211.cms`.
- „Wendy Hall, BBC“ zeigt auf den AOL-Nachdruck des BBC-Texts (Oktober 2025); das BBC-Original war nicht erreichbar. Wenn die BBC-Adresse am iMac auffindbar ist, die BBC-Adresse nehmen.
- „Senate bill S. 5518“: Stand am Release-Tag prüfen (faktencheck.md, Abschnitt 7).

**Nur bei Platz ergänzen** (Länge der Zeile in Klammern):
- `• Moneywise, anti-mutiny, Oct 2026: https://moneywise.com/news/top-stories/luxury-doomsday-bunkers-ultra-rich-amenities` (119), als zweiter Zugang zum WaPo-Text, falls Zuschauer die Paywall melden.
- `• Roll Call, S. 5518, Sep 2026: https://rollcall.com/2026/09/25/tech-taxes-would-drive-kellys-labor-focused-ai-horizon-fund/` (124), für die 75 % und 26 Wochen in Klartext.
