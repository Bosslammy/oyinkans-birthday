document.addEventListener('DOMContentLoaded', function () {
  var audio = document.getElementById('bg-music');
  var toggle = document.getElementById('music-toggle');
  if (!audio || !toggle) return;

  var MUTE_KEY = 'oyin-music-muted';
  var userMuted = localStorage.getItem(MUTE_KEY) === 'true';
  var TARGET_VOLUME = 0.55;
  var FADE_MS = 1800;

  function setPlayingUI(isPlaying) {
    toggle.classList.toggle('is-playing', isPlaying);
    toggle.setAttribute('aria-label', isPlaying ? 'Pause music' : 'Play music');
  }

  function fadeIn() {
    audio.volume = 0;
    var start = null;
    function step(timestamp) {
      if (start === null) start = timestamp;
      var progress = Math.min((timestamp - start) / FADE_MS, 1);
      audio.volume = TARGET_VOLUME * progress;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function startPlayback() {
    fadeIn();
    return audio.play().then(function () { setPlayingUI(true); });
  }

  function tryAutoplay() {
    if (userMuted) return;
    var playPromise = startPlayback();
    if (playPromise && playPromise.catch) {
      playPromise.catch(function () {
        // Autoplay blocked — wait for the first tap/click anywhere on the page
        setPlayingUI(false);
        var startOnInteraction = function (e) {
          if (e.target && e.target.closest && e.target.closest('#music-toggle')) return;
          if (!userMuted) {
            startPlayback().catch(function () {});
          }
          document.removeEventListener('click', startOnInteraction);
          document.removeEventListener('touchstart', startOnInteraction);
        };
        document.addEventListener('click', startOnInteraction);
        document.addEventListener('touchstart', startOnInteraction);
      });
    }
  }

  toggle.addEventListener('click', function () {
    if (audio.paused) {
      userMuted = false;
      localStorage.setItem(MUTE_KEY, 'false');
      startPlayback().catch(function () {});
    } else {
      userMuted = true;
      localStorage.setItem(MUTE_KEY, 'true');
      audio.pause();
      setPlayingUI(false);
    }
  });

  audio.volume = TARGET_VOLUME;
  tryAutoplay();
});
