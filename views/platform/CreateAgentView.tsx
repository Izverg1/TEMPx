import React, { useState, useEffect } from 'react';
import { Agent, Project } from '../../types';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { generateAgentPersona, generateAgentAvatar, AgentPersona } from '../../services/geminiService';
import { Progress } from '../../components/ui/Progress';

interface CreateAgentViewProps {
    onAgentCreate: (agent: Omit<Agent, 'id' | 'interactions' | 'createdAt' | 'projectId' | 'fcr' | 'escalationRate' | 'sentimentScore' | 'workflowsCompleted' | 'valueGenerated' | 'performanceHistory' | 'audienceSegments'>) => void;
    onBack: () => void;
    project: Project | undefined;
}

type Step = 'platform' | 'config' | 'persona' | 'knowledge' | 'deploy';

const PERSONALITY_MAX_LENGTH = 500;
const examplePrompts = [
    'A friendly and empathetic agent for a high-end fashion brand. The agent should be knowledgeable about current trends and provide styling advice.',
    'A professional and direct agent for a financial services company. The agent must prioritize security, be accurate with information, and never sound uncertain.',
    'An enthusiastic and adventurous agent for a travel agency. The agent should be an expert in exotic destinations and inspire customers to book unique experiences.'
];

const availableCapabilities = [
    'Multi-language support',
    'Sentiment analysis',
    'Real-time data lookup',
    'Proactive engagement'
];


const CreateAgentView: React.FC<CreateAgentViewProps> = ({ onAgentCreate, onBack, project }) => {
    const [step, setStep] = useState<Step>('platform');
    
    // Step 1: Platform
    const [deploymentType, setDeploymentType] = useState<'UNITY_Internal' | 'External_Hybrid'>('UNITY_Internal');
    const [externalPlatform, setExternalPlatform] = useState('');
    const [externalVoice, setExternalVoice] = useState('');

    // Step 2: Config
    const [platformApiKey, setPlatformApiKey] = useState('');
    const [voiceApiKey, setVoiceApiKey] = useState('');
    
    // Step 3: Persona
    const [name, setName] = useState('');
    const [useCase, setUseCase] = useState<'Customer Service' | 'Sales' | 'Technical Support' | 'Onboarding'>('Customer Service');
    const [personalityPrompt, setPersonalityPrompt] = useState('');
    const [avatar, setAvatar] = useState<string | null>(null);
    const [isGeneratingAvatar, setIsGeneratingAvatar] = useState(false);
    const [ttsModel, setTtsModel] = useState<'gemini-2.5-flash-preview-tts' | 'ElevenLabs-v2'>('gemini-2.5-flash-preview-tts');
    const [capabilities, setCapabilities] = useState<string[]>([]);
    
    const [generatedPersona, setGeneratedPersona] = useState<AgentPersona | null>(null);
    const [isGeneratingPersona, setIsGeneratingPersona] = useState(false);

    // Step 5: Deploy
    const [monthlyBudget, setMonthlyBudget] = useState<string>('5000');

    // Global State
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (deploymentType === 'UNITY_Internal') {
            setTtsModel('gemini-2.5-flash-preview-tts');
        } else {
            setTtsModel('ElevenLabs-v2');
        }
    }, [deploymentType]);

    const stepConfig = {
        'platform': { title: 'Expertise & Platform', progress: 20 },
        'config': { title: 'External Configuration', progress: 40 },
        'persona': { title: 'Persona & Voice', progress: 60 },
        'knowledge': { title: 'Knowledge & Data', progress: 80 },
        'deploy': { title: 'Deployment & Budget', progress: 100 },
    };

    const handleNext = () => {
        setError(null);
        switch (step) {
            case 'platform':
                if (deploymentType === 'External_Hybrid') setStep('config');
                else setStep('persona');
                break;
            case 'config':
                setStep('persona');
                break;
            case 'persona':
                if (!name || !personalityPrompt) {
                    setError('Please fill in Agent Name and Personality.');
                    return;
                }
                if (!generatedPersona) {
                    setError('Please generate the agent persona before proceeding.');
                    return;
                }
                setStep('knowledge');
                break;
            case 'knowledge':
                setStep('deploy');
                break;
        }
    };
    
    const handleBack = () => {
        setError(null);
        switch (step) {
            case 'config':
                setStep('platform');
                break;
            case 'persona':
                if (deploymentType === 'External_Hybrid') setStep('config');
                else setStep('platform');
                break;
            case 'knowledge':
                setStep('persona');
                break;
            case 'deploy':
                setStep('knowledge');
                break;
        }
    }
    
    const handleGeneratePersona = async () => {
        if (!personalityPrompt) {
            setError("Please provide a personality description first.");
            return;
        }
        setIsGeneratingPersona(true);
        setError(null);
        try {
            const persona = await generateAgentPersona(personalityPrompt);
            setGeneratedPersona(persona);
        } catch (err) {
            console.error(err);
            setError('Failed to generate persona. Please try again.');
            setGeneratedPersona(null);
        } finally {
            setIsGeneratingPersona(false);
        }
    };

    const handleGenerateAvatar = async () => {
        if (!name || !personalityPrompt) {
            setError("Please provide a name and personality before generating an avatar.");
            return;
        }
        setIsGeneratingAvatar(true);
        setError(null);
        try {
            const generatedAvatar = await generateAgentAvatar(name, personalityPrompt);
            setAvatar(generatedAvatar);
        } catch (err) {
            console.error(err);
            setError('Failed to generate avatar. Please try again.');
        } finally {
            setIsGeneratingAvatar(false);
        }
    };

    const handleCapabilityChange = (capability: string) => {
        setCapabilities(prev => 
            prev.includes(capability)
                ? prev.filter(c => c !== capability)
                : [...prev, capability]
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!generatedPersona) {
            setError("Please generate a persona before creating the agent.");
            return;
        }
        setIsLoading(true);
        setError(null);

        const newAgent = {
            name,
            useCase,
            status: 'Training' as const,
            personality: generatedPersona.personality,
            backstory: generatedPersona.backstory,
            greeting: generatedPersona.greeting,
            avatarUrl: avatar ? `data:image/png;base64,${avatar}` : '',
            deploymentType,
            voiceProfile: { gender: 'Female' as const, region: 'US-East' as const, style: 'Enthusiastic' as const },
            ttsModel: ttsModel,
            monthlyBudget: Number(monthlyBudget) || 0,
            capabilities: capabilities,
        };
        onAgentCreate(newAgent);
    };

    return (
        <div>
            <Button variant="ghost" onClick={step === 'platform' ? onBack : handleBack} className="mb-4">
                &larr; Back
            </Button>
            <Card className="max-w-3xl mx-auto">
                <CardHeader>
                    <div className="flex justify-between items-center mb-2">
                        <CardTitle>Agent Generation Wizard</CardTitle>
                        <span className="text-sm text-brand-text-dark">{stepConfig[step].progress}% Complete</span>
                    </div>
                    <Progress value={stepConfig[step].progress} />
                    <CardDescription className="pt-2">{stepConfig[step].title}</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-6 min-h-[350px]">
                       {step === 'platform' && (
                           <div className="space-y-4">
                               <p className="text-sm">Define role and select the Core Conversational Platform.</p>
                               <div className="grid grid-cols-2 gap-4">
                                    <button type="button" onClick={() => setDeploymentType('UNITY_Internal')} className={`p-4 rounded-lg border-2 text-left ${deploymentType === 'UNITY_Internal' ? 'border-brand-cyan' : 'border-brand-border'}`}>
                                        <h4 className="font-semibold">UNITY Internal</h4>
                                        <p className="text-xs text-brand-text-dark">Full LLM, Workflow, TTS and Hosting managed by UNITY.</p>
                                    </button>
                                     <button type="button" onClick={() => setDeploymentType('External_Hybrid')} className={`p-4 rounded-lg border-2 text-left ${deploymentType === 'External_Hybrid' ? 'border-brand-cyan' : 'border-brand-border'}`}>
                                        <h4 className="font-semibold">External / Hybrid</h4>
                                        <p className="text-xs text-brand-text-dark">Integrate with external providers like Kore.ai for logic or ElevenLabs for voice.</p>
                                    </button>
                               </div>
                               {deploymentType === 'External_Hybrid' && (
                                   <div className="space-y-4 pt-4">
                                       <Input value={externalPlatform} onChange={e => setExternalPlatform(e.target.value)} placeholder="External Platform (e.g., Kore.ai)" />
                                       <Input value={externalVoice} onChange={e => setExternalVoice(e.target.value)} placeholder="External Voice Provider (e.g., ElevenLabs)" />
                                   </div>
                               )}
                           </div>
                       )}
                       {step === 'config' && (
                           <div className="space-y-4">
                               <p className="text-sm">Securely provide credentials for external services.</p>
                               { externalPlatform && 
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Platform API Key ({externalPlatform})</label>
                                    <Input type="password" value={platformApiKey} onChange={e => setPlatformApiKey(e.target.value)} placeholder="Enter Platform API Key" />
                                </div>
                               }
                               { externalVoice &&
                                 <div className="space-y-2">
                                    <label className="text-sm font-medium">Voice Provider API Key ({externalVoice})</label>
                                    <Input type="password" value={voiceApiKey} onChange={e => setVoiceApiKey(e.target.value)} placeholder="Enter Voice API Key" />
                                </div>
                               }
                           </div>
                       )}
                       {step === 'persona' && (
                           <div className="space-y-6">
                             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <label htmlFor="name" className="text-sm font-medium">Agent Name</label>
                                    <Input id="name" placeholder="e.g., Athena" value={name} onChange={e => setName(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                     <label htmlFor="useCase" className="text-sm font-medium">Use Case</label>
                                     <select id="useCase" value={useCase} onChange={e => setUseCase(e.target.value as any)} className="w-full h-10 bg-brand-bg-light border border-brand-border rounded-md px-3 text-brand-text-light focus:ring-2 focus:ring-brand-cyan">
                                         <option>Customer Service</option>
                                         <option>Sales</option>
                                         <option>Technical Support</option>
                                         <option>Onboarding</option>
                                     </select>
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="ttsModel" className="text-sm font-medium">TTS Model</label>
                                    <select
                                        id="ttsModel"
                                        value={ttsModel}
                                        onChange={e => setTtsModel(e.target.value as any)}
                                        className="w-full h-10 bg-brand-bg-light border border-brand-border rounded-md px-3 text-brand-text-light focus:ring-2 focus:ring-brand-cyan disabled:opacity-50"
                                        disabled={deploymentType === 'UNITY_Internal'}
                                    >
                                        <option value="gemini-2.5-flash-preview-tts">Gemini TTS</option>
                                        <option value="ElevenLabs-v2">ElevenLabs v2</option>
                                    </select>
                                     {deploymentType === 'UNITY_Internal' && (
                                        <p className="text-xs text-brand-text-dark">
                                            Gemini TTS is used for internal deployments.
                                        </p>
                                    )}
                                </div>
                              </div>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label htmlFor="personality" className="text-sm font-medium">Personality & Instructions</label>
                                     <span className={`text-xs font-mono ${personalityPrompt.length >= PERSONALITY_MAX_LENGTH ? 'text-red-400' : 'text-brand-text-dark'}`}>
                                        {personalityPrompt.length}/{PERSONALITY_MAX_LENGTH}
                                    </span>
                                </div>
                                <Textarea
                                    id="personality"
                                    placeholder="Describe the agent's tone, expertise, and any specific instructions..."
                                    value={personalityPrompt}
                                    onChange={e => { setPersonalityPrompt(e.target.value); setGeneratedPersona(null); }}
                                    rows={4}
                                    maxLength={PERSONALITY_MAX_LENGTH}
                                />
                                <div className="text-xs text-brand-text-dark flex justify-between items-start">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="font-semibold text-brand-text-dark">Try an example:</span>
                                        <button type="button" onClick={() => { setPersonalityPrompt(examplePrompts[0]); setGeneratedPersona(null); }} className="px-2 py-1 bg-brand-bg-dark rounded hover:bg-black/20 text-brand-text-dark hover:text-brand-text-light transition-colors">Fashion</button>
                                        <button type="button" onClick={() => { setPersonalityPrompt(examplePrompts[1]); setGeneratedPersona(null); }} className="px-2 py-1 bg-brand-bg-dark rounded hover:bg-black/20 text-brand-text-dark hover:text-brand-text-light transition-colors">Finance</button>
                                        <button type="button" onClick={() => { setPersonalityPrompt(examplePrompts[2]); setGeneratedPersona(null); }} className="px-2 py-1 bg-brand-bg-dark rounded hover:bg-black/20 text-brand-text-dark hover:text-brand-text-light transition-colors">Travel</button>
                                    </div>
                                     <Button type="button" size="sm" onClick={handleGeneratePersona} disabled={isGeneratingPersona || !personalityPrompt}>
                                        {isGeneratingPersona ? 'Generating...' : 'Generate Persona'}
                                    </Button>
                                </div>
                            </div>
                            
                             {isGeneratingPersona && (
                                 <div className="text-center text-sm text-brand-text-dark">Generating persona...</div>
                             )}

                             {generatedPersona && (
                                 <div className="space-y-3 p-4 bg-brand-bg-dark rounded-lg">
                                     <h4 className="font-semibold text-brand-text-light">Generated Persona Preview</h4>
                                     <div>
                                         <label className="text-xs font-bold text-brand-text-dark">PERSONALITY</label>
                                         <p className="text-sm text-brand-text-light">{generatedPersona.personality}</p>
                                     </div>
                                      <div>
                                         <label className="text-xs font-bold text-brand-text-dark">BACKSTORY</label>
                                         <p className="text-sm text-brand-text-light">{generatedPersona.backstory}</p>
                                     </div>
                                      <div>
                                         <label className="text-xs font-bold text-brand-text-dark">GREETING</label>
                                         <p className="text-sm text-brand-text-light">"{generatedPersona.greeting}"</p>
                                     </div>
                                 </div>
                             )}

                             <div className="space-y-2">
                                <label className="text-sm font-medium">Agent Avatar</label>
                                <div className="flex items-center gap-4">
                                    <div className="w-20 h-20 rounded-full bg-brand-bg-dark flex items-center justify-center overflow-hidden border-2 border-brand-border">
                                        {isGeneratingAvatar ? (<div className="w-6 h-6 border-4 border-t-brand-cyan border-brand-bg-dark rounded-full animate-spin"></div>)
                                         : avatar ? (<img src={`data:image/png;base64,${avatar}`} alt="Generated Avatar" className="w-full h-full object-cover" />)
                                         : (<svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-brand-text-dark" viewBox="_24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M5.52 19c.64-2.2 1.84-3 3.22-3h6.52c1.38 0 2.58.8 3.22 3"/><circle cx="12" cy="10" r="3"/></svg>)}
                                    </div>
                                    <div>
                                        <Button type="button" variant="outline" onClick={handleGenerateAvatar} disabled={isGeneratingAvatar || !name || !personalityPrompt}>
                                            {isGeneratingAvatar ? 'Generating...' : 'Generate Avatar'}
                                        </Button>
                                        <p className="text-xs text-brand-text-dark mt-2">Generate a unique avatar based on the agent's name and personality.</p>
                                    </div>
                                </div>
                            </div>

                             <div className="space-y-2">
                                <label className="text-sm font-medium">Agent Capabilities</label>
                                <div className="grid grid-cols-2 gap-x-4 gap-y-2 p-3 bg-brand-bg-dark rounded-md">
                                    {availableCapabilities.map(cap => (
                                        <label key={cap} className="flex items-center space-x-2 text-sm cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={capabilities.includes(cap)}
                                                onChange={() => handleCapabilityChange(cap)}
                                                className="h-4 w-4 rounded bg-brand-bg-light border-brand-border text-brand-cyan focus:ring-2 focus:ring-offset-brand-bg-dark focus:ring-brand-cyan"
                                            />
                                            <span>{cap}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                       )}
                       {step === 'knowledge' && (
                           <div className="text-center p-8">
                                <h3 className="font-semibold mb-2">Knowledge & Data Grounding</h3>
                                <p className="text-sm text-brand-text-dark">This is where you would upload knowledge base content (vectorization process), link proprietary databases, and configure data permissions.</p>
                                <Button type="button" variant="outline" className="mt-4">Upload Documents</Button>
                           </div>
                       )}
                       {step === 'deploy' && (
                           <div className="text-center p-8">
                               <h3 className="font-semibold mb-2">Deployment & Budget</h3>
                               <p className="text-sm text-brand-text-dark">Set the budget limit and confirm the project target.</p>
                               <div className="max-w-xs mx-auto mt-4">
                                   <label htmlFor="budget" className="text-sm font-medium">Monthly Budget Limit ($)</label>
                                   <Input 
                                      id="budget" 
                                      type="number" 
                                      placeholder="5000" 
                                      value={monthlyBudget} 
                                      onChange={(e) => setMonthlyBudget(e.target.value)}
                                   />
                               </div>
                           </div>
                       )}
                    </CardContent>
                    <CardFooter className="flex justify-between items-center">
                         <div>{error && <p className="text-red-500 text-sm">{error}</p>}</div>
                         <div className="flex gap-2">
                             {step !== 'deploy' ? (
                                <Button type="button" onClick={handleNext}>Next &rarr;</Button>
                             ) : (
                                <Button type="submit" disabled={isLoading || isGeneratingAvatar || isGeneratingPersona}>
                                    {isLoading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Creating Agent...
                                        </>
                                    ) : (
                                        'Create Agent'
                                    )}
                                </Button>
                             )}
                         </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
};

export default CreateAgentView;