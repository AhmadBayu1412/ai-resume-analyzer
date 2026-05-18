import Navbar from "~/components/Navbar";
import type { Route } from "./+types/home";
import { resumes } from "../../constants";
import ResumeCard from "~/components/ResumeCard";
import { usePuterStore } from "~/lib/puter";
import { useNavigate } from "react-router";
import { useEffect } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resumind" },
    { name: "description", content: "Smart feedback for your dream job!" },
  ];
}

// Menampilkan landing page utama
export default function Home() { 
    const {auth} = usePuterStore()
    const navigate = useNavigate()

    useEffect(() => {
        if(!auth.isAuthenticated) navigate('/auth?next=/')
    }, [auth.isAuthenticated])

  // return itu kayak monitor, yg ngak masuk ngak akan tampil
  return <main className="bg-[url('/images/bg-main.svg')] bg-cover"> 
  
  {/* Panggil component. < /> itu expression, kalo tidak dihitung akan dibuang hasilnya */}
  <Navbar />

    <section className="main-section"> 
      <div className="page-heading py-16">
        <h1>Track Your Applications & Resume Ratings</h1>
        <h2>Review your submissions and check AI-powered feedback.</h2>
      </div> 

      {/* Masuk mode javascript {} */}
      {resumes.length > 0 && (
        <div className="resumes-section">
          {/* {} artinya masuk ke mode JavaScript didalam div yg adalah jsx*/}
          {resumes.map((resume) => (
            // @ts-ignore: ResumeCard props type mismatch from external component
            <ResumeCard key={resume.id} resume={resume} />
          ))}
        </div>
      )}

    </section>
  </main>
}
