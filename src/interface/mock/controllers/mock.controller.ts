import {
    Controller,
    Post,
    Get,
    Body,
    Param,
    HttpCode,
    HttpStatus,
    HttpException,
    UnauthorizedException,
    Request,
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
import { FetchMocksUseCase } from '@application/mock/use-cases/fetch-mock.user-case';
import { FetchMocksResponseDto } from '@application/mock/dto/fetch-mock-response.dto';
import { StartAttemptDto } from '@application/mock/dto/start-attemp.dt';
import { StartAttemptResponseDto } from '@application/mock/dto/start-attempt-response.dto';
import { SubmitAttemptDto } from '@application/mock/dto/submit-attempt.dto';
import { SubmitAttemptResponseDto } from '@application/mock/dto/submit-attempt-response.dto';
import { AuthenticatedRequest } from '@interface/shared/guards/auth.guard';
import { StartAttemptUseCase } from '@application/mock/use-cases/start-attempt.use-case';
import { SubmitAttemptUseCase } from '@application/mock/use-cases/submit-attempt.use-case';
import { ViewAnswersUseCase } from '@application/mock/use-cases/view-answers.use-case';
import { ViewAnswersResponseDto } from '@application/mock/dto/view-answers-response.dto';
  
  @ApiTags('admin')
  @ApiBearerAuth('JWT-auth')
  @Controller('admin/mocks')
  export class MockController {
    constructor(
      private readonly createMockUseCase: CreateMockUseCase,
      private readonly fetchMocksUseCase: FetchMocksUseCase,
      private readonly startAttemptUseCase: StartAttemptUseCase,
      private readonly submitAttemptUseCase: SubmitAttemptUseCase,
      private readonly viewAnswersUseCase: ViewAnswersUseCase,
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

    @Get('fetch-mocks')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
      summary: 'Fetch all mocks with sections',
      description: 'Retrieves all active mocks with their sections for viewing purposes.',
    })
    @ApiResponse({
      status: 200,
      description: 'Mocks fetched successfully',
      type: FetchMocksResponseDto,
    })
    @ApiResponse({
      status: 401,
      description: 'Unauthorized - authentication required',
    })
    async fetchMocks(): Promise<FetchMocksResponseDto> {
      this.logger.log('Received fetch mocks request', 'MockController');

      try {
        const result = await this.fetchMocksUseCase.execute();
        this.logger.log('Mocks fetched successfully', 'MockController', {
          count: result.mocks.length,
        });
        return result;
      } catch (error) {
        this.logger.error(
          'Failed to fetch mocks',
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
          error instanceof Error ? error.message : 'Failed to fetch mocks',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }


    @Post('start-attempt')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({
      summary: 'Start a new attempt for a mock test',
      description: 'Creates an attempt record and returns all questions with options (excluding correct answers) for the test.',
    })
    @ApiBody({ type: StartAttemptDto })
    @ApiResponse({
      status: 201,
      description: 'Attempt started successfully',
      type: StartAttemptResponseDto,
    })
    @ApiResponse({
      status: 400,
      description: 'Bad request - validation failed or mock has no sections',
    })
    @ApiResponse({
      status: 401,
      description: 'Unauthorized - authentication required',
    })
    @ApiResponse({
      status: 404,
      description: 'Mock not found',
    })
    async startAttempt(
      @Body() startAttemptDto: StartAttemptDto,
      @Request() req: AuthenticatedRequest,
    ): Promise<StartAttemptResponseDto> {
      this.logger.log('Received start attempt request', 'MockController', {
        mockId: startAttemptDto.mockId,
        hasUser: !!req.user,
        userId: req.user?.userId,
        authHeader: req.headers.authorization ? 'present' : 'missing',
      });

      if (!req.user?.userId) {
        this.logger.warn('User not authenticated in start attempt', 'MockController', {
          mockId: startAttemptDto.mockId,
          hasAuthHeader: !!req.headers.authorization,
        });
        throw new UnauthorizedException('Authentication required. Please provide a valid JWT token in the Authorization header.');
      }

      try {
        const result = await this.startAttemptUseCase.execute(startAttemptDto, req.user.userId);
        this.logger.log('Attempt started successfully', 'MockController', {
          attemptId: result.attemptId,
          mockId: result.mockId,
        });
        return result;
      } catch (error) {
        this.logger.error(
          'Failed to start attempt',
          error instanceof Error ? error.stack : undefined,
          'MockController',
          {
            error: error instanceof Error ? error.message : 'unknown',
            mockId: startAttemptDto.mockId,
          },
        );

        if (error instanceof HttpException) {
          throw error;
        }

        throw new HttpException(
          error instanceof Error ? error.message : 'Failed to start attempt',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }

    @Post('submit-attempt')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
      summary: 'Submit an attempt with answers',
      description: 'Submits answers for an attempt, calculates scores section-wise and overall, and updates the attempt status.',
    })
    @ApiBody({ type: SubmitAttemptDto })
    @ApiResponse({
      status: 200,
      description: 'Attempt submitted successfully',
      type: SubmitAttemptResponseDto,
    })
    @ApiResponse({
      status: 400,
      description: 'Bad request - validation failed, invalid question IDs, or duplicate question IDs',
    })
    @ApiResponse({
      status: 401,
      description: 'Unauthorized - authentication required',
    })
    @ApiResponse({
      status: 403,
      description: 'Forbidden - attempt does not belong to user',
    })
    @ApiResponse({
      status: 404,
      description: 'Attempt not found',
    })
    @ApiResponse({
      status: 409,
      description: 'Conflict - attempt already submitted',
    })
    async submitAttempt(
      @Body() submitAttemptDto: SubmitAttemptDto,
      @Request() req: AuthenticatedRequest,
    ): Promise<SubmitAttemptResponseDto> {
      this.logger.log('Received submit attempt request', 'MockController', {
        attemptId: submitAttemptDto.attemptId,
        answersCount: submitAttemptDto.answers.length,
        hasUser: !!req.user,
        userId: req.user?.userId,
      });

      if (!req.user?.userId) {
        this.logger.warn('User not authenticated in submit attempt', 'MockController', {
          attemptId: submitAttemptDto.attemptId,
          hasAuthHeader: !!req.headers.authorization,
        });
        throw new UnauthorizedException('Authentication required. Please provide a valid JWT token in the Authorization header.');
      }

      try {
        const result = await this.submitAttemptUseCase.execute(submitAttemptDto, req.user.userId);
        this.logger.log('Attempt submitted successfully', 'MockController', {
          attemptId: result.attemptId,
          score: result.score,
          percentage: result.percentage,
        });
        return result;
      } catch (error) {
        this.logger.error(
          'Failed to submit attempt',
          error instanceof Error ? error.stack : undefined,
          'MockController',
          {
            error: error instanceof Error ? error.message : 'unknown',
            attemptId: submitAttemptDto.attemptId,
          },
        );

        if (error instanceof HttpException) {
          throw error;
        }

        throw new HttpException(
          error instanceof Error ? error.message : 'Failed to submit attempt',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }

    @Get('view-answers/:mockId')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
      summary: 'View answers for a mock test',
      description: 'Returns all questions with options and marks correct answers. Does not create an attempt.',
    })
    @ApiResponse({
      status: 200,
      description: 'Answers retrieved successfully',
      type: ViewAnswersResponseDto,
    })
    @ApiResponse({
      status: 400,
      description: 'Bad request - mock has no sections',
    })
    @ApiResponse({
      status: 401,
      description: 'Unauthorized - authentication required',
    })
    @ApiResponse({
      status: 404,
      description: 'Mock not found',
    })
    async viewAnswers(
      @Param('mockId') mockId: string,
      @Request() req: AuthenticatedRequest,
    ): Promise<ViewAnswersResponseDto> {
      this.logger.log('Received view answers request', 'MockController', {
        mockId,
        hasUser: !!req.user,
        userId: req.user?.userId,
      });

      if (!req.user?.userId) {
        this.logger.warn('User not authenticated in view answers', 'MockController', {
          mockId,
          hasAuthHeader: !!req.headers.authorization,
        });
        throw new UnauthorizedException('Authentication required. Please provide a valid JWT token in the Authorization header.');
      }

      try {
        const result = await this.viewAnswersUseCase.execute(mockId);
        this.logger.log('Answers retrieved successfully', 'MockController', {
          mockId: result.mockId,
          sectionsCount: result.sections.length,
        });
        return result;
      } catch (error) {
        this.logger.error(
          'Failed to view answers',
          error instanceof Error ? error.stack : undefined,
          'MockController',
          {
            error: error instanceof Error ? error.message : 'unknown',
            mockId,
          },
        );

        if (error instanceof HttpException) {
          throw error;
        }

        throw new HttpException(
          error instanceof Error ? error.message : 'Failed to view answers',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }