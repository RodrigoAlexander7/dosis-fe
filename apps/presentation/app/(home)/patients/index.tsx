import React, { useState } from 'react';
import {
   View,
   Text,
   StyleSheet,
   FlatList,
   TextInput,
   TouchableOpacity,
   ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { patientsApi } from '@/services/api/patients.api';
import { SearchPatientDto, AnemiaSeverity } from '@/services/types/patient.types';
import { PatientCard } from '@/components/PatientCard';
import { useAuthStore, canCreatePatient } from '@/stores/authStore';

export default function PatientsListScreen() {
   const router = useRouter();
   const { user } = useAuthStore();
   const [searchParams, setSearchParams] = useState<SearchPatientDto>({
      page: 1,
      limit: 20,
   });
   const [dniSearch, setDniSearch] = useState('');
   const [yearSearch, setYearSearch] = useState('');
   const [severityFilter, setSeverityFilter] = useState<AnemiaSeverity | undefined>();

   const { data, isLoading, refetch } = useQuery({
      queryKey: ['patients', searchParams],
      queryFn: () => patientsApi.search(searchParams),
   });

   const handleSearch = () => {
      const params: SearchPatientDto = {
         page: 1,
         limit: 20,
      };

      if (dniSearch) params.dni = dniSearch;
      if (yearSearch) params.birthYear = parseInt(yearSearch);
      if (severityFilter) params.anemiaSeverity = severityFilter;

      setSearchParams(params);
   };

   const handleClearFilters = () => {
      setDniSearch('');
      setYearSearch('');
      setSeverityFilter(undefined);
      setSearchParams({ page: 1, limit: 20 });
   };

   const handlePatientPress = (dni: string) => {
      router.push(`/(home)/patients/${dni}`);
   };

   const handleCreatePatient = () => {
      router.push('/(home)/patients/create');
   };

   return (
      <View style={styles.container}>
         {/* Search Section */}
         <View style={styles.searchSection}>
            <View style={styles.searchRow}>
               <TextInput
                  style={styles.searchInput}
                  placeholder="Buscar por DNI"
                  value={dniSearch}
                  onChangeText={setDniSearch}
                  keyboardType="numeric"
                  maxLength={8}
               />
               <TextInput
                  style={styles.searchInput}
                  placeholder="Año de nacimiento"
                  value={yearSearch}
                  onChangeText={setYearSearch}
                  keyboardType="numeric"
                  maxLength={4}
               />
            </View>

            {/* Severity Filter */}
            <View style={styles.filterRow}>
               <Text style={styles.filterLabel}>Severidad:</Text>
               <View style={styles.filterButtons}>
                  {Object.values(AnemiaSeverity).map((severity) => (
                     <TouchableOpacity
                        key={severity}
                        style={[
                           styles.filterButton,
                           severityFilter === severity && styles.filterButtonActive,
                        ]}
                        onPress={() => setSeverityFilter(severity === severityFilter ? undefined : severity)}
                     >
                        <Text
                           style={[
                              styles.filterButtonText,
                              severityFilter === severity && styles.filterButtonTextActive,
                           ]}
                        >
                           {severity}
                        </Text>
                     </TouchableOpacity>
                  ))}
               </View>
            </View>

            <View style={styles.actionRow}>
               <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
                  <Ionicons name="search" size={20} color="#fff" />
                  <Text style={styles.searchButtonText}>Buscar</Text>
               </TouchableOpacity>
               <TouchableOpacity style={styles.clearButton} onPress={handleClearFilters}>
                  <Text style={styles.clearButtonText}>Limpiar</Text>
               </TouchableOpacity>
            </View>
         </View>

         {/* Results Section */}
         <View style={styles.resultsSection}>
            <View style={styles.resultsHeader}>
               <Text style={styles.resultsCount}>
                  {data ? `${data.total} ${data.total === 1 ? 'paciente' : 'pacientes'}` : ''}
               </Text>
               {canCreatePatient(user) && (
                  <TouchableOpacity style={styles.createButton} onPress={handleCreatePatient}>
                     <Ionicons name="add-circle" size={24} color="#2196F3" />
                     <Text style={styles.createButtonText}>Nuevo Paciente</Text>
                  </TouchableOpacity>
               )}
            </View>
            {isLoading ? (
               <ActivityIndicator size="large" color="#2196F3" style={styles.loader} />
            ) : (
               <FlatList
                  data={data?.data || []}
                  renderItem={({ item }) => (
                     <PatientCard
                        patient={item}
                        onPress={() => handlePatientPress(item.dni)}
                        showDetails
                     />
                  )}
                  keyExtractor={(item) => item.dni}
                  contentContainerStyle={styles.listContent}
                  ListEmptyComponent={
                     <View style={styles.emptyState}>
                        <Ionicons name="search-outline" size={64} color="#ccc" />
                        <Text style={styles.emptyText}>No se encontraron pacientes</Text>
                     </View>
                  }
               />
            )}
         </View>
      </View>
   );
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: '#f5f5f5',
   },
   searchSection: {
      backgroundColor: '#fff',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#E0E0E0',
   },
   searchRow: {
      flexDirection: 'row',
      gap: 12,
      marginBottom: 12,
   },
   searchInput: {
      flex: 1,
      height: 44,
      borderWidth: 1,
      borderColor: '#E0E0E0',
      borderRadius: 8,
      paddingHorizontal: 12,
      fontSize: 14,
   },
   filterRow: {
      marginBottom: 12,
   },
   filterLabel: {
      fontSize: 14,
      color: '#666',
      marginBottom: 8,
   },
   filterButtons: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
   },
   filterButton: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: '#E0E0E0',
      backgroundColor: '#fff',
   },
   filterButtonActive: {
      backgroundColor: '#2196F3',
      borderColor: '#2196F3',
   },
   filterButtonText: {
      fontSize: 12,
      color: '#666',
   },
   filterButtonTextActive: {
      color: '#fff',
   },
   actionRow: {
      flexDirection: 'row',
      gap: 12,
   },
   searchButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#2196F3',
      paddingVertical: 12,
      borderRadius: 8,
      gap: 8,
   },
   searchButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
   },
   clearButton: {
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#E0E0E0',
      justifyContent: 'center',
   },
   clearButtonText: {
      color: '#666',
      fontSize: 14,
   },
   resultsSection: {
      flex: 1,
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
   resultsCount: {
      fontSize: 16,
      fontWeight: '600',
      color: '#212121',
   },
   createButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
   },
   createButtonText: {
      fontSize: 14,
      color: '#2196F3',
      fontWeight: '600',
   },
   listContent: {
      padding: 16,
   },
   loader: {
      marginTop: 32,
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
   },
});
