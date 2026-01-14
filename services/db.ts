
import { BrandIdentity, Persona, UserProfile, ActivityItem } from "../types";

const DB_NAME = 'BrandArcade_shivam_ai';
const DB_VERSION = 2;

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  brand?: BrandIdentity;
  profile?: UserProfile;
  personas?: Persona[];
  activities?: ActivityItem[];
  progress: number;
  avatarUrl?: string;
  lastLogin: number;
}

class Database {
  private db: IDBDatabase | null = null;

  async open(): Promise<IDBDatabase> {
    if (this.db) return this.db;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(new Error("Failed to open IndexedDB"));
      
      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        if (!db.objectStoreNames.contains('users')) {
          const userStore = db.createObjectStore('users', { keyPath: 'id' });
          userStore.createIndex('email', 'email', { unique: true });
        }
        
        if (!db.objectStoreNames.contains('content')) {
          db.createObjectStore('content', { keyPath: 'id', autoIncrement: true });
        }
      };
    });
  }

  private async hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  async findUserByEmail(email: string): Promise<UserRecord | null> {
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['users'], 'readonly');
      const store = transaction.objectStore('users');
      const index = store.index('email');
      const request = index.get(email.toLowerCase());

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  async validateUser(email: string, pass: string): Promise<UserRecord | null> {
    const user = await this.findUserByEmail(email);
    if (!user) return null;
    
    const hash = await this.hashPassword(pass);
    if (user.passwordHash === hash) {
      // Update last login
      await this.updateUser(user.id, { lastLogin: Date.now() });
      return user;
    }
    return null;
  }

  async registerUser(email: string, name: string, pass: string): Promise<UserRecord> {
    const existing = await this.findUserByEmail(email);
    if (existing) throw new Error("Identity node already exists on network.");

    const db = await this.open();
    const hash = await this.hashPassword(pass);
    
    const newUser: UserRecord = {
      id: crypto.randomUUID(),
      name,
      email: email.toLowerCase(),
      passwordHash: hash,
      progress: 0,
      activities: [],
      lastLogin: Date.now()
    };

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['users'], 'readwrite');
      const store = transaction.objectStore('users');
      const request = store.add(newUser);

      request.onsuccess = () => resolve(newUser);
      request.onerror = () => reject(request.error);
    });
  }

  async updateUser(id: string, updates: Partial<UserRecord>): Promise<void> {
    const db = await this.open();
    const user = await this.getUser(id);
    if (!user) return;

    const updatedUser = { ...user, ...updates };

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['users'], 'readwrite');
      const store = transaction.objectStore('users');
      const request = store.put(updatedUser);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getUser(id: string): Promise<UserRecord | null> {
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['users'], 'readonly');
      const store = transaction.objectStore('users');
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }
}

export const db = new Database();
