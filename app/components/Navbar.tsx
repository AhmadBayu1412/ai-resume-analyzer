import { Sparkles } from "lucide-react"
import { Link } from "react-router"
import { usePuterStore } from "~/lib/puter"

const Navbar = () => {
    // Panggil state auth dari puter
    const { auth } = usePuterStore()

    return (
        <nav className="navbar">
            <Link
            to="/"
            className="
                flex items-center gap-3
                group
            "
            >
            {/* ICON */}
            <div
                className="
                flex items-center justify-center
                w-10 h-10
                rounded-xl
                bg-gradient-to-br
                from-indigo-500
                via-purple-500
                to-violet-500
                shadow-md shadow-indigo-500/20
                group-hover:scale-105
                transition-all duration-300
                "
            >
                <Sparkles className="w-4 h-4 text-white" />
            </div>

            {/* BRAND */}
            <div className="flex flex-col leading-none">
                <h5
                className="
                    text-2xl
                    font-extrabold
                    tracking-tight
                    text-[#1E1B4B]
                "
                >
                CV<span className="text-gradient" >Pilot</span>
                </h5>

                <span
                className="
                    text-[9px]
                    uppercase
                    tracking-[0.3em]
                    text-gray-400
                    mt-1
                "
                >
                AI Resume Tool
                </span>
            </div>
            </Link>
            
            {/* KELOMPOK TOMBOL KANAN */}
            <div className="flex items-center gap-4 sm:gap-6">
                {/* Tampilkan tombol Log Out hanya jika user sudah login */}
                {auth.isAuthenticated && (
                    <button 
                        onClick={auth.signOut}
                        className="text-sm font-semibold text-gray-500 hover:text-red-500 transition-colors cursor-pointer"
                    >
                        Log Out
                    </button>
                )}
                
                <Link to="/upload" className="primary-button w-fit bg-gradient-to-br from-indigo-500 via-purple-500 to-violet-300 shadow-md shadow-indigo-500;">
                    Upload Resume
                </Link>
            </div>
        </nav>
    )
}
export default Navbar