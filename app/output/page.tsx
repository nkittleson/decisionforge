"use client"

import dynamic from 'next/dynamic'
import React, { useState, useEffect } from 'react'
import { 
  Shield, Clock, AlertTriangle, Building2, Signal, Users, 
  Thermometer, Cloud, Sun, Wind, Eye, ArrowUp, ArrowDown,
  MapPin, Activity, Check, FileText, CheckCircle, Loader2
} from 'lucide-react'
import COACard from '../components/COACard'
import { motion, AnimatePresence } from 'framer-motion';

interface FacilityStatus {
  name: string;
  status: 'Critical' | 'At Risk' | 'Alert';
  personnel: string;
  securityLevel: string;
  lastUpdate: string;
  systemStatus: {
    power: number;
    security: number;
    comms: number;
  };
}

const scenarioData = {
  title: "Urban Area Security Breach",
  situation: {
    location: "Sector 7",
    timeConstraint: "< 1 hour",
    affectedFacilities: [
      {
        name: "Power distribution substation",
        status: "Critical",
        personnel: "12 staff on-site",
        securityLevel: "Level 3",
        lastUpdate: "5 mins ago",
        systemStatus: {
          power: 85,
          security: 60,
          comms: 75
        }
      },
      {
        name: "Communications hub",
        status: "Alert",
        personnel: "4 staff on-site",
        securityLevel: "Level 3",
        lastUpdate: "1 min ago",
        systemStatus: {
          power: 95,
          security: 70,
          comms: 40
        }
      }
    ],
    threatStatus: "Active threats present",
    resources: "12 security teams available",
    environmental: {
      time: "14:30 Local",
      weather: "Partly Cloudy",
      temperature: "72°F",
      visibility: "8.5 miles",
      windSpeed: "12 mph NE",
      lightConditions: "Daylight"
    }
  },
  objectives: [
    "Secure compromised facilities",
    "Prevent system failures",
    "Neutralize active threats",
    "Maintain critical services"
  ],
  coursesOfAction: [
    {
      id: 1,
      title: "Deploy Security Personnel",
      confidenceScore: 92,
      riskLevel: "Medium",
      timeline: "30-45 minutes",
      summary: "Immediate deployment of 10 security teams in coordinated response. Teams Alpha & Bravo secure power station, Charlie & Delta secure water facility, Echo & Foxtrot secure comms hub. Remaining 4 teams establish outer perimeter. Requires rapid mobilization but provides direct threat response and facility protection.",
      resources: {
        required: 10,
        available: 12,
        readiness: 95
      }
    },
    {
      id: 2,
      title: "Activate Emergency Protocol",
      confidenceScore: 74,
      riskLevel: "High",
      timeline: "15-20 minutes",
      summary: "Initiate facility lockdown procedures and activate automated defense systems. Remotely isolate critical systems while maintaining essential services. Deploy 6 teams strategically at key intersections to control access. Faster implementation but relies heavily on automated systems.",
      resources: {
        required: 6,
        available: 12,
        readiness: 88
      }
    },
    {
      id: 3,
      title: "Wait for Further Intel",
      confidenceScore: 42,
      riskLevel: "Critical",
      timeline: "2-3 hours",
      summary: "Maintain current security posture while gathering additional threat intelligence. Deploy 4 surveillance teams to monitor facility perimeters. Risk of system compromise increases but allows for better threat assessment. Positions teams for targeted response once intel confirms threat vectors.",
      resources: {
        required: 4,
        available: 12,
        readiness: 100
      }
    }
  ]
}

// First, enhance the MissionTimer component
function MissionTimer({ deadline }: { deadline: Date }) {
  const [timeLeft, setTimeLeft] = useState<number>(0)
  
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime()
      const distance = deadline.getTime() - now
      setTimeLeft(distance)
    }, 1000)

    return () => clearInterval(timer)
  }, [deadline])

  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000)
  
  return (
    <div suppressHydrationWarning className="bg-[#1E293B] rounded-lg p-6 text-center mb-8">
      <div className="flex items-center justify-center gap-4 mb-2">
        <Clock className="w-6 h-6 text-red-400" />
        <h2 className="text-xl text-red-400 font-medium">MISSION TIME REMAINING</h2>
      </div>
      <div className="text-6xl font-bold text-red-400 animate-pulse">
        {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
      </div>
      <div className="mt-2 text-[#94A3B8]">Critical Response Window</div>
    </div>
  )
}

// Add a SectorMap component
function SectorMap({ facilities }: { facilities: any[] }) {
  return (
    <div className="bg-[#1E293B] rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <MapPin className="w-5 h-5 text-[#3B82F6]" />
          <h3 className="text-[#94A3B8]">Sector 7 Overview</h3>
        </div>
        <span className="text-[#94A3B8] text-sm">2km radius</span>
      </div>
      <div className="relative w-full h-64 bg-[#0F172A] rounded-lg border border-[#334155] p-4">
        {/* Simplified vector map */}
        <div className="absolute inset-0">
          {facilities.map((facility, index) => (
            <div key={index} 
                 className="absolute"
                 style={{ left: `${facility.coordinates.x}%`, top: `${facility.coordinates.y}%` }}>
              <div className={`w-3 h-3 rounded-full ${
                facility.status === 'Critical' ? 'bg-red-500 animate-pulse' : 'bg-orange-500'
              }`} />
              <div className="absolute top-4 left-1/2 -translate-x-1/2 whitespace-nowrap">
                <span className="text-xs text-[#94A3B8]">{facility.name}</span>
              </div>
            </div>
          ))}
          {/* Add visibility radius indicator */}
          <div className="absolute inset-4 border-2 border-[#3B82F6]/20 rounded-full" />
        </div>
      </div>
    </div>
  )
}

// Enhanced FacilityStatus component
function FacilityStatus({ facility }: { facility: any }) {
  const getStatusColor = (value: number, type: string) => {
    const thresholds = {
      security: { critical: 70, warning: 85 },
      power: { critical: 60, warning: 80 },
      comms: { critical: 50, warning: 75 }
    }
    const threshold = thresholds[type as keyof typeof thresholds]
    return value < threshold.critical ? 'bg-red-400' :
           value < threshold.warning ? 'bg-yellow-400' : 'bg-green-400'
  }

  return (
    <div className={`bg-[#1E293B] p-4 rounded-lg border ${
      facility.status === 'Critical' ? 'border-red-500/50' : 'border-orange-500/50'
    }`}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full ${
            facility.status === 'Critical' ? 'bg-red-500 animate-pulse' : 'bg-orange-500'
          }`} />
          <h4 className="text-[#F8FAFC] font-medium">{facility.name}</h4>
        </div>
        <span className={`text-sm px-2 py-1 rounded ${
          facility.status === 'Critical' ? 'bg-red-500/20 text-red-400' : 'bg-orange-500/20 text-orange-400'
        }`}>
          {facility.status}
        </span>
      </div>

      <div className="space-y-3">
        {Object.entries(facility.systemStatus).map(([key, value]: [string, any]) => (
          <div key={key}>
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-[#94A3B8]">{key.charAt(0).toUpperCase() + key.slice(1)}</span>
              <div className="flex items-center gap-2">
                <span className={`text-sm px-2 py-0.5 rounded ${
                  value < 70 ? 'bg-red-500/20 text-red-400' :
                  value < 85 ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-green-500/20 text-green-400'
                }`}>
                  {value}%
                </span>
              </div>
            </div>
            <div className="w-full bg-[#334155] rounded-full h-2">
              <div className={`h-2 rounded-full transition-all duration-500 ${getStatusColor(value, key)}`}
                   style={{ width: `${value}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function EnvironmentalConditions() {
  return (
    <div className="bg-[#1E293B] rounded-lg p-4">
      <div className="flex items-center gap-3 mb-4">
        <Cloud className="w-5 h-5 text-[#3B82F6]" />
        <h3 className="text-[#94A3B8]">Environmental Conditions</h3>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {/* Weather Impact Card */}
        <div className="bg-[#0F172A] p-4 rounded-lg">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-2">
              <Cloud className="w-4 h-4 text-[#3B82F6]" />
              <span className="text-[#94A3B8]">Weather</span>
            </div>
            <span className="text-xs text-[#64748B]">15 mins ago</span>
          </div>
          <p className="text-xl text-[#F8FAFC] mb-2">Partly Cloudy</p>
          <div className="space-y-1">
            <p className="text-sm text-green-400 flex items-center gap-1">
              <ArrowUp className="w-3 h-3" /> Visibility good
            </p>
            <p className="text-sm text-green-400 flex items-center gap-1">
              <Check className="w-3 h-3" /> No impact on operations
            </p>
          </div>
        </div>

        {/* Visibility Impact Card */}
        <div className="bg-[#0F172A] p-4 rounded-lg">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-[#3B82F6]" />
              <span className="text-[#94A3B8]">Visibility</span>
            </div>
            <span className="text-xs text-[#64748B]">Current</span>
          </div>
          <p className="text-xl text-[#F8FAFC] mb-2">8.5 miles</p>
          <div className="space-y-1">
            <p className="text-sm text-green-400 flex items-center gap-1">
              <Check className="w-3 h-3" /> Optimal for operations
            </p>
            <p className="text-sm text-[#94A3B8]">Range: 6-10 miles</p>
          </div>
        </div>

        {/* Wind Impact Card */}
        <div className="bg-[#0F172A] p-4 rounded-lg">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-2">
              <Wind className="w-4 h-4 text-[#3B82F6]" />
              <span className="text-[#94A3B8]">Wind</span>
            </div>
            <span className="text-xs text-[#64748B]">Trending ↑</span>
          </div>
          <p className="text-xl text-[#F8FAFC] mb-2">12 mph NE</p>
          <div className="space-y-1">
            <p className="text-sm text-yellow-400 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" /> Monitor for changes
            </p>
            <p className="text-sm text-[#94A3B8]">Gusts up to 15 mph</p>
          </div>
        </div>

        {/* Light Conditions Card */}
        <div className="bg-[#0F172A] p-4 rounded-lg">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-2">
              <Sun className="w-4 h-4 text-[#3B82F6]" />
              <span className="text-[#94A3B8]">Light</span>
            </div>
            <span className="text-xs text-[#64748B]">4 hrs remaining</span>
          </div>
          <p className="text-xl text-[#F8FAFC] mb-2">Daylight</p>
          <div className="space-y-1">
            <p className="text-sm text-[#94A3B8]">Sunset: 19:30 Local</p>
            <p className="text-sm text-yellow-400 flex items-center gap-1">
              <Clock className="w-3 h-3" /> Plan night ops
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function MissionObjectives() {
  return (
    <div className="bg-[#1E293B] rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Shield className="w-5 h-5 text-[#3B82F6]" />
          <h3 className="text-[#94A3B8]">Mission Objectives</h3>
        </div>
        <span className="text-[#94A3B8] text-sm">Overall: 45% Complete</span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {[
          {
            title: "Secure Facilities",
            priority: "PRIORITY 1",
            progress: 25,
            dependsOn: "Security Teams",
            requiredFor: "System Protection",
            status: "in-progress"
          },
          {
            title: "System Failures",
            priority: "PRIORITY 2",
            progress: 60,
            dependsOn: "Tech Teams",
            requiredFor: "Service Continuity",
            status: "in-progress"
          },
          {
            title: "Neutralize Threats",
            priority: "PRIORITY 1",
            progress: 15,
            dependsOn: "Intel Reports",
            requiredFor: "Facility Security",
            status: "pending"
          },
          {
            title: "Critical Services",
            priority: "PRIORITY 2",
            progress: 80,
            dependsOn: "Power Systems",
            requiredFor: "Operations",
            status: "active"
          }
        ].map((objective, index) => (
          <div key={index} className="bg-[#0F172A] p-4 rounded-lg">
            <div className="flex justify-between items-start mb-3">
              <h4 className="text-[#F8FAFC] font-medium">{objective.title}</h4>
              <span className="text-xs px-2 py-1 bg-red-500/20 text-red-400 rounded">
                {objective.priority}
              </span>
            </div>
            
            <div className="mb-3">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-[#94A3B8]">Progress</span>
                <span className="text-[#F8FAFC]">{objective.progress}%</span>
              </div>
              <div className="w-full bg-[#334155] rounded-full h-2">
                <div 
                  className="bg-[#3B82F6] h-2 rounded-full transition-all duration-500"
                  style={{ width: `${objective.progress}%` }}
                />
              </div>
            </div>

            <div className="space-y-1 text-sm">
              <p className="text-[#94A3B8]">Depends on: 
                <span className="text-[#F8FAFC] ml-1">{objective.dependsOn}</span>
              </p>
              <p className="text-[#94A3B8]">Required for: 
                <span className="text-[#F8FAFC] ml-1">{objective.requiredFor}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// First define the sample data
const coaData = [
  {
    id: 1,
    title: "COA 1: Deploy Security Personnel",
    timeEstimate: "30-45 minutes",
    confidence: 92,
    risk: "Medium",
    brief: "Immediate deployment of 10 security teams in coordinated response. Teams Alpha & Bravo secure power station, Charlie & Delta secure water facility, Echo & Foxtrot secure comms hub. Remaining 4 teams establish outer perimeter.",
    resources: {
      required: 10,
      available: 12,
      readiness: 95,
      responseTime: 10
    },
    phases: [
      {
        phase: "Initial Response",
        time: "10 mins",
        teams: ["Alpha", "Bravo"],
        status: "pending"
      },
      {
        phase: "Secure Perimeter",
        time: "15 mins",
        teams: ["Charlie", "Delta"],
        status: "pending"
      },
      {
        phase: "Internal Sweep",
        time: "20 mins",
        teams: ["Echo", "Foxtrot"],
        status: "pending"
      }
    ],
    advantages: [
      "Quick response to critical facility",
      "Prevents cascade failure",
      "Clear priority focus"
    ],
    risks: [
      "Comms hub remains vulnerable",
      "May require additional resources"
    ]
  },
  // Add COA 2 and 3 with similar structure but different values
];

// Wrap just the modal component with dynamic import
const DynamicCOABuildModal = dynamic(
  () => Promise.resolve(COABuildModal),
  { ssr: false }
)

function COABuildModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [buildStep, setBuildStep] = useState(0)
  const [showSuccess, setShowSuccess] = useState(false)
  
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setBuildStep(1), 800)    
      const timer2 = setTimeout(() => setBuildStep(2), 1600)   
      const timer3 = setTimeout(() => setBuildStep(3), 2400)   
      
      return () => {
        clearTimeout(timer)
        clearTimeout(timer2)
        clearTimeout(timer3)
      }
    }
  }, [isOpen])

  const handleDownload = () => {
    setShowSuccess(true)
    setTimeout(() => {
      onClose()
    }, 1500)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          suppressHydrationWarning
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <motion.div
            suppressHydrationWarning
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-[#1E293B] rounded-xl p-8 w-[400px] shadow-xl"
          >
            <div suppressHydrationWarning className="space-y-6">
              <h3 suppressHydrationWarning className="text-xl text-[#F8FAFC] font-medium text-center">
                {showSuccess ? 'Package Downloaded!' : buildStep === 3 ? 'COA Package Ready' : 'Building COA Package'}
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  {buildStep > 0 ? (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  ) : (
                    <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
                  )}
                  <span className="text-[#94A3B8]">Compiling Intelligence</span>
                </div>

                <div className="flex items-center gap-3">
                  {buildStep > 1 ? (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  ) : buildStep >= 1 ? (
                    <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
                  ) : (
                    <div className="w-5 h-5" />
                  )}
                  <span className="text-[#94A3B8]">Generating Action Items</span>
                </div>

                <div className="flex items-center gap-3">
                  {buildStep > 2 ? (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  ) : buildStep >= 2 ? (
                    <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
                  ) : (
                    <div className="w-5 h-5" />
                  )}
                  <span className="text-[#94A3B8]">Finalizing Package</span>
                </div>
              </div>

              {buildStep === 3 && !showSuccess && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6 pt-4"
                >
                  <FileText className="w-16 h-16 text-green-400 mx-auto" />
                  <div className="flex flex-col items-center gap-4">
                    <button
                      onClick={handleDownload}
                      className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg 
                        transition-colors duration-200 text-center w-full"
                    >
                      Download COA Package
                    </button>
                    <button
                      onClick={onClose}
                      className="text-[#94A3B8] hover:text-white text-sm"
                    >
                      Close Window
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Add this new component
function ScenarioAnalysisResults() {
  return (
    <div className="bg-[#1E293B] rounded-lg p-4 mt-6">
      <div className="flex items-center gap-3 mb-4">
        <Activity className="w-5 h-5 text-[#3B82F6]" />
        <h3 className="text-[#94A3B8]">Scenario Analysis Results</h3>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Historical Cases */}
        <div className="bg-[#0F172A] p-4 rounded-lg">
          <div className="flex flex-col items-center text-center">
            <span className="text-3xl font-bold text-[#F8FAFC] mb-2">2.7M</span>
            <span className="text-sm text-[#94A3B8]">Historical Cases Analyzed</span>
          </div>
        </div>

        {/* Simulated Scenarios */}
        <div className="bg-[#0F172A] p-4 rounded-lg">
          <div className="flex flex-col items-center text-center">
            <span className="text-3xl font-bold text-[#F8FAFC] mb-2">5.3M</span>
            <span className="text-sm text-[#94A3B8]">Simulated Scenarios</span>
          </div>
        </div>

        {/* Analysis Confidence */}
        <div className="bg-[#0F172A] p-4 rounded-lg">
          <div className="flex flex-col items-center text-center">
            <span className="text-3xl font-bold text-[#F8FAFC] mb-2">98.7%</span>
            <span className="text-sm text-[#94A3B8]">Analysis Confidence</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// Wrap the page component
export default function OutputPage() {
  const [selectedCOA, setSelectedCOA] = useState<number | null>(null)
  const [showBuildModal, setShowBuildModal] = useState(false)

  const handleExecuteCOA = () => {
    setShowBuildModal(true)
  }

  return (
    <div suppressHydrationWarning className="min-h-screen bg-[#0F172A]">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-[90%] mx-auto py-8"
      >
        {/* Full Width Situation Overview */}
        <div className="bg-[#475569] rounded-xl mb-8">
          <h2 className="text-3xl text-[#F8FAFC] font-medium p-8">SITUATION OVERVIEW</h2>
          <div className="w-full px-8 pb-8">
            <div className="bg-[#0F172A] rounded-xl p-8 space-y-6">
              {/* Mission Timer */}
              <MissionTimer deadline={new Date(new Date().getTime() + 60 * 60 * 1000)} />

              {/* Location and Time Constraint */}
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-[#1E293B] rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Building2 className="w-5 h-5 text-[#3B82F6]" />
                    <h3 className="text-[#94A3B8]">Location</h3>
                  </div>
                  <p className="text-[#F8FAFC] text-lg">Sector 7</p>
                </div>

                <div className="bg-[#1E293B] rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Clock className="w-5 h-5 text-red-400" />
                    <h3 className="text-[#94A3B8]">Time Constraint</h3>
                  </div>
                  <p className="text-red-400 text-lg flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    {"< 1 hour"}
                  </p>
                </div>
              </div>

              {/* Three Column Layout for Main Info */}
              <div className="grid grid-cols-3 gap-6">
                {/* Affected Facilities - Updated styling */}
                <div className="bg-[#1E293B] rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-4">
                    <Signal className="w-5 h-5 text-[#3B82F6]" />
                    <h3 className="text-[#94A3B8]">Affected Facilities</h3>
                  </div>
                  {[
                    {
                      name: "Power distribution substation",
                      status: "Critical",
                      systemStatus: {
                        power: 85,
                        security: 60,
                        comms: 75
                      }
                    },
                    {
                      name: "Communications hub",
                      status: "Alert",
                      systemStatus: {
                        power: 95,
                        security: 70,
                        comms: 40
                      }
                    }
                  ].map((facility, index) => (
                    <FacilityStatus key={index} facility={facility} />
                  ))}
                </div>

                {/* Environmental Conditions */}
                <EnvironmentalConditions />

                {/* Mission Objectives */}
                <MissionObjectives />
              </div>

              {/* Add Scenario Analysis Results here - after the three columns */}
              <ScenarioAnalysisResults />
            </div>
          </div>
        </div>

        {/* COA Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-[#475569] rounded-xl p-8 mt-8"
        >
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl text-[#F8FAFC] font-medium mb-8"
          >
            COURSES OF ACTION
          </motion.h2>
          <div className="space-y-8">
            {[0, 1, 2].map((index) => (
              <div 
                key={index}
                className={`transition-all duration-300 ${
                  selectedCOA === index ? 'ring-2 ring-blue-500 scale-[1.01]' : ''
                }`}
              >
                <div onClick={() => setSelectedCOA(index)}>
                  <COACard coaIndex={index} />
                </div>
                {selectedCOA === index && (
                  <div className="mt-4 flex justify-end px-8 pb-4">
                    <button
                      onClick={() => setShowBuildModal(true)}
                      className="bg-[#3B82F6] hover:bg-[#2563EB] text-white px-6 py-2 rounded-lg 
                        transition-colors duration-200 flex items-center gap-2"
                    >
                      Execute COA
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
      
      {showBuildModal && (
        <DynamicCOABuildModal 
          isOpen={showBuildModal} 
          onClose={() => setShowBuildModal(false)} 
        />
      )}
    </div>
  );
}
