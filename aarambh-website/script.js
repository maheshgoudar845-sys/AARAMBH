// ===== Buy Now — requires size selection =====
function buyNow(el, e) {
  const card = el.closest('.product-card');
  const active = card ? card.querySelector('.size-pill.active') : null;
  if (!active) {
    e.preventDefault();
    const row = card ? card.querySelector('.size-row') : null;
    if (row) {
      row.style.outline = '1px solid var(--red)';
      row.style.borderRadius = '2px';
      setTimeout(() => row.style.outline = 'none', 1600);
    }
    const hint = card ? card.querySelector('.size-hint') : null;
    if (hint) { hint.style.display = 'block'; setTimeout(() => hint.style.display = 'none', 1600); }
    return false;
  }
  return true;
}

// ===== Front / Back image toggle =====
function initFrontBack(card) {
  const toggle = card.querySelector('.front-back-toggle');
  const img = card.querySelector('.product-media img');
  if (!toggle || !img) return;
  let showingFront = true;
  toggle.addEventListener('click', () => {
    showingFront = !showingFront;
    img.src = showingFront
      ? card.querySelector('.product-media').getAttribute('data-front')
      : card.querySelector('.product-media').getAttribute('data-back');
    toggle.textContent = showingFront ? 'View Back' : 'View Front';
  });
}

// ===== Mobile nav toggle =====
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.style.display === 'flex';
      links.style.display = open ? 'none' : 'flex';
      links.style.flexDirection = 'column';
      links.style.position = 'absolute';
      links.style.top = '76px';
      links.style.left = '0';
      links.style.right = '0';
      links.style.background = '#0c0c0c';
      links.style.padding = '20px 28px';
      links.style.borderBottom = '1px solid var(--line)';
      links.style.gap = '20px';
    });
  }

  // Scroll reveal
  const revealEls = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.opacity = 1;
        e.target.style.transform = 'translateY(0)';
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach((el, i) => {
    el.style.opacity = 0;
    el.style.transform = 'translateY(24px)';
    el.style.transition = `opacity .6s ease ${i * 0.05}s, transform .6s ease ${i * 0.05}s`;
    io.observe(el);
  });

  // Product card interactions
  document.querySelectorAll('.product-card').forEach(initProductCard);
  document.querySelectorAll('.product-card').forEach(initFrontBack);
});

function initProductCard(card) {
  const img = card.querySelector('.product-media img');
  const swatches = card.querySelectorAll('.swatch');
  const sizes = card.querySelectorAll('.size-pill');
  const buyBtn = card.querySelector('.buy-now');
  if (!buyBtn) return;

  const baseHref = buyBtn.getAttribute('data-base-href');
  let selectedColor = card.getAttribute('data-default-color') || '';
  let selectedSize = '';

  swatches.forEach(sw => {
    sw.addEventListener('click', () => {
      swatches.forEach(s => s.classList.remove('active'));
      sw.classList.add('active');
      selectedColor = sw.getAttribute('data-color');
      const newImg = sw.getAttribute('data-img');
      if (newImg && img) img.setAttribute('src', newImg);
      updateHref();
    });
  });

  sizes.forEach(sz => {
    sz.addEventListener('click', () => {
      sizes.forEach(s => s.classList.remove('active'));
      sz.classList.add('active');
      selectedSize = sz.textContent.trim();
      updateHref();
    });
  });

  function updateHref() {
    const url = new URL(baseHref, window.location.href);
    if (selectedColor) url.searchParams.set('color', selectedColor);
    if (selectedSize) url.searchParams.set('size', selectedSize);
    buyBtn.setAttribute('href', url.pathname + url.search);
  }
  updateHref();
}
