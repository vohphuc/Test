'use strict';
const $ = id => document.getElementById(id);
const fmt = n => Number(n).toLocaleString('vi-VN') + '₫';
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const norm = s => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').trim();
const rd = (k, f) => { try { return JSON.parse(localStorage.getItem(k)) || f; } catch { return f; } };
const wr = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };
const day = iso => new Date(iso).toLocaleDateString('vi-VN');

/* ---------- Quyền truy cập + đăng xuất ---------- */
const user = rd('user', null);
if (!user || user.mode !== 'admin') location.replace('dangnhap.html');
$('who').textContent = user ? user.name : '';
$('logout').addEventListener('click', () => { try { localStorage.removeItem('user'); } catch {} location.href = 'dangnhap.html'; });

/* ---------- Chuyển tab ---------- */
const tabs = [...document.querySelectorAll('.tab')], panels = [...document.querySelectorAll('.pnl')];
tabs.forEach(t => t.addEventListener('click', () => {
  tabs.forEach(x => { x.classList.toggle('on', x === t); x.setAttribute('aria-selected', x === t); });
  panels.forEach(p => { p.hidden = p.id !== t.dataset.p; });
}));

const GROUP = {
  sale: 'Ưu đãi (trang chủ)', laptop: 'Laptop (trang chủ)', phone: 'Điện thoại (trang chủ)', accessory: 'Phụ kiện (trang chủ)', device: 'Thiết bị (trang chủ)',
  laptopGaming: 'Laptop gaming', laptopOffice: 'Laptop văn phòng', laptopWorkstation: 'Máy trạm', laptopThin: 'Laptop mỏng nhẹ', laptopStudent: 'Laptop sinh viên',
  saleFlash: 'Ưu đãi: giá sốc', saleLaptop: 'Ưu đãi: laptop', salePhone: 'Ưu đãi: điện thoại', saleAccessory: 'Ưu đãi: phụ kiện',
  phoneApple: 'iPhone', phoneSamsung: 'Samsung', phoneAndroid: 'Android khác', phoneBudget: 'Điện thoại giá rẻ',
  accInput: 'Chuột & bàn phím', accBag: 'Balo & túi', accCharge: 'Sạc & cáp', accStorage: 'Lưu trữ',
  deviceHeadphone: 'Tai nghe', deviceSpeaker: 'Loa', deviceMonitor: 'Màn hình', deviceStream: 'Webcam & mạng'
};
const allProducts = () => Object.entries(products).flatMap(([cat, l]) => l.map(p => ({ ...p, cat })));

/* ================= DOANH SỐ ================= */
function renderSales() {
  const since = Date.now() - $('period').value * 864e5;
  const orders = rd('orders', []).filter(o => new Date(o.date).getTime() >= since);
  const agg = {};
  orders.forEach(o => o.items.forEach(i => {
    const a = agg[i.id] || (agg[i.id] = { name: i.name, qty: 0, sum: 0 });
    a.qty += i.qty; a.sum += i.price * i.qty;
  }));
  const rows = Object.values(agg).sort((a, b) => b.sum - a.sum);
  $('rev').textContent = fmt(orders.reduce((s, o) => s + o.total, 0));
  $('ordN').textContent = orders.length;
  $('itemN').textContent = rows.reduce((s, r) => s + r.qty, 0);
  $('sRows').innerHTML = rows.map(r => `<tr><td>${esc(r.name)}</td><td class="r">${r.qty}</td><td class="r">${fmt(r.sum)}</td></tr>`).join('');
  $('sEmpty').hidden = rows.length > 0;
}
$('period').addEventListener('change', renderSales);
$('seedOrders').addEventListener('click', () => {
  const ps = allProducts(), orders = rd('orders', []);
  for (let n = 0; n < 15; n++) {
    const items = Array.from({ length: 1 + Math.floor(Math.random() * 3) }, () => {
      const p = ps[Math.floor(Math.random() * ps.length)];
      return { id: p.id, name: p.name, price: p.price, qty: 1 + Math.floor(Math.random() * 2) };
    });
    orders.push({ id: 'DH' + Date.now() + n, date: new Date(Date.now() - Math.random() * 7 * 864e5).toISOString(),
      items, total: items.reduce((s, i) => s + i.price * i.qty, 0) });
  }
  wr('orders', orders); renderSales();
});

/* ================= SẢN PHẨM ================= */
$('pCat').innerHTML = Object.keys(products).map(k => `<option value="${esc(k)}">${esc(GROUP[k] || k)}</option>`).join('');
function renderProducts() {
  const ws = norm($('pq').value).split(/\s+/).filter(Boolean);
  const list = allProducts().filter(p => { const t = norm(p.name + ' ' + p.id); return ws.every(w => t.includes(w)); });
  $('pCount').textContent = allProducts().length;
  $('pRows').innerHTML = list.map(p => `<tr><td>${esc(p.id)}</td><td>${esc(p.name)}</td><td><span class="tag">${esc(GROUP[p.cat] || p.cat)}</span></td>
    <td class="r">${fmt(p.price)}</td><td class="r"><button class="del" data-act="dp" data-id="${esc(p.id)}">Xóa</button></td></tr>`).join('');
}
$('pq').addEventListener('input', renderProducts);
$('pForm').addEventListener('submit', e => {
  e.preventDefault();
  const p = { id: 'ad' + Date.now(), cat: $('pCat').value, name: $('pName').value.trim(), price: +$('pPrice').value,
    img: $('pImg').value.trim(), desc: $('pDesc').value.trim() };
  const old = +$('pOld').value;
  if (old) { if (old <= p.price) { $('pMsg').className = 'msg err'; $('pMsg').textContent = 'Giá cũ phải lớn hơn giá bán.'; return; } p.oldPrice = old; }
  wr('adminAdded', [...rd('adminAdded', []), p]);
  products[p.cat].push(p);
  $('pForm').reset(); renderProducts();
  $('pMsg').className = 'msg'; $('pMsg').textContent = 'Đã thêm "' + p.name + '". Tải lại trang cửa hàng để thấy sản phẩm.';
});
function deleteProduct(id) {
  if (!confirm('Xóa sản phẩm này khỏi cửa hàng?')) return;
  wr('adminDeleted', [...new Set([...rd('adminDeleted', []), id])]);
  wr('adminAdded', rd('adminAdded', []).filter(p => p.id !== id));
  Object.keys(products).forEach(k => { products[k] = products[k].filter(p => p.id !== id); });
  renderProducts();
}

/* ================= NHÂN VIÊN ================= */
function renderStaff() {
  const l = rd('staff', []);
  $('stRows').innerHTML = l.map(s => `<tr><td>${esc(s.name)}</td><td>${esc(s.role)}</td><td>${esc(s.phone)}</td>
    <td class="r"><button class="del" data-act="ds" data-id="${esc(s.id)}">Xóa</button></td></tr>`).join('');
  $('stEmpty').hidden = l.length > 0;
}
$('stForm').addEventListener('submit', e => {
  e.preventDefault();
  wr('staff', [...rd('staff', []), { id: 'nv' + Date.now(), name: $('stName').value.trim(), role: $('stRole').value, phone: $('stPhone').value.trim() }]);
  $('stForm').reset(); renderStaff();
});

/* ================= ĐÁNH GIÁ (đọc từ bình luận của khách) ================= */
function reviews() {
  const out = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k.startsWith('cm_')) rd(k, []).forEach((c, idx) => out.push({ key: k, idx, pid: k.slice(3), ...c }));
  }
  return out;
}
function renderReviews() {
  const names = Object.fromEntries(allProducts().map(p => [p.id, p.name])), l = reviews();
  $('rvCount').textContent = l.length;
  $('rvRows').innerHTML = l.map(r => `<tr><td>${esc(names[r.pid] || r.pid)}</td><td>${esc(r.name)}</td>
    <td class="star">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</td><td>${esc(r.text)}</td><td>${esc(r.date)}</td>
    <td class="r"><button class="del" data-act="dr" data-key="${esc(r.key)}" data-idx="${r.idx}">Xóa</button></td></tr>`).join('');
  $('rvEmpty').hidden = l.length > 0;
}

/* ================= TÀI KHOẢN ĐÃ ĐĂNG KÝ ================= */
function renderAccounts() {
  const l = rd('accounts', []);
  $('acRows').innerHTML = l.map(a => `<tr><td>${esc(a.username)}</td><td>${esc(a.email)}</td><td>${esc(day(a.date))}</td>
    <td class="r"><button class="del" data-act="da" data-id="${esc(a.username)}">Xóa</button></td></tr>`).join('');
  $('acEmpty').hidden = l.length > 0;
}
$('seedAcc').addEventListener('click', () => {
  const have = rd('accounts', []), names = ['minhanh', 'quocbao', 'thuha', 'hoangnam', 'ngocmai'];
  names.filter(n => !have.some(a => a.username === n)).forEach((n, i) =>
    have.push({ username: n, email: n + '@gmail.com', date: new Date(Date.now() - i * 864e5 * 3).toISOString() }));
  wr('accounts', have); renderAccounts();
});

/* ================= Xóa (một chỗ xử lý chung) ================= */
document.addEventListener('click', e => {
  const b = e.target.closest('button[data-act]');
  if (!b) return;
  const { act, id, key, idx } = b.dataset;
  if (act === 'dp') return deleteProduct(id);
  if (!confirm('Bạn chắc chắn muốn xóa?')) return;
  if (act === 'ds') { wr('staff', rd('staff', []).filter(s => s.id !== id)); renderStaff(); }
  if (act === 'da') { wr('accounts', rd('accounts', []).filter(a => a.username !== id)); renderAccounts(); }
  if (act === 'dr') { const l = rd(key, []); l.splice(+idx, 1); wr(key, l); renderReviews(); }
});

renderSales(); renderProducts(); renderStaff(); renderReviews(); renderAccounts();
