import {
   IsString,
   IsDateString,
   IsEnum,
   IsOptional,
   IsNumber,
   Min,
   Max,
   Length,
   Matches,
   ValidateNested,
   IsInt,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export enum Gender {
   MALE = 'MALE',
   FEMALE = 'FEMALE',
}

export enum FemaleAdditional {
   NONE = 'NONE',
   PREGNANT = 'PREGNANT',
   LACTATING = 'LACTATING',
}

export enum GestationTrimester {
   NONE = 'NONE',
   FIRST = 'FIRST',
   SECOND = 'SECOND',
   THIRD = 'THIRD',
}

export enum AnemiaSeverity {
   NONE = 'NONE',
   MILD = 'MILD',
   MODERATE = 'MODERATE',
   SEVERE = 'SEVERE',
}

export class CreateFirstVisitDto {
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

export class CreatePatientDto {
   @ApiProperty({
      description: 'DNI del paciente (8 dígitos)',
      example: '12345678',
      minLength: 8,
      maxLength: 8,
   })
   @IsString()
   @Length(8, 8, { message: 'DNI debe tener exactamente 8 dígitos' })
   @Matches(/^\d{8}$/, { message: 'DNI debe contener solo números' })
   dni: string;

   @ApiProperty({
      description: 'Fecha de nacimiento',
      example: '1990-01-15',
   })
   @IsDateString()
   birthDate: string;

   @ApiProperty({
      description: 'Género del paciente',
      enum: Gender,
      example: Gender.MALE,
   })
   @IsEnum(Gender)
   gender: Gender;

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
      description: 'ID del departamento',
      example: 1,
   })
   @IsNumber()
   departmentId: number;

   @ApiProperty({
      description: 'ID de la provincia',
      example: 1,
   })
   @IsNumber()
   provinceId: number;

   @ApiProperty({
      description: 'ID del distrito',
      example: 1,
   })
   @IsNumber()
   districtId: number;

   @ApiProperty({
      description: 'ID del centro poblado',
      example: 1,
   })
   @IsNumber()
   townId: number;

   @ApiProperty({
      description: 'Datos de la primera visita médica',
      type: CreateFirstVisitDto,
   })
   @ValidateNested()
   @Type(() => CreateFirstVisitDto)
   firstVisit: CreateFirstVisitDto;
}

export class UpdatePatientDto {
   @ApiProperty({
      description: 'Fecha de nacimiento',
      example: '1990-01-15',
      required: false,
   })
   @IsOptional()
   @IsDateString()
   birthDate?: string;

   @ApiProperty({
      description: 'Género del paciente',
      enum: Gender,
      required: false,
   })
   @IsOptional()
   @IsEnum(Gender)
   gender?: Gender;

   @ApiProperty({
      description: 'ID del departamento',
      required: false,
   })
   @IsOptional()
   @IsNumber()
   departmentId?: number;

   @ApiProperty({
      description: 'ID de la provincia',
      required: false,
   })
   @IsOptional()
   @IsNumber()
   provinceId?: number;

   @ApiProperty({
      description: 'ID del distrito',
      required: false,
   })
   @IsOptional()
   @IsNumber()
   districtId?: number;

   @ApiProperty({
      description: 'ID del centro poblado',
      required: false,
   })
   @IsOptional()
   @IsNumber()
   townId?: number;
}

export class SearchPatientDto {
   @ApiProperty({
      description: 'DNI del paciente (8 dígitos)',
      example: '12345678',
      required: false,
   })
   @IsOptional()
   @IsString()
   @Length(8, 8)
   @Matches(/^\d{8}$/)
   dni?: string;

   @ApiProperty({
      description: 'Año de nacimiento',
      example: 1990,
      required: false,
   })
   @IsOptional()
   @IsInt()
   @Min(1900)
   @Max(new Date().getFullYear())
   birthYear?: number;

   @ApiProperty({
      description: 'Severidad de anemia (última visita)',
      enum: AnemiaSeverity,
      required: false,
   })
   @IsOptional()
   @IsEnum(AnemiaSeverity)
   anemiaSeverity?: AnemiaSeverity;

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

export class PatientResponseDto {
   @ApiProperty({ example: '12345678' })
   dni: string;

   @ApiProperty({ example: '1990-01-15' })
   birthDate: Date;

   @ApiProperty({ enum: Gender, example: Gender.MALE })
   gender: Gender;

   @ApiProperty({ example: 1 })
   departmentId: number;

   @ApiProperty({ example: 1 })
   provinceId: number;

   @ApiProperty({ example: 1 })
   districtId: number;

   @ApiProperty({ example: 1 })
   townId: number;

   @ApiProperty()
   createdById: string;

   @ApiProperty()
   updatedById: string;

   @ApiProperty()
   createdAt: Date;

   @ApiProperty()
   updatedAt: Date;

   @ApiProperty({ type: () => Object, required: false })
   department?: any;

   @ApiProperty({ type: () => Object, required: false })
   province?: any;

   @ApiProperty({ type: () => Object, required: false })
   district?: any;

   @ApiProperty({ type: () => Object, required: false })
   town?: any;

   @ApiProperty({ type: () => [Object], required: false })
   visits?: any[];
}

export class PaginatedPatientResponseDto {
   @ApiProperty({ type: [PatientResponseDto] })
   data: PatientResponseDto[];

   @ApiProperty({ example: 150 })
   total: number;

   @ApiProperty({ example: 1 })
   page: number;

   @ApiProperty({ example: 20 })
   limit: number;

   @ApiProperty({ example: 8 })
   totalPages: number;
}
