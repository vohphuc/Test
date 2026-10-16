'use strict';
const $ = id => document.getElementById(id);

// Tài khoản
const DEMO = { user: 'abcxyz', pass: '123' };
const HOME = 'index.html';

function saveUser(user) {
  try { localStorage.setItem('user', JSON.stringify(user)); } catch {}
}
function goHome() { location.href = HOME; }

//Chuyển tab
const tabs = [
  { tab: $('tabUser'), panel: $('panelUser') },
  { tab: $('tabGuest'), panel: $('panelGuest') }
];
function showTab(i) {
  tabs.forEach((t, idx) => {
    const on = idx === i;
    t.tab.setAttribute('aria-selected', on);
    t.tab.tabIndex = on ? 0 : -1;
    t.panel.hidden = !on;
  });
  setMsg('');
}
tabs.forEach((t, i) => {
  t.tab.addEventListener('click', () => showTab(i));
  // Điều hướng bằng phím mũi tên giữa hai tab
  t.tab.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      const n = (i + 1) % tabs.length;
      showTab(n);
      tabs[n].tab.focus();
    }
  });
});

//Thông báo
const msg = $('msg');
function setMsg(text, ok) {
  msg.textContent = text;
  msg.classList.toggle('ok', !!ok);
}

//Hiện/ẩn mật khẩu
$('togglePass').addEventListener('click', e => {
  const show = $('pass').type === 'password';
  $('pass').type = show ? 'text' : 'password';
  e.target.textContent = show ? 'Ẩn' : 'Hiện';
  e.target.setAttribute('aria-label', show ? 'Ẩn mật khẩu' : 'Hiện mật khẩu');
});

//Chế độ 1: đăng nhập bằng tài khoản
$('panelUser').addEventListener('submit', e => {
  e.preventDefault();
  // Chấp nhận "abcxyz" hoặc "abcxyz@gmail.com", không phân biệt hoa thường
  const name = $('email').value.trim().toLowerCase().replace(/@gmail\.com$/, '');
  const pass = $('pass').value;

  if (!name || !pass) return setMsg('Vui lòng nhập đầy đủ tài khoản và mật khẩu.');
  if (name !== DEMO.user || pass !== DEMO.pass) return setMsg('Sai tài khoản hoặc mật khẩu.');

  saveUser({ mode: 'user', name: DEMO.user });
  setMsg('Đăng nhập thành công, đang chuyển trang...', true);
  setTimeout(goHome, 700);
});

//Chế độ 2: khách
$('guestBtn').addEventListener('click', () => {
  saveUser({ mode: 'guest', name: 'Khách' });
  goHome();
});
