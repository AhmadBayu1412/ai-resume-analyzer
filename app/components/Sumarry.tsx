import ScoreBadge from "./ScoreBadge"
import ScoreGauge from "./ScoreGauge"

const Category = ({title, score}: {title: string, score: number}) => {
    const titleColor = score > 70 ? 'text-green-600'
        : score > 49
        ? 'text-yellow-600' : 'text-red-600'

    return (
        <div className="resume-summary">
            <div className="category">
                <div className="flex flex-row gap-2 items-center justify-center">
                    <p className="text-2xl">{title}</p>
                    <ScoreBadge score={score}/>
                </div>
                <p className="text-2xl">
                    <span className="{textColor}">{score}</span>/100
                </p>
            </div>
        </div>
    )
}

const Summary = ({feedback} : {feedback: any}) => {
    return (
        <div className="glass-panel p-4 sm:p-8 w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Ubah flex layout menjadi kolom di layar sempit agar tidak kegencet */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-3 sm:gap-6 mb-6 sm:mb-8 pb-4 sm:pb-6 border-b border-gray-100">
                <div className="flex-shrink-0 scale-90 sm:scale-100">
                    <ScoreGauge score={feedback.overallScore} />
                </div>
                <div className="flex flex-col gap-1 sm:gap-2 justify-center h-full mt-1 sm:mt-0">
                    <h2 className="text-xl sm:text-3xl font-bold text-gradient leading-tight">Resume Performance</h2>
                    <p className="text-xs sm:text-base text-gray-500 max-w-md">
                        Skor ini dihitung berdasarkan metrik struktur, konten, dan gaya bahasa di bawah ini.
                    </p>
                </div>
            </div>

            <div className="flex flex-col gap-1">
                <Category title="Tone & Style" score={feedback.toneAndStyle.score}/>
                <Category title="Content" score={feedback.content.score}/>
                <Category title="Structure" score={feedback.structure.score}/>
                <Category title="Skills" score={feedback.skills.score}/>
            </div>
        </div>
    )
}

export default Summary