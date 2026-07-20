document.addEventListener('DOMContentLoaded', function () {
  var grid = document.getElementById('gallery-grid');
  var viewMoreBtn = document.getElementById('view-more-photos');
  var form = document.getElementById('gallery-upload-form');
  var statusEl = document.getElementById('gallery-status');
  var fileInput = document.getElementById('gallery-photo-input');
  var fileLabel = document.getElementById('gallery-photo-filename');

  var PAGE_SIZE = 9;
  var visibleCount = PAGE_SIZE;

  // The three original seed photos, always shown first
  var SEED_PHOTOS = [
    { url: 'images/hero-oyin.jpg', alt: 'Oyinkansola', wide: true },
    { url: 'images/portrait-oyin.jpg', alt: 'Oyinkansola portrait' },
    { url: 'images/couple-oyin-olamide.jpg', alt: 'Oyinkansola and Olamide' }
  ];

  var allPhotos = SEED_PHOTOS.slice();

  if (fileInput && fileLabel) {
    fileInput.addEventListener('change', function () {
      fileLabel.textContent = fileInput.files.length ? fileInput.files[0].name : 'No file chosen';
    });
  }

  function updateViewMoreButton() {
    if (!viewMoreBtn) return;
    var remaining = allPhotos.length - visibleCount;
    if (remaining <= 0) {
      viewMoreBtn.style.display = 'none';
    } else {
      viewMoreBtn.style.display = 'inline-flex';
      viewMoreBtn.textContent = 'View More Photos (' + remaining + ' more)';
    }
  }

  function renderGrid() {
    if (!grid) return;
    var toShow = allPhotos.slice(0, visibleCount);
    grid.innerHTML = toShow.map(function (photo) {
      var wideClass = photo.wide ? ' wide' : '';
      var alt = photo.alt || 'Shared photo';
      return (
        '<div class="gallery-item' + wideClass + '" data-lightbox="' + photo.url + '">' +
          '<img src="' + photo.url + '" alt="' + alt.replace(/"/g, '') + '" loading="lazy">' +
        '</div>'
      );
    }).join('');
    updateViewMoreButton();
  }

  async function loadGalleryPhotos() {
    try {
      var result = await supabaseClient
        .from('gallery_photos')
        .select('*')
        .order('created_at', { ascending: false });
      if (result.error) throw result.error;
      (result.data || []).forEach(function (photo) {
        allPhotos.push({ url: photo.photo_url, alt: 'Shared photo' });
      });
    } catch (err) {
      console.error('Failed to load gallery photos:', err);
    } finally {
      renderGrid();
    }
  }

  if (viewMoreBtn) {
    viewMoreBtn.addEventListener('click', function () {
      visibleCount += PAGE_SIZE;
      renderGrid();
    });
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

        allPhotos.splice(SEED_PHOTOS.length, 0, { url: publicUrl, alt: 'Shared photo' });
        visibleCount += 1;
        renderGrid();

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

  renderGrid();
  loadGalleryPhotos();
});
