"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Plus, Search, Download, Trash2, Edit, X, Save, Loader2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DIFFICULTY_LABELS, DIFFICULTY_COLORS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/use-auth";

interface Category { id: string; name: string; slug: string; description: string; icon: string; color: string; }
interface Question {
    id: string; type: string; question: string; choices: string[]; answer: string;
    explanation: string; difficulty: number; category_id: string; tags: string[];
    season: string; competition: string;
}

const emptyQuestion: Omit<Question, "id"> = {
    type: "mcq", question: "", choices: ["", "", "", ""], answer: "",
    explanation: "", difficulty: 2, category_id: "", tags: [], season: "", competition: "",
};

export default function AdminPage() {
    const { user } = useAuth();
    const [questions, setQuestions] = useState<Question[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [selectedCat, setSelectedCat] = useState("all");
    const [editing, setEditing] = useState<Omit<Question, "id"> & { id?: string } | null>(null);
    const [saving, setSaving] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [stats, setStats] = useState({ players: 0, attempts: 0 });

    useEffect(() => {
        const supabase = createClient();
        async function load() {
            // Check admin status
            if (user) {
                const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single();
                setIsAdmin(profile?.is_admin ?? false);
            }
            // Load data
            const [{ data: cats }, { data: qs }, { count: playerCount }, { count: attemptCount }] = await Promise.all([
                supabase.from("categories").select("*").order("name"),
                supabase.from("questions").select("*").order("created_at", { ascending: false }),
                supabase.from("profiles").select("*", { count: "exact", head: true }),
                supabase.from("attempts").select("*", { count: "exact", head: true }),
            ]);
            setCategories(cats ?? []);
            setQuestions(qs ?? []);
            setStats({ players: playerCount ?? 0, attempts: attemptCount ?? 0 });
            setLoading(false);
        }
        load();
    }, [user]);

    const filtered = questions.filter((q) => {
        const matchSearch = q.question.toLowerCase().includes(search.toLowerCase());
        const matchCat = selectedCat === "all" || q.category_id === selectedCat;
        return matchSearch && matchCat;
    });

    const handleSave = async () => {
        if (!editing) return;
        setSaving(true);
        const supabase = createClient();
        const data = { ...editing };
        const id = data.id;
        delete (data as Record<string, unknown>).id;

        if (id) {
            // Update
            await supabase.from("questions").update(data).eq("id", id);
            setQuestions((qs) => qs.map((q) => q.id === id ? { ...q, ...data } as Question : q));
        } else {
            // Insert
            const { data: inserted } = await supabase.from("questions").insert(data).select().single();
            if (inserted) setQuestions((qs) => [inserted, ...qs]);
        }
        setEditing(null);
        setSaving(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Supprimer cette question ?")) return;
        const supabase = createClient();
        await supabase.from("questions").delete().eq("id", id);
        setQuestions((qs) => qs.filter((q) => q.id !== id));
    };

    const handleExportJSON = () => {
        const blob = new Blob([JSON.stringify(questions, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a"); a.href = url; a.download = "questions.json"; a.click();
        URL.revokeObjectURL(url);
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-24 flex justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!isAdmin) {
        return (
            <div className="container mx-auto px-4 py-16 text-center max-w-lg">
                <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-yellow-500" />
                <h1 className="font-heading text-2xl font-bold mb-2">Accès restreint</h1>
                <p className="text-muted-foreground">Cette page est réservée aux administrateurs.</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <Shield className="h-8 w-8 text-primary" />
                    <div>
                        <h1 className="font-heading text-3xl font-bold">Administration</h1>
                        <p className="text-sm text-muted-foreground">Gestion des questions et du contenu</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleExportJSON} className="gap-1"><Download className="h-4 w-4" /> JSON</Button>
                    <Button size="sm" onClick={() => setEditing({ ...emptyQuestion, category_id: categories[0]?.id ?? "" })} className="gap-1">
                        <Plus className="h-4 w-4" /> Ajouter
                    </Button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                    { label: "Questions", value: questions.length, color: "text-primary" },
                    { label: "Catégories", value: categories.length, color: "text-blue-500" },
                    { label: "Joueurs", value: stats.players, color: "text-green-500" },
                    { label: "Parties jouées", value: stats.attempts, color: "text-purple-500" },
                ].map((s) => (
                    <Card key={s.label}>
                        <CardContent className="p-4 text-center">
                            <div className={`font-heading text-3xl font-bold ${s.color}`}>{s.value}</div>
                            <div className="text-xs text-muted-foreground">{s.label}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Edit Modal */}
            <AnimatePresence>
                {editing && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
                        onClick={() => setEditing(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-background border rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="font-heading text-xl font-bold">{editing.id ? "Modifier" : "Nouvelle question"}</h2>
                                <button onClick={() => setEditing(null)}><X className="h-5 w-5" /></button>
                            </div>
                            <div className="space-y-4">
                                {/* Type + Difficulty */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium block mb-1">Type</label>
                                        <select value={editing.type} onChange={(e) => setEditing({ ...editing, type: e.target.value })}
                                            className="w-full px-3 py-2 rounded-lg border bg-background text-sm">
                                            <option value="mcq">QCM</option>
                                            <option value="tf">Vrai/Faux</option>
                                            <option value="whoami">Qui suis-je ?</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium block mb-1">Difficulté</label>
                                        <select value={editing.difficulty} onChange={(e) => setEditing({ ...editing, difficulty: Number(e.target.value) })}
                                            className="w-full px-3 py-2 rounded-lg border bg-background text-sm">
                                            {[1, 2, 3, 4, 5].map((d) => <option key={d} value={d}>{DIFFICULTY_LABELS[d]}</option>)}
                                        </select>
                                    </div>
                                </div>
                                {/* Category */}
                                <div>
                                    <label className="text-sm font-medium block mb-1">Catégorie</label>
                                    <select value={editing.category_id} onChange={(e) => setEditing({ ...editing, category_id: e.target.value })}
                                        className="w-full px-3 py-2 rounded-lg border bg-background text-sm">
                                        {categories.map((c) => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
                                    </select>
                                </div>
                                {/* Question */}
                                <div>
                                    <label className="text-sm font-medium block mb-1">Question</label>
                                    <textarea value={editing.question} onChange={(e) => setEditing({ ...editing, question: e.target.value })}
                                        className="w-full px-3 py-2 rounded-lg border bg-background text-sm min-h-[80px]" />
                                </div>
                                {/* Choices */}
                                <div>
                                    <label className="text-sm font-medium block mb-1">Choix (séparés par ligne)</label>
                                    {editing.choices.map((c, i) => (
                                        <input key={i} value={c} onChange={(e) => {
                                            const newChoices = [...editing.choices];
                                            newChoices[i] = e.target.value;
                                            setEditing({ ...editing, choices: newChoices });
                                        }} placeholder={`Choix ${i + 1}`}
                                            className="w-full px-3 py-2 rounded-lg border bg-background text-sm mb-2" />
                                    ))}
                                </div>
                                {/* Answer */}
                                <div>
                                    <label className="text-sm font-medium block mb-1">Bonne réponse</label>
                                    <input value={editing.answer} onChange={(e) => setEditing({ ...editing, answer: e.target.value })}
                                        className="w-full px-3 py-2 rounded-lg border bg-background text-sm" />
                                </div>
                                {/* Explanation */}
                                <div>
                                    <label className="text-sm font-medium block mb-1">Explication</label>
                                    <textarea value={editing.explanation} onChange={(e) => setEditing({ ...editing, explanation: e.target.value })}
                                        className="w-full px-3 py-2 rounded-lg border bg-background text-sm min-h-[60px]" />
                                </div>
                                {/* Competition + Season */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium block mb-1">Compétition</label>
                                        <input value={editing.competition} onChange={(e) => setEditing({ ...editing, competition: e.target.value })}
                                            className="w-full px-3 py-2 rounded-lg border bg-background text-sm" />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium block mb-1">Saison</label>
                                        <input value={editing.season} onChange={(e) => setEditing({ ...editing, season: e.target.value })}
                                            className="w-full px-3 py-2 rounded-lg border bg-background text-sm" />
                                    </div>
                                </div>
                                {/* Save */}
                                <div className="flex gap-3 pt-2">
                                    <Button variant="outline" onClick={() => setEditing(null)} className="flex-1">Annuler</Button>
                                    <Button onClick={handleSave} disabled={saving || !editing.question || !editing.answer} className="flex-1 gap-2">
                                        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                        {saving ? "Enregistrement..." : "Enregistrer"}
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Filters */}
            <Card className="mb-6">
                <CardContent className="p-4 flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                            type="text" placeholder="Rechercher une question..."
                            value={search} onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                    <select value={selectedCat} onChange={(e) => setSelectedCat(e.target.value)}
                        className="px-3 py-2 rounded-lg border bg-background text-sm">
                        <option value="all">Toutes les catégories</option>
                        {categories.map((c) => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
                    </select>
                </CardContent>
            </Card>

            {/* Questions list */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Questions ({filtered.length})</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="divide-y max-h-[600px] overflow-y-auto">
                        {filtered.map((q) => {
                            const cat = categories.find((c) => c.id === q.category_id);
                            return (
                                <div key={q.id} className="px-6 py-3 hover:bg-accent/50 transition-colors flex items-start gap-4">
                                    <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full bg-muted shrink-0 mt-1", DIFFICULTY_COLORS[q.difficulty])}>
                                        {q.difficulty}
                                    </span>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">{q.question}</p>
                                        <p className="text-xs text-muted-foreground">{cat?.icon} {cat?.name} · {q.type.toUpperCase()} · Réponse : {q.answer}</p>
                                    </div>
                                    <div className="flex gap-1 shrink-0">
                                        <button className="p-1.5 rounded hover:bg-muted" title="Modifier" onClick={() => setEditing({ ...q })}>
                                            <Edit className="h-3.5 w-3.5" />
                                        </button>
                                        <button className="p-1.5 rounded hover:bg-red-100 dark:hover:bg-red-900/20 text-red-500" title="Supprimer" onClick={() => handleDelete(q.id)}>
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
