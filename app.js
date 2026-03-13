// ============================
// Tabs
// ============================
const tabs = document.querySelectorAll('.tab');
const panes = document.querySelectorAll('.tabpane');

tabs.forEach(tab => {
  tab.onclick = () => {
    tabs.forEach(t => t.classList.remove('active'));
    panes.forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    document
      .getElementById(`tab-${tab.dataset.tab}`)
      .classList.add('active');
  };
});

// ============================
// Helpers
// ============================
function mapsSearchUrl(query) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query || "")}`;
}
function safe(v) {
  return (v ?? "").toString();
}

// ============================
// Cargar data.json
// ============================
fetch('data.json', { cache: 'no-store' })
  .then(r => r.json())
  .then(d => {

    // ============================
    // HEADER / RESUMEN
    // ============================
    const titleEl = document.getElementById('tripTitle');
    const datesEl = document.getElementById('tripDates');
    if (titleEl) titleEl.textContent = d.trip?.title || '';
    if (datesEl) {
      datesEl.textContent = `${d.trip?.startDate || ''} → ${d.trip?.endDate || ''}`;
    }

    const groupNoteEl = document.getElementById('groupNote');
    if (groupNoteEl) groupNoteEl.textContent = d.trip?.groupNote || '';

    const participantsEl = document.getElementById('participants');
    if (participantsEl) {
      participantsEl.textContent = (d.trip?.participants || []).join(', ');
    }

    const summaryDatesEl = document.getElementById('summaryDates');
    if (summaryDatesEl) {
      summaryDatesEl.textContent = `${d.trip?.startDate || ''} → ${d.trip?.endDate || ''}`;
    }

    // ============================
    // TIQUETES
    // ============================
    const ticketsEl = document.getElementById('tickets');
    if (ticketsEl) {
      ticketsEl.innerHTML = '';

      (d.tickets || []).forEach(t => {
        const fileBtn = t.file
          ? `<a class="btn-link" href="${safe(t.file)}" target="_blank" rel="noopener">📄 Abrir archivo</a>`
          : '';

        const mapsBtn = t.location
          ? `<a class="btn-link ghost" href="${mapsSearchUrl(t.location)}" target="_blank" rel="noopener">📍 Ver en Maps</a>`
          : '';

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
              ${fileBtn}
              ${mapsBtn}
            </div>
          </div>
        `;
      });

      if (!(d.tickets || []).length) {
        ticketsEl.innerHTML = `
          <div class="card">
            <h3>✈️ Sin tiquetes aún</h3>
            <p class="muted">Agrega tus tiquetes en <code>data.json</code> → <code>tickets</code>.</p>
          </div>`;
      }
    }

    // ============================
    // HOTELES
    // ============================
    const hotelsEl = document.getElementById('hotels');
    if (hotelsEl) {
      hotelsEl.innerHTML = '';

      (d.hotels || []).forEach(h => {
        const mapsBtn = h.mapsQuery
          ? `<a class="btn-link ghost" href="${mapsSearchUrl(h.mapsQuery)}" target="_blank" rel="noopener">📍 Ver en Maps</a>`
          : '';

        const webBtn = h.website
          ? `<a class="btn-link ghost" href="${safe(h.website)}" target="_blank" rel="noopener">🌐 Web</a>`
          : '';

        hotelsEl.innerHTML += `
          <div class="card">
            <h3>🏨 ${safe(h.name)}</h3>
            <p class="muted"><strong>Ciudad:</strong> ${safe(h.city)}</p>
            ${h.address ? `<p class="muted">📍 ${safe(h.address)}</p>` : ''}
            ${h.phone ? `<p class="muted">📞 ${safe(h.phone)}</p>` : ''}
            ${h.checkIn ? `<p>🛏️ Check‑in: <strong>${safe(h.checkIn)}</strong></p>` : ''}
            ${h.checkOut ? `<p>🕒 Check‑out: <strong>${safe(h.checkOut)}</strong></p>` : ''}
            <div class="actions">
              ${mapsBtn}
              ${webBtn}
            </div>
          </div>
        `;
      });

      if (!(d.hotels || []).length) {
        hotelsEl.innerHTML = `
          <div class="card">
            <h3>🏨 Sin hospedajes aún</h3>
            <p class="muted">Agrega hospedajes en <code>data.json</code> → <code>hotels</code>.</p>
          </div>`;
      }
    }

    // ============================
    // ITINERARIO (TIMELINE VISUAL ✅)
    // ============================
    const daysEl = document.getElementById('days');
    if (daysEl) {
      const days = d.days || [];

      if (!days.length) {
        daysEl.innerHTML = `
          <div class="card">
            <p class="muted">🗓️ Aún no hay itinerario.</p>
          </div>`;
      } else {
        daysEl.innerHTML = `<div class="timeline"></div>`;
        const timeline = daysEl.querySelector('.timeline');

        days.forEach(day => {
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
      }
    }

    // ============================
    // CONTACTOS
    // ============================
    const contactsEl = document.getElementById('contacts');
    if (contactsEl) {
      contactsEl.innerHTML = '';

      (d.contacts || []).forEach(c => {
        const callBtn = c.phone
          ? `<a class="btn-link" href="tel:${safe(c.phone)}">📞 Llamar</a>`
          : `<span class="muted">Teléfono pendiente</span>`;

        contactsEl.innerHTML += `
          <div class="card">
            <h3>${safe(c.name)}</h3>
            <p class="muted">${safe(c.role)}</p>
            <div class="actions">${callBtn}</div>
          </div>
        `;
      });
    }

    // ============================
    // CHECKLIST
    // ============================
    const checklistEl = document.getElementById('checklist');
    if (checklistEl) {
      checklistEl.innerHTML = '';
      (d.checklist || []).forEach(i => {
        checklistEl.innerHTML += `<li>✅ ${safe(i.title)}</li>`;
      });
    }
  })
  .catch(err => {
    console.error(err);
    alert("Error cargando data.json. Revisa la consola (F12) y que el servidor esté corriendo.");
  });