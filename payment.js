const PAYMENT_BAG_KEY = 'velvet_vogue_bag_v1';
const orderBag = JSON.parse(localStorage.getItem(PAYMENT_BAG_KEY) || '[]');
const paymentMoney = value => '$' + Number(value).toLocaleString();
const subtotal = orderBag.reduce((sum, item) => sum + item.price * item.qty, 0);
document.getElementById('paymentSubtotal').textContent = paymentMoney(subtotal);
document.getElementById('paymentTotal').textContent = paymentMoney(subtotal);
document.getElementById('payButtonTotal').textContent = paymentMoney(subtotal);
document.getElementById('paymentSubmit').disabled = !orderBag.length;
document.getElementById('paymentItems').innerHTML = orderBag.length ? orderBag.map(item => `<div class="payment-item"><div><img src="${item.img}" alt="${item.name}"/><b>${item.qty}</b></div><span>${item.name}<small>${item.category}</small></span><strong>${paymentMoney(item.price * item.qty)}</strong></div>`).join('') : '<p class="payment-empty">Your bag is empty. Return to the boutique to add a piece.</p>';

const digitsOnly = value => value.replace(/\D/g, '');
document.getElementById('cardNumber').addEventListener('input', e => { e.target.value = digitsOnly(e.target.value).slice(0,16).replace(/(.{4})/g,'$1 ').trim(); });
document.getElementById('cardExpiry').addEventListener('input', e => { const v=digitsOnly(e.target.value).slice(0,4); e.target.value=v.length>2?v.slice(0,2)+'/'+v.slice(2):v; });
document.getElementById('cardCvc').addEventListener('input', e => { e.target.value=digitsOnly(e.target.value).slice(0,4); });
document.getElementById('paymentForm').addEventListener('submit', event => {
  event.preventDefault(); const form=event.currentTarget, error=document.getElementById('paymentError');
  if (!form.checkValidity() || digitsOnly(document.getElementById('cardNumber').value).length !== 16 || document.getElementById('cardExpiry').value.length !== 5 || document.getElementById('cardCvc').value.length < 3) { error.textContent='Please complete all required fields with valid details.'; form.reportValidity(); return; }
  error.textContent=''; const button=document.getElementById('paymentSubmit'); button.disabled=true; button.firstChild.textContent='Processing securely ';
  window.setTimeout(() => { localStorage.removeItem(PAYMENT_BAG_KEY); document.getElementById('orderReference').textContent='VV-'+Date.now().toString().slice(-8); const confirmation=document.getElementById('orderConfirmation'); confirmation.classList.add('open'); confirmation.setAttribute('aria-hidden','false'); }, 900);
});
