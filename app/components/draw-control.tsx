'use client'

import { useEffect } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet-draw'

export function DrawControl() {
  const map = useMap()

  useEffect(() => {
    // Create draw control
    const drawControl = new L.Control.Draw({
      draw: {
        marker: true,
        circle: true,
        rectangle: true,
        polygon: true,
        polyline: true,
        circlemarker: false
      },
      edit: {
        featureGroup: new L.FeatureGroup(),
        remove: true
      }
    })

    // Add draw control to map
    map.addControl(drawControl)

    // Create feature group for drawn items
    const drawnItems = new L.FeatureGroup()
    map.addLayer(drawnItems)

    // Handle created items
    map.on(L.Draw.Event.CREATED, (e: any) => {
      const layer = e.layer
      drawnItems.addLayer(layer)
    })

    // Cleanup
    return () => {
      map.removeControl(drawControl)
      map.removeLayer(drawnItems)
    }
  }, [map])

  return null
} 