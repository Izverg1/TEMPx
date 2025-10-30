import React, { useState, useEffect } from 'react';
import { Agent } from '../../types';
import { Modal } from '../ui/Modal';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { LineChart } from '../ui/LineChart';
import { BarChart } from '../ui/BarChart';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';

interface AgentProfileModalProps {
  agent: Agent;
  isOpen: boolean;
  onClose: () => void;
  onUpdateAgent: (updatedAgent: Agent) => void;
}

const availableCapabilities = [
    'Multi-language support',
    'Sentiment analysis',
    'Real-time data lookup',
    'Proactive engagement'
];

export const AgentProfileModal: React.FC<AgentProfileModalProps> = ({ agent, isOpen, onClose, onUpdateAgent }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editableAgent, setEditableAgent] = useState<Agent>(agent);
  
    useEffect(() => {
      // When the modal is opened or the agent prop changes, reset the editable state.
      setEditableAgent(agent);
      // Ensure modal always opens in view mode, unless it was just saved.
      if (isOpen && !isEditing) {
        setIsEditing(false);
      }
    }, [agent, isOpen]);
  
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setEditableAgent(prev => ({ ...prev, [name]: value }));
    };
  
    const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setEditableAgent(prev => ({ ...prev, monthlyBudget: Number(e.target.value) }));
    };
  
    const handleVoiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const { name, value } = e.target;
      setEditableAgent(prev => ({
        ...prev,
        voiceProfile: {
          ...prev.voiceProfile,
          [name]: value,
        }
      }));
    };

    const handleTtsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setEditableAgent(prev => ({ ...prev, ttsModel: e.target.value }));
    }

    const handleCapabilityChange = (capability: string) => {
        setEditableAgent(prev => {
            const currentCaps = prev.capabilities || [];
            const newCaps = currentCaps.includes(capability)
                ? currentCaps.filter(c => c !== capability)
                : [...currentCaps, capability];
            return { ...prev, capabilities: newCaps };
        });
    };
  
    const handleSave = () => {
      onUpdateAgent(editableAgent);
      setIsEditing(false);
    };
  
    const handleCancel = () => {
      setEditableAgent(agent); // Revert changes
      setIsEditing(false);
    };

    const Stat: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
        <div>
            <div className="text-sm text-brand-text-dark">{label}</div>
            <div className="font-semibold text-brand-text-light">{value}</div>
        </div>
    );
    
    const performanceData = {
        fcr: agent.performanceHistory.map(h => ({ x: h.date, y: h.fcr })),
        escalation: agent.performanceHistory.map(h => ({ x: h.date, y: h.escalationRate })),
        aht: agent.performanceHistory.map(h => ({ x: h.date, y: h.aht })),
    };

    const versionChanges = agent.performanceHistory
        .filter(h => h.versionChange)
        .map(h => ({ date: h.date, label: h.versionChange! }));

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Agent Profile: ${agent.name}`}>
      <div className="space-y-6">
        <div className="flex justify-end">
            {!isEditing && <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>Edit Agent</Button>}
        </div>
        {/* Biography & Identity */}
        <section>
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <img src={agent.avatarUrl} alt={agent.name} className="w-24 h-24 rounded-full border-4 border-brand-border" />
            <div className="flex-1">
              <h3 className="text-lg font-bold">Biography</h3>
              <p className="text-sm text-brand-text-dark mt-1">
                Derived from the agent's initial prompt and top 5 most-used workflows.
              </p>
              {isEditing ? (
                  <Textarea name="backstory" value={editableAgent.backstory} onChange={handleInputChange} className="mt-2" rows={3} />
              ) : (
                <p className="mt-2 text-sm bg-brand-bg-dark p-3 rounded-md">{agent.backstory}</p>
              )}
            </div>
          </div>
          <div className="mt-4 p-4 bg-brand-bg-dark rounded-lg">
            {isEditing ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Personality</label>
                        <Input name="personality" value={editableAgent.personality} onChange={handleInputChange} />
                    </div>
                     <div className="space-y-2">
                        <label className="text-sm font-medium">Greeting</label>
                        <Input name="greeting" value={editableAgent.greeting} onChange={handleInputChange} />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Voice Gender</label>
                        <select name="gender" value={editableAgent.voiceProfile.gender} onChange={handleVoiceChange} className="w-full h-10 bg-brand-bg-light border border-brand-border rounded-md px-3 text-brand-text-light focus:ring-2 focus:ring-brand-cyan">
                            <option>Female</option><option>Male</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Voice Region</label>
                        <select name="region" value={editableAgent.voiceProfile.region} onChange={handleVoiceChange} className="w-full h-10 bg-brand-bg-light border border-brand-border rounded-md px-3 text-brand-text-light focus:ring-2 focus:ring-brand-cyan">
                            <option>US-East</option><option>US-West</option><option>UK</option>
                        </select>
                    </div>
                     <div className="space-y-2">
                        <label className="text-sm font-medium">Voice Style</label>
                        <select name="style" value={editableAgent.voiceProfile.style} onChange={handleVoiceChange} className="w-full h-10 bg-brand-bg-light border border-brand-border rounded-md px-3 text-brand-text-light focus:ring-2 focus:ring-brand-cyan">
                            <option>Enthusiastic</option><option>Professional</option><option>Calm</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                         <label className="text-sm font-medium">TTS Model</label>
                         <select value={editableAgent.ttsModel} onChange={handleTtsChange} className="w-full h-10 bg-brand-bg-light border border-brand-border rounded-md px-3 text-brand-text-light focus:ring-2 focus:ring-brand-cyan disabled:opacity-50" disabled={editableAgent.deploymentType === 'UNITY_Internal'}>
                            <option value="gemini-2.5-flash-preview-tts">Gemini TTS</option>
                            <option value="ElevenLabs-v2">ElevenLabs v2</option>
                        </select>
                    </div>
                     <div className="space-y-2">
                        <label className="text-sm font-medium">Monthly Budget ($)</label>
                        <Input type="number" value={editableAgent.monthlyBudget} onChange={handleBudgetChange} />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                        <label className="text-sm font-medium">Agent Capabilities</label>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 p-3 bg-brand-bg-dark rounded-md">
                            {availableCapabilities.map(cap => (
                                <label key={cap} className="flex items-center space-x-2 text-sm cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={(editableAgent.capabilities || []).includes(cap)}
                                        onChange={() => handleCapabilityChange(cap)}
                                        className="h-4 w-4 rounded bg-brand-bg-light border-brand-border text-brand-cyan focus:ring-2 focus:ring-offset-brand-bg-dark focus:ring-brand-cyan"
                                    />
                                    <span>{cap}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                 </div>
            ) : (
                <>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Stat label="Personality" value={agent.personality} />
                    <Stat label="Greeting" value={`"${agent.greeting}"`} />
                    <Stat label="Voice Profile" value={`${agent.voiceProfile.gender}, ${agent.voiceProfile.region}, ${agent.voiceProfile.style}`} />
                    <Stat label="TTS Model" value={agent.ttsModel} />
                    <Stat label="Monthly Budget" value={`$${agent.monthlyBudget.toLocaleString()}`} />
                </div>
                <div className="mt-4 pt-4 border-t border-brand-border">
                    <Stat label="Capabilities" value={
                        agent.capabilities && agent.capabilities.length > 0
                        ? (
                            <div className="flex flex-wrap gap-2 mt-1">
                                {agent.capabilities.map(cap => (
                                    <span key={cap} className="px-2 py-1 text-xs rounded-full bg-brand-cyan/20 text-brand-cyan font-medium">
                                        {cap}
                                    </span>
                                ))}
                            </div>
                        )
                        : <span className="text-brand-text-dark italic">None assigned</span>
                    } />
                </div>
                </>
            )}
            </div>
        </section>

        {!isEditing && (
            <>
                <Card>
                    <CardHeader>
                        <CardTitle>Lifetime Performance Metrics (Last 30 Days)</CardTitle>
                        <CardDescription>Correlate performance dips/spikes with model updates.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <LineChart 
                            data={[
                                { id: 'FCR', color: '#4ade80', data: performanceData.fcr },
                                { id: 'Escalation', color: '#f87171', data: performanceData.escalation }
                            ]} 
                            yLabel="Percentage (%)"
                            markers={versionChanges}
                        />
                        <LineChart 
                            data={[
                                { id: 'AHT', color: '#60a5fa', data: performanceData.aht }
                            ]} 
                            yLabel="Avg Handle Time (s)"
                        />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Audience Segmentation Insights</CardTitle>
                        <CardDescription>Identify optimization opportunities by visualizing segmented performance.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <BarChart 
                            data={agent.audienceSegments.map(s => ({
                                label: s.segment.split(':')[1].trim().replace(/"/g, ''),
                                values: {
                                    'FCR (%)': s.fcr,
                                    'Sentiment': s.sentimentScore * 100,
                                }
                            }))}
                            colors={{ 'FCR (%)': '#4ade80', 'Sentiment': '#60a5fa' }}
                        />
                    </CardContent>
                </Card>
            </>
        )}
        {isEditing && (
            <div className="flex justify-end gap-2 pt-4">
                <Button variant="ghost" onClick={handleCancel}>Cancel</Button>
                <Button onClick={handleSave}>Save Changes</Button>
            </div>
        )}
      </div>
    </Modal>
  );
};