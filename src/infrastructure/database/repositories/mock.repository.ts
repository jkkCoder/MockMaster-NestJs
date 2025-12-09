import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import {
  MockRepositoryPort,
  CreateMockData,
  CreateSectionData,
  CreateQuestionData,
  CreateOptionData,
  MockWithSections,
  CreateAttemptData,
  MockWithQuestionsAndOptions,
  MockWithQuestionsAndOptionsWithAnswers,
  AttemptWithMock,
  QuestionWithCorrectOption,
  CreateAnswerData,
  UpdateAttemptSubmissionData,
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

  async fetchAllMocks(): Promise<MockWithSections[]> {
    return this.prisma.mock.findMany({
      where: {
        isActive: true,
      },
      include: {
        sections: {
          orderBy: {
            sortOrder: 'asc',
          },
          select: {
            id: true,
            name: true,
            sortOrder: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async createAttempt(data: CreateAttemptData): Promise<{ id: string; startedAt: Date }> {
    const attempt = await this.prisma.attempt.create({
      data: {
        userId: data.userId,
        mockId: data.mockId,
        startedAt: new Date(),
        status: 'IN_PROGRESS',
      },
    });
    return { id: attempt.id, startedAt: attempt.startedAt };
  }

  async fetchMockWithQuestionsAndOptions(mockId: string): Promise<MockWithQuestionsAndOptions | null> {
    const mock = await this.prisma.mock.findUnique({
      where: { id: mockId },
      include: {
        sections: {
          orderBy: {
            sortOrder: 'asc',
          },
          include: {
            questions: {
              orderBy: {
                sortOrder: 'asc',
              },
              include: {
                options: {
                  orderBy: {
                    sortOrder: 'asc',
                  },
                  select: {
                    id: true,
                    label: true,
                    text: true,
                    imageUrl: true,
                    sortOrder: true,
                    // Explicitly exclude isCorrect
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!mock) {
      return null;
    }

    return {
      id: mock.id,
      title: mock.title,
      description: mock.description,
      duration: mock.duration,
      sections: mock.sections.map((section) => ({
        id: section.id,
        name: section.name,
        sortOrder: section.sortOrder,
        questions: section.questions.map((question) => ({
          id: question.id,
          text: question.text,
          imageUrl: question.imageUrl,
          marks: question.marks,
          negativeMark: question.negativeMark,
          sortOrder: question.sortOrder,
          mockSectionId: question.mockSectionId,
          options: question.options.map((option) => ({
            id: option.id,
            label: option.label,
            text: option.text,
            imageUrl: option.imageUrl,
            sortOrder: option.sortOrder,
          })),
        })),
      })),
    };
  }

  async fetchMockWithQuestionsAndOptionsWithAnswers(mockId: string): Promise<MockWithQuestionsAndOptionsWithAnswers | null> {
    const mock = await this.prisma.mock.findUnique({
      where: { id: mockId },
      include: {
        sections: {
          orderBy: {
            sortOrder: 'asc',
          },
          include: {
            questions: {
              orderBy: {
                sortOrder: 'asc',
              },
              include: {
                options: {
                  orderBy: {
                    sortOrder: 'asc',
                  },
                  select: {
                    id: true,
                    label: true,
                    text: true,
                    imageUrl: true,
                    sortOrder: true,
                    isCorrect: true, // Include isCorrect for answers view
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!mock) {
      return null;
    }

    return {
      id: mock.id,
      title: mock.title,
      description: mock.description,
      duration: mock.duration,
      sections: mock.sections.map((section) => ({
        id: section.id,
        name: section.name,
        sortOrder: section.sortOrder,
        questions: section.questions.map((question) => ({
          id: question.id,
          text: question.text,
          imageUrl: question.imageUrl,
          marks: question.marks,
          negativeMark: question.negativeMark,
          sortOrder: question.sortOrder,
          mockSectionId: question.mockSectionId,
          options: question.options.map((option) => ({
            id: option.id,
            label: option.label,
            text: option.text,
            imageUrl: option.imageUrl,
            sortOrder: option.sortOrder,
            isCorrect: option.isCorrect,
          })),
        })),
      })),
    };
  }

  async fetchAttemptById(attemptId: string): Promise<{ id: string; userId: string; status: string } | null> {
    const attempt = await this.prisma.attempt.findUnique({
      where: { id: attemptId },
      select: {
        id: true,
        userId: true,
        status: true,
      },
    });

    return attempt;
  }

  async fetchAttemptWithMock(attemptId: string, userId: string): Promise<AttemptWithMock | null> {
    const attempt = await this.prisma.attempt.findFirst({
      where: {
        id: attemptId,
        userId: userId,
      },
      include: {
        mock: {
          select: {
            id: true,
            title: true,
            description: true,
            duration: true,
          },
        },
      },
    });

    if (!attempt) {
      return null;
    }

    return {
      id: attempt.id,
      userId: attempt.userId,
      mockId: attempt.mockId,
      startedAt: attempt.startedAt,
      submittedAt: attempt.submittedAt,
      timeTaken: attempt.timeTaken,
      score: attempt.score,
      percentage: attempt.percentage,
      status: attempt.status,
      mock: {
        id: attempt.mock.id,
        title: attempt.mock.title,
        description: attempt.mock.description,
        duration: attempt.mock.duration,
      },
    };
  }

  async fetchQuestionsWithCorrectAnswers(mockId: string): Promise<QuestionWithCorrectOption[]> {
    const questions = await this.prisma.question.findMany({
      where: {
        mockId: mockId,
      },
      include: {
        options: {
          where: {
            isCorrect: true,
          },
          select: {
            id: true,
          },
          take: 1,
        },
      },
    });

    return questions.map((question) => ({
      id: question.id,
      mockSectionId: question.mockSectionId,
      marks: question.marks,
      negativeMark: question.negativeMark,
      correctOptionId: question.options[0]?.id || null,
    }));
  }

  async createAnswers(answers: CreateAnswerData[]): Promise<void> {
    await this.prisma.answer.createMany({
      data: answers.map((answer) => ({
        attemptId: answer.attemptId,
        questionId: answer.questionId,
        selectedOptionId: answer.selectedOptionId,
        isCorrect: answer.isCorrect,
        answeredAt: answer.answeredAt,
      })),
    });
  }

  async updateAttemptSubmission(data: UpdateAttemptSubmissionData): Promise<void> {
    await this.prisma.attempt.update({
      where: {
        id: data.attemptId,
      },
      data: {
        submittedAt: data.submittedAt,
        timeTaken: data.timeTaken,
        score: data.score,
        percentage: data.percentage,
        status: 'SUBMITTED',
      },
    });
  }
}