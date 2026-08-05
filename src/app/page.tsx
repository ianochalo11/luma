import { redirect } from "next/navigation";
import { LINKS } from "@/constants/links";

/** Phase 1 stub — event landing lives at /breakpoint2026 */
export default function HomePage() {
  redirect(LINKS.appRoutes.landing);
}
