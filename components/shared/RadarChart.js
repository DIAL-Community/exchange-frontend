import {
  Chart,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js'
import { Radar } from 'react-chartjs-2'

Chart.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
)

const RadarChart = ({ axes, values, title, maxScaleValue }) => {
  const radarData = {
    labels: axes,
    datasets: [
      {
        label: title,
        data: values,
        backgroundColor: 'rgba(63, 158, 221, 0.2)',
        borderColor: 'rgba(63, 158, 221, 1)',
        borderWidth: 1,
      },
    ],
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
            size: 16
          },
          color: '#46465a',
          padding: 10
        },
        beginAtZero: true
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: false
      }
    }
  }

  return <Radar data={radarData} options={radarOptions} />
}

export default RadarChart
