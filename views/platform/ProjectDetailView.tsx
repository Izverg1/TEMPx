import React, { useState } from 'react';
import { Agent, Project } from '../../types';
import { Button } from '../../components/ui/Button';
import { AgentCard } from '../../components/platform/AgentCard';
import { AgentProfileModal } from '../../components/platform/AgentProfileModal';
import { QASimulationModal } from '../../components/platform/QASimulationModal';

type View = 'dashboard' | 'project-detail' | 'create-agent' | 'workflow-builder';

interface ProjectDetailViewProps {
  project: Project | undefined;
  agents: Agent[];
  setView: (view: View) => void;
  onUpdateAgent: (agent: Agent) => void;
}

const ProjectDetailView: React.FC<ProjectDetailViewProps> = ({ project, agents, setView, onUpdateAgent }) => {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [isQAModalOpen, setIsQAModalOpen] = useState(false);

  if (!project) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold">No Project Selected</h2>
        <p className="text-brand-text-dark">Please select a project from the Nerve Center dashboard.</p>
      </div>
    );
  }

  const handleUpdateAndRefresh = (updatedAgent: Agent) => {
    onUpdateAgent(updatedAgent);
    setSelectedAgent(updatedAgent);
  };

  const StatItem: React.FC<{ label: string; value: string | number; color?: string }> = ({ label, value, color = 'text-brand-text-light' }) => (
    <div>
      <div className="text-sm text-brand-text-dark">{label}</div>
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="bg-brand-bg-light rounded-lg border border-brand-border p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex-1 space-y-2">
            <h2 className="text-xl font-bold">{project.name}</h2>
            <div className="flex items-center gap-6">
                <StatItem label="Status" value={project.status} color={project.status === 'Active' ? 'text-green-400' : project.status === 'Error' ? 'text-red-400' : 'text-yellow-400'} />
                <StatItem label="Budget Usage" value={`${project.budgetUsage}%`} />
                <StatItem label="Project FCR" value={`${project.fcr}%`} />
                <StatItem label="Escalation Rate" value={`${project.escalationRate}%`} />
            </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
            <Button variant="outline" onClick={() => setView('workflow-builder')}>Access Workflow Builder</Button>
            <Button variant="outline" onClick={() => setIsQAModalOpen(true)}>Initiate QA Simulation</Button>
            <Button onClick={() => setView('create-agent')}>Launch New Agent</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {agents.map((agent) => (
          <AgentCard key={agent.id} agent={agent} onClick={() => setSelectedAgent(agent)} />
        ))}
      </div>

      {selectedAgent && (
        <AgentProfileModal
          agent={selectedAgent}
          isOpen={!!selectedAgent}
          onClose={() => setSelectedAgent(null)}
          onUpdateAgent={handleUpdateAndRefresh}
        />
      )}

      <QASimulationModal 
        isOpen={isQAModalOpen}
        onClose={() => setIsQAModalOpen(false)}
        project={project}
      />
    </div>
  );
};

export default ProjectDetailView;