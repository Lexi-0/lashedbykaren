/* ============================================================
   LASH STUDIO — Main JavaScript
   Handles: Nav, Booking Flow, Ticket Generation, Animations
   ============================================================ */

'use strict';

/* ─── Supabase Config ─────────────────────────────────────── */
const SUPABASE_URL = 'https://xtoaumatscoozoairhxh.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0b2F1bWF0c2Nvb3pvYWlyaHhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg5OTUzMTEsImV4cCI6MjA5NDU3MTMxMX0.jsGUHQX07rE56yZAeYNsweCnj9_pY5-TXnee74Jgx2g';

/* ─── Helpers ─────────────────────────────────────────────── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ─── Navigation ──────────────────────────────────────────── */
const Nav = (() => {
  const nav = $('.nav');
  const hamburger = $('.nav-hamburger');
  const mobile = $('.nav-mobile');
  let mobileOpen = false;

  const init = () => {
    window.addEventListener('scroll', onScroll, { passive: true });
    hamburger?.addEventListener('click', toggleMobile);
    $$('.nav-mobile a').forEach(a => a.addEventListener('click', closeMobile));
    onScroll();
  };

  const onScroll = () => {
    nav?.classList.toggle('scrolled', window.scrollY > 20);

    // Show FAB after scrolling past hero
    const fab = $('.fab');
    if (fab) {
      fab.classList.toggle('visible', window.scrollY > window.innerHeight * 0.7);
    }
  };

  const toggleMobile = () => {
    mobileOpen = !mobileOpen;
    mobile?.classList.toggle('open', mobileOpen);
    document.body.style.overflow = mobileOpen ? 'hidden' : '';

    // Animate hamburger → X
    const spans = $$('span', hamburger);
    if (mobileOpen) {
      spans[0].style.transform = 'rotate(45deg) translate(4px, 4px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(4px, -4px)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  };

  const closeMobile = () => {
    mobileOpen = false;
    mobile?.classList.remove('open');
    document.body.style.overflow = '';
    const spans = $$('span', hamburger);
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  };

  return { init };
})();

/* ─── Scroll Reveal ───────────────────────────────────────── */
const ScrollReveal = (() => {
  const init = () => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in-view');
          observer.unobserve(e.target);
        }
      }),
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    $$('.reveal').forEach(el => observer.observe(el));
  };

  return { init };
})();

/* ─── Booking Engine ──────────────────────────────────────── */
const Booking = (() => {
  /* ── ✏️  EDIT PRICES & SERVICES HERE ──────────────────────
     To change a price, update the `price` value below.
     To change the currency symbol, update CURRENCY.
     Prices are numbers only (no symbols) — symbol is added automatically.
  ────────────────────────────────────────────────────────── */
  const CURRENCY = '₦'; // Change to '$', '€', '£', etc.

  // ── Main services (pick one) ──────────────────────────────
  const SERVICES = [
    { id: 's1', name: 'Classic Full Set',  price: 3000, duration: '1.5h', description: 'Natural, wispy look' },
    { id: 's2', name: 'Hybrid Set',        price: 4000, duration: '2h',   description: 'Classic + Volume mix' },
    { id: 's3', name: 'Volume Set',        price: 5000, duration: '2.5h', description: 'Fluffy, dramatic fans' },
    { id: 's4', name: 'Mega Volume',       price: 6000, duration: '3h',   description: 'Ultra-glam, full lash' },
    { id: 's5', name: 'Lash Removal',      price: 1500, duration: '30m',  description: 'Safe, gentle removal' },
  ];

  // ── Add-ons (pick any, shown after main service selected) ─
  const ADDONS = [
    { id: 'a1', name: 'Longer/Dramatic Lashes', price: 500,  description: 'Extra length & intensity' },
    { id: 'a2', name: 'Spikes',                 price: 1000, description: 'Edgy pointed fans' },
    { id: 'a3', name: 'Bottom Lash',            price: 3000, description: 'Full bottom lash application' },
  ];

  const TIME_SLOTS = ['9:00 AM','10:00 AM','11:00 AM','12:00 PM','1:00 PM','2:00 PM','3:00 PM','4:00 PM','5:00 PM'];

  let state = {
    step: 1,
    service: null,
    addons: [],       // array of selected add-on objects
    date: null,
    time: null,
    name: '',
    phone: '',
    hostel: '',
    room: '',
    notes: '',
    bookingNumber: null,
  };

  const init = () => {
    renderServiceOptions();
    renderTimeSlots(); // render empty slots as placeholder until date is chosen
    attachEvents();
    // Set min date for date picker to today
    const dateInput = $('#booking-date');
    if (dateInput) {
      const today = new Date().toISOString().split('T')[0];
      dateInput.setAttribute('min', today);
    }
  };

  const renderServiceOptions = () => {
    const grid = $('.service-select-grid');
    if (!grid) return;

    grid.innerHTML = `
      <div class="service-options-list">
        ${SERVICES.map(s => `
          <div class="service-option" data-id="${s.id}" data-name="${s.name}" data-price="${s.price}" data-duration="${s.duration}">
            <div class="service-option-info">
              <div class="service-option-name">${s.name}</div>
              <div class="service-option-desc">${s.description}</div>
            </div>
            <div class="service-option-right">
              <div class="service-option-duration">${s.duration}</div>
              <div class="service-option-price">${CURRENCY}${s.price.toLocaleString()}</div>
            </div>
          </div>
        `).join('')}
      </div>

      <div class="addons-section" id="addons-section" style="display:none">
        <div class="addons-title">Add-ons <span class="addons-optional">(optional)</span></div>
        <div class="addons-list">
          ${ADDONS.map(a => `
            <label class="addon-option" data-id="${a.id}" data-name="${a.name}" data-price="${a.price}">
              <input type="checkbox" class="addon-checkbox" data-id="${a.id}" data-name="${a.name}" data-price="${a.price}">
              <div class="addon-info">
                <div class="addon-name">${a.name}</div>
                <div class="addon-desc">${a.description}</div>
              </div>
              <div class="addon-price">+${CURRENCY}${a.price.toLocaleString()}</div>
            </label>
          `).join('')}
        </div>
      </div>

      <div class="booking-total" id="booking-total" style="display:none">
        <span class="booking-total-label">Total</span>
        <span class="booking-total-value" id="booking-total-value"></span>
      </div>
    `;

    // Main service selection
    $$('.service-option').forEach(opt => {
      opt.addEventListener('click', () => {
        $$('.service-option').forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');
        state.service = {
          id:       opt.dataset.id,
          name:     opt.dataset.name,
          price:    parseInt(opt.dataset.price),
          duration: opt.dataset.duration,
        };
        // Reset add-ons when main service changes
        state.addons = [];
        $$('.addon-checkbox').forEach(cb => cb.checked = false);
        // Hide add-ons for Lash Removal, show for everything else
        const isRemoval = state.service.name === 'Lash Removal';
        $('#addons-section').style.display = isRemoval ? 'none' : 'block';
        $('#booking-total').style.display = 'flex';
        updateTotal();
      });
    });

    // Add-on checkboxes
    $$('.addon-checkbox').forEach(cb => {
      cb.addEventListener('change', () => {
        const id    = cb.dataset.id;
        const name  = cb.dataset.name;
        const price = parseInt(cb.dataset.price);
        if (cb.checked) {
          state.addons.push({ id, name, price });
        } else {
          state.addons = state.addons.filter(a => a.id !== id);
        }
        updateTotal();
      });
    });
  };

  const updateTotal = () => {
    const totalEl = $('#booking-total-value');
    if (!totalEl || !state.service) return;
    const addonsTotal = state.addons.reduce((sum, a) => sum + a.price, 0);
    const grand = state.service.price + addonsTotal;
    totalEl.textContent = `${CURRENCY}${grand.toLocaleString()}`;
  };

  // Fetch times already booked on a given date from Supabase
  const fetchBookedSlots = async (date) => {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/bookings?select=time&date=eq.${date}&status=neq.done`,
      {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
        }
      }
    );
    if (!res.ok) return []; // fail silently — don't block the user
    const rows = await res.json();
    return rows.map(r => r.time);
  };

  const renderTimeSlots = (bookedTimes = []) => {
    const grid = $('.time-grid');
    if (!grid) return;

    grid.innerHTML = TIME_SLOTS.map(t => {
      const isBooked = bookedTimes.includes(t);
      return `
        <button class="time-btn ${isBooked ? 'booked' : ''}"
                data-time="${t}"
                ${isBooked ? 'disabled' : ''}>
          ${t}
        </button>
      `;
    }).join('');

    $$('.time-btn:not(.booked)').forEach(btn => {
      btn.addEventListener('click', () => {
        $$('.time-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        state.time = btn.dataset.time;
      });
    });
  };

  // Show loading spinner in the time grid while fetching
  const showTimeSlotsLoading = () => {
    const grid = $('.time-grid');
    if (grid) grid.innerHTML = `<p class="time-loading">Checking availability…</p>`;
  };

  // Load slots for the currently selected date (called on step 2 entry and date change)
  const loadTimeSlotsForDate = async (date) => {
    if (!date) { renderTimeSlots([]); return; }
    showTimeSlotsLoading();
    const booked = await fetchBookedSlots(date);
    renderTimeSlots(booked);
    // Re-apply selected state if user came back to step 2
    if (state.time) {
      const activeBtn = $(`.time-btn[data-time="${state.time}"]`);
      if (activeBtn && !activeBtn.disabled) activeBtn.classList.add('selected');
      else state.time = null; // slot was taken since they last picked it
    }
  };

  const attachEvents = () => {
    // Step 1 → 2
    $('#step1-next')?.addEventListener('click', async () => {
      if (!state.service) {
        showError('service-error', 'Please select a service to continue.');
        return;
      }
      const date = $('#booking-date')?.value;
      if (!date) {
        showError('date-error', 'Please select a date.');
        return;
      }
      state.date = date;
      goToStep(2);
      await loadTimeSlotsForDate(state.date);
    });

    // Step 2 → 3
    $('#step2-next')?.addEventListener('click', () => {
      if (!state.time) {
        showError('time-error', 'Please select a time slot.');
        return;
      }
      goToStep(3);
    });

    // Step 2 back
    $('#step2-back')?.addEventListener('click', () => goToStep(1));

    // Step 3 back
    $('#step3-back')?.addEventListener('click', () => goToStep(2));

    // Submit
    $('#booking-submit')?.addEventListener('click', submitBooking);

    // Tap anywhere on the date row to open the picker
    const dateTrigger = $('#date-picker-trigger');
    const dateInput   = $('#booking-date');
    if (dateTrigger && dateInput) {
      dateTrigger.addEventListener('click', () => {
        try {
          dateInput.showPicker(); // modern browsers + all mobile
        } catch {
          dateInput.focus();      // fallback for older browsers
        }
      });
    }

    // Date change — update display text, state, and reload real availability
    $('#booking-date')?.addEventListener('change', async e => {
      state.date = e.target.value;
      state.time = null;
      $$('.time-btn').forEach(b => b.classList.remove('selected'));

      // Update the friendly display
      const display = $('#date-display-text');
      if (display && e.target.value) {
        const d = new Date(e.target.value + 'T12:00:00');
        display.textContent = d.toLocaleDateString('en-US', { weekday:'short', month:'long', day:'numeric', year:'numeric' });
        display.style.color = 'var(--charcoal)';
        $('#date-picker-trigger')?.classList.add('has-value');
      }

      // If already on step 2, refresh the slots live
      if (state.step === 2) {
        await loadTimeSlotsForDate(state.date);
      }
    });
  };

  const goToStep = (num) => {
    state.step = num;
    $$('.form-step').forEach(s => s.classList.remove('active'));
    $(`#form-step-${num}`)?.classList.add('active');

    // Update progress dots
    $$('.form-progress-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i < num);
    });

    // Scroll the form-wrap top into view so the step header is always visible
    const formWrap = $('.booking-form-wrap');
    if (formWrap) {
      const top = formWrap.getBoundingClientRect().top + window.scrollY - 90;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  const showError = (id, msg) => {
    const el = $(`#${id}`);
    if (!el) return;
    el.textContent = msg;
    el.classList.add('visible');
    setTimeout(() => el.classList.remove('visible'), 3500);
  };

  const clearError = (id) => {
    $(`#${id}`)?.classList.remove('visible');
  };

  const submitBooking = async () => {
    // Validate step 3
    const name      = $('#client-name')?.value.trim();
    const phone     = $('#client-phone')?.value.trim();
    const hostel    = $('#client-hostel')?.value.trim();
    const room      = $('#client-room')?.value.trim();
    const notes     = $('#client-notes')?.value.trim();

    if (!name) { showError('name-error', 'Please enter your name.'); return; }
    if (!phone || phone.length < 7) { showError('phone-error', 'Please enter a valid phone number.'); return; }
    if (!hostel) { showError('hostel-error', 'Please enter your hostel.'); return; }
    if (!room) { showError('room-error', 'Please enter your room number.'); return; }

    state.name = name;
    state.phone = phone;
    state.hostel = hostel;
    state.room = room;
    state.notes = notes;
    state.bookingNumber = generateBookingNumber();

    // Show loading state
    const submitBtn = $('#booking-submit');
    if (submitBtn) {
      submitBtn.textContent = 'Confirming...';
      submitBtn.disabled = true;
    }

    // Save to backend
    await saveBooking(state);

    // Send email notification (fire and forget — don't block ticket)
    fetch('/api/notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        bookingId: state.bookingNumber,
        name:      state.name,
        phone:     state.phone,
        hostel:    state.hostel,
        room:      state.room,
        service:   state.service?.name,
        addons:    (state.addons || []).map(a => a.name).join(', ') || null,
        price:     (state.service?.price || 0) + (state.addons || []).reduce((s,a) => s + a.price, 0),
        date:      state.date,
        time:      state.time,
        notes:     state.notes || null,
      })
    }).catch(err => console.warn('Notification failed:', err));

    // Show ticket
    Ticket.show(state);

    // Reset form
    setTimeout(() => {
      if (submitBtn) {
        submitBtn.textContent = 'Confirm Booking';
        submitBtn.disabled = false;
      }
      goToStep(1);
      resetForm();
    }, 500);
  };

  const resetForm = () => {
    state = {
      step: 1, service: null, addons: [], date: null, time: null,
      name: '', phone: '', hostel: '', room: '', notes: '', bookingNumber: null
    };
    $$('.service-option').forEach(o => o.classList.remove('selected'));
    $$('.addon-checkbox').forEach(cb => cb.checked = false);
    if ($('#addons-section')) $('#addons-section').style.display = 'none';
    if ($('#booking-total')) $('#booking-total').style.display = 'none';
    $$('.time-btn').forEach(b => b.classList.remove('selected'));
    if ($('#booking-date')) $('#booking-date').value = '';
    if ($('#date-display-text')) {
      $('#date-display-text').textContent = 'Tap to choose a date';
      $('#date-display-text').style.color = '';
    }
    $('#date-picker-trigger')?.classList.remove('has-value');
    if ($('#client-name')) $('#client-name').value = '';
    if ($('#client-phone')) $('#client-phone').value = '';
    if ($('#client-hostel')) $('#client-hostel').value = '';
    if ($('#client-room')) $('#client-room').value = '';
    if ($('#client-notes')) $('#client-notes').value = '';
  };

  const generateBookingNumber = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    return 'LS-' + Array.from({length: 6}, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  };

  const saveBooking = async (data) => {
    const payload = {
      id: data.bookingNumber,
      client_name: data.name,
      phone: data.phone,
      hostel: data.hostel,
      room: data.room,
      service: data.service?.name,
      addons: (data.addons || []).map(a => a.name).join(', '),
      price: (data.service?.price || 0) + (data.addons || []).reduce((s,a)=>s+a.price,0),
      date: data.date,
      time: data.time,
      notes: data.notes,
      status: 'pending',
      created_at: new Date().toISOString()
    };

    const res = await fetch(`${SUPABASE_URL}/rest/v1/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error('Booking failed: ' + err);
    }
    return new Promise(r => setTimeout(r, 800));
  };

  return { init };
})();

/* ─── Ticket System ───────────────────────────────────────── */
const Ticket = (() => {
  const overlay = $('.ticket-overlay');

  const show = (booking) => {
    if (!overlay) return;
    renderTicket(booking);
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';

    // Draw QR code
    setTimeout(() => drawQR(booking), 100);
  };

  const hide = () => {
    overlay?.classList.remove('open');
    document.body.style.overflow = '';
  };

  const renderTicket = (b) => {
    const ticket = $('.ticket');
    if (!ticket) return;

    const dateFormatted = b.date
      ? new Date(b.date + 'T12:00:00').toLocaleDateString('en-US', { weekday:'short', month:'long', day:'numeric', year:'numeric' })
      : '—';

    ticket.innerHTML = `
      <div class="ticket-header">
        <div class="ticket-studio">Lash Studio</div>
        <div class="ticket-title">Appointment<br><em style="font-style:italic;color:var(--dusty-pink)">${b.service?.name || 'Lash Service'}</em></div>
        <div class="ticket-subtitle">Your appointment is confirmed</div>
      </div>
      <div class="ticket-tear"></div>
      <div class="ticket-body">
        <div class="ticket-row">
          <div>
            <div class="ticket-field-label">Client</div>
            <div class="ticket-field-value">${escHtml(b.name)}</div>
          </div>
          <div>
            <div class="ticket-field-label">Booking No.</div>
            <div class="ticket-booking-num">${b.bookingNumber}</div>
          </div>
        </div>
        <div class="ticket-row">
          <div>
            <div class="ticket-field-label">Date</div>
            <div class="ticket-field-value">${dateFormatted}</div>
          </div>
          <div>
            <div class="ticket-field-label">Time</div>
            <div class="ticket-field-value">${b.time || '—'}</div>
          </div>
        </div>
        <div class="ticket-row">
          <div>
            <div class="ticket-field-label">Service</div>
            <div class="ticket-field-value" style="font-size:0.95rem">${escHtml(b.service?.name || '—')}</div>
          </div>
          <div>
            <div class="ticket-field-label">Duration</div>
            <div class="ticket-field-value">${b.service?.duration || '—'}</div>
          </div>
        </div>
        ${b.addons && b.addons.length > 0 ? `
        <div class="ticket-row">
          <div style="grid-column:1/-1">
            <div class="ticket-field-label">Add-ons</div>
            <div class="ticket-field-value" style="font-size:0.9rem">${b.addons.map(a => escHtml(a.name)).join(', ')}</div>
          </div>
        </div>` : ''}
        <div class="ticket-row">
          <div style="grid-column:1/-1">
            <div class="ticket-field-label">Total</div>
            <div class="ticket-field-value" style="font-size:1.1rem;font-weight:500;color:var(--charcoal)">
              ₦${((b.service?.price || 0) + (b.addons || []).reduce((s,a)=>s+a.price,0)).toLocaleString()}
            </div>
          </div>
        </div>
        <hr class="ticket-divider">
        <div class="ticket-qr-row">
          <canvas id="ticket-qr-canvas" class="ticket-qr" width="80" height="80"></canvas>
          <div class="ticket-instructions">
            <div class="ticket-field-label" style="margin-bottom:0.6rem">Arrival Instructions</div>
            ${[
              'Arrive <strong>10 min</strong> before your appointment',
              'Come with <strong>no eye makeup</strong> on',
              'Avoid oil-based products beforehand',
              '24hr cancellation notice required',
            ].map(i => `
              <div class="ticket-instruction-item">
                <div class="ticket-instruction-bullet"></div>
                <div class="ticket-instruction-text">${i}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
      <div class="ticket-footer">
        <div class="ticket-footer-logo">Lash <span style="color:var(--deep-rose)">Studio</span></div>
        <div class="ticket-badge">
          <div class="ticket-badge-dot"></div>
          <div class="ticket-badge-text">Confirmed</div>
        </div>
      </div>
    `;
  };

  const drawQR = (b) => {
    const canvas = document.getElementById('ticket-qr-canvas');
    if (!canvas) return;

    // Lightweight QR-like visual (for demo, renders a stylized code grid)
    // In production, use qrcode.js or qr-creator
    const ctx = canvas.getContext('2d');
    const size = 80;
    const moduleSize = 4;
    const modules = size / moduleSize;

    // Data to encode
    const data = `LASHSTUDIO|${b.bookingNumber}|${b.name}|${b.date}|${b.time}`;
    const seed = hashCode(data);

    ctx.fillStyle = '#1A1614';
    ctx.fillRect(0, 0, size, size);

    // Generate deterministic QR-like pattern from booking data
    for (let r = 0; r < modules; r++) {
      for (let c = 0; c < modules; c++) {
        // Corner finders
        if (isFinderPattern(r, c, modules)) {
          ctx.fillStyle = '#FAF7F2';
          ctx.fillRect(c * moduleSize, r * moduleSize, moduleSize, moduleSize);
          continue;
        }
        // Data modules
        const bit = pseudoRandom(seed, r * modules + c);
        if (bit > 0.45) {
          ctx.fillStyle = '#FAF7F2';
          ctx.fillRect(c * moduleSize, r * moduleSize, moduleSize, moduleSize);
        }
      }
    }
  };

  const isFinderPattern = (r, c, m) => {
    const inCorner = (row, col, cr, cc) =>
      row >= cr && row < cr+7 && col >= cc && col < cc+7;
    return inCorner(r,c,0,0) || inCorner(r,c,0,m-7) || inCorner(r,c,m-7,0);
  };

  const hashCode = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash);
  };

  const pseudoRandom = (seed, index) => {
    const x = Math.sin(seed + index) * 10000;
    return x - Math.floor(x);
  };

  const escHtml = (str) => {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  };

  const downloadTicket = () => {
    // Inject a temporary print-only style, print the page, then remove it
    const style = document.createElement('style');
    style.id = 'ticket-print-style';
    style.textContent = `
      @media print {
        body > *:not(.ticket-overlay) { display: none !important; }
        .ticket-overlay {
          position: static !important;
          background: none !important;
          padding: 0 !important;
          display: block !important;
          overflow: visible !important;
        }
        .ticket-container { box-shadow: none !important; margin: 0 auto; }
        .ticket-download-btn, .ticket-close-btn { display: none !important; }
      }
    `;
    document.head.appendChild(style);

    window.print();

    // Remove the style after printing (works for both confirm and cancel)
    const cleanup = () => {
      const s = document.getElementById('ticket-print-style');
      if (s) s.remove();
      window.removeEventListener('afterprint', cleanup);
    };
    window.addEventListener('afterprint', cleanup);
    // Fallback cleanup in case afterprint doesn't fire (some mobile browsers)
    setTimeout(cleanup, 3000);
  };

  const init = () => {
    // Close on overlay click
    overlay?.addEventListener('click', (e) => {
      if (e.target === overlay) hide();
    });

    // Close and download buttons
    document.addEventListener('click', (e) => {
      if (e.target.closest('.ticket-close-btn')) hide();
      if (e.target.closest('.ticket-download-btn')) downloadTicket();
    });
  };

  return { init, show, hide };
})();

/* ─── Smooth Section Scroll ───────────────────────────────── */
const SmoothScroll = (() => {
  const init = () => {
    $$('a[href^="#"]').forEach(a => {
      a.addEventListener('click', (e) => {
        const target = document.getElementById(a.getAttribute('href').slice(1));
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  };
  return { init };
})();

/* ─── Gallery Lightbox ────────────────────────────────────── */
const Gallery = (() => {
  const init = () => {
    $$('.gallery-item').forEach(item => {
      item.style.cursor = 'pointer';
      item.addEventListener('click', () => {
        // Could open full-screen lightbox here
        // For now, just a subtle scale pulse
        item.style.transform = 'scale(1.04)';
        setTimeout(() => item.style.transform = '', 300);
      });
    });
  };
  return { init };
})();

/* ─── Testimonials Drag Scroll ────────────────────────────── */
const Testimonials = (() => {
  const init = () => {
    const track = $('.testimonials-track');
    if (!track) return;

    let isDown = false, startX, scrollLeft;

    track.addEventListener('mousedown', e => {
      isDown = true;
      startX = e.pageX - track.offsetLeft;
      scrollLeft = track.scrollLeft;
      track.style.cursor = 'grabbing';
    });

    track.addEventListener('mouseleave', () => { isDown = false; track.style.cursor = ''; });
    track.addEventListener('mouseup', () => { isDown = false; track.style.cursor = ''; });
    track.addEventListener('mousemove', e => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - track.offsetLeft;
      const walk = (x - startX) * 1.5;
      track.scrollLeft = scrollLeft - walk;
    });
  };
  return { init };
})();

/* ─── Active Nav Link ─────────────────────────────────────── */
const ActiveNav = (() => {
  const init = () => {
    const sections = $$('section[id]');
    const links = $$('.nav-links a');

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            links.forEach(a => {
              a.style.color = a.getAttribute('href') === `#${id}` ? 'var(--charcoal)' : '';
            });
          }
        });
      },
      { rootMargin: '-40% 0px -40% 0px' }
    );

    sections.forEach(s => observer.observe(s));
  };
  return { init };
})();

/* ─── Service Card Images ─────────────────────────────────── */
const ServiceCards = (() => {
  const init = () => {
    $$('.service-card-image[data-image]').forEach(el => {
      const src = el.dataset.image;
      if (!src) return;

      const img = document.createElement('img');
      img.alt         = '';
      img.loading     = 'lazy';   // browser-native lazy load
      img.decoding    = 'async';  // decode off main thread

      // Use IntersectionObserver to only set src when card is near the viewport
      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          img.src = src;
          img.onload = () => {
            el.style.background = 'none';
            el.querySelector('.service-card-image-placeholder')?.remove();
          };
          obs.unobserve(el);
        });
      }, { rootMargin: '200px' }); // start loading 200px before it scrolls into view

      observer.observe(el);
      el.appendChild(img);
    });
  };
  return { init };
})();

/* ─── Init ────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  Nav.init();
  ScrollReveal.init();
  SmoothScroll.init();
  Gallery.init();
  Testimonials.init();
  ActiveNav.init();
  ServiceCards.init();

  if ($('.booking-form-wrap')) {
    // Check whether bookings are open before initialising the form
    (async () => {
      let isOpen = true; // safe default
      try {
        const res = await fetch(
          `${SUPABASE_URL}/rest/v1/settings?select=value&key=eq.bookings_open&limit=1`,
          {
            headers: {
              'apikey': SUPABASE_KEY,
              'Authorization': `Bearer ${SUPABASE_KEY}`,
            }
          }
        );

        if (res.ok) {
          const rows = await res.json();
          if (Array.isArray(rows) && rows.length > 0) {
            // Row exists — use its value explicitly
            isOpen = rows[0].value === 'true';
          }
          // If rows is empty (no row yet), isOpen stays true (default open)
        }
        // If res not ok (table missing etc.), isOpen stays true
      } catch {
        // Network failure — default to open so we never accidentally lock people out
      }

      if (isOpen) {
        Booking.init();
        Ticket.init();
      } else {
        showBookingsClosed();
      }
    })();
  }

  // Marquee is pure CSS — no JS needed
});

function showBookingsClosed() {
  const wrap = $('.booking-form-wrap');
  if (!wrap) return;
  wrap.innerHTML = `
    <div class="bookings-closed-msg">
      <div class="bookings-closed-icon">✦</div>
      <h3 class="bookings-closed-title">We're not taking bookings right now</h3>
      <p class="bookings-closed-text">
        We're currently fully booked or taking a short break.<br>
        Check back soon — we'd love to lash you up.
      </p>
    </div>
  `;
}
