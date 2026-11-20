# Film 5 · Faktencheck v1 · VO v1 ("The Fortune That Doesn't Exist Yet")

Stand: Nacht vom 19. auf den 20.10.2026. Geprüft gegen eine Veröffentlichung am 21. oder 22.10.2026.
Geprüft: `film-05-vo-v1.txt` (Zeilennummern unten beziehen sich auf diese Datei), Bildschirmtexte aus `film-05-text-v1.md`. Der Faktenzettel diente nur zur Orientierung, nichts wurde ungeprüft übernommen.
Urteile: **ok** · **zugespitzt** (darf bleiben, sicherere Zeile angeboten) · **falsch** (muss geändert werden) · **nicht prüfbar**.

**Zugriff:** Aus dem Container waren gesperrt: cnn.com, cnbc.com, axios.com, fortune.com, forbes.com, abcnews.com, decrypt.co, tomshardware.com, sanders.senate.gov, openai.com, api.worldbank.org, financing.desa.un.org, pfd.alaska.gov, ssa.gov und ushistory.org. Direkt gelesen wurden anthropic.com/news und der Anthropic-Post. Alles andere stammt aus Suchauszügen dieser Seiten oder aus Spiegeln und Qualitätspresse. Das steht in der jeweiligen Zeile. Die Uhrzeiten der X-Posts sind aus den Post-IDs berechnet (Snowflake-Zeitstempel).

**Interessenkonflikt:** Das Skript ist mit Claude (Anthropic) geschrieben, und auch dieser Check stammt von Claude. Deshalb wurde jede Anthropic-Zeile gegen den Wortlaut des Posts gelesen. Ergebnis in Abschnitt 3a.

---

## 1. Muss geändert werden (echte Fehler)

| Zeile | Skript (wörtlich) | Problem | Beleg | Ersatzzeile |
|---|---|---|---|---|
| 137 | "Anthropic's pledge climbs as its value climbs." | **falsch im Zusammenhang.** Zwei Zeilen vorher steht "Automatically." Wer zuhört, versteht: Anthropics Anteil steigt automatisch mit. Laut Primärtext kommt jedes Plus nur "at the board's discretion", und zwar in Stufen ("2% … for every 50% increase … above a set baseline"). Die Basis ist nicht veröffentlicht. Dazu kommt der Interessenkonflikt: Die Zeile stellt Anthropic besser dar, als die Quelle hergibt. | anthropic.com/news/public-benefit-fund, 18.10.2026 | "Anthropic's pledge can climb as its value climbs, if its board agrees." |
| 117 | "South Korea's president has proposed a national AI company, partly owned by all its citizens." | **falsch im Detail.** Lee Jae-myung hat die Idee am 2.3.2025 als Oppositionsführer geäußert, nicht als Präsident (gewählt im Juni 2025). Sie war außerdem als Gedankenspiel formuliert: "If a company like Nvidia emerges and 30% of the shares belong to the people …". Ich habe nicht gefunden, dass er sie als Präsident erneuert hat oder dass so eine Firma gegründet wurde. Als "seed already in the ground" ist das zu stark. | Asia Economy, 2.3.2025; Korea Herald ("Opposition leader's state-owned tech proposal faces reality check") | "Before taking office, South Korea's president floated a national AI company, partly owned by all its citizens." |
| 173 | "A truck driver in Ohio, at night." (mit 172 und 174: "Manila, at dawn … at the same moment") | **falsch (Zeitzonen).** Manila liegt bei UTC+8, Ohio bei UTC−4 (Sommerzeit) bzw. UTC−5 (ab 1.11.). Morgengrauen in Manila (etwa 5:50 bis 6:20 Uhr) entspricht in Ohio etwa 17:20 bis 18:00 Uhr, also Abenddämmerung und nicht Nacht. Die Anmerkung im Textdokument ("Manila's dawn is Ohio's night") stimmt nicht. | Zeitzonen PHT und ET (eigene Rechnung) | "A truck driver in Ohio, at dusk." Auch das Bild anpassen: "dusk in Ohio". |
| 67 | "AIs would have to buy it from us." | **nicht belegt, deshalb vor der Aufnahme ändern.** Belegbar ist nur, dass Mostaque in *The Last Economy* (2025) neue Münzen ("foundation coins", "culture coins") vorschlägt, die an KI-Nutzung und Menschen-Verifikation gekoppelt sind. Dass KIs das Geld den Menschen abkaufen *müssen*, fand ich in keiner Quelle. Der Faktenzettel nennt keine. Bei einer namentlich genannten Person sollte das so nicht gesprochen werden. | Cognitive Revolution-Podcast mit Mostaque (2025); Zusammenfassungen von *The Last Economy* | Zeile 67 streichen und Zeile 66 so fassen: "Emad Mostaque, founder of Stability AI, wants new digital money tied to every verified human." Oder Beleg vom Texter nachreichen lassen. |

**Bildschirmtexte, die geändert werden müssen:**

| Ort | Bildschirmtext | Problem | Ersatz |
|---|---|---|---|
| §2 PRINT | Ökonomen-Karte "right in theory" | **nicht prüfbar.** Keine Quelle gefunden. "He is so wrong on this" stammt von Sanjeev Sanyal (Wirtschaftsberater der indischen Regierung) und ist belegt. | Mit Namen und Quelle zeigen oder ersetzen durch Karl Widerquist: "possible, but it's naïve" (widerquist.com) |
| §5 Treppe | "OpenAI Foundation ≈ 26 % · more if value > 10× within 15 years" | 26 % galt beim Umbau am 28.10.2025. Nach der Runde vom 31.3.2026 (122 Mrd. $) ist der Anteil vermutlich verwässert, eine offizielle Zahl gibt es nicht. OpenAI formuliert "greater than tenfold after 15 years". | "OpenAI Foundation ≈ 26 % (2025) · more if value rises > 10× over 15 years" |
| §6 Split-Screen | "night in Ohio" | siehe Zeile 173 | "dusk in Ohio" |

---

## 2. Zugespitzt, darf bleiben, sicherere Alternative

Die drei wichtigsten stehen oben.

| Zeile | Skript (wörtlich) | Warum zugespitzt | Sicherere Zeile |
|---|---|---|---|
| 19 | "It's pledging a slice of itself now, and more each time its value climbs." | **Interessenkonflikt.** Klingt automatisch und stetig. Tatsächlich: +2 % pro +50 % Wert über einer unveröffentlichten Basis, nach Ermessen des Vorstands. Zeile 24 rückt das zurecht, aber erst vier Zeilen später. | "It's pledging a slice of itself now, and maybe more for every big jump in its value." |
| 107 | "The two leading AI labs together are worth about two hundred and twenty dollars for every person on Earth." | Die Rechnung stimmt (siehe Abschnitt 3). Aber "the two leading AI labs" ist ein Rangurteil, das Anthropic adelt (Interessenkonflikt), und Google DeepMind fehlt. Die Zahl veraltet außerdem, sobald Anthropic einen Börsenpreis festlegt (diskutiert werden 1,5 bis 2 Bio. $, dann etwa 290 bis 345 $). | "OpenAI and Anthropic together are worth about two hundred and twenty dollars for every person on Earth." |
| 112 (Kontext) | "It goes into an independent fund, under a fixed rule that no board can change." | Kann als Beschreibung von Anthropics Fonds missverstanden werden. Der ist aber "a wholly-owned LLC" von Anthropic, und Struktur und Governance kommen erst "in the coming months". Im gesprochenen Text fehlt dieser Kernpunkt der Kritik ("IPO theater"). Das ist eine Auslassung zugunsten von Anthropic. | Nach Zeile 24 ergänzen: "For now, those shares sit in a fund Anthropic wholly owns." Oder Zeile 112: "In our plan, it goes into an independent fund …" |
| 97 | "Taken as one country, humanity is already almost rich." | Die Zahl trägt: Das Welt-BNE pro Kopf lag 2025 bei 14.244 $ (Atlas), die Schwelle "high income" (FY27) liegt über 14.375 $, also bei 99 %. Aber "rich" heißt hier "high income" nach der Weltbank, eine Schwelle auf dem Niveau von Uruguay oder Panama und nicht "reich" im Alltagssinn. | "Taken as one country, humanity would almost make the World Bank's list of high-income countries." |
| 92 | "Norway set its rules before the big oil money came." | Für die "Zehn Ölgebote" (1971) und die Staatsbeteiligung über Statoil (ab 1972, mindestens 50 % an Funden) stimmt das. Der Fonds (1990, erste Einzahlung 1996) und die Ausgaberegel (2001; 3 % seit 2017) kamen aber erst nach dem großen Geld. Wer zuhört, denkt an Fonds und Regel. | "Norway made sure the state owned a share of its oil before the big money came." |
| 89 | "For decades, every Alaskan has received the same share of the state's oil money." | Es bekommen nur berechtigte Einwohner etwas: mindestens ein volles Kalenderjahr im Staat, Absicht zu bleiben, keine Haft wegen Verbrechen, Antrag nötig. Kinder bekommen dasselbe, die Eltern beantragen es. Seit 1982 (erster Scheck am 14.6.1982, 1.000 $). 2026 waren es 1.200 $. | "For decades, almost every Alaskan has received the same share of the state's oil money." |
| 69 | "A few years ago, the IMF created about six hundred and fifty billion dollars in one go." | Geschaffen wurden Sonderziehungsrechte (SZR, Reservegeld der Staaten) **im Wert von** etwa 650 Mrd. $, keine Dollar (23.8.2021). "A few years ago" ist bei 5 Jahren ok. | "A few years ago, the IMF created reserve money worth about six hundred and fifty billion dollars in one go." |
| 65 | "Economists are split." | Belegt ist vor allem Skepsis (Sanyal: "so wrong", Widerquist: "naïve"). Zustimmung gibt es nur in Kommentaren ("some merit"), nicht von namentlich belegten Ökonomen. | "Many economists doubt it." |
| 167 | "The pledges depend on boards." | Musks Zusage hängt an Musk, nicht an einem Vorstand. | "The pledges depend on boards and billionaires." |
| 160 | "So far, the plans in the headlines all do." | Sanders, Musk, Trumps 5.000 $ und OpenAIs Public Wealth Fund gelten nur für die USA. Anthropics Plan nennt aber gar keine Grenze, er lässt das offen. | "So far, most plans in the headlines do." |
| 162 | "they could tax the AI their people use, even when the company sits elsewhere." | Der Protokollentwurf (20.7.2026) betrifft grenzüberschreitende Dienstleistungen, darunter "automated digital services", und sieht ein geteiltes Besteuerungsrecht mit Grenzen vor. Um KI im Besonderen geht es nicht. | "they could tax digital services their people use, AI included, even when the company sits elsewhere." |
| 136 | "The OpenAI Foundation owns about a quarter of OpenAI, and gets more if the company's value soars." | 26 % galt beim Umbau im Oktober 2025. Nach der Runde vom März 2026 ist der Anteil vermutlich kleiner (keine offizielle Zahl). Das Plus kommt erst, wenn der Wert sich nach 15 Jahren mehr als verzehnfacht hat. | "The OpenAI Foundation was given about a quarter of OpenAI, and gets more if the company's value soars tenfold." |
| 118 | "American babies born these years can get a government-funded account that grows with the economy." | Das Geld liegt in Indexfonds aus US-Aktien, es wächst also mit dem Aktienmarkt, nicht mit "der Wirtschaft". Staatlich finanziert ist nur der Startbetrag von 1.000 $ (US-Bürger mit SSN, Jahrgänge 2025 bis 2028). | "American babies born these years can get a thousand government dollars, invested in the stock market." |
| 61 | "That would mean years in court, and it stops at the US border." | Das ist eine Prognose. Kritiker erwarten eine Klage nach der Takings Clause (5. Verfassungszusatz), Gerichtsjahre sind aber nicht sicher. | "Critics expect years in court, and it stops at the US border." |
| 87 | "And wherever the rules came before the riches, sharing has worked." | "wherever" ist eine Pauschalaussage ohne Beleg. Belegt sind zwei Beispiele. | "And where the rules came before the riches, sharing has worked." |
| 27–28 | "Still, the builders are saying it out loud: what's coming is too big to belong to a few." | Das ist eine Deutung und klingt wie ein Zitat. Wörtlich sagt keiner der beiden das. | "Still, the builders are signalling it: what's coming is too big to belong to a few." |
| 39 | "Everything people ever wrote down." | KI lernt aus einem großen Teil des digitalisierten, meist öffentlichen Textes, nicht aus allem, was je geschrieben wurde. | "So much of what people ever wrote down." |
| 72 | "Printing takes nothing from anyone." | Das ist eine Argumentzeile. Steigen die Preise doch, nimmt Inflation Kaufkraft weg, genau darum streiten die Ökonomen in Zeile 65. | "Printing takes nothing directly from anyone." |
| 130 | "Norway's rule lets its government spend only about three percent of its fund each year." | Die Regel ist eine Richtlinie über die Zeit (Erwartungsrendite 3 %, seit 2017), keine harte Obergrenze. In Krisenjahren lag der Wert darüber. Die Zeile ist praktisch ok. | Optional: "Norway's rule says its government should spend only about three percent of its fund a year." |

---

## 3. Vollständige Tabelle aller Behauptungen

| Zeile | Skript (wörtlich, gekürzt) | Behauptung | Urteil | Beleg (URL, Datum) | Ersatz, falls nicht ok |
|---|---|---|---|---|---|
| 1–4 | "Your phone buzzes … Your share of the largest fortune ever made." | Szene, kein Faktenanspruch | ok | – | – |
| 7–8 | "But a few days ago, one of the companies building superintelligence promised a piece of itself to the public good." | Anthropic, 18.10.2026: "roughly 20% of Anthropic shares will be dedicated to the public good". Bei Veröffentlichung am 21./22.10. sind das 3 bis 4 Tage, "a few days ago" passt also. "building superintelligence" ist die Rahmung des Kanals. | ok | https://www.anthropic.com/news/public-benefit-fund (18.10.2026, direkt gelesen); X-Post @AnthropicAI 18.10.2026, 18:07 UTC: https://x.com/AnthropicAI/status/2111881963657412903 | – |
| 9–10 | "Then Elon Musk made a promise of his own: a SpaceX share for every child in America." | Musk auf X, 19.10.2026, 07:52 UTC: "Next year, I will give one of my SpaceX shares to every kid in America. This will be the first of many." Die Reihenfolge stimmt (nach Anthropic). Vorher schrieb er: "I recommend giving the shares directly to the public", später "This is what I will be doing" (nicht im VO). | ok | https://x.com/elonmusk/status/2112089556615123114 (19.10.2026); CNN, Axios, CNBC, Fortune, Bloomberg, Deseret vom 19.10.2026 (Suchauszüge, Seiten gesperrt) | – |
| 17–18 | "The company is Anthropic. Its AI, Claude, helped write this film, so let's look closely." | Offenlegung | ok | Projektangabe | – |
| 19 | "It's pledging a slice of itself now, and more each time its value climbs." | 5 % jetzt, +2 % pro +50 % Wert nach Ermessen des Vorstands | zugespitzt | anthropic.com/news/public-benefit-fund | siehe Abschnitt 2 |
| 20 | "And Musk added: 'This will be the first of many.'" | wörtliches Zitat | ok | x.com/elonmusk/status/2112089556615123114 | – |
| 22 | "To be fair, both are promises, not contracts." | Anthropic: "Subject to stockholder approval"; Musk: keine Details | ok | wie oben | – |
| 23 | "Musk's has no details yet." | Keine Angaben zu Weg, Zeitpunkt, Altersgrenze. Laut Bloomberg wahrscheinlich über Trump-Konten, das ist aber eine Deutung. | ok (Stand 19.10.) | Axios, CNN 19.10.2026 (Suchauszüge) | vor Upload prüfen |
| 24 | "Anthropic's pledge needs its owners' approval, and every step up is the board's call." | "Subject to stockholder approval, 5% … committed today, with an additional 2% added at the board's discretion for every 50% increase …" | ok | anthropic.com/news/public-benefit-fund | – |
| 25 | "And it comes just before a planned stock market debut." | Vertraulicher S-1-Entwurf am 1.6.2026. Laut Reuters (4.9.2026) Vermarktung ab Mitte Oktober, Notierung "days before the U.S. midterm elections" (3.11.2026). Im Anthropic-Post selbst kein Wort zum Börsengang. | ok | Reuters über The Standard HK: https://www.thestandard.com.hk/world/article/341919/Anthropic-IPO-launch-shifts-toward-mid-October-sources-say (4.9.2026); Fortune 1.6.2026 (Suchauszug) | vor Upload prüfen |
| 27–28 | "the builders are saying it out loud: what's coming is too big to belong to a few." | Deutung, die wie ein Zitat klingt | zugespitzt | – | siehe Abschnitt 2 |
| 33–34 | "the largest fortune in history hasn't been made yet. It belongs to no one." | These des Films | ok (Meinung) | – | – |
| 39–43 | "Everything people ever wrote down … That's what AI is learning from." | KI wird mit großen Textsammlungen trainiert | zugespitzt ("Everything") | allgemein bekannt | siehe Abschnitt 2 |
| 46 | "It is not charity but a right, not bounty but justice, that I am pleading for." | Paine, *Agrarian Justice* (geschrieben 1795/96, gedruckt 1797). Der Satz steht im Volltext im Absatz vor "The present state of civilization is as odious as it is unjust". Primärseiten (ushistory.org, ssa.gov) waren gesperrt. Per Suche bestätigt ist die Nachbarstelle "it is a right, and not a charity, that I am pleading for". | ok (Wortlaut einmal im Browser gegenprüfen) | https://ushistory.org/PAINE/agrarian/ ; https://www.libertarianism.org/essays/agrarian-justice-excerpt | Wer ganz sicher gehen will: "It is a right, and not a charity, that I am pleading for." |
| 56–57 | "Bernie Sanders has a bill. A tax, paid in new shares, would hand a public fund half of the big AI companies." | American AI Sovereign Wealth Fund Act, eingebracht am 18.6.2026: einmalige Steuer von 50 %, zahlbar in neu ausgegebenen Aktien, für KI-Firmen ab 200 Mio. $ Umsatz; ein unabhängiger Ausschuss verwaltet den Fonds | ok | Reason 19.6.2026: https://reason.com/2026/06/19/bernie-sanders-proposes-ai-tax-to-give-everyone-1000-a-month-his-bill-would-do-a-lot-more-than-that/ ; sanders.senate.gov (gesperrt, Suchauszug) | – |
| 58 | "In polls, roughly two in three Americans support it." | Verasight, Juni 2026, 1.690 Erwachsene: 69 % dafür, mit Sanders' Namen 64 % | ok | Gizmodo: https://gizmodo.com/over-2-3-of-americans-support-bernie-sanders-style-ai-stock-ownership-plan-poll-shows-2000784466 ; TechRadar (Suchauszug) | – |
| 59 | "It would also tax future shares, sharing some of what's coming." | Künftige Aktienausgaben werden besteuert, damit der Anteil bei 50 % bleibt | ok | Reason 19.6.2026 | – |
| 60 | "But it takes half of what already exists." | Wirtschaftlich halbiert die Ausgabe neuer Aktien den Anteil der bisherigen Eigentümer | ok | wie oben | – |
| 61 | "That would mean years in court, and it stops at the US border." | Prognose, Takings Clause | zugespitzt | Volokh Conspiracy über Reason (Suchauszug) | siehe Abschnitt 2 |
| 64 | "Elon Musk wants government checks for everyone, betting AI makes so much that prices won't rise." | Angehefteter Post vom 16./17.4.2026 (je nach Zeitzone): "Universal HIGH INCOME via checks issued by the Federal government is the best way to deal with unemployment caused by AI. AI/robotics will produce goods & services far in excess of the increase in the money supply, so there will not be inflation." | ok | Fox Business: https://www.foxbusiness.com/fox-news-tech/elon-musk-backs-universal-high-income-combat-ai-job-losses ; Widerquist: https://widerquist.com/what-elon-musk-gets-right-and-wrong-about-universal-basic-income-and-universal-high-income/ | – |
| 65 | "Economists are split." | Überwiegend Skepsis belegt | zugespitzt | Yahoo Finance ("experts aren't so sure"): https://finance.yahoo.com/economy/policy/articles/elon-musk-says-government-checks-163114976.html | siehe Abschnitt 2 |
| 66 | "Emad Mostaque, founder of Stability AI, wants a new money for every verified human." | Mostaque hat Stability AI gegründet (Rücktritt als CEO im März 2024). In *The Last Economy* (2025) schlägt er "foundation/culture coins" vor, gekoppelt an Menschen-Verifikation. Teilweise belegt. | ok bis zugespitzt | https://www.cognitiverevolution.ai/the-machines-are-taking-our-jobs-thank-god-emad-mostaques-guide-to-the-next-1000-days/ (2025) | siehe Abschnitt 1 |
| 67 | "AIs would have to buy it from us." | kein Beleg gefunden | nicht prüfbar | – | siehe Abschnitt 1 |
| 68–69 | "New money is already made on a world scale. A few years ago, the IMF created about six hundred and fifty billion dollars in one go." | SZR-Zuteilung von rund 650 Mrd. $, beschlossen am 2.8.2021, wirksam am 23.8.2021, die größte in der Geschichte des IWF | zugespitzt (SZR, keine Dollar) | IMF-Blog 26.8.2021: https://www.imf.org/en/blogs/articles/2021/08/26/a-shot-in-the-arm-how-special-drawing-rights-can-help-struggling-countries | siehe Abschnitt 2 |
| 70 | "It went out by size and wealth. The poorest countries got a sliver." | Verteilt nach IWF-Quoten (die nach Wirtschaftsgröße bemessen werden). Länder mit niedrigem Einkommen erhielten rund 21 Mrd. $, also gut 3 %. | ok | IMF Annual Report 2022: https://www.imf.org/external/pubs/ft/ar/2022/in-focus/a-more-equitable-recovery | – |
| 72–74 | "Printing takes nothing from anyone. But nobody ends up owning anything. And whoever controls the tap decides everything." | Argument | zugespitzt (Zeile 72) | – | siehe Abschnitt 2 |
| 83–84 | "The rich never share. For what they already own, that doubt is often right." | Meinung | ok (Meinung) | – | – |
| 87 | "wherever the rules came before the riches, sharing has worked." | Pauschalaussage | zugespitzt | – | siehe Abschnitt 2 |
| 89–90 | "For decades, every Alaskan has received the same share … Every year. Rich or poor. Child or adult." | Seit 1982 gleicher Betrag für alle berechtigten Einwohner, Kinder eingeschlossen (Eltern beantragen). 2026 waren es 1.200 $ (1.000 $ plus 200 $ Energiezuschlag). | zugespitzt ("every") | PFD Historical Timeline: https://pfd.alaska.gov/Division-Info/Historical-Timeline (Suchauszug); Alaska's News Source 30.9.2026: https://www.alaskasnewssource.com/2026/09/30/permanent-fund-dividends-will-be-distributed-alaskans-starting-this-week/ | siehe Abschnitt 2 |
| 92 | "Norway set its rules before the big oil money came." | 1971 die Zehn Ölgebote, ab 1972 Statoil mit mindestens 50 %; Fonds erst 1990, Ausgaberegel 2001 | zugespitzt | Regjeringen, Meld. St. 28 (2010–2011): https://www.regjeringen.no/en/documents/meld.-st.-28-20102011/id649699/?ch=1 ; Norges Bank, Rede 14.4.2015: https://www.norges-bank.no/en/news-events/news-publications/Speeches/2015/2015-04-14-Olsen-Roma/ | siehe Abschnitt 2 |
| 93–94 | "Today its fund owns a slice of Nvidia … About eleven thousand dollars' worth for every Norwegian." | NBIM am 30.6.2026: 1,28 % an Nvidia, rund 62 Mrd. $ (612 Mrd. NOK), größte Einzelposition. Bei rund 5,6 Mio. Norwegern sind das etwa 11.000 $ pro Kopf. Zum heutigen Kurs (Nvidia Anfang Oktober bei etwa 5,8 Bio. $) wären es eher rund 13.000 $. Die Zahl ist also eher vorsichtig. | ok (Stand 30.6.2026) | Reuters über Investing.com: https://www.investing.com/news/stock-market-news/norway-wealth-fund-holds-12-billion-stake-in-spacex-4852498 ; CNBC 12.8.2026 (Suchauszug) | wer gegen Kursschwankungen sicher sein will: "More than ten thousand dollars' worth for every Norwegian." |
| 97–98 | "Taken as one country, humanity is already almost rich. Not each of us. All of us, together." | Welt-BNE pro Kopf (Atlas) 2025: 14.244 $. Schwelle "high income" nach Weltbank FY27 (gültig 1.7.2026 bis 30.6.2027): über 14.375 $. Das sind 99 % der Schwelle. | ok in der Zahl, zugespitzt im Wort "rich" | Weltbank FY27-Klassifikation: https://documents1.worldbank.org/curated/en/099063026190549947/pdf/BOSIB-8ff63426-3c40-412d-bad2-cc20a4ebea81.pdf ; Indikator NY.GNP.PCAP.CD: https://data.worldbank.org/indicator/NY.GNP.PCAP.CD (gesperrt, Wert über den Spiegel https://www.macrotrends.net/global-metrics/countries/wld/world/gni-per-capita) | siehe Abschnitt 2 |
| 101–103 | "Sow … grow … harvest" | Plan des Films | ok (Konzept) | – | – |
| 106 | "Right now, a piece of these companies is still cheap." | Meinung | ok (Meinung) | – | – |
| 107 | "The two leading AI labs together are worth about two hundred and twenty dollars for every person on Earth." | OpenAI: 852 Mrd. $ post-money (31.3.2026). Anthropic: 965 Mrd. $ post-money (Series H, Mai 2026). Zusammen 1.817 Mrd. $; geteilt durch 8,25 Mrd. Menschen ergibt 220 $ (bei 8,2 Mrd. 222 $, bei 8,3 Mrd. 219 $). | ok in der Zahl, zugespitzt bei "leading" | OpenAI 31.3.2026: https://openai.com/index/accelerating-the-next-phase-ai/ (gesperrt, Suchauszug); TechCrunch 28.5.2026: https://techcrunch.com/2026/05/28/anthropic-raises-65-billion-nears-1t-valuation-ahead-of-ipo/ ; UN World Population Prospects 2024: https://population.un.org/wpp/ | siehe Abschnitt 2 |
| 108–109 | "If the fortune comes, that piece will be out of reach. So we secure it now." | Prognose bzw. Argument | ok (Meinung) | – | – |
| 111–113 | "a share only counts if it leaves the company. It goes into an independent fund, under a fixed rule …" | Konzept des Films. Kann aber als Beschreibung von Anthropics Fonds gehört werden, und der ist eine LLC, die Anthropic ganz gehört. | ok (Konzept), Risiko des Missverstehens | anthropic.com/news/public-benefit-fund ("wholly-owned LLC") | siehe Abschnitt 2 |
| 116 | "The US government owns a slice of Intel." | August 2025: 433,3 Mio. neue Aktien zu 20,47 $, also 9,9 %. Laut Proxy vom März 2026 vermutlich 8,4 % (verwässert, nur über eine schwache Quelle belegt). | ok | NPR über WFAE 22.8.2025: https://www.wfae.org/2025-08-22/intel-will-give-the-u-s-government-a-10-stake-trump-says | Bildschirm: "Intel ≈ 10 % (2025)" |
| 117 | "South Korea's president has proposed a national AI company, partly owned by all its citizens." | Vorschlag vom 2.3.2025, damals als Oppositionsführer und als Gedankenspiel | falsch im Detail | Asia Economy: https://view.asiae.co.kr/en/article/2025030218034250527 ; Korea Herald: https://stg-m.koreaherald.com/article/10438849 | siehe Abschnitt 1 |
| 118 | "American babies born these years can get a government-funded account that grows with the economy." | Trump-Konten: 1.000 $ vom Bund für US-Bürger mit SSN, Jahrgänge 2025 bis 2028; angelegt in Indexfonds aus US-Aktien; Einzahlungen ab 4.7.2026 | zugespitzt ("grows with the economy") | ABC7: https://abc7.com/story/trump-accounts-start-july-4-what-parents-need-know/19440606/ ; JD Supra: https://www.jdsupra.com/legalnews/targeted-changes-ahead-proposed-5451726/ | siehe Abschnitt 2 |
| 120–121 | "None of this reaches everyone yet. It stops at borders, and parents have to apply." | Das Finanzministerium legt Konten inzwischen automatisch an. Die 1.000 $ müssen Eltern aber beantragen bzw. "claimen" (Formular 4547 oder App). | ok | KTVU/FOX: https://www.ktvu.com/news/treasury-moves-automatically-enroll-millions-children-trump-accounts | – |
| 130 | "Norway's rule lets its government spend only about three percent of its fund each year." | Ausgaberegel seit 2001 (4 %, seit 2017 3 %), als Richtlinie über die Zeit; das Geld fließt in den Staatshaushalt | ok | Columbia CER: https://cer.econ.columbia.edu/news/importance-handlingsregelen-discipline-lasting-wealth ; Regjeringen (wie oben) | optional, siehe Abschnitt 2 |
| 131–133 | "Now imagine our fund paying every person a fixed slice … Automatically." | Konzept | ok (Konzept) | – | – |
| 136 | "The OpenAI Foundation owns about a quarter of OpenAI, and gets more if the company's value soars." | 26 % (rund 130 Mrd. $) beim Umbau am 28.10.2025, dazu ein Warrant "if OpenAI Group's share price increases greater than tenfold after 15 years". Danach vermutlich verwässert. | zugespitzt | OpenAI 28.10.2025: https://openai.com/index/built-to-benefit-everyone/ (gesperrt, Inhalt aus Berichten) | siehe Abschnitt 2 |
| 137 | "Anthropic's pledge climbs as its value climbs." | Ermessen des Vorstands | falsch im Zusammenhang | anthropic.com/news/public-benefit-fund | siehe Abschnitt 1 |
| 138 | "Oxford researchers proposed a Windfall Clause: the bigger the profit, the bigger the share given away." | O'Keefe u. a., GovAI/FHI Oxford, Januar 2020 (AIES 2020); Beispielstaffel 1 % → 20 % → 50 % der Gewinne über Schwellen in Prozent der Weltwirtschaftsleistung | ok | https://www.fhi.ox.ac.uk/?p=29164 ; https://arxiv.org/abs/1912.11595 | – |
| 140 | "Most of this is still promises and proposals." | stimmt | ok | – | – |
| 142–144 | "Today, when a few win big … Envy turns into something closer to cheering." | Meinung | ok (Meinung) | – | – |
| 151–152 | "In Switzerland, every resident, from baby to pensioner, gets the same refund from an environmental levy, every year. It comes through their health insurance." | Rückverteilung der CO2-Abgabe über die Krankenversicherer an alle Personen mit Grundversicherung. 2026: 61,80 CHF pro Person (567 Mio. CHF), 2027: 57 CHF. | ok | BAFU: https://www.bafu.admin.ch/de/co2-abgabe-private ; EGK-Merkblatt 2026: https://www.egk.ch/egk/downloads/ipr/merkblatt_umweltabgaben_2026_de.pdf | – |
| 154 | "Anthropic's plan mentions 'direct distributions to specific populations.'" | Wortlaut: "we might explore large donations to traditional nonprofits or direct distributions to specific populations." | ok | anthropic.com/news/public-benefit-fund | – |
| 155–157 | "But someone would have to pick them. An equal share needs no one to pick." | Schlussfolgerung | ok (Argument) | – | – |
| 159–160 | "This share wouldn't stop at a border. So far, the plans in the headlines all do." | Anthropics Plan lässt die Grenze offen | zugespitzt | Trump 5.000 $: https://wjla.com/news/nation-world/trump-dividend-promise-gets-mixed-reviews-democrats-republicans ; OpenAI Public Wealth Fund (April 2026): https://www.aol.com/finance/openais-ceo-wants-every-american-104500630.html | siehe Abschnitt 2 |
| 161–162 | "at the United Nations, countries are negotiating a rule: they could tax the AI their people use, even when the company sits elsewhere." | UN-Rahmenkonvention, Protokoll 1 zu grenzüberschreitenden Dienstleistungen (Entwurf vom 20.7.2026, umfasst "automated digital services"). 6. Sitzung vom 30.11. bis 11.12.2026 in Nairobi. | zugespitzt ("the AI") | EY 2026: https://globaltaxnews.ey.com/news/2026-1618-un-releases-draft-framework-convention-on-international-tax-cooperation-and-two-early-protocols ; https://financing.desa.un.org/unfcitc (gesperrt, Suchauszug: "30 Nov - 11 Dec, Nairobi") | siehe Abschnitt 2 |
| 163 | "The United States has left the talks." | Ausstieg am 3.2.2025, mit der Ankündigung, das Ergebnis abzulehnen | ok | Eurodad: https://www.eurodad.org/us-walks-out-tax-convention ; Bloomberg Tax (Suchauszug) | – |
| 165 | "Four in five adults already have an account, often on their phone." | Global Findex 2025: 79 % der Erwachsenen weltweit haben ein Konto bei einer Bank, einem Mobile-Money-Anbieter oder beidem | ok | Weltbank 16.7.2025: https://www.worldbank.org/en/news/press-release/2025/07/16/mobile-phone-technology-powers-saving-surge-in-developing-economies | – |
| 166 | "But nobody pays every human on Earth yet." | stimmt | ok | – | – |
| 167 | "The pledges depend on boards." | gilt nicht für Musk | zugespitzt | – | siehe Abschnitt 2 |
| 168 | "And a global fund has neither money nor a way to reach those accounts." | Einen solchen Fonds gibt es nicht | ok | – | – |
| 172–174 | "A care worker in Manila, at dawn. A truck driver in Ohio, at night. Two phones buzz at the same moment." | Zeitzonen | falsch | eigene Rechnung | siehe Abschnitt 1 |
| 180–181 | "No law of nature decides … People do, in agreements being written right now." | UN-Verhandlungen laufen; Anthropic will Governance "in the coming months" vorlegen | ok | wie oben | – |
| 194 | "And what's coming may take years." | Vorsichtsformulierung | ok | – | – |

### 3a. Interessenkonflikt: Wo das Skript Anthropic besser darstellt als die Quelle

1. **Zeile 137** "Anthropic's pledge climbs as its value climbs." Steht direkt nach "Automatically." und unterschlägt das Ermessen des Vorstands. Muss geändert werden (Abschnitt 1).
2. **Zeile 19** "more each time its value climbs." Klingt automatisch. Zeile 24 korrigiert das, aber erst später. Zugespitzt.
3. **Auslassung:** Der gesprochene Text sagt nirgends, dass Anthropics Anteile in "a wholly-owned LLC" liegen, die Anthropic selbst gehört, und dass Struktur und Governance noch fehlen ("In the coming months, we will share more about … structure and governance"). Zeile 111 ("a share only counts if it leaves the company") deutet die Kritik nur an. Empfehlung: ein Satz nach Zeile 24 (Abschnitt 2).
4. **Zeile 107** "the two leading AI labs" stuft Anthropic als eines der zwei führenden Labore ein. Besser beide beim Namen nennen.
5. **Zeile 8** übernimmt Anthropics eigene Formel "public good". Vertretbar, weil Zeile 22 bis 25 sofort einordnen.
6. Fair zu Anthropic, also kein Problem: Zeile 24, 25, 154 bis 157 und 167 sind kritisch und stimmen mit dem Primärtext überein. Zeile 160 ist sogar strenger als nötig (Anthropics Plan nennt keine Grenze).

### 3b. Wahr, aber leicht als stärkere Aussage gehört

- Zeile 10: "a SpaceX share for every child in America" kann klingen, als sei es schon passiert. Musk schreibt "Next year". Das "promise" davor trägt.
- Zeile 57 und 60: "half of the big AI companies" kann nach Enteignung bestehender Aktien klingen. Gemeint sind neue Aktien, also Verwässerung. Zeile 57 sagt das, das reicht.
- Zeile 69: "six hundred and fifty billion dollars" klingt nach gedruckten Dollar, es waren SZR.
- Zeile 97: "almost rich" kann klingen wie "fast alle sind reich". Zeile 98 fängt das teilweise auf.
- Zeile 107: "220 dollars for every person" kann klingen wie "deinen Anteil gibt es für 220 $ zu kaufen". Gemeint ist Bewertung geteilt durch Weltbevölkerung, eine Rechengröße.
- Zeile 112: "independent fund … no board can change" kann als Beschreibung von Anthropics Fonds gehört werden.
- Zeile 118: "government-funded account" kann klingen, als bekäme jedes Baby automatisch Geld. Die 1.000 $ gibt es nur auf Antrag, Zeile 121 sagt das.
- Zeile 165: "account" kann als Anlagekonto gehört werden, gemeint ist ein Bank- oder Mobile-Money-Konto.

---

## 4. Direkt vor dem Upload noch einmal prüfen (schnelle Nachrichtenlage)

1. **Anthropics Börsengang** (Zeile 25, 107): Ist der S-1 öffentlich, gibt es eine Preisspanne, läuft die Roadshow? Bei einer Preisspanne ist der neue Wert die aktuelle Bewertung, und die 220 $ steigen (bei 1,5 bis 2 Bio. $ auf etwa 290 bis 345 $ für beide Labore). Ist die Notierung schon erfolgt, muss "just before a planned stock market debut" umformuliert werden.
2. **OpenAI-Bewertung** (Zeile 107): Gespräche über eine Runde bei 1,2 bis 1,4 Bio. $ sind nicht bestätigt. Bei Abschluss neu rechnen.
3. **Musk** (Zeile 23): Hat er Details nachgeliefert (Weg, Altersgrenze, Trump-Konten)? Dann muss "Musk's has no details yet" angepasst werden.
4. **Anthropic-Fonds** (Zeile 24, 154): neue Angaben zu Governance oder Basisbewertung, Termin der Aktionärsabstimmung?
5. **Zeitwort "a few days ago"** (Zeile 7): stimmt bis etwa 25.10.2026. Bei späterer Veröffentlichung "last week" sagen.
6. **Nvidia-Kurs und NBIM** (Zeile 94): Die 11.000 $ beruhen auf dem 30.6.2026. Bei starkem Kursrutsch prüfen, sonst ist die Zahl eher vorsichtig.
7. **UN-Sitzung Nairobi** (Bildschirm "30 Nov 2026"): Termin auf der UN-DESA-Seite bestätigen (30.11. bis 11.12.2026).
8. **Sanders** (Zeile 56 bis 61): neue Umfragen, Mitunterzeichner, Status des Entwurfs.
9. **Trump-Konten** (Zeile 118, 121): Regeln zur automatischen Kontoeröffnung und zum Antrag auf die 1.000 $ (Finanzministerium bzw. IRS).
10. **Intel-Anteil** (Bildschirm "≈ 10 %"): aktueller Prozentsatz laut letzter Meldung bei der SEC.

---

## 5. Quellen nach Thema (für die YouTube-Beschreibung)

**Anthropic Public Benefit Fund**
- Anthropic, "Investing in the public benefit", 18.10.2026: https://www.anthropic.com/news/public-benefit-fund
- Anthropic auf X, 18.10.2026: https://x.com/AnthropicAI/status/2111881963657412903
- Reuters, Zeitplan des Börsengangs, 4.9.2026: https://www.thestandard.com.hk/world/article/341919/Anthropic-IPO-launch-shifts-toward-mid-October-sources-say
- TechCrunch, Series H bei 965 Mrd. $, 28.5.2026: https://techcrunch.com/2026/05/28/anthropic-raises-65-billion-nears-1t-valuation-ahead-of-ipo/

**Elon Musk**
- Musk auf X, 19.10.2026: https://x.com/elonmusk/status/2112089556615123114
- CNN, 19.10.2026: https://www.cnn.com/2026/10/19/business/elon-musk-children-spacex-shares-x-post-intl
- Axios, 19.10.2026: https://www.axios.com/2026/10/19/elon-musk-spacex-shares-kids
- Fox Business zum Post "Universal HIGH INCOME" (April 2026): https://www.foxbusiness.com/fox-news-tech/elon-musk-backs-universal-high-income-combat-ai-job-losses
- Karl Widerquist zu Musks "Universal High Income": https://widerquist.com/what-elon-musk-gets-right-and-wrong-about-universal-basic-income-and-universal-high-income/

**Bernie Sanders: American AI Sovereign Wealth Fund Act**
- Büro Sanders: https://www.sanders.senate.gov/in-the-news/bernie-sanders-unveils-plan-to-give-the-public-direct-ownership-of-ai-companies/
- Reason, 19.6.2026: https://reason.com/2026/06/19/bernie-sanders-proposes-ai-tax-to-give-everyone-1000-a-month-his-bill-would-do-a-lot-more-than-that/
- Umfrage (Verasight, Juni 2026) über Gizmodo: https://gizmodo.com/over-2-3-of-americans-support-bernie-sanders-style-ai-stock-ownership-plan-poll-shows-2000784466

**Geld schaffen: IWF-Sonderziehungsrechte 2021**
- IMF-Blog, 26.8.2021: https://www.imf.org/en/blogs/articles/2021/08/26/a-shot-in-the-arm-how-special-drawing-rights-can-help-struggling-countries
- IMF Annual Report 2022: https://www.imf.org/external/pubs/ft/ar/2022/in-focus/a-more-equitable-recovery

**Alaska und Norwegen**
- Alaska PFD, Historical Timeline: https://pfd.alaska.gov/Division-Info/Historical-Timeline
- Alaska's News Source, PFD 2026, 30.9.2026: https://www.alaskasnewssource.com/2026/09/30/permanent-fund-dividends-will-be-distributed-alaskans-starting-this-week/
- Reuters zu den NBIM-Beständen (30.6.2026): https://www.investing.com/news/stock-market-news/norway-wealth-fund-holds-12-billion-stake-in-spacex-4852498
- Norwegische Regierung, Meld. St. 28 (2010–2011): https://www.regjeringen.no/en/documents/meld.-st.-28-20102011/id649699/?ch=1
- Norges Bank, "Managing Norway's oil wealth", 14.4.2015: https://www.norges-bank.no/en/news-events/news-publications/Speeches/2015/2015-04-14-Olsen-Roma/

**Die Menschheit als ein Land**
- Weltbank, Einkommensgruppen FY27: https://documents1.worldbank.org/curated/en/099063026190549947/pdf/BOSIB-8ff63426-3c40-412d-bad2-cc20a4ebea81.pdf
- Weltbank, GNI per capita, Atlas method (NY.GNP.PCAP.CD): https://data.worldbank.org/indicator/NY.GNP.PCAP.CD

**Bewertung der KI-Labore**
- OpenAI, Finanzierungsrunde 31.3.2026: https://openai.com/index/accelerating-the-next-phase-ai/
- UN World Population Prospects: https://population.un.org/wpp/

**Erste Saat**
- NPR, Intel-Beteiligung, 22.8.2025: https://www.wfae.org/2025-08-22/intel-will-give-the-u-s-government-a-10-stake-trump-says
- Asia Economy, Lee Jae-myung, 2.3.2025: https://view.asiae.co.kr/en/article/2025030218034250527
- Trump-Konten (ABC7): https://abc7.com/story/trump-accounts-start-july-4-what-parents-need-know/19440606/
- Trump-Konten, automatische Eröffnung (KTVU/FOX): https://www.ktvu.com/news/treasury-moves-automatically-enroll-millions-children-trump-accounts

**Mitwachsen**
- OpenAI, Umbau und Stiftung, 28.10.2025: https://openai.com/index/built-to-benefit-everyone/
- O'Keefe u. a., The Windfall Clause (Oxford, 2020): https://arxiv.org/abs/1912.11595

**Ernten**
- BAFU, Rückverteilung der CO2-Abgabe: https://www.bafu.admin.ch/de/co2-abgabe-private
- UN-Steuerkonvention (Verhandlungsausschuss): https://financing.desa.un.org/unfcitc
- EY zum Entwurf der Konvention und der Protokolle, 2026: https://globaltaxnews.ey.com/news/2026-1618-un-releases-draft-framework-convention-on-international-tax-cooperation-and-two-early-protocols
- Eurodad, Ausstieg der USA, Februar 2025: https://www.eurodad.org/us-walks-out-tax-convention
- Weltbank, Global Findex 2025: https://www.worldbank.org/en/news/press-release/2025/07/16/mobile-phone-technology-powers-saving-surge-in-developing-economies
- Trump, 5.000-$-"Dividende": https://wjla.com/news/nation-world/trump-dividend-promise-gets-mixed-reviews-democrats-republicans

**Das Erbe**
- Thomas Paine, *Agrarian Justice* (1797), Volltext: https://ushistory.org/PAINE/agrarian/

**Ideen zum Geldschaffen**
- Emad Mostaque im Podcast The Cognitive Revolution: https://www.cognitiverevolution.ai/the-machines-are-taking-our-jobs-thank-god-emad-mostaques-guide-to-the-next-1000-days/

---

## 6. Nachtrag Fassung 3 (20.10.2026 vormittags): Sanders fair erzählt

Jakob wollte nicht, dass Sanders' Idee wie „den Reichen etwas wegnehmen“ klingt. Geprüft sind die geänderten Zeilen in `film-05-vo-v3.txt` (Zeile 51 bis 57) und die neuen Bildschirmtexte.

| Zeile (v3) | Behauptung | Befund | Urteil | Quelle |
|---|---|---|---|---|
| 51 | "The first is to own." | Name des Wegs: Die Allgemeinheit wird über einen öffentlichen Fonds Miteigentümerin. Keine Tatsachenbehauptung. | ok | – |
| 54 | "Every year, that fund would pay every American the same dividend." | Laut Entwurf schüttet der Fonds jedes Jahr 5 % aus, zu gleichen Teilen an alle Amerikaner. Sanders schätzt das auf etwa 1.000 $ pro Person und Jahr. | ok | Roll Call, 18.6.2026: https://rollcall.com/2026/06/18/sovereign-wealth-fund-tax-on-ai-companies-unveiled-by-sanders/ |
| Bild 2.05 | "EVERY YEAR, ROUGHLY $1,000 · FOR EVERY AMERICAN, THE SAME", Quellzeile "Estimate by Sanders' office, June 2026" | Schätzung von Sanders, kein Gesetzestext, im Bild als Schätzung gekennzeichnet. Die Reason-Schlagzeile sagt fälschlich „a month“, deshalb steht Roll Call als Quelle. | ok | Roll Call (wie oben) |
| Bild 2.02 | "Founders & investors + the public · OWNERS" | Die bisherigen Eigentümer bleiben, die Allgemeinheit kommt über den Fonds als Miteigentümerin dazu. | ok | Reason, 19.6.2026; Roll Call |
| (gestrichen) | "But first, it takes half of what already exists." | Auf Jakobs Wunsch gestrichen. Der Satz war sachlich ok (Verwässerung), betonte aber das Wegnehmen. | – | – |

Unverändert und weiter gültig: Zeile 52 bis 53 und 55 bis 57 (siehe Abschnitt 3, dort Zeile 56 bis 61 der v1). Der Leitsatz „We don't have to take what anyone already has“ (Anfang und Schluss) bleibt. Punkt 8 in Abschnitt 4 gilt weiter.
