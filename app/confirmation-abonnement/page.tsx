"use client";

import React, { useEffect, useState, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PartyPopper, Calendar, Phone, Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

function ConfirmationAbonnementContent() {
    const [planInfo, setPlanInfo] = useState({ name: "", price: 0 });
    const [emailStatus, setEmailStatus] = useState('sending'); // sending, success, error
    const searchParams = useSearchParams();
    const subscriptionId = searchParams.get('subscription_id');
    const planName = searchParams.get('plan_name') || '';
    const price = parseInt(searchParams.get('price') || '0');

    useEffect(() => {
        setPlanInfo({ name: planName, price });

        // Envoyer les emails de confirmation
        const sendEmails = async () => {
            if (!subscriptionId) {
                setEmailStatus('error');
                return;
            }

            try {
                console.log("📧 Récupération des détails de l'abonnement...");
                // Fetch subscription details if needed, or pass data directly if API handles ID lookup
                // But our API expects data object. So we fetch it first.
                const { data: subscriptionDetails, error } = await supabase
                    .from('user_subscriptions')
                    .select('*')
                    .eq('id', subscriptionId)
                    .single();

                if (error) throw error;

                console.log("✅ Détails récupérés:", subscriptionDetails);

                // Send Email via API
                await fetch('/api/emails', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        type: 'subscription',
                        data: subscriptionDetails
                    })
                });

                setEmailStatus('success');
            } catch (error) {
                console.error("❌ Erreur lors de l'envoi des emails:", error);
                setEmailStatus('error');
            }
        };

        if (subscriptionId) {
            sendEmails();
        }
    }, [subscriptionId, planName, price]);

    return (
        <div className="min-h-[calc(100vh-200px)] flex items-center justify-center bg-gradient-to-br from-slate-50 to-red-50 py-12 px-4">
            <Card className="w-full max-w-lg shadow-2xl border-0">
                <CardHeader className="text-center bg-gradient-to-r from-green-500 to-green-600 text-white rounded-t-lg">
                    <PartyPopper className="w-16 h-16 mx-auto mb-4" />
                    <CardTitle className="text-2xl md:text-3xl">Abonnement activé !</CardTitle>
                </CardHeader>
                <CardContent className="text-center p-8 space-y-6">
                    <p className="text-lg text-slate-800">
                        Félicitations ! Votre abonnement <strong>{planInfo.name}</strong> a été activé avec succès.
                    </p>

                    {emailStatus === 'sending' && (
                        <div className="flex items-center justify-center gap-2 text-blue-600">
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span className="text-sm">Envoi des confirmations par email...</span>
                        </div>
                    )}

                    {emailStatus === 'success' && (
                        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                            <p className="text-green-800 text-sm">
                                ✅ Emails de confirmation envoyés avec succès !
                            </p>
                        </div>
                    )}

                    {emailStatus === 'error' && (
                        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                            <p className="text-red-800 text-sm">
                                ⚠️ Erreur lors de l'envoi des emails
                            </p>
                        </div>
                    )}

                    <div className="bg-blue-50 p-6 rounded-lg border-2 border-blue-200">
                        <h3 className="font-bold text-blue-900 mb-3 flex items-center justify-center gap-2">
                            <Calendar className="w-5 h-5" />
                            Prochaines étapes
                        </h3>
                        <ul className="text-left text-blue-800 space-y-2 text-sm">
                            <li>✅ Votre abonnement est maintenant actif</li>
                            <li>📅 Réservez votre premier lavage dès maintenant</li>
                            <li>💰 Vous paierez <strong>{planInfo.price.toLocaleString()} FCFA</strong> lors du premier rendez-vous</li>
                            <li>🎉 Profitez de tous les avantages de votre forfait !</li>
                        </ul>
                    </div>

                    <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                        <p className="text-orange-900 text-sm">
                            <strong>💡 Important :</strong> Le montant de votre abonnement sera collecté lors de votre premier lavage (espèces ou Mobile Money acceptés).
                        </p>
                    </div>

                    <div className="space-y-3 mt-6">
                        <Button
                            onClick={() => window.location.href = "/reservation"}
                            className="w-full bg-red-600 hover:bg-red-700 text-lg py-6"
                        >
                            <Calendar className="w-5 h-5 mr-2" />
                            Réserver mon premier lavage
                        </Button>

                        <Button
                            variant="outline"
                            onClick={() => window.location.href = "/mes-abonnements"}
                            className="w-full"
                        >
                            Voir mon abonnement
                        </Button>
                    </div>

                    <div className="pt-4 border-t text-sm text-slate-600">
                        <p className="flex items-center justify-center gap-2">
                            <Phone className="w-4 h-4" />
                            Besoin d'aide ? Contactez-nous au +225 01 70 87 62 18
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default function ConfirmationAbonnement() {
    return (
        <Suspense fallback={<div>Chargement...</div>}>
            <ConfirmationAbonnementContent />
        </Suspense>
    )
}
