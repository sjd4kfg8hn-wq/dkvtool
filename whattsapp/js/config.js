
/**
 * Configuración global y base de datos de estaciones
 */
const CONFIG = {
  // Umbral en cm para disparar la alerta roja de paquetón
  SNOW_ALERT_THRESHOLD_CM: 10,
  
  // Estaciones monitoreadas con sus coordenadas exactas
  STATIONS: {
    san_isidro: { name: "San Isidro", lat: 43.0558, lon: -5.3789, region: "León" },
    pajares: { name: "Valgrande-Pajares", lat: 42.9964, lon: -5.7672, region: "Asturias/León" },
    leitariegos: { name: "Valle de Laciana - Leitariegos", lat: 42.9917, lon: -6.4103, region: "León" },
    fuentes: { name: "Fuentes de Invierno", lat: 43.0617, lon: -5.3619, region: "Asturias" },
    alto_campoo: { name: "Alto Campoo", lat: 43.0375, lon: -4.3725, region: "Cantabria" },
    formigal: { name: "Formigal - Panticosa", lat: 42.7744, lon: -0.3639, region: "Pirineo Aragonés" },
    baqueira: { name: "Baqueira Beret", lat: 42.6986, lon: 0.9328, region: "Pirineo Catalán" }
  }
};
