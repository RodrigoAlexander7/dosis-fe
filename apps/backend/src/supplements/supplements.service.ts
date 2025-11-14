import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class SupplementsService {
   constructor(private readonly prisma: PrismaService) { }

   /**
    * Get all supplements with their dosing guidelines
    */
   async findAll() {
      return this.prisma.supplement.findMany({
         include: {
            dosingGuidelines: {
               orderBy: {
                  fromAgeDays: 'asc',
               },
            },
         },
         orderBy: {
            name: 'asc',
         },
      });
   }

   /**
    * Get supplement by ID with dosing guidelines
    */
   async findById(idSupplement: string) {
      return this.prisma.supplement.findUnique({
         where: { idSupplement },
         include: {
            dosingGuidelines: {
               orderBy: {
                  fromAgeDays: 'asc',
               },
            },
         },
      });
   }

   /**
    * Get recommended supplements based on patient age (in days)
    */
   async getRecommendedSupplements(ageDays: number) {
      // Get all supplements that have dosing guidelines for this age
      const supplements = await this.prisma.supplement.findMany({
         where: {
            dosingGuidelines: {
               some: {
                  fromAgeDays: {
                     lte: ageDays,
                  },
                  toAgeDays: {
                     gte: ageDays,
                  },
               },
            },
         },
         include: {
            dosingGuidelines: {
               where: {
                  fromAgeDays: {
                     lte: ageDays,
                  },
                  toAgeDays: {
                     gte: ageDays,
                  },
               },
            },
         },
         orderBy: {
            name: 'asc',
         },
      });

      return supplements;
   }
}
