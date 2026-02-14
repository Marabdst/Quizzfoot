import { z } from "zod";

/** Schéma de validation pour une question */
export const questionSchema = z.object({
    type: z.enum(["mcq", "tf", "whoami"]),
    question: z.string().min(10, "La question doit faire au moins 10 caractères"),
    choices: z.array(z.string()).min(2, "Au moins 2 choix requis").max(4),
    answer: z.string().min(1, "La réponse est requise"),
    explanation: z.string().optional(),
    difficulty: z.number().int().min(1).max(5),
    categoryId: z.string().uuid("ID catégorie invalide"),
    tags: z.array(z.string()).default([]),
    season: z.string().optional(),
    competition: z.string().optional(),
    sourceUrl: z.string().url("URL invalide").optional().or(z.literal("")),
});

export type QuestionInput = z.infer<typeof questionSchema>;

/** Schéma pour soumettre un quiz */
export const quizSubmitSchema = z.object({
    categoryId: z.string().optional(),
    answers: z.array(
        z.object({
            questionId: z.string(),
            selectedAnswer: z.string(),
            timeMs: z.number().int().min(0),
        })
    ),
    isDaily: z.boolean().default(false),
    totalTimeMs: z.number().int().min(0),
});

export type QuizSubmitInput = z.infer<typeof quizSubmitSchema>;

/** Schéma pour login / register */
export const authSchema = z.object({
    email: z.string().email("Email invalide"),
    password: z.string().min(6, "Le mot de passe doit faire au moins 6 caractères"),
});

export const registerSchema = authSchema.extend({
    username: z
        .string()
        .min(3, "Le pseudo doit faire au moins 3 caractères")
        .max(20, "Le pseudo ne doit pas dépasser 20 caractères")
        .regex(/^[a-zA-Z0-9_-]+$/, "Caractères autorisés : lettres, chiffres, _ et -"),
});

export type AuthInput = z.infer<typeof authSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;

/** Schéma pour créer un duel */
export const duelCreateSchema = z.object({
    categoryId: z.string().uuid().optional(),
    questionCount: z.number().int().min(5).max(20).default(10),
});

export type DuelCreateInput = z.infer<typeof duelCreateSchema>;
