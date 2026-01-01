import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Lock, Banknote, MapPin } from "lucide-react";
import { Reservation } from "@/types";

export default function PaymentSection({ data }: { data: Partial<Reservation> }) {

    return (
        <div className="space-y-6">
            <Card className="bg-green-50 border-green-200">
                <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-green-900">
                                Vous y êtes presque !
                            </h3>
                            <p className="text-green-700">
                                Confirmez votre réservation. Le paiement se fera directement sur place lors du service.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-2 border-blue-200">
                <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Banknote className="w-5 h-5" />
                        Paiement sur place
                    </h3>
                    <div className="bg-blue-50 p-4 rounded-lg mb-4">
                        <div className="flex items-start gap-3">
                            <MapPin className="w-5 h-5 text-blue-600 mt-0.5" />
                            <div>
                                <p className="font-medium text-blue-900 mb-2">Mode de paiement pratique</p>
                                <ul className="text-blue-800 text-sm space-y-1">
                                    <li>• Vous payez directement à notre équipe après le service</li>
                                    <li>• Espèces ou Mobile Money acceptés</li>
                                    <li>• Aucun frais supplémentaire</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                            <div className="font-semibold text-green-800 text-sm">Espèces</div>
                        </div>
                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-center">
                            <div className="font-semibold text-orange-800 text-sm">Orange Money</div>
                        </div>
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center">
                            <div className="font-semibold text-yellow-800 text-sm">MTN Mobile Money</div>
                        </div>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
                            <div className="font-semibold text-blue-800 text-sm">Moov Money</div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-slate-50 border-slate-200">
                <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                        <Lock className="w-5 h-5 text-slate-600" />
                        <div>
                            <p className="text-sm font-medium text-slate-900">Réservation 100% gratuite</p>
                            <p className="text-xs text-slate-600">
                                Aucune carte bancaire requise. Vous ne payez qu'après avoir reçu le service.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="text-sm text-slate-600">
                <p>
                    En confirmant votre réservation, vous acceptez nos{" "}
                    <a href="#" className="text-red-600 hover:underline">conditions générales</a>.
                </p>
            </div>
        </div>
    );
}
