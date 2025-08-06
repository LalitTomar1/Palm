import { drizzle } from "drizzle-orm/neon-serverless";
import { neon } from "@neondatabase/serverless";
import { palmAnalyses, type PalmAnalysis } from "../shared/schema.js";
import { eq } from "drizzle-orm";

export interface IStorage {
  createPalmAnalysis(data: Partial<PalmAnalysis>): Promise<PalmAnalysis>;
  getPalmAnalysis(id: string): Promise<PalmAnalysis | null>;
  updatePalmAnalysis(id: string, data: Partial<PalmAnalysis>): Promise<PalmAnalysis | null>;
}

// In-memory storage for development
class MemStorage implements IStorage {
  private analyses = new Map<string, PalmAnalysis>();

  async createPalmAnalysis(data: Partial<PalmAnalysis>): Promise<PalmAnalysis> {
    const id = crypto.randomUUID();
    const analysis: PalmAnalysis = {
      id,
      userId: null,
      imageData: data.imageData || '',
      status: data.status || 'processing',
      progress: data.progress || 0,
      result: data.result || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    this.analyses.set(id, analysis);
    return analysis;
  }

  async getPalmAnalysis(id: string): Promise<PalmAnalysis | null> {
    return this.analyses.get(id) || null;
  }

  async updatePalmAnalysis(id: string, data: Partial<PalmAnalysis>): Promise<PalmAnalysis | null> {
    const existing = this.analyses.get(id);
    if (!existing) return null;

    const updated: PalmAnalysis = {
      ...existing,
      ...data,
      updatedAt: new Date(),
    };
    
    this.analyses.set(id, updated);
    return updated;
  }
}

// PostgreSQL storage for production
class DbStorage implements IStorage {
  private db;

  constructor() {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL environment variable is required");
    }
    
    const sql = neon(process.env.DATABASE_URL);
    this.db = drizzle(sql);
  }

  async createPalmAnalysis(data: Partial<PalmAnalysis>): Promise<PalmAnalysis> {
    const [analysis] = await this.db
      .insert(palmAnalyses)
      .values({
        imageData: data.imageData || '',
        status: data.status || 'processing',
        progress: data.progress || 0,
        result: data.result || null,
      })
      .returning();
    
    return analysis;
  }

  async getPalmAnalysis(id: string): Promise<PalmAnalysis | null> {
    const [analysis] = await this.db
      .select()
      .from(palmAnalyses)
      .where(eq(palmAnalyses.id, id))
      .limit(1);
    
    return analysis || null;
  }

  async updatePalmAnalysis(id: string, data: Partial<PalmAnalysis>): Promise<PalmAnalysis | null> {
    const [analysis] = await this.db
      .update(palmAnalyses)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(palmAnalyses.id, id))
      .returning();
    
    return analysis || null;
  }
}

export function createStorage(): IStorage {
  // Use in-memory storage for development, database for production
  if (process.env.NODE_ENV === 'development' || !process.env.DATABASE_URL) {
    console.log('Using in-memory storage for development');
    return new MemStorage();
  }
  
  console.log('Using PostgreSQL storage');
  return new DbStorage();
}