export function mapAuthError(msg: string, locale: string = "en"): string {
  const fr = locale === "fr";

  if (msg.includes("Invalid login credentials")) {
    return fr
      ? "Email ou mot de passe incorrect."
      : "Wrong email or password.";
  }
  if (msg.includes("Email not confirmed")) {
    return fr
      ? "Veuillez confirmer votre email avant de vous connecter."
      : "Please confirm your email before signing in.";
  }
  if (msg.includes("User already registered")) {
    return fr
      ? "Un compte existe déjà avec cet email."
      : "An account already exists with this email.";
  }

  return fr
    ? "Une erreur est survenue. Réessayez."
    : "Something went wrong. Please try again.";
}
