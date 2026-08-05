import { redirect } from "next/navigation";
import { LINKS } from "@/constants/links";
import { getEventBySlug } from "@/lib/api/events";
import { notFound } from "next/navigation";

/** Payment is on the registration page — keep this route as a soft redirect. */
export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = getEventBySlug(slug);
  if (!event) notFound();
  redirect(LINKS.appRoutes.register);
}
