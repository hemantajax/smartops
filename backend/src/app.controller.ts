import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Public } from './auth/decorators/public.decorator';

class HealthResponseDto {
  status: string;
  timestamp: string;
  service: string;
}

@ApiTags('health')
@Controller()
export class AppController {
  @Public()
  @Get('health')
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({
    status: 200,
    description: 'Service is healthy',
    type: HealthResponseDto,
    schema: {
      example: {
        status: 'ok',
        timestamp: '2024-01-15T10:30:00.000Z',
        service: 'smartops-api',
      },
    },
  })
  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'smartops-api',
    };
  }
}
