import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { usePuterStore } from "~/lib/puter";
import ScoreCircle from "~/components/ScoreCircle";
import { Accordion, AccordionItem, AccordionHeader, AccordionContent } from "~/components/Accordion";
import { 
    ChevronLeft, CheckCircle2, AlertTriangle, Lightbulb, Briefcase, 
    LayoutDashboard, FileText, Target, Award, Download, RefreshCw, XCircle, Sparkles
} from "lucide-react";
import Navbar from "~/components/Navbar"

export const meta = () => [
    { title: 'CVPilot | Resume Analysis' },
    { name: 'description', content: 'Detailed overview of your resume' }
];

const Resume = () => {
    const { auth, isLoading, fs, kv } = usePuterStore();
    const { id } = useParams();
    
    const [imageUrl, setImageUrl] = useState('');
    const [resumeUrl, setResumeUrl] = useState('');
    const [feedback, setFeedback] = useState<any>(null);
    const [fullName, setFullName] = useState('Candidate');
    
    const navigate = useNavigate();
    
    useEffect(() => {
        if (!auth.isAuthenticated) navigate('/auth?next=/');
    }, [auth.isAuthenticated, navigate]);

    const getInitials = (name: string) => {
        const words = name.trim().split(' ');
        if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
        if (words.length === 1) return words[0].substring(0, 2).toUpperCase();
        return "CV";
    };

    useEffect(() => {
        if (!isLoading && !auth.isAuthenticated) navigate(`/auth?next=/resume/${id}`);
    }, [isLoading, auth.isAuthenticated, navigate, id]);

    useEffect(() => {
        const loadResume = async () => {
            const resume = await kv.get(`resume:${id}`);
            if (!resume) return;
            const data = JSON.parse(resume);
            setFullName(data.fullName || data.name || 'Candidate');

            const resumeBlob = await fs.read(data.resumePath);
            if (resumeBlob) setResumeUrl(URL.createObjectURL(new Blob([resumeBlob], { type: 'application/pdf' })));
            
            const imageBlob = await fs.read(data.imagePath);
            if (imageBlob) setImageUrl(URL.createObjectURL(new Blob([imageBlob])));

            setFeedback(data.feedback);
        };
        loadResume();
    }, [id, fs, kv]);

    // Fallbacks
    const atsScore = feedback?.metrics?.atsScore || feedback?.ATS?.score || feedback?.overallScore || 0;
    const keywordScore = feedback?.metrics?.keywordMatch || feedback?.keywordMatch?.score || feedback?.keywords?.score || 0; 
    const readabilityScore = feedback?.metrics?.readability || feedback?.readability?.score || feedback?.structure?.score || 0;

    const toneData = feedback?.feedback?.toneAndStyle || feedback?.toneAndStyle;
    const contentData = feedback?.feedback?.content || feedback?.content;
    const structureData = feedback?.feedback?.structure || feedback?.structure;
    const skillsData = feedback?.feedback?.skills || feedback?.skills;

    const feedbackCategories = [
        { id: "tone", title: "Tone & Style", data: toneData },
        { id: "content", title: "Content & Impact", data: contentData },
        { id: "structure", title: "Structure & Parsing", data: structureData },
        { id: "skills", title: "Skills & Keywords", data: skillsData }
    ];

    const getBadgeStyle = (score: number) => {
        if (score > 70) return "bg-green-500/10 text-green-400 border-green-500/20";
        if (score > 40) return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
        return "bg-red-500/10 text-red-400 border-red-500/20";
    };

    const getBadgeText = (score: number) => {
        if (score > 70) return "Strong";
        if (score > 40) return "Needs Work";
        return "Critical";
    };

    const jobFit = feedback?.jobFit || {
        targetRole: "Position Not Detected",
        experienceLevel: "Unknown Level",
        matchPercentage: 0,
        matchReasons: [],
        improvementAreas: []
    };
    
    const candidateInfo = feedback?.candidateInfo || {};
    const displayName = candidateInfo.name || fullName;
    const displayEmail = candidateInfo.email || "-";
    const displayPhone = candidateInfo.phone || "-";
    const displayAddress = candidateInfo.address || "-";

    const getDynamicSummary = () => {
        if (!feedback) return "Analyzing resume...";
        if (feedback.quickSummary) return feedback.quickSummary;

        const allTips: any[] = [];
        feedbackCategories.forEach(cat => {
            if (cat.data && cat.data.tips) {
                allTips.push(...cat.data.tips);
            }
        });

        const improvements = allTips.filter(t => t.type === "improve").map(t => t.tip);
        const strengths = allTips.filter(t => t.type === "good").map(t => t.tip);

        if (atsScore >= 75) {
            return `Your resume is already very strong, particularly in ${strengths[0]?.toLowerCase() || 'overall structure'}. To perfect it, focus on ${improvements[0]?.toLowerCase() || 'a few specific details'}.`;
        } else if (atsScore >= 50) {
            return `This resume has good potential, but there are crucial areas to address. Pay attention to ${improvements[0]?.toLowerCase() || 'industry keywords'} and improve ${improvements[1]?.toLowerCase() || 'content formatting'} to make it more ATS-friendly.`;
        } else {
            return `Comprehensive improvements are needed to pass ATS filters. Prioritize improving ${improvements[0]?.toLowerCase() || 'work impact'} and ensure ${improvements[1]?.toLowerCase() || 'document structure'} meets industry standards.`;
        }
    };

    const adviceText = getDynamicSummary();

    const getFormattedDateTime = () => {
        const now = new Date();
        const options: Intl.DateTimeFormatOptions = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            timeZoneName: 'short',
            timeZone: 'Asia/Jakarta'
        };
        return now.toLocaleDateString('id-ID', options);
    };

    const reportGeneratedAt = getFormattedDateTime();

    const handleDownloadReport = () => {
        window.print();
    };

    // ✨ FUNGSI BARU: Penentu Warna Dinamis (Inline Style Anti-Gagal)
    const getPrintScoreStyle = (score: number) => {
        if (score >= 70) {
            return {
                box: { backgroundColor: '#ecfdf5', borderColor: '#a7f3d0', borderWidth: '1px' },
                title: { color: '#065f46', fontWeight: 'bold' as const },
                text: { color: '#059669', fontWeight: '800' as const },
                badge: { backgroundColor: '#ffffff', borderColor: '#a7f3d0', color: '#059669', borderWidth: '1px', fontWeight: 'bold' as const }
            };
        } else if (score >= 40) {
            return {
                box: { backgroundColor: '#fffbeb', borderColor: '#fde68a', borderWidth: '1px' },
                title: { color: '#92400e', fontWeight: 'bold' as const },
                text: { color: '#d97706', fontWeight: '800' as const },
                badge: { backgroundColor: '#ffffff', borderColor: '#fde68a', color: '#d97706', borderWidth: '1px', fontWeight: 'bold' as const }
            };
        } else {
            return {
                box: { backgroundColor: '#fff1f2', borderColor: '#fecdd3', borderWidth: '1px' },
                title: { color: '#9f1239', fontWeight: 'bold' as const },
                text: { color: '#e11d48', fontWeight: '800' as const },
                badge: { backgroundColor: '#ffffff', borderColor: '#fecdd3', color: '#e11d48', borderWidth: '1px', fontWeight: 'bold' as const }
            };
        }
    };

    return (
        <>
            {/* ========================================================= */}
            {/* 1. UI WEBSITE UTAMA */}
            {/* ========================================================= */}
            <div className="print:hidden min-h-screen bg-[#060416] text-gray-300 font-sans flex flex-col animate-page-transition mt-6">
                <Navbar />

                <main className="flex-1 flex flex-col lg:flex-row gap-6 p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto w-full overflow-hidden">
                    {/* KOLOM KIRI: Profil & Preview */}
                    <section className="w-full lg:w-[320px] xl:w-[360px] flex flex-col gap-6 shrink-0">
                        <div className="glass-panel p-6 flex flex-col items-center text-center">
                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 p-[2px] mb-4 shadow-lg shadow-purple-500/20">
                                <div className="w-full h-full rounded-2xl bg-[#060416] flex items-center justify-center">
                                    <span className="text-2xl font-bold text-white tracking-wider">{getInitials(displayName)}</span>
                                </div>
                            </div>
                            <h2 className="text-xl font-bold text-white mb-1">{displayName}</h2>
                            <p className="text-xs text-indigo-400 font-medium mb-5">
                                {jobFit.targetRole !== "Position Not Detected" ? jobFit.targetRole : "Candidate"}
                            </p>
                            <div className="w-full space-y-2.5 text-[13px] text-gray-400 bg-white/5 p-4 rounded-xl border border-white/5 text-left overflow-hidden">
                                <p className="flex items-center gap-3"><span className="text-gray-500 shrink-0 color-red">💌</span> <span className="truncate">{displayEmail}</span></p>
                                <p className="flex items-center gap-3"><span className="text-gray-500 shrink-0">☎️</span> <span className="truncate">{displayPhone}</span></p>
                                <p className="flex items-center gap-3"><span className="text-gray-500 shrink-0">📍</span> <span className="truncate">{displayAddress}</span></p>
                            </div>
                        </div>

                        <div className="glass-panel p-4 sticky top-6">
                            {imageUrl ? (
                                <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                                    <img src={imageUrl} className="w-full h-auto object-contain rounded-xl border border-white/10 hover:border-indigo-500/50 transition-colors" alt="Resume Preview" />
                                </a>
                            ) : (
                                <div className="h-[350px] flex items-center justify-center border border-dashed border-white/10 rounded-xl text-gray-500 text-sm">Loading Preview...</div>
                            )}
                        </div>

                        {/* KOTAK SARAN SINGKAT */}
                        <div className="glass-panel p-5 relative overflow-hidden group">
                            <div className="absolute -right-6 -top-6 w-24 h-24 bg-purple-500/20 rounded-full blur-2xl group-hover:bg-purple-500/30 transition-all duration-500"></div>
                            <div className="absolute -left-6 -bottom-6 w-24 h-24 bg-indigo-500/20 rounded-full blur-2xl group-hover:bg-indigo-500/30 transition-all duration-500"></div>

                            <div className="relative z-10 flex flex-col gap-3">
                                <h3 className="text-white font-semibold text-sm flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-purple-400" />
                                    Summary & Advice
                                </h3>
                                <p className="text-[13px] text-gray-300 leading-relaxed bg-white/5 border border-white/10 p-3.5 rounded-xl backdrop-blur-md shadow-inner">
                                    {adviceText}
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* KOLOM KANAN: Dashboard Analisis */}
                    <section className="flex-1 flex flex-col gap-5 w-full">
                        <div className="flex justify-between items-center mb-1 text-white"> 
                            <h1 className="text-2xl font-bold hidden lg:block tracking-wide">Analysis Results</h1>
                            <div className="flex gap-3 w-full lg:w-auto">
                                <button onClick={handleDownloadReport} className="secondary-button !py-3 !px-4 !text-xs flex items-center gap-2 flex-1 justify-center rounded-lg bg-indigo-600 hover:bg-indigo-700 transition text-white">
                                    <Download className="w-3.5 h-3.5"/> Download Report
                                </button>
                            </div>
                        </div>

                        {/* Panel 1 */}
                        <div className="glass-panel p-5 sm:p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-1.5 bg-indigo-500/20 rounded-md text-indigo-400"><LayoutDashboard className="w-4 h-4"/></div>
                                <div>
                                    <h3 className="text-white font-semibold text-base">Performance Overview</h3>
                                    <p className="text-xs text-gray-400">Scored against strict ATS standards and recruiter preferences.</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 divide-x divide-white/5">
                                <ScoreCircle score={atsScore} label="ATS Score" subtext={atsScore > 70 ? "Great job!" : "Needs some work!"} />
                                <ScoreCircle score={keywordScore} label="Keyword Match" subtext="Keywords relevance check." />
                                <ScoreCircle score={readabilityScore} label="Readability" subtext="Structure and format score." />
                                <div className="flex flex-col items-center justify-center">
                                    <p className="text-xs font-semibold text-gray-300 mb-4">Resume Length</p>
                                    <div className="relative w-[90px] h-[90px] flex items-center justify-center bg-white/5 border border-white/10 rounded-full">
                                        <FileText className="absolute text-indigo-500/20 w-10 h-10" />
                                        <span className="font-bold text-lg text-white relative z-10">1<span className="text-[10px] text-gray-400 font-normal ml-0.5">Page</span></span>
                                    </div>
                                    <p className="text-[10px] text-gray-400 mt-4 text-center max-w-[110px]">Ideal for entry-level positions.</p>
                                </div>
                            </div>
                        </div>

                        {/* Panel 2 */}
                        <div className="glass-panel p-5 sm:p-6">
                            <Accordion allowMultiple defaultOpen="tone">
                                {feedbackCategories.map((category) => {
                                    if (!category.data) return null;
                                    return (
                                        <AccordionItem key={category.id} id={category.id} className="!bg-[#0A071A] !border-white/5 mb-3 rounded-xl">
                                            <AccordionHeader itemId={category.id}>
                                                <div className="flex justify-between items-center w-full pr-2">
                                                    <span className="text-white font-semibold text-sm">{category.title}</span>
                                                    <span className={`px-2.5 py-0.5 text-[10px] rounded border font-medium ${getBadgeStyle(category.data.score)}`}>
                                                        {category.data.score}/100 - {getBadgeText(category.data.score)}
                                                    </span>
                                                </div>
                                            </AccordionHeader>
                                            <AccordionContent itemId={category.id}>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pb-2">
                                                    {category.data.tips.map((tip: any, index: number) => {
                                                        const isGood = tip.type === "good";
                                                        return (
                                                            <div key={index} className={`p-3.5 rounded-lg flex flex-col gap-2 border ${isGood ? "bg-green-500/5 border-green-500/10" : "bg-red-500/5 border-red-500/10"}`}>
                                                                <p className={`font-medium text-xs flex items-center gap-2 ${isGood ? "text-green-400" : "text-red-400"}`}>
                                                                    {isGood ? <CheckCircle2 className="w-3.5 h-3.5"/> : <XCircle className="w-3.5 h-3.5"/>} 
                                                                    {tip.tip}
                                                                </p>
                                                                <p className="text-[11px] text-gray-400 leading-relaxed">{tip.explanation}</p>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                    );
                                })}
                            </Accordion>
                        </div>

                        {/* Panel 3 */}
                        <div className="glass-panel p-5 sm:p-6">
                            <h3 className="text-white font-semibold text-base mb-5 flex items-center gap-2">
                                <Briefcase className="w-4 h-4 text-blue-400" /> Job Fit Analysis
                            </h3>
                            <div className="flex flex-col md:flex-row gap-6 bg-white/5 border border-white/10 rounded-xl p-5">
                                <div className="flex-[0.8] border-r border-white/10 md:pr-5">
                                    <h4 className="text-white font-medium text-sm mb-1">{jobFit.targetRole}</h4>
                                    <p className="text-[9px] text-gray-500 mb-4 uppercase tracking-widest font-bold">{jobFit.experienceLevel}</p>
                                    <div className="w-full bg-[#060416] rounded-full h-2 mb-1.5 border border-white/10 p-0.5">
                                        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full relative transition-all duration-1000 ease-out" style={{ width: `${jobFit.matchPercentage}%` }}></div>
                                    </div>
                                    <div className="text-right text-[10px] font-bold text-purple-400">{jobFit.matchPercentage}% Match</div>
                                </div>
                                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div>
                                        <p className="text-[10px] text-gray-500 font-bold mb-2.5 uppercase tracking-wider">Why it's a match</p>
                                        <ul className="space-y-2 text-[11px]">
                                            {jobFit.matchReasons.length > 0 ? (
                                                jobFit.matchReasons.map((reason: string, index: number) => (
                                                    <li key={`match-${index}`} className="flex gap-2 items-start">
                                                        <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0" /> 
                                                        <span className="text-gray-300">{reason}</span>
                                                    </li>
                                                ))
                                            ) : (<li className="text-gray-500 italic">No match reasons detected.</li>)}
                                        </ul>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-500 font-bold mb-2.5 uppercase tracking-wider">What to improve</p>
                                        <ul className="space-y-2 text-[11px]">
                                            {jobFit.improvementAreas.length > 0 ? (
                                                jobFit.improvementAreas.map((area: string, index: number) => (
                                                    <li key={`improve-${index}`} className="flex gap-2 items-start">
                                                        <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" /> 
                                                        <span className="text-gray-300">{area}</span>
                                                    </li>
                                                ))
                                            ) : (<li className="text-gray-500 italic">No improvement areas detected.</li>)}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </section>
                </main>
            </div>

            {/* ========================================================= */}
            {/* 2. UI KHUSUS PDF (Desain Berwarna Dinamis & Footer Di Bawah) */}
            {/* ========================================================= */}
            <div className="hidden print:flex flex-col min-h-screen bg-white font-sans print-exact-colors pt-4">
                
                {/* Header Dokumen */}
                <div className="border-b border-blue-200 pb-5 mb-6 px-8 flex-shrink-0">
                    <h1 className="text-4xl font-extrabold text-blue-900 tracking-tight flex items-center gap-3" style={{ color: '#1e3a8a' }}>
                        CVPilot<span className="text-indigo-500 font-medium">|</span>Analysis Report
                    </h1>
                    <p className="text-lg text-slate-700 mt-2 font-medium">
                        Candidate: <span className="font-bold text-blue-950" style={{ color: '#172554' }}>{displayName}</span>
                    </p>
                    <div className="flex gap-4 text-sm text-slate-500 mt-1 font-medium">
                        <span>Email: {displayEmail}</span>
                        <span>Phone: {displayPhone}</span>
                    </div>
                </div>

                {/* Skor Metrik Utama - WARNA KONDISIONAL */}
                <div className="grid grid-cols-4 gap-4 mb-8 px-8 flex-shrink-0">
                    <div className="p-4 rounded-xl text-center break-inside-avoid" style={getPrintScoreStyle(atsScore).box}>
                        <p className="text-sm text-center w-full" style={getPrintScoreStyle(atsScore).title}>ATS Score</p>
                        <p className="text-3xl mt-1" style={getPrintScoreStyle(atsScore).text}>{atsScore}</p>
                    </div>
                    <div className="p-4 rounded-xl text-center break-inside-avoid" style={getPrintScoreStyle(keywordScore).box}>
                        <p className="text-sm text-center w-full" style={getPrintScoreStyle(keywordScore).title}>Keyword Match</p>
                        <p className="text-3xl mt-1" style={getPrintScoreStyle(keywordScore).text}>{keywordScore}</p>
                    </div>
                    <div className="p-4 rounded-xl text-center break-inside-avoid" style={getPrintScoreStyle(readabilityScore).box}>
                        <p className="text-sm text-center w-full" style={getPrintScoreStyle(readabilityScore).title}>Readability</p>
                        <p className="text-3xl mt-1" style={getPrintScoreStyle(readabilityScore).text}>{readabilityScore}</p>
                    </div>
                    {/* Target Role Box (Fixed Blue) */}
                    <div className="p-4 rounded-xl text-center break-inside-avoid flex flex-col justify-center" style={{ backgroundColor: '#eff6ff', borderColor: '#bfdbfe', borderWidth: '1px' }}>
                        <p className="text-sm text-center w-full" style={{ color: '#1e3a8a', fontWeight: 'bold' }}>Target Role</p>
                        <p className="text-sm mt-2 leading-tight" style={{ color: '#4f46e5', fontWeight: '800' }}>{jobFit.targetRole}</p>
                    </div>
                </div>

                {/* Summary & Advice */}
                <div className="mb-8 mx-8 p-5 rounded-xl break-inside-avoid flex-shrink-0" style={{ backgroundColor: '#f5f3ff', borderColor: '#ddd6fe', borderWidth: '1px' }}>
                    <h3 className="text-lg mb-2" style={{ color: '#312e81', fontWeight: '800' }}>Executive Summary</h3>
                    <p className="font-medium text-sm leading-relaxed" style={{ color: '#334155' }}>{adviceText}</p>
                </div>

                {/* Feedback Detail */}
                <h2 className="text-2xl mb-5 mx-8 pb-2 flex-shrink-0" style={{ color: '#1e3a8a', fontWeight: '800', borderBottom: '2px solid #bfdbfe' }}>
                    Detailed Feedback Analysis
                </h2>
                
                <div className="px-8 pb-4 flex-grow"> 
                    {feedbackCategories.map((category) => {
                        if (!category.data) return null;
                        const catStyle = getPrintScoreStyle(category.data.score);

                        return (
                            <div key={`print-${category.id}`} className="mb-8 last:mb-0">
                                <div className="flex justify-between items-center p-3 rounded-lg mb-4 break-inside-avoid" style={catStyle.box}>
                                    <h3 className="text-lg" style={catStyle.title}>{category.title}</h3>
                                    <span className="px-2.5 py-1 rounded shadow-sm text-sm" style={catStyle.badge}>
                                        Score: {category.data.score}/100
                                    </span>
                                </div>
                                
                                <div className="space-y-4 px-2">
                                    {category.data.tips.map((tip: any, index: number) => {
                                        const isGood = tip.type === "good";
                                        return (
                                            <div key={`print-tip-${index}`} className="flex gap-4 text-sm pb-4 last:border-0 break-inside-avoid" style={{ borderBottom: '1px solid #f1f5f9' }}>
                                                <div className="mt-0.5 text-lg" style={{ color: isGood ? '#059669' : '#e11d48', fontWeight: 'bold' }}>
                                                    {isGood ? "✓" : "✗"}
                                                </div>
                                                <div>
                                                    <p className="text-base mb-1" style={{ color: isGood ? '#047857' : '#be123c', fontWeight: 'bold' }}>
                                                        {tip.tip}
                                                    </p>
                                                    <p className="font-medium leading-relaxed" style={{ color: '#334155' }}>
                                                        {tip.explanation}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* ✨ FOOTER: Didorong paksa ke bawah halaman dengan flex-grow dan mt-auto */}
                <div className="mt-auto w-full bg-white pt-8 pb-6 px-8 break-inside-avoid flex-shrink-0" style={{ borderTop: '2px solid #e2e8f0' }}>
                    <div className="flex justify-between items-center gap-4">
                        <div className="space-y-1.5 flex-[1.5]">
                            <div className="logo text-lg font-bold flex items-center gap-2" style={{ color: '#1e3a8a' }}>
                                <Sparkles className="w-4 h-4 text-indigo-500" />
                                <span>CVPilot<span className="text-indigo-500 font-medium mx-1">|</span>AIPowered</span>
                            </div>
                            <p className="text-[10px] font-medium" style={{ color: '#94a3b8' }}>
                                Strictly Confidential • © {new Date().getFullYear()} CVPilot. All rights reserved. • Data Generated is for professional development purposes only.
                            </p>
                        </div>
                        <div className="text-right text-[10px] space-y-0.5 shrink-0 font-medium" style={{ color: '#64748b' }}>
                            <p className="font-semibold" style={{ color: '#334155' }}>Report Generation Info:</p>
                            <p>{reportGeneratedAt}</p>
                            <p>Document ID: {id?.substring(0, 8) || "N/A"}</p>
                        </div>
                    </div>
                </div>

            </div>
        </>
    );
};

export default Resume;