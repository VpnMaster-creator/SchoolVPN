import { users, type User, type InsertUser, servers, type Server, connectionHistory, type ConnectionHistory } from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getAllServers(): Promise<Server[]>;
  getServer(id: number): Promise<Server | undefined>;
  initializeServers(): Promise<void>;
  
  getConnectionHistory(userId: number): Promise<ConnectionHistory[]>;
  addConnectionHistory(connection: Omit<ConnectionHistory, "id" | "duration" | "disconnectedAt">): Promise<ConnectionHistory>;
  updateConnectionHistory(id: number, disconnectedAt: Date, duration: number, dataUsed: number): Promise<ConnectionHistory | undefined>;
  
  sessionStore: any; // Store type
}

export class DatabaseStorage implements IStorage {
  sessionStore: any; // Store type

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  
  async getAllServers(): Promise<Server[]> {
    const allServers = await db.select().from(servers);
    
    // Initialize servers if none exist
    if (allServers.length === 0) {
      await this.initializeServers();
      return await db.select().from(servers);
    }
    
    return allServers;
  }
  
  async getServer(id: number): Promise<Server | undefined> {
    const [server] = await db.select().from(servers).where(eq(servers.id, id));
    return server;
  }
  
  async getConnectionHistory(userId: number): Promise<ConnectionHistory[]> {
    return await db
      .select()
      .from(connectionHistory)
      .where(eq(connectionHistory.userId, userId))
      .orderBy(desc(connectionHistory.connectedAt));
  }
  
  async addConnectionHistory(
    connection: Omit<ConnectionHistory, "id" | "duration" | "disconnectedAt">
  ): Promise<ConnectionHistory> {
    const [newConnection] = await db
      .insert(connectionHistory)
      .values({
        ...connection,
        disconnectedAt: null,
        duration: null
      })
      .returning();
    
    return newConnection;
  }
  
  async updateConnectionHistory(
    id: number, 
    disconnectedAt: Date, 
    duration: number,
    dataUsed: number
  ): Promise<ConnectionHistory | undefined> {
    const [updatedConnection] = await db
      .update(connectionHistory)
      .set({
        disconnectedAt,
        duration,
        dataUsed
      })
      .where(eq(connectionHistory.id, id))
      .returning();
    
    return updatedConnection;
  }
  
  async initializeServers(): Promise<void> {
    const serverData = [
      {
        name: "New York",
        country: "United States",
        countryCode: "us",
        city: "New York",
        ping: 28,
        load: 65,
        latitude: "40.7128",
        longitude: "-74.0060",
        status: "available"
      },
      {
        name: "Los Angeles",
        country: "United States",
        countryCode: "us",
        city: "Los Angeles",
        ping: 45,
        load: 78,
        latitude: "34.0522",
        longitude: "-118.2437",
        status: "available"
      },
      {
        name: "Toronto",
        country: "Canada",
        countryCode: "ca",
        city: "Toronto",
        ping: 42,
        load: 60,
        latitude: "43.6532",
        longitude: "-79.3832",
        status: "available"
      },
      {
        name: "London",
        country: "United Kingdom",
        countryCode: "gb",
        city: "London",
        ping: 85,
        load: 42,
        latitude: "51.5074",
        longitude: "-0.1278",
        status: "available"
      },
      {
        name: "Paris",
        country: "France",
        countryCode: "fr",
        city: "Paris",
        ping: 90,
        load: 38,
        latitude: "48.8566",
        longitude: "2.3522",
        status: "available"
      },
      {
        name: "Amsterdam",
        country: "Netherlands",
        countryCode: "nl",
        city: "Amsterdam",
        ping: 72,
        load: 35,
        latitude: "52.3676",
        longitude: "4.9041",
        status: "available"
      },
      {
        name: "Tokyo",
        country: "Japan",
        countryCode: "jp",
        city: "Tokyo",
        ping: 180,
        load: 42,
        latitude: "35.6762",
        longitude: "139.6503",
        status: "available"
      },
      {
        name: "Singapore",
        country: "Singapore",
        countryCode: "sg",
        city: "Singapore",
        ping: 190,
        load: 25,
        latitude: "1.3521",
        longitude: "103.8198",
        status: "available"
      },
      {
        name: "Sydney",
        country: "Australia",
        countryCode: "au",
        city: "Sydney",
        ping: 245,
        load: 85,
        latitude: "-33.8688",
        longitude: "151.2093",
        status: "maintenance"
      }
    ];
    
    await db.insert(servers).values(serverData);
  }
}

export const storage = new DatabaseStorage();
