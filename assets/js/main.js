/**
 * NumeroSoul — Main JavaScript
 * Type: ES6 Module (loaded with type="module" defer — strict mode implicit)
 * Features: Theme toggle, RTL toggle, Mobile menu, Numerology calculator,
 *           Scroll animations, Stats counter, Back-to-top, Toast notifications
 * No console.log statements — production ready.
 */

/* ================================================================
   1. DOM Ready
   ================================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initRTL();
  initNavScroll();
  initScrollReveal();
  initStatsCounter();
  initCalculator();
  initBackToTop();
  initActiveNavLinks();
  initMeterAnimations();
  setFooterYear();
  initTooltips();
  initCursorFollowers();
  initFAQ();
  initBookingCalendar();
});

/* ================================================================
   2. Theme Toggle (Dark / Light Mode)
   ================================================================ */
function initTheme() {
  const saved = localStorage.getItem('ns-theme') || 'dark';
  applyTheme(saved);

  document.querySelectorAll('[data-theme-toggle]').forEach(btn => {
    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      localStorage.setItem('ns-theme', next);
    });
  });
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  document.querySelectorAll('[data-theme-toggle]').forEach(btn => {
    btn.innerHTML = theme === 'dark' ? '☀' : '🌙';
    btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  });
}

/* ================================================================
   3. RTL Toggle
   ================================================================ */
function initRTL() {
  const savedDir = localStorage.getItem('ns-dir') || 'ltr';
  applyDir(savedDir);

  document.querySelectorAll('[data-rtl-toggle]').forEach(btn => {
    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('dir') || 'ltr';
      const next = current === 'ltr' ? 'rtl' : 'ltr';
      applyDir(next);
      localStorage.setItem('ns-dir', next);
    });
  });
}

function applyDir(dir) {
  document.documentElement.setAttribute('dir', dir);
  document.querySelectorAll('[data-rtl-toggle]').forEach(btn => {
    btn.textContent = dir === 'rtl' ? 'LTR' : 'RTL';
    btn.setAttribute('aria-label', dir === 'rtl' ? 'Switch to LTR layout' : 'Switch to RTL layout');
  });
}

/* ================================================================
   4. Navbar Scroll Effect
   ================================================================ */
function initNavScroll() {
  const nav = document.getElementById('mainNav');
  if (!nav) return;
  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ================================================================
   5. Active Nav Link Highlighting
   ================================================================ */
function initActiveNavLinks() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link-custom, .offcanvas-nav-link');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          const href = link.getAttribute('href');
          if (href && href.startsWith('#')) {
            link.classList.toggle('active', href === `#${id}`);
          }
        });
      }
    });
  }, { rootMargin: '-40% 0px -40% 0px' });

  sections.forEach(section => observer.observe(section));

  // Enforce active highlight for subpages
  enforceActiveMenu();
}

function enforceActiveMenu() {
  const currentPath = window.location.pathname.toLowerCase();
  const navLinks = document.querySelectorAll('.nav-link-custom, .offcanvas-nav-link');

  if (currentPath.includes('service-details')) {
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href && href.includes('services.html')) {
        link.classList.add('active');
      }
    });
  }
}

/* ================================================================
   6. Scroll Reveal Animations
   ================================================================ */
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Add stagger delay based on sibling index
        const siblings = entry.target.parentElement?.querySelectorAll('.reveal, .reveal-left, .reveal-right');
        if (siblings) {
          let idx = Array.from(siblings).indexOf(entry.target);
          entry.target.style.transitionDelay = `${idx * 0.08}s`;
        }
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  elements.forEach(el => observer.observe(el));
}

/* ================================================================
   7. Stats Counter Animation
   ================================================================ */
function initStatsCounter() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-count'), 10);
        const suffix = el.getAttribute('data-suffix') || '';
        const duration = 1800;
        const start = performance.now();

        const step = (now) => {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
          el.textContent = Math.floor(eased * target).toLocaleString() + suffix;
          if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}

/* ================================================================
   8. Report Card Meter Animations
   ================================================================ */
function initMeterAnimations() {
  const fills = document.querySelectorAll('.report-meter-fill');
  if (!fills.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target;
        const width = fill.getAttribute('data-width') || '0%';
        setTimeout(() => { fill.style.width = width; }, 200);
        observer.unobserve(fill);
      }
    });
  }, { threshold: 0.3 });

  fills.forEach(fill => {
    fill.style.width = '0%';
    observer.observe(fill);
  });
}

/* ================================================================
   9. Numerology Calculator (Pythagorean System)
   ================================================================ */

// Pythagorean chart: A=1,B=2...I=9,J=1...
const PYTH_VALUES = {
  A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8, I: 9,
  J: 1, K: 2, L: 3, M: 4, N: 5, O: 6, P: 7, Q: 8, R: 9,
  S: 1, T: 2, U: 3, V: 4, W: 5, X: 6, Y: 7, Z: 8
};

const MASTER_NUMBERS = new Set([11, 22, 33]);

const NUMBER_MEANINGS = {
  1: { title: 'The Leader', emoji: '👑', desc: 'Independent, pioneering, and driven. You are here to forge your own path and inspire others with your unique vision. Leadership is your birthright — own it boldly.' },
  2: { title: 'The Diplomat', emoji: '🕊️', desc: 'Cooperative, intuitive, and empathetic. You possess an extraordinary gift for harmony and understanding the subtle energies around you. Your strength lies in unity.' },
  3: { title: 'The Creator', emoji: '🎨', desc: 'Expressive, joyful, and imaginative. The universe flows through your words and art. You are a channel of divine creativity meant to illuminate and uplift.' },
  4: { title: 'The Builder', emoji: '🏛️', desc: 'Practical, disciplined, and reliable. You lay foundations that endure through time. Your systematic nature turns ambitious dreams into tangible reality.' },
  5: { title: 'The Adventurer', emoji: '🌍', desc: 'Freedom-loving, versatile, and magnetic. Change is your constant companion. You are here to experience life fully and inspire others with your dynamic spirit.' },
  6: { title: 'The Nurturer', emoji: '💞', desc: 'Compassionate, responsible, and harmonious. Your heart naturally gravitates toward healing and service. Family and community are your sacred domains.' },
  7: { title: 'The Seeker', emoji: '🔭', desc: 'Analytical, mystical, and introspective. You are on a perpetual quest for deeper truth. Your mind bridges the scientific and the spiritual realms.' },
  8: { title: 'The Achiever', emoji: '💎', desc: 'Ambitious, authoritative, and resourceful. You are designed for material and spiritual abundance. Power used with integrity is your ultimate mastery.' },
  9: { title: 'The Humanitarian', emoji: '🌟', desc: 'Compassionate, wise, and transformative. You carry the wisdom of all numbers. Your purpose is to serve humanity and create a more loving world.' },
  11: { title: 'Master Intuitive', emoji: '⚡', desc: 'A master number of extraordinary spiritual sensitivity and intuition. You are a channel for higher wisdom. Your insights can inspire and illuminate the world.' },
  22: { title: 'Master Builder', emoji: '🌐', desc: 'The most powerful master number — the Master Builder. You have the vision of an 11 combined with the practicality of a 4, capable of manifesting dreams on a grand scale.' },
  33: { title: 'Master Teacher', emoji: '🕊️', desc: 'The rarest master number, embodying pure compassion and selfless service. You are called to uplift humanity through unconditional love and spiritual teaching.' }
};

function sumDigits(n) {
  return String(n).split('').reduce((acc, d) => acc + parseInt(d, 10), 0);
}

function reduceToSingle(n) {
  while (n > 9 && !MASTER_NUMBERS.has(n)) {
    n = sumDigits(n);
    if (n <= 9 || MASTER_NUMBERS.has(n)) break;
  }
  return n;
}

function calculateLifePath(name) {
  const cleaned = name.toUpperCase().replace(/[^A-Z]/g, '');
  if (!cleaned) return null;
  const total = cleaned.split('').reduce((acc, ch) => acc + (PYTH_VALUES[ch] || 0), 0);
  return reduceToSingle(total);
}

function calculateBirthdate(dateStr) {
  if (!dateStr) return null;
  const parts = dateStr.split('-').map(Number);
  if (parts.length !== 3) return null;
  const [yr, mo, dy] = parts;
  const total = sumDigits(dy) + sumDigits(mo) + sumDigits(yr);
  return reduceToSingle(total);
}

function initCalculator() {
  const form = document.getElementById('calcForm');
  if (!form) return;

  const nameInput = document.getElementById('calcName');
  const dobInput = document.getElementById('calcDob');
  const resultDiv = document.getElementById('calcResult');
  const resultNum = document.getElementById('resultNumber');
  const resultTitle = document.getElementById('resultTitle');
  const resultEmoji = document.getElementById('resultEmoji');
  const resultDesc = document.getElementById('resultDesc');
  const resultBreak = document.getElementById('resultBreakdown');
  const leadSection = document.getElementById('calcLeadSection');
  const skeleton = document.getElementById('calcResultSkeleton');
  const nameErrorMsg = document.getElementById('calcNameError');
  const nameCharNum = document.getElementById('nameCharNum');

  /* ---- Validation helpers ---- */
  function showFieldError(input, msgEl) {
    input.classList.add('is-invalid');
    input.classList.remove('is-valid');
    if (msgEl) msgEl.classList.add('show');
    input.setAttribute('aria-invalid', 'true');
  }
  function clearFieldError(input, msgEl) {
    input.classList.remove('is-invalid');
    if (msgEl) msgEl.classList.remove('show');
    input.removeAttribute('aria-invalid');
  }
  function markFieldValid(input) {
    input.classList.add('is-valid');
    input.classList.remove('is-invalid');
    input.removeAttribute('aria-invalid');
  }

  /* ---- Skeleton flash (simulates async) ---- */
  function showSkeleton(ms = 400) {
    if (!skeleton) return Promise.resolve();
    skeleton.classList.add('show');
    skeleton.removeAttribute('aria-hidden');
    return new Promise(resolve => setTimeout(() => {
      skeleton.classList.remove('show');
      skeleton.setAttribute('aria-hidden', 'true');
      resolve();
    }, ms));
  }

  /* ---- Character counter ---- */
  if (nameInput && nameCharNum) {
    nameInput.addEventListener('input', () => {
      const len = nameInput.value.length;
      nameCharNum.textContent = len;
      const countEl = nameCharNum.closest('.char-count');
      if (countEl) {
        countEl.classList.toggle('warn', len > 45);
        countEl.classList.toggle('over', len >= 60);
      }
    });
  }

  /* ---- Blur validation on name input ---- */
  if (nameInput) {
    nameInput.addEventListener('blur', () => {
      const val = nameInput.value.trim();
      if (!val) {
        showFieldError(nameInput, nameErrorMsg);
      } else {
        clearFieldError(nameInput, nameErrorMsg);
        markFieldValid(nameInput);
      }
    });
  }

  /* ---- Form submit ---- */
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = (nameInput?.value || '').trim();
    const dob = dobInput?.value || '';

    /* Validate */
    if (!name) {
      showFieldError(nameInput, nameErrorMsg);
      nameInput?.focus();
      return;
    }
    clearFieldError(nameInput, nameErrorMsg);
    markFieldValid(nameInput);

    /* Hide previous result, show skeleton */
    if (resultDiv) resultDiv.classList.remove('show');
    await showSkeleton(380);

    const nameNum = calculateLifePath(name);
    const dobNum = dob ? calculateBirthdate(dob) : null;
    const primary = nameNum;
    const info = NUMBER_MEANINGS[primary] || NUMBER_MEANINGS[1];

    if (resultNum) resultNum.textContent = primary;
    if (resultEmoji) resultEmoji.textContent = info.emoji;
    if (resultTitle) resultTitle.textContent = info.title;
    if (resultDesc) resultDesc.textContent = info.desc;

    /* Breakdown */
    if (resultBreak) {
      const cleaned = name.toUpperCase().replace(/[^A-Z]/g, '');
      const breakdown = cleaned.split('').map(ch => `${ch}=${PYTH_VALUES[ch] || 0}`).join(' + ');
      let html = `<p class="caption mt-1 mb-0" style="word-break:break-all;">${breakdown}</p>`;
      if (dobNum) {
        const dobInfo = NUMBER_MEANINGS[dobNum];
        html += `<hr style="border-color:var(--border);margin:0.75rem 0">
                 <div class="d-flex align-items-center gap-2">
                   <span class="num-pill">${dobNum}</span>
                   <span class="caption"><strong>Life Path (Birthdate):</strong> ${dobInfo ? dobInfo.title : ''}</span>
                 </div>`;
      }
      resultBreak.innerHTML = html;
    }

    resultDiv.classList.add('show');
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    if (leadSection) leadSection.style.display = 'block';
    if (MASTER_NUMBERS.has(primary)) {
      showToast('✨ You carry a Master Number — exceptionally rare!');
    }
  });

  /* ---- Lead capture ---- */
  const leadForm = document.getElementById('leadForm');
  if (leadForm) {
    leadForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('leadEmail')?.value || '';
      if (!email) return;
      showToast('🎉 Your full report is on its way to ' + email + '!');
      leadForm.reset();
    });
  }

  /* ---- Real-time name letter preview ---- */
  if (nameInput) {
    nameInput.addEventListener('input', () => {
      const name = nameInput.value.toUpperCase().replace(/[^A-Z]/g, '');
      const preview = document.getElementById('namePreview');
      if (preview && name) {
        const map = name.split('').map(ch =>
          `<span style="color:var(--primary)">${ch}</span><sub style="color:var(--text-muted);font-size:0.6rem">${PYTH_VALUES[ch] || 0}</sub>`
        ).join(' ');
        preview.innerHTML = map;
        preview.style.display = 'block';
      } else if (preview) {
        preview.style.display = 'none';
      }
    });
  }
}

/* ================================================================
   10. Back to Top
   ================================================================ */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ================================================================
   11. Toast Notification
   ================================================================ */
function showToast(message, duration = 3500) {
  let toast = document.getElementById('toastCustom');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toastCustom';
    toast.className = 'toast-custom';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), duration);
}

/* ================================================================
   12. Footer Year
   ================================================================ */
function setFooterYear() {
  const el = document.getElementById('footerYear');
  if (el) el.textContent = new Date().getFullYear();
}

/* ================================================================
   13. Bootstrap Tooltips Init
   ================================================================ */
function initTooltips() {
  if (typeof bootstrap !== 'undefined' && bootstrap.Tooltip) {
    document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(el => {
      new bootstrap.Tooltip(el);
    });
  }
}

/* ================================================================
   14. Smooth Offcanvas Close on Link Click
   ================================================================ */
document.addEventListener('click', (e) => {
  const link = e.target.closest('.offcanvas-nav-link');
  if (!link) return;
  const offcanvasEl = document.querySelector('.offcanvas');
  if (offcanvasEl && typeof bootstrap !== 'undefined') {
    const instance = bootstrap.Offcanvas.getInstance(offcanvasEl);
    if (instance) instance.hide();
  }
});

/* ================================================================
   15. Newsletter Form
   ================================================================ */
document.addEventListener('submit', (e) => {
  const form = e.target;
  if (form.id === 'newsletterForm') {
    e.preventDefault();
    const email = form.querySelector('input[type="email"]')?.value;
    showToast(`📩 Subscribed! Cosmic insights coming to ${email}`);
    form.reset();
  }
});

/* ================================================================
   16. Particle Generator (Hero Section)
   ================================================================ */
function generateParticles(container, count = 12) {
  if (!container) return;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('span');
    p.className = 'particle';
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      animation-delay: ${Math.random() * 8}s;
      animation-duration: ${6 + Math.random() * 6}s;
      width: ${2 + Math.random() * 3}px;
      height: ${2 + Math.random() * 3}px;
      background: ${Math.random() > 0.5 ? 'var(--primary)' : 'var(--gold)'};
    `;
    container.appendChild(p);
  }
}

window.addEventListener('load', () => {
  generateParticles(document.querySelector('#hero .hero-particles'), 18);
  generateParticles(document.querySelector('#calculator .calc-particles'), 10);
});
/* ================================================================
   17. Custom Form Validation
   ================================================================ */
document.addEventListener('DOMContentLoaded', () => {
  const forms = document.querySelectorAll('.needs-validation');
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }
      form.classList.add('was-validated');
    }, false);
  });
});

/* ================================================================
   18. Custom Cursor Followers
   ================================================================ */
function initCursorFollowers() {
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;

  const characters = ['1', '2', 'A', 'B', '★', '★'];
  const followers = [];
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;

  const style = document.createElement('style');
  style.innerHTML = `
    .cursor-follower {
      position: fixed;
      top: 0;
      left: 0;
      pointer-events: none;
      z-index: 99999;
      font-size: 1.1rem;
      font-weight: 700;
      color: var(--primary, #d4af37);
      text-shadow: 0 0 8px rgba(212, 175, 55, 0.6);
      will-change: transform;
      opacity: 0;
      transition: opacity 0.5s ease;
    }
    body:hover .cursor-follower {
      opacity: 1;
    }
  `;
  document.head.appendChild(style);

  characters.forEach((char) => {
    const el = document.createElement('div');
    el.className = 'cursor-follower';
    el.textContent = char;
    document.body.appendChild(el);
    followers.push({
      element: el,
      x: mouseX,
      y: mouseY
    });
  });

  let lastMouseMoveTime = Date.now();
  let isHoveringInteractable = false;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    lastMouseMoveTime = Date.now();
  });

  document.addEventListener('mouseover', (e) => {
    if (e.target.closest('a, button, input, textarea, select, [role="button"]')) {
      isHoveringInteractable = true;
    } else {
      isHoveringInteractable = false;
    }
  });

  function animate() {
    let tx = mouseX;
    let ty = mouseY;

    // Check if idle for more than 0.3 seconds (300 ms)
    const isIdle = (Date.now() - lastMouseMoveTime) > 300;

    followers.forEach((follower, index) => {
      let dx = tx - follower.x;
      let dy = ty - follower.y;
      let dist = Math.sqrt(dx * dx + dy * dy);

      // If idle or hovering over a link/button, reduce spacing to 0 to hide behind the mouse
      const minSpacing = (isIdle || isHoveringInteractable) ? 0 : 22;

      // Only move if they are further apart than the minimum spacing
      if (dist > minSpacing) {
        let pullDist = dist - minSpacing;
        let pullForce = pullDist * 0.4; // Easing factor

        let angle = Math.atan2(dy, dx);
        follower.x += Math.cos(angle) * pullForce;
        follower.y += Math.sin(angle) * pullForce;
      }

      follower.element.style.transform = `translate3d(${follower.x}px, ${follower.y}px, 0) translate(-50%, -50%)`;

      tx = follower.x;
      ty = follower.y;
    });

    requestAnimationFrame(animate);
  }

  animate();
}

/* ================================================================
   19. FAQ Accordion Logic
   ================================================================ */
function initFAQ() {
  const faqButtons = document.querySelectorAll('.faq-question');
  
  faqButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const isExpanded = btn.getAttribute('aria-expanded') === 'true';
      const controls = btn.getAttribute('aria-controls');
      const answer = document.getElementById(controls);
      
      if (isExpanded) {
        btn.setAttribute('aria-expanded', 'false');
        if (answer) answer.classList.remove('show');
      } else {
        // Optional: Accordion behavior (close others)
        faqButtons.forEach(otherBtn => {
          if (otherBtn !== btn) {
            otherBtn.setAttribute('aria-expanded', 'false');
            const otherAnswer = document.getElementById(otherBtn.getAttribute('aria-controls'));
            if (otherAnswer) otherAnswer.classList.remove('show');
          }
        });

        btn.setAttribute('aria-expanded', 'true');
        if (answer) answer.classList.add('show');
      }
    });
  });
}

/* ================================================================
   20. Booking Calendar
   ================================================================ */
function initBookingCalendar() {
  const calendarGrid = document.getElementById('calendarGrid');
  const selectedDateDisplay = document.getElementById('selectedDateDisplay');
  const timeSlotsContainer = document.getElementById('timeSlotsContainer');
  if (!calendarGrid || !selectedDateDisplay || !timeSlotsContainer) return;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  
  const firstDay = new Date(currentYear, currentMonth, 1);
  
  let startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - startDate.getDay()); // Start from Sunday
  
  let html = '';
  let defaultSelected = new Date(today);
  defaultSelected.setDate(defaultSelected.getDate() + 1); // Select tomorrow by default
  
  for (let i = 0; i < 35; i++) {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    d.setHours(0, 0, 0, 0);
    
    // Check if past or today
    const isPast = d <= today;
    
    // Check if in current month
    const isOtherMonth = d.getMonth() !== currentMonth;
    
    const isSelected = d.getTime() === defaultSelected.getTime();
    
    let classes = 'p-2 rounded calendar-day';
    let style = '';
    
    if (isPast) {
      classes += ' text-muted disabled-date';
      style = 'opacity: 0.3; cursor: not-allowed;';
    } else {
      classes += ' hover-lift selectable-date';
      style = 'cursor: pointer; border: 1px solid transparent;';
      if (isSelected) {
        classes += ' bg-primary text-white shadow-sm fw-bold active-date';
      } else if (d.getDay() === 0 || d.getDay() === 6) {
        classes += ' text-primary fw-bold';
      }
    }
    
    if (isOtherMonth) {
      classes += ' text-muted';
      style += ' opacity: 0.5;';
    }
    
    html += `<div class="col"><div class="${classes}" style="${style}" data-iso="${d.toISOString()}">${d.getDate()}</div></div>`;
  }
  
  calendarGrid.innerHTML = html;
  
  // Setup event listeners
  calendarGrid.addEventListener('click', (e) => {
    const dayBtn = e.target.closest('.selectable-date');
    if (!dayBtn) return;
    
    const iso = dayBtn.getAttribute('data-iso');
    if (!iso) return;
    
    // Update active class
    calendarGrid.querySelectorAll('.selectable-date').forEach(el => {
      el.classList.remove('bg-primary', 'text-white', 'shadow-sm', 'fw-bold', 'active-date');
      if (new Date(el.getAttribute('data-iso')).getDay() % 6 === 0) {
        el.classList.add('text-primary', 'fw-bold');
      }
    });
    
    dayBtn.classList.remove('text-primary');
    dayBtn.classList.add('bg-primary', 'text-white', 'shadow-sm', 'fw-bold', 'active-date');
    
    updateDateDisplay(new Date(iso));
    renderTimeSlots();
  });
  
  function updateDateDisplay(d) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    let nth = 'th';
    const dateStr = d.getDate().toString();
    if (dateStr.endsWith('1') && dateStr !== '11') nth = 'st';
    else if (dateStr.endsWith('2') && dateStr !== '12') nth = 'nd';
    else if (dateStr.endsWith('3') && dateStr !== '13') nth = 'rd';
    
    selectedDateDisplay.textContent = `${days[d.getDay()]}, ${d.getDate()}${nth} ${months[d.getMonth()]}`;
  }
  
  function renderTimeSlots() {
    const times = ['10:00 AM', '11:30 AM', '02:00 PM', '03:30 PM', '05:00 PM'];
    let slotsHtml = '';
    times.forEach(t => {
      slotsHtml += `<button class="btn btn-outline-primary w-100 text-center py-2 mb-1 time-slot-btn" style="border-color: var(--border); color: var(--text);" data-time="${t}">${t}</button>`;
    });
    timeSlotsContainer.innerHTML = slotsHtml;
  }
  
  timeSlotsContainer.addEventListener('click', (e) => {
    const btn = e.target.closest('.time-slot-btn');
    if (!btn) return;
    
    const timeText = btn.getAttribute('data-time');
    
    // Re-render to clear others
    renderTimeSlots();
    
    // Find the re-rendered button and replace it
    const newBtn = Array.from(timeSlotsContainer.querySelectorAll('.time-slot-btn')).find(b => b.getAttribute('data-time') === timeText);
    
    if (newBtn) {
      const wrapper = document.createElement('div');
      wrapper.className = 'd-flex gap-2 mb-1';
      wrapper.innerHTML = `
        <button class="btn w-50 text-center py-2" style="background: var(--bg-card); color: var(--text); border: 1px solid var(--border);">${timeText}</button>
        <button class="btn btn-primary-custom w-50 text-center py-2 shadow-sm confirm-booking-btn">Confirm</button>
      `;
      newBtn.parentNode.replaceChild(wrapper, newBtn);
      
      const confirmBtn = wrapper.querySelector('.confirm-booking-btn');
      confirmBtn.addEventListener('click', () => {
        const dateStr = selectedDateDisplay.textContent;
        showToast(`Booking Confirmed for ${dateStr} at ${timeText}`);
        setTimeout(() => {
            renderTimeSlots();
        }, 3000);
      });
    }
  });

  // Initial render
  updateDateDisplay(defaultSelected);
  renderTimeSlots();
}
