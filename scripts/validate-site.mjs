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

const cms = read('pages.config.yml');
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
  if (!cms.includes(token)) fail(`pages.config.yml missing ${token}`);
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

const css = read('css/styles.css');
[
  "url('/images/background.png')",
  'rgba(255, 255, 255, 0.2)',
  '.nav-link::before',
  '.nav-link:hover::before',
  '.page-work .main',
  '--nav-height: 48px',
  'font-size: clamp(15px, 1.55vw, 21px)',
  'font-size: clamp(17px, 1.65vw, 24px)',
  'font-style: italic',
  'font-weight: 700',
  'text-shadow: 0 2px 10px',
].forEach(token => {
  if (!css.includes(token)) fail(`css/styles.css missing ${token}`);
});

if (!fs.existsSync('favicon.ico')) {
  fail('favicon.ico must exist.');
}

console.log('site validation ok');
