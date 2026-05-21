import Navbar from "~/components/Navbar";
import ResumeCard from "~/components/ResumeCard";
import { usePuterStore } from "~/lib/puter";
import { Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { 
  FileText, 
  LayoutDashboard, 
  Search,
  Plus,
  Loader2,
  Upload, 
  Cpu, 
  Target,
  Sparkles,
  ArrowRight,
  CheckCircle2
} from "lucide-react";

export function meta() {
  return [
    { title: "My Dashboard | CVPilot" },
    { name: "description", content: "Manage and view all your AI-optimized resumes." },
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

export default function Dashboard() {
    const { auth, kv } = usePuterStore();
    const navigate = useNavigate();
    const [resumes, setResumes] = useState<Resume[]>([]);
    const [loadingResumes, setLoadingResumes] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // Autentikasi Check
    useEffect(() => {
        if (!auth.isAuthenticated) navigate('/auth?next=/my-dashboard');
    }, [auth.isAuthenticated, navigate]);

    // Fetch Semua Resume
    useEffect(() => {
        const loadResumes = async () => {
            setLoadingResumes(true);
            try {
                const items = (await kv.list('resume:*', true)) as KVItem[];
                const parsedResumes = items?.map((item) => {
                    return JSON.parse(item.value) as Resume;
                });
                
                // Urutkan berdasarkan yang terbaru (asumsi id adalah timestamp atau kita balik urutannya)
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

    // Filter resume berdasarkan pencarian
    const filteredResumes = resumes.filter(resume => 
        (resume.companyName?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
        (resume.jobTitle?.toLowerCase() || "").includes(searchQuery.toLowerCase())
    );

    return (
        <main className="min-h-screen animate-page-transition relative overflow-hidden">
            {/* Efek Cahaya Latar Belakang (Ambient Glow) */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute top-20 right-1/4 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none"></div>

            <Navbar />
            
            <section className="main-section max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* ======================================================
                   HEADER DASHBOARD
                ====================================================== */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-10 mt-4 md:mt-2 relative z-10">
                    
                    {/* Bagian Kiri: Teks Header */}
                    <div className="flex flex-col gap-3">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-300 backdrop-blur-md w-fit">
                            <LayoutDashboard className="w-3.5 h-3.5" />
                            <span>Workspace</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
                            My <span className="text-glow-purple">Dashboard</span>
                        </h1>
                        <p className="text-gray-400 text-sm md:text-base max-w-lg">
                            Manage, track, and view all your AI resume analysis history in one place.
                        </p>
                    </div>

                    {/* Bagian Kanan: Search Bar & Action Button */}
                    <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto items-center">
                        
                        {/* Search Bar (Diperbaiki Layout & Icon-nya) */}
                        <div className="relative group w-full sm:w-72">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                                <Search className="h-4 w-4 text-gray-400 group-focus-within:text-indigo-400 transition-colors duration-300" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search company or job title..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                // !pl-12 digunakan untuk memaksa padding kiri agar icon tidak bertumpuk
                                className="block w-full !pl-11 pr-4 py-3 border border-white/10 rounded-xl leading-5 bg-[#0f0b24]/60 backdrop-blur-xl text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 sm:text-sm transition-all duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:bg-[#0f0b24]/80"
                            />
                        </div>

                        {/* Tombol Upload Tambahan agar UI lebih seimbang */}
                        <Link to="/upload" className="primary-button flex items-center justify-center gap-2 w-full sm:w-auto py-3">
                            <Plus className="w-4 h-4" />
                            <span>New Resume</span>
                        </Link>
                    </div>
                </div>

                {/* Garis Pemisah dengan Efek Glow */}
                <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent mb-10"></div>

                {/* ======================================================
                   KONTEN UTAMA (LIST RESUME)
                ====================================================== */}
                <div className="relative w-full z-10">

                    {/* Condition 1: Loading */}
                    {loadingResumes && (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <div className="relative w-16 h-16 flex items-center justify-center">
                                <div className="absolute inset-0 rounded-full border-t-2 border-indigo-500 animate-spin"></div>
                                <div
                                    className="absolute inset-2 rounded-full border-r-2 border-purple-500 animate-spin"
                                    style={{
                                        animationDirection: 'reverse',
                                        animationDuration: '1.5s'
                                    }}
                                ></div>

                                <Loader2 className="w-6 h-6 text-indigo-400 animate-pulse" />
                            </div>

                            <p className="text-sm text-gray-400 animate-pulse">
                                Fetching your resume data...
                            </p>
                        </div>
                    )}

                    {/* Condition 2: Empty State (No resumes uploaded yet) */}
                    {!loadingResumes && resumes.length === 0 && (
                        <div className="flex flex-col items-center justify-center text-center py-20 px-4 bg-[#0f0b24]/40 rounded-3xl border border-white/5 backdrop-blur-xl max-w-2xl mx-auto shadow-2xl relative overflow-hidden">

                            {/* Background Decoration */}
                            <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-indigo-500/10 blur-[50px]"></div>

                            <div className="w-20 h-20 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full flex items-center justify-center mb-6 border border-white/5 shadow-inner">
                                <FileText className="w-10 h-10 text-indigo-400" />
                            </div>

                            <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                                No resumes yet
                            </h3>

                            <p className="text-sm md:text-base text-gray-400 max-w-md mb-8">
                                Start optimizing your career opportunities today.
                                Upload your first resume and let our AI provide
                                deep analysis, ATS insights, and personalized improvements.
                            </p>

                            <div className="flex flex-wrap items-center gap-4 justify-center">
                                <Link to="/upload" className="primary-button flex items-center gap-2 px-8 py-3.5 text-base">
                                    <Upload className="w-5 h-5" />
                                    <span>Upload Resume Now</span>
                                    <ArrowRight className="w-4 h-4 ml-1" />
                                </Link>
                            </div>
                        </div>
                    )}

                    {/* Condition 3: No search results found */}
                    {!loadingResumes && resumes.length > 0 && filteredResumes.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-24 text-center bg-[#0f0b24]/20 rounded-3xl border border-white/5 backdrop-blur-sm">
                            <Search className="w-12 h-12 text-gray-600 mb-4" />
                            <p className="text-gray-400 text-lg">
                                No resumes matched your search for <span className="text-white font-medium">"{searchQuery}"</span>
                            </p>
                            <button
                                onClick={() => setSearchQuery("")}
                                className="mt-6 secondary-button text-sm font-medium transition-colors"
                            >
                                Clear Search
                            </button>
                        </div>
                    )}

                    {/* Condition 4: Display Resume List */}
                    {!loadingResumes && filteredResumes.length > 0 && (
                        <div className="resumes-section">
                            {filteredResumes.map((resume) => (
                                <ResumeCard
                                    key={resume.id}
                                    resume={resume}
                                    onDelete={handleDeleteResume}
                                />
                            ))}
                        </div>
                    )}

                </div>
            </section>
        </main>
    );
}