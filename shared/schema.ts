import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  path: text("path").notNull(),
  framework: text("framework").notNull(),
  lastBuild: timestamp("last_build"),
  userId: integer("user_id").notNull(),
});

export const commands = pgTable("commands", {
  id: serial("id").primaryKey(),
  command: text("command").notNull(),
  description: text("description").notNull(),
  projectId: integer("project_id").notNull(),
});

export const commandHistory = pgTable("command_history", {
  id: serial("id").primaryKey(),
  command: text("command").notNull(),
  output: text("output").notNull().default(""),
  exitCode: integer("exit_code").notNull().default(0),
  timestamp: timestamp("timestamp").defaultNow(),
  projectId: integer("project_id").notNull(),
});

export const transactionRequests = pgTable("transaction_requests", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(),
  status: text("status").notNull(),
  details: text("details").notNull(),
  gasLimit: text("gas_limit").notNull().default(""),
  gasPrice: text("gas_price").notNull().default(""),
  network: text("network").notNull(),
  contractName: text("contract_name").notNull().default(""),
  timestamp: timestamp("timestamp").defaultNow(),
  projectId: integer("project_id").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertProjectSchema = createInsertSchema(projects).pick({
  name: true,
  path: true,
  framework: true,
  userId: true,
});

export const insertCommandSchema = createInsertSchema(commands).pick({
  command: true,
  description: true,
  projectId: true,
});

export const insertCommandHistorySchema = createInsertSchema(commandHistory).pick({
  command: true,
  output: true,
  exitCode: true,
  projectId: true,
});

export const insertTransactionRequestSchema = createInsertSchema(transactionRequests).pick({
  type: true,
  status: true,
  details: true,
  gasLimit: true,
  gasPrice: true,
  network: true,
  contractName: true,
  projectId: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;

export type InsertCommand = z.infer<typeof insertCommandSchema>;
export type Command = typeof commands.$inferSelect;

export type InsertCommandHistory = z.infer<typeof insertCommandHistorySchema>;
export type CommandHistory = typeof commandHistory.$inferSelect;

export type InsertTransactionRequest = z.infer<typeof insertTransactionRequestSchema>;
export type TransactionRequest = typeof transactionRequests.$inferSelect;
