'use strict';
const $ = id => document.getElementById(id);

// Tài khoản thử nghiệm (chỉ để minh họa, xem lưu ý bảo mật trong hướng dẫn)
const ACCOUNTS = {
  user:  { user: 'abcxyz', pass: '123' },
  admin: { user: 'admin',  pass: 'admin123' }
};
const MAX_FAILS = 5, LOCK_MS = 30000;

const saveUser = u => { try { localStorage.setItem('user', JSON.stringify(u)); } catch {} };
const setMsg = (el, text, ok) => { el.textContent = text; el.classList.toggle('ok', !!ok); };
// Chấp nhận "abcxyz" hoặc "abcxyz@gmail.com", không phân biệt hoa thường
const norm = s => s.trim().toLowerCase().replace(/@gmail\.com$/, '');

/* ---------- Chuyển tab ---------- */
const tabs = [
  { tab: $('tabUser'),  panel: $('panelUser'),  msg: $('msg') },
  { tab: $('tabGuest'), panel: $('panelGuest') },
  { tab: $('tabAdmin'), panel: $('panelAdmin'), msg: $('adminMsg') }
];
function showTab(i) {
  tabs.forEach((t, idx) => {
    const on = idx === i;
    t.tab.setAttribute('aria-selected', on);
    t.tab.tabIndex = on ? 0 : -1;
    t.panel.hidden = !on;
    if (t.msg) setMsg(t.msg, '');
  });
}
tabs.forEach((t, i) => {
  t.tab.addEventListener('click', () => showTab(i));
  t.tab.addEventListener('keydown', e => {               // phím mũi tên chuyển tab
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    const n = (i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length;
    showTab(n);
    tabs[n].tab.focus();
  });
});

/* ---------- Hiện/ẩn mật khẩu (dùng chung cho các form) ---------- */
document.querySelectorAll('.toggle-pass').forEach(btn => btn.addEventListener('click', () => {
  const input = $(btn.dataset.for), show = input.type === 'password';
  input.type = show ? 'text' : 'password';
  btn.textContent = show ? 'Ẩn' : 'Hiện';
  btn.setAttribute('aria-label', show ? 'Ẩn mật khẩu' : 'Hiện mật khẩu');
}));

/* ---------- Form đăng nhập dùng chung cho tài khoản thường và admin ---------- */
function setupLogin({ form, userInput, passInput, msg, account, session, redirect }) {
  let fails = 0, lockedUntil = 0;
  $(form).addEventListener('submit', e => {
    e.preventDefault();
    const out = $(msg);

    const wait = Math.ceil((lockedUntil - Date.now()) / 1000);
    if (wait > 0) return setMsg(out, 'Vui lòng thử lại sau ' + wait + ' giây.');

    const name = norm($(userInput).value), pass = $(passInput).value;
    if (!name || !pass) return setMsg(out, 'Vui lòng nhập đầy đủ tài khoản và mật khẩu.');

    if (name !== account.user || pass !== account.pass) {
      if (++fails >= MAX_FAILS) {
        fails = 0;
        lockedUntil = Date.now() + LOCK_MS;
        return setMsg(out, 'Sai quá nhiều lần. Vui lòng thử lại sau ' + LOCK_MS / 1000 + ' giây.');
      }
      return setMsg(out, 'Sai tài khoản hoặc mật khẩu.');
    }

    fails = 0;
    saveUser(session);
    setMsg(out, 'Đăng nhập thành công, đang chuyển trang...', true);
    setTimeout(() => { location.href = redirect; }, 700);
  });
}

setupLogin({
  form: 'panelUser', userInput: 'email', passInput: 'pass', msg: 'msg',
  account: ACCOUNTS.user, session: { mode: 'user', name: ACCOUNTS.user.user }, redirect: 'index.html'
});
setupLogin({
  form: 'panelAdmin', userInput: 'adminUser', passInput: 'adminPass', msg: 'adminMsg',
  account: ACCOUNTS.admin, session: { mode: 'admin', name: 'Admin' }, redirect: 'admin.html'
});

/* ---------- Chế độ khách ---------- */
$('guestBtn').addEventListener('click', () => {
  saveUser({ mode: 'guest', name: 'Khách' });
  location.href = 'index.html';
});
