import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes intelligemment */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/** Calcul du niveau à partir de l'XP (progression quadratique) */
export function getLevelFromXP(xp: number): number {
    return Math.floor(Math.sqrt(xp / 100)) + 1;
}

/** XP nécessaire pour le prochain niveau */
export function getXPForNextLevel(level: number): number {
    return level * level * 100;
}

/** Pourcentage de progression vers le prochain niveau */
export function getLevelProgress(xp: number): number {
    const level = getLevelFromXP(xp);
    const currentLevelXP = (level - 1) * (level - 1) * 100;
    const nextLevelXP = level * level * 100;
    return ((xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;
}

/** Calcul des XP gagnés par question */
export function calculateXP(
    isCorrect: boolean,
    difficulty: number,
    streak: number,
    timeMs: number
): number {
    if (!isCorrect) return 0;
    const baseXP = difficulty * 10;
    const streakBonus = Math.min(streak, 10) * 2;
    const speedBonus = timeMs < 5000 ? 5 : timeMs < 10000 ? 3 : 0;
    return baseXP + streakBonus + speedBonus;
}

/** Score ELO simplifié */
export function calculateEloChange(
    playerRating: number,
    opponentRating: number,
    won: boolean,
    k: number = 32
): number {
    const expected = 1 / (1 + Math.pow(10, (opponentRating - playerRating) / 400));
    const actual = won ? 1 : 0;
    return Math.round(k * (actual - expected));
}

/** Précision en pourcentage */
export function getAccuracy(correct: number, total: number): number {
    if (total === 0) return 0;
    return Math.round((correct / total) * 100);
}

/** Formater la durée en mm:ss */
export function formatTime(ms: number): string {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

/** Formater un nombre avec séparateur de milliers */
export function formatNumber(n: number): string {
    return n.toLocaleString("fr-FR");
}

/** Shuffle un array (Fisher-Yates) */
export function shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

/** Obtenir la date du jour en format YYYY-MM-DD */
export function getTodayDateString(): string {
    return new Date().toISOString().split("T")[0];
}

/** Délai promesse */
export function delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
