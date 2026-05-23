import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router"
import ATS from "~/components/ATS"
import Details from "~/components/Details"
import Summary from "~/components/Sumarry"
import { usePuterStore } from "~/lib/puter"
import { Sparkles } from "lucide-react";

/**
 * Meta information for SEO and page management.
 */
export const meta = () => [
    { title: 'CVPilot | Review' },
    { name: 'description', content: 'Detailed overview of your resume' }
]

/**
 * Resume Component:
 * Fetches resume data from Puter KV and Storage, then renders the 
 * AI analysis results, ATS score, and detailed feedback.
 */
const Resume = () => {
    const { auth, isLoading, fs, kv } = usePuterStore()
    const { id } = useParams()
    
    // State management for assets and AI feedback
    const [imageUrl, setImageUrl] = useState('')
    const [resumeUrl, setResumeUrl] = useState('')
    const [feedback, setFeedback] = useState<Feedback | null>(null)
    
    const navigate = useNavigate()

    // Authentication Guard: Redirect to auth page if user is not authenticated
    useEffect(() => {
        if (!isLoading && !auth.isAuthenticated) {
            navigate(`/auth?next=/resume/${id}`)
        }
    }, [isLoading, auth.isAuthenticated, navigate, id])

    // Data Fetching: Load resume metadata and binary files (PDF/Image)
    useEffect(() => {
        const loadResume = async () => {
            const resumeData = await kv.get(`resume:${id}`)
            if (!resumeData) return

            const data = JSON.parse(resumeData)

            // Load and process PDF blob for the viewer
            const resumeBlob = await fs.read(data.resumePath)
            if (resumeBlob) {
                const pdfBlob = new Blob([resumeBlob], { type: 'application/pdf' })
                setResumeUrl(URL.createObjectURL(pdfBlob))
            }
            
            // Load and process Image blob for preview
            const imageBlob = await fs.read(data.imagePath)
            if (imageBlob) {
                const imgUrl = URL.createObjectURL(imageBlob)
                setImageUrl(imgUrl)
            }

            setFeedback(data.feedback)
        }

        loadResume()
        
        // Cleanup: Revoke object URLs to prevent memory leaks
        return () => {
            if (resumeUrl) URL.revokeObjectURL(resumeUrl)
            if (imageUrl) URL.revokeObjectURL(imageUrl)
        }
    }, [id])

    return (
        <main className="!pt-0">
            {/* Back Navigation */}
            <nav className="relative z-50 container mx-auto px-6 pt-4 mb-2">
                <Link to="/" className="inline-flex items-center gap-2 text-[#1E1B4B] text-sm font-medium hover:opacity-70 transition">
                    <img src="/icons/back.svg" alt="Back" className="w-4 h-4" />
                    Back to Dashboard
                </Link>
            </nav>

            <div className="flex flex-row w-full max-lg:flex-col-reverse">
                {/* Left Section: Resume Preview */}
                <section className="feedback-section bg-[url('/images/bg-small.svg')] bg-cover h-[100vh] sticky top-0 items-center justify-center">
                    {imageUrl && resumeUrl ? (
                        <div className="animate-in fade-in duration-1000 gradient-border max-sm:m-0 h-[90%] max-wxl:h-fit w-fit ">
                            <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                                <img 
                                    src={imageUrl}
                                    className="w-full h-full object-contain rounded-2xl"
                                    title="resume" 
                                />
                            </a>
                        </div>
                    ) : null}
                </section>

                {/* Right Section: AI Analysis Results */}
                <section className="feedback-section">
                    <div className="flex items-start gap-4 mb-8">
                        <div className="flex items-center justify-center min-w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 shadow-md hover:scale-105 transition-all duration-300">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex flex-col">
                            <h2 className="text-4xl font-bold tracking-tight text-[#1E1B4B] leading-none">
                                AI Resume Analysis
                            </h2>
                            <p className="text-gray-500 text-sm mt-2">
                                Smart insights powered by AI & ATS technology
                            </p>
                        </div>
                    </div>

                    {/* Conditional Rendering for Analysis Feedback */}
                    {feedback ? (
                        <div className="flex flex-col gap-8 animate-in fade-in duration-1000">
                            <Summary feedback={feedback} />
                            <ATS score={feedback.ATS.score || 0} suggestions={feedback.ATS.tips || []} />
                            <Details feedback={feedback} />
                        </div>
                    ) : (
                        <img src="/images/resume-scan-2.gif" alt="Scanning..." className="w-full" />
                    )}
                </section>
            </div>
        </main>
    )
}

export default Resume
