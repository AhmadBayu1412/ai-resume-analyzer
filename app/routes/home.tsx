import Navbar from "~/components/Navbar";
import type { Route } from "./+types/home";
import ResumeCard from "~/components/ResumeCard";
import { usePuterStore } from "~/lib/puter";
import { Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";

/**
 * Meta information for SEO
 */
export function meta({}: Route.MetaArgs) {
  return [
    { title: "CVPilot" },
    { name: "description", content: "Smart feedback for your dream job!" },
  ];
}

/**
 * Home Component:
 * Displays the user's dashboard with a list of uploaded resumes.
 * Handles authentication checks and data fetching from Puter KV.
 */
export default function Home() { 
    const { auth, kv } = usePuterStore();
    const navigate = useNavigate();
    
    const [resumes, setResumes] = useState<Resume[]>([]);
    const [loadingResumes, setLoadingResumes] = useState(false);

    // Guard: Redirect unauthenticated users to the auth page
    useEffect(() => {
        if (!auth.isAuthenticated) navigate('/auth?next=/');
    }, [auth.isAuthenticated, navigate]);

    // Data Fetching: Load resumes list from KV storage
    useEffect(() => {
        const loadResumes = async () => {
            setLoadingResumes(true);
            try {
                const items = (await kv.list('resume:*', true)) as KVItem[];
                const parsedResumes = items?.map((item) => JSON.parse(item.value) as Resume);
                setResumes(parsedResumes || []);
            } catch (error) {
                console.error("Failed to load resumes:", error);
            } finally {
                setLoadingResumes(false);
            }
        };
        loadResumes();
    }, [kv]);

    // Helper: Remove resume from local state after deletion
    const handleDeleteResume = (id: string) => {
        setResumes(prev => prev.filter(resume => resume.id !== id));
    };

    return (
        <main className="bg-[url('/images/bg-main.svg')] bg-cover min-h-screen"> 
            <Navbar />
            <section className="main-section">
                <div className="page-heading py-16">
                    <h1>Get Hired Faster with an AI-Optimized Resume</h1>
                    <h2>
                        {resumes.length === 0 
                            ? "No resumes found. Upload your first resume to get feedback." 
                            : "Instant ATS analysis, powerful resume insights, and smart application tracking — all in one beautiful dashboard."}
                    </h2>
                </div>

                {/* Loading State */}
                {loadingResumes && (
                    <div className="flex flex-col items-center justify-center">
                        <img src="/images/resume-scan-2.gif" alt="Loading..." className="w-[200px]" />
                    </div>
                )}

                {/* Resume List */}
                {!loadingResumes && resumes.length > 0 && (
                    <div className="resumes-section">
                        {resumes.map((resume) => (
                            <ResumeCard 
                                key={resume.id} 
                                resume={resume} 
                                onDelete={handleDeleteResume} 
                            />
                        ))}
                    </div>
                )}

                {/* Empty State Action */}
                {!loadingResumes && resumes.length === 0 && (
                    <div className="flex flex-col items-center justify-center mt-10 gap-4">
                        <Link to="/upload" className="primary-button w-fit text-xl font-semibold">
                            Upload Resume
                        </Link>
                    </div>
                )}
            </section>
        </main>
    );
}
