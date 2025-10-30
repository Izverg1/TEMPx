import React from 'react';
import { Agent, Project } from '../../types';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../../components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { NerveCenterVisualization } from '../../components/platform/NerveCenterVisualization';

interface DashboardViewProps {
  agents: Agent[];
  projects: Project[];
  onSelectProject: (projectId: string) => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({ agents, projects, onSelectProject }) => {
  const totalInteractions = projects.reduce((sum, p) => sum + p.totalInteractions, 0);
  const totalROI = projects.reduce((sum, p) => sum + p.estimatedROI, 0);
  
  const weightedFCR = projects.reduce((sum, p) => sum + (p.fcr * p.totalInteractions), 0) / (totalInteractions || 1);
  const weightedEscalation = projects.reduce((sum, p) => sum + (p.escalationRate * p.totalInteractions), 0) / (totalInteractions || 1);

  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'Active': return 'bg-green-500/20 text-green-400';
      case 'Optimizing': return 'bg-yellow-500/20 text-yellow-400';
      case 'Error': return 'bg-red-500/20 text-red-400';
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Estimated Total Savings (ROI)</CardTitle>
            <CardDescription>YTD. (Automated Interactions * Avg Cost) - OpEx</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${totalROI.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Aggregate FCR</CardTitle>
            <CardDescription>First Call Resolution across all projects.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{weightedFCR.toFixed(1)}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Human Escalation Rate</CardTitle>
            <CardDescription>Inverse of FCR across all projects.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{weightedEscalation.toFixed(1)}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Projects</CardTitle>
            <CardDescription>Total number of active projects.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{projects.length}</div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Project Summary Grid</CardTitle>
              <CardDescription>Granular performance data per project. Click a row to view details.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Project Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>FCR</TableHead>
                    <TableHead>Escalations</TableHead>
                    <TableHead className="text-right">Interactions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projects.map(project => (
                    <TableRow key={project.id} onClick={() => onSelectProject(project.id)} className="cursor-pointer">
                      <TableCell className="font-medium text-brand-cyan hover:underline">{project.name}</TableCell>
                      <TableCell>
                         <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(project.status)}`}>
                            {project.status}
                         </span>
                      </TableCell>
                      <TableCell>{project.fcr}%</TableCell>
                      <TableCell>{project.escalationRate}%</TableCell>
                      <TableCell className="text-right">{project.totalInteractions.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        <Card className="flex flex-col">
            <CardHeader>
              <CardTitle>Nerve Center Visualization</CardTitle>
              <CardDescription>Real-time system flow.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex items-center justify-center">
              <NerveCenterVisualization projects={projects} agents={agents} />
            </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardView;