export type QuestionAttempt = {
  score: number;
  timeSpentMillis: number;
  timestamp: number;
};

export type QuestionPerformance = {
  attempts: QuestionAttempt[];
};

export type ProfileStats = {
  lastAttemptScores: Record<number, number>;
  memorizedQuestions: number[];
  questionStats: Record<number, QuestionPerformance>;
  questionsMemorized: number;
  sessionStartTime: number;
  totalTimeSpent: number;
};

export type Profile = {
  id: string;
  name: string;
  stats: ProfileStats;
};

export type CatechizerSettings = {
  childModeEnabled: boolean;
  childModePin: string;
  currentProfileId: string | null;
  hasSeenProofHelp: boolean;
  theme: "light" | "dark";
};
