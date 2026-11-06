
/**
 * Controlador de Aplicación e Interfaz
 */
document.addEventListener("DOMContentLoaded", () => {
  const snowModuleEl = document.getElementById("snow-module");

  // Renderizar la interfaz inicial en HTML
  snowModuleEl.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
      <h2 style="margin: 0; color: var(--accent-blue);">❄️ Alerta de Nieve & GPS Rider</h2>
      <button id="btn-gps" style="background: var(--accent-blue); border: none; padding: 8px 16px; border-radius: 6px; color: #000; font-weight: bold; cursor: pointer;">
        📍 Detectar mi posición
      </button>
    </div>

    <div style="margin-top: 15px;">
      <label for="station-selector" style="font-size: 0.9em; color: var(--text-muted);">Estación activa:</label>
      <select id="station-selector" style="width: 100%; padding: 10px; border-radius: 6px; background: #0f172a; color: #fff; border: 1px solid #334155; margin-top: 5px; font-size: 1rem;">
        <option value="">-- Cargar estación --</option>
        ${Object.keys(CONFIG.STATIONS).map(key => `<option value="${key}">${CONFIG.STATIONS[key].name} (${CONFIG.STATIONS[key].region})</option>`).join('')}
      </select>
    </div>

    <div id="weather-card-result" style="margin-top: 20px; display: none;"></div>
  `;

  const selector = document.getElementById("station-selector");
  const gpsBtn = document.getElementById("btn-gps");
  const resultCard = document.getElementById("weather-card-result");

  // Función para cargar y pintar los datos meteorológicos
  async function loadData(stationKey, distanceText = "") {
    resultCard.style.display = "block";
    resultCard.innerHTML = `<p style="color: var(--text-muted);">🔄 Consultando satélites para ${CONFIG.STATIONS[stationKey].name}...</p>`;

    try {
      const data = await GeoSnowModule.fetchSnowForecast(stationKey);
      
      const alertHtml = data.isPowderAlert 
        ? `<div style="background: var(--alert-red); color: white; padding: 12px; border-radius: 8px; font-weight: bold; margin-bottom: 15px; text-align: center; animation: pulse 2s infinite;">
             🚨 ¡ALERTA DE PAQUETÓN! (${data.snowfallCm} cm de nieve fresca esperados)
           </div>` 
        : '';

      resultCard.innerHTML = `
        ${alertHtml}
        <div style="background: #0f172a; padding: 18px; border-radius: 10px; border: 1px solid #334155;">
          <h3 style="margin-top: 0; color: var(--accent-blue);">${data.stationName} <span style="font-size:0.7em; color: var(--text-muted);">${distanceText}</span></h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 12px; margin-top: 10px;">
            <div><strong>Nieve 48h:</strong> <br><span style="font-size: 1.4rem; color: #38bdf8;">${data.snowfallCm} cm</span></div>
            <div><strong>Cota Nieve:</strong> <br><span style="font-size: 1.4rem;">${data.snowlineM} m</span></div>
            <div><strong>Temperatura:</strong> <br><span style="font-size: 1.4rem;">${data.tempC} °C</span></div>
            <div><strong>Viento máx:</strong> <br><span style="font-size: 1.4rem;">${data.maxWindKmh} km/h</span></div>
          </div>
        </div>
      `;
    } catch (err) {
      resultCard.innerHTML = `<p style="color: var(--alert-red);">❌ No se pudieron cargar los datos de tiempo. Revisa tu conexión.</p>`;
    }
  }

  // Evento cuando cambia el selector manual
  selector.addEventListener("change", (e) => {
    if (e.target.value) loadData(e.target.value);
  });

  // Evento para geolocalización por GPS
  gpsBtn.addEventListener("click", () => {
    if (!("geolocation" in navigator)) {
      alert("Tu navegador no soporta geolocalización GPS.");
      return;
    }

    gpsBtn.innerText = "🛰️ Buscando GPS...";
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        gpsBtn.innerText = "📍 Detectar mi posición";
        const { stationKey, distanceKm } = GeoSnowModule.getClosestStation(pos.coords.latitude, pos.coords.longitude);
        selector.value = stationKey;
        loadData(stationKey, `a ${distanceKm} km de ti`);
      },
      (error) => {
        gpsBtn.innerText = "📍 Detectar mi posición";
        alert("No se pudo obtener la ubicación GPS. Por favor, selecciona la estación manualmente.");
      }
    );
  });

  // Carga inicial por defecto (San Isidro)
  selector.value = "san_isidro";
  loadData("san_isidro");
});
