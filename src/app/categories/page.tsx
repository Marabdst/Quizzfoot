"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { CardGridSkeleton } from "@/components/ui/skeleton";
import { createClient } from "@/lib/supabase/client";

interface Category {
    id: string;
    name: string;
    slug: string;
    description: string;
    icon: string;
    color: string;
    question_count?: number;
}

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.4 } }),
};

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const supabase = createClient();
        async function load() {
            const { data: cats } = await supabase.from("categories").select("*").order("name");
            if (!cats) { setLoading(false); return; }

            // Count questions per category
            const withCounts = await Promise.all(
                cats.map(async (cat) => {
                    const { count } = await supabase
                        .from("questions")
                        .select("*", { count: "exact", head: true })
                        .eq("category_id", cat.id);
                    return { ...cat, question_count: count ?? 0 };
                })
            );
            setCategories(withCounts);
            setLoading(false);
        }
        load();
    }, []);

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-12">
                <div className="text-center mb-12">
                    <h1 className="font-heading text-4xl font-bold mb-3">Catégories</h1>
                    <p className="text-muted-foreground">Choisis un thème et lance-toi !</p>
                </div>
                <CardGridSkeleton count={10} />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="text-center mb-12">
                <h1 className="font-heading text-4xl font-bold mb-3">Catégories</h1>
                <p className="text-muted-foreground">Choisis un thème et lance-toi !</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {categories.map((cat, i) => (
                    <motion.div key={cat.id} initial="hidden" animate="visible" variants={fadeUp} custom={i}>
                        <Link href={`/quiz/category/${cat.slug}`}>
                            <Card className="group hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer h-full">
                                <CardContent className="p-6 flex items-start gap-4">
                                    <div
                                        className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl shrink-0 transition-transform group-hover:scale-110 group-hover:rotate-3"
                                        style={{ backgroundColor: cat.color + "20" }}
                                    >
                                        {cat.icon}
                                    </div>
                                    <div>
                                        <h3 className="font-heading font-bold text-lg mb-1">{cat.name}</h3>
                                        <p className="text-sm text-muted-foreground mb-2">{cat.description}</p>
                                        <span className="text-xs font-medium text-primary">{cat.question_count} questions →</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
