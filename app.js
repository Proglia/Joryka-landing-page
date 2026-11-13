/* Joryka landing page behaviour. No dependencies. */

// Launch blockers (PRD §30): fill these before the page goes public.
const CONFIG = {
  // Login: your local Joryka app when the page runs on localhost, otherwise the dev app.
  // For launch, replace the dev URL with the production app URL.
  loginUrl: ['localhost', '127.0.0.1'].includes(location.hostname)
    ? 'http://localhost:5173/login'
    : 'https://dev.joryka.com/login',
  whatsappNumber: '2349022310523',  // Client's official Nigerian WhatsApp number.
  whatsappText: 'Hello Joryka, I would like to know more about the POS for my business.',
  // Demo form: your local Joryka backend when the page runs on localhost, otherwise the dev API.
  // For launch, replace the dev API URL with the production API URL.
  demoEndpoint: ['localhost', '127.0.0.1'].includes(location.hostname)
    ? 'http://localhost:3001/api/demo-requests'
    : 'https://dev-api.joryka.com/api/demo-requests',
};

document.documentElement.classList.add('js');
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];
const fmt = (n, d = 2) => Number(n).toLocaleString('en-NG', { minimumFractionDigits: d, maximumFractionDigits: d });
const naira = (n) => '₦' + fmt(Math.round(n), 0);
const money = (n) => '₦ ' + fmt(n);
const ngn = (n) => 'NGN ' + fmt(n);
const sum = (list, f) => list.reduce((s, x) => s + f(x), 0);
const pct = (part, whole) => (whole ? (part / whole) * 100 : 0);
const clock = () => new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const ico = (id, cls = '') => `<svg${cls ? ` class="${cls}"` : ''} aria-hidden="true"><use href="#${id}"/></svg>`;

/* ---------------------------------------------------------------- links */
$$('.js-login').forEach((a) => { if (CONFIG.loginUrl) a.href = CONFIG.loginUrl; });
$$('.js-whatsapp').forEach((a) => {
  if (!CONFIG.whatsappNumber) return;
  a.href = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(CONFIG.whatsappText)}`;
  a.target = '_blank';
  a.rel = 'noopener';
});

/* ---------------------------------------------------------------- small-screen menu */
{
  const btn = $(".nav-toggle"), menu = $("#site-menu");
  const set = (open) => {
    menu.hidden = !open;
    btn.setAttribute("aria-expanded", String(open));
    btn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  };
  btn.addEventListener("click", () => set(menu.hidden));
  menu.addEventListener("click", (e) => { if (e.target.closest("a")) set(false); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !menu.hidden) { set(false); btn.focus(); } });
  document.addEventListener("click", (e) => { if (!menu.hidden && !e.target.closest(".site-header")) set(false); });
  matchMedia("(min-width: 1101px)").addEventListener("change", (m) => { if (m.matches) set(false); });
}

/* ---------------------------------------------------------------- analytics hook (no personal data) */
document.addEventListener('click', (e) => {
  const t = e.target.closest('[data-track]');
  if (t && window.dataLayer) window.dataLayer.push({ event: t.dataset.track, placement: t.closest('section, header, footer')?.id || 'page' });
});

/* ---------------------------------------------------------------- entrances */
const revealables = $$('[data-reveal]');
if ('IntersectionObserver' in window && !reduced) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
  }, { threshold: 0.08, rootMargin: '0px 0px -6% 0px' });
  revealables.forEach((el) => io.observe(el));
} else {
  revealables.forEach((el) => el.classList.add('in'));
}

/* ---------------------------------------------------------------- strip: every module, on a loop */
const track = $('.marquee .track');
if (track) {
  const copy = track.cloneNode(true);
  copy.setAttribute('aria-hidden', 'true');
  track.after(copy);
}

/* ================================================================ playground
   A copy of the Joryka app, run on one sample shop. Every page reads the same state,
   so a sale in Point of Sale shows up in Inventory, Money Record, Reports and Joryka AI. */

const PER = 12; // units in a carton
const TODAY_LABEL = { long: 'Tuesday, 27 October 2026', short: 'Tue 27 Oct', date: '27/10/2026', iso: '2026-10-27' };
const TODAY = new Date(2026, 9, 27);
const RATES = { NGN: 1, USD: 1500, EUR: 1620 }; // sample parallel-market rates
const WAREHOUSES = [
  { id: 'primary', name: 'Primary Warehouse', place: 'Shop and store room, Idumota', added: '21/05/2026' },
  { id: 'secondary', name: 'Secondary Warehouse', place: 'Depot, Ojota', added: '21/05/2026' },
];
const WH_NAME = Object.fromEntries(WAREHOUSES.map((w) => [w.id, w.name]));
// stock in units per warehouse; cost = average cost per unit; rate = usual units sold a day; week = units sold Wed–today before the playground opened.
const PRODUCTS = [
  { id: 'noodles', name: 'Instant Noodles 70g', sku: 'NDL-070', cat: 'Food', unit: 650, ctn: 7800, cost: 540, stock: { primary: 47, secondary: 150 }, reorder: 24, rate: { primary: 16, secondary: 8 }, week: 168 },
  { id: 'sugar', name: 'Sugar 500g', sku: 'SGR-500', cat: 'Food', unit: 900, ctn: 10800, cost: 780, stock: { primary: 14, secondary: 8 }, reorder: 24, rate: { primary: 6, secondary: 3 }, week: 58 },
  { id: 'oil', name: 'Vegetable Oil 1L', sku: 'OIL-001', cat: 'Food', unit: 2800, ctn: 33600, cost: 2450, stock: { primary: 95, secondary: 0 }, reorder: 18, rate: { primary: 6, secondary: 0.7 }, week: 42 },
  { id: 'milk', name: 'Evaporated Milk 160g', sku: 'EVM-160', cat: 'Food', unit: 450, ctn: 5400, cost: 380, stock: { primary: 60, secondary: 36 }, reorder: 24, rate: { primary: 12, secondary: 6 }, week: 124 },
  { id: 'tomato', name: 'Tin Tomato 400g', sku: 'TMT-400', cat: 'Food', unit: 1150, ctn: 13800, cost: 980, stock: { primary: 0, secondary: 0 }, reorder: 24, rate: { primary: 2, secondary: 1 }, week: 9 },
  { id: 'cola', name: 'Cola Drink 35cl', sku: 'CLD-035', cat: 'Beverages', unit: 300, ctn: 3600, cost: 240, stock: { primary: 120, secondary: 48 }, reorder: 24, rate: { primary: 10, secondary: 4 }, week: 96 },
  { id: 'detergent', name: 'Laundry Detergent 1kg', sku: 'LDT-001', cat: 'Household', unit: 1900, ctn: 22800, cost: 1600, stock: { primary: 30, secondary: 12 }, reorder: 12, rate: { primary: 2, secondary: 1 }, week: 18 },
  { id: 'cereal', name: 'Breakfast Cereal 500g', sku: 'CRL-500', cat: 'Food', unit: 2400, ctn: 28800, cost: 2050, stock: { primary: 22, secondary: 0 }, reorder: 12, rate: { primary: 0, secondary: 0 }, week: 0, lastSale: '4 Sep' },
  { id: 'paste', name: 'Tomato Paste 70g', sku: 'TMP-070', cat: 'Food', unit: 250, ctn: 3000, cost: 200, stock: { primary: 80, secondary: 40 }, reorder: 24, rate: { primary: 8, secondary: 3 }, week: 74, exp: 3 },
  { id: 'sardines', name: 'Sardines 125g', sku: 'SRD-125', cat: 'Food', unit: 850, ctn: 10200, cost: 720, stock: { primary: 36, secondary: 0 }, reorder: 12, rate: { primary: 3, secondary: 1 }, week: 31 },
];
const CATS = ['All', 'Food', 'Beverages', 'Household'];
const CUSTOMERS = [
  { id: 'aisha', name: 'Aisha Bello', phone: '0803 555 0142', place: 'Lagos Island', ledger: [
    { d: '14/10/2026', time: '10:42', type: 'Sale', desc: 'Sales Invoice #TXN-0231', a: 20000, staff: 'Bisi Okoro' },
    { d: '21/10/2026', time: '16:05', type: 'Payment', desc: 'Bank transfer', a: -5000, staff: 'Admin User' },
  ] },
  { id: 'tunde', name: 'Tunde Adeyemi', phone: '0705 555 0123', place: 'Ikeja', ledger: [
    { d: '02/10/2026', time: '12:18', type: 'Sale', desc: 'Sales Invoice #TXN-0226', a: 7500, staff: 'Bisi Okoro' },
  ] },
  { id: 'chinedu', name: 'Chinedu Okafor', phone: '0812 555 0198', place: 'Surulere', ledger: [
    { d: '30/09/2026', time: '11:20', type: 'Sale', desc: 'Sales Invoice #TXN-0219', a: 12000, staff: 'Admin User' },
    { d: '10/10/2026', time: '09:48', type: 'Payment', desc: 'Cash payment', a: -12000, staff: 'Bisi Okoro' },
  ] },
  { id: 'ngozi', name: 'Ngozi Eze', phone: '0903 555 0176', place: 'Yaba', ledger: [
    { d: '24/09/2026', time: '15:31', type: 'Sale', desc: 'Sales Invoice #TXN-0214', a: 9300, staff: 'Bisi Okoro' },
    { d: '08/10/2026', time: '13:02', type: 'Payment', desc: 'Mobile money payment', a: -9300, staff: 'Admin User' },
  ] },
];
const QUOTES = [
  { n: 11, cust: 'tunde', status: 'Sent', issued: '2026-10-24', expires: '2026-10-31', lines: [{ id: 'oil', kind: 'ctn', qty: 2 }] },
  { n: 10, cust: 'ngozi', status: 'Converted', issued: '2026-10-15', expires: '2026-10-22', lines: [{ id: 'milk', kind: 'ctn', qty: 10 }], inv: 240 },
  { n: 9, cust: 'chinedu', status: 'Converted', issued: '2026-10-09', expires: '2026-10-16', lines: [{ id: 'cola', kind: 'ctn', qty: 5 }, { id: 'noodles', kind: 'ctn', qty: 3 }], inv: 238 },
];
const INVOICES = [
  { n: 240, cust: 'ngozi', quote: 10, fulfil: 'Fulfilled', lines: QUOTES[1].lines, payments: [{ d: '17/10/2026', m: 'digital', a: 54000 }] },
  { n: 238, cust: 'chinedu', quote: 9, fulfil: 'Fulfilled', lines: QUOTES[2].lines, payments: [{ d: '10/10/2026', m: 'cash', a: 24000 }, { d: '12/10/2026', m: 'cash', a: 17400 }] },
];
// Wed 21 Oct to Mon 26 Oct, then this morning before the playground opened. p / s = Primary / Secondary Warehouse.
const PAST_DAYS = [
  { day: 'Wed', date: '21 Oct', total: 58400, cash: 39100, digital: 19300, count: 21, units: 80, ctns: 2, p: 41000, s: 17400 },
  { day: 'Thu', date: '22 Oct', total: 64900, cash: 43500, digital: 21400, count: 24, units: 90, ctns: 3, p: 45500, s: 19400 },
  { day: 'Fri', date: '23 Oct', total: 81300, cash: 54500, digital: 26800, count: 29, units: 110, ctns: 4, p: 56900, s: 24400 },
  { day: 'Sat', date: '24 Oct', total: 96700, cash: 64800, digital: 31900, count: 35, units: 132, ctns: 5, p: 67700, s: 29000 },
  { day: 'Sun', date: '25 Oct', total: 22500, cash: 15100, digital: 7400, count: 9, units: 32, ctns: 0, p: 15700, s: 6800 },
  { day: 'Mon', date: '26 Oct', total: 61200, cash: 41000, digital: 20200, count: 23, units: 85, ctns: 2, p: 42800, s: 18400 },
];
const EARLIER_TODAY = { total: 68000, cash: 46200, digital: 21800, count: 18, units: 91, ctns: 1, p: 47600, s: 20400 };
const EARLIER_TX = [
  { time: '10:05', cust: 'Walk-in Customer', method: 'cash', total: 6900, staff: 'Bisi Okoro' },
  { time: '09:20', cust: 'Walk-in Customer', method: 'digital', total: 1450, staff: 'Bisi Okoro' },
  { time: '09:12', cust: 'Walk-in Customer', method: 'cash', total: 3200, staff: 'Admin User' },
];
const MARGIN = 69240 / 453000; // this week's gross margin on the sample sales above
const LAST_WEEK = { total: 480000, p: 330000, s: 150000, margin: 0.159, from: '14 Oct', to: '20 Oct' };

const PAGES = {
  dashboard: { label: 'Dashboard', icon: 'i-grid', f: 'reports' },
  pos: { label: 'Point of Sale', icon: 'i-cart', f: 'pos' },
  inventory: { label: 'Inventory', icon: 'i-package', f: 'stock' },
  customers: { label: 'Customers', icon: 'i-users', f: 'credit' },
  quotations: { label: 'Quotations', icon: 'i-file', f: 'docs' },
  invoices: { label: 'Invoices', icon: 'i-invoice', f: 'docs' },
  money: { label: 'Money Record', icon: 'i-book', f: 'credit' },
  reports: { label: 'Reports', icon: 'i-bars', f: 'reports' },
  ai: { label: 'AI Insights', icon: 'i-spark', f: 'ai' },
  activity: { label: 'Activity History', icon: 'i-shield' },
  warehouses: { label: 'Warehouses', icon: 'i-warehouse', f: 'stock' },
  users: { label: 'User Management', icon: 'i-user' },
  settings: { label: 'Settings', icon: 'i-cog' },
  search: { label: 'Search', icon: 'i-search' },
};
const FEATURES = {
  pos: { pages: ['pos'], c: '#2E4AFF' },
  stock: { pages: ['inventory', 'warehouses'], c: '#AD46FF' },
  credit: { pages: ['customers', 'money'], c: '#FE9A00' },
  docs: { pages: ['quotations', 'invoices'], c: '#00B8DB' },
  reports: { pages: ['reports', 'dashboard'], c: '#FF6900' },
  ai: { pages: ['ai'], c: '#11102D' },
};

const S = {
  feature: 'pos', page: 'pos', online: true, pending: 0, syncing: 0,
  wh: 'primary', cat: 'All', q: '',
  cart: [{ id: 'noodles', kind: 'unit', qty: 4 }, { id: 'sugar', kind: 'unit', qty: 2 }],
  customer: 'walkin', disc: { mode: '%', v: '' }, cartOpen: false,
  receipt: 1042, sales: [], repaymentsToday: 0, invoicePaymentsToday: 0,
  invQ: '', invCat: 'All', currency: 'NGN', dashCur: 'NGN',
  custFilter: 'All', custQ: '', moneyCust: 'all',
  quoFilter: 'All', quoOpen: null, invFulfil: 'All', invPay: 'All', invOpen: null, flash: null,
  range: 'week', attnAll: false, chat: [], left: 50, busy: false,
  modal: null, ret: null,
};

const P = (id) => PRODUCTS.find((p) => p.id === id);
const C = (id) => CUSTOMERS.find((c) => c.id === id);
const custName = (id) => (id === 'walkin' ? 'Walk-in Customer' : C(id).name);
const units = (l) => (l.kind === 'ctn' ? PER * l.qty : l.qty);
const price = (l) => (l.kind === 'ctn' ? P(l.id).ctn : P(l.id).unit);
const linesTotal = (lines) => sum(lines, (l) => price(l) * l.qty);
const totalStock = (p) => p.stock.primary + p.stock.secondary;
const level = (n, p) => (n === 0 ? 'out' : n < p.reorder ? 'low' : 'ok');
const ctnSplit = (n) => `${Math.floor(n / PER)} ctn · ${n % PER} units`;
const ctnShort = (n) => `${Math.floor(n / PER)} ctn + ${n % PER} u`;
const balance = (c) => sum(c.ledger, (e) => e.a);
const owing = () => CUSTOMERS.filter((c) => balance(c) > 0);
const quoteTotal = (q) => linesTotal(q.lines);
const invTotal = (i) => linesTotal(i.lines);
const invPaid = (i) => sum(i.payments, (p) => p.a);
const invOut = (i) => Math.max(0, invTotal(i) - invPaid(i));
const invPayState = (i) => (invOut(i) === 0 ? 'Paid' : invPaid(i) > 0 ? 'Partially Paid' : 'Unpaid');
const parseD = (d) => { const [dd, mm, yy] = d.split('/').map(Number); return new Date(yy, mm - 1, dd); };
const daysAgo = (d) => Math.round((TODAY - parseD(d)) / 864e5);
const qtyLabel = (l) => (l.kind === 'ctn' ? `${l.qty} ctn` : `${l.qty} ${l.qty === 1 ? 'unit' : 'units'}`);
const conv = (n, cur) => (cur === 'NGN' ? '₦ ' + fmt(n) : (cur === 'USD' ? '$ ' : '€ ') + fmt(n / RATES[cur]));

/* ---------------------------------------------------------------- figures every page shares */
function today() {
  const t = { ...EARLIER_TODAY, partial: 0, credit: 0, profit: Math.round(EARLIER_TODAY.total * MARGIN), byUnits: {} };
  S.sales.forEach((s) => {
    t.total += s.total;
    t.count += 1;
    t[s.wh === 'primary' ? 'p' : 's'] += s.total;
    if (s.method === 'cash') t.cash += s.total;
    if (s.method === 'digital') t.digital += s.total;
    if (s.method === 'partial') t.partial += s.paid;
    t.credit += s.total - s.paid;
    s.lines.forEach((l) => {
      t.units += units(l);
      if (l.kind === 'ctn') t.ctns += l.qty;
      t.byUnits[l.id] = (t.byUnits[l.id] || 0) + units(l);
    });
    t.profit += s.total - sum(s.lines, (l) => units(l) * P(l.id).cost);
  });
  t.collected = t.cash + t.digital + t.partial + S.repaymentsToday + S.invoicePaymentsToday;
  return t;
}
function week() {
  const t = today();
  const w = { total: t.total, p: t.p, s: t.s, cash: t.cash, digital: t.digital, partial: t.partial, credit: t.credit, count: t.count, units: t.units, ctns: t.ctns, profit: t.profit };
  PAST_DAYS.forEach((d) => {
    ['total', 'p', 's', 'cash', 'digital', 'count', 'units', 'ctns'].forEach((k) => { w[k] += d[k]; });
    w.profit += Math.round(d.total * MARGIN);
  });
  w.days = [...PAST_DAYS.map((d) => ({ label: d.day, date: d.date, total: d.total })), { label: 'Tue', date: '27 Oct', total: t.total }];
  w.today = t;
  return w;
}
const weekUnits = (p) => p.week + (today().byUnits[p.id] || 0);
const restockList = () => PRODUCTS.filter((p) => totalStock(p) < p.reorder).sort((a, b) => totalStock(a) - totalStock(b));
const usualRate = (p) => p.rate.primary + p.rate.secondary;
function overdueList() {
  // payments settle the oldest sales first; whatever is left of a sale older than 14 days is overdue
  return CUSTOMERS.map((c) => {
    let paid = -sum(c.ledger.filter((e) => e.a < 0), (e) => e.a);
    const open = [];
    c.ledger.filter((e) => e.a > 0).forEach((e) => {
      const used = Math.min(paid, e.a);
      paid -= used;
      if (e.a - used > 0) open.push({ ...e, left: e.a - used });
    });
    const old = open.filter((e) => daysAgo(e.d) > 14);
    return { c, amount: sum(old, (e) => e.left), oldest: open[0], days: open[0] ? daysAgo(open[0].d) : 0 };
  }).filter((x) => x.amount > 0);
}
const slowList = () => PRODUCTS.filter((p) => p.week === 0 && !today().byUnits[p.id] && totalStock(p) > 0);

/* ---------------------------------------------------------------- dom */
const play = $('#play');
const tiles = $$('.tile', play);
const stage = $('#stage');
const rail = $('.rail-list', stage);
const body = $('.app-body', stage);
const banner = $('.banner', stage);
const layer = $('.layer', stage);
const netBtn = $('#net');
const toastEl = $('.toast');
let toastTimer = 0;
let syncTimer = 0;
let busyTimer = 0;

function toast(msg) {
  toastEl.textContent = msg;
  toastEl.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('show'), 3400);
}
const later = (label) => toast(`${label} is part of the full app. Request a demo to see it.`);
const sampleOnly = () => toast('This is sample data, so editing is switched off here.');

rail.innerHTML = Object.entries(PAGES).map(([id, p]) => `<li><button type="button" data-act="nav" data-pg="${id}" aria-label="${p.label}" data-tip="${p.label}">${ico(p.icon)}<span class="rl" aria-hidden="true">${p.label}</span></button></li>`).join('');
const subnav = document.createElement('div');
subnav.className = 'subnav';
body.before(subnav);

/* phones: the window is a preview that opens the app full screen, like the mobile app */
const phone = matchMedia('(max-width: 720px)');
const menuBtn = $('.menu-btn', stage);
let full = false;
let lastFocus = null;
let savedY = 0;
const outside = () => [$('.site-header'), $('.hero-copy'), $('.tiles'), $('.callout'), ...$$('main > section:not(.hero)'), $('.footer')];
function syncPreview() {
  const preview = phone.matches && !full;
  $('.rail', stage).inert = preview;
  $('.app', stage).inert = preview;
}
function setMenu(open) {
  stage.classList.toggle('menu-open', open);
  menuBtn.setAttribute('aria-expanded', String(open));
  if (open) $('[aria-current="page"]', rail)?.focus();
}
function openApp(from) {
  if (!phone.matches || full) return;
  full = true;
  lastFocus = from || document.activeElement;
  savedY = scrollY;
  play.classList.add('full');
  document.documentElement.classList.add('app-open');
  stage.setAttribute('role', 'dialog');
  stage.setAttribute('aria-modal', 'true');
  stage.setAttribute('aria-label', 'Joryka app, sample shop');
  stage.removeAttribute('aria-labelledby');
  outside().forEach((el) => { if (el) el.inert = true; });
  syncPreview();
  history.pushState({ jorykaApp: true }, '');
  body.focus({ preventScroll: true });
}
function closeApp() {
  if (!full) return;
  full = false;
  setMenu(false);
  closeLayer(false);
  play.classList.remove('full');
  document.documentElement.classList.remove('app-open');
  stage.setAttribute('role', 'tabpanel');
  stage.removeAttribute('aria-modal');
  stage.removeAttribute('aria-label');
  stage.setAttribute('aria-labelledby', `t-${S.feature}`);
  outside().forEach((el) => { if (el) el.inert = false; });
  syncPreview();
  scrollTo(0, savedY);
  lastFocus?.focus({ preventScroll: true });
}
const leaveApp = () => { if (history.state?.jorykaApp) history.back(); else closeApp(); };
addEventListener('popstate', () => { if (full) closeApp(); });
phone.addEventListener('change', () => { if (!phone.matches) closeApp(); syncPreview(); });
$('.try-app', stage).addEventListener('click', (e) => openApp(e.currentTarget));
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape' || e.defaultPrevented || !full) return;
  if (stage.classList.contains('menu-open')) { setMenu(false); menuBtn.focus(); } else leaveApp();
});
stage.addEventListener('click', (e) => { if (e.target === stage && stage.classList.contains('menu-open')) setMenu(false); });
syncPreview();

/* the dashed wire from the active tile to the window */
function drawWire() {
  const path = $('.wire path');
  if (getComputedStyle($('.wire')).display === 'none') return;
  const box = play.getBoundingClientRect();
  const icoBox = $(`.tile[data-f="${S.feature}"] .tile-ico`).getBoundingClientRect();
  const st = stage.getBoundingClientRect();
  const cx = icoBox.left + icoBox.width / 2, cy = icoBox.top + icoBox.height / 2;
  let d;
  if (cx < st.left || cx > st.right) {
    const left = cx < st.left;
    const x1 = (left ? icoBox.right + 6 : icoBox.left - 6) - box.left;
    const y1 = cy - box.top;
    const x2 = (left ? st.left : st.right) - box.left;
    const y2 = Math.min(Math.max(y1, 80), st.height - 60);
    const mid = (x1 + x2) / 2;
    d = `M${x1},${y1} C${mid},${y1} ${mid},${y2} ${x2},${y2}`;
  } else {
    const above = cy < st.top;
    const x1 = cx - box.left;
    const y1 = (above ? icoBox.bottom + 6 : icoBox.top - 6) - box.top;
    const x2 = Math.min(Math.max(x1, st.left + 80), st.right - 80) - box.left;
    const y2 = (above ? st.top : st.bottom) - box.top;
    const mid = (y1 + y2) / 2;
    d = `M${x1},${y1} C${x1},${mid} ${x2},${mid} ${x2},${y2}`;
  }
  path.setAttribute('d', d);
  play.style.setProperty('--wc', FEATURES[S.feature].c);
}
addEventListener('resize', drawWire);

function go(page, opts = {}) {
  const meta = PAGES[page];
  if (!meta.f) { later(meta.label); return; }
  S.page = page;
  if (meta.f !== S.feature) {
    S.feature = meta.f;
    tiles.forEach((t) => {
      const on = t.dataset.f === meta.f;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
    });
    if (!full) stage.setAttribute('aria-labelledby', `t-${meta.f}`);
    play.dataset.active = meta.f;
    requestAnimationFrame(drawWire);
  }
  closeLayer(false);
  render();
  body.scrollTop = 0;
  body.classList.remove('enter');
  void body.offsetWidth;
  body.classList.add('enter');
  if (opts.focus) body.focus({ preventScroll: true });
}
function showFeature(f, focusTile) {
  go(FEATURES[f].pages[0]);
  if (focusTile) $(`.tile[data-f="${f}"]`).focus({ preventScroll: true });
}
tiles.forEach((t) => t.addEventListener('click', () => { showFeature(t.dataset.f); openApp(t); }));
$('.tiles').addEventListener('keydown', (e) => {
  const i = tiles.indexOf(document.activeElement);
  const to = { ArrowRight: i + 1, ArrowDown: i + 1, ArrowLeft: i - 1, ArrowUp: i - 1, Home: 0, End: tiles.length - 1 }[e.key];
  if (i < 0 || to === undefined) return;
  e.preventDefault();
  showFeature(tiles[(to + tiles.length) % tiles.length].dataset.f, true);
});
$$('[data-try]').forEach((b) => b.addEventListener('click', () => {
  const f = b.dataset.try;
  if (f === 'offline') {
    showFeature('pos', true);
    if (S.online) setOnline(false);
  } else showFeature(f, true);
  if (phone.matches) openApp(b);
  else play.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' });
}));

/* ---------------------------------------------------------------- shared pieces */
const head = (title, sub, actions = '') => `<div class="ph"><div><p class="ph-t" role="heading" aria-level="3">${title}</p>${sub ? `<p class="ph-s">${sub}</p>` : ''}</div>${actions ? `<div class="ph-a">${actions}</div>` : ''}</div>`;
const abtn = (label, icon, cls, act, attrs = '') => `<button type="button" class="ab ${cls}" data-act="${act}" ${attrs}>${icon ? ico(icon) : ''}${label}</button>`;
const kpi = (label, value, sub, tone, icon) => `<div class="kpi"><p class="kpi-l">${label}${icon ? `<span class="kpi-i t-${tone}">${ico(icon)}</span>` : ''}</p><p class="kpi-v c-${tone}">${value}</p>${sub ? `<p class="kpi-s">${sub}</p>` : ''}</div>`;
const badge = (text, tone) => `<em class="badge ${tone}">${text}</em>`;
const chips = (list, cur, act, label) => `<div class="chips" role="radiogroup" aria-label="${label}">${list.map((x) => `<button type="button" role="radio" aria-checked="${x === cur}" data-act="${act}" data-v="${x}">${x}</button>`).join('')}</div>`;
const search = (ph, act, val = '') => `<label class="search">${ico('i-search')}<span class="sr">${ph}</span><input type="search" placeholder="${ph}" data-in="${act}" value="${esc(val)}"></label>`;
const iconBtn = (icon, label, act, attrs = '', tone = '') => `<button type="button" class="ib ${tone}" data-act="${act}" aria-label="${label}" title="${label}" ${attrs}>${ico(icon)}</button>`;
const avatar = (name, tone = '') => `<span class="av ${tone}">${name[0]}</span>`;
const empty = (title, sub) => `<div class="empty">${ico('i-search')}<b>${title}</b><span>${sub}</span></div>`;
const methodTone = { cash: 'ok', digital: 'info', partial: 'low', credit: 'out' };
const methodName = { cash: 'Cash', digital: 'Digital', partial: 'Partial', credit: 'Credit' };

/* ---------------------------------------------------------------- pages */
const PAGE = {};

PAGE.dashboard = () => {
  const t = today();
  const low = PRODUCTS.filter((p) => level(totalStock(p), p) !== 'ok');
  const out = low.filter((p) => totalStock(p) === 0);
  const value = sum(PRODUCTS, (p) => totalStock(p) * p.cost);
  const unitsIn = sum(PRODUCTS, totalStock);
  const openQ = QUOTES.filter((q) => ['Sent', 'Accepted', 'Draft'].includes(q.status));
  const unpaid = INVOICES.filter((i) => invOut(i) > 0 && i.fulfil !== 'Cancelled');
  const w = week();
  const max = Math.max(...w.days.map((d) => d.total));
  const pts = w.days.map((d, i) => [20 + i * (560 / 6), 150 - (d.total / max) * 128]);
  const line = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
  const cats = ['Food', 'Beverages', 'Household'].map((c) => ({ c, v: sum(PRODUCTS.filter((p) => p.cat === c), (p) => weekUnits(p) * p.unit) }));
  const cmax = Math.max(...cats.map((x) => x.v));
  return head('Dashboard', TODAY_LABEL.long, abtn('Open Point of Sale', 'i-cart', 'primary', 'nav', 'data-pg="pos"'))
    + `<div class="kpis k3 dash">
      ${kpi('Today’s Revenue', money(t.total), `${t.count} transactions`, 'ink', 'i-dollar')}
      ${kpi('Cash Collected', money(t.collected), `${money(t.credit)} on credit`, 'green', 'i-check')}
      ${kpi('Still Owing', money(sum(owing(), balance)), `${owing().length} customers`, 'amber', 'i-clock')}
      ${kpi('Low Stock Alerts', String(low.length), `${out.length} out of stock`, 'red', 'i-alert')}
      <div class="kpi wide"><p class="kpi-l">Inventory Value<span class="kpi-i t-violet">${ico('i-package')}</span></p>${chips(['NGN', 'USD', 'EUR'], S.dashCur, 'dashcur', 'Currency')}<p class="kpi-v c-violet">${conv(value, S.dashCur)}</p><p class="kpi-s">${fmt(unitsIn, 0)} units in stock</p></div>
      ${kpi('Open Quotations', money(sum(openQ, quoteTotal)), `${QUOTES.filter((q) => q.status === 'Sent').length} awaiting response`, 'cyan', 'i-file')}
      ${kpi('Unpaid Invoices', money(sum(unpaid, invOut)), `${unpaid.length} invoices unpaid`, 'orange', 'i-wallet')}
    </div>
    <div class="dash-row">
      <div class="panel"><p class="panel-h">Weekly Sales<em class="tag">This Week</em></p>
        <svg class="area" viewBox="0 0 600 176" role="img" aria-label="Sales per day this week, highest on ${w.days.reduce((a, b) => (b.total > a.total ? b : a)).label}">
          <path class="area-fill" d="${line} L${pts[6][0]},150 L${pts[0][0]},150 Z"/><path class="area-line" d="${line}"/>
          ${pts.map((p, i) => `<circle cx="${p[0]}" cy="${p[1]}" r="3.5"/><text x="${p[0]}" y="172">${w.days[i].label}</text>`).join('')}
        </svg></div>
      <div class="panel"><p class="panel-h">Sales by Category</p><ul class="hbars">${cats.map((x) => `<li><span>${x.c}</span><i style="--w:${pct(x.v, cmax).toFixed(1)}%"></i><b>${naira(x.v)}</b></li>`).join('')}</ul></div>
    </div>`;
};

PAGE.pos = () => {
  const list = PRODUCTS.filter((p) => (S.cat === 'All' || p.cat === S.cat) && (!S.q || (p.name + p.sku).toLowerCase().includes(S.q.toLowerCase())));
  const inCart = (id) => sum(S.cart.filter((l) => l.id === id), units);
  const cards = list.map((p) => {
    const have = p.stock[S.wh];
    const left = have - inCart(p.id);
    const lv = level(have, p);
    return `<li class="pcard lv-${lv}${have === 0 ? ' dim' : ''}"><p class="pc-name">${p.name}</p><p class="pc-sku">${p.sku}</p>
      ${p.exp ? `<em class="exp">${ico('i-alert')}Exp ${p.exp}d</em>` : ''}
      <p class="pc-meta"><span>${ctnSplit(have)}</span><span class="pc-q">qty <b>${have}</b></span></p>
      <div class="pc-prices"><button type="button" data-act="add" data-id="${p.id}" data-k="unit" aria-label="Add one unit of ${p.name}, ${naira(p.unit)}"${left < 1 ? ' disabled' : ''}><b>${fmt(p.unit)}</b><span><i>₦</i><i>/ unit</i></span></button><button type="button" class="ctn" data-act="add" data-id="${p.id}" data-k="ctn" aria-label="Add one carton of ${p.name}, ${naira(p.ctn)}"${left < PER ? ' disabled' : ''}><b>${fmt(p.ctn)}</b><span><i>₦</i><i>/ ctn</i></span></button></div></li>`;
  }).join('');
  const sub = linesTotal(S.cart);
  const disc = discount(sub);
  const c = S.customer === 'walkin' ? null : C(S.customer);
  return `<div class="till">
    <div class="pos-main">
      <div class="pos-top"><div class="row">${search('Search by name, SKU, or barcode…', 'q', S.q)}<button type="button" class="ab primary" data-act="scan">${ico('i-scan')}Scan</button></div>
        <div class="whs" role="radiogroup" aria-label="Sell from warehouse">${WAREHOUSES.map((w) => `<button type="button" role="radio" aria-checked="${w.id === S.wh}" data-act="wh" data-v="${w.id}">${ico('i-warehouse')}${w.name}<span class="count">${fmt(sum(PRODUCTS, (p) => p.stock[w.id]), 0)}</span></button>`).join('')}</div>
        ${chips(CATS, S.cat, 'cat', 'Category')}</div>
      <ul class="catalog" aria-label="Products">${cards || `<li class="none">${empty('No products found', 'Try another name or category.')}</li>`}</ul>
    </div>
    <div class="cart${S.cartOpen ? ' open' : ''}">
      <p class="cart-h">${ico('i-cart')}Cart${S.cart.length ? `<span class="cnt">${S.cart.length}</span><button type="button" class="link-red" data-act="clear">Clear all</button>` : ''}<button type="button" class="cart-tog" data-act="carttog" aria-expanded="${S.cartOpen}">${S.cartOpen ? 'Hide' : 'Show'} items${ico('i-down')}</button></p>
      <div class="cart-cust"><label class="sel">${ico('i-user')}<span class="sr">Customer</span><select data-in="customer">${['walkin', ...CUSTOMERS.map((x) => x.id)].map((id) => `<option value="${id}"${id === S.customer ? ' selected' : ''}>${custName(id)}</option>`).join('')}</select>${ico('i-down', 'chev')}</label>
        ${c && balance(c) > 0 ? `<p class="outst">Outstanding: ${money(balance(c))}</p>` : ''}</div>
      <ul class="lines" aria-live="polite">${S.cart.length ? S.cart.map((l, i) => `<li><p class="ln-n">${P(l.id).name}<button type="button" class="ib" data-act="rm" data-i="${i}" aria-label="Remove ${P(l.id).name}">${ico('i-trash')}</button></p>
        <p class="ln-s"><em class="kind">${l.kind === 'ctn' ? 'Carton' : 'Unit'}</em>${naira(price(l))} each</p>
        <div class="ln-r"><span class="qty"><button type="button" data-act="dec" data-i="${i}" aria-label="One less">${ico('i-minus')}</button><b>${l.qty}</b><button type="button" data-act="inc" data-i="${i}" aria-label="One more"${P(l.id).stock[S.wh] - inCart(l.id) < (l.kind === 'ctn' ? PER : 1) ? ' disabled' : ''}>${ico('i-plus')}</button></span><b>${money(price(l) * l.qty)}</b></div></li>`).join('')
        : `<li class="cart-empty">${ico('i-cart')}<b>Cart is empty</b><span>Click products to add them</span></li>`}</ul>
      <div class="cart-f">
        <div class="disc"><span class="seg" role="radiogroup" aria-label="Discount type">${['%', '₦'].map((m) => `<button type="button" role="radio" aria-checked="${S.disc.mode === m}" data-act="dmode" data-v="${m}">${m}</button>`).join('')}</span><label class="sr" for="disc">Discount</label><input id="disc" inputmode="decimal" placeholder="Discount (optional)" data-in="disc" value="${esc(S.disc.v)}"></div>
        <p class="sum"><span>Subtotal</span><span>${money(sub)}</span></p>
        ${disc ? `<p class="sum"><span>Discount</span><span>− ${money(disc)}</span></p>` : ''}
        <p class="tot"><span>Total</span><b>${money(sub - disc)}</b></p>
        <button type="button" class="btn btn-block proceed" data-act="checkout"${S.cart.length ? '' : ' disabled'}>${ico('i-check')}Proceed to Payment</button>
      </div>
    </div>
  </div>`;
};
function discount(sub) {
  const v = parseFloat(String(S.disc.v).replace(/,/g, '')) || 0;
  if (v <= 0) return 0;
  return Math.min(sub, S.disc.mode === '%' ? Math.round(sub * Math.min(v, 100) / 100) : v);
}

PAGE.inventory = () => {
  const list = PRODUCTS.filter((p) => (S.invCat === 'All' || p.cat === S.invCat) && (!S.invQ || (p.name + p.sku).toLowerCase().includes(S.invQ.toLowerCase())));
  const low = PRODUCTS.filter((p) => level(totalStock(p), p) === 'low').length;
  const out = PRODUCTS.filter((p) => totalStock(p) === 0).length;
  const status = { ok: badge('In Stock', 'ok'), low: badge('Low Stock', 'low'), out: badge('Out of Stock', 'out') };
  const acts = [['i-truck', 'Stock in', 'ok'], ['i-clip', 'Stock count', 'info'], ['i-swap', 'Transfer between warehouses', 'info'], ['i-dollar', 'Change price', 'info'], ['i-archive', 'Archive', 'out'], ['i-pencil', 'Edit', 'info'], ['i-trash', 'Delete', 'out']];
  return head('Inventory', `${PRODUCTS.length} products · ${low} low stock · ${out} out of stock`,
    abtn(`Adjustments <span class="count">0</span>`, 'i-history', 'dark', 'later', 'data-v="Stock adjustments"') + abtn('Import CSV / Excel / PDF', 'i-upload', 'outline', 'sample') + abtn('Add Product', 'i-plus', 'primary', 'sample'))
    + (out ? `<p class="alert warn">${ico('i-alert')}${out} product${out > 1 ? 's' : ''} out of stock.</p>` : '')
    + `<div class="toolbar">${search('Search by name, SKU, barcode…', 'invq', S.invQ)}<span class="cur-l">${ico('i-refresh')}Currency</span>${chips(['NGN', 'USD', 'EUR'], S.currency, 'cur', 'Currency')}</div>
    ${chips([...CATS, 'Archived'], S.invCat, 'invcat', 'Category')}
    ${S.currency !== 'NGN' ? `<p class="note">${ico('i-info')}Sample rate: ₦${fmt(RATES[S.currency], 0)} to ${S.currency === 'USD' ? '$1' : '€1'}</p>` : ''}
    <div class="table"><table><thead><tr><th scope="col">Product</th><th scope="col" class="r hide-s">Price</th><th scope="col" class="r">Stock</th><th scope="col">Status</th><th scope="col" class="hide-s"><span class="sr">Actions</span></th></tr></thead>
    <tbody>${list.map((p) => {
      const n = totalStock(p);
      return `<tr><td><span class="prod">${'<span class="pbox">' + ico('i-package') + '</span>'}<span><b>${p.name}</b><small>${p.sku}</small>${p.exp ? `<em class="exp">Exp ${p.exp}d</em>` : ''}</span></span></td>
        <td class="r hide-s">${conv(p.unit, S.currency)}<small>${conv(p.ctn, S.currency)} / ctn</small></td>
        <td class="r"><b>${n} units</b><small>${ctnShort(n)}</small></td><td>${status[level(n, p)]}</td>
        <td class="hide-s"><span class="acts">${acts.map(([i, l, t]) => iconBtn(i, l, 'sample', '', t)).join('')}</span></td></tr>`;
    }).join('') || `<tr><td colspan="5">${empty(S.invCat === 'Archived' ? 'No archived products' : 'No products found', 'Try another search or category.')}</td></tr>`}</tbody></table></div>`;
};

PAGE.warehouses = () => head('Warehouse Management', `${WAREHOUSES.length} warehouses · ${WAREHOUSES.length} Active`, abtn('Add Warehouse', 'i-plus', 'primary', 'sample'))
  + `<div class="whcards">${WAREHOUSES.map((w) => `<div class="whcard"><div class="wh-top"><span class="wh-ico">${ico('i-warehouse')}</span><p><b>${w.name}</b><small>${ico('i-pin')}${w.place}</small></p>${iconBtn('i-pencil', `Edit ${w.name}`, 'sample', '', 'info')}</div>
    <p class="wh-foot">${badge('Active', 'ok')}<small>Added ${w.added}</small></p></div>`).join('')}</div>`;

PAGE.customers = () => {
  const owe = owing();
  const list = CUSTOMERS.filter((c) => {
    const b = balance(c);
    if (S.custFilter === 'Has Balance' && b <= 0) return false;
    if (S.custFilter === 'Cleared' && b > 0) return false;
    if (S.custFilter === 'Archived') return false;
    return !S.custQ || (c.name + c.phone).toLowerCase().includes(S.custQ.toLowerCase());
  });
  return head('Customers', `${CUSTOMERS.length} customers · ${owe.length} with outstanding balance`, abtn('Import CSV / Excel / PDF', 'i-upload', 'outline', 'sample') + abtn('Add Customer', 'i-plus', 'primary', 'sample'))
    + `<div class="kpis k3"><div class="kpi"><p class="kpi-l">Total Customers</p><p class="kpi-v c-ink">${CUSTOMERS.length}</p><p class="kpi-s line">Payments, history &amp; balances</p><button type="button" class="ab navy block" data-act="nav" data-pg="money">${ico('i-book')}Go to Money Record</button></div>
      ${kpi('With Balance', String(owe.length), '', 'amber')}${kpi('Total Still Owing', money(sum(owe, balance)), '', 'red')}</div>
    <div class="toolbar">${search('Search by name or phone…', 'custq', S.custQ)}${chips(['All', 'Has Balance', 'Cleared', 'Archived'], S.custFilter, 'custf', 'Filter customers')}</div>
    <ul class="list">${list.map((c) => {
      const b = balance(c);
      return `<li>${avatar(c.name)}<p class="grow"><b>${c.name}</b><small><span class="nw">${ico('i-phone')}${c.phone}</span><span class="nw">${ico('i-pin')}${c.place}</span></small></p>
        ${b > 0 ? `<p class="owe">${money(b)}<small>Still Owing</small></p>` : badge('Cleared', 'ok')}
        ${iconBtn('i-pencil', `Edit ${c.name}`, 'sample', '', 'info')}${iconBtn('i-book', `Open ${c.name} in Money Record`, 'record', `data-c="${c.id}"`, 'info')}</li>`;
    }).join('') || `<li>${empty(S.custFilter === 'Archived' ? 'No archived customers' : 'No customers found', 'Try another search or filter.')}</li>`}</ul>`;
};

PAGE.money = () => {
  const owe = owing();
  const entries = CUSTOMERS.flatMap((c) => {
    let run = 0;
    return c.ledger.map((e, i) => { run += e.a; return { ...e, c, bal: run, k: `${c.id}-${i}` }; });
  }).sort((a, b) => parseD(b.d) - parseD(a.d) || b.time.localeCompare(a.time));
  const shown = entries.filter((e) => S.moneyCust === 'all' || e.c.id === S.moneyCust);
  return head('Money Record', 'Chronological credit &amp; payment records', abtn('Export CSV', 'i-download', 'outline', 'later', 'data-v="Export"') + abtn('Record Payment', 'i-plus', 'primary', 'repay', `data-c="${owe[0]?.id || ''}"${owe.length ? '' : ' disabled'}`))
    + `<div class="kpis k4">${kpi('Total Still Owing', money(sum(owe, balance)), '', 'red')}${kpi('Customers with Balance', String(owe.length), '', 'amber')}${kpi('Total Payments Received', money(-sum(entries.filter((e) => e.a < 0), (e) => e.a)), '', 'green')}${kpi('Total Entries', String(entries.length), '', 'ink')}</div>
    <div class="panel">
      <div class="tabs" role="tablist" aria-label="Balances"><span class="tab on">${ico('i-clock')}Still Owing <em class="count">${owe.length}</em></span><span class="tab">${ico('i-user')}Walk-in Customers <em class="count">0</em></span></div>
      <ul class="list flat">${owe.map((c) => `<li>${avatar(c.name, 'red')}<p class="grow"><b>${c.name}</b><small>${c.phone}</small></p><p class="owe">${money(balance(c))}<small>Still Owing</small></p>
        <button type="button" class="ab pay" data-act="repay" data-c="${c.id}">${ico('i-card')}Pay</button><button type="button" class="ab soft" data-act="view" data-c="${c.id}">${ico('i-book')}View</button></li>`).join('') || `<li>${empty('Nobody owes you', 'Every customer balance is cleared.')}</li>`}</ul>
    </div>
    <div class="toolbar"><label class="sel">${ico('i-users')}<span class="sr">Customer</span><select data-in="moneyc"><option value="all">All Customers</option>${CUSTOMERS.map((c) => `<option value="${c.id}"${c.id === S.moneyCust ? ' selected' : ''}>${c.name}</option>`).join('')}</select>${ico('i-down', 'chev')}</label></div>
    <div class="panel"><p class="panel-h">All Money Record Entries<small>${shown.length} entries · Immutable record</small></p>
    <div class="table"><table><thead><tr><th scope="col">Date</th><th scope="col">Customer</th><th scope="col">Type</th><th scope="col" class="hide-s">Description</th><th scope="col" class="hide-s">Staff</th><th scope="col" class="r">Amount</th><th scope="col" class="r hide-s">Balance</th></tr></thead>
    <tbody>${shown.map((e) => `<tr${e.fresh ? ' class="new"' : ''}><td class="mono">${e.d}<small>${e.time}</small></td><td>${e.c.name}</td><td>${e.a > 0 ? `<em class="type sale">${ico('i-trend')}Sale</em>` : `<em class="type pay">${ico('i-trend')}Payment</em>`}${e.pending ? ' ' + badge('Pending', 'low') : ''}</td>
      <td class="hide-s">${e.desc}</td><td class="hide-s">${e.staff}</td><td class="r ${e.a > 0 ? 'neg' : 'pos'}">${e.a > 0 ? '+' : ''}${money(Math.abs(e.a))}</td><td class="r hide-s">${money(e.bal)}</td></tr>`).join('')}</tbody></table></div></div>`;
};

PAGE.quotations = () => {
  const count = (st) => QUOTES.filter((q) => q.status === st).length;
  const list = QUOTES.filter((q) => S.quoFilter === 'All' || q.status === S.quoFilter);
  const statusTone = { Draft: 'muted', Sent: 'info', Accepted: 'ok', Converted: 'violet', Cancelled: 'out', Expired: 'out' };
  return head('Quotations', `${QUOTES.length} quotations`, abtn('New Quotation', 'i-plus', 'primary', 'newquote'))
    + `<div class="kpis k3">${kpi('Draft', String(count('Draft')), '', 'ink')}${kpi('Sent', String(count('Sent')), '', 'blue')}${kpi('Accepted', String(count('Accepted')), '', 'green')}</div>
    <div class="toolbar">${search('Search by reference or customer…', 'none')}${chips(['All', 'Draft', 'Sent', 'Accepted', 'Converted', 'Expired', 'Cancelled'], S.quoFilter, 'quof', 'Filter quotations')}</div>
    <ul class="docs">${list.map((q) => {
      const open = S.quoOpen === q.n;
      const ref = `QUO-${String(q.n).padStart(4, '0')}`;
      const acts = {
        Draft: iconBtn('i-print', 'Print', 'print') + iconBtn('i-msg', 'Share on WhatsApp', 'share', '', 'ok'),
        Sent: iconBtn('i-check', `Mark ${ref} accepted`, 'accept', `data-n="${q.n}"`, 'ok') + iconBtn('i-ban', `Cancel ${ref}`, 'cancelq', `data-n="${q.n}"`, 'out') + iconBtn('i-print', 'Print', 'print') + iconBtn('i-msg', 'Share on WhatsApp', 'share', '', 'ok'),
        Accepted: iconBtn('i-print', 'Print', 'print') + iconBtn('i-msg', 'Share on WhatsApp', 'share', '', 'ok') + iconBtn('i-invoice', `Convert ${ref} to an invoice`, 'convert', `data-n="${q.n}"`, 'info'),
        Converted: iconBtn('i-print', 'Print', 'print') + iconBtn('i-msg', 'Share on WhatsApp', 'share', '', 'ok') + iconBtn('i-invoice', `Open invoice INV-${String(q.inv).padStart(4, '0')}`, 'openinv', `data-n="${q.inv}"`, 'info'),
        Cancelled: iconBtn('i-print', 'Print', 'print'),
      }[q.status];
      return `<li class="${S.flash === 'q' + q.n ? 'new' : ''}"><div class="doc-r"><p class="grow"><span class="ref"><b class="mono">${ref}</b>${badge(q.status, statusTone[q.status])}</span><small>${custName(q.cust)} · Issued ${q.issued}${q.expires ? ` · Expires ${q.expires}` : ''}</small></p>
        <b class="amt">${ngn(quoteTotal(q))}</b><span class="acts">${acts}</span><button type="button" class="ib chev-b" data-act="quoopen" data-n="${q.n}" aria-expanded="${open}" aria-label="${open ? 'Hide' : 'Show'} items in ${ref}">${ico('i-down')}</button></div>
        ${open ? `<div class="doc-x"><table><thead><tr><th scope="col">Product</th><th scope="col" class="r">Qty</th><th scope="col" class="r hide-s">Price</th><th scope="col" class="r hide-s">Discount</th><th scope="col" class="r">Line total</th></tr></thead><tbody>${q.lines.map((l) => `<tr><td>${P(l.id).name}</td><td class="r">${qtyLabel(l)}</td><td class="r hide-s">${ngn(price(l))}</td><td class="r hide-s">—</td><td class="r"><b>${ngn(price(l) * l.qty)}</b></td></tr>`).join('')}</tbody></table>
        <p class="doc-t">Subtotal: ${ngn(quoteTotal(q))}<span>Discount: NGN 0.00</span><span>Tax: NGN 0.00</span><b>Total: ${ngn(quoteTotal(q))}</b></p></div>` : ''}</li>`;
    }).join('') || `<li>${empty('No quotations', 'Nothing matches this filter.')}</li>`}</ul>`;
};

PAGE.invoices = () => {
  const list = INVOICES.filter((i) => (S.invFulfil === 'All' || i.fulfil === S.invFulfil) && (S.invPay === 'All Payments' || S.invPay === 'All' || invPayState(i) === S.invPay));
  const payTone = { Paid: 'ok', 'Partially Paid': 'low', Unpaid: 'out' };
  return head('Invoices', '')
    + `<div class="kpis k4">${kpi('Total Invoices', String(INVOICES.length), '', 'ink')}${kpi('Unpaid', String(INVOICES.filter((i) => invPayState(i) === 'Unpaid').length), '', 'red')}${kpi('Total Collected', money(sum(INVOICES, invPaid)), '', 'green')}${kpi('Total Outstanding', money(sum(INVOICES, invOut)), '', 'orange')}</div>
    <div class="panel filters">${search('Search by reference or customer…', 'none')}${chips(['All', 'Confirmed', 'Partially Fulfilled', 'Fulfilled', 'Cancelled'], S.invFulfil, 'invf', 'Filter by delivery')}${chips(['All Payments', 'Unpaid', 'Partially Paid', 'Paid'], S.invPay === 'All' ? 'All Payments' : S.invPay, 'invp', 'Filter by payment')}</div>
    <ul class="docs">${list.map((i) => {
      const ref = `INV-${String(i.n).padStart(4, '0')}`;
      const open = S.invOpen === i.n;
      const out = invOut(i);
      const last = i.payments[i.payments.length - 1];
      return `<li class="${S.flash === 'i' + i.n ? 'new' : ''}"><div class="doc-r"><p class="grow"><span class="ref"><b class="mono">${ref}</b>${badge(i.fulfil, i.fulfil === 'Fulfilled' ? 'ok' : 'info')}${badge(invPayState(i), payTone[invPayState(i)])}</span><small>${custName(i.cust)}</small></p>
        <p class="amt-b"><b>${ngn(invTotal(i))}</b>${out && i.payments.length ? `<small class="neg">Outstanding: ${ngn(out)}</small>` : ''}<small>${i.payments.length ? `${i.payments.length} payment(s) recorded · Last: ${ngn(last.a)} · ${last.m}` : 'No payments recorded'}</small></p>
        <span class="acts">${i.fulfil === 'Confirmed' ? iconBtn('i-truck', `Mark ${ref} delivered`, 'fulfil', `data-n="${i.n}"`, 'info') : ''}${out ? iconBtn('i-wallet', `Record a payment for ${ref}`, 'invpay', `data-n="${i.n}"`, 'ok') : ''}${iconBtn('i-ban', `Cancel ${ref}`, 'sample', '', 'out')}${iconBtn('i-print', 'Print', 'print')}${iconBtn('i-msg', 'Share on WhatsApp', 'share', '', 'ok')}</span>
        <button type="button" class="ib chev-b" data-act="invopen" data-n="${i.n}" aria-expanded="${open}" aria-label="${open ? 'Hide' : 'Show'} details of ${ref}">${ico('i-down')}</button></div>
        ${open ? `<div class="doc-x"><table><thead><tr><th scope="col">Product</th><th scope="col" class="r">Confirmed</th><th scope="col" class="r">Fulfilled</th><th scope="col" class="r hide-s">Outstanding</th><th scope="col" class="r">Line Total</th></tr></thead><tbody>${i.lines.map((l) => `<tr><td>${P(l.id).name}</td><td class="r">${qtyLabel(l)}</td><td class="r">${i.fulfil === 'Fulfilled' ? qtyLabel(l) : 0}</td><td class="r hide-s">${i.fulfil === 'Fulfilled' ? 0 : qtyLabel(l)}</td><td class="r"><b>${ngn(price(l) * l.qty)}</b></td></tr>`).join('')}</tbody></table>
        <p class="doc-t">Subtotal: ${ngn(invTotal(i))}<span>Discount: NGN 0.00</span><span>Tax: NGN 0.00</span><b>Total: ${ngn(invTotal(i))}</b></p>
        <p class="pays-h">Payments</p>${i.payments.length ? `<ul class="pays">${i.payments.map((p) => `<li><span>${p.d} · ${p.m}</span><b>${ngn(p.a)}</b></li>`).join('')}</ul>` : '<p class="pays-none">No payments yet.</p>'}</div>` : ''}</li>`;
    }).join('') || `<li>${empty('No invoices', 'Nothing matches these filters.')}</li>`}</ul>`;
};

PAGE.reports = () => {
  const t = today();
  const w = week();
  const r = S.range === 'today' ? { ...t, days: [{ label: 'Today', date: '27 Oct', total: t.total }] } : w;
  const margin = pct(r.profit, r.total);
  const maxDay = Math.max(...r.days.map((d) => d.total));
  const split = [['Cash', r.cash, '#00C950'], ['Digital', r.digital, '#2E4AFF'], ['Partial', r.partial, '#F9B80A'], ['Credit', r.credit, '#D4183D']].filter((x) => x[1] > 0);
  const splitTotal = sum(split, (x) => x[1]);
  let acc = 0;
  const ring = split.map(([, v, c]) => { const a = acc; acc += v / splitTotal; return `${c} ${(a * 100).toFixed(2)}% ${(acc * 100).toFixed(2)}%`; }).join(', ');
  const rows = [...S.sales.slice().reverse().map((s) => ({ time: s.time, cust: custName(s.cust), method: s.method, total: s.total, owe: s.total - s.paid, staff: 'Admin User', n: s.n })), ...EARLIER_TX.map((x) => ({ ...x, owe: 0 }))];
  return head('Reports', `Last refreshed ${clock()}`, abtn('Refresh', 'i-refresh', 'outline', 'refresh') + abtn('Export CSV', 'i-download', 'outline', 'later', 'data-v="Export"') + abtn('Export PDF', 'i-file', 'primary', 'later', 'data-v="Export"'))
    + `<div class="rtabs"><span class="rtab on">${ico('i-bars')}Daily Sales</span>${[['Receipts', 'i-invoice'], ['Inventory', 'i-package'], ['Still Owing', 'i-users'], ['Reconciliation', 'i-swap']].map(([l, i]) => `<button type="button" class="rtab" data-act="later" data-v="The ${l} report">${ico(i)}${l}</button>`).join('')}</div>
    <div class="panel">${chips(['Today', 'This Week'], S.range === 'today' ? 'Today' : 'This Week', 'range', 'Date range')}</div>
    <div class="kpis k4 tight">
      ${kpi('Total Revenue', money(r.total), `${r.count} transactions`, 'ink')}${kpi('Gross Profit', money(r.profit), `${margin.toFixed(1)}% margin`, 'green')}${kpi('Units Sold', fmt(r.units, 0), '', 'blue')}${kpi('On Credit', money(r.credit), 'total outstanding', 'ink')}
      ${kpi('Cash Collected', money(r.cash), '', 'green')}${kpi('Digital Collected', money(r.digital), '', 'blue')}${kpi('Partial Collected', money(r.partial), '', 'orange')}${kpi('Cartons Sold', String(r.ctns), '', 'violet')}
    </div>
    <div class="dash-row">
      <div class="panel"><p class="panel-h">Daily Revenue<small>— total sales per day</small></p><div class="vbars" role="img" aria-label="Revenue per day">${r.days.map((d) => `<span><i style="--h:${pct(d.total, maxDay).toFixed(1)}%" title="${d.date}: ${naira(d.total)}"></i><small>${d.label}</small></span>`).join('')}</div></div>
      <div class="panel"><p class="panel-h">Payment Split<small>— by type</small></p><div class="donut-w"><span class="donut" style="background:conic-gradient(${ring})"></span><ul class="legend">${split.map(([l, v, c]) => `<li><i style="background:${c}"></i>${l}<b>${naira(v)}</b></li>`).join('')}</ul></div></div>
    </div>
    <div class="panel"><p class="panel-h">Transactions<small>today (${t.count})</small></p><div class="table"><table><thead><tr><th scope="col">Date · Staff</th><th scope="col">Customer</th><th scope="col">Payment</th><th scope="col" class="r">Total</th><th scope="col" class="r hide-s">Still Owing</th><th scope="col"><span class="sr">Actions</span></th></tr></thead>
    <tbody>${rows.slice(0, 6).map((x) => `<tr${x.n && S.flash === 's' + x.n ? ' class="new"' : ''}><td><b>${TODAY_LABEL.date}, ${x.time}</b><small>${x.staff}</small></td><td>${x.cust}</td><td>${badge(methodName[x.method], methodTone[x.method])}</td><td class="r"><b>${money(x.total)}</b></td><td class="r hide-s ${x.owe ? 'neg' : ''}">${x.owe ? money(x.owe) : '—'}</td><td><button type="button" class="ab soft sm" data-act="receipt" data-n="${x.n || ''}">${ico('i-invoice')}Receipt</button></td></tr>`).join('')}</tbody></table></div>
    ${t.count > rows.length ? `<p class="more">and ${t.count - rows.length} earlier sales today</p>` : ''}</div>`;
};

/* Joryka AI: every figure below is worked out from the playground's state */
function attention() {
  const items = [];
  const w = week();
  PRODUCTS.filter((p) => totalStock(p) === 0 && usualRate(p) > 0).forEach((p) => items.push({ tone: 'Urgent', key: 'reorder', text: `${p.name} is out of stock in both warehouses. It usually sells about ${usualRate(p)} a day.` }));
  const change = pct(w.total - LAST_WEEK.total, LAST_WEEK.total);
  if (change < 0) items.push({ tone: change < -10 ? 'Urgent' : 'Watch', key: 'sales', text: `Sales are ${Math.abs(change).toFixed(1)}% below last week. The data explains part of it.` });
  overdueList().forEach((o) => items.push({ tone: 'Watch', key: 'overdue', text: `${o.c.name}’s ${naira(o.amount)} is ${o.days} days overdue.` }));
  restockList().filter((p) => totalStock(p) > 0).forEach((p) => items.push({ tone: 'Watch', key: 'reorder', text: `${p.name} is below its reorder level: ${totalStock(p)} left, reorder at ${p.reorder}.` }));
  return items.sort((a, b) => (a.tone === b.tone ? 0 : a.tone === 'Urgent' ? -1 : 1));
}
function cards() {
  const w = week();
  const change = pct(w.total - LAST_WEEK.total, LAST_WEEK.total);
  const margin = pct(w.profit, w.total);
  const re = restockList();
  const od = overdueList();
  const slow = slowList();
  const first = re.find((p) => totalStock(p) === 0) || re[0];
  return [
    { key: 'sales', label: 'Sales this week', icon: 'i-trend', tone: change < 0 ? 'red' : 'green', iconTone: 'blue', value: money(w.total), text: `Sales ${change < 0 ? 'fell' : 'rose'} ${Math.abs(change).toFixed(1)}% to ${naira(w.total)} from ${naira(LAST_WEEK.total)}.` },
    { key: 'margin', label: 'Gross margin', icon: 'i-percent', tone: 'green', iconTone: 'green', value: `${margin.toFixed(1)}%`, text: `Gross margin is ${margin.toFixed(1)}%, ${margin >= LAST_WEEK.margin * 100 ? 'up' : 'down'} ${Math.abs(margin - LAST_WEEK.margin * 100).toFixed(1)} points from last week.` },
    { key: 'reorder', label: 'Needs reorder', icon: 'i-alert', tone: 'red', iconTone: 'red', value: `${re.length} product${re.length === 1 ? '' : 's'}`, text: re.length ? re.map((p) => `${p.name} (${totalStock(p)} left)`).join(', ') + '.' : 'Every product is above its reorder level.' },
    { key: 'overdue', label: 'Overdue credit', icon: 'i-clock', tone: 'amber', iconTone: 'amber', value: money(sum(od, (o) => o.amount)), text: od.length ? `${naira(sum(od, (o) => o.amount))} overdue from ${od.length} customer${od.length === 1 ? '' : 's'}. The oldest is ${Math.max(...od.map((o) => o.days))} days old.` : 'No credit is more than 14 days old.' },
    { key: 'slow', label: 'Slow-moving stock', icon: 'i-hourglass', tone: 'violet', iconTone: 'violet', value: `${slow.length} product${slow.length === 1 ? '' : 's'}`, text: slow.length ? `No sales in 30 days, ${naira(sum(slow, (p) => totalStock(p) * p.cost))} tied up.` : 'Everything has sold in the last 30 days.' },
    { key: 'action', label: 'Recommended action', icon: 'i-bulb', tone: 'ink', iconTone: 'navy', value: first ? `Restock ${first.name.replace(/ \d.*$/, '')}` : od.length ? `Call ${od[0].c.name.split(' ')[0]}` : 'Nothing urgent', text: first ? `${totalStock(first)} in stock, ${usualRate(first) ? `selling about ${usualRate(first)} a day` : 'below its reorder level'}.` : od.length ? `${naira(od[0].amount)} is ${od[0].days} days overdue.` : 'Stock and credit are in good shape.' },
  ];
}
const SUGGEST = [['week', 'What were sales this week?'], ['compare', 'Compare with last week'], ['top', 'Top-selling products'], ['wh', 'Which warehouse sold the most?'], ['reorder', 'What needs reordering?'], ['owe', 'Who owes us the most?'], ['why', 'Why did sales change?']];
const meter = (label, note, value, w, tone = '') => `<div class="meter-row"><span>${label}<small>${note}</small></span><b>${value}</b><div class="meter"><i class="${tone}" style="--w:${Math.max(2, Math.min(100, w)).toFixed(1)}%"></i></div></div>`;
const RANGE = `Wed 21 – Tue 27 Oct`;
const ASK = {
  week() {
    const w = week();
    return { h: `You’ve sold ${naira(w.total)} this week across ${w.count} sales.`, p: `That’s Wednesday 21 October to today. The same days last week came to ${naira(LAST_WEEK.total)}.`, ev: w.days.map((d) => meter(`${d.label} ${d.date}`, '', naira(d.total), pct(d.total, Math.max(...w.days.map((x) => x.total))))).join(''), foot: `Based on ${w.count} sales, ${RANGE}`, view: 'reports' };
  },
  compare() {
    const w = week();
    const ch = pct(w.total - LAST_WEEK.total, LAST_WEEK.total);
    return { h: `This week is ${Math.abs(ch).toFixed(1)}% ${ch < 0 ? 'below' : 'above'} last week.`, p: `${naira(w.total)} so far, against ${naira(LAST_WEEK.total)} for the same days last week.`, ev: meter('This week', RANGE, naira(w.total), pct(w.total, Math.max(w.total, LAST_WEEK.total))) + meter('Last week', `Wed ${LAST_WEEK.from} – Tue ${LAST_WEEK.to}`, naira(LAST_WEEK.total), pct(LAST_WEEK.total, Math.max(w.total, LAST_WEEK.total)), 'was'), foot: `Based on ${w.count} sales this week and last week’s records`, view: 'reports' };
  },
  top() {
    const top = PRODUCTS.map((p) => ({ p, u: weekUnits(p) })).sort((a, b) => b.u - a.u).slice(0, 5);
    return { h: `${top[0].p.name} is your top seller this week: ${top[0].u} units.`, ev: `<ul class="a-list">${top.map((x) => `<li><span><b>${x.p.name}</b><small>${x.u} units</small></span><em>${naira(x.u * x.p.unit)}</em></li>`).join('')}</ul>`, foot: `Based on units sold, ${RANGE}`, view: 'inventory' };
  },
  wh() {
    const w = week();
    const lead = w.p >= w.s ? ['Primary Warehouse', w.p] : ['Secondary Warehouse', w.s];
    return { h: `${lead[0]} sold the most: ${naira(lead[1])}, ${pct(lead[1], w.total).toFixed(0)}% of this week’s sales.`, ev: meter('Primary Warehouse', `${pct(w.p, w.total).toFixed(0)}% of sales`, naira(w.p), pct(w.p, w.total)) + meter('Secondary Warehouse', `${pct(w.s, w.total).toFixed(0)}% of sales`, naira(w.s), pct(w.s, w.total)), foot: `Based on ${w.count} sales, ${RANGE}`, view: 'reports' };
  },
  reorder() {
    const re = restockList();
    if (!re.length) return { h: 'Nothing needs reordering right now.', p: 'Every product is above its reorder level across both warehouses.', foot: 'Based on stock in both warehouses', view: 'inventory' };
    return { h: `${re.length} product${re.length === 1 ? ' needs' : 's need'} reordering. Start with ${re[0].name}.`, p: `${re[0].name} has ${totalStock(re[0])} left${usualRate(re[0]) ? ` and usually sells about ${usualRate(re[0])} a day` : ''}.`, ev: `<ul class="a-list">${re.map((p) => `<li><span><b>${p.name}</b><small>${totalStock(p)} in stock · reorder at ${p.reorder}</small></span><em>About ${Math.max(1, Math.ceil((usualRate(p) * 14) / PER))} ctn for 2 weeks</em></li>`).join('')}</ul>`, foot: 'Based on stock in both warehouses and sales over the last 30 days · Suggestions only', view: 'inventory' };
  },
  owe() {
    const list = owing().sort((a, b) => balance(b) - balance(a));
    if (!list.length) return { h: 'Nobody owes you anything right now.', p: 'Every customer balance is cleared.', foot: `Based on ${CUSTOMERS.length} customer records`, view: 'money' };
    return { h: `${list[0].name} owes you the most: ${naira(balance(list[0]))}.`, p: `${list.length} customer${list.length === 1 ? ' owes' : 's owe'} you ${naira(sum(list, balance))} in all.`, ev: `<ul class="a-list">${list.map((c) => { const lp = [...c.ledger].reverse().find((e) => e.a < 0); return `<li><span><b>${c.name}</b><small>${lp ? `Last payment ${lp.d}` : 'No payment yet'}</small></span><em class="neg">${naira(balance(c))}</em></li>`; }).join('')}</ul>`, foot: `Based on ${CUSTOMERS.length} customer records`, view: 'money' };
  },
  why() {
    const w = week();
    const ch = w.total - LAST_WEEK.total;
    const dp = w.p - LAST_WEEK.p;
    const ds = w.s - LAST_WEEK.s;
    if (ch >= 0) return { h: `Sales are up ${pct(ch, LAST_WEEK.total).toFixed(1)}% on last week.`, p: `Most of the rise is from the sales made today in this playground. Before that, the week was ${naira(LAST_WEEK.total - (EARLIER_TODAY.total + sum(PAST_DAYS, (d) => d.total)))} behind.`, foot: `Based on ${w.count} sales, ${RANGE}`, view: 'reports' };
    const oil = Math.round(P('oil').rate.secondary * 7) * P('oil').unit;
    return {
      h: `Sales are ${Math.abs(pct(ch, LAST_WEEK.total)).toFixed(1)}% below last week. Part of it is explained.`,
      p: `Secondary Warehouse is ${naira(Math.abs(ds))} down. Vegetable Oil has been out of stock there since Wed 21 Oct, and at its usual ${Math.round(P('oil').rate.secondary * 7)} or so a week that’s about ${naira(oil)}.`,
      ev: meter('Secondary Warehouse', 'Vegetable Oil out of stock since 21 Oct', ds < 0 ? '−' + naira(-ds) : '+' + naira(ds), pct(Math.abs(ds), Math.abs(dp) + Math.abs(ds)), 'gap') + meter('Primary Warehouse', 'No stock-outs or price changes', dp < 0 ? '−' + naira(-dp) : '+' + naira(dp), pct(Math.abs(dp), Math.abs(dp) + Math.abs(ds)), 'was'),
      gapTitle: 'The data doesn’t show why',
      gap: dp < 0 ? `Primary Warehouse sold ${naira(-dp)} less with the same stock and prices.` : 'Primary Warehouse is level with last week.',
      foot: `Based on ${w.count} sales this week and last week’s records`, view: 'reports',
    };
  },
};
function matchQuestion(text) {
  const t = text.toLowerCase();
  if (/why|change|drop|fell|down/.test(t)) return 'why';
  if (/compar|last week|versus|vs/.test(t)) return 'compare';
  if (/warehouse|branch|depot/.test(t)) return 'wh';
  if (/reorder|restock|run out|low|stock/.test(t)) return 'reorder';
  if (/owe|debt|credit|balance/.test(t)) return 'owe';
  if (/top|best|most sold|selling/.test(t)) return 'top';
  if (/sale|sold|revenue|week/.test(t)) return 'week';
  return null;
}
function answerHTML(a) {
  return `<div class="msg ai"><span class="bot">${ico('i-spark')}</span><div class="bubble"><p class="a-h">${a.h}</p>${a.p ? `<p class="a-p">${a.p}</p>` : ''}${a.ev ? `<div class="a-ev">${a.ev}</div>` : ''}
    ${a.gap ? `<p class="a-gap">${ico('i-info')}<span><b>${a.gapTitle}</b>${a.gap}</span></p>` : ''}
    <p class="msg-foot">${ico('i-info')}${a.foot}<span>${ico('i-spark')}Written by AI</span>${a.view ? `<button type="button" class="view" data-act="nav" data-pg="${a.view}">View records →</button>` : ''}</p></div></div>`;
}
PAGE.ai = () => {
  const items = attention();
  const urgent = items.filter((x) => x.tone === 'Urgent').length;
  const shown = S.attnAll ? items : items.slice(0, 3);
  const convo = S.chat.slice(-2).map((m, i, arr) => `<div class="msg me"><span class="bubble">${esc(m.q)}</span></div>${m.key ? (S.busy && i === arr.length - 1 ? '<div class="msg ai"><span class="bot">' + ico('i-spark') + '</span><div class="bubble"><p class="a-busy"><i><b></b><b></b><b></b></i>Checking your records…</p></div></div>' : answerHTML(ASK[m.key]())) : `<div class="msg ai"><span class="bot">${ico('i-spark')}</span><div class="bubble"><p class="a-p">In this sample I can answer the suggested questions. In your own shop, Joryka AI answers questions about your sales, stock and customer balances.</p></div></div>`}`).join('');
  return `<div class="brief-h"><p><b role="heading" aria-level="3">Daily brief</b><small>Written by AI from your data</small></p><span>${TODAY_LABEL.short} · All warehouses</span></div>
    <div class="panel attn"><p class="panel-h">Needs attention<small>${urgent} urgent · ${items.length - urgent} to watch</small></p>
      <ul>${shown.map((x) => `<li><button type="button" data-act="panel" data-v="${x.key}">${badge(x.tone, x.tone === 'Urgent' ? 'out' : 'low')}<span>${x.text}</span>${ico('i-right')}</button></li>`).join('') || '<li class="calm">Nothing needs your attention today.</li>'}</ul>
      ${items.length > 3 ? `<button type="button" class="link" data-act="attn">${S.attnAll ? 'Show less' : `Show all ${items.length}`}</button>` : ''}</div>
    <div class="aicards">${cards().map((c) => `<button type="button" class="aicard" data-act="panel" data-v="${c.key}"><span class="kpi-l">${c.label}<span class="kpi-i t-${c.iconTone}">${ico(c.icon)}</span></span><b class="c-${c.tone}">${c.value}</b><small class="c-${c.tone}">${c.text}</small></button>`).join('')}</div>
    <div class="panel ask">
      <div class="ask-h"><span class="bot">${ico('i-spark')}</span><p><b>Ask Joryka AI</b><small>${S.chat.length ? esc(S.chat[S.chat.length - 1].q) : 'New conversation'}</small></p><em class="left">${S.left} questions left today</em><button type="button" class="ab outline sm" data-act="newchat">${ico('i-plus')}New chat</button></div>
      <div class="ask-b" aria-live="polite">${!S.online ? `<div class="ask-empty"><span class="bot big">${ico('i-wifi-off')}</span><b>Joryka AI needs an internet connection</b><span>Your sales are still being saved on this device. Go back online to ask a question.</span></div>`
        : S.chat.length ? convo
        : `<div class="ask-empty"><span class="bot big">${ico('i-spark')}</span><b>What would you like to know?</b><span>Ask about sales, stock or customer balances — or start with one of these.</span></div><div class="sugs">${SUGGEST.map(([k, q]) => `<button type="button" data-act="ask" data-v="${k}">${q}${ico('i-right')}</button>`).join('')}</div>`}</div>
      ${S.chat.length && S.online ? `<div class="sug-row">${SUGGEST.map(([k, q]) => `<button type="button" data-act="ask" data-v="${k}">${q}</button>`).join('')}</div>` : ''}
      <form class="ask-in" data-form="ask"><label class="sr" for="ask-q">Ask about your business</label><textarea id="ask-q" rows="1" placeholder="Ask about your business…"${S.online ? '' : ' disabled'}></textarea><button type="submit" class="send" aria-label="Send"${S.online ? '' : ' disabled'}>${ico('i-send')}</button></form>
      <p class="ask-tip">Enter to send · Shift + Enter for a new line</p>
    </div>`;
};

/* ---------------------------------------------------------------- side panel (AI) and modals */
function panelHTML(key) {
  const w = week();
  const re = restockList();
  const od = overdueList();
  const slow = slowList();
  const tbl = (cols, rows) => `<div class="table"><table><thead><tr>${cols.map((c, i) => `<th scope="col"${i ? ' class="r"' : ''}>${c}</th>`).join('')}</tr></thead><tbody>${rows.map((r) => `<tr>${r.map((c, i) => `<td${i ? ' class="r"' : ''}>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  const chg = (a, b) => { const d = a - b; return [`<span class="${d < 0 ? 'neg' : 'pos'}">${d < 0 ? '−' : '+'}${naira(Math.abs(d))}</span>`, `<span class="${d < 0 ? 'neg' : 'pos'}">${d < 0 ? '−' : '+'}${Math.abs(pct(d, b)).toFixed(1)}%</span>`]; };
  const P_ = {
    sales: { t: 'Sales this week', h: 'Sales by warehouse — this week vs last week', d: 'Oct 21 – Oct 27', body: tbl(['Warehouse', 'This week', 'Last week', 'Change', '% change'], [['Primary Warehouse', naira(w.p), naira(LAST_WEEK.p), ...chg(w.p, LAST_WEEK.p)], ['Secondary Warehouse', naira(w.s), naira(LAST_WEEK.s), ...chg(w.s, LAST_WEEK.s)], ['<b>All warehouses</b>', `<b>${naira(w.total)}</b>`, `<b>${naira(LAST_WEEK.total)}</b>`, ...chg(w.total, LAST_WEEK.total)]]), how: `Sales = everything customers paid or put on credit for completed sales, from Wed 21 Oct to today, compared with the same days last week (Wed 14 – Tue 20 Oct). Includes ${w.count} completed sales. Voided sales and debt repayments are not counted.` },
    margin: { t: 'Gross margin', h: 'Profit on this week’s sales', d: 'Oct 21 – Oct 27', body: tbl(['', 'This week', 'Last week'], [['Sales', naira(w.total), naira(LAST_WEEK.total)], ['Cost of goods sold', naira(w.total - w.profit), naira(LAST_WEEK.total * (1 - LAST_WEEK.margin))], ['Gross profit', naira(w.profit), naira(LAST_WEEK.total * LAST_WEEK.margin)], ['<b>Gross margin</b>', `<b>${pct(w.profit, w.total).toFixed(1)}%</b>`, `<b>${(LAST_WEEK.margin * 100).toFixed(1)}%</b>`]]), how: 'Gross profit = sales minus what the goods cost you, using each product’s average cost. Gross margin = gross profit ÷ sales.' },
    reorder: { t: 'Needs reorder', h: 'Products below their reorder level', d: 'Both warehouses · today', body: re.length ? tbl(['Product', 'In stock', 'Reorder at', 'Sells a day'], re.map((p) => [p.name, `<span class="${totalStock(p) ? '' : 'neg'}">${totalStock(p)}</span>`, p.reorder, usualRate(p) || '—'])) : '<p class="calm">Every product is above its reorder level.</p>', how: 'A product needs reordering when its stock across both warehouses falls below the reorder level set for it. “Sells a day” is the average over the last 30 days.' },
    overdue: { t: 'Overdue credit', h: 'Credit older than 14 days', d: 'As of 27 Oct', body: od.length ? tbl(['Customer', 'Overdue', 'Oldest unpaid sale', 'Days'], od.map((o) => [o.c.name, naira(o.amount), o.oldest.d, o.days])) : '<p class="calm">No credit is more than 14 days old.</p>', how: 'Credit counts as overdue when part of a sale is still unpaid 14 days later. Payments are matched to the oldest sales first.' },
    slow: { t: 'Slow-moving stock', h: 'No sales in the last 30 days', d: 'Sep 28 – Oct 27', body: slow.length ? tbl(['Product', 'In stock', 'Value tied up', 'Last sale'], slow.map((p) => [p.name, totalStock(p), naira(totalStock(p) * p.cost), p.lastSale || '—'])) : '<p class="calm">Everything has sold in the last 30 days.</p>', how: 'Products with stock but no sales in the last 30 days. “Value tied up” uses the average cost of the stock you hold.' },
    action: { t: 'Recommended action', h: 'Why this comes first', d: 'Today', body: re.length ? tbl(['Product', 'In stock', 'Sells a day', 'Suggested order'], re.map((p) => [p.name, totalStock(p), usualRate(p) || '—', `${Math.max(1, Math.ceil((usualRate(p) * 14) / PER))} ctn`])) : '<p class="calm">Nothing needs restocking.</p>', how: 'Out-of-stock products that still have demand come first, then low stock, then overdue credit. The suggested order covers about two weeks at the usual rate. It’s a suggestion: nothing is ordered for you.' },
  }[key];
  return `<div class="sheet" role="dialog" aria-modal="true" aria-labelledby="sheet-t"><div class="sheet-h"><p id="sheet-t">${P_.t}</p>${iconBtn('i-x', 'Close', 'close')}</div>
    <div class="sheet-b"><p class="sheet-sub">${P_.h}</p><p class="sheet-d">${P_.d}</p>${P_.body}<p class="how-h">How this was calculated</p><p class="how">${P_.how}</p></div></div>`;
}

function payModal() {
  const m = S.modal;
  const due = m.due;
  const saved = m.cust && m.cust !== 'walkin';
  const methods = m.kind === 'sale' ? [['cash', 'Cash', 'i-cash'], ['digital', 'Digital', 'i-card'], ['partial', 'Partial', 'i-bars'], ['credit', 'Full Credit', 'i-user']] : [['cash', 'Cash', 'i-cash'], ['digital', 'Digital', 'i-card'], ['partial', 'Partial', 'i-bars']];
  const needCust = (k) => m.kind === 'sale' && !saved && (k === 'partial' || k === 'credit');
  const c = saved ? C(m.cust) : null;
  const paidNow = m.method === 'partial' ? (parseFloat(String(m.amount).replace(/,/g, '')) || 0) : m.method === 'credit' ? 0 : due;
  let extra = '';
  if (m.method === 'cash') extra = `<label class="fld"><span>Cash Received</span><input inputmode="decimal" data-in="m-amount" value="${esc(m.amount)}" placeholder="Enter amount (min ${money(due)})"></label>${(parseFloat(String(m.amount).replace(/,/g, '')) || 0) > due ? `<p class="change">Change to give: <b>${money((parseFloat(String(m.amount).replace(/,/g, '')) || 0) - due)}</b></p>` : ''}`;
  if (m.method === 'digital') extra = '<label class="fld"><span>Reference (optional)</span><input data-in="m-ref" placeholder="e.g. Transaction ID, cheque number…"></label>';
  if (m.method === 'partial') extra = `<label class="fld"><span>Amount paid now</span><input inputmode="decimal" data-in="m-amount" value="${esc(m.amount)}" placeholder="Less than ${money(due)}"></label>`;
  if (m.kind === 'sale' && (m.method === 'partial' || m.method === 'credit') && c) extra += `<p class="credit-note"><b>${money(Math.max(0, due - paidNow))} on credit to:</b><span>${c.name}</span><small>Current balance: ${money(balance(c))}</small></p>`;
  if (m.kind !== 'sale' && m.method === 'partial') extra += `<p class="credit-note soft"><small>Still to pay after this: ${money(Math.max(0, due - paidNow))}</small></p>`;
  return `<div class="modal" role="dialog" aria-modal="true" aria-labelledby="m-t"><div class="m-h"><p id="m-t">${m.kind === 'repay' ? `Payment from ${C(m.cust).name}` : 'Payment'}</p>${iconBtn('i-x', 'Close', 'close')}</div>
    <div class="m-b"><div class="due"><span>${m.kind === 'repay' ? 'Still Owing' : 'Total Amount Due'}</span><b>${m.kind === 'invoice' ? ngn(due) : money(due)}</b></div>
      <p class="m-l" id="pm-l">Payment Method</p><div class="methods" role="radiogroup" aria-labelledby="pm-l">${methods.map(([k, l, i]) => `<button type="button" role="radio" aria-checked="${m.method === k}" data-act="method" data-v="${k}" class="${k === 'credit' ? 'cr' : ''}"${needCust(k) ? ' disabled' : ''}>${ico(i)}${l}</button>`).join('')}</div>
      ${m.kind === 'sale' && !saved ? '<p class="m-hint">Choose a customer in the cart to sell on credit or part-payment.</p>' : ''}
      ${extra}${m.error ? `<p class="m-err" role="alert">${m.error}</p>` : ''}</div>
    <div class="m-f"><button type="button" class="ab outline" data-act="close">Close</button><button type="button" class="ab primary" data-act="confirm">${ico('i-check')}Confirm Payment</button></div></div>`;
}
function receiptModal() {
  const s = S.sales.find((x) => x.n === S.modal.n);
  const rows = s.lines.map((l) => `<p><span>${P(l.id).name}</span><span>${l.kind === 'ctn' ? `${l.qty}ctn` : `${l.qty}u`} ${money(price(l) * l.qty)}</span></p>`).join('');
  return `<div class="modal" role="dialog" aria-modal="true" aria-labelledby="m-t"><div class="m-h ok"><p id="m-t">${ico('i-check')}Transaction Complete</p>${iconBtn('i-x', 'Close', 'close')}</div>
    <div class="m-b"><div class="receipt"><p class="rc-c"><b>Joryka Demo Store</b><span>${TODAY_LABEL.date}, ${s.time}</span><span>Staff: Admin User</span><span>Customer: ${custName(s.cust)}</span><span class="muted">Receipt #${s.n}</span></p>
      <div class="rc-l">${rows}</div>
      <div class="rc-l"><p><span>Subtotal</span><span>${money(s.sub)}</span></p>${s.disc ? `<p><span>Discount</span><span>− ${money(s.disc)}</span></p>` : ''}<p class="rc-t"><span>Total</span><span>${money(s.total)}</span></p><p><span>Paid</span><span>${money(s.paid)}</span></p>${s.total - s.paid > 0 ? `<p class="neg"><span>Outstanding</span><span>${money(s.total - s.paid)}</span></p>` : ''}<p><span>Method</span><span>${methodName[s.method]}</span></p></div>
      <p class="rc-c muted">Thank you for your business! All sales are final.</p>${s.synced ? '' : '<p class="rc-c pend">Saved on this device. It syncs when you’re back online.</p>'}</div></div>
    <div class="m-f"><button type="button" class="ab outline" data-act="close">Close</button><button type="button" class="ab wa" data-act="share">${ico('i-msg')}WhatsApp</button><button type="button" class="ab primary" data-act="print">${ico('i-print')}Print</button></div></div>`;
}
function quoteModal() {
  const m = S.modal;
  const sub = linesTotal(m.lines);
  const disc = (() => { const v = parseFloat(m.disc.v) || 0; return v <= 0 ? 0 : Math.min(sub, m.disc.mode === '%' ? Math.round(sub * Math.min(v, 100) / 100) : v); })();
  return `<div class="modal wide" role="dialog" aria-modal="true" aria-labelledby="m-t"><div class="m-h"><p id="m-t">${ico('i-file')}New Quotation</p>${iconBtn('i-x', 'Close', 'close')}</div>
    <div class="m-b">
      <label class="fld"><span>Customer *</span><span class="sel">${''}<select data-in="q-cust">${CUSTOMERS.map((c) => `<option value="${c.id}"${c.id === m.cust ? ' selected' : ''}>${c.name}</option>`).join('')}</select>${ico('i-down', 'chev')}</span></label>
      <p class="m-l">Items *</p>
      ${m.lines.map((l, i) => `<div class="qitem"><label class="fld"><span class="sr">Product</span><span class="sel"><select data-in="q-prod" data-i="${i}">${PRODUCTS.map((p) => `<option value="${p.id}"${p.id === l.id ? ' selected' : ''}>${p.name} (${p.sku})</option>`).join('')}</select>${ico('i-down', 'chev')}</span></label>
        <div class="q3"><label class="fld"><span>Qty</span><input inputmode="numeric" data-in="q-qty" data-i="${i}" value="${l.qty}"></label><label class="fld"><span>Unit</span><span class="sel"><select data-in="q-kind" data-i="${i}"><option value="unit"${l.kind === 'unit' ? ' selected' : ''}>Unit</option><option value="ctn"${l.kind === 'ctn' ? ' selected' : ''}>Carton</option></select>${ico('i-down', 'chev')}</span></label><label class="fld"><span>Price</span><input value="${fmt(price(l))}" readonly></label></div>
        <p class="lt">${m.lines.length > 1 ? `<button type="button" class="link-red" data-act="q-rm" data-i="${i}">Remove</button>` : ''}Line total: ${money(price(l) * l.qty)}</p></div>`).join('')}
      ${m.lines.length < 3 ? '<button type="button" class="link" data-act="q-add">+ Add item</button>' : ''}
      <p class="m-l">Discount</p><div class="disc"><span class="seg" role="radiogroup" aria-label="Discount type">${['%', '₦'].map((x) => `<button type="button" role="radio" aria-checked="${m.disc.mode === x}" data-act="q-dmode" data-v="${x}">${x}</button>`).join('')}</span><label class="sr" for="q-disc">Discount</label><input id="q-disc" inputmode="decimal" placeholder="Discount (optional)" data-in="q-disc" value="${esc(m.disc.v)}"></div>
      <div class="qtot"><p><span>Subtotal</span><span>${money(sub)}</span></p><p><span>Discount</span><span>${money(disc)}</span></p><p><span>Tax</span><span>${money(0)}</span></p><p class="t"><span>Total</span><span>${money(sub - disc)}</span></p></div>
      <div class="q2"><label class="fld"><span>Issue Date *</span><input value="${TODAY_LABEL.date}" readonly></label><label class="fld"><span>Expiry Date</span><input value="03/11/2026" readonly></label></div>
      <label class="fld"><span>Notes / Terms</span><textarea rows="2" placeholder="e.g. Payment terms, delivery notes…" data-in="q-notes"></textarea></label>
      ${m.error ? `<p class="m-err" role="alert">${m.error}</p>` : ''}</div>
    <div class="m-f"><button type="button" class="ab outline" data-act="close">Cancel</button><button type="button" class="ab primary" data-act="q-create">Create Draft</button></div></div>`;
}

function openLayer(modal, trigger) {
  S.modal = modal;
  S.ret = trigger ? describe(trigger) : null;
  renderLayer();
  requestAnimationFrame(() => $('.modal input:not([readonly]), .modal select, .sheet .ib, .modal [aria-checked="true"]', layer)?.focus());
}
function closeLayer(restore = true) {
  if (!S.modal) return;
  S.modal = null;
  renderLayer();
  if (restore && S.ret) { render(); $(S.ret, stage)?.focus(); }
}
function renderLayer() {
  layer.hidden = !S.modal;
  if (!S.modal) { layer.innerHTML = ''; layer.className = 'layer'; return; }
  layer.className = `layer ${S.modal.type === 'panel' ? 'side' : ''}`;
  layer.innerHTML = { pay: payModal, receipt: receiptModal, quote: quoteModal, panel: () => panelHTML(S.modal.key) }[S.modal.type]();
}
layer.addEventListener('click', (e) => { if (e.target === layer) closeLayer(); });
stage.addEventListener('keydown', (e) => {
  if (!S.modal) return;
  if (e.key === 'Escape') { e.preventDefault(); closeLayer(); return; }
  if (e.key !== 'Tab') return;
  const f = $$('button:not([disabled]), input:not([readonly]), select, textarea', layer);
  if (!f.length) return;
  if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
  else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
});

/* ---------------------------------------------------------------- render */
function describe(el) {
  if (!el?.dataset) return null;
  const keys = ['act', 'id', 'k', 'v', 'n', 'c', 'i', 'pg', 'in'].filter((k) => el.dataset[k] !== undefined);
  return keys.length ? keys.map((k) => `[data-${k}="${CSS.escape(el.dataset[k])}"]`).join('') : null;
}
function render() {
  const keep = describe(document.activeElement);
  const inLayer = layer.contains(document.activeElement);
  const caret = document.activeElement?.selectionStart;
  $$('[data-act="nav"]', rail).forEach((b) => { if (b.dataset.pg === S.page) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current'); });
  body.dataset.pg = S.page;
  body.innerHTML = PAGE[S.page]();
  banner.innerHTML = !S.online
    ? `<p class="bn off">${ico('i-wifi-off')}<span><b>You’re offline</b>Your changes are saved locally and will sync once you’re back online.</span>${S.pending ? `<em>${S.pending} pending</em>` : ''}</p>`
    : S.syncing ? `<p class="bn sync">${ico('i-refresh')}<span><b>Syncing changes…</b>Uploading ${S.syncing} pending transaction${S.syncing === 1 ? '' : 's'} to the server.</span></p>` : '';
  play.dataset.net = S.online ? 'online' : 'offline';
  netBtn.setAttribute('aria-checked', String(S.online));
  $('.net-label', netBtn).textContent = S.online ? 'Online' : 'Offline';
  $('.callout b').textContent = S.online ? 'Works offline.' : 'You’re offline.';
  $('.callout-text').textContent = S.online ? 'Switch the network off here and keep selling.' : 'Make a sale, then switch the network back on to watch it sync.';
  const group = FEATURES[S.feature].pages;
  subnav.innerHTML = group.length > 1 ? group.map((pg) => `<button type="button" data-act="nav" data-pg="${pg}" aria-pressed="${pg === S.page}">${ico(PAGES[pg].icon)}${PAGES[pg].label}</button>`).join('') : '';
  renderLayer();
  if (keep) {
    const el = $(keep, inLayer ? layer : stage) || $(keep, subnav);
    if (el) {
      el.focus({ preventScroll: true });
      if (caret != null && el.setSelectionRange && el.type !== 'number') try { el.setSelectionRange(caret, caret); } catch { /* not a text field */ }
    }
  }
}

/* ---------------------------------------------------------------- actions */
function setOnline(on) {
  S.online = on;
  clearTimeout(syncTimer);
  if (on) {
    const n = S.pending;
    S.pending = 0;
    S.sales.forEach((s) => { s.synced = true; });
    CUSTOMERS.forEach((c) => c.ledger.forEach((e) => { e.pending = false; }));
    if (n) {
      S.syncing = n;
      syncTimer = setTimeout(() => { S.syncing = 0; render(); toast(`Back online · ${n} change${n === 1 ? '' : 's'} synced`); }, reduced ? 300 : 1600);
    } else toast('Back online');
  } else {
    S.syncing = 0;
    toast('You’re offline. Keep selling: changes are saved on this device.');
  }
  render();
}
const queue = () => { if (!S.online) S.pending += 1; };
const flash = (key) => { S.flash = key; setTimeout(() => { if (S.flash === key) { S.flash = null; } }, 2400); };

function recordSale(method, paid) {
  const lines = S.cart.map((l) => ({ ...l }));
  const sub = linesTotal(lines);
  const disc = discount(sub);
  const total = sub - disc;
  S.receipt += 1;
  const sale = { n: S.receipt, time: clock(), cust: S.customer, lines, sub, disc, total, method, paid, wh: S.wh, synced: S.online };
  lines.forEach((l) => { P(l.id).stock[S.wh] -= units(l); });
  S.sales.push(sale);
  if (S.customer !== 'walkin' && total - paid > 0) {
    C(S.customer).ledger.push({ d: TODAY_LABEL.date, time: sale.time, type: 'Sale', desc: `Sales Invoice #TXN-${sale.n}`, a: total - paid, staff: 'Admin User', fresh: true, pending: !S.online });
  }
  S.cart = [];
  S.disc = { mode: '%', v: '' };
  queue();
  flash('s' + sale.n);
  return sale;
}

const ACT = {
  nav: (b) => {
    const fromMenu = stage.classList.contains('menu-open');
    if (fromMenu) setMenu(false);
    go(b.dataset.pg, { focus: fromMenu || (b.closest('.rail') === null && !b.closest('.subnav')) });
  },
  menu: () => { const open = !stage.classList.contains('menu-open'); setMenu(open); if (!open) menuBtn.focus(); },
  closeapp: () => leaveApp(),
  net: () => setOnline(!S.online),
  later: (b) => later(b.dataset.v || 'This'),
  sample: () => sampleOnly(),
  print: () => toast('Printing is switched off in this sample.'),
  share: () => toast('In the app this opens WhatsApp with the document attached. Sharing is off in this sample.'),
  scan: () => toast('Scanning needs a barcode scanner or camera. Tap a price instead.'),
  refresh: () => { render(); toast('Report refreshed'); },
  // point of sale
  wh: (b) => { S.wh = b.dataset.v; S.cart = []; render(); },
  cat: (b) => { S.cat = b.dataset.v; render(); },
  add: (b) => {
    const { id, k } = b.dataset;
    const line = S.cart.find((l) => l.id === id && l.kind === k);
    if (line) line.qty += 1; else S.cart.push({ id, kind: k, qty: 1 });
    render();
  },
  inc: (b) => { S.cart[Number(b.dataset.i)].qty += 1; render(); },
  dec: (b) => { const l = S.cart[Number(b.dataset.i)]; l.qty -= 1; if (!l.qty) S.cart.splice(Number(b.dataset.i), 1); render(); },
  rm: (b) => { S.cart.splice(Number(b.dataset.i), 1); render(); },
  clear: () => { S.cart = []; render(); },
  dmode: (b) => { S.disc.mode = b.dataset.v; render(); },
  carttog: () => { S.cartOpen = !S.cartOpen; render(); },
  checkout: (b) => {
    const sub = linesTotal(S.cart);
    const due = sub - discount(sub);
    openLayer({ type: 'pay', kind: 'sale', due, cust: S.customer, method: 'cash', amount: fmt(due, 0).replace(/,/g, '') }, b);
  },
  method: (b) => { S.modal.method = b.dataset.v; S.modal.error = ''; S.modal.amount = b.dataset.v === 'cash' ? String(S.modal.due) : ''; renderLayer(); $(`[data-act="method"][data-v="${b.dataset.v}"]`, layer)?.focus(); },
  confirm: () => {
    const m = S.modal;
    const amt = parseFloat(String(m.amount).replace(/,/g, '')) || 0;
    if (m.method === 'cash' && amt < m.due) { m.error = `Enter at least ${money(m.due)}.`; renderLayer(); $('[data-in="m-amount"]', layer)?.focus(); return; }
    if (m.method === 'partial' && (amt <= 0 || amt >= m.due)) { m.error = `Enter an amount between ₦1 and ${money(m.due - 1)}.`; renderLayer(); $('[data-in="m-amount"]', layer)?.focus(); return; }
    const paid = m.method === 'partial' ? amt : m.method === 'credit' ? 0 : m.due;
    if (m.kind === 'sale') {
      const sale = recordSale(m.method, paid);
      S.modal = { type: 'receipt', n: sale.n };
      render();
      requestAnimationFrame(() => $('.m-f .ab.primary', layer)?.focus());
      toast(S.online ? `Sale #${sale.n} recorded · ${naira(sale.total)}` : `Sale #${sale.n} saved on this device. It syncs when you’re back online.`);
    } else if (m.kind === 'repay') {
      const c = C(m.cust);
      c.ledger.push({ d: TODAY_LABEL.date, time: clock(), type: 'Payment', desc: m.method === 'digital' ? 'Bank transfer' : 'Cash payment', a: -paid, staff: 'Admin User', fresh: true, pending: !S.online });
      S.repaymentsToday += paid;
      queue();
      S.modal = null;
      render();
      toast(`${naira(paid)} payment from ${c.name} recorded${S.online ? '' : ' on this device'}`);
    } else if (m.kind === 'invoice') {
      const inv = INVOICES.find((i) => i.n === m.n);
      inv.payments.push({ d: TODAY_LABEL.date, m: m.method === 'digital' ? 'digital' : 'cash', a: paid });
      S.invoicePaymentsToday += paid;
      S.invOpen = inv.n;
      queue();
      S.modal = null;
      render();
      toast(`${naira(paid)} recorded against INV-0${inv.n}`);
    }
  },
  close: () => closeLayer(),
  receipt: (b) => { const n = Number(b.dataset.n); if (!n) { toast('Receipts for sales made before today’s demo are in the full app.'); return; } openLayer({ type: 'receipt', n }, b); },
  // inventory
  cur: (b) => { S.currency = b.dataset.v; render(); },
  invcat: (b) => { S.invCat = b.dataset.v; render(); },
  dashcur: (b) => { S.dashCur = b.dataset.v; render(); },
  // customers & money record
  custf: (b) => { S.custFilter = b.dataset.v; render(); },
  record: (b) => { S.moneyCust = b.dataset.c; go('money'); },
  view: (b) => { S.moneyCust = b.dataset.c; render(); $('.panel-h', body)?.scrollIntoView({ block: 'start', behavior: reduced ? 'auto' : 'smooth' }); },
  repay: (b) => { if (!b.dataset.c) return; const due = balance(C(b.dataset.c)); openLayer({ type: 'pay', kind: 'repay', cust: b.dataset.c, due, method: 'cash', amount: String(due) }, b); },
  // quotations & invoices
  quof: (b) => { S.quoFilter = b.dataset.v; render(); },
  quoopen: (b) => { const n = Number(b.dataset.n); S.quoOpen = S.quoOpen === n ? null : n; render(); },
  accept: (b) => { const q = QUOTES.find((x) => x.n === Number(b.dataset.n)); q.status = 'Accepted'; queue(); render(); $(`[data-act="convert"][data-n="${q.n}"]`, body)?.focus(); toast(`QUO-00${q.n} marked as accepted`); },
  cancelq: (b) => { const q = QUOTES.find((x) => x.n === Number(b.dataset.n)); q.status = 'Cancelled'; queue(); render(); toast(`QUO-00${q.n} cancelled`); },
  convert: (b) => {
    const q = QUOTES.find((x) => x.n === Number(b.dataset.n));
    const n = Math.max(...INVOICES.map((i) => i.n)) + 1;
    INVOICES.unshift({ n, cust: q.cust, quote: q.n, fulfil: 'Confirmed', lines: q.lines.map((l) => ({ ...l })), payments: [] });
    q.status = 'Converted';
    q.inv = n;
    queue();
    S.invFulfil = 'All'; S.invPay = 'All'; S.invOpen = n;
    flash('i' + n);
    toast(`QUO-00${q.n} converted to INV-0${n}`);
    go('invoices');
  },
  openinv: (b) => { S.invOpen = Number(b.dataset.n); S.invFulfil = 'All'; S.invPay = 'All'; go('invoices'); },
  newquote: (b) => openLayer({ type: 'quote', cust: 'tunde', lines: [{ id: 'noodles', kind: 'ctn', qty: 2 }], disc: { mode: '%', v: '' } }, b),
  'q-add': () => { S.modal.lines.push({ id: 'milk', kind: 'unit', qty: 1 }); renderLayer(); $$('[data-in="q-prod"]', layer).pop()?.focus(); },
  'q-rm': (b) => { S.modal.lines.splice(Number(b.dataset.i), 1); renderLayer(); },
  'q-dmode': (b) => { S.modal.disc.mode = b.dataset.v; renderLayer(); },
  'q-create': () => {
    const m = S.modal;
    if (m.lines.some((l) => !(l.qty > 0))) { m.error = 'Enter a quantity of 1 or more for every item.'; renderLayer(); return; }
    const n = Math.max(...QUOTES.map((q) => q.n)) + 1;
    QUOTES.unshift({ n, cust: m.cust, status: 'Draft', issued: TODAY_LABEL.iso, expires: '2026-11-03', lines: m.lines.map((l) => ({ ...l })) });
    S.quoFilter = 'All';
    S.quoOpen = n;
    queue();
    flash('q' + n);
    S.modal = null;
    render();
    toast(`Draft QUO-00${n} created`);
  },
  invf: (b) => { S.invFulfil = b.dataset.v; render(); },
  invp: (b) => { S.invPay = b.dataset.v === 'All Payments' ? 'All' : b.dataset.v; render(); },
  invopen: (b) => { const n = Number(b.dataset.n); S.invOpen = S.invOpen === n ? null : n; render(); },
  fulfil: (b) => {
    const inv = INVOICES.find((i) => i.n === Number(b.dataset.n));
    const short = inv.lines.find((l) => totalStock(P(l.id)) < units(l));
    if (short) { toast(`Not enough ${P(short.id).name} in stock to deliver this invoice.`); return; }
    inv.lines.forEach((l) => {
      let need = units(l);
      ['primary', 'secondary'].forEach((w) => { const take = Math.min(need, P(l.id).stock[w]); P(l.id).stock[w] -= take; need -= take; });
    });
    inv.fulfil = 'Fulfilled';
    queue();
    render();
    $(`[data-act="invpay"][data-n="${inv.n}"]`, body)?.focus();
    toast(`INV-0${inv.n} delivered. Stock updated.`);
  },
  invpay: (b) => { const inv = INVOICES.find((i) => i.n === Number(b.dataset.n)); openLayer({ type: 'pay', kind: 'invoice', n: inv.n, due: invOut(inv), method: 'cash', amount: String(invOut(inv)) }, b); },
  // reports
  range: (b) => { S.range = b.dataset.v === 'Today' ? 'today' : 'week'; render(); },
  // Joryka AI
  attn: () => { S.attnAll = !S.attnAll; render(); },
  panel: (b) => openLayer({ type: 'panel', key: b.dataset.v }, b),
  ask: (b) => ask(b.dataset.v, SUGGEST.find((x) => x[0] === b.dataset.v)[1]),
  newchat: () => { S.chat = []; S.busy = false; render(); },
};
function ask(key, q) {
  if (!S.online) return;
  if (S.left <= 0) { toast('No questions left today in this sample.'); return; }
  S.left -= 1;
  S.chat.push({ q, key });
  S.busy = !reduced && Boolean(key);
  render();
  const box = $('.ask', body);
  // the window is drawn at a reduced scale, so screen distances are divided back into the page's own pixels
  const scale = body.getBoundingClientRect().height / body.offsetHeight || 1;
  if (box && body.scrollHeight > body.clientHeight + 4) body.scrollTop += (box.getBoundingClientRect().top - body.getBoundingClientRect().top) / scale - 12;
  else box?.scrollIntoView({ block: 'nearest', behavior: reduced ? 'auto' : 'smooth' });
  clearTimeout(busyTimer);
  if (S.busy) busyTimer = setTimeout(() => { S.busy = false; render(); }, 650);
}

stage.addEventListener('click', (e) => {
  const b = e.target.closest('[data-act]');
  if (!b || b.disabled || !stage.contains(b)) return;
  ACT[b.dataset.act]?.(b);
});
$('.callout').addEventListener('click', (e) => { openApp(e.currentTarget); setOnline(!S.online); });
netBtn.addEventListener('click', () => setOnline(!S.online));
stage.addEventListener('input', (e) => {
  const t = e.target;
  const k = t.dataset.in;
  if (!k) return;
  const v = t.value;
  const m = S.modal;
  if (k === 'q') { S.q = v; render(); }
  else if (k === 'invq') { S.invQ = v; render(); }
  else if (k === 'custq') { S.custQ = v; render(); }
  else if (k === 'disc') { S.disc.v = v.replace(/[^\d.]/g, ''); render(); }
  else if (k === 'm-amount') { m.amount = v.replace(/[^\d.]/g, ''); m.error = ''; renderLayer(); const el = $('[data-in="m-amount"]', layer); el.focus(); el.setSelectionRange(el.value.length, el.value.length); }
  else if (k === 'q-qty') { m.lines[Number(t.dataset.i)].qty = Math.max(0, parseInt(v, 10) || 0); m.error = ''; renderLayer(); const el = $(`[data-in="q-qty"][data-i="${t.dataset.i}"]`, layer); el.focus(); el.setSelectionRange(el.value.length, el.value.length); }
  else if (k === 'q-disc') { m.disc.v = v.replace(/[^\d.]/g, ''); renderLayer(); const el = $('[data-in="q-disc"]', layer); el.focus(); el.setSelectionRange(el.value.length, el.value.length); }
});
stage.addEventListener('change', (e) => {
  const t = e.target;
  const k = t.dataset.in;
  const m = S.modal;
  if (k === 'customer') { S.customer = t.value; render(); }
  else if (k === 'moneyc') { S.moneyCust = t.value; render(); }
  else if (k === 'q-cust') { m.cust = t.value; }
  else if (k === 'q-prod') { m.lines[Number(t.dataset.i)].id = t.value; renderLayer(); $(`[data-in="q-prod"][data-i="${t.dataset.i}"]`, layer)?.focus(); }
  else if (k === 'q-kind') { m.lines[Number(t.dataset.i)].kind = t.value; renderLayer(); $(`[data-in="q-kind"][data-i="${t.dataset.i}"]`, layer)?.focus(); }
});
stage.addEventListener('submit', (e) => {
  if (e.target.dataset.form !== 'ask') return;
  e.preventDefault();
  const ta = $('#ask-q', stage);
  const q = ta.value.trim();
  if (!q) return;
  ask(matchQuestion(q), q);
  $('#ask-q', stage)?.focus();
});
stage.addEventListener('keydown', (e) => {
  if (e.target.id === 'ask-q' && e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); e.target.form.requestSubmit(); }
});

render();
addEventListener('load', drawWire);
requestAnimationFrame(drawWire);

/* ---------------------------------------------------------------- notifications (demo form) */
// Dashboard-style toast, top-right under the header. Separate from the playground's toast() above.
// Not a live region: the form's .form-status reads the result aloud, so this is a visual extra.
// Closes by itself (the timer pauses on hover, while the ✕ has focus and while the tab is hidden),
// with the ✕ or with Escape. A new notice replaces the old one. Never moves focus into itself.
const NOTICE_ICONS = { ok: 'i-check', error: 'i-alert', warning: 'i-alert', info: 'i-info' };
let closeNotice = null;
function notify(type, text, { duration = 4000, returnFocus = null } = {}) {
  const host = $('.notices');
  if (!host) return;
  closeNotice?.({ instant: true });
  const el = document.createElement('div');
  el.className = `notice is-${type}`;
  el.innerHTML = `${ico(NOTICE_ICONS[type] || 'i-info')}<p></p><button type="button" class="notice-x" aria-label="Close notification">${ico('i-x')}</button>`;
  $('p', el).textContent = text;
  host.append(el);

  const listeners = new AbortController();
  const holds = new Set();
  let remaining = duration, startedAt = 0, timer = 0, closed = false;
  const run = () => {
    if (closed || timer || holds.size) return;
    startedAt = Date.now();
    timer = setTimeout(() => close(), remaining);
  };
  const pause = () => {
    if (!timer) return;
    clearTimeout(timer);
    timer = 0;
    remaining = Math.max(0, remaining - (Date.now() - startedAt));
  };
  const hold = (why, on) => { if (on) { holds.add(why); pause(); } else { holds.delete(why); run(); } };
  function close({ instant = false } = {}) {
    if (closed) return;
    closed = true;
    clearTimeout(timer);
    listeners.abort();
    if (closeNotice === close) closeNotice = null;
    // Closing from the ✕ or Escape: don't leave keyboard focus on a removed element.
    if (el.contains(document.activeElement)) returnFocus ? returnFocus.focus({ preventScroll: true }) : document.activeElement.blur();
    if (instant || reduced) { el.remove(); return; }
    el.classList.add('out');
    setTimeout(() => el.remove(), 180);
  }
  closeNotice = close;

  const opts = { signal: listeners.signal };
  $('.notice-x', el).addEventListener('click', () => close(), opts);
  el.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); }, opts);
  el.addEventListener('pointerenter', () => hold('hover', true), opts);
  el.addEventListener('pointerleave', () => hold('hover', false), opts);
  el.addEventListener('focusin', () => hold('focus', true), opts);
  el.addEventListener('focusout', (e) => { if (!el.contains(e.relatedTarget)) hold('focus', false); }, opts);
  document.addEventListener('visibilitychange', () => hold('hidden', document.hidden), opts);
  if (document.hidden) holds.add('hidden');
  run();
}

/* ---------------------------------------------------------------- demo request form */
const form = $('#demo-form');
const status = $('.form-status', form);
const submit = $('.submit', form);
// The inline message under the button: the screen-reader announcement (role="status") and the
// lasting record of the result. kind: 'ok' (green), 'error' (red) or '' (plain).
function setStatus(kind, text, html = false) {
  status.classList.toggle('is-ok', kind === 'ok');
  status.classList.toggle('is-error', kind === 'error');
  if (html) status.innerHTML = text; else status.textContent = text;
}
// Same rules as the backend's normalizeContact (joryka-backend/src/services/demoRequest/contact.js),
// so the form never sends a contact the server will reject. Keep the two IDENTICAL.
// Deliberately lenient (we don't want to lose leads). Valid: an email; or a phone made of digits,
// spaces, - . ( ) with an optional leading +, with 7–15 digits — after dropping a leading 00, and
// with an 11-digit local number starting with 0 counted as 234…. Letters → invalid.
function isValidContact(raw) {
  const value = raw.trim();
  if (!value) return false;
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return true;
  if (!/^\+?[\d\s\-.()]+$/.test(value)) return false;
  let digits = value.replace(/\D/g, '');
  if (!value.startsWith('+')) {
    if (digits.startsWith('00')) digits = digits.slice(2);
    else if (digits.length === 11 && digits.startsWith('0')) digits = `234${digits.slice(1)}`;
    // 13 digits starting with 234 = Nigerian number without "+" (international on the backend;
    // kept here so both copies of the rule stay identical — it doesn't change validity).
    else if (digits.length === 13 && digits.startsWith('234')) digits = digits.slice(0);
  }
  return digits.length >= 7 && digits.length <= 15;
}
const rules = [
  ['f-name', 'e-name', (v) => v.trim().length >= 2],
  ['f-biz', 'e-biz', (v) => v.trim().length >= 2],
  ['f-contact', 'e-contact', isValidContact],
];
// Backend field name → [input id, error id], for showing a 400's field errors in place.
const SERVER_FIELDS = {
  name: ['f-name', 'e-name'],
  business: ['f-biz', 'e-biz'],
  contact: ['f-contact', 'e-contact'],
  message: ['f-msg', 'e-msg'],
};
// Remember each error's own text, so a server message never sticks around.
Object.values(SERVER_FIELDS).forEach(([, errId]) => {
  const err = document.getElementById(errId);
  err.dataset.text = err.textContent;
});
function setFieldError(id, errId, message) {
  const input = document.getElementById(id);
  const err = document.getElementById(errId);
  const bad = message !== null;
  input.setAttribute('aria-invalid', String(bad));
  if (bad) input.setAttribute('aria-describedby', errId); else input.removeAttribute('aria-describedby');
  if (bad) err.textContent = message;
  err.hidden = !bad;
}
function check(id, errId, ok) {
  const good = ok(document.getElementById(id).value);
  setFieldError(id, errId, good ? null : document.getElementById(errId).dataset.text);
  return good;
}
// Pressing the mouse on "Request a Demo" takes focus from the field first. Re-checking the field
// right then would show or hide its error, move the button, and the release would miss it (the
// click is lost). So while the button is pressed, wait: the submit checks every field anyway, and
// the waiting check runs just after the release (also when the visitor drags off and lets go).
let pressingSubmit = false, waitingCheck = null;
submit.addEventListener('pointerdown', (e) => { if (e.button === 0) pressingSubmit = true; });
const releaseSubmit = () => {
  if (!pressingSubmit) return;
  // setTimeout: after this release's click (and so the submit) has run.
  setTimeout(() => { pressingSubmit = false; const run = waitingCheck; waitingCheck = null; run?.(); });
};
addEventListener('pointerup', releaseSubmit);
addEventListener('pointercancel', releaseSubmit);
rules.forEach(([id, errId, ok]) => document.getElementById(id).addEventListener('blur', (e) => {
  if (!e.target.value) return;
  if (pressingSubmit) { waitingCheck = () => check(id, errId, ok); return; }
  check(id, errId, ok);
}));
// The message has no browser-side rule; clear a server error on it as soon as it's edited.
document.getElementById('f-msg').addEventListener('input', () => setFieldError('f-msg', 'e-msg', null));
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const results = rules.map((r) => check(...r));
  if (results.includes(false)) {
    document.getElementById(rules[results.indexOf(false)][0]).focus();
    setStatus('error', 'Check the highlighted field and try again.');
    return;
  }
  const data = Object.fromEntries(new FormData(form));
  if (!CONFIG.demoEndpoint) {
    setStatus('', 'Preview only: demo requests are not connected yet, so nothing was sent.');
    return;
  }
  // Clear the previous result, so the same message is announced again if it repeats.
  setStatus('', '');
  submit.disabled = true;
  submit.textContent = 'Sending…';
  // Give up after 15 seconds so a slow server shows the error message instead of "Sending…" forever.
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const res = await fetch(CONFIG.demoEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...data, source_page: location.pathname, created_at: new Date().toISOString() }), signal: controller.signal });
    // 400 with field errors → show each one under its field (first message per field) and keep
    // what the visitor typed. Anything else that isn't OK falls through to the generic error.
    if (res.status === 400) {
      const body = await res.json().catch(() => null);
      const fieldErrors = (Array.isArray(body?.errors) ? body.errors : [])
        .filter((er) => SERVER_FIELDS[er.path ?? er.param] && typeof er.msg === 'string' && er.msg.trim())
        // Backend messages have no full stop; add one so they read like the form's own errors.
        .map((er) => ({ field: er.path ?? er.param, msg: /[.!?]$/.test(er.msg.trim()) ? er.msg.trim() : `${er.msg.trim()}.` }));
      if (fieldErrors.length) {
        const shown = new Set();
        fieldErrors.forEach(({ field, msg }) => {
          if (shown.has(field)) return;
          shown.add(field);
          setFieldError(...SERVER_FIELDS[field], msg);
        });
        document.getElementById(SERVER_FIELDS[fieldErrors[0].field][0]).focus();
        setStatus('error', 'Check the highlighted field and try again.');
        window.dataLayer?.push({ event: 'demo_form_submit_error', error_category: 'validation' });
        return;
      }
    }
    if (!res.ok) throw new Error(res.status);
    form.reset();
    setStatus('ok', 'Thank you. Your demo request has been sent.');
    notify('ok', 'Thank you. Your demo request has been sent.', { duration: 4000, returnFocus: submit });
    window.dataLayer?.push({ event: 'demo_form_submit_success' });
  } catch {
    setStatus('error', 'We couldn’t send your request. Please try again' + (CONFIG.whatsappNumber ? ` or <a href="https://wa.me/${CONFIG.whatsappNumber}">contact us on WhatsApp</a>.` : '.'), true);
    // No link in the toast: it disappears, so the WhatsApp link stays in the inline message.
    notify('error', 'We couldn’t send your request. Please try again.', { duration: 8000, returnFocus: submit });
    window.dataLayer?.push({ event: 'demo_form_submit_error', error_category: 'network' });
  } finally {
    clearTimeout(timeout);
    submit.disabled = false;
    submit.textContent = 'Request a Demo';
  }
});

/* ---------------------------------------------------------------- offline story */
// The cart in "How offline works" rings up a sale with no signal, then syncs when the signal returns.
(function offlineStory() {
  const scene = $('.o-scene');
  if (!scene || reduced || !('IntersectionObserver' in window)) return;
  const cart = $('.o-cart', scene), net = $('.o-net', scene), banner = $('.o-banner', cart);
  const lines = $$('.o-line', cart), totals = [5600, 3250, 900];
  let timer = 0, step = 0;
  const show = (n, state) => {
    lines.forEach((l, i) => { l.hidden = i >= n; l.classList.toggle('new', i === n - 1 && state === 'offline'); });
    const total = naira(sum(totals.slice(0, n), (x) => x));
    $('.o-count', cart).textContent = n;
    $('.o-subv', cart).textContent = total;
    $('.o-totv', cart).textContent = total;
    cart.dataset.net = state;
    $('use', banner).setAttribute('href', state === 'sync' ? '#i-refresh' : '#i-wifi-off');
    $('b', banner).textContent = state === 'sync' ? 'Syncing changes…' : 'You’re offline';
    $('i', banner).textContent = state === 'sync' ? `Uploading ${n} pending transactions to the server.` : 'Your changes are saved locally and will sync once you’re back online.';
    $('em', banner).textContent = state === 'offline' && n ? `${n} pending` : '';
    net.classList.toggle('on', state !== 'offline');
    $('use', net).setAttribute('href', state === 'offline' ? '#i-wifi-off' : '#i-wifi');
    $('b', net).textContent = state === 'offline' ? 'Offline' : 'Online';
  };
  // offline, add three lines, back online and sync, settle, start again
  const script = [[0, 'offline', 1200], [1, 'offline', 1300], [2, 'offline', 1300], [3, 'offline', 2200], [3, 'sync', 2000], [3, 'online', 2600]];
  const tick = () => { const [n, state, wait] = script[step]; show(n, state); step = (step + 1) % script.length; timer = setTimeout(tick, wait); };
  new IntersectionObserver(([e]) => {
    clearTimeout(timer);
    if (e.isIntersecting) { step = 0; tick(); } else show(3, 'offline');
  }, { threshold: 0.35 }).observe(scene);
})();

/* ---------------------------------------------------------------- tour video */
(function tour() {
  const frame = $('.tour-frame');
  if (!frame) return;
  const video = $('video', frame), btn = $('.tour-play', frame);
  btn.hidden = false;
  video.controls = false; // the play button stands in for them until the tour starts
  btn.addEventListener('click', () => { video.play(); video.focus(); });
  video.addEventListener('play', () => { frame.classList.add('playing'); video.controls = true; });
  video.addEventListener('ended', () => { frame.classList.remove('playing'); btn.focus(); });
})();
