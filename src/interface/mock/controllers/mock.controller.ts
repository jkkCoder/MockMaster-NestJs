import {
    Controller,
    Post,
    Body,
    HttpCode,
    HttpStatus,
    HttpException,
  } from '@nestjs/common';
  import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBody,
    ApiBearerAuth,
  } from '@nestjs/swagger';
  import { CreateMockDto } from '@application/mock/dto/create-mock.dto';
  import { AppLoggerService } from '@infrastructure/observability/logger.service';
  import { CreateMockUseCase } from '@application/mock/use-cases/create-mock.user-case';
  import { MockResponseDto } from '@application/mock/dto/create-mock-response.dto';
  
  @ApiTags('admin')
  @ApiBearerAuth('JWT-auth')
  @Controller('admin/mocks')
  export class MockController {
    constructor(
      private readonly createMockUseCase: CreateMockUseCase,
      private readonly logger: AppLoggerService,
    ) {}
  
    @Post('create-mock')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({
      summary: 'Create a new mock test',
      description: 'Creates a mock test with sections, questions, and options. Admin only.',
    })
    @ApiBody({ type: CreateMockDto })
    @ApiResponse({
      status: 201,
      description: 'Mock created successfully',
      type: MockResponseDto,
    })
    @ApiResponse({
      status: 400,
      description: 'Bad request - validation failed',
    })
    @ApiResponse({
      status: 401,
      description: 'Unauthorized - authentication required',
    })
    async createMock(@Body() createMockDto: CreateMockDto): Promise<MockResponseDto> {
      this.logger.log('Received create mock request', 'MockController', {
        title: createMockDto.mock.title,
      });
  
      try {
        const result = await this.createMockUseCase.execute(createMockDto);
        this.logger.log('Mock created successfully', 'MockController', {
          mockId: result.id,
        });
        return result;
      } catch (error) {
        this.logger.error(
          'Failed to create mock',
          error instanceof Error ? error.stack : undefined,
          'MockController',
          {
            error: error instanceof Error ? error.message : 'unknown',
          },
        );
  
        if (error instanceof HttpException) {
          throw error;
        }
  
        throw new HttpException(
          error instanceof Error ? error.message : 'Failed to create mock',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }