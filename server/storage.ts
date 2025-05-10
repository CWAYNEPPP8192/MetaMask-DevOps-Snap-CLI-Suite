import { 
  users, 
  projects, 
  commands, 
  commandHistory, 
  transactionRequests,
  type User, 
  type InsertUser,
  type Project,
  type InsertProject,
  type Command,
  type InsertCommand,
  type CommandHistory,
  type InsertCommandHistory,
  type TransactionRequest,
  type InsertTransactionRequest
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Project methods
  getAllProjects(): Promise<Project[]>;
  getProject(id: number): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  
  // Command methods
  getCommandsByProject(projectId: number): Promise<Command[]>;
  createCommand(command: InsertCommand): Promise<Command>;
  
  // Command history methods
  getCommandHistoryByProject(projectId: number): Promise<CommandHistory[]>;
  createCommandHistory(history: InsertCommandHistory): Promise<CommandHistory>;
  
  // Transaction request methods
  getPendingTransactionRequests(): Promise<TransactionRequest[]>;
  createTransactionRequest(transaction: InsertTransactionRequest): Promise<TransactionRequest>;
  updateTransactionStatus(id: number, status: string): Promise<TransactionRequest>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }
  
  // Project methods
  async getAllProjects(): Promise<Project[]> {
    return db.select().from(projects);
  }
  
  async getProject(id: number): Promise<Project | undefined> {
    const result = await db.select().from(projects).where(eq(projects.id, id));
    return result[0];
  }
  
  async createProject(project: InsertProject): Promise<Project> {
    const result = await db.insert(projects).values(project).returning();
    return result[0];
  }
  
  // Command methods
  async getCommandsByProject(projectId: number): Promise<Command[]> {
    return db.select().from(commands).where(eq(commands.projectId, projectId));
  }
  
  async createCommand(command: InsertCommand): Promise<Command> {
    const result = await db.insert(commands).values(command).returning();
    return result[0];
  }
  
  // Command history methods
  async getCommandHistoryByProject(projectId: number): Promise<CommandHistory[]> {
    return db
      .select()
      .from(commandHistory)
      .where(eq(commandHistory.projectId, projectId))
      .orderBy(desc(commandHistory.timestamp));
  }
  
  async createCommandHistory(history: InsertCommandHistory): Promise<CommandHistory> {
    // Ensure we have values for all required fields
    const historyToInsert = {
      command: history.command,
      projectId: history.projectId,
      output: history.output || "",
      exitCode: history.exitCode || 0
    };
    
    const result = await db.insert(commandHistory).values(historyToInsert).returning();
    return result[0];
  }
  
  // Transaction request methods
  async getPendingTransactionRequests(): Promise<TransactionRequest[]> {
    return db
      .select()
      .from(transactionRequests)
      .where(eq(transactionRequests.status, "pending"))
      .orderBy(desc(transactionRequests.timestamp));
  }
  
  async createTransactionRequest(transaction: InsertTransactionRequest): Promise<TransactionRequest> {
    // Ensure we have values for all required fields
    const transactionToInsert = {
      type: transaction.type,
      status: transaction.status,
      details: transaction.details,
      network: transaction.network,
      projectId: transaction.projectId,
      gasLimit: transaction.gasLimit || "",
      gasPrice: transaction.gasPrice || "",
      contractName: transaction.contractName || ""
    };
    
    const result = await db.insert(transactionRequests).values(transactionToInsert).returning();
    return result[0];
  }
  
  async updateTransactionStatus(id: number, status: string): Promise<TransactionRequest> {
    const result = await db
      .update(transactionRequests)
      .set({ status })
      .where(eq(transactionRequests.id, id))
      .returning();
    
    if (result.length === 0) {
      throw new Error(`Transaction with id ${id} not found`);
    }
    
    return result[0];
  }

  // Initialize the database with sample data if needed
  async initSampleData(): Promise<void> {
    // Check if we have any projects already
    const existingProjects = await db.select().from(projects);
    if (existingProjects.length > 0) {
      return; // Skip initialization if data already exists
    }

    // Create a sample user
    const [user] = await db.insert(users).values({
      username: 'developer',
      password: 'password123'
    }).returning();

    // Create sample projects
    const [ethereumDapp] = await db.insert(projects).values({
      name: 'Ethereum DApp',
      path: '/projects/ethereum-dapp',
      framework: 'Hardhat',
      lastBuild: new Date(Date.now() - 24 * 60 * 60 * 1000),
      userId: user.id
    }).returning();
    
    const [defiProtocol] = await db.insert(projects).values({
      name: 'DeFi Lending Protocol',
      path: '/projects/defi-lending',
      framework: 'Foundry',
      lastBuild: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      userId: user.id
    }).returning();
    
    const [nftMarketplace] = await db.insert(projects).values({
      name: 'NFT Marketplace',
      path: '/projects/nft-marketplace',
      framework: 'Truffle',
      lastBuild: null,
      userId: user.id
    }).returning();
    
    const [crossChainBridge] = await db.insert(projects).values({
      name: 'Cross-Chain Bridge',
      path: '/projects/cross-chain',
      framework: 'Hardhat',
      lastBuild: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      userId: user.id
    }).returning();

    // Create standard commands for each project
    const projectList = [ethereumDapp, defiProtocol, nftMarketplace, crossChainBridge];
    
    for (const project of projectList) {
      await db.insert(commands).values([
        {
          command: 'mm-snap build',
          description: 'Build the project',
          projectId: project.id
        },
        {
          command: 'mm-snap test',
          description: 'Run the test suite',
          projectId: project.id
        },
        {
          command: 'mm-snap deploy --network testnet',
          description: 'Deploy to testnet',
          projectId: project.id
        },
        {
          command: 'mm-snap deploy --network mainnet',
          description: 'Deploy to mainnet',
          projectId: project.id
        }
      ]);
    }
  }
}

// Initialize database storage
export const storage = new DatabaseStorage();
