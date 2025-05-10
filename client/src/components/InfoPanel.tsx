import React from "react";
import { Project, TransactionRequest } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";
import { useTerminal } from "@/hooks/useTerminal";

interface InfoPanelProps {
  pendingTransaction?: TransactionRequest;
  selectedProject: Project | null;
  onSignTransaction: () => void;
  onRejectTransaction: () => void;
}

const InfoPanel: React.FC<InfoPanelProps> = ({ 
  pendingTransaction, 
  selectedProject,
  onSignTransaction,
  onRejectTransaction,
}) => {
  const { setCommandInput, executeCommand } = useTerminal();

  const { data: quickCommands } = useQuery({
    queryKey: ["/api/projects", selectedProject?.id, "commands"],
    enabled: !!selectedProject,
  });

  const handleInsertCommand = (command: string) => {
    setCommandInput(command);
  };

  return (
    <div className="w-80 border-l border-gray-200 bg-white overflow-y-auto">
      {/* Transaction Status */}
      {pendingTransaction && (
        <div className="border-b border-gray-200 p-4">
          <h2 className="font-medium text-gray-700 mb-3">Pending Transaction</h2>
          <div className="bg-metamask-lightOrange border border-metamask-orange rounded-lg p-3">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">{pendingTransaction.details}</span>
              <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">Awaiting</span>
            </div>
            <div className="text-sm text-gray-600 mb-2">
              <p><span className="font-medium">Contract:</span> {pendingTransaction.contractName}</p>
              <p><span className="font-medium">Network:</span> {pendingTransaction.network}</p>
              <p><span className="font-medium">Gas:</span> {pendingTransaction.gasLimit} ({pendingTransaction.gasPrice})</p>
            </div>
            <div className="flex space-x-2 mt-3">
              <button 
                className="flex-1 bg-metamask-orange hover:bg-orange-600 text-white py-2 rounded-md text-sm"
                onClick={onSignTransaction}
              >
                Sign Transaction
              </button>
              <button 
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-md text-sm"
                onClick={onRejectTransaction}
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Project Details */}
      {selectedProject && (
        <div className="border-b border-gray-200 p-4">
          <h2 className="font-medium text-gray-700 mb-3">Project Details</h2>
          <div className="mb-2">
            <div className="text-xs text-gray-500 mb-1">PROJECT NAME</div>
            <div className="font-medium">{selectedProject.name}</div>
          </div>
          <div className="mb-2">
            <div className="text-xs text-gray-500 mb-1">LOCATION</div>
            <div className="font-medium">{selectedProject.path}</div>
          </div>
          <div className="mb-2">
            <div className="text-xs text-gray-500 mb-1">FRAMEWORK</div>
            <div className="font-medium">{selectedProject.framework}</div>
          </div>
          <div className="mb-2">
            <div className="text-xs text-gray-500 mb-1">LAST BUILD</div>
            <div className="font-medium">
              {selectedProject.lastBuild 
                ? new Date(selectedProject.lastBuild).toLocaleString() 
                : 'Never built'
              }
            </div>
          </div>
        </div>
      )}
      
      {/* Command Helper */}
      <div className="p-4">
        <h2 className="font-medium text-gray-700 mb-3">Quick Commands</h2>
        <div className="space-y-2 text-sm">
          <div 
            className="bg-gray-100 rounded-md p-2 cursor-pointer hover:bg-gray-200"
            onClick={() => handleInsertCommand("mm-snap build")}
          >
            <div className="font-medium">mm-snap build</div>
            <div className="text-gray-500">Build project using package.json scripts</div>
          </div>
          <div 
            className="bg-gray-100 rounded-md p-2 cursor-pointer hover:bg-gray-200"
            onClick={() => handleInsertCommand("mm-snap test")}
          >
            <div className="font-medium">mm-snap test</div>
            <div className="text-gray-500">Run project test suite</div>
          </div>
          <div 
            className="bg-gray-100 rounded-md p-2 cursor-pointer hover:bg-gray-200"
            onClick={() => handleInsertCommand("mm-snap deploy --network testnet")}
          >
            <div className="font-medium">mm-snap deploy</div>
            <div className="text-gray-500">Deploy contracts to specified network</div>
          </div>
          <div 
            className="bg-gray-100 rounded-md p-2 cursor-pointer hover:bg-gray-200"
            onClick={() => handleInsertCommand("mm-snap verify --network mainnet")}
          >
            <div className="font-medium">mm-snap verify</div>
            <div className="text-gray-500">Verify contract source code on explorer</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoPanel;
