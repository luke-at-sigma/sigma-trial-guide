/* =====================================================
   sigma-trial.js — Progress tracking + Video modal
   ===================================================== */

(function () {
  'use strict';

  /* ── Track configuration ── */
  var TRACKS = {
    t1:  { total: 16, color: '#0059eb', bgLight: '#f7fafe', bgBadge: '#edf3fe', label: 'Track 1 — Working in Sigma' },
    t2:  { total: 13, color: '#16a34a', bgLight: '#f0fdf4', bgBadge: '#f0fdf4', label: 'Track 2 — Build from Scratch' },
    t3:  { total: 8,  color: '#EA580C', bgLight: '#fff7f0', bgBadge: '#fff3e0', label: 'Track 3 — Admin Setup' },
    dd1: { total: 6,  color: '#7B5CF0', bgLight: '#f8f4ff', bgBadge: '#f3eaff', label: 'Deep Dive 1 — View Experience' },
    dd2: { total: 5,  color: '#0D9488', bgLight: '#f0fdfb', bgBadge: '#e6f7fb', label: 'Deep Dive 2 — Embed' },
  };

  /* ── localStorage helpers ── */
  var STORAGE_KEY = 'sigma-trial-progress';

  function getProgress() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    } catch (e) {
      return {};
    }
  }

  function setProgress(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {}
  }

  function markLesson(track, lesson) {
    var p = getProgress();
    if (!p[track]) p[track] = [];
    if (p[track].indexOf(lesson) === -1) p[track].push(lesson);
    setProgress(p);
  }

  function isComplete(track, lesson) {
    var p = getProgress();
    return (p[track] || []).indexOf(lesson) !== -1;
  }

  function getCompletedCount(track) {
    var p = getProgress();
    return (p[track] || []).length;
  }

  /* ── Parse lesson ID from body data attribute ── */
  // e.g. data-lesson="t1-l03" → { track: 't1', lesson: 'l03', num: 3 }
  function parseLessonId() {
    var raw = document.body.getAttribute('data-lesson');
    if (!raw) return null;
    var parts = raw.split('-');
    var track, lesson;
    if (parts.length === 3) {
      // dd1-l01 → ['dd1','l01'] — but split gives ['dd1','l01'] already? no: 'dd1-l01'.split('-') = ['dd1','l01']
      // 't1-l01'.split('-') = ['t1','l01']
      track = parts[0] + '-' + parts[1]; // won't work for dd1
    }
    // Better: everything before the last '-' is the track, everything after is the lesson
    var lastDash = raw.lastIndexOf('-');
    track = raw.substring(0, lastDash);
    lesson = raw.substring(lastDash + 1);
    var num = parseInt(lesson.replace('l', ''), 10);
    return { track: track, lesson: lesson, num: num, raw: raw };
  }

  /* ── Modal open/close ── */
  function openModal() {
    var modal = document.getElementById('video-modal');
    if (modal) modal.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    var modal = document.getElementById('video-modal');
    if (modal) modal.setAttribute('hidden', '');
    document.body.style.overflow = '';
  }

  /* Expose for onclick attributes */
  window.closeModal = closeModal;

  /* ── Build modal HTML and inject into page ── */
  function injectModal(lessonInfo) {
    if (!lessonInfo) return;
    if (document.getElementById('video-modal')) return; // already injected

    var trackCfg = TRACKS[lessonInfo.track] || {};
    var total = trackCfg.total || 1;
    var color = trackCfg.color || '#0059eb';
    var bgBadge = trackCfg.bgBadge || '#edf3fe';
    var trackLabel = trackCfg.label || '';

    // Get lesson title and subtitle from the page
    var titleEl = document.querySelector('.lesson-title');
    var subtitleEl = document.querySelector('.lesson-subtitle');
    var title = titleEl ? titleEl.textContent : '';
    var subtitle = subtitleEl ? subtitleEl.textContent : '';

    // Get video placeholder text
    var vidLabel = '';
    var vidDuration = '';
    var vidLabelEl = document.querySelector('.video-label');
    var vidDurEl = document.querySelector('.video-duration');
    if (vidLabelEl) vidLabel = vidLabelEl.textContent;
    if (vidDurEl) vidDuration = vidDurEl.textContent;

    // Get prev/next hrefs from the lesson nav
    var prevBtn = document.querySelector('.lesson-nav-btn:not(.next)');
    var nextBtn = document.querySelector('.lesson-nav-btn.next');
    var prevHref = prevBtn ? prevBtn.getAttribute('href') : null;
    var nextHref = nextBtn ? nextBtn.getAttribute('href') : null;
    var prevLabel = prevBtn ? (prevBtn.querySelector('.nav-main') || prevBtn).textContent.trim() : 'Previous';
    var nextLabel = nextBtn ? (nextBtn.querySelector('.nav-main') || nextBtn).textContent.trim() : 'Next';

    // Get step sections HTML
    var stepSections = document.querySelectorAll('.step-section');
    var stepsHTML = '';
    for (var i = 0; i < stepSections.length; i++) {
      stepsHTML += stepSections[i].outerHTML;
    }

    // Counter text
    var counterText = lessonInfo.num + ' of ' + total;

    var modal = document.createElement('div');
    modal.id = 'video-modal';
    modal.className = 'modal-overlay';
    modal.setAttribute('hidden', '');
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'modal-title-text');

    modal.innerHTML = [
      '<div class="modal-panel">',
        '<div class="modal-header">',
          '<span class="modal-track-badge" style="background:' + bgBadge + ';color:' + color + '">' + trackLabel + '</span>',
          '<span class="modal-title" id="modal-title-text">' + escapeHTML(title) + '</span>',
          '<button class="modal-close" onclick="closeModal()" aria-label="Close">',
            '<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 2l10 10M12 2L2 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
          '</button>',
        '</div>',
        '<div class="modal-body">',
          '<div class="modal-video">',
            '<div class="modal-video-play" style="background:' + color + '">',
              '<svg width="26" height="26" viewBox="0 0 26 26" fill="none"><path d="M8 5.5L20 13 8 20.5V5.5Z" fill="white"/></svg>',
            '</div>',
            vidLabel ? '<span class="modal-video-label">' + escapeHTML(vidLabel) + '</span>' : '',
            vidDuration ? '<span class="modal-video-sub">' + escapeHTML(vidDuration) + '</span>' : '',
          '</div>',
          subtitle ? '<p style="font-size:15px;color:#505050;line-height:1.6;margin-bottom:24px">' + escapeHTML(subtitle) + '</p>' : '',
          '<div class="modal-step-content">' + stepsHTML + '</div>',
        '</div>',
        '<div class="modal-footer">',
          prevHref
            ? '<a class="modal-nav-btn" href="' + prevHref + '"><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 2L4 7l5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg> Previous</a>'
            : '<span class="modal-nav-btn" hidden></span>',
          '<span class="modal-step-counter">' + counterText + '</span>',
          nextHref
            ? '<a class="modal-nav-btn" href="' + nextHref + '">Next <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5 2l5 5-5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></a>'
            : '<span class="modal-nav-btn" hidden></span>',
        '</div>',
      '</div>',
    ].join('');

    document.body.appendChild(modal);

    // Click outside panel to close
    modal.addEventListener('click', function (e) {
      if (e.target === modal) closeModal();
    });
  }

  /* ── Escape key listener ── */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' || e.key === 'Esc') closeModal();
  });

  /* ── Simple HTML escape ── */
  function escapeHTML(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /* ── Update TOC progress bar on lesson pages ── */
  function updateTocProgress(track) {
    var trackCfg = TRACKS[track];
    if (!trackCfg) return;
    var done = getCompletedCount(track);
    var pct = Math.round((done / trackCfg.total) * 100);
    var fill = document.querySelector('.prog-fill');
    var stats = document.querySelector('.prog-stats');
    if (fill) fill.style.width = pct + '%';
    if (stats) {
      var spans = stats.querySelectorAll('span');
      if (spans.length >= 2) spans[1].textContent = done + '/' + trackCfg.total;
    }
  }

  /* ── Open workbook with PIP panel data ── */
  var PIP_KEY = 'sigma-pip-data';

  function openWorkbook(lessonInfo, trackCfg) {
    // Collect step summaries from page DOM (label + title only)
    // Only collect step sections from outside the modal (avoid duplicates)
    var stepSections = document.querySelectorAll('.step-section');
    var steps = [];
    var seen = [];
    for (var i = 0; i < stepSections.length; i++) {
      if (stepSections[i].closest('#video-modal')) continue; // skip modal clones
      var labelEl = stepSections[i].querySelector('.step-label');
      var titleEl = stepSections[i].querySelector('.step-title');
      if (labelEl && titleEl) {
        var key = labelEl.textContent.trim() + '|' + titleEl.textContent.trim();
        if (seen.indexOf(key) === -1) {
          seen.push(key);
          // Extract body text only — strip callouts and action buttons
          var bodyEl = stepSections[i].querySelector('.step-body');
          var bodyHTML = '';
          if (bodyEl) {
            var clone = bodyEl.cloneNode(true);
            var toRemove = clone.querySelectorAll(
              '.callout, .callout-blue, .callout-green, .callout-warn, .try-btn, .callout-box'
            );
            for (var r = 0; r < toRemove.length; r++) {
              toRemove[r].parentNode.removeChild(toRemove[r]);
            }
            bodyHTML = clone.innerHTML.trim();
          }
          steps.push({ label: labelEl.textContent.trim(), title: titleEl.textContent.trim(), bodyHTML: bodyHTML });
        }
      }
    }

    // Get video info
    var vidLabelEl = document.querySelector('.video-label');
    var vidDurEl = document.querySelector('.video-duration');

    // Get prev/next nav from lesson page
    var prevBtn = document.querySelector('.lesson-nav-btn:not(.next)');
    var nextBtn = document.querySelector('.lesson-nav-btn.next');
    var prevHref = prevBtn ? prevBtn.getAttribute('href') : null;
    var nextHref = nextBtn ? nextBtn.getAttribute('href') : null;
    var prevNavText = prevBtn ? prevBtn.querySelector('.nav-text') : null;
    var nextNavText = nextBtn ? nextBtn.querySelector('.nav-text') : null;
    function getNavMain(navText) {
      if (!navText) return null;
      var spans = navText.querySelectorAll('span');
      // Second span is the lesson name (first is "Previous"/"Next" label)
      return spans.length >= 2 ? spans[1].textContent.trim() : (spans[0] ? spans[0].textContent.trim() : null);
    }

    // Build pip data object
    // Strip any ?from=workbook param so "Back to lesson" returns to clean lesson page
    var cleanHref = window.location.href.split('?')[0];
    var pipData = {
      track: lessonInfo.track,
      lesson: lessonInfo.lesson,
      num: lessonInfo.num,
      total: (trackCfg || {}).total || 1,
      color: (trackCfg || {}).color || '#0059eb',
      bgBadge: (trackCfg || {}).bgBadge || '#edf3fe',
      trackLabel: (trackCfg || {}).label || 'Guide',
      title: (document.querySelector('.lesson-title') || {}).textContent || '',
      subtitle: (document.querySelector('.lesson-subtitle') || {}).textContent || '',
      videoLabel: vidLabelEl ? vidLabelEl.textContent : '',
      videoDuration: vidDurEl ? vidDurEl.textContent : '',
      steps: steps,
      // Append ?from=workbook so clicking Prev/Next in PIP auto-relaunches workbook
      prevHref: prevHref ? prevHref + '?from=workbook' : null,
      prevTitle: getNavMain(prevNavText),
      nextHref: nextHref ? nextHref + '?from=workbook' : null,
      nextTitle: getNavMain(nextNavText),
      returnHref: cleanHref,
    };

    try {
      localStorage.setItem(PIP_KEY, JSON.stringify(pipData));
      // Track last visited lesson for home page "Continue" CTA
      localStorage.setItem('sigma-last-lesson', cleanHref);
    } catch (e) {}

    window.location.href = 'sigma-workbook.html';
  }

  /* ── Init lesson page ── */
  function initLessonPage() {
    var lessonInfo = parseLessonId();
    if (!lessonInfo) return;

    var track = lessonInfo.track;
    var lesson = lessonInfo.lesson;
    var trackCfg = TRACKS[track] || {};
    var color = trackCfg.color || '#0059eb';

    // Auto-launch workbook if arriving here via PIP Prev/Next nav
    if (window.location.search.indexOf('from=workbook') !== -1) {
      openWorkbook(lessonInfo, trackCfg);
      return;
    }

    // Inject modal (kept for fallback; primary UX is now the workbook PIP)
    injectModal(lessonInfo);

    // Wire up video placeholder click → store lesson data + navigate to workbook
    var placeholder = document.querySelector('.video-placeholder');
    if (placeholder) {
      placeholder.style.cursor = 'pointer';
      placeholder.addEventListener('click', function () {
        openWorkbook(lessonInfo, trackCfg);
      });
    }

    // Wire up mark-complete button
    var btn = document.querySelector('.mark-complete-btn');
    if (btn) {
      var alreadyDone = isComplete(track, lesson);
      if (alreadyDone) {
        setButtonDone(btn);
      }
      btn.addEventListener('click', function () {
        if (btn.classList.contains('done')) return;
        markLesson(track, lesson);
        setButtonDone(btn);
        updateTocProgress(track);
        // Update TOC item icon to filled
        updateTocCurrentIcon(color);
      });
    }

    // Update progress bar from stored state
    updateTocProgress(track);
  }

  function setButtonDone(btn) {
    btn.classList.add('done');
    btn.innerHTML = [
      '<svg width="15" height="15" viewBox="0 0 15 15" fill="none">',
        '<circle cx="7.5" cy="7.5" r="6.5" fill="#16a34a"/>',
        '<path d="M4.5 7.5l2 2 4-4" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>',
      '</svg>',
      ' Completed',
    ].join('');
  }

  function updateTocCurrentIcon(color) {
    var currentToc = document.querySelector('.toc-item[data-current="true"] .toc-icon');
    if (currentToc) {
      currentToc.innerHTML = [
        '<svg width="18" height="18" viewBox="0 0 18 18" fill="none">',
          '<circle cx="9" cy="9" r="7" fill="' + color + '"/>',
          '<path d="M5.5 9l2.5 2.5 4.5-4.5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>',
        '</svg>',
      ].join('');
    }
  }

  /* ── Init home page: hydrate progress bars ── */
  function initHomePage() {
    var fills = document.querySelectorAll('[data-track]');
    if (fills.length === 0) return;

    for (var i = 0; i < fills.length; i++) {
      var fill = fills[i];
      var track = fill.getAttribute('data-track');
      var trackCfg = TRACKS[track];
      if (!trackCfg) continue;

      var done = getCompletedCount(track);
      var total = trackCfg.total;
      var pct = total > 0 ? Math.round((done / total) * 100) : 0;
      var color = trackCfg.color;

      // Set progress bar fill width and color
      fill.style.width = pct + '%';
      fill.style.background = color;

      // Find the .track-card ancestor
      var card = fill;
      while (card && !card.classList.contains('track-card')) card = card.parentElement;
      if (!card) continue;

      // Update .track-meta text to show "X of N done"
      var meta = card.querySelector('.track-meta');
      if (meta) {
        var existingText = meta.textContent;
        // Replace or append progress info
        var lessonCount = existingText.split('·')[0].trim();
        meta.textContent = lessonCount + ' · ' + done + '/' + total + ' done';
      }

      // Update start/continue text
      var startEl = card.querySelector('.track-start');
      if (startEl) {
        if (done === 0) {
          startEl.textContent = 'Start track →';
          startEl.style.color = '';
        } else if (done >= total) {
          startEl.innerHTML = '<span style="color:#16a34a">✓ Completed</span>';
        } else {
          startEl.textContent = 'Continue →';
          startEl.style.color = color;
        }
      }
    }

    // Update total lessons-done stat tile
    var statEl = document.getElementById('stat-lessons-done');
    if (statEl) {
      var totalDone = 0;
      var trackKeys = Object.keys(TRACKS);
      for (var j = 0; j < trackKeys.length; j++) {
        totalDone += getCompletedCount(trackKeys[j]);
      }
      statEl.textContent = totalDone;
    }
  }

  /* ── Home page: hydrate "continue" CTA tile ── */
  function initContinueBanner() {
    var lastLesson = localStorage.getItem('sigma-last-lesson');
    var btnEl = document.getElementById('guide-continue-btn');
    if (!lastLesson || !btnEl) return;

    // Derive a readable label from the filename
    var filename = lastLesson.split('/').pop().replace('.html', '').replace('?from=workbook', '');
    // e.g. "sigma-t1-l03" → "Track 1 · Lesson 3"
    var match = filename.match(/sigma-(t\d+|dd\d+)-l(\d+)/);
    var subtitleText = '';
    if (match) {
      var trackKey = match[1].replace(/^t(\d+)$/, 'Track $1').replace(/^dd(\d+)$/, 'Deep Dive $1');
      subtitleText = 'Continue — ' + trackKey + ' · Lesson ' + parseInt(match[2], 10) + ' →';
    }

    var subtitleEl = document.getElementById('guide-continue-subtitle');
    if (subtitleEl && subtitleText) subtitleEl.textContent = subtitleText;

    btnEl.href = lastLesson;
  }

  /* ── Entry point ── */
  document.addEventListener('DOMContentLoaded', function () {
    var isHome = document.querySelector('[data-track]') &&
                 !document.body.getAttribute('data-lesson');
    if (isHome) {
      initHomePage();
      initContinueBanner();
    } else if (document.body.getAttribute('data-lesson')) {
      initLessonPage();
    }
  });

})();
