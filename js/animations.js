/* GSAP + ScrollTrigger animations. Each section has its own timeline. */
gsap.registerPlugin(ScrollTrigger);
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Scroll progress */
gsap.to('#progress', { scaleX: 1, ease: 'none', scrollTrigger: { scrub: 0.3, start: 0, end: 'max' } });

/* Custom cursor + magnetic buttons */
const cur = document.getElementById('cursor');
if (cur && !reduce) {
  const mx = gsap.quickTo(cur, 'x', { duration: .25 }), my = gsap.quickTo(cur, 'y', { duration: .25 });
  gsap.set(cur, { opacity: 0 }); let shown = false;
  addEventListener('mousemove', e => { if (!shown) { shown = true; gsap.to(cur, { opacity: 1, duration: .3 }); } mx(e.clientX - 9); my(e.clientY - 9); });
  document.querySelectorAll('a,button,.card').forEach(el =>
    { el.addEventListener('mouseenter', () => gsap.to(cur, { scale: 2.4, duration: .3 }));
      el.addEventListener('mouseleave', () => gsap.to(cur, { scale: 1, duration: .3 })); });
  document.querySelectorAll('.magnetic').forEach(b => {
    b.addEventListener('mousemove', e => { const r = b.getBoundingClientRect();
      gsap.to(b, { x: (e.clientX - r.left - r.width / 2) * .3, y: (e.clientY - r.top - r.height / 2) * .3, duration: .3 }); });
    b.addEventListener('mouseleave', () => gsap.to(b, { x: 0, y: 0, duration: .6, ease: 'elastic.out(1,.4)' }));
  });
}

/* Split text into word spans */
function splitWords(el) {
  el.innerHTML = el.textContent.trim().split(/\s+/).map(w => `<span class="w"><span>${w}</span></span>`).join(' ');
  return el.querySelectorAll('.w span');
}
function startHero() {
  const words = splitWords(document.querySelector('.hero h1'));
  const tl = gsap.timeline();
  tl.from(words, { yPercent: 110, duration: 1, stagger: .08, ease: 'power4.out' })
    .from('.hero .cta .btn', { y: 30, opacity: 0, stagger: .15 }, '-=.4')
    .from('.orb', { scale: 0, duration: 1.2, stagger: .2, ease: 'back.out(1.7)' }, 0)
    .from('.float-card', { y: 80, rotate: 8, opacity: 0, duration: 1 }, .6);
  if (!reduce) {
    gsap.to('.float-card', { y: -18, rotate: -3, repeat: -1, yoyo: true, duration: 3, ease: 'sine.inOut' });
    gsap.to('.orb--a', { rotate: 360, repeat: -1, duration: 30, ease: 'none' });
    addEventListener('mousemove', e => gsap.to('.orb', { x: (e.clientX / innerWidth - .5) * 40, y: (e.clientY / innerHeight - .5) * 40, duration: 1 }));
  }
}

/* Loader (index only): a character writes "Digital". Hard timeout so it can never stick. */
const loader = document.getElementById('loader');
let pageReady = true, writeDone = false, hidden = false;   /* DOM is parsed here; photos keep loading lazily */
function hideLoader() {
  if (!loader || hidden) return; hidden = true;
  gsap.to(loader, { yPercent: -100, duration: reduce ? 0 : .8, ease: 'power4.inOut',
    onComplete: () => { gsap.killTweensOf(['#leg1', '#leg2', '#arm']); loader.remove(); startHero(); } });
}
const tryHide = () => { if (pageReady && writeDone) setTimeout(hideLoader, reduce ? 0 : 500); };
function runWriter() {
  const t = document.getElementById('wtext'), rect = document.getElementById('wrect'), line = document.getElementById('wline'),
        w = document.getElementById('writer'), tag = document.querySelector('#loader p');
  let bb = t.getBBox(); if (!(bb.width > 50)) bb = { x: 40, width: 430 };   /* fallback if the font has not measured yet */
  const endX = bb.x + bb.width;
  line.setAttribute('d', `M${bb.x} 178 Q ${bb.x + bb.width / 2} 196 ${endX} 174`);
  const len = line.getTotalLength();
  gsap.set(line, { strokeDasharray: len, strokeDashoffset: len }); gsap.set(tag, { opacity: 0, y: 10 });
  const finish = () => { writeDone = true; tryHide(); };
  if (reduce) { rect.setAttribute('width', 640); gsap.set(line, { strokeDashoffset: 0 }); gsap.set(tag, { opacity: 1, y: 0 }); gsap.set(w, { x: endX, y: 100 }); return finish(); }
  gsap.set(w, { x: bb.x, y: 100 });
  /* walking legs + scribbling arm */
  gsap.to('#leg1', { y: -6, duration: .18, repeat: -1, yoyo: true });
  gsap.to('#leg2', { y: -6, duration: .18, repeat: -1, yoyo: true, delay: .18 });
  gsap.to('#arm', { y: 4, duration: .1, repeat: -1, yoyo: true });
  const o = { p: 0 };
  gsap.timeline({ onComplete: finish })
    .to(o, { p: 1, duration: 2.8, ease: 'power1.inOut', onUpdate() {
      const x = bb.x + o.p * bb.width;
      rect.setAttribute('width', x + 6);                       /* reveal text up to the pen */
      gsap.set(w, { x, y: 100 + Math.sin(o.p * 50) * 7 });      /* character follows + bobs */
    } })
    .to(line, { strokeDashoffset: 0, duration: .5, ease: 'power2.out' })
    .to(w, { y: 70, duration: .25, yoyo: true, repeat: 1, ease: 'power2.out' }, '<.2')   /* happy jump */
    .to(tag, { opacity: 1, y: 0, duration: .5 }, '<');
}
if (loader) {
  /* (no wait for window 'load': slow photo downloads must not delay or break the loader) */
  setTimeout(hideLoader, 6500);
  const safeRun = () => { try { runWriter(); } catch (err) {   /* never leave the loader stuck */
    console.warn('Loader fallback:', err); writeDone = true;
    document.getElementById('wrect')?.setAttribute('width', 640);
    const tg = document.querySelector('#loader p'); if (tg) tg.style.opacity = 1; tryHide(); } };
  const fontReady = document.fonts ? document.fonts.load('120px Pacifico') : Promise.resolve();
  Promise.race([fontReady, new Promise(r => setTimeout(r, 900))]).then(safeRun, safeRun);
} else if (document.querySelector('.hero')) startHero();

if (!reduce) {
  /* Services — staggered card reveal */
  gsap.from('.services .card', { y: 80, opacity: 0, stagger: .1, scrollTrigger: { trigger: '.services .grid', start: 'top 80%' } });

  /* Process — pinned storytelling with changing backgrounds */
  const steps = gsap.utils.toArray('.process .step'), colors = ['#18213A', '#FF5A1F', '#18213A', '#FF5A1F', '#18213A'];
  const pt = gsap.timeline({ scrollTrigger: { trigger: '.process', pin: true, scrub: 1, end: '+=' + steps.length * 500 } });
  steps.forEach((s, i) => { if (i) pt.to(steps[i - 1], { opacity: 0, y: -40 }).to('.process', { backgroundColor: colors[i] }, '<').fromTo(s, { opacity: 0, y: 40 }, { opacity: 1, y: 0 }); });
  pt.to('.process .bar b', { scaleX: 1, ease: 'none', duration: pt.duration() }, 0);

  /* Horizontal scroll — desktop only */
  ScrollTrigger.matchMedia({ '(min-width: 801px)': () => {
    const t = document.querySelector('.hscroll__track');
    gsap.to(t, { x: () => -(t.scrollWidth - innerWidth), ease: 'none',
      scrollTrigger: { trigger: '.hscroll', pin: true, scrub: 1, end: () => '+=' + t.scrollWidth } });
  } });

  /* Image clip-path reveal + parallax */
  gsap.utils.toArray('.reveal-img').forEach(el => gsap.to(el, { clipPath: 'inset(0 0% 0 0)', duration: 1.2, ease: 'power3.inOut', scrollTrigger: { trigger: el, start: 'top 85%' } }));
  gsap.utils.toArray('[data-speed]').forEach(el => gsap.to(el, { yPercent: el.dataset.speed * 20, ease: 'none', scrollTrigger: { trigger: el, scrub: true } }));

  /* Counters */
  document.querySelectorAll('[data-count]').forEach(el => { const o = { v: 0 };
    gsap.to(o, { v: +el.dataset.count, duration: 2, scrollTrigger: { trigger: el, start: 'top 90%' }, onUpdate: () => el.textContent = Math.round(o.v) }); });

  /* Footer — staggered */
  gsap.from('.footer .cols > *', { y: 40, opacity: 0, stagger: .12, scrollTrigger: { trigger: '.footer', start: 'top 80%' } });
}
