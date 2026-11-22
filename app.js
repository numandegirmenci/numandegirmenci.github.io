'use strict';
const root = document.documentElement;
const themeBtn = document.getElementById('themeBtn');
const themeMeta = document.querySelector('meta[name="theme-color"]');
function updateTheme() {
  const dark = root.dataset.theme === 'dark';
  themeBtn.setAttribute('aria-label', dark ? 'Açık temaya geç' : 'Koyu temaya geç');
  themeMeta.setAttribute('content', dark ? '#121418' : '#f8f8f5');
}
updateTheme();
themeBtn.addEventListener('click', () => {
  root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  try { localStorage.setItem('nd-theme-v2', root.dataset.theme); } catch (_) {}
  updateTheme();
});
const menuBtn = document.getElementById('menuBtn');
const menu = document.getElementById('menu');
function closeMenu() { menu.classList.remove('open'); menuBtn.setAttribute('aria-expanded','false'); menuBtn.setAttribute('aria-label','Menüyü aç'); }
menuBtn.addEventListener('click',()=>{
  const open = menu.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded',String(open));
  menuBtn.setAttribute('aria-label',open?'Menüyü kapat':'Menüyü aç');
});
menu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
document.addEventListener('keydown', e => { if(e.key === 'Escape') closeMenu(); });
document.addEventListener('click', e => { if(!menu.contains(e.target)&&!menuBtn.contains(e.target)) closeMenu(); });
const toast=document.getElementById('toast');
let hideTimer;
function showToast(message){toast.textContent=message;toast.classList.add('show');clearTimeout(hideTimer);hideTimer=setTimeout(()=>toast.classList.remove('show'),2800);}
document.getElementById('copyProfile').addEventListener('click',async()=>{
  const url='https://github.com/numandegirmenci';
  try { await navigator.clipboard.writeText(url); showToast('GitHub profil bağlantısı kopyalandı.'); }
  catch (_){
    const temp=document.createElement('textarea'); temp.value=url;temp.style.position='fixed';temp.style.opacity='0';document.body.append(temp);temp.select();
    try {if(document.execCommand('copy'))showToast('GitHub profil bağlantısı kopyalandı.'); else showToast(url);}catch(e){showToast(url);} temp.remove();
  }
});
document.getElementById('year').textContent=String(new Date().getFullYear());
