'use strict';

// No backend, build tools, or framework runtime. All business data lives in this browser.
const STORAGE_KEY = 'titik-temu-pos:v1';
const TAX_RATE = 0.10; // Demo assumption, not tax advice or a production tax configuration.
const CATEGORIES = ['Semua menu', 'Kopi', 'Non-kopi', 'Bakery', 'Makanan'];
const ART_TYPES = ['iced', 'latte', 'americano', 'matcha', 'chocolate', 'croissant', 'roll', 'cake', 'toast', 'donut'];
const PATHS = {
  dashboard: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  pos: '<rect x="3" y="3" width="18" height="12" rx="2"/><path d="M8 21h8m-4-6v6M7 7h4m-4 4h7m3-4h.01"/>',
  cup: '<path d="M4 8h13v7a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5zM17 9h2a3 3 0 1 1 0 6h-2M7 2v2m4-2v2m4-2v2"/>',
  receipt: '<path d="M5 3l2 1 2-1 3 1 3-1 2 1 2-1v18l-2-1-2 1-3-1-3 1-2-1-2 1zM9 8h6m-6 4h6m-6 4h3"/>',
  store: '<path d="M3 10l2-7h14l2 7M4 11v10h16V11M9 21v-7h6v7M3 10a3 3 0 0 0 5 2 3 3 0 0 0 4 0 3 3 0 0 0 4 0 3 3 0 0 0 5-2zM9 3l-1 7m7-7 1 7"/>',
  sparkles: '<path d="M12 3l2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5zM20 2v4m-2-2h4"/>',
  search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="M16 16l5 5"/>',
  plus: '<path d="M12 5v14M5 12h14"/>', minus: '<path d="M5 12h14"/>',
  arrow: '<path d="M4 12h16m-6-6 6 6-6 6"/>', chevron: '<path d="M9 5l7 7-7 7"/>',
  bag: '<path d="M5 7h14l1 14H4zM8 8V6a4 4 0 0 1 8 0v2"/>',
  utensils: '<path d="M5 3v6a3 3 0 0 0 6 0V3M8 3v18m11 0V3c-4 3-4 10 0 10"/>',
  bread: '<path d="M5 19v-8a4 4 0 0 1-2-3c0-3 4-5 9-5s9 2 9 5a4 4 0 0 1-2 3v8a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2zM8 9l2-2m2 3 2-2m2 3 2-2"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/>',
  leaf: '<path d="M20 3C8 1 1 9 5 16s17 5 15-13zM5 20L16 8m-8 9v-6m3 3h6"/>',
  star: '<path d="M12 3l2.8 5.8 6.4.9-4.6 4.5 1.1 6.3-5.7-3-5.7 3 1.1-6.3L2.8 9.7l6.4-.9z"/>',
  lock: '<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3m-4 5v2"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 11h18m-13 5h2m4 0h2"/>',
  edit: '<path d="M15 5l4 4M4 20l5-1L21 7a2.8 2.8 0 0 0-4-4L5 15z"/>',
  trash: '<path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7m4-7v7"/>',
  download: '<path d="M12 3v12m-5-5 5 5 5-5M4 17v4h16v-4"/>',
  eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  check: '<path d="M5 12l4 4L19 6"/>', close: '<path d="M6 6l12 12M6 18L18 6"/>',
  wallet: '<rect x="3" y="5" width="18" height="15" rx="2"/><path d="M3 8V5l14-3v3m4 6h-6v5h6m-3-2.5h.01"/>',
  cash: '<rect x="2" y="5" width="20" height="14" rx="2"/><circle cx="12" cy="12" r="3"/><path d="M6 12h.01M18 12h.01"/>',
  qr: '<path d="M3 3h6v6H3zm12 0h6v6h-6zM3 15h6v6H3zm12 0h3v3h3v3h-6zm-3-3h3m6 0v3M12 3v3m0 12v3M3 12h3"/>',
  card: '<rect x="2" y="4" width="20" height="16" rx="3"/><path d="M2 9h20M6 15h4"/>',
  print: '<path d="M7 8V3h10v5M7 17H3V8h18v9h-4M7 13h10v8H7zm10-2h.01"/>',
  box: '<path d="M3 7l9-5 9 5v10l-9 5-9-5zM3 7l9 5 9-5m-9 5v10M7 5l10 5"/>',
  trend: '<path d="M3 17l6-6 4 4 8-11m-7 0h7v7"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
};
function icon(name) { return `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${PATHS[name] || PATHS.cup}</svg>`; }
document.querySelectorAll('[data-icon]').forEach(el => { el.innerHTML = icon(el.dataset.icon); });
const money = value => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);
const number = value => new Intl.NumberFormat('id-ID').format(value);
const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const dateTime = value => new Date(value).toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
const localDay = value => { const d = new Date(value); return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`; };
const uid = prefix => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

// Original vector menu illustrations, embedded locally so the demo also works offline.
function art(type = 'latte') {
  const palette = { iced: '#e7ddcc', latte: '#e4d9c8', americano: '#d8dfd5', matcha: '#dce2ca', chocolate: '#e4d7ce', croissant: '#e9dfcc', roll: '#e5d8c9', cake: '#e2dfd1', toast: '#dedfcf', donut: '#e8d8d2' };
  let shape = '';
  if (['iced', 'matcha', 'chocolate'].includes(type)) {
    const dark = { iced: '#815337', matcha: '#80935a', chocolate: '#6b4537' }[type];
    const light = { iced: '#c69d70', matcha: '#b4c18c', chocolate: '#a77e62' }[type];
    shape = `<ellipse cx="133" cy="134" rx="47" ry="10" fill="#493c2b" opacity=".10"/><path d="M101 36h65l-8 89q-22 15-49 0z" fill="#f8f2e5" stroke="#faf7ed" stroke-width="2"/><path d="M103 57h61l-6 65q-23 13-49 0z" fill="${light}"/><path d="M103 55q30-9 61 0l-3 31q-27-12-55 1z" fill="${dark}"/><path d="M108 90q27-9 52 0l-3 30q-22 13-46 0z" fill="${type === 'matcha' ? '#cbd2ae' : '#dfbd90'}" opacity=".85"/><ellipse cx="133" cy="54" rx="30" ry="7" fill="${dark}"/><g fill="#fff7e7" opacity=".6"><rect x="112" y="50" width="14" height="13" rx="3" transform="rotate(12 119 56)"/><rect x="135" y="50" width="15" height="15" rx="3" transform="rotate(-19 142 57)"/><rect x="127" y="66" width="13" height="12" rx="3" transform="rotate(14 133 72)"/></g><path d="M145 16l-9 60" stroke="${type === 'matcha' ? '#425d3b' : '#85654d'}" stroke-width="5" stroke-linecap="round"/><ellipse cx="133" cy="35" rx="33" ry="7" fill="none" stroke="#faf7ed" stroke-width="2"/><path d="M111 45l5 72" stroke="white" opacity=".4" stroke-width="3" stroke-linecap="round"/><g fill="#fff" opacity=".3"><circle cx="151" cy="79" r="2"/><circle cx="115" cy="91" r="1.5"/><circle cx="151" cy="105" r="2"/></g>`;
  } else if (['latte', 'americano'].includes(type)) {
    shape = `<ellipse cx="132" cy="128" rx="68" ry="15" fill="#b6a58b" opacity=".3"/><ellipse cx="130" cy="120" rx="65" ry="18" fill="#f6f1e5"/><ellipse cx="130" cy="118" rx="48" ry="12" fill="#e5ddca"/><path d="M168 65h10q25 0 19 22-5 14-29 11" fill="none" stroke="#fcf6e8" stroke-width="10"/><path d="M84 58h89l-7 44q-35 26-74 0z" fill="${type === 'latte' ? '#faf4e6' : '#547060'}"/><path d="M93 74l5 26" stroke="#fff" stroke-width="3" opacity=".3" stroke-linecap="round"/><ellipse cx="128" cy="58" rx="45" ry="17" fill="#fffbef"/><ellipse cx="128" cy="58" rx="38" ry="13" fill="${type === 'latte' ? '#b78656' : '#3f2c24'}"/>${type === 'latte' ? '<path d="M128 67q-31-15-16-17 8-1 16 9 10-13 18-9 12 5-18 17z" fill="#f7e6ca"/><path d="M128 66q-19-9-15-12m15 12q20-10 16-12" fill="none" stroke="#bd8e60" stroke-width="1.3"/>' : '<ellipse cx="120" cy="54" rx="21" ry="6" fill="#71523a" opacity=".4"/>'}<path d="M115 32q-9-9 1-18m20 18q-8-8 1-17" fill="none" stroke="#fff9ed" stroke-width="2.5" opacity=".6" stroke-linecap="round"/>`;
  } else if (type === 'croissant') {
    shape = '<ellipse cx="130" cy="126" rx="77" ry="16" fill="#a58a59" opacity=".17"/><ellipse cx="130" cy="115" rx="80" ry="21" fill="#f8f1df"/><path d="M61 108q-10-34 17-43 7-31 33-21 24-22 44 1 29-4 33 23 28 10 13 39l-25-15q-7-21-18-13-25-18-49 0-16-5-24 20z" fill="#bf7c39"/><path d="M61 106q-5-26 19-37l6 28-19 17z" fill="#dca454"/><path d="M79 67q10-28 30-20l5 34-25 16z" fill="#e4b262"/><path d="M108 47q23-18 44 0l-2 33-36 1z" fill="#edbd72"/><path d="M152 48q27-4 32 22l-12 24-21-14z" fill="#dfa854"/><path d="M185 69q23 7 14 34l-21-8z" fill="#d49a49"/><g fill="none" stroke="#f4d18a" stroke-width="2" opacity=".7"><path d="M90 58l9 26m24-32 2 22m13-23-2 21m29-13-5 23m32 0-7 9"/></g><g fill="#fff0c2" opacity=".7"><circle cx="124" cy="48" r="1.5"/><circle cx="141" cy="64" r="1"/><circle cx="98" cy="65" r="1.5"/><circle cx="176" cy="76" r="1.5"/></g>';
  } else if (type === 'roll' || type === 'donut') {
    shape = `<ellipse cx="130" cy="128" rx="66" ry="13" fill="#8f6d49" opacity=".15"/><ellipse cx="130" cy="117" rx="77" ry="21" fill="#f8f0e0"/><ellipse cx="130" cy="91" rx="55" ry="34" fill="#ab6e3b"/><ellipse cx="130" cy="81" rx="55" ry="34" fill="${type === 'donut' ? '#ac715f' : '#d9a260'}"/>${type === 'roll' ? '<path d="M127 81q7-12 17-4t-5 18q-30 12-41-7t22-26q33-5 45 15" fill="none" stroke="#8f582e" stroke-width="5" stroke-linecap="round"/><path d="M95 64l18 46m4-58 17 61m7-61 16 50m5-42 9 30" stroke="#f9e9ca" stroke-width="5" opacity=".85" stroke-linecap="round"/>' : '<ellipse cx="130" cy="79" rx="15" ry="9" fill="#d9bc96"/><ellipse cx="130" cy="81" rx="11" ry="6" fill="#8b583e"/><g stroke="#f4d3a3" stroke-width="3" stroke-linecap="round"><path d="M97 69l4 2m13-14 3 4m26-3-1 4m18 6-3 2m-53 18 4-1m16 13 1-4m27-7 3 2m-18 13 4-1"/></g>'}`;
  } else if (type === 'cake') {
    shape = '<ellipse cx="130" cy="126" rx="70" ry="16" fill="#ac9a79" opacity=".18"/><ellipse cx="130" cy="119" rx="78" ry="21" fill="#f8f2e4"/><path d="M87 83l73-44 23 66-74 27z" fill="#c5995f"/><path d="M87 68l73-40 23 66-74 27z" fill="#f2dfb1"/><path d="M87 68l73-40 23 18-74 44z" fill="#b57841"/><path d="M109 90v28m8-32 3 25m7-30 3 24" stroke="#fff0c9" stroke-width="2" opacity=".5"/><path d="M149 49q-7-19 5-22 12-1 7 20" fill="#faf4df"/><path d="M148 32q5-20 18-10 2 11-15 15" fill="#ad5142"/><path d="M158 23l4-7" stroke="#6c8050" stroke-width="3" stroke-linecap="round"/>';
  } else {
    shape = '<ellipse cx="131" cy="128" rx="75" ry="14" fill="#8f7f59" opacity=".16"/><ellipse cx="130" cy="115" rx="82" ry="24" fill="#f7f1e0"/><path d="M63 98l80-49 57 43-80 43z" fill="#b5793c"/><path d="M64 88l80-48 55 42-79 44z" fill="#e6bf7a"/><path d="M73 89l70-39 45 33-68 34z" fill="#f1d99e"/><path d="M84 83q6-14 24-7 1-22 24-12 11-14 24 1 24 0 19 23l-51 23z" fill="#7c9454"/><g fill="#a6b776"><ellipse cx="109" cy="86" rx="15" ry="8" transform="rotate(-27 109 86)"/><ellipse cx="140" cy="79" rx="15" ry="9" transform="rotate(-27 140 79)"/><ellipse cx="147" cy="91" rx="14" ry="7" transform="rotate(-25 147 91)"/></g><ellipse cx="127" cy="82" rx="24" ry="18" fill="#fcf2d4" transform="rotate(-22 127 82)"/><ellipse cx="130" cy="81" rx="11" ry="10" fill="#e3ad4c"/><g fill="#434c2e"><circle cx="99" cy="89" r="1"/><circle cx="143" cy="76" r="1"/><circle cx="125" cy="102" r="1"/><circle cx="155" cy="88" r="1"/></g>';
  }
  return `<svg viewBox="0 0 260 160" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect width="260" height="160" fill="${palette[type] || palette.latte}"/><circle cx="233" cy="15" r="100" fill="#fff" opacity=".10"/><path d="M0 135Q120 110 260 141v19H0" fill="#a08d6b" opacity=".05"/>${shape}</svg>`;
}

function calculate(items, discount = 0) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const discountAmount = Math.round(subtotal * discount / 100);
  const tax = Math.round((subtotal - discountAmount) * TAX_RATE);
  return { subtotal, discountAmount, tax, total: subtotal - discountAmount + tax };
}
function seedState() {
  const products = [
    { id: 'p1', name: 'Kopi Susu Temu', category: 'Kopi', description: 'Espresso, susu & gula aren', price: 28000, stock: 40, art: 'iced', popular: true },
    { id: 'p2', name: 'Caffè Latte', category: 'Kopi', description: 'Espresso lembut, steamed milk', price: 32000, stock: 32, art: 'latte', popular: false },
    { id: 'p3', name: 'Butter Croissant', category: 'Bakery', description: 'Flaky, buttery, freshly baked', price: 25000, stock: 18, art: 'croissant', popular: true },
    { id: 'p4', name: 'Iced Matcha Latte', category: 'Non-kopi', description: 'Uji matcha & fresh milk', price: 35000, stock: 24, art: 'matcha', popular: true },
    { id: 'p5', name: 'Long Black', category: 'Kopi', description: 'Double espresso & hot water', price: 24000, stock: 35, art: 'americano', popular: false },
    { id: 'p6', name: 'Cinnamon Roll', category: 'Bakery', description: 'Kayu manis & vanilla glaze', price: 28000, stock: 8, art: 'roll', popular: false },
    { id: 'p7', name: 'Iced Chocolate', category: 'Non-kopi', description: 'Belgian cocoa, creamy milk', price: 32000, stock: 20, art: 'chocolate', popular: false },
    { id: 'p8', name: 'Basque Cheesecake', category: 'Bakery', description: 'Caramelized top, soft center', price: 38000, stock: 6, art: 'cake', popular: false },
    { id: 'p9', name: 'Avocado Egg Toast', category: 'Makanan', description: 'Sourdough, alpukat & telur', price: 45000, stock: 12, art: 'toast', popular: false },
    { id: 'p10', name: 'Chocolate Donut', category: 'Bakery', description: 'Soft dough, chocolate glaze', price: 18000, stock: 15, art: 'donut', popular: false },
  ];
  const transactions = [];
  const customers = ['Alya', 'Dimas', 'Nadia', 'Walk-in', 'Bagas', 'Sinta'];
  // Historical stock is already reflected in the initial inventory above.
  for (let day = 6; day >= 0; day--) {
    const count = day === 0 ? 6 : [5, 8, 6, 9, 7, 10][day - 1];
    for (let j = 0; j < count; j++) {
      const when = new Date(); when.setDate(when.getDate() - day); when.setHours(8 + j, 10 + j * 3, 0, 0);
      const first = products[(j + day) % products.length];
      const second = products[(j + 2) % 4];
      const items = [{ productId: first.id, name: first.name, price: first.price, qty: 1 + j % 2, art: first.art }, { productId: second.id, name: second.name, price: second.price, qty: 1, art: second.art }];
      const totals = calculate(items);
      transactions.push({ id: `seed-${day}-${j}`, code: `TT-${when.getFullYear()}${String(when.getMonth() + 1).padStart(2, '0')}${String(when.getDate()).padStart(2, '0')}-${String(j + 1).padStart(3, '0')}`, date: when.toISOString(), customer: customers[j % customers.length], table: String(j + 1).padStart(2, '0'), type: j % 3 ? 'dine-in' : 'takeaway', method: ['QRIS', 'Tunai', 'Debit'][j % 3], items, ...totals, discount: 0, cash: totals.total, change: 0, note: '', seeded: true });
    }
  }
  return { version: 1, products, transactions, cart: [], customer: '', table: '', type: 'dine-in', note: '', discount: 0 };
}
const validAmount = value => Number.isSafeInteger(value) && value >= 0 && value <= 1e12;
function validState(data) {
  return data?.version === 1 && Array.isArray(data.products) && data.products.length <= 1000 && data.products.every(p => typeof p.id === 'string' && typeof p.name === 'string' && typeof p.description === 'string' && CATEGORIES.slice(1).includes(p.category) && ART_TYPES.includes(p.art) && validAmount(p.price) && p.price > 0 && Number.isInteger(p.stock) && p.stock >= 0 && p.stock <= 99999)
    && new Set(data.products.map(p => p.id)).size === data.products.length
    && Array.isArray(data.transactions) && data.transactions.every(t => typeof t.id === 'string' && typeof t.code === 'string' && typeof t.customer === 'string' && !Number.isNaN(Date.parse(t.date)) && ['Tunai', 'QRIS', 'Debit'].includes(t.method) && ['dine-in', 'takeaway'].includes(t.type) && [t.total, t.subtotal, t.tax, t.discountAmount, t.cash, t.change].every(validAmount) && Array.isArray(t.items) && t.items.every(i => typeof i.name === 'string' && validAmount(i.price) && Number.isInteger(i.qty) && i.qty > 0 && ART_TYPES.includes(i.art)))
    && Array.isArray(data.cart) && data.cart.every(i => typeof i.id === 'string' && Number.isInteger(i.qty) && i.qty > 0 && data.products.some(p => p.id === i.id && p.stock >= i.qty))
    && ['dine-in', 'takeaway'].includes(data.type) && [0, 10].includes(data.discount) && ['customer', 'table', 'note'].every(key => typeof data[key] === 'string');
}
let state;
let storageAvailable = true;
let startupMessage = '';
try {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    const parsed = JSON.parse(raw);
    if (!validState(parsed)) throw new Error('Invalid saved demo');
    state = parsed;
  } else state = seedState();
} catch (error) {
  state = seedState();
  startupMessage = 'Data browser tidak dapat dibaca. Demo dimulai dengan data awal.';
}
function persist() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
  catch { if (storageAvailable) toast('Penyimpanan browser tidak tersedia. Data hanya bertahan selama halaman ini terbuka.', true); storageAvailable = false; }
}
let toastTimer;
function toast(message, error = false) {
  const el = document.getElementById('toast');
  el.textContent = message; el.classList.toggle('error', error); el.classList.add('visible');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove('visible'), 4200);
}
let page = 'kasir';
let category = 'Semua menu';
let search = '';
let sort = 'recommended';
let productSearch = '';
let stockFilter = 'all';
let transactionSearch = '';
let methodFilter = 'all';
let paymentMethod = 'Tunai';
let cashReceived = 0;
let editingProductId = null;
const main = document.getElementById('main');
const modal = document.getElementById('modal');
const modalContent = document.getElementById('modal-content');
const labels = { dashboard: 'Dashboard', kasir: 'Kasir', produk: 'Menu & stok', transaksi: 'Transaksi' };
document.getElementById('today-label').textContent = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

function heading(eyebrow, title, description, actions = '') {
  return `<div class="page-heading"><div><div class="eyebrow">${eyebrow}</div><h1>${title}</h1><p>${description}</p></div><div class="heading-actions">${actions}</div></div>`;
}
function render() {
  document.title = `${labels[page]} — Titik Temu POS`;
  document.getElementById('breadcrumb-current').textContent = labels[page];
  document.querySelectorAll('[data-page]').forEach(link => {
    link.classList.toggle('active', link.dataset.page === page);
    if (link.dataset.page === page) link.setAttribute('aria-current', 'page'); else link.removeAttribute('aria-current');
  });
  if (page === 'kasir') renderPOS();
  if (page === 'dashboard') renderDashboard();
  if (page === 'produk') renderProducts();
  if (page === 'transaksi') renderTransactions();
}
function navigate() {
  const target = location.hash.slice(1);
  page = Object.hasOwn(labels, target) ? target : 'kasir';
  closeSidebar(); render();
}
function cartItems() {
  return state.cart.map(item => { const product = state.products.find(p => p.id === item.id); return { productId: product.id, name: product.name, price: product.price, art: product.art, qty: item.qty }; });
}
function cartCount() { return state.cart.reduce((sum, item) => sum + item.qty, 0); }
function renderPOS() {
  main.innerHTML = heading('MAKE SOMEONE’S DAY', 'Seduh cerita, mulai di sini.', 'Kopi yang baik. Roti yang hangat. Pelanggan yang kembali.', `<span class="badge">${icon('calendar')} Shift pagi · 08.00–17.00</span><a class="mobile-cart-link" href="#cart-panel" id="mobile-cart-link">${icon('bag')} Pesanan <span id="mobile-cart-count">${cartCount()}</span></a>`)
    + `<div class="pos-layout"><section class="catalog" aria-label="Katalog menu"><div class="promo-banner"><div class="banner-orbit"></div><div class="promo-copy"><div class="promo-kicker">FRESHLY BREWED, DAILY</div><h2>Good coffee.<br><em>Better company.</em></h2><p>Teman untuk setiap jeda.<br>Temukan favoritmu, satu cangkir lagi.</p></div><div class="banner-art">${art('latte')}</div></div><div class="catalog-tools"><div class="search-field">${icon('search')}<input id="menu-search" type="search" placeholder="Cari kopi, roti, atau favoritmu..." aria-label="Cari menu" value="${escapeHTML(search)}"></div><select id="menu-sort" aria-label="Urutkan menu"><option value="recommended">Rekomendasi</option><option value="price-low">Harga terendah</option><option value="price-high">Harga tertinggi</option><option value="name">Nama A–Z</option></select></div><div class="category-tabs" role="group" aria-label="Kategori menu">${categoryTabs()}</div><div class="section-line"><h2 id="category-heading">${escapeHTML(category === 'Semua menu' ? 'Semua menu' : category)}</h2><span id="menu-count"></span></div><div class="product-grid" id="product-grid"></div></section><aside class="cart-panel" id="cart-panel" aria-label="Pesanan saat ini"></aside></div>`;
  document.getElementById('menu-sort').value = sort;
  renderCatalog(); renderCart();
}
function categoryTabs() {
  return CATEGORIES.map((name, index) => `<button class="category-tab ${category === name ? 'active' : ''}" data-action="category" data-category="${name}" aria-pressed="${category === name}">${icon(['grid', 'cup', 'leaf', 'bread', 'utensils'][index])}${name}</button>`).join('');
}
function renderCatalog() {
  const products = state.products.filter(p => (category === 'Semua menu' || p.category === category) && `${p.name} ${p.description}`.toLocaleLowerCase('id').includes(search.toLocaleLowerCase('id')));
  products.sort((a, b) => sort === 'price-low' ? a.price - b.price : sort === 'price-high' ? b.price - a.price : sort === 'name' ? a.name.localeCompare(b.name, 'id') : Number(b.popular) - Number(a.popular));
  document.getElementById('menu-count').textContent = `${products.length} menu tersedia`;
  document.getElementById('product-grid').innerHTML = products.length ? products.map(p => {
    const inCart = state.cart.find(i => i.id === p.id)?.qty || 0;
    return `<article class="product-card"><div class="product-image">${art(p.art)}${p.popular ? `<span class="product-flag">${icon('star')} BEST SELLER</span>` : ''}</div><div class="product-info"><div class="product-category">${escapeHTML(p.category)}</div><h3 title="${escapeHTML(p.name)}">${escapeHTML(p.name)}</h3><p class="product-description">${escapeHTML(p.description)}</p><div class="product-bottom"><span class="product-price">${money(p.price)}</span><button class="add-button" data-action="add" data-id="${escapeHTML(p.id)}" aria-label="Tambah ${escapeHTML(p.name)}" ${p.stock <= inCart ? 'disabled' : ''}>${icon('plus')}</button></div><p class="stock-line ${p.stock <= 8 ? 'low' : ''}">${p.stock === 0 ? 'Stok habis' : `Stok ${p.stock}${inCart ? ` · ${inCart} di pesanan` : ''}`}</p></div></article>`;
  }).join('') : emptyState('Menu belum ketemu', 'Coba kata kunci lain atau pilih kategori yang berbeda.', 'cup');
}
function renderCart() {
  const totals = calculate(cartItems(), state.discount);
  document.getElementById('cart-panel').innerHTML = `<div class="cart-header"><div><h2>Pesanan baru <span>${cartCount()}</span></h2><p>Diracik oleh Raka · Kasir 01</p></div><button class="clear-cart" data-action="clear-cart" ${!state.cart.length ? 'disabled' : ''}>Kosongkan</button></div><div class="cart-meta"><div class="order-type" role="group" aria-label="Jenis pesanan"><button class="${state.type === 'dine-in' ? 'active' : ''}" aria-pressed="${state.type === 'dine-in'}" data-action="order-type" data-type="dine-in">${icon('utensils')} Dine-in</button><button class="${state.type === 'takeaway' ? 'active' : ''}" aria-pressed="${state.type === 'takeaway'}" data-action="order-type" data-type="takeaway">${icon('bag')} Takeaway</button></div><div class="order-fields"><label>Pelanggan<input id="customer-name" placeholder="Walk-in customer" maxlength="60" value="${escapeHTML(state.customer)}"></label><label>No. meja<input id="table-number" placeholder="—" maxlength="10" value="${escapeHTML(state.table)}" ${state.type === 'takeaway' ? 'disabled' : ''}></label></div></div><div class="cart-items">${state.cart.length ? state.cart.map(item => {
    const p = state.products.find(p => p.id === item.id);
    return `<div class="cart-item"><div class="cart-thumb">${art(p.art)}</div><div class="cart-item-detail"><strong>${escapeHTML(p.name)}</strong><p>${money(p.price)}</p></div><div class="quantity-control"><button data-action="decrease" data-id="${escapeHTML(p.id)}" aria-label="Kurangi ${escapeHTML(p.name)}">${icon('minus')}</button><span>${item.qty}</span><button data-action="add" data-id="${escapeHTML(p.id)}" aria-label="Tambah ${escapeHTML(p.name)}" ${item.qty >= p.stock ? 'disabled' : ''}>${icon('plus')}</button></div></div>`;
  }).join('') : `<div class="empty-cart"><span class="empty-cart-icon">${icon('bag')}</span><strong>Mulai dari satu favorit.</strong><p>Tambahkan menu untuk meracik pesanan pertama kamu.</p></div>`}</div><div class="cart-note"><input id="order-note" placeholder="+ Catatan pesanan (opsional)" aria-label="Catatan pesanan" maxlength="200" value="${escapeHTML(state.note)}"></div><div class="cart-summary"><div class="summary-row"><span>Subtotal <span class="muted">(${cartCount()} item)</span></span><strong>${money(totals.subtotal)}</strong></div><div class="summary-row"><label for="order-discount">Diskon</label><select id="order-discount"><option value="0" ${!state.discount ? 'selected' : ''}>Tanpa diskon</option><option value="10" ${state.discount === 10 ? 'selected' : ''}>Teman Temu · 10%</option></select></div>${state.discount ? `<div class="summary-row"><span>Potongan ${state.discount}%</span><strong>− ${money(totals.discountAmount)}</strong></div>` : ''}<div class="summary-row"><span>Pajak simulasi (10%)</span><strong>${money(totals.tax)}</strong></div><div class="summary-total"><span>Total pembayaran</span><strong>${money(totals.total)}</strong></div><button class="primary-button checkout-button" data-action="checkout" ${!state.cart.length ? 'disabled' : ''}><span>Proses pembayaran</span>${icon('arrow')}</button><p class="cart-footnote">${icon('lock')} Mode demo · Tidak ada pembayaran sungguhan</p></div>`;
  const mobileCount = document.getElementById('mobile-cart-count'); if (mobileCount) mobileCount.textContent = cartCount();
}
function changeQuantity(id, amount) {
  const product = state.products.find(p => p.id === id);
  if (!product) return;
  const item = state.cart.find(i => i.id === id);
  if (amount > 0 && (item?.qty || 0) >= product.stock) return toast('Stok menu ini tidak mencukupi.', true);
  if (item) { item.qty += amount; if (item.qty <= 0) state.cart = state.cart.filter(i => i.id !== id); }
  else if (amount > 0) state.cart.push({ id, qty: 1 });
  persist(); renderCart(); renderCatalog();
}
function emptyState(title, text, symbol = 'search') { return `<div class="empty-state">${icon(symbol)}<h3>${title}</h3><p>${text}</p></div>`; }

function renderDashboard() {
  const today = state.transactions.filter(t => localDay(t.date) === localDay(new Date()));
  const sales = today.reduce((sum, t) => sum + t.total, 0);
  const units = today.reduce((sum, t) => sum + t.items.reduce((count, i) => count + i.qty, 0), 0);
  const lowStock = state.products.filter(p => p.stock <= 8);
  const stats = [ ['Pendapatan hari ini', money(sales), 'Termasuk pajak & setelah diskon', 'wallet'], ['Transaksi hari ini', `${today.length} <span style="font-size:12px;font-weight:500;letter-spacing:0;color:#9a9f92">pesanan</span>`, 'Pesanan demo yang sudah selesai', 'receipt'], ['Menu terjual', `${units} <span style="font-size:12px;font-weight:500;letter-spacing:0;color:#9a9f92">item</span>`, 'Total item terjual hari ini', 'cup'], ['Rata-rata transaksi', money(today.length ? Math.round(sales / today.length) : 0), 'Pendapatan ÷ jumlah transaksi', 'trend'] ];
  const days = Array.from({ length: 7 }, (_, i) => { const date = new Date(); date.setDate(date.getDate() - 6 + i); return { date, total: state.transactions.filter(t => localDay(t.date) === localDay(date)).reduce((sum, t) => sum + t.total, 0) }; });
  const max = Math.max(...days.map(d => d.total), 1);
  const popular = new Map();
  for (const t of state.transactions.filter(t => days.some(d => localDay(d.date) === localDay(t.date)))) {
    for (const item of t.items) { const current = popular.get(item.productId) || { ...item, qty: 0 }; current.qty += item.qty; popular.set(item.productId, current); }
  }
  const top = [...popular.values()].sort((a, b) => b.qty - a.qty).slice(0, 4);
  main.innerHTML = heading('A LITTLE OVERVIEW', 'Hari baik dimulai di sini.', 'Lihat bagaimana kedaimu bertumbuh, satu pesanan setiap waktu.', `<span class="badge">${icon('calendar')} Hari ini</span><a class="primary-button" href="#kasir">${icon('plus')} Buka kasir</a>`)
    + `<div class="dashboard-welcome"><div><h2>Selamat datang kembali, Raka.</h2><p>${lowStock.length ? `${lowStock.length} menu mulai menipis. Yuk, cek stok sebelum kedai makin ramai.` : 'Semua stok aman. Siap menyambut pelanggan hari ini?'}<br>Angka di bawah berasal dari transaksi simulasi di browser ini.</p></div><a class="primary-button" href="#produk">Cek menu & stok ${icon('arrow')}</a></div><div class="stats-grid">${stats.map(([label, value, caption, symbol]) => `<article class="stat-card"><div class="stat-top"><span>${label}</span><span>${icon(symbol)}</span></div><div class="stat-value">${value}</div><p class="stat-caption">${caption}</p></article>`).join('')}</div><div class="dashboard-columns"><section class="panel"><div class="panel-heading"><div><h2>Cerita penjualan</h2><p>Pendapatan 7 hari terakhir · termasuk data awal demo</p></div><span class="badge">${icon('trend')} 7 hari</span></div><div class="chart" role="img" aria-label="Pendapatan tujuh hari terakhir: ${days.map(d => `${d.date.toLocaleDateString('id-ID')}: ${money(d.total)}`).join('; ')}"><div class="chart-bars">${days.map(d => `<div class="chart-column"><span class="chart-amount">${d.total >= 1000000 ? `${(d.total / 1000000).toFixed(1)} jt` : `${Math.round(d.total / 1000)} rb`}</span><div class="chart-bar" style="height:${Math.max(2, d.total / max * 82)}%"></div></div>`).join('')}</div><div class="chart-labels">${days.map(d => `<span>${d.date.toLocaleDateString('id-ID', { weekday: 'short' })}</span>`).join('')}</div></div></section><section class="panel"><div class="panel-heading"><div><h2>Favorit pelanggan</h2><p>Paling banyak dipesan dalam 7 hari</p></div>${icon('star')}</div><div class="popular-list">${top.length ? top.map((p, i) => `<div class="popular-item"><span class="rank">0${i + 1}</span><div class="popular-thumb">${art(p.art)}</div><div class="popular-info"><strong>${escapeHTML(p.name)}</strong><p>${money(p.price)}</p></div><span class="popular-count">${p.qty} item</span></div>`).join('') : emptyState('Belum ada penjualan', 'Pesanan pertama akan muncul di sini.', 'cup')}</div></section></div><section class="panel"><div class="panel-heading"><div><h2>Pesanan terbaru</h2><p>Setiap pesanan, satu cerita baru.</p></div><a class="text-button" href="#transaksi">Lihat semua ${icon('arrow')}</a></div>${transactionTable(sortedTransactions().slice(0, 5))}</section>`;
}

function productRows() {
  const products = state.products.filter(p => `${p.name} ${p.category}`.toLocaleLowerCase('id').includes(productSearch.toLocaleLowerCase('id')) && (stockFilter === 'all' || (stockFilter === 'low' ? p.stock > 0 && p.stock <= 8 : p.stock === 0)));
  return { count: products.length, html: products.length ? `<div class="table-container"><table><thead><tr><th>Nama menu</th><th>Kategori</th><th>Harga jual</th><th>Stok</th><th>Status</th><th>Aksi</th></tr></thead><tbody>${products.map(p => `<tr><td><div class="table-product"><div class="popular-thumb">${art(p.art)}</div><div><strong>${escapeHTML(p.name)}</strong><p>${escapeHTML(p.description)}</p></div></div></td><td>${escapeHTML(p.category)}</td><td><strong>${money(p.price)}</strong></td><td>${p.stock} item</td><td><span class="status-pill ${!p.stock ? 'danger' : p.stock <= 8 ? 'warning' : ''}">${!p.stock ? 'Habis' : p.stock <= 8 ? 'Stok menipis' : 'Tersedia'}</span></td><td><div class="inline-actions"><button class="icon-button" data-action="edit-product" data-id="${escapeHTML(p.id)}" aria-label="Edit ${escapeHTML(p.name)}">${icon('edit')}</button><button class="icon-button" data-action="delete-product" data-id="${escapeHTML(p.id)}" aria-label="Hapus ${escapeHTML(p.name)}">${icon('trash')}</button></div></td></tr>`).join('')}</tbody></table></div>` : emptyState('Tidak ada menu', 'Ubah pencarian atau tambahkan menu pertamamu.', 'cup') };
}
function renderProducts() {
  main.innerHTML = heading('THE GOOD STUFF', 'Menu & stok', 'Kelola yang diseduh, dipanggang, dan disukai pelanggan.', `<button class="primary-button" data-action="new-product">${icon('plus')} Tambah menu</button>`)
    + `<section class="panel"><div class="table-toolbar"><div class="search-field">${icon('search')}<input type="search" id="product-search" placeholder="Cari nama menu atau kategori..." aria-label="Cari menu dan stok" value="${escapeHTML(productSearch)}"></div><select id="stock-filter" aria-label="Filter stok"><option value="all">Semua stok</option><option value="low">Stok menipis (≤ 8)</option><option value="empty">Stok habis</option></select></div><div id="product-table"></div><div class="table-footer"><span id="product-table-count"></span><span>Stok berkurang setelah checkout</span></div></section>`;
  document.getElementById('stock-filter').value = stockFilter; updateProductTable();
}
function updateProductTable() { const result = productRows(); document.getElementById('product-table').innerHTML = result.html; document.getElementById('product-table-count').textContent = `${result.count} dari ${state.products.length} menu`; }
function sortedTransactions() { return [...state.transactions].sort((a, b) => new Date(b.date) - new Date(a.date)); }
function transactionTable(transactions) {
  return transactions.length ? `<div class="table-container"><table><thead><tr><th>No. pesanan</th><th>Pelanggan</th><th>Waktu</th><th>Pembayaran</th><th>Total</th><th>Status</th><th></th></tr></thead><tbody>${transactions.map(t => `<tr><td><strong>${escapeHTML(t.code)}</strong></td><td>${escapeHTML(t.customer)}<div style="font-size:9px;color:#a0a794;margin-top:5px">${t.type === 'dine-in' ? `Dine-in${t.table ? ` · Meja ${escapeHTML(t.table)}` : ''}` : 'Takeaway'}</div></td><td>${dateTime(t.date)}</td><td>${escapeHTML(t.method)}</td><td><strong>${money(t.total)}</strong></td><td><span class="status-pill">Selesai</span></td><td><button class="icon-button" data-action="receipt" data-id="${escapeHTML(t.id)}" aria-label="Lihat struk ${escapeHTML(t.code)}">${icon('eye')}</button></td></tr>`).join('')}</tbody></table></div>` : emptyState('Belum ada transaksi', 'Coba checkout di kasir atau ubah filter pencarian.', 'receipt');
}
function filteredTransactions() { return sortedTransactions().filter(t => `${t.code} ${t.customer}`.toLocaleLowerCase('id').includes(transactionSearch.toLocaleLowerCase('id')) && (methodFilter === 'all' || t.method === methodFilter)); }
function renderTransactions() {
  main.innerHTML = heading('EVERY ORDER MATTERS', 'Riwayat transaksi', 'Semua pesanan tercatat rapi. Termasuk cerita kecil di antaranya.', `<button class="secondary-button" data-action="export">${icon('download')} Export CSV</button>`)
    + `<section class="panel"><div class="table-toolbar"><div class="search-field">${icon('search')}<input type="search" id="transaction-search" placeholder="Cari nomor pesanan atau pelanggan..." aria-label="Cari transaksi" value="${escapeHTML(transactionSearch)}"></div><select id="payment-filter" aria-label="Filter pembayaran"><option value="all">Semua pembayaran</option><option>Tunai</option><option>QRIS</option><option>Debit</option></select></div><div id="transaction-table"></div><div class="table-footer"><span id="transaction-count"></span><span>Semua transaksi adalah simulasi</span></div></section>`;
  document.getElementById('payment-filter').value = methodFilter; updateTransactionTable();
}
function updateTransactionTable() { const transactions = filteredTransactions(); document.getElementById('transaction-table').innerHTML = transactionTable(transactions); document.getElementById('transaction-count').textContent = `${transactions.length} transaksi · Total ${money(transactions.reduce((sum, t) => sum + t.total, 0))}`; }

function openModal(content) { modalContent.innerHTML = content; if (!modal.open) modal.showModal(); }
function modalHeader(title, subtitle = '') { return `<div class="modal-header"><div><h2 id="modal-title">${title}</h2>${subtitle ? `<p>${subtitle}</p>` : ''}</div><button type="button" class="icon-button" data-action="close-modal" aria-label="Tutup dialog">${icon('close')}</button></div>`; }
function openProduct(id = null) {
  editingProductId = id;
  const p = state.products.find(p => p.id === id) || { name: '', category: 'Kopi', description: '', price: '', stock: '', art: 'latte', popular: false };
  openModal(`<form id="product-form">${modalHeader(id ? 'Edit menu' : 'Racik menu baru', 'Perubahan hanya disimpan di browser ini.')}<div class="modal-body"><div class="form-grid"><label class="form-full">Nama menu<input name="name" value="${escapeHTML(p.name)}" required maxlength="60" placeholder="Contoh: Sea Salt Latte"></label><label>Kategori<select name="category">${CATEGORIES.slice(1).map(c => `<option ${c === p.category ? 'selected' : ''}>${c}</option>`).join('')}</select></label><label>Ilustrasi<select name="art">${ART_TYPES.map((type, index) => `<option value="${type}" ${type === p.art ? 'selected' : ''}>${['Es kopi', 'Cangkir latte', 'Kopi hitam', 'Es matcha', 'Es cokelat', 'Croissant', 'Cinnamon roll', 'Cheesecake', 'Toast', 'Donat'][index]}</option>`).join('')}</select></label><label>Harga jual (Rp)<input name="price" type="number" min="1" max="10000000" step="1" required value="${p.price}" placeholder="28000"></label><label>Stok tersedia<input name="stock" type="number" min="0" max="99999" step="1" required value="${p.stock}" placeholder="20"></label><label class="form-full">Deskripsi singkat<input name="description" maxlength="100" value="${escapeHTML(p.description)}" placeholder="Apa yang membuat menu ini spesial?"></label><label class="form-full" style="display:flex;align-items:center;gap:8px"><input type="checkbox" name="popular" ${p.popular ? 'checked' : ''} style="width:auto;margin:0"> Tandai sebagai best seller</label></div><div class="form-error" id="product-error" role="alert" hidden></div></div><div class="modal-footer"><button type="button" class="secondary-button" data-action="close-modal">Batal</button><button type="submit" class="primary-button">${icon('check')} Simpan menu</button></div></form>`);
}
function saveProduct(form) {
  const data = new FormData(form);
  const p = { id: editingProductId || uid('p'), name: data.get('name').trim(), category: data.get('category'), description: data.get('description').trim(), price: Number(data.get('price')), stock: Number(data.get('stock')), art: data.get('art'), popular: data.has('popular') };
  const error = document.getElementById('product-error');
  if (!p.name || !Number.isInteger(p.price) || p.price < 1 || p.price > 10000000 || !Number.isInteger(p.stock) || p.stock < 0 || p.stock > 99999 || !CATEGORIES.includes(p.category) || !ART_TYPES.includes(p.art)) { error.hidden = false; error.textContent = 'Isi nama, harga bulat yang valid, dan stok 0–99.999.'; return; }
  if (state.products.some(other => other.id !== p.id && other.name.toLocaleLowerCase('id') === p.name.toLocaleLowerCase('id'))) { error.hidden = false; error.textContent = 'Nama menu sudah ada. Gunakan nama yang berbeda.'; return; }
  const index = state.products.findIndex(other => other.id === p.id);
  if (index >= 0) state.products[index] = p; else state.products.push(p);
  const cartItem = state.cart.find(i => i.id === p.id);
  if (cartItem) { cartItem.qty = Math.min(cartItem.qty, p.stock); state.cart = state.cart.filter(i => i.qty > 0); }
  persist(); modal.close(); render(); toast('Menu berhasil disimpan.');
}
function deleteProduct(id) {
  const p = state.products.find(p => p.id === id); if (!p) return;
  openModal(`${modalHeader('Hapus menu?', 'Riwayat transaksi yang sudah selesai tidak ikut dihapus.')}<div class="modal-body"><p class="confirm-copy"><strong>${escapeHTML(p.name)}</strong> akan dihapus dari katalog dan keranjang saat ini.</p></div><div class="modal-footer"><button class="secondary-button" data-action="close-modal">Batal</button><button class="danger-button" data-action="confirm-delete" data-id="${escapeHTML(id)}">Ya, hapus menu</button></div>`);
}

function openCheckout() {
  if (!state.cart.length) return;
  paymentMethod = 'Tunai'; cashReceived = 0;
  const totals = calculate(cartItems(), state.discount);
  openModal(`<form id="checkout-form">${modalHeader('Selesaikan pesanan', `${cartCount()} item · ${escapeHTML(state.customer.trim() || 'Walk-in customer')} · ${state.type === 'dine-in' ? 'Dine-in' : 'Takeaway'}`)}<div class="modal-body"><div class="payment-total"><p>Total pembayaran</p><strong>${money(totals.total)}</strong></div><label>Pilih metode pembayaran</label><div class="payment-options" role="group" aria-label="Metode pembayaran">${['Tunai', 'QRIS', 'Debit'].map((method, i) => `<button type="button" class="payment-option ${!i ? 'active' : ''}" data-action="payment-method" data-method="${method}" aria-pressed="${!i}">${icon(['cash', 'qr', 'card'][i])}${method}</button>`).join('')}</div><div id="payment-detail"></div><div class="form-error" id="checkout-error" role="alert" hidden></div></div><div class="modal-footer"><button type="button" class="secondary-button" data-action="close-modal">Kembali</button><button type="submit" class="primary-button">${icon('check')} Selesaikan simulasi</button></div></form>`);
  renderPaymentDetail();
}
function renderPaymentDetail() {
  const totals = calculate(cartItems(), state.discount);
  document.getElementById('payment-detail').innerHTML = paymentMethod === 'Tunai'
    ? `<label>Uang diterima (Rp)<input id="cash-received" type="number" min="${totals.total}" max="1000000000000" step="1" required placeholder="Masukkan nominal uang" value="${cashReceived || ''}"></label><div class="cash-shortcuts">${[...new Set([totals.total, ...[50000, 100000, 150000, 200000, 500000].filter(n => n >= totals.total)])].slice(0, 4).map((value, i) => `<button type="button" data-action="cash-amount" data-amount="${value}">${!i ? 'Uang pas' : money(value)}</button>`).join('')}</div><div class="change-row"><span>Kembalian</span><strong id="cash-change">${money(Math.max(0, cashReceived - totals.total))}</strong></div>`
    : `<div class="payment-help"><strong>Simulasi ${paymentMethod}</strong><br>Tidak terhubung ke payment gateway, mesin EDC, atau QR pembayaran. Klik “Selesaikan simulasi” untuk mencatat pesanan demo sebagai lunas.</div>`;
}
function completeCheckout() {
  if (!state.cart.length) return;
  const items = cartItems();
  const totals = calculate(items, state.discount);
  const error = document.getElementById('checkout-error');
  const fail = message => { error.hidden = false; error.textContent = message; };
  if (state.cart.some(i => { const p = state.products.find(p => p.id === i.id); return !p || i.qty > p.stock; })) return fail('Stok berubah. Tutup dialog dan periksa pesanan.');
  if (paymentMethod === 'Tunai' && (!Number.isSafeInteger(cashReceived) || cashReceived < totals.total || cashReceived > 1e12)) return fail('Uang diterima harus cukup dan berupa nominal rupiah bulat.');
  const now = new Date();
  const prefix = `TT-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-`;
  const sequence = Math.max(0, ...state.transactions.filter(t => t.code.startsWith(prefix)).map(t => Number(t.code.slice(prefix.length)) || 0)) + 1;
  const transaction = { id: uid('tx'), code: `${prefix}${String(sequence).padStart(3, '0')}`, date: now.toISOString(), customer: state.customer.trim() || 'Walk-in customer', table: state.type === 'dine-in' ? state.table.trim() : '', type: state.type, method: paymentMethod, items, ...totals, discount: state.discount, cash: paymentMethod === 'Tunai' ? cashReceived : totals.total, change: paymentMethod === 'Tunai' ? cashReceived - totals.total : 0, note: state.note.trim(), seeded: false };
  for (const item of state.cart) state.products.find(p => p.id === item.id).stock -= item.qty;
  state.transactions.push(transaction); state.cart = []; state.customer = ''; state.table = ''; state.note = ''; state.discount = 0;
  persist(); render(); showReceipt(transaction.id, true);
}
function showReceipt(id, success = false) {
  const t = state.transactions.find(t => t.id === id); if (!t) return;
  openModal(`${modalHeader(success ? 'Pesanan selesai' : 'Detail pesanan', 'Bukti transaksi simulasi · tidak berlaku sebagai bukti pembayaran asli')}<div class="modal-body">${success ? `<div class="success-heading"><span class="success-icon">${icon('check')}</span><h2>Satu pesanan, satu senyuman.</h2><p>Transaksi tersimpan. Stok menu sudah diperbarui.</p></div>` : ''}<div class="receipt"><div class="receipt-brand"><h3>titik temu.</h3><p>COFFEE & BAKEHOUSE · SENOPATI<br>Jakarta Selatan · Demo portfolio</p></div><div class="receipt-meta"><div>No. pesanan<strong>${escapeHTML(t.code)}</strong></div><div>Waktu<strong>${dateTime(t.date)}</strong></div><div>Pelanggan<strong>${escapeHTML(t.customer)}</strong></div><div>Jenis pesanan<strong>${t.type === 'dine-in' ? `Dine-in${t.table ? ` · Meja ${escapeHTML(t.table)}` : ''}` : 'Takeaway'}</strong></div></div>${t.items.map(i => `<div class="receipt-item"><span>${escapeHTML(i.name)}<br><span class="muted">${i.qty} × ${money(i.price)}</span></span><strong>${money(i.qty * i.price)}</strong></div>`).join('')}<div class="receipt-totals"><div class="summary-row"><span>Subtotal</span><strong>${money(t.subtotal)}</strong></div>${t.discountAmount ? `<div class="summary-row"><span>Diskon (${t.discount}%)</span><strong>− ${money(t.discountAmount)}</strong></div>` : ''}<div class="summary-row"><span>Pajak simulasi (10%)</span><strong>${money(t.tax)}</strong></div><div class="summary-total"><span>Total</span><strong>${money(t.total)}</strong></div><div class="summary-row" style="margin-top:17px"><span>${escapeHTML(t.method)}${t.method === 'Tunai' ? ' diterima' : ''}</span><strong>${money(t.cash)}</strong></div>${t.method === 'Tunai' ? `<div class="summary-row"><span>Kembalian</span><strong>${money(t.change)}</strong></div>` : ''}${t.note ? `<p class="payment-help">Catatan: ${escapeHTML(t.note)}</p>` : ''}</div><div class="receipt-end">Terima kasih sudah singgah.<br>Sampai ketemu di cangkir berikutnya.<br><strong>DEMO — BUKAN TRANSAKSI ASLI</strong></div></div></div><div class="modal-footer"><button class="secondary-button" data-action="print">${icon('print')} Cetak struk</button><button class="primary-button" data-action="close-modal">${success ? 'Pesanan berikutnya' : 'Tutup'}</button></div>`);
}
function exportCSV() {
  const transactions = filteredTransactions(); if (!transactions.length) return toast('Tidak ada transaksi untuk diekspor.', true);
  const cell = value => { let text = String(value ?? ''); if (/^[\s]*[=+\-@]/.test(text)) text = `'${text}`; return `"${text.replace(/"/g, '""')}"`; };
  const rows = [['No pesanan', 'Waktu', 'Pelanggan', 'Tipe', 'Meja', 'Metode', 'Subtotal', 'Diskon', 'Pajak simulasi', 'Total', 'Catatan'], ...transactions.map(t => [t.code, dateTime(t.date), t.customer, t.type, t.table, t.method, t.subtotal, t.discountAmount, t.tax, t.total, t.note])];
  const blob = new Blob(['\uFEFF' + rows.map(row => row.map(cell).join(',')).join('\r\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = `titik-temu-transaksi-${new Date().toISOString().slice(0, 10)}.csv`; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  toast(`${transactions.length} transaksi diekspor sesuai filter.`);
}
function closeSidebar() { document.getElementById('sidebar').classList.remove('open'); document.getElementById('sidebar-scrim').hidden = true; document.getElementById('menu-toggle').setAttribute('aria-expanded', 'false'); }
document.getElementById('menu-toggle').addEventListener('click', () => { const open = document.getElementById('sidebar').classList.toggle('open'); document.getElementById('sidebar-scrim').hidden = !open; document.getElementById('menu-toggle').setAttribute('aria-expanded', String(open)); });
document.getElementById('sidebar-scrim').addEventListener('click', closeSidebar);
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeSidebar(); });
document.getElementById('reset-demo').addEventListener('click', () => openModal(`${modalHeader('Mulai dari awal?', 'Hanya data demo Titik Temu di browser ini yang akan direset.')}<div class="modal-body"><p class="confirm-copy">Menu, stok, keranjang, dan transaksi yang kamu buat akan diganti dengan data awal demo. Tindakan ini tidak memengaruhi project Laravel.</p></div><div class="modal-footer"><button class="secondary-button" data-action="close-modal">Batal</button><button class="danger-button" data-action="confirm-reset">Reset data demo</button></div>`));

document.addEventListener('click', event => {
  // Keep the mobile cart anchor inside the active page (rather than changing the router hash).
  const cartLink = event.target.closest('#mobile-cart-link');
  if (cartLink) { event.preventDefault(); document.getElementById('cart-panel').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' }); return; }
  const button = event.target.closest('[data-action]'); if (!button || button.disabled) return;
  const { action, id } = button.dataset;
  if (action === 'add') changeQuantity(id, 1);
  if (action === 'decrease') changeQuantity(id, -1);
  if (action === 'clear-cart') { state.cart = []; persist(); renderCart(); renderCatalog(); toast('Pesanan dikosongkan.'); }
  if (action === 'category') { category = button.dataset.category; document.querySelector('.category-tabs').innerHTML = categoryTabs(); document.getElementById('category-heading').textContent = category; renderCatalog(); }
  if (action === 'order-type') { state.type = button.dataset.type; persist(); renderCart(); }
  if (action === 'checkout') openCheckout();
  if (action === 'close-modal') modal.close();
  if (action === 'new-product') openProduct();
  if (action === 'edit-product') openProduct(id);
  if (action === 'delete-product') deleteProduct(id);
  if (action === 'confirm-delete') { state.products = state.products.filter(p => p.id !== id); state.cart = state.cart.filter(i => i.id !== id); persist(); modal.close(); render(); toast('Menu dihapus. Riwayat transaksi tetap tersimpan.'); }
  if (action === 'payment-method') { paymentMethod = button.dataset.method; document.querySelectorAll('.payment-option').forEach(el => { el.classList.toggle('active', el.dataset.method === paymentMethod); el.setAttribute('aria-pressed', String(el.dataset.method === paymentMethod)); }); document.getElementById('checkout-error').hidden = true; renderPaymentDetail(); }
  if (action === 'cash-amount') { cashReceived = Number(button.dataset.amount); document.getElementById('cash-received').value = cashReceived; document.getElementById('cash-change').textContent = money(Math.max(0, cashReceived - calculate(cartItems(), state.discount).total)); }
  if (action === 'receipt') showReceipt(id);
  if (action === 'print') window.print();
  if (action === 'export') exportCSV();
  if (action === 'confirm-reset') { state = seedState(); search = ''; productSearch = ''; transactionSearch = ''; category = 'Semua menu'; stockFilter = 'all'; methodFilter = 'all'; sort = 'recommended'; persist(); modal.close(); render(); toast('Data demo kembali seperti baru. Selamat mencoba!'); }
});
document.addEventListener('input', event => {
  const { id, value } = event.target;
  if (id === 'menu-search') { search = value; renderCatalog(); }
  if (id === 'product-search') { productSearch = value; updateProductTable(); }
  if (id === 'transaction-search') { transactionSearch = value; updateTransactionTable(); }
  if (['customer-name', 'table-number', 'order-note'].includes(id)) { state[{ 'customer-name': 'customer', 'table-number': 'table', 'order-note': 'note' }[id]] = value; persist(); }
  if (id === 'cash-received') { cashReceived = Number(value); document.getElementById('cash-change').textContent = money(Math.max(0, cashReceived - calculate(cartItems(), state.discount).total)); }
});
document.addEventListener('change', event => {
  const { id, value } = event.target;
  if (id === 'menu-sort') { sort = value; renderCatalog(); }
  if (id === 'order-discount') { state.discount = Number(value); persist(); renderCart(); }
  if (id === 'stock-filter') { stockFilter = value; updateProductTable(); }
  if (id === 'payment-filter') { methodFilter = value; updateTransactionTable(); }
});
document.addEventListener('submit', event => { if (event.target.id === 'product-form') { event.preventDefault(); saveProduct(event.target); } if (event.target.id === 'checkout-form') { event.preventDefault(); completeCheckout(); } });
window.addEventListener('hashchange', navigate);
// Reload on changes from another tab, avoiding overwriting its stock/transactions.
window.addEventListener('storage', event => {
  if (event.key !== STORAGE_KEY || !event.newValue) return;
  try { const next = JSON.parse(event.newValue); if (!validState(next)) return; state = next; modal.close(); render(); toast('Data diperbarui dari tab lain. Periksa pesanan sebelum checkout.'); } catch { /* Ignore unrelated or malformed storage writes. */ }
});
navigate();
if (startupMessage) toast(startupMessage, true);
