/* ══════════════════════════════════
   VÈLO — script.js
══════════════════════════════════ */

// ── CUSTOM CURSOR ──
const cursor = document.getElementById('cursor');
const ring   = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX;
  my = e.clientY;
});

(function animCursor() {
  cursor.style.left = mx + 'px';
  cursor.style.top  = my + 'px';
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  ring.style.left = rx + 'px';
  ring.style.top  = ry + 'px';
  requestAnimationFrame(animCursor);
})();

// ── PRODUCT GRID RENDERING ──
function buildCardHTML(p) {
  const isWished = getWishlist().includes(p.id);
  const badge = p.badgeType && p.badgeType !== 'none'
    ? `<span class="p-badge ${veloBadgeClass(p.badgeType)}">${p.badgeLabel}</span>` : '';
  const priceBlock = p.oldPrice
    ? `<span class="p-price">${veloFormatPrice(p.price)}</span><span class="p-was">${veloFormatPrice(p.oldPrice)}</span>`
    : `<span class="p-price">${veloFormatPrice(p.price)}</span>`;
  const swatches = (p.colors || []).map(c => `<div class="p-swatch" style="background:${c}"></div>`).join('');
  const sizes = (p.sizes || []).map(s => `<span class="size-chip" onclick="event.stopPropagation()">${s}</span>`).join('');

  return `
    <div class="p-card" onclick="openModalById('${p.id}')">
      <div class="p-img-wrap">
        <img class="p-img" src="${p.img}" alt="${p.name}" loading="lazy"/>
        <img class="p-img-alt" src="${p.imgAlt}" alt="${p.name} alt" loading="lazy"/>
        ${badge}
        <div class="p-actions">
          <button class="p-action-btn${isWished ? ' wishlisted' : ''}" onclick="toggleWish(event,this,'${p.id}')" title="Wishlist">${isWished ? '♥' : '♡'}</button>
          <button class="p-action-btn" onclick="event.stopPropagation();openModalById('${p.id}')" title="Quick view">⊙</button>
        </div>
        <div class="p-sizes">${sizes}</div>
      </div>
      <div class="p-info">
        <div class="p-meta">
          <div>
            <div class="p-name">${p.name}</div>
            <div class="p-cat">${p.category} · ${p.material}</div>
          </div>
          <div class="p-price-block">${priceBlock}</div>
        </div>
        <div class="p-colors">${swatches}</div>
        <button class="p-add" onclick="event.stopPropagation();addToCart('${p.name.replace(/'/g, "\\'")}')">Add to Bag</button>
      </div>
    </div>`;
}

function renderProductGrid(filterFn) {
  const grid = document.getElementById('productGrid');
  if (!grid) return;
  let products = veloGetProducts();
  if (typeof filterFn === 'function') products = products.filter(filterFn);
  grid.innerHTML = products.map(buildCardHTML).join('');
}

// PRODUCT SEARCH
if (!document.getElementById('searchPanel') && document.querySelector('.nav-search-trigger')) {
  document.body.insertAdjacentHTML('beforeend', `
    <div class="search-panel" id="searchPanel" aria-hidden="true" role="dialog" aria-modal="true" aria-label="Search products">
      <div class="search-panel-top"><span class="search-label">Search the collection</span><button class="search-close" type="button" onclick="closeSearch()" aria-label="Close search">&times;</button></div>
      <div class="search-field-wrap"><span class="search-symbol">&#9906;</span><input id="productSearch" class="search-field" type="search" placeholder="What are you looking for?" autocomplete="off" aria-label="Search products"/><span class="search-count" id="searchCount">Type to discover</span></div>
      <div class="search-suggestions" id="searchSuggestions"><span>Popular</span><button type="button" data-search="Silk">Silk</button><button type="button" data-search="Dress">Dresses</button><button type="button" data-search="Linen">Linen</button><button type="button" data-search="New">New arrivals</button></div>
      <div class="search-results" id="searchResults"></div>
    </div><div class="search-backdrop" id="searchBackdrop" onclick="closeSearch()"></div>`);
}
const searchPanel = document.getElementById('searchPanel');
const searchBackdrop = document.getElementById('searchBackdrop');
const searchInput = document.getElementById('productSearch');
const searchResults = document.getElementById('searchResults');
const searchCount = document.getElementById('searchCount');

function openSearch() {
  if (!searchPanel) return;
  searchPanel.classList.add('open');
  searchBackdrop.classList.add('open');
  searchPanel.setAttribute('aria-hidden', 'false');
  document.querySelector('.nav-search-trigger')?.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
  window.setTimeout(() => searchInput.focus(), 350);
}

function closeSearch() {
  if (!searchPanel) return;
  searchPanel.classList.remove('open');
  searchBackdrop.classList.remove('open');
  searchPanel.setAttribute('aria-hidden', 'true');
  document.querySelector('.nav-search-trigger')?.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

function runProductSearch(value) {
  if (!searchResults) return;
  const term = value.trim().toLowerCase();
  if (!term) {
    searchResults.innerHTML = '';
    searchCount.textContent = 'Type to discover';
    return;
  }
  const matches = veloGetProducts().filter(p =>
    [p.name, p.category, p.material, p.badgeLabel].filter(Boolean).some(field => field.toLowerCase().includes(term))
  );
  searchCount.textContent = `${matches.length} ${matches.length === 1 ? 'piece' : 'pieces'}`;
  searchResults.innerHTML = matches.length ? matches.slice(0, 8).map(p => `
    <article class="search-result" tabindex="0" onclick="closeSearch();openModalById('${p.id}')" onkeydown="if(event.key==='Enter'){closeSearch();openModalById('${p.id}')}" aria-label="View ${p.name}">
      <img src="${p.img}" alt=""/>
      <div><div class="search-result-name">${p.name}</div><div class="search-result-meta">${p.category} · ${veloFormatPrice(p.price)}</div></div>
    </article>`).join('') : '<p class="search-empty">No pieces found — try another word.</p>';
}

searchInput?.addEventListener('input', event => runProductSearch(event.target.value));
document.querySelectorAll('[data-search]').forEach(button => button.addEventListener('click', () => {
  searchInput.value = button.dataset.search;
  runProductSearch(button.dataset.search);
  searchInput.focus();
}));

function openModalById(id) {
  const p = veloGetProducts().find(p => p.id === id);
  if (!p) return;
  openModal(p.name, p.category + ' · ' + p.material, veloFormatPrice(p.price), p.img);
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('productGrid')) renderProductGrid();
});

// Always-visible homepage search
const topSearchForm = document.getElementById('topSearchForm');
const topSearchInput = document.getElementById('topSearchInput');
function filterFromTopSearch() {
  const term = topSearchInput.value.trim().toLowerCase();
  const products = veloGetProducts();
  const matches = term ? products.filter(p => [p.name,p.category,p.material,p.badgeLabel].filter(Boolean).some(value => value.toLowerCase().includes(term))) : products;
  renderProductGrid(p => matches.some(match => match.id === p.id));
  const count = document.getElementById('collectionCount');
  if (count) count.textContent = term ? `${matches.length} matching pieces` : '132 pieces · Spring–Summer 2026';
}
topSearchInput?.addEventListener('input', filterFromTopSearch);
topSearchForm?.addEventListener('submit', event => { event.preventDefault(); filterFromTopSearch(); document.querySelector('.shop-shell')?.scrollIntoView({ behavior: 'smooth' }); });

// ── CART ──
const CART_KEY = 'velvet_vogue_bag_v1';
let cartItems = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
let cartCount = cartItems.reduce((sum, item) => sum + item.qty, 0);

function syncCartBadge() {
  const el = document.getElementById('cartNum');
  if (!el) return;
  el.textContent = cartCount;
  el.style.display = cartCount ? 'inline' : 'none';
}

function addToCart(name) {
  const product = veloGetProducts().find(p => p.name === name);
  const existing = cartItems.find(item => item.name === name);
  if (existing) existing.qty += 1;
  else cartItems.push({ id: product?.id || name, name, price: product?.price || 0, img: product?.img || '', category: product?.category || 'Collection', qty: 1 });
  localStorage.setItem(CART_KEY, JSON.stringify(cartItems));
  cartCount = cartItems.reduce((sum, item) => sum + item.qty, 0);
  syncCartBadge();
  showToast('✦ ' + name + ' added to bag');
}

document.addEventListener('DOMContentLoaded', syncCartBadge);

// ── TOAST ──
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2800);
}

const newsletterForm = document.getElementById('newsletterForm');
newsletterForm?.addEventListener('submit', event => {
  event.preventDefault();
  if (!newsletterForm.checkValidity()) { newsletterForm.reportValidity(); return; }
  showToast('Welcome to the atelier ✦');
  newsletterForm.reset();
  document.getElementById('newsletterEmail')?.blur();
});

// ── WISHLIST ──
const WISH_KEY = 'velvet_vogue_wishlist_v1';
function getWishlist() { return JSON.parse(localStorage.getItem(WISH_KEY) || '[]'); }
function syncWishBadge() { const count = getWishlist().length; document.querySelectorAll('.wish-num').forEach(el => { el.textContent = count; el.style.display = count ? 'inline' : 'none'; }); }
function toggleWish(e, btn, productId) {
  e.stopPropagation();
  const on = btn.classList.toggle('wishlisted');
  btn.textContent = on ? '♥' : '♡';
  let wishlist = getWishlist();
  wishlist = on ? [...new Set([...wishlist, productId])] : wishlist.filter(id => id !== productId);
  localStorage.setItem(WISH_KEY, JSON.stringify(wishlist));
  syncWishBadge();
  showToast(on ? '♥ Added to wishlist' : 'Removed from wishlist');
}
document.addEventListener('DOMContentLoaded', syncWishBadge);

// ── GRID VIEW TOGGLE ──
function setView(cols, btn) {
  document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const g = document.getElementById('productGrid');
  g.className = 'product-grid view-' + cols;
}

// ── HERO VIDEO MUTE ──
let muted = true;

function toggleMute() {
  const v = document.getElementById('heroVideo');
  muted   = !muted;
  v.muted = muted;
  document.getElementById('muteBtn').textContent = muted ? '🔇' : '🔊';
}

// ── QUICK-VIEW MODAL ──
let modalProductName = '';

function openModal(name, cat, price, img) {
  modalProductName = name;
  document.getElementById('modalTitle').textContent = name;
  document.getElementById('modalCat').textContent   = cat;
  document.getElementById('modalPrice').textContent = price;
  document.getElementById('modalImg').src           = img;
  document.getElementById('modal').classList.add('open');
  document.getElementById('modalBg').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modal').classList.remove('open');
  document.getElementById('modalBg').classList.remove('open');
  document.body.style.overflow = '';
}

function selSize(el) {
  document.querySelectorAll('.modal-size').forEach(s => s.classList.remove('sel'));
  el.classList.add('sel');
}

function addFromModal() {
  addToCart(modalProductName);
  closeModal();
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeModal();
    closeSearch();
  }
});

// ── SIDEBAR COLOR DOTS ──
document.querySelectorAll('.color-dot').forEach(d => {
  d.addEventListener('click', () => {
    document.querySelectorAll('.color-dot').forEach(x => x.classList.remove('sel'));
    d.classList.add('sel');
  });
});

// ── PRICE RANGE SLIDER ──
const slider = document.querySelector('.range-slider');
const labels = document.querySelectorAll('.range-labels span');

if (slider) {
  slider.addEventListener('input', () => {
    const v   = slider.value;
    const pct = (v / 2000) * 100;
    labels[1].textContent   = '$' + parseInt(v).toLocaleString();
    slider.style.background = `linear-gradient(to right, var(--gold) ${pct}%, var(--sand) ${pct}%)`;
  });
}

// ── SCROLL-TRIGGERED NAV SHADOW ──
window.addEventListener('scroll', () => {
  const nav = document.querySelector('nav');
  if (window.scrollY > 40) {
    nav.classList.add('nav-scrolled');
  } else {
    nav.classList.remove('nav-scrolled');
  }
});

// Luxury motion system
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });

document.querySelectorAll('.reveal, .shop-header, .lookbook-strip, .gram-section, .newsletter-inner').forEach((el, index) => {
  el.classList.add('reveal');
  el.style.transitionDelay = `${Math.min(index * 45, 180)}ms`;
  revealObserver.observe(el);
});

const hero = document.querySelector('.hero');
const heroAura = document.querySelector('.hero-aura');
if (hero && heroAura && window.matchMedia('(pointer:fine)').matches) {
  hero.addEventListener('mousemove', (event) => {
    const x = (event.clientX / window.innerWidth - .5) * 35;
    const y = (event.clientY / window.innerHeight - .5) * 25;
    heroAura.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  });
}

// Shop background film: offset it from the hero and pause it when off-screen.
const shopFilm = document.querySelector('.shop-bg-video');
const shopSection = document.querySelector('.shop-shell');
if (shopFilm && shopSection) {
  shopFilm.playbackRate = 0.72;
  shopFilm.addEventListener('loadedmetadata', () => {
    if (shopFilm.duration > 8) shopFilm.currentTime = Math.min(7, shopFilm.duration - 1);
  }, { once: true });

  const filmObserver = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) shopFilm.play().catch(() => {});
    else shopFilm.pause();
  }, { rootMargin: '150px 0px' });
  filmObserver.observe(shopSection);
}
