// ==============================================================================
// 💖 JAVASCRIPT LOGIC - LOVE & MAGIC ✨
// ==============================================================================

(function() {
  'use strict';

  // 1. DATA STATE & LOCAL STORAGE MERGING
  let appData = null;
  const STORAGE_KEY = 'ANTIGRAVITY_LOVE_DATA_V13';
  const PHOTOS_STORAGE_KEY = 'ANTIGRAVITY_LOVE_PHOTOS_V1';

  function initData() {
    // Clone config
    const baseConfig = typeof LOVE_CONFIG !== 'undefined' ? JSON.parse(JSON.stringify(LOVE_CONFIG)) : {};
    const saved = localStorage.getItem(STORAGE_KEY);
    
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        appData = { ...baseConfig, ...parsed, couple: { ...baseConfig.couple, ...parsed.couple } };
      } catch (e) {
        console.error("Could not parse saved storage data", e);
        appData = baseConfig;
      }
    } else {
      appData = baseConfig;
    }

    // Merge saved custom uploaded photos if any
    const savedPhotos = localStorage.getItem(PHOTOS_STORAGE_KEY);
    if (savedPhotos) {
      try {
        const parsedPhotos = JSON.parse(savedPhotos);
        if (Array.isArray(parsedPhotos)) {
          appData.gallery = [...parsedPhotos, ...(appData.gallery || [])];
        }
      } catch (e) {
        console.error("Could not parse saved photos", e);
      }
    }
  }

  // 2. DOM POPULATION
  function renderAll() {
    initData();
    renderHeroAndHeader();
    renderLoveLetter();
    renderFavorites();
    renderGallery();
    renderTimeline();
    renderLoveJar();
    renderProposalQuestion();
    renderFooter();
    initAudio();
  }

  // Render Hero & Header
  function renderHeroAndHeader() {
    const couple = appData.couple || {};
    
    // Couple monogram (Fixed A & N)
    const monogramEl = document.getElementById('couple-monogram');
    if (monogramEl) {
      monogramEl.textContent = "A & N";
    }

    // Tagline & Headings
    const taglineEl = document.getElementById('hero-tagline');
    if (taglineEl) taglineEl.textContent = couple.tagline || `To ${couple.wifeName}, My Forever Love`;

    const headingEl = document.getElementById('hero-heading');
    if (headingEl) {
      headingEl.innerHTML = `Every Love Story Is Beautiful,<br><span class="gradient-text">${couple.heroHeading || 'But Ours Is My Favorite'}</span>`;
    }

    const subtextEl = document.getElementById('hero-subtext');
    if (subtextEl) subtextEl.textContent = couple.heroSubtext || '';

    // Update document title
    document.title = `${couple.wifeName || 'My Wifey'} & ${couple.husbandName || 'Me'} ❤️`;
  }

  // Render Love Letter
  function renderLoveLetter() {
    const letter = appData.loveLetter || {};
    const dateText = letter.date || 'Forever & Always';
    const salutationText = letter.salutation || `Meri Pyaari ${appData.couple.wifeName},`;
    const paragraphsHtml = Array.isArray(letter.paragraphs) 
      ? letter.paragraphs.map(p => `<p>${p}</p>`).join('')
      : '';
    const closingText = letter.closing || 'With all my love & heart,';
    const signatureText = letter.signature || `Yours Always, ${appData.couple.husbandName} ❤️`;

    // Envelope preview letter
    const dateEl = document.getElementById('letter-date');
    if (dateEl) dateEl.textContent = dateText;
    const salutationEl = document.getElementById('letter-salutation');
    if (salutationEl) salutationEl.textContent = salutationText;
    const bodyEl = document.getElementById('letter-body');
    if (bodyEl) bodyEl.innerHTML = paragraphsHtml;
    const closingEl = document.getElementById('letter-closing');
    if (closingEl) closingEl.textContent = closingText;
    const signatureEl = document.getElementById('letter-signature');
    if (signatureEl) signatureEl.textContent = signatureText;

    // Fullscreen letter modal
    const fsDateEl = document.getElementById('fullscreen-letter-date');
    if (fsDateEl) fsDateEl.textContent = dateText;
    const fsSalutationEl = document.getElementById('fullscreen-letter-salutation');
    if (fsSalutationEl) fsSalutationEl.textContent = salutationText;
    const fsBodyEl = document.getElementById('fullscreen-letter-body');
    if (fsBodyEl) fsBodyEl.innerHTML = paragraphsHtml;
    const fsClosingEl = document.getElementById('fullscreen-letter-closing');
    if (fsClosingEl) fsClosingEl.textContent = closingText;
    const fsSignatureEl = document.getElementById('fullscreen-letter-signature');
    if (fsSignatureEl) fsSignatureEl.textContent = signatureText;
  }

  // Render Her Favorites Section
  function renderFavorites() {
    const container = document.getElementById('favorites-container');
    if (!container) return;

    const favorites = appData.herFavorites || [];
    container.innerHTML = favorites.map(cat => {
      const itemsHtml = (cat.items || []).map(item => `
        <li class="fav-item">
          <span class="fav-item-bullet">✦</span>
          <div class="fav-item-content">
            <strong>${item.name}</strong>
            ${item.note ? `<span>${item.note}</span>` : ''}
          </div>
        </li>
      `).join('');

      return `
        <div class="favorite-card">
          <div class="card-top">
            <div class="card-icon-bubble">${cat.icon || '🌸'}</div>
            <div>
              <h3 class="card-title">${cat.category}</h3>
            </div>
          </div>
          ${cat.description ? `<p class="card-desc">${cat.description}</p>` : ''}
          <ul class="fav-items-list">
            ${itemsHtml}
          </ul>
        </div>
      `;
    }).join('');
  }

  // Render Polaroid Gallery
  let activeFilter = 'all';

  function renderGallery() {
    const grid = document.getElementById('polaroid-grid');
    const filterContainer = document.getElementById('gallery-filters');
    if (!grid) return;

    const items = appData.gallery || [];

    // Extract unique tags
    const tags = ['all', ...new Set(items.map(item => (item.tag || 'Moments').trim()))];
    if (filterContainer) {
      filterContainer.innerHTML = tags.map(t => `
        <button class="filter-btn ${t === activeFilter ? 'active' : ''}" data-filter="${t}">
          ${t.charAt(0).toUpperCase() + t.slice(1)}
        </button>
      `).join('');

      // Add filter events
      filterContainer.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          activeFilter = e.currentTarget.getAttribute('data-filter');
          filterContainer.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
          e.currentTarget.classList.add('active');
          renderPolaroids();
        });
      });
    }

    renderPolaroids();
  }

  function renderPolaroids() {
    const grid = document.getElementById('polaroid-grid');
    if (!grid) return;

    const items = appData.gallery || [];
    const filtered = activeFilter === 'all' 
      ? items 
      : items.filter(item => (item.tag || 'Moments').toLowerCase() === activeFilter.toLowerCase());

    if (filtered.length === 0) {
      grid.innerHTML = `<div style="grid-column: 1/-1; text-align:center; padding: 40px; color: var(--text-dim);">No photos found in this category yet. Click 'Add Our New Photo' above to add one! 📸</div>`;
      return;
    }

    grid.innerHTML = filtered.map((photo, index) => `
      <div class="polaroid-card" data-index="${index}">
        <div class="polaroid-tape"></div>
        <div class="polaroid-img-wrapper">
          <img src="${photo.src}" alt="${photo.title || 'Couple Photo'}" loading="lazy" onerror="this.src='assets/images/photo1.svg'">
          ${photo.tag ? `<span class="polaroid-badge">${photo.tag}</span>` : ''}
        </div>
        <div class="polaroid-caption-area">
          <h4 class="polaroid-title">${photo.title || 'Special Memory'}</h4>
          <p class="polaroid-caption">${photo.caption || ''}</p>
          ${photo.date ? `<span class="polaroid-date">📅 ${photo.date}</span>` : ''}
        </div>
      </div>
    `).join('');

    // Attach lightbox click handlers
    grid.querySelectorAll('.polaroid-card').forEach((card, idx) => {
      card.addEventListener('click', () => {
        openLightbox(filtered[idx]);
      });
    });
  }

  // Lightbox Modal
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxDesc = document.getElementById('lightbox-desc');
  const lightboxDate = document.getElementById('lightbox-date');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxBackdrop = document.getElementById('lightbox-backdrop');

  function openLightbox(photo) {
    if (!lightboxModal) return;
    lightboxImg.src = photo.src;
    lightboxTitle.textContent = photo.title || 'Our Sweet Memory';
    lightboxDesc.textContent = photo.caption || '';
    lightboxDate.textContent = photo.date ? `📅 ${photo.date}` : '';
    lightboxModal.classList.add('active');
  }

  function closeLightbox() {
    if (lightboxModal) lightboxModal.classList.remove('active');
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);

  // Render Timeline
  function renderTimeline() {
    const wrapper = document.getElementById('timeline-wrapper');
    if (!wrapper) return;

    const timeline = appData.timeline || [];
    wrapper.innerHTML = timeline.map((item, idx) => {
      const isEven = idx % 2 === 0;
      const sideClass = isEven ? 'left' : 'right';

      return `
        <div class="timeline-item ${sideClass}">
          <div class="timeline-node">${item.icon || '❤️'}</div>
          <div class="timeline-card">
            ${item.badge ? `<span class="timeline-badge">${item.badge}</span>` : ''}
            <div class="timeline-date">${item.date || ''}</div>
            <h3 class="timeline-title">${item.title}</h3>
            <p class="timeline-desc">${item.description}</p>
          </div>
        </div>
      `;
    }).join('');
  }

  // Render Love Jar
  let reasonIndex = 0;
  function renderLoveJar() {
    const jarEl = document.getElementById('jar-clickable');
    const noteCard = document.getElementById('love-note-card');
    const noteText = document.getElementById('note-text');
    const noteCounter = document.getElementById('note-counter');
    const nextBtn = document.getElementById('next-reason-btn');

    const reasons = appData.loveReasons || [
      "Your smile lights up my whole world.",
      "The way you make every simple moment magical."
    ];

    function showReason(index) {
      if (!noteText || !noteCounter) return;
      const safeIndex = index % reasons.length;
      noteCounter.textContent = `Reason #${safeIndex + 1} of ${reasons.length}`;
      noteText.style.opacity = '0';
      noteText.style.transform = 'translateY(10px)';

      setTimeout(() => {
        noteText.textContent = `"${reasons[safeIndex]}"`;
        noteText.style.transition = 'all 0.35s ease';
        noteText.style.opacity = '1';
        noteText.style.transform = 'translateY(0)';
      }, 150);

      // Trigger micro confetti from jar
      if (typeof confetti === 'function') {
        confetti({
          particleCount: 15,
          spread: 40,
          origin: { y: 0.7 },
          colors: ['#ff4d6d', '#ffd166', '#ff758c']
        });
      }
    }

    if (jarEl) {
      jarEl.addEventListener('click', () => {
        reasonIndex = (reasonIndex + 1) % reasons.length;
        showReason(reasonIndex);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        reasonIndex = (reasonIndex + 1) % reasons.length;
        showReason(reasonIndex);
      });
    }

    // Initial show
    showReason(0);
  }

  // Render Proposal Question & Runaway Button
  function renderProposalQuestion() {
    const qData = appData.interactiveQuestion || {};
    const questionEl = document.getElementById('proposal-question');
    const subEl = document.getElementById('proposal-sub');
    const yesBtnText = document.getElementById('yes-button-text');
    const noBtnText = document.getElementById('no-button-text');
    const successHeading = document.getElementById('success-heading');
    const successMessage = document.getElementById('success-message');

    if (questionEl && qData.question) questionEl.textContent = qData.question;
    if (subEl && qData.subQuestion) subEl.textContent = qData.subQuestion;
    if (yesBtnText && qData.yesButtonText) yesBtnText.textContent = qData.yesButtonText;
    if (noBtnText && qData.noButtonText) noBtnText.textContent = qData.noButtonText;
    if (successHeading && qData.successHeading) successHeading.textContent = qData.successHeading;
    if (successMessage && qData.successMessage) successMessage.textContent = qData.successMessage;

    const yesBtn = document.getElementById('yes-button');
    const noBtn = document.getElementById('no-button');
    const successCard = document.getElementById('success-card');
    const buttonArena = document.getElementById('button-arena');

    // Runaway "No" Button Logic
    function dodgeNoButton(e) {
      if (!noBtn || !buttonArena) return;
      if (e) e.preventDefault();

      const arenaRect = buttonArena.getBoundingClientRect();
      const btnRect = noBtn.getBoundingClientRect();

      // Calculate maximum allowed X and Y offsets within relative bounding area
      const maxX = (arenaRect.width / 2) - 60;
      const maxY = 60;

      // Random position with direction flips
      const randomX = (Math.random() * (maxX * 2)) - maxX;
      const randomY = (Math.random() * (maxY * 2)) - maxY;

      noBtn.style.position = 'relative';
      noBtn.style.transform = `translate(${randomX}px, ${randomY}px)`;
    }

    if (noBtn) {
      noBtn.addEventListener('mouseenter', dodgeNoButton);
      noBtn.addEventListener('touchstart', dodgeNoButton, { passive: false });
      noBtn.addEventListener('click', (e) => {
        dodgeNoButton(e);
      });
    }

    // "Yes" Click Celebration!
    if (yesBtn) {
      yesBtn.addEventListener('click', () => {
        if (successCard) {
          successCard.classList.remove('hidden');
          successCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        // Full Screen Confetti Cannons!
        if (typeof confetti === 'function') {
          // Cannon 1
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });

          // Extended Romantic Burst
          const duration = 3 * 1000;
          const end = Date.now() + duration;

          (function frame() {
            confetti({
              particleCount: 4,
              angle: 60,
              spread: 55,
              origin: { x: 0 },
              colors: ['#ff4d6d', '#ffd166', '#ff758c', '#ffffff']
            });
            confetti({
              particleCount: 4,
              angle: 120,
              spread: 55,
              origin: { x: 1 },
              colors: ['#ff4d6d', '#ffd166', '#ff758c', '#ffffff']
            });

            if (Date.now() < end) {
              requestAnimationFrame(frame);
            }
          }());
        }
      });
    }
  }

  // Render Footer
  function renderFooter() {
    const husband = document.getElementById('footer-husband');
    const wife = document.getElementById('footer-wife');
    if (husband) husband.textContent = appData.couple.husbandName || 'Avinash';
    if (wife) wife.textContent = appData.couple.wifeName || 'Udbilao';
  }

  // 3. INTERACTIVE ENVELOPE & FULLSCREEN LOVE LETTER
  function initEnvelope() {
    const envelope = document.getElementById('envelope-trigger');
    const modal = document.getElementById('fullscreen-letter-modal');
    const closeBtn = document.getElementById('letter-modal-close');
    const backdrop = document.getElementById('letter-modal-backdrop');
    const letterSection = document.getElementById('letter-section');

    function openFullscreenLetter() {
      if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // prevent background body scroll
      }
    }

    function closeFullscreenLetter() {
      if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
      if (envelope) {
        envelope.classList.remove('opened');
      }
      // Return user smoothly right to where the mailbox is!
      if (letterSection) {
        letterSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }

    if (envelope) {
      envelope.addEventListener('click', (e) => {
        envelope.classList.add('opened');

        if (typeof confetti === 'function') {
          confetti({
            particleCount: 45,
            spread: 70,
            origin: { y: 0.5 },
            colors: ['#ff4d6d', '#ffffff', '#ffd166']
          });
        }

        // Open fullscreen letter after envelope flap animation
        setTimeout(() => {
          openFullscreenLetter();
        }, 400);
      });
    }

    if (closeBtn) closeBtn.addEventListener('click', closeFullscreenLetter);
    if (backdrop) backdrop.addEventListener('click', closeFullscreenLetter);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
        closeFullscreenLetter();
      }
    });
  }

  // 4. LIVE LOVE CLOCK / ANNIVERSARY COUNTER
  function initLoveClock() {
    const yearsEl = document.getElementById('count-years');
    const daysEl = document.getElementById('count-days');
    const hoursEl = document.getElementById('count-hours');
    const minutesEl = document.getElementById('count-minutes');
    const secondsEl = document.getElementById('count-seconds');

    function updateCounter() {
      const anniversaryStr = (appData.couple && appData.couple.anniversaryDate) || "2023-01-01T00:00:00";
      const startDate = new Date(anniversaryStr);
      const now = new Date();

      let diff = now.getTime() - startDate.getTime();

      // If anniversary is in the future (countdown mode)
      const isPast = diff >= 0;
      if (!isPast) diff = Math.abs(diff);

      const seconds = Math.floor((diff / 1000) % 60);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      
      const totalDays = Math.floor(diff / (1000 * 60 * 60 * 24));
      const years = Math.floor(totalDays / 365.25);
      const days = Math.floor(totalDays % 365.25);

      if (yearsEl) yearsEl.textContent = years;
      if (daysEl) daysEl.textContent = days;
      if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
      if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
      if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
    }

    updateCounter();
    setInterval(updateCounter, 1000);
  }

  // 5. AMBIENT MUSIC CONTROLLER
  function initAudio() {
    const audio = document.getElementById('romantic-audio');
    const audioSource = document.getElementById('audio-source');
    const musicBtn = document.getElementById('music-toggle');
    const musicLabel = document.getElementById('music-label');

    if (!audio) return;

    const musicConfig = appData.music || {};
    if (musicConfig.songUrl && audioSource) {
      audioSource.src = musicConfig.songUrl;
      audio.load();
    }

    let isPlaying = false;

    function playAudio() {
      audio.play().then(() => {
        isPlaying = true;
        if (musicBtn) musicBtn.classList.add('playing');
        if (musicLabel) musicLabel.textContent = "Playing Romantic Melody 🎶";
      }).catch(err => {
        console.log("Audio autoplay prevented by browser policy", err);
      });
    }

    function pauseAudio() {
      audio.pause();
      isPlaying = false;
      if (musicBtn) musicBtn.classList.remove('playing');
      if (musicLabel) musicLabel.textContent = "Play Romantic Music";
    }

    if (musicBtn) {
      musicBtn.addEventListener('click', () => {
        if (isPlaying) {
          pauseAudio();
        } else {
          playAudio();
        }
      });
    }

    // Auto-unlock audio on first user touch / click anywhere on page
    const unlockAudio = () => {
      if (!isPlaying && musicConfig.enabled !== false) {
        playAudio();
      }
      document.removeEventListener('click', unlockAudio);
      document.removeEventListener('touchstart', unlockAudio);
    };

    document.addEventListener('click', unlockAudio, { once: true });
    document.addEventListener('touchstart', unlockAudio, { once: true });
  }

  // 6. FLOATING PARTICLES CANVAS (Hearts & Stars)
  function initHeartsCanvas() {
    const canvas = document.getElementById('hearts-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const particleCount = Math.min(35, Math.floor(window.innerWidth / 30));

    class HeartParticle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = height + Math.random() * 50;
        this.size = Math.random() * 12 + 8;
        this.speedY = Math.random() * 0.8 + 0.4;
        this.speedX = (Math.random() - 0.5) * 0.6;
        this.opacity = Math.random() * 0.4 + 0.2;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotSpeed = (Math.random() - 0.5) * 0.02;
        this.isStar = Math.random() > 0.6;
      }

      update() {
        this.y -= this.speedY;
        this.x += this.speedX;
        this.rotation += this.rotSpeed;

        if (this.y < -30) {
          this.reset();
        }
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.globalAlpha = this.opacity;

        if (this.isStar) {
          // Draw twinkle star
          ctx.fillStyle = '#ffd166';
          ctx.beginPath();
          ctx.arc(0, 0, this.size / 4, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Draw heart
          ctx.fillStyle = '#ff758c';
          ctx.beginPath();
          const topCurveHeight = this.size * 0.3;
          ctx.moveTo(0, topCurveHeight);
          ctx.bezierCurveTo(0, 0, -this.size / 2, 0, -this.size / 2, topCurveHeight);
          ctx.bezierCurveTo(-this.size / 2, (this.size + topCurveHeight) / 2, 0, (this.size + topCurveHeight) / 2, 0, this.size);
          ctx.bezierCurveTo(0, (this.size + topCurveHeight) / 2, this.size / 2, (this.size + topCurveHeight) / 2, this.size / 2, topCurveHeight);
          ctx.bezierCurveTo(this.size / 2, 0, 0, 0, 0, topCurveHeight);
          ctx.closePath();
          ctx.fill();
        }

        ctx.restore();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      const p = new HeartParticle();
      p.y = Math.random() * height; // Spread across initial screen
      particles.push(p);
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }
      requestAnimationFrame(animate);
    }

    animate();
  }

  // 7. IN-BROWSER PHOTO ADD MODAL
  function initAddPhotoModal() {
    const addPhotoBtn = document.getElementById('add-photo-btn');
    const addModal = document.getElementById('add-photo-modal');
    const addBackdrop = document.getElementById('add-photo-backdrop');
    const addClose = document.getElementById('add-photo-close');
    const addForm = document.getElementById('add-photo-form');

    const fileInput = document.getElementById('new-photo-file');
    const urlInput = document.getElementById('new-photo-url');
    const titleInput = document.getElementById('new-photo-title');
    const captionInput = document.getElementById('new-photo-caption');
    const tagSelect = document.getElementById('new-photo-tag');

    if (!addPhotoBtn || !addModal) return;

    function openModal() {
      addModal.classList.add('active');
    }

    function closeModal() {
      addModal.classList.remove('active');
      if (addForm) addForm.reset();
    }

    addPhotoBtn.addEventListener('click', openModal);
    if (addClose) addClose.addEventListener('click', closeModal);
    if (addBackdrop) addBackdrop.addEventListener('click', closeModal);

    if (addForm) {
      addForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const title = titleInput.value.trim();
        const caption = captionInput.value.trim();
        const tag = tagSelect.value;
        const manualUrl = urlInput.value.trim();
        const file = fileInput.files[0];

        function saveAndRender(imageSrc) {
          const newPhoto = {
            title: title || 'Our Precious Memory',
            caption: caption || 'Always smiling with you ❤️',
            date: 'Added with Love',
            src: imageSrc,
            tag: tag || 'Romantic'
          };

          // Save to LocalStorage
          const savedPhotosStr = localStorage.getItem(PHOTOS_STORAGE_KEY);
          let photosList = [];
          if (savedPhotosStr) {
            try { photosList = JSON.parse(savedPhotosStr); } catch(err){}
          }
          photosList.unshift(newPhoto);
          localStorage.setItem(PHOTOS_STORAGE_KEY, JSON.stringify(photosList));

          // Re-render gallery
          initData();
          renderGallery();
          closeModal();

          if (typeof confetti === 'function') {
            confetti({
              particleCount: 50,
              spread: 60,
              origin: { y: 0.6 }
            });
          }
        }

        if (file) {
          const reader = new FileReader();
          reader.onload = function(evt) {
            saveAndRender(evt.target.result);
          };
          reader.readAsDataURL(file);
        } else if (manualUrl) {
          saveAndRender(manualUrl);
        } else {
          alert('Kripya ek photo select karein ya image URL daalein! ❤️');
        }
      });
    }
  }

  // 8. QUICK EDIT MODAL (Personalize Details)
  function initQuickEditModal() {
    const editBtn = document.getElementById('quick-edit-btn');
    const editModal = document.getElementById('edit-modal');
    const editBackdrop = document.getElementById('edit-backdrop');
    const editClose = document.getElementById('edit-close');
    const editForm = document.getElementById('edit-details-form');
    const resetBtn = document.getElementById('reset-config-btn');

    const hInput = document.getElementById('edit-husband-name');
    const wInput = document.getElementById('edit-wife-name');
    const nInput = document.getElementById('edit-wife-nickname');
    const dInput = document.getElementById('edit-anniversary-date');
    const sInput = document.getElementById('edit-song-url');

    if (!editBtn || !editModal) return;

    function openEditModal() {
      if (hInput) hInput.value = appData.couple.husbandName || '';
      if (wInput) wInput.value = appData.couple.wifeName || '';
      if (nInput) nInput.value = appData.couple.wifeNickname || '';
      
      if (dInput && appData.couple.anniversaryDate) {
        try {
          const date = new Date(appData.couple.anniversaryDate);
          const iso = date.toISOString().slice(0, 16);
          dInput.value = iso;
        } catch(e) {}
      }

      if (sInput) sInput.value = (appData.music && appData.music.songUrl) || '';
      editModal.classList.add('active');
    }

    function closeEditModal() {
      editModal.classList.remove('active');
    }

    editBtn.addEventListener('click', openEditModal);
    if (editClose) editClose.addEventListener('click', closeEditModal);
    if (editBackdrop) editBackdrop.addEventListener('click', closeEditModal);

    if (editForm) {
      editForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const husbandName = hInput.value.trim();
        const wifeName = wInput.value.trim();
        const wifeNickname = nInput.value.trim();
        const anniversaryDate = dInput.value;
        const songUrl = sInput.value.trim();

        const updatedData = {
          couple: {
            husbandName,
            wifeName,
            wifeNickname,
            anniversaryDate: anniversaryDate || appData.couple.anniversaryDate,
            coupleMonogram: `${husbandName.charAt(0).toUpperCase()} & ${wifeName.charAt(0).toUpperCase()}`
          },
          music: {
            ...appData.music,
            songUrl: songUrl || appData.music.songUrl
          }
        };

        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
        renderAll();
        closeEditModal();

        alert("Details updated successfully! ✨❤️");
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (confirm("Reset to default configuration?")) {
          localStorage.removeItem(STORAGE_KEY);
          renderAll();
          closeEditModal();
        }
      });
    }
  }

  // INITIALIZE EVERYTHING ON DOM READY
  document.addEventListener('DOMContentLoaded', () => {
    renderAll();
    initEnvelope();
    initLoveClock();
    initHeartsCanvas();
    initAddPhotoModal();
    initQuickEditModal();
  });

})();
