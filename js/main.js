// Mobile nav toggle
document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      links.classList.toggle('open');
    });
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { links.classList.remove('open'); });
    });
  }

  // Scroll reveal
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    reveals.forEach(function (el) { obs.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  // Countdown to birthday
  var countdownEl = document.getElementById('countdown');
  if (countdownEl) {
    var target = new Date('2026-07-31T00:00:00+01:00').getTime();
    function tick() {
      var now = Date.now();
      var diff = Math.max(0, target - now);
      var d = Math.floor(diff / (1000 * 60 * 60 * 24));
      var h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      var m = Math.floor((diff / (1000 * 60)) % 60);
      var s = Math.floor((diff / 1000) % 60);
      var set = function (id, val) {
        var el = document.getElementById(id);
        if (el) el.textContent = String(val).padStart(2, '0');
      };
      set('cd-days', d);
      set('cd-hours', h);
      set('cd-mins', m);
      set('cd-secs', s);
      if (diff <= 0) {
        countdownEl.querySelector('.eyebrow-days') && (countdownEl.querySelector('.eyebrow-days').textContent = "It's her day!");
      }
    }
    tick();
    setInterval(tick, 1000);
  }

  // Lightbox (event delegation so dynamically-added photos work too)
  var lightbox = document.getElementById('lightbox');
  if (lightbox) {
    var lightboxImg = lightbox.querySelector('img');
    document.addEventListener('click', function (e) {
      var item = e.target.closest ? e.target.closest('[data-lightbox]') : null;
      if (item) {
        lightboxImg.setAttribute('src', item.getAttribute('data-lightbox'));
        lightbox.classList.add('open');
      }
    });
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox || e.target.classList.contains('lightbox-close')) {
        lightbox.classList.remove('open');
        lightboxImg.setAttribute('src', '');
      }

    });
  }

  // Copy to clipboard
  document.querySelectorAll('.copy-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var text = btn.getAttribute('data-copy');
      navigator.clipboard.writeText(text).then(function () {
        var original = btn.textContent;
        btn.textContent = 'Copied';
        btn.classList.add('copied');
        setTimeout(function () {
          btn.textContent = original;
          btn.classList.remove('copied');
        }, 1800);
      });
    });
  });

  // Wish photo filename preview
  var fileInput = document.getElementById('wish-photo-input');
  var fileLabel = document.getElementById('wish-photo-filename');
  if (fileInput && fileLabel) {
    fileInput.addEventListener('change', function () {
      fileLabel.textContent = fileInput.files.length ? fileInput.files[0].name : 'No file chosen';
    });
  }
});
