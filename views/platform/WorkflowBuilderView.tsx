import React, { useState, useRef } from 'react';
import { Project, Agent } from '../../types';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

interface WorkflowBuilderViewProps {
  project: Project | undefined;
  agents: Agent[];
  onBack: () => void;
}

interface CanvasNode {
  id: string;
  type: 'agent' | 'llm' | 'tool' | 'conditional' | 'data';
  x: number;
  y: number;
  data: any;
}

const LLMIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>;
const ToolIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>;
const ConditionalIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 18-6-6 6-6"/><path d="m6 12h12"/></svg>;
const DataIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>;

const NodeItem: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
  <div className="p-3 border border-brand-border rounded-md cursor-grab bg-brand-bg-light hover:bg-brand-bg-dark active:cursor-grabbing">
    <div className="flex items-center gap-3">
      <div className="text-brand-cyan">{icon}</div>
      <div>
        <h4 className="font-semibold text-sm">{title}</h4>
        <p className="text-xs text-brand-text-dark">{description}</p>
      </div>
    </div>
  </div>
);

const AgentNode: React.FC<{ node: CanvasNode }> = ({ node }) => (
  <div
    className="absolute p-2 rounded-lg bg-brand-bg-dark border-2 border-brand-magenta w-48 shadow-lg shadow-magenta/20"
    style={{ top: node.y, left: node.x }}
  >
    <div className="flex items-center gap-2">
      <img src={node.data.avatarUrl} alt={node.data.agentName} className="w-8 h-8 rounded-full" />
      <div>
        <div className="font-bold text-sm text-brand-text-light">{node.data.agentName}</div>
        <div className="text-xs text-brand-text-dark">Agent Node</div>
      </div>
    </div>
  </div>
);

const WorkflowBuilderView: React.FC<WorkflowBuilderViewProps> = ({ project, agents, onBack }) => {
  const [nodes, setNodes] = useState<CanvasNode[]>([]);
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleDragStart = (event: React.DragEvent, agent: Agent) => {
    const data = {
      type: 'agent',
      agentId: agent.id,
      agentName: agent.name,
      avatarUrl: agent.avatarUrl,
    };
    event.dataTransfer.setData('application/json', JSON.stringify(data));
    event.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    if (!canvasRef.current) return;

    const canvasBounds = canvasRef.current.getBoundingClientRect();
    const data = JSON.parse(event.dataTransfer.getData('application/json'));

    const x = event.clientX - canvasBounds.left;
    const y = event.clientY - canvasBounds.top;
    
    const nodeWidth = 192; // 12rem
    const nodeHeight = 52; 

    const newNode: CanvasNode = {
      id: `${data.type}-${Date.now()}`,
      type: data.type,
      x: x - nodeWidth / 2,
      y: y - nodeHeight / 2,
      data: {
        agentId: data.agentId,
        agentName: data.agentName,
        avatarUrl: data.avatarUrl,
      },
    };

    setNodes(prev => [...prev, newNode]);
  };
  
  const AgentItem: React.FC<{ agent: Agent }> = ({ agent }) => (
    <div
      draggable
      onDragStart={(e) => handleDragStart(e, agent)}
      className="p-3 border border-brand-border rounded-md cursor-grab bg-brand-bg-light hover:bg-brand-bg-dark active:cursor-grabbing"
    >
      <div className="flex items-center gap-3">
        <img src={agent.avatarUrl} alt={agent.name} className="w-8 h-8 rounded-full" />
        <div>
          <h4 className="font-semibold text-sm">{agent.name}</h4>
          <p className="text-xs text-brand-text-dark">{agent.useCase}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col">
      <div className="flex-shrink-0 mb-4">
        <Button variant="ghost" onClick={onBack}>&larr; Back to Project</Button>
      </div>
      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* Node Palette */}
        <aside className="w-80 flex-shrink-0">
          <Card className="h-full flex flex-col">
            <div className="p-4 border-b border-brand-border">
              <h3 className="font-semibold">Core Node Types</h3>
            </div>
            <div className="p-4 space-y-3">
              <NodeItem icon={<LLMIcon/>} title="LLM Node" description="Executes a pure LLM turn." />
              <NodeItem icon={<ToolIcon/>} title="Tool Node" description="Calls an external API." />
              <NodeItem icon={<ConditionalIcon/>} title="Conditional Node" description="Decision gate based on logic." />
              <NodeItem icon={<DataIcon/>} title="Data Node" description="Reads/writes to state memory." />
            </div>
            <div className="p-4 border-t border-brand-border">
              <h3 className="font-semibold">Project Agents</h3>
            </div>
            <div className="flex-1 p-4 space-y-3 overflow-y-auto">
              {agents.length > 0 ? (
                agents.map(agent => <AgentItem key={agent.id} agent={agent} />)
              ) : (
                <p className="text-xs text-brand-text-dark text-center">No agents in this project.</p>
              )}
            </div>
          </Card>
        </aside>

        {/* Canvas */}
        <main 
            ref={canvasRef}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="flex-1 bg-brand-bg-light border border-brand-border rounded-xl relative overflow-hidden">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#3a3a3a 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-brand-bg-dark/80"></div>
          
          <div className="relative w-full h-full">
            {nodes.map(node => {
              if (node.type === 'agent') {
                return <AgentNode key={node.id} node={node} />;
              }
              // Other node types can be rendered here in the future
              return null;
            })}

            {nodes.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center text-brand-text-dark p-4 rounded-lg bg-brand-bg-light/50">
                  <h3 className="font-semibold text-lg text-brand-text-light">Workflow Canvas</h3>
                  <p>Drag agents or nodes from the palette to begin building.</p>
                </div>
              </div>
            )}
          </div>

          <div className="absolute top-4 right-4 flex gap-2">
            <Button variant="outline">Save</Button>
            <Button>Publish</Button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default WorkflowBuilderView;
