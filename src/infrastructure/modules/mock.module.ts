import { Module } from '@nestjs/common';
import { MockRepository } from '../database/repositories/mock.repository';
import { MOCK_REPOSITORY_PORT } from '@application/mock/ports/mock-repository.port';

@Module({
  providers: [
    {
      provide: MOCK_REPOSITORY_PORT,
      useClass: MockRepository,
    },
  ],
  exports: [MOCK_REPOSITORY_PORT],
})
export class MockInfrastructureModule {}