import { createServerSupabaseClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import OnboardingForm from "./OnboardingForm";

export default async function OnboardingPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // If user already has a restaurant, redirect to dashboard
  const { data: restaurant } = await supabase
    .from("restaurants")
    .select("id")
    .eq("owner_id", user.id)
    .single();

  if (restaurant) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Bienvenue sur Serva !
          </h1>
          <p className="text-slate-600 text-sm">
            Configurez votre restaurant pour commencer.
          </p>
        </div>
        <OnboardingForm userId={user.id} />
      </div>
    </div>
  );
}
