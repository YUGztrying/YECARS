import Link from "next/link";
import { Phone, Mail } from "lucide-react";
import { createPageUrl } from "@/lib/utils";

export default function Footer() {
    return (
        <footer className="bg-slate-800 text-white mt-16">
            <div className="bg-slate-950 mx-auto px-4 py-12 max-w-7xl sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="text-lg font-semibold mb-4">YECARS</h3>
                        <p className="text-sm text-slate-400">
                            Votre service de lavage auto premium à domicile. Qualité, ponctualité et satisfaction garanties.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Navigation</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link href={createPageUrl("Accueil")} className="text-slate-300 hover:text-white">Accueil</Link></li>
                            <li><Link href={createPageUrl("Reservation")} className="text-slate-300 hover:text-white">Réserver</Link></li>
                            <li><Link href={createPageUrl("Abonnements")} className="text-slate-300 hover:text-white">Abonnements</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Légal</h3>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="text-slate-300 hover:text-white">Conditions d'utilisation</a></li>
                            <li><a href="#" className="text-slate-300 hover:text-white">Politique de confidentialité</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Contact</h3>
                        <ul className="space-y-2 text-sm">
                            <li className="flex items-center gap-2 text-slate-300">
                                <Phone className="w-4 h-4" /> <span>+225 01 70 87 62 18</span>
                            </li>
                            <li className="flex items-center gap-2 text-slate-300">
                                <Mail className="w-4 h-4" /> <span className="">yecars225@gmail.com</span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="mt-8 border-t border-slate-700 pt-8 text-center text-sm text-slate-400">
                    <p>&copy; {new Date().getFullYear()} YECARS. Tous droits réservés.</p>
                </div>
            </div>
        </footer>
    );
}
