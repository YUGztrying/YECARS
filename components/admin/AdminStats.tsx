import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
    Calendar,
    Euro,
    TrendingUp,
    Clock,
    CheckCircle,
    Users
} from "lucide-react";
import { Reservation, UserSubscription } from "@/types";

export default function AdminStats({ reservations, subscriptions }: { reservations: Reservation[], subscriptions: UserSubscription[] }) {
    const today = new Date().toISOString().split('T')[0];
    const thisMonth = new Date().getMonth();
    const thisYear = new Date().getFullYear();

    // Calculs des statistiques
    const todayReservations = reservations.filter(r => r.date_service === today);
    const thisMonthReservations = reservations.filter(r => {
        const date = new Date(r.date_service);
        return date.getMonth() === thisMonth && date.getFullYear() === thisYear;
    });

    const confirmedReservations = reservations.filter(r => r.statut === 'confirmee');
    const pendingReservations = reservations.filter(r => r.statut === 'en_attente' || r.statut === 'en_attente_paiement');

    // Subscription stats
    const thisMonthSubscriptions = subscriptions.filter(s => {
        if (!s.created_at) return false;
        const date = new Date(s.created_at);
        return date.getMonth() === thisMonth && date.getFullYear() === thisYear;
    });

    const activeSubscriptions = subscriptions.filter(s => s.status === 'actif');
    const pendingSubscriptions = subscriptions.filter(s => s.status === 'en_attente');

    // Revenue calculations (reservations + subscriptions)
    const totalReservationRevenue = reservations
        .filter(r => r.statut === 'confirmee' || r.statut === 'terminee')
        .reduce((sum, r) => sum + (r.prix || 0), 0);

    const totalSubscriptionRevenue = subscriptions
        .filter(s => s.is_initial_payment_collected)
        .reduce((sum, s) => sum + (s.price_paid || 0), 0);

    const totalRevenue = totalReservationRevenue + totalSubscriptionRevenue;

    const monthlyReservationRevenue = thisMonthReservations
        .filter(r => r.statut === 'confirmee' || r.statut === 'terminee')
        .reduce((sum, r) => sum + (r.prix || 0), 0);

    const monthlySubscriptionRevenue = thisMonthSubscriptions
        .filter(s => s.is_initial_payment_collected)
        .reduce((sum, s) => sum + (s.price_paid || 0), 0);

    const monthlyRevenue = monthlyReservationRevenue + monthlySubscriptionRevenue;

    const stats = [
        {
            title: "Réservations aujourd'hui",
            value: todayReservations.length,
            icon: Calendar,
            color: "from-blue-500 to-blue-600",
            bgColor: "bg-blue-50",
            textColor: "text-blue-600"
        },
        {
            title: "En attente",
            value: pendingReservations.length,
            icon: Clock,
            color: "from-orange-500 to-orange-600",
            bgColor: "bg-orange-50",
            textColor: "text-orange-600"
        },
        {
            title: "Confirmées",
            value: confirmedReservations.length,
            icon: CheckCircle,
            color: "from-green-500 to-green-600",
            bgColor: "bg-green-50",
            textColor: "text-green-600"
        },
        {
            title: "Revenus ce mois",
            value: `${monthlyRevenue.toLocaleString()} FCFA`,
            icon: Euro,
            color: "from-purple-500 to-purple-600",
            bgColor: "bg-purple-50",
            textColor: "text-purple-600"
        },
        {
            title: "Total des revenus",
            value: `${totalRevenue.toLocaleString()} FCFA`,
            icon: TrendingUp,
            color: "from-emerald-500 to-emerald-600",
            bgColor: "bg-emerald-50",
            textColor: "text-emerald-600"
        },
        {
            title: "Total clients",
            value: new Set([
                ...reservations.map(r => r.email),
                ...subscriptions.map(s => s.user_email)
            ]).size,
            icon: Users,
            color: "from-indigo-500 to-indigo-600",
            bgColor: "bg-indigo-50",
            textColor: "text-indigo-600"
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {stats.map((stat, index) => (
                <Card key={index} className="shadow-lg border-0 overflow-hidden">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-600 mb-1">
                                    {stat.title}
                                </p>
                                <p className="text-2xl font-bold text-slate-900">
                                    {stat.value}
                                </p>
                            </div>
                            <div className={`w-14 h-14 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                                <stat.icon className={`w-7 h-7 ${stat.textColor}`} />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
