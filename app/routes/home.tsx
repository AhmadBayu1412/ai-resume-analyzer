import Navbar from "~/components/Navbar";
import type { Route } from "./+types/home";
import ResumeCard from "~/components/ResumeCard";
import { usePuterStore } from "~/lib/puter";
import { Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";

import { 
  Upload, 
  LayoutDashboard, 
  Star, 
  FileText, 
  Gauge, 
  Eye, 
  Cpu, 
  Layers 
} from "lucide-react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "CVPilot - AI Resume Dashboard" },
    { name: "description", content: "Smart feedback for your dream job!" },
  ];
}

interface Resume {
  id: string;
  companyName?: string;
  jobTitle?: string;
  feedback: {
    overallScore: number;
  };
  imagePath: string;
}

interface KVItem {
  key: string;
  value: string;
}

export default function Home() { 
    const { auth, kv } = usePuterStore();
    const navigate = useNavigate();
    const [resumes, setResumes] = useState<Resume[]>([]);
    const [loadingResumes, setLoadingResumes] = useState(false);


    useEffect(() => {
        if (!auth.isAuthenticated) navigate('/auth?next=/');
    }, [auth.isAuthenticated, navigate]);

    useEffect(() => {
        const loadResumes = async () => {
            setLoadingResumes(true);
            try {
                const items = (await kv.list('resume:*', true)) as KVItem[];
                const parsedResumes = items?.map((item) => {
                    return JSON.parse(item.value) as Resume;
                });
                // UBAH BARIS INI: Tambahkan .reverse() agar yang terbaru di awal
                setResumes(parsedResumes?.reverse() || []);
            } catch (err) {
                console.error("Gagal memuat resume:", err);
            } finally {
                setLoadingResumes(false);
            }
        };
        loadResumes();
    }, [kv]);

    const handleDeleteResume = (id: string) => {
        setResumes(prev => prev.filter(resume => resume.id !== id));
    };

    const [isFirstVisit] = useState(() => {
        // Cek apakah kode sedang berjalan di Browser (bukan di Server)
        if (typeof window !== 'undefined') {
            const visited = sessionStorage.getItem('hasVisitedHome');
            if (!visited) {
                sessionStorage.setItem('hasVisitedHome', 'true');
                return true; // Kunjungan pertama
            }
            return false; // Kunjungan kedua dan seterusnya
        }
        // Default saat dirender di server (agar tidak error)
        return true; 
    });

    return (
        <main className={`min-h-screen ${isFirstVisit ? 'animate-page-transition-slow' : 'animate-page-transition'}`}> 
            <Navbar />
            
            <section className="main-section max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                {/* ======================================================
                   HERO SECTION (SPLIT LAYOUT: KIRI & KANAN)
                ====================================================== */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full pt-3 pb-12 md:pt-0 md:pb-16">
                    
                    {/* SISI KIRI: Headline, Deskripsi, Tombol & Rating */}
                    <div className="lg:col-span-7 flex flex-col gap-6 items-start text-left max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-300 backdrop-blur-md">
                            <Cpu className="w-3.5 h-3.5 animate-pulse" />
                            <span>AI-Powered. ATS-Optimized. Job-Ready.</span>
                        </div>

                        <h1>
                            Get Hired Faster with an <br />
                            <span className="text-glow-purple">AI-Optimized</span> Resume
                        </h1>
                        
                        <p className="text-base sm:text-lg text-gray-400 leading-relaxed">
                            Instant ATS analysis, powerful resume insights, and smart application tracking — all in one beautiful dashboard.
                        </p>

                        {/* Kelompok Tombol Aksi */}
                        <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
                            <Link to="/upload" className="primary-button flex items-center gap-2 justify-center w-full sm:w-auto">
                                <Upload className="w-4 h-4" />
                                <span>Upload Resume</span>
                            </Link>
                            <a href="#dashboard-resumes" className="secondary-button flex items-center gap-2 justify-center w-full sm:w-auto">
                                <LayoutDashboard className="w-4 h-4 text-gray-400" />
                                <span>See My Dashboard</span>
                            </a>
                        </div>

                        {/* Rating Pengguna */}
                        <div className="flex flex-wrap items-center gap-4 pt-2">
                            <div className="flex -space-x-2">
                                <img className="w-8 h-8 rounded-full border-2 border-[#060416]" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces" alt="User 1" />
                                <img className="w-8 h-8 rounded-full border-2 border-[#060416]" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces" alt="User 2" />
                                <img className="w-8 h-8 rounded-full border-2 border-[#060416]" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces" alt="User 3" />
                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 border-2 border-[#060416] text-[10px] font-bold text-white">+2K</div>
                            </div>
                            <div className="flex flex-col gap-0.5">
                                <div className="flex items-center gap-1 text-amber-400">
                                    {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                                </div>
                                <span className="text-xs text-gray-400 font-medium">4.9/5 from 1,200+ users</span>
                            </div>
                        </div>
                    </div>

                    {/* SISI KANAN: AI Glowing Orb & Floating Metrics Mockup */}
                    <div className="lg:col-span-5 relative w-full h-[420px] flex items-center justify-center mt-8 lg:mt-0 select-none">
                        {/* Lingkaran Energi Ungu (Glow Efek) */}
                        <div className="absolute w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-purple-600/20 blur-[80px] animate-pulse"></div>
                        <div className="absolute w-48 h-48 sm:w-60 sm:h-60 rounded-full bg-indigo-500/10 blur-[50px]"></div>

                        {/* Central Glowing Ring & Icon */}
                        {/* 1. Ganti 'animate-idle' dengan 'animate-float' untuk efek naik-turun */}
                        <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-full p-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-[0_0_60px_rgba(139,92,246,0.4)] flex items-center justify-center animate-float">
                            <div className="w-full h-full rounded-full bg-[#0d0a21] flex items-center justify-center p-4 relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-b from-purple-500/10 to-transparent"></div>
                                
                                {/* 2. Tambahkan 'animate-glow-pulse' ke lingkaran putih dokumen ini */}
                                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white flex items-center justify-center shadow-2xl relative z-10 animate-glow-pulse">
                                    <FileText className="w-12 h-12 sm:w-14 sm:h-14 text-purple-600" />
                                </div>
                            </div>
                        </div>

                        {/* Floating Card 1: ATS Score (Kiri Atas) */}
                        <div className="absolute top-2 left-2 sm:left-6 bg-[#0f0b24]/80 backdrop-blur-xl border border-white/10 p-3 sm:p-4 rounded-2xl w-32 sm:w-36 shadow-xl shadow-black/40 hover:scale-105 transition-transform duration-300">
                            <div className="flex items-center gap-1.5 text-purple-400 text-[11px] font-medium mb-1">
                                <Gauge className="w-3.5 h-3.5" />
                                <span>ATS Score</span>
                            </div>
                            <div className="text-lg sm:text-2xl font-bold text-white tracking-tight">87/100</div>
                            <div className="text-[10px] text-emerald-400 font-semibold mt-0.5">Excellent</div>
                        </div>

                        {/* Floating Card 2: Keyword Match (Kanan Atas) */}
                        <div className="absolute top-8 right-2 sm:right-6 bg-[#0f0b24]/80 backdrop-blur-xl border border-white/10 p-3 sm:p-4 rounded-2xl w-32 sm:w-36 shadow-xl shadow-black/40 hover:scale-105 transition-transform duration-300">
                            <div className="flex items-center gap-1.5 text-indigo-400 text-[11px] font-medium mb-1">
                                <Layers className="w-3.5 h-3.5" />
                                <span>Keyword Match</span>
                            </div>
                            <div className="text-lg sm:text-2xl font-bold text-white tracking-tight">92%</div>
                            <div className="text-[10px] text-emerald-400 font-semibold mt-0.5">Great match</div>
                        </div>

                        {/* Floating Card 3: Readability (Kiri Bawah) */}
                        <div className="absolute bottom-8 left-0 sm:left-4 bg-[#0f0b24]/80 backdrop-blur-xl border border-white/10 p-3 sm:p-4 rounded-2xl w-32 sm:w-36 shadow-xl shadow-black/40 hover:scale-105 transition-transform duration-300">
                            <div className="flex items-center gap-1.5 text-emerald-400 text-[11px] font-medium mb-1">
                                <Eye className="w-3.5 h-3.5" />
                                <span>Readability</span>
                            </div>
                            <div className="text-lg sm:text-2xl font-bold text-white tracking-tight">Good</div>
                            <div className="text-[10px] text-gray-400 font-medium mt-0.5">Easy to read</div>
                        </div>

                        {/* Floating Card 4: Job Match (Kanan Bawah) */}
                        <div className="absolute bottom-12 right-0 sm:right-4 bg-[#0f0b24]/80 backdrop-blur-xl border border-white/10 p-3 sm:p-4 rounded-2xl w-32 sm:w-36 shadow-xl shadow-black/40 hover:scale-105 transition-transform duration-300">
                            <div className="flex items-center gap-1.5 text-pink-400 text-[11px] font-medium mb-1">
                                <LayoutDashboard className="w-3.5 h-3.5" />
                                <span>Job Match</span>
                            </div>
                            <div className="text-lg sm:text-2xl font-bold text-white tracking-tight">High</div>
                            <div className="text-[10px] text-pink-400 font-semibold mt-0.5">Top 20%</div>
                        </div>
                    </div>
                </div>

                {/* ======================================================
                   COMPANY LOGOS (TRUSTED BY BANNER)
                ====================================================== */}
                <div className="w-full flex flex-col items-center gap-6 py-10 border-t border-b border-white/5 my-6">
                    <span className="text-[10px] sm:text-xs font-bold tracking-[0.25em] text-gray-500 uppercase">
                        Trusted by Professionals at Top Companies
                    </span>
                    <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 opacity-30 grayscale hover:opacity-50 transition-opacity duration-300 text-sm sm:text-base font-extrabold tracking-wider text-white">
                        <span>Shopee</span>
                        <span>tokopedia</span>
                        <span>BCA</span>
                        <span>traveloka</span>
                        <span>Bukalapak</span>
                        <span>blibli</span>
                    </div>
                </div>

                {/* ======================================================
                   DASHBOARD / RESUMES DISPLAY SECTION
                ====================================================== */}
                <div id="dashboard-resumes" className="w-full pt-12 pb-6">
                    <div className="flex items-center justify-between mb-8 w-full">
                        <div className="flex flex-col gap-1">
                            <h2 className="text-xl sm:text-2xl font-bold">Your Dashboard</h2>
                            <p className="text-xs sm:text-sm text-gray-400">Manage and view your optimized resumes</p>
                        </div>
                        
                        {/* Tombol View All: Saya tambahkan jumlah total agar informatif */}
                        {resumes.length > 0 && (
                            <Link to="/my-dashboard" className="text-xs sm:text-sm font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                                <span>View All {resumes.length > 6 ? `(${resumes.length})` : ''}</span>
                                <span>&rarr;</span>
                            </Link>
                        )}
                    </div>

                    {loadingResumes && (
                        <div className="flex flex-col items-center justify-center py-12">
                            <img src="/images/resume-scan-2.gif" className="w-[150px] opacity-80 mix-blend-screen" alt="Scanning..." />
                            <p className="text-sm text-gray-500 animate-pulse mt-2">Analyzing data...</p>
                        </div>
                    )}

                    {!loadingResumes && resumes.length === 0 ? (
                        <div className="flex flex-col items-center justify-center text-center py-16 px-4 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-md max-w-xl mx-auto gap-4">
                            <FileText className="w-12 h-12 text-gray-600" />
                            <h3 className="text-base sm:text-lg font-semibold">No resumes found</h3>
                            <p className="text-xs sm:text-sm text-gray-400 max-w-xs">
                                Upload your first resume to see comprehensive ATS insights and scores instantly.
                            </p>
                            <Link to="/upload" className="primary-button text-sm px-5 py-2.5 mt-2">
                                Upload Resume
                            </Link>
                        </div>
                    ) : (
                        <div className="resumes-section">
                            {/* UBAH BARIS INI: Tambahkan .slice(0, 6) sebelum di-map */}
                            {resumes.slice(0, 6).map((resume) => (
                                <ResumeCard key={resume.id} resume={resume} onDelete={handleDeleteResume} />
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}