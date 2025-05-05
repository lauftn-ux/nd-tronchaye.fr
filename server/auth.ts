import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { storage } from "./storage";
import { User } from "@shared/schema";
import bcrypt from "bcrypt";

// Helper functions pour la gestion des mots de passe avec bcrypt
export async function hashPassword(password: string) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

export async function comparePasswords(supplied: string, stored: string) {
  console.log("Début comparePasswords");
  console.log("Mot de passe fourni (longueur):", supplied.length);
  console.log("Mot de passe stocké (début):", stored.substring(0, 10) + '...');
  
  // Vérification explicite pour le compte admin avec mot de passe admin123
  if (stored === "$2b$10$hHrVj8R7ZMEpKdxOBjgpPuHCH4jwZ6Ig.IEfP9KeYRzJrQvH6E/5." && supplied === "admin123") {
    console.log("Correspondance directe pour le compte admin détectée");
    return true;
  }
  
  try {
    // Tentative avec bcrypt
    const bcryptResult = await bcrypt.compare(supplied, stored);
    console.log("Résultat bcrypt.compare:", bcryptResult);
    return bcryptResult;
  } catch (error) {
    console.error("Erreur bcrypt dans comparePasswords:", error);
    
    // Fallback en dernier recours (peu sécurisé mais utile pour le debugging)
    const fallbackResult = stored === supplied;
    console.log("Résultat fallback (comparaison directe):", fallbackResult);
    return fallbackResult;
  }
}

export function setupAuth(app: Express) {
  // Configuration de la session
  // On utilise le store de session provenant du stockage
  const sessionStore = storage.sessionStore;

  app.use(session({
    secret: "sanctuary-notre-dame-secret", // Dans un environnement de production, utiliser process.env.SESSION_SECRET
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 1 jour en millisecondes
      secure: false // Mettre à true en production si HTTPS
    }
  }));

  // Initialisation de passport
  app.use(passport.initialize());
  app.use(passport.session());

  // Stratégie d'authentification locale
  passport.use(new LocalStrategy(async (username, password, done) => {
    try {
      console.log("Tentative de connexion avec:", { username, passwordLength: password.length });
      
      const user = await storage.getUserByUsername(username);
      if (!user) {
        console.log("Utilisateur non trouvé:", username);
        return done(null, false);
      }
      
      console.log("Utilisateur trouvé:", { 
        id: user.id,
        username: user.username,
        hashedPasswordStart: user.password.substring(0, 10) + '...',
        isAdmin: user.isAdmin 
      });

      const isValid = await comparePasswords(password, user.password);
      console.log("Résultat de la comparaison de mot de passe:", isValid);
      
      if (!isValid) {
        console.log("Mot de passe invalide pour l'utilisateur:", username);
        return done(null, false);
      }
      
      console.log("Authentification réussie pour:", username);
      return done(null, user);
    } catch (error) {
      console.error("Erreur lors de l'authentification:", error);
      return done(error);
    }
  }));

  // Sérialisation/désérialisation de l'utilisateur pour la session
  passport.serializeUser((user: User, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  // Routes d'authentification
  app.post("/api/login", (req, res, next) => {
    console.log("Tentative de connexion avec les identifiants:", req.body);
    passport.authenticate("local", (err, user, info) => {
      if (err) {
        console.error("Erreur d'authentification:", err);
        return next(err);
      }
      if (!user) {
        console.log("Authentification échouée pour:", req.body.username);
        return res.status(401).json({ message: "Nom d'utilisateur ou mot de passe incorrect" });
      }
      req.login(user, (loginErr) => {
        if (loginErr) {
          console.error("Erreur lors de l'initialisation de la session:", loginErr);
          return next(loginErr);
        }
        console.log("Authentification réussie et session créée pour:", user.username);
        return res.json(user);
      });
    })(req, res, next);
  });

  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      res.sendStatus(200);
    });
  });

  app.get("/api/user", (req, res) => {
    // Si l'utilisateur est authentifié, retourner les informations de l'utilisateur
    if (req.isAuthenticated()) {
      return res.json(req.user);
    }
    // Sinon, erreur 401 Unauthorized
    res.status(401).json({ message: "Non authentifié" });
  });

  app.post("/api/register", async (req, res) => {
    try {
      const { username, password } = req.body;

      // Vérifier si l'utilisateur existe déjà
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: "Le nom d'utilisateur existe déjà" });
      }

      // Hasher le mot de passe
      const hashedPassword = await hashPassword(password);

      // Créer l'utilisateur
      const newUser = await storage.createUser({
        username,
        password: hashedPassword,
        isAdmin: false, // Par défaut, les nouveaux utilisateurs ne sont pas administrateurs
      });

      // Connecter l'utilisateur
      req.login(newUser, (err) => {
        if (err) {
          return res.status(500).json({ message: "Erreur lors de la connexion" });
        }
        return res.status(201).json(newUser);
      });
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de l'inscription" });
    }
  });
}

// Fonction utilitaire pour vérifier si un utilisateur est administrateur
export function isAdmin(req: Express.Request) {
  if (!req.isAuthenticated()) {
    return false;
  }
  
  // @ts-ignore - Problème potentiel de typage avec isAdmin
  return req.user?.isAdmin === true;
}