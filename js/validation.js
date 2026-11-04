/* Shared validators — used by every form on the site */
const NAME_RE  = /^[A-Za-zÀ-ÖØ-öø-ÿ]+(?:[ '\-][A-Za-zÀ-ÖØ-öø-ÿ]+)*$/;
const EMAIL_RE = /^[A-Za-z0-9._%+\-]+@[A-Za-z0-9\-]+(?:\.[A-Za-z0-9\-]+)*\.[A-Za-z]{2,}$/;

const rules = {
  name:     v => NAME_RE.test(v.trim()) || 'Use letters only (spaces, hyphens, apostrophes allowed).',
  email:    v => EMAIL_RE.test(v.trim()) || 'Enter a valid email, e.g. name@gmail.com.',
  password: v => v.length >= 8 || 'Password must be at least 8 characters.',
  confirm:  (v, f) => v === f.querySelector('[data-rule=password]').value || 'Passwords do not match.',
  required: v => v.trim().length > 0 || 'This field is required.',
  checked:  (v, f, el) => el.checked || 'Please accept to continue.'
};

function setError(el, msg) {
  const out = document.getElementById(el.id + '-err');
  el.setAttribute('aria-invalid', !!msg);
  if (out) out.textContent = msg || '';
}
function check(el, form) {
  const r = rules[el.dataset.rule]; if (!r) return true;
  const res = r(el.value, form, el);
  setError(el, res === true ? '' : res);
  return res === true;
}
document.querySelectorAll('form[data-validate]').forEach(form => {
  const fields = [...form.querySelectorAll('[data-rule]')];
  fields.forEach(el => {
    el.addEventListener('blur', () => check(el, form));
    el.addEventListener('input', () => el.getAttribute('aria-invalid') === 'true' && check(el, form));
  });
  let statusTimer;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const ok = fields.map(el => check(el, form)).every(Boolean);
    if (ok) {
      const accountType = form.querySelector('#acct')?.value;
      if (accountType) {
        window.location.assign(accountType === 'admin' ? 'admin-dashboard.html' : 'public-dashboard.html');
        return;
      }
      if (document.body.dataset.page === 'contact') {
        window.location.assign('login.html');
        return;
      }
      const status = form.querySelector('.status');
      if (document.body.dataset.page === 'blog') {
        status.textContent = 'Submitted';
        clearTimeout(statusTimer);
        statusTimer = setTimeout(() => { status.textContent = ''; }, 2000);
        form.reset();
      } else {
        status.textContent = 'Demo only: form valid, no backend connected.';
      }
    }
    else fields.find(el => el.getAttribute('aria-invalid') === 'true')?.focus();
  });
});
/* Show/hide password */
document.querySelectorAll('[data-toggle]').forEach(b => b.addEventListener('click', () => {
  const i = document.getElementById(b.dataset.toggle);
  i.type = i.type === 'password' ? 'text' : 'password';
  b.textContent = i.type === 'password' ? 'Show' : 'Hide';
}));
