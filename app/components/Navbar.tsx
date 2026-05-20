// Nama komponen 'Navbar' dengan isi function
// ( : ) berarti mau memberi tipe data

import { Sparkles } from "lucide-react"
import { Link } from "react-router"

// Navbar adalah function yang mengembalikan tipe data JSXElement/ReactElement/React.createElement("div", null, "Navbar")
const Navbar = () => {
    return (
        // kode dibawah ini merupakan jsx.element dan bukan dom html asli
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
            <Link to="/upload" className="primary-button w-fit bg-gradient-to-br from-indigo-500 via-purple-500 to-violet-300 shadow-md shadow-indigo-500;">Upload Resume</Link>
        </nav>
    )
}
export default Navbar