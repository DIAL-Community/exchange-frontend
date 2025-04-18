import { BarElement, CategoryScale, Chart, LinearScale } from 'chart.js'
import { Bar } from 'react-chartjs-2'

Chart.register(
  CategoryScale,
  LinearScale,
  BarElement
)

const BarChart = ({ labels, values, maxScaleValue, horizontal = false, fontSize = 16 }) => {
  const chartData = {
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

  const chartOptions = {
    maintainAspectRatio: false,
    scale: {
      max: maxScaleValue,
      font: {
        size: fontSize
      },
      color: '#46465a'
    },
    indexAxis: horizontal && 'y'
  }

  return <Bar data={chartData} options={chartOptions} />
}

export default BarChart
