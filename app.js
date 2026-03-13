const tabs = document.querySelectorAll('.tab');
const panes = document.querySelectorAll('.tabpane');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    panes.forEach(p => p.classList.remove('active'));

    tab.classList.add('active');
    document.getElementById(`tab-${tab.dataset.tab}`).classList.add('active');
  });
});

fetch('data.json')
  .then(res => res.json())
  .then(data => {
    document.getElementById('tripTitle').textContent = data.trip.title;
    document.getElementById('tripDates').textContent =
      `${data.trip.startDate} – ${data.trip.endDate}`;

    // PARTICIPANTS
    const ul = document.getElementById('participants');
    data.trip.participants.forEach(p => {
      const li = document.createElement('li');
      li.textContent = p;
      ul.appendChild(li);
    });

    // TICKETS
    const tickets = document.getElementById('tickets');
    data.tickets.forEach(t => {
      tickets.innerHTML += `
        <div class="card">
          <h3>${t.label}</h3>
          <p>${t.dateTime}</p>
          <div class="actions">
            <a href="${t.file}" target="_blank">📄 Abrir tiquete</a>
          </div>
        </div>`;
    });

    // HOTELS
    const hotels = document.getElementById('hotels');
    data.hotels.forEach(h => {
      hotels.innerHTML += `
        <div class="card">
          <h3>${h.name}</h3>
          <p>${h.city}</p>
          ${h.checkIn ? `<p>🛏️ Check‑in ${h.checkIn}</p>` : ''}
          ${h.checkOut ? `<p>🕒 Check‑out ${h.checkOut}</p>` : ''}
        </div>`;
    });

    // CONTACTS
    const contacts = document.getElementById('contacts');
    data.contacts.forEach(c => {
      contacts.innerHTML += `
        <div class="card">
          <h3>${c.name}</h3>
          <p>${c.role}</p>
          ${c.phone ? `<div class="actions"><a href="tel:${c.phone}">📞 Llamar</a></div>` : ''}
        </div>`;
    });
  });