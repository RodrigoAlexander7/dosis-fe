import { Module } from '@nestjs/common';
import { PatientsService } from './services/patients.service';
import { VisitsService } from './services/visits.service';
import { PatientsController } from './controllers/patients.controller';
import { VisitsController } from './controllers/visits.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
   imports: [PrismaModule],
   controllers: [PatientsController, VisitsController],
   providers: [PatientsService, VisitsService],
   exports: [PatientsService, VisitsService],
})
export class PatientsModule { }
