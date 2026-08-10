// Layout for the Study scene's third bookshelf compartment — the actual
// "SEEK THE THIRD SHELF" target. The five books here are drawn in a plain dark
// tone, distinct from the colorful decorative books on the shelves above, so
// the compartment itself is spottable — but their symbols are deliberately not
// shown on the shelf art; the player has to have decoded the cipher (and
// remembered the family photo) to know what they are.

// Five books — count and identity used for stable keys/color when drawing the
// plain spines; the actual symbol match happens in the puzzle modal only.
export const THIRD_SHELF_SYMBOLS = ['🌙', '☀️', '⭐', '🔥', '🌊'];

// All figures are in the SceneIllustration viewBox's 0-100 units.
export const THIRD_SHELF_BOOK_X = 71.3;
export const THIRD_SHELF_BOOK_COL_STEP = 5.1;
export const THIRD_SHELF_BOOK_WIDTH = 3.4;
export const THIRD_SHELF_BOOK_HEIGHT = 8.6;
export const THIRD_SHELF_BOOK_Y = 28 + (9.6 - THIRD_SHELF_BOOK_HEIGHT);

export function thirdShelfBookX(col: number): number {
  return THIRD_SHELF_BOOK_X + col * THIRD_SHELF_BOOK_COL_STEP;
}
