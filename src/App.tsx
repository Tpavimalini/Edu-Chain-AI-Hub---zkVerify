import React from 'react';
import { createConfig, http, WagmiProvider } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Brain } from 'lucide-react';
import { ConnectButton } from './components/ConnectButton';
import { AccountInfo } from './components/AccountInfo';
import { ResearchSubmission } from './components/ResearchSubmission';

const config = createConfig({
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});

const queryClient = new QueryClient();

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
          <nav className="border-b border-gray-700 bg-gray-800/50 backdrop-blur-sm sticky top-0 z-50">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 justify-between items-center">
                <div className="flex items-center">
                  <Brain className="h-8 w-8 text-blue-400" />
                  <span className="ml-2 text-xl font-bold">EDU Chain AI Hub</span>
                </div>
                <ConnectButton />
              </div>
            </div>
          </nav>

          <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-xl p-6">
              <h1 className="text-3xl font-bold mb-4">Welcome to EDU Chain AI Hub</h1>
              <p className="text-gray-300 mb-8">
                Create and verify AI-powered educational assessments using zkVerify proof verification on EDU Chain. 
                Submit your AI-generated content and ensure its authenticity through our decentralized verification system.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gray-700/50 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg mb-2">Verified AI Content</h3>
                  <p className="text-gray-300 text-sm">
                    All assessments are verified using zkVerify proofs to ensure authenticity and quality.
                  </p>
                </div>
                
                <div className="bg-gray-700/50 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg mb-2">Skill Tracking</h3>
                  <p className="text-gray-300 text-sm">
                    Track and verify skills covered in each assessment for better learning outcomes.
                  </p>
                </div>
                
                <div className="bg-gray-700/50 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg mb-2">Decentralized Education</h3>
                  <p className="text-gray-300 text-sm">
                    Contribute to a decentralized educational ecosystem powered by EDU Chain.
                  </p>
                </div>
              </div>
              
              <AccountInfo />
              <ResearchSubmission />
            </div>
          </main>
        </div>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;