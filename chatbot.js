(function () {
  'use strict';
  if (document.querySelector('.ai-chat')) return;

  const STORAGE_KEY = 'velvetVogueChat';
  const PRODUCTS = typeof window.veloGetProducts === 'function' ? window.veloGetProducts() : [];
  const starter = { role: 'assistant', text: "Welcome to Velvet Vogue. I'm your AI stylist — ask me about pieces, sizing, delivery, or what to wear." };

  document.body.insertAdjacentHTML('beforeend', `
    <section class="ai-chat" aria-label="AI stylist">
      <button class="ai-chat-launcher" type="button" aria-expanded="false" aria-controls="aiChatPanel"><span class="ai-launcher-spark">✦</span><span class="ai-launcher-label">Ask your stylist</span><span class="ai-launcher-close">×</span></button>
      <div class="ai-chat-panel" id="aiChatPanel" role="dialog" aria-modal="false" aria-hidden="true" aria-labelledby="aiChatTitle">
        <header class="ai-chat-header"><div><span class="ai-chat-mark">VV</span><span class="ai-online" aria-hidden="true"></span></div><div><p>Private client service</p><h2 id="aiChatTitle">AI Stylist</h2></div><button class="ai-chat-minimize" type="button" aria-label="Close chat">—</button></header>
        <div class="ai-chat-messages" aria-live="polite"></div>
        <div class="ai-chat-prompts"><button type="button">Find me a dress</button><button type="button">Help with sizing</button><button type="button">Delivery & returns</button></div>
        <form class="ai-chat-form"><label class="sr-only" for="aiChatInput">Message your AI stylist</label><textarea id="aiChatInput" rows="1" maxlength="500" placeholder="Ask your stylist…"></textarea><button type="submit" aria-label="Send message">↑</button></form>
        <p class="ai-chat-note">AI suggestions may not always be exact.</p>
      </div>
    </section>`);

  const root = document.querySelector('.ai-chat');
  const launcher = root.querySelector('.ai-chat-launcher');
  const panel = root.querySelector('.ai-chat-panel');
  const messagesEl = root.querySelector('.ai-chat-messages');
  const form = root.querySelector('.ai-chat-form');
  const input = root.querySelector('textarea');
  let history = readHistory();

  function readHistory() {
    try { const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)); return Array.isArray(saved) && saved.length ? saved.slice(-20) : [starter]; }
    catch (_) { return [starter]; }
  }
  function saveHistory() { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(-20))); } catch (_) {} }
  function escapeHTML(value) { return String(value).replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char])); }
  function render() {
    messagesEl.innerHTML = history.map(message => `<div class="ai-message ${message.role}">${message.role === 'assistant' ? '<span class="ai-message-icon">✦</span>' : ''}<div>${escapeHTML(message.text)}</div></div>`).join('');
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }
  function setOpen(open) {
    root.classList.toggle('open', open); launcher.setAttribute('aria-expanded', String(open)); panel.setAttribute('aria-hidden', String(!open));
    if (open) { render(); window.setTimeout(() => input.focus(), 250); }
  }
  function productReply(query) {
    if (!PRODUCTS.length) return '';
    const terms = query.toLowerCase().split(/\s+/).filter(word => word.length > 2);
    const matches = PRODUCTS.filter(product => `${product.name} ${product.category} ${product.material || ''}`.toLowerCase().split(' ').some(word => terms.some(term => word.includes(term)))).slice(0, 3);
    if (!matches.length) return '';
    return `I found ${matches.map(p => `${p.name} (${typeof window.veloFormatPrice === 'function' ? window.veloFormatPrice(p.price) : '$' + p.price})`).join(', ')}. You can find them in the collection or use search to view the details.`;
  }
  function createReply(query) {
    const q = query.toLowerCase(); const found = productReply(query); if (found) return found;
    if (/contact|email|phone|telephone|call/.test(q)) return 'You can reach Velvet Vogue at ameshnethsara77@gmail.com or call +94 74 261 7997. You can also open Contact Us from the footer.';
    if (/size|fit|measure/.test(q)) return 'For the most refined fit, choose your usual size. If you are between sizes, size up for tailored pieces and keep your usual size for relaxed silhouettes. Tell me the piece and your usual size for a closer suggestion.';
    if (/deliver|shipping|arrive/.test(q)) return 'Complimentary shipping is available on orders over $250. Standard delivery usually takes 3–5 business days; made-to-order pieces may take longer.';
    if (/return|refund|exchange/.test(q)) return 'You may return unworn pieces in their original condition within 30 days. Final-sale and personalised pieces are excluded.';
    if (/dress|wedding|event|occasion|wear|style|outfit/.test(q)) return 'For an occasion, I would begin with a fluid silk silhouette, then add a restrained heel and one sculptural accessory. What is the event, time of day, and preferred colour?';
    if (/material|fabric|care|wash/.test(q)) return 'Our collection favours silk, linen, cashmere and wool blends. Follow the care label; delicate natural fibres are best professionally cleaned or gently hand washed when permitted.';
    if (/hello|hi|hey/.test(q)) return 'Hello — lovely to meet you. Are you shopping for a particular occasion, piece, or mood today?';
    return 'I can help you discover a piece, build an outfit, choose a size, or answer questions about delivery and returns. Tell me what you have in mind.';
  }
  function send(text) {
    const value = text.trim(); if (!value) return;
    history.push({ role: 'user', text: value }); saveHistory(); render(); input.value = ''; input.style.height = '';
    const typing = document.createElement('div'); typing.className = 'ai-message assistant ai-typing'; typing.innerHTML = '<span class="ai-message-icon">✦</span><div><i></i><i></i><i></i></div>'; messagesEl.appendChild(typing); messagesEl.scrollTop = messagesEl.scrollHeight;
    window.setTimeout(() => { typing.remove(); history.push({ role: 'assistant', text: createReply(value) }); saveHistory(); render(); }, 650);
  }
  launcher.addEventListener('click', () => setOpen(!root.classList.contains('open')));
  root.querySelector('.ai-chat-minimize').addEventListener('click', () => setOpen(false));
  form.addEventListener('submit', event => { event.preventDefault(); send(input.value); });
  input.addEventListener('keydown', event => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); form.requestSubmit(); } });
  input.addEventListener('input', () => { input.style.height = 'auto'; input.style.height = `${Math.min(input.scrollHeight, 96)}px`; });
  root.querySelectorAll('.ai-chat-prompts button').forEach(button => button.addEventListener('click', () => send(button.textContent)));
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && root.classList.contains('open')) setOpen(false); });
  render();
}());
