// Script de validación - DESPUÉS DE LA CORRECCIÓN

const WEEK = 7;
const MONTH = 30;
const YEAR = 365;

// REGLAS CORREGIDAS según normas MINSA/OMS
const genericRules = [
   { ageMax: WEEK, stats: [{ anemiaLimit: 13.49, result: 'Anemia' }] },           // 0-7 días: HB < 13.5
   { ageMax: 4 * WEEK, stats: [{ anemiaLimit: 9.99, result: 'Anemia' }] },        // 8-28 días: HB < 10.0
   { ageMax: 8 * WEEK, stats: [{ anemiaLimit: 8.99, result: 'Anemia' }] },        // 29-56 días: HB < 9.0
   { ageMax: 6 * MONTH, stats: [{ anemiaLimit: 10.99, result: 'Anemia' }] },      // 57-180 días: HB < 11.0
];

console.log('=== VALIDACIÓN DESPUÉS DE LA CORRECCIÓN ===\n');

// Casos de prueba mejorados
const testCases = [
   { dias: 5, hb: 13, descripcion: '5 días', esperado: 'Anemia' },
   { dias: 7, hb: 13.5, descripcion: '7 días', esperado: 'Paciente Sano' },
   { dias: 20, hb: 9.5, descripcion: '20 días (3 semanas)', esperado: 'Anemia' },
   { dias: 28, hb: 10, descripcion: '28 días (4 semanas)', esperado: 'Paciente Sano' },
   { dias: 50, hb: 8.5, descripcion: '50 días', esperado: 'Anemia' },
   { dias: 56, hb: 9, descripcion: '56 días (8 semanas)', esperado: 'Paciente Sano' },
   { dias: 60, hb: 10.5, descripcion: '60 días (2 meses)', esperado: 'Anemia' },     // CASO CRÍTICO
   { dias: 90, hb: 10.5, descripcion: '90 días (3 meses)', esperado: 'Anemia' },     // CASO CRÍTICO
   { dias: 120, hb: 10.5, descripcion: '120 días (4 meses)', esperado: 'Anemia' },   // CASO CRÍTICO
   { dias: 150, hb: 10.5, descripcion: '150 días (5 meses)', esperado: 'Anemia' },   // CASO CRÍTICO
   { dias: 180, hb: 11, descripcion: '180 días (6 meses)', esperado: 'Paciente Sano' },
];

let correctos = 0;
let incorrectos = 0;

testCases.forEach(({ dias, hb, descripcion, esperado }) => {
   const regla = genericRules.find(obj => dias <= obj.ageMax);
   
   if (regla) {
      const resultado = hb <= regla.stats[0].anemiaLimit ? regla.stats[0].result : 'Paciente Sano';
      const esCorrectoAhora = resultado === esperado;
      
      if (esCorrectoAhora) correctos++;
      else incorrectos++;
      
      const emoji = esCorrectoAhora ? '✅' : '❌';
      console.log(`${emoji} ${descripcion}:`);
      console.log(`   HB: ${hb} g/dL | Límite: ≤${regla.stats[0].anemiaLimit} g/dL`);
      console.log(`   Resultado: ${resultado} | Esperado: ${esperado}`);
      if (!esCorrectoAhora) {
         console.log(`   ⚠️  ERROR: Debería dar "${esperado}"`);
      }
      console.log('');
   }
});

console.log('\n=== RESUMEN DE VALIDACIÓN ===');
console.log(`✅ Casos correctos: ${correctos}/${testCases.length}`);
console.log(`❌ Casos incorrectos: ${incorrectos}/${testCases.length}`);

if (incorrectos === 0) {
   console.log('\n🎉 ¡TODAS LAS PRUEBAS PASARON! El problema ha sido corregido.\n');
} else {
   console.log('\n⚠️  Aún hay casos que fallan. Revisar las reglas.\n');
}
