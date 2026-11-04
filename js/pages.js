/* Per-page animation timelines. Each inner page uses a different style. */
(() => {
  if (!window.gsap) return;
  gsap.registerPlugin(ScrollTrigger);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const page = document.body.dataset.page;
  const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];

  /* Highlight current nav link */
  $$('.nav ul a').forEach(a => { if (a.getAttribute('href') === location.pathname.split('/').pop()) a.setAttribute('aria-current', 'page'); });
  /* Scroll progress (shared) */
  gsap.to('#progress', { scaleX: 1, ease: 'none', scrollTrigger: { scrub: .3, start: 0, end: 'max' } });
  /* Counters (shared) */
  $$('[data-count]').forEach(el => { const o = { v: 0 };
    gsap.to(o, { v: +el.dataset.count, duration: reduce ? 0 : 2, scrollTrigger: { trigger: el, start: 'top 90%' }, onUpdate: () => el.textContent = Math.round(o.v) }); });

  const chars = el => { el.innerHTML = [...el.textContent].map(c => c === ' ' ? ' ' : `<span class="ch">${c}</span>`).join(''); return el.querySelectorAll('.ch'); };
  const words = el => { el.innerHTML = el.textContent.split(' ').map(w => `<span style="display:inline-block;overflow:hidden"><span class="wd" style="display:inline-block">${w}</span></span>`).join(' '); return el.querySelectorAll('.wd'); };
  const A = {};

  /* ABOUT: 3D character flip-in, sticky story with clip reveal, team stagger */
  A.about = () => {
    gsap.from(chars($('#split')), { rotateX: -90, y: 60, opacity: 0, stagger: .03, duration: .9, ease: 'back.out(1.6)', transformOrigin: '50% 100%' });
    $$('.reveal-img').forEach(el => { el.style.clipPath = 'inset(0 100% 0 0)';
      gsap.to(el, { clipPath: 'inset(0 0% 0 0)', duration: 1.3, ease: 'power3.inOut', scrollTrigger: { trigger: el, start: 'top 80%' } }); });
    gsap.from('.member', { y: 80, rotate: 4, opacity: 0, stagger: .12, scrollTrigger: { trigger: '.team', start: 'top 80%' } });
    gsap.from('.mv div', { x: -60, opacity: 0, stagger: .2, scrollTrigger: { trigger: '.mv', start: 'top 85%' } });
  };

  /* SERVICES: sliding words, GSAP accordion, flip cards, drawing timeline */
  A.services = () => {
    gsap.from(words($('#split')), { xPercent: -110, skewX: 20, stagger: .1, duration: 1, ease: 'expo.out' });
    $$('.acc button').forEach(b => b.addEventListener('click', () => {
      const body = b.nextElementSibling, open = b.getAttribute('aria-expanded') === 'true';
      $$('.acc button[aria-expanded=true]').forEach(o => { if (o !== b) { o.setAttribute('aria-expanded', false); gsap.to(o.nextElementSibling, { height: 0, duration: .5 }); } });
      b.setAttribute('aria-expanded', !open);
      gsap.to(body, { height: open ? 0 : 'auto', duration: .6, ease: 'power3.inOut' });
    }));
    $$('.flip').forEach(f => { const t = () => f.classList.toggle('on'); f.addEventListener('click', t); f.addEventListener('keydown', e => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), t())); });
    gsap.to('.line', { '--p': 1, ease: 'none', scrollTrigger: { trigger: '.line', start: 'top 80%', end: 'bottom 60%', scrub: true } });
    gsap.from('.line div', { y: 30, opacity: 0, stagger: .2, scrollTrigger: { trigger: '.line', start: 'top 85%' } });
  };

  /* BLOG: slide-up cards, live filter + search */
  A.blog = () => {
    gsap.from($('#split'), { clipPath: 'inset(0 0 100% 0)', y: 40, duration: 1.1, ease: 'power4.out' });
    gsap.from('.post', { y: 60, opacity: 0, stagger: .08, scrollTrigger: { trigger: '#posts', start: 'top 85%' } });
    let cat = 'all', q = '';
    const apply = () => { let n = 0;
      $$('.post').forEach(p => { const show = (cat === 'all' || p.dataset.cat === cat) && p.textContent.toLowerCase().includes(q); p.style.display = show ? '' : 'none'; n += show; });
      $('#empty').style.display = n ? 'none' : 'block'; };
    $$('.filters button').forEach(b => b.addEventListener('click', () => { $$('.filters button').forEach(x => x.classList.remove('on')); b.classList.add('on'); cat = b.dataset.f; apply(); }));
    $('#q').addEventListener('input', e => { q = e.target.value.toLowerCase(); apply(); });
  };

  /* CONTACT: giant scrubbed marquee type, form slide-in */
  A.contact = () => {
    gsap.to('.giant', { xPercent: -40, ease: 'none', scrollTrigger: { scrub: 1, start: 0, end: 'max' } });
    gsap.from(chars($('#split')), { y: 100, opacity: 0, stagger: .04, duration: .8, ease: 'power4.out' });
    gsap.from('form .field', { x: 60, opacity: 0, stagger: .08, scrollTrigger: { trigger: 'form', start: 'top 80%' } });
  };

  /* CREATE ACCOUNT: curtain wipe + password strength meter */
  A['create-account'] = () => {
    gsap.to('.curtain', { yPercent: -100, duration: 1.2, ease: 'power4.inOut', delay: .2 });
    gsap.from('.auth__form > *', { y: 30, opacity: 0, stagger: .1, delay: .6 });
    const pw = $('#pw'), m = $('#meter'), t = $('#meter-t');
    pw.addEventListener('input', () => {
      const v = pw.value; let s = 0;
      if (v.length >= 8) s++; if (/[A-Z]/.test(v) && /[a-z]/.test(v)) s++; if (/\d/.test(v)) s++; if (/[^A-Za-z0-9]/.test(v)) s++;
      m.style.width = (v ? s * 25 : 0) + '%'; m.style.background = ['#FF5A1F', '#FF5A1F', '#FF5A1F', '#18213A', '#18213A'][s];
      t.textContent = 'Strength: ' + (v ? ['Very weak', 'Weak', 'Okay', 'Good', 'Strong'][s] : '—');
    });
  };

  if (!reduce && A[page]) A[page]();
  else if (A[page]) { /* reduced motion: keep functional features only */
    if (page === 'services') { $$('.acc button').forEach(b => b.addEventListener('click', () => { const o = b.getAttribute('aria-expanded') === 'true'; b.setAttribute('aria-expanded', !o); b.nextElementSibling.style.height = o ? 0 : 'auto'; })); $$('.flip').forEach(f => f.addEventListener('click', () => f.classList.toggle('on'))); $('.line').style.setProperty('--p', 1); }
    if (page === 'blog') { A.blog(); }
  }

  /* Hero decoration: floating collage, mouse-parallax blobs, entrance */
  if (!reduce && $('.phero')) {
    gsap.from('.collage img', { scale: .7, opacity: 0, stagger: .15, duration: 1.1, ease: 'power3.out', delay: .3 });
    $$('.collage img').forEach((el, i) => gsap.to(el, { y: i % 2 ? 14 : -14, duration: 3 + i * .4, repeat: -1, yoyo: true, ease: 'sine.inOut' }));
    gsap.from('.blob', { scale: 0, duration: 1.4, stagger: .2, ease: 'elastic.out(1,.6)' });
    addEventListener('mousemove', e => { const x = e.clientX / innerWidth - .5, y = e.clientY / innerHeight - .5;
      $$('.blob').forEach((b, i) => gsap.to(b, { x: x * (40 + i * 30), y: y * (40 + i * 30), duration: 1 })); });
  }

  /* Footer: staggered reveal (inner pages) */
  if (!reduce && $('.footer')) {
    gsap.from('.footer .big, .footer .big-logo', { y: 60, opacity: 0, stagger: .15, duration: .9, ease: 'power3.out', scrollTrigger: { trigger: '.footer', start: 'top 85%' } });
    gsap.from('.footer .cols > *', { y: 40, opacity: 0, stagger: .1, scrollTrigger: { trigger: '.footer .cols', start: 'top 90%' } });
  }

  /* Custom cursor + magnetic buttons (inner pages) */
  const cur = $('#cursor');
  if (cur && !reduce) {
    gsap.set(cur, { opacity: 0 }); let shown = false;
    const mx = gsap.quickTo(cur, 'x', { duration: .25 }), my = gsap.quickTo(cur, 'y', { duration: .25 });
    addEventListener('mousemove', e => { if (!shown) { shown = true; gsap.to(cur, { opacity: 1, duration: .3 }); } mx(e.clientX - 9); my(e.clientY - 9); });
    $$('a,button,summary,.card,.post,.member,.flip').forEach(el => {
      el.addEventListener('mouseenter', () => gsap.to(cur, { scale: 2.4, duration: .3 }));
      el.addEventListener('mouseleave', () => gsap.to(cur, { scale: 1, duration: .3 })); });
    $$('.magnetic').forEach(b => {
      b.addEventListener('mousemove', e => { const r = b.getBoundingClientRect();
        gsap.to(b, { x: (e.clientX - r.left - r.width / 2) * .3, y: (e.clientY - r.top - r.height / 2) * .3, duration: .3 }); });
      b.addEventListener('mouseleave', () => gsap.to(b, { x: 0, y: 0, duration: .6, ease: 'elastic.out(1,.4)' })); });
  }
})();
