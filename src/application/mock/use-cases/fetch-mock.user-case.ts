import { Injectable } from '@nestjs/common';
import { MockRepositoryPort } from '../ports/mock-repository.port';
import { AppLoggerService } from '@infrastructure/observability/logger.service';
import { FetchMocksResponseDto, MockWithSectionsDto } from '../dto/fetch-mock-response.dto';

@Injectable()
export class FetchMocksUseCase {
  constructor(
    private readonly mockRepository: MockRepositoryPort,
    private readonly logger: AppLoggerService,
  ) {}

  async execute(): Promise<FetchMocksResponseDto> {
    this.logger.log('Fetching all mocks', 'FetchMocksUseCase');

    const mocks = await this.mockRepository.fetchAllMocks();

    const mocksWithSections: MockWithSectionsDto[] = mocks.map((mock) => ({
      id: mock.id,
      title: mock.title,
      description: mock.description || undefined,
      duration: mock.duration,
      isActive: mock.isActive,
      createdAt: mock.createdAt,
      sections: mock.sections.map((section) => ({
        id: section.id,
        name: section.name,
        sortOrder: section.sortOrder,
      })),
    }));

    this.logger.log('Fetched mocks successfully', 'FetchMocksUseCase', {
      count: mocksWithSections.length,
    });

    return {
      mocks: mocksWithSections,
    };
  }
}