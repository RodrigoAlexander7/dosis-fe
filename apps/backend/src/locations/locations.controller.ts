import { Controller, Get, Post, Query, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber } from 'class-validator';
import { LocationsService } from './locations.service';
import { Public } from '@/auth/decorators/public.decorator';

class ResolveLocationDto {
   @ApiProperty({ description: 'Nombre del departamento', example: 'AREQUIPA' })
   @IsString()
   departmentName: string;

   @ApiProperty({ description: 'Nombre de la provincia', example: 'AREQUIPA' })
   @IsString()
   provinceName: string;

   @ApiProperty({ description: 'Nombre del distrito', example: 'AREQUIPA' })
   @IsString()
   districtName: string;

   @ApiProperty({ description: 'Nombre del centro poblado', example: 'AREQUIPA' })
   @IsString()
   townName: string;

   @ApiProperty({ description: 'Ajuste de altitud', example: 1.8 })
   @IsNumber()
   altitudeAdjustment: number;
}

@ApiTags('locations')
@Controller('locations')
export class LocationsController {
   constructor(private readonly locationsService: LocationsService) { }

   @Public()
   @Get('departments')
   @ApiOperation({ summary: 'Get all departments' })
   async getDepartments() {
      return this.locationsService.getDepartments();
   }

   @Public()
   @Get('provinces')
   @ApiOperation({ summary: 'Get provinces by department' })
   @ApiQuery({ name: 'departmentId', required: true })
   async getProvinces(@Query('departmentId') departmentId: string) {
      return this.locationsService.getProvinces(parseInt(departmentId));
   }

   @Public()
   @Get('districts')
   @ApiOperation({ summary: 'Get districts by province' })
   @ApiQuery({ name: 'provinceId', required: true })
   async getDistricts(@Query('provinceId') provinceId: string) {
      return this.locationsService.getDistricts(parseInt(provinceId));
   }

   @Public()
   @Get('towns')
   @ApiOperation({ summary: 'Get towns by district' })
   @ApiQuery({ name: 'districtId', required: true })
   async getTowns(@Query('districtId') districtId: string) {
      return this.locationsService.getTowns(parseInt(districtId));
   }

   @Public()
   @Post('resolve')
   @ApiOperation({ summary: 'Resolve location names to IDs (create if not exists)' })
   async resolveLocationIds(@Body() dto: ResolveLocationDto) {
      return this.locationsService.resolveLocationIds(
         dto.departmentName,
         dto.provinceName,
         dto.districtName,
         dto.townName,
         dto.altitudeAdjustment
      );
   }
}
