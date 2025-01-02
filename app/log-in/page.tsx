"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function LoginPage() {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  })

  useEffect(() => {
    const email = 'demo@vectorforge.ai'
    const password = 'Kj#9mP$vL2nX5qR'
    let emailIndex = 0
    let passwordIndex = 0

    // Wait 1 second before starting
    setTimeout(() => {
      // Type email
      const emailTyping = setInterval(() => {
        if (emailIndex < email.length) {
          setCredentials(prev => ({
            ...prev,
            email: email.substring(0, emailIndex + 1)
          }))
          emailIndex++
        } else {
          clearInterval(emailTyping)
          // Start typing password after email is done
          const passwordTyping = setInterval(() => {
            if (passwordIndex < password.length) {
              setCredentials(prev => ({
                ...prev,
                password: password.substring(0, passwordIndex + 1)
              }))
              passwordIndex++
            } else {
              clearInterval(passwordTyping)
            }
          }, Math.random() * 100 + 50)
        }
      }, Math.random() * 100 + 50)
    }, 1000)

    // Cleanup function
    return () => {
      clearInterval()
    }
  }, [])

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
            <div className="w-full p-3 rounded bg-[#0F172A]/80 text-gray-300 text-base">
              {credentials.email || 'Email'}
            </div>
          </div>
          
          <div className="relative">
            <div className="w-full p-3 rounded bg-[#0F172A]/80 text-gray-300 text-base">
              {credentials.password ? '•'.repeat(credentials.password.length) : 'Password'}
            </div>
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