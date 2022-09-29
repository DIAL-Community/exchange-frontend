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

const RadarChart = ({ axes, values, title }) => {

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
    scale: {
      ticks: {
        min: 0,
        max: 4,
        stepSize: 3,
        showLabelBackdrop: false,
        backdropColor: 'rgba(203, 197, 11, 1)'
      },
      angleLines: {
        color: 'rgba(255, 255, 255, .3)',
        lineWidth: 5
      },
      gridLines: {
        color: 'rgba(255, 255, 255, .3)',
        circular: true
      }
    }
  }

  return <Radar data={radarData} options={radarOptions} />
}

export default RadarChart
