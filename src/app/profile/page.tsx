"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Flame, Target, Gamepad2, Star, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { BADGES } from "@/lib/constants";
import { getLevelProgress, getXPForNextLevel } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

interface Profile {
    username: string | null;
    xp: number;
    level: number;
    streak: number;
    best_streak: number;
    games_played: number;
    correct_answers: number;
    total_answers: number;
}

export default function ProfilePage() {
    const { user } = useAuth();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;
        const supabase = createClient();
        supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single()
            .then(({ data }) => {
                setProfile(data);
                setLoading(false);
            });
    }, [user]);

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-24 flex justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <p className="text-muted-foreground">Profil introuvable.</p>
                <Link href="/categories"><Button className="mt-4">Jouer un quiz</Button></Link>
            </div>
        );
    }

    const displayName = profile.username || user?.email?.split("@")[0] || "Joueur";
    const levelProgress = getLevelProgress(profile.xp);
    const nextLevelXP = getXPForNextLevel(profile.level);
    const accuracy = profile.total_answers > 0 ? Math.round((profile.correct_answers / profile.total_answers) * 100) : 0;

    // Badge unlock logic
    const unlockedBadges: string[] = [];
    if (profile.games_played >= 1) unlockedBadges.push("first-quiz");
    if (profile.best_streak >= 5) unlockedBadges.push("streak-5");
    if (profile.games_played >= 10) unlockedBadges.push("games-10");
    if (profile.games_played >= 50) unlockedBadges.push("games-50");
    if (profile.correct_answers >= 100) unlockedBadges.push("answers-100");

    return (
        <div className="container mx-auto px-4 py-12 max-w-3xl">
            {/* Profile header */}
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-center mb-10">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">
                    {displayName[0]?.toUpperCase()}
                </div>
                <h1 className="font-heading text-3xl font-bold mb-1">{displayName}</h1>
                <p className="text-muted-foreground">Niveau {profile.level}</p>
                <div className="max-w-xs mx-auto mt-3">
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>{profile.xp} XP</span>
                        <span>{nextLevelXP} XP</span>
                    </div>
                    <Progress value={levelProgress} className="h-2" />
                </div>
            </motion.div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                {[
                    { icon: Gamepad2, label: "Parties", value: profile.games_played, color: "text-blue-500" },
                    { icon: Target, label: "Précision", value: `${accuracy}%`, color: "text-green-500" },
                    { icon: Flame, label: "Série actuelle", value: profile.streak, color: "text-orange-500" },
                    { icon: Trophy, label: "Meilleure série", value: profile.best_streak, color: "text-yellow-500" },
                ].map((s) => (
                    <Card key={s.label}>
                        <CardContent className="p-4 text-center">
                            <s.icon className={`h-6 w-6 mx-auto mb-2 ${s.color}`} />
                            <div className="font-heading text-2xl font-bold">{s.value}</div>
                            <div className="text-xs text-muted-foreground">{s.label}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Badges */}
            <Card className="mb-10">
                <CardHeader><CardTitle className="flex items-center gap-2"><Star className="h-5 w-5 text-yellow-500" /> Badges</CardTitle></CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {BADGES.map((badge) => {
                            const unlocked = unlockedBadges.includes(badge.id);
                            return (
                                <div
                                    key={badge.id}
                                    className={`p-3 rounded-xl border text-center transition-all ${unlocked ? "bg-primary/5 border-primary/20" : "opacity-40 grayscale"}`}
                                >
                                    <div className="text-2xl mb-1">{badge.icon}</div>
                                    <p className="font-medium text-xs">{badge.name}</p>
                                    <p className="text-xs text-muted-foreground">{badge.description}</p>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            <div className="text-center">
                <Link href="/categories"><Button>Jouer un quiz</Button></Link>
            </div>
        </div>
    );
}
