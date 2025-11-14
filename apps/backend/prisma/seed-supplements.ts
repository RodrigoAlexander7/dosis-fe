import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
   console.log('🌱 Starting seed for supplements...');

   const supplementsPath = path.join(__dirname, '../../utils/json/suplement_information.json');
   const supplementsAdultPath = path.join(__dirname, '../../utils/json/suplement_information_adult.json');

   const supplementsData = JSON.parse(fs.readFileSync(supplementsPath, 'utf-8'));
   const supplementsAdultData = JSON.parse(fs.readFileSync(supplementsAdultPath, 'utf-8'));

   const allSupplements = [...supplementsData, ...supplementsAdultData];

   console.log(`📍 Creating ${allSupplements.length} supplements...`);

   const presentationMap: Record<string, string> = {
      'jarabe': 'SYRUP',
      'gotas': 'DROPS',
      'pastilla': 'TABLET',
      'polvo': 'POWDER',
   };

   for (const supp of allSupplements) {
      const presentation = presentationMap[supp.presentation.toLowerCase()] || 'TABLET';

      const supplement = await prisma.supplement.upsert({
         where: { idSupplement: supp.idSuplement },
         update: {
            name: supp.name,
            type: supp.type,
            presentation: presentation as any,
            elementalIron: supp.elementalIron,
            content: supp.content,
            notes: supp.notes,
         },
         create: {
            idSupplement: supp.idSuplement,
            name: supp.name,
            type: supp.type,
            presentation: presentation as any,
            elementalIron: supp.elementalIron,
            content: supp.content,
            notes: supp.notes,
         },
      });

      console.log(`  ✅ Supplement: ${supplement.name}`);

      // Create dosing guidelines
      for (const dose of supp.dose) {
         await prisma.supplementDose.upsert({
            where: {
               idSupplement_fromAgeDays_toAgeDays: {
                  idSupplement: supp.idSuplement,
                  fromAgeDays: dose.from_age,
                  toAgeDays: dose.to_age,
               },
            },
            update: {
               doseAmount: dose.doseAmount,
            },
            create: {
               idSupplement: supp.idSuplement,
               fromAgeDays: dose.from_age,
               toAgeDays: dose.to_age,
               doseAmount: dose.doseAmount,
            },
         });
      }
   }

   console.log(`\n✅ ${allSupplements.length} supplements created successfully`);

   const supplementCount = await prisma.supplement.count();
   const doseCount = await prisma.supplementDose.count();

   console.log(`\n📊 Summary:`);
   console.log(`   - Supplements in DB: ${supplementCount}`);
   console.log(`   - Dosing guidelines: ${doseCount}`);
}

main()
   .catch((e) => {
      console.error('❌ Error during seed:', e);
      process.exit(1);
   })
   .finally(async () => {
      await prisma.$disconnect();
   });
