// Seeds the CFA Vol. 17 announcement into WordPress: uploads the seven
// competition posters to the media library, then publishes (or updates) the
// post that /cfa renders.
//
// The post body is authored here rather than in wp-admin because its structure
// is load-bearing: lib/cfa-content.js splits it into head / competitions / tail
// so app/cfa/page.jsx can lay the posters out as a grid. Pasting this markup
// into the block editor by hand is easy to get subtly wrong. Editors can still
// retitle and rewrite freely afterwards — the parse keys off structure, not
// wording.
//
// Source material: content/cfa-vol-17/ (the seven posters plus the objectives
// write-up). Facts here come off the posters; see the notes in COMPETITIONS.
// It sits outside public/ on purpose: the posters are inputs to this script,
// and once uploaded the site serves them from the WordPress media library, so
// a second web-served copy would only be dead weight in every deploy bundle.
//
// Usage (PowerShell):
//   $env:ROYAL_MCP_KEY="<api key>"
//   node scripts/seed-cfa-post.mjs            # publish/update
//   node scripts/seed-cfa-post.mjs --dry-run  # print the HTML, touch nothing
//
// Writes go through the Royal MCP plugin's JSON-RPC endpoint, not core
// /wp-json/wp/v2. Core REST rejects this key (`rest_not_logged_in`) and the
// install has no application password set up; the plugin is the sanctioned
// write path. The key is in wp-admin -> Royal MCP -> Settings.
//
// Re-running is safe: posters already in the media library are reused, and the
// post is matched by title and updated in place rather than duplicated.

import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');
const POSTER_DIR = path.join(ROOT, 'content', 'cfa-vol-17');

const DRY_RUN = process.argv.includes('--dry-run');

// Read the same env file the front-end uses, so WP_URL/REVALIDATE_SECRET do not
// have to be repeated on the command line.
async function loadEnvLocal() {
  let text;
  try {
    text = await readFile(path.join(ROOT, '.env.local'), 'utf8');
  } catch {
    return;
  }
  for (const line of text.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/);
    if (!m) continue;
    const value = m[2].trim().replace(/^["']|["']$/g, '');
    if (value && process.env[m[1]] === undefined) process.env[m[1]] = value;
  }
}

// The title is the post's identity here: it is what a re-run matches on, and
// WordPress derives the slug from it. /cfa reads the newest post in the CFA
// category rather than a fixed slug, so the slug itself is not load-bearing.
const POST_TITLE = 'CFA Vol. 17 SMK CBM 2026 — Competition for Achievement';
const CFA_CATEGORY_SLUG = 'cfa';

// Shared across every branch, straight off the posters.
const EVENT_DATE = 'Kamis, 1 Oktober 2026';
const VENUE = 'SMK Citra Bangsa Mandiri Purwokerto';
const PRIZE_POOL = '40 jutaan untuk seluruh cabang lomba';

// The seven branches, in the order the posters list them.
//
// Note on sourcing: `tujuan` comes from "CFA VOL. 17 SMK CBM TAHUN 2026.txt";
// everything else (peserta, narahubung, detail) is read off the posters. Where
// the two disagree the posters win, because they are what is already published:
//   - the write-up's "Mie Kreasi" is "Memasak" on the poster,
//   - "Hitobah" is "Khitobah", "Senam" is "Senam Anak Indonesia Hebat",
//   - "English Vlog" is "Jurnalistik Vlog", so its objectives are restated
//     around journalism rather than English.
//
// The line-up is not final: the write-up also lists Hadroh, whose poster has
// not been made yet. Adding a branch later is one entry in this array plus its
// file in content/cfa-vol-17/ — re-run the script and the grid picks it up.
const COMPETITIONS = [
  {
    name: 'Pramuka',
    file: 'Poster lomba pramuka.jpeg',
    upload: 'cfa-vol-17-pramuka.jpeg',
    subtitle: 'Scout Skill Competition IV',
    peserta: 'Penggalang SMP/MTs se-Kwarcab Banyumas dan sekitarnya',
    contact: 'Kak Machali (085227500111) &amp; Kak Arrianti (085741112077)',
    detail:
      'Mengusung tema <em>“Bersama Pramuka Kita Ciptakan Pemimpin Generasi Penerus Bangsa”</em>, dengan dua mata lomba: Pionering dan PBB Bertongkat. Juara memperoleh tropi, piagam, dan uang pembinaan. Pendaftaran melalui <a href="https://bit.ly/Form-Pendafturen_SSC-IV-CBM2026">formulir Scout Skill Competition IV</a>.',
    tujuan: [
      'Membentuk karakter disiplin, mandiri, tanggung jawab, dan cinta tanah air',
      'Melatih keterampilan kepramukaan seperti baris-berbaris, PBB, dan survival',
      'Menumbuhkan jiwa kepemimpinan dan gotong royong',
      'Mempererat persaudaraan antar peserta didik',
    ],
  },
  {
    name: 'PMR Madya',
    file: 'Poster lomba PMR Madya.jpeg',
    upload: 'cfa-vol-17-pmr-madya.jpeg',
    peserta: 'Tim PMR Madya tingkat SMP/MTs sederajat',
    contact: 'Agus (085101901030)',
    detail:
      'Terbagi menjadi tiga mata lomba: Game Kepalangmerahan (termasuk capacity building), Pertolongan Pertama, dan Perawatan Keluarga. Setiap mata lomba memperebutkan Juara 1–3 serta Harapan 1–3 dengan uang pembinaan dan piagam, ditambah gelar Juara Umum dan Juara Lomba Membuat Tandu/Dragbar.',
    tujuan: [
      'Menumbuhkan jiwa kemanusiaan, peduli, dan suka menolong sesama',
      'Melatih keterampilan dasar pertolongan pertama dan kesehatan',
      'Membentuk kader PMR yang siap siaga dalam kegiatan sosial',
      'Meningkatkan kesadaran siswa tentang pentingnya kesehatan dan kebersihan',
    ],
  },
  {
    name: 'Volly',
    file: 'Poster lomba volly.jpeg',
    upload: 'cfa-vol-17-volly.jpeg',
    peserta: 'Tim putra &amp; putri',
    contact: 'Pak Rafi (+62 858-4293-1899)',
    tujuan: [
      'Menyalurkan bakat dan minat siswa di bidang olahraga',
      'Melatih kerja sama tim, strategi, dan sportivitas',
      'Menumbuhkan jiwa kompetitif yang sehat antar kelas/sekolah',
      'Menjaga kebugaran dan kesehatan tubuh melalui olahraga',
    ],
  },
  {
    name: 'Senam Anak Indonesia Hebat',
    file: 'Poster lomba senam.jpeg',
    upload: 'cfa-vol-17-senam-anak-indonesia-hebat.jpeg',
    peserta: 'Regu putra &amp; putri',
    contact: 'Pak Bagas (+62 858-6778-2608)',
    tujuan: [
      'Menjaga kesehatan jasmani dan kebugaran tubuh siswa',
      'Melatih kekompakan, kerapian, dan estetika gerakan',
      'Menumbuhkan semangat sportivitas dan gembira dalam berolahraga',
      'Mengisi kegiatan dengan hal yang positif dan energik',
    ],
  },
  {
    name: 'Khitobah',
    file: 'Poster lomba khitobah.jpeg',
    upload: 'cfa-vol-17-khitobah.jpeg',
    peserta: 'Perorangan putra &amp; putri',
    contact: 'Bu Riki (+62 896-7557-4352)',
    tujuan: [
      'Meningkatkan kemampuan berbahasa Arab lisan siswa',
      'Melatih keberanian tampil dan berbicara di depan umum',
      'Menanamkan nilai-nilai keislaman melalui materi dakwah',
      'Mencetak generasi yang fasih berbahasa Arab dan berakhlak',
    ],
  },
  {
    name: 'Jurnalistik Vlog',
    file: 'Poster lomba jurnalistik.jpeg',
    upload: 'cfa-vol-17-jurnalistik-vlog.jpeg',
    peserta: 'Tim kelas',
    contact: 'Pak Yusa (+62 878-2497-2920)',
    tujuan: [
      'Mengasah kemampuan siswa meliput, menyusun naskah, dan menyampaikan informasi',
      'Melatih kreativitas membuat konten edukatif yang menarik dan informatif',
      'Menumbuhkan rasa percaya diri siswa untuk tampil di depan kamera',
      'Mengenalkan penggunaan teknologi digital sebagai media belajar dan berkarya',
    ],
  },
  {
    name: 'Memasak',
    file: 'Poster lomba memasak.jpeg',
    upload: 'cfa-vol-17-memasak.jpeg',
    peserta: 'Dibuka untuk umum — terbuka untuk semua peserta',
    contact: 'Pak Alfian (+62 882-2861-3649)',
    tujuan: [
      'Mengembangkan kreativitas dan inovasi siswa dalam mengolah makanan',
      'Melatih jiwa wirausaha dan keterampilan tata boga',
      'Menumbuhkan semangat kemandirian dan kerja sama dalam tim',
      'Mengapresiasi kekayaan kuliner nusantara dengan sentuhan baru',
    ],
  },
];

const MISI = [
  [
    'Mengembangkan potensi diri',
    'Memberikan wadah bagi siswa-siswi untuk menyalurkan bakat dan minat di bidang akademik, seni, olahraga, dan keterampilan.',
  ],
  [
    'Menumbuhkan semangat kompetisi sehat',
    'Membangun jiwa sportivitas, disiplin, kerja sama, dan tanggung jawab antar peserta dari berbagai sekolah.',
  ],
  [
    'Meningkatkan mutu pendidikan',
    'Mendorong sekolah untuk terus meningkatkan kualitas pembelajaran dan pembinaan ekstrakurikuler.',
  ],
  [
    'Mempererat silaturahmi antar sekolah',
    'Menjadi sarana komunikasi dan kolaborasi antar SMP/MTs sederajat dalam membangun lingkungan pendidikan yang positif.',
  ],
  [
    'Menyiapkan generasi berprestasi',
    'Mengasah kemampuan siswa agar siap bersaing di tingkat yang lebih tinggi dan berkontribusi untuk kemajuan bangsa.',
  ],
];

// --- Post body ---------------------------------------------------------------

// Emits the exact shape lib/cfa-content.js looks for:
//   * an <h2> mentioning "Kompetisi", closing the head,
//   * one wp-block-image figure per poster, each with its figcaption,
//   * a wp-block-columns block opening the tail.
function buildContent(media) {
  const posters = COMPETITIONS.map((c) => {
    const item = media.get(c.upload);
    return [
      '<figure class="wp-block-image size-large">',
      `<img src="${item.source_url}" alt="Poster lomba ${c.name} — CFA Vol. 17 SMK CBM 2026" class="wp-image-${item.id}"/>`,
      `<figcaption class="wp-element-caption">${c.name}</figcaption>`,
      '</figure>',
    ].join('');
  }).join('\n');

  const detail = COMPETITIONS.map((c) => {
    const lines = [`<h3>${c.name}${c.subtitle ? ` — ${c.subtitle}` : ''}</h3>`];
    if (c.detail) lines.push(`<p>${c.detail}</p>`);
    lines.push('<ul>');
    for (const t of c.tujuan) lines.push(`<li>${t}</li>`);
    lines.push('</ul>');
    lines.push(
      `<p><strong>Peserta:</strong> ${c.peserta}<br/><strong>Narahubung:</strong> ${c.contact}</p>`
    );
    return lines.join('\n');
  }).join('\n');

  const misi = MISI.map(
    ([head, body]) => `<li><strong>${head}.</strong> ${body}</li>`
  ).join('\n');

  return `
<p><strong>CFA (Competition for Achievement) Vol. 17</strong> kembali digelar SMK Citra Bangsa Mandiri Purwokerto pada <strong>${EVENT_DATE}</strong>. Ajang tahunan tingkat <strong>SMP/MTs sederajat</strong> ini membuka tujuh cabang lomba, bebas biaya pendaftaran, dengan total hadiah <strong>${PRIZE_POOL}</strong>.</p>

<div class="wp-block-pullquote"><blockquote><p>Mewujudkan generasi pelajar SMP/MTs yang berprestasi, berkarakter, kreatif, dan berdaya saing melalui ajang kompetisi yang sehat, edukatif, dan menginspirasi.</p></blockquote></div>

<p>Berikut tujuh cabang yang dilombakan. Klik posternya untuk melihat detail tiap lomba.</p>

<h2>Cabang Kompetisi</h2>
${posters}

<div class="wp-block-columns">
<div class="wp-block-column">
<h3>Waktu &amp; Tempat</h3>
<p>${EVENT_DATE}<br/>${VENUE}<br/>Alam Raya Citra Bangsa Mandiri</p>
</div>
<div class="wp-block-column">
<h3>Pendaftaran</h3>
<p>Gratis, tanpa biaya pendaftaran.<br/>Kuota terbatas.<br/>Total hadiah ${PRIZE_POOL}.</p>
</div>
</div>

<h2>Tujuan Setiap Lomba</h2>
${detail}

<h2>Visi</h2>
<p>Mewujudkan generasi pelajar SMP/MTs yang berprestasi, berkarakter, kreatif, dan berdaya saing melalui ajang kompetisi yang sehat, edukatif, dan menginspirasi.</p>

<h2>Misi</h2>
<ol>
${misi}
</ol>
`.trim();
}

// --- Royal MCP transport -----------------------------------------------------

let WP_URL;
let ENDPOINT;
let API_KEY;
let sessionId = null;
let rpcId = 0;

// The endpoint speaks JSON-RPC over HTTP and requires a session: `initialize`
// hands back an Mcp-Session-Id that every later call must echo, otherwise the
// server answers "Mcp-Session-Id header required".
async function rpc(method, params) {
  rpcId += 1;
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`,
      ...(sessionId ? { 'Mcp-Session-Id': sessionId } : {}),
    },
    body: JSON.stringify({ jsonrpc: '2.0', id: rpcId, method, params }),
  });

  const sid = res.headers.get('mcp-session-id');
  if (sid) sessionId = sid;

  const text = await res.text();
  let body;
  try {
    body = JSON.parse(text);
  } catch {
    throw new Error(`${method}: HTTP ${res.status}, non-JSON reply: ${text.slice(0, 300)}`);
  }
  if (body.error) throw new Error(`${method}: ${body.error.message}`);
  return body.result;
}

async function connect() {
  const init = await rpc('initialize', {
    protocolVersion: '2025-11-25',
    capabilities: {},
    clientInfo: { name: 'smk-cbm-seed-cfa', version: '1' },
  });
  if (!sessionId) throw new Error('server returned no Mcp-Session-Id');
  return init.serverInfo;
}

// Tool results arrive as MCP content blocks; the payload is JSON inside the
// first text block. Some tools reply with a bare confirmation string, so fall
// back to the raw text rather than failing to parse it.
async function callTool(name, args = {}) {
  const result = await rpc('tools/call', { name, arguments: args });
  const text = result?.content?.find((c) => c.type === 'text')?.text ?? '';
  if (result?.isError) throw new Error(`${name}: ${text.slice(0, 300)}`);
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

async function resolveCfaCategory() {
  const cats = await callTool('wp_get_categories', { per_page: 100 });
  const cat = cats.find((c) => c.slug === CFA_CATEGORY_SLUG);
  if (!cat) {
    throw new Error(
      `No category with slug "${CFA_CATEGORY_SLUG}" on this install — create it ` +
        `in wp-admin first, otherwise /cfa has nothing to read (docs/domain-cutover.md).`
    );
  }
  return cat.id;
}

// Strips WordPress's collision suffix ("poster-1.jpeg") and the extension, so a
// second run recognises a poster it uploaded earlier.
function mediaKey(url) {
  return decodeURIComponent(url.split('/').pop() ?? '')
    .replace(/\.[^.]+$/, '')
    .replace(/-\d+$/, '');
}

async function loadMediaIndex() {
  const items = await callTool('wp_get_media', { per_page: 100, mime_type: 'image' });
  return new Map(items.map((m) => [mediaKey(m.url), m]));
}

// Uploads a poster unless the library already has it. Alt text rides along with
// the upload here — without it the grid is unusable with a screen reader.
async function ensureMedia(c, index) {
  const key = c.upload.replace(/\.[^.]+$/, '');
  const existing = index.get(key);
  if (existing) {
    console.log(`  = ${c.upload} (already uploaded, id ${existing.id})`);
    return { id: existing.id, source_url: existing.url };
  }

  const bytes = await readFile(path.join(POSTER_DIR, c.file));
  const created = await callTool('wp_upload_media', {
    filename: c.upload,
    content_base64: bytes.toString('base64'),
    title: `Poster lomba ${c.name} — CFA Vol. 17`,
    alt_text: `Poster lomba ${c.name} — CFA Vol. 17 SMK CBM 2026`,
    caption: c.name,
  });

  const url = created.url ?? created.source_url;
  console.log(`  + ${c.upload} -> id ${created.id}`);
  return { id: created.id, source_url: url };
}

// wp_create_post has no slug parameter — WordPress derives the slug from the
// title — so the post is matched by its exact title instead. That is stable
// because POST_TITLE lives in this file.
async function upsertPost(content, categoryId) {
  const excerpt =
    `Tujuh cabang lomba tingkat SMP/MTs sederajat di SMK Citra Bangsa Mandiri ` +
    `Purwokerto, ${EVENT_DATE}. Pendaftaran gratis, total hadiah ${PRIZE_POOL}.`;

  const candidates = await callTool('wp_get_posts', {
    per_page: 100,
    search: 'CFA Vol. 17',
  });
  const existing = (Array.isArray(candidates) ? candidates : []).find(
    (p) => (p.title ?? '').trim() === POST_TITLE
  );

  if (existing) {
    const post = await callTool('wp_update_post', {
      id: existing.id,
      title: POST_TITLE,
      status: 'publish',
      excerpt,
      content,
    });
    console.log(`  ~ updated post ${existing.id}`);
    return post;
  }

  const post = await callTool('wp_create_post', {
    title: POST_TITLE,
    status: 'publish',
    categories: [categoryId],
    excerpt,
    content,
  });
  console.log(`  + created post ${post.id ?? '?'}`);
  return post;
}

// Purges the front-end's CMS cache so /cfa shows the post without waiting out
// the 5-minute ISR window. Best-effort: a failure here is not a seeding failure.
async function pingRevalidate() {
  const secret = process.env.REVALIDATE_SECRET;
  const site = process.env.SITE_URL || 'https://smkcbm.sch.id';
  if (!secret) {
    console.log('  · REVALIDATE_SECRET not set — skipping cache purge.');
    return;
  }
  try {
    const res = await fetch(`${site}/api/revalidate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Revalidate-Secret': secret,
      },
      body: JSON.stringify({ slug: 'cfa', status: 'publish' }),
    });
    console.log(`  · revalidate ${site}: ${res.status}`);
  } catch (err) {
    console.log(`  · revalidate ping failed (harmless): ${err.message}`);
  }
}

async function main() {
  await loadEnvLocal();

  WP_URL = process.env.WP_URL?.replace(/\/$/, '');
  if (!WP_URL) throw new Error('WP_URL is not set (.env.local or environment).');

  if (DRY_RUN) {
    // Stand-ins so the body can be rendered without touching WordPress.
    const media = new Map(
      COMPETITIONS.map((c) => [
        c.upload,
        { id: 0, source_url: `${WP_URL}/wp-content/uploads/${c.upload}` },
      ])
    );
    process.stdout.write(buildContent(media));
    process.stdout.write('\n');
    return;
  }

  API_KEY = process.env.ROYAL_MCP_KEY;
  if (!API_KEY) {
    throw new Error(
      'Set ROYAL_MCP_KEY (wp-admin -> Royal MCP -> Settings -> API Key).'
    );
  }
  ENDPOINT = `${WP_URL}/wp-json/royal-mcp/v1/mcp`;

  const server = await connect();
  console.log(`WordPress: ${WP_URL}`);
  console.log(`Server:    ${server?.name} ${server?.version}`);

  const categoryId = await resolveCfaCategory();
  console.log(`Category "${CFA_CATEGORY_SLUG}" -> ${categoryId}`);

  console.log('Media:');
  const index = await loadMediaIndex();
  const media = new Map();
  for (const c of COMPETITIONS) {
    media.set(c.upload, await ensureMedia(c, index));
  }

  console.log('Post:');
  await upsertPost(buildContent(media), categoryId);

  console.log('Cache:');
  await pingRevalidate();

  console.log('\nDone. Check /cfa.');
}

main().catch((err) => {
  console.error(`\n${err.message}`);
  process.exitCode = 1;
});
