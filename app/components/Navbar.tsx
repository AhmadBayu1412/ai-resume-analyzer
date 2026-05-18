// Nama komponen 'Navbar' dengan isi function
// ( : ) berarti mau memberi tipe data

import { Link } from "react-router"

// Navbar adalah function yang mengembalikan tipe data JSXElement/ReactElement/React.createElement("div", null, "Navbar")
const Navbar = () => {
    return (
        // kode dibawah ini merupakan jsx.element dan bukan dom html asli
        <nav className="navbar">
            <Link to="/">
                <p className="text-2xl font-bold text-gradient">RESUMIND</p>
            </Link>
            <Link to="/upload" className="primary-button w-fit">Upload Resume</Link>
        </nav>
    )
}
export default Navbar