/**
 * Shared coordinate space for the blueprint-built illustrations.
 *
 * Every depiction is designed on a 960x640 canvas and specified in absolute
 * pixels. Converting those to percentages is what lets one composition scale to
 * any column width without a breakpoint for geometry — the illustration is the
 * same drawing at 900px as at 600px, just smaller.
 *
 * Keeping the conversion here rather than in each file means a blueprint
 * coordinate can be pasted in unchanged and read back against the spec during
 * review, which is most of what makes these auditable.
 */

/** Blueprint canvas. Every coordinate in the depictions is in this space. */
export const W = 960;
export const H = 640;

/** Blueprint x -> percentage of canvas width. */
export const px = (v: number) => `${((v / W) * 100).toFixed(3)}%`;

/** Blueprint y -> percentage of canvas height. */
export const py = (v: number) => `${((v / H) * 100).toFixed(3)}%`;

/**
 * Blueprint px -> container-relative type size, floored at 10px.
 *
 * `cqw` keeps type in proportion as the canvas scales. The floor stops the
 * smallest labels turning to mush on a narrow viewport — 10px is the system
 * minimum, below which a label is texture rather than text.
 *
 * Requires an ancestor with `@container`.
 */
export const ts = (v: number) => `max(0.625rem, ${((v / W) * 100).toFixed(3)}cqw)`;

/**
 * Blueprint px -> container-relative length, unfloored.
 *
 * For box dimensions rather than type. `ts`'s 10px floor is right for a label
 * and wrong for a card's height, where it would break the proportions of the
 * composition the moment the canvas got small.
 *
 * Use this for anything nested inside a panel: a percentage there resolves
 * against the panel's box, not the canvas, so `px`/`py` silently mean something
 * different once you are one level down.
 */
export const cq = (v: number) => `${((v / W) * 100).toFixed(3)}cqw`;

/**
 * Seconds -> fraction of a loop, for Motion's `times` arrays.
 *
 * Blueprints give a storyboard in seconds against a stated loop duration;
 * Motion wants 0..1 offsets. This keeps the timings in the code readable as
 * the seconds they were specified in.
 */
export const beat = (seconds: number, loop: number) => seconds / loop;
