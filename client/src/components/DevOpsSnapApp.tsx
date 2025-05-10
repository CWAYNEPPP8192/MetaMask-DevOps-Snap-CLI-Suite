import { useState } from "react";
import SideNavigation from "./SideNavigation";
import ProjectSelector from "./ProjectSelector";
import Terminal from "./Terminal";
import InfoPanel from "./InfoPanel";
import TransactionModal from "./TransactionModal";
import DeFiDashboard from "./DeFiDashboard";
import { useProject } from "@/hooks/useProject";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { TransactionRequest } from "@shared/schema";

// Define interface for pending transactions response
interface PendingTransactionsResponse {
  length: number;
  [index: number]: TransactionRequest;
}

const DevOpsSnapApp = () => {
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [activeTab, setActiveTab] = useState("terminal");
  const { selectedProject, setSelectedProject } = useProject();

  // Fetch pending transactions
  const { data: pendingTransaction } = useQuery<PendingTransactionsResponse>({
    queryKey: ["/api/transactions/pending"],
    enabled: !!selectedProject
  });

  const handleSignTransaction = () => {
    setShowTransactionModal(true);
  };

  const handleConfirmTransaction = async () => {
    if (pendingTransaction && pendingTransaction.length > 0) {
      try {
        await fetch(`/api/transactions/${pendingTransaction[0].id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "confirmed" })
        });
        
        // Invalidate the pending transactions query
        queryClient.invalidateQueries({ queryKey: ["/api/transactions/pending"] });
        setShowTransactionModal(false);
      } catch (error) {
        console.error("Failed to confirm transaction:", error);
      }
    }
  };

  const handleRejectTransaction = async () => {
    if (pendingTransaction && pendingTransaction.length > 0) {
      try {
        await fetch(`/api/transactions/${pendingTransaction[0].id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "rejected" })
        });
        
        // Invalidate the pending transactions query
        queryClient.invalidateQueries({ queryKey: ["/api/transactions/pending"] });
        setShowTransactionModal(false);
      } catch (error) {
        console.error("Failed to reject transaction:", error);
      }
    }
  };

  // Render different content based on active tab
  const renderMainContent = () => {
    switch (activeTab) {
      case "terminal":
        return <Terminal activeTab={activeTab} />;
      case "defi":
        return <DeFiDashboard />;
      case "cross-chain":
        return <DeFiDashboard />;
      default:
        return <Terminal activeTab={activeTab} />;
    }
  };

  return (
    <div className="flex flex-col h-screen max-h-[600px] overflow-hidden">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 py-2 px-4 flex items-center justify-between">
        <div className="flex items-center">
          <svg className="h-8 w-8 mr-3 text-metamask-orange" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20.61 4.5L13.37 9.17L14.7 6.5L20.61 4.5Z" fill="#E2761B" stroke="#E2761B" strokeWidth="0.1"/>
            <path d="M3.38 4.5L10.57 9.22L9.3 6.5L3.38 4.5Z" fill="#E4761B" stroke="#E4761B" strokeWidth="0.1"/>
            <path d="M17.93 16.53L15.93 19.54L20.29 20.72L21.5 16.63L17.93 16.53Z" fill="#E4761B" stroke="#E4761B" strokeWidth="0.1"/>
            <path d="M2.51 16.63L3.71 20.72L8.06 19.54L6.07 16.53L2.51 16.63Z" fill="#E4761B" stroke="#E4761B" strokeWidth="0.1"/>
            <path d="M7.83 10.96L6.69 12.84L11.01 13.02L10.84 8.34L7.83 10.96Z" fill="#E4761B" stroke="#E4761B" strokeWidth="0.1"/>
            <path d="M16.16 10.96L13.12 8.28L12.99 13.02L17.3 12.84L16.16 10.96Z" fill="#E4761B" stroke="#E4761B" strokeWidth="0.1"/>
            <path d="M8.06 19.54L10.71 18.23L8.45 16.67L8.06 19.54Z" fill="#E4761B" stroke="#E4761B" strokeWidth="0.1"/>
            <path d="M13.28 18.23L15.93 19.54L15.54 16.67L13.28 18.23Z" fill="#E4761B" stroke="#E4761B" strokeWidth="0.1"/>
            <path d="M15.93 19.54L13.28 18.23L13.5 19.89L13.47 20.67L15.93 19.54Z" fill="#D7C1B3" stroke="#D7C1B3" strokeWidth="0.1"/>
            <path d="M8.06 19.54L10.52 20.67L10.5 19.89L10.71 18.23L8.06 19.54Z" fill="#D7C1B3" stroke="#D7C1B3" strokeWidth="0.1"/>
            <path d="M10.57 15.19L8.4 14.57L9.92 13.85L10.57 15.19Z" fill="#233447" stroke="#233447" strokeWidth="0.1"/>
            <path d="M13.42 15.19L14.07 13.85L15.6 14.57L13.42 15.19Z" fill="#233447" stroke="#233447" strokeWidth="0.1"/>
            <path d="M8.06 19.54L8.47 16.53L6.07 16.63L8.06 19.54Z" fill="#CD6116" stroke="#CD6116" strokeWidth="0.1"/>
            <path d="M15.52 16.53L15.93 19.54L17.92 16.63L15.52 16.53Z" fill="#CD6116" stroke="#CD6116" strokeWidth="0.1"/>
            <path d="M17.3 12.84L12.99 13.02L13.42 15.19L14.07 13.85L15.6 14.57L17.3 12.84Z" fill="#CD6116" stroke="#CD6116" strokeWidth="0.1"/>
            <path d="M8.4 14.57L9.92 13.85L10.57 15.19L11.01 13.02L6.69 12.84L8.4 14.57Z" fill="#CD6116" stroke="#CD6116" strokeWidth="0.1"/>
            <path d="M6.69 12.84L8.45 16.67L8.4 14.57L6.69 12.84Z" fill="#E4751F" stroke="#E4751F" strokeWidth="0.1"/>
            <path d="M15.6 14.57L15.54 16.67L17.3 12.84L15.6 14.57Z" fill="#E4751F" stroke="#E4751F" strokeWidth="0.1"/>
            <path d="M11.01 13.02L10.57 15.19L11.11 17.81L11.27 14.23L11.01 13.02Z" fill="#E4751F" stroke="#E4751F" strokeWidth="0.1"/>
            <path d="M12.99 13.02L12.74 14.23L12.89 17.81L13.42 15.19L12.99 13.02Z" fill="#E4751F" stroke="#E4751F" strokeWidth="0.1"/>
            <path d="M13.42 15.19L12.89 17.81L13.28 18.23L15.54 16.67L15.6 14.57L13.42 15.19Z" fill="#F6851B" stroke="#F6851B" strokeWidth="0.1"/>
            <path d="M8.4 14.57L8.45 16.67L10.71 18.23L11.11 17.81L10.57 15.19L8.4 14.57Z" fill="#F6851B" stroke="#F6851B" strokeWidth="0.1"/>
            <path d="M13.47 20.67L13.5 19.89L13.3 19.71H10.7L10.5 19.89L10.52 20.67L8.06 19.54L8.94 20.25L10.67 21.5H13.32L15.05 20.25L15.93 19.54L13.47 20.67Z" fill="#C0AD9E" stroke="#C0AD9E" strokeWidth="0.1"/>
            <path d="M13.28 18.23L12.89 17.81H11.11L10.71 18.23L10.5 19.89L10.7 19.71H13.3L13.5 19.89L13.28 18.23Z" fill="#161616" stroke="#161616" strokeWidth="0.1"/>
            <path d="M20.95 8.33L21.61 5.69L20.61 4.5L13.28 8.96L16.16 10.96L20.15 12.1L21.02 11.06L20.67 10.81L21.26 10.31L20.83 9.97L21.43 9.56L20.95 8.33Z" fill="#763D16" stroke="#763D16" strokeWidth="0.1"/>
            <path d="M2.39 5.69L3.05 8.33L2.57 9.56L3.16 9.97L2.74 10.31L3.33 10.81L2.98 11.06L3.84 12.1L7.83 10.96L10.71 8.96L3.38 4.5L2.39 5.69Z" fill="#763D16" stroke="#763D16" strokeWidth="0.1"/>
            <path d="M20.15 12.1L16.16 10.96L17.3 12.84L15.54 16.67L17.92 16.63H21.5L20.15 12.1Z" fill="#F6851B" stroke="#F6851B" strokeWidth="0.1"/>
            <path d="M7.83 10.96L3.84 12.1L2.51 16.63H6.07L8.45 16.67L6.69 12.84L7.83 10.96Z" fill="#F6851B" stroke="#F6851B" strokeWidth="0.1"/>
            <path d="M12.99 13.02L13.28 8.96L14.7 6.5H9.3L10.71 8.96L11.01 13.02L11.11 17.81L11.12 19.71H12.88L12.89 17.81L12.99 13.02Z" fill="#F6851B" stroke="#F6851B" strokeWidth="0.1"/>
          </svg>
          <h1 className="text-lg font-semibold">MetaMask DevOps Snap</h1>
        </div>
        <div className="flex items-center space-x-2">
          <span className="bg-green-100 text-metamask-success text-xs px-2 py-1 rounded-full flex items-center">
            <span className="inline-block w-2 h-2 bg-metamask-success rounded-full mr-1"></span>
            Connected
          </span>
          <button className="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <SideNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Main Panel */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Project Selector - only show in terminal view */}
          {activeTab === "terminal" && (
            <ProjectSelector 
              selectedProject={selectedProject} 
              onProjectChange={setSelectedProject} 
            />
          )}

          {/* Main content based on active tab */}
          {renderMainContent()}
        </div>

        {/* Info Panel - only show in terminal view */}
        {activeTab === "terminal" && (
          <InfoPanel 
            pendingTransaction={pendingTransaction?.[0]} 
            selectedProject={selectedProject}
            onSignTransaction={handleSignTransaction}
            onRejectTransaction={handleRejectTransaction}
          />
        )}
      </div>

      {/* Transaction Modal */}
      {showTransactionModal && pendingTransaction && pendingTransaction.length > 0 && (
        <TransactionModal
          transaction={pendingTransaction[0]}
          onConfirm={handleConfirmTransaction}
          onCancel={handleRejectTransaction}
        />
      )}
    </div>
  );
};

export default DevOpsSnapApp;
