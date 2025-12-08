import { Mock } from '@prisma/client';

export interface CreateMockData {
  title: string;
  description?: string;
  duration: number;
  isActive?: boolean;
}

export interface CreateSectionData {
  mockId: string;
  name: string;
  sortOrder: number;
}

export interface CreateQuestionData {
  mockId: string;
  mockSectionId?: string;
  text?: string;
  imageUrl?: string;
  marks: number;
  negativeMark: number;
  sortOrder: number;
}

export interface CreateOptionData {
  questionId: string;
  label: string;
  text?: string;
  imageUrl?: string;
  isCorrect: boolean;
  sortOrder: number;
}

export interface MockWithSections {
  id: string;
  title: string;
  description: string | null;
  duration: number;
  isActive: boolean;
  createdAt: Date;
  sections: {
    id: string;
    name: string;
    sortOrder: number;
  }[];
}

export interface CreateAttemptData {
  userId: string;
  mockId: string;
}

export interface MockWithQuestionsAndOptions {
  id: string;
  title: string;
  description: string | null;
  duration: number;
  sections: {
    id: string;
    name: string;
    sortOrder: number;
    questions: {
      id: string;
      text: string | null;
      imageUrl: string | null;
      marks: number;
      negativeMark: number;
      sortOrder: number;
      mockSectionId: string | null;
      options: {
        id: string;
        label: string;
        text: string | null;
        imageUrl: string | null;
        sortOrder: number;
      }[];
    }[];
  }[];
}

export const MOCK_REPOSITORY_PORT = Symbol('MOCK_REPOSITORY_PORT');

export interface MockRepositoryPort {
  createMock(data: CreateMockData): Promise<Mock>;
  createSection(data: CreateSectionData): Promise<{ id: string }>;
  createQuestion(data: CreateQuestionData): Promise<{ id: string }>;
  createOption(data: CreateOptionData): Promise<{ id: string }>;
  fetchAllMocks(): Promise<MockWithSections[]>;
  createAttempt(data: CreateAttemptData): Promise<{ id: string; startedAt: Date }>;
  fetchMockWithQuestionsAndOptions(mockId: string): Promise<MockWithQuestionsAndOptions | null>;
}