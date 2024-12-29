import * as React from "react"
import "./globals.css"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#1B1B35]">
        <header className="border-b border-[#334155] bg-[#1E293B]">
          <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-[#F8FAFC] rounded-full p-2 w-10 h-10 flex items-center justify-center">
                <img 
                  src="/vectorforge-logo.svg"
                  alt="VectorForge Logo" 
                  className="h-6 w-6"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-semibold text-[#F8FAFC]">DecisionForge™</span>
                <span className="text-sm text-[#94A3B8]">powered by VectorForge™</span>
              </div>
            </div>
            <nav className="flex items-center gap-6">
              <a href="#" className="text-[#94A3B8] hover:text-[#F8FAFC]">Dashboard</a>
              <a href="#" className="text-[#94A3B8] hover:text-[#F8FAFC]">Details</a>
              <a href="#" className="text-[#94A3B8] hover:text-[#F8FAFC]">Comparison</a>
              <a href="#" className="text-[#94A3B8] hover:text-[#F8FAFC]">Settings</a>
              <img src="/decisionforgeavatar.png" alt="" className="w-8 h-8 rounded-full" />
            </nav>
          </div>
        </header>

        <main className="max-w-7xl mx-auto p-4">
          <div className="bg-[#1E293B] rounded-lg p-6 shadow-lg text-[#F8FAFC]">
            {children}
          </div>
        </main>
      </body>
    </html>
  )
} 