"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Car, CreditCard } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Reservation } from "@/types";

const serviceLabels: Record<string, string> = {
    essentiel: "Essentiel",
    confort: "Confort",
    premium: "Premium",
    prestige: "Prestige",
    nettoyage_integral_sieges: "Nettoyage Sièges"
};

const vehicleLabels: Record<string, string> = {
    citadine: "Citadine",
    berline: "Berline",
    suv: "SUV / 4x4",
};

export default function OrderSummary({ data }: { data: Partial<Reservation> }) {
    return (
        <div className="sticky top-4 md:top-8">
            <Card className="shadow-xl border-0">
                <CardHeader className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-t-lg p-3 sm:p-4 md:p-6">
                    <CardTitle className="flex items-center gap-2 text-sm sm:text-base md:text-lg">
                        <CreditCard className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                        Récapitulatif
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4 md:space-y-6">
                    {data.service_type && data.service_type.length > 0 && (
                        <div className="space-y-2 sm:space-y-3">
                            <div>
                                <p className="text-xs sm:text-sm font-medium text-slate-600 mb-1 sm:mb-2">Services sélectionnés</p>
                                <div className="flex flex-wrap gap-1 sm:gap-2">
                                    {(data.service_type || []).map(serviceId => (
                                        <Badge key={serviceId} variant="secondary" className="text-xs py-0.5 sm:py-1">
                                            {serviceLabels[serviceId] || serviceId}
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            {data.type_vehicule && (
                                <div>
                                    <p className="text-xs sm:text-sm font-medium text-slate-600 mb-1 sm:mb-2">Type de véhicule</p>
                                    <Badge variant="outline" className="text-xs py-0.5 sm:py-1">
                                        <Car className="w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 mr-1 sm:mr-2" />
                                        {vehicleLabels[data.type_vehicule]}
                                    </Badge>
                                </div>
                            )}
                        </div>
                    )}

                    {data.date_service && data.heure_service && (
                        <div>
                            <p className="text-xs sm:text-sm font-medium text-slate-600 mb-1 sm:mb-2">Date et Heure</p>
                            <div className="flex flex-col gap-1 text-slate-900 text-xs sm:text-sm">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 text-slate-500 flex-shrink-0" />
                                    <span className="break-words">
                                        {format(new Date(data.date_service), "EEEE d MMMM yyyy", { locale: fr })}
                                    </span>
                                </div>
                                <span className="ml-4 sm:ml-5 text-slate-600">à {data.heure_service}</span>
                            </div>
                        </div>
                    )}

                    {data.adresse && data.ville && (
                        <div>
                            <p className="text-xs sm:text-sm font-medium text-slate-600 mb-1 sm:mb-2">Lieu du service</p>
                            <div className="flex items-start gap-2 text-slate-900 text-xs sm:text-sm">
                                <MapPin className="w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 text-slate-500 mt-0.5 flex-shrink-0" />
                                <span className="break-words">
                                    {data.adresse}, {data.ville}
                                </span>
                            </div>
                        </div>
                    )}

                    <div className="border-t border-slate-200 pt-3 sm:pt-4 mt-3 sm:mt-4">
                        <div className="flex justify-between items-center">
                            <span className="text-sm sm:text-base md:text-xl font-bold text-slate-800">Total</span>
                            <span className="text-sm sm:text-base md:text-xl font-bold text-red-600">
                                {data.prix ? data.prix.toLocaleString() : 0} FCFA
                            </span>
                        </div>
                    </div>

                </CardContent>
            </Card>
        </div>
    );
}
