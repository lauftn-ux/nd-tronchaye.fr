import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAdmin } from "./auth";
import multer from "multer";
import { insertContactMessageSchema, insertEventSchema, insertPhotoSchema, insertSpecialEventSchema, insertSubscriberSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (_req, file, cb) => {
    // Accept only images
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Configurer l'authentification
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
  
  app.post("/api/events", async (req: Request, res: Response) => {
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
  
  app.put("/api/events/:id", async (req: Request, res: Response) => {
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
  
  app.delete("/api/events/:id", async (req: Request, res: Response) => {
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
  
  app.post("/api/events/special", async (req: Request, res: Response) => {
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
  
  // Photos API
  app.get("/api/photos", async (_req: Request, res: Response) => {
    try {
      const photos = await storage.getAllPhotos();
      res.json(photos);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch photos" });
    }
  });
  
  app.post("/api/photos", async (req: Request, res: Response) => {
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
  
  // For a real application, we would handle file uploads to storage service
  // Here we'll simulate by accepting photo URLs
  app.post("/api/photos/upload", upload.array("photos", 10), async (req: Request, res: Response) => {
    try {
      // In a real app, we would process the uploaded files here
      // For now, we'll just simulate by creating a photo with a URL
      if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
        return res.status(400).json({ message: "No files uploaded" });
      }
      
      // In a real implementation, we would upload files to a storage service
      // and get back URLs. For simplicity, we're using mock URLs here.
      const newPhotos = [];
      
      for (let i = 0; i < req.files.length; i++) {
        const file = req.files[i];
        // Create a simulated URL - in a real app this would be a real URL from a storage service
        const photoUrl = `https://example.com/uploads/${file.originalname}`;
        
        const newPhoto = await storage.createPhoto({
          title: file.originalname,
          url: photoUrl
        });
        
        newPhotos.push(newPhoto);
      }
      
      res.status(201).json(newPhotos);
    } catch (error) {
      res.status(500).json({ message: "Failed to upload photos" });
    }
  });
  
  app.delete("/api/photos/:id", async (req: Request, res: Response) => {
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
      const newMessage = await storage.createContactMessage(validatedData);
      res.status(201).json({ success: true, message: "Message sent successfully" });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
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

  // Routes protégées d'administration
  // Middleware pour vérifier si l'utilisateur est admin
  const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Non authentifié" });
    }
    
    // @ts-ignore - Problème de typage avec isAdmin
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: "Accès refusé" });
    }
    
    next();
  };

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

  const httpServer = createServer(app);

  return httpServer;
}
