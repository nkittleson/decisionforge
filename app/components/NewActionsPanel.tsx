'use client'

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

export function NewActionsPanel({
  scenarioCompletion,
  validationStatus,
  isGeneratingCOAs,
  onSaveDraft,
  onSaveTemplate,
  onLoadTemplate,
  onGenerateCOAs,
  onSubmitReview,
  onShareScenario,
  onExportDetails
}: PrimaryActionsProps) {
  return (
    <div className="bg-[#1E293B] p-4 rounded-lg shadow-lg mt-4">
      <h2 className="text-white mb-4">NEW ACTIONS PANEL</h2>
      <div className="flex justify-between gap-4">
        {/* Left Side - Scenario Management */}
        <div className="flex-1 space-y-2">
          <h3 className="text-[#F8FAFC] font-medium mb-3">Scenario Management</h3>
          <div className="space-y-2">
            <button
              onClick={onSaveDraft}
              className="w-full bg-[#3B82F6] hover:bg-blue-700 text-white py-2 px-4 rounded"
            >
              Save as Draft
            </button>
            <button
              onClick={onSaveTemplate}
              className="w-full bg-[#22C55E] hover:bg-green-700 text-white py-2 px-4 rounded"
            >
              Save as Template
            </button>
            <button
              onClick={onLoadTemplate}
              className="w-full bg-[#A855F7] hover:bg-purple-700 text-white py-2 px-4 rounded"
            >
              Load Template
            </button>
          </div>
        </div>

        {/* Center - Analysis Controls */}
        <div className="flex-1 space-y-2">
          <h3 className="text-[#F8FAFC] font-medium mb-3">Analysis Controls</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-[#F8FAFC]">Completion</span>
              <div className="flex-1 flex items-center gap-2">
                <div className="flex-1 h-2 bg-[#0F172A] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#3B82F6] transition-all duration-500"
                    style={{ width: `${scenarioCompletion}%` }}
                  />
                </div>
                <span className="text-[#F8FAFC]">{scenarioCompletion}%</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-[#F8FAFC] text-sm">
              <span>Validation:</span>
              <span className={`
                px-2 py-1 rounded text-xs
                ${validationStatus === 'valid' ? 'bg-green-500' : 
                  validationStatus === 'invalid' ? 'bg-red-500' : 'bg-yellow-500'}
              `}>
                {validationStatus.toUpperCase()}
              </span>
            </div>
            <button
              onClick={onGenerateCOAs}
              disabled={scenarioCompletion < 100 || validationStatus !== 'valid' || isGeneratingCOAs}
              className={`
                w-full py-2 px-4 rounded
                ${scenarioCompletion === 100 && validationStatus === 'valid' && !isGeneratingCOAs
                  ? 'bg-[#3B82F6] hover:bg-blue-700 text-white'
                  : 'bg-gray-600 cursor-not-allowed text-gray-300'}
              `}
            >
              {isGeneratingCOAs ? 'Generating COAs...' : 'Generate COAs'}
            </button>
          </div>
        </div>

        {/* Right Side - Workflow Actions */}
        <div className="flex-1 space-y-2">
          <h3 className="text-[#F8FAFC] font-medium mb-3">Workflow Actions</h3>
          <div className="space-y-2">
            <button
              onClick={onSubmitReview}
              disabled={scenarioCompletion < 100}
              className="w-full bg-gray-600 text-white py-2 px-4 rounded"
            >
              Submit for Review
            </button>
            <button
              onClick={onShareScenario}
              className="w-full bg-[#3B82F6] hover:bg-blue-700 text-white py-2 px-4 rounded"
            >
              Share Scenario
            </button>
            <button
              onClick={onExportDetails}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded"
            >
              Export Details
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 