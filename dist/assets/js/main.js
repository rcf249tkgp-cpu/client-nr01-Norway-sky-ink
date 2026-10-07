/* Sky Ink Tattoo – interactions and motion.
   Progressive enhancement: everything works without this file; GSAP,
   ScrollTrigger and Lenis add the motion layer when available. */
(() => {
  'use strict';

  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const root = document.documentElement;
  const data = window.SKYINK || { works: [] };

  const reduceMQ = matchMedia('(prefers-reduced-motion: reduce)');
  const reduce = reduceMQ.matches;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const gsap = window.gsap;
  const ST = window.ScrollTrigger;
  const motion = !!(gsap && ST) && !reduce;

  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* private mode */ } },
  };

  /* ---------- Intro ---------- */
  const intro = $('[data-intro]');
  if (intro) {
    try { sessionStorage.setItem('skyink-intro', '1'); } catch (e) { /* ignore */ }
    setTimeout(() => intro.remove(), root.classList.contains('no-intro') || reduce ? 0 : 1600);
  }

  /* ---------- Smooth scroll (Lenis) ---------- */
  let lenis = null;
  if (motion && window.Lenis) {
    lenis = new window.Lenis({ duration: 1.15, easing: (t) => 1 - Math.pow(1 - t, 4), smoothWheel: true });
    lenis.on('scroll', ST.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  // Header clearance comes from `scroll-padding-top` in CSS, which both
  // native scrolling and Lenis respect.
  function scrollToTarget(target) {
    if (lenis) lenis.scrollTo(target, { duration: 1.4 });
    else target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  }

  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href*="#"]');
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey) return;
    const url = new URL(a.href, location.href);
    if (url.pathname !== location.pathname || !url.hash) return;
    const target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
    if (!target) return;
    e.preventDefault();
    closeMenu();
    history.pushState(null, '', url.hash);
    scrollToTarget(target);
  });

  /* ---------- Header ---------- */
  const header = $('[data-header]');
  if (header && !header.classList.contains('is-solid')) {
    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // Highlight the nav link of the section in view
  const navLinks = $$('.nav__list a');
  if ('IntersectionObserver' in window && navLinks.length) {
    const byId = new Map(navLinks.map((a) => [a.hash.slice(1), a]));
    const io = new IntersectionObserver(
      (entries) => entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const link = byId.get(en.target.id);
        navLinks.forEach((l) => { l.classList.toggle('is-active', l === link); if (l !== link) l.removeAttribute('aria-current'); });
        link?.setAttribute('aria-current', 'location');
      }),
      { rootMargin: '-45% 0px -50% 0px' },
    );
    $$('main > section').forEach((s) => io.observe(s));
  }

  /* ---------- Mobile menu ---------- */
  const menuBtn = $('[data-menu-toggle]');
  const menu = $('[data-menu]');
  function setMenu(open) {
    if (!menuBtn || !menu) return;
    menuBtn.setAttribute('aria-expanded', String(open));
    menu.hidden = !open;
    root.classList.toggle('menu-open', open);
    const label = menuBtn.querySelector('.sr-only');
    label.textContent = open ? label.dataset.closeLabel : label.dataset.openLabel;
    if (lenis) open ? lenis.stop() : lenis.start();
    if (open) menu.querySelector('a')?.focus();
  }
  function closeMenu() { if (menuBtn?.getAttribute('aria-expanded') === 'true') setMenu(false); }
  menuBtn?.addEventListener('click', () => setMenu(menuBtn.getAttribute('aria-expanded') !== 'true'));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menuBtn?.getAttribute('aria-expanded') === 'true') { setMenu(false); menuBtn.focus(); }
  });

  /* ---------- Scroll motion (GSAP + ScrollTrigger) ---------- */
  if (motion) {
    gsap.registerPlugin(ST);
    root.classList.add('has-motion');

    ST.batch('[data-reveal]', {
      start: 'top 88%',
      once: true,
      onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, duration: 1.1, ease: 'power3.out', stagger: 0.12, overwrite: true }),
    });

    $$('[data-reveal-img]').forEach((el) => {
      const media = el.querySelector('img, .portrait-slot, .map__consent');
      const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
      tl.to(el, { clipPath: 'inset(0% 0 0 0)', duration: 1.5, ease: 'power4.inOut' });
      if (media) tl.from(media, { scale: 1.18, duration: 1.9, ease: 'power3.out' }, 0);
    });

    $$('[data-parallax]').forEach((el) => {
      const f = parseFloat(el.dataset.parallax) || 0.1;
      gsap.fromTo(el, { '--py': `${-f * 220}px` }, {
        '--py': `${f * 220}px`,
        ease: 'none',
        scrollTrigger: { trigger: el.closest('section') || el, start: 'top bottom', end: 'bottom top', scrub: true },
      });
    });

    // Stat counters
    const nf = new Intl.NumberFormat(data.lang === 'no' ? 'nb-NO' : 'en-GB');
    $$('[data-count]').forEach((el) => {
      const end = Number(el.dataset.count);
      const plain = el.hasAttribute('data-plain');
      const obj = { v: plain ? end - 19 : 0 };
      const render = () => { el.textContent = plain ? Math.round(obj.v) : nf.format(Math.round(obj.v)); };
      render();
      ST.create({
        trigger: el, start: 'top 90%', once: true,
        onEnter: () => gsap.to(obj, { v: end, duration: 2.2, ease: 'power2.out', onUpdate: render }),
      });
    });

    // Marquee: slow drift that speeds up with scroll velocity
    const track = $('[data-marquee-track]');
    if (track) {
      let x = 0;
      let boost = 0;
      let half = track.scrollWidth / 2;
      window.addEventListener('resize', () => { half = track.scrollWidth / 2; });
      ST.create({
        trigger: track, start: 'top bottom', end: 'bottom top',
        onUpdate: (self) => { boost = Math.min(Math.abs(self.getVelocity()) / 18, 220); },
      });
      gsap.ticker.add((_, dt) => {
        boost *= 0.94;
        x -= ((38 + boost) * dt) / 1000;
        if (-x >= half) x += half;
        track.style.transform = `translate3d(${x}px,0,0)`;
      });
    }

    window.addEventListener('load', () => ST.refresh());
  } else {
    $$('[data-count]').forEach((el) => {
      if (!el.hasAttribute('data-plain')) el.textContent = new Intl.NumberFormat(data.lang === 'no' ? 'nb-NO' : 'en-GB').format(Number(el.dataset.count));
    });
  }

  /* ---------- Arc carousel ---------- */
  (function arcCarousel() {
    const arc = $('[data-arc]');
    if (!arc) return;
    const ring = $('[data-arc-ring]', arc);
    const toggle = $('[data-arc-toggle]', arc);
    const mq = matchMedia('(min-width: 900px)');
    let st = null;

    function enable() {
      if (st || reduce || !mq.matches) return;
      arc.classList.add('arc--3d');
      const originals = $$('[data-arc-card]', ring);
      const n = originals.length;
      const reps = Math.max(1, Math.ceil(24 / n));
      const clones = [];
      for (let r = 1; r < reps; r++) {
        originals.forEach((c) => {
          const k = c.cloneNode(true);
          k.setAttribute('aria-hidden', 'true');
          k.querySelector('button').setAttribute('tabindex', '-1');
          k.dataset.clone = '';
          ring.appendChild(k);
          clones.push(k);
        });
      }
      const cards = [...originals, ...clones];
      const step = 360 / cards.length;
      st = {
        cards, clones, step, rot: 0, vel: 0, auto: -3.2, speed: -3.2, paused: false, hover: false,
        visible: true, raf: 0, last: performance.now(), drag: null, R: 0,
      };
      measure();
      st.raf = requestAnimationFrame(frame);
    }

    function disable() {
      if (!st) return;
      cancelAnimationFrame(st.raf);
      st.clones.forEach((c) => c.remove());
      $$('[data-arc-card]', ring).forEach((c) => { c.style.transform = ''; c.style.visibility = ''; c.style.removeProperty('--shade'); });
      arc.classList.remove('arc--3d');
      st = null;
    }

    function measure() {
      const w = st.cards[0].offsetWidth || 220;
      st.R = (w / (2 * Math.sin((st.step * Math.PI) / 360))) * 1.1;
    }

    function layout() {
      const { cards, step, rot, R } = st;
      for (let i = 0; i < cards.length; i++) {
        let a = (i * step + rot) % 360;
        if (a > 180) a -= 360;
        if (a < -180) a += 360;
        const c = cards[i];
        if (Math.abs(a) > 62) { c.style.visibility = 'hidden'; continue; }
        const rad = (a * Math.PI) / 180;
        const x = R * Math.sin(rad);
        const z = R * (1 - Math.cos(rad));
        c.style.visibility = '';
        c.style.transform = `translate3d(${x.toFixed(1)}px,0,${z.toFixed(1)}px) rotateY(${(-a).toFixed(2)}deg)`;
        c.style.setProperty('--shade', Math.min(0.62, 0.12 + Math.abs(a) / 85).toFixed(3));
      }
    }

    function frame(now) {
      if (!st) return;
      const dt = Math.min(64, now - st.last) / 1000;
      st.last = now;
      if (!st.drag) {
        const target = st.paused || st.hover ? 0 : st.auto;
        st.speed += (target - st.speed) * Math.min(1, dt * 2.2);
        st.vel *= Math.pow(0.04, dt);
        st.rot += (st.speed + st.vel) * dt;
      }
      layout();
      st.raf = st.visible ? requestAnimationFrame(frame) : 0;
    }

    function wake() { if (st && !st.raf && st.visible) { st.last = performance.now(); st.raf = requestAnimationFrame(frame); } }

    // Drag to spin (pointer). Capture only after a real drag so clicks still open cards.
    arc.addEventListener('pointerdown', (e) => {
      if (!st || e.button !== 0 || e.target.closest('.arc__controls')) return;
      st.drag = { x: e.clientX, lastX: e.clientX, t: performance.now(), moved: false, id: e.pointerId, v: 0 };
    });
    arc.addEventListener('pointermove', (e) => {
      const d = st?.drag;
      if (!d || e.pointerId !== d.id) return;
      const dx = e.clientX - d.lastX;
      if (!d.moved && Math.abs(e.clientX - d.x) > 6) {
        d.moved = true;
        arc.classList.add('is-dragging');
        try { arc.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
      }
      if (d.moved) {
        const now = performance.now();
        const deg = dx * 0.11;
        st.rot += deg;
        d.v = (deg / Math.max(1, now - d.t)) * 1000;
        d.t = now;
        layout();
      }
      d.lastX = e.clientX;
    });
    const endDrag = (e) => {
      const d = st?.drag;
      if (!d || (e.pointerId !== undefined && e.pointerId !== d.id)) return;
      if (d.moved) {
        st.vel = Math.max(-120, Math.min(120, d.v));
        st.speed = 0;
        arc.classList.remove('is-dragging');
        st.suppressClickUntil = performance.now() + 80;
      }
      st.drag = null;
    };
    // A drag ends with a click on whatever card is under the pointer – swallow
    // only that one (time-boxed, so a missing click never eats the next one).
    arc.addEventListener('click', (ev) => {
      if (st && performance.now() < (st.suppressClickUntil || 0)) { ev.preventDefault(); ev.stopPropagation(); }
    }, { capture: true });
    arc.addEventListener('pointerup', endDrag);
    arc.addEventListener('pointercancel', endDrag);
    arc.addEventListener('pointerenter', (e) => { if (st && e.pointerType === 'mouse') st.hover = true; });
    arc.addEventListener('pointerleave', () => { if (st) st.hover = false; });

    // Keyboard: focusing a card turns it to the front
    arc.addEventListener('focusin', (e) => {
      if (!st) return;
      const card = e.target.closest('[data-arc-card]');
      st.hover = true;
      if (!card) return;
      const i = st.cards.indexOf(card);
      let target = -i * st.step;
      target += Math.round((st.rot - target) / 360) * 360;
      const from = st.rot;
      const t0 = performance.now();
      const anim = (now) => {
        if (!st) return;
        const p = Math.min(1, (now - t0) / 700);
        st.rot = from + (target - from) * (1 - Math.pow(1 - p, 3));
        if (p < 1) requestAnimationFrame(anim);
      };
      requestAnimationFrame(anim);
    });
    arc.addEventListener('focusout', (e) => { if (st && !arc.contains(e.relatedTarget)) st.hover = false; });

    toggle?.addEventListener('click', () => {
      if (!st) return;
      st.paused = !st.paused;
      toggle.setAttribute('aria-pressed', String(st.paused));
      toggle.querySelector('.sr-only').textContent = st.paused ? toggle.dataset.playLabel : toggle.dataset.pauseLabel;
    });

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([en]) => {
        if (!st) return;
        st.visible = en.isIntersecting;
        wake();
      }).observe(arc);
    }
    document.addEventListener('visibilitychange', () => { if (st) { st.visible = !document.hidden; wake(); } });

    let rt;
    window.addEventListener('resize', () => {
      clearTimeout(rt);
      rt = setTimeout(() => { if (st) measure(); }, 150);
    });
    mq.addEventListener?.('change', () => (mq.matches ? enable() : disable()));
    enable();
  })();

  /* ---------- Portfolio filter ---------- */
  const grid = $('[data-work-grid]');
  const status = $('[data-filter-status]');
  const empty = $('[data-work-empty]');
  $$('[data-filter]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const f = btn.dataset.filter;
      $$('[data-filter]').forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
      let shown = 0;
      $$('.work', grid).forEach((item) => {
        const match = f === 'all' || item.dataset.styles.split(' ').includes(f);
        item.hidden = !match;
        if (match) {
          shown++;
          if (motion) {
            const el = item.querySelector('[data-reveal-img]');
            gsap.fromTo(el, { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', duration: 0.9, ease: 'power3.inOut', delay: shown * 0.06, overwrite: true });
          }
        }
      });
      if (empty) empty.hidden = shown > 0;
      if (status) status.textContent = data.count?.[shown] || '';
      if (motion) ST.refresh();
    });
  });

  /* ---------- Lightbox ---------- */
  const lb = $('[data-lightbox]');
  if (lb && data.works.length) {
    const img = $('[data-lb-img]', lb);
    const title = $('[data-lb-title]', lb);
    const count = $('[data-lb-count]', lb);
    let list = data.works;
    let idx = 0;
    let opener = null;

    const show = (i) => {
      idx = (i + list.length) % list.length;
      const w = list[idx];
      img.classList.add('is-swapping');
      const next = new Image();
      next.onload = next.onerror = () => {
        img.src = w.src;
        img.width = w.w;
        img.height = w.h;
        img.alt = w.alt;
        img.classList.remove('is-swapping');
      };
      next.src = w.src;
      title.textContent = w.title;
      count.textContent = `${idx + 1} ${count.dataset.of} ${list.length}`;
    };

    document.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-open-work]');
      if (!btn || e.defaultPrevented) return;
      const fromGrid = !!btn.closest('[data-work-grid]');
      const ids = fromGrid
        ? $$('.work', grid).filter((li) => !li.hidden).map((li) => li.dataset.work)
        : data.works.map((w) => w.id);
      list = ids.map((id) => data.works.find((w) => w.id === id)).filter(Boolean);
      opener = btn;
      show(list.findIndex((w) => w.id === btn.dataset.openWork));
      lb.showModal();
      lenis?.stop();
    });
    $('[data-lb-prev]', lb).addEventListener('click', () => show(idx - 1));
    $('[data-lb-next]', lb).addEventListener('click', () => show(idx + 1));
    $('[data-lb-close]', lb).addEventListener('click', () => lb.close());
    lb.addEventListener('click', (e) => { if (e.target === lb) lb.close(); });
    lb.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') show(idx - 1);
      if (e.key === 'ArrowRight') show(idx + 1);
    });
    lb.addEventListener('close', () => {
      lenis?.start();
      if (opener && !opener.closest('[aria-hidden="true"]')) opener.focus({ preventScroll: true });
    });
    // swipe
    let sx = null;
    lb.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse') sx = e.clientX; });
    lb.addEventListener('pointerup', (e) => {
      if (sx === null) return;
      const dx = e.clientX - sx;
      if (Math.abs(dx) > 50) show(idx + (dx < 0 ? 1 : -1));
      sx = null;
    });
  }

  /* ---------- Reviews slider ---------- */
  const rTrack = $('[data-review-track]');
  if (rTrack) {
    const by = (dir) => rTrack.scrollBy({ left: dir * rTrack.clientWidth, behavior: reduce ? 'auto' : 'smooth' });
    $('[data-review-prev]')?.addEventListener('click', () => by(-1));
    $('[data-review-next]')?.addEventListener('click', () => by(1));
  }

  /* ---------- Gift card tilt ---------- */
  const card = $('[data-tilt]');
  if (card && finePointer && !reduce) {
    const zone = card.parentElement;
    zone.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      card.style.setProperty('--ry', `${(px * 10).toFixed(2)}deg`);
      card.style.setProperty('--rx', `${(-py * 8).toFixed(2)}deg`);
      card.style.setProperty('--shine', `${(px * 60).toFixed(1)}%`);
    });
    zone.addEventListener('pointerleave', () => {
      ['--rx', '--ry', '--shine'].forEach((p) => card.style.removeProperty(p));
    });
  }

  /* ---------- Booking form ---------- */
  const form = $('[data-booking-form]');
  if (form) {
    const E = data.errors || {};
    const summary = $('[data-form-summary]', form);
    const submit = $('[data-submit]', form);
    const files = $('#f-files', form);
    const fileNames = $('[data-file-names]', form);
    const success = $('[data-form-success]');
    const fallback = $('[data-form-fallback]');
    const MAX_BYTES = 10 * 1024 * 1024;
    let tried = false;

    const fieldEl = (name) => $(`[data-field="${name}"]`, form);
    const setError = (name, msg) => {
      const f = fieldEl(name);
      if (!f) return;
      const err = $('.field__error', f);
      const input = $('input, textarea, select', f);
      f.classList.toggle('is-invalid', !!msg);
      err.hidden = !msg;
      err.textContent = msg || '';
      if (input && input.type !== 'file') input.setAttribute('aria-invalid', msg ? 'true' : 'false');
    };

    const rules = {
      name: () => (form.name.value.trim().length < 2 ? E.name : ''),
      phone: () => (form.phone.value.replace(/\D/g, '').length < 8 ? E.phone : ''),
      placement: () => (!form.placement.value.trim() ? E.placement : ''),
      description: () => (form.description.value.trim().length < 5 ? E.description : ''),
      age: () => (!form.age_confirmed.checked ? E.age : ''),
      consent: () => (!form.consent.checked ? E.consent : ''),
      files: () => {
        const list = [...(files.files || [])];
        if (list.length > 5) return E.tooMany;
        if (list.reduce((s, f) => s + f.size, 0) > MAX_BYTES) return E.files;
        return '';
      },
    };
    const validate = () => {
      let first = null;
      Object.entries(rules).forEach(([name, rule]) => {
        const msg = rule();
        setError(name, msg);
        if (msg && !first) first = name;
      });
      return first;
    };

    // After the first submit: clear errors as soon as a field becomes valid
    // (while typing), and only add new ones on blur/change. Clearing on input
    // avoids layout jumps under the pointer when the user moves on.
    Object.keys(rules).forEach((name) => {
      const input = $('input, textarea', fieldEl(name));
      if (!input) return;
      const instant = input.type === 'checkbox' || input.type === 'file';
      input.addEventListener(instant ? 'change' : 'blur', () => { if (tried) setError(name, rules[name]()); });
      if (!instant) {
        input.addEventListener('input', () => {
          if (tried && fieldEl(name).classList.contains('is-invalid') && !rules[name]()) setError(name, '');
        });
      }
    });

    files.addEventListener('change', () => {
      const n = files.files.length;
      const names = [...files.files].map((f) => f.name).join(', ');
      fileNames.textContent = n ? `${data.files.chosen[Math.min(n, 5)] || n}: ${names}` : fileNames.dataset.none;
      setError('files', rules.files());
    });
    const fileField = fieldEl('files');
    ['dragenter', 'dragover'].forEach((ev) => fileField.addEventListener(ev, (e) => { e.preventDefault(); fileField.classList.add('is-drag'); }));
    ['dragleave', 'drop'].forEach((ev) => fileField.addEventListener(ev, () => fileField.classList.remove('is-drag')));
    fileField.addEventListener('drop', (e) => {
      e.preventDefault();
      if (e.dataTransfer?.files?.length) {
        files.files = e.dataTransfer.files;
        files.dispatchEvent(new Event('change'));
      }
    });

    const composeText = () => {
      const L = data.labels;
      const v = (n) => form[n].value.trim();
      const head = [
        data.fallbackHeading,
        `${L.name}: ${v('name')}`,
        `${L.phone}: ${v('phone')}`,
        v('email') && `${L.email}: ${v('email')}`,
        `${L.placement}: ${v('placement')}`,
        v('size') && `${L.size}: ${v('size')}`,
        v('style') && `${L.style}: ${v('style')}`,
      ].filter(Boolean);
      return `${head.join('\n')}\n\n${v('description')}`;
    };

    const showPanel = (panel) => {
      form.hidden = true;
      panel.hidden = false;
      panel.focus();
      if (motion) gsap.from(panel, { opacity: 0, y: 16, duration: 0.7, ease: 'power3.out' });
    };

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      tried = true;
      const first = validate();
      if (first) {
        summary.hidden = false;
        $('span', summary).textContent = E.summary;
        const target = $('input, textarea, select', fieldEl(first));
        target?.focus();
        return;
      }
      summary.hidden = true;
      if (form.querySelector('[name="_gotcha"]').value) return; // bot

      const endpoint = form.dataset.endpoint;
      if (!endpoint) {
        const text = composeText();
        const sms = $('[data-fallback-sms]', fallback);
        sms.href = `sms:+4791796954?&body=${encodeURIComponent(text)}`;
        fallback.dataset.text = text;
        showPanel(fallback);
        return;
      }

      const label = submit.textContent;
      submit.disabled = true;
      submit.setAttribute('aria-busy', 'true');
      submit.textContent = submit.dataset.sending;
      try {
        const res = await fetch(endpoint, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
        if (!res.ok) throw new Error(String(res.status));
        form.reset();
        showPanel(success);
      } catch (err) {
        summary.hidden = false;
        $('span', summary).textContent = E.send;
        summary.focus?.();
      } finally {
        submit.disabled = false;
        submit.removeAttribute('aria-busy');
        submit.textContent = label;
      }
    });

    $('[data-fallback-copy]', fallback)?.addEventListener('click', async (e) => {
      const msg = $('[data-copied-msg]', fallback);
      try {
        await navigator.clipboard.writeText(fallback.dataset.text || '');
        msg.textContent = msg.dataset.text;
      } catch (err) { /* clipboard blocked – still open Messenger */ }
      window.open(e.currentTarget.dataset.messenger, '_blank', 'noopener');
    });
    $('[data-fallback-back]', fallback)?.addEventListener('click', () => {
      fallback.hidden = true;
      form.hidden = false;
      form.querySelector('textarea')?.focus();
    });
  }

  /* ---------- Map (loads on request) ---------- */
  $$('[data-map-load]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const box = btn.closest('[data-map]');
      const frame = document.createElement('iframe');
      frame.src = box.dataset.src;
      frame.title = box.dataset.title;
      frame.loading = 'lazy';
      frame.referrerPolicy = 'no-referrer-when-downgrade';
      frame.allowFullscreen = true;
      box.parentElement.appendChild(frame);
      box.remove();
      frame.setAttribute('tabindex', '0');
      frame.focus();
    });
  });

  /* ---------- Cookie notice ---------- */
  const cookie = $('[data-cookie]');
  if (cookie && !store.get('skyink-cookie')) {
    cookie.hidden = false;
    $('[data-cookie-ok]', cookie).addEventListener('click', () => {
      store.set('skyink-cookie', '1');
      cookie.hidden = true;
    });
  }

  /* ---------- Custom cursor ---------- */
  const cursor = $('[data-cursor-el]');
  if (cursor && finePointer && !reduce) {
    root.classList.add('has-cursor');
    const label = $('.cursor__label', cursor);
    label.textContent = data.view || 'Se';
    const moveX = gsap ? gsap.quickTo(cursor, 'x', { duration: 0.35, ease: 'power3' }) : (v) => { cursor.style.left = `${v}px`; };
    const moveY = gsap ? gsap.quickTo(cursor, 'y', { duration: 0.35, ease: 'power3' }) : (v) => { cursor.style.top = `${v}px`; };
    window.addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse') return;
      moveX(e.clientX);
      moveY(e.clientY);
      cursor.classList.remove('is-hidden');
    }, { passive: true });
    document.addEventListener('pointerover', (e) => {
      const t = e.target;
      const view = t.closest('[data-cursor="view"]');
      cursor.classList.toggle('is-view', !!view);
      cursor.classList.toggle('is-link', !view && !!t.closest('a, button, summary, label, select'));
      cursor.classList.toggle('is-hidden', !!t.closest('input, textarea, iframe'));
    });
    document.documentElement.addEventListener('pointerleave', () => cursor.classList.add('is-hidden'));
  }
})();
