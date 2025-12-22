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
  } from '@nestjs/swagger';
  import { RegisterDto } from '@application/auth/dto/register.dto';
  import { LoginDto } from '@application/auth/dto/login.dto';
  import { AuthResponseDto } from '@application/auth/dto/auth-response.dto';
  import { RegisterUseCase } from '@application/auth/use-cases/register.use-case';
  import { AppLoggerService } from '@infrastructure/observability/logger.service';
  import { Public } from '@interface/shared/decorators/public.decorator';
import { LoginUseCase } from '@application/auth/use-cases/login.user-case';
  
  @ApiTags('auth')
  @Controller('auth')
  export class AuthController {
    constructor(
      private readonly registerUseCase: RegisterUseCase,
      private readonly loginUseCase: LoginUseCase,
      private readonly logger: AppLoggerService,
    ) {}
  
    @Post('register')
    @Public()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({
      summary: 'Register a new user',
      description: 'Create a new user account and receive authentication tokens',
    })
    @ApiBody({ type: RegisterDto })
    @ApiResponse({
      status: 201,
      description: 'User successfully registered',
      type: AuthResponseDto,
    })
    @ApiResponse({
      status: 400,
      description: 'Bad request - validation failed',
    })
    @ApiResponse({
      status: 409,
      description: 'Conflict - username or email already exists',
    })
    async register(@Body() registerDto: RegisterDto): Promise<AuthResponseDto> {
      this.logger.log('Received registration request', 'AuthController', {
        username: registerDto.username,
        mail: registerDto.mail,
      }, registerDto.username);
  
      try {
        const result = await this.registerUseCase.execute(registerDto);
        this.logger.log('Registration completed successfully', 'AuthController', {
          userId: result.user.id,
          username: result.user.username,
        }, result.user.username);
        return result;
      } catch (error) {
        this.logger.error(
          'Registration failed',
          error instanceof Error ? error.stack : undefined,
          'AuthController',
          {
            username: registerDto.username,
            error: error instanceof Error ? error.message : 'unknown',
          },
          registerDto.username,
        );
  
        if (error instanceof HttpException) {
          throw error;
        }
  
        throw new HttpException(
          error instanceof Error ? error.message : 'Registration failed',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  
    @Post('login')
    @Public()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
      summary: 'Login user',
      description: 'Authenticate user with username/email and password',
    })
    @ApiBody({ type: LoginDto })
    @ApiResponse({
      status: 200,
      description: 'User successfully authenticated',
      type: AuthResponseDto,
    })
    @ApiResponse({
      status: 400,
      description: 'Bad request - validation failed',
    })
    @ApiResponse({
      status: 401,
      description: 'Unauthorized - invalid credentials',
    })
    async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
      this.logger.log('Received login request', 'AuthController', {
        usernameOrEmail: loginDto.usernameOrEmail,
      }, loginDto.usernameOrEmail);
  
      try {
        const result = await this.loginUseCase.execute(loginDto);
        this.logger.log('Login completed successfully', 'AuthController', {
          userId: result.user.id,
          username: result.user.username,
        }, result.user.username);
        return result;
      } catch (error) {
        this.logger.error(
          'Login failed',
          error instanceof Error ? error.stack : undefined,
          'AuthController',
          {
            usernameOrEmail: loginDto.usernameOrEmail,
            error: error instanceof Error ? error.message : 'unknown',
          },
          loginDto.usernameOrEmail,
        );
  
        if (error instanceof HttpException) {
          throw error;
        }
  
        throw new HttpException(
          error instanceof Error ? error.message : 'Login failed',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }


