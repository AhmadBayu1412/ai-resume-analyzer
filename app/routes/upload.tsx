import { type FormEvent, useState } from "react"
import FileUploader from "~/components/FileUploader"
import Navbar from "~/components/Navbar"
import { usePuterStore } from "~/lib/puter"
import { prepareInstructions } from "../../constants"
import { generateUUID } from "~/lib/utils"
import { convertPdfToImage } from "~/lib/pdf2img"
import { useNavigate } from "react-router"
import { 
    BrainCircuit, 
    Sparkles, 
    Building2, 
    Briefcase, 
    FileText, 
    Target, 
    ShieldCheck, 
    Lock,
    Star
} from "lucide-react"

const Upload = () => {
    const { auth, isLoading, fs, ai, kv } = usePuterStore()
    const navigate = useNavigate()
    const [isProcessing, setIsProcessing] = useState(false)
    const [statusText, setStatusText] = useState('')
    const [file, setFile] = useState<File | null>(null)

    const handleFileSelect = (file: File | null) => {
        setFile(file)
    }

    const handleAnalyze = async ({ companyName, jobTitle, jobDescription, file }: {
        companyName: string
        jobTitle: string
        jobDescription: string
        file: File
    }) => {
        setIsProcessing(true)

        // 1. Upload file PDF ke Puter FS
        setStatusText('Uploading the file...')
        const uploadedFile = await fs.upload([file])
        if (!uploadedFile) return setStatusText('Error: Failed to upload file')

        // 2. Konversi PDF ke image (dibutuhkan oleh OpenRouter vision)
        setStatusText('Converting to image...')
        const imageFile = await convertPdfToImage(file)
        if (!imageFile.file) return setStatusText('Error: Failed to convert PDF to image')

        // 3. Upload image ke Puter FS (untuk ditampilkan di halaman hasil)
        setStatusText('Uploading the image...')
        const uploadedImage = await fs.upload([imageFile.file])
        if (!uploadedImage) return setStatusText('Error: Failed to upload image')

        // 4. Konversi image ke base64 untuk dikirim ke OpenRouter (jika model OpenRouter aktif)
        //    Proses ini dilakukan di sini agar siap dipakai, tapi hanya dikirim jika model OpenRouter
        let imageBase64: string | null = null
        try {
            imageBase64 = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader()
                reader.onload = () => {
                    const result = reader.result as string
                    // Pastikan formatnya adalah data URL (data:image/...;base64,...)
                    if (result.startsWith('data:')) {
                        resolve(result)
                    } else {
                        reject(new Error('FileReader result is not a data URL'))
                    }
                }
                reader.onerror = () => reject(new Error('Failed to read image file'))
                reader.readAsDataURL(imageFile.file!)
            })
        } catch (err) {
            console.warn('[Upload] Gagal konversi image ke base64, OpenRouter vision mungkin tidak berfungsi:', err)
            // Tidak fatal — jika model Puter yang aktif, imageBase64 tidak dibutuhkan
        }

        // 5. Simpan metadata awal ke KV store
        setStatusText('Preparing data...')
        const uuid = generateUUID()
        const data: any = {
            id: uuid,
            resumePath: uploadedFile.path,
            imagePath: uploadedImage.path,
            companyName,
            jobTitle,
            jobDescription,
            feedback: '',
        }
        await kv.set(`resume:${uuid}`, JSON.stringify(data))

        // 6. Panggil AI untuk analisis resume
        //    - resumePath → untuk Puter AI (native Puter FS)
        //    - imageBase64 → untuk OpenRouter (vision / base64 image)
        setStatusText('Analyzing with AI...')

        let feedback
        try {
            feedback = await ai.feedback(
                uploadedFile.path,
                imageBase64,
                prepareInstructions({ jobTitle, jobDescription })
            )
        } catch (error: any) {
            console.error("AI Request Failed:", error)
            setStatusText('Error: AI providers unavailable or failed.')
            setIsProcessing(false)
            return
        }

        if (!feedback) {
            setStatusText('Error: Failed to analyze resume')
            setIsProcessing(false)
            return
        }

        console.log("=== HASIL MENTAH DARI AI ===", feedback)

        // 7. Ekstrak teks dari response AI
        let feedbackText = ""

        if (typeof feedback?.message?.content === "string") {
            feedbackText = feedback.message.content
        } else if (Array.isArray(feedback?.message?.content)) {
            feedbackText = feedback.message.content[0]?.text || ""
        } else {
            setStatusText('Error: Unexpected AI response format')
            setIsProcessing(false)
            return
        }

        // 8. Ekstrak JSON dari response (kebal terhadap ```json, spasi, dll.)
        const jsonMatch = feedbackText.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
            feedbackText = jsonMatch[0]
        } else {
            setStatusText('Error: AI did not return a valid JSON object')
            setIsProcessing(false)
            return
        }

        console.log("=== TEXT SIAP PARSE ===", feedbackText)

        // 9. Parse JSON dan simpan ke KV, lalu navigasi ke halaman hasil
        try {
            data.feedback = JSON.parse(feedbackText)
            await kv.set(`resume:${uuid}`, JSON.stringify(data))
            navigate(`/resume/${uuid}`)
        } catch (error) {
            console.error("JSON Parse Error:", error)
            console.log("Raw JSON Error Text:", feedbackText)
            setStatusText('Error: AI failed to analyze completely. Please try again.')
        } finally {
            setIsProcessing(false)
        }
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const form = e.currentTarget.closest('form')
        if (!form) return

        const formData = new FormData(form)

        const companyName = formData.get('company-name') as string
        const jobTitle = formData.get('job-title') as string
        const jobDescription = formData.get('job-description') as string

        if (!file) return

        handleAnalyze({ companyName, jobTitle, jobDescription, file })
    }

    const features = [
        { icon: <Target className="w-5 h-5 text-indigo-400" />, title: "ATS Score Analysis", desc: "Get an instant ATS score and detailed insights." },
        { icon: <Sparkles className="w-5 h-5 text-purple-400" />, title: "AI-Powered Suggestions", desc: "Get personalized tips to improve your resume." },
        { icon: <Briefcase className="w-5 h-5 text-pink-400" />, title: "Job Match Insights", desc: "See how well your resume matches the job." },
        { icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />, title: "Secure & Private", desc: "Your data is encrypted and 100% confidential." },
    ]

    return (
        <main className="min-h-screen flex flex-col relative overflow-hidden bg-[#060416] animate-page-transition">
            {/* Background Glow Effect */}
            <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-purple-700/20 rounded-full blur-[120px] pointer-events-none z-0"></div>
            <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-indigo-700/10 rounded-full blur-[100px] pointer-events-none z-0"></div>
            
            <div className="relative z-100 w-full">
                <Navbar />
            </div>

            <section className="flex-1 flex items-center justify-center py-10 px-4 sm:px-6 lg:px-12 w-full max-w-[1400px] mx-auto relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center w-full">
                    
                    {/* SISI KIRI: Teks & Fitur */}
                    <div className="flex flex-col items-start text-left">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs sm:text-sm font-semibold text-indigo-300 backdrop-blur-md mb-6 sm:mb-8">
                            <Sparkles className="w-4 h-4" />
                            <span>AI-Powered Resume Optimization</span>
                        </div>

                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 lg:mb-6 leading-tight text-white">
                            Optimize Your Resume <br className="hidden sm:block"/>
                            Before <span className="text-glow-purple">Recruiters See It</span>
                        </h1>
                        
                        <p className="text-gray-400 font-medium text-base sm:text-lg mb-10 max-w-lg">
                            Upload your resume and receive instant scoring, actionable improvements, and ATS-ready optimization in seconds.
                        </p>

                        <div className="flex flex-col gap-6 mb-12">
                            {features.map((feature, idx) => (
                                <div key={idx} className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 shadow-lg">
                                        {feature.icon}
                                    </div>
                                    <div className="flex flex-col pt-0.5">
                                        <h4 className="text-white font-semibold text-sm sm:text-base">{feature.title}</h4>
                                        <p className="text-gray-400 text-xs sm:text-sm mt-0.5">{feature.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-wrap items-center gap-4 bg-white/5 border border-white/10 p-3 sm:p-4 rounded-2xl w-max">
                            <div className="flex -space-x-3">
                                <img className="w-10 h-10 rounded-full border-2 border-[#060416]" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces" alt="User 1" />
                                <img className="w-10 h-10 rounded-full border-2 border-[#060416]" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces" alt="User 2" />
                                <img className="w-10 h-10 rounded-full border-2 border-[#060416]" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces" alt="User 3" />
                                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-600 border-2 border-[#060416] text-xs font-bold text-white">+12K</div>
                            </div>
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-1 text-amber-400">
                                    {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                                </div>
                                <span className="text-xs text-gray-400 font-medium">4.9/5 from 1,200+ users</span>
                            </div>
                        </div>
                    </div>

                    {/* SISI KANAN: Form Upload Card */}
                    <div className="relative w-full max-w-[540px] mx-auto lg:ml-auto lg:mr-0">
                        {isProcessing ? (
                            <div className="glass-panel p-12 flex flex-col items-center justify-center gap-6 min-h-[600px] border border-purple-500/20 shadow-[0_0_50px_rgba(168,85,247,0.15)] rounded-[2rem]">
                                <div className="relative w-24 h-24 flex items-center justify-center">
                                    <div className="absolute inset-0 border-t-2 border-indigo-500 rounded-full animate-spin"></div>
                                    <div className="absolute inset-2 border-r-2 border-purple-500 rounded-full animate-spin direction-reverse" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                                    <BrainCircuit className="w-10 h-10 text-indigo-400 animate-pulse" />
                                </div>
                                <div className="flex flex-col gap-2 items-center text-center">
                                    <h2 className="text-xl font-bold text-white tracking-wide">{statusText}</h2>
                                    <p className="text-gray-400 text-sm animate-pulse">This might take a few seconds...</p>
                                </div>
                            </div>
                        ) : (
                            <form id="upload-form" onSubmit={handleSubmit} className="bg-[#100C20]/80 backdrop-blur-2xl p-6 sm:p-10 flex flex-col gap-5 sm:gap-6 relative z-10 border border-purple-400/20 shadow-[0_0_60px_-15px_rgba(168,85,247,0.3)] rounded-[2rem]">
                                
                                {/* Header Form */}
                                <div className="flex flex-col items-center justify-center text-center w-full mb-2 sm:mb-4">
                                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Upload Your Resume</h3>
                                    <p className="text-gray-400 text-xs sm:text-sm">Get ATS score, AI suggestions, and improvement tips instantly.</p>
                                </div>

                                {/* Form Group: Target Company */}
                                <div className="flex flex-col gap-1.5 sm:gap-2 w-full">
                                    <label htmlFor="company-name" className="text-xs sm:text-sm font-medium text-gray-300">Target Company (Optional)</label>
                                    <div className="flex w-full bg-[#181332] border border-white/5 rounded-xl overflow-hidden focus-within:border-purple-500/50 focus-within:bg-[#1C163C] transition-all">
                                        <div className="flex items-center justify-center pl-4 pr-3 py-3 sm:py-3.5 border-r border-white/10 shrink-0">
                                            <Building2 className="h-5 w-5 text-indigo-300/80" strokeWidth={2} />
                                        </div>
                                        <input 
                                            type="text" 
                                            name="company-name" 
                                            placeholder="e.g. Google, Microsoft, Spotify" 
                                            id="company-name" 
                                            className="w-full bg-transparent border-none outline-none focus:ring-0 text-white placeholder-gray-500 text-sm sm:text-base pl-3 pr-4 py-3 sm:py-3.5" 
                                        />
                                    </div>
                                </div>

                                {/* Form Group: Desired Position */}
                                <div className="flex flex-col gap-1.5 sm:gap-2 w-full">
                                    <label htmlFor="job-title" className="text-xs sm:text-sm font-medium text-gray-300">Desired Position</label>
                                    <div className="flex w-full bg-[#181332] border border-white/5 rounded-xl overflow-hidden focus-within:border-purple-500/50 focus-within:bg-[#1C163C] transition-all">
                                        <div className="flex items-center justify-center pl-4 pr-3 py-3 sm:py-3.5 border-r border-white/10 shrink-0">
                                            <Briefcase className="h-5 w-5 text-indigo-300/80" strokeWidth={2} />
                                        </div>
                                        <input 
                                            type="text" 
                                            name="job-title" 
                                            placeholder="e.g. Frontend Developer, Product Manager" 
                                            id="job-title" 
                                            className="w-full bg-transparent border-none outline-none focus:ring-0 text-white placeholder-gray-500 text-sm sm:text-base pl-3 pr-4 py-3 sm:py-3.5" 
                                        />
                                    </div>
                                </div>

                                {/* Form Group: Job Requirements */}
                                <div className="flex flex-col gap-1.5 sm:gap-2 w-full">
                                    <label htmlFor="job-description" className="text-xs sm:text-sm font-medium text-gray-300">Job Requirements (Optional)</label>
                                    <div className="flex w-full bg-[#181332] border border-white/5 rounded-xl overflow-hidden focus-within:border-purple-500/50 focus-within:bg-[#1C163C] transition-all">
                                        <div className="flex items-center justify-center pl-4 pr-3 border-r border-white/10 shrink-0">
                                            <FileText className="h-5 w-5 text-indigo-300/80" strokeWidth={2} />
                                        </div>
                                        <textarea
                                            name="job-description"
                                            placeholder="Paste the job description here for smarter ATS analysis..."
                                            id="job-description"
                                            rows={3}
                                            className="w-full bg-transparent border-none outline-none focus:ring-0 text-white placeholder-gray-500 text-sm sm:text-base pl-3 pr-4 py-3 sm:py-3.5 resize-none"
                                        />
                                    </div>
                                </div>

                                {/* Form Group (Uploader) */}
                                <div className="flex flex-col gap-1.5 sm:gap-2 w-full mt-2">
                                    <label className="text-xs sm:text-sm font-medium text-gray-300">Upload Resume</label>
                                    <FileUploader onFileSelect={handleFileSelect}/>
                                </div>

                                <div className="flex flex-col gap-3 mt-4 w-full">
                                    <button 
                                        className="w-full flex justify-center items-center gap-2 text-sm sm:text-base font-semibold py-3.5 sm:py-4 rounded-xl text-white transition-all bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] disabled:opacity-50 disabled:cursor-not-allowed" 
                                        type="submit"
                                        disabled={!file}
                                    >
                                        <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                                        <span>Analyze Resume</span>
                                    </button>

                                    <div className="flex items-center justify-center gap-1.5 opacity-70 mt-1">
                                        <Lock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-400" />
                                        <span className="text-[11px] sm:text-[12px] text-gray-400">Your data is secure and will not be shared.</span>
                                    </div>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </section>
        </main>
    )
}

export default Upload