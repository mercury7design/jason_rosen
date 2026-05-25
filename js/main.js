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

/* === WORK PAGE — EXPANDING BARS === */

function initBarSpotlight(bar, canvas) {
  if (canvas) canvas.remove();

  // Static vignette — always present, gives the chimera keyhole effect
  const spotlightW = window.innerWidth < 768 ? '55%' : '28%';
  const vignette = document.createElement('div');
  vignette.style.cssText = `
    position:absolute;inset:0;pointer-events:none;z-index:1;
    background: radial-gradient(ellipse ${spotlightW} 120% at 50% 50%, 
      rgba(25,25,22,0) 0%, 
      rgba(25,25,22,0.55) 45%, 
      rgba(25,25,22,0.92) 75%, 
      rgba(25,25,22,0.98) 100%);
    opacity: 1;
    transition: opacity 3s cubic-bezier(0.16,1,0.3,1) 0.4s;
  `;
  bar.appendChild(vignette);

  // Dark overlay on top — fades out on expand to reveal image
  const darkOverlay = document.createElement('div');
  darkOverlay.style.cssText = `
    position:absolute;inset:0;pointer-events:none;z-index:2;
    background: rgba(25,25,22,0.0);
    transition: background 2.4s cubic-bezier(0.16,1,0.3,1);
  `;
  bar.appendChild(darkOverlay);

  return {
    expand:   () => { 
      vignette.style.transition = 'opacity 2.8s cubic-bezier(0.16,1,0.3,1) 0.3s';
      vignette.style.opacity = '0';
    },
    collapse: () => { 
      vignette.style.transition = 'opacity 0.6s ease';
      vignette.style.opacity = '1';
    },
  };
}

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
      const bg = project.thumbnail ? `style="background-image:url('${project.thumbnail}')"` : '';
      return `<article class="project-bar" data-index="${i}" role="button" tabindex="0" aria-label="Open ${project.title || ''}">
        <div class="project-bar-bg" ${bg}></div>
        <canvas class="project-bar-spotlight"></canvas>
        <div class="project-bar-reading-underlay"></div>
        <div class="project-bar-gradient"></div>
        <div class="project-bar-hover-content">
          <p class="project-bar-hover-client">${project.client || ''}</p>
          <p class="project-bar-hover-blurb">${project.blurb || ''}</p>
        </div>
        <div class="project-bar-meta">
          <span class="project-bar-title">${project.title || ''}</span>
          <span class="project-bar-client">${project.client || ''}</span>
          <button class="project-bar-cta" data-index="${i}" aria-label="See project">See Project →</button>
          <div class="project-bar-sliver"></div>
        </div>
      </article>`;
    }).join('');

    // Init each bar
    container.querySelectorAll('.project-bar').forEach(bar => {
      const canvas = bar.querySelector('.project-bar-spotlight');
      const spotlight = initBarSpotlight(bar, canvas);
      const isTouchDevice = window.matchMedia('(hover: none)').matches;

      // CTA button — navigate to project page
      bar.querySelector('.project-bar-cta')?.addEventListener('click', e => {
        e.stopPropagation();
        const project = projectsData[parseInt(bar.dataset.index)];
        window.location.href = `project.html?id=${encodeURIComponent(project.id || bar.dataset.index)}`;
      });

      if (isTouchDevice) {
        bar.addEventListener('click', (e) => {
          if (bar.classList.contains('expanded')) return;
          container.querySelectorAll('.project-bar.expanded').forEach(other => {
            if (other !== bar) {
              other.classList.remove('expanded');
              other._spotlight?.collapse();
            }
          });
          bar.classList.add('expanded');
          spotlight.expand();
          bar._spotlight = spotlight;
          setTimeout(() => {
            bar.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 50);
        });
        document.addEventListener('click', e => {
          if (!bar.contains(e.target) && bar.classList.contains('expanded')) {
            bar.classList.remove('expanded');
            spotlight.collapse();
          }
        });
      } else {
        bar.addEventListener('mouseenter', () => {
          bar.classList.add('expanded');
          spotlight.expand();
        });
        bar.addEventListener('mouseleave', () => {
          bar.classList.remove('expanded');
          spotlight.collapse();
        });
        bar.addEventListener('click', () => {
          const project = projectsData[parseInt(bar.dataset.index)];
          window.location.href = `project.html?id=${encodeURIComponent(project.id || bar.dataset.index)}`;
        });
        bar.addEventListener('keydown', e => {
          if (e.key === 'Enter' || e.key === ' ') {
            const project = projectsData[parseInt(bar.dataset.index)];
            window.location.href = `project.html?id=${encodeURIComponent(project.id || bar.dataset.index)}`;
          }
        });
      }
    });

  } catch (err) {
    console.error('Failed to load projects:', err);
    container.innerHTML = '<p class="projects-loading">Could not load projects.</p>';
  }
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

/* === HERO QUOTE === */
const HERO_QUOTE_WORDS = 'To move people, first we must build the world they move through.'.split(' ');
const HERO_QUOTE_LINES = ['To move people,', 'first we must', 'build the world', 'they move through.'];
let heroQuoteTriggered = false;

function triggerHeroQuote() {
  if (heroQuoteTriggered) return;
  heroQuoteTriggered = true;

  const isMobile = window.matchMedia('(hover: none)').matches;
  const quoteEl = document.getElementById('hero-quote');
  if (!quoteEl) return;

  if (isMobile) {
    // Four lines stagger in
    const lineEls = quoteEl.querySelectorAll('.hero-quote-line');
    lineEls.forEach((el, i) => {
      setTimeout(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
        el.style.filter = 'blur(0)';
      }, i * 1000);
    });
    // All evaporate simultaneously
    setTimeout(() => {
      lineEls.forEach(el => {
        el.style.transition = 'opacity 2.8s ease, transform 2.8s ease, filter 2.8s ease';
        el.style.opacity = '0';
        el.style.transform = 'translateY(-6px)';
        el.style.filter = 'blur(8px)';
      });
      setTimeout(() => {
        quoteEl.style.display = 'none';
        document.querySelector('.hero-bookend')?.classList.add('hero-quote-done');
      }, 3000);
    }, HERO_QUOTE_LINES.length * 1000 + 4000);
  } else {
    // Desktop — word by word stagger
    const wordEls = quoteEl.querySelectorAll('.hero-quote-word');
    wordEls.forEach((el, i) => {
      setTimeout(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
        el.style.filter = 'blur(0)';
      }, i * 80);
    });
    // All evaporate simultaneously
    setTimeout(() => {
      wordEls.forEach(el => {
        el.style.transition = 'opacity 2.8s ease, transform 2.8s ease, filter 2.8s ease';
        el.style.opacity = '0';
        el.style.transform = 'translateY(-6px)';
        el.style.filter = 'blur(8px)';
      });
      setTimeout(() => { quoteEl.style.display = 'none'; }, 3000);
    }, HERO_QUOTE_WORDS.length * 80 + 7000);
  }
}

function initHeroLayout() {
  const heroEl = document.querySelector('.work-hero');
  if (!heroEl) return;
  const isMobile = window.matchMedia('(hover: none)').matches;

  // Inject Squada One font
  if (!document.querySelector('link[href*="Squada"]')) {
    const l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = 'https://fonts.googleapis.com/css2?family=Squada+One&display=swap';
    document.head.appendChild(l);
  }

  // Build quote HTML
  const quoteEl = document.getElementById('hero-quote');
  if (quoteEl) {
    if (isMobile) {
      quoteEl.innerHTML = HERO_QUOTE_LINES.map(line =>
        `<span class="hero-quote-line" style="display:block;opacity:0;transform:translateY(5px);filter:blur(3px);transition:opacity 1.8s ease,transform 1.8s cubic-bezier(0.16,1,0.3,1),filter 1.8s ease;">${line}</span>`
      ).join('');
    } else {
      quoteEl.innerHTML = HERO_QUOTE_WORDS.map(word =>
        `<span class="hero-quote-word" style="display:inline-block;margin-right:0.28em;opacity:0;transform:translateY(4px);filter:blur(3px);transition:opacity 1.4s ease,transform 1.4s cubic-bezier(0.16,1,0.3,1),filter 1.4s ease;">${word}</span>`
      ).join('');
    }
  }

  // Name stack — measure and match title width to name width
  const nameEl = document.querySelector('.hero-name');
  const titleEl = document.querySelector('.hero-title');
  if (nameEl && titleEl) {
    function measureNameStack() {
      const nameWidth = nameEl.offsetWidth;
      titleEl.style.maxWidth = nameWidth + 'px';
      let fs = parseFloat(window.getComputedStyle(nameEl).fontSize);
      titleEl.style.fontSize = fs + 'px';
      while (titleEl.scrollWidth > nameWidth && fs > 4) {
        fs -= 0.5;
        titleEl.style.fontSize = fs + 'px';
      }
    }
    measureNameStack();
    setTimeout(measureNameStack, 600);
    window.addEventListener('resize', measureNameStack);
  }
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
        // Trigger quote at sparkle peak — fires once
        if (t >= 0.38 && t <= 0.42) { triggerHeroQuote(); }
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

/* === PROJECT PAGE === */
async function loadProjectPage() {
  const wrap = document.querySelector('.project-page-wrap');
  if (!wrap) return;

  try {
    const res = await fetch('content/projects.json');
    if (!res.ok) throw new Error(res.statusText);
    const data = await res.json();
    const projects = data.items || [];

    // Get project id from URL
    const params = new URLSearchParams(window.location.search);
    const idParam = params.get('id');
    const project = projects.find((p, i) => 
      String(p.id) === idParam || String(i) === idParam
    ) || projects[0];

    if (!project) return;

    // Set page title
    document.title = `${project.title} — A Golden Calf`;

    // Header
    document.getElementById('project-client').textContent = project.client || '';
    document.getElementById('project-title').textContent = project.title || '';
    document.getElementById('project-description').innerHTML = textToHtml(project.description || '');

    // Media
    const mediaEl = document.getElementById('project-media');
    (project.media || []).forEach(item => {
      if (!item || !item.type) return;
      const block = document.createElement('div');
      block.className = 'project-media-block';

      if (item.type === 'video') {
        const url = item.url || '';
        const vid = vimeoId(url);
        const yid = youtubeId(url);
        block.className += ' project-media-video';

        if (vid) {
          block.innerHTML = `<div class="project-video-wrap"><iframe src="https://player.vimeo.com/video/${vid}?dnt=1&autoplay=1&loop=1&muted=1" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe></div>`;
        } else if (yid) {
          block.innerHTML = `<div class="project-video-wrap"><iframe src="https://www.youtube.com/embed/${yid}?autoplay=1&mute=1&loop=1" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe></div>`;
        } else if (url.endsWith('.m3u8')) {
          block.innerHTML = `<div class="project-video-wrap"><video data-hls-src="${url}" controls playsinline autoplay muted loop style="width:100%;height:100%;object-fit:cover;"></video></div>`;
        } else if (url.endsWith('.mp4')) {
          block.innerHTML = `<div class="project-video-wrap"><video src="${url}" controls playsinline autoplay muted loop style="width:100%;height:100%;object-fit:cover;"></video></div>`;
        }

        if (item.caption) {
          block.innerHTML += `<p class="project-media-caption">${item.caption}</p>`;
        }

      } else if (item.type === 'image') {
        const src = item.url || item.image || item.src || '';
        if (!src) return;
        block.innerHTML = `
          <img src="${src}" alt="${item.caption || ''}" loading="lazy">
          ${item.caption ? `<p class="project-media-caption">${item.caption}</p>` : ''}
        `;
      }

      if (block.innerHTML) mediaEl.appendChild(block);
    });

    // Init HLS videos
    initHlsVideos(mediaEl);

    // More work thumbnails
    const thumbsEl = document.getElementById('project-thumbs');
    projects.filter((p, i) => {
      const pid = p.id !== undefined ? String(p.id) : String(i);
      return pid !== idParam && String(i) !== idParam;
    }).forEach((p, i) => {
      const idx = projects.indexOf(p);
      const pid = p.id !== undefined ? p.id : idx;
      const thumb = document.createElement('a');
      thumb.href = `project.html?id=${encodeURIComponent(pid)}`;
      thumb.className = 'project-thumb-card';
      thumb.innerHTML = `
        ${p.thumbnail ? `<img src="${p.thumbnail}" alt="${p.title || ''}">` : '<div class="project-thumb-empty"></div>'}
        <div class="project-thumb-meta">
          <p class="project-thumb-title">${p.title || ''}</p>
          <p class="project-thumb-client">${p.client || ''}</p>
        </div>
      `;
      thumbsEl.appendChild(thumb);
    });

  } catch(err) {
    console.error('Failed to load project page:', err);
  }
}

/* === SKILLS TICKER === */
function initSkillsTicker() {
  const banner = document.querySelector('.skills-banner');
  if (!banner) return;

  const LINE1 = 'UX · UI · DESIGN · STRATEGY · CONCEPT · CREATIVE + ART DIRECTION · COPYWRITING · BRAND DNA · RESEARCH · DEVELOPMENT · PRODUCT · CAMPAIGN · EXPERIENTIAL';
  const LINE2 = 'TECHNICAL · INTEGRATED · WEB + E-COMMERCE · SOUND DESIGN · GAME ENGINES · NEW BUSINESS · RFP + ROM FACILITATION · TALENT REPRESENTATION + RESOURCES · MUSEUMS · VIDEO GAMES · TANGIBLE MEDIA · LIVE PRODUCTION';

  function setupLine(el, text, speed, startOffset) {
    if (!el) return;
    const repeated = `${text}     `.repeat(3);
    el.textContent = repeated;
    let x = startOffset || 0;
    let w = 0;
    setTimeout(() => { w = el.scrollWidth / 3; }, 200);
    function tick() {
      x -= speed;
      if (w && x <= -w) x += w;
      el.style.transform = `translateX(${x}px)`;
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  setupLine(document.getElementById('skills-line-1'), LINE1, 0.9, 0);
  setupLine(document.getElementById('skills-line-2'), LINE2, 0.55, -400);

  // Ghost wave canvas
  const canvas = document.getElementById('skills-ghost-wave');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let frame = 0;

  function resizeCanvas() {
    canvas.width = banner.offsetWidth;
    canvas.height = banner.offsetHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  function drawWave() {
    frame++;
    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    const t = frame * 0.006;
    const angle = Math.atan2(H, W);
    const diagLen = Math.sqrt(W * W + H * H);
    const waveHead = diagLen * 0.5 + Math.sin(t) * diagLen * 0.45;
    const waveW = diagLen * 0.22 + Math.sin(t * 0.7) * diagLen * 0.06;
    const intensity = 0.22 + Math.sin(t * 1.1) * 0.1;
    const headX = Math.cos(angle) * waveHead;
    const headY = Math.sin(angle) * waveHead;
    const tailX = Math.cos(angle) * Math.max(0, waveHead - waveW);
    const tailY = Math.sin(angle) * Math.max(0, waveHead - waveW);
    const grad = ctx.createLinearGradient(tailX, tailY, headX, headY);
    grad.addColorStop(0, 'rgba(255,248,210,0)');
    grad.addColorStop(0.3, `rgba(255,248,210,${intensity * 0.35})`);
    grad.addColorStop(0.55, `rgba(255,248,210,${intensity})`);
    grad.addColorStop(0.75, `rgba(255,248,210,${intensity * 0.35})`);
    grad.addColorStop(1, 'rgba(255,248,210,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);
    requestAnimationFrame(drawWave);
  }
  drawWave();
}

/* === INIT === */
loadProjects();
loadAbout();
loadPractice();
loadFooter();
initSkillsTicker();
if (document.querySelector('.project-page-wrap')) loadProjectPage();
if (document.querySelector('.work-hero')) { initHeroLayout(); initEphemera(); }
