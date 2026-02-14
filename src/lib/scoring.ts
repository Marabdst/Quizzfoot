import { calculateXP, getAccuracy, getLevelFromXP } from "./utils";
import type { AnswerRecord, Question, UserProfile } from "@/types";

/**
 * Calcule le score d'un quiz terminé
 */
export function computeQuizResult(
    questions: Question[],
    answers: AnswerRecord[]
) {
    let score = 0;
    let totalXP = 0;
    let streak = 0;
    let bestStreak = 0;

    const detailedAnswers: AnswerRecord[] = answers.map((answer, i) => {
        const question = questions[i];
        const isCorrect = answer.selectedAnswer === question.answer;

        if (isCorrect) {
            score++;
            streak++;
            bestStreak = Math.max(bestStreak, streak);
            totalXP += calculateXP(true, question.difficulty, streak, answer.timeMs);
        } else {
            streak = 0;
        }

        return { ...answer, isCorrect };
    });

    return {
        score,
        total: questions.length,
        accuracy: getAccuracy(score, questions.length),
        totalXP,
        streak: bestStreak,
        isPerfect: score === questions.length,
        answers: detailedAnswers,
    };
}

/**
 * Met à jour le profil utilisateur après un quiz
 */
export function updateProfileAfterQuiz(
    profile: UserProfile,
    quizResult: ReturnType<typeof computeQuizResult>
): Partial<UserProfile> {
    const newXP = profile.xp + quizResult.totalXP;
    const newStreak = quizResult.score > 0 ? profile.streak + 1 : 0;

    return {
        xp: newXP,
        level: getLevelFromXP(newXP),
        streak: newStreak,
        bestStreak: Math.max(profile.bestStreak, newStreak),
        gamesPlayed: profile.gamesPlayed + 1,
        correctAnswers: profile.correctAnswers + quizResult.score,
        totalAnswers: profile.totalAnswers + quizResult.total,
        lastPlayedAt: new Date().toISOString(),
    };
}

/**
 * Détermine quels badges ont été débloqués
 */
export function checkBadgeUnlocks(
    profile: UserProfile,
    quizResult: ReturnType<typeof computeQuizResult>
): string[] {
    const unlocked: string[] = [];
    const updatedProfile = {
        ...profile,
        ...updateProfileAfterQuiz(profile, quizResult),
    };

    if (updatedProfile.gamesPlayed >= 1) unlocked.push("first-quiz");
    if (quizResult.isPerfect) unlocked.push("perfect");
    if (quizResult.streak >= 5) unlocked.push("streak-5");
    if (quizResult.streak >= 10) unlocked.push("streak-10");
    if (updatedProfile.gamesPlayed >= 10) unlocked.push("games-10");
    if (updatedProfile.gamesPlayed >= 50) unlocked.push("games-50");
    if (
        getAccuracy(updatedProfile.correctAnswers, updatedProfile.totalAnswers) >= 90 &&
        updatedProfile.gamesPlayed >= 20
    ) {
        unlocked.push("accuracy-90");
    }
    if (updatedProfile.level >= 20) unlocked.push("legend");

    // speed-demon : au moins une réponse < 3s
    const hasSpeedAnswer = quizResult.answers.some(
        (a) => a.isCorrect && a.timeMs < 3000
    );
    if (hasSpeedAnswer) unlocked.push("speed-demon");

    return unlocked;
}
