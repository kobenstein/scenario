# Fact check v4 · "AI-Native Companies Are Rising" (firmen-vo-v4.txt)

As of 23.10.2026 · upload planned for about the end of October 2026 · independent check before voice recording

**Method:** WebFetch and curl are blocked in this environment (the proxy returns 403/DNS errors, including for sequoiacap.com, youtube.com and sifted.eu). I checked everything through web search, restricted to primary domains wherever possible (x.com posts by the authors themselves, worldbank.org, pib.gov.in, ethz.ch/epfl.ch, aeaweb.org, pubsonline.informs.org/hbs.edu, fortune.com, readcoop.eu/transkribus.org). Wherever I only saw search snippets, the item also appears in section 2 (browser check).

**Biggest new finding:** Two people in the film have a conflict of interest the voice-over doesn't mention. (1) Roelof Botha is not just "the investor". He has been **Lead Independent Director of Block** since 2022, on Block's board since 2011. Dorsey himself writes: "our lead independent director @roelofbotha and i wrote…". (2) **Tom Blomfield has been on leave from YC since 13.07.2026 and works at Anthropic** (his own X post). "Tom Blomfield of Y Combinator" is therefore outdated at upload, and the film quotes Anthropic's CEO a few minutes later.

---

## 1. MUST CHANGE (7)

| # | Sentence (v4) | Problem | Source | Replacement sentence (ready to speak) |
|---|---|---|---|---|
| 1 | "Y Combinator, which funds young startups, tells its founders to transcribe literally every meeting. Then, as Tom Blomfield of Y Combinator puts it, your entire company becomes queryable." | **Outdated + undisclosed conflict of interest.** Blomfield has been on leave from YC since 13.07.2026 and works on Anthropic's compute team. Also, the meeting advice is Blomfield's own tip ("I would…", "the tips we're giving founders"), not a formal YC rule. The quote itself is correct (transcript 4:06 and 18:15). | x.com/t_blom/status/2076580921398931788 · thenextweb.com/news/tom-blomfield-monzo-founder-anthropic-compute · transcript [4:06], [18:15] | "Tom Blomfield, then a partner at Y Combinator, which funds young startups, told founders to transcribe literally every meeting. Then, he says, your entire company becomes queryable. He has since moved to Anthropic, a lab that builds artificial intelligence." |
| 2 | "Every night, the company repairs itself. Every morning, it's a little better than the day before." | **Too strong / merged.** Blomfield describes **one** internal data-query tool. The second agent "puts in pull requests", meaning it proposes fixes. "The company repairs itself" generalizes from one tool to the whole company. Blomfield himself: "no one knows how to do this … very theoretical". | Transcript [8:08], [0:03] | "Every night, the tool proposes its own repairs. Every morning, it works a little better than the day before." |
| 3 | "Jack Dorsey of Block and the investor Roelof Botha put it in six words." | **Undisclosed conflict of interest + "six words" too strong.** Botha is Lead Independent Director of Block, and the essay appeared a few weeks after Block cut about 4,000 jobs (from over 10,000 to under 6,000). The six words come from a longer sentence ("…and the people are the edge constantly aligning it"). They didn't put it "in six words". | x.com/jack/status/2039004606890463261 · x.com/sequoia/status/2039010841828446330 · fortune.com/2026/04/02/jack-dorsey-roelof-botha-ai-middle-management/ | "Jack Dorsey, who runs the payments company Block, and Roelof Botha, who sits on Block's board, wrote it like this, a few weeks after Block cut about four thousand jobs." |
| 4 | "In Austin, a founder who had been laid off started a company with about three hundred dollars. Today, the company says, it's three people and twelve agents." | **Outdated time word + merged facts.** The source is Fortune, 18.04.2026, six months before upload, so "Today" isn't backed. Also, he founded it with two partners from the start ("with 2 partners and 12 agents"). He didn't start alone and then grow. | fortune.com/2026/04/18/ai-layoff-became-founder-team-of-3-instant-profit/ | "In Austin, a man who had been laid off started a company with two partners and about three hundred dollars. This spring, the company said it ran on the three of them and twelve agents." |
| 5 | "Almost twice as many as the year before." | **Ambiguous comparison, misleading as written.** "The year before" sounds like all of 2025. But in all of 2025 there were about 600,000 new apps, which is *more* than the 560,000 in the first half of 2026. Sensor Tower compares the first half with the first half: the number **doubled**. | 9to5mac.com/2026/07/20/report-app-store-added-nearly-as-many-new-apps-in-h1-2026-as-in-all-of-2025/ · mactech.com/2026/07/20/… (Sensor Tower via NYT) | "About twice as many as in the same months the year before." |
| 6 | "Those already doing well earned more than fifteen percent more. Those who were struggling earned almost ten percent less." | **Too strong.** The percentages only appear in the working paper and Haas coverage, phrased as "may have benefited by over 15%" and "nearly 10% worse". The published Management Science version (10.07.2026) reports standard deviations, not percentages. The outcome is an index of revenue **and** profit, not "earnings". The HBS faculty page even says "just over 20%", so the numbers vary by version. | doi.org/10.1287/mnsc.2024.06909 · hbs.edu/ris/download.aspx?name=24-042.pdf · newsroom.haas.berkeley.edu/research/gen-ai-experiment-shows-mixed-results-in-helping-small-businesses-grow/ | "Those already doing well did about fifteen percent better. Those who were struggling did almost ten percent worse." |
| 7 | "Nobody has built a shared company brain like that yet." | **Absolute negative claim that can't be verified.** Our research only says "no documented case found". | recherche-firmenumbau.md §5 (own finding) | "We couldn't find anyone who has built a shared company brain like that yet." |

### Recommended (not mandatory, but cheap)
- **"Twenty twenty-six. It's a prediction, and nobody has done it yet."** → "…and as far as anyone can show, nobody has done it yet." Reason: Medvi (NYT, April 2026, two employees, $1.8 bn revenue *forecast*, no valuation) is cited as a counter-example in comments. Not wrong, but open to attack.
- **Amodei context:** According to Inc., at a press session right afterwards he hedged it to "probably 70 to 80 percent" and "maybe a two-person company". Optional: "Twenty twenty-six, he said, though he later called it likely, not certain."
- **Hook "They have almost no employees. They never forget anything."** is rhetorical generalization. Optional: "Some have almost no employees. They forget almost nothing."
- **India:** "for less than a dollar per chip, per hour" is backed by the PIB figure of ₹65/hour (about $0.75). The PIB AI Stack paper also says "under ₹100" (about $1.15), and some reports give ₹92 for H100. Safer: "**from** less than a dollar per chip, per hour".
- **Read Co-op:** The AI is handwriting recognition for historical documents (Transkribus). Optional for honesty: "…that runs its own artificial intelligence for reading old handwriting." **Pronunciation for Eleven:** "Read" like "reed" (READ = Recognition and Enrichment of Archival Documents). Spell it as "Reed Co-op" in the voice text if needed.

---

## 2. Check in the browser (I couldn't open these)

1. **Clip time stamp & audio** (youtu.be/Z3JyAqh4ixg): Listen to 8:40–9:00. Based on word position in the transcript chunk [8:08]–[9:08], I estimate the clip at **about 8:44 to 8:58**, which fits 8:45–8:57. The transcript is auto-generated, so check by ear: "that second AI agent overnight goes and puts in pull requests to fix all of the problems from the day before. And so, if you go back as a human on the second day and run the same query as yesterday, it now works." In the transcript, "And then" comes right before "that second", so make the cut cleanly.
2. **Video metadata of Z3JyAqh4ixg:** title, channel, upload date, and where/when the talk was given. Hints: Blomfield says "based on a talk I gave about … 6 weeks ago" (YC batch talk, posted by YC on X around 20.05.2026, x.com/ycombinator/status/2056908727400423481). He still speaks as a YC partner, so the talk was before 13.07.2026. The fact sheet's date of "14.08.2026" is probably the upload date, not the talk date. Check whether the video is on the YC channel (rights for the clip).
3. **Dorsey/Botha full essay** (block.xyz/inside/from-hierarchy-to-intelligence or sequoiacap.com/article/from-hierarchy-to-intelligence): confirm the date 31.03.2026 and the sentence "the intelligence lives in the system and the people are the edge constantly aligning it". I only saw it in Sequoia's X post (which quotes it word for word).
4. **Botha X post** (x.com/roelofbotha/status/2039007446665236503): "For 2,000 years, humans have organized themselves in roughly the same way." The search snippet matched word for word. Check it once by eye.
5. **World Development Report 2026, full text**: the exact wording of the warning about dependence on a single provider (I only saw "work with multiple platforms and providers, reducing dependence on any single company or foreign supplier" in summaries). worldbank.org/en/publication/wdr2026
6. **Kenya Management Science full text**: whether the published version still gives percentages anywhere (+15 % / −10 %). If not, the replacement sentence in #6 stays based on the working paper.
7. **IndiaAI portal**: current rate card (₹65 vs. ₹92 per GPU hour), indiaai.gov.in.
8. **Fortune Fathom article**: check "laid off" (Sam Brown) and "$300 total startup capital" in the full text (paywall).

---

## 3. Full claim table

Status: **ok** · **overstated** · **wrong** · **unverifiable**

| # | Claim in the VO | Status | Note | Source |
|---|---|---|---|---|
| 1 | "A.I.-native companies are rising." | ok | Framing; YC/Blomfield talk "building AI-native companies" | Transcript [0:03] |
| 2 | "They have almost no employees. They never forget anything. And they keep working while everyone sleeps." | overstated (rhetorical) | Hook generalization; see recommendation | – |
| 3 | "Some say soon one of them will be worth a billion dollars, run by a single person." | ok | Amodei 2025, Altman 2024 | inc.com/ben-sherry/anthropic-ceo-dario-amodei-predicts-the-first-billion-dollar-solopreneur-by-2026/91193609 |
| 4 | Ordinary company: knowledge in people's heads | ok | Matches Blomfield/Dorsey ("intelligence lives in the people") | Transcript [14:12] |
| 5 | "An A.I.-native company keeps everything … in one place." | ok (idea) | Blomfield's "company brain" idea, a goal not the norm | Transcript [14:12]–[15:12] |
| 6 | "Silicon Valley calls it the company brain." | ok | YC RFS "Company Brain" (Blomfield); Blomfield: "overused term … very popular about 6 weeks ago" | x.com/ycombinator/status/2048834293779378437 · ycombinator.com/rfs · transcript [13:11] |
| 7 | "Y Combinator, which funds young startups, tells its founders to transcribe literally every meeting." | overstated (MUST 1) | Wording "transcribing literally every meeting" correct; Blomfield's own tip | Transcript [18:15] |
| 8 | "Then, as Tom Blomfield of Y Combinator puts it, your entire company becomes queryable." | wrong as of upload (MUST 1) | Quote word for word ✓; affiliation outdated (Anthropic since 13.07.2026) | Transcript [4:06] · x.com/t_blom/status/2076580921398931788 |
| 9 | Agents: "artificial intelligence that doesn't just answer, but acts" | ok | Definition | – |
| 10 | "At Y Combinator, one agent answers the team's data questions all day." | ok | English-to-SQL agent over data on 7,000 companies | Transcript [7:08] |
| 11 | "At night, a second one goes looking for everything that failed." | ok | "runs overnight … looks for success and failure" | Transcript [8:08] |
| 12 | CLIP 8:45–8:57 | ok (wording), time stamp likely | Wording identical to transcript; estimate 8:44–8:58, check in browser | Transcript [8:08] |
| 13 | "Nobody told it what to fix. It found the problems itself." | ok | Agent finds the failures itself | Transcript [8:08] |
| 14 | "Every night, the company repairs itself." | overstated (MUST 2) | One tool, pull requests = proposals | Transcript [8:08] |
| 15 | "Jack Dorsey of Block and the investor Roelof Botha put it in six words." | overstated + conflict of interest (MUST 3) | Botha = Lead Independent Director of Block | x.com/jack/status/2039004606890463261 |
| 16 | QUOTE CARD "the intelligence lives in the system", March 2026 | ok | Word-for-word excerpt; essay 31.03.2026 | x.com/sequoia/status/2039010841828446330 · block.xyz/inside/from-hierarchy-to-intelligence |
| 17 | "Not in a chain of managers, passing messages up and down." | ok | Essay contrast "the hierarchy routes it" | x.com/sequoia/status/2039010841828446330 |
| 18 | Will/conductor section | ok (interpretation) | Fits Dorsey's "people are the edge" | Transcript [15:12] |
| 19 | "Big companies are already leaning this way." | ok | Shopify, Block | – |
| 20 | Shopify: a team must first show why artificial intelligence can't do the job | ok | "Before asking for more Headcount and resources, teams must demonstrate why they cannot get what they want done using AI" (Lütke, memo posted on X 07.04.2025) | shopify.com/careers/candidate-guide/ai-usage · cnbc via nbcsandiego.com |
| 21 | Austin, laid-off founder, ~$300 | ok (content) | Sam Brown, laid off 9 months earlier; startup capital $300 | fortune.com/2026/04/18/ai-layoff-became-founder-team-of-3-instant-profit/ |
| 22 | "Today, the company says, it's three people and twelve agents." | overstated / outdated (MUST 4) | April 2026; co-founders from the start | same |
| 23 | Amodei was asked when the first one-person billion-dollar company would appear | ok | Code with Claude, 22.05.2025, Q&A with Mike Krieger | inc.com (above) · benzinga.com/tech/25/05/45602384/… |
| 24 | QUOTE CARD Amodei, May 2025, "2026" | ok | Answer "2026"; later hedged to 70–80 % (see recommendation) | inc.com (above) |
| 25 | "nobody has done it yet" | ok, open to attack | Medvi disputed (2 employees, no valuation) | techdirt.com/company/openloop/ · ilpost.it/2026/04/10/mito-startup-unicorno-un-solo-dipendente/ |
| 26 | ~560,000 new apps in the first half of this year | ok | Sensor Tower via NYT, 20.07.2026; "this year" = 2026 ✓ | 9to5mac.com/2026/07/20/… |
| 27 | "Almost twice as many as the year before." | overstated / ambiguous (MUST 5) | H1 vs. H1 doubled; all of 2025 ≈ 600,000 | same · mactech.com/2026/07/20/… |
| 28 | "Downloads? Up by two percent." | ok | +2 % to 17.6 bn (H1) | same |
| 29 | Kenya: 640 small business owners, advisor on WhatsApp | ok | GPT-4 mentor, 5 months, randomized | doi.org/10.1287/mnsc.2024.06909 |
| 30 | "On average, nothing changed." | ok | "unable to reject the null hypothesis of no average treatment effect" | same |
| 31 | +15 % / −10 % "earned" | overstated (MUST 6) | Working paper: "may have benefited by over 15 %", "nearly 10 % worse"; index of revenue + profit | hbs.edu/ris/download.aspx?name=24-042.pdf · newsroom.haas.berkeley.edu (above) |
| 32 | "Similar advice. Different choices." | ok | "does not appear to result from differences in the questions … or the advice … but rather from the advice that entrepreneurs chose to implement" | doi.org/10.1287/mnsc.2024.06909 |
| 33 | Mentoring study Kenya, women, local businesswoman as mentor | ok | 372 women microentrepreneurs; mentor from the same industry | aeaweb.org/doi/10.1257/app.20170042 |
| 34 | "from before these tools" | ok | AEJ Applied 2018 | same |
| 35 | Profits about +20 %, "the effect faded later" | ok | Effect faded once the mentoring matches ended | same · povertyactionlab.org |
| 36 | Shopify rule "turned around" / savings / "Boards decide" | ok (opinion) | – | – |
| 37 | World Bank, new World Development Report | ok | WDR 2026 "The Promise of Artificial Intelligence", 04.08.2026 | worldbank.org/en/publication/wdr2026 · worldbank.org/en/news/press-release/2026/08/04/ai-offers-lifeline-to-developing-economies-in-an-era-of-weak-growth |
| 38 | Small, cheap tools via text message or simple phone | ok | "small AI … text messages, voice calls, and basic phones" | same |
| 39 | India: public program, compute for startups and small firms, less than a dollar per chip, per hour | ok (recommendation "from") | ₹65/GPU hour (PIB); also open to research/students; access by application | pib.gov.in/FeaturesDeatils.aspx?NoteId=157442&ModuleId=2&reg=48&lang=1 · static.pib.gov.in/WriteReadData/specificdocs/documents/2026/feb/doc202625780001.pdf |
| 40 | "Nobody has measured it yet." (India) | unverifiable, plausible | No impact study found | – |
| 41 | World Bank warning: don't depend on a single provider | ok (wording in browser) | "multiple platforms and providers, reducing dependence on any single company or foreign supplier" (summaries) | dig.watch/updates/world-bank-developing-countries-to-embrace-ai · WDR PDF |
| 42 | "cheap tools alone didn't lift the ones who were struggling" | ok | Kenya artificial intelligence study | doi.org/10.1287/mnsc.2024.06909 |
| 43 | "Nobody has built a shared company brain like that yet." | unverifiable (MUST 7) | Absolute negative claim | – |
| 44 | Apertus "fully open"; anyone can see how it's built, and use it | ok | Weights, training data, recipes, checkpoints, commercial use allowed; 02.09.2025 | ethz.ch/en/news-and-events/eth-news/news/2025/09/press-release-apertus-a-fully-open-transparent-multilingual-language-model.html |
| 45 | Read Co-op, owned by its members, runs its own artificial intelligence | ok | READ-COOP SCE (European cooperative), Transkribus; members are co-owners, elected board | readcoop.eu · help.transkribus.org/hubfs/Statutes_READ_COOP_SCE_current.pdf |
| 46 | "Lawmakers… Governments… And you" | ok (opinion) | – | – |
| 47 | Botha: "For two thousand years … humans have organized themselves in roughly the same way." | ok | X post 31.03.2026, word for word | x.com/roelofbotha/status/2039007446665236503 |
| 48 | "Maybe someone will build a billion-dollar company alone." | ok | – | – |

---

## 4. Sources for the YouTube description (grouped by topic)

**Company brain & AI-native companies (Y Combinator)**
- Tom Blomfield, talk on AI-native companies (clip source): https://youtu.be/Z3JyAqh4ixg
- Y Combinator, Requests for Startups, "Company Brain": https://www.ycombinator.com/rfs
- Tom Blomfield on joining Anthropic (13.07.2026): https://x.com/t_blom/status/2076580921398931788

**Block: "From Hierarchy to Intelligence"**
- Jack Dorsey & Roelof Botha, essay (31.03.2026): https://block.xyz/inside/from-hierarchy-to-intelligence
- Sequoia excerpt: https://x.com/sequoia/status/2039010841828446330
- Roelof Botha, "For 2,000 years…": https://x.com/roelofbotha/status/2039007446665236503
- Dorsey on co-author Botha (Block's lead independent director): https://x.com/jack/status/2039004606890463261
- Fortune on the essay and Block's job cuts: https://fortune.com/2026/04/02/jack-dorsey-roelof-botha-ai-middle-management/

**Companies & predictions**
- Shopify, Tobi Lütke's memo on AI use: https://www.shopify.com/careers/candidate-guide/ai-usage
- Fortune on Fathom AI (Austin): https://fortune.com/2026/04/18/ai-layoff-became-founder-team-of-3-instant-profit/
- Inc. on Dario Amodei's "2026" prediction: https://www.inc.com/ben-sherry/anthropic-ceo-dario-amodei-predicts-the-first-billion-dollar-solopreneur-by-2026/91193609

**App Store (Sensor Tower)**
- 9to5Mac on Sensor Tower data, first half of 2026: https://9to5mac.com/2026/07/20/report-app-store-added-nearly-as-many-new-apps-in-h1-2026-as-in-all-of-2025/

**Studies from Kenya**
- Otis, Clarke, Delecourt, Holtz, Koning, "The Uneven Impact of Generative AI on Entrepreneurial Performance", Management Science (2026): https://doi.org/10.1287/mnsc.2024.06909 (working paper: https://www.hbs.edu/ris/download.aspx?name=24-042.pdf)
- Brooks, Donovan, Johnson, "Mentors or Teachers? Microenterprise Training in Kenya", AEJ: Applied (2018): https://www.aeaweb.org/doi/10.1257/app.20170042

**Access: World Bank & India**
- World Bank, World Development Report 2026: https://www.worldbank.org/en/publication/wdr2026
- World Bank press release (04.08.2026): https://www.worldbank.org/en/news/press-release/2026/08/04/ai-offers-lifeline-to-developing-economies-in-an-era-of-weak-growth
- IndiaAI compute, ₹65 per GPU hour (PIB): https://www.pib.gov.in/FeaturesDeatils.aspx?NoteId=157442&ModuleId=2&reg=48&lang=1

**Shared ownership**
- Apertus (EPFL, ETH Zurich, CSCS): https://ethz.ch/en/news-and-events/eth-news/news/2025/09/press-release-apertus-a-fully-open-transparent-multilingual-language-model.html
- READ-COOP SCE / Transkribus: https://readcoop.eu

## Umgesetzt (23.10., Lead)
Alle 7 Pflichtänderungen + Empfehlungen Amodei („as far as anyone can show“) und Read Co-op („for reading old handwriting“) → firmen-vo-v5.txt (Sprechfassung für George). Hook-Verallgemeinerung bewusst gelassen (rhetorisch). Clip-Bauchbinde: „Tom Blomfield, then partner at Y Combinator“.
