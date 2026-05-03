/* === NAV === */
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');
const siteHeader = document.querySelector('.site-header');

hamburger?.addEventListener('click', () => {
  const open = mobileMenu.classList.toggle('open');
  hamburger.classList.toggle('open', open);
  siteHeader?.classList.toggle('menu-open', open);
  hamburger.setAttribute('aria-expanded', open);
  mobileMenu.setAttribute('aria-hidden', !open);
});

document.querySelectorAll('.mobile-link').forEach(a => {
  a.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
    siteHeader?.classList.remove('menu-open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
  });
});

/* === UTILS === */
function textToHtml(str) {
  if (!str) return '';
  return str
    .split(/\n\n+/)
    .filter(p => p.trim())
    .map(p => `<p>${p.trim().replace(/\n/g, '<br>')}</p>`)
    .join('');
}

function vimeoId(url) {
  const m = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  return m ? m[1] : null;
}

function youtubeId(url) {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes('youtube.com')) {
      return parsed.searchParams.get('v');
    }
    if (parsed.hostname.includes('youtu.be')) {
      return parsed.pathname.replace('/', '').split('/')[0];
    }
  } catch (err) {
    return null;
  }
  return null;
}

function isHlsUrl(url) {
  return url.endsWith('.m3u8');
}

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
      media = `<div class="lb-video-wrap">
        <iframe src="https://www.youtube.com/embed/${yid}"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen></iframe>
      </div>`;
    } else if (vid) {
      media = `<div class="lb-video-wrap">
        <iframe src="https://player.vimeo.com/video/${vid}?dnt=1"
          frameborder="0"
          allow="autoplay; fullscreen; picture-in-picture"
          allowfullscreen></iframe>
      </div>`;
    } else if (url) {
      const attrs = isHlsUrl(url)
        ? `data-hls-src="${url}"`
        : `src="${url}"`;
      media = `<div class="lb-video-wrap"><video ${attrs} controls playsinline></video></div>`;
    }
  } else {
    const src = item.image || item.url || '';
    if (src) {
      media = `<img src="${src}" alt="${item.caption || ''}" loading="lazy">`;
    }
  }
  const caption = item.caption
    ? `<p class="lb-caption">${item.caption}</p>`
    : '';
  return media || caption
    ? `<div class="lb-media-item">${media}${caption}</div>`
    : '';
}

/* === LIGHTBOX === */
let projectsData = [];

function openLightbox(project) {
  const lightbox = document.getElementById('lightbox');
  document.getElementById('lb-title').textContent = project.title || '';
  document.getElementById('lb-client').textContent = project.client || '';
  document.getElementById('lb-description').innerHTML = textToHtml(project.description);
  document.getElementById('lb-media').innerHTML = (project.media || [])
    .map(renderMediaItem)
    .join('');
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

document.getElementById('lightbox')?.addEventListener('click', e => {
  if (e.target === e.currentTarget) closeLightbox();
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeLightbox();
});

/* === WORK PAGE === */
async function loadProjects() {
  const container = document.getElementById('projects');
  if (!container) return;

  try {
    const res = await fetch('/content/projects.json');
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
      const thumb = project.thumbnail
        ? `<img src="${project.thumbnail}" alt="${project.title || ''}" loading="lazy">`
        : '';
      const emptyClass = project.thumbnail ? '' : ' project-thumb--empty';
      return `
        <article class="project-card" data-index="${i}" role="button" tabindex="0"
          aria-label="Open ${project.title}">
          <div class="project-thumb${emptyClass}">
            ${thumb}
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
    const res = await fetch('/content/about.json');
    if (!res.ok) throw new Error(res.statusText);
    const data = await res.json();
    if (headshot && data.headshot) headshot.src = data.headshot;
    if (body && data.body) body.innerHTML = textToHtml(data.body);
  } catch (err) {
    console.error('Failed to load about:', err);
  }
}

/* === PRACTICE PAGE === */
async function loadPractice() {
  const body = document.getElementById('practice-body');
  if (!body) return;

  try {
    const res = await fetch('/content/practice.json');
    if (!res.ok) throw new Error(res.statusText);
    const data = await res.json();
    if (data.body) body.innerHTML = textToHtml(data.body);
  } catch (err) {
    console.error('Failed to load practice:', err);
  }
}

/* === FOOTER === */
async function loadFooter() {
  const footers = document.querySelectorAll('.site-footer');
  if (!footers.length) return;

  try {
    const res = await fetch('/content/footer.json');
    if (!res.ok) throw new Error(res.statusText);
    const data = await res.json();
    footers.forEach(footer => {
      const mark = footer.querySelector('.footer-mark');
      const est = footer.querySelector('.footer-est');
      const email = footer.querySelector('.footer-email');
      if (mark && data.mark) mark.innerHTML = data.mark;
      if (est && data.est) est.textContent = data.est;
      if (email && data.email) {
        email.textContent = data.email;
        email.href = `mailto:${data.email}`;
      }
    });
  } catch (err) {
    console.error('Failed to load footer:', err);
  }
}

/* === INIT === */
loadProjects();
loadAbout();
loadPractice();
loadFooter();
