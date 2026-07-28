// Turns a fragment of CMS HTML into plain text: drops tags and decodes the
// handful of entities WordPress actually emits (smart quotes and dashes come
// from wptexturize, &amp;/&nbsp; from the editor). Shared by the CFA parser and
// the post-image splitter so the two cannot drift apart.
export function decodeEntities(s = '') {
  return s
    .replace(/<[^>]+>/g, ' ')
    .replace(/&#8220;|&#8221;|&#34;|&quot;/g, '"')
    .replace(/&#8216;|&#8217;|&#39;/g, "'")
    .replace(/&#8211;|&#8212;/g, '–')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
