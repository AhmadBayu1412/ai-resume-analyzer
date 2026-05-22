import { 
    Sparkles, 
    Upload, 
    User, 
    Cpu, 
    Database, 
    AlertCircle, 
    LogOut,
    ChevronDown,
    Menu, 
    X     
} from "lucide-react";
import { Link } from "react-router";
import { usePuterStore } from "~/lib/puter";
import { useState, useEffect, useRef } from "react";

const Navbar = () => {
    const { auth, aiModel, setAiModel, kv } = usePuterStore();
    
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [resumeCount, setResumeCount] = useState(0);
    const MAX_RESUMES = 10; 

    const profileRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (auth.isAuthenticated) {
            kv.list('resume:*').then((keys: any) => {
                const now = Date.now();
                const TWO_HOURS_MS = 2 * 60 * 60 * 1000;
                
                let recentUploads = 0;
                
                keys?.forEach((key: string) => {
                    const idStr = key.replace('resume:', '');
                    const timestamp = parseInt(idStr);
                    
                    if (!isNaN(timestamp) && timestamp > 1000000000000) {
                        if (now - timestamp <= TWO_HOURS_MS) {
                            recentUploads++; 
                        }
                    } else {
                        recentUploads++;
                    }
                });
                
                setResumeCount(recentUploads);
            }).catch(err => console.error(err));
        }
    }, [auth.isAuthenticated, kv]);

    const usagePercentage = Math.min((resumeCount / MAX_RESUMES) * 100, 100);
    const isLimitReached = usagePercentage >= 100;

    // 1. KONTEN PROFIL DIEKSTRAK AGAR BISA DIPAKAI DI DESKTOP & MOBILE
    const renderProfileContent = () => (
        <div className="flex flex-col w-full text-left">
            {/* Info User */}
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/10">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shrink-0">
                    <User className="w-5 h-5 text-white" />
                </div>
                <div className="flex flex-col overflow-hidden w-full">
                    <span className="text-sm font-bold text-white truncate" title={auth.user?.username}>
                        {auth.user?.username || 'Guest'}
                    </span>
                    <span className="text-xs text-gray-400 truncate" title={auth.user?.email || 'Puter Guest Account'}>
                        {auth.user?.email ? auth.user.email : 'Puter Guest Account'}
                    </span>
                </div>
            </div>

            {/* Bagian Kuota */}
            <div className="mb-4">
                <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-400 flex items-center gap-1.5">
                        <Database className="w-3.5 h-3.5"/> 
                        Uploads (Last 2 Hours)
                    </span>
                    <span className={`text-xs font-medium ${isLimitReached ? 'text-red-400' : 'text-amber-400'}`}>
                        {resumeCount} / {MAX_RESUMES}
                    </span>
                </div>
                
                <div className="w-full bg-white/5 rounded-full h-1.5 mb-2 overflow-hidden">
                    <div 
                        className={`h-full rounded-full transition-all duration-500 ${isLimitReached ? 'bg-red-500' : 'bg-gradient-to-r from-amber-400 to-orange-500'}`} 
                        style={{ width: `${usagePercentage}%` }}
                    ></div>
                </div>
                
                <div className={`border rounded-lg p-2.5 flex items-start gap-2 ${isLimitReached ? 'bg-red-500/10 border-red-500/20' : 'bg-amber-500/10 border-amber-500/20'}`}>
                    <AlertCircle className={`w-4 h-4 shrink-0 mt-0.5 ${isLimitReached ? 'text-red-400' : 'text-amber-400'}`} />
                    <p className={`text-[10px] leading-relaxed ${isLimitReached ? 'text-red-200/90' : 'text-amber-200/80'}`}>
                        {isLimitReached 
                            ? 'Limit upload tercapai. Kuota pulih otomatis (2 jam setelah upload).' 
                            : 'Batas 10 upload tiap 2 jam. Kuota pulih otomatis seiring waktu.'}
                    </p>
                </div>
            </div>

            {/* Pengaturan Model AI */}
            <div className="mb-4 pb-4 border-b border-white/10">
                <label className="text-xs text-gray-400 flex items-center gap-1.5 mb-2">
                    <Cpu className="w-3.5 h-3.5" /> Engine Model AI
                </label>
                <select 
                    value={aiModel}
                    onChange={(e) => setAiModel(e.target.value)}
                    className="w-full bg-[#060416] border border-white/10 rounded-lg px-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-indigo-500 cursor-pointer appearance-none"
                >
                    <option value="puter">Puter AI (Fast)</option>
                </select>
            </div>

            {/* Tombol Log Out */}
            <button 
                onClick={() => {
                    auth.signOut();
                    setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold transition-colors"
            >
                <LogOut className="w-3.5 h-3.5" />
                Log Out
            </button>
        </div>
    );

    return (
        <nav className="navbar flex items-center justify-between p-3 sm:p-4 bg-[#060416] border-b border-white/5 relative z-[50]">
            {/* KIRI: LOGO & BRAND */}
            <Link to="/" className="flex items-center gap-2 sm:gap-3 group shrink-0">
                <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-violet-500 shadow-md shadow-indigo-500/20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                    <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white group-hover:animate-spin duration-700" />
                </div>
                <div className="flex flex-col leading-none">
                    <h5 className="text-lg sm:text-2xl font-extrabold tracking-tight text-white">
                        CV<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Pilot</span>
                    </h5>
                    <span className="text-[7px] sm:text-[9px] uppercase tracking-[0.3em] text-gray-500 mt-1 hidden sm:inline">
                        AI Resume Tool
                    </span>
                </div>
            </Link>
            
            {/* TENGAH: LINK NAVIGASI (HANYA DESKTOP) */}
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400 absolute left-1/2 -translate-x-1/2">
                <Link to="/" className="hover:text-white transition-colors duration-200">Home</Link>
                <Link to="/how-its-works" className="hover:text-white transition-colors duration-200">How it Works</Link>
                <Link to="/my-dashboard" className="hover:text-white transition-colors duration-200">My Dashboard</Link>
            </div>
            
            {/* KANAN: KELOMPOK TOMBOL AKSI & AUTH */}
            <div className="flex items-center gap-2 sm:gap-5">
                
                {auth.isAuthenticated ? (
                    // 2. SEMBUNYIKAN PROFIL DI MOBILE (hidden md:block)
                    <div className="relative hidden md:block" ref={profileRef}>
                        <div 
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                            className="flex items-center gap-1.5 cursor-pointer bg-white/5 border border-white/10 p-1.5 sm:pl-2 sm:pr-2.5 sm:py-1.5 rounded-full hover:bg-white/10 transition-colors"
                        >
                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-inner">
                                <User className="w-4 h-4 text-white" />
                            </div>
                            <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                        </div>

                        {/* Dropdown Profil Desktop */}
                        {isProfileOpen && (
                            <div className="absolute right-0 top-full pt-3 z-[100]">
                                <div className="w-80 bg-[#0f0b24]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl p-4 animate-in fade-in zoom-in-95 duration-200">
                                    {renderProfileContent()}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    // 3. SEMBUNYIKAN LOGIN TEXT DI MOBILE
                    <Link 
                        to="/auth" 
                        viewTransition
                        className="hidden md:block text-sm font-semibold text-gray-400 hover:text-white transition-colors"
                    >
                        Log In
                    </Link>
                )}
                
                {/* 4. TOMBOL UPLOAD DIPERKECIL UNTUK MOBILE */}
                <Link 
                    to="/upload" 
                    viewTransition
                    className="primary-button flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-sm py-1.5 px-2.5 sm:px-5 sm:py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-full text-white font-medium shadow-md hover:shadow-indigo-500/30 transition-all shrink-0"
                >
                    <Upload className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Upload Resume</span>
                    <span className="inline sm:hidden">Upload</span>
                </Link>

                {/* HAMBURGER MENU ICON UNTUK MOBILE */}
                <button 
                    className="md:hidden flex items-center p-1 text-gray-400 hover:text-white transition-colors shrink-0"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* 5. MODAL DROPDOWN MOBILE MENU (FULL WIDTH) */}
            {isMobileMenuOpen && (
                <div className="absolute top-full left-0 w-full bg-[#0f0b24]/98 backdrop-blur-3xl border-b border-white/10 p-5 flex flex-col gap-4 md:hidden z-[100] shadow-2xl animate-in slide-in-from-top-2">
                    {/* Link Navigasi Dasar */}
                    <div className="flex flex-col gap-4 pb-4 border-b border-white/10">
                        <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-medium text-gray-300 hover:text-white">Home</Link>
                        <Link to="/how-its-works" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-medium text-gray-300 hover:text-white">How it Works</Link>
                        <Link to="/my-dashboard" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-medium text-gray-300 hover:text-white">My Dashboard</Link>
                    </div>

                    {/* Jika Auth: Tampilkan Profil, Jika Tidak: Tampilkan Login */}
                    {auth.isAuthenticated ? (
                        <div className="pt-2">
                            <span className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold mb-4 block">Account & Settings</span>
                            {renderProfileContent()}
                        </div>
                    ) : (
                        <Link 
                            to="/auth" 
                            onClick={() => setIsMobileMenuOpen(false)} 
                            className="text-sm font-semibold text-indigo-400 hover:text-indigo-300 py-2"
                        >
                            Log In to Your Account
                        </Link>
                    )}
                </div>
            )}
        </nav>
    )
}

export default Navbar;