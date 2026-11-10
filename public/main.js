/**
 * ==============================================================================
 * SUKHO AYOTHAYA THAI MASSAGE ACADEMY - MAIN SCRIPT & CONVERSION SUITE
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  // --------------------------------------------------------------------------
  // 1. META PIXEL & GTM TRACKING HELPER
  // --------------------------------------------------------------------------
  function fireTrackingEvent(eventName, params = {}) {
    if (typeof window.fbq === 'function') {
      window.fbq('track', eventName, params);
      console.log(`[Meta Pixel Event]: ${eventName}`, params);
    }

    if (window.dataLayer && Array.isArray(window.dataLayer)) {
      window.dataLayer.push({
        event: 'meta_pixel_' + eventName.toLowerCase(),
        event_name: eventName,
        ...params
      });
    }
  }

  // LINE Buttons Tracking (Lead)
  document.querySelectorAll('.track-line, a[href*="line.me"]').forEach(btn => {
    btn.addEventListener('click', function () {
      const courseName = this.getAttribute('data-course') || 'General_Inquiry';
      fireTrackingEvent('Lead', {
        content_name: 'LINE_Consultation_Click',
        course_interest: courseName,
        value: 1,
        currency: 'THB'
      });
    });
  });

  // Phone Call Tracking (Contact)
  document.querySelectorAll('.track-phone, a[href^="tel:"]').forEach(btn => {
    btn.addEventListener('click', function () {
      fireTrackingEvent('Contact', {
        content_name: 'Phone_Call_Click',
        phone_target: (this.getAttribute('href') || '').replace('tel:', '')
      });
    });
  });

  // Facebook Button Tracking (Contact)
  document.querySelectorAll('.track-fb, a[href*="facebook.com"]').forEach(btn => {
    btn.addEventListener('click', function () {
      fireTrackingEvent('Contact', {
        content_name: 'Facebook_Page_Click',
        channel: 'Facebook_Messenger'
      });
    });
  });

  // Course Enrollment Click Tracking (InitiateCheckout)
  document.querySelectorAll('.btn-sig-enroll, .c-link, .btn-card-action, .btn-hero-primary').forEach(btn => {
    btn.addEventListener('click', function () {
      const courseName = this.getAttribute('data-course');
      if (courseName) {
        fireTrackingEvent('InitiateCheckout', {
          content_name: courseName,
          currency: 'THB'
        });
      }
    });
  });

  // --------------------------------------------------------------------------
  // 2. MOBILE MENU DRAWER
  // --------------------------------------------------------------------------
  const mobileToggle = document.getElementById('mobileMenuToggle');
  const mobileDrawer = document.getElementById('mobileNavDrawer');

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', function () {
      const isOpen = mobileDrawer.classList.contains('open');
      if (isOpen) {
        mobileDrawer.classList.remove('open');
        mobileToggle.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
      } else {
        mobileDrawer.classList.add('open');
        mobileToggle.classList.add('active');
        mobileToggle.setAttribute('aria-expanded', 'true');
      }
    });

    mobileDrawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', function () {
        mobileDrawer.classList.remove('open');
        mobileToggle.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // --------------------------------------------------------------------------
  // 3. CONCISE FAQ ACCORDION
  // --------------------------------------------------------------------------
  const faqBoxes = document.querySelectorAll('.faq-box');

  faqBoxes.forEach(box => {
    const toggleBtn = box.querySelector('.faq-toggle-btn');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', function () {
        const isActive = box.classList.contains('active');

        // Close others for single-focus reading
        faqBoxes.forEach(other => {
          if (other !== box) {
            other.classList.remove('active');
            const otherBtn = other.querySelector('.faq-toggle-btn');
            if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
          }
        });

        if (isActive) {
          box.classList.remove('active');
          toggleBtn.setAttribute('aria-expanded', 'false');
        } else {
          box.classList.add('active');
          toggleBtn.setAttribute('aria-expanded', 'true');
        }
      });
    }
  });

  // --------------------------------------------------------------------------
  // 4. SMOOTH SCROLL WITH HEADER OFFSET (FOR HASH LINKS)
  // --------------------------------------------------------------------------
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || !targetId) return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = document.getElementById('siteHeader')?.offsetHeight || 80;
        const targetPos = targetEl.getBoundingClientRect().top + window.pageYOffset - headerOffset - 10;
        window.scrollTo({
          top: targetPos,
          behavior: 'smooth'
        });
      }
    });
  });

  // --------------------------------------------------------------------------
  // 5. IMAGE LIGHTBOX (CLICK TO ENLARGE)
  // --------------------------------------------------------------------------
  const lightboxModal = document.createElement('div');
  lightboxModal.className = 'image-lightbox-modal';
  lightboxModal.id = 'imageLightbox';
  lightboxModal.setAttribute('role', 'dialog');
  lightboxModal.setAttribute('aria-label', 'ดูรูปภาพขนาดใหญ่');
  lightboxModal.innerHTML = `
    <div class="lightbox-content-wrap">
      <button class="lightbox-close-btn" aria-label="ปิดรูปภาพ">&times;</button>
      <img class="lightbox-img" src="" alt="ภาพขยาย" />
      <div class="lightbox-caption"></div>
    </div>
  `;
  document.body.appendChild(lightboxModal);

  const lightboxImg = lightboxModal.querySelector('.lightbox-img');
  const lightboxCaption = lightboxModal.querySelector('.lightbox-caption');
  const lightboxClose = lightboxModal.querySelector('.lightbox-close-btn');

  function openLightbox(src, alt) {
    if (!src) return;
    lightboxImg.src = src;
    lightboxCaption.textContent = alt || '';
    lightboxModal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightboxModal.classList.remove('is-open');
    lightboxImg.src = '';
    document.body.style.overflow = '';
  }

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxModal.addEventListener('click', function (e) {
    if (e.target === lightboxModal) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && lightboxModal.classList.contains('is-open')) {
      closeLightbox();
    }
  });

  // Attach to course cards, poster images, news images, gallery images, teacher photos, course atmosphere images & map graphic
  document.querySelectorAll('.course-thumb-holder, .course-card-img, .sig-poster-wrap img, .article-gallery-item img, .article-content-body > img, .mosaic-item img, .teacher-img, .atmosphere-img, .map-graphic-img').forEach(el => {
    el.addEventListener('click', function (e) {
      if (this.closest('.gallery-video-link, .is-video-card, #atmosphere-courses-grid, .course-stories-section')) {
        return; // Allow native link click to open article / YouTube
      }
      var parentAnchor = this.tagName.toLowerCase() === 'a' ? this : this.closest('a');
      if (parentAnchor && parentAnchor.getAttribute('href') && !parentAnchor.classList.contains('lightbox-link')) {
        return; // Allow link navigation instead of lightbox
      }
      const img = this.tagName.toLowerCase() === 'img' ? this : this.querySelector('img');
      if (img) {
        e.preventDefault();
        openLightbox(img.currentSrc || img.src, img.alt);
      }
    });
  });

  // --------------------------------------------------------------------------
  // 6. STANDARDS 3-TILES TAB SWITCHER
  // --------------------------------------------------------------------------
  const standardTiles = document.querySelectorAll('.standards-tab-tile');
  const standardPanes = document.querySelectorAll('.standards-tab-pane');

  if (standardTiles.length > 0 && standardPanes.length > 0) {
    standardTiles.forEach(tile => {
      tile.addEventListener('click', function () {
        const targetTab = this.getAttribute('data-tab');

        // Set active tile
        standardTiles.forEach(t => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        this.classList.add('active');
        this.setAttribute('aria-selected', 'true');

        // Set active pane
        standardPanes.forEach(pane => {
          if (pane.id === `pane-${targetTab}`) {
            pane.classList.add('active');
          } else {
            pane.classList.remove('active');
          }
        });
      });
    });
  }

  // --------------------------------------------------------------------------
  // 7. HERO DESCRIPTION MOBILE COLLAPSE TOGGLE
  // --------------------------------------------------------------------------
  const heroDescBtn = document.querySelector('.btn-hero-desc-toggle');
  const heroDescBody = document.querySelector('.hero-desc-collapse-body');

  if (heroDescBtn && heroDescBody) {
    heroDescBtn.addEventListener('click', function () {
      const isOpen = heroDescBody.classList.contains('is-open');
      const label = this.querySelector('span:first-child');
      if (isOpen) {
        heroDescBody.classList.remove('is-open');
        this.classList.remove('is-active');
        this.setAttribute('aria-expanded', 'false');
        if (label) label.textContent = 'อ่านรายละเอียดสถาบัน';
      } else {
        heroDescBody.classList.add('is-open');
        this.classList.add('is-active');
        this.setAttribute('aria-expanded', 'true');
        if (label) label.textContent = 'ซ่อนรายละเอียด';
      }
    });
  }

});
