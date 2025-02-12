import React from 'react';
import { useConnect } from 'wagmi';
import { injected } from 'wagmi/connectors';

export function ConnectButton() {
  const { connect, status } = useConnect();

  return (
    <button
      onClick={() => connect({ connector: injected() })}
      disabled={status === 'connecting'}
      className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
    >
      {status === 'connecting' ? 'Connecting...' : 'Connect Wallet'}
    </button>
  );
}