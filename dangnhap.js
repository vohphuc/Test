'use strict';
const $ = id => document.getElementById(id);

// Tài khoản có sẵn (thử nghiệm). Tài khoản khách đăng ký được lưu ở khóa 'accounts'.
const DEMO  = { user: 'abcxyz', pass: '123' };
const ADMIN = { user: 'admin',  pass: 'admin123' };
const MAX_FAILS = 5, LOCK_MS = 30000;

const rd = (k, f) => { try { return JSON.parse(localStorage.getItem(k)) || f; } catch { return f; } };
const wr = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };
const saveUser = u => wr('user', u);
const setMsg = (el, text, ok) => { el.textContent = text; el.classList.toggle('ok', !!ok); };

// Mã hóa mật khẩu (SHA-256) trước khi lưu, không lưu mật khẩu gốc
async function hash(user, pass) {
  const text = 'pk:' + user + ':' + pass;
  if (window.crypto && crypto.subtle) {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
    return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
  }
  return 'b64:' + btoa(unescape(encodeURIComponent(text)));   // dự phòng khi trình duyệt không hỗ trợ
}

/* ---------- Chuyển tab ---------- */
const reg = $('panelRegister');
const tabs = [
  { tab: $('tabUser'),     panel: $('panelUser'),  msg: $('msg') },
  { tab: $('tabRegister'), panel: reg,              msg: $('rMsg') },
  { tab: $('tabAdmin'),    panel: $('panelAdmin'),  msg: $('adminMsg') }
];
function showTab(i) {
  tabs.forEach((t, idx) => {
    const on = idx === i;
    t.tab.setAttribute('aria-selected', on);
    t.tab.tabIndex = on ? 0 : -1;
    t.panel.hidden = !on;
    setMsg(t.msg, '');
  });
}
tabs.forEach((t, i) => {
  t.tab.addEventListener('click', () => showTab(i));
  t.tab.addEventListener('keydown', e => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    const n = (i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length;
    showTab(n); tabs[n].tab.focus();
  });
});

/* ---------- Hiện/ẩn mật khẩu ---------- */
document.querySelectorAll('.toggle-pass').forEach(btn => btn.addEventListener('click', () => {
  const input = $(btn.dataset.for), show = input.type === 'password';
  input.type = show ? 'text' : 'password';
  btn.textContent = show ? 'Ẩn' : 'Hiện';
  btn.setAttribute('aria-label', show ? 'Ẩn mật khẩu' : 'Hiện mật khẩu');
}));

/* ---------- Đăng nhập (dùng chung cho tài khoản thường và admin) ---------- */
// verify(id, pass) trả về thông tin phiên nếu đúng, ngược lại trả về null
function setupLogin({ form, userInput, passInput, msg, verify, redirect }) {
  let fails = 0, lockedUntil = 0;
  $(form).addEventListener('submit', async e => {
    e.preventDefault();
    const out = $(msg);
    const wait = Math.ceil((lockedUntil - Date.now()) / 1000);
    if (wait > 0) return setMsg(out, 'Vui lòng thử lại sau ' + wait + ' giây.');

    const id = $(userInput).value.trim().toLowerCase(), pass = $(passInput).value;
    if (!id || !pass) return setMsg(out, 'Vui lòng nhập đầy đủ tài khoản và mật khẩu.');

    const session = await verify(id, pass);
    if (!session) {
      if (++fails >= MAX_FAILS) {
        fails = 0; lockedUntil = Date.now() + LOCK_MS;
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
  form: 'panelUser', userInput: 'email', passInput: 'pass', msg: 'msg', redirect: 'index.html',
  async verify(id, pass) {
    if (id.replace(/@gmail\.com$/, '') === DEMO.user && pass === DEMO.pass) return { mode: 'user', name: DEMO.user };
    const acc = rd('accounts', []).find(a => a.username === id || a.email === id);
    if (acc && acc.pass && acc.pass === await hash(acc.username, pass)) return { mode: 'user', name: acc.username };
    return null;
  }
});
setupLogin({
  form: 'panelAdmin', userInput: 'adminUser', passInput: 'adminPass', msg: 'adminMsg', redirect: 'admin.html',
  verify: async (id, pass) => (id === ADMIN.user && pass === ADMIN.pass) ? { mode: 'admin', name: 'Admin' } : null
});

/* ---------- Đăng ký ---------- */
reg.addEventListener('submit', async e => {
  e.preventDefault();
  const out = $('rMsg');
  const user = $('rUser').value.trim().toLowerCase(), email = $('rEmail').value.trim().toLowerCase();
  const p1 = $('rPass').value, p2 = $('rPass2').value;

  if (!/^[a-z0-9_]{3,20}$/.test(user)) return setMsg(out, 'Tên đăng nhập gồm 3-20 ký tự: chữ thường, số hoặc dấu gạch dưới.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setMsg(out, 'Email không hợp lệ.');
  if (p1.length < 6) return setMsg(out, 'Mật khẩu cần ít nhất 6 ký tự.');
  if (p1 !== p2) return setMsg(out, 'Hai mật khẩu không khớp.');

  const list = rd('accounts', []);
  if (user === DEMO.user || user === ADMIN.user || list.some(a => a.username === user)) return setMsg(out, 'Tên đăng nhập đã tồn tại.');
  if (list.some(a => a.email === email)) return setMsg(out, 'Email này đã được đăng ký.');

  list.push({ username: user, email, pass: await hash(user, p1), date: new Date().toISOString() });
  wr('accounts', list);
  saveUser({ mode: 'user', name: user });                 // đăng ký xong tự đăng nhập
  setMsg(out, 'Đăng ký thành công, đang chuyển trang...', true);
  setTimeout(() => { location.href = 'index.html'; }, 800);
});

/* ---------- Chế độ khách (nút nằm dưới form đăng nhập) ---------- */
$('guestBtn').addEventListener('click', () => {
  saveUser({ mode: 'guest', name: 'Khách' });
  location.href = 'index.html';
});
