import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import {
  MockRepositoryPort,
  CreateMockData,
  CreateSectionData,
  CreateQuestionData,
  CreateOptionData,
} from '@application/mock/ports/mock-repository.port';

@Injectable()
export class MockRepository implements MockRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async createMock(data: CreateMockData) {
    return this.prisma.mock.create({
      data: {
        title: data.title,
        description: data.description,
        duration: data.duration,
        isActive: data.isActive ?? true,
      },
    });
  }

  async createSection(data: CreateSectionData) {
    const section = await this.prisma.mockSection.create({
      data: {
        mockId: data.mockId,
        name: data.name,
        sortOrder: data.sortOrder,
      },
    });
    return { id: section.id };
  }

  async createQuestion(data: CreateQuestionData) {
    const question = await this.prisma.question.create({
      data: {
        mockId: data.mockId,
        mockSectionId: data.mockSectionId,
        text: data?.text,
        imageUrl: data.imageUrl,
        marks: data.marks,
        negativeMark: data.negativeMark,
        sortOrder: data.sortOrder,
      },
    });
    return { id: question.id };
  }

  async createOption(data: CreateOptionData) {
    const option = await this.prisma.option.create({
      data: {
        questionId: data.questionId,
        label: data.label,
        text: data.text,
        imageUrl: data.imageUrl,
        isCorrect: data.isCorrect,
        sortOrder: data.sortOrder,
      },
    });
    return { id: option.id };
  }
}