import Navbar from "~/components/Navbar";
import type { Route } from "./+types/home";
import ResumeCard from "~/components/ResumeCard";
import { usePuterStore } from "~/lib/puter";
import { Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resumind" },
    { name: "description", content: "Smart feedback for your dream job!" },
  ];
}

export default function Home() { 
    const {auth, kv} = usePuterStore()
    const navigate = useNavigate()
    const [resumes, setResumes] = useState<Resume[]>([])
    const [loadingResumes, setLoadingResumes] = useState(false)

    useEffect(() => {
        if(!auth.isAuthenticated) navigate('/auth?next=/')
    }, [auth.isAuthenticated])

    useEffect(() => {
        const loadResumes = async () => {
            setLoadingResumes(true);

            const items = (await kv.list('resume:*', true)) as KVItem[];
            // console.log('[Home] Raw KV items:', items)

            const parsedResumes = items?.map((item) => {
                const parsed = JSON.parse(item.value) as Resume
                // Log tiap resume agar bisa verifikasi id-nya
                // console.log('[Home] Resume id:', parsed.id, '| KV key:', item.key)
                return parsed
            })

            setResumes(parsedResumes || []);
            setLoadingResumes(false);
        }
        loadResumes()
    }, []);

    const handleDeleteResume = (id: string) => {
        setResumes(prev => prev.filter(resume => resume.id !== id))
    }

    return <main className="bg-[url('/images/bg-main.svg')] bg-cover"> 
        <Navbar />
        <section className="main-section">
            <div className="page-heading py-16">
                <h1>Track Your Applications & Resume Ratings</h1>
                {!loadingResumes && resumes?.length === 0 ? (
                    <h2>No resumes found. Upload your first resume to get feedback.</h2>
                ): (
                    <h2>Review your submissions and check AI-powered feedback.</h2>
                )}
            </div>
            {loadingResumes && (
                <div className="flex flex-col items-center justify-center">
                    <img src="/images/resume-scan-2.gif" className="w-[200px]" />
                </div>
            )}
            {!loadingResumes && resumes.length > 0 && (
                <div className="resumes-section">
                    {resumes.map((resume) => (
                        <ResumeCard key={resume.id} resume={resume} onDelete={handleDeleteResume} />
                    ))}
                </div>
            )}
            {!loadingResumes && resumes?.length === 0 && (
                <div className="flex flex-col items-center justify-center mt-10 gap-4">
                    <Link to="/upload" className="primary-button w-fit text-xl font-semibold">
                        Upload Resume
                    </Link>
                </div>
            )}
        </section>
    </main>
}