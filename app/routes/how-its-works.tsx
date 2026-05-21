import Navbar from "~/components/Navbar";
import { Link } from "react-router";
import { 
  Upload, 
  Cpu, 
  Target,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  FileText
} from "lucide-react";
import type { Route } from "../+types/root";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "How It Works | CVPilot" },
    { name: "description", content: "Learn how CVPilot analyzes and optimizes your resume." },
  ];
}

export default function HowItWorks() {
    const steps = [
        {
            number: "01",
            title: "Upload Your Resume",
            description: "Simply upload your current resume in PDF format. Our system securely processes your document in seconds without storing sensitive raw data.",
            icon: <Upload className="w-6 h-6" />,
            color: "text-indigo-400",
            bgColor: "bg-indigo-500/20",
            borderColor: "border-indigo-500/30",
            glow: "bg-indigo-500/20",
            features: ["Supports PDF formats", "100% secure & private", "Instant processing"]
        },
        {
            number: "02",
            title: "AI ATS Analysis",
            description: "Our advanced AI engine scans your resume against industry-standard Applicant Tracking Systems (ATS) to identify missing keywords and formatting issues.",
            icon: <Cpu className="w-6 h-6" />,
            color: "text-purple-400",
            bgColor: "bg-purple-500/20",
            borderColor: "border-purple-500/30",
            glow: "bg-purple-500/20",
            features: ["Deep keyword matching", "Readability scoring", "Formatting checks"]
        },
        {
            number: "03",
            title: "Get Hired Faster",
            description: "Receive a detailed breakdown of your score, actionable insights, and tailored recommendations to make your resume stand out to top recruiters.",
            icon: <Target className="w-6 h-6" />,
            color: "text-pink-400",
            bgColor: "bg-pink-500/20",
            borderColor: "border-pink-500/30",
            glow: "bg-pink-500/20",
            features: ["Actionable feedback", "Score improvements", "Higher match rates"]
        }
    ];

    return (
        <main className="min-h-screen animate-page-transition"> 
            <Navbar />
            
            <section className="main-section max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                {/* ======================================================
                   HEADER SECTION
                ====================================================== */}
                <div className="flex flex-col items-center text-center gap-6 mt-2 md:mt-2 mb-20">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-semibold text-purple-300 backdrop-blur-md">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Simple, Fast, & Effective</span>
                    </div>

                    <h1 className="max-w-4xl">
                        How <span className="text-glow-purple">CVPilot</span> Works
                    </h1>
                    
                    <p className="text-base sm:text-lg text-gray-400 max-w-2xl leading-relaxed">
                        Transform your standard resume into an ATS-optimized powerhouse in just three simple steps. Let AI do the heavy lifting so you can focus on the interview.
                    </p>
                </div>

                {/* ======================================================
                   STEPS GRID SECTION
                ====================================================== */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10 w-full max-w-6xl mx-auto">
                    {/* Garis penghubung di belakang card (Hanya muncul di Desktop) */}
                    <div className="hidden md:block absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500/30 to-transparent -translate-y-1/2 -z-10"></div>

                    {steps.map((step, index) => (
                        <div 
                            key={index} 
                            className="relative flex flex-col p-8 rounded-[24px] bg-[#0f0b24]/80 backdrop-blur-xl border border-white/10 shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden group"
                        >
                            {/* Efek Glow Sudut Card */}
                            <div className={`absolute -top-24 -right-24 w-48 h-48 rounded-full blur-[60px] transition-colors duration-500 ${step.glow} group-hover:opacity-100 opacity-50`}></div>
                            
                            {/* Nomor Transparan di Latar */}
                            <div className="absolute top-4 right-6 text-7xl font-black text-white/5 select-none transition-transform duration-500 group-hover:scale-110 group-hover:text-white/10">
                                {step.number}
                            </div>

                            {/* Ikon */}
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 border ${step.bgColor} ${step.borderColor} ${step.color} shadow-lg relative z-10`}>
                                {step.icon}
                            </div>

                            {/* Konten Teks */}
                            <h3 className="text-xl font-bold text-white mb-4 relative z-10">
                                {step.title}
                            </h3>
                            <p className="text-sm text-gray-400 leading-relaxed mb-8 relative z-10 min-h-[80px]">
                                {step.description}
                            </p>

                            {/* Fitur List */}
                            <div className="flex flex-col gap-3 mt-auto relative z-10">
                                {step.features.map((feature, fIndex) => (
                                    <div key={fIndex} className="flex items-center gap-2 text-xs text-gray-300">
                                        <CheckCircle2 className={`w-4 h-4 ${step.color}`} />
                                        <span>{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* ======================================================
                   CALL TO ACTION (CTA) SECTION
                ====================================================== */}
                <div className="mt-24 mb-12 relative w-full max-w-4xl mx-auto rounded-[32px] p-8 md:p-12 overflow-hidden border border-indigo-500/20 bg-gradient-to-b from-indigo-900/20 to-[#060416]">
                    {/* CTA Background Effects */}
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-overlay"></div>
                    <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[600px] h-[300px] bg-purple-600/20 blur-[100px] rounded-full pointer-events-none"></div>

                    <div className="relative z-10 flex flex-col items-center text-center gap-6">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-[0_0_40px_rgba(139,92,246,0.4)] mb-2">
                            <FileText className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-white">
                            Ready to land your dream job?
                        </h2>
                        <p className="text-gray-400 max-w-lg mb-4">
                            Join thousands of professionals who have already upgraded their resumes using CVPilot's AI insights.
                        </p>
                        
                        <div className="flex flex-wrap items-center gap-4 justify-center">
                            <Link to="/upload" viewTransition className="primary-button flex items-center gap-2 px-8 py-3.5 text-base">
                                <Upload className="w-5 h-5" />
                                <span>Upload Resume Now</span>
                                <ArrowRight className="w-4 h-4 ml-1" />
                            </Link>
                        </div>
                        <span className="text-xs text-gray-500 mt-2 font-medium tracking-wide">
                            No credit card required. Free initial scan.
                        </span>
                    </div>
                </div>
            </section>
        </main>
    );
}