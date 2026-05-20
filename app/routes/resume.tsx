import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router"
import ATS from "~/components/ATS"
import Details from "~/components/Details"
import Summary from "~/components/Sumarry"
import { usePuterStore } from "~/lib/puter"
import { Sparkles } from "lucide-react";


export const meta = () => [
    {title: 'CVPilot | Review'},
    {name: 'description', content: 'Detailed overview of your resume'}
]

const Resume = () => {
    const {auth, isLoading, fs, kv} = usePuterStore()
    const {id} = useParams()
    // semua state awal kosong
    const [imageUrl, setImageUrl] = useState('')
    const [resumeUrl, setResumeUrl] = useState('')
    const [feedback, setFeedback] = useState<Feedback | null>(null)
    const navigate = useNavigate()

    useEffect(() => {
        // auth check kalo gagal pindah ke halaman sebelumnya
            if(!isLoading && !auth.isAuthenticated) navigate(`/auth?next=/resume/${id}`)
        }, [isLoading])

    useEffect(() => {
        // Function untuk mengambil semua data resume
        const loadResume = async () => {
            const resume = await kv.get(`resume:${id}`)

            if(!resume) return
            console.log('DATA ENTERED')

            // Data dari database masih string.Diubah jadi object.
            const data = JSON.parse(resume)

            // Ambil file PDF dari storage.
            const resumeBlob = await fs.read(data.resumePath)
            if(!resumeBlob) return

            console.log('RESUMEBLOB READ')
            
            // Browser membaca binary file menghasilkan Blob (data mentah)
            const pdfBlob = new Blob([resumeBlob], {type: 'application/pdf'})
            // Buat url sementara
            const resumeUrl = URL.createObjectURL(pdfBlob)
            // Update state. React melakukan: RE-RENDER. Component dijalankan ulang dari atas.
            setResumeUrl(resumeUrl)
            console.log('PDF BLOB SUKSES')
            
            // Tampilkan image preview
            const imageBlob = await fs.read(data.imagePath)
            if(!imageBlob) return
            const imageUrl = URL.createObjectURL(imageBlob)
            setImageUrl(imageUrl)
            console.log('IMAGEBLOB SUKSESS')

            setFeedback(data.feedback)
            console.log({resumeUrl, imageUrl, feedback: data.feedback})
        }

        loadResume()
    }, [id])

    return (
        <main className="!pt-0">
           <nav className="relative z-50 container mx-auto px-6 pt-6">
            <Link
                to="/"
                className="
                inline-flex items-center gap-2
                text-[#1E1B4B]
                text-sm font-medium
                hover:opacity-70 transition
                "
            >
                <img
                src="/icons/back.svg"
                alt="Back"
                className="w-4 h-4"
                />

                Back to Dashboard
            </Link>
            </nav>
            <div className="flex flex-row w-full max-lg:flex-col-reverse">
                <section className="feedback-section bg-[url('/images/bg-small.svg')] bg-cover h-[100vh] sticky top-0 items-center justify-center">
                {/* Kalau imageUrl ADA, DAN resumeUrl ADA, baru tampilkan preview */}
                    {imageUrl && resumeUrl && (
                        <div className="animate-in fade-in duration-1000 gradient-border max-sm:m-0 h-[90%] max-wxl:h-fit w-fit ">
                            <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                                <img 
                                src={imageUrl}
                                className="w-full h-full object-contain rounded-2xl"
                                title="resume" 
                            />
                            </a>
                        </div>
                    )}
                </section>
                <section className="feedback-section">

                <div className="flex items-start gap-4 mb-8">

                    {/* ICON */}
                    <div
                    className="
                        flex items-center justify-center
                        min-w-11 h-11
                        rounded-2xl
                        bg-gradient-to-br from-indigo-500 to-purple-500
                        shadow-md
                        hover:scale-105
                        transition-all duration-300
                    "
                    >
                    <Sparkles className="w-5 h-5 text-white" />
                    </div>

                    {/* TEXT */}
                    <div className="flex flex-col">

                    <h2 className="
                        text-4xl
                        font-bold
                        tracking-tight
                        text-[#1E1B4B]
                        leading-none
                        ats-score-title
                    ">
                        AI Resume Analysis
                    </h2>

                    <p className="
                        text-gray-500
                        text-sm
                        mt-2
                    ">
                        Smart insights powered by AI & ATS technology
                    </p>

                    </div>
                </div>

                {feedback ? (
                    <div className="flex flex-col gap-8 animate-in fade-in duration-1000">
                    <Summary feedback={feedback}/>
                    <ATS score={feedback.ATS.score || 0} suggestions={feedback.ATS.tips || []} />
                    <Details feedback={feedback}/>
                    </div>
                ) : (
                    <img src="/images/resume-scan-2.gif" className="w-full" />
                )}
                </section>
            </div>
        </main>
    )
}

export default Resume