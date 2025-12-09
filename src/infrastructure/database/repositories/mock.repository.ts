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
  UserAttemptSummary,
  AttemptWithAnswers,
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

  async fetchUserAttempts(userId: string): Promise<UserAttemptSummary[]> {
    const attempts = await this.prisma.attempt.findMany({
      where: {
        userId,
        status: 'SUBMITTED',
      },
      include: {
        mock: {
          select: {
            id: true,
            title: true,
            sections: {
              include: {
                questions: {
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
                },
              },
            },
          },
        },
        answers: {
          include: {
            question: {
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
                mockSection: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        submittedAt: 'desc',
      },
    });

    return attempts.map((attempt) => {
      // Calculate section-wise results
      const sectionMap = new Map<string, {
        sectionId: string;
        sectionName: string;
        totalQuestions: number;
        answeredQuestions: number;
        correctAnswers: number;
        incorrectAnswers: number;
        unansweredQuestions: number;
        totalMarks: number;
        obtainedMarks: number;
      }>();

      // Get all questions for this mock to calculate totals
      const allQuestions: any[] = [];
      for (const section of attempt.mock.sections) {
        for (const question of section.questions) {
          allQuestions.push(question);
        }
      }
      const answerMap = new Map(attempt.answers.map((a) => [a.questionId, a]));

      // Process all questions (including unanswered)
      for (const section of attempt.mock.sections) {
        for (const question of section.questions) {
          const sectionId = section.id;
          const sectionName = section.name;
          const answer = answerMap.get(question.id);

          if (!sectionMap.has(sectionId)) {
            sectionMap.set(sectionId, {
              sectionId,
              sectionName,
              totalQuestions: 0,
              answeredQuestions: 0,
              correctAnswers: 0,
              incorrectAnswers: 0,
              unansweredQuestions: 0,
              totalMarks: 0,
              obtainedMarks: 0,
            });
          }

          const sectionData = sectionMap.get(sectionId)!;
          sectionData.totalQuestions++;
          sectionData.totalMarks += question.marks;

          if (answer?.selectedOptionId) {
            sectionData.answeredQuestions++;
            if (answer.isCorrect) {
              sectionData.correctAnswers++;
              sectionData.obtainedMarks += question.marks;
            } else {
              sectionData.incorrectAnswers++;
              sectionData.obtainedMarks -= question.negativeMark;
            }
          } else {
            sectionData.unansweredQuestions++;
          }
        }
      }

      // Calculate totals
      const totalQuestions = allQuestions.length;
      const answeredQuestions = attempt.answers.filter((a) => a.selectedOptionId).length;
      const correctAnswers = attempt.answers.filter((a) => a.isCorrect).length;
      const incorrectAnswers = attempt.answers.filter((a) => a.selectedOptionId && !a.isCorrect).length;
      const unansweredQuestions = totalQuestions - answeredQuestions;

      let totalMarks = 0;
      let obtainedMarks = 0;
      for (const question of allQuestions) {
        totalMarks += question.marks;
        const answer = attempt.answers.find((a) => a.questionId === question.id);
        if (answer?.isCorrect) {
          obtainedMarks += question.marks;
        } else if (answer?.selectedOptionId) {
          obtainedMarks -= question.negativeMark;
        }
      }

      return {
        id: attempt.id,
        mockId: attempt.mockId,
        mockTitle: attempt.mock.title,
        startedAt: attempt.startedAt,
        submittedAt: attempt.submittedAt,
        score: attempt.score,
        percentage: attempt.percentage,
        status: attempt.status,
        totalMarks,
        obtainedMarks,
        totalQuestions,
        answeredQuestions,
        correctAnswers,
        incorrectAnswers,
        unansweredQuestions,
        sectionWiseResults: Array.from(sectionMap.values()).map((section) => ({
          ...section,
          percentage: section.totalMarks > 0 ? (section.obtainedMarks / section.totalMarks) * 100 : 0,
        })),
      };
    });
  }

  async fetchAttemptWithAnswers(attemptId: string, userId: string): Promise<AttemptWithAnswers | null> {
    const attempt = await this.prisma.attempt.findFirst({
      where: {
        id: attemptId,
        userId,
      },
      include: {
        mock: {
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
                    },
                  },
                },
              },
            },
          },
        },
        answers: {
          include: {
            question: {
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
            },
          },
        },
      },
    });

    if (!attempt) {
      return null;
    }

    // Create a map of user answers
    const answerMap = new Map(
      attempt.answers.map((a) => [a.questionId, a])
    );

    // Create a map of correct option IDs
    const correctOptionMap = new Map<string, string>();
    for (const answer of attempt.answers) {
      const correctOption = answer.question.options[0];
      if (correctOption) {
        correctOptionMap.set(answer.questionId, correctOption.id);
      }
    }

    // Calculate section-wise results
    const sectionMap = new Map<string, {
      sectionId: string;
      sectionName: string;
      totalQuestions: number;
      answeredQuestions: number;
      correctAnswers: number;
      incorrectAnswers: number;
      unansweredQuestions: number;
      totalMarks: number;
      obtainedMarks: number;
    }>();

    // Process all questions
    for (const section of attempt.mock.sections) {
      for (const question of section.questions) {
        const answer = answerMap.get(question.id);
        const correctOptionId = correctOptionMap.get(question.id) || null;
        const userSelectedOptionId = answer?.selectedOptionId || null;
        const isCorrect = answer?.isCorrect || false;

        if (!sectionMap.has(section.id)) {
          sectionMap.set(section.id, {
            sectionId: section.id,
            sectionName: section.name,
            totalQuestions: 0,
            answeredQuestions: 0,
            correctAnswers: 0,
            incorrectAnswers: 0,
            unansweredQuestions: 0,
            totalMarks: 0,
            obtainedMarks: 0,
          });
        }

        const sectionData = sectionMap.get(section.id)!;
        sectionData.totalQuestions++;
        sectionData.totalMarks += question.marks;

        if (userSelectedOptionId) {
          sectionData.answeredQuestions++;
          if (isCorrect) {
            sectionData.correctAnswers++;
            sectionData.obtainedMarks += question.marks;
          } else {
            sectionData.incorrectAnswers++;
            sectionData.obtainedMarks -= question.negativeMark;
          }
        } else {
          sectionData.unansweredQuestions++;
        }
      }
    }

    // Calculate totals
    let totalMarks = 0;
    let obtainedMarks = 0;
    let totalQuestions = 0;
    let answeredQuestions = 0;
    let correctAnswers = 0;
    let incorrectAnswers = 0;

    for (const section of attempt.mock.sections) {
      for (const question of section.questions) {
        totalQuestions++;
        totalMarks += question.marks;
        const answer = answerMap.get(question.id);
        if (answer?.selectedOptionId) {
          answeredQuestions++;
          if (answer.isCorrect) {
            correctAnswers++;
            obtainedMarks += question.marks;
          } else {
            incorrectAnswers++;
            obtainedMarks -= question.negativeMark;
          }
        }
      }
    }

    return {
      attemptId: attempt.id,
      mockId: attempt.mockId,
      title: attempt.mock.title,
      description: attempt.mock.description,
      duration: attempt.mock.duration,
      startedAt: attempt.startedAt,
      submittedAt: attempt.submittedAt,
      timeTaken: attempt.timeTaken,
      score: attempt.score,
      percentage: attempt.percentage,
      status: attempt.status,
      totalMarks,
      obtainedMarks,
      totalQuestions,
      answeredQuestions,
      correctAnswers,
      incorrectAnswers,
      unansweredQuestions: totalQuestions - answeredQuestions,
      sections: attempt.mock.sections.map((section) => ({
        id: section.id,
        name: section.name,
        sortOrder: section.sortOrder,
        questions: section.questions.map((question) => {
          const answer = answerMap.get(question.id);
          const correctOptionId = correctOptionMap.get(question.id) || null;
          return {
            id: question.id,
            text: question.text,
            imageUrl: question.imageUrl,
            marks: question.marks,
            negativeMark: question.negativeMark,
            sortOrder: question.sortOrder,
            mockSectionId: question.mockSectionId,
            userSelectedOptionId: answer?.selectedOptionId || null,
            correctOptionId,
            isCorrect: answer?.isCorrect || false,
            options: question.options.map((option) => ({
              id: option.id,
              label: option.label,
              text: option.text,
              imageUrl: option.imageUrl,
              sortOrder: option.sortOrder,
              isCorrect: option.isCorrect,
            })),
          };
        }),
      })),
      sectionWiseResults: Array.from(sectionMap.values()).map((section) => ({
        ...section,
        percentage: section.totalMarks > 0 ? (section.obtainedMarks / section.totalMarks) * 100 : 0,
      })),
    };
  }
}