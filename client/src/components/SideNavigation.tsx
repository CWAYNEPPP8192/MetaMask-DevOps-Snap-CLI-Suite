import React from "react";

interface SideNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const SideNavigation: React.FC<SideNavigationProps> = ({ activeTab, setActiveTab }) => {
  return (
    <nav className="w-24 bg-white border-r border-gray-200 flex flex-col items-center py-4">
      <button 
        className={`w-16 h-16 rounded-lg flex flex-col items-center justify-center mb-3 ${
          activeTab === "terminal" 
            ? "bg-metamask-blue text-white" 
            : "text-gray-500 hover:bg-gray-100"
        }`}
        onClick={() => setActiveTab("terminal")}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span className="text-xs">Terminal</span>
      </button>
      
      <button 
        className={`w-16 h-16 rounded-lg flex flex-col items-center justify-center mb-3 ${
          activeTab === "projects" 
            ? "bg-metamask-blue text-white" 
            : "text-gray-500 hover:bg-gray-100"
        }`}
        onClick={() => setActiveTab("projects")}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
        <span className="text-xs">Projects</span>
      </button>
      
      <button 
        className={`w-16 h-16 rounded-lg flex flex-col items-center justify-center mb-3 ${
          activeTab === "defi" 
            ? "bg-metamask-blue text-white" 
            : "text-gray-500 hover:bg-gray-100"
        }`}
        onClick={() => setActiveTab("defi")}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <span className="text-xs">DeFi</span>
      </button>
      
      <button 
        className={`w-16 h-16 rounded-lg flex flex-col items-center justify-center mb-3 ${
          activeTab === "history" 
            ? "bg-metamask-blue text-white" 
            : "text-gray-500 hover:bg-gray-100"
        }`}
        onClick={() => setActiveTab("history")}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="text-xs">History</span>
      </button>
      
      <button 
        className={`w-16 h-16 rounded-lg flex flex-col items-center justify-center mb-3 ${
          activeTab === "tools" 
            ? "bg-metamask-blue text-white" 
            : "text-gray-500 hover:bg-gray-100"
        }`}
        onClick={() => setActiveTab("tools")}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span className="text-xs">Tools</span>
      </button>
      
      <button 
        className={`w-16 h-16 rounded-lg flex flex-col items-center justify-center mb-3 ${
          activeTab === "cross-chain" 
            ? "bg-metamask-blue text-white" 
            : "text-gray-500 hover:bg-gray-100"
        }`}
        onClick={() => setActiveTab("cross-chain")}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
        <span className="text-xs">Chain</span>
      </button>
      
      <div className="flex-grow"></div>
      
      <button className="w-16 h-16 rounded-lg flex flex-col items-center justify-center text-gray-500 hover:bg-gray-100">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="text-xs">Help</span>
      </button>
    </nav>
  );
};

export default SideNavigation;
