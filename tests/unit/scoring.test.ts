import { describe, it, expect } from "vitest";
import {
    calculateXP,
    calculateEloChange,
    getLevelFromXP,
    getXPForNextLevel,
    getLevelProgress,
    getAccuracy,
    formatTime,
    shuffleArray,
} from "@/lib/utils";

describe("calculateXP", () => {
    it("retourne 0 si la réponse est incorrecte", () => {
        expect(calculateXP(false, 3, 5, 8000)).toBe(0);
    });

    it("donne un XP de base = difficulté * 10", () => {
        // difficulté 3, streak 0, temps > 10s => pas de bonus
        expect(calculateXP(true, 3, 0, 15000)).toBe(30);
    });

    it("ajoute un bonus de streak (max 10)", () => {
        // streak 5 => bonus = 5 * 2 = 10
        expect(calculateXP(true, 1, 5, 15000)).toBe(10 + 10);
    });

    it("ajoute un bonus de vitesse pour < 5s", () => {
        expect(calculateXP(true, 1, 0, 3000)).toBe(10 + 5);
    });

    it("ajoute un bonus de vitesse réduit pour < 10s", () => {
        expect(calculateXP(true, 1, 0, 7000)).toBe(10 + 3);
    });

    it("plafonne le streak bonus à 10", () => {
        // streak 15 => capped at 10 => bonus = 10 * 2 = 20
        expect(calculateXP(true, 1, 15, 15000)).toBe(10 + 20);
    });
});

describe("calculateEloChange", () => {
    it("retourne un gain positif en cas de victoire", () => {
        const change = calculateEloChange(1500, 1500, true);
        expect(change).toBeGreaterThan(0);
        expect(change).toBe(16); // K=32, expected=0.5, actual=1 => 32*(1-0.5)=16
    });

    it("retourne un changement négatif en cas de défaite", () => {
        const change = calculateEloChange(1500, 1500, false);
        expect(change).toBeLessThan(0);
        expect(change).toBe(-16);
    });

    it("donne plus de points quand le joueur bat un adversaire plus fort", () => {
        const strong = calculateEloChange(1200, 1800, true);
        const equal = calculateEloChange(1500, 1500, true);
        expect(strong).toBeGreaterThan(equal);
    });
});

describe("getLevelFromXP", () => {
    it("retourne 1 pour 0 XP", () => {
        expect(getLevelFromXP(0)).toBe(1);
    });

    it("retourne 2 pour 100 XP", () => {
        expect(getLevelFromXP(100)).toBe(2);
    });

    it("retourne 4 pour 900 XP", () => {
        expect(getLevelFromXP(900)).toBe(4);
    });
});

describe("getXPForNextLevel", () => {
    it("retourne 100 pour le niveau 1", () => {
        expect(getXPForNextLevel(1)).toBe(100);
    });

    it("retourne 400 pour le niveau 2", () => {
        expect(getXPForNextLevel(2)).toBe(400);
    });
});

describe("getAccuracy", () => {
    it("retourne 0 si aucune réponse", () => {
        expect(getAccuracy(0, 0)).toBe(0);
    });

    it("calcule correctement", () => {
        expect(getAccuracy(7, 10)).toBe(70);
        expect(getAccuracy(10, 10)).toBe(100);
    });
});

describe("formatTime", () => {
    it("formate correctement les millisecondes", () => {
        expect(formatTime(0)).toBe("0:00");
        expect(formatTime(5000)).toBe("0:05");
        expect(formatTime(65000)).toBe("1:05");
        expect(formatTime(120000)).toBe("2:00");
    });
});

describe("shuffleArray", () => {
    it("retourne un tableau de même longueur", () => {
        const arr = [1, 2, 3, 4, 5];
        expect(shuffleArray(arr)).toHaveLength(5);
    });

    it("contient les mêmes éléments", () => {
        const arr = [1, 2, 3, 4, 5];
        const shuffled = shuffleArray(arr);
        expect(shuffled.sort()).toEqual(arr.sort());
    });

    it("ne modifie pas le tableau original", () => {
        const arr = [1, 2, 3];
        shuffleArray(arr);
        expect(arr).toEqual([1, 2, 3]);
    });
});
