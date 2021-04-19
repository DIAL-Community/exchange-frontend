const IndicatorScores = ({indicator}) => {
  return (<div>{indicator.name}</div>)
}

const MaturityCategory = ({ category }) => {
  return (
    <>
    <div>{category.name}</div>
    { category.indicator_scores.map((indicator) => {
      return (<IndicatorScores indicator={indicator} />)
    })}
    </>
  )
}

export default MaturityCategory
