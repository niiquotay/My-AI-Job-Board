
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Sparkles, User, Lock, Crown, Zap, Loader2, ChevronRight, Cpu } from 'lucide-react';
import { UserProfile, Message, Job } from '../types';
import { getCareerAdvice } from '../services/geminiService';

interface CareerCoachProps {
  user: UserProfile;
  isSubscribed: boolean;
  onUpgrade: () => void;
  currentJob?: Job | null;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const CareerCoach: React.FC<CareerCoachProps> = ({ user, isSubscribed, onUpgrade, currentJob, isOpen, setIsOpen }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: `Greetings ${user.name.split(' ')[0]}. I've synchronized with your profile. Ready to optimize your trajectory.` }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || !isSubscribed) return;
    const userMsg: Message = { role: 'user', text: input };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);

    try {
      const stream = await getCareerAdvice(newMessages, user, currentJob || undefined);
      let fullText = '';
      setMessages(prev => [...prev, { role: 'model', text: '' }]);
      
      for await (const chunk of stream) {
        const chunkText = chunk.text || "";
        fullText += chunkText;
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1].text = fullText;
          return updated;
        });
      }
    } catch (err) {
      console.error("Coach Error:", err);
      setMessages(prev => [...prev, { role: 'model', text: "Synchronization interrupted. Please retry." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Subtle Dim Backdrop - No Blur */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/10 z-[200] animate-in fade-in duration-500"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Premium Glass Drawer - Width increased to 420px */}
      <div className={`fixed top-4 bottom-4 right-4 z-[210] w-full max-w-[420px] glass border border-white/10 rounded-[40px] shadow-[0_0_50px_rgba(0,0,0,0.5)] transition-all duration-700 cubic-bezier(0.16, 1, 0.3, 1) transform ${isOpen ? 'translate-x-0 opacity-100' : 'translate-x-[120%] opacity-0'}`}>
        <div className="h-full flex flex-col relative overflow-hidden rounded-[40px]">
          
          {/* Internal Glow Effect */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#41d599]/10 blur-[80px] pointer-events-none"></div>
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-[#F0C927]/10 blur-[80px] pointer-events-none"></div>

          {/* Header */}
          <div className="p-7 flex items-center justify-between border-b border-white/5 relative z-10">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#41d599] to-[#2ea38e] flex items-center justify-center shadow-lg shadow-[#41d599]/20">
                  <Cpu size={22} className="text-[#0a4179]" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#0a4179] rounded-full flex items-center justify-center border-2 border-[#1c3a5e]">
                  <div className="w-1.5 h-1.5 bg-[#41d599] rounded-full animate-pulse"></div>
                </div>
              </div>
              <div>
                <p className="text-xs font-black text-white uppercase tracking-[0.2em]">Neural Agent</p>
                <p className="text-[10px] text-white/40 font-bold uppercase">System v4.2 Active</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="p-2.5 rounded-2xl bg-white/5 text-white/20 hover:text-white hover:bg-white/10 transition-all border border-white/5"
            >
              <X size={18} />
            </button>
          </div>

          {/* Context Tab */}
          {currentJob && isSubscribed && (
            <div className="mx-6 mt-4 p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between animate-in slide-in-from-top-2 duration-500 relative z-10">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-8 h-8 rounded-lg bg-[#F0C927]/10 flex items-center justify-center text-[10px] font-black text-[#F0C927] shrink-0 border border-[#F0C927]/20">
                  {currentJob.company[0]}
                </div>
                <div className="truncate">
                  <p className="text-[8px] font-black uppercase text-[#F0C927]/60 tracking-widest">In-Focus Position</p>
                  <p className="text-[11px] font-bold text-white truncate">{currentJob.title}</p>
                </div>
              </div>
              <Zap size={14} className="text-[#F0C927] animate-pulse" />
            </div>
          )}

          {/* Chat Interface */}
          <div className="flex-1 flex flex-col overflow-hidden relative z-10">
            {!isSubscribed ? (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-12 text-center bg-[#0a4179]/60 backdrop-blur-md">
                <div className="w-20 h-20 rounded-[32px] bg-[#F0C927]/10 flex items-center justify-center text-[#F0C927] mb-8 border border-[#F0C927]/20 shadow-[0_0_30px_rgba(240,201,39,0.1)]">
                  <Lock size={32} />
                </div>
                <h3 className="text-xl font-black mb-3">Intelligence Locked</h3>
                <p className="text-xs text-white/50 leading-relaxed mb-10 max-w-[240px]">
                  Upgrade to Seeker Premium to unlock personalized strategic consultation.
                </p>
                <button 
                  onClick={onUpgrade}
                  className="w-full py-4 rounded-[20px] bg-[#F0C927] text-[#0a4179] font-black uppercase tracking-widest text-[10px] shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <Crown size={14} /> Get Premium $28/yr
                </button>
              </div>
            ) : null}

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[88%] p-4 rounded-[24px] text-sm shadow-xl leading-relaxed animate-in slide-in-from-bottom-2 ${
                    m.role === 'user' 
                      ? 'bg-[#1c7283] text-white rounded-tr-none border border-white/10' 
                      : 'bg-white/5 text-white/90 rounded-tl-none border border-white/5'
                  }`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white/5 p-4 rounded-2xl rounded-tl-none border border-white/5 flex gap-1.5">
                    <span className="w-1.5 h-1.5 bg-[#41d599] rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-[#41d599] rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 bg-[#41d599] rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Input Area */}
          <div className="p-7 border-t border-white/5 bg-white/5 backdrop-blur-md relative z-10">
            <div className="relative">
              <input 
                type="text"
                disabled={!isSubscribed}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={isSubscribed ? "Enter query..." : "Premium required..."}
                className="w-full bg-white/5 border border-white/10 rounded-[22px] py-4 pl-6 pr-14 text-sm text-white focus:outline-none focus:border-[#41d599] transition-all disabled:opacity-30"
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || !isSubscribed || isTyping}
                className="absolute right-2 top-2 p-2.5 bg-[#41d599] rounded-2xl text-[#0a4179] hover:brightness-110 active:scale-95 transition-all disabled:opacity-20 shadow-lg shadow-[#41d599]/20"
              >
                {isTyping ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
              </button>
            </div>
            <p className="text-[8px] text-center text-white/20 font-black uppercase tracking-[0.4em] mt-5">
              AI-JobConnect Neural Engine
            </p>
          </div>
        </div>
      </div>

      {/* Floating Spark Trigger */}
      {!isOpen && (
        <div className="fixed bottom-10 right-10 z-[190] animate-in zoom-in-75 duration-700">
          <button 
            onClick={() => setIsOpen(true)}
            className="w-16 h-16 bg-gradient-to-tr from-[#41d599] to-[#2ea38e] rounded-[26px] flex items-center justify-center shadow-[0_0_30px_rgba(65,213,153,0.3)] hover:scale-110 hover:-translate-y-2 active:scale-95 transition-all relative group border border-white/10"
          >
            <div className="absolute -top-1 -right-1">
               {!isSubscribed && (
                 <div className="p-1.5 bg-[#F0C927] rounded-xl shadow-lg border border-[#0a4179]/20">
                   <Lock size={10} className="text-[#0a4179]" />
                 </div>
               )}
            </div>
            <MessageSquare size={26} className="text-[#0a4179]" />
            <div className="absolute right-full mr-5 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all pointer-events-none translate-x-3 group-hover:translate-x-0">
              <div className="glass px-5 py-2.5 rounded-2xl border-white/10 whitespace-nowrap shadow-2xl">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#41d599]">Consult AI Agent</p>
              </div>
            </div>
          </button>
        </div>
      )}
    </>
  );
};

export default CareerCoach;
