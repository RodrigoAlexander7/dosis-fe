import { Patient } from "@/modules/patient/dto/patient.dto";
import { getPatientDiagnostic } from "@/modules/patient/services/patient.service";
import { Suplement, suplementSchema } from "@/modules/suplement/dto/suplement.dto";
import suplement_information from "@/utils/json/suplement_information.json";
import suplement_information_adult from "@/utils/json/suplement_information_adult.json";

const suplementItems: Suplement[] = suplementSchema.array().parse(suplement_information);
const suplementItemsAdult: Suplement[] = suplementSchema.array().parse(suplement_information_adult);

// is the daily necesary doses to the child -> we recive the patient's weigth, age(in days), if is anemic and the type of product
export const getDose = (suplementValue: Suplement, age: number, weight: number, isAnemic: boolean): number => {
   console.log(JSON.stringify(suplementValue) + '\n' + age + '\n' + weight + '\n' + isAnemic)
   let doseResult = 0;
   const ageDoseAmount = suplementValue.dose.find((dose) => {
      return age > dose.from_age && age <= dose.to_age
   })?.doseAmount // amount in ml per kg or day

   console.log(ageDoseAmount + '***********')

   if (isAnemic && ageDoseAmount)
      doseResult = weight * ageDoseAmount / suplementValue.elementalIron

   else if (!isAnemic && ageDoseAmount)
      doseResult = weight * 2 / 3 * ageDoseAmount / suplementValue.elementalIron
   console.log(doseResult)
   return doseResult    // return the dose in the respective unit measure cause now we use the elemental iron with the presentation units (not in ml )
}

export const getById = (id: string): Suplement | null => {
   return suplementItems.find(val => val.idSuplement === id) || null
}

const getSuplementByName = (name: string): Suplement | null => {
   return suplementItems.find(val => val.name === name) || null
}

const getAdultSuplementByName = (name: string): Suplement | null => {
   return suplementItemsAdult.find(val => val.name === name) || null
}

export const getInfoToString = (suplement: Suplement): string => {
   let presentation = suplement.presentation || '';

   return (
      `Tipo: ${suplement.type}` + '\n' +
      `Nombre de Producto: ${suplement.name}` + '\n' +
      //`ID de Suplemento: ${suplement.idSuplement}` + '\n' +
      `Presentacion: ${presentation}` + '\n' +
      `Hierro Elemental: Por cada 01 ml contiene ${suplement.elementalIron} mg` + '\n' +
      `Contenido por envase: ${suplement.content}` + 'ml\n' +
      `Notes: ${suplement.notes}` + '\n' +
      `Dosis: ${suplement.dose.map((val) => {
         return (
            `De: ${formatDays(val.from_age)} - ${formatDays(val.to_age)} --> ${val.doseAmount}ml `
         )
      })}` + '\n'
   )
}

export const getBottleNumber = (doseNumber: number, suplement: Suplement) => {
   if (suplement.presentation === 'pastilla') return 0
   else if (suplement.presentation === 'gotas')    // from drops to ml ant then calculate the bottle number
      return Math.ceil((doseNumber / 20 * 30) / suplement.content)
   else return Math.ceil(doseNumber / suplement.content)
}

export const getUnitMeasure = (suplement: Suplement) => {
   if (suplement.presentation === 'gotas') return 'gotas'
   if (suplement.presentation === 'jarabe') return 'ml'
   if (suplement.presentation === 'pastilla') return 'pastillas'

}

// Return the suplement object on json 
export const getAdultTreatment = (patient: Patient) => {
   const gender = patient.gender
   const diagnostic = getPatientDiagnostic(patient)
   if (gender === 'M') {
      if (diagnostic === 'Paciente Sano')
         return getAdultSuplementByName("Tabletas de Sulfato Ferroso 60mg")
      else return getAdultSuplementByName("Tabletas de Sulfato Ferroso 120mg")
   }
   else {   // female
      if (diagnostic !== 'Paciente Sano') {
         return getAdultSuplementByName("Tabletas de Sulfato Ferroso 120mg + Acido Folico 800umg")
      }
      else return getAdultSuplementByName("Tabletas de Sulfato Ferroso 60mg")
   }
}


function formatDays(dias: number) {
   const diasPorAnio = 365;
   const diasPorMes = 30;

   const anios = Math.floor(dias / diasPorAnio);
   const meses = Math.floor((dias % diasPorAnio) / diasPorMes);

   const dispAnios = anios > 0 ? `${anios} años` : ''
   const dispMeses = meses > 0 ? `${meses} meses` : ''
   return dispAnios + dispMeses
}
