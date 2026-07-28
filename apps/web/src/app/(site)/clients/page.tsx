import { redirect } from "next/navigation";

// No clients yet — redirect to contact page.
// Re-enable this page once we have real client relationships to showcase.
export default function ClientsPage() {
  redirect("/contact");
}
