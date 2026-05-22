import { 
    Sparkles, 
    Upload, 
    User, 
    Cpu, 
    Database, 
    AlertCircle, 
    LogOut,
    ChevronDown,
    Menu, // Tambahan Icon
    X     // Tambahan Icon
} from "lucide-react";
import { Link } from "react-router";
import { usePuterStore } from "~/lib/puter";
import { useState, useEffect, useRef } from "react";

const Navbar = () => {
    const { auth, aiModel, setAiModel, kv } = usePuterStore();
    
    // 1. State Management yang baru
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [resumeCount, setResumeCount] = useState(0);
    const MAX_RESUMES = 10; 

    // 2. Ref untuk mendeteksi klik di luar modal profil
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

    // Logika Kuota (Tetap sama)
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

    return (
        <nav className="navbar flex items-center justify-between p-4 bg-[#060416] border-b border-white/5 relative z-[50]">
            {/* KIRI: LOGO & BRAND */}
            <Link to="/" className="flex items-center gap-3 group">
                <div className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-violet-500 shadow-md shadow-indigo-500/20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                    <Sparkles className="w-4 h-4 text-white group-hover:animate-spin duration-700" />
                </div>
                <div className="flex flex-col leading-none">
                    <h5 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
                        CV<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Pilot</span>
                    </h5>
                    <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.3em] text-gray-500 mt-1 hidden sm:inline">
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
            <div className="flex items-center gap-3 sm:gap-5">
                
                {auth.isAuthenticated ? (
                    <div className="relative" ref={profileRef}>
                        {/* 3. Profile Trigger (DIGANTI MENJADI ONCLICK) */}
                        <div 
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                            className="flex items-center gap-1.5 cursor-pointer bg-white/5 border border-white/10 p-1.5 sm:pl-2 sm:pr-2.5 sm:py-1.5 rounded-full hover:bg-white/10 transition-colors"
                        >
                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-inner">
                                <User className="w-4 h-4 text-white" />
                            </div>
                            <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                        </div>

                        {/* Dropdown Profil */}
                        {isProfileOpen && (
                            <div className="absolute right-0 top-full pt-3 z-[100]">
                                {/* 4. PERBAIKAN LEBAR UNTUK MOBILE (w-[280px]) */}
                                <div className="w-[280px] sm:w-80 bg-[#0f0b24]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl p-4 animate-in fade-in zoom-in-95 duration-200">
                                    
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

                                    {/* Bagian Kuota Berdasarkan Waktu */}
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
                                                    ? 'Limit upload tercapai. Kuota akan otomatis pulih seiring berjalannya waktu (2 jam setelah upload).' 
                                                    : 'Kamu memiliki batas 10 upload setiap 2 jam. Kuota akan otomatis pulih seiring waktu.'}
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
                                        onClick={() => auth.signOut()}
                                        className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold transition-colors"
                                    >
                                        <LogOut className="w-3.5 h-3.5" />
                                        Log Out
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <Link 
                        to="/auth" 
                        viewTransition
                        className="text-xs sm:text-sm font-semibold text-gray-400 hover:text-white transition-colors"
                    >
                        Log In
                    </Link>
                )}
                
                {/* Tombol Upload */}
                <Link 
                    to="/upload" 
                    viewTransition
                    className="primary-button flex items-center gap-2 text-xs sm:text-sm py-2 px-3.5 sm:px-5 sm:py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-full text-white font-medium shadow-md hover:shadow-indigo-500/30 transition-all shrink-0"
                >
                    <Upload className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Upload Resume</span>
                    <span className="sm:hidden">Upload</span>
                </Link>

                {/* 5. HAMBURGER MENU ICON UNTUK MOBILE */}
                <button 
                    className="md:hidden flex items-center p-1.5 text-gray-400 hover:text-white transition-colors"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* 6. MODAL DROPDOWN MOBILE MENU (HOME, DASHBOARD, DLL) */}
            {isMobileMenuOpen && (
                <div className="absolute top-full left-0 w-full bg-[#0f0b24]/95 backdrop-blur-2xl border-b border-white/10 p-5 flex flex-col gap-4 md:hidden z-[45] shadow-2xl animate-in slide-in-from-top-2">
                    <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-medium text-gray-300 hover:text-white">Home</Link>
                    <Link to="/how-its-works" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-medium text-gray-300 hover:text-white">How it Works</Link>
                    <Link to="/my-dashboard" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-medium text-gray-300 hover:text-white">My Dashboard</Link>
                </div>
            )}
        </nav>
    )
}

export default Navbar;