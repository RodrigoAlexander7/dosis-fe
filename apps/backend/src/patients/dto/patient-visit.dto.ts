import {
   IsString,
   IsDateString,
   IsEnum,
   IsNumber,
   Min,
   Max,
   Length,
   Matches,
   IsOptional,
   IsInt,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { FemaleAdditional, GestationTrimester, AnemiaSeverity } from './patient.dto';

export class CreatePatientVisitDto {
   @ApiProperty({
      description: 'DNI del paciente (8 dígitos)',
      example: '12345678',
   })
   @IsString()
   @Length(8, 8, { message: 'DNI debe tener exactamente 8 dígitos' })
   @Matches(/^\d{8}$/, { message: 'DNI debe contener solo números' })
   patientDni: string;

   @ApiProperty({
      description: 'Fecha de la visita',
      example: '2024-01-15',
   })
   @IsDateString()
   visitDate: string;

   @ApiProperty({
      description: 'Peso del paciente en kg en esta visita',
      example: 70.5,
   })
   @IsNumber()
   @Min(0.5)
   @Max(300)
   weight: number;

   @ApiProperty({
      description: 'Hemoglobina observada (medida directa)',
      example: 11.5,
   })
   @IsNumber()
   @Min(0)
   @Max(25)
   hbObserved: number;

   @ApiProperty({
      description: 'Hemoglobina ajustada por altitud (calculada en frontend)',
      example: 10.2,
   })
   @IsNumber()
   @Min(0)
   @Max(25)
   hbAdjusted: number;

   @ApiProperty({
      description: 'Severidad de anemia (calculada en frontend)',
      enum: AnemiaSeverity,
      example: AnemiaSeverity.MILD,
   })
   @IsEnum(AnemiaSeverity)
   anemiaSeverity: AnemiaSeverity;

   @ApiProperty({
      description: 'Condición adicional para pacientes femeninos',
      enum: FemaleAdditional,
      example: FemaleAdditional.NONE,
   })
   @IsEnum(FemaleAdditional)
   femaleAdditional: FemaleAdditional;

   @ApiProperty({
      description: 'Trimestre de gestación (solo si es gestante)',
      enum: GestationTrimester,
      example: GestationTrimester.NONE,
   })
   @IsEnum(GestationTrimester)
   gestationTrimester: GestationTrimester;
}

export class UpdatePatientVisitDto {
   @ApiProperty({
      description: 'Fecha de la visita',
      example: '2024-01-15',
      required: false,
   })
   @IsOptional()
   @IsDateString()
   visitDate?: string;

   @ApiProperty({
      description: 'Peso del paciente en kg',
      example: 70.5,
      required: false,
   })
   @IsOptional()
   @IsNumber()
   @Min(0.5)
   @Max(300)
   weight?: number;

   @ApiProperty({
      description: 'Hemoglobina observada',
      example: 11.5,
      required: false,
   })
   @IsOptional()
   @IsNumber()
   @Min(0)
   @Max(25)
   hbObserved?: number;

   @ApiProperty({
      description: 'Hemoglobina ajustada',
      example: 10.2,
      required: false,
   })
   @IsOptional()
   @IsNumber()
   @Min(0)
   @Max(25)
   hbAdjusted?: number;

   @ApiProperty({
      description: 'Severidad de anemia',
      enum: AnemiaSeverity,
      required: false,
   })
   @IsOptional()
   @IsEnum(AnemiaSeverity)
   anemiaSeverity?: AnemiaSeverity;

   @ApiProperty({
      description: 'Condición adicional para pacientes femeninos',
      enum: FemaleAdditional,
      required: false,
   })
   @IsOptional()
   @IsEnum(FemaleAdditional)
   femaleAdditional?: FemaleAdditional;

   @ApiProperty({
      description: 'Trimestre de gestación',
      enum: GestationTrimester,
      required: false,
   })
   @IsOptional()
   @IsEnum(GestationTrimester)
   gestationTrimester?: GestationTrimester;
}

export class SearchVisitDto {
   @ApiProperty({
      description: 'Severidad de anemia',
      enum: AnemiaSeverity,
      required: false,
   })
   @IsOptional()
   @IsEnum(AnemiaSeverity)
   anemiaSeverity?: AnemiaSeverity;

   @ApiProperty({
      description: 'Fecha desde (búsqueda por rango)',
      example: '2024-01-01',
      required: false,
   })
   @IsOptional()
   @IsDateString()
   dateFrom?: string;

   @ApiProperty({
      description: 'Fecha hasta (búsqueda por rango)',
      example: '2024-12-31',
      required: false,
   })
   @IsOptional()
   @IsDateString()
   dateTo?: string;

   @ApiProperty({
      description: 'Página actual',
      example: 1,
      required: false,
   })
   @IsOptional()
   @IsInt()
   @Min(1)
   page?: number;

   @ApiProperty({
      description: 'Resultados por página',
      example: 20,
      required: false,
   })
   @IsOptional()
   @IsInt()
   @Min(1)
   @Max(100)
   limit?: number;
}

export class PatientVisitResponseDto {
   @ApiProperty({ example: 1 })
   visitId: number;

   @ApiProperty({ example: '12345678' })
   patientDni: string;

   @ApiProperty({ example: '2024-01-15' })
   visitDate: Date;

   @ApiProperty({ example: 70.5 })
   weight: number;

   @ApiProperty({ example: 11.5 })
   hbObserved: number;

   @ApiProperty({ example: 10.2 })
   hbAdjusted: number;

   @ApiProperty({ enum: AnemiaSeverity, example: AnemiaSeverity.MILD })
   anemiaSeverity: AnemiaSeverity;

   @ApiProperty({ enum: FemaleAdditional, example: FemaleAdditional.NONE })
   femaleAdditional: FemaleAdditional;

   @ApiProperty({ enum: GestationTrimester, example: GestationTrimester.NONE })
   gestationTrimester: GestationTrimester;

   @ApiProperty()
   createdById: string;

   @ApiProperty()
   createdAt: Date;

   @ApiProperty({ type: () => Object, required: false })
   patient?: any;

   @ApiProperty({ type: () => Object, required: false })
   createdBy?: any;

   @ApiProperty({ type: () => [Object], required: false })
   prescriptions?: any[];
}

export class PaginatedVisitResponseDto {
   @ApiProperty({ type: [PatientVisitResponseDto] })
   data: PatientVisitResponseDto[];

   @ApiProperty({ example: 150 })
   total: number;

   @ApiProperty({ example: 1 })
   page: number;

   @ApiProperty({ example: 20 })
   limit: number;

   @ApiProperty({ example: 8 })
   totalPages: number;
}
