'use client'
import { MapContainer, TileLayer, ZoomControl, LayerGroup, Circle, Marker, Popup, Polyline, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { useState, useRef, useEffect } from 'react'

// Create a click handler component
function MapClickHandler({ onMapClick }: { onMapClick: (e: L.LeafletMouseEvent) => void }) {
  useMapEvents({
    click: onMapClick,
  })
  return null
}

interface AssignedResource {
  id: string;
  name: string;
  type: string;
  status: string;
}

interface MapComponentProps {
  onResourceAction: () => void;
}

export default function MapComponent({ onResourceAction }: MapComponentProps) {
  const [layers, setLayers] = useState({
    command: true,
    military: true,
    infrastructure: true,
    intelligence: true
  })

  const [incidents, setIncidents] = useState<{
    id: string;
    position: [number, number];
    type: string;
    priority: 'High' | 'Medium' | 'Low';
  }[]>([])

  const [isPlacingIncident, setIsPlacingIncident] = useState(false)
  const mapRef = useRef<L.Map>(null)

  // Incident types
  const incidentTypes = [
    'Hostile Contact',
    'IED Found',
    'Civil Unrest',
    'Medical Emergency',
    'Supply Request',
    'Intelligence Report'
  ]

  const legendItems = [
    { type: 'hq', symbol: '★', label: 'Headquarters', statuses: ['blue'] },
    { type: 'air', symbol: '⬢', label: 'Air Assets', statuses: ['green', 'amber', 'red'] },
    { type: 'qrf', symbol: '▲', label: 'Quick Reaction Force', statuses: ['green', 'amber'] },
    { type: 'infantry', symbol: '■', label: 'Infantry Units', statuses: ['green'] },
    { type: 'medical', symbol: '+', label: 'Medical Facility', statuses: ['green'] },
    { type: 'supply', symbol: '◆', label: 'Supply Depot', statuses: ['green'] },
    { type: 'bridge', symbol: '═', label: 'Bridge', statuses: ['orange'] },
    { type: 'airfield', symbol: '✈', label: 'Airfield', statuses: ['purple'] },
    { type: 'hlz', symbol: 'H', label: 'Landing Zone', statuses: ['green'] },
    { type: 'sensor', symbol: 'S', label: 'Sensor', statuses: ['emerald'] },
    { type: 'sigint', symbol: '📡', label: 'SIGINT', statuses: ['purple'] },
    { type: 'incident', symbol: '!', label: 'Incident', statuses: ['red'] }
  ]

  const positions = {
    hq: {
      position: [62.0548, -132.2644],
      name: 'HQ Command',
      status: 'blue'
    },
    heli_base_1: {
      position: [62.1548, -132.0644],
      units: [
        { id: 'uh60_1', offset: [0.005, 0.005], type: 'UH-60', status: 'green' },
        { id: 'uh60_2', offset: [-0.15, 0.1], type: 'UH-60', status: 'amber' },
        { id: 'ah64_1', offset: [0.2, -0.15], type: 'AH-64', status: 'green' },
        { id: 'ah64_2', offset: [-0.1, -0.2], type: 'AH-64', status: 'green' }
      ]
    },
    heli_base_2: {
      position: [61.7948, -132.6644],
      units: [
        { id: 'uh60_3', offset: [0.005, 0.005], type: 'UH-60', status: 'green' },
        { id: 'uh60_4', offset: [-0.15, 0.1], type: 'UH-60', status: 'red' },
        { id: 'ah64_3', offset: [0.2, -0.15], type: 'AH-64', status: 'amber' },
        { id: 'ah64_4', offset: [-0.1, -0.2], type: 'AH-64', status: 'green' }
      ]
    },
    infantry: [
      {
        id: 'inf_1',
        position: [62.0748, -132.2644],
        name: 'Alpha Company',
        status: 'green',
        strength: '120/120'
      },
      {
        id: 'inf_2',
        position: [61.9748, -132.5644],
        name: 'Bravo Company',
        status: 'amber',
        strength: '115/120'
      },
      {
        id: 'inf_3',
        position: [62.0248, -132.3644],
        name: 'Charlie Company',
        status: 'green',
        strength: '118/120'
      },
      {
        id: 'inf_4',
        position: [61.8748, -132.5644],
        name: 'Delta Company',
        status: 'green',
        strength: '120/120'
      }
    ],
    medical: [
      {
        id: 'med_1',
        position: [62.0548, -132.2844],
        name: 'Field Hospital Alpha',
        capacity: '20/20 beds'
      },
      {
        id: 'med_2',
        position: [61.8948, -132.5644],
        name: 'Field Hospital Bravo',
        capacity: '20/20 beds'
      }
    ],
    supply_depot: {
      position: [61.9948, -132.3644],
      name: 'Main Supply Depot',
      status: 'green'
    },
    routes: {
      primary: [
        [
          [62.1548, -132.0644],
          [62.0748, -132.2644],
          [61.9748, -132.4644],
          [61.8948, -132.5644],
          [61.7948, -132.6644]
        ],
        [
          [62.0548, -131.9644],
          [62.0448, -132.0644],
          [62.0348, -132.1644],
          [62.0248, -132.2644],
          [62.0148, -132.3644],
          [61.9948, -132.4644],
          [61.9748, -132.5644],
          [61.9548, -132.6644],
          [61.9248, -132.7644]
        ]
      ],
      alternate: [
        [
          [62.1748, -132.1644],
          [62.1548, -132.2144],
          [62.1348, -132.2644],
          [62.1248, -132.2844],
          [62.0948, -132.3144],
          [62.0548, -132.3644],
          [62.0248, -132.4144],
          [61.9748, -132.4644]
        ],
        [
          [61.9748, -132.4644],
          [61.9548, -132.5144],
          [61.9348, -132.5644],
          [61.9148, -132.5944],
          [61.8948, -132.6244],
          [61.8748, -132.6644],
          [61.8548, -132.7144],
          [61.7748, -132.7644]
        ]
      ]
    },
    bridges: [
      {
        position: [62.0248, -132.3644],
        name: 'Bridge Alpha',
        type: 'Main Supply Route Bridge',
        capacity: '60 tons',
        description: 'Primary river crossing'
      },
      {
        position: [61.9148, -132.5944],
        name: 'Bridge Bravo',
        type: 'Tactical Vehicle Bridge',
        capacity: '40 tons',
        description: 'Southern river crossing'
      },
      {
        position: [62.1248, -132.2844],
        name: 'Bridge Charlie',
        type: 'Light Vehicle Bridge',
        capacity: '20 tons',
        description: 'Mountain pass crossing'
      }
    ],
    airfields: [
      {
        position: [62.0548, -132.1644],
        name: 'Airfield Alpha',
        size: 'Medium',
        surface: 'Paved',
        fuel: true,
        description: 'Main support airfield'
      },
      {
        position: [61.8448, -132.5644],
        name: 'Airfield Bravo',
        size: 'Small',
        surface: 'Gravel',
        fuel: false,
        description: 'Forward support strip'
      }
    ],
    hlz: [
      {
        position: [62.0548, -132.2644],
        name: 'HLZ Alpha',
        size: 'Platoon',
        description: 'Northern valley support'
      },
      {
        position: [61.9748, -132.4644],
        name: 'HLZ Bravo',
        size: 'Company',
        description: 'Central command support'
      },
      {
        position: [61.9348, -132.5644],
        name: 'HLZ Charlie',
        size: 'Squad',
        description: 'Southern QRF support'
      },
      {
        position: [61.8748, -132.6644],
        name: 'HLZ Delta',
        size: 'Platoon',
        description: 'Southern valley support'
      }
    ]
  }

  const handleMapClick = (e: L.LeafletMouseEvent) => {
    if (isPlacingIncident && incidents.length < 3) {
      const newIncident = {
        id: ['Alpha', 'Bravo', 'Charlie'][incidents.length],
        position: [e.latlng.lat, e.latlng.lng],
        type: incidentTypes[0],
        priority: 'High' as const
      }
      setIncidents([...incidents, newIncident])
      setIsPlacingIncident(false)
    }
  }

  const handleDeleteIncident = (id: string) => {
    setIncidents(incidents.filter(incident => incident.id !== id))
  }

  const handleUpdateIncident = (id: string, updates: Partial<typeof incidents[0]>) => {
    setIncidents(incidents.map(incident => 
      incident.id === id ? { ...incident, ...updates } : incident
    ))
  }

  const createMilitaryMarker = (type: string, status: string) => {
    const symbols = {
      hq: '★',
      air: '⬢',
      qrf: '▲',
      infantry: '■',
      medical: '+',
      supply: '◆'
    }

    return L.divIcon({
      html: `<div class="w-6 h-6 rounded-lg bg-${status}-500 border-2 border-white flex items-center justify-center text-white font-bold">${symbols[type] || '●'}</div>`,
      className: '',
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    })
  }

  // Add state for assigned resources
  const [assignedResources, setAssignedResources] = useState<AssignedResource[]>([])

  // Update the handler to add resources to the panel
  const handleAddToScenario = (type: string, id: string, name: string, status: string) => {
    const newResource = { id, name, type, status }
    setAssignedResources(prev => [...prev, newResource])
  }

  // Add handler to remove resources
  const handleRemoveResource = (id: string) => {
    setAssignedResources(prev => prev.filter(resource => resource.id !== id))
  }

  // Add state for primary actions
  const [scenarioCompletion, setScenarioCompletion] = useState(0)
  const [validationStatus, setValidationStatus] = useState<'valid' | 'invalid' | 'pending'>('pending')
  const [isGeneratingCOAs, setIsGeneratingCOAs] = useState(false)

  // Add this effect right after those state declarations:
  useEffect(() => {
    // Calculate completion based on assigned resources
    // Let's say we need at least 5 resources for 100%
    const completion = Math.min(Math.round((assignedResources.length / 5) * 100), 100)
    setScenarioCompletion(completion)
  }, [assignedResources])

  // Add handlers for primary actions
  const handleSaveDraft = () => {
    // Implement save draft logic
  }

  const handleSaveTemplate = () => {
    // Implement save template logic
  }

  const handleLoadTemplate = () => {
    // Implement load template logic
  }

  const handleGenerateCOAs = () => {
    setIsGeneratingCOAs(true)
    // Implement COA generation logic
    setTimeout(() => setIsGeneratingCOAs(false), 2000) // Simulated delay
  }

  const handleSubmitReview = () => {
    // Implement submit review logic
  }

  const handleShareScenario = () => {
    // Implement share scenario logic
  }

  const handleExportDetails = () => {
    // Implement export details logic
  }

  return (
    <div className="space-y-4">
      <div className="w-full h-[calc(100vh-180px)]">
        {/* Legend Panel */}
        <div className="absolute top-4 left-4 z-[1000] bg-[#1E293B] rounded-lg p-4 shadow-lg">
          <h3 className="text-[#F8FAFC] font-medium mb-3">Legend</h3>
          <div className="space-y-3">
            {legendItems.map((item) => (
              <div key={item.type} className="text-[#F8FAFC]">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{item.symbol}</span>
                  <span>{item.label}</span>
                </div>
                <div className="flex gap-2 ml-6">
                  {item.statuses.map((status) => (
                    <div key={status} className="flex items-center gap-1">
                      <span className={`w-2 h-2 rounded-full bg-${status}-500`}></span>
                      <span className="text-sm">
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Incident Control Panel */}
        <div className="absolute top-4 right-4 z-[1000] bg-[#1E293B] rounded-lg p-4 shadow-lg">
          <h3 className="text-[#F8FAFC] font-medium mb-3">Layer Control</h3>
          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-[#F8FAFC]">
              <input
                type="checkbox"
                checked={layers.command}
                onChange={(e) => setLayers({ ...layers, command: e.target.checked })}
                className="rounded border-gray-300"
              />
              <span>Command</span>
            </label>
            <label className="flex items-center space-x-2 text-[#F8FAFC]">
              <input
                type="checkbox"
                checked={layers.military}
                onChange={(e) => setLayers({ ...layers, military: e.target.checked })}
                className="rounded border-gray-300"
              />
              <span>Military</span>
            </label>
            <label className="flex items-center space-x-2 text-[#F8FAFC]">
              <input
                type="checkbox"
                checked={layers.infrastructure}
                onChange={(e) => setLayers({ ...layers, infrastructure: e.target.checked })}
                className="rounded border-gray-300"
              />
              <span>Infrastructure</span>
            </label>
            <label className="flex items-center space-x-2 text-[#F8FAFC]">
              <input
                type="checkbox"
                checked={layers.intelligence}
                onChange={(e) => setLayers({ ...layers, intelligence: e.target.checked })}
                className="rounded border-gray-300"
              />
              <span>Intelligence</span>
            </label>
          </div>
          <div className="mt-4">
            <button
              onClick={() => setIsPlacingIncident(true)}
              disabled={incidents.length >= 3 || isPlacingIncident}
              className={`w-full py-2 px-4 rounded ${
                incidents.length >= 3 || isPlacingIncident
                  ? 'bg-gray-500 cursor-not-allowed'
                  : 'bg-red-600 hover:bg-red-700'
              } text-white`}
            >
              {isPlacingIncident ? 'Click Map to Place Incident' : 'Place Incident'}
            </button>
            {incidents.length > 0 && (
              <div className="mt-2 space-y-2">
                {incidents.map(incident => (
                  <div key={incident.id} className="text-[#F8FAFC] text-sm">
                    Incident {incident.id}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Assigned Resources Panel */}
        <div className="absolute bottom-4 right-4 z-[1000] bg-[#1E293B] rounded-lg p-4 shadow-lg min-w-[250px]">
          <h3 
            className="text-[#F8FAFC] font-medium mb-3 cursor-pointer hover:text-blue-400"
            onClick={onResourceAction}
          >
            Assigned Resources
          </h3>
          {assignedResources.length === 0 ? (
            <div className="text-[#94A3B8] text-sm italic">
              No resources assigned
            </div>
          ) : (
            <div className="space-y-2">
              {assignedResources.map((resource) => (
                <div 
                  key={resource.id} 
                  className="flex items-center justify-between bg-[#334155] p-2 rounded"
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full bg-${resource.status}-500`}></span>
                    <span className="text-[#F8FAFC] text-sm">{resource.name}</span>
                  </div>
                  <button
                    onClick={() => handleRemoveResource(resource.id)}
                    className="text-[#94A3B8] hover:text-red-500"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <MapContainer
          center={[61.9748, -132.4644]}
          zoom={11}
          className="h-full w-full"
          zoomControl={false}
          attributionControl={false}
        >
          <MapClickHandler onMapClick={handleMapClick} />
          <TileLayer 
            url="https://tiles.stadiamaps.com/tiles/stamen_terrain_background/{z}/{x}/{y}{r}.png"
            maxZoom={20}
          />
          <ZoomControl position="bottomright" />

          {/* Command Layer */}
          {layers.command && (
            <LayerGroup>
              <Marker
                position={positions.hq.position as L.LatLngExpression}
                icon={createMilitaryMarker('hq', positions.hq.status)}
              >
                <Popup>
                  <div>
                    <h3 className="text-lg mb-2">{positions.hq.name}</h3>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                      <span>Command Status: Active</span>
                    </div>
                    <button 
                      onClick={() => handleAddToScenario('command', 'hq', positions.hq.name, 'blue')}
                      className="w-full bg-blue-600 text-white py-2 rounded mt-2"
                    >
                      Add to Scenario
                    </button>
                  </div>
                </Popup>
              </Marker>
            </LayerGroup>
          )}

          {/* Military Layer */}
          {layers.military && (
            <LayerGroup>
              {/* Helicopter Base 1 */}
              {positions.heli_base_1.units.map((unit) => (
                <Marker
                  key={unit.id}
                  position={[
                    positions.heli_base_1.position[0] + unit.offset[0],
                    positions.heli_base_1.position[1] + unit.offset[1]
                  ] as L.LatLngExpression}
                  icon={createMilitaryMarker('air', unit.status)}
                >
                  <Popup>
                    <div>
                      <h3 className="text-lg mb-2">{unit.type}</h3>
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full bg-${unit.status}-500`}></span>
                        <span>Status: {unit.status.toUpperCase()}</span>
                      </div>
                      <button 
                        onClick={() => handleAddToScenario('military', unit.id, unit.type, unit.status)}
                        className="w-full bg-blue-600 text-white py-2 rounded mt-2"
                      >
                        Add to Scenario
                      </button>
                    </div>
                  </Popup>
                </Marker>
              ))}

              {/* Helicopter Base 2 */}
              {positions.heli_base_2.units.map((unit) => (
                <Marker
                  key={unit.id}
                  position={[
                    positions.heli_base_2.position[0] + unit.offset[0],
                    positions.heli_base_2.position[1] + unit.offset[1]
                  ] as L.LatLngExpression}
                  icon={createMilitaryMarker('air', unit.status)}
                >
                  <Popup>
                    <div>
                      <h3 className="text-lg mb-2">{unit.type}</h3>
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full bg-${unit.status}-500`}></span>
                        <span>Status: {unit.status.toUpperCase()}</span>
                      </div>
                      <button 
                        onClick={() => handleAddToScenario('military', unit.id, unit.type, unit.status)}
                        className="w-full bg-blue-600 text-white py-2 rounded mt-2"
                      >
                        Add to Scenario
                      </button>
                    </div>
                  </Popup>
                </Marker>
              ))}

              {/* Infantry Units */}
              {positions.infantry.map((unit) => (
                <Marker
                  key={unit.id}
                  position={unit.position as L.LatLngExpression}
                  icon={createMilitaryMarker('infantry', unit.status)}
                >
                  <Popup>
                    <div>
                      <h3 className="text-lg mb-2">{unit.name}</h3>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span>Strength:</span>
                          <span>{unit.strength}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`w-2 h-2 rounded-full bg-${unit.status}-500`}></span>
                        <span>Status: {unit.status.toUpperCase()}</span>
                      </div>
                      <button 
                        onClick={() => handleAddToScenario('military', unit.id, unit.name, unit.status)}
                        className="w-full bg-blue-600 text-white py-2 rounded mt-2"
                      >
                        Add to Scenario
                      </button>
                    </div>
                  </Popup>
                </Marker>
              ))}

              {/* Medical Facilities */}
              {positions.medical.map((facility) => (
                <Marker
                  key={facility.id}
                  position={facility.position as L.LatLngExpression}
                  icon={createMilitaryMarker('medical', 'green')}
                >
                  <Popup>
                    <div>
                      <h3 className="text-lg mb-2">{facility.name}</h3>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span>Capacity:</span>
                          <span>{facility.capacity}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        <span>Status: Operational</span>
                      </div>
                      <button 
                        onClick={() => handleAddToScenario('military', facility.id, facility.name, 'green')}
                        className="w-full bg-blue-600 text-white py-2 rounded mt-2"
                      >
                        Add to Scenario
                      </button>
                    </div>
                  </Popup>
                </Marker>
              ))}

              {/* Supply Depot */}
              <Marker
                position={positions.supply_depot.position as L.LatLngExpression}
                icon={createMilitaryMarker('supply', 'green')}
              >
                <Popup>
                  <div>
                    <h3 className="text-lg mb-2">{positions.supply_depot.name}</h3>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-500"></span>
                      <span>Status: Fully Stocked</span>
                    </div>
                    <button 
                      onClick={() => handleAddToScenario('military', 'supply_depot', positions.supply_depot.name, 'green')}
                      className="w-full bg-blue-600 text-white py-2 rounded mt-2"
                    >
                      Add to Scenario
                    </button>
                  </div>
                </Popup>
              </Marker>
            </LayerGroup>
          )}

          {/* Infrastructure Layer */}
          {layers.infrastructure && (
            <LayerGroup>
              {/* Primary Routes */}
              {positions.routes.primary.map((route, index) => (
                <Polyline
                  key={`primary_${index}`}
                  positions={route as L.LatLngExpression[]}
                  pathOptions={{ color: '#3b82f6', weight: 4 }}
                />
              ))}

              {/* Alternate Routes */}
              {positions.routes.alternate.map((route, index) => (
                <Polyline
                  key={`alternate_${index}`}
                  positions={route as L.LatLngExpression[]}
                  pathOptions={{ color: '#64748b', weight: 3, dashArray: '5, 10' }}
                />
              ))}

              {/* Bridges */}
              {positions.bridges.map((bridge) => (
                <Marker
                  key={bridge.name}
                  position={bridge.position as L.LatLngExpression}
                  icon={L.divIcon({
                    html: `<div class="w-6 h-6 flex items-center justify-center bg-orange-500 border-2 border-white text-white font-bold">═</div>`,
                    className: '',
                    iconSize: [24, 24],
                    iconAnchor: [12, 12]
                  })}
                >
                  <Popup>
                    <div>
                      <h3 className="text-lg mb-2">{bridge.name}</h3>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span>Type:</span>
                          <span>{bridge.type}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Capacity:</span>
                          <span>{bridge.capacity}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Role:</span>
                          <span>{bridge.description}</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleAddToScenario('infrastructure', bridge.name.toLowerCase(), bridge.name, 'orange')}
                        className="w-full bg-blue-600 text-white py-2 rounded mt-2"
                      >
                        Add to Scenario
                      </button>
                    </div>
                  </Popup>
                </Marker>
              ))}

              {/* Airfields */}
              {positions.airfields.map((airfield) => (
                <Marker
                  key={airfield.name}
                  position={airfield.position as L.LatLngExpression}
                  icon={L.divIcon({
                    html: `<div class="w-6 h-6 flex items-center justify-center bg-purple-500 border-2 border-white text-white font-bold">✈</div>`,
                    className: '',
                    iconSize: [24, 24],
                    iconAnchor: [12, 12]
                  })}
                >
                  <Popup>
                    <div>
                      <h3 className="text-lg mb-2">{airfield.name}</h3>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span>Size:</span>
                          <span>{airfield.size}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Surface:</span>
                          <span>{airfield.surface}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Fuel:</span>
                          <span>{airfield.fuel ? 'Available' : 'Not Available'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Role:</span>
                          <span>{airfield.description}</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleAddToScenario('infrastructure', airfield.name.toLowerCase(), airfield.name, 'purple')}
                        className="w-full bg-blue-600 text-white py-2 rounded mt-2"
                      >
                        Add to Scenario
                      </button>
                    </div>
                  </Popup>
                </Marker>
              ))}

              {/* HLZs */}
              {positions.hlz.map((hlz) => (
                <Marker
                  key={hlz.name}
                  position={hlz.position as L.LatLngExpression}
                  icon={L.divIcon({
                    html: `<div class="w-6 h-6 flex items-center justify-center bg-green-500 border-2 border-white text-white font-bold">H</div>`,
                    className: '',
                    iconSize: [24, 24],
                    iconAnchor: [12, 12]
                  })}
                >
                  <Popup>
                    <div>
                      <h3 className="text-lg mb-2">{hlz.name}</h3>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span>Type:</span>
                          <span>Landing Zone</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Capacity:</span>
                          <span>{hlz.size}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Role:</span>
                          <span>{hlz.description}</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleAddToScenario('infrastructure', hlz.name.toLowerCase(), hlz.name, 'green')}
                        className="w-full bg-blue-600 text-white py-2 rounded mt-2"
                      >
                        Add to Scenario
                      </button>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </LayerGroup>
          )}

          {/* Incident Layer */}
          <LayerGroup>
            {incidents.map(incident => (
              <LayerGroup key={incident.id}>
                <Marker
                  position={incident.position as L.LatLngExpression}
                  icon={L.divIcon({
                    html: `<div class="w-8 h-8 flex items-center justify-center bg-red-500 border-2 border-white text-white font-bold rounded-full">!</div>`,
                    className: '',
                    iconSize: [32, 32],
                    iconAnchor: [16, 16]
                  })}
                  draggable={true}
                  eventHandlers={{
                    dragend: (e) => {
                      const marker = e.target
                      const position = marker.getLatLng()
                      handleUpdateIncident(incident.id, {
                        position: [position.lat, position.lng]
                      })
                    }
                  }}
                >
                  <Popup>
                    <div className="w-64">
                      <h3 className="text-lg font-bold mb-2">Incident {incident.id}</h3>
                      <div className="space-y-2">
                        <div>
                          <label className="block text-sm font-medium">Type</label>
                          <select
                            value={incident.type}
                            onChange={(e) => handleUpdateIncident(incident.id, { type: e.target.value })}
                            className="w-full mt-1 rounded border-gray-300"
                          >
                            {incidentTypes.map(type => (
                              <option key={type} value={type}>{type}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium">Priority</label>
                          <select
                            value={incident.priority}
                            onChange={(e) => handleUpdateIncident(incident.id, { 
                              priority: e.target.value as 'High' | 'Medium' | 'Low' 
                            })}
                            className="w-full mt-1 rounded border-gray-300"
                          >
                            <option value="High">High</option>
                            <option value="Medium">Medium</option>
                            <option value="Low">Low</option>
                          </select>
                        </div>
                        <button
                          onClick={() => handleDeleteIncident(incident.id)}
                          className="w-full bg-red-600 text-white py-2 rounded mt-2"
                        >
                          Delete Incident
                        </button>
                      </div>
                    </div>
                  </Popup>
                </Marker>
                {/* Distance Rings */}
                <Circle
                  center={incident.position as L.LatLngExpression}
                  radius={5000}
                  pathOptions={{ color: '#DC2626', weight: 1, dashArray: '5,10', fillOpacity: 0 }}
                />
                <Circle
                  center={incident.position as L.LatLngExpression}
                  radius={10000}
                  pathOptions={{ color: '#DC2626', weight: 1, dashArray: '5,10', fillOpacity: 0 }}
                />
              </LayerGroup>
            ))}
          </LayerGroup>
        </MapContainer>
      </div>
    </div>
  )
} 