import sideTab from './side-tab.mjs';
import overusedFont from './overused-font.mjs';
import nestedCards from './nested-cards.mjs';
import textOverflowHug from './text-overflow-hug.mjs';
import absoluteNegativeOffset from './absolute-negative-offset.mjs';
import tinyText from './tiny-text.mjs';
import justifiedText from './justified-text.mjs';
import tightLeading from './tight-leading.mjs';
import allCapsBody from './all-caps-body.mjs';
import wideTracking from './wide-tracking.mjs';
import ghostNode from './ghost-node.mjs';
import pureBlackWhite from './pure-black-white.mjs';
import crampedPadding from './cramped-padding.mjs';
import borderAccentOnRounded from './border-accent-on-rounded.mjs';
import longItalicSerif from './long-italic-serif.mjs';
import gradientText from './gradient-text.mjs';
import everythingCentered from './everything-centered.mjs';

// Order is not significant to correctness but roughly P0 → P3 for readability.
export const rules = [
  absoluteNegativeOffset,
  textOverflowHug,
  sideTab,
  borderAccentOnRounded,
  overusedFont,
  nestedCards,
  gradientText,
  tinyText,
  pureBlackWhite,
  crampedPadding,
  tightLeading,
  allCapsBody,
  justifiedText,
  longItalicSerif,
  everythingCentered,
  wideTracking,
  ghostNode,
];
