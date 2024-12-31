'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'

const MapWithNoSSR = dynamic(
  () => import('./map-component'),
  { ssr: false }
)

interface TacticalMapProps {
  onResourceAction: () => void;
}

export function TacticalMap({ onResourceAction }: TacticalMapProps) {
  return (
    <div className="space-y-6">
      {/* Resource Selector Section */}
      <div className="bg-[#475569] rounded-xl">
        <h2 className="text-3xl text-[#F8FAFC] font-medium p-8">RESOURCE SELECTOR</h2>
        <div className="w-full px-8 pb-8">
          <div className="bg-[#0F172A] rounded-xl p-8">
            <div className="relative h-[600px] w-full rounded-lg overflow-hidden">
              <MapWithNoSSR onResourceAction={onResourceAction} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 