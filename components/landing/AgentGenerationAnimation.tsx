import React, { useState, useEffect } from 'react';

const agents = [
    { name: 'Cognito', role: 'Cognitive Process Automation', icon: 'database', color: '#00f5d4', colorRgb: '0, 245, 212' },
    { name: 'Synapse', role: 'Customer Intent Analysis', icon: 'nodes', color: '#ff2e63', colorRgb: '255, 46, 99' },
    { name: 'Lex', role: 'Natural Language Understanding', icon: 'dialog', color: '#a143ff', colorRgb: '161, 67, 255' },
    { name: 'Cygnus', role: 'Supply Chain Logistics AI', icon: 'docs', color: '#fce38a', colorRgb: '252, 227, 138' },
];

const ANIMATION_DURATION = 5000;

interface AgentGenerationAnimationProps {
    onTransition: () => void;
}

const AgentIcon: React.FC<{ icon: string } & React.SVGAttributes<SVGElement>> = ({ icon, ...props }) => {
    switch (icon) {
        case 'database':
            return <>
                <ellipse {...props} cx="12" cy="5" rx="9" ry="3" />
                <path {...props} d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
                <path {...props} d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
            </>;
        case 'nodes':
            return <>
                <circle {...props} cx="18" cy="5" r="3" />
                <circle {...props} cx="6" cy="12" r="3" />
                <circle {...props} cx="18" cy="19" r="3" />
                <line {...props} x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                <line {...props} x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </>;
        case 'dialog':
            return <path {...props} d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />;
        case 'docs':
            return <>
                <path {...props} d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline {...props} points="14 2 14 8 20 8" />
                <line {...props} x1="16" y1="13" x2="8" y2="13" />
                <line {...props} x1="16" y1="17" x2="8" y2="17" />
                <polyline {...props} points="10 9 9 9 8 9" />
            </>;
        default:
            return null;
    }
};

const NovaFactoryIcon: React.FC<{ color: string; activeKey: number }> = ({ color, activeKey }) => (
    <div className="relative w-20 h-20">
        <style>{`
            @keyframes factory-pulse {
                0% { transform: scale(0.9); opacity: 0.6; }
                50% { transform: scale(1); opacity: 1; }
                100% { transform: scale(0.9); opacity: 0.6; }
            }
            .factory-base-pulse {
                animation: factory-pulse 4s ease-in-out infinite;
                filter: blur(10px);
            }
            @keyframes factory-spawn-burst {
                0% { transform: scale(0.5); opacity: 0; }
                20% { opacity: 1; }
                100% { transform: scale(3); opacity: 0; }
            }
            .factory-spawn-burst-animate {
                animation: factory-spawn-burst var(--anim-dur) ease-out infinite;
            }
        `}</style>
        <div 
            className="absolute inset-0 rounded-full factory-base-pulse"
            style={{ background: `radial-gradient(circle, ${color} 0%, transparent 60%)` }}
        />
        <div 
            key={activeKey}
            className="absolute inset-0 rounded-full border-2 factory-spawn-burst-animate"
            style={{ borderColor: color }}
        />
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="1" className="relative w-full h-full text-gray-300 drop-shadow-lg">
            <path stroke="currentColor" d="M12 2L2 7l10 5 10-5-10-5z" />
            <path stroke="currentColor" d="M2 17l10 5 10-5" />
            <path stroke="currentColor" d="M2 12l10 5 10-5" />
            <path stroke="currentColor" d="M12 22V12" />
            <path stroke="currentColor" d="M22 7v10" />
            <path stroke="currentColor" d="M2 7v10" />
        </svg>
    </div>
);


const orbits = [
    { size: 140, duration: 20 },
    { size: 190, duration: 25 },
    { size: 240, duration: 30 },
    { size: 290, duration: 35 },
];

export const AgentGenerationAnimation: React.FC<AgentGenerationAnimationProps> = ({ onTransition }) => {
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex(prevIndex => (prevIndex + 1) % agents.length);
            onTransition();
        }, ANIMATION_DURATION);
        return () => clearInterval(interval);
    }, [onTransition]);

    const currentAgent = agents[activeIndex];

    return (
        <div className="absolute inset-0 bg-transparent overflow-hidden flex items-center justify-center p-4">
            <style>{`
                :root { 
                    --anim-dur: ${ANIMATION_DURATION}ms;
                    --agent-color: ${currentAgent.color};
                    --agent-color-rgb: ${currentAgent.colorRgb};
                }
                
                @keyframes screen-on {
                    0% { opacity: 0; transform: scale(0.98); }
                    15% { opacity: 1; transform: scale(1); }
                    95% { opacity: 1; transform: scale(1); }
                    100% { opacity: 0; transform: scale(0.98); }
                }
                .tv-screen-content { animation: screen-on var(--anim-dur) linear infinite; }

                .grid-bg-soft {
                    background-image: radial-gradient(circle at center, rgba(var(--agent-color-rgb), 0.2) 1px, transparent 1.5px);
                    background-size: 25px 25px;
                    opacity: 0.8;
                }
                
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .orbit-path {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    border-radius: 50%;
                    animation-name: spin;
                    animation-timing-function: linear;
                    animation-iteration-count: infinite;
                }
                .orbit-agent {
                    position: absolute;
                    top: -12px; 
                    left: 50%;
                    margin-left: -12px;
                    width: 24px;
                    height: 24px;
                    animation-name: spin;
                    animation-timing-function: linear;
                    animation-iteration-count: infinite;
                    animation-direction: reverse;
                }
                .orbit-agent > svg {
                    opacity: 0.6;
                    transition: opacity 0.3s, transform 0.3s;
                }

                @keyframes agent-highlight-reveal {
                    0%, 20% { transform: scale(1); opacity: 0.6; }
                    35% { transform: scale(1.6); opacity: 1; filter: drop-shadow(0 0 10px var(--agent-color)); }
                    50% { transform: scale(1.2); opacity: 1; filter: drop-shadow(0 0 10px var(--agent-color)); }
                    90% { transform: scale(1.2); opacity: 1; filter: drop-shadow(0 0 10px var(--agent-color)); }
                    100% { transform: scale(1); opacity: 0.6; }
                }
                .agent-highlight-animated {
                    animation: agent-highlight-reveal var(--anim-dur) ease-out infinite;
                }

                @keyframes card-reveal-tv {
                    0%, 50% { opacity: 0; transform: translateY(10px) translateX(-50%); }
                    60% { opacity: 1; transform: translateY(0) translateX(-50%); }
                    90% { opacity: 1; transform: translateY(0) translateX(-50%); }
                    100% { opacity: 0; transform: translateY(-5px) translateX(-50%); }
                }
                .agent-card-tv { 
                    animation: card-reveal-tv var(--anim-dur) ease-out infinite;
                    position: absolute; bottom: 10%; left: 50%;
                    padding: 0.75rem 1.5rem;
                    background: rgba(10, 10, 10, 0.7);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 0.5rem;
                    backdrop-filter: blur(10px);
                    text-align: center; color: white; width: 280px;
                }

                @keyframes fill-bar-tv { from { width: 0%; } to { width: 100%; } }

                @keyframes spawn-effect {
                    0% { transform: scale(0.5); opacity: 1; }
                    100% { transform: scale(4); opacity: 0; }
                }
                .spawn-effect-animated {
                    animation: spawn-effect 1s ease-out;
                }
            `}</style>
            
            <div className="w-full h-full max-w-2xl max-h-[480px] bg-transparent rounded-2xl p-4">
                <div className="w-full h-full bg-transparent rounded-lg relative overflow-hidden flex flex-col items-center justify-center">
                    <div key={activeIndex} className="tv-screen-content w-full h-full flex items-center justify-center">
                        <div className="absolute inset-0 grid-bg-soft"></div>

                         <div className="absolute inset-0 flex items-center justify-center">
                            <div className="relative" style={{ width: orbits[3].size, height: orbits[3].size }}>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <NovaFactoryIcon color={currentAgent.color} activeKey={activeIndex} />
                                    <div
                                        key={activeIndex}
                                        className="spawn-effect-animated absolute"
                                        style={{ filter: `drop-shadow(0 0 8px ${currentAgent.color})` }}
                                    >
                                        <svg viewBox="0 0 24 24" className="w-10 h-10">
                                            <AgentIcon
                                                icon={currentAgent.icon}
                                                stroke={currentAgent.color}
                                                fill="none"
                                                strokeWidth="1.5"
                                            />
                                        </svg>
                                    </div>
                                </div>
                                
                                {agents.map((agent, index) => {
                                    const orbit = orbits[index % orbits.length];
                                    const isActive = index === activeIndex;
                                    return (
                                        <div 
                                            key={agent.name}
                                            className="orbit-path"
                                            style={{
                                                width: `${orbit.size}px`,
                                                height: `${orbit.size}px`,
                                                marginLeft: `-${orbit.size / 2}px`,
                                                marginTop: `-${orbit.size / 2}px`,
                                                animationDuration: `${orbit.duration}s`,
                                                animationDirection: index % 2 === 0 ? 'normal' : 'reverse',
                                            }}
                                        >
                                            <div
                                                className="orbit-agent"
                                                style={{ animationDuration: `${orbit.duration}s` }}
                                            >
                                                <svg viewBox="0 0 24 24" className={isActive ? 'agent-highlight-animated' : ''}>
                                                    <AgentIcon 
                                                        icon={agent.icon} 
                                                        stroke={agent.color} 
                                                        fill="none" 
                                                        strokeWidth="1.5"
                                                    />
                                                </svg>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                    </div>
                     
                    <div key={activeIndex} className="agent-card-tv">
                        <h3 className="text-xl font-bold text-white">{currentAgent.name}</h3>
                        <p className="text-sm text-brand-text-dark">{currentAgent.role}</p>
                    </div>

                    <div className="absolute bottom-4 w-10/12 max-w-sm bg-white/5 h-1 rounded-full overflow-hidden">
                        <div 
                            key={activeIndex} 
                            style={{ 
                                animation: `fill-bar-tv var(--anim-dur) linear infinite`, 
                                transformOrigin: 'left', 
                                backgroundColor: 'var(--agent-color)',
                                height: '100%', 
                                borderRadius: '99px' 
                            }}
                        ></div>
                    </div>
                </div>
            </div>
        </div>
    );
};