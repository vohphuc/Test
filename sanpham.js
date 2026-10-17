'use strict';
/* ============================================================
   DỮ LIỆU SẢN PHẨM
   - Mỗi sản phẩm cần id RIÊNG (giỏ hàng, bình luận, tìm kiếm dùng id).
   - Trường tùy chọn: oldPrice (giá cũ), desc (mô tả).
   - Khóa của từng nhóm (sale, laptop, ...) khớp với data-cat trong HTML.
   Nạp file này TRƯỚC script.js.
   ============================================================ */
const products = {
  /* ---------- Trang chủ ---------- */
  sale: [
    { id: 'sale1', name: 'Asus Zenbook 14', price: 24990000, oldPrice: 30000000, img: 'image/Uudai1.jpg', desc: 'Màn hình OLED 14 inch, Core Ultra 7, RAM 16GB, SSD 512GB.' },
    { id: 'sale2', name: 'Acer Aspire 7', price: 17990000, oldPrice: 25000000, img: 'image/Uudai2.jpg' },
    { id: 'sale3', name: 'Iphone 17 Pro Max', price: 19990000, oldPrice: 27000000, img: 'image/Uudai3.jpg' },
    { id: 'sale4', name: 'Asus Vivobook 12', price: 20990000, oldPrice: 28000000, img: 'image/Uudai4.jpg' },
    { id: 'sale5', name: 'Omnibook Laptop', price: 22990000, oldPrice: 29000000, img: 'image/Uudai5.jpg' }
  ],
  laptop: [
    { id: 'lt1', name: 'Asus Zenbook 15', price: 24990000, img: 'image/laptop/laptop1.jpg' },
    { id: 'lt2', name: 'HP Pavilion', price: 28990000, img: 'image/laptop/laptop2.jpg' },
    { id: 'lt3', name: 'Acer Aspire 10', price: 19990000, img: 'image/laptop/laptop3.jpg' },
    { id: 'lt4', name: 'Lenovo ThinkBook', price: 21990000, img: 'image/laptop/laptop4.jpg' },
    { id: 'lt5', name: 'Asus Vivobook 15', price: 23990000, img: 'image/laptop/laptop5.jpg' }
  ],
  phone: [
    { id: 'ph1', name: 'Samsung Galaxy A50', price: 19990000, img: 'image/dienthoai/phone-1.jpg' },
    { id: 'ph2', name: 'OPPO RENO 16', price: 18990000, img: 'image/dienthoai/phone-2.jpg' },
    { id: 'ph3', name: 'Xiaomi Note 17', price: 16990000, img: 'image/dienthoai/phone-3.jpg' },
    { id: 'ph4', name: 'Redmi Note 15 Pro', price: 23990000, img: 'image/dienthoai/phone-4.jpg' },
    { id: 'ph5', name: 'Iphone 18 Pro Max', price: 39990000, img: 'image/dienthoai/phone-5.jpg' }
  ],
  accessory: [
    { id: 'pk1', name: 'Micro Elgato 3', price: 390000, img: 'image/phukien/pk1.jpg' },
    { id: 'pk2', name: 'Balo chống sốc Targus', price: 290000, img: 'image/phukien/pk2.jpg' },
    { id: 'pk3', name: 'Ổ cứng SSD Super Charge', price: 2990000, img: 'image/phukien/pk3.jpg' },
    { id: 'pk4', name: 'Lót chuột Logitech', price: 10000, img: 'image/phukien/pk4.jpg' },
    { id: 'pk5', name: 'Đèn treo tường Helix', price: 70000, img: 'image/phukien/pk5.jpg' }
  ],
  device: [
    { id: 'dv1', name: 'Tai nghe Tiger', price: 790000, img: 'image/thietbi/tb1.jpg' },
    { id: 'dv2', name: 'Tai nghe Corsair', price: 990000, img: 'image/thietbi/tb2.jpg' },
    { id: 'dv3', name: 'Loa Logitech A2', price: 2990000, img: 'image/thietbi/tb3.jpg' },
    { id: 'dv4', name: 'Màn hình phụ HG', price: 3990000, img: 'image/thietbi/tb4.jpg' },
    { id: 'dv5', name: 'Đồng hồ phụ LG', price: 990000, img: 'image/thietbi/tb5.jpg' }
  ],

  /* ---------- Trang Laptop (laptop.html) ---------- */
  laptopGaming: [
    { id: 'lg1', name: 'ASUS ROG Strix G16', price: 42990000, oldPrice: 47990000, img: 'image/laptop/gaming1.jpg', desc: 'Core i9, RTX 4070, RAM 16GB, SSD 1TB, màn hình 16 inch 165Hz.' },
    { id: 'lg2', name: 'Acer Nitro 5 Tiger', price: 24990000, img: 'image/laptop/gaming2.jpg' },
    { id: 'lg3', name: 'MSI Katana 15', price: 27990000, oldPrice: 31990000, img: 'image/laptop/gaming3.jpg' },
    { id: 'lg4', name: 'Lenovo Legion 5 Pro', price: 38990000, img: 'image/laptop/gaming4.jpg' },
    { id: 'lg5', name: 'HP Victus 16', price: 22990000, img: 'image/laptop/gaming5.jpg' }
  ],
  laptopOffice: [
    { id: 'lo1', name: 'Dell Inspiron 15', price: 15990000, img: 'image/laptop/office1.jpg' },
    { id: 'lo2', name: 'HP 15s', price: 13990000, oldPrice: 15490000, img: 'image/laptop/office2.jpg' },
    { id: 'lo3', name: 'Asus Vivobook 15', price: 14990000, img: 'image/laptop/office3.jpg' },
    { id: 'lo4', name: 'Acer Aspire 5', price: 16490000, img: 'image/laptop/office4.jpg' },
    { id: 'lo5', name: 'Lenovo IdeaPad Slim 5', price: 18990000, img: 'image/laptop/office5.jpg' }
  ],
  laptopWorkstation: [
    { id: 'lw1', name: 'HP ZBook Fury 16 G10', price: 79990000, img: 'image/laptop/ws1.jpg' },
    { id: 'lw2', name: 'Lenovo ThinkPad P16 Gen 2', price: 85990000, img: 'image/laptop/ws2.jpg' },
    { id: 'lw3', name: 'Dell Precision 5680', price: 69990000, oldPrice: 74990000, img: 'image/laptop/ws3.jpg' },
    { id: 'lw4', name: 'MSI CreatorPro X17', price: 95990000, img: 'image/laptop/ws4.jpg' },
    { id: 'lw5', name: 'ASUS ProArt Studiobook 16', price: 58990000, img: 'image/laptop/ws5.jpg' }
  ],
  laptopThin: [
    { id: 'll1', name: 'LG Gram 14', price: 28990000, img: 'image/laptop/thin1.jpg' },
    { id: 'll2', name: 'ASUS Zenbook 14 OLED', price: 25990000, oldPrice: 28990000, img: 'image/laptop/thin2.jpg' },
    { id: 'll3', name: 'HP Spectre x360 14', price: 39990000, img: 'image/laptop/thin3.jpg' },
    { id: 'll4', name: 'Dell XPS 13 Plus', price: 44990000, img: 'image/laptop/thin4.jpg' },
    { id: 'll5', name: 'Lenovo Yoga Slim 7', price: 21990000, img: 'image/laptop/thin5.jpg' }
  ],
  laptopStudent: [
    { id: 'ls1', name: 'Acer Aspire Lite', price: 12490000, oldPrice: 13990000, img: 'image/laptop/sv1.jpg' },
    { id: 'ls2', name: 'Lenovo IdeaPad 1', price: 10990000, img: 'image/laptop/sv2.jpg' },
    { id: 'ls3', name: 'ASUS Vivobook Go 15', price: 11990000, img: 'image/laptop/sv3.jpg' },
    { id: 'ls4', name: 'HP 14 Laptop', price: 9990000, img: 'image/laptop/sv4.jpg' },
    { id: 'ls5', name: 'Dell Vostro 3520', price: 13490000, img: 'image/laptop/sv5.jpg' }
  ]
,

  /* ---------- Trang Ưu đãi (uudai.html): mọi sản phẩm đều có oldPrice ---------- */
  saleFlash: [
    { id: 'sf1', name: 'Tai nghe JBL Tune 520BT', price: 590000, oldPrice: 990000, img: 'image/uudai/flash1.jpg' },
    { id: 'sf2', name: 'Sạc Anker 65W', price: 590000, oldPrice: 890000, img: 'image/uudai/flash2.jpg' },
    { id: 'sf3', name: 'Chuột Logitech G102', price: 249000, oldPrice: 390000, img: 'image/uudai/flash3.jpg' },
    { id: 'sf4', name: 'Balo chống sốc Targus 15.6"', price: 390000, oldPrice: 590000, img: 'image/uudai/flash4.jpg' },
    { id: 'sf5', name: 'USB SanDisk 128GB', price: 159000, oldPrice: 250000, img: 'image/uudai/flash5.jpg' }
  ],
  saleLaptop: [
    { id: 'sl1', name: 'Acer Nitro 5 Tiger', price: 21990000, oldPrice: 26990000, img: 'image/uudai/laptop1.jpg' },
    { id: 'sl2', name: 'Dell Inspiron 15', price: 12990000, oldPrice: 16990000, img: 'image/uudai/laptop2.jpg' },
    { id: 'sl3', name: 'HP Pavilion 14', price: 14990000, oldPrice: 18990000, img: 'image/uudai/laptop3.jpg' },
    { id: 'sl4', name: 'Lenovo IdeaPad Slim 5', price: 16490000, oldPrice: 20990000, img: 'image/uudai/laptop4.jpg' },
    { id: 'sl5', name: 'LG Gram 14', price: 24990000, oldPrice: 31990000, img: 'image/uudai/laptop5.jpg' }
  ],
  salePhone: [
    { id: 'sp1', name: 'Samsung Galaxy S25 Ultra', price: 26990000, oldPrice: 33990000, img: 'image/uudai/phone1.jpg' },
    { id: 'sp2', name: 'iPhone 16', price: 19990000, oldPrice: 24990000, img: 'image/uudai/phone2.jpg' },
    { id: 'sp3', name: 'Xiaomi 15T Pro', price: 15990000, oldPrice: 19990000, img: 'image/uudai/phone3.jpg' },
    { id: 'sp4', name: 'OPPO Find X8', price: 19990000, oldPrice: 24990000, img: 'image/uudai/phone4.jpg' },
    { id: 'sp5', name: 'Redmi Note 14 Pro', price: 6490000, oldPrice: 8490000, img: 'image/uudai/phone5.jpg' }
  ],
  saleAccessory: [
    { id: 'sa1', name: 'Sony WH-1000XM5', price: 5490000, oldPrice: 7490000, img: 'image/uudai/acc1.jpg' },
    { id: 'sa2', name: 'SSD Samsung T7 1TB', price: 1990000, oldPrice: 2590000, img: 'image/uudai/acc2.jpg' },
    { id: 'sa3', name: 'Loa JBL Flip 6', price: 1990000, oldPrice: 2690000, img: 'image/uudai/acc3.jpg' },
    { id: 'sa4', name: 'Bàn phím Keychron K2 Pro', price: 1790000, oldPrice: 2290000, img: 'image/uudai/acc4.jpg' },
    { id: 'sa5', name: 'Màn hình Dell 24" S2425H', price: 2690000, oldPrice: 3490000, img: 'image/uudai/acc5.jpg' }
  ],

  /* ---------- Trang Điện thoại (dienthoai.html) ---------- */
  phoneApple: [
    { id: 'pa1', name: 'iPhone 17 Pro Max', price: 37990000, img: 'image/dienthoai/apple1.jpg', desc: 'Màn hình 6.9 inch ProMotion, chip A19 Pro, camera 48MP, pin lớn.' },
    { id: 'pa2', name: 'iPhone 17 Pro', price: 34990000, img: 'image/dienthoai/apple2.jpg' },
    { id: 'pa3', name: 'iPhone 17', price: 29990000, img: 'image/dienthoai/apple3.jpg' },
    { id: 'pa4', name: 'iPhone Air', price: 31990000, img: 'image/dienthoai/apple4.jpg' },
    { id: 'pa5', name: 'iPhone 16', price: 22990000, oldPrice: 24990000, img: 'image/dienthoai/apple5.jpg' }
  ],
  phoneSamsung: [
    { id: 'ps1', name: 'Samsung Galaxy S25 Ultra', price: 29990000, oldPrice: 33990000, img: 'image/dienthoai/samsung1.jpg' },
    { id: 'ps2', name: 'Samsung Galaxy S25+', price: 22990000, img: 'image/dienthoai/samsung2.jpg' },
    { id: 'ps3', name: 'Samsung Galaxy Z Fold7', price: 41990000, img: 'image/dienthoai/samsung3.jpg' },
    { id: 'ps4', name: 'Samsung Galaxy Z Flip7', price: 25990000, img: 'image/dienthoai/samsung4.jpg' },
    { id: 'ps5', name: 'Samsung Galaxy A56', price: 10490000, img: 'image/dienthoai/samsung5.jpg' }
  ],
  phoneAndroid: [
    { id: 'pm1', name: 'Xiaomi 15T Pro', price: 17990000, img: 'image/dienthoai/android1.jpg' },
    { id: 'pm2', name: 'OPPO Find X8', price: 22990000, img: 'image/dienthoai/android2.jpg' },
    { id: 'pm3', name: 'Redmi Note 14 Pro', price: 7990000, oldPrice: 8490000, img: 'image/dienthoai/android3.jpg' },
    { id: 'pm4', name: 'vivo V50', price: 11990000, img: 'image/dienthoai/android4.jpg' },
    { id: 'pm5', name: 'realme GT 7', price: 14990000, img: 'image/dienthoai/android5.jpg' }
  ],
  phoneBudget: [
    { id: 'pb1', name: 'Redmi 14C', price: 3290000, img: 'image/dienthoai/budget1.jpg' },
    { id: 'pb2', name: 'Samsung Galaxy A16', price: 4990000, img: 'image/dienthoai/budget2.jpg' },
    { id: 'pb3', name: 'OPPO A5 Pro', price: 5490000, img: 'image/dienthoai/budget3.jpg' },
    { id: 'pb4', name: 'realme C75', price: 4690000, img: 'image/dienthoai/budget4.jpg' },
    { id: 'pb5', name: 'vivo Y29', price: 4990000, img: 'image/dienthoai/budget5.jpg' }
  ],

  /* ---------- Trang Phụ kiện (phukien.html) ---------- */
  accInput: [
    { id: 'ak1', name: 'Chuột Logitech MX Master 3S', price: 2190000, img: 'image/phukien/input1.jpg' },
    { id: 'ak2', name: 'Bàn phím Logitech MX Keys S', price: 2490000, img: 'image/phukien/input2.jpg' },
    { id: 'ak3', name: 'Bàn phím Keychron K2 Pro', price: 2290000, oldPrice: 2590000, img: 'image/phukien/input3.jpg' },
    { id: 'ak4', name: 'Chuột Razer DeathAdder V3', price: 1490000, img: 'image/phukien/input4.jpg' },
    { id: 'ak5', name: 'Chuột Logitech G102', price: 390000, img: 'image/phukien/input5.jpg' }
  ],
  accBag: [
    { id: 'ab1', name: 'Balo chống sốc Targus 15.6"', price: 590000, img: 'image/phukien/bag1.jpg' },
    { id: 'ab2', name: 'Balo Xiaomi Commuter', price: 690000, img: 'image/phukien/bag2.jpg' },
    { id: 'ab3', name: 'Túi chống sốc laptop 14"', price: 290000, img: 'image/phukien/bag3.jpg' },
    { id: 'ab4', name: 'Balo Thule Subterra', price: 1890000, img: 'image/phukien/bag4.jpg' },
    { id: 'ab5', name: 'Túi Tomtoc 15"', price: 490000, img: 'image/phukien/bag5.jpg' }
  ],
  accCharge: [
    { id: 'ac1', name: 'Sạc Anker 65W GaN', price: 890000, img: 'image/phukien/charge1.jpg' },
    { id: 'ac2', name: 'Cáp USB-C 100W 2m', price: 190000, img: 'image/phukien/charge2.jpg' },
    { id: 'ac3', name: 'Pin dự phòng Anker 20000mAh', price: 990000, img: 'image/phukien/charge3.jpg' },
    { id: 'ac4', name: 'Hub Ugreen 7 trong 1', price: 790000, img: 'image/phukien/charge4.jpg' },
    { id: 'ac5', name: 'Sạc MacBook Apple 70W', price: 1490000, img: 'image/phukien/charge5.jpg' }
  ],
  accStorage: [
    { id: 'as1', name: 'SSD Samsung T7 1TB', price: 2590000, oldPrice: 2990000, img: 'image/phukien/storage1.jpg' },
    { id: 'as2', name: 'USB SanDisk 128GB', price: 250000, img: 'image/phukien/storage2.jpg' },
    { id: 'as3', name: 'Thẻ nhớ SanDisk 256GB', price: 490000, img: 'image/phukien/storage3.jpg' },
    { id: 'as4', name: 'Ổ cứng WD My Passport 2TB', price: 1990000, img: 'image/phukien/storage4.jpg' },
    { id: 'as5', name: 'SSD Kingston NV2 1TB', price: 1890000, img: 'image/phukien/storage5.jpg' }
  ],

  /* ---------- Trang Thiết bị (thietbi.html) ---------- */
  deviceHeadphone: [
    { id: 'dh1', name: 'Sony WH-1000XM5', price: 6990000, oldPrice: 7490000, img: 'image/thietbi/headphone1.jpg' },
    { id: 'dh2', name: 'AirPods Pro 3', price: 6490000, img: 'image/thietbi/headphone2.jpg' },
    { id: 'dh3', name: 'Logitech G Pro X', price: 2790000, img: 'image/thietbi/headphone3.jpg' },
    { id: 'dh4', name: 'Corsair HS80', price: 2490000, img: 'image/thietbi/headphone4.jpg' },
    { id: 'dh5', name: 'JBL Tune 520BT', price: 990000, img: 'image/thietbi/headphone5.jpg' }
  ],
  deviceSpeaker: [
    { id: 'dl1', name: 'Loa JBL Flip 6', price: 2490000, img: 'image/thietbi/speaker1.jpg' },
    { id: 'dl2', name: 'Loa Logitech Z407', price: 1890000, img: 'image/thietbi/speaker2.jpg' },
    { id: 'dl3', name: 'Loa Marshall Emberton', price: 3990000, img: 'image/thietbi/speaker3.jpg' },
    { id: 'dl4', name: 'Loa Sony SRS-XB13', price: 990000, img: 'image/thietbi/speaker4.jpg' },
    { id: 'dl5', name: 'Loa Edifier R1280DB', price: 2190000, img: 'image/thietbi/speaker5.jpg' }
  ],
  deviceMonitor: [
    { id: 'dm1', name: 'Màn hình Dell 24" S2425H', price: 3290000, img: 'image/thietbi/monitor1.jpg' },
    { id: 'dm2', name: 'Màn hình LG UltraGear 27" 144Hz', price: 4990000, img: 'image/thietbi/monitor2.jpg' },
    { id: 'dm3', name: 'Màn hình ASUS ProArt 27" 4K', price: 11990000, img: 'image/thietbi/monitor3.jpg' },
    { id: 'dm4', name: 'Màn hình Samsung Odyssey G5 32"', price: 6490000, oldPrice: 7290000, img: 'image/thietbi/monitor4.jpg' },
    { id: 'dm5', name: 'Màn hình ViewSonic 22"', price: 2190000, img: 'image/thietbi/monitor5.jpg' }
  ],
  deviceStream: [
    { id: 'dt1', name: 'Webcam Logitech C920', price: 1590000, img: 'image/thietbi/stream1.jpg' },
    { id: 'dt2', name: 'Micro Blue Yeti', price: 3190000, img: 'image/thietbi/stream2.jpg' },
    { id: 'dt3', name: 'Đèn Elgato Key Light', price: 3490000, img: 'image/thietbi/stream3.jpg' },
    { id: 'dt4', name: 'Router TP-Link Archer AX55', price: 1890000, img: 'image/thietbi/stream4.jpg' },
    { id: 'dt5', name: 'Elgato Stream Deck MK.2', price: 3990000, img: 'image/thietbi/stream5.jpg' }
  ]
};

/* Áp dụng thay đổi từ trang quản trị (lưu trong trình duyệt này): thêm và xóa sản phẩm */
(function () {
  let s = null;
  try { s = JSON.parse(localStorage.getItem('admin_products')); } catch {}
  if (!s) return;
  const del = new Set(s.deleted || []);
  Object.keys(products).forEach(k => { products[k] = products[k].filter(p => !del.has(p.id)); });
  (s.added || []).forEach(p => { (products[p.cat] = products[p.cat] || []).push(p); });
})();

/* Áp dụng thay đổi từ trang quản trị (admin.html): sản phẩm đã xóa và đã thêm */
(function () {
  try {
    const del = new Set(JSON.parse(localStorage.getItem('adminDeleted') || '[]'));
    const add = JSON.parse(localStorage.getItem('adminAdded') || '[]');
    Object.keys(products).forEach(k => { products[k] = products[k].filter(p => !del.has(p.id)); });
    add.forEach(p => { (products[p.cat] = products[p.cat] || []).push(p); });
  } catch (e) {}
})();
