/* ═══════════════════════════════════════════════════════
   VIEW TRANSITION — agoldencalf.com
   Desktop: thumbnail morphs into project hero
   Mobile:  fade through black (cinematic)

   Add to index.html before </body>:
   <script src="js/view-transition.js"></script>

   Add to project.html <head>:
   <style>
     @media (hover: hover) {
       ::view-transition-old(project-hero) {
         animation: 480ms cubic-bezier(0.4,0,0.2,1) both vt-fade-out;
       }
       ::view-transition-new(project-hero) {
         animation: 680ms cubic-bezier(0.16,1,0.3,1) both vt-fade-in;
       }
       ::view-transition-old(root) {
         animation: 280ms ease both vt-fade-out;
       }
       ::view-transition-new(root) {
         animation: 420ms ease both vt-fade-in;
       }
     }

     @media (hover: none) {
       ::view-transition-old(root) {
         animation: 320ms ease both vt-fade-out;
         background: #0d0e0c;
       }
       ::view-transition-new(root) {
         animation: 420ms ease 280ms both vt-fade-in;
       }
       ::view-transition-image-pair(root) {
         isolation: isolate;
       }
     }

     @keyframes vt-fade-in  { from { opacity: 0; } }
     @keyframes vt-fade-out { to   { opacity: 0; } }
   </style>
   ═══════════════════════════════════════════════════════ */

(function () {

  // Only run on pages with project bars
  if (!document.querySelector('.projects')) return;

  const supportsVT = !!document.startViewTransition;
  const isMobile   = window.matchMedia('(hover: none)').matches;

  /* ── Tag the clicked bar's background for desktop morph ── */
  function tagThumbnail(bar) {
    // Clear any previously tagged element first
    document.querySelectorAll('.project-bar-bg').forEach(el => {
      el.style.viewTransitionName = '';
    });
    if (!isMobile) {
      const bg = bar.querySelector('.project-bar-bg');
      if (bg) bg.style.viewTransitionName = 'project-hero';
    }
  }

  /* ── Navigate with transition ── */
  function navigateTo(href, bar) {
    if (!supportsVT) {
      window.location.href = href;
      return;
    }

    if (bar) tagThumbnail(bar);

    document.startViewTransition(() => {
      window.location.href = href;
    });
  }

  /* ── Intercept project bar CTA clicks ── */
  document.addEventListener('click', (e) => {
    const cta = e.target.closest('.project-bar-cta');
    if (!cta) return;

    e.preventDefault();
    e.stopPropagation();

    const bar = cta.closest('.project-bar');
    const idx = bar?.dataset.index ?? '0';
    const href = `project.html?id=${encodeURIComponent(idx)}`;

    navigateTo(href, bar);
  }, true);

  /* ── Also intercept mobile expanded-bar taps ── */
  document.addEventListener('click', (e) => {
    const bar = e.target.closest('.project-bar');
    if (!bar || !bar.classList.contains('expanded')) return;
    if (e.target.closest('.project-bar-cta')) return; // handled above

    const idx = bar.dataset.index ?? '0';
    const href = `project.html?id=${encodeURIComponent(idx)}`;

    navigateTo(href, bar);
  });

})();
