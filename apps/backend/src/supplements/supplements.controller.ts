import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { SupplementsService } from './supplements.service';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';

@ApiTags('supplements')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('supplements')
export class SupplementsController {
   constructor(private readonly supplementsService: SupplementsService) { }

   @Get()
   @ApiOperation({
      summary: 'Get all supplements',
      description: 'Retrieve list of all available supplements with their dosing guidelines',
   })
   @ApiResponse({ status: 200, description: 'Supplements retrieved successfully' })
   async getAllSupplements() {
      return this.supplementsService.findAll();
   }

   @Get('recommended')
   @ApiOperation({
      summary: 'Get recommended supplements for patient age',
      description: 'Get supplements that are appropriate for a specific patient age',
   })
   @ApiQuery({ name: 'ageDays', required: true, type: Number, description: 'Patient age in days' })
   @ApiResponse({ status: 200, description: 'Recommended supplements retrieved successfully' })
   async getRecommendedSupplements(@Query('ageDays') ageDays: string) {
      return this.supplementsService.getRecommendedSupplements(parseInt(ageDays, 10));
   }

   @Get(':id')
   @ApiOperation({
      summary: 'Get supplement by ID',
      description: 'Retrieve a specific supplement with its dosing guidelines',
   })
   @ApiResponse({ status: 200, description: 'Supplement retrieved successfully' })
   @ApiResponse({ status: 404, description: 'Supplement not found' })
   async getSupplementById(@Param('id') id: string) {
      return this.supplementsService.findById(id);
   }
}
