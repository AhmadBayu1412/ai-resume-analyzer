import { Link } from "react-router"
import ScoreCircle from "./ScoreCircle"
import { usePuterStore } from "~/lib/puter"
import { useEffect, useState } from "react"


const ResumeCard = ({resume: {id, companyName, jobTitle, feedback, imagePath}, onDelete}: {resume:any, onDelete?: (id: string) => void}) => {
    const {fs, kv} = usePuterStore()
    const [resumeUrl, setResumeUrl] = useState('')
    const [isDeleting, setIsDeleting] = useState(false)

    useEffect(() => {
        const loadResume = async () => {
            const blob = await fs.read(imagePath)
            if(!blob) return
            setResumeUrl(URL.createObjectURL(blob))
        }
        loadResume()
    }, [imagePath])

    const handleDelete = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (!confirm('Delete this resume?')) return
        setIsDeleting(true)
        try {
            const key = `resume:${id}`
            const result = await kv.delete(key)
            if (result === false) {
                alert(`Failed to delete.`)
                return
            }
            onDelete?.(id)
        } catch (error) {
            alert('Failed to delete resume: ' + error)
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <div className="relative group w-full max-w-sm mx-auto sm:max-w-none sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1rem)]">
            <Link to={`/resume/${id}`} className="glass-panel flex flex-col gap-3 p-3 sm:p-6 h-full hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
                <div className="flex flex-row justify-between items-start gap-2 mb-1">
                    <div className="flex flex-col gap-0.5 overflow-hidden w-full">
                        <h2 className="text-lg sm:text-2xl font-bold text-gray-900 truncate leading-tight">
                            {companyName || "Resume"}
                        </h2>
                        {jobTitle && <h3 className="text-xs sm:text-base text-gray-500 truncate">{jobTitle}</h3>}
                    </div>
                    {/* Skala lingkaran nilai diperkecil di layar sempit */}
                    <div className="flex-shrink-0 scale-[0.65] sm:scale-90 origin-top-right -mt-2 -mr-2 sm:mt-0 sm:mr-0">
                        <ScoreCircle score={feedback.overallScore} />
                    </div>
                </div>
                
                {resumeUrl && (
                    <div className="mt-auto rounded-lg sm:rounded-2xl overflow-hidden border border-gray-100 shadow-inner bg-gray-50 relative group-hover:shadow-md transition-shadow">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent z-10"></div>
                        {/* Tinggi gambar dipangkas di layar sempit agar tidak memakan layar */}
                        <img
                            src={resumeUrl}
                            alt="resume"
                            className="w-full h-32 sm:h-auto sm:aspect-[1/1.2] object-cover object-top transition-transform duration-700 group-hover:scale-105"
                        />
                    </div>
                )}
            </Link>

            <button
                onClick={handleDelete}
                disabled={isDeleting}
                title="Hapus resume"
                className="absolute -top-2 -right-2 sm:top-3 sm:right-3 z-20 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-200 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center shadow-lg hover:scale-110"
            >
                {isDeleting ? (
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                        <path d="M10 11v6M14 11v6" />
                        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                    </svg>
                )}
            </button>
        </div>
    )
}

export default ResumeCard