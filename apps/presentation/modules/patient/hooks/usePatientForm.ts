import { Patient, patientSchema } from '@/modules/patient/dto/patient.dto';
import dayjs from 'dayjs';
import { useState } from "react";

export const usePatientForm = () => {
   const [idDocument, setIdDocument] = useState('')
   const [birthDate, setBirthDate] = useState<dayjs.Dayjs>(dayjs())
   const [gender, setGender] = useState<'M' | 'F'>('M')
   const [femaleAditional, setFemaleAditional] = useState<'G' | 'P' | null>(null)
   const [gestationTime, setGestationTime] = useState<'1' | '2' | '3' | null>(null)
   const [weight, setWeight] = useState<number>(0);
   const [diagnostic, setDiagnostic] = useState<string>('')

   const patient: Patient = {
      idDocument: 'Not asignable in this version',
      birthDate: birthDate.format("YYYY-MM-DD"),   // formating to the supabase model acepted for date
      gender,
      weight,
      femaleAditional,
      gestationTime,
      hbObserved: 0,
      hbFixed: 0,
      diagnostic,
      location: {
         department: 'notAsignedYet',
         province: 'notAsignedYet',
         district: 'notAsignedYet',
         town: 'notAsignedYet',
         adjustHB: 'notAsignedYet'
      }
   }

   const isValid = (): boolean => {
      const result = patientSchema.safeParse(patient)
      const notDefaultWeight = () => {
         if (weight != 0 && weight != null)
            return true
         return false
      }
      return result.success && notDefaultWeight()
   }

   return {
      idDocument, setIdDocument,
      birthDate, setBirthDate,
      gender, setGender,
      weight, setWeight,
      femaleAditional, setFemaleAditional,
      gestationTime, setGestationTime,
      diagnostic, setDiagnostic,
      patient,
      isValid,
   }
}