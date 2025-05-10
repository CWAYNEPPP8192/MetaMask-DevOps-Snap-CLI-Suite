import { useState, useCallback } from "react";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";

interface CommandHistoryEntry {
  command: string;
  output: string;
}

export function useTerminal() {
  const [commandHistory, setCommandHistory] = useState<CommandHistoryEntry[]>([]);
  const [commandInput, setCommandInput] = useState("");

  const executeCommand = useCallback(async (command: string, projectId: number) => {
    try {
      // Add command to history immediately with empty output
      setCommandHistory(prev => [...prev, { command, output: "Executing command..." }]);
      
      // Execute command via API
      const response = await apiRequest("POST", "/api/execute", {
        command,
        projectId,
      });
      
      const result = await response.json();
      
      // Update command history with result
      setCommandHistory(prev => {
        const newHistory = [...prev];
        newHistory[newHistory.length - 1] = {
          command,
          output: result.output || "Command executed with no output",
        };
        return newHistory;
      });

      // If this was a deploy command that created a transaction,
      // refresh the pending transactions
      if (command.includes("deploy")) {
        queryClient.invalidateQueries({ queryKey: ["/api/transactions/pending"] });
      }
      
      return result;
    } catch (error) {
      setCommandHistory(prev => {
        const newHistory = [...prev];
        newHistory[newHistory.length - 1] = {
          command,
          output: `Error: ${error instanceof Error ? error.message : String(error)}`,
        };
        return newHistory;
      });
      
      console.error("Command execution failed:", error);
      return { output: `Error: ${error instanceof Error ? error.message : String(error)}`, exitCode: 1 };
    }
  }, []);

  return { commandHistory, executeCommand, commandInput, setCommandInput };
}
