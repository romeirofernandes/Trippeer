import React, { useState, useRef, useEffect } from 'react';
import { FaPaperPlane, FaSpinner, FaRobot, FaUser, FaInfoCircle } from 'react-icons/fa';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { marked } from 'marked';
import Sidebar from '../components/Sidebar';

const TravelAssistant = () => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I\'m your travel assistant. Ask me anything about destinations, travel tips, or planning advice.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const renderContent = (content) => {
    const html = marked.parse(content);
    return <span dangerouslySetInnerHTML={{ __html: html }} />;
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(msgs => [...msgs, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const travelContext = `You are a helpful travel assistant named Voyager. 
      Provide concise, practical travel advice about destinations, planning, budgeting, 
      transportation, accommodations, local customs, safety tips, and attractions.
      If someone asks about a specific city or country, include 1-2 must-visit places.
      For budget questions, give practical tips rather than specific prices which may change.
      If you don't know something specific, say so rather than making up information.
      Aim to be friendly and conversational but focused on delivering useful travel information.`;

      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          contents: [
            {
              parts: [
                {
                  text: `${travelContext}\n\nUser message: ${userMessage}`
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 800
          }
        }
      );

      const aiResponse = response.data.candidates[0].content.parts[0].text;
      setMessages(msgs => [...msgs, { role: 'assistant', content: aiResponse }]);
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      setMessages(msgs => [
        ...msgs,
        { 
          role: 'assistant', 
          content: 'Sorry, I encountered an error processing your request. Please try again in a moment.',
          error: true
        }
      ]);
      toast.error('Could not connect to travel assistant', {
        position: "top-right",
        autoClose: 3000
      });
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSubmit(e);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#080808]">
      <Sidebar />
      <main className="flex-1 p-3 sm:p-4 md:p-6 lg:p-8 ml-16 sm:ml-16 md:ml-64">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-3 sm:mb-6"
          >
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#f8f8f8]">Travel Assistant</h1>
            <p className="mt-1 sm:mt-2 text-xs sm:text-sm md:text-base text-[#9cadce]">Your AI companion for travel planning and advice</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-[#111111] rounded-lg sm:rounded-xl md:rounded-2xl overflow-hidden h-[calc(100vh-10rem)] sm:h-[calc(100vh-12rem)] md:h-[600px] flex flex-col"
          >
            <div className="bg-[#161616] py-2.5 sm:py-3 md:py-4 px-3 sm:px-4 md:px-6 border-b border-[#232323]">
              <h2 className="text-sm sm:text-base md:text-lg font-semibold text-[#f8f8f8] flex items-center">
                <FaRobot className="text-[#9cadce] mr-2 text-xs sm:text-sm" />
                Travel Assistant
              </h2>
              <p className="text-[10px] sm:text-xs md:text-sm text-[#9cadce] mt-0.5">Ask me about destinations, travel tips, and more</p>
            </div>

            <div className="flex-1 overflow-y-auto p-2.5 sm:p-3 md:p-4 space-y-2.5 sm:space-y-3 md:space-y-4">
              <AnimatePresence>
                {messages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[90%] sm:max-w-[85%] md:max-w-[80%] px-2.5 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3 rounded-lg sm:rounded-xl md:rounded-2xl ${
                        message.role === 'user'
                          ? 'bg-[#9cadce] text-black ml-auto'
                          : message.error
                          ? 'bg-[#ff4757]/20 text-[#ff4757] border border-[#ff4757]/30'
                          : 'bg-[#232323] text-[#f8f8f8]'
                      }`}
                    >
                      <div className="flex items-center mb-1">
                        {message.role === 'user' ? (
                          <FaUser className="text-[10px] sm:text-xs mr-1.5 sm:mr-2" />
                        ) : (
                          <FaRobot className="text-[10px] sm:text-xs mr-1.5 sm:mr-2 text-[#9cadce]" />
                        )}
                        <span className="text-[10px] sm:text-xs font-medium">
                          {message.role === 'user' ? 'You' : 'Travel Assistant'}
                        </span>
                      </div>
                      <div className="text-xs sm:text-sm md:text-base whitespace-pre-wrap prose prose-invert max-w-none prose-p:my-1 prose-headings:my-2 prose-ul:my-1 prose-ol:my-1">
                        {message.role === 'assistant'
                          ? renderContent(message.content)
                          : message.content}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              <div ref={messagesEndRef} />
              
              {isLoading && (
                <div className="flex items-center justify-center py-1.5 sm:py-2">
                  <FaSpinner className="animate-spin text-[#9cadce] text-xs sm:text-sm" />
                  <span className="ml-2 text-[10px] sm:text-xs md:text-sm text-[#9cadce]">Thinking...</span>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="p-2.5 sm:p-3 md:p-4 border-t border-[#232323] bg-[#161616]">
              <div className="relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask a travel question..."
                  className="w-full pl-3 sm:pl-4 pr-10 sm:pr-12 py-2 sm:py-2.5 md:py-3 bg-[#232323] text-[#f8f8f8] rounded-lg border-none focus:ring-2 focus:ring-[#9cadce] transition-all placeholder-gray-500 text-xs sm:text-sm md:text-base"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="absolute right-1.5 sm:right-2 top-1/2 transform -translate-y-1/2 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 flex items-center justify-center rounded-full bg-[#9cadce] hover:bg-[#8b9dbd] text-black disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 
                    <FaSpinner className="animate-spin text-[10px] sm:text-xs md:text-sm" /> : 
                    <FaPaperPlane className="text-[10px] sm:text-xs md:text-sm" />
                  }
                </button>
              </div>
              <p className="mt-1.5 sm:mt-2 text-[8px] sm:text-[10px] md:text-xs text-[#9cadce] flex items-center">
                <FaInfoCircle className="mr-1 text-[8px] sm:text-[10px] md:text-xs" /> 
                Powered by Gemini AI - Ask about destinations, travel tips, or local customs
              </p>
            </form>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default TravelAssistant;