// /ctrla/contribute · retired in favor of the two-door Contribute hub at
// /ctrla/submit, which routes into dedicated, config-driven pages per type.
// Kept as a permanent redirect so old links and bookmarks still land right.
import { redirect } from "next/navigation";

export default function ContributeRedirect() {
  redirect("/ctrla/submit");
}
