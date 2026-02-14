"use client";

import { useState, useEffect, useRef } from "react";
import { Calendar, Loader2 } from "lucide-react";
import { getTodayDateString } from "@/lib/utils";
import { DAILY_QUIZ_SIZE } from "@/lib/constants";
import type { Question } from "@/types";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { saveQuizAttempt } from "@/lib/supabase/queries";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Clock, Flame, CheckCircle2, XCircle, Volume2, VolumeX, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useQuiz, useTimer, useSound } from "@/hooks/use-quiz";
import { cn, formatTime } from "@/lib/utils";
import { DIFFICULTY_LABELS, DIFFICULTY_COLORS, DAILY_TIMER_MS } from "@/lib/constants";

function DailyQuizGame({ quizQuestions }: { quizQuestions: Question[] }) {
    const { state, start, answer, next, reset } = useQuiz(quizQuestions, true, DAILY_TIMER_MS);
    const { play, enabled: soundEnabled, setEnabled: setSoundEnabled } = useSound();
    const currentQ = state.questions[state.currentIndex];
    const handleTimeout = () => { answer("__timeout__"); play("wrong"); };
    const { remaining, percent } = useTimer(DAILY_TIMER_MS, handleTimeout, state.status === "playing");
    const { user } = useAuth();
    const [xpGained, setXpGained] = useState<number | null>(null);
    const savedRef = useRef(false);

    useEffect(() => {
        if (state.status !== "finished" || !user || savedRef.current) return;
        savedRef.current = true;
        saveQuizAttempt({
            categoryId: null,
            score: state.score,
            total: state.questions.length,
            timeMs: Date.now() - state.startTime,
            answers: state.answers,
            isDaily: true,
        }).then((result) => {
            if (result && "xpGained" in result) setXpGained(result.xpGained ?? null);
        });
    }, [state.status, user, state.score, state.questions.length, state.answers, state.startTime]);

    const handleAnswer = (choice: string) => {
        if (state.status !== "playing") return;
        answer(choice);
        play(choice === currentQ.answer ? "correct" : "wrong");
    };

    if (state.status === "idle") {
        return (
            <div className="container mx-auto px-4 py-16 text-center max-w-lg">
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                    <Calendar className="h-16 w-16 mx-auto mb-4 text-primary" />
                    <h1 className="font-heading text-3xl font-bold mb-3">Daily Challenge</h1>
                    <p className="text-muted-foreground mb-2">{getTodayDateString()}</p>
                    <p className="text-sm text-muted-foreground mb-8">{DAILY_QUIZ_SIZE} questions — {DAILY_TIMER_MS / 1000}s par question</p>
                    <Button size="xl" onClick={start} className="gap-2">
                        Relever le défi <ArrowRight className="h-5 w-5" />
                    </Button>
                </motion.div>
            </div>
        );
    }

    if (state.status === "finished") {
        const pct = Math.round((state.score / state.questions.length) * 100);
        const emoji = pct === 100 ? "🏆" : pct >= 80 ? "🔥" : pct >= 50 ? "👍" : "💪";
        return (
            <div className="container mx-auto px-4 py-16 text-center max-w-lg">
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                    <div className="text-6xl mb-4">{emoji}</div>
                    <h2 className="font-heading text-3xl font-bold mb-2">Daily terminé !</h2>
                    <div className="glass-card rounded-2xl p-6 mb-6">
                        <div className="text-5xl font-heading font-black text-gradient mb-2">{state.score}/{state.questions.length}</div>
                        <p className="text-muted-foreground">{pct}% de bonnes réponses</p>
                        {xpGained !== null && (
                            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm mt-2 text-primary font-bold">+{xpGained} XP gagnés !</motion.p>
                        )}
                    </div>
                    <div className="space-y-3 mb-8 text-left">
                        {state.questions.map((q, i) => {
                            const a = state.answers[i];
                            return (
                                <Card key={q.id} className={cn("border-l-4", a?.isCorrect ? "border-l-green-500" : "border-l-red-500")}>
                                    <CardContent className="p-4">
                                        <p className="font-medium text-sm mb-1">{q.question}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {a?.isCorrect ? "✅" : "❌"} {a?.selectedAnswer === "__timeout__" ? "Temps écoulé" : a?.selectedAnswer}
                                            {!a?.isCorrect && <span className="text-green-600 dark:text-green-400"> — {q.answer}</span>}
                                        </p>
                                        {q.explanation && <p className="text-xs italic mt-1 text-muted-foreground">{q.explanation}</p>}
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                    <Link href="/categories"><Button className="gap-2"><Home className="h-4 w-4" /> Retour</Button></Link>
                </motion.div>
            </div>
        );
    }

    // PLAYING / ANSWERED
    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-muted-foreground">Question {state.currentIndex + 1}/{state.questions.length}</span>
                <div className="flex items-center gap-3">
                    {state.streak > 1 && <span className="flex items-center gap-1 text-orange-500 font-bold text-sm"><Flame className="h-4 w-4" />{state.streak}</span>}
                    <span className="font-heading font-bold">{state.score} pts</span>
                    <button onClick={() => setSoundEnabled(!soundEnabled)} className="p-1">
                        {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                    </button>
                </div>
            </div>
            <Progress value={((state.currentIndex + (state.status === "answered" ? 1 : 0)) / state.questions.length) * 100} className="mb-2 h-2" />
            {state.status === "playing" && (
                <div className="flex items-center gap-2 mb-6">
                    <Clock className={cn("h-4 w-4", percent < 30 ? "text-red-500 animate-pulse" : "text-muted-foreground")} />
                    <Progress value={percent} className="h-1.5 flex-1" indicatorClassName={cn(percent < 30 ? "bg-red-500" : percent < 60 ? "bg-yellow-500" : "bg-primary")} />
                    <span className={cn("text-xs font-mono", percent < 30 && "text-red-500")}>{formatTime(remaining)}</span>
                </div>
            )}
            <AnimatePresence mode="wait">
                <motion.div key={currentQ.id} initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -40, opacity: 0 }}>
                    <Card className="mb-6">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full bg-muted", DIFFICULTY_COLORS[currentQ.difficulty])}>{DIFFICULTY_LABELS[currentQ.difficulty]}</span>
                            </div>
                            <h2 className="font-heading text-xl font-bold">{currentQ.question}</h2>
                        </CardContent>
                    </Card>
                    <div className="grid gap-3">
                        {currentQ.choices.map((choice, i) => {
                            const letter = String.fromCharCode(65 + i);
                            const isSelected = state.answers[state.currentIndex]?.selectedAnswer === choice;
                            const isCorrect = choice === currentQ.answer;
                            const isAnswered = state.status === "answered";
                            return (
                                <motion.button key={choice} whileTap={!isAnswered ? { scale: 0.98 } : {}} disabled={isAnswered} onClick={() => handleAnswer(choice)}
                                    className={cn("flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all w-full",
                                        isAnswered && isCorrect && "border-green-500 bg-green-500/10",
                                        isAnswered && isSelected && !isCorrect && "border-red-500 bg-red-500/10",
                                        isAnswered && !isSelected && !isCorrect && "opacity-50",
                                        !isAnswered && "border-border hover:border-primary/50 hover:bg-accent cursor-pointer"
                                    )}>
                                    <span className={cn("w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm shrink-0",
                                        isAnswered && isCorrect ? "bg-green-500 text-white" : isAnswered && isSelected ? "bg-red-500 text-white" : "bg-muted"
                                    )}>{isAnswered ? (isCorrect ? <CheckCircle2 className="h-5 w-5" /> : isSelected ? <XCircle className="h-5 w-5" /> : letter) : letter}</span>
                                    <span className="font-medium text-sm">{choice}</span>
                                </motion.button>
                            );
                        })}
                    </div>
                    {state.status === "answered" && currentQ.explanation && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} className="mt-4 p-4 rounded-xl bg-muted/50 border">
                            <p className="text-sm"><strong>💡</strong> {currentQ.explanation}</p>
                        </motion.div>
                    )}
                    {state.status === "answered" && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 text-center">
                            <Button onClick={next} size="lg" className="gap-2">{state.currentIndex + 1 < state.questions.length ? "Suivante" : "Résultats"} <ArrowRight className="h-4 w-4" /></Button>
                        </motion.div>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

export default function DailyPage() {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const supabase = createClient();
        async function load() {
            // Deterministic daily selection using date as seed
            const today = getTodayDateString();
            let seed = 0;
            for (let i = 0; i < today.length; i++) seed += today.charCodeAt(i);

            const { data } = await supabase.from("questions").select("*");
            if (data) {
                const mapped: Question[] = data.map((q) => ({
                    id: q.id,
                    type: q.type as Question["type"],
                    question: q.question,
                    choices: q.choices as string[],
                    answer: q.answer,
                    explanation: q.explanation || "",
                    difficulty: q.difficulty,
                    categoryId: q.category_id,
                    tags: q.tags || [],
                    season: q.season || "",
                    competition: q.competition || "",
                }));
                // Deterministic shuffle based on today's date
                const sorted = mapped.sort((a, b) => {
                    const ha = a.id.charCodeAt(2) + seed;
                    const hb = b.id.charCodeAt(2) + seed;
                    return ha - hb;
                });
                setQuestions(sorted.slice(0, DAILY_QUIZ_SIZE));
            }
            setLoading(false);
        }
        load();
    }, []);

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-24 flex justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (questions.length === 0) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <p className="text-muted-foreground">Aucune question disponible.</p>
            </div>
        );
    }

    return <DailyQuizGame quizQuestions={questions} />;
}
