"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Droplets, Sparkles, Shield, Star, Car, Gem, Check } from "lucide-react";
import { Reservation } from "@/types";

const services = [
    {
        id: 'lavage_unique',
        name: 'Lavage Unique',
        description: [
            'Extérieur et intérieur complet (hors sièges)',
            'Parfum offert',
            'Cirage intérieur et pneus',
        ],
        icon: Sparkles,
        price: 10000,
        color: 'from-blue-500 to-blue-600'
    },
    {
        id: 'detailing_car',
        name: 'Detailing Car (Lavage Complet)',
        description: [
            'Intérieur, Extérieur, Sièges, Ciel, Coffre',
            'Roue de secours + Cirage pneus',
            'Vapeur zones restreintes',
            '🎁 Diffuseur + Poubelle + Brosse OFFERTS'
        ],
        prices: { citadine: 35000, berline: 40000, suv: 50000 },
        icon: Gem,
        color: 'from-slate-800 to-black'
    }
];

const supplementaryOptions = [
    {
        id: 'nettoyage_sieges_tissus',
        name: 'Nettoyage des Sièges en Tissus',
        description: 'Nettoyage en profondeur',
        price: 25000,
    },
    {
        id: 'nettoyage_sieges_cuir',
        name: 'Nettoyage des Sièges en Cuir / Alcantara',
        description: 'Soin spécifique cuir et alcantara',
        price: 15000,
    },
    {
        id: 'cirage_exterieur_complet',
        name: 'Cirage Extérieur Complet',
        description: 'Protection et brillance carrosserie',
        price: 30000,
    },
    {
        id: 'sol_bas_caisse_moteur',
        name: 'Sol + Bas de Caisse + Moteur',
        description: 'Nettoyage technique zones basses et moteur',
        price: 30000,
    },
    {
        id: 'lavage_express_sans_eau',
        name: 'Lavage Express sans eau',
        description: 'Rapide et écologique',
        price: 5000,
    }
];

const vehicleTypes = [
    { id: 'citadine', name: 'Citadine : 35.000 (Detailing)', icon: Car },
    { id: 'berline', name: 'Berline : 40.000 (Detailing)', icon: Car },
    { id: 'suv', name: 'SUV / 4x4 : 50.000 (Detailing)', icon: Car },
];

export default function ServiceSelection({ data, onChange }: { data: Partial<Reservation>, onChange: (data: Partial<Reservation>) => void }) {
    const calculateTotalPrice = (selectedServices: string[], vehicleType: string, selectedOptions: string[] = []) => {
        if (!vehicleType || selectedServices.length === 0) return 0;

        let total = selectedServices.reduce((sum, serviceId) => {
            const service = services.find(s => s.id === serviceId);
            if (!service) return sum;
            // @ts-ignore
            const price = service.price ? service.price : (service.prices ? service.prices[vehicleType] || 0 : 0);
            return sum + price;
        }, 0);

        // Ajouter le prix des options supplémentaires
        total += selectedOptions.reduce((sum, optionId) => {
            const option = supplementaryOptions.find(o => o.id === optionId);
            if (!option) return sum;
            // @ts-ignore
            const price = option.price ? option.price : (option.prices ? option.prices[vehicleType] || 0 : 0);
            return sum + price;
        }, 0);

        return total;
    };

    const handleServiceChange = (serviceId: string) => {
        const currentServices = data.service_type || [];
        // Allow single selection for main services for simplicity, or keep multi-select logic?
        // User code has multi-select logic:
        const newServices = currentServices.includes(serviceId)
            ? currentServices.filter(s => s !== serviceId)
            : [...currentServices, serviceId];

        const newPrice = calculateTotalPrice(newServices, data.type_vehicule!, data.supplementary_options || []);
        onChange({
            service_type: newServices,
            prix: newPrice
        });
    };

    const handleVehicleChange = (vehicleType: string) => {
        const newPrice = calculateTotalPrice(data.service_type || [], vehicleType, data.supplementary_options || []);
        onChange({
            type_vehicule: vehicleType,
            prix: newPrice
        });
    };

    const handleOptionChange = (optionId: string) => {
        const currentOptions = data.supplementary_options || [];
        const newOptions = currentOptions.includes(optionId)
            ? currentOptions.filter(o => o !== optionId)
            : [...currentOptions, optionId];

        const newPrice = calculateTotalPrice(data.service_type || [], data.type_vehicule!, newOptions);
        onChange({
            supplementary_options: newOptions,
            prix: newPrice
        });
    };

    const hasServiceSelected = (data.service_type || []).length > 0;

    return (
        <div className="space-y-6 md:space-y-8">
            <div>
                <Label className="text-base md:text-lg font-semibold mb-4 block">1. Type de véhicule *</Label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {vehicleTypes.map((vehicle) => (
                        <Card
                            key={vehicle.id}
                            className={`cursor-pointer transition-all duration-200 hover:shadow-md ${data.type_vehicule === vehicle.id
                                ? 'ring-2 ring-blue-500 bg-blue-50'
                                : 'hover:ring-1 hover:ring-gray-300'
                                }`}
                            onClick={() => handleVehicleChange(vehicle.id)}
                        >
                            <CardContent className="p-3 md:p-4 text-center">
                                <vehicle.icon className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-2 text-slate-600" />
                                <p className="text-xs md:text-sm font-medium text-slate-900">{vehicle.name}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            <div>
                <Label className="text-base md:text-lg font-semibold mb-4 block">2. Choisissez votre service *</Label>
                <div className="grid gap-3 md:gap-4">
                    {services.map((service) => (
                        <Card
                            key={service.id}
                            className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${(data.service_type || []).includes(service.id)
                                ? 'ring-2 ring-blue-500 bg-blue-50'
                                : 'hover:ring-1 hover:ring-gray-300'
                                }`}
                            onClick={() => handleServiceChange(service.id)}
                        >
                            <CardContent className="p-4 md:p-6">
                                <div className="flex flex-col md:flex-row items-start gap-4">
                                    <div className={`w-12 h-12 md:w-16 md:h-16 rounded-xl bg-gradient-to-r ${service.color} flex items-center justify-center flex-shrink-0`}>
                                        <service.icon className="w-6 h-6 md:w-8 md:h-8 text-white" />
                                    </div>
                                    <div className="flex-1 w-full">
                                        <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-2">
                                            <h3 className="text-lg md:text-xl font-semibold text-slate-900 mb-2 md:mb-0">
                                                {service.name}
                                            </h3>
                                            {(data.service_type || []).includes(service.id) && (
                                                <div className="w-5 h-5 md:w-6 md:h-6 bg-blue-500 rounded-full flex items-center justify-center text-white md:ml-4">
                                                    <Check className="w-3 h-3 md:w-4 md:h-4" />
                                                </div>
                                            )}
                                        </div>
                                        <ul className="text-slate-600 text-xs md:text-sm mb-3 space-y-1">
                                            {service.description.map((item, index) => (
                                                <li key={index} className="flex items-start gap-2">
                                                    <Check className="w-3 h-3 md:w-4 md:h-4 text-green-500 flex-shrink-0 mt-0.5" />
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                        <div className="text-xl md:text-2xl font-bold text-red-600">
                                            {service.price ? (
                                                `${service.price.toLocaleString()} FCFA`
                                            ) : (
                                                `À partir de ${service.prices ? Math.min(...Object.values(service.prices)).toLocaleString() : 0} FCFA`
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {hasServiceSelected && (
                <div>
                    <Label className="text-base md:text-lg font-semibold mb-4 block text-red-600">
                        3. Options Supplémentaires (facultatif)
                    </Label>
                    <div className="grid gap-3 md:gap-4">
                        {supplementaryOptions.map((option) => {
                            const isSelected = (data.supplementary_options || []).includes(option.id);
                            // @ts-ignore
                            const optionPrice = option.price ? option.price : (option.prices && data.type_vehicule ? option.prices[data.type_vehicule] : 0);

                            return (
                                <Card
                                    key={option.id}
                                    className={`cursor-pointer transition-all duration-200 hover:shadow-md ${isSelected
                                        ? 'ring-2 ring-red-500 bg-red-50'
                                        : 'hover:ring-1 hover:ring-gray-300'
                                        }`}
                                    onClick={() => handleOptionChange(option.id)}
                                >
                                    <CardContent className="p-4 md:p-5">
                                        <div className="flex items-start gap-3">
                                            <Checkbox
                                                checked={isSelected}
                                                className="mt-1"
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start mb-1">
                                                    <h4 className="font-semibold text-slate-900 text-sm md:text-base">
                                                        {option.name}
                                                    </h4>
                                                    <span className="text-lg font-bold text-red-600 ml-4">
                                                        {optionPrice ? `${optionPrice.toLocaleString()} FCFA` : 'Prix variable'}
                                                    </span>
                                                </div>
                                                <p className="text-xs md:text-sm text-slate-600">
                                                    {option.description}
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
