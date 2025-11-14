import { LocationPicker } from '@/modules/location/components/LocationPicker'
import { getPatientAge } from '@/modules/patient/services/patient.service'
import { usePatientStore } from '@/modules/patient/store/patientStore'
import { router } from 'expo-router'
import { ScrollView, View } from 'react-native'
import { Button } from 'react-native-ui-lib'

export default function RegisterScreen() {
   const { patient } = usePatientStore()

   const handlePressButton = () => {
      const patientAge = getPatientAge(patient)
      if (patientAge < 12) router.navigate('/childTreatment')
      else
         router.navigate('/adultTreatment')
   }


   return (
      <ScrollView>
         <LocationPicker />

         <View>
            <Button
               style={{ marginBottom: 25 }}
               label='Ir a Tratamiento'
               onPress={handlePressButton}
            />
         </View>
      </ScrollView>
   )
}
