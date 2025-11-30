import { type User, type InsertUser, type InterviewSession, type InsertInterviewSession, type UpdateInterviewSession } from "@shared/schema";
import { randomUUID } from "crypto";
import { db } from "./db";
import { users, interviewSessions } from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  createInterviewSession(session: InsertInterviewSession): Promise<InterviewSession>;
  getInterviewSession(id: number): Promise<InterviewSession | undefined>;
  updateInterviewSession(id: number, session: UpdateInterviewSession): Promise<InterviewSession | undefined>;
  getAllInterviewSessions(): Promise<InterviewSession[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  async createInterviewSession(session: InsertInterviewSession): Promise<InterviewSession> {
    const result = await db.insert(interviewSessions).values(session).returning();
    return result[0];
  }

  async getInterviewSession(id: number): Promise<InterviewSession | undefined> {
    const result = await db.select().from(interviewSessions).where(eq(interviewSessions.id, id)).limit(1);
    return result[0];
  }

  async updateInterviewSession(id: number, session: UpdateInterviewSession): Promise<InterviewSession | undefined> {
    const result = await db
      .update(interviewSessions)
      .set({ ...session, updatedAt: new Date() })
      .where(eq(interviewSessions.id, id))
      .returning();
    return result[0];
  }

  async getAllInterviewSessions(): Promise<InterviewSession[]> {
    return await db.select().from(interviewSessions).orderBy(desc(interviewSessions.createdAt));
  }
}

export const storage = new DatabaseStorage();
