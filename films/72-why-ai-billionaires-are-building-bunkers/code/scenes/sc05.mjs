// c05 · B1 · 'And that bunker from the beginning' → 'Ask the people who sell them' (168.6 → 219.2 s, hands over S.plateBunker to B2)
// One take with c02–c05 (lib/b1_take.mjs, one draw for the whole group): the inner boundaries are seamless by construction.
// The card shrinks into the researchers' board; the optional card, ★ OPTIONAL; Hall (silent card) and the near/far disc; BUILD IT RIGHT; OUT HERE /
// NOT DOWN THERE; row 2 crossed off; STILL BUILDING; Harris' tag grows into the C2 plate (placeholder), which folds into RIGHT NOW; blank tags
// fold into the empty bunker → S.plateBunker (the frames before it converge on the plate exactly).
//
// | ID    | anchor (phrase)                    | picture | layer | carrier out | flag |
// | 2.16  | And that bunker from the beginning | callback: the room of researchers from H.10, small, the board lit | MIX | the speaker |  |
// | 2.17  | The scientist who announced        | the standing figure lights | MIX | the board |  |
// | 2.18  | Of course                          | quote card Sutskever 2 (2023, via Karen Hao), words light as spoken | EXPL | the word optional |  |
// | 2.19  | Optional Some                      | OPTIONAL lifts off the card and stays, big | EXPL | the word |  |
// | 2.20  | Some scientists doubt              | a silent quote card (Dame Wendy Hall, BBC Oct 2025, not read); a long dashed arrow from TODAY to the far big disc: ANYWHERE CLOSE? | EXPL | the arrow |  |
// | 2.21  | Near or far                        | the disc slides near → far → near on the arrow; the bunker verdict under it stays | EXPL | the disc |  |
// | 2.22  | The only protection                | above the line people build the disc (scaffold lines, cream): BUILD IT RIGHT | EXPL | the line |  |
// | 2.23  | Out here                           | above the line the lanterns and people of the hook stand in the open; a small arrow up: OUT HERE | MIX | the line |  |
// | 2.24  | Not down there                     | an arrow down into the dark bunker: NOT DOWN THERE | EXPL | the list |  |
// | 2.25  | Cross the machine                  | the list: row 2 is struck through, bold: CROSSED OFF | EXPL | the list |  |
// | 2.26  | But then why are they still        | beside the list a small bunker keeps drawing itself: STILL BUILDING | EXPL | the bunker |  |
// | 3.01  | Tristan Harris used to work        | a name tag on a stand: TRISTAN HARRIS · FORMER DESIGN ETHICIST, GOOGLE | MIX | the tag |  |
// | 3.02  | Today he                           | the tag adds CO-FOUNDER, CENTER FOR HUMANE TECHNOLOGY | MIX | the tag |  |
// | 3.03  | This spring he said                | the tag's frame grows into the clip plate | MIX | the plate |  |
// | 3.04  | slot:C2                            | C2 · TRISTAN HARRIS · Co-founder, Center for Humane Technology · 2026 · ORIGINAL FOOTAGE (5.6 s; the MODERN | WISDOM bug bottom left stays visible) | CLIP | the plate shrinks into RIGHT NOW |
// | 3.05  | Right now                          | the plate folds into the words RIGHT NOW (gold, big) | EXPL | the words |  |
// | 3.06  | He names no names                  | a row of blank name tags | EXPL | the tags |  |
// | 3.07  | But if he's right                  | the tags fold into a schematic bunker section, empty shelves: GOOD FOR WHAT? → plateBunker | EXPL | plateBunker |  |
import { b1Entries } from '../lib/b1_take.mjs';
export default async (T, R) => b1Entries(T, R, { end: true });
