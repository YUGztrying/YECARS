
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Calendar, MapPin, Car, Phone, Mail, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Reservation } from "@/types";

const statusColors: any = {
    en_attente: "bg-yellow-100 text-yellow-800 border-yellow-300",
    en_attente_paiement: "bg-orange-100 text-orange-800 border-orange-300",
    confirmee: "bg-blue-100 text-blue-800 border-blue-300",
    en_cours: "bg-purple-100 text-purple-800 border-purple-300",
    terminee: "bg-green-100 text-green-800 border-green-300",
    annulee: "bg-red-100 text-red-800 border-red-300"
};

const statusLabels: any = {
    en_attente: "En attente",
    en_attente_paiement: "Attente paiement",
    confirmee: "Confirmée",
    en_cours: "En cours",
    terminee: "Terminée",
    annulee: "Annulée"
};

const serviceLabels: any = {
    lavage_unique: "Lavage Unique",
    detailing_car: "Detailing Car",
    nettoyage_sieges_tissus: "Sièges Tissus",
    nettoyage_sieges_cuir: "Sièges Cuir",
    cirage_exterieur_complet: "Cirage Extérieur",
    sol_bas_caisse_moteur: "Sol + Moteur",
    lavage_express_sans_eau: "Lavage sans eau"
};

const vehicleLabels: any = {
    citadine: "Citadine",
    berline: "Berline",
    suv: "SUV / 4x4"
};

interface ReservationTableProps {
    reservations: Reservation[];
    onStatusUpdate: (id: string, status: string, serviceTypeFixed?: string[]) => void;
    onDelete: (id: string) => void;
}

export default function ReservationTable({ reservations, onStatusUpdate, onDelete }: ReservationTableProps) {
    const formatDate = (dateString: string) => {
        try {
            return format(new Date(dateString), 'dd/MM/yyyy', { locale: fr });
        } catch {
            return dateString;
        }
    };

    const formatDateTime = (dateString: string) => {
        try {
            if (!dateString) return "-";
            return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: fr });
        } catch {
            return dateString;
        }
    };

    if (reservations.length === 0) {
        return (
            <div className="text-center py-12">
                <Car className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600">Aucune réservation trouvée avec ces filtres.</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Client</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Service</TableHead>
                        <TableHead>Date & Heure</TableHead>
                        <TableHead>Adresse</TableHead>
                        <TableHead>Prix</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Créée le</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {reservations.map((reservation) => (
                        <TableRow key={reservation.id} className="hover:bg-slate-50">
                            {/* Client */}
                            <TableCell>
                                <div className="font-medium text-slate-900">
                                    {reservation.prenom} {reservation.nom}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-600 mt-1">
                                    <Car className="w-3 h-3" />
                                    {vehicleLabels[reservation.type_vehicule] || reservation.type_vehicule}
                                </div>
                            </TableCell>

                            {/* Contact */}
                            <TableCell>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-sm">
                                        <Phone className="w-3 h-3 text-slate-400" />
                                        <span>{reservation.telephone}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Mail className="w-3 h-3 text-slate-400" />
                                        <span className="truncate max-w-32">{reservation.email}</span>
                                    </div>
                                </div>
                            </TableCell>

                            {/* Service */}
                            <TableCell>
                                <div className="flex flex-col gap-1">
                                    {[].concat(reservation.service_type as any).filter(Boolean).map((serviceId: string) => (
                                        <Badge key={serviceId} variant="outline" className="text-sm">
                                            {serviceLabels[serviceId] || serviceId}
                                        </Badge>
                                    ))}
                                </div>
                            </TableCell>

                            {/* Date & Heure */}
                            <TableCell>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-sm font-medium">
                                        <Calendar className="w-3 h-3 text-blue-500" />
                                        {formatDate(reservation.date_service)}
                                    </div>
                                    <div className="text-sm text-slate-600">
                                        {reservation.heure_service}
                                    </div>
                                </div>
                            </TableCell>

                            {/* Adresse */}
                            <TableCell>
                                <div className="flex items-start gap-2 max-w-48">
                                    <MapPin className="w-3 h-3 text-slate-400 mt-0.5 flex-shrink-0" />
                                    <div className="text-sm">
                                        <div className="font-medium">{reservation.adresse}</div>
                                        <div className="text-slate-600">
                                            {reservation.ville}
                                        </div>
                                    </div>
                                </div>
                            </TableCell>

                            {/* Prix */}
                            <TableCell>
                                <div className="flex items-center gap-2 font-semibold text-green-600">
                                    {reservation.prix?.toLocaleString()} FCFA
                                </div>
                            </TableCell>

                            {/* Statut */}
                            <TableCell>
                                <div className="space-y-2">
                                    <Badge className={statusColors[reservation.statut] || "bg-gray-100 text-gray-800"}>
                                        {statusLabels[reservation.statut]}
                                    </Badge>

                                    <Select
                                        value={reservation.statut}
                                        onValueChange={async (newStatus) => {
                                            // Récupérer la réservation complète pour s'assurer que service_type est un array
                                            const currentReservation = reservations.find(r => r.id === reservation.id);
                                            if (!currentReservation) return;

                                            const serviceTypeFixed = Array.isArray(currentReservation.service_type)
                                                ? currentReservation.service_type
                                                : [currentReservation.service_type].filter(Boolean);

                                            // Mettre à jour avec service_type corrigé
                                            // Mettre à jour avec service_type corrigé
                                            await onStatusUpdate(reservation.id!, newStatus, serviceTypeFixed);

                                            // Trigger Email if status changed to 'confirmee' or 'annulee'
                                            if (newStatus === 'confirmee' || newStatus === 'annulee') {
                                                const target = newStatus === 'confirmee' ? 'client_confirmation' : 'client_refusal';
                                                try {
                                                    await fetch('/api/emails', {
                                                        method: 'POST',
                                                        headers: { 'Content-Type': 'application/json' },
                                                        body: JSON.stringify({
                                                            type: 'reservation',
                                                            data: currentReservation,
                                                            target: target
                                                        })
                                                    });
                                                } catch (e) {
                                                    console.error("Failed to send status email", e);
                                                }
                                            }
                                        }}
                                    >
                                        <SelectTrigger className="w-32 h-8">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="en_attente">En attente</SelectItem>
                                            <SelectItem value="en_attente_paiement">Attente paiement</SelectItem>
                                            <SelectItem value="confirmee">Confirmée</SelectItem>
                                            <SelectItem value="en_cours">En cours</SelectItem>
                                            <SelectItem value="terminee">Terminée</SelectItem>
                                            <SelectItem value="annulee">Annulée</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </TableCell>

                            {/* Date de création */}
                            <TableCell>
                                <div className="text-sm text-slate-600">
                                    {formatDateTime(reservation.created_at || '')}
                                </div>
                            </TableCell>

                            {/* Actions */}
                            <TableCell>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => {
                                        if (window.confirm("Êtes-vous sûr de vouloir supprimer cette réservation ?")) {
                                            onDelete(reservation.id!);
                                        }
                                    }}
                                    className="flex items-center gap-2"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Supprimer
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
