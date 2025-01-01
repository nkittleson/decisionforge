import React from 'react';
import { Shield, Clock, Users, AlertTriangle, CheckCircle } from 'lucide-react';

interface COAData {
  id: number;
  title: string;
  timeEstimate: string;
  confidence: number;
  risk: {
    level: string;
    color: string;
  };
  brief: string;
  resources: {
    required: number;
    available: number;
    readiness: number;
    responseTime: number;
  };
  advantages: string[];
  risks: string[];
}

const coaData: COAData[] = [
  {
    id: 1,
    title: "COA 1: Deploy Security Personnel",
    timeEstimate: "30-45 minutes",
    confidence: 92,
    risk: { level: "Medium", color: "text-yellow-400" },
    brief: "Immediate deployment of 10 security teams in coordinated response. Teams Alpha & Bravo secure power station, Charlie & Delta secure water facility, Echo & Foxtrot secure comms hub. Remaining 4 teams establish outer perimeter.",
    resources: {
      required: 10,
      available: 12,
      readiness: 95,
      responseTime: 10
    },
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
  {
    id: 2,
    title: "COA 2: Split Team Response",
    timeEstimate: "45-60 minutes",
    confidence: 78,
    risk: { level: "High", color: "text-orange-400" },
    brief: "Simultaneous deployment to both facilities. Teams Alpha, Bravo, Charlie split between power station and comms hub. Delta and Echo maintain mobile response capability. Foxtrot coordinates from command center.",
    resources: {
      required: 8,
      available: 12,
      readiness: 85,
      responseTime: 15
    },
    advantages: [
      "Simultaneous facility coverage",
      "Flexible response options",
      "Maintains reserve capacity"
    ],
    risks: [
      "Reduced team strength at each site",
      "Extended response time",
      "Complex coordination required"
    ]
  },
  {
    id: 3,
    title: "COA 3: Communications First",
    timeEstimate: "50-65 minutes",
    confidence: 65,
    risk: { level: "Low", color: "text-green-400" },
    brief: "Prioritize communications hub security. Teams Alpha through Delta secure and fortify comms facility. Echo and Foxtrot provide power station surveillance. Sequential facility response with communications emphasis.",
    resources: {
      required: 6,
      available: 12,
      readiness: 90,
      responseTime: 20
    },
    advantages: [
      "Strong comms security",
      "Maintains command & control",
      "Reduced resource requirements"
    ],
    risks: [
      "Power station vulnerability",
      "Delayed critical response",
      "Potential system cascade failure"
    ]
  }
];

interface COACardProps {
  coaIndex: number;
}

const getConfidenceColor = (score: number): string => {
  if (score >= 90) return 'text-green-400';
  if (score >= 80) return 'text-yellow-400';
  if (score >= 70) return 'text-orange-400';
  return 'text-red-400';
};

const COACard = ({ coaIndex }: COACardProps) => {
  const coa = coaData[coaIndex];
  const confidenceColor = getConfidenceColor(coa.confidence);

  return (
    <div className="bg-[#1E293B] rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-[#0F172A]">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-blue-400" />
          <h2 className="text-white font-medium">{coa.title}</h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400" />
            <span className="text-slate-400">{coa.timeEstimate}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={confidenceColor}>{coa.confidence}% Confidence</span>
            <span className={coa.risk.color}>{coa.risk.level} Risk</span>
          </div>
          <button className="bg-blue-500 text-white px-3 py-1 rounded text-sm">
            Execute COA
          </button>
        </div>
      </div>

      {/* Operation Brief */}
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="bg-blue-500/10 p-2 rounded">
            <Users className="w-5 h-5 text-blue-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-white font-medium mb-2">Operation Brief</h3>
            <p className="text-slate-400 text-sm">{coa.brief}</p>
            <button className="text-blue-400 text-sm mt-2 hover:text-blue-300 flex items-center gap-1">
              Read more
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Resource Stats */}
      <div className="grid grid-cols-3 gap-4 p-4">
        <div className="bg-[#0F172A] p-4 rounded-lg">
          <h4 className="text-slate-400 text-sm mb-2">Required Teams</h4>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">{coa.resources.required}</span>
            <span className="text-slate-400 text-sm">of {coa.resources.available} available</span>
          </div>
        </div>
        <div className="bg-[#0F172A] p-4 rounded-lg">
          <h4 className="text-slate-400 text-sm mb-2">Team Readiness</h4>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-green-400">{coa.resources.readiness}%</span>
            <span className="text-green-400 text-sm">Ready</span>
          </div>
        </div>
        <div className="bg-[#0F172A] p-4 rounded-lg">
          <h4 className="text-slate-400 text-sm mb-2">Response Time</h4>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">{coa.resources.responseTime}</span>
            <span className="text-slate-400 text-sm">minutes</span>
          </div>
        </div>
      </div>

      {/* Advantages and Risks */}
      <div className="grid grid-cols-2 gap-4 p-4">
        <div>
          <h3 className="text-white font-medium flex items-center gap-2 mb-3">
            <CheckCircle className="w-4 h-4 text-green-400" />
            Advantages
          </h3>
          <div className="space-y-2">
            {coa.advantages.map((advantage, index) => (
              <div key={index} className="flex items-center gap-2 bg-[#0F172A] p-2 rounded">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                <span className="text-slate-400 text-sm">{advantage}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-white font-medium flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-yellow-400" />
            Risks
          </h3>
          <div className="space-y-2">
            {coa.risks.map((risk, index) => (
              <div key={index} className="flex items-center gap-2 bg-[#0F172A] p-2 rounded">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                <span className="text-slate-400 text-sm">{risk}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default COACard; 