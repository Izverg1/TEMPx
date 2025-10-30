import React, { useState, useEffect } from 'react';

const messages = [
  "Our process starts with Expert Generation, creating agents fine-tuned for your industry.",
  "Workflow Intelligence enables agents to execute complex, multi-step tasks at incredible speed.",
  "Our Governance Hub provides real-time visibility and immutable audit logs for complete control.",
  "Ready to build your agentic workforce? Access the platform to begin."
];

const InfoIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>;

export const TourBanner: React.FC = () => {
    const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
    const [displayedText, setDisplayedText] = useState('');

    useEffect(() => {
        const messageInterval = setInterval(() => {
            setCurrentMessageIndex(prev => (prev + 1) % messages.length);
        }, 8000); // Change message every 8 seconds

        return () => clearInterval(messageInterval);
    }, []);

    useEffect(() => {
        setDisplayedText('');
        const currentMessage = messages[currentMessageIndex];
        let i = 0;
        
        const typingInterval = setInterval(() => {
            if (i < currentMessage.length) {
                setDisplayedText(prev => prev + currentMessage.charAt(i));
                i++;
            } else {
                clearInterval(typingInterval);
            }
        }, 30); // Typing speed

        return () => clearInterval(typingInterval);
    }, [currentMessageIndex]);
    
    return (
        <div className="glass-card p-4 flex items-center gap-4 rounded-lg max-w-md">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-brand-cyan/10 border border-brand-cyan/50 flex items-center justify-center text-brand-cyan">
                <InfoIcon />
            </div>
            <div>
                <h4 className="font-semibold text-brand-cyan text-sm">Guided Tour</h4>
                <p className="text-sm text-brand-text-dark h-10">
                    {displayedText}
                    <span className="inline-block w-2 h-3 bg-brand-cyan animate-pulse ml-1 align-middle"></span>
                </p>
            </div>
        </div>
    );
};