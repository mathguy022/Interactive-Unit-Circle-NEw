
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';
import { CloseIcon, SendIcon } from '../constants';

interface ChatbotProps {
    onClose: () => void;
}

interface Message {
    role: 'user' | 'model';
    content: string;
}

export const Chatbot: React.FC<ChatbotProps> = ({ onClose }) => {
    const [messages, setMessages] = useState<Message[]>([
        { role: 'model', content: "Hello! I'm your friendly math tutor. Ask me anything about trigonometry or the unit circle!" }
    ]);
    const [input, setInput] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const chatRef = useRef<Chat | null>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    useEffect(() => {
        const initChat = () => {
            try {
                // Safely access the API key to prevent ReferenceError if `process` is not defined.
                const API_KEY = (typeof process !== 'undefined' && process.env) ? process.env.API_KEY : undefined;

                if (!API_KEY) {
                    throw new Error("API_KEY is not configured in the environment.");
                }
                const ai = new GoogleGenAI({ apiKey: API_KEY });
                chatRef.current = ai.chats.create({
                    model: 'gemini-2.5-flash',
                    config: {
                        systemInstruction: "You are a friendly and helpful math tutor specializing in trigonometry. Your goal is to help students understand concepts related to the unit circle and mathematics. Only answer questions about math and trigonometry. If a user asks about anything else, politely decline and steer the conversation back to math.",
                    },
                });
            } catch (err) {
                 console.error("Failed to initialize chat:", err);
                 const errorMessage = "Sorry, the Math Tutor is currently unavailable. Please ensure your API key is configured correctly.";
                 setError(errorMessage);
                 setMessages(prev => [...prev, { role: 'model', content: errorMessage }]);
            }
        };
        initChat();
    }, []);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading || !chatRef.current) return;

        const newUserMessage: Message = { role: 'user', content: input };
        setMessages(prev => [...prev, newUserMessage]);
        
        const currentInput = input;
        setInput('');
        setIsLoading(true);
        setError(null);

        try {
            const chat = chatRef.current;
            const response = await chat.sendMessage(currentInput);

            const botResponse: Message = { role: 'model', content: response.text };
            setMessages(prev => [...prev, botResponse]);

        } catch (err) {
            console.error(err);
            const errorMessage = "Sorry, I couldn't get a response. Please check your connection or API key and try again.";
            setError(errorMessage);
            setMessages(prev => [...prev, { role: 'model', content: errorMessage }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-20 right-4 w-full max-w-sm h-[70vh] max-h-[600px] bg-white dark:bg-slate-800 rounded-2xl shadow-2xl flex flex-col border border-slate-200 dark:border-slate-700">
            <header className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
                <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">Math Tutor</h2>
                <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700" aria-label="Close chat">
                    <CloseIcon className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                </button>
            </header>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-3 rounded-2xl ${
                            msg.role === 'user' 
                                ? 'bg-sky-500 text-white rounded-br-lg' 
                                : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-bl-lg'
                        }`}>
                            <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                        </div>
                    </div>
                ))}
                {isLoading && (
                     <div className="flex justify-start">
                        <div className="max-w-[80%] p-3 rounded-2xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-bl-lg">
                            <div className="flex items-center space-x-2">
                                <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce"></span>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSend} className="p-4 border-t border-slate-200 dark:border-slate-700 flex items-center gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask a math question..."
                    className="flex-1 w-full p-2 border border-slate-300 dark:border-slate-600 rounded-full bg-white dark:bg-slate-700 focus:ring-2 focus:ring-sky-500 outline-none px-4"
                    disabled={isLoading || !chatRef.current}
                />
                <button
                    type="submit"
                    className="p-3 rounded-full bg-sky-500 text-white hover:bg-sky-600 disabled:bg-slate-400 transition-colors"
                    disabled={isLoading || !input.trim() || !chatRef.current}
                    aria-label="Send message"
                >
                    <SendIcon className="w-5 h-5" />
                </button>
            </form>
        </div>
    );
};
