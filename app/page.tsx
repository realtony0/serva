import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-8 md:p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between text-center">
        <div className="mb-8">
          <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            Bienvenue sur SERVA
          </h1>
          <p className="text-xl sm:text-2xl text-gray-700 mb-2">
            Plateforme de commande en ligne pour restaurants
          </p>
          <p className="text-base sm:text-lg text-gray-600">
            Gérez vos commandes en temps réel avec des QR codes
          </p>
        </div>
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
          <Link href="/login">
            <Button variant="primary" size="lg" className="w-full sm:w-auto">
              Connexion Admin
            </Button>
          </Link>
          <Link href="/restaurant/login">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              Connexion Restaurant
            </Button>
          </Link>
        </div>
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-3">📱</div>
            <h3 className="font-semibold text-gray-900 mb-2">QR Codes</h3>
            <p className="text-sm text-gray-600">Générez des QR codes uniques pour chaque table</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-3">⚡</div>
            <h3 className="font-semibold text-gray-900 mb-2">Temps réel</h3>
            <p className="text-sm text-gray-600">Commandes synchronisées en temps réel</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-3">📊</div>
            <h3 className="font-semibold text-gray-900 mb-2">Statistiques</h3>
            <p className="text-sm text-gray-600">Suivez vos performances et ventes</p>
          </div>
        </div>
      </div>
    </main>
  );
}
