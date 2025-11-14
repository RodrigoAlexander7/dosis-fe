import {
   Body,
   Controller,
   Delete,
   Get,
   Param,
   Patch,
   Post,
   Query,
   UseGuards,
   Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { PatientsService } from '../services/patients.service';
import {
   CreatePatientDto,
   UpdatePatientDto,
   SearchPatientDto,
   PaginatedPatientResponseDto,
} from '../dto/patient.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { IsDoctorGuard } from '../../auth/guards/is-doctor.guard';
import { IsMedicalStaffGuard } from '../../auth/guards/is-medical-staff.guard';

@ApiTags('patients')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('patients')
export class PatientsController {
   constructor(private readonly patientsService: PatientsService) { }

   @Post()
   @UseGuards(IsDoctorGuard)
   @ApiOperation({
      summary: 'Create new patient with first visit',
      description: 'Create a new patient record with their first medical visit (Nuevo Paciente flow). Only accessible by doctors.',
   })
   @ApiResponse({ status: 201, description: 'Patient created successfully' })
   @ApiResponse({ status: 400, description: 'Invalid data or DNI already exists' })
   @ApiResponse({ status: 403, description: 'Forbidden - Only doctors can create patients' })
   async create(
      @Body() createPatientDto: CreatePatientDto,
      @Request() req,
   ) {
      const userId = req.user.id;
      return this.patientsService.create(createPatientDto, userId);
   }

   @Get('search')
   @UseGuards(IsMedicalStaffGuard)
   @ApiOperation({
      summary: 'Search patients with filters',
      description: 'Search patients by DNI, birth year, or anemia severity. Includes pagination. Accessible by doctors and nurses.',
   })
   @ApiResponse({ status: 200, type: PaginatedPatientResponseDto })
   async search(@Query() searchDto: SearchPatientDto) {
      return this.patientsService.search(searchDto);
   }

   @Get('statistics')
   @UseGuards(IsMedicalStaffGuard)
   @ApiOperation({
      summary: 'Get patient statistics',
      description: 'Get statistical information about patients and visits',
   })
   @ApiResponse({ status: 200, description: 'Statistics retrieved successfully' })
   async getStatistics() {
      return this.patientsService.getStatistics();
   }

   @Get(':dni')
   @UseGuards(IsMedicalStaffGuard)
   @ApiOperation({
      summary: 'Get patient by DNI',
      description: 'Retrieve complete patient information including all visits. Accessible by doctors and nurses.',
   })
   @ApiResponse({ status: 200, description: 'Patient found' })
   @ApiResponse({ status: 404, description: 'Patient not found' })
   async findOne(@Param('dni') dni: string) {
      return this.patientsService.findByDni(dni);
   }

   @Patch(':dni')
   @UseGuards(IsDoctorGuard)
   @ApiOperation({
      summary: 'Update patient information',
      description: 'Update patient demographic data. Only accessible by doctors.',
   })
   @ApiResponse({ status: 200, description: 'Patient updated successfully' })
   @ApiResponse({ status: 404, description: 'Patient not found' })
   @ApiResponse({ status: 403, description: 'Forbidden - Only doctors can update patients' })
   async update(
      @Param('dni') dni: string,
      @Body() updatePatientDto: UpdatePatientDto,
      @Request() req,
   ) {
      const userId = req.user.id;
      return this.patientsService.update(dni, updatePatientDto, userId);
   }

   @Delete(':dni')
   @UseGuards(IsDoctorGuard)
   @ApiOperation({
      summary: 'Delete patient',
      description: 'Permanently delete patient and all associated visits. Only accessible by doctors.',
   })
   @ApiResponse({ status: 200, description: 'Patient deleted successfully' })
   @ApiResponse({ status: 404, description: 'Patient not found' })
   @ApiResponse({ status: 403, description: 'Forbidden - Only doctors can delete patients' })
   async remove(@Param('dni') dni: string) {
      await this.patientsService.delete(dni);
      return { message: 'Patient deleted successfully' };
   }
}
