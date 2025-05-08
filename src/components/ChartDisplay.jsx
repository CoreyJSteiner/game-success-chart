import { useRef, useEffect, useState } from 'react'
import Chart from 'chart.js/auto'
import ButtonMain from './ButtonMain'

const ChartDisplay = ({ currentData }) => {
  const [groups, setGroups] = useState([])
  const [yAxisLock, setYAxisLock] = useState(true)
  const chartRef = useRef(null)
  const chartInstanceRef = useRef(null)
  const { labels, datasets } = currentData

  useEffect(() => {
    if (!datasets) return
    const uniqueGroups = new Set()

    datasets.forEach(dataset => {
      if (dataset.group) {
        uniqueGroups.add(dataset.group)
      }
    })

    setGroups(Array.from(uniqueGroups))

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy()
    }

    const ctx = chartRef.current.getContext('2d')
    chartInstanceRef.current = new Chart(ctx, {
      type: 'line',
      data: { labels, datasets },
      options: {
        scales: {
          y: {
            title: {
              display: true,
              text: 'Probability (%)',
              color: '#ffffff',
              font: {
                family: 'Arial, sans-serif',
                size: 14,
                weight: 'regular'
              }
            },
            beginAtZero: true,
            max: 1,
            ticks: {
              color: '#ffffff',
              font: {
                family: 'Arial, sans-serif',
                size: 12
              },
              callback: value => `${(value * 100).toFixed(1)}%`
            },
            grid: {
              color: 'rgba(255,255,255,0.1)'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Number of Successes',
              color: '#ffffff',
              font: {
                family: 'Arial, sans-serif',
                size: 14,
                weight: 'bold'
              }
            },
            type: 'linear',
            ticks: {
              color: '#ffffff',
              font: {
                family: 'Arial, sans-serif',
                size: 12
              },
              stepSize: 1
            },
            grid: {
              color: 'rgba(255,255,255,0.1)'
            }
          }
        },
        plugins: {
          legend: {
            labels: {
              color: '#ffffff',
              font: {
                family: 'Arial, sans-serif',
                size: 12
              }
            }
          },
          tooltip: {
            backgroundColor: 'rgba(0,0,0,0.7)',
            bodyColor: '#ffffff',
            titleColor: '#ffffff',
            bodyFont: {
              family: 'Arial, sans-serif',
              size: 12
            },
            titleFont: {
              family: 'Arial, sans-serif',
              size: 14,
              weight: 'bold'
            },
            callbacks: {
              label: context =>
                `${context.dataset.label}: ${(context.parsed.y * 100).toFixed(
                  1
                )}%`
            }
          }
        }
      }
    })

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy()
      }
    }
  }, [datasets])

  const toggleGroup = group => {
    const chart = chartInstanceRef.current
    chart.data.datasets.forEach((dataset, index) => {
      if (dataset.group === group) {
        const meta = chart.getDatasetMeta(index)
        meta.hidden = !meta.hidden
      }
    })
    chart.update()
  }

  const toggleYAxisLock = () => {
    const chart = chartInstanceRef.current
    if (!chart) return

    const invertedToggleValue = !yAxisLock
    chart.options.scales.y.max = invertedToggleValue ? 1 : undefined
    chart.update()

    setYAxisLock(invertedToggleValue)
  }

  return (
    <div id='chart-container'>
      <div id='chart-top'>
        <div id='group-button-container'>
          {groups.map(group => (
            <ButtonMain
              key={crypto.randomUUID()}
              label={group}
              handleClick={() => toggleGroup(group)}
            />
          ))}
        </div>
        <ButtonMain
          label='Lock Y Axis'
          handleClick={toggleYAxisLock}
        ></ButtonMain>
      </div>
      <canvas ref={chartRef} />
    </div>
  )
}

export default ChartDisplay
