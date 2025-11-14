import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class LocationsService {
   constructor(private readonly prisma: PrismaService) { }

   async getDepartments() {
      return this.prisma.department.findMany({
         orderBy: { name: 'asc' },
      });
   }

   async getProvinces(departmentId: number) {
      return this.prisma.province.findMany({
         where: { departmentId },
         orderBy: { name: 'asc' },
      });
   }

   async getDistricts(provinceId: number) {
      return this.prisma.district.findMany({
         where: { provinceId },
         orderBy: { name: 'asc' },
      });
   }

   async getTowns(districtId: number) {
      return this.prisma.town.findMany({
         where: { districtId },
         orderBy: { name: 'asc' },
      });
   }

   async resolveLocationIds(
      departmentName: string,
      provinceName: string,
      districtName: string,
      townName: string,
      altitudeAdjustment: number
   ) {
      // Find or create department
      let department = await this.prisma.department.findFirst({
         where: { name: departmentName }
      });
      if (!department) {
         department = await this.prisma.department.create({
            data: { name: departmentName }
         });
      }

      // Find or create province
      let province = await this.prisma.province.findFirst({
         where: {
            name: provinceName,
            departmentId: department.id
         }
      });
      if (!province) {
         province = await this.prisma.province.create({
            data: {
               name: provinceName,
               departmentId: department.id
            }
         });
      }

      // Find or create district
      let district = await this.prisma.district.findFirst({
         where: {
            name: districtName,
            provinceId: province.id
         }
      });
      if (!district) {
         district = await this.prisma.district.create({
            data: {
               name: districtName,
               provinceId: province.id
            }
         });
      }

      // Find or create town
      let town = await this.prisma.town.findFirst({
         where: {
            name: townName,
            districtId: district.id
         }
      });
      if (!town) {
         town = await this.prisma.town.create({
            data: {
               name: townName,
               districtId: district.id,
               altitudeAdjustment: new Prisma.Decimal(altitudeAdjustment)
            }
         });
      }

      return {
         departmentId: department.id,
         provinceId: province.id,
         districtId: district.id,
         townId: town.id
      };
   }
}
