import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

interface LocationData {
   location: string;
   sublocation: string[];
}

interface TownData {
   location: string;
   sublocation: string[]; // [altitudeAdjustment]
}

async function main() {
   console.log('🌱 Starting seed for Arequipa data...');

   // Read JSON files (rutas desde apps/backend/prisma hacia utils/jsons)
   const departmentsPath = path.join(__dirname, '../../../utils/jsons/departments.json');
   const provincesPath = path.join(__dirname, '../../../utils/jsons/department_province.json');
   const districtsPath = path.join(__dirname, '../../../utils/jsons/province_district.json');
   const townsPath = path.join(__dirname, '../../../utils/jsons/district_town.json');
   const townAdjustPath = path.join(__dirname, '../../../utils/jsons/town_adjustHB.json'); const departments: string[] = JSON.parse(fs.readFileSync(departmentsPath, 'utf-8'));
   const provincesData: LocationData[] = JSON.parse(fs.readFileSync(provincesPath, 'utf-8'));
   const districtsData: LocationData[] = JSON.parse(fs.readFileSync(districtsPath, 'utf-8'));
   const townsData: LocationData[] = JSON.parse(fs.readFileSync(townsPath, 'utf-8'));
   const townAdjustData: TownData[] = JSON.parse(fs.readFileSync(townAdjustPath, 'utf-8'));

   // Find Arequipa in departments
   if (!departments.includes('AREQUIPA')) {
      throw new Error('AREQUIPA not found in departments.json');
   }

   // 1. Create Department: AREQUIPA
   console.log('📍 Creating department: AREQUIPA...');
   const department = await prisma.department.upsert({
      where: { name: 'AREQUIPA' },
      update: {},
      create: { name: 'AREQUIPA' },
   });
   console.log(`✅ Department created with ID: ${department.id}`);

   // 2. Get provinces of AREQUIPA
   const arequipaProvinces = provincesData.find((p) => p.location === 'AREQUIPA');
   if (!arequipaProvinces) {
      throw new Error('Provinces for AREQUIPA not found');
   }

   console.log(`📍 Creating ${arequipaProvinces.sublocation.length} provinces...`);

   for (const provinceName of arequipaProvinces.sublocation) {
      const province = await prisma.province.upsert({
         where: {
            name_departmentId: {
               name: provinceName,
               departmentId: department.id,
            },
         },
         update: {},
         create: {
            name: provinceName,
            departmentId: department.id,
         },
      });
      console.log(`  ✅ Province: ${provinceName} (ID: ${province.id})`);

      // 3. Get districts for this province
      const provinceDistricts = districtsData.find((d) => d.location === provinceName);
      if (!provinceDistricts) {
         console.warn(`  ⚠️  No districts found for province: ${provinceName}`);
         continue;
      }

      console.log(`  📍 Creating ${provinceDistricts.sublocation.length} districts for ${provinceName}...`);

      for (const districtName of provinceDistricts.sublocation) {
         const district = await prisma.district.upsert({
            where: {
               name_provinceId: {
                  name: districtName,
                  provinceId: province.id,
               },
            },
            update: {},
            create: {
               name: districtName,
               provinceId: province.id,
            },
         });
         console.log(`    ✅ District: ${districtName} (ID: ${district.id})`);

         // 4. Get towns for this district
         const districtTowns = townsData.find((t) => t.location === districtName);
         if (!districtTowns) {
            console.warn(`    ⚠️  No towns found for district: ${districtName}`);
            continue;
         }

         console.log(`    📍 Creating ${districtTowns.sublocation.length} towns for ${districtName}...`);

         for (const townName of districtTowns.sublocation) {
            // Find altitude adjustment for this town
            const townAdjust = townAdjustData.find((t) => t.location === townName);
            const altitudeAdjustment = townAdjust && townAdjust.sublocation.length > 0
               ? parseFloat(townAdjust.sublocation[0].replace(',', '.'))
               : 0;

            await prisma.town.upsert({
               where: {
                  name_districtId: {
                     name: townName,
                     districtId: district.id,
                  },
               },
               update: {},
               create: {
                  name: townName,
                  districtId: district.id,
                  altitudeAdjustment,
               },
            });
         }
         console.log(`    ✅ ${districtTowns.sublocation.length} towns created for ${districtName}`);
      }
   }

   console.log('\n🎉 Seed completed successfully!');
   console.log(`\n📊 Summary:`);
   console.log(`   - Department: AREQUIPA`);
   console.log(`   - Provinces: ${arequipaProvinces.sublocation.length}`);

   const stats = await prisma.$transaction([
      prisma.province.count({ where: { departmentId: department.id } }),
      prisma.district.count({ where: { province: { departmentId: department.id } } }),
      prisma.town.count({ where: { district: { province: { departmentId: department.id } } } }),
   ]);

   console.log(`   - Districts: ${stats[1]}`);
   console.log(`   - Towns: ${stats[2]}`);
}

main()
   .catch((e) => {
      console.error('❌ Error during seed:', e);
      process.exit(1);
   })
   .finally(async () => {
      await prisma.$disconnect();
   });
