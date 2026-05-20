import { Link } from "react-router"
import ScoreCircle from "./ScoreCircle"
import { usePuterStore } from "~/lib/puter"
import { useEffect, useState } from "react"

const ResumeCard = ({resume: {id, companyName, jobTitle, feedback, imagePath}, onDelete}: {resume:Resume, onDelete?: (id: string) => void}) => {
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

        if (!confirm('Hapus resume ini?')) return

        setIsDeleting(true)
        try {
            // Gunakan format key yang sama dengan saat menyimpan
            const key = `resume:${id}`
            // console.log('[Delete] Attempting to delete key:', key)

            const result = await kv.delete(key)
            // console.log('[Delete] Result:', result)

            if (result === false) {
                // Coba fallback: list dulu untuk cek key yang ada
                const allKeys = await kv.list('resume:*', false) as string[]
                // console.log('[Delete] Existing keys:', allKeys)
                alert(`Gagal menghapus. Key yang dicoba: "${key}". Keys yang ada: ${JSON.stringify(allKeys)}`)
                return
            }

            onDelete?.(id)
        } catch (error) {
            // console.error('[Delete] Error:', error)
            alert('Gagal menghapus resume: ' + error)
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <div className="relative group">
            <Link to={`/resume/${id}`} className="resume-card animate-in fade-in duration-1000">
                <div className="resume-card-header">
                    <div className="flex flex-col gap-2">
                        {companyName && <h2 className="!text-black font-bold break-words">{companyName}</h2>}
                        {jobTitle && <h3 className="text-lg break-words text-gray-500">{jobTitle}</h3>}
                        {!companyName && !jobTitle && <h2 className="!text-black font-bold">Resume</h2>}
                    </div>
                    <div className="flex-shrink-0">
                        <ScoreCircle score={feedback.overallScore} />
                    </div>
                </div>
                {resumeUrl && (
                    <div className="gradient-border animate-in fade-in duration-1000">
                        <div className="w-full h-full">
                            <img
                                src={resumeUrl}
                                alt="resume"
                                className="w-full h-[350px] max-sm:h-[200px] object-cover object-top"
                            />
                        </div>
                    </div>
                )}
            </Link>

            <button
                onClick={handleDelete}
                disabled={isDeleting}
                title="Hapus resume"
                className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white rounded-full w-9 h-9 flex items-center justify-center shadow-lg"
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