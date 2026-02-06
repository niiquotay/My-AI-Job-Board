import React, { useEffect } from 'react';
import {
    BarChart3, TrendingUp, Sparkles, Target, Zap,
    ArrowLeft, Globe, Cpu, BookOpen, Clock,
    ShieldCheck, ArrowRight, Building2, Users,
    ChevronRight, Award, Briefcase, GraduationCap
} from 'lucide-react';
import { UserProfile } from '../types';

interface CareerInsightsProps {
    onBack: () => void;
    user: UserProfile;
}

const CareerInsights: React.FC<CareerInsightsProps> = ({ onBack, user }) => {
    useEffect(() => {
        // Basic SEO management
        document.title = "Career Insights & Market Data | CaliberDesk African Intelligence";
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.setAttribute("content", "Explore expert career advice, real-time African market trends, and comprehensive salary data. Your go-to resource for navigating the job market in Ghana and across the continent.");
        }
    }, []);

    const pillars = [
        {
            title: "Market Intelligence",
            desc: "Stay ahead with reports on hiring trends, salary benchmarks, and the fastest-growing sectors in Africa.",
            icon: BarChart3,
            color: "text-blue-400",
            bg: "bg-blue-400/10"
        },
        {
            title: "Career Strategy",
            desc: "Actionable advice on CV optimization, interview mastery, and navigating the 2026 digital landscape.",
            icon: Target,
            color: "text-[#41d599]",
            bg: "bg-[#41d599]/10"
        },
        {
            title: "Professional Growth",
            desc: "Curated guides on upskilling, certifications, and leadership development.",
            icon: GraduationCap,
            color: "text-purple-400",
            bg: "bg-purple-400/10"
        },
        {
            title: "Employer Resources",
            desc: "Data-backed insights to help hiring managers attract, retain, and manage top African talent.",
            icon: Building2,
            color: "text-[#F0C927]",
            bg: "bg-[#F0C927]/10"
        }
    ];

    const marketStats = [
        { label: "Engineering Demand", value: "+28%", trend: "up", region: "West Africa" },
        { label: "Avg. Tech Salary", value: "$42k", trend: "up", region: "Ghana/Nigeria" },
        { label: "Remote Adoption", value: "62%", trend: "up", region: "Continental" },
        { label: "Hiring Velocity", value: "14d", trend: "down", region: "FinTech" }
    ];

    const latestArticles = [
        {
            title: "The 2026 African Tech Manifest: Where the Capital is Flowing",
            category: "Market Intelligence",
            readTime: "8 min",
            author: "CaliberDesk Editorial",
            image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&q=80&w=800"
        },
        {
            title: "CV Synthesis: How to Beat the Next-Gen Neural ATS",
            category: "Career Strategy",
            readTime: "5 min",
            author: "Kwame Mensah, Lead Recruiter",
            image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&q=80&w=800"
        },
        {
            title: "Leadership in the Decentralized African Workspace",
            category: "Growth",
            readTime: "12 min",
            author: "Sarah Okafor, HR Strategist",
            image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=800"
        }
    ];

    return (
        <div className="min-h-screen bg-[#0a4179] text-white selection:bg-[#F0C927] selection:text-[#0a4179] relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-[120px] -mr-96 -mt-96 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[120px] -ml-48 -mb-48 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
                {/* Navigation */}
                <button
                    onClick={onBack}
                    className="flex items-center gap-3 text-white/40 hover:text-[#F0C927] transition-all group mb-16"
                >
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-[#F0C927]/30 transition-all">
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    </div>
                    <span className="text-xs font-black uppercase tracking-[0.3em]">Back to Ecosystem</span>
                </button>

                {/* Hero Section */}
                <div className="grid lg:grid-cols-2 gap-16 items-center mb-32">
                    <div className="space-y-8">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F0C927]/10 border border-[#F0C927]/20 text-[#F0C927]">
                            <Zap size={14} className="animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/80">Intelligence Manifest v4.2</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-[0.9]">
                            Career Insights & <br />
                            <span className="gradient-text">Market Data</span>
                        </h1>
                        <p className="text-lg md:text-xl text-white/50 leading-relaxed font-medium max-w-xl">
                            Empowering Africa’s workforce with data-driven career strategies. From deep dives into industry trends to practical job search tips, we provide the intelligence you need to lead, hire, and succeed in the modern African economy.
                        </p>
                        <div className="flex flex-wrap gap-4 pt-4">
                            <button className="px-8 py-4 rounded-2xl bg-[#F0C927] text-[#0a4179] font-black uppercase tracking-widest text-xs shadow-xl shadow-[#F0C927]/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-3">
                                Latest Reports <ChevronRight size={16} />
                            </button>
                            <div className="px-6 py-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
                                <Globe size={18} className="text-[#41d599]" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Ghana • Nigeria • Kenya • Global</span>
                            </div>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-tr from-[#0a4179] to-transparent z-10 rounded-[40px]"></div>
                        <img
                            src="https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&q=80&w=1200"
                            className="w-full h-[500px] object-cover rounded-[40px] shadow-2xl grayscale hover:grayscale-0 transition-all duration-1000"
                            alt="Professional Africa"
                        />
                        {/* Overlay Data Card */}
                        <div className="absolute -bottom-10 -left-10 glass p-8 rounded-[32px] border border-white/10 shadow-2xl z-20 animate-in slide-in-from-bottom-5 duration-700">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 rounded-2xl bg-[#41d599]/10 text-[#41d599] flex items-center justify-center border border-[#41d599]/20">
                                    <TrendingUp size={24} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Continental Growth Index</p>
                                    <p className="text-xl font-black">7.4% <span className="text-[#41d599] text-xs font-bold">+2.1% YoY</span></p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {[1, 2, 3, 4, 5].map(i => (
                                    <div key={i} className="w-6 bg-[#41d599]/20 rounded-t-sm" style={{ height: `${20 + i * 12}px` }}></div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Pillars Section */}
                <section className="mb-40">
                    <div className="text-center mb-20 space-y-4">
                        <h2 className="text-3xl font-black uppercase tracking-tight">Our <span className="text-[#F0C927]">Core Pillars</span></h2>
                        <p className="text-sm text-white/30 font-bold uppercase tracking-widest">Architecting Africa's Professional Future</p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {pillars.map((p, idx) => (
                            <div key={idx} className="glass p-8 rounded-[32px] border-white/5 hover:border-[#F0C927]/20 transition-all group relative overflow-hidden">
                                <div className={`w-14 h-14 rounded-2xl ${p.bg} ${p.color} flex items-center justify-center mb-8 border border-white/5 group-hover:scale-110 transition-transform duration-500`}>
                                    <p.icon size={28} />
                                </div>
                                <h3 className="text-xl font-black uppercase tracking-tight mb-4">{p.title}</h3>
                                <p className="text-sm text-white/50 leading-relaxed font-medium">
                                    {p.desc}
                                </p>
                                <div className="mt-8 pt-6 border-t border-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${p.color}`}>
                                        Explore Domain <ArrowRight size={12} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Real-time Intel Bar */}
                <section className="mb-40 glass rounded-[40px] p-12 border-white/5 bg-gradient-to-br from-[#06213f] to-transparent relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none"><Cpu size={180} /></div>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
                        <div>
                            <h3 className="text-2xl font-black uppercase tracking-tight mb-2">Market Intelligence <span className="text-[#41d599]">Ticker</span></h3>
                            <p className="text-[10px] text-white/30 font-black uppercase tracking-widest">Live Continental Telemetry • Federated Data</p>
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 flex-1">
                            {marketStats.map((stat, i) => (
                                <div key={i} className="space-y-1">
                                    <p className="text-[9px] font-bold text-white/20 uppercase tracking-[0.2em]">{stat.label}</p>
                                    <p className="text-2xl font-black flex items-center gap-2">
                                        {stat.value}
                                        <span className={stat.trend === 'up' ? 'text-[#41d599]' : 'text-[#F0C927]'}>
                                            {stat.trend === 'up' ? <TrendingUp size={14} /> : <TrendingUp size={14} className="rotate-180" />}
                                        </span>
                                    </p>
                                    <p className="text-[8px] font-black text-white/30 border-t border-white/5 pt-1 uppercase">{stat.region}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Insights Grid */}
                <section className="mb-40">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 px-2">
                        <div>
                            <h2 className="text-4xl font-black uppercase tracking-tighter">Latest <span className="gradient-text">Manifests</span></h2>
                            <p className="text-xs text-white/30 font-black uppercase tracking-widest mt-2">Strategic briefings for the African workforce</p>
                        </div>
                        <button className="text-xs font-black uppercase tracking-widest text-[#F0C927] flex items-center gap-2 hover:opacity-70 transition-all">
                            View All Content <ChevronRight size={14} />
                        </button>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-10">
                        {latestArticles.map((article, i) => (
                            <div key={i} className="group cursor-pointer">
                                <div className="relative overflow-hidden rounded-[32px] mb-8 shadow-2xl">
                                    <img
                                        src={article.image}
                                        className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                                        alt={article.title}
                                    />
                                    <div className="absolute top-4 left-4">
                                        <span className="px-4 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-[8px] font-black uppercase tracking-widest text-[#F0C927]">
                                            {article.category}
                                        </span>
                                    </div>
                                </div>
                                <div className="space-y-4 px-2">
                                    <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-widest text-white/30">
                                        <span className="flex items-center gap-1"><Clock size={12} /> {article.readTime} Read</span>
                                        <span className="flex items-center gap-1"><UserCircle size={12} className="shrink-0" /> {article.author}</span>
                                    </div>
                                    <h3 className="text-2xl font-black leading-tight group-hover:text-[#F0C927] transition-colors">
                                        {article.title}
                                    </h3>
                                    <button className="text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2 pt-2 text-[#41d599]">
                                        Sychronize Now <ArrowRight size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Newsletter / CTA */}
                <section className="mb-40 glass rounded-[60px] p-16 md:p-24 border-white/10 text-center relative overflow-hidden bg-gradient-to-tr from-[#0a4179] via-[#1c3e62] to-[#0a4179]">
                    <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:40px_40px] pointer-events-none"></div>
                    <div className="relative z-10 max-w-2xl mx-auto space-y-10">
                        <div className="w-20 h-20 rounded-[32px] bg-[#F0C927]/10 flex items-center justify-center text-[#F0C927] mx-auto border border-[#F0C927]/20 shadow-2xl mb-4">
                            <BookOpen size={40} />
                        </div>
                        <div className="space-y-4">
                            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">Join the <span className="text-[#F0C927]">Manifest</span></h2>
                            <p className="text-white/40 font-bold uppercase tracking-widest">The weekly brief for high-stakes professionals.</p>
                        </div>
                        <form className="flex flex-col md:flex-row gap-4">
                            <input
                                type="email"
                                placeholder="Enter official email"
                                className="flex-1 bg-black/20 border border-white/10 rounded-2xl px-8 py-5 outline-none focus:border-[#F0C927] transition-all font-bold text-center md:text-left shadow-inner"
                            />
                            <button className="px-10 py-5 rounded-2xl bg-[#F0C927] text-[#0a4179] font-black uppercase tracking-widest text-xs shadow-xl shadow-[#F0C927]/20 hover:scale-105 active:scale-95 transition-all">
                                Subscribe
                            </button>
                        </form>
                        <p className="text-[9px] font-black uppercase tracking-[0.5em] text-white/20 pt-10">
                            Where talent meets data. 🌍 Strategic career insights and market intelligence for professionals and employers across Ghana and Africa.
                        </p>
                    </div>
                </section>

                {/* Footer Wit Tagline */}
                <div className="text-center pb-20 border-t border-white/5 pt-20">
                    <p className="text-lg md:text-xl font-medium text-white/40 italic">
                        "Because 'following your passion' is easier when you <span className="text-[#F0C927]">have the data</span> to back it up."
                    </p>
                    <div className="flex items-center justify-center gap-4 mt-8 opacity-20">
                        <ShieldCheck size={16} />
                        <span className="text-[10px] font-black uppercase tracking-widest">CaliberDesk Precision Analytics</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const UserCircle = ({ size, className }: { size: number, className: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
);

export default CareerInsights;
