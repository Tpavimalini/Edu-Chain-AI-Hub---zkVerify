import React from 'react';
import { useAccount, useBalance, useEnsName } from 'wagmi';

export function AccountInfo() {
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({ address });
  const { data: ensName } = useEnsName({ address });

  if (!isConnected || !address) {
    return (
      <div className="text-gray-400">
        Connect your wallet to view your account information
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-gray-700/50 rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-2">Account Details</h2>
        <div className="space-y-2">
          <p>
            <span className="text-gray-400">Address:</span>{' '}
            {ensName || address}
          </p>
          {balance && (
            <p>
              <span className="text-gray-400">Balance:</span>{' '}
              {balance.formatted} {balance.symbol}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}