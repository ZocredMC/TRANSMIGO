/**
 * TRANSMIGO - Fare Calculator Module
 * Arquitectura Modular para Cálculo de Tarifas
 */

export const FareCalculator = {
    // Configuración base de tarifas (fácilmente modificable o sincronizable con backend)
    config: {
        taxi: {
            baseFare: 4500,     // Tarifa mínima / Banderazo
            perKm: 1200,        // Costo por kilómetro
            perMin: 200,        // Costo por minuto
            minFare: 5500       // Valor mínimo del servicio
        },
        delivery: {
            baseFare: 3500,
            perKm: 1000,
            perMin: 150,
            minFare: 4500
        },
        cargo: {
            baseFare: 15000,
            perKm: 2500,
            perMin: 400,
            minFare: 20000
        },
        surcharges: {
            night: 1.20,       // Recargo nocturno (+20%)
            peakHour: 1.15,    // Hora pico (+15%)
            holiday: 1.25      // Festivo (+25%)
        }
    },

    /**
     * Calcula la tarifa estimada para un servicio
     * @param {string} serviceType - 'taxi' | 'delivery' | 'cargo'
     * @param {number} distanceKm - Distancia en kilómetros
     * @param {number} durationMin - Tiempo estimado en minutos
     * @param {Object} options - { isNight: bool, isPeakHour: bool, isHoliday: bool }
     * @returns {Object} { total, breakdown }
     */
    calculateFare(serviceType = 'taxi', distanceKm = 0, durationMin = 0, options = {}) {
        const rates = this.config[serviceType] || this.config.taxi;

        // 1. Cálculo base por distancia y tiempo
        const distanceCost = distanceKm * rates.perKm;
        const timeCost = durationMin * rates.perMin;
        let subtotal = rates.baseFare + distanceCost + timeCost;

        // 2. Aplicar recargos
        let multiplier = 1.0;
        if (options.isNight) multiplier *= this.config.surcharges.night;
        if (options.isPeakHour) multiplier *= this.config.surcharges.peakHour;
        if (options.isHoliday) multiplier *= this.config.surcharges.holiday;

        let totalCalculated = subtotal * multiplier;

        // 3. Garantizar Tarifa Mínima
        const finalTotal = Math.max(totalCalculated, rates.minFare);

        // Retornar objeto detallado listo para pintar en la UI
        return {
            serviceType,
            total: Math.round(finalTotal),
            formattedTotal: this.formatCurrency(Math.round(finalTotal)),
            breakdown: {
                baseFare: rates.baseFare,
                distanceCost: Math.round(distanceCost),
                timeCost: Math.round(timeCost),
                subtotal: Math.round(subtotal),
                multiplier: multiplier.toFixed(2),
                isMinFareApplied: finalTotal === rates.minFare
            }
        };
    },

    /**
     * Formateador de moneda local (COP / Pesos)
     */
    formatCurrency(amount) {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            maximumFractionDigits: 0
        }).format(amount);
    }
};
