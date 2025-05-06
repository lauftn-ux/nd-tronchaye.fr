import React, { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslation } from "react-i18next";

const AdminLogin = () => {
  const { t } = useTranslation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { loginMutation, user, isLoading, checkSession } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  // Vérifie l'état de l'authentification au chargement
  useEffect(() => {
    // Vérifie explicitement la session pour s'assurer que l'état est à jour
    const verifySession = async () => {
      await checkSession();
    };

    verifySession();
  }, []);

  // Si l'utilisateur est déjà connecté, rediriger vers la page admin
  useEffect(() => {
    if (user) {
      console.log("Utilisateur authentifié détecté dans AdminLogin, redirection vers /admin");
      setLocation("/admin");
    }
  }, [user, setLocation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Tentative de connexion depuis l'interface admin avec:", username);
    try {
      const result = await loginMutation.mutateAsync({ username, password });
      console.log("Login réussi depuis AdminLogin, résultat:", result);
      
      // Force la vérification de la session après la connexion
      await checkSession();
      
      toast({
        title: t("Login successful"),
        description: t("You are now logged in as admin"),
      });
      
      // Redirection immédiate vers la page admin
      setLocation("/admin");
    } catch (error) {
      console.error("Login error from AdminLogin:", error);
      toast({
        title: t("Login failed"),
        description: t("Invalid username or password"),
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{t("Admin Login")}</CardTitle>
          <CardDescription>
            {t("Please login to access the admin area")}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">{t("Username")}</Label>
              <Input
                id="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t("Password")}</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {/* Débogage - Afficher l'état d'authentification actuel */}
            <div className="text-xs text-muted-foreground">
              Status: {isLoading ? "Chargement..." : user ? "Connecté" : "Non connecté"}
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              type="submit" 
              className="w-full"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? t("Logging in...") : t("Login")}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default AdminLogin;
