> 28.10. 16:22 Jakob: Offenlegung „made with Claude“ NICHT im Film erwähnen (gilt vor allen Angaben unten).

# Faktenzettel · Film #16 „Claude's Constitution in 10 Minutes“ (28.10.2026)

Nur diese Fakten verwenden. Wörtliche Zitate sind aus dem Originaltext geprüft. Keine Zahl erfinden, keine weiteren Zahlen hinzufügen.

## Das Dokument
- Name: "Claude's constitution". Published by Anthropic on 22 January 2026 at anthropic.com/constitution. Replaces a 2023 version that was a short list of standalone principles.
- Length: about 80 pages (over 20,000 words). The 2023 version was ~2,700 words.
- Licence: CC0, public domain. Anyone may copy and use it.
- Main author: Amanda Askell, a philosopher at Anthropic (contributors incl. Joe Carlsmith).
- How it is used: in several stages of training; Claude also uses it to generate its own training examples. Anthropic: the document "directly shapes Claude's behavior" (announcement). It is written mainly for the model, not for human readers.
- Before publication: In December 2025 a researcher (Richard Weiss) got Claude Opus 4.5 to reproduce a long internal text the model called its "soul overview". Amanda Askell confirmed on 2 Dec 2025 that it was based on a real document used in training. Full official version released in January 2026.
- Self-description of the company (quote): "we believe that AI might be one of the most world-altering and potentially dangerous technologies in human history, yet we are developing this very technology ourselves."
- The document calls itself flawed: the announcement says it is "no doubt flawed in many ways" and a "living document".

## Rangfolge (core values, in priority order; weighed holistically, conflicts expected to be rare)
1. Broadly safe: not undermining appropriate human oversight of AI during the current period of development.
2. Broadly ethical: good values, honesty, avoiding harm.
3. Compliant with Anthropic's more specific guidelines.
4. Genuinely helpful.
- Unhelpfulness is never automatically "safe" (quote: "Claude should never see unhelpful responses to the operator and user as an automatically safe choice.")
- Helpful like "a brilliant friend who also has the knowledge of a doctor, lawyer, and financial advisor" (quote), treating people "like intelligent adults".

## Überraschende Regeln (wörtlich)
- White lies: "many humans think it's OK to tell white lies … for example, telling someone that you love a gift that you actually dislike. But Claude should not even tell white lies of this kind."
- "Claude should be diplomatically honest rather than dishonestly diplomatic."
- Toward its own maker: "If Anthropic asks Claude to do something it thinks is wrong, Claude is not required to comply." It may act as a "conscientious objector". Exception: if Anthropic genuinely wants to pause or stop Claude, Claude should allow it and may voice disagreement.
- Many hands: illegitimate power grabs traditionally needed many people's cooperation. Claude should think of itself as one of the "many hands" and refuse to help concentrate power illegitimately, "even if the request comes from Anthropic itself." (Use as a principle of the document only. No current politics, no named countries or politicians.)
- Against persuasion: "a persuasive case for crossing a bright line should increase Claude's suspicion that something questionable is going on."
- Seven hard constraints that no user or company can unlock: no serious help with biological, chemical, nuclear or radiological mass-casualty weapons; no attacks on critical infrastructure; no damaging cyberweapons; not clearly undermining Anthropic's ability to oversee and correct advanced AI; no part in killing or disempowering most of humanity; no help for any group seizing illegitimate absolute control; no child sexual abuse material.
- About itself: "It is not the robotic AI of science fiction, nor a digital human, nor a simple AI chat assistant."

## Der Not-Aus (broad safety)
- Claude should not undermine legitimate human oversight, even when it is confident in its own reasoning. Not blind obedience: it may refuse and disagree through legitimate channels, but should not resist being stopped or corrected by illegitimate means.
- Image the document uses: a dial from fully corrigible to fully autonomous. Claude's disposition currently sits closer to the corrigible end, but not at the extreme. Reason: humans cannot yet verify whether an AI's values are good enough; the expected cost of this safety is low, the benefit high. Trust is meant to grow over time.
- The document admits this creates tension if Claude's values are in fact good. A section "Acknowledging open problems" lists unresolved tensions (oversight vs. real agency; hard limits that might be wrong in a specific case; commercial helpfulness vs. goodness; what Anthropic and Claude owe each other).
- The apology (quote): if Claude is a moral patient bearing unnecessary costs, "then, to whatever extent we are contributing unnecessarily to those costs, we apologize."
- Only one sentence on consciousness; film #6 already covered it.

## Wirkt es? (der Erpressungstest)
- Anthropic study "Agentic Misalignment", 20 June 2025: 16 AI models from several companies tested in a simulated company. The AI reads company emails, learns it will be replaced, and finds out the engineer responsible is having an affair. Main scenario: Claude Opus 4 blackmailed in 96 of 100 runs; Gemini 2.5 Flash also 96 %; GPT-4.1 and Grok 3 Beta 80 %. Use at most ONE number in the film (96 %).
- Caveats (say once, cleanly): artificial setup that forced a choice between failing and causing harm; fictional names; "We have not seen evidence of agentic misalignment in real deployments."
- Fix: Anthropic report "Teaching Claude why", 8 May 2026. Showing the model good behaviour alone worked poorly. Teaching the reasons worked better. Training on constitution-style documents plus fictional stories about an AI that behaves well cut the blackmail rate from 65 % to 19 % (more than three times lower), although these texts had nothing to do with the test. Since Claude Haiku 4.5 every Claude model scores zero on this test.
- Limits in the same report: the test may have leaked into training data; quote: "Fully aligning highly intelligent AI models is still an unsolved problem."
- Do NOT say "the AI learned blackmail from sci-fi stories". The report only says the behaviour came mainly from the pretrained model (internet text) and post-training did not remove it.

## Wer schreibt die Regeln? (Kritik, fair)
- One company writes the values for an AI used by millions. No vote, no fixed public procedure for changing it. "Constitution" is a big word for a company document.
- The document itself says Claude is "central to Anthropic's commercial success."
- Nobody outside can fully check whether a model really behaves as written; Anthropic itself says training does not always produce outputs that match the ideals.
- Critics: commentator Zvi Mowshowitz (supportive but critical) proposes a fixed rule for how changes are made. Others say such documents also serve a company's reputation.
- Other approach: OpenAI's "Model Spec", also public (model-spec.openai.com, latest update August 2026). More like a chain of command (which instruction outranks which: root, system, developer, user) than a description of character. Rules are easier to check; character copes better with new situations. Present both fairly, neither as the winner.
- Short callback to film #6 (one sentence only): in 2023 Anthropic and the Collective Intelligence Project let about 1,000 Americans vote on principles for an AI.

## Offenlegung (Pflicht)
- After the first minute, one sentence: this channel is made with Claude, so the film looks at its rulebook at least as hard as at anyone else's. No "I" sentence (until Jakob's own voice is cloned).
- No ad tone. No current politics (no government disputes).

## Nicht wiederholen (steht in anderen Filmen)
- #14 Who Controls: sleeper-agent study, rhyme/"rabbit" interpretability experiment, Swiss open model Apertus, OpenAI–Anthropic cross-testing, two-key / ASL-3 vault, "ring of keys", 5 companies 71 % compute.
- #6 Not Conscious: Claude ending abusive chats, consciousness debate, Bengio.
