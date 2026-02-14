"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Swords, Copy, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/use-auth";

interface Category {
    id: string;
    name: string;
    slug: string;
    icon: string;
}

export default function DuelCreatePage() {
    const { user } = useAuth();
    const router = useRouter();
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCat, setSelectedCat] = useState("");
    const [duelLink, setDuelLink] = useState("");
    const [copied, setCopied] = useState(false);
    const [creating, setCreating] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const supabase = createClient();
        supabase.from("categories").select("id, name, slug, icon").order("name").then(({ data }) => {
            setCategories(data ?? []);
            setLoading(false);
        });
    }, []);

    const createDuel = async () => {
        if (!user) { router.push("/auth/login"); return; }
        setCreating(true);
        const supabase = createClient();

        // Pick 10 random questions from the selected category (or all)
        let query = supabase.from("questions").select("id");
        if (selectedCat) {
            const cat = categories.find((c) => c.slug === selectedCat);
            if (cat) query = query.eq("category_id", cat.id);
        }
        const { data: qs } = await query;
        const ids = (qs || []).sort(() => Math.random() - 0.5).slice(0, 10).map((q) => q.id);

        // Insert duel
        const { data: duel, error } = await supabase.from("duels").insert({
            challenger_id: user.id,
            question_ids: ids,
            status: "pending",
        }).select("id").single();

        if (duel) {
            setDuelLink(`${window.location.origin}/duel/${duel.id}`);
        }
        setCreating(false);
    };

    const copyLink = () => {
        navigator.clipboard.writeText(duelLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-24 flex justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-16 max-w-lg">
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                <div className="text-center mb-8">
                    <Swords className="h-12 w-12 mx-auto mb-4 text-primary" />
                    <h1 className="font-heading text-3xl font-bold mb-2">Créer un Duel</h1>
                    <p className="text-muted-foreground">Défie un ami et compare vos scores !</p>
                </div>

                <Card className="mb-6">
                    <CardContent className="p-6 space-y-4">
                        <div>
                            <label className="text-sm font-medium mb-2 block">Catégorie (optionnel)</label>
                            <select
                                value={selectedCat}
                                onChange={(e) => setSelectedCat(e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border bg-background text-sm"
                            >
                                <option value="">Toutes les catégories</option>
                                {categories.map((c) => (
                                    <option key={c.id} value={c.slug}>{c.icon} {c.name}</option>
                                ))}
                            </select>
                        </div>
                        <p className="text-xs text-muted-foreground">10 questions seront sélectionnées aléatoirement.</p>
                        <Button className="w-full gap-2" size="lg" onClick={createDuel} disabled={creating}>
                            {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Swords className="h-4 w-4" />}
                            {creating ? "Création..." : "Générer le duel"}
                        </Button>
                    </CardContent>
                </Card>

                {duelLink && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}>
                        <Card className="border-primary/30">
                            <CardContent className="p-6">
                                <p className="text-sm font-medium mb-3">🔗 Lien du duel :</p>
                                <div className="flex gap-2">
                                    <input
                                        readOnly
                                        value={duelLink}
                                        className="flex-1 px-3 py-2 rounded-lg border bg-muted text-xs font-mono truncate"
                                    />
                                    <Button variant="outline" size="sm" onClick={copyLink} className="gap-1 shrink-0">
                                        {copied ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                                        {copied ? "Copié" : "Copier"}
                                    </Button>
                                </div>
                                <p className="text-xs text-muted-foreground mt-3">Partage ce lien avec un ami pour qu&apos;il relève le défi !</p>
                                <Link href={duelLink.replace(window.location.origin, "")}>
                                    <Button size="sm" className="w-full mt-3 gap-2">
                                        Jouer maintenant <Swords className="h-4 w-4" />
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}
