"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { UserSubscription, SubscriptionPlan } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, AlertCircle, Sparkles } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const statusConfig: any = {
    en_attente: { label: "En attente de paiement", color: "bg-yellow-100 text-yellow-800" },
    actif: { label: "Actif", color: "bg-green-100 text-green-800" },
    expire: { label: "Expiré", color: "bg-slate-100 text-slate-800" },
    annule: { label: "Annulé", color: "bg-red-100 text-red-800" },
};

export default function MesAbonnements() {
    const [subscription, setSubscription] = useState<UserSubscription | null>(null);
    const [plan, setPlan] = useState<SubscriptionPlan | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user || !user.email) {
                    setError("Vous devez être connecté pour voir cette page.");
                    setIsLoading(false);
                    return;
                }

                const { data: userSubs, error: subError } = await supabase
                    .from('user_subscriptions') // Assuming table name
                    .select('*')
                    .eq('user_email', user.email)
                    .order('created_at', { ascending: false })
                    .limit(1);

                if (subError) throw subError;

                if (userSubs && userSubs.length > 0) {
                    const currentSub = userSubs[0];
                    setSubscription(currentSub);

                    const { data: planDetails } = await supabase
                        .from('subscription_plans')
                        .select('*')
                        .eq('id', currentSub.plan_id)
                        .single();

                    setPlan(planDetails);
                }
            } catch (e: any) {
                console.error("Error loading subscription", e);
                setError(e.message || "Erreur de chargement");
            }
            setIsLoading(false);
        };
        loadData();
    }, []);

    if (isLoading) {
        return <div className="text-center p-12"><Loader2 className="w-8 h-8 animate-spin mx-auto" /></div>;
    }

    if (error) {
        return (
            <div className="max-w-2xl mx-auto p-8">
                <Card className="bg-red-50 border-red-200">
                    <CardContent className="pt-6 flex items-center gap-4">
                        <AlertCircle className="w-8 h-8 text-red-600" />
                        <p className="text-red-800 font-medium">{error}</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="bg-slate-50 min-h-screen py-12">
            <div className="max-w-4xl mx-auto px-4">
                <h1 className="text-3xl font-bold text-slate-900 mb-8 text-center">Mon Abonnement</h1>

                {!subscription ? (
                    <Card className="text-center py-12">
                        <CardContent>
                            <Sparkles className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-slate-900 mb-2">
                                Aucun abonnement trouvé
                            </h3>
                            <p className="text-slate-600">
                                Vous n'avez pas encore souscrit à un abonnement.
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <Card className="shadow-xl">
                        <CardHeader className="bg-slate-800 text-white rounded-t-lg">
                            <div className="flex justify-between items-center">
                                <CardTitle className="text-2xl">{subscription.plan_name}</CardTitle>
                                <Badge className={(statusConfig[subscription.status]?.color || "bg-gray-100") + " text-base"}>
                                    {statusConfig[subscription.status]?.label || subscription.status}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 grid md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-slate-500">Date de début</p>
                                    <p className="font-semibold text-lg">{subscription.start_date ? format(new Date(subscription.start_date), 'dd MMMM yyyy', { locale: fr }) : 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500">Date de fin</p>
                                    <p className="font-semibold text-lg">{subscription.end_date ? format(new Date(subscription.end_date), 'dd MMMM yyyy', { locale: fr }) : 'N/A'}</p>
                                </div>
                            </div>
                            {plan && plan.details && Array.isArray(plan.details) && plan.details.length > 0 && (
                                <div className="bg-slate-50 p-4 rounded-lg">
                                    <h4 className="font-bold mb-2">Avantages inclus</h4>
                                    <ul className="space-y-1 text-sm list-disc list-inside">
                                        {plan.details.map((item, i) => <li key={i}>{item}</li>)}
                                    </ul>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}
