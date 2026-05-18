/* === NAV === */
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');
const siteHeader = document.querySelector('.site-header');

// Create backdrop
const backdrop = document.createElement('div');
backdrop.className = 'menu-backdrop';
document.body.appendChild(backdrop);

// Store hrefs as data attributes before splitting into spans
document.querySelectorAll('.mobile-link').forEach(link => {
  const href = link.getAttribute('href');
  link.dataset.href = href || '';
  const text = link.textContent.trim();
  link.innerHTML = text.split('').map((char, i) =>
    `<span class="letter" data-index="${i}" style="transition-delay: 0ms">${char === ' ' ? '&nbsp;' : char}</span>`
  ).join('');
});

// Draw gold speckle on menu canvas
function drawSpeckle(menu) {
  if (menu.querySelector('.menu-speckle')) return;
  const canvas = document.createElement('canvas');
  canvas.className = 'menu-speckle';
  menu.insertBefore(canvas, menu.firstChild);
  const w = menu.offsetWidth;
  const h = menu.offsetHeight;
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  const count = Math.floor((w * h) / 120);
  for (let i = 0; i < count; i++) {
    const x = Math.random() * w;
    const y = Math.random() * h;
    const r = Math.random() * 1.8 + 0.2;
    const op = Math.random() * 0.5 + 0.05;
    const hue = 34 + Math.random() * 16;
    const sat = 55 + Math.random() * 35;
    const lit = 42 + Math.random() * 28;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${hue}, ${sat}%, ${lit}%, ${op})`;
    ctx.fill();
  }
  for (let i = 0; i < count * 0.07; i++) {
    const x = Math.random() * w;
    const y = Math.random() * h;
    const rx = Math.random() * 3.5 + 0.8;
    const ry = rx * (0.25 + Math.random() * 0.75);
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, Math.random() * Math.PI, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(38, 68%, 48%, ${Math.random() * 0.2 + 0.04})`;
    ctx.fill();
  }
}

// Stagger letters in
function animateLinksIn() {
  document.querySelectorAll('.mobile-link').forEach((link, linkIdx) => {
    const letters = link.querySelectorAll('.letter');
    letters.forEach((letter, j) => {
      letter.classList.remove('closing');
      const delay = 200 + linkIdx * 160 + j * 35;
      letter.style.transitionDelay = `${delay}ms`;
    });
  });
}

// Stagger letters out — last to first per word
function animateLinksOut() {
  document.querySelectorAll('.mobile-link').forEach(link => {
    const letters = link.querySelectorAll('.letter');
    const lastIdx = letters.length - 1;
    letters.forEach((letter, j) => {
      const delay = (lastIdx - j) * 55;
      letter.style.transitionDelay = `${delay}ms`;
      letter.classList.add('closing');
    });
  });
}

let speckleDrawn = false;

function openMenu() {
  if (!speckleDrawn) {
    drawSpeckle(mobileMenu);
    speckleDrawn = true;
  }
  mobileMenu.classList.add('open');
  hamburger.classList.add('open');
  backdrop.classList.add('open');
  siteHeader?.classList.add('menu-open');
  hamburger.setAttribute('aria-expanded', 'true');
  mobileMenu.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  animateLinksIn();
}

function closeMenu() {
  animateLinksOut();
  mobileMenu.classList.remove('open');
  hamburger.classList.remove('open');
  backdrop.classList.remove('open');
  siteHeader?.classList.remove('menu-open');
  hamburger.setAttribute('aria-expanded', 'false');
  mobileMenu.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

hamburger?.addEventListener('click', () => {
  mobileMenu.classList.contains('open') ? closeMenu() : openMenu();
});

backdrop.addEventListener('click', closeMenu);

// Navigate using data-href attribute
document.querySelectorAll('.mobile-link').forEach(a => {
  a.addEventListener('click', (e) => {
    e.preventDefault();
    const href = a.dataset.href;
    if (href) window.location.href = href;
    closeMenu();
  });
});

document.querySelector('.menu-close')?.addEventListener('click', closeMenu);

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeMenu();
});

/* === UTILS === */
function textToHtml(str) {
  if (!str) return '';
  return str.split(/\n\n+/).filter(p => p.trim()).map(p => `<p>${p.trim().replace(/\n/g, '<br>')}</p>`).join('');
}

function vimeoId(url) {
  const m = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  return m ? m[1] : null;
}

function youtubeId(url) {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes('youtube.com')) return parsed.searchParams.get('v');
    if (parsed.hostname.includes('youtu.be')) return parsed.pathname.replace('/', '').split('/')[0];
  } catch (err) { return null; }
  return null;
}

function isHlsUrl(url) { return url.endsWith('.m3u8'); }

function initHlsVideos(root = document) {
  root.querySelectorAll('video[data-hls-src]').forEach(video => {
    const src = video.dataset.hlsSrc;
    if (!src) return;
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src;
    } else if (window.Hls && Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(video);
    }
  });
}

function renderMediaItem(item) {
  let media = '';
  if (item.type === 'video') {
    const url = item.url || '';
    const vid = vimeoId(url);
    const yid = youtubeId(url);
    if (yid) {
      media = `<div class="lb-video-wrap"><iframe src="https://www.youtube.com/embed/${yid}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div>`;
    } else if (vid) {
      media = `<div class="lb-video-wrap"><iframe src="https://player.vimeo.com/video/${vid}?dnt=1" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe></div>`;
    } else if (url) {
      const attrs = isHlsUrl(url) ? `data-hls-src="${url}"` : `src="${url}"`;
      media = `<div class="lb-video-wrap"><video ${attrs} controls playsinline></video></div>`;
    }
  } else {
    const src = item.image || item.url || '';
    if (src) media = `<img src="${src}" alt="${item.caption || ''}" loading="lazy">`;
  }
  const caption = item.caption ? `<p class="lb-caption">${item.caption}</p>` : '';
  return media || caption ? `<div class="lb-media-item">${media}${caption}</div>` : '';
}

/* === LIGHTBOX === */
let projectsData = [];

function openLightbox(project) {
  const lightbox = document.getElementById('lightbox');
  document.getElementById('lb-title').textContent = project.title || '';
  document.getElementById('lb-client').textContent = project.client || '';
  document.getElementById('lb-description').innerHTML = textToHtml(project.description);
  document.getElementById('lb-media').innerHTML = (project.media || []).map(renderMediaItem).join('');
  initHlsVideos(document.getElementById('lb-media'));
  lightbox.removeAttribute('hidden');
  document.body.style.overflow = 'hidden';
  lightbox.scrollTop = 0;
}

function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  lightbox.setAttribute('hidden', '');
  document.body.style.overflow = '';
}

document.getElementById('lightbox-close')?.addEventListener('click', closeLightbox);
document.getElementById('lightbox')?.addEventListener('click', e => { if (e.target === e.currentTarget) closeLightbox(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

/* === WORK PAGE === */
async function loadProjects() {
  const container = document.getElementById('projects');
  if (!container) return;
  try {
    const res = await fetch('content/projects.json');
    if (!res.ok) throw new Error(res.statusText);
    const data = await res.json();
    projectsData = data.items || [];
    const intro = document.getElementById('work-intro');
    if (intro && data.work_intro) intro.textContent = data.work_intro;
    if (!projectsData.length) {
      container.innerHTML = '<p class="projects-loading">No projects yet.</p>';
      return;
    }
    container.innerHTML = projectsData.map((project, i) => {
      const thumb = project.thumbnail ? `<img src="${project.thumbnail}" alt="${project.title || ''}" loading="lazy">` : '';
      const emptyClass = project.thumbnail ? '' : ' project-thumb--empty';
      return `<article class="project-card" data-index="${i}" role="button" tabindex="0" aria-label="Open ${project.title}">
        <div class="project-thumb${emptyClass}">${thumb}
          <div class="project-overlay">
            <h2 class="project-title">${project.title || ''}</h2>
            ${project.client ? `<p class="project-client">${project.client}</p>` : ''}
          </div>
        </div>
      </article>`;
    }).join('');
    container.querySelectorAll('.project-card').forEach(card => {
      const open = () => openLightbox(projectsData[parseInt(card.dataset.index)]);
      card.addEventListener('click', open);
      card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') open(); });
    });
  } catch (err) {
    console.error('Failed to load projects:', err);
    container.innerHTML = '<p class="projects-loading">Could not load projects.</p>';
  }
}

/* === ABOUT PAGE === */
async function loadAbout() {
  const body = document.getElementById('about-body');
  const headshot = document.getElementById('about-headshot');
  if (!body && !headshot) return;
  try {
    const res = await fetch('content/about.json');
    if (!res.ok) throw new Error(res.statusText);
    const data = await res.json();
    if (headshot && data.headshot) headshot.src = data.headshot;
    if (body && data.body) body.innerHTML = textToHtml(data.body);
  } catch (err) { console.error('Failed to load about:', err); }
}

/* === PRACTICE PAGE === */
async function loadPractice() {
  const body = document.getElementById('practice-body');
  if (!body) return;
  try {
    const res = await fetch('content/practice.json');
    if (!res.ok) throw new Error(res.statusText);
    const data = await res.json();
    if (data.body) body.innerHTML = textToHtml(data.body);
  } catch (err) { console.error('Failed to load practice:', err); }
}

/* === FOOTER === */
async function loadFooter() {
  const footers = document.querySelectorAll('.site-footer');
  if (!footers.length) return;
  try {
    const res = await fetch('content/footer.json');
    if (!res.ok) throw new Error(res.statusText);
    const data = await res.json();
    footers.forEach(footer => {
      const mark = footer.querySelector('.footer-mark');
      const est = footer.querySelector('.footer-est');
      const email = footer.querySelector('.footer-email');
      if (mark && data.mark) mark.innerHTML = data.mark;
      if (est && data.est) est.textContent = data.est;
      if (email && data.email) { email.textContent = data.email; email.href = `mailto:${data.email}`; }
    });
  } catch (err) { console.error('Failed to load footer:', err); }
}

/* === INIT === */
loadProjects();
loadAbout();
loadPractice();
loadFooter();
