// ──────────────────────────────────────────────
// Constantes de l'application
// ──────────────────────────────────────────────

export const APP_NAME = "QuizzFoot";
export const APP_DESCRIPTION = "Le quiz football ultime — teste tes connaissances sur le foot !";
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

/** Nombre de questions par quiz */
export const QUIZ_SIZE = 10;

/** Timer par question (ms) */
export const DEFAULT_TIMER_MS = 20_000; // 20 secondes

/** Timer pour le daily (ms) */
export const DAILY_TIMER_MS = 15_000; // 15 secondes

/** Nombre de questions dans le daily challenge */
export const DAILY_QUIZ_SIZE = 5;

/** Niveaux de difficulté */
export const DIFFICULTY_LABELS: Record<number, string> = {
    1: "Débutant",
    2: "Facile",
    3: "Moyen",
    4: "Difficile",
    5: "Expert",
};

export const DIFFICULTY_COLORS: Record<number, string> = {
    1: "text-green-500",
    2: "text-emerald-500",
    3: "text-yellow-500",
    4: "text-orange-500",
    5: "text-red-500",
};

/** Badges disponibles */
export const BADGES = [
    { id: "first-quiz", name: "Premier pas", description: "Complète ton premier quiz", icon: "🎯", condition: "games_played >= 1" },
    { id: "perfect", name: "Sans faute !", description: "Obtiens un score parfait", icon: "💯", condition: "perfect_score" },
    { id: "streak-5", name: "En feu", description: "Série de 5 bonnes réponses", icon: "🔥", condition: "streak >= 5" },
    { id: "streak-10", name: "Inarrêtable", description: "Série de 10 bonnes réponses", icon: "⚡", condition: "streak >= 10" },
    { id: "games-10", name: "Habitué", description: "Joue 10 quiz", icon: "⭐", condition: "games_played >= 10" },
    { id: "games-50", name: "Passionné", description: "Joue 50 quiz", icon: "🏆", condition: "games_played >= 50" },
    { id: "daily-7", name: "Assidu", description: "7 jours de daily consécutifs", icon: "📅", condition: "daily_streak >= 7" },
    { id: "accuracy-90", name: "Précis", description: "Précision > 90% sur 20+ quiz", icon: "🎯", condition: "accuracy >= 90 && games >= 20" },
    { id: "speed-demon", name: "Rapide", description: "Réponds en moins de 3s", icon: "⚡", condition: "answer_time < 3000" },
    { id: "legend", name: "Légende", description: "Atteins le niveau 20", icon: "👑", condition: "level >= 20" },
] as const;

/** Catégories par défaut (icons via emoji) */
export const DEFAULT_CATEGORIES = [
    { name: "Ligue 1", slug: "ligue-1", icon: "🇫🇷", color: "#1D4ED8", description: "Le championnat de France" },
    { name: "Premier League", slug: "premier-league", icon: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", color: "#7C3AED", description: "Le championnat anglais" },
    { name: "Liga", slug: "liga", icon: "🇪🇸", color: "#DC2626", description: "Le championnat espagnol" },
    { name: "Ligue des Champions", slug: "ligue-des-champions", icon: "⭐", color: "#1E40AF", description: "La plus grande compétition européenne" },
    { name: "Coupe du Monde", slug: "coupe-du-monde", icon: "🏆", color: "#D97706", description: "La compétition suprême" },
    { name: "Ballon d'Or", slug: "ballon-dor", icon: "🏅", color: "#F59E0B", description: "Les meilleurs joueurs du monde" },
    { name: "Légendes", slug: "legendes", icon: "👑", color: "#9333EA", description: "Les plus grands joueurs de l'histoire" },
    { name: "Transferts", slug: "transferts", icon: "💰", color: "#059669", description: "Les transferts marquants" },
    { name: "Règles & Arbitrage", slug: "regles-arbitrage", icon: "📋", color: "#6B7280", description: "Les règles du jeu" },
    { name: "Culture Foot", slug: "culture-foot", icon: "⚽", color: "#EC4899", description: "Anecdotes et culture générale football" },
] as const;
