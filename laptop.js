'use strict';
/* Lọc theo loại + sắp xếp cho trang Laptop.
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

  const priceOf = card => (productById[card.dataset.id] || { price: 0 }).price;

  function applySort() {
    const mode = sortSel.value;
    sections.forEach(s => {
      const row = s.querySelector('.row');
      const cards = mode === 'default'
        ? row._orig
        : [...row.children].sort((a, b) => (priceOf(a) - priceOf(b)) * (mode === 'asc' ? 1 : -1));
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

  // Mở thẳng một loại qua đường dẫn, ví dụ laptop.html#gaming
  function fromHash() {
    const h = location.hash.slice(1);
    type = types.includes(h) ? h : 'all';
    applyFilter();
  }
  window.addEventListener('hashchange', fromHash);
  fromHash();
})();
