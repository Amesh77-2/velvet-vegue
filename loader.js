(function () {
  const THEME_KEY = 'velvet_vogue_theme';
  const savedTheme = localStorage.getItem(THEME_KEY);
  const initialTheme = savedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  document.documentElement.dataset.theme = initialTheme;

  const themeButton = document.createElement('button');
  themeButton.className = 'theme-toggle';
  themeButton.type = 'button';
  themeButton.innerHTML = '<span class="theme-sun">&#9788;</span><span class="theme-moon">&#9789;</span>';
  const updateThemeButton = theme => {
    const nextLabel = theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme';
    themeButton.setAttribute('aria-label', nextLabel);
    themeButton.setAttribute('title', nextLabel);
    themeButton.setAttribute('aria-pressed', String(theme === 'dark'));
  };
  themeButton.addEventListener('click', () => {
    const nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = nextTheme;
    localStorage.setItem(THEME_KEY, nextTheme);
    updateThemeButton(nextTheme);
  });
  updateThemeButton(initialTheme);
  document.body.appendChild(themeButton);

  // Shared navigation accessibility and mobile menu.
  const siteNav = document.querySelector('nav');
  const navLinks = siteNav?.querySelector('.nav-links');
  if (siteNav && navLinks) {
    const currentFile = window.location.pathname.split('/').pop() || 'index.html';
    navLinks.querySelectorAll('a').forEach(link => {
      if (link.getAttribute('href') === currentFile) link.setAttribute('aria-current', 'page');
    });
    const menuButton = document.createElement('button');
    menuButton.className = 'mobile-menu-toggle';
    menuButton.type = 'button';
    menuButton.setAttribute('aria-label', 'Open navigation menu');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.innerHTML = '<span></span><span></span>';
    siteNav.insertBefore(menuButton, siteNav.querySelector('.nav-right'));
    const closeMenu = () => {
      navLinks.classList.remove('mobile-open');
      menuButton.classList.remove('open');
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Open navigation menu');
    };
    menuButton.addEventListener('click', () => {
      const opening = !navLinks.classList.contains('mobile-open');
      navLinks.classList.toggle('mobile-open', opening);
      menuButton.classList.toggle('open', opening);
      menuButton.setAttribute('aria-expanded', String(opening));
      menuButton.setAttribute('aria-label', opening ? 'Close navigation menu' : 'Open navigation menu');
    });
    navLinks.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
    document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
  }

  // A compact return-to-top control appears only after meaningful scrolling.
  const backToTop = document.createElement('button');
  backToTop.className = 'back-to-top';
  backToTop.type = 'button';
  backToTop.setAttribute('aria-label', 'Back to top');
  backToTop.innerHTML = '&uarr;';
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  document.body.appendChild(backToTop);
  const updateBackToTop = () => backToTop.classList.toggle('show', window.scrollY > 700);
  window.addEventListener('scroll', updateBackToTop, { passive: true });
  updateBackToTop();

  const loader = document.querySelector('.page-loader');
  if (!loader) return;

  const pageNames = {
    'index.html': 'The Boutique', '': 'The Boutique',
    'new-in.html': 'New Arrivals', 'lookbook.html': 'The Lookbook',
    'designers.html': 'Our Designers', 'world.html': 'Our World',
    'search.html': 'Private Discovery', 'bag.html': 'Shopping Bag',
    'payment.html': 'Secure Checkout', 'account.html': 'My Account',
    'wishlist.html': 'My Wishlist', 'admin.html': 'Administration',
    'admin-login.html': 'Private Access'
  };
  const fileName = window.location.pathname.split('/').pop().toLowerCase();
  const isHomePage = fileName === '' || fileName === 'index.html';
  if (isHomePage) document.body.classList.add('home-loading');
  const logo = document.createElement('img');
  logo.className = 'loader-logo';
  logo.src = './assets/velvet-vogue-monogram.png';
  logo.alt = '';
  const pageLabel = document.createElement('p');
  pageLabel.className = 'loader-page-name';
  pageLabel.textContent = pageNames[fileName] || document.title.split('—')[0].trim();
  loader.prepend(logo);
  loader.querySelector('.loader-mark')?.insertAdjacentElement('afterend', pageLabel);

  document.documentElement.classList.add('is-loading');

  let dismissed = false;
  const dismissLoader = () => {
    if (dismissed) return;
    dismissed = true;
    document.body.classList.add('page-entered');
    document.body.classList.remove('home-loading');
    loader.classList.add('is-hidden');
    document.documentElement.classList.remove('is-loading');
    window.setTimeout(() => loader.remove(), 900);
  };

  // Keep the transition visible briefly, then release as soon as the page is ready.
  const startedAt = performance.now();
  window.addEventListener('load', () => {
    const remaining = Math.max(0, 2000 - (performance.now() - startedAt));
    window.setTimeout(dismissLoader, remaining);
  }, { once: true });

  // Safety release for slow or unavailable third-party assets.
  window.setTimeout(dismissLoader, 4000);
})();

// Load the customer-facing AI stylist everywhere except the administration area.
if (!/admin(?:-login)?\.html$/i.test(window.location.pathname)) {
  if (!document.querySelector('link[href="concierge.css"]')) {
    const conciergeStyles = document.createElement('link');
    conciergeStyles.rel = 'stylesheet';
    conciergeStyles.href = 'concierge.css';
    document.head.appendChild(conciergeStyles);
  }
  document.body.insertAdjacentHTML('beforeend', `
    <aside class="concierge-contact" aria-label="Client service contact details">
      <button class="concierge-toggle" type="button" aria-expanded="false" aria-label="Open client service contact details"><span>✦</span><b>Client Service</b></button>
      <div class="concierge-card">
        <div class="concierge-card-head"><span>Velvet Vogue</span><button type="button" aria-label="Close contact details">×</button></div>
        <p>Private client service</p>
        <h2>How may we <em>assist?</em></h2>
        <a href="mailto:ameshnethsara77@gmail.com"><small>Email our atelier</small><strong>ameshnethsara77@gmail.com</strong></a>
        <a href="tel:+94742617997"><small>Speak with an advisor</small><strong>+94 74 261 7997</strong></a>
        <a class="concierge-page-link" href="contact.html">Contact us <span>→</span></a>
      </div>
    </aside>`);

  /*
  const socialLinks = `
    <a href="https://x.com/" target="_blank" rel="noopener noreferrer" aria-label="Velvet Vogue on X" title="X">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 3h4.6l3.8 5.1L16.8 3H20l-6.1 7.3L20.5 21h-4.6l-4.3-5.8L6.7 21H3.5l6.6-8L4 3Zm3.1 1.7 9.7 14.6h1.1L8.2 4.7H7.1Z"/></svg>
    </a>
    <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" aria-label="Velvet Vogue on Instagram" title="Instagram">
      <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle class="social-fill" cx="17.8" cy="6.4" r="1"/></svg>
    </a>
    <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" aria-label="Velvet Vogue on Facebook" title="Facebook">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.2 21v-8h2.7l.4-3.1h-3.1v-2c0-.9.3-1.5 1.6-1.5h1.7V3.6c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.1H8V13h2.8v8h3.4Z"/></svg>
    </a>
    <a href="https://www.pinterest.com/" target="_blank" rel="noopener noreferrer" aria-label="Velvet Vogue on Pinterest" title="Pinterest">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.2a8.8 8.8 0 0 0-3.2 17c-.1-1.4 0-3 .4-4.3l1.1-4.5s-.3-.7-.3-1.7c0-1.6.9-2.8 2.1-2.8 1 0 1.5.7 1.5 1.6 0 1-.6 2.5-.9 3.9-.3 1.2.6 2.1 1.8 2.1 2.2 0 3.7-2.8 3.7-6.1 0-2.5-2-4.4-5.5-4.4-4 0-6.4 3-6.4 6.3 0 1.1.3 2.3 1 3 .3.3.3.4.2.8l-.3 1.2c-.1.4-.5.5-.9.4-2.4-1-3.5-3.8-3.5-6.8 0-5.1 4.3-11.2 12.5-11.2 6.7 0 11.1 4.8 11.1 10 0 6.9-3.8 12-9.5 12-1.9 0-3.8-1-4.4-2.2l-1.2 4.6c-.4 1.3-1.1 2.7-1.8 3.7.8.2 1.7.4 2.6.4A8.8 8.8 0 1 0 12 3.2Z" transform="scale(.82) translate(2.6 1.7)"/></svg>
    </a>`;
  document.body.insertAdjacentHTML('beforeend', `<nav class="social-entry" aria-label="Follow Velvet Vogue"><span>Follow</span>${socialLinks}</nav>`);
  document.querySelectorAll('.footer-socials').forEach(container => {
    container.innerHTML = socialLinks;
    container.setAttribute('aria-label', 'Velvet Vogue social media');
  });

  */
  const footerSocialLinks = `
    <a href="https://x.com/" target="_blank" rel="noopener noreferrer" aria-label="Follow Velvet Vogue on X" title="X"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 3h4.6l3.8 5.1L16.8 3H20l-6.1 7.3L20.5 21h-4.6l-4.3-5.8L6.7 21H3.5l6.6-8L4 3Zm3.1 1.7 9.7 14.6h1.1L8.2 4.7H7.1Z"/></svg></a>
    <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" aria-label="Follow Velvet Vogue on Facebook" title="Facebook"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.2 21v-8h2.7l.4-3.1h-3.1v-2c0-.9.3-1.5 1.6-1.5h1.7V3.6c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.1H8V13h2.8v8h3.4Z"/></svg></a>
    <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" aria-label="Follow Velvet Vogue on Instagram" title="Instagram"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle class="social-dot" cx="17.8" cy="6.4" r="1"/></svg></a>
    <a href="https://www.pinterest.com/" target="_blank" rel="noopener noreferrer" aria-label="Follow Velvet Vogue on Pinterest" title="Pinterest"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.8a9.2 9.2 0 0 0-3.4 17.8c-.1-1.5 0-3.2.4-4.6l1.2-4.8s-.3-.7-.3-1.8c0-1.7 1-3 2.2-3 1 0 1.5.8 1.5 1.7 0 1-.7 2.6-1 4.1-.3 1.2.6 2.2 1.8 2.2 2.2 0 3.8-2.8 3.8-6.2 0-2.6-2.1-4.5-5.6-4.5-4 0-6.5 3-6.5 6.4 0 1.2.3 2.3 1 3 .3.3.3.4.2.8l-.3 1.2c-.1.4-.5.5-.9.4-2.4-1-3.5-3.8-3.5-6.8C2.6 3.6 6.9-1 15.2-1c6.8 0 11.2 4.8 11.2 10.1 0 7-3.8 12.1-9.6 12.1-1.9 0-3.8-1-4.4-2.2l-1.2 4.7" transform="scale(.78) translate(2.9 2.1)"/></svg></a>`;
  document.querySelectorAll('.footer-socials').forEach(container => {
    container.innerHTML = footerSocialLinks;
    container.setAttribute('aria-label', 'Velvet Vogue social media');
  });

  const concierge = document.querySelector('.concierge-contact');
  const conciergeToggle = concierge.querySelector('.concierge-toggle');
  const setConciergeOpen = open => {
    concierge.classList.toggle('open', open);
    conciergeToggle.setAttribute('aria-expanded', String(open));
  };
  conciergeToggle.addEventListener('click', () => setConciergeOpen(!concierge.classList.contains('open')));
  concierge.querySelector('.concierge-card-head button').addEventListener('click', () => setConciergeOpen(false));

  const stylistScript = document.createElement('script');
  stylistScript.src = 'chatbot.js';
  stylistScript.defer = true;
  document.body.appendChild(stylistScript);
}
