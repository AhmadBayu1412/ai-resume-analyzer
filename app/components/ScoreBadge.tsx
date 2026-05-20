// Interface di TypeScript dipakai untuk mendefinisikan bentuk data/object.
// Komponen ScoreBadge HARUS menerima props bernama score dan tipenya number.
interface ScoreBadgeProps {
    score: number
}

// Ini adalah Functional Component React yang memakai props dengan bentuk ScoreBadgeProps
/*ScoreBadge adalah React Function Component
yang menerima props:
{
   score:number
}*/
const ScoreBadge: React.FC<ScoreBadgeProps> = ({score}) => {
    let badgeColor = ''
    let badgeText = ''

    if (score > 70) {
        badgeColor = 'bg-badge-green text-green-600'
        badgeText = 'Strong'
    } else if (score > 49) {
        badgeColor = 'bg-badge-yellow text-yellow-600'
        badgeText = 'Good Start'
    } else {
        badgeColor = 'bg-badge-red text-red-600'
        badgeText = 'Needs Work'
    }

    return (
        <div className={`px-3 py-1 rounded-full ${badgeColor}`}>
            <p className="text-sm font-medium">{badgeText}</p>
        </div>
    )
}

export default ScoreBadge