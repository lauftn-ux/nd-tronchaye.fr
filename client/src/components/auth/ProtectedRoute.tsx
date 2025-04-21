import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Redirect, Route } from "wouter";

type ProtectedRouteProps = {
  path: string;
  component: React.ComponentType;
  adminOnly?: boolean;
};

export function ProtectedRoute({
  path,
  component: Component,
  adminOnly = false
}: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();

  return (
    <Route path={path}>
      {() => {
        if (isLoading) {
          return (
            <div className="flex items-center justify-center min-h-screen">
              <Loader2 className="h-8 w-8 animate-spin text-border" />
            </div>
          );
        }

        if (!user) {
          return <Redirect to="/admin-login" />;
        }

        if (adminOnly && !user.isAdmin) {
          return <Redirect to="/admin-login" />;
        }

        return <Component />;
      }}
    </Route>
  );
}