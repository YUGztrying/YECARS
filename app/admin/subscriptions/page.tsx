"use client";

import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { UserSubscription } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Check, Ban, Calendar, User as UserIcon, CreditCard, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import AdminLayout from "@/components/admin/AdminLayout";


const statusConfig: any = {
    en_attente: { label: "En attente", color: "bg-yellow-100 text-yellow-800 border-yellow-300" },
    actif: { label: "Actif", color: "bg-green-100 text-green-800 border-green-300" },
    expire: { label: "Expiré", color: "bg-slate-100 text-slate-800 border-slate-300" },
    annule: { label: "Annulé", color: "bg-red-100 text-red-800 border-red-300" },
};

export default function AdminSubscriptions() {
    const [subscriptions, setSubscriptions] = useState<UserSubscription[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadSubscriptions = useCallback(async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('user_subscriptions')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setSubscriptions(data || []);
        } catch (error) {
            console.error("Erreur chargement abonnements:", error);
        }
        setIsLoading(false);
    }, []);

    useEffect(() => {
        loadSubscriptions();
    }, [loadSubscriptions]);

    const handleMarkAsPaid = useCallback(async (subId: string) => {
        try {
            const { error } = await supabase.from('user_subscriptions').update({
                is_initial_payment_collected: true,
                status: 'actif'
            }).eq('id', subId);

            if (error) throw error;
            await loadSubscriptions();
        } catch (e) {
            console.error("Error updating subscription", e);
        }
    }, [loadSubscriptions]);

    const handleCancel = useCallback(async (subId: string) => {
        try {
            const { error } = await supabase.from('user_subscriptions').update({ status: 'annule' }).eq('id', subId);
            if (error) throw error;
            await loadSubscriptions();
        } catch (e) {
            console.error("Error cancelling subscription", e);
        }
    }, [loadSubscriptions]);

    if (isLoading) {
        return <div className="text-center p-12"><Loader2 className="w-8 h-8 animate-spin mx-auto" /></div>;
    }

    return (
        <AdminLayout>
            <Card>
                <CardHeader>
                    <CardTitle>Gestion des Abonnements ({subscriptions.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Client</TableHead>
                                    <TableHead>Forfait</TableHead>
                                    <TableHead>Statut</TableHead>
                                    <TableHead>Paiement</TableHead>
                                    <TableHead>Période</TableHead>
                                    <TableHead className="min-w-[150px]">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {subscriptions.map(sub => (
                                    <TableRow key={sub.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <UserIcon className="w-4 h-4 text-slate-400" />
                                                <span className="text-sm">{sub.user_email}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-medium">{sub.plan_name}</div>
                                            <div className="text-xs text-green-600 font-semibold">
                                                {sub.price_paid?.toLocaleString()} FCFA
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={statusConfig[sub.status]?.color || "bg-gray-100"}>
                                                {statusConfig[sub.status]?.label || sub.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {sub.is_initial_payment_collected ? (
                                                <Badge className="bg-green-100 text-green-800 border-green-300">
                                                    <CheckCircle2 className="w-3 h-3 mr-1" /> Payé
                                                </Badge>
                                            ) : (
                                                <Badge className="bg-orange-100 text-orange-800 border-orange-300">
                                                    <CreditCard className="w-3 h-3 mr-1" /> À collecter
                                                </Badge>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {sub.start_date && sub.end_date ? (
                                                <div className="flex items-center gap-2 text-sm">
                                                    <Calendar className="w-4 h-4" />
                                                    <span>{format(new Date(sub.start_date), 'dd/MM/yy')} - {format(new Date(sub.end_date), 'dd/MM/yy')}</span>
                                                </div>
                                            ) : 'N/A'}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-2 min-w-[120px]">
                                                {(sub.status === 'actif' || sub.status === 'en_attente') && !sub.is_initial_payment_collected && (
                                                    <Button
                                                        size="sm"
                                                        className="bg-green-600 hover:bg-green-700 text-white"
                                                        onClick={() => handleMarkAsPaid(sub.id!)}
                                                    >
                                                        <Check className="w-4 h-4 mr-1" /> Marquer payé
                                                    </Button>
                                                )}
                                                {(sub.status === 'actif' || sub.status === 'en_attente') && (
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        onClick={() => handleCancel(sub.id!)}
                                                    >
                                                        <Ban className="w-4 h-4 mr-1" /> Annuler
                                                    </Button>
                                                )}
                                                {(sub.status === 'expire' || sub.status === 'annule') && (
                                                    <span className="text-sm text-slate-400">Aucune action</span>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </AdminLayout>
    )
}
