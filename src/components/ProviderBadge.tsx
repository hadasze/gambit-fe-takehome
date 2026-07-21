import type { Provider } from "../types/domain";

export function ProviderBadge({ provider }: { provider: Provider }) {
  return <span className={`badge badge--provider-${provider.toLowerCase()}`}>{provider}</span>;
}
