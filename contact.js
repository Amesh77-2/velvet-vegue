(function () {
  const form = document.getElementById('contactForm');
  if (!form) return;
  form.addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(form);
    const subject = `Velvet Vogue — ${data.get('subject')}`;
    const body = [
      `Name: ${data.get('name')}`,
      `Email: ${data.get('email')}`,
      data.get('order') ? `Order number: ${data.get('order')}` : '',
      '',
      data.get('message')
    ].filter(line => line !== '').join('\n');
    window.location.href = `mailto:ameshnethsara77@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
}());
