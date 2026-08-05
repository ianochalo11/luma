import { RegistrationCheckout } from "@/components/registration/RegistrationCheckout";
import { getEventBySlug } from "@/lib/api/events";
import { notFound } from "next/navigation";

export default async function RegisterPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = getEventBySlug(slug);
  if (!event) notFound();

  return <RegistrationCheckout />;
}
