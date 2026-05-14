import{a as m}from"./main-CtB6XwmH.js";import"./vendor-Cmt3X8aB.js";class y{async render(){return this.container=document.createElement("div"),this.container.innerHTML=`
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
    `,this.container}async afterRender(){try{const s=(await m.getSchedule()).data||[],d=document.getElementById("calendar-content"),c=["monday","tuesday","wednesday","thursday","friday","saturday","sunday"],l={monday:"Lunes",tuesday:"Martes",wednesday:"Miércoles",thursday:"Jueves",friday:"Viernes",saturday:"Sábado",sunday:"Domingo"};d.innerHTML=c.map(i=>{const o=s.filter(e=>{var a,t;return(((t=(a=e.broadcast)==null?void 0:a.day)==null?void 0:t.toLowerCase())||"").includes(i)});return o.length===0?"":`
          <div class="day-section">
            <h2 class="day-title">${l[i]}</h2>
            <div class="schedule-grid">
              ${o.slice(0,15).map(e=>{var r,a,t;return`
                <a href="/anime/${e.mal_id}" data-link class="schedule-item">
                  <img src="${(a=(r=e.images)==null?void 0:r.jpg)==null?void 0:a.image_url}" class="schedule-img" alt="${e.title}">
                  <div class="schedule-info">
                    <h4>${e.title}</h4>
                    <p>${((t=e.broadcast)==null?void 0:t.string)||"Horario no disponible"}</p>
                  </div>
                </a>
              `}).join("")}
            </div>
          </div>
        `}).join("")}catch(n){console.error(n),document.getElementById("calendar-content").innerHTML='<p style="color:red;">Error al cargar el calendario.</p>'}}}export{y as default};
