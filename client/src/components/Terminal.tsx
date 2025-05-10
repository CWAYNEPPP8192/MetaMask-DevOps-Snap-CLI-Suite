import React, { useState, useRef, useEffect } from "react";
import { useProject } from "@/hooks/useProject";
import { useTerminal } from "@/hooks/useTerminal";

interface TerminalProps {
  activeTab: string;
}

const Terminal: React.FC<TerminalProps> = ({ activeTab }) => {
  const [activeTerminalTab, setActiveTerminalTab] = useState("cli");
  const { selectedProject } = useProject();
  const { commandHistory, executeCommand, commandInput, setCommandInput } = useTerminal();
  const outputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll terminal output to bottom
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [commandHistory]);

  // Focus input on terminal click
  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleExecuteCommand = () => {
    if (commandInput.trim() && selectedProject) {
      executeCommand(commandInput, selectedProject.id);
      setCommandInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleExecuteCommand();
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex border-b border-gray-200 bg-white">
        <button 
          className={`px-4 py-2 text-sm ${
            activeTerminalTab === "cli" 
              ? "border-b-2 border-metamask-blue text-metamask-blue font-medium" 
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTerminalTab("cli")}
        >
          CLI Terminal
        </button>
        <button 
          className={`px-4 py-2 text-sm ${
            activeTerminalTab === "output" 
              ? "border-b-2 border-metamask-blue text-metamask-blue font-medium" 
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTerminalTab("output")}
        >
          Output Logs
        </button>
        <button 
          className={`px-4 py-2 text-sm ${
            activeTerminalTab === "build" 
              ? "border-b-2 border-metamask-blue text-metamask-blue font-medium" 
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTerminalTab("build")}
        >
          Build Status
        </button>
      </div>
      
      {/* Terminal Output */}
      <div 
        className="flex-1 overflow-y-auto bg-metamask-terminal text-white p-4 font-mono text-sm"
        onClick={focusInput}
        ref={outputRef}
      >
        <p className="mb-1 text-green-400">Welcome to MetaMask DevOps CLI v1.0.0</p>
        <p className="mb-1 text-gray-400">
          Connected to project: {selectedProject ? selectedProject.name : 'No project selected'} 
          {selectedProject && `(${selectedProject.path})`}
        </p>
        <p className="mb-1 text-gray-400">Type 'mm-snap help' for a list of available commands</p>
        <p className="mb-3 text-gray-400">─────────────────────────────────────────</p>

        {commandHistory.map((entry, index) => (
          <div key={index} className="mb-3">
            <p className="mb-1">
              <span className="text-metamask-orange">{selectedProject?.name || "project"} $</span> 
              <span className="text-white"> {entry.command}</span>
            </p>
            {entry.output.split('\n').map((line, i) => (
              <p key={i} className={`mb-1 ${
                line.includes("✓") ? "text-green-400" : 
                line.includes("⚠") ? "text-yellow-400" : 
                "text-gray-300"
              }`}>
                {line}
              </p>
            ))}
          </div>
        ))}
      </div>
      
      {/* Command Input */}
      <div className="bg-metamask-terminal border-t border-gray-700 p-2">
        <div className="flex items-center bg-gray-800 rounded-md overflow-hidden">
          <div className="flex items-center px-3 py-2 text-metamask-orange">
            <span className="font-mono">{selectedProject?.name || "project"} $</span>
          </div>
          <input 
            type="text" 
            className="flex-1 bg-gray-800 text-white px-2 py-2 focus:outline-none font-mono"
            placeholder="Type command (e.g., mm-snap help)"
            value={commandInput}
            onChange={(e) => setCommandInput(e.target.value)}
            onKeyDown={handleKeyDown}
            ref={inputRef}
          />
          <button 
            className="bg-metamask-blue hover:bg-blue-700 text-white px-3 py-2"
            onClick={handleExecuteCommand}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Terminal;
