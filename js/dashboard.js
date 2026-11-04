/* Dashboard interactions — ALL DATA BELOW IS DEMO DATA until a backend is connected */
(() => {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const D = {
    projects: [['NovaPay App', 'NovaPay', '06 Nov 2026', 'Active', '72%'], ['GreenLeaf Store', 'GreenLeaf', '09 Nov 2026', 'Active', '45%'], ['CareWell Portal', 'CareWell', '12 Nov 2026', 'Pending', '10%'], ['Kinetic Brand', 'Kinetic', '28 Oct 2026', 'Done', '100%'], ['Atlas Learning Hub', 'Atlas Academy', '16 Nov 2026', 'Active', '58%'], ['Harbor Homes Identity', 'Harbor Homes', '20 Nov 2026', 'Pending', '0%'], ['Solace Health Portal', 'Solace Health', '25 Oct 2026', 'Done', '100%']],
    clients: [['NovaPay', 'Fintech', 'Ananya Rao', '2 projects', 'Active'], ['GreenLeaf', 'Retail', 'Lena Brooks', '1 project', 'Active'], ['CareWell', 'Healthcare', 'Dev Patel', '2 projects', 'Pending'], ['Kinetic', 'Apparel', 'Maya Chen', '1 project', 'Done'], ['Atlas Academy', 'Education', 'Sara Khan', '1 project', 'Active'], ['Harbor Homes', 'Real Estate', 'Ananya Rao', '1 project', 'Pending'], ['Solace Health', 'Healthcare', 'Omar Ali', '1 project', 'Active'], ['Pioneer Mobility', 'Automotive', 'Dev Patel', '2 projects', 'Active']],
    team: [['Ananya Rao', 'Creative Director', 'NovaPay, Harbor Homes', 'Brand review', 'Active'], ['Rohan Mehta', 'Developer', 'GreenLeaf, Atlas Academy', 'Store build', 'Active'], ['Sara Khan', 'Designer', 'Atlas Academy', 'Course catalog', 'Active'], ['Maya Chen', 'Brand Strategist', 'Kinetic', 'Identity handoff', 'Active'], ['Dev Patel', 'Project Manager', 'CareWell, Pioneer', 'Launch planning', 'Active'], ['Lena Brooks', 'Account Lead', 'GreenLeaf', 'Client check-in', 'Pending'], ['Omar Ali', 'UX Researcher', 'Solace Health', 'Usability study', 'Active']],
    services: [['Website Design', 'Digital', '12 projects', 'High', 'Active'], ['Branding', 'Identity', '8 projects', 'High', 'Active'], ['SEO', 'Growth', '5 projects', 'Medium', 'Pending'], ['UX Research', 'Product', '6 projects', 'Medium', 'Active'], ['Content Strategy', 'Content', '9 projects', 'High', 'Active'], ['Social Campaigns', 'Marketing', '7 projects', 'Medium', 'Active'], ['Product Prototyping', 'Product', '4 projects', 'Low', 'Pending']],
    messages: [['NovaPay', 'Can we review the homepage?', '04 Nov · 10:42', 'Pending'], ['GreenLeaf', 'Invoice question', '04 Nov · 09:18', 'Done'], ['Atlas Academy', 'Can we add a course catalog?', '03 Nov · 16:05', 'Pending'], ['Solace Health', 'Patient portal approved.', '03 Nov · 14:32', 'Done'], ['Harbor Homes', 'Need new brand photos.', '02 Nov · 11:47', 'Pending'], ['Pioneer Mobility', 'EV launch timeline attached.', '01 Nov · 17:20', 'Pending']],
    invoices: [['INV-001', 'NovaPay', '31 Oct 2026', '₹80,000', 'Paid'], ['INV-002', 'GreenLeaf', '08 Nov 2026', '₹45,000', 'Pending'], ['INV-003', 'CareWell', '28 Oct 2026', '₹30,000', 'Overdue'], ['INV-004', 'Atlas Academy', '30 Oct 2026', '₹62,000', 'Paid'], ['INV-005', 'Harbor Homes', '12 Nov 2026', '₹95,000', 'Pending'], ['INV-006', 'Solace Health', '25 Oct 2026', '₹1,10,000', 'Overdue'], ['INV-007', 'Pioneer Mobility', '05 Nov 2026', '₹54,000', 'Paid']]
  };
  const INTRO = {
    projects: 'Delivery dates and progress across active client work.',
    clients: 'Account ownership and current engagement across the studio.',
    team: 'Current assignments and each teammate’s next focus.',
    services: 'Service demand and project volume by discipline.',
    messages: 'Client conversations with their latest received time.',
    invoices: 'Payment schedule, outstanding balances, and overdue items.'
  };
  const SEARCH_HINT = {
    projects: 'Find a project or client',
    clients: 'Find a client or industry',
    team: 'Find a teammate or assignment',
    services: 'Find a service or discipline',
    messages: 'Find a sender or message',
    invoices: 'Find an invoice or client'
  };
  const STATUS_INDEX = { projects: 3, clients: 4, team: 4, services: 4, messages: 3, invoices: 4 };
  const badge = status => `<span class="record-status status-${status.toLowerCase()}"><i></i>${status}</span>`;
  const initials = name => name.split(/\s+/).map(part => part[0]).join('').slice(0, 2);
  const renderRecord = (key, row) => {
    if (key === 'projects') {
      const [name, client, launch, status, progress] = row;
      return `<article class="record-card project-record"><div class="record-top"><div><span class="record-kicker">Project</span><h3>${name}</h3><p>${client}</p></div>${badge(status)}</div><div class="record-line"><span>Target launch</span><strong>${launch}</strong></div><div class="record-progress"><i style="width:${progress}"></i></div><div class="record-line"><span>Delivery progress</span><strong>${progress}</strong></div></article>`;
    }
    if (key === 'clients') {
      const [name, industry, lead, projects, status] = row;
      return `<article class="record-card client-record"><div class="record-top"><span class="client-mark">${initials(name)}</span>${badge(status)}</div><h3>${name}</h3><p class="record-kicker">${industry}</p><div class="client-details"><div><span>Account lead</span><strong>${lead}</strong></div><div><span>Engagement</span><strong>${projects}</strong></div></div></article>`;
    }
    if (key === 'team') {
      const [name, role, assignments, focus, status] = row;
      return `<article class="record-card team-record"><div class="team-heading"><span class="team-mark">${initials(name)}</span><div><h3>${name}</h3><p>${role}</p></div>${badge(status)}</div><div class="team-detail"><span>Working on</span><strong>${assignments}</strong></div><div class="team-detail"><span>Next focus</span><strong>${focus}</strong></div></article>`;
    }
    if (key === 'services') {
      const [name, discipline, volume, demand, status] = row;
      const demandWidth = { High: '85%', Medium: '55%', Low: '25%' }[demand];
      return `<article class="record-card service-record"><div class="service-heading"><span class="service-mark">${discipline[0]}</span><div><h3>${name}</h3><p>${discipline}</p></div></div><div class="service-demand"><div class="record-line"><span>Demand</span><strong>${demand}</strong></div><div class="record-progress"><i style="width:${demandWidth}"></i></div></div><div class="record-line"><span>Current workload</span><strong>${volume}</strong>${badge(status)}</div></article>`;
    }
    if (key === 'messages') {
      const [sender, subject, received, status] = row;
      return `<article class="record-card message-record"><span class="client-mark">${initials(sender)}</span><div class="message-copy"><div class="record-top"><h3>${sender}</h3><span>${received}</span></div><p>${subject}</p></div>${badge(status)}</article>`;
    }
    const [number, client, due, amount, status] = row;
    return `<article class="record-card invoice-record"><div class="record-top"><div><span class="record-kicker">${number}</span><h3>${client}</h3></div>${badge(status)}</div><div class="invoice-total">${amount}</div><div class="record-line"><span>Due date</span><strong>${due}</strong></div></article>`;
  };

  /* Section-specific content with shared search and status filtering. */
  $$('.view[data-src]').forEach(v => {
    const key = v.dataset.src, box = $('.tbl', v), q = $('input', v), f = $('select', v);
    box.classList.add('records', `${key}-records`);
    q.placeholder = SEARCH_HINT[key];
    const statuses = [...new Set(D[key].map(row => row[STATUS_INDEX[key]]))];
    f.innerHTML = '<option value="All">All statuses</option>' + statuses.map(status => `<option value="${status}">${status}</option>`).join('');
    const intro = document.createElement('p');
    intro.className = 'view-intro';
    intro.textContent = INTRO[key];
    v.querySelector('h2')?.after(intro);
    const draw = () => {
      const t = q.value.toLowerCase(), s = f.value;
      const rows = D[key].filter(r => r.join(' ').toLowerCase().includes(t) && (s === 'All' || r[STATUS_INDEX[key]] === s));
      box.innerHTML = rows.map(row => renderRecord(key, row)).join('') || '<p class="record-empty">No matching records.</p>';
    };
    q.addEventListener('input', draw); f.addEventListener('change', draw); draw();
  });

  /* Sidebar view switching */
  const side = $('.side');
  $$('.side button').forEach(b => b.addEventListener('click', () => {
    $$('.side button').forEach(x => { x.classList.remove('on'); x.removeAttribute('aria-current'); });
    b.classList.add('on'); b.setAttribute('aria-current', 'page');
    $$('.view').forEach(v => v.classList.toggle('on', v.id === 'v-' + b.dataset.view));
    side.classList.remove('open'); $('.menu-btn')?.setAttribute('aria-expanded', 'false'); scrollTo(0, 0); animate();
  }));
  $('.menu-btn')?.addEventListener('click', e => {
    const open = side.classList.toggle('open');
    e.currentTarget.setAttribute('aria-expanded', open);
  });

  /* Profile dropdown */
  const pb = $('.prof > button'), dd = $('.drop');
  pb?.addEventListener('click', e => { e.stopPropagation(); const o = dd.classList.toggle('open'); pb.setAttribute('aria-expanded', o); });
  document.addEventListener('click', () => dd?.classList.remove('open'));

  /* Interactive bar chart (demo revenue) */
  const chart = $('#chart');
  if (chart) { const m = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug']; const val = [40, 55, 48, 70, 65, 85, 78, 95];
    chart.innerHTML = val.map((v, i) => `<i style="height:${v}%" data-t="${m[i]}: ₹${v}k" tabindex="0" aria-label="${m[i]} ₹${v}k"></i>`).join('');
    chart.addEventListener('click', e => { if (e.target.tagName === 'I') { $$('#chart i').forEach(x => x.classList.remove('hot')); e.target.classList.add('hot'); } }); }

  /* Message read/unread demo control */
  $$('.msg').forEach(m => m.addEventListener('click', () => m.classList.remove('unread')));
  /* Demo toggles */
  $$('[data-demo-toggle]').forEach(c => c.addEventListener('change', () => { $('#toast').textContent = 'Demo setting saved locally (not persisted).'; }));

  /* Animated progress bars + counters */
  function animate() {
    $$('.view.on .prog b, b.client-prog').forEach(b => gsap.fromTo(b, { width: 0 }, { width: b.dataset.p + '%', duration: reduce ? 0 : 1.2, ease: 'power3.out' }));
    $$('.view.on [data-count], .stat [data-count]').forEach(el => { const o = { v: 0 }; gsap.to(o, { v: +el.dataset.count, duration: reduce ? 0 : 1.2, onUpdate: () => el.textContent = Math.round(o.v) }); });
    if (!reduce) gsap.from('.view.on .box, .dash.client .box', { y: 24, opacity: 0, stagger: .06, duration: .5 });
  }
  animate();
})();
