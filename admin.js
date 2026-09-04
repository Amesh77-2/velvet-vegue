/* ══════════════════════════════════
   VÈLO — admin.js
══════════════════════════════════ */

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2600);
}

function renderAdminStats(products) {
  const total = products.length;
  const newCount = products.filter(p => p.isNew).length;
  const saleCount = products.filter(p => p.oldPrice).length;
  const avgPrice = total ? Math.round(products.reduce((s, p) => s + Number(p.price), 0) / total) : 0;

  document.getElementById('adminStats').innerHTML = `
    <div class="admin-stat"><div class="admin-stat-num">${total}</div><div class="admin-stat-label">Total Products</div></div>
    <div class="admin-stat"><div class="admin-stat-num">${newCount}</div><div class="admin-stat-label">New In</div></div>
    <div class="admin-stat"><div class="admin-stat-num">${saleCount}</div><div class="admin-stat-label">On Sale</div></div>
    <div class="admin-stat"><div class="admin-stat-num">${veloFormatPrice(avgPrice)}</div><div class="admin-stat-label">Avg. Price</div></div>
  `;
}

function renderAdminTable() {
  const products = veloGetProducts();
  renderAdminStats(products);

  const body = document.getElementById('adminTableBody');
  const empty = document.getElementById('adminEmpty');

  if (!products.length) {
    body.innerHTML = '';
    empty.style.display = 'block';
    return;
  }
  empty.style.display = 'none';

  body.innerHTML = products.map(p => {
    const priceHtml = p.oldPrice
      ? `<span class="admin-price">${veloFormatPrice(p.price)}</span><span class="admin-was">${veloFormatPrice(p.oldPrice)}</span>`
      : `<span class="admin-price">${veloFormatPrice(p.price)}</span>`;
    const badgeHtml = (p.badgeType && p.badgeType !== 'none')
      ? `<span class="admin-badge ${veloBadgeClass(p.badgeType)}">${p.badgeLabel || p.badgeType}</span>`
      : '<span style="opacity:.3;font-size:11px;">—</span>';

    return `
      <tr>
        <td><img class="admin-thumb" src="${p.img}" alt="${p.name}"/></td>
        <td>
          <div class="admin-pname">${p.name}</div>
          <div class="admin-pcat">${p.material || ''}</div>
        </td>
        <td>${p.category}</td>
        <td>${priceHtml}</td>
        <td>${badgeHtml}</td>
        <td>
          <div class="admin-actions">
            <button class="admin-icon-btn" title="Edit" onclick="openProductForm('${p.id}')">✎</button>
            <button class="admin-icon-btn danger" title="Delete" onclick="handleDelete('${p.id}')">✕</button>
          </div>
        </td>
      </tr>`;
  }).join('');
}

// ── FORM MODAL ──
function openProductForm(id) {
  const form = document.getElementById('adminForm');
  form.reset();
  document.getElementById('f-id').value = '';
  document.getElementById('f-badgelabel').value = '';

  if (id) {
    const p = veloGetProducts().find(p => p.id === id);
    if (!p) return;
    document.getElementById('adminFormTitle').textContent = 'Edit Product';
    document.getElementById('f-id').value = p.id;
    document.getElementById('f-name').value = p.name;
    document.getElementById('f-category').value = p.category;
    document.getElementById('f-material').value = p.material || '';
    document.getElementById('f-price').value = p.price;
    document.getElementById('f-oldprice').value = p.oldPrice || '';
    document.getElementById('f-badgetype').value = p.badgeType || 'none';
    document.getElementById('f-badgelabel').value = p.badgeLabel || '';
    document.getElementById('f-img').value = p.img || '';
    document.getElementById('f-imgalt').value = p.imgAlt || '';
    document.getElementById('f-sizes').value = (p.sizes || []).join(', ');
    document.getElementById('f-colors').value = (p.colors || []).join(', ');
    document.getElementById('f-isnew').checked = !!p.isNew;
  } else {
    document.getElementById('adminFormTitle').textContent = 'Add Product';
  }

  document.getElementById('adminModal').classList.add('open');
  document.getElementById('adminModalBg').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeProductForm() {
  document.getElementById('adminModal').classList.remove('open');
  document.getElementById('adminModalBg').classList.remove('open');
  document.body.style.overflow = '';
}

function onBadgeTypeChange() {
  const type = document.getElementById('f-badgetype').value;
  const labelField = document.getElementById('f-badgelabel');
  if (!labelField.value) {
    if (type === 'new') labelField.value = 'New';
    else if (type === 'limited') labelField.value = 'Limited';
    else if (type === 'sale') labelField.value = '−20%';
  }
}

function handleFormSubmit(e) {
  e.preventDefault();
  const id = document.getElementById('f-id').value;
  const sizes = document.getElementById('f-sizes').value.split(',').map(s => s.trim()).filter(Boolean);
  const colors = document.getElementById('f-colors').value.split(',').map(s => s.trim()).filter(Boolean);
  const oldPriceVal = document.getElementById('f-oldprice').value;

  const data = {
    name: document.getElementById('f-name').value.trim(),
    category: document.getElementById('f-category').value,
    material: document.getElementById('f-material').value.trim(),
    price: Number(document.getElementById('f-price').value),
    oldPrice: oldPriceVal ? Number(oldPriceVal) : null,
    badgeType: document.getElementById('f-badgetype').value,
    badgeLabel: document.getElementById('f-badgelabel').value.trim(),
    img: document.getElementById('f-img').value.trim() || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80',
    imgAlt: document.getElementById('f-imgalt').value.trim() || document.getElementById('f-img').value.trim(),
    sizes: sizes.length ? sizes : ['S', 'M', 'L'],
    colors: colors.length ? colors : ['#1C1C1C'],
    isNew: document.getElementById('f-isnew').checked
  };

  if (id) {
    veloUpdateProduct(id, data);
    showToast('✦ Product updated');
  } else {
    veloAddProduct(data);
    showToast('✦ Product added');
  }

  closeProductForm();
  renderAdminTable();
}

function handleDelete(id) {
  const p = veloGetProducts().find(p => p.id === id);
  if (!p) return;
  if (!confirm(`Delete "${p.name}"? This can't be undone.`)) return;
  veloDeleteProduct(id);
  showToast('Product deleted');
  renderAdminTable();
}

function handleResetProducts() {
  if (!confirm('Reset all products to the original 9 defaults? Your edits will be lost.')) return;
  veloResetProducts();
  showToast('Products reset to defaults');
  renderAdminTable();
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeProductForm();
});

document.addEventListener('DOMContentLoaded', renderAdminTable);
