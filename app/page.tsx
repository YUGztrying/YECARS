import Link from "next/link";
import { createPageUrl } from "@/lib/utils";
import {
  Car,
  Clock,
  Shield,
  Star,
  CheckCircle,
  ArrowRight,
  Droplets,
  Sparkles,
  Gem,
  Check // Added Check icon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  // Define service details


  // Helper component for list items with a checkmark
  const ListItem = ({ children }: { children: React.ReactNode }) => (
    <li className="flex items-start gap-3">
      <Check className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
      <span>{children}</span>
    </li>
  );

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white py-12 md:py-20 overflow-hidden mx-4 rounded-3xl mt-4">
        <div className="absolute inset-0 bg-[url('https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/da6d6216a_IMG_3365.jpg')] bg-cover bg-center opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
                Votre voiture
                <span className="block text-red-200">propre à domicile</span>
              </h1>
              <p className="text-xl md:text-2xl text-red-100 mb-8 leading-relaxed">
                Service professionnel de lavage automobile à Abidjan.
                Nous nous déplaçons chez vous avec tout le matériel nécessaire.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href={createPageUrl("Reservation")}>
                  <Button size="lg" className="bg-white text-red-600 hover:bg-red-50 font-semibold px-8 py-4 text-lg shadow-xl h-auto">
                    Réserver maintenant
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative">
              <img
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/da6d6216a_IMG_3365.jpg"
                alt="Intérieur de voiture premium - YECARS"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:-bottom-6 sm:-left-6 bg-white text-slate-900 p-4 sm:p-6 rounded-xl shadow-xl border border-slate-100">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                  <div>
                    <p className="font-bold">Service à domicile</p>
                    <p className="text-sm text-slate-600">Partout à Abidjan</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Nos Services & Tarifs
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Des solutions professionnelles adaptées à vos besoins
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 items-start">
            {/* Lavage Unique */}
            <Card className="border-2 border-blue-100 hover:border-blue-300 transition-all duration-300 hover:shadow-xl h-full flex flex-col">
              <CardContent className="p-8 text-center flex-grow">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Lavage Unique</h3>
                <p className="text-sm text-slate-500 mb-4">Pour une propreté immédiate</p>
                <ul className="text-left space-y-3 text-slate-600 mb-6">
                  <ListItem>Extérieur et intérieur complet</ListItem>
                  <ListItem>Parfum offert</ListItem>
                  <ListItem>Cirage intérieur et pneus</ListItem>
                  <ListItem>Hors nettoyage sièges</ListItem>
                </ul>
              </CardContent>
              <div className="p-8 pt-0 text-center">
                <div className="text-3xl font-bold text-blue-600 mb-6">10.000 FCFA</div>
                <Button asChild size="lg" className="w-full bg-blue-600 hover:bg-blue-700">
                  <Link href={createPageUrl("Reservation")}>Choisir</Link>
                </Button>
              </div>
            </Card>

            {/* Detailing Car */}
            <Card className="border-2 border-slate-800 bg-slate-50 hover:shadow-2xl transition-all duration-300 h-full flex flex-col lg:scale-105 z-10">
              <CardContent className="p-8 text-center flex-grow">
                <div className="absolute top-0 right-0 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">
                  Recommandé
                </div>
                <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Gem className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Detailing Car</h3>
                <p className="text-sm text-slate-500 mb-4">Lavage Complet & Rénovation</p>
                <ul className="text-left space-y-3 text-slate-600 mb-6 text-sm">
                  <ListItem><strong>Tout inclus</strong> (Intérieur + Extérieur)</ListItem>
                  <ListItem>Nettoyage intégral des sièges</ListItem>
                  <ListItem>Ciel de toit + Coffre</ListItem>
                  <ListItem>Roue de secours + Moteur</ListItem>
                  <ListItem>Vapeur zones restreintes</ListItem>
                  <ListItem>🎁 Diffuseur + Poubelle + Brosse</ListItem>
                </ul>
              </CardContent>
              <div className="p-8 pt-0 text-center">
                <div className="text-2xl font-bold text-slate-900 mb-2">À partir de</div>
                <div className="text-3xl font-bold text-red-600 mb-6">35.000 FCFA</div>
                <Button asChild size="lg" className="w-full bg-slate-900 hover:bg-slate-800">
                  <Link href={createPageUrl("Reservation")}>Choisir</Link>
                </Button>
              </div>
            </Card>

            {/* Abonnements */}
            <Card className="border-2 border-red-100 hover:border-red-300 transition-all duration-300 hover:shadow-xl h-full flex flex-col">
              <CardContent className="p-8 text-center flex-grow">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Star className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Abonnements</h3>
                <p className="text-sm text-slate-500 mb-4">Pour une tranquillité d'esprit</p>
                <ul className="text-left space-y-3 text-slate-600 mb-6">
                  <ListItem>De 4 à 10 lavages / mois</ListItem>
                  <ListItem>Tarifs préférentiels</ListItem>
                  <ListItem>Carte abonné digitale</ListItem>
                  <ListItem>Retouches offertes (selon plan)</ListItem>
                </ul>
              </CardContent>
              <div className="p-8 pt-0 text-center">
                <div className="text-2xl font-bold text-red-600 mb-6">Dès 15.000 FCFA</div>
                <Button asChild size="lg" variant="outline" className="w-full border-red-600 text-red-600 hover:bg-red-50">
                  <Link href={createPageUrl("Abonnements")}>Voir les forfaits</Link>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Pourquoi choisir YECARS ?
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Rapide et pratique</h3>
              <p className="text-slate-600">
                Réservation en ligne en 2 minutes. Nous intervenons dans toute la ville d'Abidjan selon vos disponibilités.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Qualité professionnelle</h3>
              <p className="text-slate-600">
                Équipe formée et matériel professionnel. Satisfaction garantie ou service refait gratuitement.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Car className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Respect de votre véhicule</h3>
              <p className="text-slate-600">
                Produits adaptés au climat tropical. Techniques douces qui préservent la peinture sous le soleil d'Abidjan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-red-600 to-red-700 text-white mx-4 rounded-3xl mb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Prêt à faire briller votre véhicule ?
          </h2>
          <p className="text-xl text-red-100 mb-8">
            Réservez dès maintenant votre créneau et profitez d'un service de qualité professionnelle à Abidjan
          </p>
          <Link href={createPageUrl("Reservation")}>
            <Button size="lg" className="bg-white text-red-600 hover:bg-red-50 font-semibold px-12 py-4 text-lg shadow-xl h-auto">
              Réserver mon lavage
              <ArrowRight className="ml-3 w-6 h-6" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
