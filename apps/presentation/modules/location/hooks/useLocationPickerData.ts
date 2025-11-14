import { useState } from 'react';
import { PickerValue } from 'react-native-ui-lib';
import departments from '@/utils/json/departments.json';
import department_province from '@/utils/json/department_province.json';
import province_district from '@/utils/json/province_district.json';
import district_town from '@/utils/json/district_town.json';

const townAdjustHb: TownAdjustHbJson = require('@/utils/json/town_adjustHB.json') as TownAdjustHbJson;

type TownAdjustHbItem = {
   location: string;
   sublocation: string[];
}
type TownAdjustHbJson = TownAdjustHbItem[];

type LocationSelection = {
   department: string;
   province: string;
   district: string;
   town: string;
   adjustHB: number;
}

const getSublocations = (json: any[], location: string) => {
   const item = json.find((d) => d.location === location);
   const sublocations = item?.sublocation || [];
   return sublocations.map((sub: string) => ({
      label: sub,
      value: sub,
   }));
};

const getAdjustHB = (townName: string): number => {
   const item = townAdjustHb.find((d) => d.location === townName);
   const adjustValue = item?.sublocation[0] || '0';
   // Convert "2,5" to 2.5
   return parseFloat(adjustValue.replace(',', '.'));
};

export const useLocationPickerData = () => {
   const [location, setLocation] = useState<LocationSelection>({
      department: '',
      province: '',
      district: '',
      town: '',
      adjustHB: 0,
   });

   const onLocationChange = (key: keyof LocationSelection) => (value: PickerValue) => {
      if (typeof value !== 'string') {
         console.warn('Invalid location value');
         return;
      }

      setLocation(prev => {
         switch (key) {
            case 'department':
               return {
                  department: value,
                  province: '',
                  district: '',
                  town: '',
                  adjustHB: 0
               };
            case 'province':
               return {
                  ...prev,
                  province: value,
                  district: '',
                  town: '',
                  adjustHB: 0
               };
            case 'district':
               return {
                  ...prev,
                  district: value,
                  town: '',
                  adjustHB: 0
               };
            case 'town':
               return {
                  ...prev,
                  town: value,
                  adjustHB: getAdjustHB(value)
               };
            default:
               return prev;
         }
      });
   };

   const isValidLocation = () => {
      return location.department !== '' &&
         location.province !== '' &&
         location.district !== '' &&
         location.town !== '';
   };

   const departmentItems = departments;
   const provinceItems = getSublocations(department_province, location.department);
   const districtItems = getSublocations(province_district, location.province);
   const townItems = getSublocations(district_town, location.district);

   return {
      location,
      setLocation,
      onLocationChange,
      departmentItems,
      provinceItems,
      districtItems,
      townItems,
      isValidLocation
   };
};
