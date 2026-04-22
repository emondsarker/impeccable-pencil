import sideTab from './side-tab.mjs';
import overusedFont from './overused-font.mjs';
import nestedCards from './nested-cards.mjs';
import textOverflowHug from './text-overflow-hug.mjs';
import absoluteNegativeOffset from './absolute-negative-offset.mjs';

// Order is not significant to correctness but roughly P0 → P3 for readability.
export const rules = [
  absoluteNegativeOffset,
  textOverflowHug,
  sideTab,
  overusedFont,
  nestedCards,
];
