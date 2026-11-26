// c03 · B1 · 'Last year, the comedian' → 'It would make sense' (86.6 → 127.6 s)
// One take with c02–c05 (lib/b1_take.mjs, one draw for the whole group): the inner boundaries are seamless by construction.
// The BASEMENT strip becomes the studio desk; the lamp's pool grows into the C1 plate (placeholder) and takes it back: BOMBS / NOT AI; the seller's
// catalogue; the list: REAL, BUT OLD; ★ a gold pen writes the new reason, a cool disc is born on it and flies into row 2.
//
// | ID    | anchor (phrase)                    | picture | layer | carrier out | flag |
// | 1.15  | Last year, the comedian            | a podcast studio as a drawing: two microphones, two silhouettes at a table: THEO VON · SAM ALTMAN · 2025 | MIX | the studio lamp |  |
// | 1.16  | Here's Sam Altman                  | the lamp's circle of light grows into the clip plate | MIX | the plate |  |
// | 1.17  | slot:C1                            | C1 · SAM ALTMAN · CEO, OpenAI · 2025 · ORIGINAL FOOTAGE (7.6 s) | CLIP | the plate shrinks into the lamp |  |
// | 1.18  | Bombs. Not A.I.                    | the plate shrinks back into the studio lamp; under the lamp two words rise: BOMBS (cream, big) · NOT AI (small, cool); optional quote line with "just" (F.SOURCE | EXPL | the words |  |
// | 1.20  | The people who sell bunkers        | a seller silhouette opens a catalogue page: REASONS | MIX | the page |  |
// | 1.21  | War                                | the catalogue writes WAR (+ source Newsweek / Washington Post) | EXPL | the page |  |
// | 1.22  | Pandemics                          | PANDEMICS | EXPL | the list |  |
// | 1.23  | So the bomb is real                | the list comes back: row 1 THE BOMB, the word REAL rises beside it | EXPL | row 1 |  |
// | 1.24  | But it's the oldest reason         | row 1: a thin cream strike, the row greys: REAL, BUT OLD | EXPL | the catalogue |  |
// | 1.25  | And something here is new          | the catalogue returns; under the old lines a blank line glows | MIX | the blank line |  |
// | 1.26  | This year, bunker makers           | a gold pen line writes into the blank line (+ 2026) | EXPL | the line |  |
// | 1.27  | Artificial intelligence (2nd)      | the line reads … AND EVEN ARTIFICIAL INTELLIGENCE; a small cool disc sits on it (+ source) | EXPL | the disc |  |
// | 1.28  | Is it the machine they're          | the disc flies to the list: row 2 THE MACHINE grows big | EXPL | row 2 |  |
import { b1Entries } from '../lib/b1_take.mjs';
export default async (T, R) => b1Entries(T, R);
