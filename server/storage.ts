import {
  users, User, InsertUser,
  events, Event, InsertEvent,
  photos, Photo, InsertPhoto,
  contactMessages, ContactMessage, InsertContactMessage,
  specialEvents, SpecialEvent, InsertSpecialEvent,
  subscribers, Subscriber, InsertSubscriber,
} from "@shared/schema";
import { db, pool } from "./db";
import { eq } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";

const PostgresSessionStore = connectPg(session);

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

export const storage = new DatabaseStorage();

// Seeds events and photos if the events table is empty.
// Admin user creation is handled separately by bootstrap.ts.
export async function seedSampleContentIfEmpty(): Promise<void> {
  const existingEvents = await storage.getAllEvents();
  if (existingEvents.length > 0) {
    return;
  }

  const sampleEvents = [
    {
      title: "Pèlerinage marial",
      description: "Rejoignez-nous pour le pèlerinage annuel dédié à Notre Dame de la Tronchaye. Une journée de prières, de chants et de communion spirituelle.",
      date: "2023-08-15",
      time: "10h00 - 17h00",
      imageUrl: "/pelerinage.webp",
      type: "pilgrimage",
      featured: true,
    },
    {
      title: "Concert de musique sacrée",
      description: "Un concert exceptionnel de musique sacrée dans le cadre du sanctuaire. Venez apprécier les œuvres des grands compositeurs.",
      date: "2023-09-10",
      time: "20h30",
      imageUrl: "/concert.webp",
      type: "concert",
      featured: false,
    },
  ];
  for (const event of sampleEvents) {
    await storage.createEvent(event);
  }

  const sampleSpecialEvents = [
    { title: "Assomption de la Vierge Marie", date: "15 août 2023", time: "Messes à 8h, 10h30 et 17h" },
    { title: "Immaculée Conception", date: "8 décembre 2023", time: "Messes à 9h et 18h" },
  ];
  for (const event of sampleSpecialEvents) {
    await storage.createSpecialEvent(event);
  }

  const samplePhotos = [
    { title: "Sanctuaire Notre Dame de la Tronchaye", url: "/IMG_9328.webp" },
    { title: "Statue de la Vierge", url: "/IMG_9300.webp" },
    { title: "Autel principal", url: "/IMG_9298.webp" },
    { title: "Vitraux colorés", url: "/IMG_9309.webp" },
    { title: "Architecture intérieure", url: "/IMG_9303.webp" },
    { title: "Détails architecturaux", url: "/IMG_9302.webp" },
    { title: "Statuette et ornements", url: "/IMG_9305.webp" },
    { title: "Vue extérieure", url: "/Sanctuaire.webp" },
  ];
  for (const photo of samplePhotos) {
    await storage.createPhoto(photo);
  }
}
