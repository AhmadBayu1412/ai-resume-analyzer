import { useEffect } from "react"
import { useLocation, useNavigate } from "react-router"
import { usePuterStore } from "~/lib/puter"
import { Loader2, Sparkles } from "lucide-react"

export const meta = () => [
    {title: 'CVPilot | Auth'},
    {name: 'description', content: 'Log into your account'}
]

const Auth = () => {
    const {isLoading, auth} = usePuterStore()
    const location = useLocation()
    // Tambahkan fallback '/' agar tidak error jika parameter next kosong
    const next = location.search.split('next=')[1] || '/'
    const navigate = useNavigate()

    useEffect(() => {
        if(auth.isAuthenticated) navigate(next)
    }, [auth.isAuthenticated, next, navigate])

    return (
        <main className="bg-[#060416] bg-[url('/images/bg-auth.svg')] bg-cover bg-center min-h-screen flex items-center justify-center p-4 animate-page-transition">
            <div className="relative w-full max-w-md">
                {/* Efek Glow di belakang card */}
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-[2rem] blur opacity-30"></div>
                
                <section className="relative flex flex-col gap-8 bg-[#0f0b24]/90 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 sm:p-10 shadow-2xl">
                    
                    {/* Header Bagian Login */}
                    <div className="flex flex-col items-center gap-3 text-center">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 p-[2px] mb-2 shadow-lg shadow-purple-500/20">
                             <div className="w-full h-full rounded-2xl bg-[#060416] flex items-center justify-center">
                                 <Sparkles className="w-6 h-6 text-white" />
                             </div>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Welcome to CVPilot</h1>
                        <h2 className="text-sm text-gray-400">Log In to Continue Your Job Journey</h2>
                    </div>
                    
                    {/* Tombol Aksi */}
                    <div className="flex flex-col w-full">
                        {isLoading ? (
                            <button className="w-full flex justify-center items-center gap-2 py-3.5 rounded-xl bg-indigo-500/20 text-indigo-400 cursor-not-allowed border border-indigo-500/30">
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span className="font-semibold">Signing you in ...</span>
                            </button>
                        ) : (
                            <>
                            {auth.isAuthenticated ? (
                                <button 
                                    className="w-full py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold transition-colors border border-white/10" 
                                    onClick={auth.signOut}
                                >
                                    Log Out
                                </button>
                            ) : (
                                <button 
                                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-white font-semibold shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all" 
                                    onClick={auth.signIn}
                                >
                                    Log In / Sign Up
                                </button>
                            )}
                            </>
                        )}
                    </div>
                </section>
            </div>
        </main>
    )
}

export default Auth