import type { Express, Request, Response, NextFunction } from "express";
import { storage } from "./storage.js";
import { setupAuth, comparePasswords, hashPassword } from "./auth.js";
import multer from "multer";
import { insertContactMessageSchema, insertEventSchema, insertPhotoSchema, insertSpecialEventSchema, insertSubscriberSchema, User } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { sendContactFormEmail } from "./emailService.js";
import { uploadPhotoToBucket } from "./supabaseStorage.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Non authentifié" });
  }
  if (!(req.user as User | undefined)?.isAdmin) {
    return res.status(403).json({ message: "Accès refusé" });
  }
  next();
}

export async function registerRoutes(app: Express): Promise<void> {
  setupAuth(app);

  // API Routes - all prefixed with /api
  
  // Events API
  app.get("/api/events", async (_req: Request, res: Response) => {
    try {
      const events = await storage.getAllEvents();
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch events" });
    }
  });
  
  app.get("/api/events/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid event ID" });
      }
      
      const event = await storage.getEvent(id);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      
      res.json(event);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch event" });
    }
  });
  
  app.get("/api/events/upcoming", async (_req: Request, res: Response) => {
    try {
      const events = await storage.getUpcomingEvents(5); // Limit to 5 upcoming events
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch upcoming events" });
    }
  });
  
  app.post("/api/events", requireAdmin, async (req: Request, res: Response) => {
    try {
      const validatedData = insertEventSchema.parse(req.body);
      const newEvent = await storage.createEvent(validatedData);
      res.status(201).json(newEvent);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: "Failed to create event" });
    }
  });

  app.put("/api/events/:id", requireAdmin, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid event ID" });
      }

      const validatedData = insertEventSchema.partial().parse(req.body);
      const updatedEvent = await storage.updateEvent(id, validatedData);

      if (!updatedEvent) {
        return res.status(404).json({ message: "Event not found" });
      }

      res.json(updatedEvent);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: "Failed to update event" });
    }
  });

  app.delete("/api/events/:id", requireAdmin, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid event ID" });
      }

      const success = await storage.deleteEvent(id);
      if (!success) {
        return res.status(404).json({ message: "Event not found" });
      }

      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete event" });
    }
  });

  // Special Events API (for schedule display)
  app.get("/api/events/special/all", async (_req: Request, res: Response) => {
    try {
      const specialEvents = await storage.getAllSpecialEvents();
      res.json(specialEvents);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch special events" });
    }
  });

  // Photos API
  app.get("/api/photos", async (_req: Request, res: Response) => {
    try {
      const photos = await storage.getAllPhotos();
      res.json(photos);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch photos" });
    }
  });

  app.post("/api/photos", requireAdmin, async (req: Request, res: Response) => {
    try {
      const validatedData = insertPhotoSchema.parse(req.body);
      const newPhoto = await storage.createPhoto(validatedData);
      res.status(201).json(newPhoto);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: "Failed to create photo" });
    }
  });

  app.post("/api/photos/upload", requireAdmin, upload.array("photos", 10), async (req: Request, res: Response) => {
    try {
      if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
        return res.status(400).json({ message: "No files uploaded" });
      }

      const newPhotos = [];
      for (const file of req.files) {
        const publicUrl = await uploadPhotoToBucket(file.buffer, file.originalname, file.mimetype);
        const newPhoto = await storage.createPhoto({
          title: file.originalname,
          url: publicUrl,
        });
        newPhotos.push(newPhoto);
      }

      res.status(201).json(newPhotos);
    } catch (error) {
      console.error("[upload] failed:", error);
      const message = error instanceof Error ? error.message : "Failed to upload photos";
      res.status(500).json({ message });
    }
  });

  app.put("/api/photos/:id", requireAdmin, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid photo ID" });
      }

      const validatedData = insertPhotoSchema.parse(req.body);
      const updatedPhoto = await storage.updatePhoto(id, validatedData);

      if (!updatedPhoto) {
        return res.status(404).json({ message: "Photo not found" });
      }

      res.json(updatedPhoto);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: "Failed to update photo" });
    }
  });

  app.delete("/api/photos/:id", requireAdmin, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid photo ID" });
      }

      const success = await storage.deletePhoto(id);
      if (!success) {
        return res.status(404).json({ message: "Photo not found" });
      }

      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete photo" });
    }
  });
  
  // Contact API
  app.post("/api/contact", async (req: Request, res: Response) => {
    try {
      const validatedData = insertContactMessageSchema.parse(req.body);
      
      // Enregistrer le message dans la base de données
      const newMessage = await storage.createContactMessage(validatedData);
      
      // Envoyer le message par email
      const emailSent = await sendContactFormEmail(
        validatedData.name,
        validatedData.email,
        validatedData.subject,
        validatedData.message
      );
      
      if (!emailSent) {
        console.warn("L'email n'a pas pu être envoyé, mais le message a été enregistré dans la base de données");
      }
      
      res.status(201).json({ 
        success: true, 
        message: "Message sent successfully",
        emailSent: emailSent
      });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      console.error("Erreur lors de l'envoi du message:", error);
      res.status(500).json({ message: "Failed to send message" });
    }
  });
  
  // Newsletter subscription
  app.post("/api/subscribe", async (req: Request, res: Response) => {
    try {
      const validatedData = insertSubscriberSchema.parse(req.body);
      
      // Check if email already exists
      const existingSubscriber = await storage.getSubscriberByEmail(validatedData.email);
      if (existingSubscriber) {
        return res.status(400).json({ message: "Email already subscribed" });
      }
      
      const newSubscriber = await storage.createSubscriber(validatedData);
      res.status(201).json({ success: true, message: "Subscribed successfully" });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: "Failed to subscribe" });
    }
  });

  // API pour la gestion d'événements (admin uniquement)
  app.get("/api/admin/events", requireAdmin, async (_req: Request, res: Response) => {
    try {
      const events = await storage.getAllEvents();
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch events" });
    }
  });

  app.post("/api/admin/events", requireAdmin, async (req: Request, res: Response) => {
    try {
      const validatedData = insertEventSchema.parse(req.body);
      const newEvent = await storage.createEvent(validatedData);
      res.status(201).json(newEvent);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: "Failed to create event" });
    }
  });

  app.put("/api/admin/events/:id", requireAdmin, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid event ID" });
      }
      
      const validatedData = insertEventSchema.partial().parse(req.body);
      const updatedEvent = await storage.updateEvent(id, validatedData);
      
      if (!updatedEvent) {
        return res.status(404).json({ message: "Event not found" });
      }
      
      res.json(updatedEvent);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: "Failed to update event" });
    }
  });

  app.delete("/api/admin/events/:id", requireAdmin, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid event ID" });
      }
      
      const success = await storage.deleteEvent(id);
      if (!success) {
        return res.status(404).json({ message: "Event not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete event" });
    }
  });

  // API pour la gestion des événements spéciaux (admin uniquement)
  app.get("/api/admin/events/special", requireAdmin, async (_req: Request, res: Response) => {
    try {
      const specialEvents = await storage.getAllSpecialEvents();
      res.json(specialEvents);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch special events" });
    }
  });

  app.post("/api/admin/events/special", requireAdmin, async (req: Request, res: Response) => {
    try {
      const validatedData = insertSpecialEventSchema.parse(req.body);
      const newEvent = await storage.createSpecialEvent(validatedData);
      res.status(201).json(newEvent);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: "Failed to create special event" });
    }
  });

  app.put("/api/admin/events/special/:id", requireAdmin, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid event ID" });
      }
      
      const validatedData = insertSpecialEventSchema.partial().parse(req.body);
      const updatedEvent = await storage.updateSpecialEvent(id, validatedData);
      
      if (!updatedEvent) {
        return res.status(404).json({ message: "Special event not found" });
      }
      
      res.json(updatedEvent);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: "Failed to update special event" });
    }
  });

  app.delete("/api/admin/events/special/:id", requireAdmin, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid event ID" });
      }
      
      const success = await storage.deleteSpecialEvent(id);
      if (!success) {
        return res.status(404).json({ message: "Special event not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete special event" });
    }
  });

  // Récupérer les messages de contact (admin uniquement)
  app.get("/api/admin/contacts", requireAdmin, async (_req: Request, res: Response) => {
    try {
      const messages = await storage.getAllContactMessages();
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch contact messages" });
    }
  });

  // Route pour changer les identifiants de l'administrateur
  app.put("/api/admin/credentials", requireAdmin, async (req: Request, res: Response) => {
    try {
      const { currentPassword, newUsername, newPassword } = req.body;
      
      // Vérifier que l'utilisateur actuel est bien authentifié
      if (!req.user || !('id' in req.user) || !req.user.id) {
        return res.status(401).json({ message: "Non authentifié" });
      }
      
      // Récupérer l'utilisateur actuel
      const userId = (req.user as any).id;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }
      
      // Vérifier le mot de passe actuel
      const isPasswordValid = await comparePasswords(currentPassword, user.password);
      
      if (!isPasswordValid) {
        return res.status(400).json({ message: "Mot de passe actuel incorrect" });
      }
      
      // Données de mise à jour
      const updateData: { username?: string; password?: string } = {};
      
      // Mettre à jour le nom d'utilisateur si fourni
      if (newUsername && newUsername !== user.username) {
        // Vérifier si le nouveau nom d'utilisateur est déjà pris
        const existingUser = await storage.getUserByUsername(newUsername);
        if (existingUser && existingUser.id !== user.id) {
          return res.status(400).json({ message: "Ce nom d'utilisateur est déjà utilisé" });
        }
        updateData.username = newUsername;
      }
      
      // Mettre à jour le mot de passe si fourni
      if (newPassword) {
        const hashedPassword = await hashPassword(newPassword);
        updateData.password = hashedPassword;
      }
      
      // Si aucune mise à jour n'est nécessaire
      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ message: "Aucune information à mettre à jour" });
      }
      
      // Effectuer la mise à jour
      const updatedUser = await storage.updateUser(userId, updateData);
      
      if (!updatedUser) {
        return res.status(500).json({ message: "Erreur lors de la mise à jour des identifiants" });
      }
      
      res.json({ message: "Identifiants mis à jour avec succès" });
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur lors de la mise à jour des identifiants" });
    }
  });
}
