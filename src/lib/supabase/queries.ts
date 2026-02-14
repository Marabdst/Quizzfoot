"use server";

import { createClient } from "@/lib/supabase/server";

/** Fetch the current user's profile */
export async function getProfile() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

    return data;
}

/** Fetch top N players for leaderboard */
export async function getLeaderboard(limit = 20) {
    const supabase = await createClient();
    const { data } = await supabase
        .from("profiles")
        .select("id, username, xp, level, games_played, correct_answers, total_answers")
        .order("xp", { ascending: false })
        .limit(limit);

    return data ?? [];
}

/** Save a quiz attempt and update profile stats */
export async function saveQuizAttempt(input: {
    categoryId: string | null;
    score: number;
    total: number;
    timeMs: number;
    answers: { questionId: string; selectedAnswer: string; isCorrect: boolean; timeMs: number }[];
    isDaily?: boolean;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Non connecté" };

    // 1. Insert attempt
    const { error: attemptError } = await supabase.from("attempts").insert({
        user_id: user.id,
        category_id: input.categoryId,
        score: input.score,
        total: input.total,
        time_ms: input.timeMs,
        answers: input.answers,
        is_daily: input.isDaily ?? false,
    });

    if (attemptError) return { error: attemptError.message };

    // 2. Update profile stats
    const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

    if (profile) {
        const newGamesPlayed = (profile.games_played || 0) + 1;
        const newCorrectAnswers = (profile.correct_answers || 0) + input.score;
        const newTotalAnswers = (profile.total_answers || 0) + input.total;
        const xpGained = input.score * 10 + (input.score === input.total ? 50 : 0);
        const newXp = (profile.xp || 0) + xpGained;
        const newLevel = Math.floor(newXp / 500) + 1;

        // Calculate streak
        const today = new Date().toDateString();
        const lastPlayed = profile.last_played_at ? new Date(profile.last_played_at).toDateString() : null;
        const yesterday = new Date(Date.now() - 86400000).toDateString();
        let newStreak = profile.streak || 0;
        if (lastPlayed !== today) {
            newStreak = lastPlayed === yesterday ? newStreak + 1 : 1;
        }

        await supabase.from("profiles").update({
            games_played: newGamesPlayed,
            correct_answers: newCorrectAnswers,
            total_answers: newTotalAnswers,
            xp: newXp,
            level: newLevel,
            streak: newStreak,
            best_streak: Math.max(newStreak, profile.best_streak || 0),
            last_played_at: new Date().toISOString(),
        }).eq("id", user.id);

        return { xpGained, newXp, newLevel };
    }

    return {};
}
