"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Medal, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LeaderboardSkeleton } from "@/components/ui/skeleton";
import { createClient } from "@/lib/supabase/client";

interface Player {
    id: string;
    username: string | null;
    xp: number;
    level: number;
    games_played: number;
    correct_answers: number;
    total_answers: number;
}

const rankIcons = [
    <Trophy key="1" className="h-6 w-6 text-yellow-500" />,
    <Medal key="2" className="h-6 w-6 text-gray-400" />,
    <Award key="3" className="h-6 w-6 text-amber-600" />,
];

export default function LeaderboardPage() {
    const [players, setPlayers] = useState<Player[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const supabase = createClient();
        supabase
            .from("profiles")
            .select("id, username, xp, level, games_played, correct_answers, total_answers")
            .order("xp", { ascending: false })
            .limit(20)
            .then(({ data }) => {
                setPlayers(data ?? []);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-12 max-w-3xl">
                <div className="text-center mb-10">
                    <Trophy className="h-12 w-12 mx-auto mb-4 text-yellow-500" />
                    <h1 className="font-heading text-4xl font-bold mb-2">Classement</h1>
                    <p className="text-muted-foreground">Les meilleurs joueurs de QuizzFoot</p>
                </div>
                <LeaderboardSkeleton />
            </div>
        );
    }

    const hasPlayers = players.length >= 3;

    return (
        <div className="container mx-auto px-4 py-12 max-w-3xl">
            <div className="text-center mb-10">
                <Trophy className="h-12 w-12 mx-auto mb-4 text-yellow-500" />
                <h1 className="font-heading text-4xl font-bold mb-2">Classement</h1>
                <p className="text-muted-foreground">Les meilleurs joueurs de QuizzFoot</p>
            </div>

            {/* Top 3 podium */}
            {hasPlayers && (
                <div className="grid grid-cols-3 gap-4 mb-8">
                    {[players[1], players[0], players[2]].map((p, i) => (
                        <motion.div
                            key={p.id}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: i * 0.15 }}
                            className={i === 1 ? "order-first sm:order-none -mt-4" : ""}
                        >
                            <Card className={`text-center ${i === 1 ? "border-yellow-500/50 shadow-lg" : ""}`}>
                                <CardContent className="p-4 pt-6">
                                    <div className="mb-2">{rankIcons[i === 1 ? 0 : i === 0 ? 1 : 2]}</div>
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-lg mx-auto mb-2">
                                        {(p.username || "?")[0]?.toUpperCase()}
                                    </div>
                                    <p className="font-heading font-bold text-sm truncate">{p.username || "Anonyme"}</p>
                                    <p className="text-xs text-muted-foreground">{p.xp} XP</p>
                                    <p className="text-xs text-muted-foreground">Nv. {p.level}</p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Full list */}
            <Card>
                <CardHeader><CardTitle className="text-lg">Top {players.length}</CardTitle></CardHeader>
                <CardContent className="p-0">
                    {players.length === 0 ? (
                        <p className="px-6 py-8 text-center text-muted-foreground">
                            Aucun joueur pour l&apos;instant. Sois le premier ! 🚀
                        </p>
                    ) : (
                        <div className="divide-y">
                            {players.map((p, i) => {
                                const rank = i + 1;
                                const accuracy = p.total_answers > 0 ? Math.round((p.correct_answers / p.total_answers) * 100) : 0;
                                return (
                                    <motion.div
                                        key={p.id}
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="flex items-center gap-4 px-6 py-3 hover:bg-accent/50 transition-colors"
                                    >
                                        <span className={`w-8 text-center font-heading font-bold ${rank <= 3 ? "text-lg" : "text-sm text-muted-foreground"}`}>
                                            {rank <= 3 ? ["🥇", "🥈", "🥉"][rank - 1] : `#${rank}`}
                                        </span>
                                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/60 to-secondary/60 flex items-center justify-center text-white font-bold text-sm">
                                            {(p.username || "?")[0]?.toUpperCase()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-sm truncate">{p.username || "Anonyme"}</p>
                                            <p className="text-xs text-muted-foreground">Nv. {p.level} · {p.games_played} parties · {accuracy}%</p>
                                        </div>
                                        <span className="font-heading font-bold text-sm text-primary">{p.xp} XP</span>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
