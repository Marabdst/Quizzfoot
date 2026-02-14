// ──────────────────────────────────────────────
// Types principaux de l'application Quiz Football
// ──────────────────────────────────────────────

export type QuestionType = "mcq" | "tf" | "whoami";
export type Difficulty = 1 | 2 | 3 | 4 | 5;
export type DuelStatus = "pending" | "active" | "completed";

export interface Category {
    id: string;
    name: string;
    slug: string;
    description: string;
    icon: string;
    color: string;
    questionCount?: number;
}

export interface Question {
    id: string;
    type: QuestionType;
    question: string;
    choices: string[];
    answer: string;
    explanation: string;
    difficulty: Difficulty;
    categoryId: string;
    tags: string[];
    season?: string;
    competition?: string;
    sourceUrl?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface UserProfile {
    id: string;
    username: string;
    avatarUrl?: string;
    xp: number;
    level: number;
    streak: number;
    bestStreak: number;
    gamesPlayed: number;
    correctAnswers: number;
    totalAnswers: number;
    isAdmin: boolean;
    lastPlayedAt?: string;
    createdAt: string;
}

export interface QuizAttempt {
    id: string;
    userId: string;
    categoryId?: string;
    score: number;
    total: number;
    timeMs: number;
    answers: AnswerRecord[];
    isDaily: boolean;
    createdAt: string;
}

export interface AnswerRecord {
    questionId: string;
    selectedAnswer: string;
    isCorrect: boolean;
    timeMs: number;
}

export interface DailyChallenge {
    id: string;
    date: string;
    questionIds: string[];
}

export interface Duel {
    id: string;
    challengerId: string;
    opponentId?: string;
    questionIds: string[];
    challengerScore?: number;
    opponentScore?: number;
    status: DuelStatus;
    createdAt: string;
}

// Quiz state machine
export type QuizStatus = "idle" | "playing" | "answered" | "finished";

export interface QuizState {
    status: QuizStatus;
    questions: Question[];
    currentIndex: number;
    answers: AnswerRecord[];
    score: number;
    streak: number;
    startTime: number;
    timePerQuestion: number;
    timerEnabled: boolean;
}

// Leaderboard
export interface LeaderboardEntry {
    rank: number;
    userId: string;
    username: string;
    avatarUrl?: string;
    xp: number;
    level: number;
    accuracy: number;
    gamesPlayed: number;
}

// Badge system
export interface Badge {
    id: string;
    name: string;
    description: string;
    icon: string;
    condition: string;
    unlockedAt?: string;
}
