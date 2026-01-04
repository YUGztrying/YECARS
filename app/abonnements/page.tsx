"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createPageUrl } from "@/lib/utils";
import { SubscriptionPlan } from "@/types";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Star, Zap, Gem, Loader2 } from "lucide-react";

const PlanCard = ({ plan, onSubscribe }: { plan: SubscriptionPlan, onSubscribe: (plan: SubscriptionPlan) => void }) => {
    return (
        <Card className={`flex flex-col h-full shadow-lg ${plan.is_featured ? 'border-2 border-red-500 bg-red-50' : ''}`}>
            <CardHeader className="text-center">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${plan.is_featured ? 'bg-red-600' : 'bg-slate-800'}`}>
                    {plan.name.includes("Prestige") ? <Gem className="w-8 h-8 text-white" /> :
                        plan.is_featured ? <Star className="w-8 h-8 text-white" /> :
                            <Zap className="w-8 h-8 text-white" />}
                </div>
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col flex-grow">
                <ul className="space-y-3 text-slate-600 mb-6 flex-grow">
                    {plan.details.map((detail, i) => (
                        <li key={i} className="flex items-start gap-3">
                            <Check className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                            <span>{detail}</span>
                        </li>
                    ))}
                </ul>
                <div className="text-center">
                    <div className="text-4xl font-bold text-red-600 mb-2">
                        {plan.price.toLocaleString()} <span className="text-xl font-medium text-slate-500">FCFA</span>
                    </div>
                    <p className="text-sm text-slate-500 mb-6">/ {plan.duration_months > 1 ? `${plan.duration_months} mois` : 'mois'}</p>
                    <Button
                        size="lg"
                        className="w-full bg-slate-800 hover:bg-slate-900"
                        onClick={() => onSubscribe(plan)}
                    >
                        Choisir ce plan
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default function Abonnements() {
    const router = useRouter();
    const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                const { data, error } = await supabase.from('subscription_plans').select('*');
                if (error) throw error;
                // Map DB columns to UI model
                const mappedPlans = (data as any[]).map(p => ({
                    ...p,
                    details: p.features || [], // Map features to details
                    is_featured: p.is_featured || false,
                    duration_months: p.duration_months || 1
                }));
                setPlans(mappedPlans.sort((a, b) => a.price - b.price));
            } catch (e) {
                console.error("Erreur de chargement", e);
            }
            setIsLoading(false);
        };
        loadData();
    }, []);

    const handleSubscribe = async (plan: SubscriptionPlan) => {
        // Here we would typically check if user is logged in
        // For now, redirect to subscription flow which might be just reservation page with plan param?
        // User snippet logic: navigate(createPageUrl("SouscriptionAbonnement") + `?plan_id=${plan.id}`);
        // But "SouscriptionAbonnement" page code was not provided. 
        // I will assume for now we redirect to a hypothetical page or just log it.
        // Actually, logic suggests we might need to create this page. 
        // Or if the user meant 'Reservation' page adapted? No, subscription usually distinct.
        // I'll redirect to /souscription-abonnement?plan_id=... and warn user if page missing.
        router.push(`/souscription-abonnement?plan_id=${plan.id}`);
    };

    if (isLoading) {
        return <div className="text-center p-12"><Loader2 className="w-8 h-8 animate-spin mx-auto" /></div>;
    }

    return (
        <div className="bg-slate-50 py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-slate-900 sm:text-5xl">
                        Nos Abonnements
                    </h1>
                    <p className="mt-4 text-xl text-slate-600">
                        Choisissez le forfait qui vous convient pour une voiture toujours impeccable.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {plans.map(plan => (
                        <PlanCard
                            key={plan.id}
                            plan={plan}
                            onSubscribe={handleSubscribe}
                        />
                    ))}
                </div>
                <div className="text-center mt-12 p-6 bg-white rounded-lg shadow">
                    <h3 className="text-xl font-bold text-slate-800">Comment ça marche ?</h3>
                    <p className="text-slate-600 mt-2">
                        1. Choisissez votre plan, il est activé instantanément. 2. Réservez votre premier lavage. 3. Payez votre abonnement sur place lors de ce premier rendez-vous !
                    </p>
                </div>
            </div>
        </div>
    );
}
