import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProjectSchema, insertCommandSchema, insertTransactionRequestSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all projects
  app.get("/api/projects", async (req, res) => {
    try {
      const projects = await storage.getAllProjects();
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  // Get a single project by ID
  app.get("/api/projects/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const project = await storage.getProject(id);
      
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      res.json(project);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch project" });
    }
  });

  // Create a new project
  app.post("/api/projects", async (req, res) => {
    try {
      const newProject = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(newProject);
      res.status(201).json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid project data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create project" });
    }
  });

  // Get quick commands for a project
  app.get("/api/projects/:id/commands", async (req, res) => {
    try {
      const projectId = parseInt(req.params.id);
      const commands = await storage.getCommandsByProject(projectId);
      res.json(commands);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch commands" });
    }
  });

  // Add a command to a project
  app.post("/api/projects/:id/commands", async (req, res) => {
    try {
      const projectId = parseInt(req.params.id);
      const command = insertCommandSchema.parse({
        ...req.body,
        projectId,
      });
      
      const newCommand = await storage.createCommand(command);
      res.status(201).json(newCommand);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid command data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create command" });
    }
  });

  // Execute a command
  app.post("/api/execute", async (req, res) => {
    try {
      const { command, projectId } = req.body;
      
      if (!command || !projectId) {
        return res.status(400).json({ message: "Command and project ID are required" });
      }

      // This is where the actual command execution would occur
      // For now, we'll just return a mocked result based on the command
      let output = "";
      let exitCode = 0;

      if (command.includes("build")) {
        output = "Building project...\nInstalling dependencies...\n✓ Dependencies installed successfully\nCompiling contracts...\n✓ 3 contracts compiled successfully\nBuilding frontend...\n✓ Frontend build complete\n✓ Build completed successfully in 4.2s";
      } else if (command.includes("test")) {
        output = "Running test suite...\n✓ Contract: Token - 8 passing\n✓ Contract: Marketplace - 12 passing\n⚠ Contract: Auction - 9 passing, 1 pending\n✓ All tests passed! (29 passing, 1 pending)";
      } else if (command.includes("deploy")) {
        output = "Preparing deployment...\n⚠ Deployment requires transaction signing\nTransaction details:\n- Contract: TokenContract\n- Estimated gas: 1,245,678\n- Gas price: 5 Gwei\nAwaiting signature approval in MetaMask...";
        
        // Create a transaction request
        const network = command.includes("testnet") ? "testnet" : "mainnet";
        await storage.createTransactionRequest({
          type: "deploy",
          status: "pending",
          details: "Contract deployment",
          gasLimit: "1,245,678",
          gasPrice: "5 Gwei",
          network,
          contractName: "TokenContract",
          projectId,
        });
      } else if (command.includes("verify")) {
        output = "Verifying contract on block explorer...\nPreparing contract source code...\nSubmitting verification request...\n✓ Contract successfully verified";
      } else if (command.includes("help")) {
        output = "Available commands:\n- mm-snap build: Build your project\n- mm-snap test: Run your test suite\n- mm-snap deploy --network <network>: Deploy contracts to the specified network\n- mm-snap verify --network <network>: Verify contract source code on block explorer";
      } else {
        output = `Unknown command: ${command}\nType 'mm-snap help' for a list of available commands`;
        exitCode = 1;
      }

      // Save command history
      await storage.createCommandHistory({
        command,
        output,
        exitCode,
        projectId,
      });

      res.json({ output, exitCode });
    } catch (error) {
      res.status(500).json({ message: "Failed to execute command" });
    }
  });

  // Get pending transaction requests
  app.get("/api/transactions/pending", async (req, res) => {
    try {
      const transactions = await storage.getPendingTransactionRequests();
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch pending transactions" });
    }
  });

  // Update transaction status
  app.put("/api/transactions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!status) {
        return res.status(400).json({ message: "Status is required" });
      }
      
      const transaction = await storage.updateTransactionStatus(id, status);
      res.json(transaction);
    } catch (error) {
      res.status(500).json({ message: "Failed to update transaction" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
