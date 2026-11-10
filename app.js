/* TESLAQTOBE AI GEO-ROUTE — 3D интерактивті модель. Барлық сандық көрсеткіштер прототиптік сценарий деректері. */
(function () {
'use strict';
const $ = s => document.querySelector(s);
const app = $('#app'), canvas = $('#gl');

/* ───────────── 1. География ───────────── */
// Ақтөбе облысының шекарасы (OpenStreetMap / Nominatim, жеңілдетілген), [бойлық, ендік]
const OUTLINE = [[53.61,49.53],[53.62,49.48],[53.69,49.47],[53.62,49.28],[53.65,49.2],[53.87,49.1],[53.91,49.16],[53.99,49.17],[54.03,48.76],[54.46,48.64],[54.54,48.64],[54.58,48.78],[54.66,48.8],[54.91,48.71],[54.93,48.56],[54.88,48.37],[54.97,48.27],[54.94,48.1],[55.1,47.96],[55.12,47.8],[55.0,47.2],[55.23,46.87],[55.45,46.73],[56.29,46.51],[56.32,46.38],[56.44,46.24],[56.61,45.93],[56.74,45.18],[58.59,45.59],[59.1,45.32],[59.03,46.01],[59.56,46.5],[60.13,46.89],[60.47,46.91],[60.5,47.12],[60.92,47.11],[61.36,47.82],[61.92,47.83],[62.08,47.72],[62.21,47.55],[62.33,47.53],[62.61,47.33],[62.58,47.24],[62.86,47.21],[62.89,47.18],[64.01,47.7],[64.28,47.9],[64.12,48.0],[63.77,48.45],[63.08,48.68],[63.05,48.76],[63.13,48.86],[63.02,48.93],[62.85,48.85],[62.55,49.02],[62.45,49.2],[62.36,49.2],[62.55,49.25],[62.3,49.5],[62.37,49.58],[62.47,49.56],[62.44,49.68],[62.56,49.74],[62.66,49.91],[62.79,49.94],[62.93,49.88],[62.95,50.0],[62.74,50.21],[62.63,50.39],[62.51,50.48],[62.53,50.52],[62.44,50.69],[62.27,50.64],[62.23,50.68],[62.28,50.72],[62.22,50.81],[62.43,50.85],[62.23,50.98],[62.21,51.01],[62.28,51.08],[62.13,51.14],[62.07,51.07],[61.99,51.09],[61.85,51.32],[61.57,51.24],[61.45,50.81],[60.81,50.66],[60.33,50.67],[60.18,50.78],[60.22,50.81],[60.19,50.84],[60.01,50.82],[59.97,50.77],[60.0,50.67],[59.81,50.54],[59.51,50.5],[59.46,50.58],[59.57,50.58],[59.48,50.64],[58.87,50.7],[58.77,50.81],[58.66,50.81],[58.69,50.89],[58.59,50.87],[58.58,50.94],[58.64,50.99],[58.61,51.05],[58.38,51.07],[58.32,51.16],[58.2,51.13],[58.17,51.06],[58.09,51.07],[58.09,51.12],[57.95,51.09],[57.77,51.14],[57.76,50.92],[57.56,50.94],[57.51,50.88],[57.33,50.94],[57.29,51.04],[57.22,51.04],[57.18,51.11],[56.98,51.06],[56.7,51.08],[56.75,50.98],[56.71,50.97],[56.62,50.99],[56.51,51.09],[56.45,51.06],[56.46,50.97],[56.38,50.97],[56.36,50.9],[56.18,50.94],[56.14,50.75],[55.74,50.55],[55.53,50.61],[55.5,50.67],[55.38,50.65],[55.06,50.82],[55.13,50.88],[55.09,50.92],[54.89,50.92],[54.9,50.96],[54.74,51.04],[54.59,51.03],[54.55,51.0],[54.59,50.94],[54.53,50.93],[54.7,50.89],[54.66,50.82],[54.73,50.62],[54.57,50.55],[54.36,50.32],[54.45,50.22],[54.43,50.1],[54.58,50.01],[54.48,49.82],[54.51,49.74],[54.3,49.67],[54.36,49.63],[54.26,49.58],[53.82,49.6],[53.73,49.57],[53.72,49.51]];
const K = 10, LON0 = 59, LAT0 = 48.3, CL = Math.cos(LAT0 * Math.PI / 180);
const P = (lon, lat) => ({ x: (lon - LON0) * CL * K, z: -(lat - LAT0) * K });
const KM = 111.2 / K;                       // 1 бірлік ≈ 11 км
const OUT = OUTLINE.map(([lo, la]) => P(lo, la));

const NODES = {
  aqtobe:   { n: 'Ақтөбе', lon: 57.21, lat: 50.28, t: 'site' },
  alga:     { n: 'Алға', lon: 57.33, lat: 49.90, t: 'st' },
  hromtau:  { n: 'Хромтау', lon: 58.45, lat: 50.25, t: 'st' },
  qobda:    { n: 'Қобда', lon: 55.65, lat: 50.15, t: 'st' },
  embi:     { n: 'Ембі', lon: 58.15, lat: 48.83, t: 'st' },
  qandy:    { n: 'Қандыағаш', lon: 57.42, lat: 49.47, t: 'town' },
  qarauyl:  { n: 'Қарауылкелді', lon: 55.87, lat: 48.69, t: 'town' },
  shalkar:  { n: 'Шалқар', lon: 59.6, lat: 47.83, t: 'town' },
  qarabutaq:{ n: 'Қарабұтақ', lon: 60.13, lat: 49.95, t: 'town' },
  yrgyzv:   { n: 'Ырғыз ауылы', lon: 61.27, lat: 48.62, t: 'town' },
  abat:     { n: 'Абат-Байтақ', lon: 56.1, lat: 49.9, t: 'site' },
  mugalzhar:{ n: 'Мұғалжар', lon: 58.5, lat: 48.6, t: 'site' },
  aqtolagai:{ n: 'Ақтолағай', lon: 55.6, lat: 47.75, t: 'site' },
  barsyq:   { n: 'Борсық құмдары', lon: 59.15, lat: 47.4, t: 'site' },
  yrgyz:    { n: 'Ырғыз-Торғай', lon: 62.0, lat: 48.45, t: 'site' }
};
for (const id in NODES) { const n = NODES[id], p = P(n.lon, n.lat); n.id = id; n.x = p.x; n.z = p.z; }
// жол бөліктері: [a, b, жол сапасы 0..1, қауіп 0..1]
const EDGE_DEF = [
  ['aqtobe','alga',1,.1],['alga','qandy',1,.1],['qandy','embi',1,.15],['embi','mugalzhar',.7,.2],
  ['aqtobe','hromtau',1,.1],['hromtau','mugalzhar',.6,.3],['aqtobe','qobda',1,.1],['qobda','abat',.7,.15],
  ['abat','alga',.6,.2],['qandy','qarauyl',.8,.2],['qarauyl','aqtolagai',.35,.5],['embi','shalkar',.8,.2],
  ['shalkar','barsyq',.4,.45],['shalkar','yrgyzv',.6,.3],['hromtau','qarabutaq',1,.15],['qarabutaq','yrgyzv',.9,.2],
  ['yrgyzv','yrgyz',.5,.3]
];
const SITE_IDS = ['aqtobe','abat','mugalzhar','aqtolagai','barsyq','yrgyz'];
const ST_IDS = ['aqtobe','alga','hromtau','qobda','embi'];
const ST = {
  aqtobe: { sun: 42, wind: 18, bat: 76, ports: 6, free: 4 }, alga: { sun: 36, wind: 22, bat: 64, ports: 4, free: 3 },
  hromtau: { sun: 30, wind: 26, bat: 81, ports: 4, free: 2 }, qobda: { sun: 28, wind: 14, bat: 52, ports: 2, free: 2 },
  embi: { sun: 34, wind: 20, bat: 69, ports: 4, free: 3 }
};
for (const id of ST_IDS) { const n = NODES[id], o = id === 'aqtobe' ? [2.3, .7] : [1.0, .6]; ST[id].x = n.x + o[0]; ST[id].z = n.z + o[1]; ST[id].id = id; }

const SITES = {
  aqtobe: { cat: 'Қала · бастау нүктесі', tc: '', coord: '50.28° N, 57.21° E', season: 'Жыл бойы', access: 'Асфальт жол', stay: '3 сағ', risk: 'Төмен тәуекел', wx: '+14°C, 1,8 м/с', img: 'aqtobe.jpg', cap: 'Ақтөбе, Нұрдәулет мешіті. Фото: Attila kz, қоғамдық игілік (Wikimedia Commons)',
    text: 'Облыс орталығы, Елек өзенінің бойындағы қала. Барлық маршрут осы жерден басталады, ал алғашқы Smart Station электромобильді жолға дайындайды.', warn: [] },
  mugalzhar: { cat: 'Табиғи нысан', tc: 'g', coord: '48.720° N, 58.320° E', season: 'Мамыр – Қыркүйек', access: 'Жақсы жол', stay: '2 сағ', risk: 'Төмен тәуекел', wx: '+13°C, 0,9 м/с', img: 'mugalzhar.jpg', cap: 'Мұғалжар, қайың шоғы. Фото: Yuriy75, CC BY-SA 3.0 (Wikimedia Commons)',
    text: 'Орал тауларының оңтүстік жалғасы. Бас шыңы — Үлкен Бақтыбай (657 м). Дала мен таулы ландшафттың тоғысқан бірегей аймағы, эндемик өсімдіктер мен бүркіт ұялары кездеседі.', warn: [] },
  aqtolagai: { cat: 'Геологиялық нысан', tc: 'v', coord: '≈ 47.5° N, 55.1° E', season: 'Мамыр – Қазан (құрғақ кезең)', access: 'Далалық жол, жол талғамайтын көлік', stay: '3 сағ', risk: 'Жоғары тәуекел', wx: '+17°C, 4,2 м/с', img: 'aqtolagai.jpg', cap: 'Ақтолағай бор үстірті. Фото: PuzatikVu, CC BY-SA 4.0 (Wikimedia Commons)',
    text: 'Ақ борлы үстірт — ежелгі теңіз түбі. Бор қабаттарынан теңіз жануарларының тасқа айналған қалдықтары мен акула тістері табылады. Жаңбырдан кейін жол жүруге жарамсыз болады.', warn: ['Қолжетімділік', 'Қауіпсіздік'] },
  abat: { cat: 'Тарихи нысан', tc: 'o', coord: '≈ 49.9° N, 56.1° E', season: 'Сәуір – Қазан', access: 'Грейдер жол', stay: '1,5 сағ', risk: 'Төмен тәуекел', wx: '+14°C, 2,4 м/с', img: 'abat.jpg', cap: 'Абат-Байтақ кесенесі. Фото: Yakov Fedorov, CC BY-SA 4.0 (Wikimedia Commons)',
    text: 'Қобда ауданындағы XIV–XV ғасырлардың тарихи-мәдени ескерткіші. Кесене күйдірілген кірпіштен салынған, айналасында құлпытастары бар үлкен қорым бар. Ескерткішті сақтау тәртібі міндетті.', warn: [] },
  barsyq: { cat: 'Табиғи нысан', tc: 'g', coord: '≈ 47.4° N, 59.1° E', season: 'Сәуір – Маусым, Қыркүйек – Қазан', access: 'Құмды жол', stay: '2 сағ', risk: 'Орташа тәуекел', wx: '+19°C, 5,0 м/с', img: 'barsyq.jpg', cap: 'Үлкен Борсық құмындағы ауыл. Фото: CorvusCorax, CC BY-SA 3.0 (Wikimedia Commons)',
    text: 'Шалқар маңындағы ұзын құмды алқап: төбешік құмдар, сексеуіл мен жыңғыл. Су мен байланыс аз болғандықтан жүйе бұл бағытқа қосымша қауіп салмағын береді.', warn: ['Қауіпсіздік'] },
  yrgyz: { cat: 'Табиғи нысан · қорғалатын аумақ', tc: 'g', coord: '≈ 48.5° N, 62.0° E', season: 'Мамыр – Қыркүйек', access: 'Жақсартылған жол, резерват рұқсаты', stay: '3 сағ', risk: 'Орташа тәуекел', wx: '+15°C, 3,1 м/с', img: 'yrgyz.jpg', cap: 'Ырғыз бен Торғайдың төменгі ағысындағы көлдер, ғарыштан. Сурет: ESA Sentinel-2 / Copernicus (Wikimedia Commons)',
    text: 'Ырғыз-Торғай мемлекеттік табиғи резерваты: көлдер жүйесіне мыңдаған су құсы ұшып келеді, далада киіктер мекендейді. Жауапты туризм қағидалары мен арнайы режим сақталады.', warn: ['Экология'] }
};

/* ───────────── 2. Көмекші функциялар ───────────── */
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;
function sm(a, b, v) { const t = clamp((v - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); }
function rng(seed) { return function () { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function inside(x, z) { let c = false; for (let i = 0, j = OUT.length - 1; i < OUT.length; j = i++) { const a = OUT[i], b = OUT[j]; if ((a.z > z) !== (b.z > z) && x < (b.x - a.x) * (z - a.z) / (b.z - a.z) + a.x) c = !c; } return c; }
function edgeDist(x, z) { let m = 1e9; for (let i = 0, j = OUT.length - 1; i < OUT.length; j = i++) { const a = OUT[i], b = OUT[j], vx = b.x - a.x, vz = b.z - a.z; const t = clamp(((x - a.x) * vx + (z - a.z) * vz) / (vx * vx + vz * vz || 1), 0, 1); const dx = x - a.x - vx * t, dz = z - a.z - vz * t, d = dx * dx + dz * dz; if (d < m) m = d; } return Math.sqrt(m); }
const fmt = (v, d = 0) => v.toFixed(d).replace('.', ',');

/* ───────────── 3. Жер бедері ───────────── */
const RA = P(58.85, 50.0), RB = P(58.7, 47.5), MESA = P(55.8, 47.4), DUNE = P(59.15, 47.1), LAKE = P(62.15, 48.3);
const FLAT = Object.values(NODES).map(n => ({ x: n.x, z: n.z })); FLAT.push({ x: ST.aqtobe.x, z: ST.aqtobe.z });
const T = { rock: 0, chalk: 0, sand: 0, wet: 0, dry: 0 };
function terr(x, z) {
  if (!inside(x, z)) return 0;
  const n = Math.sin(x * .35 + 1.3) * Math.cos(z * .4 - .7) + .5 * Math.sin(x * .9 + z * .6) + .25 * Math.sin(x * 1.7 - z * 1.3 + 2);
  let h = .32 + .1 * n;
  const rx = RB.x - RA.x, rz = RB.z - RA.z, tc = clamp(((x - RA.x) * rx + (z - RA.z) * rz) / (rx * rx + rz * rz), 0, 1);
  const d = Math.hypot(x - RA.x - rx * tc, z - RA.z - rz * tc);
  const ridge = 2.3 * Math.exp(-Math.pow(d / 1.25, 2)) * Math.pow(Math.sin(Math.PI * tc), .6) * (.6 + .25 * Math.sin(tc * 40) + .22 * Math.sin(x * 2.7 + z * 1.9));
  h += ridge; T.rock = clamp(ridge / 1.1, 0, 1);
  const ma = Math.atan2(z - MESA.z, x - MESA.x), md = Math.hypot(x - MESA.x, z - MESA.z) + .35 * Math.sin(ma * 5) + .2 * Math.sin(ma * 9 + 1);
  const mesa = sm(2.3, 1.7, md), hills = .55 * Math.exp(-Math.pow((md - 3.1) / .4, 2)) * Math.max(0, Math.sin(ma * 7));
  h += 1.5 * mesa + hills; T.chalk = clamp(mesa + hills * 2 + sm(3.4, 2.3, md) * .5, 0, 1);
  const e = Math.pow((x - DUNE.x) / 2.2, 2) + Math.pow((z - DUNE.z) / 4.5, 2), sand = sm(1.2, .6, e);
  h += sand * (.18 + .2 * Math.sin(x * 3.2 + z * .9) * Math.sin(z * 1.3)); T.sand = sand;
  const wet = sm(2.3, 1.2, Math.hypot(x - LAKE.x, z - LAKE.z)); h = lerp(h, .06, wet); T.wet = wet;
  for (const f of FLAT) { const fd = Math.hypot(x - f.x, z - f.z); if (fd < 1.7) h = lerp(.3, h, sm(.6, 1.7, fd)); }
  T.dry = sm(-16, 22, z) * .85;
  return h * sm(0, 1.2, edgeDist(x, z));
}
const CS = .4, X0 = -38, Z0 = -32, NX = 190, NZ = 165, GH = new Float32Array((NX + 1) * (NZ + 1));
function H(x, z) {
  const gx = (x - X0) / CS, gz = (z - Z0) / CS, i = Math.floor(gx), j = Math.floor(gz);
  if (i < 0 || j < 0 || i >= NX || j >= NZ) return 0;
  const fx = gx - i, fz = gz - j, a = GH[j * (NX + 1) + i], b = GH[j * (NX + 1) + i + 1], c = GH[(j + 1) * (NX + 1) + i], dd = GH[(j + 1) * (NX + 1) + i + 1];
  return fx + fz <= 1 ? a + (b - a) * fx + (c - a) * fz : dd + (c - dd) * (1 - fx) + (b - dd) * (1 - fz);
}

/* ───────────── 4. Жол графы және маршруттау ───────────── */
function hav(a, b) { const r = Math.PI / 180, dl = (b.lat - a.lat) * r, dn = (b.lon - a.lon) * r; const s = Math.sin(dl / 2) ** 2 + Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.sin(dn / 2) ** 2; return 2 * 6371 * Math.asin(Math.sqrt(s)); }
const EDGES = EDGE_DEF.map(([a, b, q, r], idx) => {
  const A = NODES[a], B = NODES[b], km = hav(A, B) * 1.2, speed = q >= .9 ? 80 : q >= .55 ? 55 : 32, ef = 1 + (1 - q) * .4;
  const len = Math.hypot(B.x - A.x, B.z - A.z), N = Math.max(6, Math.ceil(len / .3)), nx = -(B.z - A.z) / len, nz = (B.x - A.x) / len, amp = Math.min(1.1, len * .07), pts = [];
  for (let s = 0; s <= N; s++) { const t = s / N, o = amp * Math.sin(Math.PI * t) * Math.sin(2 * Math.PI * t + idx * 1.7); pts.push({ x: lerp(A.x, B.x, t) + nx * o, z: lerp(A.z, B.z, t) + nz * o }); }
  return { a, b, q, r, km, h: km / speed, kwh: km * .17 * ef, ef, speed, pts, blocked: false, attr: (NODES[a].t === 'site' || NODES[b].t === 'site') ? 1 : 0 };
});
const ADJ = {}; for (const id in NODES) ADJ[id] = [];
EDGES.forEach(e => { ADJ[e.a].push({ to: e.b, e }); ADJ[e.b].push({ to: e.a, e }); });
const CRIT = [['d', 'Қашықтық'], ['t', 'Уақыт'], ['q', 'Жол сапасы'], ['r', 'Қауіп деңгейі'], ['e', 'Энергия шығыны'], ['a', 'Туристік тартымдылық']];
function parts(e, w) { const r = e.r + (e.stormy ? .4 : 0); return { d: w.d * e.km, t: w.t * e.km * (80 / e.speed), q: w.q * e.km * (1 - e.q) * 1.5, r: w.r * e.km * r * 2, e: w.e * e.km * e.ef }; }
function cost(e, w) { if (e.blocked) return Infinity; const p = parts(e, w); return (p.d + p.t + p.q + p.r + p.e) * (1 - .25 * (w.a || 0) * e.attr); }
function norm(w) { const s = CRIT.reduce((t, [k]) => t + (w[k] || 0), 0) || 1, o = {}; CRIT.forEach(([k]) => o[k] = (w[k] || 0) / s); return o; }
function dijkstra(from, to, w0) {
  const w = norm(w0), dist = {}, prev = {}, done = {}, order = [];
  for (const id in NODES) dist[id] = Infinity; dist[from] = 0;
  for (;;) {
    let u = null; for (const id in NODES) if (!done[id] && dist[id] < Infinity && (u === null || dist[id] < dist[u])) u = id;
    if (u === null) break; done[u] = true; order.push(u); if (u === to) break;
    for (const { to: v, e } of ADJ[u]) { const c = dist[u] + cost(e, w); if (c < dist[v]) { dist[v] = c; prev[v] = { u, e }; } }
  }
  if (dist[to] === Infinity) return null;
  const nodes = [to], edges = []; let c = to; while (c !== from) { edges.unshift(prev[c].e); c = prev[c].u; nodes.unshift(c); }
  return { nodes, edges, order };
}
function chain(wps, w) { const nodes = [wps[0]], edges = []; for (let i = 1; i < wps.length; i++) { const r = dijkstra(wps[i - 1], wps[i], w); if (!r) return null; nodes.push(...r.nodes.slice(1)); edges.push(...r.edges); } return { nodes, edges }; }
function polyline(path) { // → {pts, cum, stops:[{id,dist}]}
  const pts = [], stops = [{ id: path.nodes[0], dist: 0 }], cum = [0];
  path.edges.forEach((e, i) => {
    const seg = e.a === path.nodes[i] ? e.pts : e.pts.slice().reverse();
    seg.forEach((p, k) => { if (pts.length && k === 0) return; if (pts.length) { const q = pts[pts.length - 1]; cum.push(cum[cum.length - 1] + Math.hypot(p.x - q.x, p.z - q.z)); } pts.push(p); });
    stops.push({ id: path.nodes[i + 1], dist: cum[cum.length - 1] });
  });
  return { pts, cum, stops, total: cum[cum.length - 1] };
}
function sample(pl, d) { d = clamp(d, 0, pl.total); let i = 1; while (i < pl.cum.length - 1 && pl.cum[i] < d) i++; const a = pl.pts[i - 1], b = pl.pts[i], t = (d - pl.cum[i - 1]) / ((pl.cum[i] - pl.cum[i - 1]) || 1); return { x: lerp(a.x, b.x, t), z: lerp(a.z, b.z, t), ang: Math.atan2(b.x - a.x, b.z - a.z) }; }
function metrics(edges) { let km = 0, h = 0, kwh = 0, rk = 0; edges.forEach(e => { km += e.km; h += e.h; kwh += e.kwh; rk += (e.r + (e.stormy ? .4 : 0)) * e.km; }); return { km, h, kwh, risk: km ? rk / km : 0, co2: km * .17 }; }
function graphKm(a, b) { const r = dijkstra(a, b, { d: 1 }); return r ? metrics(r.edges).km : 0; }

const ROUTES = {
  short: { n: 'Ең қысқа маршрут', goal: 'Мақсаты — қашықтық пен жол уақытын азайту.', c: 0x1f6bff, css: 'var(--blue)', off: -.16, wp: ['aqtobe', 'mugalzhar'], w: { d: 1, t: .5 },
    pdf: { km: 347, h: 14.9, cost: 22563, kwh: 66, co2: 15.7, risk: .20, green: 62, n: 6 } },
  safe: { n: 'Ең қауіпсіз маршрут', goal: 'Жол сапасы, ауа райы, байланыс және қауіп деңгейі басым.', c: 0xf08a12, css: 'var(--orange)', off: .16, wp: ['aqtobe', 'qobda', 'abat', 'alga', 'embi', 'mugalzhar', 'hromtau', 'aqtobe'], w: { d: .3, t: .2, q: 1, r: 1.5, e: .2 },
    pdf: { km: 737, h: 23.7, cost: 24317, kwh: 131, co2: 30.4, risk: .20, green: 63, n: 7 } },
  eco: { n: 'Экологиялық маршрут', goal: 'Табиғи нысандар мен жаңартылатын энергия станцияларына басымдық береді.', c: 0x11a05a, css: 'var(--green)', off: 0, wp: ['aqtobe', 'hromtau', 'mugalzhar', 'shalkar', 'yrgyz'], w: { d: .3, t: .1, q: .2, r: .3, e: 1, a: 1 },
    pdf: { km: 957, h: 29.1, cost: 25305, kwh: 180, co2: 75.8, risk: .44, green: 32, n: 3 } }
};

/* ───────────── 5. Сахна ───────────── */
if (!window.THREE) { $('#start').textContent = '3D кітапхана жүктелмеді'; return; }
let renderer;
try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true }); } catch (err) { $('#start').textContent = 'Бұл браузерде WebGL қолжетімсіз'; return; }
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
const scene = new THREE.Scene(), sky = new THREE.Color(0xbfe0ff);
scene.background = sky; scene.fog = new THREE.Fog(sky, 90, 260);
const camera = new THREE.PerspectiveCamera(45, 1, .1, 600);
camera.position.set(-30, 70, 110);
const controls = new THREE.OrbitControls(camera, canvas);
Object.assign(controls, { enableDamping: true, dampingFactor: .08, maxPolarAngle: 1.45, minDistance: 3, maxDistance: 170, autoRotate: true, autoRotateSpeed: .35 });
controls.target.set(0, 0, 2);
const hemi = new THREE.HemisphereLight(0xdcefff, 0x7a8f5a, .8); scene.add(hemi);
const sun = new THREE.DirectionalLight(0xfff3d6, 1.1); sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048); Object.assign(sun.shadow.camera, { left: -46, right: 46, top: 42, bottom: -42, near: 1, far: 220 }); sun.shadow.bias = -.0006; sun.shadow.camera.updateProjectionMatrix();
scene.add(sun, sun.target);

const mats = {};
function M(color, o) { const k = color + JSON.stringify(o || {}); return mats[k] || (mats[k] = new THREE.MeshStandardMaterial(Object.assign({ color, roughness: .85, metalness: 0 }, o))); }
function mk(geo, mat, x, y, z, parent) { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); m.castShadow = true; m.receiveShadow = true; (parent || scene).add(m); return m; }
const box = (w, h, d) => new THREE.BoxGeometry(w, h, d);
function canvasTex(w, h, draw) { const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'); draw(g, w, h); const t = new THREE.CanvasTexture(c); t.anisotropy = 4; return t; }

// — жер беті —
(function buildTerrain() {
  const nv = (NX + 1) * (NZ + 1), pos = new Float32Array(nv * 3), col = new Float32Array(nv * 3), ins = new Uint8Array(nv), idx = [];
  const mix = (a, b, t) => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
  const G1 = [.38, .6, .27], G2 = [.62, .6, .36], ROCK = [.56, .49, .4], CHALK = [.96, .93, .85], SAND = [.92, .78, .47], WET = [.38, .64, .32];
  for (let j = 0; j <= NZ; j++) for (let i = 0; i <= NX; i++) {
    const k = j * (NX + 1) + i, x = X0 + i * CS, z = Z0 + j * CS, h = terr(x, z);
    GH[k] = h; ins[k] = inside(x, z) ? 1 : 0; pos.set([x, h, z], k * 3);
    let c = mix(G1, G2, T.dry); const v = .92 + .16 * Math.sin(x * 5.1 + z * 3.7) * Math.sin(x * 1.3 - z * 2.1);
    c = mix(c, ROCK, T.rock); c = mix(c, SAND, T.sand); c = mix(c, CHALK, T.chalk); c = mix(c, WET, T.wet);
    col.set([c[0] * v, c[1] * v, c[2] * v], k * 3);
  }
  for (let j = 0; j < NZ; j++) for (let i = 0; i < NX; i++) { const a = j * (NX + 1) + i, b = a + 1, c = a + NX + 1, d = c + 1; if (ins[a] && ins[b] && ins[c] && ins[d]) idx.push(a, c, b, b, c, d); }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setAttribute('color', new THREE.BufferAttribute(col, 3)); g.setIndex(idx); g.computeVertexNormals();
  const m = new THREE.Mesh(g, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: .95, flatShading: true })); m.receiveShadow = true; m.castShadow = true; scene.add(m);
  // облыс «аралының» қабырғасы
  const sh = new THREE.Shape(); OUT.forEach((p, i) => i ? sh.lineTo(p.x, -p.z) : sh.moveTo(p.x, -p.z));
  const eg = new THREE.ExtrudeGeometry(sh, { depth: 3, bevelEnabled: false }); eg.rotateX(-Math.PI / 2); eg.translate(0, -3.02, 0);
  const slab = new THREE.Mesh(eg, [M(0x86ad54), M(0x8a5a35, { roughness: 1 })]); slab.receiveShadow = true; scene.add(slab);
  const grid = new THREE.GridHelper(260, 104, 0x1f6bff, 0x1f6bff); grid.position.y = -3.4; grid.material.transparent = true; grid.material.opacity = .16; scene.add(grid);
})();

function ribbon(pts, w, lift, mat, off) {
  off = off || 0; const n = pts.length, pos = new Float32Array(n * 6), uv = new Float32Array(n * 4), idx = []; let len = 0;
  for (let i = 0; i < n; i++) {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(n - 1, i + 1)]; let tx = b.x - a.x, tz = b.z - a.z; const l = Math.hypot(tx, tz) || 1; tx /= l; tz /= l; const nx = -tz, nz = tx;
    if (i) len += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].z - pts[i - 1].z);
    const cx = pts[i].x + nx * off, cz = pts[i].z + nz * off, hy = Math.max(H(cx, cz), H(cx + nx * w / 2, cz + nz * w / 2), H(cx - nx * w / 2, cz - nz * w / 2)) + lift;
    for (let s = 0; s < 2; s++) { const sg = s ? 1 : -1; pos.set([cx + nx * w / 2 * sg, hy, cz + nz * w / 2 * sg], i * 6 + s * 3); uv.set([len, s], i * 4 + s * 2); }
    if (i < n - 1) { const k = i * 2; idx.push(k, k + 1, k + 2, k + 1, k + 3, k + 2); }
  }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setAttribute('uv', new THREE.BufferAttribute(uv, 2)); g.setIndex(idx);
  const m = new THREE.Mesh(g, mat); scene.add(m); return m;
}
function dense(pts) { const o = []; for (let i = 0; i < pts.length - 1; i++) { const a = pts[i], b = pts[i + 1], n = Math.max(1, Math.ceil(Math.hypot(b.x - a.x, b.z - a.z) / .2)); for (let s = 0; s < n; s++) o.push({ x: lerp(a.x, b.x, s / n), z: lerp(a.z, b.z, s / n) }); } o.push(pts[pts.length - 1]); return o; }

// — жолдар, өзендер —
const roadMat = new THREE.MeshBasicMaterial({ color: 0x4a5568, side: THREE.DoubleSide }), trackMat = new THREE.MeshBasicMaterial({ color: 0x9a8566, side: THREE.DoubleSide });
EDGES.forEach(e => { e.dpts = dense(e.pts); e.pts = e.dpts; ribbon(e.dpts, e.q >= .9 ? .2 : .15, .05, e.q >= .55 ? roadMat : trackMat); });
const waterMat = new THREE.MeshStandardMaterial({ color: 0x3f9be0, roughness: .25, metalness: .1, transparent: true, opacity: .88, side: THREE.DoubleSide });
[[[57.9, 49.5], [57.6, 49.9], [57.25, 50.22], [56.7, 50.5], [56.0, 50.75]], [[58.9, 48.9], [58.2, 48.7], [57.2, 48.2], [56.2, 47.7], [55.6, 47.1]], [[59.6, 49.9], [60.4, 49.2], [61.2, 48.65], [61.9, 48.4]]].forEach(r => {
  const c = new THREE.CatmullRomCurve3(r.map(([lo, la]) => { const p = P(lo, la); return new THREE.Vector3(p.x, 0, p.z); }));
  ribbon(c.getPoints(120).map(v => ({ x: v.x, z: v.z })), .28, .03, waterMat);
});
[[0, 0, 1.25], [.9, .9, .8], [-.8, .9, .7], [.5, -1.1, .6]].forEach(([dx, dz, r]) => { const m = new THREE.Mesh(new THREE.CircleGeometry(r, 20), waterMat); m.rotation.x = -Math.PI / 2; m.position.set(LAKE.x + dx, .13, LAKE.z + dz); scene.add(m); });

// — өсімдік —
(function plants() {
  const R = rng(7), cone = new THREE.ConeGeometry(.17, .5, 6); cone.translate(0, .45, 0); const trunk = new THREE.CylinderGeometry(.03, .04, .25, 5); trunk.translate(0, .12, 0);
  const N = 900, tm = new THREE.InstancedMesh(cone, M(0x3f8f3a), N), km = new THREE.InstancedMesh(trunk, M(0x6b4a2c), N), o = new THREE.Object3D(); let c = 0, guard = 0;
  while (c < N && guard++ < 40000) {
    const x = X0 + R() * 76, z = Z0 + R() * 66; if (!inside(x, z) || edgeDist(x, z) < .5) continue; terr(x, z);
    if (T.rock > .35 || T.chalk > .1 || T.sand > .1 || T.wet > .5 || R() < T.dry * .93) continue;
    if (FLAT.some(f => Math.hypot(x - f.x, z - f.z) < 1.3) || EDGES.some(e => e.pts.some((p, i) => i % 4 === 0 && Math.hypot(x - p.x, z - p.z) < .35))) continue;
    o.position.set(x, H(x, z), z); const s = .4 + R() * .45; o.scale.set(s, s, s); o.updateMatrix(); tm.setMatrixAt(c, o.matrix); km.setMatrixAt(c, o.matrix); c++;
  }
  tm.count = km.count = c; tm.castShadow = km.castShadow = true; scene.add(tm, km);
  // сексеуіл бұталары
  const bush = new THREE.IcosahedronGeometry(.13, 0), bm = new THREE.InstancedMesh(bush, M(0x8a9150), 90);
  for (let i = 0; i < 90; i++) { const x = DUNE.x + (R() - .5) * 4.4, z = DUNE.z + (R() - .5) * 9; o.position.set(x, H(x, z) + .06, z); o.scale.set(1, .7, 1); o.updateMatrix(); bm.setMatrixAt(i, o.matrix); }
  scene.add(bm);
})();

/* — нысандар модельдері — */
const pickables = [], rotors = [], winMat = new THREE.MeshStandardMaterial({ color: 0x9fc4ff, emissive: 0xffd98a, emissiveIntensity: 0, roughness: .4 });
function grp(x, z, pick) { const g = new THREE.Group(); g.position.set(x, H(x, z), z); if (pick) { g.userData.pick = pick; pickables.push(g); } scene.add(g); return g; }
function town(g, n, rad, R, tall) { for (let i = 0; i < n; i++) { const a = R() * 6.28, r = .25 + R() * rad, w = .22 + R() * .25, h = .25 + R() * tall, b = mk(box(w, h, w), M([0xf2f4f8, 0xdfe7f5, 0xcfe0ff, 0xf7efe2][i % 4]), Math.cos(a) * r, h / 2, Math.sin(a) * r, g); mk(box(w * 1.02, h * .5, w * 1.02), winMat, 0, h * .1, 0, b).castShadow = false; } }
(function city() {
  const R = rng(3), g = grp(NODES.aqtobe.x, NODES.aqtobe.z, { type: 'site', id: 'aqtobe' }); town(g, 30, 1.35, R, 1.5);
  const ms = new THREE.Group(); ms.position.set(.1, 0, .2); g.add(ms); // Нұрдәулет мешіті бейнесі
  mk(box(.7, .35, .7), M(0xffffff), 0, .175, 0, ms); mk(new THREE.SphereGeometry(.3, 16, 10, 0, 6.3, 0, 1.57), M(0x2f7fe0, { roughness: .4 }), 0, .35, 0, ms);
  [[-.42, -.42], [.42, -.42], [-.42, .42], [.42, .42]].forEach(([x, z]) => { mk(new THREE.CylinderGeometry(.035, .045, 1, 8), M(0xffffff), x, .5, z, ms); mk(new THREE.ConeGeometry(.06, .18, 8), M(0x2f7fe0), x, 1.09, z, ms); });
  ['alga', 'hromtau', 'qobda', 'embi', 'qandy', 'qarauyl', 'shalkar', 'qarabutaq', 'yrgyzv'].forEach(id => { const n = NODES[id]; town(grp(n.x - .5, n.z - .35), 7, .45, R, .35); });
})();
(function abat() {
  const n = NODES.abat, g = grp(n.x, n.z, { type: 'site', id: 'abat' }), br = M(0xb5673a, { roughness: 1 });
  mk(box(.75, .55, .75), br, 0, .275, 0, g); mk(box(.55, .85, .14), br, 0, .425, .4, g); mk(box(.2, .45, .16), M(0x3a2415), 0, .225, .41, g);
  mk(new THREE.CylinderGeometry(.3, .32, .2, 14), br, 0, .65, -.03, g); mk(new THREE.ConeGeometry(.3, .62, 14), M(0xc27a4c, { roughness: 1 }), 0, 1.06, -.03, g);
  const R = rng(5); for (let i = 0; i < 9; i++) mk(box(.07, .2, .04), M(0xbfb7a6), -.9 + R() * 1.8, .1, -.9 - R() * .6, g);
})();
(function mugalzhar() {
  const n = NODES.mugalzhar, g = grp(n.x, n.z, { type: 'site', id: 'mugalzhar' }), R = rng(11);
  for (let i = 0; i < 12; i++) { const x = -.7 + R() * 1.4, z = -.6 + R() * 1.2; mk(new THREE.CylinderGeometry(.025, .03, .5, 5), M(0xf3f1ea), x, .25, z, g); mk(new THREE.IcosahedronGeometry(.17, 0), M(0x79b64a), x, .58, z, g); }
  for (let i = 0; i < 7; i++) { const s = .15 + R() * .25, m = mk(new THREE.DodecahedronGeometry(s, 0), M(0x8d8172, { flatShading: true }), 1 + R() * 1.2, s * .5, -1 + R() * 2, g); m.rotation.set(R() * 3, R() * 3, R() * 3); }
})();
(function aqtolagai() {
  const n = NODES.aqtolagai, g = grp(n.x, n.z, { type: 'site', id: 'aqtolagai' }), R = rng(13), ch = M(0xf4eedd, { flatShading: true, roughness: 1 });
  for (let i = 0; i < 9; i++) { const h = .35 + R() * .6; mk(new THREE.ConeGeometry(.16 + R() * .2, h, 6), ch, -.9 + R() * 1.8, h / 2, -1.1 + R() * .9, g); }
  mk(box(.5, .04, .34), M(0x7a5a3a), .2, .05, .5, g); mk(new THREE.ConeGeometry(.2, .28, 4), M(0xf08a12), .2, .2, .5, g); // далалық лагерь
})();
(function barsyq() { const n = NODES.barsyq, g = grp(n.x, n.z, { type: 'site', id: 'barsyq' }); mk(new THREE.CylinderGeometry(.3, .32, .3, 12), M(0xf3ead8), 0, .15, 0, g); mk(new THREE.SphereGeometry(.3, 12, 6, 0, 6.3, 0, 1.57), M(0xe9dcc0), 0, .3, 0, g); mk(box(.1, .2, .02), M(0x7a4a2a), 0, .1, .31, g); })();
const birds = [];
(function yrgyz() {
  const n = NODES.yrgyz, g = grp(n.x, n.z, { type: 'site', id: 'yrgyz' }), R = rng(17);
  mk(box(.5, .3, .4), M(0x8a6a48), 0, .15, 0, g); mk(box(.6, .05, .5), M(0x4d7a3a), 0, .33, 0, g); mk(new THREE.CylinderGeometry(.03, .03, .9, 6), M(0x8a6a48), .45, .45, .1, g); mk(box(.3, .22, .3), M(0x8a6a48), .45, .95, .1, g);
  for (let i = 0; i < 40; i++) { const a = R() * 6.28, r = 1.2 + R() * .5; mk(new THREE.ConeGeometry(.03, .3, 4), M(0x7f9a3d), LAKE.x - n.x + Math.cos(a) * r, .1, LAKE.z - n.z + Math.sin(a) * r, g).castShadow = false; }
  const wg = new THREE.PlaneGeometry(.22, .07); wg.translate(.11, 0, 0);
  for (let i = 0; i < 9; i++) { const b = new THREE.Group(), l = new THREE.Mesh(wg, new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide })), r = l.clone(); l.rotation.x = r.rotation.x = -Math.PI / 2; r.scale.x = -1; const lw = new THREE.Group(), rw = new THREE.Group(); lw.add(l); rw.add(r); b.add(lw, rw); scene.add(b); birds.push({ b, lw, rw, a: i * .7, r: 1.2 + (i % 3) * .55, y: 1.3 + (i % 4) * .3, s: .5 + (i % 3) * .12 }); }
})();

// — Tesla Smart Station —
const solarTex = canvasTex(128, 128, (g, w, h) => { g.fillStyle = '#12306e'; g.fillRect(0, 0, w, h); g.strokeStyle = '#9fc4ff'; g.lineWidth = 2; for (let i = 0; i <= 4; i++) { g.beginPath(); g.moveTo(i * 32, 0); g.lineTo(i * 32, h); g.moveTo(0, i * 32); g.lineTo(w, i * 32); g.stroke(); } });
const signTex = canvasTex(256, 128, (g, w, h) => { g.fillStyle = '#1b3fa8'; g.fillRect(0, 0, w, h); g.fillStyle = '#fff'; g.font = '800 34px Arial'; g.textAlign = 'center'; g.fillText('TESLA', w / 2, 44); g.fillText('SMART', w / 2, 80); g.fillText('STATION', w / 2, 116); });
const solarMat = new THREE.MeshStandardMaterial({ map: solarTex, roughness: .25, metalness: .4, emissive: 0x2a5bd0, emissiveIntensity: .1 });
function turbine(parent, x, z, s) {
  const g = new THREE.Group(); g.position.set(x, 0, z); g.scale.setScalar(s || 1); parent.add(g);
  mk(new THREE.CylinderGeometry(.035, .06, 2.2, 8), M(0xf4f6fa), 0, 1.1, 0, g); mk(box(.12, .1, .22), M(0xf4f6fa), 0, 2.22, .02, g);
  const r = new THREE.Group(); r.position.set(0, 2.22, .15); g.add(r); mk(new THREE.SphereGeometry(.06, 8, 6), M(0xe8ecf3), 0, 0, 0, r);
  for (let i = 0; i < 3; i++) { const b = new THREE.Group(); b.rotation.z = i * 2.094; r.add(b); mk(box(.07, .85, .02), M(0xffffff), 0, .45, 0, b); }
  rotors.push(r); return g;
}
function station(id) {
  const s = ST[id], g = grp(s.x, s.z, { type: 'st', id });
  mk(box(2.4, .06, 1.7), M(0xc9ced8), .2, .03, 0, g);
  mk(box(1.1, .7, .85), M(0x1b3fa8), -.4, .41, -.2, g);
  const sign = new THREE.Mesh(new THREE.PlaneGeometry(.9, .45), new THREE.MeshBasicMaterial({ map: signTex })); sign.position.set(-.4, .45, .23); g.add(sign);
  const roof = mk(box(1.25, .04, 1), solarMat, -.4, .92, -.2, g); roof.rotation.x = .3;
  [[.45, .45], [1.25, .45], [.45, -.35], [1.25, -.35]].forEach(([x, z]) => mk(new THREE.CylinderGeometry(.03, .03, .8, 6), M(0xe8ecf3), x, .43, z, g));
  mk(box(1.05, .04, 1.05), solarMat, .85, .85, .05, g);
  mk(box(.16, .45, .12), M(0xffffff), .85, .28, -.2, g); mk(box(.1, .12, .01), new THREE.MeshBasicMaterial({ color: 0x35d0ff }), .85, .36, -.135, g);
  turbine(g, -1.25, -.55, 1); s.group = g; return g;
}
ST_IDS.forEach(station);
// жеке тұрған жел турбиналары мен күн өрісі
[[56.4, 50.6], [59.3, 50.3], [57.0, 49.2], [60.6, 48.9], [58.9, 47.2]].forEach(([lo, la]) => { const p = P(lo, la), g = grp(p.x, p.z); turbine(g, 0, 0, 1.5); turbine(g, .9, .5, 1.2); });
[[57.9, 50.45], [56.6, 49.6]].forEach(([lo, la]) => { const p = P(lo, la), g = grp(p.x, p.z); for (let i = 0; i < 6; i++) { const m = mk(box(.5, .03, .32), solarMat, (i % 3) * .6 - .6, .22, Math.floor(i / 3) * .5, g); m.rotation.x = .45; } });

// — электромобиль —
const car = new THREE.Group(), headMat = new THREE.MeshBasicMaterial({ color: 0xfff6c8 });
(function () {
  mk(box(.5, .16, 1.15), M(0xeef2f8, { roughness: .3, metalness: .5 }), 0, .2, 0, car); mk(box(.44, .16, .6), M(0x1c2c48, { roughness: .2, metalness: .6 }), 0, .34, -.05, car); mk(box(.4, .04, .5), M(0xeef2f8, { roughness: .3 }), 0, .44, -.05, car);
  [[-.25, .36], [.25, .36], [-.25, -.36], [.25, -.36]].forEach(([x, z]) => { const w = mk(new THREE.CylinderGeometry(.11, .11, .08, 12), M(0x15181f), x, .11, z, car); w.rotation.z = Math.PI / 2; });
  [-.17, .17].forEach(x => { const m = new THREE.Mesh(box(.1, .04, .02), headMat); m.position.set(x, .22, .58); car.add(m); const t = new THREE.Mesh(box(.1, .04, .02), new THREE.MeshBasicMaterial({ color: 0xff3b30 })); t.position.set(x, .22, -.58); car.add(t); });
  scene.add(car);
})();
const CS_ = { x: ST.aqtobe.x + .65, z: ST.aqtobe.z + 1.1, ang: 0, speed: 0, bat: 75, km: 0, e: 0 };
function placeCar() { car.position.set(CS_.x, H(CS_.x, CS_.z), CS_.z); car.rotation.y = CS_.ang; }
placeCar();

// — бұлттар, жаңбыр, дауыл —
const clouds = [];
(function () { const R = rng(23), cm = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 1, transparent: true, opacity: .92 }); for (let i = 0; i < 12; i++) { const g = new THREE.Group(); for (let k = 0; k < 4; k++) { const m = new THREE.Mesh(new THREE.SphereGeometry(1 + R() * .9, 8, 6), cm); m.position.set(k * 1.2 - 1.8, R() * .4, R() * .8); m.scale.y = .55; g.add(m); } g.position.set(-45 + R() * 90, 9 + R() * 4, -30 + R() * 60); scene.add(g); clouds.push(g); } })();
const STORM = { x: (NODES.qandy.x + NODES.embi.x) / 2, z: (NODES.qandy.z + NODES.embi.z) / 2 };
const stormCloud = new THREE.Group(); (function () { const m = new THREE.MeshStandardMaterial({ color: 0x4b5568, roughness: 1 }); for (let k = 0; k < 9; k++) { const s = new THREE.Mesh(new THREE.SphereGeometry(1.6 + (k % 3) * .5, 8, 6), m); s.position.set((k % 3) * 2 - 2, (k % 2) * .5, Math.floor(k / 3) * 1.8 - 1.8); s.scale.y = .5; stormCloud.add(s); } stormCloud.position.set(STORM.x, 6, STORM.z); stormCloud.visible = false; scene.add(stormCloud); })();
const flash = new THREE.PointLight(0xcfe0ff, 0, 40); flash.position.set(STORM.x, 5, STORM.z); scene.add(flash);
const rainN = 1400, rainPos = new Float32Array(rainN * 3); for (let i = 0; i < rainN; i++) rainPos.set([STORM.x + (Math.random() - .5) * 16, Math.random() * 6, STORM.z + (Math.random() - .5) * 14], i * 3);
const rainG = new THREE.BufferGeometry(); rainG.setAttribute('position', new THREE.BufferAttribute(rainPos, 3));
const rain = new THREE.Points(rainG, new THREE.PointsMaterial({ color: 0xbcd7ff, size: .09, transparent: true, opacity: .8 })); rain.visible = false; scene.add(rain);

// — маршрут сызықтары —
const flowTex = canvasTex(64, 8, (g, w, h) => { g.fillStyle = '#9a9a9a'; g.fillRect(0, 0, w, h); const gr = g.createLinearGradient(0, 0, w, 0); gr.addColorStop(.15, 'rgba(255,255,255,0)'); gr.addColorStop(.5, '#fff'); gr.addColorStop(.85, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, h); });
flowTex.wrapS = THREE.RepeatWrapping; flowTex.repeat.set(.8, 1);
let selRoute = 'short', labMesh = null, blockMesh = null;
function routeMat(c) { return new THREE.MeshBasicMaterial({ color: c, map: flowTex, transparent: true, side: THREE.DoubleSide, depthWrite: false }); }
function kill(m) { if (m) { scene.remove(m); m.geometry.dispose(); } }
function buildRoutes() {
  for (const k in ROUTES) { const r = ROUTES[k]; kill(r.mesh); r.path = chain(r.wp, r.w); r.pl = r.path ? polyline(r.path) : null; r.mesh = r.pl ? ribbon(r.pl.pts, .3, .13, r.mat || (r.mat = routeMat(r.c)), r.off) : null; }
  styleRoutes();
}
function styleRoutes() { for (const k in ROUTES) { const r = ROUTES[k]; if (!r.mesh) continue; r.mat.opacity = k === selRoute ? 1 : .32; r.mesh.renderOrder = k === selRoute ? 3 : 2; } document.querySelectorAll('#chips .chip').forEach(b => b.setAttribute('aria-pressed', b.dataset.r === selRoute)); }
buildRoutes();
// граф төбелерінің белгілері
const nodeDots = {}; for (const id in NODES) { const n = NODES[id], m = new THREE.Mesh(new THREE.CylinderGeometry(.16, .16, .05, 16), new THREE.MeshBasicMaterial({ color: 0xffffff })); m.position.set(n.x, H(n.x, n.z) + .09, n.z); scene.add(m); nodeDots[id] = m; }

/* ───────────── 6. Smart Station іші ───────────── */
const iScene = new THREE.Scene(); iScene.background = new THREE.Color(0xe9f1fb);
const iCam = new THREE.PerspectiveCamera(55, 1, .1, 100); iCam.position.set(0, 2.1, 6.2);
const iCtl = new THREE.OrbitControls(iCam, canvas); Object.assign(iCtl, { enabled: false, enableDamping: true, enablePan: false, minDistance: 2, maxDistance: 8, maxPolarAngle: 1.52, minAzimuthAngle: -1.1, maxAzimuthAngle: 1.1 }); iCtl.target.set(0, 1.4, -1);
let iStation = 'aqtobe', screenCtx, screenTex; const flowDots = [], batBars = [];
const FLOWP = [[-4.3, 3.7, -2.7], [-1.6, 3.7, -2.7], [-1.6, 2.2, -2.7], [-1.6, .2, -2.1], [2, .2, -2.1], [2, .5, -2.6], [2, .2, -2.1], [4.2, .2, -2.1], [4.2, .2, 1.4], [4.2, .7, 1.4]].map(a => new THREE.Vector3(a[0], a[1], a[2]));
(function interior() {
  const add = (geo, mat, x, y, z) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); iScene.add(m); return m; };
  iScene.add(new THREE.AmbientLight(0xffffff, .65)); const pl = new THREE.PointLight(0xffffff, .8, 30); pl.position.set(0, 3.6, 1.5); iScene.add(pl); const dl = new THREE.DirectionalLight(0xffffff, .35); dl.position.set(3, 5, 6); iScene.add(dl);
  add(box(10, .1, 7), M(0xd5dbe6, { roughness: .6 }), 0, -.05, 0); add(box(10, .1, 7), M(0xf6f8fc), 0, 4.05, 0);
  add(box(10, 4, .1), M(0xf1f5fb), 0, 2, -3.5); add(box(.1, 4, 7), M(0xe6edf8), -5, 2, 0); add(box(.1, 4, 7), M(0xe6edf8), 5, 2, 0);
  add(box(.02, 1.6, 3), new THREE.MeshBasicMaterial({ color: 0xa9d6ff }), 4.94, 2.2, -.6); // терезе
  [-2.5, 0, 2.5].forEach(x => add(box(1.6, .04, .16), new THREE.MeshBasicMaterial({ color: 0xffffff }), x, 3.98, .5));
  // басқару блогы
  add(box(1, 2.1, .6), M(0x1b3fa8, { roughness: .4 }), -1.6, 1.05, -3); for (let i = 0; i < 8; i++) add(box(.07, .07, .02), new THREE.MeshBasicMaterial({ color: i % 3 ? 0x35ff9a : 0xffd23f }), -1.9 + (i % 4) * .2, 1.5 - Math.floor(i / 4) * .2, -2.69);
  // аккумуляторлар
  [1, 2, 3].forEach(x => { add(box(.85, 1.9, .6), M(0xf7f9fc, { roughness: .4 }), x, .95, -3); for (let i = 0; i < 5; i++) { const b = add(box(.5, .2, .02), new THREE.MeshBasicMaterial({ color: 0x2bd46a }), x, .35 + i * .3, -2.69); batBars.push({ m: b, lvl: (i + 1) / 5 }); } });
  // ақпараттық экран
  const c = document.createElement('canvas'); c.width = 512; c.height = 300; screenCtx = c.getContext('2d'); screenTex = new THREE.CanvasTexture(c);
  add(box(2.7, 1.65, .08), M(0x10182c), -3.6, 2.1, -3.42); const scr = new THREE.Mesh(new THREE.PlaneGeometry(2.5, 1.46), new THREE.MeshBasicMaterial({ map: screenTex })); scr.position.set(-3.6, 2.1, -3.37); iScene.add(scr);
  // қуаттау бағанасы
  add(box(.4, 1.3, .3), M(0xffffff, { roughness: .3 }), 4.2, .65, 1.4); add(box(.02, .5, .2), new THREE.MeshBasicMaterial({ color: 0x35d0ff }), 3.99, .85, 1.4);
  // голографиялық карта үстелі
  add(new THREE.CylinderGeometry(1.5, 1.3, .8, 28), M(0x1c2540, { roughness: .4 }), 0, .4, .9);
  const lp = OUT.map(p => new THREE.Vector3(p.x * .034, .86, .9 + p.z * .034)); const holo = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(lp), new THREE.LineBasicMaterial({ color: 0x35d0ff })); iScene.add(holo);
  ST_IDS.forEach(id => add(new THREE.SphereGeometry(.04, 8, 6), new THREE.MeshBasicMaterial({ color: 0xffd23f }), ST[id].x * .034, .9, .9 + ST[id].z * .034));
  SITE_IDS.forEach(id => add(new THREE.ConeGeometry(.03, .1, 6), new THREE.MeshBasicMaterial({ color: 0x35ff9a }), NODES[id].x * .034, .92, .9 + NODES[id].z * .034));
  EDGES.forEach(e => iScene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(e.pts.filter((p, i) => i % 3 === 0 || i === e.pts.length - 1).map(p => new THREE.Vector3(p.x * .034, .865, .9 + p.z * .034))), new THREE.LineBasicMaterial({ color: 0x7a9cff }))));
  // энергия құбыры мен ағыны
  iScene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(FLOWP), new THREE.LineBasicMaterial({ color: 0xf0a020 })));
  for (let i = 0; i < 14; i++) flowDots.push(add(new THREE.SphereGeometry(.07, 8, 6), new THREE.MeshBasicMaterial({ color: 0xffc233 }), 0, 0, 0));
})();
const FLOWL = [0]; for (let i = 1; i < FLOWP.length; i++) FLOWL.push(FLOWL[i - 1] + FLOWP[i].distanceTo(FLOWP[i - 1]));
const HOT = [
  { n: 'Күн + жел кірісі', p: [-4.3, 3.5, -2.7], t: 'Генерация. Шатырдағы күн панелі мен шағын жел генераторының тогы осы жерден ішке кіреді. Күн мен жел бірін-бірі толықтырады.' },
  { n: 'Басқару блогы', p: [-1.6, 2.4, -2.7], t: 'Басқару. Контроллер зарядты реттейді, аккумуляторды артық зарядтан қорғайды және энергияны тұтынушыларға бөледі.' },
  { n: 'Аккумулятор', p: [2, 2.1, -2.7], t: 'Жинақтау. Жаңартылатын энергия тұрақты емес, сондықтан артық қуат аккумуляторда сақталып, түнде және желсіз күні пайдаланылады.' },
  { n: 'Ақпараттық панель', p: [-3.6, 3.1, -3.3], t: 'Тұтыну. Панель станцияның қуатын, батарея зарядын және келесі станцияға дейінгі қашықтықты көрсетеді.' },
  { n: 'Қуаттау нүктесі', p: [4.2, 1.5, 1.4], t: 'Тұтыну. Электромобильді қуаттау орны. Оқушы макетінде нақты зарядтау жүргізілмейді — ол 5 В-тан аспайтын қауіпсіз имитациялық белгі арқылы көрсетіледі.' },
  { n: 'Голографиялық карта', p: [0, 1.25, .9], t: 'GIS-карта. Облыс шекарасы, жол графы, бес Smart Station (сары) және туристік нысандар (жасыл) бір модельде көрсетілген.' }
];

/* ───────────── 7. Орта: уақыт, жел, дауыл ───────────── */
const env = { hour: 13, wind: 8, storm: false };
const live = {}; ST_IDS.forEach(id => live[id] = { bat: ST[id].bat, sun: ST[id].sun, wind: ST[id].wind });
const C_DAY = new THREE.Color(0xbfe0ff), C_NIGHT = new THREE.Color(0x0e1a3a), C_STORM = new THREE.Color(0x77849a), C_DUSK = new THREE.Color(0xffc9a0);
let dayF = 1;
function sunF() { return clamp(Math.sin(Math.PI * (env.hour - 5.5) / 14) / Math.sin(Math.PI * 7.5 / 14), 0, 1) * (env.storm ? .25 : 1); }
function windF() { return Math.min(1.3, env.wind / 8); }
function applyEnv() {
  const a = Math.PI * (env.hour - 5) / 15; dayF = clamp(Math.sin(a), 0, 1);
  sky.copy(C_NIGHT).lerp(C_DUSK, sm(0, .25, dayF) * (1 - sm(.25, .6, dayF))).lerp(C_DAY, sm(.15, .6, dayF)); if (env.storm) sky.lerp(C_STORM, .75);
  scene.fog.color.copy(sky); sun.intensity = (.1 + .85 * dayF) * (env.storm ? .5 : 1); hemi.intensity = .3 + .45 * dayF;
  sun.position.set(Math.cos(a) * 70, 12 + Math.sin(a) * 75, 30); winMat.emissiveIntensity = 1 - sm(.1, .5, dayF); headMat.color.setHex(dayF < .4 ? 0xffffff : 0xfff6c8);
  solarMat.emissiveIntensity = .05 + .3 * sunF(); stormCloud.visible = rain.visible = env.storm;
}
function setStorm(on) {
  env.storm = on; if (on) env.wind = 13; else if (env.wind > 10) env.wind = 8;
  EDGES.forEach(e => { const mid = e.pts[e.pts.length >> 1], d = Math.hypot(mid.x - STORM.x, mid.z - STORM.z); e.blocked = on && e.a === 'qandy' && e.b === 'embi'; e.stormy = on && d < 9; });
  kill(blockMesh); blockMesh = null; if (on) { const e = EDGES.find(e => e.blocked); blockMesh = ribbon(e.pts, .34, .16, new THREE.MeshBasicMaterial({ color: 0xe0483a, side: THREE.DoubleSide })); }
  buildRoutes(); applyEnv();
  if (on) { toast('Дауыл: Қандыағаш – Ембі бөлігі жабылды. Маршруттар қайта есептелді.'); say('storm'); } else toast('Ауа райы қалыпты. Маршруттар бастапқы қалпына келді.');
}

/* ───────────── 8. Дыбыс ───────────── */
const voice = new Audio(); let voiceOn = true, musicOn = true, sayTok = 0, ac = null, mg = null;
function duck(d) { if (ac && mg) mg.gain.setTargetAtTime(musicOn ? (d ? .035 : .1) : 0, ac.currentTime, .4); }
function say(key, onEnd) {
  const tok = ++sayTok; voice.pause(); const fin = () => { if (tok !== sayTok) return; duck(false); if (onEnd) onEnd(); };
  if (!voiceOn) { if (onEnd) setTimeout(() => { if (tok === sayTok) onEnd(); }, 4500); return; }
  voice.src = 'audio/' + key + '.mp3'; voice.onended = fin; voice.onerror = () => setTimeout(fin, 3000); duck(true);
  const p = voice.play(); if (p && p.catch) p.catch(() => setTimeout(fin, 3000));
}
function hush() { sayTok++; voice.pause(); duck(false); }
function startMusic() {
  try { ac = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return; }
  mg = ac.createGain(); mg.gain.value = 0; const lp = ac.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 2400; mg.connect(lp); lp.connect(ac.destination); duck(false);
  const scale = [220, 261.63, 293.66, 329.63, 392, 440, 523.25, 587.33], chords = [[110, 220, 329.63], [130.81, 261.63, 392], [146.83, 220, 293.66], [98, 196, 293.66]];
  let next = ac.currentTime + .3, step = 0, idx = 3; const R = rng(99);
  function tone(f, t, type, peak, att, dur) { const o = ac.createOscillator(), g = ac.createGain(); o.type = type; o.frequency.value = f; g.gain.setValueAtTime(.0001, t); g.gain.linearRampToValueAtTime(peak, t + att); g.gain.exponentialRampToValueAtTime(.0001, t + dur); o.connect(g); g.connect(mg); o.start(t); o.stop(t + dur + .05); }
  setInterval(() => {
    if (ac.state !== 'running') return;
    while (next < ac.currentTime + .7) {
      if (step % 32 === 0) chords[(step / 32) % 4].forEach(f => tone(f, next, 'sine', .22, 2.5, 10.5));
      const beat = step % 8; if (beat === 0 || R() < (beat % 2 ? .3 : .6)) { idx = clamp(idx + Math.round((R() - .5) * 4), 0, scale.length - 1); tone(scale[idx], next, 'triangle', .3, .006, .9); if (R() < .35) tone(scale[idx] * 1.5, next + .11, 'triangle', .14, .006, .6); }
      next += .3; step++;
    }
  }, 200);
}

/* ───────────── 9. Интерфейс ───────────── */
const panel = $('#panel'), pTitle = $('#panelTitle'), pBody = $('#panelBody');
let mode = 'map', view = 'main', started = false, driving = false, touring = false;
function openPanel(title, html) { pTitle.textContent = title; pBody.innerHTML = html; pBody.scrollTop = 0; panel.hidden = false; panel.classList.remove('fold'); $('#panelFold').textContent = 'Жию'; controls.autoRotate = false; $('#hint').hidden = true; }
function closePanel() { panel.hidden = true; }
$('#panelFold').onclick = () => { const f = panel.classList.toggle('fold'); $('#panelFold').textContent = f ? 'Ашу' : 'Жию'; };
$('#panelClose').onclick = () => { closePanel(); hush(); if (view === 'int') exitStation(); };
let toastT; function toast(msg) { const t = $('#toast'); t.textContent = msg; t.hidden = false; clearTimeout(toastT); toastT = setTimeout(() => t.hidden = true, 5200); }
function on(sel, fn) { const el = pBody.querySelector(sel); if (el) el.onclick = fn; }

// — камера қозғалысы —
const tweens = [];
function flyTo(pos, tgt, dur) { tweens.length = 0; tweens.push({ t: 0, dur: dur || 1.5, p0: camera.position.clone(), p1: new THREE.Vector3(pos[0], pos[1], pos[2]), t0: controls.target.clone(), t1: new THREE.Vector3(tgt[0], tgt[1], tgt[2]) }); controls.autoRotate = false; }
function overview(d) { const s = camera.aspect < 1 ? 1.9 : 1; flyTo([0, 46 * s, 60 * s], [0, 0, 2], d); }
function focus(x, z, dist, side) { const y = H(x, z); dist = dist || 1; if (!driving && !touring && view === 'main') flyTo([x + 4.5 * dist * (side || 1), y + 4 * dist, z + 6 * dist], [x, y + .3, z]); }

// — нысан паспорты —
function showSite(id) {
  const s = SITES[id], n = NODES[id], km = graphKm('aqtobe', id); let near = 1e9; ST_IDS.forEach(k => { const d = graphKm(k, id); if (d < near) near = d; });
  const warn = s.warn.slice(); if (near * 2 > 440 * .8) warn.push('Энергия');
  const fl = ['Қолжетімділік', 'Уақыт', 'Қауіпсіздік', 'Энергия', 'Экология'].map(f => `<span class="f${warn.includes(f) ? ' w' : ''}">${f}</span>`).join('');
  openPanel(id === 'yrgyz' ? 'Ырғыз-Торғай резерваты' : id === 'mugalzhar' ? 'Мұғалжар таулары' : id === 'abat' ? 'Абат-Байтақ кесенесі' : id === 'barsyq' ? 'Үлкен Борсық құмдары' : id === 'aqtolagai' ? 'Ақтолағай үстірті' : n.n,
    `<figure class="photo"><img src="img/${s.img}" alt="${n.n}"><figcaption>${s.cap}</figcaption></figure>
     <div class="row"><span class="tag ${s.tc}">${s.cat}</span><span class="tag">${km ? fmt(km) + ' км · бастау нүктесінен' : 'Бастау нүктесі'}</span></div>
     <p>${s.text}</p>
     <h3>Нысан паспорты</h3>
     <dl class="kv"><dt>Аялдау уақыты</dt><dd>${s.stay}</dd><dt>Ең жақсы мезгіл</dt><dd>${s.season}</dd><dt>Қолжетімділік</dt><dd>${s.access}</dd><dt>Координаттар</dt><dd>${s.coord}</dd><dt>Қауіпсіздік</dt><dd>${s.risk}</dd><dt>Нысандағы ауа райы</dt><dd>${s.wx}</dd><dt>Ең жақын Smart Station</dt><dd>${fmt(near)} км</dd></dl>
     <h3>Маршрутқа енгізудің 5 сүзгісі</h3><div class="filters">${fl}</div>
     ${warn.length ? `<p class="note">Ескерту белгісі бар сүзгі: жүйе бұл нысанды маршрутқа тек қосымша шарттармен енгізеді — қауіпсіздік пен қорғау режимі тартымдылықтан жоғары тұрады.</p>` : ''}
     <div class="row"><button class="btn" id="bSay">Дауыспен тыңдау</button><button class="btn s" id="bGo">Көлікпен осында бару</button></div>
     <p class="note">Паспорт мәндері — прототиптік сценарий деректері; «≈» белгісі бар координаттар шамамен берілген.</p>`);
  on('#bSay', () => say(id)); on('#bGo', () => { teleport(n.x + .9, n.z + .9); setMode('drive'); });
  focus(n.x, n.z, id === 'aqtobe' ? 1.3 : 1, id === 'mugalzhar' ? -1 : 1);
}
function nextStation(id) { let best = null, bd = 1e9; ST_IDS.forEach(k => { if (k === id) return; const d = graphKm(id, k); if (d < bd) { bd = d; best = k; } }); return { id: best, km: bd }; }
function stationHTML(id) {
  const s = ST[id], l = live[id], nx = nextStation(id);
  return `<div class="row"><span class="tag g">Қолжетімді</span><span class="tag">Модельдік орын</span></div>
   <div class="grid2"><div class="stat"><small>Күн энергиясы</small><b id="sSun">${fmt(l.sun)} кВт</b></div><div class="stat"><small>Жел энергиясы</small><b id="sWind">${fmt(l.wind)} кВт</b></div>
   <div class="stat"><small>Батарея заряды</small><b id="sBat">${fmt(l.bat)}%</b></div><div class="stat"><small>Зарядтау нүктесі</small><b>${s.free} / ${s.ports} бос</b></div></div>
   <div><small>Жинақталған энергия</small><div class="bar"><i id="sBar" style="width:${l.bat}%"></i></div></div>
   <dl class="kv"><dt>Жалпы қуат (қалыпты жағдайда)</dt><dd>${s.sun + s.wind} кВт</dd><dt>Келесі станцияға дейін</dt><dd>${NODES[nx.id].n} · ${fmt(nx.km)} км</dd></dl>
   <div class="flow"><span>Генерация</span><span>Басқару</span><span>Жинақтау</span><span>Тұтыну</span></div>`;
}
let openSt = null;
function showStation(id) {
  openSt = id; const s = ST[id];
  openPanel('Tesla Smart Station — ' + NODES[id].n, stationHTML(id) +
    `<p>Шалғай туристік маршруттағы шартты ақпараттық және энергетикалық аялдама. Күн панелі мен шағын жел генераторы қуат өндіреді, контроллер реттейді, аккумулятор жинақтайды.</p>
     <div class="row"><button class="btn" id="bIn">Ішіне кіру</button><button class="btn s" id="bSay">Дауыспен тыңдау</button><button class="btn s" id="bSim">Күн мен желді өзгерту</button></div>
     <p class="note">Бұл — дайын салынған станция емес, болашақта техникалық-экономикалық негіздеуді қажет ететін модельдік орын. Қуат мәндері симулятордағы күн уақыты мен желге қарай өзгереді.</p>`);
  on('#bIn', () => enterStation(id)); on('#bSay', () => say('station')); on('#bSim', () => setMode('sim'));
  focus(s.x, s.z, .75);
}
function enterStation(id) {
  iStation = id; openSt = id; view = 'int'; controls.enabled = false; iCtl.enabled = true; iCam.position.set(0, 2.1, 6.2); iCtl.target.set(0, 1.4, -1); tweens.length = 0;
  openPanel('Smart Station іші — ' + NODES[id].n, stationHTML(id) + `<p id="hotText">Сары белгілерді басып, энергияның жолын қадағалаңыз: генерация → басқару → жинақтау → тұтыну. Көріністі сүйреп айналдыруға болады.</p><div class="row"><button class="btn" id="bOut">Сыртқа шығу</button><button class="btn s" id="bSay">Дауыспен тыңдау</button></div>`);
  on('#bOut', exitStation); on('#bSay', () => say('s7')); drawScreen();
}
function exitStation() { if (view !== 'int') return; view = 'main'; iCtl.enabled = false; controls.enabled = !driving && !touring; if (!driving && !touring) showStation(iStation); }

// — маршруттар —
const fmtT = v => v.toLocaleString('ru-RU').replace(/,/g, ',');
function compareTable() {
  const rows = [['Қашықтық (км)', 'km', 0, -1], ['Уақыт (сағ)', 'h', 1, -1], ['Шығын (₸)', 'cost', 0, -1], ['Энергия (кВт·сағ)', 'kwh', 0, -1], ['CO₂ (кг)', 'co2', 1, -1], ['Қауіп деңгейі', 'risk', 2, -1], ['Жасыл энергия (%)', 'green', 0, 1], ['Нысан саны', 'n', 0, 1]], ks = ['short', 'safe', 'eco'];
  return `<div class="tw"><table><thead><tr><th>Көрсеткіш</th>${ks.map(k => `<th><span class="dot" style="--c:${ROUTES[k].css}"></span><br>${ROUTES[k].n.replace(' маршрут', '')}</th>`).join('')}</tr></thead><tbody>${rows.map(([n, f, d, dir]) => { const v = ks.map(k => ROUTES[k].pdf[f]), b = dir < 0 ? Math.min(...v) : Math.max(...v); return `<tr><td>${n}</td>${v.map(x => `<td class="${x === b ? 'best' : ''}">${f === 'cost' ? fmtT(x) : fmt(x, d)}</td>`).join('')}</tr>`; }).join('')}</tbody></table></div>`;
}
function showRoutes() {
  const cards = ['short', 'safe', 'eco'].map(k => { const r = ROUTES[k]; return `<button class="rcard" data-r="${k}" style="--c:${r.css}" aria-pressed="${k === selRoute}"><b><span>${r.n}</span><span>${r.pdf.km} км</span></b><small>${r.goal}</small><br><small>${r.path ? r.path.nodes.map(i => NODES[i].n).filter((v, i, a) => v !== a[i - 1]).join(' → ') : ''}</small></button>`; }).join('');
  openPanel('Маршруттарды салыстыру', cards + `<h3>Салыстыру кестесі</h3>${compareTable()}
    <p>Үш маршруттың мақсаты әртүрлі, сондықтан бір бағыттың барлық көрсеткіш бойынша ең жақсы болуы міндетті емес. Ұзын экологиялық бағыт табиғи нысандарды көбірек қамтиды, бірақ абсолютті энергия шығыны мен көміртек ізі де жоғарылауы мүмкін.</p>
    <div class="row"><button class="btn" id="bTour">Экскурсияны бастау</button><button class="btn s" id="bStorm">${env.storm ? 'Дауылды өшіру' : 'Дауыл демонстрациясы'}</button><button class="btn s" id="bSay">Дауыспен тыңдау</button></div>
    <p class="note">Кестедегі сандар — жоба қосымшасы прототипінің сценарий деректері. 3D картадағы сызықтар сол логиканың схемалық көрінісі: жол графында Дейкстра алгоритмімен есептеледі. Жасыл түс — әр жолдағы ең жақсы мән.</p>`);
  pBody.querySelectorAll('.rcard').forEach(b => b.onclick = () => { pickRoute(b.dataset.r); showRoutes(); });
  on('#bTour', () => setMode('tour')); on('#bStorm', () => { setStorm(!env.storm); showRoutes(); }); on('#bSay', () => say('s5'));
}
function pickRoute(k) { selRoute = k; styleRoutes(); if (touring) stopTour(); }
document.querySelectorAll('#chips .chip').forEach(b => b.onclick = () => { pickRoute(b.dataset.r); if (mode === 'routes') showRoutes(); else toast(ROUTES[k_(b)].n + ' таңдалды'); });
function k_(b) { return b.dataset.r; }

// — жоба бөлімдері (презентацияның 9 беті) —
const SL = [
  { t: 'Жобаның негізгі идеясы', v: 's1', cam: () => overview(), h: `<p>Ақтөбе облысының аумағы үлкен, ал табиғи, геологиялық және тарихи нысандары бір-бірінен алшақ орналасқан. Сондықтан турист үшін картадағы ең қысқа жолды анықтау жеткіліксіз: қашықтық, уақыт, жол жағдайы, ауа райы, қауіпсіздік, бюджет, энергия қоры, көміртек ізі және туристің қызығушылығы қатар ескерілуі қажет.</p>
    <p>Никола Тесла бұл жобада жасанды интеллект немесе GIS технологиясының авторы ретінде көрсетілмейді. Оның энергияны тиімді пайдалану және жүйенің барлық бөлігін өзара байланыстыру идеялары ғылыми шабыт көзі ретінде алынды.</p>
    <h3>Жобаның ғылыми формуласы</h3><div class="flow"><span>Туристік нысан</span><span>GIS дерегі</span><span>Жол</span><span>Қауіпсіздік</span><span>Энергия</span><span>AI бағалау</span><span>Ақылды маршрут</span></div>` },
  { t: 'Өзектілігі, мақсаты және гипотезасы', v: 's2', cam: () => flyTo([-34, 30, 44], [-4, 0, 0]), h: `<h3>Өзектілігі</h3><p>Кейбір нысандарға асфальт жол жетсе, кейбіріне тек белгілі маусымда баруға болады; қорғалатын аумақтарда арнайы режим сақталуы тиіс; ұзақ маршруттарда көлік энергиясы мен аялдау орындары маңызды. Туристке осының бәрін қатар қарастыратын қазақ тіліндегі цифрлық құрал қажет.</p>
    <h3>Зерттеу мәселесі</h3><p>Әртүрлі мақсаттарды бір уақытта ескеретін, өз шешімін түсіндіретін және жағдай өзгергенде маршрутты қайта есептей алатын оқушы деңгейіндегі AI–GIS үлгісін қалай жасауға болады?</p>
    <h3>Мақсаты</h3><p>TESLAQTOBE AI GEO-ROUTE қосымшасының ғылыми негізін, есептеу логикасын және көрнекі прототипін әзірлеу.</p>
    <dl class="kv"><dt>Зерттеу нысаны</dt><dd>Облыстың табиғи, геологиялық, тарихи нысандары және жол желісі</dd><dt>Зерттеу пәні</dt><dd>Маршрутты көпкритерийлі бағалау үдерісі</dd></dl>
    <h3>Гипотеза</h3><p>Егер туристік нысандар, жол, ауа райы, уақыт, бюджет, энергия және көміртек ізі бірыңғай кеңістіктік деректер мен өлшенетін критерийлер арқылы бір модельге біріктірілсе, жүйе ең қысқа, ең қауіпсіз және экологиялық басымдықтағы маршруттарды түсіндіріп ұсына алады және жағдай өзгергенде бағытты бейімдей алады.</p>
    <h3>Әдістері</h3><div class="flow"><span>Әдеби шолу</span><span>Жіктеу</span><span>Картографиялық талдау</span><span>GIS-модельдеу</span><span>Жол графы</span><span>Көпкритерийлі салыстыру</span><span>Прототиптеу</span><span>Сценарийлік тест</span></div>` },
  { t: 'Тесланың энергия идеялары және жаңартылатын энергия', v: 's3', cam: () => focus(ST.aqtobe.x, ST.aqtobe.z, .8), h: `<div class="tesla"><img src="img/tesla.jpg" alt="Никола Тесла"><p>Никола Тесла электр энергиясын өндіру, түрлендіру және жеткізуді жеке құрылғылар жиынтығы емес, өзара байланысқан жүйе ретінде қарастырған. Жобада бұл көзқарас «энергия – қозғалыс – қауіпсіздік – табиғи ресурс» байланысы түрінде қолданылды.</p></div>
    <p class="note">Фото: Наполеон Сарони, шамамен 1890 ж., қоғамдық игілік (Wikimedia Commons).</p>
    <div class="flow"><span>Күн + жел</span><span>Smart Station</span><span>Энергия қоры</span><span>Көлік</span><span>Қауіпсіз қозғалыс</span></div>
    <h3>Жаңартылатын энергияның рөлі</h3><p>Күн ашық кезде панельдердің үлесі жоғары, ал бұлтты әрі желді күндері жел генераторы қосымша қуат береді. Бірақ өндіріс ауа райына тәуелді, сондықтан аккумулятор, заряд контроллері және энергияны басқару жүйесі қажет.</p>
    <h3>Энергияны есептеу логикасы</h3><div class="formula">E = L × e / 100</div><p>Мұнда L — маршрут қашықтығы (км), e — 100 км-ге қажет шартты энергия мөлшері. Мысалы, 347 км × 17 / 100 ≈ 59 кВт·сағ; кейін бұл мән жол ерекшелігі мен ауа райына қарай түзетіледі.</p>` },
  { t: 'Туристік әлеует және нысандарды географиялық бағалау', v: 's4', cam: () => focus(NODES.mugalzhar.x, NODES.mugalzhar.z, 1.3, -1), h: `<div class="row"><span class="tag g">Табиғи</span><span class="tag v">Геологиялық</span><span class="tag o">Тарихи</span></div>
    <p>Әр нысанның координатасы, санаты, маусымы, жолға қолжетімділігі, ұсынылатын аялдау уақыты, экологиялық шектеуі және қауіп деңгейі көрсетілетін жеке паспорты болуы керек. Бұл деректер алгоритмге бір нысанды екіншісімен объективті салыстыруға мүмкіндік береді.</p>
    <h3>Маршрутқа енгізудің 5 сүзгісі</h3><dl class="kv"><dt>Қолжетімділік</dt><dd>Жолмен қауіпсіз жетуге бола ма?</dd><dt>Уақыт</dt><dd>Нысан күндік жоспарға сыя ма?</dd><dt>Қауіпсіздік</dt><dd>Ауа райы, өрт, жол, байланыс тәуекелі</dd><dt>Энергия</dt><dd>Келесі станцияға дейін қор жете ме?</dd><dt>Экология</dt><dd>Қорғалатын аумақ режимі бұзылмай ма?</dd></dl>
    <p>Ең көрікті нысан әрқашан автоматты түрде маршрутқа енгізілмейді: қауіпсіздік пен қорғау режимі тартымдылықтан жоғары тұрады.</p>
    <div class="row">${SITE_IDS.map(i => `<button class="btn s" data-site="${i}">${NODES[i].n}</button>`).join('')}</div>` },
  { t: 'Ақылды маршрут және үш бағыттың логикасы', v: 's5', cam: () => overview(), h: `<p>Пайдаланушы бастапқы нүктені, қызығушылығын, сапар күнін, бюджетін, адам санын және көлік түрін енгізеді. Жүйе нысандарды сүзеді: жол жабық, ауа райы қауіпті болса немесе уақыт жетпесе, жоғары ұпайлы нысан да маршруттан шығарылуы мүмкін.</p>
    <dl class="kv"><dt><span class="dot" style="--c:var(--blue)"></span> Ең қысқа</dt><dd>қашықтық пен уақытты азайту</dd><dt><span class="dot" style="--c:var(--orange)"></span> Ең қауіпсіз</dt><dd>жол сапасы, ауа райы, байланыс</dd><dt><span class="dot" style="--c:var(--green)"></span> Экологиялық</dt><dd>табиғи нысандар, жасыл станциялар</dd></dl>
    ${'%%TABLE%%'}<p class="note">Жоба «экологиялық мазмұн» мен «абсолютті көміртек ізін» бір ұғым ретінде қарастырмайды.</p>
    <div class="row"><button class="btn s" data-go="routes">Маршруттарды ашу</button><button class="btn s" data-go="tour">Экскурсия</button></div>` },
  { t: 'AI–GIS маршруттаудың ғылыми-методикалық негізі', v: 's6', cam: () => flyTo([0, 78, 14], [0, 0, 2]), h: `<div class="flow"><span>Дерек</span><span>Граф</span><span>Критерий</span><span>Салмақ</span><span>AI талдау</span><span>GIS маршрут</span><span>Түсіндірме</span></div>
    <p><b>GIS және жол графы.</b> Карта қабаттарға бөлінеді: жолдар, туристік нысандар, елді мекендер, қорғалатын аумақтар, Smart Station нүктелері, қауіп аймақтары. Графтың төбелері — қиылыстар, нысандар, станциялар; қабырғалары — жол бөліктері.</p>
    <p><b>Маршрут іздеу.</b> Дейкстра алгоритмі бастапқы нүктеден мақсатқа ең аз жинақталған салмақпен жететін жолды кезең-кезеңімен анықтайды. Үлкен картада A* тәсілі іздеуді жылдамдатады.</p>
    <h3>Критерийлер мен салмақтар мысалы</h3><div class="tw"><table><thead><tr><th>Критерий</th><th>Салмақ, %</th></tr></thead><tbody><tr><td>Қашықтық</td><td>25</td></tr><tr><td>Уақыт</td><td>20</td></tr><tr><td>Жол сапасы</td><td>15</td></tr><tr><td>Қауіп деңгейі</td><td>20</td></tr><tr><td>Энергия шығыны</td><td>10</td></tr><tr><td>Туристік тартымдылық</td><td>10</td></tr><tr><td><b>Қосындысы</b></td><td><b>100</b></td></tr></tbody></table></div>
    <p><b>Ауа райына бейімделу.</b> Жел, нөсер, тұман, көктайғақ немесе өрт қаупі жоғарыласа, жүйе қауіпті жол бөлігіне қосымша салмақ береді немесе оны уақытша маршруттан шығарады. AI шешімді «жасырын» шығармауы керек — бұл түсіндірілетін жасанды интеллект қағидасы.</p>
    <div class="row"><button class="btn" data-go="lab">AI зертханада сынап көру</button></div>` },
  { t: 'Tesla Smart Station, қауіпсіздік және әдістеме', v: 's7', cam: () => focus(ST.hromtau.x, ST.hromtau.z, .8), h: `<p>Smart Station нүктелерін таңдауда маршруттардың қиылысына жақындық, станциялар арасындағы қашықтық, елді мекенге қолжетімділік, күн мен жел жағдайы, су басу және өрт қаупі, қорғалатын аумақтан тыс орналасуы ескеріледі.</p>
    <div class="flow"><span>Генерация</span><span>Басқару</span><span>Жинақтау</span><span>Тұтыну</span></div>
    <div class="tw"><table><thead><tr><th>Станция</th><th>Күн, кВт</th><th>Жел, кВт</th><th>Батарея</th></tr></thead><tbody>${ST_IDS.map(i => `<tr><td>${NODES[i].n}</td><td>${ST[i].sun}</td><td>${ST[i].wind}</td><td>${ST[i].bat}%</td></tr>`).join('')}</tbody></table></div>
    <h3>Зерттеу әдістемесі</h3><p>Тәуелсіз айнымалы: маршрут режимі мен пайдаланушы параметрлері. Тәуелді айнымалылар: қашықтық, уақыт, шығын, энергия, CO₂, қауіп және нысан саны. Бақыланатын шарттар: бастапқы нүкте, адам саны, күн саны, көлік түрі.</p>
    <h3>Ғылыми қауіпсіздік</h3><p>3D және Smart Station макетінде 5 В-тан аспайтын дайын модульдер қолдану қарастырылған. 220 В желісі, ашық жоғары қуатты аккумулятор немесе қауіпті электрлік тәжірибе пайдаланылмайды.</p>
    <div class="row">${ST_IDS.map(i => `<button class="btn s" data-st="${i}">${NODES[i].n}</button>`).join('')}</div>` },
  { t: 'Практикалық өнім — TESLAQTOBE AI GEO-ROUTE', v: 's8', cam: () => focus(NODES.yrgyz.x, NODES.yrgyz.z, 1.6), h: `<p>Жобаның практикалық бөлігінде қазақ тіліндегі мобильді қосымшаның прототипі әзірленді. Оның міндеті — турист енгізген деректерді өңдеп, нысандарды сүзу, жол желісін құру, әр маршрут режимін салыстыру және шешімнің себебін түсіндіру.</p>
    <h3>Негізгі модульдер</h3><dl class="kv"><dt>Пайдаланушы параметрлері</dt><dd>қызығушылық, күн, бюджет, адам, көлік</dd><dt>GIS-карта</dt><dd>нысандар мен бағыт</dd><dt>Маршруттарды салыстыру</dt><dd>ортақ критерийлер</dd><dt>Нысан паспорты</dt><dd>координат, маусым, қауіп</dd><dt>Tesla Smart Station</dt><dd>энергия жағдайы</dd><dt>AI күндік жоспар</dt><dd>уақыт кезеңдері</dd><dt>Сапар паспорты</dt><dd>бәрі бір бетте</dd></dl>
    <h3>AI күндік жоспар · 1-күн</h3><ol class="tl"><li><time>09:00</time><span>Сапардың басталуы — Мұғалжар тауларына жолға шығу</span></li><li><time>12:00</time><span>Мұғалжар тауларына жету, табиғатты тамашалау және серуендеу</span></li><li><time>14:00</time><span>Түскі ас</span></li><li><time>15:00</time><span>Ырғыз-Торғай резерватына жолға шығу</span></li><li><time>20:00</time><span>Қонақ үйге орналасу және кешкі ас</span></li></ol>
    <h3>Сапар паспорты</h3><div class="eco"><b>66</b><div><small>ECO SCORE / 100</small><br><span class="tag g">Қанағаттанарлық</span></div></div>
    <div class="grid2"><div class="stat"><small>Қашықтық</small><b>957 км</b></div><div class="stat"><small>Уақыт</small><b>29,1 сағ</b></div><div class="stat"><small>CO₂ үнемі</small><b>−172 кг</b></div><div class="stat"><small>Қаржы үнемі</small><b>−15 787 ₸</b></div></div>
    <p class="note">Салыстыру базасы: сол бағыт бойынша бензин көлігімен ең ұзын маршрут. Қосымшадағы көрсеткіштер прототиптік сценарий деректері, олар нақты навигациялық немесе далалық өлшеу нәтижесін алмастырмайды.</p>
    <h3>Қосымша практикалық жұмыс</h3><p>Ақтөбе облысының ықшам картасы негізінде жарықтандырылған 3D маршрут макеті және төмен кернеулі Smart Station прототипінің қауіпсіз сұлбасы ұсынылған. Үш түсті LED арқылы қысқа, қауіпсіз және экологиялық профиль жеке көрсетіледі.</p>` },
  { t: 'Қорытынды, ғылыми жаңалығы және практикалық маңызы', v: 's9', cam: () => overview(), h: `<h3>Қорытынды</h3><p>Никола Тесланың энергияны өндіру, жеткізу және тиімді пайдалануды біртұтас жүйе ретінде қарастыру идеясы қазіргі AI–GIS маршруттау міндетімен байланыстырылды. Туристік бағыт картадағы бір сызық емес, нысан, жол, ауа райы, қауіпсіздік, уақыт, бюджет, энергия, көміртек ізі және турист қызығушылығы өзара байланысатын кеңістіктік жүйе ретінде қарастырылды.</p>
    <h3>Ғылыми жаңалығы</h3><p>Ақтөбе облысының туристік нысандарын, AI–GIS маршруттауды, жаңартылатын энергияға негізделген Smart Station идеясын, ауа райына бейімделуді, күндік жоспарды және сапар паспортын бір қазақ тіліндегі цифрлық модельге біріктіру. AI — «қара жәшік» емес, шешімге қандай критерий әсер еткенін түсіндіретін көмекші.</p>
    <h3>Практикалық маңызы</h3><p>Өнімді география, информатика, туризм және экологиялық ағарту бағыттарында маршруттық ойлау, кеңістіктік талдау және көпкритерийлі шешім қабылдауды түсіндіруге қолдануға болады.</p>
    <h3>Ғылыми шектеуі</h3><p>Жоба прототиптік деңгейде жасалған. Карта, ауа райы, Smart Station қуаты және басқа сандық көрсеткіштер нақты өндірістік жүйенің толық өлшеуі емес, оларды нақты сапар қауіпсіздігіне кепілдік беретін дерек ретінде пайдалануға болмайды.</p>
    <h3>Ұсыныстар және болашақ даму бағыты</h3><p>Жүйені ресми жол және ауа райы деректерімен байланыстыру, нысандардың координаттарын жергілікті мекемелер арқылы нақтылау, көміртек ізін есептеу коэффициенттерін ашық көрсету, прототипті шағын далалық сынақ және пайдаланушы сауалнамасы арқылы тексеру ұсынылады.</p>
    <div class="flow"><span>Деректі жина</span><span>Нысанды бағала</span><span>Жолды модельде</span><span>Қауіпті тексер</span><span>Энергияны жоспарла</span><span>AI арқылы салыстыр</span><span>GIS-маршрутты негізде</span></div>
    <p class="note"><b>Соңғы ғылыми тұжырым.</b> Ақылды туристік маршрут — ең қысқа жолды табу ғана емес. Ол табиғи және тарихи нысандарды, жол жағдайын, қауіпсіздікті, ауа райын, уақытты, энергияны және туристің мақсатын бір жүйеде байланыстырып, неге дәл осы бағыт таңдалғанын ғылыми тұрғыдан түсіндіре алатын кеңістіктік шешім болуы тиіс.</p>` }
];
let slide = 0;
function showSlide(i, quiet) {
  slide = (i + SL.length) % SL.length; const s = SL[slide];
  openPanel(s.t, `<div class="pager"><button class="btn s" id="bPrev">← Алдыңғы</button><span>${slide + 1} / ${SL.length}</span><button class="btn s" id="bNext">Келесі →</button></div>` + s.h.replace('%%TABLE%%', compareTable()) + `<div class="row"><button class="btn" id="bSay">Дауыспен тыңдау</button><button class="btn s" id="bMute">Дауысты тоқтату</button></div>`);
  on('#bPrev', () => showSlide(slide - 1)); on('#bNext', () => showSlide(slide + 1)); on('#bSay', () => say(s.v)); on('#bMute', hush);
  pBody.querySelectorAll('[data-site]').forEach(b => b.onclick = () => showSite(b.dataset.site));
  pBody.querySelectorAll('[data-st]').forEach(b => b.onclick = () => showStation(b.dataset.st));
  pBody.querySelectorAll('[data-go]').forEach(b => b.onclick = () => setMode(b.dataset.go));
  if (view === 'main') s.cam(); if (!quiet) say(s.v);
}

// — AI зертхана —
const labW = { d: 25, t: 20, q: 15, r: 20, e: 10, a: 10 }; let labFrom = 'aqtobe', labTo = 'yrgyz', labTimers = [];
function showLab() {
  const opts = sel => Object.values(NODES).map(n => `<option value="${n.id}"${n.id === sel ? ' selected' : ''}>${n.n}</option>`).join('');
  openPanel('AI зертхана: көпкритерийлі маршруттау', `<p>Бастау және мақсат нүктесін таңдап, критерийлердің салмағын өзгертіңіз. Дейкстра алгоритмі жол графынан ең тиімді жолды табады және шешімін түсіндіреді.</p>
    <div class="grid2"><label>Бастау нүктесі<select id="lFrom">${opts(labFrom)}</select></label><label>Мақсат нүктесі<select id="lTo">${opts(labTo)}</select></label></div>
    ${CRIT.map(([k, n]) => `<label class="sl"><span>${n}</span><output id="o_${k}">${labW[k]}</output><input type="range" id="w_${k}" min="0" max="100" step="5" value="${labW[k]}"></label>`).join('')}
    <div class="row"><button class="btn" id="bRun">Маршрутты есептеу</button><button class="btn s" id="bPre1">Тек қашықтық</button><button class="btn s" id="bPre2">Қауіпсіздік басым</button><button class="btn s" id="bStorm">${env.storm ? 'Дауылды өшіру' : 'Дауыл қосу'}</button></div>
    <div id="labOut"></div><p class="note">Модель: 15 төбе, 17 жол бөлігі. Қашықтық — координаттар бойынша есептелген шамамен мән (×1,2 жол коэффициенті); энергия — E = L × e / 100, e = 17 кВт·сағ/100 км, нашар жолда 40%-ға дейін артады.</p>`);
  CRIT.forEach(([k]) => { const el = $('#w_' + k); el.oninput = () => { labW[k] = +el.value; $('#o_' + k).textContent = el.value; }; });
  $('#lFrom').onchange = e => labFrom = e.target.value; $('#lTo').onchange = e => labTo = e.target.value;
  const preset = w => { Object.assign(labW, w); showLab(); runLab(); };
  on('#bRun', runLab); on('#bPre1', () => preset({ d: 100, t: 0, q: 0, r: 0, e: 0, a: 0 })); on('#bPre2', () => preset({ d: 10, t: 10, q: 30, r: 50, e: 0, a: 0 })); on('#bStorm', () => { setStorm(!env.storm); showLab(); runLab(); });
  if (view === 'main') flyTo([0, 74, 22], [0, 0, 2]);
}
function runLab() {
  const out = $('#labOut'); if (!out) return; labTimers.forEach(clearTimeout); labTimers = []; kill(labMesh); labMesh = null; for (const id in nodeDots) { nodeDots[id].material.color.setHex(0xffffff); nodeDots[id].scale.setScalar(1); }
  if (labFrom === labTo) { out.innerHTML = '<p class="note">Бастау және мақсат нүктелері әртүрлі болуы керек.</p>'; return; }
  const r = dijkstra(labFrom, labTo, labW); if (!r) { out.innerHTML = '<p class="note">Бұл жағдайда қауіпсіз жол табылмады.</p>'; return; }
  r.order.forEach((id, i) => labTimers.push(setTimeout(() => { nodeDots[id].material.color.setHex(0x7a4cf0); nodeDots[id].scale.setScalar(2.2); }, i * 140)));
  labTimers.push(setTimeout(() => { labMesh = ribbon(polyline(r).pts, .42, .2, routeMat(0x7a4cf0)); labMesh.renderOrder = 5; r.nodes.forEach(id => nodeDots[id].material.color.setHex(0xffd23f)); }, r.order.length * 140 + 100));
  const m = metrics(r.edges), w = norm(labW), sum = { d: 0, t: 0, q: 0, r: 0, e: 0 }; r.edges.forEach(e => { const p = parts(e, w); for (const k in sum) sum[k] += p[k]; });
  const tot = Object.values(sum).reduce((a, b) => a + b, 0) || 1, top = Object.keys(sum).sort((a, b) => sum[b] - sum[a])[0], nm = Object.fromEntries(CRIT);
  out.innerHTML = `<h3>Нәтиже</h3><p><b>${r.nodes.map(i => NODES[i].n).join(' → ')}</b></p>
    <div class="grid2"><div class="stat"><small>Қашықтық</small><b>${fmt(m.km)} км</b></div><div class="stat"><small>Жол уақыты</small><b>${fmt(m.h, 1)} сағ</b></div><div class="stat"><small>Энергия</small><b>${fmt(m.kwh)} кВт·сағ</b></div><div class="stat"><small>Орташа қауіп</small><b>${fmt(m.risk, 2)}</b></div><div class="stat"><small>CO₂ үнемі*</small><b>${fmt(m.co2)} кг</b></div><div class="stat"><small>Қаралған төбе</small><b>${r.order.length} / 15</b></div></div>
    <p><b>Түсіндірме.</b> Шешімге ең көп әсер еткен критерий — «${nm[top]}» (${fmt(sum[top] / tot * 100)}%). ${Object.keys(sum).filter(k => k !== top && sum[k] > 0).sort((a, b) => sum[b] - sum[a]).map(k => `${nm[k]} — ${fmt(sum[k] / tot * 100)}%`).join(', ')}.${env.storm ? ' Дауыл кезінде Қандыағаш – Ембі бөлігі жабық, маңайдағы жолдарға қосымша қауіп салмағы берілді.' : ''}</p>
    <p class="note">* Бензин көлігімен салыстырғандағы шартты мән (0,17 кг/км), көлік Smart Station-да жаңартылатын энергиямен қуатталады деп алынған.</p>`;
}

// — симулятор —
function showSim() {
  openPanel('Симулятор: күн, жел, ауа райы', `<p>Күн уақыты мен жел жылдамдығын өзгертіп, Smart Station желісінің қуаты қалай өзгеретінін бақылаңыз.</p>
    <label class="sl"><span>Күн уақыты</span><output id="oHour"></output><input type="range" id="iHour" min="5" max="22" step="0.5" value="${env.hour}"></label>
    <label class="sl"><span>Жел жылдамдығы</span><output id="oWind"></output><input type="range" id="iWind" min="0" max="15" step="0.5" value="${env.wind}"></label>
    <div class="row"><button class="btn" id="bStorm">${env.storm ? 'Дауылды өшіру' : 'Дауыл демонстрациясы'}</button></div>
    <h3>Станциялар желісі</h3><div class="tw"><table><thead><tr><th>Станция</th><th>Күн, кВт</th><th>Жел, кВт</th><th>Батарея</th></tr></thead><tbody id="simT"></tbody></table></div>
    <div class="grid2"><div class="stat"><small>Желінің жалпы қуаты</small><b id="simSum"></b></div><div class="stat"><small>Қалыпты жағдаймен салыстырғанда</small><b id="simG"></b></div></div>
    <p class="note">Қалыпты жағдай (13:00, жел 8 м/с) — жоба прототипіндегі станция мәндері. Түнде күн панельдері қуат бермейді, сондықтан аккумулятор қоры азаяды; жел генераторы оны ішінара толтырады.</p>`);
  const h = $('#iHour'), w = $('#iWind'); const lab = () => { $('#oHour').textContent = Math.floor(env.hour) + ':' + (env.hour % 1 ? '30' : '00'); $('#oWind').textContent = fmt(env.wind, 1) + ' м/с'; }; lab();
  h.oninput = () => { env.hour = +h.value; applyEnv(); lab(); }; w.oninput = () => { env.wind = +w.value; lab(); };
  on('#bStorm', () => { setStorm(!env.storm); showSim(); });
  if (view === 'main') overview();
}
function refreshLive() {
  const tb = $('#simT'); if (tb) { let s = 0; tb.innerHTML = ST_IDS.map(id => { const l = live[id]; s += l.sun + l.wind; return `<tr><td>${NODES[id].n}</td><td>${fmt(l.sun)}</td><td>${fmt(l.wind)}</td><td>${fmt(l.bat)}%</td></tr>`; }).join(''); $('#simSum').textContent = fmt(s) + ' кВт'; $('#simG').textContent = fmt(s / 270 * 100) + '%'; }
  if (openSt && $('#sSun')) { const l = live[openSt]; $('#sSun').textContent = fmt(l.sun) + ' кВт'; $('#sWind').textContent = fmt(l.wind) + ' кВт'; $('#sBat').textContent = fmt(l.bat) + '%'; $('#sBar').style.width = l.bat + '%'; }
  if (view === 'int') drawScreen();
}
function drawScreen() {
  const g = screenCtx, l = live[iStation], nx = nextStation(iStation); g.fillStyle = '#0d2f8a'; g.fillRect(0, 0, 512, 300); g.fillStyle = '#fff'; g.font = '700 26px Arial'; g.fillText('TESLA SMART STATION', 22, 42); g.font = '600 22px Arial'; g.fillStyle = '#9fc4ff'; g.fillText(NODES[iStation].n, 22, 72);
  const rows = [['Күн энергиясы', fmt(l.sun) + ' кВт', '#ffd23f'], ['Жел энергиясы', fmt(l.wind) + ' кВт', '#7fe0ff'], ['Батарея заряды', fmt(l.bat) + ' %', '#35ff9a'], ['Келесі станция', NODES[nx.id].n + ' · ' + fmt(nx.km) + ' км', '#ffffff']];
  rows.forEach((r, i) => { g.fillStyle = '#c9d8ff'; g.font = '500 20px Arial'; g.fillText(r[0], 22, 118 + i * 44); g.fillStyle = r[2]; g.font = '700 24px Arial'; g.textAlign = 'right'; g.fillText(r[1], 490, 118 + i * 44); g.textAlign = 'left'; });
  g.fillStyle = 'rgba(255,255,255,.2)'; g.fillRect(22, 268, 468, 12); g.fillStyle = '#35ff9a'; g.fillRect(22, 268, 468 * l.bat / 100, 12); screenTex.needsUpdate = true;
  batBars.forEach(b => b.m.material.color.setHex(b.lvl <= l.bat / 100 + .1 ? 0x2bd46a : 0x9aa5b8));
}

// — авторлар —
function showAuthors() {
  openPanel('Жоба туралы', `<span class="tag">Ғылыми жоба · 2026 жыл</span>
    <p><b>TESLAQTOBE AI GEO-ROUTE: Никола Тесланың жаңартылатын энергия идеялары мен жасанды интеллект негізінде Ақтөбе облысының ақылды туристік маршрутын әзірлеу</b></p>
    <div class="people"><div class="person"><small>Орындаған · 10-сынып оқушысы</small><b>Тұрғанбаева Айсана Саматқызы</b></div><div class="person"><small>Орындаған · 10-сынып оқушысы</small><b>Қуандық Нұрислам Сәкенұлы</b></div><div class="person"><small>Ғылыми жетекші</small><b>Жұбаналина Нұрия Шоқанқызы</b></div><div class="person"><small>Мектебі</small><b>«Қаражар орта мектебі» КММ</b></div></div>
    <h3>Жобаның мақсаты</h3><p>Қосымшаның ғылыми негізін, есептеу логикасын және көрнекі прототипін әзірлеу, сондай-ақ Ақтөбе облысында ақылды туристік маршрут пен жаңартылатын энергияға негізделген Smart Station желісін дамыту бойынша ұсыныстар беру.</p>
    <div class="row"><button class="btn" id="bSay">Дауыспен тыңдау</button><button class="btn s" data-go="slides">Жобаны оқу</button></div>
    <h3>Дереккөздер</h3><p class="note">Облыс шекарасы: © OpenStreetMap үлескерлері (ODbL). Фотосуреттер: Wikimedia Commons, авторлары мен лицензиялары әр суреттің астында көрсетілген. Дауыстық сүйемелдеу — қазақ тіліндегі синтезделген дауыс. Барлық сандық көрсеткіштер — прототиптік сценарий деректері.</p>`);
  on('#bSay', () => say('authors')); pBody.querySelectorAll('[data-go]').forEach(b => b.onclick = () => setMode(b.dataset.go));
}

/* ───────────── 10. Жүргізу және экскурсия ───────────── */
const keys = {}, KEYMAP = { ArrowUp: 'up', KeyW: 'up', ArrowDown: 'down', KeyS: 'down', ArrowLeft: 'left', KeyA: 'left', ArrowRight: 'right', KeyD: 'right' };
addEventListener('keydown', e => { const k = KEYMAP[e.code]; if (k && driving) { keys[k] = true; e.preventDefault(); } });
addEventListener('keyup', e => { const k = KEYMAP[e.code]; if (k) keys[k] = false; });
document.querySelectorAll('#pad button').forEach(b => { const k = b.dataset.k; b.onpointerdown = e => { keys[k] = true; e.preventDefault(); }; b.onpointerup = b.onpointerleave = b.onpointercancel = () => keys[k] = false; });
function teleport(x, z) { CS_.x = x; CS_.z = z; CS_.speed = 0; placeCar(); }
let hudAct = null;
function showHud(v) { $('#hud').hidden = !v; if (v) $('#hint').hidden = true; $('#pad').hidden = !(v && driving); }
function startDrive() {
  stopTour(); driving = true; controls.enabled = false; tweens.length = 0; closePanel(); showHud(true); $('#hExit').textContent = 'Картаға оралу';
  toast('Басқару: ↑ ↓ ← → немесе W A S D. Телефонда — экрандағы батырмалар.'); say('drive');
}
function stopDrive() { if (!driving) return; driving = false; for (const k in keys) keys[k] = false; showHud(false); controls.target.set(CS_.x, H(CS_.x, CS_.z), CS_.z); controls.enabled = view === 'main'; }
let tour = null;
function startTour() {
  stopDrive(); const r = ROUTES[selRoute]; if (!r.pl) { toast('Маршрут қолжетімсіз'); return; }
  const seen = {}, stops = r.pl.stops.filter(s => { const n = NODES[s.id]; if (n.t === 'town' || seen[s.id + (s.dist > 0)]) return false; seen[s.id + (s.dist > 0)] = 1; return true; });
  tour = { pl: r.pl, d: 0, stops, i: 0, pause: false, stSaid: false }; touring = true; controls.enabled = false; tweens.length = 0; closePanel(); showHud(true); $('#hExit').textContent = 'Экскурсияны тоқтату';
  CS_.km = 0; CS_.e = 0; CS_.bat = 75; toast(r.n + ' бойынша экскурсия басталды');
}
function stopTour() { if (!touring) return; touring = false; tour = null; hush(); showHud(false); controls.target.set(CS_.x, H(CS_.x, CS_.z), CS_.z); controls.enabled = view === 'main'; }
function tourStop(s) {
  tour.pause = true; const n = NODES[s.id], resume = () => { if (tour) tour.pause = false; };
  if (n.t === 'site' && !(s.id === 'aqtobe' && s.dist > 0)) { showSite(s.id); say(s.id, resume); }
  else { const id = s.id; showStation(id); CS_.bat = 75; if (!tour.stSaid) { tour.stSaid = true; say('station', resume); } else { hush(); setTimeout(resume, 3500); } toast('Smart Station — ' + n.n + ': электромобиль қуатталды'); }
}
$('#hExit').onclick = () => setMode('map');
$('#hAct').onclick = () => { if (hudAct) hudAct(); };
const fwd = new THREE.Vector3(), want = new THREE.Vector3(), look = new THREE.Vector3();
function chase(dt, back, up) { fwd.set(Math.sin(CS_.ang), 0, Math.cos(CS_.ang)); want.copy(car.position).addScaledVector(fwd, -back); want.y += up; camera.position.lerp(want, 1 - Math.exp(-dt * 3.5)); look.copy(car.position); look.y += .4; camera.lookAt(look); }
function useEnergy(du) { const km = du * KM, e = km * .17 * (env.storm ? 1.15 : 1); CS_.km += km; CS_.e += e; CS_.bat = Math.max(0, CS_.bat - e); }
function updDrive(dt) {
  const acc = (keys.up ? 1 : 0) - (keys.down ? 1 : 0); if (CS_.bat <= 0 && acc > 0) CS_.speed *= .9; else CS_.speed += acc * 5 * dt;
  CS_.speed *= acc ? 1 : Math.pow(.2, dt); CS_.speed = clamp(CS_.speed, -2, 5.5);
  const steer = (keys.left ? 1 : 0) - (keys.right ? 1 : 0); CS_.ang += steer * 1.9 * dt * clamp(CS_.speed / 2, -1, 1);
  const nx = CS_.x + Math.sin(CS_.ang) * CS_.speed * dt, nz = CS_.z + Math.cos(CS_.ang) * CS_.speed * dt;
  if (inside(nx, nz) && edgeDist(nx, nz) > .5) { useEnergy(Math.hypot(nx - CS_.x, nz - CS_.z)); CS_.x = nx; CS_.z = nz; } else CS_.speed = 0;
  placeCar(); chase(dt, 4.2, 2.3);
  // жақын нысан / станция
  let act = null; const b = $('#hAct');
  for (const id of ST_IDS) if (Math.hypot(ST[id].x - CS_.x, ST[id].z - CS_.z) < 1.9) act = CS_.bat < 74 ? ['Қуаттау — ' + NODES[id].n, () => { CS_.bat = 75; live[id].bat = Math.max(5, live[id].bat - 8); toast('Электромобиль жаңартылатын энергиямен қуатталды'); }] : ['Станцияны ашу', () => { setMode('map'); showStation(id); }];
  if (!act) for (const id of SITE_IDS) if (Math.hypot(NODES[id].x - CS_.x, NODES[id].z - CS_.z) < 1.9) act = ['Нысанды ашу — ' + NODES[id].n, () => { showSite(id); say(id); }];
  if (!act && CS_.bat <= 0) act = ['Жақын станцияға жеткізу', () => { let bs = ST_IDS[0]; ST_IDS.forEach(i => { if (Math.hypot(ST[i].x - CS_.x, ST[i].z - CS_.z) < Math.hypot(ST[bs].x - CS_.x, ST[bs].z - CS_.z)) bs = i; }); teleport(ST[bs].x + .65, ST[bs].z + .9); CS_.bat = 75; toast('Заряд таусылды. Көлік ' + NODES[bs].n + ' станциясына жеткізіліп, қуатталды.'); }];
  b.hidden = !act; if (act) { b.textContent = act[0]; hudAct = act[1]; }
}
function updTour(dt) {
  const t = tour; if (!t.pause) {
    const step = 3.2 * dt; t.d += step; useEnergy(step);
    const s = t.stops[t.i]; if (s && t.d >= s.dist) { t.d = s.dist; t.i++; tourStop(s); }
    else if (t.d >= t.pl.total && !s) { const k = selRoute; setMode('routes'); toast('Экскурсия аяқталды: ' + ROUTES[k].n); return; }
  }
  const p = sample(t.pl, t.d), o = ROUTES[selRoute].off; CS_.x = p.x - Math.cos(p.ang) * o; CS_.z = p.z + Math.sin(p.ang) * o; CS_.ang = p.ang; CS_.speed = t.pause ? 0 : 3.2; placeCar(); chase(dt, 5.5, 3.6);
  $('#hAct').hidden = true;
}
function updHud() { $('#hSpeed').textContent = fmt(Math.abs(CS_.speed) * 20) + ' км/сағ'; $('#hKm').textContent = fmt(CS_.km) + ' км'; $('#hBat').textContent = fmt(CS_.bat / 75 * 100) + '%'; $('#hE').textContent = fmt(CS_.e, 1) + ' кВт·сағ'; $('#hCo').textContent = fmt(CS_.km * .17, 1) + ' кг'; }

/* ───────────── 11. Режимдер, белгілер, басу ───────────── */
function setMode(m) {
  if (!started) return; if (view === 'int') { view = 'main'; iCtl.enabled = false; }
  if (m !== 'drive') stopDrive(); if (m !== 'tour') stopTour(); if (m !== 'lab') { labTimers.forEach(clearTimeout); kill(labMesh); labMesh = null; for (const id in nodeDots) { nodeDots[id].material.color.setHex(0xffffff); nodeDots[id].scale.setScalar(1); } }
  mode = m; openSt = null; controls.enabled = !(m === 'drive' || m === 'tour'); document.querySelectorAll('#dock button').forEach(b => b.setAttribute('aria-current', b.dataset.m === m));
  if (m === 'map') { closePanel(); hush(); overview(); } else if (m === 'slides') showSlide(slide); else if (m === 'routes') { showRoutes(); overview(); }
  else if (m === 'tour') startTour(); else if (m === 'drive') startDrive(); else if (m === 'lab') { showLab(); say('lab'); } else if (m === 'sim') showSim(); else if (m === 'authors') { showAuthors(); say('authors'); }
}
document.querySelectorAll('#dock button').forEach(b => b.onclick = () => setMode(b.dataset.m));

const labels = [], lbRoot = $('#labels');
function addLabel(text, cls, pos, v, fn) { const el = document.createElement(fn ? 'button' : 'div'); el.className = 'lb ' + cls; el.innerHTML = '<i></i>' + text; if (fn) el.onclick = fn; lbRoot.appendChild(el); labels.push({ el, pos, v, far: cls === 'town' }); }
SITE_IDS.forEach(id => { const n = NODES[id]; addLabel(n.n, 'site', new THREE.Vector3(n.x, H(n.x, n.z) + (id === 'aqtobe' ? 2 : 1.5), n.z), 'main', () => { if (mode === 'drive' || mode === 'tour') { showSite(id); } else { mode = 'map'; showSite(id); say(id); } }); });
ST_IDS.forEach(id => { const s = ST[id]; addLabel('Smart Station', 'st', new THREE.Vector3(s.x, H(s.x, s.z) + 2.6, s.z), 'main', () => showStation(id)); });
Object.values(NODES).filter(n => n.t !== 'site' && n.id !== 'aqtobe').forEach(n => addLabel(n.n, 'town', new THREE.Vector3(n.x - .5, H(n.x, n.z) + .75, n.z - .35), 'main'));
HOT.forEach(h => addLabel(h.n, 'hot', new THREE.Vector3(h.p[0], h.p[1], h.p[2]), 'int', () => { const el = $('#hotText'); if (el) el.innerHTML = '<b>' + h.n + '.</b> ' + h.t; panel.classList.remove('fold'); }));
const pv = new THREE.Vector3();
function updLabels(cam, W, Hh) { for (const l of labels) { if (l.v !== view || !started) { l.el.style.display = 'none'; continue; } pv.copy(l.pos).project(cam); if (pv.z > 1 || pv.x < -1.1 || pv.x > 1.1 || pv.y < -1.1 || pv.y > 1.1) { l.el.style.display = 'none'; continue; } if (l.far && cam.position.distanceTo(l.pos) > 55) { l.el.style.display = 'none'; continue; } l.el.style.display = ''; l.el.style.transform = `translate(-50%,-100%) translate(${((pv.x + 1) / 2 * W).toFixed(1)}px,${((1 - pv.y) / 2 * Hh).toFixed(1)}px)`; } }

const ray = new THREE.Raycaster(), ptr = new THREE.Vector2(); let downAt = null;
canvas.addEventListener('pointerdown', e => { downAt = [e.clientX, e.clientY]; controls.autoRotate = false; $('#hint').hidden = true; });
canvas.addEventListener('pointerup', e => {
  if (!downAt || !started || view !== 'main' || driving || touring || Math.hypot(e.clientX - downAt[0], e.clientY - downAt[1]) > 6) return;
  const r = canvas.getBoundingClientRect(); ptr.set((e.clientX - r.left) / r.width * 2 - 1, -(e.clientY - r.top) / r.height * 2 + 1); ray.setFromCamera(ptr, camera);
  const hit = ray.intersectObjects(pickables, true)[0]; if (!hit) return; let o = hit.object; while (o && !o.userData.pick) o = o.parent; if (!o) return;
  if (o.userData.pick.type === 'st') showStation(o.userData.pick.id); else { showSite(o.userData.pick.id); say(o.userData.pick.id); }
});

$('#tVoice').onclick = e => { voiceOn = !voiceOn; e.currentTarget.setAttribute('aria-pressed', voiceOn); if (!voiceOn) hush(); };
$('#tMusic').onclick = e => { musicOn = !musicOn; e.currentTarget.setAttribute('aria-pressed', musicOn); duck(!voice.paused); };
$('#tFull').onclick = () => { try { if (document.fullscreenElement) document.exitFullscreen(); else { const p = app.requestFullscreen && app.requestFullscreen(); if (p && p.catch) p.catch(() => {}); } } catch (err) {} };

/* ───────────── 12. Іске қосу және анимация циклі ───────────── */
function resize() { const w = app.clientWidth || 800, h = app.clientHeight || 600; renderer.setSize(w, h, false); camera.aspect = iCam.aspect = w / h; camera.updateProjectionMatrix(); iCam.updateProjectionMatrix(); }
addEventListener('resize', resize); resize(); applyEnv();
const startBtn = $('#start'); startBtn.disabled = false; startBtn.textContent = 'Бастау';
startBtn.onclick = () => {
  started = true; $('#intro').hidden = true; $('#top').hidden = false; $('#dock').hidden = false; $('#hint').hidden = false;
  document.querySelector('#dock [data-m="map"]').setAttribute('aria-current', 'true'); startMusic(); say('intro'); overview(3.2); setTimeout(() => { if (mode === 'map' && panel.hidden) controls.autoRotate = true; }, 3400);
};
const clock = new THREE.Clock(); let acc = 0, time = 0, flashT = 3;
function frame() {
  requestAnimationFrame(frame); const dt = Math.min(window.__DT_MAX || .05, clock.getDelta()); time += dt;
  for (let i = tweens.length - 1; i >= 0; i--) { const t = tweens[i]; t.t = Math.min(1, t.t + dt / t.dur); const k = t.t * t.t * (3 - 2 * t.t); camera.position.lerpVectors(t.p0, t.p1, k); controls.target.lerpVectors(t.t0, t.t1, k); if (t.t >= 1) tweens.splice(i, 1); }
  const wf = windF(); rotors.forEach((r, i) => r.rotation.z -= dt * (.4 + wf * 5) * (1 + (i % 3) * .1));
  clouds.forEach(c => { c.position.x += dt * (.25 + wf * .6); if (c.position.x > 52) c.position.x = -52; });
  birds.forEach(b => { b.a += dt * b.s; b.b.position.set(LAKE.x + Math.cos(b.a) * b.r, b.y, LAKE.z + Math.sin(b.a) * b.r); b.b.rotation.y = -b.a - Math.PI / 2; const f = Math.sin(time * 9 + b.r * 5) * .6; b.lw.rotation.z = f; b.rw.rotation.z = -f; });
  flowTex.offset.x -= dt * 1.4;
  if (env.storm) { for (let i = 0; i < rainN; i++) { let y = rainPos[i * 3 + 1] - dt * 9; if (y < 0) y = 6; rainPos[i * 3 + 1] = y; } rainG.attributes.position.needsUpdate = true; flashT -= dt; if (flashT < 0) { flash.intensity = 3; flashT = 1.5 + Math.random() * 3; } }
  flash.intensity *= .82;
  acc += dt; if (acc > .5) { const sf = sunF(); ST_IDS.forEach(id => { const l = live[id]; l.sun = ST[id].sun * sf; l.wind = ST[id].wind * wf; l.bat = clamp(l.bat + (l.sun + l.wind - 22) * acc * .01, 5, 100); }); refreshLive(); if (driving || touring) updHud(); acc = 0; }
  const W = app.clientWidth, Hh = app.clientHeight;
  if (view === 'int') {
    const L = FLOWL[FLOWL.length - 1]; flowDots.forEach((d, i) => { let s = (time * (.6 + sunF() + wf * .4) + i * L / flowDots.length) % L, k = 1; while (FLOWL[k] < s) k++; d.position.lerpVectors(FLOWP[k - 1], FLOWP[k], (s - FLOWL[k - 1]) / (FLOWL[k] - FLOWL[k - 1])); });
    iCtl.update(); renderer.render(iScene, iCam); updLabels(iCam, W, Hh);
  } else {
    if (driving) updDrive(dt); else if (touring && tour) updTour(dt); else controls.update();
    sun.target.position.set(0, 0, 0); renderer.render(scene, camera); updLabels(camera, W, Hh);
  }
}
frame();
})();
