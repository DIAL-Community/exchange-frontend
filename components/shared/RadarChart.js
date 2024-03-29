import {
  Chart,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler
} from 'chart.js'
import { Radar } from 'react-chartjs-2'

Chart.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler
)

const RadarChart = ({ labels, values, maxScaleValue, fontSize = 16 }) => {
  const radarData = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: 'rgba(63, 158, 221, 0.2)',
        borderColor: 'rgba(63, 158, 221, 1)',
        borderWidth: 1
      }
    ]
  }

  const radarOptions = {
    maintainAspectRatio: false,
    scale: {
      max: maxScaleValue
    },
    scales: {
      r: {
        pointLabels: {
          font: {
            size: fontSize
          },
          color: '#46465a',
          padding: 10
        },
        beginAtZero: true
      }
    }
  }

  return <Radar data={radarData} options={radarOptions} />
}

export default RadarChart
