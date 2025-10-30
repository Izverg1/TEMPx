import React, { useState } from 'react';
import { Agent, Project, AgentPerformanceHistory, AgentAudienceSegment } from '../types';
import Sidebar from '../components/platform/Sidebar';
import Header from '../components/platform/Header';
import DashboardView from './platform/DashboardView';
import ProjectDetailView from './platform/ProjectDetailView';
import CreateAgentView from './platform/CreateAgentView';
import WorkflowBuilderView from './platform/WorkflowBuilderView';

interface PlatformProps {
  onExitPlatform: () => void;
}

// --- MOCK DATA GENERATION ---

const generatePerformanceHistory = (base: { fcr: number, esc: number, aht: number }): AgentPerformanceHistory[] => {
    const history: AgentPerformanceHistory[] = [];
    for (let i = 30; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const entry: AgentPerformanceHistory = {
            date: date.toISOString().split('T')[0],
            fcr: base.fcr + (Math.random() - 0.5) * 5,
            escalationRate: base.esc + (Math.random() - 0.5) * 3,
            aht: base.aht + (Math.random() - 0.5) * 15,
        };
        if (i === 15) {
            entry.versionChange = 'v1.1'; // Add a version change marker
            // Simulate a performance shift after the change
            base.fcr += 2;
            base.esc -= 1;
            base.aht -= 5;
        }
        history.push(entry);
    }
    return history;
};

const mockSegments: Omit<AgentAudienceSegment, 'avgTransactionValue' | 'fcr' | 'sentimentScore'>[] = [
    { segment: 'Age Bucket: "Older Buyers"' },
    { segment: 'Region Code: "US-West"' },
    { segment: 'Product Affinity: "Premium"' },
    { segment: 'User Status: "New"' },
    { segment: 'Device: "Mobile"' },
];

const generateAudienceSegments = (): AgentAudienceSegment[] => {
    return mockSegments.map(s => ({
        ...s,
        avgTransactionValue: 50 + Math.random() * 100,
        fcr: 60 + Math.random() * 35,
        sentimentScore: 0.6 + Math.random() * 0.35,
    }));
};


const MOCK_PROJECTS: Project[] = [
  { id: 'proj-01', name: 'Retail Support Q4', status: 'Active', budgetUsage: 75, fcr: 82, escalationRate: 12, totalAgents: 3, totalInteractions: 2130, estimatedROI: 12500 },
  { id: 'proj-02', name: 'Insurance Onboarding', status: 'Optimizing', budgetUsage: 45, fcr: 76, escalationRate: 18, totalAgents: 2, totalInteractions: 980, estimatedROI: 8700 },
  { id: 'proj-03', name: 'Winter Sale Campaign', status: 'Error', budgetUsage: 98, fcr: 65, escalationRate: 25, totalAgents: 1, totalInteractions: 540, estimatedROI: -500 },
];

const MOCK_AGENTS: Agent[] = [
    { id: 'agent-001', projectId: 'proj-01', name: 'Athena', avatarUrl: `https://i.pravatar.cc/150?u=athena`, useCase: 'Customer Service', status: 'Active', deploymentType: 'UNITY_Internal', interactions: 1250, fcr: 85, escalationRate: 10, sentimentScore: 0.9, workflowsCompleted: 1100, valueGenerated: 9800, createdAt: '2023-10-26', personality: 'Friendly and empathetic', backstory: 'Designed to assist users with billing inquiries.', greeting: 'Hello! My name is Athena, how can I help you with your account today?', voiceProfile: { gender: 'Female', region: 'US-East', style: 'Enthusiastic' }, ttsModel: 'gemini-2.5-flash-preview-tts', monthlyBudget: 10000, capabilities: ['Sentiment analysis', 'Real-time data lookup'], performanceHistory: generatePerformanceHistory({ fcr: 85, esc: 10, aht: 180 }), audienceSegments: generateAudienceSegments() },
    { id: 'agent-002', projectId: 'proj-01', name: 'Orion', avatarUrl: `https://i.pravatar.cc/150?u=orion`, useCase: 'Sales', status: 'Active', deploymentType: 'UNITY_Internal', interactions: 830, fcr: 72, escalationRate: 20, sentimentScore: 0.8, workflowsCompleted: 650, valueGenerated: 15500, createdAt: '2023-09-15', personality: 'Persuasive and knowledgeable', backstory: 'Expert in product features and benefits.', greeting: 'Hi there! I\'m Orion. I can help you find the perfect product for your needs.', voiceProfile: { gender: 'Male', region: 'US-West', style: 'Professional' }, ttsModel: 'gemini-2.5-flash-preview-tts', monthlyBudget: 15000, capabilities: ['Proactive engagement'], performanceHistory: generatePerformanceHistory({ fcr: 72, esc: 20, aht: 220 }), audienceSegments: generateAudienceSegments() },
    { id: 'agent-003', projectId: 'proj-01', name: 'Helios', avatarUrl: `https://i.pravatar.cc/150?u=helios`, useCase: 'Technical Support', status: 'Training', deploymentType: 'External_Hybrid', interactions: 50, fcr: 95, escalationRate: 2, sentimentScore: 0.95, workflowsCompleted: 48, valueGenerated: 1200, createdAt: '2023-11-01', personality: 'Patient and methodical', backstory: 'Specializes in troubleshooting complex technical issues.', greeting: 'Greetings. I am Helios. Please describe the technical issue you are experiencing.', voiceProfile: { gender: 'Male', region: 'UK', style: 'Calm' }, ttsModel: 'ElevenLabs-v2', monthlyBudget: 7500, capabilities: ['Multi-language support', 'Real-time data lookup'], performanceHistory: generatePerformanceHistory({ fcr: 95, esc: 2, aht: 300 }), audienceSegments: generateAudienceSegments() },
    { id: 'agent-004', projectId: 'proj-02', name: 'Lyra', avatarUrl: `https://i.pravatar.cc/150?u=lyra`, useCase: 'Onboarding', status: 'Active', deploymentType: 'UNITY_Internal', interactions: 600, fcr: 78, escalationRate: 15, sentimentScore: 0.88, workflowsCompleted: 550, valueGenerated: 7200, createdAt: '2023-10-02', personality: 'Clear and concise', backstory: 'Guides new customers through the setup process.', greeting: 'Welcome! I\'m Lyra, and I\'ll be helping you get started today.', voiceProfile: { gender: 'Female', region: 'US-East', style: 'Professional' }, ttsModel: 'gemini-2.5-flash-preview-tts', monthlyBudget: 8000, capabilities: [], performanceHistory: generatePerformanceHistory({ fcr: 78, esc: 15, aht: 150 }), audienceSegments: generateAudienceSegments() },
    { id: 'agent-005', projectId: 'proj-02', name: 'Caelus', avatarUrl: `https://i.pravatar.cc/150?u=caelus`, useCase: 'Customer Service', status: 'Inactive', deploymentType: 'UNITY_Internal', interactions: 380, fcr: 74, escalationRate: 22, sentimentScore: 0.7, workflowsCompleted: 300, valueGenerated: 3100, createdAt: '2023-08-20', personality: 'Formal and direct', backstory: 'Handles account verification and security.', greeting: 'This is Caelus. I am here to assist with your account.', voiceProfile: { gender: 'Male', region: 'US-West', style: 'Calm' }, ttsModel: 'gemini-2.5-flash-preview-tts', monthlyBudget: 5000, capabilities: ['Sentiment analysis'], performanceHistory: generatePerformanceHistory({ fcr: 74, esc: 22, aht: 200 }), audienceSegments: generateAudienceSegments() },
    { id: 'agent-006', projectId: 'proj-03', name: 'Nova', avatarUrl: `https://i.pravatar.cc/150?u=nova`, useCase: 'Sales', status: 'Active', deploymentType: 'External_Hybrid', interactions: 540, fcr: 65, escalationRate: 25, sentimentScore: 0.6, workflowsCompleted: 350, valueGenerated: 18000, createdAt: '2023-11-05', personality: 'Energetic and persuasive', backstory: 'A high-stakes sales agent for limited-time offers.', greeting: 'Hi! I\'m Nova! Ready to hear about our best deal ever?', voiceProfile: { gender: 'Female', region: 'US-East', style: 'Enthusiastic' }, ttsModel: 'gemini-2.5-flash-preview-tts', monthlyBudget: 12000, capabilities: ['Proactive engagement', 'Real-time data lookup'], performanceHistory: generatePerformanceHistory({ fcr: 65, esc: 25, aht: 120 }), audienceSegments: generateAudienceSegments() },
];

type View = 'dashboard' | 'project-detail' | 'create-agent' | 'workflow-builder';

const Platform: React.FC<PlatformProps> = ({ onExitPlatform }) => {
  const [view, setView] = useState<View>('dashboard');
  const [agents, setAgents] = useState<Agent[]>(MOCK_AGENTS);
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(MOCK_PROJECTS[0].id);

  const addAgent = (newAgentData: Omit<Agent, 'id' | 'interactions' | 'createdAt' | 'projectId' | 'fcr' | 'escalationRate' | 'sentimentScore' | 'workflowsCompleted' | 'valueGenerated' | 'performanceHistory' | 'audienceSegments'>) => {
    if (!selectedProjectId) return;
    const agent: Agent = {
      ...newAgentData,
      id: `agent-${Date.now()}`,
      avatarUrl: newAgentData.avatarUrl || `https://i.pravatar.cc/150?u=${Date.now()}`,
      interactions: 0,
      createdAt: new Date().toISOString().split('T')[0],
      projectId: selectedProjectId,
      // Add sensible defaults for new agents
      fcr: 100,
      escalationRate: 0,
      sentimentScore: 1,
      workflowsCompleted: 0,
      valueGenerated: 0,
      performanceHistory: [],
      audienceSegments: [],
    };
    setAgents(prev => [...prev, agent]);
    setView('project-detail');
  };

  const updateAgent = (updatedAgent: Agent) => {
    setAgents(prev => prev.map(agent => agent.id === updatedAgent.id ? updatedAgent : agent));
  };

  const handleSetView = (newView: View) => {
    if ((newView === 'project-detail' || newView === 'workflow-builder') && !selectedProjectId) {
      setSelectedProjectId(projects[0]?.id || null);
    }
    setView(newView);
  }

  const handleSelectProject = (projectId: string) => {
    setSelectedProjectId(projectId);
    setView('project-detail');
  };
  
  const selectedProject = projects.find(p => p.id === selectedProjectId);
  const agentsForProject = agents.filter(a => a.projectId === selectedProjectId);

  const renderView = () => {
    switch (view) {
      case 'project-detail':
        return <ProjectDetailView 
          project={selectedProject}
          agents={agentsForProject} 
          setView={handleSetView}
          onUpdateAgent={updateAgent}
        />;
      case 'create-agent':
        return <CreateAgentView onAgentCreate={addAgent} onBack={() => setView('project-detail')} project={selectedProject} />;
      case 'workflow-builder':
        return <WorkflowBuilderView project={selectedProject} agents={agentsForProject} onBack={() => setView('project-detail')} />;
      case 'dashboard':
      default:
        return <DashboardView agents={agents} projects={projects} onSelectProject={handleSelectProject} />;
    }
  };

  return (
    <div className="flex h-screen bg-brand-bg-dark">
      <Sidebar currentView={view} setView={handleSetView} onExit={onExitPlatform} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header project={selectedProject} view={view} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-brand-bg-dark p-6 md:p-8">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export default Platform;