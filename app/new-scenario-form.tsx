"use client"

import { useState, useEffect } from "react"
import { 
  Database, Radio, Satellite, FileText, 
  Users, FileSpreadsheet, Globe, Wifi, 
  Plane,
  Crosshair, Upload, Network
} from 'lucide-react'

export function NewScenarioForm() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [dragTarget, setDragTarget] = useState<'active' | 'additional' | null>(null)
  const [connectingItems, setConnectingItems] = useState<string[]>([])
  const [dragging, setDragging] = useState(false)
  
  const [activeSources, setActiveSources] = useState([
    { 
      id: 'joint-ops-db',
      name: "Joint Operations Database",
      iconType: "database"
    },
    { 
      id: 'theater-intel',
      name: "Theater Command Intel",
      iconType: "radio"
    },
    { 
      id: 'isr-feed',
      name: "ISR Feed",
      iconType: "satellite"
    },
    { 
      id: 'unified-platform',
      name: "Unified Intel Platform",
      iconType: "network"
    }
  ])

  const [additionalSources, setAdditionalSources] = useState([
    { id: 'humint', name: 'HUMINT Collection Teams', iconType: 'users' },
    { id: 'div-brigade', name: 'Division/Brigade Intel Reports', iconType: 'fileSpreadsheet' },
    { id: 'osint', name: 'OSINT Analysis Cell', iconType: 'globe' },
    { id: 'ew-data', name: 'Electronic Warfare Data', iconType: 'wifi' },
    { id: 'uas-feeds', name: 'UAS Feeds', iconType: 'plane' },
    { id: 'forward-obs', name: 'Forward Observer Reports', iconType: 'crosshair' }
  ])

  useEffect(() => {
    setIsLoaded(true)
  }, [])

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

  return (
    <div className={`space-y-6 transition-all duration-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      <h1 className={`text-2xl text-[#F8FAFC] transition-all duration-500 delay-100 ${
        isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}>
        New Scenario Analysis
      </h1>
      
      <div className="space-y-6">
        {/* Scenario Description and Time Constraint Row */}
        <div className="grid grid-cols-3 gap-6">
          {/* Scenario Description Section */}
          <div className={`col-span-2 bg-[#1B1B35] rounded-lg p-6 transition-all duration-500 delay-200 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            <label className="block text-[#94A3B8] mb-2">Scenario Description</label>
            <textarea 
              className="w-full h-32 p-3 rounded-md bg-white text-[#1E293B]"
              placeholder="Describe the current situation and objectives..."
            />
          </div>

          {/* Time Constraint Section */}
          <div className={`bg-[#1B1B35] rounded-lg p-6 transition-all duration-500 delay-300 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            <label className="block text-[#94A3B8] mb-2">Time Constraint</label>
            <div className="space-y-2">
              {[
                { value: 'immediate', label: 'Immediate', desc: '< 1 hour' },
                { value: 'urgent', label: 'Urgent', desc: '< 6 hours' },
                { value: 'priority', label: 'Priority', desc: '< 24 hours' },
                { value: 'routine', label: 'Routine', desc: '< 72 hours' },
                { value: 'planning', label: 'Planning', desc: '> 72 hours' }
              ].map((option) => (
                <label key={option.value} className="flex items-center gap-2 text-[#F8FAFC] cursor-pointer">
                  <input 
                    type="radio" 
                    name="timeConstraint" 
                    value={option.value}
                    className="text-[#4CAF50] focus:ring-[#4CAF50]"
                  />
                  <span>{option.label}</span>
                  <span className="text-[#94A3B8] text-sm">({option.desc})</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Active Intelligence Sources Section */}
        <div className="relative">
          <div 
            className={`bg-[#1B1B35] rounded-lg p-6 relative ${
              dragTarget === 'active' ? 'ring-2 ring-[#4CAF50]' : ''
            }`}
            onDragOver={(e) => handleDragOver(e, 'active')}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, 'active')}
          >
            <h3 className="text-[#94A3B8] mb-4">Active Intelligence Sources</h3>
            <div className={`grid grid-cols-2 gap-4 relative ${
              dragTarget === 'active' ? 'opacity-50' : ''
            }`}>
              {activeSources.map((source) => (
                <div 
                  key={source.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, source, 'active')}
                  className="group flex items-center gap-3 p-3 rounded-lg bg-[#1E293B] transition-all duration-300 hover:bg-[#252f43] cursor-move relative overflow-hidden"
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

        {/* Additional Data Sources Section */}
        <div className="relative">
          <div 
            className={`bg-[#1B1B35] rounded-lg p-6 relative ${
              dragTarget === 'additional' ? 'ring-2 ring-[#4CAF50]' : ''
            }`}
            onDragOver={(e) => handleDragOver(e, 'additional')}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, 'additional')}
          >
            <h3 className="text-[#94A3B8] mb-4">Additional Data Sources</h3>
            <div className={`grid grid-cols-2 gap-4 relative ${
              dragTarget === 'additional' ? 'opacity-50' : ''
            }`}>
              {additionalSources.map((source) => (
                <div 
                  key={source.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, source, 'additional')}
                  className="flex items-center gap-3 cursor-move group p-3 rounded-lg bg-[#1E293B] transition-all duration-300 hover:bg-[#252f43]"
                >
                  <div className="p-2 rounded-full bg-[#2A3441]">
                    {getIconComponent(source.iconType, false)}
                  </div>
                  <span className="text-[#94A3B8]">{source.name}</span>
                </div>
              ))}
            </div>
            {dragTarget === 'additional' && (
              <div className="absolute inset-0 border-2 border-dashed border-[#4CAF50] rounded-lg flex items-center justify-center bg-[#1B1B35]/50">
                <p className="text-[#4CAF50] text-lg font-medium">Drop to Move Source</p>
              </div>
            )}
          </div>
        </div>

        {/* File Upload Section */}
        <div className={`bg-[#1B1B35] rounded-lg p-6 transition-all duration-500 delay-600 ${
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <div 
            className={`
              border-2 border-dashed border-[#334155] rounded-lg p-8
              flex flex-col items-center justify-center gap-4
              ${dragging ? 'bg-[#334155]' : 'bg-transparent'}
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
            <p className="text-[#94A3B8]">Drag and drop files here or click to browse</p>
          </div>
        </div>

        <button className={`w-full py-3 bg-[#1976d2] text-white rounded-md hover:bg-[#1565c0] 
          transition-all duration-500 delay-700 ${
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          Generate Analysis
        </button>
      </div>
    </div>
  )
} 