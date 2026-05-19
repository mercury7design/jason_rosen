/* === NAV === */
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');
const siteHeader = document.querySelector('.site-header');

const backdrop = document.createElement('div');
backdrop.className = 'menu-backdrop';
document.body.appendChild(backdrop);

document.querySelectorAll('.mobile-link').forEach(link => {
  link.dataset.href = link.getAttribute('href') || '';
  const text = link.textContent.trim();
  link.innerHTML = text.split('').map((char, i) =>
    `<span class="letter" data-index="${i}" style="transition-delay: 0ms">${char === ' ' ? '&nbsp;' : char}</span>`
  ).join('');
});

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

function animateLinksIn() {
  document.querySelectorAll('.mobile-link').forEach((link, linkIdx) => {
    const letters = link.querySelectorAll('.letter');
    letters.forEach((letter, j) => {
      letter.classList.remove('closing');
      letter.style.transitionDelay = `${200 + linkIdx * 160 + j * 35}ms`;
    });
  });
}

function animateLinksOut() {
  document.querySelectorAll('.mobile-link').forEach(link => {
    const letters = link.querySelectorAll('.letter');
    const lastIdx = letters.length - 1;
    letters.forEach((letter, j) => {
      letter.style.transitionDelay = `${(lastIdx - j) * 55}ms`;
      letter.classList.add('closing');
    });
  });
}

let speckleDrawn = false;

function openMenu() {
  if (!speckleDrawn) { drawSpeckle(mobileMenu); speckleDrawn = true; }
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
  backdrop.style.pointerEvents = 'none';
  animateLinksOut();
  mobileMenu.classList.remove('open');
  hamburger.classList.remove('open');
  backdrop.classList.remove('open');
  siteHeader?.classList.remove('menu-open');
  hamburger.setAttribute('aria-expanded', 'false');
  mobileMenu.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  setTimeout(() => { backdrop.style.pointerEvents = ''; }, 1100);
}

hamburger?.addEventListener('click', () => {
  mobileMenu.classList.contains('open') ? closeMenu() : openMenu();
});
backdrop.addEventListener('click', closeMenu);

document.querySelectorAll('.mobile-link').forEach(a => {
  a.addEventListener('click', (e) => {
    e.preventDefault();
    const href = a.dataset.href;
    closeMenu();
    setTimeout(() => { if (href) window.location.href = href; }, 200);
  });
});

document.querySelector('.menu-close')?.addEventListener('click', closeMenu);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

/* === UTILS === */
function textToHtml(str) {
  if (!str) return '';
  return str.split(/\n\n+/).filter(p => p.trim()).map(p => `<p>${p.trim().replace(/\n/g, '<br>')}</p>`).join('');
}
function vimeoId(url) { const m = url.match(/vimeo\.com\/(?:video\/)?(\d+)/); return m ? m[1] : null; }
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
    if (video.canPlayType('application/vnd.apple.mpegurl')) { video.src = src; }
    else if (window.Hls && Hls.isSupported()) { const hls = new Hls(); hls.loadSource(src); hls.attachMedia(video); }
  });
}

function renderMediaItem(item) {
  let media = '';
  if (item.type === 'video') {
    const url = item.url || '';
    const vid = vimeoId(url);
    const yid = youtubeId(url);
    if (yid) media = `<div class="lb-video-wrap"><iframe src="https://www.youtube.com/embed/${yid}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div>`;
    else if (vid) media = `<div class="lb-video-wrap"><iframe src="https://player.vimeo.com/video/${vid}?dnt=1&autoplay=1&loop=1&muted=1" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe></div>`;
    else if (url) { const attrs = isHlsUrl(url) ? `data-hls-src="${url}"` : `src="${url}"`; media = `<div class="lb-video-wrap"><video ${attrs} controls playsinline></video></div>`; }
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
  if (hamburger) hamburger.style.display = 'none';
}

function closeLightbox() {
  document.getElementById('lightbox').setAttribute('hidden', '');
  document.body.style.overflow = '';
  if (hamburger) hamburger.style.display = '';
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
    if (!projectsData.length) { container.innerHTML = '<p class="projects-loading">No projects yet.</p>'; return; }
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
  } catch (err) { console.error('Failed to load projects:', err); container.innerHTML = '<p class="projects-loading">Could not load projects.</p>'; }
}

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

/* === EPHEMERA — LOGO GLINT ANIMATION === */
function initEphemera() {
  const heroEl = document.querySelector('.work-hero');
  const logoEl = document.querySelector('.site-mark');
  if (!heroEl || !logoEl) return;

  const heroCanvas = document.createElement('canvas');
  heroCanvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:2;';
  heroEl.appendChild(heroCanvas);
  const heroCtx = heroCanvas.getContext('2d');

  const logoCanvas = document.createElement('canvas');
  logoCanvas.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;';
  const logoWrap = document.createElement('div');
  logoWrap.style.cssText = 'position:relative;display:inline-block;line-height:0;';
  logoEl.parentNode.insertBefore(logoWrap, logoEl);
  logoWrap.appendChild(logoEl);
  logoWrap.appendChild(logoCanvas);
  const logoCtx = logoCanvas.getContext('2d');

  function resize() {
    heroCanvas.width = heroEl.offsetWidth;
    heroCanvas.height = heroEl.offsetHeight;
    logoCanvas.width = logoEl.offsetWidth;
    logoCanvas.height = logoEl.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  let frame = 0;
  const FOG_DURATION = 180;
  const FOG_DELAY = 20;
  let fogFrame = 0;
  let fogDone = false;
  let sparkleActive = false;
  let glintPhase = 0;
  let glintWait = 0;
  const GLINT_DURATION = 70;
  const GLINT_PAUSE = 320;

  function easeInOut(t) { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; }
  function getSx() { return logoCanvas.width * 0.50; }
  function getSy() { return logoCanvas.height * 0.23; }

  function drawStarGlint(ctx, x, y, size, opacity) {
    ctx.save();
    ctx.globalAlpha = opacity;
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2;
      const longR = size;
      const shortR = size * 0.15;
      const a1 = angle - Math.PI / 4 * 0.3;
      const a3 = angle + Math.PI / 4 * 0.3;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + Math.cos(a1) * shortR, y + Math.sin(a1) * shortR);
      ctx.lineTo(x + Math.cos(angle) * longR, y + Math.sin(angle) * longR);
      ctx.lineTo(x + Math.cos(a3) * shortR, y + Math.sin(a3) * shortR);
      ctx.closePath();
      const grad = ctx.createRadialGradient(x, y, 0, x, y, longR);
      grad.addColorStop(0, 'rgba(255,255,255,1)');
      grad.addColorStop(0.3, 'rgba(255,248,200,0.8)');
      grad.addColorStop(1, 'rgba(255,240,150,0)');
      ctx.fillStyle = grad;
      ctx.fill();
    }
    const spot = ctx.createRadialGradient(x, y, 0, x, y, size * 0.4);
    spot.addColorStop(0, 'rgba(255,255,255,1)');
    spot.addColorStop(0.5, 'rgba(255,252,220,0.6)');
    spot.addColorStop(1, 'rgba(255,248,180,0)');
    ctx.beginPath();
    ctx.arc(x, y, size * 0.4, 0, Math.PI * 2);
    ctx.fillStyle = spot;
    ctx.fill();
    ctx.restore();
  }

  function drawGlimmer(ctx, x, y, size, opacity) {
    ctx.save();
    [0, Math.PI/2, Math.PI, Math.PI*1.5].forEach(angle => {
      const grad = ctx.createLinearGradient(x, y, x + Math.cos(angle) * size, y + Math.sin(angle) * size);
      grad.addColorStop(0, `rgba(255,255,255,${opacity})`);
      grad.addColorStop(0.2, `rgba(255,252,210,${opacity * 0.8})`);
      grad.addColorStop(1, 'rgba(255,240,140,0)');
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + Math.cos(angle) * size, y + Math.sin(angle) * size);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.2;
      ctx.lineCap = 'round';
      ctx.stroke();
    });
    [Math.PI/4, Math.PI*3/4, Math.PI*5/4, Math.PI*7/4].forEach(angle => {
      const grad = ctx.createLinearGradient(x, y, x + Math.cos(angle) * size * 0.45, y + Math.sin(angle) * size * 0.45);
      grad.addColorStop(0, `rgba(255,255,255,${opacity * 0.7})`);
      grad.addColorStop(1, 'rgba(255,240,140,0)');
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + Math.cos(angle) * size * 0.45, y + Math.sin(angle) * size * 0.45);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 0.7;
      ctx.lineCap = 'round';
      ctx.stroke();
    });
    const center = ctx.createRadialGradient(x, y, 0, x, y, size * 0.25);
    center.addColorStop(0, `rgba(255,255,255,${opacity})`);
    center.addColorStop(1, 'rgba(255,248,180,0)');
    ctx.beginPath();
    ctx.arc(x, y, size * 0.25, 0, Math.PI * 2);
    ctx.fillStyle = center;
    ctx.fill();
    ctx.restore();
  }

  function drawFrame() {
    frame++;
    const HW = heroCanvas.width;
    const HH = heroCanvas.height;
    const LW = logoCanvas.width;
    const LH = logoCanvas.height;
    const sx = getSx();
    const sy = getSy();

    // Fog sweep
    heroCtx.clearRect(0, 0, HW, HH);
    if (frame > FOG_DELAY && !fogDone) {
      fogFrame++;
      const t = Math.min(1, fogFrame / FOG_DURATION);
      const eased = easeInOut(t);
      const diagLen = Math.sqrt(HW * HW + HH * HH);
      const fogHead = eased * (diagLen + 300);
      const angle = Math.atan2(HH, HW);
      const fogW = 320;
      const headX = Math.cos(angle) * fogHead;
      const headY = Math.sin(angle) * fogHead;
      const tailX = Math.cos(angle) * Math.max(0, fogHead - fogW);
      const tailY = Math.sin(angle) * Math.max(0, fogHead - fogW);
      const grad = heroCtx.createLinearGradient(tailX, tailY, headX, headY);
      grad.addColorStop(0, 'rgba(255,252,240,0)');
      grad.addColorStop(0.25, 'rgba(255,250,235,0.03)');
      grad.addColorStop(0.55, 'rgba(255,248,228,0.08)');
      grad.addColorStop(0.8, 'rgba(255,252,240,0.05)');
      grad.addColorStop(1, 'rgba(255,255,255,0)');
      heroCtx.fillStyle = grad;
      heroCtx.fillRect(0, 0, HW, HH);
      const logoCenterX = HW / 2;
      const logoCenterY = HH * 0.4;
      const logoDiagDist = Math.cos(angle) * logoCenterX + Math.sin(angle) * logoCenterY;
      if (fogHead > logoDiagDist && !sparkleActive) { sparkleActive = true; glintPhase = 0; }
      if (t >= 1) fogDone = true;
    }

    // Sparkle — canvas only draws effects, logo image shows through underneath
    logoCtx.clearRect(0, 0, LW, LH);

    if (sparkleActive) {
      glintPhase++;
      const t = glintPhase / GLINT_DURATION;
      if (t <= 1) {
        const op = t < 0.4 ? easeInOut(t / 0.4) : 1 - easeInOut((t - 0.4) / 0.6);
        const glintSize = 8 + op * 6;
        const halo = logoCtx.createRadialGradient(sx, sy, 0, sx, sy, glintSize * 4);
        halo.addColorStop(0, `rgba(255,248,180,${op * 0.7})`);
        halo.addColorStop(0.5, `rgba(255,240,140,${op * 0.2})`);
        halo.addColorStop(1, 'rgba(255,230,100,0)');
        logoCtx.beginPath();
        logoCtx.arc(sx, sy, glintSize * 4, 0, Math.PI * 2);
        logoCtx.fillStyle = halo;
        logoCtx.fill();
        drawStarGlint(logoCtx, sx, sy, glintSize, op);
        const t2 = Math.max(0, (t - 0.35) / 0.65);
        if (t2 > 0) {
          const op2 = t2 < 0.4 ? easeInOut(t2 / 0.4) : 1 - easeInOut((t2 - 0.4) / 0.6);
          drawStarGlint(logoCtx, sx, sy + 12, glintSize * 0.52, op2 * 0.65);
        }
        const t3 = Math.max(0, (t - 0.55) / 0.45);
        if (t3 > 0) {
          const op3 = t3 < 0.4 ? easeInOut(t3 / 0.4) : 1 - easeInOut((t3 - 0.4) / 0.6);
          drawStarGlint(logoCtx, sx + 5, sy + 4, glintSize * 0.38, op3 * 0.50);
        }
      } else {
        glintWait++;
        if (glintWait > 60 && glintWait < 120) {
          const shimT = (glintWait - 60) / 60;
          const shimOp = shimT < 0.3 ? easeInOut(shimT / 0.3) * 0.35 : (1 - easeInOut((shimT - 0.3) / 0.7)) * 0.35;
          if (shimOp > 0.01) drawGlimmer(logoCtx, sx, sy, 14, shimOp);
        }
        if (glintWait > GLINT_PAUSE) { glintPhase = 0; glintWait = 0; }
      }
    }

    requestAnimationFrame(drawFrame);
  }

  drawFrame();
}

/* === INIT === */
loadProjects();
loadAbout();
loadPractice();
loadFooter();
if (document.querySelector('.work-hero')) initEphemera();
