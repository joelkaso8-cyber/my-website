(function () {
  'use strict';

  const root = document.documentElement;
  const darkSchemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const desktopQuery = window.matchMedia('(min-width: 768px)');
  const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

  // Older Safari only supports addListener on MediaQueryList.
  function onMediaChange(query, handler) {
    if (typeof query.addEventListener === 'function') {
      query.addEventListener('change', handler);
    } else if (typeof query.addListener === 'function') {
      query.addListener(handler);
    }
  }

  /* ---------------------------------------------------------------------
     Theme toggle
     --------------------------------------------------------------------- */

  function initThemeToggle() {
    const toggle = document.querySelector('.theme-toggle');
    if (!toggle) return;

    const currentTheme = () =>
      root.getAttribute('data-theme') || (darkSchemeQuery.matches ? 'dark' : 'light');

    const updateLabel = () => {
      const label = `Switch to ${currentTheme() === 'dark' ? 'light' : 'dark'} theme`;
      toggle.setAttribute('aria-label', label);
      toggle.setAttribute('title', label);
    };

    toggle.addEventListener('click', () => {
      const next = currentTheme() === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try {
        localStorage.setItem('theme', next);
      } catch (error) {
        // Storage blocked (private mode, etc.): the choice lasts for this visit only.
      }
      updateLabel();
    });

    onMediaChange(darkSchemeQuery, updateLabel);
    updateLabel();
  }

  /* ---------------------------------------------------------------------
     Mobile navigation
     --------------------------------------------------------------------- */

  function initMobileNav() {
    const toggle = document.querySelector('.nav-toggle');
    const nav = document.getElementById('site-nav');
    if (!toggle || !nav) return;

    const isOpen = () => toggle.getAttribute('aria-expanded') === 'true';

    const setOpen = (open) => {
      toggle.setAttribute('aria-expanded', String(open));
      nav.classList.toggle('is-open', open);
    };

    toggle.addEventListener('click', () => setOpen(!isOpen()));

    // Close after picking a link so the page is visible again.
    nav.addEventListener('click', (event) => {
      if (event.target.closest('a')) setOpen(false);
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && isOpen()) {
        setOpen(false);
        toggle.focus();
      }
    });

    document.addEventListener('click', (event) => {
      if (isOpen() && !nav.contains(event.target) && !toggle.contains(event.target)) {
        setOpen(false);
      }
    });

    onMediaChange(desktopQuery, (event) => {
      if (event.matches) setOpen(false);
    });
  }

  /* ---------------------------------------------------------------------
     Highlight the nav link for the section in view
     --------------------------------------------------------------------- */

  function initScrollSpy() {
    const links = Array.from(document.querySelectorAll('.nav-link[href^="#"]'));
    const sections = Array.from(document.querySelectorAll('main section[id]'));
    if (!links.length || !sections.length || !('IntersectionObserver' in window)) return;

    const setActive = (id) => {
      links.forEach((link) => {
        const active = link.getAttribute('href') === `#${id}`;
        link.classList.toggle('is-active', active);
        if (active) {
          link.setAttribute('aria-current', 'true');
        } else {
          link.removeAttribute('aria-current');
        }
      });
    };

    // A section counts as "in view" when it crosses the middle of the screen.
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-50% 0px -50% 0px' }
    );

    sections.forEach((section) => observer.observe(section));
  }

  /* ---------------------------------------------------------------------
     Fade sections in as they scroll into view
     --------------------------------------------------------------------- */

  function initReveal() {
    const items = Array.from(document.querySelectorAll('[data-reveal]'));
    if (!items.length || reducedMotionQuery.matches || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.remove('reveal-hidden');
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -10% 0px' }
    );

    // Only hide items that start off-screen, so nothing visible ever blinks.
    items.forEach((item) => {
      if (item.getBoundingClientRect().top < window.innerHeight) return;
      item.classList.add('reveal-hidden');
      observer.observe(item);
    });
  }

  /* ---------------------------------------------------------------------
     Footer year
     --------------------------------------------------------------------- */

  function initYear() {
    const year = String(new Date().getFullYear());
    document.querySelectorAll('[data-year]').forEach((el) => {
      el.textContent = year;
    });
  }

  initThemeToggle();
  initMobileNav();
  initScrollSpy();
  initReveal();
  initYear();
})();
