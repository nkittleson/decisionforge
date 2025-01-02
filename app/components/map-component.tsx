'use client'
import { MapContainer, TileLayer, ZoomControl, LayerGroup, Circle, Marker, Popup, Polyline, useMapEvents, Polygon } from 'react-leaflet'
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
    military: false,
    infrastructure: false,
    intelligence: false
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
    command: {
      main_cp: {
        id: 'cp_main',
        position: [62.0548, -132.2644],
        name: 'Main Command Post',
        status: 'operational'
      },
      aux_cp: [
        {
          id: 'cp_aux_1',
          position: [62.2548, -132.0644], // ~25km NE
          name: 'Auxiliary Command Post Alpha',
          status: 'operational'
        },
        {
          id: 'cp_aux_2',
          position: [61.8548, -132.4644], // ~25km SW
          name: 'Auxiliary Command Post Bravo',
          status: 'operational'
        }
      ]
    },
    helicopters: [
      {
        id: 'ah64_1',
        position: [62.1548, -132.1644],
        type: 'AH-64',
        status: 'green',
        role: 'Attack'
      },
      {
        id: 'ah64_2',
        position: [61.9548, -132.3644],
        type: 'AH-64',
        status: 'green',
        role: 'Attack'
      },
      {
        id: 'ah64_3',
        position: [62.0548, -132.4644],
        type: 'AH-64',
        status: 'green',
        role: 'Attack'
      },
      {
        id: 'ah64_4',
        position: [61.8548, -132.2644],
        type: 'AH-64',
        status: 'amber',
        role: 'Attack'
      },
      {
        id: 'uh60_1',
        position: [62.2048, -132.2644],
        type: 'UH-60',
        status: 'green',
        role: 'Transport'
      },
      {
        id: 'uh60_2',
        position: [61.9048, -132.1644],
        type: 'UH-60',
        status: 'green',
        role: 'Transport'
      },
      {
        id: 'uh60_3',
        position: [62.1048, -132.3644],
        type: 'UH-60',
        status: 'green',
        role: 'Transport'
      },
      {
        id: 'uh60_4',
        position: [61.8048, -132.4644],
        type: 'UH-60',
        status: 'amber',
        role: 'Transport'
      },
      {
        id: 'ch47_1',
        position: [62.0048, -132.1644],
        type: 'CH-47',
        status: 'green',
        role: 'Heavy Transport'
      },
      {
        id: 'ch47_2',
        position: [61.9548, -132.5644],
        type: 'CH-47',
        status: 'green',
        role: 'Heavy Transport'
      }
    ],
    infrastructure: {
      power: {
        main_station: {
          id: 'power_main',
          position: [62.0548, -132.4644],
          name: 'Main Power Generation Station',
          status: 'operational'
        },
        substations: [
          {
            id: 'sub_1',
            position: [62.1248, -132.3644],
            name: 'Substation Alpha',
            status: 'operational'
          },
          {
            id: 'sub_2',
            position: [61.9848, -132.5644],
            name: 'Substation Bravo',
            status: 'operational'
          },
          {
            id: 'sub_3',
            position: [62.0748, -132.2644],
            name: 'Substation Charlie',
            status: 'operational'
          },
          {
            id: 'sub_4',
            position: [61.8948, -132.4644],
            name: 'Substation Delta',
            status: 'operational'
          }
        ],
        dam: {
          id: 'hydro_1',
          position: [62.0048, -132.3644],
          name: 'Hydroelectric Dam',
          status: 'operational'
        },
        windfarm: {
          id: 'wind_1',
          position: [62.1548, -132.1644],
          name: 'Wind Farm Alpha',
          status: 'operational',
          area: [
            [62.1648, -132.1744],
            [62.1648, -132.1544],
            [62.1448, -132.1544],
            [62.1448, -132.1744]
          ]
        }
      },
      comms: [
        {
          id: 'comm_1',
          position: [62.0748, -132.2644],
          name: 'Communications Hub Alpha',
          status: 'operational'
        },
        {
          id: 'comm_2',
          position: [61.9548, -132.4644],
          name: 'Communications Hub Bravo',
          status: 'operational'
        },
        {
          id: 'comm_3',
          position: [62.1248, -132.2644],
          name: 'Communications Hub Charlie',
          status: 'operational'
        }
      ]
    },
    intelligence: {
      sensors: [
        {
          id: 'sensor_1',
          position: [62.1548, -132.1644],
          name: 'Collection Sensor Alpha',
          type: 'SIGINT/EW',
          status: 'active'
        },
        {
          id: 'sensor_2',
          position: [61.9548, -132.3644],
          name: 'Collection Sensor Bravo',
          type: 'SIGINT/EW',
          status: 'active'
        },
        {
          id: 'sensor_3',
          position: [62.0748, -132.4644],
          name: 'Collection Sensor Charlie',
          type: 'ELINT',
          status: 'active'
        },
        {
          id: 'sensor_4',
          position: [61.8948, -132.2644],
          name: 'Collection Sensor Delta',
          type: 'ELINT',
          status: 'active'
        },
        {
          id: 'sensor_5',
          position: [62.1248, -132.3644],
          name: 'Collection Sensor Echo',
          type: 'SIGINT/EW',
          status: 'active'
        },
        {
          id: 'sensor_6',
          position: [61.9248, -132.1644],
          name: 'Collection Sensor Foxtrot',
          type: 'ELINT',
          status: 'active'
        },
        {
          id: 'sensor_7',
          position: [62.0548, -132.2644],
          name: 'Collection Sensor Golf',
          type: 'SIGINT/EW',
          status: 'active'
        },
        {
          id: 'sensor_8',
          position: [61.8548, -132.4644],
          name: 'Collection Sensor Hotel',
          type: 'ELINT',
          status: 'active'
        },
        {
          id: 'sensor_9',
          position: [62.1048, -132.2644],
          name: 'Collection Sensor India',
          type: 'SIGINT/EW',
          status: 'active'
        },
        {
          id: 'sensor_10',
          position: [61.9748, -132.5644],
          name: 'Collection Sensor Juliet',
          type: 'ELINT',
          status: 'active'
        }
      ],
      network_connections: [
        // Connect each sensor to nearest command post
        { from: [62.1548, -132.1644], to: [62.0548, -132.2644] }, // Sensor 1 to Main CP
        { from: [61.9548, -132.3644], to: [62.0548, -132.2644] }, // Sensor 2 to Main CP
        { from: [62.0748, -132.4644], to: [61.8548, -132.4644] }, // Sensor 3 to Aux CP 2
        { from: [61.8948, -132.2644], to: [62.2548, -132.0644] }, // Sensor 4 to Aux CP 1
        { from: [62.1248, -132.3644], to: [62.0548, -132.2644] }, // Sensor 5 to Main CP
        { from: [61.9248, -132.1644], to: [62.2548, -132.0644] }, // Sensor 6 to Aux CP 1
        { from: [62.0548, -132.2644], to: [62.0548, -132.2644] }, // Sensor 7 to Main CP
        { from: [61.8548, -132.4644], to: [61.8548, -132.4644] }, // Sensor 8 to Aux CP 2
        { from: [62.1048, -132.2644], to: [62.0548, -132.2644] }, // Sensor 9 to Main CP
        { from: [61.9748, -132.5644], to: [61.8548, -132.4644] }  // Sensor 10 to Aux CP 2
      ]
    }
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
      html: `<div class="w-8 h-8 rounded-lg bg-${status}-500 border-2 border-white flex items-center justify-center text-white font-bold">${symbols[type] || '●'}</div>`,
      className: 'cursor-pointer',
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      popupAnchor: [0, -16]
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

  // Keep these state declarations separate
  const [scenarioCompletion, setScenarioCompletion] = useState(0)
  const [validationStatus, setValidationStatus] = useState<'pending' | 'valid' | 'invalid'>('pending')
  const [isGeneratingCOAs, setIsGeneratingCOAs] = useState(false)

  // Keep this effect for completion only
  useEffect(() => {
    const completion = Math.min(Math.round((assignedResources.length / 5) * 100), 100)
    setScenarioCompletion(completion)
    // Remove any validation status changes from here
  }, [assignedResources])

  // Separate handler for certification
  const handleCertifyScenario = () => {
    // Only change validation status when button is clicked
    setValidationStatus('valid')
  }

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
            <label className="flex items-center space-x-2 text-[#F8FAFC] cursor-pointer">
              <input
                type="checkbox"
                checked={layers.command}
                onChange={(e) => setLayers({ ...layers, command: e.target.checked })}
                className="rounded border-gray-300"
              />
              <span>Command</span>
            </label>
            <label className="flex items-center space-x-2 text-[#F8FAFC] cursor-pointer">
              <input
                type="checkbox"
                checked={layers.military}
                onChange={(e) => setLayers({ ...layers, military: e.target.checked })}
                className="rounded border-gray-300"
              />
              <span>Military</span>
            </label>
            <label className="flex items-center space-x-2 text-[#F8FAFC] cursor-pointer">
              <input
                type="checkbox"
                checked={layers.infrastructure}
                onChange={(e) => setLayers({ ...layers, infrastructure: e.target.checked })}
                className="rounded border-gray-300"
              />
              <span>Infrastructure</span>
            </label>
            <label className="flex items-center space-x-2 text-[#F8FAFC] cursor-pointer">
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
              {/* Main CP */}
              <Marker
                position={positions.command.main_cp.position}
                icon={createMilitaryMarker('hq', 'blue')}
              >
                <Popup>
                  <div>
                    <h3 className="text-lg mb-2">{positions.command.main_cp.name}</h3>
                    <button 
                      onClick={() => handleAddToScenario('command', positions.command.main_cp.id, positions.command.main_cp.name, 'blue')}
                      className="w-full bg-blue-600 text-white py-2 rounded mt-2"
                    >
                      Add to Scenario
                    </button>
                  </div>
                </Popup>
              </Marker>

              {/* Aux CPs */}
              {positions.command.aux_cp.map(cp => (
                <Marker
                  key={cp.id}
                  position={cp.position}
                  icon={createMilitaryMarker('hq', 'blue')}
                >
                  <Popup>
                    <div>
                      <h3 className="text-lg mb-2">{cp.name}</h3>
                      <button 
                        onClick={() => handleAddToScenario('command', cp.id, cp.name, 'blue')}
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

          {/* Military Layer */}
          {layers.military && (
            <LayerGroup>
              {/* Add helicopters with range circles */}
              {positions.helicopters.map(heli => (
                <LayerGroup key={heli.id}>
                  <Marker
                    position={heli.position}
                    icon={createMilitaryMarker('air', heli.status)}
                  >
                    <Popup>
                      <div>
                        <h3 className="text-lg mb-2">{heli.type}</h3>
                        <div className="text-sm">Role: {heli.role}</div>
                        <button 
                          onClick={() => handleAddToScenario('military', heli.id, `${heli.type} (${heli.role})`, heli.status)}
                          className="w-full bg-blue-600 text-white py-2 rounded mt-2"
                        >
                          Add to Scenario
                        </button>
                      </div>
                    </Popup>
                  </Marker>
                  <Circle
                    center={heli.position}
                    radius={10000}
                    pathOptions={{ 
                      color: heli.role === 'Attack' ? '#DC2626' : '#3B82F6',
                      weight: 1,
                      dashArray: '5,10',
                      fillOpacity: 0
                    }}
                  />
                </LayerGroup>
              ))}
            </LayerGroup>
          )}

          {/* Infrastructure Layer */}
          {layers.infrastructure && (
            <LayerGroup>
              {/* Power Infrastructure */}
              <Marker
                position={positions.infrastructure.power.main_station.position}
                icon={L.divIcon({
                  html: `<div class="w-6 h-6 flex items-center justify-center bg-yellow-500 border-2 border-white text-white font-bold">⚡</div>`,
                  className: '',
                  iconSize: [24, 24],
                  iconAnchor: [12, 12]
                })}
              >
                <Popup>
                  <div>
                    <h3 className="text-lg mb-2">{positions.infrastructure.power.main_station.name}</h3>
                    <button 
                      onClick={() => handleAddToScenario('infrastructure', 'power_main', positions.infrastructure.power.main_station.name, 'yellow')}
                      className="w-full bg-blue-600 text-white py-2 rounded mt-2"
                    >
                      Add to Scenario
                    </button>
                  </div>
                </Popup>
              </Marker>

              {/* Substations */}
              {positions.infrastructure.power.substations.map(sub => (
                <Marker
                  key={sub.id}
                  position={sub.position}
                  icon={L.divIcon({
                    html: `<div class="w-6 h-6 flex items-center justify-center bg-yellow-500 border-2 border-white text-white font-bold">⚡</div>`,
                    className: '',
                    iconSize: [24, 24],
                    iconAnchor: [12, 12]
                  })}
                >
                  <Popup>
                    <div>
                      <h3 className="text-lg mb-2">{sub.name}</h3>
                      <button 
                        onClick={() => handleAddToScenario('infrastructure', sub.id, sub.name, 'yellow')}
                        className="w-full bg-blue-600 text-white py-2 rounded mt-2"
                      >
                        Add to Scenario
                      </button>
                    </div>
                  </Popup>
                </Marker>
              ))}

              {/* Dam */}
              <Marker
                position={positions.infrastructure.power.dam.position}
                icon={L.divIcon({
                  html: `<div class="w-6 h-6 flex items-center justify-center bg-blue-500 border-2 border-white text-white font-bold">🏊</div>`,
                  className: '',
                  iconSize: [24, 24],
                  iconAnchor: [12, 12]
                })}
              >
                <Popup>
                  <div>
                    <h3 className="text-lg mb-2">{positions.infrastructure.power.dam.name}</h3>
                    <button 
                      onClick={() => handleAddToScenario('infrastructure', 'dam', positions.infrastructure.power.dam.name, 'blue')}
                      className="w-full bg-blue-600 text-white py-2 rounded mt-2"
                    >
                      Add to Scenario
                    </button>
                  </div>
                </Popup>
              </Marker>

              {/* Wind Farm */}
              <Polygon
                positions={positions.infrastructure.power.windfarm.area as L.LatLngExpression[]}
                pathOptions={{ color: '#22C55E', fillOpacity: 0.2 }}
              >
                <Popup>
                  <div>
                    <h3 className="text-lg mb-2">{positions.infrastructure.power.windfarm.name}</h3>
                    <button 
                      onClick={() => handleAddToScenario('infrastructure', 'windfarm', positions.infrastructure.power.windfarm.name, 'green')}
                      className="w-full bg-blue-600 text-white py-2 rounded mt-2"
                    >
                      Add to Scenario
                    </button>
                  </div>
                </Popup>
              </Polygon>

              {/* Communication Hubs */}
              {positions.infrastructure.comms.map(hub => (
                <Marker
                  key={hub.id}
                  position={hub.position}
                  icon={L.divIcon({
                    html: `<div class="w-6 h-6 flex items-center justify-center bg-purple-500 border-2 border-white text-white font-bold">📡</div>`,
                    className: '',
                    iconSize: [24, 24],
                    iconAnchor: [12, 12]
                  })}
                >
                  <Popup>
                    <div>
                      <h3 className="text-lg mb-2">{hub.name}</h3>
                      <button 
                        onClick={() => handleAddToScenario('infrastructure', hub.id, hub.name, 'purple')}
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

          {/* Intelligence Layer */}
          {layers.intelligence && (
            <LayerGroup>
              {/* Sensors */}
              {positions.intelligence.sensors.map((sensor) => (
                <LayerGroup key={sensor.id}>
                  <Marker
                    position={sensor.position as L.LatLngExpression}
                    icon={L.divIcon({
                      html: `<div class="w-8 h-8 flex items-center justify-center bg-emerald-500 border-2 border-white text-white font-bold">S</div>`,
                      className: 'cursor-pointer',
                      iconSize: [32, 32],
                      iconAnchor: [16, 16],
                      popupAnchor: [0, -16]
                    })}
                  >
                    <Popup>
                      <div>
                        <h3 className="text-lg mb-2">{sensor.name}</h3>
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <span>Type:</span>
                            <span>{sensor.type}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Status:</span>
                            <span className="text-green-500">{sensor.status}</span>
                          </div>
                        </div>
                        <button 
                          onClick={() => handleAddToScenario('intelligence', sensor.id, sensor.name, 'emerald')}
                          className="w-full bg-blue-600 text-white py-2 rounded mt-2"
                        >
                          Add to Scenario
                        </button>
                      </div>
                    </Popup>
                  </Marker>
                </LayerGroup>
              ))}

              {/* Network Connections */}
              {positions.intelligence.network_connections.map((connection, index) => (
                <Polyline
                  key={`connection_${index}`}
                  positions={[connection.from, connection.to] as L.LatLngExpression[]}
                  pathOptions={{ 
                    color: '#10B981',
                    weight: 1,
                    dashArray: '5,10',
                    opacity: 0.6
                  }}
                />
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