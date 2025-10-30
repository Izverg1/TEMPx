import React from 'react';

type View = 'dashboard' | 'project-detail' | 'create-agent' | 'workflow-builder';

interface SidebarProps {
  currentView: View;
  setView: (view: View) => void;
  onExit: () => void;
}

const NavItem: React.FC<{
  label: string;
  isActive: boolean;
  onClick: () => void;
  icon: React.ReactNode;
}> = ({ label, isActive, onClick, icon }) => (
  <button
    onClick={onClick}
    className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-md transition-colors ${
      isActive
        ? 'bg-brand-cyan text-brand-bg-dark font-semibold shadow-cyan'
        : 'text-brand-text-dark hover:bg-brand-bg-dark hover:text-brand-text-light'
    }`}
  >
    {icon}
    <span className="ml-3">{label}</span>
  </button>
);

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, onExit }) => {
  return (
    <aside className="hidden md:flex flex-col w-64 bg-brand-bg-light border-r border-brand-border p-4">
      <div className="flex items-center mb-8 h-8">
        <h1 className="text-xl font-bold">LiveOps <span className="text-brand-cyan">UNITY</span></h1>
      </div>
      <nav className="flex-1 space-y-2">
        <NavItem 
          label="Nerve Center" 
          isActive={currentView === 'dashboard'} 
          onClick={() => setView('dashboard')}
          icon={<HomeIcon />}
        />
        <NavItem 
          label="Project Agents" 
          isActive={currentView === 'project-detail' || currentView === 'create-agent'} 
          onClick={() => setView('project-detail')}
          icon={<UsersIcon />}
        />
        <NavItem 
          label="Workflow Builder" 
          isActive={currentView === 'workflow-builder'} 
          onClick={() => setView('workflow-builder')}
          icon={<WorkflowIcon />}
        />
      </nav>
      <div className="mt-auto">
         <div className="text-xs text-brand-text-dark p-2 text-center">Ref Arch. v13.0</div>
        <NavItem 
          label="Exit to Landing" 
          isActive={false} 
          onClick={onExit}
          icon={<LogOutIcon />}
        />
      </div>
    </aside>
  );
};

// Icons (simple SVG components)
const HomeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>;
const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>;
const WorkflowIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>;
const LogOutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" x2="9" y1="12" y2="12"></line></svg>;


export default Sidebar;