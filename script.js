(() => {
  document.documentElement.classList.add('js');
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  initNav();
  initSpy();
  initReveal();
  initCountUp();
  initYear();
  initForm();

  /* ---------- Nav: sticky style + mobile menu ---------- */
  function initNav() {
    const nav = document.getElementById('nav');
    if (!nav) return;
    const toggle = nav.querySelector('.nav-toggle');
    const links = nav.querySelectorAll('.nav-links a');

    const onScroll = () => {
      if (window.scrollY > 8) nav.classList.add('is-scrolled');
      else nav.classList.remove('is-scrolled');
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    links.forEach(a => a.addEventListener('click', () => {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    }));
  }

  /* ---------- Scroll-spy: highlight active nav link ---------- */
  function initSpy() {
    const nav = document.getElementById('nav');
    if (!nav) return;
    const links = nav.querySelectorAll('.nav-links a');
    const sections = Array.from(document.querySelectorAll('main section[id]'));
    const byId = new Map(Array.from(links).map(a => [(a.getAttribute('href') || '').replace(/^#/, ''), a]));
    const spy = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        const link = byId.get(e.target.id);
        if (!link) return;
        if (e.isIntersecting) {
          links.forEach(l => l.classList.remove('is-active'));
          link.classList.add('is-active');
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });
    sections.forEach(s => spy.observe(s));
  }

  /* ---------- Reveal on scroll (+ data-delay stagger) ---------- */
  function initReveal() {
    const els = document.querySelectorAll('.reveal');
    if (prefersReduced) {
      els.forEach(el => el.classList.add('in-view'));
      return;
    }
    els.forEach(el => {
      const d = el.getAttribute('data-delay');
      if (d) el.style.setProperty('--d', `${d}ms`);
    });
    // Stagger timeline items automatically
    document.querySelectorAll('.tl-item.reveal').forEach((el, i) => {
      el.style.setProperty('--d', `${i * 90}ms`);
    });
    const reveal = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in-view');
          reveal.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    els.forEach(el => reveal.observe(el));
  }

  /* ---------- Count-up stats: [data-count] animates 0 → value ---------- */
  function initCountUp() {
    const els = document.querySelectorAll('[data-count]');
    if (!els.length || prefersReduced) return; // markup already holds final values
    const fmt = (el, v) => {
      el.textContent = String(v);
    };
    const run = (el) => {
      const target = parseInt(el.getAttribute('data-count'), 10);
      if (isNaN(target)) return;
      const dur = 1200;
      let start;
      const step = (t) => {
        if (start === undefined) start = t;
        const p = Math.min((t - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        fmt(el, Math.round(eased * target));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          run(e.target);
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.5 });
    els.forEach(el => io.observe(el));
  }

  /* ---------- Footer year ---------- */
  function initYear() {
    const y = document.getElementById('year');
    if (y) y.textContent = new Date().getFullYear();
  }

  /* ----------------------------------------------------------------
     Lead form → Google Apps Script (appends to Sheet + emails Japs)

     SETUP: paste your deployed Apps Script Web App URL below.
     See SETUP.md for the 5-minute, one-time deploy steps.
     ---------------------------------------------------------------- */
  function initForm() {
    const FORM_ENDPOINT = 'REPLACE_WITH_YOUR_APPS_SCRIPT_WEB_APP_URL';
    const FALLBACK_EMAIL = 'jaspher.lising01@gmail.com';

    const form = document.getElementById('leadForm');
    if (!form) return;
    const statusEl = form.querySelector('.lf-status');
    const submitBtn = form.querySelector('#lf-submit');

    const setStatus = (kind, msg) => {
      statusEl.textContent = msg;
      statusEl.className = 'lf-status' + (kind ? ' is-' + kind : '');
    };
    const val = (n) => {
      const el = form.querySelector(`[name="${n}"]`);
      return el ? el.value.trim() : '';
    };

    form.addEventListener('submit', async (ev) => {
      ev.preventDefault();

      // Honeypot — if filled, it's a bot. Pretend success, send nothing.
      if (val('company_website')) {
        form.reset();
        setStatus('ok', "Got it — thanks. I'll get back to you within a day.");
        return;
      }

      // Native validation (required fields + email format)
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      if (FORM_ENDPOINT.includes('REPLACE_WITH')) {
        setStatus('error', `Form isn't connected yet. For now, email me at ${FALLBACK_EMAIL}.`);
        return;
      }

      const payload = {
        name: val('name'),
        email: val('email'),
        phone: val('phone'),
        message: val('message'),
        page: location.pathname + location.hash,
        ts: new Date().toISOString()
      };

      const original = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';
      setStatus('', '');

      try {
        // Apps Script web apps don't return CORS headers, so we send a
        // "simple" request (text/plain, no preflight) in no-cors mode.
        // The row is written + email sent; we treat a resolved fetch as success.
        await fetch(FORM_ENDPOINT, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(payload)
        });
        form.reset();
        setStatus('ok', "Got it — thanks. I'll get back to you within a day.");
      } catch (err) {
        setStatus('error', `Couldn't send just now. Email me at ${FALLBACK_EMAIL} and I'll jump on it.`);
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = original;
      }
    });
  }
})();
