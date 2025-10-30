

export interface Project {
  id: string;
  name: string;
  status: 'Active' | 'Optimizing' | 'Error';
  budgetUsage: number; // as a percentage
  fcr: number; // as a percentage
  escalationRate: number; // as a percentage
  totalAgents: number;
  totalInteractions: number;
  estimatedROI: number; // in USD
}

export interface AgentPerformanceHistory {
  date: string; // YYYY-MM-DD
  fcr: number;
  escalationRate: number;
  aht: number; // Average Handle Time in seconds
  versionChange?: string; // e.g., "v1.1"
}

export interface AgentAudienceSegment {
  segment: string;
  avgTransactionValue: number;
  fcr: number;
  sentimentScore: number; // 0 to 1
}

export interface Agent {
  id: string;
  projectId: string;
  name: string;
  avatarUrl: string;
  useCase: 'Customer Service' | 'Sales' | 'Technical Support' | 'Onboarding';
  status: 'Active' | 'Inactive' | 'Training';
  deploymentType: 'UNITY_Internal' | 'External_Hybrid';

  // Performance Metrics
  interactions: number;
  fcr: number; // First Call Resolution percentage
  escalationRate: number; // percentage
  sentimentScore: number; // 0 to 1
  workflowsCompleted: number;
  valueGenerated: number; // in USD

  // Profile
  personality: string;
  backstory: string;
  greeting: string;
  voiceProfile: {
    gender: 'Female' | 'Male';
    region: 'US-East' | 'US-West' | 'UK';
    style: 'Enthusiastic' | 'Professional' | 'Calm';
  };
  ttsModel: string;
  monthlyBudget: number;
  capabilities: string[];
  
  createdAt: string;

  // Detailed Metrics for Audit Trail
  performanceHistory: AgentPerformanceHistory[];
  audienceSegments: AgentAudienceSegment[];
}