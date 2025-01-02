'use client'

import { useState, useEffect, useRef } from "react"
import { 
  Database, Radio, Satellite, FileText, 
  Users, FileSpreadsheet, Globe, Wifi, 
  Plane, Crosshair, Upload, Network, Clock
} from 'lucide-react'
import { format, addHours, differenceInSeconds } from 'date-fns'
import { TacticalMap } from './components/tactical-map'

interface PrimaryActionsProps {
  scenarioCompletion: number;
  validationStatus: 'valid' | 'invalid' | 'pending';
  isGeneratingCOAs: boolean;
  isCertifying: boolean;
  onSaveDraft: () => void;
  onSaveTemplate: () => void;
  onLoadTemplate: () => void;
  onGenerateCOAs: () => void;
  onSubmitReview: () => void;
  onShareScenario: () => void;
  onExportDetails: () => void;
  onCertifyScenario: () => void;
}

type TimeConstraint = {
  value: string;
  label: string;
  desc: string;
  color: string;
  urgencyLevel: number;
}

function ActionsPanel({
  scenarioCompletion,
  validationStatus,
  isGeneratingCOAs,
  isCertifying,
  onSaveDraft,
  onSaveTemplate,
  onLoadTemplate,
  onGenerateCOAs,
  onSubmitReview,
  onShareScenario,
  onExportDetails,
  onCertifyScenario
}: PrimaryActionsProps) {
  return (
    <div className="w-[90%] mx-auto">
      <div className="bg-[#475569] rounded-xl">
        <h2 className="text-3xl text-[#F8FAFC] font-medium p-8">ACTIONS PANEL</h2>
        <div className="w-full px-8 pb-8">
          <div className="bg-[#0F172A] rounded-xl p-8">
            <div className="flex justify-between gap-4">
              {/* Left Side - Scenario Management */}
              <div className="flex-1">
                <h3 className="text-[#94A3B8] mb-4">Scenario Management</h3>
                <div className="space-y-2">
                  <button onClick={onSaveDraft} 
                    className="w-full bg-[#94A3B8] hover:bg-[#8696AB] text-white py-2 px-4 rounded">
                    Save as Draft
                  </button>
                  <button onClick={onSaveTemplate} 
                    className="w-full bg-[#94A3B8] hover:bg-[#8696AB] text-white py-2 px-4 rounded">
                    Save as Template
                  </button>
                  <button onClick={onLoadTemplate} 
                    className="w-full bg-[#94A3B8] hover:bg-[#8696AB] text-white py-2 px-4 rounded">
                    Load Template
                  </button>
                </div>
              </div>

              {/* Center - Analysis Controls */}
              <div className="flex-1 space-y-2">
                <h3 className="text-[#94A3B8] mb-4">Analysis Controls</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[#F8FAFC]">Completion</span>
                    <div className="flex-1 flex items-center gap-2">
                      <div className="flex-1 h-2 bg-[#1E293B] rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#22C55E] transition-all duration-500"
                          style={{ width: `${scenarioCompletion}%` }}
                        />
                      </div>
                      <span className="text-[#F8FAFC]">{scenarioCompletion}%</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-[#F8FAFC] text-sm">
                    <button
                      onClick={onCertifyScenario}
                      disabled={scenarioCompletion < 80}
                      className={`px-4 py-2 rounded bg-blue-600 text-white
                        ${scenarioCompletion >= 80 
                          ? 'hover:bg-blue-700'
                          : 'opacity-50 cursor-not-allowed'
                        }`}
                    >
                      {isCertifying ? 'Certifying...' : 'Certify Scenario'}
                    </button>
                    <span>Validation:</span>
                    <span className={`
                      px-2 py-1 rounded text-xs
                      ${validationStatus === 'valid' ? 'bg-[#22C55E]' : 'bg-gray-600'}
                    `}>
                      {validationStatus.toUpperCase()}
                    </span>
                  </div>
                  <button
                    onClick={onGenerateCOAs}
                    disabled={scenarioCompletion < 100 || validationStatus !== 'valid'}
                    className={`w-full py-2 px-4 rounded ${
                      scenarioCompletion === 100 && validationStatus === 'valid'
                        ? 'bg-[#FBBF24] hover:bg-[#F59E0B] text-black'
                        : 'bg-[#64748B] text-gray-300 cursor-not-allowed'
                    }`}
                  >
                    {isGeneratingCOAs ? 'Generating COAs...' : 'Generate COAs'}
                  </button>
                </div>
              </div>

              {/* Right Side - Workflow Actions */}
              <div className="flex-1">
                <h3 className="text-[#94A3B8] mb-4">Workflow Actions</h3>
                <div className="space-y-2">
                  <button 
                    onClick={onSubmitReview} 
                    disabled={!validationStatus === 'valid'}
                    className={`w-full py-2 px-4 rounded ${
                      validationStatus === 'valid'
                        ? 'bg-[#7C8CA4] hover:bg-[#6F7D93] text-white'
                        : 'bg-[#64748B] text-gray-300 cursor-not-allowed'
                    }`}>
                    Submit for Review
                  </button>
                  <button 
                    onClick={onShareScenario}
                    disabled={!validationStatus === 'valid'}
                    className={`w-full py-2 px-4 rounded ${
                      validationStatus === 'valid'
                        ? 'bg-[#7C8CA4] hover:bg-[#6F7D93] text-white'
                        : 'bg-[#64748B] text-gray-300 cursor-not-allowed'
                    }`}>
                    Share Scenario
                  </button>
                  <button 
                    onClick={onExportDetails}
                    disabled={!validationStatus === 'valid'}
                    className={`w-full py-2 px-4 rounded ${
                      validationStatus === 'valid'
                        ? 'bg-[#7C8CA4] hover:bg-[#6F7D93] text-white'
                        : 'bg-[#64748B] text-gray-300 cursor-not-allowed'
                    }`}>
                    Export Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function NewScenarioForm() {
  // Add these new state declarations at the top with your existing ones
  const [completion, setCompletion] = useState({
    scenarioDescription: false,
    timeConstraint: false,
    intelSources: false,
    resourceSelector: false
  })

  // Move this calculation here, right after the completion state
  const completionPercentage = Object.values(completion).filter(Boolean).length * 25

  // Keep all your existing state declarations
  const [isLoaded, setIsLoaded] = useState(false)
  const [dragTarget, setDragTarget] = useState<'active' | 'additional' | null>(null)
  const [connectingItems, setConnectingItems] = useState<string[]>([])
  const [dragging, setDragging] = useState(false)
  
  const [activeSources, setActiveSources] = useState([
    { id: 'joint-ops-db', name: "Joint Operations Database", iconType: "database" },
    { id: 'theater-intel', name: "Theater Command Intel", iconType: "radio" },
    { id: 'isr-feed', name: "ISR Feed", iconType: "satellite" },
    { id: 'unified-platform', name: "Unified Intel Platform", iconType: "network" }
  ])

  const [additionalSources, setAdditionalSources] = useState([
    { id: 'humint', name: 'HUMINT Collection Teams', iconType: 'users' },
    { id: 'div-brigade', name: 'Division/Brigade Intel Reports', iconType: 'fileSpreadsheet' },
    { id: 'osint', name: 'OSINT Analysis Cell', iconType: 'globe' },
    { id: 'ew-data', name: 'Electronic Warfare Data', iconType: 'wifi' },
    { id: 'uas-feeds', name: 'UAS Feeds', iconType: 'plane' },
    { id: 'forward-obs', name: 'Forward Observer Reports', iconType: 'crosshair' }
  ])

  const timeConstraints: TimeConstraint[] = [
    { value: 'immediate', label: 'Immediate', desc: '< 1 hour', color: '#EF4444', urgencyLevel: 5 },
    { value: 'urgent', label: 'Urgent', desc: '< 6 hours', color: '#F97316', urgencyLevel: 4 },
    { value: 'priority', label: 'Priority', desc: '< 24 hours', color: '#EAB308', urgencyLevel: 3 },
    { value: 'routine', label: 'Routine', desc: '< 72 hours', color: '#22C55E', urgencyLevel: 2 },
    { value: 'planning', label: 'Planning', desc: '> 72 hours', color: '#3B82F6', urgencyLevel: 1 }
  ]

  const [selectedTime, setSelectedTime] = useState<string>('')
  const [currentTime, setCurrentTime] = useState(new Date())
  const [countdown, setCountdown] = useState<string>('--:--:--')
  const [deadline, setDeadline] = useState<Date | null>(null)

  // Format countdown to include days for longer durations
  const formatCountdown = (seconds: number) => {
    const days = Math.floor(seconds / 86400) // 86400 seconds in a day
    const hours = Math.floor((seconds % 86400) / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (days > 0) {
      return `${days}d ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  // Set deadline when time constraint is selected
  useEffect(() => {
    if (selectedTime) {
      const hoursToAdd = {
        immediate: 1,
        urgent: 6,
        priority: 24,
        routine: 72,
        planning: 96
      }[selectedTime]
      
      const newDeadline = new Date()
      newDeadline.setHours(newDeadline.getHours() + hoursToAdd)
      setDeadline(newDeadline)
    } else {
      setDeadline(null)
    }
  }, [selectedTime])

  // Update countdown every second
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      setCurrentTime(now)

      if (deadline) {
        const diff = deadline.getTime() - now.getTime()
        if (diff > 0) {
          const seconds = Math.floor(diff / 1000)
          const hours = Math.floor(seconds / 3600)
          const minutes = Math.floor((seconds % 3600) / 60)
          const secs = seconds % 60
          
          setCountdown(
            `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
          )
        } else {
          setCountdown('00:00:00')
        }
      } else {
        setCountdown('--:--:--')
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [deadline])

  const getResponseDeadline = () => {
    if (!selectedTime) return null
    
    const hoursToAdd = {
      immediate: 1,
      urgent: 6,
      priority: 24,
      routine: 72,
      planning: 96 // 4 days
    }[selectedTime] || 0

    // Create a new date object instead of mutating current time
    const deadline = new Date(currentTime.getTime())
    deadline.setHours(deadline.getHours() + hoursToAdd)
    
    return deadline
  }

  const getIconComponent = (iconType: string, isActive: boolean = false) => {
    const icons = {
      database: Database,
      radio: Radio,
      satellite: Satellite,
      network: Network,
      users: Users,
      fileSpreadsheet: FileSpreadsheet,
      globe: Globe,
      wifi: Wifi,
      plane: Plane,
      crosshair: Crosshair
    }
    const IconComponent = icons[iconType as keyof typeof icons]
    return <IconComponent className={`w-5 h-5 ${isActive ? 'text-[#4CAF50]' : 'text-[#94A3B8]'}`} />
  }

  // Event handlers remain the same
  const handleDragStart = (e: React.DragEvent, source: any, sourceList: 'active' | 'additional') => {
    e.dataTransfer.setData('text/plain', JSON.stringify({ source: {
      id: source.id,
      name: source.name,
      iconType: source.iconType
    }, sourceList }))
  }

  const handleDragOver = (e: React.DragEvent, targetList: 'active' | 'additional') => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragTarget(targetList)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    if (!(e.currentTarget as HTMLElement).contains(e.relatedTarget as HTMLElement)) {
      setDragTarget(null)
    }
  }

  const isConnecting = (id: string) => connectingItems.includes(id)

  const handleDrop = (e: React.DragEvent, targetList: 'active' | 'additional') => {
    e.preventDefault()
    setDragTarget(null)
    
    try {
      const rawData = e.dataTransfer.getData('text/plain')
      if (!rawData) return
      
      const { source, sourceList } = JSON.parse(rawData)
      if (sourceList === targetList) return

      if (sourceList === 'additional' && targetList === 'active') {
        setAdditionalSources(current => current.filter(s => s.id !== source.id))
        setActiveSources(current => [...current, source])
        setConnectingItems(prev => [...prev, source.id])
        setTimeout(() => {
          setConnectingItems(prev => prev.filter(id => id !== source.id))
        }, 1500)
      } else {
        setActiveSources(current => current.filter(s => s.id !== source.id))
        setAdditionalSources(current => [...current, source])
      }
    } catch (error) {
      console.error('Drop error:', error)
    }
  }

  // Update the Analysis Controls completion bar
  const analysisControlsCompletion = Math.round(
    (Object.values(completion).filter(Boolean).length / Object.values(completion).length) * 100
  )

  // Add these new handlers
  const handleScenarioSubmit = () => {
    handleObjectivesComplete();
    setCompletion(prev => ({ ...prev, scenarioDescription: true }))
  }

  const handleIntelSourcesSet = () => {
    handleEnvironmentalComplete();
    setCompletion(prev => ({ ...prev, intelSources: true }))
  }

  const handleResourceAction = () => {
    handleForcesComplete();
    setCompletion(prev => ({ ...prev, resourceSelector: true }))
  }

  const [scenarioCompletion, setScenarioCompletion] = useState(0)
  const [validationStatus, setValidationStatus] = useState<'pending' | 'valid' | 'invalid'>('pending')
  const [isGeneratingCOAs, setIsGeneratingCOAs] = useState(false)

  // Add these state variables
  const [timeConstraintsComplete, setTimeConstraintsComplete] = useState(false)
  const [environmentalConditionsComplete, setEnvironmentalConditionsComplete] = useState(false)
  const [forcesComplete, setForcesComplete] = useState(false)
  const [objectivesComplete, setObjectivesComplete] = useState(false)

  // Add this effect to calculate completion based on sections
  useEffect(() => {
    const sections = [
      timeConstraintsComplete,
      environmentalConditionsComplete,
      forcesComplete,
      objectivesComplete
    ]
    
    const completedSections = sections.filter(Boolean).length
    const percentage = Math.round((completedSections / sections.length) * 100)
    setScenarioCompletion(percentage)
  }, [timeConstraintsComplete, environmentalConditionsComplete, forcesComplete, objectivesComplete])

  // Add this effect to sync the two completion states
  useEffect(() => {
    setScenarioCompletion(completionPercentage)
  }, [completionPercentage])

  // Add handlers
  const handleSaveDraft = () => { /* implementation */ }
  const handleSaveTemplate = () => { /* implementation */ }
  const handleLoadTemplate = () => { /* implementation */ }
  const handleGenerateCOAs = () => {
    setIsGeneratingCOAs(true)
    // Show loading animation for 2 seconds
    setTimeout(() => {
      setIsGeneratingCOAs(false)
      setValidationStatus('valid')
      window.location.href = '/output'
    }, 2000)
  }
  const handleSubmitReview = () => { /* implementation */ }
  const handleShareScenario = () => { /* implementation */ }
  const handleExportDetails = () => { /* implementation */ }

  // Add this with your other state declarations
  const [isCertifying, setIsCertifying] = useState(false)

  // Add this with your other handlers
  const handleCertifyScenario = () => {
    setIsCertifying(true)
    setTimeout(() => {
      setValidationStatus('valid')
      setIsCertifying(false)
    }, 1500)
  }

  // Add this to your existing state declarations
  const [scenarioDescription, setScenarioDescription] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Add this effect right after your other useEffect declarations
  useEffect(() => {
    const text = `URBAN INFRASTRUCTURE BREACH

INCIDENT DETAILS

Multiple unauthorized access attempts detected at 3 critical infrastructure nodes
Pattern suggests coordinated cyber-physical attack
Affected systems: Power distribution, Traffic control, Emergency services communication
Initial breach point identified at substation 7-A
Unauthorized credential use detected at 2 auxiliary stations

IMMEDIATE OBJECTIVES

Contain unauthorized access
Prevent cascade failure
Maintain critical services
Identify and apprehend threat actors`

    let index = 0
    
    const startTyping = (startIndex: number) => {
      const interval = setInterval(() => {
        if (startIndex < text.length) {
          setScenarioDescription(text.substring(0, startIndex + 1))
          startIndex++
          
          if (textareaRef.current) {
            textareaRef.current.scrollTop = textareaRef.current.scrollHeight
          }

          // Adjust timing for next character
          if (text[startIndex] === '\n') {
            clearInterval(interval)
            setTimeout(() => startTyping(startIndex), 200)
          } else if (text[startIndex] === ' ') {
            clearInterval(interval)
            setTimeout(() => startTyping(startIndex), 75)
          }
        } else {
          clearInterval(interval)
        }
      }, Math.random() * 30 + 20)

      return interval
    }

    // Start the typing animation after 1 second
    const initialDelay = setTimeout(() => {
      startTyping(0)
    }, 1000)

    // Cleanup
    return () => {
      clearTimeout(initialDelay)
    }
  }, [])

  // Add these handlers near your other handlers
  const handleTimeConstraintComplete = () => {
    setTimeConstraintsComplete(true);
  };

  const handleEnvironmentalComplete = () => {
    setEnvironmentalConditionsComplete(true);
  };

  const handleForcesComplete = () => {
    setForcesComplete(true);
  };

  const handleObjectivesComplete = () => {
    setObjectivesComplete(true);
  };

  const [scenarioSubmitted, setScenarioSubmitted] = useState(false)
  const [sourcesSet, setSourcesSet] = useState(false)

  // Add this state to handle client-side rendering
  const [isClient, setIsClient] = useState(false)

  // Add this effect near the top of your component
  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <div suppressHydrationWarning className="space-y-4">
      {isClient ? (
        <div className="min-h-screen bg-[#0F172A] animate-fade-in">
          <div className="fixed top-0 left-0 right-0 bg-[#0F172A] z-50 border-b border-slate-800">
            <div className="w-[90%] mx-auto py-4">
              <h1 className={`text-4xl text-[#94A3B8] font-semibold transition-all duration-500 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}>
                SCENARIO OVERVIEW
              </h1>
            </div>
          </div>

          <div className="pt-20">
            <div className="w-[90%] mx-auto">
              <div className="flex gap-8 mb-8">
                <div className="flex-1 bg-[#475569] rounded-xl">
                  <h2 className="text-3xl text-[#F8FAFC] font-medium p-8">MISSION PARAMETERS</h2>
                  <div className="w-full px-8 pb-8 space-y-8">
                    <div className="bg-[#0F172A] rounded-xl p-8">
                      <label className="block text-[#94A3B8] mb-2">Scenario Description</label>
                      <div className="relative">
                        <textarea 
                          ref={textareaRef}
                          className="w-full h-64 p-4 rounded-md bg-white text-[#1E293B] text-lg resize-none"
                          placeholder="Describe the current situation and objectives..."
                          value={scenarioDescription}
                          readOnly
                        />
                        <button
                          onClick={() => {
                            handleScenarioSubmit()
                            setCompletion(prev => ({ ...prev, scenarioDescription: true }))
                            setScenarioSubmitted(true)
                          }}
                          className={`absolute bottom-4 right-4 p-2 
                            ${scenarioSubmitted 
                              ? 'bg-green-500/80' // Change to green when submitted
                              : 'bg-blue-600/80 hover:bg-blue-700/80'}
                            text-white rounded-full transition-all duration-300 
                            hover:scale-110 hover:shadow-lg 
                            ${scenarioSubmitted ? 'hover:shadow-green-500/20' : 'hover:shadow-blue-500/20'}
                            active:scale-95
                            disabled:opacity-50 disabled:cursor-not-allowed
                            group`}
                        >
                          <svg 
                            className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path 
                              strokeLinecap="round" 
                              strokeLinejoin="round" 
                              strokeWidth={2} 
                              d="M5 13l4 4L19 7" 
                            />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <div className="bg-[#0F172A] rounded-xl p-8">
                      <label className="block text-[#94A3B8] mb-4">Time Constraint</label>
                      <div className="grid grid-cols-5 gap-4">
                        {timeConstraints.map((constraint) => (
                          <button
                            key={constraint.value}
                            onClick={() => {
                              setSelectedTime(constraint.value)
                              setTimeConstraintsComplete(true)
                              setCompletion(prev => ({ ...prev, timeConstraint: true }))
                              
                              // Update deadline when time is selected
                              const hoursToAdd = {
                                immediate: 1,
                                urgent: 6,
                                priority: 24,
                                routine: 72,
                                planning: 96
                              }[constraint.value]
                              
                              const newDeadline = new Date()
                              newDeadline.setHours(newDeadline.getHours() + hoursToAdd)
                              setDeadline(newDeadline)
                            }}
                            className={`
                              relative p-4 rounded-lg transition-all duration-300 cursor-pointer
                              ${selectedTime === constraint.value 
                                ? 'bg-[#1E293B] ring-2 ring-offset-2 ring-offset-[#0F172A]'
                                : 'bg-[#1E293B]/50 hover:bg-[#1E293B]'
                              }
                            `}
                          >
                            <div className="space-y-2">
                              <div className="w-full h-1 rounded-full" 
                                style={{ backgroundColor: `${constraint.color}20` }}
                              >
                                <div 
                                  className="h-full rounded-full transition-all duration-500"
                                  style={{ 
                                    width: selectedTime === constraint.value ? '100%' : '0%',
                                    backgroundColor: constraint.color
                                  }}
                                />
                              </div>
                              <p className="text-[#F8FAFC] font-medium">{constraint.label}</p>
                              <p className="text-[#94A3B8] text-sm">{constraint.desc}</p>
                            </div>
                            <div 
                              className="absolute -top-1 -right-1 w-3 h-3 rounded-full"
                              style={{ 
                                backgroundColor: selectedTime === constraint.value ? constraint.color : 'transparent',
                                boxShadow: selectedTime === constraint.value ? `0 0 8px ${constraint.color}` : 'none'
                              }}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="bg-[#0F172A] rounded-xl p-8">
                      <div className="flex gap-8">
                        <div className="w-1/2">
                          <div 
                            className={`
                              border-2 border-dashed border-[#334155] rounded-lg aspect-square
                              flex flex-col items-center justify-center gap-4
                              ${dragging ? 'bg-[#334155]' : 'bg-transparent'}
                              cursor-pointer hover:border-[#4CAF50] hover:bg-[#334155]/20 transition-all duration-300
                            `}
                            onDragOver={(e) => {
                              e.preventDefault()
                              setDragging(true)
                            }}
                            onDragLeave={() => setDragging(false)}
                            onDrop={(e) => {
                              e.preventDefault()
                              setDragging(false)
                            }}
                          >
                            <Upload className="w-8 h-8 text-[#94A3B8]" />
                            <p className="text-[#94A3B8] text-center px-8">
                              Drag and drop Scenario Description files here or click to browse
                            </p>
                          </div>
                        </div>

                        <div className="w-1/2 bg-[#1E293B]/50 rounded-lg p-6">
                          <h3 className="text-[#94A3B8] font-medium mb-4">Scenario Analysis</h3>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-[#0F172A] rounded-lg">
                              <div className="flex items-center gap-3">
                                <Clock className="w-5 h-5 text-[#94A3B8]" />
                                <span className="text-[#F8FAFC]">Current Time</span>
                              </div>
                              <span className="text-[#94A3B8] font-mono">
                                {format(currentTime, 'HH:mm:ss')}
                              </span>
                            </div>

                            <div className="flex items-center justify-between p-3 bg-[#0F172A] rounded-lg">
                              <div className="flex items-center gap-3">
                                <Clock className="w-5 h-5 text-[#4CAF50]" />
                                <span className="text-[#F8FAFC]">Time Remaining</span>
                              </div>
                              <span className={`font-mono ${
                                selectedTime 
                                  ? countdown === '00:00:00' 
                                    ? 'text-red-500' 
                                    : 'text-[#4CAF50]'
                                  : 'text-[#94A3B8]'
                              }`}>
                                {countdown}
                              </span>
                            </div>

                            <div className="flex items-center justify-between p-3 bg-[#0F172A] rounded-lg">
                              <div className="flex items-center gap-3">
                                <Database className="w-5 h-5 text-[#3B82F6]" />
                                <span className="text-[#F8FAFC]">Active Sources</span>
                              </div>
                              <span className="text-[#3B82F6] font-mono">{activeSources.length}/10</span>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div className="flex items-center justify-between p-3 bg-[#0F172A] rounded-lg">
                                <div className="flex items-center gap-2">
                                  <FileText className="w-4 h-4 text-[#F59E0B]" />
                                  <span className="text-[#94A3B8]">Docs</span>
                                </div>
                                  <span className="text-[#F8FAFC] font-mono">0</span>
                              </div>

                              <div className="flex items-center justify-between p-3 bg-[#0F172A] rounded-lg">
                                <div className="flex items-center gap-2">
                                  <Database className="w-4 h-4 text-[#EC4899]" />
                                  <span className="text-[#94A3B8]">Available</span>
                                </div>
                                <span className="text-[#F8FAFC] font-mono">{additionalSources.length}</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="text-white">Completion</span>
                              <div className="flex-1 flex items-center gap-2">
                                <div className="flex-1 h-2 bg-[#1E293B] rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-[#3B82F6] transition-all duration-500"
                                    style={{ width: `${completionPercentage}%` }}
                                  />
                                </div>
                                <span className="text-white">{completionPercentage}%</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex-1 bg-[#475569] rounded-xl">
                  <h2 className="text-3xl text-[#F8FAFC] font-medium p-8">INTELLIGENCE SOURCES</h2>
                  <div className="w-full px-8 pb-8 space-y-4">
                    <div className="bg-[#0F172A] rounded-xl p-8">
                      <div className={`relative ${dragTarget === 'active' ? 'ring-2 ring-[#4CAF50]' : ''}`}
                        onDragOver={(e) => handleDragOver(e, 'active')}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, 'active')}
                      >
                        <h3 className="text-[#94A3B8] mb-4">Active Intelligence Sources</h3>
                        <div className={`grid grid-cols-2 gap-4 ${dragTarget === 'active' ? 'opacity-50' : ''}`}>
                          {activeSources.map((source) => (
                            <div 
                              key={source.id}
                              draggable
                              onDragStart={(e) => handleDragStart(e, source, 'active')}
                              className="flex items-center gap-3 p-3 bg-[#1E293B] rounded-lg cursor-move hover:bg-[#252f43] transition-all duration-300"
                            >
                              <div className="p-2 rounded-full bg-[#2A3441]">
                                {getIconComponent(source.iconType, !isConnecting(source.id))}
                              </div>
                              <span className="text-[#F8FAFC] font-medium">{source.name}</span>
                              <div className="ml-auto">
                                {isConnecting(source.id) ? (
                                  <div className="flex items-center gap-2">
                                    <div className="h-1 w-16 bg-[#1E293B] rounded-full overflow-hidden">
                                      <div className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 animate-connecting-progress" />
                                    </div>
                                    <span className="text-xs text-[#94A3B8]">Connecting...</span>
                                  </div>
                                ) : (
                                  <div className="w-2 h-2 rounded-full bg-[#4CAF50] animate-pulse" />
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                        {dragTarget === 'active' && (
                          <div className="absolute inset-0 border-2 border-dashed border-[#4CAF50] rounded-lg flex items-center justify-center bg-[#1B1B35]/50">
                            <p className="text-[#4CAF50] text-lg font-medium">Drop to Activate Source</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="bg-[#0F172A] rounded-xl p-8 mx-0 mt-4">
                      <div className={`relative ${dragTarget === 'additional' ? 'ring-2 ring-[#4CAF50]' : ''}`}
                        onDragOver={(e) => handleDragOver(e, 'additional')}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, 'additional')}
                      >
                        <h3 className="text-[#94A3B8] mb-4">Additional Data Sources</h3>
                        <div className={`grid grid-cols-2 gap-4 ${dragTarget === 'additional' ? 'opacity-50' : ''}`}>
                          {additionalSources.map((source) => (
                            <div 
                              key={source.id}
                              draggable
                              onDragStart={(e) => handleDragStart(e, source, 'additional')}
                              className="flex items-center gap-3 py-2 px-3 bg-[#1E293B] rounded-lg cursor-move hover:bg-[#252f43] transition-all duration-300"
                            >
                              <div className="p-1.5 rounded-full bg-[#2A3441]">
                                {getIconComponent(source.iconType)}
                              </div>
                              <span className="text-[#94A3B8] text-sm">{source.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="mt-8 flex justify-end">
                        <button
                          onClick={() => {
                            handleIntelSourcesSet()
                            setCompletion(prev => ({ ...prev, intelSources: true }))
                            setSourcesSet(true)
                          }}
                          className={`${sourcesSet ? 'bg-green-500/80' : 'bg-blue-500/80 hover:bg-blue-600/80'}
                            text-white py-1.5 px-3 rounded text-sm
                            transition-all duration-300 hover:shadow-lg 
                            ${sourcesSet ? 'hover:shadow-green-500/20' : 'hover:shadow-blue-500/20'}
                            active:scale-95 
                            disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          {sourcesSet ? 'Sources Set' : 'Set Sources'}
                        </button>
                      </div>
                    </div>

                    <div className="bg-[#0F172A] rounded-xl p-8 mt-4">
                      <div className="border-2 border-dashed border-[#334155] rounded-lg">
                        <div className="p-8 flex flex-col items-center justify-center">
                          <Upload className="w-8 h-8 text-[#94A3B8] mb-2" />
                          <p className="text-[#94A3B8] text-center">
                            Drag and drop Additional Intelligence Data here or click to browse
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full">
                <TacticalMap onResourceAction={handleResourceAction} />
              </div>
            </div>

            <ActionsPanel
              scenarioCompletion={scenarioCompletion}
              validationStatus={validationStatus}
              isGeneratingCOAs={isGeneratingCOAs}
              isCertifying={isCertifying}
              onSaveDraft={handleSaveDraft}
              onSaveTemplate={handleSaveTemplate}
              onLoadTemplate={handleLoadTemplate}
              onGenerateCOAs={handleGenerateCOAs}
              onSubmitReview={handleSubmitReview}
              onShareScenario={handleShareScenario}
              onExportDetails={handleExportDetails}
              onCertifyScenario={handleCertifyScenario}
            />
          </div>
        </div>
      ) : null}
    </div>
  )
}