# Kanal-Stil „Editorial-Nacht“ (ab 24.10.2026, für Thumbnails UND Animation)

Jakob, 24.10.2026 09:32, zu den Film-11-Thumbnails: „der stil der thumbnails aus diesem film ist genial! AB JETZT IMMER SO! auch in den animationen“.

## Bildbeispiele
- Die Vorlage: `/mnt/project-files/scenario/thumbnails/film-11/` mit `f11-a-smarter.png`, `f11-b-or-dumber.png` und `f11-c-than-ever.png`.
- Der Ursprung ist Jakobs Pinterest-Board `/mnt/project-files/scenario/referenzen/pinterest-stil-board.png`.
- Ausschnitte daraus liegen in `/mnt/project-files/scenario/referenzen/thumb-stil/`: `r1-monolith`, `r2-hands`, `r3-eye` und `r5-stauffer`.

## Was den Stil ausmacht
1. **Flache Editorial-Illustration** im Stil von Brian Stauffer: große, einfache, geometrische Formen ohne Konturlinien, keine realistische 3D-Oberfläche und keine Kleinteile.
2. **Korn statt Detail:** weiche Verläufe mit feinem Stipple- oder Risograph-Korn. Das Korn ist die Textur, nicht Holz-, Stoff- oder Metalloberflächen.
3. **Eine winzige Figur vor EINER riesigen Lichtform:** eine Hand aus Licht, eine Sonne in einem Kopf, ein Lichtkreis, ein Monolith. Ein Bild hat eine Idee.
4. **Viel Leerraum:** Ein ruhiger, dunkler Raum trägt das Bild.
5. **Licht erzählt:** Warm und hell heißt gut oder Wachstum, kalt und dunkel heißt das Gegenteil. Gegensätze zeigt man als Licht-Hälften.
6. **Die Figur „Du“:** klein, gesichtslos, in gelber Regenjacke. Sie ist die einzige Akzentfarbe neben dem Gold.

## Palette (gemessen an den Film-11-Thumbnails)
| Rolle | Hex |
|---|---|
| Nacht, tiefster Grund | `#080b27` `#0a1334` `#0e112c` |
| Indigo, Flächen | `#0a184a` `#0c1f5c` `#151f4b` |
| Blau, Licht auf Formen | `#193f8c` `#33497a` `#394773` |
| Gold, Lichtkern | `#fefde2` `#fef4bf` |
| Gold, Halo | `#ead295` `#dec688` `#e7d19a` |
| Gold, Schatten | `#9e7d54` `#a28f7b` |
| Regenjacke | warmes Gelb, etwa `#f2b632` |
| Schrift | Creme `#fefcde` mit warmem Glühen |

## Für die Animation (Code, Canvas 2D)
- **Bild:** Formen als gefüllte Pfade mit Verlaufsfüllung. Darüber ein Korn-Layer (vorberechnetes Rauschen als Image, Blendmodus `overlay` oder `soft-light`) und ein großer, weicher Glow um die Lichtform.
  - Keine Muster pro Frame neu erzeugen, wegen des Speicherlecks in `@napi-rs/canvas`.
- **Ruhe-Regeln bleiben:**
  - eine durchgehende Welt, Kamerafahrten statt Schnitte;
  - höchstens 1–2 bewegte Elemente gleichzeitig;
  - ein Motiv pro Satz;
  - `calm.py` gegen Grow Forever.
- **Bewegung:** Die Lichtform atmet, wächst und wandert. Die Figur geht oder hebt etwas. Die Kamera zieht langsam zurück oder fährt in die Lichtform hinein, als Übergang ins nächste Bild.
- **Explainer-Teile** (Zahlen, Diagramme, Karten) im selben Look: Linien und Balken aus Licht auf Nachtblau, Zahlen in der Creme-Schrift.
- **Stil-Mix-Regel** (Jakob 24.10. 08:50): Welt-Szenen und Explainer wechseln sich ab, verbunden durch ein Träger-Objekt.
- **Nicht mehr verwenden:** detailreiche 3D-Hallen mit vielen Möbeln, Spiegelungen und Dutzenden Figuren. Das war Film 11, hell und warm. Der neue Stil ist dunkler, flacher und grafischer.

## Thumbnails
Immer mit dem Skill `good-takeoff-thumbnails`.

## Feste Regeln (Jakob 24.10.2026 09:36)
- **20-Sekunden-Stil-Test:** Vor jedem ganzen Film zeigt der Film-Thread Jakob zuerst etwa 20 s im Stil, erst nach seinem OK wird der ganze Film gebaut.
- **Die Figur im Regenmantel ist die Stellvertreterin der Zuschauer:** In jedem Film und jedem Thumbnail ist sie „du“. Sie ist klein, gesichtslos und trägt die gelbe Regenjacke mit Kapuze. Sie bleibt in allen Filmen dieselbe Figur. Sie erlebt, was der Sprecher mit „you“ meint, also staunen, heben, fragen, gehen. Andere Menschen sind schlichte Silhouetten ohne Gelb.
