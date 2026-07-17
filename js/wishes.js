document.addEventListener('DOMContentLoaded', function () {
  var form = document.getElementById('wish-form');
  var wallEl = document.getElementById('wishes-wall');
  var statusEl = document.getElementById('wish-status');

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function renderWishes(wishes) {
    if (!wallEl) return;
    if (!wishes.length) {
      wallEl.innerHTML = '<p class="center" style="grid-column:1/-1; color:var(--plum-soft);">Be the first to leave a wish for her.</p>';
      return;
    }
    wallEl.innerHTML = wishes.map(function (w) {
      var photoHtml = w.photo_url
        ? '<div class="wish-photo"><img src="' + w.photo_url + '" alt="Photo shared with a wish" loading="lazy"></div>'
        : '';
      return (
        '<div class="wish-card">' +
          photoHtml +
          '<div class="wish-seal">O</div>' +
          '<p class="wish-message">"' + escapeHtml(w.message) + '"</p>' +
          '<div class="wish-from">— ' + escapeHtml(w.name) + '</div>' +
        '</div>'
      );
    }).join('');
  }

  async function loadWishes() {
    if (!wallEl) return;
    try {
      var result = await supabaseClient
        .from('wishes')
        .select('*')
        .order('created_at', { ascending: false });
      if (result.error) throw result.error;
      renderWishes(result.data || []);
    } catch (err) {
      console.error('Failed to load wishes:', err);
      wallEl.innerHTML = '<p class="center" style="grid-column:1/-1; color:var(--plum-soft);">Could not load wishes right now — please refresh the page.</p>';
    }
  }

  if (form) {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      var nameInput = document.getElementById('wish-name');
      var messageInput = document.getElementById('wish-message');
      var submitBtn = form.querySelector('button[type=submit]');

      var name = nameInput.value.trim();
      var message = messageInput.value.trim();
      if (!name || !message) return;

      var originalBtnText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';
      statusEl.textContent = '';

      try {
        var insertResult = await supabaseClient.from('wishes').insert({
          name: name,
          message: message
        });
        if (insertResult.error) throw insertResult.error;

        form.reset();
        statusEl.textContent = 'Thank you — your wish is now on the wall below.';
        loadWishes();
      } catch (err) {
        console.error('Failed to submit wish:', err);
        statusEl.textContent = err.message || 'Something went wrong sending your wish. Please try again.';
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
      }
    });
  }

  loadWishes();
});
