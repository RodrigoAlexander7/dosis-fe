import { Module } from '@nestjs/common';
import { SupplementsController } from './supplements.controller';
import { SupplementsService } from './supplements.service';
import { SupplementCalculatorService } from './supplement-calculator.service';
import { PrismaModule } from '@/prisma/prisma.module';

@Module({
   imports: [PrismaModule],
   controllers: [SupplementsController],
   providers: [SupplementsService, SupplementCalculatorService],
   exports: [SupplementsService, SupplementCalculatorService],
})
export class SupplementsModule { }
