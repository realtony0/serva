import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-gray-950 p-4 sm:p-8 md:p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between text-center">
        <div className="mb-8">
          <h1 className="text-5xl sm:text-6xl font-extrabold text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
            Bienvenue sur SERVA
          </h1>
          <p className="text-xl sm:text-2xl text-gray-300 mb-2">
            Plateforme de commande en ligne pour restaurants
          </p>
          <p className="text-base sm:text-lg text-gray-400">
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
          <div className="bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border border-gray-700">
            <div className="text-4xl mb-3">📱</div>
            <h3 className="font-semibold text-gray-100 mb-2">QR Codes</h3>
            <p className="text-sm text-gray-400">Générez des QR codes uniques pour chaque table</p>
          </div>
          <div className="bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border border-gray-700">
            <div className="text-4xl mb-3">⚡</div>
            <h3 className="font-semibold text-gray-100 mb-2">Temps réel</h3>
            <p className="text-sm text-gray-400">Commandes synchronisées en temps réel</p>
          </div>
          <div className="bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border border-gray-700">
            <div className="text-4xl mb-3">📊</div>
            <h3 className="font-semibold text-gray-100 mb-2">Statistiques</h3>
            <p className="text-sm text-gray-400">Suivez vos performances et ventes</p>
          </div>
        </div>
      </div>
    </main>
  );
}
