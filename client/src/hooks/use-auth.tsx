import { createContext, ReactNode, useContext } from "react";
import {
  useQuery,
  useMutation,
  UseMutationResult,
} from "@tanstack/react-query";
import { User } from "@shared/schema";
import { getQueryFn, apiRequest, queryClient } from "../lib/queryClient";
import { useToast } from "@/hooks/use-toast";

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  loginMutation: UseMutationResult<User, Error, LoginData>;
  logoutMutation: UseMutationResult<void, Error, void>;
  registerMutation: UseMutationResult<User, Error, RegisterData>;
};

type LoginData = {
  username: string;
  password: string;
};

type RegisterData = {
  username: string;
  password: string;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  
  const {
    data: user,
    error,
    isLoading,
  } = useQuery<User | null, Error>({
    queryKey: ['/api/user'],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginData) => {
      console.log("Tentative de connexion avec:", credentials.username);
      try {
        const res = await fetch("/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(credentials),
          credentials: "include",
        });
        
        if (!res.ok) {
          const errorText = await res.text();
          console.error(`Erreur login status ${res.status}:`, errorText);
          throw new Error(`${res.status}: ${errorText || res.statusText}`);
        }
        
        const userData = await res.json();
        console.log("Login réussi, données reçues:", userData);
        return userData;
      } catch (err) {
        console.error("Exception lors de la connexion:", err);
        throw err;
      }
    },
    onSuccess: (user: User) => {
      console.log("Login mutation succès:", user);
      queryClient.setQueryData(['/api/user'], user);
      toast({
        title: "Connexion réussie",
        description: "Vous êtes maintenant connecté.",
      });
    },
    onError: (error: Error) => {
      console.error("Login mutation erreur:", error);
      toast({
        title: "Échec de la connexion",
        description: "Nom d'utilisateur ou mot de passe incorrect.",
        variant: "destructive",
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (credentials: RegisterData) => {
      const res = await apiRequest("POST", "/api/register", credentials);
      return await res.json();
    },
    onSuccess: (user: User) => {
      queryClient.setQueryData(['/api/user'], user);
      toast({
        title: "Inscription réussie",
        description: "Votre compte a été créé avec succès.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Échec de l'inscription",
        description: "Impossible de créer votre compte. Veuillez réessayer.",
        variant: "destructive",
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/logout");
    },
    onSuccess: () => {
      queryClient.setQueryData(['/api/user'], null);
      toast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté avec succès.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Échec de la déconnexion",
        description: "Une erreur s'est produite lors de la déconnexion.",
        variant: "destructive",
      });
    },
  });

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        isLoading,
        error,
        loginMutation,
        logoutMutation,
        registerMutation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}