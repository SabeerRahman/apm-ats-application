import { getScoreClass } from '../../utils/helpers'

const ScoreBadge = ({ score }) => (
  <span className={`score-badge ${getScoreClass(score)}`}>
    <span className="score-ring" />
    {score}%
  </span>
)

export default ScoreBadge
