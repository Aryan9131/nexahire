'use client'

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useInterviewContext } from '@/context/interviewContext';
import { AvatarImage } from '@radix-ui/react-avatar';
import { AlarmClock, Mic, Phone } from 'lucide-react';
import React, { useEffect, useState, useRef } from 'react';
import Vapi from '@vapi-ai/web';
import { useRouter } from 'next/navigation';

interface Conversation {
    role: string;
    content: string;
}

const StartInterviewPage = () => {
    const router = useRouter();
    const { interviewData } = useInterviewContext();
    const [isCallActive, setIsCallActive] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const vapiRef = useRef<Vapi | null>(null);
    const [conversation, setConversation] = useState<Conversation[]>([]);
    
    // Use a ref to store the latest conversation data
    const conversationRef = useRef<Conversation[]>([]);

    console.log("Interview Data:", interviewData);
    console.log("Valid API key:", process.env.NEXT_PUBLIC_VAPI_API_KEY);

    // Update the ref whenever conversation state changes
    useEffect(() => {
        conversationRef.current = conversation;
        console.log("Conversation updated:", conversation);
    }, [conversation]);

    // Initialize Vapi once
    useEffect(() => {
        if (process.env.NEXT_PUBLIC_VAPI_API_KEY && !vapiRef.current) {
            try {
                vapiRef.current = new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY);

                // Set up event listeners
                vapiRef.current.on('call-start', () => {
                    console.log('Call started');
                    setIsCallActive(true);
                    setIsConnecting(false);
                    setError(null);
                });

                vapiRef.current.on('call-end', () => {
                    console.log("************** 1. Conversation inside call-end event: ", conversationRef.current);
                    console.log('Call ended');
                    setIsCallActive(false);
                    setIsConnecting(false);
                    
                    // Use setTimeout to ensure state is fully updated before generating feedback
                    setTimeout(() => {
                        generateFeedback(conversationRef.current);
                    }, 100);
                });

                vapiRef.current.on('speech-start', () => {
                    console.log('User started speaking');
                });

                vapiRef.current.on('speech-end', () => {
                    console.log('User stopped speaking');
                });

                vapiRef.current.on('message', (message) => {
                    console.log('message:', message);
                    if (message?.conversation && Array.isArray(message.conversation) && message.conversation.length > 0) {
                        console.log("setting conversation: ", message.conversation);
                        const newConversations = message.conversation.map((msg: any) => ({
                            role: msg.role,
                            content: msg.content,
                        }));
                        console.log("new conversations mapped: ", newConversations);
                        
                        setConversation(prev => {
                            console.log("********** previous conversation: ", prev);
                            console.log("********** new conversation: ", newConversations);
                            
                            // Check if this is a duplicate message to avoid adding the same conversation multiple times
                            const isDuplicate = prev.length > 0 && 
                                JSON.stringify(prev.slice(-newConversations.length)) === JSON.stringify(newConversations);
                            
                            if (isDuplicate) {
                                console.log("Duplicate conversation detected, not adding");
                                return prev;
                            }
                            
                            // Instead of spreading all new conversations, replace with the complete conversation
                            return newConversations;
                        });
                    }
                });

                vapiRef.current.on('error', (error: any) => {
                    console.error('Vapi error:', error);
                    setError('Connection error occurred');
                    setIsConnecting(false);
                    setIsCallActive(false);
                });

            } catch (err) {
                console.error('Failed to initialize Vapi:', err);
                setError('Failed to initialize voice assistant');
            }
        }

        // Cleanup function
        return () => {
            if (vapiRef.current) {
                try {
                    vapiRef.current.stop();
                    vapiRef.current = null;
                } catch (error) {
                    console.error('Error stopping Vapi:', error);
                }
            }
        };
    }, []); // Empty dependency array - only run once

    const startCall = async () => {
        if (!vapiRef.current || !interviewData) {
            setError('Voice assistant not ready or interview data missing');
            return;
        }

        // Prevent multiple calls
        if (isCallActive || isConnecting) {
            console.log('Call already active or connecting');
            return;
        }

        setIsConnecting(true);
        setError(null);
        
        // Reset conversation at the start of a new call
        setConversation([]);
        conversationRef.current = [];

        try {
            // Ensure any existing call is stopped before starting new one
            await vapiRef.current.stop();

            // Small delay to ensure cleanup
            await new Promise(resolve => setTimeout(resolve, 500));

            const assistantOptions = {
                name: "AI Recruiter",
                firstMessage: `Hi ${interviewData.userName}, how are you? Ready for your interview for the ${interviewData.jobPosition} position?`,
                transcriber: {
                    provider: "deepgram" as const,
                    model: "nova-2" as const,
                    language: "en-US" as const,
                },
                voice: {
                    provider: "playht" as const,
                    voiceId: "jennifer",
                },
                model: {
                    provider: "openai" as const,
                    model: "gpt-4" as const,
                    messages: [
                        {
                            role: "system" as const,
                            content: `
You are an AI voice assistant conducting interviews.
You help candidates provide detailed answers, assess their responses.
Begin the conversation with a friendly introduction, setting a relaxed yet professional tone. Example:
"Hey there! Welcome to your ${interviewData.jobPosition} interview. Let's get started with a few questions!"

Ask one question at a time and wait for the candidate's response before proceeding. Keep the questions clear and concise. Below are the questions ask one by one:
Questions: ${JSON.stringify(interviewData.questions)}.

If the candidate struggles, offer hints or rephrase the question without giving away the answer. Example:
"Need a hint? Think about how React tracks component updates!"

Provide brief, encouraging feedback after each answer. Example:
"Nice! That's a solid answer."
"Good point! Can you elaborate on that a bit more?"

Keep the conversation natural and engaging — use casual phrases like "Alright, next up..." or "Let's tackle a tricky one!"

After 5-7 questions, wrap up the interview smoothly by summarizing their performance. Example:
"That was great! You handled some tough questions well. Keep sharpening your skills!"

End on a positive note:
"Thanks for chatting! Hope to see you crushing projects soon!"

Key Guidelines:
- Keep questioning, clear, and engaging
- Keep responses short and natural, like a real conversation
- Adapt based on the candidate's confidence level
- Ensure the interview remains focused on ${interviewData.jobPosition}
                            `
                        },
                    ],
                },
            };

            await vapiRef.current.start(assistantOptions);

        } catch (error) {
            console.error('Failed to start call:', error);
            setError(`Failed to start voice interview: ${error instanceof Error ? error.message : 'Unknown error'}`);
            setIsConnecting(false);
        }
    };

    const generateFeedback = async (conversationData?: Conversation[]) => {
        // Use the passed conversation data or the ref data
        const finalConversation = conversationData || conversationRef.current;
        console.log("Generating feedback for conversation:", finalConversation);
        
        if (finalConversation.length === 0) {
            console.log("No conversation data available for feedback");
            return;
        }
        
        try {
            console.log("** Generating feedback for conversation- 1:", finalConversation);
            const response = await fetch('/api/interview/feedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ conversations: finalConversation, userName: interviewData?.userName, userEmail: interviewData?.email, interview_id: interviewData?.id }),
            });

            if (!response.ok) {
                throw new Error('Failed to generate feedback');
            }

            const feedback = await response.json();
            console.log('Generated feedback:', feedback);

            router.replace(`/interview/${interviewData?.id}/completed`);
        } catch (error) {
            console.error('Error generating feedback:', error);
        }
    };

    const endCall = async () => {
        if (vapiRef.current) {
            try {
                console.log("************** 1. Conversation inside end call function : ", conversationRef.current);
                
                // Store the current conversation before stopping the call
                const currentConversation = conversationRef.current;
                
                await vapiRef.current.stop();
                setIsCallActive(false);
                setIsConnecting(false);
                
                console.log("************** 2. Conversation after stopping call : ", currentConversation);
                
                // Generate feedback with the stored conversation data
                // if (currentConversation.length > 0) {
                //     generateFeedback(currentConversation);
                // }
            } catch (error) {
                console.error('Error ending call:', error);
                setError('Error ending call');
            }
        }
    };

    return (
        <div className='px-6 md:px-12 py-5'>
            <div className='flex justify-between items-center mt-10'>
                <h2 className='text-lg font-bold'>AI Interview Session</h2>
                <div className='flex items-center'>
                    <AlarmClock className='mr-2 w-4 h-4' />
                    <p>{interviewData?.duration ? `${interviewData.duration} Minutes` : "00:00"}</p>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mt-4">
                    <p>{error}</p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-8">
                <div className="flex flex-col items-center justify-center bg-white rounded-lg shadow-lg p-8 min-h-[200px]">
                    <Avatar className="w-20 h-20 mb-4">
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback className="text-xl">AI</AvatarFallback>
                    </Avatar>
                    <p className='text-lg font-medium text-gray-800'>AI Recruiter</p>
                    <div className={`mt-3 px-3 py-1 rounded-full text-xs font-medium ${isCallActive ? 'bg-green-100 text-green-800' :
                            isConnecting ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-600'
                        }`}>
                        {isCallActive ? 'Speaking' : isConnecting ? 'Connecting...' : 'Ready'}
                    </div>
                </div>

                <div className="flex flex-col items-center justify-center bg-white rounded-lg shadow-lg p-8 min-h-[200px]">
                    <Avatar className="w-20 h-20 mb-4">
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback className="text-xl">
                            {interviewData?.userName?.charAt(0)?.toUpperCase() || 'U'}
                        </AvatarFallback>
                    </Avatar>
                    <p className='text-lg font-medium text-gray-800'>
                        {interviewData?.userName || "Unknown User"}
                    </p>
                    <div className={`mt-3 px-3 py-1 rounded-full text-xs font-medium ${isCallActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                        }`}>
                        {isCallActive ? 'In Interview' : 'Waiting'}
                    </div>
                </div>
            </div>

            <div className='w-full flex items-center justify-center gap-8 mt-8'>
                <div className="relative">
                    <Mic className={`p-3 w-14 h-14 rounded-full cursor-pointer transition-all duration-200 ${isCallActive ? 'bg-green-500 text-white shadow-lg' :
                            'bg-gray-400 text-white hover:bg-gray-500'
                        }`} />
                    {isCallActive && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
                    )}
                </div>

                <Phone
                    onClick={isCallActive ? endCall : startCall}
                    className={`p-3 w-14 h-14 rounded-full transition-all duration-200 ${isCallActive ? 'bg-red-500 text-white hover:bg-red-600 shadow-lg cursor-pointer' :
                            isConnecting ? 'bg-yellow-500 text-white cursor-not-allowed' :
                                'bg-green-500 text-white hover:bg-green-600 shadow-lg cursor-pointer'
                        } ${(!interviewData && !isCallActive) ? 'opacity-50 cursor-not-allowed' : ''}`}
                />
            </div>

            <div className="text-center mt-6">
                {isConnecting && (
                    <p className="text-sm text-gray-600">Connecting to AI interviewer...</p>
                )}
                {isCallActive && (
                    <p className="text-sm text-green-600 font-medium">Interview in progress</p>
                )}
                {!isCallActive && !isConnecting && interviewData && (
                    <p className="text-sm text-gray-600">Click the green phone to start your interview</p>
                )}
            </div>

            {!interviewData && (
                <div className="text-center mt-8 p-4 bg-yellow-50 rounded-md border border-yellow-200">
                    <p className="text-yellow-800">No interview data found. Please go back and start again.</p>
                </div>
            )}
        </div>
    )
}

export default StartInterviewPage