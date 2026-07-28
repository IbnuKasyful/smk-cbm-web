// Splits the CFA announcement's WordPress HTML into three parts so the page can
// lay out the competition line-up as a grid instead of a tall stack of images:
//
//   head         -> everything up to and including the "… Kompetisi …" heading
//   competitions -> the image + name pairs listed under that heading
//   tail          -> everything after (registration + contact columns)
//
// The parse keys off structure (an <h2> mentioning "Kompetisi", followed by
// wp-block-image figures each carrying a caption), not wording, so editors can
// retitle freely. If the shape isn't found it returns the whole document as
// `head` with no competitions, and the page falls back to plain rich text.
//
// A caption may be either the figure's own <figcaption> — what the block editor
// writes when you fill in the caption field — or a paragraph placed right after
// the figure, which is how the same list reads if it was pasted in as separate
// blocks. Figures with neither are skipped rather than shown nameless.

import { decodeEntities } from './html-text.js';

const H2_RE = /<h2\b[^>]*>([\s\S]*?)<\/h2>/gi;
const COLUMNS_RE = /<div\b[^>]*class="[^"]*wp-block-columns[^"]*"/i;
const PAIR_RE =
  /<figure\b[^>]*class="[^"]*wp-block-image[^"]*"[\s\S]*?<img\b[^>]*\bsrc="([^"]+)"[\s\S]*?(?:<figcaption\b[^>]*>([\s\S]*?)<\/figcaption>\s*)?<\/figure>(?:\s*<p\b[^>]*class="[^"]*wp-block-paragraph[^"]*"[^>]*>([\s\S]*?)<\/p>)?/gi;

export function parseCfaContent(html = '') {
  const empty = { head: html, competitions: [], tail: '' };

  // Find the competition heading (the <h2> whose text mentions "Kompetisi").
  let heading = null;
  H2_RE.lastIndex = 0;
  for (let m; (m = H2_RE.exec(html)); ) {
    if (/kompetisi/i.test(m[1])) {
      heading = m;
      break;
    }
  }
  if (!heading) return empty;

  const afterHeading = heading.index + heading[0].length;
  const rest = html.slice(afterHeading);

  // Competitions run until the next columns block (registration / contact).
  const cols = rest.match(COLUMNS_RE);
  const region = cols ? rest.slice(0, cols.index) : rest;
  const tail = cols ? rest.slice(cols.index) : '';

  const competitions = [];
  PAIR_RE.lastIndex = 0;
  for (let m; (m = PAIR_RE.exec(region)); ) {
    const name = decodeEntities(m[2] ?? m[3] ?? '');
    if (name) competitions.push({ image: m[1], name });
  }
  if (competitions.length === 0) return empty;

  return { head: html.slice(0, afterHeading), competitions, tail };
}
