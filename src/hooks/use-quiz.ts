"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import type { Question, AnswerRecord, QuizState } from "@/types";
import { DEFAULT_TIMER_MS } from "@/lib/constants";

export function useQuiz(questions: Question[], timerEnabled = true, timerMs = DEFAULT_TIMER_MS) {
    const [state, setState] = useState<QuizState>({
        status: "idle",
        questions,
        currentIndex: 0,
        answers: [],
        score: 0,
        streak: 0,
        startTime: 0,
        timePerQuestion: timerMs,
        timerEnabled,
    });

    const questionStartRef = useRef(0);

    const start = useCallback(() => {
        questionStartRef.current = Date.now();
        setState((s) => ({ ...s, status: "playing", startTime: Date.now(), currentIndex: 0, answers: [], score: 0, streak: 0 }));
    }, []);

    const answer = useCallback((selectedAnswer: string) => {
        setState((prev) => {
            if (prev.status !== "playing") return prev;
            const question = prev.questions[prev.currentIndex];
            const isCorrect = selectedAnswer === question.answer;
            const timeMs = Date.now() - questionStartRef.current;
            const record: AnswerRecord = { questionId: question.id, selectedAnswer, isCorrect, timeMs };
            return {
                ...prev,
                status: "answered",
                answers: [...prev.answers, record],
                score: isCorrect ? prev.score + 1 : prev.score,
                streak: isCorrect ? prev.streak + 1 : 0,
            };
        });
    }, []);

    const next = useCallback(() => {
        setState((prev) => {
            const nextIndex = prev.currentIndex + 1;
            if (nextIndex >= prev.questions.length) {
                return { ...prev, status: "finished" };
            }
            questionStartRef.current = Date.now();
            return { ...prev, status: "playing", currentIndex: nextIndex };
        });
    }, []);

    const reset = useCallback(() => {
        setState((s) => ({ ...s, status: "idle", currentIndex: 0, answers: [], score: 0, streak: 0 }));
    }, []);

    return { state, start, answer, next, reset };
}

export function useTimer(durationMs: number, onTimeout: () => void, active: boolean) {
    const [remaining, setRemaining] = useState(durationMs);
    const callbackRef = useRef(onTimeout);
    callbackRef.current = onTimeout;

    useEffect(() => {
        if (!active) { setRemaining(durationMs); return; }
        setRemaining(durationMs);
        const interval = setInterval(() => {
            setRemaining((r) => {
                if (r <= 100) { callbackRef.current(); return 0; }
                return r - 100;
            });
        }, 100);
        return () => clearInterval(interval);
    }, [active, durationMs]);

    return { remaining, percent: (remaining / durationMs) * 100 };
}

export function useSound() {
    const [enabled, setEnabled] = useState(true);
    const play = useCallback((type: "correct" | "wrong" | "tick" | "complete") => {
        if (!enabled) return;
        // Audio feedback via Web Audio API (no external files needed)
        try {
            const ctx = new AudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            gain.gain.value = 0.1;
            const freqs = { correct: 880, wrong: 220, tick: 440, complete: 660 };
            osc.frequency.value = freqs[type];
            osc.type = type === "correct" ? "sine" : type === "wrong" ? "sawtooth" : "sine";
            osc.start();
            osc.stop(ctx.currentTime + (type === "wrong" ? 0.3 : 0.15));
        } catch { /* Audio not supported */ }
    }, [enabled]);

    return { enabled, setEnabled, play };
}
