
'use strict';

(() => {
  const CART_KEY = 'bol-cart-v2';
  const LEGACY_KEY = 'bol-cart';

  const $ = (s, root = document) => root.querySelector(s);
  const money = n => new Intl.NumberFormat('vi-VN').format(Number(n) || 0) + '₫';

  const readJSON = (key, fallback) => {
    try {
      const v = JSON.parse(localStorage.getItem(key));
      return v ?? fallback;
    } catch {
      return fallback;
    }
  };

  const readCart = () => {
    let cart = readJSON(CART_KEY, null);

    if (!cart) cart = readJSON(LEGACY_KEY, {});

    if (!cart || typeof cart !== 'object' || Array.isArray(cart)) return {};

    const clean = {};

    Object.entries(cart).forEach(([id, q]) => {
      const n = Math.floor(Number(q));
      if (id && Number.isFinite(n) && n > 0) {
        clean[id] = Math.min(n, 99);
      }
    });

    return clean;
  };

  const writeCart = cart => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    localStorage.setItem(LEGACY_KEY, JSON.stringify(cart));
    updateCartCount();
  };

  const cartCount = () =>
    Object.values(readCart()).reduce((a, b) => a + b, 0);

  function updateCartCount() {
    document.querySelectorAll('[data-cart-count]').forEach(el => {
      el.textContent = cartCount();
    });
  }

  // HEADER MIMORE
  function header() {
    const page = document.body.dataset.page || '';

    const links = [
      ['index.html', 'Trang chủ', 'home'],
      ['shop.html', 'Cửa hàng', 'shop'],
      ['about.html', 'Về MIMORE', 'about'],
      ['sanphamVR.html', 'Sản phẩm VR', 'vr']
    ];

    return `
      <div class="announcement">
        MIMORE
        <span>MORE THAN HANDMADE, MORE THAN LOVELY.</span>
      </div>

      <header class="site-header">
        <a class="brand" href="index.html">
          <span class="brand-mark">MIMORE</span>
          <small>MORE THAN HANDMADE, MORE THAN LOVELY</small>
        </a>

        <nav class="site-nav" id="siteNav">
          ${links.map(([href, label, key]) => `
            <a class="${page === key ? 'active' : ''}" href="${href}">
              ${label}
            </a>
          `).join('')}

          <a class="${page === 'cart' ? 'active' : ''}" href="cart.html">
            Giỏ hàng
          </a>
        </nav>

        <div class="header-actions">
          <a class="cart-link" href="cart.html">
            Giỏ hàng <b data-cart-count>0</b>
          </a>

          <button
            class="menu-toggle"
            id="menuToggle"
            aria-label="Mở menu"
            aria-expanded="false"
          >☰</button>
        </div>
      </header>
    `;
  }

  // FOOTER MIMORE
  function footer() {
    return `
      <footer class="site-footer">
        <div class="wrap">
          <div class="footer-grid">

            <div class="footer-brand">
              <h2>MIMORE</h2>
              <p>MORE THAN HANDMADE, MORE THAN LOVELY.</p>
              <p>
                Thêm yêu thương,<br>
                thêm những kỷ niệm.
              </p>
            </div>

            <div>
              <h3>KHÁM PHÁ</h3>
              <a href="shop.html">Cửa hàng</a>
              <a href="about.html">Câu chuyện MIMORE</a>
              <a href="cart.html">Giỏ hàng</a>
            </div>

            <div>
              <h3>HỖ TRỢ</h3>
              <a href="shop.html">Tìm sản phẩm</a>
              <a href="huongdandathang.html">Hướng dẫn đặt hàng</a>
              <a href="lienhe.html">Liên hệ & giới thiệu</a>
            </div>

            <div>
              <h3>THÔNG TIN</h3>
              <p>Website mô phỏng phục vụ học tập.</p>
              <p>Giá và đơn hàng là dữ liệu demo.</p>
            </div>

          </div>

          <div class="footer-bottom">
            <span>© 2026 MIMORE — MORE THAN HANDMADE, MORE THAN LOVELY</span>
            <span>HANDMADE · PERSONALIZED · MADE WITH LOVE</span>
          </div>
        </div>
      </footer>
    `;
  }

  function toast(message) {
    const el = $('#toast');
    if (!el) return;

    el.textContent = message;
    el.classList.add('show');

    clearTimeout(window.__bolToastTimer);

    window.__bolToastTimer = setTimeout(() => {
      el.classList.remove('show');
    }, 2300);
  }

  const categories = [
    ['Hoa len & hoa giấy', '✿', 'Những đóa hoa lưu giữ thật lâu'],
    ['Hộp quà & set quà', '▧', 'Gói ghém điều bất ngờ'],
    ['Thiệp & lời nhắn', '♡', 'Gửi lời thương bằng chữ'],
    ['DIY Kit', '✂', 'Tự tay tạo nên món quà'],
    ['Đồ handmade & trang trí', '✧', 'Những điều nhỏ xinh']
  ];

  const symbolFor = cat => ({
    'Hoa len & hoa giấy': '✿',
    'Hộp quà & set quà': '▧',
    'Thiệp & lời nhắn': '♡',
    'DIY Kit': '✂',
    'Đồ handmade & trang trí': '✧'
  }[cat] || '♡');

  const visual = p => p.image
    ? `
      <div class="product-visual">
        <img
          src="${p.image}"
          alt="${p.name}"
          loading="lazy"
          onerror="this.remove()"
        >
        <span class="symbol">${symbolFor(p.category)}</span>
        <span class="product-badge">${p.category || 'Handmade'}</span>
      </div>
    `
    : `
      <div class="product-visual">
        <span class="symbol">${symbolFor(p.category)}</span>
        <span class="product-badge">${p.category || 'Handmade'}</span>
      </div>
    `;

  const card = p => `
    <article class="product-card">
      <a
        href="shop.html?product=${encodeURIComponent(p.id)}"
        class="product-open"
        data-view="${p.id}"
        aria-label="Xem ${p.name}"
      >
        ${visual(p)}
      </a>

      <div class="product-info">
        <h3>${p.name}</h3>

        <div class="product-meta">
          ${(p.occasions || []).slice(0, 2).join(' · ')
            || p.subcategory
            || 'Quà handmade'}
        </div>

        <div class="price">${money(p.price)}</div>

        <div class="product-actions">
          <button type="button" data-add="${p.id}">
            Thêm vào giỏ
          </button>

          <button type="button" class="secondary" data-view="${p.id}">
            Chi tiết
          </button>
        </div>
      </div>
    </article>
  `;

  async function getProducts() {
    if (window.BOL_PRODUCTS) return window.BOL_PRODUCTS;

    const r = await fetch('./products.json');

    if (!r.ok) {
      throw new Error(
        'Không tải được products.json. Hãy chạy website bằng Live Server.'
      );
    }

    const data = await r.json();

    if (!Array.isArray(data)) {
      throw new Error('products.json không đúng định dạng.');
    }

    window.BOL_PRODUCTS = data;

    return data;
  }

  function addToCart(id) {
    getProducts()
      .then(products => {
        if (!products.some(p => String(p.id) === String(id))) {
          toast('Không tìm thấy sản phẩm này.');
          return;
        }

        const cart = readCart();

        cart[id] = (cart[id] || 0) + 1;

        writeCart(cart);

        toast('Đã thêm sản phẩm vào giỏ hàng!');
      })
      .catch(e => toast(e.message));
  }

  function bindGlobal() {
    const nav = $('#menuToggle');

    if (nav) {
      nav.addEventListener('click', () => {
        const menu = $('#siteNav');
        const open = menu.classList.toggle('open');

        nav.setAttribute('aria-expanded', String(open));
      });
    }

    document.addEventListener('click', e => {
      const add = e.target.closest('[data-add]');

      if (add) {
        e.preventDefault();
        addToCart(add.dataset.add);
      }

      const view = e.target.closest('[data-view]');

      if (view && document.body.dataset.page === 'shop') {
        e.preventDefault();

        window.dispatchEvent(
          new CustomEvent('bol:view-product', {
            detail: { id: view.dataset.view }
          })
        );
      }
    });

    window.addEventListener('storage', updateCartCount);
  }

  document.addEventListener('DOMContentLoaded', () => {
    const h = $('#site-header');
    const f = $('#site-footer');

    if (h) h.innerHTML = header();
    if (f) f.innerHTML = footer();

    updateCartCount();
    bindGlobal();
  });

  // Giữ nguyên tên đối tượng để các file JS khác không bị lỗi
  window.BOL = {
    money,
    readCart,
    writeCart,
    cartCount,
    updateCartCount,
    toast,
    getProducts,
    card,
    visual,
    categories,
    symbolFor
  };

})();
