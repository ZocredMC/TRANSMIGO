/* ==============================================================================
   TRANSMIGO - FARE CALCULATOR MODULE (fareCalculator.js)
   Lógica modular para cálculo de tarifas dinámicas según el tipo de servicio.
   ============================================================================== */

/**
 * Tarifas base por tipo de servicio (Valores configurables)
 */
export const FARE_CONFIG = {
  TAXI: {
    baseFee: 3500,       // Banderazo / Tarifa mínima base
    costPerKm: 1200,     // Costo por kilómetro
    costPerMinute: 200,  // Costo por minuto en tráfico
    minFare: 5000         // Tarifa mínima garantizada
  },
  DOMICILIO: {
    baseFee: 2500,
    costPerKm: 1000,
    costPerMinute: 150,
    minFare: 4000
  },
  CARGA: {
    baseFee: 15000,
    costPerKm: 2500,
    costPerMinute: 400,
    minFare: 20000
  }
};

/**
 * Calcula la tarifa estimada para un servicio.
 * @param {string} serviceType - 'TAXI', 'DOMICILIO' o 'CARGA'
 * @param {number} distanceKm - Distancia en kilómetros
 * @param {number} durationMinutes - Tiempo estimado en minutos
 * @param {number} surgeMultiplier - Multiplicador por alta demanda/hora pico (default 1.0)
 * @returns {Object} Desglose completo del cálculo de tarifa
 */
export function calculateFare(serviceType, distanceKm = 0, durationMinutes = 0, surgeMultiplier = 1.0) {
  const config = FARE_CONFIG[serviceType.toUpperCase()] || FARE_CONFIG.TAXI;

  // Cálculos base
  const distanceCost = distanceKm * config.costPerKm;
  const timeCost = durationMinutes * config.costPerMinute;
  
  // Subtotal antes de multiplicador
  const subtotal = config.baseFee + distanceCost + timeCost;
  
  // Aplicar multiplicador (surge pricing / hora pico)
  let totalFare = Math.round(subtotal * surgeMultiplier);

  // Garantizar tarifa mínima
  if (totalFare < config.minFare) {
    totalFare = config.minFare;
  }

  // Redondear a la centena más cercana para facilitar el pago en efectivo
  totalFare = Math.ceil(totalFare / 100) * 100;

  return {
    serviceType: serviceType.toUpperCase(),
    distanceKm: Number(distanceKm.toFixed(2)),
    durationMinutes: Math.round(durationMinutes),
    baseFee: config.baseFee,
    distanceCost: Math.round(distanceCost),
    timeCost: Math.round(timeCost),
    surgeMultiplier,
    totalFareFormatted: `$${totalFare.toLocaleString('es-CO')}`,
    totalFareRaw: totalFare
  };
}

/**
 * Actualiza la interfaz de usuario con el resultado del cálculo
 * @param {Object} fareResult - Objeto devuelto por calculateFare()
 * @param {HTMLElement} resultContainer - Contenedor HTML del resultado (.result-card)
 */
export function renderFareResult(fareResult, resultContainer) {
  if (!resultContainer) return;

  resultContainer.classList.remove('hidden');
  resultContainer.innerHTML = `
    <div class="result-details">
      <div class="detail-item">
        <span class="label">Distancia</span>
        <span class="value">${fareResult.distanceKm} km</span>
      </div>
      <div class="detail-item">
        <span class="label">Tiempo Est.</span>
        <span class="value">${fareResult.durationMinutes} min</span>
      </div>
      <div class="detail-item highlighted">
        <span class="label">Tarifa Total</span>
        <span class="value">${fareResult.totalFareFormatted}</span>
      </div>
    </div>
    <button class="btn btn-whatsapp" id="btnRequestService">
      <span>Pedir ${fareResult.serviceType} por WhatsApp</span>
    </button>
  `;
}
