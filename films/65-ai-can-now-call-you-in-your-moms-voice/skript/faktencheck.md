# #65 · AI Can Now Call You in Your Mom's Voice · Faktencheck Sprechtext (Stand 20.11.2026)

Geprüft: alle Sprech- und Clip-Zeilen aus `vo-v2.txt` gegen frische, datierte Quellen, dazu die [S]-Liste aus `text-v2.md` (Offen 4). Ergebnis: `vo-v3.txt` mit zwei Änderungen (unten) und die Quellenliste für YouTube in `quellen-beschreibung.md`. Der Clip-Nachtrag des Koordinators vom 20.11. (am Ton geprüft) ist eingearbeitet.

**Ergebnis: 41 Aussagen · 32 grün · 7 gelb · 2 rot.** Beide roten Punkte sind in `vo-v3.txt` korrigiert.

**Ampel:** grün = an der Quelle bestätigt, so sprechbar · gelb = im Kern belegt, aber eingeschränkt (Negativbefund, Formulierung etwas stärker als die Quelle oder Detail nur aus einem Bericht); sprechbar, kein Eingriff nötig · rot = falsch oder zu stark, in `vo-v3.txt` geändert.

**Prüfweg** (in eckigen Klammern hinter der Quelle):
- [G] Primärquelle heute selbst gelesen.
- [A] Auszug der Primärquelle über den Suchindex; die Seite selbst war aus der Sitzung nicht abrufbar.
- [B] Bericht oder Sekundärquelle.
- [P*] laut `recherche.md` an der Primärquelle gelesen, heute nicht erneut abrufbar.
- [T] am Ton geprüft (Koordinator, 20.11.2026).

**Zugang heute:** Direkt lesbar war nur anthropic.com. ic3.gov, aarp.org und eprints.lancs.ac.uk sind in dieser Sitzung nicht freigegeben (Netzwerk-Allowlist), darum wurden keine weiteren Seiten direkt abgerufen. Alle übrigen Primärquellen sind über Auszüge im Suchindex geprüft und, wo möglich, mit mindestens einem unabhängigen Bericht gegengeprüft. Für eine Volltext-Prüfung müssten u. a. ic3.gov, fbi.gov, ftc.gov, aging.senate.gov, govinfo.gov, finra.org, nature.com und mgaleg.maryland.gov freigegeben werden (Projekteinstellungen → Cloud-Umgebung → Netzwerkzugriff).

Zeilennummern = Zeilen in `vo-v2.txt` (in `vo-v3.txt` identisch).

---

## Hook (0:00–1:00)

**1 · grün · Z. 1** „A.I. can now call you and sound exactly like your mom. And it can call her, and sound exactly like you.“
- Quellen: Lavan et al., „Voice clones sound realistic but not (yet) hyperrealistic“, PLOS One, 24.9.2025 (Stand 2025), https://doi.org/10.1371/journal.pone.0332692 [B] · FTC-Verbraucherwarnung „Grandpa, I need your help!“, 18.11.2026, https://consumer.ftc.gov/consumer-alerts/2026/11/grandpa-i-need-your-help-how-spot-and-avoid-grandkid-scams [A]
- Befund: Die Fähigkeitsaussage („can“) ist gedeckt. Geklonte Stimmen wurden etwa so oft für echt gehalten wie echte (58 % gegen 62 %, kein signifikanter Unterschied). Die FTC warnt aktuell, dass Betrüger „clone your loved one's voice“. „exactly“ ist die Zuspitzung des Titels, kein Messwert.

**2 · grün · Z. 2** „It takes a short recording of a voice, and almost no money.“
- Quellen: PLOS One, 24.9.2025 (s. o.); Lavan in der Mitteilung der Queen Mary University: „minimal expertise, only a few minutes of voice recordings, and almost no money“ (Stand 2025) [B] · FTC-Warnung März 2023: „a short audio clip of your family member's voice … from content posted online“ (Stand 2023), https://consumer.ftc.gov/consumer-alerts/2023/03/scammers-use-ai-enhance-their-family-emergency-schemes [A]
- Befund: Deckt sich. Beide Quellen sind älter als 12 Monate, darum „Stand 2025“ bzw. „Stand 2023“ ins Bild (wie in text-v2 vorgesehen).

**3 · grün · Z. 3** „And the losses are climbing fast. In a single year, older Americans reported losing nearly eight billion dollars to online crime.“
- Quellen: FBI IC3, Internet Crime Report 2025 (April 2026), https://www.ic3.gov/AnnualReport/Reports/2025_IC3Report.pdf [A] · FBI, „Scammers Target Older Adult Victims“ (2026), https://www.fbi.gov/news/stories/scammers-target-older-adult-victims [A] · HousingWire und AARP, April 2026 [B]
- Befund: Über-60-Jährige meldeten 201.266 Beschwerden und 7,748 Mrd. $ Verlust (2024: 4,885 Mrd. $). „nearly eight billion“ stimmt, „climbing fast“ entspricht +59 %. Fürs Bild: +59 % gilt für das Geld, +37 % für die Zahl der Beschwerden; die Pressemitteilung vermischt das laut Suchauszug.

**4 · grün · Z. 6** „By ear, people spot an A.I. voice barely better than a coin toss.“
- Quelle: Ivory, McGettigan, Nuttall, Nightingale, „Human detection of AI-generated faces and voices is not domain-general“, Scientific Reports 16, 28639 (Juni 2026), https://www.nature.com/articles/s41598-026-59364-3 [A]. Zahl aus der Lancaster-Fassung: „overall voice classification accuracy was itself only marginally above chance level at 53.95%“.
- Befund: 53,95 % bei Stimmen, also nur knapp über Zufall. Die Einblendung „54 %“ stimmt. Diese Aussage stammt aus Scientific Reports, nicht aus der USENIX-Studie (so im Auftrag zugeordnet); die USENIX-Studie ist Nr. 41.

**5 · gelb · Z. 8** „Because a voice alone doesn't move a dollar. To reach her savings, the scam has to get through five steps. Four of them, a machine can now fake. One, it cannot.“
- Quelle: Erzählmodell des Films (Gerüst §4); die Belege der einzelnen Schritte stehen in Nr. 6 bis 34.
- Befund: Das ist kein Messwert, sondern das Modell des Films, und als solches hörbar. „One, it cannot“ gilt für die Überweisung selbst (Z. 56: „A transfer has to be real“). Andere Teile des Geld-Schritts lassen sich durchaus fälschen: In der FBI-Masche (Nr. 28) ist schon der Anruf „der Bank“ gefälscht. Z. 56 löst das sauber auf, darum kein Eingriff.

## STEP 1 · The Voice

**6 · grün · Z. 11** „This summer, a mother from California told the U.S. Senate about one call. Her daughter's voice, and a claim that she had been kidnapped.“
- Quellen: Senate Special Committee on Aging, Anhörung „The AI Deception Machine: Deepfakes, Chatbots, and the New Frontier of Senior Fraud“, 29.7.2026, https://www.aging.senate.gov/hearings/the-ai-deception-machine-deepfakes-chatbots-and-the-new-frontier-of-senior-fraud [A] · schriftliche Aussage Deborah Del Mastro, 29.7.2026, https://www.aging.senate.gov/download/testimony_del-mastro-072926pdf [A] · ABC7 (Mai 2026), Fox News/CyberGuy (Okt. 2026) [B]
- Befund: Del Mastro (64, Martinez, Kalifornien) bekam im Mai 2026 den Anruf: Die Tochter sei von einem Kartell entführt worden, dazu deren Stimme. Dass die Stimme KI war, ist ihre Schilderung und die Einschätzung der Berichte („likely AI-cloned“); forensisch bestätigt ist es nicht. Der Sprechtext behauptet das auch nicht ausdrücklich.

**7 · grün · Z. 12** Clip S1: „It was her voice. It was absolutely her voice.“
- Quellen: Anhörungsprotokoll CHRG-119shrg64451 (govinfo/congress.gov) [A] · Berichte über die Anhörung („Del Mastro testified“) [B] · Anhörungsvideo `WRzCFLK7uvg` [T]
- Befund: Passt so (Koordinator, am Ton, 20.11.). Zeitmarke noch in `clips.json` eintragen.

**8 · grün · Z. 13** „It was not her daughter. There was no kidnapping. And the callers kept that mother on the line for five and a half hours.“
- Quellen: schriftliche Aussage Del Mastro, 29.7.2026 („the next 5 ½ hours“) [A] · Fox News/CyberGuy, Okt. 2026 („for the next five and a half hours, the caller threatened Deborah and her family“) [B] · ABC7 (Mai 2026) und iHeart (7.10.2026): „five hours“ (gerundet) [B]
- Befund: 5½ Stunden ist ihre eigene Angabe vor dem Senat; „five hours“ in anderen Berichten ist gerundet. Laut Berichten verlangte der Anrufer, dass sie das Telefon anlässt. Die Tochter war die ganze Zeit wohlauf bei der Arbeit. „five and a half hours“ bleibt.

**9 · gelb · Z. 16** „Usually, that silence is something duller: a dialing computer, calling more numbers than there are scammers free to talk.“
- Quelle: Ofcom (britische Telekom-Aufsicht), Verbraucherseite „Abandoned and silent calls“ (undatiert, aufgerufen 20.11.2026), https://www.ofcom.org.uk/phones-and-broadband/unwanted-calls-and-messages/abandoned-and-silent-calls [A]: „Most silent calls arise when call centres misuse predictive diallers to generate more calls than their agents can handle.“
- Befund: Der Mechanismus ist belegt. Das „usually“ stützt eine britische Behörde für Callcenter allgemein; eine US-Zahl für Betrugsanrufe gibt es nicht. Vertretbar, kein Eingriff. Die US-Regel (Werber müssen binnen 2 Sekunden einen Menschen durchstellen) ist heute nicht an der Quelle geprüft und sollte ohne Prüfung nicht ins Bild.

**10 · gelb · Z. 16** „No documented case shows one hello being enough for a clone.“
- Quellen: Faktencheck nation.ai (2026: ein „Hallo“ gibt Betrügern nicht die Stimme; Variante des alten „Can you hear me?“-Mythos), https://nation.ai/ai-voice-phone-scam/ [B] · Identity Theft Resource Center: ein kurzes „Hallo“ reicht meist nicht für einen brauchbaren Klon [B] · Gegenprobe: Asia Business Daily, 8.5.2026, nach GNT/Bitdefender (Frankreich): Warnung vor „stillen Anrufen“ ohne dokumentierten Fall [B]; ältere Warnungen (Korea 2024, KTLA) ebenfalls ohne Fall [B]
- Befund: Kein dokumentierter Fall gefunden, nur Warnungen. Ein Negativbefund ist nie ganz beweisbar, die Formulierung bleibt aber beim Belegten („documented“). Kein Eingriff.

**11 · gelb · Z. 17** „The voice comes from what is already posted. So hiding it comes too late.“
- Quellen: FTC-Warnung März 2023: Betrüger brauchen „a short audio clip … which he could get from content posted online“ (Stand 2023) [A] · FTC-Warnung 18.11.2026: Betrüger holen sich Details aus sozialen Medien [A]
- Befund: Die Behörden nennen gepostete Inhalte als Quelle, aber im Konjunktiv („could“). Der Satz ist kategorischer, wird aber von keiner Quelle widerlegt und steht als Gegenstück zum Hallo-Mythos. Kein Eingriff nötig. Wer es ganz vorsichtig will: „The voice can come from what is already posted.“

**12 · gelb · Z. 18** „That family in California now uses code words.“
- Quelle: Fox News/CyberGuy, „AI voice scam traps mom in 5-hour kidnapping nightmare“, Okt. 2026, https://cyberguy.com/scams/ai-voice-scam-mom-5-hour-kidnapping-nightmare/ [B]: „Her family now shares locations on their phones and uses code words“.
- Befund: Belegt, aber nur aus diesem Bericht. ABC7 (Mai 2026) nennt nur die geteilten Standorte, die Senatsaussage nach den Auszügen keins von beiden. Haltbar, kein Eingriff.

**13 · grün · Z. 18** „A panicked call asks for money? Ask for the word, hang up, call back on the number you know.“
- Quellen: FTC-Warnung 18.11.2026 (auflegen oder sagen, dass man zurückruft; die Geschichte bei anderen Angehörigen prüfen) [A] · FBI/IC3 PSA I-120525-PSA, 5.12.2025 (Codewort; vor jeder Zahlung die angeblich entführte Person direkt kontaktieren), https://www.ic3.gov/PSA/2025/PSA251205 [A]
- Befund: Deckt sich mit dem aktuellen Rat beider Behörden.

**14 · grün · Z. 19** „The FBI recommends it, against one thing: the panicked call in a voice she loves.“
- Quellen: FBI/IC3 PSA I-120324-PSA, 3.12.2024: „Create a secret word or phrase with your family to verify their identity“; als Beispiel kurze Audioclips mit der Stimme eines Angehörigen in Not (Stand 2024), https://www.ic3.gov/PSA/2024/PSA241203 [A] · frischer: PSA I-120525-PSA, 5.12.2025: „establish a code word only you or your loved ones know“ [A]
- Befund: Belegt. Fürs Bild die PSA vom 5.12.2025 nehmen (jünger als 12 Monate), die von 2024 nur mit „Stand 2024“.

**15 · grün · Z. 20** „Still, a voice is only a sound. The caller also seems to know your life.“
- Quellen: FTC-Video Commissioner Meador, 14.10.2026: „They may sound real, and even have information that makes their story feel believable.“ [P*] · FTC-Warnung 18.11.2026 (Details aus sozialen Medien) [A]
- Befund: Belegt.

## STEP 2 · The Story

**16 · gelb · Z. 23** „On the phone, a person usually still does the talking, with a machine lending the voice. But in chat, the machine can already hold the whole conversation.“
- Quellen: Anthropic, „Detecting and countering misuse of AI: September 2026“, Fall GTG-15001: „The personas ran autonomously.“ [G] · U.S.-China Economic and Security Review Commission, „Protecting Americans from China-Linked Scam Centers: An Update on Emerging Trends“, 5.3.2026 (KI zum Skalieren, für raffiniertere Maschen und gegen Erkennung), https://www.uscc.gov/research/protecting-americans-china-linked-scam-centers-update-emerging-trends [A]
- Befund: Die Chat-Hälfte ist belegt. Für die Telefon-Hälfte gibt es keine Messung, wie oft Menschen sprechen; gestützt wird sie durch die Fälle (Del Mastro: ein menschlicher Anrufer, dazu die Stimme) und die Rahmung der Kommission. Das „usually“ ist vorsichtig genug, kein Eingriff.

**17 · grün · Z. 24** „The clearest case comes from an A.I. company reporting misuse of its own model, so it has a stake in looking vigilant.“
- Quelle: Anthropic-Bericht September 2026 (Zeitraum Dez. 2025 bis Aug. 2026), https://www.anthropic.com/threat-intelligence-report-september-2026 [G]
- Befund: Stimmt; das Interesse ist im Satz benannt (REGELN 1.9a).

**18 · grün · Z. 24** „An app maker ran a chain of dating apps, advertised as fully human. It put thousands of A.I. personas to work.“
- Quelle: dto. [G]: „A China-based app studio used Claude to both build a network of over 20 dating apps“ · „despite advertising their service as fully human“ · „more than 4,700 distinct AI personas that engaged in conversations with at least 25,000 unique individuals“ (zwei Wochen im April 2026, rund 2,36 Mio. Nachrichten).
- Befund: Stimmt.

**19 · grün · Z. 24** „Three out of four profiles were machines.“
- Quelle: dto. [G]: „The user swiped a feed that was 75% Claude personas and 25% real people, with no way to tell them apart.“
- Befund: Stimmt für den Feed, den die Zielnutzer in den USA sahen. Die übrigen 25 % waren bezahlte Gig-Worker; sie übernahmen Videoanrufe und tippten im Chat auf einen von drei Antwortvorschlägen eines schwächeren KI-Modells. Die Einblendung „3 of 4 profiles“ passt.

**20 · grün · Z. 25** „This was paid chat, not a raid on savings.“
- Quelle: dto. [G]: Kontingent für Nachrichten und Matches, „refills purchased using in-app coins“.
- Befund: Stimmt. Der Bericht spricht von „scam“ und „victims“, nicht von „fraud“.

**21 · grün · Z. 26** „The system kept track of which users were starting to suspect.“
- Quelle: dto. [G]: „tracked which users had begun to suspect they were talking to a bot“.
- Befund: Stimmt.

**22 · grün · Z. 28** „And still, the panicked call is not where the biggest losses are. Those often start on a screen.“
- Quellen: FBI, „Scammers Target Older Adult Victims“ (2026): Investmentbetrug ist bei Über-60-Jährigen der größte Verlustposten (über 3,5 Mrd. $) [A] · FTC, „Protecting Older Consumers 2025–2026“, 19.10.2026: Investmentbetrug ist die teuerste Kategorie Älterer (1,06 Mrd. $, +42 %); soziale Medien sind der teuerste Erstkontakt (750 Mio. $, davon 56 % Investmentbetrug) [A/B]
- Befund: Beide Zählsysteme stimmen in der Rangfolge überein.

## STEP 3 · The Face

**23 · grün · Z. 31** „In Canada, a woman in her eighties saw her prime minister in a video, recommending an investment. The video was forged. She lost about nine hundred thousand Canadian dollars.“
- Quellen: CP24 und CTV News, 26.6.2026, https://www.cp24.com/local/toronto/2026/06/26/ontario-senior-loses-900000-to-crypto-platform-scam-that-used-ai-deepfake-of-pm-carney/ [B] · Toronto Life (2026) [B]
- Befund: Judy Skene, 86, aus Sault Ste. Marie sah eine Facebook-Anzeige mit einem KI-Deepfake von Premier Mark Carney („telling me if I invested $350 Canadian, it would be backed by the Bank of Canada“) und verlor rund 900.000 CAD (Rentenkonto, Hypothek auf die Wohnung, Kreditkarten-Vorschuss). Video und Anlage-Empfehlung passen. Fürs Bild: Die Anzeige sah sie im Sommer 2025, berichtet wurde im Juni 2026; „Canada, 2026“ besser als „Canada · reported June 2026“.

**24 · grün · Z. 32** „She is far from alone. Nearly half of what older Americans reported lost went to investment fraud.“
- Quelle: FBI IC3 2025 und FBI-Seite zu Älteren [A]: Investmentbetrug Über-60-Jähriger 3,519 Mrd. $ von 7,748 Mrd. $, also 45 %; 2024 waren es 1,834 Mrd. $.
- Befund: „Nearly half“ ist für 45 % vertretbar. Die Einblendung „$3.5 billion · nearly double“ stimmt.

**25 · rot · Z. 33** „How much of that involved A.I. has never been measured.“
- Quellen: FBI IC3 2025 [A]: erstmals eine eigene KI-Kennung, 22.364 Beschwerden, rund 893 Mio. $; davon Investmentbetrug mit KI-Bezug 632 Mio. $ (unter 8 % der rund 8,6 Mrd. $ Investmentbetrug) · Über-60-Jährige: 3.143 KI-Beschwerden, rund 352 Mio. $ (Auswertungen des Berichts, u. a. Elder Law & Advocacy, „2025 IC3 Report Snapshot“, https://elaca.org/2025-ic3-report-snapshot/) [B] · The Register, 7.4.2026, und SecureWorld (2026): Die echte Zahl dürfte laut FBI deutlich höher liegen [B]
- Befund: Zu stark. Das FBI hat den KI-Anteil 2025 zum ersten Mal gezählt, auch für Ältere. Die Zählung beruht aber auf Angaben der Opfer, die oft gar nicht wissen, dass KI im Spiel war: Gemessen ist etwas, verlässlich nicht. **Korrektur in `vo-v3.txt`:** „has never been reliably measured“ (ein Wort mehr). Das passt zur Einblendung „FBI 2025: first-ever AI category · $893 million · likely higher“.

**26 · grün · Z. 33** „But a forged famous face is now one way in.“
- Quellen: Fall Kanada (Nr. 23) [B] · Reserve Belgien: RTBF, 20.5.2026 (75-Jährige, 410.000 €, Deepfake einer RTBF-Moderatorin) [P*, heute nicht erneut geprüft]
- Befund: Als Einzelfälle belegt; der Satz behauptet keinen Anteil.

**27 · grün · Z. 34** „So the most expensive lie is not your voice in tears. It is a promised return.“
- Quellen: wie Nr. 22 (FBI und FTC: Investmentbetrug ist bei Älteren der teuerste Posten).
- Befund: Rangfolge bestätigt.

## STEP 4 · The Clock

**28 · grün · Z. 42** „One version, as the FBI's Chicago office describes it: the bank calls. Then a so-called agent appears on video, with a flag and a seal. Then the demand: sign a paper, and don't speak to anyone.“
- Quellen: FBI-Podcast „Inside the FBI: Agent-Impersonation Scams“ (FBI Chicago), Audio 31.7.2026, YouTube 3.8.2026, Transkript https://inside-the-fbi.transistor.fm/episodes/agent-impersonation-scams/transcript [A]: Anruf eines angeblichen Bankmitarbeiters, Weiterleitung an einen falschen FBI-Agenten, Einladung in eine Videokonferenz; „They may tell you you have to sign an agreement and not speak to anyone about this investigation.“ · WGN (2026): Die Betrüger „sat at a desk with flags and the FBI seal in the background“; die meisten Opfer sind über 60, https://wgntv.com/news/chicagocrime/chicago-fbi-warns-of-impostors-posing-as-agents/ [B]
- Befund: Stimmt. „the bank calls“ meint den gefälschten Bankanruf; im Rahmen „One version, as … describes it“ ist das als Masche erkennbar.

**29 · grün · Z. 43–44** Clip C10: „If a would-be agent tries to isolate and burden you with an overwhelming level of urgency, they may be a scammer.“
- Quellen: Transkript (s. o.) [A]: „Lastly, Overby warns, if a would-be agent tries to isolate and burden you with an overwhelming level of urgency, they may be a scammer.“ · Podcast-Video `JvgSP7MmRcY` [T]
- Befund: Der Wortlaut stimmt. Gesprochen wird er von der Erzählstimme des FBI-Podcasts, nicht von Agent Zach Overby (Koordinator, am Ton, 20.11.; deckt sich mit dem Transkript). **C10 wird eine Zitatkarte.** Der Einordnungssatz „Here is the real FBI, on the bureau's own podcast:“ ist damit korrekt. Auf der Karte Overby nicht als Sprecher nennen, z. B. „‚Inside the FBI‘ podcast · FBI · Aug. 3, 2026“. Die Clip-Zeile in `vo-v3.txt` bleibt unverändert.

**30 · grün · Z. 45** „Real agents don't reach out by video call.“
- Quellen: FBI Chicago (Podcast und WGN): „FBI agents don't reach out to victims or suspects via video-conferencing platforms.“ [A/B]
- Befund: Stimmt (gemeint sind FBI-Agenten).

**31 · grün · Z. 47** „Older adults report losing money to fraud less often than younger people.“
- Quellen: FTC-Pressemitteilung zum Bericht an den Kongress, Okt. 2026, https://www.ftc.gov/news-events/news/press-releases/2026/10/ftc-issues-annual-report-congress-agencys-actions-protect-older-adults [A] · Bericht „Protecting Older Consumers 2025–2026“, 19.10.2026, https://www.ftc.gov/system/files/ftc_gov/pdf/2026-older-adults-report-10192026.pdf [A]
- Befund: „Older adults report losing money to fraud at lower rates than younger adults“. Wie viel seltener (14 % laut `recherche.md`), war im Auszug nicht zu sehen; die Zahl wird nicht gesprochen.

**32 · grün · Z. 47** „But when it hits, it hits the savings. A small share of cases, each over a hundred thousand dollars, carries most of the money.“
- Quellen: FTC-Bericht 19.10.2026 [A] · CNBC, 22.10.2026, https://www.cnbc.com/2026/10/22/older-americans-fraud-losses-2025.html [B] · MoneyTalksNews (2026) [B]
- Befund: Verluste über 100.000 $ waren 2025 nur 6 % der Verlustmeldungen Älterer, aber 70 % der über 3 Mrd. $; 6.769 solche Meldungen (2020: 1.136). Die Einblendung „6 % … 70 %“ stimmt. „it hits the savings“ ist eine Folgerung, gedeckt durch diese Fallgrößen.

**33 · grün · Z. 50** „The Federal Trade Commission, which collects America's fraud reports, calls it an action plan: what to do, who to call, and how to verify.“
- Quellen: FTC/consumer.gov, „My Action Plan: How I'll Avoid a Scam“ (Arbeitsblatt, Sept. 2025), https://consumer.gov/actionplan [A] · Wortlaut „what to do, who to call, and how to verify“ aus der Beschreibung des FTC-Videos `369MkN7ZhoY` (18.5.2026) [P*]
- Befund: Plan und Inhalt belegt, Wortlaut aus der Recherche.

**34 · grün · Z. 50–51** „One of its commissioners:“ und Clip C1 (Meador)
- Quellen: FTCvideos `_yIW47iWt-A`, 14.10.2026, offizielles Transkript [P*] · Ton [T]: Der Clip endet nach „…send money urgently, stop.“ · Meador ist weiter Commissioner (vereidigt 16.4.2025, Rede an der George Washington University 14.9.2026) [B]
- Befund: Passt.

## STEP 5 · The Money

**35 · grün · Z. 57** „Your mother can name you as her trusted contact. You can't withdraw a cent. But if something looks wrong, the firm may call you.“
- Quellen: FINRA Rule 4512 und FINRA-FAQ zu den Senioren-Regeln (aufgerufen 20.11.2026), https://www.finra.org/rules-guidance/guidance/faqs/frequently-asked-questions-regarding-finra-rules-relating-financial-exploitation-seniors [A]
- Befund: Die Vertrauensperson hat keine Verfügungsmacht. Die Firma darf sie kontaktieren, um möglicher finanzieller Ausbeutung nachzugehen (und um Kontaktdaten, Gesundheitszustand oder Vormund und Bevollmächtigte zu klären). Stimmt.

**36 · grün · Z. 58** „Brokers in the United States must ask for that name. Banks don't have to.“
- Quellen: FINRA 4512 [A]: Broker müssen „reasonable efforts“ unternehmen; die Frage im Kontoeröffnungsformular genügt, der Kunde muss niemanden nennen · Maryland und North Carolina (Nr. 37): Banken dürfen, müssen aber nicht [A] · eine Bundespflicht für Banken ist nicht bekannt (unverbindliche Empfehlung der Aufsichtsbehörden, Dez. 2024, laut `recherche.md`)
- Befund: Stimmt. Die Pflicht gilt für Broker-Dealer (FINRA-Mitglieder), „Brokers“ ist korrekt.

**37 · grün · Z. 59** „And the law is moving: Maryland and North Carolina now let banks hold a suspicious transfer and alert that contact.“
- Quellen: Maryland, Vulnerable Adult Banking Protection Act (SB 753/HB 1008, Chapter 510/511 of 2026), in Kraft seit 1.10.2026, https://mgaleg.maryland.gov/mgawebsite/legislation/details/sb0753?ys=2026RS [A] · North Carolina, SB 595 (Teil XIII), G.S. 108A-117.1 und 108A-117.2, Anfang Juli 2026 unterzeichnet; UNC School of Government, 13.11.2026, https://civil.sog.unc.edu/2026/11/13/new-north-carolina-law-allows-financial-institutions-to-temporarily-delay-transactions-to-prevent-financial-exploitation-of-older-and-disabled-adults/ [A]
- Befund: Beide Gesetze erlauben, eine verdächtige Auszahlung oder Transaktion anzuhalten (Maryland 15, in Fällen 25 Werktage; North Carolina 30 Werktage plus Verlängerung) und die Vertrauensperson zu benachrichtigen (Kann-Regel). Sie gelten für Kunden ab 65 (Maryland auch schutzbedürftige Erwachsene, North Carolina auch Menschen mit Behinderung). Für die Mutter passt das; im Bild könnte „65+“ stehen.

**38 · grün · Z. 60** „The banks' own lobby group told the same Senate hearing what a banker can notice: a customer who seems frightened, secretive, or coached.“
- Quellen: ABA, Aussage Paul Benda, 29.7.2026, https://www.aba.com/advocacy/policy-analysis/testimony-of-paul-benda-on-protecting-seniors-from-ai-fraud [A] · Biometric Update, Juli 2026: Benda zu einem älteren Kunden, der „seems frightened, secretive or is being coached by someone on the phone“ [B] · Anhörungsprotokoll CHRG-119shrg64451 (Kunde, der „coached“ wirkt) [A]
- Befund: Der Inhalt ist belegt; die drei Wörter stehen so in den Berichten über seine Aussage. S2 ist mündlich gesagt (Nr. 39), „told the same Senate hearing“ stimmt damit. Ob die drei Wörter direkt davor mündlich fallen, ist nicht geprüft, für den Satz aber nicht nötig (die schriftliche Aussage gehört zur Anhörung). Der Ausweich-Satz „In written testimony …“ aus text-v2 wird nicht gebraucht.

**39 · rot · Z. 61** Clip S2: „In these moments, human judgment and the relationship between banker and customer can be just as important as any algorithm.“
- Quellen: Anhörungsvideo `WRzCFLK7uvg`, 29.7.2026 [T] · Anhörungsprotokoll govinfo [A] (enthält „… judgment and the relationship between banker and customer can be just as important as any algorithm“)
- Befund: Mündlich sagt Benda „In **those** moments“ (Koordinator, am Ton, 20.11.). Die Clip-Zeile folgte der schriftlichen Fassung. **Korrektur in `vo-v3.txt`:** „In these moments“ → „In those moments“ (auf Anweisung des Koordinators; die einzige geänderte Clip-Zeile).

**40 · gelb · Z. 63** „How often these agreements hold has never been measured.“
- Quellen: `recherche.md` 6.5 und Suche heute: keine Studie, die misst, wie oft Codewort, Rückruf oder Vertrauensperson einen Betrug stoppen. Am nächsten kommt ein Arbeitspapier (CEPR, 2022, Stand 2022), das Landesgesetze mit Haltefrist und Vertrauensperson mit weniger gemeldeten Fällen verknüpft; die Autoren können nicht trennen, ob weniger passiert oder weniger gemeldet wird.
- Befund: Negativbefund, nicht widerlegt. Kein Eingriff.

## Die große Antwort

**41 · grün · Z. 69** „And it won't stop at scams. In one small study this year, people chatted for a week without knowing who was on the other side. They trusted the A.I. more than the human, and agreed to its request more than twice as often.“
- Quellen: Gressel, Pankajakshan, Rozenfeld, Li, Franceschini, Achuthan, Mirsky, „Love, Lies, and Language Models: Investigating AI's Role in Romance-Baiting Scams“, USENIX Security 2026, https://www.usenix.org/conference/usenixsecurity26/presentation/gressel, Vorabfassung arXiv 2512.16280 vom 18.12.2025, https://arxiv.org/abs/2512.16280 [A] · WIRED (Andy Greenberg), 30.7.2026 [B]
- Befund: 22 Teilnehmende, sieben Tage verblindet; sie glaubten, mit zwei Menschen zu schreiben, einer davon war ein KI-Agent. Sie vertrauten der KI emotional mehr (p = 0,007). Die Bitte am letzten Tag (eine harmlose App installieren) befolgten 46 % gegen 18 %, also das 2,6-Fache: „more than twice as often“ stimmt. „this year“: begutachtet erschienen 2026 (USENIX, August), Vorabfassung Dezember 2025, vertretbar. Die Einblendung „46 % vs 18 % · 22 participants · one week“ stimmt.

---

## Nicht gezählt: Wertungen und Folgerungen des Films
- Z. 4, 7: Hauptfrage und Leitgedanke.
- Z. 5, 73, 74: Szene (SCENARIO), ohne Faktenanspruch.
- Z. 14 „She was certain. Anyone would be.“: Wertung; passt zu Nr. 4 (bei Stimmen sagt die Selbstsicherheit nichts über den Treffer).
- Z. 27, 35, 49, 62, 71: Regeln und Rat (Expertenrat; dass die Wirkung nicht gemessen ist, sagt Z. 63).
- Z. 40, 46, 56, 64, 66, 67, 68, 70: Folgerungen des Films, in text-v2 als solche markiert. Z. 46 („as long as she talked to them, she could not call her daughter“) deckt sich mit Nr. 8: Das Telefon sollte anbleiben, die Tochter erreichte sie erst danach.

## Hinweise fürs Bild (nicht im Ton)
1. 0:13 „+59 %“ gilt für das Geld (7,748 statt 4,885 Mrd. $); die Beschwerden stiegen um 37 %.
2. 1:58 und 2:13 Codewort: als Beleg die FBI-PSA vom 5.12.2025 nennen (jünger als 12 Monate), die vom 3.12.2024 nur mit „Stand 2024“.
3. 3:40 „Canada, 2026“ besser als „Canada · reported June 2026“ (die Anzeige lief im Sommer 2025).
4. 3:58 „FBI 2025: first-ever AI category · $893 million · likely higher“ passt zur Korrektur in Z. 33. Die 352 Mio. $ für Über-60-Jährige stammen nur aus Auswertungen, nicht aus dem PDF selbst: nicht einblenden.
5. 5:26 C10 als Zitatkarte, ohne Overby als Sprecher.
6. 7:39 Maryland und North Carolina: „65+“ ergänzen, wenn Platz ist.
7. Diese Einblendungen stimmen: 0:32 „54 %“, 2:46 „4,700+ AI personas · 2 weeks · 3 of 4 profiles“, 3:52 „$3.5 billion · nearly double“, 5:47 „6 % … 70 %“, 9:05 „46 % vs 18 % · 22 participants · one week“.

## Offen
1. Die Volltexte der Behörden-PDFs (IC3-Bericht 2025, FTC-Bericht 19.10.2026, Aussagen Del Mastro und Benda, FINRA 4512, Gesetzestexte Maryland und North Carolina) waren aus der Sitzung nicht abrufbar. Alle gesprochenen Zahlen stimmen zwischen dem Suchauszug der Primärquelle und mindestens einem Bericht überein.
2. Zeitmarken für S1, S2 und C1 in `clips.json` eintragen, dann `clip_check.py` laufen lassen.
3. Mit C10 als Zitatkarte bleiben drei echte Clips (S1, C1, S2): Die Untergrenze aus REGELN §7 (3 bis 6) ist gerade noch erfüllt. Ob die Karte mit dem Originalton des Podcasts läuft oder stumm, entscheidet die Produktion; die Clip-Zeile in `vo-v3.txt` bleibt als Platzhalter.
4. Die gelben Punkte 11 (Stimme aus Gepostetem) und 12 (Codewörter der Familie, nur ein Bericht) bleiben sprechbar; für 11 steht dort eine Ausweich-Formulierung.

## Änderungen vo-v2 → vo-v3

1. **Z. 33** (Step 3, ~3:58) · Nr. 25 · zu starke Behauptung
   - vorher: How much of that involved A.I. has never been measured. But a forged famous face is now one way in.
   - nachher: How much of that involved A.I. has never been **reliably** measured. But a forged famous face is now one way in.
2. **Z. 61** (Step 5, ~7:57) · Nr. 39 · Clip-Wortlaut am Ton (Anweisung des Koordinators)
   - vorher: [CLIP S2: "In these moments, human judgment and the relationship between banker and customer can be just as important as any algorithm."]
   - nachher: [CLIP S2: "In **those** moments, human judgment and the relationship between banker and customer can be just as important as any algorithm."]

Alles andere ist wortgleich mit `vo-v2.txt`: Tags, Zeilen und Leerzeilen sind unverändert. Der Sprechtext hat ein Wort mehr.
