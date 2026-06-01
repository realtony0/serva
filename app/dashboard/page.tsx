/**
 * /dashboard — redirects to the new (dashboard) route-group page.
 * Kept for backwards-compat with any existing links.
 */
import { redirect } from "next/navigation";

export default function DashboardRedirect() {
  redirect("/dashboard");
}
