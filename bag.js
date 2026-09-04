const BAG_KEY = 'velvet_vogue_bag_v1';
const bagList = document.getElementById('bagList');
let bag = JSON.parse(localStorage.getItem(BAG_KEY) || '[]');
const money = value => '$' + Number(value).toLocaleString();
function saveBag() { localStorage.setItem(BAG_KEY, JSON.stringify(bag)); renderBag(); }
function changeQty(id, delta) { const item = bag.find(x => x.id === id); if (!item) return; item.qty += delta; if (item.qty < 1) bag = bag.filter(x => x.id !== id); saveBag(); }
function removeItem(id) { bag = bag.filter(x => x.id !== id); saveBag(); }
function renderBag() {
  const count = bag.reduce((n,x) => n + x.qty, 0), subtotal = bag.reduce((n,x) => n + x.price * x.qty, 0);
  document.getElementById('bagItemCount').textContent = `${count} ${count === 1 ? 'piece' : 'pieces'}`;
  document.getElementById('bagSubtotal').textContent = money(subtotal); document.getElementById('bagTotal').textContent = money(subtotal); document.getElementById('checkoutButton').disabled = !count;
  bagList.innerHTML = bag.length ? bag.map(item => `<article class="bag-item"><div class="bag-item-image">${item.img ? `<img src="${item.img}" alt="${item.name}"/>` : ''}</div><div class="bag-item-info"><p>${item.category}</p><h2>${item.name}</h2><span>Selected size · M</span><div class="bag-qty"><button onclick="changeQty('${item.id}',-1)">−</button><b>${item.qty}</b><button onclick="changeQty('${item.id}',1)">+</button></div><button class="bag-remove" onclick="removeItem('${item.id}')">Remove</button></div><strong class="bag-item-price">${money(item.price * item.qty)}</strong></article>`).join('') : `<div class="bag-empty"><p>Your bag is waiting.</p><a href="index.html">Discover the collection</a></div>`;
}
document.getElementById('checkoutButton').addEventListener('click', () => { window.location.href = 'payment.html'; });
renderBag();
