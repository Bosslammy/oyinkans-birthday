document.addEventListener('DOMContentLoaded', function () {
  var grid = document.getElementById('gallery-grid');
  var form = document.getElementById('gallery-upload-form');
  var statusEl = document.getElementById('gallery-status');
  var fileInput = document.getElementById('gallery-photo-input');
  var fileLabel = document.getElementById('gallery-photo-filename');

  if (fileInput && fileLabel) {
    fileInput.addEventListener('change', function () {
      fileLabel.textContent = fileInput.files.length ? fileInput.files[0].name : 'No file chosen';
    });
  }

  function addGalleryItem(url, prepend) {
    if (!grid) return;
    var item = document.createElement('div');
    item.className = 'gallery-item reveal in';
    item.setAttribute('data-lightbox', url);
    item.innerHTML = '<img src="' + url + '" alt="Shared photo" loading="lazy">';
    if (prepend) {
      grid.prepend(item);
    } else {
      grid.appendChild(item);
    }
  }

  async function loadGalleryPhotos() {
    if (!grid) return;
    try {
      var result = await supabaseClient
        .from('gallery_photos')
        .select('*')
        .order('created_at', { ascending: false });
      if (result.error) throw result.error;
      (result.data || []).forEach(function (photo) {
        addGalleryItem(photo.photo_url, false);
      });
    } catch (err) {
      console.error('Failed to load gallery photos:', err);
    }
  }

  if (form) {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      var nameInput = document.getElementById('gallery-uploader-name');
      var submitBtn = form.querySelector('button[type=submit]');
      var file = fileInput.files[0];
      if (!file) return;

      if (file.size > 10 * 1024 * 1024) {
        statusEl.textContent = 'Photo is too large — please use one under 10MB.';
        return;
      }

      var originalBtnText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Uploading…';
      statusEl.textContent = '';

      try {
        var ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
        var path = Date.now() + '-' + Math.random().toString(36).slice(2) + '.' + ext;

        var uploadResult = await supabaseClient.storage.from('gallery-photos').upload(path, file);
        if (uploadResult.error) throw uploadResult.error;

        var urlResult = supabaseClient.storage.from('gallery-photos').getPublicUrl(path);
        var publicUrl = urlResult.data.publicUrl;

        var insertResult = await supabaseClient.from('gallery_photos').insert({
          photo_url: publicUrl,
          uploader_name: nameInput.value.trim() || null
        });
        if (insertResult.error) throw insertResult.error;

        addGalleryItem(publicUrl, true);
        form.reset();
        fileLabel.textContent = 'No file chosen';
        statusEl.textContent = 'Thank you — your photo has been added to the gallery.';
      } catch (err) {
        console.error('Failed to upload gallery photo:', err);
        statusEl.textContent = err.message || 'Something went wrong uploading your photo. Please try again.';
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
      }
    });
  }

  loadGalleryPhotos();
});
