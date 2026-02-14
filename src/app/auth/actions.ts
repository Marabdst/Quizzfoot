"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { authSchema, registerSchema } from "@/lib/validators";

export async function login(formData: FormData) {
    const raw = {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
    };

    const parsed = authSchema.safeParse(raw);
    if (!parsed.success) {
        return { error: parsed.error.errors[0].message };
    }

    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword(parsed.data);

    if (error) {
        return { error: error.message };
    }

    redirect("/profile");
}

export async function register(formData: FormData) {
    const raw = {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
        username: formData.get("username") as string,
    };

    const parsed = registerSchema.safeParse(raw);
    if (!parsed.success) {
        return { error: parsed.error.errors[0].message };
    }

    const supabase = await createClient();
    const { error } = await supabase.auth.signUp({
        email: parsed.data.email,
        password: parsed.data.password,
        options: {
            data: { username: parsed.data.username },
        },
    });

    if (error) {
        return { error: error.message };
    }

    redirect("/profile");
}

export async function logout() {
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/");
}
