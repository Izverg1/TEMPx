import React from 'react';
import { Project } from '../../types';

type View = 'dashboard' | 'project-detail' | 'create-agent' | 'workflow-builder';

interface HeaderProps {
    project: Project | undefined;
    view: View;
}

const Header: React.FC<HeaderProps> = ({ project, view }) => {

  const getTitle = () => {
      if (view === 'dashboard') {
          return 'Global Nerve Center';
      }
      if (view === 'workflow-builder') {
        return `Workflow Builder: ${project?.name || 'Project'}`;
      }
      if (view === 'create-agent') {
          return `Create Agent for ${project?.name || 'Project'}`;
      }
      if (project) {
          return `Project: ${project.name}`;
      }
      return 'Welcome';
  }

  return (
    <header className="flex-shrink-0 bg-brand-bg-light border-b border-brand-border px-6 h-16 flex items-center justify-between">
      <div>
        <h2 className="text-lg font-semibold text-brand-text-light">{getTitle()}</h2>
      </div>
      <div className="flex items-center space-x-4">
        <button className="text-brand-text-dark hover:text-brand-text-light">
            <BellIcon />
        </button>
        <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-brand-cyan flex items-center justify-center text-brand-bg-dark font-bold">
                A
            </div>
            <span className="text-sm font-medium text-brand-text-light">Acme Corp</span>
        </div>
      </div>
    </header>
  );
};

const BellIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path></svg>;

export default Header;