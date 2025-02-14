import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import 'chart.js/auto'

const Doughnut = dynamic(() => import('react-chartjs-2').then((mod) => mod.Doughnut), {
  ssr: false,
})

type CircleProps = {
  data: Array<{ name: string; value: number; color: string }>
}

const Circle = ({ data }: CircleProps) => {
  const [chartData, setChartData] = useState<{
    labels: string[]
    datasets: { data: number[]; backgroundColor: string[] }[]
  } | null>(null)

  useEffect(() => {
    if (data) {
      const labels = data.map((d) => d.name)
      const values = data.map((d) => d.value)
      const colors = data.map((d) => d.color)

      const newChartData = {
        labels: labels,
        datasets: [
          {
            data: values,
            backgroundColor: colors,
          },
        ],
      }

      setChartData(newChartData)
    }
  }, [data])

  const options = {
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const label = context.label || ''
            const value = context.parsed || 0
            return `${label}: ${value}`
          },
        },
      },
    },
  }

  return (
    <div style={{ margin: '20px 0px', height: '200px' }}>
      {chartData && <Doughnut data={chartData} options={options} />}
    </div>
  )
}

export default Circle
