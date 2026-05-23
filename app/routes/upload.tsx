import {type FormEvent, useState } from "react"
import FileUploader from "~/components/FileUploader"
import Navbar from "~/components/Navbar"
import { usePuterStore } from "~/lib/puter"
import { prepareInstructions } from "../../constants"
import { generateUUID } from "~/lib/utils"
import { convertPdfToImage } from "~/lib/pdf2img"
import { useNavigate } from "react-router"


const Upload = () => {
    const {auth, isLoading, fs, ai, kv} = usePuterStore()
    const navigate = useNavigate()
    const [isProcessing, setIsProcessing] = useState(false)
    const [statusText, setStatusText] = useState('')
    const [file, setFile] = useState<File | null>(null)

    const handleFileSelect = (file: File | null) => {
        setFile(file)
    }

    /**
     * Orchestrates the complete resume analysis pipeline.
     * 
     * Pipeline Steps:
     * 1. File Upload: Persists the source PDF to Puter's file system for storage.
     * 2. Visual Preview: Converts the first page of the PDF to an image for UI display.
     * 3. Persistence: Initializes a record in the KV store with a unique UUID to track the session.
     * 4. AI Analysis: Uses the Puter AI service to analyze the resume against 
     *    specific job requirements provided via `prepareInstructions`.
     * 5. Result Sync: Parses the AI feedback and updates the KV record with the final analysis.
     * 
     * @throws Will set statusText and return early if any file operation or AI analysis fails.
     */
    const handleAnalyze = async({companyName, jobTitle, jobDescription, file}: { companyName:string, jobTitle: string, jobDescription: string, file: File }) => {
        setIsProcessing(true)

        setStatusText('Uploading the file...')
        const uploadedFile = await fs.upload([file])
        if(!uploadedFile) return setStatusText('Error: Failed to upload file')

        setStatusText('Converting to image...')
        const imageFile = await convertPdfToImage(file)
        if(!imageFile.file) return setStatusText('Error: Failed to convert PDF to image')

        setStatusText('uploading the image...')
        const uploadedImage = await fs.upload([imageFile.file])
        if(!uploadedImage) return setStatusText('Error: Failed to upload image')

        setStatusText('Preparing data...')
        const uuid = generateUUID()
        const data = {
            id: uuid,
            resumePath: uploadedFile.path,
            imagePath: uploadedImage.path,
            companyName, jobTitle, jobDescription,
            feedback: '',
        }
        await kv.set(`resume ${uuid}`, JSON.stringify(data))

        setStatusText('Analyzing...')

        const feedback = await ai.feedback(
            uploadedFile.path, 
            prepareInstructions({ jobTitle, jobDescription })
        )
        if(!feedback) return setStatusText('Error: Failed to analyze resume')
        
        const feedbackText = typeof feedback.message.content === 'string'
            ? feedback.message.content
            : feedback.message.content[0].text

        data.feedback = JSON.parse(feedbackText)
        await kv.set(`resume:${uuid}`, JSON.stringify(data))
        setStatusText('Analysis complete, redirecting')
        console.log(data)
        navigate(`/resume/${uuid}`)

    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const form = e.currentTarget.closest('form')
        if(!form) return

        const formData = new FormData(form)

        const companyName = formData.get('company-name') as string
        const jobTitle = formData.get('job-title') as string
        const jobDescription = formData.get('job-description') as string

        if(!file) return

        handleAnalyze({companyName, jobTitle, jobDescription, file})
    }


    return (
        <main className="bg-[url('/images/bg-main.svg')] bg-cover min-h-screen">
            <Navbar />

            <section className="main-section">
                <div className="page-heading py-16">
                    <h1>Optimize Your Resume Before Recruiters See It</h1>
                    {isProcessing ? (
                        <>
                            <h2>{statusText}</h2>
                            <img src="/images/resume-scan.gif" className="w-full max-w-sm mx-auto" />
                        </>
                    ) 
                    : (
                        <h2>Upload your resume and receive instant scoring, actionable improvements, and ATS-ready optimization in seconds.</h2>
                    )}
                    {!isProcessing && (
                        // PERUBAHAN DI SINI: Ditambahkan w-full max-w-3xl mx-auto text-left
                        <form id="upload-form" onSubmit={handleSubmit} className="flex flex-col gap-4 mt-8 w-full max-w-3xl mx-auto text-left">
                            <div className="form-div">
                                <label htmlFor="company-name">Target Company</label>
                                <input type="text" name='company-name' placeholder="e.g. Google, Microsoft, Spotify" id="company-name" />
                            </div>
                            <div className="form-div">
                                <label htmlFor="job-title">Desired Position</label>
                                <input type="text" name='job-title' placeholder="e.g. Frontend Developer" id="job-title" />
                            </div>
                            <div className="form-div">
                                <label htmlFor="job-description">Job Requirements</label>
                                <textarea
                                    name="job-description"
                                    placeholder="Paste the job description here for smarter ATS analysis.."
                                    id="job-description"
                                    rows={6}
                                    className="resize-none max-h-60 overflow-y-auto"
                                    />
                            </div>
                            <div className="form-div w-full">
                                <label htmlFor="uploader">Upload Resume</label>
                                <FileUploader onFileSelect={handleFileSelect}/>

                            </div>

                            <button className="primary-button w-full mt-2 bg-gradient-to-br from-indigo-500 via-purple-500 to-violet-300 shadow-md shadow-indigo-500" type="submit">Analyze Resume</button>
                        </form>
                    )}
                </div>
            </section>
        </main>
    )
}

export default Upload
