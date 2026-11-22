'use strict';

// Sosyal bağlantılar yalnızca doğrulandıktan sonra etkinleştirilir.
const SOCIAL_URLS = {
  instagram: '',
  youtube: ''
};

const PREVIEWS = [
  {
    title: 'Günİzi',
    description: 'Android / Ses kaydı ve yerel analiz',
    image: './assets/gunizi.svg',
    alt: 'Günİzi için temsili Android uygulama görseli',
    href: 'https://github.com/numandegirmenci/gunizi-android'
  },
  {
    title: 'Türkçe PDF OCR',
    description: 'Tarayıcı / Belge ve tablo inceleme',
    image: './assets/ocr.svg',
    alt: 'Türkçe PDF OCR için temsili belge analizi görseli',
    href: 'https://github.com/numandegirmenci/vivaldi-turkce-pdf-ocr'
  },
  {
    title: 'İş ve Yanıt Radarı',
    description: 'Outlook / Açık işler ve yanıt takibi',
    image: './assets/outlook.svg',
    alt: 'Outlook İş ve Yanıt Radarı için temsili görev panosu',
    href: 'https://github.com/numandegirmenci/outlook-is-yanit-radari'
  },
  {
    title: 'PDF Sağ Tıkla Yazdır',
    description: 'Windows / Hızlı yazdırma aracı',
    image: './assets/pdf-tools.svg',
    alt: 'Windows PDF yazdırma için temsili bağlam menüsü',
    href: 'https://github.com/numandegirmenci/windows-pdf-sag-tik-yazdir'
  }
];

const root = document.documentElement;
const themeButton = document.getElementById('themeButton');
const themeMeta = document.querySelector('meta[name="theme-color"]');
function syncTheme() {
  const dark = root.dataset.theme === 'dark';
  themeButton.setAttribute('aria-label', dark ? 'Açık temaya geç' : 'Koyu temaya geç');
  themeButton.setAttribute('title', dark ? 'Açık temaya geç' : 'Koyu temaya geç');
  if (themeMeta) themeMeta.setAttribute('content', dark ? '#090d14' : '#f4f5f8');
}
function toggleTheme() {
  const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
  root.dataset.theme = next;
  try { localStorage.setItem('nd-theme-v5', next); } catch (error) {}
  syncTheme();
}
themeButton.addEventListener('click', toggleTheme);
syncTheme();

const menu = document.getElementById('navigation');
const menuButton = document.getElementById('menuButton');
function closeMenu() {
  menu.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Menüyü aç');
}
menuButton.addEventListener('click', () => {
  const next = !menu.classList.contains('open');
  menu.classList.toggle('open', next);
  menuButton.setAttribute('aria-expanded', String(next));
  menuButton.setAttribute('aria-label', next ? 'Menüyü kapat' : 'Menüyü aç');
});
menu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
document.addEventListener('click', (e) => {
  if (!menu.contains(e.target) && !menuButton.contains(e.target)) closeMenu();
});

const workspace = document.getElementById('heroWorkspace');
const img = document.getElementById('workspaceImage');
const name = document.getElementById('workspaceName');
const desc = document.getElementById('workspaceDescription');
const number = document.getElementById('workspaceCounter');
const repoLink = document.getElementById('workspaceLink');
const previewButtons = document.querySelectorAll('[data-preview]');
let currentPreview = 0;
let imageTransition;

function setPreview(index) {
  if (!Number.isInteger(index) || index < 0 || index >= PREVIEWS.length) return;
  currentPreview = index;
  const p = PREVIEWS[index];
  window.clearTimeout(imageTransition);
  img.classList.add('switching');
  const finish = () => {
    img.src = p.image;
    img.alt = p.alt;
    img.classList.remove('switching');
  };
  // Small transition only for a visual change; content labels update instantly.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) finish();
  else imageTransition = window.setTimeout(finish, 135);
  name.textContent = p.title;
  desc.textContent = p.description;
  number.textContent = String(index + 1).padStart(2, '0') + ' / ' + String(PREVIEWS.length).padStart(2, '0');
  repoLink.href = p.href;
  repoLink.setAttribute('aria-label', p.title + ' GitHub projesini aç');
  previewButtons.forEach(btn => {
    const selected = Number(btn.dataset.preview) === index;
    btn.classList.toggle('active', selected);
    btn.setAttribute('aria-pressed', String(selected));
  });
}
previewButtons.forEach(button => button.addEventListener('click', () => setPreview(Number(button.dataset.preview))));

// Desktop pointer: small decorative parallax, not essential to use.
if (window.matchMedia('(hover: hover) and (pointer: fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  workspace.addEventListener('pointermove', event => {
    const r = workspace.getBoundingClientRect();
    const x = Math.max(-1, Math.min(1, (event.clientX - r.left - r.width / 2) / (r.width / 2)));
    const y = Math.max(-1, Math.min(1, (event.clientY - r.top - r.height / 2) / (r.height / 2)));
    workspace.style.setProperty('--mouse-x', x.toFixed(2));
    workspace.style.setProperty('--mouse-y', y.toFixed(2));
  });
  workspace.addEventListener('pointerleave', () => {
    workspace.style.setProperty('--mouse-x', 0);
    workspace.style.setProperty('--mouse-y', 0);
  });
}

const galleryFilters = document.querySelectorAll('[data-filter]');
const cards = document.querySelectorAll('.project-card');
galleryFilters.forEach(btn => btn.addEventListener('click', () => {
  const selectedCategory = btn.dataset.filter;
  galleryFilters.forEach(filter => {
    const active = filter === btn;
    filter.classList.toggle('active', active);
    filter.setAttribute('aria-pressed', String(active));
  });
  cards.forEach(card => {
    card.hidden = selectedCategory !== 'all' && card.dataset.category !== selectedCategory;
  });
}));

const FOCUS = {
  operations: {
    index: '01 / 02',
    title: 'Operasyonun içinde',
    description: 'Mağaza açılışı, ruhsatlandırma, abonelik ve resmi kurum işlemleri gibi farklı tarafları aynı takvimde buluşturan süreçleri takip ediyorum.',
    glyph: '⌘',
    tags: ['Resmi kurumlar', 'Ruhsat', 'Abonelikler', 'Koordinasyon']
  },
  products: {
    index: '02 / 02',
    title: 'Dijital araçların başında',
    description: 'Tekrarlayan belge işlemleri, e-posta takibi ve uzun kayıtların analizini kolaylaştıran küçük araçlar üzerinde çalışıyorum.',
    glyph: '✳',
    tags: ['PDF / OCR', 'Outlook / VBA', 'Android', 'Yerel yapay zeka']
  }
};
const focusButtons = document.querySelectorAll('[data-focus]');
function selectFocus(key) {
  const f = FOCUS[key];
  if (!f) return;
  document.getElementById('focusIndex').textContent = f.index;
  document.getElementById('focusTitle').textContent = f.title;
  document.getElementById('focusDescription').textContent = f.description;
  document.getElementById('focusGlyph').textContent = f.glyph;
  document.getElementById('focusTags').replaceChildren(...f.tags.map(tag => {
    const node = document.createElement('span');
    node.textContent = tag;
    return node;
  }));
  focusButtons.forEach(btn => {
    const selected = btn.dataset.focus === key;
    btn.classList.toggle('active', selected);
    btn.setAttribute('aria-pressed', String(selected));
  });
}
focusButtons.forEach(btn => btn.addEventListener('click', () => selectFocus(btn.dataset.focus)));

const projectTriggers = document.querySelectorAll('[data-dialog]');
let lastModalTrigger = null;
projectTriggers.forEach(trigger => trigger.addEventListener('click', () => {
  const dialog = document.getElementById(trigger.dataset.dialog);
  if (!dialog) return;
  lastModalTrigger = trigger;
  if (typeof dialog.showModal === 'function') dialog.showModal();
  else dialog.setAttribute('open', '');
}));
document.querySelectorAll('.project-dialog').forEach(dialog => {
  dialog.querySelector('[data-close]')?.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener('close', () => lastModalTrigger?.focus());
});

// Remember: unverified profiles must not be exposed with guessed URLs.
for (const [platform, candidate] of Object.entries(SOCIAL_URLS)) {
  if (!candidate) continue;
  try {
    const u = new URL(candidate);
    if (u.protocol !== 'https:') continue;
    const domain = u.hostname.replace(/^www\./, '').toLowerCase();
    if (platform === 'instagram' && domain !== 'instagram.com') continue;
    if (platform === 'youtube' && !['youtube.com', 'youtu.be'].includes(domain)) continue;
    if (u.pathname === '/') continue;
    const link = document.querySelector('[data-social="' + platform + '"]');
    if (link) { link.href = u.href; link.hidden = false; }
  } catch (error) { /* Invalid profile URL: do not show */ }
}

const progress = document.getElementById('scrollProgress');
let ticking = false;
function updateProgress() {
  const available = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = (available > 0 ? Math.min(100, Math.max(0, window.scrollY / available * 100)) : 0) + '%';
  ticking = false;
}
window.addEventListener('scroll', () => {
  if (!ticking) { window.requestAnimationFrame(updateProgress); ticking = true; }
}, { passive: true });
window.addEventListener('resize', updateProgress);
updateProgress();

if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.body.classList.add('js-motion');
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    }
  }, {threshold:0.06, rootMargin:'0px 0px 34px 0px'});
  document.querySelectorAll('[data-reveal]').forEach(el => observer.observe(el));
}

// Quick keyboard access to preview 1–4, only outside text fields/dialogs.
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') closeMenu();
  if (event.altKey || event.ctrlKey || event.metaKey || event.repeat) return;
  const tag = event.target && event.target.tagName;
  if (['INPUT','TEXTAREA','SELECT'].includes(tag) || document.querySelector('dialog[open]')) return;
  if (/^[1-4]$/.test(event.key)) setPreview(Number(event.key) - 1);
});
document.getElementById('year').textContent = String(new Date().getFullYear());