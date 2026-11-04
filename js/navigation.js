/* Navbar: scroll background, mobile menu (with scroll-lock) and current-page highlight */
(() => {
  const nav = document.querySelector('.nav');
  const burger = document.querySelector('.burger');
  const menu = document.querySelector('.menu');
  if (!nav) return;
  const onScroll = () => nav.classList.toggle('scrolled', scrollY > 30);
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  const setMenu = open => {
    if (!menu || !burger) return;
    menu.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open);
    document.body.classList.toggle('menu-open', open);
  };
  burger?.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
  menu?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  addEventListener('keydown', e => e.key === 'Escape' && setMenu(false));
  addEventListener('resize', () => innerWidth > 960 && setMenu(false));

  /* Highlight the page the visitor is on (works on every page, desktop + mobile) */
  const here = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  menu?.querySelectorAll('a').forEach(a => {
    const target = (a.getAttribute('href') || '').split('#')[0].toLowerCase();
    if (target && target === here) a.setAttribute('aria-current', 'page');
  });
})();
