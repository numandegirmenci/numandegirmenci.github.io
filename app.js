'use strict';

const root = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const themeMeta = document.querySelector('meta[name="theme-color"]');
const menuToggle = document.getElementById('menuToggle');
const nav = document.getElementById('nav');

// Bağlantılar yalnızca doğrulandıktan sonra girilecek.
// Örnek: instagram: 'https://www.instagram.com/gercek_kullanici_adi/'
const SOCIAL_PROFILE_URLS = {
  instagram: '',
  youtube: '',
};

function syncTheme() {
  const isDark = root.dataset.theme === 'dark';
  themeToggle.setAttribute('aria-label', isDark ? 'Açık temaya geç' : 'Koyu temaya geç');
  themeToggle.setAttribute('title', isDark ? 'Açık temaya geç' : 'Koyu temaya geç');
  if (themeMeta) themeMeta.setAttribute('content', isDark ? '#0d1218' : '#f6f7f5');
}
syncTheme();

themeToggle.addEventListener('click', () => {
  const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
  root.dataset.theme = next;
  try { localStorage.setItem('nd-theme-v4', next); } catch (error) {}
  syncTheme();
});

function closeMenu() {
  nav.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Menüyü aç');
}
menuToggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Menüyü kapat' : 'Menüyü aç');
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') closeMenu();
});
document.addEventListener('click', event => {
  if (!nav.contains(event.target) && !menuToggle.contains(event.target)) closeMenu();
});

document.getElementById('year').textContent = String(new Date().getFullYear());

// Doğrulanmamış sosyal hesap adreslerini tahmin ederek yönlendirme yapma.
function recognizedSocialUrl(network, candidate) {
  if (!candidate) return null;
  try {
    const url = new URL(candidate);
    if (url.protocol !== 'https:') return null;
    const domain = url.hostname.replace(/^www\./, '').toLowerCase();
    const accepted = network === 'instagram' ? ['instagram.com'] : ['youtube.com', 'youtu.be'];
    if (!accepted.includes(domain) || url.pathname === '/') return null;
    return url.href;
  } catch (error) { return null; }
}

Object.entries(SOCIAL_PROFILE_URLS).forEach(([network, url]) => {
  const href = recognizedSocialUrl(network, url);
  if (!href) return;
  const card = document.querySelector('[data-social="' + network + '"]');
  if (!card) return;
  const link = document.createElement('a');
  link.className = 'social-card';
  link.href = href;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.setAttribute('aria-label', network === 'instagram' ? 'Instagram profilimi aç' : 'YouTube kanalımı aç');
  link.innerHTML = card.innerHTML;
  const small = link.querySelector('.social-copy small');
  if (small) small.textContent = network === 'instagram' ? 'Instagram profilim' : 'YouTube kanalım';
  const end = link.querySelector('.pending-label');
  if (end) { end.className = 'social-arrow'; end.textContent = '↗'; }
  card.replaceWith(link);
});
if (recognizedSocialUrl('instagram', SOCIAL_PROFILE_URLS.instagram) && recognizedSocialUrl('youtube', SOCIAL_PROFILE_URLS.youtube)) {
  const note = document.querySelector('.social-help');
  if (note) note.remove();
}