"use client"

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function LoginPage() {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  })

  return (
    <div className="min-h-screen flex flex-col items-center pt-20 bg-[#0B1221]">
      <div className="bg-[#1E293B]/80 p-10 rounded-2xl shadow-2xl w-[400px]">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 text-[#FFB800]">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
          </div>
          <h1 className="text-[#FFB800] text-3xl font-bold mb-2">
            DecisionForge<span className="text-sm align-top">™</span>
          </h1>
          <div className="text-gray-400 text-base space-y-0.5">
            <p>Decisions Forged in Data,</p>
            <p>Verified by Science</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 rounded bg-[#0F172A]/80 text-gray-300 border-none focus:outline-none text-base"
              value={credentials.email}
              onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
            />
          </div>
          
          <div className="relative">
            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 rounded bg-[#0F172A]/80 text-gray-300 border-none focus:outline-none text-base"
              value={credentials.password}
              onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
            />
          </div>

          <Link 
            href="/"
            className="block w-full bg-[#FFB800] hover:bg-[#F59E0B] text-[#0B1221] font-semibold py-3 px-4 rounded text-center text-base mt-6"
          >
            Sign In
          </Link>
        </div>

        <p className="text-gray-500 text-xs text-center mt-6">
          Secure AI decisions with cryptographic verification
        </p>
      </div>
      
      <p className="text-gray-500 text-sm mt-8">
        © 2024 vectorforge.ai
      </p>
    </div>
  )
} 