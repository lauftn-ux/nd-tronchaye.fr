import { createContext, ReactNode, useContext, useEffect } from "react";
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
  checkSession: () => Promise<void>;
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
  
  // Notre requête principale pour récupérer les informations de l'utilisateur
  const {
    data: user,
    error,
    isLoading,
    refetch,
  } = useQuery<User | null, Error>({
    queryKey: ['/api/user'],
    queryFn: async () => {
      try {
        console.log("Vérification de la session utilisateur...");
        const res = await fetch("/api/user", {
          method: "GET",
          credentials: "include", // Important pour envoyer les cookies
          headers: {
            "Cache-Control": "no-cache", // Évite la mise en cache de la requête
          },
        });
        
        if (res.status === 401) {
          console.log("Utilisateur non authentifié");
          return null;
        }
        
        if (!res.ok) {
          throw new Error(`Erreur réseau: ${res.status}`);
        }
        
        const userData = await res.json();
        console.log("Session utilisateur récupérée avec succès:", userData);
        return userData;
      } catch (err) {
        console.error("Erreur lors de la récupération de la session:", err);
        return null;
      }
    },
    staleTime: 0, // Toujours considérer les données comme périmées
    retry: false, // Ne pas réessayer en cas d'échec
    refetchOnWindowFocus: true, // Actualiser quand l'utilisateur revient sur la page
  });
  
  // Fonction pour vérifier l'état de la session
  const checkSession = async () => {
    console.log("Vérification de la session en cours...");
    await refetch();
  };

  // Mutation pour la connexion
  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginData) => {
      console.log("Tentative de connexion avec:", credentials.username);
      try {
        // Utilisation de fetch directement pour avoir plus de contrôle
        const res = await fetch("/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(credentials),
          credentials: "include", // Crucial pour stocker les cookies
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
    onSuccess: async (user: User) => {
      console.log("Login mutation succès:", user);
      // Mettre à jour le cache avec les données utilisateur
      queryClient.setQueryData(['/api/user'], user);
      // Force une vérification de la session après la connexion
      await checkSession();
      
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

  // Mutation pour l'inscription
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

  // Mutation pour la déconnexion
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
  
  // Vérifier la session au chargement initial
  useEffect(() => {
    checkSession();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        isLoading,
        error,
        loginMutation,
        logoutMutation,
        registerMutation,
        checkSession,
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