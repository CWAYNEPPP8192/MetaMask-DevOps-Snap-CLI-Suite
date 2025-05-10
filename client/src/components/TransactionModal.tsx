import React from "react";
import { TransactionRequest } from "@shared/schema";

interface TransactionModalProps {
  transaction: TransactionRequest;
  onConfirm: () => void;
  onCancel: () => void;
}

const TransactionModal: React.FC<TransactionModalProps> = ({ 
  transaction, 
  onConfirm, 
  onCancel
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-96 overflow-hidden">
        <div className="bg-metamask-blue px-4 py-3 flex items-center">
          <svg className="h-8 w-8 mr-3 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20.61 4.5L13.37 9.17L14.7 6.5L20.61 4.5Z" fill="white" stroke="white" strokeWidth="0.1"/>
            <path d="M3.38 4.5L10.57 9.22L9.3 6.5L3.38 4.5Z" fill="white" stroke="white" strokeWidth="0.1"/>
            <path d="M17.93 16.53L15.93 19.54L20.29 20.72L21.5 16.63L17.93 16.53Z" fill="white" stroke="white" strokeWidth="0.1"/>
            <path d="M2.51 16.63L3.71 20.72L8.06 19.54L6.07 16.53L2.51 16.63Z" fill="white" stroke="white" strokeWidth="0.1"/>
            <path d="M7.83 10.96L6.69 12.84L11.01 13.02L10.84 8.34L7.83 10.96Z" fill="white" stroke="white" strokeWidth="0.1"/>
            <path d="M16.16 10.96L13.12 8.28L12.99 13.02L17.3 12.84L16.16 10.96Z" fill="white" stroke="white" strokeWidth="0.1"/>
            <path d="M8.06 19.54L10.71 18.23L8.45 16.67L8.06 19.54Z" fill="white" stroke="white" strokeWidth="0.1"/>
            <path d="M13.28 18.23L15.93 19.54L15.54 16.67L13.28 18.23Z" fill="white" stroke="white" strokeWidth="0.1"/>
          </svg>
          <h3 className="text-white font-medium">MetaMask Transaction Request</h3>
        </div>
        <div className="p-4">
          <div className="mb-4">
            <p className="text-gray-700 mb-1">The DevOps Snap is requesting to:</p>
            <p className="font-medium">
              {transaction.type === 'deploy' 
                ? `Deploy ${transaction.contractName} to ${transaction.network}` 
                : transaction.details}
            </p>
          </div>
          
          <div className="border rounded-md p-3 mb-4">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Gas fee (estimated)</span>
              {/* This would be calculated based on gas limit and price */}
              <span className="font-medium">
                {transaction.gasLimit && transaction.gasPrice 
                  ? `${parseInt(transaction.gasLimit.replace(/,/g, '')) * parseInt(transaction.gasPrice.replace(/\D/g, '')) / 1000000000} ETH` 
                  : 'Calculating...'}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Gas limit: {transaction.gasLimit}</span>
              <span className="text-gray-500">Gas price: {transaction.gasPrice}</span>
            </div>
          </div>
          
          <div className="flex justify-between space-x-3">
            <button 
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-md"
              onClick={onCancel}
            >
              Reject
            </button>
            <button 
              className="flex-1 bg-metamask-blue hover:bg-blue-700 text-white py-3 rounded-md"
              onClick={onConfirm}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionModal;
