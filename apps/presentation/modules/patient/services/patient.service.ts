import type { Patient } from '@/modules/patient/dto/patient.dto';
import dayjs from "dayjs";

export const getPatientInfo = (patient: Patient) => {
  if (!patient) return "No hay datos del paciente";

  const edad = patient.birthDate
    ? Number(dayjs().diff(dayjs(patient.birthDate), "year", true)).toFixed(1)
    : "Desconocida";

  const genero = patient.gender
    ? patient.gender === 'M'
      ? 'Masculino'
      : 'Femenino'
    : "No especificado";

  const adicional = patient.femaleAditional
    ? patient.femaleAditional === 'G'
      ? "Gestante"
      : "Puerperio"
    : "N/A";

  const trimestre = patient.gestationTime
    ? `${patient.gestationTime}° trimestre`
    : "N/A";

  return `
   Edad: ${edad} años
   Género: ${genero}
   Condición adicional: ${adicional}
   Tiempo de gestación: ${trimestre}
   Peso: ${patient.weight ?? "N/A"} kg
   Factor de correccion: ${patient.hbObserved ?? "N/A"} g/dL  
   Hb Observada:  ${patient.hbFixed ?? "N/A"} g/dL
   Hb Corregida: ${patient?.hbObserved != null && patient?.hbFixed != null
      ? patient.hbFixed - patient.hbObserved
      : "N/A"
    } g/dL
   Diagnóstico: ${patient.diagnostic ?? "N/A"}
`.trim();
};

export function getPatientDiagnostic(patient: Patient) {
  return patient.diagnostic
}

// get the patient age in years
export function getPatientAge(patient: Patient) {
  const birthDate = dayjs(patient.birthDate, "YYYY-MM-DD")
  console.log("Debuggin for age" + dayjs().diff(birthDate, "year"))
  return dayjs().diff(birthDate, "year")
}