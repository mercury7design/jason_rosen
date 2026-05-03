import fs from 'node:fs';

const read = path => fs.readFileSync(path, 'utf8');
const projects = JSON.parse(read('content/projects.json'));
JSON.parse(read('content/about.json'));
JSON.parse(read('content/practice.json'));
JSON.parse(read('content/footer.json'));

const fail = message => {
  throw new Error(message);
};

if (!Array.isArray(projects.items) || projects.items.length !== 9) {
  fail('content/projects.json must contain 9 ordered projects in items.');
}

projects.items.forEach((project, projectIndex) => {
  if (!Array.isArray(project.media) || project.media.length === 0) {
    fail(`${project.title || `Project ${projectIndex + 1}`} must contain ordered media.`);
  }

  project.media.forEach((item, mediaIndex) => {
    if (typeof item.caption !== 'string' || !item.caption.trim()) {
      fail(`${project.title} media item ${mediaIndex + 1} needs an editable caption.`);
    }
    const sentenceCount = item.caption.split(/[.!?]+/).filter(Boolean).length;
    if (sentenceCount > 2) {
      fail(`${project.title} media item ${mediaIndex + 1} caption must be 1-2 sentences.`);
    }
  });
});

if (!fs.existsSync('.pages.yml')) {
  fail('.pages.yml must exist for Pages CMS discovery.');
}

const cms = read('.pages.yml');
[
  'name: "items"',
  'label: "Projects"',
  'type: "object"',
  'list:',
  'name: "media"',
  'label: "Media Items (images and/or videos)"',
  'name: "caption"',
  'label: "Media Description"',
].forEach(token => {
  if (!cms.includes(token)) fail(`.pages.yml missing ${token}`);
});

const index = read('index.html');
if (!index.includes('class="work-title"')) {
  fail('index.html must include the Golden Calf H1.');
}
if (!index.includes('<link rel="shortcut icon" href="/favicon.ico">')) {
  fail('index.html must include the site favicon.');
}
if (index.indexOf('class="site-mark"') > index.indexOf('class="work-title"')) {
  fail('The logo must appear above the Golden Calf H1.');
}
const expectedNavOrder = ['>W.O.R.K<', '>A.B.O.U.T<', '>P.R.A.C.T.I.C.E<'];
let previousNavIndex = -1;
expectedNavOrder.forEach(label => {
  const navIndex = index.indexOf(label);
  if (navIndex <= previousNavIndex) {
    fail('index.html nav order must be W.O.R.K, A.B.O.U.T, P.R.A.C.T.I.C.E.');
  }
  previousNavIndex = navIndex;
});

const css = read('css/styles.css');
[
  "url('/images/background.png')",
  'rgba(255, 255, 255, 0.2)',
  'border-bottom: 1px solid var(--ink)',
  '.site-header.menu-open .nav',
  'border-bottom-color: transparent',
  '.nav-link::before',
  '.nav-link:hover::before',
  '.page-work .main',
  '--nav-height: 48px',
  'font-size: clamp(15px, 1.55vw, 21px)',
  'color: var(--ink)',
  'min-height: clamp(440px, 62vh, 620px)',
  'padding: clamp(54px, 7vw, 88px)',
  'font-size: clamp(28px, 4.2vw, 58px)',
  'font-size: clamp(17px, 1.65vw, 24px)',
  'font-size: clamp(14px, 1.15vw, 17px)',
  'color: rgba(255,255,255,0.88)',
  'font-style: italic',
  'background-color: color-mix(in srgb, var(--sand) 85%, var(--ink))',
  '.footer-mark',
  'color: var(--white)',
  'font-weight: 700',
  'text-shadow: 0 2px 10px',
].forEach(token => {
  if (!css.includes(token)) fail(`css/styles.css missing ${token}`);
});

if (!fs.existsSync('favicon.ico')) {
  fail('favicon.ico must exist.');
}

console.log('site validation ok');
