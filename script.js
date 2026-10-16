'use strict';

/*Tiện ích dùng chung*/
const $ = id => document.getElementById(id);
const fmt = n => n.toLocaleString('vi-VN') + '₫';
const esc = s => String(s).replace(/[&<>"']/g, c =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const discount = p => p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;
const norm = s => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').trim();
const readJSON = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) || fallback; } catch { return fallback; } };
const writeJSON = (key, val) => { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} };

// Tra cứu nhanh theo id
const productById = {};
Object.values(products).flat().forEach(p => { productById[p.id] = p; });

/*Hiển thị thẻ sản phẩm*/
const addBtn = p => '<button class="add" data-id="' + esc(p.id) + '">Thêm vào giỏ</button>';
const priceHTML = p =>
  (p.oldPrice ? '<s>' + fmt(p.oldPrice) + '</s>' : '') + '<em>' + fmt(p.price) + '</em>';

function cardHTML(p) {
  return '<div class="img"><img src="' + esc(p.img) + '" alt="' + esc(p.name) + '" loading="lazy"></div>' +
    (p.oldPrice ? '<span class="off">-' + discount(p) + '%</span>' : '') +
    '<b>' + esc(p.name) + '</b>' +
    '<div class="price">' + priceHTML(p) + '</div>' +
    addBtn(p);
}

document.querySelectorAll('.row').forEach(row => {
  const frag = document.createDocumentFragment();
  (products[row.dataset.cat] || []).forEach(p => {
    const d = document.createElement('div');
    d.className = 'card';
    d.dataset.id = p.id;
    d.tabIndex = 0;
    d.setAttribute('role', 'button');
    d.setAttribute('aria-label', 'Xem chi tiết ' + p.name);
    d.innerHTML = cardHTML(p);
    frag.appendChild(d);
  });
  row.appendChild(frag);
});

/*Giỏ hàng*/
// Giỏ chỉ lưu id, qty, tên và giá luôn lấy từ dữ liệu sản phẩm
const saved = readJSON('cart', []);
let cart = (Array.isArray(saved) ? saved : []).filter(x => productById[x.id] && x.qty > 0);

function addToCart(id) {
  const it = cart.find(x => x.id === id);
  if (it) it.qty++; else cart.push({ id, qty: 1 });
  renderCart();
}
function changeQty(id, d) {
  const it = cart.find(x => x.id === id);
  if (!it) return;
  it.qty += d;
  if (it.qty <= 0) cart = cart.filter(x => x.id !== id);
  renderCart();
}
function removeItem(id) { cart = cart.filter(x => x.id !== id); renderCart(); }

function renderCart() {
  writeJSON('cart', cart);
  $('cartList').innerHTML = cart.length ? cart.map(x => {
    const p = productById[x.id], id = esc(x.id);
    return '<li><div class="info"><b>' + esc(p.name) + '</b><span>' + fmt(p.price) + '</span></div>' +
      '<div class="qty"><button data-act="dec" data-id="' + id + '" aria-label="Giảm">−</button>' +
      '<span>' + x.qty + '</span>' +
      '<button data-act="inc" data-id="' + id + '" aria-label="Tăng">+</button></div>' +
      '<button class="rm" data-act="rm" data-id="' + id + '" aria-label="Xóa">Xóa</button></li>';
  }).join('') : '<li class="empty">Giỏ hàng đang trống. Chọn sản phẩm để thêm vào giỏ.</li>';

  $('cartTotal').textContent = fmt(cart.reduce((s, x) => s + productById[x.id].price * x.qty, 0));
  const count = cart.reduce((s, x) => s + x.qty, 0), badge = $('cartCount');
  badge.textContent = count;
  badge.style.display = count ? 'grid' : 'none';
}

const drawer = $('drawer'), overlay = $('overlay');
function toggleCart(open) {
  drawer.classList.toggle('open', open);
  drawer.setAttribute('aria-hidden', !open);
  overlay.hidden = !open;
}
$('cartBtn').addEventListener('click', e => { e.preventDefault(); toggleCart(true); });
$('closeCart').addEventListener('click', () => toggleCart(false));
overlay.addEventListener('click', () => toggleCart(false));
$('checkout').addEventListener('click', () => {
  if (!cart.length) return alert('Giỏ hàng đang trống.');
  alert('Chức năng thanh toán sẽ được thêm sau.');
});

/*Banner băng chuyền*/
(function () {
  if (!document.getElementById('banner')) return;
  const box = $('banner'), slides = $('slides'), dotsBox = $('dots');
  const count = slides.children.length;
  const reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;
  let index = 0, timer;

  for (let i = 0; i < count; i++) {
    const b = document.createElement('button');
    b.setAttribute('aria-label', 'Banner ' + (i + 1));
    b.addEventListener('click', () => go(i));
    dotsBox.appendChild(b);
  }

  const mark = () => [...dotsBox.children].forEach((d, i) => d.classList.toggle('on', i === index));
  function go(i) {
    index = (i + count) % count;
    slides.scrollTo({ left: index * slides.clientWidth });
    mark();
  }
  // Cập nhật chấm khi người dùng tự vuốt/kéo
  slides.addEventListener('scroll', () => {
    const i = Math.round(slides.scrollLeft / slides.clientWidth);
    if (i !== index) { index = i; mark(); }
  });
  $('prevBanner').addEventListener('click', () => go(index - 1));
  $('nextBanner').addEventListener('click', () => go(index + 1));

  const stop = () => clearInterval(timer);
  function start() { stop(); if (!reduce) timer = setInterval(() => go(index + 1), 5000); }
  ['mouseenter', 'focusin'].forEach(ev => box.addEventListener(ev, stop));
  ['mouseleave', 'focusout'].forEach(ev => box.addEventListener(ev, start));
  mark(); start();
})();

/*Tìm kiếm*/
const searchInput = $('searchInput'), searchBox = $('searchResults');
// Chuẩn hóa tên một lần duy nhất thay vì mỗi lần gõ
const searchIndex = Object.values(productById).map(p => ({ p, n: norm(p.name) }));

function renderSearch() {
  const words = norm(searchInput.value).split(/\s+/).filter(Boolean);
  if (!words.length) { searchBox.hidden = true; searchBox.innerHTML = ''; return; }
  const res = searchIndex.filter(x => words.every(w => x.n.includes(w))).map(x => x.p);
  searchBox.innerHTML = res.length
    ? res.map(p =>
        '<li data-id="' + esc(p.id) + '"><img src="' + esc(p.img) + '" alt="">' +
        '<div class="rinfo"><b>' + esc(p.name) + '</b><span>' + priceHTML(p) + '</span></div>' +
        addBtn(p) + '</li>').join('')
    : '<li class="none">Không tìm thấy sản phẩm phù hợp.</li>';
  searchBox.hidden = false;
}
searchInput.addEventListener('input', renderSearch);
searchInput.addEventListener('focus', renderSearch);
$('searchForm').addEventListener('submit', e => { e.preventDefault(); renderSearch(); });
searchInput.addEventListener('keydown', e => {
  if (e.key === 'Escape') { searchBox.hidden = true; searchInput.blur(); }
});

/*Chi tiết sản phẩm + bình luận*/
const modal = $('pmodal');
let currentProduct = null, lastFocus = null;
const stars = n => '★'.repeat(n) + '☆'.repeat(5 - n);

function renderComments() {
  const list = readJSON('cm_' + currentProduct.id, []);
  $('cmCount').textContent = list.length;
  $('cmList').innerHTML = list.length
    ? list.map(c =>
        '<li><div class="cm-head"><b>' + esc(c.name) + '</b>' +
        '<span class="stars">' + stars(c.rating) + '</span>' +
        '<time>' + esc(c.date) + '</time></div><p>' + esc(c.text) + '</p></li>').join('')
    : '<li class="cm-empty">Chưa có bình luận. Hãy là người đầu tiên!</li>';
  $('pmRating').textContent = list.length
    ? '★ ' + (list.reduce((s, c) => s + c.rating, 0) / list.length).toFixed(1) + ' (' + list.length + ' đánh giá)'
    : 'Chưa có đánh giá';
}
//Check info sản phẩm.
function openProduct(id) {
  const p = productById[id];
  if (!p) return;
  currentProduct = p;
  lastFocus = document.activeElement;
  $('pmImg').src = p.img;
  $('pmImg').alt = p.name;
  $('pmTitle').textContent = p.name;
  $('pmPrice').textContent = fmt(p.price);
  $('pmOld').textContent = p.oldPrice ? fmt(p.oldPrice) : '';
  $('pmOff').textContent = p.oldPrice ? '-' + discount(p) + '%' : '';
  $('pmDesc').textContent = p.desc || 'Sản phẩm chính hãng, bảo hành đầy đủ. Liên hệ cửa hàng để biết thêm chi tiết.';
  $('pmAdd').textContent = 'Thêm vào giỏ';
  renderComments();
  searchBox.hidden = true;
  modal.hidden = false;
  document.body.style.overflow = 'hidden';
  $('pmClose').focus();
}
function closeProduct() {
  modal.hidden = true;
  document.body.style.overflow = '';
  if (lastFocus) lastFocus.focus();
}
//đóng info sản phẩm
modal.addEventListener('click', e => { if (e.target === modal) closeProduct(); });
$('pmClose').addEventListener('click', closeProduct);
$('pmAdd').addEventListener('click', () => {
  addToCart(currentProduct.id);
  $('pmAdd').textContent = 'Đã thêm ✓';
});
$('pmBuy').addEventListener('click', () => {
  addToCart(currentProduct.id);
  closeProduct();
  toggleCart(true);
});
$('cmForm').addEventListener('submit', e => {
  e.preventDefault();
  const name = $('cmName').value.trim(), text = $('cmText').value.trim();
  if (!name || !text) return;
  const key = 'cm_' + currentProduct.id, list = readJSON(key, []);
  list.unshift({ name, text, rating: +$('cmRating').value, date: new Date().toLocaleDateString('vi-VN') });
  writeJSON(key, list);
  $('cmText').value = '';
  renderComments();
});

/*Xử lý click, phím chung*/
document.addEventListener('click', e => {
  const t = e.target;
  if (!t.closest('.sbox')) searchBox.hidden = true;     // bấm ra ngoài thì đóng gợi ý

  const btn = t.closest('button');
  if (btn) {
    if (btn.classList.contains('add')) { addToCart(btn.dataset.id); toggleCart(true); }
    else if (btn.dataset.act === 'inc') changeQty(btn.dataset.id, 1);
    else if (btn.dataset.act === 'dec') changeQty(btn.dataset.id, -1);
    else if (btn.dataset.act === 'rm') removeItem(btn.dataset.id);
    return;
  }
  if (t.closest('a')) return;
  const el = t.closest('.card, .results li[data-id]');
  if (el) openProduct(el.dataset.id);
});

document.addEventListener('keydown', e => {
  if (e.key === 'Enter' && e.target.classList.contains('card')) openProduct(e.target.dataset.id);
  if (e.key === 'Escape') {
    if (!modal.hidden) closeProduct();          // Esc đóng lớp trên cùng trước
    else toggleCart(false);
  }
});

renderCart();

/*Trạng thái đăng nhập*/
const user = readJSON('user', null);
const loginLink = document.querySelector('a.act[href="dangnhap.html"]');
if (user && loginLink) {
  loginLink.lastChild.textContent = user.name;
  loginLink.addEventListener('click', e => {
    e.preventDefault();
    if (confirm('Đăng xuất khỏi tài khoản "' + user.name + '"?')) {
      try { localStorage.removeItem('user'); } catch {}
      location.reload();
    }
  });
}

//Trạng thái đăng nhập
if (user && loginLink) {
  loginLink.lastChild.textContent = user.name;
  if (user.mode === 'admin') {
    loginLink.href = 'admin.html';
  } else {
    loginLink.addEventListener('click', e => {
      e.preventDefault();
      if (confirm('Đăng xuất khỏi tài khoản "' + user.name + '"?')) {
        try { localStorage.removeItem('user'); } catch {}
        location.reload();
      }
    });
  }
}