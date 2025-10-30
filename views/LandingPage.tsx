import React, { useRef, useState, useCallback } from 'react';
import { AgentGenerationAnimation } from '../components/landing/AgentGenerationAnimation';
import { Button } from '../components/ui/Button';
import { VirtualAssistant } from '../components/landing/VirtualAssistant';
import { TourBanner } from '../components/landing/TourBanner';
import { unityBackgroundImage } from '../assets/background';

interface LandingPageProps {
  onEnterPlatform: () => void;
}

const AnimatedHeroText: React.FC<{ animationKey: number; children: React.ReactNode }> = ({ animationKey, children }) => {
  return <div key={animationKey}>{children}</div>;
};

const AuthorityItem: React.FC<{ title: string; description: string }> = ({ title, description }) => (
  <div className="text-center md:text-left">
    <h3 className="font-semibold text-brand-text-light">{title}</h3>
    <p className="text-brand-text-dark text-sm">{description}</p>
  </div>
);

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
  <div className="glass-card group p-6 rounded-lg transition-all duration-300 hover:border-brand-cyan/50">
    <div className="mb-4 text-brand-cyan glow-icon transition-all duration-300 group-hover:text-white group-hover:drop-shadow-cyan">{icon}</div>
    <h3 className="font-bold text-xl mb-2 text-brand-text-light">{title}</h3>
    <p className="text-brand-text-dark">{children}</p>
  </div>
);

const IndustryCard: React.FC<{ icon: React.ReactNode; name: string }> = ({ icon, name }) => (
  <div className="flex flex-col items-center text-center p-4 rounded-lg transition-all duration-300 glass-card-hover">
    <div className="mb-3 text-brand-cyan glow-icon transition-all duration-300 group-hover:text-white group-hover:drop-shadow-cyan">{icon}</div>
    <span className="font-medium text-brand-text-light">{name}</span>
  </div>
);

// Icons
const CheckCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>;
const ZapIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>;
const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>;
const HealthcareIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>;
const InsuranceIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>;
const FinanceIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>;
const RetailIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>;
const EnergyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path></svg>;
const TravelIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"></path></svg>;
const ShieldIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>;
const ActivityIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>;
const ListIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>;

const LandingPage: React.FC<LandingPageProps> = ({ onEnterPlatform }) => {
  const governanceSectionRef = useRef<HTMLElement>(null);
  const [textAnimationKey, setTextAnimationKey] = useState(0);

  const handleAgentTransition = useCallback(() => {
    setTextAnimationKey(prev => prev + 1);
  }, []);

  const handleScrollToGovernance = useCallback(() => {
    governanceSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);
  
  const backgroundStyle = unityBackgroundImage.startsWith('data:image') 
    ? { backgroundImage: `url(${unityBackgroundImage})` }
    : {};

  return (
    <div className="relative overflow-x-hidden bg-brand-bg-dark">
      <div 
        className="fixed inset-0 z-[-1] bg-cover bg-center bg-no-repeat"
        style={backgroundStyle}
      >
        <div className="absolute inset-0 bg-brand-bg-dark/70 backdrop-blur-sm"></div>
      </div>
      
      <style>{`
        @keyframes text-cycle-fade {
          0% { opacity: 1; transform: translateY(0); }
          10% { opacity: 0; transform: translateY(5px); }
          25% { opacity: 1; transform: translateY(0); }
          100% { opacity: 1; }
        }
        .animate-text-cycle {
          animation: text-cycle-fade 4000ms ease-in-out;
        }
        
        .text-glow-cyan {
          text-shadow: 0 0 8px theme(colors.brand.cyan / 0.7), 0 0 2px theme(colors.brand.cyan);
        }

        .glass-card {
            background-color: rgba(17, 24, 39, 0.5);
            border: 1px solid theme(colors.brand.border);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
        }
        
        .glass-card-hover {
            background-color: rgba(17, 24, 39, 0.2);
            border: 1px solid transparent;
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            transition: all 0.3s ease;
        }
        .glass-card-hover:hover {
            background-color: rgba(17, 24, 39, 0.5);
            border-color: theme(colors.brand.cyan / 0.5);
        }

        .glow-icon {
            filter: drop-shadow(0 0 3px theme(colors.brand.cyan / 0.8));
        }
      `}</style>
      <header className="absolute top-0 left-0 right-0 z-10 p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold font-display tracking-wider">LiveOps <span className="text-brand-cyan text-glow-cyan">UNITY</span></h1>
        <Button onClick={onEnterPlatform}>Access Platform</Button>
      </header>

      <main>
        {/* Hero Section */}
        <section className="h-screen flex flex-col md:flex-row">
          <div className="flex-1 flex items-center justify-center p-8 md:p-12 text-center md:text-left">
              <div className="relative z-10 max-w-xl">
                  <AnimatedHeroText animationKey={textAnimationKey}>
                    <h1 className="font-display text-5xl md:text-6xl font-bold tracking-tight animate-text-cycle text-glow-cyan">
                        The AI Agent Foundry
                    </h1>
                    <p className="mt-6 text-lg text-brand-text-dark animate-text-cycle" style={{ animationDelay: '100ms' }}>
                      From Labs to Launch: Instantly deploy hyper-personalized, expert voice agents managed by the trusted Liveops Governance Hub.
                    </p>
                  </AnimatedHeroText>
                  <div className="mt-8 flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
                    <Button onClick={onEnterPlatform} size="lg">
                        Launch Your Pilot
                    </Button>
                    <Button variant="ghost" className="text-brand-text-dark" onClick={handleScrollToGovernance}>
                        View Technical Deep Dive
                    </Button>
                  </div>
                  <div className="mt-8">
                     <TourBanner />
                  </div>
              </div>
          </div>
          <div className="flex-1 relative hidden md:block">
              <div className="absolute inset-0 flex items-center justify-center p-8">
                  <div className="w-full h-full glass-card rounded-2xl">
                    <AgentGenerationAnimation onTransition={handleAgentTransition} />
                  </div>
              </div>
          </div>
        </section>

        {/* Authority Bar */}
        <section className="py-8 glass-card border-y border-brand-border">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <AuthorityItem title="Quality Agents" description="Highly Skilled. Brand-Aligned." />
              <AuthorityItem title="Flexible OpEx Model" description="Pay for Productive Time Only." />
              <AuthorityItem title="Integrated Security & Compliance" description="Audited Governance." />
            </div>
          </div>
        </section>
        
        {/* Section: The AI Agent Foundry */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-center font-display text-4xl font-bold mb-4">The AI Agent Foundry</h2>
              <p className="text-center text-brand-text-dark mb-12">
                Our 3-step value chain for building and deploying your agentic workforce: Generation, Orchestration, and Performance.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard icon={<CheckCircleIcon />} title="Expert Generation">
                Create agents from scratch or integrate external platforms (Kore.ai, ElevenLabs) using our Hybrid Deployment Model.
              </FeatureCard>
              <FeatureCard icon={<ZapIcon />} title="Workflow Intelligence">
                Agents execute complex, multi-step tasks (APIs, CRM updates) using the Agent Swarm model for ultimate speed.
              </FeatureCard>
              <FeatureCard icon={<UsersIcon />} title="Dynamic Personalization">
                Agents automatically adjust tone, language, and product offers based on real-time Age & Region Segmentation.
              </FeatureCard>
            </div>
          </div>
        </section>
        
        {/* Section: Industries We Serve */}
        <section className="py-20 bg-black/20">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-center font-display text-4xl font-bold mb-12">Expertise Where It Counts: Agents Fine-Tuned for Your Industry</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
              <IndustryCard icon={<HealthcareIcon />} name="Healthcare" />
              <IndustryCard icon={<InsuranceIcon />} name="Insurance" />
              <IndustryCard icon={<FinanceIcon />} name="Financial Services" />
              <IndustryCard icon={<RetailIcon />} name="Retail / E-commerce" />
              <IndustryCard icon={<EnergyIcon />} name="Energy & Utility" />
              <IndustryCard icon={<TravelIcon />} name="Travel & Hospitality" />
            </div>
          </div>
        </section>
        
        {/* Section: Performance, Trust, and Governance */}
        <section ref={governanceSectionRef} id="governance-section" className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-center font-display text-4xl font-bold mb-4">Performance, Trust, and Governance</h2>
              <p className="text-center text-lg text-brand-text-dark mb-12">
                "We don't just deploy AI, we <span className="text-brand-text-light font-semibold">govern</span> it."
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard icon={<ActivityIcon />} title="The Nerve Center">
                Real-time visibility into FCR, Escalation, and ROI across all projects.
              </FeatureCard>
              <FeatureCard icon={<ListIcon />} title="Immutable Audit Log">
                Full transparency and compliance tracking for every agent decision.
              </FeatureCard>
              <FeatureCard icon={<ShieldIcon />} title="QA Simulation">
                Test agent performance against historical data before they ever talk to a customer (de-risking deployment).
              </FeatureCard>
            </div>
          </div>
        </section>
      </main>
      
      <VirtualAssistant />

      <footer className="border-t border-brand-border bg-brand-bg-dark/50">
          <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row justify-between items-center">
              <p className="text-brand-text-dark text-sm text-center md:text-left mb-4 md:mb-0">
                &copy; 2025 UNITY: LiveOps.Agency. All rights reserved.
              </p>
              <div className="flex space-x-6 text-sm">
                  <a href="#" className="text-brand-text-dark hover:text-brand-text-light">Platform</a>
                  <a href="#" className="text-brand-text-dark hover:text-brand-text-light">Expertise</a>
                  <a href="#" className="text-brand-text-dark hover:text-brand-text-light">Industries</a>
                  <a href="#" className="text-brand-text-dark hover:text-brand-text-light">Demo</a>
                  <a href="#" className="text-brand-text-dark hover:text-brand-text-light">Privacy Policy</a>
                  <a href="#" className="text-brand-text-dark hover:text-brand-text-light">Terms</a>
              </div>
          </div>
      </footer>
    </div>
  );
};

export default LandingPage;