import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer } from "ws";
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
        const contractName = command.includes("defi") ? "DeFiProtocol" : "TokenContract";
        
        await storage.createTransactionRequest({
          type: "deploy",
          status: "pending",
          details: `Deploy ${contractName} to ${network}`,
          gasLimit: "1,245,678",
          gasPrice: "5 Gwei",
          network,
          contractName,
          projectId,
        });
      } else if (command.includes("verify")) {
        output = "Verifying contract on block explorer...\nPreparing contract source code...\nSubmitting verification request...\n✓ Contract successfully verified";
      } else if (command.includes("monitor")) {
        output = "Starting DeFi protocol monitoring...\nConnecting to on-chain data providers...\n✓ Connected to Ethereum mainnet\n✓ Connected to liquidity pools\nMonitoring active - transaction notifications enabled";
      } else if (command.includes("analyze")) {
        output = "Analyzing risk profile for DeFi protocol...\nChecking security vulnerabilities...\n✓ No critical vulnerabilities found\n⚠ Medium risk: Oracle dependency identified\nAnalyzing gas efficiency...\n✓ Gas optimization opportunities found\nGenerating report...";
      } else if (command.includes("cross-chain")) {
        output = "Setting up cross-chain monitoring...\nConnecting to multiple networks:\n✓ Ethereum mainnet connected\n✓ Polygon connected\n✓ Arbitrum connected\n✓ Optimism connected\nCross-chain transaction monitoring active";
      } else if (command.includes("help")) {
        output = "Available commands:\n- mm-snap build: Build your project\n- mm-snap test: Run your test suite\n- mm-snap deploy --network <network>: Deploy contracts to the specified network\n- mm-snap verify --network <network>: Verify contract source code on block explorer\n- mm-snap monitor --defi: Monitor DeFi protocol for events and transactions\n- mm-snap analyze --security: Perform risk analysis on smart contracts\n- mm-snap cross-chain --setup: Configure cross-chain transaction monitoring";
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

  // DeFi specific endpoints
  // Get real-time protocol metrics
  app.get("/api/defi/metrics", async (req, res) => {
    try {
      // In a real implementation, this would fetch data from on-chain sources
      // For demo purposes, we'll return sample data
      res.json({
        tvl: "$542,891,245",
        dailyVolume: "$12,458,903",
        uniqueUsers: 8743,
        gasSpent: "245 ETH",
        protocols: [
          { name: "Lending Protocol", tvl: "$245,670,123", apy: "4.2%" },
          { name: "DEX", tvl: "$187,451,803", volume: "$8,903,457" },
          { name: "Yield Aggregator", tvl: "$109,769,319", apy: "7.8%" }
        ]
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch DeFi metrics" });
    }
  });

  // Get cross-chain transaction status
  app.get("/api/cross-chain/status", async (req, res) => {
    try {
      res.json({
        pendingBridges: 2,
        completedBridges: 18,
        chains: [
          { name: "Ethereum", status: "Connected", blockHeight: 17825461 },
          { name: "Polygon", status: "Connected", blockHeight: 46782513 },
          { name: "Arbitrum", status: "Connected", blockHeight: 123784521 },
          { name: "Optimism", status: "Connected", blockHeight: 87654321 }
        ]
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cross-chain status" });
    }
  });

  // Get security analysis for smart contracts
  app.get("/api/security/analysis", async (req, res) => {
    try {
      res.json({
        totalContracts: 8,
        vulnerabilities: {
          critical: 0,
          high: 1,
          medium: 3,
          low: 5
        },
        lastScan: "2023-05-09T15:30:00Z",
        recommendations: [
          "Update oracle implementation to prevent price manipulation",
          "Add time-delay to admin functions",
          "Implement circuit breaker for large withdrawals"
        ]
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch security analysis" });
    }
  });

  const httpServer = createServer(app);

  // Set up WebSocket server for real-time notifications
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  wss.on('connection', (ws) => {
    console.log('WebSocket client connected');
    
    // Send initial welcome message
    ws.send(JSON.stringify({
      type: 'connection',
      message: 'Connected to MetaMask DevOps Snap WebSocket Server',
      timestamp: new Date().toISOString()
    }));
    
    // Set up interval to send DeFi notifications periodically (simulating real-time events)
    const interval = setInterval(() => {
      if (ws.readyState === ws.OPEN) {
        const notifications = [
          {
            type: 'defi-alert',
            severity: 'info',
            message: 'Liquidity pool ratio changed: ETH/USDC now at 70/30',
            timestamp: new Date().toISOString()
          },
          {
            type: 'price-alert',
            severity: 'warning',
            message: 'ETH price down 5% in last hour',
            timestamp: new Date().toISOString()
          },
          {
            type: 'security-alert',
            severity: 'critical',
            message: 'Unusual transaction volume detected in lending pool',
            timestamp: new Date().toISOString()
          },
          {
            type: 'gas-alert',
            severity: 'info',
            message: 'Gas prices rising. Consider delaying non-critical transactions',
            timestamp: new Date().toISOString()
          },
          {
            type: 'cross-chain',
            severity: 'info',
            message: 'Cross-chain transaction confirmed on destination chain',
            timestamp: new Date().toISOString()
          }
        ];
        
        // Send a random notification
        const randomNotification = notifications[Math.floor(Math.random() * notifications.length)];
        ws.send(JSON.stringify(randomNotification));
      }
    }, 15000); // Send a notification every 15 seconds
    
    // Clean up on connection close
    ws.on('close', () => {
      console.log('WebSocket client disconnected');
      clearInterval(interval);
    });
  });

  return httpServer;
}
