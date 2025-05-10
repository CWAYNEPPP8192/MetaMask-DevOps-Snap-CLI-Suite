import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DeFiNotifications from "./DeFiNotifications";

// Define types for our API responses
interface Protocol {
  name: string;
  tvl: string;
  apy?: string;
  volume?: string;
}

interface DeFiMetrics {
  tvl: string;
  dailyVolume: string;
  uniqueUsers: number;
  gasSpent: string;
  protocols: Protocol[];
}

interface Chain {
  name: string;
  status: string;
  blockHeight: number;
}

interface CrossChainStatus {
  pendingBridges: number;
  completedBridges: number;
  chains: Chain[];
}

interface Vulnerabilities {
  critical: number;
  high: number;
  medium: number;
  low: number;
}

interface SecurityAnalysis {
  totalContracts: number;
  vulnerabilities: Vulnerabilities;
  lastScan: string;
  recommendations: string[];
}

const DeFiDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("metrics");

  // Fetch DeFi metrics
  const { data: metrics, isLoading: loadingMetrics } = useQuery<DeFiMetrics>({
    queryKey: ["/api/defi/metrics"],
  });

  // Fetch cross-chain status
  const { data: crossChainStatus, isLoading: loadingCrossChain } = useQuery<CrossChainStatus>({
    queryKey: ["/api/cross-chain/status"],
  });

  // Fetch security analysis
  const { data: securityAnalysis, isLoading: loadingSecurity } = useQuery<SecurityAnalysis>({
    queryKey: ["/api/security/analysis"],
  });

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <div className="border-b border-gray-200">
          <TabsList className="h-12 w-full bg-transparent border-b-0 p-0">
            <TabsTrigger 
              value="metrics" 
              className="h-12 rounded-none border-b-2 border-transparent data-[state=active]:border-metamask-blue data-[state=active]:text-metamask-blue"
            >
              Protocol Metrics
            </TabsTrigger>
            <TabsTrigger 
              value="notifications" 
              className="h-12 rounded-none border-b-2 border-transparent data-[state=active]:border-metamask-blue data-[state=active]:text-metamask-blue"
            >
              Live Notifications
            </TabsTrigger>
            <TabsTrigger 
              value="chains" 
              className="h-12 rounded-none border-b-2 border-transparent data-[state=active]:border-metamask-blue data-[state=active]:text-metamask-blue"
            >
              Cross-Chain
            </TabsTrigger>
            <TabsTrigger 
              value="security" 
              className="h-12 rounded-none border-b-2 border-transparent data-[state=active]:border-metamask-blue data-[state=active]:text-metamask-blue"
            >
              Security
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Protocol Metrics */}
        <TabsContent value="metrics" className="flex-1 overflow-auto p-4 m-0 border-none">
          {loadingMetrics ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-metamask-orange"></div>
            </div>
          ) : metrics ? (
            <div className="space-y-6">
              {/* Summary metrics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100 rounded-lg p-4">
                  <div className="text-sm text-gray-500 mb-1">Total Value Locked</div>
                  <div className="text-2xl font-semibold text-blue-900">{metrics.tvl}</div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-blue-50 border border-green-100 rounded-lg p-4">
                  <div className="text-sm text-gray-500 mb-1">Daily Volume</div>
                  <div className="text-2xl font-semibold text-green-900">{metrics.dailyVolume}</div>
                </div>
                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-100 rounded-lg p-4">
                  <div className="text-sm text-gray-500 mb-1">Unique Users</div>
                  <div className="text-2xl font-semibold text-yellow-900">{metrics.uniqueUsers}</div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100 rounded-lg p-4">
                  <div className="text-sm text-gray-500 mb-1">Gas Spent</div>
                  <div className="text-2xl font-semibold text-purple-900">{metrics.gasSpent}</div>
                </div>
              </div>

              {/* Protocols */}
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-3">DeFi Protocols</h3>
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Protocol
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          TVL
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          APY / Volume
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {metrics.protocols.map((protocol: Protocol, index: number) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{protocol.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{protocol.tvl}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{protocol.apy || protocol.volume}</div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              Failed to load DeFi metrics
            </div>
          )}
        </TabsContent>

        {/* Live Notifications */}
        <TabsContent value="notifications" className="flex-1 overflow-auto m-0 p-0 border-none">
          <DeFiNotifications />
        </TabsContent>

        {/* Cross-Chain */}
        <TabsContent value="chains" className="flex-1 overflow-auto p-4 m-0 border-none">
          {loadingCrossChain ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-metamask-orange"></div>
            </div>
          ) : crossChainStatus ? (
            <div className="space-y-6">
              {/* Bridge Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100 rounded-lg p-4">
                  <div className="text-sm text-gray-500 mb-1">Pending Bridges</div>
                  <div className="text-2xl font-semibold text-blue-900">{crossChainStatus.pendingBridges}</div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-blue-50 border border-green-100 rounded-lg p-4">
                  <div className="text-sm text-gray-500 mb-1">Completed Bridges</div>
                  <div className="text-2xl font-semibold text-green-900">{crossChainStatus.completedBridges}</div>
                </div>
              </div>

              {/* Chain Status */}
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-3">Connected Chains</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {crossChainStatus.chains.map((chain: Chain, index: number) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{chain.name}</span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          chain.status === "Connected" 
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}>
                          {chain.status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        <span>Block Height: </span>
                        <span className="font-mono">{chain.blockHeight.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              Failed to load cross-chain data
            </div>
          )}
        </TabsContent>

        {/* Security */}
        <TabsContent value="security" className="flex-1 overflow-auto p-4 m-0 border-none">
          {loadingSecurity ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-metamask-orange"></div>
            </div>
          ) : securityAnalysis ? (
            <div className="space-y-6">
              {/* Security Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="text-sm text-gray-500 mb-1">Total Contracts</div>
                  <div className="text-2xl font-semibold">{securityAnalysis.totalContracts}</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="text-sm text-gray-500 mb-1">Last Scan</div>
                  <div className="text-lg font-semibold">
                    {new Date(securityAnalysis.lastScan).toLocaleString()}
                  </div>
                </div>
                <div className="col-span-2 bg-white border border-gray-200 rounded-lg p-4">
                  <div className="text-sm text-gray-500 mb-2">Vulnerabilities</div>
                  <div className="flex space-x-4">
                    <div className="flex-1 flex items-center">
                      <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                      <div className="text-sm">Critical: {securityAnalysis.vulnerabilities.critical}</div>
                    </div>
                    <div className="flex-1 flex items-center">
                      <div className="w-3 h-3 rounded-full bg-orange-500 mr-2"></div>
                      <div className="text-sm">High: {securityAnalysis.vulnerabilities.high}</div>
                    </div>
                    <div className="flex-1 flex items-center">
                      <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                      <div className="text-sm">Medium: {securityAnalysis.vulnerabilities.medium}</div>
                    </div>
                    <div className="flex-1 flex items-center">
                      <div className="w-3 h-3 rounded-full bg-blue-300 mr-2"></div>
                      <div className="text-sm">Low: {securityAnalysis.vulnerabilities.low}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-3">Security Recommendations</h3>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <ul className="space-y-2">
                    {securityAnalysis.recommendations.map((recommendation: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <span>{recommendation}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              Failed to load security analysis
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DeFiDashboard;