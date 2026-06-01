/**
 * /login — redirects to the new (auth) route-group login page.
 * Kept for backwards-compat with any existing links.
 */
import { redirect } from "next/navigation";

export default function LoginRedirect() {
  redirect("/login");
}
