# Film 02 · The Curve You Can't See — Script review v1

Reviewed: script.md (Version 1, 2026-10-17) against sources.md. Reviewer stance: harsh. Line numbers refer to script.md.

**Overall:** The structure is strong. The Moore hook, the IEA "flat line" story, the no-knee reveal, the fork, two endings, four solutions and the callback to "flat" are all the right pieces. Three things hold it back. (a) Two factual statements contradict their own sources, and both sit in the AI-safety section, where credibility matters most (Anthropic "hit" a line; "Some already have"). (b) The central reveal draws the wrong conclusion from its own maths ("isn't just hype"). And it is partly undercut twice, by "That's what makes a curve bend" (L43) and by giving the punchline away at 0:30 (L19–21). (c) The voice falls back on AI-script habits: announcement phrases, colon labels, six or seven "Not X. Y." lines and a slogan at the end of nearly every section.

---

## TOP 10 CHANGES (by impact)

### 1. Anthropic did not "hit" a line (L111). This is a factual error against a verified primary source.
S22 says explicitly: "We have not yet determined whether Claude Opus 4 has definitively passed the Capabilities Threshold." The line was not hit. Anthropic could no longer *rule it out*. That distinction is the whole point of a precautionary tripwire, and it makes the example *better*. The source also says CBRN, not just "biological".
> **Rewrite L111:** "In May twenty twenty-five, Anthropic was about to release a new model, Claude Opus 4. For the first time, its tests couldn't rule out that the model might give real help to someone trying to build a chemical or biological weapon. It hadn't proven the line was crossed. It just couldn't rule it out anymore. So it launched with stricter safeguards anyway, as a precaution. [S22]"

### 2. "Some already have" (L113) is vague, implies several companies, and dodges the one case that is verified.
S24 documents exactly one case, and it is Anthropic itself (RSP v3, Feb 2026, dropped the pause commitment). If the film praises Anthropic one line earlier and then hides this behind "some", it reads as favouritism. Naming it is more honest, and it makes "this needs to be law" land much harder.
> **Rewrite L113–114:** "The weak spot? The companies mostly grade themselves, and they can rewrite their own rules. Anthropic did, early this year. It dropped its promise to pause if its safeguards weren't ready, arguing that one lab can't hold the line alone. Critics called it a broken promise. [S24] That's why we think the tripwires belong in law, tied to measurements, not to dates."
(Use "early this year" only because the film is dated 2026. Otherwise say "in early twenty twenty-six".)

### 3. Fix the logic of the central reveal (L19–21, L43, L58–64).
- **L63 is a non sequitur.** The no-knee insight shows that *everyone* on an exponential feels they are at the turning point. So the feeling is **not evidence** of anything. The script flips this into "so the feeling isn't just hype", which is the opposite of what it just proved. This is the mind-opening moment, and as written it lands as reassurance for hype.
- **L43 "That's what makes a curve bend"** contradicts L58 "there is no bend" ninety seconds later.
- **L19–21 gives the reveal away at 0:30.** "Behind you flat, ahead a wall" is the payoff of section 5. The hook should ask the question, not answer it.
- **L58 "Every point is the same kind of point"** is abstract. Show it.
> **Rewrite L19–23:** "Today everyone says we're at the turning point for AI. The moment the curve bends. [pause] So here's a question I couldn't let go of. If we really were at that point, how would we know?"
> (If that feels too announce-y, drop "So here's a question I couldn't let go of" and keep only the question.)
>
> **Rewrite L43:** "The result feeds its own cause. That's what makes growth compound."
>
> **Rewrite L58–64:** "On a true exponential, that bend isn't in the curve. It's in the chart. Where it seems to bend depends only on where you cut it off. [S29] [pause] Stand in nineteen ninety, and the line behind you looks flat and the next few years look like a wall. Stand in twenty ten, same thing. Stand here, same thing. Behind you, it always looks flat. [softly] So everyone who lives on a curve like this feels like they're at the turning point. And that feeling, on its own, tells you almost nothing. [pause] What does tell you something is speed. How fast is it doubling? And how many doublings does it take us to react?"
("How fast are we?" was too vague to mean anything. "How many doublings does it take us to react" makes it measurable, and it sets up "rules written for the world of two doublings ago" in the bad ending.)

### 4. Moore's line did not "keep going for sixty" as drawn (L15, L68). L68 cites the wrong source.
Moore cut his forecast to a doubling every two years in 1975 (S3). L68 "Moore's law itself has slowed down [S26]" cites Dennard scaling, and S26 says the opposite: "transistor counts kept rising." Use S5 ("which I thought was a stretch"). It is truer and better for the story, and it sets up the ending.
> **Rewrite L13–15:** "So Moore did something he himself called a stretch. He kept the line going, ten more years. [S1, S5] [pause] It's been sixty."
>
> **Rewrite L12:** "That number had been doubling. Roughly every year. [S1]"
>
> **Rewrite L68:** "No real curve doubles forever. Bacteria run out of food. Moore himself had to slow his line down to a doubling every two years [S3], and around two thousand six, chips hit a heat wall. Clock speeds stopped climbing. [S26]"
> "Chips run into the size of atoms" has no source. Cut it or add one.

### 5. The Seoul commitments are overstated (L110).
S23 describes voluntary commitments to *publish frameworks with thresholds*, and "**in the extreme**", not to develop or deploy a model if its risks can't be kept below them. The script makes this absolute ("it doesn't get built or released") and changes the trigger to "too close to one". It also creates a TTS number collision: "twenty twenty-four, sixteen".
> **Rewrite L110:** "Sixteen AI companies met in Seoul in twenty twenty-four and signed voluntary commitments. Each would publish its own danger lines in advance. And in the extreme, if it couldn't keep a model's risks below those lines, it wouldn't build or release that model at all. [S23]"

### 6. Tighten the AI numbers (L48–51). Each one is slightly stronger than its source.
- **L48 "every single year"**: S8 is a fitted trend (about 4.1x, CI 3.7–4.6). Cut "every single".
- **L49 "in a year"**: S9 gives a *rate* (40x per year), on one benchmark, and the range across tasks is 9–900x. Keep "on one test" and make it a rate.
- **L50 METR**: drops the defining caveat. Task length is measured *in human time*, at *about 50% success*. "Finish on its own" suggests reliability. "Lately, even faster" is stronger than "may have accelerated".
- **L51 "AI now helps write the code for the next AI"**: no source in the table. It is the most hype-adjacent line in the film. Source it (and add a row) or cut it.
> **Rewrite L48:** "The computing power used to train the leading AI models has grown four to five times a year since twenty ten. [S8]" (Optional: "That's a doubling roughly every five or six months.")
>
> **Rewrite L49:** "Running them gets cheaper even faster. On one test of PhD-level science questions, the same quality of answer has been getting about forty times cheaper per year. [S9]"
>
> **Rewrite L50:** "And the tasks AI can finish on its own, at least half the time, keep getting longer. Measured in how long they'd take a person, that length has doubled roughly every seven months. And lately it may be speeding up. [S28]"
>
> **L51:** cut, or find a source and soften it to "and AI companies say their models already write a good share of their own code".

### 7. Pakistan: three of the claims have no source (L126–128).
- "farms" is not in S18 (households and businesses).
- "millions of people did the math": "millions" has no source.
- "**The grid company lost customers**": S19 says rooftop solar *cut grid sales* by 3.2 billion kWh. Selling less power is not the same as losing customers.
- "people without a roof or savings got left behind": no source. As written it is a factual claim about outcomes.
> **Rewrite L126–128:** "Mostly for rooftops. Shops, offices, families escaping high power bills. [S18] Nobody planned it from above. Panels got cheap enough, and people did the math. [pause] It's messy. The national grid now sells less power, and the government has been rethinking the deal it gives rooftop owners. [S19] And a panel still needs a roof, and the money to buy it."
> (The last sentence is logic, not a claim about outcomes, so it is safe without a source.)

### 8. Make the fork a real decision, and make Reveal 2 an actual reveal (L77–96).
- **L82 "What we do while it still looks flat"** is not a choice between options. Spell out the two options and show the maths that makes waiting expensive. The doubling countdown is the second mind-opener the film is missing. It is pure arithmetic, so no source is needed: 7 doublings × 7 months ≈ 4 years, and 1/128 ≈ 0.8%.
> **Rewrite L80–82:** "Most of us would say, once it gets big. [pause] But run it backwards. Seven months before it's everywhere, it's at half. Fourteen months before, a quarter. About four years before, it's under one percent. It looks like nothing. [pause] So that's the fork. Either we wait until it's obvious, or we act on the doubling time."
- **The bad ending is abstract, and the good ending is concrete.** That asymmetry makes the bad ending feel like a strawman. Mirror the same student at the same desk.
> **Add after L87:** "The student in Lahore? Her school banned the new tools. She picked them up two years late, from a cousin's phone."
- **L95–96 "And this is the strange part. / The good ending runs on the same curve."** is an announcement plus a slogan, and it is not much of a revelation. The real reveal is that *nothing about the technology differs* between the two endings. Only the timing of attention does.
> **Rewrite L95–96:** "Look at what's the same in both. Same chips. Same curve. Same speed. The only thing that changed is when people started paying attention."
> (This one triad is earned. Cut triads elsewhere to pay for it.)

### 9. Remove the AI-voice habits.
- **Announcements:** L19 "Curves like his have a strange property." L40 "The engine behind it is simple." L64 "The better question is a plainer one." L95 "And this is the strange part." L102 "The first is almost embarrassingly simple." Delete all of them and start with the content.
- **Colon labels:** L80 "Most people say: once…", L109 "The second:", L113 "The weak spot:", L117 "The third:", L124 "And the fourth:". (Rewrites are in the line-by-line list.)
- **"Not X. Y." / "X, not Y":** L63, L82, L105, L109, L121, L126, L136. **Keep only L109** ("tie the brakes to the curve, not the calendar"). It is the film's best line of that kind.
- **Slogan endings:** L43, L59, L96, L112, L114, L121, L129, L130. A friend telling a story doesn't close every paragraph with a moral. Keep three in the whole film: L59 "Behind you, it always looks flat", L112 (the tripwire line), and the final line.
- **Symmetric pairs:** L20/21, L38, L42, L56, L90. Keep L42 (it explains the loop) and L56 (it is the visual gag). Break up the rest.

### 10. Close the gaps in the solutions, and stop viewers leaving in section 9 (6:45–9:45).
Three minutes announced as "Four things" is where viewers drop off. Open each solution with a problem or question instead of a numbered label. Each solution also has a gap:
| Solution | Answer | Evidence | Transfer | Limits | Fix |
|---|---|---|---|---|---|
| Read it | ✓ | S11 ✓ | ✓ L106 | weak | Use S10 honestly: in 1975, special instructions did **not** help. That is a real limit and it is sourced. |
| Wire it | ✓ | S23, S22 ✓ | weak ("needs to become law") | ✓ L113 | Fixed by item 2. Add the limit that law is slow, then say this is why it should be tied to measurements. |
| Point it | ✓ | S20/21 ✓ | **missing** | ✓ | Add a transfer: "Which problem in your field is still waiting for its map?" (Optional: public data that AlphaFold learned from. Needs a source row, e.g. the Protein Data Bank.) |
| Share it | ✓ | solar ✓, **AI: none** | slogan triad | partly unsourced | L130 "Open tools, public computing power, schools" has no evidence. Add one sourced AI-access example or say plainly that it is undecided. |
> **Openers:**
> - Read it: "So how do we get there? Start with the cheapest fix there is. Learn to read the curve."
> - Wire it: "But reading the curve doesn't stop anything. For that you need brakes, and they should be tied to the curve, not the calendar."
> - Point it: "Brakes only tell the curve where not to go. Where should it go?"
> - Share it: "And then there's the question of who gets to ride it."

---

## LINE-BY-LINE

### 1 · Hook
- **L10** "In April, nineteen sixty-five, a chemist named Gordon Moore drew a line through a handful of dots." The first sentence is quiet and carries no stakes. "Chemist" is true but has no source (harmless). "Handful" is a safe fit with S1/S2 (about 5 points, secondary). Only say "five dots" after checking the scan (p. 116). *Option:* "In nineteen sixty-five, a chemist named Gordon Moore drew a line through a handful of dots, and made a guess even he thought was a stretch." This puts a question (was he right?) into sentence one.
- **L11** Fine. Cut "Each dot was a year, and" → "Each dot showed how many parts engineers could squeeze onto a single chip."
- **L12** Add "Roughly" (item 4).
- **L13** "something a little bold" → "something he himself called a stretch" [S5] (item 4).
- **L15** OK once L13 is fixed. Honesty comes in L68 (Moore had to slow it).
- **L16** "This year's biggest AI chip": "biggest" has no source. → "Nvidia's newest AI chip holds more than three hundred billion of those parts. [S7]" Note: Rubin is a multi-die package, and L11 says "single chip". Either drop "single" in L11 or accept the small looseness. Optional add: "From sixty-five thousand to three hundred billion. A factor of about five million." [S7]. This needs ear-testing for number overload.
- **L17** "Chips like that are why the AI you talk to exists at all." This is the strongest causal claim in the hook and it has no source. → "Chips like that are what the AI you talk to runs on."
- **L19–23** Item 3. This also removes the symmetric flat/wall pair.

### 2 · Brains
- **L28** Fine.
- **L29** "That's how our brains are wired." There is no source, and S10 carries a reanalysis caveat. Cut it.
- **L30** S10 says "it is not unusual that two-thirds… below 10%". The script says "a doubling process", but the stimuli were exponential series in general. → "In one classic study from the seventies, people were asked to guess where a fast-growing series ends up. It wasn't unusual for two thirds of them to guess less than a tenth of the real answer. [S10]"
- **L31** "Psychologists call it exponential growth bias." No source row. The term is real (Stango & Zinman; also used in the Lammers literature). Add a row or cite S11 if the paper uses the term.
- **L32** Good handoff. Keep.

### 3 · Forecasters
- **L35** "Governments plan around it." No source. → "Governments and investors read it closely." (Still unsourced, but weaker.) Or cut it.
- **L36** S12 is about *annual additions* levelling off, not "solar power growing". → "For more than a decade, its main scenario kept showing the amount of new solar built each year levelling off. [S12, S13]"
- **L37** Fine.
- **L38** Symmetric pair plus slogan. → "Each year they drew a flatter future, and each year reality bent up past it. So the next year they drew another flat line." Fairness (mission): consider one clause noting that the IEA calls these projections, not forecasts (S13).
- **L40** Announcement. Delete. Start with L41.
- **L41** Add "tend to": "…they tend to get about twenty percent cheaper. [S15]" (S15 is a learning curve, not a law.)
- **L42** Keep.
- **L43** Item 3.
- **L44** Matches S14. Optional: "adjusted for inflation".

### 4 · AI loops
- **L47** Fine.
- **L48–51** Item 6.
- **End of section:** there is no question engine between 2:20 and 3:10, just four stats in a row, so this is a risk point for viewers leaving. Add as a bridge: "So is this it? Is this the moment it takes off?" Then L54 can be cut down to "Where does the curve bend?"

### 5 · No knee
- **L54** "So where's the turning point? Where does the curve bend?" Fine (or cut to one question if the bridge above is used).
- **L55** Good. "Right at the end." Keep.
- **L56** Good visual gag. Keep.
- **L58–64** Item 3.
- **L60–61** "In a way, they all are." This contradicts "no turning point" and confuses. Covered by the item 3 rewrite.

### 6 · Objection
- **L67** Fine.
- **L68** Item 4.
- **L69** "fresh human text" → "public human-written text". Also, 2026 is *now*, which is more honest and more vivid: "…expect it to be used up somewhere between now and twenty thirty-two. [S25]"
- **L70** True (+12% vs +32%), but bare. Use the S17 nuance, which is better material: "Even solar. Twenty twenty-five was a record year, but growth fell from about a third to about a tenth, and this year may be the first dip. [S17]"
- **L71** Fine.
- **L73** "were sure about the top, too" is slightly unfair (S13: "projections, not forecasts"). → "But the solar forecasters kept putting the top too early, too."
- **L74** Fine. This is the right non-naive close.

### 7 · Fork
- **L77** "So try this. Pause for a second." Announcement. → "Quick thought experiment."
- **L78** Good. It ties back to METR's seven months.
- **L80–82** Item 8.

### 8 · Two endings
- **L85** Fine. "Just a scenario" fits the channel.
- **L86–88** Add the concrete person (item 8). L88 "every surprise landed hardest on whoever had the least time to prepare" is good and stays non-alarmist. Keep it.
- **L90** "Same desk. Same year. The other version." Fine as a transition. (If L95 uses "Same chips. Same curve. Same speed.", change this to "Now the other version." to avoid two "Same…" triads.)
- **L92** 22 words, with a garden path. "in minutes" has no source. → "Her doctor has a new antibiotic, designed with help from a map of proteins that an AI drew."
- **L93** 22 words. "crossed a danger line" contradicts the S22 mechanism the film later praises. → "Last spring, an AI model got close to a danger line. Its extra safeguards switched on before anyone had to argue about it."
- **L95–96** Item 8.

### 9 · How we get there
- **L101–102** → "So how do we get there? Start with the cheapest fix there is. Learn to read the curve." (Cut "Four things, and every one of them has already started" or keep it, but not both that and the labels.)
- **L103** 23 words. "people" is too broad (US adults online, S11). → "In March twenty twenty, psychologists asked Americans how fast the virus would spread. Many of them pictured a straight line. [S11]"
- **L104** "a short explanation of how doubling works" is close enough to S11. Fine. "And they backed the measures to slow it down more strongly" → "And they backed social distancing more."
- **L105** "It's not a cure. Knowing isn't the same as doing." Two "Not X" lines. → "Back in nineteen seventy-five, instructions like that barely helped. [S10] So it's no cure. But it costs almost nothing."
- **L106** Good transfer. Keep.
- **L109** "The second:" label. See the item 10 opener. Keep "the curve, not the calendar" (the one permitted "X, not Y").
- **L110** Item 5.
- **L111** Item 1.
- **L112** Keep. It is one of the three slogans allowed.
- **L113–114** Item 2.
- **L117** "The third:" label. See item 10.
- **L118** "could take a lab years of work" has no source (S20 says "50-year-old problem" only). Add a source row (e.g. the Nobel popular-science background) or soften: "Predicting a protein's shape was a fifty-year-old problem. [S20] Working out a single one in the lab could take months, sometimes years."
- **L119** "virtually all two hundred million" matches S20. "Its makers shared a Nobel Prize" → "Two of the people behind it shared the Nobel Prize in Chemistry. [S20]" (Hassabis and Jumper shared *half* of it with Baker.)
- **L120** Matches S20/S21. Keep.
- **L121** "A map isn't a medicine" is another "Not X", plus a slogan close. → "A map still isn't a medicine. Most of the slow work is ahead. But it's a glimpse of the curve working for us." Then add the transfer (item 10).
- **L124** Label. See item 10.
- **L125** Matches S18. Keep.
- **L126–128** Item 7. ("Mostly not for big power plants. For rooftops." is another "Not X. Y." Handled there.)
- **L129** Slogan. → "So once something gets cheap, the fight moves to who can get it."
- **L130** "AI is getting cheaper even faster than solar did." This compares different metrics. Defensible with [S9], so add the tag. "Open tools, public computing power, schools that teach with it. That's where the fairness of this curve gets decided." is a triad plus slogan with no evidence. Add a sourced example or rewrite: "With AI, that fight is happening right now, over who gets the tools, the computing power and the teachers who know how to use them. Nobody has won it yet."

### 10 · Your part
- **L133** Good callback.
- **L134** "measured something carefully" romanticises five dots. The truer version is more inspiring: "Moore didn't guess big. He had a handful of dots, and he thought ten years was a stretch. But he took his own numbers seriously. [S5]"
- **L135** Fine.
- **L136** A triad, but it works as a call to action. Cut "not just promises" → "And ask the people who represent you to write the tripwires into law."
- **L138–139** A strong payoff of "flat". Keep.
- **L140** Acceptable, but generic. *Option* tying back to the pencil from the hook: "[softly] Moore drew his line in pencil. Ours isn't drawn yet."
- **L142** Fine.

---

## EAR / TTS
- **Over about 22 words:** L103 (23). Borderline at 22: L48, L92, L93. All are fixed by the rewrites above.
- **Number collisions:** L110 "twenty twenty-four, sixteen" (fixed in item 5). L48 "four to five times… since twenty ten" is OK once "every single" is cut.
- **"PhD-level"** (L49): test with Eleven v4. If it reads "fud", write "P-H-D-level" or use "graduate-level".
- **Pronunciations to pre-test:** Lahore, Epoch, AlphaFold, Claude Opus four.
- **Numbers** are already written as spoken. Good. Strip all [S#] tags and stage tags other than [pause]/[softly] before the TTS pass.
- **Runtime:** ~1,430 words is ~10 min at 140 wpm. The rewrites add about 60–80 words. Pay for them by cutting L40, L64, L95, L102 and L129.

## MISSION CHECK
- **Hopeful, not naive:** mostly yes. L74 and L88 are well judged.
- **No fear-mongering:** OK. The weapons line stays calm. Cutting L51 (unsourced recursive-AI claim) removes the only hype/fear spike.
- **Responsibility named:** companies yes, lawmakers yes, viewer yes. "Share it" names nobody. Say who decides access (governments, schools, companies).
- **Fairness:** naming Anthropic's RSP rollback (item 2) is required for balance, since the film otherwise uses Anthropic as its only positive safety example. The one IEA clause (L38) is recommended.
