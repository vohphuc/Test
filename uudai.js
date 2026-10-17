'use strict';
/* Trang Ưu đãi: lọc theo loại, sắp xếp (kể cả "Giảm nhiều nhất") và đồng hồ đếm ngược.
   Chạy SAU script.js (script.js đã tạo thẻ sản phẩm và giỏ hàng). */
(function () {
  const chips = [...document.querySelectorAll('.chip')];
  const sections = [...document.querySelectorAll('.sec[data-type]')];
  const sortSel = document.getElementById('sort');
  const countEl = document.getElementById('count');
  const types = chips.map(c => c.dataset.type);
  let type = 'all';

  // Lưu thứ tự gốc để quay lại "Mặc định"
  sections.forEach(s => { const row = s.querySelector('.row'); row._orig = [...row.children]; });

  const info = card => productById[card.dataset.id] || { price: 0, oldPrice: 0 };
  const pct = card => { const p = info(card); return p.oldPrice ? 1 - p.price / p.oldPrice : 0; };

  function applySort() {
    const mode = sortSel.value;
    const cmp = {
      pct: (a, b) => pct(b) - pct(a),
      asc: (a, b) => info(a).price - info(b).price,
      desc: (a, b) => info(b).price - info(a).price
    }[mode];
    sections.forEach(s => {
      const row = s.querySelector('.row');
      const cards = cmp ? [...row.children].sort(cmp) : row._orig;
      cards.forEach(c => row.appendChild(c));
    });
  }

  function applyFilter() {
    let total = 0;
    sections.forEach(s => {
      const show = type === 'all' || s.dataset.type === type;
      s.hidden = !show;
      if (show) total += s.querySelectorAll('.card').length;
    });
    chips.forEach(c => {
      const on = c.dataset.type === type;
      c.classList.toggle('on', on);
      c.setAttribute('aria-pressed', on);
    });
    countEl.textContent = total + ' sản phẩm';
  }

  chips.forEach(c => c.addEventListener('click', () => {
    type = c.dataset.type;
    applyFilter();
    history.replaceState(null, '', type === 'all' ? location.pathname : '#' + type);
  }));
  sortSel.addEventListener('change', applySort);

  // Mở thẳng một loại qua đường dẫn, ví dụ uudai.html#phone
  function fromHash() {
    const h = location.hash.slice(1);
    type = types.includes(h) ? h : 'all';
    applyFilter();
  }
  window.addEventListener('hashchange', fromHash);
  fromHash();

  /* ---------- Đồng hồ đếm ngược đến hết ngày ---------- */
  const hh = document.getElementById('hh'), mm = document.getElementById('mm'), ss = document.getElementById('ss');
  const pad = n => String(n).padStart(2, '0');
  function tick() {
    const now = new Date(), end = new Date(now);
    end.setHours(24, 0, 0, 0);                       // 00:00 ngày hôm sau
    const left = Math.max(0, Math.floor((end - now) / 1000));
    hh.textContent = pad(Math.floor(left / 3600));
    mm.textContent = pad(Math.floor(left % 3600 / 60));
    ss.textContent = pad(left % 60);
  }
  tick();
  setInterval(tick, 1000);
})();
