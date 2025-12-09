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

export interface MockWithQuestionsAndOptionsWithAnswers {
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
        isCorrect: boolean;
      }[];
    }[];
  }[];
}

export interface AttemptWithMock {
  id: string;
  userId: string;
  mockId: string;
  startedAt: Date;
  submittedAt: Date | null;
  timeTaken: number | null;
  score: number | null;
  percentage: number | null;
  status: 'IN_PROGRESS' | 'SUBMITTED' | 'AUTO_SUBMITTED';
  mock: {
    id: string;
    title: string;
    description: string | null;
    duration: number;
  };
}

export interface QuestionWithCorrectOption {
  id: string;
  mockSectionId: string | null;
  marks: number;
  negativeMark: number;
  correctOptionId: string | null;
}

export interface CreateAnswerData {
  attemptId: string;
  questionId: string;
  selectedOptionId: string | null;
  isCorrect: boolean;
  answeredAt: Date;
}

export interface UpdateAttemptSubmissionData {
  attemptId: string;
  submittedAt: Date;
  timeTaken: number;
  score: number;
  percentage: number;
}

export interface UserAttemptSummary {
  id: string;
  mockId: string;
  mockTitle: string;
  startedAt: Date;
  submittedAt: Date | null;
  score: number | null;
  percentage: number | null;
  status: 'IN_PROGRESS' | 'SUBMITTED' | 'AUTO_SUBMITTED';
  totalMarks: number;
  obtainedMarks: number;
  totalQuestions: number;
  answeredQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  unansweredQuestions: number;
  sectionWiseResults: {
    sectionId: string;
    sectionName: string;
    totalQuestions: number;
    answeredQuestions: number;
    correctAnswers: number;
    incorrectAnswers: number;
    unansweredQuestions: number;
    totalMarks: number;
    obtainedMarks: number;
    percentage: number;
  }[];
}

export interface AttemptWithAnswers {
  attemptId: string;
  mockId: string;
  title: string;
  description: string | null;
  duration: number;
  startedAt: Date;
  submittedAt: Date | null;
  timeTaken: number | null;
  score: number | null;
  percentage: number | null;
  status: 'IN_PROGRESS' | 'SUBMITTED' | 'AUTO_SUBMITTED';
  totalMarks: number;
  obtainedMarks: number;
  totalQuestions: number;
  answeredQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  unansweredQuestions: number;
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
      userSelectedOptionId: string | null;
      correctOptionId: string | null;
      isCorrect: boolean;
      options: {
        id: string;
        label: string;
        text: string | null;
        imageUrl: string | null;
        sortOrder: number;
        isCorrect: boolean;
      }[];
    }[];
  }[];
  sectionWiseResults: {
    sectionId: string;
    sectionName: string;
    totalQuestions: number;
    answeredQuestions: number;
    correctAnswers: number;
    incorrectAnswers: number;
    unansweredQuestions: number;
    totalMarks: number;
    obtainedMarks: number;
    percentage: number;
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
  fetchMockWithQuestionsAndOptionsWithAnswers(mockId: string): Promise<MockWithQuestionsAndOptionsWithAnswers | null>;
  fetchAttemptWithMock(attemptId: string, userId: string): Promise<AttemptWithMock | null>;
  fetchAttemptById(attemptId: string): Promise<{ id: string; userId: string; status: string } | null>;
  fetchQuestionsWithCorrectAnswers(mockId: string): Promise<QuestionWithCorrectOption[]>;
  createAnswers(answers: CreateAnswerData[]): Promise<void>;
  updateAttemptSubmission(data: UpdateAttemptSubmissionData): Promise<void>;
  fetchUserAttempts(userId: string): Promise<UserAttemptSummary[]>;
  fetchAttemptWithAnswers(attemptId: string, userId: string): Promise<AttemptWithAnswers | null>;
}