import {
   Injectable,
   NotFoundException,
   ConflictException,
   BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import {
   CreatePatientDto,
   UpdatePatientDto,
   SearchPatientDto,
   PaginatedPatientResponseDto,
} from '../dto/patient.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class PatientsService {
   constructor(
      private readonly prisma: PrismaService,
   ) { }

   /**
    * Create a new patient with first visit
    * Values hbAdjusted and anemiaSeverity are calculated in frontend
    */
   async create(dto: CreatePatientDto, userId: string) {
      const existingPatient = await this.prisma.patient.findUnique({
         where: { dni: dto.dni },
      });

      if (existingPatient) {
         throw new ConflictException(
            `Paciente con DNI ${dto.dni} ya existe. Use "Nuevo Caso" para agregar una visita.`,
         );
      }

      await this.validateLocationHierarchy(
         dto.departmentId,
         dto.provinceId,
         dto.districtId,
         dto.townId,
      );

      const patient = await this.prisma.patient.create({
         data: {
            dni: dto.dni,
            birthDate: new Date(dto.birthDate),
            gender: dto.gender as any,
            departmentId: dto.departmentId,
            provinceId: dto.provinceId,
            districtId: dto.districtId,
            townId: dto.townId,
            createdById: userId,
            updatedById: userId,
            visits: {
               create: {
                  visitDate: new Date(dto.firstVisit.visitDate),
                  weight: dto.firstVisit.weight,
                  hbObserved: dto.firstVisit.hbObserved,
                  hbAdjusted: dto.firstVisit.hbAdjusted,
                  anemiaSeverity: dto.firstVisit.anemiaSeverity as any,
                  femaleAdditional: dto.firstVisit.femaleAdditional as any,
                  gestationTrimester: dto.firstVisit.gestationTrimester as any,
                  createdById: userId,
               },
            },
         },
         include: {
            department: true,
            province: true,
            district: true,
            town: true,
            visits: {
               orderBy: { visitDate: 'desc' },
               take: 1,
            },
         },
      });

      return patient;
   }

   async findByDni(dni: string) {
      const patient = await this.prisma.patient.findUnique({
         where: { dni },
         include: {
            department: true,
            province: true,
            district: true,
            town: true,
            visits: {
               orderBy: { visitDate: 'desc' },
               include: {
                  createdBy: {
                     select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                     },
                  },
               },
            },
            createdBy: {
               select: {
                  id: true,
                  name: true,
                  email: true,
               },
            },
            updatedBy: {
               select: {
                  id: true,
                  name: true,
                  email: true,
               },
            },
         },
      });

      if (!patient) {
         throw new NotFoundException(`Paciente con DNI ${dni} no encontrado`);
      }

      return patient;
   }

   async search(searchDto: SearchPatientDto): Promise<PaginatedPatientResponseDto> {
      const page = searchDto.page || 1;
      const limit = searchDto.limit || 20;
      const skip = (page - 1) * limit;

      const where: Prisma.PatientWhereInput = {};

      if (searchDto.dni) {
         where.dni = { contains: searchDto.dni };
      }

      if (searchDto.birthYear) {
         const startDate = new Date(`${searchDto.birthYear}-01-01`);
         const endDate = new Date(`${searchDto.birthYear}-12-31`);
         where.birthDate = {
            gte: startDate,
            lte: endDate,
         };
      }

      if (searchDto.anemiaSeverity) {
         where.visits = {
            some: {
               anemiaSeverity: searchDto.anemiaSeverity as any,
            },
         };
      }

      const [data, total] = await Promise.all([
         this.prisma.patient.findMany({
            where,
            skip,
            take: limit,
            include: {
               department: true,
               province: true,
               district: true,
               town: true,
               visits: {
                  orderBy: { visitDate: 'desc' },
                  take: 1,
               },
            },
            orderBy: { createdAt: 'desc' },
         }),
         this.prisma.patient.count({ where }),
      ]);

      return {
         data: data as any,
         total,
         page,
         limit,
         totalPages: Math.ceil(total / limit),
      };
   }

   async update(dni: string, dto: UpdatePatientDto, userId: string) {
      const patient = await this.findByDni(dni);

      if (dto.departmentId || dto.provinceId || dto.districtId || dto.townId) {
         await this.validateLocationHierarchy(
            dto.departmentId || patient.departmentId,
            dto.provinceId || patient.provinceId,
            dto.districtId || patient.districtId,
            dto.townId || patient.townId,
         );
      }

      const updateData: any = {
         ...dto,
         updatedById: userId,
      };

      if (dto.birthDate) {
         updateData.birthDate = new Date(dto.birthDate);
      }

      const updated = await this.prisma.patient.update({
         where: { dni },
         data: updateData,
         include: {
            department: true,
            province: true,
            district: true,
            town: true,
            visits: {
               orderBy: { visitDate: 'desc' },
               take: 5,
            },
         },
      });

      return updated;
   }

   async delete(dni: string) {
      await this.findByDni(dni);
      await this.prisma.patient.delete({ where: { dni } });
      return { message: `Paciente con DNI ${dni} eliminado exitosamente` };
   }

   private async validateLocationHierarchy(
      departmentId: number,
      provinceId: number,
      districtId: number,
      townId: number,
   ): Promise<void> {
      const province = await this.prisma.province.findFirst({
         where: { id: provinceId, departmentId },
      });

      if (!province) {
         throw new BadRequestException(
            'La provincia no pertenece al departamento seleccionado',
         );
      }

      const district = await this.prisma.district.findFirst({
         where: { id: districtId, provinceId },
      });

      if (!district) {
         throw new BadRequestException(
            'El distrito no pertenece a la provincia seleccionada',
         );
      }

      const town = await this.prisma.town.findFirst({
         where: { id: townId, districtId },
      });

      if (!town) {
         throw new BadRequestException(
            'El centro poblado no pertenece al distrito seleccionado',
         );
      }
   }

   async getStatistics(userId?: string) {
      const where: Prisma.PatientWhereInput = userId ? { createdById: userId } : {};

      const [total, byGender, bySeverity] = await Promise.all([
         this.prisma.patient.count({ where }),
         this.prisma.patient.groupBy({
            by: ['gender'],
            where,
            _count: true,
         }),
         this.prisma.patientVisit.groupBy({
            by: ['anemiaSeverity'],
            _count: true,
         }),
      ]);

      return {
         totalPatients: total,
         byGender,
         byAnemiaSeverity: bySeverity,
      };
   }
}
