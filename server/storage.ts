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
      password: "$2a$10$Qr0TLEUyTymPNOx6EFidzuKqAZZMf9TE1KJ9jZzTayc4S9JoEKLe.", // "password"
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
      title: "Façade du sanctuaire",
      url: "https://images.unsplash.com/photo-1548743897-cd4114d6432b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80"
    });
    
    this.createPhoto({
      title: "Autel du sanctuaire",
      url: "https://images.unsplash.com/photo-1513031300226-c8fb12de9ade?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80"
    });
    
    this.createPhoto({
      title: "Vitrail",
      url: "https://images.unsplash.com/photo-1543599723-86e82f3bae11?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80"
    });
    
    this.createPhoto({
      title: "Statue de la Vierge",
      url: "https://images.unsplash.com/photo-1519335337423-a3357c1cd5e5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80"
    });
    
    this.createPhoto({
      title: "Procession mariale",
      url: "https://images.unsplash.com/photo-1544911845-1f34a3eb46b1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80"
    });
    
    this.createPhoto({
      title: "Décoration florale",
      url: "https://images.unsplash.com/photo-1565409144664-c0ec50d42497?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80"
    });
    
    this.createPhoto({
      title: "Coucher de soleil sur le sanctuaire",
      url: "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80"
    });
    
    this.createPhoto({
      title: "Détail architectural",
      url: "https://images.unsplash.com/photo-1481142889578-dda440dacfe1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80"
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

export const storage = new MemStorage();
