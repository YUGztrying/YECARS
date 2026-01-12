"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Check, Loader2, ArrowLeft, AlertCircle } from "lucide-react";
import { format, add } from "date-fns";
import { Alert, AlertDescription } from "@/components/ui/alert";

function SouscriptionContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const planId = searchParams.get('plan_id');

    const [plan, setPlan] = useState<any>(null);
    const [user, setUser] = useState<any>(null);
    const [isLoadingPlan, setIsLoadingPlan] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        nom: "",
        prenom: "",
        email: "",
        telephone: "",
        adresse: "",
        ville: "",
        commentaires: ""
    });

    useEffect(() => {
        const loadData = async () => {
            try {
                if (!planId) {
                    setError("Aucun plan sélectionné");
                    setIsLoadingPlan(false);
                    return;
                }

                // 1. Fetch Plan
                const { data: planData, error: planError } = await supabase
                    .from('subscription_plans')
                    .select('*')
                    .eq('id', planId)
                    .single();

                if (planError || !planData) throw new Error("Plan introuvable");

                // Map features to details if needed
                const mappedPlan = {
                    ...planData,
                    details: planData.features || []
                };
                setPlan(mappedPlan);

                // 2. Fetch User
                try {
                    const { data: { user: currentUser } } = await supabase.auth.getUser();

                    if (currentUser) {
                        setUser(currentUser);
                        setFormData(prev => ({
                            ...prev,
                            email: currentUser.email || "",
                            nom: currentUser.user_metadata?.full_name?.split(' ').pop() || '',
                            prenom: currentUser.user_metadata?.full_name?.split(' ')[0] || '',
                            telephone: currentUser.user_metadata?.phone || ''
                        }));
                    }
                } catch (error) {
                    console.log("Utilisateur non connecté", error);
                }
            } catch (error) {
                console.error(error);
                setError("Erreur lors du chargement du plan");
            }
            setIsLoadingPlan(false);
        };
        loadData();
    }, [planId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.nom || !formData.prenom || !formData.email || !formData.telephone) {
            alert("Veuillez remplir tous les champs obligatoires");
            return;
        }

        setIsSubmitting(true);
        try {
            const startDate = new Date();
            const durationMonths = plan.duration_months || 1;
            const endDate = add(startDate, { months: durationMonths });

            const { data: newSubscription, error: subError } = await supabase
                .from('user_subscriptions')
                .insert({
                    user_email: formData.email,
                    nom: formData.nom,
                    prenom: formData.prenom,
                    telephone: formData.telephone,
                    adresse: formData.adresse || "",
                    ville: formData.ville || "",
                    plan_id: plan.id,
                    plan_name: plan.name,
                    status: 'en_attente',
                    start_date: startDate.toISOString(),
                    end_date: endDate.toISOString(),
                    is_initial_payment_collected: false,
                    duration_months: durationMonths,
                    price_paid: plan.price
                })
                .select()
                .single();

            if (subError) throw subError;

            router.push(`/confirmation-abonnement?subscription_id=${newSubscription.id}&plan_name=${encodeURIComponent(plan.name)}&price=${plan.price}`);
        } catch (error: any) {
            console.error(error);
            alert(error.message || "Erreur lors de la souscription. Veuillez réessayer.");
        }
        setIsSubmitting(false);
    };

    if (isLoadingPlan) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-red-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-red-600" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <Alert variant="destructive" className="max-w-md">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                    <Button variant="outline" className="mt-4 w-full" onClick={() => router.push('/abonnements')}>Retour</Button>
                </Alert>
            </div>
        )
    }

    if (!plan) return null;

    const isEmailPrefilledFromAccount = user && formData.email && formData.email.length > 0;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-red-50 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <Button
                    variant="ghost"
                    onClick={() => router.push("/abonnements")}
                    className="mb-6"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Retour aux abonnements
                </Button>

                <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                        Souscrire à l'abonnement {plan.name}
                    </h1>
                    <p className="text-xl text-slate-600">
                        Remplissez vos informations pour finaliser votre souscription
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    <div className="md:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Vos informations</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="prenom">Prénom *</Label>
                                            <Input
                                                id="prenom"
                                                value={formData.prenom}
                                                onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                                                placeholder="Votre prénom"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="nom">Nom *</Label>
                                            <Input
                                                id="nom"
                                                value={formData.nom}
                                                onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                                                placeholder="Votre nom"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="email">Email *</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                placeholder="votre@email.com"
                                                required
                                                disabled={!!isEmailPrefilledFromAccount}
                                            />
                                            {isEmailPrefilledFromAccount && (
                                                <p className="text-xs text-slate-500 mt-1">
                                                    Email automatiquement rempli depuis votre compte
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <Label htmlFor="telephone">Téléphone *</Label>
                                            <Input
                                                id="telephone"
                                                type="tel"
                                                value={formData.telephone}
                                                onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                                                placeholder="+225 01 23 45 67 89"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="adresse">Adresse (optionnel)</Label>
                                        <Input
                                            id="adresse"
                                            value={formData.adresse}
                                            onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
                                            placeholder="Votre adresse"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="ville">Ville (optionnel)</Label>
                                        <Input
                                            id="ville"
                                            value={formData.ville}
                                            onChange={(e) => setFormData({ ...formData, ville: e.target.value })}
                                            placeholder="Abidjan"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="commentaires">Commentaires (optionnel)</Label>
                                        <Textarea
                                            id="commentaires"
                                            value={formData.commentaires}
                                            onChange={(e) => setFormData({ ...formData, commentaires: e.target.value })}
                                            placeholder="Informations supplémentaires..."
                                            className="h-24"
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full bg-red-600 hover:bg-red-700 text-lg py-6"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                                Traitement en cours...
                                            </>
                                        ) : (
                                            <>
                                                <Check className="w-5 h-5 mr-2" />
                                                Confirmer la souscription
                                            </>
                                        )}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="md:col-span-1">
                        <Card className="sticky top-4">
                            <CardHeader className="bg-slate-900 text-white">
                                <CardTitle>Récapitulatif</CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 space-y-4">
                                <div>
                                    <p className="text-sm text-slate-500">Forfait</p>
                                    <p className="text-xl font-bold text-slate-900">{plan.name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500">Durée</p>
                                    <p className="font-semibold">{plan.duration_months || 1} mois</p>
                                </div>
                                <div className="border-t pt-4">
                                    <p className="text-sm text-slate-500 mb-2">Avantages inclus</p>
                                    <ul className="space-y-1">
                                        {plan.details && Array.isArray(plan.details) && plan.details.map((detail: string, i: number) => (
                                            <li key={i} className="flex items-start gap-2 text-sm">
                                                <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                                <span>{detail}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="border-t pt-4">
                                    <p className="text-sm text-slate-500">Total</p>
                                    <p className="text-3xl font-bold text-red-600">{plan.price.toLocaleString()} FCFA</p>
                                </div>
                                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-sm">
                                    <p className="font-semibold text-orange-900 mb-1">💰 Paiement sur place lors du premier lavage</p>
                                    <p className="text-orange-800 text-xs">
                                        Votre abonnement sera activé immédiatement. Vous paierez le montant lors de votre premier rendez-vous.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function SouscriptionAbonnement() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-red-600" /></div>}>
            <SouscriptionContent />
        </Suspense>
    );
}
