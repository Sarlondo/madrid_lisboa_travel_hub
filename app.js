// ============================
// Tabs
// ============================
const tabs = document.querySelectorAll('.tab');
const panes = document.querySelectorAll('.tabpane');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    panes.forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    document
      .getElementById(`tab-${tab.dataset.tab}`)
      .classList.add('active');
  });
});

// ============================
// Helpers
// ============================
function safe(v) {
  return (v ?? '').toString();
}

function mapsSearchUrl(query) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query || '')}`;
}

// ============================
// Load data.json
// ============================
fetch('data.json', { cache: 'no-store' })
  .then(r => r.json())
  .then(d => {

    // ============================
    // HEADER
    // ============================
    document.getElementById('tripTitle').textContent = d.trip.title;
    document.getElementById('tripDates').textContent =
      `${d.trip.startDate} → ${d.trip.endDate}`;

    // ============================
    // RESUMEN
    // ============================
    const resumenEl = document.getElementById('tab-resumen');
    resumenEl.innerHTML = `
      <div class="card hero-claim">
        <span class="hero-icon">👩‍🦰👩‍🦰🏃‍♀️</span>
        <h2>${safe(d.trip.groupNote)}</h2>
        <p class="hero-sub">Un viaje relámpago para disfrutar de todo! ✨</p>
      </div>

      <div class="card">
        <p><strong>📅 Fechas:</strong> ${safe(d.trip.startDate)} → ${safe(d.trip.endDate)}</p>
        <p><strong>👭 Participantes:</strong> ${(d.trip.participants || []).join(', ')}</p>
        <p><strong>✈️ Ruta:</strong> Bogotá → Madrid → Lisboa → Cascais → Lisboa → Madrid</p>
        <p><strong>🏨 Hospedajes:</strong> ${(d.hotels || []).map(h => `${h.city} (${h.name})`).join(', ')}</p>
        ${d.trip.notes ? `<p><strong>📝 Notas:</strong> ${safe(d.trip.notes)}</p>` : ''}
      </div>
    `;

    // ============================
    // TIQUETES
    // ============================
    const ticketsEl = document.getElementById('tickets');
    ticketsEl.innerHTML = '';

    (d.tickets || []).forEach(t => {
      ticketsEl.innerHTML += `
        <div class="card ticket-card">
          <h3>${safe(t.label)}</h3>

          <div class="meta">
            <span>✈️ ${safe(t.type)}</span>
            <span>📅 ${safe(t.dateTime)}</span>
          </div>

          <p><strong>Aerolínea:</strong> ${safe(t.airline)}</p>
          <p><strong>Reserva / PNR:</strong> <code>${safe(t.pnr)}</code></p>
          <p><strong>Ruta:</strong> ${safe(t.from)} → ${safe(t.to)}</p>
          ${t.notes ? `<p class="muted">${safe(t.notes)}</p>` : ''}

          <div class="actions">
            ${t.file ? `<a href="${safe(t.file)}" target="_blank">📄 Abrir archivo</a>` : ''}
            ${t.location ? `<a href="${mapsSearchUrl(t.location)}" target="_blank">📍 Ver en Maps</a>` : ''}
          </div>
        </div>
      `;
    });

    // ============================
    // HOTELES
    // ============================
    const hotelsEl = document.getElementById('hotels');
    hotelsEl.innerHTML = '';

    (d.hotels || []).forEach(h => {
      hotelsEl.innerHTML += `
        <div class="card">
          <h3>🏨 ${safe(h.name)}</h3>
          <p class="muted"><strong>Ciudad:</strong> ${safe(h.city)}</p>
          ${h.address ? `<p class="muted">📍 ${safe(h.address)}</p>` : ''}
          ${h.phone ? `<p class="muted">📞 ${safe(h.phone)}</p>` : ''}
          ${h.checkIn ? `<p>🛏️ Check-in: <strong>${safe(h.checkIn)}</strong></p>` : ''}
          ${h.checkOut ? `<p>🕒 Check-out: <strong>${safe(h.checkOut)}</strong></p>` : ''}

          <div class="actions">
            ${h.mapsQuery ? `<a href="${mapsSearchUrl(h.mapsQuery)}" target="_blank">📍 Ver en Maps</a>` : ''}
            ${h.website ? `<a href="${safe(h.website)}" target="_blank">🌐 Web</a>` : ''}
          </div>
        </div>
      `;
    });

    // ============================
    // ITINERARIO
    // ============================
    const daysEl = document.getElementById('days');
    daysEl.innerHTML = '<div class="timeline"></div>';
    const timeline = daysEl.querySelector('.timeline');

    (d.days || []).forEach(day => {
      timeline.innerHTML += `
        <div class="day-card">
          <div class="day-header">
            <div class="day-date">${safe(day.date)}</div>
            <div class="day-city">${safe(day.city)}</div>
          </div>
          <div class="day-title">${safe(day.title)}</div>
          ${(day.items || []).map(i => `
            <div class="timeline-item">
              <span>${safe(i.time)}</span>
              ${safe(i.title)}
            </div>
          `).join('')}
        </div>
      `;
    });

    // ============================
    // CHECKLIST
    // ============================
    const checklistEl = document.getElementById('checklist');
    checklistEl.innerHTML = '';
    (d.checklist || []).forEach(i => {
      checklistEl.innerHTML += `<li>✅ ${safe(i.title)}</li>`;
    });

  })
  .catch(err => {
    console.error(err);
    alert('Error cargando data.json');
  });