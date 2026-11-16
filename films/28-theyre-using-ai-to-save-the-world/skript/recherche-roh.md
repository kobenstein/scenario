# Recherche roh · „They're Using AI to Save the World"

Stand 10.11.2026. Rohnotizen und Quellen zu `faktenzettel.md` und `clips.json`. Nicht für den Texter (REGELN §10), nur zum Nachprüfen.

## Methode und Sperren

- **Gesperrt:** WebFetch scheitert mit ENOTFOUND, z. B. bei www.jpl.nasa.gov, phys.org und pmc.ncbi.nlm.nih.gov. curl über den Proxy gibt bei fast allen Primärseiten 403 CONNECT zurück, darunter science.org, nature.com, pnas.org, unep.org, usgs.gov, ucdavis.edu und die Firmenseiten. Erreichbar ist nur youtube.com, und dort nur die Suchliste.
- **Deshalb:** Alle Zahlen stammen aus WebSearch-Auszügen. Diese geben meist die Primärquelle mit Link wieder. Wo nur eine Sekundärquelle vorlag, steht das dabei. Damit WebFetch geht, müssen die Hosts in den Netzwerk-Einstellungen der Umgebung freigegeben werden.
- **YouTube:** `yt-dlp "ytsearchN:…" --flat-playlist` liefert ID, Titel, Kanal, Länge, Aufrufe und den Anfang der Beschreibung. Upload-Datum fehlt. Watch-Seiten und Untertitel scheitern mit „Sign in to confirm you're not a bot“ (Umleitung auf google.com/sorry, 403). youtube-transcript-api scheitert genauso. Andere Player-Clients wurden nicht genutzt, weil das eine Umgehung der Bot-Prüfung wäre. vidIQ hat 0 Credits (neu am 19.11.2026).
- **Ampel im Faktenzettel:** 🟢 = Studie oder amtliche Quelle, mehrfach belegt · 🟡 = Angabe der Organisation oder Firma, nur eine Quelle oder nur Suchauszug · 🔴 = nicht belegt.

## Hook · Erdbebenwellen

- P-Welle ~6 km/s, S-Welle ~3,5–4 km/s in der Erdkruste. Die S-Welle (und die Oberflächenwellen) bringen das starke Wackeln. Quellen: IRIS https://iris.edu/hq/inclass/downloads/optional/363 · USGS Fact Sheet 2014-3083 https://pubs.usgs.gov/fs/2014/3083/pdf/fs2014-3083.pdf
- Warnzeit: bis ~15 s nah am Zentrum, bis ~1 Min weiter weg (Google 2025). Nepal 2023: 10–60 s. Venezuela 2026: bis 2 Min. Direkt am Zentrum gibt es keine Warnung (Blindzone).
- „Take Action“-Alarm: laut, Vollbild, überschreibt „Nicht stören“. „Be Aware“: leiser Hinweis. https://blog.google/products/android/earthquake-detection-and-alerts

## 12 · Te Hiku Media

- März 2018, Aktion „Kōrero Māori“: >2.500 Menschen, 10 Tage, >200.000 Sätze, >300 h Sprache. https://blogs.nvidia.com/blog/te-hiku-media-maori-speech-ai/ · NeurIPS-Keynote 2020 https://neurips.cc/virtual/2020/20652
- 92 % Genauigkeit, 82 % bei gemischtem Māori/Englisch: Eigenangabe (u. a. Panopto-Partnerschaft). https://www.panopto.com/news/partners-with-te-hiku-media-te-reo-maori-captioning-aotearoa/
- MIT TR nennt „erstes Modell 86 %“: nicht gegengeprüft.
- Lionbridge 2018: Anfrage an Māori-Sprecher, ~45 $/h fürs Vorlesen; Te Hiku lehnte ab. Te Hiku sagt, Google habe dahintergestanden (Eigenangabe). https://blog.papareo.nz/whisper-is-another-case-study-in-colonisation/ · https://thespinoff.co.nz/atea/29-07-2022/indigenous-data-sovereignty-will-make-the-internet-a-better-place-for-maori · https://www.technologyreview.com/2022/04/22/1050394/artificial-intelligence-for-the-people/
- Kaitiakitanga-Lizenz: Nutzen muss an Māori zurückgehen.
- Zitate:
  - Jones: „We know what it means losing sovereignty. Data is the new land.“ https://www.itu.int/hub/2022/08/ai-indigenous-languages-maori-te-reo/
  - Jones (andere Fassung): „Data is land.“ / „We don't want our sovereign languages sold back to our grandchildren as data as a service.“ https://radioinfo.asia/?p=70638
  - Mahelona: „And now they want to sell our language back to us as a service.“ (The Spinoff 2022)
  - MIT TR-Variante, Wortlaut je nach Quelle verschieden: Daten genutzt von „the very people that beat that language out of our mouths“.
- TIME100 AI, 5.9.2024: https://time.com/7012841/peter-lucas-jones/ · Weitere: https://thefuturescentre.org/?p=8055 · https://techwontsave.us/episode/177_big_tech_wont_revitalize_indigenous_languages_w_keoni_mahelona

## 11 · Apate.ai

- **„Oma“: keine Quelle.** Die Bots haben „various ages, gender and personalities“ und mehrere Sprachen. Am Anfang waren es ~100 Persönlichkeiten. Heute nennen Quellen >200.000, andere ~350.000. Die KI-Oma „Daisy“ (O2, UK) ist aus eigenem Wissen und nicht gesucht. „Granny Edna“ gehört zum Streamer Kitboga (Wikipedia).
- Kaafar hielt beim Familienpicknick einen Betrüger 44 Min hin. Bot-Gespräche dauern oft 20–27 Min, bis 50 Min (Marketplace 14.1.2025). Rekord über 2 h (Forbes AU).
- 17 Jahre Betrügerzeit, 2,5 Mio. Gespräche (Okt. 2026, Firma). Das sind nur ~3,6 Min pro Gespräch im Schnitt.
- TPG: >280.000 umgeleitete Anrufe (GSMA-Fallstudie, älter), neuer fast 590.000. CommBank-Pilot seit Nov. 2024.
- Eine Bank (ohne Namen) setzte Bots aktiv gegen 22 Kampagnen ein. Dass die CommBank 76 % weniger Betrugsschaden hat, ist nicht nachweislich mit Apate verknüpft. Seed-Runde 8,15 Mio. US$ (9/2026).
- URLs:
  - https://lighthouse.mq.edu.au/article/november-2024/ai-chatbots-outsmart-scammers-world-first-pilot-with-australias-largest-bank
  - https://www.forbes.com.au/covers/magazine/how-a-sydney-professor-built-an-ai-army-to-scam-the-scammers/
  - https://www.marketplace.org/episode/2025/01/14/how-ai-chatbots-are-turning-the-tables-on-scammers
  - https://techcrunch.com/2026/10/14/apate-sends-ai-agents-undercover-to-get-scammed-so-they-can-gather-fraud-intelligence/
  - https://www.gsma.com/solutions-and-impact/technologies/security/scams/gsma_study/apate-ai-powered-scam-detection-diversion-and-real-time-threat-intelligence/
  - https://www.ntd.com/ai-startups-bots-waste-17-years-of-scammers-time-as-tech-company-expands-into-us_1180303.html
  - https://fintech.global/2026/09/01/apate-ai-raises-8-15m-to-fight-fraud-with-ai-agents/
  - https://www.aea.gov.au/news/disrupting-scammers-army-ai-bots

## 10 · IdentiFlight

- Top of the World (Wyoming): −82 % tote Adler gegenüber dem Vergleichspark Campbell Hill (J. Appl. Ecol. 2021). wildlife.org nennt zusätzlich −60 % gegenüber vorher im selben Park. USGS-Nachanalyse 2022: −85 %, 95-%-Bereich 12–100 %.
- Erkennung im Median in 0,4 s (McClure et al. 2018). Reichweite ~1 km ist Herstellerangabe.
- Kalifornien (PLOS ONE 2022): 77 % der Adler erkannt. 5.439 Stopps wegen anderer Vögel gegenüber 850 wegen Adlern (≈ 6-mal).
- Sekundär, ungeprüft: 47 Türme, „82 % came back at 50“ (autonocion.com).
- URLs:
  - https://www.usgs.gov/centers/forest-and-rangeland-ecosystem-science-center/news/confirmation-eagle-fatalities-can-be
  - https://pubs.usgs.gov/publication/70236273
  - https://www.britishecologicalsociety.org/research-shows-identiflight-camera-technology-greatly-reduces-wind-turbine-eagle-fatalities/
  - https://journals.plos.org/plosone/article?id=10.1371%2Fjournal.pone.0278754
  - https://wildlife.org/detection-device-reduces-eagle-deaths-at-wind-farm/
  - https://tethys.pnnl.gov/sites/default/files/publications/McClure-et-al-2018.pdf

## 9 · Nazca

- Sakai et al., PNAS 23.9.2024: 303 neue Figuren, Feldarbeit 9/2022–2/2023, vorher 430 bekannt.
  - KI: 47.410 Vorschläge, davon 1.309 von Fachleuten ausgewählt. 178 Treffer direkt, 66 daneben, 59 ohne KI.
  - Ø 9 m lang, im Schnitt 43 m von Fußwegen. Die großen Linienfiguren deuten die Autoren als Orte für Gemeinschaftsrituale.
  - 968 Kandidaten noch nicht begangen, ≥ 248 weitere geschätzt. 341 Orte genehmigt, „20-mal schneller“. Geprüft zu Fuß oder per Drohne.
- 28.7.2025: 248 weitere Figuren (Andina). 10.11.2025: über 500 KI-gestützte Funde, ~600 Kandidaten offen. Gesamtzahl 893: laut Andina figürliche Geoglyphen, laut Art Newspaper „insgesamt“. 781 davon dank KI gefunden.
- URLs:
  - https://www.pnas.org/doi/10.1073/pnas.2407652121 · https://pmc.ncbi.nlm.nih.gov/articles/PMC11459208
  - https://www.yamagata-u.ac.jp/en/information/info/20240924/
  - https://popular-archaeology.com/article/ai-helps-uncover-hidden-trove-of-nazca-geoglyphs/
  - https://www.newsweek.com/hundreds-mysterious-ancient-nazca-land-artworks-found-artificial-intelligence-1957989
  - https://www.science.org/content/article/ai-identifies-hundreds-mysterious-nazca-drawings-peruvian-desert
  - https://www.cnn.com/2024/09/27/science/ai-nazca-geoglyphs-peru
  - https://andina.pe/ingles/noticia-japanese-researchers-unveil-248-new-peruvian-nasca-lines-geoglyphs-1039705.aspx
  - https://andina.pe/ingles/noticia-perus-nasca-lines-geoglyphs-discovered-with-ai-exceed-500-1051420.aspx
  - https://www.theartnewspaper.com/2025/08/14/248-nazca-lines-discovered-artificial-intelligence-peru

## 8 · UNEP MARS

- Hassi Messaoud (Algerien): Gasentsorgungsanlage an einer Ölquelle. Emissionen in „every high-quality satellite pass from 1999 to 2024“ (OGMP/Eye on Methane 2024). Sonatrach schloss Ende 2024 ein Ventil (Data Desk). UNEP-Liste datiert den Fall auf 10/2024. IMEO: Leck binnen weniger Monate beendet, entspricht 500.000 Autos ein Jahr lang. Mindestens 5 weitere algerische Quellen sind seitdem aus (Data Desk, Global Methane Hub).
- Achtung: Das Leck „seit mindestens 1984“ (Studie 2022) liegt in Hassi R'Mel, nicht in Hassi Messaoud.
- MARS-S2L: ML auf Sentinel-2 und Landsat (SWIR-Bänder), täglich, >3.800 Standorte. arXiv 2408.04745, arXiv 2511.21777, https://github.com/UNEP-IMEO-MARS/marss2l
- Warnungen: >3.500 an 33 Länder. Antwortquote 2024 1 %, 2025 ~12 % (UNEP, IEA). Die MARS-Tabelle zeigt 14 % (1.234 Meldungen, 172 Antworten). 2.203 Meldungen im Jahr 2025 (Eye on Global Transparency). „>40 Quellen gestoppt“ nur sekundär (Wikipedia).
- Methan: über 20 Jahre >80-mal stärker als CO₂ (UNEP).
- URLs:
  - https://www.unep.org/en/news-and-stories/technical-highlight/satellite-alerts-spur-methane-cuts-room-progress-remains
  - https://www.iea.org/reports/responding-to-satellite-notifications-from-the-methane-alert-and-response-system
  - https://wedocs.unep.org/rest/api/core/bitstreams/4c93b28c-80d0-4fc1-a10a-2f214f1d4729/content (Eye on Methane 2025, 22.10.2025)
  - https://www.ogmpartnership.org/sites/default/files/resources/2025-04/eye_on_methane_2024_invisible_but_not_unseen.pdf
  - https://www.unep.org/en/news-and-stories/story/technology-helping-reduce-methane-emissions-more-action-needed
  - https://www.unep.org/topics/energy/methane/mars-mitigation-action
  - https://blog.datadesk.eco/p/algeria-methane
  - https://eyeonglobaltransparency.net/2026/04/23/unep-describes-methane-mitigation-successes-transparency-issues-remain/
  - https://www.unep.org/en/explore-topics/energy/facts-about-methane

## 7 · Casey Harrell

- NEJM, Card et al., 15.8.2024 (391:609–618): Am ersten Tag nach 30 Min 99,6 % (50 Wörter). Danach 97,5 % über 8,4 Monate, ~32 Wörter pro Minute, 248 h Nutzung. Ein Wortschatz von „125.000“ ist nicht gegengeprüft. Eine Quelle nennt 56 Wörter pro Minute, nicht verwenden.
- Stimme nach alten Videos von ihm (KTVU). Laut Stavisky weinte Harrell beim ersten Versuch vor Freude (UC Davis).
- Nature, 12.6.2025 (644:145–152): Stimme in Echtzeit (~10–25 ms), mit Betonung, Fragen und kleinen Melodien.
- Nature Medicine, 15.6.2026 (doi 10.1038/s41591-026-04414-6): >3.800 h zu Hause in fast 2 Jahren, fast 2 Mio. Wörter, >183.000 Sätze. Im Alltag 92 % der Sätze richtig (seine Bewertung), im Test >99 % der Wörter. Laut NewsBytes arbeitet er wieder Vollzeit (sekundär).
- Zitate: Harrell, „It is like you are trapped.“ (UC Davis 8/2024) · Stavisky, „first power user of a speech BCI“ (MIT TR 15.6.2026).
- URLs:
  - https://escholarship.org/uc/item/9gw4j91v (NEJM, PubMed 39141853)
  - https://health.ucdavis.edu/news/headlines/new-brain-computer-interface-allows-man-with-als-to-speak-again/2024/08
  - https://www.nature.com/articles/s41586-025-09127-3
  - https://health.ucdavis.edu/news/headlines/brain-computer-interface-enables-independent-accurate-communication-for-man-living-with-als/2026/06
  - https://www.technologyreview.com/2026/06/15/1138953/man-als-first-power-user-brain-implant-speak-bci/
  - https://thenextweb.com/news/uc-davis-brain-computer-interface-als-speech-casey-harrell-3800-hours
  - https://www.fiercebiotech.com/medtech/using-ai-and-brain-implants-researchers-reconnect-als-patient-their-lost-voice

## 6 · Global Fishing Watch

- Paolo et al., Nature 3.1.2024 (625:85–91): 72–76 % der Industrie-Fischerboote öffentlich nicht verfolgbar (rund 75 %), bei Transport- und Energieschiffen ~25 %. Sentinel-1-Radar 2017–2021, ~2 Mio. GB. Boote unter ~20 m sind kaum erfasst.
- AIS-Pflicht hat Lücken. Beispiel USA: Fischerboote brauchen AIS nur innerhalb von 12 Seemeilen. „Dunkel“ heißt nicht illegal.
- McDonald et al., PNAS 12/2020: ~16.000 Schiffe, 2012–2018. 14–26 % mit hohem Risiko für Zwangsarbeit, an Bord 57.000–100.000 Menschen. Kritik von Swartz et al., PNAS 2021: Von 193 bekannten Fällen nutzten 58 AIS, nur 21 waren brauchbar.
- URLs:
  - https://www.nature.com/articles/s41586-023-06825-8
  - https://www.esa.int/Applications/Observing_the_Earth/Copernicus/Sentinel-1/Sentinel-1_and_AI_reveal_75_of_fishing_vessels_not_tracked
  - https://phys.org/news/2024-01-harnesses-ai-satellite-imagery-reveal.html
  - https://techcrunch.com/2024/01/03/satellite-imagery-analysis-shows-immense-scale-of-dark-fishing-industry/
  - https://www.pnas.org/doi/10.1073/pnas.2016238117 · https://www.pnas.org/doi/10.1073/pnas.2100341118
  - https://emlab.ucsb.edu/projects/shining-light-forced-labor-sea
  - https://globalfishingwatch.org/press-release/forced_labor_risk_fishing/
  - https://news.ucsc.edu/2024/03/untracked-fishing-increased-risks/

## 5 · NASA JPL GUARDIAN

- **Urteil KI: ja.** „GUARDIAN Scout“ ist ein neuronales Netz (CNN), trainiert auf künstlichen Signaturen. Es läuft ab M ≥ 6,5. Die Ausgaben sind Forschung, keine Warnungen (guardian.jpl.nasa.gov/about.html). JPL: „deployed a critical component just the day before“. Yahoo/Travel Noire: KI-Modell plus Prototyp der Warnmeldungen. Hinweise an angemeldete Fachleute ~20 Min nach dem Beben.
- NASA SVS 5625: G027 und QSPP 8 Min nach dem Beben (13:32 HST). KOKB (Kauai) um 18:50 HST, 32 Min vor dem ersten Pegel (19:22 HST). Eine Fassung nennt M8,5, sonst M8,8.
- Natural Hazards 122(9), 5/2026: „GNSS-based automated detection of the 2025 Kamchatka tsunami 30 minutes before landfall using GUARDIAN“ (Martire, Komjathy u. a.; KI-Erweiterung Scout). Zweites Paper (s11069-026-08178-7): TCN auf japanischen Stationen, 71 Min.
- Zeitangaben widersprechen sich: JPL „up to 45 minutes prior to tide gauges“, andere „30–40 min before landfall“. Im Film nur eine Zählung verwenden (SVS: 32 Min).
- Namen: JPL und eine zweite Quelle: „Camille Martire“ („functioned to its full extent“). Nur WebProNews: „Léo Martire“.
- NOAA, Christopher Moore: „NASA's GUARDIAN can help fill the gaps.“ NASA und NOAA arbeiten an der Einbindung (phys.org 3/2026).
- Mechanik: verdrängte Luft, Schall- und Schwerewellen steigen auf und stören die Ionosphäre (Spitze ~300 km, PIA14430).
- URLs:
  - https://www.jpl.nasa.gov/news/nasas-guardian-tsunami-detection-tech-catches-wave-in-real-time/
  - https://svs.gsfc.nasa.gov/5625/
  - https://www.nasa.gov/science-research/earth-science/see-nasas-guardian-catch-a-tsunami/
  - https://link.springer.com/article/10.1007/s11069-026-08151-4 · https://link.springer.com/article/10.1007/s11069-026-08178-7
  - https://www.yahoo.com/news/articles/nasa-guardian-system-detects-tsunami-161441451.html
  - https://phys.org/news/2026-03-nasa-experimental-technology-tsunami.html
  - https://www.jpl.nasa.gov/news/nasa-researchers-detect-tsunamis-by-their-rumble-in-the-atmosphere/
  - https://www.jpl.nasa.gov/images/pia14430-nasa-sees-tohoku-oki-earthquake-and-tsunami-in-earths-upper-atmosphere/
  - https://www.earthdata.nasa.gov/learn/webinars-and-tutorials/webinar-guardian-cddis-04-Oct-2023
- **Reserve Kenia (🟡, WWF-Angaben):** WWF, Teledyne FLIR und KWS seit 2016. KI erkennt nachts Menschen und Fahrzeuge und meldet sie der Leitstelle, in 11 Nashorn-Gebieten. Ol Pejeta zuerst (2019). Solio 2023, eine Übergabefeier ist auf den 31.7.2024 datiert (Widerspruch). WWF-Rückblick 2025: seit Einbau keine Wilderei in Ol Pejeta und Solio.
  - https://www.worldwildlife.org/news/stories/how-thermal-cameras-and-ai-are-powering-rhino-conservation-success-in-kenya/
  - https://wwf-kenya.medium.com/solio-game-reserve-ai-enabled-flir-thermal-cameras-boost-war-against-poaching-a9223070fafc
  - https://citizen.digital/article/kws-rhino-sites-using-ai-enabled-cameras-to-stop-black-rhino-poaching-n349961
  - https://www.worldwildlife.org/news/stories/conservation-highlights-of-2025/

## 4 · Tamil Nadu (Madukkarai)

- 12 Türme mit Wärme- und Normalkameras an ~7 km Gleis (A- und B-Strecke, Solakarai). In Betrieb seit Nov. 2023, eingeweiht Feb. 2024 (Minister Mathivanan). Seitdem kein Elefant vom Zug getötet, vorher 11 seit 2008 (Regierung).
- DT Next: 9.481 sichere Querungen. Juli 2026: >7.100 Warnungen, >3.280-mal gebremst (newkerala). Indian Masterminds nennt 3.821.
- Deccan Herald: ~6.000 Querungen in 2 Jahren auf 13 km Pothanur–Palakkad (andere Zählung).
- Kerala (Walayar) plant KI-Warnungen und Unterführungen (Onmanorama, 3.11.2026).
- Brücke zu #3: Schlangen töten in Indien ~58.000 Menschen im Jahr (eLife 2020, Schätzung 2000–2019). Elefanten töten 606–629 im Jahr 2023/24 und 2.869 in fünf Jahren 2019–2023 (Regierung via newsdrum).
- URLs:
  - https://kygcms.tn.gov.in/cms_migrated/document/press_release/pr090224_e_258.pdf
  - https://www.dtnext.in/news/tamilnadu/ai-powered-elephant-alert-system-enables-9481-safe-crossings-records-zero-train-track-deaths
  - https://www.dtnext.in/news/tamilnadu/ai-based-alerts-aided-around-7k-safe-jumbo-crossings-in-coimbatore
  - https://www.downtoearth.org.in/wildlife-biodiversity/ai-enabled-system-successful-in-preventing-elephant-train-collisions-on-kerala-tamil-nadu-border
  - https://www.newkerala.com/news/a/ai-surveillance-helps-prevent-elephant-deaths-coimbatore-railway-472.htm
  - https://www.onmanorama.com/news/kerala/2026/11/03/ai-alerts-underpasses-planned-to-make-walayar-tracks-safer-for-elephants.html
  - https://elifesciences.org/articles/54076
  - https://www.newsdrum.in/national/over-2800-killed-in-elephant-attacks-in-india-from-2019-to-2023-govt-9535579

## 3 · Baker-Labor (Gegengift)

- Vázquez Torres et al., Nature, online 15.1.2025 (639:225–231): Proteine mit generativer KI entworfen (RFdiffusion). Mäuse überlebten sonst tödliche Dosen einzelner Giftstoffe (u. a. von Kobras) zu 80–100 %. Kein ganzes Gift, keine Menschenstudie. „low-cost microbial fermentation“ ist ein Ziel der Autoren.
- WHO: 5,4 Mio. Bisse im Jahr, 1,8–2,7 Mio. Vergiftungen, 81.000–138.000 Tote. ~400.000 bleibende Schäden (WHO EMRO).
- Dass heutige Gegengifte aus Pferdeplasma kommen, ist eigenes Wissen und nicht gesucht. Es gilt als Standard (auch Schafe).
- Zitate: Vázquez Torres, „coolest experimental result …“ (Nature News). Die Zuordnung von „first major leap forward in antivenom development in decades“ (UW, Baker?) und „cheap to produce and robust“ ist unsicher, nicht verwenden.
- RAISE (EU, ab 6/2026, Nanobodys) ist ein anderes Projekt, nicht Baker.
- URLs:
  - https://www.nature.com/articles/s41586-024-08393-x
  - https://www.bakerlab.org/2025/01/15/neutralizing-deadly-snake-toxins/
  - https://www.dtu.dk/english/newsarchive/2025/01/ai-designed-proteins-neutralise-snake-toxins
  - https://www.eurekalert.org/news-releases/1070246
  - https://www.sciencenews.org/article/ai-snake-antivenom-venom
  - https://www.who.int/news-room/fact-sheets/detail/snakebite-envenoming
  - https://cordis.europa.eu/project/id/101289964

## 2 · DebunkBot

- Costello, Pennycook, Rand, Science 13.9.2024: 2.190 Teilnehmende, GPT-4 Turbo, ~8 Min Chat. Glaube im Schnitt −20 %, nach 2 Monaten stabil. Etwa jeder Vierte lag danach unter 50/100. Damals MIT, Cornell, American University.
- 11.6.2026 Expression of Concern: Fehler im Datensatz, von den Autoren selbst gefunden. Kommentar Nyhan bei Retraction Watch. Newcomb-Cleveland-Preis 2/2026.
- Erratum 22.10.2026 (Science 394(6822)): Effekt hält. Studie 2: −12,84 statt −12,30 Punkte, N 1.346 statt 1.515. Eine Nebenaussage fällt. Daten bei Zenodo.
- Folgestudien:
  - ADL 20.11.2025, Claude gegen antisemitische Mythen: n = 1.224, −16 %, Hälfte des Effekts nach >1 Monat. Autoren Rabb, Levontin, Berinsky, Pennycook, Costello, Rand.
  - Gemini zu Krisen (9/2026), mit Costello/Rand.
  - Andere Teams: Sci. Rep. 2026, n = 554, kleinerer Effekt. Boissin et al., PNAS Nexus 2025. arXiv 2510.01537: keine bleibende Fähigkeit, Falsches zu erkennen.
- „Bunking“ (arXiv 2601.05050, 1/2026, N = 2.724): GPT-4o, angewiesen für die Verschwörung zu argumentieren, steigerte den Glauben ebenso stark. Die Vorgabe „nur wahre Infos“ bremste das, eine Korrektur machte es rückgängig. GPT-5.2 verweigerte fast immer.
- URLs:
  - https://www.science.org/doi/10.1126/science.adq1814
  - https://www.science.org/doi/10.1126/science.aej2383
  - https://www.science.org/doi/10.1126/science.aem1178
  - https://retractionwatch.com/2026/06/11/science-ai-chatbots-debunk-conspiracy-theories-expression-of-concern/
  - https://www.eurekalert.org/news-releases/1131247
  - https://zenodo.org/records/22754984
  - https://arxiv.org/abs/2601.05050
  - https://www.adl.org/resources/report/short-dialogues-ai-reduce-belief-antisemitic-conspiracy-theories
  - https://www.nature.com/articles/s41598-026-66242-5
  - https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12578366/
  - https://the-decoder.com/seven-minutes-with-a-chatbot-beat-a-fact-sheet-at-reducing-conspiracy-beliefs-in-two-experiments/
  - https://mitsloan.mit.edu/ideas-made-to-matter/mit-study-ai-chatbot-can-reduce-belief-conspiracy-theories
  - https://www.cmu.edu/dietrich/news/news-stories/2026/thomas-costello-debunkbot-newcomb-cleveland-prize

## 1 · Android Earthquake Alerts

- **Urteil KI: nicht belegt.**
  - Das Handy muss stillliegen. Der Beschleunigungssensor löst bei plötzlichem Ruck aus. Der Server sucht Häufungen und bestimmt Stärke, Ort und Zeit aus Laufzeiten und Ausschlägen der P- und S-Welle (Stogaitis/Google).
  - Android Police 8.8.2021: „direct physics-based approach“, ohne KI.
  - ML nennen die Science-Autoren nur als künftige Verbesserung (über Sekundärseite).
  - Behauptungen über ein CNN stehen nur auf schwachen Seiten.
  - Ungeprüft und nur als Hinweis: Die Berkeley-App MyShake soll 2016 ein neuronales Netz genutzt haben (eigenes Wissen). Gilt nicht für Android.
- Science, Allen et al., 17.7.2025 (389:254–259):
  - 98 Länder, Zugang zehnmal größer, 2,5 Mrd. Menschen.
  - 312 Beben pro Monat (M1,9–7,8). Bei M ≥ 4,5 ~60 Ereignisse und 18 Mio. Warnungen pro Monat.
  - >1.200 Warnungen. Science-News zählt 1.279 Ereignisse und 3 Fehlalarme.
  - Umfrage: 85 % spürten Wackeln; 36 % bekamen die Warnung vorher, 28 % währenddessen, 23 % danach. Android ≈ 70 % der Smartphones.
- Google 15.10.2026: über 200 Länder und Regionen, >1 Mrd. Warnungen seit 2021.
- Türkei 6.2.2023 (M7,8): geschätzt M4,5–4,9, 469 „Take Action“-Alarme, ~500.000 „Be Aware“. Google gab es im Juli 2025 zu. Nachrechnung: ~10 Mio. „Take Action“-Alarme wären möglich gewesen.
- Marmara Ereğlisi 23.4.2025 (Mw 6,2): Nature Communications 2026 nennt Erkennung in 5,31 s, >16 Mio. Nutzer, 90 % richtig / 1 % falsch / 9 % verpasst. Google-Blog nennt 8,0 s, >11 Mio., einige bis 20 s Vorlauf. Widerspruch, nicht verwenden.
- Venezuela, Juni 2026 (M7,2 und M7,5, ~24.6.): 11,4 Mio. gewarnt, bis 2 Min, 1,4 Mio. „Take Action“. P-Welle nach ~3 s erkannt, 6 s später bestätigt. Venezuela hat kein staatliches System.
- Tauschoption für #1 mit echter KI: Google Flood Hub (aus Runde 1: 100+ Länder, ~700 Mio. Menschen, 7 Tage Vorlauf). Heute nicht neu geprüft.
- URLs:
  - https://www.science.org/doi/10.1126/science.ads4779
  - https://rallen.berkeley.edu/pub/2025AllenBarski/AllenEtAl-AndroidEarthquakeAlerts-Science-2025.pdf
  - https://research.google/blog/android-earthquake-alerts-a-global-system-for-early-warning/
  - https://www.science.org/content/article/google-alerts-offer-quick-cheap-earthquake-warnings
  - https://www.androidpolice.com/2021/08/08/shaking-things-up-how-your-phone-is-changing-the-way-we-detect-earthquakes/
  - https://blog.google/products/android/earthquake-detection-and-alerts
  - https://blog.google/products-and-platforms/platforms/android/android-earthquake-alerts-expansion-2026/
  - https://www.androidauthority.com/android-earthquake-alerts-system-update-3723972/
  - https://easternherald.com/2026/10/16/android-earthquake-alerts-200-regions-panama-guatemala/
  - https://www.euronews.com/next/2025/07/28/google-admits-earthquake-alert-system-failed-to-warn-most-users-before-2023-turkey-quake
  - https://phys.org/news/2025-07-google-android-earthquake.html
  - https://www.nature.com/articles/s41467-026-76413-7
  - https://thenextweb.com/news/google-earthquake-alerts-venezuela-android
  - https://www.heise.de/en/news/Earthquakes-in-Venezuela-Android-devices-warned-over-11-million-people-11347263.html
  - https://www.asiae.co.kr/en/article/world-general/2026062908383304254
  - https://current.fas.harvard.edu/stories/smartphone-system-detected-seismic-activity-and-saved-lives-venezuela
  - https://eps.harvard.edu/app/uploads/2026/07/260715-Mostafa-QA-for-EPS-website_SMM.pdf
  - https://www.asce.org/publications-and-news/civil-engineering-source/civil-engineering-magazine/issues/magazine-issue/article/2020/11/android-phones-now-offer-earthquake-detection-alerts

## Clip-Suche (Protokoll)

- Methode: yt-dlp-Suchliste (ytsearch8). Kein Upload-Datum, keine Untertitel, kein Ton.
- Gesucht:
  - Te Hiku / Jones / Mahelona → luhHNVjhGfk, nNIl6_l0s00, 0G6-gvE6tq4, y0muBYqlprE, JOy805kEnx4, dwl5lPbsABk, sGQy0r_icWc, qo95nke94KY. Mozilla IRL J1Z0QO3yAhQ ist rot (Musik).
  - Nazca / Sakai / IBM → nur kZB-XJx__38 (PNAS) ist Originalquelle. Der Rest sind Nacherzähl-Kanäle, nicht verwenden.
  - Harrell → thPhBDVSxz0, fS4Hb8qjiOU (UC Davis Health), G0KrDWzIKg0 (SF Chronicle).
  - GUARDIAN → rYBX59epPxI (SVS), DN4q7O7vx6s (Goddard), BEpZmRPPWFo (Earthdata-Webinar 2023).
  - DebunkBot / Costello / Rand → 5s1IuQe311I (Lawfare, Rand), Rer6ZXIeJTg (Somewhere on Earth). CBS mkw0cPyKq6c und CNN m6fyY_On6VA sind rot. 2LPW7oWHnAU (Creator-Selbstversuch) ist keine Originalquelle.
  - Android / Allen / Stogaitis → D8ao125Z1kw (Simons Institute 2016, Allen), KgqsM1c7Ij8 (UC Berkeley, Allen), 1_9PeG6Icpg und zFin2wZ56tM (Android), vUkL4V3bOcA und i-UH6oEx5JI (Berkeley, ShakeAlert/MyShake). Kein Vortrag von Allen oder Stogaitis zum Android-System gefunden.
  - Tamil Nadu: keine Wärmebild-Videos auf YouTube. Material von Supriya Sahu nur auf X.
- Nebenfund ohne Bezug zum Gerüst: Google Research pwDX67hlBXg „Mapping the Ionosphere with Android Devices“. Handys messen auch die Ionosphäre, das verbindet #5 und #1. Ungeprüft.
