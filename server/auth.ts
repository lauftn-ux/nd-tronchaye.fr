import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { storage } from "./storage";
import { User } from "@shared/schema";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

// Helper functions pour la gestion des mots de passe - simplifié pour le prototype
function hashPassword(password: string) {
  // Simple hashing pour le prototype
  return `hashed_${password}`;
}

function comparePasswords(supplied: string, stored: string) {
  // Pour un prototype, on utilise une méthode simple
  if (stored.startsWith('hashed_')) {
    // Pour un mot de passe stocké avec notre système de hashage
    return stored === `hashed_${supplied}`;
  } else {
    // Pour un mot de passe stocké directement (comme dans notre seed)
    return stored === supplied;
  }
}

export function setupAuth(app: Express) {
  // Configuration de la session
  const sessionStore = new MemoryStore({
    checkPeriod: 86400000 // 1 jour en millisecondes
  });

  app.use(session({
    secret: "santuary-notre-dame-secret", // Dans un environnement de production, utiliser process.env.SESSION_SECRET
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
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return done(null, false);
      }

      const isValid = await comparePasswords(password, user.password);
      if (!isValid) {
        return done(null, false);
      }

      return done(null, user);
    } catch (error) {
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
  app.post("/api/login", passport.authenticate("local"), (req, res) => {
    res.json(req.user);
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