import fs from 'node:fs';
const SRC = 'content/sales/reports/beltline-visibility-report.html';
const OUT = 'content/sales/reports/_system/beltline-report.template.html';
let s = fs.readFileSync(SRC, 'utf8');

const gAll = (f, r) => { if (!s.includes(f)) throw new Error('MISS g: ' + f.slice(0,50)); s = s.split(f).join(r); };
const one = (f, r) => { const i = s.indexOf(f); if (i < 0) throw new Error('MISS 1: ' + f.slice(0,50)); s = s.slice(0,i) + r + s.slice(i+f.length); };
const seq = (f, rs) => { for (const r of rs) { const i = s.indexOf(f); if (i < 0) throw new Error('MISS seq: ' + f); s = s.slice(0,i)+r+s.slice(i+f.length); } };

// identity (global)
gAll('[Business Name]', '{{business.name}}');
gAll('[Trail segment · neighborhood]', '{{business.location}}');
gAll('[Month Year]', '{{business.date}}');
gAll('[Competitor A]', '{{comp.0.name}}');
gAll('[Competitor B]', '{{comp.1.name}}');
gAll('[Competitor C]', '{{comp.2.name}}');
// example-query fragments (global) — used inside .why captions + mockup chrome/ask
gAll('[category]', '{{business.category}}');
gAll('[neighborhood]', '{{business.neighborhood}}');
gAll('[business]', '{{business.short}}');

// mockup competitor "why" lines
one('[4.8 ★ · 300+ reviews]', '{{comp.0.why}}');
one('[4.7 ★ · 210 reviews]', '{{comp.1.why}}');
one('[4.6 ★ · 140 reviews]', '{{comp.2.why}}');
// AI-absent line
one(' · not named in the AI answer <b>(0 of 9 tests)</b>', ' · {{ai.absent}}');

// scorecard scores + findings + verdict
seq('[x/10]', ['{{seo.score}}', '{{geo.score}}', '{{aeo.score}}']);
one('[Headline finding: e.g. solid Maps listing, but reviews have gone quiet and the site fails mobile speed]', '{{seo.finding}}');
one('[e.g. Asked 3 AI engines for your category near the Beltline: you appeared in 0 of 9 answers]', '{{geo.finding}}');
one('[e.g. Customer questions on your Google profile are answered by strangers, not you]', '{{aeo.finding}}');
one('[Two honest sentences: the biggest leak, and the fastest fix.]', '{{verdict}}');

// Layer 01 SEO table pairs
one('<td class="sc">[✓/✗/partial]</td><td class="sc">[categories, hours, photos, attributes, description]</td>', '<td class="sc">{{seo.gbp.status}}</td><td class="sc">{{seo.gbp.finding}}</td>');
one('<td class="sc">[✓/✗]</td><td class="sc">[rating · count · last review · response rate]</td>', '<td class="sc">{{seo.reviews.status}}</td><td class="sc">{{seo.reviews.finding}}</td>');
one('<td class="sc">[position]</td><td class="sc">[query-by-query]</td>', '<td class="sc">{{seo.localpack.status}}</td><td class="sc">{{seo.localpack.finding}}</td>');
one('<td class="sc">[pass/fail]</td><td class="sc">[LCP · load · mobile issues]</td>', '<td class="sc">{{seo.speed.status}}</td><td class="sc">{{seo.speed.finding}}</td>');
one('<td class="sc">[✓/✗]</td><td class="sc">[claimed? accurate?]</td>', '<td class="sc">{{seo.maps.status}}</td><td class="sc">{{seo.maps.finding}}</td>');
// Layer 02 GEO
one('<td class="sc">[x of 9]</td><td class="sc">[who appears instead, engine by engine]</td>', '<td class="sc">{{geo.aitest.status}}</td><td class="sc">{{geo.aitest.finding}}</td>');
one('<td class="sc">[✓/✗/thin]</td><td class="sc">[present where, absent where]</td>', '<td class="sc">{{geo.corpus.status}}</td><td class="sc">{{geo.corpus.finding}}</td>');
one('<td class="sc">[✓/✗]</td><td class="sc">[lists checked, inclusion]</td>', '<td class="sc">{{geo.lists.status}}</td><td class="sc">{{geo.lists.finding}}</td>');
one("<td class=\"sc\">[✓/✗]</td><td class=\"sc\">[what exists, what's missing]</td>", '<td class="sc">{{geo.schema.status}}</td><td class="sc">{{geo.schema.finding}}</td>');
// Layer 03 AEO
one('<td class="sc">[✓/✗]</td><td class="sc">[open questions · who answers]</td>', '<td class="sc">{{aeo.qa.status}}</td><td class="sc">{{aeo.qa.finding}}</td>');
one('<td class="sc">[✓/✗/thin]</td><td class="sc">[what exists]</td>', '<td class="sc">{{aeo.qcontent.status}}</td><td class="sc">{{aeo.qcontent.finding}}</td>');
one('<td class="sc">[x of y]</td><td class="sc">[who owns each answer]</td>', '<td class="sc">{{aeo.answers.status}}</td><td class="sc">{{aeo.answers.finding}}</td>');

// --- image system: CSS + figure token slots ---
const cssAnchor = '@media(max-width:640px){.moment{grid-template-columns:1fr;}.flow{grid-template-columns:1fr 1fr;}}';
one(cssAnchor, cssAnchor + `
/* photography (figures injected by build only when an image is provided) */
img{max-width:100%;}
.coverfig{margin:28px 0 0;}
.coverfig img{width:100%;height:auto;max-height:400px;object-fit:cover;object-position:center 22%;border-radius:14px;border:1px solid var(--hairline);display:block;box-shadow:0 14px 34px rgba(59,33,20,0.08);}
.figcap{font-size:0.74rem;color:var(--ink-50);margin:9px 0 0;max-width:66ch;}
.ridefig{margin:22px 0 2px;}
.ridefig img{width:100%;height:210px;object-fit:cover;object-position:center 38%;border-radius:12px;border:1px solid var(--hairline);display:block;}`);
one('.hbars,.screen,.flow{break-inside:avoid;}', '.hbars,.screen,.flow,.coverfig,.ridefig{break-inside:avoid;}');

// figure slots
const prep = `    <div class="prep">
      <span>Prepared for <b class="slot">{{business.name}}</b></span>
      <span>Location <b class="slot">{{business.location}}</b></span>
      <span>Date <b class="slot">{{business.date}}</b></span>
    </div>`;
one(prep, prep + '\n    {{FIGURE_COVER}}');
one('across three layers.</p>', 'across three layers.</p>\n    {{FIGURE_RIDE}}');

fs.mkdirSync('content/sales/reports/_system', { recursive: true });
fs.writeFileSync(OUT, s, 'utf8');
const tokens = [...new Set((s.match(/\{\{[^}]+\}\}/g) || []))].sort();
console.log('WROTE', OUT, s.length, 'bytes');
console.log('tokens (' + tokens.length + '):', tokens.join(' '));
const leftover = (s.match(/\[[^\]]{2,60}\]/g) || []).filter(x => !x.includes('data:'));
console.log('leftover [brackets]:', leftover);
