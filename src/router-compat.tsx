import type { ComponentType } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";

// Shim that recreates the react-router v5 `match`/`history`/`location` props
// that the ported class components still expect, on top of react-router v7.
export interface LegacyRouteProps {
  match: { params: Record<string, string | undefined> };
  history: { push: (to: string) => void; replace: (to: string) => void };
  location: { pathname: string; search: string; hash: string; state: unknown };
}

export function withRouter<P extends LegacyRouteProps>(
  Wrapped: ComponentType<P>,
) {
  return function WithRouter(props: Omit<P, keyof LegacyRouteProps>) {
    const params = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const legacy: LegacyRouteProps = {
      match: { params },
      history: {
        push: (to: string) => navigate(to),
        replace: (to: string) => navigate(to, { replace: true }),
      },
      location: {
        pathname: location.pathname,
        search: location.search,
        hash: location.hash,
        state: location.state,
      },
    };
    return <Wrapped {...(props as P)} {...legacy} />;
  };
}
