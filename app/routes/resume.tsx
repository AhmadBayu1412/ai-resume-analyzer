import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router"
import ATS from "~/components/ATS"
import Details from "~/components/Details"
import Summary from "~/components/Sumarry"
import { usePuterStore } from "~/lib/puter"

export const meta = () => [
    {title: 'Resumind | Review'},
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
            <nav className="resume-nav">
                <Link to="/" className="back-button">
                <img src="/icons/back.svg" alt="logo" className="w-2.5 h-2.5" />
                <span className="text-gray-800 text-sm font-semibold">
                    Back to Homepage
                </span>
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
                    <h2 className="text-4xl !text-black font-bold">Resume Review</h2>
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