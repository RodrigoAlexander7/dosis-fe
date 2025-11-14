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
import { VisitsService } from '../services/visits.service';
import {
   CreatePatientVisitDto,
   UpdatePatientVisitDto,
   SearchVisitDto,
   PaginatedVisitResponseDto,
} from '../dto/patient-visit.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { IsDoctorGuard } from '../../auth/guards/is-doctor.guard';
import { IsMedicalStaffGuard } from '../../auth/guards/is-medical-staff.guard';

@ApiTags('visits')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('visits')
export class VisitsController {
   constructor(private readonly visitsService: VisitsService) { }

   @Post()
   @UseGuards(IsMedicalStaffGuard)
   @ApiOperation({
      summary: 'Create new visit for existing patient',
      description: 'Create a new medical visit for an existing patient (Nuevo Caso flow). Accessible by doctors and nurses.',
   })
   @ApiResponse({ status: 201, description: 'Visit created successfully' })
   @ApiResponse({ status: 404, description: 'Patient not found' })
   @ApiResponse({ status: 403, description: 'Forbidden - Only medical staff can create visits' })
   async create(
      @Body() createVisitDto: CreatePatientVisitDto,
      @Request() req,
   ) {
      const userId = req.user.id;
      return this.visitsService.create(createVisitDto, userId);
   }

   @Get('search')
   @UseGuards(IsMedicalStaffGuard)
   @ApiOperation({
      summary: 'Search visits with filters',
      description: 'Search visits by date range, patient DNI, or anemia severity. Includes pagination.',
   })
   @ApiResponse({ status: 200, type: PaginatedVisitResponseDto })
   async search(@Query() searchDto: SearchVisitDto) {
      return this.visitsService.search(searchDto);
   }

   @Get('statistics')
   @UseGuards(IsMedicalStaffGuard)
   @ApiOperation({
      summary: 'Get visit statistics',
      description: 'Get statistical information about visits grouped by severity',
   })
   @ApiResponse({ status: 200, description: 'Statistics retrieved successfully' })
   async getStatistics() {
      return this.visitsService.getStatistics();
   }

   @Get('patient/:dni')
   @UseGuards(IsMedicalStaffGuard)
   @ApiOperation({
      summary: 'Get all visits for a patient',
      description: 'Retrieve all medical visits for a specific patient by DNI',
   })
   @ApiResponse({ status: 200, description: 'Visits found' })
   @ApiResponse({ status: 404, description: 'Patient not found' })
   async findByPatient(@Param('dni') dni: string) {
      return this.visitsService.findByPatientDni(dni);
   }

   @Get(':id')
   @UseGuards(IsMedicalStaffGuard)
   @ApiOperation({
      summary: 'Get visit by ID',
      description: 'Retrieve detailed information about a specific visit',
   })
   @ApiResponse({ status: 200, description: 'Visit found' })
   @ApiResponse({ status: 404, description: 'Visit not found' })
   async findOne(@Param('id') id: string) {
      return this.visitsService.findById(Number(id));
   }

   @Patch(':id')
   @UseGuards(IsMedicalStaffGuard)
   @ApiOperation({
      summary: 'Update visit information',
      description: 'Update visit data. Only the creator or doctors can update visits.',
   })
   @ApiResponse({ status: 200, description: 'Visit updated successfully' })
   @ApiResponse({ status: 404, description: 'Visit not found' })
   @ApiResponse({ status: 403, description: 'Forbidden - Only creator or doctors can update' })
   async update(
      @Param('id') id: string,
      @Body() updateVisitDto: UpdatePatientVisitDto,
      @Request() req,
   ) {
      const userId = req.user.id;
      const userRole = req.user.role;
      return this.visitsService.update(Number(id), updateVisitDto, userId, userRole);
   }

   @Delete(':id')
   @UseGuards(IsDoctorGuard)
   @ApiOperation({
      summary: 'Delete visit',
      description: 'Permanently delete a visit. Only accessible by doctors.',
   })
   @ApiResponse({ status: 200, description: 'Visit deleted successfully' })
   @ApiResponse({ status: 404, description: 'Visit not found' })
   @ApiResponse({ status: 403, description: 'Forbidden - Only doctors can delete visits' })
   async remove(@Param('id') id: string, @Request() req) {
      const userId = req.user.id;
      const userRole = req.user.role;
      await this.visitsService.delete(Number(id), userId, userRole);
      return { message: 'Visit deleted successfully' };
   }
}
