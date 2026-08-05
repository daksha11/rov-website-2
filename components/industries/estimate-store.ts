// Carries the ICP calculator's result down to the lead form.
//
// The two components sit on the same page but in different subtrees, and the
// page is a server component, so there is no shared React state to hang this
// on. sessionStorage keeps them decoupled: the calculator writes when it has a
// number, the form reads at submit and ignores a miss. No provider, no prop
// drilling through the page, and nothing breaks if one of them is absent.
//
// Scoped by slug so a stale number from a different industry page cannot ride
// along on a lead for this one.

const KEY = "rov_icp_estimate";

export type IcpEstimate = {
  icpSlug: string;
  /** Formatted for a human, e.g. "$47,000". The email is read, not parsed. */
  value: string;
  /** The calculator's own framing, e.g. "in missed calls a year". */
  label: string;
};

export function saveEstimate(estimate: IcpEstimate) {
  try {
    window.sessionStorage.setItem(KEY, JSON.stringify(estimate));
  } catch {
    /* private mode: the lead simply arrives without the estimate */
  }
}

/** Returns the stored estimate only when it belongs to this page. */
export function readEstimate(icpSlug: string): IcpEstimate | null {
  try {
    const raw = window.sessionStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as IcpEstimate;
    return parsed.icpSlug === icpSlug ? parsed : null;
  } catch {
    return null;
  }
}
