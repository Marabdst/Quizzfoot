"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Zap, Trophy, Calendar, Users, Star, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";

interface Category {
    id: string; name: string; slug: string; icon: string; color: string;
    questionCount?: number;
}

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
        opacity: 1, y: 0,
        transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" },
    }),
};

export default function HomePage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [liveStats, setLiveStats] = useState({ questions: 0, categories: 0, players: 0, attempts: 0 });

    useEffect(() => {
        const supabase = createClient();
        async function load() {
            const [{ data: cats }, { count: qCount }, { count: pCount }, { count: aCount }] = await Promise.all([
                supabase.from("categories").select("id, name, slug, icon, color").order("name"),
                supabase.from("questions").select("*", { count: "exact", head: true }),
                supabase.from("profiles").select("*", { count: "exact", head: true }),
                supabase.from("attempts").select("*", { count: "exact", head: true }),
            ]);
            const catsList = cats ?? [];
            // Get question counts per category
            const { data: qCounts } = await supabase.from("questions").select("category_id");
            const countMap: Record<string, number> = {};
            (qCounts ?? []).forEach((q) => { countMap[q.category_id] = (countMap[q.category_id] || 0) + 1; });
            setCategories(catsList.map((c) => ({ ...c, questionCount: countMap[c.id] || 0 })));
            setLiveStats({ questions: qCount ?? 0, categories: catsList.length, players: pCount ?? 0, attempts: aCount ?? 0 });
        }
        load();
    }, []);

    const stats = [
        { icon: Zap, label: "Questions", value: liveStats.questions > 0 ? `${liveStats.questions}+` : "...", color: "text-yellow-500" },
        { icon: Star, label: "Catégories", value: liveStats.categories || "...", color: "text-blue-500" },
        { icon: Users, label: "Joueurs", value: liveStats.players || "...", color: "text-green-500" },
        { icon: TrendingUp, label: "Parties jouées", value: liveStats.attempts || "...", color: "text-purple-500" },
    ];

    return (
        <div className="relative overflow-hidden">
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />
            </div>

            {/* Hero */}
            <section className="container mx-auto px-4 pt-16 pb-20 text-center">
                <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                        <Calendar className="h-4 w-4" /> Daily Challenge disponible !
                    </div>
                </motion.div>

                <motion.h1 className="font-heading text-5xl md:text-7xl font-black mb-6 leading-tight" initial="hidden" animate="visible" variants={fadeUp} custom={1}>
                    Le quiz football <span className="text-gradient">ultime</span>
                </motion.h1>

                <motion.p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10" initial="hidden" animate="visible" variants={fadeUp} custom={2}>
                    {liveStats.questions}+ questions, {liveStats.categories} catégories, du débutant à l&apos;expert.
                    Teste tes connaissances, grimpe le classement et défie tes amis !
                </motion.p>

                <motion.div className="flex flex-col sm:flex-row gap-4 justify-center" initial="hidden" animate="visible" variants={fadeUp} custom={3}>
                    <Link href="/categories">
                        <Button size="xl" className="gap-2 w-full sm:w-auto">Jouer maintenant <ArrowRight className="h-5 w-5" /></Button>
                    </Link>
                    <Link href="/daily">
                        <Button variant="outline" size="xl" className="gap-2 w-full sm:w-auto"><Calendar className="h-5 w-5" /> Daily Challenge</Button>
                    </Link>
                </motion.div>

                <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-3xl mx-auto" initial="hidden" animate="visible" variants={fadeUp} custom={4}>
                    {stats.map((stat) => (
                        <div key={stat.label} className="glass-card rounded-xl p-4 text-center">
                            <stat.icon className={`h-6 w-6 mx-auto mb-2 ${stat.color}`} />
                            <div className="font-heading text-2xl font-bold">{stat.value}</div>
                            <div className="text-xs text-muted-foreground">{stat.label}</div>
                        </div>
                    ))}
                </motion.div>
            </section>

            {/* Categories */}
            <section className="container mx-auto px-4 pb-20">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="font-heading text-3xl font-bold">Catégories</h2>
                    <Link href="/categories" className="text-primary text-sm font-medium hover:underline">Voir tout →</Link>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {categories.map((cat, i) => (
                        <motion.div key={cat.id} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}>
                            <Link href={`/quiz/category/${cat.slug}`}>
                                <Card className="group hover:shadow-lg hover:scale-[1.02] transition-all duration-300 cursor-pointer overflow-hidden">
                                    <CardContent className="p-5 text-center">
                                        <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl mx-auto mb-3 transition-transform group-hover:scale-110"
                                            style={{ backgroundColor: (cat.color || "#22C55E") + "20" }}>
                                            {cat.icon}
                                        </div>
                                        <h3 className="font-heading font-semibold text-sm mb-1">{cat.name}</h3>
                                        <p className="text-xs text-muted-foreground">{cat.questionCount ?? 0} questions</p>
                                    </CardContent>
                                </Card>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Features */}
            <section className="container mx-auto px-4 pb-20">
                <h2 className="font-heading text-3xl font-bold text-center mb-12">Pourquoi QuizzFoot ?</h2>
                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        { icon: Zap, title: "3 modes de jeu", desc: "QCM, Vrai/Faux et 'Qui suis-je ?' pour varier les plaisirs." },
                        { icon: Trophy, title: "Progression & badges", desc: "Gagne de l'XP, monte de niveau et débloque des badges exclusifs." },
                        { icon: Users, title: "Défie tes amis", desc: "Crée un duel et partage le lien. Qui sera le meilleur ?" },
                    ].map((f, i) => (
                        <motion.div key={f.title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}>
                            <Card className="glass-card h-full hover:shadow-xl transition-shadow">
                                <CardContent className="p-8 text-center">
                                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                                        <f.icon className="h-7 w-7 text-primary" />
                                    </div>
                                    <h3 className="font-heading text-lg font-bold mb-2">{f.title}</h3>
                                    <p className="text-sm text-muted-foreground">{f.desc}</p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </section>
        </div>
    );
}
