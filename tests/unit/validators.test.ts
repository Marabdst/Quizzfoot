import { describe, it, expect } from "vitest";
import { questionSchema, quizSubmitSchema, authSchema, registerSchema } from "@/lib/validators";

describe("questionSchema", () => {
    const validQuestion = {
        type: "mcq",
        question: "Quel joueur a marqué le plus de buts ?",
        choices: ["Messi", "Ronaldo", "Mbappé", "Haaland"],
        answer: "Ronaldo",
        explanation: "CR7 détient le record",
        difficulty: 3,
        categoryId: "550e8400-e29b-41d4-a716-446655440000",
        tags: ["records"],
    };

    it("valide une question correcte", () => {
        const result = questionSchema.safeParse(validQuestion);
        expect(result.success).toBe(true);
    });

    it("rejette une question trop courte", () => {
        const result = questionSchema.safeParse({ ...validQuestion, question: "Qui ?" });
        expect(result.success).toBe(false);
    });

    it("rejette une difficulté hors limites", () => {
        const result = questionSchema.safeParse({ ...validQuestion, difficulty: 6 });
        expect(result.success).toBe(false);
    });

    it("rejette un type invalide", () => {
        const result = questionSchema.safeParse({ ...validQuestion, type: "essay" });
        expect(result.success).toBe(false);
    });

    it("accepte un sourceUrl vide", () => {
        const result = questionSchema.safeParse({ ...validQuestion, sourceUrl: "" });
        expect(result.success).toBe(true);
    });
});

describe("authSchema", () => {
    it("valide un email et mot de passe corrects", () => {
        const result = authSchema.safeParse({ email: "test@test.com", password: "123456" });
        expect(result.success).toBe(true);
    });

    it("rejette un email invalide", () => {
        const result = authSchema.safeParse({ email: "pas-un-email", password: "123456" });
        expect(result.success).toBe(false);
    });

    it("rejette un mot de passe trop court", () => {
        const result = authSchema.safeParse({ email: "test@test.com", password: "123" });
        expect(result.success).toBe(false);
    });
});

describe("registerSchema", () => {
    it("valide une inscription correcte", () => {
        const result = registerSchema.safeParse({ email: "a@b.com", password: "123456", username: "Player1" });
        expect(result.success).toBe(true);
    });

    it("rejette un pseudo avec des caractères spéciaux", () => {
        const result = registerSchema.safeParse({ email: "a@b.com", password: "123456", username: "user@#!" });
        expect(result.success).toBe(false);
    });

    it("rejette un pseudo trop court", () => {
        const result = registerSchema.safeParse({ email: "a@b.com", password: "123456", username: "ab" });
        expect(result.success).toBe(false);
    });
});
