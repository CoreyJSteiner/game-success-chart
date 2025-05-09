import { useRef, useEffect, useState } from 'react'
import Chart from 'chart.js/auto'
import ButtonMain from './ButtonMain'

const ChartDisplay = ({ currentData, toggleInputsDisplay }) => {
  const { labels, datasets } = currentData
  const [groups, setGroups] = useState([])
  const [yAxisLock, setYAxisLock] = useState(true)
  const [chartMounted, setChartMounted] = useState(false)
  const loadingRef = useRef(false)
  const canvasRef = useRef(null)
  const chartRef = useRef(null)

  useEffect(() => {
    if (!datasets) return
    if (loadingRef.current) return
    loadingRef.current = true

    const uniqueGroups = new Set()

    datasets.forEach(dataset => {
      if (dataset.group) {
        uniqueGroups.add(dataset.group)
      }
    })

    setGroups(Array.from(uniqueGroups))

    if (chartRef.current) {
      chartRef.current.destroy()
    }

    const ctx = canvasRef.current.getContext('2d')
    chartRef.current = new Chart(ctx, {
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
            max: yAxisLock ? 1 : undefined,
            ticks: {
              color: '#ffffff',
              font: {
                family: 'Arial, sans-serif',
                size: 12
              },
              stepSize: 0.1,
              callback: value => `${(value * 100).toFixed(0)}%`
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
                  0
                )}%`
            }
          }
        }
      }
    })

    loadingRef.current = false
    setChartMounted(true)

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy()
      }
    }
  }, [datasets])

  const toggleGroup = group => {
    const chart = chartRef.current
    chart.data.datasets.forEach((dataset, index) => {
      if (dataset.group === group) {
        const meta = chart.getDatasetMeta(index)
        meta.hidden = !meta.hidden
      }
    })
    chart.update()
  }

  const toggleYAxisLock = () => {
    const chart = chartRef.current
    if (!chart) return

    const invertedToggleValue = !yAxisLock
    chart.options.scales.y.max = invertedToggleValue ? 1 : undefined
    chart.update()
    setYAxisLock(invertedToggleValue)
  }

  return (
    <div id='chart-container'>
      {chartMounted && (
        <div id='chart-top'>
          <div id='group-button-container'>
            {groups.map(group => (
              <ButtonMain
                key={group + Date.now()}
                label={group}
                handleClick={() => toggleGroup(group)}
              />
            ))}
          </div>
          <ButtonMain
            label={yAxisLock ? 'Unlock Y Axis' : 'Lock Y Axis'}
            handleClick={toggleYAxisLock}
          ></ButtonMain>
        </div>
      )}
      <canvas ref={canvasRef} />
      {chartMounted && (
        <button
          id='button-show-inputs'
          onClick={() => {
            toggleInputsDisplay()
          }}
        >
          Show Inputs
        </button>
      )}
    </div>
  )
}

export default ChartDisplay
