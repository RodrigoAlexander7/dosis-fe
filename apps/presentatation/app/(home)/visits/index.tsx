import React, { useState } from 'react';
import {
   View,
   Text,
   StyleSheet,
   FlatList,
   TouchableOpacity,
   ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { TextField, Button, Colors, DateTimePicker, Picker } from 'react-native-ui-lib';
import { visitsApi } from '@/services/api/visits.api';
import { VisitCard } from '@/components/VisitCard';
import { AnemiaSeverity } from '@/services/types/patient.types';
import dayjs from 'dayjs';
import 'dayjs/locale/es';

dayjs.locale('es');

const SEVERITY_OPTIONS = [
   { label: 'Todos', value: 'ALL' },
   { label: 'Sin Anemia', value: AnemiaSeverity.NONE },
   { label: 'Anemia Leve', value: AnemiaSeverity.MILD },
   { label: 'Anemia Moderada', value: AnemiaSeverity.MODERATE },
   { label: 'Anemia Severa', value: AnemiaSeverity.SEVERE },
];

export default function VisitsListScreen() {
   const router = useRouter();

   // Filters
   const [dniFilter, setDniFilter] = useState('');
   const [startDate, setStartDate] = useState<Date | undefined>(undefined);
   const [endDate, setEndDate] = useState<Date | undefined>(undefined);
   const [severityFilter, setSeverityFilter] = useState<string>('ALL');

   // Build query params
   const queryParams = {
      dni: dniFilter || undefined,
      startDate: startDate ? dayjs(startDate).format('YYYY-MM-DD') : undefined,
      endDate: endDate ? dayjs(endDate).format('YYYY-MM-DD') : undefined,
      anemiaSeverity: severityFilter !== 'ALL' ? (severityFilter as AnemiaSeverity) : undefined,
   };

   const { data: visits, isLoading, refetch } = useQuery({
      queryKey: ['visits', queryParams],
      queryFn: () => visitsApi.search(queryParams),
   });

   const handleClearFilters = () => {
      setDniFilter('');
      setStartDate(undefined);
      setEndDate(undefined);
      setSeverityFilter('ALL');
   };

   const hasActiveFilters = dniFilter || startDate || endDate || severityFilter !== 'ALL';

   return (
      <View style={styles.container}>
         {/* Filters */}
         <View style={styles.filtersCard}>
            <Text style={styles.filtersTitle}>Filtros de Búsqueda</Text>

            <View style={styles.inputGroup}>
               <Text style={styles.label}>DNI del Paciente</Text>
               <TextField
                  style={styles.textInput}
                  value={dniFilter}
                  onChangeText={setDniFilter}
                  keyboardType="numeric"
                  maxLength={8}
                  placeholder="12345678"
                  placeholderTextColor="#A0AEC0"
               />
            </View>

            <View style={styles.dateRow}>
               <View style={styles.dateGroup}>
                  <Text style={styles.label}>Desde</Text>
                  <DateTimePicker
                     mode="date"
                     value={startDate}
                     onChange={setStartDate}
                     placeholder="Seleccionar"
                     style={styles.datePicker}
                     locale="es"
                     maximumDate={new Date()}
                  />
               </View>

               <View style={styles.dateGroup}>
                  <Text style={styles.label}>Hasta</Text>
                  <DateTimePicker
                     mode="date"
                     value={endDate}
                     onChange={setEndDate}
                     placeholder="Seleccionar"
                     style={styles.datePicker}
                     locale="es"
                     maximumDate={new Date()}
                     minimumDate={startDate}
                  />
               </View>
            </View>

            <View style={styles.inputGroup}>
               <Text style={styles.label}>Severidad de Anemia</Text>
               <Picker
                  value={severityFilter}
                  items={SEVERITY_OPTIONS}
                  onChange={(value) => setSeverityFilter(value as string)}
                  style={styles.picker}
                  placeholder="Seleccionar severidad"
               />
            </View>

            {hasActiveFilters && (
               <TouchableOpacity style={styles.clearButton} onPress={handleClearFilters}>
                  <Ionicons name="close-circle" size={20} color="#F44336" />
                  <Text style={styles.clearButtonText}>Limpiar Filtros</Text>
               </TouchableOpacity>
            )}
         </View>

         {/* Results */}
         <View style={styles.resultsHeader}>
            <Text style={styles.resultsTitle}>
               {visits ? `${visits.length} ${visits.length === 1 ? 'visita' : 'visitas'}` : 'Visitas'}
            </Text>
            <TouchableOpacity onPress={() => refetch()} style={styles.refreshButton}>
               <Ionicons name="refresh" size={20} color="#2196F3" />
            </TouchableOpacity>
         </View>

         {isLoading ? (
            <View style={styles.centered}>
               <ActivityIndicator size="large" color="#2196F3" />
               <Text style={styles.loadingText}>Cargando visitas...</Text>
            </View>
         ) : (
            <FlatList
               data={visits}
               renderItem={({ item }) => (
                  <VisitCard
                     visit={item}
                     onPress={() => router.push(`/(home)/visits/${item.id}` as any)}
                  />
               )}
               keyExtractor={(item) => item.id}
               contentContainerStyle={styles.listContent}
               ListEmptyComponent={
                  <View style={styles.emptyState}>
                     <Ionicons name="document-text-outline" size={64} color="#ccc" />
                     <Text style={styles.emptyText}>
                        {hasActiveFilters
                           ? 'No se encontraron visitas con los filtros aplicados'
                           : 'No hay visitas registradas'}
                     </Text>
                  </View>
               }
            />
         )}
      </View>
   );
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: '#F4F7FC',
   },
   filtersCard: {
      backgroundColor: '#fff',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#E0E0E0',
   },
   filtersTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: '#212121',
      marginBottom: 16,
   },
   inputGroup: {
      marginBottom: 12,
   },
   label: {
      fontSize: 14,
      fontWeight: '500',
      color: '#212121',
      marginBottom: 8,
   },
   textInput: {
      borderWidth: 1,
      borderColor: '#E0E0E0',
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      backgroundColor: '#fff',
   },
   dateRow: {
      flexDirection: 'row',
      gap: 12,
      marginBottom: 12,
   },
   dateGroup: {
      flex: 1,
   },
   datePicker: {
      borderWidth: 1,
      borderColor: '#E0E0E0',
      borderRadius: 8,
      padding: 12,
      backgroundColor: '#fff',
   },
   picker: {
      borderWidth: 1,
      borderColor: '#E0E0E0',
      borderRadius: 8,
      backgroundColor: '#fff',
   },
   clearButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      paddingVertical: 10,
      marginTop: 8,
   },
   clearButtonText: {
      fontSize: 14,
      color: '#F44336',
      fontWeight: '500',
   },
   resultsHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
      backgroundColor: '#fff',
      borderBottomWidth: 1,
      borderBottomColor: '#E0E0E0',
   },
   resultsTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: '#212121',
   },
   refreshButton: {
      padding: 8,
   },
   centered: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 32,
   },
   loadingText: {
      marginTop: 16,
      fontSize: 14,
      color: '#666',
   },
   listContent: {
      padding: 16,
   },
   emptyState: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 64,
   },
   emptyText: {
      fontSize: 16,
      color: '#999',
      marginTop: 16,
      textAlign: 'center',
   },
});
