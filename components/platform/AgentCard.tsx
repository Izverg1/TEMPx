import React from 'react';
import { Agent } from '../../types';
import { Progress } from '../ui/Progress';

interface AgentCardProps {
  agent: Agent;
  onClick: () => void;
}

export const AgentCard: React.FC<AgentCardProps> = ({ agent, onClick }) => {
    // (0.5 * FCR) + (0.3 * (1 - Escalation Rate)) + (0.2 * Sentiment Score)
    const healthScore = (0.5 * agent.fcr) + (0.3 * (100 - agent.escalationRate)) + (0.2 * (agent.sentimentScore * 100));

    const getHealthColor = (score: number) => {
        if (score > 80) return 'bg-green-500';
        if (score > 60) return 'bg-yellow-500';
        return 'bg-red-500';
    }

    return (
        <div
            onClick={onClick}
            className="group relative bg-brand-bg-light rounded-xl border border-brand-border p-4 cursor-pointer overflow-hidden transition-all duration-300 hover:border-brand-cyan hover:shadow-2xl hover:shadow-cyan/20"
        >
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-600/10 via-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-brand-cyan/20 to-transparent opacity-0 group-hover:opacity-50 transform -translate-x-full group-hover:translate-x-0 transition-all duration-700"></div>

            <div className="relative z-10 space-y-3">
                <div className="flex items-center gap-4">
                    <img src={agent.avatarUrl} alt={agent.name} className="w-16 h-16 rounded-full border-2 border-brand-border" />
                    <div>
                        <h3 className="font-bold text-lg text-brand-text-light">{agent.name}</h3>
                        <p className="text-sm text-brand-text-dark">{agent.useCase}</p>
                    </div>
                </div>

                <div>
                    <div className="flex justify-between items-center mb-1 text-xs text-brand-text-dark">
                        <span>Performance Health</span>
                        <span>{healthScore.toFixed(0)}%</span>
                    </div>
                    <Progress value={healthScore} indicatorClassName={getHealthColor(healthScore)} />
                </div>
                
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 pt-2 text-sm">
                    <div>
                        <div className="text-brand-text-dark text-xs">Workflows Done</div>
                        <div className="font-semibold">{agent.workflowsCompleted.toLocaleString()}</div>
                    </div>
                     <div>
                        <div className="text-brand-text-dark text-xs">Value Generated</div>
                        <div className="font-semibold">${agent.valueGenerated.toLocaleString()}</div>
                    </div>
                </div>

                <div className="flex justify-between items-center pt-2">
                     <span className={`px-2 py-1 text-xs rounded-full ${agent.status === 'Active' ? 'bg-green-500/20 text-green-400' : agent.status === 'Training' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>
                        {agent.status}
                    </span>
                    <span className="text-xs text-brand-text-dark">{agent.deploymentType === 'UNITY_Internal' ? 'UNITY Internal' : 'External Hybrid'}</span>
                </div>
            </div>
        </div>
    );
};