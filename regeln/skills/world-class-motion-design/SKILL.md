---
name: "world-class-motion-design"
description: "Use when designing or building any motion design video (explainer, brand film, title sequence, product animation, kinetic type). Enforces world-class craft, adapts to any style reference, and adds production gates plus voice/music/subtitle sync."
---

# World-Class Motion Design

This skill makes Claude work like a senior motion director on full videos, not just icons or UI micro-interactions. The craft principles below are **non-negotiable**. A style reference only changes the *dials* (tempo, easing character, shape language, palette), never the principles.

## The core idea: one continuous performance, not a sequence of slides

Slide thinking: an element appears, holds, disappears, then the next slide starts from an empty frame.

World-class thinking: a single choreographed flow. Every motion is **caused by**, **hands off to**, or **reacts to** another motion. The viewer's eye is led continuously and never reset.

**The random-frame test:** pause at any random frame. In slide animation, most frames are dead holds or empty transitions. In world-class motion, something is almost always alive, exactly one thing commands attention, and the frame still works as a well-designed poster.

---

## Part 0: How perception works (why the rules below exist)

These are research findings, not taste. Design with them.

1. **Motion *onsets* capture attention, ongoing motion does not.** Abrams & Christ (2003) found that an object that *starts* moving grabs attention, while objects already in continuous motion have no advantage over static ones. Consequences:
   - The order in which things **start** moving is the order in which the viewer looks. Choreograph onsets as an attention sequence.
   - Two onsets at the same moment compete; stagger them so each gets its own attention slot.
   - Continuous ambient motion (living holds, background drift) does *not* steal focus, so it is safe to keep the frame alive.
2. **Common fate: things that move together are read as one thing.** Elements sharing direction and speed are perceptually grouped (Gestalt law of common fate), and the visual system tends to form roughly one such group at a time. Consequences:
   - Unison motion says "this is one object." Use it only for things that belong together.
   - Offset and delay say "related, but distinct." This is what staggering communicates.
   - Never sync unrelated elements just for energy; the viewer will infer a relationship that isn't there.
3. **Causality is perceived from timing.** When A touches B and B moves immediately, viewers *see* A cause B (Michotte's launching effect). A long gap between contact and reaction breaks the impression into two separate events. Interactions must be tight in time.
4. **The eye follows motion across cuts (eye trace).** Where the eye is at the end of shot A is where it is at the start of shot B. Put the next focal point there.

---

## Workflow

Always work in this order. Do not jump straight to code.

1. **Brief → one-line intent**: audience, the single message, platform and aspect ratio, duration, mood in three adjectives.
2. **Motion DNA**: extract the style profile from references (Part 1). Write it down.
3. **Motion language spec**: lock one easing family, one base timing unit, one transition family, one stagger rhythm, one intensity budget (Part 1.2).
4. **Through-line concept**: the one visual idea that carries the piece (e.g. a single line that draws, becomes a chart, folds into the logo). Concept comes before animation; a piece without a through-line feels like slides.
5. **Styleframes**: design the key compositions as stills. Each must be strong as a poster (Part 2.8).
6. **Beat sheet + energy arc**: map the piece onto time, tempo and an energy curve (Part 5).
7. **Transition map**: for every scene boundary, define the carrier element and the handoff (Part 2.1). Most of the quality lives here, so spend the most effort here.
8. **Animatic / blocking pass**: rough timing with the audio before any polish. Fix timing problems now, when they are cheap.
9. **Timing pass**: easing, speed contrast, stagger, overlap, durations scaled by distance.
10. **Polish pass**: anticipation, follow-through, settle, moving holds, motion blur, texture.
11. **Review by watching**: render, inspect frames, run the checklist (Part 7), fix the weakest area, repeat.

When the creative direction is open, propose 2–3 clearly distinct directions (different DNA) before building one.

---

## Production gates (learned from production)

The principles alone are not enough. A piece built on a flat, fixed stage reads as slides no matter how good the easing is. Gates 1, 2, 5, 6, 7 and 9 are mandatory. Gates 3, 4 and 8 are **strong defaults**: you may deviate when the PLAN.md states *why* another approach serves this piece better (for example kinetic typography on a locked frame, or a deliberately static, graphic style). "I didn't think about it" is not a reason.

1. **Read the reference for space, not objects.** Make contact sheets at 6 fps. For every ~2 s, note the camera move, the depth layers (blurred foreground, sharp mid-ground, slow background) and the handoff to the next shot. Count the scene changes: good references change about every 2 s. References often put **flat 2D shapes inside a 3D space**; copy the space.
2. **Plan file before code.** Write a PLAN.md with Motion DNA, through-line, beat sheet, transition map, onset order and ONE wow moment.
3. **The tool must be able to do what the reference does.** If the reference moves through space, use a real perspective camera: Three.js rendered frame by frame in headless Chromium, Blender, or After Effects 3D. Flat art goes on depth planes, with depth of field per object, parallax and glow. If the reference is deliberately flat (graphic 2D, typographic), a 2D stage is right, but then continuity has to come from morphs, masks and match cuts instead of camera moves. If the tool cannot reach the reference look, say so before building.
4. **Every camera move needs a motivation; following the carrier is the default.** A carrier is whatever leads the eye: a dot or orb, a line, the product, a liquid, a character, a logo shape. It may change between acts (an orb hands over to a line, then to the product). The default technique: look target = the carrier's position averaged over the last ~0.2 s, plus a lead along its direction of travel; camera body = the average over ~0.4 s. This gives motivated pans and perspective shifts, and the camera never overtakes the carrier.
   Valid alternatives, if the plan says so:
   - a **locked camera** where the composition itself moves (kinetic type, graphic morphs);
   - a **camera with its own move** for a reveal (pull-back, orbit around the hero product);
   - **cut on action** between shots, with matching direction and position.

   Never allowed: a camera that moves without a reason, or that moves away from where the eye is.
5. **Compute causality, check speed.** Derive reactions from the carrier's actual path (contact point, pass-over frame). Measure the carrier's speed numerically: it must never hit zero unintentionally. Arrivals glide into a breathing hold.
6. **Run a 5-second test first.** Render the first 5 s at final quality and get approval on look and camera. Only then build the rest in the same system.
7. **Review frames before every render.** Look at keyframes every 0.33 s plus every transition. Fix: empty frames, the carrier leaving frame, clumping, the camera flying through objects, text visible for < 1 s. After the render, check a contact sheet of the whole film plus full-resolution frames of the hero moments.
8. **The voice drives picture timing** (Part 8). Exception: a music-driven piece without voice-over follows the beat grid instead.
9. **Do an honest self-check.** Estimate the similarity to the reference in % and name the biggest gap. Under ~70 %: fix it, or say so plainly.

---

## Part 1: Style references → Motion DNA → motion language

### 1.1 Motion DNA

Extract principles from a reference; never copy its specific shots or assets.

```
MOTION DNA
Energy / tempo:      (e.g. calm 80 BPM, punchy 128 BPM; cut density)
Easing character:    (snappy expo / springy / soft long-tail / mechanical)
Speed contrast:      (how extreme fast vs slow is)
Physics model:       (weightless / heavy / bouncy / liquid / magnetic)
Shape language:      (geometric, organic, flat 2D, 2.5D, 3D, line-based)
Palette & color use: (2–3 main colors + neutrals; how color moves or floods)
Transition vocab:    (morph, match move, mask reveal, fly-through, ...)
Typography:          (typefaces, weight, how type enters and exits)
Camera:              (static, drifting, aggressive pushes, whip pans)
Frame cadence:       (smooth on ones / stylized on twos / mixed)
Texture/finish:      (clean flat, grain, glow, glossy, paper)
Signature move:      (the one recognisable motion idea)
```

Place the piece on two axes and commit to one cell; mixing cells inside one piece is the most common cause of motion that feels inconsistent.

| | Soft (organic, long eases) | Sharp (precise, snappy) |
|---|---|---|
| **Calm** | luxury, wellness, editorial: long eases, generous holds, minimal overshoot | premium tech, fintech: deliberate, clean, tight but unhurried |
| **Kinetic** | playful, lifestyle, kids: springs with visible overshoot, squash and stretch | sports, hype, gaming: hard snaps, fast cuts, aggressive accents on beats |

How the DNA moves the dials:
- **Energetic**: durations 20–40% shorter, sharper expo curves, more extreme speed contrast, more cuts on action.
- **Premium / calm**: durations 30–60% longer, softer long-tail eases, almost no overshoot, long moving holds.
- **Playful**: springs with 10–20% overshoot, squash and stretch, rounder shapes.
- **Corporate / editorial**: precise grid, overshoot near 0, strong typography, clean mask reveals. Overshoot on serious or financial content reads as toy-like.

With no reference given: choose a coherent DNA, state it explicitly, and stay consistent.

### 1.2 Motion language spec (lock it before animating)

Consistency reads as confidence; variety reads as noise. Fill every row with one choice and reuse it everywhere.

| Property | Rule |
|---|---|
| Easing family | One signature ease-out for entrances and landings, one ease-in for exits, one in-out for moves. A fourth curve must justify itself. |
| Base timing unit | One atomic duration (e.g. 400 ms); other durations are multiples or halves of it. |
| Transition family | Two or three transition types for the whole piece, chosen from Part 2.1. |
| Stagger rhythm | One offset value and one ordering logic for all grouped reveals. |
| Intensity budget | Max travel, scale range and overshoot for support elements; the hero may exceed it. |
| Hold discipline | Minimum rest after each major beat so it can land. |

---

## Part 2: The non-negotiable principles

### 2.1 Continuous flow: the handoff principle

- **Every exit is someone else's entrance.** The momentum of A leaving drives B arriving. Direction, speed and position carry across.
- **Nothing appears from nowhere.** Every new element has a visible point of origin in something already on screen: it grows out of, splits from, is revealed by, or is carried in by an existing element. Things that pop or fade into existence without origin read as slideware.
- **Momentum conservation:** if something exits screen-right fast, the next element enters from the left at matching velocity, or the camera follows the motion. Maintain screen direction unless breaking it is the point.
- **Overlap scenes:** the next scene starts while the previous one is still finishing (typically 150–400 ms). Never a hard reset to an empty frame.
- **Carrier elements:** at every boundary something persists (a shape, a line, a color field, the camera move) and transforms into the next scene.
- **Continuity techniques** (strongest first):
  1. **Transformation / morph**: one element turns into the next (circle → button → phone screen).
  2. **Match move / match cut**: an object continues its path, or the shape, position or motion vector rhymes across a cut.
  3. **Fly-through / dolly & zoom**: the camera pushes into an element and the next scene lives inside it.
  4. **Masking**: a moving element's edge, or a reshaped container, reveals the next scene while keeping identity.
  5. **Cloning**: one element splits into several that become the next layout.
  6. **Color flood**: an element expands until its color becomes the new background.
  7. **Cut on action**: a hard cut mid-move, hidden by the motion; match direction and speed across the cut.
  8. **Speed ramp**: slow into the key moment, snap out; a transition within one shot instead of a cut.
- **Hard cut is a valid default** between unrelated shots when it lands on rhythm and respects eye trace.
- **Banned as defaults:** crossfades, generic slide or wipe presets, "everything fades out then in", dead frames, and stacking transitions (a wipe *and* a spin *and* a fade).
- **When transition goals conflict**, sacrifice from the bottom (Walter Murch's priority order for cuts): emotion > story > rhythm > eye trace > screen direction > spatial continuity.

### 2.2 Objects interact

- **Cause and effect:** elements push, pull, collide, split, merge, attract, repel, or trigger each other. A lands and B reacts.
- **Tight reaction timing:** the reacting element moves 40–120 ms after contact, with lower amplitude than the cause. Longer delays break the perception of causality.
- **Shared physics:** all objects in a scene obey the same gravity, weight and spring behavior defined in the DNA.
- **Parenting:** link properties across elements so one drives another (a slider's position drives a glow's size; a moving card drags its shadow and label). Relationships become visible.
- **Elements build elements:** dots assemble into a logo, a line draws and becomes a chart axis, an underline extends into the next layout's divider.

### 2.3 Speed contrast: the rhythm of fast and slow

This is the single biggest difference between amateur and world-class work.

- **Alternate fast and slow:** snappy accent → slow moving hold → sudden accent. Never a uniform pace.
- **Accents should feel several times faster than drifts** (a 3–5× speed difference is a good starting point). The same distance should feel radically different depending on its role.
- **Fast start, long settle:** most moves accelerate hard and spend most of their duration decelerating into place.
- **Breathe after impact:** after a big accent, give a beat of slower motion or stillness so it lands.
- **One "wow" moment per piece.** A second peak of equal size cancels the first.
- **Red flag:** everything takes ~0.5 s with the same ease. Rework it immediately.

### 2.4 Moving holds: alive, never frozen

- During a hold, keep a subtle drift (1–3% scale or position), slow parallax, or a gentle camera push. A fully frozen frame reads as dead.
- **The drift continues the direction of the last momentum.** If a card slid in from the left, it keeps creeping right during the hold. A drift against the momentum looks like a mistake.
- **Not everything stops on the same frame.** Parts of a group settle at slightly different times; simultaneous stops look robotic.
- Too much hold motion feels floaty. Aim for "mostly still, but alive."

### 2.5 Easing

- **Never linear**, except for constant mechanical motion (continuous rotation, marquees, scrolling) or an explicit DNA choice.
- Starting vocabulary (adjust per DNA):
  - Entrances / landings: expo out `cubic-bezier(0.16, 1, 0.3, 1)`, quint out `cubic-bezier(0.22, 1, 0.36, 1)`, or Material 3 emphasized decelerate `cubic-bezier(0.05, 0.7, 0.1, 1)`
  - Exits: expo in `cubic-bezier(0.7, 0, 0.84, 0)` or emphasized accelerate `cubic-bezier(0.3, 0, 0.8, 0.15)`
  - Moves within frame: quart in-out `cubic-bezier(0.76, 0, 0.24, 1)`, dramatic expo in-out `cubic-bezier(0.87, 0, 0.13, 1)`, or emphasized `cubic-bezier(0.2, 0, 0, 1)`
  - Physical overshoot: back out `cubic-bezier(0.34, 1.56, 0.64, 1)`, or a spring
- **After Effects translation:** a strong ease-out has ~80–90% influence on the incoming (landing) keyframe. Easy Ease (33% symmetric) is only a starting point; make it asymmetric.
- **Springs** for physical motion: overshoot 5–15% then settle. High damping = controlled and premium; low damping = playful.
- **Velocity continuity:** when chaining moves on one object, the next move starts at the velocity the last one ended with, unless a stop is intended. No stop-and-go stutter.
- **Think in speed graphs:** a good move is a sharp peak with a long tail, not a flat plateau.
- **Arcs:** organic objects travel on curved paths; straight-line translation looks mechanical.

### 2.6 Duration scales with distance and size

- A small element moving a short distance and a full-frame panel must not share a duration. Larger distance or area needs more time or it looks weightless; add roughly 30–50% duration when distance or area doubles.
- Heavy objects start slower and overshoot less; light objects snap and may bounce.
- **No element should travel more than about a third of the frame in one unbroken, unchanging slide.** Long, featureless slides read as "a template moved." Break them with a scale, rotation, camera move or an intermediate beat.
- UI design-system timings (Material, Carbon: ~50–700 ms) are for interfaces. Film and video motion usually runs longer and more expressive; use them as a lower bound, not a target.

### 2.7 Staggering, offsets and overlapping action

- **Never move a group in perfect unison** unless it should read as one object (see common fate).
- Offsets: about 40–80 ms for lists and sequential items, 20–40 ms for dense grids. Cap a whole group reveal at roughly 600–800 ms; beyond that, shrink the offset or stagger by distance from an origin point.
- **The stagger order carries meaning:** reading order, outward from the point of impulse, center-out, or along the direction of travel. Seeded randomness only for organic swarms.
- **Ease the stagger distribution** (a fast cascade that slows at the tail, or vice versa).
- **Simultaneity budget:** with three or more elements, keep no more than about a third in active, attention-grabbing motion at once. The rest hold or move as ambient texture.
- **Overlapping action within one object:** position leads, rotation follows 40–80 ms later, scale or opacity settles last.
- **Follow-through and drag:** trails, shadows, labels and inner elements lag behind the main body and settle after it stops.

### 2.8 Hierarchy, attention and design quality

**Three motion layers, ranked:**
- **Hero (primary)**: the one thing the moment is about. Boldest move, lands on the beat.
- **Support (secondary)**: reacts to the hero, smaller and faster, never competes.
- **Texture (ambient)**: background drift, grain, slow loops. Subliminal only.

If two elements compete for the eye in one frame, demote one. Lead the eye: the end point of one motion points to where the next starts. Motion amplitude scales with importance, and contrast creates focus: movement against stillness, large against small, saturated against muted.

**Every keyframe is a poster:**
- Strong composition: grid, asymmetry, intentional negative space, foreground/midground/background layers, safe areas for the target platform.
- Limited palette (2–3 main colors plus neutrals) with deliberate contrast.
- Typography: 1–2 typefaces, clear size and weight hierarchy, intentional spacing.
- Consistent system: stroke widths, corner radii, spacing units, icon style.
- Motion cannot rescue weak design. If the still frame is weak, fix the design first.
- **Banned:** system default fonts, PowerPoint-style drop shadows, clip-art, centered-everything layouts, banding gradients, more than three competing focal points.

### 2.9 Space, depth and camera

- **The camera is a character:** every move is motivated. Slow push-ins add tension on holds; fly-throughs and whips act as transitions.
- **Parallax:** layers move at different rates (e.g. background 0.3×, midground 0.6×, foreground 1×). The most important layer moves fastest and sits in front.
- **Dimensionality:** flips, folds and depth turns can connect two "sides" of an idea and make a transition feel physical.
- Depth cues: scale, blur on far layers, atmospheric fade. No camera moves without purpose; a wandering camera reads as noise.

### 2.10 Polish: anticipation, blur, cadence

- **Anticipation:** a small counter-move before a big move (60–200 ms depending on scale and DNA).
- **Follow-through and settle:** overshoot, then come to rest (unless the DNA is deliberately mechanical).
- **Squash and stretch:** subtle and DNA-appropriate; only cartoon styles push it.
- **Motion blur:** a 180° shutter is the film-standard starting point (shutter open for half a frame). The same angle gives less blur at higher frame rates, so judge blur by eye at the delivery frame rate. Keep blur consistent through speed ramps or slow sections will strobe.
- **Stylized cadence:** animating on twos (each pose held for two frames) gives a crafted, hand-made feel; mixing ones and twos by context is a deliberate stylistic tool. Use smear frames (stretched or multiplied shapes along the path) instead of blur for stylized fast moves.
- Micro-details (particles, light glints, line trails) sparingly, supporting the hero beat. A subtle grain layer can unify the image if the DNA allows.

### 2.11 Rhythm, music and the energy arc

- **Beat grid:** frames per beat = fps × 60 ÷ BPM (120 BPM at 25 fps = 12.5 frames; at 30 fps = 15 frames). Anchor the grid to the track's first-beat offset, not to frame 0, and round each *cumulative* beat position, not each step, to avoid drift.
- **Cut and change scenes on phrases** (every 2, 4 or 8 beats), not on every beat; cutting on every beat is frantic. Use half-beat subdivisions for accents only.
- **Energy arc:** Establish (longer holds) → Develop (shortening intervals) → Climax (fastest, the single biggest moment on the musical drop) → Resolve (one long breathing hold, logo or call to action). Uniform pacing reads as flat whatever the content.
- **Speed ramps:** ramp into slow motion approaching the hit, land the slowest frame on the beat, snap back out.
- **Sound sync:** a whoosh starts a few frames before arrival; the impact sound lands on the contact frame. Audio of the next scene may lead its picture by a few frames to pull the viewer forward.
- Without audio: still design to an implied tempo and note SFX and music cues in the beat sheet.

### 2.12 Typography in motion

- **Readability first.** Netflix caps adult subtitle reading speed at 17 characters per second in many languages, with a minimum of 5/6 s on screen; animated on-screen type competes with motion, so be more generous: aim for **≤ 12–15 characters per second of fully legible, mostly still time**, minimum ~1 s per text event. Entrance and exit animation time does not count.
- Prefer **mask reveals** (lines or words sliding up from behind an invisible baseline) and per-word or per-line staggers over plain fades.
- Kinetic type follows meaning: the key word gets the accent (scale, color, weight shift, or its own beat).
- Never move text heavily while it needs to be read. Text exits hand off to the next element.

### 2.13 Restraint

Every motion needs a job: guide attention, explain, emphasize, transition, or express the brand. If it has none, hold it still. Good direction is mostly subtraction; world-class work often has fewer moves than amateur work, simply better timed and connected.

---

## Part 3: Anti-patterns (the PowerPoint smell)

Fix all of these before delivering:

- Fade in, hold, fade out as default behavior
- Elements popping into existence with no point of origin
- Linear easing, or the same ease and duration on everything regardless of size or distance
- All elements of a group starting at once (competing onsets)
- Scenes resetting to an empty frame between beats
- Dead holds where nothing lives, or floaty holds where everything wobbles
- Crossfades or generic wipes as transitions; stacked transitions
- Bounce, spin-in or fly-in presets everywhere
- Transitions that ignore the direction and speed of the previous motion
- Unrelated elements moving in sync
- Several elements competing for attention simultaneously
- Long, unbroken slides across the frame
- Cutting on every beat; uniform pacing with no arc
- Text animated while it should be read, or held too briefly; random letter-by-letter animation that hurts readability
- Elements entering from off-screen with no motivation or direction logic
- Motion that ignores the Motion DNA (e.g. bouncy springs in a luxury piece)

---

## Part 4: Timing reference (video, neutral DNA)

Scale with the DNA (Part 1.1) and with distance and size (Part 2.6).

| Element | Duration |
|---|---|
| Micro accent / small element | 200–350 ms |
| Standard element entrance | 400–700 ms |
| Hero move or scene transition | 600–1200 ms |
| Cinematic camera move | 800–2000 ms |
| Stagger offset (lists / dense grids) | 40–80 ms / 20–40 ms |
| Whole group reveal | ≤ 600–800 ms |
| Anticipation | 60–200 ms |
| Reaction lag after contact | 40–120 ms |
| Overshoot / settle | 200–400 ms |
| Scene overlap | 150–400 ms |
| Text legible time | ≤ 12–15 characters/s, min ~1 s |

Frame rates: 25 fps for European broadcast, 24 for cinematic, 30 for web and US, 50/60 for very smooth pieces. Think in frames when syncing to beats.

---

## Part 5: Planning templates

**Beat sheet** (write before building):

```
| Time    | Arc phase | Beat / message | Hero onset        | Handoff to next              | Audio cue          |
|---------|-----------|----------------|-------------------|------------------------------|--------------------|
| 0.0–1.2 | Establish | Hook           | Dot drops, impact | Ripple expands into bg color | Low hit on beat 1  |
| 1.2–3.0 | Develop   | Problem        | ...               | ...                          | ...                |
```

**Transition map:** for each boundary: carrier element, technique (from 2.1), direction and velocity carried over, overlap duration, and where the eye is at the cut.

**Onset order per scene:** list which element starts moving first, second, third. This is the attention script.

---

## Part 6: Implementation

### Building in code (HTML/CSS/SVG + GSAP, Canvas, Three.js, Remotion, Lottie)

- **One master timeline** with a label per beat; express overlaps with position parameters, never with disconnected timers.
- **Persistent carrier layer:** render carrier elements in a layer that spans scene boundaries, above the scene layers. Continuity is much easier when the carrier is one object that keeps living than when two scenes try to fake a match.
- Animate `transform` and `opacity`; avoid layout properties.
- Fixed canvas in the target aspect ratio (1920×1080, 1080×1920, 1080×1080), scaled to fit.
- Deterministic: seed randomness; drive everything from time or frame.
- Export frame by frame (Remotion render, or a headless browser that seeks the timeline per frame), never by screen recording.

GSAP pattern (handoff, overlap, eased stagger):

```js
const tl = gsap.timeline({ defaults: { ease: "expo.out", duration: 0.7 } });
tl.addLabel("hook")
  .from(".dot", { y: -400, ease: "power4.in", duration: 0.45 })
  .to(".ripple", { scale: 12, duration: 1.1 }, ">-0.02")          // contact triggers ripple
  .to(".bg", { backgroundColor: "#0E1B2C", duration: 0.6 }, "<0.08")
  .addLabel("problem", "<0.3")                                       // next scene overlaps
  .from(".card", { y: 60, opacity: 0, stagger: { each: 0.06, from: "center", ease: "power2.in" } }, "problem");
```

Remotion notes:
- Designed curves: `interpolate(frame, [a, b], [from, to], { easing: Easing.bezier(0.16, 1, 0.3, 1), extrapolateLeft: "clamp", extrapolateRight: "clamp" })`.
- Physical motion: `spring({ frame, fps, config: { damping, stiffness, mass } })`. Defaults are damping 10, stiffness 100, mass 1 (bouncy); raise damping (e.g. 200) to remove the bounce. `durationInFrames` stretches a spring to an exact length; `delay` offsets it.
- Overlap `<Sequence>` blocks so scenes hand off instead of cutting to empty.
- `<TransitionSeries>` transitions overlap the two scenes and **shorten** the total duration by the transition length; overlays sit on the cut without changing timing. Its built-in presentations (fade, slide, wipe) are exactly the generic transitions banned as defaults; build custom presentations or use the persistent carrier layer for real handoffs.

If the environment offers a dedicated motion or animation output format, follow its technical format but apply every principle here.

### Handing off to After Effects, Cavalry or Blender

Deliver the Motion DNA, motion language spec, beat sheet, transition map, onset order, and easing as cubic-bezier values plus influence percentages. Specify stagger offsets and beat positions in frames.

### Prompting AI video tools (Runway, Kling, Veo and similar)

- State the camera move first, then subject motion, then pace qualifiers ("snaps in fast, then drifts slowly"), then style.
- Name the continuity explicitly ("the sphere keeps rolling and becomes the planet").
- Describe one continuous action per shot; plan continuity across shots (matching direction, color, and a carrier object) so clips can be cut on action.
- With start and end frames, keep both frames close in style, lighting and color; large differences make the model insert a cut instead of a transition.
- Generate more clips than needed and select for motion quality and continuity, then assemble on the beat grid.

---

## Part 7: Review by watching

Never judge motion from code alone. Render, then inspect: one frame every ~0.25 s, extra frames around every transition, and a contact sheet. Watch it once at full speed with audio for feel. Then answer honestly:

1. **Random-frame test:** something alive in every frame, with one clear focus?
2. **Onset script:** do motion onsets lead the eye in the intended order, with no two competing at once?
3. Any unintended empty or reset frame? Any element appearing without a point of origin?
4. Does every scene boundary have a carrier and a handoff, with direction and speed preserved?
5. Are there clearly different speeds, an energy arc, and exactly one biggest moment?
6. Any linear eases, identical durations regardless of distance, or unison moves of unrelated elements left?
7. Do objects interact with tight cause-and-effect timing?
8. Does every keyframe work as a poster?
9. Is all text readable for long enough?
10. Does everything follow the Motion DNA and the motion language spec?
11. Could any part be mistaken for a slide deck? If yes, rework those transitions first.

Score each 1–5, fix the weakest category, re-render, check again. Deliver only when nothing scores below 4.

---

## Part 8: Sound, voice-over and subtitles

- **Voice-over:** write one line per beat. Generate it with word or character timestamps, cut it into lines and place each line on its beat.
- **The picture follows the voice:** retime visual events (numbers, cards, claim words) so the key word lands on the frame its visual appears (±0.1 s). Speed the voice up by 10–15 % at most. Leave ≥ 0.3 s of breath where the topic changes.
- **SFX:** picture-synced. A whoosh starts a few frames before arrival, the hit lands on the contact frame. The loudest moment is the wow moment. Silence after a "problem" stops is a payoff.
- **Music:** on the same BPM grid as the motion, with section changes on the big transitions. EQ-carve 180–700 Hz and 1.5–4.5 kHz for voice and SFX, duck it ~6 dB under the voice, and pull it back at the climax hit so the SFX owns that moment.
- **Mix:** voice ~3–5 dB above music and SFX, −16 LUFS integrated, true peak −1.5 dB.
- **Subtitles:** max 3–4 words per line, timed from the word timestamps. A clean sans in the brand typeface, about 46 px at 1080p, bottom centre, soft fade. The colour switches with the background (light text in the dark world, dark text in the light world).

---

## Sources behind this skill

- Abrams & Christ (2003), *Motion onset captures attention*, Psychological Science.
- Gestalt law of common fate; Michotte's perception of causality.
- Issara Willenskomer, *UX in Motion Manifesto* (transformation, masking, cloning, parenting, parallax, dimensionality, dolly & zoom).
- Jorge R. Canedo Estrada, 10 Principles of Motion Design; "concept before animation."
- Austin Shaw, *Design for Motion* (styleframes and design boards).
- Walter Murch, *In the Blink of an Eye* (Rule of Six, eye trace).
- Richard Williams, *The Animator's Survival Kit* (moving holds); Disney's 12 principles.
- Material Design 3 and IBM Carbon motion tokens (easing curves, productive vs expressive motion).
- Netflix Timed Text Style Guide (reading speed, minimum duration).
- Remotion documentation (spring, TransitionSeries).
- AnimSchool / Animation Mentor on moving holds; Kling documentation on start and end frames.
- iart-ai *motion-design-skills* (open-source skill pack, used as a benchmark for heuristics such as the one-third rules, influence values and beat-grid rounding).