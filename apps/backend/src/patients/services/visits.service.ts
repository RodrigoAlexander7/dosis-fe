import {
   Injectable,
   NotFoundException,
   ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import {
   CreatePatientVisitDto,
   UpdatePatientVisitDto,
   SearchVisitDto,
   PaginatedVisitResponseDto,
} from '../dto/patient-visit.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class VisitsService {
   constructor(private readonly prisma: PrismaService) { }

   /**
    * Create a new visit for an existing patient (Nuevo Caso)
    * Values hbAdjusted and anemiaSeverity are calculated in frontend
    */
   async create(dto: CreatePatientVisitDto, userId: string) {
      // Verify patient exists
      const patient = await this.prisma.patient.findUnique({
         where: { dni: dto.patientDni },
      });

      if (!patient) {
         throw new NotFoundException(
            `Paciente con DNI ${dto.patientDni} no encontrado. Use "Nuevo Paciente" para crear un nuevo paciente.`,
         );
      }

      // Verify supplements exist if prescriptions are provided
      if (dto.prescriptions && dto.prescriptions.length > 0) {
         const supplementIds = dto.prescriptions.map((p) => p.idSupplement);
         const supplements = await this.prisma.supplement.findMany({
            where: { idSupplement: { in: supplementIds } },
         });

         if (supplements.length !== supplementIds.length) {
            throw new NotFoundException(
               'Uno o más suplementos no fueron encontrados',
            );
         }
      }

      const visit = await this.prisma.patientVisit.create({
         data: {
            patientDni: dto.patientDni,
            visitDate: new Date(dto.visitDate),
            weight: dto.weight,
            hbObserved: dto.hbObserved,
            hbAdjusted: dto.hbAdjusted,
            anemiaSeverity: dto.anemiaSeverity as any,
            femaleAdditional: dto.femaleAdditional as any,
            gestationTrimester: dto.gestationTrimester as any,
            createdById: userId,
            prescriptions: dto.prescriptions
               ? {
                  create: dto.prescriptions.map((p) => ({
                     idSupplement: p.idSupplement,
                     prescribedDose: p.prescribedDose,
                     treatmentDurationDays: p.treatmentDurationDays,
                     prescriptionNotes: p.prescriptionNotes || '',
                  })),
               }
               : undefined,
         },
         include: {
            patient: {
               include: {
                  department: true,
                  province: true,
                  district: true,
                  town: true,
               },
            },
            createdBy: {
               select: {
                  id: true,
                  name: true,
                  email: true,
                  role: true,
               },
            },
            prescriptions: {
               include: {
                  supplement: true,
               },
            },
         },
      });

      return visit;
   }

   /**
    * Find visit by ID
    */
   async findById(visitId: number) {
      const visit = await this.prisma.patientVisit.findUnique({
         where: { visitId },
         include: {
            patient: {
               include: {
                  department: true,
                  province: true,
                  district: true,
                  town: true,
               },
            },
            createdBy: {
               select: {
                  id: true,
                  name: true,
                  email: true,
                  role: true,
               },
            },
            prescriptions: {
               include: {
                  supplement: true,
               },
            },
         },
      });

      if (!visit) {
         throw new NotFoundException(`Visita ${visitId} no encontrada`);
      }

      return visit;
   }

   /**
    * Get all visits for a patient
    */
   async findByPatientDni(patientDni: string) {
      const patient = await this.prisma.patient.findUnique({
         where: { dni: patientDni },
      });

      if (!patient) {
         throw new NotFoundException(`Paciente con DNI ${patientDni} no encontrado`);
      }

      const visits = await this.prisma.patientVisit.findMany({
         where: { patientDni },
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
            prescriptions: {
               include: {
                  supplement: true,
               },
            },
         },
      });

      return visits;
   }

   /**
    * Search visits with filters
    */
   async search(searchDto: SearchVisitDto): Promise<PaginatedVisitResponseDto> {
      const page = searchDto.page || 1;
      const limit = searchDto.limit || 20;
      const skip = (page - 1) * limit;

      const where: Prisma.PatientVisitWhereInput = {};

      if (searchDto.anemiaSeverity) {
         where.anemiaSeverity = searchDto.anemiaSeverity as any;
      }

      if (searchDto.dateFrom || searchDto.dateTo) {
         where.visitDate = {};
         if (searchDto.dateFrom) {
            where.visitDate.gte = new Date(searchDto.dateFrom);
         }
         if (searchDto.dateTo) {
            where.visitDate.lte = new Date(searchDto.dateTo);
         }
      }

      const [data, total] = await Promise.all([
         this.prisma.patientVisit.findMany({
            where,
            skip,
            take: limit,
            include: {
               patient: {
                  include: {
                     department: true,
                     province: true,
                     district: true,
                     town: true,
                  },
               },
               createdBy: {
                  select: {
                     id: true,
                     name: true,
                     email: true,
                     role: true,
                  },
               },
            },
            orderBy: { visitDate: 'desc' },
         }),
         this.prisma.patientVisit.count({ where }),
      ]);

      return {
         data: data as any,
         total,
         page,
         limit,
         totalPages: Math.ceil(total / limit),
      };
   }

   /**
    * Update visit (only by doctor who created it or admins)
    */
   async update(
      visitId: number,
      dto: UpdatePatientVisitDto,
      userId: string,
      userRole: string,
   ) {
      const visit = await this.findById(visitId);

      // Only the creator or admin can update
      if (visit.createdById !== userId && userRole !== 'DOCTOR') {
         throw new ForbiddenException(
            'Solo el creador de la visita o un doctor puede actualizarla',
         );
      }

      const updateData: any = { ...dto };

      if (dto.visitDate) {
         updateData.visitDate = new Date(dto.visitDate);
      }

      const updated = await this.prisma.patientVisit.update({
         where: { visitId },
         data: updateData,
         include: {
            patient: {
               include: {
                  department: true,
                  province: true,
                  district: true,
                  town: true,
               },
            },
            createdBy: {
               select: {
                  id: true,
                  name: true,
                  email: true,
                  role: true,
               },
            },
         },
      });

      return updated;
   }

   /**
    * Delete visit (only doctors)
    */
   async delete(visitId: number, userId: string, userRole: string) {
      const visit = await this.findById(visitId);

      // Only doctors can delete visits
      if (userRole !== 'DOCTOR') {
         throw new ForbiddenException('Solo los doctores pueden eliminar visitas');
      }

      await this.prisma.patientVisit.delete({
         where: { visitId },
      });

      return { message: `Visita ${visitId} eliminada exitosamente` };
   }

   /**
    * Get visit statistics
    */
   async getStatistics() {
      const [totalVisits, bySeverity, recentVisits] = await Promise.all([
         this.prisma.patientVisit.count(),
         this.prisma.patientVisit.groupBy({
            by: ['anemiaSeverity'],
            _count: true,
         }),
         this.prisma.patientVisit.count({
            where: {
               visitDate: {
                  gte: new Date(new Date().setDate(new Date().getDate() - 30)),
               },
            },
         }),
      ]);

      return {
         totalVisits,
         byAnemiaSeverity: bySeverity,
         recentVisits,
      };
   }
}
