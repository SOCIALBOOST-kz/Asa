(() => {
  'use strict';
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const config = window.PORTFOLIO || {};
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const phone = String(config.phone || '77754476327').replace(/\D/g, '');
  const whatsapp = (message) => `https://wa.me/${phone}?text=${encodeURIComponent(message || config.whatsappMessage || 'Сәлем! Жобамды талқылағым келеді.')}`;
  $$('[data-whatsapp]').forEach(link => { link.href = whatsapp(); });
  $$('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
  if (config.name && config.name.trim()) {
    document.title = `${config.name} — AI маманы`;
  }

  // Keyboard-friendly mobile navigation.
  const menu = $('.menu-toggle');
  const nav = $('#nav');
  function closeMenu() { menu.setAttribute('aria-expanded', 'false'); menu.setAttribute('aria-label', 'Мәзірді ашу'); nav.classList.remove('open'); }
  menu.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(open)); menu.setAttribute('aria-label', open ? 'Мәзірді жабу' : 'Мәзірді ашу'); nav.classList.toggle('open', open);
  });
  $$('a', nav).forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('click', event => { if (!event.target.closest('.header')) closeMenu(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && nav.classList.contains('open')) { closeMenu(); menu.focus(); } });
  window.matchMedia('(min-width: 641px)').addEventListener('change', closeMenu);

  // Scroll state is updated at most once per animation frame.
  const progress = $('.scroll-progress');
  let scrollFrame = 0;
  function updateProgress() {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = `scaleX(${total > 0 ? Math.min(1, window.scrollY / total) : 0})`;
    scrollFrame = 0;
  }
  window.addEventListener('scroll', () => { if (!scrollFrame) scrollFrame = requestAnimationFrame(updateProgress); }, { passive: true });
  window.addEventListener('resize', updateProgress, { passive: true }); updateProgress();

  if ('IntersectionObserver' in window) {
    document.documentElement.classList.add('motion-enabled');
    const reveal = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); reveal.unobserve(entry.target); } });
    }, { rootMargin: '0px 0px -24px 0px', threshold: 0.05 });
    $$('.reveal').forEach(el => reveal.observe(el));
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) { $$('.nav a').forEach(a => a.classList.toggle('active', a.hash === `#${entry.target.id}`)); } });
    }, { rootMargin: '-15% 0px -55% 0px' });
    $$('section[id]').forEach(section => sectionObserver.observe(section));
    const countObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target, target = Number(el.dataset.count), start = performance.now();
        const draw = now => { const p = reduceMotion.matches ? 1 : Math.min(1, (now - start) / 950); el.textContent = String(Math.round(target * (1 - Math.pow(1 - p, 3)))).padStart(2, '0'); if (p < 1) requestAnimationFrame(draw); };
        requestAnimationFrame(draw); countObserver.unobserve(el);
      });
    }, { threshold: 0.5 });
    $$('[data-count]').forEach(el => countObserver.observe(el));
  }

  // One expanded service at a time; native <details> works without JavaScript.
  $$('.service').forEach(service => service.addEventListener('toggle', () => {
    if (service.open) $$('.service').forEach(other => { if (other !== service && other.open) other.open = false; });
  }));

  // Project category controls.
  $$('.filter').forEach(button => button.addEventListener('click', () => {
    $$('.filter').forEach(other => { const active = other === button; other.classList.toggle('active', active); other.setAttribute('aria-pressed', String(active)); });
    $$('.project-card').forEach(card => { const show = button.dataset.filter === 'all' || card.dataset.category === button.dataset.filter; card.hidden = !show; if (show) card.classList.add('visible'); });
    updateProgress();
  }));

  const caseStudies = {
  "illustration": {
    "title": "Кітапханадағы қиял",
    "kind": "AI ИЛЛЮСТРАЦИЯ",
    "category": "photo",
    "subtitle": "Кейіпкер, жылы жарық және оқиға атмосферасы біріктірілген AI визуал.",
    "task": "Кітапханада отырған кейіпкердің көңіл күйін көркем бейнемен жеткізу.",
    "solution": "Кейіпкердің эмоциясы, кітапхана интерьері және терезеден түскен жарық бір композицияға жинақталған.",
    "tags": [
      "AI ФОТО",
      "КЕЙІПКЕР",
      "ВИЗУАЛ СТОРИТЕЛЛИНГ"
    ],
    "images": [
      {
        "src": "ai-illustration.jpeg",
        "alt": "Кітапханада терезеге қарап отырған анимациялық кейіпкер",
        "label": "Иллюстрация",
        "width": 1456,
        "height": 816
      }
    ]
  },
  "amarrin": {
    "title": "AMARRIN",
    "kind": "САЙТ ДИЗАЙНЫ",
    "category": "web",
    "subtitle": "Табиғи косметика дүкенінің басты беті, блогы және каталог макеттері.",
    "task": "Косметика брендін таныстыру, өнімдерді көрсету және ақпаратты түсінікті бөлімдерге бөлу.",
    "solution": "Басты бет, бренд туралы блоктар, каталог пен сүзгілер, блог және байланыс аймақтары ортақ жеңіл визуал стильде ұсынылған.",
    "tags": [
      "ВЕБ-ДИЗАЙН",
      "E-COMMERCE",
      "КАТАЛОГ",
      "БЛОГ"
    ],
    "images": [
      {
        "src": "amarrin-home.webp",
        "alt": "AMARRIN косметика дүкенінің толық басты бет макеті",
        "label": "Басты бет",
        "width": 340,
        "height": 1127
      },
      {
        "src": "amarrin-blog.webp",
        "alt": "AMARRIN блог бетінің макеті",
        "label": "Блог",
        "width": 1440,
        "height": 1558
      },
      {
        "src": "amarrin-catalog.jpeg",
        "alt": "AMARRIN өнімдер каталогы және сүзгілер",
        "label": "Каталог",
        "width": 1438,
        "height": 1536
      },
      {
        "src": "amarrin-catalog-alt.webp",
        "alt": "AMARRIN каталогының балама көрінісі",
        "label": "Каталог · 2",
        "width": 1440,
        "height": 1538
      }
    ]
  },
  "storage": {
    "title": "Орын босат — жеңіл тыныста",
    "kind": "ЖАРНАМАЛЫҚ КРЕАТИВ",
    "category": "creative",
    "subtitle": "Зат сақтау қызметіне арналған визуал мен мәтін біріктірілген жарнамалық кейс.",
    "task": "Үйдегі артық заттар мәселесін көрсету және сақтау қызметінің ұсынысын түсінікті жеткізу.",
    "solution": "Бөлменің «дейін / кейін» көрінісі арқылы мәселе мен шешім салыстырылған. Кейс-парақта аудитория, жарнама мәтінінің нұсқалары, промпт және баннер идеясы берілген.",
    "tags": [
      "AI КРЕАТИВ",
      "КОПИРАЙТИНГ",
      "ЖАРНАМА"
    ],
    "images": [
      {
        "src": "storage-case.png",
        "alt": "Зат сақтау сервисіне арналған жарнамалық креатив кейсі: мәтіндер, промпт және бөлменің дейін-кейін көрінісі",
        "label": "Кейс-парақ",
        "width": 1746,
        "height": 1155
      }
    ]
  }
};
  const projectDialog = $('#project-dialog');
  const infoDialog = $('#info-dialog');
  let lastFocused = null;
  function showDialog(dialog) { lastFocused = document.activeElement; dialog.showModal(); document.body.style.overflow = 'hidden'; }
  $$('dialog').forEach(dialog => {
    $('.modal-close', dialog).addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => { if (event.target !== dialog) return; const r = dialog.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close(); });
    dialog.addEventListener('close', () => { document.body.style.overflow = ''; if (lastFocused && document.contains(lastFocused)) lastFocused.focus({ preventScroll: true }); });
  });
  let galleryImages = [], galleryIndex = 0;
  const galleryImage = $('#gallery-image');
  const galleryStage = $('.gallery-stage');
  function renderGallery(index) {
    galleryIndex = (index + galleryImages.length) % galleryImages.length;
    const current = galleryImages[galleryIndex];
    galleryImage.src = current.src; galleryImage.alt = current.alt;
    galleryImage.width = current.width; galleryImage.height = current.height;
    $('#gallery-original').href = current.src;
    $('#gallery-position').textContent = `${galleryIndex + 1} / ${galleryImages.length}`;
    $('#gallery-caption').textContent = current.height > current.width ? `${current.label} · Толық макетті төмен жылжытып қараңыз.` : current.label;
    galleryStage.scrollTop = 0;
    $$('.gallery-tab').forEach((button, i) => { const selected = i === galleryIndex; button.classList.toggle('active', selected); button.setAttribute('aria-pressed', String(selected)); });
  }
  $('.gallery-prev').addEventListener('click', () => renderGallery(galleryIndex - 1));
  $('.gallery-next').addEventListener('click', () => renderGallery(galleryIndex + 1));
  projectDialog.addEventListener('keydown', event => {
    if (!projectDialog.open || galleryImages.length < 2 || event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); renderGallery(galleryIndex + (event.key === 'ArrowRight' ? 1 : -1)); }
  });
  $$('[data-project]').forEach(button => button.addEventListener('click', () => {
    const key = button.dataset.project, project = caseStudies[key];
    $('#project-dialog-title').textContent = project.title;
    $('#case-kind').textContent = project.kind;
    $('.modal-subtitle', projectDialog).textContent = project.subtitle;
    $('#case-task').textContent = project.task; $('#case-solution').textContent = project.solution;
    $('#case-tags').replaceChildren(...project.tags.map(tag => { const span = document.createElement('span'); span.textContent = tag; return span; }));
    $('#case-contact').href = whatsapp(`Сәлем! «${project.title}» секілді жобаны талқылағым келеді.`);
    galleryImages = project.images;
    $('.gallery-tabs').replaceChildren(...galleryImages.map((image, i) => { const tab = document.createElement('button'); tab.className = 'gallery-tab'; tab.type = 'button'; tab.textContent = image.label; tab.setAttribute('aria-label', `${image.label} көрінісін ашу`); tab.addEventListener('click', () => renderGallery(i)); return tab; }));
    $('.gallery-prev').disabled = galleryImages.length < 2;
    $('.gallery-next').disabled = galleryImages.length < 2;
    $('.gallery-tabs').hidden = galleryImages.length < 2;
    renderGallery(0); showDialog(projectDialog); projectDialog.scrollTop = 0;
  }));
  $$('[data-service-link]').forEach(link => link.addEventListener('click', () => {
    const service = $(link.hash); if (service) service.open = true;
  }));

  let toastTimer;
  function toast(message) { const el = $('.toast'); el.textContent = message; el.classList.add('visible'); clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove('visible'), 3400); }
  $('.copy-phone').addEventListener('click', async () => {
    const text = config.phoneDisplay || '+7 775 447 6327';
    try { if (!navigator.clipboard) throw new Error('clipboard unavailable'); await navigator.clipboard.writeText(text); toast('Нөмір көшірілді: ' + text); }
    catch { toast('Байланыс нөмірі: ' + text); }
  });
  $('.tiktok-trigger').addEventListener('click', () => {
    if (config.tiktokUrl) { try { const url = new URL(config.tiktokUrl); if (url.protocol === 'https:' && (url.hostname === 'tiktok.com' || url.hostname.endsWith('.tiktok.com'))) { window.open(url.href, '_blank', 'noopener,noreferrer'); return; } } catch {} }
    $('#info-kicker').textContent = 'SOCIAL / TIKTOK'; $('#info-title').textContent = 'Осы жерде кездесеміз.';
    const p = document.createElement('p'); p.textContent = 'TikTok аккаунты жақында қосылады. Әзірге идеяңды WhatsApp-та талқылайық.';
    const link = document.createElement('a'); link.className = 'button button-lime'; link.style.marginTop = '23px'; link.href = whatsapp(); link.target = '_blank'; link.rel = 'noopener noreferrer'; link.textContent = 'WhatsApp-қа жазу ↗';
    $('#info-content').replaceChildren(p, link); showDialog(infoDialog);
  });
  $('.sources-trigger').addEventListener('click', () => {
    $('#info-kicker').textContent = 'RESEARCH / REFERENCES'; $('#info-title').textContent = 'Бағыт берген идеялар';
    const p = document.createElement('p'); p.textContent = 'Қызмет бағыттары қазіргі AI мамандарының жұмысымен танысу негізінде құрастырылды. Портфолиода AI иллюстрация, сайт макеттері және жарнамалық кейс көрсетілген.';
    const links = [ ['https://workwithivan.is-a.dev/', 'Ed Ivan Repalam ↗', 'AI агенттер, автоматтандыру, CRM және веб-әзірлеу.'], ['https://kollektiv.kz/en_main', 'kollektiv, Алматы ↗', 'AI видео және брендке арналған цифрлық контент.'] ];
    const nodes = links.map(([url, name, desc]) => { const a = document.createElement('a'); a.className = 'source-link'; a.href = url; a.target = '_blank'; a.rel = 'noopener noreferrer'; a.textContent = name; const small = document.createElement('small'); small.textContent = desc; a.append(small); return a; });
    const note = document.createElement('p'); note.textContent = 'Қызметтер бөлімі — жұмыс бағыттары. Портфолио бөлімі — сол бағыттарға арналған визуалдар мен макеттер.';
    $('#info-content').replaceChildren(p, ...nodes, note); showDialog(infoDialog);
  });

  // Subtle button magnetism, only for precise pointers.
  if (window.matchMedia('(pointer: fine)').matches && !reduceMotion.matches) {
    $$('.magnetic').forEach(button => {
      button.addEventListener('pointermove', event => { const r = button.getBoundingClientRect(); button.style.transform = `translate(${(event.clientX - r.left - r.width / 2) * .09}px, ${(event.clientY - r.top - r.height / 2) * .13}px)`; });
      button.addEventListener('pointerleave', () => { button.style.transform = ''; });
    });
  }

  // Procedural 3D point-cloud sculpture. No image, WebGL or external dependency.
  const canvas = $('#orb');
  const context = canvas.getContext('2d', { alpha: true });
  if (!context) return;
  let width = 0, height = 0, dpr = 1, frame = 0, lastTime = 0, active = true, elapsed = 0;
  let targetX = 0, targetY = 0, mouseX = 0, mouseY = 0;
  const art = $('.hero-art');
  art.addEventListener('pointermove', event => { const r = art.getBoundingClientRect(); targetX = (event.clientX - r.left) / r.width - .5; targetY = (event.clientY - r.top) / r.height - .5; });
  art.addEventListener('pointerleave', () => { targetX = 0; targetY = 0; });
  const TAU = Math.PI * 2;
  function resizeCanvas() { const rect = canvas.getBoundingClientRect(); width = rect.width; height = rect.height; dpr = Math.min(window.devicePixelRatio || 1, 1.75); canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr); context.setTransform(dpr, 0, 0, dpr, 0, 0); if (reduceMotion.matches || !active) draw(0); }
  function project(x, y, z, ax, ay, size, cx, cy) {
    const cyaw = Math.cos(ay), syaw = Math.sin(ay), cp = Math.cos(ax), sp = Math.sin(ax);
    const x1 = x * cyaw - z * syaw, z1 = x * syaw + z * cyaw;
    const y1 = y * cp - z1 * sp, z2 = y * sp + z1 * cp;
    const perspective = 3.6 / (3.6 + z2);
    return { x: cx + x1 * size * perspective, y: cy + y1 * size * perspective, z: z2, scale: perspective };
  }
  function draw(t) {
    if (!width || !height) return;
    context.clearRect(0, 0, width, height);
    mouseX += (targetX - mouseX) * .06; mouseY += (targetY - mouseY) * .06;
    const size = Math.min(width, height) * .335, cx = width * .51, cy = height * .5;
    const ax = -.24 + mouseY * .35, ay = t * .12 + mouseX * .5;
    const rows = width < 450 ? 27 : 34, columns = width < 450 ? 59 : 76;
    const points = [];
    for (let row = 0; row <= rows; row++) {
      const phi = .055 + (Math.PI - .11) * row / rows;
      const sinPhi = Math.sin(phi), cosPhi = Math.cos(phi);
      for (let col = 0; col < columns; col++) {
        const theta = TAU * col / columns;
        const r = 1 + .095 * Math.sin(theta * 3 + phi * 3 + t * .26) + .045 * Math.cos(phi * 7 - theta * 2 + t * .13);
        const p = project(r * sinPhi * Math.cos(theta), r * cosPhi, r * sinPhi * Math.sin(theta), ax, ay, size, cx, cy);
        p.row = row; p.col = col; points.push(p);
      }
    }
    // Delicate wire connections reinforce the surface without hiding the particles.
    context.lineWidth = .45;
    for (let i = 0; i < points.length; i++) {
      const p = points[i], opacity = .025 + Math.max(0, (1 - p.z) / 2) * .1;
      if (p.row % 2 === 0) {
        const next = points[p.row * columns + (p.col + 1) % columns];
        context.strokeStyle = `rgba(174,219,99,${opacity})`; context.beginPath(); context.moveTo(p.x, p.y); context.lineTo(next.x, next.y); context.stroke();
      }
      if (p.col % 4 === 0 && i + columns < points.length) { const next = points[i + columns]; context.strokeStyle = `rgba(174,219,99,${opacity * .55})`; context.beginPath(); context.moveTo(p.x, p.y); context.lineTo(next.x, next.y); context.stroke(); }
    }
    points.sort((a, b) => b.z - a.z);
    points.forEach(p => {
      const front = Math.max(0, Math.min(1, (1.2 - p.z) / 2.4));
      const edge = Math.abs(p.z) < .25;
      const bright = (p.col + p.row * 3) % 17 === 0;
      context.fillStyle = bright ? `rgba(231,255,182,${.35 + front * .6})` : `rgba(${edge ? '208,255,119' : '166,214,83'},${.16 + front * .64})`;
      context.beginPath(); context.arc(p.x, p.y, (bright ? 1.65 : .65 + front * .38) * p.scale, 0, TAU); context.fill();
    });
    // Two tilted orbital trails, with moving signal particles.
    for (let ring = 0; ring < 2; ring++) {
      context.beginPath();
      for (let i = 0; i <= 150; i++) {
        const a = i / 150 * TAU, rad = ring ? 1.3 : 1.38;
        const p = project(Math.cos(a) * rad, Math.sin(a) * (ring ? .42 : .15), Math.sin(a) * rad, ring ? .62 : -.6, ay * .4 + (ring ? 1.3 : 0), size, cx, cy);
        if (i === 0) context.moveTo(p.x, p.y); else context.lineTo(p.x, p.y);
      }
      context.strokeStyle = ring ? 'rgba(169,211,105,.13)' : 'rgba(206,247,150,.30)'; context.lineWidth = .6; context.stroke();
      const a = t * (ring ? -.18 : .24) + ring * 2, rad = ring ? 1.3 : 1.38;
      const p = project(Math.cos(a) * rad, Math.sin(a) * (ring ? .42 : .15), Math.sin(a) * rad, ring ? .62 : -.6, ay * .4 + (ring ? 1.3 : 0), size, cx, cy);
      context.beginPath(); context.arc(p.x, p.y, 2.1, 0, TAU); context.fillStyle = '#d3ff63'; context.shadowBlur = 10; context.shadowColor = '#d3ff63'; context.fill(); context.shadowBlur = 0;
    }
  }
  function tick(now) {
    frame = 0;
    if (!active || document.hidden || reduceMotion.matches) return;
    if (now - lastTime >= 32) { elapsed += Math.min(64, now - (lastTime || now)) / 1000; draw(elapsed); lastTime = now; }
    frame = requestAnimationFrame(tick);
  }
  function schedule() { if (frame) cancelAnimationFrame(frame); frame = 0; lastTime = 0; if (active && !document.hidden && !reduceMotion.matches) frame = requestAnimationFrame(tick); else draw(elapsed); }
  if ('ResizeObserver' in window) new ResizeObserver(resizeCanvas).observe(art); else window.addEventListener('resize', resizeCanvas);
  if ('IntersectionObserver' in window) { const observer = new IntersectionObserver(entries => { active = entries[0].isIntersecting; schedule(); }, { rootMargin: '80px' }); observer.observe(art); }
  document.addEventListener('visibilitychange', schedule); reduceMotion.addEventListener('change', schedule);
  resizeCanvas(); draw(0); schedule();
})();
