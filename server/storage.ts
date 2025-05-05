import { 
  users, User, InsertUser,
  events, Event, InsertEvent,
  photos, Photo, InsertPhoto,
  contactMessages, ContactMessage, InsertContactMessage,
  specialEvents, SpecialEvent, InsertSpecialEvent,
  subscribers, Subscriber, InsertSubscriber
} from "@shared/schema";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  
  // Event operations
  getAllEvents(): Promise<Event[]>;
  getEvent(id: number): Promise<Event | undefined>;
  createEvent(event: InsertEvent): Promise<Event>;
  updateEvent(id: number, event: Partial<InsertEvent>): Promise<Event | undefined>;
  deleteEvent(id: number): Promise<boolean>;
  getUpcomingEvents(limit?: number): Promise<Event[]>;
  getFeaturedEvents(): Promise<Event[]>;
  
  // Photo operations
  getAllPhotos(): Promise<Photo[]>;
  getPhoto(id: number): Promise<Photo | undefined>;
  createPhoto(photo: InsertPhoto): Promise<Photo>;
  deletePhoto(id: number): Promise<boolean>;
  
  // Contact message operations
  getAllContactMessages(): Promise<ContactMessage[]>;
  getContactMessage(id: number): Promise<ContactMessage | undefined>;
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  markContactMessageAsRead(id: number): Promise<boolean>;
  deleteContactMessage(id: number): Promise<boolean>;
  
  // Special events operations
  getAllSpecialEvents(): Promise<SpecialEvent[]>;
  getSpecialEvent(id: number): Promise<SpecialEvent | undefined>;
  createSpecialEvent(event: InsertSpecialEvent): Promise<SpecialEvent>;
  updateSpecialEvent(id: number, event: Partial<InsertSpecialEvent>): Promise<SpecialEvent | undefined>;
  deleteSpecialEvent(id: number): Promise<boolean>;
  
  // Newsletter subscriber operations
  getAllSubscribers(): Promise<Subscriber[]>;
  getSubscriberByEmail(email: string): Promise<Subscriber | undefined>;
  createSubscriber(subscriber: InsertSubscriber): Promise<Subscriber>;
  deleteSubscriber(id: number): Promise<boolean>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private events: Map<number, Event>;
  private photos: Map<number, Photo>;
  private contactMessages: Map<number, ContactMessage>;
  private specialEvents: Map<number, SpecialEvent>;
  private subscribers: Map<number, Subscriber>;
  
  // ID counters
  private userIdCounter: number;
  private eventIdCounter: number;
  private photoIdCounter: number;
  private contactMessageIdCounter: number;
  private specialEventIdCounter: number;
  private subscriberIdCounter: number;

  constructor() {
    this.users = new Map();
    this.events = new Map();
    this.photos = new Map();
    this.contactMessages = new Map();
    this.specialEvents = new Map();
    this.subscribers = new Map();
    
    this.userIdCounter = 1;
    this.eventIdCounter = 1;
    this.photoIdCounter = 1;
    this.contactMessageIdCounter = 1;
    this.specialEventIdCounter = 1;
    this.subscriberIdCounter = 1;
    
    // Initialize with some sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Add admin user
    this.createUser({
      username: "admin",
      // Mot de passe 'admin123' en texte brut pour le prototype
      password: "admin123",
      isAdmin: true
    });
    
    // Add sample events
    this.createEvent({
      title: "Pèlerinage marial",
      description: "Rejoignez-nous pour notre pèlerinage annuel en l'honneur de Notre Dame. Procession aux flambeaux et célébration eucharistique.",
      date: "2023-08-20",
      time: "14h30 - 21h00",
      imageUrl: "https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
      type: "pilgrimage",
      featured: true
    });
    
    this.createEvent({
      title: "Concert spirituel",
      description: "Un moment musical unique dans le cadre exceptionnel du sanctuaire. Musique sacrée interprétée par l'ensemble vocal Cantus Firmus.",
      date: "2023-09-15",
      time: "20h00 - 22h00",
      imageUrl: "https://images.unsplash.com/photo-1477238134895-98438ad85c30?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
      type: "general",
      featured: true
    });
    
    this.createEvent({
      title: "Journées du patrimoine",
      description: "Visites guidées du sanctuaire et de son trésor. Découvrez l'histoire et l'architecture de ce joyau du patrimoine religieux breton.",
      date: "2023-09-17",
      time: "10h00 - 18h00",
      imageUrl: "https://images.unsplash.com/photo-1465310477141-6fb93167a273?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
      type: "general",
      featured: true
    });
    
    // Add special events for the schedule
    this.createSpecialEvent({
      date: "15 août 2023",
      title: "Assomption de la Vierge Marie",
      time: "Messes à 9h00 et 11h00, procession à 20h30"
    });
    
    this.createSpecialEvent({
      date: "8 septembre 2023",
      title: "Nativité de la Vierge Marie",
      time: "Messe solennelle à 18h00"
    });
    
    this.createSpecialEvent({
      date: "8 décembre 2023",
      title: "Immaculée Conception",
      time: "Messe à 18h00 suivie d'une veillée mariale"
    });
    
    // Add sample photos
    this.createPhoto({
      title: "Sanctuaire Notre Dame de la Tronchaye",
      url: "/IMG_9298.webp"
    });
    
    this.createPhoto({
      title: "Intérieur de la chapelle",
      url: "/IMG_9301.webp"
    });
    
    this.createPhoto({
      title: "Détail de l'autel",
      url: "/IMG_9302.webp"
    });
    
    this.createPhoto({
      title: "Vierge à l'Enfant",
      url: "/IMG_9303.webp"
    });
    
    this.createPhoto({
      title: "Vitrail de Notre Dame",
      url: "/IMG_9305.webp"
    });
    
    this.createPhoto({
      title: "Chapelle latérale",
      url: "/IMG_9309.webp"
    });
    
    this.createPhoto({
      title: "Détail d'architecture",
      url: "/IMG_9310.webp"
    });
    
    this.createPhoto({
      title: "Vue d'ensemble du sanctuaire",
      url: "/IMG_9315.webp"
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const newUser: User = { ...user, id };
    this.users.set(id, newUser);
    return newUser;
  }
  
  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined> {
    const existingUser = this.users.get(id);
    if (!existingUser) return undefined;
    
    const updatedUser: User = { ...existingUser, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  
  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  // Event operations
  async getAllEvents(): Promise<Event[]> {
    return Array.from(this.events.values());
  }

  async getEvent(id: number): Promise<Event | undefined> {
    return this.events.get(id);
  }

  async createEvent(event: InsertEvent): Promise<Event> {
    const id = this.eventIdCounter++;
    const newEvent: Event = { ...event, id };
    this.events.set(id, newEvent);
    return newEvent;
  }

  async updateEvent(id: number, eventData: Partial<InsertEvent>): Promise<Event | undefined> {
    const existingEvent = this.events.get(id);
    if (!existingEvent) return undefined;
    
    const updatedEvent: Event = { ...existingEvent, ...eventData };
    this.events.set(id, updatedEvent);
    return updatedEvent;
  }

  async deleteEvent(id: number): Promise<boolean> {
    return this.events.delete(id);
  }

  async getUpcomingEvents(limit?: number): Promise<Event[]> {
    // Get all events, sort by date
    const allEvents = Array.from(this.events.values());
    const sortedEvents = allEvents.sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
    
    return limit ? sortedEvents.slice(0, limit) : sortedEvents;
  }

  async getFeaturedEvents(): Promise<Event[]> {
    return Array.from(this.events.values()).filter(event => event.featured);
  }

  // Photo operations
  async getAllPhotos(): Promise<Photo[]> {
    return Array.from(this.photos.values());
  }

  async getPhoto(id: number): Promise<Photo | undefined> {
    return this.photos.get(id);
  }

  async createPhoto(photo: InsertPhoto): Promise<Photo> {
    const id = this.photoIdCounter++;
    const createdAt = new Date();
    const newPhoto: Photo = { ...photo, id, createdAt };
    this.photos.set(id, newPhoto);
    return newPhoto;
  }

  async deletePhoto(id: number): Promise<boolean> {
    return this.photos.delete(id);
  }

  // Contact message operations
  async getAllContactMessages(): Promise<ContactMessage[]> {
    return Array.from(this.contactMessages.values());
  }

  async getContactMessage(id: number): Promise<ContactMessage | undefined> {
    return this.contactMessages.get(id);
  }

  async createContactMessage(message: InsertContactMessage): Promise<ContactMessage> {
    const id = this.contactMessageIdCounter++;
    const createdAt = new Date();
    const newMessage: ContactMessage = { ...message, id, createdAt, read: false };
    this.contactMessages.set(id, newMessage);
    return newMessage;
  }

  async markContactMessageAsRead(id: number): Promise<boolean> {
    const message = this.contactMessages.get(id);
    if (!message) return false;
    
    message.read = true;
    this.contactMessages.set(id, message);
    return true;
  }

  async deleteContactMessage(id: number): Promise<boolean> {
    return this.contactMessages.delete(id);
  }

  // Special events operations
  async getAllSpecialEvents(): Promise<SpecialEvent[]> {
    return Array.from(this.specialEvents.values());
  }

  async getSpecialEvent(id: number): Promise<SpecialEvent | undefined> {
    return this.specialEvents.get(id);
  }

  async createSpecialEvent(event: InsertSpecialEvent): Promise<SpecialEvent> {
    const id = this.specialEventIdCounter++;
    const newEvent: SpecialEvent = { ...event, id };
    this.specialEvents.set(id, newEvent);
    return newEvent;
  }

  async updateSpecialEvent(id: number, eventData: Partial<InsertSpecialEvent>): Promise<SpecialEvent | undefined> {
    const existingEvent = this.specialEvents.get(id);
    if (!existingEvent) return undefined;
    
    const updatedEvent: SpecialEvent = { ...existingEvent, ...eventData };
    this.specialEvents.set(id, updatedEvent);
    return updatedEvent;
  }

  async deleteSpecialEvent(id: number): Promise<boolean> {
    return this.specialEvents.delete(id);
  }

  // Newsletter subscriber operations
  async getAllSubscribers(): Promise<Subscriber[]> {
    return Array.from(this.subscribers.values());
  }

  async getSubscriberByEmail(email: string): Promise<Subscriber | undefined> {
    return Array.from(this.subscribers.values()).find(
      (subscriber) => subscriber.email === email
    );
  }

  async createSubscriber(subscriber: InsertSubscriber): Promise<Subscriber> {
    // Check if email already exists
    const existingSubscriber = await this.getSubscriberByEmail(subscriber.email);
    if (existingSubscriber) {
      return existingSubscriber;
    }
    
    const id = this.subscriberIdCounter++;
    const createdAt = new Date();
    const newSubscriber: Subscriber = { ...subscriber, id, createdAt };
    this.subscribers.set(id, newSubscriber);
    return newSubscriber;
  }

  async deleteSubscriber(id: number): Promise<boolean> {
    return this.subscribers.delete(id);
  }
}

import { db } from "./db";
import { eq } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

export class DatabaseStorage implements IStorage {
  sessionStore: any; // session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true 
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }

  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined> {
    const [updatedUser] = await db
      .update(users)
      .set(userData)
      .where(eq(users.id, id))
      .returning();
    return updatedUser || undefined;
  }

  async getAllUsers(): Promise<User[]> {
    return db.select().from(users);
  }

  async getAllEvents(): Promise<Event[]> {
    return db.select().from(events);
  }

  async getEvent(id: number): Promise<Event | undefined> {
    const [event] = await db.select().from(events).where(eq(events.id, id));
    return event || undefined;
  }

  async createEvent(event: InsertEvent): Promise<Event> {
    const [newEvent] = await db.insert(events).values(event).returning();
    return newEvent;
  }

  async updateEvent(id: number, eventData: Partial<InsertEvent>): Promise<Event | undefined> {
    const [updatedEvent] = await db
      .update(events)
      .set(eventData)
      .where(eq(events.id, id))
      .returning();
    return updatedEvent || undefined;
  }

  async deleteEvent(id: number): Promise<boolean> {
    await db.delete(events).where(eq(events.id, id));
    return true;
  }

  async getUpcomingEvents(limit?: number): Promise<Event[]> {
    // Implémentation simple pour obtenir les événements à venir
    // Dans une vraie application, vous pourriez vouloir filtrer par date
    const allEvents = await this.getAllEvents();
    const today = new Date().toISOString().split('T')[0];
    const upcomingEvents = allEvents
      .filter(event => event.date >= today)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      
    return limit ? upcomingEvents.slice(0, limit) : upcomingEvents;
  }

  async getFeaturedEvents(): Promise<Event[]> {
    return db.select().from(events).where(eq(events.featured, true));
  }

  async getAllPhotos(): Promise<Photo[]> {
    return db.select().from(photos);
  }

  async getPhoto(id: number): Promise<Photo | undefined> {
    const [photo] = await db.select().from(photos).where(eq(photos.id, id));
    return photo || undefined;
  }

  async createPhoto(photo: InsertPhoto): Promise<Photo> {
    const [newPhoto] = await db.insert(photos).values({
      ...photo,
      createdAt: new Date()
    }).returning();
    return newPhoto;
  }

  async updatePhoto(id: number, photoData: Partial<InsertPhoto>): Promise<Photo | undefined> {
    const [updatedPhoto] = await db
      .update(photos)
      .set(photoData)
      .where(eq(photos.id, id))
      .returning();
    return updatedPhoto || undefined;
  }

  async deletePhoto(id: number): Promise<boolean> {
    await db.delete(photos).where(eq(photos.id, id));
    return true;
  }

  async getAllContactMessages(): Promise<ContactMessage[]> {
    return db.select().from(contactMessages);
  }

  async getContactMessage(id: number): Promise<ContactMessage | undefined> {
    const [message] = await db.select().from(contactMessages).where(eq(contactMessages.id, id));
    return message || undefined;
  }

  async createContactMessage(message: InsertContactMessage): Promise<ContactMessage> {
    const [newMessage] = await db.insert(contactMessages).values({
      ...message,
      createdAt: new Date(),
      read: false
    }).returning();
    return newMessage;
  }

  async markContactMessageAsRead(id: number): Promise<boolean> {
    await db
      .update(contactMessages)
      .set({ read: true })
      .where(eq(contactMessages.id, id));
    return true;
  }

  async deleteContactMessage(id: number): Promise<boolean> {
    await db.delete(contactMessages).where(eq(contactMessages.id, id));
    return true;
  }

  async getAllSpecialEvents(): Promise<SpecialEvent[]> {
    return db.select().from(specialEvents);
  }

  async getSpecialEvent(id: number): Promise<SpecialEvent | undefined> {
    const [event] = await db.select().from(specialEvents).where(eq(specialEvents.id, id));
    return event || undefined;
  }

  async createSpecialEvent(event: InsertSpecialEvent): Promise<SpecialEvent> {
    const [newEvent] = await db.insert(specialEvents).values(event).returning();
    return newEvent;
  }

  async updateSpecialEvent(id: number, eventData: Partial<InsertSpecialEvent>): Promise<SpecialEvent | undefined> {
    const [updatedEvent] = await db
      .update(specialEvents)
      .set(eventData)
      .where(eq(specialEvents.id, id))
      .returning();
    return updatedEvent || undefined;
  }

  async deleteSpecialEvent(id: number): Promise<boolean> {
    await db.delete(specialEvents).where(eq(specialEvents.id, id));
    return true;
  }

  async getAllSubscribers(): Promise<Subscriber[]> {
    return db.select().from(subscribers);
  }

  async getSubscriberByEmail(email: string): Promise<Subscriber | undefined> {
    const [subscriber] = await db.select().from(subscribers).where(eq(subscribers.email, email));
    return subscriber || undefined;
  }

  async createSubscriber(subscriber: InsertSubscriber): Promise<Subscriber> {
    const [newSubscriber] = await db.insert(subscribers).values({
      ...subscriber,
      createdAt: new Date()
    }).returning();
    return newSubscriber;
  }

  async deleteSubscriber(id: number): Promise<boolean> {
    await db.delete(subscribers).where(eq(subscribers.id, id));
    return true;
  }
}

// Utiliser toujours la base de données pour la persistence
export const storage = new DatabaseStorage();

// Fonction pour initialiser les données d'exemple si nécessaire
async function initializeDatabase() {
  // Vérifier si les utilisateurs existent déjà
  const allUsers = await storage.getAllUsers();
  if (allUsers.length === 0) {
    // Créer un utilisateur admin
    await storage.createUser({
      username: "admin",
      password: "$2b$10$hHrVj8R7ZMEpKdxOBjgpPuHCH4jwZ6Ig.IEfP9KeYRzJrQvH6E/5.", // mot de passe: admin123
      isAdmin: true
    });

    // Initialiser des exemples d'événements
    const sampleEvents = [
      {
        title: "Pèlerinage marial",
        description: "Rejoignez-nous pour le pèlerinage annuel dédié à Notre Dame de la Tronchaye. Une journée de prières, de chants et de communion spirituelle.",
        date: "2023-08-15",
        time: "10h00 - 17h00",
        imageUrl: "/pelerinage.webp",
        type: "pilgrimage",
        featured: true
      },
      {
        title: "Concert de musique sacrée",
        description: "Un concert exceptionnel de musique sacrée dans le cadre du sanctuaire. Venez apprécier les œuvres des grands compositeurs.",
        date: "2023-09-10",
        time: "20h30",
        imageUrl: "/concert.webp",
        type: "concert",
        featured: false
      }
    ];

    for (const event of sampleEvents) {
      await storage.createEvent(event);
    }

    // Initialiser des exemples d'événements spéciaux
    const sampleSpecialEvents = [
      {
        title: "Assomption de la Vierge Marie",
        date: "15 août 2023",
        time: "Messes à 8h, 10h30 et 17h"
      },
      {
        title: "Immaculée Conception",
        date: "8 décembre 2023",
        time: "Messes à 9h et 18h"
      }
    ];

    for (const event of sampleSpecialEvents) {
      await storage.createSpecialEvent(event);
    }
    
    // Initialiser des exemples de photos
    const samplePhotos = [
      {
        title: "Sanctuaire Notre Dame de la Tronchaye",
        url: "/IMG_9328.webp"
      },
      {
        title: "Statue de la Vierge",
        url: "/IMG_9300.webp"
      },
      {
        title: "Autel principal",
        url: "/IMG_9298.webp"
      },
      {
        title: "Vitraux colorés",
        url: "/IMG_9309.webp"
      },
      {
        title: "Architecture intérieure",
        url: "/IMG_9303.webp"
      },
      {
        title: "Détails architecturaux",
        url: "/IMG_9302.webp"
      },
      {
        title: "Statuette et ornements",
        url: "/IMG_9305.webp"
      },
      {
        title: "Vue extérieure",
        url: "/Sanctuaire.webp"
      }
    ];

    for (const photo of samplePhotos) {
      await storage.createPhoto(photo);
    }
  }
}

// Initialiser la base de données avec les données d'exemple
initializeDatabase().catch(console.error);
