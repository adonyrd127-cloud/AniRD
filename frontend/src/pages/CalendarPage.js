import { apiService } from '../services/api.js';

export default class CalendarPage {
  async render() {
    this.container = document.createElement('div');
    this.container.innerHTML = `
      <style>
        .page-container {
          padding: 40px 4%;
          max-width: 1400px;
          margin: 0 auto;
        }
        .calendar-title {
          font-family: var(--font-display);
          font-size: 2rem;
          margin-bottom: 2rem;
          color: white;
        }
        .day-section {
          margin-bottom: 40px;
        }
        .day-title {
          font-size: 1.5rem;
          color: var(--accent);
          margin-bottom: 15px;
          border-bottom: 2px solid var(--surface);
          padding-bottom: 10px;
          text-transform: capitalize;
        }
        .schedule-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 15px;
        }
        .schedule-item {
          background: var(--surface);
          padding: 15px;
          border-radius: 10px;
          display: flex;
          gap: 15px;
          align-items: center;
          transition: background 0.2s;
          cursor: pointer;
          text-decoration: none;
          color: white;
        }
        .schedule-item:hover {
          background: var(--surface-hover);
        }
        .schedule-img {
          width: 60px;
          height: 80px;
          border-radius: 5px;
          object-fit: cover;
        }
        .schedule-info h4 {
          margin: 0 0 5px 0;
          font-size: 1rem;
        }
        .schedule-info p {
          margin: 0;
          font-size: 0.85rem;
          color: var(--text-secondary);
        }
      </style>
      <div class="page-container">
        <h1 class="calendar-title">📅 Calendario de Emisiones</h1>
        <div id="calendar-content">
           <p style="color:var(--text-secondary);">Cargando calendario...</p>
        </div>
      </div>
    `;
    return this.container;
  }

  async afterRender() {
    try {
      const res = await apiService.getSchedule();
      const schedule = res.data || [];
      const content = document.getElementById('calendar-content');
      
      const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
      const dayNames = {
        monday: 'Lunes', tuesday: 'Martes', wednesday: 'Miércoles',
        thursday: 'Jueves', friday: 'Viernes', saturday: 'Sábado', sunday: 'Domingo'
      };

      content.innerHTML = days.map(day => {
        // Filtrar animes que se emiten este día
        const items = schedule.filter(item => {
            const broadcastDay = item.broadcast?.day?.toLowerCase() || '';
            // Jikan suele devolver "Mondays", "Tuesdays", etc.
            return broadcastDay.includes(day);
        });

        if (items.length === 0) return '';

        return `
          <div class="day-section">
            <h2 class="day-title">${dayNames[day]}</h2>
            <div class="schedule-grid">
              ${items.slice(0, 15).map(anime => `
                <a href="/anime/${anime.mal_id}" data-link class="schedule-item">
                  <img src="${anime.images?.jpg?.image_url}" class="schedule-img" alt="${anime.title}">
                  <div class="schedule-info">
                    <h4>${anime.title}</h4>
                    <p>${anime.broadcast?.string || 'Horario no disponible'}</p>
                  </div>
                </a>
              `).join('')}
            </div>
          </div>
        `;
      }).join('');

    } catch (e) {
      console.error(e);
      document.getElementById('calendar-content').innerHTML = '<p style="color:red;">Error al cargar el calendario.</p>';
    }
  }
}
