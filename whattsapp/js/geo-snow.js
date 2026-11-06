
/**
 * Módulo Meteorológico y Geolocalizador
 */
const GeoSnowModule = (() => {

  // Cálculo de distancia en km mediante la fórmula de Haversine
  function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radio terrestre en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  // Encontrar la estación más cercana según coordenadas del GPS
  function getClosestStation(userLat, userLon) {
    let closestKey = null;
    let minDistance = Infinity;

    for (const key in CONFIG.STATIONS) {
      const st = CONFIG.STATIONS[key];
      const dist = calculateDistance(userLat, userLon, st.lat, st.lon);
      if (dist < minDistance) {
        minDistance = dist;
        closestKey = key;
      }
    }
    return { stationKey: closestKey, distanceKm: Math.round(minDistance) };
  }

  // Consultar datos de tiempo real en Open-Meteo API (Free & No API Key)
  async function fetchSnowForecast(stationKey) {
    const station = CONFIG.STATIONS[stationKey];
    if (!station) throw new Error("Estación no válida");

    const endpoint = `https://api.open-meteo.com/v1/forecast?latitude=${station.lat}&longitude=${station.lon}&hourly=snowfall,snowline,temperature_2m,windspeed_10m&forecast_days=2&timezone=auto`;
    
    const response = await fetch(endpoint);
    if (!response.ok) throw new Error("Error al consultar el servidor meteorológico");
    
    const data = await response.json();
    
    // Cálculos de datos agrupados para 48h
    const totalSnowfall = data.hourly.snowfall.reduce((acc, val) => acc + val, 0).toFixed(1);
    const avgSnowline = Math.round(data.hourly.snowline.reduce((acc, val) => acc + val, 0) / data.hourly.snowline.length);
    const currentTemp = data.hourly.temperature_2m[0];
    const maxWind = Math.max(...data.hourly.windspeed_10m);

    return {
      stationName: station.name,
      region: station.region,
      snowfallCm: parseFloat(totalSnowfall),
      snowlineM: avgSnowline,
      tempC: currentTemp,
      maxWindKmh: Math.round(maxWind),
      isPowderAlert: parseFloat(totalSnowfall) >= CONFIG.SNOW_ALERT_THRESHOLD_CM
    };
  }

  return {
    getClosestStation,
    fetchSnowForecast
  };

})();
