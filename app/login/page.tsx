"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Info, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState(""); // For signup
    const [isSignUp, setIsSignUp] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage(null);

        try {
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: fullName,
                        }
                    }
                });
                if (error) throw error;
                setMessage({ type: 'success', text: "Inscription réussie ! Vérifiez vos emails pour confirmer." });
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password
                });
                if (error) throw error;
                router.push("/reservation"); // Redirect to reservation or home
            }
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || "Une erreur est survenue." });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <Card className="w-full max-w-md shadow-xl">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">
                        {isSignUp ? "Créer un compte" : "Se connecter"}
                    </CardTitle>
                    <CardDescription className="text-center">
                        {isSignUp
                            ? "Entrez vos informations pour commencer"
                            : "Entrez votre email et mot de passe"}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleAuth} className="space-y-4">
                        {isSignUp && (
                            <div className="space-y-2">
                                <Label htmlFor="fullName">Nom complet</Label>
                                <Input
                                    id="fullName"
                                    placeholder="Jean Dupont"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    required
                                />
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="nom@exemple.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Mot de passe</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        {message && (
                            <Alert variant={message.type === 'error' ? "destructive" : "default"} className={message.type === 'success' ? "bg-green-50 text-green-800 border-green-200" : ""}>
                                <Info className="h-4 w-4" />
                                <AlertDescription>
                                    {message.text}
                                </AlertDescription>
                            </Alert>
                        )}

                        <Button className="w-full bg-red-600 hover:bg-red-700" type="submit" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isSignUp ? "S'inscrire" : "Se connecter"}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter>
                    <div className="text-sm text-center w-full text-slate-600">
                        {isSignUp ? "Déjà un compte ? " : "Pas encore de compte ? "}
                        <button
                            onClick={() => setIsSignUp(!isSignUp)}
                            className="text-red-600 hover:underline font-medium"
                            type="button"
                        >
                            {isSignUp ? "Se connecter" : "S'inscrire"}
                        </button>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
