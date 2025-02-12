import React, { useState } from 'react';
import { useAccount, useContractWrite, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { Upload, Brain, BookOpen, GraduationCap } from 'lucide-react';

const CONTRACT_ADDRESS = "YOUR_DEPLOYED_CONTRACT_ADDRESS";

export function ResearchSubmission() {
  const { address } = useAccount();
  const [title, setTitle] = useState('');
  const [ipfsHash, setIpfsHash] = useState('');
  const [aiModel, setAiModel] = useState('');
  const [subject, setSubject] = useState('');
  const [difficultyLevel, setDifficultyLevel] = useState('3');
  const [skills, setSkills] = useState('');

  const { write: submitAssessment, data: submitData } = useContractWrite({
    address: CONTRACT_ADDRESS,
    abi: [{
      name: 'submitAssessment',
      type: 'function',
      stateMutability: 'nonpayable',
      inputs: [
        { name: 'title', type: 'string' },
        { name: 'ipfsHash', type: 'string' },
        { name: 'aiModel', type: 'string' },
        { name: 'subject', type: 'string' },
        { name: 'difficultyLevel', type: 'uint256' },
        { name: 'skills', type: 'string[]' }
      ],
      outputs: [{ name: '', type: 'bytes32' }]
    }],
    functionName: 'submitAssessment',
  });

  const { isLoading: isSubmitting } = useWaitForTransactionReceipt({
    hash: submitData?.hash,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !ipfsHash || !aiModel || !subject) return;
    
    const skillsArray = skills.split(',').map(s => s.trim()).filter(s => s);
    
    submitAssessment({
      args: [title, ipfsHash, aiModel, subject, parseInt(difficultyLevel), skillsArray],
    });
  };

  if (!address) {
    return (
      <div className="text-gray-400">
        Please connect your wallet to submit an AI assessment
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 mt-8">
      <div className="flex items-center gap-3 mb-6">
        <Brain className="h-8 w-8 text-blue-400" />
        <h2 className="text-2xl font-bold">Submit AI Assessment</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Assessment Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-white"
            placeholder="Enter assessment title"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              AI Model Used
            </label>
            <input
              type="text"
              value={aiModel}
              onChange={(e) => setAiModel(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-white"
              placeholder="e.g., GPT-4, Claude 2"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Subject Area
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-white"
              placeholder="e.g., Mathematics, Computer Science"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            IPFS Hash (Assessment Content)
          </label>
          <input
            type="text"
            value={ipfsHash}
            onChange={(e) => setIpfsHash(e.target.value)}
            className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-white"
            placeholder="Enter IPFS hash of assessment content"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Difficulty Level (1-5)
            </label>
            <select
              value={difficultyLevel}
              onChange={(e) => setDifficultyLevel(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-white"
            >
              {[1, 2, 3, 4, 5].map((level) => (
                <option key={level} value={level}>
                  Level {level}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Skills Covered (comma-separated)
            </label>
            <input
              type="text"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-white"
              placeholder="e.g., problem-solving, analysis, coding"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Upload className="h-5 w-5" />
          {isSubmitting ? 'Submitting...' : 'Submit Assessment'}
        </button>
      </form>
    </div>
  );
}