// Pulls the images out of CMS post HTML so they can be rendered as a tidy,
// previewable grid instead of a tall stack of full-width photos.
//
// The result is an ordered list of blocks:
//
//   { type: 'html',    html }              -> prose, rendered as rich text
//   { type: 'gallery', images: [...] }     -> a run of images, rendered as a grid
//
// Runs are kept *in place* rather than collected into one gallery at the end of
// the article: an image that sits under the paragraph it illustrates belongs
// there, and moving it would change what the article says. Only images that
// were already adjacent in the source get grouped.
//
// The featured image is excluded. It is already the article hero, and on this
// site it frequently IS one of the body images — lib/wordpress.js falls back to
// the first in-body photo when a post has no featured media set — so without
// this the hero would appear twice.
//
// Parsing is deliberately structural rather than regex-only for <figure>:
// WordPress's gallery block nests figures inside a figure, and a lazy
// `</figure>` match would close on the wrong tag and shred the markup.

// Extension is explicit so this module also resolves under plain Node, which is
// how its parsing rules are exercised outside a Next build.
import { decodeEntities } from './html-text.js';

// WordPress serves the same upload at many sizes: `photo-1024x768.jpg`,
// `photo-scaled.jpg`, `photo.jpg`. Comparing raw URLs would miss the match and
// duplicate the hero, so compare normalised filenames.
function imageKey(url = '') {
  let u = url;
  try {
    u = decodeURIComponent(u);
  } catch {
    // A malformed escape sequence is not worth failing over.
  }
  const file = (u.split('?')[0].split('#')[0].split('/').pop() ?? '').toLowerCase();
  return file
    .replace(/\.[a-z0-9]+$/, '')
    .replace(/-\d+x\d+$/, '')
    .replace(/-scaled$/, '');
}

export function isSameImage(a, b) {
  if (!a || !b) return false;
  const ka = imageKey(a);
  return Boolean(ka) && ka === imageKey(b);
}

function attr(tag, name) {
  const m =
    tag.match(new RegExp(`\\b${name}\\s*=\\s*"([^"]*)"`, 'i')) ??
    tag.match(new RegExp(`\\b${name}\\s*=\\s*'([^']*)'`, 'i'));
  return m ? m[1] : null;
}

// Index just past the `</figure>` that closes the figure opened at `openEnd`,
// counting nested figures so gallery blocks survive intact.
function figureEnd(html, openEnd) {
  const re = /<figure\b[^>]*>|<\/figure\s*>/gi;
  re.lastIndex = openEnd;
  let depth = 1;
  for (let m; (m = re.exec(html)); ) {
    depth += m[0].startsWith('</') ? -1 : 1;
    if (depth === 0) return re.lastIndex;
  }
  return html.length; // unclosed figure: treat the rest as part of it
}

function imgTags(chunk) {
  return [...chunk.matchAll(/<img\b[^>]*>/gi)].map((m) => m[0]);
}

function toImage(tag, caption) {
  const src = attr(tag, 'src');
  if (!src) return null;
  const width = Number(attr(tag, 'width')) || undefined;
  const height = Number(attr(tag, 'height')) || undefined;
  const alt = decodeEntities(attr(tag, 'alt') ?? '');
  return { src, alt, caption: caption || '', width, height };
}

function firstCaption(chunk) {
  const m = chunk.match(/<figcaption\b[^>]*>([\s\S]*?)<\/figcaption\s*>/i);
  return m ? decodeEntities(m[1]) : '';
}

// Images carried by one figure. A gallery block holds nested figures, each with
// its own caption, so recurse into those; a plain figure is one image whose
// caption is the figure's own.
function imagesInFigure(chunk) {
  const inner = chunk.slice(chunk.indexOf('>') + 1);
  const nested = [];
  const re = /<figure\b[^>]*>/gi;
  for (let m; (m = re.exec(inner)); ) {
    const end = figureEnd(inner, re.lastIndex);
    nested.push(inner.slice(m.index, end));
    re.lastIndex = end;
  }

  if (nested.length) return nested.flatMap(imagesInFigure);

  const caption = firstCaption(chunk);
  return imgTags(chunk)
    .map((t, i) => toImage(t, i === 0 ? caption : ''))
    .filter(Boolean);
}

// A bare <img> alone in a paragraph: swallow the wrapper too, otherwise an
// empty <p></p> is left behind in the prose.
function paragraphAround(html, start, end) {
  const before = html.slice(0, start);
  const open = before.match(/<p\b[^>]*>\s*$/i);
  if (!open) return null;
  const after = html.slice(end);
  const close = after.match(/^\s*<\/p\s*>/i);
  if (!close) return null;
  return { start: start - open[0].length, end: end + close[0].length };
}

// Locates every image-bearing unit — a <figure> (of any nesting), or a bare
// <img> plus the paragraph wrapping it — as {start, end, images}.
function findImageUnits(html) {
  const units = [];
  const TOKEN = /<figure\b[^>]*>|<img\b[^>]*>/gi;

  for (let m; (m = TOKEN.exec(html)); ) {
    let start = m.index;
    let end;
    let images;

    if (m[0].toLowerCase().startsWith('<figure')) {
      end = figureEnd(html, TOKEN.lastIndex);
      images = imagesInFigure(html.slice(start, end));
    } else {
      end = TOKEN.lastIndex;
      const wrapper = paragraphAround(html, start, end);
      if (wrapper) ({ start, end } = wrapper);
      images = [toImage(m[0], '')].filter(Boolean);
    }

    // Skip past the whole unit so images nested in a figure are not seen twice.
    TOKEN.lastIndex = end;
    units.push({ start, end, images });
  }

  return units;
}

export function splitPostContent(html = '', { featured = null } = {}) {
  if (!html) return [];

  const blocks = [];
  let run = [];
  let cursor = 0;

  const flushRun = () => {
    if (run.length) blocks.push({ type: 'gallery', images: run });
    run = [];
  };

  for (const unit of findImageUnits(html)) {
    // Prose between two units breaks the run; whitespace alone does not, so
    // images the editor placed back-to-back stay in one grid. A unit that held
    // only the hero leaves nothing behind and keeps the run open.
    const between = html.slice(cursor, unit.start);
    if (between.trim()) {
      flushRun();
      blocks.push({ type: 'html', html: between });
    }
    run.push(...unit.images.filter((img) => !isSameImage(img.src, featured)));
    cursor = unit.end;
  }

  const rest = html.slice(cursor);
  flushRun();
  if (rest.trim()) blocks.push({ type: 'html', html: rest });

  return blocks;
}
