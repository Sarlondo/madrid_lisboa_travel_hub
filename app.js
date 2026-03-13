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
    document.getElementById(`tab-${tab.dataset.tab}`).classList.add('active');
  };
});

// ============================
// Helpers
// ============================
function mapsSearchUrl(query) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query || "")}`;
}
function safe(v) { return (v ?? "").toString(); }

// ============================
// Load data.json
// ============================
fetch('data.json', { cache: 'no-store' })
  .then(r => r.json())
  .then(d => {

    document.getElementById('tripTitle').textContent = d.trip.title;
    document.getElementById('tripDates').textContent =
      `${d.trip.startDate} → ${d.trip.endDate}`;
    document.getElementById('groupNote').textContent = d.trip.groupNote;

    // Tickets
    const ticketsEl = document.getElementById('tickets');
    (d.tickets || []).forEach(t => {
      ticketsEl.innerHTML += `
        <div class="card">
          <h3>${t.label}</h3>
          <p>${t.from} → ${t.to}</p>
        </div>`;
    });

    // Hotels
    const hotelsEl = document.getElementById('hotels');
    (d.hotels || []).forEach(h => {
      hotelsEl.innerHTML += `
        <div class="card">
          <h3>${h.name}</h3>
          <p>${h.city}</p>
        </div>`;
    });

    // Itinerary ✅
    const daysEl = document.getElementById('days');
    const days = d.days || [];

    days.forEach(day => {
      daysEl.innerHTML += `
        <div class="day-card">
          <h3>${day.date} · ${day.city}</h3>
          <p><strong>${day.title}</strong></p>
          ${day.items.map(i => `<p>• ${i.time} – ${i.title}</p>`).join('')}
        </div>`;
    });

    // Checklist
    const checklistEl = document.getElementById('checklist');
    (d.checklist || []).forEach(i => {
      checklistEl.innerHTML += `<li>✅ ${i.title}</li>`;
    });

  })
  .catch(err => {
    console.error(err);
    alert("Error cargando data.json");
  });