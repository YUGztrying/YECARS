"use client";

import React, { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

function ConfirmationInner() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const reservationId = searchParams.get("reservation_id");

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <Card className="max-w-md w-full shadow-xl">
                <CardContent className="p-8 text-center space-y-6">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle className="w-10 h-10 text-green-600" />
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-2xl font-bold text-slate-900">Réservation en attente !</h1>
                        <p className="text-slate-600">
                            Votre demande a bien été reçue. Elle est en attente de validation par notre équipe.
                        </p>
                    </div>

                    {reservationId && (
                        <div className="bg-slate-100 p-4 rounded-lg">
                            <p className="text-sm text-slate-500 mb-1">Numéro de réservation</p>
                            <p className="font-mono text-lg font-bold text-slate-900">{reservationId}</p>
                        </div>
                    )}

                    <div className="text-sm text-slate-600">
                        Vous recevrez un email de confirmation dès que votre réservation sera validée.
                        Notre équipe vous contactera ensuite 30 minutes avant l'heure prévue.
                    </div>

                    <Button
                        onClick={() => router.push("/")}
                        className="w-full bg-slate-900 hover:bg-slate-800"
                    >
                        <Home className="w-4 h-4 mr-2" />
                        Retour à l'accueil
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}

export default function ConfirmationClient() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Chargement...</div>}>
            <ConfirmationInner />
        </Suspense>
    );
}
