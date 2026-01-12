export type AttemptStatus = "in_progress" | "submitted" | "graded";

export type Attempt = {
  id: number;
  testId: number;
  userId: number;
  score: number;
  status: AttemptStatus;
};

export type TestMeta = {
  project: string; // "ПАЗЛ" | "КОД" и т.п.
  track: string;   // "Frontend" | "Backend" | "UX/UI"
  course: string;  // "0 курс"..."3 курс"
  purpose: string; // "Проверка знаний"
};

export type TestItem = {
  id: number;
  title: string;
  shortDescription: string;
  durationSec?: number | null;
  passScore: number;
  attemptsAllowed: number;
  allowRetry: boolean;
  isPublished: boolean;
  tags: string[];
  meta: TestMeta;
  deadlineISO?: string | null;
};
