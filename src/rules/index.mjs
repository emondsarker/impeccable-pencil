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
import singleFont from './single-font.mjs';
import flatTypeHierarchy from './flat-type-hierarchy.mjs';
import monotonousSpacing from './monotonous-spacing.mjs';
import lineLength from './line-length.mjs';
import skippedHeading from './skipped-heading.mjs';
import shapeMonotony from './shape-monotony.mjs';
import iconTileStack from './icon-tile-stack.mjs';
import orphanToken from './orphan-token.mjs';
import lowContrast from './low-contrast.mjs';
import grayOnColor from './gray-on-color.mjs';
import aiColorPalette from './ai-color-palette.mjs';
import darkGlow from './dark-glow.mjs';
import hardcodedColor from './hardcoded-color.mjs';
import coralOnNoninteractive from './coral-on-noninteractive.mjs';

// Order is not significant to correctness but roughly P0 → P3 for readability.
export const rules = [
  // P0
  absoluteNegativeOffset,
  lowContrast,
  // P1
  textOverflowHug,
  sideTab,
  borderAccentOnRounded,
  overusedFont,
  nestedCards,
  gradientText,
  tinyText,
  aiColorPalette,
  grayOnColor,
  // P2
  pureBlackWhite,
  crampedPadding,
  tightLeading,
  allCapsBody,
  justifiedText,
  longItalicSerif,
  everythingCentered,
  singleFont,
  flatTypeHierarchy,
  monotonousSpacing,
  lineLength,
  shapeMonotony,
  iconTileStack,
  hardcodedColor,
  darkGlow,
  coralOnNoninteractive,
  // P3
  wideTracking,
  ghostNode,
  orphanToken,
  skippedHeading,
];
