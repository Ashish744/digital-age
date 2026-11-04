/* Hide broken remote images so the gradient fallback shows */
document.addEventListener('error', e => { if (e.target.tagName === 'IMG' && e.target.src.includes('unsplash')) e.target.style.visibility = 'hidden'; }, true);

/* Text effects: word-mask reveal for section headings, scramble-in for eyebrows */
addEventListener('DOMContentLoaded', () => {
  if (!window.gsap || !window.ScrollTrigger || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.querySelectorAll('.h-lg').forEach(h => {
    const txt = h.textContent.trim(); h.setAttribute('aria-label', txt);
    h.innerHTML = txt.split(/\s+/).map(w => `<span style="display:inline-block;overflow:hidden;vertical-align:top;padding-bottom:.08em"><span class="fxw" aria-hidden="true" style="display:inline-block">${w}</span></span>`).join(' ');
    gsap.from(h.querySelectorAll('.fxw'), { yPercent: 115, rotate: 6, duration: .9, stagger: .06, ease: 'power4.out', scrollTrigger: { trigger: h, start: 'top 88%', once: true } });
  });
  const L = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  document.querySelectorAll('.eyebrow').forEach(e => {
    const final = e.textContent;
    ScrollTrigger.create({ trigger: e, start: 'top 92%', once: true, onEnter() {
      const o = { p: 0 };
      gsap.to(o, { p: 1, duration: 1.1, ease: 'none',
        onUpdate() { const n = Math.floor(o.p * final.length); e.textContent = final.slice(0, n) + [...final.slice(n)].map(c => c === ' ' ? ' ' : L[Math.random() * 26 | 0]).join(''); },
        onComplete() { e.textContent = final; } });
    } });
  });
});
