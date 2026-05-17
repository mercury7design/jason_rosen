/* === FONTS === */
@font-face {
  font-family: 'Fondamento';
  src: url('../fonts/fondamento-regular.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'Fondamento';
  src: url('../fonts/fondamento-italic.woff2') format('woff2');
  font-weight: 400;
  font-style: italic;
  font-display: swap;
}

/* === VARIABLES === */
:root {
  --sand: #beb2a2;
  --ink: #191916;
  --ember: #e6542d;
  --white: #ffffff;
  --nav-height: 48px;
  --font-display: 'Fondamento', serif;
  --font-body: 'Inter', system-ui, -apple-system, sans-serif;
  --max-w: 1320px;
  --pad-x: clamp(24px, 5vw, 80px);
  --gold: #C8962A;
  --parchment: #F0E6CC;
  --scroll-ink: #2A2218;
}

/* === RESET === */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { font-size: 16px; scroll-behavior: smooth; }
body {
  background-color: var(--sand);
  color: var(--ink);
  font-family: var(--font-body);
  font-weight: 300;
  line-height: 1.6;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
img { display: block; max-width: 100%; }
a { color: inherit; text-decoration: none; }
button { background: none; border: none; cursor: pointer; font: inherit; color: inherit; }

/* === NAV === */
.site-header {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 100;
}

.nav {
  height: var(--nav-height);
  background-color: rgba(255,255,255,0.2);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border-bottom: none;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 var(--pad-x);
  position: relative;
}

/* Animated nav bottom line â€” shrinks right to left as menu opens */
.nav::after {
  content: '';
  position: absolute;
  bottom: 0; right: 0;
  height: 1px;
  background: var(--ink);
  width: 100%;
  transition: width 1.1s cubic-bezier(0.77,0,0.175,1);
}
.site-header.menu-open .nav::after {
  width: 0%;
}

.nav-links {
  display: flex;
  gap: clamp(24px, 4vw, 64px);
  align-items: center;
}

.nav-link {
  position: relative;
  z-index: 0;
  font-family: var(--font-display);
  font-size: clamp(15px, 1.55vw, 21px);
  letter-spacing: 0.08em;
  color: var(--ink);
  opacity: 0.68;
  transition: opacity 0.25s ease;
}
.nav-link::before {
  content: '';
  position: absolute;
  z-index: -1;
  inset: -0.35em -0.55em;
  background: radial-gradient(ellipse at center, rgba(255,255,255,0.72) 0%, rgba(255,255,255,0.34) 46%, rgba(255,255,255,0) 72%);
  filter: blur(7px);
  opacity: 0;
  transform: scaleX(0.75);
  transition: opacity 0.35s ease, transform 0.35s ease;
}
.nav-link:hover::before,
.nav-link:focus-visible::before { opacity: 1; transform: scaleX(1); }
.nav-link:hover { opacity: 1; }
.nav-link--active { opacity: 1; }

/* === HAMBURGER === */
.hamburger {
  display: none;
  position: absolute;
  right: var(--pad-x);
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  align-items: center;
  justify-content: center;
  z-index: 102;
  border-radius: 50%;
  transition: box-shadow 0.75s ease, background 0.75s ease;
}

.hamburger.open {
  animation: glowPulse 2.8s ease-in-out infinite;
}

@keyframes glowPulse {
  0%, 100% {
    box-shadow: 0 0 0 1px rgba(200,150,42,0.5), 0 0 18px 5px rgba(200,150,42,0.3);
  }
  50% {
    box-shadow: 0 0 0 1px rgba(200,150,42,0.8), 0 0 28px 10px rgba(200,150,42,0.5);
  }
}

.hamburger-bars {
  width: 24px;
  height: 16px;
  position: relative;
}

.hamburger span {
  display: block;
  position: absolute;
  height: 1.5px;
  border-radius: 1px;
  transform-origin: center;
}

.hamburger span:nth-child(1) {
  width: 100%;
  top: 0; left: 0;
  background: var(--ink);
  transition: transform 0.75s cubic-bezier(0.77,0,0.175,1), background 0.5s ease;
}
.hamburger span:nth-child(2) {
  width: 65%;
  top: 50%; left: 0;
  margin-top: -0.75px;
  background: var(--gold);
  transition: width 0.5s ease 0.1s, opacity 0.45s ease;
}
.hamburger span:nth-child(3) {
  width: 100%;
  bottom: 0; left: 0;
  background: var(--ink);
  transition: transform 0.75s cubic-bezier(0.77,0,0.175,1), background 0.5s ease;
}

.hamburger.open span:nth-child(1) {
  transform: translateY(7.25px) rotate(45deg);
  background: var(--gold);
}
.hamburger.open span:nth-child(2) {
  width: 0%;
  opacity: 0;
}
.hamburger.open span:nth-child(3) {
  transform: translateY(-7.25px) rotate(-45deg);
  background: var(--gold);
}

/* === MENU BACKDROP === */
.menu-backdrop {
  position: fixed;
  inset: 0;
  z-index: 100;
  background: rgba(26,23,19,0.52);
  backdrop-filter: blur(3px);
  -webkit-backdrop-filter: blur(3px);
  opacity: 0;
  pointer-events: none;
  transition: opacity 1.0s ease;
}
.menu-backdrop.open {
  opacity: 1;
  pointer-events: all;
}

/* === MOBILE MENU â€” ANCIENT SCROLL === */
.mobile-menu {
  display: none;
  position: fixed;
  top: 0; right: 0;
  width: min(320px, 88vw);
  height: 100vh;
  z-index: 101;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: 64px 40px 48px;
  overflow: hidden;

  transform: translateX(100%);
  transition: transform 1.1s cubic-bezier(0.77,0,0.175,1);

  background-color: var(--parchment);
  background-image:
    radial-gradient(ellipse at 0% 0%, rgba(172,50,20,0.38) 0%, rgba(172,50,20,0.14) 38%, transparent 60%),
    radial-gradient(ellipse at 110% 110%, rgba(172,50,20,0.20) 0%, transparent 48%);
}

/* Gold speckle canvas â€” injected by JS */
.menu-speckle {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  display: block;
}

/* Gold left rule */
.mobile-menu::before {
  content: '';
  position: absolute;
  top: 0; left: 0;
  width: 2px;
  height: 100%;
  background: linear-gradient(to bottom, transparent, var(--gold) 12%, var(--gold) 88%, transparent);
  opacity: 0.7;
}

.mobile-menu.open {
  transform: translateX(0);
}

/* === MOBILE LINKS === */
.mobile-link {
  display: flex;
  font-family: var(--font-display);
  font-size: 21px;
  letter-spacing: 0.1em;
  color: var(--scroll-ink);
  text-decoration: none;
  padding: 17px 0;
  width: 100%;
  border-bottom: 0.75px solid rgba(90,60,20,0.14);
  position: relative;
  z-index: 2;
  overflow: hidden;
}
.mobile-link:last-child { border-bottom: none; }
.mobile-link.nav-link--active { color: var(--gold); }

/* Individual letter spans */
.mobile-link .letter {
  display: inline-block;
  white-space: pre;
  opacity: 0;
  transform: translateY(80px);
  text-shadow: none;
  transition:
    opacity 1.0s cubic-bezier(0.16,1,0.3,1),
    transform 1.2s cubic-bezier(0.16,1,0.3,1),
    color 0.25s ease,
    text-shadow 0.5s ease;
}

.mobile-menu.open .mobile-link .letter {
  opacity: 1;
  transform: translateY(0);
  text-shadow: 0 0 12px rgba(200,150,42,0.4), 0 0 28px rgba(200,150,42,0.2);
}

/* Closing state â€” fall back down */
.mobile-link .letter.closing {
  opacity: 0 !important;
  transform: translateY(80px) !important;
  transition:
    opacity 1.1s cubic-bezier(0.4,0,1,1),
    transform 1.3s cubic-bezier(0.4,0,1,1),
    color 0.25s ease,
    text-shadow 0.6s ease !important;
}

.mobile-link:hover .letter {
  color: var(--gold);
  text-shadow: 0 0 16px rgba(200,150,42,0.7), 0 0 40px rgba(200,150,42,0.35);
}

/* === MAIN === */
.main {
  flex: 1;
  padding-top: var(--nav-height);
}
.page-work .main { padding-top: 0; }

/* === WORK PAGE === */
.work-hero {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: var(--sand);
  min-height: clamp(440px, 62vh, 620px);
  justify-content: center;
  padding: clamp(54px, 7vw, 88px) var(--pad-x) clamp(28px, 4vw, 54px);
  text-align: center;
  overflow: hidden;
}
.work-hero-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}
.work-hero-bg-layer {
  position: absolute;
  inset: 0;
  background-image: url('../images/background.png');
  background-size: cover;
  background-position: center top;
  background-repeat: no-repeat;
  filter: saturate(0.62) sepia(0.18) brightness(0.98) contrast(0.95);
}
.work-hero-bg-layer::before {
  content: "";
  position: absolute;
  inset: 0;
  background-color: #8b837b;
  mix-blend-mode: color;
  opacity: 0.8;
  animation: hero-color-wash 12s ease-in-out infinite alternate;
}
.work-hero-content {
  position: relative;
  z-index: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
@keyframes hero-color-wash {
  0%   { background-color: #8b837b; opacity: 0.82; }
  50%  { background-color: #b4917d; opacity: 0.68; }
  100% { background-color: #ce967d; opacity: 0.52; }
}
.work-title {
  font-family: var(--font-display);
  font-size: clamp(28px, 4.2vw, 58px);
  font-weight: 400;
  line-height: 0.95;
  color: var(--white);
  text-transform: uppercase;
  margin-bottom: clamp(18px, 3vw, 34px);
  text-shadow: 0 2px 12px rgba(25,25,22,0.2);
}
.site-mark {
  display: block;
  width: clamp(80px, 10vw, 140px);
  height: auto;
  margin-bottom: clamp(22px, 2.6vw, 34px);
  opacity: 0.9;
}
.work-intro {
  font-family: var(--font-display);
  font-style: italic;
  font-size: clamp(17px, 1.65vw, 24px);
  font-weight: 700;
  color: var(--white);
  max-width: 820px;
  line-height: 1.24;
  text-shadow: 0 2px 10px rgba(25,25,22,0.26);
}

/* === PROJECT GRID === */
.projects {
  padding: 0 0 clamp(64px, 8vw, 120px);
  background-color: var(--sand);
}
.projects-loading {
  text-align: center;
  padding: 80px;
  font-family: var(--font-display);
  font-size: 14px;
  opacity: 0.4;
}
.project-card {
  cursor: pointer;
  display: block;
  border-top: 1px solid var(--ink);
}
.project-card:last-child { border-bottom: 1px solid var(--ink); }
.project-thumb {
  position: relative;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background-color: color-mix(in srgb, var(--sand) 70%, var(--ink));
}
.project-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.6s ease;
}
.project-card:hover .project-thumb img { transform: scale(1.03); }
.project-overlay {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  padding: clamp(20px, 3vw, 40px) clamp(24px, 4vw, 56px);
  background: linear-gradient(to top, rgba(25,25,22,0.82) 0%, rgba(25,25,22,0.3) 60%, transparent 100%);
  color: var(--white);
}
.project-title {
  font-family: var(--font-display);
  font-size: clamp(20px, 3vw, 42px);
  font-weight: 400;
  line-height: 1.15;
  margin-bottom: 6px;
}
.project-client {
  font-family: var(--font-body);
  font-size: clamp(11px, 1vw, 14px);
  font-weight: 300;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  opacity: 0.75;
}
.project-thumb--empty {
  background-color: color-mix(in srgb, var(--sand) 60%, var(--ink) 40%);
}

/* === LIGHTBOX === */
.lightbox {
  position: fixed;
  inset: 0;
  z-index: 200;
  background-color: rgba(25,25,22,0.97);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  overflow-y: auto;
  overscroll-behavior: contain;
}
.lightbox[hidden] { display: none; }
.lightbox-inner {
  width: 100%;
  max-width: 960px;
  min-height: 100vh;
  padding: clamp(40px, 6vw, 80px) clamp(24px, 5vw, 64px);
  position: relative;
  color: var(--white);
}
.lightbox-close {
  position: fixed;
  top: 20px; right: 24px;
  font-size: 32px;
  line-height: 1;
  color: var(--white);
  opacity: 0.6;
  transition: opacity 0.2s;
  z-index: 201;
}
.lightbox-close:hover { opacity: 1; }
.lightbox-header {
  padding-bottom: clamp(32px, 4vw, 56px);
  border-bottom: 1px solid rgba(255,255,255,0.15);
  margin-bottom: clamp(32px, 4vw, 56px);
}
.lightbox-title {
  font-family: var(--font-display);
  font-size: clamp(28px, 4vw, 56px);
  font-weight: 400;
  line-height: 1.1;
  margin-bottom: 12px;
}
.lightbox-client {
  font-family: var(--font-body);
  font-size: 12px;
  font-weight: 400;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--sand);
  margin-bottom: clamp(20px, 2.5vw, 32px);
}
.lightbox-description {
  font-family: var(--font-body);
  font-size: clamp(14px, 1.3vw, 17px);
  font-weight: 300;
  line-height: 1.7;
  color: rgba(255,255,255,0.8);
  max-width: 640px;
}
.lightbox-description p + p { margin-top: 1em; }
.lightbox-media {
  display: flex;
  flex-direction: column;
  gap: clamp(32px, 4vw, 56px);
}
.lb-media-item { width: 100%; }
.lb-video-wrap {
  position: relative;
  aspect-ratio: 16 / 9;
  background: #000;
}
.lb-video-wrap iframe,
.lb-video-wrap video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}
.lb-media-item img { width: 100%; height: auto; display: block; }
.lb-caption {
  margin-top: 14px;
  font-family: var(--font-body);
  font-size: clamp(14px, 1.15vw, 17px);
  font-style: italic;
  font-weight: 300;
  letter-spacing: 0.02em;
  color: rgba(255,255,255,0.88);
}

/* === ABOUT PAGE === */
.about-columns {
  display: grid;
  grid-template-columns: 2fr 3fr;
  gap: clamp(40px, 6vw, 96px);
  padding: clamp(48px, 7vw, 96px) var(--pad-x) clamp(64px, 8vw, 120px);
  max-width: var(--max-w);
  margin: 0 auto;
  align-items: start;
  background-color: var(--sand);
}
.about-headshot-wrap {
  position: sticky;
  top: calc(var(--nav-height) + 32px);
}
.about-headshot {
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  object-position: center top;
  display: block;
}
.about-text {
  font-family: var(--font-body);
  font-size: clamp(15px, 1.3vw, 18px);
  font-weight: 300;
  line-height: 1.75;
  color: var(--ink);
}
.about-text p + p { margin-top: 1.4em; }

/* === PRACTICE PAGE === */
.practice-wrap {
  padding: clamp(48px, 7vw, 96px) var(--pad-x) clamp(64px, 8vw, 120px);
  max-width: 760px;
  margin: 0 auto;
  background-color: var(--sand);
}
.practice-body {
  font-family: var(--font-body);
  font-size: clamp(15px, 1.3vw, 18px);
  font-weight: 300;
  line-height: 1.75;
  color: var(--ink);
}
.practice-body p + p { margin-top: 1.4em; }

/* === FOOTER === */
.site-footer {
  border-top: 1px solid var(--ink);
  padding: 40px var(--pad-x);
  margin-top: auto;
  background-color: color-mix(in srgb, var(--sand) 85%, var(--ink));
}
.footer-inner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
}
.footer-mark { font-size: 20px; line-height: 1; color: var(--white); }
.footer-est { font-family: var(--font-display); font-size: 13px; letter-spacing: 0.12em; }
.footer-email {
  font-family: var(--font-body);
  font-size: 12px;
  font-weight: 300;
  letter-spacing: 0.06em;
  opacity: 0.6;
  transition: opacity 0.2s;
}
.footer-email:hover { opacity: 1; }

/* === RESPONSIVE === */
@media (max-width: 768px) {
  .nav-links { display: none; }
  .hamburger { display: flex; }
  .mobile-menu { display: flex; }
  .about-columns { grid-template-columns: 1fr; }
  .about-headshot-wrap { position: static; max-width: 320px; }
}
@media (max-width: 480px) {
  .project-title { font-size: 18px; }
  .lightbox-title { font-size: 24px; }
}
