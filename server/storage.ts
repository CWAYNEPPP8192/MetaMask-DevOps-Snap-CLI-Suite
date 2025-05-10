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

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private projects: Map<number, Project>;
  private commands: Map<number, Command>;
  private commandHistories: Map<number, CommandHistory>;
  private transactionRequests: Map<number, TransactionRequest>;
  
  private userId: number;
  private projectId: number;
  private commandId: number;
  private commandHistoryId: number;
  private transactionRequestId: number;

  constructor() {
    this.users = new Map();
    this.projects = new Map();
    this.commands = new Map();
    this.commandHistories = new Map();
    this.transactionRequests = new Map();
    
    this.userId = 1;
    this.projectId = 1;
    this.commandId = 1;
    this.commandHistoryId = 1;
    this.transactionRequestId = 1;
    
    // Add sample data
    this.initSampleData();
  }
  
  private initSampleData() {
    // Create a sample user
    const user: User = { 
      id: this.userId++, 
      username: 'developer', 
      password: 'password123' 
    };
    this.users.set(user.id, user);
    
    // Create sample projects
    const ethereumDapp: Project = {
      id: this.projectId++,
      name: 'Ethereum DApp',
      path: '/projects/ethereum-dapp',
      framework: 'Hardhat',
      lastBuild: new Date(Date.now() - 24 * 60 * 60 * 1000),
      userId: user.id
    };
    
    const defiProtocol: Project = {
      id: this.projectId++,
      name: 'DeFi Lending Protocol',
      path: '/projects/defi-lending',
      framework: 'Foundry',
      lastBuild: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      userId: user.id
    };
    
    const nftMarketplace: Project = {
      id: this.projectId++,
      name: 'NFT Marketplace',
      path: '/projects/nft-marketplace',
      framework: 'Truffle',
      lastBuild: null,
      userId: user.id
    };
    
    const crossChainBridge: Project = {
      id: this.projectId++,
      name: 'Cross-Chain Bridge',
      path: '/projects/cross-chain',
      framework: 'Hardhat',
      lastBuild: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      userId: user.id
    };
    
    this.projects.set(ethereumDapp.id, ethereumDapp);
    this.projects.set(defiProtocol.id, defiProtocol);
    this.projects.set(nftMarketplace.id, nftMarketplace);
    this.projects.set(crossChainBridge.id, crossChainBridge);
    
    // Create sample commands for each project
    [ethereumDapp, defiProtocol, nftMarketplace, crossChainBridge].forEach(project => {
      // Standard commands
      const buildCommand: Command = {
        id: this.commandId++,
        command: 'mm-snap build',
        description: 'Build the project',
        projectId: project.id
      };
      
      const testCommand: Command = {
        id: this.commandId++,
        command: 'mm-snap test',
        description: 'Run the test suite',
        projectId: project.id
      };
      
      const deployTestnetCommand: Command = {
        id: this.commandId++,
        command: 'mm-snap deploy --network testnet',
        description: 'Deploy to testnet',
        projectId: project.id
      };
      
      const deployMainnetCommand: Command = {
        id: this.commandId++,
        command: 'mm-snap deploy --network mainnet',
        description: 'Deploy to mainnet',
        projectId: project.id
      };
      
      this.commands.set(buildCommand.id, buildCommand);
      this.commands.set(testCommand.id, testCommand);
      this.commands.set(deployTestnetCommand.id, deployTestnetCommand);
      this.commands.set(deployMainnetCommand.id, deployMainnetCommand);
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Project methods
  async getAllProjects(): Promise<Project[]> {
    return Array.from(this.projects.values());
  }
  
  async getProject(id: number): Promise<Project | undefined> {
    return this.projects.get(id);
  }
  
  async createProject(project: InsertProject): Promise<Project> {
    const id = this.projectId++;
    const newProject: Project = { 
      ...project, 
      id,
      lastBuild: null
    };
    this.projects.set(id, newProject);
    return newProject;
  }
  
  // Command methods
  async getCommandsByProject(projectId: number): Promise<Command[]> {
    return Array.from(this.commands.values()).filter(cmd => cmd.projectId === projectId);
  }
  
  async createCommand(command: InsertCommand): Promise<Command> {
    const id = this.commandId++;
    const newCommand: Command = { ...command, id };
    this.commands.set(id, newCommand);
    return newCommand;
  }
  
  // Command history methods
  async getCommandHistoryByProject(projectId: number): Promise<CommandHistory[]> {
    return Array.from(this.commandHistories.values())
      .filter(history => history.projectId === projectId)
      .sort((a, b) => {
        const dateA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
        const dateB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
        return dateB - dateA; // Sort by most recent first
      });
  }
  
  async createCommandHistory(history: InsertCommandHistory): Promise<CommandHistory> {
    const id = this.commandHistoryId++;
    const timestamp = new Date();
    
    // Ensure we have values for all required fields
    const newHistory: CommandHistory = { 
      id, 
      timestamp, 
      command: history.command,
      projectId: history.projectId,
      output: history.output || "",
      exitCode: history.exitCode || 0
    };
    
    this.commandHistories.set(id, newHistory);
    return newHistory;
  }
  
  // Transaction request methods
  async getPendingTransactionRequests(): Promise<TransactionRequest[]> {
    return Array.from(this.transactionRequests.values())
      .filter(tx => tx.status === "pending")
      .sort((a, b) => {
        const dateA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
        const dateB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
        return dateB - dateA; // Sort by most recent first
      });
  }
  
  async createTransactionRequest(transaction: InsertTransactionRequest): Promise<TransactionRequest> {
    const id = this.transactionRequestId++;
    const timestamp = new Date();
    
    // Ensure we have values for all required fields
    const newTransaction: TransactionRequest = {
      id,
      timestamp,
      type: transaction.type,
      status: transaction.status,
      details: transaction.details,
      network: transaction.network,
      projectId: transaction.projectId,
      gasLimit: transaction.gasLimit || "",
      gasPrice: transaction.gasPrice || "",
      contractName: transaction.contractName || ""
    };
    
    this.transactionRequests.set(id, newTransaction);
    return newTransaction;
  }
  
  async updateTransactionStatus(id: number, status: string): Promise<TransactionRequest> {
    const transaction = this.transactionRequests.get(id);
    if (!transaction) {
      throw new Error(`Transaction with id ${id} not found`);
    }
    
    const updatedTransaction: TransactionRequest = { ...transaction, status };
    this.transactionRequests.set(id, updatedTransaction);
    return updatedTransaction;
  }
}

export const storage = new MemStorage();
