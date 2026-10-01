/**
 * TRANSMIGO - Main Application Entry Point
 */

import { FareCalculator } from './fareCalculator.js';

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 TRANSMIGO inicializado correctamente');

    // Prueba inicial del calculador de tarifas en consola
    const ejemploCalculo = FareCalculator.calculateFare('taxi', 5.2, 14, { isNight: true });
    console.log('Prueba de tarifa estimada:', ejemploCalculo);
});
