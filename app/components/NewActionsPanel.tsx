'use client'

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

interface PrimaryActionsProps {
  scenarioCompletion: number;
  validationStatus: 'valid' | 'invalid' | 'pending';
  isGeneratingCOAs: boolean;
  onSaveDraft: () => void;
  onSaveTemplate: () => void;
  onLoadTemplate: () => void;
  onGenerateCOAs: () => void;
  onSubmitReview: () => void;
  onShareScenario: () => void;
  onExportDetails: () => void;
}

export default function NewActionsPanel() {
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState('');
  const [isGeneratingCOAs, setIsGeneratingCOAs] = useState(false);

  // Handle time display client-side only
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', { 
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }));
    };
    
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleGenerateCOAs = () => {
    console.log('Generating COAs...');
    setIsGeneratingCOAs(true);
    // Add a small delay to show the loading state
    setTimeout(() => {
      router.push('/output');
    }, 100);
  };

  return (
    <div className="bg-[#0F172A] p-4 rounded-lg">
      <div className="flex gap-8">
        <div>
          <span className="text-[#94A3B8] font-mono">
            {currentTime}
          </span>
        </div>
        {/* ... other content ... */}
        <button
          onClick={handleGenerateCOAs}
          className={`w-full py-2 px-4 rounded ${
            isGeneratingCOAs
              ? 'bg-gray-500 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          } text-white`}
          disabled={isGeneratingCOAs}
        >
          {isGeneratingCOAs ? 'Generating...' : 'Generate COAs'}
        </button>
      </div>
    </div>
  );
} 