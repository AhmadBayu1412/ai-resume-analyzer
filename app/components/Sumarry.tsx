import ScoreBadge from "./ScoreBadge"
import ScoreGauge from "./ScoreGauge"

const Category = ({title, score}: {title: string, score: number}) => {
    const titleColor = score > 70 ? 'text-green-500'
        : score > 49 ? 'text-yellow-500' : 'text-red-500'

    return (
        <div className="flex justify-between items-center py-4 border-b border-[#2A2A40] last:border-0 hover:bg-white/[0.02] px-4 rounded-lg transition-colors">
            <div className="flex items-center gap-4">
                <p className="text-lg font-medium text-gray-200">{title}</p>
                <ScoreBadge score={score}/>
            </div>
            <p className="text-xl font-bold text-white">
                <span className={titleColor}>{score}</span>
                <span className="text-gray-500 text-sm font-normal ml-1">/100</span>
            </p>
        </div>
    )
}

const Summary = ({feedback} : {feedback: any}) => {
    return (
        <div className="bg-[#151525] border border-[#2A2A40] rounded-2xl p-6 sm:p-8 w-full animate-in fade-in slide-in-from-bottom-4 duration-700 shadow-lg shadow-black/20">
            <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 sm:gap-6 mb-6 pb-6 border-b border-[#2A2A40]">
                <div className="flex-shrink-0 scale-90 sm:scale-100">
                    <ScoreGauge score={feedback.overallScore} />
                </div>
                <div className="flex flex-col gap-2 justify-center h-full mt-2 sm:mt-4">
                    <h2 className="text-xl sm:text-2xl font-bold text-white leading-tight">Resume Performance</h2>
                    <p className="text-xs sm:text-sm text-gray-400 max-w-md">
                        This score is calculated based on the structure, content, and style metrics below.
                    </p>
                </div>
            </div>

            <div className="flex flex-col">
                <Category title="Tone & Style" score={feedback.toneAndStyle.score}/>
                <Category title="Content" score={feedback.content.score}/>
                <Category title="Structure" score={feedback.structure.score}/>
                <Category title="Skills" score={feedback.skills.score}/>
            </div>
        </div>
    )
}

export default Summary