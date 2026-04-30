/* ============================================================
   PORTFOLIO JAVASCRIPT
   Author: Your Name

   TABLE OF CONTENTS
   -----------------
   1. Typing Effect (Hero section)
   2. Sticky Navbar + Scrolled class
   3. Active Nav Link Highlighting
   4. Mobile Menu Toggle
   5. Scroll Reveal Animations
   6. Skill Progress Bars (animate on scroll)
   7. Contact Form Handler
   8. Footer Year
   9. Smooth close menu on nav-link click
   ============================================================ */


/* ============================================================
   1. TYPING EFFECT
   — Cycles through job titles in the hero section
   ✏️ EDIT: Add or remove lines from the `titles` array below
   ============================================================ */
(function initTypingEffect() {
  const titles = [
    'Aspiring Python Developer',
    'MCA Student | IT',
    'Backend Developer in the Making',
    'Open Source Enthusiast',
    'Problem Solver',
  ];

  const el       = document.getElementById('typing-text');
  if (!el) return;

  let titleIdx   = 0;  // which title we're on
  let charIdx    = 0;  // which character we're on
  let isDeleting = false;
  const TYPING_SPEED   = 70;   // ms per character (typing)
  const DELETING_SPEED = 40;   // ms per character (erasing)
  const PAUSE_AFTER    = 2000; // ms to wait before erasing
  const PAUSE_BEFORE   = 500;  // ms to wait before next word

  function type() {
    const current = titles[titleIdx];

    if (!isDeleting) {
      // Add one character
      el.textContent = current.substring(0, charIdx + 1);
      charIdx++;

      if (charIdx === current.length) {
        // Full word typed — pause then start deleting
        isDeleting = true;
        setTimeout(type, PAUSE_AFTER);
        return;
      }
    } else {
      // Remove one character
      el.textContent = current.substring(0, charIdx - 1);
      charIdx--;

      if (charIdx === 0) {
        // Word fully erased — move to next title
        isDeleting = false;
        titleIdx = (titleIdx + 1) % titles.length;
        setTimeout(type, PAUSE_BEFORE);
        return;
      }
    }

    setTimeout(type, isDeleting ? DELETING_SPEED : TYPING_SPEED);
  }

  // Start with a small delay so the page has loaded
  setTimeout(type, 800);
})();


/* ============================================================
   2. STICKY NAVBAR + SCROLLED CLASS
   — Adds .scrolled class to navbar after scrolling 50px
   — Triggers a subtle style change defined in CSS
   ============================================================ */
(function initStickyNav() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  function onScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
})();


/* ============================================================
   3. ACTIVE NAV LINK HIGHLIGHTING
   — Uses IntersectionObserver to detect which section is in view
   — Adds .active class to the matching nav link
   ============================================================ */
(function initActiveNav() {
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link[data-section]');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach((link) => {
            link.classList.toggle('active', link.dataset.section === id);
          });
        }
      });
    },
    {
      // Fire when section is 40% visible
      threshold: 0.4,
    }
  );

  sections.forEach((section) => observer.observe(section));
})();


/* ============================================================
   4. MOBILE MENU TOGGLE
   — Hamburger button opens/closes the nav on small screens
   ============================================================ */
(function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');
  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);

    // Prevent body scroll while menu is open
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });
})();


/* ============================================================
   5. SCROLL REVEAL ANIMATIONS
   — Watches elements with class .reveal
   — Adds .visible when they enter the viewport
   ============================================================ */
(function initReveal() {
  const revealEls = document.querySelectorAll('.reveal');
  if (!revealEls.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Unobserve after animation so it only fires once
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,   // trigger when 12% of the element is visible
      rootMargin: '0px 0px -40px 0px', // slight offset from bottom
    }
  );

  revealEls.forEach((el) => observer.observe(el));
})();


/* ============================================================
   6. SKILL PROGRESS BARS
   — Waits until each .skill-card enters the viewport,
     then animates the progress bar width
   ============================================================ */
(function initProgressBars() {
  const bars = document.querySelectorAll('.progress-fill');
  if (!bars.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          const width = bar.dataset.width || '0';

          // Use a short delay so the reveal animation runs first
          setTimeout(() => {
            bar.style.width = width + '%';
          }, 300);

          observer.unobserve(bar);
        }
      });
    },
    { threshold: 0.3 }
  );

  bars.forEach((bar) => observer.observe(bar));
})();


/* ============================================================
   7. CONTACT FORM HANDLER
   — Basic client-side feedback while the form submits
   — For real form submission, connect to Formspree or EmailJS
   ✏️ EDIT: Replace action="#" in the <form> tag with your
             Formspree endpoint (https://formspree.io)
   ============================================================ */
(function initContactForm() {
  const form   = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  if (!form || !status) return;

  form.addEventListener('submit', async (e) => {
    const action = form.getAttribute('action');

    // If the form action hasn't been set to a real endpoint, show a demo message
    if (!action || action === '#') {
      e.preventDefault();
      status.textContent = '⚠️  Form not connected yet. Add your Formspree endpoint to the <form> action attribute.';
      status.style.color = '#f59e0b';
      return;
    }

    // Let the browser handle the real submission via Formspree
    // (or intercept here if you want a custom AJAX flow)
    status.textContent = '✉️  Sending…';
    status.style.color = 'var(--accent)';
  });
})();


/* ============================================================
   8. FOOTER YEAR
   — Keeps the copyright year always up to date
   ============================================================ */
(function setYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
})();


/* ============================================================
   9. CLOSE MOBILE MENU ON NAV-LINK CLICK
   — When a nav link is tapped on mobile, close the menu
      and re-enable body scroll
   ============================================================ */
(function closeMenuOnClick() {
  const navLinks  = document.getElementById('nav-links');
  const hamburger = document.getElementById('hamburger');
  if (!navLinks || !hamburger) return;

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
})();
