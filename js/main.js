/* =========================================================
   Pınar Yalçın – Site betikleri (harici kütüphane yok)
   Her bölüm bağımsızdır; bir özelliği istemiyorsanız ilgili bloğu silebilirsiniz.
   ========================================================= */
(function () {
  'use strict';

  var root = document.documentElement;
  // Hareket hassasiyeti ayarı açıksa animasyonları azalt
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // Fare/touchpad gibi hassas işaretçi var mı? (dokunmatikte eğim/mıknatıs efekti kapalı)
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  function clamp(v, min, max) { return Math.min(Math.max(v, min), max); }

  /* ---------- 1. Açık / koyu tema ---------- */
  var themeBtn = document.querySelector('.theme-toggle');
  function applyThemeLabel() {
    if (!themeBtn) return;
    var dark = root.getAttribute('data-theme') === 'dark';
    themeBtn.setAttribute('aria-label', dark ? 'Açık temaya geç' : 'Koyu temaya geç');
  }
  if (themeBtn) {
    applyThemeLabel();
    themeBtn.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) {}
      applyThemeLabel();
    });
  }

  /* ---------- 2. Mobil (hamburger) menü ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('ana-menu');

  function setMenu(open) {
    if (!toggle || !nav) return;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Menüyü kapat' : 'Menüyü aç');
    nav.classList.toggle('is-open', open);
  }

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      setMenu(toggle.getAttribute('aria-expanded') !== 'true');
    });
    // Menüdeki bir bağlantıya tıklanınca menüyü kapat
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false);
    });
    // Esc tuşu menüyü kapatır ve odağı butona geri verir
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setMenu(false);
        toggle.focus();
      }
    });
  }

  /* ---------- 3. Aktif menü bağlantısı + kayan çizgi ---------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-list a[href^="#"]:not(.nav-cta)'));
  var indicator = document.querySelector('.nav-indicator');
  var activeLink = null;
  var desktopMq = window.matchMedia('(min-width: 1000px)');

  function moveIndicator(link) {
    if (!indicator || !nav) return;
    if (!link || !desktopMq.matches) { indicator.style.opacity = '0'; return; }
    var navRect = nav.getBoundingClientRect();
    var r = link.getBoundingClientRect();
    indicator.style.width = r.width + 'px';
    indicator.style.transform = 'translateX(' + (r.left - navRect.left) + 'px)';
    indicator.style.opacity = '1';
  }

  function setActive(link) {
    activeLink = link;
    navLinks.forEach(function (a) {
      var on = a === link;
      a.classList.toggle('is-active', on);
      if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
    });
    moveIndicator(link);
  }

  navLinks.forEach(function (a) {
    a.addEventListener('mouseenter', function () { moveIndicator(a); });
    a.addEventListener('mouseleave', function () { moveIndicator(activeLink); });
  });
  window.addEventListener('resize', function () {
    moveIndicator(activeLink);
    if (desktopMq.matches) setMenu(false);
  });

  if ('IntersectionObserver' in window && navLinks.length) {
    var linkFor = {};
    navLinks.forEach(function (a) { linkFor[a.getAttribute('href').slice(1)] = a; });
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        setActive(linkFor[entry.target.id] || null);
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    document.querySelectorAll('main section[id]').forEach(function (s) { sectionObserver.observe(s); });
  }

  /* ---------- 4. Scroll'da beliren öğeler (sıralı gecikme ile) ---------- */
  // data-stagger kapsayıcısındaki .reveal öğelerine sırayla artan gecikme ver
  document.querySelectorAll('[data-stagger]').forEach(function (group) {
    group.querySelectorAll('.reveal').forEach(function (el, i) { el.style.setProperty('--i', i); });
  });

  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { revealObserver.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- 5. Kaydırmaya bağlı efektler (tek döngüde) ----------
     - Menü gölgesi ve ilerleme çubuğu
     - Başa dön butonu ve halkası
     - Zaman çizelgesinin dolması
     - Alıntının kelime kelime aydınlanması */
  var header = document.getElementById('site-header');
  var progressBar = document.querySelector('.scroll-progress');
  var toTop = document.querySelector('.to-top');
  var toTopRing = document.querySelector('.to-top-ring');
  var timeline = document.querySelector('.timeline');
  var timelineItems = timeline ? timeline.querySelectorAll('.timeline-item') : [];

  // Alıntı metnini kelimelere böl
  var quoteWords = [];
  var quote = document.querySelector('[data-word-reveal]');
  if (quote) {
    var words = quote.textContent.trim().split(/\s+/);
    quote.textContent = '';
    words.forEach(function (w, i) {
      var span = document.createElement('span');
      span.className = 'w';
      span.textContent = w;
      quote.appendChild(span);
      if (i < words.length - 1) quote.appendChild(document.createTextNode(' '));
      quoteWords.push(span);
    });
  }

  var ticking = false;
  function onScroll() {
    var y = window.scrollY;
    var vh = window.innerHeight;
    var max = document.documentElement.scrollHeight - vh;
    var p = max > 0 ? clamp(y / max, 0, 1) : 0;

    if (header) header.classList.toggle('is-scrolled', y > 8);
    if (progressBar) progressBar.style.setProperty('--progress', p);
    if (toTop) toTop.classList.toggle('is-visible', y > vh * 0.8);
    if (toTopRing) toTopRing.style.strokeDashoffset = String(1 - p);

    // Zaman çizelgesi: ekranın ortasına göre dolum oranı
    if (timeline) {
      var tr = timeline.getBoundingClientRect();
      var tp = clamp((vh * 0.6 - tr.top) / tr.height, 0, 1);
      timeline.style.setProperty('--progress', tp);
      timelineItems.forEach(function (item) {
        item.classList.toggle('is-active', item.getBoundingClientRect().top < vh * 0.6);
      });
    }

    // Alıntı: bölüm ekrana girdikçe kelimeler sırayla aydınlanır
    if (quote && quoteWords.length) {
      if (reduceMotion) {
        quoteWords.forEach(function (w) { w.classList.add('is-lit'); });
      } else {
        var qr = quote.getBoundingClientRect();
        var qp = clamp((vh * 0.85 - qr.top) / (qr.height + vh * 0.35), 0, 1);
        var lit = Math.ceil(qp * quoteWords.length * 1.15);
        quoteWords.forEach(function (w, i) { w.classList.toggle('is-lit', i < lit); });
      }
    }
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  /* ---------- 6. Hero: altın parçacık ağı (canvas) ---------- */
  var hero = document.getElementById('hero');
  var canvas = document.querySelector('.hero-canvas');
  if (hero && canvas && canvas.getContext) {
    var ctx = canvas.getContext('2d');
    var particles = [];
    var mouse = { x: -9999, y: -9999 };
    var W = 0, H = 0, dpr = 1, running = false, rafId = 0;
    var LINK = 130;          // Noktalar arası bağlantı mesafesi (px)
    var MOUSE_LINK = 170;    // İmlece bağlantı mesafesi (px)

    var resize = function () {
      var rect = hero.getBoundingClientRect();
      var widthChanged = Math.abs(rect.width - W) > 1;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = rect.width; H = rect.height;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Yalnızca yükseklik değiştiyse (ör. mobil adres çubuğu) parçacıkları koru
      if (!widthChanged && particles.length) return;
      // Ekran genişliğine göre parçacık sayısı (performans için sınırlı)
      var count = Math.round(clamp(W / 22, 24, 70));
      particles = [];
      for (var i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          r: Math.random() * 1.6 + 0.6
        });
      }
    };

    var draw = function () {
      ctx.clearRect(0, 0, W, H);
      var i, j, a, b, dx, dy, d;
      for (i = 0; i < particles.length; i++) {
        a = particles[i];
        if (!reduceMotion) {
          a.x += a.vx; a.y += a.vy;
          if (a.x < 0 || a.x > W) a.vx *= -1;
          if (a.y < 0 || a.y > H) a.vy *= -1;
        }
        // Noktalar arası çizgiler
        for (j = i + 1; j < particles.length; j++) {
          b = particles[j];
          dx = a.x - b.x; dy = a.y - b.y;
          d = Math.sqrt(dx * dx + dy * dy);
          if (d < LINK) {
            ctx.strokeStyle = 'rgba(176,141,87,' + (0.22 * (1 - d / LINK)) + ')';
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
        // İmlece çizgiler
        dx = a.x - mouse.x; dy = a.y - mouse.y;
        d = Math.sqrt(dx * dx + dy * dy);
        if (d < MOUSE_LINK) {
          ctx.strokeStyle = 'rgba(230,204,154,' + (0.45 * (1 - d / MOUSE_LINK)) + ')';
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
        }
        ctx.fillStyle = 'rgba(214,186,138,.75)';
        ctx.beginPath(); ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2); ctx.fill();
      }
    };

    var loop = function () {
      draw();
      if (running) rafId = requestAnimationFrame(loop);
    };
    var start = function () {
      if (running || reduceMotion) return;
      running = true; rafId = requestAnimationFrame(loop);
    };
    var stop = function () { running = false; cancelAnimationFrame(rafId); };

    resize();
    draw(); // Hareket azaltma açıksa tek bir sabit kare çizilir
    // Hero boyutu değişince (pencere, yazı tipi yüklenmesi vb.) tuvali güncelle
    if ('ResizeObserver' in window) {
      new ResizeObserver(function () { resize(); draw(); }).observe(hero);
    } else {
      window.addEventListener('resize', function () { resize(); draw(); });
    }

    if (finePointer) {
      hero.addEventListener('pointermove', function (e) {
        var r = hero.getBoundingClientRect();
        mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
      });
      hero.addEventListener('pointerleave', function () { mouse.x = mouse.y = -9999; });
    }

    // Hero ekranda değilse veya sekme gizliyse animasyonu durdur (pil/işlemci tasarrufu)
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting && !document.hidden) start(); else stop();
      }).observe(hero);
    } else {
      start();
    }
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stop();
      else if (hero.getBoundingClientRect().bottom > 0) start();
    });
  }

  /* ---------- 7. Hero: daktilo efekti ---------- */
  var typer = document.querySelector('.typer');
  if (typer && !reduceMotion) {
    var phrases = (typer.getAttribute('data-words') || '').split('|').filter(Boolean);
    var pi = 0, ci = phrases[0] ? phrases[0].length : 0, deleting = false;
    var tick = function () {
      var word = phrases[pi];
      if (deleting) {
        ci--;
        typer.textContent = word.slice(0, ci);
        if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; setTimeout(tick, 350); return; }
        setTimeout(tick, 32);
      } else {
        ci++;
        typer.textContent = word.slice(0, ci);
        if (ci === word.length) { deleting = true; setTimeout(tick, 2400); return; }
        setTimeout(tick, 65);
      }
    };
    if (phrases.length > 1) { deleting = true; setTimeout(tick, 3200); }
  }

  /* ---------- 8. Mıknatıs etkili butonlar ---------- */
  if (finePointer && !reduceMotion) {
    document.querySelectorAll('[data-magnetic]').forEach(function (btn) {
      btn.addEventListener('pointermove', function (e) {
        var r = btn.getBoundingClientRect();
        var x = (e.clientX - r.left - r.width / 2) * 0.22;
        var y = (e.clientY - r.top - r.height / 2) * 0.35;
        btn.style.transform = 'translate(' + x + 'px,' + y + 'px)';
      });
      btn.addEventListener('pointerleave', function () { btn.style.transform = ''; });
    });
  }

  /* ---------- 9. Kartlarda 3D eğim + imleci takip eden ışık ---------- */
  document.querySelectorAll('[data-tilt]').forEach(function (card) {
    card.addEventListener('pointermove', function (e) {
      var r = card.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width;
      var y = (e.clientY - r.top) / r.height;
      card.style.setProperty('--mx', (x * 100) + '%');
      card.style.setProperty('--my', (y * 100) + '%');
      if (finePointer && !reduceMotion) {
        card.style.transform = 'perspective(900px) rotateX(' + ((0.5 - y) * 7) + 'deg) rotateY(' + ((x - 0.5) * 9) + 'deg) translateY(-6px)';
      }
    });
    card.addEventListener('pointerleave', function () { card.style.transform = ''; });
  });

  /* ---------- 10. Harita: tıklanınca yükle (gizlilik dostu) ---------- */
  var map = document.querySelector('[data-map]');
  if (map) {
    var loadBtn = map.querySelector('[data-map-load]');
    if (loadBtn) {
      loadBtn.addEventListener('click', function () {
        var src = map.getAttribute('data-src');
        // Yer tutucu hâlâ duruyorsa uyar
        if (!src || src.indexOf('[') === 0) {
          loadBtn.textContent = 'Harita adresi henüz eklenmedi';
          loadBtn.disabled = true;
          return;
        }
        var iframe = document.createElement('iframe');
        iframe.src = src;
        iframe.title = 'Konum – Google Haritalar';
        iframe.loading = 'lazy';
        iframe.referrerPolicy = 'no-referrer-when-downgrade';
        iframe.setAttribute('allowfullscreen', '');
        map.innerHTML = '';
        map.appendChild(iframe);
      });
    }
  }

  /* ---------- 11. Kısa bildirim (toast) ---------- */
  var toastEl = document.querySelector('.toast');
  var toastTimer = 0;
  function showToast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('is-visible'); }, 2600);
  }

  /* ---------- 12. Panoya kopyala (e-posta) ---------- */
  document.querySelectorAll('[data-copy]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var text = btn.getAttribute('data-copy');
      var done = function () { showToast('E-posta adresi kopyalandı'); };
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(done, function () { showToast('Kopyalanamadı'); });
      } else {
        // Eski tarayıcılar için yedek yöntem
        var ta = document.createElement('textarea');
        ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'absolute'; ta.style.left = '-9999px';
        document.body.appendChild(ta); ta.select();
        try { document.execCommand('copy'); done(); } catch (e) { showToast('Kopyalanamadı'); }
        document.body.removeChild(ta);
      }
    });
  });

  /* ---------- 13. İletişim formu: doğrulama + Formspree ---------- */
  var form = document.getElementById('contact-form');
  if (form) {
    var statusEl = document.getElementById('form-status');
    var submitBtn = form.querySelector('.btn-submit');
    var successPanel = form.querySelector('.form-success');
    var message = document.getElementById('mesaj');
    var counter = document.getElementById('mesaj-sayac');
    var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    var phoneRe = /^[0-9+()\s-]{10,20}$/;

    // Karakter sayacı
    var updateCount = function () {
      if (!message || !counter) return;
      var max = message.maxLength > 0 ? message.maxLength : 2000;
      counter.textContent = message.value.length + ' / ' + max;
      counter.classList.toggle('is-near', message.value.length > max * 0.9);
    };
    if (message) message.addEventListener('input', updateCount);

    // Her alan için kural ve hata mesajı
    var rules = {
      ad: function (v) { return v.trim().length >= 3 ? '' : 'Lütfen adınızı ve soyadınızı yazın.'; },
      eposta: function (v) {
        if (!v.trim()) return 'Lütfen e-posta adresinizi yazın.';
        return emailRe.test(v.trim()) ? '' : 'Lütfen geçerli bir e-posta adresi yazın.';
      },
      telefon: function (v) { return !v.trim() || phoneRe.test(v.trim()) ? '' : 'Lütfen geçerli bir telefon numarası yazın.'; },
      mesaj: function (v) { return v.trim().length >= 20 ? '' : 'Mesajınız en az 20 karakter olmalıdır.'; },
      kvkk: function (_, el) { return el.checked ? '' : 'Devam etmek için KVKK onay kutusunu işaretleyin.'; }
    };

    var validateField = function (id) {
      var el = document.getElementById(id);
      var errEl = document.getElementById(id + '-hata');
      var msg = rules[id](el.value, el);
      el.setAttribute('aria-invalid', msg ? 'true' : 'false');
      if (errEl) errEl.textContent = msg;
      return !msg;
    };

    // Alandan çıkınca (blur) kontrol et; hata varsa yazarken güncelle
    Object.keys(rules).forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      // Boş alandan sadece geçip gitmek hata göstermesin; onay kutusu gönderimde kontrol edilir
      el.addEventListener('blur', function () { if (el.type !== 'checkbox' && el.value) validateField(id); });
      el.addEventListener(el.type === 'checkbox' ? 'change' : 'input', function () {
        if (el.getAttribute('aria-invalid') === 'true') validateField(id);
      });
    });

    var setStatus = function (msg, type) {
      statusEl.textContent = msg;
      statusEl.className = 'form-status' + (type ? ' is-' + type : '');
    };
    var setLoading = function (on) {
      submitBtn.disabled = on;
      submitBtn.classList.toggle('is-loading', on);
      submitBtn.querySelector('.btn-label').textContent = on ? 'Gönderiliyor…' : 'Gönder';
    };

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      setStatus('', '');

      var firstInvalid = null;
      Object.keys(rules).forEach(function (id) {
        if (!validateField(id) && !firstInvalid) firstInvalid = document.getElementById(id);
      });
      if (firstInvalid) { firstInvalid.focus(); return; }

      // Formspree kimliği girilmemişse uyar
      if (form.action.indexOf('YOUR_FORM_ID') !== -1) {
        setStatus('Form henüz yapılandırılmadı (Formspree form kimliği eklenmeli).', 'error');
        return;
      }

      setLoading(true);
      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      }).then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        form.reset();
        updateCount();
        form.querySelectorAll('[aria-invalid]').forEach(function (el) { el.removeAttribute('aria-invalid'); });
        // Başarı panelini göster ve odağı oraya taşı
        successPanel.hidden = false;
        form.classList.add('is-sent');
        successPanel.querySelector('h3').focus();
      }).catch(function () {
        setStatus('Mesaj gönderilemedi. Lütfen daha sonra tekrar deneyin veya telefon/e-posta ile ulaşın.', 'error');
      }).finally(function () {
        setLoading(false);
      });
    });

    // "Yeni mesaj gönder" butonu formu geri getirir
    var resetBtn = form.querySelector('[data-form-reset]');
    if (resetBtn) {
      resetBtn.addEventListener('click', function () {
        form.classList.remove('is-sent');
        successPanel.hidden = true;
        document.getElementById('ad').focus();
      });
    }
  }

  /* ---------- 14. Footer'daki yılı otomatik güncelle ---------- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
