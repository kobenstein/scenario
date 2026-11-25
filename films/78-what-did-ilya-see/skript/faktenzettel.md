# Faktenzettel · #78 „What Did Ilya See?“

Stand: Mittwoch, 25.11.2026 (Recherche 24.–25.11.2026). Für den Texter. Die Stationen folgen `skript/geruest-v1.md` (Hook, Station 1–5, Schluss). O-Töne, Zitatkarten, Videos zum Meiden und der Clip-Anteil stehen in `recherche/clips.json`.

**Sicherheit:**
- **sicher** = Primärquelle (Video, Untertitel, offizielle Mitteilung) oder mehrere unabhängige Berichte.
- **umstritten** = Quellen widersprechen sich, also vorsichtig formulieren.
- **dünn** = nur eine Quelle, nur Firmenangabe oder nur ein Suchauszug. Im Faktencheck am Original prüfen oder weglassen.

**Art:**
- **Fakt** = ist passiert oder wurde gesagt.
- **Schätzung** = Zahl, die jemand berechnet oder meldet, ohne dass sie bestätigt ist.
- **Prognose** = Vorhersage, Ziel oder Plan.
- **Rechnung** = eigene Umrechnung für den Du-Bezug.

**Quellenlage:**
- *Nicht erreichbar:* Aus der Cloud kam ich an keine Webseite außer YouTube heran. WebFetch fand die Namen nicht (fortune.com, lesswrong.com), und curl bekam von allen anderen Seiten keine Antwort, auch von den beiden PDF-Fassungen des Aussageprotokolls (courtlistener.com, chatgptiseatingtheworld.com). Alle Web-Inhalte stammen deshalb aus Suchauszügen (Websuche 24.–25.11.2026). Zitate aus dem Aussageprotokoll und aus dem Prozess sind Berichte über die Quelle, nicht die Quelle selbst.
- *Selbst geprüft:* Die YouTube-Untertitel ließen sich mit Wartezeiten (Bot-Prüfung) laden: Toronto (Untertitel der U of T und automatische Wortzeiten), Dwarkesh (Untertitel des Kanals), NeurIPS 2024 (Reupload) und Open University of Israel. Diese Wortlaute sind am Untertitel geprüft, den Ton habe ich nicht gehört.
- *Nicht nutzbar:* vidIQ hat 0 Guthaben.
- *Frühere Filme:* Durchsucht habe ich nur die Dateien der ersten Ebene von `scenario/film-*/`, nach „Sutskever|Ilya“.

**Ton:**
- Staunen (§1.1), kein Doom. Den Bunker nur streifen (§1.3).
- Keine Bösewichte (§1.7): Altman, Murati, Toner und Brockman sind Menschen in einem Streit. Kein Gericht hat über die Vorwürfe im Memo entschieden (F8).
- Ilya ist Chef einer Firma, deren Wert an seiner These hängt (§1.9a). Das gehört einmal in den Satz vor seiner Prognose.
- Kein Jensen Huang, auch nicht im Bild (§2.5f).
- Keine Medizin-Station (§2.5c).
- Anthropic nicht erwähnen (§1.10).

---

## 0 · Bitte zuerst lesen: Korrekturen am Gerüst und Überschneidungen

1. **„Drei Jahre später, unter Eid, kam die Antwort“ (Hook 30–50 s) stimmt so nicht.** Die erste offizielle Antwort kam schon nach knapp vier Monaten. Am 8.3.2024 veröffentlichte OpenAI die Zusammenfassung der Prüfung durch die Kanzlei WilmerHale. Danach ging es weder um Produktsicherheit noch um Tempo oder Finanzen, sondern um einen Vertrauensbruch zwischen dem alten Board und Altman (F5). Unter Eid kamen dann die Einzelheiten: in der Aussage vom 1.10.2025, knapp zwei Jahre später (Protokoll Anfang Nov. 2025 öffentlich, F6), und im Prozess in Oakland am 11.5.2026, zweieinhalb Jahre später (F7).
   - **Vorschlag:** „Two years later, under oath …“ oder „This May, in a courtroom in Oakland …“.
   - Das stärkt Leitgedanke A: Die Antwort lag schon 2024 offen.
2. **„Hat den Chef gefeuert“ (Hook 3–30 s) heißt genau:** Vier der sechs Board-Mitglieder beschlossen die Entlassung, und Ilya überbrachte sie Altman per Google Meet (F1).
   - **Vorschlag:** „led the move“, „was one of the four who voted“ oder „was the one who told him“, nicht „he fired him“ allein.
3. **Q* ist nicht die Antwort.** Reuters meldete am 22.11.2023 einen Warnbrief von Forschern über einen Durchbruch. Andere Berichte sagen, das Board habe so einen Brief nie bekommen, und die WilmerHale-Prüfung nennt keinen Sicherheitsgrund (F3, F5).
   - **Vorschlag:** Q* als das erzählen, was die Welt vermutete („rumours of a secret breakthrough“), nicht als Grund.
4. **„Jedes Mal belächelt, jedes Mal recht“ (Station 2) ist so nicht belegt.**
   - Belegt ist, dass er früh dran war. Seine Folie von 2014 sagt: „if you have a very big data set and you train a very very big neural network, then success is guaranteed“ (F12).
   - Belegt ist auch, dass er das Verdienst teilt: Er nennt Radford, Kaplan und Amodei.
   - Dass man ihn jedes Mal auslachte, habe ich nicht gefunden.
   - **Vorschlag:** „He called it early. Again and again.“
5. **„Pretraining endet“ (2024) ist eine Vorhersage, kein Treffer.** Im Nov. 2025 schwächte er selbst ab: Skalieren werde weiter Fortschritte bringen, aber etwas Wichtiges fehle (F13). Im Dwarkesh-Gespräch sagt er sogar: „maybe it appears that Gemini have found a way to get more out of pre-training“.
   - **Vorschlag:** In Station 2 als seine neueste Vorhersage erzählen, ausdrücklich offen.
6. **5 bis 20 Jahre: genau sagen, wofür.** Dwarkesh fragt nach einem System, „which can learn as well as a human and subsequently, as a result, become superhuman“. Ilya antwortet: „I think like 5 to 20.“ Das Wort „years“ sagt Dwarkesh, Ilya bestätigt mit „Mhm.“ (F16).
   - **Vermeiden:** „AGI in 5 to 20 years“ und „AI will do everything in 5 to 20 years“. In Toronto lehnte er ausdrücklich ab, eine Zahl zu nennen (F15).
7. **Station 5 „dann wären Menschen eine Minderheit“ ist Dwarkeshs Einwand, nicht Ilyas Aussage.** Der Satzbau zeigt es: „So even if you got an AI to care about sentient beings — and it's not actually clear to me that that's what you should try to do if you solved alignment — it would still be the case that most sentient beings will be AIs. There will be trillions, eventually quadrillions, of AIs. Humans will be a very small fraction of sentient beings.“ Ilya antwortet darauf: „It's true. It's possible it's not the best criterion.“ (F23).
   - Die Untertitel nennen keine Sprecher. Im Faktencheck am Transkript mit Namen auf dwarkesh.com prüfen.
   - Suchauszüge, die die „quadrillions“ Ilya zuschreiben, sind falsch.
8. **Bunker nur als Rückgriff.** #72 hat den Satz im Hook und „optional“ in Station 2 (`film-bunker/vo-v2.txt`). Hier höchstens ein Halbsatz ohne Zitatkarte (F9).
9. **Thumbnail C „HE WALKED AWAY FROM OPENAI“ stimmt:** Er verließ OpenAI am 14.5.2024 mit eigenem Post (F18). Vor Gericht sagte er aber, dass er weiter OpenAI-Anteile im Wert von rund 7 Mrd. $ hält (F7).
   - **Vermeiden:** „he left it all behind“.
10. **SSI hat bis heute nichts veröffentlicht:** kein Modell, kein Produkt, kein Fachartikel (F22).
    - Seine eigene Formel von 2024: „its first product will be the safe superintelligence, and it will not do anything else up until then“ (F19).
    - Gavin Baker behauptete einen Start im August 2026. Der fand nicht statt.
11. **Seit Juli 2026 habe ich keine neue öffentliche Aussage von Ilya gefunden.** Die letzten waren die Nvidia-Mitteilung (27.7.2026) und davor der Prozess (Mai 2026).
    - Das Frischeste zum Thema sind der Film „Artificial“ (Weltpremiere 5.10.2026, Kinostart 25.12.2026), der Nvidia-Deal und der NAS-Preis 2026 (F21, F26, S4).
    - Die frischen Belege im Hook sind deshalb Film und Gerichtssaal, kein neues Interview.
12. **„Artificial“ ist rot (Film):** keine Trailer-Ausschnitte, keine Standbilder, im Sprechtext nur als Anlass in einem Satz. Rezensionen nennen Yura Borisovs Ilya das Gewissen des Films. Das passt zum Ton, ist aber nur Rezensionsstimme (F26).
13. **Überschneidungen mit früheren Filmen:**
    - #Blase: Sprechtext Zeile 47 nutzt Ilyas Skalierungs-These ohne Namen (`film-blase/faktencheck.md` Nr. 32).
    - #02: nennt Reuters (Nov. 2024) nur in `sources.md`.
    - `film-erster-tag/vo-v1.txt` hatte den „very capable fifteen-year-old“. In v2 ist er gestrichen, also frei.
    - Noch in keinem Sprechtext: Toronto-Rede, NeurIPS-Folien, Open-University-Rede, Meta-Angebot, Aussage und Prozess, NAS-Preis.
    - #77 hat Goods „last invention“. Nicht wiederholen.
14. **Kenner-Test (§6.3) offen:** Was der stärkste Konkurrent „What Did Ilya See?“ (Run The Numbers, 1,09 Mio.) als Antwort gibt, konnte ich nicht prüfen (keine Untertitel geladen). Laut Marktcheck gibt niemand die Antwort aus dem Gerichtssaal.

---

## Hook (0–60 s)

**F1 · Die Entlassung, 17.11.2023** · Fakt · sicher
- **Mitteilung des Boards:** Altman „was not consistently candid in his communications with the board, hindering its ability to exercise its responsibilities. The board no longer has confidence in his ability to continue leading OpenAI.“ Mira Murati, damals Technikchefin (CTO), wurde Interims-Chefin.
- **Wer abstimmte:** Das Board hatte sechs Mitglieder: Altman, Brockman, Sutskever, D'Angelo, McCauley und Toner. Vier davon beschlossen die Entlassung, darunter Ilya.
- **Wie es Altman erfuhr:** Laut Brockmans eigener Schilderung (18.11.2023) bat Ilya Altman per SMS um ein Gespräch am Freitagmittag. Im Google Meet saß das ganze Board außer Brockman, und Ilya sagte Altman, dass er entlassen sei.

Quellen:
- [OpenAI 17.11.2023](https://openai.com/index/openai-announces-leadership-transition/)
- [NPR 17.11.2023](https://www.npr.org/2023/11/17/1213892587/chatgpt-open-ai-ceo-sam-altman-ousted)
- [CNBC 18.11.2023 (Board)](https://www.cnbc.com/2023/11/18/heres-whos-on-openais-board-the-group-behind-sam-altmans-ouster.html)
- [Fortune 18.11.2023 (Ablauf)](https://fortune.com/2023/11/18/how-did-openai-fire-sam-altman-greg-brockman-rogue-board/)

Sag: „In November 2023, the board of the world's most famous AI company fired its CEO. The man who told him was its chief scientist: Ilya Sutskever.“

Achtung: Die OpenAI-Adresse habe ich nach dem üblichen Muster ergänzt und nicht aufgerufen (ältere Form `openai.com/blog/openai-announces-leadership-transition`), also im Faktencheck öffnen. Brockman ist Partei, seine Schilderung blieb aber unwidersprochen.

**F2 · Die Frage „What did Ilya see?“** · Fakt · Wortlaut sicher, Datum dünn
- **Andreessen auf X:** „Seriously though — what did Ilya see?“
- **Musks Antwort:** „Yeah! Something scared Ilya enough to want to fire Sam.“
- **Musk schon um den 19.11.2023:** „I am very worried. Ilya has a good moral compass and does not seek power. He would not take such drastic action unless he felt it was absolutely necessary.“
- **Bis heute ein Meme:** Das stärkste Video dazu, Run The Numbers (1.3.2026), hat 1,09 Mio. Aufrufe (`markt-youtube-2026-11-24.json`).

Quellen:
- [Fortune 25.11.2023 (Steve Mollman)](https://fortune.com/2023/11/25/elon-musk-what-scared-ilya-sutskever-openai-sam-altman-return/)
- [Benzinga Nov. 2023](https://in.benzinga.com/news/23/11/35867612/elon-musk-very-worried-about-openai-boardroom-battle-ilya-sutskever-wouldnt-take-such-drastic-action)
- [Fortune 18.11.2023](https://fortune.com/2023/11/18/elon-musk-ilya-sutskever-openai-leadership-upheaval-sam-altman/)

Sag: „And the whole internet asked one question: What did Ilya see?“

Achtung: Das Datum des Andreessen-Posts habe ich nicht gefunden (vermutlich 24. oder 25.11.2023), also im Film kein Datum nennen. Andreessen ist als Meme-Zitat gelb (Personen-Check), Musk nur mit Jakobs OK. Ohne die beiden Namen trägt der Satz auch.

**F3 · Was die Welt vermutete: ein geheimer Durchbruch (Q*)** · umstritten
- **Reuters, 22.11.2023:** Mehrere Forscher hätten dem Board einen Brief geschrieben, „warning of a powerful artificial intelligence discovery that they said could threaten humanity“. Das interne Projekt hieß Q*.
- **Widerspruch:** Andere Berichte sagen, das Board habe so einen Brief nie erhalten. WilmerHale nennt keinen Sicherheitsgrund (F5).

Quellen:
- [CNBC/Reuters 22.11.2023](https://www.cnbc.com/amp/2023/11/22/sam-altmans-ouster-at-openai-precipitated-by-letter-to-board-about-ai-breakthrough-sources-tell-reuters.html)
- [Fortune 23.11.2023](https://fortune.com/2023/11/23/openai-sam-altman-board-directors-agi-breakthrough-reuters/)
- [RNZ](https://www.rnz.co.nz/news/world/503100/openai-s-latest-breakthrough-a-threat-to-humanity-board-heard)

Sag: „There were rumours of a secret breakthrough. A machine so powerful it had scared its own maker.“ Danach die Wendung.

Achtung: Q* nie als Tatsache oder Grund erzählen. Den Bericht der The Verge habe ich nur als Auszug gesehen (dünn).

**F4 · Fünf Tage** · Fakt · sicher
- **20.11.2023, der Brief:** Mehr als 700 von rund 770 Beschäftigten drohten, zu Microsoft zu wechseln, wenn das Board nicht zurücktritt. Ilya unterschrieb ebenfalls.
- **20.11.2023, Ilya auf X:** „I deeply regret my participation in the board's actions. I never intended to harm OpenAI. I love everything we've built together and I will do everything I can to reunite the company.“
- **21./22.11.2023, die Rückkehr:** Einigung über Altmans Rückkehr mit neuem Board (Taylor, Summers, D'Angelo). Ilya schied aus dem Board aus.

Quellen:
- [Fortune 20.11.2023](https://fortune.com/2023/11/20/ilya-sutskever-openai-cofounder-deeply-regrets-resign/)
- [Business Insider](https://businessinsider.in/tech/news/openai-cofounder-and-chief-scientist-says-he-deeply-regrets-participating-in-ousting-sam-altman/amp_articleshow/105362637.cms)
- [Bloomberg 20.11.2023](https://www.bloomberg.com/news/articles/2023-11-20/openai-staff-threaten-to-go-to-microsoft-if-board-doesn-t-quit)

Sag: „Five days later, Altman was back. And Ilya wrote: 'I deeply regret my participation in the board's actions.'“

Achtung: Der Reue-Post ist eine Zitatkarte (Z3). Ob „700“ oder „more than 700“: im Faktencheck am Brief prüfen.

**F5 · Die erste Antwort, März 2024: kein Sicherheitsgrund** · Fakt · sicher (Zusammenfassung); Partei
OpenAI veröffentlichte am 8.3.2024 die Zusammenfassung der WilmerHale-Prüfung, beauftragt vom neuen Board.
- **Kein Sicherheitsgrund:** Die Entscheidung entstand nicht aus Sorgen über Produktsicherheit, Entwicklungstempo oder Finanzen.
- **Sondern Vertrauen:** Fortune zitiert „a breakdown in trust between the prior board and Mr. Altman that precipitated the events of Nov. 17“.
- **Bewertung:** Das alte Board habe im Rahmen seines Ermessens gehandelt, Altmans Verhalten habe aber „did not mandate removal“.
- **Nur Zusammenfassung:** Den vollständigen Bericht hat OpenAI nie veröffentlicht.

Quellen:
- [OpenAI 8.3.2024](https://openai.com/index/review-completed-altman-brockman-to-continue-to-lead-openai/)
- [Fortune 8.3.2024](https://fortune.com/2024/03/08/sam-altman-confirms-return-to-openai-board-as-law-firms-review-rips-loss-of-trust-that-led-to-his-sudden-ouster/)
- [Bloomberg 8.3.2024](https://www.bloomberg.com/news/articles/2024-03-08/openai-s-altman-returns-to-board-after-probe-clears-him)

Sag: „Four months later, a law firm said it plainly: this was not about a dangerous machine. It was about trust between people.“

Achtung: Auftraggeber war das neue Board (Partei, §1.9a), und den Wortlaut kenne ich nur aus Auszügen. Für den Film reicht die Kernaussage.

---

## Station 1 – Was er 2023 sah

**F6 · Die Aussage unter Eid, 1.10.2025** · Fakt · sicher (mehrere Berichte über das Protokoll)
Musk gegen OpenAI (Az. 4:24-cv-04722-YGR, Bundesgericht Nordkalifornien), Aussage von rund 10 Stunden. Das Protokoll wurde Anfang Nov. 2025 öffentlich. Was berichtet wird:
- **Das Memo:** 52 Seiten über Altmans Verhalten, auf Bitte der unabhängigen Board-Mitglieder (laut Berichten D'Angelo). Er schickte es als selbstlöschende E-Mail an D'Angelo, Toner und McCauley: „Because I was worried that those memos will somehow leak.“ Die erste Zeile: „Sam exhibits a consistent pattern of lying, undermining his execs, and pitting his execs against one another.“ Ein zweites Memo betraf Brockman.
- **Die Quelle:** „Most of the screenshots that I have that I -- most or all, I don't remember. I get them from Mira Murati.“ Laut Decrypt sagte er auch: „I fully believed the information that Mira was giving me.“
- **Nicht nachgeprüft:** Mit den Betroffenen (u. a. Lightcap und Brockman) sprach er nicht. Laut Decrypt sei ihm das nicht in den Sinn gekommen (Wortlaut dünn). Einiges war Wissen aus zweiter Hand.
- **Wie lange er es erwog:** „At least a year.“
- **Worauf er wartete:** „That the majority of the board is not obviously friendly with Sam.“
- **Das Verfahren:** „One thing I can say is that the process was rushed.“ – „I think it was rushed because the board was inexperienced.“ – „In board matters.“

Quellen:
- [Slashdot/The Verge 6.11.2025](https://tech.slashdot.org/story/25/11/06/2344248)
- [Decrypt](https://decrypt.co/347349/inside-deposition-showed-openai-nearly-destroyed-itself)
- [Gizmodo](https://gizmodo.com/former-openai-exec-explains-why-he-tried-to-do-a-coup-against-sam-altman-2000680769)
- [Abschrift auf LessWrong](https://www.lesswrong.com/posts/9mp6vBwxitoZcvDmG/ilya-sutskever-deposition-transcript)
- [Protokoll (PDF)](https://chatgptiseatingtheworld.com/wp-content/uploads/2025/11/Ilya-Sutsekever-Deposition.df_.pdf)
- [Marketing AI Institute (Toners Widerspruch)](https://www.marketingaiinstitute.com/blog/openai-bombshell-deposition)

Sag: „Two years later, under oath, he told the story. He had written a 52-page memo about one man. Almost all of it came from one colleague. He didn't check it with anyone else. And he said: 'the process was rushed.'“

Achtung:
- „consistent pattern of lying“ nicht als Zitatkarte. Es klingt wie ein Urteil, das nie gefällt wurde (F8, §1.7).
- Murati neutral nennen („a colleague“, „the company's technology chief“). Eine öffentliche Antwort von ihr auf die Aussage habe ich nicht gefunden.
- Die Fusionsgespräche mit Anthropic im Nov. 2023 kommen in der Aussage auch vor, und Toner bestreitet seine Darstellung. Weglassen (§1.10).
- Ein Video der Aussage habe ich nicht gefunden, also Zitatkarte (Z4).

**F7 · Vor Gericht, 11.5.2026, Oakland** · Fakt · sicher (Agentur und mehrere Berichte)
Zeugenaussage in der dritten Prozesswoche von Musk gegen Altman und OpenAI.
- **Die Anteile:** Er hält OpenAI-Anteile im Wert von rund 7 Mrd. $. Forbes nennt ihn den zweiten neuen Milliardär, der im Prozess sichtbar wurde (nach Brockman).
- **Die Vorgeschichte:** Etwa ein Jahr lang sammelte er Belege für ein „consistent pattern of lying“.
- **Seine Begründung:** „I felt that, had I not done this, the company would be destroyed.“ Und laut Wired: „I felt like I put my life into it, and I simply cared for it, and I didn't want it to be destroyed.“
- **Über Musks Wunsch nach Kontrolle in den Anfangsjahren:** Es „just felt aggressive to me“ (CBS).
- **Danach:** Er stimmte später selbst für Altmans Rückkehr.

Quellen:
- [Reuters via TradingView 11.5.2026](https://www.tradingview.com/news/reuters.com,2026:newsml_L4N41O1G8:0-former-openai-executive-sutskever-discloses-nearly-7-billion-stake-in-ai-firm/)
- [WTVBAM (Reuters)](https://wtvbam.com/2026/05/11/former-openai-executive-sutskever-discloses-nearly-7-billion-stake-in-ai-firm/)
- [Forbes 11.5.2026](https://www.forbes.com/sites/aliciapark/2026/05/11/ilya-sutskever-testifies-he-holds-7-billion-openai-stake-second-new-billionaire-revealed-in-musk-altman-trial/)
- [Wired via dnyuz 12.5.2026](https://dnyuz.com/2026/05/12/ilya-sutskever-stands-by-his-role-in-sam-altmans-openai-ouster-i-didnt-want-it-to-be-destroyed/)
- [CBS](https://www.cbsnews.com/sanfrancisco/news/sam-altman-elon-musk-trial-openai-chief-takes-stand/)
- [ABC7 Liveblog](https://www.abc7news.com/live-updates/elon-musk-sam-altman-live-updates-microsoft-ceo-satya-nadella-testify-week-3-trial-begins/19080697/)
- [chatgptiseatingtheworld 12.5.2026](https://chatgptiseatingtheworld.com/2026/05/12/musk-v-altman-trial-week-3-ilya-sutskever-provides-captivating-testimony-favorable-to-openai/)

Sag: „This May, in a courtroom in Oakland, he explained why: 'had I not done this, the company would be destroyed.'“

Achtung:
- Die Wortlaute stammen aus Agentur und Wired, nicht aus dem Gerichtsprotokoll.
- Im Bundesgericht gibt es keine Kameras, also nur Zitatkarte (Z5).
- Die 7 Mrd. $ nicht als Spitze einsetzen. Nur sachlich erwähnen, falls Thumbnail C erklärt werden muss.

**F8 · Das Urteil entschied die Frage nicht** · Fakt · sicher
Am 18.5.2026 befand die beratende Jury einstimmig, dass Musks Ansprüche zu spät eingereicht wurden. Richterin Yvonne Gonzalez Rogers übernahm das, Musk geht in Berufung. Ob die Vorwürfe gegen Altman zutreffen, hat kein Gericht geprüft.

Quellen:
- [Al Jazeera 18.5.2026](https://www.aljazeera.com/news/2026/5/18/elon-musk-loses-lawsuit-against-openai)
- [PBS](https://www.pbs.org/newshour/nation/jury-sides-with-openai-saying-elon-musks-lawsuit-was-not-filed-on-time)
- [CTV](https://www.ctvnews.ca/business/article/jury-rules-against-elon-musk-in-openai-lawsuit/)

Achtung: Das ist der Fairness-Satz für Station 1: „No court ever ruled on who was right. What we know is that it was a fight between people.“

**F9 · Der Bunker-Satz (nur Rückgriff)** · Fakt · sicher
Sommer 2023, vor neuen Forschern bei OpenAI: „We're definitely going to build a bunker before we release AGI.“

Quellen: Karen Hao, „Empire of AI“ (Mai 2025) · [Fortune 20.5.2025](https://fortune.com/2025/05/20/chatgpt-openai-ilya-sutskever-chief-scientist-planneddoomsday-bunker-agi/) (siehe `film-bunker/faktenzettel.md` F1)

Achtung: Gehört #72. Hier nur ein Halbsatz ohne Karte und ohne Deutung, z. B. „the same man who, that summer, had talked about a bunker“.

**F10 · Was er 2023 schon öffentlich sagte** · Fakt · Juli sicher; Oktober Wortlaut dünn
- **5.7.2023:** OpenAI kündigt das Superalignment-Team an, Autoren Jan Leike und Ilya Sutskever. Überintelligente KI könne „within the decade“ kommen (Wortlaut laut TechCrunch). 20 % der Rechenleistung für vier Jahre gingen an das Team.
- **26.10.2023, drei Wochen vor der Entlassung, in der MIT Technology Review:** „It's going to be monumental, earth-shattering. There will be a before and an after.“ Seine neue Priorität sei, zu verhindern, dass eine künftige KI außer Kontrolle gerät.

Quellen:
- [OpenAI 5.7.2023](https://openai.com/index/introducing-superalignment/)
- [TechCrunch 5.7.2023](https://techcrunch.com/2023/07/05/openai-is-forming-a-new-team-to-bring-superintelligent-ai-under-control/)
- [MIT Technology Review 26.10.2023 (Will Douglas Heaven)](https://www.technologyreview.com/2023/10/26/1082398/exclusive-ilya-sutskever-openais-chief-scientist-on-his-hopes-and-fears-for-the-future-of-ai/)

Sag: „And the strange thing is: he had already told us. Three weeks before the firing, he said: 'There will be a before and an after.'“

Achtung: Das ist der stärkste Beleg für „never hidden“, schon vor dem Rätsel. Beide Wortlaute im Faktencheck am Original prüfen. Die Superalignment-Mitteilung spricht auch von Auslöschung (Doom-nah, §1.3), also nur den Zeitsatz nehmen.

---

## Station 2 – Warum man ihm zuhören sollte (B)

**F11 · 2012: AlexNet** · Fakt · sicher
- **Das Ergebnis:** Krizhevsky, Sutskever und Hinton gewannen die ImageNet-Challenge 2012 mit 15,3 % Fehlern (Top-5). Das zweitbeste System hatte 26,2 %.
- **Die Technik:** zwei Grafikkarten (GTX 580), fünf bis sechs Tage Training.
- **Seine eigene Erzählung (Open University 2025):** „As a result of the AlexNet paper that we wrote in grad school, some companies expressed a desire to acquire our company which didn't exist … and eventually Google acquired us.“
- **Code freigegeben:** Das Computer History Museum veröffentlichte am 20.3.2025 den Original-Code.

Quellen:
- [CACM (Paper)](https://cacm.acm.org/research/imagenet-classification-with-deep-convolutional-neural-networks)
- [CHM 20.3.2025](https://computerhistory.org/blog/chm-releases-alexnet-source-code/)
- [Open University (YouTube t3TfmU0l5vM, 01:40–01:56)](https://www.youtube.com/watch?v=t3TfmU0l5vM)

Sag: „In 2012, he and two colleagues built a program that looked at photos. The best rival got 26 out of 100 wrong. Theirs: 15.“

Achtung: „Im Schlafzimmer bei den Eltern“ war Krizhevskys Zimmer, nicht Ilyas (nur Wikipedia-Spiegel, dünn), also nicht verwenden. Im Untertitel steht „expressed in a desire“, gemeint ist „expressed a desire“.

**F12 · 2014: Seine Wette auf einer Folie** · Fakt · sicher (eigene Worte, Untertitel)
- **Das Paper:** Sequence to Sequence (Sutskever, Vinyals, Le, 2014). Es erhielt im Dez. 2024 den NeurIPS-Preis Test of Time, zusammen mit dem GAN-Paper.
- **Die Folie von 2014, gezeigt bei NeurIPS am 13.12.2024 in Vancouver:**
  - Die These: „if you have a large neural network with 10 layers, then it can do anything that a human being can do in a fraction of a second.“
  - Die Schlussfolie: „That if you have a very big data set and you train a very very big neural network, then success is guaranteed.“ Dazu: „And one can argue, if one is charitable, that this indeed has been what's been happening.“ (Clip C1)
- **Danach:** „the age of pre-training … the GPT-2 model, the GPT-3 model, the scaling laws“. Ausdrücklicher Dank an „Alec Radford, also Jared Kaplan, Dario Amodei, for really making this work“.
- **GPT:** Ilya ist Mitautor von GPT-1 (2018) und GPT-2 (2019). Bei ChatGPT (30.11.2022) und GPT-4 war er Chief Scientist (Chefwissenschaftler) von OpenAI.

Quellen:
- [NeurIPS-Blog 27.11.2024](https://blog.neurips.cc/2024/11/27/announcing-the-neurips-2024-test-of-time-paper-awards/)
- [NeurIPS virtuell](https://neurips.cc/virtual/2024/test-of-time/105032)
- [YouTube 1yvBqasHLZs (Reupload)](https://www.youtube.com/watch?v=1yvBqasHLZs), 02:00–03:02 und 05:46–05:59

Sag: „In 2014, he put his bet on a slide: a very big network, a lot of data, and 'success is guaranteed'. Ten years later, he showed that slide again.“

Achtung:
- Nicht sagen „he invented ChatGPT“. Er teilt das Verdienst selbst.
- Nicht sagen „10 layers can do anything a human can do“. Die Einschränkung „in a fraction of a second“ gehört dazu.
- Die Zitationszahl (laut NeurIPS-Blog über 27.000) habe ich nur aus dem Auszug.

**F13 · Dez. 2024: Seine neueste Vorhersage** · Prognose · Wortlaut sicher
- **NeurIPS, 13.12.2024:**
  - „But pre-training as we know it will unquestionably end. Pre-training will end.“
  - „The data is not growing because we have but one internet. … you can even go as far as to say that data is the fossil fuel of AI.“
  - „And the thing about superintelligence is that it will be different qualitatively from what we have.“
  - „They will understand things from limited data. They will not get confused. … I'm not saying how, by the way, and I'm not saying when. I'm saying that it will.“
- **Dwarkesh, 25.11.2025:** „Up until 2020, from 2012 to 2020, it was the age of research. Now, from 2020 to 2025, it was the age of scaling — maybe plus or minus … But is the belief that if you just 100x the scale, everything would be transformed? I don't think that's true. So it's back to the age of research again, just with big computers.“

Quellen:
- [Reuters via RNZ 14.12.2024](https://www.rnz.co.nz/news/world/536689/ai-with-reasoning-power-will-be-less-predictable-ilya-sutskever-says)
- [The Decoder](https://the-decoder.com/openai-co-founder-predicts-a-new-ai-age-of-discovery-as-llm-scaling-hits-a-wall/)
- [YouTube 1yvBqasHLZs](https://www.youtube.com/watch?v=1yvBqasHLZs), 07:56–08:33 und 15:24–15:36
- [YouTube aR20FWCCjAs](https://www.youtube.com/watch?v=aR20FWCCjAs), 00:21:15–00:22:10

Sag: „And then he made his next call: 'Pre-training will end.' The internet is the fuel. And there is only one internet.“

Achtung: Das ist eine Prognose, und es gibt Gegenstimmen (G4, G5). Ende Nov. 2025 schrieb er auf X, das jetzige Vorgehen werde weiter besser werden und „won't stall“, aber etwas Wichtiges fehle (laut The Decoder, Wortlaut des Posts nicht gesehen). Im Dwarkesh-Gespräch räumt er ein: „maybe it appears that Gemini have found a way to get more out of pre-training“.

**F14 · Reserve: „slightly conscious“ (9.2.2022)** · Fakt · sicher
Auf X: „it may be that today's large neural networks are slightly conscious“.

Quelle: [Quote Investigator](https://quoteinvestigator.com/2022/10/05/ai-conscious/)

Achtung: Polarisiert und gehört nicht zur These. Nur, falls Station 5 einen Beleg braucht, dass er lange über Bewusstsein in Maschinen nachdenkt.

---

## Station 3 – Die offene Antwort (Titel-Einlösung)

**F15 · Toronto, 6.6.2025: „the day will come“** · Fakt (Rede) und Prognose (Inhalt) · sicher (offizielles Video, Untertitel der U of T, Wortzeiten)
Ehrendoktor der University of Toronto, in der Convocation Hall: „Almost to this day, 20 years ago, I received my bachelor's degree from the University of Toronto in this exact hall.“

Wörtlich:
- „Right now you all live, we all live, in the most unusual time ever.“ (03:35–03:41)
- Zur Frage, wann: „some people say it's in three, some people say it's in five, ten, numbers are being thrown around. It's a bit hard to predict the future.“ In Toronto nennt er also bewusst keine Zahl.
- „But slowly but surely, or maybe not so slowly, AI will keep getting better. And the day will come when AI will do all of our, all the things that we can do. Not just some of them, but all of them. Anything which I can learn, anything which any, any one of you can learn, the AI could do as well.“ (05:51.7–06:09.5; Clip C2 = 05:56.8–06:03.7)
- „We have a brain. The brain is a biological computer. So why can't the digital computer, a digital brain, do the same things?“ (06:24.6–06:31.6)
- „you may not take interest in politics but politics will take interest in you. So the same applies to AI many times over.“ (07:56.7–08:04.9)
- „And the challenge that AI poses in some sense is the greatest challenge of humanity ever. And overcoming it will also have the will also bring the greatest reward.“ (09:14.2–09:27.4)
- „whether you like it or not your life is going to be affected by AI to a great extent“ (09:29–09:33)

Quellen:
- [YouTube zuZ2zaotrJs (University of Toronto, 10:06)](https://www.youtube.com/watch?v=zuZ2zaotrJs)
- [U of T News 6.6.2025](https://www.utoronto.ca/news/ilya-sutskever-leader-ai-and-its-responsible-development-receives-u-t-honorary-degree)
- [TechRadar](https://www.techradar.com/pro/quote-of-the-day-by-ex-openai-chief-scientist-and-ssi-co-founder-ilya-sutskever-ai-will-keep-getting-better-and-the-day-will-come-when-ai-will-do-all-the-things-that-we-can-do-a-staggering-prediction-about-a-future-superintelligence)
- [The Decoder](https://the-decoder.com/openai-co-founder-ilya-sutskever-believes-ai-will-shape-everyones-life-whether-you-like-it-or-not/)

Sag: „So what does he actually see coming? He has said it out loud. In front of a hall full of graduates.“ Danach Clip C2, dann: „His reason fits in one line: the brain is a biological computer.“

Achtung:
- Die Zeitmarken stammen aus den automatischen Wortzeiten (±0,2 s). Am Ton prüfen.
- Die Zahl der Zuhörer ist nicht gezählt, also keine Zahl nennen.
- Er sprach als Mitgründer und Chief Scientist von SSI, CEO wurde er erst am 3.7.2025.

**F15b · Toronto, menschlicher Moment (optional)** · Fakt · sicher
Er gibt den Absolventen einen Rat: „accept reality as it is and to try not to regret the past and try to improve the situation.“ Und weiter: „This is a reminder to adopt this mindset as best as one can and also a reminder for myself. Constant struggle.“ (02:27–03:28)

Achtung: Eine schöne Brücke zu „I deeply regret“ (2023). Er sagt aber nicht, dass er 2023 meint. Nur nebeneinanderstellen, nicht deuten.

**F16 · Dwarkesh, 25.11.2025: „5 to 20“** · Prognose · sicher (Untertitel des Kanals)
„Ilya Sutskever – We're moving from the age of scaling to the age of research“, 1:36:04, rund 1,69 Mio. Aufrufe.

Wörtlich:
- **Der Anfang:** „You know what's crazy? That all of this is real.“ [DP: „Meaning what?“] „Don't you think so? All this AI stuff and all this Bay Area… that it's happening. Isn't it straight out of science fiction?“ (00:00–00:14; der Satz „how normal the slow takeoff feels“ ist von Dwarkesh)
- **Was ein Mensch ist:** „a human being is not an AGI … we rely on continual learning.“
- **Der Fünfzehnjährige:** „I produce a superintelligent 15-year-old that's very eager to go. They don't know very much at all, a great student, very eager. You go and be a programmer, you go and be a doctor, go and learn.“ Dwarkesh fasst zusammen: „You're proposing instead a mind which can learn to do every single job, and that is superintelligence.“ Ilya: „Yes.“ (00:50:18–00:51:16)
- **Die Prognose:** [DP] „Speaking of forecasts, what are your forecasts to this system you're describing, which can learn as well as a human and subsequently, as a result, become superhuman?“ [Ilya] „I think like 5 to 20.“ [DP] „5 to 20 years?“ [Ilya] „Mhm.“ (01:22:12–01:22:29; Clip C3 = 01:22:23.8–01:22:28.4)
- **Direkt davor:** „I think that the world will truly change as AI becomes more powerful. I think things will be really different and people will be acting really differently.“ (01:22:00–01:22:11)

Quellen:
- [YouTube aR20FWCCjAs (Dwarkesh Patel)](https://www.youtube.com/watch?v=aR20FWCCjAs)
- [Transkript dwarkesh.com/p/ilya-sutskever-2](https://www.dwarkesh.com/p/ilya-sutskever-2) (nicht erreichbar)

Sag: „A podcaster asked him: when could a machine learn as well as a person, and then better? His answer was five words long.“ Danach Clip C3.

Achtung:
- Siehe 0.6.
- Die Dwarkesh-Zeitmarken sind Cue-Grenzen der Untertitel (±0,5–1 s), Wortzeiten kamen nicht durch (Bot-Prüfung).
- „doctor“ steht nur in einer Aufzählung von Berufen, das ist keine Medizin-Station.
- Der „15-year-old“ ist frei (0.13).

**F17 · Was das für dich heißt** · Rechnung
Wer heute 45 ist, wäre in 5 bis 20 Jahren 50 bis 65, also mitten im Berufsleben. Ilyas eigene Sätze dazu: „politics will take interest in you. So the same applies to AI many times over“ und „your life is going to be affected by AI to a great extent“ (F15).

Sag: „If you're 45 today, five to twenty years is not the far future. It's the rest of your working life.“

Achtung: Das ist eine Rechnung, keine Prognose von ihm. Keine Jobzahlen dazunehmen, die habe ich für diesen Film nicht recherchiert.

**F17b · Übergang zu Station 4: „Holy moly“** · Fakt · sicher (Untertitel); Ton offen
Open University of Israel, Ehrendoktor 2025 (Video des Kanals, 4:03).
- „How can we prepare? We need to prepare. It's not clear how. And then eventually the power of AI is going to be so vast. The idea that an AI can build the next generation of AI, the intelligence explosion. Holy moly, what do you do about that?“ (03:09.45–03:22.55; Clip C4 = 03:13.25–03:22.55)
- Kurz darauf: „It can solve everything, but it can also do everything. and all these questions don't have answers right now.“

Quellen:
- [YouTube t3TfmU0l5vM](https://www.youtube.com/watch?v=t3TfmU0l5vM)
- [Open University, Ehrendoktoren 2025](https://www.openu.ac.il/en/about/honorary/pages/2025.aspx)
- [AFOUI (Zeremonie Mai 2025)](https://afoui.org/honorary-degree-recipients-2025)

Sag: „And he asked the question himself.“ Danach Clip C4, dann: „His answer was to walk away.“

Achtung: Am Anfang und Ende steht „[Music]“. Ob unter der Stimme ein Musikbett liegt, ist offen. Wenn ja, ist der Clip rot (Content ID), dann als Zitatkarte. Das Datum der Zeremonie (Mai 2025) kenne ich nur aus dem Auszug von afoui.org.

---

## Station 4 – Er ging (Thumbnail C)

**F18 · Abschied, 14.5.2024** · Fakt · sicher
Ilya auf X:
- „After almost a decade, I have made the decision to leave OpenAI. The company's trajectory has been nothing short of miraculous, and I'm confident that OpenAI will build AGI that is both safe and beneficial …“
- „I am excited for what comes next — a project that is very personally meaningful to me about which I will share details in due time.“

In derselben Woche ging Jan Leike, der zweite Leiter des Superalignment-Teams.

Quellen:
- [TechCrunch 14.5.2024](https://techcrunch.com/2024/05/14/ilya-sutskever-openai-co-founder-and-longtime-chief-scientist-departs)
- [Gizmodo](https://gizmodo.com/ilya-sutskever-leaves-openai-1851477658)
- [The Decoder](https://the-decoder.com/openai-loses-its-biggest-names-in-ai-safety-as-ilya-sutskever-and-jan-leike-walk-away/)

Sag: „Six months later, he left. His goodbye was kind: he wished OpenAI well. And he said he was leaving for 'a project that is very personally meaningful to me'.“

Achtung: Er verabschiedete sich freundlich und lobte Altman namentlich. Das dient der Fairness (§1.7). Altmans Antwortpost („one of the greatest minds of our generation“, Wortlaut nicht geprüft) nur mit Jakobs OK (Personen-Check).

**F19 · SSI, 19.6.2024** · Fakt · sicher
- **Die Mitteilung auf ssi.inc:** „Superintelligence is within reach.“ „Building safe superintelligence (SSI) is the most important technical problem of our time.“ „We have started the world's first straight-shot SSI lab, with one goal and one product: a safe superintelligence.“
- **Die Gründer:** Ilya mit Daniel Gross und Daniel Levy. Büros in Palo Alto und Tel Aviv.
- **Zu Bloomberg (19.6.2024):** „This company is special in that its first product will be the safe superintelligence, and it will not do anything else up until then.“

Quellen:
- [ssi.inc](https://www.ssi.inc)
- [Bloomberg 19.6.2024](https://www.bloomberg.com/news/articles/2024-06-19/openai-co-founder-plans-new-ai-focused-research-lab)
- [TechCrunch 19.6.2024](https://techcrunch.com/2024/06/19/ilya-sutskever-openais-former-chief-scientist-launches-new-ai-company)
- [Time](https://time.com/6990076/safe-superintelligence-inc-announced)

Sag: „A month later he started a new company. It has one goal. And it promises to sell nothing until it reaches it.“

Achtung: Den Bloomberg-Satz kenne ich aus mehreren Berichten über das Interview (Bezahlschranke), Wortlaut im Faktencheck prüfen.

**F20 · Das Geld und die Stille** · Bewertungen = Schätzung, Meta = Fakt (eigene Worte)
- **4.9.2024:** 1 Mrd. $ bei laut Reuters 5 Mrd. $ Bewertung. SSI hatte da 10 Beschäftigte.
- **April 2025:** 2 Mrd. $ bei 32 Mrd. $ Bewertung (FT und Reuters; die Firma kommentierte nicht). Greenoaks führte die Runde mit 500 Mio. $ (Bloomberg), Alphabet und Nvidia stiegen ein. Google Cloud stellte TPU-Chips bereit (laut Berichten April 2025), seit dem Nvidia-Deal 2026 verlagert sich das laut The Decoder.
- **Laut WSJ (März 2025, via Israel Hayom):** rund 20 Beschäftigte. Bewerber legen ihr Handy in einen Faraday-Käfig, Beschäftigte sollen SSI nicht auf LinkedIn nennen.
- **Das Meta-Angebot, in seinen eigenen Worten (Dwarkesh, 01:19:57–01:20:10):** „The context was that we were fundraising at a $32 billion valuation, and then Meta came in and offered to acquire us, and I said no. But my former cofounder in some sense said yes.“ CNBC meldete den Kaufversuch am 3.7.2025.
- **Gross geht zu Meta:** Seit 29.6.2025 ist er nicht mehr bei SSI. Ilya wurde CEO, Levy Präsident. Ilya auf X am 3.7.2025: „We have the compute, we have the team, and we know what to do.“
- **Über die eigene Firma (Dwarkesh, 01:19:05–01:19:14):** „We are squarely an 'age of research' company. We are making progress. We've actually made quite good progress over the past year.“

Quellen:
- [TechCrunch 4.9.2024](https://techcrunch.com/2024/09/04/ilya-sutskevers-startup-safe-super-intelligence-raises-1b)
- [Bloomberg 4.9.2024](https://www.bloomberg.com/news/articles/2024-09-04/openai-co-founder-raises-1-billion-to-build-safe-powerful-ai)
- [TechCrunch 12.4.2025](https://techcrunch.com/2025/04/12/openai-co-founder-ilya-sutskevers-safe-superintelligence-reportedly-valued-at-32b)
- [Israel Hayom 6.3.2025](https://www.israelhayom.com/2025/03/06/a-secret-ai-startup-in-tel-aviv-got-30b-this-israeli-raised-pioneer-did-it)
- [CNBC 3.7.2025](https://www.cnbc.com/2025/07/03/ilya-sutskever-is-ceo-of-safe-superintelligence-after-meta-hired-gross.html)
- [TechCrunch 3.7.2025](https://techcrunch.com/2025/07/03/ilya-sutskever-will-lead-safe-superintelligence-following-his-ceos-exit)

Sag: „Investors valued it at 32 billion dollars. Meta offered to buy it. He said no.“

Achtung: Die 32 Mrd. $ sind eine gemeldete Bewertung, keine Firmenangabe. Ilya bestätigt im Dwarkesh-Gespräch selbst „fundraising at a $32 billion valuation“. Seit Juli 2026 ist keine neue Bewertung bekannt.

**F21 · Nvidia, 27.7.2026** · Fakt · Mitteilung sicher, Betrag offen
- **Die Mitteilung von Nvidia und SSI:** eine langfristige Partnerschaft. SSI bekommt Zugang zu Vera-Rubin-Systemen, die Rechenleistung steigt um eine Größenordnung (×10). Nvidia „has additionally made an investment in SSI“, ohne Betrag.
- **Ilya darin:** „We have research that is worthy of scaling up, and having access to a big NVIDIA computer will let us do so.“
- **Der Betrag:** DCD und andere nennen unter Berufung auf Bloomberg bis zu 5 Mrd. $ (dünn).

Quellen:
- [Nvidia Newsroom 27.7.2026](https://nvidianews.nvidia.com/news/ilya-sutskevers-safe-superintelligence-inc-and-nvidia-announce-long-term-strategic-partnership)
- [Nvidia Investor Relations](https://investor.nvidia.com/news/press-release-details/2026/Ilya-Sutskevers-Safe-Superintelligence-Inc--and-NVIDIA-Announce-Long-Term-Strategic-Partnership/default.aspx)
- [TechCrunch 27.7.2026](https://techcrunch.com/2026/07/27/ilya-sutskevers-safe-superintelligence-partners-with-nvidia-to-scale-its-ai-research/)
- [DCD](https://www.datacenterdynamics.com/en/news/nvidia-to-invest-5bn-in-safe-superintelligence-sutskever-firm-to-substantially-increase-gpu-compute/)
- [The Decoder](https://the-decoder.com/nvidia-invests-in-ilya-sutskevers-ai-lab-shifting-ssi-away-from-google-chips/)

Sag: „And this summer, the world's most valuable chipmaker bet on him too. On a company that has never shown anything.“

Achtung:
- Kein Huang-Zitat, kein Huang-Bild (§2.5f).
- Keinen Betrag nennen.
- Nvidia ist Partei, denn sie verkauft die Rechner.
- Den zweiten Ilya-Satz der Mitteilung („big bet on the Vera Rubin platform …“) habe ich nur bruchstückhaft, also weglassen.

**F22 · Stand November 2026** · Fakt · sicher (mehrere Berichte; Abwesenheit ist schwer zu beweisen)
- **Nichts veröffentlicht:** Bis heute kein Modell, keine Schnittstelle, kein Fachartikel. AI Magazine (21.10.2026): „never released a model, a product or a paper“, Bewertung weiter 32 Mrd. $.
- **Gerücht nicht erfüllt:** Gavin Baker hatte einen Start im August 2026 vorhergesagt (O'Shaughnessy-Podcast, laut OfficeChai und Globes). Der Start blieb aus.

Quellen:
- [AI Magazine 21.10.2026](https://aimagazine.com/news/safe-superintelligence-sutskever-nvidia-and-a-us-32bn-ai-b)
- [OfficeChai](https://officechai.com/ai/ssi-to-come-out-with-their-model-in-august-claims-gavin-baker/)
- [Globes](https://en.globes.co.il/en/article-ssi-could-be-set-to-unveil-revolutionary-language-model-1001553588)

Sag: „No product. No model. Not even a paper. Just a promise, and a man the money believes.“

Achtung: „Not even a paper“ im Faktencheck noch einmal kurz prüfen (Stand Veröffentlichung).

---

## Station 5 – Was er bauen will (C, Hoffnung)

**F23 · „care about sentient life“** · Prognose/Ziel · sicher (Untertitel); Sprecherzuordnung des Einwands siehe 0.7
Dwarkesh, 25.11.2025:
- **Sein Ziel (01:01:14–01:01:29):** „But I maintain that there is something that's better to build, and I think that everyone will want that. It's the AI that's robustly aligned to care about sentient life specifically.“
- **Seine Begründung (01:01:29–01:02:03):** „I think in particular, there's a case to be made that it will be easier to build an AI that cares about sentient life than an AI that cares about human life alone, because the AI itself will be sentient.“ Danach vergleicht er mit Spiegelneuronen und dem Mitgefühl von Menschen für Tiere.
- **Dwarkeshs Einwand (01:02:03–01:02:39):** die „trillions, eventually quadrillions, of AIs“, siehe 0.7.
- **Ilyas Antwort:**
  - „It's true. It's possible it's not the best criterion.“ (01:02:37–01:02:41)
  - „care for sentient life, I think there is merit to it. It should be considered.“
  - „it would be really materially helpful if the power of the most powerful superintelligence was somehow capped“ (01:03:10–01:03:23)

Quelle: [YouTube aR20FWCCjAs](https://www.youtube.com/watch?v=aR20FWCCjAs)

Sag: „He doesn't want a machine that obeys. He wants one that cares. In his words: an AI 'robustly aligned to care about sentient life'.“ Danach ehrlich: „Even his interviewer pushed back: most of those minds would be machines. And Ilya said: 'It's possible it's not the best criterion.'“

Achtung: Ein offenes Angebot, keine Lösung. Er sagt nicht, wie man das baut. Abstrakt bleiben (Flop-Gruppe Psyche/Ethik, stopp2): ein Bild, ein Satz.

**F24 · „then I can see it go well“** · Prognose · sicher (Untertitel)
Dwarkesh, 01:07:56–01:08:33:
- Der Gedanke: „Here's one reason why I liked 'AI that cares for sentient life'. We can debate on whether it's good or bad. But if the first N of these dramatic systems do care for, love, humanity or something, care for sentient life, obviously this also needs to be achieved. This needs to be achieved.“
- Die Hoffnung: „So if this is achieved by the first N of those systems, then I can see it go well, at least for quite some time.“ (Clip C5 ≈ 01:08:21.9–01:08:32.9, Start aus dem Cue geschätzt)
- **Die lange Frist danach, ehrlich:** „Then there is the question of what happens in the long run.“ Er beschreibt eine Welt, in der jede Person eine KI hat, „that will do their bidding“, nennt das aber „a precarious place to be in“, weil der Mensch dann „no longer a participant“ ist. Seine Lösung, ausdrücklich ungeliebt: „I'm going to preface by saying I don't like this solution, but it is a solution. The solution is if people become part-AI with some kind of Neuralink++.“ (01:08:51–01:10:42)

Quelle: [YouTube aR20FWCCjAs](https://www.youtube.com/watch?v=aR20FWCCjAs)

Sag: „And here is his hope. If the first truly powerful machines care, in his words, for 'humanity, or something', then:“ Danach Clip C5, dann: „Not forever. 'At least for quite some time.' That's an honest hope. And it tells you what it hangs on.“

Achtung:
- Die Hoffnung nicht größer machen, als er sie sagt. „at least for quite some time“ gehört dazu.
- Die lange Frist (Neuralink++) nicht in den Schluss ziehen: Doom-nah, und Neuralink ist eine Musk-Firma. Höchstens: „What comes after that, he admits, he doesn't like his own answer.“

**F25 · Alle werden dasselbe wollen** · Prognose · sicher (Untertitel)
Dwarkesh, 01:21:01–01:22:00:
- „I maintain that in the end there will be a convergence of strategies.“
- „you want your first actual real superintelligent AI to be aligned and somehow care for sentient life, care for people, democratic, one of those, some combination thereof. I think this is the condition that everyone should strive for. That's what SSI is striving for.“

Achtung: Als Brücke zum Schluss geeignet (Hoffnung: die Konkurrenz kommt zum selben Ziel). Er ist Chef von SSI (§1.9a).

**F25b · Reserve: NeurIPS-Fragerunde 2024** · Prognose · sicher (Untertitel)
„it's not a bad end result if you have AIs and all they want is to coexist with us and also just to have rights, maybe that will be fine … But I don't know. I mean, I think things are so incredibly unpredictable. I hesitate to comment, but I encourage the speculation.“ (21:40–22:08)

Achtung: Er antwortete auf eine Publikumsfrage, ist unsicher und sagt das. Nur zusammen mit dem Zweifel verwenden.

**F25c · Reserve: Toronto, Hoffnungssatz** · Prognose · sicher
„the greatest challenge of humanity ever. And overcoming it will also … bring the greatest reward.“ (F15)

Achtung: Als Clip ist er 13 s lang, mit einem Versprecher in der Mitte („will also have the will also bring“). Als Zitatkarte ginge die geglättete Form nur mit Auslassungszeichen.

**F25d · Reserve: E-Mail von 2017** · Fakt · dünn (Autorschaft)
„The goal of OpenAI is to make the future good and to avoid an AGI dictatorship.“ Aus einer E-Mail an Musk und Altman vom Sept. 2017, veröffentlicht von OpenAI (Dez. 2024), von Ilya oder von Ilya und Brockman gemeinsam.

Quellen:
- [OpenAI](https://openai.com/index/elon-musk-wanted-an-openai-for-profit)
- [Futurism](https://futurism.com/openai-emails-elon-musk-agi)

Achtung: Zeigt, dass seine Sorge über Machtballung lange vor 2023 bestand (passt zu „never hidden“). Es ist aber ein Musk-Kontext. Nur mit klarer Autorschaft und Jakobs OK.

---

## Schluss

- **Rückgriff auf die Hook-Frage:** Was sah Ilya 2023? Einen Streit unter Menschen (F5–F8). Was sieht er kommen? Er hat es offen gesagt (F10, F15, F16) und baut darauf (F19–F22).
- **Kernsatz:** „The secret was never hidden. We just weren't listening.“ Belegt durch F10: Drei Wochen vor der Entlassung sagte er „There will be a before and an after“.
- **Zur Wahl für das letzte Wort von ihm:** C5 (Hoffnung, Clip) oder Toronto „your life is going to be affected by AI to a great extent“ (Du-Bezug, Zitatkarte).

---

## Staunen: frische Fakten (für Hook, Mitte und Schluss)

| # | Fakt | Datum | Sicherheit |
|---|---|---|---|
| S1 | Nvidia, das wertvollste Chipunternehmen, investierte in eine Firma, die noch nie ein Produkt, ein Modell oder einen Fachartikel gezeigt hat. SSI bekommt 10-mal so viel Rechenleistung (F21). | 27.7.2026 | sicher (Betrag offen) |
| S2 | Unter Eid: Der Mann, der den Chef entlassen wollte, hält heute OpenAI-Anteile im Wert von rund 7 Mrd. $ und sagt: „had I not done this, the company would be destroyed“ (F7). | 11.5.2026 | sicher |
| S3 | Meta wollte SSI kaufen, bei 32 Mrd. $ Bewertung. Ilya: „I said no.“ Sein Mitgründer ging zu Meta (F20). | Angebot Anfang 2025, erzählt 25.11.2025 | sicher (eigene Worte) |
| S4 | Die US National Academy of Sciences vergab ihren Preis für industrielle Anwendung der Wissenschaft 2026 zum ersten Mal für KI, an ihn (25.000 $). | Bekanntgabe Jan. 2026 | sicher (NAS-Seite im Auszug) |
| S5 | Die allerersten Worte seines großen Interviews: „You know what's crazy? That all of this is real.“ (F16) | 25.11.2025 | sicher |
| S6 | Er besuchte Uni-Kurse ab der 8. Klasse, an der Open University of Israel. Dieselbe Uni machte ihn 2025 zum Ehrendoktor: „It's really closing a circle.“ Nach dem Umzug nach Toronto ging er als Erstes in die Stadtbibliothek, „to find a book on machine learning“. | 2025 (Rede) | sicher (eigene Worte) |
| S7 | Superintelligenz ist für ihn kein fertiger Alleskönner, sondern „a superintelligent 15-year-old that's very eager to go“ (F16). | 25.11.2025 | sicher |
| S8 | „Holy moly, what do you do about that?“: der Mann, der KI mitgebaut hat, über die Intelligenzexplosion (F17b). | 2025 | sicher (Ton offen) |

Quellen zu S4:
- [NAS: Award for the Industrial Application of Science](https://www.nasonline.org/award/nas-award-for-the-industrial-application-of-science/)
- [NAS 2026 Awards](https://www.nasonline.org/news/2026-nas-awards-recipients-announced/)

Zu S4: Das genaue Datum der Bekanntgabe habe ich nicht (Princeton meldete die NAS-Preise 2026 am 22.1.2026), ebenso wenig die Verleihung (vermutlich Jahrestagung Ende April 2026).

Zu S6: Russland → Israel mit fünf Jahren, Uni ab der 8. Klasse, Toronto. So sagt er es in der Rede (00:02–00:58).

---

## Personen-Check (§2.5f), Stand 25.11.2026

| Person | Befund | Im Film |
|---|---|---|
| Ilya Sutskever | Sauber. Seit 2025 nur Prozess und Anteile in den Nachrichten, kein Skandal gefunden. | Ja, Clips und Zitate |
| Sam Altman | Gelb/rot: Satz über „bad things“ (Politico, Anfang Okt. 2026, Kritik von Sanders und Pritzker), „RAM Altman“-Episode (um 4.11.2026), Klage der Schwester im Okt. 2026 abgewiesen (keine Feststellung), New Yorker „Can Sam Altman Be Trusted?“ (Apr. 2026), negative Rolle in „Artificial“. | Nur fair als Rolle im Streit. Keine Clips und keine eigenen Zitate ohne Jakobs OK, kein Bösewicht |
| Mira Murati | Sauber. Gründerin von Thinking Machines (Runde um 40 Mrd. $ Bewertung, Modelle Nov. 2026). Öffentliche Reaktion auf Ilyas Aussage nicht gefunden. | Neutral nennen („a colleague“), kein Vorwurf |
| Helen Toner, Tasha McCauley, Adam D'Angelo | Sauber. Toner bestreitet Teile der Aussage (Fusionsgespräche). | Höchstens als „the board“ |
| Greg Brockman | Sauber. Seine Schilderung von 2023 blieb unwidersprochen. | Nur als Quelle im Hintergrund |
| Marc Andreessen | Politisch (MAGA-nah, Ausgaben für die Zwischenwahlen 2026), kein Skandal. | Meme-Zitat als Karte ok (gelb) |
| Elon Musk | Rot: Epstein-Mails, Deepfakes auf X, Zwischenwahlen; zudem Prozesspartei. | Nur mit Jakobs OK; Hook trägt ohne ihn |
| Jensen Huang | Rot (§2.5f). | Kein Zitat, kein Bild, auch nicht in der Nvidia-Station |
| Geoffrey Hinton | Sauber. Sein Satz vom 8.10.2024 („proud … one of my students fired Sam Altman“) macht Altman zum Bösewicht. | Name ok, diesen Satz nicht |
| Dwarkesh Patel | Sauber (Interviewer). | Ja, als Stimme der Frage |
| Karen Hao | Sauber. | Nur als Quelle für den Bunker-Rückgriff |

---

## Gegenpositionen (fair, je ein Satz im Film reicht)

- **G1 · „AGI is still a decade away“ (Andrej Karpathy, Dwarkesh, 17.10.2025).** Ein anderer OpenAI-Mitgründer hält heutige Agenten für weit vom Ziel. Er liegt mit „a decade“ innerhalb von Ilyas 5 bis 20.
  Quelle: [Fortune 21.10.2025](https://fortune.com/2025/10/21/andrej-karpathy-openai-ai-bubble-pop-dwarkesh-patel-interview)
- **G2 · Yann LeCun:** Sprachmodelle seien kein Weg zu menschenähnlicher KI, er baut mit AMI Labs „Weltmodelle“.
  Quelle: [MIT Technology Review 22.1.2026](https://www.technologyreview.com/2026/01/22/1131661/yann-lecuns-new-venture-ami-labs/)
  Achtung: Seinen Satz „it's going to take a while“ (VivaTech 2026) habe ich nur aus dem Auszug (dünn).
- **G3 · Gary Marcus:** AGI sei nicht nahe, die letzten Monate hätten Fortschritte überschätzt.
  Quelle: [Substack 2026](https://garymarcus.substack.com/p/rumors-of-agis-arrival-have-been)
  Achtung: nur sinngemäß.
- **G4 · „Talking your book“:** Kritiker merken an, dass „Skalieren ist vorbei“ einer Firma nützt, die weniger Rechenleistung hat als die Riesen.
  Quellen: [thinking.luhar.org, Dez. 2025](https://thinking.luhar.org/2025/12/lya-sutskever-the-scaling-hypothesis-and-the-art-of-talking-your-book) (Adresse aus einer Leseansicht) · [LessWrong](https://lesswrong.com/posts/2MvgBnWDWYdL2XixA/is-deep-learning-actually-hitting-a-wall-evaluating-ilya)
  Sag: „He runs a company whose bet depends on him being right. Keep that in mind.“
- **G5 · Er relativiert selbst:** Im Nov. 2025 schrieb er auf X, Skalieren werde weiter Fortschritte bringen. Im Interview sagt er, Gemini habe offenbar mehr aus Pretraining herausgeholt (F13).
- **G6 · Nvidia investiert in etwas ohne Produkt:** TheNextWeb rahmte das so (Schlagzeile laut Auszug). SSI ist eine Wette, keine Leistung (F21, F22).
  Quelle: [TheNextWeb](https://thenextweb.com/news/nvidia-ssi-sutskever-investment-vera-rubin-10x-compute)
- **G7 · Der Mitgründer ging:** Daniel Gross nahm das Meta-Angebot sozusagen an („in some sense said yes“) und ging (F20).
- **G8 · Sein eigenes Memo war einseitig und ungeprüft, das sagt er selbst (F6).** Toner widersprach Teilen seiner Erinnerung. Seine Sicht von 2023 ist also nicht „die Wahrheit“, sondern eine Seite.
- **G9 · „Fürsorge für fühlendes Leben“ ist umstritten:** Schon sein Interviewer fragte, ob Menschen dann nicht zur kleinen Minderheit würden. Ilya: „It's possible it's not the best criterion“ (F23).
- **G10 · Weite Spanne:** „5 to 20“ ist eine Spanne von 15 Jahren, und in Toronto weigerte er sich, eine Zahl zu nennen („a bit hard to predict the future“).

---

## Nicht verwenden / unbelegt

- **„Ilya sah AGI“, „ein Monster im Labor“, Q* als Grund:** nicht belegt. Der Q*-Brief ist umstritten, WilmerHale nennt keinen Sicherheitsgrund (F3, F5). Nur als damalige Vermutung erzählen.
- **„AGI in 5 to 20 years“ oder „AI will do everything in 5 to 20 years“ als Ilya-Zitat:** falsch verbunden (0.6).
- **„There will be trillions, eventually quadrillions, of AIs. Humans will be a very small fraction“ als Ilya-Satz:** Das ist nach Satzbau Dwarkesh (0.7). Am Transkript mit Namen prüfen.
- **„Jedes Mal belächelt“:** nicht belegt (0.4).
- **AlexNet „im Schlafzimmer“:** Das war Krizhevskys Zimmer bei seinen Eltern, und es ist nur aus einem Wikipedia-Spiegel belegt.
- **Datum des Andreessen-Posts:** nicht gefunden.
- **„Verification didn't occur to him“ (Decrypt):** Wortlaut nicht am Protokoll geprüft. Sinngemäß „he didn't check it with them“ ist ok.
- **ABC7-Wortlaute „I simply care“ und „The mission of OpenAI is larger than the structure“:** nicht bestätigt. Wired hat „I simply cared for it“ (F7).
- **„I made no such promise“ (keine Zusage, gemeinnützig zu bleiben):** nur in einem Bericht. Gehört ohnehin zum Musk-Streit, also weglassen.
- **Anteile „von rund 5 auf 7 Mrd. $ gestiegen“:** Vergleichswert unklar, nur „rund 7 Mrd. $“ sagen.
- **Nvidia-Betrag (5 Mrd. $), Gesamtfinanzierung (8 oder 11 Mrd. $), neue Bewertung:** Quellen widersprechen sich, nicht primär. Weglassen.
- **SSI-Start im August 2026 (Gavin Baker):** ist nicht eingetreten.
- **Hinton: „I'm particularly proud of the fact that one of my students fired Sam Altman“ (8.10.2024):** belegt, aber Bösewicht-Rahmen (§1.7).
- **Musk: „Something scared Ilya …“ und „good moral compass“:** belegt, aber Personen-Check rot. Nur mit Jakobs OK.
- **Fusionsgespräche mit Anthropic (Nov. 2023, aus der Aussage):** umstritten (Toner widerspricht) und §1.10, also weglassen.
- **„Feel the AGI“-Rufe und das verbrannte Holzbildnis einer „unaligned“ KI (The Atlantic, Hao):** nur Sekundärberichte, wirkt sektenhaft. Nicht verwenden.
- **„Maybe every person will have an AI that does their bidding“ als Hoffnungssatz:** Der Wortlaut stimmt (01:09:32), aber er nennt das gleich darauf „precarious“. Nicht aus dem Zusammenhang reißen.
- **NAS-Preis „2024“ (BestHub):** falsch, richtig ist 2026.
- **„Eye on AI“-Interview als „Okt. 2026“ (Suchauszug):** falsch datiert, das Gespräch ist von 2023.
- **Szenen, Trailer und Standbilder aus „Artificial“:** Film, rot. Nur der Kinostart als Anlass.
- **„Er wurde 2023 gezwungen“ oder „er wurde rausgeworfen“ (Mai 2024):** Er ging laut eigenem Post selbst. Dass er nach Nov. 2023 kaum noch im Büro war, steht nur in Sekundärberichten, also nicht behaupten.

---

## Anlass

**F26 · „Artificial“** · Fakt · sicher
- **Der Film:** Luca Guadagninos Spielfilm über OpenAI und die Tage im Nov. 2023. Andrew Garfield spielt Altman, Yura Borisov spielt Ilya.
- **Der Weg ins Kino:** Amazon MGM gab den Film ab, Neon sicherte sich am 30.6.2026 die Weltrechte. Weltpremiere war beim New York Film Festival am 5.10.2026, danach lief er beim London Film Festival.
- **Der Kinostart in den USA:** 25.12.2026 in ausgewählten Kinos, breit im Januar 2027 (laut Variety 8.1.2027).
- **Wie Ilya darin wegkommt:** Rezensionen nennen Borisovs Ilya Gewissen oder Idealist des Films (The Film Stage, TheWrap, RogerEbert.com).

Quellen:
- [Screen Daily (Starttermin)](https://www.screendaily.com/news/neon-sets-us-release-for-luca-guadagninos-openai-film-artificial/5220191.article)
- [AP via NY1 30.6.2026](https://ny1.com/nyc/all-boroughs/ap-top-news/2026/06/30/openai-film-artificial-dropped-by-amazon-finds-a-new-home-with-neon)
- [The Playlist](https://theplaylist.net/artificial-luca-guadagnino-sam-altman-neon-20260630/)
- [The Film Stage (NYFF)](https://thefilmstage.com/luca-guadagninos-artificial-to-world-premiere-at-the-64th-new-york-film-festival/)
- [Variety (Trailer)](https://variety.com/2026/film/news/artificial-trailer-andrew-garfield-openai-biopic-1236802616/)
- [TheWrap (Kritik)](https://thewrap.com/creative-content/movies/artificial-review-new-york-film-festival)
- [RogerEbert.com](https://rogerebert.com/festivals/nyff-2026-artificial-and-closing-thoughts)

Sag: „This Christmas, Hollywood tells the story of those five days. But the real answer isn't in the movie. It's in a courtroom, and in what he has been saying all along.“

Achtung:
- Den Kinostart nur als US-Start nennen, international unklar.
- Den Wortlaut der Rezensionen („conscience“) nicht zitieren, nur sinngemäß, falls überhaupt.
