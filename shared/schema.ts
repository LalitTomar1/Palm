import { pgTable, text, timestamp, uuid, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  username: text("username").unique().notNull(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const palmAnalyses = pgTable("palm_analyses", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id),
  imageData: text("image_data").notNull(),
  status: text("status", { enum: ["processing", "completed", "error"] }).notNull().default("processing"),
  progress: integer("progress").notNull().default(0),
  result: jsonb("result"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
export const insertPalmAnalysisSchema = createInsertSchema(palmAnalyses);
export const selectPalmAnalysisSchema = createSelectSchema(palmAnalyses);

export type User = z.infer<typeof selectUserSchema>;
export type PalmAnalysis = z.infer<typeof selectPalmAnalysisSchema>;